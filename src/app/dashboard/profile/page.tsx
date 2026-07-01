'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import PageHeader from '@/components/ui/page-header';
import GlassCard from '@/components/ui/glass-card';
import StatCard from '@/components/ui/stat-card';
import GradientBtn from '@/components/ui/gradient-btn';
import EmptyState from '@/components/ui/empty-state';
import { message } from 'antd';

// ====== Sub-components ======

// Projects tab — currently uses localStorage data-service
function MyProjectsTab() {
  const [projects, setProjects] = useState<Array<{
    id: string;
    title: string;
    status: string;
    scenes: number;
    chars: number;
    progress: number;
    updatedAt: string;
    isTemplate?: boolean;
    templateSourceId?: string;
  }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        // Try API first (projects from Prisma)
        const token = document.cookie.split('; ').find(r => r.startsWith('token='))?.split('=')[1];
        const res = await fetch('/api/projects', {
          headers: (token ? { Authorization: `Bearer ${token}` } : {}) as HeadersInit,
        });
        if (res.ok) {
          const data = await res.json();
          setProjects((data.data || []).map((p: any) => ({
            id: p.id,
            title: p.title,
            status: p.status === 'DRAFT' ? '草稿' : p.status === 'IN_PROGRESS' ? '进行中' : p.status === 'COMPLETED' ? '已完成' : '已发布',
            scenes: p._count?.scenes || 0,
            chars: 0,
            progress: p.status === 'COMPLETED' || p.status === 'PUBLISHED' ? 100 : p.status === 'IN_PROGRESS' ? 50 : 10,
            updatedAt: p.updatedAt?.slice(0, 10) || '-',
          })));
        }
      } catch {
        // fallback to mock
        setProjects([
          { id: '1', title: '穿越之我在古代当总裁', status: '进行中', scenes: 8, chars: 4, progress: 75, updatedAt: '2026-06-29' },
          { id: '2', title: '午夜调查局', status: '进行中', scenes: 3, chars: 6, progress: 35, updatedAt: '2026-06-20' },
          { id: '3', title: '校园甜心日记', status: '已完成', scenes: 12, chars: 3, progress: 100, updatedAt: '2026-06-15' },
        ]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return <div className="text-center py-8 text-gray-400">加载中...</div>;
  }

  if (projects.length === 0) {
    return (
      <EmptyState
        title="还没有创作项目"
        description="创建你的第一个短剧项目，开始创作之旅"
        actionLabel="新建项目"
        onAction={() => window.location.href = '/dashboard/projects/new'}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-400">创作项目</h3>
        <Link href="/dashboard/projects/new">
          <GradientBtn size="sm" variant="outline">+ 新建项目</GradientBtn>
        </Link>
      </div>
      {projects.map((proj) => (
        <GlassCard key={proj.id} className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-white">{proj.title}</h4>
              <p className="text-xs text-gray-500 mt-1">
                {proj.scenes > 0 ? `${proj.scenes} 场景 · ` : ''}{proj.chars} 角色 · 更新于 {proj.updatedAt}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-24">
                <div className="h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-purple-500 to-cyan-400"
                    style={{ width: `${proj.progress}%` }}
                  />
                </div>
                <span className="text-[10px] text-gray-600 mt-0.5 block text-right">{proj.progress}%</span>
              </div>
              <span
                className={`rounded-md border px-2 py-0.5 text-[10px] ${
                  proj.status === '已完成' || proj.status === '已发布'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    : 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                }`}
              >
                {proj.status}
              </span>
            </div>
          </div>
        </GlassCard>
      ))}
    </div>
  );
}

// Purchased templates tab
function PurchasedTab() {
  const [purchases, setPurchases] = useState<Array<{
    orderId: string;
    templateId: string;
    templateTitle: string;
    creator: string;
    amount: number;
    paidAt: string | null;
  }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const token = document.cookie.split('; ').find(r => r.startsWith('token='))?.split('=')[1];
        const res = await fetch('/api/user/purchases', {
          headers: (token ? { Authorization: `Bearer ${token}` } : {}) as HeadersInit,
        });
        if (res.ok) {
          const data = await res.json();
          setPurchases(data.data || []);
        }
      } catch { /* fallback to empty */ } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return <div className="text-center py-8 text-gray-400">加载中...</div>;
  }

  if (purchases.length === 0) {
    return (
      <EmptyState
        title="还没有购买模板"
        description="去模板市场逛逛，找到喜欢的模板立即使用"
        actionLabel="浏览市场"
        onAction={() => window.location.href = '/dashboard/market'}
      />
    );
  }

  return (
    <div className="space-y-4">
      {purchases.map((p) => (
        <GlassCard key={p.orderId} className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-white">{p.templateTitle}</h4>
              <p className="text-xs text-gray-500 mt-1">
                创作者: {p.creator} · 购买于 {p.paidAt?.slice(0, 10) || '-'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-purple-400">¥{p.amount.toFixed(1)}</span>
              <Link href={`/dashboard/market/${p.templateId}`}>
                <GradientBtn size="sm" variant="ghost">查看详情</GradientBtn>
              </Link>
            </div>
          </div>
        </GlassCard>
      ))}
    </div>
  );
}

