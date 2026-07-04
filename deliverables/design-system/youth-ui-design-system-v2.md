# 短剧工坊 — 青年向 UI 设计系统 v2.1

**设计日期**：2026-07-03  
**目标用户**：18-35 岁创意型用户（短剧创作者、角色设计师、短视频达人）  
**设计原则**：活力、轻盈、直觉、沉浸  
**市场参照**：Notion / Linear / Figma / CapCut / VSCO / Spotify / Arc / Raycast  

---

## 📌 设计哲学

### 四个核心原则

| 原则 | 内涵 | 青年用户洞察 | 市场参照 |
|------|------|-------------|----------|
| **活力 (Energetic)** | 界面充满生命力，色彩鲜明不刺眼 | 年轻用户对扁平单调容忍度极低 | Spotify 的渐变色封面、CapCut 的动效反馈 |
| **轻盈 (Lightweight)** | 动画 ≤200ms，过渡流畅，不拖沓 | 抖音/小红书培养的"秒级反应"习惯 | Linear 的即时键盘操作、Raycast 的启动速度 |
| **直觉 (Intuitive)** | 零学习成本，触控友好，手势自然 | 44px 最小触控区域，移动优先 | Figma 的画布直觉、iOS 的手势范式 |
| **沉浸 (Immersive)** | 内容即界面，减少装饰性框架 | VSCO/Notion 式的"氛围感" | Notion 的无边距编辑、Arc 的隐式侧边栏 |

---

## 🧠 市场成熟设计参考

### 8 款产品的最佳实践提取

#### 1. Notion — 内容即界面

**借鉴模式**：
- **块编辑器 (Block Editor)**：每个内容块（标题/段落/列表/图片）独立、可拖拽重排。剧本编辑器应采用此模式——每"幕"是一个块，每"场景"是子块，可展开折叠、拖拽调整顺序。
- **斜杠命令 (Slash Command)**：输入 `/` 弹出命令面板，选择插入角色、场景、分镜模板。减少按钮数量，降低界面噪音。
- **无边距画布**：去除卡片边框，用留白和背景色差区分层级。当前 GlassCard 可简化为"无边框 + 微阴影"。
- **侧边栏折叠**：左侧目录树可一键折叠为图标，释放横向编辑空间。

**落地建议**：剧本编辑器的 `/` 命令面板、项目列表的拖拽排序。

#### 2. Linear — 键盘优先 + 状态流

**借鉴模式**：
- **Command Palette (⌘K)**：全局搜索 + 快速跳转 + 创建入口。青年用户习惯键盘操作，避免鼠标反复切换页面。
- **状态工作流**：项目/模板/订单 的状态流转可视化（DRAFT → REVIEW → PUBLISHED），每个状态有明确的下一个动作提示。
- **Issue 详情侧边栏**：点击列表项不跳页面，弹出右侧面板——模板详情、角色详情、订单详情都应采用此模式而非整页跳转。
- **快捷键提示层**：按 `?` 弹出全局快捷键面板，降低学习成本。

**落地建议**：全局 ⌘K 命令面板、模板/项目右侧详情面板。

#### 3. Figma — 画布工作台

**借鉴模式**：
- **无限画布 + 缩放**：创作工作台采用画布模式——所有角色、场景、分镜平铺在一张大画布上，可自由缩放、平移、连线。角色关系环（已有 `character-relationship-ring`）可在画布上展开。
- **浮动工具栏**：选中元素后，弹出上下文工具栏（而非固定顶栏），减少鼠标移动距离。
- **Frame 嵌套**：用 Frame（容器）组织层级关系——项目 = 大 Frame，场景 = 子 Frame，分镜 = 孙 Frame。
- **多人光标**：协作者光标实时可见（为未来团队协作预留）。

**落地建议**：分镜编辑画布、角色关系可视化。

#### 4. CapCut (剪映) — 时间线编辑 + 素材管理

