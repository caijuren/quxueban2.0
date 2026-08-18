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
  title: ['书名', '书名/作品', '标题', '名称', 'title', 'bookname', 'book', 'name'],
  author: ['作者', '作者/译者', '著者', '作家', 'author', 'writer'],
  isbn: ['isbn', 'ISBN', '书号', '条形码', 'isbn/issn'],
  readDate: [
    '阅读日期',
    '日期',
    '打卡日期',
    '完成日期',
    'readdate',
    'read_date',
    'date',
    '最近一次阅读时间',
    '最近阅读时间',
    '上次阅读时间',
    '阅读时间',
  ],
  durationMinutes: ['时长', '阅读时长', '分钟', 'duration', 'minutes', '时长(分钟)', '阅读分钟'],
  pages: ['页数', '页码', 'pages', '总页数'],
  note: ['备注', '心得', '读后感', 'note', '评论', '星级评价', '评分'],
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

function detectDelimiter(text: string): string {
  const firstLine = text.split(/\r?\n/)[0] ?? '';
  if (!firstLine) return ',';
  // Count candidate delimiters outside of quotes
  const counts: { delimiter: string; count: number }[] = [
    { delimiter: '\t', count: 0 },
    { delimiter: ',', count: 0 },
    { delimiter: ';', count: 0 },
  ];
  let inQuotes = false;
  for (const ch of firstLine) {
    if (ch === '"') {
      inQuotes = !inQuotes;
    } else if (!inQuotes) {
      const found = counts.find((c) => c.delimiter === ch);
      if (found) found.count++;
    }
  }
  const winner = counts.reduce((a, b) => (a.count >= b.count ? a : b));
  return winner.count > 0 ? winner.delimiter : ',';
}

function parseByArrays(text: string, delimiter: string): { rows: ParsedReadingRow[]; errors: string[]; headers: string[] } {
  const errors: string[] = [];
  const result = Papa.parse<string[]>(text, {
    header: false,
    delimiter,
    skipEmptyLines: 'greedy',
  }) as Papa.ParseResult<string[]>;

  if (result.errors.length > 0) {
    errors.push(...result.errors.map((e) => e.message));
  }

  const arrays = result.data ?? [];
  const headerIndex = arrays.findIndex((row) => row.some((cell) => cell.trim()));
  if (headerIndex === -1) {
    return { rows: [], errors: ['未找到表头行'], headers: [] };
  }

  const headers = arrays[headerIndex].map((h) => h.trim());
  const normalizedKeys = headers.map((h) => normalizeHeader(h));

  const rows: ParsedReadingRow[] = [];
  for (let i = headerIndex + 1; i < arrays.length; i++) {
    const cells = arrays[i];
    // Tolerate rows with more or fewer fields than the header
    const padded = cells.length < headers.length
      ? [...cells, ...Array(headers.length - cells.length).fill('')]
      : cells.slice(0, headers.length);

    const raw: Record<string, string> = {};
    padded.forEach((value, idx) => {
      // Keep original header so mapCsvRow can match aliases
      raw[headers[idx] ?? `col${idx}`] = value ?? '';
    });

    const mapped = mapCsvRow(raw);
    if (mapped.title) rows.push(mapped);
  }

  return { rows, errors, headers };
}

function stripBom(text: string): string {
  return text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;
}

export function parseReadingCsv(
  text: string
): { rows: ParsedReadingRow[]; errors: string[]; headers: string[] } {
  const cleanText = stripBom(text);
  const delimiter = detectDelimiter(cleanText);

  // Try header-based parsing first; fall back to array-based if structural errors occur
  const headerResult = Papa.parse<Record<string, string>>(cleanText, {
    header: true,
    delimiter,
    skipEmptyLines: 'greedy',
    transformHeader: (header) => header.trim(),
  }) as Papa.ParseResult<Record<string, string>>;

  const hasStructuralErrors = headerResult.errors.some(
    (e) => e.type === 'FieldMismatch'
  );

  if (!hasStructuralErrors) {
    const rows = (headerResult.data ?? [])
      .map(mapCsvRow)
      .filter((r) => r.title);
    const errors = headerResult.errors.map((e) => e.message);
    const headers = headerResult.meta.fields ?? [];
    return { rows, errors, headers };
  }

  return parseByArrays(cleanText, delimiter);
}