// My templates tab
function MyTemplatesTab() {
  const [templates, setTemplates] = useState<Array<{
    id: string;
    title: string;
    price: number;
    salesCount: number;
    avgRating: number;
    status: string;
  }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const token = document.cookie.split('; ').find(r => r.startsWith('token='))?.split('=')[1];
        // First get user profile to know userId
        const profileRes = await fetch('/api/user/profile', {
          headers: (token ? { Authorization: `Bearer ${token}` } : {}) as HeadersInit,
        });
        if (!profileRes.ok) return;
        const profile = await profileRes.json();

        // Then get templates for this creator
        const res = await fetch(`/api/templates?creatorId=${profile.id}&sort=new&limit=50`, {
          headers: (token ? { Authorization: `Bearer ${token}` } : {}) as HeadersInit,
        });
        if (res.ok) {
          const data = await res.json();
          // Also fetch private/draft templates
          const allRes = await fetch(`/api/templates?creatorId=${profile.id}&sort=new&limit=50&status=all`, {
            headers: (token ? { Authorization: `Bearer ${token}` } : {}) as HeadersInit,
          });
          if (allRes.ok) {
            const allData = await allRes.json();
            setTemplates((allData.data || []).map((t: any) => ({
              id: t.id,
              title: t.title,
              price: t.price,
              salesCount: t.salesCount || 0,
              avgRating: t.avgRating || 0,
              status: t.status,
            })));
          } else {
            setTemplates((data.data || []).map((t: any) => ({
              id: t.id,
              title: t.title,
              price: t.price,
              salesCount: t.salesCount || 0,
              avgRating: t.avgRating || 0,
              status: t.status,
            })));
          }
        }
      } catch { /* fallback */ } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return <div className="text-center py-8 text-gray-400">加载中...</div>;
  }

  if (templates.length === 0) {
    return (
      <EmptyState
        title="还没有上架模板"
        description="将完成的项目导出为模板，上架到模板市场即可赚取收益"
        actionLabel="了解如何上架"
        onAction={() => {}}
      />
    );
  }

  const statusLabels: Record<string, string> = {
    DRAFT: '草稿',
    REVIEWING: '审核中',
    PUBLISHED: '已发布',
    DELISTED: '已下架',
  };
  const statusColors: Record<string, string> = {
    DRAFT: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
    REVIEWING: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    PUBLISHED: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    DELISTED: 'bg-red-500/10 text-red-400 border-red-500/20',
  };

  return (
    <div className="space-y-4">
      {templates.map((tpl) => (
        <GlassCard key={tpl.id} className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-medium text-white">{tpl.title}</h4>
                <span className={`rounded-md border px-2 py-0.5 text-[10px] ${statusColors[tpl.status] || statusColors.DRAFT}`}>
                  {statusLabels[tpl.status] || tpl.status}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                ¥{tpl.price.toFixed(1)} · {tpl.salesCount} 销量 · 评分 {tpl.avgRating.toFixed(1)}
              </p>
            </div>
            <Link href={`/dashboard/templates`}>
              <GradientBtn size="sm" variant="ghost">管理</GradientBtn>
            </Link>
          </div>
        </GlassCard>
      ))}
    </div>
  );
}

