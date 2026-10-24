'use strict';
/* روزنگار · اجزای رابط: آیکن‌ها، وضعیت، ناوبری، ردیف کار، افزودن سریع، کشو، پنجره‌ها، تایمر، صدا و یادآوری */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = escH;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const isMobile = () => matchMedia('(max-width: 900px)').matches;
const hap = kind => { if (S.settings.haptics) Native.haptic(kind); };
const APP_VERSION = '2.0.0';

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
  habit: '<circle cx="12" cy="12" r="9"/><path d="M8 12.5l2.8 2.8L16 9.8"/>',
  grid: '<rect x="3.5" y="3.5" width="7" height="7" rx="1.8"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.8"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.8"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.8"/>',
  bell: '<path d="M6 16v-5a6 6 0 1 1 12 0v5l1.5 2h-15z"/><path d="M10 20.5a2 2 0 0 0 4 0"/>',
  share: '<path d="M12 15V3M7 8l5-5 5 5"/><path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7"/>',
  volume: '<path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/>',
  palette: '<path d="M12 3a9 9 0 1 0 0 18c1.1 0 1.5-.8 1.5-1.5 0-1.2-1-1.5-1-2.5s.8-1.5 2-1.5H17a4 4 0 0 0 4-4C21 6.8 17 3 12 3z"/><circle cx="7.5" cy="11" r="1"/><circle cx="10" cy="7" r="1"/><circle cx="15" cy="7.5" r="1"/>',
  smile: '<circle cx="12" cy="12" r="9"/><path d="M8.5 14.5a4.5 4.5 0 0 0 7 0M9 9.5h.01M15 9.5h.01"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5h.01"/>',
  later: '<path d="M4 12h12M11 6l-6 6 6 6"/><path d="M20 5v14"/>',
};
const icon = (n, cls = '') => `<svg class="ic ${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[n] || ''}</svg>`;

/* ---------- وضعیت رابط ---------- */
const UI_KEY = 'roozngar:ui';
const UI = Object.assign({
  view: 'today', projectId: null, tag: null, sort: 'smart', fSearch: '', fProject: '', fStatus: 'open', limit: 80,
  showDoneToday: false, calY: 0, calM: 0, calSel: null, actRange: 'last', actMetric: 'tasks', actDay: null,
  statsRange: 30, boardProject: '', qaDue: null, drawerId: null, pm: null, hm: null, sq: null, importData: null, lastSub: {}, dMore: false, swipeHint: true,
}, (() => { try { return JSON.parse(localStorage.getItem(UI_KEY)) || {}; } catch (e) { return {}; } })());
function saveUI() {
  try {
    const { view, projectId, tag, sort, fStatus, statsRange, actMetric, showDoneToday, boardProject, lastSub, swipeHint, installDismissed } = UI;
    localStorage.setItem(UI_KEY, JSON.stringify({ view, projectId, tag, sort, fStatus, statsRange, actMetric, showDoneToday, boardProject, lastSub, swipeHint, installDismissed }));
  } catch (e) { /* */ }
}

/* پنج مقصد اصلی؛ «کارها» و «گزارش» سوییچ داخلی دارند */
const NAV = [
  { id: 'today', name: 'امروز', icon: 'sun', views: ['today'] },
  { id: 'tasks', name: 'کارها', icon: 'list', views: ['upcoming', 'calendar', 'all', 'board', 'matrix', 'project', 'tag'] },
  { id: 'habits', name: 'عادت‌ها', icon: 'habit', views: ['habits'] },
  { id: 'focus', name: 'تمرکز', icon: 'timer', views: ['focus'] },
  { id: 'report', name: 'گزارش', icon: 'chart', views: ['activity', 'stats'] },
];
const SUBS = {
  tasks: [['upcoming', 'پیش رو'], ['calendar', 'تقویم'], ['all', 'فهرست'], ['board', 'بُرد'], ['matrix', 'ماتریس']],
  report: [['activity', 'نقشه فعالیت'], ['stats', 'تحلیل']],
};
const VIEWS = [
  { id: 'today', name: 'امروز', icon: 'sun' },
  { id: 'upcoming', name: 'روزهای پیش رو', icon: 'calendar' },
  { id: 'calendar', name: 'تقویم', icon: 'calendar' },
  { id: 'all', name: 'همه کارها', icon: 'list' },
  { id: 'board', name: 'بُرد کانبان', icon: 'list' },
  { id: 'matrix', name: 'ماتریس آیزنهاور', icon: 'grid' },
  { id: 'habits', name: 'عادت‌ها', icon: 'habit' },
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
const mbar = () => `<div class="mbar${window.scrollY > 4 ? ' scrolled' : ''}"><button class="icon-btn" data-act="side-open" aria-label="منو">${icon('menu')}</button><span class="brand-m">${MARK}<span class="logo">روزنگار</span></span><button id="mbTimer" class="mbar-timer" data-act="nav" data-nav="focus" hidden></button><button class="icon-btn" data-act="palette" aria-label="جستجو">${icon('search')}</button></div>`;
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
  $('#fab').classList.toggle('hide', ['focus', 'settings'].includes(UI.view));
  $('#fab').setAttribute('aria-label', UI.view === 'habits' ? 'عادت جدید' : 'افزودن کار جدید');
  paintTimer(true);
}

