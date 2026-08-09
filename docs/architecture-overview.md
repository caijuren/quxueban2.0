# 趣学伴系统架构总览

> 版本：v2.8.5
> 最后更新：2026-08-09

---

## 1. 整体架构分层

```
┌─────────────────────────────────────────────────────────┐
│                   客户端层 (Client)                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │    Web 端     │  │   微信小程序  │  │   钉钉推送    │  │
│  │  Next.js SSR  │  │  WeChat MP   │  │  Webhook     │  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  │
├─────────┼─────────────────┼─────────────────┼──────────┤
│         │                 │                 │          │
│  ┌──────┴─────────────────┴─────────────────┴──────┐  │
│  │              接入层 (Gateway)                     │  │
│  │  ┌──────────────────────────────────────────┐   │  │
│  │  │           Next.js App Router             │   │  │
│  │  │  /api/* 路由 → API Routes                │   │  │
│  │  │  /dashboard/* → 家长端页面                │   │  │
│  │  │  /admin/* → Admin 后台页面                │   │  │
│  │  │  /(marketing) → 营销页面                  │   │  │
│  │  └──────────────────────────────────────────┘   │  │
│  │  ┌──────────────────────────────────────────┐   │  │
│  │  │         NextAuth 认证中间件               │   │  │
│  │  │  middleware.ts → 保护 /api/* 路由          │   │  │
│  │  └──────────────────────────────────────────┘   │  │
│  └─────────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────────┤
│                   业务层 (Business)                       │
│  ┌──────────────────────────────────────────────────┐  │
│  │  API Route Handlers (app/api/)                   │  │
│  │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐  │  │
│  │  │ 用户  │ │ 孩子  │ │ 家庭  │ │ 周计划│ │ AI   │  │  │
│  │  │ auth  │ │children│ │family │ │weekly│ │ ai/  │  │  │
│  │  │ user/ │ │ child │ │member │ │ plan │ │chat  │  │  │
│  │  └──────┘ └──────┘ └──────┘ └──────┘ └──────┘  │  │
│  │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐  │  │
│  │  │ 任务  │ │模板   │ │ 能力  │ │ 学科  │ │ 工具  │  │  │
│  │  │ tasks │ │templ │ │capab │ │subj  │ │tool  │  │  │
│  │  └──────┘ └──────┘ └──────┘ └──────┘ └──────┘  │  │
│  │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────────────┐   │  │
│  │  │ 通知  │ │ 勋章  │ │ 成长  │ │ 小程序/文件  │   │  │
│  │  │ notif│ │badge │ │growth│ │ miniapp/    │   │  │
│  │  └──────┘ └──────┘ └──────┘ └──────────────┘   │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │  业务逻辑层 (lib/)                                │  │
│  │  - hooks/: React 数据获取 hooks (useChildren,    │  │
│  │    useWeeklyPlans, useFamily 等 20+)              │  │
│  │  - 服务端逻辑: validation.ts, family.ts,          │  │
│  │    weeklyTasks.ts, taskAlignment.ts 等            │  │
│  │  - AI 逻辑: aiConfig.ts, aiDiagnosis.ts,         │  │
│  │    ai/dailySummary.ts, ai/taskAssessment.ts      │  │
│  │  - 工具: utils.ts, apiClient.ts, toast.ts        │  │
│  └──────────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────────┤
│                   数据层 (Data)                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │     Prisma ORM (lib/generated/prisma/)            │  │
│  │  ┌────────────────────────────────────────┐      │  │
│  │  │        PostgreSQL 数据库                │      │  │
│  │  │  20+ 模型: User, Child, Family,        │      │  │
│  │  │  WeeklyPlan, TaskTemplate, 等           │      │  │
│  │  └────────────────────────────────────────┘      │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │  文件存储 (local)                                 │  │
│  │  - public/uploads/avatars/ → 用户头像             │  │
│  │  - public/uploads/ → 打卡佐证图片                  │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## 2. 前端架构

### 2.1 页面路由组织

```
app/
├── (marketing)/          # 营销页面（公开）
│   ├── page.tsx          # 首页/营销落地页
│   ├── login/            # 登录
│   ├── register/         # 注册
│   ├── forgot-password/  # 找回密码
│   ├── invite/           # 家庭邀请
│   ├── privacy/          # 隐私政策
│   └── terms/            # 服务条款
│
├── dashboard/            # 家长端（需登录）
│   ├── layout.tsx        # 主布局：Sidebar + Topbar + 内容区
│   ├── page.tsx          # 首页/控制台
│   ├── today/            # 今日任务
│   ├── weekly/           # 周计划
│   ├── reports/          # 成长报告
│   ├── growth/           # 成长档案
│   ├── ai/               # AI 诊断
│   ├── ai-assistant/     # AI 学习助手对话
│   ├── plan/             # 升学规划工具
│   ├── subjects/         # 学科路径
│   │   ├── chinese/      # 语文
│   │   ├── math/         # 数学
│   │   └── english/      # 英语
│   ├── settings/         # 设置中心
│   ├── milestones/       # 里程碑
│   ├── alerts/           # 作战室/预警
│   ├── task-library/     # 任务库
│   ├── toolbox/          # 工具箱
│   └── schools/          # 学校库
│
├── admin/                # Admin 后台（需 ADMIN 角色）
│   ├── layout.tsx        # 后台布局（浅色主题强制）
│   ├── page.tsx          # 数据概览
│   ├── users/            # 用户管理
│   └── ai-config/        # AI 配置管理
│
├── api/                  # API 路由（100+ 个端点）
│   ├── auth/             # NextAuth 认证
│   ├── user/             # 用户信息、账户、导出
│   ├── children/         # 孩子管理
│   ├── family/           # 家庭协作
│   ├── weekly-plans/     # 周计划
│   ├── task-templates/   # 任务模板
│   ├── ...               # 其他模块
│   └── miniapp/          # 小程序专用 API
│
└── layout.tsx            # 根布局 + 全局 Provider
```

### 2.2 组件架构

```
components/
├── ui/                   # 原子组件（Design System）
│   ├── button.tsx, input.tsx, select.tsx, switch.tsx, ...
│   ├── card.tsx, glass-card.tsx, avatar.tsx, badge.tsx
│   ├── alert.tsx, toast.tsx, modal.tsx, skeleton.tsx
│   ├── icon.tsx          # 统一图标组件
│   ├── metric-card.tsx, progress-ring.tsx, trend-chart.tsx
│   ├── data-table.tsx, search-input.tsx, form-field.tsx
│   └── empty-state.tsx, error-state.tsx
│
├── motion/               # 动效组件
│   ├── fade-in.tsx, slide-up.tsx, stagger.tsx
│   ├── count-up.tsx, progress-bar.tsx, scale-on-hover.tsx
│   └── use-reduced-motion.ts
│
├── layout/               # 布局组件
│   ├── app-shell.tsx, page-container.tsx, page-header.tsx
│   ├── section.tsx, content-grid.tsx
│
├── dashboard/            # 仪表盘专用组件
│   ├── Sidebar.tsx, Topbar.tsx, MobileBottomNav.tsx
│   ├── ChildAvatar.tsx, ChildModal.tsx, ChildrenContext.tsx
│   ├── TaskCard.tsx, ProgressPanel.tsx, PlanRoadmap.tsx
│   └── ...
│
├── settings/             # 设置页专用组件
│   ├── SettingsSection.tsx
│   ├── AccountSection.tsx, FamilySection.tsx, ChildrenSection.tsx
│   ├── AiConfigSection.tsx, AppearanceSection.tsx
│   └── ...
│
├── weekly/               # 周计划专用组件
│   ├── WeeklyMatrix.tsx, WeeklyTaskList.tsx
│   ├── GeneratePlanModal.tsx, WeeklyReportExport.tsx
│   └── ...
│
├── today/                # 今日任务专用组件
│   ├── TaskCompletionModal.tsx, DailyVictoryModal.tsx
│
├── subjects/             # 学科路径专用组件
│
├── providers/            # React Context Provider
│   ├── AuthProvider.tsx, QueryProvider.tsx
│   ├── MotionProvider.tsx, ToastProvider.tsx
│   └── SettingsApplier.tsx
│
├── console/              # 控制台/首页组件
│
├── marketing/            # 营销页组件
│
├── home/                 # 营销首页组件
│
├── ai/                   # AI 模块组件
│
└── gamification/         # 游戏化组件
```

---

## 3. 数据流

### 3.1 典型请求链路

```
浏览器                     Next.js Server                    PostgreSQL
  │                            │                                │
  │  GET /dashboard            │                                │
  │ ─────────────────────────→ │                                │
  │                            │  middleware.ts 检查 session     │
  │                            │  ← 有 session → 放行           │
  │                            │                                │
  │                            │  RSC 渲染页面                   │
  │                            │  同时并行请求:                  │
  │                            │  ├─ GET /api/children          │
  │                            │  ├─ GET /api/weekly-plans      │
  │                            │  └─ GET /api/notifications     │
  │                            │         │                      │
  │                            │         ├─ Prisma query        │
  │                            │         │  ──────────────────→ │
  │                            │         │  ← 数据返回          │
  │                            │         │                      │
  │                            │  ← HTML 流式响应               │
  │  ← 页面渲染完成            │                                │
  │                            │                                │