**借鉴模式**：
- **时间线 (Timeline)**：分镜管理采用横向时间轴——分镜按时间顺序排列，可拖拽调整顺序、剪裁时长、预览过渡。已有 `scene-timeline-visual` 组件，需增强交互密度。
- **素材面板**：左侧/底部固定的素材库面板（角色库、场景库、音乐库、特效库），拖拽到时间线上即应用。
- **一键特效**：预设滤镜、转场效果，一键应用到选中的分镜——降低专业门槛。
- **即时预览**：编辑过程中随时点击播放按钮预览成片效果。

**落地建议**：分镜时间轴拖拽排序、素材库面板。

#### 5. VSCO — 氛围感 + 手势浏览

**借鉴模式**：
- **图片即界面**：角色封面、场景氛围图占据主要视觉面积，文字信息压缩到最小。模板市场卡片应该 70% 视觉 + 30% 文字。
- **手势优先**：左右滑动切换模板、长按预览详情、双击收藏——解放手指，减少点击疲劳。
- **微妙的滤镜过渡**：图片加载从模糊到清晰（progressive loading），配合 `blur-up` 效果。
- **极简导航**：底部 3-4 个 Tab，顶部无文字标题栏，仅显示 logo 或返回按钮。

**落地建议**：模板市场卡片视觉占比、移动端手势浏览。

#### 6. Spotify — 个性化推荐 + 播放控制

**借鉴模式**：
- **Daily Mix / Discover Weekly**：个性化推荐区域——Dashboard 应有"为你推荐"板块，根据用户浏览/购买历史推荐模板。
- **Now Playing Bar**：底部固定播放条——在剧本编辑或分镜预览时，显示当前播放位置和进度控制。
- **歌单卡片 (Playlist Card)**：正方圆角卡片 + 渐变色封面 + 标题/描述两行截断——模板市场卡片可用此格式。
- **Heart / Add to Library**：一键收藏，成功后心形变绿，微弹跳动画。

**落地建议**：Dashboard "为你推荐"板块、模板收藏动画。

#### 7. Arc Browser — 空间管理 + 命令栏

**借鉴模式**：
- **Spaces (空间)**：按主题切换工作空间——创作者可有"甜宠项目空间""悬疑项目空间"，每个空间独立的项目列表和侧边栏。
- **Split View (分屏)**：左右分屏同时查看剧本和角色设定——创作工作台支持分屏模式。
- **Command Bar (⌘T)**：类似 Linear 的 ⌘K，全局搜索/跳转/执行操作。
- **隐式侧边栏**：侧边栏默认隐藏，鼠标移到屏幕左边缘才浮现——最大化编辑区。

**落地建议**：创作工作台分屏、项目空间管理。

#### 8. Raycast — 即时操作 + 扩展生态

**借鉴模式**：
- **Alfred 式启动器**：⌘K 唤起命令面板，输入"创建角色 甜宠女主"直接创建角色——避开层层页面导航。
- **Quick Actions**：选中内容后按快捷键直接执行操作（如"AI 续写此场景""生成此角色的分镜"），不经过二级菜单。
- **扩展/插件生态**：创作者可安装第三方插件（如"抖音爆款标题生成器""BGM 推荐"），增强平台生态。

**落地建议**：全局命令面板快速创建。

---

## 🎨 色彩系统升级

### 品牌主色调

```
当前品牌紫 #8b5cf6 → 保持（已建立视觉识别）

新增二级调色板（匹配年轻用户审美）：
```

| Token | 色值 | 用途 | 情绪 | 参照 |
|-------|------|------|------|------|
| `--brand-500` | `#8b5cf6` | 主品牌色，按钮/链接/焦点 | 创意、科技 | Figma Purple |
| `--brand-pop` | `#a78bfa` | 悬停态、渐变终点 | 活力升级 | Linear Indigo |
| `--accent-coral` | `#ff6b9d` | 收藏/喜欢/CTA 高亮 | 温暖、热情 | Spotify Heart |
| `--accent-mint` | `#00d4aa` | 成功/完成/已发布 | 清新、成就 | Notion Green |
| `--accent-sky` | `#38bdf8` | 信息/社区/社交 | 开放、连接 | Arc Blue |
| `--accent-amber` | `#fbbf24` | 市场/交易/价格 | 价值、黄金 | Stripe Yellow |

