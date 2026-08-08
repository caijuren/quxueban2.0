# 趣学伴 Design System v2.7 迭代路线图

> 版本：v2.7.0 ~ v2.7.5
> 目标：建立一套完整、统一、可扩展的设计系统，为后续浅色 SaaS 后台和家长端深色主题提供一致基础。
> 原则：**每个阶段先写规范文档，再写代码；每个小版本独立可发布。**

---

## 1. 背景与目标

### 1.1 当前问题

- 已有 Dark Premium Theme Token，但缺少浅色主题支持。
- 缺少统一的原子组件（Button、Input、Table、Badge 等），页面各自实现。
- 硬编码颜色较多：`app/` 目录 57 处，`components/` 目录 149 处。
- 缺少工程化约束，新增页面容易破坏设计风格。
- Admin 后台已有基础框架，但距离“顶尖 SaaS 后台”还有差距。

### 1.2 建设目标

1. 建立完整的 Design Token 体系，支持深色/浅色切换。
2. 建立原子、分子、布局三层组件库。
3. 统一 Admin 后台视觉和交互规范。
4. 清理硬编码样式，全部走 Token 或组件。
5. 建立工程化约束，确保设计系统可持续演进。

---

## 2. 版本规划总览

| 版本 | 主题 | 核心目标 | 主要交付物 | 预计周期 | 依赖 |
|---|---|---|---|---|---|
| **v2.7.0** | Foundation | Token 体系完善 + 工程化基础 | Token 规范文档、Light Theme Token、ESLint/Prettier 配置 | 1 周 | 无 |
| **v2.7.1** | Atoms | 原子组件库 | Button、Input、Select、Badge、Card、Avatar、Spinner、Skeleton 规范+实现 | 2 周 | v2.7.0 |
| **v2.7.2** | Molecules & Layouts | 分子与布局组件 | FormField、SearchInput、DataTable、PageHeader、AppShell 规范+实现 | 1.5 周 | v2.7.1 |
| **v2.7.3** | Admin Refactor | Admin 后台规范化 | Admin 页面用新组件重构、布局统一 | 1.5 周 | v2.7.2 |
| **v2.7.4** | Cleanup | 硬编码清理 | 清理 app/、components/ 中硬编码颜色/样式 | 1.5 周 | v2.7.1 |
| **v2.7.5** | Light Theme | 浅色主题上线 | Light Theme 正式启用、Admin 默认浅色、主题切换稳定 | 1 周 | v2.7.3, v2.7.4 |

**总周期：约 8.5 周**

---

## 3. 各阶段详细说明

### v2.7.0 Foundation — Token 与工程化基础

**目标**：让所有视觉属性可配置、可切换、可约束。

**怎么做**：
1. 扩展 `globals.css`，增加浅色主题 CSS 变量 `:root[data-theme='light']`。
2. 完善 Design Token：颜色、间距、圆角、阴影、字号、字重、动效、Z-index。
3. 更新 `tailwind.config.ts`，把所有 Token 映射成 Tailwind class。
4. 安装 `prettier-plugin-tailwindcss`，统一 className 排序。
5. 配置 ESLint 规则，禁止硬编码颜色（如 `#FF0000`、`bg-[#xxx]`）。
6. 扩展 `lib/settings.ts` 的主题切换逻辑，支持 `light` / `dark` / `system`。

**交付物**：
- `docs/design-system/v2.7.0-token-spec.md`
- `docs/design-system/v2.7.0-engineering-spec.md`
- 更新后的 `app/globals.css`
- 更新后的 `tailwind.config.ts`
- 更新后的 `.eslintrc.json`
- 更新后的 `package.json`（新增 prettier 插件）

**验收标准**：
- [ ] 新增 `data-theme='light'` 后，页面能正确显示浅色。
- [ ] 任意页面不再新增硬编码颜色（ESLint 拦截）。
- [ ] className 自动按 Tailwind 规范排序。
- [ ] Token 文档覆盖 100% 的视觉属性。

---

### v2.7.1 Atoms — 原子组件库

**目标**：建立最基础的 UI 积木，所有页面不再自己写按钮、输入框等。

