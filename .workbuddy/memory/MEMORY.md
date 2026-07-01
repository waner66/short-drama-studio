# 短剧制作App - 项目记忆

## 项目定位
- 纯 Web 端（Next.js 14 App Router + React 18）
- 国内市场（通义千问 + 通义万相 + 支付宝/微信支付 + 阿里云部署）
- 新用户赠送少量免费额度

## 技术栈
- 前端: React 18 + Next.js 14 + Ant Design 5 + TailwindCSS 3 + Zustand + React Query
- 动画: Framer Motion
- 主题: 自定义 ThemeProvider (暗黑/亮色双主题)
- 字体: Plus Jakarta Sans + Space Grotesk + Noto Sans SC
- 后端: Next.js API Routes + Python FastAPI (视频处理)
- 数据库: PostgreSQL 16 + Prisma ORM + Redis (缓存/队列)
- 存储: 阿里云 OSS + CDN
- AI: 通义千问 Qwen-Max / 通义万相 / CosyVoice TTS

## 项目结构
- src/app/ - Next.js App Router 页面 (17 功能页面 + 5 管理后台)
- src/components/ui/ - 通用 UI 组件 (glass-card, gradient-btn, scroll-reveal, loading-skeleton 等)
- src/components/business/ - 业务组件 (character-card, template-card, creator-strip 等)
- src/lib/ - 工具库 (prisma, auth-store, api, ai-service, quota, theme-context)
- src/lib/store/ - 本地数据层 (localStorage CRUD)
- src/hooks/ - React Hooks
- src/types/ - TypeScript 类型定义
- prisma/ - 数据库 Schema (12 张表)

## 开发规范
- 驼峰命名、TypeScript 严格模式
- API: RESTful + /api/* 路由
- 状态: Zustand (客户端) + React Query (服务端)