function syncBadge() {
  const m = { cloud: 'همگام با حساب شما', connecting: 'در حال اتصال…', local: Native.isNative ? 'ذخیره روی همین گوشی' : 'ذخیره در همین مرورگر' }[Store.status] || '';
  return `<span class="sync ${Store.status}" title="${Store.status === 'cloud' ? 'کارها در حساب شما ذخیره و بین دستگاه‌ها همگام می‌شوند' : 'کارها روی همین دستگاه ذخیره می‌شوند'}"><i></i>${m}</span>`;
}
function topTags(n) {
  const m = new Map();
  for (const t of S.tasks.values()) t.tags.forEach(g => inc(m, g));
  return [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, n);
}
const activeHabits = () => S.habits.filter(h => !h.archived);
function navCounts() {
  const t0 = todayKey(), open = allTasks().filter(isOpen);
  const hab = activeHabits().filter(h => habitDueOn(h, t0) && !habitDoneOn(h, t0)).length;
  return { today: open.filter(t => t.due && t.due <= t0).length, habits: hab, open };
}
function renderSide() {
  const c = navCounts(), open = c.open;
  const xp = totalXP(), lv = levelOf(xp), st = streakInfo(doneByDay()), cur = navOf(UI.view);
  $('#side').innerHTML = `
    <div class="brand">${MARK}<span class="logo">روزنگار</span><button class="icon-btn only-m push" data-act="side-close" aria-label="بستن منو">${icon('x')}</button></div>
    <button class="search-btn" data-act="palette">${icon('search')}<span>جستجو و فرمان</span><kbd>Ctrl K</kbd></button>
    <nav class="nav">${NAV.map(n => `<button class="nav-i${cur && cur.id === n.id && UI.view !== 'project' && UI.view !== 'tag' ? ' on' : ''}" data-act="nav" data-nav="${n.id}">${icon(n.icon)}<span>${n.name}</span>${c[n.id] ? `<em>${faNum(c[n.id])}</em>` : ''}</button>`).join('')}
      <button class="nav-i${UI.view === 'settings' ? ' on' : ''}" data-act="go" data-view="settings">${icon('sliders')}<span>تنظیمات</span></button></nav>
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
      <div class="foot-row">${syncBadge()}<button class="icon-btn sm" data-act="theme-toggle" aria-label="تغییر پوسته" title="روشن / تیره">${icon(isDark() ? 'sun' : 'moon')}</button></div>
    </div>`;
}
function renderTabbar() {
  const cur = navOf(UI.view), c = navCounts();
  $('#tabbar').innerHTML = NAV.map(n => `<button class="tab${cur && cur.id === n.id ? ' on' : ''}" data-act="nav" data-nav="${n.id}" aria-label="${n.name}">${icon(n.icon)}<span>${n.name}</span>${n.id === 'today' && c.today ? `<em>${fa(Math.min(99, c.today))}</em>` : ''}</button>`).join('');
}
const hasSample = () => { for (const t of S.tasks.values()) if (t.sample) return true; return S.projects.some(p => p.sample) || S.habits.some(h => h.sample); };
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
  if (t.estimate && t.status !== 'done') parts.push(`<span>${icon('timer')}${fmtMin(t.estimate)}</span>`);
  if (t.recur) parts.push(`<span title="${RECUR[t.recur]}">${icon('repeat')}</span>`);
  if (t.notes) parts.push(`<span title="یادداشت دارد">${icon('note')}</span>`);
  t.tags.slice(0, 2).forEach(g => parts.push(`<span>#${esc(g)}</span>`));
  return parts.join('');
}
function taskRow(t, o = {}) {
  const done = t.status === 'done';
  return `<div class="trow"><div class="swipe-bg" aria-hidden="true"><span class="sb-done">${icon('check')}${done ? 'برگرداندن' : 'انجام شد'}</span><span class="sb-later">فردا${icon('later')}</span></div><div class="task pri-${t.priority}${done ? ' is-done' : ''}" data-id="${t.id}">
    <button class="check" data-act="toggle" aria-label="${done ? 'برگرداندن به کارهای باز' : 'علامت انجام شد'}" title="${PRI[t.priority].name}">${icon('check')}</button>
    <div class="t-body" data-act="open" tabindex="0" role="button" aria-label="ویرایش ${esc(t.title)}">
      <div class="t-title">${t.priority === 4 && !done ? `<span class="urgent" title="فوری">${icon('flag')}</span>` : ''}${esc(t.title)}</div>
      <div class="t-meta">${taskMeta(t, o)}</div>
    </div>
    <div class="t-act">
      ${!done ? `<button class="icon-btn sm" data-act="focus-task" title="شروع تمرکز روی این کار" aria-label="شروع تمرکز">${icon('play')}</button>` : ''}
      <button class="icon-btn sm" data-act="del" title="حذف" aria-label="حذف">${icon('trash')}</button>
    </div>
  </div></div>`;
}
function section(title, list, o = {}) {
  if (!list.length && !o.empty) return '';
  return `<section class="tsec ${o.cls || ''}"${o.id ? ` id="${o.id}"` : ''}><h2 class="tsec-h">${title}${o.sub ? `<small>${o.sub}</small>` : ''}${list.length ? `<span class="cnt">${faNum(list.length)}</span>` : ''}${o.extra || ''}</h2>
    ${list.length ? `<div class="tlist">${list.map(t => taskRow(t, o)).join('')}</div>` : `<p class="empty-line">${o.empty}</p>`}</section>`;
}

