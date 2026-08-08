# 趣学伴发版规范

> 趣学伴已从纯静态前端升级为 Next.js 全栈应用（React + PostgreSQL + Prisma + NextAuth）。
> 本规范描述版本号规则、构建方式、Docker 部署流程和回滚方案，适用于 1.x 及 2.0 版本。

## 1. 版本号规则（SemVer）

版本号格式：`主版本号.次版本号.修订号`，例如 `v1.0.0`。

- **MAJOR**：不兼容旧数据/接口的重构、商业模式或产品形态重大变更
- **MINOR**：新增功能模块、新页面、新能力项，向后兼容
- **PATCH**：Bug 修复、样式调整、文案修改，不影响功能

当前 1.0 为首个正式版，数据结构与功能基线已稳定。

## 2. 分支与提交规范

采用基于 `main` 分支的 Git 工作流：

```
main
├── feature/功能名称
├── fix/问题简述
├── refactor/重构范围
└── style/页面或组件
```

提交信息遵循 Conventional Commits：

```
<type>(<scope>): <subject>
```

常用 type：`feat`、`fix`、`refactor`、`style`、`docs`、`chore`、`perf`。

## 3. 发布前检查清单

- [ ] 所有功能分支已合并到 `main`
- [ ] `npx tsc --noEmit` 无 TypeScript 错误
- [ ] `npm run lint` 通过
- [ ] `npm run build` 构建成功（使用 `output: 'standalone'`）
- [ ] `python3 scripts/dogfood.py` 通过，无 console 报错
- [ ] 数据库迁移与 seed 脚本已验证
- [ ] `.env.production` 已按 `.env.example` 配置并替换密钥
- [ ] `package.json` 版本号已更新
- [ ] **已验证 `package.json` 中的 `version` 与即将推送的 `vX.X.X` 标签完全一致**（例：tag `v2.1.0` 必须对应 `"version": "2.1.0"`）
- [ ] 已打 `vX.X.X` 标签并推送到远程
- [ ] 生产镜像已构建并推送
- [ ] 线上功能验证通过

## 3.1 版本号一致性强制校验

历史多次出现 **tag 版本号与 `package.json` 中的 `version` 不一致**，导致生产环境显示旧版本（如 tag `v2.1.0` 指向的 commit 里 `package.json` 仍是 `2.0.12`）。发版前必须执行以下校验：

```bash
# 1. 确认 package.json 中的 version
node -p "require('./package.json').version"
# 预期输出：2.1.0

# 2. 打 tag 前，确认 tag 名与 version 完全一致
git tag -a v$(node -p "require('./package.json').version") -m "release v$(node -p "require('./package.json').version")"

# 3. 推送前再次验证 tag 指向的 commit 中 package.json 版本正确
git show v2.1.0:package.json | grep '"version"'
# 预期输出："version": "2.1.0"
```

**规则：**
- tag 名必须以 `v` 开头，后接 `package.json` 中的完整版本号。
- 禁止在 `package.json` 未更新的情况下移动或新建 tag。
- 若已推送的错误 tag 需要修正，必须先在本地删除并重建，再强制推送：`git push origin vX.X.X --force`。

## 4. 构建说明

本项目使用 **Next.js Standalone** 输出：

```bash
npm ci
npx prisma generate
npm run build
```

构建产物位于 `.next/standalone`，可直接运行：

```bash
node .next/standalone/server.js
```

> 注意：`next start` 在当前项目存在 Edge Runtime 与 NextAuth middleware 的兼容问题，因此线上必须使用 standalone 方式部署。

## 5. 部署方式

### 5.1 本地/测试环境（docker compose）

```bash
# 1. 准备环境变量
cp .env.example .env.production
# 编辑 .env.production，填入 NEXTAUTH_SECRET 等真实值

# 2. 启动数据库
docker compose up -d db

# 3. 首次初始化数据（仅执行一次）
docker compose run --rm seed

# 4. 启动应用
docker compose up -d app

# 5. 访问 http://localhost:3000
```

