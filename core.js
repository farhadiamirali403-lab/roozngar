'use strict';
/* روزنگار · هسته: تقویم شمسی، قالب‌بندی، داده‌ها، ذخیره‌سازی و منطق کارها */

/* ---------- اعداد و قالب‌بندی ---------- */
const FA_D = '۰۱۲۳۴۵۶۷۸۹';
const fa = x => String(x).replace(/[0-9]/g, d => FA_D[d]);
const toEn = s => String(s).replace(/[۰-۹]/g, d => FA_D.indexOf(d)).replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d));
const faNum = (n, dec = 0) => fa(Number(n).toLocaleString('en-US', { maximumFractionDigits: dec })).replace(/,/g, '٬').replace(/\./g, '٫');
const faPct = n => faNum(Math.round(n)) + '٪';
const clone = o => JSON.parse(JSON.stringify(o));
const pad = n => String(n).padStart(2, '0');
const uid = p => p + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
const normFa = s => String(s).replace(/ي/g, 'ی').replace(/ك/g, 'ک').toLowerCase();
const inc = (m, k, n = 1) => m.set(k, (m.get(k) || 0) + n);
const median = a => { if (!a.length) return 0; const s = a.slice().sort((x, y) => x - y), h = s.length >> 1; return s.length % 2 ? s[h] : (s[h - 1] + s[h]) / 2; };

/* ---------- تقویم جلالی (الگوریتم jalaali) ---------- */
const J_BREAKS = [-61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181, 1210, 1635, 2060, 2097, 2192, 2262, 2324, 2394, 2456, 3178];
const idiv = (a, b) => ~~(a / b);
const imod = (a, b) => a - ~~(a / b) * b;
function jalCal(jy, withoutLeap) {
  const gy = jy + 621;
  let leapJ = -14, jp = J_BREAKS[0], jump = 0, n;
  for (let i = 1; i < J_BREAKS.length; i++) {
    const jm = J_BREAKS[i];
    jump = jm - jp;
    if (jy < jm) break;
    leapJ += idiv(jump, 33) * 8 + idiv(imod(jump, 33), 4);
    jp = jm;
  }
  n = jy - jp;
  leapJ += idiv(n, 33) * 8 + idiv(imod(n, 33) + 3, 4);
  if (imod(jump, 33) === 4 && jump - n === 4) leapJ += 1;
  const leapG = idiv(gy, 4) - idiv((idiv(gy, 100) + 1) * 3, 4) - 150;
  const march = 20 + leapJ - leapG;
  if (withoutLeap) return { gy, march };
  if (jump - n < 6) n = n - jump + idiv(jump + 4, 33) * 33;
  let leap = imod(imod(n + 1, 33) - 1, 4);
  if (leap === -1) leap = 4;
  return { leap, gy, march };
}
function g2d(gy, gm, gd) {
  let d = idiv((gy + idiv(gm - 8, 6) + 100100) * 1461, 4) + idiv(153 * imod(gm + 9, 12) + 2, 5) + gd - 34840408;
  return d - idiv(idiv(gy + 100100 + idiv(gm - 8, 6), 100) * 3, 4) + 752;
}
function d2g(jdn) {
  let j = 4 * jdn + 139361631;
  j = j + idiv(idiv(4 * jdn + 183187720, 146097) * 3, 4) * 4 - 3908;
  const i = idiv(imod(j, 1461), 4) * 5 + 308;
  const gd = idiv(imod(i, 153), 5) + 1;
  const gm = imod(idiv(i, 153), 12) + 1;
  return { gy: idiv(j, 1461) - 100100 + idiv(8 - gm, 6), gm, gd };
}
function j2d(jy, jm, jd) {
  const r = jalCal(jy, true);
  return g2d(r.gy, 3, r.march) + (jm - 1) * 31 - idiv(jm, 7) * (jm - 7) + jd - 1;
}
function d2j(jdn) {
  const gy = d2g(jdn).gy;
  let jy = gy - 621;
  const r = jalCal(jy, false);
  let k = jdn - g2d(gy, 3, r.march);
  if (k >= 0) {
    if (k <= 185) return { jy, jm: 1 + idiv(k, 31), jd: imod(k, 31) + 1 };
    k -= 186;
  } else {
    jy -= 1;
    k += 179;
    if (r.leap === 1) k += 1;
  }
  return { jy, jm: 7 + idiv(k, 30), jd: imod(k, 30) + 1 };
}

const J_MONTHS = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];
const WEEKDAYS = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه'];
const WD_SHORT = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];
const G_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/* کلید روز: «YYYY-MM-DD» میلادی به وقت محلی؛ محاسبه با ظهر برای دوری از مرز روز */
const keyOf = d => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
const dateOf = k => { const [y, m, d] = k.split('-').map(Number); return new Date(y, m - 1, d, 12); };
const todayKey = () => keyOf(new Date());
const msKey = ms => keyOf(new Date(ms));
const msHour = ms => new Date(ms).getHours();
function addDays(k, n) { const d = dateOf(k); d.setDate(d.getDate() + n); return keyOf(d); }
const diffDays = (a, b) => Math.round((dateOf(b) - dateOf(a)) / 864e5);
const wdOf = k => (dateOf(k).getDay() + 1) % 7; // ۰ = شنبه
function jOf(k) { const [y, m, d] = k.split('-').map(Number); return d2j(g2d(y, m, d)); }
function keyFromJ(jy, jm, jd) { const g = d2g(j2d(jy, jm, jd)); return g.gy + '-' + pad(g.gm) + '-' + pad(g.gd); }
const jLeap = jy => jalCal(jy).leap === 0;
const jMonthLen = (jy, jm) => jm <= 6 ? 31 : jm <= 11 ? 30 : (jLeap(jy) ? 30 : 29);

