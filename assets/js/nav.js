/* =============================================================================
   nav.js — single source of truth for the chapter list.
   Renders the left sidebar, prev/next pager, and feeds the search index.
   No fetch(): everything is a JS object so the site runs from file://.
   ============================================================================= */
window.HANDBOOK = window.HANDBOOK || {};

HANDBOOK.meta = {
  title: "The Engineer's Field Guide to Large Language Models",
  subtitle: "From API consumer to model contributor",
  /* canonical deployed base (trailing slash) — share links always point here,
     never at localhost/file:// */
  canonical: "https://sudhanshushekhar10.github.io/llm-handbook/",
};

/* part = grouping shown in the sidebar; order follows the array order */
HANDBOOK.chapters = [
  { num:"01", slug:"01-introduction",        part:"I · Foundations",
    title:"The Mental Model",
    blurb:"What a model actually is, in terms a backend engineer already owns.", tags:["orientation"] },
  { num:"02", slug:"02-history",             part:"I · Foundations",
    title:"A Short History of Language Models",
    blurb:"n-grams → word2vec → RNNs → attention → the Transformer → the GPT era.", tags:["history"] },
  { num:"03", slug:"03-the-ml-stack",        part:"I · Foundations",
    title:"The ML Stack, Demystified",
    blurb:"Python, PyTorch, CUDA, GPUs, Hugging Face, pydantic — the alien map.", tags:["tooling"] },

  { num:"04", slug:"04-tokenization",        part:"II · How LLMs Work",
    title:"Tokenization & Embeddings",
    blurb:"How text becomes numbers. BPE, vocabularies, the context window.", tags:["widget","core"] },
  { num:"05", slug:"05-transformer",         part:"II · How LLMs Work",
    title:"The Transformer",
    blurb:"Attention, multi-head, positional encoding — the engine of it all.", tags:["widget","flagship"] },
  { num:"06", slug:"06-model-to-output",     part:"II · How LLMs Work",
    title:"From Weights to Words",
    blurb:"Parameters, the forward pass, logits, and how sampling picks tokens.", tags:["core"] },

  { num:"07", slug:"07-pretraining",         part:"III · Training",
    title:"Pretraining at Scale",
    blurb:"The next-token objective, web-scale data, scaling laws, emergence.", tags:["training"] },
  { num:"08", slug:"08-training-loop",       part:"III · Training",
    title:"The Training Loop in Practice",
    blurb:"AdamW, schedules, mixed precision, and training across many GPUs.", tags:["training"] },

  { num:"09", slug:"09-finetuning-overview", part:"IV · Adapting Models",
    title:"Fine-tuning: The Big Picture",
    blurb:"Full fine-tuning vs PEFT vs prompting vs RAG — and when to use each.", tags:["finetune"] },
  { num:"10", slug:"10-peft-lora",           part:"IV · Adapting Models",
    title:"PEFT & LoRA",
    blurb:"Adapters, LoRA, QLoRA — fine-tuning a 7B model on one GPU.", tags:["widget","flagship","finetune"] },
  { num:"11", slug:"11-alignment",           part:"IV · Adapting Models",
    title:"Alignment: RLHF & DPO",
    blurb:"Turning a raw predictor into a helpful assistant.", tags:["finetune"] },
  { num:"12", slug:"12-data-for-finetuning", part:"IV · Adapting Models",
    title:"Data for Fine-tuning",
    blurb:"Chat templates, schemas with pydantic, synthetic data, quality.", tags:["finetune","data"] },

  { num:"13", slug:"13-quantization",        part:"V · Efficient & Deployable",
    title:"Quantization & GGUF",
    blurb:"Shrinking models from fp32 to int4 with minimal quality loss.", tags:["widget","flagship","deploy"] },
  { num:"14", slug:"14-inference-serving",   part:"V · Efficient & Deployable",
    title:"Inference & Serving",
    blurb:"KV cache, batching, vLLM, llama.cpp, Ollama — running at speed.", tags:["deploy"] },
  { num:"15", slug:"15-advanced-architectures", part:"V · Efficient & Deployable",
    title:"Beyond the Vanilla Transformer",
    blurb:"Mixture-of-Experts, GQA, long context, and state-space models.", tags:["advanced"] },

  { num:"16", slug:"16-evaluation",          part:"VI · Using & Contributing",
    title:"Evaluating Models",
    blurb:"Benchmarks, LLM-as-judge, contamination, and trusting your evals.", tags:["eval"] },
  { num:"17", slug:"17-rag-and-agents",      part:"VI · Using & Contributing",
    title:"RAG, Tools & Agents",
    blurb:"Giving models memory, tools, and the ability to act.", tags:["apps"] },
  { num:"18", slug:"18-ecosystem-contributing", part:"VI · Using & Contributing",
    title:"The Ecosystem & How to Contribute",
    blurb:"The Hub, licenses, the papers to follow, and your first contribution.", tags:["meta"] },

  { num:"19", slug:"brainstorming-runtimes",   part:"VII · Brainstorming",
    title:"The Runtime Ecosystem",
    blurb:"Brains vs. engines: how weights become a running chat interface. llama.cpp, Ollama, vLLM, GGUF.", tags:["deep-dive"] },
  { num:"20", slug:"brainstorming-math",        part:"VII · Brainstorming",
    title:"The Mathematical Soul",
    blurb:"Vectors, matrices, and attention: how words become coordinates and talk to each other.", tags:["deep-dive"] },
];