### 渐变组合（场景色系增强）

```css
/* 现有的4个场景色系保持，微调 */

/* 新增 — 剧本写作场景 */
.page-script {
  --scene-accent: #6366f1;           /* Indigo — 专注沉浸 */
  --scene-gradient-from: #6366f1;
  --scene-gradient-to: #8b5cf6;
}

/* 新增 — 数据/分析场景 */
.page-analytics {
  --scene-accent: #0d9488;           /* Teal — 洞察清晰 */
  --scene-gradient-from: #0d9488;
  --scene-gradient-to: #06b6d4;
}

/* 新增 — 社交/社区场景（微调，更强蓝色感） */
.page-social {
  --scene-accent: #2563eb;           /* Blue — 连接感 */
  --scene-gradient-from: #2563eb;
  --scene-gradient-to: #06b6d4;
}
```

---

## 🔤 排版系统（增强版）

### 字号量表（Notion 式信息层级）

| Token | 大小 | 行高 | 字重 | 用途 | 参照 |
|-------|------|------|------|------|------|
| `text-hero` | 48px | 1.1 | 800 | 着陆页 Hero | VSCO Hero |
| `text-display` | 36px | 1.15 | 700 | 页面主标题 | Notion H1 |
| `text-heading` | 24px | 1.25 | 600 | 区块标题 | Linear Section |
| `text-subtitle` | 18px | 1.3 | 500 | 卡片标题 | Spotify Card |
| `text-body` | 15px | 1.6 | 400 | 正文 | Notion Body |
| `text-small` | 13px | 1.5 | 400 | 辅助信息 | Linear Metadata |
| `text-caption` | 11px | 1.45 | 500 | 标签/徽章 | Figma Caption |

### 排版规则（Notion + Linear 灵感）

1. **段落间距** = 1.5x 行高（Notion 的透气感）
2. **列表项** 前加 2px 品牌色竖线（Notion 引用块风格）
3. **重要数字** 使用 `font-feature-settings: 'tnum'`（Linear 式等宽数字）
4. **中文引号** 使用全角「」而非半角 ""
5. **英文关键词** 前后加 1 个空格（Figma 风格：Use AI to generate）
6. **行宽限制**：正文最大 680px（Notion 的阅读舒适区）
7. **有序列表** 使用大号数字 + 彩色圆点（Linear Issue 列表风格）

---

## 🧱 组件体系（Atomic Design 三级分层）

### 组件全景图

```
📦 Atoms (原子) — 不可再分
├── Button        → GradientBtn / RefinedButton (参照 Linear 按钮)
├── Input         → 搜索框 / 文本域 / 选择器 (参照 Notion 输入)
├── Icon          → icons.tsx (17 Lucide 图标)
├── Badge         → 状态徽章 (参照 Linear Status)
├── Tag           → 标签芯片 (参照 Notion Property)
├── Avatar        → 用户/角色头像 (参照 Figma Avatar)
└── Divider       → 分割线 (参照 Notion Divider)

📦 Molecules (分子) — 2-3 原子组合
├── Card          → GlassCard / SurfaceCard (参照 Spotify Card)
├── FormGroup     → 标签 + 输入 + 错误提示 (参照 Linear Form)
├── StatBadge     → 图标 + 数字 + 标签
├── RatingStar    → 星级评分
├── ProgressBar   → 进度条 (参照 Linear Progress)
├── Toast         → 轻提示 (参照 Raycast Toast)
└── Skeleton      → 骨架屏 (参照 Notion 加载)

📦 Organisms (有机体) — 完整 UI 区块
├── PageHeader    → 页面标题 + 面包屑 + 操作
├── DataTable     → 数据表格 (参照 Linear Table)
├── FeedCard      → 动态卡片 (参照 Spotify Feed)
├── CreatorCard   → 创作者卡片
├── TemplateCard  → 模板卡片 v2 (参照 CapCut 素材卡)
├── CommentList   → 评论列表 (参照 Linear Comment)
├── FilterBar     → 筛选栏 (参照 Notion Filter)
└── EmptyState    → 空状态 (参照 Figma Empty)
```

### 新增组件详细规格

