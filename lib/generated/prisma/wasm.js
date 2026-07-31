
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.22.0
 * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
 */
Prisma.prismaVersion = {
  client: "5.22.0",
  engine: "605197351a3c8bdd595af2d2a9bc3025bca48ea2"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.NotFoundError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`NotFoundError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  username: 'username',
  passwordHash: 'passwordHash',
  name: 'name',
  role: 'role',
  avatarUrl: 'avatarUrl',
  phone: 'phone',
  email: 'email',
  wechatOpenId: 'wechatOpenId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.UserSettingScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  theme: 'theme',
  fontSize: 'fontSize',
  density: 'density',
  reducedMotion: 'reducedMotion',
  defaultLandingPage: 'defaultLandingPage',
  defaultChildMode: 'defaultChildMode',
  notificationPrefs: 'notificationPrefs',
  reminderTime: 'reminderTime',
  doNotDisturb: 'doNotDisturb',
  doNotDisturbStart: 'doNotDisturbStart',
  doNotDisturbEnd: 'doNotDisturbEnd',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ChildScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  name: 'name',
  grade: 'grade',
  educationSystem: 'educationSystem',
  avatarColor: 'avatarColor',
  avatarUrl: 'avatarUrl',
  targetSchool: 'targetSchool',
  currentSchool: 'currentSchool',
  birthday: 'birthday',
  notes: 'notes',
  routeId: 'routeId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.PlanScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  childId: 'childId',
  name: 'name',
  type: 'type',
  status: 'status',
  stage: 'stage',
  description: 'description',
  requirements: 'requirements',
  milestones: 'milestones',
  targets: 'targets',
  probability: 'probability',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.TaskTemplateScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  title: 'title',
  category: 'category',
  duration: 'duration',
  difficulty: 'difficulty',
  materials: 'materials',
  description: 'description',
  routeTags: 'routeTags',
  milestoneTag: 'milestoneTag',
  semesterTag: 'semesterTag',
  tags: 'tags',
  source: 'source',
  isActive: 'isActive',
  archivedAt: 'archivedAt',
  useCount: 'useCount',
  lastUsedAt: 'lastUsedAt',
  taskType: 'taskType',
  frequency: 'frequency',
  customFrequency: 'customFrequency',
  assessmentCriteria: 'assessmentCriteria',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CapabilityScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  name: 'name',
  category: 'category',
  description: 'description',
  isSystem: 'isSystem',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.TaskCapabilityLinkScalarFieldEnum = {
  id: 'id',
  taskTemplateId: 'taskTemplateId',
  capabilityId: 'capabilityId',
  weight: 'weight',
  expectedProgress: 'expectedProgress'
};

exports.Prisma.WeeklyPlanScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  childId: 'childId',
  weekId: 'weekId',
  tasks: 'tasks',
  publishedAt: 'publishedAt',
  reviewedAt: 'reviewedAt',
  parentComment: 'parentComment',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.NotificationScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  title: 'title',
  content: 'content',
  readAt: 'readAt',
  createdAt: 'createdAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.JsonNullValueInput = {
  JsonNull: Prisma.JsonNull
};

exports.Prisma.NullableJsonNullValueInput = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};

exports.Prisma.JsonNullValueFilter = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
  AnyNull: Prisma.AnyNull
};
exports.UserRole = exports.$Enums.UserRole = {
  PARENT: 'PARENT',
  ADMIN: 'ADMIN'
};

exports.TaskCategory = exports.$Enums.TaskCategory = {
  SCHOOL: 'SCHOOL',
  READING: 'READING',
  SPORT: 'SPORT',
  INTEREST: 'INTEREST',
  ABILITY: 'ABILITY',
  OTHER: 'OTHER'
};

exports.TaskTemplateSource = exports.$Enums.TaskTemplateSource = {
  SYSTEM: 'SYSTEM',
  USER: 'USER'
};

exports.TaskType = exports.$Enums.TaskType = {
  DAILY: 'DAILY',
  MILESTONE: 'MILESTONE',
  REMEDIAL: 'REMEDIAL',
  SPRINT: 'SPRINT',
  DIAGNOSTIC: 'DIAGNOSTIC'
};

exports.TaskFrequency = exports.$Enums.TaskFrequency = {
  ONCE: 'ONCE',
  DAILY: 'DAILY',
  WEEKLY: 'WEEKLY',
  CUSTOM: 'CUSTOM'
};

exports.CapabilityCategory = exports.$Enums.CapabilityCategory = {
  CHINESE: 'CHINESE',
  MATH: 'MATH',
  ENGLISH: 'ENGLISH',
  GENERAL: 'GENERAL',
  EXAM: 'EXAM',
  ADMISSION: 'ADMISSION'
};

exports.Prisma.ModelName = {
  User: 'User',
  UserSetting: 'UserSetting',
  Child: 'Child',
  Plan: 'Plan',
  TaskTemplate: 'TaskTemplate',
  Capability: 'Capability',
  TaskCapabilityLink: 'TaskCapabilityLink',
  WeeklyPlan: 'WeeklyPlan',
  Notification: 'Notification'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
