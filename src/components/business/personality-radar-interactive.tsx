'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

export interface PersonalityValues {
  extraversion: number;    // 外倾性 1-5
  agreeableness: number;   // 宜人性 1-5
  conscientiousness: number; // 尽责性 1-5
  neuroticism: number;     // 情绪稳定性 1-5
  openness: number;        // 开放性 1-5
}

interface PersonalityRadarInteractiveProps {
  value: PersonalityValues;
  onChange: (values: PersonalityValues) => void;
  size?: number;
}

const LABELS = ['外倾性', '宜人性', '尽责性', '情绪稳定', '开放性'];
const KEYS: (keyof PersonalityValues)[] = ['extraversion', 'agreeableness', 'conscientiousness', 'neuroticism', 'openness'];

// 五边形顶点坐标（半径计算）
function getPoint(cx: number, cy: number, radius: number, angle: number): [number, number] {
  const rad = (angle - 90) * (Math.PI / 180);
  return [cx + radius * Math.cos(rad), cy + radius * Math.sin(rad)];
}

// 配色
const STROKE_COLORS = ['#f97316', '#06b6d4', '#8b5cf6', '#22c55e', '#f43f5e'];
const FILL_COLORS = ['rgba(249,115,22,0.12)', 'rgba(6,182,212,0.12)', 'rgba(139,92,246,0.12)', 'rgba(34,197,94,0.12)', 'rgba(244,63,94,0.12)'];

export default function PersonalityRadarInteractive({ value, onChange, size = 280 }: PersonalityRadarInteractiveProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dragging, setDragging] = useState<number | null>(null);
  const cx = size / 2;
  const cy = size * 0.48;
  const maxR = size * 0.35;
  const angles = [270, 342, 54, 126, 198]; // 五边形顶点角度

  const clamp = (v: number) => Math.max(1, Math.min(5, Math.round(v * 10) / 10));

  // 从 value 获取各轴数值
  const values = KEYS.map(k => value[k]);

  // 计算数据点
  const dataPoints = values.map((v, i) => {
    const r = (v / 5) * maxR;
    return getPoint(cx, cy, r, angles[i]);
  });

  // 鼠标/触摸事件处理
  const getScaledValue = useCallback((clientX: number, clientY: number): [number, number] | null => {
    if (!svgRef.current) return null;
    const rect = svgRef.current.getBoundingClientRect();
    const scaleX = size / rect.width;
    const scaleY = size / rect.height;
    const svgX = (clientX - rect.left) * scaleX;
    const svgY = (clientY - rect.top) * scaleY;
    return [svgX, svgY];
  }, [size]);

  const findNearestAxis = useCallback((x: number, y: number): number | null => {
    let minDist = Infinity;
    let nearestIdx: number | null = null;

    for (let i = 0; i < 5; i++) {
      for (let r = 0; r <= maxR; r += 3) {
        const [px, py] = getPoint(cx, cy, r, angles[i]);
        const dist = Math.sqrt((x - px) ** 2 + (y - py) ** 2);
        if (dist < minDist) {
          minDist = dist;
          nearestIdx = i;
        }
      }
    }
    return minDist < 25 ? nearestIdx : null;
  }, [cx, cy, maxR, angles]);

  const handlePointerDown = (e: React.PointerEvent) => {
    const scaled = getScaledValue(e.clientX, e.clientY);
    if (!scaled) return;
    const idx = findNearestAxis(scaled[0], scaled[1]);
    if (idx !== null) {
      setDragging(idx);
      (e.target as Element).setPointerCapture?.(e.pointerId);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (dragging === null) return;
    const scaled = getScaledValue(e.clientX, e.clientY);
    if (!scaled) return;
    const dist = Math.sqrt((scaled[0] - cx) ** 2 + (scaled[1] - cy) ** 2);
    const newVal = clamp((dist / maxR) * 5);
    const newValues: PersonalityValues = { ...value, [KEYS[dragging]]: newVal };
    onChange(newValues);
  };

  const handlePointerUp = () => setDragging(null);

  // 数据点路径
  const dataPath = dataPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0]},${p[1]}`).join(' ') + 'Z';

  return (
    <div className="flex flex-col items-center">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${size} ${size}`}
        className="w-full max-w-[300px] touch-none cursor-pointer"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        {/* 背景网格 */}
        {[0.2, 0.4, 0.6, 0.8, 1.0].map((scale, i) => {
          const pts = angles.map(a => getPoint(cx, cy, maxR * scale, a));
          const path = pts.map((p, j) => `${j === 0 ? 'M' : 'L'}${p[0]},${p[1]}`).join(' ') + 'Z';
          return (
            <path key={i} d={path} fill="none" stroke="white" strokeOpacity={0.06} />
          );
        })}

        {/* 轴线 */}
        {angles.map((a, i) => {
          const [x, y] = getPoint(cx, cy, maxR, a);
          return (
            <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="white" strokeOpacity={0.08} />
          );
        })}

        {/* 数据面 */}
        <path d={dataPath} fill="rgba(139,92,246,0.15)" stroke="#8b5cf6" strokeWidth="1.5" strokeOpacity="0.6" />

        {/* 数据点 */}
        {dataPoints.map(([x, y], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r="7" fill={STROKE_COLORS[i]} fillOpacity={dragging === i ? 0.4 : 0.15} />
            <circle cx={x} cy={y} r={dragging === i ? 4.5 : 3} fill={STROKE_COLORS[i]} />
          </g>
        ))}

        {/* 标签 */}
        {angles.map((a, i) => {
          const labelR = maxR + 28;
          const [x, y] = getPoint(cx, cy, labelR, a);
          return (
            <text key={i} x={x} y={y} textAnchor="middle" dominantBaseline="middle"
              fill={STROKE_COLORS[i]} fontSize="11" fontWeight="500" fontFamily="system-ui">
              {LABELS[i]}
            </text>
          );
        })}

        {/* 分值标签 */}
        {dataPoints.map(([x, y], i) => (
          <text key={`val-${i}`} x={x} y={y - 14} textAnchor="middle"
            fill="white" fontSize="10" fontWeight="600" fontFamily="system-ui"
            opacity={dragging === i ? 1 : 0.6}>
            {values[i].toFixed(1)}
          </text>
        ))}

        {/* 提示文字 */}
        <text x={cx} y={cy - 3} textAnchor="middle" fill="white" fillOpacity="0.2" fontSize="10" fontFamily="system-ui">
          拖拽调参
        </text>
      </svg>

      {/* 数值显示 */}
      <div className="flex gap-2 mt-2 flex-wrap justify-center">
        {KEYS.map((k, i) => (
          <span key={k} className="text-xs px-2 py-0.5 rounded-full"
            style={{ backgroundColor: FILL_COLORS[i], color: STROKE_COLORS[i], border: `1px solid ${STROKE_COLORS[i]}40` }}>
            {LABELS[i]} {value[k].toFixed(1)}
          </span>
        ))}
      </div>
    </div>
  );
}
