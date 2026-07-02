'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const onboardingSteps = [
  {
    icon: '🤖',
    title: 'AI 角色生成',
    description: '输入你想要的性格、故事背景，AI 自动生成完整的短剧角色设定',
    highlight: '已有 20+ 风格模板',
  },
  {
    icon: '🛒',
    title: '模板市场',
    description: '浏览其他创作者设计的角色模板，一键购买和使用',
    highlight: '免费模板可用',
  },
  {
    icon: '📝',
    title: '剧本创作',
    description: '用 AI 辅助生成短剧剧本，从角色到场景到分镜，全链路打通',
    highlight: '3步出剧本',
  },
];

export default function OnboardingGuide() {
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    // 检查是否首次访问
    const onboarded = localStorage.getItem('onboarded');
    if (!onboarded) {
      setVisible(true);
    }
  }, []);

  const handleFinish = () => {
    localStorage.setItem('onboarded', 'true');
    setVisible(false);
  };

  const handleSkip = () => {
    localStorage.setItem('onboarded', 'true');
    setVisible(false);
  };

  const handleNext = () => {
    if (step < onboardingSteps.length - 1) {
      setStep(step + 1);
    } else {
      handleFinish();
    }
  };

  if (!visible) return null;

  const current = onboardingSteps[step];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        />

        {/* Card */}
        <motion.div
          key={step}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -20 }}
          transition={{ type: 'spring', damping: 25 }}
          className="relative w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden"
          style={{ background: 'var(--surface-card)', border: '1px solid var(--border-subtle)' }}
        >
          {/* Icon */}
          <div className="flex flex-col items-center px-6 pt-8 pb-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mb-4"
              style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(6,182,212,0.15))' }}
            >
              {current.icon}
            </motion.div>
            <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
              {current.title}
            </h2>
            <p className="text-sm text-center leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {current.description}
            </p>
            {current.highlight && (
              <span
                className="inline-block mt-3 px-3 py-1 rounded-full text-xs font-semibold"
                style={{ background: 'rgba(139,92,246,0.1)', color: 'var(--brand-500)' }}
              >
                {current.highlight}
              </span>
            )}
          </div>

          {/* Progress dots */}
          <div className="flex justify-center gap-2 pb-6">
            {onboardingSteps.map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full transition-all"
                style={{
                  background: i === step ? 'var(--brand-500)' : 'var(--border-subtle)',
                  width: i === step ? 24 : 8,
                }}
              />
            ))}
          </div>

          {/* Actions */}
          <div className="px-6 pb-6 flex gap-3">
            <button
              onClick={handleSkip}
              className="py-3 px-4 rounded-xl text-sm transition-colors"
              style={{ color: 'var(--text-muted)' }}
            >
              跳过
            </button>
            <button
              onClick={handleNext}
              className="flex-1 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, var(--brand-500), var(--accent-500))' }}
            >
              {step < onboardingSteps.length - 1 ? '下一步' : '开始创作 🚀'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
