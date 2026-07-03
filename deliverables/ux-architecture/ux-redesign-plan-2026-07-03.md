# 短剧工坊 — 用户体验架构重设方案

**日期**：2026-07-03  
**类型**：UX 架构方案  
**架构师**：ArchitectUX（用户体验架构师）  

---

## 📌 TL;DR

当前产品存在 **三套数据存储并行、核心功能断链、死胡同效应、认证碎片化** 四大架构级问题。本方案提出 **「统一数据层 → 打通创作链 → 重构信息架构 → 建立反馈闭环」** 四步架构重设策略，将产品从"展示型 MVP"升级为"可用型产品"。

---

## 1. 当前架构核心问题

### 问题一：三套数据系统并行，数据一致性丧失

```
当前状态（碎片化）：

  ┌─────────────┐     ┌──────────────┐     ┌──────────────┐
  │  Supabase   │     │   Prisma     │     │ localStorage │
  │  REST API   │     │   (直连PG)   │     │ (localStore) │
  │  (认证用)   │     │  (业务数据)  │     │  (角色/项目) │
  └──────┬──────┘     └──────┬───────┘     └──────┬───────┘
         │                   │                    │
    findUser()         prisma.*.findMany      characterService
    createUser()                             projectService
         │                   │                    │
         ▼                   ▼                    ▼
     用户认证表           项目/角色/订单        角色/项目本地

  ❌ 三个系统互不感知：在localStorage创建的项目，Prisma查询不到
  ❌ 认证走Supabase，业务走Prisma — 两个数据源
  ❌ 角色管理存在两套查询逻辑，返回结果不一致
```

### 问题二：核心创作链存在结构性断裂

```
当前创作流程（红色 = 断点）：

  新建项目 ──→ 角色分配 ──→ 剧本编辑 ──→ 场景管理 ──→ 分镜制作
    ✅            ⚠️           🔴           ✅            ✅
  (API+LS)    (LS为主)    (纯Mock，    (Prisma)      (Prisma)
                           不持久化)

  🔴 剧本编辑器 = 硬编码Mock数据，刷新全部丢失
  🔴 AI续写按钮 = console.log（假功能）
  🔴 项目创建 = 同时写Prisma和localStorage，两边不同步
```

### 问题三：核心用户旅程存在"死胡同"

```
创作者创作 → 发布模板:
  创建模板    ──→    提交审核    ──→    审核通过    ──→    上架销售
    ❌                  ❌                  ✅                  ❌
  "发布功能      无提交流程          API已有          模板市场纯前端
   开发中"                         但前端缺失        静态数据

  结果：创作者无法发布模板 → 模板市场无法增长 → 双边市场建立失败
```

### 问题四：认证架构碎片化

```
认证方式碎片化：
  - localStorage token (Bearer header) — 前端用
  - httpOnly cookie (token) — 后端用
  - getUserId() 同时支持两种 → 优先级不明确
  - Admin路由 = 零认证守卫

  结果：双重存储冗余 + 失效不同步 + 安全漏洞
```

---

## 2. 目标架构设计

### 2.1 统一数据层

```
目标架构（Post-重构）：

  ┌─────────────────────────────────────────┐
  │              前端 (Next.js)              │
  │                                         │
  │  ┌─────────────────────────────────┐    │
  │  │     统一数据服务层 (DataService)   │    │
  │  │  — 单一入口，无localStorage回退  │    │
  │  │  — 所有CRUD走相同路径            │    │
  │  │  — 离线缓存用IndexedDB(可选)    │    │
  │  └──────────────┬──────────────────┘    │
  └─────────────────┼───────────────────────┘
                    │ fetch + Bearer token
                    ▼
  ┌─────────────────────────────────────────┐
  │          Next.js API Routes              │
  │                                         │
  │  认证层: /api/auth/* → Supabase REST    │
  │  业务层: /api/* → Prisma                │
  │  (认证层→业务层 通过JWT userId连接)     │
  └──────────────┬──────────────────────────┘
                 │
                 ▼
  ┌──────────────────────────────────────┐
  │        Supabase PostgreSQL           │
  │  单库单Schema，Prisma统一管理       │
  └──────────────────────────────────────┘
```

**关键变更**：
1. **移除 localStorage 数据存储系统** — `local-store.ts`、`characterService`、`projectService` 全部废弃
2. **认证层和业务层通过 JWT userId 统一连接** — 不再双轨并行
3. **统一请求客户端** — `api-client.ts` 作为唯一的前端请求入口，统一错误处理、loading状态、token注入

### 2.2 修复的创作链路