```

### 3.2 小程序请求链路

```
微信小程序                    Next.js Server                    PostgreSQL
  │                            │                                │
  │  wx.login()                │                                │
  │  → 获取 code               │                                │
  │                            │                                │
  │  POST /api/miniapp/auth/login  │                            │
  │  { code }                  │                                │
  │ ─────────────────────────→ │                                │
  │                            │  调用微信接口换取 openid        │
  │                            │  查找/创建用户                  │
  │                            │  签发 JWT token                │
  │  ← { token, user }        │                                │
  │                            │                                │
  │  GET /api/miniapp/tasks/today  (带 JWT)                     │
  │ ─────────────────────────→ │                                │
  │                            │  验证 JWT → 查询今日任务       │
  │                            │  ────────────────────────────→ │
  │                            │  ← 任务列表                    │
  │  ← 任务数据                │                                │
```

---

## 4. 认证与权限

### 4.1 认证方式

| 客户端 | 认证方式 | 说明 |
|---|---|---|
| Web 端 | NextAuth (Credentials) | 用户名+密码登录，JWT session |
| 微信小程序 | 自签 JWT | 微信 code → openid → JWT |
| 钉钉推送 | 无认证 | 仅 POST webhook，无用户态 |

### 4.2 权限模型

```
用户 (User)
├── PARENT: 普通家长用户
│   ├── 自己创建的孩子 → 完全管理
│   └── 家庭共享的孩子 → 按角色权限
│       ├── OWNER: 完全控制，可转让/解散家庭
│       ├── ADMIN: 管理成员、编辑孩子、管理任务
│       ├── MEMBER: 查看和打卡
│       └── VIEWER: 仅查看
│
└── ADMIN: 系统管理员
    ├── 用户管理（查看/禁用用户）
    ├── AI 配置管理
    └── 系统数据概览