function fmtDate(k, o = {}) {
  const j = jOf(k);
  const s = fa(j.jd) + ' ' + J_MONTHS[j.jm - 1] + (o.year === false ? '' : ' ' + fa(j.jy));
  return o.weekday ? WEEKDAYS[wdOf(k)] + '، ' + s : s;
}
function relDate(k) {
  const t = todayKey(), n = diffDays(t, k);
  if (n === 0) return 'امروز';
  if (n === 1) return 'فردا';
  if (n === -1) return 'دیروز';
  if (n === 2) return 'پس‌فردا';
  if (n > 2 && n < 7) return WEEKDAYS[wdOf(k)];
  return fmtDate(k, { year: jOf(k).jy !== jOf(t).jy });
}
const fmtClock = ms => { const d = new Date(ms); return fa(pad(d.getHours()) + ':' + pad(d.getMinutes())); };
function fmtMin(m) {
  m = Math.round(m || 0);
  if (m < 60) return faNum(m) + ' دقیقه';
  const h = Math.floor(m / 60), r = m % 60;
  return faNum(h) + ' ساعت' + (r ? ' و ' + faNum(r) + ' دقیقه' : '');
}
const fmtHours = m => m >= 60 ? faNum(m / 60, 1) + ' ساعت' : faNum(Math.round(m)) + ' دقیقه';

/* ---------- داده‌ها ---------- */
const DEFAULT_SETTINGS = {
  name: '', dailyGoal: 5, theme: 'auto', accent: 'green', fontScale: 'm', sound: true, haptics: true, welcomed: false,
  notify: false, remindBefore: 10, dailyReminder: '', ambient: 'off', autoNext: false,
  pomo: { work: 25, short: 5, long: 15, every: 4 },
};
const ACCENTS = { green: 'سبز', blue: 'آبی', violet: 'بنفش', rose: 'سرخابی', orange: 'نارنجی', teal: 'فیروزه‌ای' };
const taskDefaults = () => ({ title: '', notes: '', projectId: null, tags: [], priority: 0, status: 'todo', due: null, time: null, recur: null, estimate: 0, focus: 0, subtasks: [], createdAt: Date.now(), completedAt: null, order: Date.now() });
const normTask = t => Object.assign(taskDefaults(), t);
const S = { tasks: new Map(), projects: [], settings: clone(DEFAULT_SETTINGS), focusLog: {}, focusSample: {}, habits: [], habitLog: {}, journal: {} };

const PRI = [
  { name: 'بدون اولویت', short: 'بدون', xp: 5 },
  { name: 'اولویت کم', short: 'کم', xp: 5 },
  { name: 'اولویت متوسط', short: 'متوسط', xp: 10 },
  { name: 'اولویت بالا', short: 'بالا', xp: 15 },
  { name: 'فوری', short: 'فوری', xp: 25 },
];
const STATUS = { todo: 'برای انجام', doing: 'در حال انجام', done: 'انجام شد' };
const RECUR = { daily: 'هر روز', weekdays: 'روزهای کاری (شنبه تا چهارشنبه)', weekly: 'هر هفته', monthly: 'هر ماه' };
const LEVELS = ['تازه‌کار', 'کوشا', 'پیگیر', 'منظم', 'پرتلاش', 'هدفمند', 'حرفه‌ای', 'استاد زمان', 'قهرمان', 'افسانه'];

const proj = id => S.projects.find(p => p.id === id) || null;
const allTasks = () => [...S.tasks.values()];
const isOpen = t => t.status !== 'done';
const focusOn = k => (S.focusLog[k] || 0) + (S.focusSample[k] || 0);
const bucketOf = t => { const d = new Date(t.createdAt); return 'b-' + d.getFullYear() + '-' + pad(d.getMonth() + 1); };
function bucketBody(b) {
  const tasks = {};
  let n = 0;
  for (const t of S.tasks.values()) if (bucketOf(t) === b) { tasks[t.id] = t; n++; }
  return n ? { v: 1, tasks } : null;
}
const metaBody = () => ({ v: 1, projects: S.projects, settings: S.settings, focusLog: S.focusLog, focusSample: S.focusSample, habits: S.habits, habitLog: S.habitLog, journal: S.journal });