### 5.2 生产环境（Docker Compose）

生产服务器路径：`/srv/apps/quxueban2.0`

```bash
# 切换到发布标签
cd /srv/apps/quxueban2.0
git fetch origin
git checkout v2.0.0

# 重启部署
docker compose down
docker compose up -d db
sleep 10
docker compose run --rm seed
docker compose up -d --build app
docker image prune -f
```

> 注意：生产环境直接使用仓库内的 `docker-compose.yml`，不额外使用 `docker-compose.prod.yml`。

### 5.3 关键文件说明

| 文件 | 作用 |
|---|---|
| `Dockerfile` | 多阶段构建，输出最小 standalone 镜像 |
| `.dockerignore` | 排除 node_modules、.env、构建产物等 |
| `docker-compose.yml` | 本地一键启动 app + postgres |
| `.env.example` | 生产环境变量模板 |
| `next.config.mjs` | 开启 `output: 'standalone'`，图片使用 unoptimized |
| `prisma/schema.prisma` | PostgreSQL 数据模型 |
| `prisma/seed.ts` | 初始化管理员和默认学员数据 |

## 6. 数据版本管理

趣学伴同时存在两类数据：

- **服务端数据**：PostgreSQL 中的用户、学员、计划、任务等，由 Prisma Migrate 管理 schema 版本。
- **浏览器端数据**（旧版）：`localStorage` 中的 `AppData`，由 `lib/storage.ts` 中的 `CURRENT_DATA_VERSION` 控制。

服务端每次 schema 变更需新增 migration：

```bash
npx prisma migrate dev --name 变更说明
```

浏览器端数据若升级 schema，需在 `lib/migrations.ts` 中新增迁移函数并递增 `CURRENT_DATA_VERSION`。

## 7. 回滚方案

### 7.1 代码回滚

```bash
# 回滚到上一个 tag
git checkout v1.9.6

# 或基于旧 tag 创建 hotfix 分支
git checkout -b hotfix/xxx v1.9.6
```

### 7.2 数据库回滚

- 发布前应在 staging 环境验证 migration
- 如生产 migration 出错，先停止新容器，回滚镜像版本，必要时从备份恢复数据库
- 切勿在已有用户数据后直接 `prisma migrate reset` 生产库

### 7.3 紧急情况处理

1. 在 `main` 上切 `hotfix/xxx` 分支
2. 修复 bug 并合并回 `main`
3. 发布 patch 版本，重新构建镜像并部署
4. 验证线上功能

## 8. 版本发布命令示例

### 8.1 创建发布分支与标签

```bash
git checkout main
git pull origin main

# 从 main 切出发布分支
git checkout -b release/v2.0.0

# 手动更新 package.json 版本号为 2.0.0
# 提交后打标签
git add package.json
git commit -m "chore(release): v2.0.0"
git tag -a v2.0.0 -m "Release v2.0.0"

# 推送分支和标签
git push origin release/v2.0.0
git push origin v2.0.0
```

### 8.2 自动部署（GitHub Actions）

将 `release/v1.7.0` 合并到 `main` 并推送，触发自动部署：

```bash
git checkout main
git merge release/v1.7.0
git push origin main
```

### 8.3 手动部署到生产服务器

```bash
ssh ubuntu@your-server-ip
cd /srv/apps/quxueban2.0
git fetch origin
git checkout v1.7.0

docker compose down
docker compose up -d db
sleep 10
docker compose run --rm seed
docker compose up -d --build app
docker image prune -f
```

---

# 发版记录

## v2.8.1（2026-08-09）

**主题：Liquid Glass 核心页面视觉升级**

本版本在 v2.8.0 建立的 Glass 能力基础上，将液态玻璃设计语言落地到 4 个核心页面，显著提升界面高级感与科技感。

