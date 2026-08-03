# 趣学伴 UI 使用规范（当前深色主题）

> 基于现有 `tailwind.config.ts` 与 `app/globals.css` 制定，目标：统一全站图标、文字、间距、按钮、表格、配色。

---

## 1. 颜色 Token：必须用这些，禁止硬编码

### 1.1 背景色

| 场景 | 正确 Class | 禁止 |
|------|-----------|------|
| 页面主背景 | `bg-background` | `#050508`、`#0a0a0f`、`bg-gray-900`、`bg-slate-900` |
| 卡片/面板背景 | `bg-surface-elevated` | `bg-white`、`bg-[#ffffff]`、`bg-slate-800` |
| 卡片 Hover / 高亮背景 | `bg-surface-hover` | `bg-white/5`、`bg-white/[0.04]`、内联 `rgba(255,255,255,0.x)` |
| 表头 / 次级背景 | `bg-surface-highlight` | `bg-slate-100`、`bg-gray-100`、`bg-[#f1f5f9]` |
| 输入框背景 | `bg-surface` | `bg-white`、透明 |

### 1.2 文字色

| 场景 | 正确 Class | 禁止 |
|------|-----------|------|
| 主标题 / 正文 | `text-text-primary` | `text-white`、`text-slate-50` |
| 次级说明 | `text-text-secondary` | `text-slate-300`、`text-gray-300`、`#334155` |
| 占位 / 时间 / 禁用 | `text-text-tertiary` | `text-slate-400`、`text-gray-400`、`#475569` |
| 最弱提示 / 分割线文字 | `text-text-muted` | `text-slate-500`、`text-gray-500`、`#64748b` |
| 链接 / 主操作文字 | `text-primary` | 硬编码蓝色 |
| 成功 | `text-success` | `#16a34a`、硬编码绿 |
| 警告 | `text-warning` | `#d97706`、硬编码黄 |
| 错误 | `text-error` | `#dc2626`、硬编码红 |

### 1.3 边框色

| 场景 | 正确 Class | 禁止 |
|------|-----------|------|
| 卡片/面板边框 | `border-border-subtle` | `border-white/[0.08]`、`border-slate-700`、`border-gray-200` |
| 输入框 / 按钮边框 | `border-border-default` | `border-white/10`、`border-slate-500` |
| 强调边框 / 聚焦 | `border-primary` | 硬编码 `#2563eb` |
| 错误边框 | `border-error` | 硬编码红 |

### 1.4 状态色

统一使用：
- `bg-primary` / `text-primary`
- `bg-secondary` / `text-secondary`
- `bg-success` / `text-success`
- `bg-warning` / `text-warning`
- `bg-error` / `text-error`

禁止在代码中写死 `#07C160`（微信绿）、`#f43f5e`、`#8b5cf6` 等，除非该颜色就是某个功能专属且已定义成 token。

---

## 2. 按钮：只允许以下样式

### 2.1 主按钮

```jsx
<button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors">
  保存
</button>
```

- 高度：标准 `36px`（`py-2` + `text-sm`），小按钮 `28px`
- 圆角：`rounded-lg`（8px）
- 内边距：`px-4 py-2`
- 图标 + 文字间距：`gap-2`
- Hover：`hover:bg-primary/90`，**禁止有位移、缩放、阴影变化**
- 禁用：`opacity-50 cursor-not-allowed`

### 2.2 次按钮 / 边框按钮

```jsx
<button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border-default bg-surface-elevated text-text-secondary text-sm font-medium hover:bg-surface-hover transition-colors">
  编辑
</button>
```

### 2.3 Ghost 按钮

```jsx
<button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-text-tertiary hover:text-text-secondary hover:bg-surface-hover transition-colors">
  <Icon className="w-4 h-4" />
  取消
</button>
```

### 2.4 图标按钮

```jsx
<button className="inline-flex items-center justify-center w-9 h-9 rounded-lg hover:bg-surface-hover transition-colors">
  <Icon className="w-5 h-5 text-text-tertiary" />
</button>
```

禁止：
- 同一个页面出现 `rounded-xl`、`rounded-lg`、`rounded-md` 按钮混用
- 有的按钮加 `shadow` 有的不加
- 文字按钮用 `text-slate-300`

---

## 3. 卡片 / 面板：统一结构

### 3.1 标准卡片

```jsx
<div className="rounded-2xl bg-surface-elevated border border-border-subtle p-5 sm:p-6">
  {/* 内容 */}
</div>
```

