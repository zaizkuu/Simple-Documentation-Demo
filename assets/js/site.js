/*
 * SysAdmin Docs — site behaviour.
 *
 * Every page shares one layout. Pages only contain their own <article class="doc">;
 * this script builds the top bar, sidebar, breadcrumbs, table of contents, search
 * and the interactive components (tabs, checklists, quizzes, copy buttons, ...).
 *
 * To add a page: create the HTML file, add it to NAV below, then run
 *   node scripts/build-search-index.mjs
 */
(function () {
  'use strict';

  /* ---------------------------------------------------------------------------
   * 1. Site configuration (single source of truth for navigation)
   * ------------------------------------------------------------------------- */
  var SITE = {
    title: 'SysAdmin Docs',
    subtitle: 'Professional Practices & Documentation',
    group: 'Albao Group',
    course: 'System Administration and Maintenance',
    repo: 'https://github.com/zaizkuu/Simple-Documentation-Demo'
  };

  var NAV = [
    { section: 'Getting Started', items: [
      { id: 'home', title: 'Home', href: 'index.html' }
    ] },
    { section: 'Report Topics', items: [
      { id: 'standards', title: '1. Documentation Standards', href: 'pages/documentation-standards.html' },
      { id: 'policies', title: '2. IT Policies & Compliance', href: 'pages/it-policies-compliance.html' },
      { id: 'ethics', title: '3. Ethics in System Administration', href: 'pages/ethics-in-sysadmin.html' }
    ] },
    { section: 'Sample Documents', items: [
      { id: 'samples', title: 'Samples Overview', href: 'pages/samples/index.html' },
      { id: 'sop', title: 'SOP: New User Account', href: 'pages/samples/sop-user-provisioning.html' },
      { id: 'runbook', title: 'Runbook: Backup & Restore', href: 'pages/samples/runbook-backup-restore.html' },
      { id: 'incident', title: 'Incident Report', href: 'pages/samples/incident-report.html' },
      { id: 'change', title: 'Change Request', href: 'pages/samples/change-request.html' },
      { id: 'network', title: 'Network & Asset Inventory', href: 'pages/samples/network-inventory.html' }
    ] },
    { section: 'Resources', items: [
      { id: 'templates', title: 'Templates', href: 'pages/templates.html' },
      { id: 'glossary', title: 'Glossary', href: 'pages/glossary.html' },
      { id: 'about', title: 'About & References', href: 'pages/about.html' }
    ] }
  ];

  /* ---------------------------------------------------------------------------
   * 2. Helpers
   * ------------------------------------------------------------------------- */
  var body = document.body;
  var ROOT = body.getAttribute('data-root') || '';
  var PAGE = body.getAttribute('data-page') || '';
  var article = document.querySelector('article.doc');

  var FLAT = [];
  NAV.forEach(function (group) {
    group.items.forEach(function (item) {
      FLAT.push({ id: item.id, title: item.title, href: item.href, section: group.section });
    });
  });
  var current = FLAT.filter(function (item) { return item.id === PAGE; })[0];

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $all(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  function el(tag, attrs, html) {
    var node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (key) { node.setAttribute(key, attrs[key]); });
    }
    if (html != null) node.innerHTML = html;
    return node;
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // localStorage can throw (private mode, blocked storage) — never let that break the page.
  var store = {
    get: function (key) { try { return localStorage.getItem(key); } catch (e) { return null; } },
    set: function (key, value) { try { localStorage.setItem(key, value); } catch (e) { /* ignore */ } },
    remove: function (key) { try { localStorage.removeItem(key); } catch (e) { /* ignore */ } }
  };

  var ICONS = {
    menu: '<line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>',
    search: '<circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
    sun: '<circle cx="12" cy="12" r="4.5"/><line x1="12" y1="1.5" x2="12" y2="3.5"/><line x1="12" y1="20.5" x2="12" y2="22.5"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1.5" y1="12" x2="3.5" y2="12"/><line x1="20.5" y1="12" x2="22.5" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>',
    moon: '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>',
    github: '<path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>',
    doc: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/>',
    printer: '<polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>',
    link: '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
    copy: '<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
    check: '<polyline points="20 6 9 17 4 12"/>',
    clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
    calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',
    tag: '<path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>',
    up: '<polyline points="18 15 12 9 6 15"/>',
    info: '<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>',
    tip: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>',
    warning: '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
    danger: '<polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>'
  };

  function icon(name, cls) {
    return '<svg class="' + (cls || '') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + ICONS[name] + '</svg>';
  }

  var toastTimer;
  function toast(message) {
    var node = $('.toast') || body.appendChild(el('div', { 'class': 'toast', role: 'status', 'aria-live': 'polite' }));
    node.textContent = message;
    node.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { node.classList.remove('show'); }, 1800);
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      var area = el('textarea');
      area.value = text;
      area.style.position = 'fixed';
      area.style.opacity = '0';
      body.appendChild(area);
      area.select();
      try { document.execCommand('copy') ? resolve() : reject(); } catch (e) { reject(e); }
      body.removeChild(area);
    });
  }

  var isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);

  /* ---------------------------------------------------------------------------
   * 3. Theme (light / dark) — remembered per browser
   * ------------------------------------------------------------------------- */
  function currentTheme() {
    var explicit = document.documentElement.getAttribute('data-theme');
    if (explicit) return explicit;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function toggleTheme() {
    var next = currentTheme() === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    store.set('docs-theme', next);
  }

  /* ---------------------------------------------------------------------------
   * 4. Top bar & sidebar
   * ------------------------------------------------------------------------- */
  function buildTopbar() {
    var bar = $('#topbar');
    if (!bar) return;
    bar.innerHTML =
      '<button class="icon-btn menu-btn" type="button" aria-label="Open navigation" aria-controls="sidebar" aria-expanded="false">' + icon('menu') + '</button>' +
      '<a class="brand" href="' + ROOT + 'index.html"><span class="brand-logo">' + icon('doc') + '</span>' +
      '<span>' + SITE.title + '<small>' + SITE.subtitle + '</small></span></a>' +
      '<div class="topbar-spacer"></div>' +
      '<button class="search-trigger" type="button" aria-label="Search documentation">' + icon('search') +
      '<span class="label">Search docs…</span><kbd>' + (isMac ? '⌘' : 'Ctrl') + ' K</kbd></button>' +
      '<button class="icon-btn theme-toggle" type="button" aria-label="Toggle dark mode" title="Toggle dark mode">' +
      icon('sun', 'icon-sun') + icon('moon', 'icon-moon') + '</button>' +
      '<a class="icon-btn" href="' + SITE.repo + '" target="_blank" rel="noopener" aria-label="Source code on GitHub" title="Source code on GitHub">' + icon('github') + '</a>';

    $('.theme-toggle', bar).addEventListener('click', toggleTheme);
    $('.search-trigger', bar).addEventListener('click', openSearch);
    $('.menu-btn', bar).addEventListener('click', function () { setNav(!body.classList.contains('nav-open')); });
  }

  function buildSidebar() {
    var side = $('#sidebar');
    if (!side) return;
    var html = '';
    NAV.forEach(function (group) {
      html += '<div class="nav-section"><h2>' + group.section + '</h2><ul>';
      group.items.forEach(function (item) {
        var cur = item.id === PAGE ? ' aria-current="page"' : '';
        html += '<li><a href="' + ROOT + item.href + '"' + cur + '>' + item.title + '</a></li>';
      });
      html += '</ul></div>';
    });
    html += '<div class="sidebar-footer">' + SITE.group + '<br>' + SITE.course + '</div>';
    side.innerHTML = html;

    var backdrop = el('div', { 'class': 'backdrop' });
    backdrop.addEventListener('click', function () { setNav(false); });
    body.appendChild(backdrop);
    side.addEventListener('click', function (e) { if (e.target.closest('a')) setNav(false); });

    var active = $('a[aria-current="page"]', side);
    if (active && active.scrollIntoView && active.offsetTop > side.clientHeight - 80) {
      side.scrollTop = active.offsetTop - 120;
    }
  }

  function setNav(open) {
    body.classList.toggle('nav-open', open);
    var btn = $('.menu-btn');
    if (btn) btn.setAttribute('aria-expanded', String(open));
  }

  /* ---------------------------------------------------------------------------
   * 5. Article header: breadcrumbs + metadata row
   * ------------------------------------------------------------------------- */
  function readingTime() {
    var words = (article.textContent || '').trim().split(/\s+/).length;
    return Math.max(1, Math.round(words / 200));
  }

  function sourceUrl() {
    return current ? SITE.repo + '/blob/HEAD/' + current.href : SITE.repo;
  }

  function buildArticleHeader() {
    var h1 = $('h1', article);
    if (!h1) return;
    var header = h1.closest('.doc-header') || h1;

    if (current && current.id !== 'home') {
      // Home / Section / Page. A section that has its own landing page links to it,
      // and a landing page doesn't repeat its own section name.
      var crumbs = el('nav', { 'class': 'breadcrumbs', 'aria-label': 'Breadcrumb' });
      var landing = FLAT.filter(function (item) { return item.section === current.section && /index\.html$/.test(item.href); })[0];
      var html = '<ol><li><a href="' + ROOT + 'index.html">Home</a></li>';
      if (!landing) html += '<li>' + current.section + '</li>';
      else if (landing !== current) html += '<li><a href="' + ROOT + landing.href + '">' + current.section + '</a></li>';
      html += '<li aria-current="page">' + escapeHtml(h1.textContent) + '</li></ol>';
      crumbs.innerHTML = html;
      header.parentNode.insertBefore(crumbs, header);
    }

    var status = body.getAttribute('data-status');
    var version = body.getAttribute('data-version');
    var updated = body.getAttribute('data-updated');
    var meta = el('div', { 'class': 'doc-meta' });
    var html2 = '';
    if (status) {
      var cls = /approved/i.test(status) ? 'badge-approved' : /review/i.test(status) ? 'badge-review' : 'badge-draft';
      html2 += '<span class="badge ' + cls + '" title="Document status">' + escapeHtml(status) + '</span>';
    }
    if (version) html2 += '<span class="meta-item" title="Document version">' + icon('tag') + 'v' + escapeHtml(version) + '</span>';
    if (updated) html2 += '<span class="meta-item" title="Last updated">' + icon('calendar') + 'Updated <time datetime="' + updated + '">' + updated + '</time></span>';
    html2 += '<span class="meta-item" title="Estimated reading time">' + icon('clock') + readingTime() + ' min read</span>';
    html2 += '<span class="meta-actions">' +
      '<button class="icon-btn" type="button" data-action="print" title="Print / Save as PDF" aria-label="Print or save as PDF">' + icon('printer') + '</button>' +
      '<button class="icon-btn" type="button" data-action="copy-link" title="Copy link to this page" aria-label="Copy link to this page">' + icon('link') + '</button>' +
      '<a class="icon-btn" href="' + sourceUrl() + '" target="_blank" rel="noopener" title="View source on GitHub" aria-label="View source on GitHub">' + icon('github') + '</a>' +
      '</span>';
    meta.innerHTML = html2;

    var lead = header.classList && header.classList.contains('doc-header') ? header : h1;
    lead.parentNode.insertBefore(meta, lead.nextSibling);

    meta.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-action]');
      if (!btn) return;
      if (btn.getAttribute('data-action') === 'print') window.print();
      if (btn.getAttribute('data-action') === 'copy-link') {
        copyText(location.href.split('#')[0]).then(function () { toast('Link copied to clipboard'); }, function () { toast('Could not copy link'); });
      }
    });
  }

  /* ---------------------------------------------------------------------------
   * 6. Headings: anchor links + "On this page" table of contents
   * ------------------------------------------------------------------------- */
  function tocHeadings() {
    return $all('h2[id], h3[id]', article).filter(function (h) {
      return !h.closest('.card, .quiz, [data-no-toc]') && !h.hasAttribute('data-no-toc');
    });
  }

  function buildAnchors() {
    tocHeadings().forEach(function (h) {
      var a = el('a', { 'class': 'anchor', href: '#' + h.id, 'aria-label': 'Link to section: ' + h.textContent }, '#');
      h.appendChild(a);
    });
  }

  function buildToc() {
    var toc = $('#toc');
    if (!toc) return;
    var heads = tocHeadings();
    if (heads.length < 2) { toc.innerHTML = ''; return; }

    var html = '<h2>On this page</h2><ul>';
    heads.forEach(function (h) {
      var text = h.textContent.replace(/#$/, '').trim();
      html += '<li><a class="lvl-' + h.tagName.charAt(1) + '" href="#' + h.id + '">' + escapeHtml(text) + '</a></li>';
    });
    toc.innerHTML = html + '</ul>';

    var links = $all('a', toc);
    var ticking = false;
    function spy() {
      ticking = false;
      var offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--topbar-h'), 10) + 90;
      var active = 0;
      for (var i = 0; i < heads.length; i++) {
        if (heads[i].getBoundingClientRect().top - offset <= 0) active = i;
      }
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) active = heads.length - 1;
      links.forEach(function (link, idx) { link.classList.toggle('active', idx === active); });
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(spy); }
    }, { passive: true });
    spy();
  }

  /* ---------------------------------------------------------------------------
   * 7. Content components
   * ------------------------------------------------------------------------- */

  // Code blocks: label, copy button and light comment highlighting.
  var COMMENT_LANGS = /^(bash|sh|shell|powershell|cron|conf)$/;

  function splitComment(line) {
    var quote = null;
    for (var i = 0; i < line.length; i++) {
      var c = line.charAt(i);
      if (quote) { if (c === quote) quote = null; continue; }
      if (c === '"' || c === "'") { quote = c; continue; }
      if (c === '#' && (i === 0 || /\s/.test(line.charAt(i - 1)))) return [line.slice(0, i), line.slice(i)];
    }
    return [line, ''];
  }

  function highlight(code, lang) {
    if (!COMMENT_LANGS.test(lang)) return;
    code.innerHTML = code.textContent.split('\n').map(function (line) {
      var parts = splitComment(line);
      return escapeHtml(parts[0]) + (parts[1] ? '<span class="tok-comment">' + escapeHtml(parts[1]) + '</span>' : '');
    }).join('\n');
  }

  function enhanceCode() {
    $all('pre', article).forEach(function (pre) {
      if (pre.closest('.code-block')) return;
      var code = $('code', pre) || pre;
      var m = (code.className + ' ' + pre.className).match(/language-([\w-]+)/);
      var lang = m ? m[1] : 'text';
      var label = pre.getAttribute('data-title') || lang;
      highlight(code, lang);

      var wrap = el('div', { 'class': 'code-block' });
      var head = el('div', { 'class': 'code-head' }, '<span>' + escapeHtml(label) + '</span>');
      var btn = el('button', { 'class': 'copy-btn', type: 'button', 'aria-label': 'Copy code to clipboard' }, icon('copy') + '<span>Copy</span>');
      head.appendChild(btn);
      pre.parentNode.insertBefore(wrap, pre);
      wrap.appendChild(head);
      wrap.appendChild(pre);

      btn.addEventListener('click', function () {
        copyText(code.textContent).then(function () {
          btn.classList.add('copied');
          btn.innerHTML = icon('check') + '<span>Copied</span>';
          setTimeout(function () { btn.classList.remove('copied'); btn.innerHTML = icon('copy') + '<span>Copy</span>'; }, 1600);
        }, function () { toast('Copy failed — select the text manually'); });
      });
    });
  }

  function enhanceTables() {
    $all('table', article).forEach(function (table) {
      // Keep ISO 8601 dates (2026-10-28) on one line in narrow columns.
      $all('td', table).forEach(function (td) {
        if (/^\s*\d{4}-\d{2}(-\d{2})?\s*$/.test(td.textContent)) td.classList.add('nowrap');
      });
      if (table.parentNode.classList.contains('table-wrap')) return;
      var wrap = el('div', { 'class': 'table-wrap' });
      table.parentNode.insertBefore(wrap, table);
      wrap.appendChild(table);
    });
  }

  function enhanceCallouts() {
    $all('.callout', article).forEach(function (box) {
      var title = $('.callout-title', box);
      if (!title) return;
      var type = ['tip', 'warning', 'danger'].filter(function (t) { return box.classList.contains(t); })[0] || 'info';
      title.insertAdjacentHTML('afterbegin', icon(type));
      if (!box.hasAttribute('role')) box.setAttribute('role', type === 'danger' || type === 'warning' ? 'alert' : 'note');
    });
  }

  // Tabs: <div class="tabs" data-group="os"><div class="tab-panel" data-label="Linux">…</div>…</div>
  // Tabs that share a data-group stay in sync and the choice is remembered.
  function enhanceTabs() {
    $all('.tabs').forEach(function (tabs, n) {
      var panels = $all(':scope > .tab-panel', tabs);
      var group = tabs.getAttribute('data-group');
      var list = el('div', { 'class': 'tab-list', role: 'tablist' });
      panels.forEach(function (panel, i) {
        var label = panel.getAttribute('data-label') || 'Tab ' + (i + 1);
        var btn = el('button', {
          type: 'button', role: 'tab', id: 'tab-' + n + '-' + i,
          'aria-controls': 'panel-' + n + '-' + i, 'aria-selected': 'false', tabindex: '-1'
        }, escapeHtml(label));
        panel.id = 'panel-' + n + '-' + i;
        panel.setAttribute('role', 'tabpanel');
        panel.setAttribute('aria-labelledby', btn.id);
        list.appendChild(btn);
      });
      tabs.insertBefore(list, tabs.firstChild);

      list.addEventListener('click', function (e) {
        var btn = e.target.closest('[role="tab"]');
        if (btn) selectTab(tabs, btn.textContent, true);
      });
      list.addEventListener('keydown', function (e) {
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
        var btns = $all('[role="tab"]', list);
        var idx = btns.indexOf(document.activeElement);
        var next = btns[(idx + (e.key === 'ArrowRight' ? 1 : -1) + btns.length) % btns.length];
        selectTab(tabs, next.textContent, true);
        next.focus();
      });

      var remembered = group && store.get('tabs:' + group);
      var labels = panels.map(function (p) { return p.getAttribute('data-label'); });
      selectTab(tabs, labels.indexOf(remembered) !== -1 ? remembered : labels[0], false);
    });
  }

  function selectTab(tabs, label, sync) {
    var targets = [tabs];
    var group = tabs.getAttribute('data-group');
    if (sync && group) {
      targets = $all('.tabs[data-group="' + group + '"]');
      store.set('tabs:' + group, label);
    }
    targets.forEach(function (t) {
      var btns = $all(':scope > .tab-list > [role="tab"]', t);
      if (!btns.some(function (b) { return b.textContent === label; })) return;
      btns.forEach(function (b) {
        var on = b.textContent === label;
        b.setAttribute('aria-selected', String(on));
        b.tabIndex = on ? 0 : -1;
        document.getElementById(b.getAttribute('aria-controls')).hidden = !on;
      });
    });
  }

  // Checklists: progress bar + state saved in this browser.
  function enhanceChecklists() {
    $all('.checklist[data-checklist]').forEach(function (list) {
      var key = 'checklist:' + list.getAttribute('data-checklist');
      var boxes = $all('input[type="checkbox"]', list);
      var head = $('.checklist-head', list);
      var saved = [];
      try { saved = JSON.parse(store.get(key) || '[]'); } catch (e) { saved = []; }
      boxes.forEach(function (box, i) { box.checked = !!saved[i]; });

      var progress = el('div', { 'class': 'progress', role: 'progressbar', 'aria-valuemin': '0', 'aria-valuemax': String(boxes.length) }, '<div class="progress-bar"></div>');
      var label = el('span', { 'class': 'progress-label' });
      if (head) { head.appendChild(progress); head.appendChild(label); }

      var foot = el('div', { 'class': 'checklist-foot' }, '<button class="btn btn-sm" type="button">Reset checklist</button>');
      list.appendChild(foot);

      function update() {
        var done = boxes.filter(function (b) { return b.checked; }).length;
        $('.progress-bar', progress).style.width = (boxes.length ? done / boxes.length * 100 : 0) + '%';
        progress.setAttribute('aria-valuenow', String(done));
        label.textContent = done + ' of ' + boxes.length + ' done';
        store.set(key, JSON.stringify(boxes.map(function (b) { return b.checked; })));
      }
      list.addEventListener('change', update);
      $('button', foot).addEventListener('click', function () {
        boxes.forEach(function (b) { b.checked = false; });
        store.remove(key);
        update();
      });
      update();
    });
  }

  // Scenario quizzes: one button carries data-correct; feedback is revealed after choosing.
  function enhanceQuizzes() {
    $all('.quiz').forEach(function (quiz) {
      var buttons = $all('.quiz-options button', quiz);
      var feedback = $('.quiz-feedback', quiz);
      if (!feedback) return;
      var explanation = feedback.innerHTML;
      var resetBtn = el('button', { 'class': 'btn btn-sm', type: 'button' }, 'Try again');

      buttons.forEach(function (btn) {
        btn.addEventListener('click', function () {
          var right = btn.hasAttribute('data-correct');
          buttons.forEach(function (b) {
            b.disabled = true;
            if (b.hasAttribute('data-correct')) b.classList.add('correct');
          });
          if (!right) btn.classList.add('wrong');
          feedback.innerHTML = '<p><strong>' + (right ? 'Best choice.' : 'Not the best choice.') + '</strong></p>' + explanation;
          feedback.appendChild(resetBtn);
          feedback.hidden = false;
        });
      });
      resetBtn.addEventListener('click', function () {
        buttons.forEach(function (b) { b.disabled = false; b.classList.remove('correct', 'wrong'); });
        feedback.hidden = true;
      });
    });
  }

  // Download buttons: <button data-download="file.md" data-source="element-id">
  function enhanceDownloads() {
    $all('[data-download]').forEach(function (btn) {
      btn.insertAdjacentHTML('afterbegin', icon('download'));
      btn.addEventListener('click', function () {
        var src = document.getElementById(btn.getAttribute('data-source'));
        if (!src) return;
        var blob = new Blob([src.textContent], { type: 'text/markdown;charset=utf-8' });
        var a = el('a', { href: URL.createObjectURL(blob), download: btn.getAttribute('data-download') });
        body.appendChild(a);
        a.click();
        setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
        toast('Downloaded ' + btn.getAttribute('data-download'));
      });
    });
  }

  // Live filter: <input data-filter=".item" data-filter-group=".group"> hides items whose
  // text does not match, and hides any group left with no visible items.
  function enhanceFilters() {
    $all('[data-filter]').forEach(function (input) {
      var itemSel = input.getAttribute('data-filter');
      var items = $all(itemSel);
      var groups = input.getAttribute('data-filter-group') ? $all(input.getAttribute('data-filter-group')) : [];
      var counter = document.getElementById(input.getAttribute('data-filter-count') || '');
      function run() {
        var q = input.value.trim().toLowerCase();
        var shown = 0;
        items.forEach(function (item) {
          var match = !q || item.textContent.toLowerCase().indexOf(q) !== -1;
          item.classList.toggle('hidden', !match);
          if (match) shown++;
        });
        groups.forEach(function (g) {
          g.hidden = !$all(itemSel, g).some(function (item) { return !item.classList.contains('hidden'); });
        });
        if (counter) counter.textContent = shown + ' of ' + items.length + ' terms';
      }
      input.addEventListener('input', run);
      run();
    });
  }

  /* ---------------------------------------------------------------------------
   * 8. Page footer: feedback, previous/next, last updated
   * ------------------------------------------------------------------------- */
  function buildFooter() {
    var idx = FLAT.indexOf(current);
    var feedbackKey = 'feedback:' + PAGE;

    var fb = el('section', { 'class': 'feedback', 'aria-label': 'Page feedback' },
      '<strong>Was this page helpful?</strong>' +
      '<button class="btn btn-sm" type="button" data-vote="yes">Yes</button>' +
      '<button class="btn btn-sm" type="button" data-vote="no">No</button>' +
      '<p class="feedback-msg" hidden></p>');
    article.parentNode.insertBefore(fb, article.nextSibling);

    function showVote(vote) {
      var msg = $('.feedback-msg', fb);
      var issue = SITE.repo + '/issues/new?title=' + encodeURIComponent('Docs feedback: ' + document.title);
      msg.innerHTML = vote === 'yes'
        ? 'Thanks for the feedback! Reader feedback is how documentation stays useful.'
        : 'Sorry about that. <a href="' + issue + '" target="_blank" rel="noopener">Tell us what was missing</a>. In a real team, this feedback becomes a documentation ticket.';
      msg.hidden = false;
      $all('[data-vote]', fb).forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-vote') === vote)); });
    }
    fb.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-vote]');
      if (!btn) return;
      store.set(feedbackKey, btn.getAttribute('data-vote'));
      showVote(btn.getAttribute('data-vote'));
    });
    if (store.get(feedbackKey)) showVote(store.get(feedbackKey));

    if (idx !== -1) {
      var pager = el('nav', { 'class': 'pager', 'aria-label': 'Previous and next pages' });
      var prev = FLAT[idx - 1];
      var next = FLAT[idx + 1];
      var html = '';
      if (prev) html += '<a class="prev" href="' + ROOT + prev.href + '"><small>← Previous</small><span>' + prev.title + '</span></a>';
      if (next) html += '<a class="next" href="' + ROOT + next.href + '"><small>Next →</small><span>' + next.title + '</span></a>';
      pager.innerHTML = html;
      fb.parentNode.insertBefore(pager, fb.nextSibling);
    }

    var updated = body.getAttribute('data-updated');
    var foot = el('footer', { 'class': 'page-footer' },
      (updated ? '<p>Last updated: <time datetime="' + updated + '">' + updated + '</time> · Maintained by ' + SITE.group + '</p>' : '') +
      '<p>Prepared for <em>' + SITE.course + '</em> — Professional Practices and Documentation. ' +
      '<a href="' + sourceUrl() + '" target="_blank" rel="noopener">View this page\'s source</a>.</p>');
    article.parentNode.appendChild(foot);
  }

  /* ---------------------------------------------------------------------------
   * 9. Search (Ctrl/⌘ + K or "/")
   * ------------------------------------------------------------------------- */
  var searchModal, searchInput, searchList, searchResults = [], activeResult = 0, lastFocus;

  function buildSearch() {
    searchModal = el('div', { 'class': 'search-modal', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Search documentation' },
      '<div class="search-overlay"></div>' +
      '<div class="search-panel">' +
      '<div class="search-input-row">' + icon('search') +
      '<input type="search" placeholder="Search the documentation…" aria-label="Search" autocomplete="off" spellcheck="false">' +
      '<kbd>Esc</kbd></div>' +
      '<ul class="search-results" role="listbox"></ul>' +
      '<div class="search-foot"><span><kbd>↑</kbd> <kbd>↓</kbd> to navigate</span><span><kbd>Enter</kbd> to open</span><span><kbd>Esc</kbd> to close</span></div>' +
      '</div>');
    body.appendChild(searchModal);
    searchInput = $('input', searchModal);
    searchList = $('.search-results', searchModal);

    $('.search-overlay', searchModal).addEventListener('click', closeSearch);
    searchInput.addEventListener('input', function () { runSearch(searchInput.value); });
    searchInput.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        if (!searchResults.length) return;
        activeResult = (activeResult + (e.key === 'ArrowDown' ? 1 : -1) + searchResults.length) % searchResults.length;
        paintActive();
      } else if (e.key === 'Enter') {
        var link = $all('a', searchList)[activeResult];
        if (link) { e.preventDefault(); link.click(); }
      }
    });
    searchList.addEventListener('click', function (e) { if (e.target.closest('a')) closeSearch(); });

    document.addEventListener('keydown', function (e) {
      var typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName) || document.activeElement.isContentEditable;
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); openSearch(); }
      else if (e.key === '/' && !typing) { e.preventDefault(); openSearch(); }
      else if (e.key === 'Escape') {
        if (searchModal.classList.contains('open')) closeSearch();
        else if (body.classList.contains('nav-open')) setNav(false);
      }
    });
  }

  function openSearch() {
    lastFocus = document.activeElement;
    searchModal.classList.add('open');
    searchInput.value = '';
    runSearch('');
    searchInput.focus();
  }

  function closeSearch() {
    searchModal.classList.remove('open');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function regexEscape(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

  function markTerms(text, terms) {
    var html = escapeHtml(text);
    if (!terms.length) return html;
    var re = new RegExp('(' + terms.map(function (t) { return regexEscape(escapeHtml(t)); }).join('|') + ')', 'gi');
    return html.replace(re, '<mark>$1</mark>');
  }

  function snippet(text, terms) {
    var lower = text.toLowerCase();
    var pos = -1;
    terms.some(function (t) { pos = lower.indexOf(t); return pos !== -1; });
    if (pos === -1) return text.slice(0, 140) + (text.length > 140 ? '…' : '');
    var start = Math.max(0, pos - 50);
    var end = Math.min(text.length, pos + 110);
    return (start > 0 ? '…' : '') + text.slice(start, end) + (end < text.length ? '…' : '');
  }

  function runSearch(query) {
    var index = window.SEARCH_INDEX;
    var terms = query.toLowerCase().split(/\s+/).filter(Boolean);
    activeResult = 0;

    if (!index) {
      searchResults = [];
      searchList.innerHTML = '<li class="search-empty">Search index not found. Run <code>node scripts/build-search-index.mjs</code>.</li>';
      return;
    }

    if (!terms.length) {
      searchResults = FLAT.map(function (p) { return { u: p.href, p: p.section, s: p.title, t: '' }; });
    } else {
      var scored = [];
      index.forEach(function (entry) {
        var title = (entry.s || entry.p).toLowerCase();
        var page = entry.p.toLowerCase();
        var text = entry.t.toLowerCase();
        var score = 0;
        for (var i = 0; i < terms.length; i++) {
          var t = terms[i];
          var s = 0;
          if (title.indexOf(t) !== -1) s += 10;
          if (page.indexOf(t) !== -1) s += 3;
          if (text.indexOf(t) !== -1) s += 1 + Math.min(text.split(t).length - 1, 5) * 0.3;
          if (!s) return;
          score += s;
        }
        scored.push({ entry: entry, score: score });
      });
      scored.sort(function (a, b) { return b.score - a.score; });
      searchResults = scored.slice(0, 30).map(function (r) { return r.entry; });
    }

    if (!searchResults.length) {
      searchList.innerHTML = '<li class="search-empty">No results for “' + escapeHtml(query) + '”. Try another keyword, e.g. <em>password</em>, <em>backup</em> or <em>privacy</em>.</li>';
      return;
    }

    searchList.innerHTML = searchResults.map(function (r) {
      var title = r.s || r.p;
      return '<li role="option"><a href="' + ROOT + r.u + '">' +
        '<span class="res-page">' + escapeHtml(r.p) + '</span>' +
        '<span class="res-title">' + markTerms(title, terms) + '</span>' +
        (r.t && terms.length ? '<span class="res-snippet">' + markTerms(snippet(r.t, terms), terms) + '</span>' : '') +
        '</a></li>';
    }).join('');
    paintActive();
  }

  function paintActive() {
    $all('a', searchList).forEach(function (a, i) {
      a.classList.toggle('active', i === activeResult);
      if (i === activeResult) a.scrollIntoView({ block: 'nearest' });
    });
  }

  /* ---------------------------------------------------------------------------
   * 10. Back to top
   * ------------------------------------------------------------------------- */
  function buildBackToTop() {
    var btn = el('button', { 'class': 'back-to-top', type: 'button', 'aria-label': 'Back to top', title: 'Back to top' }, icon('up'));
    body.appendChild(btn);
    btn.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
    window.addEventListener('scroll', function () { btn.classList.toggle('show', window.scrollY > 700); }, { passive: true });
  }

  /* ---------------------------------------------------------------------------
   * Boot
   * ------------------------------------------------------------------------- */
  buildTopbar();
  buildSidebar();
  buildSearch();
  if (article) {
    buildArticleHeader();
    enhanceCode();
    enhanceTables();
    enhanceCallouts();
    enhanceTabs();
    enhanceChecklists();
    enhanceQuizzes();
    enhanceDownloads();
    enhanceFilters();
    buildAnchors();
    buildToc();
    buildFooter();
  }
  buildBackToTop();

  // Re-run scroll to the hash target after the layout has been built.
  if (location.hash) {
    var target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (target) setTimeout(function () { target.scrollIntoView(); }, 0);
  }
})();
