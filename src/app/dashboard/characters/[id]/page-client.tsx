'use client';

import { useState } from 'react';
import PageHeader from '@/components/ui/page-header';
import GlassCard from '@/components/ui/glass-card';
import GradientBtn from '@/components/ui/gradient-btn';
import StatCard from '@/components/ui/stat-card';
import ScrollReveal from '@/components/ui/scroll-reveal';
import TagGroup from '@/components/ui/tag-group';
import AIGeneratePanel from '@/components/business/ai-generate-panel';

const mockCharacter = {
  id: 'demo',
  name: '柳如烟',
  gender: '女',
  age: 22,
  role: '女主 / 穿越者',
  style: '古装唯美',
  personality: ['聪慧', '独立', '傲娇', '善良', '腹黑'],
  background: '现代职场精英柳如烟，因一场意外穿越到古代，附身在与自己同名的丞相府庶女身上。面对豪门内斗和封建礼教的束缚，她凭借现代人的思维和胆识，一步步在古代开辟自己的商业帝国。',
  appearance: '长发及腰，肤白如雪，眉目清冷。穿越前是职场OL打扮，穿越后常着一袭素色长裙，气质冷艳又不失灵动。左眼角下有一颗泪痣，给她平添一抹神秘感。',
  relationships: [
    { name: '顾长夜', role: '男主 / 首富继承人', relation: '商业对手→知己→恋人' },
    { name: '柳如画', role: '嫡姐 / 丞相嫡女', relation: '表面敌对，暗中联手保护家族' },
    { name: '太夫人', role: '丞相府长辈', relation: '从看不起到最疼爱的孙女' },
    { name: '白芷', role: '贴身丫鬟', relation: '最忠心的伙伴' },
  ],
  projects: [
    { name: '穿越之我在古代当总裁', role: '女主', status: '进行中' },
    { name: '古风番外·商海浮沉', role: '女主', status: '待创作' },
  ],
  createdAt: '2026-05-18',
  updatedAt: '2026-06-29',
  wordCount: 12840,
};

