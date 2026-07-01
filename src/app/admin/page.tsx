'use client';

import { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Typography, Table, Tag } from 'antd';
import {
  TeamOutlined, FileProtectOutlined, ShoppingOutlined,
  DollarOutlined, RiseOutlined,
} from '@ant-design/icons';

const { Title } = Typography;

interface StatsData {
  totalUsers: number;
  totalTemplates: number;
  todayOrders: number;
  platformRevenue: number;
  todayNewUsers: number;
  pendingTemplates: number;
  recentOrders: Array<{
    orderNo: string;
    buyer: string;
    template: string;
    amount: number;
    status: string;
  }>;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<StatsData | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/admin/stats');
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch { /* ignore */ }
    }
    load();
  }, []);

  return (
    <div>
      <Title level={4} className="!mb-6">数据概览</Title>

      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={12} sm={6}>
          <Card>
            <Statistic title="总用户数" value={stats?.totalUsers ?? '-'} prefix={<TeamOutlined />} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic title="模板总数" value={stats?.totalTemplates ?? '-'} prefix={<FileProtectOutlined />} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic title="今日订单" value={stats?.todayOrders ?? '-'} prefix={<ShoppingOutlined />} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic title="平台收入" value={stats?.platformRevenue ?? '-'} prefix={<DollarOutlined />} suffix="元" />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12}>
          <Card>
            <Statistic title="今日新增用户" value={stats?.todayNewUsers ?? '-'} prefix={<RiseOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12}>
          <Card>
            <Statistic
              title="待审核模板"
              value={stats?.pendingTemplates ?? '-'}
              valueStyle={{ color: stats && stats.pendingTemplates > 0 ? '#faad14' : undefined }}
            />
          </Card>
        </Col>
      </Row>

      <Card title="最近订单" className="mb-4">
        <Table
          dataSource={stats?.recentOrders || []}
          columns={[
            { title: '订单号', dataIndex: 'orderNo' },
            { title: '买家', dataIndex: 'buyer' },
            { title: '模板', dataIndex: 'template' },
            { title: '金额', dataIndex: 'amount', render: (v: number) => `¥${v}` },
            { title: '状态', dataIndex: 'status', render: (v: string) => (
              <Tag color={v === 'PAID' ? 'green' : 'orange'}>
                {v === 'PAID' ? '已支付' : v === 'PENDING' ? '待支付' : v}
              </Tag>
            )},
          ]}
          rowKey="orderNo"
          pagination={false}
          size="small"
          locale={{ emptyText: '暂无订单' }}
        />
      </Card>
    </div>
  );
}