/* ---------- ذخیره‌سازی: ابری (db هر کاربر) با پشتیبان محلی ---------- */
const LS_KEY = 'roozngar:v1';
const Store = {
  mode: 'local', status: 'local', col: null, unsub: null, gotFirst: false, resubbed: false,
  dirty: new Set(), queued: new Set(), inflight: new Set(), metaDirty: false,
  chains: {}, flushT: 0, lsT: 0, retried: {},
  onChange() {}, onStatus() {}, onError() {},

  setStatus(s) { this.status = s; this.onStatus(s); },
  serialize() { return Object.assign({ tasks: allTasks() }, metaBody()); },
  hydrateMeta(m) {
    S.projects = Array.isArray(m.projects) ? m.projects : [];
    S.settings = Object.assign(clone(DEFAULT_SETTINGS), m.settings || {});
    S.settings.pomo = Object.assign(clone(DEFAULT_SETTINGS.pomo), (m.settings && m.settings.pomo) || {});
    if (!['light', 'dark', 'auto'].includes(S.settings.theme)) S.settings.theme = 'auto';
    if (!ACCENTS[S.settings.accent]) S.settings.accent = 'green';
    S.focusLog = m.focusLog || {};
    S.focusSample = m.focusSample || {};
    S.habits = Array.isArray(m.habits) ? m.habits : [];
    S.habitLog = m.habitLog || {};
    S.journal = m.journal || {};
  },
  hydrateAll(d) {
    S.tasks = new Map((d.tasks || []).filter(t => t && t.id).map(t => [t.id, normTask(t)]));
    this.hydrateMeta(d);
  },
  loadLocal() {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return false;
      this.hydrateAll(JSON.parse(raw));
      return true;
    } catch (e) { return false; }
  },
  saveLocal() { try { localStorage.setItem(LS_KEY, JSON.stringify(this.serialize())); } catch (e) { /* حافظه مرورگر در دسترس نیست */ } },
  saveLocalSoon() { clearTimeout(this.lsT); this.lsT = setTimeout(() => this.saveLocal(), 250); },

  touchTask(t) { S.tasks.set(t.id, t); this.dirty.add(bucketOf(t)); this.schedule(); },
  dropTask(t) { S.tasks.delete(t.id); this.dirty.add(bucketOf(t)); this.schedule(); },
  touchMeta() { this.metaDirty = true; this.schedule(); },
  touchAll() { for (const t of S.tasks.values()) this.dirty.add(bucketOf(t)); this.metaDirty = true; this.schedule(); },
  schedule() {
    this.saveLocalSoon();
    if (this.mode !== 'cloud') return;
    clearTimeout(this.flushT);
    this.flushT = setTimeout(() => this.flush(), 450);
  },
  isProtected(id) { return this.dirty.has(id) || this.queued.has(id) || this.inflight.has(id); },
  flush() {
    if (this.mode !== 'cloud' || !this.gotFirst) return;
    for (const b of [...this.dirty]) this.write(b);
    if (this.metaDirty) this.write('meta');
  },
  /* برای هر سند فقط یک نوشتن در جریان است؛ بدنه هنگام شروع نوشتن از آخرین وضعیت ساخته می‌شود */
  write(id) {
    if (id === 'meta') this.metaDirty = false; else this.dirty.delete(id);
    if (this.queued.has(id)) return;
    this.queued.add(id);
    this.chains[id] = (this.chains[id] || Promise.resolve()).then(() => this.doWrite(id));
  },
  async doWrite(id) {
    this.queued.delete(id);
    if (this.mode !== 'cloud') return;
    this.inflight.add(id);
    try {
      const ref = this.col.doc(id);
      if (id === 'meta') await ref.set(metaBody());
      else {
        const body = bucketBody(id);
        if (body) await ref.set(body); else await ref.delete();
      }
      this.retried[id] = 0;
    } catch (e) {
      this.writeFailed(e, id);
    } finally {
      this.inflight.delete(id);
    }
  },
  writeFailed(e, id) {
    const code = (e && e.code) || 'unavailable';
    if (code === 'unavailable' || code === 'resource_exhausted') {
      if ((this.retried[id] || 0) < 2) {
        this.retried[id] = (this.retried[id] || 0) + 1;
        if (id === 'meta') this.metaDirty = true; else this.dirty.add(id);
        setTimeout(() => this.flush(), 1500 + Math.random() * 1500);
      } else this.onError('همگام‌سازی ابری فعلاً ممکن نشد. تغییرات در همین مرورگر نگه داشته شد.');
      return;
    }
    if (code === 'quota_exceeded') { this.onError('فضای ذخیره‌سازی ابری پر است. داده‌های نمونه یا کارهای قدیمی را حذف کنید.'); return; }
    this.goLocal('ذخیره ابری برای این حساب فعال نیست؛ داده‌ها فقط در همین مرورگر ذخیره می‌شوند.');
  },
  goLocal(msg) {
    if (this.unsub) { try { this.unsub(); } catch (e) { /* */ } this.unsub = null; }
    this.mode = 'local';
    this.setStatus('local');
    this.saveLocal();
    if (msg) this.onError(msg);
  },
  async connect() {
    const c = typeof window !== 'undefined' ? window.claude : null;
    if (!c || typeof c.use !== 'function') { this.setStatus('local'); return; }
    this.setStatus('connecting');
    try {
      const [db, user] = await Promise.all([c.use('db'), c.use('user')]);
      const id = db && user ? await user.id() : null;
      if (!id) { this.setStatus('local'); return; }
      this.col = db.collection('data/users/' + id);
      this.mode = 'cloud';
      this.subscribe();
    } catch (e) {
      this.mode = 'local';
      this.setStatus('local');
    }
  },
  subscribe() {
    this.unsub = this.col.onSnapshot(s => this.apply(s), e => {
      this.unsub = null;
      if (e && e.code === 'unavailable' && !this.resubbed) { this.resubbed = true; setTimeout(() => this.subscribe(), 2000); }
      else this.goLocal('اتصال به فضای ابری قطع شد؛ تغییرات در همین مرورگر ذخیره می‌شوند.');
    });
  },
  apply(snap) {
    const first = !this.gotFirst;
    this.gotFirst = true;
    if (first) this.setStatus('cloud');
    if (first && snap.empty) {
      if (S.tasks.size || S.projects.length) this.touchAll();
      this.flush();
      return;
    }
    const tasks = new Map();
    let meta = null;
    for (const d of snap.docs) {
      const data = d.data();
      if (!data) continue;
      if (d.id === 'meta') meta = data;
      else if (d.id.startsWith('b-') && !this.isProtected(d.id)) {
        for (const t of Object.values(data.tasks || {})) if (t && t.id) tasks.set(t.id, normTask(clone(t)));
      }
    }
    for (const t of S.tasks.values()) if (this.isProtected(bucketOf(t))) tasks.set(t.id, t);
    const keepMeta = this.metaDirty || this.queued.has('meta') || this.inflight.has('meta');
    const sig = m => JSON.stringify([...m.values()].sort((a, b) => (a.id < b.id ? -1 : 1)));
    const changedTasks = sig(tasks) !== sig(S.tasks);
    const changedMeta = meta && !keepMeta && JSON.stringify(meta) !== JSON.stringify(metaBody());
    if (changedTasks) S.tasks = tasks;
    if (changedMeta) this.hydrateMeta(clone(meta));
    if (first) this.flush();
    if (changedTasks || changedMeta) { this.saveLocalSoon(); this.onChange(); }
  },
};

