'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import PageHeader from '@/components/ui/page-header';
import GlassCard from '@/components/ui/glass-card';
import GradientBtn from '@/components/ui/gradient-btn';
import AiGeneratePanel from '@/components/business/ai-generate-panel';
import PersonalityRadar from '@/components/ui/personality-radar';
import { officialTemplates } from '@/lib/data/character-templates';

const PERSONALITIES = ['活泼开朗', '冷静沉稳', '温柔善良', '霸道强势', '腹黑狡诈', '幽默风趣', '天真可爱', '成熟稳重', '神秘高冷'];

type CreateMode = 'manual' | 'ai';

const AI_CHARACTER_TAGS = ['霸道总裁', '甜宠女主', '冷酷杀手', '温柔医生', '腹黑谋士', '侠女', '校园学霸', '古代王爷', '修仙少女', '逆袭女主'];

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
    // 新增字段
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
  });

  // 从模板加载
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
          personality: [...d.surfaceTraits, ...d.innerTraits],
          appearance: d.appearanceDesc,
          backstory: d.backstory,
          style: d.style,
          archetype: d.archetype,
          catchphrase: d.catchphrase,
          signatureAction: d.signatureAction,
          weakness: d.weakness,
          desire: d.desire,
          voiceTone: d.voiceTone,
          surfaceTraits: d.surfaceTraits,
          innerTraits: d.innerTraits,
          arcDescription: d.arcDescription,
          extraversion: d.extraversion,
          agreeableness: d.agreeableness,
          conscientiousness: d.conscientiousness,
          neuroticism: d.neuroticism,
          openness: d.openness,
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

  const handleAiGenerate = (keyword: string) => {
    if (!keyword.trim()) return;
    setAiLoading(true);
    setAiPrompt(keyword);

    // Mock AI generation — 解析关键词生成角色属性
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

      // 年龄
      let ageType = 'young'; let age = 22;
      if (keyword.includes('中年') || keyword.includes('成熟')) { ageType = 'mature'; age = 45; }
      else if (keyword.includes('成年') || keyword.includes('总裁')) { ageType = 'adult'; age = 32; }

      // 性格
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

      // 外貌 + 背景
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

  const handleCreate = () => {
    if (!form.name.trim()) return;
    setLoading(true);
    setTimeout(() => {
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        import('@/lib/store/data-service').then(({ characterService }) => {
          characterService.create(user.id || 'anonymous', {
            name: form.name,
            gender: form.gender,
            age: form.age,
            personality: form.personality.join('、'),
            style: form.style,
            isAiGenerated: mode === 'ai',
          });
          setLoading(false);
          router.push('/dashboard/characters');
        });
      } catch {
        setLoading(false);
        router.push('/dashboard/characters');
      }
    }, 800);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <PageHeader
        title="创建角色"
        actions={
          <div className="flex bg-white/5 rounded-lg p-0.5">
            <button
              onClick={() => setMode('manual')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                mode === 'manual' ? 'bg-[#5b2eff] text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              手动填写
            </button>
            <button
              onClick={() => setMode('ai')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-1 ${
                mode === 'ai' ? 'bg-[#5b2eff] text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              AI 生成
            </button>
          </div>
        }
      />

      {/* AI 生成模式 */}
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

      {/* 表单主体 */}
      <GlassCard>
        <div className="space-y-5">
          {/* 名字 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                角色名字 <span className="text-red-400">*</span>
              </label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="例：林小羽"
                className="w-full h-10 bg-white/5 border border-white/10 rounded-lg text-white px-3 text-sm focus:outline-none focus:border-[#5b2eff] transition-colors"
                autoFocus
              />
            </div>
            {/* 性别 */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">性别</label>
              <div className="flex gap-2 h-10">
                {['男', '女'].map((g) => (
                  <button
                    key={g}
                    onClick={() => setForm({ ...form, gender: g })}
                    className={`flex-1 rounded-lg text-sm font-medium transition-all ${
                      form.gender === g
                        ? 'bg-[#5b2eff] text-white'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {g === '男' ? '♂' : '♀'} {g}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 年龄段 + 年龄 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">年龄段</label>
              <div className="flex gap-1.5 h-10">
                {[{ k: 'young', label: '青年' }, { k: 'adult', label: '成年' }, { k: 'mature', label: '中年' }].map((opt) => (
                  <button
                    key={opt.k}
                    onClick={() => setForm({ ...form, ageType: opt.k, age: opt.k === 'young' ? 22 : opt.k === 'adult' ? 35 : 50 })}
                    className={`flex-1 rounded-lg text-sm transition-all ${
                      form.ageType === opt.k
                        ? 'bg-[#5b2eff] text-white'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {opt.label}
                  </button>
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
                className="w-full h-10 bg-white/5 border border-white/10 rounded-lg text-white px-3 text-sm focus:outline-none focus:border-[#5b2eff] transition-colors"
              />
            </div>
          </div>

          {/* 性格 */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">性格标签（可多选）</label>
            <div className="flex flex-wrap gap-2">
              {PERSONALITIES.map((p) => {
                const selected = form.personality.includes(p);
                return (
                  <button
                    key={p}
                    onClick={() => togglePersonality(p)}
                    className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                      selected
                        ? 'bg-[#5b2eff]/20 border border-[#5b2eff]/50 text-[#5b2eff]'
                        : 'bg-white/5 border border-white/10 text-gray-400 hover:border-white/20 hover:text-gray-300'
                    }`}
                  >
                    {selected && '✓ '}{p}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 外貌描述 */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">外貌描述</label>
            <textarea
              value={form.appearance}
              onChange={(e) => setForm({ ...form, appearance: e.target.value })}
              rows={2}
              placeholder="描述角色的外貌特征..."
              className="w-full bg-white/5 border border-white/10 rounded-lg text-white px-3 py-2 text-sm focus:outline-none focus:border-[#5b2eff] transition-colors resize-none"
            />
          </div>

          {/* 背景故事 */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">背景故事</label>
            <textarea
              value={form.backstory}
              onChange={(e) => setForm({ ...form, backstory: e.target.value })}
              rows={3}
              placeholder="角色的身世和经历..."
              className="w-full bg-white/5 border border-white/10 rounded-lg text-white px-3 py-2 text-sm focus:outline-none focus:border-[#5b2eff] transition-colors resize-none"
            />
          </div>
        </div>

        {/* 高级人设区 */}
        {form.archetype || templateId ? (
          <div className="mt-4 pt-4 border-t border-white/10">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm text-gray-300 font-medium">高级人设</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">角色原型</label>
                <select value={form.archetype} onChange={e => setForm({ ...form, archetype: e.target.value })}
                  className="w-full h-10 bg-white/5 border border-white/10 rounded-lg text-white px-3 text-sm">
                  <option value="">不选择</option>
                  {['霸总','甜宠女主','冷酷杀手','恶毒女配','搞笑担当','深情男二','腹黑反派','神秘导师'].map(a =>
                    <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">口头禅</label>
                <input value={form.catchphrase} onChange={e => setForm({ ...form, catchphrase: e.target.value })}
                  placeholder="角色的经典台词..."
                  className="w-full h-10 bg-white/5 border border-white/10 rounded-lg text-white px-3 text-sm" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-3">
              <div>
                <label className="block text-xs text-red-400 mb-1">核心弱点</label>
                <input value={form.weakness} onChange={e => setForm({ ...form, weakness: e.target.value })}
                  placeholder="角色的致命弱点"
                  className="w-full h-10 bg-white/5 border border-white/10 rounded-lg text-white px-3 text-sm" />
              </div>
              <div>
                <label className="block text-xs text-green-400 mb-1">核心欲望</label>
                <input value={form.desire} onChange={e => setForm({ ...form, desire: e.target.value })}
                  placeholder="角色最渴望的东西"
                  className="w-full h-10 bg-white/5 border border-white/10 rounded-lg text-white px-3 text-sm" />
              </div>
            </div>
            <div className="mt-3">
              <label className="block text-xs text-gray-500 mb-1">人物弧光</label>
              <input value={form.arcDescription} onChange={e => setForm({ ...form, arcDescription: e.target.value })}
                placeholder="例：从封闭内心到敞开心扉"
                className="w-full h-10 bg-white/5 border border-white/10 rounded-lg text-white px-3 text-sm" />
            </div>
          </div>
        ) : null}

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-white/10">
          <button
            onClick={() => router.back()}
            className="px-5 py-2.5 text-sm text-gray-400 hover:text-white bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
          >
            取消
          </button>
          <GradientBtn onClick={handleCreate} loading={loading} disabled={!form.name.trim()}>
            {loading ? '创建中...' : '创建角色'}
          </GradientBtn>
        </div>
      </GlassCard>
    </div>
  );
}

export default function NewCharacterPageWrapper() {
  return (
    <Suspense fallback={<div className="max-w-2xl mx-auto py-20 text-center text-gray-400">加载中...</div>}>
      <NewCharacterPage />
    </Suspense>
  );
}
