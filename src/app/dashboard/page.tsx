'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Typography, Tag } from 'antd';
import {
  ShopOutlined,
  FireOutlined,
  PlayCircleOutlined,
  TeamOutlined,
  FileTextOutlined,
  ArrowRightOutlined,
  StarFilled,
  UserOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
} from '@ant-design/icons';
import GlassCard from '@/components/ui/glass-card';
import Badge from '@/components/ui/badge';
import GradientBtn from '@/components/ui/gradient-btn';

const { Title, Text } = Typography;

interface TemplateItem { id: string; title: string; price: number; salesCount: number; avgRating: number; isHot?: boolean; isNew?: boolean; creator?: { username: string }; tags?: string[]; }
interface CommunityItem { id: string; type: string; title: string; user: string; time: string; }

export default function DashboardPage() {
  const [hotTemplates, setHotTemplates] = useState<TemplateItem[]>([]);
  const [communityItems, setCommunityItems] = useState<CommunityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        // 加载热门模板
        const tmplRes = await fetch('/api/templates?sort=hot&limit=4');
        if (tmplRes.ok) {
          const tmpl = await tmplRes.json();
          setHotTemplates(tmpl.data || []);
        }
      } catch {}

      try {
        // 加载社区动态
        const commRes = await fetch('/api/community/feed?limit=5');
        if (commRes.ok) {
          const comm = await commRes.json();
          setCommunityItems(comm.data || []);
        }
      } catch {}

      // 如果 API 没数据，用空状态
      if (hotTemplates.length === 0) {
        // 设置占位以停止 loading
      }
      setLoading(false);
    }
    loadData();
  }, []);

  const quickCreate = [
    { icon: <TeamOutlined />, title: '创建角色', link: '/dashboard/characters/new', bg: 'from-violet-600 to-purple-500' },
    { icon: <FileTextOutlined />, title: '编写剧本', link: '/dashboard/scripts', bg: 'from-cyan-500 to-teal-400' },
    { icon: <ShopOutlined />, title: '上架模板', link: '/dashboard/templates', bg: 'from-amber-500 to-orange-400' },
  ];

  return (
    <div>
      {/* Welcome */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Title level={3} className="!text-white !mb-1 !text-2xl">发现你的下个爆款短剧</Title>
          <Text className="!text-[#6b6b8a]">浏览模板、发现灵感、开启创作</Text>
        </div>
        <Link href="/dashboard/projects/new">
          <GradientBtn variant="primary" size="sm">+ 快速创作</GradientBtn>
        </Link>
      </div>

      {/* 三栏布局：热门模板 | 快速开始 | 社区动态 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左栏 — 热门模板推荐 */}
        <div className="lg:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <FireOutlined className="text-amber-400 text-lg" />
            <Title level={5} className="!text-white !mb-0">热门模板</Title>
          </div>

          {hotTemplates.length > 0 ? (
            <div className="space-y-3">
              {hotTemplates.map((tpl) => (
                <Link key={tpl.id} href={`/dashboard/market`} className="no-underline">
                  <div className="glass glass-hover p-4 flex items-start gap-3">
                    <div className="w-12 h-16 rounded-lg bg-gradient-to-br from-purple-600/30 to-cyan-500/30 flex-shrink-0 flex items-center justify-center border border-white/5">
                      <PlayCircleOutlined className="text-white/60 text-lg" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-white font-semibold text-sm truncate">{tpl.title}</span>
                        {tpl.isHot && <Badge variant="hot" />}
                        {tpl.isNew && <Badge variant="new" />}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1"><StarFilled className="text-yellow-500 text-[10px]" /> {tpl.avgRating || 0}</span>
                        <span>{tpl.salesCount || 0} 购买</span>
                        <span className="text-amber-400 font-bold">¥{typeof tpl.price === 'number' ? tpl.price.toFixed(1) : tpl.price}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <GlassCard>
              <div className="text-center py-8">
                <ShopOutlined className="text-3xl text-gray-600 mb-3" />
                <div className="text-gray-500 text-sm mb-4">模板市场上线后，热门模板将在这里展示</div>
                <Link href="/dashboard/market">
                  <GradientBtn variant="market" size="sm">浏览模板市场</GradientBtn>
                </Link>
              </div>
            </GlassCard>
          )}

          <Link href="/dashboard/market" className="flex items-center gap-1 mt-3 text-sm text-brand-400 hover:text-brand-300 no-underline">
            查看全部模板 <ArrowRightOutlined className="text-xs" />
          </Link>
        </div>

        {/* 中栏 — 快速开始 */}
        <div className="lg:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <PlayCircleOutlined className="text-purple-400 text-lg" />
            <Title level={5} className="!text-white !mb-0">快速开始</Title>
          </div>

          <div className="space-y-3">
            {quickCreate.map((item, i) => (
              <Link key={i} href={item.link} className="no-underline">
                <div className="glass p-4 rounded-xl hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/10 transition-all group cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.bg} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      {item.icon}
                    </div>
                    <span className="text-white font-medium">{item.title}</span>
                    <ArrowRightOutlined className="ml-auto text-gray-600 group-hover:text-purple-400 transition-colors" />
                  </div>
                </div>
              </Link>
            ))}

            {/* 数据看板 */}
            <GlassCard>
              <Title level={5} className="!text-[#9494b8] !mb-3 !text-sm !font-medium">我的数据</Title>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 rounded-lg bg-white/[0.03] border border-white/5">
                  <div className="text-lg font-bold text-white flex items-center justify-center gap-1">
                    <ShoppingCartOutlined className="text-amber-400 text-sm" /> 0
                  </div>
                  <div className="text-[10px] text-gray-500 mt-1">已购模板</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-white/[0.03] border border-white/5">
                  <div className="text-lg font-bold text-white flex items-center justify-center gap-1">
                    <DollarOutlined className="text-green-400 text-sm" /> ¥0
                  </div>
                  <div className="text-[10px] text-gray-500 mt-1">创作收益</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-white/[0.03] border border-white/5">
                  <div className="text-lg font-bold text-white flex items-center justify-center gap-1">
                    <FileTextOutlined className="text-purple-400 text-sm" /> 0
                  </div>
                  <div className="text-[10px] text-gray-500 mt-1">项目数</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-white/[0.03] border border-white/5">
                  <div className="text-lg font-bold text-white flex items-center justify-center gap-1">
                    <UserOutlined className="text-cyan-400 text-sm" /> 0
                  </div>
                  <div className="text-[10px] text-gray-500 mt-1">粉丝</div>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>

        {/* 右栏 — 社区动态 */}
        <div className="lg:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <FireOutlined className="text-rose-400 text-lg" />
            <Title level={5} className="!text-white !mb-0">社区动态</Title>
          </div>

          <GlassCard>
            <div className="space-y-3">
              {communityItems.length > 0 ? (
                communityItems.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/[0.04] transition-colors cursor-pointer">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center flex-shrink-0 border border-white/5">
                      <UserOutlined className="text-white/50 text-xs" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-xs truncate">{item.title}</p>
                      <div className="flex items-center gap-2 text-[10px] text-gray-600 mt-0.5">
                        <span>{item.user}</span>
                        <span>{item.time}</span>
                      </div>
                    </div>
                    {item.type === 'purchase' && <Tag className="!bg-cyan-500/20 !border-cyan-500/30 !text-cyan-400 !text-[10px] !rounded-full !m-0">购买</Tag>}
                    {item.type === 'publish' && <Tag className="!bg-amber-500/20 !border-amber-500/30 !text-amber-400 !text-[10px] !rounded-full !m-0">上架</Tag>}
                    {item.type === 'review' && <Tag className="!bg-purple-500/20 !border-purple-500/30 !text-purple-400 !text-[10px] !rounded-full !m-0">评论</Tag>}
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <FireOutlined className="text-3xl text-gray-600 mb-3" />
                  <div className="text-gray-500 text-sm mb-4">更多精彩动态即将到来</div>
                  <Link href="/dashboard/community">
                    <GradientBtn variant="community" size="sm">去社区看看</GradientBtn>
                  </Link>
                </div>
              )}
            </div>
          </GlassCard>

          <Link href="/dashboard/community" className="flex items-center gap-1 mt-3 text-sm text-accent-500 hover:text-accent-400 no-underline">
            进入社区 <ArrowRightOutlined className="text-xs" />
          </Link>
        </div>
      </div>
    </div>
  );
}
