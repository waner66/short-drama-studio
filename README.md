# 短剧工坊 (Short Drama Studio)

AI 驱动的短剧制作平台。从角色设定到视频生成，一站式短剧创作工具。

## 技术栈

- **前端**: Next.js 14 + React 18 + Ant Design 5 + TailwindCSS 3 + Framer Motion
- **后端**: Next.js API Routes + Python FastAPI (视频处理)
- **数据库**: PostgreSQL 16 + Redis 7
- **AI**: 通义千问 Qwen-Max / 通义万相 / CosyVoice TTS
- **存储**: 阿里云 OSS + CDN
- **支付**: 支付宝 + 微信支付

## 快速开始

### 环境要求

- Node.js 22+
- Docker + Docker Compose
- Python 3.11+ (视频服务)
- FFmpeg 6.x

### 本地开发

```bash
# 1. 复制环境变量
cp .env.example .env
# 编辑 .env 填入 API Key

# 2. 安装依赖
npm install

# 3. 生成 Prisma 客户端
npx prisma generate

# 4. 启动数据库
docker compose up -d postgres redis

# 5. 推送数据库 Schema
npx prisma db push

# 6. 启动开发服务器
npm run dev
# 访问 http://localhost:3000
```

### Docker 部署

```bash
# 完整部署 (PostgreSQL + Redis + Next.js + FastAPI)
docker compose up -d

# 一键部署脚本
bash deploy.sh
```

## 项目结构

```
src/app/          - Next.js 页面 (17 功能页面 + 5 管理后台)
src/app/api/      - API 路由 (RESTful)
src/components/   - UI/业务组件 (16个)
src/lib/          - 工具库 (AI/认证/支付/Redis/存储)
src/lib/store/    - 本地数据层 (开发回退)
prisma/           - 数据库 Schema (17 张表)
services/         - Python FastAPI 视频服务
```

## API 端点

| 模块 | 端点 |
|------|------|
| 认证 | `/api/auth/login`, `/api/auth/register` |
| 角色 | `/api/characters` (CRUD) |
| 项目 | `/api/projects` (CRUD) |
| 场景 | `/api/scenes` (CRUD) |
| 分镜 | `/api/storyboards` (CRUD) |
| AI | `/api/ai/generate` |
| 模板 | `/api/character-templates` (CRUD) |
| 支付 | `/api/payment/*` |
| 视频 | `/api/video/*` (FastAPI :8000) |

## License

MIT
