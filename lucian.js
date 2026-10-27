// Lucian UX/UI Prompt #046 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#046
// Lucian UX/UI Prompt #039 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#039
// Lucian UX/UI Prompt #070 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#070

(function () {
  var root = document.querySelector('#quick-palette');
  var input = root.querySelector('.u046-in'), list = root.querySelector('.u046-list');
  var hl = root.querySelector('.u046-hl'), key = root.querySelector('.u046-key');
  var done = root.querySelector('.u046-done'), field = root.querySelector('.u046-field');
  var body = root.querySelector('.u046-body');
  var uid = 'u046-' + Math.random().toString(36).slice(2, 7);
  var mac = /Mac|iPhone|iPad/.test(navigator.platform || '');
  var I = {
    doc: '<path d="M7 3.5h7l4 4V20a.5.5 0 0 1-.5.5h-10A.5.5 0 0 1 7 20z"/><path d="M14 3.5v4h4"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    moon: '<path d="M19 14.5A7.5 7.5 0 0 1 9.5 5a7.5 7.5 0 1 0 9.5 9.5z"/>',
    user: '<circle cx="10" cy="8.5" r="3.5"/><path d="M3.5 19.5c.8-3.4 3.4-5 6.5-5 1.6 0 3 .4 4.2 1.3M18 14v6M15 17h6"/>',
    out: '<path d="M12 15V4M8 8l4-4 4 4M5 14v5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-5"/>'
  };
  var DATA=[];
  function refreshData(){DATA=[...MEMBERS.map(m=>({g:'成員',n:m.name+' '+m.heart,keywords:[m.english,m.full,m.alias,m.birthday,m.mbti,m.role,m.motto].join(' '),ic:'user',route:'/member/'+m.id})),...live().map(r=>({g:'資料',n:r.title,keywords:r.body.split('\n\n資料來源\n')[0],ic:'doc',route:'/entry/'+r.id})),{g:'導覽',n:'時間軸',ic:'doc',route:'/timeline'},{g:'導覽',n:'全部資料',ic:'doc',route:'/search'}];}
  var opts = [], act = 0, closed = true, doneT = 0;
  function esc(s) { return s.replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function hit(name, q) {
    if (!q) return esc(name);
    var i = name.toLowerCase().indexOf(q);if(i<0)return esc(name);
    return esc(name.slice(0, i)) + '<mark>' + esc(name.slice(i, i + q.length)) + '</mark>' + esc(name.slice(i + q.length));
  }
  function render() {
    refreshData();var q = input.value.trim().toLowerCase();
    var found = DATA.filter(function (d) { return !q || (d.n+' '+(d.keywords||'')).toLowerCase().indexOf(q) >= 0; }).slice(0,12);
    var html = '', g = '', n = 0;
    found.forEach(function (d) {
      if (d.g !== g) { g = d.g; html += '<li class="u046-g" role="presentation">' + g + '</li>'; }
      html += '<li class="u046-op" role="option" id="' + uid + '-' + n + '" data-n="' + esc(d.n) + '" style="--i:' + n + '" aria-selected="false"><span class="u046-ic' + (d.c ? '' : ' plain') + '"' + (d.c ? ' style="--c:' + d.c + '"' : '') + ' aria-hidden="true"><svg viewBox="0 0 24 24">' + I[d.ic] + '</svg></span><span>' + hit(d.n, q) + '</span>' + (d.k ? '<kbd class="u046-kbd">' + d.k + '</kbd>' : '') + '</li>';
      n++;
    });
    if (!n) html = '<li class="u046-empty" role="presentation"><b>找不到「' + esc(input.value.trim()) + '」</b>試試其他關鍵字</li>';
    list.innerHTML = html;
    opts = Array.prototype.slice.call(list.querySelectorAll('.u046-op'));
    opts.forEach(function (o, i) {
      o.addEventListener('pointermove', function () { if (act !== i) mark(i); });
      o.addEventListener('click', function () { mark(i); run(); });
    });
    hl.style.opacity = n ? '1' : '0';
    mark(0, true);
  }
  function mark(i, instant) {
    if (!opts.length) { input.removeAttribute('aria-activedescendant'); return; }
    act = (i + opts.length) % opts.length;
    opts.forEach(function (o, k) { o.setAttribute('aria-selected', String(k === act)); });
    input.setAttribute('aria-activedescendant', opts[act].id);
    if (instant) { hl.style.transition = 'none'; }
    var o = opts[act], top = o.offsetTop + 6;
    hl.style.setProperty('--y', top + 'px');
    if (instant) { void hl.offsetWidth; hl.style.transition = ''; }
    if (top + o.offsetHeight > body.scrollTop + body.clientHeight) body.scrollTo({ top: top + o.offsetHeight - body.clientHeight + 6, behavior: instant||window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    else if (top < body.scrollTop + 30) body.scrollTo({ top: act === 0 ? 0 : top - 30, behavior: instant ? 'auto' : 'smooth' });
  }
  function run() {
    if (!opts[act]) return;
    var name = opts[act].getAttribute('data-n');
    if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches)opts[act].animate([{ transform: 'scale(.97)' }, { transform: 'none' }], { duration: 260, easing: 'ease-out' });
    var destination=DATA.find(d=>d.n===name);done.textContent = '開啟 '+name;
    done.classList.add('show');
    clearTimeout(doneT);
    doneT = setTimeout(function () { if (root.isConnected) {setClosed(true);if(destination)location.hash=destination.route;} }, 650);
  }
  function setClosed(v) {
    closed = v;
    root.classList.toggle('is-closed', v);body.inert=v;body.setAttribute('aria-hidden',String(v));root.querySelector('.u046-foot').inert=v;
    input.setAttribute('aria-expanded', String(!v));
    key.textContent = v ? (mac ? '⌘K' : 'Ctrl K') : 'esc';
    if (v) { input.value = ''; input.blur(); setTimeout(function () { if (closed) { done.classList.remove('show'); render(); } }, 500); }
    else { done.classList.remove('show'); input.focus(); }
  }
  input.addEventListener('input', function () { if (closed) setClosed(false); render(); });
  input.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); if (closed) setClosed(false); else mark(act + (e.key === 'ArrowDown' ? 1 : -1)); }
    else if (e.key === 'Enter' && !e.isComposing && e.keyCode !== 229) { e.preventDefault(); if (closed) setClosed(false); else run(); }
    else if (e.key === 'Escape' && !closed) { e.preventDefault(); e.stopPropagation(); setClosed(true); }
  });
  field.addEventListener('pointerdown', function () { if (closed) { clearTimeout(doneT); setClosed(false); } });
  function onKey(e) {
    if (!root.isConnected) { document.removeEventListener('keydown', onKey); return; }
    if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
      var a = document.activeElement;
      if (a && !root.contains(a) && (a.matches('input,textarea,select') || a.isContentEditable)) return;
      e.preventDefault(); setClosed(!closed);
    }
  }
  document.addEventListener('keydown', onKey);
  document.addEventListener('pointerdown',function(e){if(!closed&&!root.contains(e.target))setClosed(true)});render();setClosed(true);
})();


