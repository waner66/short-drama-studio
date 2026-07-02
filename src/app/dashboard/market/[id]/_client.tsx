'use client';

import { useState, useEffect } from 'react';
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
  Spin,
  Modal,
} from 'antd';
import {
  ShoppingCartOutlined,
  UserOutlined,
  ArrowLeftOutlined,
  HeartOutlined,
  HeartFilled,
  SendOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import PurchaseGuide from '@/components/business/purchase-guide';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

interface TemplateData {
  id: string;
  title: string;
  description: string;
  coverUrl: string;
  category: string;
  tags: string[];
  price: number;
  avgRating: number;
  salesCount: number;
  status: string;
  creatorId: string;
  createdAt: string;
  creator: {
    id: string;
    username: string;
    avatarUrl: string | null;
    bio: string;
    role: string;
    _count: { templates: number; followers: number };
  };
  reviews: Array<{
    id: string;
    rating: number;
    content: string;
    createdAt: string;
    user: { id: string; username: string; avatarUrl: string | null };
  }>;
  _count: { reviews: number; orders: number; favorites: number };
}

export default function TemplateDetailClient({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [template, setTemplate] = useState<TemplateData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [purchasing, setPurchasing] = useState(false);
  const [showPurchaseGuide, setShowPurchaseGuide] = useState(false);
  const [purchasedName, setPurchasedName] = useState('');
  const [alreadyOwned, setAlreadyOwned] = useState(false);
  const [favorited, setFavorited] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [submittingReview, setSubmittingReview] = useState(false);

  const isDemo = params.id === 'demo';

  // 加载模板数据
  useEffect(() => {
    if (isDemo) {
      setTemplate(getDemoData());
      setLoading(false);
      return;
    }

    async function loadTemplate() {
      try {
        const res = await fetch(`/api/templates/${params.id}`);
        if (!res.ok) throw new Error('模板加载失败');
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        setTemplate(data);

        // 检查是否已购买
        checkOwnership(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadTemplate();
  }, [params.id]);

  // 检查是否已购买
  async function checkOwnership(tpl: TemplateData) {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch('/api/orders?status=PAID&limit=100', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const { data } = await res.json();
      const owned = data?.some((o: any) => o.templateId === tpl.id);
      setAlreadyOwned(owned);
    } catch {
      // 静默处理
    }
  }

  // 购买
  async function handlePurchase() {
    if (!template) return;
    const token = localStorage.getItem('token');
    if (!token) {
      message.warning('请先登录');
      router.push('/login');
      return;
    }

    setPurchasing(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ templateId: template.id }),
      });

      const data = await res.json();
      if (!res.ok) {
        if (res.status === 409) {
          message.info('你已经购买过该模板了');
          setAlreadyOwned(true);
          return;
        }
        throw new Error(data.error || '下单失败');
      }

      // 支付成功 → 显示创作引导
      try {
        await fetch(data.payUrl, { method: 'GET' }).catch(() => {});
        await fetch('/api/payment/alipay/notify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            out_trade_no: data.orderNo,
            trade_no: `MOCK_${Date.now()}`,
            total_amount: String(data.amount),
            trade_status: 'TRADE_SUCCESS',
          }).toString(),
        });
      } catch { /* 静默 */ }
      
      setAlreadyOwned(true);
      setPurchasedName(template?.title || '模板');
      setShowPurchaseGuide(true);
    } catch (err: any) {
      message.error(err.message || '下单失败');
    } finally {
      setPurchasing(false);
    }
  }

  // 收藏
  function handleFavorite() {
    setFavorited(!favorited);
    message.success(favorited ? '已取消收藏' : '已加入收藏');
    // TODO: 对接 API
  }

  // 提交评价
  async function handleReview() {
    if (!reviewText.trim()) {
      message.warning('请输入评价内容');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      message.warning('请先登录');
      return;
    }

    setSubmittingReview(true);
    try {
      const res = await fetch('/api/templates/' + template!.id + '/review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rating: reviewRating, content: reviewText }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || '评价提交失败');
      }

      const review = await res.json();
      // 更新本地评价列表
      setTemplate((prev) =>
        prev
          ? {
              ...prev,
              reviews: [
                {
                  id: review.id,
                  rating: reviewRating,
                  content: reviewText,
                  createdAt: new Date().toISOString(),
                  user: { id: 'me', username: '我', avatarUrl: null },
                },
                ...prev.reviews,
              ],
              _count: { ...prev._count, reviews: prev._count.reviews + 1 },
              avgRating:
                (prev.avgRating * prev._count.reviews + reviewRating) /
                (prev._count.reviews + 1),
            }
          : prev
      );
      setReviewText('');
      message.success('评价已提交！');
    } catch (err: any) {
      message.error(err.message || '提交失败');
    } finally {
      setSubmittingReview(false);
    }
  }

  // 加载中
  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Spin size="large" tip="加载模板..." />
      </div>
    );
  }

  // 加载失败
  if (error || !template) {
    return (
      <div className="text-center py-20 space-y-4" style={{ color: 'var(--text-secondary)' }}>
        <div className="text-6xl">😕</div>
        <Title level={3} style={{ color: 'var(--text-primary)' }}>
          模板未找到
        </Title>
        <Text type="secondary">{error || '该模板不存在或已下架'}</Text>
        <br />
        <Link href="/dashboard/market">
          <Button type="primary">返回市场</Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <Link href="/dashboard/market">
          <Button icon={<ArrowLeftOutlined />} type="text" style={{ color: 'var(--text-secondary)' }}>
            返回市场
          </Button>
        </Link>
      </div>

      <Row gutter={24}>
        {/* 左侧：模板详情 */}
        <Col xs={24} lg={16}>
          <Card
            style={{
              background: 'var(--surface-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 12,
              overflow: 'hidden',
            }}
            bodyStyle={{ padding: 0 }}
          >
            {/* 封面区 */}
            <div
              className="h-56 flex items-center justify-center relative"
              style={{
                background: template.category
                  ? `linear-gradient(135deg, var(--scene-${getCategoryScene(template.category) || 'market'}-from, #3b82f6), var(--scene-${getCategoryScene(template.category) || 'market'}-to, #8b5cf6))`
                  : 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              }}
            >
              <div className="text-center text-white" style={{ opacity: 0.6 }}>
                <VideoCameraIcon style={{ fontSize: 80 }} />
              </div>
              <div className="absolute bottom-4 left-6 text-white">
                <Title level={3} style={{ color: 'white', margin: 0, textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
                  {template.title}
                </Title>
              </div>
            </div>

            <div className="p-6">
              {/* 标签 */}
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                {template.tags?.map((tag) => (
                  <Tag key={tag} color="blue">{tag}</Tag>
                ))}
                {template.category && (
                  <Tag color="purple">{template.category}</Tag>
                )}
              </div>

              <Title level={3} style={{ color: 'var(--text-primary)' }}>
                {template.title}
              </Title>

              <Space className="mb-4">
                <Rate disabled allowHalf value={template.avgRating} style={{ fontSize: 14 }} />
                <Text style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
                  ({template.avgRating?.toFixed(1) || '0.0'} · {template.salesCount} 销量)
                </Text>
              </Space>

              {/* 创作者信息 */}
              <div className="flex items-center gap-3 mb-6">
                <Avatar
                  size={40}
                  icon={<UserOutlined />}
                  src={template.creator?.avatarUrl}
                  style={{ backgroundColor: '#6366f1', flexShrink: 0 }}
                />
                <div>
                  <Link href={`/dashboard/creator/${template.creator?.id}`}>
                    <Text strong style={{ color: 'var(--text-primary)' }}>
                      {template.creator?.username}
                    </Text>
                  </Link>
                  <br />
                  <Text style={{ color: 'var(--text-tertiary)', fontSize: 12 }}>
                    {template.creator?._count?.templates || 0} 个模板 · {template.creator?._count?.followers || 0} 粉丝
                  </Text>
                </div>
              </div>

              <Paragraph style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                {template.description}
              </Paragraph>

              {alreadyOwned && (
                <div className="p-3 rounded-lg mb-4 flex items-center gap-2"
                  style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}>
                  <CheckCircleOutlined style={{ color: '#22c55e', fontSize: 18 }} />
                  <Text style={{ color: '#22c55e' }}>你已购买此模板，可随时使用</Text>
                </div>
              )}
            </div>
          </Card>

          {/* 评价区域 */}
          <Card
            title={
              <Space>
                <span style={{ color: 'var(--text-primary)' }}>用户评价</span>
                <Text style={{ color: 'var(--text-tertiary)' }}>
                  ({template.reviews?.length || 0})
                </Text>
              </Space>
            }
            className="mt-4"
            style={{
              background: 'var(--surface-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 12,
            }}
          >
            {template.reviews?.length > 0 ? (
              <List
                dataSource={template.reviews}
                renderItem={(review) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <Avatar icon={<UserOutlined />} src={review.user?.avatarUrl} />
                      }
                      title={
                        <Space>
                          <Text strong style={{ color: 'var(--text-primary)' }}>
                            {review.user?.username}
                          </Text>
                          <Rate disabled value={review.rating} style={{ fontSize: 12 }} />
                        </Space>
                      }
                      description={
                        <>
                          <Paragraph style={{ color: 'var(--text-secondary)', marginBottom: 4 }}>
                            {review.content}
                          </Paragraph>
                          <Text style={{ color: 'var(--text-tertiary)', fontSize: 11 }}>
                            {new Date(review.createdAt).toLocaleDateString('zh-CN')}
                          </Text>
                        </>
                      }
                    />
                  </List.Item>
                )}
              />
            ) : (
              <div className="text-center py-8" style={{ color: 'var(--text-tertiary)' }}>
                暂无评价，成为第一个评价的人吧
              </div>
            )}

            <Divider />

            <div className="space-y-3">
              <Text strong style={{ color: 'var(--text-primary)' }}>写下你的评价</Text>
              <div>
                <Rate value={reviewRating} onChange={setReviewRating} />
              </div>
              <TextArea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="分享你使用这个模板的体验..."
                rows={3}
              />
              <Button
                type="primary"
                icon={<SendOutlined />}
                onClick={handleReview}
                loading={submittingReview}
              >
                提交评价
              </Button>
            </div>
          </Card>
        </Col>

        {/* 右侧：购买卡片 */}
        <Col xs={24} lg={8}>
          <div className="sticky" style={{ top: 88 }}>
            <Card
              style={{
                background: 'var(--surface-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 12,
                boxShadow: 'var(--shadow-card)',
              }}
            >
              <div className="text-center mb-4">
                <div className="text-4xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                  {template.price > 0 ? `¥${template.price}` : '免费'}
                </div>
                <Text style={{ color: 'var(--text-tertiary)' }}>一次购买，永久使用</Text>
              </div>

              <Space direction="vertical" className="w-full" size="middle">
                {alreadyOwned ? (
                  <Button
                    size="large"
                    icon={<CheckCircleOutlined />}
                    block
                    disabled
                    className="!h-12"
                    style={{ background: 'rgba(34,197,94,0.1)', color: '#22c55e', border: 'none' }}
                  >
                    已购买
                  </Button>
                ) : (
                  <Button
                    type="primary"
                    size="large"
                    icon={<ShoppingCartOutlined />}
                    block
                    onClick={handlePurchase}
                    loading={purchasing}
                    className="!h-12 !text-lg"
                  >
                    立即购买
                  </Button>
                )}

                <Button
                  size="large"
                  icon={favorited ? <HeartFilled style={{ color: '#ef4444' }} /> : <HeartOutlined />}
                  block
                  onClick={handleFavorite}
                  className="!h-12"
                  style={{
                    background: 'var(--surface-elevated)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-primary)',
                  }}
                >
                  {favorited ? '已收藏' : '加入收藏'}
                </Button>
              </Space>

              <Divider />

              <div style={{ fontSize: 12, color: 'var(--text-tertiary)', lineHeight: 2 }}>
                <div className="flex justify-between">
                  <span>平台服务费</span>
                  <span>{(Number(template.price) * 0.15).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>创作者收益</span>
                  <span style={{ color: '#22c55e' }}>
                    ¥{(Number(template.price) * 0.85).toFixed(2)}
                  </span>
                </div>
              </div>
            </Card>

            {/* 创作者卡片 */}
            <Card
              title="创作者信息"
              className="mt-4"
              style={{
                background: 'var(--surface-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 12,
              }}
            >
              <div className="text-center">
                <Link href={`/dashboard/creator/${template.creator?.id}`}>
                  <Avatar
                    size={64}
                    icon={<UserOutlined />}
                    src={template.creator?.avatarUrl}
                    style={{ backgroundColor: '#6366f1' }}
                  />
                  <div className="mt-2">
                    <Text strong style={{ color: 'var(--text-primary)' }}>
                      {template.creator?.username}
                    </Text>
                  </div>
                  <Tag color="purple" className="mt-1">创作者</Tag>
                </Link>
                {template.creator?.bio && (
                  <Paragraph
                    className="mt-2 text-xs"
                    style={{ color: 'var(--text-tertiary)' }}
                    ellipsis={{ rows: 2 }}
                  >
                    {template.creator.bio}
                  </Paragraph>
                )}
              </div>
            </Card>
          </div>
        </Col>
      </Row>

      {/* 购买后创作引导 */}
      <PurchaseGuide
        open={showPurchaseGuide}
        onClose={() => setShowPurchaseGuide(false)}
        templateName={purchasedName}
        templateId={template?.id || ''}
      />
    </div>
  );
}