- Liquid Glass Foundation 延续
  - 扩展 `app/globals.css` Glass Token：`glass-bg-*`、`glass-border-*`、`glass-highlight`、`glass-shadow-color`、`glass-blur-*`
  - 新增 `.glass` / `.glass-subtle` / `.glass-strong` / `.glass-hover` / glow 工具类
  - 扩展 `tailwind.config.ts`：`backdropBlur`、`backgroundColor`、`borderColor`、`boxShadow` 的 glass 系列
  - 新增 `GlassCard` 组件（`components/ui/glass-card.tsx`），支持 `strength` / `hover` / `glow` / `as`

- 首页 `/dashboard`
  - IdentityCard 使用 `GlassCard strong + glow="primary"`
  - 升学时间轴、关键节点预警、AI 战略建议、概览孩子卡统一使用 `GlassCard default/subtle + hover`

- 成长报告 `/dashboard/reports`
  - 报告头部改造为 `GlassCard strong + glow="secondary"` Hero 区域，整合标题与周选择器
  - AI 周报总结卡片使用 `GlassCard strong + glow="ai"`
  - 计划任务 / 学习时长 / 打卡天数 / 完成率概览卡使用 `GlassCard default`
  - 整体目标推进分析、学科分析、任务完成明细、各领域投入分析、每日完成趋势统一使用 `GlassCard`
  - 学科分析内层学科卡片使用 `GlassCard subtle`

- AI 模块
  - `/dashboard/ai` 综合评估卡使用 `GlassCard strong + glow="ai"`，替换硬编码紫色阴影
  - 四个分析板块与空状态使用 `GlassCard default`
  - `/dashboard/ai-assistant` 左侧会话列表面板、右侧聊天区、AI 消息气泡、思考中提示统一使用 `GlassCard`

- 设置中心 `/dashboard/settings/*`
  - 左侧导航容器使用 `GlassCard subtle`
  - 导航激活项使用 `glass-subtle` 背景 + 左侧 primary 光条
  - `SettingsSection` 组件统一使用 `GlassCard default`

- 质量验证
  - `npm run type-check` 通过
  - `npm run lint` 通过
  - `npm run build` 通过

## v2.7.5（2026-08-08）

**主题：Design System 2.0 与浅色主题上线**

本版本为 2.7.x 设计系统迭代的最终整合发布，涵盖 Token 体系、原子组件、Admin 后台重构、硬编码样式清理与浅色主题支持。

- Design Token 体系（v2.7.0）
  - 新增完整 Design Token：颜色、间距、圆角、阴影、字体、动画、层级，覆盖 dark / light 双主题
  - 通过 `data-theme` 属性切换主题，避免闪烁
  - Tailwind 配置与 `globals.css` 全部接入 Token
- 原子与分子组件（v2.7.1 / v2.7.2）
  - 新增 `components/ui/*`：Button、Input、Select、Switch、Alert、Badge、Skeleton、Spinner、Toast 等
  - 新增布局组件 `AppShell`、`PageHeader`、`Section`、`DataTable`、`FormField`
  - 所有原子组件支持 `className` 扩展与 `ref` 转发
- Admin 后台重构（v2.7.3）
  - `/admin/users`、`/admin/ai-config`、`/admin` 统一使用新组件与 Token
  - 修复 Server Component 传递 React icon 导致的报错
- 硬编码样式清理（v2.7.4）
  - 清理 `app/`、`components/` 中散落的十六进制色值、固定间距、重复按钮样式
  - 设置页、控制台、任务、周计划等页面统一使用 Design System 组件
- 浅色主题（v2.7.5）
  - `UserSetting` 新增 `appearance` 字段，支持 `light / dark / system`
  - 家长端可在「设置 → 外观」切换主题并实时预览
  - Admin 后台强制使用浅色主题，退出时恢复用户偏好
  - 登录页、注册页、找回密码页适配浅色主题
