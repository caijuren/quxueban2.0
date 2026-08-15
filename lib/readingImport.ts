// 阅读档案 CSV 导入解析：列名归一化、日期解析、行映射
import Papa from 'papaparse';

export interface ParsedReadingRow {
  title: string;
  author: string;
  isbn: string;
  readDate: string;
  durationMinutes: number;
  pages: number | null;
  note: string;
}

const HEADER_ALIASES: Record<string, string[]> = {
  title: ['书名', '标题', '名称', 'title', '书名/标题'],
  author: ['作者', '作者/译者', 'author'],
  isbn: ['isbn', 'ISBN', '书号', '条形码'],
  readDate: ['阅读日期', '日期', '打卡日期', 'readdate', 'read_date', 'date'],
  durationMinutes: ['时长', '阅读时长', '分钟', 'duration', 'minutes', '时长(分钟)'],
  pages: ['页数', '页码', 'pages'],
  note: ['备注', '心得', '读后感', 'note', '评论'],
};

export function normalizeHeader(header: string): string | null {
  const h = header.trim().toLowerCase().replace(/\s+/g, '');
  for (const [key, aliases] of Object.entries(HEADER_ALIASES)) {
    if (aliases.some((a) => a.toLowerCase().replace(/\s+/g, '') === h)) return key;
  }
  return null;
}

export function parseDateValue(value: string): string {
  const v = value.trim();
  if (!v) return '';
  const m = v.match(/^(\d{4})[-/.年](\d{1,2})[-/.月](\d{1,2})日?$/);
  if (m) return `${m[1]}-${m[2].padStart(2, '0')}-${m[3].padStart(2, '0')}`;
  const compact = v.match(/^(\d{4})(\d{2})(\d{2})$/);
  if (compact) return `${compact[1]}-${compact[2]}-${compact[3]}`;
  return '';
}

export function mapCsvRow(raw: Record<string, string>): ParsedReadingRow {
  const row: ParsedReadingRow = {
    title: '',
    author: '',
    isbn: '',
    readDate: '',
    durationMinutes: 0,
    pages: null,
    note: '',
  };
  Object.entries(raw).forEach(([header, value]) => {
    const key = normalizeHeader(header);
    if (!key || value == null) return;
    const v = String(value).trim();
    if (key === 'title') row.title = v;
    else if (key === 'author') row.author = v;
    else if (key === 'isbn') row.isbn = v;
    else if (key === 'readDate') row.readDate = parseDateValue(v);
    else if (key === 'durationMinutes') row.durationMinutes = Number(v) || 0;
    else if (key === 'pages') row.pages = Number(v) || null;
    else if (key === 'note') row.note = v;
  });
  return row;
}

export function parseReadingCsv(
  text: string
): { rows: ParsedReadingRow[]; errors: string[] } {
  const errors: string[] = [];
  const result = Papa.parse<Record<string, string>>(text, {
    header: true,
    skipEmptyLines: 'greedy',
  }) as Papa.ParseResult<Record<string, string>>;
  if (result.errors.length > 0) {
    errors.push(...result.errors.map((e) => e.message));
  }
  const rows = (result.data ?? [])
    .map(mapCsvRow)
    .filter((r) => r.title);
  return { rows, errors };
}
