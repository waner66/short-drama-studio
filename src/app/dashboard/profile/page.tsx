'use client';

import { useState } from 'react';
import PageHeader from '@/components/ui/page-header';
import GlassCard from '@/components/ui/glass-card';
import StatCard from '@/components/ui/stat-card';
import GradientBtn from '@/components/ui/gradient-btn';
import EmptyState from '@/components/ui/empty-state';

// Projects tab content
function MyProjectsTab() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-400">创作项目</h3>
        <GradientBtn size="sm" variant="outline">
          + 新建项目
        </GradientBtn>
      </div>

      {[
        {
          title: '穿越之我在古代当总裁',
          status: '进行中',
          scenes: 8,
          chars: 4,
          progress: 75,
          updatedAt: '2026-06-29',
        },
        {
          title: '午夜调查局',
          status: '进行中',
          scenes: 3,
          chars: 6,
          progress: 35,
          updatedAt: '2026-06-20',
        },
        {
          title: '校园甜心日记',
          status: '已完成',
          scenes: 12,
          chars: 3,
          progress: 100,
          updatedAt: '2026-06-15',
        },
      ].map((proj, i) => (
        <GlassCard key={i} className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-white">{proj.title}</h4>
              <p className="text-xs text-gray-500 mt-1">
                {proj.scenes} 场景 · {proj.chars} 角色 · 更新于 {proj.updatedAt}
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
                  proj.status === '已完成'
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

function PurchasedTab() {
  return (
    <div className="space-y-4">
      {[
        { title: '霸道总裁爱上我 · 短剧模板', creator: '短剧达人王', date: '2026-06-25', price: 29.9 },
        { title: '校园甜心 · 青春短剧模板', creator: '青春制片人', date: '2026-06-18', price: 19.9 },
      ].map((tmpl, i) => (
        <GlassCard key={i} className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-white">{tmpl.title}</h4>
              <p className="text-xs text-gray-500 mt-1">
                创作者: {tmpl.creator} · 购买于 {tmpl.date}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-purple-400">¥{tmpl.price}</span>
              <GradientBtn size="sm" variant="ghost">
                立即使用
              </GradientBtn>
            </div>
          </div>
        </GlassCard>
      ))}
    </div>
  );
}

function MyTemplatesTab() {
  return (
    <EmptyState
      title="还没有上架模板"
      description="将完成的项目导出为模板，上架到模板市场即可赚取收益"
      actionLabel="了解如何上架"
      onAction={() => {}}
    />
  );
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('projects');
  const [editing, setEditing] = useState(false);
  const [userInfo] = useState({
    username: '创作者小明',
    bio: '热爱短剧创作，专注甜宠和古装题材',
    email: 'xiaoming@example.com',
    memberLevel: '免费版',
  });

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
                      defaultValue={userInfo.username}
                      className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                    />
                    <textarea
                      defaultValue={userInfo.bio}
                      rows={2}
                      className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 text-white resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                    />
                    <div className="flex gap-2">
                      <GradientBtn size="sm" onClick={() => setEditing(false)}>
                        保存
                      </GradientBtn>
                      <GradientBtn size="sm" variant="ghost" onClick={() => setEditing(false)}>
                        取消
                      </GradientBtn>
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
                    <p className="text-sm text-gray-400">{userInfo.bio}</p>
                    <p className="text-xs text-gray-600 mt-1">{userInfo.email}</p>
                    <div className="mt-3">
                      <GradientBtn size="sm" variant="outline" onClick={() => setEditing(true)}>
                        编辑资料
                      </GradientBtn>
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
            <StatCard
              title="创作项目"
              value={3}
              accent="purple"
              trend={50}
            />
            <StatCard
              title="角色总数"
              value={12}
              accent="cyan"
            />
            <StatCard
              title="已购模板"
              value={2}
              accent="pink"
            />
            <StatCard
              title="模板收益"
              value="0.00"
              suffix="¥"
              accent="amber"
            />
          </div>

          {/* Membership */}
          <GlassCard className="p-6 text-center">
            <div className="flex h-14 w-14 mx-auto items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/5 mb-4">
              <svg className="h-7 w-7 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white">免费版</h3>
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
