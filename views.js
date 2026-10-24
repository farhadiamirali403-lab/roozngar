'use strict';
/* روزنگار · نماها: امروز، کارها (پیش رو، تقویم، فهرست، بُرد، ماتریس)، عادت‌ها، تمرکز، گزارش و تنظیمات */

/* ---------- نما: امروز ---------- */
function welcomeCard() {
  return `<section class="welcome">
    <span class="welcome-ic">${icon('leaf')}</span>
    <div class="welcome-text"><h2>به روزنگار خوش آمدی</h2>
    <p>کارهای امروزت را بنویس و وقتی انجام شد تیکش بزن. عادت‌هایت را هر روز ثبت کن و با تایمر تمرکز عمیق کار کن. هر روزِ فعال یک خانه رنگی به نقشه فعالیتت اضافه می‌کند.</p></div>
    <div class="welcome-act"><button class="btn primary" data-act="dismiss-welcome">شروع کنیم</button><button class="link" data-act="load-sample">اول با داده نمونه امتحان کنم</button></div>
  </section>`;
}
function habitChips(k) {
  const list = activeHabits().filter(h => habitDueOn(h, k));
  if (!S.habits.length) return '';
  const done = list.filter(h => habitDoneOn(h, k)).length;
  return `<section class="tsec"><h2 class="tsec-h">عادت‌های امروز${list.length ? `<span class="cnt">${fa(done)}/${fa(list.length)}</span>` : ''}<button class="link sm push" data-act="nav" data-nav="habits">همه عادت‌ها</button></h2>
    <div class="hab-row">${list.map(h => { const on = habitDoneOn(h, k), s = habitStreak(h).cur; return `<button class="hchip${on ? ' on' : ''}" style="--hc:var(--c${h.color})" data-act="habit-toggle" data-hid="${h.id}" data-k="${k}" aria-pressed="${on}"><span class="he">${h.emoji}</span><span class="hn">${esc(h.name)}</span>${s > 1 ? `<span class="hs-n">${fa(s)}🔥</span>` : ''}</button>`; }).join('')}
      <button class="hchip add" data-act="habit-new"><span class="he">${icon('plus')}</span><span class="hn">عادت جدید</span></button></div></section>`;
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
  const estLeft = todays.concat(overdue).reduce((a, t) => a + (t.estimate || 0), 0);
  const msg = left ? `${faNum(left)} کار مانده${estLeft ? `، حدود ${fmtMin(estLeft)} کار` : ''}؛ یکی‌یکی جلو برو.` : doneToday.length ? 'همه کارهای امروز انجام شد. روز خوبی بود!' : 'امروز هنوز کاری ننوشتی.';
  const hol = holidayOf(t0);
  const html = `
  ${head(fmtDate(t0, { weekday: true }) + (hol ? ` · <span class="txt-crit">${hol}</span>` : ''), greeting() + (S.settings.name ? '، ' + esc(S.settings.name) : ''), '', `<button class="icon-btn" data-act="share-day" aria-label="اشتراک خلاصه امروز" title="اشتراک خلاصه امروز">${icon('share')}</button>`)}
  ${welcome ? welcomeCard() : ''}
  ${installPrompt && !UI.installDismissed ? `<div class="banner install-banner">${icon('download')}<span>روزنگار را مثل یک برنامه روی گوشی یا رایانه‌ات نصب کن؛ بدون اینترنت هم کار می‌کند.</span><button class="btn sm primary" data-act="install">نصب</button><button class="icon-btn sm" data-act="install-later" aria-label="بعداً">${icon('x')}</button></div>` : ''}
  <section class="hero">
    <div class="hero-ring score-ring">${ring(Math.min(1, doneToday.length / goal), 96, 9)}<div class="ring-num"><b>${faNum(doneToday.length)}</b><span>از ${faNum(goal)}</span></div></div>
    <div class="hero-stats">
      <div class="hs${overdue.length ? ' crit' : ''}"><span class="hs-l">${overdue.length ? `${faNum(overdue.length)} عقب‌افتاده` : 'مانده برای امروز'}</span><b class="hs-v">${faNum(left)} <small>کار</small></b></div>
      <div class="hs"><span class="hs-l">پیوستگی</span><b class="hs-v">${icon('flame')}${faNum(st.cur)} <small>روز</small></b></div>
      <div class="hs"><span class="hs-l">تمرکز امروز</span><b class="hs-v">${fmtHours(focusOn(t0))}</b></div>
    </div>
    <p class="hero-msg">${msg}</p>
  </section>
  ${habitChips(t0)}
  <div class="split">
    <div class="split-main">
      ${quickAdd()}
      ${overdue.length ? section('عقب‌افتاده', overdue, { cls: 'sec-over', extra: `<button class="link sm push" data-act="move-overdue">${icon('arrowL')}همه به امروز</button>` }) : ''}
      ${section('امروز', todays, { hideToday: true, empty: overdue.length || doneToday.length ? 'کار بازی برای امروز نمانده.' : isMobile() ? 'با دکمه + اولین کار امروز را بنویس.' : 'برای شروع، اولین کار امروز را در کادر بالا بنویس.' })}
      ${UI.swipeHint && isMobile() && (todays.length || overdue.length) ? `<p class="swipe-hint">کار را به چپ بکش تا انجام شود، به راست تا به فردا برود. <button class="link sm" data-act="hide-swipe-hint">فهمیدم</button></p>` : ''}
      ${doneToday.length ? `<section class="tsec sec-done"><h2 class="tsec-h"><button class="tsec-toggle" data-act="toggle-done-today" aria-expanded="${UI.showDoneToday}">${icon(UI.showDoneToday ? 'chevD' : 'chevL')}انجام‌شده امروز<span class="cnt">${faNum(doneToday.length)}</span></button></h2>${UI.showDoneToday ? `<div class="tlist">${doneToday.map(t => taskRow(t, { doneTime: true, hideToday: true })).join('')}</div>` : ''}</section>` : ''}
    </div>
    <aside class="split-side">
      ${moodCard(t0)}
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

/* ---------- نما: روزهای پیش رو ---------- */
function viewUpcoming() {
  const t0 = todayKey(), open = allTasks().filter(isOpen);
  const week = Array.from({ length: 7 }, (_, i) => addDays(t0, i));
  const loads = week.map(k => open.filter(t => t.due === k).length), maxL = Math.max(1, ...loads);
  const days = Array.from({ length: 14 }, (_, i) => addDays(t0, i + 1));
  const later = sortTasks(open.filter(t => t.due && t.due > days[13]), 'due');
  const nodate = sortTasks(open.filter(t => !t.due), 'priority');
  const html = `
  ${head('کارها', 'روزهای پیش رو', 'دو هفته آینده در یک نگاه.', '', subSwitch('tasks'))}
  <div class="wstrip">${week.map((k, i) => `<button class="wday${i === 0 ? ' is-today' : ''}${isOff(k) ? ' is-fri' : ''}" data-act="jump-day" data-k="${k}">
    <span class="wd">${i === 0 ? 'امروز' : WEEKDAYS[wdOf(k)]}</span><b>${fa(jOf(k).jd)}</b>
    <span class="load" aria-hidden="true"><i style="width:${(loads[i] / maxL) * 100}%"></i></span><small>${loads[i] ? faNum(loads[i]) + ' کار' : 'آزاد'}</small></button>`).join('')}</div>
  ${quickAdd('کار جدید؛ بدون تاریخ، برای فردا ثبت می‌شود')}
  ${days.map((k, i) => {
    const list = sortTasks(open.filter(t => t.due === k), 'smart'), hol = holidayOf(k);
    return `<section class="tsec day-sec${list.length ? '' : ' is-empty'}" id="d-${k}"><h2 class="tsec-h">${i < 6 ? relDate(k) : WEEKDAYS[wdOf(k)]}<small>${fmtDate(k, { year: false })}${hol ? ` · <span class="txt-crit">${hol}</span>` : ''}</small>${list.length ? `<span class="cnt">${faNum(list.length)}</span>` : ''}<button class="link sm push" data-act="qa-day" data-k="${k}">${icon('plus')}افزودن</button></h2>
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
    ${UI.fStatus === 'done' ? '' : sel('fSort', [['smart', 'مرتب: هوشمند'], ['due', 'مرتب: تاریخ'], ['priority', 'مرتب: اولویت'], ['created', 'مرتب: جدیدترین'], ['title', 'مرتب: الفبا']], UI.sort, 'مرتب‌سازی')}
  </div>`;
  const body = total ? `<div class="tlist">${list.map(t => taskRow(t, { doneTime: UI.fStatus !== 'open', hideProject: !!p })).join('')}</div>`
    : `<div class="empty"><span class="empty-art">${q || UI.fProject ? '🔍' : UI.fStatus === 'done' ? '🌱' : '✨'}</span><p>${q || UI.fProject ? 'کاری با این جستجو پیدا نشد.' : UI.fStatus === 'done' ? 'هنوز کاری انجام نشده.' : 'کار بازی نداری. یک کار تازه اضافه کن.'}</p></div>`;
  const more = total > UI.limit ? `<button class="btn block" data-act="more">نمایش ${faNum(Math.min(80, total - UI.limit))} کار دیگر</button>` : '';
  return { html: h + quickAdd() + filters + body + more };
}

/* ---------- نما: بُرد کانبان ---------- */
function boardCard(t, prev, next) {
  return `<article class="bcard pri-${t.priority}" draggable="true" data-id="${t.id}">
    <button class="bc-title" data-act="open">${esc(t.title)}</button>
    <div class="t-meta">${taskMeta(t)}</div>
    ${prev || next ? `<div class="bc-foot">${prev ? `<button class="icon-btn sm" data-act="board-move" data-to="${prev.id}" title="برگشت به «${prev.name}»" aria-label="انتقال به ${prev.name}">${icon('chevR')}</button>` : '<span></span>'}
    ${next ? `<button class="icon-btn sm" data-act="board-move" data-to="${next.id}" title="رفتن به «${next.name}»" aria-label="انتقال به ${next.name}">${icon('chevL')}</button>` : ''}</div>` : ''}
  </article>`;
}
function viewBoard() {
  const recent = addDays(todayKey(), -6);
  let list = allTasks();
  if (UI.boardProject) list = list.filter(t => (t.projectId || 'none') === UI.boardProject);
  const cols = [
    { id: 'todo', name: 'برای انجام', items: sortTasks(list.filter(t => t.status === 'todo'), 'smart') },
    { id: 'doing', name: 'در حال انجام', items: sortTasks(list.filter(t => t.status === 'doing'), 'smart') },
    { id: 'done', name: 'انجام شد', sub: 'هفت روز اخیر', items: list.filter(t => t.status === 'done' && t.completedAt && msKey(t.completedAt) >= recent).sort((a, b) => b.completedAt - a.completedAt) },
  ];
  const html = `
  ${head('کارها', 'بُرد کانبان', isMobile() ? 'با دکمه‌های زیر هر کارت آن را جابه‌جا کن.' : 'کارت‌ها را بکش و بین ستون‌ها رها کن.', '', subSwitch('tasks'))}
  <div class="filters"><select id="fBoard" aria-label="پروژه"><option value="">همه پروژه‌ها</option>${S.projects.map(p => `<option value="${p.id}"${UI.boardProject === p.id ? ' selected' : ''}>${esc(p.name)}</option>`).join('')}<option value="none"${UI.boardProject === 'none' ? ' selected' : ''}>بدون پروژه</option></select></div>
  <div class="board">${cols.map((c, ci) => `<section class="bcol" data-col="${c.id}"><header class="bcol-h"><span class="bdot ${c.id}"></span>${c.name}${c.sub ? `<small>${c.sub}</small>` : ''}<span class="cnt">${faNum(c.items.length)}</span></header>
    <div class="bcol-body">${c.items.map(t => boardCard(t, cols[ci - 1], cols[ci + 1])).join('') || '<p class="empty-line">خالی</p>'}</div></section>`).join('')}</div>`;
  return { html };
}

/* ---------- نما: ماتریس آیزنهاور ---------- */
const QUADS = [null,
  { n: 'فوری و مهم', s: 'همین حالا انجامش بده' },
  { n: 'مهم، نه فوری', s: 'برایش وقت بگذار' },
  { n: 'فوری، نه مهم', s: 'سریع تمامش کن یا بسپار' },
  { n: 'نه فوری، نه مهم', s: 'حذف کن یا بعداً' }];
function quadOf(t) {
  const imp = t.priority >= 3, urg = !!t.due && t.due <= addDays(todayKey(), 1);
  return imp && urg ? 1 : imp ? 2 : urg ? 3 : 4;
}
function moveToQuad(t, q) {
  const t0 = todayKey(), imp = q <= 2, urg = q === 1 || q === 3, msg = [];
  if (imp && t.priority < 3) { t.priority = 3; msg.push('اولویت بالا شد'); }
  if (!imp && t.priority >= 3) { t.priority = 2; msg.push('اولویت متوسط شد'); }
  const isUrg = !!t.due && t.due <= addDays(t0, 1);
  if (urg && !isUrg) { t.due = t0; msg.push('موعد امروز شد'); }
  if (!urg && isUrg) { t.due = addDays(t0, 7); msg.push('موعد به هفته بعد رفت'); }
  Store.touchTask(t);
  if (msg.length) toast(`«${esc(t.title)}»: ${msg.join('، ')}.`);
}
function viewMatrix() {
  const open = allTasks().filter(isOpen), by = [[], [], [], [], []];
  open.forEach(t => by[quadOf(t)].push(t));
  const html = `
  ${head('کارها', 'ماتریس آیزنهاور', 'کارهای باز بر اساس فوریت (موعد تا فردا) و اهمیت (اولویت بالا یا فوری).', '', subSwitch('tasks'))}
  <div class="matrix">${[1, 2, 3, 4].map(q => `<section class="quad q${q}" data-quad="${q}"><header class="quad-h"><span class="q-badge">${fa(q)}</span><div><b>${QUADS[q].n}</b><br><small>${QUADS[q].s}</small></div><span class="cnt">${faNum(by[q].length)}</span></header>
    ${sortTasks(by[q], 'smart').slice(0, 30).map(t => boardCard(t)).join('') || '<p class="empty-line">خالی</p>'}${by[q].length > 30 ? `<p class="muted sm">و ${faNum(by[q].length - 30)} کار دیگر</p>` : ''}</section>`).join('')}</div>`;
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
    const dn = doneBy.get(k) || 0, lvl = dn ? Math.min(4, Math.ceil((dn / maxDone) * 4)) : 0, hol = holidayOf(k), mood = S.journal[k] && S.journal[k].mood;
    cells += `<button class="cal-cell${k === t0 ? ' is-today' : ''}${k === sel ? ' is-sel' : ''}${isOff(k) ? ' is-off' : ''}" data-act="cal-day" data-k="${k}" aria-label="${fmtDate(k, { weekday: true })}${hol ? '، ' + hol : ''}">
      <span class="cal-top"><span class="cal-d">${fa(d)}</span>${mood ? `<span class="cal-mood">${MOODS[mood].e}</span>` : ''}${dn ? `<span class="cal-heat l${lvl}" title="${faNum(dn)} کار انجام شد"></span>` : ''}</span>
      ${hol ? `<span class="cal-hol">${hol}</span>` : ''}
      <span class="cal-items">${items.slice(0, 3).map(t => `<span class="cal-it${t.status === 'done' ? ' done' : ''}" style="--pc:${pColor(proj(t.projectId))}">${esc(t.title)}</span>`).join('')}${items.length > 3 ? `<span class="cal-more">+${fa(items.length - 3)}</span>` : ''}</span>
    </button>`;
  }
  const dueSel = sortTasks(byDue.get(sel) || [], 'smart');
  const doneOn = all.filter(t => t.status === 'done' && t.completedAt && msKey(t.completedAt) === sel && t.due !== sel).sort((a, b) => a.completedAt - b.completedAt);
  const hol = holidayOf(sel);
  const html = `
  ${head('کارها', 'تقویم', 'روی هر روز بزن تا کارها و حال آن روز را ببینی.', '', subSwitch('tasks'))}
  <div class="cal-wrap">
    <section class="card cal">
      <div class="cal-nav"><button class="icon-btn" data-act="cal-prev" aria-label="ماه قبل">${icon('chevR')}</button>
        <div class="cal-title"><b>${J_MONTHS[jm - 1]} ${fa(jy)}</b><small dir="ltr">${gTitle}</small></div>
        <button class="icon-btn" data-act="cal-next" aria-label="ماه بعد">${icon('chevL')}</button><button class="btn sm" data-act="cal-today">امروز</button></div>
      <div class="cal-grid">${WEEKDAYS.map((w, i) => `<div class="cal-wd${i === 6 ? ' is-fri' : ''}">${isMobile() ? WD_SHORT[i] : w}</div>`).join('')}${cells}</div>
    </section>
    <section class="cal-day">
      <h3>${fmtDate(sel, { weekday: true })} <small>${relDate(sel)}</small></h3>
      ${hol ? `<span class="hol-tag">${icon('calendar')}تعطیل: ${hol}</span>` : ''}
      ${quickAdd('کار جدید برای این روز…')}
      ${dueSel.length ? `<div class="tlist">${dueSel.map(t => taskRow(t, { doneTime: true, hideToday: true })).join('')}</div>` : '<p class="empty-line">برای این روز کاری نیست.</p>'}
      ${doneOn.length ? `<h4 class="sub-h">انجام‌شده در این روز</h4><div class="tlist">${doneOn.map(t => taskRow(t, { doneTime: true })).join('')}</div>` : ''}
      ${sel <= t0 ? moodCard(sel, sel === t0 ? 'حال امروز' : 'حال این روز') : ''}
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

/* ---------- نما: عادت‌ها ---------- */
const schedText = h => (!h.days || !h.days.length || h.days.length === 7 ? 'هر روز' : h.days.length === 5 && [0, 1, 2, 3, 4].every(d => h.days.includes(d)) ? 'شنبه تا چهارشنبه' : h.days.slice().sort().map(d => WEEKDAYS[d]).join('، '));
function viewHabits() {
  const t0 = todayKey(), list = activeHabits();
  const week = Array.from({ length: 7 }, (_, i) => addDays(t0, i - 6));
  const due = list.filter(h => habitDueOn(h, t0)), done = due.filter(h => habitDoneOn(h, t0));
  const total = h => Object.values(S.habitLog).reduce((a, ids) => a + (ids.includes(h.id) ? 1 : 0), 0);
  const html = `
  ${head('هر روز کمی بهتر', 'عادت‌ها', list.length ? `امروز ${faNum(done.length)} از ${faNum(due.length)} عادت انجام شده.` : '', `<button class="btn primary only-d" data-act="habit-new">${icon('plus')}عادت جدید</button>`)}
  ${list.length ? `<div class="habits">${list.map(h => {
    const s = habitStreak(h), on = habitDoneOn(h, t0), dueT = habitDueOn(h, t0);
    return `<section class="card habit" style="--hc:var(--c${h.color})" data-hid="${h.id}">
      <div class="habit-top"><span class="habit-ic">${h.emoji}</span><div class="habit-t"><b>${esc(h.name)}</b><small>${schedText(h)}${!dueT ? ' · امروز برنامه‌ای نیست' : ''}</small></div>
        <button class="habit-go${on ? ' on' : ''}${dueT ? '' : ' off-day'}" data-act="habit-toggle" data-k="${t0}" aria-pressed="${on}" aria-label="ثبت امروز">${icon('check')}</button></div>
      <div class="week-dots">${week.map(k => `<button class="wdot${habitDoneOn(h, k) ? ' on' : ''}${habitDueOn(h, k) ? '' : ' off'}${k === t0 ? ' today' : ''}" data-act="habit-toggle" data-k="${k}" aria-label="${fmtDate(k, { weekday: true })}"><i>${icon('check')}</i>${k === t0 ? 'امروز' : WD_SHORT[wdOf(k)]}</button>`).join('')}</div>
      <div class="heat-scroll" id="hh-${h.id}"></div>
      <div class="habit-stats"><span><b>${faNum(s.cur)}</b>روز پیوسته</span><span><b>${faNum(s.best)}</b>رکورد</span><span><b>${faPct(habitRate(h, 30) * 100)}</b>در ۳۰ روز</span><span><b>${faNum(total(h))}</b>بار</span><button class="icon-btn sm push" data-act="habit-edit" aria-label="ویرایش عادت">${icon('edit')}</button></div>
    </section>`;
  }).join('')}</div>` : `<div class="empty"><span class="empty-art">🌱</span><p>عادت‌های کوچک، تغییرهای بزرگ می‌سازند.<br>اولین عادتت را بساز؛ مثلاً «۸ لیوان آب» یا «۱۰ دقیقه کتاب».</p><div class="btn-row"><button class="btn primary" data-act="habit-new">${icon('plus')}عادت جدید</button>${hasSample() ? '' : '<button class="btn" data-act="load-sample">داده نمونه</button>'}</div></div>`}`;
  return {
    html,
    mount() {
      const start = addDays(t0, -wdOf(t0) - 19 * 7);
      list.forEach(h => heatmap($('#hh-' + h.id), {
        start, end: t0, cell: 10, gap: 3, noLabels: true, scrollEnd: true, label: 'سابقه ' + h.name,
        value: k => (habitDoneOn(h, k) ? 1 : 0),
        tip: (k, v) => `<b>${v ? 'انجام شد' : habitDueOn(h, k) ? 'انجام نشد' : 'برنامه‌ای نبود'}</b><span>${fmtDate(k, { weekday: true })}</span>`,
        onPick: k => { if (k <= t0) toggleHabit(h.id, k); },
      }));
    },
  };
}
function habitModal(id) {
  const h = id ? S.habits.find(x => x.id === id) : null;
  const used = new Set(S.habits.map(x => x.color));
  UI.hm = { id, emoji: h ? h.emoji : HABIT_EMOJI[S.habits.length % HABIT_EMOJI.length], color: h ? h.color : ([0, 1, 2, 3, 4, 5, 6, 7].find(c => !used.has(c)) ?? 0), days: new Set(h && h.days && h.days.length ? h.days : [0, 1, 2, 3, 4, 5, 6]) };
  openModal(`<h2>${h ? 'ویرایش عادت' : 'عادت جدید'}</h2>
    <label class="field"><span>نام</span><input id="hmName" value="${h ? esc(h.name) : ''}" placeholder="مثلاً ۱۰ دقیقه کتاب‌خوانی" maxlength="40"${isMobile() ? '' : ' autofocus'}></label>
    <div class="field"><span>نماد</span><div class="emoji-grid">${HABIT_EMOJI.map(e => `<button class="${e === UI.hm.emoji ? 'on' : ''}" data-act="hm-emoji" data-e="${e}">${e}</button>`).join('')}</div></div>
    <div class="field"><span>رنگ</span><div class="swatches">${Array.from({ length: 8 }, (_, c) => `<button class="sw-btn${c === UI.hm.color ? ' on' : ''}" data-act="hm-color" data-c="${c}" style="background:var(--c${c})" aria-label="رنگ ${fa(c + 1)}"></button>`).join('')}</div></div>
    <div class="field"><span>روزهای انجام</span><div class="days-pick">${WD_SHORT.map((w, i) => `<button class="${UI.hm.days.has(i) ? 'on' : ''}" data-act="hm-day" data-d="${i}" aria-label="${WEEKDAYS[i]}" aria-pressed="${UI.hm.days.has(i)}">${w}</button>`).join('')}</div></div>
    <div class="m-foot">${h ? '<button class="btn danger ghost" data-act="hm-del">حذف</button>' : ''}<span class="grow"></span><button class="btn" data-act="m-close">انصراف</button><button class="btn primary" data-act="hm-save">ذخیره</button></div>`, 'sm');
}

/* ---------- نما: تمرکز (پومودورو) ---------- */
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
      <section class="card focus-card mode-${Timer.mode}${Timer.running ? ' running' : ''}">
        <div class="seg tm-modes" role="tablist">${['work', 'short', 'long'].map(m => `<button class="${Timer.mode === m ? 'on' : ''}" data-act="tm-mode" data-m="${m}" role="tab" aria-selected="${Timer.mode === m}">${m === 'work' ? 'تمرکز' : TM_NAMES[m]}</button>`).join('')}</div>
        <div class="tm-dial">
          <svg class="tm-ring" viewBox="0 0 260 260" aria-hidden="true"><circle class="ring-bg" cx="130" cy="130" r="116" stroke-width="10"/><circle id="tmArc" class="ring-fg" data-c="${C.toFixed(2)}" cx="130" cy="130" r="116" stroke-width="10" stroke-dasharray="${C.toFixed(2)}" stroke-dashoffset="0" transform="rotate(-90 130 130)"/></svg>
          <div class="tm-center"><div id="tmDigits" class="tm-digits" aria-live="off">--:--</div><div class="tm-label">${TM_NAMES[Timer.mode]}</div>
            <div class="tm-cycles" title="جلسه‌های این دور">${Array.from({ length: p.every }, (_, i) => `<i class="${i < Timer.cycles % p.every ? 'on' : ''}"></i>`).join('')}</div></div>
        </div>
        <div class="tm-ctrl">
          <button class="icon-btn lg" data-act="tm-reset" title="شروع دوباره" aria-label="شروع دوباره">${icon('reset')}</button>
          <button id="tmStart" class="btn primary xl" data-act="tm-toggle"></button>
          <button class="icon-btn lg" data-act="tm-skip" title="رفتن به مرحله بعد" aria-label="مرحله بعد">${icon('skip')}</button>
        </div>
        <div class="field tm-amb"><span>${icon('volume')} صدای پس‌زمینه هنگام تمرکز</span><div class="seg">${Object.entries(AMBIENT).map(([v, n]) => `<button class="${(S.settings.ambient || 'off') === v ? 'on' : ''}" data-act="ambient" data-v="${v}">${n}</button>`).join('')}</div></div>
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
  const habitCount = k => (S.habitLog[k] || []).length;
  const val = k => (metric === 'focus' ? focusOn(k) : metric === 'habits' ? habitCount(k) : counts.get(k) || 0);
  let minKey = t0;
  counts.forEach((v, k) => { if (k < minKey) minKey = k; });
  [...Object.keys(S.focusLog), ...Object.keys(S.focusSample), ...Object.keys(S.habitLog)].forEach(k => { if (k < minKey) minKey = k; });
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
  const st = streakInfo(metric === 'tasks' ? counts : mMap);
  const sel = UI.actDay && UI.actDay >= start && UI.actDay <= realEnd ? UI.actDay : (active[active.length - 1] || realEnd);
  const rangeName = UI.actRange === 'last' ? 'دوازده ماه گذشته' : 'سال ' + fa(UI.actRange);
  const unitOf = v => (metric === 'focus' ? fmtHours(v) : metric === 'habits' ? `${faNum(v)} <small>عادت</small>` : `${faNum(v)} <small>کار</small>`);
  const headline = metric === 'focus' ? `${fmtHours(total)} تمرکز در ${rangeName}` : metric === 'habits' ? `${faNum(total)} بار انجام عادت در ${rangeName}` : `${faNum(total)} کار انجام‌شده در ${rangeName}`;
  const dayDone = allTasks().filter(t => t.status === 'done' && t.completedAt && msKey(t.completedAt) === sel).sort((a, b) => a.completedAt - b.completedAt);
  const dayHabits = (S.habitLog[sel] || []).map(id => S.habits.find(h => h.id === id)).filter(Boolean);
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
  const j = S.journal[sel];
  const html = `
  ${head('گزارش', 'نقشه فعالیت', 'هر خانه یک روز است؛ هرچه پررنگ‌تر، روز پربارتر.', '', subSwitch('report'))}
  <section class="card act-card">
    <div class="act-head"><h2 class="act-total">${headline}</h2>
      <div class="seg sm" role="tablist"><button class="${metric === 'tasks' ? 'on' : ''}" data-act="act-metric" data-m="tasks">کارها</button><button class="${metric === 'habits' ? 'on' : ''}" data-act="act-metric" data-m="habits">عادت‌ها</button><button class="${metric === 'focus' ? 'on' : ''}" data-act="act-metric" data-m="focus">تمرکز</button></div></div>
    <div class="heat-scroll" id="bigHeat"></div>
    <div class="act-foot">
      <div class="years" aria-label="انتخاب بازه">${['last', ...years].map(y => `<button class="${String(UI.actRange) === String(y) ? 'on' : ''}" data-act="act-range" data-r="${y}">${y === 'last' ? 'دوازده ماه اخیر' : fa(y)}</button>`).join('')}</div>
      ${heatLegend()}
    </div>
  </section>
  <div class="kpis">
    ${kpi('روزهای فعال', faNum(active.length), `از ${faNum(days.length)} روز`)}
    ${kpi('پیوستگی فعلی', `${faNum(st.cur)} <small>روز</small>`, st.cur ? 'زنجیره را نشکن!' : 'امروز شروع کن', st.cur ? 'kpi-good' : '')}
    ${kpi('طولانی‌ترین پیوستگی', `${faNum(st.best)} <small>روز</small>`, st.bestEnd ? 'تا ' + fmtDate(st.bestEnd) : '—')}
    ${kpi('پربارترین روز', active.length ? unitOf(val(best)) : '—', active.length ? fmtDate(best, { weekday: true }) : 'هنوز داده‌ای نیست')}
  </div>
  <div class="grid2">
    <section class="card day-log"><div class="card-h"><h3>${fmtDate(sel, { weekday: true })}</h3><span class="muted">${faNum(dayDone.length)} کار${dayHabits.length ? `، ${faNum(dayHabits.length)} عادت` : ''}</span></div>
      ${j && j.mood ? `<div class="day-mood"><b>${MOODS[j.mood].e}</b><span>حال: ${MOODS[j.mood].n}${j.note ? ' — ' + esc(j.note) : ''}</span></div>` : ''}
      ${dayHabits.length ? `<div class="t-meta">${dayHabits.map(h => `<span>${h.emoji} ${esc(h.name)}</span>`).join('')}</div>` : ''}
      ${dayDone.length ? `<ol class="commits">${dayDone.map(t => `<li data-id="${t.id}"><span class="c-dot" style="--pc:${pColor(proj(t.projectId))}"></span><time>${fmtClock(t.completedAt)}</time><button class="c-title" data-act="open">${esc(t.title)}</button><span class="c-xp">+${fa(taskXP(t))}</span></li>`).join('')}</ol>` : '<p class="empty-line">در این روز کاری انجام نشده.</p>'}
    </section>
    <section class="card"><div class="card-h"><h3>جمع ماهانه</h3><span class="muted">${metric === 'focus' ? 'ساعت تمرکز' : metric === 'habits' ? 'عادت انجام‌شده' : 'کار انجام‌شده'}</span></div><div id="chMonths" class="chart-box"></div></section>
  </div>
  <section class="card"><div class="card-h"><h3>ماه‌های اخیر به تفکیک پروژه</h3></div><div class="mblocks">${recentMonths.map(monthBlock).join('') || '<p class="empty-line">هنوز فعالیتی ثبت نشده.</p>'}</div></section>`;
  return {
    html,
    mount() {
      heatmap($('#bigHeat'), {
        start, end, cell: 13, gap: 3, value: k => (k > t0 ? 0 : val(k)), selected: sel, scrollEnd: true, label: 'نقشه فعالیت',
        tip: (k, v) => k > t0 ? `<span>${fmtDate(k, { weekday: true })}</span>` : `<b>${v ? (metric === 'focus' ? fmtMin(v) + ' تمرکز' : metric === 'habits' ? faNum(v) + ' عادت' : faNum(v) + ' کار انجام شد') : 'بدون فعالیت'}</b><span>${fmtDate(k, { weekday: true })}</span>`,
        onPick: k => { if (k <= t0) { UI.actDay = k; render(); } },
      });
      barChart($('#chMonths'), months.map((m, i) => ({
        label: J_MONTHS[m.jm - 1], value: metric === 'focus' ? +(mVals[i] / 60).toFixed(1) : mVals[i],
        tip: `<b>${J_MONTHS[m.jm - 1]} ${fa(m.jy)}</b><span>${metric === 'focus' ? fmtHours(mVals[i]) + ' تمرکز' : metric === 'habits' ? faNum(mVals[i]) + ' عادت' : faNum(mVals[i]) + ' کار انجام شد'}</span>`,
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
  const habitRows = activeHabits().map(h => ({ label: `${h.emoji} ${h.name}`, value: Math.round(habitRate(h, R) * 100), color: `var(--c${h.color})`, valText: faPct(habitRate(h, R) * 100) })).sort((a, b) => b.value - a.value);

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
  const good = [], bad = [];
  days.forEach(k => { const m = S.journal[k] && S.journal[k].mood; if (m >= 4) good.push(doneBy.get(k) || 0); else if (m && m <= 2) bad.push(doneBy.get(k) || 0); });
  const avg = a => a.reduce((x, y) => x + y, 0) / a.length;
  if (good.length >= 3 && bad.length >= 3) ins.push(['smile', `در روزهایی که حالت خوب بوده به‌طور میانگین <b>${faNum(avg(good), 1)}</b> کار انجام دادی و در روزهای بد <b>${faNum(avg(bad), 1)}</b> کار.`]);
  if (habitRows.length) ins.push(['habit', `منظم‌ترین عادتت <b>${esc(habitRows[0].label)}</b> است با ${habitRows[0].valText} انجام در این بازه.`]);
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
  ${!all.length ? `<div class="welcome"><span class="welcome-ic">${icon('chart')}</span><div class="welcome-text"><h2>هنوز داده‌ای برای تحلیل نیست</h2><p>چند کار اضافه و تیک بزن، یا داده نمونه را بارگذاری کن تا نمودارها را ببینی.</p></div><div class="welcome-act"><button class="btn primary" data-act="load-sample">بارگذاری داده نمونه</button></div></div>` : ''}
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
    ${habitRows.length ? `<section class="card"><div class="card-h"><h3>عادت‌ها</h3><span class="muted">درصد انجام در این بازه</span></div>${hbars(habitRows)}</section>` : ''}
    <section class="card"><div class="card-h"><h3>زمان تمرکز</h3><span class="muted">${weekly ? 'دقیقه در هفته' : 'دقیقه در روز'}</span></div><div id="chFocus" class="chart-box"></div></section>
    <section class="card${habitRows.length ? ' span2' : ''}"><div class="card-h"><h3>هدف روزانه</h3><div class="legend"><span><i style="background:var(--h3)"></i>رسیده</span><span><i style="background:var(--h1)"></i>نرسیده</span></div></div><div id="chGoal" class="chart-box"></div></section>
    <section class="card span2"><div class="card-h"><h3>خلاصه ماه‌ها</h3></div><div class="table-wrap"><table class="tbl"><thead><tr><th scope="col">ماه</th><th scope="col">ساخته‌شده</th><th scope="col">انجام‌شده</th><th scope="col">میانگین روزانه</th><th scope="col">تمرکز</th><th scope="col">پربارترین روز</th></tr></thead><tbody>${mRows}</tbody></table></div></section>
  </div>`;
  return {
    html,
    mount() {
      lineChart($('#chTrend'), labels, [{ name: 'انجام‌شده', color: 'var(--accent)', values: sDone, area: true }, { name: 'ساخته‌شده', color: 'var(--muted)', values: sCre }], { tipLabels, label: 'روند کارهای انجام‌شده و ساخته‌شده' });
      const hiWd = wdAvg.indexOf(Math.max(...wdAvg));
      barChart($('#chWeekday'), WEEKDAYS.map((n, i) => ({ label: isMobile() ? WD_SHORT[i] : n, value: +wdAvg[i].toFixed(2), tip: `<b>${n}</b><span>میانگین ${faNum(wdAvg[i], 1)} کار</span>` })), { hi: doneIn.length ? hiWd : -1, int: false, allLabels: true, axisFmt: v => faNum(v, 1), height: 200, label: 'میانگین کار در روزهای هفته' });
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
    cloud: 'کارهایت در حساب تو ذخیره می‌شوند و فقط خودت آن‌ها را می‌بینی؛ در دستگاه‌های دیگر هم در دسترس‌اند.',
    connecting: 'در حال اتصال به فضای ذخیره‌سازی حساب…',
    local: Native.isNative ? 'همه داده‌ها روی همین گوشی ذخیره می‌شوند و بدون اینترنت کار می‌کند. هر چند وقت یک بار پشتیبان بگیر.' : 'کارهایت در حافظه همین مرورگر ذخیره می‌شوند. هر چند وقت یک بار پشتیبان بگیر.',
  }[Store.status];
  const num = (id, label, v, min, max, suf) => `<label class="field"><span>${label}</span><div class="num-in"><input id="${id}" type="number" inputmode="numeric" min="${min}" max="${max}" value="${v}"><em>${suf}</em></div></label>`;
  const sw = (id, label, on, sub = '') => `<label class="switch"><span>${label}${sub ? `<small>${sub}</small>` : ''}</span><input type="checkbox" id="${id}"${on ? ' checked' : ''}></label>`;
  const accHex = { green: '#16a34a', blue: '#2563eb', violet: '#7c3aed', rose: '#e11d48', orange: '#ea580c', teal: '#0d9488' };
  const html = `
  ${head('', 'تنظیمات', '')}
  <div class="settings">
    <section class="card set-sec"><h3>شخصی</h3>
      <label class="field"><span>نام تو</span><input id="sName" value="${esc(st.name)}" placeholder="برای خوشامدگویی" maxlength="30"></label>
      ${num('sGoal', 'هدف روزانه', st.dailyGoal, 1, 50, 'کار در روز')}
    </section>
    <section class="card set-sec"><h3>ظاهر</h3>
      <div class="field"><span>پوسته</span><div class="seg full">${[['light', 'روشن'], ['dark', 'تیره'], ['auto', 'خودکار']].map(([v, n]) => `<button class="${st.theme === v ? 'on' : ''}" data-act="set-theme" data-v="${v}">${n}</button>`).join('')}</div></div>
      <div class="field"><span>رنگ اصلی</span><div class="accents">${Object.entries(ACCENTS).map(([v, n]) => `<button class="acc-btn${st.accent === v ? ' on' : ''}" style="--a:${accHex[v]}" data-act="set-accent" data-v="${v}" aria-label="${n}" title="${n}"></button>`).join('')}</div></div>
      <div class="field"><span>اندازه متن</span><div class="seg full">${[['s', 'کوچک'], ['m', 'معمولی'], ['l', 'بزرگ']].map(([v, n]) => `<button class="${(st.fontScale || 'm') === v ? 'on' : ''}" data-act="set-fs" data-v="${v}">${n}</button>`).join('')}</div></div>
      ${sw('sHaptics', 'بازخورد لرزشی', st.haptics, 'لرزش کوتاه هنگام تیک زدن و جابه‌جایی')}
    </section>
    <section class="card set-sec"><h3>یادآوری و اعلان</h3>
      ${sw('sNotify', 'یادآوری کارها', st.notify, 'برای کارهایی که ساعت دارند اعلان می‌آید')}
      <label class="field"><span>زمان یادآوری</span><select id="sBefore"${st.notify ? '' : ' disabled'}>${[[0, 'سر وقت'], [5, '۵ دقیقه قبل'], [10, '۱۰ دقیقه قبل'], [15, '۱۵ دقیقه قبل'], [30, 'نیم ساعت قبل'], [60, 'یک ساعت قبل']].map(([v, n]) => `<option value="${v}"${+st.remindBefore === v ? ' selected' : ''}>${n}</option>`).join('')}</select></label>
      <label class="field"><span>یادآور روزانه مرور برنامه</span><div class="num-in"><input id="sDaily" type="time" value="${st.dailyReminder || ''}"${st.notify ? '' : ' disabled'}><em>${st.dailyReminder ? 'هر روز' : 'خاموش'}</em></div></label>
    </section>
    <section class="card set-sec"><h3>تایمر تمرکز</h3>
      <div class="field-grid">${num('sWork', 'تمرکز', p.work, 1, 180, 'دقیقه')}${num('sShort', 'استراحت کوتاه', p.short, 1, 60, 'دقیقه')}${num('sLong', 'استراحت بلند', p.long, 1, 90, 'دقیقه')}${num('sEvery', 'استراحت بلند بعد از', p.every, 1, 12, 'جلسه')}</div>
      ${sw('sSound', 'صدای پایان جلسه', st.sound)}
      ${sw('sAutoNext', 'شروع خودکار مرحله بعد', st.autoNext, 'بعد از هر جلسه، استراحت یا جلسه بعدی خودش شروع می‌شود')}
    </section>
    <section class="card set-sec"><div class="card-h"><h3>پروژه‌ها</h3><button class="btn sm" data-act="new-project">${icon('plus')}پروژه جدید</button></div>
      ${S.projects.length ? `<ul class="proj-list">${S.projects.map(x => { const n = allTasks().filter(t => t.projectId === x.id).length; return `<li><span class="pdot" style="background:var(--c${x.color})"></span><b>${esc(x.name)}</b><span class="muted">${faNum(n)} کار</span><button class="icon-btn sm" data-act="edit-project" data-pid="${x.id}" aria-label="ویرایش ${esc(x.name)}">${icon('edit')}</button></li>`; }).join('')}</ul>` : '<p class="empty-line">هنوز پروژه‌ای نساختی.</p>'}
    </section>
    <section class="card set-sec"><h3>داده‌ها</h3>
      <p class="sync-line">${syncBadge()}</p><p class="muted sm">${storageTxt}</p>
      <div class="btn-row"><button class="btn" data-act="export">${icon('download')}دریافت پشتیبان</button><button class="btn" data-act="import">${icon('upload')}بازیابی از فایل</button><input type="file" id="importFile" accept="application/json,.json" hidden></div>
      <div class="btn-row">${hasSample() ? `<button class="btn" data-act="remove-sample">حذف داده نمونه</button>` : `<button class="btn" data-act="load-sample">بارگذاری داده نمونه</button>`}<button class="btn danger ghost" data-act="clear-all">پاک کردن همه داده‌ها</button></div>
    </section>
    <section class="card set-sec span-all only-d"><h3>میان‌برهای صفحه‌کلید</h3>${shortcutsTable()}</section>
    <section class="card set-sec span-all"><div class="about">${MARK}<div><b>روزنگار</b> <span class="muted sm">نسخه ${fa(APP_VERSION)}</span><p class="muted sm">کارها، عادت‌ها و تمرکز با تقویم شمسی. بدون تبلیغ، بدون ردیابی؛ داده‌ها مال خودت است.</p></div>${installPrompt ? `<button class="btn primary push" data-act="install">${icon('download')}نصب برنامه</button>` : ''}</div></section>
  </div>`;
  return { html };
}
const SHORTCUTS = [['N', 'افزودن کار جدید'], ['Ctrl + K', 'جستجو و فرمان'], ['1 … 5', 'رفتن به بخش‌های اصلی'], ['Space', 'شروع و توقف تایمر در بخش تمرکز'], ['Esc', 'بستن پنجره‌ها'], ['?', 'راهنمای میان‌برها']];
const shortcutsTable = () => `<table class="kbd-tbl"><tbody>${SHORTCUTS.map(([k, d]) => `<tr><td><kbd>${k}</kbd></td><td>${d}</td></tr>`).join('')}</tbody></table>`;

const VIEW_FN = { today: viewToday, upcoming: viewUpcoming, all: viewList, project: viewList, tag: viewList, board: viewBoard, matrix: viewMatrix, calendar: viewCalendar, habits: viewHabits, focus: viewFocus, activity: viewActivity, stats: viewStats, settings: viewSettings };
