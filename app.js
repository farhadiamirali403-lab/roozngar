'use strict';
/* روزنگار · رابط کاربری */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = escH;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
document.documentElement.lang = 'fa';
document.documentElement.dir = 'rtl';

/* ---------- آیکن‌ها ---------- */
const ICONS = {
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  list: '<path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.5" cy="6" r="1"/><circle cx="4.5" cy="12" r="1"/><circle cx="4.5" cy="18" r="1"/>',
  calendar: '<rect x="3" y="4" width="18" height="17" rx="3"/><path d="M3 9h18M8 2v4M16 2v4"/>',
  timer: '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2.5M10 2h4M12 2v3"/>',
  chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
  sliders: '<path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="18" cy="18" r="2"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>',
  flag: '<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>',
  trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  checks: '<path d="M2.5 12.5l3.5 3.5L12.5 9.5"/><path d="M11 15.5l1 1L21 7.5"/>',
  repeat: '<path d="M17 2l3 3-3 3"/><path d="M4 11V9a4 4 0 0 1 4-4h12"/><path d="M7 22l-3-3 3-3"/><path d="M20 13v2a4 4 0 0 1-4 4H4"/>',
  folder: '<path d="M3 6.5A1.5 1.5 0 0 1 4.5 5H9l2 2.5h8.5A1.5 1.5 0 0 1 21 9v9.5a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 18.5z"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  x: '<path d="M6 6l12 12M18 6L6 18"/>',
  chevL: '<path d="M15 6l-6 6 6 6"/>',
  chevR: '<path d="M9 6l6 6-6 6"/>',
  chevD: '<path d="M6 9l6 6 6-6"/>',
  moon: '<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>',
  download: '<path d="M12 4v11M7 10l5 5 5-5M4 20h16"/>',
  upload: '<path d="M12 16V5M7 10l5-5 5 5M4 20h16"/>',
  play: '<path d="M8 5.5v13l10.5-6.5z"/>',
  pause: '<path d="M8 5v14M16 5v14"/>',
  skip: '<path d="M18 5.5v13L9 12zM6 5v14"/>',
  reset: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>',
  flame: '<path d="M12 22c4 0 7-2.7 7-7 0-3.5-2.3-6-4-8 0 2.5-1.5 4-3 4.5C12 8 11 4.5 8 2c0 4-4 6.5-4 12 0 4.3 3.5 8 8 8z"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
  trophy: '<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4zM7 6H4v2a3 3 0 0 0 3 3M17 6h3v2a3 3 0 0 1-3 3"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h10"/>',
  note: '<path d="M5 4h14v16H5z"/><path d="M9 9h6M9 13h6M9 17h3"/>',
  copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/>',
  cloud: '<path d="M7 18h10a4 4 0 0 0 .5-8A6 6 0 0 0 6 9a4.5 4.5 0 0 0 1 9z"/>',
  sparkle: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 15l.7 1.8 1.8.7-1.8.7L19 20l-.7-1.8-1.8-.7 1.8-.7z"/>',
  up: '<path d="M7 17L17 7M9 7h8v8"/>',
  down: '<path d="M7 7l10 10M17 9v8H9"/>',
  keyboard: '<rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M7 14h10"/>',
  edit: '<path d="M4 20h4L19 9l-4-4L4 16v4z"/><path d="M13.5 6.5l4 4"/>',
  leaf: '<path d="M5 19c0-8 5-14 15-15-1 10-7 15-15 15z"/><path d="M5 19c3-4 6-7 10-9"/>',
  arrowL: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
};
const icon = (n, cls = '') => `<svg class="ic ${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[n] || ''}</svg>`;

/* ---------- وضعیت رابط ---------- */
const UI_KEY = 'roozngar:ui';
const UI = Object.assign({
  view: 'today', projectId: null, tag: null, sort: 'smart', fSearch: '', fProject: '', fStatus: 'open', limit: 80,
  showDoneToday: false, calY: 0, calM: 0, calSel: null, actRange: 'last', actMetric: 'tasks', actDay: null,
  statsRange: 30, boardProject: '', qaDue: null, drawerId: null, pm: null, importData: null, lastSub: {}, dMore: false,
}, (() => { try { return JSON.parse(localStorage.getItem(UI_KEY)) || {}; } catch (e) { return {}; } })());
function saveUI() {
  try {
    const { view, projectId, tag, sort, fStatus, statsRange, actMetric, showDoneToday, boardProject, lastSub } = UI;
    localStorage.setItem(UI_KEY, JSON.stringify({ view, projectId, tag, sort, fStatus, statsRange, actMetric, showDoneToday, boardProject, lastSub }));
  } catch (e) { /* */ }
}

/* پنج مقصد اصلی؛ هر کدام در صورت نیاز یک سوییچ کوچک بین دو نما دارد */
const NAV = [
  { id: 'today', name: 'امروز', icon: 'sun', views: ['today'] },
  { id: 'plan', name: 'برنامه', icon: 'calendar', views: ['upcoming', 'calendar'] },
  { id: 'tasks', name: 'کارها', icon: 'list', views: ['all', 'board', 'project', 'tag'] },
  { id: 'focus', name: 'تمرکز', icon: 'timer', views: ['focus'] },
  { id: 'report', name: 'گزارش', icon: 'chart', views: ['activity', 'stats'] },
];
const SUBS = {
  plan: [['upcoming', 'روزهای پیش رو'], ['calendar', 'تقویم']],
  tasks: [['all', 'فهرست'], ['board', 'بُرد']],
  report: [['activity', 'نقشه فعالیت'], ['stats', 'تحلیل']],
};
const VIEWS = [
  { id: 'today', name: 'امروز', icon: 'sun' },
  { id: 'upcoming', name: 'روزهای پیش رو', icon: 'calendar' },
  { id: 'calendar', name: 'تقویم', icon: 'calendar' },
  { id: 'all', name: 'همه کارها', icon: 'list' },
  { id: 'board', name: 'بُرد کانبان', icon: 'list' },
  { id: 'focus', name: 'تمرکز', icon: 'timer' },
  { id: 'activity', name: 'نقشه فعالیت', icon: 'chart' },
  { id: 'stats', name: 'تحلیل', icon: 'chart' },
  { id: 'settings', name: 'تنظیمات', icon: 'sliders' },
];
const navOf = v => NAV.find(n => n.views.includes(v)) || null;
function navGo(id) {
  const n = NAV.find(x => x.id === id);
  if (!n) return;
  const last = UI.lastSub && UI.lastSub[id];
  go(last && SUBS[id] && SUBS[id].some(s => s[0] === last) ? last : n.views[0]);
}
function subSwitch(id) {
  return `<nav class="vtabs" role="tablist">${SUBS[id].map(([v, n]) => `<button class="${UI.view === v ? 'on' : ''}" data-act="go" data-view="${v}" role="tab" aria-selected="${UI.view === v}">${n}</button>`).join('')}</nav>`;
}
const head = (eyebrow, title, sub, right = '', tabs = '') => `<header class="vh${tabs ? ' has-tabs' : ''}"><div class="vh-row"><div class="vh-t">${eyebrow ? `<p class="eyebrow">${eyebrow}</p>` : ''}<h1>${title}</h1>${sub ? `<p class="vh-sub">${sub}</p>` : ''}</div>${right ? `<div class="vh-r">${right}</div>` : ''}</div>${tabs}</header>`;
const MARK = '<span class="mark" aria-hidden="true"><i></i><i></i><i></i><i></i></span>';

function go(view, extra = {}) {
  UI.view = view;
  UI.limit = 80;
  Object.assign(UI, extra);
  const n = navOf(view);
  if (n && SUBS[n.id] && SUBS[n.id].some(s => s[0] === view)) UI.lastSub = Object.assign({}, UI.lastSub, { [n.id]: view });
  closeSide();
  saveUI();
  try { history.replaceState(null, '', '#' + (VIEWS.some(v => v.id === view) ? view : 'all')); } catch (e) { /* */ }
  render();
  window.scrollTo(0, 0);
}

/* ---------- رندر ---------- */
let renderQueued = false;
function requestRender() {
  if (renderQueued) return;
  renderQueued = true;
  requestAnimationFrame(() => { renderQueued = false; render(); });
}
const mbar = () => `<div class="mbar"><button class="icon-btn" data-act="side-open" aria-label="منو">${icon('menu')}</button><span class="brand-m">${MARK}<span class="logo">روزنگار</span></span><button class="icon-btn" data-act="palette" aria-label="جستجو">${icon('search')}</button></div>`;
function render() {
  const main = $('#main'), ae = document.activeElement;
  const fid = ae && ae.id && main.contains(ae) ? ae.id : null;
  let sel = null;
  try { if (fid && typeof ae.selectionStart === 'number') sel = [ae.selectionStart, ae.selectionEnd]; } catch (e) { /* */ }
  Tip.hide();
  renderSide();
  renderTabbar();
  const v = (VIEW_FN[UI.view] || VIEW_FN.today)();
  main.innerHTML = mbar() + sampleBanner() + v.html;
  if (v.mount) v.mount();
  if (fid) {
    const el = document.getElementById(fid);
    if (el) { el.focus({ preventScroll: true }); if (sel) try { el.setSelectionRange(sel[0], sel[1]); } catch (e) { /* */ } }
  }
  paintTimer(true);
}

function syncBadge() {
  const m = { cloud: 'همگام با حساب شما', connecting: 'در حال اتصال…', local: 'ذخیره در همین مرورگر' }[Store.status] || '';
  return `<span class="sync ${Store.status}" title="${Store.status === 'cloud' ? 'کارها در حساب شما ذخیره و بین دستگاه‌ها همگام می‌شوند' : 'کارها در حافظه همین مرورگر ذخیره می‌شوند'}"><i></i>${m}</span>`;
}
function topTags(n) {
  const m = new Map();
  for (const t of S.tasks.values()) t.tags.forEach(g => inc(m, g));
  return [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, n);
}
function renderSide() {
  const t0 = todayKey(), open = allTasks().filter(isOpen);
  const counts = { today: open.filter(t => t.due && t.due <= t0).length };
  const xp = totalXP(), lv = levelOf(xp), st = streakInfo(doneByDay()), cur = navOf(UI.view);
  const inProj = UI.view === 'project' || UI.view === 'tag';
  $('#side').innerHTML = `
    <div class="brand">${MARK}<span class="logo">روزنگار</span><button class="icon-btn only-m push" data-act="side-close" aria-label="بستن منو">${icon('x')}</button></div>
    <button class="search-btn" data-act="palette">${icon('search')}<span>جستجو</span><kbd>Ctrl K</kbd></button>
    <nav class="nav">${NAV.map(n => `<button class="nav-i${cur && cur.id === n.id && !inProj ? ' on' : ''}" data-act="nav" data-nav="${n.id}">${icon(n.icon)}<span>${n.name}</span>${counts[n.id] ? `<em>${faNum(counts[n.id])}</em>` : ''}</button>`).join('')}</nav>
    <div class="side-sec"><div class="side-h"><span>پروژه‌ها</span><button class="icon-btn sm" data-act="new-project" aria-label="پروژه جدید" title="پروژه جدید">${icon('plus')}</button></div>
      ${S.projects.map(p => { const n = open.filter(t => t.projectId === p.id).length; return `<button class="nav-i proj-i${UI.view === 'project' && UI.projectId === p.id ? ' on' : ''}" data-act="go-project" data-pid="${p.id}"><span class="pdot" style="background:var(--c${p.color})"></span><span>${esc(p.name)}</span>${n ? `<em>${faNum(n)}</em>` : ''}</button>`; }).join('') || '<button class="side-empty" data-act="new-project">+ اولین پروژه را بساز</button>'}
    </div>
    <div class="side-foot">
      <button id="sideTimer" class="side-timer" data-act="nav" data-nav="focus" hidden></button>
      <div class="me" title="${faNum(xp)} امتیاز · ${faNum(lv.need - lv.cur)} امتیاز تا سطح بعد">
        <span class="me-lv">سطح ${faNum(lv.L)} <small>${lv.title}</small></span>
        <span class="streak${st.cur ? ' on' : ''}" title="${faNum(st.cur)} روز پیوسته">${icon('flame')}${faNum(st.cur)}</span>
        <span class="me-bar"><i style="width:${(lv.cur / lv.need) * 100}%"></i></span>
      </div>
      <div class="foot-row">${syncBadge()}<button class="icon-btn sm${UI.view === 'settings' ? ' on' : ''}" data-act="go" data-view="settings" aria-label="تنظیمات" title="تنظیمات">${icon('sliders')}</button></div>
    </div>`;
}
function renderTabbar() {
  const cur = navOf(UI.view);
  $('#tabbar').innerHTML = NAV.map(n => `<button class="tab${cur && cur.id === n.id ? ' on' : ''}" data-act="nav" data-nav="${n.id}">${icon(n.icon)}<span>${n.name}</span></button>`).join('');
}
const hasSample = () => { for (const t of S.tasks.values()) if (t.sample) return true; return S.projects.some(p => p.sample); };
function sampleBanner() {
  if (!hasSample() || UI.view === 'settings') return '';
  return `<div class="banner">${icon('sparkle')}<span>داده‌های نمونه نمایش داده می‌شوند.</span><button class="link" data-act="remove-sample">حذف نمونه‌ها</button></div>`;
}

