# 趣学伴 API 参考文档

> 版本：v2.8.5
> 最后更新：2026-08-09
> 路由总数：76 个 route.ts 文件，覆盖 100+ 个端点

---

## 1. 认证方式速查

| 认证方式 | 适用路由 | 机制 |
|---|---|---|
| **NextAuth Session** | 大部分 Web 端路由 | `getServerSession(authOptions)` 验证 JWT cookie |
| **小程序 JWT** | `/api/miniapp/*` | `getMiniAppUser()` 验证 Authorization header 中的 JWT |
| **Admin 角色检查** | `/api/admin/*` | `session.user.role === 'ADMIN'` |
| **家庭权限** | 孩子相关路由 | `canViewChild()` / `canManageChild()` 校验家庭角色 |
| **公开** | `/api/health`, `/api/register`, `/api/auth/[...nextauth]` | 无需认证 |

---

## 2. 路由总览

```
API 路由树
├── auth/                     # 认证
├── user/                     # 用户账户
├── children/                 # 孩子管理
├── family/                   # 家庭协作
├── weekly-plans/             # 周计划
├── task-templates/           # 任务模板
├── capabilities/             # 能力项
├── ai/                       # AI 功能
├── notifications/            # 通知
├── chat/                     # AI 对话
├── books/                    # 教辅书目
├── subject-plans/            # 学科路径
├── milestones/               # 里程碑
├── upload/                   # 文件上传
├── uploads/                  # 文件服务
├── toolbox/                  # 工具箱
├── admin/                    # 管理员后台
├── miniapp/                  # 小程序 API
├── dingtalk/                 # 钉钉
├── register/                 # 注册
└── health/                   # 健康检查
```

---

## 3. 认证模块

### `POST /api/auth/[...nextauth]`

NextAuth 认证路由，处理登录、登出、session 管理。

| 方法 | 权限 | 说明 |
|---|---|---|
| POST | 公开 | 登录 (credentials) / 登出 |
| GET | 公开 | 获取 session / CSRF token |

> 由 NextAuth 自动处理，详见 `authOptions` 配置

---

## 4. 用户模块

### `GET /api/user/me`

| 方法 | 权限 | 说明 |
|---|---|---|
| GET | 登录用户 | 获取当前用户信息（含设置、孩子列表） |
| PATCH | 登录用户 | 更新用户信息（name, phone, email 等） |

### `POST /api/user/avatar`

| 方法 | 权限 | 说明 |
|---|---|---|
| POST | 登录用户 | 上传用户头像，返回头像 URL |

### `PATCH /api/user/password`

| 方法 | 权限 | 说明 |
|---|---|---|
| PATCH | 登录用户 | 修改密码（需提供旧密码） |

### `DELETE /api/user/account`

| 方法 | 权限 | 说明 |
|---|---|---|
| DELETE | 登录用户 | 注销账户 |

### `POST /api/user/bind-code`

| 方法 | 权限 | 说明 |
|---|---|---|
| POST | 登录用户 | 生成 6 位家长绑定码（用于小程序绑定） |

### `GET /api/user/export`

| 方法 | 权限 | 说明 |
|---|---|---|
| GET | 登录用户 | 导出用户数据 |

---

## 5. 孩子模块

### `GET /api/children` / `POST /api/children`

| 方法 | 权限 | 说明 |
|---|---|---|
| GET | 登录用户 | 获取可查看的孩子列表（含自己创建 + 家庭共享） |
| POST | 登录用户 | 创建新孩子 |

### `PATCH /api/children/[id]` / `DELETE /api/children/[id]`

| 方法 | 权限 | 说明 |
|---|---|---|
| PATCH | 登录用户 | 更新孩子信息（name, grade, targetSchool 等） |
| DELETE | 登录用户 | 删除孩子 |

### 学习目标

#### `GET /api/children/[id]/goals` / `POST /api/children/[id]/goals`

| 方法 | 权限 | 说明 |
|---|---|---|
| GET | canViewChild | 获取孩子的学习目标列表 |
| POST | canManageChild | 创建学习目标 |

#### `PATCH /api/children/[id]/goals/[goalId]` / `DELETE`

| 方法 | 权限 | 说明 |
|---|---|---|
| PATCH | canManageChild | 更新学习目标 |
| DELETE | canManageChild | 删除学习目标 |

