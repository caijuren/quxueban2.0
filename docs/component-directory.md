# 组件目录

> 版本：v1.0 | 更新日期：2026-08-09

## 目录结构

```
components/
├── ui/                  # 原子级 UI 组件（Design System）
├── layout/              # 布局组件
├── motion/              # 动画组件（framer-motion）
├── dashboard/           # 控制台/仪表盘组件
├── console/             # 家庭学习控制台组件
│   ├── core/            #   核心布局与工具
│   └── modules/         #   功能模块
│       ├── child/       #     孩子管理
│       └── home/        #     首页概览
├── settings/            # 设置页面组件
├── weekly/              # 周计划组件
├── today/               # 今日任务组件
├── ai/                  # AI 相关组件
├── gamification/        # 游戏化组件
├── subjects/            # 学科组件
├── home/                # 营销/首页组件
├── marketing/           # 营销落地页组件
└── providers/           # React Context Provider
```

---

## 1. 原子 UI 组件 (`components/ui/`)

所有原子组件均支持 `className` 扩展和 `ref` 转发。

### 按钮

| 组件 | 文件 | 描述 |
|------|------|------|
| `Button` | [button.tsx](file:///Users/grubby/Desktop/quxueban-new/components/ui/button.tsx) | 通用按钮组件 |

**Props**:
```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}
```

### 卡片

| 组件 | 文件 | 描述 |
|------|------|------|
| `Card` | [card.tsx](file:///Users/grubby/Desktop/quxueban-new/components/ui/card.tsx) | 基础卡片容器 |
| `GlassCard` | [glass-card.tsx](file:///Users/grubby/Desktop/quxueban-new/components/ui/glass-card.tsx) | 毛玻璃效果卡片 |

**Card Props**:
```typescript
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: 'none' | 'sm' | 'md' | 'lg';
  radius?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
}
```

**GlassCard Props**:
```typescript
interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  strength?: 'light' | 'medium' | 'strong';
  hover?: boolean;
  glow?: boolean;
  glowColor?: string;
}
```

### 表单控件

| 组件 | 文件 | 描述 |
|------|------|------|
| `Input` | [input.tsx](file:///Users/grubby/Desktop/quxueban-new/components/ui/input.tsx) | 文本输入框 |
| `Textarea` | [textarea.tsx](file:///Users/grubby/Desktop/quxueban-new/components/ui/textarea.tsx) | 多行文本输入 |
| `Select` | [select.tsx](file:///Users/grubby/Desktop/quxueban-new/components/ui/select.tsx) | 下拉选择器 |
| `Checkbox` | [checkbox.tsx](file:///Users/grubby/Desktop/quxueban-new/components/ui/checkbox.tsx) | 复选框 |
| `Switch` | [switch.tsx](file:///Users/grubby/Desktop/quxueban-new/components/ui/switch.tsx) | 开关 |
| `Radio` | [radio.tsx](file:///Users/grubby/Desktop/quxueban-new/components/ui/radio.tsx) | 单选按钮 |
| `SearchInput` | [search-input.tsx](file:///Users/grubby/Desktop/quxueban-new/components/ui/search-input.tsx) | 搜索输入框 |
| `FormField` | [form-field.tsx](file:///Users/grubby/Desktop/quxueban-new/components/ui/form-field.tsx) | 表单字段包装器（label + error + helper） |

**Input Props**:
```typescript
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  size?: 'sm' | 'md' | 'lg';
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}
```

**Textarea Props**:
```typescript
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  maxLength?: number;
  showCount?: boolean;
  resize?: 'none' | 'vertical' | 'both';
}
```

**Select Props**:
```typescript
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: Array<{ value: string; label: string }>;
  size?: 'sm' | 'md' | 'lg';
  error?: string;
  placeholder?: string;
}
```

**Checkbox Props**:
```typescript
interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  indeterminate?: boolean;
}
```

**Switch Props**:
```typescript
interface SwitchProps {
  size?: 'sm' | 'md' | 'lg';
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
}
```

### 数据展示

| 组件 | 文件 | 描述 |
|------|------|------|
| `Badge` | [badge.tsx](file:///Users/grubby/Desktop/quxueban-new/components/ui/badge.tsx) | 标签/徽章 |
| `Avatar` | [avatar.tsx](file:///Users/grubby/Desktop/quxueban-new/components/ui/avatar.tsx) | 头像 |
| `DataBadge` | [data-badge.tsx](file:///Users/grubby/Desktop/quxueban-new/components/ui/data-badge.tsx) | 数据标签（值+单位） |
| `MetricCard` | [metric-card.tsx](file:///Users/grubby/Desktop/quxueban-new/components/ui/metric-card.tsx) | 指标卡片 |
| `StatCard` | [stat-card.tsx](file:///Users/grubby/Desktop/quxueban-new/components/ui/stat-card.tsx) | 统计卡片 |
| `ProgressRing` | [progress-ring.tsx](file:///Users/grubby/Desktop/quxueban-new/components/ui/progress-ring.tsx) | 环形进度条 |
| `MetricRing` | [metric-ring.tsx](file:///Users/grubby/Desktop/quxueban-new/components/ui/metric-ring.tsx) | 指标环形图 |
| `GaugeChart` | [gauge-chart.tsx](file:///Users/grubby/Desktop/quxueban-new/components/ui/gauge-chart.tsx) | 仪表盘图表 |
| `TrendChart` | [trend-chart.tsx](file:///Users/grubby/Desktop/quxueban-new/components/ui/trend-chart.tsx) | 趋势图（基于 recharts） |
| `Heatmap` | [heatmap.tsx](file:///Users/grubby/Desktop/quxueban-new/components/ui/heatmap.tsx) | 热力图 |
| `HeatmapCell` | [heatmap-cell.tsx](file:///Users/grubby/Desktop/quxueban-new/components/ui/heatmap-cell.tsx) | 热力图单元格 |
| `DataTable` | [data-table.tsx](file:///Users/grubby/Desktop/quxueban-new/components/ui/data-table.tsx) | 数据表格 |
| `TimelineNode` | [timeline-node.tsx](file:///Users/grubby/Desktop/quxueban-new/components/ui/timeline-node.tsx) | 时间线节点 |
| `CommandCard` | [command-card.tsx](file:///Users/grubby/Desktop/quxueban-new/components/ui/command-card.tsx) | 命令卡片 |

**Badge Props**:
```typescript
interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md' | 'lg';
}
```

**Avatar Props**:
```typescript
interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  shape?: 'circle' | 'square';
  color?: string;
}
```

**MetricCard Props**:
```typescript
interface MetricCardProps {
  metric: string | number;
  label: string;
  description?: string;
  trend?: number;
  trendDirection?: 'up' | 'down';
  icon?: React.ReactNode;
  className?: string;
}
```

**ProgressRing Props**:
```typescript
interface ProgressRingProps {
  value: number;
  max?: number;
  size?: number;
  thickness?: number;
  color?: string;
  bgColor?: string;
  label?: string;
  className?: string;
}
```

**TrendChart Props**:
```typescript
interface TrendChartProps {
  data: Array<{ label: string; value: number }>;
  width?: number;
  height?: number;
  color?: string;
  showGrid?: boolean;
  showDots?: boolean;
  className?: string;
}
```

**DataTable Props**:
```typescript
interface DataTableProps {
  columns: Array<{ key: string; label: string; render?: (value: any) => React.ReactNode }>;
  data: Record<string, any>[];
  pagination?: boolean;
  pageSize?: number;
  className?: string;
}
```

### 反馈组件

| 组件 | 文件 | 描述 |
|------|------|------|
| `Modal` | [modal.tsx](file:///Users/grubby/Desktop/quxueban-new/components/ui/modal.tsx) | 模态框 |
| `Toast` | [toast.tsx](file:///Users/grubby/Desktop/quxueban-new/components/ui/toast.tsx) | 提示消息 |
| `Alert` | [alert.tsx](file:///Users/grubby/Desktop/quxueban-new/components/ui/alert.tsx) | 警告提示 |
| `ConfirmDialog` | [confirm-dialog.tsx](file:///Users/grubby/Desktop/quxueban-new/components/ui/confirm-dialog.tsx) | 确认对话框 |
| `EmptyState` | [empty-state.tsx](file:///Users/grubby/Desktop/quxueban-new/components/ui/empty-state.tsx) | 空状态 |
| `ErrorState` | [error-state.tsx](file:///Users/grubby/Desktop/quxueban-new/components/ui/error-state.tsx) | 错误状态 |
| `Skeleton` | [skeleton.tsx](file:///Users/grubby/Desktop/quxueban-new/components/ui/skeleton.tsx) | 骨架屏 |
| `Spinner` | [spinner.tsx](file:///Users/grubby/Desktop/quxueban-new/components/ui/spinner.tsx) | 加载旋转器 |
| `Tooltip` | [tooltip.tsx](file:///Users/grubby/Desktop/quxueban-new/components/ui/tooltip.tsx) | 工具提示 |

**Modal Props**:
```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  children: React.ReactNode;
  showClose?: boolean;
  closeOnOverlay?: boolean;
  variant?: 'default' | 'primary' | 'danger';
}
```

**Toast Props**:
```typescript
interface ToastProps {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  description?: string;
  duration?: number;
  onClose?: (id: string) => void;
}
```

**Skeleton Props**:
```typescript
interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular' | 'card';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'shimmer' | 'none';
}
```

**Tooltip Props**:
```typescript
interface TooltipProps {
  content: React.ReactNode;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  children: React.ReactNode;
}
```

### 装饰组件

| 组件 | 文件 | 描述 |
|------|------|------|
| `Icon` | [icon.tsx](file:///Users/grubby/Desktop/quxueban-new/components/ui/icon.tsx) | 图标（Lucide 封装） |
| `Divider` | [divider.tsx](file:///Users/grubby/Desktop/quxueban-new/components/ui/divider.tsx) | 分割线 |
| `MotionSection` | [motion-section.tsx](file:///Users/grubby/Desktop/quxueban-new/components/ui/motion-section.tsx) | 带动画的区域容器 |

**Icon Props**:
```typescript
interface IconProps {
  name: IconName;  // Lucide 图标名
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}
```

---

## 2. 布局组件 (`components/layout/`)

| 组件 | 文件 | 描述 |
|------|------|------|
| `AppShell` | [app-shell.tsx](file:///Users/grubby/Desktop/quxueban-new/components/layout/app-shell.tsx) | 应用外壳（侧边栏+顶栏+内容区） |
| `PageContainer` | [page-container.tsx](file:///Users/grubby/Desktop/quxueban-new/components/layout/page-container.tsx) | 页面内容容器（宽度控制） |
| `PageHeader` | [page-header.tsx](file:///Users/grubby/Desktop/quxueban-new/components/layout/page-header.tsx) | 页面头部（标题+面包屑+操作） |
| `Section` | [section.tsx](file:///Users/grubby/Desktop/quxueban-new/components/layout/section.tsx) | 内容区域分组 |
| `ContentGrid` | [content-grid.tsx](file:///Users/grubby/Desktop/quxueban-new/components/layout/content-grid.tsx) | 响应式内容网格 |

**AppShell Props**:
```typescript
interface AppShellProps {
  children: React.ReactNode;
  navItems: NavItem[];    // 导航项列表
  logo?: React.ReactNode;  // Logo 区域
  title?: string;          // 侧边栏标题
  userMenu?: React.ReactNode; // 用户菜单
}

interface NavItem {
  href: string;
  icon: IconName;
  label: string;
}
```

**PageContainer Props**:
```typescript
interface PageContainerProps {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
}
```

**PageHeader Props**:
```typescript
interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
  className?: string;
}

interface BreadcrumbItem {
  label: string;
  href?: string;
}
```

---

## 3. 动画组件 (`components/motion/`)

基于 framer-motion 的动画封装。

| 组件 | 文件 | 描述 |
|------|------|------|
| `FadeIn` | [fade-in.tsx](file:///Users/grubby/Desktop/quxueban-new/components/motion/fade-in.tsx) | 淡入动画 |
| `SlideUp` | [slide-up.tsx](file:///Users/grubby/Desktop/quxueban-new/components/motion/slide-up.tsx) | 向上滑动动画 |
| `ScaleOnHover` | [scale-on-hover.tsx](file:///Users/grubby/Desktop/quxueban-new/components/motion/scale-on-hover.tsx) | 悬停缩放动画 |
| `StaggerContainer` | [stagger.tsx](file:///Users/grubby/Desktop/quxueban-new/components/motion/stagger.tsx) | 交错动画容器 |
| `StaggerItem` | [stagger.tsx](file:///Users/grubby/Desktop/quxueban-new/components/motion/stagger.tsx) | 交错动画子项 |
| `CountUp` | [count-up.tsx](file:///Users/grubby/Desktop/quxueban-new/components/motion/count-up.tsx) | 数字递增动画 |
| `ProgressBar` | [progress-bar.tsx](file:///Users/grubby/Desktop/quxueban-new/components/motion/progress-bar.tsx) | 带动画的进度条 |
| `useReducedMotion` | [use-reduced-motion.ts](file:///Users/grubby/Desktop/quxueban-new/components/motion/use-reduced-motion.ts) | 弱动画偏好 Hook |

**FadeIn Props**:
```typescript
interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
  as?: keyof JSX.IntrinsicElements;
}
```

**SlideUp Props**:
```typescript
interface SlideUpProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  distance?: number;
  className?: string;
  once?: boolean;
  as?: keyof JSX.IntrinsicElements;
}
```

**CountUp Props**:
```typescript
interface CountUpProps {
  value: number;
  start?: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}
```

**StaggerContainer Props**:
```typescript
interface StaggerContainerProps {
  children: React.ReactNode;
  stagger?: number;
  delayChildren?: number;
  duration?: number;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}
```

---

## 4. 仪表盘组件 (`components/dashboard/`)

| 组件 | 文件 | 描述 |
|------|------|------|
| `Sidebar` | [sidebar.tsx](file:///Users/grubby/Desktop/quxueban-new/components/dashboard/Sidebar.tsx) | 控制台侧边栏导航 |
| `Topbar` | [topbar.tsx](file:///Users/grubby/Desktop/quxueban-new/components/dashboard/Topbar.tsx) | 控制台顶部栏 |
| `MobileBottomNav` | [mobile-bottom-nav.tsx](file:///Users/grubby/Desktop/quxueban-new/components/dashboard/MobileBottomNav.tsx) | 移动端底部导航 |
| `TaskCard` | [task-card.tsx](file:///Users/grubby/Desktop/quxueban-new/components/dashboard/TaskCard.tsx) | 任务卡片 |
| `ChildAvatar` | [child-avatar.tsx](file:///Users/grubby/Desktop/quxueban-new/components/dashboard/ChildAvatar.tsx) | 孩子头像选择器 |
| `ChildModal` | [child-modal.tsx](file:///Users/grubby/Desktop/quxueban-new/components/dashboard/ChildModal.tsx) | 添加/编辑孩子弹窗 |
| `ChildEmptyState` | [child-empty-state.tsx](file:///Users/grubby/Desktop/quxueban-new/components/dashboard/ChildEmptyState.tsx) | 无孩子时的空状态引导 |
| `ChildrenContext` | [children-context.tsx](file:///Users/grubby/Desktop/quxueban-new/components/dashboard/ChildrenContext.tsx) | 孩子列表 Context Provider |
| `ProgressPanel` | [progress-panel.tsx](file:///Users/grubby/Desktop/quxueban-new/components/dashboard/ProgressPanel.tsx) | 进度概览面板 |
| `PlanRoadmap` | [plan-roadmap.tsx](file:///Users/grubby/Desktop/quxueban-new/components/dashboard/PlanRoadmap.tsx) | 升学路线图 |
| `MiddleSchoolMatrix` | [middle-school-matrix.tsx](file:///Users/grubby/Desktop/quxueban-new/components/dashboard/MiddleSchoolMatrix.tsx) | 初中择校矩阵 |
| `MiddleSchoolRoadmap` | [middle-school-roadmap.tsx](file:///Users/grubby/Desktop/quxueban-new/components/dashboard/MiddleSchoolRoadmap.tsx) | 初中升学路线图 |

---

## 5. 控制台组件 (`components/console/`)

### 5.1 核心组件 (`core/`)

| 组件 | 文件 | 描述 |
|------|------|------|
| `ConsolePageShell` | [console-page-shell.tsx](file:///Users/grubby/Desktop/quxueban-new/components/console/core/ConsolePageShell.tsx) | 控制台页面外壳 |
| `ConsoleHero` | [console-hero.tsx](file:///Users/grubby/Desktop/quxueban-new/components/console/core/ConsoleHero.tsx) | 控制台顶部英雄区 |
| `InsightRow` | [insight-row.tsx](file:///Users/grubby/Desktop/quxueban-new/components/console/core/InsightRow.tsx) | 数据洞察行 |
| `Section` | [section.tsx](file:///Users/grubby/Desktop/quxueban-new/components/console/core/Section.tsx) | 功能区域容器 |
| `ActionCard` | [action-card.tsx](file:///Users/grubby/Desktop/quxueban-new/components/console/core/ActionCard.tsx) | 操作卡片 |
| `SettingRow` | [setting-row.tsx](file:///Users/grubby/Desktop/quxueban-new/components/console/core/SettingRow.tsx) | 设置行 |
| `PlaceholderPage` | [placeholder-page.tsx](file:///Users/grubby/Desktop/quxueban-new/components/console/core/PlaceholderPage.tsx) | 占位页面 |
| `useConsoleSettings` | [use-console-settings.ts](file:///Users/grubby/Desktop/quxueban-new/components/console/core/useConsoleSettings.ts) | 控制台设置 Hook |

**ConsolePageShell Props**:
```typescript
interface ConsolePageShellProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}
```

**ConsoleHero Props**:
```typescript
interface ConsoleHeroProps {
  child: { name: string; grade: number; avatarUrl?: string; avatarColor?: string };
  completionRate: number;
  aiSuggestionsCount: number;
  onSwitchChild: () => void;
}
```

**InsightRow Props**:
```typescript
interface InsightRowProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  trend?: number;
  trendDirection?: 'up' | 'down';
  description?: string;
}
```

### 5.2 孩子管理模块 (`modules/child/`)

| 组件 | 文件 | 描述 |
|------|------|------|
| `ProfileInfoCard` | [profile-info-card.tsx](file:///Users/grubby/Desktop/quxueban-new/components/console/modules/child/ProfileInfoCard.tsx) | 孩子档案信息卡 |
| `CapabilityScoreCard` | [capability-score-card.tsx](file:///Users/grubby/Desktop/quxueban-new/components/console/modules/child/CapabilityScoreCard.tsx) | 能力评分卡 |
| `GoalForm` | [goal-form.tsx](file:///Users/grubby/Desktop/quxueban-new/components/console/modules/child/GoalForm.tsx) | 目标表单 |

### 5.3 首页概览模块 (`modules/home/`)

| 组件 | 文件 | 描述 |
|------|------|------|
| `TodayTasks` | [today-tasks.tsx](file:///Users/grubby/Desktop/quxueban-new/components/console/modules/home/TodayTasks.tsx) | 今日任务概览 |
| `TrendSummary` | [trend-summary.tsx](file:///Users/grubby/Desktop/quxueban-new/components/console/modules/home/TrendSummary.tsx) | 趋势总结 |
| `AiSuggestion` | [ai-suggestion.tsx](file:///Users/grubby/Desktop/quxueban-new/components/console/modules/home/AiSuggestion.tsx) | AI 建议卡片 |
| `AlertFeed` | [alert-feed.tsx](file:///Users/grubby/Desktop/quxueban-new/components/console/modules/home/AlertFeed.tsx) | 提醒信息流 |
| `QuickActions` | [quick-actions.tsx](file:///Users/grubby/Desktop/quxueban-new/components/console/modules/home/QuickActions.tsx) | 快捷操作区 |

---

## 6. 设置组件 (`components/settings/`)

| 组件 | 文件 | 描述 |
|------|------|------|
| `SettingsSection` | [settings-section.tsx](file:///Users/grubby/Desktop/quxueban-new/components/settings/SettingsSection.tsx) | 设置区域通用卡片 |
| `AccountSection` | [account-section.tsx](file:///Users/grubby/Desktop/quxueban-new/components/settings/AccountSection.tsx) | 账户设置 |
| `ChildrenSection` | [children-section.tsx](file:///Users/grubby/Desktop/quxueban-new/components/settings/ChildrenSection.tsx) | 孩子管理设置 |
| `FamilySection` | [family-section.tsx](file:///Users/grubby/Desktop/quxueban-new/components/settings/FamilySection.tsx) | 家庭管理设置 |
| `AiConfigSection` | [ai-config-section.tsx](file:///Users/grubby/Desktop/quxueban-new/components/settings/AiConfigSection.tsx) | AI 配置设置 |
| `AppearanceSection` | [appearance-section.tsx](file:///Users/grubby/Desktop/quxueban-new/components/settings/AppearanceSection.tsx) | 外观/主题设置 |
| `NotificationSection` | [notification-section.tsx](file:///Users/grubby/Desktop/quxueban-new/components/settings/NotificationSection.tsx) | 通知设置 |
| `CapabilitySection` | [capability-section.tsx](file:///Users/grubby/Desktop/quxueban-new/components/settings/CapabilitySection.tsx) | 能力体系设置 |
| `TaskLibrarySection` | [task-library-section.tsx](file:///Users/grubby/Desktop/quxueban-new/components/settings/TaskLibrarySection.tsx) | 任务库管理设置 |
| `DataPrivacySection` | [data-privacy-section.tsx](file:///Users/grubby/Desktop/quxueban-new/components/settings/DataPrivacySection.tsx) | 数据隐私设置 |
| `HelpSection` | [help-section.tsx](file:///Users/grubby/Desktop/quxueban-new/components/settings/HelpSection.tsx) | 帮助与反馈 |
| `WechatBindModal` | [wechat-bind-modal.tsx](file:///Users/grubby/Desktop/quxueban-new/components/settings/WechatBindModal.tsx) | 微信绑定弹窗 |

---

## 7. 周计划组件 (`components/weekly/`)

| 组件 | 文件 | 描述 |
|------|------|------|
| `WeeklyTaskList` | [weekly-task-list.tsx](file:///Users/grubby/Desktop/quxueban-new/components/weekly/WeeklyTaskList.tsx) | 周计划任务列表 |
| `WeeklyMatrix` | [weekly-matrix.tsx](file:///Users/grubby/Desktop/quxueban-new/components/weekly/WeeklyMatrix.tsx) | 周计划矩阵视图 |
| `WeeklyGoalTable` | [weekly-goal-table.tsx](file:///Users/grubby/Desktop/quxueban-new/components/weekly/WeeklyGoalTable.tsx) | 定量目标表格 |
| `WeeklyGoalsPanel` | [weekly-goals-panel.tsx](file:///Users/grubby/Desktop/quxueban-new/components/weekly/WeeklyGoalsPanel.tsx) | 定量目标面板 |
| `WeeklyTaskChecklistMatrix` | [weekly-task-checklist-matrix.tsx](file:///Users/grubby/Desktop/quxueban-new/components/weekly/WeeklyTaskChecklistMatrix.tsx) | 任务清单矩阵 |
| `GeneratePlanModal` | [generate-plan-modal.tsx](file:///Users/grubby/Desktop/quxueban-new/components/weekly/GeneratePlanModal.tsx) | 生成周计划弹窗 |
| `WeeklyReportExport` | [weekly-report-export.tsx](file:///Users/grubby/Desktop/quxueban-new/components/weekly/WeeklyReportExport.tsx) | 周报导出 |

---

## 8. 今日任务组件 (`components/today/`)

| 组件 | 文件 | 描述 |
|------|------|------|
| `TaskCompletionModal` | [task-completion-modal.tsx](file:///Users/grubby/Desktop/quxueban-new/components/today/TaskCompletionModal.tsx) | 任务打卡弹窗 |
| `DailyVictoryModal` | [daily-victory-modal.tsx](file:///Users/grubby/Desktop/quxueban-new/components/today/DailyVictoryModal.tsx) | 每日胜利弹窗 |

---

## 9. AI 组件 (`components/ai/`)

| 组件 | 文件 | 描述 |
|------|------|------|
| `TaskRationalityPanel` | [task-rationality-panel.tsx](file:///Users/grubby/Desktop/quxueban-new/components/ai/TaskRationalityPanel.tsx) | 任务合理性评估面板 |

---

## 10. 游戏化组件 (`components/gamification/`)

| 组件 | 文件 | 描述 |
|------|------|------|
| `BadgeShowcase` | [badge-showcase.tsx](file:///Users/grubby/Desktop/quxueban-new/components/gamification/BadgeShowcase.tsx) | 徽章展示组件 |

---

## 11. 学科组件 (`components/subjects/`)

| 组件 | 文件 | 描述 |
|------|------|------|
| `SubjectPlanConfigEditor` | [subject-plan-config-editor.tsx](file:///Users/grubby/Desktop/quxueban-new/components/subjects/SubjectPlanConfigEditor.tsx) | 学科计划配置编辑器 |
| `SubjectExamTimeline` | [subject-exam-timeline.tsx](file:///Users/grubby/Desktop/quxueban-new/components/subjects/SubjectExamTimeline.tsx) | 学科考试时间线 |
| `SubjectTrackMap` | [subject-track-map.tsx](file:///Users/grubby/Desktop/quxueban-new/components/subjects/SubjectTrackMap.tsx) | 学科路径追踪图 |

---

## 12. 营销/首页组件 (`components/home/` + `components/marketing/`)

| 组件 | 文件 | 描述 |
|------|------|------|
| `HeroV2` | [home/hero-v2.tsx](file:///Users/grubby/Desktop/quxueban-new/components/home/HeroV2.tsx) | 首页英雄区 |
| `PainPoints` | [home/pain-points.tsx](file:///Users/grubby/Desktop/quxueban-new/components/home/PainPoints.tsx) | 痛点展示 |
| `SolutionShowcase` | [home/solution-showcase.tsx](file:///Users/grubby/Desktop/quxueban-new/components/home/SolutionShowcase.tsx) | 解决方案展示 |
| `TrustProof` | [home/trust-proof.tsx](file:///Users/grubby/Desktop/quxueban-new/components/home/TrustProof.tsx) | 信任背书 |
| `FAQ` | [home/faq.tsx](file:///Users/grubby/Desktop/quxueban-new/components/home/FAQ.tsx) | 常见问题 |
| `FinalCTA` | [home/final-cta.tsx](file:///Users/grubby/Desktop/quxueban-new/components/home/FinalCTA.tsx) | 最终行动号召 |
| `MarketingHero` | [marketing/marketing-hero.tsx](file:///Users/grubby/Desktop/quxueban-new/components/marketing/MarketingHero.tsx) | 营销落地页英雄区 |
| `PageLayout` | [marketing/page-layout.tsx](file:///Users/grubby/Desktop/quxueban-new/components/marketing/PageLayout.tsx) | 营销落地页布局 |
| `DashboardVisual` | [marketing/dashboard-visual.tsx](file:///Users/grubby/Desktop/quxueban-new/components/marketing/DashboardVisual.tsx) | 仪表盘可视化展示 |
| `AIReportVisual` | [marketing/ai-report-visual.tsx](file:///Users/grubby/Desktop/quxueban-new/components/marketing/AIReportVisual.tsx) | AI 报告可视化展示 |
| `RouteMapVisual` | [marketing/route-map-visual.tsx](file:///Users/grubby/Desktop/quxueban-new/components/marketing/RouteMapVisual.tsx) | 路线图可视化展示 |
| `TimelineVisual` | [marketing/timeline-visual.tsx](file:///Users/grubby/Desktop/quxueban-new/components/marketing/TimelineVisual.tsx) | 时间线可视化展示 |

---

## 13. Provider 组件 (`components/providers/`)

| 组件 | 文件 | 描述 |
|------|------|------|
| `AuthProvider` | [auth-provider.tsx](file:///Users/grubby/Desktop/quxueban-new/components/providers/AuthProvider.tsx) | 认证状态 Provider |
| `QueryProvider` | [query-provider.tsx](file:///Users/grubby/Desktop/quxueban-new/components/providers/QueryProvider.tsx) | React Query Provider |
| `MotionProvider` | [motion-provider.tsx](file:///Users/grubby/Desktop/quxueban-new/components/providers/MotionProvider.tsx) | 动画配置 Provider |
| `SettingsApplier` | [settings-applier.tsx](file:///Users/grubby/Desktop/quxueban-new/components/providers/SettingsApplier.tsx) | 主题设置应用 Provider |
| `ToastProvider` | [toast-provider.tsx](file:///Users/grubby/Desktop/quxueban-new/components/providers/ToastProvider.tsx) | Toast 通知 Provider |

---

## 14. 其他页面级组件

| 组件 | 文件 | 描述 |
|------|------|------|
| `Navbar` | [navbar.tsx](file:///Users/grubby/Desktop/quxueban-new/components/Navbar.tsx) | 公用导航栏 |
| `Footer` | [footer.tsx](file:///Users/grubby/Desktop/quxueban-new/components/Footer.tsx) | 公用页脚 |
| `AISection` | [ai-section.tsx](file:///Users/grubby/Desktop/quxueban-new/components/AISection.tsx) | AI 功能展示区 |
| `FeatureCards` | [feature-cards.tsx](file:///Users/grubby/Desktop/quxueban-new/components/FeatureCards.tsx) | 功能卡片展示 |
| `StrategyMap` | [strategy-map.tsx](file:///Users/grubby/Desktop/quxueban-new/components/StrategyMap.tsx) | 策略地图 |

---

## 组件使用规范

1. **原子组件优先**：优先使用 `components/ui/` 下的原子组件构建页面，避免重复造轮子
2. **className 扩展**：所有组件均支持 `className` prop 扩展样式
3. **ref 转发**：表单控件等交互组件支持 `forwardRef` 以便表单库集成
4. **动画组件**：`components/motion/` 下的组件基于 framer-motion，使用 `once` 属性控制动画是否重复触发
5. **Provider 顺序**：`AuthProvider` → `QueryProvider` → `MotionProvider` → `ToastProvider` → `SettingsApplier`

---

> **相关文档**：
> - [设计系统文档](./design-system/)
> - [架构概览文档](./architecture-overview.md)