/* ---------- اجزای کار ---------- */
function sortTasks(list, mode = UI.sort) {
  const by = {
    smart: (a, b) => (a.due || '9999').localeCompare(b.due || '9999') || (a.time || '99').localeCompare(b.time || '99') || b.priority - a.priority || a.order - b.order,
    due: (a, b) => (a.due || '9999').localeCompare(b.due || '9999') || (a.time || '99').localeCompare(b.time || '99'),
    priority: (a, b) => b.priority - a.priority || (a.due || '9999').localeCompare(b.due || '9999'),
    created: (a, b) => b.createdAt - a.createdAt,
    title: (a, b) => a.title.localeCompare(b.title, 'fa'),
  };
  return list.slice().sort(by[mode] || by.smart);
}
const pColor = p => (p ? `var(--c${p.color})` : 'var(--p0)');
const projChip = p => (p ? `<span class="m-proj"><i style="background:var(--c${p.color})"></i>${esc(p.name)}</span>` : '');
/* اطلاعات زیر عنوان: فقط چیزهایی که لازم است، به شکل متن کم‌رنگ */
function taskMeta(t, o = {}) {
  const p = proj(t.projectId), sd = t.subtasks.filter(s => s.done).length, t0 = todayKey(), parts = [];
  if (o.doneTime && t.completedAt) parts.push(`<span>${icon('check')}${fmtClock(t.completedAt)}</span>`);
  if (t.due && !(o.hideToday && t.due === t0)) {
    const over = t.status !== 'done' && t.due < t0;
    parts.push(`<span class="m-due${over ? ' over' : ''}">${relDate(t.due)}${t.time ? '، ' + fa(t.time) : ''}</span>`);
  } else if (t.time) parts.push(`<span>${icon('clock')}${fa(t.time)}</span>`);
  if (p && !o.hideProject) parts.push(projChip(p));
  if (t.status === 'doing') parts.push('<span class="m-doing">در حال انجام</span>');
  if (t.subtasks.length) parts.push(`<span>${icon('checks')}${fa(sd)}/${fa(t.subtasks.length)}</span>`);
  if (t.recur) parts.push(`<span title="${RECUR[t.recur]}">${icon('repeat')}</span>`);
  if (t.notes) parts.push(`<span title="یادداشت دارد">${icon('note')}</span>`);
  return parts.join('');
}
function taskRow(t, o = {}) {
  const done = t.status === 'done';
  return `<div class="task pri-${t.priority}${done ? ' is-done' : ''}" data-id="${t.id}">
    <button class="check" data-act="toggle" aria-label="${done ? 'برگرداندن به کارهای باز' : 'علامت انجام شد'}" title="${PRI[t.priority].name}">${icon('check')}</button>
    <div class="t-body" data-act="open" tabindex="0" role="button" aria-label="ویرایش ${esc(t.title)}">
      <div class="t-title">${t.priority === 4 && !done ? `<span class="urgent" title="فوری">${icon('flag')}</span>` : ''}${esc(t.title)}</div>
      <div class="t-meta">${taskMeta(t, o)}</div>
    </div>
    <div class="t-act">
      ${!done ? `<button class="icon-btn sm" data-act="focus-task" title="شروع تمرکز روی این کار" aria-label="شروع تمرکز">${icon('play')}</button>` : ''}
      <button class="icon-btn sm" data-act="del" title="حذف" aria-label="حذف">${icon('trash')}</button>
    </div>
  </div>`;
}
function section(title, list, o = {}) {
  if (!list.length && !o.empty) return '';
  return `<section class="tsec ${o.cls || ''}"${o.id ? ` id="${o.id}"` : ''}><h2 class="tsec-h">${title}${o.sub ? `<small>${o.sub}</small>` : ''}${list.length ? `<span class="cnt">${faNum(list.length)}</span>` : ''}${o.extra || ''}</h2>
    ${list.length ? `<div class="tlist">${list.map(t => taskRow(t, o)).join('')}</div>` : `<p class="empty-line">${o.empty}</p>`}</section>`;
}
function quickAdd(ph) {
  return `<div class="qa-wrap"><form class="qa" id="qaForm" autocomplete="off">
    <span class="qa-plus">${icon('plus')}</span>
    <input id="qaInput" class="qa-in" placeholder="${ph || 'چه کاری باید انجام بدهی؟'}" aria-label="افزودن کار جدید" enterkeyhint="done">
    <button class="qa-q" type="button" data-act="qa-help" aria-label="راهنمای نوشتن سریع" title="راهنمای نوشتن سریع">؟</button>
    <button class="btn primary" type="submit">افزودن</button>
  </form><div id="qaChips" class="qa-chips">${qaChipsHTML('')}</div></div>`;
}
function qaChipsHTML(v) {
  const r = parseQuick(v), c = [];
  if (r.due) c.push(`<span class="chip">${icon('calendar')}${relDate(r.due)}${r.time ? '، ' + fa(r.time) : ''}</span>`);
  else if (UI.qaDue) c.push(`<span class="chip">${icon('calendar')}برای ${relDate(UI.qaDue)}<button type="button" class="chip-x" data-act="qa-due-clear" aria-label="حذف تاریخ">${icon('x')}</button></span>`);
  if (r.projectId) { const p = proj(r.projectId); c.push(`<span class="chip"><i class="dot" style="background:var(--c${p.color})"></i>${esc(p.name)}</span>`); }
  if (r.priority) c.push(`<span class="chip">${icon('flag')}${PRI[r.priority].short}</span>`);
  if (r.recur) c.push(`<span class="chip">${icon('repeat')}${RECUR[r.recur]}</span>`);
  if (r.estimate) c.push(`<span class="chip">${icon('clock')}${fa(r.estimate)} دقیقه</span>`);
  r.tags.forEach(g => c.push(`<span class="chip">#${esc(g)}</span>`));
  return c.join('');
}
function updateQaChips() { const el = $('#qaChips'), i = $('#qaInput'); if (el && i) el.innerHTML = qaChipsHTML(i.value); }
function focusQuickAdd() {
  const i = $('#qaInput');
  if (i) { i.focus(); return; }
  go('today');
  setTimeout(() => { const j = $('#qaInput'); j && j.focus(); }, 30);
}
function submitQuick() {
  const inp = $('#qaInput'), raw = inp.value.trim();
  if (!raw) { inp.focus(); return; }
  const r = parseQuick(raw);
  if (!r.title) { toast('عنوان کار را هم بنویس.', { kind: 'bad' }); return; }
  const f = { title: r.title, priority: r.priority, tags: r.tags, estimate: r.estimate, recur: r.recur, time: r.time, due: r.due, projectId: r.projectId };
  const t0 = todayKey();
  if (!f.due) {
    if (UI.qaDue) f.due = UI.qaDue;
    else if (UI.view === 'today') f.due = t0;
    else if (UI.view === 'upcoming') f.due = addDays(t0, 1);
    else if (UI.view === 'calendar') f.due = UI.calSel || t0;
  }
  if (!f.projectId && UI.view === 'project') f.projectId = UI.projectId;
  if (UI.view === 'tag' && UI.tag && !f.tags.includes(UI.tag)) f.tags.push(UI.tag);
  const t = newTask(f);
  inp.value = '';
  UI.qaDue = null;
  render();
  const row = $(`.task[data-id="${t.id}"]`);
  if (row) row.classList.add('flash');
  toast(`«${esc(t.title)}» اضافه شد${f.due ? '، ' + relDate(f.due) : ''}`);
}
function greeting() {
  const h = new Date().getHours();
  return h < 5 ? 'شب بخیر' : h < 12 ? 'صبح بخیر' : h < 15 ? 'ظهر بخیر' : h < 19 ? 'عصر بخیر' : 'شب بخیر';
}
const kpi = (lab, val, sub, cls = '') => `<div class="kpi ${cls}"><span class="kpi-l">${lab}</span><b class="kpi-v">${val}</b><span class="kpi-s">${sub}</span></div>`;

/* ---------- نما: امروز ---------- */
function welcomeCard() {
  return `<section class="welcome">
    <span class="welcome-ic">${icon('leaf')}</span>
    <div class="welcome-text"><h2>خوش آمدی</h2>
    <p>کارهای امروزت را در کادر پایین بنویس و وقتی انجام شد تیکش بزن. هر روزی که کاری انجام بدهی، یک خانه سبز به نقشه فعالیتت اضافه می‌شود.</p></div>
    <div class="welcome-act"><button class="btn" data-act="dismiss-welcome">شروع کنیم</button><button class="link" data-act="load-sample">اول با داده نمونه امتحان کنم</button></div>
  </section>`;
}
function viewToday() {
  const t0 = todayKey(), all = allTasks(), open = all.filter(isOpen);
  const overdue = sortTasks(open.filter(t => t.due && t.due < t0), 'smart');
  const todays = sortTasks(open.filter(t => t.due === t0), 'smart');
  const doneToday = all.filter(t => t.status === 'done' && t.completedAt && msKey(t.completedAt) === t0).sort((a, b) => b.completedAt - a.completedAt);
  const goal = S.settings.dailyGoal || 5, counts = doneByDay(), st = streakInfo(counts);
  const left = overdue.length + todays.length;
  const welcome = !S.tasks.size && !S.settings.welcomed;
  const heatStart = addDays(t0, -wdOf(t0) - 16 * 7);
  const tomorrow = sortTasks(open.filter(t => t.due === addDays(t0, 1)), 'smart');
  let weekFocus = 0;
  for (let i = 0; i < 7; i++) weekFocus += focusOn(addDays(t0, -i));
  const sub = left ? `${faNum(left)} کار مانده؛ یکی‌یکی جلو برو.` : doneToday.length ? 'همه کارهای امروز انجام شد. روز خوبی بود.' : 'امروز هنوز کاری ننوشتی.';
  const html = `
  ${head(fmtDate(t0, { weekday: true }), greeting() + (S.settings.name ? '، ' + esc(S.settings.name) : ''), sub)}
  ${welcome ? welcomeCard() : ''}
  <div class="strip">
    <div class="strip-i"><span class="strip-l">هدف امروز</span><b class="strip-v">${faNum(doneToday.length)}<small> از ${faNum(goal)}</small></b><span class="strip-bar"><i style="width:${Math.min(100, (doneToday.length / goal) * 100)}%"></i></span></div>
    <div class="strip-i"><span class="strip-l">مانده برای امروز</span><b class="strip-v">${faNum(left)}<small> کار</small></b><span class="strip-s">${overdue.length ? `<span class="txt-crit">${faNum(overdue.length)} کار عقب‌افتاده</span>` : 'عقب‌افتاده‌ای نداری'}</span></div>
    <div class="strip-i"><span class="strip-l">پیوستگی</span><b class="strip-v">${faNum(st.cur)}<small> روز</small></b><span class="strip-s">رکورد: ${faNum(st.best)} روز</span></div>
    <div class="strip-i"><span class="strip-l">تمرکز امروز</span><b class="strip-v">${fmtHours(focusOn(t0))}</b><span class="strip-s">این هفته: ${fmtHours(weekFocus)}</span></div>
  </div>
  <div class="split">
    <div class="split-main">
      ${quickAdd()}
      ${overdue.length ? section('عقب‌افتاده', overdue, { cls: 'sec-over', extra: `<button class="link sm push" data-act="move-overdue">${icon('arrowL')}انتقال همه به امروز</button>` }) : ''}
      ${section('امروز', todays, { hideToday: true, empty: overdue.length || doneToday.length ? 'کار بازی برای امروز نمانده.' : 'برای شروع، اولین کار امروز را در کادر بالا بنویس.' })}
      ${doneToday.length ? `<section class="tsec sec-done"><h2 class="tsec-h"><button class="tsec-toggle" data-act="toggle-done-today" aria-expanded="${UI.showDoneToday}">${icon(UI.showDoneToday ? 'chevD' : 'chevL')}انجام‌شده امروز<span class="cnt">${faNum(doneToday.length)}</span></button></h2>${UI.showDoneToday ? `<div class="tlist">${doneToday.map(t => taskRow(t, { doneTime: true, hideToday: true })).join('')}</div>` : ''}</section>` : ''}
    </div>
    <aside class="split-side">
      <section class="card">
        <div class="card-h"><h3>فعالیت چهار ماه اخیر</h3><button class="link sm" data-act="go" data-view="activity">نقشه کامل</button></div>
        <div class="heat-scroll" id="miniHeat"></div>${heatLegend()}
      </section>
      <section class="card">
        <div class="card-h"><h3>فردا</h3><button class="link sm" data-act="go" data-view="upcoming">برنامه کامل</button></div>
        ${tomorrow.length ? `<ul class="mini-list">${tomorrow.slice(0, 6).map(t => `<li data-id="${t.id}"><button data-act="open"><span class="pdot" style="background:${pColor(proj(t.projectId))}"></span><span class="ml-t">${esc(t.title)}</span>${t.time ? `<small>${fa(t.time)}</small>` : ''}</button></li>`).join('')}</ul>${tomorrow.length > 6 ? `<p class="muted sm">و ${faNum(tomorrow.length - 6)} کار دیگر</p>` : ''}` : '<p class="empty-line">برای فردا هنوز برنامه‌ای نداری.</p>'}
      </section>
    </aside>
  </div>`;
  return {
    html,
    mount() {
      heatmap($('#miniHeat'), {
        start: heatStart, end: t0, cell: 11, gap: 3, value: k => counts.get(k) || 0, scrollEnd: true, label: 'فعالیت ۱۷ هفته اخیر',
        tip: (k, v) => `<b>${v ? faNum(v) + ' کار انجام شد' : 'بدون فعالیت'}</b><span>${fmtDate(k, { weekday: true })}</span>`,
        onPick: k => go('activity', { actDay: k, actRange: 'last' }),
      });
    },
  };
}
function moveOverdue() {
  const t0 = todayKey(), list = allTasks().filter(t => isOpen(t) && t.due && t.due < t0);
  if (!list.length) return;
  const prev = list.map(t => [t.id, t.due]);
  list.forEach(t => { t.due = t0; Store.touchTask(t); });
  render();
  toast(`${faNum(list.length)} کار به امروز منتقل شد.`, { undo: () => { prev.forEach(([id, d]) => { const t = S.tasks.get(id); if (t) { t.due = d; Store.touchTask(t); } }); render(); } });
}

/* ---------- نما: روزهای پیش رو ---------- */
function viewUpcoming() {
  const t0 = todayKey(), open = allTasks().filter(isOpen);
  const week = Array.from({ length: 7 }, (_, i) => addDays(t0, i));
  const loads = week.map(k => open.filter(t => t.due === k).length), maxL = Math.max(1, ...loads);
  const days = Array.from({ length: 14 }, (_, i) => addDays(t0, i + 1));
  const later = sortTasks(open.filter(t => t.due && t.due > days[13]), 'due');
  const nodate = sortTasks(open.filter(t => !t.due), 'priority');
  const html = `
  ${head('برنامه', 'روزهای پیش رو', 'دو هفته آینده در یک نگاه.', '', subSwitch('plan'))}
  <div class="wstrip">${week.map((k, i) => `<button class="wday${i === 0 ? ' is-today' : ''}${wdOf(k) === 6 ? ' is-fri' : ''}" data-act="jump-day" data-k="${k}">
    <span class="wd">${i === 0 ? 'امروز' : WEEKDAYS[wdOf(k)]}</span><b>${fa(jOf(k).jd)}</b>
    <span class="load" aria-hidden="true"><i style="width:${(loads[i] / maxL) * 100}%"></i></span><small>${loads[i] ? faNum(loads[i]) + ' کار' : 'آزاد'}</small></button>`).join('')}</div>
  ${quickAdd('کار جدید؛ بدون تاریخ، برای فردا ثبت می‌شود')}
  ${days.map((k, i) => {
    const list = sortTasks(open.filter(t => t.due === k), 'smart');
    return `<section class="tsec day-sec${list.length ? '' : ' is-empty'}" id="d-${k}"><h2 class="tsec-h">${i < 6 ? relDate(k) : WEEKDAYS[wdOf(k)]}<small>${fmtDate(k, { year: false })}</small>${list.length ? `<span class="cnt">${faNum(list.length)}</span>` : ''}<button class="link sm push" data-act="qa-day" data-k="${k}">${icon('plus')}افزودن</button></h2>
      ${list.length ? `<div class="tlist">${list.map(t => taskRow(t, { hideToday: true })).join('')}</div>` : ''}</section>`;
  }).join('')}
  ${section('بعدتر', later)}
  ${section('بدون تاریخ', nodate)}`;
  return { html };
}

