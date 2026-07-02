'use client';

import { useState, useRef } from 'react';

interface CharacterNode {
  id: string;
  name: string;
  archetype?: string;
  gender?: string;
}

interface RelationEdge {
  id: string;
  characterAId: string;
  characterBId: string;
  relationType: string;
  description?: string;
}

interface RelationGraphProps {
  characters: CharacterNode[];
  relations: RelationEdge[];
  onAddRelation?: (charA: string, charB: string) => void;
  className?: string;
}

const RELATION_COLORS: Record<string, { stroke: string; label: string; dash?: string }> = {
  '恋爱': { stroke: '#e74c3c', label: '恋爱' },
  '敌对': { stroke: '#e67e22', label: '敌对' },
  '朋友': { stroke: '#3498db', label: '朋友' },
  '家人': { stroke: '#27ae60', label: '家人' },
  '上下级': { stroke: '#8e44ad', label: '上下级' },
  '秘密': { stroke: '#2c3e50', label: '秘密', dash: '6 3' },
  '前世': { stroke: '#9b59b6', label: '前世', dash: '4 4' },
  '单恋': { stroke: '#e91e63', label: '单恋', dash: '2 6' },
  '商业': { stroke: '#1abc9c', label: '商业' },
};

export default function RelationGraph({ characters, relations, onAddRelation, className = '' }: RelationGraphProps) {
  const [nodes, setNodes] = useState(() => {
    const angleStep = (2 * Math.PI) / Math.max(characters.length, 1);
    return characters.map((c, i) => ({
      ...c,
      x: 340 + 220 * Math.cos(i * angleStep - Math.PI / 2),
      y: 200 + 180 * Math.sin(i * angleStep - Math.PI / 2),
    }));
  });

  const [dragging, setDragging] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const getNode = (id: string) => nodes.find(n => n.id === id);

  const handleMouseDown = (id: string, e: React.MouseEvent) => {
    setDragging(id);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const scale = 680 / rect.width;
    const x = (e.clientX - rect.left) * scale;
    const y = (e.clientY - rect.top) * scale;
    setNodes(prev => prev.map(n => n.id === dragging ? { ...n, x: Math.max(40, Math.min(640, x)), y: Math.max(40, Math.min(440, y)) } : n));
  };

  const handleMouseUp = () => setDragging(null);

  return (
    <svg ref={svgRef} viewBox="0 0 680 480" width="100%" height="100%" className={className}
      onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
      {relations.map(r => {
        const a = getNode(r.characterAId);
        const b = getNode(r.characterBId);
        if (!a || !b) return null;
        const color = RELATION_COLORS[r.relationType] || { stroke: '#999', label: r.relationType };
        const mx = (a.x + b.x) / 2;
        const my = (a.y + b.y) / 2 - 8;
        return (
          <g key={r.id}>
            <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={color.stroke} strokeWidth="1.5"
              strokeDasharray={color.dash} opacity="0.8" />
            <rect x={mx - 20} y={my - 10} width="40" height="18" rx="9" fill="white" fillOpacity="0.9" stroke={color.stroke} strokeWidth="0.5" />
            <text x={mx} y={my + 3} textAnchor="middle" fontSize="10" fill={color.stroke} fontWeight="500">{color.label}</text>
          </g>
        );
      })}

      {nodes.map(n => (
        <g key={n.id} cursor={onAddRelation ? 'pointer' : 'grab'}
          onMouseDown={(e) => handleMouseDown(n.id, e)}
          onClick={() => onAddRelation && onAddRelation(n.id, n.id)}>
          <circle cx={n.x} cy={n.y} r="28" fill="var(--color-background-primary, #fff)"
            stroke="var(--brand-500)" strokeWidth="2" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.1))" />
          <text x={n.x} y={n.y - 2} textAnchor="middle" fontSize="13" fontWeight="600" fill="var(--color-text-primary, #1a1a2e)">
            {n.name.length > 3 ? n.name.slice(0, 3) + '..' : n.name}
          </text>
          <text x={n.x} y={n.y + 14} textAnchor="middle" fontSize="10" fill="var(--color-text-secondary, #6b6b8a)">
            {n.archetype || (n.gender === '男' ? '♂' : '♀')}
          </text>
        </g>
      ))}

      <text x="340" y="470" textAnchor="middle" fontSize="11" fill="var(--color-text-tertiary, #999)">
        {characters.length === 0 ? '暂无角色，请先创建角色' : `拖拽节点调整位置 · ${relations.length} 条关系`}
      </text>
    </svg>
  );
}
