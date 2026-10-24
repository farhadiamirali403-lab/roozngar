/* آزمون‌های هسته: تقویم جلالی، افزودن سریع، تکرار و عادت‌ها — اجرا با `npm test` */
'use strict';
global.localStorage = { getItem: () => null, setItem() {} };
const assert = require('assert');
const C = require('../www/core.js');
let n = 0;
const test = (name, fn) => { fn(); n++; console.log('✓ ' + name); };

test('تبدیل میلادی به جلالی', () => {
  assert.deepStrictEqual(C.jOf('2025-03-21'), { jy: 1404, jm: 1, jd: 1 });
  assert.deepStrictEqual(C.jOf('2026-10-24'), { jy: 1405, jm: 8, jd: 2 });
  assert.strictEqual(C.keyFromJ(1403, 12, 30), '2025-03-20');
});
test('سال کبیسه و طول ماه', () => {
  assert.strictEqual(C.jLeap(1403), true);
  assert.strictEqual(C.jMonthLen(1404, 12), 29);
  assert.strictEqual(C.jMonthLen(1403, 12), 30);
});
test('روز هفته (۰ = شنبه)', () => { assert.strictEqual(C.wdOf('2026-10-24'), 0); });
test('افزودن سریع: تاریخ، ساعت، اولویت، برچسب و تخمین', () => {
  const t = C.todayKey();
  const r = C.parseQuick('خرید نان فردا ساعت ۶ عصر !فوری @خرید ~30');
  assert.strictEqual(r.title, 'خرید نان');
  assert.strictEqual(r.due, C.addDays(t, 1));
  assert.strictEqual(r.time, '18:00');
  assert.strictEqual(r.priority, 4);
  assert.deepStrictEqual(r.tags, ['خرید']);
  assert.strictEqual(r.estimate, 30);
});
test('افزودن سریع: تکرار روزانه تاریخ امروز می‌گیرد', () => {
  const r = C.parseQuick('ورزش هر روز');
  assert.strictEqual(r.recur, 'daily');
  assert.strictEqual(r.due, C.todayKey());
});
test('تکرار ماهانه در ماه کوتاه‌تر روز را محدود می‌کند', () => {
  assert.strictEqual(C.stepRecur(C.keyFromJ(1404, 6, 31), 'monthly'), C.keyFromJ(1404, 7, 30));
});
test('سطح بر اساس امتیاز', () => {
  assert.strictEqual(C.levelOf(0).L, 1);
  assert.strictEqual(C.levelOf(100).L, 2);
});
test('پیوستگی عادت روزهای برنامه‌ریزی‌نشده را رد می‌کند', () => {
  const t = C.todayKey();
  const h = { id: 'h1', name: 'x', days: [], createdAt: Date.now() - 30 * 864e5 };
  C.S.habits = [h];
  C.S.habitLog = {};
  for (let i = 0; i < 5; i++) C.setHabit(h, C.addDays(t, -i), true);
  assert.strictEqual(C.habitStreak(h).cur, 5);
  C.setHabit(h, t, false);
  assert.strictEqual(C.habitStreak(h).cur, 4, 'امروزِ انجام‌نشده زنجیره را نمی‌شکند');
  C.setHabit(h, C.addDays(t, -2), false);
  assert.strictEqual(C.habitStreak(h).cur, 1);
});
test('تعطیلات رسمی', () => {
  assert.strictEqual(C.holidayOf(C.keyFromJ(1405, 1, 1)), 'نوروز');
  assert.strictEqual(C.holidayOf(C.keyFromJ(1405, 2, 5)), null);
});
test('داده نمونه ساخته می‌شود', () => {
  const d = C.buildSample();
  assert.ok(d.tasks.length > 300 && d.habits.length === 4 && Object.keys(d.habitLog).length > 10);
});
console.log(`\n${n} آزمون با موفقیت اجرا شد.`);
