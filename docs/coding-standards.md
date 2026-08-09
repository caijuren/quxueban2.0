# 编码规范

> 版本：v1.0 | 更新日期：2026-08-09

## 目录

1. [通用原则](#1-通用原则)
2. [命名规范](#2-命名规范)
3. [文件组织](#3-文件组织)
4. [TypeScript 规范](#4-typescript-规范)
5. [React 组件规范](#5-react-组件规范)
6. [样式规范](#6-样式规范)
7. [API 路由规范](#7-api-路由规范)
8. [数据库规范](#8-数据库规范)
9. [Git 提交规范](#9-git-提交规范)
10. [工具配置](#10-工具配置)

---

## 1. 通用原则

### 1.1 核心原则

- **一致性优先**：项目中已有的代码风格优先于个人偏好
- **工程严谨**：使用 TypeScript 严格模式，避免 `any` 类型
- **可维护性**：代码即文档，适当注释解释"为什么"而非"是什么"
- **性能意识**：注意 React Server/Client 组件边界，避免不必要的客户端渲染

### 1.2 禁止项

- 禁止在 className 中硬编码颜色值（使用 Design Token 变量）
- 禁止在 style 属性中硬编码颜色
- 禁止使用 `any` 类型（除非与第三方库交互且无法避免）
- 禁止在组件中直接修改 props
- 禁止使用 `var` 声明变量

---

## 2. 命名规范

### 2.1 文件命名

| 类型 | 规范 | 示例 |
|------|------|------|
| 组件文件 | PascalCase | `TaskCard.tsx`, `ProgressRing.tsx` |
| 页面文件 | kebab-case | `page.tsx`, `layout.tsx` |
| API 路由 | kebab-case | `route.ts`, `ai-summary/` |
| 工具函数 | camelCase | `utils.ts`, `validation.ts` |
| 类型定义 | PascalCase | `storage.types.ts` |
| 样式文件 | kebab-case | `globals.css` |
| Hook 文件 | camelCase with `use` | `useChildren.ts` |

### 2.2 代码命名

| 类型 | 规范 | 示例 |
|------|------|------|
| 组件名 | PascalCase | `export default function TaskCard()` |
| 函数名 | camelCase | `function getPlanStats()` |
| 变量名 | camelCase | `const completionRate` |
| 常量 | UPPER_SNAKE | `const MAX_DAILY_MINUTES = 120` |
| 类型/接口 | PascalCase | `interface WeeklyPlan` |
| 枚举 | PascalCase | `enum TaskStatus` |
| 枚举成员 | UPPER_SNAKE | `PENDING`, `DONE`, `SKIPPED` |
| props 接口 | PascalCase + `Props` | `interface TaskCardProps` |
| 私有函数 | camelCase | `function buildPrompt()`（无 `_` 前缀） |

### 2.3 目录命名

- 使用 kebab-case 命名目录
- 组件目录使用 PascalCase 命名（如 `ui/`, `dashboard/`, `settings/` 等业务分类用 kebab-case，但组件文件名用 PascalCase）

---

## 3. 文件组织

### 3.1 组件文件结构

```typescript
'use client';  // 仅当使用客户端特性时

import * as React from 'react';
import { cn } from '@/lib/utils';

// 1. Props 接口定义
export interface ComponentNameProps {
  // ...
}

// 2. 辅助函数（可选）
function helperFunction() {
  // ...
}

// 3. 组件实现
export default function ComponentName({ prop1, prop2 }: ComponentNameProps) {
  return (
    // JSX
  );
}
```

### 3.2 导入顺序

1. React / Next.js 内置模块
2. 第三方库
3. 项目内部模块（`@/` 别名）
4. 相对路径模块
5. CSS/样式文件

每组之间用空行分隔：

```typescript
import * as React from 'react';
import Link from 'next/link';

import { cn } from '@/lib/utils';

import { Icon } from '@/components/ui/icon';
```

### 3.3 单文件职责

- 一个文件一个主要导出（default export）
- 辅助类型和工具函数可放在同一文件
- 组件文件不应超过 300 行，超过时考虑拆分

---

## 4. TypeScript 规范

### 4.1 类型优先

```typescript
// ✅ 正确：先定义接口，再使用
export interface TaskCardProps {
  task: WeeklyTaskItem;
  onComplete: (taskId: string) => void;
  className?: string;
}

// ❌ 避免：内联类型定义
function TaskCard({ task, onComplete }: { task: any; onComplete: (id: string) => void }) {
  // ...
}
```

### 4.2 严格模式

- `tsconfig.json` 已启用 `strict: true`
- 尽量避免类型断言（`as`），使用类型守卫（type guards）替代
- 使用 `satisfies` 操作符验证类型但不改变推断

### 4.3 避免 `any`

```typescript
// ❌ 避免
const data: any = await response.json();

// ✅ 优先：定义明确的类型
const data = (await response.json()) as SomeType;

// ✅ 更好：使用 Zod 运行时验证
const schema = z.object({ name: z.string() });
const data = schema.parse(await response.json());
```

### 4.4 类型导出

- 公共类型和接口应在 `lib/storage.types.ts` 或 `lib/types.ts` 中定义
- 组件专有类型在组件文件顶部定义
- 使用 `type` 关键字导出类型，使用 `interface` 关键字导出接口

---

## 5. React 组件规范

### 5.1 组件类型

| 类型 | 后缀 | 说明 |
|------|------|------|
| 页面组件 | `page.tsx` | App Router 页面 |
| 布局组件 | `layout.tsx` | App Router 布局 |
| 加载组件 | `loading.tsx` | 加载状态 |
| 错误组件 | `error.tsx` | 错误边界 |
| API 路由 | `route.ts` | API 端点 |
| 通用组件 | `.tsx` | 可复用组件 |

### 5.2 Client vs Server 组件

- 默认使用 Server Component（无 `'use client'` 指令）
- 仅在需要交互性、使用 Hook、或浏览器 API 时添加 `'use client'`
- 将交互部分隔离到叶子组件，保持上层组件为 Server Component

### 5.3 Props 设计

- 总是包含 `className?: string` 以支持样式扩展
- 表单控件使用 `forwardRef` 以支持表单库集成
- 使用解构赋值，并提供合理的默认值

```typescript
export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className,
  children,
  ...props
}: ButtonProps) {
  // ...
}
```

### 5.4 className 组合

使用 `cn()` 工具函数（`lib/utils.ts`）组合 className：

```typescript
import { cn } from '@/lib/utils';

<div className={cn(
  'base-class',
  variant === 'primary' && 'bg-primary',
  className  // 始终放在最后，允许覆盖
)}>
```

### 5.5 条件渲染

```typescript
// ✅ 使用 && 或三元表达式
{isLoading && <Spinner />}
{items.length > 0 ? <List items={items} /> : <EmptyState />}

// ❌ 避免 && 用于数字 0
{items.length && <List />}  // 错误：当 length=0 时会渲染 0
{items.length > 0 && <List />}  // 正确
```

### 5.6 Hooks 规范

- 自定义 Hook 放在 `lib/hooks/` 目录
- Hook 命名以 `use` 开头
- Hook 只在组件顶层调用，不在条件、循环中调用
- 使用 React Query 管理服务端状态

---

## 6. 样式规范

### 6.1 Design Token

所有颜色、间距、圆角、阴影等必须使用 Design Token（CSS 变量）：

```typescript
// ✅ 正确
<div className="bg-surface text-text-primary rounded-lg" />

// ❌ 禁止
<div className="bg-[#090B12] text-[#CBD5E1] rounded-[12px]" />
```

### 6.2 Tailwind 类名顺序

使用 `prettier-plugin-tailwindcss` 自动排序（已配置在 `.prettierrc` 中）：

- 布局（display, position）→ 盒模型（width, margin, padding）→ 视觉（color, background）→ 交互（cursor, hover）
- 不要手动排序，Prettier 会自动处理

### 6.3 响应式

- 使用 Tailwind 响应式前缀：`sm:`, `md:`, `lg:`, `xl:`
- 移动优先：先写移动端样式，再用断点覆盖
- 参考布局组件中的响应式模式

### 6.4 全局样式

全局样式定义在 `app/globals.css` 中，包括：
- Design Token 变量（`data-theme="dark"` 和 `data-theme="light"`）
- 基础样式（`body`, `scrollbar`, `selection`）
- 工具类（`animated-bg`, `grid-pattern`, `glass`）

---

## 7. API 路由规范

### 7.1 路由结构

```typescript
// app/api/example/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  // 1. 认证
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 2. 参数解析
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  // 3. 业务逻辑
  const data = await prisma.example.findMany({ ... });

  // 4. 返回
  return NextResponse.json(data);
}
```

### 7.2 请求体验证

使用 Zod 进行请求体验证（参考 `lib/validation.ts`）：

```typescript
import { validateBody } from '@/lib/validation';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(1),
  age: z.number().int().positive(),
});

export async function POST(req: Request) {
  const validation = await validateBody(req, schema);
  if (!validation.success) {
    return validation.response;  // 自动返回 400 错误
  }

  const body = validation.data;
  // ...
}
```

### 7.3 权限控制

使用 `lib/family.ts` 中的权限函数：

```typescript
import { canViewChild, canManageChild } from '@/lib/family';

// 查看权限：家庭成员可查看
if (!(await canViewChild(userId, child))) {
  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}

// 管理权限：OWNER/ADMIN 可编辑
if (!(await canManageChild(userId, child))) {
  return NextResponse.json({ error: '无权限编辑' }, { status: 403 });
}
```

### 7.4 错误处理

```typescript
try {
  // 业务逻辑
} catch (error) {
  console.error('[module] error:', error);
  return NextResponse.json(
    { error: error instanceof Error ? error.message : '未知错误' },
    { status: 500 }
  );
}
```

---

## 8. 数据库规范

### 8.1 Prisma Schema

- 模型名使用 PascalCase 单数形式：`User`, `Child`, `WeeklyPlan`
- 字段名使用 camelCase
- 关系字段明确标注 `@relation`
- 使用 `@map` 和 `@@map` 映射到数据库表名（snake_case）

### 8.2 迁移策略

- 每次修改 schema 后运行 `pnpm db:migrate` 创建迁移文件
- 迁移文件应提交到版本控制
- 不要手动修改已创建的迁移文件

### 8.3 JSON 字段

- 灵活结构使用 JSON 字段（如 `tasks`, `goals`）
- JSON 字段的 TypeScript 类型在 `lib/storage.types.ts` 中定义
- 读写时进行类型转换

---

## 9. Git 提交规范

### 9.1 提交信息格式

```
<type>(<scope>): <description>

[optional body]
```

### 9.2 类型

| 类型 | 说明 |
|------|------|
| `feat` | 新功能 |
| `fix` | 修复 bug |
| `refactor` | 重构 |
| `style` | 样式/格式变更 |
| `docs` | 文档 |
| `chore` | 构建/工具 |
| `perf` | 性能优化 |
| `test` | 测试 |

### 9.3 示例

```
feat(weekly): 添加 AI 周回顾生成功能

fix(family): 修复手机号归一化时前缀处理问题

refactor(ui): 提取通用 Button 组件

docs: 添加 API 参考文档
```

### 9.4 提交前检查

- [ ] `pnpm lint` 通过
- [ ] `pnpm type-check` 通过
- [ ] 无硬编码颜色值
- [ ] 使用 Design Token

---

## 10. 工具配置

### 10.1 ESLint

已配置规则（`.eslintrc.json`）：
- 继承 `next/core-web-vitals` + `plugin:tailwindcss/recommended`
- 禁止在 className 中硬编码颜色
- 禁止在 style 属性中硬编码颜色

### 10.2 Prettier

已配置规则（`.prettierrc`）：
- `semi: true` - 使用分号
- `singleQuote: true` - 使用单引号
- `tabWidth: 2` - 缩进 2 格
- `trailingComma: es5` - ES5 兼容尾逗号
- `printWidth: 100` - 行宽 100 字符
- `plugins: ["prettier-plugin-tailwindcss"]` - 自动排序 Tailwind 类名
- `tailwindFunctions: ["cn", "clsx"]` - 识别 cn/clsx 函数

### 10.3 TypeScript

- 严格模式已启用
- `@/*` 路径别名映射到项目根目录
- 模块解析使用 `bundler` 策略

---

> **相关文档**：
> - [开发者上手指南](./developer-guide.md)
> - [组件目录](./component-directory.md)
> - [设计系统文档](./design-system/)
> - [API 参考文档](./api-reference.md)