# 趣学伴

> 面向上海家庭教育的升学规划与任务执行系统。

## 技术栈

- **框架**：Next.js 14 App Router + React 18
- **语言**：TypeScript
- **样式**：Tailwind CSS
- **数据库**：PostgreSQL + Prisma
- **认证**：NextAuth.js
- **部署**：Docker + Docker Compose + GitHub Actions

## 快速开始

```bash
# 安装依赖
pnpm install

# 生成 Prisma Client
pnpm prisma generate

# 准备环境变量
cp .env.example .env
# 编辑 .env，填写 NEXTAUTH_SECRET、DATABASE_URL 等

# 启动本地 PostgreSQL（如使用系统 PostgreSQL，可跳过）
docker compose up -d db

# 执行数据库迁移与种子数据
pnpm prisma migrate dev
pnpm prisma db seed

# 启动开发服务器
pnpm dev
```

访问 http://localhost:3000。

## 常用命令

```bash
pnpm dev          # 本地开发
pnpm build        # 生产构建
pnpm type-check   # TypeScript 检查
pnpm lint         # ESLint 检查
pnpm test         # 运行纯逻辑安全测试
pnpm test:smoke   # 对已启动的服务执行 API 冒烟测试
```

API 冒烟测试默认访问 `http://localhost:3000`，也可以通过 `SMOKE_BASE_URL` 指定部署地址：

```bash
SMOKE_BASE_URL=https://your-domain.com pnpm test:smoke
```

测试会验证健康检查、定时任务密钥保护和上传资源未登录拒绝。

## 项目结构

```
app/                  # Next.js App Router
  api/                # API 路由
  dashboard/          # 后台页面
  (marketing)/        # 营销页面
components/           # React 组件
lib/                  # 业务逻辑、hooks、工具函数
prisma/               # Schema、迁移、seed
public/               # 静态资源
scripts/              # 脚本工具
```

## 部署

参见 [RELEASE.md](./RELEASE.md)。

## 环境变量

核心变量见 [.env.example](./.env.example)。

## License

私有项目，未经授权不得使用。