/* ---------- نما: فهرست (همه، پروژه، برچسب) ---------- */
function viewList() {
  const p = UI.view === 'project' ? proj(UI.projectId) : null, tag = UI.view === 'tag' ? UI.tag : null;
  let base = allTasks();
  if (p) base = base.filter(t => t.projectId === p.id);
  if (tag) base = base.filter(t => t.tags.includes(tag));
  let list = base;
  const q = normFa(UI.fSearch.trim());
  if (q) list = list.filter(t => normFa(t.title + ' ' + t.notes + ' ' + t.tags.join(' ')).includes(q));
  if (!p && UI.fProject) list = list.filter(t => (t.projectId || 'none') === UI.fProject);
  if (UI.fStatus === 'open') list = list.filter(isOpen);
  else if (UI.fStatus === 'done') list = list.filter(t => t.status === 'done');
  list = UI.fStatus === 'done' ? list.sort((a, b) => (b.completedAt || 0) - (a.completedAt || 0)) : sortTasks(list);
  const total = list.length;
  list = list.slice(0, UI.limit);
  const openN = base.filter(isOpen).length, doneN = base.length - openN;
  let h;
  if (p) {
    h = head('پروژه', `<span class="pdot lg" style="background:var(--c${p.color})"></span>${esc(p.name)}`,
      `<span class="pbar"><span class="pbar-track"><i style="width:${base.length ? (doneN / base.length) * 100 : 0}%;background:var(--c${p.color})"></i></span>${faNum(doneN)} از ${faNum(base.length)} کار انجام شده</span>`,
      `<button class="btn" data-act="edit-project" data-pid="${p.id}">${icon('edit')}ویرایش</button>`);
  } else if (tag) {
    h = head('برچسب', '#' + esc(tag), `${faNum(openN)} کار باز، ${faNum(doneN)} انجام‌شده`);
  } else {
    h = head('کارها', 'همه کارها', `${faNum(openN)} کار باز، ${faNum(doneN)} انجام‌شده`, '', subSwitch('tasks'));
  }
  const sel = (id, opts, val, label) => `<select id="${id}" aria-label="${label}">${opts.map(([v, n]) => `<option value="${v}"${String(val) === String(v) ? ' selected' : ''}>${n}</option>`).join('')}</select>`;
  const filters = `<div class="filters">
    <label class="search">${icon('search')}<input id="fSearch" type="search" placeholder="جستجو…" value="${esc(UI.fSearch)}" aria-label="جستجو"></label>
    <div class="seg">${[['open', 'باز'], ['done', 'انجام‌شده'], ['all', 'همه']].map(([v, n]) => `<button class="${UI.fStatus === v ? 'on' : ''}" data-act="f-status" data-v="${v}">${n}</button>`).join('')}</div>
    ${p ? '' : sel('fProject', [['', 'همه پروژه‌ها'], ...S.projects.map(x => [x.id, x.name]), ['none', 'بدون پروژه']], UI.fProject, 'پروژه')}
    ${UI.fStatus === 'done' ? '' : sel('fSort', [['smart', 'مرتب: هوشمند'], ['due', 'مرتب: تاریخ'], ['priority', 'مرتب: اولویت'], ['created', 'مرتب: جدیدترین']], UI.sort, 'مرتب‌سازی')}
  </div>`;
  const body = total ? `<div class="tlist">${list.map(t => taskRow(t, { doneTime: UI.fStatus !== 'open', hideProject: !!p })).join('')}</div>`
    : `<div class="empty"><p>${q || UI.fProject ? 'کاری با این جستجو پیدا نشد.' : UI.fStatus === 'done' ? 'هنوز کاری انجام نشده.' : 'کار بازی نداری. از کادر بالا شروع کن.'}</p></div>`;
  const more = total > UI.limit ? `<button class="btn block" data-act="more">نمایش ${faNum(Math.min(80, total - UI.limit))} کار دیگر</button>` : '';
  return { html: h + quickAdd() + filters + body + more };
}

/* ---------- نما: بُرد کانبان ---------- */
function viewBoard() {
  const recent = addDays(todayKey(), -6);
  let list = allTasks();
  if (UI.boardProject) list = list.filter(t => (t.projectId || 'none') === UI.boardProject);
  const cols = [
    { id: 'todo', name: 'برای انجام', items: sortTasks(list.filter(t => t.status === 'todo'), 'smart') },
    { id: 'doing', name: 'در حال انجام', items: sortTasks(list.filter(t => t.status === 'doing'), 'smart') },
    { id: 'done', name: 'انجام شد', sub: 'هفت روز اخیر', items: list.filter(t => t.status === 'done' && t.completedAt && msKey(t.completedAt) >= recent).sort((a, b) => b.completedAt - a.completedAt) },
  ];
  const card = (t, ci) => `<article class="bcard pri-${t.priority}" draggable="true" data-id="${t.id}">
    <button class="bc-title" data-act="open">${esc(t.title)}</button>
    <div class="t-meta">${taskMeta(t)}</div>
    <div class="bc-foot">${ci > 0 ? `<button class="icon-btn sm" data-act="board-move" data-to="${cols[ci - 1].id}" title="برگشت به «${cols[ci - 1].name}»" aria-label="انتقال به ${cols[ci - 1].name}">${icon('chevR')}</button>` : '<span></span>'}
    ${ci < 2 ? `<button class="icon-btn sm" data-act="board-move" data-to="${cols[ci + 1].id}" title="رفتن به «${cols[ci + 1].name}»" aria-label="انتقال به ${cols[ci + 1].name}">${icon('chevL')}</button>` : ''}</div>
  </article>`;
  const html = `
  ${head('کارها', 'بُرد کانبان', 'کارت‌ها را بکش و بین ستون‌ها رها کن.', '', subSwitch('tasks'))}
  <div class="filters"><select id="fBoard" aria-label="پروژه"><option value="">همه پروژه‌ها</option>${S.projects.map(p => `<option value="${p.id}"${UI.boardProject === p.id ? ' selected' : ''}>${esc(p.name)}</option>`).join('')}<option value="none"${UI.boardProject === 'none' ? ' selected' : ''}>بدون پروژه</option></select></div>
  <div class="board">${cols.map((c, ci) => `<section class="bcol" data-col="${c.id}"><header class="bcol-h"><span class="bdot ${c.id}"></span>${c.name}${c.sub ? `<small>${c.sub}</small>` : ''}<span class="cnt">${faNum(c.items.length)}</span></header>
    <div class="bcol-body">${c.items.map(t => card(t, ci)).join('') || '<p class="empty-line">خالی</p>'}</div></section>`).join('')}</div>`;
  return { html };
}

/* ---------- نما: تقویم شمسی ---------- */
function viewCalendar() {
  const t0 = todayKey();
  if (!UI.calY) { const j = jOf(t0); UI.calY = j.jy; UI.calM = j.jm; }
  const jy = UI.calY, jm = UI.calM, first = keyFromJ(jy, jm, 1), len = jMonthLen(jy, jm), last = addDays(first, len - 1);
  const all = allTasks(), byDue = new Map(), doneBy = doneByDay();
  all.forEach(t => { if (t.due && t.due >= first && t.due <= last) { if (!byDue.has(t.due)) byDue.set(t.due, []); byDue.get(t.due).push(t); } });
  let maxDone = 0;
  for (let i = 0; i < len; i++) maxDone = Math.max(maxDone, doneBy.get(addDays(first, i)) || 0);
  const sel = UI.calSel && UI.calSel >= first && UI.calSel <= last ? UI.calSel : (t0 >= first && t0 <= last ? t0 : first);
  UI.calSel = sel;
  const g1 = dateOf(first), g2 = dateOf(last);
  const gTitle = G_MONTHS[g1.getMonth()] + (g1.getMonth() !== g2.getMonth() ? ' – ' + G_MONTHS[g2.getMonth()] : '') + ' ' + g2.getFullYear();
  let cells = '';
  for (let i = 0; i < wdOf(first); i++) cells += '<div class="cal-cell pad" aria-hidden="true"></div>';
  for (let d = 1; d <= len; d++) {
    const k = addDays(first, d - 1), items = sortTasks(byDue.get(k) || [], 'smart').sort((a, b) => (a.status === 'done') - (b.status === 'done'));
    const dn = doneBy.get(k) || 0, lvl = dn ? Math.min(4, Math.ceil((dn / maxDone) * 4)) : 0;
    cells += `<button class="cal-cell${k === t0 ? ' is-today' : ''}${k === sel ? ' is-sel' : ''}${wdOf(k) === 6 ? ' is-fri' : ''}" data-act="cal-day" data-k="${k}" aria-label="${fmtDate(k, { weekday: true })}">
      <span class="cal-top"><span class="cal-d">${fa(d)}</span>${dn ? `<span class="cal-heat l${lvl}" title="${faNum(dn)} کار انجام شد"></span>` : ''}</span>
      <span class="cal-items">${items.slice(0, 3).map(t => `<span class="cal-it${t.status === 'done' ? ' done' : ''}" style="--pc:${pColor(proj(t.projectId))}">${esc(t.title)}</span>`).join('')}${items.length > 3 ? `<span class="cal-more">+${fa(items.length - 3)}</span>` : ''}</span>
    </button>`;
  }
  const dueSel = sortTasks(byDue.get(sel) || [], 'smart');
  const doneOn = all.filter(t => t.status === 'done' && t.completedAt && msKey(t.completedAt) === sel && t.due !== sel).sort((a, b) => a.completedAt - b.completedAt);
  const html = `
  ${head('برنامه', 'تقویم', 'روی هر روز بزن تا کارهایش را ببینی یا کاری اضافه کنی.', '', subSwitch('plan'))}
  <div class="cal-wrap">
    <section class="card cal">
      <div class="cal-nav"><button class="icon-btn" data-act="cal-prev" aria-label="ماه قبل">${icon('chevR')}</button>
        <div class="cal-title"><b>${J_MONTHS[jm - 1]} ${fa(jy)}</b><small dir="ltr">${gTitle}</small></div>
        <button class="icon-btn" data-act="cal-next" aria-label="ماه بعد">${icon('chevL')}</button><button class="btn sm" data-act="cal-today">امروز</button></div>
      <div class="cal-grid">${WEEKDAYS.map((w, i) => `<div class="cal-wd${i === 6 ? ' is-fri' : ''}">${w}</div>`).join('')}${cells}</div>
    </section>
    <section class="cal-day">
      <h3>${fmtDate(sel, { weekday: true })} <small>${relDate(sel)}</small></h3>
      ${quickAdd('کار جدید برای این روز…')}
      ${dueSel.length ? `<div class="tlist">${dueSel.map(t => taskRow(t, { doneTime: true, hideToday: true })).join('')}</div>` : '<p class="empty-line">برای این روز کاری نیست.</p>'}
      ${doneOn.length ? `<h4 class="sub-h">انجام‌شده در این روز</h4><div class="tlist">${doneOn.map(t => taskRow(t, { doneTime: true })).join('')}</div>` : ''}
    </section>
  </div>`;
  return { html };
}
function shiftCal(n) {
  UI.calM += n;
  if (UI.calM < 1) { UI.calM = 12; UI.calY--; }
  if (UI.calM > 12) { UI.calM = 1; UI.calY++; }
  UI.calSel = null;
  render();
}

/* ---------- نما: تمرکز (پومودورو) ---------- */
const TM_NAMES = { work: 'زمان تمرکز', short: 'استراحت کوتاه', long: 'استراحت بلند' };
function viewFocus() {
  const p = S.settings.pomo, t0 = todayKey();
  const open = sortTasks(allTasks().filter(isOpen), 'smart').slice(0, 200);
  const cur = Timer.taskId && S.tasks.get(Timer.taskId);
  const week = Array.from({ length: 7 }, (_, i) => addDays(t0, i - 6));
  const weekSum = week.reduce((a, k) => a + focusOn(k), 0);
  const C = 2 * Math.PI * 116;
  const html = `
  ${head('پومودورو', 'تمرکز', `${faNum(p.work)} دقیقه کار عمیق، بعد ${faNum(p.short)} دقیقه استراحت.`)}
  <div class="split">
    <div class="split-main">
      <section class="card focus-card mode-${Timer.mode}">
        <div class="seg tm-modes" role="tablist">${['work', 'short', 'long'].map(m => `<button class="${Timer.mode === m ? 'on' : ''}" data-act="tm-mode" data-m="${m}" role="tab" aria-selected="${Timer.mode === m}">${m === 'work' ? 'تمرکز' : TM_NAMES[m]}</button>`).join('')}</div>
        <div class="tm-dial">
          <svg class="tm-ring" viewBox="0 0 260 260" aria-hidden="true"><circle class="ring-bg" cx="130" cy="130" r="116" stroke-width="8"/><circle id="tmArc" class="ring-fg" data-c="${C.toFixed(2)}" cx="130" cy="130" r="116" stroke-width="8" stroke-dasharray="${C.toFixed(2)}" stroke-dashoffset="0" transform="rotate(-90 130 130)"/></svg>
          <div class="tm-center"><div id="tmDigits" class="tm-digits" aria-live="off">--:--</div><div class="tm-label">${TM_NAMES[Timer.mode]}</div>
            <div class="tm-cycles" title="جلسه‌های این دور">${Array.from({ length: p.every }, (_, i) => `<i class="${i < Timer.cycles % p.every ? 'on' : ''}"></i>`).join('')}</div></div>
        </div>
        <div class="tm-ctrl">
          <button class="icon-btn lg" data-act="tm-reset" title="شروع دوباره" aria-label="شروع دوباره">${icon('reset')}</button>
          <button id="tmStart" class="btn primary xl" data-act="tm-toggle"></button>
          <button class="icon-btn lg" data-act="tm-skip" title="رفتن به مرحله بعد" aria-label="مرحله بعد">${icon('skip')}</button>
        </div>
        <label class="field tm-task"><span>روی چه کاری تمرکز می‌کنی؟</span><select id="tmTask"><option value="">بدون کار مشخص</option>${open.map(t => `<option value="${t.id}"${t.id === Timer.taskId ? ' selected' : ''}>${esc(t.title)}</option>`).join('')}</select></label>
        ${cur ? `<div class="tm-cur" data-id="${cur.id}"><div class="t-meta">${taskMeta(cur)}</div><button class="btn sm" data-act="toggle">${icon('check')}این کار انجام شد</button></div>` : ''}
      </section>
    </div>
    <aside class="split-side">
      <section class="card stat-card"><span class="muted sm">تمرکز امروز</span><b class="big">${fmtHours(focusOn(t0))}</b><span class="muted sm">این هفته: ${fmtHours(weekSum)}</span></section>
      <section class="card"><div class="card-h"><h3>هفت روز اخیر</h3></div><div id="chFocusWeek" class="chart-box"></div></section>
    </aside>
  </div>`;
  return {
    html,
    mount() {
      barChart($('#chFocusWeek'), week.map((k, i) => ({ label: i === 6 ? 'امروز' : WD_SHORT[wdOf(k)], value: focusOn(k), tip: `<b>${fmtDate(k, { weekday: true })}</b><span>${fmtMin(focusOn(k))}</span>` })), { height: 160, hi: 6, allLabels: true, axisW: 30 });
    },
  };
}

