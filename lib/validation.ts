import { z, ZodIssue, ZodSchema } from 'zod';

const hexColorRegex = /^#([0-9A-Fa-f]{3}){1,2}$/;
const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
const uploadPathRegex = /^\/(api\/)?uploads\/avatars\//;
const dataImageRegex = /^data:image\/[a-zA-Z0-9+]+;base64,/;
const emojiRegex = /^\p{Emoji_Presentation}+$/u;

export const taskCategorySchema = z.enum([
  'school',
  'reading',
  'sport',
  'interest',
  'ability',
  'other',
]);

export const taskTypeSchema = z.enum([
  'daily',
  'milestone',
  'remedial',
  'sprint',
  'diagnostic',
]);

export const taskFrequencySchema = z.enum([
  'once',
  'daily',
  'weekly',
  'custom',
]);

export const taskWeeklyScheduleSchema = z.enum([
  'auto',
  'daily',
  'weekdays',
  'weekends',
  'custom',
]);

export const dayOfWeekSchema = z.enum([
  '周一',
  '周二',
  '周三',
  '周四',
  '周五',
  '周六',
  '周日',
]);

export const timeSlotSchema = z.enum([
  'morning',
  'beforeNoon',
  'noon',
  'afternoon',
  'afterSchool',
  'evening',
  'night',
  'flexible',
]);

export const capabilityCategorySchema = z.enum([
  'chinese',
  'math',
  'english',
  'general',
  'exam',
  'admission',
]);

export const educationSystemSchema = z.enum(['six-three', 'five-four']);

export const childCreateSchema = z.object({
  name: z.string().min(1, '姓名不能为空').max(50, '姓名最多 50 字符'),
  grade: z.number().int().min(1, '年级最小为 1').max(12, '年级最大为 12'),
  educationSystem: educationSystemSchema.default('six-three'),
  avatarColor: z
    .string()
    .regex(hexColorRegex, '头像颜色必须是有效 HEX 色值')
    .optional(),
  avatarUrl: z
    .union([
      z.string().url('头像链接格式不正确'),
      z.string().regex(uploadPathRegex, '头像链接格式不正确'),
      z.string().regex(emojiRegex, '头像格式不正确'),
      z.string().regex(dataImageRegex, '头像格式不正确'),
    ])
    .nullable()
    .optional(),
  targetSchool: z.string().max(100).nullable().optional(),
  currentSchool: z.string().max(100).nullable().optional(),
  birthday: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, '生日格式不正确')
    .nullable()
    .optional(),
  notes: z.string().max(500).nullable().optional(),
  routeId: z.string().max(50).nullable().optional(),
  dingTalkWebhook: z.string().max(500).nullable().optional(),
  dingTalkSecret: z.string().max(200).nullable().optional(),
});

export const childUpdateSchema = childCreateSchema.partial();

export const capabilityLinkSchema = z.object({
  capabilityId: z.string().min(1, '能力 ID 不能为空'),
  weight: z.number().min(0).max(10).default(1),
  expectedProgress: z.number().min(0).max(100).default(0),
});

export const assessmentCriterionSchema = z.object({
  metric: z.string().min(1),
  target: z.string().min(1),
  selfReport: z.boolean().default(false),
});

export const customFrequencySchema = z.object({
  times: z.number().int().min(1),
  period: z.enum(['day', 'week', 'month']),
});

export const taskTemplateCreateSchema = z.object({
  childId: z.string().min(1, '孩子 ID 不能为空'),
  title: z.string().min(1, '任务标题不能为空').max(100, '任务标题最多 100 字符'),
  category: taskCategorySchema,
  duration: z.string().max(50).default('30分钟'),
  difficulty: z.enum(['easy', 'medium', 'hard']).nullable().optional(),
  materials: z.array(z.string().max(100)).default([]),
  description: z.string().max(2000).nullable().optional(),
  routeTags: z.array(z.string().max(50)).default([]),
  milestoneTag: z.string().max(100).nullable().optional(),
  semesterTag: z.string().max(100).nullable().optional(),
  tags: z.array(z.string().max(50)).default([]),
  isFavorite: z.boolean().default(false),
  taskType: taskTypeSchema.default('daily'),
  frequency: taskFrequencySchema.default('once'),
  customFrequency: customFrequencySchema.nullable().optional(),
  weeklySchedule: taskWeeklyScheduleSchema.default('auto'),
  customScheduleDays: z.array(dayOfWeekSchema).default([]),
  assessmentCriteria: z.array(assessmentCriterionSchema).default([]),
  capabilityLinks: z.array(capabilityLinkSchema).default([]),
});

