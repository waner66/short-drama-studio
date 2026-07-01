'use client';

import { useEffect, useState } from 'react';
import { Card, Table, Tag, Typography, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const { Title } = Typography;

interface UserItem {
  id: string;
  username: string;
  email: string | null;
  phone: string | null;
  role: string;
  status: string;
  templates: number;
  orders: number;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  async function loadUsers(p = 1) {
    try {
      setLoading(true);
      const params = new URLSearchParams({ page: String(p), limit: '10' });
      if (search) params.set('search', search);
      const res = await fetch(`/api/admin/users?${params}`);
      if (res.ok) {
        const data = await res.json();
        setUsers(data.data || []);
        setTotal(data.pagination?.total || 0);
      }
    } catch { /* ignore */ } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadUsers(page); }, [page]);

  const roleLabels: Record<string, string> = { USER: '用户', CREATOR: '创作者', ADMIN: '管理员' };
  const roleColors: Record<string, string> = { USER: 'blue', CREATOR: 'purple', ADMIN: 'red' };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <Title level={4} className="!mb-0">用户管理</Title>
        <Input.Search
          prefix={<SearchOutlined />}
          placeholder="搜索用户名或邮箱..."
          style={{ width: 280 }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onSearch={() => { setPage(1); loadUsers(1); }}
          allowClear
        />
      </div>

      <Card>
        <Table
          dataSource={users}
          loading={loading}
          columns={[
            { title: 'ID', dataIndex: 'id', width: 100, ellipsis: true },
            { title: '用户名', dataIndex: 'username' },
            { title: '邮箱', dataIndex: 'email', render: (v: string | null) => v || '-' },
            { title: '手机', dataIndex: 'phone', render: (v: string | null) => v || '-' },
            {
              title: '角色',
              dataIndex: 'role',
              render: (v: string) => (
                <Tag color={roleColors[v] || 'blue'}>{roleLabels[v] || v}</Tag>
              ),
            },
            { title: '模板数', dataIndex: 'templates' },
            { title: '订单数', dataIndex: 'orders' },
            { title: '注册时间', dataIndex: 'createdAt' },
          ]}
          rowKey="id"
          pagination={{
            current: page,
            total,
            pageSize: 10,
            onChange: setPage,
            showTotal: (t) => `共 ${t} 条`,
          }}
        />
      </Card>
    </div>
  );
}