window.mountArchiveTabs=function () {
  var root=document.querySelector('#archive-tabs');if(!root)return;
  var tabs = Array.prototype.slice.call(root.querySelectorAll('.u039-tab'));
  var pill = root.querySelector('.u039-pill');
  var panel = root.querySelector('.u039-panel');
  var rm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var all=live().slice().sort((a,b)=>b.updated.localeCompare(a.updated)||b.date.localeCompare(a.date));var DATA=[all,all.filter(r=>r.type==='profile'),all.filter(r=>r.type==='note'),all.filter(r=>r.type==='event')].map(group=>group.slice(0,4));
  var cur = 0, list = null;
  function movePill(animate) {
    var t = tabs[cur];
    if (!animate) pill.style.transition = 'none';
    pill.style.setProperty('--x', t.offsetLeft + 'px');
    pill.style.setProperty('--w', t.offsetWidth + 'px');
    if (!animate) { void pill.offsetWidth; pill.style.transition = ''; }
  }
  function make(i) {
    var ul = document.createElement('ul');
    ul.className = 'u039-list';
    ul.innerHTML=DATA[i].map(function(r,k){var member=MEMBERS.find(m=>r.members.includes(m.id));var art=member?'<img src="assets/members/'+member.id+'-0.jpg" alt="" width="52" height="52">':'<span class="archive-event-mark" aria-hidden="true">↗</span>';return '<li class="u039-row" tabindex="0" role="link" data-entry="'+esc(r.id)+'" style="transition-delay:'+(k*45)+'ms"><span class="u039-art" style="--g:var(--ux-surface-2)">'+art+'</span><span class="archive-row-copy"><b>'+esc(r.title)+'</b><small>'+esc(typeName(r.type))+'</small></span><em>'+esc(r.date.slice(5).replace('-','.'))+'</em></li>'}).join('');ul.querySelectorAll('[data-entry]').forEach(row=>{row.addEventListener('click',()=>location.hash='/entry/'+row.dataset.entry);row.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();location.hash='/entry/'+row.dataset.entry}})});
    return ul;
  }
  function select(i, focus) {
    if (i === cur && list) return;
    var dir = i > cur ? 1 : -1;
    cur = i;
    tabs.forEach(function (t, k) { t.setAttribute('aria-selected', String(k === i)); t.tabIndex = k === i ? 0 : -1; });
    panel.setAttribute('aria-labelledby',tabs[i].id);if (focus) tabs[i].focus();
    movePill(true);
    var next = make(i), old = list;if(old){old.inert=true;old.setAttribute('aria-hidden','true')}
    list = next;
    if (!old || rm) { if (old) old.remove(); panel.appendChild(next); return; }
    Array.prototype.forEach.call(next.children, function (r) { r.style.transform = 'translateX(' + (dir * 70) + '%)'; r.style.opacity = '0'; });
    panel.appendChild(next);
    void next.offsetWidth;
    Array.prototype.forEach.call(next.children, function (r) { r.style.transform = ''; r.style.opacity = ''; });
    Array.prototype.forEach.call(old.children, function (r) { r.style.transform = 'translateX(' + (-dir * 60) + '%)'; r.style.opacity = '0'; });
    setTimeout(function () { old.remove(); }, 700);
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { select(i); });
    t.addEventListener('keydown', function (e) {
      var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (d) { e.preventDefault(); select((i + d + tabs.length) % tabs.length, true); }
    });
  });
  var uid = 'u039-' + Math.random().toString(36).slice(2, 7);
  panel.id = uid;
  tabs.forEach(function (t,i) { t.id=uid+'-'+i;t.setAttribute('aria-controls', uid); });panel.setAttribute('aria-labelledby',tabs[0].id);
  list = make(0);
  panel.appendChild(list);
  tabs.forEach(function (t, k) { t.tabIndex = k === 0 ? 0 : -1; });
  movePill(false);
};
window.mountArchiveTabs();