// ====== Main Page ======
export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('projects');
  const [editing, setEditing] = useState(false);
  const [userInfo, setUserInfo] = useState({
    username: '加载中...',
    bio: '',
    email: '',
    memberLevel: '免费版',
  });
  const [editForm, setEditForm] = useState({ username: '', bio: '' });
  const [stats, setStats] = useState({
    projects: 0,
    characters: 0,
    purchasedTemplates: 0,
    templateRevenue: 0,
    myTemplates: 0,
  });

  // Load profile + stats
  useEffect(() => {
    async function loadProfile() {
      try {
        const token = document.cookie.split('; ').find(r => r.startsWith('token='))?.split('=')[1];
        const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

        const [profileRes, statsRes] = await Promise.all([
          fetch('/api/user/profile', { headers }),
          fetch('/api/user/stats', { headers }),
        ]);

        if (profileRes.ok) {
          const p = await profileRes.json();
          setUserInfo({
            username: p.username,
            bio: p.bio || '',
            email: p.email || '',
            memberLevel: p.memberLevel || '免费版',
          });
          setEditForm({ username: p.username, bio: p.bio || '' });
        }

        if (statsRes.ok) {
          const s = await statsRes.json();
          setStats({
            projects: s.projects || 0,
            characters: s.characters || 0,
            purchasedTemplates: s.purchasedTemplates || 0,
            templateRevenue: s.templateRevenue || 0,
            myTemplates: s.myTemplates || 0,
          });
        }
      } catch {
        // Keep mock defaults
      }
    }
    loadProfile();
  }, []);

  async function handleSave() {
    try {
      const token = document.cookie.split('; ').find(r => r.startsWith('token='))?.split('=')[1];
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(editForm),
      });
      if (res.ok) {
        const updated = await res.json();
        setUserInfo({
          ...userInfo,
          username: updated.username,
          bio: updated.bio || '',
        });
        setEditing(false);
        message.success('资料已更新');
      } else {
        const err = await res.json();
        message.error(err.error || '更新失败');
      }
    } catch {
      message.error('更新失败');
    }
  }

  const tabs = [
    { key: 'projects', label: '我的项目', icon: '🎬' },
    { key: 'purchased', label: '已购模板', icon: '🛒' },
    { key: 'my-templates', label: '我的模板', icon: '👑' },
  ];

  return (
    <div>
      <PageHeader
        title="个人中心"
        breadcrumbs={[{ label: '工作台', href: '/dashboard' }, { label: '个人中心' }]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Profile + Tabs */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Card */}
          <GlassCard className="p-6">
            <div className="flex items-start gap-5">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 text-3xl font-bold text-purple-400 border border-purple-500/10">
                {userInfo.username.charAt(0)}
              </div>
              <div className="flex-1">
                {editing ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={editForm.username}
                      onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                    />
                    <textarea
                      value={editForm.bio}
                      onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                      rows={2}
                      className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 text-white resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                      placeholder="介绍一下自己..."
                    />
                    <div className="flex gap-2">
                      <GradientBtn size="sm" onClick={handleSave}>保存</GradientBtn>
                      <GradientBtn size="sm" variant="ghost" onClick={() => {
                        setEditForm({ username: userInfo.username, bio: userInfo.bio });
                        setEditing(false);
                      }}>取消</GradientBtn>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-3 mb-1">
                      <h2 className="text-xl font-bold text-white">{userInfo.username}</h2>
                      <span className="rounded-md bg-purple-500/10 px-2 py-0.5 text-[10px] text-purple-400 border border-purple-500/20">
                        {userInfo.memberLevel}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400">{userInfo.bio || '这个人很懒，什么都没写~'}</p>
                    <p className="text-xs text-gray-600 mt-1">{userInfo.email}</p>
                    <div className="mt-3">
                      <GradientBtn size="sm" variant="outline" onClick={() => setEditing(true)}>编辑资料</GradientBtn>
                    </div>
                  </>
                )}
              </div>
            </div>
          </GlassCard>

          {/* Tabs */}
          <div>
            <div className="flex gap-1 mb-4 bg-white/[0.02] rounded-xl p-1 border border-white/5">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition-all ${
                    activeTab === tab.key
                      ? 'bg-purple-500/20 text-purple-400 shadow-sm'
                      : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  <span className="mr-1.5">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>

            {activeTab === 'projects' && <MyProjectsTab />}
            {activeTab === 'purchased' && <PurchasedTab />}
            {activeTab === 'my-templates' && <MyTemplatesTab />}
          </div>
        </div>

        {/* Right: Stats + Membership */}
        <div className="space-y-6">
          <div className="space-y-4">
            <StatCard title="创作项目" value={stats.projects} accent="purple" />
            <StatCard title="角色总数" value={stats.characters} accent="cyan" />
            <StatCard title="已购模板" value={stats.purchasedTemplates} accent="pink" />
            <StatCard title="模板收益" value={stats.templateRevenue > 0 ? stats.templateRevenue.toFixed(2) : '0.00'} suffix="¥" accent="amber" />
          </div>

          {/* Membership */}
          <GlassCard className="p-6 text-center">
            <div className="flex h-14 w-14 mx-auto items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/5 mb-4">
              <svg className="h-7 w-7 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white">{userInfo.memberLevel}</h3>
            <p className="text-sm text-gray-400 mt-1">升级创作者版解锁更多额度</p>
            <ul className="mt-4 space-y-2 text-xs text-gray-500 text-left">
              <li className="flex items-center gap-2">
                <span className="text-emerald-400">✓</span> AI 生成额度 10次/月
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-400">✓</span> 模板购买无限制
              </li>
              <li className="flex items-center gap-2">
                <span className="text-gray-600">✗</span> 模板上架销售
              </li>
              <li className="flex items-center gap-2">
                <span className="text-gray-600">✗</span> 优先技术支持
              </li>
            </ul>
            <div className="mt-5">
              <GradientBtn className="w-full">升级会员</GradientBtn>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