- 缺陷修复（本版本 QA 发现）
  - 修复登录/注册/找回密码按钮 `cursor-not-allowed` 非禁用态也显示的 bug
  - 修复主按钮使用 `text-text-primary` 在浅色主题下对比度不足的问题，统一为 `text-inverse`
  - 修复 `/dashboard/plan` 中 button 嵌套 button 导致的 React hydration 错误
  - 修复 `PlanRoadmap` 粒子动画 `cy: undefined` 控制台报错
- 质量验证
  - `npm run type-check` 通过
  - `npm run lint` 通过
  - `npm run build` 通过
  - Playwright QA：Admin 后台与家长端多页面无 console/page 错误（浅色主题 broad QA 因本地登录频率限制未完整重跑，深色主题 broad QA 全量通过）

## v2.6.0（2026-08-08）

**主题：成长报告周报重构与高频任务结构化字段**

- 成长报告页视觉统一
  - 标题区仅保留 icon +「成长报告」，移除年级描述
  - 移除右上角重复的孩子选择器，复用全局 child selector
  - 移除周选择器旁的「当前周」文字
- AI 周报总结
  - 首次进入报告页自动生成，结果持久化到 `WeeklyPlan.aiSummary`
  - 支持手动点击「重新生成」刷新
- 整体目标推进分析
  - 对比时间进度与任务进度
  - 输出超前完成 / 正常推进 / 略有滞后 / 明显延迟结论与建议
- 学科分析
  - 先支持语文、数学、英语三科
  - 展示完成率、当前阶段、建议每日时长、实际投入、薄弱点标签、本周完成重点
- 高频任务完成明细
  - 阅读：书名、开始/结束页码
  - 学科练习：练习册/材料、页码/题号范围、错题数
  - 运动/习惯：完成数量、单位
- 小程序打卡页
  - 按任务类型动态展示结构化完成详情字段
  - 打卡数据写入 `TaskCompletionRecord.metadata`
- 数据与后端
  - `WeeklyPlan` 新增 `aiSummary`、`aiSummaryGeneratedAt` 字段及迁移 `20260811000000_add_ai_summary_to_weekly_plan`
  - 修复运动/习惯类 `quantityIncrement` 在 metadata 中被 Zod 剥离的问题
- 质量验证
  - `npm run type-check` 通过
  - `npm run lint` 通过
  - `npm run build` 通过

## v2.5.6（2026-08-07）

**主题：新增成长报告周报**

- 新增「成长报告」独立菜单 `/dashboard/reports`
  - 顶部 Tab 切换日报 / 周报（日报先占位）
  - 右上角孩子选择器，整页数据随选中孩子联动
  - 周选择器支持上一周 / 下一周 / 下拉选择
- 周报核心模块
  - 本周概览：计划任务数、学习时长、打卡天数、完成率
  - 整体目标推进分析：时间进度 vs 任务进度，给出正常推进 / 略有滞后 / 明显延迟 / 超前完成结论
  - 各领域投入分析：分类完成率与投入时长
  - 每日完成趋势：每天任务完成情况柱状图
  - AI 周总结：基于本周数据一键生成总结与下周建议
  - 生成分享图入口（后续迭代实现真实分享卡片）
- 数据直接复用现有 `ChildrenContext` 与周计划数据，无需新增后端 API
- `npm run type-check`、`npm run lint`、`npm run build` 全部通过

## v2.5.5（2026-08-07）

**主题：周计划顶部梳理与冲突提示折叠**

- 周计划页面顶部拆分为三层：标题层、周选择层、操作工具栏
- 操作按钮按主/辅分组：主操作（生成/编辑/发布）常驻，复盘、任务库、模板、历史周、导出收入「更多」下拉菜单
- 草稿状态增加「草稿待发布」标签，发布按钮在主操作区突出显示
- 冲突提示默认折叠，仅显示摘要，点击「查看详情」展开全部
- 打卡佐证图片支持本地上传（`TaskCompletionModal` + `/api/upload/task-evidence`）

