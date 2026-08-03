# 趣学伴 v2.1 Dark Premium Theme 配色规范

> 版本：v2.1 Dark Premium  
> 定位：高端教育科技 / AI 家庭教育操作系统  
> 风格关键词：专业、克制、未来感、成长感  
> 禁用：电竞风、游戏风、高饱和霓虹

---

## 1. 设计原则

1. **深色优先**：所有后台页面以深蓝黑为底，减少视觉疲劳，突出内容。
2. **品牌克制**：粉色仅用于主品牌、当前重点、目标学校等核心锚点，不过度使用。
3. **AI 独立**：AI 模块使用紫色系，与品牌粉色形成语义区分。
4. **低存在感的边框**：边框统一使用 8% 白色透明度，避免明显分割线。
5. **卡片层级**：通过背景色深浅（#090B12 → #111522 → #171C2B → #1C2233）建立层级，而不是重阴影。

---

## 2. CSS Variables

定义位置：`app/globals.css :root`

### 2.1 背景体系

| Token | 色值 | 用途 |
|-------|------|------|
| `--bg-primary` | `#090B12` | 页面主背景、左侧导航背景 |
| `--bg-header` | `#0D1018` | 顶部 Header、搜索框区域 |
| `--bg-card` | `#111522` | 一级卡片背景（学生信息卡、时间轴卡片、AI 建议卡片） |
| `--bg-card-hover` | `#171C2B` | 卡片 hover、内嵌模块、节点卡 |
| `--bg-elevated` | `#1C2233` | 浮层背景（下拉菜单、Tooltip、弹窗） |

### 2.2 品牌色体系

| Token | 色值 | 用途 |
|-------|------|------|
| `--color-primary` | `#F43F7A` | 当前节点、激活菜单、主要按钮、目标学校 |
| `--color-primary-glow` | `#FB7185` | 渐变终点、头像背景、重点卡片、进度环 |
| `--color-primary-dim` | `rgba(244, 63, 122, 0.12)` | 主色浅底高亮 |
| `--shadow-primary` | `rgba(244, 63, 122, 0.22)` | 主色发光阴影 |

主品牌渐变：

```css
linear-gradient(135deg, #F43F7A, #FB7185);
```

### 2.3 AI 色体系

| Token | 色值 | 用途 |
|-------|------|------|
| `--ai-primary` | `#8B5CF6` | AI 诊断、AI 战略建议、智能分析 |
| `--ai-glow` | `#6366F1` | AI 渐变终点 |
| `--color-secondary` | `#8B5CF6` | Tailwind 中的 secondary，专用于 AI |
| `--color-secondary-glow` | `#6366F1` | AI 渐变终点 |
| `--color-secondary-dim` | `rgba(139, 92, 246, 0.12)` | AI 浅底高亮 |
| `--shadow-secondary` | `rgba(139, 92, 246, 0.22)` | AI 发光阴影 |

AI 渐变：

```css
linear-gradient(135deg, #8B5CF6, #6366F1);
```

### 2.4 状态颜色

| Token | 色值 | 用途 |
|-------|------|------|
| `--success` | `#10B981` | 完成节点、提升、正向反馈 |
| `--warning` | `#F59E0B` | 关键节点预警、风险提醒 |
| `--danger` | `#EF4444` | 严重风险、错误 |

### 2.5 文字颜色体系

| Token | 色值 | 用途 |
|-------|------|------|
| `--text-primary` | `#F8FAFC` | 页面标题、孩子名字、节点标题 |
| `--text-secondary` | `#CBD5E1` | 描述、解释 |
| `--text-tertiary` | `#94A3B8` | 辅助说明、标签 |
| `--text-muted` | `#64748B` | 时间、占位符、次要信息 |
| `--text-disabled` | `#334155` | 禁用文字 |

### 2.6 边框体系

| Token | 色值 | 用途 |
|-------|------|------|
| `--border-default` | `rgba(255, 255, 255, 0.08)` | 默认卡片边框、分割线 |
| `--border-primary` | `rgba(244, 63, 122, 0.45)` | 强调边框、激活卡片 |
| `--border-ai` | `rgba(139, 92, 246, 0.45)` | AI 模块强调边框 |

### 2.7 阴影与圆角

| Token | 值 | 用途 |
|-------|------|------|
| `--shadow-card` | `0 8px 30px rgba(0, 0, 0, 0.25)` | 卡片阴影 |
| 大卡片圆角 | `20px` | 一级卡片、CommandCard |
| 小卡片圆角 | `14px` | 二级模块、按钮、输入框 |
| 标签圆角 | `999px` | 状态标签、徽章 |

---

## 3. Tailwind 映射

定义位置：`tailwind.config.ts`