#### 1. CommandPalette — 全局命令面板（新）🆕

```
参照：Linear ⌘K / Raycast 启动器 / Arc Command Bar

功能：
- 按 ⌘K 唤起全局搜索/命令面板（半透明毛玻璃遮罩 + 居中弹窗）
- 输入关键词实时搜索：项目/角色/模板/页面/操作
- 分组展示：近期项目 / 快速操作 / 页面导航
- 支持自然语言："创建一个悬疑风格的男主"
- 键盘导航：↑↓ 选择，Enter 执行，Esc 关闭

视觉：
  480px 宽居中浮层
  ┌────────────────────────────────┐
  │ 🔍 搜索项目、角色、模板...      │ 输入框
  ├────────────────────────────────┤
  │ 近期项目                       │
  │ 📝 穿越之我在古代当总裁         │
  │ 🎬 重生之AI改变人生            │
  ├────────────────────────────────┤
  │ 快速操作                       │
  │ ✨ 创建角色                     │
  │ 📝 新建项目                     │
  │ 🎨 浏览模板市场                 │
  ├────────────────────────────────┤
  │ 页面导航                       │
  │ 📊 Dashboard                   │
  │ 📝 剧本中心                     │
  │ 🛒 模板市场                     │
  └────────────────────────────────┘
```

#### 2. SplitPane — 分屏面板（新）🆕

```
参照：Arc Split View / VS Code 分屏

功能：
- 创作工作台支持左右分屏
- 左侧显示角色设定/剧本，右侧显示分镜预览
- 拖拽中间分隔条调整比例（40%/60% 或 50%/50%）
- 快捷键 ⌘\ 切换分屏模式

视觉：
- 分隔条 2px 宽，brand 色
- hover 时加宽至 4px，光标变 col-resize
- 两面板独立滚动
```

#### 3. TimelineStrip — 时间轴条（增强）🆕

```
参照：CapCut 时间轴 / Adobe Premiere Timeline

功能：
- 分镜按时间顺序排列在可横向滚动的时间轴上
- 每个分镜 = 一个缩略图块（场景画面 + 时长标签）
- 可拖拽调整分镜顺序
- 播放头（红色竖线）标示当前预览位置
- 播放/暂停/快进按钮控制预览

视觉：
- 时间轴背景：var(--surface-elevated)
- 分镜块：var(--surface-card) + 0.5px 边框
- 当前选中的分镜块：brand-500 边框 + 微光晕
- 播放头：2px coral 色竖线 + 顶部三角指示器
```

#### 4. StoryCard — 故事/剧本卡片（新）🆕

```
参照：Notion Database Card / Linear Issue Card

视觉：
- 左侧 3px 彩色竖条（按进度变色）
- 卡片内：标题 + 副标题摘要 + 进度环（右下角）
- hover 微上浮 + 竖条加宽至 5px

进度颜色：
- draft(灰) / writing(#38bdf8) / review(#fbbf24) / done(#00d4aa)

状态标识：
- 小圆点 + 文字（参照 Linear Issue Status）
```

#### 5. QuickAction FAB — 快捷操作浮层 ⚪（增强版）

```
参照：Figma Floating Toolbar / Google Maps FAB

桌面端：
- 右下角固定，半透明毛玻璃圆形容器
- 内含 3 个图标按钮：+ 创建项目 / ✨ AI 助手 / 📝 快速笔记
- hover 展开标签文字

移动端：
- 底部固定，同样 3 按钮
- 长按触发扇形展开菜单（6 个快捷入口）
- 松手选择，带 haptic 反馈感
```

#### 6. EmotionBadge — 情绪标签 🏷️（新）

```
参照：Notion Select Property / Spotify Mood Tags

预设情绪色板：
😤 愤怒 → #ef4444 底 + #fca5a5 文字
🌧️ 悲伤 → #3b82f6 底 + #93c5fd 文字
✨ 希望 → #fbbf24 底 + #fde68a 文字
🔥 燃   → #f97316 底 + #fdba74 文字
💚 温情 → #ec4899 底 + #f9a8d4 文字
😱 惊悚 → #6366f1 底 + #c4b5fd 文字

交互：点击切换选中/未选中，选中时微放大 1.05x + 边框加粗
```

