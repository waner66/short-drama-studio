'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import PageHeader from '@/components/ui/page-header';
import GlassCard from '@/components/ui/glass-card';
import GradientBtn from '@/components/ui/gradient-btn';
import AiGeneratePanel from '@/components/business/ai-generate-panel';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcut';

const ACTS = ['第一幕 · 开场', '第二幕 · 发展', '第三幕 · 高潮', '第四幕 · 转折', '第五幕 · 结局'];

const mockScript = {
  title: '穿越之我在古代当总裁',
  acts: [
    {
      id: 1,
      title: '第一幕 · 开场',
      scenes: [
        { id: 's1', title: '场景1: 现代办公室', description: '女总裁苏晚晴在现代办公室处理公司事务，遭遇竞争对手暗算。', dialogue: '苏晚晴（冷笑）：就这点手段，也想扳倒我？', duration: '2分钟', status: 'IN_PROGRESS' },
        { id: 's2', title: '场景2: 意外穿越', description: '苏晚晴遭遇车祸，醒来发现自己穿越到了古代江南首富之家。', dialogue: '苏晚晴（震惊）：这是...什么地方？', duration: '1.5分钟', status: 'COMPLETED' },
      ],
    },
    {
      id: 2,
      title: '第二幕 · 发展',
      scenes: [
        { id: 's3', title: '场景1: 古代商行', description: '苏晚晴在父亲的商行里初次展示商业才华，令众人惊讶。', duration: '2分钟', status: 'DRAFT' },
        { id: 's4', title: '场景2: 邂逅男主', description: '在商行遇到神秘富商慕容瑾，两人初次交锋。', duration: '2.5分钟', status: 'DRAFT' },
      ],
    },
    {
      id: 3,
      title: '第三幕 · 高潮',
      scenes: [
        { id: 's5', title: '场景1: 商业对决', description: '苏晚晴与政敌的商业对决，用现代商业理念击败对手。', duration: '3分钟', status: 'DRAFT' },
      ],
    },
  ],
};

const statusCfg: Record<string, { color: string; label: string; bg: string }> = {
  DRAFT: { color: 'text-gray-400', label: '草稿', bg: 'bg-gray-500/20' },
  IN_PROGRESS: { color: 'text-yellow-400', label: '编写中', bg: 'bg-yellow-500/20' },
  COMPLETED: { color: 'text-green-400', label: '已完成', bg: 'bg-green-500/20' },
};