## v2.5.4（2026-08-07）

**主题：首页、AI 配置、家庭邀请、今日任务问题修复**

- 首页「全家总览」移除「添加孩子」按钮，避免与孩子管理功能重复
- AI 配置页「测试连接」按钮修复：
  - 测试接口不再要求 ADMIN 角色
  - 已保存配置时按钮可点击，不再因 Key 脱敏而禁用
  - 测试直接调用数据库中已保存的配置
- 新增 `20260810000000_add_family_invite_table` 迁移，补建生产环境缺失的 `FamilyInvite` 表
- 今日任务页移除右下角「手动推送简报」和「查看完整周计划」按钮

## v2.5.3（2026-08-07）

**主题：首页路线匹配度体验优化**

- 首页身份卡右侧「路线匹配度」区域增加留白：标题、仪表盘、提升幅度、提升空间之间的间距拉大
- 路线匹配度数字由静态 `route.probability` 改为基于真实数据计算：
  - 是否已设定目标学校
  - 当前孩子是否已绑定路线
  - 本周计划完成率
  - 升学时间轴里程碑完成进度
  - 是否存在当前阶段里程碑
- 「较上次提升」同步基于周计划完成率给出方向性提示（+5% / +2% / -1% / -3%）

## v2.5.2（2026-08-07）

**主题：设置中心与家庭邀请问题修复**

- AI 配置入口对所有登录用户开放，不再仅限 ADMIN
- AI 日报总结改为统一读取数据库中的 AI 配置（DeepSeek/OpenAI），与 AI 对话、诊断保持一致
- 设置 → 学习系统下移除「任务库」导航（保留独立的 `/dashboard/task-library` 页面）
- 家长日志迁移到 `/dashboard/settings/parent-log`，风格与设置中心其他页统一
- 家庭邀请接口增加全局异常捕获，手机号邀请失败时会返回具体错误信息

## v2.5.1（2026-08-07）

**主题：四阶段功能大满贯 —— 学科路径落地、周计划提效、AI 互动、小程序与内容库升级**

- 第一阶段：学科路径配置落地 + 成长档案 v1
  - 学科规划配置（语文/数学/英语）支持按孩子隔离，数据保存到 `SubjectPlanConfig`
  - 新增「成长档案」页面 `/dashboard/growth`，整合里程碑、任务完成、家长日志、徽章、积分时间轴
  - 新增证据库，集中展示打卡照片与语音转文字记录
  - 数据资产设置页新增成长档案与数据导出入口

- 第二阶段：周计划提效
  - 新增「我的周计划模板」：保存当前周计划为模板、一键套用模板
  - 支持复制历史周计划到未来某周
  - 新增周计划冲突检测：每日总时长超载、同类任务过度集中、夜间任务提醒
  - 任务库增强：收藏任务、学段筛选、从系统模板批量导入

- 第三阶段：AI 与互动
  - 新增 AI 学习助手对话 `/dashboard/ai-assistant`，支持多会话与上下文
  - 提醒中心后端化：Notification 模型支持已读/未读、类型筛选、分页
  - 新增积分、勋章与连续打卡 streaks 体系
  - 新增家长日志 `/dashboard/parent-log`，支持每日观察、照片、标签

- 第四阶段：小程序完善 + 内容库
  - 小程序新增「周计划预览」页面，支持 7 天切换查看
  - 小程序新增「成长卡片」页面，展示完成率、连续打卡、徽章里程碑
  - 小程序任务完成页展示语音转文字摘要
  - Web 工具箱补齐：阅读书单、标化考试日历、名额到校计算器

- 工程化与质量
  - Prisma schema 扩展：`WeeklyPlanTemplate`、`Badge`、`PointLog`、`ParentLog`、`ChatSession`、`ChatMessage`
  - 新增迁移 `20260808000000_add_v230_features`、`20260809000000_add_task_template_favorite`
  - `npm run type-check`、`npm run build` 全部通过