export const taskTemplateUpdateSchema = taskTemplateCreateSchema.partial().extend({
  archive: z.boolean().optional(),
});

export const capabilityCreateSchema = z.object({
  name: z.string().min(1, '能力名称不能为空').max(100),
  category: capabilityCategorySchema,
  description: z.string().max(500).nullable().optional(),
});

export const capabilityUpdateSchema = capabilityCreateSchema.partial();

export const taskStatusSchema = z.enum([
  'pending',
  'in_progress',
  'partially_done',
  'done',
  'skipped',
  'rescheduled',
]);

export const taskCompletionQualitySchema = z.enum([
  'excellent',
  'good',
  'average',
  'needs_work',
]);

export const taskCapabilityProgressSchema = z.object({
  capabilityId: z.string().min(1),
  name: z.string().min(1),
  progressDelta: z.number().min(-100).max(100),
});

export const taskCompletionMetadataSchema = z.object({
  bookTitle: z.string().max(200).optional(),
  pageStart: z.number().int().min(0).optional(),
  pageEnd: z.number().int().min(0).optional(),
  workbookTitle: z.string().max(200).optional(),
  problemRange: z.string().max(100).optional(),
  wrongCount: z.number().int().min(0).optional(),
  quantityIncrement: z.number().min(0).optional(),
  quantityUnit: z.string().max(50).optional(),
});

export const taskCompletionRecordSchema = z.object({
  id: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, '日期格式不正确'),
  status: taskStatusSchema,
  progress: z.number().int().min(0).max(100).default(0),
  actualDurationMinutes: z.number().int().min(0).default(0),
  quality: taskCompletionQualitySchema.nullable().default(null),
  note: z.string().max(1000).default(''),
  imageUrls: z.array(z.string().url()).default([]),
  audioUrls: z.array(z.string().url()).default([]),
  audioTranscript: z.string().max(2000).optional(),
  capabilityProgress: z.array(taskCapabilityProgressSchema).default([]),
  quantityIncrement: z.number().int().min(0).default(0),
  checklistProgress: z.array(z.string().min(1)).default([]),
  metadata: taskCompletionMetadataSchema.optional(),
  dingtalkPushedAt: z.string().datetime().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

const todayStr = () => new Date().toISOString().split('T')[0];

export const taskCompletionInputSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, '日期格式不正确').default(todayStr),
  status: taskStatusSchema,
  progress: z.number().int().min(0).max(100).default(0),
  actualDurationMinutes: z.number().int().min(0).default(0),
  quality: taskCompletionQualitySchema.nullable().optional(),
  note: z.string().max(1000).default(''),
  imageUrls: z.array(z.string().url()).default([]),
  audioUrls: z.array(z.string().url()).default([]),
  audioTranscript: z.string().max(2000).optional(),
  capabilityProgress: z.array(taskCapabilityProgressSchema).default([]),
  quantityIncrement: z.number().int().min(0).default(0),
  checklistProgress: z.array(z.string()).default([]),
  metadata: taskCompletionMetadataSchema.optional(),
});

export const dingTalkPushSchema = z.object({
  childId: z.string().min(1, '孩子 ID 不能为空'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, '日期格式不正确'),
  taskIds: z.array(z.string()).optional(),
});

export const dailySummarySchema = z.object({
  childId: z.string().min(1, '孩子 ID 不能为空'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, '日期格式不正确').optional(),
  taskIds: z.array(z.string()).optional(),
});

export const weeklyGoalChecklistItemSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  text: z.string().min(1),
  done: z.boolean().default(false),
});

export const weeklyGoalSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1, '目标标题不能为空'),
  category: taskCategorySchema,
  quantityTarget: z.number().int().min(0).optional(),
  quantityDone: z.number().int().min(0).optional(),
  quantityUnit: z.string().max(20).optional(),
  checklist: z.array(weeklyGoalChecklistItemSchema).optional(),
});

