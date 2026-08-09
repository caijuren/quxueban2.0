# 核心业务流程文档

> 版本：v1.0 | 更新日期：2026-08-09

## 目录

1. [周计划流程](#1-周计划流程)
2. [家庭协作流程](#2-家庭协作流程)
3. [打卡与任务完成流程](#3-打卡与任务完成流程)
4. [AI 诊断流程](#4-ai-诊断流程)
5. [AI 日报总结流程](#5-ai-日报总结流程)
6. [AI 任务合理性评估流程](#6-ai-任务合理性评估流程)

---

## 1. 周计划流程

### 1.1 概述

周计划（WeeklyPlan）是系统的核心数据载体，以「周」为单位组织孩子的学习任务，支持自动生成、模板选择、手动编排三种创建方式，并支持发布、完成记录、AI 回顾等生命周期操作。

### 1.2 数据模型

```
WeeklyPlan {
  id          String      // 主键
  userId      String      // 创建者（家长）
  childId     String      // 关联孩子
  weekId      String      // 周标识，格式: "2026-W32"
  tasks       JSON        // WeeklyTaskItem[] 任务列表
  goals       JSON?       // 定量目标列表
  publishedAt DateTime?   // 发布时间
  reviewedAt  DateTime?   // 回顾时间
  parentComment String?   // 家长评语
  aiSummary    String?    // AI 周回顾
  aiSummaryGeneratedAt DateTime? // AI 回顾生成时间
}
```

任务项 `WeeklyTaskItem` 包含：
- `id`: 唯一标识
- `category`: 分类（school/reading/sport/interest/ability/other）
- `subjectId`: 学科（chinese/math/english）
- `source`: 来源（auto/library/manual）
- `day`: 星期（周一至周日）
- `focus`: 任务标题
- `duration`: 时长描述（如 "30分钟"）
- `materials`: 所需材料
- `status`: 状态（pending/done/skipped）
- `alignment`: 对齐度评分
- `completionRecords`: 完成记录列表
- `templateId`: 关联模板 ID（library 来源时）

### 1.3 创建流程

#### 方式一：自动生成（基于学科）

```
[用户选择孩子] → [调用 generateWeeklyPlan()]
  → 根据年级获取各学科模板（语文/数学/英语）
  → 计算任务对齐度（computeTaskAlignment）
  → 生成 WeeklyTaskItem[]
  → 保存到数据库（upsert by childId + weekId）
```

- 入口：`/api/weekly-plans` POST
- 核心逻辑：[`generateWeeklyPlan()`](file:///Users/grubby/Desktop/quxueban-new/lib/weeklyTasks.ts#L146-L184)
- 学科模板按年级划分，各学科独立提供

#### 方式二：从任务库生成

```
[用户选择模板] → [调用 generateWeeklyPlanFromSelectedTemplates()]
  → 过滤 template.routeTags 匹配 child.routeId
  → 按 weeklySchedule 展开（daily/weekdays/weekends/custom）
  → auto 模板从周六开始轮询分配
  → 计算每日负荷（分钟数）
  → 保存到数据库
```

- 入口：`/api/weekly-plans` POST
- 核心逻辑：[`generateWeeklyPlanFromSelectedTemplates()`](file:///Users/grubby/Desktop/quxueban-new/lib/weeklyTasks.ts#L277-L333)

#### 方式三：从系统模板库生成

```
[用户选择"从模板库生成"] → [调用 generateWeeklyPlanFromLibrary()]
  → 过滤 SYSTEM_TASK_TEMPLATES 匹配 child.routeId
  → 按天轮询分配任务
  → 保存到数据库
```

- 入口：`/api/weekly-plans` POST
- 核心逻辑：[`generateWeeklyPlanFromLibrary()`](file:///Users/grubby/Desktop/quxueban-new/lib/weeklyTasks.ts#L186-L224)

### 1.4 发布流程

```
[用户确认周计划] → [设置 publishedAt = now]
  → 周计划对关联家庭可见
  → 小程序端可查看今日任务
```

- 未发布的周计划仅创建者可见
- 发布后数据不可编辑，但任务状态可更新

### 1.5 周回顾流程

```
[用户点击"生成 AI 周回顾"] → [POST /api/weekly-plans/:id/ai-summary]
  → 调用 generateAiReview()
  → 计算统计: 完成率、分类统计、每日统计
  → 基于规则生成文本总结
  → 保存 aiSummary + aiSummaryGeneratedAt
```

- 核心逻辑：[`generateAiReview()`](file:///Users/grubby/Desktop/quxueban-new/lib/weeklyTasks.ts#L540-L583)

### 1.6 关键 API

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/weekly-plans?childId=` | 获取周计划列表 |
| POST | `/api/weekly-plans` | 创建/更新周计划 |
| GET | `/api/weekly-plans/:id` | 获取周计划详情 |
| PUT | `/api/weekly-plans/:id` | 更新周计划 |
| POST | `/api/weekly-plans/:id/ai-summary` | 生成 AI 周回顾 |
| POST | `/api/weekly-plans/:id/tasks/:taskId/complete` | 完成任务（打卡） |

---

## 2. 家庭协作流程

### 2.1 概述

家庭（Family）功能允许多位家长/监护人共同管理孩子的学习计划。系统支持家庭创建、成员邀请、角色管理、权限控制等功能。

### 2.2 角色体系

| 角色 | 权限 | 说明 |
|------|------|------|
| OWNER | 全部权限 | 家庭创建者，不可退出 |
| ADMIN | 管理权限 | 可邀请成员、修改角色、管理孩子 |
| MEMBER | 编辑权限 | 可查看和管理孩子学习数据 |
| VIEWER | 只读权限 | 仅可查看孩子学习数据 |

### 2.3 家庭创建

```
[用户创建家庭] → [POST /api/family]
  → 创建 Family 记录
  → 创建 FamilyMember 记录（role: OWNER, status: ACTIVE）
  → 自动关联用户已有的孩子（child.familyId = familyId）
```

- 每个用户只能属于一个活动家庭
- 创建者自动成为 OWNER

### 2.4 邀请流程

```
[OWNER/ADMIN 发起邀请] → [POST /api/family/invites]
  → 校验身份权限
  → 归一化手机号（去空格、横线、+86/86 前缀）
  → 检查目标用户是否已注册
    ├─ 已注册 → 创建 FamilyMember（status: INVITED）
    └─ 未注册 → 创建 FamilyInvite token（7天有效期）
                  → 返回邀请链接
```

**已注册用户流程**：
```
[受邀用户登录] → [GET /api/family/invites?token=xxx]
  → 校验 token 有效性
  → 创建/更新 FamilyMember（status: ACTIVE）
  → 标记 token 已使用
```

**未注册用户流程**：
```
[受邀用户打开链接] → [注册页面]
  → 注册完成后自动接受邀请
  → 创建 FamilyMember（status: ACTIVE）
```

- 关键文件：[`POST /api/family/invites`](file:///Users/grubby/Desktop/quxueban-new/app/api/family/invites/route.ts#L10-L133)
- 邀请工具函数：[`lib/invite.ts`](file:///Users/grubby/Desktop/quxueban-new/lib/invite.ts)

### 2.5 权限控制

```
查看权限（canViewChild）：
  孩子创建者 → 总是有权限
  家庭成员 → 家庭中任意活动成员均可查看

管理权限（canManageChild）：
  孩子创建者 → 总是有权限
  OWNER/ADMIN → 可管理
  MEMBER/VIEWER → 无管理权限
```

- 核心实现：[`canViewChild()`](file:///Users/grubby/Desktop/quxueban-new/lib/family.ts#L70-L86) / [`canManageChild()`](file:///Users/grubby/Desktop/quxueban-new/lib/family.ts#L51-L68)

### 2.6 成员管理

| 操作 | API | 说明 |
|------|-----|------|
| 获取成员列表 | GET `/api/family/members` | 返回所有家庭成员 |
| 修改角色 | PUT `/api/family/members/:id` | OWNER/ADMIN 可操作 |
| 移除成员 | DELETE `/api/family/members/:id` | OWNER/ADMIN 可操作，不可移除 OWNER |
| 退出家庭 | POST `/api/family/leave` | OWNER 不可退出 |

### 2.7 代打卡权限

小程序端代打卡功能需同时查询：
1. 用户自己创建的孩子
2. 家庭中可管理的孩子（OWNER/ADMIN 角色）

---

## 3. 打卡与任务完成流程

### 3.1 概述

打卡（Task Completion）是系统的核心执行环节，家长或孩子通过 Web 端或小程序记录任务完成情况，支持图片、录音等多种证据形式。

### 3.2 数据模型

```
TaskCompletionRecord {
  id                   String    // 唯一标识
  date                 String    // 完成日期 "YYYY-MM-DD"
  status               string    // done / skipped / partial
  progress             number?   // 进度百分比 0-100
  actualDurationMinutes number?  // 实际耗时
  quality              string?   // 质量评估
  note                 string?   // 家长备注
  imageUrls            string[]? // 图片证据
  audioUrls            string[]? // 录音证据
  audioTranscript      string?   // 语音转文字
  capabilityProgress   Record<string, number>? // 能力进度
  quantityIncrement    number?   // 定量增量
  checklistProgress    Record<string, boolean>? // 检查项
  metadata             Record<string, any>?    // 结构化元数据（如：bookTitle, pageStart, pageEnd）
  createdAt            string
  updatedAt            string
}
```

### 3.3 Web 端打卡流程

```
[用户点击任务"完成"] → [打开 TaskCompletionModal]
  → 填写完成信息（状态、进度、耗时、备注）
  → 上传图片/录音
  → 提交 → [POST /api/weekly-plans/:id/tasks/:taskId/complete]
    → 校验：用户认证、孩子权限（canManageChild）
    → 创建 TaskCompletionRecord
    → 更新任务状态（status、completedAt）
    → 保存 completionRecords 到 tasks JSON
    → 触发游戏化徽章检查（checkAndAwardBadges）
    → 返回更新后的周计划
```

### 3.4 小程序端打卡流程

```
[用户进入今日任务] → [加载任务列表]
  → 获取孩子周计划
  → 筛选当天任务

[用户点击"打卡"] → [打开打卡表单]
  → 填写完成数据
  → 拍照/选择图片（wx.compressImage 压缩）
  → 录音（绑定 touchend + touchcancel 事件）
  → 提交 → [POST /api/miniapp/tasks/:taskId/complete]
    → 上传图片/音频文件到服务器
    → 创建 TaskCompletionRecord
    → 更新任务状态
```

**录音说明**：
- 录音格式：`audio/x-m4a`
- 按钮和提示层同时绑定 `touchend` 和 `touchcancel` 事件，确保松手即停
- 录音文件上传后需返回绝对 URL

### 3.5 重复打卡处理

```
[同一任务同一天多次打卡]
  → 查找已有 completionRecords 中同 date 的记录
  → 如果存在：覆盖更新（保留 id 和 createdAt）
  → 如果不存在：追加新记录
```

- 实现位置：[`complete/route.ts`](file:///Users/grubby/Desktop/quxueban-new/app/api/weekly-plans/%5Bid%5D/tasks/%5BtaskId%5D/complete/route.ts#L78-L88)

### 3.6 游戏化触发

当任务状态设为 `done` 时，自动触发：
```
[checkAndAwardBadges(childId, userId)]
  → 获取游戏化上下文（getGamificationContext）
  → 检查徽章达成条件
  → 颁发新徽章
```

- 游戏化失败不影响打卡主流程（try/catch 包裹）

---

## 4. AI 诊断流程

### 4.1 概述

AI 诊断为孩子的升学规划提供结构化分析报告，基于孩子的年级、目标学校、已选路线等信息，结合大语言模型生成包含总体评分、学科健康度、风险提示、行动建议和月度聚焦的诊断报告。

### 4.2 数据流

```
[用户触发诊断] → [POST /api/ai/diagnosis]
  → 获取用户 Session
  → 查询 child 信息及关联 plans
  → 获取 AI 配置（getEnabledAiConfig）
    → 检查 apiKey 是否配置
    → 检查 isEnabled 是否启用
  → 调用 generateDiagnosis(input, config)
    → 构建 System Prompt（升学规划专家角色）
    → 构建 User Prompt（含孩子信息、路线信息、学科标准节奏）
    → 调用 LLM API（DeepSeek/OpenAI）
    → 解析 JSON 响应
  → 返回 DiagnosisResult

[LLM 调用失败时]
  → 降级为 getFallbackDiagnosis(input)
  → 返回默认诊断结果 + _fallback 标记
```

### 4.3 诊断报告结构

```typescript
interface DiagnosisResult {
  overallScore: number;        // 总体评分 0-100
  summary: string;             // 一句话总结
  routeMatch: {                // 路线匹配度
    score: number;
    level: string;
    reason: string;
  };
  subjectHealth: SubjectHealth[];  // 各学科健康度
  risks: RiskItem[];           // 风险提示（high/medium/low）
  suggestions: SuggestionItem[];   // 行动建议（must/should/optional）
  monthlyFocus: MonthlyFocusItem[]; // 本月重点
}
```

### 4.4 关键实现

- System Prompt：定义 AI 为"趣学伴 AI 升学规划专家"，熟悉上海升学路径
- Temperature：0.6（平衡准确性与创造性）
- Response Format：强制 JSON 格式
- 降级策略：LLM 调用失败时返回基于规则的默认诊断

### 4.5 前置条件

- 用户需在系统设置中配置 AI API Key（DeepSeek/OpenAI）
- AI 功能需在设置中启用
- 孩子需填写年级、路线等基础信息

---

## 5. AI 日报总结流程

### 5.1 概述

每日学习任务完成后，系统自动（或手动）生成当日学习总结，包含完成情况、亮点分析和改进建议。优先使用 LLM 生成，LLM 不可用时降级为规则引擎。

### 5.2 数据流

```
[触发日报总结] → [generateDailySummary(input)]
  → 构建 System Prompt + User Prompt
  → 调用 LLM API（callLLM）
    → 成功 → 返回 LLM 生成的总结
    → 失败 → 降级为规则引擎（buildRuleSummary）
  → 返回 DailySummaryResult { summary, source: 'llm' | 'rule' }
```

### 5.3 LLM 模式

- Temperature：0.7
- Max Tokens：300
- 视角：第一人称「我」，像家庭教育顾问
- 格式：120 字以内，先总述，再挑 1-2 个重点展开，最后给具体建议

### 5.4 规则引擎模式

当 LLM 不可用时，根据以下规则生成：

| 完成率 | 开场白 |
|--------|--------|
| ≥ 90% | "今天完成得相当漂亮……" |
| ≥ 70% | "今天整体推进不错……" |
| ≥ 40% | "今天完成了大概六七成……" |
| < 40% | "今天完成度不太理想……" |

附加规则：
- 有未完成任务 → 建议优先启动
- 部分完成的任务 → 建议明天收尾
- 实际时间 > 180 分钟 → 提醒休息
- 实际时间 < 30 分钟 → 建议固定学习启动时间
- 家长备注中包含关键词（不会/不懂/错/很棒等）→ 在总结中体现

### 5.5 关键实现

- 核心文件：[`dailySummary.ts`](file:///Users/grubby/Desktop/quxueban-new/lib/ai/dailySummary.ts)
- LLM 调用失败时静默降级，不打断用户流程

---

## 6. AI 任务合理性评估流程

### 6.1 概述

在创建或编辑任务时，系统自动评估任务的合理性，从路线匹配、能力关联、负荷、难度、冗余、里程碑等多个维度给出评分和建议。

### 6.2 评估维度

| 维度 | 权重 | 说明 |
|------|------|------|
| routeFit | 25% | 路线匹配度：任务是否与孩子当前升学路线一致 |
| capabilityRelevance | 20% | 能力关联度：任务是否关联路线核心能力 |
| loadRationality | 25% | 负荷合理性：单日任务量是否在合理范围内 |
| difficultyRationality | 10% | 难度合理性：任务难度是否与孩子阶段匹配 |
| redundancy | 10% | 冗余检测：是否与已有任务重复 |
| milestoneProgress | 10% | 里程碑进度：里程碑任务是否合理 |

### 6.3 评估结果

```typescript
interface TaskRationalityAssessment {
  overallScore: number;          // 综合评分 0-100
  verdict: 'good' | 'caution' | 'risk';  // 评估结论
  summary: string;               // 一句话总结
  dimensions: RationalityDimension[];     // 各维度详情
  suggestions: string[];         // 改进建议
}
```

### 6.4 关键规则

**路线匹配度**：
- 任务 routeTags 为空 → 通用任务，基础分 70
- 任务 routeTags 匹配孩子 routeId → 95 分
- 任务 routeTags 不匹配 → 25 分（risk）

**负荷合理性**：
- 单日建议上限：120 分钟
- 超过 120 分钟 → caution
- 超过 156 分钟（上限 130%）→ risk

**冗余检测**：
- 使用文本相似度算法（字符集合交集 / 并集）
- 相似度 ≥ 0.7 判定为重复

### 6.5 使用场景

- 创建任务时实时评估（UI 中展示 `TaskRationalityPanel`）
- 批量评估已有任务（`batchAssessTaskRationality`）
- 作为任务库模板的辅助筛选条件

---

## 流程关系图

```
                   ┌─────────────────────────────────┐
                   │         家庭管理 (Family)         │
                   │  创建 → 邀请成员 → 角色管理 → 权限  │
                   └─────────────┬───────────────────┘
                                 │
                   ┌─────────────▼───────────────────┐
                   │         孩子管理 (Child)          │
                   │   创建 → 信息 → 路线 → 目标学校    │
                   └─────────────┬───────────────────┘
                                 │
                   ┌─────────────▼───────────────────┐
                   │         周计划 (WeeklyPlan)       │
                   │  自动生成 / 模板选择 / 手动编排     │
                   │      发布 → 执行 → 回顾           │
                   └─────────────┬───────────────────┘
                                 │
              ┌──────────────────┼──────────────────┐
              ▼                  ▼                  ▼
    ┌─────────────────┐ ┌──────────────┐ ┌──────────────────┐
    │  打卡 (Complete)  │ │ AI 诊断      │ │ AI 日报总结       │
    │  图片/录音/备注   │ │ 升学规划分析  │ │ 每日学习总结      │
    │  游戏化徽章      │ │ 风险/建议    │ │ LLM / 规则降级   │
    └─────────────────┘ └──────────────┘ └──────────────────┘
```

---

> **相关文档**：
> - [API 参考文档](./api-reference.md)
> - [数据模型文档](./data-model.md)
> - [架构概览文档](./architecture-overview.md)