```
目标创作流程（全链路打通）：

  新建项目 ──→ 角色分配 ──→ 剧本编辑 ──→ 场景管理 ──→ 分镜制作 ──→ 导出
    ✅            ✅           ✅           ✅           ✅          ⏳

  ✅ 所有步骤通过统一 API 持久化到 PostgreSQL
  ✅ 剧本编辑器对接 POST/PUT /api/scenes 和 /api/storyboards
  ✅ AI 续写对接 POST /api/ai/generate（通义千问）
  ✅ 项目→角色→剧本→场景→分镜 有明确的递进引导按钮
  ✅ 每一步保存时显示"下一步 → "按钮
```

### 2.3 信息架构重设

```
当前 IA:

  / (着陆页)
  ├── /auth/login  /auth/register         # 认证
  └── /dashboard
      ├── Dashboard首页 (概览)
      ├── /projects (项目)                # 创作工具
      ├── /characters (角色)
      ├── /market (市场)                  # 交易
      ├── /templates (我的模板)
      ├── /orders (订单)
      ├── /community (社区)              # 社交
      ├── /creator/[id] (创作者主页)
      ├── /scripts (剧本中心)            # 创作工具
      ├── /settings (设置)
      └── /quota (额度)

  问题：导航组分散（创作/交易/社交混排），用户心智模型混乱


目标 IA:

  / (着陆页)
  ├── /auth/login  /auth/register         # 认证
  └── /dashboard
      ├── 🏠 首页 (个性化推荐+最近项目)    # 发现
      │
      ├── ✏️ 创作 (一级入口)                # 创作工具组
      │   ├── /projects         项目列表
      │   ├── /characters       角色管理
      │   ├── /scripts          剧本中心
      │   └── /projects/[id]    创作工作台 (整合角色/剧本/场景/分镜)
      │
      ├── 🛒 市场 (一级入口)                # 交易组
      │   ├── /market           模板市场
      │   ├── /templates        我的模板/创作者面板
      │   └── /orders           我的订单
      │
      └── 👥 社区 (一级入口)                # 社交组
          ├── /community        社区广场
          ├── /creator/[id]     创作者主页
          └── /profile          个人中心

  变更：
  - 三个一级入口组（创作/市场/社区）→ 用户心智模型清晰
  - 项目工作台统一角色/剧本/场景/分镜的创作入口
  - 个人中心/设置/额度合并到Profile
```

### 2.4 关键用户旅程重设

#### Journey A：新用户注册 → 首次创作

```
步骤  当前状态                                    目标状态
─────────────────────────────────────────────────────────────────
1     注册 → dashboard (无引导)                  注册 → Onboarding引导
2     dashboard概览 (无方向感)                   引导"创建你的第一个角色"
3     用户自行探索                                  角色创建 → 自动创建首个项目
4     角色/项目分属不同页面                        "你的首个项目已就绪" → 直接进入工作台
5     -                                            工作台: 角色已挂载 → 提示"开始写剧本"
```

#### Journey B：浏览市场 → 购买 → 创作

```
步骤  当前状态                                    目标状态
─────────────────────────────────────────────────────────────────
1     静态模板列表                                  API驱动的动态市场
2     抽屉预览                                     全屏详情页 (含评价/购买数据)
3     购买 → "下单成功"弹窗                      购买 → 购买成功弹窗
4     弹窗 → 订单列表 (断点)                      弹窗 "立即开创作" → 自动创建项目+挂载模板
5     -                                            进入工作台，模板角色已加载
```

#### Journey C：创作 → 发布 → 收益

```
步骤  当前状态                                    目标状态
─────────────────────────────────────────────────────────────────
1     "发布功能开发中"                            创作者发布表单
2     无创作物                                    发布模板 → 显示定价建议
3     API存在但UI缺失                            提交审核 → 状态追踪
4     审核后无通知                                审核通过通知 → 市场可见
5     无法追踪收益                                创作者面板显示收入/浏览量
```

---

## 3. 组件架构规范

### 3.1 组件分层

```
📦 components/
├── 🧱 ui/           # 基础UI组件 (无业务逻辑)
│   ├── glass-card      ✅ 已用CSS变量
│   ├── gradient-btn    ⚠️ 用Tailwind类而非变量
│   ├── empty-state     ✅
│   ├── loading-skeleton ✅
│   ├── page-header     ✅
│   ├── badge           ⚠️ 硬编码颜色
│   └── ...
│
├── 📊 business/     # 业务组件 (含业务逻辑)
│   ├── template-card-v2   ✅ CSS变量
│   ├── character-card     ⚠️ 独立CSS文件，需统一
│   ├── ai-generate-panel  🔴 假功能，需对接
│   ├── purchase-guide     ✅ (新增)
│   └── onboarding-guide   ✅ (新增)
│
└── 🎨 layout/      # 布局组件 (页面结构) — 新建
    ├── dashboard-shell    # Dashboard主布局 (当前在layout.tsx内联)
    ├── creative-workspace # 创作工作台布局
    └── market-layout      # 市场浏览布局
```