/* ---------- منطق کارها ---------- */
function newTask(f) {
  const t = Object.assign(taskDefaults(), { id: uid('t'), createdAt: Date.now(), order: Date.now() }, f);
  Store.touchTask(t);
  return t;
}
function stepRecur(k, r) {
  if (r === 'daily') return addDays(k, 1);
  if (r === 'weekly') return addDays(k, 7);
  if (r === 'weekdays') { let n = addDays(k, 1); while (wdOf(n) > 4) n = addDays(n, 1); return n; }
  if (r === 'monthly') {
    const j = jOf(k);
    let jy = j.jy, jm = j.jm + 1;
    if (jm > 12) { jm = 1; jy++; }
    return keyFromJ(jy, jm, Math.min(j.jd, jMonthLen(jy, jm)));
  }
  return null;
}
function nextOccurrence(due, r) {
  const t = todayKey();
  let n = stepRecur(due || t, r);
  while (n <= t) n = stepRecur(n, r);
  return n;
}
function setStatus(t, status) {
  if (status === 'done' && t.status !== 'done') {
    t.status = 'done';
    t.completedAt = Date.now();
    if (t.recur && !t.spawned) {
      const n = newTask({
        title: t.title, notes: t.notes, projectId: t.projectId, tags: [...t.tags], priority: t.priority, time: t.time,
        recur: t.recur, estimate: t.estimate, due: nextOccurrence(t.due, t.recur),
        subtasks: t.subtasks.map(s => ({ id: uid('s'), title: s.title, done: false })),
      });
      t.spawned = n.id;
    }
  } else if (status !== 'done' && t.status === 'done') {
    t.completedAt = null;
    if (t.spawned) {
      const n = S.tasks.get(t.spawned);
      if (n && n.status !== 'done') Store.dropTask(n);
      t.spawned = null;
    }
    t.status = status;
  } else t.status = status;
  Store.touchTask(t);
}

function taskXP(t) {
  let x = PRI[t.priority].xp + (t.subtasks || []).filter(s => s.done).length * 2;
  if (t.due && t.completedAt && msKey(t.completedAt) <= t.due) x += 5;
  return x;
}
function totalXP() {
  let x = 0;
  for (const t of S.tasks.values()) if (t.status === 'done') x += taskXP(t);
  for (const k in S.habitLog) x += (S.habitLog[k] || []).length * 3;
  return x;
}
function levelOf(xp) {
  let L = 1;
  while (50 * L * (L + 1) <= xp) L++;
  const base = 50 * (L - 1) * L, next = 50 * L * (L + 1);
  return { L, title: LEVELS[Math.min(LEVELS.length - 1, Math.floor((L - 1) / 2))], cur: xp - base, need: next - base };
}
function doneByDay() {
  const m = new Map();
  for (const t of S.tasks.values()) if (t.status === 'done' && t.completedAt) inc(m, msKey(t.completedAt));
  return m;
}
function streakInfo(counts) {
  const t = todayKey();
  let cur = 0, k = counts.get(t) ? t : addDays(t, -1);
  while (counts.get(k)) { cur++; k = addDays(k, -1); }
  const keys = [...counts.keys()].filter(x => counts.get(x) > 0).sort();
  let best = 0, run = 0, prev = null, bestEnd = null;
  for (const x of keys) {
    run = prev && diffDays(prev, x) === 1 ? run + 1 : 1;
    if (run > best) { best = run; bestEnd = x; }
    prev = x;
  }
  return { cur, best, bestEnd };
}

