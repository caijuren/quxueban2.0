# 趣学伴发版规范

本文档定义趣学伴前端项目的发版流程、版本号规则和数据版本管理规则。

## 1. 版本号规则（SemVer）

版本号格式：`主版本号.次版本号.修订号`，例如 `v0.1.0`。

- **主版本号（MAJOR）**：重大重构、破坏性变更、不兼容旧数据格式的升级
- **次版本号（MINOR）**：新增功能、新增页面、新增能力项，向后兼容
- **修订号（PATCH）**：bug 修复、样式调整、文案修改，不影响功能

### 示例

| 变更类型 | 版本号变化 |
|---|---|
| 修复登录页按钮样式 | `v0.1.0` → `v0.1.1` |
| 新增 AI 检视功能 | `v0.1.1` → `v0.2.0` |
| 重构数据结构且不兼容旧版 | `v0.2.0` → `v1.0.0` |

## 2. 分支策略

采用基于 `main` 分支的 Git 工作流：

```
main
  ├── feature/marketing-redesign
  ├── feature/ai-insights
  ├── fix/login-button
  └── refactor/storage
```

### 分支命名

| 类型 | 命名示例 |
|---|---|
| 新功能 | `feature/功能名称` |
| Bug 修复 | `fix/问题简述` |
| 重构 | `refactor/重构范围` |
| 样式/UI | `style/页面或组件` |
| 文档 | `docs/文档名称` |

### 提交信息规范

遵循 Conventional Commits：

```
<type>(<scope>): <subject>

<body>
```

常用 type：

- `feat`：新功能
- `fix`：修复
- `refactor`：重构
- `style`：样式/UI 调整
- `docs`：文档
- `chore`：构建/工具/依赖
- `perf`：性能优化

示例：

```
feat(plan): 增加路线匹配度分析
fix(dashboard): 修复切换孩子时数据未更新
refactor(storage): 优化 localStorage 读写逻辑
```

## 3. 发版流程

### 3.1 准备阶段

1. 确认所有功能分支已合并到 `main`
2. 本地运行 `npx tsc --noEmit`，确保无 TypeScript 错误
3. 运行 `npm run build`，确保构建成功
4. 检查关键路由是否正常返回 200

### 3.2 版本发布

```bash
# 切换到 main 分支
git checkout main
git pull origin main

# 更新 package.json 版本号
npm version patch   # 修订号 +1
# npm version minor # 次版本号 +1
# npm version major # 主版本号 +1

# 提交版本变更
git add package.json package-lock.json
git commit -m "chore(release): bump version to vX.X.X"

# 打标签
git tag vX.X.X

# 推送代码和标签
git push origin main --tags
```

### 3.3 部署阶段

1. 构建生产包：`npm run build`
2. 部署到腾讯云 COS（或指定目录）
3. 刷新 CDN 缓存
4. 验证线上版本：检查页面底部版本号或 console 输出

## 4. 数据版本管理规则

趣学伴使用 `localStorage` 存储用户数据，数据 schema 版本号由 `lib/storage.ts` 中的 `CURRENT_DATA_VERSION` 控制。

### 4.1 何时升级数据版本

只要修改了 `AppData` 结构，就必须升级 `CURRENT_DATA_VERSION`：

- 新增字段
- 删除字段
- 字段类型变更
-  children 结构变更
- 新增关联数据（如 plans、progress、milestones）

### 4.2 升级步骤

1. 修改 `lib/storage.types.ts` 中的 `AppData` 类型
2. 在 `lib/migrations.ts` 中新增迁移函数
3. 将 `lib/storage.ts` 中的 `CURRENT_DATA_VERSION` 递增
4. 测试旧数据能否自动迁移到新版本

### 4.3 迁移函数示例

```typescript
// lib/migrations.ts
{
  fromVersion: 1,
  toVersion: 2,
  description: '新增用户设置字段',
  migrate: (data) => ({
    ...data,
    version: 2,
    settings: (data as any).settings ?? { theme: 'dark', notifications: true },
  }),
},
```

### 4.4 数据版本与 Git 版本的关系

- Git 版本管理代码发布
- `CURRENT_DATA_VERSION` 管理用户本地数据 schema
- 两者独立，但发版时应在提交信息中注明是否有数据版本升级

示例提交信息：

```
feat(storage): 新增用户设置

- 新增 settings 字段
- 升级 CURRENT_DATA_VERSION: 1 -> 2
- 兼容旧数据自动迁移
```

## 5. 回滚方案

### 5.1 代码回滚

```bash
# 查看历史版本
git log --oneline

# 回滚到上一个 tag
git checkout v0.1.0

# 或基于旧 tag 创建修复分支
git checkout -b hotfix/xxx v0.1.0
```

### 5.2 数据回滚

由于 localStorage 数据保存在用户浏览器中，回滚代码时需注意：

- 如果新版本升级了数据 schema，回滚旧代码可能导致数据无法读取
- 建议在新版升级数据 schema 时，保留旧数据一段时间
- 用户可通过导出功能备份数据：`exportAppData()`

### 5.3 紧急情况处理

如果线上出现严重 bug：

1. 立即在 `main` 分支上切 `hotfix/xxx` 分支
2. 修复 bug 并提交
3. 合并到 `main`，发布 `patch` 版本
4. 重新部署并刷新 CDN

## 6. 发布检查清单

- [ ] 所有功能已合并到 `main`
- [ ] `npx tsc --noEmit` 无错误
- [ ] `npm run build` 构建成功
- [ ] 关键页面路由返回 200
- [ ] `package.json` 版本号已更新
- [ ] 已打 `vX.X.X` 标签
- [ ] 已推送代码和标签到远程
- [ ] 已部署到 COS 并刷新 CDN
- [ ] 线上功能验证通过

## 7. 相关文件

- `package.json`：项目版本号
- `lib/storage.ts`：数据版本号 `CURRENT_DATA_VERSION`
- `lib/storage.types.ts`：数据类型定义
- `lib/migrations.ts`：数据迁移函数
