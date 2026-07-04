# 短剧工坊 (Short Drama Studio) 项目笔记

## 项目概述
- 定位：短剧创作交易平台（AI创作 + 模板市场 + 社区）
- 技术栈：Next.js 14 + Prisma + PostgreSQL (Supabase) + Ant Design
- 仓库：github.com/waner66/short-drama-studio (Vercel部署)
- 部署 URL：short-drama-studio-gamma.vercel.app

## Phase 进度
| Phase | Commit | 内容 |
|-------|--------|------|
| 1 | a845d3a | 基础搭建 + UI改造 |
| A-D | 3fc5ff0 | UI全面美术升级 |
| 2 | 8f7e388 | 交易闭环(下单→支付→收益) |
| 3 | aec377a | 前端去Mock化(12 API + 8页面) |
| 4 | - | Python FastAPI视频服务 |
| 5 | - | 支付SDK集成(支付宝/微信) |
| 6 | - | 数据库迁移+18个API补全 |
| 7 | - | Vercel+Supabase部署准备 |
| ✨8 | 531bf8d | P0 Quick Wins（购买引导+Onboarding+骨架屏） |
| ✨9 | e9073f0 | 数据层统一：剧本API持久化+AI对接+角色API迁移 |
| ✨10 | b4d4222 | UI专业级升级：Lucide图标+18个新组件+7页面重写 |

## Phase 3 关键交付
- **新建12个API**: community/feed, community/creators, dashboard/stats, creator/[id], creator/[id]/follow, user/profile(GET+PUT), user/stats, user/purchases, admin/stats, admin/orders, admin/users, admin/templates(GET+PATCH)
- **8个页面去Mock**: 首页、社区广场、创作者主页、个人中心(3Tab)、管理后台x4
- 社区feed聚合三种事件(上架/购买/评价)按时间线排列
- 关注功能: Follow模型upsert模式
- 模板审核: PATCH approve/reject

## Phase 8: P0 Quick Wins (531bf8d)
- 购买后创作引导 `PurchaseGuide` (购买→3步引导→开始创作)
- 新用户Onboarding `OnboardingGuide` (首次登录3步介绍)
- Dashboard LoadingSkeleton集成
- 模板详情页+市场搜索筛选已有

## Phase 9: 数据层统一 (e9073f0)
- 剧本编辑器: 纯Mock → GET/PUT /api/scenes 持久化
- AI续写: console.log → POST /api/ai/generate (通义千问)
- 角色列表: localStorage+characterService → GET /api/characters
- 全部新增loading/error/empty状态处理

## Phase 10: UI专业级升级 (b4d4222)
- **Lucide图标系统**: icons.tsx (17个图标), 全站emoji→矢量替换
- **GradientBtn增强**: 5种变体(gloss/elastic/skeleton-pulse/tag-chip/icon-round)
- **新增18个组件**:
  - 业务(11): character-avatar-preview, character-relationship-ring, cinematic-reveal, development-arc-editor, face-builder, form-progress-ring, personality-radar-interactive, scene-timeline-visual, script-flipbook, story-arc-graph, worldview-canvas
  - UI(6): floating-elements, glow-trail, neon-text, particle-bg, refined-button, stat-card-enhanced
- **7页面重写**: 角色创建/项目详情/关系/场景/剧本/分镜/项目列表
- **模板发布页**: /dashboard/templates/new (187行)
- +8100/-1459行, 50文件

## 后端基础
- 42个API端点（认证/角色/项目/场景/分镜/模板/订单/支付/社区/Admin）
- 数据库17张表（Supabase PostgreSQL）
- 支付SDK（支付宝/微信代码就绪）
- 视频服务（Python FastAPI代码就绪，未部署）

## 认证架构 (2026-07-02 更新)
- 登录/注册从 Prisma 直连切换到 Supabase REST API (HTTP/IPv4)
- `src/lib/supabase-client.ts` — PostgREST REST API封装
- 其他API路由（CRUD）仍使用Prisma

## 待做
- 视频生成部署（通义万相API key已就绪）
- 消息通知系统
- Admin认证守卫（middleware.ts拦截/admin/*）
- 模板市场静态数据→API动态化
- 社区点赞/评论持久化
- 项目/角色 localStorage 残余清理
