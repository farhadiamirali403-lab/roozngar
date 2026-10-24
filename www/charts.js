'use strict';
/* روزنگار · نمودارها: SVG دست‌ساز، راست‌به‌چپ (زمان از راست به چپ جلو می‌رود) */

const escH = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const Tip = {
  el: null,
  show(html, x, y) {
    const el = this.el || (this.el = document.getElementById('tip'));
    el.innerHTML = html;
    el.hidden = false;
    const r = el.getBoundingClientRect();
    let left = x - r.width / 2, top = y - r.height - 14;
    if (top < 8) top = y + 18;
    left = Math.max(8, Math.min(window.innerWidth - r.width - 8, left));
    el.style.left = left + 'px';
    el.style.top = top + 'px';
  },
  hide() { if (this.el) this.el.hidden = true; },
};

function niceScale(v, ticks = 4, int = true) {
  if (!(v > 0)) return { max: ticks, step: 1 };
  const raw = v / ticks, mag = Math.pow(10, Math.floor(Math.log10(raw)));
  let step = [1, 2, 2.5, 5, 10].map(m => m * mag).find(s => s >= raw);
  if (int) step = Math.max(1, Math.ceil(step));
  return { max: step * Math.ceil(v / step - 1e-9), step };
}

function roundTop(x, y, w, h, r) {
  r = Math.min(r, w / 2, h);
  return `M${x},${y + h}V${y + r}Q${x},${y} ${x + r},${y}H${x + w - r}Q${x + w},${y} ${x + w},${y + r}V${y + h}Z`;
}

function bindHits(el, tipFn) {
  const svg = el.querySelector('svg');
  const clear = () => svg.querySelectorAll('.on').forEach(x => x.classList.remove('on'));
  const move = e => {
    const h = e.target.closest('.hit');
    if (!h) { Tip.hide(); clear(); return; }
    const i = h.dataset.i;
    clear();
    svg.querySelectorAll(`[data-i="${i}"]:not(.hit)`).forEach(x => x.classList.add('on'));
    Tip.show(tipFn(+i), e.clientX, e.clientY);
  };
  svg.addEventListener('pointermove', move);
  svg.addEventListener('pointerdown', move);
  svg.addEventListener('pointerleave', () => { Tip.hide(); clear(); });
}

function yAxis(W, right, left, y, max, step, fmt) {
  let s = '';
  for (let v = 0; v <= max + 1e-9; v += step) {
    const yy = y(v).toFixed(1);
    s += `<line class="grid${v === 0 ? ' base' : ''}" x1="${left}" x2="${W - right}" y1="${yy}" y2="${yy}"/>`;
    s += `<text class="ax" x="${W - right + 6}" y="${+yy + 4}" text-anchor="start" direction="ltr">${fmt ? fmt(v) : faNum(v)}</text>`;
  }
  return s;
}

/* نمودار میله‌ای عمودی — data: [{label, value, tip}] ؛ اندیس ۰ در سمت راست */
function barChart(el, data, o = {}) {
  if (!el) return;
  const W = Math.max(240, Math.floor(el.clientWidth || 600)), H = o.height || 200;
  const top = 14, bottom = 26, right = o.axisW || 34, left = 4;
  const iw = W - left - right, ih = H - top - bottom;
  const vmax = Math.max(0, ...data.map(d => d.value), o.goal || 0);
  const { max, step } = niceScale(vmax, 4, o.int !== false);
  const n = data.length, slot = iw / n;
  const bw = Math.max(2, Math.min(o.maxBar || 30, slot * (n > 40 ? 0.72 : 0.6)));
  const y = v => top + ih - (v / max) * ih;
  const xc = i => W - right - slot * (i + 0.5);
  let s = `<svg class="chart" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${escH(o.label || '')}">`;
  s += yAxis(W, right, left, y, max, step, o.axisFmt);
  data.forEach((d, i) => {
    if (d.value > 0) {
      const h = Math.max(2, (d.value / max) * ih);
      s += `<path class="bar${i === o.hi ? ' hi' : ''}${d.cls ? ' ' + d.cls : ''}" data-i="${i}" d="${roundTop(xc(i) - bw / 2, top + ih - h, bw, h, 4)}"/>`;
    }
  });
  if (o.goal) {
    const gy = y(o.goal).toFixed(1);
    s += `<line class="goal" x1="${left}" x2="${W - right}" y1="${gy}" y2="${gy}"/>`;
    s += `<text class="goal-t" x="${left + 2}" y="${gy - 5}" text-anchor="start" direction="ltr">هدف ${faNum(o.goal)}</text>`;
  }
  const every = o.allLabels ? 1 : Math.max(1, Math.ceil(n / Math.max(1, Math.floor(iw / (o.labelW || 46)))));
  data.forEach((d, i) => {
    if (d.label && (n - 1 - i) % every === 0) s += `<text class="ax${i === o.hi ? ' ax-hi' : ''}" x="${xc(i).toFixed(1)}" y="${H - 8}" text-anchor="middle">${d.label}</text>`;
  });
  data.forEach((d, i) => { s += `<rect class="hit" data-i="${i}" x="${(xc(i) - slot / 2).toFixed(1)}" y="${top}" width="${slot.toFixed(1)}" height="${ih}"/>`; });
  el.innerHTML = s + '</svg>';
  bindHits(el, i => data[i].tip || `<b>${data[i].label}</b><span>${faNum(data[i].value)}</span>`);
}