```

---

## 5. 外部依赖

| 依赖 | 用途 | 配置方式 |
|---|---|---|
| PostgreSQL | 主数据库 | DATABASE_URL |
| NextAuth.js | Web 认证 | NEXTAUTH_SECRET |
| OpenAI 兼容 API | AI 功能（日报、诊断、对话） | AI_API_KEY, AI_API_BASE, AI_MODEL |
| 钉钉机器人 | 日报推送 | DINGTALK_WEBHOOK, DINGTALK_SECRET |
| 微信小程序 | 家长端小程序 | WECHAT_MINIAPP_APPID, WECHAT_MINIAPP_SECRET |
| Docker | 部署运行 | docker-compose.yml |

---

## 6. 部署架构

```
                  用户
                   │
            ┌──────┴──────┐
            │   Nginx     │  (反向代理 + SSL 终止)
            │  edu.quxueban.cn
            └──────┬──────┘
                   │
            ┌──────┴──────┐
            │  Docker     │
            │  ┌────────┐ │
            │  │  App   │ │  (Next.js Standalone)
            │  │ :3000  │ │
            │  └────────┘ │
            │  ┌────────┐ │
            │  │  DB    │ │  (PostgreSQL)
            │  │ :5432  │ │
            │  └────────┘ │
            │  ┌────────┐ │
            │  │  Seed  │ │  (一次性初始化)
            │  └────────┘ │
            └─────────────┘
```