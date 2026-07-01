'use client';

import { useState } from 'react';
import { Drawer, Menu, Button } from 'antd';
import {
  MenuOutlined,
  DashboardOutlined,
  TeamOutlined,
  FileTextOutlined,
  VideoCameraOutlined,
  ShopOutlined,
  ShoppingCartOutlined,
  PlayCircleOutlined,
  CrownOutlined,
  PlusOutlined,
  ThunderboltOutlined,
  FireOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useTheme } from '@/lib/theme-context';
import ThemeToggle from '@/components/ui/theme-toggle';

interface MobileSidebarProps {
  className?: string;
}

export default function MobileSidebar({ className = '' }: MobileSidebarProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { theme } = useTheme();
  const [collapsed, setCollapsed] = useState(true);

  const menuItems: MenuProps['items'] = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: <Link href="/dashboard" onClick={() => setOpen(false)}>工作台</Link>,
    },
    {
      key: 'create',
      icon: <PlusOutlined style={{ color: '#5b2eff' }} />,
      label: <span className="text-brand-400 font-semibold">快速创建</span>,
      children: [
        {
          key: '/dashboard/projects/new',
          icon: <PlayCircleOutlined />,
          label: <Link href="/dashboard/projects/new" onClick={() => setOpen(false)}>新建项目</Link>,
        },
        {
          key: '/dashboard/characters/new',
          icon: <TeamOutlined />,
          label: <Link href="/dashboard/characters/new" onClick={() => setOpen(false)}>创建角色</Link>,
        },
      ],
    },
    { type: 'divider' },
    {
      key: 'workspace',
      icon: <ThunderboltOutlined style={{ color: '#7c5cff' }} />,
      label: <span className="font-semibold">创作空间</span>,
      children: [
        {
          key: '/dashboard/projects',
          icon: <VideoCameraOutlined />,
          label: <Link href="/dashboard/projects" onClick={() => setOpen(false)}>我的项目</Link>,
        },
        {
          key: '/dashboard/characters',
          icon: <TeamOutlined />,
          label: <Link href="/dashboard/characters" onClick={() => setOpen(false)}>角色管理</Link>,
        },
        {
          key: '/dashboard/scripts',
          icon: <FileTextOutlined />,
          label: <Link href="/dashboard/scripts" onClick={() => setOpen(false)}>剧本中心</Link>,
        },
      ],
    },
    { type: 'divider' },
    {
      key: 'community',
      icon: <FireOutlined style={{ color: '#ff5c6c' }} />,
      label: <span className="font-semibold">社区市场</span>,
      children: [
        {
          key: '/dashboard/community',
          icon: <FireOutlined />,
          label: <Link href="/dashboard/community" onClick={() => setOpen(false)}>社区广场</Link>,
        },
        {
          key: '/dashboard/market',
          icon: <ShopOutlined />,
          label: <Link href="/dashboard/market" onClick={() => setOpen(false)}>模板市场</Link>,
        },
        {
          key: '/dashboard/templates',
          icon: <CrownOutlined />,
          label: <Link href="/dashboard/templates" onClick={() => setOpen(false)}>我的模板</Link>,
        },
        {
          key: '/dashboard/orders',
          icon: <ShoppingCartOutlined />,
          label: <Link href="/dashboard/orders" onClick={() => setOpen(false)}>我的订单</Link>,
        },
      ],
    },
  ];

  let selectedKey = '/dashboard';
  for (const item of menuItems || []) {
    if (item && 'key' in item && item.key) {
      const key = item.key as string;
      if (key === 'create' || key === 'workspace' || key === 'community') continue;
      if (pathname === key || (pathname && pathname.startsWith(key + '/'))) {
        selectedKey = key;
        break;
      }
    }
  }

  return (
    <>
      <Button
        type="text"
        icon={<MenuOutlined style={{ fontSize: 20 }} />}
        onClick={() => setOpen(true)}
        className={`lg:hidden ${className}`}
        style={{ color: 'var(--text-primary)' }}
      />
      <Drawer
        placement="left"
        onClose={() => setOpen(false)}
        open={open}
        width={280}
        styles={{
          body: { padding: 0, background: 'var(--bg-card)' },
          header: { background: 'var(--bg-card)', borderBottom: '1px solid var(--border-color)' },
        }}
        title={
          <div className="flex items-center justify-between">
            <Link href="/dashboard" onClick={() => setOpen(false)} className="flex items-center gap-2 no-underline">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center shadow-lg shadow-brand-500/20">
                <PlayCircleOutlined className="text-white text-sm" />
              </div>
              <span className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>短剧工坊</span>
            </Link>
            <ThemeToggle />
          </div>
        }
      >
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          defaultOpenKeys={['create', 'workspace', 'community']}
          items={menuItems}
          className="!border-r-0 !bg-transparent !mt-2"
          theme={theme === 'dark' ? 'dark' : 'light'}
        />
      </Drawer>
    </>
  );
}