/* ---- path helpers: make links work whether we're at root or in /chapters/ ---- */
HANDBOOK.inChapters = function () { return /\/chapters\//.test(location.pathname); };
HANDBOOK.root = function () { return HANDBOOK.inChapters() ? "../" : "./"; };
HANDBOOK.chapterHref = function (slug) { return HANDBOOK.root() + "chapters/" + slug + ".html"; };
HANDBOOK.rootHref = function (file) { return HANDBOOK.root() + file; };

HANDBOOK.chapterBySlug = function (slug) {
  return HANDBOOK.chapters.find(function (c) { return c.slug === slug; });
};

/* ---- render the grouped sidebar nav ---- */
HANDBOOK.renderSidebar = function (mountSel, currentSlug) {
  var mount = document.querySelector(mountSel);
  if (!mount) return;
  var parts = [];
  HANDBOOK.chapters.forEach(function (c) {
    var p = parts.find(function (x) { return x.name === c.part; });
    if (!p) { p = { name: c.part, items: [] }; parts.push(p); }
    p.items.push(c);
  });

  var html = '<a class="nav-link" href="' + HANDBOOK.rootHref("index.html") + '" ' +
             (currentSlug === "home" ? 'aria-current="page"' : "") + '>' +
             '<span class="nav-link__num">◆</span><span>Cover &amp; Contents</span></a>';

  parts.forEach(function (p) {
    html += '<div class="nav-part"><div class="nav-part__label">' + p.name + "</div>";
    p.items.forEach(function (c) {
      html += '<a class="nav-link" href="' + HANDBOOK.chapterHref(c.slug) + '" ' +
              (c.slug === currentSlug ? 'aria-current="page"' : "") + '>' +
              '<span class="nav-link__num">' + c.num + "</span><span>" + c.title + "</span></a>";
    });
    html += "</div>";
  });

  html += '<div class="nav-part"><div class="nav-part__label">Reference</div>' +
          '<a class="nav-link" href="' + HANDBOOK.rootHref("glossary.html") + '" ' +
          (currentSlug === "glossary" ? 'aria-current="page"' : "") +
          '><span class="nav-link__num">¶</span><span>Glossary</span></a>' +
          '<a class="nav-link" href="' + HANDBOOK.rootHref("references.html") + '" ' +
          (currentSlug === "references" ? 'aria-current="page"' : "") +
          '><span class="nav-link__num">†</span><span>References</span></a></div>';

  mount.innerHTML = html;
};

/* ---- prev / next pager ---- */
HANDBOOK.renderPager = function (mountSel, currentSlug) {
  var mount = document.querySelector(mountSel);
  if (!mount) return;
  var i = HANDBOOK.chapters.findIndex(function (c) { return c.slug === currentSlug; });
  if (i === -1) return;
  var prev = HANDBOOK.chapters[i - 1];
  var next = HANDBOOK.chapters[i + 1];
  var html = "";
  if (prev) {
    html += '<a class="prev" href="' + HANDBOOK.chapterHref(prev.slug) + '">' +
            '<span class="dir">← Plate ' + prev.num + "</span>" +
            '<span class="ttl">' + prev.title + "</span></a>";
  }
  if (next) {
    html += '<a class="next" href="' + HANDBOOK.chapterHref(next.slug) + '">' +
            '<span class="dir">Plate ' + next.num + " →</span>" +
            '<span class="ttl">' + next.title + "</span></a>";
  }
  mount.innerHTML = html;
};

/* ---- author byline centered in the fixed top bar (always visible, every page) ---- */
HANDBOOK.renderByline = function () {
  var bar = document.querySelector(".topbar");
  if (!bar || bar.querySelector(".topbar__center")) return;
  var b = document.createElement("a");
  b.className = "topbar__center";
  b.href = HANDBOOK.rootHref("index.html") + "#about";
  b.setAttribute("aria-label", "About the author");
  b.innerHTML = "by <b>Sudhanshu Shekhar</b>";
  bar.appendChild(b);
};

/* ---- share: canonical URL + per-page share metadata ---- */
HANDBOOK.shareMeta = function (slug) {
  var base = HANDBOOK.meta.canonical;
  var book = "The Engineer's Field Guide to LLMs";
  var c = HANDBOOK.chapterBySlug(slug);
  if (c)                     return { url: base + "chapters/" + slug + ".html", title: c.title,      caption: c.title + " — from " + book };
  if (slug === "glossary")   return { url: base + "glossary.html",              title: "Glossary",   caption: "Glossary — " + book };
  if (slug === "references") return { url: base + "references.html",            title: "References", caption: "References — " + book };
  return { url: base, title: HANDBOOK.meta.title,
           caption: HANDBOOK.meta.title + " — learn LLMs as a software engineer" };
};

/* real brand logos (monochrome, inherit currentColor), shared by both share UIs */
HANDBOOK.SHARE_GLYPH = {
  x:  '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>',
  li: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>',
  hn: '<span class="si__y">Y</span>',
  rd: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/></svg>',
  bs: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M5.865 1.813C8.987 4.155 12.34 8.902 13.573 11.45c1.234-2.548 4.586-7.295 7.708-9.637C23.539.123 24 .938 24 3.936c0 .598-.343 5.026-.544 5.746-.697 2.5-3.246 3.137-5.514 2.751 3.962.674 4.969 2.906 2.792 5.139-4.133 4.24-5.94-1.064-6.404-2.423-.085-.249-.125-.365-.126-.267-.001-.098-.041.018-.126.267-.463 1.36-2.27 6.663-6.404 2.423-2.177-2.233-1.17-4.465 2.792-5.139-2.268.386-4.817-.251-5.514-2.751C.343 8.962 0 4.534 0 3.936 0 .938.461.123 3.35 1.813Z"/></svg>',
  wa: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.002-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.334.101 11.893c0 2.096.549 4.14 1.595 5.945L0 24l6.335-1.652a12.062 12.062 0 005.71 1.447h.006c6.585 0 11.946-5.335 11.949-11.894 0-3.176-1.24-6.165-3.495-8.411"/></svg>',
  tg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>',
  cp: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>',
  nv: '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></svg>'
};

/* build the platform share-intent list from a {url,title,caption} meta */
HANDBOOK.shareItems = function (m) {
  var U = encodeURIComponent(m.url), T = encodeURIComponent(m.title),
      C = encodeURIComponent(m.caption), CU = encodeURIComponent(m.caption + " " + m.url);
  return [
    { k: "x",  label: "Post on X",   href: "https://twitter.com/intent/tweet?text=" + C + "&url=" + U },
    { k: "li", label: "LinkedIn",    href: "https://www.linkedin.com/sharing/share-offsite/?url=" + U },
    { k: "hn", label: "Hacker News", href: "https://news.ycombinator.com/submitlink?u=" + U + "&t=" + T },
    { k: "rd", label: "Reddit",      href: "https://www.reddit.com/submit?url=" + U + "&title=" + T },
    { k: "bs", label: "Bluesky",     href: "https://bsky.app/intent/compose?text=" + CU },
    { sep: true },
    { k: "wa", label: "WhatsApp",    href: "https://api.whatsapp.com/send?text=" + CU },
    { k: "tg", label: "Telegram",    href: "https://t.me/share/url?url=" + U + "&text=" + C },
    { sep: true },
    { k: "cp", label: "Copy link",   copy: true }
  ];
};

HANDBOOK.copyText = function (text, done) {
  if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, done);
  else { var ta = document.createElement("textarea"); ta.value = text; document.body.appendChild(ta); ta.select(); try { document.execCommand("copy"); } catch (x) {} document.body.removeChild(ta); done(); }
};

