# syntax=docker/dockerfile:1

# 趣学伴 Next.js 独立部署镜像
# 构建：docker build -t quxueban:latest .
# 运行：docker run -p 3000:3000 --env-file .env.production quxueban:latest
# 使用 Debian 11 (bullseye) 以获得 Prisma 5.x 所需的 OpenSSL 1.1

FROM node:20-bullseye-slim AS base

# --- 依赖阶段 ---
FROM base AS deps
# 使用腾讯云 Debian 镜像源加速
RUN rm -f /etc/apt/sources.list.d/debian.sources && \
    echo "deb http://mirrors.tencent.com/debian/ bullseye main non-free contrib" > /etc/apt/sources.list && \
    echo "deb http://mirrors.tencent.com/debian-security/ bullseye-security main" >> /etc/apt/sources.list && \
    echo "deb http://mirrors.tencent.com/debian/ bullseye-updates main non-free contrib" >> /etc/apt/sources.list && \
    apt-get update && \
    apt-get install -y openssl ca-certificates && \
    rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
# 使用国内 npm 镜像源加速
RUN npm config set registry https://registry.npmmirror.com && \
    npm install -g pnpm && \
    pnpm config set registry https://registry.npmmirror.com && \
    pnpm install --frozen-lockfile

# --- 构建阶段 ---
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 确保 public 目录存在（项目可能无静态资源目录）
RUN mkdir -p /app/public

# Prisma Client 必须在使用前重新生成，以匹配容器平台引擎
RUN npx prisma generate

# 构建时占位，真实密钥在运行容器时注入
ENV NEXTAUTH_SECRET=build-time-placeholder
ENV NEXTAUTH_URL=http://localhost:3000
RUN npm run build

# --- 运行阶段 ---
FROM base AS runner
WORKDIR /app

# Debian 运行 Prisma 也需要 openssl
RUN rm -f /etc/apt/sources.list.d/debian.sources && \
    echo "deb http://mirrors.tencent.com/debian/ bullseye main non-free contrib" > /etc/apt/sources.list && \
    echo "deb http://mirrors.tencent.com/debian-security/ bullseye-security main" >> /etc/apt/sources.list && \
    echo "deb http://mirrors.tencent.com/debian/ bullseye-updates main non-free contrib" >> /etc/apt/sources.list && \
    apt-get update && \
    apt-get install -y openssl ca-certificates && \
    rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# standalone 产物 + 静态资源
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