/* ---------- نما: نقشه فعالیت (به سبک گیت‌هاب) ---------- */
function viewActivity() {
  const t0 = todayKey(), metric = UI.actMetric, counts = doneByDay();
  const val = k => (metric === 'focus' ? focusOn(k) : counts.get(k) || 0);
  let minKey = t0;
  counts.forEach((v, k) => { if (k < minKey) minKey = k; });
  [...Object.keys(S.focusLog), ...Object.keys(S.focusSample)].forEach(k => { if (k < minKey) minKey = k; });
  const y1 = jOf(t0).jy, y0 = Math.max(y1 - 6, jOf(minKey).jy), years = [];
  for (let y = y1; y >= y0; y--) years.push(y);
  let start, end;
  if (UI.actRange === 'last' || !years.includes(+UI.actRange)) { UI.actRange = 'last'; start = addDays(t0, -364); end = t0; }
  else { const y = +UI.actRange; start = keyFromJ(y, 1, 1); end = keyFromJ(y, 12, jMonthLen(y, 12)); }
  const realEnd = end < t0 ? end : t0;
  const days = [];
  for (let k = start; k <= realEnd; k = addDays(k, 1)) days.push(k);
  const total = days.reduce((a, k) => a + val(k), 0);
  const active = days.filter(k => val(k) > 0);
  const best = active.reduce((b, k) => (val(k) > val(b) ? k : b), active[0] || t0);
  const mMap = new Map();
  days.forEach(k => { if (val(k) > 0) mMap.set(k, 1); });
  const st = streakInfo(metric === 'focus' ? mMap : counts);
  const sel = UI.actDay && UI.actDay >= start && UI.actDay <= realEnd ? UI.actDay : (active[active.length - 1] || realEnd);
  const rangeName = UI.actRange === 'last' ? 'دوازده ماه گذشته' : 'سال ' + fa(UI.actRange);
  const headline = metric === 'focus' ? `${fmtHours(total)} تمرکز در ${rangeName}` : `${faNum(total)} کار انجام‌شده در ${rangeName}`;
  const dayDone = allTasks().filter(t => t.status === 'done' && t.completedAt && msKey(t.completedAt) === sel).sort((a, b) => a.completedAt - b.completedAt);
  const months = [];
  let lastM = '';
  days.forEach(k => { const j = jOf(k), mk = j.jy * 100 + j.jm; if (mk !== lastM) { months.push({ jy: j.jy, jm: j.jm, keys: [] }); lastM = mk; } months[months.length - 1].keys.push(k); });
  if (UI.actRange !== 'last') { const y = +UI.actRange; for (let m = months.length ? months[months.length - 1].jm + 1 : 1; m <= 12; m++) months.push({ jy: y, jm: m, keys: [] }); }
  const mVals = months.map(m => m.keys.reduce((a, k) => a + val(k), 0));
  const bestM = mVals.indexOf(Math.max(...mVals));
  const recentMonths = months.filter(m => m.keys.length).slice(-3).reverse();
  const allDone = allTasks().filter(t => t.status === 'done' && t.completedAt);
  const monthBlock = m => {
    const set = new Set(m.keys), list = allDone.filter(t => set.has(msKey(t.completedAt)));
    const pc = new Map();
    list.forEach(t => inc(pc, t.projectId || ''));
    const rows = [...pc.entries()].sort((a, b) => b[1] - a[1]).map(([id, v]) => { const p = proj(id); return { label: p ? p.name : 'بدون پروژه', value: v, color: pColor(p) }; });
    const act = m.keys.filter(k => counts.get(k)).length;
    return `<div class="mblock"><div class="mb-h"><b>${J_MONTHS[m.jm - 1]} ${fa(m.jy)}</b><span class="muted">${faNum(list.length)} کار در ${faNum(act)} روز فعال</span></div>${hbars(rows, { empty: 'در این ماه کاری انجام نشده.' })}</div>`;
  };
  const html = `
  ${head('گزارش', 'نقشه فعالیت', 'هر خانه یک روز است؛ هرچه سبزتر، روز پربارتر.', '', subSwitch('report'))}
  <section class="card act-card">
    <div class="act-head"><h2 class="act-total">${headline}</h2>
      <div class="seg sm" role="tablist"><button class="${metric === 'tasks' ? 'on' : ''}" data-act="act-metric" data-m="tasks">کارها</button><button class="${metric === 'focus' ? 'on' : ''}" data-act="act-metric" data-m="focus">تمرکز</button></div></div>
    <div class="heat-scroll" id="bigHeat"></div>
    <div class="act-foot">
      <div class="years" aria-label="انتخاب بازه">${['last', ...years].map(y => `<button class="${String(UI.actRange) === String(y) ? 'on' : ''}" data-act="act-range" data-r="${y}">${y === 'last' ? 'دوازده ماه اخیر' : fa(y)}</button>`).join('')}</div>
      ${heatLegend()}
    </div>
  </section>
  <div class="kpis">
    ${kpi('روزهای فعال', faNum(active.length), `از ${faNum(days.length)} روز`)}
    ${kpi('پیوستگی فعلی', `${faNum(st.cur)} <small>روز</small>`, st.cur ? 'زنجیره را نشکن!' : 'امروز یک کار انجام بده', st.cur ? 'kpi-good' : '')}
    ${kpi('طولانی‌ترین پیوستگی', `${faNum(st.best)} <small>روز</small>`, st.bestEnd ? 'تا ' + fmtDate(st.bestEnd) : '—')}
    ${kpi('پربارترین روز', active.length ? (metric === 'focus' ? fmtHours(val(best)) : `${faNum(val(best))} <small>کار</small>`) : '—', active.length ? fmtDate(best, { weekday: true }) : 'هنوز داده‌ای نیست')}
  </div>
  <div class="grid2">
    <section class="card day-log"><div class="card-h"><h3>${fmtDate(sel, { weekday: true })}</h3><span class="muted">${faNum(dayDone.length)} کار</span></div>
      ${dayDone.length ? `<ol class="commits">${dayDone.map(t => `<li data-id="${t.id}"><span class="c-dot" style="--pc:${pColor(proj(t.projectId))}"></span><time>${fmtClock(t.completedAt)}</time><button class="c-title" data-act="open">${esc(t.title)}</button><span class="c-xp">+${fa(taskXP(t))}</span></li>`).join('')}</ol>` : '<p class="empty-line">در این روز کاری انجام نشده.</p>'}
    </section>
    <section class="card"><div class="card-h"><h3>جمع ماهانه</h3><span class="muted">${metric === 'focus' ? 'ساعت تمرکز' : 'کار انجام‌شده'}</span></div><div id="chMonths" class="chart-box"></div></section>
  </div>
  <section class="card"><div class="card-h"><h3>ماه‌های اخیر به تفکیک پروژه</h3></div><div class="mblocks">${recentMonths.map(monthBlock).join('') || '<p class="empty-line">هنوز فعالیتی ثبت نشده.</p>'}</div></section>`;
  return {
    html,
    mount() {
      heatmap($('#bigHeat'), {
        start, end, cell: 13, gap: 3, value: k => (k > t0 ? 0 : val(k)), selected: sel, scrollEnd: true, label: 'نقشه فعالیت',
        tip: (k, v) => k > t0 ? `<span>${fmtDate(k, { weekday: true })}</span>` : `<b>${v ? (metric === 'focus' ? fmtMin(v) + ' تمرکز' : faNum(v) + ' کار انجام شد') : 'بدون فعالیت'}</b><span>${fmtDate(k, { weekday: true })}</span>`,
        onPick: k => { if (k <= t0) { UI.actDay = k; render(); } },
      });
      barChart($('#chMonths'), months.map((m, i) => ({
        label: J_MONTHS[m.jm - 1], value: metric === 'focus' ? +(mVals[i] / 60).toFixed(1) : mVals[i],
        tip: `<b>${J_MONTHS[m.jm - 1]} ${fa(m.jy)}</b><span>${metric === 'focus' ? fmtHours(mVals[i]) + ' تمرکز' : faNum(mVals[i]) + ' کار انجام شد'}</span>`,
      })), { height: 210, hi: mVals[bestM] > 0 ? bestM : -1, labelW: 54, int: metric !== 'focus', axisFmt: metric === 'focus' ? v => faNum(v, 1) : null });
    },
  };
}

/* ---------- نما: تحلیل ---------- */
function scoreText(s) {
  if (s >= 80) return 'عالی! ریتم کاری‌ات منظم و پربار است.';
  if (s >= 60) return 'خوب است؛ با کمی پیوستگی بیشتر به سطح عالی می‌رسی.';
  if (s >= 40) return 'متوسط؛ هدف روزانه را کوچک‌تر کن تا راحت‌تر به آن برسی.';
  return 'شروع کن! هر کار کوچکی که تیک می‌زنی امتیاز را بالا می‌برد.';
}
function viewStats() {
  const R = UI.statsRange, t0 = todayKey(), start = addDays(t0, -(R - 1)), pStart = addDays(start, -R);
  const all = allTasks(), goal = S.settings.dailyGoal || 5;
  const days = Array.from({ length: R }, (_, i) => addDays(start, i));
  const doneIn = [], doneP = [];
  for (const t of all) if (t.status === 'done' && t.completedAt) { const k = msKey(t.completedAt); if (k >= start && k <= t0) doneIn.push(t); else if (k >= pStart && k < start) doneP.push(t); }
  const created = all.filter(t => { const k = msKey(t.createdAt); return k >= start && k <= t0; });
  const createdDone = created.filter(t => t.status === 'done').length;
  const doneBy = new Map(), creBy = new Map();
  doneIn.forEach(t => inc(doneBy, msKey(t.completedAt)));
  created.forEach(t => inc(creBy, msKey(t.createdAt)));
  const focusMin = days.reduce((a, k) => a + focusOn(k), 0);
  const withDue = doneIn.filter(t => t.due), onTime = withDue.filter(t => msKey(t.completedAt) <= t.due);
  const activeDays = days.filter(k => doneBy.get(k)).length;
  const goalDays = days.filter(k => (doneBy.get(k) || 0) >= goal).length;
  const goalAvg = days.reduce((a, k) => a + Math.min(1, (doneBy.get(k) || 0) / goal), 0) / R;
  const compRate = created.length ? createdDone / created.length : 0;
  const onTimeRate = withDue.length ? onTime.length / withDue.length : 0;
  const parts = [['رسیدن به هدف روزانه', goalAvg, 0.4], ['انجام به‌موقع', withDue.length ? onTimeRate : goalAvg, 0.25], ['نرخ تکمیل', compRate, 0.2], ['پیوستگی روزها', activeDays / R, 0.15]];
  const score = Math.round(100 * parts.reduce((a, p) => a + p[1] * p[2], 0));
  const delta = doneP.length ? ((doneIn.length - doneP.length) / doneP.length) * 100 : null;
  const overdue = all.filter(t => isOpen(t) && t.due && t.due < t0).length;
  const allBy = doneByDay(), st = streakInfo(allBy);
  const wdSum = Array(7).fill(0), wdN = Array(7).fill(0);
  days.forEach(k => { const w = wdOf(k); wdN[w]++; wdSum[w] += doneBy.get(k) || 0; });
  const wdAvg = wdSum.map((s, i) => (wdN[i] ? s / wdN[i] : 0));
  const hours = Array(24).fill(0);
  doneIn.forEach(t => hours[msHour(t.completedAt)]++);
  const pc = new Map();
  doneIn.forEach(t => inc(pc, t.projectId && proj(t.projectId) ? t.projectId : ''));
  const projRows = [...pc.entries()].sort((a, b) => b[1] - a[1]).map(([id, v]) => { const p = proj(id); return { label: p ? p.name : 'بدون پروژه', value: v, color: pColor(p), valText: `${faNum(v)} <small>${faPct((v / doneIn.length) * 100)}</small>` }; });
  const pri = [4, 3, 2, 1, 0].map(p => ({ label: p === 0 ? 'بدون اولویت' : PRI[p].short, value: doneIn.filter(t => t.priority === p).length, color: `var(--p${p})` }));
  const est = doneIn.filter(t => t.estimate > 0 && t.focus > 0);
  const estRatio = est.length >= 3 ? est.reduce((a, t) => a + t.focus, 0) / est.reduce((a, t) => a + t.estimate, 0) : null;

  const weekly = R > 90;
  let labels = [], tipLabels = [], sDone = [], sCre = [], sFocus = [];
  if (!weekly) {
    labels = days.map(k => fmtDate(k, { year: false }));
    tipLabels = days.map(k => fmtDate(k, { weekday: true }));
    sDone = days.map(k => doneBy.get(k) || 0);
    sCre = days.map(k => creBy.get(k) || 0);
    sFocus = days.map(k => focusOn(k));
  } else {
    for (let w = 0; w * 7 < days.length; w++) {
      const ks = days.slice(w * 7, w * 7 + 7);
      labels.push(fmtDate(ks[0], { year: false }));
      tipLabels.push(`هفته ${fmtDate(ks[0], { year: false })} تا ${fmtDate(ks[ks.length - 1], { year: false })}`);
      sDone.push(ks.reduce((a, k) => a + (doneBy.get(k) || 0), 0));
      sCre.push(ks.reduce((a, k) => a + (creBy.get(k) || 0), 0));
      sFocus.push(ks.reduce((a, k) => a + focusOn(k), 0));
    }
  }

  const ins = [];
  if (doneIn.length) {
    const bw = wdAvg.indexOf(Math.max(...wdAvg));
    ins.push(['calendar', `پربازده‌ترین روز هفته‌ات <b>${WEEKDAYS[bw]}</b> است؛ به‌طور میانگین ${faNum(wdAvg[bw], 1)} کار.`]);
    let bestW = 0, bestH = 0;
    for (let h = 0; h < 24; h++) { const s2 = hours[h] + hours[(h + 1) % 24]; if (s2 > bestW) { bestW = s2; bestH = h; } }
    ins.push(['clock', `بیشتر کارها را بین ساعت <b>${fa(bestH)} تا ${fa((bestH + 2) % 24)}</b> تمام می‌کنی. کارهای سخت را برای همین ساعت‌ها بگذار.`]);
  }
  if (delta !== null) ins.push([delta >= 0 ? 'up' : 'down', delta >= 0 ? `در این بازه <b>${faPct(delta)}</b> بیشتر از ${faNum(R)} روزِ قبلش کار انجام دادی.` : `در این بازه <b>${faPct(-delta)}</b> کمتر از ${faNum(R)} روزِ قبلش کار انجام دادی.`]);
  if (projRows.length) ins.push(['folder', `${faPct((projRows[0].value / doneIn.length) * 100)} کارهای انجام‌شده مربوط به «${esc(projRows[0].label)}» بوده است.`]);
  if (estRatio) ins.push(['timer', estRatio > 1.05 ? `کارها حدود <b>${faPct((estRatio - 1) * 100)}</b> بیشتر از تخمینت زمان می‌برند.` : estRatio < 0.95 ? `کارها حدود <b>${faPct((1 - estRatio) * 100)}</b> کمتر از تخمینت زمان می‌برند.` : 'تخمین‌های زمانی‌ات تقریباً دقیق است.']);
  ins.push(['target', `در ${faNum(goalDays)} روز از ${faNum(R)} روز به هدف روزانه (${faNum(goal)} کار) رسیدی.`]);
  if (st.best) ins.push(['flame', `رکورد پیوستگی‌ات ${faNum(st.best)} روز است${st.cur ? ` و الان ${faNum(st.cur)} روز پشت سر هم فعال بوده‌ای` : ''}.`]);
  if (overdue) ins.push(['flag', `${faNum(overdue)} کار عقب‌افتاده داری؛ از صفحه امروز می‌توانی همه را به امروز منتقل کنی.`, 'warn']);

  const months = [];
  let lastM = '';
  days.forEach(k => { const j = jOf(k), mk = j.jy * 100 + j.jm; if (mk !== lastM) { months.push({ jy: j.jy, jm: j.jm, keys: [] }); lastM = mk; } months[months.length - 1].keys.push(k); });
  const mRows = months.reverse().map(m => {
    const d = m.keys.reduce((a, k) => a + (doneBy.get(k) || 0), 0), c = m.keys.reduce((a, k) => a + (creBy.get(k) || 0), 0);
    const f = m.keys.reduce((a, k) => a + focusOn(k), 0), b = m.keys.reduce((x, k) => ((doneBy.get(k) || 0) > (doneBy.get(x) || 0) ? k : x), m.keys[0]);
    return `<tr><th scope="row">${J_MONTHS[m.jm - 1]} ${fa(m.jy)}${m.keys.length < jMonthLen(m.jy, m.jm) ? ' <small>(بخشی)</small>' : ''}</th><td>${faNum(c)}</td><td>${faNum(d)}</td><td>${faNum(d / m.keys.length, 1)}</td><td>${fmtHours(f)}</td><td>${doneBy.get(b) ? `${fmtDate(b, { year: false })} <small>(${faNum(doneBy.get(b))})</small>` : '—'}</td></tr>`;
  }).join('');

  const deltaTxt = delta === null ? 'دوره قبل داده‌ای نداشت' : `<span class="delta ${delta >= 0 ? 'up' : 'down'}">${icon(delta >= 0 ? 'up' : 'down')}${faPct(Math.abs(delta))} ${delta >= 0 ? 'بیشتر' : 'کمتر'}</span> از دوره قبل`;
  const range = `<div class="seg sm" role="tablist" aria-label="بازه زمانی">${[[7, 'هفته'], [30, 'ماه'], [90, 'سه ماه'], [365, 'سال']].map(([r, n]) => `<button class="${R === r ? 'on' : ''}" data-act="stats-range" data-r="${r}" role="tab" aria-selected="${R === r}">${n}</button>`).join('')}</div>`;
  const html = `
  ${head('گزارش', 'تحلیل', `${fmtDate(start)} تا ${fmtDate(t0)}`, range, subSwitch('report'))}
  ${!all.length ? `<div class="welcome"><span class="welcome-ic">${icon('chart')}</span><div class="welcome-text"><h2>هنوز داده‌ای برای تحلیل نیست</h2><p>چند کار اضافه و تیک بزن، یا داده نمونه را بارگذاری کن تا نمودارها را ببینی.</p></div><div class="welcome-act"><button class="btn" data-act="load-sample">بارگذاری داده نمونه</button></div></div>` : ''}
  <section class="card score-card">
    <div class="score-ring">${ring(score / 100, 128, 10, 'acc')}<div class="ring-num"><b>${faNum(score)}</b><span>از ۱۰۰</span></div></div>
    <div class="score-body"><h2>امتیاز بهره‌وری</h2><p>${scoreText(score)}</p>
      <div class="score-parts">${parts.map(p => `<div class="sp"><span>${p[0]}</span><div class="sp-bar"><i style="width:${Math.round(p[1] * 100)}%"></i></div><b>${faPct(p[1] * 100)}</b></div>`).join('')}</div></div>
  </section>
  <div class="kpis">
    ${kpi('کار انجام‌شده', faNum(doneIn.length), deltaTxt)}
    ${kpi('نرخ تکمیل', faPct(compRate * 100), `${faNum(createdDone)} از ${faNum(created.length)} کار ساخته‌شده`)}
    ${kpi('زمان تمرکز', fmtHours(focusMin), `میانگین ${fmtHours(focusMin / R)} در روز`)}
    ${kpi('انجام به‌موقع', withDue.length ? faPct(onTimeRate * 100) : '—', `${faNum(onTime.length)} از ${faNum(withDue.length)} کار موعددار`)}
  </div>
  <div class="sgrid">
    <section class="card span2"><div class="card-h"><h3>روند ${weekly ? 'هفتگی' : 'روزانه'}</h3><div class="legend"><span><i style="background:var(--accent)"></i>انجام‌شده</span><span><i style="background:var(--muted)"></i>ساخته‌شده</span></div></div><div id="chTrend" class="chart-box"></div></section>
    <section class="card span2 insights"><div class="card-h"><h3>بینش‌ها</h3></div><ul class="ins">${ins.map(([ic, txt, cls]) => `<li class="${cls || ''}">${icon(ic)}<span>${txt}</span></li>`).join('')}</ul></section>
    <section class="card"><div class="card-h"><h3>روزهای هفته</h3><span class="muted">میانگین کار</span></div><div id="chWeekday" class="chart-box"></div></section>
    <section class="card"><div class="card-h"><h3>ساعت‌های طلایی</h3><span class="muted">ساعت تیک خوردن کارها</span></div><div id="chClock" class="chart-box clock-box"></div></section>
    <section class="card"><div class="card-h"><h3>پروژه‌ها</h3></div>${hbars(projRows)}</section>
    <section class="card"><div class="card-h"><h3>اولویت‌ها</h3></div>${stackBar(pri)}</section>
    <section class="card"><div class="card-h"><h3>زمان تمرکز</h3><span class="muted">${weekly ? 'دقیقه در هفته' : 'دقیقه در روز'}</span></div><div id="chFocus" class="chart-box"></div></section>
    <section class="card"><div class="card-h"><h3>هدف روزانه</h3><div class="legend"><span><i style="background:var(--accent)"></i>رسیده</span><span><i style="background:var(--h1)"></i>نرسیده</span></div></div><div id="chGoal" class="chart-box"></div></section>
    <section class="card span2"><div class="card-h"><h3>خلاصه ماه‌ها</h3></div><div class="table-wrap"><table class="tbl"><thead><tr><th scope="col">ماه</th><th scope="col">ساخته‌شده</th><th scope="col">انجام‌شده</th><th scope="col">میانگین روزانه</th><th scope="col">تمرکز</th><th scope="col">پربارترین روز</th></tr></thead><tbody>${mRows}</tbody></table></div></section>
  </div>`;
  return {
    html,
    mount() {
      lineChart($('#chTrend'), labels, [{ name: 'انجام‌شده', color: 'var(--accent)', values: sDone, area: true }, { name: 'ساخته‌شده', color: 'var(--muted)', values: sCre }], { tipLabels, label: 'روند کارهای انجام‌شده و ساخته‌شده' });
      const hiWd = wdAvg.indexOf(Math.max(...wdAvg));
      barChart($('#chWeekday'), WEEKDAYS.map((n, i) => ({ label: n, value: +wdAvg[i].toFixed(2), tip: `<b>${n}</b><span>میانگین ${faNum(wdAvg[i], 1)} کار</span>` })), { hi: doneIn.length ? hiWd : -1, int: false, allLabels: true, axisFmt: v => faNum(v, 1), height: 200, label: 'میانگین کار در روزهای هفته' });
      clockChart($('#chClock'), hours, { label: 'ساعت انجام کارها' });
      barChart($('#chFocus'), sFocus.map((v, i) => ({ label: labels[i], value: v, tip: `<b>${tipLabels[i]}</b><span>${fmtMin(v)}</span>` })), { height: 200, label: 'زمان تمرکز' });
      const g14 = Array.from({ length: 14 }, (_, i) => addDays(t0, i - 13));
      barChart($('#chGoal'), g14.map(k => { const v = allBy.get(k) || 0; return { label: fa(jOf(k).jd), value: v, cls: v >= goal ? '' : 'soft', tip: `<b>${fmtDate(k, { weekday: true })}</b><span>${faNum(v)} از ${faNum(goal)} کار${v >= goal ? '، هدف رسید' : ''}</span>` }; }), { goal, height: 200, allLabels: true, label: 'هدف روزانه در ۱۴ روز اخیر' });
    },
  };
}

