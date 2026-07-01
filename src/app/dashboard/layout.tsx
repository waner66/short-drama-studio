'use client';

import { useState, useEffect } from 'react';
import {
  Layout,
  Menu,
  Avatar,
  Typography,
  Button,
  Dropdown,
  Badge,
} from 'antd';
import {
  DashboardOutlined,
  TeamOutlined,
  FileTextOutlined,
  VideoCameraOutlined,
  ShopOutlined,
  UserOutlined,
  LogoutOutlined,
  CrownOutlined,
  ShoppingCartOutlined,
  PlayCircleOutlined,
  SettingOutlined,
  BellOutlined,
  ThunderboltOutlined,
  PlusOutlined,
  FireOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { useTheme } from '@/lib/theme-context';
import ThemeToggle from '@/components/ui/theme-toggle';
import MobileSidebar from '@/components/ui/mobile-sidebar';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState<{ username: string } | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        router.push('/auth/login');
      }
    }
  }, [router]);

  const menuItems: MenuProps['items'] = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: <Link href="/dashboard" className="no-underline">工作台</Link>,
    },
    {
      key: 'create',
      icon: <PlusOutlined style={{ color: '#5b2eff' }} />,
      label: <span className="text-brand-400 font-semibold">快速创建</span>,
      children: [
        {
          key: '/dashboard/projects/new',
          icon: <PlayCircleOutlined />,
          label: <Link href="/dashboard/projects/new" className="no-underline">新建项目</Link>,
        },
        {
          key: '/dashboard/characters/new',
          icon: <TeamOutlined />,
          label: <Link href="/dashboard/characters/new" className="no-underline">创建角色</Link>,
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
          label: <Link href="/dashboard/projects" className="no-underline">我的项目</Link>,
        },
        {
          key: '/dashboard/characters',
          icon: <TeamOutlined />,
          label: <Link href="/dashboard/characters" className="no-underline">角色管理</Link>,
        },
        {
          key: '/dashboard/scripts',
          icon: <FileTextOutlined />,
          label: <Link href="/dashboard/scripts" className="no-underline">剧本中心</Link>,
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
          label: <Link href="/dashboard/community" className="no-underline">社区广场</Link>,
        },
        {
          key: '/dashboard/market',
          icon: <ShopOutlined />,
          label: <Link href="/dashboard/market" className="no-underline">模板市场</Link>,
        },
        {
          key: '/dashboard/templates',
          icon: <CrownOutlined />,
          label: <Link href="/dashboard/templates" className="no-underline">我的模板</Link>,
        },
        {
          key: '/dashboard/orders',
          icon: <ShoppingCartOutlined />,
          label: <Link href="/dashboard/orders" className="no-underline">我的订单</Link>,
        },
      ],
    },
  ];

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: <Link href="/dashboard/profile" className="no-underline">个人中心</Link>,
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: <span>账号设置</span>,
    },
    { type: 'divider' },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      danger: true,
      onClick: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/');
      },
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
    <Layout className="min-h-screen">
      {/* Sidebar - hidden on mobile */}
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        width={240}
        className="!hidden lg:!block !bg-[var(--bg-card)] !border-r !border-[var(--border-color)]"
      >
        {/* Logo */}
        <Link href="/dashboard" className="no-underline">
          <div className="flex items-center gap-3 px-5 h-16" style={{ borderBottom: '1px solid var(--border-color)' }}>
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center shadow-lg shadow-brand-500/20 flex-shrink-0">
              <PlayCircleOutlined className="text-white text-sm" />
            </div>
            {!collapsed && (
              <span className="font-bold text-base whitespace-nowrap" style={{ color: 'var(--text-primary)' }}>短剧工坊</span>
            )}
          </div>
        </Link>

        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          defaultOpenKeys={['create', 'workspace', 'community']}
          items={menuItems}
          className="!border-r-0 !bg-transparent !mt-3"
          theme={isDark ? "dark" : "light"}
        />
      </Sider>

      <Layout>
        {/* Top Bar */}
        <Header className="!px-4 lg:!px-6 flex items-center justify-between !h-16" style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border-color)' }}>
          <div className="flex items-center gap-2">
            <MobileSidebar />
            <Link href="/dashboard" className="lg:hidden no-underline">
              <span className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>短剧工坊</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Badge dot offset={[-2, 2]}>
              <BellOutlined style={{ color: 'var(--text-muted)', fontSize: 18, cursor: 'pointer' }} />
            </Badge>
            <Link href="/dashboard/projects/new">
              <Button
                type="primary"
                size="small"
                icon={<PlusOutlined />}
                className="!rounded-lg !font-medium"
              >
                新建项目
              </Button>
            </Link>
            {user && (
              <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
                <div className="flex items-center gap-2 cursor-pointer px-2 py-1 rounded-lg hover:bg-[#1a1a3e] transition-colors">
                  <Avatar
                    icon={<UserOutlined />}
                    size={32}
                    style={{ background: 'linear-gradient(135deg, #5b2eff, #00d4aa)' }}
                  />
                  <Text style={{ color: 'var(--text-secondary)' }} className="text-sm font-medium">{user.username}</Text>
                </div>
              </Dropdown>
            )}
          </div>
        </Header>

        <Content style={{ background: 'var(--bg-primary)', minHeight: 'calc(100vh - 64px)', overflow: 'auto' }} className="!p-4 lg:!p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </Content>
      </Layout>
    </Layout>
  );
}