### 3.2 组件状态规范

**每个交互组件必须处理以下状态**：

```typescript
interface ComponentStates {
  // 强制实现
  default: ReactNode;    // 正常展示
  loading: ReactNode;    // 数据加载中
  empty: ReactNode;      // 无数据
  error: ReactNode;      // 加载失败 + 重试按钮
  
  // 可选实现
  disabled?: ReactNode;  // 不可用
  success?: ReactNode;   // 操作成功
}
```

**当前缺口**：剧本编辑器的 loading/empty/error 状态全部缺失，AI 面板无 error 处理。

### 3.3 颜色/样式规范

**硬性规则**：
- ❌ 禁止使用 `bg-[#hex]` / `text-[#hex]` Tailwind 任意值
- ❌ 禁止内联 `style={{ color: '#hex' }}`
- ✅ 统一使用 CSS 变量：`var(--brand-500)` / `var(--text-primary)` / `var(--surface-card)`
- ✅ Tailwind 类使用语义化颜色：`bg-brand-500` / `text-accent-500`

---

## 4. 数据流架构统一

### 4.1 统一请求客户端

```typescript
// src/lib/api-client.ts (已存在，需强化)

// 所有前端请求必须通过此客户端
// 自动处理：token注入、错误转换、loading状态

class ApiClient {
  private baseUrl = '';
  private getToken = () => localStorage.getItem('token');

  async get<T>(path: string): Promise<ApiResponse<T>>
  async post<T>(path: string, body: unknown): Promise<ApiResponse<T>>
  async put<T>(path: string, body: unknown): Promise<ApiResponse<T>>
  async delete<T>(path: string): Promise<ApiResponse<T>>
}

// ApiResponse 统一格式：
interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}
```

### 4.2 认证统一

```
目标认证流程（简化）：

  注册/登录
    │
    ├──→ 后端: 生成JWT → 存入httpOnly cookie
    │
    └──→ 前端: 从响应体读取token → 存localStorage
         (仅用于API请求的Authorization header)
    
  API路由验证:
    └──→ auth-helper.ts 统一入口
         ├── 优先读Bearer header (前端请求)
         ├── 回退读cookie (浏览器直访)
         └── 返回统一的 userId
    
  ⚠️ 注意: 最终应迁移到单一认证方式 (httpOnly cookie)，
       但当前阶段保留双轨以兼容现有代码
```

---

## 5. 实施路线图

### Phase 1：数据层统一（第 1-2 周）

```
目标：消除三套数据系统并行的问题

任务清单：
□ 废弃 src/lib/store/local-store.ts
□ 废弃 characterService / projectService (localStorage 版)
□ 剧本编辑器对接 POST /api/scenes 实现持久化
□ AI 续写对接 POST /api/ai/generate
□ 模板市场数据源从静态数组改为 GET /api/character-templates
□ 统一 imports: 只使用 @/lib/api-client 做数据请求
```

### Phase 2：打通创作链（第 2-3 周）

```
目标：核心用户旅程无断点

任务清单：
□ 创建"创作工作台"统一页面 /dashboard/projects/[id]/workspace
  — 替代当前分散的3个子页面
  — 左右分栏: 左侧项目树, 右侧编辑区
  — 角色/剧本/场景/分镜四个Tab
□ 每一步编辑后显示"下一步 →"递进按钮
□ 发布模板功能 (前端表单 + 后端审核流)
□ 模板编辑器页面 /dashboard/templates/new
```

### Phase 3：信息架构重组（第 3-4 周）

```
目标：导航结构清晰，用户心智模型匹配

任务清单：
□ 重设侧边栏导航 (3个一级入口: 创作/市场/社区)
□ 重设 Dashboard 首页 (个性化推荐+最近项目)
□ 个人中心整合 (Profile/Settings/Quota → /dashboard/profile)
□ Admin 添加 auth 守卫 (前端middleware + 后端)
```

### Phase 4：社区互动闭环（第 4-5 周）

```
目标：从浏览到互动的社区体验

任务清单：
□ 点赞API持久化 (POST /api/community/feed/[id]/like)
□ 动态发布功能 (创作者可发动态)
□ 评论功能 (POST /api/community/feed/[id]/comments)
□ 创作者主页显示作品集
```

