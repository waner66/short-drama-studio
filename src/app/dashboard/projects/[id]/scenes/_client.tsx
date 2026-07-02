'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import PageHeader from '@/components/ui/page-header';
import GlassCard from '@/components/ui/glass-card';
import GradientBtn from '@/components/ui/gradient-btn';
import StatCard from '@/components/ui/stat-card';
import AiGeneratePanel from '@/components/business/ai-generate-panel';

const mockScenes = [
  { id: '1', number: 1, title: '现代办公室', location: '苏氏集团 · 总裁办公室', time: '白天', description: '苏晚晴在办公室处理公司事务，竞争对手暗中布局。主要展现女主职场精英形象。', emotion: '紧张、压抑', props: ['办公桌', '电脑', '文件夹', '咖啡杯'], characterIds: ['1'], duration: '2分钟', status: 'IN_PROGRESS' as const, storyboardCount: 3, characters: ['苏晚晴'] },
  { id: '2', number: 2, title: '意外穿越', location: '城市高架桥', time: '夜晚', description: '苏晚晴遭遇车祸后穿越到古代。玄幻感强烈的转场，从现代到古代的视觉冲击。', emotion: '惊恐、迷茫', props: ['红色跑车', '手机', '现代服装'], characterIds: ['1'], duration: '1.5分钟', status: 'COMPLETED' as const, storyboardCount: 5, characters: ['苏晚晴'] },
  { id: '3', number: 3, title: '古代商行', location: '苏家商行', time: '上午', description: '苏晚晴在父亲商行中初次展示现代商业理念，令众人目瞪口呆。', emotion: '震惊、佩服', props: ['算盘', '账本', '古代铜钱'], characterIds: ['1', '2'], duration: '2分钟', status: 'DRAFT' as const, storyboardCount: 0, characters: ['苏晚晴', '慕容瑾'] },
  { id: '4', number: 4, title: '初次交锋', location: '江南茶楼', time: '午后', description: '在茶楼偶遇神秘富商慕容瑾，两人商业理念碰撞，言辞交锋。', emotion: '好奇、试探', props: ['茶具', '扇子', '古琴'], characterIds: ['1', '2'], duration: '2.5分钟', status: 'DRAFT' as const, storyboardCount: 0, characters: ['苏晚晴', '慕容瑾'] },
  { id: '5', number: 5, title: '商业对决', location: '江南商会 · 大厅', time: '上午', description: '苏晚晴用现代商业理念击败老派对手，一鸣惊人。全场高潮。', emotion: '热血、振奋', props: ['商会令牌', '契约书', '毛笔'], characterIds: ['1', '2', '3'], duration: '3分钟', status: 'DRAFT' as const, storyboardCount: 0, characters: ['苏晚晴', '慕容瑾', '柳如烟'] },
];

const statusCfg: Record<string, { color: string; label: string; bg: string }> = {
  DRAFT: { color: 'text-gray-400', label: '草稿', bg: 'bg-gray-500/20' },
  IN_PROGRESS: { color: 'text-yellow-400', label: '制作中', bg: 'bg-yellow-500/20' },
  COMPLETED: { color: 'text-green-400', label: '完成', bg: 'bg-green-500/20' },
};

const SCENE_AI_TAGS = ['玄幻穿越', '都市爱情', '古装权谋', '悬疑惊悚', '甜宠搞笑'];