export const weeklyTaskItemSchema = z.object({
  id: z.string().min(1),
  category: taskCategorySchema.default('other'),
  subjectId: z.enum(['chinese', 'math', 'english']).optional(),
  source: z.enum(['auto', 'library', 'manual']).default('manual'),
  templateId: z.string().optional(),
  alignment: z
    .enum(['ahead', 'ontrack', 'behind', 'optional', 'unrelated'])
    .optional(),
  day: dayOfWeekSchema,
  timeSlot: timeSlotSchema.optional(),
  focus: z.string().min(1, '任务内容不能为空').max(200),
  duration: z.string().max(50).default('30分钟'),
  materials: z.array(z.string().max(100)).default([]),
  status: taskStatusSchema.default('pending'),
  completedAt: z.string().datetime().optional(),
  note: z.string().max(500).optional(),
  goalId: z.string().optional(),
  completionRecords: z.array(taskCompletionRecordSchema).optional(),
});

export const weeklyPlanCreateSchema = z.object({
  childId: z.string().min(1, '孩子 ID 不能为空'),
  weekId: z.string().min(1, '周 ID 不能为空'),
  tasks: z.array(weeklyTaskItemSchema).min(1, '任务列表不能为空'),
  goals: z.array(weeklyGoalSchema).default([]),
  publishedAt: z.string().datetime().nullable().optional(),
  reviewedAt: z.string().datetime().nullable().optional(),
  parentComment: z.string().max(1000).nullable().optional(),
  aiSummary: z.string().max(5000).nullable().optional(),
  aiSummaryGeneratedAt: z.string().datetime().nullable().optional(),
});

export const weeklyPlanUpdateSchema = z.object({
  tasks: z.array(weeklyTaskItemSchema).optional(),
  goals: z.array(weeklyGoalSchema).optional(),
  publishedAt: z.string().datetime().nullable().optional(),
  reviewedAt: z.string().datetime().nullable().optional(),
  parentComment: z.string().max(1000).nullable().optional(),
  aiSummary: z.string().max(5000).nullable().optional(),
  aiSummaryGeneratedAt: z.string().datetime().nullable().optional(),
});

export const weeklyPlanTemplateCreateSchema = z.object({
  name: z.string().min(1, '模板名称不能为空').max(100, '模板名称最多 100 字符'),
  description: z.string().max(500).nullable().optional(),
  childId: z.string().nullable().optional(),
  tasks: z.array(weeklyTaskItemSchema).default([]),
  goals: z.array(weeklyGoalSchema).default([]),
  isDefault: z.boolean().default(false),
});

export const weeklyPlanTemplateUpdateSchema = weeklyPlanTemplateCreateSchema.partial();

export const weeklyPlanCopySchema = z.object({
  sourceWeekId: z.string().min(1, '源周 ID 不能为空'),
  targetWeekId: z.string().min(1, '目标周 ID 不能为空'),
});

export const userRegisterSchema = z.object({
  username: z
    .string()
    .min(3, '用户名至少 3 个字符')
    .max(20, '用户名最多 20 个字符')
    .regex(
      /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/,
      '用户名只能包含字母、数字、下划线和中文'
    ),
  password: z
    .string()
    .min(6, '密码至少 6 个字符')
    .max(50, '密码最多 50 个字符'),
  name: z.string().max(50).nullable().optional(),
  inviteToken: z.string().max(100).nullable().optional(),
});

export const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1, '请填写当前密码'),
  newPassword: z.string().min(6, '新密码至少 6 个字符').max(50),
});

export const accountDeleteSchema = z.object({
  password: z.string().min(1, '请输入密码以确认注销账号'),
});

export const userSettingsUpdateSchema = z.object({
  name: z.string().max(50).trim().nullable().optional(),
  avatarUrl: z.string().url().nullable().optional(),
  phone: z.string().max(20).trim().nullable().optional(),
  email: z.string().email('邮箱格式不正确').nullable().optional(),
  theme: z.enum(['dark-tech', 'rose-pink']).optional(),
  fontSize: z.enum(['normal', 'large', 'xlarge']).optional(),
  density: z.enum(['comfortable', 'compact']).optional(),
  reducedMotion: z.boolean().optional(),
  defaultLandingPage: z.enum(['dashboard', 'alerts', 'weekly']).optional(),
  defaultChildMode: z.enum(['last', 'ask']).optional(),
  reminderTime: z.string().regex(timeRegex).optional(),
  doNotDisturb: z.boolean().optional(),
  doNotDisturbStart: z.string().regex(timeRegex).nullable().optional(),
  doNotDisturbEnd: z.string().regex(timeRegex).nullable().optional(),
  notificationPrefs: z.record(z.string(), z.boolean()).optional(),
});

