'use client';

import { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Button,
  Typography,
  Tag,
  Space,
  Avatar,
  Tabs,
  List,
  Rate,
  Statistic,
  Divider,
} from 'antd';
import {
  UserOutlined,
  ShoppingCartOutlined,
  StarFilled,
  TeamOutlined,
  CrownOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons';
import Link from 'next/link';

const { Title, Text } = Typography;

export default function CreatorProfileClient({ params }: { params: { id: string } }) {
  const [followed, setFollowed] = useState(false);

  const creator = {
    id: params.id,
    name: '短剧达人王',
    bio: '专注甜宠短剧创作3年，已出品50+部短剧，累计播放量破千万',
    avatar: null,
    templatesCount: 12,
    followers: 3892,
    totalSales: 4521,
    avgRating: 4.7,
    joinedAt: '2024-03',
  };

  const creatorTemplates = [
    { id: '1', title: '霸道总裁爱上我 · 短剧模板', price: 29.9, rating: 4.8, sales: 1234 },
    { id: '2', title: '甜宠总裁的契约新娘', price: 34.9, rating: 4.6, sales: 892 },
    { id: '3', title: '温柔总裁的甜蜜陷阱', price: 24.9, rating: 4.9, sales: 1567 },
  ];

  return (
    <div>
      <div className="mb-4">
        <Link href="/dashboard/market">
          <Button icon={<ArrowLeftOutlined />} type="text">返回市场</Button>
        </Link>
      </div>

      {/* 创作者头部 */}
      <Card className="mb-6">
        <Row gutter={24} align="middle">
          <Col flex="100px">
            <Avatar size={80} icon={<UserOutlined />} style={{ backgroundColor: '#1677ff' }} />
          </Col>
          <Col flex="auto">
            <div className="flex items-center gap-3 mb-2">
              <Title level={3} className="!mb-0">{creator.name}</Title>
              <Tag icon={<CrownOutlined />} color="gold">认证创作者</Tag>
            </div>
            <Text type="secondary">{creator.bio}</Text>
            <div className="mt-2">
              <Tag>加入于 {creator.joinedAt}</Tag>
            </div>
          </Col>
          <Col>
            <Button
              type={followed ? 'default' : 'primary'}
              icon={<TeamOutlined />}
              size="large"
              onClick={() => { setFollowed(!followed); }}
            >
              {followed ? '已关注' : '关注创作者'}
            </Button>
          </Col>
        </Row>

        <Divider />

        <Row gutter={24}>
          <Col xs={6}>
            <Statistic title="模板数" value={creator.templatesCount} prefix={<CrownOutlined />} />
          </Col>
          <Col xs={6}>
            <Statistic title="粉丝" value={creator.followers} prefix={<TeamOutlined />} />
          </Col>
          <Col xs={6}>
            <Statistic title="总销量" value={creator.totalSales} prefix={<ShoppingCartOutlined />} />
          </Col>
          <Col xs={6}>
            <Statistic title="平均评分" value={creator.avgRating} prefix={<StarFilled className="text-yellow-500" />} />
          </Col>
        </Row>
      </Card>

      {/* 作品列表 */}
      <Card title="创作模板">
        <List
          dataSource={creatorTemplates}
          renderItem={(item) => (
            <List.Item
              actions={[
                <Link href={`/dashboard/market/${item.id}`} key="view">
                  <Button size="small">查看详情</Button>
                </Link>,
                <Button size="small" type="primary" key="buy">
                  ¥{item.price} 购买
                </Button>,
              ]}
            >
              <List.Item.Meta
                title={item.title}
                description={
                  <Space>
                    <Rate disabled allowHalf value={item.rating} className="!text-sm" />
                    <Text type="secondary">{item.sales} 销量</Text>
                  </Space>
                }
              />
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
}
