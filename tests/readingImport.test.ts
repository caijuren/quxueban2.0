import assert from 'node:assert/strict';
import test from 'node:test';
import {
  normalizeHeader,
  parseDateValue,
  mapCsvRow,
  parseReadingCsv,
} from '../lib/readingImport';

test('normalizeHeader maps Chinese and English aliases', () => {
  assert.equal(normalizeHeader('书名'), 'title');
  assert.equal(normalizeHeader('Title'), 'title');
  assert.equal(normalizeHeader('阅读日期'), 'readDate');
  assert.equal(normalizeHeader('ISBN'), 'isbn');
  assert.equal(normalizeHeader('时长(分钟)'), 'durationMinutes');
  assert.equal(normalizeHeader('未知列'), null);
});

test('parseDateValue handles multiple formats', () => {
  assert.equal(parseDateValue('2026-08-15'), '2026-08-15');
  assert.equal(parseDateValue('2026/8/5'), '2026-08-05');
  assert.equal(parseDateValue('2026.08.15'), '2026-08-15');
  assert.equal(parseDateValue('2026年8月15日'), '2026-08-15');
  assert.equal(parseDateValue('20260815'), '2026-08-15');
  assert.equal(parseDateValue(''), '');
  assert.equal(parseDateValue('abc'), '');
});

test('mapCsvRow maps recognized columns', () => {
  const row = mapCsvRow({
    书名: '小王子',
    作者: '圣埃克苏佩里',
    ISBN: '978-7-000-00000-0',
    阅读日期: '2026/8/15',
    时长: '30',
    页数: '120',
    备注: '很喜欢',
  });
  assert.equal(row.title, '小王子');
  assert.equal(row.author, '圣埃克苏佩里');
  assert.equal(row.isbn, '978-7-000-00000-0');
  assert.equal(row.readDate, '2026-08-15');
  assert.equal(row.durationMinutes, 30);
  assert.equal(row.pages, 120);
  assert.equal(row.note, '很喜欢');
});

test('parseReadingCsv parses full CSV and skips empty titles', () => {
  const csv = `书名,作者,阅读日期,时长
小王子,圣埃克苏佩里,2026-08-15,30
夏洛的网,,2026-08-14,25
,无名,2026-08-13,10
`;
  const { rows } = parseReadingCsv(csv);
  assert.equal(rows.length, 2);
  assert.equal(rows[0].title, '小王子');
  assert.equal(rows[1].title, '夏洛的网');
});