/* ---------- نما: تنظیمات ---------- */
function viewSettings() {
  const st = S.settings, p = st.pomo, storageTxt = {
    cloud: 'کارهایت در حساب Claude تو ذخیره می‌شوند و فقط خودت آن‌ها را می‌بینی؛ در دستگاه‌های دیگر هم در دسترس‌اند.',
    connecting: 'در حال اتصال به فضای ذخیره‌سازی حساب…',
    local: 'کارهایت در حافظه همین مرورگر ذخیره می‌شوند. هر چند وقت یک بار پشتیبان بگیر.',
  }[Store.status];
  const num = (id, label, v, min, max, suf) => `<label class="field"><span>${label}</span><div class="num-in"><input id="${id}" type="number" inputmode="numeric" min="${min}" max="${max}" value="${v}"><em>${suf}</em></div></label>`;
  const html = `
  ${head('', 'تنظیمات', '')}
  <div class="settings">
    <section class="card set-sec"><h3>شخصی</h3>
      <label class="field"><span>نام تو</span><input id="sName" value="${esc(st.name)}" placeholder="برای خوشامدگویی" maxlength="30"></label>
      ${num('sGoal', 'هدف روزانه', st.dailyGoal, 1, 50, 'کار در روز')}
      <div class="field"><span>ظاهر</span><div class="seg">${[['light', 'سفید'], ['dark', 'تیره']].map(([v, n]) => `<button class="${st.theme === v ? 'on' : ''}" data-act="set-theme" data-v="${v}">${n}</button>`).join('')}</div></div>
    </section>
    <section class="card set-sec"><h3>تایمر تمرکز</h3>
      <div class="field-grid">${num('sWork', 'تمرکز', p.work, 1, 180, 'دقیقه')}${num('sShort', 'استراحت کوتاه', p.short, 1, 60, 'دقیقه')}${num('sLong', 'استراحت بلند', p.long, 1, 90, 'دقیقه')}${num('sEvery', 'استراحت بلند بعد از', p.every, 1, 12, 'جلسه')}</div>
      <label class="check-l"><input type="checkbox" id="sSound"${st.sound ? ' checked' : ''}>صدای پایان جلسه</label>
    </section>
    <section class="card set-sec"><div class="card-h"><h3>پروژه‌ها</h3><button class="btn sm" data-act="new-project">${icon('plus')}پروژه جدید</button></div>
      ${S.projects.length ? `<ul class="proj-list">${S.projects.map(x => { const n = allTasks().filter(t => t.projectId === x.id).length; return `<li><span class="pdot" style="background:var(--c${x.color})"></span><b>${esc(x.name)}</b><span class="muted">${faNum(n)} کار</span><button class="icon-btn sm" data-act="edit-project" data-pid="${x.id}" aria-label="ویرایش ${esc(x.name)}">${icon('edit')}</button></li>`; }).join('')}</ul>` : '<p class="empty-line">هنوز پروژه‌ای نساختی.</p>'}
    </section>
    <section class="card set-sec"><h3>داده‌ها</h3>
      <p class="sync-line">${syncBadge()}</p><p class="muted sm">${storageTxt}</p>
      <div class="btn-row"><button class="btn" data-act="export">${icon('download')}دریافت پشتیبان</button><button class="btn" data-act="import">${icon('upload')}بازیابی از فایل</button><input type="file" id="importFile" accept="application/json,.json" hidden></div>
      <div class="btn-row">${hasSample() ? `<button class="btn" data-act="remove-sample">حذف داده نمونه</button>` : `<button class="btn" data-act="load-sample">بارگذاری داده نمونه</button>`}<button class="btn danger ghost" data-act="clear-all">پاک کردن همه داده‌ها</button></div>
    </section>
    <section class="card set-sec span-all"><h3>میان‌برهای صفحه‌کلید</h3>${shortcutsTable()}</section>
  </div>`;
  return { html };
}
const SHORTCUTS = [['N', 'افزودن کار جدید'], ['Ctrl + K', 'جستجو'], ['1 … 5', 'رفتن به بخش‌های منو'], ['Space', 'شروع و توقف تایمر در بخش تمرکز'], ['Esc', 'بستن پنجره‌ها'], ['?', 'راهنمای میان‌برها']];
const shortcutsTable = () => `<table class="kbd-tbl"><tbody>${SHORTCUTS.map(([k, d]) => `<tr><td><kbd>${k}</kbd></td><td>${d}</td></tr>`).join('')}</tbody></table>`;

const VIEW_FN = { today: viewToday, upcoming: viewUpcoming, all: viewList, project: viewList, tag: viewList, board: viewBoard, calendar: viewCalendar, focus: viewFocus, activity: viewActivity, stats: viewStats, settings: viewSettings };

/* ---------- عملیات کار ---------- */
function toggleTask(id) {
  const t = S.tasks.get(id);
  if (!t) return;
  const wasDone = t.status === 'done', lv = levelOf(totalXP()).L;
  setStatus(t, wasDone ? 'todo' : 'done');
  if (UI.drawerId === id) renderDrawer();
  if (wasDone) { render(); return; }
  toast(`انجام شد، <b>+${faNum(taskXP(t))}</b> امتیاز${t.spawned ? '. تکرار بعدی: ' + relDate(S.tasks.get(t.spawned).due) : ''}`, { kind: 'good', undo: () => { const x = S.tasks.get(id); if (x) { setStatus(x, 'todo'); render(); if (UI.drawerId === id) renderDrawer(); } } });
  const row = $(`#main .task[data-id="${id}"]`);
  if (row && !matchMedia('(prefers-reduced-motion: reduce)').matches) { row.classList.add('completing'); setTimeout(render, 480); } else render();
  afterComplete(lv);
}
function afterComplete(lvBefore) {
  const t0 = todayKey(), all = allTasks(), goal = S.settings.dailyGoal || 5;
  const doneToday = all.filter(t => t.status === 'done' && t.completedAt && msKey(t.completedAt) === t0).length;
  const lv = levelOf(totalXP());
  if (lv.L > lvBefore) { setTimeout(() => toast(`${icon('trophy')}به سطح ${faNum(lv.L)} رسیدی: «${lv.title}»`, { kind: 'good', ms: 6000 }), 300); confetti(); return; }
  if (doneToday === goal) { setTimeout(() => toast(`${icon('target')}هدف امروز کامل شد: ${faNum(goal)} کار!`, { kind: 'good', ms: 5000 }), 300); confetti(); return; }
  if (UI.view === 'today' && !all.some(t => isOpen(t) && t.due && t.due <= t0)) { setTimeout(() => toast('همه کارهای امروز انجام شد!', { kind: 'good' }), 300); confetti(); }
}
function deleteTask(id) {
  const t = S.tasks.get(id);
  if (!t) return;
  const copy = clone(t);
  Store.dropTask(t);
  if (UI.drawerId === id) closeDrawer();
  render();
  toast(`«${esc(copy.title)}» حذف شد`, { undo: () => { Store.touchTask(normTask(copy)); render(); } });
}

