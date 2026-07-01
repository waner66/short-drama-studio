'use client';

import { useState } from 'react';

interface ScriptLine {
  id: string;
  type: 'dialogue' | 'action' | 'narration' | 'transition';
  character?: string;
  content: string;
}

interface ScriptAct {
  id: string;
  title: string;
  lines: ScriptLine[];
}

interface ScriptPanelProps {
  acts: ScriptAct[];
  title?: string;
  editable?: boolean;
  onLineClick?: (line: ScriptLine) => void;
  activeLineId?: string;
  className?: string;
}

const typeStyles: Record<string, string> = {
  dialogue: 'text-white',
  action: 'text-gray-400 italic',
  narration: 'text-cyan-300/80',
  transition: 'text-purple-400/70 text-xs uppercase tracking-wider',
};

const typeLabels: Record<string, string> = {
  dialogue: '对白',
  action: '动作',
  narration: '旁白',
  transition: '转场',
};

export default function ScriptPanel({
  acts,
  title,
  editable = false,
  onLineClick,
  activeLineId,
  className = '',
}: ScriptPanelProps) {
  const [expandedActs, setExpandedActs] = useState<Set<string>>(
    new Set(acts.map((a) => a.id))
  );

  const toggleAct = (actId: string) => {
    setExpandedActs((prev) => {
      const next = new Set(prev);
      if (next.has(actId)) next.delete(actId);
      else next.add(actId);
      return next;
    });
  };

  const totalLines = acts.reduce((sum, a) => sum + a.lines.length, 0);
  const totalChars = acts.reduce(
    (sum, a) => sum + a.lines.reduce((s, l) => s + l.content.length, 0),
    0
  );

  return (
    <div className={`rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
        <div>
          <h3 className="font-semibold text-white">{title || '剧本内容'}</h3>
          <p className="text-xs text-gray-500 mt-0.5">
            {acts.length} 幕 · {totalLines} 行 · {totalChars} 字
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setExpandedActs(new Set(acts.map((a) => a.id)))}
            className="text-xs text-gray-500 hover:text-purple-400 transition-colors"
          >
            全部展开
          </button>
          <button
            onClick={() => setExpandedActs(new Set())}
            className="text-xs text-gray-500 hover:text-purple-400 transition-colors"
          >
            全部折叠
          </button>
        </div>
      </div>

      {/* Acts */}
      <div className="divide-y divide-white/[0.02]">
        {acts.map((act) => {
          const isExpanded = expandedActs.has(act.id);
          return (
            <div key={act.id}>
              {/* Act Header */}
              <button
                onClick={() => toggleAct(act.id)}
                className="flex w-full items-center gap-3 px-6 py-3 text-left hover:bg-white/[0.02] transition-colors"
              >
                <svg
                  className={`h-4 w-4 text-gray-500 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span className="font-medium text-gray-300">{act.title}</span>
                <span className="text-xs text-gray-600">{act.lines.length} 行</span>
              </button>

              {/* Lines */}
              {isExpanded && (
                <div className="px-6 pb-4 space-y-1">
                  {act.lines.map((line) => (
                    <div
                      key={line.id}
                      onClick={() => onLineClick?.(line)}
                      className={`
                        group flex items-start gap-3 py-1.5 px-2 rounded-lg
                        ${onLineClick ? 'cursor-pointer hover:bg-white/[0.03]' : ''}
                        ${activeLineId === line.id ? 'bg-purple-500/10 ring-1 ring-purple-500/20' : ''}
                      `}
                    >
                      {/* Type badge */}
                      <span className="mt-0.5 shrink-0 rounded px-1.5 py-0 text-[10px] bg-white/5 text-gray-500">
                        {typeLabels[line.type] || line.type}
                      </span>

                      {/* Character name */}
                      {line.character && (
                        <span className="mt-0.5 shrink-0 text-xs font-medium text-purple-400 min-w-[3rem]">
                          {line.character}
                          <span className="text-gray-600 mx-1">:</span>
                        </span>
                      )}

                      {/* Content */}
                      <span className={`text-sm leading-relaxed ${typeStyles[line.type] || 'text-gray-300'}`}>
                        {line.content}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {acts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-gray-600">
          <svg className="h-10 w-10 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="text-sm">暂无剧本内容</span>
          <span className="text-xs mt-1">使用 AI 助手开始创作</span>
        </div>
      )}
    </div>
  );
}
