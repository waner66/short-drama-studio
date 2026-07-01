'use client';

import { useState } from 'react';
import { Layout, Menu, Typography, Avatar, Space, Dropdown } from 'antd';
import {
  DashboardOutlined,
  TeamOutlined,
  FileProtectOutlined,
  ShoppingOutlined,
  SettingOutlined,
  UserOutlined,
  LogoutOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const menuItems: MenuProps['items'] = [
    { key: '/admin', icon: <DashboardOutlined />, label: <Link href="/admin">数据概览</Link> },
    { key: '/admin/users', icon: <TeamOutlined />, label: <Link href="/admin/users">用户管理</Link> },
    { key: '/admin/templates', icon: <FileProtectOutlined />, label: <Link href="/admin/templates">模板审核</Link> },
    { key: '/admin/orders', icon: <ShoppingOutlined />, label: <Link href="/admin/orders">订单管理</Link> },
    { key: '/admin/settings', icon: <SettingOutlined />, label: <Link href="/admin/settings">系统设置</Link> },
  ];

  let selectedKey = '/admin';
  for (const item of menuItems || []) {
    if (item && 'key' in item && item.key && (pathname === item.key || pathname.startsWith(item.key + '/'))) {
      selectedKey = item.key as string;
      break;
    }
  }

  const userMenuItems: MenuProps['items'] = [
    { key: 'profile', icon: <UserOutlined />, label: '账号设置' },
    { type: 'divider' },
    { key: 'logout', icon: <LogoutOutlined />, label: '返回前台', danger: true, onClick: () => router.push('/dashboard') },
  ];

  return (
    <Layout className="min-h-screen">
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed} theme="dark" width={220}>
        <div className="flex items-center gap-3 p-4 h-16">
          <VideoCameraOutlined style={{ fontSize: 24, color: '#1677ff' }} />
          {!collapsed && <Title level={5} className="!mb-0 !text-white whitespace-nowrap">管理后台</Title>}
        </div>
        <Menu mode="inline" theme="dark" selectedKeys={[selectedKey]} items={menuItems} />
      </Sider>
      <Layout>
        <Header className="!bg-gray-900 !px-6 flex items-center justify-end !h-16">
          <Space>
            <Text className="!text-gray-400">管理员</Text>
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#1677ff', cursor: 'pointer' }} />
            </Dropdown>
          </Space>
        </Header>
        <Content className="!p-6 !bg-gray-100 overflow-auto">{children}</Content>
      </Layout>
    </Layout>
  );
}
