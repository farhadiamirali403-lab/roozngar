'use strict';
/* روزنگار · عملیات، رویدادها و راه‌اندازی */
document.documentElement.lang = 'fa';
document.documentElement.dir = 'rtl';

/* ---------- عملیات کار ---------- */
function toggleTask(id) {
  const t = S.tasks.get(id);
  if (!t) return;
  const wasDone = t.status === 'done', lv = levelOf(totalXP()).L;
  setStatus(t, wasDone ? 'todo' : 'done');
  if (UI.drawerId === id) renderDrawer();
  if (wasDone) { hap('light'); render(); return; }
  hap('success');
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
  hap('medium');
  render();
  toast(`«${esc(copy.title)}» حذف شد`, { undo: () => { Store.touchTask(normTask(copy)); render(); } });
}
function postpone(id) {
  const t = S.tasks.get(id);
  if (!t || !isOpen(t)) return;
  const t0 = todayKey(), prev = t.due;
  t.due = t.due && t.due > t0 ? addDays(t.due, 1) : addDays(t0, 1);
  Store.touchTask(t);
  hap('light');
  render();
  toast(`«${esc(t.title)}» به ${relDate(t.due)} رفت.`, { undo: () => { const x = S.tasks.get(id); if (x) { x.due = prev; Store.touchTask(x); render(); } } });
}
function moveOverdue() {
  const t0 = todayKey(), list = allTasks().filter(t => isOpen(t) && t.due && t.due < t0);
  if (!list.length) return;
  const prev = list.map(t => [t.id, t.due]);
  list.forEach(t => { t.due = t0; Store.touchTask(t); });
  render();
  toast(`${faNum(list.length)} کار به امروز منتقل شد.`, { undo: () => { prev.forEach(([id, d]) => { const t = S.tasks.get(id); if (t) { t.due = d; Store.touchTask(t); } }); render(); } });
}
function dStatus(v) {
  const t = curTask();
  if (!t) return;
  const lv = levelOf(totalXP()).L, was = t.status;
  setStatus(t, v);
  renderDrawer();
  render();
  if (v === 'done' && was !== 'done') { hap('success'); toast(`انجام شد، <b>+${faNum(taskXP(t))}</b> امتیاز`, { kind: 'good' }); afterComplete(lv); }
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

/* ---------- عادت‌ها ---------- */
function toggleHabit(hid, k) {
  const h = S.habits.find(x => x.id === hid);
  if (!h || k > todayKey()) return;
  const on = !habitDoneOn(h, k), lv = levelOf(totalXP()).L;
  setHabit(h, k, on);
  hap(on ? 'success' : 'light');
  render();
  const chip = $(`.hchip[data-hid="${hid}"], .habit[data-hid="${hid}"] .habit-go`);
  if (on && chip) chip.classList.add('pop');
  if (!on) return;
  const t0 = todayKey(), due = activeHabits().filter(x => habitDueOn(x, t0));
  const s = habitStreak(h).cur;
  if (levelOf(totalXP()).L > lv) { toast(`${icon('trophy')}به سطح ${faNum(levelOf(totalXP()).L)} رسیدی!`, { kind: 'good' }); confetti(); }
  else if (k === t0 && due.length > 1 && due.every(x => habitDoneOn(x, t0))) { toast('همه عادت‌های امروز انجام شد! 🎉', { kind: 'good' }); confetti(); }
  else if (k === t0 && [7, 21, 30, 66, 100].includes(s)) { toast(`${h.emoji} ${faNum(s)} روز پیوسته «${esc(h.name)}»! فوق‌العاده است.`, { kind: 'good', ms: 5000 }); confetti(); }
}
function saveHabit() {
  const name = ($('#hmName').value || '').trim();
  if (!name) { $('#hmName').focus(); toast('یک نام برای عادت بنویس.', { kind: 'bad' }); return; }
  if (!UI.hm.days.size) { toast('دست‌کم یک روز را انتخاب کن.', { kind: 'bad' }); return; }
  const days = UI.hm.days.size === 7 ? [] : [...UI.hm.days].sort();
  const h = UI.hm.id && S.habits.find(x => x.id === UI.hm.id);
  if (h) Object.assign(h, { name, emoji: UI.hm.emoji, color: UI.hm.color, days });
  else S.habits.push({ id: uid('h'), name, emoji: UI.hm.emoji, color: UI.hm.color, days, createdAt: Date.now() });
  Store.touchMeta();
  closeModal();
  hap('light');
  if (!h && UI.view !== 'habits' && UI.view !== 'today') go('habits'); else render();
  toast(h ? 'عادت به‌روز شد.' : `عادت «${esc(name)}» ساخته شد. ${UI.hm.emoji}`);
}
function deleteHabit(id) {
  const h = S.habits.find(x => x.id === id);
  if (!h) return;
  confirmBox('حذف عادت', `عادت «${esc(h.name)}» و همه سابقه‌اش حذف می‌شود.`, 'حذف عادت', () => {
    S.habits = S.habits.filter(x => x.id !== id);
    for (const k of Object.keys(S.habitLog)) { const a = S.habitLog[k].filter(x => x !== id); if (a.length) S.habitLog[k] = a; else delete S.habitLog[k]; }
    Store.touchMeta();
    render();
    toast('عادت حذف شد.');
  });
}

/* ---------- حال روز و اشتراک خلاصه ---------- */
function setMood(k, v) {
  const j = Object.assign({}, S.journal[k]);
  j.mood = v;
  delete j.sample;
  S.journal[k] = j;
  Store.touchMeta();
  hap('select');
  render();
}
async function shareDay() {
  const t0 = todayKey(), all = allTasks();
  const done = all.filter(t => t.status === 'done' && t.completedAt && msKey(t.completedAt) === t0);
  const left = all.filter(t => isOpen(t) && t.due && t.due <= t0);
  const habs = activeHabits().filter(h => habitDueOn(h, t0));
  const j = S.journal[t0];
  const lines = [`📅 ${fmtDate(t0, { weekday: true })}`, `✅ ${faNum(done.length)} کار انجام شد${left.length ? `، ${faNum(left.length)} کار مانده` : ''}`];
  done.slice(0, 8).forEach(t => lines.push(`  • ${t.title}`));
  if (focusOn(t0)) lines.push(`⏱️ ${fmtMin(focusOn(t0))} تمرکز`);
  if (habs.length) lines.push(`🌱 عادت‌ها: ${habs.map(h => (habitDoneOn(h, t0) ? '✔ ' : '✗ ') + h.name).join('، ')}`);
  if (j && j.mood) lines.push(`${MOODS[j.mood].e} حال امروز: ${MOODS[j.mood].n}`);
  const st = streakInfo(doneByDay());
  if (st.cur > 1) lines.push(`🔥 ${faNum(st.cur)} روز پیوسته`);
  lines.push('— روزنگار');
  const text = lines.join('\n');
  if (await Native.shareText('خلاصه امروز', text)) return;
  try { await navigator.clipboard.writeText(text); toast('خلاصه امروز کپی شد.'); } catch (e) { openModal(`<h2>خلاصه امروز</h2><textarea id="expText" rows="9" readonly>${esc(text)}</textarea><div class="m-foot"><span class="grow"></span><button class="btn" data-act="m-close">بستن</button><button class="btn primary" data-act="copy-export">${icon('copy')}کپی</button></div>`); }
}

/* ---------- پروژه‌ها ---------- */
function projectModal(id) {
  const p = id ? proj(id) : null;
  const used = new Set(S.projects.map(x => x.color));
  UI.pm = { id, color: p ? p.color : ([0, 1, 2, 3, 4, 5, 6, 7].find(c => !used.has(c)) ?? S.projects.length % 8) };
  openModal(`<h2>${p ? 'ویرایش پروژه' : 'پروژه جدید'}</h2>
    <label class="field"><span>نام</span><input id="pmName" value="${p ? esc(p.name) : ''}" placeholder="مثلاً دانشگاه" maxlength="40"${isMobile() ? '' : ' autofocus'}></label>
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
    ['!فوری، !بالا، !متوسط، !کم', 'اولویت'], ['#نام_پروژه', 'پروژه'], ['@برچسب', 'برچسب'], ['~30 یا ~2ساعت', 'زمان تخمینی'], ['هر روز، هر هفته، هر ماه، روزهای کاری', 'تکرار'],
  ];
  openModal(`<h2>نوشتن سریع</h2><p class="muted">لازم نیست چیزی را انتخاب کنی؛ کافی است بنویسی. این کلمه‌ها خودکار تشخیص داده می‌شوند:</p>
    <table class="kbd-tbl"><tbody>${rows.map(([a, b]) => `<tr><td><code>${a}</code></td><td>${b}</td></tr>`).join('')}</tbody></table>
    <p class="example">مثال: <code>تحویل گزارش پنج‌شنبه ساعت ۱۰ #کار !فوری</code></p>
    <p class="muted sm">در گوشی: کار را به چپ بکش تا انجام شود و به راست تا به فردا برود.</p>
    <div class="m-foot"><span class="grow"></span><button class="btn primary" data-act="m-close">فهمیدم</button></div>`);
}
function shortcutsModal() { openModal(`<h2>میان‌برهای صفحه‌کلید</h2>${shortcutsTable()}<div class="m-foot"><span class="grow"></span><button class="btn primary" data-act="m-close">بستن</button></div>`, 'sm'); }

/* ---------- پشتیبان، داده نمونه ---------- */
async function exportData() {
  const data = JSON.stringify(Object.assign({ app: 'roozngar', version: APP_VERSION, exportedAt: new Date().toISOString() }, Store.serialize()));
  const filename = `roozngar-${todayKey()}.json`;
  if (Native.isNative) {
    try { if (await Native.saveFile(filename, data)) return; } catch (e) { if (e && /cancel/i.test(String(e.message || e))) return; }
  }
  const c = window.claude;
  if (Native.isNative || (c && typeof c.use === 'function')) {
    if (!Native.isNative) {
      try {
        const dl = await c.use('downloads');
        if (dl) { await dl.save({ filename, data }); toast('فایل پشتیبان آماده شد.'); return; }
      } catch (e) { if (e && e.code === 'declined') return; }
    }
    openModal(`<h2>پشتیبان داده‌ها</h2><p class="muted">این متن را کپی کن و در فایلی با پسوند json نگه دار.</p><textarea class="mono" readonly rows="8" id="expText">${esc(data)}</textarea><div class="m-foot"><span class="grow"></span><button class="btn" data-act="m-close">بستن</button><button class="btn primary" data-act="copy-export">${icon('copy')}کپی</button></div>`);
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
  const fallback = () => { el.focus(); el.select(); try { document.execCommand('copy'); done(); } catch (e) { toast('متن انتخاب شد؛ آن را کپی کن.'); } };
  try { navigator.clipboard.writeText(el.value).then(done, fallback); } catch (e) { fallback(); }
}
function importFile(file) {
  const fr = new FileReader();
  fr.onload = () => {
    let d;
    try { d = JSON.parse(fr.result); } catch (e) { toast('این فایل، پشتیبان معتبر روزنگار نیست.', { kind: 'bad' }); return; }
    if (!d || !Array.isArray(d.tasks)) { toast('در این فایل کاری پیدا نشد.', { kind: 'bad' }); return; }
    UI.importData = d;
    openModal(`<h2>بازیابی از پشتیبان</h2><p>${faNum(d.tasks.length)} کار، ${faNum((d.projects || []).length)} پروژه و ${faNum((d.habits || []).length)} عادت در فایل هست. با داده‌های فعلی ادغام شود یا همه را جایگزین کند؟</p>
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
  S.habits = [];
  S.habitLog = {};
  S.journal = {};
  bs.forEach(b => Store.dirty.add(b));
  Store.touchMeta();
}
function applyImport(replace) {
  const d = UI.importData;
  if (!d) return;
  if (replace) wipeAll();
  d.tasks.forEach(t => { if (t && t.id && typeof t.title === 'string' && !S.tasks.has(t.id)) Store.touchTask(normTask(t)); });
  (d.projects || []).forEach(p => { if (p && p.id && !proj(p.id)) S.projects.push(p); });
  (d.habits || []).forEach(h => { if (h && h.id && typeof h.name === 'string' && !S.habits.some(x => x.id === h.id)) S.habits.push(h); });
  for (const [k, ids] of Object.entries(d.habitLog || {})) if (Array.isArray(ids)) S.habitLog[k] = [...new Set([...(S.habitLog[k] || []), ...ids])];
  for (const [k, j] of Object.entries(d.journal || {})) if (!S.journal[k] && j) S.journal[k] = j;
  if (replace) {
    if (d.settings) Store.hydrateMeta(Object.assign(metaBody(), { settings: d.settings }));
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
  S.habits.push(...d.habits);
  for (const [k, ids] of Object.entries(d.habitLog)) S.habitLog[k] = (S.habitLog[k] || []).concat(ids);
  for (const [k, j] of Object.entries(d.journal)) if (!S.journal[k]) S.journal[k] = j;
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
  const hs = new Set(S.habits.filter(h => h.sample).map(h => h.id));
  S.habits = S.habits.filter(h => !h.sample);
  for (const k of Object.keys(S.habitLog)) { const a = S.habitLog[k].filter(x => !hs.has(x)); if (a.length) S.habitLog[k] = a; else delete S.habitLog[k]; }
  for (const k of Object.keys(S.journal)) if (S.journal[k] && S.journal[k].sample) delete S.journal[k];
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
  p.innerHTML = `<div class="modal pal" role="dialog" aria-modal="true" aria-label="جستجو"><label class="pal-in">${icon('search')}<input id="palIn" placeholder="جستجوی کار، عادت یا بخش…" autocomplete="off"></label><div id="palList" class="pal-list" role="listbox"></div></div>`;
  p.hidden = false;
  updatePalette();
  $('#palIn').focus();
}
function closePalette() { $('#palette').hidden = true; }
function updatePalette() {
  const q = normFa(($('#palIn') || {}).value || '').trim();
  const cmds = [
    { label: 'کار جدید', icon: 'plus', run: focusQuickAdd },
    { label: 'عادت جدید', icon: 'habit', run: () => habitModal(null) },
    ...VIEWS.map(v => ({ label: v.name, icon: v.icon, run: () => go(v.id) })),
    { label: 'شروع تایمر تمرکز', icon: 'timer', run: () => { go('focus'); Timer.start(); } },
    { label: 'تغییر پوسته روشن و تیره', icon: 'moon', run: cycleTheme },
    { label: 'اشتراک خلاصه امروز', icon: 'share', run: shareDay },
    { label: 'پروژه جدید', icon: 'folder', run: () => projectModal(null) },
    ...S.projects.map(p => ({ label: 'پروژه ' + p.name, icon: 'folder', run: () => go('project', { projectId: p.id }) })),
    ...topTags(12).map(([g]) => ({ label: 'برچسب #' + g, icon: 'sparkle', run: () => go('tag', { tag: g }) })),
  ];
  let items = cmds.slice(0, 14);
  if (q) {
    const tasks = allTasks().filter(t => normFa(t.title + ' ' + t.tags.join(' ') + ' ' + t.notes).includes(q))
      .sort((a, b) => (a.status === 'done') - (b.status === 'done') || b.createdAt - a.createdAt).slice(0, 8)
      .map(t => ({ label: t.title, sub: t.status === 'done' ? 'انجام‌شده' : t.due ? relDate(t.due) : '', icon: t.status === 'done' ? 'check' : 'list', run: () => openTask(t.id) }));
    const habits = activeHabits().filter(h => normFa(h.name).includes(q)).map(h => ({ label: h.emoji + ' ' + h.name, sub: habitDoneOn(h, todayKey()) ? 'امروز انجام شد' : 'ثبت امروز', icon: 'habit', run: () => toggleHabit(h.id, todayKey()) }));
    items = [...tasks, ...habits, ...cmds.filter(c => normFa(c.label).includes(q))];
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

/* ---------- کشیدن کار به چپ و راست (فقط لمسی) ---------- */
const SW = { row: null, task: null, x0: 0, y0: 0, dx: 0, lock: null, suppress: 0 };
const SW_MIN = 84;
document.addEventListener('pointerdown', e => {
  if (e.pointerType !== 'touch') return;
  const task = e.target.closest('.trow > .task');
  if (!task || e.target.closest('.check, .t-act')) return;
  Object.assign(SW, { row: task.parentElement, task, x0: e.clientX, y0: e.clientY, dx: 0, lock: null });
}, { passive: true });
document.addEventListener('pointermove', e => {
  if (!SW.task || e.pointerType !== 'touch') return;
  const dx = e.clientX - SW.x0, dy = e.clientY - SW.y0;
  if (!SW.lock) {
    if (Math.abs(dy) > 10 && Math.abs(dy) > Math.abs(dx)) { SW.task = null; return; }
    if (Math.abs(dx) > 12 && Math.abs(dx) > Math.abs(dy) * 1.4) { SW.lock = 'x'; SW.task.classList.add('swiping'); }
    else return;
  }
  const done = SW.task.classList.contains('is-done');
  SW.dx = dx > 0 && done ? Math.min(dx, 24) : dx;
  SW.task.style.transform = `translateX(${SW.dx}px)`;
  SW.row.classList.toggle('s-done', SW.dx < 0);
  SW.row.classList.toggle('s-later', SW.dx > 0);
  const armed = Math.abs(SW.dx) >= SW_MIN;
  if (armed !== SW.row.classList.contains('armed')) { SW.row.classList.toggle('armed', armed); if (armed) hap('select'); }
}, { passive: true });
function swipeEnd() {
  const { task, row, dx, lock } = SW;
  SW.task = null;
  if (!task || lock !== 'x') return;
  SW.suppress = Date.now();
  task.classList.remove('swiping');
  const id = task.dataset.id;
  if (Math.abs(dx) >= SW_MIN) {
    task.style.transform = `translateX(${dx < 0 ? '-110%' : '110%'})`;
    setTimeout(() => (dx < 0 ? toggleTask(id) : postpone(id)), 180);
    if (UI.swipeHint) { UI.swipeHint = false; saveUI(); }
  } else {
    task.style.transform = '';
    setTimeout(() => row.classList.remove('s-done', 's-later', 'armed'), 250);
  }
}
document.addEventListener('pointerup', swipeEnd);
document.addEventListener('pointercancel', () => { if (SW.task && SW.lock === 'x') swipeEnd(); else SW.task = null; });

/* ---------- رویدادها ---------- */
document.addEventListener('click', e => {
  if (Date.now() - SW.suppress < 350 && e.target.closest('.trow')) { e.preventDefault(); return; }
  const a = e.target.closest('[data-act]');
  if (!$('#dp').hidden && !e.target.closest('#dp') && !(a && ['d-date', 'sq-date'].includes(a.dataset.act))) closeDP();
  if (e.target.id === 'modal') { closeModal(); return; }
  if (e.target.id === 'palette') { closePalette(); return; }
  if (e.target.id === 'sheet') { closeSheet(); return; }
  if (e.target.id === 'scrim') { closeDrawer(); closeSide(); return; }
  if (!a) return;
  const act = a.dataset.act, host = a.closest('[data-id]'), id = host ? host.dataset.id : null;
  const hHost = a.closest('[data-hid]'), hid = a.dataset.hid || (hHost ? hHost.dataset.hid : null);
  switch (act) {
    case 'nav': hap('select'); navGo(a.dataset.nav); break;
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
    case 'theme-toggle': cycleTheme(); break;
    case 'add-sheet': hap('light'); openAddSheet(); break;
    case 'sq-submit': submitSheet(); break;
    case 'sq-due': UI.sq.due = a.dataset.k || null; $('#sqPicks').innerHTML = sqPicksHTML(); break;
    case 'sq-pri': UI.sq.priority = UI.sq.priority === +a.dataset.v ? 0 : +a.dataset.v; $('#sqPicks').innerHTML = sqPicksHTML(); break;
    case 'sq-proj': UI.sq.projectId = UI.sq.projectId === a.dataset.pid ? null : a.dataset.pid; $('#sqPicks').innerHTML = sqPicksHTML(); break;
    case 'sq-date': openDP(a, UI.sq.due, k => { if (UI.sq) { UI.sq.due = k; $('#sqPicks').innerHTML = sqPicksHTML(); } }); break;
    case 'new-project': projectModal(null); break;
    case 'edit-project': projectModal(a.dataset.pid); break;
    case 'pm-color': UI.pm.color = +a.dataset.c; $$('.sw-btn').forEach(b => b.classList.toggle('on', b === a)); break;
    case 'pm-save': saveProject(); break;
    case 'pm-del': deleteProject(UI.pm.id); break;
    case 'habit-new': habitModal(null); break;
    case 'habit-edit': habitModal(hid); break;
    case 'habit-toggle': toggleHabit(hid, a.dataset.k); break;
    case 'hm-emoji': UI.hm.emoji = a.dataset.e; $$('.emoji-grid button').forEach(b => b.classList.toggle('on', b === a)); break;
    case 'hm-color': UI.hm.color = +a.dataset.c; $$('.sw-btn').forEach(b => b.classList.toggle('on', b === a)); break;
    case 'hm-day': { const d = +a.dataset.d; if (UI.hm.days.has(d)) UI.hm.days.delete(d); else UI.hm.days.add(d); a.classList.toggle('on', UI.hm.days.has(d)); a.setAttribute('aria-pressed', UI.hm.days.has(d)); break; }
    case 'hm-save': saveHabit(); break;
    case 'hm-del': { const hId = UI.hm.id; closeModal(); deleteHabit(hId); break; }
    case 'mood': setMood(a.dataset.k, +a.dataset.v); break;
    case 'mood-clear': { const j = S.journal[a.dataset.k]; if (j) { delete j.mood; if (!j.note) delete S.journal[a.dataset.k]; Store.touchMeta(); render(); } break; }
    case 'share-day': shareDay(); break;
    case 'hide-swipe-hint': UI.swipeHint = false; saveUI(); render(); break;
    case 'm-close': closeModal(); break;
    case 'm-ok': { const f = modalOk; closeModal(); if (f) f(); break; }
    case 'load-sample': loadSample(); break;
    case 'remove-sample': confirmBox('حذف داده نمونه', 'کارها، پروژه‌ها و عادت‌های نمونه حذف می‌شوند. چیزهایی که خودت ساخته‌ای سر جایشان می‌مانند.', 'حذف داده نمونه', removeSample); break;
    case 'dismiss-welcome': S.settings.welcomed = true; Store.touchMeta(); render(); focusQuickAdd(); break;
    case 'toggle-done-today': UI.showDoneToday = !UI.showDoneToday; saveUI(); render(); break;
    case 'move-overdue': moveOverdue(); break;
    case 'qa-help': quickHelp(); break;
    case 'qa-due-clear': UI.qaDue = null; updateQaChips(); break;
    case 'qa-day': if (isMobile()) { openAddSheet({ due: a.dataset.k }); break; } UI.qaDue = a.dataset.k; window.scrollTo({ top: 0, behavior: 'smooth' }); updateQaChips(); $('#qaInput') && $('#qaInput').focus({ preventScroll: true }); break;
    case 'jump-day': { const k = a.dataset.k; if (k === todayKey()) go('today'); else { const s = document.getElementById('d-' + k); if (s) s.scrollIntoView({ behavior: 'smooth', block: 'start' }); } break; }
    case 'more': UI.limit += 80; render(); break;
    case 'f-status': UI.fStatus = a.dataset.v; UI.limit = 80; saveUI(); render(); break;
    case 'board-move': { const t = S.tasks.get(id); if (t) { const lv = levelOf(totalXP()).L, to = a.dataset.to; setStatus(t, to); hap(to === 'done' ? 'success' : 'light'); render(); if (to === 'done') afterComplete(lv); } break; }
    case 'cal-prev': shiftCal(-1); break;
    case 'cal-next': shiftCal(1); break;
    case 'cal-today': { const j = jOf(todayKey()); UI.calY = j.jy; UI.calM = j.jm; UI.calSel = todayKey(); render(); break; }
    case 'cal-day': UI.calSel = a.dataset.k; hap('select'); render(); break;
    case 'act-range': UI.actRange = a.dataset.r; UI.actDay = null; render(); break;
    case 'act-metric': UI.actMetric = a.dataset.m; saveUI(); render(); break;
    case 'stats-range': UI.statsRange = +a.dataset.r; saveUI(); render(); break;
    case 'tm-toggle': if (Timer.running) Timer.pause(); else Timer.start(); break;
    case 'tm-reset': Timer.reset(); break;
    case 'tm-skip': Timer.skip(); break;
    case 'tm-mode': Timer.setMode(a.dataset.m); break;
    case 'ambient': S.settings.ambient = a.dataset.v; Store.touchMeta(); $$('.tm-amb .seg button').forEach(b => b.classList.toggle('on', b === a)); Ambient.sync(); if (a.dataset.v !== 'off' && !Timer.running) toast('صدا با شروع تایمر تمرکز پخش می‌شود.'); break;
    case 'set-theme': S.settings.theme = a.dataset.v; Store.touchMeta(); applyTheme(); render(); break;
    case 'set-accent': S.settings.accent = a.dataset.v; Store.touchMeta(); applyTheme(); hap('select'); render(); break;
    case 'set-fs': S.settings.fontScale = a.dataset.v; Store.touchMeta(); applyTheme(); render(); break;
    case 'export': exportData(); break;
    case 'import': $('#importFile').click(); break;
    case 'import-merge': applyImport(false); break;
    case 'import-replace': applyImport(true); break;
    case 'copy-export': copyText($('#expText')); break;
    case 'clear-all': confirmBox('پاک کردن همه داده‌ها', 'همه کارها، پروژه‌ها، عادت‌ها و سابقه تمرکز برای همیشه پاک می‌شوند. اگر لازم داری، اول پشتیبان بگیر.', 'پاک کردن همه', () => { wipeAll(); render(); toast('همه داده‌ها پاک شد.'); }); break;
    case 'pal-run': runPal(+a.dataset.i); break;
    case 'd-close': closeDrawer(); break;
    case 'd-status': dStatus(a.dataset.v); break;
    case 'd-pri': dPatch({ priority: +a.dataset.v }); hap('select'); renderDrawer(); break;
    case 'd-date': { const t = curTask(); if (t) openDP(a, t.due, k => { dPatch(k ? { due: k } : { due: null, time: null, recur: null }); renderDrawer(); }); break; }
    case 'd-date-clear': dPatch({ due: null, time: null, recur: null }); renderDrawer(); break;
    case 'd-sub-toggle': { const t = curTask(), s = t && t.subtasks.find(x => x.id === a.dataset.sid); if (s) { s.done = !s.done; hap(s.done ? 'success' : 'light'); dPatch({}); renderDrawer(); } break; }
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
    case 'sqInput': $('#sqChips').innerHTML = qaChipsHTML(el.value, false); break;
    case 'fSearch': UI.fSearch = el.value; UI.limit = 80; requestRender(); break;
    case 'dTitle': autoGrow(el); dPatch({ title: el.value.replace(/\n/g, ' ') }); break;
    case 'dNotes': dPatch({ notes: el.value }); break;
    case 'palIn': updatePalette(); break;
    case 'jNote': { const k = el.dataset.k, j = Object.assign({}, S.journal[k]); j.note = el.value.slice(0, 500); delete j.sample; if (j.note || j.mood) S.journal[k] = j; else delete S.journal[k]; Store.touchMeta(); break; }
  }
});
document.addEventListener('toggle', e => { if (e.target.id === 'dMore') UI.dMore = e.target.open; }, true);
document.addEventListener('change', async e => {
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
    case 'sAutoNext': S.settings.autoNext = el.checked; Store.touchMeta(); break;
    case 'sHaptics': S.settings.haptics = el.checked; Store.touchMeta(); hap('medium'); break;
    case 'sNotify': {
      if (el.checked && !(await Native.notifyPermission(true))) {
        el.checked = false;
        toast(Native.isNative ? 'اجازه اعلان داده نشد؛ از تنظیمات گوشی آن را فعال کن.' : 'مرورگر اجازه اعلان نداد.', { kind: 'bad' });
        break;
      }
      S.settings.notify = el.checked;
      Store.touchMeta();
      render();
      if (el.checked) toast(Native.isNative ? 'یادآوری‌ها فعال شد.' : 'یادآوری‌ها تا وقتی این صفحه باز است کار می‌کنند. برای یادآوری همیشگی نسخه اندروید را نصب کن.', { kind: 'good', ms: 5000 });
      break;
    }
    case 'sBefore': S.settings.remindBefore = +el.value; Store.touchMeta(); break;
    case 'sDaily': S.settings.dailyReminder = el.value || ''; Store.touchMeta(); render(); break;
    case 'importFile': if (el.files && el.files[0]) importFile(el.files[0]); el.value = ''; break;
  }
});
document.addEventListener('submit', e => {
  if (e.target.id === 'qaForm') { e.preventDefault(); submitQuick(); }
  if (e.target.id === 'sqForm') { e.preventDefault(); submitSheet(); }
});
document.addEventListener('keydown', e => {
  const el = e.target, tag = (el.tagName || '').toLowerCase();
  const typing = tag === 'input' || tag === 'textarea' || tag === 'select' || el.isContentEditable;
  if (e.key === 'Enter' && !e.isComposing) {
    if (el.id === 'dTagIn') { e.preventDefault(); addTag(el.value); return; }
    if (el.id === 'dSubIn') { e.preventDefault(); addSub(el.value); return; }
    if (el.id === 'pmName') { e.preventDefault(); saveProject(); return; }
    if (el.id === 'hmName') { e.preventDefault(); saveHabit(); return; }
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
  if (!$('#modal').hidden || !$('#palette').hidden || !$('#sheet').hidden) return;
  if (e.code === 'KeyN') { e.preventDefault(); focusQuickAdd(); }
  else if (e.code === 'Slash' && e.shiftKey) { e.preventDefault(); shortcutsModal(); }
  else if (e.code === 'Slash') { e.preventDefault(); openPalette(); }
  else if (/^Digit[1-5]$/.test(e.code)) navGo(NAV[+e.code.slice(5) - 1].id);
  else if (e.code === 'Space' && UI.view === 'focus' && tag !== 'button') { e.preventDefault(); if (Timer.running) Timer.pause(); else Timer.start(); }
});

/* کشیدن و رها کردن در بُرد و ماتریس (ماوس) */
document.addEventListener('dragstart', e => {
  const c = e.target.closest && e.target.closest('.bcard');
  if (!c) return;
  e.dataTransfer.setData('text/plain', c.dataset.id);
  e.dataTransfer.effectAllowed = 'move';
  c.classList.add('dragging');
});
document.addEventListener('dragend', () => { $$('.dragging').forEach(x => x.classList.remove('dragging')); $$('.over').forEach(x => x.classList.remove('over')); });
document.addEventListener('dragover', e => {
  const col = e.target.closest && e.target.closest('.bcol, .quad');
  if (!col) return;
  e.preventDefault();
  $$('.over').forEach(x => x !== col && x.classList.remove('over'));
  col.classList.add('over');
});
document.addEventListener('drop', e => {
  const col = e.target.closest && e.target.closest('.bcol, .quad');
  if (!col) return;
  e.preventDefault();
  const t = S.tasks.get(e.dataTransfer.getData('text/plain'));
  if (t && col.dataset.quad) { if (quadOf(t) !== +col.dataset.quad) moveToQuad(t, +col.dataset.quad); render(); return; }
  const to = col.dataset.col;
  if (t && t.status !== to) { const lv = levelOf(totalXP()).L; setStatus(t, to); render(); if (to === 'done') afterComplete(lv); }
  else render();
});
let lastW = window.innerWidth, rzT = 0;
window.addEventListener('resize', () => {
  clearTimeout(rzT);
  rzT = setTimeout(() => {
    if (Math.abs(window.innerWidth - lastW) < 2) return;
    lastW = window.innerWidth;
    render();
    if (!$('#dp').hidden && DP.anchor) placeDP();
  }, 180);
});
window.addEventListener('scroll', () => {
  Tip.hide();
  const m = $('.mbar');
  if (m) m.classList.toggle('scrolled', window.scrollY > 4);
}, { passive: true });

/* ---------- راه‌اندازی ---------- */
let dayKey = todayKey();
function boot() {
  Store.onChange = () => { requestRender(); if (UI.drawerId && !S.tasks.get(UI.drawerId)) closeDrawer(); };
  Store.onStatus = () => renderSide();
  Store.onError = msg => toast(msg, { kind: 'bad', ms: 7000 });
  const baseSchedule = Store.schedule.bind(Store);
  Store.schedule = () => { baseSchedule(); Reminders.sync(); };
  Store.loadLocal();
  applyTheme();
  mqDark.addEventListener('change', () => { if (S.settings.theme === 'auto') { applyTheme(); render(); } });
  const h = (location.hash || '').slice(1);
  if (VIEWS.some(v => v.id === h)) UI.view = h;
  if (!VIEW_FN[UI.view] || (UI.view === 'project' && !proj(UI.projectId)) || (UI.view === 'tag' && !UI.tag)) UI.view = 'today';
  Timer.load();
  render();
  Store.connect();
  Reminders.sync();
  if (h === 'add') setTimeout(() => openAddSheet(), 200);
  window.addEventListener('pagehide', () => Store.saveLocal());
  document.addEventListener('visibilitychange', () => { if (document.hidden) Store.saveLocal(); });
  Native.onBack(() => {
    if (closeTop()) return;
    if (UI.view !== 'today') { go('today'); return; }
    Native.exit();
  });
  Native.onResume(() => { if (todayKey() !== dayKey) { dayKey = todayKey(); render(); } else paintTimer(true); });
  Native.onNotifyTap(key => {
    if (key && key.startsWith('t:') && S.tasks.get(key.slice(2))) openTask(key.slice(2));
    else if (key === 'timer') go('focus');
    else go('today');
  });
  setInterval(() => { if (todayKey() !== dayKey) { dayKey = todayKey(); render(); } }, 60000);
  if (!Native.isNative && !window.claude && 'serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('sw.js').catch(() => {});
}
boot();