**怎么做**：
1. 在 `components/ui/` 下创建以下原子组件：
   - `Button`：primary / secondary / ghost / danger / link，size: xs/sm/md/lg，loading/disabled 状态。
   - `Input`：text / password / email / search，with icon，error state。
   - `Textarea`：带字数统计、resize 控制。
   - `Select`：单选、多选、可搜索。
   - `Badge`：default / primary / secondary / success / warning / error。
   - `Card`：基础卡片，支持 header/footer/hover/active。
   - `Avatar`：图片/文字 fallback，size 分级。
   - `Spinner`：尺寸分级，可替换图标。
   - `Skeleton`：文本、圆形、矩形、组合骨架。
   - `Switch` / `Checkbox` / `Radio`：表单开关类。
   - `Tooltip`：基于现有组件升级。
   - `Divider`：水平/垂直。
2. 每个组件必须支持 `className` 扩展和 ref 转发。
3. 所有组件只使用 Design Token，不硬编码颜色。

**交付物**：
- `docs/design-system/v2.7.1-atom-components-spec.md`
- `components/ui/Button.tsx`
- `components/ui/Input.tsx`
- `components/ui/Select.tsx`
- `components/ui/Badge.tsx`
- `components/ui/Card.tsx`
- `components/ui/Avatar.tsx`
- `components/ui/Spinner.tsx`
- `components/ui/Skeleton.tsx`
- `components/ui/Switch.tsx`
- `components/ui/Checkbox.tsx`
- `components/ui/Radio.tsx`
- `components/ui/Tooltip.tsx`
- `components/ui/Divider.tsx`

**验收标准**：
- [ ] 所有原子组件在浅色和深色主题下都正常显示。
- [ ] 组件 props 有 TypeScript 类型定义。
- [ ] 每个组件有使用示例（写在规范文档里）。
- [ ] 不引入新的硬编码颜色。

---

### v2.7.2 Molecules & Layouts — 分子与布局组件

**目标**：用原子组件搭建更高层的复用模块和页面骨架。

**怎么做**：
1. 分子组件：
   - `FormField`：Label + Input/Select/Textarea + Error + Helper。
   - `SearchInput`：带搜索图标的输入框 + 清除按钮。
   - `StatCard`：统计数字卡片，带图标和趋势。
   - `DataTable`：表头、行、排序、分页、空状态、加载态。
   - `EmptyState`：升级现有组件，支持更多场景。
   - `ConfirmDialog`：确认对话框。
   - `Toast` / `Alert`：全局通知和页面内提示。
2. 布局组件：
   - `AppShell`：侧边栏 + 顶部 Header + 内容区。
   - `PageHeader`：标题 + 面包屑 + 操作按钮。
   - `PageContainer`：最大宽度、响应式内边距。
   - `ContentGrid`：卡片网格布局。
   - `Section`：带标题的内容区块。

**交付物**：
- `docs/design-system/v2.7.2-molecule-layout-spec.md`
- `components/ui/FormField.tsx`
- `components/ui/SearchInput.tsx`
- `components/ui/StatCard.tsx`
- `components/ui/DataTable.tsx`
- `components/ui/ConfirmDialog.tsx`
- `components/ui/Toast.tsx`
- `components/ui/Alert.tsx`
- `components/layout/AppShell.tsx`
- `components/layout/PageHeader.tsx`
- `components/layout/PageContainer.tsx`
- `components/layout/ContentGrid.tsx`
- `components/layout/Section.tsx`

**验收标准**：
- [ ] Admin 后台能用新布局组件拼出来。
- [ ] DataTable 支持排序、分页、空状态、加载态。
- [ ] FormField 的错误状态和辅助文字样式统一。

---

### v2.7.3 Admin Refactor — Admin 后台规范化

**目标**：把 Admin 后台做成 Design System 的第一个标杆应用。

**怎么做**：
1. 用 `AppShell`、`PageHeader`、`PageContainer` 重构 `app/admin/layout.tsx`。
2. 用 `StatCard`、`DataTable`、`SearchInput`、`Badge`、`Button` 重构：
   - `app/admin/page.tsx`（数据概览）
   - `app/admin/users/page.tsx`（用户管理）
   - `app/admin/ai-config/page.tsx`（AI 配置）
3. 统一空状态、加载态、错误态。
4. 调整信息密度，符合浅色 SaaS 后台规范。