/* ---------- افزودن سریع (کادر داخل صفحه در دسکتاپ، برگه پایین‌رو در موبایل) ---------- */
function quickAdd(ph) {
  return `<div class="qa-wrap hide-m"><form class="qa" id="qaForm" autocomplete="off">
    <span class="qa-plus">${icon('plus')}</span>
    <input id="qaInput" class="qa-in" placeholder="${ph || 'چه کاری باید انجام بدهی؟'}" aria-label="افزودن کار جدید" enterkeyhint="done">
    <button class="qa-q" type="button" data-act="qa-help" aria-label="راهنمای نوشتن سریع" title="راهنمای نوشتن سریع">؟</button>
    <button class="btn primary" type="submit">افزودن</button>
  </form><div id="qaChips" class="qa-chips">${qaChipsHTML('')}</div></div>`;
}
function qaChipsHTML(v, showQaDue = true) {
  const r = parseQuick(v), c = [];
  if (r.due) c.push(`<span class="chip">${icon('calendar')}${relDate(r.due)}${r.time ? '، ' + fa(r.time) : ''}</span>`);
  else if (showQaDue && UI.qaDue) c.push(`<span class="chip">${icon('calendar')}برای ${relDate(UI.qaDue)}<button type="button" class="chip-x" data-act="qa-due-clear" aria-label="حذف تاریخ">${icon('x')}</button></span>`);
  if (r.projectId) { const p = proj(r.projectId); c.push(`<span class="chip"><i class="dot" style="background:var(--c${p.color})"></i>${esc(p.name)}</span>`); }
  if (r.priority) c.push(`<span class="chip">${icon('flag')}${PRI[r.priority].short}</span>`);
  if (r.recur) c.push(`<span class="chip">${icon('repeat')}${RECUR[r.recur]}</span>`);
  if (r.estimate) c.push(`<span class="chip">${icon('clock')}${fa(r.estimate)} دقیقه</span>`);
  r.tags.forEach(g => c.push(`<span class="chip">#${esc(g)}</span>`));
  return c.join('');
}
function updateQaChips() { const el = $('#qaChips'), i = $('#qaInput'); if (el && i) el.innerHTML = qaChipsHTML(i.value); }
function defaultDue() {
  const t0 = todayKey();
  if (UI.qaDue) return UI.qaDue;
  if (UI.view === 'today') return t0;
  if (UI.view === 'upcoming') return addDays(t0, 1);
  if (UI.view === 'calendar') return UI.calSel || t0;
  return null;
}
function focusQuickAdd() {
  if (isMobile()) { openAddSheet(); return; }
  const i = $('#qaInput');
  if (i) { i.focus(); return; }
  go('today');
  setTimeout(() => { const j = $('#qaInput'); j && j.focus(); }, 30);
}
function createFromText(raw, base) {
  const r = parseQuick(raw);
  if (!r.title) { toast('عنوان کار را هم بنویس.', { kind: 'bad' }); return null; }
  const f = { title: r.title, priority: r.priority || base.priority || 0, tags: r.tags, estimate: r.estimate, recur: r.recur, time: r.time, due: r.due || base.due || null, projectId: r.projectId || base.projectId || null };
  if (UI.view === 'tag' && UI.tag && !f.tags.includes(UI.tag)) f.tags.push(UI.tag);
  const t = newTask(f);
  hap('light');
  return t;
}
function submitQuick() {
  const inp = $('#qaInput'), raw = inp.value.trim();
  if (!raw) { inp.focus(); return; }
  const t = createFromText(raw, { due: defaultDue(), projectId: UI.view === 'project' ? UI.projectId : null });
  if (!t) return;
  inp.value = '';
  UI.qaDue = null;
  render();
  const row = $(`.task[data-id="${t.id}"]`);
  if (row) row.classList.add('flash');
  toast(`«${esc(t.title)}» اضافه شد${t.due ? '، ' + relDate(t.due) : ''}`);
}

