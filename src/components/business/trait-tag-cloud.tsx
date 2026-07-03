'use client';

import { useState, useMemo, type ReactNode } from 'react';

interface TraitTagCloudProps {
  title: string;
  icon: ReactNode;
  accent: string;
  availableTags: string[];
  selected: string[];
  onChange: (tags: string[]) => void;
}

export default function TraitTagCloud({ title, icon, accent, availableTags, selected, onChange }: TraitTagCloudProps) {
  const [search, setSearch] = useState('');

  const toggle = (tag: string) => {
    if (selected.includes(tag)) {
      onChange(selected.filter(t => t !== tag));
    } else {
      onChange([...selected, tag]);
    }
  };

  const filtered = useMemo(() => {
    if (!search.trim()) return availableTags;
    return availableTags.filter(t => t.includes(search));
  }, [availableTags, search]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-base">{icon}</span>
          <span className="text-sm font-medium text-gray-200">{title}</span>
          {selected.length > 0 && (
            <span className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ backgroundColor: `${accent}20`, color: accent, border: `1px solid ${accent}40` }}>
              {selected.length}
            </span>
          )}
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="搜索..."
          className="w-20 h-7 bg-white/5 border border-white/10 rounded-lg text-white text-xs px-2 focus:outline-none focus:border-white/20 transition-colors"
        />
      </div>

      <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto pr-1">
        {filtered.length === 0 && (
          <span className="text-xs text-gray-600 italic">没有匹配的标签</span>
        )}
        {filtered.map((tag) => {
          const isSelected = selected.includes(tag);
          return (
            <button
              key={tag}
              onClick={() => toggle(tag)}
              className={`px-2.5 py-1 rounded-full text-xs transition-all cursor-pointer ${
                isSelected
                  ? 'text-white scale-105 shadow-lg'
                  : 'text-gray-400 bg-white/5 hover:bg-white/10 hover:text-gray-200'
              }`}
              style={isSelected ? {
                backgroundColor: `${accent}30`,
                border: `1px solid ${accent}60`,
                boxShadow: `0 0 12px ${accent}15`,
              } : {
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              {isSelected && '✓ '}{tag}
            </button>
          );
        })}
      </div>
    </div>
  );
}