## v2.2.2（2026-08-05）

**主题：小程序家长微信绑定**

- 为 `User` 模型新增 `bindCode`、`bindCodeExpiresAt` 字段及迁移
- 新增 Web 端接口 `POST /api/user/bind-code`，用于生成家长 6 位绑定码
- 新增小程序接口 `POST /api/miniapp/auth/bind-parent`，支持用绑定码把微信 openid 写入家长 `wechatOpenId`
- 改造 Web 端「我的账户 → 微信绑定」弹窗，展示绑定码与倒计时
- 小程序新增 `pages/bind-parent` 绑定页，并在登录页 `NOT_BOUND` 流程中引导选择家长/孩子绑定

## v2.2.1（2026-08-05）

**主题：修复生产环境 Child 表缺失字段导致孩子数据无法加载**

- 原因：`Child` 模型新增了 `wechatOpenId`、`bindCode`、`bindCodeExpiresAt` 字段，但对应数据库迁移文件未提交到仓库
- 生产环境执行 `prisma migrate deploy` 后，`Child.wechatOpenId` 列不存在，导致 `/api/children` 查询报错，页面显示「还没有孩子档案」
- 修复：新增迁移 `20260805120000_add_child_wechat_bind`，为 `Child` 表补全上述三列及唯一索引

## v2.2.0（2026-08-05）

**主题：家庭协作与设置中心升级 + 微信小程序 MVP**

- 家庭成员与权限
  - 新增 `Family`、`FamilyMember`、`FamilyInvite` 模型与相关迁移
  - 支持家庭创建、成员邀请（用户名 / 邮箱 / 手机）、角色分配（OWNER / ADMIN / MEMBER / VIEWER）
  - 支持转让创建者、解散家庭、退出家庭
  - 孩子、学习目标、周计划、任务模板等数据接口接入家庭权限控制
- 设置中心重构
  - 控制台改为纯设置中心，左侧导航保留原结构
  - 新增「家庭成员与权限」入口
  - 优化头像、账户安全、数据导出等模块
- 工程化与质量
  - 修复 `/register`、`/invite` 等页面 `useSearchParams` 缺少 Suspense 边界的问题
  - `/api/books/*` 标记为 `force-dynamic`，避免静态生成报错
  - 全站 JSX `<img>` 替换为 Next.js `<Image />`
  - `npm run type-check`、`npm run lint`、`npm run build` 全部通过
- 微信小程序
  - 新增 `miniapp/` 目录，包含登录、绑定孩子、角色选择、今日任务、个人中心等基础页面
  - 小程序通过 API 与主服务通信，不部署到服务器，需单独上传发布

## v2.0.1（2026-08-02）

**主题：修复周计划保存失败（数据库缺失 goals 列）**

- 修复 `WeeklyPlan` 表缺少 `goals` 列的问题，新增 migration `20260803000001_add_weekly_plan_goals`
- 该列缺失导致发布/编辑周计划时 Prisma upsert 报错，前端表现为点击保存无响应

## v2.0.0（2026-08-02）

**主题：2.0 正式版 —— 规划工具稳定 + 学科路径扩展 + AI 复盘**

- 规划工具稳定性提升
  - 修复 `.next` 构建缓存导致的 `type-check` 失败
  - 认证中间件统一保护 `/api/*`，仅放行 `/api/auth/*`、`/api/health`、`/api/register`
  - 学科路径配置数据增加服务端 Zod 校验
  - 新增 `SubjectPlanConfig` 表及迁移，支持用户级与系统级配置隔离