export default function ScenesClient() {
  const { id } = useParams<{ id: string }>();
  const [scenes, setScenes] = useState(mockScenes);
  const [showAdd, setShowAdd] = useState(false);
  const [showAi, setShowAi] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<string | null>(null);
  const [addingScene, setAddingScene] = useState(false);

  const completedCount = scenes.filter((s) => s.status === 'COMPLETED').length;
  const totalDuration = scenes.reduce((sum, s) => {
    const mins = parseFloat(s.duration);
    return sum + (isNaN(mins) ? 0 : mins);
  }, 0);
  const totalStoryboards = scenes.reduce((sum, s) => sum + s.storyboardCount, 0);

  const handleAiGenerateScene = (prompt: string) => {
    if (!prompt.trim()) return;
    setAiLoading(true);

    setTimeout(() => {
      const isNight = prompt.includes('夜') || prompt.includes('晚上');
      const locationMap: Record<string, { title: string; location: string; props: string[]; emotion: string }> = {
        '玄幻': { title: '初入异界', location: '幻境之门', props: ['灵器', '卷轴', '丹药'], emotion: '震撼、好奇' },
        '都市': { title: '高楼对决', location: 'CBD天台', props: ['手机', '文件', '咖啡杯'], emotion: '紧张、刺激' },
        '古装': { title: '朝堂辩论', location: '金銮殿', props: ['奏章', '玉佩', '毛笔'], emotion: '严肃、激昂' },
        '悬疑': { title: '深夜追踪', location: isNight ? '废弃工厂' : '昏暗小巷', props: ['手电筒', '证据袋', '对讲机'], emotion: '紧张、恐惧' },
        '甜宠': { title: '甜蜜邂逅', location: '音乐咖啡厅', props: ['咖啡', '吉他', '书信'], emotion: '甜蜜、温馨' },
      };

      let map = locationMap['都市'];
      for (const [key, val] of Object.entries(locationMap)) {
        if (prompt.includes(key)) { map = val; break; }
      }

      const newNumber = scenes.length + 1;
      const newScene = {
        id: String(Date.now()),
        number: newNumber,
        title: map.title,
        location: map.location,
        time: isNight ? '夜晚' : '白天',
        description: prompt,
        emotion: map.emotion,
        props: map.props,
        characterIds: [],
        duration: '2分钟',
        status: 'DRAFT' as const,
        storyboardCount: 0,
        characters: [],
      };

      setScenes((prev) => [...prev, newScene]);
      const result = `场景${newNumber}: ${map.title}\n📍 ${map.location} · ${isNight ? '夜晚' : '白天'}\n💭 ${map.emotion}\n\n${prompt}\n\n🎬 AI已为你生成新场景，请继续编辑细节。`;
      setAiResult(result);
      setAiLoading(false);
    }, 1200);
  };

  return (
    <div>
      {/* 面包屑 */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
        <Link href="/dashboard/projects" className="hover:text-white transition-colors">项目</Link>
        <span>/</span>
        <Link href={`/dashboard/projects/${id}`} className="hover:text-white transition-colors">穿越之我在古代当总裁</Link>
        <span>/</span>
        <span className="text-white">场景</span>
      </div>

      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <PageHeader title="场景管理" />
        <div className="flex items-center gap-2">
          <GradientBtn onClick={() => setShowAi(!showAi)} variant={showAi ? 'secondary' : undefined}>
            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            AI 生成场景
          </GradientBtn>
          <GradientBtn onClick={() => setShowAdd(true)}>+ 添加场景</GradientBtn>
        </div>
      </div>

      {/* AI 场景生成面板 */}
      {showAi && (
        <div className="mb-6">
          <AiGeneratePanel
            type="scene"
            title="AI 场景生成器"
            description="描述你想要的场景氛围和情节，AI 自动生成场景设定"
            placeholder="例：深夜废弃工厂，主角在黑暗中寻找关键证据，气氛紧张..."
            quickTags={SCENE_AI_TAGS}
            loading={aiLoading}
            onGenerate={handleAiGenerateScene}
            lastResult={aiResult || undefined}
            onApply={() => setShowAi(false)}
          />
        </div>
      )}

      {/* 统计 */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <StatCard title="场景总数" value={String(scenes.length)} accent="cyan" />
        <StatCard title="已完成" value={`${completedCount}/${scenes.length}`} accent="green" />
        <StatCard title="总时长" value={`${totalDuration}分钟`} accent="purple" />
      </div>

      {/* 场景列表 - 时间线 */}
      <div className="space-y-4">
        {scenes.map((scene, i) => {
          const st = statusCfg[scene.status];
          return (
            <div key={scene.id} className="flex gap-4">
              {/* 时间线节点 */}
              <div className="flex flex-col items-center flex-shrink-0">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                  scene.status === 'COMPLETED' ? 'bg-[#00d4aa] text-black' :
                  scene.status === 'IN_PROGRESS' ? 'bg-brand-500 text-white' :
                  'bg-white/10 text-gray-500'
                }`}>
                  {scene.status === 'COMPLETED' ? '✓' : scene.number}
                </div>
                {i < scenes.length - 1 && <div className="w-px flex-1 min-h-[24px] bg-white/10 my-1" />}
              </div>

              {/* 内容 */}
              <GlassCard hover className="flex-1 pb-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-white">场景{scene.number}: {scene.title}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${st.bg} ${st.color}`}>
                        {st.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {scene.location}
                      </span>
                      <span>{scene.time}</span>
                      <span>{scene.duration}</span>
                    </div>
                  </div>
                </div>

                {/* 描述 */}
                <p className="text-sm text-gray-400 mb-3">{scene.description}</p>

                {/* 角色 */}
                <div className="flex items-center gap-1.5 mb-3">
                  <span className="text-xs text-gray-600">角色:</span>
                  {scene.characters.map((name) => (
                    <span key={name} className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-gray-300">{name}</span>
                  ))}
                  <button className="text-xs text-brand-500 hover:text-[#7b5eff]">+ 添加</button>
                </div>

                {/* 道具 */}
                <div className="flex items-center gap-1.5 mb-3">
                  <span className="text-xs text-gray-600">道具:</span>
                  {scene.props.map((prop) => (
                    <span key={prop} className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-gray-500">{prop}</span>
                  ))}
                </div>

                {/* 情绪 */}
                <div className="flex items-center gap-1.5 mb-3">
                  <span className="text-xs text-gray-600">情绪:</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-purple-500/10 text-purple-400">{scene.emotion}</span>
                </div>

                {/* 分镜链接 + 操作 */}
                <div className="flex items-center justify-between pt-3 border-t border-white/5">
                  <Link
                    href={`/dashboard/projects/${id}/storyboard`}
                    className="text-sm text-brand-500 hover:text-[#7b5eff] transition-colors flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v5a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1v-2zM14 16a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1v-2z" />
                    </svg>
                    编辑分镜 ({scene.storyboardCount})
                  </Link>
                  <div className="flex gap-1">
                    <button className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </GlassCard>
            </div>
          );
        })}
      </div>
    </div>
  );
}