- 圆角：`rounded-2xl`（16px）
- 背景：`bg-surface-elevated`
- 边框：`border-border-subtle`
- 内边距：桌面 `p-6`，移动端 `p-5`
- 阴影：**不加 `shadow`**，当前主题靠边框和背景层级区分

### 3.2 卡片头部结构

```jsx
<div className="flex items-start justify-between gap-4 mb-4">
  <div>
    <h2 className="text-lg font-bold font-display text-text-primary">卡片标题</h2>
    <p className="text-sm text-text-tertiary mt-0.5">辅助说明</p>
  </div>
  <div className="flex items-center gap-2">
    {/* 操作按钮 */}
  </div>
</div>
```

禁止：
- 有的卡片 `p-4`，有的 `p-6`，有的 `p-8`
- 有的卡片 `rounded-xl`，有的 `rounded-2xl`
- 使用 `bg-white/5`、`bg-white/[0.04]`、`.glass`

---

## 4. 文字排版

### 4.1 标题层级

| 层级 | Class | 用途 |
|------|-------|------|
| 页面大标题 | `text-2xl sm:text-3xl font-bold font-display` | 每个页面最顶部 |
| 区块标题 | `text-lg font-bold font-display` | 卡片内标题 |
| 小标题 | `text-base font-semibold` | 分组标题 |
| 正文 | `text-sm text-text-secondary leading-relaxed` | 说明文字 |
| 辅助说明 | `text-xs text-text-muted` | 标签、时间、计数 |

### 4.2 行高

- 标题：`leading-tight` 或默认
- 正文：`leading-relaxed`
- 密集列表：`leading-snug`

禁止：
- 同级标题有的 `font-bold` 有的 `font-semibold`
- 同级正文有的 `text-sm` 有的 `text-base`
- 正文用 `text-slate-400`

---

## 5. 图标：统一尺寸和颜色

### 5.1 尺寸规范

| 场景 | 尺寸 |
|------|------|
| 行内小图标 | `w-4 h-4` |
| 默认图标（按钮、列表） | `w-5 h-5` |
| 大图标（标题区、空状态） | `w-6 h-6` |
| 标题区装饰图标 | `w-5 h-5` |

### 5.2 颜色规范

| 场景 | 颜色 |
|------|------|
| 默认图标 | `text-text-tertiary` |
| 次级图标 | `text-text-secondary` |
| 主操作 / 激活 | `text-primary` |
| 成功 | `text-success` |
| 警告 | `text-warning` |
| 错误 | `text-error` |

禁止：
- 同一个页面里 `w-4`、`w-5`、`w-6` 混用
- 硬编码图标颜色如 `text-[#8b5cf6]`、`text-rose-400`

---

## 6. 表格 / 矩阵

### 6.1 标准表格

```jsx
<div className="rounded-2xl border border-border-subtle bg-surface-elevated overflow-hidden">
  <div className="overflow-x-auto">
    <table className="w-full border-collapse">
      <thead>
        <tr className="bg-surface-highlight border-b border-border-subtle">
          <th className="text-left px-4 py-3 text-xs font-medium text-text-muted">列1</th>
        </tr>
      </thead>
      <tbody>
        <tr className="border-b border-border-subtle/50 hover:bg-surface-hover/30">
          <td className="px-4 py-3 text-sm text-text-secondary">值</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
```

- 表头：`bg-surface-highlight` + `text-text-muted` + `text-xs` + `font-medium`
- 单元格内边距：`px-4 py-3`
- 行分隔：`border-b border-border-subtle/50`
- 行 Hover：`hover:bg-surface-hover/30`
- 完成行：`bg-success/[0.03]` + 文字划线

### 6.2 矩阵视图

沿用 `WeeklyMatrix` / `WeeklyTaskChecklistMatrix` 风格：
- 单元格边框：`border-border-subtle`
- 表头背景：`bg-surface-highlight`
- 当前/激活状态：`bg-primary/10` + `text-primary`
- 完成状态：`bg-success/10` + `text-success`

禁止：
- 表格用 `bg-slate-100` / `bg-white`
- 表头文字用 `text-slate-600`
- 行高 / 内边距各表不统一

---

## 7. 间距：统一取值

### 7.1 页面级

| 场景 | 取值 |
|------|------|
| 页面内容区外间距 | `space-y-8`（32px） |
| 页面标题到内容 | `mb-8` |
| 卡片网格间距 | `gap-6`（24px） |
| 卡片内部模块间距 | `space-y-4`（16px） |

