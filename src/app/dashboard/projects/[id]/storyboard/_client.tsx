'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import PageHeader from '@/components/ui/page-header';
import GlassCard from '@/components/ui/glass-card';
import GradientBtn from '@/components/ui/gradient-btn';
import StatCard from '@/components/ui/stat-card';
import AiGeneratePanel from '@/components/business/ai-generate-panel';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcut';

interface Storyboard {
  id: string;
  sceneNumber: number;
  shotNumber: number;
  shotType: 'WIDE' | 'MEDIUM' | 'CLOSE_UP' | 'EXTREME_CLOSE' | 'POV' | 'ESTABLISHING' | 'TWO_SHOT' | 'OVER_SHOULDER';
  description: string;
  dialogue?: string;
  duration: number;
  cameraMovement?: string;
  lighting?: string;
  status: 'DRAFT' | 'COMPLETED';
  thumbnail?: string;
  aiGenStatus?: 'idle' | 'loading' | 'done' | 'error';
}

const SHOT_TYPES: Record<string, { label: string; icon: string; color: string }> = {
  WIDE: { label: '远景', icon: '\u26F0\uFE0F', color: 'text-blue-400 bg-blue-500/20' },
  MEDIUM: { label: '中景', icon: '\uD83C\uDFAD', color: 'text-green-400 bg-green-500/20' },
  CLOSE_UP: { label: '特写', icon: '\uD83D\uDC41\uFE0F', color: 'text-purple-400 bg-purple-500/20' },
  EXTREME_CLOSE: { label: '大特写', icon: '\uD83D\uDD0D', color: 'text-pink-400 bg-pink-500/20' },
  POV: { label: '主观', icon: '\uD83D\uDC40', color: 'text-yellow-400 bg-yellow-500/20' },
  ESTABLISHING: { label: '定场', icon: '\uD83C\uDFD9\uFE0F', color: 'text-cyan-400 bg-cyan-500/20' },
  TWO_SHOT: { label: '双人中景', icon: '\uD83D\uDC65', color: 'text-orange-400 bg-orange-500/20' },
  OVER_SHOULDER: { label: '过肩', icon: '\uD83D\uDD04', color: 'text-red-400 bg-red-500/20' },
};

const mockStoryboards: Storyboard[] = [
  { id: 'sb1', sceneNumber: 1, shotNumber: 1, shotType: 'ESTABLISHING', description: '苏氏集团大厦外景，仰拍视角，玻璃幕墙反射午后的阳光', duration: 5, cameraMovement: '静态上升', lighting: '自然光', status: 'COMPLETED', aiGenStatus: 'idle' },
  { id: 'sb2', sceneNumber: 1, shotNumber: 2, shotType: 'MEDIUM', description: '总裁办公室内，苏晚晴站在落地窗前接电话，表情严肃', dialogue: '就这点手段，也想扳倒我？', duration: 8, cameraMovement: '缓慢推近', lighting: '侧逆光', status: 'COMPLETED', aiGenStatus: 'idle' },
  { id: 'sb3', sceneNumber: 1, shotNumber: 3, shotType: 'CLOSE_UP', description: '苏晚晴放下手机的特写，手指微微用力', duration: 3, cameraMovement: '静态', lighting: '面光', status: 'COMPLETED', aiGenStatus: 'idle' },
  { id: 'sb4', sceneNumber: 2, shotNumber: 1, shotType: 'WIDE', description: '城市夜景高架桥，红色跑车飞驰而过，后方有车追踪', duration: 6, cameraMovement: '跟拍', lighting: '夜景灯光', status: 'COMPLETED', aiGenStatus: 'idle' },
  { id: 'sb5', sceneNumber: 2, shotNumber: 2, shotType: 'CLOSE_UP', description: '苏晚晴紧握方向盘，后视镜中看到追踪车辆逼近', duration: 4, cameraMovement: '抖动', lighting: '车内暗光', status: 'COMPLETED', aiGenStatus: 'idle' },
  { id: 'sb6', sceneNumber: 2, shotNumber: 3, shotType: 'EXTREME_CLOSE', description: '碰撞瞬间，苏晚晴眼中的恐惧被一道白光吞没', duration: 2, cameraMovement: '抖动转静止', lighting: '高光爆破', status: 'COMPLETED', aiGenStatus: 'idle' },
  { id: 'sb7', sceneNumber: 2, shotNumber: 4, shotType: 'WIDE', description: '白光散去，镜头从高空俯瞰古代江南水乡全景', duration: 5, cameraMovement: '航拍下降', lighting: '金色晨光', status: 'COMPLETED', aiGenStatus: 'idle' },
  { id: 'sb8', sceneNumber: 2, shotNumber: 5, shotType: 'MEDIUM', description: '苏晚晴在古色古香的房间醒来，环顾四周，满脸迷茫', duration: 6, cameraMovement: '缓慢环绕', lighting: '柔光', status: 'COMPLETED', aiGenStatus: 'idle' },
  { id: 'sb9', sceneNumber: 3, shotNumber: 1, shotType: 'ESTABLISHING', description: '古色古香的江南商行外景，"苏氏商行"牌匾醒目', duration: 4, cameraMovement: '缓慢推进', lighting: '上午日光', status: 'DRAFT', aiGenStatus: 'idle' },
  { id: 'sb10', sceneNumber: 3, shotNumber: 2, shotType: 'MEDIUM', description: '苏晚晴站在商行柜台前，周围全是疑惑的伙计和客人', duration: 6, cameraMovement: '中景推近', lighting: '室内自然光', status: 'DRAFT', aiGenStatus: 'idle' },
];

