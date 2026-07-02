'use client';

import { useEffect, useState } from 'react';
import './template-detail-drawer.css';
import { type TemplateCardV2Data } from './template-card-v2';

interface TemplateDetailDrawerProps {
  open: boolean;
  data: TemplateCardV2Data | null;
  type: 'character' | 'scene' | 'plot';
  onClose: () => void;
  onUse: (data: TemplateCardV2Data) => void;
  onFavorite?: (id: string) => void;
  isFavorited?: boolean;
}

export default function TemplateDetailDrawer({
  open,
  data,
  type,
  onClose,
  onUse,
  onFavorite,
  isFavorited = false,
}: TemplateDetailDrawerProps) {
  const [animating, setAnimating] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (open) {
      setVisible(true);
      // 延迟一帧触发动画
      requestAnimationFrame(() => setAnimating(true));
    } else {
      setAnimating(false);
      // 等待动画完成后隐藏
      const timer = setTimeout(() => setVisible(false), 400);
      return () => clearTimeout(timer);
    }
  }, [open]);

  if (!visible || !data) return null;

  const handleUse = () => {
    onUse(data);
    onClose();
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFavorite?.(data.id);
  };

  const handleBackdrop = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).classList.contains('drawer-backdrop')) {
      onClose();
    }
  };

  return (
    <div
      className={`drawer-backdrop ${animating ? 'active' : ''}`}
      onClick={handleBackdrop}
    >
      <div className={`template-drawer ${animating ? 'open' : ''}`}>
        {/* 关闭按钮 */}
        <button className="drawer-close-btn" onClick={onClose}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        {/* 封面区域 */}
        <div
          className="drawer-cover"
          style={{ background: data.coverGradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
        >
          <span className="drawer-cover-emoji">{data.coverEmoji || '🎬'}</span>

          {/* 价格 */}
          <div className="drawer-price">
            {data.price === 0 ? (
              <span className="drawer-price-free">免费模板</span>
            ) : (
              <span className="drawer-price-paid">¥{data.price}</span>
            )}
          </div>
        </div>

        {/* 内容区域 */}
        <div className="drawer-content">
          {/* 标题区 */}
          <div className="drawer-header">
            <h2 className="drawer-title">{data.name}</h2>
            <p className="drawer-subtitle">
              {type === 'character' && '👤 人物模板'}
              {type === 'scene'     && '🎬 场景模板'}
              {type === 'plot'      && '📖 剧情模板'}
            </p>
          </div>

          {/* 描述 */}
          <div className="drawer-section">
            <h4 className="drawer-section-title">模板描述</h4>
            <p className="drawer-description">{data.description}</p>
          </div>

          {/* 详细信息（根据类型展示） */}
          {type === 'scene' && (
            <div className="drawer-section">
              <h4 className="drawer-section-title">场景信息</h4>
              <div className="drawer-info-grid">
                {data.atmosphere && (
                  <div className="drawer-info-item">
                    <span className="drawer-info-label">🌡️ 氛围</span>
                    <span className="drawer-info-value">{data.atmosphere}</span>
                  </div>
                )}
                {data.era && (
                  <div className="drawer-info-item">
                    <span className="drawer-info-label">🏯 时代</span>
                    <span className="drawer-info-value">{data.era}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {type === 'plot' && data.genre && (
            <div className="drawer-section">
              <h4 className="drawer-section-title">剧情信息</h4>
              <div className="drawer-info-grid">
                <div className="drawer-info-item">
                  <span className="drawer-info-label">📚 题材</span>
                  <span className="drawer-info-value">{data.genre}</span>
                </div>
              </div>
            </div>
          )}

          {/* 标签 */}
          <div className="drawer-section">
            <h4 className="drawer-section-title">标签</h4>
            <div className="drawer-tags">
              {data.tags.map(tag => (
                <span key={tag} className="drawer-tag">{tag}</span>
              ))}
            </div>
          </div>

          {/* AI 提示词模板（如果有） */}
          {(data as any).promptTemplate && (
            <div className="drawer-section">
              <h4 className="drawer-section-title">🤖 AI 生成提示词</h4>
              <div className="drawer-prompt-box">
                <code>{(data as any).promptTemplate}</code>
              </div>
            </div>
          )}
        </div>

        {/* 底部操作栏 */}
        <div className="drawer-actions">
          <button className="drawer-btn drawer-btn-use" onClick={handleUse}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
            立即使用此模板
          </button>

          {onFavorite && (
            <button
              className={`drawer-btn drawer-btn-fav ${isFavorited ? 'active' : ''}`}
              onClick={handleFavorite}
            >
              <svg
                width="20" height="20" viewBox="0 0 24 24"
                fill={isFavorited ? 'currentColor' : 'none'}
                stroke="currentColor" strokeWidth="2"
              >
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
              </svg>
              {isFavorited ? '已收藏' : '收藏模板'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
