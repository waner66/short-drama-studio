'use client';

import { Card, Table, Tag, Button, Space, Input, Typography } from 'antd';
import { SearchOutlined, LockOutlined, DeleteOutlined } from '@ant-design/icons';

const { Title } = Typography;

export default function AdminUsersPage() {
  const data = [
    { id: '1', username: '短剧达人王', email: 'daren@qq.com', phone: '138****8888', role: 'CREATOR', status: 'ACTIVE', createdAt: '2026-03-15' },
    { id: '2', username: '创作者小明', email: 'xiaoming@163.com', phone: '139****7777', role: 'USER', status: 'ACTIVE', createdAt: '2026-06-01' },
    { id: '3', username: '测试用户A', email: 'test@test.com', phone: null, role: 'USER', status: 'BANNED', createdAt: '2026-05-20' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <Title level={4} className="!mb-0">用户管理</Title>
        <Input prefix={<SearchOutlined />} placeholder="搜索用户..." style={{ width: 280 }} />
      </div>

      <Card>
        <Table
          dataSource={data}
          columns={[
            { title: 'ID', dataIndex: 'id' },
            { title: '用户名', dataIndex: 'username' },
            { title: '邮箱', dataIndex: 'email' },
            { title: '手机', dataIndex: 'phone' },
            { title: '角色', dataIndex: 'role', render: (v: string) => (
              <Tag color={v === 'CREATOR' ? 'purple' : v === 'ADMIN' ? 'red' : 'blue'}>
                {v === 'CREATOR' ? '创作者' : v === 'ADMIN' ? '管理员' : '用户'}
              </Tag>
            )},
            { title: '状态', dataIndex: 'status', render: (v: string) => (
              <Tag color={v === 'ACTIVE' ? 'green' : 'red'}>{v === 'ACTIVE' ? '正常' : '已封禁'}</Tag>
            )},
            { title: '注册时间', dataIndex: 'createdAt' },
            { title: '操作', render: () => (
              <Space>
                <Button size="small" icon={<LockOutlined />}>封禁</Button>
                <Button size="small" danger icon={<DeleteOutlined />}>删除</Button>
              </Space>
            )},
          ]}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
}
