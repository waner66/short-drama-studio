'use client';

interface Tag {
  key: string;
  label: string;
  color?: 'purple' | 'cyan' | 'pink' | 'amber' | 'green' | 'gray';
}

interface TagGroupProps {
  tags: Tag[];
  selected?: string | string[];
  onSelect?: (key: string) => void;
  closable?: boolean;
  onClose?: (key: string) => void;
  className?: string;
}

const tagColors: Record<string, string> = {
  purple:
    'bg-purple-500/10 text-purple-400 border-purple-500/20 hover:bg-purple-500/20',
  cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20 hover:bg-cyan-500/20',
  pink: 'bg-pink-500/10 text-pink-400 border-pink-500/20 hover:bg-pink-500/20',
  amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20',
  green:
    'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20',
  gray: 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10',
};

const selectedColors: Record<string, string> = {
  purple: 'bg-purple-500/30 text-purple-300 border-purple-400/40',
  cyan: 'bg-cyan-500/30 text-cyan-300 border-cyan-400/40',
  pink: 'bg-pink-500/30 text-pink-300 border-pink-400/40',
  amber: 'bg-amber-500/30 text-amber-300 border-amber-400/40',
  green: 'bg-emerald-500/30 text-emerald-300 border-emerald-400/40',
  gray: 'bg-white/15 text-gray-300 border-white/20',
};

export default function TagGroup({
  tags,
  selected,
  onSelect,
  closable = false,
  onClose,
  className = '',
}: TagGroupProps) {
  const isSelected = (key: string) =>
    Array.isArray(selected)
      ? selected.includes(key)
      : selected === key;

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {tags.map((tag) => {
        const color = tag.color || 'gray';
        const active = isSelected(tag.key);

        return (
          <span
            key={tag.key}
            onClick={() => onSelect?.(tag.key)}
            className={`
              inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium
              transition-all duration-200
              ${active ? selectedColors[color] : tagColors[color]}
              ${onSelect ? 'cursor-pointer' : ''}
            `}
          >
            {tag.label}
            {closable && onClose && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClose(tag.key);
                }}
                className="ml-0.5 hover:opacity-70"
              >
                <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </span>
        );
      })}
    </div>
  );
}