export const aiTaskAssessmentSchema = z.object({
  childId: z.string().min(1, '孩子 ID 不能为空'),
  task: z.object({
    title: z.string().min(1, '任务标题不能为空'),
    category: taskCategorySchema,
    difficulty: z.enum(['easy', 'medium', 'hard']).nullable().optional(),
    duration: z.string().min(1, '时长不能为空'),
    taskType: taskTypeSchema.optional(),
    frequency: taskFrequencySchema.optional(),
    routeTags: z.array(z.string()).optional(),
    milestoneTag: z.string().nullable().optional(),
    capabilityLinks: z
      .array(
        z.object({
          capabilityName: z.string().optional(),
          weight: z.number().optional(),
        })
      )
      .optional(),
  }),
  context: z
    .object({
      existingTasks: z.array(weeklyTaskItemSchema).optional(),
      existingTemplates: z.array(z.record(z.string(), z.any())).optional(),
      capabilities: z.array(z.record(z.string(), z.any())).optional(),
      selectedDay: z.string().optional(),
    })
    .optional(),
});

export const subjectIdSchema = z.enum(['chinese', 'math', 'english']);

export const subjectPlanTrackSchema = z.object({
  id: z.string().min(1, '线路 ID 不能为空').max(50),
  name: z.string().min(1, '线路名称不能为空').max(50),
  color: z.string().regex(hexColorRegex, '颜色必须是有效 HEX 色值'),
  description: z.string().max(500).nullable().optional(),
});

export const subjectPlanTimeAxisItemSchema = z.object({
  label: z.string().min(1).max(50),
  position: z.number().min(0).max(100),
});

export const subjectPlanNodeSchema = z.object({
  id: z.string().min(1).max(50),
  trackId: z.string().min(1, '所属线路 ID 不能为空'),
  label: z.string().min(1, '节点名称不能为空').max(50),
  position: z.number().min(0).max(100),
  time: z.string().max(50),
  detail: z.string().max(1000).nullable().optional(),
});

export const subjectPlanKeyAchievementSchema = z.object({
  time: z.string().min(1).max(50),
  keyword: z.string().min(1).max(100),
  detail: z.string().max(2000).nullable().optional(),
  milestones: z.array(z.string().max(100)).optional(),
});

export const subjectPlanExamEventSchema = z.object({
  id: z.string().min(1).max(50),
  name: z.string().min(1).max(100),
  target: z.string().max(100).nullable().optional(),
  date: z.string().max(50).nullable().optional(),
  month: z.string().max(100).nullable().optional(),
  registerBefore: z.string().max(200).nullable().optional(),
  notes: z.string().max(2000).nullable().optional(),
});

export const subjectPlanConfigDataSchema = z.object({
  tracks: z.array(subjectPlanTrackSchema).min(1, '至少配置一条线路'),
  timeAxis: z.array(subjectPlanTimeAxisItemSchema).min(1, '时间轴不能为空'),
  nodes: z.array(subjectPlanNodeSchema),
  keyAchievements: z.record(z.string(), z.array(subjectPlanKeyAchievementSchema)),
  examTimeline: z.array(subjectPlanExamEventSchema),
});

export const subjectPlanUpdateSchema = subjectPlanConfigDataSchema;

export const learningGoalCreateSchema = z.object({
  subject: z.enum(['chinese', 'math', 'english', 'overall']),
  goalType: z.enum(['reading_count', 'ability_score', 'habit', 'custom']),
  metricType: z.enum(['count', 'score', 'duration', 'habit']),
  title: z.string().min(1, '目标标题不能为空').max(100, '目标标题最多 100 字符'),
  target: z.string().max(100).nullable().optional(),
  period: z.string().min(1, '目标周期不能为空').max(50),
  source: z.enum(['parent', 'ai', 'system', 'teacher']).default('parent'),
  status: z.enum(['active', 'completed', 'paused']).default('active'),
});

export const learningGoalUpdateSchema = learningGoalCreateSchema.partial().extend({
  status: z.enum(['active', 'completed', 'paused']).optional(),
});

export const familyCreateSchema = z.object({
  name: z.string().min(1, '家庭名称不能为空').max(50, '家庭名称最多 50 字符'),
});

export const familyInviteSchema = z.object({
  username: z.string().min(1, '请输入用户名').max(50, '用户名最多 50 字符'),
  role: z.enum(['ADMIN', 'MEMBER', 'VIEWER']),
});

export const familyMemberUpdateSchema = z.object({
  role: z.enum(['ADMIN', 'MEMBER', 'VIEWER']).optional(),
  status: z.enum(['INVITED', 'ACTIVE', 'DISABLED']).optional(),
});

