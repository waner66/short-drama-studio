'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';

// ==================== Types ====================

export interface WorldNode {
  id: string;
  name: string;
  type: 'character' | 'scene' | 'event';
  x: number;
  y: number;
  color?: string;
  avatar?: string;
  description?: string;
  tags?: string[];
  timeline?: number; // scene order / time position (0-100)
}

export interface WorldEdge {
  id: string;
  from: string;
  to: string;
  type: string; // 恋爱/敌对/朋友/师生/亲人/竞争对手/暗恋/合作/利用/出场/发生
  color?: string;
}

export type ViewMode = 'constellation' | 'focus' | 'list';

interface WorldviewCanvasProps {
  nodes: WorldNode[];
  edges: WorldEdge[];
  onNodeClick?: (node: WorldNode) => void;
  onNodeDoubleClick?: (node: WorldNode) => void;
  onEdgeClick?: (edge: WorldEdge) => void;
  onCanvasDoubleClick?: (x: number, y: number) => void;
  className?: string;
  width?: number;
  height?: number;
}

// ==================== Constants ====================

const RELATION_COLORS: Record<string, string> = {
  '恋爱': '#ec4899',
  '敌对': '#ef4444',
  '朋友': '#3b82f6',
  '师生': '#8b5cf6',
  '亲人': '#f59e0b',
  '竞争对手': '#f97316',
  '暗恋': '#f472b6',
  '合作': '#22c55e',
  '利用': '#9ca3af',
  '出场': '#06b6d4',
  '发生': '#a855f7',
};

const NODE_COLORS: Record<string, string> = {
  character: '#8b5cf6',
  scene: '#06b6d4',
  event: '#f59e0b',
};

