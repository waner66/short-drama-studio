'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/ui/page-header';
import GlassCard from '@/components/ui/glass-card';
import GradientBtn from '@/components/ui/gradient-btn';

const GENRES = ['甜宠恋爱', '悬疑推理', '古装仙侠', '校园青春', '逆袭爽文', '都市现实', '科幻未来'];
const GENDERS = ['男', '女', '不限'];

export default function NewTemplatePage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: 0,
    tags: '' as string,
    genre: '甜宠恋爱' as string,
    gender: '不限' as string,
    personality: '',
    backstory: '',
  });

  const handleSubmit = async () => {
    if (!form.name || !form.description) {
      setError('请填写模板名称和描述');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const tags = form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [];
      const res = await fetch('/api/character-templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          price: Number(form.price) || 0,
          tags,
          genre: form.genre,
          gender: form.gender,
          personality: form.personality,
          backstory: form.backstory,
        }),
      });
      if (res.ok) {
        router.push('/dashboard/templates');
      } else {
        const data = await res.json();
        setError(data.error || '发布失败');
      }
    } catch {
      setError('网络错误，请重试');
    } finally {
      setSaving(false);
    }
  };

  const update = (key: string, value: string | number) => setForm(prev => ({ ...prev, [key]: value }));

  return (
    <div className="max-w-2xl mx-auto">
      <PageHeader title="发布新模板" subtitle="将你的角色设定发布到模板市场" />

      {error && (
        <div className="mb-4 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400">
          {error}
        </div>
      )}

      <GlassCard className="space-y-5">
        {/* 模板名称 */}
        <div>
          <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">模板名称 *</label>
          <input
            value={form.name}
            onChange={e => update('name', e.target.value)}
            placeholder="例如：霸道总裁·墨辰"
            className="w-full bg-[var(--surface-ground)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-primary)] px-4 py-3 text-sm focus:outline-none focus:border-brand-500 transition-colors"
          />
        </div>

        {/* 描述 */}
        <div>
          <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">描述 *</label>
          <textarea
            value={form.description}
            onChange={e => update('description', e.target.value)}
            rows={4}
            placeholder="描述这个角色的性格、背景、亮点..."
            className="w-full bg-[var(--surface-ground)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-primary)] px-4 py-3 text-sm focus:outline-none focus:border-brand-500 transition-colors resize-none"
          />
        </div>

        {/* 价格 + 类型 + 性别 */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">价格 (元)</label>
            <input
              type="number"
              value={form.price}
              onChange={e => update('price', Number(e.target.value))}
              min={0}
              className="w-full bg-[var(--surface-ground)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-primary)] px-4 py-3 text-sm focus:outline-none focus:border-brand-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">类型</label>
            <select
              value={form.genre}
              onChange={e => update('genre', e.target.value)}
              className="w-full bg-[var(--surface-ground)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-primary)] px-4 py-3 text-sm focus:outline-none focus:border-brand-500 transition-colors"
            >
              {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">性别</label>
            <select
              value={form.gender}
              onChange={e => update('gender', e.target.value)}
              className="w-full bg-[var(--surface-ground)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-primary)] px-4 py-3 text-sm focus:outline-none focus:border-brand-500 transition-colors"
            >
              {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
        </div>

        {/* 标签 */}
        <div>
          <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">标签（用逗号分隔）</label>
          <input
            value={form.tags}
            onChange={e => update('tags', e.target.value)}
            placeholder="总裁, 腹黑, 深情, 反差萌"
            className="w-full bg-[var(--surface-ground)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-primary)] px-4 py-3 text-sm focus:outline-none focus:border-brand-500 transition-colors"
          />
        </div>

        {/* 性格特征 */}
        <div>
          <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">性格特征</label>
          <input
            value={form.personality}
            onChange={e => update('personality', e.target.value)}
            placeholder="冷静沉稳、心思缜密、偶尔腹黑"
            className="w-full bg-[var(--surface-ground)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-primary)] px-4 py-3 text-sm focus:outline-none focus:border-brand-500 transition-colors"
          />
        </div>

        {/* 背景故事 */}
        <div>
          <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">背景故事</label>
          <textarea
            value={form.backstory}
            onChange={e => update('backstory', e.target.value)}
            rows={4}
            placeholder="这个角色的出身、经历、核心矛盾..."
            className="w-full bg-[var(--surface-ground)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-primary)] px-4 py-3 text-sm focus:outline-none focus:border-brand-500 transition-colors resize-none"
          />
        </div>

        {/* 提交 */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={() => router.back()}
            className="px-6 py-3 text-sm text-[var(--text-secondary)] bg-[var(--surface-elevated)] rounded-xl hover:bg-[var(--surface-overlay)] transition-colors"
          >
            取消
          </button>
          <GradientBtn onClick={handleSubmit} loading={saving} className="flex-1 justify-center">
            提交审核
          </GradientBtn>
        </div>

        <p className="text-xs text-[var(--text-muted)] text-center">
          提交后需经管理员审核，审核通过后将出现在模板市场
        </p>
      </GlassCard>
    </div>
  );
}