/* برگه افزودن: انتخاب‌های سریع تاریخ، اولویت و پروژه؛ متن نوشته‌شده بر انتخاب‌ها مقدم است */
function openAddSheet(preset = {}) {
  if (UI.view === 'habits' && !preset.due) { habitModal(null); return; }
  UI.sq = { due: 'due' in preset ? preset.due : defaultDue(), priority: 0, projectId: preset.projectId || (UI.view === 'project' ? UI.projectId : null) };
  const el = $('#sheet');
  el.innerHTML = `<div class="sheet" role="dialog" aria-modal="true" aria-label="کار جدید"><div class="grab"></div>
    <form id="sqForm" autocomplete="off"><input id="sqInput" class="sq-in" placeholder="چه کاری باید انجام بدهی؟" aria-label="عنوان کار" enterkeyhint="send"></form>
    <div id="sqChips" class="qa-chips"></div>
    <div id="sqPicks">${sqPicksHTML()}</div>
    <div class="sq-foot"><button class="qa-q" type="button" data-act="qa-help" aria-label="راهنمای نوشتن سریع">؟</button><span class="muted sm grow">فردا ساعت ۹ #پروژه !فوری</span><button class="btn primary" data-act="sq-submit">${icon('plus')}افزودن</button></div>
  </div>`;
  el.hidden = false;
  setTimeout(() => { const i = $('#sqInput'); i && i.focus(); }, 60);
}
function sqPicksHTML() {
  const q = UI.sq, t0 = todayKey(), dates = [['امروز', t0], ['فردا', addDays(t0, 1)], ['هفته بعد', addDays(t0, 7)], ['بدون تاریخ', null]];
  const custom = q.due && !dates.some(d => d[1] === q.due);
  return `<div class="sq-picks">${dates.map(([n, k]) => `<button type="button" class="pick${q.due === k ? ' on' : ''}" data-act="sq-due" data-k="${k || ''}">${n}</button>`).join('')}
      <button type="button" class="pick${custom ? ' on' : ''}" data-act="sq-date">${icon('calendar')}${custom ? fmtDate(q.due, { year: false }) : 'تاریخ…'}</button></div>
    <div class="sq-picks">${[4, 3, 2, 1].map(p => `<button type="button" class="pick${q.priority === p ? ' on' : ''}" data-act="sq-pri" data-v="${p}"><i class="dot" style="background:var(--p${p})"></i>${PRI[p].short}</button>`).join('')}
      ${S.projects.map(p => `<button type="button" class="pick${q.projectId === p.id ? ' on' : ''}" data-act="sq-proj" data-pid="${p.id}"><i class="dot" style="background:var(--c${p.color})"></i>${esc(p.name)}</button>`).join('')}</div>`;
}
function closeSheet() { const el = $('#sheet'); el.hidden = true; el.innerHTML = ''; UI.sq = null; }
function submitSheet() {
  const inp = $('#sqInput'), raw = inp ? inp.value.trim() : '';
  if (!raw) { inp && inp.focus(); return; }
  const t = createFromText(raw, UI.sq);
  if (!t) return;
  closeSheet();
  render();
  const row = $(`.task[data-id="${t.id}"]`);
  if (row) { row.classList.add('flash'); row.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }
  toast(`«${esc(t.title)}» اضافه شد${t.due ? '، ' + relDate(t.due) : ''}`, { undo: () => { const x = S.tasks.get(t.id); if (x) { Store.dropTask(x); render(); } } });
}

