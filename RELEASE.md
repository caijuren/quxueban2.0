# 趣学伴 1.0 发版规范

> 趣学伴已从纯静态前端升级为 Next.js 全栈应用（React + PostgreSQL + Prisma + NextAuth）。
> 本规范描述 1.0 版本的版本号规则、构建方式、Docker 部署流程和回滚方案。

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
- [ ] 已打 `vX.X.X` 标签并推送到远程
- [ ] 生产镜像已构建并推送
- [ ] 线上功能验证通过

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

### 5.2 生产环境（Docker 镜像）

```bash
# 构建镜像
docker build -t quxueban:v1.0.0 .

# 运行（注入生产环境变量）
docker run -d \
  -p 3000:3000 \
  --env-file .env.production \
  --name quxueban \
  quxueban:v1.0.0
```

首次部署后需进入容器执行迁移与 seed：

```bash
docker exec quxueban npx prisma migrate deploy
docker exec quxueban npx tsx prisma/seed.ts
```

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
git checkout v1.0.0

# 或基于旧 tag 创建 hotfix 分支
git checkout -b hotfix/xxx v1.0.0
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

```bash
git checkout main
git pull origin main

# 更新版本号
npm version major  # 1.0.0

# 推送代码和标签
git push origin main --tags

# 构建并推送生产镜像
docker build -t quxueban:v1.0.0 .
docker tag quxueban:v1.0.0 your-registry/quxueban:v1.0.0
docker push your-registry/quxueban:v1.0.0
```