/* ---------- کشوی ویرایش کار: موارد اصلی بالا، بقیه در «گزینه‌های بیشتر» ---------- */
const curTask = () => (UI.drawerId ? S.tasks.get(UI.drawerId) : null);
function dPatch(p) { const t = curTask(); if (!t) return; Object.assign(t, p); Store.touchTask(t); requestRender(); }
function openTask(id) {
  if (!S.tasks.get(id)) return;
  UI.drawerId = id;
  renderDrawer();
  $('#drawer').classList.add('open');
  $('#scrim').hidden = false;
  setTimeout(() => { const ti = $('#dTitle'); if (ti && !ti.value) ti.focus(); else $('#drawer .d-close') && $('#drawer .d-close').focus(); }, 60);
}
function closeDrawer() {
  UI.drawerId = null;
  $('#drawer').classList.remove('open');
  if (!$('#side').classList.contains('open')) $('#scrim').hidden = true;
  closeDP();
}
function renderDrawer() {
  const t = curTask();
  if (!t) { closeDrawer(); return; }
  const ae = document.activeElement, fid = ae && ae.id && $('#drawer').contains(ae) ? ae.id : null;
  const sd = t.subtasks.filter(s => s.done).length, allTags = topTags(30).map(x => x[0]);
  const prop = (ic, label, val) => `<div class="prop"><span class="prop-l">${icon(ic)}${label}</span><div class="prop-v">${val}</div></div>`;
  $('#drawer').innerHTML = `
    <header class="d-head"><span class="muted sm">${t.status === 'done' ? 'انجام‌شده' : t.status === 'doing' ? 'در حال انجام' : 'کار'}</span><button class="icon-btn d-close" data-act="d-close" aria-label="بستن">${icon('x')}</button></header>
    <div class="d-body">
      <div class="d-title-row"><button class="check big pri-${t.priority}${t.status === 'done' ? ' is-done' : ''}" data-act="d-status" data-v="${t.status === 'done' ? 'todo' : 'done'}" aria-label="${t.status === 'done' ? 'برگرداندن به باز' : 'علامت انجام شد'}">${icon('check')}</button>
        <textarea id="dTitle" class="d-title" rows="1" placeholder="عنوان کار" aria-label="عنوان کار">${esc(t.title)}</textarea></div>
      <div class="props">
        ${prop('calendar', 'تاریخ', `<button class="date-btn" data-act="d-date">${t.due ? fmtDate(t.due, { weekday: true }) : '<span class="muted">انتخاب تاریخ</span>'}</button>${t.due ? `<button class="icon-btn sm" data-act="d-date-clear" aria-label="حذف تاریخ" title="حذف تاریخ">${icon('x')}</button>` : ''}`)}
        ${prop('flag', 'اولویت', `<div class="seg pri-seg">${[0, 1, 2, 3, 4].map(v => `<button class="${t.priority === v ? 'on' : ''} p${v}" data-act="d-pri" data-v="${v}"><i></i>${PRI[v].short}</button>`).join('')}</div>`)}
        ${prop('folder', 'پروژه', `<select id="dProject" aria-label="پروژه"><option value="">بدون پروژه</option>${S.projects.map(p => `<option value="${p.id}"${t.projectId === p.id ? ' selected' : ''}>${esc(p.name)}</option>`).join('')}</select>`)}
      </div>
      <textarea id="dNotes" class="d-notes" rows="3" placeholder="یادداشت…" aria-label="یادداشت">${esc(t.notes)}</textarea>
      <div class="d-subs">
        <div class="d-sub-h"><span>زیرکارها</span>${t.subtasks.length ? `<small>${fa(sd)} از ${fa(t.subtasks.length)}</small>` : ''}</div>
        ${t.subtasks.length ? `<div class="sub-prog"><i style="width:${(sd / t.subtasks.length) * 100}%"></i></div>` : ''}
        <ul class="subs">${t.subtasks.map(s => `<li class="${s.done ? 'done' : ''}"><button class="check sm" data-act="d-sub-toggle" data-sid="${s.id}" aria-label="${s.done ? 'برداشتن تیک' : 'تیک زدن'}">${icon('check')}</button><span>${esc(s.title)}</span><button class="icon-btn sm" data-act="d-sub-del" data-sid="${s.id}" aria-label="حذف زیرکار">${icon('x')}</button></li>`).join('')}</ul>
        <label class="sub-add">${icon('plus')}<input id="dSubIn" placeholder="افزودن زیرکار"></label>
      </div>
      <details class="more" id="dMore"${UI.dMore ? ' open' : ''}><summary>${icon('chevL')}گزینه‌های بیشتر</summary>
        <div class="props">
          ${prop('list', 'وضعیت', `<div class="seg">${Object.entries(STATUS).map(([v, n]) => `<button class="${t.status === v ? 'on' : ''}" data-act="d-status" data-v="${v}">${n}</button>`).join('')}</div>`)}
          ${prop('clock', 'ساعت', `<input id="dTime" type="time" value="${t.time || ''}" aria-label="ساعت">`)}
          ${prop('repeat', 'تکرار', `<select id="dRecur" aria-label="تکرار"><option value="">بدون تکرار</option>${Object.entries(RECUR).map(([v, n]) => `<option value="${v}"${t.recur === v ? ' selected' : ''}>${n}</option>`).join('')}</select>`)}
          ${prop('timer', 'زمان تخمینی', `<div class="num-in"><input id="dEst" type="number" inputmode="numeric" min="0" step="5" value="${t.estimate || ''}" placeholder="۰" aria-label="زمان تخمینی"><em>دقیقه</em></div>`)}
          ${prop('sparkle', 'برچسب‌ها', `<div class="tags-in">${t.tags.map(g => `<span class="chip">#${esc(g)}<button class="chip-x" data-act="d-tag-del" data-tag="${esc(g)}" aria-label="حذف برچسب ${esc(g)}">${icon('x')}</button></span>`).join('')}<input id="dTagIn" list="tagList" placeholder="برچسب + Enter" aria-label="افزودن برچسب"><datalist id="tagList">${allTags.filter(g => !t.tags.includes(g)).map(g => `<option value="${esc(g)}">`).join('')}</datalist></div>`)}
        </div>
      </details>
      <p class="d-info">ساخته‌شده ${fmtDate(msKey(t.createdAt))}${t.completedAt ? `، انجام‌شده ${fmtDate(msKey(t.completedAt))} ساعت ${fmtClock(t.completedAt)}` : ''}${t.focus ? `، ${fmtMin(t.focus)} تمرکز` : ''}</p>
    </div>
    <footer class="d-foot">
      ${t.status !== 'done' ? `<button class="btn primary" data-act="d-focus">${icon('play', 'fill')}شروع تمرکز</button>` : ''}
      <button class="icon-btn" data-act="d-dup" title="تکثیر" aria-label="تکثیر">${icon('copy')}</button><span class="grow"></span>
      <button class="btn danger ghost" data-act="d-del">${icon('trash')}حذف</button>
    </footer>`;
  autoGrow($('#dTitle'));
  if (fid) { const el = document.getElementById(fid); el && el.focus(); }
}
function autoGrow(el) { if (!el) return; el.style.height = 'auto'; el.style.height = el.scrollHeight + 'px'; }
function dStatus(v) {
  const t = curTask();
  if (!t) return;
  const lv = levelOf(totalXP()).L, was = t.status;
  setStatus(t, v);
  renderDrawer();
  render();
  if (v === 'done' && was !== 'done') { toast(`انجام شد، <b>+${faNum(taskXP(t))}</b> امتیاز`, { kind: 'good' }); afterComplete(lv); }
}
function dupTask() {
  const t = curTask();
  if (!t) return;
  const n = newTask({ title: t.title + ' (کپی)', notes: t.notes, projectId: t.projectId, tags: [...t.tags], priority: t.priority, due: t.due, time: t.time, recur: t.recur, estimate: t.estimate, subtasks: t.subtasks.map(s => ({ id: uid('s'), title: s.title, done: false })) });
  render();
  openTask(n.id);
  toast('یک نسخه از کار ساخته شد.');
}
function addTag(v) {
  const t = curTask(), g = v.trim().replace(/^[#@]/, '').replace(/\s+/g, ' ');
  if (!t || !g) return;
  if (!t.tags.includes(g)) { t.tags.push(g); dPatch({}); }
  renderDrawer();
  $('#dTagIn') && $('#dTagIn').focus();
}
function addSub(v) {
  const t = curTask(), s = v.trim();
  if (!t || !s) return;
  t.subtasks.push({ id: uid('s'), title: s, done: false });
  dPatch({});
  renderDrawer();
  $('#dSubIn') && $('#dSubIn').focus();
}

/* ---------- انتخابگر تاریخ شمسی ---------- */
const DP = { jy: 0, jm: 0, sel: null, cb: null, anchor: null };
function openDP(anchor, sel, cb) {
  const j = jOf(sel || todayKey());
  Object.assign(DP, { jy: j.jy, jm: j.jm, sel, cb, anchor });
  renderDP();
  $('#dp').hidden = false;
  placeDP();
}
function renderDP() {
  const t0 = todayKey(), first = keyFromJ(DP.jy, DP.jm, 1), len = jMonthLen(DP.jy, DP.jm);
  let cells = '';
  for (let i = 0; i < wdOf(first); i++) cells += '<span></span>';
  for (let d = 1; d <= len; d++) {
    const k = addDays(first, d - 1);
    cells += `<button class="dp-d${k === t0 ? ' today' : ''}${k === DP.sel ? ' sel' : ''}${wdOf(k) === 6 ? ' fri' : ''}" data-act="dp-pick" data-k="${k}" aria-label="${fmtDate(k, { weekday: true })}">${fa(d)}</button>`;
  }
  let sat = addDays(t0, 1);
  while (wdOf(sat) !== 0) sat = addDays(sat, 1);
  $('#dp').innerHTML = `<div class="dp-quick">${[['امروز', t0], ['فردا', addDays(t0, 1)], ['شنبه آینده', sat], ['هفته بعد', addDays(t0, 7)]].map(([n, k]) => `<button data-act="dp-pick" data-k="${k}"><span>${n}</span><small>${fmtDate(k, { year: false })}</small></button>`).join('')}</div>
    <div class="dp-head"><button class="icon-btn sm" data-act="dp-prev" aria-label="ماه قبل">${icon('chevR')}</button><b>${J_MONTHS[DP.jm - 1]} ${fa(DP.jy)}</b><button class="icon-btn sm" data-act="dp-next" aria-label="ماه بعد">${icon('chevL')}</button></div>
    <div class="dp-grid">${WD_SHORT.map((w, i) => `<span class="dp-wd${i === 6 ? ' fri' : ''}">${w}</span>`).join('')}${cells}</div>
    <button class="link sm dp-none" data-act="dp-none">بدون تاریخ</button>`;
}
function placeDP() {
  const el = $('#dp'), r = DP.anchor.getBoundingClientRect(), w = el.offsetWidth, h = el.offsetHeight;
  let left = r.right - w, top = r.bottom + 6;
  left = clamp(left, 8, window.innerWidth - w - 8);
  if (top + h > window.innerHeight - 8) top = Math.max(8, r.top - h - 6);
  el.style.left = left + 'px';
  el.style.top = top + 'px';
}
function closeDP() { const el = $('#dp'); if (el) el.hidden = true; DP.cb = null; }

/* ---------- پنجره‌ها ---------- */
let modalOk = null;
function openModal(html, cls = '') {
  const m = $('#modal');
  m.innerHTML = `<div class="modal ${cls}" role="dialog" aria-modal="true">${html}</div>`;
  m.hidden = false;
  setTimeout(() => { const f = m.querySelector('[autofocus]') || m.querySelector('input,select,textarea,button'); f && f.focus(); }, 40);
}
function closeModal() { const m = $('#modal'); m.hidden = true; m.innerHTML = ''; modalOk = null; }
function confirmBox(title, text, okLabel, fn) {
  openModal(`<h2>${title}</h2><p>${text}</p><div class="m-foot"><span class="grow"></span><button class="btn" data-act="m-close">انصراف</button><button class="btn danger" data-act="m-ok" autofocus>${okLabel}</button></div>`, 'sm');
  modalOk = fn;
}
function projectModal(id) {
  const p = id ? proj(id) : null;
  const used = new Set(S.projects.map(x => x.color));
  UI.pm = { id, color: p ? p.color : ([0, 1, 2, 3, 4, 5, 6, 7].find(c => !used.has(c)) ?? S.projects.length % 8) };
  openModal(`<h2>${p ? 'ویرایش پروژه' : 'پروژه جدید'}</h2>
    <label class="field"><span>نام</span><input id="pmName" value="${p ? esc(p.name) : ''}" placeholder="مثلاً دانشگاه" maxlength="40" autofocus></label>
    <div class="field"><span>رنگ</span><div class="swatches">${Array.from({ length: 8 }, (_, c) => `<button class="sw-btn${c === UI.pm.color ? ' on' : ''}" data-act="pm-color" data-c="${c}" style="background:var(--c${c})" aria-label="رنگ ${fa(c + 1)}"></button>`).join('')}</div></div>
    <div class="m-foot">${p ? '<button class="btn danger ghost" data-act="pm-del">حذف پروژه</button>' : ''}<span class="grow"></span><button class="btn" data-act="m-close">انصراف</button><button class="btn primary" data-act="pm-save">ذخیره</button></div>`, 'sm');
}
function saveProject() {
  const name = ($('#pmName').value || '').trim();
  if (!name) { $('#pmName').focus(); toast('یک نام برای پروژه بنویس.', { kind: 'bad' }); return; }
  let id = UI.pm.id;
  if (id) Object.assign(proj(id), { name, color: UI.pm.color });
  else { id = uid('p'); S.projects.push({ id, name, color: UI.pm.color }); }
  Store.touchMeta();
  closeModal();
  if (!UI.pm.id) go('project', { projectId: id }); else render();
  toast(UI.pm.id ? 'پروژه به‌روز شد.' : `پروژه «${esc(name)}» ساخته شد.`);
}
function deleteProject(id) {
  const p = proj(id);
  if (!p) return;
  const n = allTasks().filter(t => t.projectId === id).length;
  confirmBox('حذف پروژه', `پروژه «${esc(p.name)}» حذف می‌شود. ${n ? `${faNum(n)} کارِ آن بدون پروژه می‌مانند و پاک نمی‌شوند.` : ''}`, 'حذف پروژه', () => {
    allTasks().forEach(t => { if (t.projectId === id) { t.projectId = null; Store.touchTask(t); } });
    S.projects = S.projects.filter(x => x.id !== id);
    Store.touchMeta();
    if (UI.view === 'project' && UI.projectId === id) go('all'); else render();
    toast('پروژه حذف شد.');
  });
}
function quickHelp() {
  const rows = [
    ['فردا، پس‌فردا، هفته بعد، شنبه … جمعه', 'تاریخ'], ['۱۲ آبان یا 8/12', 'تاریخ شمسی'], ['ساعت ۱۸، ساعت ۶ عصر، 18:30', 'ساعت'],
    ['!فوری، !بالا، !متوسط، !کم', 'اولویت'], ['#نام_پروژه', 'پروژه'], ['@برچسب', 'برچسب'], ['~30', 'زمان تخمینی (دقیقه)'], ['هر روز، هر هفته، هر ماه', 'تکرار'],
  ];
  openModal(`<h2>نوشتن سریع</h2><p class="muted">لازم نیست چیزی را انتخاب کنی؛ کافی است بنویسی. این کلمه‌ها خودکار تشخیص داده می‌شوند:</p>
    <table class="kbd-tbl"><tbody>${rows.map(([a, b]) => `<tr><td><code>${a}</code></td><td>${b}</td></tr>`).join('')}</tbody></table>
    <p class="example">مثال: <code>تحویل گزارش پنج‌شنبه ساعت ۱۰ #کار !فوری</code></p>
    <div class="m-foot"><span class="grow"></span><button class="btn primary" data-act="m-close">فهمیدم</button></div>`);
}
function shortcutsModal() { openModal(`<h2>میان‌برهای صفحه‌کلید</h2>${shortcutsTable()}<div class="m-foot"><span class="grow"></span><button class="btn primary" data-act="m-close">بستن</button></div>`, 'sm'); }

/* ---------- پشتیبان، داده نمونه ---------- */
async function exportData() {
  const data = JSON.stringify(Object.assign({ app: 'roozngar', exportedAt: new Date().toISOString() }, Store.serialize()));
  const filename = `roozngar-${todayKey()}.json`;
  const c = window.claude;
  if (c && typeof c.use === 'function') {
    try {
      const dl = await c.use('downloads');
      if (dl) { await dl.save({ filename, data }); toast('فایل پشتیبان آماده شد.'); return; }
    } catch (e) { if (e && e.code === 'declined') return; }
    openModal(`<h2>پشتیبان داده‌ها</h2><p class="muted">دریافت مستقیم فایل این‌جا در دسترس نیست. این متن را کپی کن و در فایلی با پسوند json نگه دار.</p><textarea class="mono" readonly rows="8" id="expText">${esc(data)}</textarea><div class="m-foot"><span class="grow"></span><button class="btn" data-act="m-close">بستن</button><button class="btn primary" data-act="copy-export">${icon('copy')}کپی</button></div>`);
    return;
  }
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([data], { type: 'application/json' }));
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
}
function copyText(el) {
  if (!el) return;
  const done = () => toast('کپی شد.');
  const fallback = () => { el.focus(); el.select(); try { document.execCommand('copy'); done(); } catch (e) { toast('متن انتخاب شد؛ با Ctrl+C کپی کن.'); } };
  try { navigator.clipboard.writeText(el.value).then(done, fallback); } catch (e) { fallback(); }
}
function importFile(file) {
  const fr = new FileReader();
  fr.onload = () => {
    let d;
    try { d = JSON.parse(fr.result); } catch (e) { toast('این فایل، پشتیبان معتبر روزنگار نیست.', { kind: 'bad' }); return; }
    if (!d || !Array.isArray(d.tasks)) { toast('در این فایل کاری پیدا نشد.', { kind: 'bad' }); return; }
    UI.importData = d;
    openModal(`<h2>بازیابی از پشتیبان</h2><p>${faNum(d.tasks.length)} کار و ${faNum((d.projects || []).length)} پروژه در فایل هست. با داده‌های فعلی ادغام شود یا همه را جایگزین کند؟</p>
      <div class="m-foot"><span class="grow"></span><button class="btn" data-act="m-close">انصراف</button><button class="btn" data-act="import-merge">ادغام</button><button class="btn danger" data-act="import-replace">جایگزینی کامل</button></div>`, 'sm');
  };
  fr.readAsText(file);
}
function wipeAll() {
  const bs = new Set(allTasks().map(bucketOf));
  S.tasks = new Map();
  S.projects = [];
  S.focusLog = {};
  S.focusSample = {};
  bs.forEach(b => Store.dirty.add(b));
  Store.touchMeta();
}
function applyImport(replace) {
  const d = UI.importData;
  if (!d) return;
  if (replace) wipeAll();
  d.tasks.forEach(t => { if (t && t.id && typeof t.title === 'string' && !S.tasks.has(t.id)) Store.touchTask(normTask(t)); });
  (d.projects || []).forEach(p => { if (p && p.id && !proj(p.id)) S.projects.push(p); });
  if (replace) {
    if (d.settings) S.settings = Object.assign(clone(DEFAULT_SETTINGS), d.settings, { pomo: Object.assign(clone(DEFAULT_SETTINGS.pomo), d.settings.pomo || {}) });
    S.focusLog = d.focusLog || {};
    S.focusSample = d.focusSample || {};
  } else {
    for (const [k, v] of Object.entries(d.focusLog || {})) S.focusLog[k] = Math.max(S.focusLog[k] || 0, v);
  }
  UI.importData = null;
  Store.touchMeta();
  closeModal();
  applyTheme();
  render();
  toast('داده‌ها بازیابی شد.');
}
function loadSample() {
  if (hasSample()) removeSample(true);
  const d = buildSample();
  S.projects.push(...d.projects);
  d.tasks.forEach(t => S.tasks.set(t.id, t));
  S.focusSample = d.focus;
  S.settings.welcomed = true;
  Store.touchAll();
  render();
  toast('داده نمونه بارگذاری شد. بخش گزارش را ببین!', { kind: 'good' });
  confetti();
}
function removeSample(quiet) {
  const ids = new Set(S.projects.filter(p => p.sample).map(p => p.id));
  for (const t of allTasks()) {
    if (t.sample) Store.dropTask(t);
    else if (ids.has(t.projectId)) { t.projectId = null; Store.touchTask(t); }
  }
  S.projects = S.projects.filter(p => !p.sample);
  S.focusSample = {};
  Store.touchMeta();
  if (quiet === true) return;
  if (UI.view === 'project' && ids.has(UI.projectId)) UI.view = 'today';
  render();
  toast('داده‌های نمونه حذف شد.');
}

/* ---------- جستجو و فرمان‌ها ---------- */
const Pal = { sel: 0, items: [] };
function openPalette() {
  const p = $('#palette');
  p.innerHTML = `<div class="modal pal" role="dialog" aria-modal="true" aria-label="جستجو"><label class="pal-in">${icon('search')}<input id="palIn" placeholder="جستجوی کار یا بخش…" autocomplete="off"></label><div id="palList" class="pal-list" role="listbox"></div></div>`;
  p.hidden = false;
  updatePalette();
  $('#palIn').focus();
}
function closePalette() { $('#palette').hidden = true; }
function updatePalette() {
  const q = normFa(($('#palIn') || {}).value || '').trim();
  const cmds = [
    { label: 'کار جدید', icon: 'plus', run: focusQuickAdd },
    ...VIEWS.map(v => ({ label: v.name, icon: v.icon, run: () => go(v.id) })),
    { label: 'شروع تایمر تمرکز', icon: 'timer', run: () => { go('focus'); Timer.start(); } },
    { label: 'تغییر پوسته روشن و تیره', icon: 'moon', run: cycleTheme },
    { label: 'پروژه جدید', icon: 'folder', run: () => projectModal(null) },
    ...S.projects.map(p => ({ label: 'پروژه ' + p.name, icon: 'folder', run: () => go('project', { projectId: p.id }) })),
    ...topTags(12).map(([g]) => ({ label: 'برچسب #' + g, icon: 'sparkle', run: () => go('tag', { tag: g }) })),
  ];
  let items = cmds.slice(0, 13);
  if (q) {
    const tasks = allTasks().filter(t => normFa(t.title + ' ' + t.tags.join(' ') + ' ' + t.notes).includes(q))
      .sort((a, b) => (a.status === 'done') - (b.status === 'done') || b.createdAt - a.createdAt).slice(0, 8)
      .map(t => ({ label: t.title, sub: t.status === 'done' ? 'انجام‌شده' : t.due ? relDate(t.due) : '', icon: t.status === 'done' ? 'check' : 'list', run: () => openTask(t.id) }));
    items = [...tasks, ...cmds.filter(c => normFa(c.label).includes(q))];
  }
  Pal.items = items;
  Pal.sel = 0;
  paintPal();
}
function paintPal() {
  $('#palList').innerHTML = Pal.items.length ? Pal.items.map((it, i) => `<button class="pal-i${i === Pal.sel ? ' on' : ''}" data-act="pal-run" data-i="${i}" role="option" aria-selected="${i === Pal.sel}">${icon(it.icon)}<span class="pal-l">${esc(it.label)}</span>${it.sub ? `<small>${it.sub}</small>` : ''}</button>`).join('') : '<p class="empty-line">چیزی پیدا نشد.</p>';
  const on = $('#palList .pal-i.on');
  on && on.scrollIntoView({ block: 'nearest' });
}
function runPal(i) { const it = Pal.items[i]; closePalette(); if (it) it.run(); }

/* ---------- پوسته ---------- */
/* پوسته پیش‌فرض سفید است؛ حالت تیره فقط با انتخاب خود کاربر روشن می‌شود */
function applyTheme() { document.documentElement.classList.toggle('dark', S.settings.theme === 'dark'); }
function cycleTheme() {
  S.settings.theme = S.settings.theme === 'dark' ? 'light' : 'dark';
  Store.touchMeta();
  applyTheme();
  render();
}

/* ---------- تایمر تمرکز ---------- */
const TIMER_KEY = 'roozngar:timer';
const Timer = {
  mode: 'work', running: false, endAt: 0, left: 0, taskId: null, cycles: 0, segStart: 0, acc: 0, iv: 0,
  dur(m = this.mode) { const p = S.settings.pomo; return Math.max(1, m === 'work' ? p.work : m === 'short' ? p.short : p.long) * 60000; },
  load() {
    try { const d = JSON.parse(localStorage.getItem(TIMER_KEY)); if (d) Object.assign(this, d); } catch (e) { /* */ }
    if (!this.left) this.left = this.dur();
    if (this.running) { if (Date.now() >= this.endAt) this.finish(); else this.tick(); }
  },
  save() {
    try { const { mode, running, endAt, left, taskId, cycles, segStart, acc } = this; localStorage.setItem(TIMER_KEY, JSON.stringify({ mode, running, endAt, left, taskId, cycles, segStart, acc })); } catch (e) { /* */ }
  },
  remaining() { return this.running ? Math.max(0, this.endAt - Date.now()) : this.left; },
  start() {
    if (this.running) return;
    audioUnlock();
    this.running = true;
    this.endAt = Date.now() + this.left;
    this.segStart = Date.now();
    this.tick();
    this.save();
    paintTimer(true);
  },
  pause() {
    if (!this.running) return;
    this.left = this.remaining();
    this.running = false;
    this.credit(Date.now());
    this.stop();
    this.save();
    paintTimer(true);
  },
  credit(until) {
    if (this.mode !== 'work' || !this.segStart) { this.segStart = 0; return; }
    this.acc += Math.max(0, until - this.segStart);
    this.segStart = 0;
    const m = Math.floor(this.acc / 60000);
    if (m > 0) { this.acc -= m * 60000; logFocus(m, this.taskId); }
  },
  reset() {
    if (this.running) this.credit(Date.now());
    this.running = false;
    this.left = this.dur();
    this.stop();
    this.save();
    paintTimer(true);
  },
  setMode(m) {
    if (this.running) this.credit(Date.now());
    this.mode = m;
    this.running = false;
    this.left = this.dur(m);
    this.stop();
    this.save();
    render();
  },
  skip() { if (this.running) this.credit(Date.now()); this.advance(false); },
  advance(completed) {
    if (this.mode === 'work') { if (completed) this.cycles++; this.mode = completed && this.cycles % S.settings.pomo.every === 0 ? 'long' : 'short'; }
    else this.mode = 'work';
    this.running = false;
    this.left = this.dur();
    this.stop();
    this.save();
    if (UI.view === 'focus') render(); else paintTimer(true);
  },
  finish() {
    const wasWork = this.mode === 'work';
    if (wasWork) this.credit(this.endAt);
    beep();
    toast(wasWork ? `جلسه تمرکز تمام شد و ${faNum(S.settings.pomo.work)} دقیقه ثبت شد. وقت استراحت است.` : 'استراحت تمام شد. آماده جلسه بعدی هستی؟', { kind: 'good', ms: 7000 });
    this.advance(wasWork);
  },
  tick() { this.stop(); this.iv = setInterval(() => { if (this.remaining() <= 0) this.finish(); else paintTimer(); }, 250); },
  stop() { clearInterval(this.iv); this.iv = 0; },
};
function logFocus(m, taskId) {
  const k = todayKey();
  S.focusLog[k] = (S.focusLog[k] || 0) + m;
  Store.touchMeta();
  const t = taskId && S.tasks.get(taskId);
  if (t) { t.focus = (t.focus || 0) + m; Store.touchTask(t); }
}
let lastBtn = '';
function paintTimer(force) {
  const ms = Timer.remaining(), sec = Math.ceil(ms / 1000), txt = fa(pad(Math.floor(sec / 60)) + ':' + pad(sec % 60));
  const d = $('#tmDigits');
  if (d) d.textContent = txt;
  const arc = $('#tmArc');
  if (arc) arc.style.strokeDashoffset = (+arc.dataset.c * (1 - ms / Timer.dur())).toFixed(1);
  const b = $('#tmStart'), state = Timer.running ? 'run' : Timer.left < Timer.dur() ? 'resume' : 'start';
  if (b && (force || state !== lastBtn)) b.innerHTML = state === 'run' ? icon('pause') + '<span>توقف</span>' : icon('play', 'fill') + `<span>${state === 'resume' ? 'ادامه' : 'شروع'}</span>`;
  lastBtn = state;
  const st = $('#sideTimer');
  if (st) { st.hidden = !Timer.running; if (Timer.running) st.innerHTML = icon('timer') + `<span>${TM_NAMES[Timer.mode]}</span><b>${txt}</b>`; }
}
let audioCtx = null;
function audioUnlock() { try { if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)(); if (audioCtx.state === 'suspended') audioCtx.resume(); } catch (e) { /* */ } }
function beep() {
  if (!S.settings.sound || !audioCtx) return;
  try {
    [0, 0.22, 0.44].forEach((d, i) => {
      const o = audioCtx.createOscillator(), g = audioCtx.createGain(), t = audioCtx.currentTime + d;
      o.frequency.value = [523, 659, 784][i];
      o.type = 'sine';
      o.connect(g); g.connect(audioCtx.destination);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.16, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);
      o.start(t); o.stop(t + 0.38);
    });
  } catch (e) { /* */ }
}

