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

test('parseReadingCsv tolerates rows with extra or missing fields', () => {
  const csv = `书名,作者,阅读日期
小王子,圣埃克苏佩里,2026-08-15
夏洛的网,怀特,2026-08-14,多余列,再多余
鲁滨逊漂流记,笛福
`;
  const { rows, errors } = parseReadingCsv(csv);
  assert.equal(rows.length, 3);
  assert.equal(rows[0].title, '小王子');
  assert.equal(rows[0].readDate, '2026-08-15');
  assert.equal(rows[1].title, '夏洛的网');
  assert.equal(rows[1].readDate, '2026-08-14');
  assert.equal(rows[2].title, '鲁滨逊漂流记');
  assert.equal(rows[2].author, '笛福');
  assert.equal(errors.length, 0);
});

test('parseReadingCsv handles 小花生 tab-separated export', () => {
  const tsv = `书名\tISBN\t作者\t出版社\t字数\t页数\t出版年份\t语言\t书架分类\t添加时间\t阅读人\t阅读人\t阅读次数\t最近一次阅读时间\t星级评价（1-5星）\t评价时间
国际大奖小说·爱藏本: 波普先生的企鹅\t9787530737774\t[美]阿特沃特 等 著；安聿麒 译\t新蕾出版社\t45000\t117\t2006-08\t中文\t\t2026-08-17\tCandy\t\t1\t2026-08-17\t\t
青鸟\t9787559736673\t莫里斯·梅特林克 著\t浙江少年儿童出版社\t185000\t285\t2024-03\t汉族\t\t2026-08-15\tCandy\t\t1\t2026-08-15\t\t
城南旧事\t9787539555119\t林海音 著\t中国少年儿童出版社\t\t239\t2016-01\t中文\t\t2026-08-13\t\tSummer\t1\t2026-08-13\t\t
`;
  const { rows, errors } = parseReadingCsv(tsv);
  assert.equal(rows.length, 3);
  assert.equal(rows[0].title, '国际大奖小说·爱藏本: 波普先生的企鹅');
  assert.equal(rows[0].isbn, '9787530737774');
  assert.equal(rows[0].author, '[美]阿特沃特 等 著；安聿麒 译');
  assert.equal(rows[0].pages, 117);
  assert.equal(rows[0].readDate, '2026-08-17');
  assert.equal(rows[1].title, '青鸟');
  assert.equal(rows[1].readDate, '2026-08-15');
  assert.equal(rows[2].title, '城南旧事');
  assert.equal(rows[2].readDate, '2026-08-13');
  assert.equal(errors.length, 0);
});
