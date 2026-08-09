# 趣学伴环境变量说明

> 版本：v2.8.5
> 最后更新：2026-08-09
> 模板文件：`.env.example`

---

## 1. 环境变量速查表

| 变量名 | 必填 | 用途 | 获取方式 | 默认值 |
|---|---|---|---|---|
| `DATABASE_URL` | ✅ 必填 | PostgreSQL 数据库连接串 | 自建 | `postgresql://quxueban@localhost:5432/quxueban?schema=public` |
| `NEXTAUTH_URL` | ✅ 必填 | NextAuth 回调地址，必须与部署域名一致 | 域名 | 无 |
| `NEXTAUTH_SECRET` | ✅ 必填 | NextAuth JWT 加密密钥，至少 32 字符 | 自生成 | 无 |
| `ADMIN_USERNAME` | ✅ 必填 | 初始化种子数据的管理员账号 | 自定 | `admin` |
| `ADMIN_PASSWORD` | ✅ 必填 | 初始化种子数据的管理员密码 | 自定 | 无 |
| `AI_API_KEY` | ❌ 可选 | AI 接口 API Key | 服务商（DeepSeek/豆包/OpenAI） | 无 |
| `AI_API_BASE` | ❌ 可选 | AI 接口基础地址 | 服务商 | `https://api.deepseek.com/v1` |
| `AI_MODEL` | ❌ 可选 | AI 模型名称 | 服务商 | `deepseek-chat` |
| `DINGTALK_WEBHOOK` | ❌ 可选 | 钉钉机器人 Webhook 地址 | 钉钉群机器人设置 | 无 |
| `DINGTALK_SECRET` | ❌ 可选 | 钉钉机器人加签密钥 | 钉钉群机器人设置 | 无 |
| `WECHAT_MINIAPP_APPID` | ❌ 可选 | 微信小程序 AppID | 微信公众平台 | 无 |
| `WECHAT_MINIAPP_SECRET` | ❌ 可选 | 微信小程序 Secret | 微信公众平台 | 无 |
| `MINIAPP_JWT_SECRET` | ❌ 可选 | 小程序 JWT 签名密钥 | 自生成 | 回退使用 `NEXTAUTH_SECRET` |
| `WECHAT_MINIAPP_DAILY_REMINDER_TEMPLATE_ID` | ❌ 可选 | 每日提醒订阅消息模板 ID | 微信公众平台 | 无 |
| `WECHAT_MINIAPP_TASK_COMPLETED_TEMPLATE_ID` | ❌ 可选 | 任务完成订阅消息模板 ID | 微信公众平台 | 无 |
| `WECHAT_MINIAPP_DEADLINE_WARNING_TEMPLATE_ID` | ❌ 可选 | 截止日期提醒模板 ID | 微信公众平台 | 无 |

---

## 2. 变量详解

### 2.1 数据库

#### `DATABASE_URL`

PostgreSQL 连接串，格式：
```
postgresql://用户名:密码@主机:端口/数据库名?schema=public
```

**Docker 部署时**（`docker-compose.yml` 已内置 db 服务）：
```
postgresql://quxueban:quxueban@db:5432/quxueban?schema=public
```
> 注意：Docker 内主机名用 `db`（docker compose 服务名），不是 `localhost`

**本地开发时**（使用系统 PostgreSQL）：
```
postgresql://quxueban@localhost:5432/quxueban?schema=public
```

### 2.2 认证

#### `NEXTAUTH_URL`

必须设置为用户实际访问的域名，例如：
- 生产：`https://edu.quxueban.cn`
- 本地：`http://localhost:3000`

> 影响 OAuth 回调、Session cookie 域、CSRF token 校验

#### `NEXTAUTH_SECRET`

用于加密 JWT 和 Session cookie。生成方式：
```bash
openssl rand -base64 32
```

#### `MINIAPP_JWT_SECRET`

小程序端 JWT 签名密钥，与 Web 端 NextAuth 独立。
未配置时自动回退使用 `NEXTAUTH_SECRET`。

#### `ADMIN_USERNAME` / `ADMIN_PASSWORD`

仅在 **首次运行 `prisma/seed.ts`** 时使用，用于创建默认管理员账号。

