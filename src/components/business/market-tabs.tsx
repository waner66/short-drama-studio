'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import './market-tabs.css';

export type TabKey = 'character' | 'scene' | 'plot';

interface MarketTabsProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
}

const tabs: { key: TabKey; label: string; icon: string; emoji: string }[] = [
  { key: 'character', label: '人物模板', icon: 'users', emoji: '🎭' },
  { key: 'scene',     label: '场景模板', icon: 'landmark', emoji: '🎬' },
  { key: 'plot',      label: '剧情模板', icon: 'scroll', emoji: '📖' },
];

export default function MarketTabs({ activeTab, onTabChange }: MarketTabsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  // 同步 URL 参数
  useEffect(() => {
    if (!mounted) return;
    const params = new URLSearchParams(searchParams?.toString() || '');
    const tab = params.get('tab') as TabKey | null;
    if (tab && tabs.find(t => t.key === tab) && tab !== activeTab) {
      onTabChange(tab);
    }
  }, [searchParams, mounted]);

  // 计算指示器位置
  useEffect(() => {
    const el = document.querySelector(`[data-tab="${activeTab}"]`) as HTMLElement;
    if (el) {
      const parent = el.parentElement!;
      const parentRect = parent.getBoundingClientRect();
      const rect = el.getBoundingClientRect();
      setIndicatorStyle({
        left: rect.left - parentRect.left,
        width: rect.width,
      });
    }
  }, [activeTab, mounted]);

  const handleTabClick = (tab: TabKey) => {
    onTabChange(tab);
    const params = new URLSearchParams(searchParams?.toString() || '');
    params.set('tab', tab);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  if (!mounted) return null;

  return (
    <div className="market-tabs-wrapper">
      {/* 背景装饰 */}
      <div className="market-tabs-bg-glow" />

      <div className="market-tabs">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              data-tab={tab.key}
              className={`market-tab-btn ${isActive ? 'active' : ''}`}
              onClick={() => handleTabClick(tab.key)}
            >
              {/* 图标 */}
              <span className={`tab-emoji ${isActive ? 'bounce' : ''}`}>
                {tab.emoji}
              </span>

              {/* 标签文字 */}
              <span className="tab-label">{tab.label}</span>

              {/* 选中时的光晕 */}
              {isActive && <span className="tab-glow" />}
            </button>
          );
        })}

        {/* 滑动指示器 */}
        <div
          className="market-tab-indicator"
          style={{ left: indicatorStyle.left, width: indicatorStyle.width }}
        />
      </div>

      {/* 当前选中 Tab 的描述文字 */}
      <div className="market-tab-description">
        {activeTab === 'character' && '🎭 创建独特角色人设，定义性格、外貌、背景故事'}
        {activeTab === 'scene'     && '🎬 设计场景氛围，定义时代、地点、光影与音效'}
        {activeTab === 'plot'      && '📖 构建剧情大纲，设定结构、情节点与角色弧光'}
      </div>
    </div>
  );
}