### 7.2 组件级

| 场景 | 取值 |
|------|------|
| 表单行间距 | `space-y-4` 或 `gap-4` |
| 按钮组间距 | `gap-2` 或 `gap-3` |
| 列表项间距 | `space-y-2` 或 `space-y-3` |
| 图标与文字间距 | `gap-1.5` 或 `gap-2` |

禁止：
- 相邻卡片有的 `gap-4` 有的 `gap-6`
- 同类型列表有的 `space-y-2` 有的 `space-y-4`
- 用 `m-2`、`m-3` 等零散 margin

---

## 8. 表单 / 输入框

```jsx
<input
  className="w-full rounded-lg border border-border-default bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary focus:border-primary focus:outline-none"
  placeholder="请输入"
/>
```

- 高度：`36px`（`py-2` + `text-sm`）
- 圆角：`rounded-lg`
- 背景：`bg-surface`
- 边框：`border-border-default`
- Focus：`focus:border-primary`
- Placeholder：`placeholder:text-text-tertiary`
- 错误：`border-error` + `text-error`

---

## 9. 弹窗 / Modal

```jsx
<div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
  <div className="w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-2xl bg-surface-elevated border border-border-subtle p-6">
    {/* 内容 */}
  </div>
</div>
```

- z-index：`>= 100`，必须覆盖导航栏
- 最大高度：`max-h-[85vh]`
- 圆角：`rounded-2xl`
- 背景：`bg-surface-elevated`
- 边框：`border-border-subtle`
- 内容可滚动

---

## 10. 禁止清单

以下写法必须全部清理：

- [ ] `#050508`、`#0a0a0f`、`#f7f8fa`、`#f1f5f9`、`#334155`、`#475569`、`#64748b` 等硬编码色值
- [ ] `bg-white`、`text-white`（除非在纯打印组件）
- [ ] `bg-gray-*`、`text-gray-*`、`border-gray-*`
- [ ] `bg-slate-*`、`text-slate-*`、`border-slate-*`
- [ ] `bg-white/5`、`bg-white/[0.04]`、`border-white/[0.08]` 等透明旧写法
- [ ] `style={{ color: ... }}`、`style={{ backgroundColor: ... }}` 内联样式
- [ ] `.glass`、`.gradient-text`、`.glow-*`、`.corner-accent`、`.grid-pattern` 等旧装饰类
- [ ] 按钮圆角 `rounded-xl`、`rounded-md` 混用
- [ ] 图标尺寸 `w-4`、`w-5`、`w-6` 在同一场景混用
- [ ] 卡片内边距 `p-4`、`p-5`、`p-6`、`p-8` 无规律混用
- [ ] `shadow-md`、`shadow-lg`、`shadow-xl` 随意使用

---

## 11. 迁移优先级

### P0（立即处理）

1. `components/weekly/WeeklyReportExport.tsx`：浅色主题残留，需明确是打印专用还是统一成深色
2. `components/dashboard/MiddleSchoolMatrix.tsx` / `MiddleSchoolRoadmap.tsx`：`text-slate-*`、`bg-white/5`、SVG 硬编码色
3. `components/weekly/GeneratePlanModal.tsx`：`text-slate-*`、`bg-white/5`

### P1（本周处理）

4. `app/login/page.tsx` / `app/register/page.tsx`：微信绿硬编码 `#07C160`
5. `components/marketing/*`：`text-slate-*` 系列
6. 全站按钮圆角、图标尺寸、卡片内边距统一

### P2（后续优化）

7. 建立 `Button`、`Card`、`Input`、`Modal` 原子组件，强制复用
8. 建立 `PageHeader`、`EmptyState` 等布局组件
9. 完善 `prefers-reduced-motion` 支持

---

## 12. 快速自检

写新页面或重构前，逐条检查：

- [ ] 背景色是否用了 `bg-background` / `bg-surface-elevated`？
- [ ] 文字色是否用了 `text-text-primary/secondary/tertiary/muted`？
- [ ] 边框色是否用了 `border-border-subtle/default`？
- [ ] 按钮是否用了标准按钮结构？
- [ ] 卡片是否 `rounded-2xl` + `bg-surface-elevated` + `border-border-subtle`？
- [ ] 图标尺寸是否统一？颜色是否来自 token？
- [ ] 表格表头是否 `bg-surface-highlight` + `text-text-muted`？
- [ ] 是否还有硬编码颜色或内联 `style`？