/* ---------- عادت‌ها ---------- */
/* هر عادت: {id, name, emoji, color, days:[۰=شنبه … ۶=جمعه], createdAt, archived} ؛ ثبت‌ها: habitLog[روز] = [شناسه‌ها] */
const HABIT_EMOJI = ['💧', '🏃', '📚', '🧘', '🥗', '😴', '✍️', '🎯', '💪', '🚶', '🧠', '🎵', '🌱', '☀️', '🦷', '💊', '🙏', '📵', '🧹', '💰'];
const habitDoneOn = (h, k) => (S.habitLog[k] || []).includes(h.id);
const habitDueOn = (h, k) => !h.days || !h.days.length || h.days.includes(wdOf(k));
function setHabit(h, k, on) {
  const a = (S.habitLog[k] || []).filter(id => id !== h.id);
  if (on) a.push(h.id);
  if (a.length) S.habitLog[k] = a; else delete S.habitLog[k];
  Store.touchMeta();
}
/* پیوستگی: روزهای برنامه‌ریزی‌نشده زنجیره را نمی‌شکنند؛ امروزِ هنوز انجام‌نشده هم نمی‌شکند */
function habitStreak(h) {
  const t = todayKey();
  let cur = 0, k = t, guard = 0;
  if (!habitDoneOn(h, t)) k = addDays(t, -1);
  while (guard++ < 2000) {
    if (habitDoneOn(h, k)) cur++;
    else if (habitDueOn(h, k)) break;
    k = addDays(k, -1);
    if (h.createdAt && k < msKey(h.createdAt) && !habitDoneOn(h, k)) break;
  }
  let best = 0, run = 0;
  const start = h.createdAt ? msKey(h.createdAt) : addDays(t, -365);
  for (let d = start; d <= t; d = addDays(d, 1)) {
    if (habitDoneOn(h, d)) { run++; if (run > best) best = run; }
    else if (habitDueOn(h, d) && d !== t) run = 0;
  }
  return { cur, best: Math.max(best, cur) };
}
function habitRate(h, days) {
  const t = todayKey(), created = h.createdAt ? msKey(h.createdAt) : '0000';
  let due = 0, done = 0;
  for (let i = 0; i < days; i++) {
    const k = addDays(t, -i);
    if (k < created) break;
    if (habitDueOn(h, k)) { due++; if (habitDoneOn(h, k)) done++; }
  }
  return due ? done / due : 0;
}

/* ---------- حال و یادداشت روزانه ---------- */
const MOODS = [null, { e: '😞', n: 'بد' }, { e: '😕', n: 'نه چندان' }, { e: '😐', n: 'معمولی' }, { e: '🙂', n: 'خوب' }, { e: '😄', n: 'عالی' }];

/* ---------- تعطیلات رسمی خورشیدی (تعطیلات قمری هر سال جابه‌جا می‌شوند و این‌جا نیستند) ---------- */
const HOLIDAYS = { '1-1': 'نوروز', '1-2': 'نوروز', '1-3': 'نوروز', '1-4': 'نوروز', '1-12': 'روز جمهوری اسلامی', '1-13': 'روز طبیعت', '3-14': 'رحلت امام خمینی', '3-15': 'قیام ۱۵ خرداد', '11-22': 'پیروزی انقلاب اسلامی', '12-29': 'ملی شدن صنعت نفت' };
const holidayOf = k => { const j = jOf(k); return HOLIDAYS[j.jm + '-' + j.jd] || null; };
const isOff = k => wdOf(k) === 6 || !!holidayOf(k);

