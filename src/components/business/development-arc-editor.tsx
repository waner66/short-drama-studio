'use client';

import { useState } from 'react';

export interface ArcNode {
  id: string;
  label: string;
  description: string;
  tension: number;
  mood: string;
}

interface DevelopmentArcEditorProps {
  value: ArcNode[];
  onChange: (nodes: ArcNode[]) => void;
}

export const DEFAULT_NODES: ArcNode[] = [
  { id: '1', label: '起点', description: '角色在故事开始时的状态', tension: 3, mood: '平静' },
  { id: '2', label: '转折', description: '改变命运的关键事件', tension: 7, mood: '冲突' },
  { id: '3', label: '低谷', description: '最黑暗的时刻', tension: 9, mood: '绝望' },
  { id: '4', label: '觉醒', description: '顿悟或转变', tension: 8, mood: '决心' },
  { id: '5', label: '终点', description: '蜕变后的新状态', tension: 5, mood: '释然' },
];

const MOOD_COLORS: Record<string, { bg: string; stroke: string; text: string }> = {
  '平静': { bg: '#3b82f620', stroke: '#3b82f6', text: '#3b82f6' },
  '冲突': { bg: '#f9731620', stroke: '#f97316', text: '#f97316' },
  '绝望': { bg: '#ef444420', stroke: '#ef4444', text: '#ef4444' },
  '决心': { bg: '#22c55e20', stroke: '#22c55e', text: '#22c55e' },
  '释然': { bg: '#a855f720', stroke: '#a855f7', text: '#a855f7' },
  '喜悦': { bg: '#fbbf2420', stroke: '#fbbf24', text: '#fbbf24' },
  '恐惧': { bg: '#64748b20', stroke: '#64748b', text: '#64748b' },
  '愤怒': { bg: '#dc262620', stroke: '#dc2626', text: '#dc2626' },
};

const MOODS = ['平静', '冲突', '绝望', '决心', '释然', '喜悦', '恐惧', '愤怒'];