function groupByScene(boards: Storyboard[]): { sceneNumber: number; boards: Storyboard[] }[] {
  const map = new Map<number, Storyboard[]>();
  boards.forEach((b) => {
    const existing = map.get(b.sceneNumber) || [];
    existing.push(b);
    map.set(b.sceneNumber, existing);
  });
  return Array.from(map.entries()).map(([sceneNumber, boards]) => ({ sceneNumber, boards }));
}

export default function StoryboardClient() {
  const { id } = useParams<{ id: string }>();
  const [boards, setBoards] = useState(mockStoryboards);
  const [showAi, setShowAi] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Storyboard>>({});
  const [dragOver, setDragOver] = useState<string | null>(null);
  const [selectedScene, setSelectedScene] = useState(1);

  // Keyboard shortcuts
  useKeyboardShortcuts([
    {
      key: 's', ctrl: true,
      handler: () => { if (editingId) saveEdit(editingId); },
      description: '保存当前编辑',
    },
    {
      key: 'Escape',
      handler: () => { if (editingId) setEditingId(null); },
      description: '取消编辑',
    },
  ]);

  const completedCount = boards.filter((b) => b.status === 'COMPLETED').length;
  const totalDuration = boards.reduce((sum, b) => sum + b.duration, 0);
  const aiGeneratedCount = boards.filter((b) => b.aiGenStatus === 'done').length;

  const startEdit = (sb: Storyboard) => {
    setEditingId(sb.id);
    setEditForm({ description: sb.description, dialogue: sb.dialogue || '', shotType: sb.shotType, duration: sb.duration });
  };

  const saveEdit = (sbId: string) => {
    setBoards((prev) =>
      prev.map((b) => (b.id === sbId ? { ...b, ...editForm, status: 'COMPLETED' as const } : b))
    );
    setEditingId(null);
  };

  const handleDrop = useCallback(
    (targetId: string) => {
      if (!dragOver || dragOver === targetId) { setDragOver(null); return; }
      setBoards((prev) => {
        const list = [...prev];
        const dragIdx = list.findIndex((b) => b.id === dragOver);
        const targetIdx = list.findIndex((b) => b.id === targetId);
        if (dragIdx < 0 || targetIdx < 0) return prev;
        const [item] = list.splice(dragIdx, 1);
        list.splice(targetIdx, 0, item);
        return list;
      });
      setDragOver(null);
    },
    [dragOver]
  );

  // 单帧AI生图
  const handleShotAiGen = (sbId: string) => {
    setBoards((prev) =>
      prev.map((b) => (b.id === sbId ? { ...b, aiGenStatus: 'loading' } : b))
    );

    const sb = boards.find((b) => b.id === sbId);
    if (!sb) return;

    setTimeout(() => {
      setBoards((prev) =>
        prev.map((b) =>
          b.id === sbId
            ? { ...b, aiGenStatus: 'done', thumbnail: 'https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=400&h=225&fit=crop' }
            : b
        )
      );
    }, 2000);
  };

  const sceneNumbers = [...new Set(boards.map((b) => b.sceneNumber))].sort();
  const filtered = boards.filter((b) => b.sceneNumber === selectedScene);

  return (
    <div>
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
        <Link href="/dashboard/projects" className="hover:text-white transition-colors">项目</Link>
        <span>/</span>
        <Link href={`/dashboard/projects/${id}`} className="hover:text-white transition-colors">穿越之我在古代当总裁</Link>
        <span>/</span>
        <span className="text-white">分镜</span>
      </div>

      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <PageHeader title="分镜编辑器" />
        <div className="flex items-center gap-2">
          <GradientBtn onClick={() => setShowAi(!showAi)}>
            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            AI 批量生成
          </GradientBtn>
        </div>
      </div>

      {showAi && (
        <div className="mb-6">
          <AiGeneratePanel
            type="storyboard"
            title="AI 分镜生成器"
            description="根据场景描述自动生成分镜脚本"
            onGenerate={(prompt) => { console.log('AI storyboard:', prompt); setShowAi(false); }}
          />
        </div>
      )}

      {/* 统计 + 场景筛选 */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        <StatCard title="总镜头" value={String(boards.length)} accent="cyan" />
        <StatCard title="已完成" value={`${completedCount}/${boards.length}`} accent="green" />
        <StatCard title="总时长" value={`${totalDuration}秒`} accent="purple" />
        <StatCard title="AI生图" value={`${aiGeneratedCount}帧`} accent="amber" />
      </div>

      {/* 场景筛选 */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {sceneNumbers.map((sn) => (
          <button
            key={sn}
            onClick={() => setSelectedScene(sn)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              selectedScene === sn
                ? 'bg-[#5b2eff] text-white shadow-lg shadow-[#5b2eff]/20'
                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            <span className="w-5 h-5 rounded bg-white/20 flex items-center justify-center text-xs">{sn}</span>
            场景{sn}
          </button>
        ))}
      </div>

      {/* 分镜时间轴 */}
      <div className="space-y-2">
        {filtered.map((sb) => {
          const st = SHOT_TYPES[sb.shotType] || SHOT_TYPES.MEDIUM;
          const isEditing = editingId === sb.id;
          const isGenLoading = sb.aiGenStatus === 'loading';
          const isGenDone = sb.aiGenStatus === 'done';

          return (
            <div
              key={sb.id}
              draggable={!isEditing}
              onDragStart={() => setDragOver(sb.id)}
              onDragOver={(e) => { e.preventDefault(); }}
              onDrop={() => handleDrop(sb.id)}
              className={`relative transition-all ${
                dragOver === sb.id ? 'opacity-50' : ''
              } ${sb.status === 'COMPLETED' ? 'border-l-2 border-[#00d4aa]' : 'border-l-2 border-transparent'}`}
            >
              <GlassCard hover={!isEditing} className="overflow-hidden">
                {!isEditing ? (
                  <div>
                    <div className="flex items-center gap-4">
                      {/* 拖拽把手 */}
                      <div className="cursor-grab active:cursor-grabbing text-gray-600 hover:text-gray-400 transition-colors flex-shrink-0">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M7 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
                        </svg>
                      </div>

                      {/* 序号 */}
                      <div className="flex items-center gap-2 flex-shrink-0 w-20">
                        <span className="text-xs text-gray-600">S{sb.sceneNumber}</span>
                        <span className="text-lg font-bold text-white">#{sb.shotNumber}</span>
                      </div>

                      {/* 镜头类型 */}
                      <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs ${st.color} flex-shrink-0 w-24 justify-center`}>
                        <span>{st.icon}</span>
                        <span>{st.label}</span>
                      </div>

                      {/* 描述 */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-300 truncate">{sb.description}</p>
                        {sb.cameraMovement && (
                          <p className="text-xs text-gray-600 mt-0.5">运镜: {sb.cameraMovement} · 光: {sb.lighting}</p>
                        )}
                        {sb.dialogue && (
                          <p className="text-xs text-[#5b2eff] mt-0.5 truncate">&ldquo;{sb.dialogue}&rdquo;</p>
                        )}
                      </div>

                      {/* 时长 */}
                      <div className="text-xs text-gray-500 flex-shrink-0 w-16 text-right">
                        <span className="font-mono">{sb.duration}s</span>
                      </div>

                      {/* AI 生图按钮 */}
                      <div className="flex-shrink-0">
                        {isGenLoading ? (
                          <span className="flex items-center gap-1 text-xs text-purple-400 animate-pulse">
                            <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            生成中
                          </span>
                        ) : (
                          <button
                            onClick={() => handleShotAiGen(sb.id)}
                            className={`flex items-center gap-1 text-xs px-2 py-1 rounded-lg transition-all ${
                              isGenDone
                                ? 'bg-[#00d4aa]/20 text-[#00d4aa]'
                                : 'text-gray-400 hover:text-purple-400 hover:bg-purple-500/10'
                            }`}
                            title={isGenDone ? '已生成' : 'AI生成画面'}
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            {isGenDone ? '已生成' : '生图'}
                          </button>
                        )}
                      </div>

                      {/* 状态 */}
                      <div className="flex-shrink-0 w-16 text-center">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          sb.status === 'COMPLETED'
                            ? 'bg-[#00d4aa]/20 text-[#00d4aa]'
                            : 'bg-gray-500/20 text-gray-400'
                        }`}>
                          {sb.status === 'COMPLETED' ? '完成' : '草稿'}
                        </span>
                      </div>

                      {/* 操作 */}
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button
                          onClick={() => startEdit(sb)}
                          className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors"
                          title="编辑"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors" title="删除">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* AI 生成缩略图预览 */}
                    {isGenDone && sb.thumbnail && (
                      <div className="mt-3 ml-12 overflow-hidden rounded-lg border border-white/10 max-w-xs">
                        <img src={sb.thumbnail} alt="AI生成画面" className="w-full h-auto object-cover" />
                      </div>
                    )}
                  </div>
                ) : (
                  /* 编辑模式 */
                  <div className="space-y-3">
                    <div className="flex items-center gap-4 mb-1">
                      <span className="text-sm text-gray-500">S{sb.sceneNumber} #{sb.shotNumber}</span>
                      <select
                        value={editForm.shotType}
                        onChange={(e) => setEditForm({ ...editForm, shotType: e.target.value as any })}
                        className="h-8 bg-white/5 border border-white/10 rounded-lg text-white px-2 text-xs focus:outline-none focus:border-[#5b2eff]"
                      >
                        {Object.entries(SHOT_TYPES).map(([key, val]) => (
                          <option key={key} value={key}>{val.icon} {val.label}</option>
                        ))}
                      </select>
                      <input
                        type="number"
                        min={1} max={60}
                        value={editForm.duration}
                        onChange={(e) => setEditForm({ ...editForm, duration: Number(e.target.value) })}
                        className="w-16 h-8 bg-white/5 border border-white/10 rounded-lg text-white px-2 text-xs text-center focus:outline-none focus:border-[#5b2eff]"
                      />
                      <span className="text-xs text-gray-500">秒</span>
                    </div>

                    <textarea
                      value={editForm.description}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      rows={2}
                      placeholder="分镜描述..."
                      className="w-full bg-white/5 border border-white/10 rounded-lg text-white px-3 py-2 text-sm focus:outline-none focus:border-[#5b2eff] resize-none"
                      autoFocus
                    />
                    <input
                      value={editForm.dialogue || ''}
                      onChange={(e) => setEditForm({ ...editForm, dialogue: e.target.value })}
                      placeholder="对白（可选）"
                      className="w-full h-8 bg-white/5 border border-white/10 rounded-lg text-white px-3 text-sm focus:outline-none focus:border-[#5b2eff]"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-3 py-1.5 text-sm text-gray-400 hover:text-white bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                      >取消</button>
                      <GradientBtn onClick={() => saveEdit(sb.id)}>保存</GradientBtn>
                    </div>
                  </div>
                )}
              </GlassCard>
            </div>
          );
        })}
      </div>

      {/* 添加分镜 */}
      <div className="mt-3">
        <GlassCard className="border-2 border-dashed border-white/10 hover:border-[#5b2eff]/30 cursor-pointer group text-center py-4">
          <div className="text-gray-500 group-hover:text-[#5b2eff] transition-colors">
            <svg className="w-6 h-6 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span className="text-sm">添加分镜</span>
          </div>
        </GlassCard>
      </div>

      {/* 底部信息 */}
      <div className="mt-4 flex items-center gap-2 text-xs text-gray-600">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        拖拽分镜可调整顺序 | 点击生图按钮用AI生成画面 | 场景间移动会自动重新编号
      </div>
    </div>
  );
}
