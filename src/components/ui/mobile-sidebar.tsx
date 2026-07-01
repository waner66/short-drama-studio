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
  UserOutlined,
  DollarOutlined,
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

  const menuItems: MenuProps['items'] = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: <Link href="/dashboard" onClick={() => setOpen(false)}>发现首页</Link>,
    },
    { type: 'divider' as const },
    {
      key: 'discover',
      icon: <ShopOutlined style={{ color: '#ffb020' }} />,
      label: <span style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-muted)' }}>发现</span>,
      children: [
        {
          key: '/dashboard/market',
          icon: <ShopOutlined />,
          label: <Link href="/dashboard/market" onClick={() => setOpen(false)}>模板市场</Link>,
        },
        {
          key: '/dashboard/community',
          icon: <FireOutlined />,
          label: <Link href="/dashboard/community" onClick={() => setOpen(false)}>社区广场</Link>,
        },
      ],
    },
    { type: 'divider' as const },
    {
      key: 'trade',
      icon: <ShoppingCartOutlined style={{ color: '#00d4aa' }} />,
      label: <span style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-muted)' }}>交易</span>,
      children: [
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
    { type: 'divider' as const },
    {
      key: 'create',
      icon: <ThunderboltOutlined style={{ color: '#c084fc' }} />,
      label: <span style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-muted)' }}>创作</span>,
      children: [
        {
          key: '/dashboard/projects/new',
          icon: <PlusOutlined />,
          label: <Link href="/dashboard/projects/new" onClick={() => setOpen(false)}>新建项目</Link>,
        },
        {
          key: '/dashboard/characters/new',
          icon: <TeamOutlined />,
          label: <Link href="/dashboard/characters/new" onClick={() => setOpen(false)}>创建角色</Link>,
        },
        {
          key: '/dashboard/projects',
          icon: <VideoCameraOutlined />,
          label: <Link href="/dashboard/projects" onClick={() => setOpen(false)}>我的项目</Link>,
        },
        {
          key: '/dashboard/scripts',
          icon: <FileTextOutlined />,
          label: <Link href="/dashboard/scripts" onClick={() => setOpen(false)}>剧本中心</Link>,
        },
      ],
    },
    { type: 'divider' as const },
    {
      key: '/dashboard/profile',
      icon: <UserOutlined />,
      label: <Link href="/dashboard/profile" onClick={() => setOpen(false)}>个人主页</Link>,
    },
  ];

  let selectedKey = '/dashboard';
  for (const item of menuItems || []) {
    if (item && 'key' in item && item.key) {
      const key = item.key as string;
      if (key === 'discover' || key === 'trade' || key === 'create') continue;
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
          defaultOpenKeys={['discover', 'trade', 'create']}
          items={menuItems}
          className="!border-r-0 !bg-transparent !mt-2"
          theme={theme === 'dark' ? 'dark' : 'light'}
        />
      </Drawer>
    </>
  );
}