### 里程碑

#### `GET /api/children/[id]/milestones` / `POST`

| 方法 | 权限 | 说明 |
|---|---|---|
| GET | canViewChild | 获取孩子的里程碑列表 |
| POST | canViewChild | 创建里程碑 |

### 游戏化

#### `GET /api/children/[id]/gamification`

| 方法 | 权限 | 说明 |
|---|---|---|
| GET | canViewChild | 获取勋章、积分、打卡 streak 等游戏化数据 |

### 成长档案

#### `GET /api/children/[id]/growth/timeline`

| 方法 | 权限 | 说明 |
|---|---|---|
| GET | canViewChild | 获取成长时间轴数据 |

#### `GET /api/children/[id]/growth/evidence`

| 方法 | 权限 | 说明 |
|---|---|---|
| GET | canViewChild | 获取打卡证据库（图片、语音转文字记录） |

### 家长日志

#### `GET /api/children/[id]/parent-logs` / `POST`

| 方法 | 权限 | 说明 |
|---|---|---|
| GET | canViewChild | 获取家长日志列表 |
| POST | canManageChild | 创建家长日志 |

#### `PATCH /api/children/[id]/parent-logs/[logId]` / `DELETE`

| 方法 | 权限 | 说明 |
|---|---|---|
| PATCH | canManageChild | 更新家长日志 |
| DELETE | canManageChild | 删除家长日志 |

### 周计划复制

#### `POST /api/children/[id]/weekly-plans/[weekId]/copy`

| 方法 | 权限 | 说明 |
|---|---|---|
| POST | canManageChild | 复制某周计划到目标周 |

---

## 6. 家庭模块

### `GET /api/family` / `POST` / `DELETE`

| 方法 | 权限 | 说明 |
|---|---|---|
| GET | 登录用户 | 获取用户所属家庭及成员列表 |
| POST | 登录用户 | 创建家庭 |
| DELETE | 登录用户 | 解散家庭（仅 OWNER） |

### 成员管理

#### `POST /api/family/members`

| 方法 | 权限 | 说明 |
|---|---|---|
| POST | 登录用户 | 邀请成员（username / email / phone） |

#### `PATCH /api/family/members/[id]` / `DELETE`

| 方法 | 权限 | 说明 |
|---|---|---|
| PATCH | 登录用户 | 修改成员角色（仅 OWNER/ADMIN） |
| DELETE | 登录用户 | 移除成员或退出家庭 |

#### `POST /api/family/members/[id]/transfer-owner`

| 方法 | 权限 | 说明 |
|---|---|---|
| POST | 登录用户 | 转让创建者身份（仅 OWNER） |

### 邀请

#### `POST /api/family/invites` / `GET`

| 方法 | 权限 | 说明 |
|---|---|---|
| POST | 登录用户 | 创建邀请链接/码 |
| GET | 登录用户 | 获取家庭邀请列表 |

#### `GET /api/family/invites/[token]` / `POST`

| 方法 | 权限 | 说明 |
|---|---|---|
| GET | 公开 | 查看邀请信息（token 验证） |
| POST | 公开 | 接受邀请（需登录） |

---

## 7. 周计划模块

### `GET /api/weekly-plans` / `POST`

| 方法 | 权限 | 说明 |
|---|---|---|
| GET | 登录用户 | 获取周计划列表（按孩子筛选） |
| POST | 登录用户 | 创建/更新周计划（upsert） |

### `PATCH /api/weekly-plans/[id]` / `DELETE`

| 方法 | 权限 | 说明 |
|---|---|---|
| PATCH | 登录用户 | 更新周计划（发布、编辑任务等） |
| DELETE | 登录用户 | 删除周计划 |

### 任务完成

#### `POST /api/weekly-plans/[id]/tasks/[taskId]/complete`

| 方法 | 权限 | 说明 |
|---|---|---|
| POST | 登录用户 | 打卡完成任务（含证据图片、语音转文字） |

### AI 周报

#### `POST /api/weekly-plans/[id]/ai-summary`

| 方法 | 权限 | 说明 |
|---|---|---|
| POST | 登录用户 | 生成/重新生成 AI 周报总结 |

---

## 8. 任务模板模块

### `GET /api/task-templates` / `POST`