/* ---- top-bar share button + popover — always shares THE BOOK (every page) ---- */
HANDBOOK.renderShare = function () {
  var actions = document.querySelector(".topbar__actions");
  if (!actions || actions.querySelector(".sharebtn")) return;
  var m = HANDBOOK.shareMeta("home");           /* the book, regardless of page */
  var G = HANDBOOK.SHARE_GLYPH, items = HANDBOOK.shareItems(m);

  function rows(list) {
    return list.map(function (it) {
      if (it.sep) return '<div class="sharemenu__sep"></div>';
      var badge = '<span class="si si--' + it.k + '">' + G[it.k] + "</span>";
      if (it.copy)
        return '<button type="button" class="sharemenu__item" data-copy="' + encodeURIComponent(m.url) + '">' + badge + "<span>" + it.label + "</span></button>";
      return '<a class="sharemenu__item" href="' + it.href + '" target="_blank" rel="noopener">' + badge + "<span>" + it.label + "</span></a>";
    }).join("");
  }

  var wrap = document.createElement("div");
  wrap.className = "sharewrap";
  wrap.innerHTML =
    '<button type="button" class="iconbtn sharebtn" aria-label="Share the book" aria-haspopup="true" aria-expanded="false" title="Share the book">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4"/></svg>' +
    "</button>" +
    '<div class="sharemenu" role="menu">' +
      '<div class="sharemenu__hd">Share this book</div>' + rows(items) +
    "</div>";

  var btn = wrap.querySelector(".sharebtn");
  var menu = wrap.querySelector(".sharemenu");

  /* native OS share sheet — only where the API exists */
  if (navigator.share) {
    var nv = document.createElement("button");
    nv.type = "button";
    nv.className = "sharemenu__item";
    nv.innerHTML = '<span class="si si--nv">' + G.nv + "</span><span>More…</span>";
    nv.addEventListener("click", function () {
      navigator.share({ title: m.title, text: m.caption, url: m.url }).catch(function () {});
      close();
    });
    menu.appendChild(document.createElement("div")).className = "sharemenu__sep";
    menu.appendChild(nv);
  }

  function open()  { menu.classList.add("open");  btn.setAttribute("aria-expanded", "true");  document.addEventListener("click", onDoc, true); document.addEventListener("keydown", onKey); }
  function close() { menu.classList.remove("open"); btn.setAttribute("aria-expanded", "false"); document.removeEventListener("click", onDoc, true); document.removeEventListener("keydown", onKey); }
  function onDoc(e){ if (!wrap.contains(e.target)) close(); }
  function onKey(e){ if (e.key === "Escape") { close(); btn.focus(); } }

  btn.addEventListener("click", function (e) {
    e.stopPropagation();
    menu.classList.contains("open") ? close() : open();
  });

  menu.addEventListener("click", function (e) {
    var cp = e.target.closest("[data-copy]");
    if (cp) {
      e.preventDefault();
      var span = cp.querySelector("span:last-child"), prev = span.textContent;
      HANDBOOK.copyText(decodeURIComponent(cp.getAttribute("data-copy")), function () {
        span.textContent = "Copied!"; cp.classList.add("is-done");
        setTimeout(function () { span.textContent = prev; cp.classList.remove("is-done"); close(); }, 1100);
      });
      return;
    }
    if (e.target.closest("a")) close(); /* platform link opened in new tab */
  });

  actions.insertBefore(wrap, actions.firstChild);
};

