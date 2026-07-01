'use client';

import { useEffect, useState } from 'react';
import { Card, Table, Tag, Typography, Statistic, Row, Col } from 'antd';
import { ShoppingOutlined, DollarOutlined } from '@ant-design/icons';

const { Title } = Typography;

interface OrderItem {
  id: string;
  orderNo: string;
  buyer: string;
  seller: string;
  template: string;
  amount: number;
  platformFee: number;
  status: string;
  paidAt: string | null;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  async function loadOrders(p = 1) {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/orders?page=${p}&limit=10`);
      if (res.ok) {
        const data = await res.json();
        setOrders(data.data || []);
        setTotal(data.pagination?.total || 0);
      }
    } catch { /* ignore */ } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadOrders(page); }, [page]);

  const totalRevenue = orders
    .filter(o => o.status === 'PAID')
    .reduce((s, o) => s + o.platformFee, 0);

  const statusLabels: Record<string, string> = {
    PAID: '已支付',
    PENDING: '待支付',
    REFUNDED: '已退款',
    CANCELLED: '已取消',
  };
  const statusColors: Record<string, string> = {
    PAID: 'green',
    PENDING: 'orange',
    REFUNDED: 'red',
    CANCELLED: 'default',
  };

  return (
    <div>
      <Title level={4} className="!mb-6">订单管理</Title>

      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={12} sm={6}>
          <Card><Statistic title="总订单" value={total} prefix={<ShoppingOutlined />} /></Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card><Statistic title="平台收益" value={totalRevenue.toFixed(2)} prefix={<DollarOutlined />} suffix="元" /></Card>
        </Col>
      </Row>

      <Card>
        <Table
          dataSource={orders}
          loading={loading}
          columns={[
            { title: '订单号', dataIndex: 'orderNo' },
            { title: '买家', dataIndex: 'buyer' },
            { title: '卖家', dataIndex: 'seller' },
            { title: '模板', dataIndex: 'template' },
            { title: '金额', dataIndex: 'amount', render: (v: number) => <span className="text-red-500">¥{v.toFixed(1)}</span> },
            { title: '平台抽成', dataIndex: 'platformFee', render: (v: number) => `¥${v.toFixed(2)}` },
            {
              title: '状态',
              dataIndex: 'status',
              render: (v: string) => (
                <Tag color={statusColors[v] || 'default'}>{statusLabels[v] || v}</Tag>
              ),
            },
            { title: '支付时间', dataIndex: 'paidAt', render: (v: string | null) => v ? v.slice(0, 10) : '-' },
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
