'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import PageHeader from '@/components/ui/page-header';
import GlassCard from '@/components/ui/glass-card';
import GradientBtn from '@/components/ui/gradient-btn';
import EmptyState from '@/components/ui/empty-state';
import StatCard from '@/components/ui/stat-card';
import { Spin, message } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

interface MyTemplate {
  id: string; title: string; description?: string; price: number;
  status: string; salesCount: number; avgRating: number; revenue: number;
  category?: string; orders: number; favorites: number; reviews: number;
}

interface CreatorStats {
  totalRevenue: number; monthlyRevenue: number; pendingSettlement: number;
  templateCount: number; publishedCount: number; templates: MyTemplate[];
}

const statusCfg: Record<string, { label: string; cls: string }> = {
  DRAFT: { label: '草稿', cls: 'text-gray-400 bg-gray-500/20' },
  REVIEWING: { label: '审核中', cls: 'text-blue-400 bg-blue-500/20' },
  PUBLISHED: { label: '已上架', cls: 'text-green-400 bg-green-500/20' },
  DELISTED: { label: '已下架', cls: 'text-red-400 bg-red-500/20' },
};

export default function MyTemplatesPage() {
  const [stats, setStats] = useState<CreatorStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/creator/stats', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error('加载失败');
      const data = await res.json();
      setStats(data);
    } catch (err: any) {
      setError(err.message || '加载创作者数据失败');
    } finally {
      setLoading(false);
    }
  }

  const templates = stats?.templates || [];
  const totalRevenue = stats?.totalRevenue || 0;
  const monthlyRevenue = stats?.monthlyRevenue || 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <PageHeader title="我的模板" />
          <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400">
            {stats?.publishedCount || 0}/{stats?.templateCount || 0} 已上架
          </span>
        </div>
        <GradientBtn onClick={() => message.info('发布功能开发中')} variant="sell">
          + 发布新模板
        </GradientBtn>
      </div>

      {/* 统计卡片 — 从 creator/stats API 获取 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <StatCard title="累计收益" value={`¥${totalRevenue.toFixed(2)}`} accent="green" />
        <StatCard title="本月收益" value={`¥${monthlyRevenue.toFixed(2)}`} accent="cyan" />
        <StatCard title="模板数量" value={String(stats?.templateCount || 0)} accent="purple" />
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
          <EmptyState
            title="还没有模板"
            description="将你的项目发布为模板出售"
            actions={
              <GradientBtn onClick={() => message.info('发布功能开发中')} variant="sell">
                发布第一个模板
              </GradientBtn>
            }
          />
        </GlassCard>
      ) : (
        <div className="space-y-3">
          {templates.map((tpl) => (
            <GlassCard key={tpl.id} hover>
              <div className="flex items-center gap-4 flex-wrap">
                {/* 图标 */}
                <div className="w-14 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>

                {/* 标题+状态 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-white truncate">{tpl.title}</h4>
                    <span
                      className={`flex-shrink-0 text-xs px-2 py-0.5 rounded-full ${statusCfg[tpl.status]?.cls || 'text-gray-400 bg-gray-500/20'}`}
                    >
                      {statusCfg[tpl.status]?.label || tpl.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 truncate">
                    {tpl.orders || 0} 笔订单 · {tpl.favorites || 0} 收藏 · {tpl.reviews || 0} 评价
                  </p>
                </div>

                {/* 价格+收益 */}
                <div className="text-right flex-shrink-0">
                  <div className="text-lg font-bold text-amber-400">¥{Number(tpl.price).toFixed(1)}</div>
                  <div className="text-xs text-gray-500">
                    收益 <span className="text-green-400 font-medium">¥{(tpl.revenue || 0).toFixed(2)}</span>
                    {tpl.avgRating > 0 && (
                      <span className="ml-2 flex items-center gap-0.5 inline-flex">
                        <svg className="w-3 h-3 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        {tpl.avgRating}
                      </span>
                    )}
                  </div>
                </div>

                {/* 操作按钮 */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Link href={`/dashboard/market/${tpl.id}`}
                    className="px-3 py-1.5 text-sm text-gray-400 hover:text-white bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                    预览
                  </Link>
                  <button className="px-3 py-1.5 text-sm text-gray-400 hover:text-white bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                    编辑
                  </button>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}
