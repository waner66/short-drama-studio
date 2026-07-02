'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

interface PurchaseGuideProps {
  open: boolean;
  onClose: () => void;
  templateName: string;
  templateId: string;
}

const steps = [
  {
    icon: '✨',
    title: '角色已就绪',
    desc: '模板角色已自动导入到你的角色库',
  },
  {
    icon: '📝',
    title: '创建剧本',
    desc: '用 AI 辅助生成一个短剧剧本',
  },
  {
    icon: '🎬',
    title: '生成分镜',
    desc: '将剧本拆分为分镜，准备拍摄',
  },
];

export default function PurchaseGuide({ open, onClose, templateName, templateId }: PurchaseGuideProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);

  const handleStartCreating = () => {
    onClose();
    router.push(`/dashboard/projects/new?template=${templateId}`);
  };

  const handleGoToCharacters = () => {
    onClose();
    router.push('/dashboard/characters');
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden"
            style={{ background: 'var(--surface-card)', border: '1px solid var(--border-subtle)' }}
          >
            {/* Success Banner */}
            <div className="text-center px-6 pt-8 pb-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center text-2xl"
                style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(6,182,212,0.15))' }}
              >
                🎉
              </motion.div>
              <h2 className="text-xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                获取成功！
              </h2>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                模板「{templateName}」已添加到你的资产库
              </p>
            </div>

            {/* Steps */}
            <div className="px-6 pb-6">
              <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
                接下来你可以
              </p>
              <div className="space-y-2">
                {steps.map((step, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors ${
                      currentStep === i ? 'ring-2 ring-brand-500' : ''
                    }`}
                    style={{
                      background: currentStep === i ? 'rgba(139,92,246,0.08)' : 'var(--surface-elevated)',
                    }}
                    onMouseEnter={() => setCurrentStep(i)}
                    onClick={() => {
                      if (i === 2) handleStartCreating();
                      else if (i === 0) handleGoToCharacters();
                    }}
                  >
                    <span className="text-xl">{step.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                        {step.title}
                      </p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        {step.desc}
                      </p>
                    </div>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2">
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="px-6 pb-6 flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-xl text-sm font-medium transition-colors"
                style={{
                  background: 'var(--surface-elevated)',
                  color: 'var(--text-secondary)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                稍后再说
              </button>
              <button
                onClick={handleStartCreating}
                className="flex-[2] py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, var(--brand-500), var(--accent-500))' }}
              >
                🚀 立即开始创作
              </button>
            </div>

            {/* Tip */}
            <div className="px-6 pb-6">
              <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>
                💡 提示：你也可以在「我的项目」页面随时使用已购买的模板
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
