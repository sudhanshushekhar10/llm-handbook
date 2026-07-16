/* =============================================================================
   main.js — wires every page together.
   Expects window.PAGE = { slug: "05-transformer" } (or "home"/"glossary"/...).
   Depends on nav.js, references.js, glossary.js (loaded first).
   ============================================================================= */
(function () {
  "use strict";
  var H = window.HANDBOOK || {};
  var PAGE = window.PAGE || { slug: "home" };

  /* ---------- helpers ---------- */
  function $(s, r) { return (r || document).querySelector(s); }
  function $all(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function slugify(t) {
    return t.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").slice(0, 60);
  }

  /* ---------- 1. THEME ---------- */
  function initTheme() {
    var saved = null;
    try { saved = localStorage.getItem("fg-theme"); } catch (e) {}
    // Default to light for everyone; dark is opt-in via the toggle (persisted in localStorage).
    var theme = saved || "light";
    document.documentElement.setAttribute("data-theme", theme);
  }
  function toggleTheme() {
    var cur = document.documentElement.getAttribute("data-theme");
    var next = cur === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try { localStorage.setItem("fg-theme", next); } catch (e) {}
  }

  /* ---------- 2. PROGRESS BAR ---------- */
  function initProgress() {
    var bar = $("#progress");
    if (!bar) return;
    function update() {
      var h = document.documentElement;
      var scrolled = h.scrollTop;
      var max = h.scrollHeight - h.clientHeight;
      bar.style.width = (max > 0 ? (scrolled / max) * 100 : 0) + "%";
    }
    document.addEventListener("scroll", update, { passive: true });
    update();
  }

  /* ---------- 3. RIGHT RAIL (on this page) + scroll-spy ---------- */
  function initRail() {
    var rail = $("#rail-toc");
    var prose = $(".prose");
    if (!rail || !prose) return;
    var heads = $all("h2, h3", prose);
    if (!heads.length) { var railWrap = $(".rail"); if (railWrap) railWrap.style.display = "none"; return; }

    var html = "";
    heads.forEach(function (h) {
      if (!h.id) h.id = slugify(h.textContent);
      var lvl = h.tagName === "H3" ? "lvl-3" : "lvl-2";
      html += '<a class="' + lvl + '" href="#' + h.id + '">' + h.textContent + "</a>";
    });
    rail.innerHTML = html;

    var links = {};
    $all("a", rail).forEach(function (a) { links[a.getAttribute("href").slice(1)] = a; });
    var current = null;
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          if (current) links[current] && links[current].classList.remove("is-active");
          current = en.target.id;
          links[current] && links[current].classList.add("is-active");
        }
      });
    }, { rootMargin: "-80px 0px -70% 0px", threshold: 0 });
    heads.forEach(function (h) { obs.observe(h); });
  }

  /* ---------- 4. CODE BLOCKS: tabs + copy ---------- */
  function initCode() {
    $all(".codeblock").forEach(function (block) {
      var panes = $all(".code-pane", block);
      var tabs = $all(".tab", block);
      tabs.forEach(function (tab) {
        tab.addEventListener("click", function () {
          var which = tab.getAttribute("data-pane");
          tabs.forEach(function (t) { t.setAttribute("aria-selected", t === tab ? "true" : "false"); });
          panes.forEach(function (p) { p.hidden = p.getAttribute("data-pane") !== which; });
        });
      });
      var copy = $(".copybtn", block);
      if (copy) {
        copy.addEventListener("click", function () {
          var visible = panes.filter(function (p) { return !p.hidden; })[0] || block;
          var codeEl = $("code", visible) || $("pre", visible);
          var text = codeEl ? codeEl.innerText : "";
          var done = function () {
            var prev = copy.innerHTML;
            copy.innerHTML = "✓ copied";
            setTimeout(function () { copy.innerHTML = prev; }, 1400);
          };
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(done, done);
          } else {
            var ta = document.createElement("textarea"); ta.value = text; document.body.appendChild(ta);
            ta.select(); try { document.execCommand("copy"); } catch (e) {} document.body.removeChild(ta); done();
          }
        });
      }
    });
    if (window.hljs) { try { window.hljs.highlightAll(); } catch (e) {} }
  }

  /* ---------- 5. CITATIONS ---------- */
  function initCitations() {
    $all(".cite[data-ref]").forEach(function (el) {
      var key = el.getAttribute("data-ref");
      var r = H.refIndexByKey && H.refIndexByKey[key];
      if (!r) { el.textContent = "[?]"; return; }
      el.textContent = "[" + r.id + "]";
      el.setAttribute("href", H.refHref(key));
      el.setAttribute("title", r.authors + " (" + r.year + ") — " + r.title);
    });
  }

  /* ---------- 6. GLOSSARY TOOLTIPS ---------- */
  function initGlossTips() {
    var pop = document.createElement("div");
    pop.className = "gloss-pop";
    document.body.appendChild(pop);
    var hideTimer = null;

    function show(el) {
      var key = el.getAttribute("data-term");
      var g = H.glossaryByKey && H.glossaryByKey[key];
      if (!g) return;
      clearTimeout(hideTimer);
      pop.innerHTML = "<b>" + g.term + "</b>" + g.def;
      pop.style.visibility = "hidden"; pop.classList.add("show");
      var r = el.getBoundingClientRect();
      var pw = pop.offsetWidth, ph = pop.offsetHeight;
      var left = Math.min(Math.max(8, r.left), window.innerWidth - pw - 8);
      var top = r.top - ph - 10;
      if (top < 8) top = r.bottom + 10;
      pop.style.left = left + "px"; pop.style.top = top + "px";
      pop.style.visibility = "visible";
    }
    function hide() { hideTimer = setTimeout(function () { pop.classList.remove("show"); }, 120); }

    $all(".gloss[data-term]").forEach(function (el) {
      if (!el.getAttribute("href")) {
        // make it a link to the glossary anchor too
        el.style.cursor = "help";
      }
      el.addEventListener("mouseenter", function () { show(el); });
      el.addEventListener("mouseleave", hide);
      el.addEventListener("focus", function () { show(el); });
      el.addEventListener("blur", hide);
      el.addEventListener("click", function () {
        var key = el.getAttribute("data-term");
        location.href = H.rootHref("glossary.html") + "#term-" + key;
      });
      el.setAttribute("tabindex", "0");
    });
    pop.addEventListener("mouseenter", function () { clearTimeout(hideTimer); });
    pop.addEventListener("mouseleave", hide);
  }

  /* ---------- 7. SEARCH MODAL ---------- */
  function initSearch() {
    var modal = $("#search-modal");
    if (!modal) return;
    var input = $("#search-input", modal);
    var results = $("#search-results", modal);
    var index = H.searchIndex ? H.searchIndex() : [];
    var sel = 0, current = [];

    function open() { modal.classList.add("open"); input.value = ""; render(""); input.focus(); }
    function close() { modal.classList.remove("open"); }
    function render(q) {
      q = q.trim().toLowerCase();
      current = !q ? index.slice(0, 8)
        : index.filter(function (it) { return it.text.indexOf(q) !== -1 || it.title.toLowerCase().indexOf(q) !== -1; });
      sel = 0;
      if (!current.length) { results.innerHTML = '<div class="modal__empty">No matches for “' + q + '”.</div>'; return; }
      results.innerHTML = current.map(function (it, i) {
        return '<a href="' + it.href + '" class="' + (i === 0 ? "sel" : "") + '">' +
               '<div class="r-ttl">' + it.title + "</div><div class=\"r-sub\">" + it.sub + "</div></a>";
      }).join("");
    }
    function move(d) {
      var items = $all("a", results); if (!items.length) return;
      items[sel] && items[sel].classList.remove("sel");
      sel = (sel + d + items.length) % items.length;
      items[sel].classList.add("sel"); items[sel].scrollIntoView({ block: "nearest" });
    }

    input.addEventListener("input", function () { render(input.value); });
    input.addEventListener("keydown", function (e) {
      if (e.key === "ArrowDown") { e.preventDefault(); move(1); }
      else if (e.key === "ArrowUp") { e.preventDefault(); move(-1); }
      else if (e.key === "Enter") { var items = $all("a", results); if (items[sel]) location.href = items[sel].href; }
      else if (e.key === "Escape") { close(); }
    });
    $(".modal__scrim", modal).addEventListener("click", close);
    $all("[data-open-search]").forEach(function (b) { b.addEventListener("click", open); });
    document.addEventListener("keydown", function (e) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); open(); }
      else if (e.key === "/" && document.activeElement.tagName !== "INPUT" && document.activeElement.tagName !== "TEXTAREA") {
        e.preventDefault(); open();
      }
    });
  }

  /* ---------- 8. MOBILE NAV ---------- */
  function initMobileNav() {
    var btn = $("#nav-toggle");
    if (!btn) return;
    btn.addEventListener("click", function () { document.body.classList.toggle("nav-open"); });
    $all(".nav-link").forEach(function (a) {
      a.addEventListener("click", function () { document.body.classList.remove("nav-open"); });
    });
    document.addEventListener("click", function (e) {
      if (document.body.classList.contains("nav-open") &&
          !e.target.closest(".sidebar") && !e.target.closest("#nav-toggle")) {
        document.body.classList.remove("nav-open");
      }
    });
  }

  /* ---------- 9. GLOSSARY PAGE ---------- */
  function renderGlossaryPage() {
    var mount = $("#glossary-page");
    if (!mount) return;
    var terms = (H.glossary || []).slice().sort(function (a, b) { return a.term.localeCompare(b.term); });
    var groups = {};
    terms.forEach(function (g) {
      var L = g.term[0].toUpperCase();
      if (!/[A-Z]/.test(L)) L = "#";
      (groups[L] = groups[L] || []).push(g);
    });
    var letters = Object.keys(groups).sort();
    var az = '<nav class="az-nav">' + letters.map(function (L) {
      return '<a href="#group-' + L + '">' + L + "</a>";
    }).join("") + "</nav>";

    var body = letters.map(function (L) {
      var entries = groups[L].map(function (g) {
        var see = (g.see || []).map(function (k) {
          var t = H.glossaryByKey[k];
          return t ? '<a href="#term-' + k + '">' + t.term + "</a>" : "";
        }).filter(Boolean).join(", ");
        return '<div class="gloss-entry" id="term-' + g.key + '">' +
               "<dt>" + g.term + (g.aka ? '<span class="aka">' + g.aka + "</span>" : "") + "</dt>" +
               "<dd>" + g.def + (see ? '<div class="seealso">See also: ' + see + "</div>" : "") + "</dd></div>";
      }).join("");
      return '<section class="gloss-group" id="group-' + L + '"><h2>' + L + "</h2><dl>" + entries + "</dl></section>";
    }).join("");

    mount.innerHTML = az + body;
  }

  /* ---------- 10. REFERENCES PAGE ---------- */
  function renderReferencesPage() {
    var mount = $("#references-page");
    if (!mount) return;
    var html = '<ol class="ref-list">' + (H.references || []).map(function (r) {
      return '<li class="ref-item" id="ref-' + r.id + '">' +
             '<div class="rn">[' + r.id + "]</div>" +
             "<div><cite>" + r.title + "</cite>" +
             '<div class="meta">' + r.authors + " · " + r.year + " · " + r.venue + "</div>" +
             (r.note ? '<div class="meta" style="font-style:italic">' + r.note + "</div>" : "") +
             '<a href="' + r.url + '" target="_blank" rel="noopener">' + r.url + " ↗</a></div></li>";
    }).join("") + "</ol>";
    mount.innerHTML = html;
    if (location.hash) { var t = $(location.hash); if (t) t.scrollIntoView(); }
  }

  /* ---------- BOOT ---------- */
  initTheme();
  document.addEventListener("DOMContentLoaded", function () {
    var tbtn = $("#theme-toggle"); if (tbtn) tbtn.addEventListener("click", toggleTheme);
    if (H.renderSidebar) H.renderSidebar("#sidebar-nav", PAGE.slug);
    if (H.renderPager && PAGE.slug && PAGE.slug.length > 4) H.renderPager("#pager", PAGE.slug);
    initProgress();
    initRail();
    initCode();
    initCitations();
    initGlossTips();
    initSearch();
    initMobileNav();
    renderGlossaryPage();
    renderReferencesPage();
    if (H.renderByline) H.renderByline();
    if (H.renderShare) H.renderShare();
    if (H.renderChapterShare) H.renderChapterShare(PAGE.slug);
    if (H.renderFooter) H.renderFooter();
  });

  window.FG = { toggleTheme: toggleTheme };
})();
