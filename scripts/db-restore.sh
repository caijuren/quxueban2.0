#!/usr/bin/env bash
#
# 趣学伴数据库恢复脚本（恢复演练 / 灾难恢复）
# ------------------------------------------------------------------
# 用法：
#   ./scripts/db-restore.sh /opt/quxueban/backups/quxueban_20260817_030000.sql.gz
#
# 警告：该操作会用备份内容覆盖当前数据库（pg_dump 使用了 --clean --if-exists）。
#       请务必在恢复前确认目标环境，并优先在测试库演练。
#
# 恢复演练建议（每季度一次）：
#   1. 准备一个临时数据库 quxueban_drill：
#        docker compose exec -T db createdb -U quxueban quxueban_drill
#   2. 将最新备份恢复到该临时库（设置 DB_NAME=quxueban_drill）：
#        DB_NAME=quxueban_drill ./scripts/db-restore.sh <最新备份文件>
#   3. 抽查关键表行数是否合理，确认无误后：
#        docker compose exec -T db dropdb -U quxueban quxueban_drill
#   4. 记录本次演练时间、备份文件名、恢复耗时、校验结果。
# ------------------------------------------------------------------
set -euo pipefail

BACKUP_FILE="${1:-}"
DB_SERVICE="${DB_SERVICE:-db}"
DB_USER="${DB_USER:-quxueban}"
DB_NAME="${DB_NAME:-quxueban}"
COMPOSE_CMD="${COMPOSE_CMD:-docker compose}"

log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*"
}

if [ -z "${BACKUP_FILE}" ]; then
  echo "用法：$0 <备份文件.sql.gz>"
  exit 1
fi

if [ ! -f "${BACKUP_FILE}" ]; then
  echo "错误：备份文件不存在：${BACKUP_FILE}"
  exit 1
fi

log "即将把 ${BACKUP_FILE} 恢复到数据库 ${DB_NAME}"
read -r -p "该操作会覆盖 ${DB_NAME} 的现有数据，确认继续？输入 yes 继续：" CONFIRM
if [ "${CONFIRM}" != "yes" ]; then
  log "已取消"
  exit 0
fi

log "开始恢复……"
gunzip -c "${BACKUP_FILE}" | ${COMPOSE_CMD} exec -T "${DB_SERVICE}" \
  psql -U "${DB_USER}" -d "${DB_NAME}"

log "恢复完成，请抽查关键表数据是否正确"
