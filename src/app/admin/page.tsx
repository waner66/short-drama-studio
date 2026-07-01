'use client';

import { Card, Row, Col, Statistic, Typography, Table, Tag, Progress } from 'antd';
import {
  TeamOutlined, FileProtectOutlined, ShoppingOutlined,
  DollarOutlined, RiseOutlined,
} from '@ant-design/icons';

const { Title } = Typography;

export default function AdminDashboard() {
  return (
    <div>
      <Title level={4} className="!mb-6">数据概览</Title>

      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={12} sm={6}><Card><Statistic title="总用户数" value={1256} prefix={<TeamOutlined />} /></Card></Col>
        <Col xs={12} sm={6}><Card><Statistic title="模板总数" value={89} prefix={<FileProtectOutlined />} /></Card></Col>
        <Col xs={12} sm={6}><Card><Statistic title="今日订单" value={34} prefix={<ShoppingOutlined />} /></Card></Col>
        <Col xs={12} sm={6}><Card><Statistic title="平台收入" value={4521} prefix={<DollarOutlined />} suffix="元" /></Card></Col>
      </Row>

      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12}><Card><Statistic title="今日新增用户" value={12} prefix={<RiseOutlined />} /></Card></Col>
        <Col xs={24} sm={12}><Card><Statistic title="待审核模板" value={3} valueStyle={{ color: '#faad14' }} /></Card></Col>
      </Row>

      <Card title="最近订单" className="mb-4">
        <Table
          dataSource={[
            { orderNo: 'OD20260629001', buyer: '用户A', template: '霸道总裁模板', amount: 29.9, status: 'PAID' },
            { orderNo: 'OD20260629002', buyer: '用户B', template: '古风穿越模板', amount: 49.9, status: 'PAID' },
          ]}
          columns={[
            { title: '订单号', dataIndex: 'orderNo' },
            { title: '买家', dataIndex: 'buyer' },
            { title: '模板', dataIndex: 'template' },
            { title: '金额', dataIndex: 'amount', render: (v: number) => `¥${v}` },
            { title: '状态', dataIndex: 'status', render: (v: string) => <Tag color="green">{v === 'PAID' ? '已支付' : v}</Tag> },
          ]}
          rowKey="orderNo"
          pagination={false}
          size="small"
        />
      </Card>

      <Card title="系统健康">
        <Row gutter={24}>
          <Col span={8}><Statistic title="CPU" value={23} suffix="%" /><Progress percent={23} size="small" /></Col>
          <Col span={8}><Statistic title="内存" value={45} suffix="%" /><Progress percent={45} size="small" /></Col>
          <Col span={8}><Statistic title="存储" value={32} suffix="%" /><Progress percent={32} size="small" /></Col>
        </Row>
      </Card>
    </div>
  );
}