/* ---------- اعلان‌ها و جشن ---------- */
function toast(msg, o = {}) {
  const el = document.createElement('div');
  el.className = 'toast' + (o.kind ? ' ' + o.kind : '');
  el.setAttribute('role', 'status');
  el.innerHTML = `<span class="toast-msg">${msg}</span>${o.undo ? '<button class="toast-btn">بازگردانی</button>' : ''}`;
  if (o.undo) el.querySelector('button').onclick = () => { o.undo(); el.remove(); };
  const box = $('#toasts');
  box.appendChild(el);
  while (box.children.length > 3) box.firstElementChild.remove();
  const ms = o.ms || (o.undo ? 5500 : 3800);
  setTimeout(() => el.classList.add('out'), ms);
  setTimeout(() => el.remove(), ms + 300);
}
function confetti() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const c = $('#confetti'), ctx = c.getContext('2d'), dpr = window.devicePixelRatio || 1, W = window.innerWidth, H = window.innerHeight;
  c.width = W * dpr; c.height = H * dpr; c.hidden = false;
  ctx.scale(dpr, dpr);
  const cs = getComputedStyle(document.documentElement);
  const colors = ['--h2', '--h3', '--accent', '--c0', '--c2', '--c3', '--c4'].map(v => cs.getPropertyValue(v).trim() || '#4f9d76');
  const P = Array.from({ length: 120 }, () => ({ x: W / 2 + (Math.random() - 0.5) * 240, y: H * 0.38, vx: (Math.random() - 0.5) * 13, vy: -Math.random() * 12 - 4, s: 5 + Math.random() * 5, r: Math.random() * 6, vr: (Math.random() - 0.5) * 0.3, c: colors[Math.floor(Math.random() * colors.length)] }));
  const t0 = performance.now();
  (function frame(t) {
    const dt = t - t0;
    ctx.clearRect(0, 0, W, H);
    P.forEach(p => {
      p.vy += 0.34; p.vx *= 0.99; p.x += p.vx; p.y += p.vy; p.r += p.vr;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.globalAlpha = Math.max(0, 1 - dt / 1900); ctx.fillStyle = p.c; ctx.beginPath(); ctx.arc(0, 0, p.s / 2, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    });
    if (dt < 1900) requestAnimationFrame(frame); else { ctx.clearRect(0, 0, W, H); c.hidden = true; }
  })(t0);
}