export default function DevelopmentArcEditor({ value, onChange }: DevelopmentArcEditorProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const nodes = value.length > 0 ? value : DEFAULT_NODES;

  const updateNode = (id: string, partial: Partial<ArcNode>) => {
    onChange(nodes.map(n => n.id === id ? { ...n, ...partial } : n));
  };

  const addNode = (afterId: string) => {
    const idx = nodes.findIndex(n => n.id === afterId);
    const newNode: ArcNode = {
      id: String(Date.now()),
      label: '新节点',
      description: '',
      tension: 5,
      mood: '平静',
    };
    const newNodes = [...nodes];
    newNodes.splice(idx + 1, 0, newNode);
    onChange(newNodes);
  };

  const removeNode = (id: string) => {
    if (nodes.length <= 2) return;
    onChange(nodes.filter(n => n.id !== id));
  };

  const tensionPath = useTensionPath(nodes);

  return (
    <div className="space-y-5">
      {/* 张力曲线预览 */}
      <div className="relative h-32 bg-white/[0.02] rounded-xl border border-white/5 overflow-hidden">
        <svg viewBox="0 0 600 128" className="w-full h-full" preserveAspectRatio="none">
          {/* 网格 */}
          {[1,2,3,4].map(i => (
            <line key={i} x1="0" y1={i * 25.6} x2="600" y2={i * 25.6} stroke="white" strokeOpacity="0.03" />
          ))}
          <line x1="0" y1="10" x2="600" y2="10" stroke="white" strokeOpacity="0.06" strokeWidth="1" />
          <line x1="0" y1="118" x2="600" y2="118" stroke="white" strokeOpacity="0.06" strokeWidth="1" />

          {/* 填充区域 */}
          <path d={tensionPath + ' L600 128 L0 128 Z'} fill="rgba(139,92,246,0.08)" />

          {/* 曲线 */}
          <path d={tensionPath} fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" />
          <path d={tensionPath} fill="none" stroke="#a78bfa" strokeWidth="4" strokeOpacity="0.2" strokeLinecap="round" />

          {/* 节点 */}
          {nodes.map((node, i) => {
            const x = 40 + (i / Math.max(nodes.length - 1, 1)) * 520;
            const y = 118 - (node.tension / 10) * 108;
            const mc = MOOD_COLORS[node.mood] || MOOD_COLORS['平静'];
            return (
              <g key={node.id}>
                <circle cx={x} cy={y} r="6" fill={mc.bg} stroke={mc.stroke} strokeWidth="2" />
                <circle cx={x} cy={y} r="2.5" fill={mc.stroke} />
                <text x={x} y={y - 12} textAnchor="middle" fill="white" fontSize="10" fontWeight="500" fontFamily="system-ui">
                  {node.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* 时间线节点 */}
      <div className="relative">
        {/* 连接线 */}
        <div className="absolute top-5 left-0 right-0 h-px bg-white/10" />

        <div className="flex items-start gap-2 overflow-x-auto pb-2">
          {nodes.map((node, i) => {
            const mc = MOOD_COLORS[node.mood] || MOOD_COLORS['平静'];
            const isEditing = editingId === node.id;

            return (
              <div key={node.id} className="flex-shrink-0 flex flex-col items-center gap-2" style={{ minWidth: '100px' }}>
                {/* 节点圆点 */}
                <button
                  onClick={() => setEditingId(isEditing ? null : node.id)}
                  className="relative z-10 w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all hover:scale-110"
                  style={{
                    backgroundColor: mc.bg,
                    border: `2px solid ${mc.stroke}`,
                    color: mc.text,
                    boxShadow: isEditing ? `0 0 16px ${mc.stroke}40` : 'none',
                  }}
                >
                  {i + 1}
                </button>

                {/* 节点标签 */}
                <input
                  value={node.label}
                  onChange={(e) => updateNode(node.id, { label: e.target.value })}
                  className="text-xs font-medium text-center text-gray-300 bg-transparent border-none outline-none w-16"
                  placeholder="节点名"
                />

                {/* 张力值 */}
                <div className="flex items-center gap-1">
                  <input
                    type="range"
                    min="0" max="10" step="1"
                    value={node.tension}
                    onChange={(e) => updateNode(node.id, { tension: Number(e.target.value) })}
                    className="w-16 h-1 accent-purple-500"
                  />
                  <span className="text-[10px] text-gray-500 w-4">{node.tension}</span>
                </div>

                {/* 添加/删除按钮 */}
                <div className="flex gap-1 mt-1">
                  <button
                    onClick={() => addNode(node.id)}
                    className="w-5 h-5 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 text-[10px] flex items-center justify-center transition-colors"
                    title="添加节点"
                  >+</button>
                  {nodes.length > 2 && (
                    <button
                      onClick={() => removeNode(node.id)}
                      className="w-5 h-5 rounded-full bg-red-500/5 hover:bg-red-500/15 text-red-400 text-[10px] flex items-center justify-center transition-colors"
                      title="删除节点"
                    >×</button>
                  )}
                </div>

                {/* 编辑面板 */}
                {isEditing && (
                  <div className="w-full bg-white/[0.03] border border-white/10 rounded-lg p-2 space-y-2">
                    <input
                      value={node.description}
                      onChange={(e) => updateNode(node.id, { description: e.target.value })}
                      placeholder="节点描述..."
                      className="w-full bg-white/5 border border-white/10 rounded text-white text-xs px-2 py-1 focus:outline-none focus:border-white/20"
                    />
                    <div className="flex flex-wrap gap-1">
                      {MOODS.map((m) => (
                        <button
                          key={m}
                          onClick={() => updateNode(node.id, { mood: m })}
                          className={`text-[10px] px-1.5 py-0.5 rounded transition-all ${
                            node.mood === m
                              ? 'text-white ring-1'
                              : 'text-gray-500 bg-white/5 hover:text-gray-300'
                          }`}
                          style={node.mood === m ? {
                            backgroundColor: `${(MOOD_COLORS[m] || MOOD_COLORS['平静']).stroke}30`,
                          } : {}}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// 使用贝塞尔曲线计算张力路径
function useTensionPath(nodes: ArcNode[]): string {
  const width = 600;
  const height = 128;
  const padding = 40;

  if (nodes.length === 0) return '';
  if (nodes.length === 1) {
    const x = padding;
    const y = height - 10 - (nodes[0].tension / 10) * (height - 20);
    return `M${x},${y}`;
  }

  const points = nodes.map((node, i) => {
    const x = padding + (i / Math.max(nodes.length - 1, 1)) * (width - padding * 2);
    const y = height - 10 - (node.tension / 10) * (height - 20);
    return [x, y];
  });

  let path = `M${points[0][0]},${points[0][1]}`;

  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const cp1x = prev[0] + (curr[0] - prev[0]) / 3;
    const cp1y = prev[1];
    const cp2x = curr[0] - (curr[0] - prev[0]) / 3;
    const cp2y = curr[1];
    path += ` C${cp1x},${cp1y} ${cp2x},${cp2y} ${curr[0]},${curr[1]}`;
  }

  return path;
}
