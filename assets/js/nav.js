/* =============================================================================
   nav.js — single source of truth for the chapter list.
   Renders the left sidebar, prev/next pager, and feeds the search index.
   No fetch(): everything is a JS object so the site runs from file://.
   ============================================================================= */
window.HANDBOOK = window.HANDBOOK || {};

HANDBOOK.meta = {
  title: "The Engineer's Field Guide to Large Language Models",
  subtitle: "From API consumer to model contributor",
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
