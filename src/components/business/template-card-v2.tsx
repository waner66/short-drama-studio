'use client';

import { useState } from 'react';
import Image from 'next/image';
import './template-card-v2.css';

// 通用模板卡片 Props（支持人物/场景/剧情三种）
export interface TemplateCardV2Data {
  id: string;
  name: string;
  description: string;
  tags: string[];
  price: number;
  coverEmoji?: string;    // 新：emoji封面
  coverGradient?: string;  // 新：渐变封面
  coverUrl?: string;       // 旧：图片封面（兼容）
  era?: string;           // 场景/剧情用
  atmosphere?: string;     // 场景用
  genre?: string;          // 剧情用
}

interface TemplateCardV2Props {
  data: TemplateCardV2Data;
  type: 'character' | 'scene' | 'plot';
  onClick?: (data: TemplateCardV2Data) => void;
  onUse?: (data: TemplateCardV2Data) => void;
  onFavorite?: (id: string) => void;
  isFavorited?: boolean;
}

export default function TemplateCardV2({
  data,
  type,
  onClick,
  onUse,
  onFavorite,
  isFavorited = false,
}: TemplateCardV2Props) {
  const [isHovered, setIsHovered] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleClick = () => onClick?.(data);
  const handleUse = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUse?.(data);
  };
  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFavorite?.(data.id);
  };

  // 封面渲染优先级：coverUrl(图片) > coverGradient+emoji > 默认渐变
  const renderCover = () => {
    if (data.coverUrl && !imgError) {
      return (
        <img
          src={data.coverUrl}
          alt={data.name}
          className="card-cover-img"
          onError={() => setImgError(true)}
        />
      );
    }

    return (
      <div
        className="card-cover-gradient"
        style={{ background: data.coverGradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
      >
        <span className="card-cover-emoji">{data.coverEmoji || '🎬'}</span>

        {/* 装饰圆圈 */}
        <div className="card-cover-circle card-cover-circle-1" />
        <div className="card-cover-circle card-cover-circle-2" />
      </div>
    );
  };

  // 类型标签
  const renderTypeBadge = () => {
    const badges = {
      character: { text: '人物', color: '#8b5cf6' },
      scene:     { text: '场景', color: '#06b6d4' },
      plot:      { text: '剧情', color: '#f59e0b' },
    };
    const badge = badges[type];
    return (
      <span
        className="card-type-badge"
        style={{ background: `${badge.color}22`, color: badge.color, borderColor: `${badge.color}44` }}
      >
        {badge.text}
      </span>
    );
  };

  return (
    <div
      className={`template-card-v2 ${isHovered ? 'hovered' : ''}`}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 封面区域 */}
      <div className="card-cover-wrapper">
        {renderCover()}

        {/* 类型角标 */}
        <div className="card-type-badge-wrapper">
          {renderTypeBadge()}
        </div>

        {/* Hover 遮罩 + 操作按钮 */}
        <div className="card-hover-overlay">
          <button className="card-action-btn card-action-use" onClick={handleUse}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
            立即使用
          </button>
          <button className="card-action-btn card-action-fav" onClick={handleFavorite}>
            <svg
              width="18" height="18" viewBox="0 0 24 24" fill={isFavorited ? 'currentColor' : 'none'}
              stroke="currentColor" strokeWidth="2"
            >
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
            </svg>
          </button>
        </div>

        {/* 价格标签 */}
        <div className="card-price-tag">
          {data.price === 0 ? (
            <span className="price-free">免费</span>
          ) : (
            <span className="price-paid">¥{data.price}</span>
          )}
        </div>
      </div>

      {/* 信息区域 */}
      <div className="card-info">
        <h3 className="card-name" title={data.name}>{data.name}</h3>
        <p className="card-description">{data.description}</p>

        {/* 属性标签（根据类型显示不同信息） */}
        <div className="card-attrs">
          {type === 'scene' && data.atmosphere && (
            <span className="card-attr-tag">🌡️ {data.atmosphere}</span>
          )}
          {type === 'scene' && data.era && (
            <span className="card-attr-tag">🏯 {data.era}</span>
          )}
          {type === 'plot' && data.genre && (
            <span className="card-attr-tag">📚 {data.genre}</span>
          )}
        </div>

        {/* 标签 */}
        <div className="card-tags">
          {data.tags.slice(0, 3).map(tag => (
            <span key={tag} className="card-tag">
              {tag}
            </span>
          ))}
          {data.tags.length > 3 && (
            <span className="card-tag card-tag-more">+{data.tags.length - 3}</span>
          )}
        </div>
      </div>
    </div>
  );
}