| 方法 | 权限 | 说明 |
|---|---|---|
| GET | 登录用户 | 获取任务模板列表（支持筛选孩子、分类、收藏） |
| POST | 登录用户 | 创建任务模板 |

### `PATCH /api/task-templates/[id]` / `DELETE`

| 方法 | 权限 | 说明 |
|---|---|---|
| PATCH | 登录用户 | 更新任务模板 |
| DELETE | 登录用户 | 删除任务模板 |

### 系统模板导入

#### `POST /api/task-templates/import-system`

| 方法 | 权限 | 说明 |
|---|---|---|
| POST | canManageChild | 从系统预设模板批量导入到用户的任务库 |

---

## 9. 能力项模块

### `GET /api/capabilities` / `POST`

| 方法 | 权限 | 说明 |
|---|---|---|
| GET | 登录用户 | 获取能力项列表 |
| POST | 登录用户 | 创建自定义能力项 |

### `PATCH /api/capabilities/[id]` / `DELETE`

| 方法 | 权限 | 说明 |
|---|---|---|
| PATCH | 登录用户 | 更新能力项 |
| DELETE | 登录用户 | 删除能力项 |

---

## 10. AI 模块

### `POST /api/ai/daily-summary`

| 方法 | 权限 | 说明 |
|---|---|---|
| POST | 登录用户 | 生成 AI 日报总结 |

### `POST /api/ai/diagnosis`

| 方法 | 权限 | 说明 |
|---|---|---|
| POST | 登录用户 | AI 诊断：基于当前周计划生成任务合理性分析 |

### `POST /api/ai/task-assessment`

| 方法 | 权限 | 说明 |
|---|---|---|
| POST | 登录用户 | AI 任务评估：评估某任务完成质量和建议 |

---

## 11. 通知模块

### `GET /api/notifications` / `PATCH`

| 方法 | 权限 | 说明 |
|---|---|---|
| GET | 登录用户 | 获取通知列表（支持分页、类型筛选） |
| PATCH | 登录用户 | 标记某通知为已读 |

### `PATCH /api/notifications/[id]` / `DELETE`

| 方法 | 权限 | 说明 |
|---|---|---|
| PATCH | 登录用户 | 标记单条通知为已读 |
| DELETE | 登录用户 | 删除通知 |

### `PATCH /api/notifications/read-all`

| 方法 | 权限 | 说明 |
|---|---|---|
| PATCH | 登录用户 | 一键全部标记为已读 |

---

## 12. AI 对话模块

### `GET /api/chat/sessions` / `POST`

| 方法 | 权限 | 说明 |
|---|---|---|
| GET | 登录用户 | 获取 AI 对话会话列表 |
| POST | 登录用户 | 创建新会话 |

### `GET /api/chat/sessions/[id]/messages` / `POST`

| 方法 | 权限 | 说明 |
|---|---|---|
| GET | 登录用户 | 获取会话消息历史 |
| POST | 登录用户 | 发送消息并获取 AI 回复 |

---

## 13. 教辅书目模块

### `GET /api/books`

| 方法 | 权限 | 说明 |
|---|---|---|
| GET | 登录用户 | 搜索教辅书目（支持按学科、年级、出版社筛选） |

**强制动态渲染**：`force-dynamic`

### `GET /api/books/filters`

| 方法 | 权限 | 说明 |
|---|---|---|
| GET | 登录用户 | 获取教辅筛选条件（学科、年级、出版社等） |

**强制动态渲染**：`force-dynamic`

### `GET /api/books/[id]`

| 方法 | 权限 | 说明 |
|---|---|---|
| GET | 登录用户 | 获取单本书籍详情 |

**强制动态渲染**：`force-dynamic`

---

## 14. 学科路径模块

### `GET /api/subject-plans/[subject]` / `PATCH`

| 方法 | 权限 | 说明 |
|---|---|---|
| GET | 登录用户 | 获取学科路径配置（含 tracks, timeAxis, nodes 等） |
| PATCH | 登录用户 | 更新学科路径配置 |

`subject` 取值：`chinese` | `math` | `english`

---

## 15. 里程碑模块

### `PATCH /api/milestones/[id]` / `DELETE`

| 方法 | 权限 | 说明 |
|---|---|---|
| PATCH | canViewChild | 更新里程碑状态 |
| DELETE | canViewChild | 删除里程碑 |

---

## 16. 文件上传模块

### `POST /api/upload`

