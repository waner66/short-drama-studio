'use client';

import { useEffect, useState } from 'react';
import { Typography, Card, Row, Col, Statistic, Tag, Button } from 'antd';
import {
  TeamOutlined,
  FileTextOutlined,
  VideoCameraOutlined,
  PlusOutlined,
  PlayCircleOutlined,
  FireOutlined,
  RiseOutlined,
  EnvironmentOutlined,
  ArrowRightOutlined,
} from '@ant-design/icons';
import Link from 'next/link';

const { Title, Text } = Typography;

const quickActions = [
  {
    icon: <TeamOutlined />,
    title: '创建角色',
    desc: 'AI 智能生成角色设定',
    gradient: 'from-violet-600 to-purple-500',
    glow: 'rgba(124,92,255,0.25)',
    link: '/dashboard/characters/new',
  },
  {
    icon: <EnvironmentOutlined />,
    title: '设计场景',
    desc: '预设场景 + AI 扩展',
    gradient: 'from-cyan-500 to-teal-400',
    glow: 'rgba(0,212,170,0.25)',
    link: '/dashboard/projects/new',
  },
  {
    icon: <FileTextOutlined />,
    title: '编写剧本',
    desc: '一句话生成完整剧本',
    gradient: 'from-amber-500 to-orange-400',
    glow: 'rgba(255,176,32,0.25)',
    link: '/dashboard/projects/new',
  },
  {
    icon: <PlayCircleOutlined />,
    title: '新建项目',
    desc: '整合角色场景剧本',
    gradient: 'from-rose-500 to-pink-400',
    glow: 'rgba(255,92,108,0.25)',
    link: '/dashboard/projects/new',
  },
];

export default function DashboardPage() {
  const [stats, setStats] = useState({ projects: 0, characters: 0, purchased: 0 });

  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      import('@/lib/store/data-service').then(({ projectService, characterService }) => {
        const projects = projectService.listByUser(user.id || 'anonymous');
        const characters = characterService.listByUser(user.id || 'anonymous');
        setStats({ projects: projects.length, characters: characters.length, purchased: 0 });
      });
    } catch {}
  }, []);

  return (
    <div>
      {/* Welcome */}
      <div className="mb-8">
        <Title level={3} className="!text-white !mb-1 !text-2xl">👋 欢迎回来</Title>
        <Text className="!text-[#6b6b8a]">继续你的短剧创作之旅</Text>
      </div>

      {/* Stats Row */}
      <Row gutter={[16, 16]} className="mb-8">
        {[
          { title: '我的项目', value: stats.projects, suffix: '个', color: '#7c5cff', icon: <VideoCameraOutlined /> },
          { title: '角色数量', value: stats.characters, suffix: '个', color: '#00d4aa', icon: <TeamOutlined /> },
          { title: '已购模板', value: 0, suffix: '个', color: '#ffb020', icon: <FileTextOutlined /> },
          { title: '社区热度', value: '🔥', suffix: '', color: '#ff5c6c', icon: <FireOutlined /> },
        ].map((item, i) => (
          <Col xs={24} sm={12} md={6} key={i}>
            <div className="glass p-5 relative overflow-hidden">
              <div
                className="absolute top-0 right-0 w-20 h-20 rounded-bl-3xl opacity-10"
                style={{ background: item.color }}
              />
              <Statistic
                title={<span className="!text-[#6b6b8a] text-xs font-medium">{item.title}</span>}
                value={item.value}
                suffix={<span className="text-sm text-[#6b6b8a]">{item.suffix}</span>}
                valueStyle={{ color: '#f0f0ff', fontSize: 28, fontWeight: 700 }}
                prefix={<span style={{ color: item.color, fontSize: 20 }}>{item.icon}</span>}
              />
            </div>
          </Col>
        ))}
      </Row>

      {/* Quick Actions */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <Title level={5} className="!text-[#9494b8] !mb-0 !font-medium">快速开始</Title>
        </div>
        <Row gutter={[16, 16]}>
          {quickActions.map((action, i) => (
            <Col xs={24} sm={12} md={6} key={i}>
              <Link href={action.link} className="no-underline">
                <div className="glass glass-hover p-6 text-center cursor-pointer group">
                  <div
                    className={`w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br ${action.gradient} flex items-center justify-center text-white text-xl mb-4 shadow-lg transition-transform duration-300 group-hover:scale-110`}
                    style={{ boxShadow: `0 8px 24px ${action.glow}` }}
                  >
                    {action.icon}
                  </div>
                  <div className="text-white font-semibold text-sm mb-1">{action.title}</div>
                  <div className="text-[#6b6b8a] text-xs">{action.desc}</div>
                  <div className="mt-3 text-brand-400 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                    开始 <ArrowRightOutlined />
                  </div>
                </div>
              </Link>
            </Col>
          ))}
        </Row>
      </div>

      {/* Recent + Community */}
      <Row gutter={[16, 16]}>
        <Col xs={24} md={14}>
          <div className="glass p-6">
            <div className="flex items-center justify-between mb-4">
              <Title level={5} className="!text-white !mb-0">最近项目</Title>
              <Link href="/dashboard/projects">
                <Button type="text" className="!text-brand-400 !text-xs">
                  查看全部 <ArrowRightOutlined />
                </Button>
              </Link>
            </div>
            {stats.projects === 0 ? (
              <div className="text-center py-10">
                <VideoCameraOutlined className="text-5xl text-[#2a2a4a]" />
                <div className="mt-4 text-[#6b6b8a] text-sm">
                  还没有项目，
                  <Link href="/dashboard/projects/new" className="text-brand-400 font-medium ml-1">
                    创建你的第一个短剧
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Dynamic project list would go here */}
              </div>
            )}
          </div>
        </Col>
        <Col xs={24} md={10}>
          <div className="glass p-6">
            <div className="flex items-center justify-between mb-4">
              <Title level={5} className="!text-white !mb-0">社区动态</Title>
              <Link href="/dashboard/market">
                <Button type="text" className="!text-brand-400 !text-xs">
                  探索 <ArrowRightOutlined />
                </Button>
              </Link>
            </div>
            <div className="space-y-3">
              {[
                { tag: '热门', text: '悬疑反转·8分钟短剧模板', icon: <FireOutlined className="text-rose-400" /> },
                { tag: '新品', text: '校园甜心·青春短剧模板', icon: <RiseOutlined className="text-accent-500" /> },
                { tag: '推荐', text: '霸道总裁爱上我·模板', icon: <PlayCircleOutlined className="text-brand-400" /> },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#1a1a3e] transition-colors cursor-pointer">
                  <div className="w-8 h-8 rounded-lg bg-[#1a1a3e] flex items-center justify-center flex-shrink-0">
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-sm truncate">{item.text}</div>
                  </div>
                  <Tag className="!bg-[#1a1a3e] !border-[#2a2a4a] !text-[#6b6b8a] !text-xs !rounded-lg !m-0">
                    {item.tag}
                  </Tag>
                </div>
              ))}
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
}
