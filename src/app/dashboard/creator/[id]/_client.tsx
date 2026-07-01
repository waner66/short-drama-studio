'use client';

import { useEffect, useState } from 'react';
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
  Spin,
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

interface CreatorData {
  id: string;
  name: string;
  avatar?: string;
  bio?: string;
  role: string;
  joinedAt: string;
  templatesCount: number;
  followers: number;
  totalSales: number;
  avgRating: number;
  isFollowing: boolean;
  templates: Array<{
    id: string;
    title: string;
    price: number;
    avgRating: number;
    salesCount: number;
  }>;
}

export default function CreatorProfileClient({ params }: { params: { id: string } }) {
  const [creator, setCreator] = useState<CreatorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [followed, setFollowed] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  useEffect(() => {
    loadCreator();
  }, [params.id]);

  async function loadCreator() {
    try {
      setLoading(true);
      const res = await fetch(`/api/creator/${params.id}`);
      if (!res.ok) {
        if (res.status === 404) { setError('创作者不存在'); return; }
        throw new Error('加载失败');
      }
      const data = await res.json();
      setCreator(data);
      setFollowed(data.isFollowing);
    } catch (err) {
      setError('加载失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  }

  async function toggleFollow() {
    if (!creator || followLoading) return;
    try {
      setFollowLoading(true);
      const res = await fetch(`/api/creator/${params.id}/follow`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: followed ? 'unfollow' : 'follow' }),
      });
      if (res.ok) {
        setFollowed(!followed);
      } else if (res.status === 401) {
        setError('请先登录');
      }
    } catch {
      // ignore
    } finally {
      setFollowLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spin size="large" />
      </div>
    );
  }

  if (error || !creator) {
    return (
      <div>
        <Link href="/dashboard/market">
          <Button icon={<ArrowLeftOutlined />} type="text">返回市场</Button>
        </Link>
        <Card className="mt-4">
          <div className="text-center py-12">
            <Text type="secondary">{error || '创作者不存在'}</Text>
          </div>
        </Card>
      </div>
    );
  }

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
            {creator.avatar ? (
              <Avatar size={80} src={creator.avatar} />
            ) : (
              <Avatar size={80} icon={<UserOutlined />} style={{ backgroundColor: '#1677ff' }} />
            )}
          </Col>
          <Col flex="auto">
            <div className="flex items-center gap-3 mb-2">
              <Title level={3} className="!mb-0">{creator.name}</Title>
              {creator.role === 'CREATOR' && (
                <Tag icon={<CrownOutlined />} color="gold">认证创作者</Tag>
              )}
            </div>
            <Text type="secondary">{creator.bio || '这个人很懒，什么都没写~'}</Text>
            <div className="mt-2">
              <Tag>加入于 {creator.joinedAt}</Tag>
            </div>
          </Col>
          <Col>
            <Button
              type={followed ? 'default' : 'primary'}
              icon={<TeamOutlined />}
              size="large"
              loading={followLoading}
              onClick={toggleFollow}
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
      <Card title={`创作模板 (${creator.templates.length})`}>
        {creator.templates.length === 0 ? (
          <div className="text-center py-8">
            <Text type="secondary">暂无已发布模板</Text>
          </div>
        ) : (
          <List
            dataSource={creator.templates}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <Link href={`/dashboard/market/${item.id}`} key="view">
                    <Button size="small">查看详情</Button>
                  </Link>,
                  <Link href={`/dashboard/market/${item.id}`} key="buy">
                    <Button size="small" type="primary">
                      ¥{item.price.toFixed(1)} 购买
                    </Button>
                  </Link>,
                ]}
              >
                <List.Item.Meta
                  title={item.title}
                  description={
                    <Space>
                      <Rate disabled allowHalf value={item.avgRating} className="!text-sm" />
                      <Text type="secondary">{item.salesCount} 销量</Text>
                    </Space>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </Card>
    </div>
  );
}