/* ---------- منوی کناری موبایل ---------- */
function openSide() { $('#side').classList.add('open'); $('#scrim').hidden = false; }
function closeSide() { $('#side').classList.remove('open'); if (!UI.drawerId) $('#scrim').hidden = true; }
function closeTop() {
  if (!$('#dp').hidden) { closeDP(); return true; }
  if (!$('#palette').hidden) { closePalette(); return true; }
  if (!$('#modal').hidden) { closeModal(); return true; }
  if (UI.drawerId) { closeDrawer(); return true; }
  if ($('#side').classList.contains('open')) { closeSide(); return true; }
  return false;
}

/* ---------- رویدادها ---------- */
document.addEventListener('click', e => {
  const a = e.target.closest('[data-act]');
  if (!$('#dp').hidden && !e.target.closest('#dp') && !(a && a.dataset.act === 'd-date')) closeDP();
  if (e.target.id === 'modal') { closeModal(); return; }
  if (e.target.id === 'palette') { closePalette(); return; }
  if (e.target.id === 'scrim') { closeDrawer(); closeSide(); return; }
  if (!a) return;
  const act = a.dataset.act, host = a.closest('[data-id]'), id = host ? host.dataset.id : null;
  switch (act) {
    case 'nav': navGo(a.dataset.nav); break;
    case 'go': go(a.dataset.view); break;
    case 'go-project': go('project', { projectId: a.dataset.pid }); break;
    case 'go-tag': go('tag', { tag: a.dataset.tag }); break;
    case 'toggle': toggleTask(id); break;
    case 'open': openTask(id); break;
    case 'del': deleteTask(id); break;
    case 'focus-task': Timer.taskId = id; Timer.save(); go('focus'); break;
    case 'side-open': openSide(); break;
    case 'side-close': closeSide(); break;
    case 'palette': openPalette(); break;
    case 'new-project': projectModal(null); break;
    case 'edit-project': projectModal(a.dataset.pid); break;
    case 'pm-color': UI.pm.color = +a.dataset.c; $$('.sw-btn').forEach(b => b.classList.toggle('on', b === a)); break;
    case 'pm-save': saveProject(); break;
    case 'pm-del': deleteProject(UI.pm.id); break;
    case 'm-close': closeModal(); break;
    case 'm-ok': { const f = modalOk; closeModal(); if (f) f(); break; }
    case 'load-sample': loadSample(); break;
    case 'remove-sample': confirmBox('حذف داده نمونه', 'کارها و پروژه‌های نمونه حذف می‌شوند. کارهایی که خودت ساخته‌ای سر جایشان می‌مانند.', 'حذف داده نمونه', removeSample); break;
    case 'dismiss-welcome': S.settings.welcomed = true; Store.touchMeta(); render(); focusQuickAdd(); break;
    case 'toggle-done-today': UI.showDoneToday = !UI.showDoneToday; saveUI(); render(); break;
    case 'move-overdue': moveOverdue(); break;
    case 'qa-help': quickHelp(); break;
    case 'qa-due-clear': UI.qaDue = null; updateQaChips(); break;
    case 'qa-day': UI.qaDue = a.dataset.k; window.scrollTo({ top: 0, behavior: 'smooth' }); updateQaChips(); $('#qaInput') && $('#qaInput').focus({ preventScroll: true }); break;
    case 'jump-day': { const k = a.dataset.k; if (k === todayKey()) go('today'); else { const s = document.getElementById('d-' + k); if (s) s.scrollIntoView({ behavior: 'smooth', block: 'start' }); } break; }
    case 'more': UI.limit += 80; render(); break;
    case 'f-status': UI.fStatus = a.dataset.v; UI.limit = 80; saveUI(); render(); break;
    case 'board-move': { const t = S.tasks.get(id); if (t) { const lv = levelOf(totalXP()).L, to = a.dataset.to; setStatus(t, to); render(); if (to === 'done') afterComplete(lv); } break; }
    case 'cal-prev': shiftCal(-1); break;
    case 'cal-next': shiftCal(1); break;
    case 'cal-today': { const j = jOf(todayKey()); UI.calY = j.jy; UI.calM = j.jm; UI.calSel = todayKey(); render(); break; }
    case 'cal-day': UI.calSel = a.dataset.k; render(); break;
    case 'act-range': UI.actRange = a.dataset.r; UI.actDay = null; render(); break;
    case 'act-metric': UI.actMetric = a.dataset.m; saveUI(); render(); break;
    case 'stats-range': UI.statsRange = +a.dataset.r; saveUI(); render(); break;
    case 'tm-toggle': if (Timer.running) Timer.pause(); else Timer.start(); break;
    case 'tm-reset': Timer.reset(); break;
    case 'tm-skip': Timer.skip(); break;
    case 'tm-mode': Timer.setMode(a.dataset.m); break;
    case 'set-theme': S.settings.theme = a.dataset.v; Store.touchMeta(); applyTheme(); render(); break;
    case 'export': exportData(); break;
    case 'import': $('#importFile').click(); break;
    case 'import-merge': applyImport(false); break;
    case 'import-replace': applyImport(true); break;
    case 'copy-export': copyText($('#expText')); break;
    case 'clear-all': confirmBox('پاک کردن همه داده‌ها', 'همه کارها، پروژه‌ها و سابقه تمرکز برای همیشه پاک می‌شوند. اگر لازم داری، اول پشتیبان بگیر.', 'پاک کردن همه', () => { wipeAll(); render(); toast('همه داده‌ها پاک شد.'); }); break;
    case 'pal-run': runPal(+a.dataset.i); break;
    case 'd-close': closeDrawer(); break;
    case 'd-status': dStatus(a.dataset.v); break;
    case 'd-pri': dPatch({ priority: +a.dataset.v }); renderDrawer(); break;
    case 'd-date': { const t = curTask(); if (t) openDP(a, t.due, k => { dPatch(k ? { due: k } : { due: null, time: null, recur: null }); renderDrawer(); }); break; }
    case 'd-date-clear': dPatch({ due: null, time: null, recur: null }); renderDrawer(); break;
    case 'd-sub-toggle': { const t = curTask(), s = t && t.subtasks.find(x => x.id === a.dataset.sid); if (s) { s.done = !s.done; dPatch({}); renderDrawer(); } break; }
    case 'd-sub-del': { const t = curTask(); if (t) { t.subtasks = t.subtasks.filter(x => x.id !== a.dataset.sid); dPatch({}); renderDrawer(); } break; }
    case 'd-tag-del': { const t = curTask(); if (t) { t.tags = t.tags.filter(g => g !== a.dataset.tag); dPatch({}); renderDrawer(); } break; }
    case 'd-del': deleteTask(UI.drawerId); break;
    case 'd-dup': dupTask(); break;
    case 'd-focus': Timer.taskId = UI.drawerId; Timer.save(); closeDrawer(); go('focus'); break;
    case 'dp-prev': DP.jm--; if (DP.jm < 1) { DP.jm = 12; DP.jy--; } renderDP(); break;
    case 'dp-next': DP.jm++; if (DP.jm > 12) { DP.jm = 1; DP.jy++; } renderDP(); break;
    case 'dp-pick': { const cb = DP.cb; closeDP(); if (cb) cb(a.dataset.k); break; }
    case 'dp-none': { const cb = DP.cb; closeDP(); if (cb) cb(null); break; }
  }
});
document.addEventListener('input', e => {
  const el = e.target;
  switch (el.id) {
    case 'qaInput': updateQaChips(); break;
    case 'fSearch': UI.fSearch = el.value; UI.limit = 80; requestRender(); break;
    case 'dTitle': autoGrow(el); dPatch({ title: el.value.replace(/\n/g, ' ') }); break;
    case 'dNotes': dPatch({ notes: el.value }); break;
    case 'palIn': updatePalette(); break;
  }
});
document.addEventListener('toggle', e => { if (e.target.id === 'dMore') UI.dMore = e.target.open; }, true);
document.addEventListener('change', e => {
  const el = e.target, t = curTask();
  const pomo = { sWork: 'work', sShort: 'short', sLong: 'long', sEvery: 'every' };
  switch (el.id) {
    case 'fProject': UI.fProject = el.value; render(); break;
    case 'fSort': UI.sort = el.value; saveUI(); render(); break;
    case 'fBoard': UI.boardProject = el.value; saveUI(); render(); break;
    case 'dProject': dPatch({ projectId: el.value || null }); break;
    case 'dTime': if (t) { dPatch({ time: el.value || null, due: t.due || (el.value ? todayKey() : null) }); renderDrawer(); } break;
    case 'dRecur': if (t) { dPatch({ recur: el.value || null, due: t.due || (el.value ? todayKey() : null) }); renderDrawer(); } break;
    case 'dEst': dPatch({ estimate: Math.max(0, Math.round(+toEn(el.value) || 0)) }); break;
    case 'tmTask': Timer.taskId = el.value || null; Timer.save(); render(); break;
    case 'sName': S.settings.name = el.value.trim().slice(0, 30); Store.touchMeta(); break;
    case 'sGoal': S.settings.dailyGoal = clamp(Math.round(+toEn(el.value)) || 5, 1, 50); el.value = S.settings.dailyGoal; Store.touchMeta(); break;
    case 'sWork': case 'sShort': case 'sLong': case 'sEvery': {
      const key = pomo[el.id];
      S.settings.pomo[key] = clamp(Math.round(+toEn(el.value)) || 1, 1, key === 'every' ? 12 : 180);
      el.value = S.settings.pomo[key];
      Store.touchMeta();
      if (!Timer.running) { Timer.left = Timer.dur(); Timer.save(); }
      break;
    }
    case 'sSound': S.settings.sound = el.checked; Store.touchMeta(); break;
    case 'importFile': if (el.files && el.files[0]) importFile(el.files[0]); el.value = ''; break;
  }
});
document.addEventListener('submit', e => { if (e.target.id === 'qaForm') { e.preventDefault(); submitQuick(); } });
document.addEventListener('keydown', e => {
  const el = e.target, tag = (el.tagName || '').toLowerCase();
  const typing = tag === 'input' || tag === 'textarea' || tag === 'select' || el.isContentEditable;
  if (e.key === 'Enter' && !e.isComposing) {
    if (el.id === 'dTagIn') { e.preventDefault(); addTag(el.value); return; }
    if (el.id === 'dSubIn') { e.preventDefault(); addSub(el.value); return; }
    if (el.id === 'pmName') { e.preventDefault(); saveProject(); return; }
    if (el.id === 'dTitle') { e.preventDefault(); el.blur(); return; }
    if (el.classList && el.classList.contains('t-body')) { e.preventDefault(); openTask(el.closest('[data-id]').dataset.id); return; }
  }
  if (!$('#palette').hidden) {
    if (e.key === 'ArrowDown') { e.preventDefault(); Pal.sel = Math.min(Pal.items.length - 1, Pal.sel + 1); paintPal(); return; }
    if (e.key === 'ArrowUp') { e.preventDefault(); Pal.sel = Math.max(0, Pal.sel - 1); paintPal(); return; }
    if (e.key === 'Enter') { e.preventDefault(); runPal(Pal.sel); return; }
  }
  if ((e.ctrlKey || e.metaKey) && e.code === 'KeyK') { e.preventDefault(); openPalette(); return; }
  if (e.key === 'Escape') { if (closeTop()) e.preventDefault(); else if (typing) el.blur(); return; }
  if (typing || e.ctrlKey || e.metaKey || e.altKey) return;
  if (!$('#modal').hidden || !$('#palette').hidden) return;
  if (e.code === 'KeyN') { e.preventDefault(); focusQuickAdd(); }
  else if (e.code === 'Slash' && e.shiftKey) { e.preventDefault(); shortcutsModal(); }
  else if (e.code === 'Slash') { e.preventDefault(); openPalette(); }
  else if (/^Digit[1-5]$/.test(e.code)) navGo(NAV[+e.code.slice(5) - 1].id);
  else if (e.code === 'Space' && UI.view === 'focus' && tag !== 'button') { e.preventDefault(); if (Timer.running) Timer.pause(); else Timer.start(); }
});
document.addEventListener('dragstart', e => {
  const c = e.target.closest && e.target.closest('.bcard');
  if (!c) return;
  e.dataTransfer.setData('text/plain', c.dataset.id);
  e.dataTransfer.effectAllowed = 'move';
  c.classList.add('dragging');
});
document.addEventListener('dragend', () => { $$('.dragging').forEach(x => x.classList.remove('dragging')); $$('.bcol.over').forEach(x => x.classList.remove('over')); });
document.addEventListener('dragover', e => {
  const col = e.target.closest && e.target.closest('.bcol');
  if (!col) return;
  e.preventDefault();
  $$('.bcol.over').forEach(x => x !== col && x.classList.remove('over'));
  col.classList.add('over');
});
document.addEventListener('drop', e => {
  const col = e.target.closest && e.target.closest('.bcol');
  if (!col) return;
  e.preventDefault();
  const t = S.tasks.get(e.dataTransfer.getData('text/plain')), to = col.dataset.col;
  if (t && t.status !== to) { const lv = levelOf(totalXP()).L; setStatus(t, to); render(); if (to === 'done') afterComplete(lv); }
  else render();
});
let lastW = window.innerWidth, rzT = 0;
window.addEventListener('resize', () => {
  clearTimeout(rzT);
  rzT = setTimeout(() => {
    if (Math.abs(window.innerWidth - lastW) < 2) return;
    lastW = window.innerWidth;
    if (['today', 'stats', 'activity', 'focus'].includes(UI.view)) render();
    if (!$('#dp').hidden && DP.anchor) placeDP();
  }, 180);
});
window.addEventListener('scroll', () => Tip.hide(), { passive: true });

/* ---------- راه‌اندازی ---------- */
let dayKey = todayKey();
function boot() {
  Store.onChange = () => { requestRender(); if (UI.drawerId && !S.tasks.get(UI.drawerId)) closeDrawer(); };
  Store.onStatus = () => renderSide();
  Store.onError = msg => toast(msg, { kind: 'bad', ms: 7000 });
  Store.loadLocal();
  applyTheme();
  const h = (location.hash || '').slice(1);
  if (VIEWS.some(v => v.id === h)) UI.view = h;
  if (!VIEW_FN[UI.view] || (UI.view === 'project' && !proj(UI.projectId)) || (UI.view === 'tag' && !UI.tag)) UI.view = 'today';
  Timer.load();
  render();
  Store.connect();
  window.addEventListener('pagehide', () => Store.saveLocal());
  setInterval(() => { if (todayKey() !== dayKey) { dayKey = todayKey(); render(); } }, 60000);
}
boot();