**交付物**：
- `docs/design-system/v2.7.3-admin-refactor-spec.md`
- 重构后的 `app/admin/**` 页面
- Admin 后台设计规范（布局、表格、表单、操作区）

**验收标准**：
- [ ] Admin 三个页面全部使用新组件库。
- [ ] Admin 在浅色和深色主题下都正常。
- [ ] 移动端适配基本可用。
- [ ] 无硬编码颜色。

---

### v2.7.4 Cleanup — 硬编码清理

**目标**：把项目中分散的硬编码颜色/样式全部收敛到 Token 或组件。

**怎么做**：
1. 扫描 `app/` 和 `components/` 中的硬编码色值（目前 200+ 处）。
2. 分类处理：
   - 通用 UI 颜色 → 替换为 Design Token。
   - 图表/可视化颜色 → 纳入数据可视化 Token。
   - 营销页特殊效果 → 保留但归档到文档。
3. 清理不一致的圆角、阴影、字号用法。
4. 用新原子组件替换页面中重复实现的按钮、输入框、卡片等。

**交付物**：
- `docs/design-system/v2.7.4-cleanup-spec.md`
- 硬编码清理清单（Markdown 表格）
- 清理后的 `app/**` 和 `components/**` 文件

**验收标准**：
- [ ] `app/` 和 `components/` 中硬编码颜色减少 90% 以上。
- [ ] ESLint 不再报硬编码颜色错误。
- [ ] 视觉回归无明显差异（除 intended 调整外）。

---

### v2.7.5 Light Theme — 浅色主题上线

**目标**：正式启用浅色主题，Admin 后台默认浅色，家长端可选深色。

**怎么做**：
1. 完善 `data-theme='light'` 下的所有 Token。
2. 在 Admin 后台默认使用浅色主题。
3. 家长端/控制台保持深色主题，但支持用户切换。
4. 测试主题切换的流畅性（无闪烁）。
5. 更新 `AppearanceSection`，增加浅色选项。

**交付物**：
- `docs/design-system/v2.7.5-light-theme-spec.md`
- 更新后的浅色主题 CSS
- 更新后的主题切换逻辑
- 更新后的 `components/settings/AppearanceSection.tsx`

**验收标准**：
- [ ] Admin 后台默认浅色，视觉效果达到顶尖 SaaS 水准。
- [ ] 主题切换无闪烁、无布局错乱。
- [ ] 所有组件在浅色下正常显示。
- [ ] 小程序端不受 Web 端主题切换影响。

---

## 4. 工作原则

### 4.1 先写规范，后写代码

每个版本开始前，必须先完成对应的规范文档（`docs/design-system/v2.7.x-xxx-spec.md`）。规范文档必须包括：

- 目标与范围
- 设计原则
- API 设计（props、类型）
- 使用示例
- 验收标准
- 反模式（不要做什么）

### 4.2 小版本独立可发布

每个 v2.7.x 版本完成后，项目应该处于可运行、可构建状态。不允许一个阶段做完后项目 broken。

### 4.3 不破坏现有功能

- 家长端/控制台在 v2.7.5 之前保持现有深色主题。
- 小程序端不受 Web 端 Design System 改造影响。
- API 和数据库不需要改动。

### 4.4 文档即规范

所有视觉和交互决策必须落到文档。口头约定不算数。

---

## 5. 风险与应对

| 风险 | 影响 | 应对 |
|---|---|---|
| 阶段文档写得太细，耽误开发 | 中 | 文档求精不求全，核心 API 和示例必须有，边缘场景可后补。 |
| 硬编码清理影响现有页面视觉 | 中 | 按模块分批清理，每批完成后本地验证。 |
| 浅色主题某些组件适配遗漏 | 中 | 建立组件检查清单，逐个组件验收。 |
| 工程化规则过严导致开发变慢 | 低 | ESLint 规则先 warn 后 error，给团队适应期。 |
| 小程序端被误改 | 低 | `miniapp/` 目录不在 Tailwind 扫描范围内，但改全局样式时需注意。 |

---

## 6. 下一步行动

1. 确认本路线图版本号和阶段划分。
2. 开始编写 `docs/design-system/v2.7.0-token-spec.md`。
3. 进入 v2.7.0 代码实现。
