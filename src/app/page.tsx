'use client';

import { useState, useEffect, useRef } from 'react';
import { Button, Typography, Tag, Avatar } from 'antd';
import {
  ThunderboltOutlined,
  EnvironmentOutlined,
  FileTextOutlined,
  TeamOutlined,
  RightOutlined,
  StarFilled,
  FireOutlined,
  CrownOutlined,
  DownloadOutlined,
  PlayCircleOutlined,
  ArrowRightOutlined,
} from '@ant-design/icons';
import Link from 'next/link';

const { Title, Text, Paragraph } = Typography;

const coreFeatures = [
  {
    id: 'character',
    icon: <TeamOutlined />,
    gradient: 'from-violet-600 to-purple-500',
    glow: 'rgba(124, 92, 255, 0.3)',
    title: '人物设定',
    subtitle: 'AI Character Design',
    points: ['AI 智能生成角色形象', '性格/背景/外貌一键定义', '多角色关系图谱可视化'],
    cta: '创建角色',
    link: '/auth/register',
  },
  {
    id: 'scene',
    icon: <EnvironmentOutlined />,
    gradient: 'from-cyan-500 to-teal-400',
    glow: 'rgba(0, 212, 170, 0.3)',
    title: '场景设定',
    subtitle: 'Scene Builder',
    points: ['60+ 预设场景模板', 'AI 自动生成场景描述', '时间/地点/氛围三维定义'],
    cta: '探索场景',
    link: '/auth/register',
  },
  {
    id: 'script',
    icon: <FileTextOutlined />,
    gradient: 'from-amber-500 to-orange-400',
    glow: 'rgba(255, 176, 32, 0.3)',
    title: '剧本设定',
    subtitle: 'AI Script Engine',
    points: ['一句话梗概生成完整剧本', '多幕结构智能编排', '角色对话自动生成'],
    cta: '写剧本',
    link: '/auth/register',
  },
  {
    id: 'community',
    icon: <CrownOutlined />,
    gradient: 'from-rose-500 to-pink-400',
    glow: 'rgba(255, 92, 108, 0.3)',
    title: '社区共创',
    subtitle: 'Creator Community',
    points: ['优质模板交易市场', '创作者关注与互动', '热门排行发现好内容'],
    cta: '逛社区',
    link: '/dashboard/market',
  },
];

const trendingTemplates = [
  { id: '1', title: '霸道总裁爱上我', category: '甜宠恋爱', sales: 1234, rating: 4.8, price: 29.9 },
  { id: '2', title: '穿越古代当首富', category: '古装仙侠', sales: 856, rating: 4.6, price: 49.9 },
  { id: '3', title: '悬疑反转8分钟', category: '悬疑推理', sales: 671, rating: 4.9, price: 39.9 },
  { id: '4', title: '校园甜心青春剧', category: '校园青春', sales: 2103, rating: 4.5, price: 19.9 },
];

const steps = [
  { label: '创建角色', icon: <TeamOutlined />, color: '#7c5cff' },
  { label: '设计场景', icon: <EnvironmentOutlined />, color: '#00d4aa' },
  { label: '编写剧本', icon: <FileTextOutlined />, color: '#ffb020' },
  { label: '导出成品', icon: <PlayCircleOutlined />, color: '#ff5c6c' },
];