/* نمودار خطی با خط راهنمای عمودی — series: [{name, color, values, area}] */
function lineChart(el, labels, series, o = {}) {
  if (!el) return;
  const W = Math.max(260, Math.floor(el.clientWidth || 600)), H = o.height || 230;
  const top = 18, bottom = 26, right = o.axisW || 34, left = 12;
  const iw = W - left - right, ih = H - top - bottom, n = labels.length;
  const vmax = Math.max(0, ...series.flatMap(s => s.values));
  const { max, step } = niceScale(vmax, 4, o.int !== false);
  const x = i => (n === 1 ? W - right - iw / 2 : W - right - (i / (n - 1)) * iw);
  const y = v => top + ih - (v / max) * ih;
  let s = `<svg class="chart" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${escH(o.label || '')}">`;
  s += yAxis(W, right, left, y, max, step, o.axisFmt);
  [...series].reverse().forEach(se => {
    const pts = se.values.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`);
    if (se.area) s += `<path class="area" style="fill:${se.color}" d="M${x(0).toFixed(1)},${y(0)}L${pts.join('L')}L${x(n - 1).toFixed(1)},${y(0)}Z"/>`;
    s += `<path class="ln" style="stroke:${se.color}" d="M${pts.join('L')}"/>`;
  });
  const last = n - 1, s0 = series[0];
  s += `<circle class="pt end" cx="${x(last).toFixed(1)}" cy="${y(s0.values[last]).toFixed(1)}" r="4.5" style="fill:${s0.color}"/>`;
  const every = Math.max(1, Math.ceil(n / Math.max(1, Math.floor(iw / (o.labelW || 58)))));
  labels.forEach((l, i) => { if ((n - 1 - i) % every === 0) s += `<text class="ax" x="${x(i).toFixed(1)}" y="${H - 8}" text-anchor="middle">${l}</text>`; });
  s += `<g class="xh-g" visibility="hidden"><line class="xh" y1="${top}" y2="${top + ih}"/>${series.map((se, k) => `<circle class="pt" data-s="${k}" r="4.5" style="fill:${se.color}"/>`).join('')}</g>`;
  s += `<rect class="ov" x="${left}" y="${top}" width="${iw}" height="${ih}"/>`;
  el.innerHTML = s + '</svg>';
  const svg = el.querySelector('svg'), g = svg.querySelector('.xh-g'), line = g.querySelector('.xh');
  const move = e => {
    const r = svg.getBoundingClientRect(), px = (e.clientX - r.left) * (W / r.width);
    const i = Math.max(0, Math.min(n - 1, Math.round(((W - right - px) / iw) * (n - 1))));
    const xx = x(i).toFixed(1);
    line.setAttribute('x1', xx); line.setAttribute('x2', xx);
    g.querySelectorAll('circle').forEach(c => { c.setAttribute('cx', xx); c.setAttribute('cy', y(series[+c.dataset.s].values[i]).toFixed(1)); });
    g.setAttribute('visibility', 'visible');
    Tip.show(`<b>${(o.tipLabels || labels)[i]}</b>${series.map(se => `<span class="tip-row"><i style="background:${se.color}"></i>${se.name}<em>${o.valFmt ? o.valFmt(se.values[i]) : faNum(se.values[i])}</em></span>`).join('')}`, e.clientX, e.clientY);
  };
  svg.addEventListener('pointermove', move);
  svg.addEventListener('pointerdown', move);
  svg.addEventListener('pointerleave', () => { g.setAttribute('visibility', 'hidden'); Tip.hide(); });
}

/* ساعت ۲۴ ساعته: هر برش یک ساعت، طول برش = تعداد */
function sector(cx, cy, r0, r1, a0, a1) {
  const p = (r, a) => `${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`;
  return `M${p(r1, a0)}A${r1},${r1} 0 0 1 ${p(r1, a1)}L${p(r0, a1)}A${r0},${r0} 0 0 0 ${p(r0, a0)}Z`;
}
function clockChart(el, hours, o = {}) {
  if (!el) return;
  const Sz = Math.min(320, Math.max(230, Math.floor(el.clientWidth || 280))), c = Sz / 2;
  const r0 = Sz * 0.2, r1 = Sz / 2 - 24, max = Math.max(1, ...hours);
  const peak = hours.indexOf(Math.max(...hours));
  const ang = h => (h / 24) * 2 * Math.PI - Math.PI / 2;
  let s = `<svg class="chart clock" viewBox="0 0 ${Sz} ${Sz}" width="${Sz}" height="${Sz}" role="img" aria-label="${escH(o.label || '')}">`;
  for (let h = 0; h < 24; h++) s += `<path class="track" d="${sector(c, c, r0, r1, ang(h) + 0.022, ang(h + 1) - 0.022)}"/>`;
  for (let h = 0; h < 24; h++) {
    if (hours[h]) s += `<path class="wedge${h === peak ? ' hi' : ''}" data-i="${h}" d="${sector(c, c, r0, r0 + Math.max(3, (r1 - r0) * hours[h] / max), ang(h) + 0.022, ang(h + 1) - 0.022)}"/>`;
  }
  for (let h = 0; h < 24; h += 3) {
    const a = ang(h), rr = r1 + 13;
    s += `<text class="ax" x="${(c + rr * Math.cos(a)).toFixed(1)}" y="${(c + rr * Math.sin(a) + 4).toFixed(1)}" text-anchor="middle">${fa(h)}</text>`;
  }
  const any = hours.some(v => v > 0);
  s += `<text class="c-big" x="${c}" y="${c + 4}" text-anchor="middle">${any ? fa(pad(peak)) + ':۰۰' : '—'}</text>`;
  s += `<text class="c-sm" x="${c}" y="${c + 22}" text-anchor="middle">${any ? 'ساعت اوج' : 'بدون داده'}</text>`;
  for (let h = 0; h < 24; h++) s += `<path class="hit" data-i="${h}" d="${sector(c, c, r0, r1 + 8, ang(h), ang(h + 1))}"/>`;
  el.innerHTML = s + '</svg>';
  bindHits(el, h => `<b>ساعت ${fa(h)} تا ${fa(h + 1)}</b><span>${faNum(hours[h])} ${o.unit || 'کار'}</span>`);
}

/* میله‌های افقی (HTML) — رنگ فقط روی نشانه؛ متن با رنگ متن */
function hbars(rows, o = {}) {
  const max = Math.max(1, ...rows.map(r => r.value));
  if (!rows.length) return `<p class="empty-line">${o.empty || 'داده‌ای برای این بازه نیست.'}</p>`;
  return `<div class="hbars">${rows.map(r => `<div class="hb-row">
    <div class="hb-label"><span class="sw" style="background:${r.color}"></span><span class="hb-name">${escH(r.label)}</span></div>
    <div class="hb-track"><div class="hb-bar" style="width:${Math.max(1.5, (r.value / max) * 100)}%;background:${r.color}"></div></div>
    <div class="hb-val">${r.valText ?? faNum(r.value)}</div></div>`).join('')}</div>`;
}

/* میله انباشته ۱۰۰٪ با فاصله ۲ پیکسلی بین بخش‌ها */
function stackBar(parts) {
  const total = parts.reduce((a, p) => a + p.value, 0);
  if (!total) return '<p class="empty-line">داده‌ای برای این بازه نیست.</p>';
  const seg = parts.filter(p => p.value > 0).map(p => `<div class="sb-seg" style="flex:${p.value};background:${p.color}" title="${escH(p.label)}: ${faNum(p.value)}"></div>`).join('');
  const leg = parts.map(p => `<div class="sb-leg"><span class="sw" style="background:${p.color}"></span><span>${escH(p.label)}</span><b>${faNum(p.value)}</b><em>${faPct((p.value / total) * 100)}</em></div>`).join('');
  return `<div class="sbar">${seg}</div><div class="sb-legend">${leg}</div>`;
}

/* حلقه پیشرفت */
function ring(p, size = 84, sw = 8, cls = '') {
  const r = (size - sw) / 2, c = 2 * Math.PI * r, off = c * (1 - Math.max(0, Math.min(1, p)));
  return `<svg class="ring ${cls}" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" aria-hidden="true"><circle class="ring-bg" cx="${size / 2}" cy="${size / 2}" r="${r}" stroke-width="${sw}"/><circle class="ring-fg" cx="${size / 2}" cy="${size / 2}" r="${r}" stroke-width="${sw}" stroke-dasharray="${c.toFixed(2)}" stroke-dashoffset="${off.toFixed(2)}" transform="rotate(-90 ${size / 2} ${size / 2})"/></svg>`;
}

/* نقشه فعالیت به سبک گیت‌هاب: ستون‌ها هفته‌ها (شنبه تا جمعه)، قدیمی‌ترین هفته در سمت راست */
function heatmap(el, o) {
  if (!el) return;
  const cell = o.cell || 12, gap = o.gap || 3, step = cell + gap;
  const labelW = o.noLabels ? 0 : 20, topH = o.noLabels ? 0 : 18;
  const gridStart = addDays(o.start, -wdOf(o.start));
  const cols = Math.floor(diffDays(gridStart, o.end) / 7) + 1;
  const W = labelW + cols * step, H = topH + 7 * step;
  const t0 = todayKey(), vals = {};
  let max = 0;
  for (let k = o.start; k <= o.end; k = addDays(k, 1)) { const v = o.value(k); vals[k] = v; if (v > max) max = v; }
  let s = `<svg class="heat" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${escH(o.label || 'نقشه فعالیت')}">`;
  if (!o.noLabels) [0, 2, 4, 6].forEach(r => { s += `<text class="ax" x="${W - labelW / 2}" y="${topH + r * step + cell - 2}" text-anchor="middle">${WD_SHORT[r]}</text>`; });
  const marks = [];
  for (let c = 0; c < cols; c++) {
    const x = W - labelW - (c + 1) * step + gap;
    for (let r = 0; r < 7; r++) {
      const k = addDays(gridStart, c * 7 + r);
      if (k < o.start || k > o.end) continue;
      const v = vals[k], l = v > 0 ? Math.min(4, Math.ceil((v / max) * 4)) : 0;
      s += `<rect class="hc l${l}${k === o.selected ? ' sel' : ''}${k === t0 ? ' today' : ''}${k > t0 ? ' fut' : ''}" data-k="${k}" x="${x}" y="${topH + r * step}" width="${cell}" height="${cell}" rx="2.5"/>`;
      if (!o.noLabels && jOf(k).jd === 1) marks.push({ c, x, jm: jOf(k).jm });
    }
  }
  if (!o.noLabels) {
    const first = jOf(o.start);
    if (!marks.length || marks[0].c >= 3) marks.unshift({ c: 0, x: W - labelW - step + gap, jm: first.jm });
    let lastC = -9;
    marks.forEach(m => {
      if (m.c - lastC < 3) return;
      lastC = m.c;
      s += `<text class="ax" x="${m.x + cell}" y="12" text-anchor="end" direction="ltr">${J_MONTHS[m.jm - 1]}</text>`;
    });
  }
  el.innerHTML = s + '</svg>';
  const svg = el.querySelector('svg');
  svg.addEventListener('pointermove', e => {
    const r = e.target.closest('.hc');
    if (!r) { Tip.hide(); return; }
    const k = r.dataset.k;
    Tip.show(o.tip ? o.tip(k, vals[k]) : `<b>${faNum(vals[k])}</b>`, e.clientX, e.clientY);
  });
  svg.addEventListener('pointerleave', () => Tip.hide());
  if (o.onPick) svg.addEventListener('click', e => { const r = e.target.closest('.hc'); if (r) { Tip.hide(); o.onPick(r.dataset.k); } });
  if (o.scrollEnd) {
    const sc = el.closest('.heat-scroll') || el;
    sc.scrollLeft = -sc.scrollWidth;
  }
}
const heatLegend = () => `<div class="heat-legend"><span>کمتر</span>${[0, 1, 2, 3, 4].map(l => `<i class="hl l${l}"></i>`).join('')}<span>بیشتر</span></div>`;