export const familyInviteCreateSchema = z.object({
  role: z.enum(['ADMIN', 'MEMBER', 'VIEWER']),
  email: z.string().email('邮箱格式不正确').max(100).nullable().optional(),
  phone: z
    .string()
    .max(20)
    .transform((val) => val.replace(/[\s-]/g, '').replace(/^\+?86/, ''))
    .refine((val) => /^1[3-9]\d{9}$/.test(val), {
      message: '手机号格式不正确',
    })
    .nullable()
    .optional(),
}).refine((data) => data.email || data.phone, {
  message: '邮箱或手机号至少填写一个',
});

export const chatSessionCreateSchema = z.object({
  title: z.string().max(100, '标题最多 100 字符').optional(),
  childId: z.string().optional(),
});

export const chatMessageCreateSchema = z.object({
  content: z.string().min(1, '消息不能为空').max(10000, '消息过长'),
});

export const parentLogCreateSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, '日期格式不正确'),
  content: z.string().min(1, '内容不能为空').max(5000, '内容过长'),
  imageUrls: z.array(z.string().url()).default([]),
  tags: z.array(z.string().max(20)).default([]),
});

export const parentLogUpdateSchema = parentLogCreateSchema.partial();

export type ChildCreateInput = z.infer<typeof childCreateSchema>;
export type ChildUpdateInput = z.infer<typeof childUpdateSchema>;
export type TaskTemplateCreateInput = z.infer<typeof taskTemplateCreateSchema>;
export type TaskTemplateUpdateInput = z.infer<typeof taskTemplateUpdateSchema>;
export type CapabilityCreateInput = z.infer<typeof capabilityCreateSchema>;
export type CapabilityUpdateInput = z.infer<typeof capabilityUpdateSchema>;
export type WeeklyPlanCreateInput = z.infer<typeof weeklyPlanCreateSchema>;
export type WeeklyPlanUpdateInput = z.infer<typeof weeklyPlanUpdateSchema>;
export type WeeklyPlanTemplateCreateInput = z.infer<typeof weeklyPlanTemplateCreateSchema>;
export type WeeklyPlanTemplateUpdateInput = z.infer<typeof weeklyPlanTemplateUpdateSchema>;
export type WeeklyPlanCopyInput = z.infer<typeof weeklyPlanCopySchema>;
export type UserRegisterInput = z.infer<typeof userRegisterSchema>;
export type PasswordChangeInput = z.infer<typeof passwordChangeSchema>;
export type AccountDeleteInput = z.infer<typeof accountDeleteSchema>;
export type UserSettingsUpdateInput = z.infer<typeof userSettingsUpdateSchema>;
export type TaskCompletionInput = z.infer<typeof taskCompletionInputSchema>;
export type DingTalkPushInput = z.infer<typeof dingTalkPushSchema>;
export type DailySummaryInput = z.infer<typeof dailySummarySchema>;
export type LearningGoalCreateInput = z.infer<typeof learningGoalCreateSchema>;
export type LearningGoalUpdateInput = z.infer<typeof learningGoalUpdateSchema>;
export type AiTaskAssessmentInput = z.infer<typeof aiTaskAssessmentSchema>;
export type SubjectPlanUpdateInput = z.infer<typeof subjectPlanUpdateSchema>;
export type FamilyCreateInput = z.infer<typeof familyCreateSchema>;
export type FamilyInviteInput = z.infer<typeof familyInviteSchema>;
export type FamilyMemberUpdateInput = z.infer<typeof familyMemberUpdateSchema>;
export type FamilyInviteCreateInput = z.infer<typeof familyInviteCreateSchema>;
export type ChatSessionCreateInput = z.infer<typeof chatSessionCreateSchema>;
export type ChatMessageCreateInput = z.infer<typeof chatMessageCreateSchema>;
export type ParentLogCreateInput = z.infer<typeof parentLogCreateSchema>;
export type ParentLogUpdateInput = z.infer<typeof parentLogUpdateSchema>;

export interface ValidationError {
  error: string;
  issues: ZodIssue[];
}

export async function validateBody<T>(
  req: Request,
  schema: ZodSchema<T>
): Promise<{ success: true; data: T } | { success: false; response: Response }> {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  const result = schema.safeParse(body);
  if (!result.success) {
    return {
      success: false,
      response: new Response(
        JSON.stringify({
          error: '请求参数不正确',
          issues: result.error.issues,
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      ),
    };
  }

  return { success: true, data: result.data };
}