const NODE_SHAPES: Record<string, (ctx: CanvasRenderingContext2D, x: number, y: number, r: number) => void> = {
  character: (ctx, x, y, r) => {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  },
  scene: (ctx, x, y, r) => {
    const s = r * 1.15;
    ctx.beginPath();
    ctx.moveTo(x, y - s);
    ctx.lineTo(x + s * 0.7, y);
    ctx.lineTo(x, y + s);
    ctx.lineTo(x - s * 0.7, y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  },
  event: (ctx, x, y, r) => {
    const s = r * 0.9;
    ctx.beginPath();
    ctx.rect(x - s, y - s * 0.6, s * 2, s * 1.2);
    ctx.fill();
    ctx.stroke();
  },
};

const RELATION_LABELS = [
  '恋爱', '敌对', '朋友', '师生', '亲人', '竞争对手', '暗恋', '合作', '利用', '出场', '发生',
];

// ==================== Component ====================

export default function WorldviewCanvas({
  nodes,
  edges,
  onNodeClick,
  onNodeDoubleClick,
  onEdgeClick,
  onCanvasDoubleClick,
  className = '',
  width: propWidth,
  height: propHeight,
}: WorldviewCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('constellation');
  const [focusNodeId, setFocusNodeId] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<WorldNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [canvasSize, setCanvasSize] = useState({ w: 900, h: 600 });
  const [filterType, setFilterType] = useState<string>('all');
  const [timelineValue, setTimelineValue] = useState(100);
  const [legendCollapsed, setLegendCollapsed] = useState(false);

  // Interaction state
  const stateRef = useRef({
    panX: 0,
    panY: 0,
    scale: 1,
    isPanning: false,
    panStartX: 0,
    panStartY: 0,
    dragNode: null as string | null,
    dragOffsetX: 0,
    dragOffsetY: 0,
    lastClick: 0,
    particles: [] as { t: number; x: number; y: number; color: string }[],
    frameCount: 0,
  });

  // Initialize positions for new nodes
  // Supports both relative coords (0-1) and absolute pixel coords
  const nodesWithPos = nodes.map((n, i) => ({
    ...n,
    x: n.x !== undefined
      ? (n.x <= 1 ? n.x * canvasSize.w : n.x)
      : 200 + (i % 5) * 140 + Math.random() * 40,
    y: n.y !== undefined
      ? (n.y <= 1 ? n.y * canvasSize.h : n.y)
      : 120 + Math.floor(i / 5) * 130 + Math.random() * 30,
  }));

  // Resize handler
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const resize = () => {
      const w = propWidth || container.clientWidth;
      const h = propHeight || container.clientHeight || 500;
      setCanvasSize({ w, h });
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(container);
    return () => observer.disconnect();
  }, [propWidth, propHeight]);

  // Auto-calculate initial scale to fit all nodes
  useEffect(() => {
    if (canvasSize.w < 100 || nodesWithPos.length < 2) return;
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    nodesWithPos.forEach((n) => {
      if (n.x < minX) minX = n.x;
      if (n.y < minY) minY = n.y;
      if (n.x > maxX) maxX = n.x;
      if (n.y > maxY) maxY = n.y;
    });
    const bboxW = maxX - minX + 100; // padding
    const bboxH = maxY - minY + 100;
    if (bboxW <= 0 || bboxH <= 0) return;
    const fitScale = Math.min(canvasSize.w / bboxW, canvasSize.h / bboxH) * 0.85;
    stateRef.current.scale = Math.max(0.3, Math.min(1.5, fitScale));
  }, [canvasSize, nodesWithPos]);

  // Main render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const state = stateRef.current;

    const render = () => {
      state.frameCount++;
      ctx.clearRect(0, 0, canvasSize.w, canvasSize.h);

      const centerX = canvasSize.w / 2 + state.panX;
      const centerY = canvasSize.h / 2 + state.panY;

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.scale(state.scale, state.scale);
      ctx.translate(-canvasSize.w / 2, -canvasSize.h / 2);

      // Grid (subtle)
      const gridSize = 60;
      ctx.strokeStyle = 'rgba(255,255,255,0.02)';
      ctx.lineWidth = 0.5;
      for (let x = 0; x < canvasSize.w; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvasSize.h);
        ctx.stroke();
      }
      for (let y = 0; y < canvasSize.h; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvasSize.w, y);
        ctx.stroke();
      }

      // Filter nodes
      const filtered = nodesWithPos.filter((n) => {
        if (filterType === 'all') return true;
        return n.type === filterType;
      });

      // Focus mode filtering
      const visibleNodes = viewMode === 'focus' && focusNodeId
        ? filtered.filter((n) => {
            if (n.id === focusNodeId) return true;
            return edges.some(
              (e) =>
                (e.from === focusNodeId && e.to === n.id) ||
                (e.to === focusNodeId && e.from === n.id)
            );
          })
        : filtered;

      const filteredEdges = edges.filter((e) => {
        const fromExists = visibleNodes.some((n) => n.id === e.from);
        const toExists = visibleNodes.some((n) => n.id === e.to);
        return fromExists && toExists;
      });

      // Draw edges
      filteredEdges.forEach((edge) => {
        const from = visibleNodes.find((n) => n.id === edge.from);
        const to = visibleNodes.find((n) => n.id === edge.to);
        if (!from || !to) return;

        const color = edge.color || RELATION_COLORS[edge.type] || '#8b5cf6';
        const isHovered =
          hoveredNode === edge.from || hoveredNode === edge.to;

        // Bezier control point
        const midX = (from.x + to.x) / 2;
        const midY = (from.y + to.y) / 2;
        const dx = to.x - from.x;
        const dy = to.y - from.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const curve = Math.min(dist * 0.2, 50);
        const cpX = midX - (dy / (dist || 1)) * curve;
        const cpY = midY + (dx / (dist || 1)) * curve;

        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.quadraticCurveTo(cpX, cpY, to.x, to.y);
        ctx.strokeStyle = color;
        ctx.lineWidth = isHovered ? 2 : 1;
        ctx.globalAlpha = isHovered ? 0.8 : 0.35;
        ctx.setLineDash([6, 4]);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.globalAlpha = 1;

        // Flowing particle
        const t = ((state.frameCount * 0.02) % 1 + (Math.random() * 0.01)) % 1;
        const px = from.x + (to.x - from.x) * t + (cpX - midX) * 4 * t * (1 - t);
        const py = from.y + (to.y - from.y) * t + (cpY - midY) * 4 * t * (1 - t);
        ctx.beginPath();
        ctx.arc(px, py, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.globalAlpha = isHovered ? 0.9 : 0.4;
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      // Draw nodes
      visibleNodes.forEach((node) => {
        const color = node.color || NODE_COLORS[node.type] || '#8b5cf6';
        const isHovered = hoveredNode === node.id;
        const isSelected = selectedNode?.id === node.id;
        const r = isHovered ? 26 : isSelected ? 25 : 22;

        // Pulse ring
        if (isHovered || isSelected) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, r + 6 + Math.sin(state.frameCount * 0.08) * 3, 0, Math.PI * 2);
          ctx.strokeStyle = color;
          ctx.lineWidth = 1;
          ctx.globalAlpha = 0.3;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }

        // Shape
        const drawShape = NODE_SHAPES[node.type] || NODE_SHAPES.character;
        ctx.fillStyle = color + '22';
        ctx.strokeStyle = color;
        ctx.lineWidth = isHovered || isSelected ? 2.5 : 1.5;
        ctx.shadowColor = isHovered || isSelected ? color : 'transparent';
        ctx.shadowBlur = isHovered ? 20 : isSelected ? 12 : 0;
        drawShape(ctx, node.x, node.y, r);
        ctx.shadowBlur = 0;

        // Initial text
        ctx.fillStyle = color;
        ctx.font = `${isHovered ? 'bold ' : ''}12px "Inter", "Noto Sans SC", sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(node.name.slice(0, 2), node.x, node.y);

        // Name label
        ctx.fillStyle = 'var(--text-secondary)';
        ctx.font = '10px "Inter", "Noto Sans SC", sans-serif';
        ctx.fillText(node.name, node.x, node.y + r + 12);

        // Type tag
        const typeLabels: Record<string, string> = {
          character: '角色',
          scene: '场景',
          event: '事件',
        };
        ctx.fillStyle = color + '99';
        ctx.font = '8px "Inter", "Noto Sans SC", sans-serif';
        ctx.fillText(
          typeLabels[node.type] || node.type,
          node.x,
          node.y + r + 23
        );
      });

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [nodesWithPos, edges, viewMode, focusNodeId, selectedNode, hoveredNode, filterType, canvasSize]);

  // Mouse handlers
  const getCanvasCoords = useCallback(
    (clientX: number, clientY: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return { x: 0, y: 0 };
      const rect = canvas.getBoundingClientRect();
      const state = stateRef.current;
      const centerX = canvasSize.w / 2 + state.panX;
      const centerY = canvasSize.h / 2 + state.panY;
      const rawX = clientX - rect.left;
      const rawY = clientY - rect.top;
      const x = (rawX - centerX) / state.scale + canvasSize.w / 2;
      const y = (rawY - centerY) / state.scale + canvasSize.h / 2;
      return { x, y };
    },
    [canvasSize]
  );

  const hitTest = useCallback(
    (cx: number, cy: number): WorldNode | null => {
      const filtered = nodesWithPos.filter((n) =>
        filterType === 'all' ? true : n.type === filterType
      );
      for (let i = filtered.length - 1; i >= 0; i--) {
        const n = filtered[i];
        const dx = n.x - cx;
        const dy = n.y - cy;
        if (Math.sqrt(dx * dx + dy * dy) < 28) return n;
      }
      return null;
    },
    [nodesWithPos, filterType]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      const { x, y } = getCanvasCoords(e.clientX, e.clientY);
      const hit = hitTest(x, y);
      const state = stateRef.current;

      if (hit) {
        // Start dragging node
        state.dragNode = hit.id;
        state.dragOffsetX = hit.x - x;
        state.dragOffsetY = hit.y - y;
      } else {
        // Start panning canvas
        state.isPanning = true;
        state.panStartX = e.clientX - state.panX;
        state.panStartY = e.clientY - state.panY;
      }
    },
    [getCanvasCoords, hitTest]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const state = stateRef.current;
      const { x, y } = getCanvasCoords(e.clientX, e.clientY);

      if (state.dragNode) {
        // Update node position (mutable for perf)
        const node = nodesWithPos.find((n) => n.id === state.dragNode);
        if (node) {
          node.x = x + state.dragOffsetX;
          node.y = y + state.dragOffsetY;
        }
      } else if (state.isPanning) {
        state.panX = e.clientX - state.panStartX;
        state.panY = e.clientY - state.panStartY;
      } else {
        const hit = hitTest(x, y);
        setHoveredNode(hit ? hit.id : null);
      }
    },
    [getCanvasCoords, hitTest, nodesWithPos]
  );

  const handleMouseUp = useCallback(
    (e: React.MouseEvent) => {
      const state = stateRef.current;
      if (state.dragNode) {
        state.dragNode = null;
      }
      state.isPanning = false;
    },
    []
  );

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      const { x, y } = getCanvasCoords(e.clientX, e.clientY);
      const hit = hitTest(x, y);
      if (hit) {
        setSelectedNode(hit);
        onNodeClick?.(hit);
      } else {
        setSelectedNode(null);
      }
    },
    [getCanvasCoords, hitTest, onNodeClick]
  );

  const handleDoubleClick = useCallback(
    (e: React.MouseEvent) => {
      const { x, y } = getCanvasCoords(e.clientX, e.clientY);
      const hit = hitTest(x, y);
      if (hit) {
        onNodeDoubleClick?.(hit);
      } else {
        onCanvasDoubleClick?.(x, y);
      }
    },
    [getCanvasCoords, hitTest, onNodeDoubleClick, onCanvasDoubleClick]
  );

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      const state = stateRef.current;
      const delta = e.deltaY > 0 ? -0.08 : 0.08;
      state.scale = Math.max(0.2, Math.min(3, state.scale + delta));
    },
    []
  );

  // Focus mode character selector
  const focusFilteredNodes = nodesWithPos.filter((n) =>
    viewMode === 'focus' && focusNodeId
      ? n.id === focusNodeId ||
        edges.some(
          (e) =>
            (e.from === focusNodeId && e.to === n.id) ||
            (e.to === focusNodeId && e.from === n.id)
        )
      : true
  );

  return (
    <div className={`flex flex-col ${className}`}>
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-subtle bg-surface-card">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-primary">世界观</span>
          <span className="text-xs text-muted">
            {nodes.length} 节点 &middot; {edges.length} 连线
          </span>
        </div>
        <div className="flex items-center gap-1">
          {/* View mode buttons */}
          {[
            { mode: 'constellation' as ViewMode, icon: '⭐', label: '星座图' },
            { mode: 'focus' as ViewMode, icon: '🎯', label: '焦点' },
            { mode: 'list' as ViewMode, icon: '📋', label: '列表' },
          ].map(({ mode, icon, label }) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`
                px-3 py-1.5 text-xs rounded-md transition-all
                ${
                  viewMode === mode
                    ? 'bg-brand-500/20 text-brand-400 border border-brand-500/30'
                    : 'text-muted hover:text-secondary hover:bg-surface-elevated border border-transparent'
                }
              `}
            >
              {icon} {label}
            </button>
          ))}
          <div className="w-px h-5 bg-border-subtle mx-1" />
          {/* Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-surface-elevated border border-border-subtle rounded-md px-2 py-1.5 text-xs text-secondary outline-none focus:border-brand-400"
          >
            <option value="all">全部类型</option>
            <option value="character">角色</option>
            <option value="scene">场景</option>
            <option value="event">事件</option>
          </select>
        </div>
      </div>

      {/* Focus mode selector */}
      {viewMode === 'focus' && (
        <div className="px-4 py-2 bg-surface-elevated border-b border-subtle flex items-center gap-2 flex-wrap">
          <span className="text-xs text-muted">聚焦角色：</span>
          {nodesWithPos
            .filter((n) => n.type === 'character')
            .map((n) => (
              <button
                key={n.id}
                onClick={() => setFocusNodeId(focusNodeId === n.id ? null : n.id)}
                className={`px-2.5 py-1 text-xs rounded-full border transition-all ${
                  focusNodeId === n.id
                    ? 'bg-brand-500/20 border-brand-500/40 text-brand-400'
                    : 'border-transparent text-muted hover:text-secondary hover:bg-surface-card'
                }`}
              >
                {n.name}
              </button>
            ))}
        </div>
      )}

      {/* Main area: Canvas + Side panel — responsive */}
      <div className="flex flex-col lg:flex-row flex-1" style={{ minHeight: 0 }}>
        {/* List mode */}
        {viewMode === 'list' ? (
          <div className="flex-1 p-4 overflow-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted text-xs border-b border-subtle">
                  <th className="pb-2 font-medium">类型</th>
                  <th className="pb-2 font-medium">名称</th>
                  <th className="pb-2 font-medium">标签</th>
                  <th className="pb-2 font-medium">描述</th>
                </tr>
              </thead>
              <tbody>
                {nodesWithPos
                  .filter((n) => filterType === 'all' || n.type === filterType)
                  .map((n) => (
                    <tr
                      key={n.id}
                      onClick={() => {
                        setSelectedNode(n);
                        onNodeClick?.(n);
                      }}
                      className={`
                        border-b border-subtle/50 cursor-pointer hover:bg-surface-elevated transition-colors
                        ${selectedNode?.id === n.id ? 'bg-brand-500/10' : ''}
                      `}
                    >
                      <td className="py-2">
                        <span
                          className="inline-block w-2 h-2 rounded-full mr-1.5 align-middle"
                          style={{ background: n.color || NODE_COLORS[n.type] }}
                        />
                        <span className="text-xs text-muted">
                          {{ character: '角色', scene: '场景', event: '事件' }[n.type]}
                        </span>
                      </td>
                      <td className="py-2 text-primary font-medium">{n.name}</td>
                      <td className="py-2">
                        {n.tags?.slice(0, 3).map((t) => (
                          <span
                            key={t}
                            className="inline-block px-1.5 py-0.5 text-[10px] bg-surface-elevated rounded mr-1 text-muted"
                          >
                            {t}
                          </span>
                        ))}
                      </td>
                      <td className="py-2 text-muted text-xs max-w-[200px] truncate">
                        {n.description || '-'}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        ) : (
          <>
            {/* Canvas */}
            <div ref={containerRef} className="flex-1 relative" style={{ minHeight: '400px', touchAction: 'none' }}>
              <canvas
                ref={canvasRef}
                width={canvasSize.w}
                height={canvasSize.h}
                className="absolute inset-0 cursor-grab active:cursor-grabbing"
                style={{ touchAction: 'none' }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onClick={handleClick}
                onDoubleClick={handleDoubleClick}
                onWheel={handleWheel}
              />
              {/* Zoom indicator */}
              <div className="absolute bottom-3 right-3 bg-surface-card/80 backdrop-blur px-2 py-1 rounded text-xs text-muted border border-border-subtle">
                {Math.round(stateRef.current.scale * 100)}%
              </div>
            </div>

            {/* Legend panel — responsive: below canvas on mobile, side on desktop */}
            <div className="w-full lg:w-64 lg:border-l border-t lg:border-t-0 border-subtle bg-surface-card overflow-auto flex-shrink-0">
              {/* Mobile collapse toggle */}
              <button
                onClick={() => setLegendCollapsed(!legendCollapsed)}
                className="lg:hidden w-full px-3 py-2 flex items-center justify-between text-xs text-secondary hover:text-primary bg-surface-card"
              >
                <span>图例 {legendCollapsed ? '▶' : '▼'}</span>
                {selectedNode && <span className="text-brand-400">· 已选中: {selectedNode.name}</span>}
              </button>

              <div className={legendCollapsed ? 'hidden lg:block' : ''}>
                {/* Legend */}
                <div className="p-3 border-b border-subtle">
                  <div className="text-xs font-semibold text-primary mb-2">关系图例</div>
                  <div className="flex lg:flex-col gap-2 lg:gap-0 flex-wrap lg:space-y-1">
                    {RELATION_LABELS.slice(0, 9).map((label) => (
                      <div key={label} className="flex items-center gap-1.5 text-xs text-muted">
                        <span
                          className="inline-block w-3 h-0.5 rounded-full"
                          style={{ background: RELATION_COLORS[label] }}
                        />
                        {label}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Node type legend */}
                <div className="p-3 border-b border-subtle">
                  <div className="text-xs font-semibold text-primary mb-2">节点类型</div>
                  <div className="flex lg:flex-col gap-2 lg:gap-0 flex-wrap lg:space-y-1.5">
                    {Object.entries(NODE_COLORS).map(([type, color]) => (
                      <div key={type} className="flex items-center gap-2 text-xs text-muted">
                        <span
                          className="inline-block w-2.5 h-2.5 rounded-full"
                          style={{ background: color }}
                        />
                        {{ character: '角色', scene: '场景', event: '事件' }[type]}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Selected node details */}
                {selectedNode && (
                  <div className="p-3">
                    <div className="text-xs font-semibold text-primary mb-2">节点详情</div>
                    <div className="surface-card border border-subtle rounded-lg p-3">
                      <div
                        className="text-sm font-semibold mb-1"
                        style={{ color: selectedNode.color || NODE_COLORS[selectedNode.type] }}
                      >
                        {selectedNode.name}
                      </div>
                      <div className="text-[10px] text-muted mb-2">
                        {{ character: '角色', scene: '场景', event: '事件' }[selectedNode.type]}
                        {selectedNode.timeline !== undefined && ` · 时间: ${selectedNode.timeline}%`}
                      </div>
                      {selectedNode.tags && selectedNode.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {selectedNode.tags.map((t) => (
                            <span
                              key={t}
                              className="px-1.5 py-0.5 text-[10px] bg-surface-elevated rounded text-muted"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                      {selectedNode.description && (
                        <div className="text-xs text-secondary leading-relaxed">
                          {selectedNode.description}
                        </div>
                      )}
                      {/* Related edges */}
                      <div className="mt-2 pt-2 border-t border-subtle">
                        <div className="text-[10px] text-muted mb-1">关联关系</div>
                        {edges
                          .filter(
                            (e) => e.from === selectedNode.id || e.to === selectedNode.id
                          )
                          .slice(0, 5)
                          .map((e) => {
                            const otherId =
                              e.from === selectedNode.id ? e.to : e.from;
                            const other = nodes.find((n) => n.id === otherId);
                            const color = e.color || RELATION_COLORS[e.type] || '#8b5cf6';
                            return (
                              <div
                                key={e.id}
                                className="text-xs text-muted flex items-center gap-1.5 cursor-pointer hover:text-secondary"
                                onClick={() => onEdgeClick?.(e)}
                              >
                                <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
                                {e.type} → {other?.name || otherId}
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Timeline slider (bottom) */}
      <div className="px-4 py-2 border-t border-subtle bg-surface-card flex items-center gap-3">
        <span className="text-xs text-muted whitespace-nowrap">时间轴</span>
        <input
          type="range"
          min="0"
          max="100"
          value={timelineValue}
          onChange={(e) => setTimelineValue(Number(e.target.value))}
          className="flex-1 h-1.5 appearance-none bg-surface-elevated rounded-full outline-none cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5
            [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-brand-500
            [&::-webkit-slider-thumb]:shadow-[0_0_8px_var(--brand-500)]"
          style={{ accentColor: 'var(--brand-500)' }}
        />
        <span className="text-xs text-muted w-10 text-right">{timelineValue}%</span>
      </div>
    </div>
  );
}
