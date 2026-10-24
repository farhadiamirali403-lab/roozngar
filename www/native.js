'use strict';
/* روزنگار · لایه بومی: افزونه‌های اندروید (Capacitor) با جایگزین وب برای هر کدام */

const Native = {
  get cap() { return window.Capacitor || null; },
  get isNative() { const c = this.cap; return !!(c && typeof c.isNativePlatform === 'function' && c.isNativePlatform()); },
  plugin(name) { const c = this.cap; return this.isNative && c.Plugins && c.Plugins[name] ? c.Plugins[name] : null; },

  /* لرزش کوتاه برای بازخورد لمسی */
  haptic(kind = 'light') {
    try {
      const h = this.plugin('Haptics');
      if (h) {
        if (kind === 'success') h.notification({ type: 'SUCCESS' });
        else if (kind === 'select') h.selectionChanged ? h.selectionChanged() : h.impact({ style: 'LIGHT' });
        else h.impact({ style: kind === 'medium' ? 'MEDIUM' : 'LIGHT' });
        return;
      }
      if (navigator.vibrate) navigator.vibrate(kind === 'success' ? [10, 50, 16] : kind === 'medium' ? 18 : 8);
    } catch (e) { /* */ }
  },

  /* رنگ نوار وضعیت و متای theme-color هم‌رنگ پوسته */
  setBars(dark, color) {
    document.querySelectorAll('meta[name="theme-color"]').forEach(m => { m.setAttribute('content', color); m.removeAttribute('media'); });
    const sb = this.plugin('StatusBar');
    if (!sb) return;
    try {
      sb.setStyle({ style: dark ? 'DARK' : 'LIGHT' });
      sb.setBackgroundColor({ color });
    } catch (e) { /* */ }
  },

  onBack(fn) { const a = this.plugin('App'); if (a) try { a.addListener('backButton', fn); } catch (e) { /* */ } },
  onResume(fn) {
    const a = this.plugin('App');
    if (a) try { a.addListener('resume', fn); } catch (e) { /* */ }
    document.addEventListener('visibilitychange', () => { if (!document.hidden) fn(); });
  },
  exit() { const a = this.plugin('App'); if (a) try { a.exitApp(); } catch (e) { /* */ } },

  /* ذخیره فایل: در اندروید در حافظه موقت نوشته و با منوی «اشتراک‌گذاری» تحویل داده می‌شود */
  async saveFile(filename, data) {
    const fs = this.plugin('Filesystem'), sh = this.plugin('Share');
    if (!fs) return false;
    const r = await fs.writeFile({ path: filename, data, directory: 'CACHE', encoding: 'utf8' });
    if (sh) await sh.share({ title: filename, url: r.uri, dialogTitle: 'ذخیره یا ارسال پشتیبان' });
    return true;
  },
  async shareText(title, text) {
    const sh = this.plugin('Share');
    try {
      if (sh) { await sh.share({ title, text, dialogTitle: title }); return true; }
      if (navigator.share) { await navigator.share({ title, text }); return true; }
    } catch (e) { return e && /cancel|abort/i.test(String(e.message || e.name)); }
    return false;
  },

  /* ---------- اعلان‌ها ---------- */
  notifyId(key) { let h = 0; for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) | 0; return Math.abs(h % 2000000000) + 1; },
  webTimers: [],
  async notifyPermission(ask) {
    const ln = this.plugin('LocalNotifications');
    try {
      if (ln) {
        let p = await ln.checkPermissions();
        if (p.display !== 'granted' && ask) p = await ln.requestPermissions();
        return p.display === 'granted';
      }
      if (!('Notification' in window)) return false;
      if (Notification.permission === 'default' && ask) await Notification.requestPermission();
      return Notification.permission === 'granted';
    } catch (e) { return false; }
  },
  /* list: [{key, title, body, at(ms), daily?:{hour,minute}}] — همه زمان‌بندی‌های قبلی جایگزین می‌شوند */
  async schedule(list) {
    const ln = this.plugin('LocalNotifications');
    if (ln) {
      try {
        const pend = await ln.getPending();
        if (pend && pend.notifications && pend.notifications.length) await ln.cancel({ notifications: pend.notifications.map(n => ({ id: n.id })) });
        if (!list.length) return;
        await ln.schedule({
          notifications: list.map(n => ({
            id: this.notifyId(n.key), title: n.title, body: n.body,
            schedule: n.daily ? { on: { hour: n.daily.hour, minute: n.daily.minute }, allowWhileIdle: true } : { at: new Date(n.at), allowWhileIdle: true },
            smallIcon: 'ic_stat_roozngar', iconColor: '#16a34a', extra: { key: n.key },
          })),
        });
      } catch (e) { /* */ }
      return;
    }
    this.webTimers.forEach(clearTimeout);
    this.webTimers = [];
    if (!('Notification' in window) || Notification.permission !== 'granted') return;
    const now = Date.now();
    list.forEach(n => {
      let at = n.at;
      if (n.daily) { const d = new Date(); d.setHours(n.daily.hour, n.daily.minute, 0, 0); if (d.getTime() <= now) d.setDate(d.getDate() + 1); at = d.getTime(); }
      const ms = at - now;
      if (ms > 0 && ms < 2147483000) this.webTimers.push(setTimeout(() => { try { new Notification(n.title, { body: n.body, icon: 'icons/icon-192.png', tag: n.key, lang: 'fa', dir: 'rtl' }); } catch (e) { /* */ } }, ms));
    });
  },
  onNotifyTap(fn) {
    const ln = this.plugin('LocalNotifications');
    if (ln) try { ln.addListener('localNotificationActionPerformed', e => fn(e && e.notification && e.notification.extra ? e.notification.extra.key : null)); } catch (e) { /* */ }
  },

  /* روشن ماندن صفحه در جلسه تمرکز (در صورت پشتیبانی) */
  lock: null,
  async keepAwake(on) {
    try {
      if (on && !this.lock && navigator.wakeLock) this.lock = await navigator.wakeLock.request('screen');
      else if (!on && this.lock) { await this.lock.release(); this.lock = null; }
    } catch (e) { this.lock = null; }
  },
};