export default function HomePage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a14] text-[#f0f0ff] overflow-x-hidden">
      {/* ===== Navbar ===== */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[#12122a]/90 backdrop-blur-xl border-b border-[#2a2a4a]/50'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group no-underline">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center shadow-lg shadow-brand-500/20">
              <PlayCircleOutlined className="text-white text-lg" />
            </div>
            <span className="text-white font-bold text-lg tracking-tight">短剧工坊</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/auth/login">
              <Button type="text" className="!text-[#9494b8] hover:!text-white !font-medium">
                登录
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button
                type="primary"
                className="!rounded-xl !h-10 !px-6 !font-semibold !text-sm"
              >
                免费开始创作
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* ===== Hero Section ===== */}
      <section className="relative pt-32 pb-24 px-4 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="absolute inset-0 bg-hero-grid bg-[size:48px_48px]" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-brand-500/10 rounded-full blur-[128px] animate-pulse-glow" />
        <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-accent-500/8 rounded-full blur-[96px]" />

        <div className="relative max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/20 mb-8 animate-fade-in">
            <div className="pulse-dot" />
            <span className="text-brand-400 text-sm font-medium">AI + 社区驱动的创作平台</span>
          </div>

          {/* Main Title */}
          <Title
            level={1}
            className="!text-5xl md:!text-7xl !font-extrabold !text-white !mb-6 !leading-tight"
            style={{ fontFamily: '"Space Grotesk", "Noto Sans SC", sans-serif' }}
          >
            一个人，
            <br />
            就是一支
            <span className="gradient-text"> 剧组</span>
          </Title>

          <Paragraph className="!text-lg !text-[#9494b8] max-w-2xl mx-auto !mb-10 animate-slide-up">
            AI 赋能短剧创作全流程——从<span className="text-brand-400 font-semibold">人物设定</span>、
            <span className="text-accent-500 font-semibold">场景搭建</span>、到
            <span className="text-amber-400 font-semibold">剧本生成</span>，
            配合<span className="text-rose-400 font-semibold">创作者社区</span>，让灵感即刻成片。
          </Paragraph>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link href="/auth/register">
              <Button
                type="primary"
                size="large"
                className="!h-14 !px-10 !text-lg !font-bold !rounded-2xl"
                icon={<ThunderboltOutlined />}
              >
                立即免费开始
              </Button>
            </Link>
            <Link href="/dashboard/market">
              <Button
                size="large"
                className="!h-14 !px-10 !text-lg !font-medium !rounded-2xl !bg-[#1a1a3e] !border-[#2a2a4a] !text-[#f0f0ff] hover:!border-brand-500 hover:!text-brand-400"
              >
                浏览社区模板
                <ArrowRightOutlined className="ml-2" />
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 max-w-md mx-auto gap-6">
            {[
              { num: '1,200+', label: '创作者入驻' },
              { num: '3,800+', label: '短剧模板' },
              { num: '98%', label: 'AI生成满意度' },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl font-bold text-white" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
                  {s.num}
                </div>
                <div className="text-xs text-[#6b6b8a] mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Core Features - Bento Grid ===== */}
      <section className="max-w-6xl mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <Tag color="purple" className="!bg-brand-500/10 !border-brand-500/20 !text-brand-400 !px-4 !py-1 !rounded-full !text-xs !mb-4">
            核心能力
          </Tag>
          <Title level={2} className="!text-4xl md:!text-5xl !font-bold !text-white !mb-4" style={{ fontFamily: '"Space Grotesk", "Noto Sans SC", sans-serif' }}>
            一站式<span className="gradient-text">短剧创作</span>工作流
          </Title>
          <Paragraph className="!text-[#9494b8] !text-lg max-w-xl mx-auto">
            从创意萌芽到成品输出，四大核心模块覆盖创作全生命周期
          </Paragraph>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {coreFeatures.map((feat) => (
            <Link key={feat.id} href={feat.link} className="no-underline group">
              <div className="glass glass-hover p-8 relative overflow-hidden h-full cursor-pointer">
                {/* Gradient blob */}
                <div
                  className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-20 blur-3xl transition-all duration-500 group-hover:opacity-40 group-hover:scale-150"
                  style={{ background: feat.glow }}
                />
                {/* Icon */}
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feat.gradient} flex items-center justify-center text-white text-2xl mb-5 shadow-lg`}
                >
                  {feat.icon}
                </div>
                {/* Content */}
                <div className="relative">
                  <div className="flex items-center gap-3 mb-3">
                    <Title level={3} className="!text-2xl !font-bold !text-white !mb-0">
                      {feat.title}
                    </Title>
                    <span className="text-xs text-[#6b6b8a] font-medium px-2 py-0.5 rounded-full bg-[#1a1a3e] border border-[#2a2a4a]">
                      {feat.subtitle}
                    </span>
                  </div>
                  <ul className="space-y-2 mb-6">
                    {feat.points.map((p, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-[#9494b8]">
                        <span className="w-1 h-1 rounded-full bg-brand-400" />
                        {p}
                      </li>
                    ))}
                  </ul>
                  <span className="inline-flex items-center gap-1 text-brand-400 text-sm font-semibold group-hover:gap-2 transition-all">
                    {feat.cta}
                    <RightOutlined className="text-xs" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== Workflow ===== */}
      <section className="relative py-24 px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-500/3 to-transparent" />
        <div className="relative max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <Tag color="cyan" className="!bg-accent-500/10 !border-accent-500/20 !text-accent-500 !px-4 !py-1 !rounded-full !text-xs !mb-4">
              一体化流程
            </Tag>
            <Title level={2} className="!text-4xl md:!text-5xl !font-bold !text-white !mb-4" style={{ fontFamily: '"Space Grotesk", "Noto Sans SC", sans-serif' }}>
              四步搞定，<span className="gradient-text">像发朋友圈</span>一样简单
            </Title>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative">
            {/* Connection line */}
            <div className="hidden md:block absolute top-12 left-[calc(12.5%+32px)] right-[calc(12.5%+32px)] h-[2px] bg-gradient-to-r from-brand-500 via-accent-500 to-rose-400 opacity-30" />

            {steps.map((step, i) => (
              <div key={i} className="flex flex-col items-center gap-4 relative z-10 flex-1">
                <div
                  className="w-24 h-24 rounded-[28px] flex items-center justify-center text-3xl text-white shadow-xl transition-transform hover:scale-110 duration-300"
                  style={{ background: `linear-gradient(135deg, ${step.color}, ${step.color}88)` }}
                >
                  {step.icon}
                </div>
                <div className="text-center">
                  <div className="text-[#6b6b8a] text-xs font-medium mb-1">STEP {i + 1}</div>
                  <div className="text-white font-bold text-lg">{step.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Community ===== */}
      <section className="max-w-6xl mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <Tag color="magenta" className="!bg-rose-500/10 !border-rose-500/20 !text-rose-400 !px-4 !py-1 !rounded-full !text-xs !mb-4">
            社区共创
          </Tag>
          <Title level={2} className="!text-4xl md:!text-5xl !font-bold !text-white !mb-4" style={{ fontFamily: '"Space Grotesk", "Noto Sans SC", sans-serif' }}>
            灵感<span className="gradient-text-warm">碰撞</span>，社区驱动创作
          </Title>
          <Paragraph className="!text-[#9494b8] !text-lg max-w-xl mx-auto">
            发现优质模板，关注创作达人，让每一次创作都有社区的陪伴
          </Paragraph>
        </div>

        {/* Trending cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {trendingTemplates.map((tpl) => (
            <div key={tpl.id} className="glass glass-hover p-5 group cursor-pointer">
              <div className="w-full h-32 rounded-xl bg-gradient-to-br from-brand-500/20 to-accent-500/10 flex items-center justify-center mb-4 border border-[#2a2a4a] relative overflow-hidden">
                <PlayCircleOutlined className="text-5xl text-brand-400/30" />
                <Tag
                  color="purple"
                  className="!absolute !top-2 !left-2 !bg-brand-500/30 !border-brand-500/30 !text-white !text-xs !rounded-lg"
                >
                  {tpl.category}
                </Tag>
              </div>
              <div className="flex items-start justify-between mb-2">
                <Text strong className="!text-white !text-sm">{tpl.title}</Text>
                <span className="text-accent-500 font-bold text-sm">¥{tpl.price}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-xs text-[#6b6b8a]">
                  <StarFilled className="text-yellow-500" />
                  {tpl.rating}
                </span>
                <span className="text-xs text-[#6b6b8a]">
                  <DownloadOutlined className="mr-1" />
                  {tpl.sales.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link href="/dashboard/market">
            <Button
              size="large"
              className="!h-12 !px-8 !rounded-xl !bg-transparent !border-brand-500 !text-brand-400 hover:!bg-brand-500/10 !font-semibold"
            >
              探索更多模板
              <ArrowRightOutlined className="ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* ===== CTA Banner ===== */}
      <section className="max-w-5xl mx-auto px-4 py-24">
        <div className="glass p-12 md:p-16 text-center relative overflow-hidden rounded-[32px] glow-brand">
          <div className="absolute inset-0 bg-card-glow" />
          <div className="relative">
            <Title level={2} className="!text-3xl md:!text-4xl !font-bold !text-white !mb-4" style={{ fontFamily: '"Space Grotesk", "Noto Sans SC", sans-serif' }}>
              准备好创作你的<span className="gradient-text">第一部短剧</span>了吗？
            </Title>
            <Paragraph className="!text-[#9494b8] !text-lg !mb-8 max-w-lg mx-auto">
              免费注册即可使用全部 AI 创作功能，加入 1,200+ 创作者社区。
            </Paragraph>
            <Link href="/auth/register">
              <Button
                type="primary"
                size="large"
                className="!h-14 !px-12 !text-lg !font-bold !rounded-2xl"
                icon={<ThunderboltOutlined />}
              >
                免费开始创作
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== Footer ===== */}
      <footer className="border-t border-[#2a2a4a] py-12 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center">
              <PlayCircleOutlined className="text-white text-sm" />
            </div>
            <span className="text-[#6b6b8a] text-sm">短剧工坊 &copy; 2026</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-[#6b6b8a]">
            <span>AI人物设定</span>
            <span className="w-1 h-1 rounded-full bg-[#2a2a4a]" />
            <span>AI场景搭建</span>
            <span className="w-1 h-1 rounded-full bg-[#2a2a4a]" />
            <span>AI剧本生成</span>
            <span className="w-1 h-1 rounded-full bg-[#2a2a4a]" />
            <span>社区共创</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
