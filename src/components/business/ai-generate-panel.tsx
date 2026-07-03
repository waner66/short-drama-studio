'use client';

import { useState } from 'react';
import GlassCard from '../ui/glass-card';
import GradientBtn from '../ui/gradient-btn';

interface AIGeneratePanelProps {
  type?: 'character' | 'scene' | 'script' | 'storyboard' | 'general';
  title?: string;
  description?: string;
  placeholder?: string;
  quickTags?: string[];
  loading?: boolean;
  onGenerate: (prompt: string) => void;
  onApply?: (result: string) => void;
  lastResult?: string;
  lastImageUrl?: string;
  className?: string;
}

export default function AIGeneratePanel({
  type = 'general',
  title = 'AI 生成',
  description,
  placeholder = '描述你想要的内容...',
  quickTags = [],
  loading = false,
  onGenerate,
  onApply,
  lastResult,
  lastImageUrl,
  className = '',
}: AIGeneratePanelProps) {
  const [prompt, setPrompt] = useState('');
  const [showResult, setShowResult] = useState(false);

  const handleGenerate = () => {
    if (!prompt.trim() || loading) return;
    setShowResult(true);
    onGenerate(prompt);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };

  return (
    <GlassCard className={`p-5 ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500/20 to-cyan-500/20">
          <svg className="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div>
          <h4 className="font-semibold text-white text-sm">{title}</h4>
          <p className="text-[11px] text-gray-500">{description || 'AI 智能辅助创作'}</p>
        </div>
      </div>

      {/* Input */}
      <div className="relative">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={3}
          className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder-gray-600 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500/30 transition-all"
        />
        <div className="flex items-center justify-between mt-2">
          {quickTags.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {quickTags.map((tag) => (
                <GradientBtn
                  key={tag}
                  variant="tag-chip"
                  onClick={() => setPrompt((prev) => prev + (prev ? '，' : '') + tag)}
                >
                  {tag}
                </GradientBtn>
              ))}
            </div>
          ) : (
            <div />
          )}
          <GradientBtn
            size="sm"
            onClick={handleGenerate}
            loading={loading}
            disabled={!prompt.trim() || loading}
          >
            {loading ? '生成中...' : '生成'}
          </GradientBtn>
        </div>
      </div>

      {/* Result */}
      {showResult && (lastResult || lastImageUrl || loading) && (
        <div className="mt-4 pt-4 border-t border-white/5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-gray-400">生成结果</span>
            {onApply && lastResult && (
              <button
                onClick={() => onApply(lastResult)}
                className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
              >
                应用此结果
              </button>
            )}
          </div>

          {loading ? (
            <div className="space-y-2">
              <div className="animate-pulse h-3 w-3/4 rounded bg-white/[0.04]" />
              <div className="animate-pulse h-3 w-1/2 rounded bg-white/[0.04]" />
              <div className="animate-pulse h-3 w-2/3 rounded bg-white/[0.04]" />
            </div>
          ) : lastImageUrl ? (
            <div className="rounded-xl overflow-hidden border border-white/10">
              <img src={lastImageUrl} alt="AI 生成结果" className="w-full object-cover max-h-64" />
            </div>
          ) : lastResult ? (
            <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">{lastResult}</p>
          ) : null}
        </div>
      )}
    </GlassCard>
  );
}