/* ---------- افزودن سریع با زبان طبیعی ---------- */
const DG = '[0-9۰-۹٠-٩]';
const ZW = '[\\s\\u200c]?';
const PRI_WORDS = { 'فوری': 4, 'بالا': 3, 'زیاد': 3, 'مهم': 3, 'متوسط': 2, 'معمولی': 2, 'کم': 1, 'پایین': 1 };
function nextJDate(jm, jd) {
  if (!(jm >= 1 && jm <= 12 && jd >= 1)) return null;
  const t = todayKey();
  let jy = jOf(t).jy;
  if (jd > jMonthLen(jy, jm)) return null;
  let k = keyFromJ(jy, jm, jd);
  if (k < t) {
    jy++;
    if (jd > jMonthLen(jy, jm)) return null;
    k = keyFromJ(jy, jm, jd);
  }
  return k;
}
function findProject(name) {
  const n = normFa(name).replace(/_/g, ' ').trim();
  if (!n) return null;
  return S.projects.find(p => normFa(p.name) === n) || S.projects.find(p => n.length >= 2 && normFa(p.name).startsWith(n)) || null;
}
function parseQuick(raw) {
  const r = { title: '', due: null, time: null, priority: 0, projectId: null, tags: [], estimate: 0, recur: null };
  const t0 = todayKey();
  let s = ' ' + String(raw).replace(/ي/g, 'ی').replace(/ك/g, 'ک') + ' ';
  const cut = (re, fn) => { s = s.replace(re, (...m) => (fn(...m) === false ? m[0] : ' ')); };
  const nextWd = idx => { let k = addDays(t0, 1); while (wdOf(k) !== idx) k = addDays(k, 1); return k; };
  const setTime = (h, mi, ap) => {
    h = +toEn(h);
    mi = mi ? +toEn(mi) : 0;
    if (ap && /عصر|شب|ظهر/.test(ap) && h < 12 && !(/ظهر/.test(ap) && h >= 11)) h += 12;
    if (h > 23 || mi > 59) return false;
    r.time = pad(h) + ':' + pad(mi);
  };

  cut(new RegExp('\\sهر' + ZW + 'روز(?=\\s)'), () => { r.recur = 'daily'; });
  cut(new RegExp('\\sهر' + ZW + 'هفته(?=\\s)'), () => { r.recur = 'weekly'; });
  cut(new RegExp('\\sهر' + ZW + 'ماه(?=\\s)'), () => { r.recur = 'monthly'; });
  cut(new RegExp('\\sروزهای' + ZW + 'کاری(?=\\s)'), () => { r.recur = 'weekdays'; });

  cut(new RegExp('\\sپس' + ZW + 'فردا(?=\\s)'), () => { r.due = addDays(t0, 2); });
  cut(/\sفردا(?=\s)/, () => { r.due = addDays(t0, 1); });
  cut(/\sامروز(?=\s)/, () => { r.due = t0; });
  cut(new RegExp('\\sهفته(?:' + ZW + 'ی)?' + ZW + '(?:بعد|آینده)(?=\\s)'), () => { r.due = addDays(t0, 7); });
  cut(new RegExp('\\s(یک|دو|سه|چهار|پنج)?' + ZW + 'شنبه(?=\\s)'), (m, p) => { r.due = nextWd(['', 'یک', 'دو', 'سه', 'چهار', 'پنج'].indexOf(p || '')); });
  cut(/\sجمعه(?=\s)/, () => { r.due = nextWd(6); });
  cut(new RegExp('\\s(' + DG + '{4})[/\\-](' + DG + '{1,2})[/\\-](' + DG + '{1,2})(?=\\s)'), (m, y, mo, d) => {
    y = +toEn(y); mo = +toEn(mo); d = +toEn(d);
    if (y < 1300 || y > 1500 || mo < 1 || mo > 12 || d < 1 || d > jMonthLen(y, mo)) return false;
    r.due = keyFromJ(y, mo, d);
  });
  cut(new RegExp('\\s(' + DG + '{1,2})/(' + DG + '{1,2})(?=\\s)'), (m, mo, d) => { const k = nextJDate(+toEn(mo), +toEn(d)); if (!k) return false; r.due = k; });
  cut(new RegExp('\\s(' + DG + '{1,2})' + ZW + '(' + J_MONTHS.join('|') + ')(?=\\s)'), (m, d, mn) => { const k = nextJDate(J_MONTHS.indexOf(mn) + 1, +toEn(d)); if (!k) return false; r.due = k; });

  cut(new RegExp('\\sساعت\\s?(' + DG + '{1,2})(?:[:٫.](' + DG + '{2}))?(?:\\s(صبح|ظهر|بعدازظهر|بعد' + ZW + 'از' + ZW + 'ظهر|عصر|شب))?(?=\\s)'), (m, h, mi, ap) => setTime(h, mi, ap));
  cut(new RegExp('\\s(' + DG + '{1,2}):(' + DG + '{2})(?=\\s)'), (m, h, mi) => setTime(h, mi));

  cut(new RegExp('\\s!(' + Object.keys(PRI_WORDS).join('|') + '|[1-4۱-۴])(?=\\s)'), (m, p) => { r.priority = PRI_WORDS[p] || 5 - +toEn(p); });
  cut(new RegExp('\\s~(' + DG + '+)' + ZW + '(دقیقه|د|m|ساعت|س|h)?(?=\\s)'), (m, n, u) => { n = +toEn(n); r.estimate = u && /ساعت|س|h/.test(u) ? n * 60 : n; });

  cut(/\s#([^\s#@!~]+)(?=\s)/g, (m, name) => {
    const p = !r.projectId && findProject(name);
    if (p) r.projectId = p.id; else r.tags.push(name.replace(/_/g, ' '));
  });
  cut(/\s@([^\s#@!~]+)(?=\s)/g, (m, name) => { r.tags.push(name.replace(/_/g, ' ')); });

  r.title = s.replace(/\s+/g, ' ').trim();
  r.tags = [...new Set(r.tags)];
  if ((r.recur || r.time) && !r.due) r.due = t0;
  return r;
}

/* ---------- داده نمونه (با برچسب sample تا با یک دکمه پاک شود) ---------- */
function mulberry32(a) {
  return function () {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
function buildSample() {
  const R = mulberry32(14050801);
  const pick = a => a[Math.floor(R() * a.length)];
  const wpick = (items, w) => {
    let r = R() * w.reduce((a, b) => a + b, 0);
    for (let i = 0; i < items.length; i++) { r -= w[i]; if (r <= 0) return items[i]; }
    return items[items.length - 1];
  };
  const P = [['کار', 0], ['مطالعه', 2], ['سلامتی', 5], ['خانه', 1], ['پروژه شخصی', 6]].map(([name, color]) => ({ id: uid('p'), name, color, sample: true }));
  const pools = [
    ['بررسی ایمیل‌ها و پاسخ به پیام‌ها', 'جلسه هماهنگی تیم', 'نوشتن گزارش هفتگی', 'بازبینی کد همکاران', 'آماده‌سازی ارائه', 'رفع باگ صفحه ورود', 'برنامه‌ریزی اسپرینت', 'تماس با مشتری', 'به‌روزرسانی مستندات', 'تحلیل داده‌های فروش'],
    ['خواندن ۳۰ صفحه کتاب', 'مرور فصل ۴ الگوریتم‌ها', 'تمرین زبان انگلیسی', 'دیدن یک درس دوره آنلاین', 'یادداشت‌برداری از مقاله', 'حل ۵ سؤال برنامه‌نویسی'],
    ['ورزش صبحگاهی', 'پیاده‌روی ۴۰ دقیقه', 'یوگا و کشش', 'باشگاه', 'خواب قبل از ساعت ۱۲', 'آماده کردن غذای سالم'],
    ['خرید میوه و سبزیجات', 'پرداخت قبض‌ها', 'مرتب کردن اتاق کار', 'شستن لباس‌ها', 'آشپزی برای فردا', 'تماس با خانواده'],
    ['طراحی صفحه اصلی اپ', 'نوشتن پست وبلاگ', 'ضبط ویدیوی آموزشی', 'ایده‌پردازی برای محصول جدید', 'یادگیری یک کتابخانه جدید'],
  ];
  const tagsPool = ['جلسه', 'تماس', 'خرید', 'ایده', 'تمرین', 'مهم'];
  const hourW = [0, 0, 0, 0, 0, 0, 1, 2, 4, 7, 9, 8, 5, 4, 5, 7, 8, 7, 5, 4, 5, 6, 4, 2];
  const hoursIdx = [...Array(24).keys()];
  const t0 = todayKey(), now = Date.now();
  const at = (k, h, m) => { const d = dateOf(k); d.setHours(h, m, Math.floor(R() * 60), 0); return d.getTime(); };
  const tasks = [], focus = {};

  for (let i = 300; i >= 1; i--) {
    const k = addDays(t0, -i), w = wdOf(k);
    let lam = 4 * (0.5 + 0.6 * (1 - i / 300)) * (w === 6 ? 0.35 : w === 5 ? 0.7 : 1);
    if (i >= 205 && i <= 216) lam *= 0.15; // تعطیلات نوروز
    if (R() < 0.07) lam = 0;
    const n = Math.max(0, Math.round(lam * (0.35 + R() * 1.3)));
    let fsum = 0;
    for (let j = 0; j < n; j++) {
      const pi = wpick([0, 1, 2, 3, 4], w >= 5 ? [1, 2, 3, 4, 3] : [6, 3, 3, 2, 2]);
      const done = at(k, wpick(hoursIdx, hourW), Math.floor(R() * 60));
      const lead = wpick([0, 1, 2, 3, 5], [5, 3, 2, 1, 1]);
      const created = Math.min(done - 60000 * (30 + R() * 200), at(addDays(k, -lead), 8 + Math.floor(R() * 4), Math.floor(R() * 60)));
      const est = pick([15, 20, 25, 30, 45, 60, 90]);
      const foc = R() < 0.45 ? Math.round(est * (0.6 + R() * 0.8) / 5) * 5 : 0;
      fsum += foc;
      const hasDue = R() < 0.75, late = R() < 0.12;
      tasks.push(Object.assign(taskDefaults(), {
        id: uid('t'), title: pick(pools[pi]), projectId: P[pi].id, priority: wpick([0, 1, 2, 3, 4], [2, 3, 5, 3, 1]),
        status: 'done', due: hasDue ? (late ? addDays(k, -1 - Math.floor(R() * 2)) : k) : null,
        estimate: est, focus: foc, tags: R() < 0.2 ? [pick(tagsPool)] : [],
        createdAt: created, completedAt: done, order: created, sample: true,
      }));
    }
    const extra = n ? Math.round(R() * 40) : 0;
    if (fsum + extra) focus[k] = fsum + extra;
  }

  const add = f => tasks.push(Object.assign(taskDefaults(), { id: uid('t'), createdAt: now - Math.floor((1 + R() * 3) * 864e5), order: now + tasks.length, sample: true }, f));
  const todayAt = (h, m) => Math.min(now - 5 * 60000, at(t0, h, m));
  const sub = (title, done) => ({ id: uid('s'), title, done });
  add({ title: 'ورزش صبحگاهی', projectId: P[2].id, priority: 2, due: t0, time: '07:00', recur: 'daily', estimate: 20 });
  add({ title: 'جلسه هماهنگی تیم', projectId: P[0].id, priority: 3, due: t0, time: '10:30', estimate: 45, tags: ['جلسه'] });
  add({ title: 'نوشتن گزارش هفتگی', projectId: P[0].id, priority: 4, due: t0, estimate: 60, status: 'doing', notes: 'آمار هفته را از داشبورد فروش بردار و نکات جلسه دوشنبه را اضافه کن.', subtasks: [sub('جمع‌آوری آمار', true), sub('نوشتن پیش‌نویس', true), sub('بازبینی و ارسال', false)] });
  add({ title: 'خواندن ۳۰ صفحه کتاب', projectId: P[1].id, priority: 1, due: t0, time: '22:00', estimate: 30 });
  add({ title: 'خرید میوه و سبزیجات', projectId: P[3].id, priority: 2, due: t0, tags: ['خرید'] });
  add({ title: 'بررسی ایمیل‌ها و پاسخ به پیام‌ها', projectId: P[0].id, priority: 2, due: t0, status: 'done', completedAt: todayAt(9, 12), estimate: 20, focus: 20 });
  add({ title: 'پیاده‌روی ۴۰ دقیقه', projectId: P[2].id, priority: 1, due: t0, status: 'done', completedAt: todayAt(8, 5) });
  add({ title: 'پرداخت قبض‌ها', projectId: P[3].id, priority: 3, due: addDays(t0, -2), tags: ['مهم'] });
  add({ title: 'تماس با مشتری درباره قرارداد', projectId: P[0].id, priority: 2, due: addDays(t0, -1), tags: ['تماس'] });
  add({ title: 'آماده‌سازی ارائه فصل', projectId: P[0].id, priority: 3, due: addDays(t0, 1), time: '09:00', estimate: 90, subtasks: [sub('اسلاید نتایج', false), sub('نمودار رشد', false), sub('تمرین ارائه', false)] });
  add({ title: 'تمرین زبان انگلیسی', projectId: P[1].id, priority: 1, due: addDays(t0, 1), estimate: 30, tags: ['تمرین'] });
  add({ title: 'نوبت دندانپزشکی', projectId: P[2].id, priority: 3, due: addDays(t0, 3), time: '17:30' });
  add({ title: 'نوشتن پست وبلاگ', projectId: P[4].id, priority: 2, due: addDays(t0, 4), estimate: 60 });
  add({ title: 'تحلیل داده‌های فروش', projectId: P[0].id, priority: 2, due: addDays(t0, 5), estimate: 45 });
  add({ title: 'مرتب کردن اتاق کار', projectId: P[3].id, priority: 1, due: addDays(t0, 6) });
  add({ title: 'ضبط ویدیوی آموزشی', projectId: P[4].id, priority: 2, due: addDays(t0, 9), estimate: 90 });
  add({ title: 'مرور فصل ۵ الگوریتم‌ها', projectId: P[1].id, priority: 2, due: addDays(t0, 11), estimate: 60 });
  add({ title: 'ایده‌پردازی برای محصول جدید', projectId: P[4].id, priority: 0, tags: ['ایده'] });
  add({ title: 'یادگیری یک کتابخانه جدید', projectId: P[4].id, priority: 1, status: 'doing', estimate: 120 });
  add({ title: 'خرید هدیه تولد', projectId: P[3].id, priority: 2, tags: ['خرید'] });
  add({ title: 'مرور هفتگی اهداف', projectId: P[4].id, priority: 2, due: (() => { let k = t0; while (wdOf(k) !== 6) k = addDays(k, 1); return k; })(), recur: 'weekly', estimate: 30 });
  const j = jOf(t0);
  add({ title: 'پرداخت اجاره', projectId: P[3].id, priority: 4, due: j.jm === 12 ? keyFromJ(j.jy + 1, 1, 1) : keyFromJ(j.jy, j.jm + 1, 1), recur: 'monthly' });
  focus[t0] = (focus[t0] || 0) + 20;
  const H = [['آب کافی بنوش', '💧', 0, []], ['ورزش', '🏃', 2, [0, 1, 2, 3, 4]], ['کتاب‌خوانی', '📚', 5, []], ['مدیتیشن', '🧘', 4, []]]
    .map(([name, emoji, color, days]) => ({ id: uid('h'), name, emoji, color, days, createdAt: now - 70 * 864e5, sample: true }));
  const hlog = {}, journal = {};
  const hp = [0.85, 0.7, 0.55, 0.45];
  for (let i = 69; i >= 0; i--) {
    const k = addDays(t0, -i);
    H.forEach((h, hi) => { if (habitDueOn(h, k) && R() < hp[hi] * (i === 0 ? 0.5 : 1)) (hlog[k] = hlog[k] || []).push(h.id); });
    if (i > 0 && R() < 0.6) journal[k] = { mood: wpick([1, 2, 3, 4, 5], [1, 2, 4, 6, 3]), note: '', sample: true };
  }
  return { projects: P, tasks, focus, habits: H, habitLog: hlog, journal };
}

if (typeof module !== 'undefined') module.exports = { d2j, j2d, g2d, d2g, jOf, keyFromJ, jMonthLen, jLeap, addDays, wdOf, parseQuick, nextOccurrence, stepRecur, buildSample, streakInfo, levelOf, S, Store, todayKey, fmtDate, relDate, faNum, habitStreak, habitRate, setHabit, habitDoneOn, holidayOf };