---

## 6. 文件变更清单

### 新增文件

| 文件 | 用途 |
|------|------|
| `src/components/layout/dashboard-shell.tsx` | 重构 Dashboard 布局 |
| `src/components/layout/creative-workspace.tsx` | 创作工作台布局 |
| `src/app/dashboard/projects/[id]/workspace/page.tsx` | 统一工作台页面 |
| `src/app/dashboard/templates/new/page.tsx` | 模板发布页 |
| `src/app/api/community/feed/[id]/like/route.ts` | 点赞API |
| `src/app/api/community/feed/[id]/comments/route.ts` | 评论API |
| `src/middleware.ts` | Admin auth 守卫 |

### 修改文件

| 文件 | 变更 |
|------|------|
| `src/app/dashboard/layout.tsx` | 导航重构 (3个一级入口) |
| `src/app/dashboard/market/page.tsx` | 数据源从静态改API |
| `src/app/dashboard/projects/[id]/script/_client.tsx` | 对接API持久化 |
| `src/app/dashboard/projects/[id]/_client.tsx` | 接入工作台 |
| `src/lib/api-client.ts` | 强化统一客户端 |
| `src/app/api/ai/generate/route.ts` | 对接真实通义千问 |
| `src/components/business/ai-generate-panel.tsx` | 对接真实API |

### 删除文件

| 文件 | 原因 |
|------|------|
| `src/lib/store/local-store.ts` | 废弃localStorage数据系统 |
| `src/lib/data/character-templates.ts` | 废弃静态数据(模板市场) |
| `src/lib/data/scene-templates.ts` | 废弃静态数据 |
| `src/lib/data/plot-templates.ts` | 废弃静态数据 |

---

## 7. 核心交付物：统一工作台界面规范

```
创作工作台 (Creative Workspace) 结构:

┌─────────────────────────────────────────────────────┐
│ ← 返回项目列表    项目名称: xxx    [保存] [发布]    │ 顶部栏
├──────────────┬──────────────────────────────────────┤
│ 📋 项目树     │                                    │
│              │        编辑区 (右侧)                  │
│ 👤 角色 (3)  │   ┌─────────────────────────────┐  │
│   ├ 主角     │   │ Tab: 角色 | 剧本 | 场景 | 分镜 │  │
│   ├ 配角1    │   ├─────────────────────────────┤  │
│   └ 配角2    │   │                               │  │
│              │   │   当前Tab的内容编辑区           │  │
│ 📝 剧本      │   │                               │  │
│   ├ 第一幕   │   │                               │  │
│   ├ 第二幕   │   │                              │  │
│   └ ...      │   │                               │  │
│              │   │                               │  │
│ 🎬 场景 (5)  │   │                               │  │
│ 🎞️ 分镜 (12)│   │                               │  │
│              │   └─────────────────────────────┘  │
│              │                                    │
│ [+ 添加角色] │     [上一步]  [下一步 →]           │ 底部导航
└──────────────┴──────────────────────────────────────┘
```

---

## ✅ 行动清单

| # | 行动 | Phase | 预估 |
|---|------|-------|------|
| 1 | 废弃 localStorage 数据存储 | P1 | 1天 |
| 2 | 剧本编辑器持久化对接 | P1 | 2天 |
| 3 | AI 续写对接真实 API | P1 | 1天 |
| 4 | 模板市场数据源迁移到 API | P1 | 1天 |
| 5 | 创建创作工作台统一页面 | P2 | 3天 |
| 6 | 发布模板功能 (前端+后端) | P2 | 2天 |
| 7 | 导航结构重构 (3组一级入口) | P3 | 1天 |
| 8 | Admin 添加 auth 守卫 | P3 | 0.5天 |
| 9 | 社区点赞/评论持久化 | P4 | 2天 |
| 10 | 统一请求客户端强化 | P1 | 1天 |

---

## ⚠️ 待确认决策

1. **模板市场 API 切换**：当前 `src/lib/data/` 下有约 30 个硬编码模板。迁移到 API 后这些数据需先导入数据库。是否先批量导入现有模板作为种子数据？
2. **创作工作台 vs 分页面**：建议用工作台替代分散的3个子页面，但这会改变现有的 URL 结构。是否接受 URL 变更？
3. **认证统一**：是否在本次重构中完全切换到 httpOnly cookie 认证（移除 localStorage token）？还是有兼容性考虑需延后？

---

> 📄 本架构方案为 UX 架构层面的设计规范，具体实现需开发团队按 Phase 顺序执行。
