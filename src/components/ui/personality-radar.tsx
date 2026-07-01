'use client';

interface PersonalityRadarProps {
  dimensions: {
    extraversion: number;
    agreeableness: number;
    conscientiousness: number;
    neuroticism: number;
    openness: number;
  };
  onChange?: (dim: string, value: number) => void;
  editable?: boolean;
  size?: number;
  className?: string;
}

const LABELS: Record<string, string> = {
  extraversion: '外倾性',
  agreeableness: '宜人性',
  conscientiousness: '尽责性',
  neuroticism: '情绪稳定',
  openness: '开放性',
};

const POSITIONS = [
  { angle: -Math.PI / 2, dim: 'extraversion' },   // top
  { angle: -Math.PI / 2 + 2.094, dim: 'agreeableness' }, // right-top
  { angle: -Math.PI / 2 + 4.188, dim: 'conscientiousness' }, // right-bottom
  { angle: -Math.PI / 2 + 6.282, dim: 'neuroticism' }, // bottom
  { angle: -Math.PI / 2 + 8.376, dim: 'openness' }, // left-top
];

export default function PersonalityRadar({
  dimensions, onChange, editable = false, size = 200, className = '',
}: PersonalityRadarProps) {
  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.35;

  const levels = [1, 2, 3, 4, 5];

  const getPoint = (angle: number, value: number) => {
    const r = (radius * value) / 5;
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
    };
  };

  const dataPoints = POSITIONS.map(p => ({
    ...p,
    value: (dimensions as Record<string, number>)[p.dim] || 3,
    ...getPoint(p.angle, (dimensions as Record<string, number>)[p.dim] || 3),
  }));

  const polygonPoints = dataPoints.map(p => `${p.x},${p.y}`).join(' ');

  const labelPoints = POSITIONS.map(p => ({
    ...p,
    ...getPoint(p.angle, 5.8),
  }));

  return (
    <div className={`inline-block ${className}`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
        {levels.map(level => {
          const pts = POSITIONS.map(p => {
            const pt = getPoint(p.angle, level);
            return `${pt.x},${pt.y}`;
          }).join(' ');
          return (
            <polygon key={level} points={pts} fill="none"
              stroke="var(--color-border-tertiary, #e0e0f0)" strokeWidth="0.5" />
          );
        })}

        {POSITIONS.map(p => (
          <line key={p.dim} x1={cx} y1={cy} x2={getPoint(p.angle, 5).x} y2={getPoint(p.angle, 5).y}
            stroke="var(--color-border-tertiary, #e0e0f0)" strokeWidth="0.5" />
        ))}

        <polygon points={polygonPoints}
          fill="rgba(91,46,255,0.15)" stroke="#5b2eff" strokeWidth="1.5" />

        {dataPoints.map(p => (
          <circle key={p.dim} cx={p.x} cy={p.y} r="4" fill="#5b2eff" stroke="white" strokeWidth="1.5" />
        ))}

        {labelPoints.map(p => (
          <text key={p.dim} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="central"
            className="text-xs" fill="var(--color-text-secondary, #5a5a7a)" fontSize="11">{LABELS[p.dim]}</text>
        ))}
      </svg>
    </div>
  );
}
