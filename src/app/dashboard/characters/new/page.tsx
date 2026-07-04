'use client';

import { useState, useEffect, Suspense, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ClipboardList, Palette, Brain, Drama, Gem, TrendingUp,
  FileText, Sparkles, Mars, Venus, Wand2,
} from 'lucide-react';
import PageHeader from '@/components/ui/page-header';
import GlassCard from '@/components/ui/glass-card';
import RefinedButton, { SegmentedControl } from '@/components/ui/refined-button';
import AiGeneratePanel from '@/components/business/ai-generate-panel';
import FaceBuilder, { type FaceConfig } from '@/components/business/face-builder';
import PersonalityRadarInteractive, { type PersonalityValues } from '@/components/business/personality-radar-interactive';
import TraitTagCloud from '@/components/business/trait-tag-cloud';
import DevelopmentArcEditor, { type ArcNode, DEFAULT_NODES } from '@/components/business/development-arc-editor';
import CharacterAvatarPreview from '@/components/business/character-avatar-preview';
import FormProgressRing from '@/components/business/form-progress-ring';
import { officialTemplates } from '@/lib/data/character-templates';

const PERSONALITIES = ['活泼开朗', '冷静沉稳', '温柔善良', '霸道强势', '腹黑狡诈', '幽默风趣', '天真可爱', '成熟稳重', '神秘高冷'];
const AI_CHARACTER_TAGS = ['霸道总裁', '甜宠女主', '冷酷杀手', '温柔医生', '腹黑谋士', '侠女', '校园学霸', '古代王爷', '修仙少女', '逆袭女主'];

const SURFACE_TRAITS = [
  '活泼', '温柔', '霸道', '高冷', '幽默', '天真', '沉稳', '神秘',
  '腹黑', '直率', '腼腆', '洒脱', '慵懒', '热情', '内敛', '毒舌',
  '傲娇', '优雅', '狂野', '呆萌',
];
const INNER_TRAITS = [
  '坚韧', '聪明', '善良', '执着', '敏感', '勇敢', '自卑', '骄傲',
  '偏执', '隐忍', '忠诚', '叛逆', '矛盾', '通透', '纯粹', '孤独',
  '炽热', '脆弱', '算计', '慈悲',
];

type CreateMode = 'manual' | 'ai';

function NewCharacterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateId = searchParams.get('template');
  const [mode, setMode] = useState<CreateMode>('manual');
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResult, setAiResult] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: '',
    gender: '女' as string,
    ageType: 'young' as string,
    age: 22,
    personality: [] as string[],
    appearance: '',
    backstory: '',
    style: '写实',
    archetype: '' as string,
    narrativeRole: [] as string[],
    catchphrase: '',
    signatureAction: '',
    weakness: '',
    desire: '',
    voiceTone: '',
    surfaceTraits: [] as string[],
    innerTraits: [] as string[],
    arcDescription: '',
    extraversion: 3,
    agreeableness: 3,
    conscientiousness: 3,
    neuroticism: 3,
    openness: 3,
    faceConfig: {
      hairStyle: 'long' as FaceConfig['hairStyle'],
      faceShape: 'oval' as FaceConfig['faceShape'],
      expression: 'smile' as FaceConfig['expression'],
      colorTheme: 'warm' as FaceConfig['colorTheme'],
      eyebrow: 'jian' as FaceConfig['eyebrow'],
      eyeShape: 'round' as FaceConfig['eyeShape'],
      mouthStyle: 'weixiao' as FaceConfig['mouthStyle'],
      skinTone: 'fair' as FaceConfig['skinTone'],
      accessory: 'none' as FaceConfig['accessory'],
      earring: 'none' as FaceConfig['earring'],
      collarStyle: 'round' as FaceConfig['collarStyle'],
      noseType: 'small' as FaceConfig['noseType'],
    },
    developmentArc: [] as ArcNode[],
  });

  useEffect(() => {
    if (form.developmentArc.length === 0) {
      setForm(prev => ({
        ...prev,
        developmentArc: DEFAULT_NODES.map(n => ({ ...n })),
      }));
    }
  }, []);

  useEffect(() => {
    if (templateId) {
      const tpl = officialTemplates.find(t => t.id === templateId);
      if (tpl) {
        const d = tpl.defaultData;
        setForm(prev => ({
          ...prev,
          name: '',
          gender: d.gender,
          age: d.age,
          personality: [...(d.surfaceTraits || []), ...(d.innerTraits || [])],
          appearance: d.appearanceDesc || '',
          backstory: d.backstory || '',
          style: d.style,
          archetype: d.archetype || '',
          catchphrase: d.catchphrase || '',
          signatureAction: d.signatureAction || '',
          weakness: d.weakness || '',
          desire: d.desire || '',
          voiceTone: d.voiceTone || '',
          surfaceTraits: d.surfaceTraits || [],
          innerTraits: d.innerTraits || [],
          arcDescription: d.arcDescription || '',
          extraversion: d.extraversion || 3,
          agreeableness: d.agreeableness || 3,
          conscientiousness: d.conscientiousness || 3,
          neuroticism: d.neuroticism || 3,
          openness: d.openness || 3,
        }));
      }
    }
  }, [templateId]);

  const togglePersonality = (p: string) => {
    setForm((prev) => ({
      ...prev,
      personality: prev.personality.includes(p)
        ? prev.personality.filter((x) => x !== p)
        : [...prev.personality, p],
    }));
  };

  const progressStats = useMemo(() => {
    const fields = [
      form.name,
      form.gender,
      form.age,
      form.personality.length > 0,
      form.appearance,
      form.backstory,
      form.archetype,
      form.weakness,
      form.desire,
      form.surfaceTraits.length > 0,
      form.innerTraits.length > 0,
      form.developmentArc.length >= 3,
    ];
    const filled = fields.filter(f => {
      if (typeof f === 'boolean') return f;
      if (typeof f === 'number') return f > 0;
      return f && f.length > 0;
    }).length;
    return { filled, total: fields.length };
  }, [form]);

  const handleAiGenerate = (keyword: string) => {
    if (!keyword.trim()) return;
    setAiLoading(true);
    setAiPrompt(keyword);

    setTimeout(() => {
      const isMale = keyword.includes('男') || keyword.includes('王') || keyword.includes('杀手') || keyword.includes('总裁') || keyword.includes('王爷');
      const gender = isMale ? '男' : '女';
      const nameMap: Record<string, string[]> = {
        '霸': ['慕容凛', '冷昊天', '萧逸尘'],
        '甜': ['苏软软', '林小糖', '安暖暖'],
        '冷': ['墨渊', '夜无痕', '凌寒'],
        '温': ['沈清和', '顾安之', '温如玉'],
        '腹': ['君墨离', '裴晏', '楚辞'],
        '侠': ['风清瑶', '云千雪', '柳如烟'],
        '校': ['陈星野', '陆晚晚', '许之昂'],
        '古': ['容景', '凤九歌', '白浅'],
        '仙': ['洛清尘', '苏沐雪', '花千骨'],
        '逆': ['叶倾颜', '顾九卿', '苏晚晴'],
      };

      let name = '';
      for (const [key, names] of Object.entries(nameMap)) {
        if (keyword.includes(key)) { name = names[Math.floor(Math.random() * names.length)]; break; }
      }
      if (!name) name = gender === '男' ? '萧逸尘' : '苏晚晴';

      let ageType = 'young'; let age = 22;
      if (keyword.includes('中年') || keyword.includes('成熟')) { ageType = 'mature'; age = 45; }
      else if (keyword.includes('成年') || keyword.includes('总裁')) { ageType = 'adult'; age = 32; }

      const personalityMap: Record<string, string[]> = {
        '霸': ['霸道强势', '冷静沉稳', '神秘高冷'],
        '甜': ['天真可爱', '活泼开朗', '温柔善良'],
        '冷': ['神秘高冷', '冷静沉稳', '腹黑狡诈'],
        '温': ['温柔善良', '成熟稳重'],
        '腹': ['腹黑狡诈', '冷静沉稳', '神秘高冷'],
        '侠': ['活泼开朗', '冷静沉稳', '温柔善良'],
        '校': ['活泼开朗', '天真可爱', '幽默风趣'],
        '古': ['冷静沉稳', '神秘高冷', '霸道强势'],
        '仙': ['神秘高冷', '温柔善良', '冷静沉稳'],
        '逆': ['活泼开朗', '成熟稳重', '冷静沉稳'],
      };

      let personalities: string[] = [];
      for (const [key, pers] of Object.entries(personalityMap)) {
        if (keyword.includes(key)) { personalities = pers; break; }
      }
      if (personalities.length === 0) personalities = ['冷静沉稳', '温柔善良'];

      const appearance = gender === '男'
        ? `${name === '冷昊天' || name === '墨渊' ? '剑眉星目' : '清秀儒雅'}，${ageType === 'young' ? '身形修长' : '成熟稳重'}，${keyword.includes('古') || keyword.includes('王') ? '身着深色长袍' : '身着现代时装'}，气场强大令人不敢直视。`
        : `${keyword.includes('甜') ? '甜美动人' : '明眸皓齿'}，${ageType === 'young' ? '身姿曼妙' : '气质优雅'}，${keyword.includes('古') || keyword.includes('仙') ? '一袭罗裙' : '时尚干练'}，举手投足间自带风采。`;

      const backstory = gender === '男'
        ? `${name}出身${keyword.includes('古') || keyword.includes('王') ? '王侯世家' : '商界名门'}，自幼${keyword.includes('冷') ? '历经磨难，性格孤傲' : '聪慧过人，备受期许'}。${ageType === 'young' ? '年少有成，已是' : '多年经营，已成为'}${keyword.includes('古') || keyword.includes('王') ? '朝中炙手可热的人物' : '业内公认的商业翘楚'}。${keyword.includes('杀') ? '然而他隐藏着不为人知的杀手身份。' : '然而内心深处始终渴望一份真挚的情感。'}`
        : `${name}${keyword.includes('仙') || keyword.includes('古') ? '生而灵秀，自小在' + (keyword.includes('仙') ? '仙门' : '名门') + '长大' : '出身普通但天资非凡'}，${keyword.includes('逆') ? '曾遭家族变故，从此决心逆天改命' : '凭借自己的才智和坚韧，一步步闯出了一片天地'}。${ageType === 'young' ? '年纪虽轻，却已' : '历经风雨，如今'}${keyword.includes('仙') || keyword.includes('古') ? '名动一方' : '成为独立坚强的女性'}。${keyword.includes('甜') ? '性格温暖，总能感染身边的人。' : '但她明白，真正的考验才刚刚开始。'}`;

      setForm(prev => ({
        ...prev,
        name,
        gender,
        ageType,
        age,
        personality: personalities,
        appearance,
        backstory,
        style: keyword.includes('古') || keyword.includes('仙') ? '玄幻古风' : '写实',
      }));

      setAiResult(`${name} · ${gender} · ${age}岁\n性格: ${personalities.join('、')}\n风格: ${keyword.includes('古') || keyword.includes('仙') ? '玄幻古风' : '写实'}\n\nAI已根据"${keyword}"自动填充角色属性，你可以继续手动调整。`);
      setAiLoading(false);
    }, 1500);
  };

  const handlePersonalityChange = (values: PersonalityValues) => {
    setForm(prev => ({
      ...prev,
      extraversion: values.extraversion,
      agreeableness: values.agreeableness,
      conscientiousness: values.conscientiousness,
      neuroticism: values.neuroticism,
      openness: values.openness,
    }));
  };

  const handleCreate = async () => {
    if (!form.name.trim()) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/characters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: form.name,
          gender: form.gender,
          age: form.age,
          personality: form.personality.join('、'),
          backstory: form.backstory,
          style: form.style,
          isAiGenerated: mode === 'ai',
          tags: [],
          archetype: form.archetype || null,
          narrativeRole: form.narrativeRole.length > 0 ? form.narrativeRole : null,
          arcDescription: form.arcDescription || null,
          surfaceTraits: form.surfaceTraits,
          innerTraits: form.innerTraits,
          catchphrase: form.catchphrase || null,
          signatureAction: form.signatureAction || null,
          weakness: form.weakness || null,
          desire: form.desire || null,
          voiceTone: form.voiceTone || null,
          appearanceDesc: form.appearance,
          imagePrompt: null,
          templateId: templateId || null,
          faceConfig: form.faceConfig,
          developmentArc: form.developmentArc,
        }),
      });
      if (!res.ok) throw new Error('创建失败');
      setLoading(false);
      router.push('/dashboard/characters');
    } catch {
      setLoading(false);
      alert('创建角色失败，请重试');
    }
  };

  const personalityValues: PersonalityValues = {
    extraversion: form.extraversion,
    agreeableness: form.agreeableness,
    conscientiousness: form.conscientiousness,
    neuroticism: form.neuroticism,
    openness: form.openness,
  };

  return (
    <div className="max-w-5xl mx-auto">
      <PageHeader
        title="创建角色"
        subtitle="可视化角色工坊 · 从捏脸到人设，全方位打造你的角色"
        actions={
          <SegmentedControl
            options={[
              { value: 'manual' as CreateMode, label: '手动创建' },
              { value: 'ai' as CreateMode, label: 'AI 生成', icon: <Sparkles className="w-3.5 h-3.5" /> },
            ]}
            value={mode}
            onChange={setMode}
          />
        }
      />

      {/* ===== AI 生成模式 ===== */}
      {mode === 'ai' && (
        <div className="mb-6">
          <AiGeneratePanel
            type="character"
            title="AI 智能角色生成"
            description="输入关键词，AI 自动为你创建完整角色设定"
            placeholder="例：修仙小说中温柔但腹黑的女主角，擅长医术..."
            quickTags={AI_CHARACTER_TAGS}
            loading={aiLoading}
            onGenerate={handleAiGenerate}
            lastResult={aiResult || undefined}
            onApply={() => setMode('manual')}
          />
        </div>
      )}

      {/* ===== 区① 角色预览卡 + 完成度 ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_200px] gap-4 mb-4">
        <CharacterAvatarPreview
          name={form.name || '未命名角色'}
          gender={form.gender}
          age={form.age}
          personality={form.personality}
          archetype={form.archetype}
          surfaceTraits={form.surfaceTraits}
          innerTraits={form.innerTraits}
          hairStyle={form.faceConfig.hairStyle}
          faceShape={form.faceConfig.faceShape}
          expression={form.faceConfig.expression}
          colorTheme={form.faceConfig.colorTheme}
          eyeShape={form.faceConfig.eyeShape}
          eyebrow={form.faceConfig.eyebrow}
          mouthStyle={form.faceConfig.mouthStyle}
          skinTone={form.faceConfig.skinTone}
          accessory={form.faceConfig.accessory}
          earring={form.faceConfig.earring}
          noseType={form.faceConfig.noseType}
        />
        <div className="flex flex-col items-center justify-center gap-2">
          <FormProgressRing filledFields={progressStats.filled} totalFields={progressStats.total} size={110} />
          <p className="text-xs text-gray-500 text-center">
            {progressStats.filled}/{progressStats.total} 项已完成
          </p>
          {progressStats.filled >= progressStats.total && (
            <span className="text-xs text-green-400 font-medium">完整人设</span>
          )}
        </div>
      </div>

      {/* ===== 区② 基础信息 ===== */}
      <GlassCard className="mb-4">
        <div className="p-5">
          <div className="flex items-center gap-2.5 mb-4">
            <ClipboardList className="w-5 h-5 text-violet-400" />
            <h3 className="text-base font-semibold text-white">基础信息</h3>
            <span className="text-[10px] text-gray-500 ml-auto bg-white/5 px-2 py-0.5 rounded-full">第 1 步</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                角色名字 <span className="text-red-400">*</span>
              </label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="例：林小羽"
                className="w-full h-10 bg-white/5 border border-white/10 rounded-lg text-white px-3 text-sm focus:outline-none focus:border-brand-500 transition-colors"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">性别</label>
              <div className="flex gap-2 h-10">
                <RefinedButton
                  variant="tag-chip"
                  selected={form.gender === '男'}
                  accent="#6366f1"
                  size="lg"
                  onClick={() => setForm({ ...form, gender: '男' })}
                  className="flex-1 justify-center"
                >
                  <Mars className="w-3.5 h-3.5" /> 男
                </RefinedButton>
                <RefinedButton
                  variant="tag-chip"
                  selected={form.gender === '女'}
                  accent="#ec4899"
                  size="lg"
                  onClick={() => setForm({ ...form, gender: '女' })}
                  className="flex-1 justify-center"
                >
                  <Venus className="w-3.5 h-3.5" /> 女
                </RefinedButton>
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">年龄段</label>
              <div className="flex gap-1.5 h-10">
                {[{ k: 'young', label: '青年' }, { k: 'adult', label: '成年' }, { k: 'mature', label: '中年' }].map((opt) => (
                  <RefinedButton
                    key={opt.k}
                    variant="tag-chip"
                    selected={form.ageType === opt.k}
                    accent="#8b5cf6"
                    size="lg"
                    onClick={() => setForm({ ...form, ageType: opt.k, age: opt.k === 'young' ? 22 : opt.k === 'adult' ? 35 : 50 })}
                    className="flex-1 justify-center"
                  >
                    {opt.label}
                  </RefinedButton>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">具体年龄</label>
              <input
                type="number"
                min={1} max={120}
                value={form.age}
                onChange={(e) => setForm({ ...form, age: Number(e.target.value) })}
                className="w-full h-10 bg-white/5 border border-white/10 rounded-lg text-white px-3 text-sm focus:outline-none focus:border-brand-500 transition-colors"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-400 mb-2">角色原型</label>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                {['霸总','甜宠女主','冷酷杀手','恶毒女配','搞笑担当','深情男二','腹黑反派','神秘导师'].map(a => (
                  <RefinedButton
                    key={a}
                    variant="tag-chip"
                    selected={form.archetype === a}
                    accent="#a855f7"
                    size="sm"
                    onClick={() => setForm({ ...form, archetype: form.archetype === a ? '' : a })}
                    className="justify-center"
                  >
                    {a}
                  </RefinedButton>
                ))}
              </div>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* ===== 区③ 人物捏脸 ===== */}
      <GlassCard className="mb-4">
        <div className="p-5">
          <div className="flex items-center gap-2.5 mb-4">
            <Palette className="w-5 h-5 text-pink-400" />
            <h3 className="text-base font-semibold text-white">人物捏脸</h3>
            <span className="text-[10px] text-gray-500 ml-auto bg-white/5 px-2 py-0.5 rounded-full">第 2 步</span>
          </div>
          <FaceBuilder
            gender={form.gender}
            value={form.faceConfig}
            onChange={(cfg) => setForm({ ...form, faceConfig: cfg })}
          />
        </div>
      </GlassCard>

      {/* ===== 区④ 五维人格 + 性格标签 ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <GlassCard>
          <div className="p-5">
            <div className="flex items-center gap-2.5 mb-3">
              <Brain className="w-5 h-5 text-cyan-400" />
              <h3 className="text-base font-semibold text-white">五维人格</h3>
              <span className="text-[10px] text-gray-500 ml-auto bg-white/5 px-2 py-0.5 rounded-full">拖拽调参</span>
            </div>
            <PersonalityRadarInteractive
              value={personalityValues}
              onChange={handlePersonalityChange}
              size={260}
            />
          </div>
        </GlassCard>
        <div className="flex flex-col gap-4">
          <GlassCard>
            <div className="p-5">
              <TraitTagCloud
                title="表层性格"
                icon={<Drama className="w-4 h-4" />}
                accent="#f97316"
                availableTags={SURFACE_TRAITS}
                selected={form.surfaceTraits}
                onChange={(tags) => setForm({ ...form, surfaceTraits: tags })}
              />
            </div>
          </GlassCard>
          <GlassCard>
            <div className="p-5">
              <TraitTagCloud
                title="内核性格"
                icon={<Gem className="w-4 h-4" />}
                accent="#8b5cf6"
                availableTags={INNER_TRAITS}
                selected={form.innerTraits}
                onChange={(tags) => setForm({ ...form, innerTraits: tags })}
              />
            </div>
          </GlassCard>
        </div>
      </div>

      {/* 传统性格标签（多选） */}
      <GlassCard className="mb-4">
        <div className="p-5">
          <label className="block text-sm text-gray-400 mb-2">性格标签（可多选）</label>
          <div className="flex flex-wrap gap-2">
            {PERSONALITIES.map((p) => {
              const selected = form.personality.includes(p);
              return (
                <RefinedButton
                  key={p}
                  variant="tag-chip"
                  selected={selected}
                  accent="#8b5cf6"
                  size="md"
                  onClick={() => togglePersonality(p)}
                >
                  {p}
                </RefinedButton>
              );
            })}
          </div>
        </div>
      </GlassCard>

      {/* ===== 区⑤ 角色发展线 ===== */}
      <GlassCard className="mb-4">
        <div className="p-5">
          <div className="flex items-center gap-2.5 mb-4">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-semibold text-white">角色发展线</h3>
            <span className="text-[10px] text-gray-500 ml-auto bg-white/5 px-2 py-0.5 rounded-full">第 3 步</span>
          </div>
          <DevelopmentArcEditor
            value={form.developmentArc}
            onChange={(nodes) => setForm({ ...form, developmentArc: nodes })}
          />
        </div>
      </GlassCard>

      {/* ===== 区⑥ 深度设定 ===== */}
      <GlassCard className="mb-4">
        <div className="p-5">
          <div className="flex items-center gap-2.5 mb-4">
            <FileText className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-semibold text-white">深度设定</h3>
            <span className="text-[10px] text-gray-500 ml-auto bg-white/5 px-2 py-0.5 rounded-full">第 4 步</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">外貌描述</label>
              <textarea
                value={form.appearance}
                onChange={(e) => setForm({ ...form, appearance: e.target.value })}
                rows={3}
                placeholder="描述角色的外貌特征..."
                className="w-full bg-white/5 border border-white/10 rounded-lg text-white px-3 py-2 text-sm focus:outline-none focus:border-brand-500 transition-colors resize-none"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">背景故事</label>
              <textarea
                value={form.backstory}
                onChange={(e) => setForm({ ...form, backstory: e.target.value })}
                rows={3}
                placeholder="角色的身世和经历..."
                className="w-full bg-white/5 border border-white/10 rounded-lg text-white px-3 py-2 text-sm focus:outline-none focus:border-brand-500 transition-colors resize-none"
              />
            </div>
            <div>
              <label className="block text-sm text-red-400 mb-2">核心弱点</label>
              <input
                value={form.weakness}
                onChange={(e) => setForm({ ...form, weakness: e.target.value })}
                placeholder="角色的致命弱点"
                className="w-full h-10 bg-white/5 border border-white/10 rounded-lg text-white px-3 text-sm focus:outline-none focus:border-red-500/50 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm text-green-400 mb-2">核心欲望</label>
              <input
                value={form.desire}
                onChange={(e) => setForm({ ...form, desire: e.target.value })}
                placeholder="角色最渴望的东西"
                className="w-full h-10 bg-white/5 border border-white/10 rounded-lg text-white px-3 text-sm focus:outline-none focus:border-green-500/50 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">口头禅</label>
              <input
                value={form.catchphrase}
                onChange={(e) => setForm({ ...form, catchphrase: e.target.value })}
                placeholder="角色的经典台词..."
                className="w-full h-10 bg-white/5 border border-white/10 rounded-lg text-white px-3 text-sm focus:outline-none focus:border-brand-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">标志动作</label>
              <input
                value={form.signatureAction}
                onChange={(e) => setForm({ ...form, signatureAction: e.target.value })}
                placeholder="角色的标志性动作"
                className="w-full h-10 bg-white/5 border border-white/10 rounded-lg text-white px-3 text-sm focus:outline-none focus:border-brand-500 transition-colors"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-400 mb-2">人物弧光描述</label>
              <input
                value={form.arcDescription}
                onChange={(e) => setForm({ ...form, arcDescription: e.target.value })}
                placeholder="例：从封闭内心到敞开心扉，从懦弱到勇敢..."
                className="w-full h-10 bg-white/5 border border-white/10 rounded-lg text-white px-3 text-sm focus:outline-none focus:border-brand-500 transition-colors"
              />
            </div>
          </div>
        </div>
      </GlassCard>

      {/* ===== 底部操作栏 ===== */}
      <GlassCard>
        <div className="p-5 flex justify-end gap-3">
          <RefinedButton
            variant="ghost-glass"
            onClick={() => router.back()}
          >
            取消
          </RefinedButton>
          <RefinedButton
            variant="primary"
            size="lg"
            icon={<Wand2 className="w-4 h-4" />}
            loading={loading}
            disabled={!form.name.trim()}
            onClick={handleCreate}
          >
            {loading ? '创建中...' : '创建角色'}
          </RefinedButton>
        </div>
      </GlassCard>
    </div>
  );
}

export default function NewCharacterPageWrapper() {
  return (
    <Suspense fallback={<div className="max-w-5xl mx-auto py-20 text-center text-gray-400">加载中...</div>}>
      <NewCharacterPage />
    </Suspense>
  );
}