- 学科路径扩展
  - 语文路径配置页上线，数据接入 `SubjectPlanConfig`
  - 新增数学学科路径页面（`/dashboard/subjects/math`）与配置页（`/dashboard/subjects/math/config`）
  - 新增英语学科路径页面（`/dashboard/subjects/english`）与配置页（`/dashboard/subjects/english/config`）
  - 新增可复用的 `SubjectTrackMap`、`SubjectExamTimeline`、`SubjectPlanConfigEditor` 组件
  - 系统种子数据新增数学、英语默认学科规划
- 任务执行与 AI 复盘
  - 今日任务完成记录支持状态、进度、质量、备注、图片
  - 完成状态精简为 3 项：已完成 / 部分完成 / 未完成
  - 完成 100% 任务时触发「今日胜利」弹窗
  - 钉钉 AI 日报支持手动触发与 0:00 自动 fallback
  - 新增 `/api/ai/daily-summary` 与 `useDailySummary`，今日任务页内展示 AI 复盘卡片
  - 学科页 AI 诊断真实调用 `useAssessTasks`，基于当前周计划生成任务合理性分析
- 工程化
  - 新增 `README.md`
  - 更新 `.env.example`，补充 AI 日报环境变量说明
  - 更新部署文档到 2.0

## v1.9.x（2026-08）

**主题：今日任务完成记录与钉钉 AI 推送**

- 今日任务支持完成记录弹窗（状态、进度、时长、质量、备注、图片）
- 完成 100% 任务时触发「今日胜利」弹窗
- 钉钉支持手动推送日报与每日 0:00 自动 fallback
- AI 日报后端接入 LLM + 规则降级

## v1.6.0（2026-07-29）

**主题：全局视觉升级 —— 炫酷指挥中心**

- 重构视觉系统底层
  - 统一粉紫霓虹色彩体系：主色 `#ff2d6a`、辅色 `#8b5cf6`
  - 新增系统化光效工具类：`hud-panel`、`hud-panel-hover`、`neon-text`、`neon-line`、`indicator-dot`、`shimmer`
  - 新增平衡的字体比例工具类：`text-h1` / `text-h2` / `text-h3` / `text-body` / `text-caption` / `text-small` / `text-micro`，避免字号过大或过小
  - 新增 `animated-bg-strong` 深环境光背景与 `tactical-grid` 战术网格
- 重设计首页与营销页
  - Hero 区域改为「指挥中心入口」风格，加入路线概览、任务状态、风险提醒等动态数据面板
  - 所有营销区块卡片统一使用 `hud-panel` + 战术边角装饰
  - 统计数字使用 `data-value` 强调，标题使用新字体比例
- 重设计路线方案页
  - 路线卡片改为发光战术节点，主路线带霓虹阴影
  - 路线图背景增加战术网格，检查点与志愿卡片使用 `hud-panel`
  - 中考矩阵单元格按角色使用主题阴影，强化可读性
- 重设计今日作战 / 周任务页
  - 任务卡片改为 `hud-panel`，已完成状态使用左侧霓虹边线 + 灰显文字，不再使用绿色背景
  - 周矩阵表头与单元格增加悬停霓虹效果，today 状态更清晰
  - 编辑周任务、任务库、本周复盘弹窗统一为指挥中心风格
- 统一全局组件
  - 顶部栏、侧边栏、移动端底部导航增加霓虹发光细节与一致的激活态
  - 搜索框、通知按钮、孩子切换器增加聚焦/悬停光晕
- 构建验证：`npm run build` 通过

## v1.5.1（2026-07-29）

**主题：修复 Docker 构建 Prisma engines 下载失败**

- 在 Dockerfile builder 阶段设置 `PRISMA_ENGINES_MIRROR` 为国内 AWS S3 镜像
- 解决腾讯云服务器构建时访问 Prisma 官方 CDN 出现 `ECONNRESET` 导致构建失败的问题

## v1.5.0（2026-07-29）

**主题：移动端体验升级与周报分享卡片**

- 新增「周任务 → 导出周报」功能
  - 基于 html2canvas 生成每周战报分享卡片
  - 展示完成率、总任务数、已完成数、计划时长及分类完成情况
  - 一键下载 PNG 图片，方便分享到朋友圈/微信群
