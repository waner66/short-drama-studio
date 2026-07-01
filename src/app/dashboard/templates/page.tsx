'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import PageHeader from '@/components/ui/page-header';
import GlassCard from '@/components/ui/glass-card';
import GradientBtn from '@/components/ui/gradient-btn';
import EmptyState from '@/components/ui/empty-state';
import StatCard from '@/components/ui/stat-card';
import Badge from '@/components/ui/badge';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

interface MyTemplate {
  id: string; title: string; description?: string; price: number;
  status: string; salesCount: number; avgRating: number;
  category?: string; tags?: string[];
}

const statusCfg: Record<string, { label: string; cls: string }> = {
  DRAFT: { label: '草稿', cls: 'text-gray-400 bg-gray-500/20' },
  REVIEWING: { label: '审核中', cls: 'text-blue-400 bg-blue-500/20' },
  PUBLISHED: { label: '已上架', cls: 'text-green-400 bg-green-500/20' },
  DELISTED: { label: '已下架', cls: 'text-red-400 bg-red-500/20' },
};

export default function MyTemplatesPage() {
  const [templates, setTemplates] = useState<MyTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showPublish, setShowPublish] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [form, setForm] = useState({ project: '', title: '', description: '', price: 29.9, category: '甜宠恋爱' });

  useEffect(() => {
    const fetchTemplates = async () => {
      setLoading(true);
      setError('');
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const userId = user.id;
        if (!userId) {
          setTemplates([]);
          setLoading(false);
          return;
        }
        const res = await fetch(`/api/templates?creatorId=${userId}&limit=50`);
        if (!res.ok) throw new Error('加载失败');
        const data = await res.json();
        setTemplates(data.data || []);
      } catch (err: any) {
        setError(err.message || '加载模板失败');
      } finally {
        setLoading(false);
      }
    };
    fetchTemplates();
  }, []);

  const confirmPublish = () => {
    setPublishing(true);
    setTimeout(() => {
      setPublishing(false);
      setShowPublish(false);
    }, 1500);
  };

  const totalRevenue = templates.reduce((s, t) => {
    if (t.status === 'PUBLISHED') return s + (Number(t.price) || 0) * (t.salesCount || 0);
    return s;
  }, 0);
  const totalSales = templates.reduce((s, t) => s + (t.salesCount || 0), 0);
  const avgPrice = totalSales > 0 ? (totalRevenue / totalSales) : 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <PageHeader title="我的模板" />
          <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400">{templates.length} 个模板</span>
        </div>
        <GradientBtn onClick={() => setShowPublish(true)} variant="sell">+ 发布新模板</GradientBtn>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <StatCard title="总收益" value={`¥${totalRevenue.toLocaleString()}`} accent="green" />
        <StatCard title="总销量" value={String(totalSales)} accent="cyan" />
        <StatCard title="客单价" value={`¥${avgPrice.toFixed(1)}`} accent="purple" />
        <StatCard title="创作者分成" value="85%" accent="amber" />
      </div>

      {/* 模板列表 */}
      {loading ? (
        <GlassCard>
          <div className="flex items-center justify-center py-16">
            <Spin indicator={<LoadingOutlined style={{ fontSize: 28, color: '#c084fc' }} spin />} />
          </div>
        </GlassCard>
      ) : error ? (
        <GlassCard>
          <div className="p-8 text-center text-red-400">{error}</div>
        </GlassCard>
      ) : templates.length === 0 ? (
        <GlassCard>
          <EmptyState title="还没有模板" description="将你的项目发布为模板出售" actions={<GradientBtn onClick={() => setShowPublish(true)} variant="sell">发布第一个模板</GradientBtn>} />
        </GlassCard>
      ) : (
        <div className="space-y-3">
          {templates.map((tpl) => (
            <GlassCard key={tpl.id} hover>
              <div className="flex items-center gap-4 flex-wrap">
                <div className="w-14 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-white truncate">{tpl.title}</h4>
                    <span className={`flex-shrink-0 text-xs px-2 py-0.5 rounded-full ${statusCfg[tpl.status]?.cls || 'text-gray-400 bg-gray-500/20'}`}>
                      {statusCfg[tpl.status]?.label || tpl.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 truncate">{tpl.description || '暂无描述'}</p>
                </div>

                <div className="text-right flex-shrink-0">
                  <div className="text-lg font-bold text-amber-400">¥{Number(tpl.price).toFixed(1)}</div>
                  <div className="text-xs text-gray-500 flex items-center gap-2 mt-0.5">
                    <span>{tpl.salesCount || 0} 销量</span>
                    {tpl.avgRating > 0 && (
                      <span className="flex items-center gap-0.5">
                        <svg className="w-3 h-3 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        {tpl.avgRating}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <Link href={`/dashboard/market/${tpl.id}`} className="px-3 py-1.5 text-sm text-gray-400 hover:text-white bg-white/5 rounded-lg hover:bg-white/10 transition-colors">预览</Link>
                  <button className="px-3 py-1.5 text-sm text-gray-400 hover:text-white bg-white/5 rounded-lg hover:bg-white/10 transition-colors">编辑</button>
                  <button className="px-3 py-1.5 text-sm text-red-400 hover:text-red-300 bg-red-500/10 rounded-lg hover:bg-red-500/20 transition-colors">下架</button>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {/* 发布弹窗 */}
      {showPublish && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowPublish(false)}>
          <div className="w-full max-w-lg bg-[#141428] border border-white/10 rounded-2xl p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-white mb-6">发布新模板</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">选择项目</label>
                <select
                  value={form.project}
                  onChange={(e) => setForm({ ...form, project: e.target.value })}
                  className="w-full h-10 bg-white/5 border border-white/10 rounded-lg text-white px-3 text-sm focus:outline-none focus:border-[#5b2eff]"
                >
                  <option value="">从已有项目导出为模板</option>
                  <option value="1">穿越之我在古代当总裁</option>
                  <option value="2">我和AI助手谈恋爱的那些日子</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">模板标题 <span className="text-red-400">*</span></label>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="例：霸道总裁爱上我 · 短剧模板"
                  className="w-full h-10 bg-white/5 border border-white/10 rounded-lg text-white px-3 text-sm focus:outline-none focus:border-[#5b2eff]" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">模板描述</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3} placeholder="描述你的模板包含哪些内容..."
                  className="w-full bg-white/5 border border-white/10 rounded-lg text-white px-3 py-2 text-sm focus:outline-none focus:border-[#5b2eff] resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">售价 (¥)</label>
                  <input type="number" min={0} max={999} step={0.01}
                    value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                    className="w-full h-10 bg-white/5 border border-white/10 rounded-lg text-white px-3 text-sm focus:outline-none focus:border-[#5b2eff]" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">分类</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full h-10 bg-white/5 border border-white/10 rounded-lg text-white px-3 text-sm focus:outline-none focus:border-[#5b2eff]">
                    {['甜宠恋爱', '古装仙侠', '悬疑推理', '都市情感', '喜剧搞笑', '逆袭爽文', '校园青春', '家庭伦理'].map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center cursor-pointer hover:border-[#5b2eff]/50 transition-colors">
                <svg className="w-8 h-8 text-gray-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span className="text-sm text-gray-500">上传封面图</span>
              </div>
              <div className="bg-[#5b2eff]/10 border border-[#5b2eff]/20 rounded-lg p-3 text-xs text-gray-400">
                平台抽成 15%，你实际获得售价的 85%<br />
                预计每单收益：<span className="text-[#00d4aa] font-bold">¥{(form.price * 0.85).toFixed(2)}</span>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button onClick={() => setShowPublish(false)} className="px-5 py-2.5 text-sm text-gray-400 hover:text-white bg-white/5 rounded-lg hover:bg-white/10 transition-colors">取消</button>
                <GradientBtn onClick={confirmPublish} loading={publishing} variant="sell">
                  {publishing ? '发布中...' : '确认发布'}
                </GradientBtn>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