export default function ScriptEditorClient() {
  const { id } = useParams<{ id: string }>();
  const [activeAct, setActiveAct] = useState(0);
  const [editingScene, setEditingScene] = useState<string | null>(null);
  const [showAi, setShowAi] = useState(false);
  const [script, setScript] = useState(mockScript);
  const [editContent, setEditContent] = useState('');

  // Keyboard shortcuts
  useKeyboardShortcuts([
    {
      key: 's', ctrl: true,
      handler: () => {
        if (editingScene) saveEdit(editingScene);
      },
      description: '保存当前编辑',
    },
    {
      key: 'Escape',
      handler: () => { if (editingScene) setEditingScene(null); },
      description: '取消编辑',
    },
  ]);

  const startEdit = (scene: any) => {
    setEditingScene(scene.id);
    setEditContent(scene.dialogue || scene.description || '');
  };

  const saveEdit = (sceneId: string) => {
    const newScript = { ...script };
    const acts = JSON.parse(JSON.stringify(newScript.acts));
    for (const act of acts) {
      const scene = act.scenes.find((s: any) => s.id === sceneId);
      if (scene) {
        scene.dialogue = editContent;
        break;
      }
    }
    newScript.acts = acts;
    setScript(newScript);
    setEditingScene(null);
  };

  const currentAct = script.acts[activeAct];
  const totalScenes = script.acts.reduce((sum, act) => sum + act.scenes.length, 0);
  const completedScenes = script.acts.reduce((sum, act) => sum + act.scenes.filter((s) => s.status === 'COMPLETED').length, 0);

  return (
    <div>
      {/* 面包屑 */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
        <Link href="/dashboard/projects" className="hover:text-white transition-colors">项目</Link>
        <span>/</span>
        <Link href={`/dashboard/projects/${id}`} className="hover:text-white transition-colors">{script.title}</Link>
        <span>/</span>
        <span className="text-white">剧本</span>
      </div>

      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <PageHeader title="剧本编辑器" />
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">{completedScenes}/{totalScenes} 场景完成</span>
          <GradientBtn onClick={() => setShowAi(!showAi)}>
            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            AI 续写
          </GradientBtn>
        </div>
      </div>

      {/* AI 面板 */}
      {showAi && (
        <div className="mb-6">
          <AiGeneratePanel
            type="script"
            title="AI 剧本助手"
            description={`为「${script.title}」续写剧本内容`}
            onGenerate={(prompt) => {
              console.log('AI generate:', prompt);
              setShowAi(false);
            }}
          />
        </div>
      )}

      {/* 幕导航 */}
      <div className="flex gap-1 mb-6 overflow-x-auto pb-1">
        {script.acts.map((act, i) => (
          <button
            key={act.id}
            onClick={() => setActiveAct(i)}
            className={`px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              activeAct === i
                ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20'
                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            {act.title}
          </button>
        ))}
      </div>

      {/* 场景列表 */}
      <div className="space-y-3">
        {currentAct.scenes.map((scene) => {
          const st = statusCfg[scene.status] || statusCfg.DRAFT;
          const isEditing = editingScene === scene.id;

          return (
            <GlassCard key={scene.id} hover={!isEditing}>
              {!isEditing ? (
                <div className="flex items-start gap-4">
                  {/* 场景序号 */}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    scene.status === 'COMPLETED' ? 'bg-[#00d4aa]/20 text-[#00d4aa]' :
                    scene.status === 'IN_PROGRESS' ? 'bg-brand-500/20 text-brand-500' :
                    'bg-white/10 text-gray-500'
                  }`}>
                    {scene.id.replace('s', '')}
                  </div>

                  {/* 场景信息 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-white">{scene.title}</h4>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${st.bg} ${st.color}`}>
                        {st.label}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 mb-2">{scene.description}</p>
                    {'dialogue' in scene && scene.dialogue && (
                      <div className="bg-brand-500/5 border-l-2 border-brand-500/30 rounded-r-lg p-3 text-sm text-gray-300 italic">
                        &ldquo;{scene.dialogue}&rdquo;
                      </div>
                    )}
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-600">
                      <span>⏱ {scene.duration}</span>
                      <span>📝 120字</span>
                    </div>
                  </div>

                  {/* 操作 */}
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                      onClick={() => startEdit(scene)}
                      className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                      title="编辑"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors" title="删除">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ) : (
                /* 编辑模式 */
                <div>
                  <h4 className="font-semibold text-white mb-3">{scene.title}</h4>
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows={5}
                    className="w-full bg-white/5 border border-white/10 rounded-lg text-white px-3 py-2.5 text-sm focus:outline-none focus:border-brand-500 transition-colors resize-none mb-3 font-mono"
                    autoFocus
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{editContent.length} 字</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingScene(null)}
                        className="px-4 py-2 text-sm text-gray-400 hover:text-white bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                      >
                        取消
                      </button>
                      <GradientBtn onClick={() => saveEdit(scene.id)}>保存</GradientBtn>
                    </div>
                  </div>
                </div>
              )}
            </GlassCard>
          );
        })}

        {/* 添加场景 */}
        <GlassCard className="border-2 border-dashed border-white/10 hover:border-brand-500/30 cursor-pointer group text-center py-6">
          <div className="text-gray-500 group-hover:text-brand-500 transition-colors">
            <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span className="text-sm">添加新场景</span>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