| 方法 | 权限 | 说明 |
|---|---|---|
| POST | 登录用户 | 通用文件上传，返回文件 URL |

### `POST /api/upload/avatar`

| 方法 | 权限 | 说明 |
|---|---|---|
| POST | 登录用户 | 上传头像专用接口，返回头像 URL |

### `POST /api/upload/task-evidence`

| 方法 | 权限 | 说明 |
|---|---|---|
| POST | 登录用户 | 上传打卡佐证图片，返回图片 URL |

### `GET /api/uploads/[...path]`

| 方法 | 权限 | 说明 |
|---|---|---|
| GET | 公开 | 静态文件服务，提供上传文件访问 |

---

## 17. 工具箱模块

### `POST /api/toolbox/admission-calculator`

| 方法 | 权限 | 说明 |
|---|---|---|
| POST | 登录用户 | 名额到校分配计算器 |

### `GET /api/toolbox/exam-calendar`

| 方法 | 权限 | 说明 |
|---|---|---|
| GET | 登录用户 | 获取标化考试日历 |

### `GET /api/toolbox/reading-list`

| 方法 | 权限 | 说明 |
|---|---|---|
| GET | 登录用户 | 获取推荐阅读书单 |

---

## 18. 周计划模板模块

### `GET /api/weekly-plan-templates` / `POST`

| 方法 | 权限 | 说明 |
|---|---|---|
| GET | 登录用户 | 获取周计划模板列表 |
| POST | canViewChild | 创建周计划模板 |

### `GET /api/weekly-plan-templates/[id]` / `PATCH` / `DELETE`

| 方法 | 权限 | 说明 |
|---|---|---|
| GET | canViewChild | 获取模板详情 |
| PATCH | canManageChild | 更新模板 |
| DELETE | canManageChild | 删除模板 |

---

## 19. 管理员模块

### `GET /api/admin/stats`

| 方法 | 权限 | 说明 |
|---|---|---|
| GET | ADMIN | 管理员数据概览（用户数、孩子数等统计） |

### `GET /api/admin/users`

| 方法 | 权限 | 说明 |
|---|---|---|
| GET | ADMIN | 用户管理列表 |

### `GET /api/admin/ai-config` / `POST`

| 方法 | 权限 | 说明 |
|---|---|---|
| GET | ADMIN | 获取全局 AI 配置 |
| POST | ADMIN | 更新全局 AI 配置 |

### `POST /api/admin/ai-config/test`

| 方法 | 权限 | 说明 |
|---|---|---|
| POST | 登录用户 | 测试 AI 连接（不限制 ADMIN） |

---

## 20. 小程序模块

### 认证

#### `POST /api/miniapp/auth/login`

| 方法 | 权限 | 说明 |
|---|---|---|
| POST | 公开 | 微信 code 登录，返回 JWT token 和用户信息 |

#### `POST /api/miniapp/auth/bind-parent`

| 方法 | 权限 | 说明 |
|---|---|---|
| POST | 公开 | 家长绑定码绑定（code → openid 写入 User） |

#### `POST /api/miniapp/auth/bind-child`

| 方法 | 权限 | 说明 |
|---|---|---|
| POST | 公开 | 孩子绑定码绑定（code → openid 写入 Child） |

### 数据接口

#### `GET /api/miniapp/config`

| 方法 | 权限 | 说明 |
|---|---|---|
| GET | 公开 | 获取小程序配置 |

#### `GET /api/miniapp/children`

| 方法 | 权限 | 说明 |
|---|---|---|
| GET | 小程序 JWT | 获取用户绑定的孩子列表 |

#### `GET /api/miniapp/children/[childId]/bind-code`

| 方法 | 权限 | 说明 |
|---|---|---|
| GET | 小程序 JWT | 获取孩子绑定码 |

#### `GET /api/miniapp/tasks/today`

| 方法 | 权限 | 说明 |
|---|---|---|
| GET | 小程序 JWT | 获取今日任务列表 |

#### `POST /api/miniapp/tasks/[taskId]/complete`

| 方法 | 权限 | 说明 |
|---|---|---|
| POST | 小程序 JWT | 打卡完成任务 |

#### `GET /api/miniapp/weekly-plans/current`

| 方法 | 权限 | 说明 |
|---|---|---|
| GET | 小程序 JWT | 获取当前周计划 |