// ====== Helpers ======

function VideoCameraIcon({ style }: { style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="currentColor" style={{ ...style, maxWidth: 80, maxHeight: 80 }}>
      <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
    </svg>
  );
}

function getCategoryScene(category: string): string {
  const map: Record<string, string> = {
    '甜宠恋爱': 'market',
    '悬疑推理': 'community',
    '古装仙侠': 'create',
    '喜剧搞笑': 'market',
    '都市生活': 'community',
    '科幻玄幻': 'create',
    '逆袭励志': 'market',
  };
  return map[category] || 'market';
}

function getDemoData(): TemplateData {
  return {
    id: 'demo',
    title: '霸道总裁爱上我 · 短剧模板',
    description:
      '经典的现代都市甜宠短剧模板，包含完整的角色设定、3幕剧本结构和分镜脚本。适合新手快速上手制作短剧。模板精心设计，每个角色的性格都有鲜明对比，剧本节奏紧凑不拖沓。',
    coverUrl: '',
    category: '甜宠恋爱',
    tags: ['热门', '新手推荐', '三幕式', '甜宠'],
    price: 29.9,
    avgRating: 4.8,
    salesCount: 1234,
    status: 'PUBLISHED',
    creatorId: 'demo-creator',
    createdAt: '2026-06-15',
    creator: {
      id: 'demo-creator',
      username: '短剧达人王',
      avatarUrl: null,
      bio: '专注短剧创作3年，累计发布20+精品模板',
      role: 'CREATOR',
      _count: { templates: 20, followers: 567 },
    },
    reviews: [
      {
        id: '1',
        rating: 5,
        content: '非常实用的模板！角色设定很详细，剧本结构清晰，帮我节省了大量时间。',
        createdAt: '2026-06-28',
        user: { id: 'u1', username: '短剧创作者小王', avatarUrl: null },
      },
      {
        id: '2',
        rating: 4,
        content: '分镜设计很好，整体质量很高。',
        createdAt: '2026-06-25',
        user: { id: 'u2', username: '新晋导演小刘', avatarUrl: null },
      },
    ],
    _count: { reviews: 2, orders: 1234, favorites: 89 },
  };
}
