'use client';

import { useState } from 'react';
import { Card, Row, Col, Button, Tag, Typography, Space, Statistic, Modal, Form, Input, Select, InputNumber, message, Table } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, DollarOutlined, DownloadOutlined, EyeOutlined, CrownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import { officialTemplates } from '@/lib/data/character-templates';
import Link from 'next/link';

const { Title, Text } = Typography;

export default function MyTemplatesPage() {
  const [publishModal, setPublishModal] = useState(false);
  const [form] = Form.useForm();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <Space>
          <Title level={4} className="!mb-0">我的模板</Title>
          <Tag color="purple">创作者中心</Tag>
        </Space>
        <Space>
          <Link href="/dashboard/characters/templates">
            <Button icon={<EyeOutlined />}>浏览市场</Button>
          </Link>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => { setPublishModal(true); form.resetFields(); }}>
            发布新模板
          </Button>
        </Space>
      </div>

      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={12} sm={6}><Card size="small"><Statistic title="已发布" value={3} /></Card></Col>
        <Col xs={12} sm={6}><Card size="small"><Statistic title="总销量" value={47} /></Card></Col>
        <Col xs={12} sm={6}><Card size="small"><Statistic title="总收益" value={856.5} prefix="¥" precision={2} /></Card></Col>
        <Col xs={12} sm={6}><Card size="small"><Statistic title="月销量" value={12} prefix={<ArrowUpOutlined />} valueStyle={{ color: '#52c41a' }} /></Card></Col>
      </Row>

      <Card title="已上架模板">
        <Table
          dataSource={[
            { id: '1', name: '我的霸总模板', genre: '甜宠恋爱', price: 29.9, sales: 23, revenue: 586.7, status: 'PUBLISHED' },
            { id: '2', name: '古风侠女特制', genre: '古装仙侠', price: 19.9, sales: 15, revenue: 253.7, status: 'PUBLISHED' },
            { id: '3', name: '悬疑反派深度版', genre: '悬疑推理', price: 39.9, sales: 9, revenue: 305.2, status: 'PUBLISHED' },
          ]}
          columns={[
            { title: '模板名称', dataIndex: 'name', render: (v: string, r: any) => <Link href={`/dashboard/characters/templates/${r.id}`}><Text strong>{v}</Text></Link> },
            { title: '类型', dataIndex: 'genre', render: (v: string) => <Tag color="purple">{v}</Tag> },
            { title: '价格', dataIndex: 'price', render: (v: number) => <Text className="text-red-500">¥{v}</Text> },
            { title: '销量', dataIndex: 'sales' },
            { title: '收益', dataIndex: 'revenue', render: (v: number) => <Text className="text-green-600">¥{v}</Text> },
            { title: '状态', dataIndex: 'status', render: (v: string) => <Tag color="green">已上架</Tag> },
            { title: '操作', render: () => <Space><Button size="small" icon={<EyeOutlined />}>查看</Button><Button size="small" icon={<EditOutlined />}>编辑</Button><Button size="small" danger icon={<DeleteOutlined />}>下架</Button></Space> },
          ]}
          rowKey="id"
          pagination={false}
        />
      </Card>

      <Modal title="发布新模板" open={publishModal} onOk={() => { message.success('模板已提交审核'); setPublishModal(false); }} onCancel={() => setPublishModal(false)} width={560} okText="提交审核">
        <Form form={form} layout="vertical" initialValues={{ price: 19.9, genre: '甜宠恋爱' }}>
          <Form.Item label="从角色导出" required>
            <Select placeholder="选择已有角色..." options={[{ value: 'c1', label: '林小羽 - 甜宠女主' }, { value: 'c2', label: '陈墨 - 霸总' }]} />
          </Form.Item>
          <Form.Item name="name" label="模板名称" rules={[{ required: true }]}>
            <Input placeholder="例：我的霸总专属模板" />
          </Form.Item>
          <Form.Item name="description" label="模板描述">
            <Input.TextArea rows={2} placeholder="描述这个模板的亮点..." />
          </Form.Item>
          <Row gutter={16}>
            <Col span={8}><Form.Item name="genre" label="类型"><Select options={['甜宠恋爱','悬疑推理','古装仙侠','校园青春','逆袭爽文'].map(v=>({value:v,label:v}))} /></Form.Item></Col>
            <Col span={8}><Form.Item name="price" label="售价 ¥"><InputNumber min={0} max={199} precision={2} className="!w-full" /></Form.Item></Col>
            <Col span={8}><Form.Item name="archetype" label="角色原型"><Select options={['霸总','甜宠女主','深情男二','恶毒女配','搞笑担当'].map(v=>({value:v,label:v}))} /></Form.Item></Col>
          </Row>
          <div className="bg-blue-50 rounded-lg p-3 text-xs text-gray-600">
            平台抽成 15%，你实际获得售价的 85%。预计每单收益 ¥{(form.getFieldValue('price') || 19.9) * 0.85}
          </div>
        </Form>
      </Modal>
    </div>
  );
}