/* ---- end-of-chapter "Share this chapter" block (chapter pages only) ---- */
HANDBOOK.renderChapterShare = function (slug) {
  if (!HANDBOOK.chapterBySlug(slug)) return;         /* chapters only */
  var pager = document.querySelector("#pager");
  if (!pager || document.querySelector(".chapshare")) return;
  var m = HANDBOOK.shareMeta(slug), G = HANDBOOK.SHARE_GLYPH;

  var btns = HANDBOOK.shareItems(m).filter(function (it) { return !it.sep; }).map(function (it) {
    var badge = '<span class="si si--' + it.k + '">' + G[it.k] + "</span>";
    if (it.copy)
      return '<button type="button" class="chapshare__btn" data-copy="' + encodeURIComponent(m.url) + '" data-tip="Copy link" aria-label="Copy link">' + badge + "</button>";
    return '<a class="chapshare__btn" href="' + it.href + '" target="_blank" rel="noopener" data-tip="' + it.label + '" aria-label="' + it.label + '">' + badge + "</a>";
  }).join("");

  var block = document.createElement("section");
  block.className = "chapshare";
  block.innerHTML = '<span class="chapshare__label">Share this chapter</span><div class="chapshare__row">' + btns + "</div>";

  if (navigator.share) {
    var nv = document.createElement("button");
    nv.type = "button"; nv.className = "chapshare__btn"; nv.setAttribute("data-tip", "More…"); nv.setAttribute("aria-label", "More sharing options");
    nv.innerHTML = '<span class="si si--nv">' + G.nv + "</span>";
    nv.addEventListener("click", function () { navigator.share({ title: m.title, text: m.caption, url: m.url }).catch(function () {}); });
    block.querySelector(".chapshare__row").appendChild(nv);
  }

  block.addEventListener("click", function (e) {
    var cp = e.target.closest("[data-copy]");
    if (!cp) return;
    e.preventDefault();
    var si = cp.querySelector(".si"), prev = si.innerHTML;
    HANDBOOK.copyText(decodeURIComponent(cp.getAttribute("data-copy")), function () {
      si.textContent = "✓"; cp.classList.add("is-done");
      setTimeout(function () { si.innerHTML = prev; cp.classList.remove("is-done"); }, 1100);
    });
  });

  pager.parentNode.insertBefore(block, pager);        /* content → share → prev/next */
};