(function () {
  var root=document.querySelector('#archive-notifications');
  var zone = root.querySelector('.u070-zone'), empty = root.querySelector('.u070-empty'), live = root.querySelector('.u070-live');
  var rm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var ICON = { ok: '<svg viewBox="0 0 18 18"><path d="M4 9.4l3.2 3.2L14 5.6"/></svg>', err: '<svg viewBox="0 0 18 18"><path d="M9 5v5M9 13h.01"/></svg>', info: '<svg viewBox="0 0 18 18"><path d="M3.5 4.5h11v7h-6l-3 2.5v-2.5h-2z"/></svg>', wait: '<i></i>' };
  var K = {
    ok: ['var(--ux-mint)', 'Changes saved', 'Spring campaign landing · just now'],
    err: ['var(--ux-danger)', 'Upload failed', 'Check your connection', 'Retry'],
    info: ['var(--ux-accent)', 'Doyun Han left a comment', '“Love this transition!”', 'View'],
    wait: ['var(--ux-warn)', 'Saving…', '3 files · 12.4 MB']
  };
  var list = [], open = false, DUR = 4500, seq = 0;
  function layout() {
    var acc = 0;
    list.forEach(function (t, i) {
      var el = t.el;
      el.classList.toggle('back', !open && i > 0);
      if (open) { el.style.setProperty('--y', -acc + 'px'); el.style.setProperty('--s', 1); el.style.setProperty('--o', 1); acc += el.offsetHeight + 8; }
      else { el.style.setProperty('--y', -(i * 14) + 'px'); el.style.setProperty('--s', (1 - i * 0.06).toFixed(2)); el.style.setProperty('--o', i > 2 ? 0 : 1); }
      el.style.zIndex = 50 - i;
      el.inert = !open && i > 0;
    });
    empty.style.opacity = list.length ? '0' : '1';
  }
  function remove(t, dir) {
    var i = list.indexOf(t);
    if (i < 0) return;
    list.splice(i, 1);
    t.el.classList.add('leave');
    if (dir) { t.el.style.setProperty('--dir', dir); t.el.classList.add('side'); }
    setTimeout(function () { t.el.remove(); }, 450);
    layout();
  }
  function push(k,title,description) {
    var d = K[k].slice();if(title)d[1]=title;if(description!==undefined)d[2]=description;var el = document.createElement('div');
    el.className = 'u070-t enter';
    el.style.setProperty('--c', d[0]);
    el.setAttribute('role', k === 'err' ? 'alert' : 'status');
    el.innerHTML = '<span class="u070-ic" aria-hidden="true">' + ICON[k] + '</span><span class="u070-tx"><b></b><small></small></span>' + (d[3] ? '<button class="u070-act" type="button"></button>' : '') + '<button class="u070-x" type="button" aria-label="關閉提示"><svg viewBox="0 0 14 14"><path d="M3.5 3.5l7 7M10.5 3.5l-7 7"/></svg></button><span class="u070-bar" aria-hidden="true"></span>';
    el.querySelector('b').textContent = d[1]; el.querySelector('small').textContent = d[2];
    if (d[3]) el.querySelector('.u070-act').textContent = d[3];
    var t = { el: el, left: DUR, id: ++seq, k: k };
    zone.appendChild(el);
    list.unshift(t);
    void el.offsetWidth;
    el.classList.remove('enter');
    layout();
    live.textContent = d[1];
    el.querySelector('.u070-x').addEventListener('click', function () { remove(t); });
    if (d[3]) el.querySelector('.u070-act').addEventListener('click', function () { remove(t); if (k === 'err') push('wait'); });
    if (k === 'wait') {
      t.left = Infinity;
      setTimeout(function () {
        if (!root.isConnected || list.indexOf(t) < 0) return;
        el.style.setProperty('--c', K.ok[0]);
        el.querySelector('.u070-ic').innerHTML = ICON.ok;
        el.querySelector('b').textContent = 'All saved';
        el.querySelector('small').textContent = 'All 3 files uploaded';
        live.textContent = 'All saved';
        t.left = DUR;
      }, rm ? 300 : 1800);
    }
    var sx = 0, dx = 0, down = false;
    el.addEventListener('pointerdown', function (e) { if (e.target.closest('button')) return; down = true; sx = e.clientX; dx = 0; el.setPointerCapture(e.pointerId); el.classList.add('drag'); });
    el.addEventListener('pointermove', function (e) { if (!down) return; dx = e.clientX - sx; el.style.setProperty('--dx', dx + 'px'); el.style.setProperty('--o', Math.max(0.2, 1 - Math.abs(dx) / 260)); });
    var end = function () { if (!down) return; down = false; el.classList.remove('drag'); if (Math.abs(dx) > 90) remove(t, dx > 0 ? 1 : -1); else { el.style.setProperty('--dx', '0px'); layout(); } };
    el.addEventListener('pointerup', end); el.addEventListener('pointercancel', end);
  }
  var last = performance.now();
  (function loop(now) {
    if (!root.isConnected) return;
    var dt = now - last; last = now;
    if (!open) list.slice().forEach(function (t, i) {
      if (i > 0 || t.left === Infinity) return;
      t.left -= dt;
      t.el.style.setProperty('--left', Math.max(0, t.left / DUR).toFixed(3));
      if (t.left <= 0) remove(t);
    });
    requestAnimationFrame(loop);
  })(last);
  function setOpen(v) { if (open === v) return; open = v; layout(); }
  zone.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') setOpen(true); });
  zone.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse' && !zone.contains(document.activeElement)) setOpen(false); });
  zone.addEventListener('focusin', function () { setOpen(true); });
  zone.addEventListener('focusout', function (e) { if (!zone.contains(e.relatedTarget)) setOpen(false); });
  zone.addEventListener('click', function (e) { if (!e.target.closest('button') && list.length > 1) setOpen(!open); });
  window.notifyArchive=function(title,description,kind){push(kind||'ok',title,description||'已儲存於目前瀏覽器')};
})();