#### `GET /api/miniapp/growth-card`

| 方法 | 权限 | 说明 |
|---|---|---|
| GET | 小程序 JWT | 获取成长卡片数据 |

#### `POST /api/miniapp/subscriptions`

| 方法 | 权限 | 说明 |
|---|---|---|
| POST | 小程序 JWT | 订阅微信模板消息 |

#### `POST /api/miniapp/upload`

| 方法 | 权限 | 说明 |
|---|---|---|
| POST | 小程序 JWT | 上传文件（图片/录音） |

#### `POST /api/miniapp/transcribe`

| 方法 | 权限 | 说明 |
|---|---|---|
| POST | 小程序 JWT | 语音转文字 |

### 定时任务

#### `POST /api/miniapp/jobs/daily-reminder`

| 方法 | 权限 | 说明 |
|---|---|---|
| POST | 公开 | 每日 0:00 定时任务，推送订阅消息提醒 |

---

## 21. 钉钉模块

### `POST /api/dingtalk/push`

| 方法 | 权限 | 说明 |
|---|---|---|
| POST | 登录用户 | 手动推送 AI 日报到钉钉群 |

---

## 22. 其他

### `POST /api/register`

| 方法 | 权限 | 说明 |
|---|---|---|
| POST | 公开 | 注册新用户 |

### `GET /api/health`

| 方法 | 权限 | 说明 |
|---|---|---|
| GET | 公开 | 健康检查端点，返回 `{ status: "ok", timestamp }` |

---

## 23. 权限速查表

| 权限级别 | 检查方式 | 适用路由 |
|---|---|---|
| **公开** | 无 | `/api/health`, `/api/register`, `/api/auth/[...nextauth]`, `/api/uploads/[...path]`, `/api/miniapp/auth/*`, `/api/miniapp/config`, `/api/miniapp/jobs/daily-reminder` |
| **登录用户** | `getServerSession()` | 大部分 Web 端路由 |
| **小程序 JWT** | `getMiniAppUser()` | `/api/miniapp/*`（除公开路由） |
| **ADMIN 角色** | `session.user.role === 'ADMIN'` | `/api/admin/stats`, `/api/admin/users`, `/api/admin/ai-config` |
| **canViewChild** | `canViewChild(userId, child)` | 孩子数据读取：milestones, growth, evidence, parent-logs(读), gamification, goals(读) |
| **canManageChild** | `canManageChild(userId, child)` | 孩子数据写入：goals(写), parent-logs(写), weekly-plans(写), task-templates(写) |

---

## 24. 请求/响应模式

### 通用响应格式

```typescript
// 成功
{ "data": {...} } 或 { "data": [...] }

// 错误
{ "error": "错误消息" }

// HTTP 状态码
200 OK        // 成功
400 Bad Request   // 请求参数错误
401 Unauthorized  // 未登录
403 Forbidden     // 无权限
404 Not Found     // 资源不存在
500 Server Error  // 服务器错误
```

### 常见请求体格式

```typescript
// 分页
{ "page": number, "pageSize": number }

// 日期范围
{ "startDate": "YYYY-MM-DD", "endDate": "YYYY-MM-DD" }

// 孩子筛选
{ "childId": "uuid" }
```

---

## 25. 文件上传规范

### 头像上传

| 项 | 说明 |
|---|---|
| 接口 | `POST /api/user/avatar` 或 `POST /api/upload/avatar` |
| 请求 | `multipart/form-data`，字段名 `file` |
| 类型 | `image/png`, `image/jpeg`, `image/webp` |
| 返回 | `{ "url": "https://.../uploads/avatars/xxx.png" }` |

### 打卡佐证上传

| 项 | 说明 |
|---|---|
| 接口 | `POST /api/upload/task-evidence` |
| 请求 | `multipart/form-data`，字段名 `file` |
| 类型 | `image/*` |
| 返回 | `{ "url": "https://.../uploads/xxx.jpg" }` |

### 录音上传（小程序）

| 项 | 说明 |
|---|---|
| 接口 | `POST /api/miniapp/upload` |
| 请求 | `multipart/form-data`，字段名 `file` |
| 类型 | `audio/m4a`, `audio/x-m4a`, `audio/mp3`, `audio/wav` |
| 返回 | `{ "url": "https://.../uploads/xxx.m4a" }` |