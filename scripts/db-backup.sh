#!/usr/bin/env bash
#
# 趣学伴数据库备份脚本
# ------------------------------------------------------------------
# 功能：
#   1. 通过 docker compose exec 在 db 容器内执行 pg_dump（数据库不暴露公网）
#   2. gzip 压缩，写入本地备份目录
#   3. 按保留天数清理过期备份
#   4. 可选：同步到腾讯云 COS 实现异地容灾（配置 COS_BUCKET 后启用）
#
# 用法：
#   ./scripts/db-backup.sh
#
# 建议通过 crontab 每日执行，例如：
#   0 3 * * * cd /opt/quxueban && ./scripts/db-backup.sh >> /var/log/quxueban-backup.log 2>&1
#
# 依赖：docker compose；如需异地同步需安装 coscli 并配置 COS_BUCKET / COS_PREFIX
# ------------------------------------------------------------------
set -euo pipefail

# ---- 可配置项（可用环境变量覆盖）----
BACKUP_DIR="${BACKUP_DIR:-/opt/quxueban/backups}"
RETENTION_DAYS="${RETENTION_DAYS:-14}"
DB_SERVICE="${DB_SERVICE:-db}"
DB_USER="${DB_USER:-quxueban}"
DB_NAME="${DB_NAME:-quxueban}"
COMPOSE_CMD="${COMPOSE_CMD:-docker compose}"
# COS 异地同步（留空则跳过）
COS_BUCKET="${COS_BUCKET:-}"
COS_PREFIX="${COS_PREFIX:-quxueban/db-backups}"

TIMESTAMP="$(date +%Y%m%d_%H%M%S)"
BACKUP_FILE="${BACKUP_DIR}/quxueban_${TIMESTAMP}.sql.gz"

log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*"
}

mkdir -p "${BACKUP_DIR}"

log "开始备份数据库 ${DB_NAME} -> ${BACKUP_FILE}"

# pg_dump 在容器内执行，通过管道压缩后写到宿主机
if ! ${COMPOSE_CMD} exec -T "${DB_SERVICE}" \
  pg_dump -U "${DB_USER}" -d "${DB_NAME}" --clean --if-exists \
  | gzip > "${BACKUP_FILE}"; then
  log "错误：pg_dump 失败，删除不完整的备份文件"
  rm -f "${BACKUP_FILE}"
  exit 1
fi

# 校验备份文件非空
if [ ! -s "${BACKUP_FILE}" ]; then
  log "错误：备份文件为空，删除并退出"
  rm -f "${BACKUP_FILE}"
  exit 1
fi

BACKUP_SIZE="$(du -h "${BACKUP_FILE}" | cut -f1)"
log "备份完成，大小 ${BACKUP_SIZE}"

# ---- 异地同步到腾讯云 COS ----
if [ -n "${COS_BUCKET}" ]; then
  if command -v coscli >/dev/null 2>&1; then
    log "同步到 COS：cos://${COS_BUCKET}/${COS_PREFIX}/"
    coscli cp "${BACKUP_FILE}" "cos://${COS_BUCKET}/${COS_PREFIX}/$(basename "${BACKUP_FILE}")"
    log "COS 同步完成"
  else
    log "警告：未检测到 coscli，跳过异地同步（安装：https://cloud.tencent.com/document/product/436/63144）"
  fi
else
  log "未配置 COS_BUCKET，跳过异地同步"
fi

# ---- 清理过期本地备份 ----
log "清理 ${RETENTION_DAYS} 天前的本地备份"
find "${BACKUP_DIR}" -name 'quxueban_*.sql.gz' -type f -mtime "+${RETENTION_DAYS}" -print -delete || true

log "全部完成"