function greeting() {
  const h = new Date().getHours();
  return h < 5 ? 'شب بخیر' : h < 12 ? 'صبح بخیر' : h < 15 ? 'ظهر بخیر' : h < 19 ? 'عصر بخیر' : 'شب بخیر';
}
const kpi = (lab, val, sub, cls = '') => `<div class="kpi ${cls}"><span class="kpi-l">${lab}</span><b class="kpi-v">${val}</b><span class="kpi-s">${sub}</span></div>`;

/* ---------- حال روز ---------- */
function moodCard(k, title) {
  const j = S.journal[k] || {};
  return `<section class="card mood-card"><div class="card-h"><h3>${title || 'حال امروزت چطور است؟'}</h3>${j.mood ? `<button class="link sm" data-act="mood-clear" data-k="${k}">پاک کردن</button>` : ''}</div>
    <div class="moods">${[1, 2, 3, 4, 5].map(v => `<button class="mood${j.mood === v ? ' on' : ''}" data-act="mood" data-v="${v}" data-k="${k}" aria-label="${MOODS[v].n}" aria-pressed="${j.mood === v}">${MOODS[v].e}<small>${MOODS[v].n}</small></button>`).join('')}</div>
    <textarea id="jNote" class="j-note" data-k="${k}" rows="2" placeholder="یک خط درباره این روز…" aria-label="یادداشت روز">${esc(j.note || '')}</textarea></section>`;
}

