-- 将分类列临时改为文本，以便安全转换旧枚举值
ALTER TABLE "TaskTemplate" ALTER COLUMN category TYPE text;

-- 将旧分类迁移到新的「能力训练」分类
UPDATE "TaskTemplate" SET category = 'ABILITY' WHERE category IN ('CHINESE', 'MATH', 'ENGLISH');

-- 移除年级范围字段
ALTER TABLE "TaskTemplate" DROP COLUMN "gradeMin";
ALTER TABLE "TaskTemplate" DROP COLUMN "gradeMax";

-- 替换 TaskCategory 枚举：移除 CHINESE/MATH/ENGLISH，保留 ABILITY
DROP TYPE "TaskCategory";
CREATE TYPE "TaskCategory" AS ENUM ('SCHOOL', 'READING', 'SPORT', 'INTEREST', 'ABILITY', 'OTHER');
ALTER TABLE "TaskTemplate" ALTER COLUMN category TYPE "TaskCategory" USING category::"TaskCategory";
