-- 为任务模板增加孩子维度，实现不同孩子任务库完全隔离

BEGIN;

-- 1. 添加 childId 列（先允许为空，兼容旧数据）
ALTER TABLE "TaskTemplate" ADD COLUMN "childId" TEXT;

-- 2. 建立外键（删除孩子时级联删除其任务模板）
ALTER TABLE "TaskTemplate"
  ADD CONSTRAINT "TaskTemplate_childId_fkey"
  FOREIGN KEY ("childId") REFERENCES "Child"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- 3. 索引
CREATE INDEX "TaskTemplate_childId_idx" ON "TaskTemplate"("childId");

-- 4. 数据迁移：把当前「按用户共享」的任务模板复制一份给该用户的每一个孩子
--    复制后删除原共享记录，保证后续所有任务模板都有明确的 childId
CREATE TEMP TABLE _tpl_child_map AS
SELECT
  t.id AS old_id,
  gen_random_uuid()::text AS new_id,
  c.id AS child_id
FROM "TaskTemplate" t
JOIN "Child" c ON c."userId" = t."userId"
WHERE t."childId" IS NULL;

INSERT INTO "TaskTemplate" (
  "id", "userId", "childId", "title", "category", "duration", "difficulty",
  "materials", "description", "routeTags", "milestoneTag", "semesterTag",
  "tags", "source", "isActive", "archivedAt", "useCount", "lastUsedAt",
  "taskType", "frequency", "customFrequency", "weeklySchedule", "customScheduleDays",
  "assessmentCriteria", "createdAt", "updatedAt"
)
SELECT
  m.new_id,
  t."userId",
  m.child_id,
  t."title",
  t."category",
  t."duration",
  t."difficulty",
  t."materials",
  t."description",
  t."routeTags",
  t."milestoneTag",
  t."semesterTag",
  t."tags",
  t."source",
  t."isActive",
  t."archivedAt",
  t."useCount",
  t."lastUsedAt",
  t."taskType",
  t."frequency",
  t."customFrequency",
  t."weeklySchedule",
  t."customScheduleDays",
  t."assessmentCriteria",
  t."createdAt",
  t."updatedAt"
FROM "TaskTemplate" t
JOIN _tpl_child_map m ON m.old_id = t.id;

-- 复制能力关联
INSERT INTO "TaskCapabilityLink" (
  "id", "taskTemplateId", "capabilityId", "weight", "expectedProgress"
)
SELECT
  gen_random_uuid()::text,
  m.new_id,
  l."capabilityId",
  l."weight",
  l."expectedProgress"
FROM "TaskCapabilityLink" l
JOIN _tpl_child_map m ON m.old_id = l."taskTemplateId";

-- 删除已经被复制的原共享记录
DELETE FROM "TaskTemplate" WHERE "id" IN (SELECT old_id FROM _tpl_child_map);

DROP TABLE _tpl_child_map;

COMMIT;