/* ---------- کشوی ویرایش کار ---------- */
const curTask = () => (UI.drawerId ? S.tasks.get(UI.drawerId) : null);
function dPatch(p) { const t = curTask(); if (!t) return; Object.assign(t, p); Store.touchTask(t); requestRender(); }
function openTask(id) {
  if (!S.tasks.get(id)) return;
  UI.drawerId = id;
  renderDrawer();
  $('#drawer').classList.add('open');
  $('#scrim').hidden = false;
  setTimeout(() => { const ti = $('#dTitle'); if (ti && !ti.value) ti.focus(); else if (!isMobile()) { const c = $('#drawer .d-close'); c && c.focus(); } }, 60);
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
  $('#drawer').innerHTML = `<div class="d-grab"></div>
    <header class="d-head"><span class="muted sm">${t.status === 'done' ? 'انجام‌شده' : t.status === 'doing' ? 'در حال انجام' : 'کار'}</span><button class="icon-btn d-close" data-act="d-close" aria-label="بستن">${icon('x')}</button></header>
    <div class="d-body">
      <div class="d-title-row"><button class="check big pri-${t.priority}${t.status === 'done' ? ' is-done' : ''}" data-act="d-status" data-v="${t.status === 'done' ? 'todo' : 'done'}" aria-label="${t.status === 'done' ? 'برگرداندن به باز' : 'علامت انجام شد'}">${icon('check')}</button>
        <textarea id="dTitle" class="d-title" rows="1" placeholder="عنوان کار" aria-label="عنوان کار">${esc(t.title)}</textarea></div>
      <div class="props">
        ${prop('calendar', 'تاریخ', `<button class="date-btn" data-act="d-date">${t.due ? fmtDate(t.due, { weekday: true }) : '<span class="muted">انتخاب تاریخ</span>'}</button>${t.due ? `<button class="icon-btn sm" data-act="d-date-clear" aria-label="حذف تاریخ" title="حذف تاریخ">${icon('x')}</button>` : ''}`)}
        ${prop('clock', 'ساعت', `<input id="dTime" type="time" value="${t.time || ''}" aria-label="ساعت">${t.time && S.settings.notify ? `<span class="muted sm" title="یادآوری فعال است">${icon('bell')}</span>` : ''}`)}
        ${prop('flag', 'اولویت', `<div class="seg pri-seg">${[0, 1, 2, 3, 4].map(v => `<button class="${t.priority === v ? 'on' : ''} p${v}" data-act="d-pri" data-v="${v}"><i></i>${PRI[v].short}</button>`).join('')}</div>`)}
        ${prop('folder', 'پروژه', `<select id="dProject" aria-label="پروژه"><option value="">بدون پروژه</option>${S.projects.map(p => `<option value="${p.id}"${t.projectId === p.id ? ' selected' : ''}>${esc(p.name)}</option>`).join('')}</select>`)}
      </div>
      <textarea id="dNotes" class="d-notes" rows="3" placeholder="یادداشت…" aria-label="یادداشت">${esc(t.notes)}</textarea>
      <div class="d-subs">
        <div class="d-sub-h"><span>زیرکارها</span>${t.subtasks.length ? `<small>${fa(sd)} از ${fa(t.subtasks.length)}</small>` : ''}</div>
        ${t.subtasks.length ? `<div class="sub-prog"><i style="width:${(sd / t.subtasks.length) * 100}%"></i></div>` : ''}
        <ul class="subs">${t.subtasks.map(s => `<li class="${s.done ? 'done' : ''}"><button class="check sm" data-act="d-sub-toggle" data-sid="${s.id}" aria-label="${s.done ? 'برداشتن تیک' : 'تیک زدن'}">${icon('check')}</button><span>${esc(s.title)}</span><button class="icon-btn sm" data-act="d-sub-del" data-sid="${s.id}" aria-label="حذف زیرکار">${icon('x')}</button></li>`).join('')}</ul>
        <label class="sub-add">${icon('plus')}<input id="dSubIn" placeholder="افزودن زیرکار" enterkeyhint="done"></label>
      </div>
      <details class="more" id="dMore"${UI.dMore ? ' open' : ''}><summary>${icon('chevL')}گزینه‌های بیشتر</summary>
        <div class="props">
          ${prop('list', 'وضعیت', `<div class="seg">${Object.entries(STATUS).map(([v, n]) => `<button class="${t.status === v ? 'on' : ''}" data-act="d-status" data-v="${v}">${n}</button>`).join('')}</div>`)}
          ${prop('repeat', 'تکرار', `<select id="dRecur" aria-label="تکرار"><option value="">بدون تکرار</option>${Object.entries(RECUR).map(([v, n]) => `<option value="${v}"${t.recur === v ? ' selected' : ''}>${n}</option>`).join('')}</select>`)}
          ${prop('timer', 'زمان تخمینی', `<div class="num-in"><input id="dEst" type="number" inputmode="numeric" min="0" step="5" value="${t.estimate || ''}" placeholder="۰" aria-label="زمان تخمینی"><em>دقیقه</em></div>`)}
          ${prop('sparkle', 'برچسب‌ها', `<div class="tags-in">${t.tags.map(g => `<span class="chip">#${esc(g)}<button class="chip-x" data-act="d-tag-del" data-tag="${esc(g)}" aria-label="حذف برچسب ${esc(g)}">${icon('x')}</button></span>`).join('')}<input id="dTagIn" list="tagList" placeholder="برچسب + Enter" aria-label="افزودن برچسب" enterkeyhint="done"><datalist id="tagList">${allTags.filter(g => !t.tags.includes(g)).map(g => `<option value="${esc(g)}">`).join('')}</datalist></div>`)}
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
    cells += `<button class="dp-d${k === t0 ? ' today' : ''}${k === DP.sel ? ' sel' : ''}${isOff(k) ? ' fri' : ''}" data-act="dp-pick" data-k="${k}" aria-label="${fmtDate(k, { weekday: true })}">${fa(d)}</button>`;
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
  setTimeout(() => { const f = m.querySelector('[autofocus]') || (isMobile() ? null : m.querySelector('input,select,textarea,button')); f && f.focus(); }, 40);
}
function closeModal() { const m = $('#modal'); m.hidden = true; m.innerHTML = ''; modalOk = null; }
function confirmBox(title, text, okLabel, fn) {
  openModal(`<h2>${title}</h2><p>${text}</p><div class="m-foot"><span class="grow"></span><button class="btn" data-act="m-close">انصراف</button><button class="btn danger" data-act="m-ok">${okLabel}</button></div>`, 'sm');
  modalOk = fn;
}

/* ---------- پوسته ---------- */
const mqDark = matchMedia('(prefers-color-scheme: dark)');
const isDark = () => S.settings.theme === 'dark' || (S.settings.theme === 'auto' && mqDark.matches);
function applyTheme() {
  const r = document.documentElement, dark = isDark();
  r.classList.toggle('dark', dark);
  r.dataset.accent = S.settings.accent || 'green';
  r.dataset.fs = S.settings.fontScale || 'm';
  Native.setBars(dark, dark ? '#0c0c0e' : '#fafaf9');
}
function cycleTheme() {
  S.settings.theme = isDark() ? 'light' : 'dark';
  Store.touchMeta();
  applyTheme();
  render();
}

/* ---------- تایمر تمرکز ---------- */
const TM_NAMES = { work: 'زمان تمرکز', short: 'استراحت کوتاه', long: 'استراحت بلند' };
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
  changed() { this.save(); paintTimer(true); Ambient.sync(); Native.keepAwake(this.running && this.mode === 'work'); Reminders.sync(); const fc = $('.focus-card'); if (fc) fc.classList.toggle('running', this.running); },
  remaining() { return this.running ? Math.max(0, this.endAt - Date.now()) : this.left; },
  start() {
    if (this.running) return;
    audioUnlock();
    this.running = true;
    this.endAt = Date.now() + this.left;
    this.segStart = Date.now();
    this.tick();
    hap('medium');
    this.changed();
  },
  pause() {
    if (!this.running) return;
    this.left = this.remaining();
    this.running = false;
    this.credit(Date.now());
    this.stop();
    this.changed();
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
    this.changed();
  },
  setMode(m) {
    if (this.running) this.credit(Date.now());
    this.mode = m;
    this.running = false;
    this.left = this.dur(m);
    this.stop();
    this.changed();
    render();
  },
  skip() { if (this.running) this.credit(Date.now()); this.advance(false); },
  advance(completed) {
    if (this.mode === 'work') { if (completed) this.cycles++; this.mode = completed && this.cycles % S.settings.pomo.every === 0 ? 'long' : 'short'; }
    else this.mode = 'work';
    this.running = false;
    this.left = this.dur();
    this.stop();
    this.changed();
    if (UI.view === 'focus') render();
  },
  finish() {
    const wasWork = this.mode === 'work';
    if (wasWork) this.credit(this.endAt);
    beep();
    hap('success');
    toast(wasWork ? `جلسه تمرکز تمام شد و ${faNum(S.settings.pomo.work)} دقیقه ثبت شد. وقت استراحت است.` : 'استراحت تمام شد. آماده جلسه بعدی هستی؟', { kind: 'good', ms: 7000 });
    this.advance(wasWork);
    if (S.settings.autoNext) setTimeout(() => this.start(), 600);
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
  const mb = $('#mbTimer');
  if (mb) { mb.hidden = !Timer.running || UI.view === 'focus'; if (Timer.running) mb.innerHTML = icon('timer') + txt; }
}

/* ---------- صدا: زنگ پایان و صدای محیطی (تولید‌شده با Web Audio، بدون فایل) ---------- */
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
const AMBIENT = { off: 'سکوت', rain: 'باران', waves: 'موج', white: 'نویز سفید' };
const Ambient = {
  kind: 'off', src: null, gain: null,
  buffer(kind) {
    const sr = audioCtx.sampleRate, len = sr * 4, buf = audioCtx.createBuffer(1, len, sr), d = buf.getChannelData(0);
    let last = 0, b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < len; i++) {
      const w = Math.random() * 2 - 1;
      if (kind === 'waves') {
        last = (last + 0.02 * w) / 1.02;
        d[i] = last * 3.2 * (0.55 + 0.45 * Math.sin((i / len) * Math.PI * 2));
      } else if (kind === 'rain') {
        b0 = 0.99886 * b0 + w * 0.0555179; b1 = 0.99332 * b1 + w * 0.0750759; b2 = 0.969 * b2 + w * 0.153852;
        b3 = 0.8665 * b3 + w * 0.3104856; b4 = 0.55 * b4 + w * 0.5329522; b5 = -0.7616 * b5 - w * 0.016898;
        d[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * 0.5362) * 0.1;
        b6 = w * 0.115926;
      } else d[i] = w * 0.22;
    }
    return buf;
  },
  play(kind) {
    this.stop();
    this.kind = kind;
    if (kind === 'off') return;
    audioUnlock();
    if (!audioCtx) return;
    try {
      const src = audioCtx.createBufferSource(), g = audioCtx.createGain(), t = audioCtx.currentTime;
      src.buffer = this.buffer(kind);
      src.loop = true;
      let node = src;
      if (kind === 'rain') { const f = audioCtx.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 350; src.connect(f); node = f; }
      if (kind === 'white') { const f = audioCtx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 5000; src.connect(f); node = f; }
      node.connect(g); g.connect(audioCtx.destination);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(kind === 'white' ? 0.35 : 0.6, t + 1.5);
      src.start();
      this.src = src; this.gain = g;
    } catch (e) { /* */ }
  },
  stop() {
    const s = this.src, g = this.gain;
    this.src = this.gain = null;
    this.kind = 'off';
    if (!s) return;
    try { const t = audioCtx.currentTime; g.gain.cancelScheduledValues(t); g.gain.setValueAtTime(g.gain.value, t); g.gain.linearRampToValueAtTime(0.0001, t + 0.6); s.stop(t + 0.65); } catch (e) { /* */ }
  },
  sync() { const want = Timer.running && Timer.mode === 'work' ? S.settings.ambient || 'off' : 'off'; if (want !== this.kind) this.play(want); },
};

/* ---------- یادآوری‌ها: کارهای ساعت‌دار، یادآور روزانه و پایان تایمر ---------- */
const Reminders = {
  t: 0,
  sync() { clearTimeout(this.t); this.t = setTimeout(() => this.run(), 900); },
  run() {
    const st = S.settings, list = [];
    if (!st.notify) { Native.schedule([]); return; }
    const now = Date.now(), before = (st.remindBefore || 0) * 60000, lim = now + 14 * 864e5;
    for (const t of S.tasks.values()) {
      if (!isOpen(t) || !t.due || !t.time) continue;
      const [h, m] = t.time.split(':').map(Number), d = dateOf(t.due);
      d.setHours(h, m, 0, 0);
      const at = d.getTime() - before, p = proj(t.projectId);
      if (at > now && at < lim) list.push({ key: 't:' + t.id, title: t.title, body: (before ? `${fmtMin(st.remindBefore)} دیگر، ساعت ${fa(t.time)}` : `الان، ساعت ${fa(t.time)}`) + (p ? ` · ${p.name}` : ''), at });
    }
    list.sort((a, b) => a.at - b.at);
    list.splice(48);
    if (st.dailyReminder && /^\d\d:\d\d$/.test(st.dailyReminder)) {
      const [h, m] = st.dailyReminder.split(':').map(Number);
      list.push({ key: 'daily', title: 'روزنگار', body: 'برنامه امروزت را مرور کن و اولین کار را شروع کن.', daily: { hour: h, minute: m } });
    }
    if (Timer.running && Timer.endAt > now) list.push({ key: 'timer', title: Timer.mode === 'work' ? 'جلسه تمرکز تمام شد' : 'استراحت تمام شد', body: Timer.mode === 'work' ? 'آفرین! چند دقیقه استراحت کن.' : 'برای جلسه بعدی آماده‌ای؟', at: Timer.endAt });
    Native.schedule(list);
  },
};

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
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const cs = getComputedStyle(document.documentElement);
  const colors = ['--accent', '--h2', '--c0', '--c1', '--c3', '--c4', '--c5'].map(v => cs.getPropertyValue(v).trim()).filter(v => v && !v.includes('(')).concat(['#22c55e', '#3b82f6', '#f59e0b', '#ec4899']);
  const P = Array.from({ length: 130 }, () => ({ x: W / 2 + (Math.random() - 0.5) * 240, y: H * 0.4, vx: (Math.random() - 0.5) * 13, vy: -Math.random() * 12 - 4, s: 5 + Math.random() * 6, r: Math.random() * 6, vr: (Math.random() - 0.5) * 0.3, c: colors[Math.floor(Math.random() * colors.length)], sq: Math.random() < 0.5 }));
  const t0 = performance.now();
  (function frame(t) {
    const dt = t - t0;
    ctx.clearRect(0, 0, W, H);
    P.forEach(p => {
      p.vy += 0.34; p.vx *= 0.99; p.x += p.vx; p.y += p.vy; p.r += p.vr;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.globalAlpha = Math.max(0, 1 - dt / 1900); ctx.fillStyle = p.c;
      if (p.sq) ctx.fillRect(-p.s / 2, -p.s / 3, p.s, p.s * 0.66); else { ctx.beginPath(); ctx.arc(0, 0, p.s / 2, 0, Math.PI * 2); ctx.fill(); }
      ctx.restore();
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
  if (!$('#sheet').hidden) { closeSheet(); return true; }
  if (UI.drawerId) { closeDrawer(); return true; }
  if ($('#side').classList.contains('open')) { closeSide(); return true; }
  return false;
}
