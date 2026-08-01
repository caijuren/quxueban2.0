import { z, ZodIssue, ZodSchema } from 'zod';

const hexColorRegex = /^#([0-9A-Fa-f]{3}){1,2}$/;
const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

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
  avatarUrl: z.string().url('头像链接格式不正确').nullable().optional(),
  targetSchool: z.string().max(100).nullable().optional(),
  currentSchool: z.string().max(100).nullable().optional(),
  birthday: z.string().datetime('生日格式不正确').nullable().optional(),
  notes: z.string().max(500).nullable().optional(),
  routeId: z.string().max(50).nullable().optional(),
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
  focus: z.string().min(1, '任务内容不能为空').max(200),
  duration: z.string().max(50).default('30分钟'),
  materials: z.array(z.string().max(100)).default([]),
  status: z.enum(['pending', 'done', 'skipped']).default('pending'),
  completedAt: z.string().datetime().optional(),
  note: z.string().max(500).optional(),
});

export const weeklyPlanCreateSchema = z.object({
  childId: z.string().min(1, '孩子 ID 不能为空'),
  weekId: z.string().min(1, '周 ID 不能为空'),
  tasks: z.array(weeklyTaskItemSchema).min(1, '任务列表不能为空'),
  publishedAt: z.string().datetime().nullable().optional(),
  reviewedAt: z.string().datetime().nullable().optional(),
  parentComment: z.string().max(1000).nullable().optional(),
});

export const weeklyPlanUpdateSchema = z.object({
  tasks: z.array(weeklyTaskItemSchema).optional(),
  publishedAt: z.string().datetime().nullable().optional(),
  reviewedAt: z.string().datetime().nullable().optional(),
  parentComment: z.string().max(1000).nullable().optional(),
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

export type ChildCreateInput = z.infer<typeof childCreateSchema>;
export type ChildUpdateInput = z.infer<typeof childUpdateSchema>;
export type TaskTemplateCreateInput = z.infer<typeof taskTemplateCreateSchema>;
export type TaskTemplateUpdateInput = z.infer<typeof taskTemplateUpdateSchema>;
export type CapabilityCreateInput = z.infer<typeof capabilityCreateSchema>;
export type CapabilityUpdateInput = z.infer<typeof capabilityUpdateSchema>;
export type WeeklyPlanCreateInput = z.infer<typeof weeklyPlanCreateSchema>;
export type WeeklyPlanUpdateInput = z.infer<typeof weeklyPlanUpdateSchema>;
export type UserRegisterInput = z.infer<typeof userRegisterSchema>;
export type PasswordChangeInput = z.infer<typeof passwordChangeSchema>;
export type AccountDeleteInput = z.infer<typeof accountDeleteSchema>;
export type UserSettingsUpdateInput = z.infer<typeof userSettingsUpdateSchema>;
export type AiTaskAssessmentInput = z.infer<typeof aiTaskAssessmentSchema>;

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
