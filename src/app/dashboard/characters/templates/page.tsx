'use client';

import { useState } from 'react';
import { Card, Row, Col, Button, Tag, Typography, Input, Select, Space, Rate, Tabs, Badge } from 'antd';
import { SearchOutlined, FireOutlined, RiseOutlined, CrownOutlined, ShoppingCartOutlined, StarFilled, UserOutlined } from '@ant-design/icons';
import { officialTemplates, type OfficialTemplate } from '@/lib/data/character-templates';
import Link from 'next/link';

const { Title, Text, Paragraph } = Typography;

const genres = ['全部', '甜宠恋爱', '悬疑推理', '古装仙侠', '校园青春', '逆袭爽文'];

export default function TemplateMarketPage() {
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('全部');
  const [sort, setSort] = useState('hot');

  let templates = officialTemplates.map(t => ({
    ...t,
    _isOfficial: true,
  }));

  if (genre !== '全部') templates = templates.filter(t => t.genre === genre);
  if (search) templates = templates.filter(t => t.name.includes(search) || t.description.includes(search));

  if (sort === 'rating') templates.sort((a, b) => b.price - a.price); // mock sort
  // hot = default order

  return (
    <div>
      <div className="mb-6">
        <Title level={4} className="!mb-2">角色模板市场</Title>
        <Text type="secondary">浏览官方精选模板和社区创作者上传的角色设定，一键套用或购买精品模板</Text>
      </div>

      {/* 搜索筛选栏 */}
      <Card className="mb-6">
        <Row gutter={[16, 12]} align="middle">
          <Col xs={24} md={10}>
            <Input prefix={<SearchOutlined />} placeholder="搜索角色模板..." value={search}
              onChange={e => setSearch(e.target.value)} size="large" allowClear />
          </Col>
          <Col xs={12} md={6}>
            <Select value={genre} onChange={setGenre} size="large" style={{ width: '100%' }}
              options={genres.map(g => ({ value: g, label: g }))} />
          </Col>
          <Col xs={12} md={4}>
            <Select value={sort} onChange={setSort} size="large" style={{ width: '100%' }}
              options={[
                { value: 'hot', label: '🔥 热门' },
                { value: 'rating', label: '⭐ 高评分' },
                { value: 'new', label: '🆕 最新' },
              ]} />
          </Col>
          <Col xs={24} md={4}>
            <Link href="/dashboard/characters/templates/my">
              <Button size="large" icon={<CrownOutlined />} block>我的模板</Button>
            </Link>
          </Col>
        </Row>
      </Card>

      {/* 模板网格 */}
      <Row gutter={[16, 16]}>
        {templates.map((tpl) => (
          <Col xs={24} sm={12} lg={8} xl={6} key={tpl.id}>
            <Link href={`/dashboard/characters/templates/${tpl.id}`}>
              <Card
                hoverable
                className="!h-full !rounded-xl overflow-hidden"
                cover={
                  <div className="h-36 flex items-center justify-center relative" style={{
                    background: `linear-gradient(135deg, ${tpl.coverColor}, ${tpl.coverColor}dd)`,
                  }}>
                    <div className="text-center">
                      <div className="text-4xl mb-2">
                        {tpl.defaultData.gender === '男' ? '👤' : '👩'}
                      </div>
                      <div className="text-white/80 font-medium text-sm">{tpl.archetype}</div>
                    </div>
                    {tpl.price > 0 && (
                      <div className="absolute top-2 right-2 bg-white/90 rounded-full px-2 py-0.5 text-xs font-bold text-red-500">
                        ¥{tpl.price}
                      </div>
                    )}
                    {tpl.price === 0 && (
                      <div className="absolute top-2 right-2 bg-green-500/90 rounded-full px-2 py-0.5 text-xs font-bold text-white">
                        免费
                      </div>
                    )}
                    <div className="absolute top-2 left-2 flex gap-1">
                      {tpl.tags.slice(0, 2).map(tag => (
                        <Tag key={tag} color="rgba(255,255,255,0.2)" className="!text-white !border-white/20 !text-xs !m-0">
                          {tag}
                        </Tag>
                      ))}
                    </div>
                  </div>
                }
                bodyStyle={{ padding: '16px' }}
              >
                <Text strong className="block truncate text-sm mb-1">{tpl.name}</Text>
                <Paragraph ellipsis={{ rows: 2 }} className="!text-xs !text-gray-500 !mb-2">
                  {tpl.description}
                </Paragraph>
                <div className="flex items-center justify-between">
                  <Space size={4}>
                    <Tag color="purple" className="!text-xs !m-0">{tpl.genre}</Tag>
                    <Tag color="blue" className="!text-xs !m-0">{tpl.archetype}</Tag>
                  </Space>
                  <Rate disabled defaultValue={4 + Math.random()} className="!text-xs" count={5} />
                </div>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
    </div>
  );
}