export default function CharacterDetailClient({ params }: { params: { id: string } }) {
  const [activeSection, setActiveSection] = useState('overview');
  const [aiResult, setAiResult] = useState('');

  const sections = [
    { key: 'overview', label: '概览', icon: '📋' },
    { key: 'background', label: '背景故事', icon: '📖' },
    { key: 'appearance', label: '外貌设定', icon: '✨' },
    { key: 'relationships', label: '人物关系', icon: '🔗' },
    { key: 'projects', label: '关联项目', icon: '📁' },
  ];

  return (
    <div>
      <PageHeader
        title={mockCharacter.name}
        subtitle={`${mockCharacter.role} · ${mockCharacter.style}`}
        breadcrumbs={[
          { label: '工作台', href: '/dashboard' },
          { label: '角色管理', href: '/dashboard/characters' },
          { label: mockCharacter.name },
        ]}
        actions={
          <div className="flex gap-2">
            <GradientBtn variant="outline" size="sm">
              编辑角色
            </GradientBtn>
            <GradientBtn size="sm">AI 深入设定</GradientBtn>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Detail Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section navigation */}
          <div className="flex gap-1 bg-white/[0.02] rounded-xl p-1 border border-white/5 overflow-x-auto">
            {sections.map((sec) => (
              <button
                key={sec.key}
                onClick={() => setActiveSection(sec.key)}
                className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-all whitespace-nowrap ${
                  activeSection === sec.key
                    ? 'bg-purple-500/20 text-purple-400'
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                <span>{sec.icon}</span>
                {sec.label}
              </button>
            ))}
          </div>

          {/* Overview */}
          {activeSection === 'overview' && (
            <ScrollReveal>
              <div className="space-y-4">
                {/* Quick Info Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: '性别', value: mockCharacter.gender },
                    { label: '年龄', value: `${mockCharacter.age}岁` },
                    { label: '角色定位', value: mockCharacter.role.split(' / ')[0] },
                    { label: '创作字数', value: `${(mockCharacter.wordCount / 1000).toFixed(1)}k` },
                  ].map((info, i) => (
                    <GlassCard key={i} className="p-4 text-center">
                      <span className="text-[10px] text-gray-500 uppercase">{info.label}</span>
                      <span className="block mt-1 text-sm font-medium text-white">{info.value}</span>
                    </GlassCard>
                  ))}
                </div>

                {/* Personality Tags */}
                <GlassCard className="p-5">
                  <h4 className="text-sm font-medium text-gray-400 mb-3">性格特征</h4>
                  <TagGroup
                    tags={mockCharacter.personality.map((p) => ({
                      key: p,
                      label: p,
                      color: 'purple' as const,
                    }))}
                  />
                </GlassCard>

                {/* Quick bio */}
                <GlassCard className="p-5">
                  <h4 className="text-sm font-medium text-gray-400 mb-3">简介</h4>
                  <p className="text-sm text-gray-300 leading-relaxed">{mockCharacter.background.substring(0, 150)}...</p>
                </GlassCard>
              </div>
            </ScrollReveal>
          )}

          {/* Background */}
          {activeSection === 'background' && (
            <ScrollReveal>
              <GlassCard className="p-6">
                <h4 className="text-sm font-medium text-gray-400 mb-4">完整背景故事</h4>
                <div className="text-sm text-gray-300 leading-relaxed space-y-3 whitespace-pre-line">
                  {mockCharacter.background}
                </div>
                <div className="mt-6 flex items-center gap-4 text-xs text-gray-500">
                  <span>创建于 {mockCharacter.createdAt}</span>
                  <span>更新于 {mockCharacter.updatedAt}</span>
                  <span>{mockCharacter.wordCount.toLocaleString()} 字</span>
                </div>
              </GlassCard>
            </ScrollReveal>
          )}

          {/* Appearance */}
          {activeSection === 'appearance' && (
            <ScrollReveal>
              <GlassCard className="p-6">
                <h4 className="text-sm font-medium text-gray-400 mb-4">外貌设定</h4>
                <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">
                  {mockCharacter.appearance}
                </p>
                <div className="mt-6 p-4 rounded-xl bg-gradient-to-br from-purple-500/5 to-cyan-500/5 border border-dashed border-white/10">
                  <p className="text-xs text-gray-500 mb-3">AI 可以根据外貌设定生成角色形象图</p>
                  <GradientBtn size="sm" variant="outline">
                    生成角色形象
                  </GradientBtn>
                </div>
              </GlassCard>
            </ScrollReveal>
          )}

          {/* Relationships */}
          {activeSection === 'relationships' && (
            <ScrollReveal>
              <div className="space-y-3">
                {mockCharacter.relationships.map((rel, i) => (
                  <GlassCard key={i} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/10 to-cyan-500/5 text-purple-400 font-bold text-sm">
                          {rel.name.charAt(0)}
                        </div>
                        <div>
                          <span className="font-medium text-white text-sm">{rel.name}</span>
                          <span className="ml-2 text-xs text-gray-500">{rel.role}</span>
                        </div>
                      </div>
                      <div className="hidden sm:block">
                        <span className="text-xs px-3 py-1 rounded-full bg-purple-500/10 text-purple-400">
                          {rel.relation}
                        </span>
                      </div>
                    </div>
                    <p className="mt-2 sm:hidden text-xs text-purple-400">{rel.relation}</p>
                  </GlassCard>
                ))}
              </div>
            </ScrollReveal>
          )}

          {/* Projects */}
          {activeSection === 'projects' && (
            <ScrollReveal>
              <div className="space-y-3">
                {mockCharacter.projects.map((proj, i) => (
                  <GlassCard key={i} hover className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-white">{proj.name}</h4>
                        <p className="text-xs text-gray-500 mt-0.5">角色: {proj.role}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`rounded-md border px-2 py-0.5 text-[10px] ${
                            proj.status === '进行中'
                              ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                              : 'bg-gray-500/10 text-gray-400 border-gray-500/20'
                          }`}
                        >
                          {proj.status}
                        </span>
                        <svg className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </GlassCard>
                ))}
              </div>
            </ScrollReveal>
          )}
        </div>

        {/* Right: AI Panel + Stats */}
        <div className="space-y-6">
          {/* Stats */}
          <div className="space-y-3">
            <StatCard title="关联项目" value={mockCharacter.projects.length} accent="purple" />
            <StatCard title="创作字数" value={mockCharacter.wordCount.toLocaleString()} accent="cyan" />
            <StatCard title="人物关系" value={mockCharacter.relationships.length} accent="pink" />
          </div>

          {/* AI Generate Panel */}
          <AIGeneratePanel
            title="AI 性格扩展"
            placeholder={`为「${mockCharacter.name}」补充细节性格特征、口头禅、行为习惯...`}
            quickTags={['性格细节', '口头禅', '行为习惯', '情感弱点']}
            onGenerate={(prompt) => {
              setAiResult(`基于对「${mockCharacter.name}」的深入分析：

**性格细节补充：**
1. 表面冷淡实则内心柔软，尤其对弱势群体格外包容
2. 有轻微的强迫症，书桌上的物品必须按特定顺序摆放
3. 不善于表达情感，但会通过实际行动默默关心身边人

**口头禅：**
- "这有什么难的"（面对挑战时）
- "你觉得呢？"（反将一军时的经典反问）
- "古人也不是吃素的"（每次被古代规矩限制时的吐槽）

**行为习惯：**
- 遇到难题时会下意识轻咬下唇
- 开心时会微微挑眉，自己都不曾察觉
- 独处时喜欢坐在窗边发呆，这是她为数不多卸下防备的时刻`);
            }}
            lastResult={aiResult}
            onApply={() => {}}
          />

          <AIGeneratePanel
            title="AI 外貌细化"
            placeholder={`描述你想要「${mockCharacter.name}」的外貌风格...`}
            quickTags={['古风', '清冷', '灵秀', '英气']}
            onGenerate={(prompt) => {
              setAiResult('基于角色定位，建议外貌设定：\n\n- 发型：云鬓半挽，一支白玉簪斜插发间，几缕碎发垂落耳畔\n- 服饰：月白色素纱长裙，腰束青黛纱带，外罩银线暗绣鹤纹褙子\n- 配饰：颈间一枚羊脂玉吊坠（穿越信物），腕间银铃一对\n- 妆容：远山眉配淡朱唇，不着粉黛自生华');
            }}
            lastResult={aiResult}
          />
        </div>
      </div>
    </div>
  );
}
