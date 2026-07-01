'use client';

import { useState } from 'react';
import { Card, Row, Col, Button, Tag, Typography, Space, Rate, Divider, message, Descriptions } from 'antd';
import { ArrowLeftOutlined, ShoppingCartOutlined, ThunderboltOutlined, HeartOutlined, HeartFilled, CrownOutlined } from '@ant-design/icons';
import { officialTemplates } from '@/lib/data/character-templates';
import Link from 'next/link';

const { Title, Text, Paragraph } = Typography;

const traitsLabels: Record<string, string> = {
  extraversion: '外倾性', agreeableness: '宜人性', conscientiousness: '尽责性',
  neuroticism: '情绪稳定', openness: '开放性',
};

export default function TemplateDetailClient({ params }: { params: { id: string } }) {
  const [favorited, setFavorited] = useState(false);

  const template = officialTemplates.find(t => t.id === params.id);
  if (!template) {
    return (
      <div className="text-center py-20">
        <Title level={4}>模板未找到</Title>
        <Link href="/dashboard/characters/templates"><Button type="primary">返回市场</Button></Link>
      </div>
    );
  }

  const d = template.defaultData;

  return (
    <div>
      <div className="mb-4">
        <Link href="/dashboard/characters/templates">
          <Button icon={<ArrowLeftOutlined />} type="text">返回市场</Button>
        </Link>
      </div>

      <Row gutter={24}>
        <Col xs={24} lg={16}>
          <Card>
            <div className="h-48 rounded-xl mb-6 flex items-center justify-center relative"
              style={{ background: `linear-gradient(135deg, ${template.coverColor}, ${template.coverColor}99)` }}>
              <div className="text-center">
                <div className="text-6xl mb-3">{d.gender === '男' ? '👤' : '👩'}</div>
                <div className="text-white/80 text-lg font-medium">{template.archetype}</div>
              </div>
              {template.price > 0 ? (
                <div className="absolute top-4 right-4 bg-white rounded-lg px-4 py-2">
                  <Text className="text-2xl font-bold text-red-500">¥{template.price}</Text>
                </div>
              ) : (
                <div className="absolute top-4 right-4 bg-green-500 rounded-lg px-4 py-2">
                  <Text className="text-lg font-bold text-white">免费模板</Text>
                </div>
              )}
            </div>

            <Space className="mb-4" wrap>
              {template.tags.map(t => <Tag key={t} color="blue">{t}</Tag>)}
              <Tag color="purple">{template.genre}</Tag>
              <Tag color="orange">{template.archetype}</Tag>
            </Space>

            <Title level={3} className="!mb-2">{template.name}</Title>
            <Paragraph className="text-gray-500 mb-6">{template.description}</Paragraph>

            <Divider />

            <Title level={5}>性格画像</Title>
            <Row gutter={[16, 16]} className="mb-6">
              <Col xs={12}>
                <div className="bg-blue-50 rounded-lg p-4">
                  <Text strong className="text-blue-700">表面性格</Text>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {d.surfaceTraits.map(t => <Tag key={t} color="blue">{t}</Tag>)}
                  </div>
                </div>
              </Col>
              <Col xs={12}>
                <div className="bg-purple-50 rounded-lg p-4">
                  <Text strong className="text-purple-700">内在性格</Text>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {d.innerTraits.map(t => <Tag key={t} color="purple">{t}</Tag>)}
                  </div>
                </div>
              </Col>
            </Row>

            <Title level={5}>五维人格</Title>
            <div className="grid grid-cols-5 gap-2 mb-6 text-center">
              {(['extraversion','agreeableness','conscientiousness','neuroticism','openness'] as const).map(k => {
                const v = d[k as keyof typeof d] as number;
                return (
                  <div key={k} className="bg-gray-50 rounded-lg p-3">
                    <div className="text-2xl font-bold text-blue-600">{v}</div>
                    <Text className="text-xs text-gray-500">{traitsLabels[k]}</Text>
                  </div>
                );
              })}
            </div>

            <Divider />

            <Title level={5}>人物弧光</Title>
            <Paragraph className="bg-orange-50 rounded-lg p-4 text-gray-700">{d.arcDescription}</Paragraph>

            <Title level={5}>背景故事</Title>
            <Paragraph className="bg-gray-50 rounded-lg p-4 text-gray-700">{d.backstory}</Paragraph>

            <Row gutter={16}>
              <Col span={12}>
                <Title level={5}>核心弱点</Title>
                <Paragraph className="text-red-600">{d.weakness}</Paragraph>
              </Col>
              <Col span={12}>
                <Title level={5}>核心欲望</Title>
                <Paragraph className="text-green-600">{d.desire}</Paragraph>
              </Col>
            </Row>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <div className="space-y-4">
            <Card className="!shadow-lg !rounded-xl">
              <div className="text-center mb-4">
                <div className="text-4xl font-bold text-red-500 mb-2">
                  {template.price === 0 ? '免费' : `¥${template.price}`}
                </div>
                <Text type="secondary">{template.price === 0 ? '直接套用' : '一次购买永久使用'}</Text>
              </div>

              <Space direction="vertical" className="w-full" size="middle">
                <Button type="primary" size="large" icon={<ThunderboltOutlined />} block className="!h-12 !text-lg"
                  onClick={() => { message.success('模板已套用！正在跳转到创建页面...'); setTimeout(() => window.location.href = '/dashboard/characters/new?template=' + template.id, 800); }}>
                  一键套用创建角色
                </Button>
                {template.price > 0 && (
                  <Button size="large" icon={<ShoppingCartOutlined />} block className="!h-12"
                    onClick={() => message.success('已加入购物车')}>
                    加入购物车 ¥{template.price}
                  </Button>
                )}
                <Button size="large" icon={favorited ? <HeartFilled className="text-red-500" /> : <HeartOutlined />} block
                  onClick={() => { setFavorited(!favorited); message.success(favorited ? '已取消收藏' : '已加入收藏'); }}>
                  {favorited ? '已收藏' : '收藏模板'}
                </Button>
              </Space>
            </Card>

            <Card title="模板详情">
              <Descriptions column={1} size="small">
                <Descriptions.Item label="适用性别">{d.gender}</Descriptions.Item>
                <Descriptions.Item label="年龄">{d.age}岁</Descriptions.Item>
                <Descriptions.Item label="风格">{d.style}</Descriptions.Item>
                <Descriptions.Item label="口头禅">{d.catchphrase}</Descriptions.Item>
                <Descriptions.Item label="语气">{d.voiceTone}</Descriptions.Item>
                <Descriptions.Item label="标志动作">{d.signatureAction}</Descriptions.Item>
              </Descriptions>
            </Card>

            <Card title="创作者信息">
              <div className="text-center">
                <Tag icon={<CrownOutlined />} color="gold">官方模板</Tag>
                <div className="mt-2 text-xs text-gray-400">
                  官方认证的优质角色设定模板
                </div>
              </div>
            </Card>
          </div>
        </Col>
      </Row>
    </div>
  );
}