- 新增移动端底部导航栏
  - 固定在屏幕底部，包含：今日作战、周任务、作战室、路线方案、我的
  - 当前页面高亮指示器，支持安全区适配
  - 桌面端保持左侧侧边栏，不显示底部导航
- 移动端弹窗全屏化适配
  - 编辑周任务、任务库、本周复盘、导出周报等弹窗在手机上全屏显示
  - 桌面端保持居中对话框，内容区域可滚动
- 周任务矩阵移动端适配
  - 桌面端保留原有 8 列矩阵布局
  - 移动端改为「天选择器 + 当天分类任务卡片」形式，避免横向滚动
- 新增 viewport-fit=cover 与 safe-area 工具类，优化全面屏手机显示

## v1.4.0（2026-07-29）

**主题：今日执行视图与周任务智能补差**

- 新增「今日作战」独立页面（`/dashboard/today`）
  - 大字任务清单，适合手机端给孩子/家长查看
  - 按分类分组，大按钮一键打卡
  - 顶部显示今日完成进度与剩余时长
- 侧边栏「执行跟踪」新增「今日作战」入口，「预警提醒」更名为「作战室」
- 周任务页面新增「上周未完成任务」提示条，支持一键添加到本周
- 周任务统计面板保留完成率、总时长、分类完成情况、每日完成情况

## v1.3.0（2026-07-29）

**主题：作战室与 Dashboard 今日任务联动**

- 新增「作战室」真实预警提醒：
  - 今日任务未完成
  - 昨日任务未补完
  - 某学科连续缺项
  - 本周完成率偏低
- Dashboard 今日任务按分类分组展示，顶部显示完成进度
- 新用户默认登录后进入「作战室」页面（已有用户可在设置中修改）
- 新增 `lib/alerts.ts` 预警生成逻辑

## v1.2.0（2026-07-29）

**主题：任务库与周计划联动**

- 新增「系统设置 → 任务库」入口，支持新增/编辑/删除任务模板
- 周任务页面接入任务库弹窗，可按孩子绑定路线显示任务匹配状态（提前/当前/补差/可选/不相关）
- Dashboard 今日任务支持一键完成并跳转周视图
- API 首次加载时自动为老用户注入系统预设任务模板
- 任务分类扩展为 8 类：语文、数学、英语、学校作业、阅读、运动、兴趣班、其他
- 新增 `TaskTemplate` 模型与 `20260729000000_add_task_templates` 迁移

## v1.1.2（2026-07-28）

**主题：设置入口与动态版本显示**

- 修复设置入口不可见问题
- 侧边栏动态显示版本号（`趣学伴 vX.X.X`）

## v1.1.1（2026-07-28）

**主题：扫描修复与 SVG 控制台错误**

- 全站深度扫描，修复非功能性按钮、点击无响应、保存失败等问题
- 修复 SVG `motion.ellipse` 控制台报错，生产环境零 ellipse 错误
- 通过 TypeScript、ESLint、生产构建及 Playwright 验证

## v1.1.0（2026-07-28）

**主题：家长端设置中心与学员管理增强**

- 新增家长端设置中心（账号与安全、消息通知、界面偏好、孩子管理、数据与隐私、帮助与关于）
- 支持动态主题切换（暗黑科技风 / 玫瑰粉）并持久化
- 学员档案新增头像、生日、当前学校、备注、绑定路线字段
- 学员弹窗支持头像上传、路线绑定、删除确认及错误提示
- Dashboard 与升学规划联动，展示真实学校与路线数据

## v1.0.0

**主题：趣学伴 1.0 正式版**

- 基于 Next.js + PostgreSQL + Prisma + NextAuth 的全栈应用基线
- 学员管理、升学路线规划、周任务管理、学校库等核心模块上线
- Docker standalone 部署方案落地