| Tailwind Class | 映射值 | 说明 |
|----------------|--------|------|
| `bg-background` | `var(--bg-primary)` | 页面背景 |
| `bg-surface` | `var(--bg-card)` | 一级卡片背景 |
| `bg-surface-hover` | `var(--bg-card-hover)` | 卡片 hover |
| `bg-surface-elevated` | `var(--bg-elevated)` | 浮层、下拉、弹窗 |
| `bg-surface-header` | `var(--bg-header)` | Header、搜索框 |
| `text-text-primary` | `var(--text-primary)` | 主标题文字 |
| `text-text-secondary` | `var(--text-secondary)` | 正文文字 |
| `text-text-tertiary` | `var(--text-tertiary)` | 辅助文字 |
| `text-text-muted` | `var(--text-muted)` | 占位/次要文字 |
| `text-text-disabled` | `var(--text-disabled)` | 禁用文字 |
| `border-border-default` | `var(--border-default)` | 默认边框 |
| `border-border-primary` | `var(--border-primary)` | 主色强调边框 |
| `border-border-ai` | `var(--border-ai)` | AI 强调边框 |
| `text-primary` / `bg-primary` | `var(--color-primary)` | 品牌主色 |
| `text-secondary` / `bg-secondary` | `var(--color-secondary)` | AI 紫色 |
| `text-success` / `bg-success` | `var(--success)` | 成功/完成 |
| `text-warning` / `bg-warning` | `var(--warning)` | 警告/风险 |
| `text-error` / `bg-error` | `var(--danger)` | 错误/严重风险 |
| `shadow-panel` / `shadow-card` | `var(--shadow-card)` | 卡片阴影 |

---

## 4. 页面具体替换关系

| 原样式 | 替换为 | 说明 |
|--------|--------|------|
| 纯黑背景 `#050508` | `bg-background` / `#090B12` | 更高级的深蓝黑 |
| 黑色卡片 `#111118` | `bg-surface` / `#111522` | 带一点蓝调的卡片背景 |
| 亮粉色 `#ff2d6a` | `text-primary` / `#F43F7A` | 更克制的玫瑰红 |
| AI 粉色 | `text-secondary` / `#8B5CF6` | AI 模块独立紫色 |
| 绿色 `#22c55e` | `text-success` / `#10B981` | 更沉稳的翡翠绿 |
| 黄色 `#d97706` | `text-warning` / `#F59E0B` | 更明亮的琥珀黄 |
| 灰字 70% 白 | `text-text-secondary` / `#CBD5E1` | 冷灰蓝文字 |
| 深灰字 30% 白 | `text-text-muted` / `#64748B` | slate 灰 |
| 明显红边框 | `border-border-primary` / `rgba(244,63,122,0.45)` | 半透明主色边框 |
| 16px 大卡片圆角 | `rounded-[20px]` | 更圆润的大卡片 |
| 12px 小卡片圆角 | `rounded-[14px]` | 更圆润的小模块 |

---

## 5. 组件使用规范

### 5.1 CommandCard

- 默认：`bg-surface` + `border-border-default` + `rounded-[20px]` + `shadow-card`
- 激活：`border-border-primary` + 左侧 3px 主色竖线
- Hover：`bg-surface-hover` + 11% 白边框

### 5.2 搜索框

```tsx
<div className="relative w-full max-w-md">
  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
  <input
    type="text"
    placeholder="搜索路线、任务、学校..."
    className="w-full h-10 pl-9 pr-4 rounded-[14px] bg-surface-header border border-border-default text-sm text-text-secondary placeholder:text-text-muted focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
  />
</div>
```

### 5.3 时间轴

| 状态 | 节点边框 | 图标颜色 | 标签 | 能力目标图标 |
|------|----------|----------|------|--------------|
| 已完成 | `border-success/40` | `text-success` | `text-success` + `border-success/20` | `text-success/70` |
| 当前重点 | `border-primary/40` + 发光 | `text-primary` | `text-primary` + `border-primary/20` | `text-primary/70` |
| 未开始 | `border-border-default` | `text-text-muted` | `text-text-tertiary` + `border-border-default` | `text-text-muted` |

### 5.4 AI 模块

- 标题图标：`text-secondary`
- 边框强调：`border-border-ai`
- 列表序号/勾选：`text-secondary`
- 避免使用粉色表示 AI

### 5.5 风险标签

| 风险等级 | 背景 | 文字 | 边框 |
|----------|------|------|------|
| 高风险 | `bg-error/10` | `text-error` | `border-error/20` |
| 中风险 | `bg-warning/10` | `text-warning` | `border-warning/20` |
| 低风险 | `bg-success/10` | `text-success` | `border-success/20` |

---

## 6. 注意事项

1. **不要直接使用十六进制色值**，优先使用 Tailwind class 或 CSS variables。
2. **AI 模块禁用粉色**，统一使用 secondary 紫色系。
3. **边框保持低存在感**，默认使用 `border-border-default`，强调场景才使用 `border-border-primary` / `border-border-ai`。
4. **卡片阴影统一使用 `shadow-card`**，避免黑色重阴影。
5. **圆角规范**：大卡片 20px，小模块 14px，标签 999px。