/* ---- site-wide authorship footer (rendered on every page from one source) ---- */
HANDBOOK.renderFooter = function () {
  if (document.querySelector(".sitefooter")) return;
  var aboutHref = HANDBOOK.rootHref("index.html") + "#about";
  var f = document.createElement("footer");
  f.className = "sitefooter";
  f.innerHTML =
    '<div class="sitefooter__inner">' +
      "<span>&copy; 2026 <b>Sudhanshu Shekhar</b></span>" +
      '<span class="sitefooter__dot">&middot;</span>' +
      "<span><i>The Engineer&rsquo;s Field Guide to LLMs</i></span>" +
      '<span class="sitefooter__dot">&middot;</span>' +
      '<a href="https://creativecommons.org/licenses/by-nc/4.0/" target="_blank" rel="noopener">Licensed CC BY-NC 4.0</a>' +
      '<span class="sitefooter__dot">&middot;</span>' +
      '<a href="' + aboutHref + '">About the author</a>' +
    "</div>";
  document.body.appendChild(f);
};

/* ---- search index: chapters + (optional) per-page sections ---- */
HANDBOOK.searchIndex = function () {
  var idx = HANDBOOK.chapters.map(function (c) {
    return { title: c.title, sub: "Plate " + c.num + " · " + c.part, href: HANDBOOK.chapterHref(c.slug),
             text: (c.title + " " + c.blurb + " " + c.tags.join(" ")).toLowerCase() };
  });
  idx.push({ title: "Glossary", sub: "Reference", href: HANDBOOK.rootHref("glossary.html"), text: "glossary terms jargon definitions" });
  idx.push({ title: "References", sub: "Reference", href: HANDBOOK.rootHref("references.html"), text: "references papers bibliography citations" });
  return idx;
};
