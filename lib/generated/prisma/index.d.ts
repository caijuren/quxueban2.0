
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model UserSetting
 * 
 */
export type UserSetting = $Result.DefaultSelection<Prisma.$UserSettingPayload>
/**
 * Model Child
 * 
 */
export type Child = $Result.DefaultSelection<Prisma.$ChildPayload>
/**
 * Model Plan
 * 
 */
export type Plan = $Result.DefaultSelection<Prisma.$PlanPayload>
/**
 * Model TaskTemplate
 * 
 */
export type TaskTemplate = $Result.DefaultSelection<Prisma.$TaskTemplatePayload>
/**
 * Model Capability
 * 
 */
export type Capability = $Result.DefaultSelection<Prisma.$CapabilityPayload>
/**
 * Model TaskCapabilityLink
 * 
 */
export type TaskCapabilityLink = $Result.DefaultSelection<Prisma.$TaskCapabilityLinkPayload>
/**
 * Model WeeklyPlan
 * 
 */
export type WeeklyPlan = $Result.DefaultSelection<Prisma.$WeeklyPlanPayload>
/**
 * Model Notification
 * 
 */
export type Notification = $Result.DefaultSelection<Prisma.$NotificationPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const UserRole: {
  PARENT: 'PARENT',
  ADMIN: 'ADMIN'
};

export type UserRole = (typeof UserRole)[keyof typeof UserRole]


export const TaskCategory: {
  SCHOOL: 'SCHOOL',
  READING: 'READING',
  SPORT: 'SPORT',
  INTEREST: 'INTEREST',
  ABILITY: 'ABILITY',
  OTHER: 'OTHER'
};

export type TaskCategory = (typeof TaskCategory)[keyof typeof TaskCategory]


export const TaskTemplateSource: {
  SYSTEM: 'SYSTEM',
  USER: 'USER'
};

export type TaskTemplateSource = (typeof TaskTemplateSource)[keyof typeof TaskTemplateSource]


export const TaskType: {
  DAILY: 'DAILY',
  MILESTONE: 'MILESTONE',
  REMEDIAL: 'REMEDIAL',
  SPRINT: 'SPRINT',
  DIAGNOSTIC: 'DIAGNOSTIC'
};

export type TaskType = (typeof TaskType)[keyof typeof TaskType]


export const TaskFrequency: {
  ONCE: 'ONCE',
  DAILY: 'DAILY',
  WEEKLY: 'WEEKLY',
  CUSTOM: 'CUSTOM'
};

export type TaskFrequency = (typeof TaskFrequency)[keyof typeof TaskFrequency]


export const TaskWeeklySchedule: {
  AUTO: 'AUTO',
  DAILY: 'DAILY',
  WEEKDAYS: 'WEEKDAYS',
  WEEKENDS: 'WEEKENDS',
  CUSTOM: 'CUSTOM'
};

export type TaskWeeklySchedule = (typeof TaskWeeklySchedule)[keyof typeof TaskWeeklySchedule]


export const CapabilityCategory: {
  CHINESE: 'CHINESE',
  MATH: 'MATH',
  ENGLISH: 'ENGLISH',
  GENERAL: 'GENERAL',
  EXAM: 'EXAM',
  ADMISSION: 'ADMISSION'
};

export type CapabilityCategory = (typeof CapabilityCategory)[keyof typeof CapabilityCategory]

}

export type UserRole = $Enums.UserRole

export const UserRole: typeof $Enums.UserRole

export type TaskCategory = $Enums.TaskCategory

export const TaskCategory: typeof $Enums.TaskCategory

export type TaskTemplateSource = $Enums.TaskTemplateSource

export const TaskTemplateSource: typeof $Enums.TaskTemplateSource

export type TaskType = $Enums.TaskType

export const TaskType: typeof $Enums.TaskType

export type TaskFrequency = $Enums.TaskFrequency

export const TaskFrequency: typeof $Enums.TaskFrequency

export type TaskWeeklySchedule = $Enums.TaskWeeklySchedule

export const TaskWeeklySchedule: typeof $Enums.TaskWeeklySchedule

export type CapabilityCategory = $Enums.CapabilityCategory

export const CapabilityCategory: typeof $Enums.CapabilityCategory

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb, ExtArgs>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs>;

  /**
   * `prisma.userSetting`: Exposes CRUD operations for the **UserSetting** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more UserSettings
    * const userSettings = await prisma.userSetting.findMany()
    * ```
    */
  get userSetting(): Prisma.UserSettingDelegate<ExtArgs>;

  /**
   * `prisma.child`: Exposes CRUD operations for the **Child** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Children
    * const children = await prisma.child.findMany()
    * ```
    */
  get child(): Prisma.ChildDelegate<ExtArgs>;

  /**
   * `prisma.plan`: Exposes CRUD operations for the **Plan** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Plans
    * const plans = await prisma.plan.findMany()
    * ```
    */
  get plan(): Prisma.PlanDelegate<ExtArgs>;

  /**
   * `prisma.taskTemplate`: Exposes CRUD operations for the **TaskTemplate** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TaskTemplates
    * const taskTemplates = await prisma.taskTemplate.findMany()
    * ```
    */
  get taskTemplate(): Prisma.TaskTemplateDelegate<ExtArgs>;

  /**
   * `prisma.capability`: Exposes CRUD operations for the **Capability** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Capabilities
    * const capabilities = await prisma.capability.findMany()
    * ```
    */
  get capability(): Prisma.CapabilityDelegate<ExtArgs>;

  /**
   * `prisma.taskCapabilityLink`: Exposes CRUD operations for the **TaskCapabilityLink** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TaskCapabilityLinks
    * const taskCapabilityLinks = await prisma.taskCapabilityLink.findMany()
    * ```
    */
  get taskCapabilityLink(): Prisma.TaskCapabilityLinkDelegate<ExtArgs>;

  /**
   * `prisma.weeklyPlan`: Exposes CRUD operations for the **WeeklyPlan** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more WeeklyPlans
    * const weeklyPlans = await prisma.weeklyPlan.findMany()
    * ```
    */
  get weeklyPlan(): Prisma.WeeklyPlanDelegate<ExtArgs>;

  /**
   * `prisma.notification`: Exposes CRUD operations for the **Notification** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Notifications
    * const notifications = await prisma.notification.findMany()
    * ```
    */
  get notification(): Prisma.NotificationDelegate<ExtArgs>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError
  export import NotFoundError = runtime.NotFoundError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics 
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 5.22.0
   * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
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

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb extends $Utils.Fn<{extArgs: $Extensions.InternalArgs, clientOptions: PrismaClientOptions }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], this['params']['clientOptions']>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> = {
    meta: {
      modelProps: "user" | "userSetting" | "child" | "plan" | "taskTemplate" | "capability" | "taskCapabilityLink" | "weeklyPlan" | "notification"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      UserSetting: {
        payload: Prisma.$UserSettingPayload<ExtArgs>
        fields: Prisma.UserSettingFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserSettingFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserSettingPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserSettingFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserSettingPayload>
          }
          findFirst: {
            args: Prisma.UserSettingFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserSettingPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserSettingFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserSettingPayload>
          }
          findMany: {
            args: Prisma.UserSettingFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserSettingPayload>[]
          }
          create: {
            args: Prisma.UserSettingCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserSettingPayload>
          }
          createMany: {
            args: Prisma.UserSettingCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserSettingCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserSettingPayload>[]
          }
          delete: {
            args: Prisma.UserSettingDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserSettingPayload>
          }
          update: {
            args: Prisma.UserSettingUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserSettingPayload>
          }
          deleteMany: {
            args: Prisma.UserSettingDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserSettingUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.UserSettingUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserSettingPayload>
          }
          aggregate: {
            args: Prisma.UserSettingAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUserSetting>
          }
          groupBy: {
            args: Prisma.UserSettingGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserSettingGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserSettingCountArgs<ExtArgs>
            result: $Utils.Optional<UserSettingCountAggregateOutputType> | number
          }
        }
      }
      Child: {
        payload: Prisma.$ChildPayload<ExtArgs>
        fields: Prisma.ChildFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ChildFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChildPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ChildFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChildPayload>
          }
          findFirst: {
            args: Prisma.ChildFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChildPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ChildFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChildPayload>
          }
          findMany: {
            args: Prisma.ChildFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChildPayload>[]
          }
          create: {
            args: Prisma.ChildCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChildPayload>
          }
          createMany: {
            args: Prisma.ChildCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ChildCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChildPayload>[]
          }
          delete: {
            args: Prisma.ChildDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChildPayload>
          }
          update: {
            args: Prisma.ChildUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChildPayload>
          }
          deleteMany: {
            args: Prisma.ChildDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ChildUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ChildUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChildPayload>
          }
          aggregate: {
            args: Prisma.ChildAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateChild>
          }
          groupBy: {
            args: Prisma.ChildGroupByArgs<ExtArgs>
            result: $Utils.Optional<ChildGroupByOutputType>[]
          }
          count: {
            args: Prisma.ChildCountArgs<ExtArgs>
            result: $Utils.Optional<ChildCountAggregateOutputType> | number
          }
        }
      }
      Plan: {
        payload: Prisma.$PlanPayload<ExtArgs>
        fields: Prisma.PlanFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PlanFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlanPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PlanFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlanPayload>
          }
          findFirst: {
            args: Prisma.PlanFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlanPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PlanFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlanPayload>
          }
          findMany: {
            args: Prisma.PlanFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlanPayload>[]
          }
          create: {
            args: Prisma.PlanCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlanPayload>
          }
          createMany: {
            args: Prisma.PlanCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PlanCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlanPayload>[]
          }
          delete: {
            args: Prisma.PlanDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlanPayload>
          }
          update: {
            args: Prisma.PlanUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlanPayload>
          }
          deleteMany: {
            args: Prisma.PlanDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PlanUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PlanUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlanPayload>
          }
          aggregate: {
            args: Prisma.PlanAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePlan>
          }
          groupBy: {
            args: Prisma.PlanGroupByArgs<ExtArgs>
            result: $Utils.Optional<PlanGroupByOutputType>[]
          }
          count: {
            args: Prisma.PlanCountArgs<ExtArgs>
            result: $Utils.Optional<PlanCountAggregateOutputType> | number
          }
        }
      }
      TaskTemplate: {
        payload: Prisma.$TaskTemplatePayload<ExtArgs>
        fields: Prisma.TaskTemplateFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TaskTemplateFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskTemplatePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TaskTemplateFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskTemplatePayload>
          }
          findFirst: {
            args: Prisma.TaskTemplateFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskTemplatePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TaskTemplateFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskTemplatePayload>
          }
          findMany: {
            args: Prisma.TaskTemplateFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskTemplatePayload>[]
          }
          create: {
            args: Prisma.TaskTemplateCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskTemplatePayload>
          }
          createMany: {
            args: Prisma.TaskTemplateCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TaskTemplateCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskTemplatePayload>[]
          }
          delete: {
            args: Prisma.TaskTemplateDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskTemplatePayload>
          }
          update: {
            args: Prisma.TaskTemplateUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskTemplatePayload>
          }
          deleteMany: {
            args: Prisma.TaskTemplateDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TaskTemplateUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.TaskTemplateUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskTemplatePayload>
          }
          aggregate: {
            args: Prisma.TaskTemplateAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTaskTemplate>
          }
          groupBy: {
            args: Prisma.TaskTemplateGroupByArgs<ExtArgs>
            result: $Utils.Optional<TaskTemplateGroupByOutputType>[]
          }
          count: {
            args: Prisma.TaskTemplateCountArgs<ExtArgs>
            result: $Utils.Optional<TaskTemplateCountAggregateOutputType> | number
          }
        }
      }
      Capability: {
        payload: Prisma.$CapabilityPayload<ExtArgs>
        fields: Prisma.CapabilityFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CapabilityFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CapabilityPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CapabilityFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CapabilityPayload>
          }
          findFirst: {
            args: Prisma.CapabilityFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CapabilityPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CapabilityFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CapabilityPayload>
          }
          findMany: {
            args: Prisma.CapabilityFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CapabilityPayload>[]
          }
          create: {
            args: Prisma.CapabilityCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CapabilityPayload>
          }
          createMany: {
            args: Prisma.CapabilityCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CapabilityCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CapabilityPayload>[]
          }
          delete: {
            args: Prisma.CapabilityDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CapabilityPayload>
          }
          update: {
            args: Prisma.CapabilityUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CapabilityPayload>
          }
          deleteMany: {
            args: Prisma.CapabilityDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CapabilityUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.CapabilityUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CapabilityPayload>
          }
          aggregate: {
            args: Prisma.CapabilityAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCapability>
          }
          groupBy: {
            args: Prisma.CapabilityGroupByArgs<ExtArgs>
            result: $Utils.Optional<CapabilityGroupByOutputType>[]
          }
          count: {
            args: Prisma.CapabilityCountArgs<ExtArgs>
            result: $Utils.Optional<CapabilityCountAggregateOutputType> | number
          }
        }
      }
      TaskCapabilityLink: {
        payload: Prisma.$TaskCapabilityLinkPayload<ExtArgs>
        fields: Prisma.TaskCapabilityLinkFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TaskCapabilityLinkFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskCapabilityLinkPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TaskCapabilityLinkFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskCapabilityLinkPayload>
          }
          findFirst: {
            args: Prisma.TaskCapabilityLinkFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskCapabilityLinkPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TaskCapabilityLinkFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskCapabilityLinkPayload>
          }
          findMany: {
            args: Prisma.TaskCapabilityLinkFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskCapabilityLinkPayload>[]
          }
          create: {
            args: Prisma.TaskCapabilityLinkCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskCapabilityLinkPayload>
          }
          createMany: {
            args: Prisma.TaskCapabilityLinkCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TaskCapabilityLinkCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskCapabilityLinkPayload>[]
          }
          delete: {
            args: Prisma.TaskCapabilityLinkDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskCapabilityLinkPayload>
          }
          update: {
            args: Prisma.TaskCapabilityLinkUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskCapabilityLinkPayload>
          }
          deleteMany: {
            args: Prisma.TaskCapabilityLinkDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TaskCapabilityLinkUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.TaskCapabilityLinkUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskCapabilityLinkPayload>
          }
          aggregate: {
            args: Prisma.TaskCapabilityLinkAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTaskCapabilityLink>
          }
          groupBy: {
            args: Prisma.TaskCapabilityLinkGroupByArgs<ExtArgs>
            result: $Utils.Optional<TaskCapabilityLinkGroupByOutputType>[]
          }
          count: {
            args: Prisma.TaskCapabilityLinkCountArgs<ExtArgs>
            result: $Utils.Optional<TaskCapabilityLinkCountAggregateOutputType> | number
          }
        }
      }
      WeeklyPlan: {
        payload: Prisma.$WeeklyPlanPayload<ExtArgs>
        fields: Prisma.WeeklyPlanFieldRefs
        operations: {
          findUnique: {
            args: Prisma.WeeklyPlanFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WeeklyPlanPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.WeeklyPlanFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WeeklyPlanPayload>
          }
          findFirst: {
            args: Prisma.WeeklyPlanFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WeeklyPlanPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.WeeklyPlanFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WeeklyPlanPayload>
          }
          findMany: {
            args: Prisma.WeeklyPlanFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WeeklyPlanPayload>[]
          }
          create: {
            args: Prisma.WeeklyPlanCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WeeklyPlanPayload>
          }
          createMany: {
            args: Prisma.WeeklyPlanCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.WeeklyPlanCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WeeklyPlanPayload>[]
          }
          delete: {
            args: Prisma.WeeklyPlanDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WeeklyPlanPayload>
          }
          update: {
            args: Prisma.WeeklyPlanUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WeeklyPlanPayload>
          }
          deleteMany: {
            args: Prisma.WeeklyPlanDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.WeeklyPlanUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.WeeklyPlanUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WeeklyPlanPayload>
          }
          aggregate: {
            args: Prisma.WeeklyPlanAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateWeeklyPlan>
          }
          groupBy: {
            args: Prisma.WeeklyPlanGroupByArgs<ExtArgs>
            result: $Utils.Optional<WeeklyPlanGroupByOutputType>[]
          }
          count: {
            args: Prisma.WeeklyPlanCountArgs<ExtArgs>
            result: $Utils.Optional<WeeklyPlanCountAggregateOutputType> | number
          }
        }
      }
      Notification: {
        payload: Prisma.$NotificationPayload<ExtArgs>
        fields: Prisma.NotificationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.NotificationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.NotificationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          findFirst: {
            args: Prisma.NotificationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.NotificationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          findMany: {
            args: Prisma.NotificationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>[]
          }
          create: {
            args: Prisma.NotificationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          createMany: {
            args: Prisma.NotificationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.NotificationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>[]
          }
          delete: {
            args: Prisma.NotificationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          update: {
            args: Prisma.NotificationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          deleteMany: {
            args: Prisma.NotificationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.NotificationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.NotificationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          aggregate: {
            args: Prisma.NotificationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateNotification>
          }
          groupBy: {
            args: Prisma.NotificationGroupByArgs<ExtArgs>
            result: $Utils.Optional<NotificationGroupByOutputType>[]
          }
          count: {
            args: Prisma.NotificationCountArgs<ExtArgs>
            result: $Utils.Optional<NotificationCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
  }


  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    children: number
    plans: number
    weeklyPlans: number
    notifications: number
    taskTemplates: number
    capabilities: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    children?: boolean | UserCountOutputTypeCountChildrenArgs
    plans?: boolean | UserCountOutputTypeCountPlansArgs
    weeklyPlans?: boolean | UserCountOutputTypeCountWeeklyPlansArgs
    notifications?: boolean | UserCountOutputTypeCountNotificationsArgs
    taskTemplates?: boolean | UserCountOutputTypeCountTaskTemplatesArgs
    capabilities?: boolean | UserCountOutputTypeCountCapabilitiesArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountChildrenArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ChildWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountPlansArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PlanWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountWeeklyPlansArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WeeklyPlanWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountNotificationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NotificationWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountTaskTemplatesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TaskTemplateWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountCapabilitiesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CapabilityWhereInput
  }


  /**
   * Count Type ChildCountOutputType
   */

  export type ChildCountOutputType = {
    plans: number
    weeklyPlans: number
  }

  export type ChildCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    plans?: boolean | ChildCountOutputTypeCountPlansArgs
    weeklyPlans?: boolean | ChildCountOutputTypeCountWeeklyPlansArgs
  }

  // Custom InputTypes
  /**
   * ChildCountOutputType without action
   */
  export type ChildCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChildCountOutputType
     */
    select?: ChildCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ChildCountOutputType without action
   */
  export type ChildCountOutputTypeCountPlansArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PlanWhereInput
  }

  /**
   * ChildCountOutputType without action
   */
  export type ChildCountOutputTypeCountWeeklyPlansArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WeeklyPlanWhereInput
  }


  /**
   * Count Type TaskTemplateCountOutputType
   */

  export type TaskTemplateCountOutputType = {
    capabilityLinks: number
  }

  export type TaskTemplateCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    capabilityLinks?: boolean | TaskTemplateCountOutputTypeCountCapabilityLinksArgs
  }

  // Custom InputTypes
  /**
   * TaskTemplateCountOutputType without action
   */
  export type TaskTemplateCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskTemplateCountOutputType
     */
    select?: TaskTemplateCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * TaskTemplateCountOutputType without action
   */
  export type TaskTemplateCountOutputTypeCountCapabilityLinksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TaskCapabilityLinkWhereInput
  }


  /**
   * Count Type CapabilityCountOutputType
   */

  export type CapabilityCountOutputType = {
    links: number
  }

  export type CapabilityCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    links?: boolean | CapabilityCountOutputTypeCountLinksArgs
  }

  // Custom InputTypes
  /**
   * CapabilityCountOutputType without action
   */
  export type CapabilityCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CapabilityCountOutputType
     */
    select?: CapabilityCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * CapabilityCountOutputType without action
   */
  export type CapabilityCountOutputTypeCountLinksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TaskCapabilityLinkWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    username: string | null
    passwordHash: string | null
    name: string | null
    role: $Enums.UserRole | null
    avatarUrl: string | null
    phone: string | null
    email: string | null
    wechatOpenId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    username: string | null
    passwordHash: string | null
    name: string | null
    role: $Enums.UserRole | null
    avatarUrl: string | null
    phone: string | null
    email: string | null
    wechatOpenId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    username: number
    passwordHash: number
    name: number
    role: number
    avatarUrl: number
    phone: number
    email: number
    wechatOpenId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    username?: true
    passwordHash?: true
    name?: true
    role?: true
    avatarUrl?: true
    phone?: true
    email?: true
    wechatOpenId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    username?: true
    passwordHash?: true
    name?: true
    role?: true
    avatarUrl?: true
    phone?: true
    email?: true
    wechatOpenId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    username?: true
    passwordHash?: true
    name?: true
    role?: true
    avatarUrl?: true
    phone?: true
    email?: true
    wechatOpenId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    username: string
    passwordHash: string
    name: string | null
    role: $Enums.UserRole
    avatarUrl: string | null
    phone: string | null
    email: string | null
    wechatOpenId: string | null
    createdAt: Date
    updatedAt: Date
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    username?: boolean
    passwordHash?: boolean
    name?: boolean
    role?: boolean
    avatarUrl?: boolean
    phone?: boolean
    email?: boolean
    wechatOpenId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    children?: boolean | User$childrenArgs<ExtArgs>
    plans?: boolean | User$plansArgs<ExtArgs>
    weeklyPlans?: boolean | User$weeklyPlansArgs<ExtArgs>
    notifications?: boolean | User$notificationsArgs<ExtArgs>
    settings?: boolean | User$settingsArgs<ExtArgs>
    taskTemplates?: boolean | User$taskTemplatesArgs<ExtArgs>
    capabilities?: boolean | User$capabilitiesArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    username?: boolean
    passwordHash?: boolean
    name?: boolean
    role?: boolean
    avatarUrl?: boolean
    phone?: boolean
    email?: boolean
    wechatOpenId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    username?: boolean
    passwordHash?: boolean
    name?: boolean
    role?: boolean
    avatarUrl?: boolean
    phone?: boolean
    email?: boolean
    wechatOpenId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    children?: boolean | User$childrenArgs<ExtArgs>
    plans?: boolean | User$plansArgs<ExtArgs>
    weeklyPlans?: boolean | User$weeklyPlansArgs<ExtArgs>
    notifications?: boolean | User$notificationsArgs<ExtArgs>
    settings?: boolean | User$settingsArgs<ExtArgs>
    taskTemplates?: boolean | User$taskTemplatesArgs<ExtArgs>
    capabilities?: boolean | User$capabilitiesArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      children: Prisma.$ChildPayload<ExtArgs>[]
      plans: Prisma.$PlanPayload<ExtArgs>[]
      weeklyPlans: Prisma.$WeeklyPlanPayload<ExtArgs>[]
      notifications: Prisma.$NotificationPayload<ExtArgs>[]
      settings: Prisma.$UserSettingPayload<ExtArgs> | null
      taskTemplates: Prisma.$TaskTemplatePayload<ExtArgs>[]
      capabilities: Prisma.$CapabilityPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      username: string
      passwordHash: string
      name: string | null
      role: $Enums.UserRole
      avatarUrl: string | null
      phone: string | null
      email: string | null
      wechatOpenId: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    children<T extends User$childrenArgs<ExtArgs> = {}>(args?: Subset<T, User$childrenArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChildPayload<ExtArgs>, T, "findMany"> | Null>
    plans<T extends User$plansArgs<ExtArgs> = {}>(args?: Subset<T, User$plansArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PlanPayload<ExtArgs>, T, "findMany"> | Null>
    weeklyPlans<T extends User$weeklyPlansArgs<ExtArgs> = {}>(args?: Subset<T, User$weeklyPlansArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WeeklyPlanPayload<ExtArgs>, T, "findMany"> | Null>
    notifications<T extends User$notificationsArgs<ExtArgs> = {}>(args?: Subset<T, User$notificationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findMany"> | Null>
    settings<T extends User$settingsArgs<ExtArgs> = {}>(args?: Subset<T, User$settingsArgs<ExtArgs>>): Prisma__UserSettingClient<$Result.GetResult<Prisma.$UserSettingPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    taskTemplates<T extends User$taskTemplatesArgs<ExtArgs> = {}>(args?: Subset<T, User$taskTemplatesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TaskTemplatePayload<ExtArgs>, T, "findMany"> | Null>
    capabilities<T extends User$capabilitiesArgs<ExtArgs> = {}>(args?: Subset<T, User$capabilitiesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CapabilityPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */ 
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly username: FieldRef<"User", 'String'>
    readonly passwordHash: FieldRef<"User", 'String'>
    readonly name: FieldRef<"User", 'String'>
    readonly role: FieldRef<"User", 'UserRole'>
    readonly avatarUrl: FieldRef<"User", 'String'>
    readonly phone: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly wechatOpenId: FieldRef<"User", 'String'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
  }

  /**
   * User.children
   */
  export type User$childrenArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Child
     */
    select?: ChildSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChildInclude<ExtArgs> | null
    where?: ChildWhereInput
    orderBy?: ChildOrderByWithRelationInput | ChildOrderByWithRelationInput[]
    cursor?: ChildWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ChildScalarFieldEnum | ChildScalarFieldEnum[]
  }

  /**
   * User.plans
   */
  export type User$plansArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Plan
     */
    select?: PlanSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlanInclude<ExtArgs> | null
    where?: PlanWhereInput
    orderBy?: PlanOrderByWithRelationInput | PlanOrderByWithRelationInput[]
    cursor?: PlanWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PlanScalarFieldEnum | PlanScalarFieldEnum[]
  }

  /**
   * User.weeklyPlans
   */
  export type User$weeklyPlansArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WeeklyPlan
     */
    select?: WeeklyPlanSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WeeklyPlanInclude<ExtArgs> | null
    where?: WeeklyPlanWhereInput
    orderBy?: WeeklyPlanOrderByWithRelationInput | WeeklyPlanOrderByWithRelationInput[]
    cursor?: WeeklyPlanWhereUniqueInput
    take?: number
    skip?: number
    distinct?: WeeklyPlanScalarFieldEnum | WeeklyPlanScalarFieldEnum[]
  }

  /**
   * User.notifications
   */
  export type User$notificationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    where?: NotificationWhereInput
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    cursor?: NotificationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * User.settings
   */
  export type User$settingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSetting
     */
    select?: UserSettingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSettingInclude<ExtArgs> | null
    where?: UserSettingWhereInput
  }

  /**
   * User.taskTemplates
   */
  export type User$taskTemplatesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskTemplate
     */
    select?: TaskTemplateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskTemplateInclude<ExtArgs> | null
    where?: TaskTemplateWhereInput
    orderBy?: TaskTemplateOrderByWithRelationInput | TaskTemplateOrderByWithRelationInput[]
    cursor?: TaskTemplateWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TaskTemplateScalarFieldEnum | TaskTemplateScalarFieldEnum[]
  }

  /**
   * User.capabilities
   */
  export type User$capabilitiesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Capability
     */
    select?: CapabilitySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CapabilityInclude<ExtArgs> | null
    where?: CapabilityWhereInput
    orderBy?: CapabilityOrderByWithRelationInput | CapabilityOrderByWithRelationInput[]
    cursor?: CapabilityWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CapabilityScalarFieldEnum | CapabilityScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model UserSetting
   */

  export type AggregateUserSetting = {
    _count: UserSettingCountAggregateOutputType | null
    _min: UserSettingMinAggregateOutputType | null
    _max: UserSettingMaxAggregateOutputType | null
  }

  export type UserSettingMinAggregateOutputType = {
    id: string | null
    userId: string | null
    theme: string | null
    fontSize: string | null
    density: string | null
    reducedMotion: boolean | null
    defaultLandingPage: string | null
    defaultChildMode: string | null
    reminderTime: string | null
    doNotDisturb: boolean | null
    doNotDisturbStart: string | null
    doNotDisturbEnd: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserSettingMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    theme: string | null
    fontSize: string | null
    density: string | null
    reducedMotion: boolean | null
    defaultLandingPage: string | null
    defaultChildMode: string | null
    reminderTime: string | null
    doNotDisturb: boolean | null
    doNotDisturbStart: string | null
    doNotDisturbEnd: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserSettingCountAggregateOutputType = {
    id: number
    userId: number
    theme: number
    fontSize: number
    density: number
    reducedMotion: number
    defaultLandingPage: number
    defaultChildMode: number
    notificationPrefs: number
    reminderTime: number
    doNotDisturb: number
    doNotDisturbStart: number
    doNotDisturbEnd: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserSettingMinAggregateInputType = {
    id?: true
    userId?: true
    theme?: true
    fontSize?: true
    density?: true
    reducedMotion?: true
    defaultLandingPage?: true
    defaultChildMode?: true
    reminderTime?: true
    doNotDisturb?: true
    doNotDisturbStart?: true
    doNotDisturbEnd?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserSettingMaxAggregateInputType = {
    id?: true
    userId?: true
    theme?: true
    fontSize?: true
    density?: true
    reducedMotion?: true
    defaultLandingPage?: true
    defaultChildMode?: true
    reminderTime?: true
    doNotDisturb?: true
    doNotDisturbStart?: true
    doNotDisturbEnd?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserSettingCountAggregateInputType = {
    id?: true
    userId?: true
    theme?: true
    fontSize?: true
    density?: true
    reducedMotion?: true
    defaultLandingPage?: true
    defaultChildMode?: true
    notificationPrefs?: true
    reminderTime?: true
    doNotDisturb?: true
    doNotDisturbStart?: true
    doNotDisturbEnd?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserSettingAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserSetting to aggregate.
     */
    where?: UserSettingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserSettings to fetch.
     */
    orderBy?: UserSettingOrderByWithRelationInput | UserSettingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserSettingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserSettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserSettings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned UserSettings
    **/
    _count?: true | UserSettingCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserSettingMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserSettingMaxAggregateInputType
  }

  export type GetUserSettingAggregateType<T extends UserSettingAggregateArgs> = {
        [P in keyof T & keyof AggregateUserSetting]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUserSetting[P]>
      : GetScalarType<T[P], AggregateUserSetting[P]>
  }




  export type UserSettingGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserSettingWhereInput
    orderBy?: UserSettingOrderByWithAggregationInput | UserSettingOrderByWithAggregationInput[]
    by: UserSettingScalarFieldEnum[] | UserSettingScalarFieldEnum
    having?: UserSettingScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserSettingCountAggregateInputType | true
    _min?: UserSettingMinAggregateInputType
    _max?: UserSettingMaxAggregateInputType
  }

  export type UserSettingGroupByOutputType = {
    id: string
    userId: string
    theme: string
    fontSize: string
    density: string
    reducedMotion: boolean
    defaultLandingPage: string
    defaultChildMode: string
    notificationPrefs: JsonValue
    reminderTime: string
    doNotDisturb: boolean
    doNotDisturbStart: string | null
    doNotDisturbEnd: string | null
    createdAt: Date
    updatedAt: Date
    _count: UserSettingCountAggregateOutputType | null
    _min: UserSettingMinAggregateOutputType | null
    _max: UserSettingMaxAggregateOutputType | null
  }

  type GetUserSettingGroupByPayload<T extends UserSettingGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserSettingGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserSettingGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserSettingGroupByOutputType[P]>
            : GetScalarType<T[P], UserSettingGroupByOutputType[P]>
        }
      >
    >


  export type UserSettingSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    theme?: boolean
    fontSize?: boolean
    density?: boolean
    reducedMotion?: boolean
    defaultLandingPage?: boolean
    defaultChildMode?: boolean
    notificationPrefs?: boolean
    reminderTime?: boolean
    doNotDisturb?: boolean
    doNotDisturbStart?: boolean
    doNotDisturbEnd?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userSetting"]>

  export type UserSettingSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    theme?: boolean
    fontSize?: boolean
    density?: boolean
    reducedMotion?: boolean
    defaultLandingPage?: boolean
    defaultChildMode?: boolean
    notificationPrefs?: boolean
    reminderTime?: boolean
    doNotDisturb?: boolean
    doNotDisturbStart?: boolean
    doNotDisturbEnd?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userSetting"]>

  export type UserSettingSelectScalar = {
    id?: boolean
    userId?: boolean
    theme?: boolean
    fontSize?: boolean
    density?: boolean
    reducedMotion?: boolean
    defaultLandingPage?: boolean
    defaultChildMode?: boolean
    notificationPrefs?: boolean
    reminderTime?: boolean
    doNotDisturb?: boolean
    doNotDisturbStart?: boolean
    doNotDisturbEnd?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserSettingInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type UserSettingIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $UserSettingPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "UserSetting"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      theme: string
      fontSize: string
      density: string
      reducedMotion: boolean
      defaultLandingPage: string
      defaultChildMode: string
      notificationPrefs: Prisma.JsonValue
      reminderTime: string
      doNotDisturb: boolean
      doNotDisturbStart: string | null
      doNotDisturbEnd: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["userSetting"]>
    composites: {}
  }

  type UserSettingGetPayload<S extends boolean | null | undefined | UserSettingDefaultArgs> = $Result.GetResult<Prisma.$UserSettingPayload, S>

  type UserSettingCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<UserSettingFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: UserSettingCountAggregateInputType | true
    }

  export interface UserSettingDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['UserSetting'], meta: { name: 'UserSetting' } }
    /**
     * Find zero or one UserSetting that matches the filter.
     * @param {UserSettingFindUniqueArgs} args - Arguments to find a UserSetting
     * @example
     * // Get one UserSetting
     * const userSetting = await prisma.userSetting.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserSettingFindUniqueArgs>(args: SelectSubset<T, UserSettingFindUniqueArgs<ExtArgs>>): Prisma__UserSettingClient<$Result.GetResult<Prisma.$UserSettingPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one UserSetting that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {UserSettingFindUniqueOrThrowArgs} args - Arguments to find a UserSetting
     * @example
     * // Get one UserSetting
     * const userSetting = await prisma.userSetting.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserSettingFindUniqueOrThrowArgs>(args: SelectSubset<T, UserSettingFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserSettingClient<$Result.GetResult<Prisma.$UserSettingPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first UserSetting that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserSettingFindFirstArgs} args - Arguments to find a UserSetting
     * @example
     * // Get one UserSetting
     * const userSetting = await prisma.userSetting.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserSettingFindFirstArgs>(args?: SelectSubset<T, UserSettingFindFirstArgs<ExtArgs>>): Prisma__UserSettingClient<$Result.GetResult<Prisma.$UserSettingPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first UserSetting that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserSettingFindFirstOrThrowArgs} args - Arguments to find a UserSetting
     * @example
     * // Get one UserSetting
     * const userSetting = await prisma.userSetting.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserSettingFindFirstOrThrowArgs>(args?: SelectSubset<T, UserSettingFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserSettingClient<$Result.GetResult<Prisma.$UserSettingPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more UserSettings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserSettingFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UserSettings
     * const userSettings = await prisma.userSetting.findMany()
     * 
     * // Get first 10 UserSettings
     * const userSettings = await prisma.userSetting.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userSettingWithIdOnly = await prisma.userSetting.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserSettingFindManyArgs>(args?: SelectSubset<T, UserSettingFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserSettingPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a UserSetting.
     * @param {UserSettingCreateArgs} args - Arguments to create a UserSetting.
     * @example
     * // Create one UserSetting
     * const UserSetting = await prisma.userSetting.create({
     *   data: {
     *     // ... data to create a UserSetting
     *   }
     * })
     * 
     */
    create<T extends UserSettingCreateArgs>(args: SelectSubset<T, UserSettingCreateArgs<ExtArgs>>): Prisma__UserSettingClient<$Result.GetResult<Prisma.$UserSettingPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many UserSettings.
     * @param {UserSettingCreateManyArgs} args - Arguments to create many UserSettings.
     * @example
     * // Create many UserSettings
     * const userSetting = await prisma.userSetting.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserSettingCreateManyArgs>(args?: SelectSubset<T, UserSettingCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many UserSettings and returns the data saved in the database.
     * @param {UserSettingCreateManyAndReturnArgs} args - Arguments to create many UserSettings.
     * @example
     * // Create many UserSettings
     * const userSetting = await prisma.userSetting.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many UserSettings and only return the `id`
     * const userSettingWithIdOnly = await prisma.userSetting.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserSettingCreateManyAndReturnArgs>(args?: SelectSubset<T, UserSettingCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserSettingPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a UserSetting.
     * @param {UserSettingDeleteArgs} args - Arguments to delete one UserSetting.
     * @example
     * // Delete one UserSetting
     * const UserSetting = await prisma.userSetting.delete({
     *   where: {
     *     // ... filter to delete one UserSetting
     *   }
     * })
     * 
     */
    delete<T extends UserSettingDeleteArgs>(args: SelectSubset<T, UserSettingDeleteArgs<ExtArgs>>): Prisma__UserSettingClient<$Result.GetResult<Prisma.$UserSettingPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one UserSetting.
     * @param {UserSettingUpdateArgs} args - Arguments to update one UserSetting.
     * @example
     * // Update one UserSetting
     * const userSetting = await prisma.userSetting.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserSettingUpdateArgs>(args: SelectSubset<T, UserSettingUpdateArgs<ExtArgs>>): Prisma__UserSettingClient<$Result.GetResult<Prisma.$UserSettingPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more UserSettings.
     * @param {UserSettingDeleteManyArgs} args - Arguments to filter UserSettings to delete.
     * @example
     * // Delete a few UserSettings
     * const { count } = await prisma.userSetting.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserSettingDeleteManyArgs>(args?: SelectSubset<T, UserSettingDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserSettings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserSettingUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UserSettings
     * const userSetting = await prisma.userSetting.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserSettingUpdateManyArgs>(args: SelectSubset<T, UserSettingUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one UserSetting.
     * @param {UserSettingUpsertArgs} args - Arguments to update or create a UserSetting.
     * @example
     * // Update or create a UserSetting
     * const userSetting = await prisma.userSetting.upsert({
     *   create: {
     *     // ... data to create a UserSetting
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UserSetting we want to update
     *   }
     * })
     */
    upsert<T extends UserSettingUpsertArgs>(args: SelectSubset<T, UserSettingUpsertArgs<ExtArgs>>): Prisma__UserSettingClient<$Result.GetResult<Prisma.$UserSettingPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of UserSettings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserSettingCountArgs} args - Arguments to filter UserSettings to count.
     * @example
     * // Count the number of UserSettings
     * const count = await prisma.userSetting.count({
     *   where: {
     *     // ... the filter for the UserSettings we want to count
     *   }
     * })
    **/
    count<T extends UserSettingCountArgs>(
      args?: Subset<T, UserSettingCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserSettingCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a UserSetting.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserSettingAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserSettingAggregateArgs>(args: Subset<T, UserSettingAggregateArgs>): Prisma.PrismaPromise<GetUserSettingAggregateType<T>>

    /**
     * Group by UserSetting.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserSettingGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserSettingGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserSettingGroupByArgs['orderBy'] }
        : { orderBy?: UserSettingGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserSettingGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserSettingGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the UserSetting model
   */
  readonly fields: UserSettingFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for UserSetting.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserSettingClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the UserSetting model
   */ 
  interface UserSettingFieldRefs {
    readonly id: FieldRef<"UserSetting", 'String'>
    readonly userId: FieldRef<"UserSetting", 'String'>
    readonly theme: FieldRef<"UserSetting", 'String'>
    readonly fontSize: FieldRef<"UserSetting", 'String'>
    readonly density: FieldRef<"UserSetting", 'String'>
    readonly reducedMotion: FieldRef<"UserSetting", 'Boolean'>
    readonly defaultLandingPage: FieldRef<"UserSetting", 'String'>
    readonly defaultChildMode: FieldRef<"UserSetting", 'String'>
    readonly notificationPrefs: FieldRef<"UserSetting", 'Json'>
    readonly reminderTime: FieldRef<"UserSetting", 'String'>
    readonly doNotDisturb: FieldRef<"UserSetting", 'Boolean'>
    readonly doNotDisturbStart: FieldRef<"UserSetting", 'String'>
    readonly doNotDisturbEnd: FieldRef<"UserSetting", 'String'>
    readonly createdAt: FieldRef<"UserSetting", 'DateTime'>
    readonly updatedAt: FieldRef<"UserSetting", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * UserSetting findUnique
   */
  export type UserSettingFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSetting
     */
    select?: UserSettingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSettingInclude<ExtArgs> | null
    /**
     * Filter, which UserSetting to fetch.
     */
    where: UserSettingWhereUniqueInput
  }

  /**
   * UserSetting findUniqueOrThrow
   */
  export type UserSettingFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSetting
     */
    select?: UserSettingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSettingInclude<ExtArgs> | null
    /**
     * Filter, which UserSetting to fetch.
     */
    where: UserSettingWhereUniqueInput
  }

  /**
   * UserSetting findFirst
   */
  export type UserSettingFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSetting
     */
    select?: UserSettingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSettingInclude<ExtArgs> | null
    /**
     * Filter, which UserSetting to fetch.
     */
    where?: UserSettingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserSettings to fetch.
     */
    orderBy?: UserSettingOrderByWithRelationInput | UserSettingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserSettings.
     */
    cursor?: UserSettingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserSettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserSettings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserSettings.
     */
    distinct?: UserSettingScalarFieldEnum | UserSettingScalarFieldEnum[]
  }

  /**
   * UserSetting findFirstOrThrow
   */
  export type UserSettingFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSetting
     */
    select?: UserSettingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSettingInclude<ExtArgs> | null
    /**
     * Filter, which UserSetting to fetch.
     */
    where?: UserSettingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserSettings to fetch.
     */
    orderBy?: UserSettingOrderByWithRelationInput | UserSettingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserSettings.
     */
    cursor?: UserSettingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserSettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserSettings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserSettings.
     */
    distinct?: UserSettingScalarFieldEnum | UserSettingScalarFieldEnum[]
  }

  /**
   * UserSetting findMany
   */
  export type UserSettingFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSetting
     */
    select?: UserSettingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSettingInclude<ExtArgs> | null
    /**
     * Filter, which UserSettings to fetch.
     */
    where?: UserSettingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserSettings to fetch.
     */
    orderBy?: UserSettingOrderByWithRelationInput | UserSettingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing UserSettings.
     */
    cursor?: UserSettingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserSettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserSettings.
     */
    skip?: number
    distinct?: UserSettingScalarFieldEnum | UserSettingScalarFieldEnum[]
  }

  /**
   * UserSetting create
   */
  export type UserSettingCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSetting
     */
    select?: UserSettingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSettingInclude<ExtArgs> | null
    /**
     * The data needed to create a UserSetting.
     */
    data: XOR<UserSettingCreateInput, UserSettingUncheckedCreateInput>
  }

  /**
   * UserSetting createMany
   */
  export type UserSettingCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many UserSettings.
     */
    data: UserSettingCreateManyInput | UserSettingCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * UserSetting createManyAndReturn
   */
  export type UserSettingCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSetting
     */
    select?: UserSettingSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many UserSettings.
     */
    data: UserSettingCreateManyInput | UserSettingCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSettingIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * UserSetting update
   */
  export type UserSettingUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSetting
     */
    select?: UserSettingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSettingInclude<ExtArgs> | null
    /**
     * The data needed to update a UserSetting.
     */
    data: XOR<UserSettingUpdateInput, UserSettingUncheckedUpdateInput>
    /**
     * Choose, which UserSetting to update.
     */
    where: UserSettingWhereUniqueInput
  }

  /**
   * UserSetting updateMany
   */
  export type UserSettingUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update UserSettings.
     */
    data: XOR<UserSettingUpdateManyMutationInput, UserSettingUncheckedUpdateManyInput>
    /**
     * Filter which UserSettings to update
     */
    where?: UserSettingWhereInput
  }

  /**
   * UserSetting upsert
   */
  export type UserSettingUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSetting
     */
    select?: UserSettingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSettingInclude<ExtArgs> | null
    /**
     * The filter to search for the UserSetting to update in case it exists.
     */
    where: UserSettingWhereUniqueInput
    /**
     * In case the UserSetting found by the `where` argument doesn't exist, create a new UserSetting with this data.
     */
    create: XOR<UserSettingCreateInput, UserSettingUncheckedCreateInput>
    /**
     * In case the UserSetting was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserSettingUpdateInput, UserSettingUncheckedUpdateInput>
  }

  /**
   * UserSetting delete
   */
  export type UserSettingDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSetting
     */
    select?: UserSettingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSettingInclude<ExtArgs> | null
    /**
     * Filter which UserSetting to delete.
     */
    where: UserSettingWhereUniqueInput
  }

  /**
   * UserSetting deleteMany
   */
  export type UserSettingDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserSettings to delete
     */
    where?: UserSettingWhereInput
  }

  /**
   * UserSetting without action
   */
  export type UserSettingDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSetting
     */
    select?: UserSettingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSettingInclude<ExtArgs> | null
  }


  /**
   * Model Child
   */

  export type AggregateChild = {
    _count: ChildCountAggregateOutputType | null
    _avg: ChildAvgAggregateOutputType | null
    _sum: ChildSumAggregateOutputType | null
    _min: ChildMinAggregateOutputType | null
    _max: ChildMaxAggregateOutputType | null
  }

  export type ChildAvgAggregateOutputType = {
    grade: number | null
  }

  export type ChildSumAggregateOutputType = {
    grade: number | null
  }

  export type ChildMinAggregateOutputType = {
    id: string | null
    userId: string | null
    name: string | null
    grade: number | null
    educationSystem: string | null
    avatarColor: string | null
    avatarUrl: string | null
    targetSchool: string | null
    currentSchool: string | null
    birthday: Date | null
    notes: string | null
    routeId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ChildMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    name: string | null
    grade: number | null
    educationSystem: string | null
    avatarColor: string | null
    avatarUrl: string | null
    targetSchool: string | null
    currentSchool: string | null
    birthday: Date | null
    notes: string | null
    routeId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ChildCountAggregateOutputType = {
    id: number
    userId: number
    name: number
    grade: number
    educationSystem: number
    avatarColor: number
    avatarUrl: number
    targetSchool: number
    currentSchool: number
    birthday: number
    notes: number
    routeId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ChildAvgAggregateInputType = {
    grade?: true
  }

  export type ChildSumAggregateInputType = {
    grade?: true
  }

  export type ChildMinAggregateInputType = {
    id?: true
    userId?: true
    name?: true
    grade?: true
    educationSystem?: true
    avatarColor?: true
    avatarUrl?: true
    targetSchool?: true
    currentSchool?: true
    birthday?: true
    notes?: true
    routeId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ChildMaxAggregateInputType = {
    id?: true
    userId?: true
    name?: true
    grade?: true
    educationSystem?: true
    avatarColor?: true
    avatarUrl?: true
    targetSchool?: true
    currentSchool?: true
    birthday?: true
    notes?: true
    routeId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ChildCountAggregateInputType = {
    id?: true
    userId?: true
    name?: true
    grade?: true
    educationSystem?: true
    avatarColor?: true
    avatarUrl?: true
    targetSchool?: true
    currentSchool?: true
    birthday?: true
    notes?: true
    routeId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ChildAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Child to aggregate.
     */
    where?: ChildWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Children to fetch.
     */
    orderBy?: ChildOrderByWithRelationInput | ChildOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ChildWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Children from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Children.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Children
    **/
    _count?: true | ChildCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ChildAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ChildSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ChildMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ChildMaxAggregateInputType
  }

  export type GetChildAggregateType<T extends ChildAggregateArgs> = {
        [P in keyof T & keyof AggregateChild]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateChild[P]>
      : GetScalarType<T[P], AggregateChild[P]>
  }




  export type ChildGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ChildWhereInput
    orderBy?: ChildOrderByWithAggregationInput | ChildOrderByWithAggregationInput[]
    by: ChildScalarFieldEnum[] | ChildScalarFieldEnum
    having?: ChildScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ChildCountAggregateInputType | true
    _avg?: ChildAvgAggregateInputType
    _sum?: ChildSumAggregateInputType
    _min?: ChildMinAggregateInputType
    _max?: ChildMaxAggregateInputType
  }

  export type ChildGroupByOutputType = {
    id: string
    userId: string
    name: string
    grade: number
    educationSystem: string
    avatarColor: string
    avatarUrl: string | null
    targetSchool: string | null
    currentSchool: string | null
    birthday: Date | null
    notes: string | null
    routeId: string | null
    createdAt: Date
    updatedAt: Date
    _count: ChildCountAggregateOutputType | null
    _avg: ChildAvgAggregateOutputType | null
    _sum: ChildSumAggregateOutputType | null
    _min: ChildMinAggregateOutputType | null
    _max: ChildMaxAggregateOutputType | null
  }

  type GetChildGroupByPayload<T extends ChildGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ChildGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ChildGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ChildGroupByOutputType[P]>
            : GetScalarType<T[P], ChildGroupByOutputType[P]>
        }
      >
    >


  export type ChildSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    name?: boolean
    grade?: boolean
    educationSystem?: boolean
    avatarColor?: boolean
    avatarUrl?: boolean
    targetSchool?: boolean
    currentSchool?: boolean
    birthday?: boolean
    notes?: boolean
    routeId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    plans?: boolean | Child$plansArgs<ExtArgs>
    weeklyPlans?: boolean | Child$weeklyPlansArgs<ExtArgs>
    _count?: boolean | ChildCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["child"]>

  export type ChildSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    name?: boolean
    grade?: boolean
    educationSystem?: boolean
    avatarColor?: boolean
    avatarUrl?: boolean
    targetSchool?: boolean
    currentSchool?: boolean
    birthday?: boolean
    notes?: boolean
    routeId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["child"]>

  export type ChildSelectScalar = {
    id?: boolean
    userId?: boolean
    name?: boolean
    grade?: boolean
    educationSystem?: boolean
    avatarColor?: boolean
    avatarUrl?: boolean
    targetSchool?: boolean
    currentSchool?: boolean
    birthday?: boolean
    notes?: boolean
    routeId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ChildInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    plans?: boolean | Child$plansArgs<ExtArgs>
    weeklyPlans?: boolean | Child$weeklyPlansArgs<ExtArgs>
    _count?: boolean | ChildCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ChildIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $ChildPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Child"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      plans: Prisma.$PlanPayload<ExtArgs>[]
      weeklyPlans: Prisma.$WeeklyPlanPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      name: string
      grade: number
      educationSystem: string
      avatarColor: string
      avatarUrl: string | null
      targetSchool: string | null
      currentSchool: string | null
      birthday: Date | null
      notes: string | null
      routeId: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["child"]>
    composites: {}
  }

  type ChildGetPayload<S extends boolean | null | undefined | ChildDefaultArgs> = $Result.GetResult<Prisma.$ChildPayload, S>

  type ChildCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ChildFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ChildCountAggregateInputType | true
    }

  export interface ChildDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Child'], meta: { name: 'Child' } }
    /**
     * Find zero or one Child that matches the filter.
     * @param {ChildFindUniqueArgs} args - Arguments to find a Child
     * @example
     * // Get one Child
     * const child = await prisma.child.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ChildFindUniqueArgs>(args: SelectSubset<T, ChildFindUniqueArgs<ExtArgs>>): Prisma__ChildClient<$Result.GetResult<Prisma.$ChildPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Child that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ChildFindUniqueOrThrowArgs} args - Arguments to find a Child
     * @example
     * // Get one Child
     * const child = await prisma.child.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ChildFindUniqueOrThrowArgs>(args: SelectSubset<T, ChildFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ChildClient<$Result.GetResult<Prisma.$ChildPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Child that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChildFindFirstArgs} args - Arguments to find a Child
     * @example
     * // Get one Child
     * const child = await prisma.child.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ChildFindFirstArgs>(args?: SelectSubset<T, ChildFindFirstArgs<ExtArgs>>): Prisma__ChildClient<$Result.GetResult<Prisma.$ChildPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Child that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChildFindFirstOrThrowArgs} args - Arguments to find a Child
     * @example
     * // Get one Child
     * const child = await prisma.child.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ChildFindFirstOrThrowArgs>(args?: SelectSubset<T, ChildFindFirstOrThrowArgs<ExtArgs>>): Prisma__ChildClient<$Result.GetResult<Prisma.$ChildPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Children that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChildFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Children
     * const children = await prisma.child.findMany()
     * 
     * // Get first 10 Children
     * const children = await prisma.child.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const childWithIdOnly = await prisma.child.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ChildFindManyArgs>(args?: SelectSubset<T, ChildFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChildPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Child.
     * @param {ChildCreateArgs} args - Arguments to create a Child.
     * @example
     * // Create one Child
     * const Child = await prisma.child.create({
     *   data: {
     *     // ... data to create a Child
     *   }
     * })
     * 
     */
    create<T extends ChildCreateArgs>(args: SelectSubset<T, ChildCreateArgs<ExtArgs>>): Prisma__ChildClient<$Result.GetResult<Prisma.$ChildPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Children.
     * @param {ChildCreateManyArgs} args - Arguments to create many Children.
     * @example
     * // Create many Children
     * const child = await prisma.child.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ChildCreateManyArgs>(args?: SelectSubset<T, ChildCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Children and returns the data saved in the database.
     * @param {ChildCreateManyAndReturnArgs} args - Arguments to create many Children.
     * @example
     * // Create many Children
     * const child = await prisma.child.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Children and only return the `id`
     * const childWithIdOnly = await prisma.child.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ChildCreateManyAndReturnArgs>(args?: SelectSubset<T, ChildCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChildPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Child.
     * @param {ChildDeleteArgs} args - Arguments to delete one Child.
     * @example
     * // Delete one Child
     * const Child = await prisma.child.delete({
     *   where: {
     *     // ... filter to delete one Child
     *   }
     * })
     * 
     */
    delete<T extends ChildDeleteArgs>(args: SelectSubset<T, ChildDeleteArgs<ExtArgs>>): Prisma__ChildClient<$Result.GetResult<Prisma.$ChildPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Child.
     * @param {ChildUpdateArgs} args - Arguments to update one Child.
     * @example
     * // Update one Child
     * const child = await prisma.child.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ChildUpdateArgs>(args: SelectSubset<T, ChildUpdateArgs<ExtArgs>>): Prisma__ChildClient<$Result.GetResult<Prisma.$ChildPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Children.
     * @param {ChildDeleteManyArgs} args - Arguments to filter Children to delete.
     * @example
     * // Delete a few Children
     * const { count } = await prisma.child.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ChildDeleteManyArgs>(args?: SelectSubset<T, ChildDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Children.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChildUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Children
     * const child = await prisma.child.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ChildUpdateManyArgs>(args: SelectSubset<T, ChildUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Child.
     * @param {ChildUpsertArgs} args - Arguments to update or create a Child.
     * @example
     * // Update or create a Child
     * const child = await prisma.child.upsert({
     *   create: {
     *     // ... data to create a Child
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Child we want to update
     *   }
     * })
     */
    upsert<T extends ChildUpsertArgs>(args: SelectSubset<T, ChildUpsertArgs<ExtArgs>>): Prisma__ChildClient<$Result.GetResult<Prisma.$ChildPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Children.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChildCountArgs} args - Arguments to filter Children to count.
     * @example
     * // Count the number of Children
     * const count = await prisma.child.count({
     *   where: {
     *     // ... the filter for the Children we want to count
     *   }
     * })
    **/
    count<T extends ChildCountArgs>(
      args?: Subset<T, ChildCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ChildCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Child.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChildAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ChildAggregateArgs>(args: Subset<T, ChildAggregateArgs>): Prisma.PrismaPromise<GetChildAggregateType<T>>

    /**
     * Group by Child.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChildGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ChildGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ChildGroupByArgs['orderBy'] }
        : { orderBy?: ChildGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ChildGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetChildGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Child model
   */
  readonly fields: ChildFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Child.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ChildClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    plans<T extends Child$plansArgs<ExtArgs> = {}>(args?: Subset<T, Child$plansArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PlanPayload<ExtArgs>, T, "findMany"> | Null>
    weeklyPlans<T extends Child$weeklyPlansArgs<ExtArgs> = {}>(args?: Subset<T, Child$weeklyPlansArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WeeklyPlanPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Child model
   */ 
  interface ChildFieldRefs {
    readonly id: FieldRef<"Child", 'String'>
    readonly userId: FieldRef<"Child", 'String'>
    readonly name: FieldRef<"Child", 'String'>
    readonly grade: FieldRef<"Child", 'Int'>
    readonly educationSystem: FieldRef<"Child", 'String'>
    readonly avatarColor: FieldRef<"Child", 'String'>
    readonly avatarUrl: FieldRef<"Child", 'String'>
    readonly targetSchool: FieldRef<"Child", 'String'>
    readonly currentSchool: FieldRef<"Child", 'String'>
    readonly birthday: FieldRef<"Child", 'DateTime'>
    readonly notes: FieldRef<"Child", 'String'>
    readonly routeId: FieldRef<"Child", 'String'>
    readonly createdAt: FieldRef<"Child", 'DateTime'>
    readonly updatedAt: FieldRef<"Child", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Child findUnique
   */
  export type ChildFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Child
     */
    select?: ChildSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChildInclude<ExtArgs> | null
    /**
     * Filter, which Child to fetch.
     */
    where: ChildWhereUniqueInput
  }

  /**
   * Child findUniqueOrThrow
   */
  export type ChildFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Child
     */
    select?: ChildSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChildInclude<ExtArgs> | null
    /**
     * Filter, which Child to fetch.
     */
    where: ChildWhereUniqueInput
  }

  /**
   * Child findFirst
   */
  export type ChildFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Child
     */
    select?: ChildSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChildInclude<ExtArgs> | null
    /**
     * Filter, which Child to fetch.
     */
    where?: ChildWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Children to fetch.
     */
    orderBy?: ChildOrderByWithRelationInput | ChildOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Children.
     */
    cursor?: ChildWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Children from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Children.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Children.
     */
    distinct?: ChildScalarFieldEnum | ChildScalarFieldEnum[]
  }

  /**
   * Child findFirstOrThrow
   */
  export type ChildFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Child
     */
    select?: ChildSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChildInclude<ExtArgs> | null
    /**
     * Filter, which Child to fetch.
     */
    where?: ChildWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Children to fetch.
     */
    orderBy?: ChildOrderByWithRelationInput | ChildOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Children.
     */
    cursor?: ChildWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Children from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Children.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Children.
     */
    distinct?: ChildScalarFieldEnum | ChildScalarFieldEnum[]
  }

  /**
   * Child findMany
   */
  export type ChildFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Child
     */
    select?: ChildSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChildInclude<ExtArgs> | null
    /**
     * Filter, which Children to fetch.
     */
    where?: ChildWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Children to fetch.
     */
    orderBy?: ChildOrderByWithRelationInput | ChildOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Children.
     */
    cursor?: ChildWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Children from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Children.
     */
    skip?: number
    distinct?: ChildScalarFieldEnum | ChildScalarFieldEnum[]
  }

  /**
   * Child create
   */
  export type ChildCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Child
     */
    select?: ChildSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChildInclude<ExtArgs> | null
    /**
     * The data needed to create a Child.
     */
    data: XOR<ChildCreateInput, ChildUncheckedCreateInput>
  }

  /**
   * Child createMany
   */
  export type ChildCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Children.
     */
    data: ChildCreateManyInput | ChildCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Child createManyAndReturn
   */
  export type ChildCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Child
     */
    select?: ChildSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Children.
     */
    data: ChildCreateManyInput | ChildCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChildIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Child update
   */
  export type ChildUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Child
     */
    select?: ChildSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChildInclude<ExtArgs> | null
    /**
     * The data needed to update a Child.
     */
    data: XOR<ChildUpdateInput, ChildUncheckedUpdateInput>
    /**
     * Choose, which Child to update.
     */
    where: ChildWhereUniqueInput
  }

  /**
   * Child updateMany
   */
  export type ChildUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Children.
     */
    data: XOR<ChildUpdateManyMutationInput, ChildUncheckedUpdateManyInput>
    /**
     * Filter which Children to update
     */
    where?: ChildWhereInput
  }

  /**
   * Child upsert
   */
  export type ChildUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Child
     */
    select?: ChildSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChildInclude<ExtArgs> | null
    /**
     * The filter to search for the Child to update in case it exists.
     */
    where: ChildWhereUniqueInput
    /**
     * In case the Child found by the `where` argument doesn't exist, create a new Child with this data.
     */
    create: XOR<ChildCreateInput, ChildUncheckedCreateInput>
    /**
     * In case the Child was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ChildUpdateInput, ChildUncheckedUpdateInput>
  }

  /**
   * Child delete
   */
  export type ChildDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Child
     */
    select?: ChildSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChildInclude<ExtArgs> | null
    /**
     * Filter which Child to delete.
     */
    where: ChildWhereUniqueInput
  }

  /**
   * Child deleteMany
   */
  export type ChildDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Children to delete
     */
    where?: ChildWhereInput
  }

  /**
   * Child.plans
   */
  export type Child$plansArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Plan
     */
    select?: PlanSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlanInclude<ExtArgs> | null
    where?: PlanWhereInput
    orderBy?: PlanOrderByWithRelationInput | PlanOrderByWithRelationInput[]
    cursor?: PlanWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PlanScalarFieldEnum | PlanScalarFieldEnum[]
  }

  /**
   * Child.weeklyPlans
   */
  export type Child$weeklyPlansArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WeeklyPlan
     */
    select?: WeeklyPlanSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WeeklyPlanInclude<ExtArgs> | null
    where?: WeeklyPlanWhereInput
    orderBy?: WeeklyPlanOrderByWithRelationInput | WeeklyPlanOrderByWithRelationInput[]
    cursor?: WeeklyPlanWhereUniqueInput
    take?: number
    skip?: number
    distinct?: WeeklyPlanScalarFieldEnum | WeeklyPlanScalarFieldEnum[]
  }

  /**
   * Child without action
   */
  export type ChildDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Child
     */
    select?: ChildSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChildInclude<ExtArgs> | null
  }


  /**
   * Model Plan
   */

  export type AggregatePlan = {
    _count: PlanCountAggregateOutputType | null
    _avg: PlanAvgAggregateOutputType | null
    _sum: PlanSumAggregateOutputType | null
    _min: PlanMinAggregateOutputType | null
    _max: PlanMaxAggregateOutputType | null
  }

  export type PlanAvgAggregateOutputType = {
    probability: number | null
  }

  export type PlanSumAggregateOutputType = {
    probability: number | null
  }

  export type PlanMinAggregateOutputType = {
    id: string | null
    userId: string | null
    childId: string | null
    name: string | null
    type: string | null
    status: string | null
    stage: string | null
    description: string | null
    probability: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PlanMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    childId: string | null
    name: string | null
    type: string | null
    status: string | null
    stage: string | null
    description: string | null
    probability: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PlanCountAggregateOutputType = {
    id: number
    userId: number
    childId: number
    name: number
    type: number
    status: number
    stage: number
    description: number
    requirements: number
    milestones: number
    targets: number
    probability: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type PlanAvgAggregateInputType = {
    probability?: true
  }

  export type PlanSumAggregateInputType = {
    probability?: true
  }

  export type PlanMinAggregateInputType = {
    id?: true
    userId?: true
    childId?: true
    name?: true
    type?: true
    status?: true
    stage?: true
    description?: true
    probability?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PlanMaxAggregateInputType = {
    id?: true
    userId?: true
    childId?: true
    name?: true
    type?: true
    status?: true
    stage?: true
    description?: true
    probability?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PlanCountAggregateInputType = {
    id?: true
    userId?: true
    childId?: true
    name?: true
    type?: true
    status?: true
    stage?: true
    description?: true
    requirements?: true
    milestones?: true
    targets?: true
    probability?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type PlanAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Plan to aggregate.
     */
    where?: PlanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Plans to fetch.
     */
    orderBy?: PlanOrderByWithRelationInput | PlanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PlanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Plans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Plans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Plans
    **/
    _count?: true | PlanCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PlanAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PlanSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PlanMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PlanMaxAggregateInputType
  }

  export type GetPlanAggregateType<T extends PlanAggregateArgs> = {
        [P in keyof T & keyof AggregatePlan]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePlan[P]>
      : GetScalarType<T[P], AggregatePlan[P]>
  }




  export type PlanGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PlanWhereInput
    orderBy?: PlanOrderByWithAggregationInput | PlanOrderByWithAggregationInput[]
    by: PlanScalarFieldEnum[] | PlanScalarFieldEnum
    having?: PlanScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PlanCountAggregateInputType | true
    _avg?: PlanAvgAggregateInputType
    _sum?: PlanSumAggregateInputType
    _min?: PlanMinAggregateInputType
    _max?: PlanMaxAggregateInputType
  }

  export type PlanGroupByOutputType = {
    id: string
    userId: string
    childId: string
    name: string
    type: string
    status: string
    stage: string
    description: string | null
    requirements: JsonValue | null
    milestones: JsonValue | null
    targets: JsonValue | null
    probability: number
    createdAt: Date
    updatedAt: Date
    _count: PlanCountAggregateOutputType | null
    _avg: PlanAvgAggregateOutputType | null
    _sum: PlanSumAggregateOutputType | null
    _min: PlanMinAggregateOutputType | null
    _max: PlanMaxAggregateOutputType | null
  }

  type GetPlanGroupByPayload<T extends PlanGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PlanGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PlanGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PlanGroupByOutputType[P]>
            : GetScalarType<T[P], PlanGroupByOutputType[P]>
        }
      >
    >


  export type PlanSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    childId?: boolean
    name?: boolean
    type?: boolean
    status?: boolean
    stage?: boolean
    description?: boolean
    requirements?: boolean
    milestones?: boolean
    targets?: boolean
    probability?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    child?: boolean | ChildDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["plan"]>

  export type PlanSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    childId?: boolean
    name?: boolean
    type?: boolean
    status?: boolean
    stage?: boolean
    description?: boolean
    requirements?: boolean
    milestones?: boolean
    targets?: boolean
    probability?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    child?: boolean | ChildDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["plan"]>

  export type PlanSelectScalar = {
    id?: boolean
    userId?: boolean
    childId?: boolean
    name?: boolean
    type?: boolean
    status?: boolean
    stage?: boolean
    description?: boolean
    requirements?: boolean
    milestones?: boolean
    targets?: boolean
    probability?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type PlanInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    child?: boolean | ChildDefaultArgs<ExtArgs>
  }
  export type PlanIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    child?: boolean | ChildDefaultArgs<ExtArgs>
  }

  export type $PlanPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Plan"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      child: Prisma.$ChildPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      childId: string
      name: string
      type: string
      status: string
      stage: string
      description: string | null
      requirements: Prisma.JsonValue | null
      milestones: Prisma.JsonValue | null
      targets: Prisma.JsonValue | null
      probability: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["plan"]>
    composites: {}
  }

  type PlanGetPayload<S extends boolean | null | undefined | PlanDefaultArgs> = $Result.GetResult<Prisma.$PlanPayload, S>

  type PlanCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<PlanFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: PlanCountAggregateInputType | true
    }

  export interface PlanDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Plan'], meta: { name: 'Plan' } }
    /**
     * Find zero or one Plan that matches the filter.
     * @param {PlanFindUniqueArgs} args - Arguments to find a Plan
     * @example
     * // Get one Plan
     * const plan = await prisma.plan.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PlanFindUniqueArgs>(args: SelectSubset<T, PlanFindUniqueArgs<ExtArgs>>): Prisma__PlanClient<$Result.GetResult<Prisma.$PlanPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Plan that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {PlanFindUniqueOrThrowArgs} args - Arguments to find a Plan
     * @example
     * // Get one Plan
     * const plan = await prisma.plan.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PlanFindUniqueOrThrowArgs>(args: SelectSubset<T, PlanFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PlanClient<$Result.GetResult<Prisma.$PlanPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Plan that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlanFindFirstArgs} args - Arguments to find a Plan
     * @example
     * // Get one Plan
     * const plan = await prisma.plan.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PlanFindFirstArgs>(args?: SelectSubset<T, PlanFindFirstArgs<ExtArgs>>): Prisma__PlanClient<$Result.GetResult<Prisma.$PlanPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Plan that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlanFindFirstOrThrowArgs} args - Arguments to find a Plan
     * @example
     * // Get one Plan
     * const plan = await prisma.plan.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PlanFindFirstOrThrowArgs>(args?: SelectSubset<T, PlanFindFirstOrThrowArgs<ExtArgs>>): Prisma__PlanClient<$Result.GetResult<Prisma.$PlanPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Plans that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlanFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Plans
     * const plans = await prisma.plan.findMany()
     * 
     * // Get first 10 Plans
     * const plans = await prisma.plan.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const planWithIdOnly = await prisma.plan.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PlanFindManyArgs>(args?: SelectSubset<T, PlanFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PlanPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Plan.
     * @param {PlanCreateArgs} args - Arguments to create a Plan.
     * @example
     * // Create one Plan
     * const Plan = await prisma.plan.create({
     *   data: {
     *     // ... data to create a Plan
     *   }
     * })
     * 
     */
    create<T extends PlanCreateArgs>(args: SelectSubset<T, PlanCreateArgs<ExtArgs>>): Prisma__PlanClient<$Result.GetResult<Prisma.$PlanPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Plans.
     * @param {PlanCreateManyArgs} args - Arguments to create many Plans.
     * @example
     * // Create many Plans
     * const plan = await prisma.plan.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PlanCreateManyArgs>(args?: SelectSubset<T, PlanCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Plans and returns the data saved in the database.
     * @param {PlanCreateManyAndReturnArgs} args - Arguments to create many Plans.
     * @example
     * // Create many Plans
     * const plan = await prisma.plan.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Plans and only return the `id`
     * const planWithIdOnly = await prisma.plan.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PlanCreateManyAndReturnArgs>(args?: SelectSubset<T, PlanCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PlanPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Plan.
     * @param {PlanDeleteArgs} args - Arguments to delete one Plan.
     * @example
     * // Delete one Plan
     * const Plan = await prisma.plan.delete({
     *   where: {
     *     // ... filter to delete one Plan
     *   }
     * })
     * 
     */
    delete<T extends PlanDeleteArgs>(args: SelectSubset<T, PlanDeleteArgs<ExtArgs>>): Prisma__PlanClient<$Result.GetResult<Prisma.$PlanPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Plan.
     * @param {PlanUpdateArgs} args - Arguments to update one Plan.
     * @example
     * // Update one Plan
     * const plan = await prisma.plan.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PlanUpdateArgs>(args: SelectSubset<T, PlanUpdateArgs<ExtArgs>>): Prisma__PlanClient<$Result.GetResult<Prisma.$PlanPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Plans.
     * @param {PlanDeleteManyArgs} args - Arguments to filter Plans to delete.
     * @example
     * // Delete a few Plans
     * const { count } = await prisma.plan.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PlanDeleteManyArgs>(args?: SelectSubset<T, PlanDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Plans.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlanUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Plans
     * const plan = await prisma.plan.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PlanUpdateManyArgs>(args: SelectSubset<T, PlanUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Plan.
     * @param {PlanUpsertArgs} args - Arguments to update or create a Plan.
     * @example
     * // Update or create a Plan
     * const plan = await prisma.plan.upsert({
     *   create: {
     *     // ... data to create a Plan
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Plan we want to update
     *   }
     * })
     */
    upsert<T extends PlanUpsertArgs>(args: SelectSubset<T, PlanUpsertArgs<ExtArgs>>): Prisma__PlanClient<$Result.GetResult<Prisma.$PlanPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Plans.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlanCountArgs} args - Arguments to filter Plans to count.
     * @example
     * // Count the number of Plans
     * const count = await prisma.plan.count({
     *   where: {
     *     // ... the filter for the Plans we want to count
     *   }
     * })
    **/
    count<T extends PlanCountArgs>(
      args?: Subset<T, PlanCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PlanCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Plan.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlanAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PlanAggregateArgs>(args: Subset<T, PlanAggregateArgs>): Prisma.PrismaPromise<GetPlanAggregateType<T>>

    /**
     * Group by Plan.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlanGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PlanGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PlanGroupByArgs['orderBy'] }
        : { orderBy?: PlanGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PlanGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPlanGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Plan model
   */
  readonly fields: PlanFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Plan.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PlanClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    child<T extends ChildDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ChildDefaultArgs<ExtArgs>>): Prisma__ChildClient<$Result.GetResult<Prisma.$ChildPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Plan model
   */ 
  interface PlanFieldRefs {
    readonly id: FieldRef<"Plan", 'String'>
    readonly userId: FieldRef<"Plan", 'String'>
    readonly childId: FieldRef<"Plan", 'String'>
    readonly name: FieldRef<"Plan", 'String'>
    readonly type: FieldRef<"Plan", 'String'>
    readonly status: FieldRef<"Plan", 'String'>
    readonly stage: FieldRef<"Plan", 'String'>
    readonly description: FieldRef<"Plan", 'String'>
    readonly requirements: FieldRef<"Plan", 'Json'>
    readonly milestones: FieldRef<"Plan", 'Json'>
    readonly targets: FieldRef<"Plan", 'Json'>
    readonly probability: FieldRef<"Plan", 'Int'>
    readonly createdAt: FieldRef<"Plan", 'DateTime'>
    readonly updatedAt: FieldRef<"Plan", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Plan findUnique
   */
  export type PlanFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Plan
     */
    select?: PlanSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlanInclude<ExtArgs> | null
    /**
     * Filter, which Plan to fetch.
     */
    where: PlanWhereUniqueInput
  }

  /**
   * Plan findUniqueOrThrow
   */
  export type PlanFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Plan
     */
    select?: PlanSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlanInclude<ExtArgs> | null
    /**
     * Filter, which Plan to fetch.
     */
    where: PlanWhereUniqueInput
  }

  /**
   * Plan findFirst
   */
  export type PlanFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Plan
     */
    select?: PlanSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlanInclude<ExtArgs> | null
    /**
     * Filter, which Plan to fetch.
     */
    where?: PlanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Plans to fetch.
     */
    orderBy?: PlanOrderByWithRelationInput | PlanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Plans.
     */
    cursor?: PlanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Plans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Plans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Plans.
     */
    distinct?: PlanScalarFieldEnum | PlanScalarFieldEnum[]
  }

  /**
   * Plan findFirstOrThrow
   */
  export type PlanFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Plan
     */
    select?: PlanSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlanInclude<ExtArgs> | null
    /**
     * Filter, which Plan to fetch.
     */
    where?: PlanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Plans to fetch.
     */
    orderBy?: PlanOrderByWithRelationInput | PlanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Plans.
     */
    cursor?: PlanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Plans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Plans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Plans.
     */
    distinct?: PlanScalarFieldEnum | PlanScalarFieldEnum[]
  }

  /**
   * Plan findMany
   */
  export type PlanFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Plan
     */
    select?: PlanSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlanInclude<ExtArgs> | null
    /**
     * Filter, which Plans to fetch.
     */
    where?: PlanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Plans to fetch.
     */
    orderBy?: PlanOrderByWithRelationInput | PlanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Plans.
     */
    cursor?: PlanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Plans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Plans.
     */
    skip?: number
    distinct?: PlanScalarFieldEnum | PlanScalarFieldEnum[]
  }

  /**
   * Plan create
   */
  export type PlanCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Plan
     */
    select?: PlanSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlanInclude<ExtArgs> | null
    /**
     * The data needed to create a Plan.
     */
    data: XOR<PlanCreateInput, PlanUncheckedCreateInput>
  }

  /**
   * Plan createMany
   */
  export type PlanCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Plans.
     */
    data: PlanCreateManyInput | PlanCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Plan createManyAndReturn
   */
  export type PlanCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Plan
     */
    select?: PlanSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Plans.
     */
    data: PlanCreateManyInput | PlanCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlanIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Plan update
   */
  export type PlanUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Plan
     */
    select?: PlanSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlanInclude<ExtArgs> | null
    /**
     * The data needed to update a Plan.
     */
    data: XOR<PlanUpdateInput, PlanUncheckedUpdateInput>
    /**
     * Choose, which Plan to update.
     */
    where: PlanWhereUniqueInput
  }

  /**
   * Plan updateMany
   */
  export type PlanUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Plans.
     */
    data: XOR<PlanUpdateManyMutationInput, PlanUncheckedUpdateManyInput>
    /**
     * Filter which Plans to update
     */
    where?: PlanWhereInput
  }

  /**
   * Plan upsert
   */
  export type PlanUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Plan
     */
    select?: PlanSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlanInclude<ExtArgs> | null
    /**
     * The filter to search for the Plan to update in case it exists.
     */
    where: PlanWhereUniqueInput
    /**
     * In case the Plan found by the `where` argument doesn't exist, create a new Plan with this data.
     */
    create: XOR<PlanCreateInput, PlanUncheckedCreateInput>
    /**
     * In case the Plan was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PlanUpdateInput, PlanUncheckedUpdateInput>
  }

  /**
   * Plan delete
   */
  export type PlanDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Plan
     */
    select?: PlanSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlanInclude<ExtArgs> | null
    /**
     * Filter which Plan to delete.
     */
    where: PlanWhereUniqueInput
  }

  /**
   * Plan deleteMany
   */
  export type PlanDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Plans to delete
     */
    where?: PlanWhereInput
  }

  /**
   * Plan without action
   */
  export type PlanDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Plan
     */
    select?: PlanSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlanInclude<ExtArgs> | null
  }


  /**
   * Model TaskTemplate
   */

  export type AggregateTaskTemplate = {
    _count: TaskTemplateCountAggregateOutputType | null
    _avg: TaskTemplateAvgAggregateOutputType | null
    _sum: TaskTemplateSumAggregateOutputType | null
    _min: TaskTemplateMinAggregateOutputType | null
    _max: TaskTemplateMaxAggregateOutputType | null
  }

  export type TaskTemplateAvgAggregateOutputType = {
    useCount: number | null
  }

  export type TaskTemplateSumAggregateOutputType = {
    useCount: number | null
  }

  export type TaskTemplateMinAggregateOutputType = {
    id: string | null
    userId: string | null
    title: string | null
    category: $Enums.TaskCategory | null
    duration: string | null
    difficulty: string | null
    description: string | null
    milestoneTag: string | null
    semesterTag: string | null
    source: $Enums.TaskTemplateSource | null
    isActive: boolean | null
    archivedAt: Date | null
    useCount: number | null
    lastUsedAt: Date | null
    taskType: $Enums.TaskType | null
    frequency: $Enums.TaskFrequency | null
    weeklySchedule: $Enums.TaskWeeklySchedule | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TaskTemplateMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    title: string | null
    category: $Enums.TaskCategory | null
    duration: string | null
    difficulty: string | null
    description: string | null
    milestoneTag: string | null
    semesterTag: string | null
    source: $Enums.TaskTemplateSource | null
    isActive: boolean | null
    archivedAt: Date | null
    useCount: number | null
    lastUsedAt: Date | null
    taskType: $Enums.TaskType | null
    frequency: $Enums.TaskFrequency | null
    weeklySchedule: $Enums.TaskWeeklySchedule | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TaskTemplateCountAggregateOutputType = {
    id: number
    userId: number
    title: number
    category: number
    duration: number
    difficulty: number
    materials: number
    description: number
    routeTags: number
    milestoneTag: number
    semesterTag: number
    tags: number
    source: number
    isActive: number
    archivedAt: number
    useCount: number
    lastUsedAt: number
    taskType: number
    frequency: number
    customFrequency: number
    weeklySchedule: number
    customScheduleDays: number
    assessmentCriteria: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type TaskTemplateAvgAggregateInputType = {
    useCount?: true
  }

  export type TaskTemplateSumAggregateInputType = {
    useCount?: true
  }

  export type TaskTemplateMinAggregateInputType = {
    id?: true
    userId?: true
    title?: true
    category?: true
    duration?: true
    difficulty?: true
    description?: true
    milestoneTag?: true
    semesterTag?: true
    source?: true
    isActive?: true
    archivedAt?: true
    useCount?: true
    lastUsedAt?: true
    taskType?: true
    frequency?: true
    weeklySchedule?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TaskTemplateMaxAggregateInputType = {
    id?: true
    userId?: true
    title?: true
    category?: true
    duration?: true
    difficulty?: true
    description?: true
    milestoneTag?: true
    semesterTag?: true
    source?: true
    isActive?: true
    archivedAt?: true
    useCount?: true
    lastUsedAt?: true
    taskType?: true
    frequency?: true
    weeklySchedule?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TaskTemplateCountAggregateInputType = {
    id?: true
    userId?: true
    title?: true
    category?: true
    duration?: true
    difficulty?: true
    materials?: true
    description?: true
    routeTags?: true
    milestoneTag?: true
    semesterTag?: true
    tags?: true
    source?: true
    isActive?: true
    archivedAt?: true
    useCount?: true
    lastUsedAt?: true
    taskType?: true
    frequency?: true
    customFrequency?: true
    weeklySchedule?: true
    customScheduleDays?: true
    assessmentCriteria?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type TaskTemplateAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TaskTemplate to aggregate.
     */
    where?: TaskTemplateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TaskTemplates to fetch.
     */
    orderBy?: TaskTemplateOrderByWithRelationInput | TaskTemplateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TaskTemplateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TaskTemplates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TaskTemplates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TaskTemplates
    **/
    _count?: true | TaskTemplateCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TaskTemplateAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TaskTemplateSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TaskTemplateMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TaskTemplateMaxAggregateInputType
  }

  export type GetTaskTemplateAggregateType<T extends TaskTemplateAggregateArgs> = {
        [P in keyof T & keyof AggregateTaskTemplate]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTaskTemplate[P]>
      : GetScalarType<T[P], AggregateTaskTemplate[P]>
  }




  export type TaskTemplateGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TaskTemplateWhereInput
    orderBy?: TaskTemplateOrderByWithAggregationInput | TaskTemplateOrderByWithAggregationInput[]
    by: TaskTemplateScalarFieldEnum[] | TaskTemplateScalarFieldEnum
    having?: TaskTemplateScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TaskTemplateCountAggregateInputType | true
    _avg?: TaskTemplateAvgAggregateInputType
    _sum?: TaskTemplateSumAggregateInputType
    _min?: TaskTemplateMinAggregateInputType
    _max?: TaskTemplateMaxAggregateInputType
  }

  export type TaskTemplateGroupByOutputType = {
    id: string
    userId: string
    title: string
    category: $Enums.TaskCategory
    duration: string
    difficulty: string | null
    materials: string[]
    description: string | null
    routeTags: string[]
    milestoneTag: string | null
    semesterTag: string | null
    tags: string[]
    source: $Enums.TaskTemplateSource
    isActive: boolean
    archivedAt: Date | null
    useCount: number
    lastUsedAt: Date | null
    taskType: $Enums.TaskType
    frequency: $Enums.TaskFrequency
    customFrequency: JsonValue | null
    weeklySchedule: $Enums.TaskWeeklySchedule
    customScheduleDays: string[]
    assessmentCriteria: JsonValue
    createdAt: Date
    updatedAt: Date
    _count: TaskTemplateCountAggregateOutputType | null
    _avg: TaskTemplateAvgAggregateOutputType | null
    _sum: TaskTemplateSumAggregateOutputType | null
    _min: TaskTemplateMinAggregateOutputType | null
    _max: TaskTemplateMaxAggregateOutputType | null
  }

  type GetTaskTemplateGroupByPayload<T extends TaskTemplateGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TaskTemplateGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TaskTemplateGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TaskTemplateGroupByOutputType[P]>
            : GetScalarType<T[P], TaskTemplateGroupByOutputType[P]>
        }
      >
    >


  export type TaskTemplateSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    title?: boolean
    category?: boolean
    duration?: boolean
    difficulty?: boolean
    materials?: boolean
    description?: boolean
    routeTags?: boolean
    milestoneTag?: boolean
    semesterTag?: boolean
    tags?: boolean
    source?: boolean
    isActive?: boolean
    archivedAt?: boolean
    useCount?: boolean
    lastUsedAt?: boolean
    taskType?: boolean
    frequency?: boolean
    customFrequency?: boolean
    weeklySchedule?: boolean
    customScheduleDays?: boolean
    assessmentCriteria?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    capabilityLinks?: boolean | TaskTemplate$capabilityLinksArgs<ExtArgs>
    _count?: boolean | TaskTemplateCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["taskTemplate"]>

  export type TaskTemplateSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    title?: boolean
    category?: boolean
    duration?: boolean
    difficulty?: boolean
    materials?: boolean
    description?: boolean
    routeTags?: boolean
    milestoneTag?: boolean
    semesterTag?: boolean
    tags?: boolean
    source?: boolean
    isActive?: boolean
    archivedAt?: boolean
    useCount?: boolean
    lastUsedAt?: boolean
    taskType?: boolean
    frequency?: boolean
    customFrequency?: boolean
    weeklySchedule?: boolean
    customScheduleDays?: boolean
    assessmentCriteria?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["taskTemplate"]>

  export type TaskTemplateSelectScalar = {
    id?: boolean
    userId?: boolean
    title?: boolean
    category?: boolean
    duration?: boolean
    difficulty?: boolean
    materials?: boolean
    description?: boolean
    routeTags?: boolean
    milestoneTag?: boolean
    semesterTag?: boolean
    tags?: boolean
    source?: boolean
    isActive?: boolean
    archivedAt?: boolean
    useCount?: boolean
    lastUsedAt?: boolean
    taskType?: boolean
    frequency?: boolean
    customFrequency?: boolean
    weeklySchedule?: boolean
    customScheduleDays?: boolean
    assessmentCriteria?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type TaskTemplateInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    capabilityLinks?: boolean | TaskTemplate$capabilityLinksArgs<ExtArgs>
    _count?: boolean | TaskTemplateCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type TaskTemplateIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $TaskTemplatePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TaskTemplate"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      capabilityLinks: Prisma.$TaskCapabilityLinkPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      title: string
      category: $Enums.TaskCategory
      duration: string
      difficulty: string | null
      materials: string[]
      description: string | null
      routeTags: string[]
      milestoneTag: string | null
      semesterTag: string | null
      tags: string[]
      source: $Enums.TaskTemplateSource
      isActive: boolean
      archivedAt: Date | null
      useCount: number
      lastUsedAt: Date | null
      taskType: $Enums.TaskType
      frequency: $Enums.TaskFrequency
      customFrequency: Prisma.JsonValue | null
      weeklySchedule: $Enums.TaskWeeklySchedule
      customScheduleDays: string[]
      assessmentCriteria: Prisma.JsonValue
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["taskTemplate"]>
    composites: {}
  }

  type TaskTemplateGetPayload<S extends boolean | null | undefined | TaskTemplateDefaultArgs> = $Result.GetResult<Prisma.$TaskTemplatePayload, S>

  type TaskTemplateCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<TaskTemplateFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: TaskTemplateCountAggregateInputType | true
    }

  export interface TaskTemplateDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TaskTemplate'], meta: { name: 'TaskTemplate' } }
    /**
     * Find zero or one TaskTemplate that matches the filter.
     * @param {TaskTemplateFindUniqueArgs} args - Arguments to find a TaskTemplate
     * @example
     * // Get one TaskTemplate
     * const taskTemplate = await prisma.taskTemplate.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TaskTemplateFindUniqueArgs>(args: SelectSubset<T, TaskTemplateFindUniqueArgs<ExtArgs>>): Prisma__TaskTemplateClient<$Result.GetResult<Prisma.$TaskTemplatePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one TaskTemplate that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {TaskTemplateFindUniqueOrThrowArgs} args - Arguments to find a TaskTemplate
     * @example
     * // Get one TaskTemplate
     * const taskTemplate = await prisma.taskTemplate.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TaskTemplateFindUniqueOrThrowArgs>(args: SelectSubset<T, TaskTemplateFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TaskTemplateClient<$Result.GetResult<Prisma.$TaskTemplatePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first TaskTemplate that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskTemplateFindFirstArgs} args - Arguments to find a TaskTemplate
     * @example
     * // Get one TaskTemplate
     * const taskTemplate = await prisma.taskTemplate.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TaskTemplateFindFirstArgs>(args?: SelectSubset<T, TaskTemplateFindFirstArgs<ExtArgs>>): Prisma__TaskTemplateClient<$Result.GetResult<Prisma.$TaskTemplatePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first TaskTemplate that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskTemplateFindFirstOrThrowArgs} args - Arguments to find a TaskTemplate
     * @example
     * // Get one TaskTemplate
     * const taskTemplate = await prisma.taskTemplate.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TaskTemplateFindFirstOrThrowArgs>(args?: SelectSubset<T, TaskTemplateFindFirstOrThrowArgs<ExtArgs>>): Prisma__TaskTemplateClient<$Result.GetResult<Prisma.$TaskTemplatePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more TaskTemplates that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskTemplateFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TaskTemplates
     * const taskTemplates = await prisma.taskTemplate.findMany()
     * 
     * // Get first 10 TaskTemplates
     * const taskTemplates = await prisma.taskTemplate.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const taskTemplateWithIdOnly = await prisma.taskTemplate.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TaskTemplateFindManyArgs>(args?: SelectSubset<T, TaskTemplateFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TaskTemplatePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a TaskTemplate.
     * @param {TaskTemplateCreateArgs} args - Arguments to create a TaskTemplate.
     * @example
     * // Create one TaskTemplate
     * const TaskTemplate = await prisma.taskTemplate.create({
     *   data: {
     *     // ... data to create a TaskTemplate
     *   }
     * })
     * 
     */
    create<T extends TaskTemplateCreateArgs>(args: SelectSubset<T, TaskTemplateCreateArgs<ExtArgs>>): Prisma__TaskTemplateClient<$Result.GetResult<Prisma.$TaskTemplatePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many TaskTemplates.
     * @param {TaskTemplateCreateManyArgs} args - Arguments to create many TaskTemplates.
     * @example
     * // Create many TaskTemplates
     * const taskTemplate = await prisma.taskTemplate.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TaskTemplateCreateManyArgs>(args?: SelectSubset<T, TaskTemplateCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many TaskTemplates and returns the data saved in the database.
     * @param {TaskTemplateCreateManyAndReturnArgs} args - Arguments to create many TaskTemplates.
     * @example
     * // Create many TaskTemplates
     * const taskTemplate = await prisma.taskTemplate.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many TaskTemplates and only return the `id`
     * const taskTemplateWithIdOnly = await prisma.taskTemplate.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TaskTemplateCreateManyAndReturnArgs>(args?: SelectSubset<T, TaskTemplateCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TaskTemplatePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a TaskTemplate.
     * @param {TaskTemplateDeleteArgs} args - Arguments to delete one TaskTemplate.
     * @example
     * // Delete one TaskTemplate
     * const TaskTemplate = await prisma.taskTemplate.delete({
     *   where: {
     *     // ... filter to delete one TaskTemplate
     *   }
     * })
     * 
     */
    delete<T extends TaskTemplateDeleteArgs>(args: SelectSubset<T, TaskTemplateDeleteArgs<ExtArgs>>): Prisma__TaskTemplateClient<$Result.GetResult<Prisma.$TaskTemplatePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one TaskTemplate.
     * @param {TaskTemplateUpdateArgs} args - Arguments to update one TaskTemplate.
     * @example
     * // Update one TaskTemplate
     * const taskTemplate = await prisma.taskTemplate.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TaskTemplateUpdateArgs>(args: SelectSubset<T, TaskTemplateUpdateArgs<ExtArgs>>): Prisma__TaskTemplateClient<$Result.GetResult<Prisma.$TaskTemplatePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more TaskTemplates.
     * @param {TaskTemplateDeleteManyArgs} args - Arguments to filter TaskTemplates to delete.
     * @example
     * // Delete a few TaskTemplates
     * const { count } = await prisma.taskTemplate.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TaskTemplateDeleteManyArgs>(args?: SelectSubset<T, TaskTemplateDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TaskTemplates.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskTemplateUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TaskTemplates
     * const taskTemplate = await prisma.taskTemplate.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TaskTemplateUpdateManyArgs>(args: SelectSubset<T, TaskTemplateUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one TaskTemplate.
     * @param {TaskTemplateUpsertArgs} args - Arguments to update or create a TaskTemplate.
     * @example
     * // Update or create a TaskTemplate
     * const taskTemplate = await prisma.taskTemplate.upsert({
     *   create: {
     *     // ... data to create a TaskTemplate
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TaskTemplate we want to update
     *   }
     * })
     */
    upsert<T extends TaskTemplateUpsertArgs>(args: SelectSubset<T, TaskTemplateUpsertArgs<ExtArgs>>): Prisma__TaskTemplateClient<$Result.GetResult<Prisma.$TaskTemplatePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of TaskTemplates.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskTemplateCountArgs} args - Arguments to filter TaskTemplates to count.
     * @example
     * // Count the number of TaskTemplates
     * const count = await prisma.taskTemplate.count({
     *   where: {
     *     // ... the filter for the TaskTemplates we want to count
     *   }
     * })
    **/
    count<T extends TaskTemplateCountArgs>(
      args?: Subset<T, TaskTemplateCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TaskTemplateCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TaskTemplate.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskTemplateAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TaskTemplateAggregateArgs>(args: Subset<T, TaskTemplateAggregateArgs>): Prisma.PrismaPromise<GetTaskTemplateAggregateType<T>>

    /**
     * Group by TaskTemplate.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskTemplateGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TaskTemplateGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TaskTemplateGroupByArgs['orderBy'] }
        : { orderBy?: TaskTemplateGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TaskTemplateGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTaskTemplateGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TaskTemplate model
   */
  readonly fields: TaskTemplateFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TaskTemplate.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TaskTemplateClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    capabilityLinks<T extends TaskTemplate$capabilityLinksArgs<ExtArgs> = {}>(args?: Subset<T, TaskTemplate$capabilityLinksArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TaskCapabilityLinkPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the TaskTemplate model
   */ 
  interface TaskTemplateFieldRefs {
    readonly id: FieldRef<"TaskTemplate", 'String'>
    readonly userId: FieldRef<"TaskTemplate", 'String'>
    readonly title: FieldRef<"TaskTemplate", 'String'>
    readonly category: FieldRef<"TaskTemplate", 'TaskCategory'>
    readonly duration: FieldRef<"TaskTemplate", 'String'>
    readonly difficulty: FieldRef<"TaskTemplate", 'String'>
    readonly materials: FieldRef<"TaskTemplate", 'String[]'>
    readonly description: FieldRef<"TaskTemplate", 'String'>
    readonly routeTags: FieldRef<"TaskTemplate", 'String[]'>
    readonly milestoneTag: FieldRef<"TaskTemplate", 'String'>
    readonly semesterTag: FieldRef<"TaskTemplate", 'String'>
    readonly tags: FieldRef<"TaskTemplate", 'String[]'>
    readonly source: FieldRef<"TaskTemplate", 'TaskTemplateSource'>
    readonly isActive: FieldRef<"TaskTemplate", 'Boolean'>
    readonly archivedAt: FieldRef<"TaskTemplate", 'DateTime'>
    readonly useCount: FieldRef<"TaskTemplate", 'Int'>
    readonly lastUsedAt: FieldRef<"TaskTemplate", 'DateTime'>
    readonly taskType: FieldRef<"TaskTemplate", 'TaskType'>
    readonly frequency: FieldRef<"TaskTemplate", 'TaskFrequency'>
    readonly customFrequency: FieldRef<"TaskTemplate", 'Json'>
    readonly weeklySchedule: FieldRef<"TaskTemplate", 'TaskWeeklySchedule'>
    readonly customScheduleDays: FieldRef<"TaskTemplate", 'String[]'>
    readonly assessmentCriteria: FieldRef<"TaskTemplate", 'Json'>
    readonly createdAt: FieldRef<"TaskTemplate", 'DateTime'>
    readonly updatedAt: FieldRef<"TaskTemplate", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * TaskTemplate findUnique
   */
  export type TaskTemplateFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskTemplate
     */
    select?: TaskTemplateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskTemplateInclude<ExtArgs> | null
    /**
     * Filter, which TaskTemplate to fetch.
     */
    where: TaskTemplateWhereUniqueInput
  }

  /**
   * TaskTemplate findUniqueOrThrow
   */
  export type TaskTemplateFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskTemplate
     */
    select?: TaskTemplateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskTemplateInclude<ExtArgs> | null
    /**
     * Filter, which TaskTemplate to fetch.
     */
    where: TaskTemplateWhereUniqueInput
  }

  /**
   * TaskTemplate findFirst
   */
  export type TaskTemplateFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskTemplate
     */
    select?: TaskTemplateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskTemplateInclude<ExtArgs> | null
    /**
     * Filter, which TaskTemplate to fetch.
     */
    where?: TaskTemplateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TaskTemplates to fetch.
     */
    orderBy?: TaskTemplateOrderByWithRelationInput | TaskTemplateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TaskTemplates.
     */
    cursor?: TaskTemplateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TaskTemplates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TaskTemplates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TaskTemplates.
     */
    distinct?: TaskTemplateScalarFieldEnum | TaskTemplateScalarFieldEnum[]
  }

  /**
   * TaskTemplate findFirstOrThrow
   */
  export type TaskTemplateFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskTemplate
     */
    select?: TaskTemplateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskTemplateInclude<ExtArgs> | null
    /**
     * Filter, which TaskTemplate to fetch.
     */
    where?: TaskTemplateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TaskTemplates to fetch.
     */
    orderBy?: TaskTemplateOrderByWithRelationInput | TaskTemplateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TaskTemplates.
     */
    cursor?: TaskTemplateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TaskTemplates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TaskTemplates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TaskTemplates.
     */
    distinct?: TaskTemplateScalarFieldEnum | TaskTemplateScalarFieldEnum[]
  }

  /**
   * TaskTemplate findMany
   */
  export type TaskTemplateFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskTemplate
     */
    select?: TaskTemplateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskTemplateInclude<ExtArgs> | null
    /**
     * Filter, which TaskTemplates to fetch.
     */
    where?: TaskTemplateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TaskTemplates to fetch.
     */
    orderBy?: TaskTemplateOrderByWithRelationInput | TaskTemplateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TaskTemplates.
     */
    cursor?: TaskTemplateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TaskTemplates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TaskTemplates.
     */
    skip?: number
    distinct?: TaskTemplateScalarFieldEnum | TaskTemplateScalarFieldEnum[]
  }

  /**
   * TaskTemplate create
   */
  export type TaskTemplateCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskTemplate
     */
    select?: TaskTemplateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskTemplateInclude<ExtArgs> | null
    /**
     * The data needed to create a TaskTemplate.
     */
    data: XOR<TaskTemplateCreateInput, TaskTemplateUncheckedCreateInput>
  }

  /**
   * TaskTemplate createMany
   */
  export type TaskTemplateCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TaskTemplates.
     */
    data: TaskTemplateCreateManyInput | TaskTemplateCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TaskTemplate createManyAndReturn
   */
  export type TaskTemplateCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskTemplate
     */
    select?: TaskTemplateSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many TaskTemplates.
     */
    data: TaskTemplateCreateManyInput | TaskTemplateCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskTemplateIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * TaskTemplate update
   */
  export type TaskTemplateUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskTemplate
     */
    select?: TaskTemplateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskTemplateInclude<ExtArgs> | null
    /**
     * The data needed to update a TaskTemplate.
     */
    data: XOR<TaskTemplateUpdateInput, TaskTemplateUncheckedUpdateInput>
    /**
     * Choose, which TaskTemplate to update.
     */
    where: TaskTemplateWhereUniqueInput
  }

  /**
   * TaskTemplate updateMany
   */
  export type TaskTemplateUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TaskTemplates.
     */
    data: XOR<TaskTemplateUpdateManyMutationInput, TaskTemplateUncheckedUpdateManyInput>
    /**
     * Filter which TaskTemplates to update
     */
    where?: TaskTemplateWhereInput
  }

  /**
   * TaskTemplate upsert
   */
  export type TaskTemplateUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskTemplate
     */
    select?: TaskTemplateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskTemplateInclude<ExtArgs> | null
    /**
     * The filter to search for the TaskTemplate to update in case it exists.
     */
    where: TaskTemplateWhereUniqueInput
    /**
     * In case the TaskTemplate found by the `where` argument doesn't exist, create a new TaskTemplate with this data.
     */
    create: XOR<TaskTemplateCreateInput, TaskTemplateUncheckedCreateInput>
    /**
     * In case the TaskTemplate was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TaskTemplateUpdateInput, TaskTemplateUncheckedUpdateInput>
  }

  /**
   * TaskTemplate delete
   */
  export type TaskTemplateDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskTemplate
     */
    select?: TaskTemplateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskTemplateInclude<ExtArgs> | null
    /**
     * Filter which TaskTemplate to delete.
     */
    where: TaskTemplateWhereUniqueInput
  }

  /**
   * TaskTemplate deleteMany
   */
  export type TaskTemplateDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TaskTemplates to delete
     */
    where?: TaskTemplateWhereInput
  }

  /**
   * TaskTemplate.capabilityLinks
   */
  export type TaskTemplate$capabilityLinksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskCapabilityLink
     */
    select?: TaskCapabilityLinkSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskCapabilityLinkInclude<ExtArgs> | null
    where?: TaskCapabilityLinkWhereInput
    orderBy?: TaskCapabilityLinkOrderByWithRelationInput | TaskCapabilityLinkOrderByWithRelationInput[]
    cursor?: TaskCapabilityLinkWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TaskCapabilityLinkScalarFieldEnum | TaskCapabilityLinkScalarFieldEnum[]
  }

  /**
   * TaskTemplate without action
   */
  export type TaskTemplateDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskTemplate
     */
    select?: TaskTemplateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskTemplateInclude<ExtArgs> | null
  }


  /**
   * Model Capability
   */

  export type AggregateCapability = {
    _count: CapabilityCountAggregateOutputType | null
    _min: CapabilityMinAggregateOutputType | null
    _max: CapabilityMaxAggregateOutputType | null
  }

  export type CapabilityMinAggregateOutputType = {
    id: string | null
    userId: string | null
    name: string | null
    category: $Enums.CapabilityCategory | null
    description: string | null
    isSystem: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CapabilityMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    name: string | null
    category: $Enums.CapabilityCategory | null
    description: string | null
    isSystem: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CapabilityCountAggregateOutputType = {
    id: number
    userId: number
    name: number
    category: number
    description: number
    isSystem: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type CapabilityMinAggregateInputType = {
    id?: true
    userId?: true
    name?: true
    category?: true
    description?: true
    isSystem?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CapabilityMaxAggregateInputType = {
    id?: true
    userId?: true
    name?: true
    category?: true
    description?: true
    isSystem?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CapabilityCountAggregateInputType = {
    id?: true
    userId?: true
    name?: true
    category?: true
    description?: true
    isSystem?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type CapabilityAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Capability to aggregate.
     */
    where?: CapabilityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Capabilities to fetch.
     */
    orderBy?: CapabilityOrderByWithRelationInput | CapabilityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CapabilityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Capabilities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Capabilities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Capabilities
    **/
    _count?: true | CapabilityCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CapabilityMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CapabilityMaxAggregateInputType
  }

  export type GetCapabilityAggregateType<T extends CapabilityAggregateArgs> = {
        [P in keyof T & keyof AggregateCapability]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCapability[P]>
      : GetScalarType<T[P], AggregateCapability[P]>
  }




  export type CapabilityGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CapabilityWhereInput
    orderBy?: CapabilityOrderByWithAggregationInput | CapabilityOrderByWithAggregationInput[]
    by: CapabilityScalarFieldEnum[] | CapabilityScalarFieldEnum
    having?: CapabilityScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CapabilityCountAggregateInputType | true
    _min?: CapabilityMinAggregateInputType
    _max?: CapabilityMaxAggregateInputType
  }

  export type CapabilityGroupByOutputType = {
    id: string
    userId: string | null
    name: string
    category: $Enums.CapabilityCategory
    description: string | null
    isSystem: boolean
    createdAt: Date
    updatedAt: Date
    _count: CapabilityCountAggregateOutputType | null
    _min: CapabilityMinAggregateOutputType | null
    _max: CapabilityMaxAggregateOutputType | null
  }

  type GetCapabilityGroupByPayload<T extends CapabilityGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CapabilityGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CapabilityGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CapabilityGroupByOutputType[P]>
            : GetScalarType<T[P], CapabilityGroupByOutputType[P]>
        }
      >
    >


  export type CapabilitySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    name?: boolean
    category?: boolean
    description?: boolean
    isSystem?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | Capability$userArgs<ExtArgs>
    links?: boolean | Capability$linksArgs<ExtArgs>
    _count?: boolean | CapabilityCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["capability"]>

  export type CapabilitySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    name?: boolean
    category?: boolean
    description?: boolean
    isSystem?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | Capability$userArgs<ExtArgs>
  }, ExtArgs["result"]["capability"]>

  export type CapabilitySelectScalar = {
    id?: boolean
    userId?: boolean
    name?: boolean
    category?: boolean
    description?: boolean
    isSystem?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type CapabilityInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | Capability$userArgs<ExtArgs>
    links?: boolean | Capability$linksArgs<ExtArgs>
    _count?: boolean | CapabilityCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type CapabilityIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | Capability$userArgs<ExtArgs>
  }

  export type $CapabilityPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Capability"
    objects: {
      user: Prisma.$UserPayload<ExtArgs> | null
      links: Prisma.$TaskCapabilityLinkPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string | null
      name: string
      category: $Enums.CapabilityCategory
      description: string | null
      isSystem: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["capability"]>
    composites: {}
  }

  type CapabilityGetPayload<S extends boolean | null | undefined | CapabilityDefaultArgs> = $Result.GetResult<Prisma.$CapabilityPayload, S>

  type CapabilityCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<CapabilityFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: CapabilityCountAggregateInputType | true
    }

  export interface CapabilityDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Capability'], meta: { name: 'Capability' } }
    /**
     * Find zero or one Capability that matches the filter.
     * @param {CapabilityFindUniqueArgs} args - Arguments to find a Capability
     * @example
     * // Get one Capability
     * const capability = await prisma.capability.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CapabilityFindUniqueArgs>(args: SelectSubset<T, CapabilityFindUniqueArgs<ExtArgs>>): Prisma__CapabilityClient<$Result.GetResult<Prisma.$CapabilityPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Capability that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {CapabilityFindUniqueOrThrowArgs} args - Arguments to find a Capability
     * @example
     * // Get one Capability
     * const capability = await prisma.capability.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CapabilityFindUniqueOrThrowArgs>(args: SelectSubset<T, CapabilityFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CapabilityClient<$Result.GetResult<Prisma.$CapabilityPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Capability that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CapabilityFindFirstArgs} args - Arguments to find a Capability
     * @example
     * // Get one Capability
     * const capability = await prisma.capability.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CapabilityFindFirstArgs>(args?: SelectSubset<T, CapabilityFindFirstArgs<ExtArgs>>): Prisma__CapabilityClient<$Result.GetResult<Prisma.$CapabilityPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Capability that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CapabilityFindFirstOrThrowArgs} args - Arguments to find a Capability
     * @example
     * // Get one Capability
     * const capability = await prisma.capability.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CapabilityFindFirstOrThrowArgs>(args?: SelectSubset<T, CapabilityFindFirstOrThrowArgs<ExtArgs>>): Prisma__CapabilityClient<$Result.GetResult<Prisma.$CapabilityPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Capabilities that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CapabilityFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Capabilities
     * const capabilities = await prisma.capability.findMany()
     * 
     * // Get first 10 Capabilities
     * const capabilities = await prisma.capability.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const capabilityWithIdOnly = await prisma.capability.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CapabilityFindManyArgs>(args?: SelectSubset<T, CapabilityFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CapabilityPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Capability.
     * @param {CapabilityCreateArgs} args - Arguments to create a Capability.
     * @example
     * // Create one Capability
     * const Capability = await prisma.capability.create({
     *   data: {
     *     // ... data to create a Capability
     *   }
     * })
     * 
     */
    create<T extends CapabilityCreateArgs>(args: SelectSubset<T, CapabilityCreateArgs<ExtArgs>>): Prisma__CapabilityClient<$Result.GetResult<Prisma.$CapabilityPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Capabilities.
     * @param {CapabilityCreateManyArgs} args - Arguments to create many Capabilities.
     * @example
     * // Create many Capabilities
     * const capability = await prisma.capability.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CapabilityCreateManyArgs>(args?: SelectSubset<T, CapabilityCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Capabilities and returns the data saved in the database.
     * @param {CapabilityCreateManyAndReturnArgs} args - Arguments to create many Capabilities.
     * @example
     * // Create many Capabilities
     * const capability = await prisma.capability.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Capabilities and only return the `id`
     * const capabilityWithIdOnly = await prisma.capability.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CapabilityCreateManyAndReturnArgs>(args?: SelectSubset<T, CapabilityCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CapabilityPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Capability.
     * @param {CapabilityDeleteArgs} args - Arguments to delete one Capability.
     * @example
     * // Delete one Capability
     * const Capability = await prisma.capability.delete({
     *   where: {
     *     // ... filter to delete one Capability
     *   }
     * })
     * 
     */
    delete<T extends CapabilityDeleteArgs>(args: SelectSubset<T, CapabilityDeleteArgs<ExtArgs>>): Prisma__CapabilityClient<$Result.GetResult<Prisma.$CapabilityPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Capability.
     * @param {CapabilityUpdateArgs} args - Arguments to update one Capability.
     * @example
     * // Update one Capability
     * const capability = await prisma.capability.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CapabilityUpdateArgs>(args: SelectSubset<T, CapabilityUpdateArgs<ExtArgs>>): Prisma__CapabilityClient<$Result.GetResult<Prisma.$CapabilityPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Capabilities.
     * @param {CapabilityDeleteManyArgs} args - Arguments to filter Capabilities to delete.
     * @example
     * // Delete a few Capabilities
     * const { count } = await prisma.capability.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CapabilityDeleteManyArgs>(args?: SelectSubset<T, CapabilityDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Capabilities.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CapabilityUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Capabilities
     * const capability = await prisma.capability.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CapabilityUpdateManyArgs>(args: SelectSubset<T, CapabilityUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Capability.
     * @param {CapabilityUpsertArgs} args - Arguments to update or create a Capability.
     * @example
     * // Update or create a Capability
     * const capability = await prisma.capability.upsert({
     *   create: {
     *     // ... data to create a Capability
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Capability we want to update
     *   }
     * })
     */
    upsert<T extends CapabilityUpsertArgs>(args: SelectSubset<T, CapabilityUpsertArgs<ExtArgs>>): Prisma__CapabilityClient<$Result.GetResult<Prisma.$CapabilityPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Capabilities.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CapabilityCountArgs} args - Arguments to filter Capabilities to count.
     * @example
     * // Count the number of Capabilities
     * const count = await prisma.capability.count({
     *   where: {
     *     // ... the filter for the Capabilities we want to count
     *   }
     * })
    **/
    count<T extends CapabilityCountArgs>(
      args?: Subset<T, CapabilityCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CapabilityCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Capability.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CapabilityAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CapabilityAggregateArgs>(args: Subset<T, CapabilityAggregateArgs>): Prisma.PrismaPromise<GetCapabilityAggregateType<T>>

    /**
     * Group by Capability.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CapabilityGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CapabilityGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CapabilityGroupByArgs['orderBy'] }
        : { orderBy?: CapabilityGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CapabilityGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCapabilityGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Capability model
   */
  readonly fields: CapabilityFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Capability.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CapabilityClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends Capability$userArgs<ExtArgs> = {}>(args?: Subset<T, Capability$userArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    links<T extends Capability$linksArgs<ExtArgs> = {}>(args?: Subset<T, Capability$linksArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TaskCapabilityLinkPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Capability model
   */ 
  interface CapabilityFieldRefs {
    readonly id: FieldRef<"Capability", 'String'>
    readonly userId: FieldRef<"Capability", 'String'>
    readonly name: FieldRef<"Capability", 'String'>
    readonly category: FieldRef<"Capability", 'CapabilityCategory'>
    readonly description: FieldRef<"Capability", 'String'>
    readonly isSystem: FieldRef<"Capability", 'Boolean'>
    readonly createdAt: FieldRef<"Capability", 'DateTime'>
    readonly updatedAt: FieldRef<"Capability", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Capability findUnique
   */
  export type CapabilityFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Capability
     */
    select?: CapabilitySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CapabilityInclude<ExtArgs> | null
    /**
     * Filter, which Capability to fetch.
     */
    where: CapabilityWhereUniqueInput
  }

  /**
   * Capability findUniqueOrThrow
   */
  export type CapabilityFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Capability
     */
    select?: CapabilitySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CapabilityInclude<ExtArgs> | null
    /**
     * Filter, which Capability to fetch.
     */
    where: CapabilityWhereUniqueInput
  }

  /**
   * Capability findFirst
   */
  export type CapabilityFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Capability
     */
    select?: CapabilitySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CapabilityInclude<ExtArgs> | null
    /**
     * Filter, which Capability to fetch.
     */
    where?: CapabilityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Capabilities to fetch.
     */
    orderBy?: CapabilityOrderByWithRelationInput | CapabilityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Capabilities.
     */
    cursor?: CapabilityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Capabilities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Capabilities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Capabilities.
     */
    distinct?: CapabilityScalarFieldEnum | CapabilityScalarFieldEnum[]
  }

  /**
   * Capability findFirstOrThrow
   */
  export type CapabilityFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Capability
     */
    select?: CapabilitySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CapabilityInclude<ExtArgs> | null
    /**
     * Filter, which Capability to fetch.
     */
    where?: CapabilityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Capabilities to fetch.
     */
    orderBy?: CapabilityOrderByWithRelationInput | CapabilityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Capabilities.
     */
    cursor?: CapabilityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Capabilities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Capabilities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Capabilities.
     */
    distinct?: CapabilityScalarFieldEnum | CapabilityScalarFieldEnum[]
  }

  /**
   * Capability findMany
   */
  export type CapabilityFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Capability
     */
    select?: CapabilitySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CapabilityInclude<ExtArgs> | null
    /**
     * Filter, which Capabilities to fetch.
     */
    where?: CapabilityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Capabilities to fetch.
     */
    orderBy?: CapabilityOrderByWithRelationInput | CapabilityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Capabilities.
     */
    cursor?: CapabilityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Capabilities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Capabilities.
     */
    skip?: number
    distinct?: CapabilityScalarFieldEnum | CapabilityScalarFieldEnum[]
  }

  /**
   * Capability create
   */
  export type CapabilityCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Capability
     */
    select?: CapabilitySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CapabilityInclude<ExtArgs> | null
    /**
     * The data needed to create a Capability.
     */
    data: XOR<CapabilityCreateInput, CapabilityUncheckedCreateInput>
  }

  /**
   * Capability createMany
   */
  export type CapabilityCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Capabilities.
     */
    data: CapabilityCreateManyInput | CapabilityCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Capability createManyAndReturn
   */
  export type CapabilityCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Capability
     */
    select?: CapabilitySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Capabilities.
     */
    data: CapabilityCreateManyInput | CapabilityCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CapabilityIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Capability update
   */
  export type CapabilityUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Capability
     */
    select?: CapabilitySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CapabilityInclude<ExtArgs> | null
    /**
     * The data needed to update a Capability.
     */
    data: XOR<CapabilityUpdateInput, CapabilityUncheckedUpdateInput>
    /**
     * Choose, which Capability to update.
     */
    where: CapabilityWhereUniqueInput
  }

  /**
   * Capability updateMany
   */
  export type CapabilityUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Capabilities.
     */
    data: XOR<CapabilityUpdateManyMutationInput, CapabilityUncheckedUpdateManyInput>
    /**
     * Filter which Capabilities to update
     */
    where?: CapabilityWhereInput
  }

  /**
   * Capability upsert
   */
  export type CapabilityUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Capability
     */
    select?: CapabilitySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CapabilityInclude<ExtArgs> | null
    /**
     * The filter to search for the Capability to update in case it exists.
     */
    where: CapabilityWhereUniqueInput
    /**
     * In case the Capability found by the `where` argument doesn't exist, create a new Capability with this data.
     */
    create: XOR<CapabilityCreateInput, CapabilityUncheckedCreateInput>
    /**
     * In case the Capability was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CapabilityUpdateInput, CapabilityUncheckedUpdateInput>
  }

  /**
   * Capability delete
   */
  export type CapabilityDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Capability
     */
    select?: CapabilitySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CapabilityInclude<ExtArgs> | null
    /**
     * Filter which Capability to delete.
     */
    where: CapabilityWhereUniqueInput
  }

  /**
   * Capability deleteMany
   */
  export type CapabilityDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Capabilities to delete
     */
    where?: CapabilityWhereInput
  }

  /**
   * Capability.user
   */
  export type Capability$userArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * Capability.links
   */
  export type Capability$linksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskCapabilityLink
     */
    select?: TaskCapabilityLinkSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskCapabilityLinkInclude<ExtArgs> | null
    where?: TaskCapabilityLinkWhereInput
    orderBy?: TaskCapabilityLinkOrderByWithRelationInput | TaskCapabilityLinkOrderByWithRelationInput[]
    cursor?: TaskCapabilityLinkWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TaskCapabilityLinkScalarFieldEnum | TaskCapabilityLinkScalarFieldEnum[]
  }

  /**
   * Capability without action
   */
  export type CapabilityDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Capability
     */
    select?: CapabilitySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CapabilityInclude<ExtArgs> | null
  }


  /**
   * Model TaskCapabilityLink
   */

  export type AggregateTaskCapabilityLink = {
    _count: TaskCapabilityLinkCountAggregateOutputType | null
    _avg: TaskCapabilityLinkAvgAggregateOutputType | null
    _sum: TaskCapabilityLinkSumAggregateOutputType | null
    _min: TaskCapabilityLinkMinAggregateOutputType | null
    _max: TaskCapabilityLinkMaxAggregateOutputType | null
  }

  export type TaskCapabilityLinkAvgAggregateOutputType = {
    weight: number | null
    expectedProgress: number | null
  }

  export type TaskCapabilityLinkSumAggregateOutputType = {
    weight: number | null
    expectedProgress: number | null
  }

  export type TaskCapabilityLinkMinAggregateOutputType = {
    id: string | null
    taskTemplateId: string | null
    capabilityId: string | null
    weight: number | null
    expectedProgress: number | null
  }

  export type TaskCapabilityLinkMaxAggregateOutputType = {
    id: string | null
    taskTemplateId: string | null
    capabilityId: string | null
    weight: number | null
    expectedProgress: number | null
  }

  export type TaskCapabilityLinkCountAggregateOutputType = {
    id: number
    taskTemplateId: number
    capabilityId: number
    weight: number
    expectedProgress: number
    _all: number
  }


  export type TaskCapabilityLinkAvgAggregateInputType = {
    weight?: true
    expectedProgress?: true
  }

  export type TaskCapabilityLinkSumAggregateInputType = {
    weight?: true
    expectedProgress?: true
  }

  export type TaskCapabilityLinkMinAggregateInputType = {
    id?: true
    taskTemplateId?: true
    capabilityId?: true
    weight?: true
    expectedProgress?: true
  }

  export type TaskCapabilityLinkMaxAggregateInputType = {
    id?: true
    taskTemplateId?: true
    capabilityId?: true
    weight?: true
    expectedProgress?: true
  }

  export type TaskCapabilityLinkCountAggregateInputType = {
    id?: true
    taskTemplateId?: true
    capabilityId?: true
    weight?: true
    expectedProgress?: true
    _all?: true
  }

  export type TaskCapabilityLinkAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TaskCapabilityLink to aggregate.
     */
    where?: TaskCapabilityLinkWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TaskCapabilityLinks to fetch.
     */
    orderBy?: TaskCapabilityLinkOrderByWithRelationInput | TaskCapabilityLinkOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TaskCapabilityLinkWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TaskCapabilityLinks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TaskCapabilityLinks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TaskCapabilityLinks
    **/
    _count?: true | TaskCapabilityLinkCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TaskCapabilityLinkAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TaskCapabilityLinkSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TaskCapabilityLinkMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TaskCapabilityLinkMaxAggregateInputType
  }

  export type GetTaskCapabilityLinkAggregateType<T extends TaskCapabilityLinkAggregateArgs> = {
        [P in keyof T & keyof AggregateTaskCapabilityLink]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTaskCapabilityLink[P]>
      : GetScalarType<T[P], AggregateTaskCapabilityLink[P]>
  }




  export type TaskCapabilityLinkGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TaskCapabilityLinkWhereInput
    orderBy?: TaskCapabilityLinkOrderByWithAggregationInput | TaskCapabilityLinkOrderByWithAggregationInput[]
    by: TaskCapabilityLinkScalarFieldEnum[] | TaskCapabilityLinkScalarFieldEnum
    having?: TaskCapabilityLinkScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TaskCapabilityLinkCountAggregateInputType | true
    _avg?: TaskCapabilityLinkAvgAggregateInputType
    _sum?: TaskCapabilityLinkSumAggregateInputType
    _min?: TaskCapabilityLinkMinAggregateInputType
    _max?: TaskCapabilityLinkMaxAggregateInputType
  }

  export type TaskCapabilityLinkGroupByOutputType = {
    id: string
    taskTemplateId: string
    capabilityId: string
    weight: number
    expectedProgress: number
    _count: TaskCapabilityLinkCountAggregateOutputType | null
    _avg: TaskCapabilityLinkAvgAggregateOutputType | null
    _sum: TaskCapabilityLinkSumAggregateOutputType | null
    _min: TaskCapabilityLinkMinAggregateOutputType | null
    _max: TaskCapabilityLinkMaxAggregateOutputType | null
  }

  type GetTaskCapabilityLinkGroupByPayload<T extends TaskCapabilityLinkGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TaskCapabilityLinkGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TaskCapabilityLinkGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TaskCapabilityLinkGroupByOutputType[P]>
            : GetScalarType<T[P], TaskCapabilityLinkGroupByOutputType[P]>
        }
      >
    >


  export type TaskCapabilityLinkSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    taskTemplateId?: boolean
    capabilityId?: boolean
    weight?: boolean
    expectedProgress?: boolean
    taskTemplate?: boolean | TaskTemplateDefaultArgs<ExtArgs>
    capability?: boolean | CapabilityDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["taskCapabilityLink"]>

  export type TaskCapabilityLinkSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    taskTemplateId?: boolean
    capabilityId?: boolean
    weight?: boolean
    expectedProgress?: boolean
    taskTemplate?: boolean | TaskTemplateDefaultArgs<ExtArgs>
    capability?: boolean | CapabilityDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["taskCapabilityLink"]>

  export type TaskCapabilityLinkSelectScalar = {
    id?: boolean
    taskTemplateId?: boolean
    capabilityId?: boolean
    weight?: boolean
    expectedProgress?: boolean
  }

  export type TaskCapabilityLinkInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    taskTemplate?: boolean | TaskTemplateDefaultArgs<ExtArgs>
    capability?: boolean | CapabilityDefaultArgs<ExtArgs>
  }
  export type TaskCapabilityLinkIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    taskTemplate?: boolean | TaskTemplateDefaultArgs<ExtArgs>
    capability?: boolean | CapabilityDefaultArgs<ExtArgs>
  }

  export type $TaskCapabilityLinkPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TaskCapabilityLink"
    objects: {
      taskTemplate: Prisma.$TaskTemplatePayload<ExtArgs>
      capability: Prisma.$CapabilityPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      taskTemplateId: string
      capabilityId: string
      weight: number
      expectedProgress: number
    }, ExtArgs["result"]["taskCapabilityLink"]>
    composites: {}
  }

  type TaskCapabilityLinkGetPayload<S extends boolean | null | undefined | TaskCapabilityLinkDefaultArgs> = $Result.GetResult<Prisma.$TaskCapabilityLinkPayload, S>

  type TaskCapabilityLinkCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<TaskCapabilityLinkFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: TaskCapabilityLinkCountAggregateInputType | true
    }

  export interface TaskCapabilityLinkDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TaskCapabilityLink'], meta: { name: 'TaskCapabilityLink' } }
    /**
     * Find zero or one TaskCapabilityLink that matches the filter.
     * @param {TaskCapabilityLinkFindUniqueArgs} args - Arguments to find a TaskCapabilityLink
     * @example
     * // Get one TaskCapabilityLink
     * const taskCapabilityLink = await prisma.taskCapabilityLink.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TaskCapabilityLinkFindUniqueArgs>(args: SelectSubset<T, TaskCapabilityLinkFindUniqueArgs<ExtArgs>>): Prisma__TaskCapabilityLinkClient<$Result.GetResult<Prisma.$TaskCapabilityLinkPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one TaskCapabilityLink that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {TaskCapabilityLinkFindUniqueOrThrowArgs} args - Arguments to find a TaskCapabilityLink
     * @example
     * // Get one TaskCapabilityLink
     * const taskCapabilityLink = await prisma.taskCapabilityLink.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TaskCapabilityLinkFindUniqueOrThrowArgs>(args: SelectSubset<T, TaskCapabilityLinkFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TaskCapabilityLinkClient<$Result.GetResult<Prisma.$TaskCapabilityLinkPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first TaskCapabilityLink that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskCapabilityLinkFindFirstArgs} args - Arguments to find a TaskCapabilityLink
     * @example
     * // Get one TaskCapabilityLink
     * const taskCapabilityLink = await prisma.taskCapabilityLink.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TaskCapabilityLinkFindFirstArgs>(args?: SelectSubset<T, TaskCapabilityLinkFindFirstArgs<ExtArgs>>): Prisma__TaskCapabilityLinkClient<$Result.GetResult<Prisma.$TaskCapabilityLinkPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first TaskCapabilityLink that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskCapabilityLinkFindFirstOrThrowArgs} args - Arguments to find a TaskCapabilityLink
     * @example
     * // Get one TaskCapabilityLink
     * const taskCapabilityLink = await prisma.taskCapabilityLink.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TaskCapabilityLinkFindFirstOrThrowArgs>(args?: SelectSubset<T, TaskCapabilityLinkFindFirstOrThrowArgs<ExtArgs>>): Prisma__TaskCapabilityLinkClient<$Result.GetResult<Prisma.$TaskCapabilityLinkPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more TaskCapabilityLinks that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskCapabilityLinkFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TaskCapabilityLinks
     * const taskCapabilityLinks = await prisma.taskCapabilityLink.findMany()
     * 
     * // Get first 10 TaskCapabilityLinks
     * const taskCapabilityLinks = await prisma.taskCapabilityLink.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const taskCapabilityLinkWithIdOnly = await prisma.taskCapabilityLink.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TaskCapabilityLinkFindManyArgs>(args?: SelectSubset<T, TaskCapabilityLinkFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TaskCapabilityLinkPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a TaskCapabilityLink.
     * @param {TaskCapabilityLinkCreateArgs} args - Arguments to create a TaskCapabilityLink.
     * @example
     * // Create one TaskCapabilityLink
     * const TaskCapabilityLink = await prisma.taskCapabilityLink.create({
     *   data: {
     *     // ... data to create a TaskCapabilityLink
     *   }
     * })
     * 
     */
    create<T extends TaskCapabilityLinkCreateArgs>(args: SelectSubset<T, TaskCapabilityLinkCreateArgs<ExtArgs>>): Prisma__TaskCapabilityLinkClient<$Result.GetResult<Prisma.$TaskCapabilityLinkPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many TaskCapabilityLinks.
     * @param {TaskCapabilityLinkCreateManyArgs} args - Arguments to create many TaskCapabilityLinks.
     * @example
     * // Create many TaskCapabilityLinks
     * const taskCapabilityLink = await prisma.taskCapabilityLink.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TaskCapabilityLinkCreateManyArgs>(args?: SelectSubset<T, TaskCapabilityLinkCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many TaskCapabilityLinks and returns the data saved in the database.
     * @param {TaskCapabilityLinkCreateManyAndReturnArgs} args - Arguments to create many TaskCapabilityLinks.
     * @example
     * // Create many TaskCapabilityLinks
     * const taskCapabilityLink = await prisma.taskCapabilityLink.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many TaskCapabilityLinks and only return the `id`
     * const taskCapabilityLinkWithIdOnly = await prisma.taskCapabilityLink.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TaskCapabilityLinkCreateManyAndReturnArgs>(args?: SelectSubset<T, TaskCapabilityLinkCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TaskCapabilityLinkPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a TaskCapabilityLink.
     * @param {TaskCapabilityLinkDeleteArgs} args - Arguments to delete one TaskCapabilityLink.
     * @example
     * // Delete one TaskCapabilityLink
     * const TaskCapabilityLink = await prisma.taskCapabilityLink.delete({
     *   where: {
     *     // ... filter to delete one TaskCapabilityLink
     *   }
     * })
     * 
     */
    delete<T extends TaskCapabilityLinkDeleteArgs>(args: SelectSubset<T, TaskCapabilityLinkDeleteArgs<ExtArgs>>): Prisma__TaskCapabilityLinkClient<$Result.GetResult<Prisma.$TaskCapabilityLinkPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one TaskCapabilityLink.
     * @param {TaskCapabilityLinkUpdateArgs} args - Arguments to update one TaskCapabilityLink.
     * @example
     * // Update one TaskCapabilityLink
     * const taskCapabilityLink = await prisma.taskCapabilityLink.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TaskCapabilityLinkUpdateArgs>(args: SelectSubset<T, TaskCapabilityLinkUpdateArgs<ExtArgs>>): Prisma__TaskCapabilityLinkClient<$Result.GetResult<Prisma.$TaskCapabilityLinkPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more TaskCapabilityLinks.
     * @param {TaskCapabilityLinkDeleteManyArgs} args - Arguments to filter TaskCapabilityLinks to delete.
     * @example
     * // Delete a few TaskCapabilityLinks
     * const { count } = await prisma.taskCapabilityLink.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TaskCapabilityLinkDeleteManyArgs>(args?: SelectSubset<T, TaskCapabilityLinkDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TaskCapabilityLinks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskCapabilityLinkUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TaskCapabilityLinks
     * const taskCapabilityLink = await prisma.taskCapabilityLink.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TaskCapabilityLinkUpdateManyArgs>(args: SelectSubset<T, TaskCapabilityLinkUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one TaskCapabilityLink.
     * @param {TaskCapabilityLinkUpsertArgs} args - Arguments to update or create a TaskCapabilityLink.
     * @example
     * // Update or create a TaskCapabilityLink
     * const taskCapabilityLink = await prisma.taskCapabilityLink.upsert({
     *   create: {
     *     // ... data to create a TaskCapabilityLink
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TaskCapabilityLink we want to update
     *   }
     * })
     */
    upsert<T extends TaskCapabilityLinkUpsertArgs>(args: SelectSubset<T, TaskCapabilityLinkUpsertArgs<ExtArgs>>): Prisma__TaskCapabilityLinkClient<$Result.GetResult<Prisma.$TaskCapabilityLinkPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of TaskCapabilityLinks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskCapabilityLinkCountArgs} args - Arguments to filter TaskCapabilityLinks to count.
     * @example
     * // Count the number of TaskCapabilityLinks
     * const count = await prisma.taskCapabilityLink.count({
     *   where: {
     *     // ... the filter for the TaskCapabilityLinks we want to count
     *   }
     * })
    **/
    count<T extends TaskCapabilityLinkCountArgs>(
      args?: Subset<T, TaskCapabilityLinkCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TaskCapabilityLinkCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TaskCapabilityLink.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskCapabilityLinkAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TaskCapabilityLinkAggregateArgs>(args: Subset<T, TaskCapabilityLinkAggregateArgs>): Prisma.PrismaPromise<GetTaskCapabilityLinkAggregateType<T>>

    /**
     * Group by TaskCapabilityLink.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskCapabilityLinkGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TaskCapabilityLinkGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TaskCapabilityLinkGroupByArgs['orderBy'] }
        : { orderBy?: TaskCapabilityLinkGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TaskCapabilityLinkGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTaskCapabilityLinkGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TaskCapabilityLink model
   */
  readonly fields: TaskCapabilityLinkFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TaskCapabilityLink.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TaskCapabilityLinkClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    taskTemplate<T extends TaskTemplateDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TaskTemplateDefaultArgs<ExtArgs>>): Prisma__TaskTemplateClient<$Result.GetResult<Prisma.$TaskTemplatePayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    capability<T extends CapabilityDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CapabilityDefaultArgs<ExtArgs>>): Prisma__CapabilityClient<$Result.GetResult<Prisma.$CapabilityPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the TaskCapabilityLink model
   */ 
  interface TaskCapabilityLinkFieldRefs {
    readonly id: FieldRef<"TaskCapabilityLink", 'String'>
    readonly taskTemplateId: FieldRef<"TaskCapabilityLink", 'String'>
    readonly capabilityId: FieldRef<"TaskCapabilityLink", 'String'>
    readonly weight: FieldRef<"TaskCapabilityLink", 'Float'>
    readonly expectedProgress: FieldRef<"TaskCapabilityLink", 'Float'>
  }
    

  // Custom InputTypes
  /**
   * TaskCapabilityLink findUnique
   */
  export type TaskCapabilityLinkFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskCapabilityLink
     */
    select?: TaskCapabilityLinkSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskCapabilityLinkInclude<ExtArgs> | null
    /**
     * Filter, which TaskCapabilityLink to fetch.
     */
    where: TaskCapabilityLinkWhereUniqueInput
  }

  /**
   * TaskCapabilityLink findUniqueOrThrow
   */
  export type TaskCapabilityLinkFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskCapabilityLink
     */
    select?: TaskCapabilityLinkSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskCapabilityLinkInclude<ExtArgs> | null
    /**
     * Filter, which TaskCapabilityLink to fetch.
     */
    where: TaskCapabilityLinkWhereUniqueInput
  }

  /**
   * TaskCapabilityLink findFirst
   */
  export type TaskCapabilityLinkFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskCapabilityLink
     */
    select?: TaskCapabilityLinkSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskCapabilityLinkInclude<ExtArgs> | null
    /**
     * Filter, which TaskCapabilityLink to fetch.
     */
    where?: TaskCapabilityLinkWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TaskCapabilityLinks to fetch.
     */
    orderBy?: TaskCapabilityLinkOrderByWithRelationInput | TaskCapabilityLinkOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TaskCapabilityLinks.
     */
    cursor?: TaskCapabilityLinkWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TaskCapabilityLinks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TaskCapabilityLinks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TaskCapabilityLinks.
     */
    distinct?: TaskCapabilityLinkScalarFieldEnum | TaskCapabilityLinkScalarFieldEnum[]
  }

  /**
   * TaskCapabilityLink findFirstOrThrow
   */
  export type TaskCapabilityLinkFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskCapabilityLink
     */
    select?: TaskCapabilityLinkSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskCapabilityLinkInclude<ExtArgs> | null
    /**
     * Filter, which TaskCapabilityLink to fetch.
     */
    where?: TaskCapabilityLinkWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TaskCapabilityLinks to fetch.
     */
    orderBy?: TaskCapabilityLinkOrderByWithRelationInput | TaskCapabilityLinkOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TaskCapabilityLinks.
     */
    cursor?: TaskCapabilityLinkWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TaskCapabilityLinks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TaskCapabilityLinks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TaskCapabilityLinks.
     */
    distinct?: TaskCapabilityLinkScalarFieldEnum | TaskCapabilityLinkScalarFieldEnum[]
  }

  /**
   * TaskCapabilityLink findMany
   */
  export type TaskCapabilityLinkFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskCapabilityLink
     */
    select?: TaskCapabilityLinkSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskCapabilityLinkInclude<ExtArgs> | null
    /**
     * Filter, which TaskCapabilityLinks to fetch.
     */
    where?: TaskCapabilityLinkWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TaskCapabilityLinks to fetch.
     */
    orderBy?: TaskCapabilityLinkOrderByWithRelationInput | TaskCapabilityLinkOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TaskCapabilityLinks.
     */
    cursor?: TaskCapabilityLinkWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TaskCapabilityLinks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TaskCapabilityLinks.
     */
    skip?: number
    distinct?: TaskCapabilityLinkScalarFieldEnum | TaskCapabilityLinkScalarFieldEnum[]
  }

  /**
   * TaskCapabilityLink create
   */
  export type TaskCapabilityLinkCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskCapabilityLink
     */
    select?: TaskCapabilityLinkSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskCapabilityLinkInclude<ExtArgs> | null
    /**
     * The data needed to create a TaskCapabilityLink.
     */
    data: XOR<TaskCapabilityLinkCreateInput, TaskCapabilityLinkUncheckedCreateInput>
  }

  /**
   * TaskCapabilityLink createMany
   */
  export type TaskCapabilityLinkCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TaskCapabilityLinks.
     */
    data: TaskCapabilityLinkCreateManyInput | TaskCapabilityLinkCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TaskCapabilityLink createManyAndReturn
   */
  export type TaskCapabilityLinkCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskCapabilityLink
     */
    select?: TaskCapabilityLinkSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many TaskCapabilityLinks.
     */
    data: TaskCapabilityLinkCreateManyInput | TaskCapabilityLinkCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskCapabilityLinkIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * TaskCapabilityLink update
   */
  export type TaskCapabilityLinkUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskCapabilityLink
     */
    select?: TaskCapabilityLinkSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskCapabilityLinkInclude<ExtArgs> | null
    /**
     * The data needed to update a TaskCapabilityLink.
     */
    data: XOR<TaskCapabilityLinkUpdateInput, TaskCapabilityLinkUncheckedUpdateInput>
    /**
     * Choose, which TaskCapabilityLink to update.
     */
    where: TaskCapabilityLinkWhereUniqueInput
  }

  /**
   * TaskCapabilityLink updateMany
   */
  export type TaskCapabilityLinkUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TaskCapabilityLinks.
     */
    data: XOR<TaskCapabilityLinkUpdateManyMutationInput, TaskCapabilityLinkUncheckedUpdateManyInput>
    /**
     * Filter which TaskCapabilityLinks to update
     */
    where?: TaskCapabilityLinkWhereInput
  }

  /**
   * TaskCapabilityLink upsert
   */
  export type TaskCapabilityLinkUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskCapabilityLink
     */
    select?: TaskCapabilityLinkSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskCapabilityLinkInclude<ExtArgs> | null
    /**
     * The filter to search for the TaskCapabilityLink to update in case it exists.
     */
    where: TaskCapabilityLinkWhereUniqueInput
    /**
     * In case the TaskCapabilityLink found by the `where` argument doesn't exist, create a new TaskCapabilityLink with this data.
     */
    create: XOR<TaskCapabilityLinkCreateInput, TaskCapabilityLinkUncheckedCreateInput>
    /**
     * In case the TaskCapabilityLink was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TaskCapabilityLinkUpdateInput, TaskCapabilityLinkUncheckedUpdateInput>
  }

  /**
   * TaskCapabilityLink delete
   */
  export type TaskCapabilityLinkDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskCapabilityLink
     */
    select?: TaskCapabilityLinkSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskCapabilityLinkInclude<ExtArgs> | null
    /**
     * Filter which TaskCapabilityLink to delete.
     */
    where: TaskCapabilityLinkWhereUniqueInput
  }

  /**
   * TaskCapabilityLink deleteMany
   */
  export type TaskCapabilityLinkDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TaskCapabilityLinks to delete
     */
    where?: TaskCapabilityLinkWhereInput
  }

  /**
   * TaskCapabilityLink without action
   */
  export type TaskCapabilityLinkDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskCapabilityLink
     */
    select?: TaskCapabilityLinkSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskCapabilityLinkInclude<ExtArgs> | null
  }


  /**
   * Model WeeklyPlan
   */

  export type AggregateWeeklyPlan = {
    _count: WeeklyPlanCountAggregateOutputType | null
    _min: WeeklyPlanMinAggregateOutputType | null
    _max: WeeklyPlanMaxAggregateOutputType | null
  }

  export type WeeklyPlanMinAggregateOutputType = {
    id: string | null
    userId: string | null
    childId: string | null
    weekId: string | null
    publishedAt: Date | null
    reviewedAt: Date | null
    parentComment: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type WeeklyPlanMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    childId: string | null
    weekId: string | null
    publishedAt: Date | null
    reviewedAt: Date | null
    parentComment: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type WeeklyPlanCountAggregateOutputType = {
    id: number
    userId: number
    childId: number
    weekId: number
    tasks: number
    publishedAt: number
    reviewedAt: number
    parentComment: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type WeeklyPlanMinAggregateInputType = {
    id?: true
    userId?: true
    childId?: true
    weekId?: true
    publishedAt?: true
    reviewedAt?: true
    parentComment?: true
    createdAt?: true
    updatedAt?: true
  }

  export type WeeklyPlanMaxAggregateInputType = {
    id?: true
    userId?: true
    childId?: true
    weekId?: true
    publishedAt?: true
    reviewedAt?: true
    parentComment?: true
    createdAt?: true
    updatedAt?: true
  }

  export type WeeklyPlanCountAggregateInputType = {
    id?: true
    userId?: true
    childId?: true
    weekId?: true
    tasks?: true
    publishedAt?: true
    reviewedAt?: true
    parentComment?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type WeeklyPlanAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which WeeklyPlan to aggregate.
     */
    where?: WeeklyPlanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WeeklyPlans to fetch.
     */
    orderBy?: WeeklyPlanOrderByWithRelationInput | WeeklyPlanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: WeeklyPlanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WeeklyPlans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WeeklyPlans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned WeeklyPlans
    **/
    _count?: true | WeeklyPlanCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: WeeklyPlanMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: WeeklyPlanMaxAggregateInputType
  }

  export type GetWeeklyPlanAggregateType<T extends WeeklyPlanAggregateArgs> = {
        [P in keyof T & keyof AggregateWeeklyPlan]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateWeeklyPlan[P]>
      : GetScalarType<T[P], AggregateWeeklyPlan[P]>
  }




  export type WeeklyPlanGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WeeklyPlanWhereInput
    orderBy?: WeeklyPlanOrderByWithAggregationInput | WeeklyPlanOrderByWithAggregationInput[]
    by: WeeklyPlanScalarFieldEnum[] | WeeklyPlanScalarFieldEnum
    having?: WeeklyPlanScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: WeeklyPlanCountAggregateInputType | true
    _min?: WeeklyPlanMinAggregateInputType
    _max?: WeeklyPlanMaxAggregateInputType
  }

  export type WeeklyPlanGroupByOutputType = {
    id: string
    userId: string
    childId: string
    weekId: string
    tasks: JsonValue
    publishedAt: Date | null
    reviewedAt: Date | null
    parentComment: string | null
    createdAt: Date
    updatedAt: Date
    _count: WeeklyPlanCountAggregateOutputType | null
    _min: WeeklyPlanMinAggregateOutputType | null
    _max: WeeklyPlanMaxAggregateOutputType | null
  }

  type GetWeeklyPlanGroupByPayload<T extends WeeklyPlanGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<WeeklyPlanGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof WeeklyPlanGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], WeeklyPlanGroupByOutputType[P]>
            : GetScalarType<T[P], WeeklyPlanGroupByOutputType[P]>
        }
      >
    >


  export type WeeklyPlanSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    childId?: boolean
    weekId?: boolean
    tasks?: boolean
    publishedAt?: boolean
    reviewedAt?: boolean
    parentComment?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    child?: boolean | ChildDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["weeklyPlan"]>

  export type WeeklyPlanSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    childId?: boolean
    weekId?: boolean
    tasks?: boolean
    publishedAt?: boolean
    reviewedAt?: boolean
    parentComment?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    child?: boolean | ChildDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["weeklyPlan"]>

  export type WeeklyPlanSelectScalar = {
    id?: boolean
    userId?: boolean
    childId?: boolean
    weekId?: boolean
    tasks?: boolean
    publishedAt?: boolean
    reviewedAt?: boolean
    parentComment?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type WeeklyPlanInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    child?: boolean | ChildDefaultArgs<ExtArgs>
  }
  export type WeeklyPlanIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    child?: boolean | ChildDefaultArgs<ExtArgs>
  }

  export type $WeeklyPlanPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "WeeklyPlan"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      child: Prisma.$ChildPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      childId: string
      weekId: string
      tasks: Prisma.JsonValue
      publishedAt: Date | null
      reviewedAt: Date | null
      parentComment: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["weeklyPlan"]>
    composites: {}
  }

  type WeeklyPlanGetPayload<S extends boolean | null | undefined | WeeklyPlanDefaultArgs> = $Result.GetResult<Prisma.$WeeklyPlanPayload, S>

  type WeeklyPlanCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<WeeklyPlanFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: WeeklyPlanCountAggregateInputType | true
    }

  export interface WeeklyPlanDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['WeeklyPlan'], meta: { name: 'WeeklyPlan' } }
    /**
     * Find zero or one WeeklyPlan that matches the filter.
     * @param {WeeklyPlanFindUniqueArgs} args - Arguments to find a WeeklyPlan
     * @example
     * // Get one WeeklyPlan
     * const weeklyPlan = await prisma.weeklyPlan.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends WeeklyPlanFindUniqueArgs>(args: SelectSubset<T, WeeklyPlanFindUniqueArgs<ExtArgs>>): Prisma__WeeklyPlanClient<$Result.GetResult<Prisma.$WeeklyPlanPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one WeeklyPlan that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {WeeklyPlanFindUniqueOrThrowArgs} args - Arguments to find a WeeklyPlan
     * @example
     * // Get one WeeklyPlan
     * const weeklyPlan = await prisma.weeklyPlan.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends WeeklyPlanFindUniqueOrThrowArgs>(args: SelectSubset<T, WeeklyPlanFindUniqueOrThrowArgs<ExtArgs>>): Prisma__WeeklyPlanClient<$Result.GetResult<Prisma.$WeeklyPlanPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first WeeklyPlan that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WeeklyPlanFindFirstArgs} args - Arguments to find a WeeklyPlan
     * @example
     * // Get one WeeklyPlan
     * const weeklyPlan = await prisma.weeklyPlan.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends WeeklyPlanFindFirstArgs>(args?: SelectSubset<T, WeeklyPlanFindFirstArgs<ExtArgs>>): Prisma__WeeklyPlanClient<$Result.GetResult<Prisma.$WeeklyPlanPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first WeeklyPlan that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WeeklyPlanFindFirstOrThrowArgs} args - Arguments to find a WeeklyPlan
     * @example
     * // Get one WeeklyPlan
     * const weeklyPlan = await prisma.weeklyPlan.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends WeeklyPlanFindFirstOrThrowArgs>(args?: SelectSubset<T, WeeklyPlanFindFirstOrThrowArgs<ExtArgs>>): Prisma__WeeklyPlanClient<$Result.GetResult<Prisma.$WeeklyPlanPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more WeeklyPlans that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WeeklyPlanFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all WeeklyPlans
     * const weeklyPlans = await prisma.weeklyPlan.findMany()
     * 
     * // Get first 10 WeeklyPlans
     * const weeklyPlans = await prisma.weeklyPlan.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const weeklyPlanWithIdOnly = await prisma.weeklyPlan.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends WeeklyPlanFindManyArgs>(args?: SelectSubset<T, WeeklyPlanFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WeeklyPlanPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a WeeklyPlan.
     * @param {WeeklyPlanCreateArgs} args - Arguments to create a WeeklyPlan.
     * @example
     * // Create one WeeklyPlan
     * const WeeklyPlan = await prisma.weeklyPlan.create({
     *   data: {
     *     // ... data to create a WeeklyPlan
     *   }
     * })
     * 
     */
    create<T extends WeeklyPlanCreateArgs>(args: SelectSubset<T, WeeklyPlanCreateArgs<ExtArgs>>): Prisma__WeeklyPlanClient<$Result.GetResult<Prisma.$WeeklyPlanPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many WeeklyPlans.
     * @param {WeeklyPlanCreateManyArgs} args - Arguments to create many WeeklyPlans.
     * @example
     * // Create many WeeklyPlans
     * const weeklyPlan = await prisma.weeklyPlan.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends WeeklyPlanCreateManyArgs>(args?: SelectSubset<T, WeeklyPlanCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many WeeklyPlans and returns the data saved in the database.
     * @param {WeeklyPlanCreateManyAndReturnArgs} args - Arguments to create many WeeklyPlans.
     * @example
     * // Create many WeeklyPlans
     * const weeklyPlan = await prisma.weeklyPlan.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many WeeklyPlans and only return the `id`
     * const weeklyPlanWithIdOnly = await prisma.weeklyPlan.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends WeeklyPlanCreateManyAndReturnArgs>(args?: SelectSubset<T, WeeklyPlanCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WeeklyPlanPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a WeeklyPlan.
     * @param {WeeklyPlanDeleteArgs} args - Arguments to delete one WeeklyPlan.
     * @example
     * // Delete one WeeklyPlan
     * const WeeklyPlan = await prisma.weeklyPlan.delete({
     *   where: {
     *     // ... filter to delete one WeeklyPlan
     *   }
     * })
     * 
     */
    delete<T extends WeeklyPlanDeleteArgs>(args: SelectSubset<T, WeeklyPlanDeleteArgs<ExtArgs>>): Prisma__WeeklyPlanClient<$Result.GetResult<Prisma.$WeeklyPlanPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one WeeklyPlan.
     * @param {WeeklyPlanUpdateArgs} args - Arguments to update one WeeklyPlan.
     * @example
     * // Update one WeeklyPlan
     * const weeklyPlan = await prisma.weeklyPlan.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends WeeklyPlanUpdateArgs>(args: SelectSubset<T, WeeklyPlanUpdateArgs<ExtArgs>>): Prisma__WeeklyPlanClient<$Result.GetResult<Prisma.$WeeklyPlanPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more WeeklyPlans.
     * @param {WeeklyPlanDeleteManyArgs} args - Arguments to filter WeeklyPlans to delete.
     * @example
     * // Delete a few WeeklyPlans
     * const { count } = await prisma.weeklyPlan.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends WeeklyPlanDeleteManyArgs>(args?: SelectSubset<T, WeeklyPlanDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more WeeklyPlans.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WeeklyPlanUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many WeeklyPlans
     * const weeklyPlan = await prisma.weeklyPlan.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends WeeklyPlanUpdateManyArgs>(args: SelectSubset<T, WeeklyPlanUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one WeeklyPlan.
     * @param {WeeklyPlanUpsertArgs} args - Arguments to update or create a WeeklyPlan.
     * @example
     * // Update or create a WeeklyPlan
     * const weeklyPlan = await prisma.weeklyPlan.upsert({
     *   create: {
     *     // ... data to create a WeeklyPlan
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the WeeklyPlan we want to update
     *   }
     * })
     */
    upsert<T extends WeeklyPlanUpsertArgs>(args: SelectSubset<T, WeeklyPlanUpsertArgs<ExtArgs>>): Prisma__WeeklyPlanClient<$Result.GetResult<Prisma.$WeeklyPlanPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of WeeklyPlans.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WeeklyPlanCountArgs} args - Arguments to filter WeeklyPlans to count.
     * @example
     * // Count the number of WeeklyPlans
     * const count = await prisma.weeklyPlan.count({
     *   where: {
     *     // ... the filter for the WeeklyPlans we want to count
     *   }
     * })
    **/
    count<T extends WeeklyPlanCountArgs>(
      args?: Subset<T, WeeklyPlanCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], WeeklyPlanCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a WeeklyPlan.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WeeklyPlanAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends WeeklyPlanAggregateArgs>(args: Subset<T, WeeklyPlanAggregateArgs>): Prisma.PrismaPromise<GetWeeklyPlanAggregateType<T>>

    /**
     * Group by WeeklyPlan.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WeeklyPlanGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends WeeklyPlanGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: WeeklyPlanGroupByArgs['orderBy'] }
        : { orderBy?: WeeklyPlanGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, WeeklyPlanGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetWeeklyPlanGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the WeeklyPlan model
   */
  readonly fields: WeeklyPlanFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for WeeklyPlan.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__WeeklyPlanClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    child<T extends ChildDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ChildDefaultArgs<ExtArgs>>): Prisma__ChildClient<$Result.GetResult<Prisma.$ChildPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the WeeklyPlan model
   */ 
  interface WeeklyPlanFieldRefs {
    readonly id: FieldRef<"WeeklyPlan", 'String'>
    readonly userId: FieldRef<"WeeklyPlan", 'String'>
    readonly childId: FieldRef<"WeeklyPlan", 'String'>
    readonly weekId: FieldRef<"WeeklyPlan", 'String'>
    readonly tasks: FieldRef<"WeeklyPlan", 'Json'>
    readonly publishedAt: FieldRef<"WeeklyPlan", 'DateTime'>
    readonly reviewedAt: FieldRef<"WeeklyPlan", 'DateTime'>
    readonly parentComment: FieldRef<"WeeklyPlan", 'String'>
    readonly createdAt: FieldRef<"WeeklyPlan", 'DateTime'>
    readonly updatedAt: FieldRef<"WeeklyPlan", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * WeeklyPlan findUnique
   */
  export type WeeklyPlanFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WeeklyPlan
     */
    select?: WeeklyPlanSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WeeklyPlanInclude<ExtArgs> | null
    /**
     * Filter, which WeeklyPlan to fetch.
     */
    where: WeeklyPlanWhereUniqueInput
  }

  /**
   * WeeklyPlan findUniqueOrThrow
   */
  export type WeeklyPlanFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WeeklyPlan
     */
    select?: WeeklyPlanSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WeeklyPlanInclude<ExtArgs> | null
    /**
     * Filter, which WeeklyPlan to fetch.
     */
    where: WeeklyPlanWhereUniqueInput
  }

  /**
   * WeeklyPlan findFirst
   */
  export type WeeklyPlanFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WeeklyPlan
     */
    select?: WeeklyPlanSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WeeklyPlanInclude<ExtArgs> | null
    /**
     * Filter, which WeeklyPlan to fetch.
     */
    where?: WeeklyPlanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WeeklyPlans to fetch.
     */
    orderBy?: WeeklyPlanOrderByWithRelationInput | WeeklyPlanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for WeeklyPlans.
     */
    cursor?: WeeklyPlanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WeeklyPlans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WeeklyPlans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of WeeklyPlans.
     */
    distinct?: WeeklyPlanScalarFieldEnum | WeeklyPlanScalarFieldEnum[]
  }

  /**
   * WeeklyPlan findFirstOrThrow
   */
  export type WeeklyPlanFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WeeklyPlan
     */
    select?: WeeklyPlanSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WeeklyPlanInclude<ExtArgs> | null
    /**
     * Filter, which WeeklyPlan to fetch.
     */
    where?: WeeklyPlanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WeeklyPlans to fetch.
     */
    orderBy?: WeeklyPlanOrderByWithRelationInput | WeeklyPlanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for WeeklyPlans.
     */
    cursor?: WeeklyPlanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WeeklyPlans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WeeklyPlans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of WeeklyPlans.
     */
    distinct?: WeeklyPlanScalarFieldEnum | WeeklyPlanScalarFieldEnum[]
  }

  /**
   * WeeklyPlan findMany
   */
  export type WeeklyPlanFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WeeklyPlan
     */
    select?: WeeklyPlanSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WeeklyPlanInclude<ExtArgs> | null
    /**
     * Filter, which WeeklyPlans to fetch.
     */
    where?: WeeklyPlanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WeeklyPlans to fetch.
     */
    orderBy?: WeeklyPlanOrderByWithRelationInput | WeeklyPlanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing WeeklyPlans.
     */
    cursor?: WeeklyPlanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WeeklyPlans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WeeklyPlans.
     */
    skip?: number
    distinct?: WeeklyPlanScalarFieldEnum | WeeklyPlanScalarFieldEnum[]
  }

  /**
   * WeeklyPlan create
   */
  export type WeeklyPlanCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WeeklyPlan
     */
    select?: WeeklyPlanSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WeeklyPlanInclude<ExtArgs> | null
    /**
     * The data needed to create a WeeklyPlan.
     */
    data: XOR<WeeklyPlanCreateInput, WeeklyPlanUncheckedCreateInput>
  }

  /**
   * WeeklyPlan createMany
   */
  export type WeeklyPlanCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many WeeklyPlans.
     */
    data: WeeklyPlanCreateManyInput | WeeklyPlanCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * WeeklyPlan createManyAndReturn
   */
  export type WeeklyPlanCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WeeklyPlan
     */
    select?: WeeklyPlanSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many WeeklyPlans.
     */
    data: WeeklyPlanCreateManyInput | WeeklyPlanCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WeeklyPlanIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * WeeklyPlan update
   */
  export type WeeklyPlanUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WeeklyPlan
     */
    select?: WeeklyPlanSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WeeklyPlanInclude<ExtArgs> | null
    /**
     * The data needed to update a WeeklyPlan.
     */
    data: XOR<WeeklyPlanUpdateInput, WeeklyPlanUncheckedUpdateInput>
    /**
     * Choose, which WeeklyPlan to update.
     */
    where: WeeklyPlanWhereUniqueInput
  }

  /**
   * WeeklyPlan updateMany
   */
  export type WeeklyPlanUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update WeeklyPlans.
     */
    data: XOR<WeeklyPlanUpdateManyMutationInput, WeeklyPlanUncheckedUpdateManyInput>
    /**
     * Filter which WeeklyPlans to update
     */
    where?: WeeklyPlanWhereInput
  }

  /**
   * WeeklyPlan upsert
   */
  export type WeeklyPlanUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WeeklyPlan
     */
    select?: WeeklyPlanSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WeeklyPlanInclude<ExtArgs> | null
    /**
     * The filter to search for the WeeklyPlan to update in case it exists.
     */
    where: WeeklyPlanWhereUniqueInput
    /**
     * In case the WeeklyPlan found by the `where` argument doesn't exist, create a new WeeklyPlan with this data.
     */
    create: XOR<WeeklyPlanCreateInput, WeeklyPlanUncheckedCreateInput>
    /**
     * In case the WeeklyPlan was found with the provided `where` argument, update it with this data.
     */
    update: XOR<WeeklyPlanUpdateInput, WeeklyPlanUncheckedUpdateInput>
  }

  /**
   * WeeklyPlan delete
   */
  export type WeeklyPlanDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WeeklyPlan
     */
    select?: WeeklyPlanSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WeeklyPlanInclude<ExtArgs> | null
    /**
     * Filter which WeeklyPlan to delete.
     */
    where: WeeklyPlanWhereUniqueInput
  }

  /**
   * WeeklyPlan deleteMany
   */
  export type WeeklyPlanDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which WeeklyPlans to delete
     */
    where?: WeeklyPlanWhereInput
  }

  /**
   * WeeklyPlan without action
   */
  export type WeeklyPlanDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WeeklyPlan
     */
    select?: WeeklyPlanSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WeeklyPlanInclude<ExtArgs> | null
  }


  /**
   * Model Notification
   */

  export type AggregateNotification = {
    _count: NotificationCountAggregateOutputType | null
    _min: NotificationMinAggregateOutputType | null
    _max: NotificationMaxAggregateOutputType | null
  }

  export type NotificationMinAggregateOutputType = {
    id: string | null
    userId: string | null
    title: string | null
    content: string | null
    readAt: Date | null
    createdAt: Date | null
  }

  export type NotificationMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    title: string | null
    content: string | null
    readAt: Date | null
    createdAt: Date | null
  }

  export type NotificationCountAggregateOutputType = {
    id: number
    userId: number
    title: number
    content: number
    readAt: number
    createdAt: number
    _all: number
  }


  export type NotificationMinAggregateInputType = {
    id?: true
    userId?: true
    title?: true
    content?: true
    readAt?: true
    createdAt?: true
  }

  export type NotificationMaxAggregateInputType = {
    id?: true
    userId?: true
    title?: true
    content?: true
    readAt?: true
    createdAt?: true
  }

  export type NotificationCountAggregateInputType = {
    id?: true
    userId?: true
    title?: true
    content?: true
    readAt?: true
    createdAt?: true
    _all?: true
  }

  export type NotificationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Notification to aggregate.
     */
    where?: NotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notifications to fetch.
     */
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: NotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Notifications
    **/
    _count?: true | NotificationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: NotificationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: NotificationMaxAggregateInputType
  }

  export type GetNotificationAggregateType<T extends NotificationAggregateArgs> = {
        [P in keyof T & keyof AggregateNotification]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateNotification[P]>
      : GetScalarType<T[P], AggregateNotification[P]>
  }




  export type NotificationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NotificationWhereInput
    orderBy?: NotificationOrderByWithAggregationInput | NotificationOrderByWithAggregationInput[]
    by: NotificationScalarFieldEnum[] | NotificationScalarFieldEnum
    having?: NotificationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: NotificationCountAggregateInputType | true
    _min?: NotificationMinAggregateInputType
    _max?: NotificationMaxAggregateInputType
  }

  export type NotificationGroupByOutputType = {
    id: string
    userId: string
    title: string
    content: string
    readAt: Date | null
    createdAt: Date
    _count: NotificationCountAggregateOutputType | null
    _min: NotificationMinAggregateOutputType | null
    _max: NotificationMaxAggregateOutputType | null
  }

  type GetNotificationGroupByPayload<T extends NotificationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<NotificationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof NotificationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], NotificationGroupByOutputType[P]>
            : GetScalarType<T[P], NotificationGroupByOutputType[P]>
        }
      >
    >


  export type NotificationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    title?: boolean
    content?: boolean
    readAt?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["notification"]>

  export type NotificationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    title?: boolean
    content?: boolean
    readAt?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["notification"]>

  export type NotificationSelectScalar = {
    id?: boolean
    userId?: boolean
    title?: boolean
    content?: boolean
    readAt?: boolean
    createdAt?: boolean
  }

  export type NotificationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type NotificationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $NotificationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Notification"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      title: string
      content: string
      readAt: Date | null
      createdAt: Date
    }, ExtArgs["result"]["notification"]>
    composites: {}
  }

  type NotificationGetPayload<S extends boolean | null | undefined | NotificationDefaultArgs> = $Result.GetResult<Prisma.$NotificationPayload, S>

  type NotificationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<NotificationFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: NotificationCountAggregateInputType | true
    }

  export interface NotificationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Notification'], meta: { name: 'Notification' } }
    /**
     * Find zero or one Notification that matches the filter.
     * @param {NotificationFindUniqueArgs} args - Arguments to find a Notification
     * @example
     * // Get one Notification
     * const notification = await prisma.notification.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends NotificationFindUniqueArgs>(args: SelectSubset<T, NotificationFindUniqueArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Notification that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {NotificationFindUniqueOrThrowArgs} args - Arguments to find a Notification
     * @example
     * // Get one Notification
     * const notification = await prisma.notification.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends NotificationFindUniqueOrThrowArgs>(args: SelectSubset<T, NotificationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Notification that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationFindFirstArgs} args - Arguments to find a Notification
     * @example
     * // Get one Notification
     * const notification = await prisma.notification.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends NotificationFindFirstArgs>(args?: SelectSubset<T, NotificationFindFirstArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Notification that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationFindFirstOrThrowArgs} args - Arguments to find a Notification
     * @example
     * // Get one Notification
     * const notification = await prisma.notification.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends NotificationFindFirstOrThrowArgs>(args?: SelectSubset<T, NotificationFindFirstOrThrowArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Notifications that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Notifications
     * const notifications = await prisma.notification.findMany()
     * 
     * // Get first 10 Notifications
     * const notifications = await prisma.notification.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const notificationWithIdOnly = await prisma.notification.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends NotificationFindManyArgs>(args?: SelectSubset<T, NotificationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Notification.
     * @param {NotificationCreateArgs} args - Arguments to create a Notification.
     * @example
     * // Create one Notification
     * const Notification = await prisma.notification.create({
     *   data: {
     *     // ... data to create a Notification
     *   }
     * })
     * 
     */
    create<T extends NotificationCreateArgs>(args: SelectSubset<T, NotificationCreateArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Notifications.
     * @param {NotificationCreateManyArgs} args - Arguments to create many Notifications.
     * @example
     * // Create many Notifications
     * const notification = await prisma.notification.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends NotificationCreateManyArgs>(args?: SelectSubset<T, NotificationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Notifications and returns the data saved in the database.
     * @param {NotificationCreateManyAndReturnArgs} args - Arguments to create many Notifications.
     * @example
     * // Create many Notifications
     * const notification = await prisma.notification.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Notifications and only return the `id`
     * const notificationWithIdOnly = await prisma.notification.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends NotificationCreateManyAndReturnArgs>(args?: SelectSubset<T, NotificationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Notification.
     * @param {NotificationDeleteArgs} args - Arguments to delete one Notification.
     * @example
     * // Delete one Notification
     * const Notification = await prisma.notification.delete({
     *   where: {
     *     // ... filter to delete one Notification
     *   }
     * })
     * 
     */
    delete<T extends NotificationDeleteArgs>(args: SelectSubset<T, NotificationDeleteArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Notification.
     * @param {NotificationUpdateArgs} args - Arguments to update one Notification.
     * @example
     * // Update one Notification
     * const notification = await prisma.notification.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends NotificationUpdateArgs>(args: SelectSubset<T, NotificationUpdateArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Notifications.
     * @param {NotificationDeleteManyArgs} args - Arguments to filter Notifications to delete.
     * @example
     * // Delete a few Notifications
     * const { count } = await prisma.notification.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends NotificationDeleteManyArgs>(args?: SelectSubset<T, NotificationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Notifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Notifications
     * const notification = await prisma.notification.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends NotificationUpdateManyArgs>(args: SelectSubset<T, NotificationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Notification.
     * @param {NotificationUpsertArgs} args - Arguments to update or create a Notification.
     * @example
     * // Update or create a Notification
     * const notification = await prisma.notification.upsert({
     *   create: {
     *     // ... data to create a Notification
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Notification we want to update
     *   }
     * })
     */
    upsert<T extends NotificationUpsertArgs>(args: SelectSubset<T, NotificationUpsertArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Notifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationCountArgs} args - Arguments to filter Notifications to count.
     * @example
     * // Count the number of Notifications
     * const count = await prisma.notification.count({
     *   where: {
     *     // ... the filter for the Notifications we want to count
     *   }
     * })
    **/
    count<T extends NotificationCountArgs>(
      args?: Subset<T, NotificationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], NotificationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Notification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends NotificationAggregateArgs>(args: Subset<T, NotificationAggregateArgs>): Prisma.PrismaPromise<GetNotificationAggregateType<T>>

    /**
     * Group by Notification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends NotificationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: NotificationGroupByArgs['orderBy'] }
        : { orderBy?: NotificationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, NotificationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetNotificationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Notification model
   */
  readonly fields: NotificationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Notification.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__NotificationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Notification model
   */ 
  interface NotificationFieldRefs {
    readonly id: FieldRef<"Notification", 'String'>
    readonly userId: FieldRef<"Notification", 'String'>
    readonly title: FieldRef<"Notification", 'String'>
    readonly content: FieldRef<"Notification", 'String'>
    readonly readAt: FieldRef<"Notification", 'DateTime'>
    readonly createdAt: FieldRef<"Notification", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Notification findUnique
   */
  export type NotificationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notification to fetch.
     */
    where: NotificationWhereUniqueInput
  }

  /**
   * Notification findUniqueOrThrow
   */
  export type NotificationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notification to fetch.
     */
    where: NotificationWhereUniqueInput
  }

  /**
   * Notification findFirst
   */
  export type NotificationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notification to fetch.
     */
    where?: NotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notifications to fetch.
     */
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Notifications.
     */
    cursor?: NotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Notifications.
     */
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * Notification findFirstOrThrow
   */
  export type NotificationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notification to fetch.
     */
    where?: NotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notifications to fetch.
     */
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Notifications.
     */
    cursor?: NotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Notifications.
     */
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * Notification findMany
   */
  export type NotificationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notifications to fetch.
     */
    where?: NotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notifications to fetch.
     */
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Notifications.
     */
    cursor?: NotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notifications.
     */
    skip?: number
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * Notification create
   */
  export type NotificationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * The data needed to create a Notification.
     */
    data: XOR<NotificationCreateInput, NotificationUncheckedCreateInput>
  }

  /**
   * Notification createMany
   */
  export type NotificationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Notifications.
     */
    data: NotificationCreateManyInput | NotificationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Notification createManyAndReturn
   */
  export type NotificationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Notifications.
     */
    data: NotificationCreateManyInput | NotificationCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Notification update
   */
  export type NotificationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * The data needed to update a Notification.
     */
    data: XOR<NotificationUpdateInput, NotificationUncheckedUpdateInput>
    /**
     * Choose, which Notification to update.
     */
    where: NotificationWhereUniqueInput
  }

  /**
   * Notification updateMany
   */
  export type NotificationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Notifications.
     */
    data: XOR<NotificationUpdateManyMutationInput, NotificationUncheckedUpdateManyInput>
    /**
     * Filter which Notifications to update
     */
    where?: NotificationWhereInput
  }

  /**
   * Notification upsert
   */
  export type NotificationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * The filter to search for the Notification to update in case it exists.
     */
    where: NotificationWhereUniqueInput
    /**
     * In case the Notification found by the `where` argument doesn't exist, create a new Notification with this data.
     */
    create: XOR<NotificationCreateInput, NotificationUncheckedCreateInput>
    /**
     * In case the Notification was found with the provided `where` argument, update it with this data.
     */
    update: XOR<NotificationUpdateInput, NotificationUncheckedUpdateInput>
  }

  /**
   * Notification delete
   */
  export type NotificationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter which Notification to delete.
     */
    where: NotificationWhereUniqueInput
  }

  /**
   * Notification deleteMany
   */
  export type NotificationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Notifications to delete
     */
    where?: NotificationWhereInput
  }

  /**
   * Notification without action
   */
  export type NotificationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
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

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const UserSettingScalarFieldEnum: {
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

  export type UserSettingScalarFieldEnum = (typeof UserSettingScalarFieldEnum)[keyof typeof UserSettingScalarFieldEnum]


  export const ChildScalarFieldEnum: {
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

  export type ChildScalarFieldEnum = (typeof ChildScalarFieldEnum)[keyof typeof ChildScalarFieldEnum]


  export const PlanScalarFieldEnum: {
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

  export type PlanScalarFieldEnum = (typeof PlanScalarFieldEnum)[keyof typeof PlanScalarFieldEnum]


  export const TaskTemplateScalarFieldEnum: {
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
    weeklySchedule: 'weeklySchedule',
    customScheduleDays: 'customScheduleDays',
    assessmentCriteria: 'assessmentCriteria',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type TaskTemplateScalarFieldEnum = (typeof TaskTemplateScalarFieldEnum)[keyof typeof TaskTemplateScalarFieldEnum]


  export const CapabilityScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    name: 'name',
    category: 'category',
    description: 'description',
    isSystem: 'isSystem',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type CapabilityScalarFieldEnum = (typeof CapabilityScalarFieldEnum)[keyof typeof CapabilityScalarFieldEnum]


  export const TaskCapabilityLinkScalarFieldEnum: {
    id: 'id',
    taskTemplateId: 'taskTemplateId',
    capabilityId: 'capabilityId',
    weight: 'weight',
    expectedProgress: 'expectedProgress'
  };

  export type TaskCapabilityLinkScalarFieldEnum = (typeof TaskCapabilityLinkScalarFieldEnum)[keyof typeof TaskCapabilityLinkScalarFieldEnum]


  export const WeeklyPlanScalarFieldEnum: {
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

  export type WeeklyPlanScalarFieldEnum = (typeof WeeklyPlanScalarFieldEnum)[keyof typeof WeeklyPlanScalarFieldEnum]


  export const NotificationScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    title: 'title',
    content: 'content',
    readAt: 'readAt',
    createdAt: 'createdAt'
  };

  export type NotificationScalarFieldEnum = (typeof NotificationScalarFieldEnum)[keyof typeof NotificationScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Field references 
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'UserRole'
   */
  export type EnumUserRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserRole'>
    


  /**
   * Reference to a field of type 'UserRole[]'
   */
  export type ListEnumUserRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserRole[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'TaskCategory'
   */
  export type EnumTaskCategoryFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TaskCategory'>
    


  /**
   * Reference to a field of type 'TaskCategory[]'
   */
  export type ListEnumTaskCategoryFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TaskCategory[]'>
    


  /**
   * Reference to a field of type 'TaskTemplateSource'
   */
  export type EnumTaskTemplateSourceFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TaskTemplateSource'>
    


  /**
   * Reference to a field of type 'TaskTemplateSource[]'
   */
  export type ListEnumTaskTemplateSourceFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TaskTemplateSource[]'>
    


  /**
   * Reference to a field of type 'TaskType'
   */
  export type EnumTaskTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TaskType'>
    


  /**
   * Reference to a field of type 'TaskType[]'
   */
  export type ListEnumTaskTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TaskType[]'>
    


  /**
   * Reference to a field of type 'TaskFrequency'
   */
  export type EnumTaskFrequencyFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TaskFrequency'>
    


  /**
   * Reference to a field of type 'TaskFrequency[]'
   */
  export type ListEnumTaskFrequencyFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TaskFrequency[]'>
    


  /**
   * Reference to a field of type 'TaskWeeklySchedule'
   */
  export type EnumTaskWeeklyScheduleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TaskWeeklySchedule'>
    


  /**
   * Reference to a field of type 'TaskWeeklySchedule[]'
   */
  export type ListEnumTaskWeeklyScheduleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TaskWeeklySchedule[]'>
    


  /**
   * Reference to a field of type 'CapabilityCategory'
   */
  export type EnumCapabilityCategoryFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'CapabilityCategory'>
    


  /**
   * Reference to a field of type 'CapabilityCategory[]'
   */
  export type ListEnumCapabilityCategoryFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'CapabilityCategory[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    username?: StringFilter<"User"> | string
    passwordHash?: StringFilter<"User"> | string
    name?: StringNullableFilter<"User"> | string | null
    role?: EnumUserRoleFilter<"User"> | $Enums.UserRole
    avatarUrl?: StringNullableFilter<"User"> | string | null
    phone?: StringNullableFilter<"User"> | string | null
    email?: StringNullableFilter<"User"> | string | null
    wechatOpenId?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    children?: ChildListRelationFilter
    plans?: PlanListRelationFilter
    weeklyPlans?: WeeklyPlanListRelationFilter
    notifications?: NotificationListRelationFilter
    settings?: XOR<UserSettingNullableRelationFilter, UserSettingWhereInput> | null
    taskTemplates?: TaskTemplateListRelationFilter
    capabilities?: CapabilityListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    username?: SortOrder
    passwordHash?: SortOrder
    name?: SortOrderInput | SortOrder
    role?: SortOrder
    avatarUrl?: SortOrderInput | SortOrder
    phone?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    wechatOpenId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    children?: ChildOrderByRelationAggregateInput
    plans?: PlanOrderByRelationAggregateInput
    weeklyPlans?: WeeklyPlanOrderByRelationAggregateInput
    notifications?: NotificationOrderByRelationAggregateInput
    settings?: UserSettingOrderByWithRelationInput
    taskTemplates?: TaskTemplateOrderByRelationAggregateInput
    capabilities?: CapabilityOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    username?: string
    wechatOpenId?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    passwordHash?: StringFilter<"User"> | string
    name?: StringNullableFilter<"User"> | string | null
    role?: EnumUserRoleFilter<"User"> | $Enums.UserRole
    avatarUrl?: StringNullableFilter<"User"> | string | null
    phone?: StringNullableFilter<"User"> | string | null
    email?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    children?: ChildListRelationFilter
    plans?: PlanListRelationFilter
    weeklyPlans?: WeeklyPlanListRelationFilter
    notifications?: NotificationListRelationFilter
    settings?: XOR<UserSettingNullableRelationFilter, UserSettingWhereInput> | null
    taskTemplates?: TaskTemplateListRelationFilter
    capabilities?: CapabilityListRelationFilter
  }, "id" | "username" | "wechatOpenId">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    username?: SortOrder
    passwordHash?: SortOrder
    name?: SortOrderInput | SortOrder
    role?: SortOrder
    avatarUrl?: SortOrderInput | SortOrder
    phone?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    wechatOpenId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    username?: StringWithAggregatesFilter<"User"> | string
    passwordHash?: StringWithAggregatesFilter<"User"> | string
    name?: StringNullableWithAggregatesFilter<"User"> | string | null
    role?: EnumUserRoleWithAggregatesFilter<"User"> | $Enums.UserRole
    avatarUrl?: StringNullableWithAggregatesFilter<"User"> | string | null
    phone?: StringNullableWithAggregatesFilter<"User"> | string | null
    email?: StringNullableWithAggregatesFilter<"User"> | string | null
    wechatOpenId?: StringNullableWithAggregatesFilter<"User"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type UserSettingWhereInput = {
    AND?: UserSettingWhereInput | UserSettingWhereInput[]
    OR?: UserSettingWhereInput[]
    NOT?: UserSettingWhereInput | UserSettingWhereInput[]
    id?: StringFilter<"UserSetting"> | string
    userId?: StringFilter<"UserSetting"> | string
    theme?: StringFilter<"UserSetting"> | string
    fontSize?: StringFilter<"UserSetting"> | string
    density?: StringFilter<"UserSetting"> | string
    reducedMotion?: BoolFilter<"UserSetting"> | boolean
    defaultLandingPage?: StringFilter<"UserSetting"> | string
    defaultChildMode?: StringFilter<"UserSetting"> | string
    notificationPrefs?: JsonFilter<"UserSetting">
    reminderTime?: StringFilter<"UserSetting"> | string
    doNotDisturb?: BoolFilter<"UserSetting"> | boolean
    doNotDisturbStart?: StringNullableFilter<"UserSetting"> | string | null
    doNotDisturbEnd?: StringNullableFilter<"UserSetting"> | string | null
    createdAt?: DateTimeFilter<"UserSetting"> | Date | string
    updatedAt?: DateTimeFilter<"UserSetting"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
  }

  export type UserSettingOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    theme?: SortOrder
    fontSize?: SortOrder
    density?: SortOrder
    reducedMotion?: SortOrder
    defaultLandingPage?: SortOrder
    defaultChildMode?: SortOrder
    notificationPrefs?: SortOrder
    reminderTime?: SortOrder
    doNotDisturb?: SortOrder
    doNotDisturbStart?: SortOrderInput | SortOrder
    doNotDisturbEnd?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type UserSettingWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId?: string
    AND?: UserSettingWhereInput | UserSettingWhereInput[]
    OR?: UserSettingWhereInput[]
    NOT?: UserSettingWhereInput | UserSettingWhereInput[]
    theme?: StringFilter<"UserSetting"> | string
    fontSize?: StringFilter<"UserSetting"> | string
    density?: StringFilter<"UserSetting"> | string
    reducedMotion?: BoolFilter<"UserSetting"> | boolean
    defaultLandingPage?: StringFilter<"UserSetting"> | string
    defaultChildMode?: StringFilter<"UserSetting"> | string
    notificationPrefs?: JsonFilter<"UserSetting">
    reminderTime?: StringFilter<"UserSetting"> | string
    doNotDisturb?: BoolFilter<"UserSetting"> | boolean
    doNotDisturbStart?: StringNullableFilter<"UserSetting"> | string | null
    doNotDisturbEnd?: StringNullableFilter<"UserSetting"> | string | null
    createdAt?: DateTimeFilter<"UserSetting"> | Date | string
    updatedAt?: DateTimeFilter<"UserSetting"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
  }, "id" | "userId">

  export type UserSettingOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    theme?: SortOrder
    fontSize?: SortOrder
    density?: SortOrder
    reducedMotion?: SortOrder
    defaultLandingPage?: SortOrder
    defaultChildMode?: SortOrder
    notificationPrefs?: SortOrder
    reminderTime?: SortOrder
    doNotDisturb?: SortOrder
    doNotDisturbStart?: SortOrderInput | SortOrder
    doNotDisturbEnd?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserSettingCountOrderByAggregateInput
    _max?: UserSettingMaxOrderByAggregateInput
    _min?: UserSettingMinOrderByAggregateInput
  }

  export type UserSettingScalarWhereWithAggregatesInput = {
    AND?: UserSettingScalarWhereWithAggregatesInput | UserSettingScalarWhereWithAggregatesInput[]
    OR?: UserSettingScalarWhereWithAggregatesInput[]
    NOT?: UserSettingScalarWhereWithAggregatesInput | UserSettingScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"UserSetting"> | string
    userId?: StringWithAggregatesFilter<"UserSetting"> | string
    theme?: StringWithAggregatesFilter<"UserSetting"> | string
    fontSize?: StringWithAggregatesFilter<"UserSetting"> | string
    density?: StringWithAggregatesFilter<"UserSetting"> | string
    reducedMotion?: BoolWithAggregatesFilter<"UserSetting"> | boolean
    defaultLandingPage?: StringWithAggregatesFilter<"UserSetting"> | string
    defaultChildMode?: StringWithAggregatesFilter<"UserSetting"> | string
    notificationPrefs?: JsonWithAggregatesFilter<"UserSetting">
    reminderTime?: StringWithAggregatesFilter<"UserSetting"> | string
    doNotDisturb?: BoolWithAggregatesFilter<"UserSetting"> | boolean
    doNotDisturbStart?: StringNullableWithAggregatesFilter<"UserSetting"> | string | null
    doNotDisturbEnd?: StringNullableWithAggregatesFilter<"UserSetting"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"UserSetting"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"UserSetting"> | Date | string
  }

  export type ChildWhereInput = {
    AND?: ChildWhereInput | ChildWhereInput[]
    OR?: ChildWhereInput[]
    NOT?: ChildWhereInput | ChildWhereInput[]
    id?: StringFilter<"Child"> | string
    userId?: StringFilter<"Child"> | string
    name?: StringFilter<"Child"> | string
    grade?: IntFilter<"Child"> | number
    educationSystem?: StringFilter<"Child"> | string
    avatarColor?: StringFilter<"Child"> | string
    avatarUrl?: StringNullableFilter<"Child"> | string | null
    targetSchool?: StringNullableFilter<"Child"> | string | null
    currentSchool?: StringNullableFilter<"Child"> | string | null
    birthday?: DateTimeNullableFilter<"Child"> | Date | string | null
    notes?: StringNullableFilter<"Child"> | string | null
    routeId?: StringNullableFilter<"Child"> | string | null
    createdAt?: DateTimeFilter<"Child"> | Date | string
    updatedAt?: DateTimeFilter<"Child"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
    plans?: PlanListRelationFilter
    weeklyPlans?: WeeklyPlanListRelationFilter
  }

  export type ChildOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    name?: SortOrder
    grade?: SortOrder
    educationSystem?: SortOrder
    avatarColor?: SortOrder
    avatarUrl?: SortOrderInput | SortOrder
    targetSchool?: SortOrderInput | SortOrder
    currentSchool?: SortOrderInput | SortOrder
    birthday?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    routeId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
    plans?: PlanOrderByRelationAggregateInput
    weeklyPlans?: WeeklyPlanOrderByRelationAggregateInput
  }

  export type ChildWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ChildWhereInput | ChildWhereInput[]
    OR?: ChildWhereInput[]
    NOT?: ChildWhereInput | ChildWhereInput[]
    userId?: StringFilter<"Child"> | string
    name?: StringFilter<"Child"> | string
    grade?: IntFilter<"Child"> | number
    educationSystem?: StringFilter<"Child"> | string
    avatarColor?: StringFilter<"Child"> | string
    avatarUrl?: StringNullableFilter<"Child"> | string | null
    targetSchool?: StringNullableFilter<"Child"> | string | null
    currentSchool?: StringNullableFilter<"Child"> | string | null
    birthday?: DateTimeNullableFilter<"Child"> | Date | string | null
    notes?: StringNullableFilter<"Child"> | string | null
    routeId?: StringNullableFilter<"Child"> | string | null
    createdAt?: DateTimeFilter<"Child"> | Date | string
    updatedAt?: DateTimeFilter<"Child"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
    plans?: PlanListRelationFilter
    weeklyPlans?: WeeklyPlanListRelationFilter
  }, "id">

  export type ChildOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    name?: SortOrder
    grade?: SortOrder
    educationSystem?: SortOrder
    avatarColor?: SortOrder
    avatarUrl?: SortOrderInput | SortOrder
    targetSchool?: SortOrderInput | SortOrder
    currentSchool?: SortOrderInput | SortOrder
    birthday?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    routeId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ChildCountOrderByAggregateInput
    _avg?: ChildAvgOrderByAggregateInput
    _max?: ChildMaxOrderByAggregateInput
    _min?: ChildMinOrderByAggregateInput
    _sum?: ChildSumOrderByAggregateInput
  }

  export type ChildScalarWhereWithAggregatesInput = {
    AND?: ChildScalarWhereWithAggregatesInput | ChildScalarWhereWithAggregatesInput[]
    OR?: ChildScalarWhereWithAggregatesInput[]
    NOT?: ChildScalarWhereWithAggregatesInput | ChildScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Child"> | string
    userId?: StringWithAggregatesFilter<"Child"> | string
    name?: StringWithAggregatesFilter<"Child"> | string
    grade?: IntWithAggregatesFilter<"Child"> | number
    educationSystem?: StringWithAggregatesFilter<"Child"> | string
    avatarColor?: StringWithAggregatesFilter<"Child"> | string
    avatarUrl?: StringNullableWithAggregatesFilter<"Child"> | string | null
    targetSchool?: StringNullableWithAggregatesFilter<"Child"> | string | null
    currentSchool?: StringNullableWithAggregatesFilter<"Child"> | string | null
    birthday?: DateTimeNullableWithAggregatesFilter<"Child"> | Date | string | null
    notes?: StringNullableWithAggregatesFilter<"Child"> | string | null
    routeId?: StringNullableWithAggregatesFilter<"Child"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Child"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Child"> | Date | string
  }

  export type PlanWhereInput = {
    AND?: PlanWhereInput | PlanWhereInput[]
    OR?: PlanWhereInput[]
    NOT?: PlanWhereInput | PlanWhereInput[]
    id?: StringFilter<"Plan"> | string
    userId?: StringFilter<"Plan"> | string
    childId?: StringFilter<"Plan"> | string
    name?: StringFilter<"Plan"> | string
    type?: StringFilter<"Plan"> | string
    status?: StringFilter<"Plan"> | string
    stage?: StringFilter<"Plan"> | string
    description?: StringNullableFilter<"Plan"> | string | null
    requirements?: JsonNullableFilter<"Plan">
    milestones?: JsonNullableFilter<"Plan">
    targets?: JsonNullableFilter<"Plan">
    probability?: IntFilter<"Plan"> | number
    createdAt?: DateTimeFilter<"Plan"> | Date | string
    updatedAt?: DateTimeFilter<"Plan"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
    child?: XOR<ChildRelationFilter, ChildWhereInput>
  }

  export type PlanOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    childId?: SortOrder
    name?: SortOrder
    type?: SortOrder
    status?: SortOrder
    stage?: SortOrder
    description?: SortOrderInput | SortOrder
    requirements?: SortOrderInput | SortOrder
    milestones?: SortOrderInput | SortOrder
    targets?: SortOrderInput | SortOrder
    probability?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
    child?: ChildOrderByWithRelationInput
  }

  export type PlanWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: PlanWhereInput | PlanWhereInput[]
    OR?: PlanWhereInput[]
    NOT?: PlanWhereInput | PlanWhereInput[]
    userId?: StringFilter<"Plan"> | string
    childId?: StringFilter<"Plan"> | string
    name?: StringFilter<"Plan"> | string
    type?: StringFilter<"Plan"> | string
    status?: StringFilter<"Plan"> | string
    stage?: StringFilter<"Plan"> | string
    description?: StringNullableFilter<"Plan"> | string | null
    requirements?: JsonNullableFilter<"Plan">
    milestones?: JsonNullableFilter<"Plan">
    targets?: JsonNullableFilter<"Plan">
    probability?: IntFilter<"Plan"> | number
    createdAt?: DateTimeFilter<"Plan"> | Date | string
    updatedAt?: DateTimeFilter<"Plan"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
    child?: XOR<ChildRelationFilter, ChildWhereInput>
  }, "id">

  export type PlanOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    childId?: SortOrder
    name?: SortOrder
    type?: SortOrder
    status?: SortOrder
    stage?: SortOrder
    description?: SortOrderInput | SortOrder
    requirements?: SortOrderInput | SortOrder
    milestones?: SortOrderInput | SortOrder
    targets?: SortOrderInput | SortOrder
    probability?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: PlanCountOrderByAggregateInput
    _avg?: PlanAvgOrderByAggregateInput
    _max?: PlanMaxOrderByAggregateInput
    _min?: PlanMinOrderByAggregateInput
    _sum?: PlanSumOrderByAggregateInput
  }

  export type PlanScalarWhereWithAggregatesInput = {
    AND?: PlanScalarWhereWithAggregatesInput | PlanScalarWhereWithAggregatesInput[]
    OR?: PlanScalarWhereWithAggregatesInput[]
    NOT?: PlanScalarWhereWithAggregatesInput | PlanScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Plan"> | string
    userId?: StringWithAggregatesFilter<"Plan"> | string
    childId?: StringWithAggregatesFilter<"Plan"> | string
    name?: StringWithAggregatesFilter<"Plan"> | string
    type?: StringWithAggregatesFilter<"Plan"> | string
    status?: StringWithAggregatesFilter<"Plan"> | string
    stage?: StringWithAggregatesFilter<"Plan"> | string
    description?: StringNullableWithAggregatesFilter<"Plan"> | string | null
    requirements?: JsonNullableWithAggregatesFilter<"Plan">
    milestones?: JsonNullableWithAggregatesFilter<"Plan">
    targets?: JsonNullableWithAggregatesFilter<"Plan">
    probability?: IntWithAggregatesFilter<"Plan"> | number
    createdAt?: DateTimeWithAggregatesFilter<"Plan"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Plan"> | Date | string
  }

  export type TaskTemplateWhereInput = {
    AND?: TaskTemplateWhereInput | TaskTemplateWhereInput[]
    OR?: TaskTemplateWhereInput[]
    NOT?: TaskTemplateWhereInput | TaskTemplateWhereInput[]
    id?: StringFilter<"TaskTemplate"> | string
    userId?: StringFilter<"TaskTemplate"> | string
    title?: StringFilter<"TaskTemplate"> | string
    category?: EnumTaskCategoryFilter<"TaskTemplate"> | $Enums.TaskCategory
    duration?: StringFilter<"TaskTemplate"> | string
    difficulty?: StringNullableFilter<"TaskTemplate"> | string | null
    materials?: StringNullableListFilter<"TaskTemplate">
    description?: StringNullableFilter<"TaskTemplate"> | string | null
    routeTags?: StringNullableListFilter<"TaskTemplate">
    milestoneTag?: StringNullableFilter<"TaskTemplate"> | string | null
    semesterTag?: StringNullableFilter<"TaskTemplate"> | string | null
    tags?: StringNullableListFilter<"TaskTemplate">
    source?: EnumTaskTemplateSourceFilter<"TaskTemplate"> | $Enums.TaskTemplateSource
    isActive?: BoolFilter<"TaskTemplate"> | boolean
    archivedAt?: DateTimeNullableFilter<"TaskTemplate"> | Date | string | null
    useCount?: IntFilter<"TaskTemplate"> | number
    lastUsedAt?: DateTimeNullableFilter<"TaskTemplate"> | Date | string | null
    taskType?: EnumTaskTypeFilter<"TaskTemplate"> | $Enums.TaskType
    frequency?: EnumTaskFrequencyFilter<"TaskTemplate"> | $Enums.TaskFrequency
    customFrequency?: JsonNullableFilter<"TaskTemplate">
    weeklySchedule?: EnumTaskWeeklyScheduleFilter<"TaskTemplate"> | $Enums.TaskWeeklySchedule
    customScheduleDays?: StringNullableListFilter<"TaskTemplate">
    assessmentCriteria?: JsonFilter<"TaskTemplate">
    createdAt?: DateTimeFilter<"TaskTemplate"> | Date | string
    updatedAt?: DateTimeFilter<"TaskTemplate"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
    capabilityLinks?: TaskCapabilityLinkListRelationFilter
  }

  export type TaskTemplateOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    category?: SortOrder
    duration?: SortOrder
    difficulty?: SortOrderInput | SortOrder
    materials?: SortOrder
    description?: SortOrderInput | SortOrder
    routeTags?: SortOrder
    milestoneTag?: SortOrderInput | SortOrder
    semesterTag?: SortOrderInput | SortOrder
    tags?: SortOrder
    source?: SortOrder
    isActive?: SortOrder
    archivedAt?: SortOrderInput | SortOrder
    useCount?: SortOrder
    lastUsedAt?: SortOrderInput | SortOrder
    taskType?: SortOrder
    frequency?: SortOrder
    customFrequency?: SortOrderInput | SortOrder
    weeklySchedule?: SortOrder
    customScheduleDays?: SortOrder
    assessmentCriteria?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
    capabilityLinks?: TaskCapabilityLinkOrderByRelationAggregateInput
  }

  export type TaskTemplateWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: TaskTemplateWhereInput | TaskTemplateWhereInput[]
    OR?: TaskTemplateWhereInput[]
    NOT?: TaskTemplateWhereInput | TaskTemplateWhereInput[]
    userId?: StringFilter<"TaskTemplate"> | string
    title?: StringFilter<"TaskTemplate"> | string
    category?: EnumTaskCategoryFilter<"TaskTemplate"> | $Enums.TaskCategory
    duration?: StringFilter<"TaskTemplate"> | string
    difficulty?: StringNullableFilter<"TaskTemplate"> | string | null
    materials?: StringNullableListFilter<"TaskTemplate">
    description?: StringNullableFilter<"TaskTemplate"> | string | null
    routeTags?: StringNullableListFilter<"TaskTemplate">
    milestoneTag?: StringNullableFilter<"TaskTemplate"> | string | null
    semesterTag?: StringNullableFilter<"TaskTemplate"> | string | null
    tags?: StringNullableListFilter<"TaskTemplate">
    source?: EnumTaskTemplateSourceFilter<"TaskTemplate"> | $Enums.TaskTemplateSource
    isActive?: BoolFilter<"TaskTemplate"> | boolean
    archivedAt?: DateTimeNullableFilter<"TaskTemplate"> | Date | string | null
    useCount?: IntFilter<"TaskTemplate"> | number
    lastUsedAt?: DateTimeNullableFilter<"TaskTemplate"> | Date | string | null
    taskType?: EnumTaskTypeFilter<"TaskTemplate"> | $Enums.TaskType
    frequency?: EnumTaskFrequencyFilter<"TaskTemplate"> | $Enums.TaskFrequency
    customFrequency?: JsonNullableFilter<"TaskTemplate">
    weeklySchedule?: EnumTaskWeeklyScheduleFilter<"TaskTemplate"> | $Enums.TaskWeeklySchedule
    customScheduleDays?: StringNullableListFilter<"TaskTemplate">
    assessmentCriteria?: JsonFilter<"TaskTemplate">
    createdAt?: DateTimeFilter<"TaskTemplate"> | Date | string
    updatedAt?: DateTimeFilter<"TaskTemplate"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
    capabilityLinks?: TaskCapabilityLinkListRelationFilter
  }, "id">

  export type TaskTemplateOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    category?: SortOrder
    duration?: SortOrder
    difficulty?: SortOrderInput | SortOrder
    materials?: SortOrder
    description?: SortOrderInput | SortOrder
    routeTags?: SortOrder
    milestoneTag?: SortOrderInput | SortOrder
    semesterTag?: SortOrderInput | SortOrder
    tags?: SortOrder
    source?: SortOrder
    isActive?: SortOrder
    archivedAt?: SortOrderInput | SortOrder
    useCount?: SortOrder
    lastUsedAt?: SortOrderInput | SortOrder
    taskType?: SortOrder
    frequency?: SortOrder
    customFrequency?: SortOrderInput | SortOrder
    weeklySchedule?: SortOrder
    customScheduleDays?: SortOrder
    assessmentCriteria?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: TaskTemplateCountOrderByAggregateInput
    _avg?: TaskTemplateAvgOrderByAggregateInput
    _max?: TaskTemplateMaxOrderByAggregateInput
    _min?: TaskTemplateMinOrderByAggregateInput
    _sum?: TaskTemplateSumOrderByAggregateInput
  }

  export type TaskTemplateScalarWhereWithAggregatesInput = {
    AND?: TaskTemplateScalarWhereWithAggregatesInput | TaskTemplateScalarWhereWithAggregatesInput[]
    OR?: TaskTemplateScalarWhereWithAggregatesInput[]
    NOT?: TaskTemplateScalarWhereWithAggregatesInput | TaskTemplateScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"TaskTemplate"> | string
    userId?: StringWithAggregatesFilter<"TaskTemplate"> | string
    title?: StringWithAggregatesFilter<"TaskTemplate"> | string
    category?: EnumTaskCategoryWithAggregatesFilter<"TaskTemplate"> | $Enums.TaskCategory
    duration?: StringWithAggregatesFilter<"TaskTemplate"> | string
    difficulty?: StringNullableWithAggregatesFilter<"TaskTemplate"> | string | null
    materials?: StringNullableListFilter<"TaskTemplate">
    description?: StringNullableWithAggregatesFilter<"TaskTemplate"> | string | null
    routeTags?: StringNullableListFilter<"TaskTemplate">
    milestoneTag?: StringNullableWithAggregatesFilter<"TaskTemplate"> | string | null
    semesterTag?: StringNullableWithAggregatesFilter<"TaskTemplate"> | string | null
    tags?: StringNullableListFilter<"TaskTemplate">
    source?: EnumTaskTemplateSourceWithAggregatesFilter<"TaskTemplate"> | $Enums.TaskTemplateSource
    isActive?: BoolWithAggregatesFilter<"TaskTemplate"> | boolean
    archivedAt?: DateTimeNullableWithAggregatesFilter<"TaskTemplate"> | Date | string | null
    useCount?: IntWithAggregatesFilter<"TaskTemplate"> | number
    lastUsedAt?: DateTimeNullableWithAggregatesFilter<"TaskTemplate"> | Date | string | null
    taskType?: EnumTaskTypeWithAggregatesFilter<"TaskTemplate"> | $Enums.TaskType
    frequency?: EnumTaskFrequencyWithAggregatesFilter<"TaskTemplate"> | $Enums.TaskFrequency
    customFrequency?: JsonNullableWithAggregatesFilter<"TaskTemplate">
    weeklySchedule?: EnumTaskWeeklyScheduleWithAggregatesFilter<"TaskTemplate"> | $Enums.TaskWeeklySchedule
    customScheduleDays?: StringNullableListFilter<"TaskTemplate">
    assessmentCriteria?: JsonWithAggregatesFilter<"TaskTemplate">
    createdAt?: DateTimeWithAggregatesFilter<"TaskTemplate"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"TaskTemplate"> | Date | string
  }

  export type CapabilityWhereInput = {
    AND?: CapabilityWhereInput | CapabilityWhereInput[]
    OR?: CapabilityWhereInput[]
    NOT?: CapabilityWhereInput | CapabilityWhereInput[]
    id?: StringFilter<"Capability"> | string
    userId?: StringNullableFilter<"Capability"> | string | null
    name?: StringFilter<"Capability"> | string
    category?: EnumCapabilityCategoryFilter<"Capability"> | $Enums.CapabilityCategory
    description?: StringNullableFilter<"Capability"> | string | null
    isSystem?: BoolFilter<"Capability"> | boolean
    createdAt?: DateTimeFilter<"Capability"> | Date | string
    updatedAt?: DateTimeFilter<"Capability"> | Date | string
    user?: XOR<UserNullableRelationFilter, UserWhereInput> | null
    links?: TaskCapabilityLinkListRelationFilter
  }

  export type CapabilityOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrderInput | SortOrder
    name?: SortOrder
    category?: SortOrder
    description?: SortOrderInput | SortOrder
    isSystem?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
    links?: TaskCapabilityLinkOrderByRelationAggregateInput
  }

  export type CapabilityWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: CapabilityWhereInput | CapabilityWhereInput[]
    OR?: CapabilityWhereInput[]
    NOT?: CapabilityWhereInput | CapabilityWhereInput[]
    userId?: StringNullableFilter<"Capability"> | string | null
    name?: StringFilter<"Capability"> | string
    category?: EnumCapabilityCategoryFilter<"Capability"> | $Enums.CapabilityCategory
    description?: StringNullableFilter<"Capability"> | string | null
    isSystem?: BoolFilter<"Capability"> | boolean
    createdAt?: DateTimeFilter<"Capability"> | Date | string
    updatedAt?: DateTimeFilter<"Capability"> | Date | string
    user?: XOR<UserNullableRelationFilter, UserWhereInput> | null
    links?: TaskCapabilityLinkListRelationFilter
  }, "id">

  export type CapabilityOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrderInput | SortOrder
    name?: SortOrder
    category?: SortOrder
    description?: SortOrderInput | SortOrder
    isSystem?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: CapabilityCountOrderByAggregateInput
    _max?: CapabilityMaxOrderByAggregateInput
    _min?: CapabilityMinOrderByAggregateInput
  }

  export type CapabilityScalarWhereWithAggregatesInput = {
    AND?: CapabilityScalarWhereWithAggregatesInput | CapabilityScalarWhereWithAggregatesInput[]
    OR?: CapabilityScalarWhereWithAggregatesInput[]
    NOT?: CapabilityScalarWhereWithAggregatesInput | CapabilityScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Capability"> | string
    userId?: StringNullableWithAggregatesFilter<"Capability"> | string | null
    name?: StringWithAggregatesFilter<"Capability"> | string
    category?: EnumCapabilityCategoryWithAggregatesFilter<"Capability"> | $Enums.CapabilityCategory
    description?: StringNullableWithAggregatesFilter<"Capability"> | string | null
    isSystem?: BoolWithAggregatesFilter<"Capability"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"Capability"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Capability"> | Date | string
  }

  export type TaskCapabilityLinkWhereInput = {
    AND?: TaskCapabilityLinkWhereInput | TaskCapabilityLinkWhereInput[]
    OR?: TaskCapabilityLinkWhereInput[]
    NOT?: TaskCapabilityLinkWhereInput | TaskCapabilityLinkWhereInput[]
    id?: StringFilter<"TaskCapabilityLink"> | string
    taskTemplateId?: StringFilter<"TaskCapabilityLink"> | string
    capabilityId?: StringFilter<"TaskCapabilityLink"> | string
    weight?: FloatFilter<"TaskCapabilityLink"> | number
    expectedProgress?: FloatFilter<"TaskCapabilityLink"> | number
    taskTemplate?: XOR<TaskTemplateRelationFilter, TaskTemplateWhereInput>
    capability?: XOR<CapabilityRelationFilter, CapabilityWhereInput>
  }

  export type TaskCapabilityLinkOrderByWithRelationInput = {
    id?: SortOrder
    taskTemplateId?: SortOrder
    capabilityId?: SortOrder
    weight?: SortOrder
    expectedProgress?: SortOrder
    taskTemplate?: TaskTemplateOrderByWithRelationInput
    capability?: CapabilityOrderByWithRelationInput
  }

  export type TaskCapabilityLinkWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    taskTemplateId_capabilityId?: TaskCapabilityLinkTaskTemplateIdCapabilityIdCompoundUniqueInput
    AND?: TaskCapabilityLinkWhereInput | TaskCapabilityLinkWhereInput[]
    OR?: TaskCapabilityLinkWhereInput[]
    NOT?: TaskCapabilityLinkWhereInput | TaskCapabilityLinkWhereInput[]
    taskTemplateId?: StringFilter<"TaskCapabilityLink"> | string
    capabilityId?: StringFilter<"TaskCapabilityLink"> | string
    weight?: FloatFilter<"TaskCapabilityLink"> | number
    expectedProgress?: FloatFilter<"TaskCapabilityLink"> | number
    taskTemplate?: XOR<TaskTemplateRelationFilter, TaskTemplateWhereInput>
    capability?: XOR<CapabilityRelationFilter, CapabilityWhereInput>
  }, "id" | "taskTemplateId_capabilityId">

  export type TaskCapabilityLinkOrderByWithAggregationInput = {
    id?: SortOrder
    taskTemplateId?: SortOrder
    capabilityId?: SortOrder
    weight?: SortOrder
    expectedProgress?: SortOrder
    _count?: TaskCapabilityLinkCountOrderByAggregateInput
    _avg?: TaskCapabilityLinkAvgOrderByAggregateInput
    _max?: TaskCapabilityLinkMaxOrderByAggregateInput
    _min?: TaskCapabilityLinkMinOrderByAggregateInput
    _sum?: TaskCapabilityLinkSumOrderByAggregateInput
  }

  export type TaskCapabilityLinkScalarWhereWithAggregatesInput = {
    AND?: TaskCapabilityLinkScalarWhereWithAggregatesInput | TaskCapabilityLinkScalarWhereWithAggregatesInput[]
    OR?: TaskCapabilityLinkScalarWhereWithAggregatesInput[]
    NOT?: TaskCapabilityLinkScalarWhereWithAggregatesInput | TaskCapabilityLinkScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"TaskCapabilityLink"> | string
    taskTemplateId?: StringWithAggregatesFilter<"TaskCapabilityLink"> | string
    capabilityId?: StringWithAggregatesFilter<"TaskCapabilityLink"> | string
    weight?: FloatWithAggregatesFilter<"TaskCapabilityLink"> | number
    expectedProgress?: FloatWithAggregatesFilter<"TaskCapabilityLink"> | number
  }

  export type WeeklyPlanWhereInput = {
    AND?: WeeklyPlanWhereInput | WeeklyPlanWhereInput[]
    OR?: WeeklyPlanWhereInput[]
    NOT?: WeeklyPlanWhereInput | WeeklyPlanWhereInput[]
    id?: StringFilter<"WeeklyPlan"> | string
    userId?: StringFilter<"WeeklyPlan"> | string
    childId?: StringFilter<"WeeklyPlan"> | string
    weekId?: StringFilter<"WeeklyPlan"> | string
    tasks?: JsonFilter<"WeeklyPlan">
    publishedAt?: DateTimeNullableFilter<"WeeklyPlan"> | Date | string | null
    reviewedAt?: DateTimeNullableFilter<"WeeklyPlan"> | Date | string | null
    parentComment?: StringNullableFilter<"WeeklyPlan"> | string | null
    createdAt?: DateTimeFilter<"WeeklyPlan"> | Date | string
    updatedAt?: DateTimeFilter<"WeeklyPlan"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
    child?: XOR<ChildRelationFilter, ChildWhereInput>
  }

  export type WeeklyPlanOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    childId?: SortOrder
    weekId?: SortOrder
    tasks?: SortOrder
    publishedAt?: SortOrderInput | SortOrder
    reviewedAt?: SortOrderInput | SortOrder
    parentComment?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
    child?: ChildOrderByWithRelationInput
  }

  export type WeeklyPlanWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    childId_weekId?: WeeklyPlanChildIdWeekIdCompoundUniqueInput
    AND?: WeeklyPlanWhereInput | WeeklyPlanWhereInput[]
    OR?: WeeklyPlanWhereInput[]
    NOT?: WeeklyPlanWhereInput | WeeklyPlanWhereInput[]
    userId?: StringFilter<"WeeklyPlan"> | string
    childId?: StringFilter<"WeeklyPlan"> | string
    weekId?: StringFilter<"WeeklyPlan"> | string
    tasks?: JsonFilter<"WeeklyPlan">
    publishedAt?: DateTimeNullableFilter<"WeeklyPlan"> | Date | string | null
    reviewedAt?: DateTimeNullableFilter<"WeeklyPlan"> | Date | string | null
    parentComment?: StringNullableFilter<"WeeklyPlan"> | string | null
    createdAt?: DateTimeFilter<"WeeklyPlan"> | Date | string
    updatedAt?: DateTimeFilter<"WeeklyPlan"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
    child?: XOR<ChildRelationFilter, ChildWhereInput>
  }, "id" | "childId_weekId">

  export type WeeklyPlanOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    childId?: SortOrder
    weekId?: SortOrder
    tasks?: SortOrder
    publishedAt?: SortOrderInput | SortOrder
    reviewedAt?: SortOrderInput | SortOrder
    parentComment?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: WeeklyPlanCountOrderByAggregateInput
    _max?: WeeklyPlanMaxOrderByAggregateInput
    _min?: WeeklyPlanMinOrderByAggregateInput
  }

  export type WeeklyPlanScalarWhereWithAggregatesInput = {
    AND?: WeeklyPlanScalarWhereWithAggregatesInput | WeeklyPlanScalarWhereWithAggregatesInput[]
    OR?: WeeklyPlanScalarWhereWithAggregatesInput[]
    NOT?: WeeklyPlanScalarWhereWithAggregatesInput | WeeklyPlanScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"WeeklyPlan"> | string
    userId?: StringWithAggregatesFilter<"WeeklyPlan"> | string
    childId?: StringWithAggregatesFilter<"WeeklyPlan"> | string
    weekId?: StringWithAggregatesFilter<"WeeklyPlan"> | string
    tasks?: JsonWithAggregatesFilter<"WeeklyPlan">
    publishedAt?: DateTimeNullableWithAggregatesFilter<"WeeklyPlan"> | Date | string | null
    reviewedAt?: DateTimeNullableWithAggregatesFilter<"WeeklyPlan"> | Date | string | null
    parentComment?: StringNullableWithAggregatesFilter<"WeeklyPlan"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"WeeklyPlan"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"WeeklyPlan"> | Date | string
  }

  export type NotificationWhereInput = {
    AND?: NotificationWhereInput | NotificationWhereInput[]
    OR?: NotificationWhereInput[]
    NOT?: NotificationWhereInput | NotificationWhereInput[]
    id?: StringFilter<"Notification"> | string
    userId?: StringFilter<"Notification"> | string
    title?: StringFilter<"Notification"> | string
    content?: StringFilter<"Notification"> | string
    readAt?: DateTimeNullableFilter<"Notification"> | Date | string | null
    createdAt?: DateTimeFilter<"Notification"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
  }

  export type NotificationOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    content?: SortOrder
    readAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type NotificationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: NotificationWhereInput | NotificationWhereInput[]
    OR?: NotificationWhereInput[]
    NOT?: NotificationWhereInput | NotificationWhereInput[]
    userId?: StringFilter<"Notification"> | string
    title?: StringFilter<"Notification"> | string
    content?: StringFilter<"Notification"> | string
    readAt?: DateTimeNullableFilter<"Notification"> | Date | string | null
    createdAt?: DateTimeFilter<"Notification"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
  }, "id">

  export type NotificationOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    content?: SortOrder
    readAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: NotificationCountOrderByAggregateInput
    _max?: NotificationMaxOrderByAggregateInput
    _min?: NotificationMinOrderByAggregateInput
  }

  export type NotificationScalarWhereWithAggregatesInput = {
    AND?: NotificationScalarWhereWithAggregatesInput | NotificationScalarWhereWithAggregatesInput[]
    OR?: NotificationScalarWhereWithAggregatesInput[]
    NOT?: NotificationScalarWhereWithAggregatesInput | NotificationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Notification"> | string
    userId?: StringWithAggregatesFilter<"Notification"> | string
    title?: StringWithAggregatesFilter<"Notification"> | string
    content?: StringWithAggregatesFilter<"Notification"> | string
    readAt?: DateTimeNullableWithAggregatesFilter<"Notification"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Notification"> | Date | string
  }

  export type UserCreateInput = {
    id?: string
    username: string
    passwordHash: string
    name?: string | null
    role?: $Enums.UserRole
    avatarUrl?: string | null
    phone?: string | null
    email?: string | null
    wechatOpenId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    children?: ChildCreateNestedManyWithoutUserInput
    plans?: PlanCreateNestedManyWithoutUserInput
    weeklyPlans?: WeeklyPlanCreateNestedManyWithoutUserInput
    notifications?: NotificationCreateNestedManyWithoutUserInput
    settings?: UserSettingCreateNestedOneWithoutUserInput
    taskTemplates?: TaskTemplateCreateNestedManyWithoutUserInput
    capabilities?: CapabilityCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    username: string
    passwordHash: string
    name?: string | null
    role?: $Enums.UserRole
    avatarUrl?: string | null
    phone?: string | null
    email?: string | null
    wechatOpenId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    children?: ChildUncheckedCreateNestedManyWithoutUserInput
    plans?: PlanUncheckedCreateNestedManyWithoutUserInput
    weeklyPlans?: WeeklyPlanUncheckedCreateNestedManyWithoutUserInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutUserInput
    settings?: UserSettingUncheckedCreateNestedOneWithoutUserInput
    taskTemplates?: TaskTemplateUncheckedCreateNestedManyWithoutUserInput
    capabilities?: CapabilityUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    wechatOpenId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    children?: ChildUpdateManyWithoutUserNestedInput
    plans?: PlanUpdateManyWithoutUserNestedInput
    weeklyPlans?: WeeklyPlanUpdateManyWithoutUserNestedInput
    notifications?: NotificationUpdateManyWithoutUserNestedInput
    settings?: UserSettingUpdateOneWithoutUserNestedInput
    taskTemplates?: TaskTemplateUpdateManyWithoutUserNestedInput
    capabilities?: CapabilityUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    wechatOpenId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    children?: ChildUncheckedUpdateManyWithoutUserNestedInput
    plans?: PlanUncheckedUpdateManyWithoutUserNestedInput
    weeklyPlans?: WeeklyPlanUncheckedUpdateManyWithoutUserNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutUserNestedInput
    settings?: UserSettingUncheckedUpdateOneWithoutUserNestedInput
    taskTemplates?: TaskTemplateUncheckedUpdateManyWithoutUserNestedInput
    capabilities?: CapabilityUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    username: string
    passwordHash: string
    name?: string | null
    role?: $Enums.UserRole
    avatarUrl?: string | null
    phone?: string | null
    email?: string | null
    wechatOpenId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    wechatOpenId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    wechatOpenId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserSettingCreateInput = {
    id?: string
    theme?: string
    fontSize?: string
    density?: string
    reducedMotion?: boolean
    defaultLandingPage?: string
    defaultChildMode?: string
    notificationPrefs?: JsonNullValueInput | InputJsonValue
    reminderTime?: string
    doNotDisturb?: boolean
    doNotDisturbStart?: string | null
    doNotDisturbEnd?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutSettingsInput
  }

  export type UserSettingUncheckedCreateInput = {
    id?: string
    userId: string
    theme?: string
    fontSize?: string
    density?: string
    reducedMotion?: boolean
    defaultLandingPage?: string
    defaultChildMode?: string
    notificationPrefs?: JsonNullValueInput | InputJsonValue
    reminderTime?: string
    doNotDisturb?: boolean
    doNotDisturbStart?: string | null
    doNotDisturbEnd?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserSettingUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    theme?: StringFieldUpdateOperationsInput | string
    fontSize?: StringFieldUpdateOperationsInput | string
    density?: StringFieldUpdateOperationsInput | string
    reducedMotion?: BoolFieldUpdateOperationsInput | boolean
    defaultLandingPage?: StringFieldUpdateOperationsInput | string
    defaultChildMode?: StringFieldUpdateOperationsInput | string
    notificationPrefs?: JsonNullValueInput | InputJsonValue
    reminderTime?: StringFieldUpdateOperationsInput | string
    doNotDisturb?: BoolFieldUpdateOperationsInput | boolean
    doNotDisturbStart?: NullableStringFieldUpdateOperationsInput | string | null
    doNotDisturbEnd?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutSettingsNestedInput
  }

  export type UserSettingUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    theme?: StringFieldUpdateOperationsInput | string
    fontSize?: StringFieldUpdateOperationsInput | string
    density?: StringFieldUpdateOperationsInput | string
    reducedMotion?: BoolFieldUpdateOperationsInput | boolean
    defaultLandingPage?: StringFieldUpdateOperationsInput | string
    defaultChildMode?: StringFieldUpdateOperationsInput | string
    notificationPrefs?: JsonNullValueInput | InputJsonValue
    reminderTime?: StringFieldUpdateOperationsInput | string
    doNotDisturb?: BoolFieldUpdateOperationsInput | boolean
    doNotDisturbStart?: NullableStringFieldUpdateOperationsInput | string | null
    doNotDisturbEnd?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserSettingCreateManyInput = {
    id?: string
    userId: string
    theme?: string
    fontSize?: string
    density?: string
    reducedMotion?: boolean
    defaultLandingPage?: string
    defaultChildMode?: string
    notificationPrefs?: JsonNullValueInput | InputJsonValue
    reminderTime?: string
    doNotDisturb?: boolean
    doNotDisturbStart?: string | null
    doNotDisturbEnd?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserSettingUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    theme?: StringFieldUpdateOperationsInput | string
    fontSize?: StringFieldUpdateOperationsInput | string
    density?: StringFieldUpdateOperationsInput | string
    reducedMotion?: BoolFieldUpdateOperationsInput | boolean
    defaultLandingPage?: StringFieldUpdateOperationsInput | string
    defaultChildMode?: StringFieldUpdateOperationsInput | string
    notificationPrefs?: JsonNullValueInput | InputJsonValue
    reminderTime?: StringFieldUpdateOperationsInput | string
    doNotDisturb?: BoolFieldUpdateOperationsInput | boolean
    doNotDisturbStart?: NullableStringFieldUpdateOperationsInput | string | null
    doNotDisturbEnd?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserSettingUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    theme?: StringFieldUpdateOperationsInput | string
    fontSize?: StringFieldUpdateOperationsInput | string
    density?: StringFieldUpdateOperationsInput | string
    reducedMotion?: BoolFieldUpdateOperationsInput | boolean
    defaultLandingPage?: StringFieldUpdateOperationsInput | string
    defaultChildMode?: StringFieldUpdateOperationsInput | string
    notificationPrefs?: JsonNullValueInput | InputJsonValue
    reminderTime?: StringFieldUpdateOperationsInput | string
    doNotDisturb?: BoolFieldUpdateOperationsInput | boolean
    doNotDisturbStart?: NullableStringFieldUpdateOperationsInput | string | null
    doNotDisturbEnd?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChildCreateInput = {
    id?: string
    name: string
    grade: number
    educationSystem?: string
    avatarColor?: string
    avatarUrl?: string | null
    targetSchool?: string | null
    currentSchool?: string | null
    birthday?: Date | string | null
    notes?: string | null
    routeId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutChildrenInput
    plans?: PlanCreateNestedManyWithoutChildInput
    weeklyPlans?: WeeklyPlanCreateNestedManyWithoutChildInput
  }

  export type ChildUncheckedCreateInput = {
    id?: string
    userId: string
    name: string
    grade: number
    educationSystem?: string
    avatarColor?: string
    avatarUrl?: string | null
    targetSchool?: string | null
    currentSchool?: string | null
    birthday?: Date | string | null
    notes?: string | null
    routeId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    plans?: PlanUncheckedCreateNestedManyWithoutChildInput
    weeklyPlans?: WeeklyPlanUncheckedCreateNestedManyWithoutChildInput
  }

  export type ChildUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    grade?: IntFieldUpdateOperationsInput | number
    educationSystem?: StringFieldUpdateOperationsInput | string
    avatarColor?: StringFieldUpdateOperationsInput | string
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    targetSchool?: NullableStringFieldUpdateOperationsInput | string | null
    currentSchool?: NullableStringFieldUpdateOperationsInput | string | null
    birthday?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    routeId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutChildrenNestedInput
    plans?: PlanUpdateManyWithoutChildNestedInput
    weeklyPlans?: WeeklyPlanUpdateManyWithoutChildNestedInput
  }

  export type ChildUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    grade?: IntFieldUpdateOperationsInput | number
    educationSystem?: StringFieldUpdateOperationsInput | string
    avatarColor?: StringFieldUpdateOperationsInput | string
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    targetSchool?: NullableStringFieldUpdateOperationsInput | string | null
    currentSchool?: NullableStringFieldUpdateOperationsInput | string | null
    birthday?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    routeId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    plans?: PlanUncheckedUpdateManyWithoutChildNestedInput
    weeklyPlans?: WeeklyPlanUncheckedUpdateManyWithoutChildNestedInput
  }

  export type ChildCreateManyInput = {
    id?: string
    userId: string
    name: string
    grade: number
    educationSystem?: string
    avatarColor?: string
    avatarUrl?: string | null
    targetSchool?: string | null
    currentSchool?: string | null
    birthday?: Date | string | null
    notes?: string | null
    routeId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ChildUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    grade?: IntFieldUpdateOperationsInput | number
    educationSystem?: StringFieldUpdateOperationsInput | string
    avatarColor?: StringFieldUpdateOperationsInput | string
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    targetSchool?: NullableStringFieldUpdateOperationsInput | string | null
    currentSchool?: NullableStringFieldUpdateOperationsInput | string | null
    birthday?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    routeId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChildUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    grade?: IntFieldUpdateOperationsInput | number
    educationSystem?: StringFieldUpdateOperationsInput | string
    avatarColor?: StringFieldUpdateOperationsInput | string
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    targetSchool?: NullableStringFieldUpdateOperationsInput | string | null
    currentSchool?: NullableStringFieldUpdateOperationsInput | string | null
    birthday?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    routeId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PlanCreateInput = {
    id?: string
    name: string
    type: string
    status?: string
    stage: string
    description?: string | null
    requirements?: NullableJsonNullValueInput | InputJsonValue
    milestones?: NullableJsonNullValueInput | InputJsonValue
    targets?: NullableJsonNullValueInput | InputJsonValue
    probability?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutPlansInput
    child: ChildCreateNestedOneWithoutPlansInput
  }

  export type PlanUncheckedCreateInput = {
    id?: string
    userId: string
    childId: string
    name: string
    type: string
    status?: string
    stage: string
    description?: string | null
    requirements?: NullableJsonNullValueInput | InputJsonValue
    milestones?: NullableJsonNullValueInput | InputJsonValue
    targets?: NullableJsonNullValueInput | InputJsonValue
    probability?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PlanUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    stage?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    requirements?: NullableJsonNullValueInput | InputJsonValue
    milestones?: NullableJsonNullValueInput | InputJsonValue
    targets?: NullableJsonNullValueInput | InputJsonValue
    probability?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutPlansNestedInput
    child?: ChildUpdateOneRequiredWithoutPlansNestedInput
  }

  export type PlanUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    childId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    stage?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    requirements?: NullableJsonNullValueInput | InputJsonValue
    milestones?: NullableJsonNullValueInput | InputJsonValue
    targets?: NullableJsonNullValueInput | InputJsonValue
    probability?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PlanCreateManyInput = {
    id?: string
    userId: string
    childId: string
    name: string
    type: string
    status?: string
    stage: string
    description?: string | null
    requirements?: NullableJsonNullValueInput | InputJsonValue
    milestones?: NullableJsonNullValueInput | InputJsonValue
    targets?: NullableJsonNullValueInput | InputJsonValue
    probability?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PlanUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    stage?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    requirements?: NullableJsonNullValueInput | InputJsonValue
    milestones?: NullableJsonNullValueInput | InputJsonValue
    targets?: NullableJsonNullValueInput | InputJsonValue
    probability?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PlanUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    childId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    stage?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    requirements?: NullableJsonNullValueInput | InputJsonValue
    milestones?: NullableJsonNullValueInput | InputJsonValue
    targets?: NullableJsonNullValueInput | InputJsonValue
    probability?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TaskTemplateCreateInput = {
    id?: string
    title: string
    category: $Enums.TaskCategory
    duration?: string
    difficulty?: string | null
    materials?: TaskTemplateCreatematerialsInput | string[]
    description?: string | null
    routeTags?: TaskTemplateCreaterouteTagsInput | string[]
    milestoneTag?: string | null
    semesterTag?: string | null
    tags?: TaskTemplateCreatetagsInput | string[]
    source?: $Enums.TaskTemplateSource
    isActive?: boolean
    archivedAt?: Date | string | null
    useCount?: number
    lastUsedAt?: Date | string | null
    taskType?: $Enums.TaskType
    frequency?: $Enums.TaskFrequency
    customFrequency?: NullableJsonNullValueInput | InputJsonValue
    weeklySchedule?: $Enums.TaskWeeklySchedule
    customScheduleDays?: TaskTemplateCreatecustomScheduleDaysInput | string[]
    assessmentCriteria?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutTaskTemplatesInput
    capabilityLinks?: TaskCapabilityLinkCreateNestedManyWithoutTaskTemplateInput
  }

  export type TaskTemplateUncheckedCreateInput = {
    id?: string
    userId: string
    title: string
    category: $Enums.TaskCategory
    duration?: string
    difficulty?: string | null
    materials?: TaskTemplateCreatematerialsInput | string[]
    description?: string | null
    routeTags?: TaskTemplateCreaterouteTagsInput | string[]
    milestoneTag?: string | null
    semesterTag?: string | null
    tags?: TaskTemplateCreatetagsInput | string[]
    source?: $Enums.TaskTemplateSource
    isActive?: boolean
    archivedAt?: Date | string | null
    useCount?: number
    lastUsedAt?: Date | string | null
    taskType?: $Enums.TaskType
    frequency?: $Enums.TaskFrequency
    customFrequency?: NullableJsonNullValueInput | InputJsonValue
    weeklySchedule?: $Enums.TaskWeeklySchedule
    customScheduleDays?: TaskTemplateCreatecustomScheduleDaysInput | string[]
    assessmentCriteria?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    capabilityLinks?: TaskCapabilityLinkUncheckedCreateNestedManyWithoutTaskTemplateInput
  }

  export type TaskTemplateUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    category?: EnumTaskCategoryFieldUpdateOperationsInput | $Enums.TaskCategory
    duration?: StringFieldUpdateOperationsInput | string
    difficulty?: NullableStringFieldUpdateOperationsInput | string | null
    materials?: TaskTemplateUpdatematerialsInput | string[]
    description?: NullableStringFieldUpdateOperationsInput | string | null
    routeTags?: TaskTemplateUpdaterouteTagsInput | string[]
    milestoneTag?: NullableStringFieldUpdateOperationsInput | string | null
    semesterTag?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: TaskTemplateUpdatetagsInput | string[]
    source?: EnumTaskTemplateSourceFieldUpdateOperationsInput | $Enums.TaskTemplateSource
    isActive?: BoolFieldUpdateOperationsInput | boolean
    archivedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    useCount?: IntFieldUpdateOperationsInput | number
    lastUsedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    taskType?: EnumTaskTypeFieldUpdateOperationsInput | $Enums.TaskType
    frequency?: EnumTaskFrequencyFieldUpdateOperationsInput | $Enums.TaskFrequency
    customFrequency?: NullableJsonNullValueInput | InputJsonValue
    weeklySchedule?: EnumTaskWeeklyScheduleFieldUpdateOperationsInput | $Enums.TaskWeeklySchedule
    customScheduleDays?: TaskTemplateUpdatecustomScheduleDaysInput | string[]
    assessmentCriteria?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutTaskTemplatesNestedInput
    capabilityLinks?: TaskCapabilityLinkUpdateManyWithoutTaskTemplateNestedInput
  }

  export type TaskTemplateUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    category?: EnumTaskCategoryFieldUpdateOperationsInput | $Enums.TaskCategory
    duration?: StringFieldUpdateOperationsInput | string
    difficulty?: NullableStringFieldUpdateOperationsInput | string | null
    materials?: TaskTemplateUpdatematerialsInput | string[]
    description?: NullableStringFieldUpdateOperationsInput | string | null
    routeTags?: TaskTemplateUpdaterouteTagsInput | string[]
    milestoneTag?: NullableStringFieldUpdateOperationsInput | string | null
    semesterTag?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: TaskTemplateUpdatetagsInput | string[]
    source?: EnumTaskTemplateSourceFieldUpdateOperationsInput | $Enums.TaskTemplateSource
    isActive?: BoolFieldUpdateOperationsInput | boolean
    archivedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    useCount?: IntFieldUpdateOperationsInput | number
    lastUsedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    taskType?: EnumTaskTypeFieldUpdateOperationsInput | $Enums.TaskType
    frequency?: EnumTaskFrequencyFieldUpdateOperationsInput | $Enums.TaskFrequency
    customFrequency?: NullableJsonNullValueInput | InputJsonValue
    weeklySchedule?: EnumTaskWeeklyScheduleFieldUpdateOperationsInput | $Enums.TaskWeeklySchedule
    customScheduleDays?: TaskTemplateUpdatecustomScheduleDaysInput | string[]
    assessmentCriteria?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    capabilityLinks?: TaskCapabilityLinkUncheckedUpdateManyWithoutTaskTemplateNestedInput
  }

  export type TaskTemplateCreateManyInput = {
    id?: string
    userId: string
    title: string
    category: $Enums.TaskCategory
    duration?: string
    difficulty?: string | null
    materials?: TaskTemplateCreatematerialsInput | string[]
    description?: string | null
    routeTags?: TaskTemplateCreaterouteTagsInput | string[]
    milestoneTag?: string | null
    semesterTag?: string | null
    tags?: TaskTemplateCreatetagsInput | string[]
    source?: $Enums.TaskTemplateSource
    isActive?: boolean
    archivedAt?: Date | string | null
    useCount?: number
    lastUsedAt?: Date | string | null
    taskType?: $Enums.TaskType
    frequency?: $Enums.TaskFrequency
    customFrequency?: NullableJsonNullValueInput | InputJsonValue
    weeklySchedule?: $Enums.TaskWeeklySchedule
    customScheduleDays?: TaskTemplateCreatecustomScheduleDaysInput | string[]
    assessmentCriteria?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TaskTemplateUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    category?: EnumTaskCategoryFieldUpdateOperationsInput | $Enums.TaskCategory
    duration?: StringFieldUpdateOperationsInput | string
    difficulty?: NullableStringFieldUpdateOperationsInput | string | null
    materials?: TaskTemplateUpdatematerialsInput | string[]
    description?: NullableStringFieldUpdateOperationsInput | string | null
    routeTags?: TaskTemplateUpdaterouteTagsInput | string[]
    milestoneTag?: NullableStringFieldUpdateOperationsInput | string | null
    semesterTag?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: TaskTemplateUpdatetagsInput | string[]
    source?: EnumTaskTemplateSourceFieldUpdateOperationsInput | $Enums.TaskTemplateSource
    isActive?: BoolFieldUpdateOperationsInput | boolean
    archivedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    useCount?: IntFieldUpdateOperationsInput | number
    lastUsedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    taskType?: EnumTaskTypeFieldUpdateOperationsInput | $Enums.TaskType
    frequency?: EnumTaskFrequencyFieldUpdateOperationsInput | $Enums.TaskFrequency
    customFrequency?: NullableJsonNullValueInput | InputJsonValue
    weeklySchedule?: EnumTaskWeeklyScheduleFieldUpdateOperationsInput | $Enums.TaskWeeklySchedule
    customScheduleDays?: TaskTemplateUpdatecustomScheduleDaysInput | string[]
    assessmentCriteria?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TaskTemplateUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    category?: EnumTaskCategoryFieldUpdateOperationsInput | $Enums.TaskCategory
    duration?: StringFieldUpdateOperationsInput | string
    difficulty?: NullableStringFieldUpdateOperationsInput | string | null
    materials?: TaskTemplateUpdatematerialsInput | string[]
    description?: NullableStringFieldUpdateOperationsInput | string | null
    routeTags?: TaskTemplateUpdaterouteTagsInput | string[]
    milestoneTag?: NullableStringFieldUpdateOperationsInput | string | null
    semesterTag?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: TaskTemplateUpdatetagsInput | string[]
    source?: EnumTaskTemplateSourceFieldUpdateOperationsInput | $Enums.TaskTemplateSource
    isActive?: BoolFieldUpdateOperationsInput | boolean
    archivedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    useCount?: IntFieldUpdateOperationsInput | number
    lastUsedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    taskType?: EnumTaskTypeFieldUpdateOperationsInput | $Enums.TaskType
    frequency?: EnumTaskFrequencyFieldUpdateOperationsInput | $Enums.TaskFrequency
    customFrequency?: NullableJsonNullValueInput | InputJsonValue
    weeklySchedule?: EnumTaskWeeklyScheduleFieldUpdateOperationsInput | $Enums.TaskWeeklySchedule
    customScheduleDays?: TaskTemplateUpdatecustomScheduleDaysInput | string[]
    assessmentCriteria?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CapabilityCreateInput = {
    id?: string
    name: string
    category: $Enums.CapabilityCategory
    description?: string | null
    isSystem?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    user?: UserCreateNestedOneWithoutCapabilitiesInput
    links?: TaskCapabilityLinkCreateNestedManyWithoutCapabilityInput
  }

  export type CapabilityUncheckedCreateInput = {
    id?: string
    userId?: string | null
    name: string
    category: $Enums.CapabilityCategory
    description?: string | null
    isSystem?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    links?: TaskCapabilityLinkUncheckedCreateNestedManyWithoutCapabilityInput
  }

  export type CapabilityUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    category?: EnumCapabilityCategoryFieldUpdateOperationsInput | $Enums.CapabilityCategory
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isSystem?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneWithoutCapabilitiesNestedInput
    links?: TaskCapabilityLinkUpdateManyWithoutCapabilityNestedInput
  }

  export type CapabilityUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    category?: EnumCapabilityCategoryFieldUpdateOperationsInput | $Enums.CapabilityCategory
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isSystem?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    links?: TaskCapabilityLinkUncheckedUpdateManyWithoutCapabilityNestedInput
  }

  export type CapabilityCreateManyInput = {
    id?: string
    userId?: string | null
    name: string
    category: $Enums.CapabilityCategory
    description?: string | null
    isSystem?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CapabilityUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    category?: EnumCapabilityCategoryFieldUpdateOperationsInput | $Enums.CapabilityCategory
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isSystem?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CapabilityUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    category?: EnumCapabilityCategoryFieldUpdateOperationsInput | $Enums.CapabilityCategory
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isSystem?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TaskCapabilityLinkCreateInput = {
    id?: string
    weight?: number
    expectedProgress?: number
    taskTemplate: TaskTemplateCreateNestedOneWithoutCapabilityLinksInput
    capability: CapabilityCreateNestedOneWithoutLinksInput
  }

  export type TaskCapabilityLinkUncheckedCreateInput = {
    id?: string
    taskTemplateId: string
    capabilityId: string
    weight?: number
    expectedProgress?: number
  }

  export type TaskCapabilityLinkUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    weight?: FloatFieldUpdateOperationsInput | number
    expectedProgress?: FloatFieldUpdateOperationsInput | number
    taskTemplate?: TaskTemplateUpdateOneRequiredWithoutCapabilityLinksNestedInput
    capability?: CapabilityUpdateOneRequiredWithoutLinksNestedInput
  }

  export type TaskCapabilityLinkUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    taskTemplateId?: StringFieldUpdateOperationsInput | string
    capabilityId?: StringFieldUpdateOperationsInput | string
    weight?: FloatFieldUpdateOperationsInput | number
    expectedProgress?: FloatFieldUpdateOperationsInput | number
  }

  export type TaskCapabilityLinkCreateManyInput = {
    id?: string
    taskTemplateId: string
    capabilityId: string
    weight?: number
    expectedProgress?: number
  }

  export type TaskCapabilityLinkUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    weight?: FloatFieldUpdateOperationsInput | number
    expectedProgress?: FloatFieldUpdateOperationsInput | number
  }

  export type TaskCapabilityLinkUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    taskTemplateId?: StringFieldUpdateOperationsInput | string
    capabilityId?: StringFieldUpdateOperationsInput | string
    weight?: FloatFieldUpdateOperationsInput | number
    expectedProgress?: FloatFieldUpdateOperationsInput | number
  }

  export type WeeklyPlanCreateInput = {
    id?: string
    weekId: string
    tasks?: JsonNullValueInput | InputJsonValue
    publishedAt?: Date | string | null
    reviewedAt?: Date | string | null
    parentComment?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutWeeklyPlansInput
    child: ChildCreateNestedOneWithoutWeeklyPlansInput
  }

  export type WeeklyPlanUncheckedCreateInput = {
    id?: string
    userId: string
    childId: string
    weekId: string
    tasks?: JsonNullValueInput | InputJsonValue
    publishedAt?: Date | string | null
    reviewedAt?: Date | string | null
    parentComment?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type WeeklyPlanUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    weekId?: StringFieldUpdateOperationsInput | string
    tasks?: JsonNullValueInput | InputJsonValue
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    parentComment?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutWeeklyPlansNestedInput
    child?: ChildUpdateOneRequiredWithoutWeeklyPlansNestedInput
  }

  export type WeeklyPlanUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    childId?: StringFieldUpdateOperationsInput | string
    weekId?: StringFieldUpdateOperationsInput | string
    tasks?: JsonNullValueInput | InputJsonValue
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    parentComment?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WeeklyPlanCreateManyInput = {
    id?: string
    userId: string
    childId: string
    weekId: string
    tasks?: JsonNullValueInput | InputJsonValue
    publishedAt?: Date | string | null
    reviewedAt?: Date | string | null
    parentComment?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type WeeklyPlanUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    weekId?: StringFieldUpdateOperationsInput | string
    tasks?: JsonNullValueInput | InputJsonValue
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    parentComment?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WeeklyPlanUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    childId?: StringFieldUpdateOperationsInput | string
    weekId?: StringFieldUpdateOperationsInput | string
    tasks?: JsonNullValueInput | InputJsonValue
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    parentComment?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationCreateInput = {
    id?: string
    title: string
    content: string
    readAt?: Date | string | null
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutNotificationsInput
  }

  export type NotificationUncheckedCreateInput = {
    id?: string
    userId: string
    title: string
    content: string
    readAt?: Date | string | null
    createdAt?: Date | string
  }

  export type NotificationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    readAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutNotificationsNestedInput
  }

  export type NotificationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    readAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationCreateManyInput = {
    id?: string
    userId: string
    title: string
    content: string
    readAt?: Date | string | null
    createdAt?: Date | string
  }

  export type NotificationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    readAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    readAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type EnumUserRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleFilter<$PrismaModel> | $Enums.UserRole
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type ChildListRelationFilter = {
    every?: ChildWhereInput
    some?: ChildWhereInput
    none?: ChildWhereInput
  }

  export type PlanListRelationFilter = {
    every?: PlanWhereInput
    some?: PlanWhereInput
    none?: PlanWhereInput
  }

  export type WeeklyPlanListRelationFilter = {
    every?: WeeklyPlanWhereInput
    some?: WeeklyPlanWhereInput
    none?: WeeklyPlanWhereInput
  }

  export type NotificationListRelationFilter = {
    every?: NotificationWhereInput
    some?: NotificationWhereInput
    none?: NotificationWhereInput
  }

  export type UserSettingNullableRelationFilter = {
    is?: UserSettingWhereInput | null
    isNot?: UserSettingWhereInput | null
  }

  export type TaskTemplateListRelationFilter = {
    every?: TaskTemplateWhereInput
    some?: TaskTemplateWhereInput
    none?: TaskTemplateWhereInput
  }

  export type CapabilityListRelationFilter = {
    every?: CapabilityWhereInput
    some?: CapabilityWhereInput
    none?: CapabilityWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type ChildOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PlanOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type WeeklyPlanOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type NotificationOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TaskTemplateOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CapabilityOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    username?: SortOrder
    passwordHash?: SortOrder
    name?: SortOrder
    role?: SortOrder
    avatarUrl?: SortOrder
    phone?: SortOrder
    email?: SortOrder
    wechatOpenId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    username?: SortOrder
    passwordHash?: SortOrder
    name?: SortOrder
    role?: SortOrder
    avatarUrl?: SortOrder
    phone?: SortOrder
    email?: SortOrder
    wechatOpenId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    username?: SortOrder
    passwordHash?: SortOrder
    name?: SortOrder
    role?: SortOrder
    avatarUrl?: SortOrder
    phone?: SortOrder
    email?: SortOrder
    wechatOpenId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type EnumUserRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleWithAggregatesFilter<$PrismaModel> | $Enums.UserRole
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumUserRoleFilter<$PrismaModel>
    _max?: NestedEnumUserRoleFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }
  export type JsonFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type UserRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type UserSettingCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    theme?: SortOrder
    fontSize?: SortOrder
    density?: SortOrder
    reducedMotion?: SortOrder
    defaultLandingPage?: SortOrder
    defaultChildMode?: SortOrder
    notificationPrefs?: SortOrder
    reminderTime?: SortOrder
    doNotDisturb?: SortOrder
    doNotDisturbStart?: SortOrder
    doNotDisturbEnd?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserSettingMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    theme?: SortOrder
    fontSize?: SortOrder
    density?: SortOrder
    reducedMotion?: SortOrder
    defaultLandingPage?: SortOrder
    defaultChildMode?: SortOrder
    reminderTime?: SortOrder
    doNotDisturb?: SortOrder
    doNotDisturbStart?: SortOrder
    doNotDisturbEnd?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserSettingMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    theme?: SortOrder
    fontSize?: SortOrder
    density?: SortOrder
    reducedMotion?: SortOrder
    defaultLandingPage?: SortOrder
    defaultChildMode?: SortOrder
    reminderTime?: SortOrder
    doNotDisturb?: SortOrder
    doNotDisturbStart?: SortOrder
    doNotDisturbEnd?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type ChildCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    name?: SortOrder
    grade?: SortOrder
    educationSystem?: SortOrder
    avatarColor?: SortOrder
    avatarUrl?: SortOrder
    targetSchool?: SortOrder
    currentSchool?: SortOrder
    birthday?: SortOrder
    notes?: SortOrder
    routeId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ChildAvgOrderByAggregateInput = {
    grade?: SortOrder
  }

  export type ChildMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    name?: SortOrder
    grade?: SortOrder
    educationSystem?: SortOrder
    avatarColor?: SortOrder
    avatarUrl?: SortOrder
    targetSchool?: SortOrder
    currentSchool?: SortOrder
    birthday?: SortOrder
    notes?: SortOrder
    routeId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ChildMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    name?: SortOrder
    grade?: SortOrder
    educationSystem?: SortOrder
    avatarColor?: SortOrder
    avatarUrl?: SortOrder
    targetSchool?: SortOrder
    currentSchool?: SortOrder
    birthday?: SortOrder
    notes?: SortOrder
    routeId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ChildSumOrderByAggregateInput = {
    grade?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }
  export type JsonNullableFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type ChildRelationFilter = {
    is?: ChildWhereInput
    isNot?: ChildWhereInput
  }

  export type PlanCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    childId?: SortOrder
    name?: SortOrder
    type?: SortOrder
    status?: SortOrder
    stage?: SortOrder
    description?: SortOrder
    requirements?: SortOrder
    milestones?: SortOrder
    targets?: SortOrder
    probability?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PlanAvgOrderByAggregateInput = {
    probability?: SortOrder
  }

  export type PlanMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    childId?: SortOrder
    name?: SortOrder
    type?: SortOrder
    status?: SortOrder
    stage?: SortOrder
    description?: SortOrder
    probability?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PlanMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    childId?: SortOrder
    name?: SortOrder
    type?: SortOrder
    status?: SortOrder
    stage?: SortOrder
    description?: SortOrder
    probability?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PlanSumOrderByAggregateInput = {
    probability?: SortOrder
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type EnumTaskCategoryFilter<$PrismaModel = never> = {
    equals?: $Enums.TaskCategory | EnumTaskCategoryFieldRefInput<$PrismaModel>
    in?: $Enums.TaskCategory[] | ListEnumTaskCategoryFieldRefInput<$PrismaModel>
    notIn?: $Enums.TaskCategory[] | ListEnumTaskCategoryFieldRefInput<$PrismaModel>
    not?: NestedEnumTaskCategoryFilter<$PrismaModel> | $Enums.TaskCategory
  }

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    has?: string | StringFieldRefInput<$PrismaModel> | null
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type EnumTaskTemplateSourceFilter<$PrismaModel = never> = {
    equals?: $Enums.TaskTemplateSource | EnumTaskTemplateSourceFieldRefInput<$PrismaModel>
    in?: $Enums.TaskTemplateSource[] | ListEnumTaskTemplateSourceFieldRefInput<$PrismaModel>
    notIn?: $Enums.TaskTemplateSource[] | ListEnumTaskTemplateSourceFieldRefInput<$PrismaModel>
    not?: NestedEnumTaskTemplateSourceFilter<$PrismaModel> | $Enums.TaskTemplateSource
  }

  export type EnumTaskTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.TaskType | EnumTaskTypeFieldRefInput<$PrismaModel>
    in?: $Enums.TaskType[] | ListEnumTaskTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.TaskType[] | ListEnumTaskTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumTaskTypeFilter<$PrismaModel> | $Enums.TaskType
  }

  export type EnumTaskFrequencyFilter<$PrismaModel = never> = {
    equals?: $Enums.TaskFrequency | EnumTaskFrequencyFieldRefInput<$PrismaModel>
    in?: $Enums.TaskFrequency[] | ListEnumTaskFrequencyFieldRefInput<$PrismaModel>
    notIn?: $Enums.TaskFrequency[] | ListEnumTaskFrequencyFieldRefInput<$PrismaModel>
    not?: NestedEnumTaskFrequencyFilter<$PrismaModel> | $Enums.TaskFrequency
  }

  export type EnumTaskWeeklyScheduleFilter<$PrismaModel = never> = {
    equals?: $Enums.TaskWeeklySchedule | EnumTaskWeeklyScheduleFieldRefInput<$PrismaModel>
    in?: $Enums.TaskWeeklySchedule[] | ListEnumTaskWeeklyScheduleFieldRefInput<$PrismaModel>
    notIn?: $Enums.TaskWeeklySchedule[] | ListEnumTaskWeeklyScheduleFieldRefInput<$PrismaModel>
    not?: NestedEnumTaskWeeklyScheduleFilter<$PrismaModel> | $Enums.TaskWeeklySchedule
  }

  export type TaskCapabilityLinkListRelationFilter = {
    every?: TaskCapabilityLinkWhereInput
    some?: TaskCapabilityLinkWhereInput
    none?: TaskCapabilityLinkWhereInput
  }

  export type TaskCapabilityLinkOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TaskTemplateCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    category?: SortOrder
    duration?: SortOrder
    difficulty?: SortOrder
    materials?: SortOrder
    description?: SortOrder
    routeTags?: SortOrder
    milestoneTag?: SortOrder
    semesterTag?: SortOrder
    tags?: SortOrder
    source?: SortOrder
    isActive?: SortOrder
    archivedAt?: SortOrder
    useCount?: SortOrder
    lastUsedAt?: SortOrder
    taskType?: SortOrder
    frequency?: SortOrder
    customFrequency?: SortOrder
    weeklySchedule?: SortOrder
    customScheduleDays?: SortOrder
    assessmentCriteria?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TaskTemplateAvgOrderByAggregateInput = {
    useCount?: SortOrder
  }

  export type TaskTemplateMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    category?: SortOrder
    duration?: SortOrder
    difficulty?: SortOrder
    description?: SortOrder
    milestoneTag?: SortOrder
    semesterTag?: SortOrder
    source?: SortOrder
    isActive?: SortOrder
    archivedAt?: SortOrder
    useCount?: SortOrder
    lastUsedAt?: SortOrder
    taskType?: SortOrder
    frequency?: SortOrder
    weeklySchedule?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TaskTemplateMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    category?: SortOrder
    duration?: SortOrder
    difficulty?: SortOrder
    description?: SortOrder
    milestoneTag?: SortOrder
    semesterTag?: SortOrder
    source?: SortOrder
    isActive?: SortOrder
    archivedAt?: SortOrder
    useCount?: SortOrder
    lastUsedAt?: SortOrder
    taskType?: SortOrder
    frequency?: SortOrder
    weeklySchedule?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TaskTemplateSumOrderByAggregateInput = {
    useCount?: SortOrder
  }

  export type EnumTaskCategoryWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TaskCategory | EnumTaskCategoryFieldRefInput<$PrismaModel>
    in?: $Enums.TaskCategory[] | ListEnumTaskCategoryFieldRefInput<$PrismaModel>
    notIn?: $Enums.TaskCategory[] | ListEnumTaskCategoryFieldRefInput<$PrismaModel>
    not?: NestedEnumTaskCategoryWithAggregatesFilter<$PrismaModel> | $Enums.TaskCategory
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTaskCategoryFilter<$PrismaModel>
    _max?: NestedEnumTaskCategoryFilter<$PrismaModel>
  }

  export type EnumTaskTemplateSourceWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TaskTemplateSource | EnumTaskTemplateSourceFieldRefInput<$PrismaModel>
    in?: $Enums.TaskTemplateSource[] | ListEnumTaskTemplateSourceFieldRefInput<$PrismaModel>
    notIn?: $Enums.TaskTemplateSource[] | ListEnumTaskTemplateSourceFieldRefInput<$PrismaModel>
    not?: NestedEnumTaskTemplateSourceWithAggregatesFilter<$PrismaModel> | $Enums.TaskTemplateSource
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTaskTemplateSourceFilter<$PrismaModel>
    _max?: NestedEnumTaskTemplateSourceFilter<$PrismaModel>
  }

  export type EnumTaskTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TaskType | EnumTaskTypeFieldRefInput<$PrismaModel>
    in?: $Enums.TaskType[] | ListEnumTaskTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.TaskType[] | ListEnumTaskTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumTaskTypeWithAggregatesFilter<$PrismaModel> | $Enums.TaskType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTaskTypeFilter<$PrismaModel>
    _max?: NestedEnumTaskTypeFilter<$PrismaModel>
  }

  export type EnumTaskFrequencyWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TaskFrequency | EnumTaskFrequencyFieldRefInput<$PrismaModel>
    in?: $Enums.TaskFrequency[] | ListEnumTaskFrequencyFieldRefInput<$PrismaModel>
    notIn?: $Enums.TaskFrequency[] | ListEnumTaskFrequencyFieldRefInput<$PrismaModel>
    not?: NestedEnumTaskFrequencyWithAggregatesFilter<$PrismaModel> | $Enums.TaskFrequency
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTaskFrequencyFilter<$PrismaModel>
    _max?: NestedEnumTaskFrequencyFilter<$PrismaModel>
  }

  export type EnumTaskWeeklyScheduleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TaskWeeklySchedule | EnumTaskWeeklyScheduleFieldRefInput<$PrismaModel>
    in?: $Enums.TaskWeeklySchedule[] | ListEnumTaskWeeklyScheduleFieldRefInput<$PrismaModel>
    notIn?: $Enums.TaskWeeklySchedule[] | ListEnumTaskWeeklyScheduleFieldRefInput<$PrismaModel>
    not?: NestedEnumTaskWeeklyScheduleWithAggregatesFilter<$PrismaModel> | $Enums.TaskWeeklySchedule
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTaskWeeklyScheduleFilter<$PrismaModel>
    _max?: NestedEnumTaskWeeklyScheduleFilter<$PrismaModel>
  }

  export type EnumCapabilityCategoryFilter<$PrismaModel = never> = {
    equals?: $Enums.CapabilityCategory | EnumCapabilityCategoryFieldRefInput<$PrismaModel>
    in?: $Enums.CapabilityCategory[] | ListEnumCapabilityCategoryFieldRefInput<$PrismaModel>
    notIn?: $Enums.CapabilityCategory[] | ListEnumCapabilityCategoryFieldRefInput<$PrismaModel>
    not?: NestedEnumCapabilityCategoryFilter<$PrismaModel> | $Enums.CapabilityCategory
  }

  export type UserNullableRelationFilter = {
    is?: UserWhereInput | null
    isNot?: UserWhereInput | null
  }

  export type CapabilityCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    name?: SortOrder
    category?: SortOrder
    description?: SortOrder
    isSystem?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CapabilityMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    name?: SortOrder
    category?: SortOrder
    description?: SortOrder
    isSystem?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CapabilityMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    name?: SortOrder
    category?: SortOrder
    description?: SortOrder
    isSystem?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumCapabilityCategoryWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.CapabilityCategory | EnumCapabilityCategoryFieldRefInput<$PrismaModel>
    in?: $Enums.CapabilityCategory[] | ListEnumCapabilityCategoryFieldRefInput<$PrismaModel>
    notIn?: $Enums.CapabilityCategory[] | ListEnumCapabilityCategoryFieldRefInput<$PrismaModel>
    not?: NestedEnumCapabilityCategoryWithAggregatesFilter<$PrismaModel> | $Enums.CapabilityCategory
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumCapabilityCategoryFilter<$PrismaModel>
    _max?: NestedEnumCapabilityCategoryFilter<$PrismaModel>
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type TaskTemplateRelationFilter = {
    is?: TaskTemplateWhereInput
    isNot?: TaskTemplateWhereInput
  }

  export type CapabilityRelationFilter = {
    is?: CapabilityWhereInput
    isNot?: CapabilityWhereInput
  }

  export type TaskCapabilityLinkTaskTemplateIdCapabilityIdCompoundUniqueInput = {
    taskTemplateId: string
    capabilityId: string
  }

  export type TaskCapabilityLinkCountOrderByAggregateInput = {
    id?: SortOrder
    taskTemplateId?: SortOrder
    capabilityId?: SortOrder
    weight?: SortOrder
    expectedProgress?: SortOrder
  }

  export type TaskCapabilityLinkAvgOrderByAggregateInput = {
    weight?: SortOrder
    expectedProgress?: SortOrder
  }

  export type TaskCapabilityLinkMaxOrderByAggregateInput = {
    id?: SortOrder
    taskTemplateId?: SortOrder
    capabilityId?: SortOrder
    weight?: SortOrder
    expectedProgress?: SortOrder
  }

  export type TaskCapabilityLinkMinOrderByAggregateInput = {
    id?: SortOrder
    taskTemplateId?: SortOrder
    capabilityId?: SortOrder
    weight?: SortOrder
    expectedProgress?: SortOrder
  }

  export type TaskCapabilityLinkSumOrderByAggregateInput = {
    weight?: SortOrder
    expectedProgress?: SortOrder
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type WeeklyPlanChildIdWeekIdCompoundUniqueInput = {
    childId: string
    weekId: string
  }

  export type WeeklyPlanCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    childId?: SortOrder
    weekId?: SortOrder
    tasks?: SortOrder
    publishedAt?: SortOrder
    reviewedAt?: SortOrder
    parentComment?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type WeeklyPlanMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    childId?: SortOrder
    weekId?: SortOrder
    publishedAt?: SortOrder
    reviewedAt?: SortOrder
    parentComment?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type WeeklyPlanMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    childId?: SortOrder
    weekId?: SortOrder
    publishedAt?: SortOrder
    reviewedAt?: SortOrder
    parentComment?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type NotificationCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    content?: SortOrder
    readAt?: SortOrder
    createdAt?: SortOrder
  }

  export type NotificationMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    content?: SortOrder
    readAt?: SortOrder
    createdAt?: SortOrder
  }

  export type NotificationMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    content?: SortOrder
    readAt?: SortOrder
    createdAt?: SortOrder
  }

  export type ChildCreateNestedManyWithoutUserInput = {
    create?: XOR<ChildCreateWithoutUserInput, ChildUncheckedCreateWithoutUserInput> | ChildCreateWithoutUserInput[] | ChildUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ChildCreateOrConnectWithoutUserInput | ChildCreateOrConnectWithoutUserInput[]
    createMany?: ChildCreateManyUserInputEnvelope
    connect?: ChildWhereUniqueInput | ChildWhereUniqueInput[]
  }

  export type PlanCreateNestedManyWithoutUserInput = {
    create?: XOR<PlanCreateWithoutUserInput, PlanUncheckedCreateWithoutUserInput> | PlanCreateWithoutUserInput[] | PlanUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PlanCreateOrConnectWithoutUserInput | PlanCreateOrConnectWithoutUserInput[]
    createMany?: PlanCreateManyUserInputEnvelope
    connect?: PlanWhereUniqueInput | PlanWhereUniqueInput[]
  }

  export type WeeklyPlanCreateNestedManyWithoutUserInput = {
    create?: XOR<WeeklyPlanCreateWithoutUserInput, WeeklyPlanUncheckedCreateWithoutUserInput> | WeeklyPlanCreateWithoutUserInput[] | WeeklyPlanUncheckedCreateWithoutUserInput[]
    connectOrCreate?: WeeklyPlanCreateOrConnectWithoutUserInput | WeeklyPlanCreateOrConnectWithoutUserInput[]
    createMany?: WeeklyPlanCreateManyUserInputEnvelope
    connect?: WeeklyPlanWhereUniqueInput | WeeklyPlanWhereUniqueInput[]
  }

  export type NotificationCreateNestedManyWithoutUserInput = {
    create?: XOR<NotificationCreateWithoutUserInput, NotificationUncheckedCreateWithoutUserInput> | NotificationCreateWithoutUserInput[] | NotificationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutUserInput | NotificationCreateOrConnectWithoutUserInput[]
    createMany?: NotificationCreateManyUserInputEnvelope
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
  }

  export type UserSettingCreateNestedOneWithoutUserInput = {
    create?: XOR<UserSettingCreateWithoutUserInput, UserSettingUncheckedCreateWithoutUserInput>
    connectOrCreate?: UserSettingCreateOrConnectWithoutUserInput
    connect?: UserSettingWhereUniqueInput
  }

  export type TaskTemplateCreateNestedManyWithoutUserInput = {
    create?: XOR<TaskTemplateCreateWithoutUserInput, TaskTemplateUncheckedCreateWithoutUserInput> | TaskTemplateCreateWithoutUserInput[] | TaskTemplateUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TaskTemplateCreateOrConnectWithoutUserInput | TaskTemplateCreateOrConnectWithoutUserInput[]
    createMany?: TaskTemplateCreateManyUserInputEnvelope
    connect?: TaskTemplateWhereUniqueInput | TaskTemplateWhereUniqueInput[]
  }

  export type CapabilityCreateNestedManyWithoutUserInput = {
    create?: XOR<CapabilityCreateWithoutUserInput, CapabilityUncheckedCreateWithoutUserInput> | CapabilityCreateWithoutUserInput[] | CapabilityUncheckedCreateWithoutUserInput[]
    connectOrCreate?: CapabilityCreateOrConnectWithoutUserInput | CapabilityCreateOrConnectWithoutUserInput[]
    createMany?: CapabilityCreateManyUserInputEnvelope
    connect?: CapabilityWhereUniqueInput | CapabilityWhereUniqueInput[]
  }

  export type ChildUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<ChildCreateWithoutUserInput, ChildUncheckedCreateWithoutUserInput> | ChildCreateWithoutUserInput[] | ChildUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ChildCreateOrConnectWithoutUserInput | ChildCreateOrConnectWithoutUserInput[]
    createMany?: ChildCreateManyUserInputEnvelope
    connect?: ChildWhereUniqueInput | ChildWhereUniqueInput[]
  }

  export type PlanUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<PlanCreateWithoutUserInput, PlanUncheckedCreateWithoutUserInput> | PlanCreateWithoutUserInput[] | PlanUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PlanCreateOrConnectWithoutUserInput | PlanCreateOrConnectWithoutUserInput[]
    createMany?: PlanCreateManyUserInputEnvelope
    connect?: PlanWhereUniqueInput | PlanWhereUniqueInput[]
  }

  export type WeeklyPlanUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<WeeklyPlanCreateWithoutUserInput, WeeklyPlanUncheckedCreateWithoutUserInput> | WeeklyPlanCreateWithoutUserInput[] | WeeklyPlanUncheckedCreateWithoutUserInput[]
    connectOrCreate?: WeeklyPlanCreateOrConnectWithoutUserInput | WeeklyPlanCreateOrConnectWithoutUserInput[]
    createMany?: WeeklyPlanCreateManyUserInputEnvelope
    connect?: WeeklyPlanWhereUniqueInput | WeeklyPlanWhereUniqueInput[]
  }

  export type NotificationUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<NotificationCreateWithoutUserInput, NotificationUncheckedCreateWithoutUserInput> | NotificationCreateWithoutUserInput[] | NotificationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutUserInput | NotificationCreateOrConnectWithoutUserInput[]
    createMany?: NotificationCreateManyUserInputEnvelope
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
  }

  export type UserSettingUncheckedCreateNestedOneWithoutUserInput = {
    create?: XOR<UserSettingCreateWithoutUserInput, UserSettingUncheckedCreateWithoutUserInput>
    connectOrCreate?: UserSettingCreateOrConnectWithoutUserInput
    connect?: UserSettingWhereUniqueInput
  }

  export type TaskTemplateUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<TaskTemplateCreateWithoutUserInput, TaskTemplateUncheckedCreateWithoutUserInput> | TaskTemplateCreateWithoutUserInput[] | TaskTemplateUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TaskTemplateCreateOrConnectWithoutUserInput | TaskTemplateCreateOrConnectWithoutUserInput[]
    createMany?: TaskTemplateCreateManyUserInputEnvelope
    connect?: TaskTemplateWhereUniqueInput | TaskTemplateWhereUniqueInput[]
  }

  export type CapabilityUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<CapabilityCreateWithoutUserInput, CapabilityUncheckedCreateWithoutUserInput> | CapabilityCreateWithoutUserInput[] | CapabilityUncheckedCreateWithoutUserInput[]
    connectOrCreate?: CapabilityCreateOrConnectWithoutUserInput | CapabilityCreateOrConnectWithoutUserInput[]
    createMany?: CapabilityCreateManyUserInputEnvelope
    connect?: CapabilityWhereUniqueInput | CapabilityWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type EnumUserRoleFieldUpdateOperationsInput = {
    set?: $Enums.UserRole
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type ChildUpdateManyWithoutUserNestedInput = {
    create?: XOR<ChildCreateWithoutUserInput, ChildUncheckedCreateWithoutUserInput> | ChildCreateWithoutUserInput[] | ChildUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ChildCreateOrConnectWithoutUserInput | ChildCreateOrConnectWithoutUserInput[]
    upsert?: ChildUpsertWithWhereUniqueWithoutUserInput | ChildUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ChildCreateManyUserInputEnvelope
    set?: ChildWhereUniqueInput | ChildWhereUniqueInput[]
    disconnect?: ChildWhereUniqueInput | ChildWhereUniqueInput[]
    delete?: ChildWhereUniqueInput | ChildWhereUniqueInput[]
    connect?: ChildWhereUniqueInput | ChildWhereUniqueInput[]
    update?: ChildUpdateWithWhereUniqueWithoutUserInput | ChildUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ChildUpdateManyWithWhereWithoutUserInput | ChildUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ChildScalarWhereInput | ChildScalarWhereInput[]
  }

  export type PlanUpdateManyWithoutUserNestedInput = {
    create?: XOR<PlanCreateWithoutUserInput, PlanUncheckedCreateWithoutUserInput> | PlanCreateWithoutUserInput[] | PlanUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PlanCreateOrConnectWithoutUserInput | PlanCreateOrConnectWithoutUserInput[]
    upsert?: PlanUpsertWithWhereUniqueWithoutUserInput | PlanUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: PlanCreateManyUserInputEnvelope
    set?: PlanWhereUniqueInput | PlanWhereUniqueInput[]
    disconnect?: PlanWhereUniqueInput | PlanWhereUniqueInput[]
    delete?: PlanWhereUniqueInput | PlanWhereUniqueInput[]
    connect?: PlanWhereUniqueInput | PlanWhereUniqueInput[]
    update?: PlanUpdateWithWhereUniqueWithoutUserInput | PlanUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: PlanUpdateManyWithWhereWithoutUserInput | PlanUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: PlanScalarWhereInput | PlanScalarWhereInput[]
  }

  export type WeeklyPlanUpdateManyWithoutUserNestedInput = {
    create?: XOR<WeeklyPlanCreateWithoutUserInput, WeeklyPlanUncheckedCreateWithoutUserInput> | WeeklyPlanCreateWithoutUserInput[] | WeeklyPlanUncheckedCreateWithoutUserInput[]
    connectOrCreate?: WeeklyPlanCreateOrConnectWithoutUserInput | WeeklyPlanCreateOrConnectWithoutUserInput[]
    upsert?: WeeklyPlanUpsertWithWhereUniqueWithoutUserInput | WeeklyPlanUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: WeeklyPlanCreateManyUserInputEnvelope
    set?: WeeklyPlanWhereUniqueInput | WeeklyPlanWhereUniqueInput[]
    disconnect?: WeeklyPlanWhereUniqueInput | WeeklyPlanWhereUniqueInput[]
    delete?: WeeklyPlanWhereUniqueInput | WeeklyPlanWhereUniqueInput[]
    connect?: WeeklyPlanWhereUniqueInput | WeeklyPlanWhereUniqueInput[]
    update?: WeeklyPlanUpdateWithWhereUniqueWithoutUserInput | WeeklyPlanUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: WeeklyPlanUpdateManyWithWhereWithoutUserInput | WeeklyPlanUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: WeeklyPlanScalarWhereInput | WeeklyPlanScalarWhereInput[]
  }

  export type NotificationUpdateManyWithoutUserNestedInput = {
    create?: XOR<NotificationCreateWithoutUserInput, NotificationUncheckedCreateWithoutUserInput> | NotificationCreateWithoutUserInput[] | NotificationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutUserInput | NotificationCreateOrConnectWithoutUserInput[]
    upsert?: NotificationUpsertWithWhereUniqueWithoutUserInput | NotificationUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: NotificationCreateManyUserInputEnvelope
    set?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    disconnect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    delete?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    update?: NotificationUpdateWithWhereUniqueWithoutUserInput | NotificationUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: NotificationUpdateManyWithWhereWithoutUserInput | NotificationUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: NotificationScalarWhereInput | NotificationScalarWhereInput[]
  }

  export type UserSettingUpdateOneWithoutUserNestedInput = {
    create?: XOR<UserSettingCreateWithoutUserInput, UserSettingUncheckedCreateWithoutUserInput>
    connectOrCreate?: UserSettingCreateOrConnectWithoutUserInput
    upsert?: UserSettingUpsertWithoutUserInput
    disconnect?: UserSettingWhereInput | boolean
    delete?: UserSettingWhereInput | boolean
    connect?: UserSettingWhereUniqueInput
    update?: XOR<XOR<UserSettingUpdateToOneWithWhereWithoutUserInput, UserSettingUpdateWithoutUserInput>, UserSettingUncheckedUpdateWithoutUserInput>
  }

  export type TaskTemplateUpdateManyWithoutUserNestedInput = {
    create?: XOR<TaskTemplateCreateWithoutUserInput, TaskTemplateUncheckedCreateWithoutUserInput> | TaskTemplateCreateWithoutUserInput[] | TaskTemplateUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TaskTemplateCreateOrConnectWithoutUserInput | TaskTemplateCreateOrConnectWithoutUserInput[]
    upsert?: TaskTemplateUpsertWithWhereUniqueWithoutUserInput | TaskTemplateUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: TaskTemplateCreateManyUserInputEnvelope
    set?: TaskTemplateWhereUniqueInput | TaskTemplateWhereUniqueInput[]
    disconnect?: TaskTemplateWhereUniqueInput | TaskTemplateWhereUniqueInput[]
    delete?: TaskTemplateWhereUniqueInput | TaskTemplateWhereUniqueInput[]
    connect?: TaskTemplateWhereUniqueInput | TaskTemplateWhereUniqueInput[]
    update?: TaskTemplateUpdateWithWhereUniqueWithoutUserInput | TaskTemplateUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: TaskTemplateUpdateManyWithWhereWithoutUserInput | TaskTemplateUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: TaskTemplateScalarWhereInput | TaskTemplateScalarWhereInput[]
  }

  export type CapabilityUpdateManyWithoutUserNestedInput = {
    create?: XOR<CapabilityCreateWithoutUserInput, CapabilityUncheckedCreateWithoutUserInput> | CapabilityCreateWithoutUserInput[] | CapabilityUncheckedCreateWithoutUserInput[]
    connectOrCreate?: CapabilityCreateOrConnectWithoutUserInput | CapabilityCreateOrConnectWithoutUserInput[]
    upsert?: CapabilityUpsertWithWhereUniqueWithoutUserInput | CapabilityUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: CapabilityCreateManyUserInputEnvelope
    set?: CapabilityWhereUniqueInput | CapabilityWhereUniqueInput[]
    disconnect?: CapabilityWhereUniqueInput | CapabilityWhereUniqueInput[]
    delete?: CapabilityWhereUniqueInput | CapabilityWhereUniqueInput[]
    connect?: CapabilityWhereUniqueInput | CapabilityWhereUniqueInput[]
    update?: CapabilityUpdateWithWhereUniqueWithoutUserInput | CapabilityUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: CapabilityUpdateManyWithWhereWithoutUserInput | CapabilityUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: CapabilityScalarWhereInput | CapabilityScalarWhereInput[]
  }

  export type ChildUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<ChildCreateWithoutUserInput, ChildUncheckedCreateWithoutUserInput> | ChildCreateWithoutUserInput[] | ChildUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ChildCreateOrConnectWithoutUserInput | ChildCreateOrConnectWithoutUserInput[]
    upsert?: ChildUpsertWithWhereUniqueWithoutUserInput | ChildUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ChildCreateManyUserInputEnvelope
    set?: ChildWhereUniqueInput | ChildWhereUniqueInput[]
    disconnect?: ChildWhereUniqueInput | ChildWhereUniqueInput[]
    delete?: ChildWhereUniqueInput | ChildWhereUniqueInput[]
    connect?: ChildWhereUniqueInput | ChildWhereUniqueInput[]
    update?: ChildUpdateWithWhereUniqueWithoutUserInput | ChildUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ChildUpdateManyWithWhereWithoutUserInput | ChildUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ChildScalarWhereInput | ChildScalarWhereInput[]
  }

  export type PlanUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<PlanCreateWithoutUserInput, PlanUncheckedCreateWithoutUserInput> | PlanCreateWithoutUserInput[] | PlanUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PlanCreateOrConnectWithoutUserInput | PlanCreateOrConnectWithoutUserInput[]
    upsert?: PlanUpsertWithWhereUniqueWithoutUserInput | PlanUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: PlanCreateManyUserInputEnvelope
    set?: PlanWhereUniqueInput | PlanWhereUniqueInput[]
    disconnect?: PlanWhereUniqueInput | PlanWhereUniqueInput[]
    delete?: PlanWhereUniqueInput | PlanWhereUniqueInput[]
    connect?: PlanWhereUniqueInput | PlanWhereUniqueInput[]
    update?: PlanUpdateWithWhereUniqueWithoutUserInput | PlanUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: PlanUpdateManyWithWhereWithoutUserInput | PlanUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: PlanScalarWhereInput | PlanScalarWhereInput[]
  }

  export type WeeklyPlanUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<WeeklyPlanCreateWithoutUserInput, WeeklyPlanUncheckedCreateWithoutUserInput> | WeeklyPlanCreateWithoutUserInput[] | WeeklyPlanUncheckedCreateWithoutUserInput[]
    connectOrCreate?: WeeklyPlanCreateOrConnectWithoutUserInput | WeeklyPlanCreateOrConnectWithoutUserInput[]
    upsert?: WeeklyPlanUpsertWithWhereUniqueWithoutUserInput | WeeklyPlanUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: WeeklyPlanCreateManyUserInputEnvelope
    set?: WeeklyPlanWhereUniqueInput | WeeklyPlanWhereUniqueInput[]
    disconnect?: WeeklyPlanWhereUniqueInput | WeeklyPlanWhereUniqueInput[]
    delete?: WeeklyPlanWhereUniqueInput | WeeklyPlanWhereUniqueInput[]
    connect?: WeeklyPlanWhereUniqueInput | WeeklyPlanWhereUniqueInput[]
    update?: WeeklyPlanUpdateWithWhereUniqueWithoutUserInput | WeeklyPlanUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: WeeklyPlanUpdateManyWithWhereWithoutUserInput | WeeklyPlanUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: WeeklyPlanScalarWhereInput | WeeklyPlanScalarWhereInput[]
  }

  export type NotificationUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<NotificationCreateWithoutUserInput, NotificationUncheckedCreateWithoutUserInput> | NotificationCreateWithoutUserInput[] | NotificationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutUserInput | NotificationCreateOrConnectWithoutUserInput[]
    upsert?: NotificationUpsertWithWhereUniqueWithoutUserInput | NotificationUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: NotificationCreateManyUserInputEnvelope
    set?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    disconnect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    delete?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    update?: NotificationUpdateWithWhereUniqueWithoutUserInput | NotificationUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: NotificationUpdateManyWithWhereWithoutUserInput | NotificationUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: NotificationScalarWhereInput | NotificationScalarWhereInput[]
  }

  export type UserSettingUncheckedUpdateOneWithoutUserNestedInput = {
    create?: XOR<UserSettingCreateWithoutUserInput, UserSettingUncheckedCreateWithoutUserInput>
    connectOrCreate?: UserSettingCreateOrConnectWithoutUserInput
    upsert?: UserSettingUpsertWithoutUserInput
    disconnect?: UserSettingWhereInput | boolean
    delete?: UserSettingWhereInput | boolean
    connect?: UserSettingWhereUniqueInput
    update?: XOR<XOR<UserSettingUpdateToOneWithWhereWithoutUserInput, UserSettingUpdateWithoutUserInput>, UserSettingUncheckedUpdateWithoutUserInput>
  }

  export type TaskTemplateUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<TaskTemplateCreateWithoutUserInput, TaskTemplateUncheckedCreateWithoutUserInput> | TaskTemplateCreateWithoutUserInput[] | TaskTemplateUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TaskTemplateCreateOrConnectWithoutUserInput | TaskTemplateCreateOrConnectWithoutUserInput[]
    upsert?: TaskTemplateUpsertWithWhereUniqueWithoutUserInput | TaskTemplateUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: TaskTemplateCreateManyUserInputEnvelope
    set?: TaskTemplateWhereUniqueInput | TaskTemplateWhereUniqueInput[]
    disconnect?: TaskTemplateWhereUniqueInput | TaskTemplateWhereUniqueInput[]
    delete?: TaskTemplateWhereUniqueInput | TaskTemplateWhereUniqueInput[]
    connect?: TaskTemplateWhereUniqueInput | TaskTemplateWhereUniqueInput[]
    update?: TaskTemplateUpdateWithWhereUniqueWithoutUserInput | TaskTemplateUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: TaskTemplateUpdateManyWithWhereWithoutUserInput | TaskTemplateUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: TaskTemplateScalarWhereInput | TaskTemplateScalarWhereInput[]
  }

  export type CapabilityUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<CapabilityCreateWithoutUserInput, CapabilityUncheckedCreateWithoutUserInput> | CapabilityCreateWithoutUserInput[] | CapabilityUncheckedCreateWithoutUserInput[]
    connectOrCreate?: CapabilityCreateOrConnectWithoutUserInput | CapabilityCreateOrConnectWithoutUserInput[]
    upsert?: CapabilityUpsertWithWhereUniqueWithoutUserInput | CapabilityUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: CapabilityCreateManyUserInputEnvelope
    set?: CapabilityWhereUniqueInput | CapabilityWhereUniqueInput[]
    disconnect?: CapabilityWhereUniqueInput | CapabilityWhereUniqueInput[]
    delete?: CapabilityWhereUniqueInput | CapabilityWhereUniqueInput[]
    connect?: CapabilityWhereUniqueInput | CapabilityWhereUniqueInput[]
    update?: CapabilityUpdateWithWhereUniqueWithoutUserInput | CapabilityUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: CapabilityUpdateManyWithWhereWithoutUserInput | CapabilityUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: CapabilityScalarWhereInput | CapabilityScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutSettingsInput = {
    create?: XOR<UserCreateWithoutSettingsInput, UserUncheckedCreateWithoutSettingsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSettingsInput
    connect?: UserWhereUniqueInput
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type UserUpdateOneRequiredWithoutSettingsNestedInput = {
    create?: XOR<UserCreateWithoutSettingsInput, UserUncheckedCreateWithoutSettingsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSettingsInput
    upsert?: UserUpsertWithoutSettingsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutSettingsInput, UserUpdateWithoutSettingsInput>, UserUncheckedUpdateWithoutSettingsInput>
  }

  export type UserCreateNestedOneWithoutChildrenInput = {
    create?: XOR<UserCreateWithoutChildrenInput, UserUncheckedCreateWithoutChildrenInput>
    connectOrCreate?: UserCreateOrConnectWithoutChildrenInput
    connect?: UserWhereUniqueInput
  }

  export type PlanCreateNestedManyWithoutChildInput = {
    create?: XOR<PlanCreateWithoutChildInput, PlanUncheckedCreateWithoutChildInput> | PlanCreateWithoutChildInput[] | PlanUncheckedCreateWithoutChildInput[]
    connectOrCreate?: PlanCreateOrConnectWithoutChildInput | PlanCreateOrConnectWithoutChildInput[]
    createMany?: PlanCreateManyChildInputEnvelope
    connect?: PlanWhereUniqueInput | PlanWhereUniqueInput[]
  }

  export type WeeklyPlanCreateNestedManyWithoutChildInput = {
    create?: XOR<WeeklyPlanCreateWithoutChildInput, WeeklyPlanUncheckedCreateWithoutChildInput> | WeeklyPlanCreateWithoutChildInput[] | WeeklyPlanUncheckedCreateWithoutChildInput[]
    connectOrCreate?: WeeklyPlanCreateOrConnectWithoutChildInput | WeeklyPlanCreateOrConnectWithoutChildInput[]
    createMany?: WeeklyPlanCreateManyChildInputEnvelope
    connect?: WeeklyPlanWhereUniqueInput | WeeklyPlanWhereUniqueInput[]
  }

  export type PlanUncheckedCreateNestedManyWithoutChildInput = {
    create?: XOR<PlanCreateWithoutChildInput, PlanUncheckedCreateWithoutChildInput> | PlanCreateWithoutChildInput[] | PlanUncheckedCreateWithoutChildInput[]
    connectOrCreate?: PlanCreateOrConnectWithoutChildInput | PlanCreateOrConnectWithoutChildInput[]
    createMany?: PlanCreateManyChildInputEnvelope
    connect?: PlanWhereUniqueInput | PlanWhereUniqueInput[]
  }

  export type WeeklyPlanUncheckedCreateNestedManyWithoutChildInput = {
    create?: XOR<WeeklyPlanCreateWithoutChildInput, WeeklyPlanUncheckedCreateWithoutChildInput> | WeeklyPlanCreateWithoutChildInput[] | WeeklyPlanUncheckedCreateWithoutChildInput[]
    connectOrCreate?: WeeklyPlanCreateOrConnectWithoutChildInput | WeeklyPlanCreateOrConnectWithoutChildInput[]
    createMany?: WeeklyPlanCreateManyChildInputEnvelope
    connect?: WeeklyPlanWhereUniqueInput | WeeklyPlanWhereUniqueInput[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type UserUpdateOneRequiredWithoutChildrenNestedInput = {
    create?: XOR<UserCreateWithoutChildrenInput, UserUncheckedCreateWithoutChildrenInput>
    connectOrCreate?: UserCreateOrConnectWithoutChildrenInput
    upsert?: UserUpsertWithoutChildrenInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutChildrenInput, UserUpdateWithoutChildrenInput>, UserUncheckedUpdateWithoutChildrenInput>
  }

  export type PlanUpdateManyWithoutChildNestedInput = {
    create?: XOR<PlanCreateWithoutChildInput, PlanUncheckedCreateWithoutChildInput> | PlanCreateWithoutChildInput[] | PlanUncheckedCreateWithoutChildInput[]
    connectOrCreate?: PlanCreateOrConnectWithoutChildInput | PlanCreateOrConnectWithoutChildInput[]
    upsert?: PlanUpsertWithWhereUniqueWithoutChildInput | PlanUpsertWithWhereUniqueWithoutChildInput[]
    createMany?: PlanCreateManyChildInputEnvelope
    set?: PlanWhereUniqueInput | PlanWhereUniqueInput[]
    disconnect?: PlanWhereUniqueInput | PlanWhereUniqueInput[]
    delete?: PlanWhereUniqueInput | PlanWhereUniqueInput[]
    connect?: PlanWhereUniqueInput | PlanWhereUniqueInput[]
    update?: PlanUpdateWithWhereUniqueWithoutChildInput | PlanUpdateWithWhereUniqueWithoutChildInput[]
    updateMany?: PlanUpdateManyWithWhereWithoutChildInput | PlanUpdateManyWithWhereWithoutChildInput[]
    deleteMany?: PlanScalarWhereInput | PlanScalarWhereInput[]
  }

  export type WeeklyPlanUpdateManyWithoutChildNestedInput = {
    create?: XOR<WeeklyPlanCreateWithoutChildInput, WeeklyPlanUncheckedCreateWithoutChildInput> | WeeklyPlanCreateWithoutChildInput[] | WeeklyPlanUncheckedCreateWithoutChildInput[]
    connectOrCreate?: WeeklyPlanCreateOrConnectWithoutChildInput | WeeklyPlanCreateOrConnectWithoutChildInput[]
    upsert?: WeeklyPlanUpsertWithWhereUniqueWithoutChildInput | WeeklyPlanUpsertWithWhereUniqueWithoutChildInput[]
    createMany?: WeeklyPlanCreateManyChildInputEnvelope
    set?: WeeklyPlanWhereUniqueInput | WeeklyPlanWhereUniqueInput[]
    disconnect?: WeeklyPlanWhereUniqueInput | WeeklyPlanWhereUniqueInput[]
    delete?: WeeklyPlanWhereUniqueInput | WeeklyPlanWhereUniqueInput[]
    connect?: WeeklyPlanWhereUniqueInput | WeeklyPlanWhereUniqueInput[]
    update?: WeeklyPlanUpdateWithWhereUniqueWithoutChildInput | WeeklyPlanUpdateWithWhereUniqueWithoutChildInput[]
    updateMany?: WeeklyPlanUpdateManyWithWhereWithoutChildInput | WeeklyPlanUpdateManyWithWhereWithoutChildInput[]
    deleteMany?: WeeklyPlanScalarWhereInput | WeeklyPlanScalarWhereInput[]
  }

  export type PlanUncheckedUpdateManyWithoutChildNestedInput = {
    create?: XOR<PlanCreateWithoutChildInput, PlanUncheckedCreateWithoutChildInput> | PlanCreateWithoutChildInput[] | PlanUncheckedCreateWithoutChildInput[]
    connectOrCreate?: PlanCreateOrConnectWithoutChildInput | PlanCreateOrConnectWithoutChildInput[]
    upsert?: PlanUpsertWithWhereUniqueWithoutChildInput | PlanUpsertWithWhereUniqueWithoutChildInput[]
    createMany?: PlanCreateManyChildInputEnvelope
    set?: PlanWhereUniqueInput | PlanWhereUniqueInput[]
    disconnect?: PlanWhereUniqueInput | PlanWhereUniqueInput[]
    delete?: PlanWhereUniqueInput | PlanWhereUniqueInput[]
    connect?: PlanWhereUniqueInput | PlanWhereUniqueInput[]
    update?: PlanUpdateWithWhereUniqueWithoutChildInput | PlanUpdateWithWhereUniqueWithoutChildInput[]
    updateMany?: PlanUpdateManyWithWhereWithoutChildInput | PlanUpdateManyWithWhereWithoutChildInput[]
    deleteMany?: PlanScalarWhereInput | PlanScalarWhereInput[]
  }

  export type WeeklyPlanUncheckedUpdateManyWithoutChildNestedInput = {
    create?: XOR<WeeklyPlanCreateWithoutChildInput, WeeklyPlanUncheckedCreateWithoutChildInput> | WeeklyPlanCreateWithoutChildInput[] | WeeklyPlanUncheckedCreateWithoutChildInput[]
    connectOrCreate?: WeeklyPlanCreateOrConnectWithoutChildInput | WeeklyPlanCreateOrConnectWithoutChildInput[]
    upsert?: WeeklyPlanUpsertWithWhereUniqueWithoutChildInput | WeeklyPlanUpsertWithWhereUniqueWithoutChildInput[]
    createMany?: WeeklyPlanCreateManyChildInputEnvelope
    set?: WeeklyPlanWhereUniqueInput | WeeklyPlanWhereUniqueInput[]
    disconnect?: WeeklyPlanWhereUniqueInput | WeeklyPlanWhereUniqueInput[]
    delete?: WeeklyPlanWhereUniqueInput | WeeklyPlanWhereUniqueInput[]
    connect?: WeeklyPlanWhereUniqueInput | WeeklyPlanWhereUniqueInput[]
    update?: WeeklyPlanUpdateWithWhereUniqueWithoutChildInput | WeeklyPlanUpdateWithWhereUniqueWithoutChildInput[]
    updateMany?: WeeklyPlanUpdateManyWithWhereWithoutChildInput | WeeklyPlanUpdateManyWithWhereWithoutChildInput[]
    deleteMany?: WeeklyPlanScalarWhereInput | WeeklyPlanScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutPlansInput = {
    create?: XOR<UserCreateWithoutPlansInput, UserUncheckedCreateWithoutPlansInput>
    connectOrCreate?: UserCreateOrConnectWithoutPlansInput
    connect?: UserWhereUniqueInput
  }

  export type ChildCreateNestedOneWithoutPlansInput = {
    create?: XOR<ChildCreateWithoutPlansInput, ChildUncheckedCreateWithoutPlansInput>
    connectOrCreate?: ChildCreateOrConnectWithoutPlansInput
    connect?: ChildWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutPlansNestedInput = {
    create?: XOR<UserCreateWithoutPlansInput, UserUncheckedCreateWithoutPlansInput>
    connectOrCreate?: UserCreateOrConnectWithoutPlansInput
    upsert?: UserUpsertWithoutPlansInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutPlansInput, UserUpdateWithoutPlansInput>, UserUncheckedUpdateWithoutPlansInput>
  }

  export type ChildUpdateOneRequiredWithoutPlansNestedInput = {
    create?: XOR<ChildCreateWithoutPlansInput, ChildUncheckedCreateWithoutPlansInput>
    connectOrCreate?: ChildCreateOrConnectWithoutPlansInput
    upsert?: ChildUpsertWithoutPlansInput
    connect?: ChildWhereUniqueInput
    update?: XOR<XOR<ChildUpdateToOneWithWhereWithoutPlansInput, ChildUpdateWithoutPlansInput>, ChildUncheckedUpdateWithoutPlansInput>
  }

  export type TaskTemplateCreatematerialsInput = {
    set: string[]
  }

  export type TaskTemplateCreaterouteTagsInput = {
    set: string[]
  }

  export type TaskTemplateCreatetagsInput = {
    set: string[]
  }

  export type TaskTemplateCreatecustomScheduleDaysInput = {
    set: string[]
  }

  export type UserCreateNestedOneWithoutTaskTemplatesInput = {
    create?: XOR<UserCreateWithoutTaskTemplatesInput, UserUncheckedCreateWithoutTaskTemplatesInput>
    connectOrCreate?: UserCreateOrConnectWithoutTaskTemplatesInput
    connect?: UserWhereUniqueInput
  }

  export type TaskCapabilityLinkCreateNestedManyWithoutTaskTemplateInput = {
    create?: XOR<TaskCapabilityLinkCreateWithoutTaskTemplateInput, TaskCapabilityLinkUncheckedCreateWithoutTaskTemplateInput> | TaskCapabilityLinkCreateWithoutTaskTemplateInput[] | TaskCapabilityLinkUncheckedCreateWithoutTaskTemplateInput[]
    connectOrCreate?: TaskCapabilityLinkCreateOrConnectWithoutTaskTemplateInput | TaskCapabilityLinkCreateOrConnectWithoutTaskTemplateInput[]
    createMany?: TaskCapabilityLinkCreateManyTaskTemplateInputEnvelope
    connect?: TaskCapabilityLinkWhereUniqueInput | TaskCapabilityLinkWhereUniqueInput[]
  }

  export type TaskCapabilityLinkUncheckedCreateNestedManyWithoutTaskTemplateInput = {
    create?: XOR<TaskCapabilityLinkCreateWithoutTaskTemplateInput, TaskCapabilityLinkUncheckedCreateWithoutTaskTemplateInput> | TaskCapabilityLinkCreateWithoutTaskTemplateInput[] | TaskCapabilityLinkUncheckedCreateWithoutTaskTemplateInput[]
    connectOrCreate?: TaskCapabilityLinkCreateOrConnectWithoutTaskTemplateInput | TaskCapabilityLinkCreateOrConnectWithoutTaskTemplateInput[]
    createMany?: TaskCapabilityLinkCreateManyTaskTemplateInputEnvelope
    connect?: TaskCapabilityLinkWhereUniqueInput | TaskCapabilityLinkWhereUniqueInput[]
  }

  export type EnumTaskCategoryFieldUpdateOperationsInput = {
    set?: $Enums.TaskCategory
  }

  export type TaskTemplateUpdatematerialsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type TaskTemplateUpdaterouteTagsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type TaskTemplateUpdatetagsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type EnumTaskTemplateSourceFieldUpdateOperationsInput = {
    set?: $Enums.TaskTemplateSource
  }

  export type EnumTaskTypeFieldUpdateOperationsInput = {
    set?: $Enums.TaskType
  }

  export type EnumTaskFrequencyFieldUpdateOperationsInput = {
    set?: $Enums.TaskFrequency
  }

  export type EnumTaskWeeklyScheduleFieldUpdateOperationsInput = {
    set?: $Enums.TaskWeeklySchedule
  }

  export type TaskTemplateUpdatecustomScheduleDaysInput = {
    set?: string[]
    push?: string | string[]
  }

  export type UserUpdateOneRequiredWithoutTaskTemplatesNestedInput = {
    create?: XOR<UserCreateWithoutTaskTemplatesInput, UserUncheckedCreateWithoutTaskTemplatesInput>
    connectOrCreate?: UserCreateOrConnectWithoutTaskTemplatesInput
    upsert?: UserUpsertWithoutTaskTemplatesInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutTaskTemplatesInput, UserUpdateWithoutTaskTemplatesInput>, UserUncheckedUpdateWithoutTaskTemplatesInput>
  }

  export type TaskCapabilityLinkUpdateManyWithoutTaskTemplateNestedInput = {
    create?: XOR<TaskCapabilityLinkCreateWithoutTaskTemplateInput, TaskCapabilityLinkUncheckedCreateWithoutTaskTemplateInput> | TaskCapabilityLinkCreateWithoutTaskTemplateInput[] | TaskCapabilityLinkUncheckedCreateWithoutTaskTemplateInput[]
    connectOrCreate?: TaskCapabilityLinkCreateOrConnectWithoutTaskTemplateInput | TaskCapabilityLinkCreateOrConnectWithoutTaskTemplateInput[]
    upsert?: TaskCapabilityLinkUpsertWithWhereUniqueWithoutTaskTemplateInput | TaskCapabilityLinkUpsertWithWhereUniqueWithoutTaskTemplateInput[]
    createMany?: TaskCapabilityLinkCreateManyTaskTemplateInputEnvelope
    set?: TaskCapabilityLinkWhereUniqueInput | TaskCapabilityLinkWhereUniqueInput[]
    disconnect?: TaskCapabilityLinkWhereUniqueInput | TaskCapabilityLinkWhereUniqueInput[]
    delete?: TaskCapabilityLinkWhereUniqueInput | TaskCapabilityLinkWhereUniqueInput[]
    connect?: TaskCapabilityLinkWhereUniqueInput | TaskCapabilityLinkWhereUniqueInput[]
    update?: TaskCapabilityLinkUpdateWithWhereUniqueWithoutTaskTemplateInput | TaskCapabilityLinkUpdateWithWhereUniqueWithoutTaskTemplateInput[]
    updateMany?: TaskCapabilityLinkUpdateManyWithWhereWithoutTaskTemplateInput | TaskCapabilityLinkUpdateManyWithWhereWithoutTaskTemplateInput[]
    deleteMany?: TaskCapabilityLinkScalarWhereInput | TaskCapabilityLinkScalarWhereInput[]
  }

  export type TaskCapabilityLinkUncheckedUpdateManyWithoutTaskTemplateNestedInput = {
    create?: XOR<TaskCapabilityLinkCreateWithoutTaskTemplateInput, TaskCapabilityLinkUncheckedCreateWithoutTaskTemplateInput> | TaskCapabilityLinkCreateWithoutTaskTemplateInput[] | TaskCapabilityLinkUncheckedCreateWithoutTaskTemplateInput[]
    connectOrCreate?: TaskCapabilityLinkCreateOrConnectWithoutTaskTemplateInput | TaskCapabilityLinkCreateOrConnectWithoutTaskTemplateInput[]
    upsert?: TaskCapabilityLinkUpsertWithWhereUniqueWithoutTaskTemplateInput | TaskCapabilityLinkUpsertWithWhereUniqueWithoutTaskTemplateInput[]
    createMany?: TaskCapabilityLinkCreateManyTaskTemplateInputEnvelope
    set?: TaskCapabilityLinkWhereUniqueInput | TaskCapabilityLinkWhereUniqueInput[]
    disconnect?: TaskCapabilityLinkWhereUniqueInput | TaskCapabilityLinkWhereUniqueInput[]
    delete?: TaskCapabilityLinkWhereUniqueInput | TaskCapabilityLinkWhereUniqueInput[]
    connect?: TaskCapabilityLinkWhereUniqueInput | TaskCapabilityLinkWhereUniqueInput[]
    update?: TaskCapabilityLinkUpdateWithWhereUniqueWithoutTaskTemplateInput | TaskCapabilityLinkUpdateWithWhereUniqueWithoutTaskTemplateInput[]
    updateMany?: TaskCapabilityLinkUpdateManyWithWhereWithoutTaskTemplateInput | TaskCapabilityLinkUpdateManyWithWhereWithoutTaskTemplateInput[]
    deleteMany?: TaskCapabilityLinkScalarWhereInput | TaskCapabilityLinkScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutCapabilitiesInput = {
    create?: XOR<UserCreateWithoutCapabilitiesInput, UserUncheckedCreateWithoutCapabilitiesInput>
    connectOrCreate?: UserCreateOrConnectWithoutCapabilitiesInput
    connect?: UserWhereUniqueInput
  }

  export type TaskCapabilityLinkCreateNestedManyWithoutCapabilityInput = {
    create?: XOR<TaskCapabilityLinkCreateWithoutCapabilityInput, TaskCapabilityLinkUncheckedCreateWithoutCapabilityInput> | TaskCapabilityLinkCreateWithoutCapabilityInput[] | TaskCapabilityLinkUncheckedCreateWithoutCapabilityInput[]
    connectOrCreate?: TaskCapabilityLinkCreateOrConnectWithoutCapabilityInput | TaskCapabilityLinkCreateOrConnectWithoutCapabilityInput[]
    createMany?: TaskCapabilityLinkCreateManyCapabilityInputEnvelope
    connect?: TaskCapabilityLinkWhereUniqueInput | TaskCapabilityLinkWhereUniqueInput[]
  }

  export type TaskCapabilityLinkUncheckedCreateNestedManyWithoutCapabilityInput = {
    create?: XOR<TaskCapabilityLinkCreateWithoutCapabilityInput, TaskCapabilityLinkUncheckedCreateWithoutCapabilityInput> | TaskCapabilityLinkCreateWithoutCapabilityInput[] | TaskCapabilityLinkUncheckedCreateWithoutCapabilityInput[]
    connectOrCreate?: TaskCapabilityLinkCreateOrConnectWithoutCapabilityInput | TaskCapabilityLinkCreateOrConnectWithoutCapabilityInput[]
    createMany?: TaskCapabilityLinkCreateManyCapabilityInputEnvelope
    connect?: TaskCapabilityLinkWhereUniqueInput | TaskCapabilityLinkWhereUniqueInput[]
  }

  export type EnumCapabilityCategoryFieldUpdateOperationsInput = {
    set?: $Enums.CapabilityCategory
  }

  export type UserUpdateOneWithoutCapabilitiesNestedInput = {
    create?: XOR<UserCreateWithoutCapabilitiesInput, UserUncheckedCreateWithoutCapabilitiesInput>
    connectOrCreate?: UserCreateOrConnectWithoutCapabilitiesInput
    upsert?: UserUpsertWithoutCapabilitiesInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutCapabilitiesInput, UserUpdateWithoutCapabilitiesInput>, UserUncheckedUpdateWithoutCapabilitiesInput>
  }

  export type TaskCapabilityLinkUpdateManyWithoutCapabilityNestedInput = {
    create?: XOR<TaskCapabilityLinkCreateWithoutCapabilityInput, TaskCapabilityLinkUncheckedCreateWithoutCapabilityInput> | TaskCapabilityLinkCreateWithoutCapabilityInput[] | TaskCapabilityLinkUncheckedCreateWithoutCapabilityInput[]
    connectOrCreate?: TaskCapabilityLinkCreateOrConnectWithoutCapabilityInput | TaskCapabilityLinkCreateOrConnectWithoutCapabilityInput[]
    upsert?: TaskCapabilityLinkUpsertWithWhereUniqueWithoutCapabilityInput | TaskCapabilityLinkUpsertWithWhereUniqueWithoutCapabilityInput[]
    createMany?: TaskCapabilityLinkCreateManyCapabilityInputEnvelope
    set?: TaskCapabilityLinkWhereUniqueInput | TaskCapabilityLinkWhereUniqueInput[]
    disconnect?: TaskCapabilityLinkWhereUniqueInput | TaskCapabilityLinkWhereUniqueInput[]
    delete?: TaskCapabilityLinkWhereUniqueInput | TaskCapabilityLinkWhereUniqueInput[]
    connect?: TaskCapabilityLinkWhereUniqueInput | TaskCapabilityLinkWhereUniqueInput[]
    update?: TaskCapabilityLinkUpdateWithWhereUniqueWithoutCapabilityInput | TaskCapabilityLinkUpdateWithWhereUniqueWithoutCapabilityInput[]
    updateMany?: TaskCapabilityLinkUpdateManyWithWhereWithoutCapabilityInput | TaskCapabilityLinkUpdateManyWithWhereWithoutCapabilityInput[]
    deleteMany?: TaskCapabilityLinkScalarWhereInput | TaskCapabilityLinkScalarWhereInput[]
  }

  export type TaskCapabilityLinkUncheckedUpdateManyWithoutCapabilityNestedInput = {
    create?: XOR<TaskCapabilityLinkCreateWithoutCapabilityInput, TaskCapabilityLinkUncheckedCreateWithoutCapabilityInput> | TaskCapabilityLinkCreateWithoutCapabilityInput[] | TaskCapabilityLinkUncheckedCreateWithoutCapabilityInput[]
    connectOrCreate?: TaskCapabilityLinkCreateOrConnectWithoutCapabilityInput | TaskCapabilityLinkCreateOrConnectWithoutCapabilityInput[]
    upsert?: TaskCapabilityLinkUpsertWithWhereUniqueWithoutCapabilityInput | TaskCapabilityLinkUpsertWithWhereUniqueWithoutCapabilityInput[]
    createMany?: TaskCapabilityLinkCreateManyCapabilityInputEnvelope
    set?: TaskCapabilityLinkWhereUniqueInput | TaskCapabilityLinkWhereUniqueInput[]
    disconnect?: TaskCapabilityLinkWhereUniqueInput | TaskCapabilityLinkWhereUniqueInput[]
    delete?: TaskCapabilityLinkWhereUniqueInput | TaskCapabilityLinkWhereUniqueInput[]
    connect?: TaskCapabilityLinkWhereUniqueInput | TaskCapabilityLinkWhereUniqueInput[]
    update?: TaskCapabilityLinkUpdateWithWhereUniqueWithoutCapabilityInput | TaskCapabilityLinkUpdateWithWhereUniqueWithoutCapabilityInput[]
    updateMany?: TaskCapabilityLinkUpdateManyWithWhereWithoutCapabilityInput | TaskCapabilityLinkUpdateManyWithWhereWithoutCapabilityInput[]
    deleteMany?: TaskCapabilityLinkScalarWhereInput | TaskCapabilityLinkScalarWhereInput[]
  }

  export type TaskTemplateCreateNestedOneWithoutCapabilityLinksInput = {
    create?: XOR<TaskTemplateCreateWithoutCapabilityLinksInput, TaskTemplateUncheckedCreateWithoutCapabilityLinksInput>
    connectOrCreate?: TaskTemplateCreateOrConnectWithoutCapabilityLinksInput
    connect?: TaskTemplateWhereUniqueInput
  }

  export type CapabilityCreateNestedOneWithoutLinksInput = {
    create?: XOR<CapabilityCreateWithoutLinksInput, CapabilityUncheckedCreateWithoutLinksInput>
    connectOrCreate?: CapabilityCreateOrConnectWithoutLinksInput
    connect?: CapabilityWhereUniqueInput
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type TaskTemplateUpdateOneRequiredWithoutCapabilityLinksNestedInput = {
    create?: XOR<TaskTemplateCreateWithoutCapabilityLinksInput, TaskTemplateUncheckedCreateWithoutCapabilityLinksInput>
    connectOrCreate?: TaskTemplateCreateOrConnectWithoutCapabilityLinksInput
    upsert?: TaskTemplateUpsertWithoutCapabilityLinksInput
    connect?: TaskTemplateWhereUniqueInput
    update?: XOR<XOR<TaskTemplateUpdateToOneWithWhereWithoutCapabilityLinksInput, TaskTemplateUpdateWithoutCapabilityLinksInput>, TaskTemplateUncheckedUpdateWithoutCapabilityLinksInput>
  }

  export type CapabilityUpdateOneRequiredWithoutLinksNestedInput = {
    create?: XOR<CapabilityCreateWithoutLinksInput, CapabilityUncheckedCreateWithoutLinksInput>
    connectOrCreate?: CapabilityCreateOrConnectWithoutLinksInput
    upsert?: CapabilityUpsertWithoutLinksInput
    connect?: CapabilityWhereUniqueInput
    update?: XOR<XOR<CapabilityUpdateToOneWithWhereWithoutLinksInput, CapabilityUpdateWithoutLinksInput>, CapabilityUncheckedUpdateWithoutLinksInput>
  }

  export type UserCreateNestedOneWithoutWeeklyPlansInput = {
    create?: XOR<UserCreateWithoutWeeklyPlansInput, UserUncheckedCreateWithoutWeeklyPlansInput>
    connectOrCreate?: UserCreateOrConnectWithoutWeeklyPlansInput
    connect?: UserWhereUniqueInput
  }

  export type ChildCreateNestedOneWithoutWeeklyPlansInput = {
    create?: XOR<ChildCreateWithoutWeeklyPlansInput, ChildUncheckedCreateWithoutWeeklyPlansInput>
    connectOrCreate?: ChildCreateOrConnectWithoutWeeklyPlansInput
    connect?: ChildWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutWeeklyPlansNestedInput = {
    create?: XOR<UserCreateWithoutWeeklyPlansInput, UserUncheckedCreateWithoutWeeklyPlansInput>
    connectOrCreate?: UserCreateOrConnectWithoutWeeklyPlansInput
    upsert?: UserUpsertWithoutWeeklyPlansInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutWeeklyPlansInput, UserUpdateWithoutWeeklyPlansInput>, UserUncheckedUpdateWithoutWeeklyPlansInput>
  }

  export type ChildUpdateOneRequiredWithoutWeeklyPlansNestedInput = {
    create?: XOR<ChildCreateWithoutWeeklyPlansInput, ChildUncheckedCreateWithoutWeeklyPlansInput>
    connectOrCreate?: ChildCreateOrConnectWithoutWeeklyPlansInput
    upsert?: ChildUpsertWithoutWeeklyPlansInput
    connect?: ChildWhereUniqueInput
    update?: XOR<XOR<ChildUpdateToOneWithWhereWithoutWeeklyPlansInput, ChildUpdateWithoutWeeklyPlansInput>, ChildUncheckedUpdateWithoutWeeklyPlansInput>
  }

  export type UserCreateNestedOneWithoutNotificationsInput = {
    create?: XOR<UserCreateWithoutNotificationsInput, UserUncheckedCreateWithoutNotificationsInput>
    connectOrCreate?: UserCreateOrConnectWithoutNotificationsInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutNotificationsNestedInput = {
    create?: XOR<UserCreateWithoutNotificationsInput, UserUncheckedCreateWithoutNotificationsInput>
    connectOrCreate?: UserCreateOrConnectWithoutNotificationsInput
    upsert?: UserUpsertWithoutNotificationsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutNotificationsInput, UserUpdateWithoutNotificationsInput>, UserUncheckedUpdateWithoutNotificationsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedEnumUserRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleFilter<$PrismaModel> | $Enums.UserRole
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedEnumUserRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleWithAggregatesFilter<$PrismaModel> | $Enums.UserRole
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumUserRoleFilter<$PrismaModel>
    _max?: NestedEnumUserRoleFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }
  export type NestedJsonFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedEnumTaskCategoryFilter<$PrismaModel = never> = {
    equals?: $Enums.TaskCategory | EnumTaskCategoryFieldRefInput<$PrismaModel>
    in?: $Enums.TaskCategory[] | ListEnumTaskCategoryFieldRefInput<$PrismaModel>
    notIn?: $Enums.TaskCategory[] | ListEnumTaskCategoryFieldRefInput<$PrismaModel>
    not?: NestedEnumTaskCategoryFilter<$PrismaModel> | $Enums.TaskCategory
  }

  export type NestedEnumTaskTemplateSourceFilter<$PrismaModel = never> = {
    equals?: $Enums.TaskTemplateSource | EnumTaskTemplateSourceFieldRefInput<$PrismaModel>
    in?: $Enums.TaskTemplateSource[] | ListEnumTaskTemplateSourceFieldRefInput<$PrismaModel>
    notIn?: $Enums.TaskTemplateSource[] | ListEnumTaskTemplateSourceFieldRefInput<$PrismaModel>
    not?: NestedEnumTaskTemplateSourceFilter<$PrismaModel> | $Enums.TaskTemplateSource
  }

  export type NestedEnumTaskTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.TaskType | EnumTaskTypeFieldRefInput<$PrismaModel>
    in?: $Enums.TaskType[] | ListEnumTaskTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.TaskType[] | ListEnumTaskTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumTaskTypeFilter<$PrismaModel> | $Enums.TaskType
  }

  export type NestedEnumTaskFrequencyFilter<$PrismaModel = never> = {
    equals?: $Enums.TaskFrequency | EnumTaskFrequencyFieldRefInput<$PrismaModel>
    in?: $Enums.TaskFrequency[] | ListEnumTaskFrequencyFieldRefInput<$PrismaModel>
    notIn?: $Enums.TaskFrequency[] | ListEnumTaskFrequencyFieldRefInput<$PrismaModel>
    not?: NestedEnumTaskFrequencyFilter<$PrismaModel> | $Enums.TaskFrequency
  }

  export type NestedEnumTaskWeeklyScheduleFilter<$PrismaModel = never> = {
    equals?: $Enums.TaskWeeklySchedule | EnumTaskWeeklyScheduleFieldRefInput<$PrismaModel>
    in?: $Enums.TaskWeeklySchedule[] | ListEnumTaskWeeklyScheduleFieldRefInput<$PrismaModel>
    notIn?: $Enums.TaskWeeklySchedule[] | ListEnumTaskWeeklyScheduleFieldRefInput<$PrismaModel>
    not?: NestedEnumTaskWeeklyScheduleFilter<$PrismaModel> | $Enums.TaskWeeklySchedule
  }

  export type NestedEnumTaskCategoryWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TaskCategory | EnumTaskCategoryFieldRefInput<$PrismaModel>
    in?: $Enums.TaskCategory[] | ListEnumTaskCategoryFieldRefInput<$PrismaModel>
    notIn?: $Enums.TaskCategory[] | ListEnumTaskCategoryFieldRefInput<$PrismaModel>
    not?: NestedEnumTaskCategoryWithAggregatesFilter<$PrismaModel> | $Enums.TaskCategory
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTaskCategoryFilter<$PrismaModel>
    _max?: NestedEnumTaskCategoryFilter<$PrismaModel>
  }

  export type NestedEnumTaskTemplateSourceWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TaskTemplateSource | EnumTaskTemplateSourceFieldRefInput<$PrismaModel>
    in?: $Enums.TaskTemplateSource[] | ListEnumTaskTemplateSourceFieldRefInput<$PrismaModel>
    notIn?: $Enums.TaskTemplateSource[] | ListEnumTaskTemplateSourceFieldRefInput<$PrismaModel>
    not?: NestedEnumTaskTemplateSourceWithAggregatesFilter<$PrismaModel> | $Enums.TaskTemplateSource
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTaskTemplateSourceFilter<$PrismaModel>
    _max?: NestedEnumTaskTemplateSourceFilter<$PrismaModel>
  }

  export type NestedEnumTaskTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TaskType | EnumTaskTypeFieldRefInput<$PrismaModel>
    in?: $Enums.TaskType[] | ListEnumTaskTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.TaskType[] | ListEnumTaskTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumTaskTypeWithAggregatesFilter<$PrismaModel> | $Enums.TaskType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTaskTypeFilter<$PrismaModel>
    _max?: NestedEnumTaskTypeFilter<$PrismaModel>
  }

  export type NestedEnumTaskFrequencyWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TaskFrequency | EnumTaskFrequencyFieldRefInput<$PrismaModel>
    in?: $Enums.TaskFrequency[] | ListEnumTaskFrequencyFieldRefInput<$PrismaModel>
    notIn?: $Enums.TaskFrequency[] | ListEnumTaskFrequencyFieldRefInput<$PrismaModel>
    not?: NestedEnumTaskFrequencyWithAggregatesFilter<$PrismaModel> | $Enums.TaskFrequency
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTaskFrequencyFilter<$PrismaModel>
    _max?: NestedEnumTaskFrequencyFilter<$PrismaModel>
  }

  export type NestedEnumTaskWeeklyScheduleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TaskWeeklySchedule | EnumTaskWeeklyScheduleFieldRefInput<$PrismaModel>
    in?: $Enums.TaskWeeklySchedule[] | ListEnumTaskWeeklyScheduleFieldRefInput<$PrismaModel>
    notIn?: $Enums.TaskWeeklySchedule[] | ListEnumTaskWeeklyScheduleFieldRefInput<$PrismaModel>
    not?: NestedEnumTaskWeeklyScheduleWithAggregatesFilter<$PrismaModel> | $Enums.TaskWeeklySchedule
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTaskWeeklyScheduleFilter<$PrismaModel>
    _max?: NestedEnumTaskWeeklyScheduleFilter<$PrismaModel>
  }

  export type NestedEnumCapabilityCategoryFilter<$PrismaModel = never> = {
    equals?: $Enums.CapabilityCategory | EnumCapabilityCategoryFieldRefInput<$PrismaModel>
    in?: $Enums.CapabilityCategory[] | ListEnumCapabilityCategoryFieldRefInput<$PrismaModel>
    notIn?: $Enums.CapabilityCategory[] | ListEnumCapabilityCategoryFieldRefInput<$PrismaModel>
    not?: NestedEnumCapabilityCategoryFilter<$PrismaModel> | $Enums.CapabilityCategory
  }

  export type NestedEnumCapabilityCategoryWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.CapabilityCategory | EnumCapabilityCategoryFieldRefInput<$PrismaModel>
    in?: $Enums.CapabilityCategory[] | ListEnumCapabilityCategoryFieldRefInput<$PrismaModel>
    notIn?: $Enums.CapabilityCategory[] | ListEnumCapabilityCategoryFieldRefInput<$PrismaModel>
    not?: NestedEnumCapabilityCategoryWithAggregatesFilter<$PrismaModel> | $Enums.CapabilityCategory
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumCapabilityCategoryFilter<$PrismaModel>
    _max?: NestedEnumCapabilityCategoryFilter<$PrismaModel>
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type ChildCreateWithoutUserInput = {
    id?: string
    name: string
    grade: number
    educationSystem?: string
    avatarColor?: string
    avatarUrl?: string | null
    targetSchool?: string | null
    currentSchool?: string | null
    birthday?: Date | string | null
    notes?: string | null
    routeId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    plans?: PlanCreateNestedManyWithoutChildInput
    weeklyPlans?: WeeklyPlanCreateNestedManyWithoutChildInput
  }

  export type ChildUncheckedCreateWithoutUserInput = {
    id?: string
    name: string
    grade: number
    educationSystem?: string
    avatarColor?: string
    avatarUrl?: string | null
    targetSchool?: string | null
    currentSchool?: string | null
    birthday?: Date | string | null
    notes?: string | null
    routeId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    plans?: PlanUncheckedCreateNestedManyWithoutChildInput
    weeklyPlans?: WeeklyPlanUncheckedCreateNestedManyWithoutChildInput
  }

  export type ChildCreateOrConnectWithoutUserInput = {
    where: ChildWhereUniqueInput
    create: XOR<ChildCreateWithoutUserInput, ChildUncheckedCreateWithoutUserInput>
  }

  export type ChildCreateManyUserInputEnvelope = {
    data: ChildCreateManyUserInput | ChildCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type PlanCreateWithoutUserInput = {
    id?: string
    name: string
    type: string
    status?: string
    stage: string
    description?: string | null
    requirements?: NullableJsonNullValueInput | InputJsonValue
    milestones?: NullableJsonNullValueInput | InputJsonValue
    targets?: NullableJsonNullValueInput | InputJsonValue
    probability?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    child: ChildCreateNestedOneWithoutPlansInput
  }

  export type PlanUncheckedCreateWithoutUserInput = {
    id?: string
    childId: string
    name: string
    type: string
    status?: string
    stage: string
    description?: string | null
    requirements?: NullableJsonNullValueInput | InputJsonValue
    milestones?: NullableJsonNullValueInput | InputJsonValue
    targets?: NullableJsonNullValueInput | InputJsonValue
    probability?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PlanCreateOrConnectWithoutUserInput = {
    where: PlanWhereUniqueInput
    create: XOR<PlanCreateWithoutUserInput, PlanUncheckedCreateWithoutUserInput>
  }

  export type PlanCreateManyUserInputEnvelope = {
    data: PlanCreateManyUserInput | PlanCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type WeeklyPlanCreateWithoutUserInput = {
    id?: string
    weekId: string
    tasks?: JsonNullValueInput | InputJsonValue
    publishedAt?: Date | string | null
    reviewedAt?: Date | string | null
    parentComment?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    child: ChildCreateNestedOneWithoutWeeklyPlansInput
  }

  export type WeeklyPlanUncheckedCreateWithoutUserInput = {
    id?: string
    childId: string
    weekId: string
    tasks?: JsonNullValueInput | InputJsonValue
    publishedAt?: Date | string | null
    reviewedAt?: Date | string | null
    parentComment?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type WeeklyPlanCreateOrConnectWithoutUserInput = {
    where: WeeklyPlanWhereUniqueInput
    create: XOR<WeeklyPlanCreateWithoutUserInput, WeeklyPlanUncheckedCreateWithoutUserInput>
  }

  export type WeeklyPlanCreateManyUserInputEnvelope = {
    data: WeeklyPlanCreateManyUserInput | WeeklyPlanCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type NotificationCreateWithoutUserInput = {
    id?: string
    title: string
    content: string
    readAt?: Date | string | null
    createdAt?: Date | string
  }

  export type NotificationUncheckedCreateWithoutUserInput = {
    id?: string
    title: string
    content: string
    readAt?: Date | string | null
    createdAt?: Date | string
  }

  export type NotificationCreateOrConnectWithoutUserInput = {
    where: NotificationWhereUniqueInput
    create: XOR<NotificationCreateWithoutUserInput, NotificationUncheckedCreateWithoutUserInput>
  }

  export type NotificationCreateManyUserInputEnvelope = {
    data: NotificationCreateManyUserInput | NotificationCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type UserSettingCreateWithoutUserInput = {
    id?: string
    theme?: string
    fontSize?: string
    density?: string
    reducedMotion?: boolean
    defaultLandingPage?: string
    defaultChildMode?: string
    notificationPrefs?: JsonNullValueInput | InputJsonValue
    reminderTime?: string
    doNotDisturb?: boolean
    doNotDisturbStart?: string | null
    doNotDisturbEnd?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserSettingUncheckedCreateWithoutUserInput = {
    id?: string
    theme?: string
    fontSize?: string
    density?: string
    reducedMotion?: boolean
    defaultLandingPage?: string
    defaultChildMode?: string
    notificationPrefs?: JsonNullValueInput | InputJsonValue
    reminderTime?: string
    doNotDisturb?: boolean
    doNotDisturbStart?: string | null
    doNotDisturbEnd?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserSettingCreateOrConnectWithoutUserInput = {
    where: UserSettingWhereUniqueInput
    create: XOR<UserSettingCreateWithoutUserInput, UserSettingUncheckedCreateWithoutUserInput>
  }

  export type TaskTemplateCreateWithoutUserInput = {
    id?: string
    title: string
    category: $Enums.TaskCategory
    duration?: string
    difficulty?: string | null
    materials?: TaskTemplateCreatematerialsInput | string[]
    description?: string | null
    routeTags?: TaskTemplateCreaterouteTagsInput | string[]
    milestoneTag?: string | null
    semesterTag?: string | null
    tags?: TaskTemplateCreatetagsInput | string[]
    source?: $Enums.TaskTemplateSource
    isActive?: boolean
    archivedAt?: Date | string | null
    useCount?: number
    lastUsedAt?: Date | string | null
    taskType?: $Enums.TaskType
    frequency?: $Enums.TaskFrequency
    customFrequency?: NullableJsonNullValueInput | InputJsonValue
    weeklySchedule?: $Enums.TaskWeeklySchedule
    customScheduleDays?: TaskTemplateCreatecustomScheduleDaysInput | string[]
    assessmentCriteria?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    capabilityLinks?: TaskCapabilityLinkCreateNestedManyWithoutTaskTemplateInput
  }

  export type TaskTemplateUncheckedCreateWithoutUserInput = {
    id?: string
    title: string
    category: $Enums.TaskCategory
    duration?: string
    difficulty?: string | null
    materials?: TaskTemplateCreatematerialsInput | string[]
    description?: string | null
    routeTags?: TaskTemplateCreaterouteTagsInput | string[]
    milestoneTag?: string | null
    semesterTag?: string | null
    tags?: TaskTemplateCreatetagsInput | string[]
    source?: $Enums.TaskTemplateSource
    isActive?: boolean
    archivedAt?: Date | string | null
    useCount?: number
    lastUsedAt?: Date | string | null
    taskType?: $Enums.TaskType
    frequency?: $Enums.TaskFrequency
    customFrequency?: NullableJsonNullValueInput | InputJsonValue
    weeklySchedule?: $Enums.TaskWeeklySchedule
    customScheduleDays?: TaskTemplateCreatecustomScheduleDaysInput | string[]
    assessmentCriteria?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    capabilityLinks?: TaskCapabilityLinkUncheckedCreateNestedManyWithoutTaskTemplateInput
  }

  export type TaskTemplateCreateOrConnectWithoutUserInput = {
    where: TaskTemplateWhereUniqueInput
    create: XOR<TaskTemplateCreateWithoutUserInput, TaskTemplateUncheckedCreateWithoutUserInput>
  }

  export type TaskTemplateCreateManyUserInputEnvelope = {
    data: TaskTemplateCreateManyUserInput | TaskTemplateCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type CapabilityCreateWithoutUserInput = {
    id?: string
    name: string
    category: $Enums.CapabilityCategory
    description?: string | null
    isSystem?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    links?: TaskCapabilityLinkCreateNestedManyWithoutCapabilityInput
  }

  export type CapabilityUncheckedCreateWithoutUserInput = {
    id?: string
    name: string
    category: $Enums.CapabilityCategory
    description?: string | null
    isSystem?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    links?: TaskCapabilityLinkUncheckedCreateNestedManyWithoutCapabilityInput
  }

  export type CapabilityCreateOrConnectWithoutUserInput = {
    where: CapabilityWhereUniqueInput
    create: XOR<CapabilityCreateWithoutUserInput, CapabilityUncheckedCreateWithoutUserInput>
  }

  export type CapabilityCreateManyUserInputEnvelope = {
    data: CapabilityCreateManyUserInput | CapabilityCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type ChildUpsertWithWhereUniqueWithoutUserInput = {
    where: ChildWhereUniqueInput
    update: XOR<ChildUpdateWithoutUserInput, ChildUncheckedUpdateWithoutUserInput>
    create: XOR<ChildCreateWithoutUserInput, ChildUncheckedCreateWithoutUserInput>
  }

  export type ChildUpdateWithWhereUniqueWithoutUserInput = {
    where: ChildWhereUniqueInput
    data: XOR<ChildUpdateWithoutUserInput, ChildUncheckedUpdateWithoutUserInput>
  }

  export type ChildUpdateManyWithWhereWithoutUserInput = {
    where: ChildScalarWhereInput
    data: XOR<ChildUpdateManyMutationInput, ChildUncheckedUpdateManyWithoutUserInput>
  }

  export type ChildScalarWhereInput = {
    AND?: ChildScalarWhereInput | ChildScalarWhereInput[]
    OR?: ChildScalarWhereInput[]
    NOT?: ChildScalarWhereInput | ChildScalarWhereInput[]
    id?: StringFilter<"Child"> | string
    userId?: StringFilter<"Child"> | string
    name?: StringFilter<"Child"> | string
    grade?: IntFilter<"Child"> | number
    educationSystem?: StringFilter<"Child"> | string
    avatarColor?: StringFilter<"Child"> | string
    avatarUrl?: StringNullableFilter<"Child"> | string | null
    targetSchool?: StringNullableFilter<"Child"> | string | null
    currentSchool?: StringNullableFilter<"Child"> | string | null
    birthday?: DateTimeNullableFilter<"Child"> | Date | string | null
    notes?: StringNullableFilter<"Child"> | string | null
    routeId?: StringNullableFilter<"Child"> | string | null
    createdAt?: DateTimeFilter<"Child"> | Date | string
    updatedAt?: DateTimeFilter<"Child"> | Date | string
  }

  export type PlanUpsertWithWhereUniqueWithoutUserInput = {
    where: PlanWhereUniqueInput
    update: XOR<PlanUpdateWithoutUserInput, PlanUncheckedUpdateWithoutUserInput>
    create: XOR<PlanCreateWithoutUserInput, PlanUncheckedCreateWithoutUserInput>
  }

  export type PlanUpdateWithWhereUniqueWithoutUserInput = {
    where: PlanWhereUniqueInput
    data: XOR<PlanUpdateWithoutUserInput, PlanUncheckedUpdateWithoutUserInput>
  }

  export type PlanUpdateManyWithWhereWithoutUserInput = {
    where: PlanScalarWhereInput
    data: XOR<PlanUpdateManyMutationInput, PlanUncheckedUpdateManyWithoutUserInput>
  }

  export type PlanScalarWhereInput = {
    AND?: PlanScalarWhereInput | PlanScalarWhereInput[]
    OR?: PlanScalarWhereInput[]
    NOT?: PlanScalarWhereInput | PlanScalarWhereInput[]
    id?: StringFilter<"Plan"> | string
    userId?: StringFilter<"Plan"> | string
    childId?: StringFilter<"Plan"> | string
    name?: StringFilter<"Plan"> | string
    type?: StringFilter<"Plan"> | string
    status?: StringFilter<"Plan"> | string
    stage?: StringFilter<"Plan"> | string
    description?: StringNullableFilter<"Plan"> | string | null
    requirements?: JsonNullableFilter<"Plan">
    milestones?: JsonNullableFilter<"Plan">
    targets?: JsonNullableFilter<"Plan">
    probability?: IntFilter<"Plan"> | number
    createdAt?: DateTimeFilter<"Plan"> | Date | string
    updatedAt?: DateTimeFilter<"Plan"> | Date | string
  }

  export type WeeklyPlanUpsertWithWhereUniqueWithoutUserInput = {
    where: WeeklyPlanWhereUniqueInput
    update: XOR<WeeklyPlanUpdateWithoutUserInput, WeeklyPlanUncheckedUpdateWithoutUserInput>
    create: XOR<WeeklyPlanCreateWithoutUserInput, WeeklyPlanUncheckedCreateWithoutUserInput>
  }

  export type WeeklyPlanUpdateWithWhereUniqueWithoutUserInput = {
    where: WeeklyPlanWhereUniqueInput
    data: XOR<WeeklyPlanUpdateWithoutUserInput, WeeklyPlanUncheckedUpdateWithoutUserInput>
  }

  export type WeeklyPlanUpdateManyWithWhereWithoutUserInput = {
    where: WeeklyPlanScalarWhereInput
    data: XOR<WeeklyPlanUpdateManyMutationInput, WeeklyPlanUncheckedUpdateManyWithoutUserInput>
  }

  export type WeeklyPlanScalarWhereInput = {
    AND?: WeeklyPlanScalarWhereInput | WeeklyPlanScalarWhereInput[]
    OR?: WeeklyPlanScalarWhereInput[]
    NOT?: WeeklyPlanScalarWhereInput | WeeklyPlanScalarWhereInput[]
    id?: StringFilter<"WeeklyPlan"> | string
    userId?: StringFilter<"WeeklyPlan"> | string
    childId?: StringFilter<"WeeklyPlan"> | string
    weekId?: StringFilter<"WeeklyPlan"> | string
    tasks?: JsonFilter<"WeeklyPlan">
    publishedAt?: DateTimeNullableFilter<"WeeklyPlan"> | Date | string | null
    reviewedAt?: DateTimeNullableFilter<"WeeklyPlan"> | Date | string | null
    parentComment?: StringNullableFilter<"WeeklyPlan"> | string | null
    createdAt?: DateTimeFilter<"WeeklyPlan"> | Date | string
    updatedAt?: DateTimeFilter<"WeeklyPlan"> | Date | string
  }

  export type NotificationUpsertWithWhereUniqueWithoutUserInput = {
    where: NotificationWhereUniqueInput
    update: XOR<NotificationUpdateWithoutUserInput, NotificationUncheckedUpdateWithoutUserInput>
    create: XOR<NotificationCreateWithoutUserInput, NotificationUncheckedCreateWithoutUserInput>
  }

  export type NotificationUpdateWithWhereUniqueWithoutUserInput = {
    where: NotificationWhereUniqueInput
    data: XOR<NotificationUpdateWithoutUserInput, NotificationUncheckedUpdateWithoutUserInput>
  }

  export type NotificationUpdateManyWithWhereWithoutUserInput = {
    where: NotificationScalarWhereInput
    data: XOR<NotificationUpdateManyMutationInput, NotificationUncheckedUpdateManyWithoutUserInput>
  }

  export type NotificationScalarWhereInput = {
    AND?: NotificationScalarWhereInput | NotificationScalarWhereInput[]
    OR?: NotificationScalarWhereInput[]
    NOT?: NotificationScalarWhereInput | NotificationScalarWhereInput[]
    id?: StringFilter<"Notification"> | string
    userId?: StringFilter<"Notification"> | string
    title?: StringFilter<"Notification"> | string
    content?: StringFilter<"Notification"> | string
    readAt?: DateTimeNullableFilter<"Notification"> | Date | string | null
    createdAt?: DateTimeFilter<"Notification"> | Date | string
  }

  export type UserSettingUpsertWithoutUserInput = {
    update: XOR<UserSettingUpdateWithoutUserInput, UserSettingUncheckedUpdateWithoutUserInput>
    create: XOR<UserSettingCreateWithoutUserInput, UserSettingUncheckedCreateWithoutUserInput>
    where?: UserSettingWhereInput
  }

  export type UserSettingUpdateToOneWithWhereWithoutUserInput = {
    where?: UserSettingWhereInput
    data: XOR<UserSettingUpdateWithoutUserInput, UserSettingUncheckedUpdateWithoutUserInput>
  }

  export type UserSettingUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    theme?: StringFieldUpdateOperationsInput | string
    fontSize?: StringFieldUpdateOperationsInput | string
    density?: StringFieldUpdateOperationsInput | string
    reducedMotion?: BoolFieldUpdateOperationsInput | boolean
    defaultLandingPage?: StringFieldUpdateOperationsInput | string
    defaultChildMode?: StringFieldUpdateOperationsInput | string
    notificationPrefs?: JsonNullValueInput | InputJsonValue
    reminderTime?: StringFieldUpdateOperationsInput | string
    doNotDisturb?: BoolFieldUpdateOperationsInput | boolean
    doNotDisturbStart?: NullableStringFieldUpdateOperationsInput | string | null
    doNotDisturbEnd?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserSettingUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    theme?: StringFieldUpdateOperationsInput | string
    fontSize?: StringFieldUpdateOperationsInput | string
    density?: StringFieldUpdateOperationsInput | string
    reducedMotion?: BoolFieldUpdateOperationsInput | boolean
    defaultLandingPage?: StringFieldUpdateOperationsInput | string
    defaultChildMode?: StringFieldUpdateOperationsInput | string
    notificationPrefs?: JsonNullValueInput | InputJsonValue
    reminderTime?: StringFieldUpdateOperationsInput | string
    doNotDisturb?: BoolFieldUpdateOperationsInput | boolean
    doNotDisturbStart?: NullableStringFieldUpdateOperationsInput | string | null
    doNotDisturbEnd?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TaskTemplateUpsertWithWhereUniqueWithoutUserInput = {
    where: TaskTemplateWhereUniqueInput
    update: XOR<TaskTemplateUpdateWithoutUserInput, TaskTemplateUncheckedUpdateWithoutUserInput>
    create: XOR<TaskTemplateCreateWithoutUserInput, TaskTemplateUncheckedCreateWithoutUserInput>
  }

  export type TaskTemplateUpdateWithWhereUniqueWithoutUserInput = {
    where: TaskTemplateWhereUniqueInput
    data: XOR<TaskTemplateUpdateWithoutUserInput, TaskTemplateUncheckedUpdateWithoutUserInput>
  }

  export type TaskTemplateUpdateManyWithWhereWithoutUserInput = {
    where: TaskTemplateScalarWhereInput
    data: XOR<TaskTemplateUpdateManyMutationInput, TaskTemplateUncheckedUpdateManyWithoutUserInput>
  }

  export type TaskTemplateScalarWhereInput = {
    AND?: TaskTemplateScalarWhereInput | TaskTemplateScalarWhereInput[]
    OR?: TaskTemplateScalarWhereInput[]
    NOT?: TaskTemplateScalarWhereInput | TaskTemplateScalarWhereInput[]
    id?: StringFilter<"TaskTemplate"> | string
    userId?: StringFilter<"TaskTemplate"> | string
    title?: StringFilter<"TaskTemplate"> | string
    category?: EnumTaskCategoryFilter<"TaskTemplate"> | $Enums.TaskCategory
    duration?: StringFilter<"TaskTemplate"> | string
    difficulty?: StringNullableFilter<"TaskTemplate"> | string | null
    materials?: StringNullableListFilter<"TaskTemplate">
    description?: StringNullableFilter<"TaskTemplate"> | string | null
    routeTags?: StringNullableListFilter<"TaskTemplate">
    milestoneTag?: StringNullableFilter<"TaskTemplate"> | string | null
    semesterTag?: StringNullableFilter<"TaskTemplate"> | string | null
    tags?: StringNullableListFilter<"TaskTemplate">
    source?: EnumTaskTemplateSourceFilter<"TaskTemplate"> | $Enums.TaskTemplateSource
    isActive?: BoolFilter<"TaskTemplate"> | boolean
    archivedAt?: DateTimeNullableFilter<"TaskTemplate"> | Date | string | null
    useCount?: IntFilter<"TaskTemplate"> | number
    lastUsedAt?: DateTimeNullableFilter<"TaskTemplate"> | Date | string | null
    taskType?: EnumTaskTypeFilter<"TaskTemplate"> | $Enums.TaskType
    frequency?: EnumTaskFrequencyFilter<"TaskTemplate"> | $Enums.TaskFrequency
    customFrequency?: JsonNullableFilter<"TaskTemplate">
    weeklySchedule?: EnumTaskWeeklyScheduleFilter<"TaskTemplate"> | $Enums.TaskWeeklySchedule
    customScheduleDays?: StringNullableListFilter<"TaskTemplate">
    assessmentCriteria?: JsonFilter<"TaskTemplate">
    createdAt?: DateTimeFilter<"TaskTemplate"> | Date | string
    updatedAt?: DateTimeFilter<"TaskTemplate"> | Date | string
  }

  export type CapabilityUpsertWithWhereUniqueWithoutUserInput = {
    where: CapabilityWhereUniqueInput
    update: XOR<CapabilityUpdateWithoutUserInput, CapabilityUncheckedUpdateWithoutUserInput>
    create: XOR<CapabilityCreateWithoutUserInput, CapabilityUncheckedCreateWithoutUserInput>
  }

  export type CapabilityUpdateWithWhereUniqueWithoutUserInput = {
    where: CapabilityWhereUniqueInput
    data: XOR<CapabilityUpdateWithoutUserInput, CapabilityUncheckedUpdateWithoutUserInput>
  }

  export type CapabilityUpdateManyWithWhereWithoutUserInput = {
    where: CapabilityScalarWhereInput
    data: XOR<CapabilityUpdateManyMutationInput, CapabilityUncheckedUpdateManyWithoutUserInput>
  }

  export type CapabilityScalarWhereInput = {
    AND?: CapabilityScalarWhereInput | CapabilityScalarWhereInput[]
    OR?: CapabilityScalarWhereInput[]
    NOT?: CapabilityScalarWhereInput | CapabilityScalarWhereInput[]
    id?: StringFilter<"Capability"> | string
    userId?: StringNullableFilter<"Capability"> | string | null
    name?: StringFilter<"Capability"> | string
    category?: EnumCapabilityCategoryFilter<"Capability"> | $Enums.CapabilityCategory
    description?: StringNullableFilter<"Capability"> | string | null
    isSystem?: BoolFilter<"Capability"> | boolean
    createdAt?: DateTimeFilter<"Capability"> | Date | string
    updatedAt?: DateTimeFilter<"Capability"> | Date | string
  }

  export type UserCreateWithoutSettingsInput = {
    id?: string
    username: string
    passwordHash: string
    name?: string | null
    role?: $Enums.UserRole
    avatarUrl?: string | null
    phone?: string | null
    email?: string | null
    wechatOpenId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    children?: ChildCreateNestedManyWithoutUserInput
    plans?: PlanCreateNestedManyWithoutUserInput
    weeklyPlans?: WeeklyPlanCreateNestedManyWithoutUserInput
    notifications?: NotificationCreateNestedManyWithoutUserInput
    taskTemplates?: TaskTemplateCreateNestedManyWithoutUserInput
    capabilities?: CapabilityCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutSettingsInput = {
    id?: string
    username: string
    passwordHash: string
    name?: string | null
    role?: $Enums.UserRole
    avatarUrl?: string | null
    phone?: string | null
    email?: string | null
    wechatOpenId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    children?: ChildUncheckedCreateNestedManyWithoutUserInput
    plans?: PlanUncheckedCreateNestedManyWithoutUserInput
    weeklyPlans?: WeeklyPlanUncheckedCreateNestedManyWithoutUserInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutUserInput
    taskTemplates?: TaskTemplateUncheckedCreateNestedManyWithoutUserInput
    capabilities?: CapabilityUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutSettingsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutSettingsInput, UserUncheckedCreateWithoutSettingsInput>
  }

  export type UserUpsertWithoutSettingsInput = {
    update: XOR<UserUpdateWithoutSettingsInput, UserUncheckedUpdateWithoutSettingsInput>
    create: XOR<UserCreateWithoutSettingsInput, UserUncheckedCreateWithoutSettingsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutSettingsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutSettingsInput, UserUncheckedUpdateWithoutSettingsInput>
  }

  export type UserUpdateWithoutSettingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    wechatOpenId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    children?: ChildUpdateManyWithoutUserNestedInput
    plans?: PlanUpdateManyWithoutUserNestedInput
    weeklyPlans?: WeeklyPlanUpdateManyWithoutUserNestedInput
    notifications?: NotificationUpdateManyWithoutUserNestedInput
    taskTemplates?: TaskTemplateUpdateManyWithoutUserNestedInput
    capabilities?: CapabilityUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutSettingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    wechatOpenId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    children?: ChildUncheckedUpdateManyWithoutUserNestedInput
    plans?: PlanUncheckedUpdateManyWithoutUserNestedInput
    weeklyPlans?: WeeklyPlanUncheckedUpdateManyWithoutUserNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutUserNestedInput
    taskTemplates?: TaskTemplateUncheckedUpdateManyWithoutUserNestedInput
    capabilities?: CapabilityUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutChildrenInput = {
    id?: string
    username: string
    passwordHash: string
    name?: string | null
    role?: $Enums.UserRole
    avatarUrl?: string | null
    phone?: string | null
    email?: string | null
    wechatOpenId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    plans?: PlanCreateNestedManyWithoutUserInput
    weeklyPlans?: WeeklyPlanCreateNestedManyWithoutUserInput
    notifications?: NotificationCreateNestedManyWithoutUserInput
    settings?: UserSettingCreateNestedOneWithoutUserInput
    taskTemplates?: TaskTemplateCreateNestedManyWithoutUserInput
    capabilities?: CapabilityCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutChildrenInput = {
    id?: string
    username: string
    passwordHash: string
    name?: string | null
    role?: $Enums.UserRole
    avatarUrl?: string | null
    phone?: string | null
    email?: string | null
    wechatOpenId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    plans?: PlanUncheckedCreateNestedManyWithoutUserInput
    weeklyPlans?: WeeklyPlanUncheckedCreateNestedManyWithoutUserInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutUserInput
    settings?: UserSettingUncheckedCreateNestedOneWithoutUserInput
    taskTemplates?: TaskTemplateUncheckedCreateNestedManyWithoutUserInput
    capabilities?: CapabilityUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutChildrenInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutChildrenInput, UserUncheckedCreateWithoutChildrenInput>
  }

  export type PlanCreateWithoutChildInput = {
    id?: string
    name: string
    type: string
    status?: string
    stage: string
    description?: string | null
    requirements?: NullableJsonNullValueInput | InputJsonValue
    milestones?: NullableJsonNullValueInput | InputJsonValue
    targets?: NullableJsonNullValueInput | InputJsonValue
    probability?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutPlansInput
  }

  export type PlanUncheckedCreateWithoutChildInput = {
    id?: string
    userId: string
    name: string
    type: string
    status?: string
    stage: string
    description?: string | null
    requirements?: NullableJsonNullValueInput | InputJsonValue
    milestones?: NullableJsonNullValueInput | InputJsonValue
    targets?: NullableJsonNullValueInput | InputJsonValue
    probability?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PlanCreateOrConnectWithoutChildInput = {
    where: PlanWhereUniqueInput
    create: XOR<PlanCreateWithoutChildInput, PlanUncheckedCreateWithoutChildInput>
  }

  export type PlanCreateManyChildInputEnvelope = {
    data: PlanCreateManyChildInput | PlanCreateManyChildInput[]
    skipDuplicates?: boolean
  }

  export type WeeklyPlanCreateWithoutChildInput = {
    id?: string
    weekId: string
    tasks?: JsonNullValueInput | InputJsonValue
    publishedAt?: Date | string | null
    reviewedAt?: Date | string | null
    parentComment?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutWeeklyPlansInput
  }

  export type WeeklyPlanUncheckedCreateWithoutChildInput = {
    id?: string
    userId: string
    weekId: string
    tasks?: JsonNullValueInput | InputJsonValue
    publishedAt?: Date | string | null
    reviewedAt?: Date | string | null
    parentComment?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type WeeklyPlanCreateOrConnectWithoutChildInput = {
    where: WeeklyPlanWhereUniqueInput
    create: XOR<WeeklyPlanCreateWithoutChildInput, WeeklyPlanUncheckedCreateWithoutChildInput>
  }

  export type WeeklyPlanCreateManyChildInputEnvelope = {
    data: WeeklyPlanCreateManyChildInput | WeeklyPlanCreateManyChildInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutChildrenInput = {
    update: XOR<UserUpdateWithoutChildrenInput, UserUncheckedUpdateWithoutChildrenInput>
    create: XOR<UserCreateWithoutChildrenInput, UserUncheckedCreateWithoutChildrenInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutChildrenInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutChildrenInput, UserUncheckedUpdateWithoutChildrenInput>
  }

  export type UserUpdateWithoutChildrenInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    wechatOpenId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    plans?: PlanUpdateManyWithoutUserNestedInput
    weeklyPlans?: WeeklyPlanUpdateManyWithoutUserNestedInput
    notifications?: NotificationUpdateManyWithoutUserNestedInput
    settings?: UserSettingUpdateOneWithoutUserNestedInput
    taskTemplates?: TaskTemplateUpdateManyWithoutUserNestedInput
    capabilities?: CapabilityUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutChildrenInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    wechatOpenId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    plans?: PlanUncheckedUpdateManyWithoutUserNestedInput
    weeklyPlans?: WeeklyPlanUncheckedUpdateManyWithoutUserNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutUserNestedInput
    settings?: UserSettingUncheckedUpdateOneWithoutUserNestedInput
    taskTemplates?: TaskTemplateUncheckedUpdateManyWithoutUserNestedInput
    capabilities?: CapabilityUncheckedUpdateManyWithoutUserNestedInput
  }

  export type PlanUpsertWithWhereUniqueWithoutChildInput = {
    where: PlanWhereUniqueInput
    update: XOR<PlanUpdateWithoutChildInput, PlanUncheckedUpdateWithoutChildInput>
    create: XOR<PlanCreateWithoutChildInput, PlanUncheckedCreateWithoutChildInput>
  }

  export type PlanUpdateWithWhereUniqueWithoutChildInput = {
    where: PlanWhereUniqueInput
    data: XOR<PlanUpdateWithoutChildInput, PlanUncheckedUpdateWithoutChildInput>
  }

  export type PlanUpdateManyWithWhereWithoutChildInput = {
    where: PlanScalarWhereInput
    data: XOR<PlanUpdateManyMutationInput, PlanUncheckedUpdateManyWithoutChildInput>
  }

  export type WeeklyPlanUpsertWithWhereUniqueWithoutChildInput = {
    where: WeeklyPlanWhereUniqueInput
    update: XOR<WeeklyPlanUpdateWithoutChildInput, WeeklyPlanUncheckedUpdateWithoutChildInput>
    create: XOR<WeeklyPlanCreateWithoutChildInput, WeeklyPlanUncheckedCreateWithoutChildInput>
  }

  export type WeeklyPlanUpdateWithWhereUniqueWithoutChildInput = {
    where: WeeklyPlanWhereUniqueInput
    data: XOR<WeeklyPlanUpdateWithoutChildInput, WeeklyPlanUncheckedUpdateWithoutChildInput>
  }

  export type WeeklyPlanUpdateManyWithWhereWithoutChildInput = {
    where: WeeklyPlanScalarWhereInput
    data: XOR<WeeklyPlanUpdateManyMutationInput, WeeklyPlanUncheckedUpdateManyWithoutChildInput>
  }

  export type UserCreateWithoutPlansInput = {
    id?: string
    username: string
    passwordHash: string
    name?: string | null
    role?: $Enums.UserRole
    avatarUrl?: string | null
    phone?: string | null
    email?: string | null
    wechatOpenId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    children?: ChildCreateNestedManyWithoutUserInput
    weeklyPlans?: WeeklyPlanCreateNestedManyWithoutUserInput
    notifications?: NotificationCreateNestedManyWithoutUserInput
    settings?: UserSettingCreateNestedOneWithoutUserInput
    taskTemplates?: TaskTemplateCreateNestedManyWithoutUserInput
    capabilities?: CapabilityCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutPlansInput = {
    id?: string
    username: string
    passwordHash: string
    name?: string | null
    role?: $Enums.UserRole
    avatarUrl?: string | null
    phone?: string | null
    email?: string | null
    wechatOpenId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    children?: ChildUncheckedCreateNestedManyWithoutUserInput
    weeklyPlans?: WeeklyPlanUncheckedCreateNestedManyWithoutUserInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutUserInput
    settings?: UserSettingUncheckedCreateNestedOneWithoutUserInput
    taskTemplates?: TaskTemplateUncheckedCreateNestedManyWithoutUserInput
    capabilities?: CapabilityUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutPlansInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutPlansInput, UserUncheckedCreateWithoutPlansInput>
  }

  export type ChildCreateWithoutPlansInput = {
    id?: string
    name: string
    grade: number
    educationSystem?: string
    avatarColor?: string
    avatarUrl?: string | null
    targetSchool?: string | null
    currentSchool?: string | null
    birthday?: Date | string | null
    notes?: string | null
    routeId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutChildrenInput
    weeklyPlans?: WeeklyPlanCreateNestedManyWithoutChildInput
  }

  export type ChildUncheckedCreateWithoutPlansInput = {
    id?: string
    userId: string
    name: string
    grade: number
    educationSystem?: string
    avatarColor?: string
    avatarUrl?: string | null
    targetSchool?: string | null
    currentSchool?: string | null
    birthday?: Date | string | null
    notes?: string | null
    routeId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    weeklyPlans?: WeeklyPlanUncheckedCreateNestedManyWithoutChildInput
  }

  export type ChildCreateOrConnectWithoutPlansInput = {
    where: ChildWhereUniqueInput
    create: XOR<ChildCreateWithoutPlansInput, ChildUncheckedCreateWithoutPlansInput>
  }

  export type UserUpsertWithoutPlansInput = {
    update: XOR<UserUpdateWithoutPlansInput, UserUncheckedUpdateWithoutPlansInput>
    create: XOR<UserCreateWithoutPlansInput, UserUncheckedCreateWithoutPlansInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutPlansInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutPlansInput, UserUncheckedUpdateWithoutPlansInput>
  }

  export type UserUpdateWithoutPlansInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    wechatOpenId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    children?: ChildUpdateManyWithoutUserNestedInput
    weeklyPlans?: WeeklyPlanUpdateManyWithoutUserNestedInput
    notifications?: NotificationUpdateManyWithoutUserNestedInput
    settings?: UserSettingUpdateOneWithoutUserNestedInput
    taskTemplates?: TaskTemplateUpdateManyWithoutUserNestedInput
    capabilities?: CapabilityUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutPlansInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    wechatOpenId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    children?: ChildUncheckedUpdateManyWithoutUserNestedInput
    weeklyPlans?: WeeklyPlanUncheckedUpdateManyWithoutUserNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutUserNestedInput
    settings?: UserSettingUncheckedUpdateOneWithoutUserNestedInput
    taskTemplates?: TaskTemplateUncheckedUpdateManyWithoutUserNestedInput
    capabilities?: CapabilityUncheckedUpdateManyWithoutUserNestedInput
  }

  export type ChildUpsertWithoutPlansInput = {
    update: XOR<ChildUpdateWithoutPlansInput, ChildUncheckedUpdateWithoutPlansInput>
    create: XOR<ChildCreateWithoutPlansInput, ChildUncheckedCreateWithoutPlansInput>
    where?: ChildWhereInput
  }

  export type ChildUpdateToOneWithWhereWithoutPlansInput = {
    where?: ChildWhereInput
    data: XOR<ChildUpdateWithoutPlansInput, ChildUncheckedUpdateWithoutPlansInput>
  }

  export type ChildUpdateWithoutPlansInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    grade?: IntFieldUpdateOperationsInput | number
    educationSystem?: StringFieldUpdateOperationsInput | string
    avatarColor?: StringFieldUpdateOperationsInput | string
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    targetSchool?: NullableStringFieldUpdateOperationsInput | string | null
    currentSchool?: NullableStringFieldUpdateOperationsInput | string | null
    birthday?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    routeId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutChildrenNestedInput
    weeklyPlans?: WeeklyPlanUpdateManyWithoutChildNestedInput
  }

  export type ChildUncheckedUpdateWithoutPlansInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    grade?: IntFieldUpdateOperationsInput | number
    educationSystem?: StringFieldUpdateOperationsInput | string
    avatarColor?: StringFieldUpdateOperationsInput | string
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    targetSchool?: NullableStringFieldUpdateOperationsInput | string | null
    currentSchool?: NullableStringFieldUpdateOperationsInput | string | null
    birthday?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    routeId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    weeklyPlans?: WeeklyPlanUncheckedUpdateManyWithoutChildNestedInput
  }

  export type UserCreateWithoutTaskTemplatesInput = {
    id?: string
    username: string
    passwordHash: string
    name?: string | null
    role?: $Enums.UserRole
    avatarUrl?: string | null
    phone?: string | null
    email?: string | null
    wechatOpenId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    children?: ChildCreateNestedManyWithoutUserInput
    plans?: PlanCreateNestedManyWithoutUserInput
    weeklyPlans?: WeeklyPlanCreateNestedManyWithoutUserInput
    notifications?: NotificationCreateNestedManyWithoutUserInput
    settings?: UserSettingCreateNestedOneWithoutUserInput
    capabilities?: CapabilityCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutTaskTemplatesInput = {
    id?: string
    username: string
    passwordHash: string
    name?: string | null
    role?: $Enums.UserRole
    avatarUrl?: string | null
    phone?: string | null
    email?: string | null
    wechatOpenId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    children?: ChildUncheckedCreateNestedManyWithoutUserInput
    plans?: PlanUncheckedCreateNestedManyWithoutUserInput
    weeklyPlans?: WeeklyPlanUncheckedCreateNestedManyWithoutUserInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutUserInput
    settings?: UserSettingUncheckedCreateNestedOneWithoutUserInput
    capabilities?: CapabilityUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutTaskTemplatesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutTaskTemplatesInput, UserUncheckedCreateWithoutTaskTemplatesInput>
  }

  export type TaskCapabilityLinkCreateWithoutTaskTemplateInput = {
    id?: string
    weight?: number
    expectedProgress?: number
    capability: CapabilityCreateNestedOneWithoutLinksInput
  }

  export type TaskCapabilityLinkUncheckedCreateWithoutTaskTemplateInput = {
    id?: string
    capabilityId: string
    weight?: number
    expectedProgress?: number
  }

  export type TaskCapabilityLinkCreateOrConnectWithoutTaskTemplateInput = {
    where: TaskCapabilityLinkWhereUniqueInput
    create: XOR<TaskCapabilityLinkCreateWithoutTaskTemplateInput, TaskCapabilityLinkUncheckedCreateWithoutTaskTemplateInput>
  }

  export type TaskCapabilityLinkCreateManyTaskTemplateInputEnvelope = {
    data: TaskCapabilityLinkCreateManyTaskTemplateInput | TaskCapabilityLinkCreateManyTaskTemplateInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutTaskTemplatesInput = {
    update: XOR<UserUpdateWithoutTaskTemplatesInput, UserUncheckedUpdateWithoutTaskTemplatesInput>
    create: XOR<UserCreateWithoutTaskTemplatesInput, UserUncheckedCreateWithoutTaskTemplatesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutTaskTemplatesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutTaskTemplatesInput, UserUncheckedUpdateWithoutTaskTemplatesInput>
  }

  export type UserUpdateWithoutTaskTemplatesInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    wechatOpenId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    children?: ChildUpdateManyWithoutUserNestedInput
    plans?: PlanUpdateManyWithoutUserNestedInput
    weeklyPlans?: WeeklyPlanUpdateManyWithoutUserNestedInput
    notifications?: NotificationUpdateManyWithoutUserNestedInput
    settings?: UserSettingUpdateOneWithoutUserNestedInput
    capabilities?: CapabilityUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutTaskTemplatesInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    wechatOpenId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    children?: ChildUncheckedUpdateManyWithoutUserNestedInput
    plans?: PlanUncheckedUpdateManyWithoutUserNestedInput
    weeklyPlans?: WeeklyPlanUncheckedUpdateManyWithoutUserNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutUserNestedInput
    settings?: UserSettingUncheckedUpdateOneWithoutUserNestedInput
    capabilities?: CapabilityUncheckedUpdateManyWithoutUserNestedInput
  }

  export type TaskCapabilityLinkUpsertWithWhereUniqueWithoutTaskTemplateInput = {
    where: TaskCapabilityLinkWhereUniqueInput
    update: XOR<TaskCapabilityLinkUpdateWithoutTaskTemplateInput, TaskCapabilityLinkUncheckedUpdateWithoutTaskTemplateInput>
    create: XOR<TaskCapabilityLinkCreateWithoutTaskTemplateInput, TaskCapabilityLinkUncheckedCreateWithoutTaskTemplateInput>
  }

  export type TaskCapabilityLinkUpdateWithWhereUniqueWithoutTaskTemplateInput = {
    where: TaskCapabilityLinkWhereUniqueInput
    data: XOR<TaskCapabilityLinkUpdateWithoutTaskTemplateInput, TaskCapabilityLinkUncheckedUpdateWithoutTaskTemplateInput>
  }

  export type TaskCapabilityLinkUpdateManyWithWhereWithoutTaskTemplateInput = {
    where: TaskCapabilityLinkScalarWhereInput
    data: XOR<TaskCapabilityLinkUpdateManyMutationInput, TaskCapabilityLinkUncheckedUpdateManyWithoutTaskTemplateInput>
  }

  export type TaskCapabilityLinkScalarWhereInput = {
    AND?: TaskCapabilityLinkScalarWhereInput | TaskCapabilityLinkScalarWhereInput[]
    OR?: TaskCapabilityLinkScalarWhereInput[]
    NOT?: TaskCapabilityLinkScalarWhereInput | TaskCapabilityLinkScalarWhereInput[]
    id?: StringFilter<"TaskCapabilityLink"> | string
    taskTemplateId?: StringFilter<"TaskCapabilityLink"> | string
    capabilityId?: StringFilter<"TaskCapabilityLink"> | string
    weight?: FloatFilter<"TaskCapabilityLink"> | number
    expectedProgress?: FloatFilter<"TaskCapabilityLink"> | number
  }

  export type UserCreateWithoutCapabilitiesInput = {
    id?: string
    username: string
    passwordHash: string
    name?: string | null
    role?: $Enums.UserRole
    avatarUrl?: string | null
    phone?: string | null
    email?: string | null
    wechatOpenId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    children?: ChildCreateNestedManyWithoutUserInput
    plans?: PlanCreateNestedManyWithoutUserInput
    weeklyPlans?: WeeklyPlanCreateNestedManyWithoutUserInput
    notifications?: NotificationCreateNestedManyWithoutUserInput
    settings?: UserSettingCreateNestedOneWithoutUserInput
    taskTemplates?: TaskTemplateCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutCapabilitiesInput = {
    id?: string
    username: string
    passwordHash: string
    name?: string | null
    role?: $Enums.UserRole
    avatarUrl?: string | null
    phone?: string | null
    email?: string | null
    wechatOpenId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    children?: ChildUncheckedCreateNestedManyWithoutUserInput
    plans?: PlanUncheckedCreateNestedManyWithoutUserInput
    weeklyPlans?: WeeklyPlanUncheckedCreateNestedManyWithoutUserInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutUserInput
    settings?: UserSettingUncheckedCreateNestedOneWithoutUserInput
    taskTemplates?: TaskTemplateUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutCapabilitiesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutCapabilitiesInput, UserUncheckedCreateWithoutCapabilitiesInput>
  }

  export type TaskCapabilityLinkCreateWithoutCapabilityInput = {
    id?: string
    weight?: number
    expectedProgress?: number
    taskTemplate: TaskTemplateCreateNestedOneWithoutCapabilityLinksInput
  }

  export type TaskCapabilityLinkUncheckedCreateWithoutCapabilityInput = {
    id?: string
    taskTemplateId: string
    weight?: number
    expectedProgress?: number
  }

  export type TaskCapabilityLinkCreateOrConnectWithoutCapabilityInput = {
    where: TaskCapabilityLinkWhereUniqueInput
    create: XOR<TaskCapabilityLinkCreateWithoutCapabilityInput, TaskCapabilityLinkUncheckedCreateWithoutCapabilityInput>
  }

  export type TaskCapabilityLinkCreateManyCapabilityInputEnvelope = {
    data: TaskCapabilityLinkCreateManyCapabilityInput | TaskCapabilityLinkCreateManyCapabilityInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutCapabilitiesInput = {
    update: XOR<UserUpdateWithoutCapabilitiesInput, UserUncheckedUpdateWithoutCapabilitiesInput>
    create: XOR<UserCreateWithoutCapabilitiesInput, UserUncheckedCreateWithoutCapabilitiesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutCapabilitiesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutCapabilitiesInput, UserUncheckedUpdateWithoutCapabilitiesInput>
  }

  export type UserUpdateWithoutCapabilitiesInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    wechatOpenId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    children?: ChildUpdateManyWithoutUserNestedInput
    plans?: PlanUpdateManyWithoutUserNestedInput
    weeklyPlans?: WeeklyPlanUpdateManyWithoutUserNestedInput
    notifications?: NotificationUpdateManyWithoutUserNestedInput
    settings?: UserSettingUpdateOneWithoutUserNestedInput
    taskTemplates?: TaskTemplateUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutCapabilitiesInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    wechatOpenId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    children?: ChildUncheckedUpdateManyWithoutUserNestedInput
    plans?: PlanUncheckedUpdateManyWithoutUserNestedInput
    weeklyPlans?: WeeklyPlanUncheckedUpdateManyWithoutUserNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutUserNestedInput
    settings?: UserSettingUncheckedUpdateOneWithoutUserNestedInput
    taskTemplates?: TaskTemplateUncheckedUpdateManyWithoutUserNestedInput
  }

  export type TaskCapabilityLinkUpsertWithWhereUniqueWithoutCapabilityInput = {
    where: TaskCapabilityLinkWhereUniqueInput
    update: XOR<TaskCapabilityLinkUpdateWithoutCapabilityInput, TaskCapabilityLinkUncheckedUpdateWithoutCapabilityInput>
    create: XOR<TaskCapabilityLinkCreateWithoutCapabilityInput, TaskCapabilityLinkUncheckedCreateWithoutCapabilityInput>
  }

  export type TaskCapabilityLinkUpdateWithWhereUniqueWithoutCapabilityInput = {
    where: TaskCapabilityLinkWhereUniqueInput
    data: XOR<TaskCapabilityLinkUpdateWithoutCapabilityInput, TaskCapabilityLinkUncheckedUpdateWithoutCapabilityInput>
  }

  export type TaskCapabilityLinkUpdateManyWithWhereWithoutCapabilityInput = {
    where: TaskCapabilityLinkScalarWhereInput
    data: XOR<TaskCapabilityLinkUpdateManyMutationInput, TaskCapabilityLinkUncheckedUpdateManyWithoutCapabilityInput>
  }

  export type TaskTemplateCreateWithoutCapabilityLinksInput = {
    id?: string
    title: string
    category: $Enums.TaskCategory
    duration?: string
    difficulty?: string | null
    materials?: TaskTemplateCreatematerialsInput | string[]
    description?: string | null
    routeTags?: TaskTemplateCreaterouteTagsInput | string[]
    milestoneTag?: string | null
    semesterTag?: string | null
    tags?: TaskTemplateCreatetagsInput | string[]
    source?: $Enums.TaskTemplateSource
    isActive?: boolean
    archivedAt?: Date | string | null
    useCount?: number
    lastUsedAt?: Date | string | null
    taskType?: $Enums.TaskType
    frequency?: $Enums.TaskFrequency
    customFrequency?: NullableJsonNullValueInput | InputJsonValue
    weeklySchedule?: $Enums.TaskWeeklySchedule
    customScheduleDays?: TaskTemplateCreatecustomScheduleDaysInput | string[]
    assessmentCriteria?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutTaskTemplatesInput
  }

  export type TaskTemplateUncheckedCreateWithoutCapabilityLinksInput = {
    id?: string
    userId: string
    title: string
    category: $Enums.TaskCategory
    duration?: string
    difficulty?: string | null
    materials?: TaskTemplateCreatematerialsInput | string[]
    description?: string | null
    routeTags?: TaskTemplateCreaterouteTagsInput | string[]
    milestoneTag?: string | null
    semesterTag?: string | null
    tags?: TaskTemplateCreatetagsInput | string[]
    source?: $Enums.TaskTemplateSource
    isActive?: boolean
    archivedAt?: Date | string | null
    useCount?: number
    lastUsedAt?: Date | string | null
    taskType?: $Enums.TaskType
    frequency?: $Enums.TaskFrequency
    customFrequency?: NullableJsonNullValueInput | InputJsonValue
    weeklySchedule?: $Enums.TaskWeeklySchedule
    customScheduleDays?: TaskTemplateCreatecustomScheduleDaysInput | string[]
    assessmentCriteria?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TaskTemplateCreateOrConnectWithoutCapabilityLinksInput = {
    where: TaskTemplateWhereUniqueInput
    create: XOR<TaskTemplateCreateWithoutCapabilityLinksInput, TaskTemplateUncheckedCreateWithoutCapabilityLinksInput>
  }

  export type CapabilityCreateWithoutLinksInput = {
    id?: string
    name: string
    category: $Enums.CapabilityCategory
    description?: string | null
    isSystem?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    user?: UserCreateNestedOneWithoutCapabilitiesInput
  }

  export type CapabilityUncheckedCreateWithoutLinksInput = {
    id?: string
    userId?: string | null
    name: string
    category: $Enums.CapabilityCategory
    description?: string | null
    isSystem?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CapabilityCreateOrConnectWithoutLinksInput = {
    where: CapabilityWhereUniqueInput
    create: XOR<CapabilityCreateWithoutLinksInput, CapabilityUncheckedCreateWithoutLinksInput>
  }

  export type TaskTemplateUpsertWithoutCapabilityLinksInput = {
    update: XOR<TaskTemplateUpdateWithoutCapabilityLinksInput, TaskTemplateUncheckedUpdateWithoutCapabilityLinksInput>
    create: XOR<TaskTemplateCreateWithoutCapabilityLinksInput, TaskTemplateUncheckedCreateWithoutCapabilityLinksInput>
    where?: TaskTemplateWhereInput
  }

  export type TaskTemplateUpdateToOneWithWhereWithoutCapabilityLinksInput = {
    where?: TaskTemplateWhereInput
    data: XOR<TaskTemplateUpdateWithoutCapabilityLinksInput, TaskTemplateUncheckedUpdateWithoutCapabilityLinksInput>
  }

  export type TaskTemplateUpdateWithoutCapabilityLinksInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    category?: EnumTaskCategoryFieldUpdateOperationsInput | $Enums.TaskCategory
    duration?: StringFieldUpdateOperationsInput | string
    difficulty?: NullableStringFieldUpdateOperationsInput | string | null
    materials?: TaskTemplateUpdatematerialsInput | string[]
    description?: NullableStringFieldUpdateOperationsInput | string | null
    routeTags?: TaskTemplateUpdaterouteTagsInput | string[]
    milestoneTag?: NullableStringFieldUpdateOperationsInput | string | null
    semesterTag?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: TaskTemplateUpdatetagsInput | string[]
    source?: EnumTaskTemplateSourceFieldUpdateOperationsInput | $Enums.TaskTemplateSource
    isActive?: BoolFieldUpdateOperationsInput | boolean
    archivedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    useCount?: IntFieldUpdateOperationsInput | number
    lastUsedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    taskType?: EnumTaskTypeFieldUpdateOperationsInput | $Enums.TaskType
    frequency?: EnumTaskFrequencyFieldUpdateOperationsInput | $Enums.TaskFrequency
    customFrequency?: NullableJsonNullValueInput | InputJsonValue
    weeklySchedule?: EnumTaskWeeklyScheduleFieldUpdateOperationsInput | $Enums.TaskWeeklySchedule
    customScheduleDays?: TaskTemplateUpdatecustomScheduleDaysInput | string[]
    assessmentCriteria?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutTaskTemplatesNestedInput
  }

  export type TaskTemplateUncheckedUpdateWithoutCapabilityLinksInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    category?: EnumTaskCategoryFieldUpdateOperationsInput | $Enums.TaskCategory
    duration?: StringFieldUpdateOperationsInput | string
    difficulty?: NullableStringFieldUpdateOperationsInput | string | null
    materials?: TaskTemplateUpdatematerialsInput | string[]
    description?: NullableStringFieldUpdateOperationsInput | string | null
    routeTags?: TaskTemplateUpdaterouteTagsInput | string[]
    milestoneTag?: NullableStringFieldUpdateOperationsInput | string | null
    semesterTag?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: TaskTemplateUpdatetagsInput | string[]
    source?: EnumTaskTemplateSourceFieldUpdateOperationsInput | $Enums.TaskTemplateSource
    isActive?: BoolFieldUpdateOperationsInput | boolean
    archivedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    useCount?: IntFieldUpdateOperationsInput | number
    lastUsedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    taskType?: EnumTaskTypeFieldUpdateOperationsInput | $Enums.TaskType
    frequency?: EnumTaskFrequencyFieldUpdateOperationsInput | $Enums.TaskFrequency
    customFrequency?: NullableJsonNullValueInput | InputJsonValue
    weeklySchedule?: EnumTaskWeeklyScheduleFieldUpdateOperationsInput | $Enums.TaskWeeklySchedule
    customScheduleDays?: TaskTemplateUpdatecustomScheduleDaysInput | string[]
    assessmentCriteria?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CapabilityUpsertWithoutLinksInput = {
    update: XOR<CapabilityUpdateWithoutLinksInput, CapabilityUncheckedUpdateWithoutLinksInput>
    create: XOR<CapabilityCreateWithoutLinksInput, CapabilityUncheckedCreateWithoutLinksInput>
    where?: CapabilityWhereInput
  }

  export type CapabilityUpdateToOneWithWhereWithoutLinksInput = {
    where?: CapabilityWhereInput
    data: XOR<CapabilityUpdateWithoutLinksInput, CapabilityUncheckedUpdateWithoutLinksInput>
  }

  export type CapabilityUpdateWithoutLinksInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    category?: EnumCapabilityCategoryFieldUpdateOperationsInput | $Enums.CapabilityCategory
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isSystem?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneWithoutCapabilitiesNestedInput
  }

  export type CapabilityUncheckedUpdateWithoutLinksInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    category?: EnumCapabilityCategoryFieldUpdateOperationsInput | $Enums.CapabilityCategory
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isSystem?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCreateWithoutWeeklyPlansInput = {
    id?: string
    username: string
    passwordHash: string
    name?: string | null
    role?: $Enums.UserRole
    avatarUrl?: string | null
    phone?: string | null
    email?: string | null
    wechatOpenId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    children?: ChildCreateNestedManyWithoutUserInput
    plans?: PlanCreateNestedManyWithoutUserInput
    notifications?: NotificationCreateNestedManyWithoutUserInput
    settings?: UserSettingCreateNestedOneWithoutUserInput
    taskTemplates?: TaskTemplateCreateNestedManyWithoutUserInput
    capabilities?: CapabilityCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutWeeklyPlansInput = {
    id?: string
    username: string
    passwordHash: string
    name?: string | null
    role?: $Enums.UserRole
    avatarUrl?: string | null
    phone?: string | null
    email?: string | null
    wechatOpenId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    children?: ChildUncheckedCreateNestedManyWithoutUserInput
    plans?: PlanUncheckedCreateNestedManyWithoutUserInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutUserInput
    settings?: UserSettingUncheckedCreateNestedOneWithoutUserInput
    taskTemplates?: TaskTemplateUncheckedCreateNestedManyWithoutUserInput
    capabilities?: CapabilityUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutWeeklyPlansInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutWeeklyPlansInput, UserUncheckedCreateWithoutWeeklyPlansInput>
  }

  export type ChildCreateWithoutWeeklyPlansInput = {
    id?: string
    name: string
    grade: number
    educationSystem?: string
    avatarColor?: string
    avatarUrl?: string | null
    targetSchool?: string | null
    currentSchool?: string | null
    birthday?: Date | string | null
    notes?: string | null
    routeId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutChildrenInput
    plans?: PlanCreateNestedManyWithoutChildInput
  }

  export type ChildUncheckedCreateWithoutWeeklyPlansInput = {
    id?: string
    userId: string
    name: string
    grade: number
    educationSystem?: string
    avatarColor?: string
    avatarUrl?: string | null
    targetSchool?: string | null
    currentSchool?: string | null
    birthday?: Date | string | null
    notes?: string | null
    routeId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    plans?: PlanUncheckedCreateNestedManyWithoutChildInput
  }

  export type ChildCreateOrConnectWithoutWeeklyPlansInput = {
    where: ChildWhereUniqueInput
    create: XOR<ChildCreateWithoutWeeklyPlansInput, ChildUncheckedCreateWithoutWeeklyPlansInput>
  }

  export type UserUpsertWithoutWeeklyPlansInput = {
    update: XOR<UserUpdateWithoutWeeklyPlansInput, UserUncheckedUpdateWithoutWeeklyPlansInput>
    create: XOR<UserCreateWithoutWeeklyPlansInput, UserUncheckedCreateWithoutWeeklyPlansInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutWeeklyPlansInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutWeeklyPlansInput, UserUncheckedUpdateWithoutWeeklyPlansInput>
  }

  export type UserUpdateWithoutWeeklyPlansInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    wechatOpenId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    children?: ChildUpdateManyWithoutUserNestedInput
    plans?: PlanUpdateManyWithoutUserNestedInput
    notifications?: NotificationUpdateManyWithoutUserNestedInput
    settings?: UserSettingUpdateOneWithoutUserNestedInput
    taskTemplates?: TaskTemplateUpdateManyWithoutUserNestedInput
    capabilities?: CapabilityUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutWeeklyPlansInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    wechatOpenId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    children?: ChildUncheckedUpdateManyWithoutUserNestedInput
    plans?: PlanUncheckedUpdateManyWithoutUserNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutUserNestedInput
    settings?: UserSettingUncheckedUpdateOneWithoutUserNestedInput
    taskTemplates?: TaskTemplateUncheckedUpdateManyWithoutUserNestedInput
    capabilities?: CapabilityUncheckedUpdateManyWithoutUserNestedInput
  }

  export type ChildUpsertWithoutWeeklyPlansInput = {
    update: XOR<ChildUpdateWithoutWeeklyPlansInput, ChildUncheckedUpdateWithoutWeeklyPlansInput>
    create: XOR<ChildCreateWithoutWeeklyPlansInput, ChildUncheckedCreateWithoutWeeklyPlansInput>
    where?: ChildWhereInput
  }

  export type ChildUpdateToOneWithWhereWithoutWeeklyPlansInput = {
    where?: ChildWhereInput
    data: XOR<ChildUpdateWithoutWeeklyPlansInput, ChildUncheckedUpdateWithoutWeeklyPlansInput>
  }

  export type ChildUpdateWithoutWeeklyPlansInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    grade?: IntFieldUpdateOperationsInput | number
    educationSystem?: StringFieldUpdateOperationsInput | string
    avatarColor?: StringFieldUpdateOperationsInput | string
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    targetSchool?: NullableStringFieldUpdateOperationsInput | string | null
    currentSchool?: NullableStringFieldUpdateOperationsInput | string | null
    birthday?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    routeId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutChildrenNestedInput
    plans?: PlanUpdateManyWithoutChildNestedInput
  }

  export type ChildUncheckedUpdateWithoutWeeklyPlansInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    grade?: IntFieldUpdateOperationsInput | number
    educationSystem?: StringFieldUpdateOperationsInput | string
    avatarColor?: StringFieldUpdateOperationsInput | string
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    targetSchool?: NullableStringFieldUpdateOperationsInput | string | null
    currentSchool?: NullableStringFieldUpdateOperationsInput | string | null
    birthday?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    routeId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    plans?: PlanUncheckedUpdateManyWithoutChildNestedInput
  }

  export type UserCreateWithoutNotificationsInput = {
    id?: string
    username: string
    passwordHash: string
    name?: string | null
    role?: $Enums.UserRole
    avatarUrl?: string | null
    phone?: string | null
    email?: string | null
    wechatOpenId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    children?: ChildCreateNestedManyWithoutUserInput
    plans?: PlanCreateNestedManyWithoutUserInput
    weeklyPlans?: WeeklyPlanCreateNestedManyWithoutUserInput
    settings?: UserSettingCreateNestedOneWithoutUserInput
    taskTemplates?: TaskTemplateCreateNestedManyWithoutUserInput
    capabilities?: CapabilityCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutNotificationsInput = {
    id?: string
    username: string
    passwordHash: string
    name?: string | null
    role?: $Enums.UserRole
    avatarUrl?: string | null
    phone?: string | null
    email?: string | null
    wechatOpenId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    children?: ChildUncheckedCreateNestedManyWithoutUserInput
    plans?: PlanUncheckedCreateNestedManyWithoutUserInput
    weeklyPlans?: WeeklyPlanUncheckedCreateNestedManyWithoutUserInput
    settings?: UserSettingUncheckedCreateNestedOneWithoutUserInput
    taskTemplates?: TaskTemplateUncheckedCreateNestedManyWithoutUserInput
    capabilities?: CapabilityUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutNotificationsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutNotificationsInput, UserUncheckedCreateWithoutNotificationsInput>
  }

  export type UserUpsertWithoutNotificationsInput = {
    update: XOR<UserUpdateWithoutNotificationsInput, UserUncheckedUpdateWithoutNotificationsInput>
    create: XOR<UserCreateWithoutNotificationsInput, UserUncheckedCreateWithoutNotificationsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutNotificationsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutNotificationsInput, UserUncheckedUpdateWithoutNotificationsInput>
  }

  export type UserUpdateWithoutNotificationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    wechatOpenId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    children?: ChildUpdateManyWithoutUserNestedInput
    plans?: PlanUpdateManyWithoutUserNestedInput
    weeklyPlans?: WeeklyPlanUpdateManyWithoutUserNestedInput
    settings?: UserSettingUpdateOneWithoutUserNestedInput
    taskTemplates?: TaskTemplateUpdateManyWithoutUserNestedInput
    capabilities?: CapabilityUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutNotificationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    wechatOpenId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    children?: ChildUncheckedUpdateManyWithoutUserNestedInput
    plans?: PlanUncheckedUpdateManyWithoutUserNestedInput
    weeklyPlans?: WeeklyPlanUncheckedUpdateManyWithoutUserNestedInput
    settings?: UserSettingUncheckedUpdateOneWithoutUserNestedInput
    taskTemplates?: TaskTemplateUncheckedUpdateManyWithoutUserNestedInput
    capabilities?: CapabilityUncheckedUpdateManyWithoutUserNestedInput
  }

  export type ChildCreateManyUserInput = {
    id?: string
    name: string
    grade: number
    educationSystem?: string
    avatarColor?: string
    avatarUrl?: string | null
    targetSchool?: string | null
    currentSchool?: string | null
    birthday?: Date | string | null
    notes?: string | null
    routeId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PlanCreateManyUserInput = {
    id?: string
    childId: string
    name: string
    type: string
    status?: string
    stage: string
    description?: string | null
    requirements?: NullableJsonNullValueInput | InputJsonValue
    milestones?: NullableJsonNullValueInput | InputJsonValue
    targets?: NullableJsonNullValueInput | InputJsonValue
    probability?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type WeeklyPlanCreateManyUserInput = {
    id?: string
    childId: string
    weekId: string
    tasks?: JsonNullValueInput | InputJsonValue
    publishedAt?: Date | string | null
    reviewedAt?: Date | string | null
    parentComment?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type NotificationCreateManyUserInput = {
    id?: string
    title: string
    content: string
    readAt?: Date | string | null
    createdAt?: Date | string
  }

  export type TaskTemplateCreateManyUserInput = {
    id?: string
    title: string
    category: $Enums.TaskCategory
    duration?: string
    difficulty?: string | null
    materials?: TaskTemplateCreatematerialsInput | string[]
    description?: string | null
    routeTags?: TaskTemplateCreaterouteTagsInput | string[]
    milestoneTag?: string | null
    semesterTag?: string | null
    tags?: TaskTemplateCreatetagsInput | string[]
    source?: $Enums.TaskTemplateSource
    isActive?: boolean
    archivedAt?: Date | string | null
    useCount?: number
    lastUsedAt?: Date | string | null
    taskType?: $Enums.TaskType
    frequency?: $Enums.TaskFrequency
    customFrequency?: NullableJsonNullValueInput | InputJsonValue
    weeklySchedule?: $Enums.TaskWeeklySchedule
    customScheduleDays?: TaskTemplateCreatecustomScheduleDaysInput | string[]
    assessmentCriteria?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CapabilityCreateManyUserInput = {
    id?: string
    name: string
    category: $Enums.CapabilityCategory
    description?: string | null
    isSystem?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ChildUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    grade?: IntFieldUpdateOperationsInput | number
    educationSystem?: StringFieldUpdateOperationsInput | string
    avatarColor?: StringFieldUpdateOperationsInput | string
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    targetSchool?: NullableStringFieldUpdateOperationsInput | string | null
    currentSchool?: NullableStringFieldUpdateOperationsInput | string | null
    birthday?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    routeId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    plans?: PlanUpdateManyWithoutChildNestedInput
    weeklyPlans?: WeeklyPlanUpdateManyWithoutChildNestedInput
  }

  export type ChildUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    grade?: IntFieldUpdateOperationsInput | number
    educationSystem?: StringFieldUpdateOperationsInput | string
    avatarColor?: StringFieldUpdateOperationsInput | string
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    targetSchool?: NullableStringFieldUpdateOperationsInput | string | null
    currentSchool?: NullableStringFieldUpdateOperationsInput | string | null
    birthday?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    routeId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    plans?: PlanUncheckedUpdateManyWithoutChildNestedInput
    weeklyPlans?: WeeklyPlanUncheckedUpdateManyWithoutChildNestedInput
  }

  export type ChildUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    grade?: IntFieldUpdateOperationsInput | number
    educationSystem?: StringFieldUpdateOperationsInput | string
    avatarColor?: StringFieldUpdateOperationsInput | string
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    targetSchool?: NullableStringFieldUpdateOperationsInput | string | null
    currentSchool?: NullableStringFieldUpdateOperationsInput | string | null
    birthday?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    routeId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PlanUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    stage?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    requirements?: NullableJsonNullValueInput | InputJsonValue
    milestones?: NullableJsonNullValueInput | InputJsonValue
    targets?: NullableJsonNullValueInput | InputJsonValue
    probability?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    child?: ChildUpdateOneRequiredWithoutPlansNestedInput
  }

  export type PlanUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    childId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    stage?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    requirements?: NullableJsonNullValueInput | InputJsonValue
    milestones?: NullableJsonNullValueInput | InputJsonValue
    targets?: NullableJsonNullValueInput | InputJsonValue
    probability?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PlanUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    childId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    stage?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    requirements?: NullableJsonNullValueInput | InputJsonValue
    milestones?: NullableJsonNullValueInput | InputJsonValue
    targets?: NullableJsonNullValueInput | InputJsonValue
    probability?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WeeklyPlanUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    weekId?: StringFieldUpdateOperationsInput | string
    tasks?: JsonNullValueInput | InputJsonValue
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    parentComment?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    child?: ChildUpdateOneRequiredWithoutWeeklyPlansNestedInput
  }

  export type WeeklyPlanUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    childId?: StringFieldUpdateOperationsInput | string
    weekId?: StringFieldUpdateOperationsInput | string
    tasks?: JsonNullValueInput | InputJsonValue
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    parentComment?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WeeklyPlanUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    childId?: StringFieldUpdateOperationsInput | string
    weekId?: StringFieldUpdateOperationsInput | string
    tasks?: JsonNullValueInput | InputJsonValue
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    parentComment?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    readAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    readAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    readAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TaskTemplateUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    category?: EnumTaskCategoryFieldUpdateOperationsInput | $Enums.TaskCategory
    duration?: StringFieldUpdateOperationsInput | string
    difficulty?: NullableStringFieldUpdateOperationsInput | string | null
    materials?: TaskTemplateUpdatematerialsInput | string[]
    description?: NullableStringFieldUpdateOperationsInput | string | null
    routeTags?: TaskTemplateUpdaterouteTagsInput | string[]
    milestoneTag?: NullableStringFieldUpdateOperationsInput | string | null
    semesterTag?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: TaskTemplateUpdatetagsInput | string[]
    source?: EnumTaskTemplateSourceFieldUpdateOperationsInput | $Enums.TaskTemplateSource
    isActive?: BoolFieldUpdateOperationsInput | boolean
    archivedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    useCount?: IntFieldUpdateOperationsInput | number
    lastUsedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    taskType?: EnumTaskTypeFieldUpdateOperationsInput | $Enums.TaskType
    frequency?: EnumTaskFrequencyFieldUpdateOperationsInput | $Enums.TaskFrequency
    customFrequency?: NullableJsonNullValueInput | InputJsonValue
    weeklySchedule?: EnumTaskWeeklyScheduleFieldUpdateOperationsInput | $Enums.TaskWeeklySchedule
    customScheduleDays?: TaskTemplateUpdatecustomScheduleDaysInput | string[]
    assessmentCriteria?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    capabilityLinks?: TaskCapabilityLinkUpdateManyWithoutTaskTemplateNestedInput
  }

  export type TaskTemplateUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    category?: EnumTaskCategoryFieldUpdateOperationsInput | $Enums.TaskCategory
    duration?: StringFieldUpdateOperationsInput | string
    difficulty?: NullableStringFieldUpdateOperationsInput | string | null
    materials?: TaskTemplateUpdatematerialsInput | string[]
    description?: NullableStringFieldUpdateOperationsInput | string | null
    routeTags?: TaskTemplateUpdaterouteTagsInput | string[]
    milestoneTag?: NullableStringFieldUpdateOperationsInput | string | null
    semesterTag?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: TaskTemplateUpdatetagsInput | string[]
    source?: EnumTaskTemplateSourceFieldUpdateOperationsInput | $Enums.TaskTemplateSource
    isActive?: BoolFieldUpdateOperationsInput | boolean
    archivedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    useCount?: IntFieldUpdateOperationsInput | number
    lastUsedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    taskType?: EnumTaskTypeFieldUpdateOperationsInput | $Enums.TaskType
    frequency?: EnumTaskFrequencyFieldUpdateOperationsInput | $Enums.TaskFrequency
    customFrequency?: NullableJsonNullValueInput | InputJsonValue
    weeklySchedule?: EnumTaskWeeklyScheduleFieldUpdateOperationsInput | $Enums.TaskWeeklySchedule
    customScheduleDays?: TaskTemplateUpdatecustomScheduleDaysInput | string[]
    assessmentCriteria?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    capabilityLinks?: TaskCapabilityLinkUncheckedUpdateManyWithoutTaskTemplateNestedInput
  }

  export type TaskTemplateUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    category?: EnumTaskCategoryFieldUpdateOperationsInput | $Enums.TaskCategory
    duration?: StringFieldUpdateOperationsInput | string
    difficulty?: NullableStringFieldUpdateOperationsInput | string | null
    materials?: TaskTemplateUpdatematerialsInput | string[]
    description?: NullableStringFieldUpdateOperationsInput | string | null
    routeTags?: TaskTemplateUpdaterouteTagsInput | string[]
    milestoneTag?: NullableStringFieldUpdateOperationsInput | string | null
    semesterTag?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: TaskTemplateUpdatetagsInput | string[]
    source?: EnumTaskTemplateSourceFieldUpdateOperationsInput | $Enums.TaskTemplateSource
    isActive?: BoolFieldUpdateOperationsInput | boolean
    archivedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    useCount?: IntFieldUpdateOperationsInput | number
    lastUsedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    taskType?: EnumTaskTypeFieldUpdateOperationsInput | $Enums.TaskType
    frequency?: EnumTaskFrequencyFieldUpdateOperationsInput | $Enums.TaskFrequency
    customFrequency?: NullableJsonNullValueInput | InputJsonValue
    weeklySchedule?: EnumTaskWeeklyScheduleFieldUpdateOperationsInput | $Enums.TaskWeeklySchedule
    customScheduleDays?: TaskTemplateUpdatecustomScheduleDaysInput | string[]
    assessmentCriteria?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CapabilityUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    category?: EnumCapabilityCategoryFieldUpdateOperationsInput | $Enums.CapabilityCategory
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isSystem?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    links?: TaskCapabilityLinkUpdateManyWithoutCapabilityNestedInput
  }

  export type CapabilityUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    category?: EnumCapabilityCategoryFieldUpdateOperationsInput | $Enums.CapabilityCategory
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isSystem?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    links?: TaskCapabilityLinkUncheckedUpdateManyWithoutCapabilityNestedInput
  }

  export type CapabilityUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    category?: EnumCapabilityCategoryFieldUpdateOperationsInput | $Enums.CapabilityCategory
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isSystem?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PlanCreateManyChildInput = {
    id?: string
    userId: string
    name: string
    type: string
    status?: string
    stage: string
    description?: string | null
    requirements?: NullableJsonNullValueInput | InputJsonValue
    milestones?: NullableJsonNullValueInput | InputJsonValue
    targets?: NullableJsonNullValueInput | InputJsonValue
    probability?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type WeeklyPlanCreateManyChildInput = {
    id?: string
    userId: string
    weekId: string
    tasks?: JsonNullValueInput | InputJsonValue
    publishedAt?: Date | string | null
    reviewedAt?: Date | string | null
    parentComment?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PlanUpdateWithoutChildInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    stage?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    requirements?: NullableJsonNullValueInput | InputJsonValue
    milestones?: NullableJsonNullValueInput | InputJsonValue
    targets?: NullableJsonNullValueInput | InputJsonValue
    probability?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutPlansNestedInput
  }

  export type PlanUncheckedUpdateWithoutChildInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    stage?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    requirements?: NullableJsonNullValueInput | InputJsonValue
    milestones?: NullableJsonNullValueInput | InputJsonValue
    targets?: NullableJsonNullValueInput | InputJsonValue
    probability?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PlanUncheckedUpdateManyWithoutChildInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    stage?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    requirements?: NullableJsonNullValueInput | InputJsonValue
    milestones?: NullableJsonNullValueInput | InputJsonValue
    targets?: NullableJsonNullValueInput | InputJsonValue
    probability?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WeeklyPlanUpdateWithoutChildInput = {
    id?: StringFieldUpdateOperationsInput | string
    weekId?: StringFieldUpdateOperationsInput | string
    tasks?: JsonNullValueInput | InputJsonValue
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    parentComment?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutWeeklyPlansNestedInput
  }

  export type WeeklyPlanUncheckedUpdateWithoutChildInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    weekId?: StringFieldUpdateOperationsInput | string
    tasks?: JsonNullValueInput | InputJsonValue
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    parentComment?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WeeklyPlanUncheckedUpdateManyWithoutChildInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    weekId?: StringFieldUpdateOperationsInput | string
    tasks?: JsonNullValueInput | InputJsonValue
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    parentComment?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TaskCapabilityLinkCreateManyTaskTemplateInput = {
    id?: string
    capabilityId: string
    weight?: number
    expectedProgress?: number
  }

  export type TaskCapabilityLinkUpdateWithoutTaskTemplateInput = {
    id?: StringFieldUpdateOperationsInput | string
    weight?: FloatFieldUpdateOperationsInput | number
    expectedProgress?: FloatFieldUpdateOperationsInput | number
    capability?: CapabilityUpdateOneRequiredWithoutLinksNestedInput
  }

  export type TaskCapabilityLinkUncheckedUpdateWithoutTaskTemplateInput = {
    id?: StringFieldUpdateOperationsInput | string
    capabilityId?: StringFieldUpdateOperationsInput | string
    weight?: FloatFieldUpdateOperationsInput | number
    expectedProgress?: FloatFieldUpdateOperationsInput | number
  }

  export type TaskCapabilityLinkUncheckedUpdateManyWithoutTaskTemplateInput = {
    id?: StringFieldUpdateOperationsInput | string
    capabilityId?: StringFieldUpdateOperationsInput | string
    weight?: FloatFieldUpdateOperationsInput | number
    expectedProgress?: FloatFieldUpdateOperationsInput | number
  }

  export type TaskCapabilityLinkCreateManyCapabilityInput = {
    id?: string
    taskTemplateId: string
    weight?: number
    expectedProgress?: number
  }

  export type TaskCapabilityLinkUpdateWithoutCapabilityInput = {
    id?: StringFieldUpdateOperationsInput | string
    weight?: FloatFieldUpdateOperationsInput | number
    expectedProgress?: FloatFieldUpdateOperationsInput | number
    taskTemplate?: TaskTemplateUpdateOneRequiredWithoutCapabilityLinksNestedInput
  }

  export type TaskCapabilityLinkUncheckedUpdateWithoutCapabilityInput = {
    id?: StringFieldUpdateOperationsInput | string
    taskTemplateId?: StringFieldUpdateOperationsInput | string
    weight?: FloatFieldUpdateOperationsInput | number
    expectedProgress?: FloatFieldUpdateOperationsInput | number
  }

  export type TaskCapabilityLinkUncheckedUpdateManyWithoutCapabilityInput = {
    id?: StringFieldUpdateOperationsInput | string
    taskTemplateId?: StringFieldUpdateOperationsInput | string
    weight?: FloatFieldUpdateOperationsInput | number
    expectedProgress?: FloatFieldUpdateOperationsInput | number
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use UserCountOutputTypeDefaultArgs instead
     */
    export type UserCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ChildCountOutputTypeDefaultArgs instead
     */
    export type ChildCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ChildCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use TaskTemplateCountOutputTypeDefaultArgs instead
     */
    export type TaskTemplateCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = TaskTemplateCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use CapabilityCountOutputTypeDefaultArgs instead
     */
    export type CapabilityCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = CapabilityCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use UserDefaultArgs instead
     */
    export type UserArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserDefaultArgs<ExtArgs>
    /**
     * @deprecated Use UserSettingDefaultArgs instead
     */
    export type UserSettingArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserSettingDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ChildDefaultArgs instead
     */
    export type ChildArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ChildDefaultArgs<ExtArgs>
    /**
     * @deprecated Use PlanDefaultArgs instead
     */
    export type PlanArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = PlanDefaultArgs<ExtArgs>
    /**
     * @deprecated Use TaskTemplateDefaultArgs instead
     */
    export type TaskTemplateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = TaskTemplateDefaultArgs<ExtArgs>
    /**
     * @deprecated Use CapabilityDefaultArgs instead
     */
    export type CapabilityArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = CapabilityDefaultArgs<ExtArgs>
    /**
     * @deprecated Use TaskCapabilityLinkDefaultArgs instead
     */
    export type TaskCapabilityLinkArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = TaskCapabilityLinkDefaultArgs<ExtArgs>
    /**
     * @deprecated Use WeeklyPlanDefaultArgs instead
     */
    export type WeeklyPlanArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = WeeklyPlanDefaultArgs<ExtArgs>
    /**
     * @deprecated Use NotificationDefaultArgs instead
     */
    export type NotificationArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = NotificationDefaultArgs<ExtArgs>

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}