> 注意：种子脚本只会在空数据库时创建管理员。已有数据时不会重复创建。
> 生产环境部署时，建议 seed 后修改管理员密码。

### 2.3 AI 配置

AI 配置支持任意 OpenAI 兼容接口，三个变量必须一起使用：

| 场景 | `AI_API_BASE` | `AI_MODEL` | `AI_API_KEY` |
|---|---|---|---|
| DeepSeek | `https://api.deepseek.com/v1` | `deepseek-chat` | DeepSeek API Key |
| 豆包 Ark | `https://ark.cn-beijing.volces.com/api/v3` | `doubao-pro-32k` | 火山引擎 API Key |
| OpenAI | `https://api.openai.com/v1` | `gpt-4o-mini` | OpenAI API Key |

> 注意：`AI_API_KEY` 是全局兜底。用户也可以在「设置 → AI 配置」页面单独配置，页面配置优先于环境变量。

### 2.4 钉钉推送

钉钉机器人配置方式：
1. 在钉钉群中添加「自定义机器人」
2. 选择「加签」安全方式
3. 将 Webhook 地址填入 `DINGTALK_WEBHOOK`
4. 将加签密钥填入 `DINGTALK_SECRET`

> 每个孩子也可以在「编辑孩子」页面单独配置钉钉机器人，孩子级配置优先于全局兜底。

### 2.5 微信小程序

| 变量 | 说明 |
|---|---|
| `WECHAT_MINIAPP_APPID` | 微信公众平台 → 开发管理 → 开发设置 → AppID |
| `WECHAT_MINIAPP_SECRET` | 微信公众平台 → 开发管理 → 开发设置 → AppSecret |
| `MINIAPP_JWT_SECRET` | 小程序端独立 JWT 密钥，建议与 Web 端不同 |

**订阅消息模板：**
在微信公众平台 → 功能 → 订阅消息中申请模板，将模板 ID 填入对应变量。

| 模板类型 | 触发时机 |
|---|---|
| 每日提醒 | 每日 0:00 定时任务推送 |
| 任务完成 | 孩子打卡完成某任务时 |
| 截止日期提醒 | 任务截止前 1 小时 |

---

## 3. 环境文件说明

### 3.1 文件清单

| 文件 | 用途 | 是否提交 Git |
|---|---|---|
| `.env` | 本地开发环境变量 | ❌（已在 `.gitignore`） |
| `.env.production` | 生产环境变量 | ❌（已在 `.gitignore`） |
| `.env.example` | 环境变量模板/说明 | ✅ |

### 3.2 部署时的环境变量设置

**Docker Compose 部署：**
```bash
# 1. 复制模板
cp .env.example .env.production

# 2. 编辑 .env.production，填入真实值

# 3. Docker 会自动读取 .env.production
# 见 docker-compose.yml 中的 env_file 配置
```

**Docker Compose 中环境变量引用：**
```yaml
# docker-compose.yml 中已配置：
app:
  env_file:
    - .env.production
```

---

## 4. 常见问题

### Q: 为什么登录后跳转报错？
检查 `NEXTAUTH_URL` 是否与访问域名一致。如果本地用 `http://localhost:3000` 但设置了 `https://edu.quxueban.cn`，NextAuth 回调地址会不匹配。

### Q: AI 功能不可用怎么办？
1. 检查 `AI_API_KEY`、`AI_API_BASE`、`AI_MODEL` 是否已正确配置
2. 在「设置 → AI 配置」页面测试连接
3. 确认 API Key 余额充足

### Q: 钉钉推送不生效？
1. 确认孩子页面已配置钉钉机器人（或全局兜底配置有效）
2. 检查 Webhook 地址和加签密钥是否匹配
3. 查看服务器日志中的 `/api/dingtalk/push` 调用是否返回错误

### Q: 小程序登录失败？
1. 确认 `WECHAT_MINIAPP_APPID` 和 `WECHAT_MINIAPP_SECRET` 已正确配置
2. 确认小程序已在微信公众平台设置 request 合法域名（`https://edu.quxueban.cn`）
3. 开发版测试时，小程序基础库需开启「不校验合法域名」