---

## 🎬 微交互规范（Linear + Raycast 级精度）

### 动画时长标准

| 类型 | 时长 | 缓动 | 用途 | 参照 |
|------|------|------|------|------|
| 即时反馈 | 100ms | ease-out | 按钮点击、开关切换 | Raycast Action |
| 快速过渡 | 200ms | ease-in-out | 卡片 hover、标签切换 | Spotify Hover |
| 页面转场 | 300ms | cubic-bezier(0.4,0,0.2,1) | 路由切换、抽屉展开 | Arc Tab Switch |
| 入场动画 | 400ms | cubic-bezier(0.34,1.56,0.64,1) | 列表项逐个出现 | Notion Page Load |

### 关键微交互清单（完整版）

```
✅ 按钮点击     → scale(0.96) 100ms → scale(1) 100ms (Raycast 式弹性)
✅ 卡片 hover   → translateY(-2px) + shadow 增强 200ms (Spotify Card)
✅ 列表加载     → 骨架屏 → 内容 fadeInUp 300ms (Notion Loading)
✅ 收藏/点赞    → heartPop 弹跳 400ms + coral 色填充 (Spotify Heart)
✅ 标签切换     → tab-indicator 滑动 200ms (Linear Tabs)
✅ 数量变化     → useCountUp 数字滚动 (Linear Stats)
✅ 搜索聚焦     → 输入框 border 1px→2px + brand 光晕 (Raycast Search)
✅ 空状态       → floatingElements 轻微浮动 (Figma Empty Canvas)
✅ 侧边栏展开   → slide + fade 200ms (Arc Sidebar)
✅ 详情面板     → slideInRight 300ms (Linear Issue Panel)
✅ 下拉刷新     → 顶部 iOS 式 spinner + elastic bounc (CapCut Feed)
✅ 删除操作     → 右滑露出红色删除按钮 + 二次确认 (iOS Swipe-to-delete)
✅ 拖拽排序     → 拖拽过程中其他项让位 + ghost 半透明 (Notion Drag)
✅ 错误重试     → shake 动画 200ms + 错误信息 pulse (Linear Error)
```

### 触控手势（移动端 CapCut + iOS 风格）

| 手势 | 触发条件 | 动作 | 参照 |
|------|----------|------|------|
| 左滑卡片 | 列表项、动态卡片 | 露出操作按钮（收藏/删除） | iOS Mail |
| 下拉刷新 | 列表顶部 over-scroll | 重新加载数据 + 顶部脉冲 | CapCut Feed |
| 长按卡片 | 模板/角色卡片 | 弹出 Context Menu | iOS Home Screen |
| 双指缩放 | 分镜预览 | 放大查看细节 | Figma Canvas |
| 右滑返回 | 页面左边缘 → 右 | 返回上一页 | iOS Navigation |

---

## 🧩 界面布局模板（3 个核心模板）

### 模板 A：发现页（Dashboard Home）

```
参照：Spotify Home + Linear Projects

┌──────────────────────────────────────────┐
│  👋 下午好，小陈          [🔍] [🔔] [👤] │ 顶部 (Notion 问候)
├──────────────────────────────────────────┤
│  ┌─────────────────┐ ┌────┐ ┌────┐      │
│  │ 继续创作          │ │12  │ │¥580│      │
│  │ 《穿越之...》     │ │模板│ │收入│      │ Linear Stats Cards
│  │ 第三幕 80% ████░░│ │    │ │    │      │
│  └─────────────────┘ └────┘ └────┘      │
├──────────────────────────────────────────┤
│  🔥 为你推荐            → 查看全部       │ Spotify "Made for You"
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐   │
│  │ 角色  │ │ 角色  │ │ 场景  │ │ 剧本  │   │ Horizontal Scroll
│  │ 卡片  │ │ 卡片  │ │ 卡片  │ │ 卡片  │   │ Cards
│  └──────┘ └──────┘ └──────┘ └──────┘   │
├──────────────────────────────────────────┤
│  📰 社区动态                             │ Linear Feed Style
│  ┌──────────────────────────────────┐   │
│  │ 🧑 小陈 发布了 霸道总裁·墨辰     │   │
│  │    ¥29  ❤️ 12  💬 3  ⏱ 2分钟前  │   │
│  └──────────────────────────────────┘   │
│  ┌──────────────────────────────────┐   │
│  │ ✓ 阿杰 完成了 《逆袭女王》       │   │
│  │    3 个角色 · 5 个场景            │   │
│  └──────────────────────────────────┘   │
└──────────────────────────────────────────┘
```

