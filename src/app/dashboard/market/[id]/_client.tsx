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
  Rate,
  Avatar,
  List,
  Divider,
  message,
  Input,
} from 'antd';
import {
  ShoppingCartOutlined,
  DownloadOutlined,
  EyeOutlined,
  StarFilled,
  UserOutlined,
  ArrowLeftOutlined,
  HeartOutlined,
  HeartFilled,
  SendOutlined,
} from '@ant-design/icons';
import Link from 'next/link';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const mockReviews = [
  {
    id: '1',
    userId: 'user1',
    username: '短剧创作者小王',
    rating: 5,
    content: '非常实用的模板！角色设定很详细，剧本结构清晰，帮我节省了大量时间。强烈推荐！',
    createdAt: '2026-06-28',
  },
  {
    id: '2',
    userId: 'user2',
    username: '新晋导演小刘',
    rating: 4,
    content: '分镜设计很好，但希望能提供更多转场效果的建议。整体质量很高。',
    createdAt: '2026-06-25',
  },
  {
    id: '3',
    userId: 'user3',
    username: '短视频达人',
    rating: 5,
    content: '用这个模板做完了第一集，播放量破了10万！模板真的太给力了。',
    createdAt: '2026-06-20',
  },
];

export default function TemplateDetailClient({ params }: { params: { id: string } }) {
  const [favorited, setFavorited] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);

  const template = {
    id: params.id,
    title: '霸道总裁爱上我 · 短剧模板',
    description: '经典的现代都市甜宠短剧模板，包含完整的角色设定、3幕剧本结构和分镜脚本。适合新手快速上手制作短剧。模板精心设计，每个角色的性格都有鲜明对比，剧本节奏紧凑不拖沓。',
    creator: '短剧达人王',
    creatorAvatar: null,
    category: '甜宠恋爱',
    price: 29.9,
    rating: 4.8,
    sales: 1234,
    tags: ['热门', '新手推荐', '三幕式', '甜宠'],
    includes: ['3个核心角色设定（含性格+背景故事）', '3幕完整剧本结构', '15个分镜脚本', '1个场景设定', '配乐建议列表'],
    createdAt: '2026-06-15',
  };

  const handlePurchase = () => {
    message.success('已添加到购物车！');
  };

  const handleReview = () => {
    if (!reviewText.trim()) {
      message.warning('请输入评价内容');
      return;
    }
    message.success('评价已提交！');
    setReviewText('');
  };

  return (
    <div>
      <div className="mb-4">
        <Link href="/dashboard/market">
          <Button icon={<ArrowLeftOutlined />} type="text">返回市场</Button>
        </Link>
      </div>

      <Row gutter={24}>
        {/* 左侧：模板详情 */}
        <Col xs={24} lg={16}>
          <Card
            cover={
              <div className="h-48 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center">
                <div className="text-center text-white">
                  <VideoCameraIcon style={{ fontSize: 64, opacity: 0.3 }} />
                  <div className="text-2xl font-bold text-white/80 mt-2">{template.title}</div>
                </div>
              </div>
            }
          >
            <div className="flex items-center gap-2 mb-4">
              {template.tags.map((tag) => (
                <Tag key={tag} color="blue">{tag}</Tag>
              ))}
              <Tag color="purple">{template.category}</Tag>
            </div>

            <Title level={3}>{template.title}</Title>

            <Space className="mb-4">
              <Rate disabled allowHalf value={template.rating} />
              <Text type="secondary">({template.rating} · {template.sales} 销量)</Text>
            </Space>

            <div className="flex items-center gap-3 mb-6">
              <Avatar size={36} icon={<UserOutlined />} style={{ backgroundColor: '#1677ff' }} />
              <div>
                <Text strong>{template.creator}</Text>
                <br />
                <Text type="secondary" className="text-xs">模板创作者</Text>
              </div>
            </div>

            <Paragraph className="text-gray-600">
              {template.description}
            </Paragraph>

            <Divider />

            <Title level={5}>模板包含内容</Title>
            <List
              size="small"
              dataSource={template.includes}
              renderItem={(item) => (
                <List.Item>
                  <Text>✓ {item}</Text>
                </List.Item>
              )}
            />
          </Card>

          {/* 评价区域 */}
          <Card title={`用户评价 (${mockReviews.length})`} className="mt-4">
            <List
              dataSource={mockReviews}
              renderItem={(review) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar icon={<UserOutlined />} />}
                    title={
                      <Space>
                        <Text strong>{review.username}</Text>
                        <Rate disabled value={review.rating} className="!text-sm" />
                      </Space>
                    }
                    description={
                      <>
                        <Paragraph className="!mb-1">{review.content}</Paragraph>
                        <Text type="secondary" className="text-xs">{review.createdAt}</Text>
                      </>
                    }
                  />
                </List.Item>
              )}
            />

            <Divider />

            <div className="space-y-3">
              <Text strong>写下你的评价</Text>
              <div>
                <Rate value={reviewRating} onChange={setReviewRating} />
              </div>
              <TextArea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="分享你使用这个模板的体验..."
                rows={3}
              />
              <Button type="primary" icon={<SendOutlined />} onClick={handleReview}>
                提交评价
              </Button>
            </div>
          </Card>
        </Col>

        {/* 右侧：购买卡片 */}
        <Col xs={24} lg={8}>
          <div className="sticky top-6">
            <Card className="!shadow-lg !rounded-xl">
              <div className="text-center mb-4">
                <div className="text-4xl font-bold text-red-500 mb-2">¥{template.price}</div>
                <Text type="secondary">一次购买，永久使用</Text>
              </div>

              <Space direction="vertical" className="w-full" size="middle">
                <Button
                  type="primary"
                  size="large"
                  icon={<ShoppingCartOutlined />}
                  block
                  onClick={handlePurchase}
                  className="!h-12 !text-lg"
                >
                  立即购买
                </Button>

                <Button
                  size="large"
                  icon={favorited ? <HeartFilled className="text-red-500" /> : <HeartOutlined />}
                  block
                  onClick={() => { setFavorited(!favorited); message.success(favorited ? '已取消收藏' : '已加入收藏'); }}
                  className="!h-12"
                >
                  {favorited ? '已收藏' : '加入收藏'}
                </Button>
              </Space>

              <Divider />

              <div className="text-xs text-gray-400 space-y-2">
                <div className="flex justify-between">
                  <span>平台抽成</span>
                  <span>15% (¥{(template.price * 0.15).toFixed(2)})</span>
                </div>
                <div className="flex justify-between">
                  <span>创作者收益</span>
                  <span className="text-green-500">{(template.price * 0.85).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-500 mt-1 pt-2 border-t">
                  <span>已购买永久可用</span>
                  <span>支持退款</span>
                </div>
              </div>
            </Card>

            <Card title="创作者信息" className="mt-4">
              <div className="text-center">
                <Link href={`/dashboard/creator/${template.creator}`}>
                  <Avatar size={64} icon={<UserOutlined />} style={{ backgroundColor: '#1677ff' }} />
                  <div className="mt-2">
                    <Text strong>{template.creator}</Text>
                  </div>
                  <Tag color="blue" className="mt-1">创作者</Tag>
                </Link>
              </div>
            </Card>
          </div>
        </Col>
      </Row>
    </div>
  );
}

function VideoCameraIcon({ style }: { style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" width="64" height="64" fill="currentColor" style={style}>
      <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
    </svg>
  );
}
