# Vercel + Supabase 部署指南

## 一、准备工作

### 你需要注册两个账号（免费）：

1. **Vercel** → https://vercel.com → 用 GitHub 登录
2. **Supabase** → https://supabase.com → 用 GitHub 登录

---

## 二、Supabase 数据库设置（5分钟）

### 1. 创建 Supabase 项目
- 登录 https://supabase.com
- 点击 「New project」
- 输入项目名: `short-drama`
- 设置数据库密码（记下来！）
- Region 选 `Northeast Asia (Tokyo)` 或 `Southeast Asia (Singapore)`
- 等 2 分钟创建完成

### 2. 导入数据库 Schema
- 进入项目 → SQL Editor → New query
- 复制 `prisma/supabase-migration.sql` 的全部内容
- 粘贴到 SQL Editor
- 点击 Run → 等待执行完成

### 3. 获取数据库连接串
- Settings → Database → Connection string
- 选择 `URI` 标签
- 复制连接串，把 `[YOUR-PASSWORD]` 替换为你的密码
- 最终格式：`postgresql://postgres.xxx:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres`

---

## 三、Vercel 部署（5分钟）

### 方式 A：通过 Vercel 网站（推荐新手）

1. 登录 https://vercel.com
2. Import → 选择你的 GitHub 仓库
3. Framework 自动识别为 Next.js
4. **设置环境变量**：

| 变量名 | 值 |
|--------|-----|
| `DATABASE_URL` | Supabase 连接串 |
| `DIRECT_URL` | Supabase 直连串（去掉 pooler） |
| `JWT_SECRET` | 随机字符串（如 `my-super-secret-key-2026`） |
| `DASHSCOPE_API_KEY` | 你的通义千问 API Key |

5. 点击 Deploy → 等待3分钟

### 方式 B：通过 CLI（高级）

```bash
# 登录 Vercel
npx vercel login

# 链接项目
npx vercel link

# 设置环境变量
npx vercel env add DATABASE_URL
npx vercel env add DIRECT_URL
npx vercel env add JWT_SECRET
npx vercel env add DASHSCOPE_API_KEY

# 部署
npx vercel --prod
```

---

## 四、部署后检查

- 访问 `https://你的项目名.vercel.app` 
- 检查首页是否正常加载
- 测试注册/登录功能
- 进入 `/dashboard` 确认数据读写正常

---

## 注意事项

1. **Prisma 在 Supabase 的限制**：通过连接池连接（端口 6543），设置 `pgbouncer=true`
2. **图片优化**：已配置 `images.unoptimized = true`，避免 Vercel 图片优化计费
3. **免费额度**：
   - Vercel: 100GB 带宽/月，6000 分钟构建
   - Supabase: 500MB 数据库，2GB 带宽/月
4. **视频服务**：Python FastAPI 视频服务无法部署在 Vercel，后续可迁移到 Railway/ECS