### 模板 B：创作工作台（Project Workspace）

```
参照：Figma Canvas + Notion Sidebar + CapCut Timeline

┌──────┬───────────────────────────────────┐
│  📋  │  《穿越之我在古代当总裁》          │
│      │  [角色] [剧本] [场景] [🎞️分镜]    │ Notion Tabs
│ 项目 │───────────────────────────────────│
│ 树   │                                    │
│120px │         编辑区 (主要工作区域)       │ Figma Canvas
│      │                                    │
│ 👤   │  ┌──────────┐  ┌──────────┐       │
│ 角色 │  │ 第一幕    │  │ 第二幕    │       │ Notion Blocks
│(3)  │  │ ✅已完成  │  │ ✍️编写中 │       │
│      │  └──────────┘  └──────────┘       │
│ 📝  │                                    │
│ 剧本 │  ┌────────────────────────────┐   │
│      │  │  第三幕 · 高潮               │   │
│ 🎬  │  │  ████████████░░░ 60%         │   │ Linear Progress
│ 场景 │  └────────────────────────────┘   │
│(5)  │                                    │
│      │  🎞️ 分镜时间轴                    │
│ 🎞️  │  ├─┼─┼─┼──┼──┼─┼─┤              │ CapCut Timeline
│ 分镜 │  │1│2│3│ 4 │ 5 │6│7│              │
│(12) │  └─┴─┴─┴──┴──┴─┴─┘              │
│      │                                    │
│ [+新]│  [← 上一步]         [下一步 →]    │ Notion Footer Nav
└──────┴───────────────────────────────────┘
  ↑ Arc 式隐式侧边栏（hover 边缘展开）
```

### 模板 C：详情侧边面板（Detail Panel）

```
参照：Linear Issue Panel / Spotify Now Playing

┌─────────────────────────────────┐
│                          [✕]    │
│                                 │
│       ┌───────────────┐         │
│       │               │         │
│       │   角色封面     │         │ 200×200 圆角
│       │               │         │ VSCO 图片占比
│       └───────────────┘         │
│                                 │
│    霸道总裁 · 墨辰     ¥29      │
│    ─────────────────────────   │
│    ★★★★☆  4.8 (126)           │ Spotify Rating
│                                 │
│    「冷静沉稳，在商场上运筹     │
│      帷幄但对女主温柔细腻，     │ Notion Quote Block
│      反差萌属性让人心动。」     │
│                                 │
│    [甜宠] [总裁] [腹黑] [深情]  │ Notion Tags
│                                 │
│    性格特征                     │
│    ┌──────────────────────┐    │
│    │ 外向 ████████░░ 80%  │    │
│    │ 理性 ██████░░░░ 60%  │    │ Linear Progress Bars
│    │ 感性 ████████░░ 75%  │    │
│    │ 共情 █████████░ 90%  │    │
│    └──────────────────────┘    │
│                                 │
│    🧑 创作者：小陈              │
│    已售 1,234 · 作品 8 个       │
│                                 │
│  ┌──────────┬────────────────┐  │
│  │ ❤️ 收藏  │ 🛒 立即购买    │  │ Spotify CTA
│  └──────────┴────────────────┘  │
└─────────────────────────────────┘
```

---

## 🔘 组件状态规范（Notion + Linear 级精度）

