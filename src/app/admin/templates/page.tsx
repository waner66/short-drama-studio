'use client';

import { useEffect, useState } from 'react';
import { Card, Table, Tag, Button, Space, Typography, Modal, message } from 'antd';
import { EyeOutlined, CheckOutlined, CloseOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { confirm } = Modal;

interface TemplateItem {
  id: string;
  title: string;
  creator: string;
  price: number;
  status: string;
  submittedAt: string;
  salesCount: number;
}

export default function AdminTemplatesPage() {
  const [templates, setTemplates] = useState<TemplateItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  async function loadTemplates(p = 1) {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/templates?status=REVIEWING&page=${p}&limit=20`);
      if (res.ok) {
        const data = await res.json();
        setTemplates(data.data || []);
        setTotal(data.pagination?.total || 0);
      }
    } catch { /* ignore */ } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadTemplates(page); }, [page]);

  async function handleAction(id: string, action: 'approve' | 'reject') {
    try {
      const res = await fetch('/api/admin/templates', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action }),
      });
      if (res.ok) {
        message.success(action === 'approve' ? '模板已通过审核' : '模板已驳回');
        loadTemplates(page);
      } else {
        const err = await res.json();
        message.error(err.error || '操作失败');
      }
    } catch {
      message.error('操作失败');
    }
  }

  const handleApprove = (id: string) => {
    confirm({
      title: '确认审核通过',
      icon: <ExclamationCircleOutlined />,
      content: '该模板将通过审核并上架到模板市场',
      onOk: () => handleAction(id, 'approve'),
    });
  };

  const handleReject = (id: string) => {
    confirm({
      title: '确认驳回',
      icon: <ExclamationCircleOutlined />,
      content: '该模板将被下架处理',
      onOk: () => handleAction(id, 'reject'),
    });
  };

  return (
    <div>
      <Title level={4} className="!mb-6">模板审核</Title>

      <Card title={`待审核 (${total})`}>
        <Table
          dataSource={templates}
          loading={loading}
          columns={[
            { title: '模板', dataIndex: 'title' },
            { title: '创作者', dataIndex: 'creator' },
            { title: '价格', dataIndex: 'price', render: (v: number) => <span className="text-red-500">¥{v.toFixed(1)}</span> },
            { title: '提交时间', dataIndex: 'submittedAt' },
            { title: '状态', dataIndex: 'status', render: (v: string) => (
              <Tag color={v === 'REVIEWING' ? 'processing' : v === 'PUBLISHED' ? 'green' : 'red'}>
                {v === 'REVIEWING' ? '待审核' : v === 'PUBLISHED' ? '已发布' : v}
              </Tag>
            )},
            {
              title: '操作',
              render: (_, record) => (
                <Space>
                  <Button size="small" icon={<EyeOutlined />}>查看</Button>
                  <Button size="small" type="primary" icon={<CheckOutlined />} onClick={() => handleApprove(record.id)}>通过</Button>
                  <Button size="small" danger icon={<CloseOutlined />} onClick={() => handleReject(record.id)}>驳回</Button>
                </Space>
              ),
            },
          ]}
          rowKey="id"
          pagination={{
            current: page,
            total,
            pageSize: 20,
            onChange: setPage,
            showTotal: (t) => `共 ${t} 条`,
          }}
          locale={{ emptyText: '暂无待审核模板' }}
        />
      </Card>
    </div>
  );
}
