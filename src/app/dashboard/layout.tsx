'use client';

import { useState, useEffect } from 'react';
import {
  Layout,
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
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useTheme } from '@/lib/theme-context';
import ThemeToggle from '@/components/ui/theme-toggle';
import MobileSidebar from '@/components/ui/mobile-sidebar';

const { Header, Content } = Layout;
const { Text } = Typography;

/* ---- Sidebar Nav Data ---- */
interface NavItem {
  key: string;
  label: string;
  icon: React.ReactNode;
  href: string;
}

interface NavGroup {
  key: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  children: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    key: 'discover', label: '发现', color: '#f59e0b',
    icon: <ShopOutlined />,
    children: [
      { key: '/dashboard/market', label: '模板市场', icon: <ShopOutlined />, href: '/dashboard/market' },
      { key: '/dashboard/community', label: '社区广场', icon: <FireOutlined />, href: '/dashboard/community' },
    ],
  },
  {
    key: 'trade', label: '交易', color: '#06b6d4',
    icon: <ShoppingCartOutlined />,
    children: [
      { key: '/dashboard/templates', label: '我的模板', icon: <CrownOutlined />, href: '/dashboard/templates' },
      { key: '/dashboard/orders', label: '我的订单', icon: <ShoppingCartOutlined />, href: '/dashboard/orders' },
    ],
  },
  {
    key: 'create', label: '创作', color: '#a855f7',
    icon: <ThunderboltOutlined />,
    children: [
      { key: '/dashboard/projects', label: '我的项目', icon: <VideoCameraOutlined />, href: '/dashboard/projects' },
      { key: '/dashboard/characters', label: '角色管理', icon: <TeamOutlined />, href: '/dashboard/characters' },
      { key: '/dashboard/scripts', label: '剧本中心', icon: <FileTextOutlined />, href: '/dashboard/scripts' },
    ],
  },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState<{ username: string } | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { theme } = useTheme();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try { setUser(JSON.parse(storedUser)); }
      catch { router.push('/auth/login'); }
    }
  }, [router]);

  /* active item detection */
  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname?.startsWith(href) ?? false;
  };

  const userMenuItems: MenuProps['items'] = [
    { key: 'profile', icon: <UserOutlined />, label: <Link href="/dashboard/profile" className="no-underline">个人中心</Link> },
    { key: 'settings', icon: <SettingOutlined />, label: <span>账号设置</span> },
    { type: 'divider' },
    { key: 'logout', icon: <LogoutOutlined />, label: '退出登录', danger: true,
      onClick: () => { localStorage.removeItem('token'); localStorage.removeItem('user'); router.push('/'); } },
  ];

  const siderWidth = collapsed ? 72 : 240;

  return (
    <div className="flex min-h-screen">
      {/* ====== CUSTOM SIDEBAR ====== */}
      <aside
        className="hidden lg:flex flex-col flex-shrink-0 border-r border-[var(--border-subtle)] transition-all duration-200"
        style={{ width: siderWidth, background: 'var(--surface-card)' }}
      >
        {/* Logo */}
        <Link href="/dashboard" className="no-underline">
          <div className="flex items-center gap-3 h-16 px-5 border-b border-[var(--border-subtle)]">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-400 flex items-center justify-center flex-shrink-0"
              style={{ boxShadow: '0 0 16px rgba(139,92,246,0.3)' }}>
              <PlayCircleOutlined className="text-white text-sm" />
            </div>
            {!collapsed && <span className="font-bold text-base whitespace-nowrap text-[var(--text-primary)]">短剧工坊</span>}
          </div>
        </Link>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-3 px-3 space-y-5">
          {/* Dashboard home */}
          <Link href="/dashboard" className="no-underline">
            <div className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 group ${
              isActive('/dashboard')
                ? 'bg-violet-500/10 border-l-[3px] border-violet-500 -ml-[3px]'
                : 'border-l-[3px] border-transparent hover:bg-[var(--surface-elevated)] -ml-[3px]'
            }`}>
              <DashboardOutlined className={`text-lg ${isActive('/dashboard') ? 'text-violet-400' : 'text-[var(--text-muted)]'} ${!collapsed ? '' : 'mx-auto'}`} />
              {!collapsed && <span className={`text-sm font-medium ${isActive('/dashboard') ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}>发现首页</span>}
            </div>
          </Link>

          {/* Groups */}
          {navGroups.map((group) => (
            <div key={group.key}>
              {!collapsed && (
                <div className="flex items-center gap-2 px-3 mb-1.5">
                  <span style={{ color: group.color, fontSize: 14 }}>{group.icon}</span>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">{group.label}</span>
                </div>
              )}
              {collapsed && <div className="h-2" />}
              <div className="space-y-0.5">
                {group.children.map((item) => (
                  <Link key={item.key} href={item.href} className="no-underline">
                    <div className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-150 group ${
                      isActive(item.href)
                        ? 'bg-violet-500/10 border-l-[3px] border-violet-500 -ml-[3px]'
                        : 'border-l-[3px] border-transparent hover:bg-[var(--surface-elevated)] -ml-[3px]'
                    }`}>
                      <span className={`text-base ${isActive(item.href) ? 'text-violet-400' : 'text-[var(--text-muted)] group-hover:text-[var(--text-secondary)]'} ${!collapsed ? '' : 'mx-auto'}`}>
                        {item.icon}
                      </span>
                      {!collapsed && (
                        <span className={`text-sm ${isActive(item.href) ? 'text-[var(--text-primary)] font-medium' : 'text-[var(--text-secondary)]'}`}>
                          {item.label}
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom: collapse + user */}
        <div className="border-t border-[var(--border-subtle)] p-3">
          {/* Collapse toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-[var(--surface-elevated)] text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors mb-1"
          >
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            {!collapsed && <span className="text-xs">收起菜单</span>}
          </button>

          {/* User */}
          {user && (
            <Dropdown menu={{ items: userMenuItems }} placement="topRight">
              <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[var(--surface-elevated)] cursor-pointer transition-colors">
                <Avatar
                  icon={<UserOutlined />}
                  size={28}
                  style={{ background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)', flexShrink: 0 }}
                />
                {!collapsed && (
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--text-primary)] truncate">{user.username}</p>
                    <p className="text-[10px] text-[var(--text-muted)]">创作者</p>
                  </div>
                )}
              </div>
            </Dropdown>
          )}
        </div>
      </aside>

      {/* ====== MAIN ====== */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-16 flex items-center justify-between px-4 lg:px-6 flex-shrink-0 border-b border-[var(--border-subtle)]"
          style={{ background: 'var(--surface-card)' }}>
          <div className="flex items-center gap-2">
            <MobileSidebar />
            <Link href="/dashboard" className="lg:hidden no-underline">
              <span className="font-bold text-base text-[var(--text-primary)]">短剧工坊</span>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Badge dot offset={[-2, 2]}>
              <BellOutlined style={{ color: 'var(--text-muted)', fontSize: 18, cursor: 'pointer' }} />
            </Badge>
            <Link href="/dashboard/projects/new">
              <Button type="primary" size="small" icon={<PlusOutlined />} className="!rounded-lg !font-medium">新建项目</Button>
            </Link>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto" style={{ background: 'var(--surface-ground)' }}>
          <div className={
            pathname?.startsWith('/dashboard/market') ? 'page-market' :
            pathname?.startsWith('/dashboard/community') ? 'page-community' :
            pathname?.startsWith('/dashboard/templates') || pathname?.startsWith('/dashboard/orders') || pathname?.startsWith('/dashboard/profile') ? 'page-creator' :
            'page-dashboard'
          }>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