```typescript
interface ComponentStates {
  default: ReactNode;   // 正常展示
  hover: ReactNode;     // 悬停态 (200ms ease)
  active: ReactNode;    // 激活/选中态
  focused: ReactNode;   // 键盘聚焦态 (Linear `:focus-visible`)
  loading: ReactNode;   // 骨架屏 (Notion shimmer)
  empty: ReactNode;     // 无数据 (Notion "Add a page")
  error: ReactNode;     // 加载失败 (Linear error toast + 重试)
  disabled?: ReactNode; // 不可用态 (不只是灰色，加锁定图标)
}
```

### 状态文案规范（面向青年的口语化表达）

| 状态 | ❌ 避免 | ✅ 推荐 |
|------|--------|--------|
| loading | "数据加载中..." | 骨架屏（无文字，视觉暗示即可） |
| empty | "暂无数据" | "还没有项目，创建你的第一个短剧吧 →" |
| error | "服务器错误，请稍后重试" | "出了点小问题，点这里重试 🔄" |
| success | "操作成功！" | 🎉 动画 + 1.5s 自动消失 |
| 404 | "页面不存在" | "这个页面走丢了，回首页看看？" |

---

## ⌨️ 键盘快捷键体系（Linear + Raycast 启发）

### 全局快捷键

| 快捷键 | 操作 | 参照 |
|--------|------|------|
| `⌘K` | 打开命令面板 | Linear / Raycast |
| `⌘\` | 切换分屏 | Arc Split View |
| `⌘?` | 显示快捷键面板 | Linear Keyboard Shortcuts |
| `⌘N` | 新建（上下文感知：项目/角色/场景） | Notion New Page |
| `⌘S` | 保存当前编辑 | 通用 |
| `⌘Z` / `⌘⇧Z` | 撤销 / 重做 | 通用 |
| `⌘[` / `⌘]` | 后退 / 前进（页面导航） | Arc Tab Navigation |
| `Esc` | 关闭面板/弹窗/退出编辑 | 通用 |

### 编辑器快捷键

| 快捷键 | 操作 | 参照 |
|--------|------|------|
| `⌘↵` | 保存并切换到下一幕 | Notion Block Navigation |
| `⌘/` | 插入斜杠命令（副本中心） | Notion Slash Command |
| `Tab` / `⇧Tab` | 缩进 / 取消缩进 | Notion Indent |
| `⌘D` | 复制当前场景/分镜 | Figma Duplicate |

---

## 🚀 实施路线图（更新版）

### P0 — 立即实施（本周）

| # | 项目 | 产出 | 参照 |
|---|------|------|------|
| 1 | ⌘K 命令面板 | 全局搜索/快速导航 | Linear / Raycast |
| 2 | StoryCard 组件 | 项目/剧本统一卡片 | Notion Card |
| 3 | 详情侧边面板 | 模板/角色/项目详情 | Linear Panel |
| 4 | 状态规范落地 | 6 种状态全覆盖 | Notion / Linear |

### P1 — 2 周内

| # | 项目 | 产出 | 参照 |
|---|------|------|------|
| 5 | 分屏创作工作台 | 画布模式 + 左右分屏 | Figma + Arc |
| 6 | 分镜时间轴增强 | 拖拽排序 + 播放预览 | CapCut Timeline |
| 7 | QuickAction FAB | 移动端浮层 + 长按菜单 | Figma + iOS |
| 8 | EmotionBadge 标签 | 6 种情绪色板标签 | Notion Select |
| 9 | 色彩系统微调 | 暗色模式微暖 + 新场景色 | Spotify Dark |

### P2 — 1 月内

| # | 项目 | 产出 | 参照 |
|---|------|------|------|
| 10 | 为你推荐板块 | Dashboard 个性化推荐 | Spotify Discover |
| 11 | 移动端专属布局 | 底部 TabBar + 手势 | iOS + VSCO |
| 12 | 键盘快捷键体系 | 全局 + 编辑器快捷键 | Linear / Notion |
| 13 | 斜杠命令 | 剧本编辑器 `/` 命令 | Notion Slash |
| 14 | 系统级主题切换 | 深色/浅色/跟随系统 | Arc / macOS |

---

> 📄 本设计系统 v2.1 参照 8 款市场成熟产品的最佳实践，定义了青年向 UI 的完整规范。
> 全文已保存至 `deliverables/design-system/youth-ui-design-system-v2.md`
