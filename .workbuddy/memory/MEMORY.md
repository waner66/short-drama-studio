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
| 4 | - | Python FastAPI视频服务 |
| 5 | - | 支付SDK集成(支付宝/微信) |
| 6 | - | 数据库迁移+18个API补全 |
| 7 | - | Vercel+Supabase部署准备 |
| 2 | 8f7e388 | 交易闭环(下单→支付→收益) |
| 3 | aec377a | 前端去Mock化(12 API + 8页面) |

## Phase 3 关键交付
- **新建12个API**: community/feed, community/creators, dashboard/stats, creator/[id], creator/[id]/follow, user/profile(GET+PUT), user/stats, user/purchases, admin/stats, admin/orders, admin/users, admin/templates(GET+PATCH)
- **8个页面去Mock**: 首页、社区广场、创作者主页、个人中心(3Tab)、管理后台x4
- 社区feed聚合三种事件(上架/购买/评价)按时间线排列
- 关注功能: Follow模型upsert模式
- 模板审核: PATCH approve/reject

## 待做(Phase 4候选)
- 项目/角色/剧本/分镜编辑页 → 仍用localStorage/local-state (内部工具，非对外)
- 视频生成打通(通义万相API key)
- 消息通知系统
- 角色模板市场
