'use client';

import { Card, Table, Tag, Select, Typography, Statistic, Row, Col } from 'antd';
import { ShoppingOutlined, DollarOutlined } from '@ant-design/icons';

const { Title } = Typography;

export default function AdminOrdersPage() {
  const orders = [
    { orderNo: 'OD20260629001', buyer: '用户A', seller: '短剧达人王', template: '霸道总裁模板', amount: 29.9, platformFee: 4.49, status: 'PAID', paidAt: '2026-06-29' },
    { orderNo: 'OD20260628001', buyer: '用户B', seller: '古风剧作家', template: '穿越古代模板', amount: 49.9, platformFee: 7.49, status: 'PAID', paidAt: '2026-06-28' },
    { orderNo: 'OD20260627001', buyer: '用户C', seller: '悬疑编剧李', template: '悬疑反转模板', amount: 39.9, platformFee: 5.99, status: 'REFUNDED', paidAt: '2026-06-27' },
  ];

  const totalRevenue = orders.filter(o => o.status === 'PAID').reduce((s, o) => s + o.platformFee, 0);

  return (
    <div>
      <Title level={4} className="!mb-6">订单管理</Title>

      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={12} sm={6}><Card><Statistic title="总订单" value={orders.length} prefix={<ShoppingOutlined />} /></Card></Col>
        <Col xs={12} sm={6}><Card><Statistic title="平台收益" value={totalRevenue} prefix={<DollarOutlined />} precision={2} suffix="元" /></Card></Col>
      </Row>

      <Card>
        <Table
          dataSource={orders}
          columns={[
            { title: '订单号', dataIndex: 'orderNo' },
            { title: '买家', dataIndex: 'buyer' },
            { title: '卖家', dataIndex: 'seller' },
            { title: '模板', dataIndex: 'template' },
            { title: '金额', dataIndex: 'amount', render: (v: number) => <span className="text-red-500">¥{v}</span> },
            { title: '平台抽成', dataIndex: 'platformFee', render: (v: number) => `¥${v}` },
            { title: '状态', dataIndex: 'status', render: (v: string) => (
              <Tag color={v === 'PAID' ? 'green' : 'red'}>{v === 'PAID' ? '已支付' : '已退款'}</Tag>
            )},
            { title: '支付时间', dataIndex: 'paidAt' },
          ]}
          rowKey="orderNo"
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
}
