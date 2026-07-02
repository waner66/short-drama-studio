'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/ui/page-header';
import GlassCard from '@/components/ui/glass-card';
import GradientBtn from '@/components/ui/gradient-btn';

const genres = ['甜宠恋爱', '古装仙侠', '悬疑推理', '都市情感', '喜剧搞笑', '逆袭爽文', '校园青春', '家庭伦理'];
const styles = ['写实', '动漫', '水墨', '像素', '手绘'];

export default function NewProjectPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    genre: '甜宠恋爱',
    style: '写实',
    aiAssist: true,
  });

  const update = (key: string, value: any) => setForm({ ...form, [key]: value });

  const handleCreate = async () => {
    if (!form.title.trim()) return;
    setLoading(true);
    setTimeout(() => {
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        import('@/lib/store/data-service').then(({ projectService }) => {
          const project = projectService.create(user.id || 'anonymous', {
            title: form.title,
            description: form.description,
            genre: form.genre,
            style: form.style,
          });
          setLoading(false);
          router.push(`/dashboard/projects/${project.id}`);
        });
      } catch {
        setLoading(false);
        router.push('/dashboard/projects');
      }
    }, 800);
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* 步骤条 */}
      <div className="flex items-center gap-3 mb-8">
        {['项目信息', '确认创建'].map((label, i) => (
          <div key={label} className="flex items-center gap-3">
            <div className={`flex items-center gap-2 ${step === i + 1 ? 'text-white' : 'text-gray-600'}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                step > i + 1 ? 'bg-[#00d4aa] text-black' :
                step === i + 1 ? 'bg-brand-500 text-white' :
                'bg-white/10 text-gray-500'
              }`}>
                {step > i + 1 ? '✓' : i + 1}
              </div>
              <span className="text-sm font-medium">{label}</span>
            </div>
            {i === 0 && <div className="w-12 h-px bg-white/10" />}
          </div>
        ))}
      </div>

      {step === 1 ? (
        <GlassCard>
          <h2 className="text-lg font-bold text-white mb-6">项目信息</h2>

          <div className="space-y-5">
            {/* 标题 */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                项目名称 <span className="text-red-400">*</span>
              </label>
              <input
                value={form.title}
                onChange={(e) => update('title', e.target.value)}
                placeholder="给你的短剧起个名字..."
                className="w-full h-10 bg-white/5 border border-white/10 rounded-lg text-white px-3 text-sm focus:outline-none focus:border-brand-500 transition-colors"
                autoFocus
              />
            </div>

            {/* 描述 */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">项目描述</label>
              <textarea
                value={form.description}
                onChange={(e) => update('description', e.target.value)}
                rows={4}
                placeholder="简单描述一下这个短剧的故事..."
                className="w-full bg-white/5 border border-white/10 rounded-lg text-white px-3 py-2.5 text-sm focus:outline-none focus:border-brand-500 transition-colors resize-none"
              />
            </div>

            {/* 类型 */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">题材分类</label>
              <div className="flex flex-wrap gap-2">
                {genres.map((g) => (
                  <button
                    key={g}
                    onClick={() => update('genre', g)}
                    className={`px-4 py-2 rounded-lg text-sm transition-all ${
                      form.genre === g
                        ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* 风格 */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">视觉风格</label>
              <div className="flex flex-wrap gap-2">
                {styles.map((s) => (
                  <button
                    key={s}
                    onClick={() => update('style', s)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${
                      form.style === s
                        ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full" style={{
                      background: s === '写实' ? 'linear-gradient(135deg, var(--brand-500), #00d4aa)' :
                                  s === '动漫' ? 'linear-gradient(135deg, #ff5ecf, #ff9a44)' :
                                  s === '水墨' ? 'linear-gradient(135deg, #94a3b8, #1e293b)' :
                                  s === '像素' ? 'linear-gradient(135deg, #fbbf24, #ef4444)' :
                                  'linear-gradient(135deg, #a78bfa, #3b82f6)',
                    }} />
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* AI 辅助 */}
            <div className="flex items-center justify-between p-4 bg-brand-500/10 border border-brand-500/20 rounded-lg">
              <div>
                <div className="text-sm font-medium text-white mb-0.5">AI 智能辅助</div>
                <div className="text-xs text-gray-400">让 AI 帮你生成角色、剧本和分镜</div>
              </div>
              <button
                onClick={() => update('aiAssist', !form.aiAssist)}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  form.aiAssist ? 'bg-brand-500' : 'bg-white/20'
                }`}
              >
                <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  form.aiAssist ? 'translate-x-5.5' : 'translate-x-0.5'
                }`} style={{ left: 0 }} />
              </button>
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <GradientBtn onClick={() => setStep(2)} disabled={!form.title.trim()}>
              下一步
            </GradientBtn>
          </div>
        </GlassCard>
      ) : (
        /* 步骤二：确认 */
        <GlassCard>
          <h2 className="text-lg font-bold text-white mb-6">确认创建</h2>

          <div className="space-y-4 mb-6">
            <div className="flex justify-between py-3 border-b border-white/5">
              <span className="text-gray-400">项目名称</span>
              <span className="text-white font-medium">{form.title}</span>
            </div>
            <div className="flex justify-between py-3 border-b border-white/5">
              <span className="text-gray-400">题材</span>
              <span className="text-white">{form.genre}</span>
            </div>
            <div className="flex justify-between py-3 border-b border-white/5">
              <span className="text-gray-400">风格</span>
              <span className="text-white">{form.style}</span>
            </div>
            <div className="flex justify-between py-3 border-b border-white/5">
              <span className="text-gray-400">AI 辅助</span>
              <span className={form.aiAssist ? 'text-[#00d4aa]' : 'text-gray-500'}>
                {form.aiAssist ? '已开启' : '已关闭'}
              </span>
            </div>
            {form.description && (
              <div className="py-3 border-b border-white/5">
                <span className="text-gray-400 block mb-1">描述</span>
                <span className="text-white text-sm">{form.description}</span>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setStep(1)}
              className="px-5 py-2.5 text-sm text-gray-400 hover:text-white bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
            >
              返回修改
            </button>
            <GradientBtn onClick={handleCreate} loading={loading}>
              {loading ? '创建中...' : '确认创建'}
            </GradientBtn>
          </div>
        </GlassCard>
      )}
    </div>
  );
}
