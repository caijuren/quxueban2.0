# 开发者上手指南

> 版本：v1.0 | 更新日期：2026-08-09

## 目录

1. [项目概述](#1-项目概述)
2. [环境要求](#2-环境要求)
3. [本地开发环境搭建](#3-本地开发环境搭建)
4. [项目目录结构](#4-项目目录结构)
5. [开发工作流](#5-开发工作流)
6. [Docker 部署](#6-docker-部署)
7. [小程序开发](#7-小程序开发)
8. [常见问题与排查](#8-常见问题与排查)

---

## 1. 项目概述

**趣学伴**是一个家庭教育执行系统，帮助家长规划和管理孩子的学习计划。项目基于以下技术栈：

- **框架**：Next.js 14 (App Router)
- **语言**：TypeScript 5.5
- **样式**：Tailwind CSS 3.4 + Design Token 系统
- **数据库**：PostgreSQL 16 + Prisma ORM 5.22
- **认证**：NextAuth.js 4
- **状态管理**：React Query (TanStack Query 5)
- **动画**：framer-motion 11
- **图表**：recharts 3
- **表单验证**：zod 4
- **图标**：lucide-react
- **部署**：Docker Compose + Nginx 反向代理

---

## 2. 环境要求

| 工具 | 版本要求 | 说明 |
|------|----------|------|
| Node.js | >= 18 | 推荐 20 LTS |
| pnpm | >= 8 | 包管理器 |
| PostgreSQL | 16 | 数据库 |
| Docker | 24+ | 可选，用于生产部署 |
| 微信开发者工具 | 最新 | 小程序开发 |

---

## 3. 本地开发环境搭建

### 3.1 克隆项目

```bash
git clone <repository-url> quxueban
cd quxueban
```

### 3.2 安装依赖

```bash
pnpm install
```

### 3.3 配置环境变量

```bash
cp .env.example .env.local
```

编辑 `.env.local`，至少配置以下内容：

```bash
# PostgreSQL 数据库连接串（本地开发）
DATABASE_URL="postgresql://quxueban@localhost:5432/quxueban?schema=public"

# NextAuth 配置
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-local-secret-min-32-chars-long"

# 首次 seed 创建的默认管理员账号
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="admin123"
```

### 3.4 初始化数据库

**方式一：使用本地 PostgreSQL**

```bash
# 创建数据库
createdb quxueban

# 运行迁移
pnpm db:migrate

# 种子数据
pnpm db:seed
```

**方式二：使用 Docker 数据库（推荐）**

```bash
# 启动 PostgreSQL 容器
docker compose up -d db

# 运行迁移
pnpm db:migrate

# 种子数据
pnpm db:seed
```

### 3.5 启动开发服务器

```bash
pnpm dev
```

访问 http://localhost:3000

默认管理员账号：`admin` / `admin123`

### 3.6 验证环境

1. 访问首页 http://localhost:3000 → 应看到营销落地页
2. 登录 http://localhost:3000/login → 使用 admin/admin123 登录
3. 登录后应跳转到控制台仪表盘
4. 访问 http://localhost:3000/api/health → 返回 `{ "status": "ok" }`

---

## 4. 项目目录结构

```
quxueban/
├── app/                    # Next.js App Router 页面与 API
│   ├── api/                #   后端 API 路由
│   │   ├── auth/           #     认证
│   │   ├── children/       #     孩子管理
│   │   ├── family/         #     家庭管理
│   │   ├── weekly-plans/   #     周计划
│   │   ├── ai/             #     AI 相关
│   │   ├── miniapp/        #     小程序 API
│   │   └── ...             #     其他
│   ├── dashboard/          #   控制台页面
│   ├── dashboard/settings/ #   设置页面
│   ├── dashboard/console/  #   旧版控制台（已迁移到 settings）
│   └── ...                 #   其他页面
├── components/             # React 组件
│   ├── ui/                 #   原子 UI 组件（Design System）
│   ├── layout/             #   布局组件
│   ├── motion/             #   动画组件
│   ├── dashboard/          #   仪表盘组件
│   ├── console/            #   控制台组件
│   ├── settings/           #   设置组件
│   ├── weekly/             #   周计划组件
│   ├── today/              #   今日任务组件
│   └── ...                 #   其他
├── lib/                    # 核心业务逻辑
│   ├── ai/                 #   AI 相关（日报总结、任务评估）
│   ├── hooks/              #   React Hooks
│   ├── miniapp/            #   小程序工具
│   ├── subjects/           #   学科模板
│   ├── weeklyTasks.ts      #   周计划核心逻辑
│   ├── family.ts           #   家庭权限逻辑
│   ├── aiDiagnosis.ts      #   AI 诊断逻辑
│   ├── invite.ts           #   邀请逻辑
│   ├── validation.ts       #   Zod 校验模式
│   └── ...                 #   其他
├── prisma/                 # 数据库
│   ├── schema.prisma       #   数据模型
│   ├── migrations/         #   迁移文件
│   └── seed.ts             #   种子数据
├── miniapp/                # 微信小程序
│   ├── pages/              #   小程序页面
│   ├── utils/              #   小程序工具
│   └── app.js              #   小程序入口
├── docs/                   # 项目文档
│   ├── design-system/      #   设计系统文档
│   ├── architecture-overview.md
│   ├── data-model.md
│   ├── api-reference.md
│   ├── business-processes.md
│   ├── component-directory.md
│   ├── env-variables.md
│   └── ...
├── Dockerfile              # 生产构建
├── docker-compose.yml      # 生产编排
├── tailwind.config.ts      # Tailwind 配置
└── middleware.ts            # NextAuth 中间件
```

---

## 5. 开发工作流

### 5.1 代码规范

- 遵循 [编码规范文档](./coding-standards.md) 中的约定
- 提交前运行 `pnpm lint` 和 `pnpm type-check`
- 使用 Prettier 格式化代码（已配置 `.prettierrc`）

### 5.2 数据库变更

```bash
# 修改 prisma/schema.prisma 后
pnpm db:migrate            # 创建迁移文件
pnpm db:generate           # 重新生成 Prisma Client
```

### 5.3 新增 API 路由

1. 在 `app/api/` 下创建对应目录和 `route.ts`
2. 使用 Zod 进行请求体验证（参考 `lib/validation.ts`）
3. 使用 NextAuth Session 进行认证
4. 使用 `canViewChild`/`canManageChild` 进行权限控制
5. 参考 [API 参考文档](./api-reference.md) 了解现有路由结构

### 5.4 新增页面

1. 在 `app/` 下创建对应目录和 `page.tsx`
2. 使用 `PageContainer` + `PageHeader` + `Section` 布局组件
3. 优先使用 `components/ui/` 下的原子组件
4. 遵循 Design Token 系统，禁止硬编码颜色

### 5.5 新增组件

1. 放在 `components/` 对应分类目录下
2. 使用 `cn()` 工具函数组合 className
3. 支持 `className` 扩展和 `forwardRef`
4. 遵循 [组件目录](./component-directory.md) 中的分类约定

### 5.6 主题开发

- 系统支持 dark/light 双主题
- 主题通过 `data-theme` 属性切换
- 所有颜色值必须使用 Design Token（CSS 变量）
- 参考 [设计系统文档](./design-system/) 了解 Token 体系

---

## 6. Docker 部署

### 6.1 生产构建

```bash
# 1. 配置环境变量
cp .env.example .env.production
# 编辑 .env.production 替换密钥

# 2. 启动数据库
docker compose up -d db

# 3. 初始化数据库
docker compose run --rm seed

# 4. 构建并启动应用
docker compose up -d app
```

### 6.2 Nginx 反向代理配置

应用只监听 `127.0.0.1:3000`，需要通过 Nginx 反向代理对外提供服务。

Nginx 关键配置：

```nginx
# 代理缓冲区调大，以处理 NextAuth 响应头
proxy_buffer_size 512k;
proxy_buffers 8 512k;
proxy_busy_buffers_size 512k;
proxy_temp_file_write_size 512k;
large_client_header_buffers 4 512k;
```

### 6.3 构建注意事项

- Docker 镜像使用 `node:20-bullseye-slim`（Debian 11），因为 Prisma 5.x 需要 OpenSSL 1.1
- 国内镜像源已配置（腾讯云镜像 + npmmirror），加速构建
- Prisma Engine 镜像已配置为 `registry.npmmirror.com`，避免下载超时
- 上传文件存储在 Docker volume `app_uploads` 中持久化

---

## 7. 小程序开发

### 7.1 项目结构

小程序代码位于 `miniapp/` 目录，是独立的微信小程序项目。

### 7.2 开发准备

1. 在微信公众平台注册小程序，获取 AppID 和 AppSecret
2. 在 `.env.local` 中配置：
   ```
   WECHAT_MINIAPP_APPID=your-appid
   WECHAT_MINIAPP_SECRET=your-secret
   ```
3. 使用微信开发者工具打开 `miniapp/` 目录

### 7.3 API 地址配置

小程序 API 基础地址在 `miniapp/app.js` 中配置：

- 正式版/体验版：`https://edu.quxueban.cn`
- 开发版：`http://localhost:3000`

### 7.4 上传部署

1. 在微信开发者工具中上传代码
2. 在微信公众平台提交审核
3. 审核通过后发布

### 7.5 注意事项

- 小程序 API 必须使用 HTTPS 协议
- 域名需完成 ICP 备案并添加到微信后台 request 合法域名
- 小程序端无需部署自有服务器，通过微信开发者工具上传至微信服务器
- 小程序底部 TabBar 使用纯色背景（`#090B12`），禁止透明效果

---

## 8. 常见问题与排查

### 8.1 数据库连接失败

```
Error: Can't reach database server
```

**排查**：
- 检查 PostgreSQL 是否运行：`docker compose ps` 或 `pg_isready`
- 检查 `.env.local` 中的 `DATABASE_URL` 是否正确
- 检查数据库是否存在：`psql -l` 确认 `quxueban` 数据库已创建

### 8.2 Prisma 迁移失败

```
Error: P1001: Can't reach database server
```

**排查**：
- 确保数据库容器健康：`docker compose ps`
- 使用 Docker 数据库时，连接串应使用 `localhost` 而非 `db`
- 清除旧迁移冲突：`pnpm db:migrate -- --name init`

### 8.3 构建时 Prisma 引擎下载超时

**解决方案**（已配置在 Dockerfile 中）：
```bash
export PRISMA_ENGINES_MIRROR=https://registry.npmmirror.com/-/binary/prisma
```

### 8.4 Docker 构建缓存问题

```
package.json 变更后构建仍使用旧依赖
```

**解决**：使用 `--no-cache` 重新构建
```bash
docker build --no-cache -t quxueban:latest .
```

### 8.5 NextAuth 响应头过大

```
upstream sent too big header
```

**解决**：增加 Nginx 代理缓冲区大小（见 6.2 节）

### 8.6 小程序登录失败

**排查**：
- 检查 `WECHAT_MINIAPP_APPID` 和 `WECHAT_MINIAPP_SECRET` 是否正确
- 确认微信公众平台已配置服务器域名
- 查看后端日志中的 `[miniapp]` 标签输出

### 8.7 文件上传失败

- 上传接口使用 `lib/storage.ts` 处理文件持久化
- 头像上传使用专用接口，返回 URL（禁止 base64 直接存储）
- 录音文件格式需支持 `audio/x-m4a`
- 上传接口需返回绝对 URL

### 8.8 使用 Prisma Studio

```bash
pnpm db:studio
```

访问 http://localhost:5555 查看和编辑数据库数据。

---

> **相关文档**：
> - [编码规范文档](./coding-standards.md)
> - [环境变量文档](./env-variables.md)
> - [API 参考文档](./api-reference.md)
> - [架构概览文档](./architecture-overview.md)