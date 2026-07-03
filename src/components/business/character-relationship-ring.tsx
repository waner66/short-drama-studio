'use client';

import React, { useRef, useEffect, useState } from 'react';

export interface CharNode {
  id: string;
  name: string;
  avatar?: string;
  role?: string; // 主角/反派/配角/路人
  color?: string;
}

export interface RelationEdge {
  from: string;
  to: string;
  type: string; // 恋爱/敌对/朋友/师生/亲人/竞争对手/暗恋/合作/利用
  color?: string;
}

interface CharacterRelationshipRingProps {
  characters: CharNode[];
  relations: RelationEdge[];
  size?: number;
  className?: string;
  onCharacterClick?: (char: CharNode) => void;
}

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
};

const DEFAULT_CHAR_COLORS = [
  '#8b5cf6', '#ec4899', '#3b82f6', '#f59e0b',
  '#22c55e', '#ef4444', '#06b6d4', '#f97316',
];

export default function CharacterRelationshipRing({
  characters,
  relations,
  size = 400,
  className = '',
  onCharacterClick,
}: CharacterRelationshipRingProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoveredChar, setHoveredChar] = useState<string | null>(null);
  const [selectedChar, setSelectedChar] = useState<string | null>(null);
  const [animProgress, setAnimProgress] = useState(0);

  const centerX = size / 2;
  const centerY = size / 2;
  const ringRadius = (size / 2) * 0.62;
  const nodeRadius = 28;

  // Entrance animation
  useEffect(() => {
    let start: number | null = null;
    const animate = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / 1200, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setAnimProgress(eased);
      if (p < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, []);

  const getNodePosition = (index: number, total: number) => {
    const angle = (2 * Math.PI * index) / total - Math.PI / 2;
    return {
      x: centerX + ringRadius * Math.cos(angle),
      y: centerY + ringRadius * Math.sin(angle),
    };
  };

  const getRelationColor = (type: string) => {
    return RELATION_COLORS[type] || '#8b5cf6';
  };

  // Build character position map
  const charPositions = new Map<string, { x: number; y: number; color: string }>();
  characters.forEach((char, i) => {
    const pos = getNodePosition(i, characters.length);
    charPositions.set(char.id, {
      ...pos,
      color: char.color || DEFAULT_CHAR_COLORS[i % DEFAULT_CHAR_COLORS.length],
    });
  });

  // Filter relations for existing characters
  const validRelations = relations.filter(
    (r) => charPositions.has(r.from) && charPositions.has(r.to)
  );

  return (
    <div className={`relative ${className}`}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${size} ${size}`}
        width={size}
        height={size}
        className="max-w-full"
      >
        <defs>
          {validRelations.map((rel, i) => {
            const color = rel.color || getRelationColor(rel.type);
            return (
              <linearGradient key={`grad-${i}`} id={`edgeGrad-${i}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={color} stopOpacity="0.5" />
                <stop offset="100%" stopColor={color} stopOpacity="0.8" />
              </linearGradient>
            );
          })}
          {/* Glow filter for selected/hovered */}
          <filter id="nodeGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Center ring */}
        <circle
          cx={centerX}
          cy={centerY}
          r={ringRadius * 0.25}
          fill="transparent"
          stroke="var(--border-subtle)"
          strokeWidth="1"
          strokeDasharray="4 4"
          opacity={0.4 * animProgress}
        />
        <circle
          cx={centerX}
          cy={centerY}
          r={ringRadius}
          fill="transparent"
          stroke="var(--border-subtle)"
          strokeWidth="1"
          strokeDasharray="3 6"
          opacity={0.25 * animProgress}
        />

        {/* Relation edges */}
        {validRelations.map((rel, i) => {
          const from = charPositions.get(rel.from);
          const to = charPositions.get(rel.to);
          if (!from || !to) return null;

          const isHighlighted =
            !hoveredChar || hoveredChar === rel.from || hoveredChar === rel.to;
          const isSelected =
            !selectedChar || selectedChar === rel.from || selectedChar === rel.to;
          const opacity = isHighlighted || isSelected ? 0.9 : 0.15;
          const color = rel.color || getRelationColor(rel.type);

          // Bezier control point (curve outward)
          const midX = (from.x + to.x) / 2;
          const midY = (from.y + to.y) / 2;
          const dx = to.x - from.x;
          const dy = to.y - from.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const curveOffset = Math.min(dist * 0.25, 60);
          const cpX = midX - (dy / dist) * curveOffset;
          const cpY = midY + (dx / dist) * curveOffset;

          return (
            <g key={`edge-${i}`}>
              <path
                d={`M ${from.x} ${from.y} Q ${cpX} ${cpY} ${to.x} ${to.y}`}
                fill="none"
                stroke={color}
                strokeWidth={isHighlighted ? 1.8 : 1}
                strokeDasharray="6 3"
                opacity={opacity * animProgress * 0.8}
                style={{ transition: 'opacity 0.3s ease, stroke-width 0.3s ease' }}
              />
              {/* Flowing particle */}
              <circle
                r="2.5"
                fill={color}
                opacity={opacity * animProgress}
                style={{ transition: 'opacity 0.3s ease' }}
              >
                <animateMotion
                  dur="3s"
                  repeatCount="indefinite"
                  path={`M ${from.x} ${from.y} Q ${cpX} ${cpY} ${to.x} ${to.y}`}
                />
              </circle>
              {/* Relation label */}
              <text
                x={cpX}
                y={cpY}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="10"
                fill={color}
                opacity={opacity * animProgress * 0.9}
                style={{
                  transition: 'opacity 0.3s ease',
                  pointerEvents: 'none',
                }}
              >
                {rel.type}
              </text>
            </g>
          );
        })}

        {/* Character nodes */}
        {characters.map((char, i) => {
          const pos = getNodePosition(i, characters.length);
          const charColor = char.color || DEFAULT_CHAR_COLORS[i % DEFAULT_CHAR_COLORS.length];
          const isHovered = hoveredChar === char.id;
          const isSelected = selectedChar === char.id;
          const isHighlighted = !hoveredChar || isHovered;
          const scale = isHovered ? 1.2 : isSelected ? 1.15 : 1;

          return (
            <g
              key={char.id}
              transform={`translate(${pos.x}, ${pos.y}) scale(${scale})`}
              style={{
                cursor: 'pointer',
                transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                opacity: (isHighlighted ? 1 : 0.3) * animProgress,
              }}
              onMouseEnter={() => setHoveredChar(char.id)}
              onMouseLeave={() => setHoveredChar(null)}
              onClick={() => {
                setSelectedChar(selectedChar === char.id ? null : char.id);
                onCharacterClick?.(char);
              }}
              filter={isHovered || isSelected ? 'url(#nodeGlow)' : undefined}
            >
              {/* Pulse ring */}
              {(isHovered || isSelected) && (
                <circle
                  r={nodeRadius + 4}
                  fill="none"
                  stroke={charColor}
                  strokeWidth="1.5"
                  opacity="0.4"
                >
                  <animate
                    attributeName="r"
                    from={nodeRadius + 4}
                    to={nodeRadius + 12}
                    dur="1.5s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    from="0.5"
                    to="0"
                    dur="1.5s"
                    repeatCount="indefinite"
                  />
                </circle>
              )}

              {/* Node circle */}
              <circle
                r={nodeRadius}
                fill={charColor + '22'}
                stroke={charColor}
                strokeWidth={isHovered || isSelected ? 2.5 : 1.5}
                style={{ transition: 'stroke-width 0.3s ease' }}
              />

              {/* Avatar or initial */}
              {char.avatar ? (
                <clipPath id={`avatar-clip-${char.id}`}>
                  <circle r={nodeRadius - 4} />
                </clipPath>
              ) : null}

              {char.avatar ? (
                <>
                  <circle r={nodeRadius - 4} fill={charColor + '30'} />
                  <text
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize="14"
                    fontWeight="bold"
                    fill={charColor}
                  >
                    {char.name[0]}
                  </text>
                </>
              ) : (
                <>
                  <circle r={nodeRadius - 4} fill={charColor + '18'} />
                  <text
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize="13"
                    fontWeight="600"
                    fill={charColor}
                  >
                    {char.name.slice(0, 2)}
                  </text>
                </>
              )}

              {/* Name label */}
              <text
                y={nodeRadius + 16}
                textAnchor="middle"
                fontSize="11"
                fill="var(--text-secondary)"
                fontWeight="500"
              >
                {char.name}
              </text>

              {/* Role tag */}
              {char.role && (
                <text
                  y={nodeRadius + 29}
                  textAnchor="middle"
                  fontSize="9"
                  fill={charColor}
                  opacity="0.7"
                >
                  {char.role}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
