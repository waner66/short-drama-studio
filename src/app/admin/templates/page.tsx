'use client';

import { Card, Table, Tag, Button, Space, Typography, Modal, message } from 'antd';
import { EyeOutlined, CheckOutlined, CloseOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { confirm } = Modal;

export default function AdminTemplatesPage() {
  const pending = [
    { id: '1', title: '古风仙侠虐恋模板', creator: '仙侠首席编剧', price: 45.9, status: 'REVIEWING', submittedAt: '2026-06-28' },
    { id: '2', title: '都市逆袭爽文模板', creator: '爽文制造机', price: 34.9, status: 'REVIEWING', submittedAt: '2026-06-29' },
    { id: '3', title: '喜剧搞笑日常模板', creator: '开心制片人', price: 19.9, status: 'REVIEWING', submittedAt: '2026-06-29' },
  ];

  const handleApprove = (id: string) => {
    confirm({
      title: '确认审核通过',
      icon: <ExclamationCircleOutlined />,
      content: '该模板将通过审核并上架到模板市场',
      onOk: () => message.success('模板已通过审核'),
    });
  };

  const handleReject = (id: string) => {
    confirm({
      title: '确认驳回',
      icon: <ExclamationCircleOutlined />,
      content: '请填写驳回原因',
      onOk: () => message.warning('模板已驳回'),
    });
  };

  return (
    <div>
      <Title level={4} className="!mb-6">模板审核</Title>

      <Card title={`待审核 (${pending.length})`}>
        <Table
          dataSource={pending}
          columns={[
            { title: '模板', dataIndex: 'title' },
            { title: '创作者', dataIndex: 'creator' },
            { title: '价格', dataIndex: 'price', render: (v: number) => <span className="text-red-500">¥{v}</span> },
            { title: '提交时间', dataIndex: 'submittedAt' },
            { title: '状态', dataIndex: 'status', render: () => <Tag color="processing">待审核</Tag> },
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
          pagination={false}
        />
      </Card>
    </div>
  );
}
