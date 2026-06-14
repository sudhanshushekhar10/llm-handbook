# Chapter Authoring Style Guide — The Engineer's Field Guide to LLMs

You are writing ONE self-contained HTML chapter for a static, no-build documentation site.
Copy `chapters/_template.html`, fill the masthead + `<article>` body + `PAGE.slug`, and save as `chapters/<slug>.html`.

## Audience & voice
- Reader: a **senior software engineer** fluent in APIs, databases, distributed systems, but new to ML.
- Tone: lucid, story-driven, confident, a little witty. Explain the *why* and the *history* ("what was tried, what worked, what didn't, why this won").
- **Always reach for analogies** — both real-world and software-engineering (lexer, cache/memoization, git diff, load balancer, codec, hashmap, compiler, REPL, sharding…).
- Intermediate depth: enough to contribute. Push heavy math into a `<details class="deep">` block.
- Length per chapter: roughly 1,400–2,400 words. 4–7 `<h2>` sections + a Recap.

## Hard rules (do not break)
1. **No `fetch()` / no external data files.** Everything is inline HTML or uses the shared JS registries.
2. Every major section is `<h2 id="kebab-case-id">` — the right-rail TOC is auto-built from these. End with `<h2 id="recap">Recap</h2>` (a `<ul>` of takeaways).
3. Only reference glossary/citation keys that exist in the lists below. An invalid key renders as `[?]` (citations) or a dead tooltip (glossary) — don't guess keys.
4. Keep the `<head>`, topbar, sidebar, modal, and script block from the template **verbatim**, except the title/description and `PAGE.slug`.
5. First mention of a jargon term → wrap in a glossary span. Don't wrap every occurrence, just the first meaningful one.
6. Code that's a runnable tutorial uses the **Local/Cloud tabbed** block with an expected-output pane. Keep code correct and current (PyTorch, Hugging Face `transformers`/`peft`/`trl`, `bitsandbytes`, `llama.cpp`/Ollama). Prefer real model ids.
7. Set the masthead `plate-no`, `<h1>`, `standfirst`, and `meta`. Set `PAGE.slug` to the filename without `.html`.

## Components (copy these patterns)

### Callouts (pick the right flavor; tag text is free)
```html
<div class="callout callout--analogy"><div class="callout__tag">Analogy · short label</div><p>…</p></div>
<div class="callout callout--win"><div class="callout__tag">What won — and why</div><p>…</p></div>
<div class="callout callout--fail"><div class="callout__tag">What didn't — and why</div><p>…</p></div>
<div class="callout callout--gotcha"><div class="callout__tag">Gotcha · short label</div><p>…</p></div>
<div class="callout callout--swe"><div class="callout__tag">From a software-eng POV</div><p>…</p></div>
```
Key-paper callout (use once or twice per chapter for THE defining paper):
```html
<div class="callout callout--paper"><div class="callout__tag">Key paper</div>
  <div class="ref-card"><span class="yr">2022</span>
    <div><cite>Paper Title</cite><span class="auth">Authors — Venue</span>
      <p style="margin:.5rem 0 0;font-size:.92rem">Why it matters. <a href="../references.html#ref-NN">See reference [NN] →</a></p>
    </div></div></div>
```

### Citation chip (number + link auto-filled from references.js)
```html
…the Transformer<a class="cite" data-ref="vaswani2017"></a>.
```

### Glossary term (dotted underline + hover tooltip + click-through)
```html
<span class="gloss" data-term="lora">LoRA</span>
```

### Code block with Local/Cloud tabs + copy + expected output
```html
<div class="codeblock" data-tabs>
  <div class="codeblock__bar">
    <span class="codeblock__lang"><span class="lamp"></span>python · short label</span>
    <button class="tab" data-pane="local" aria-selected="true">Local · Mac/MPS</button>
    <button class="tab" data-pane="cloud">Cloud · CUDA</button>
    <button class="copybtn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>copy</button>
  </div>
  <div class="code-pane" data-pane="local"><pre><code class="language-python">…local code…</code></pre></div>
  <div class="code-pane" data-pane="cloud" hidden><pre><code class="language-python">…cloud code…</code></pre></div>
  <div class="codeblock code-out" style="margin:0;border:0;border-radius:0">
    <div class="codeblock__bar"><span class="codeblock__lang"><span class="lamp"></span>output</span></div>
    <pre><code>…expected output, with brief # comments…</code></pre>
  </div>
</div>
```
For non-tutorial illustrative snippets you may use a single pane (omit the tab buttons and the second pane). Tabs can also be "From scratch / With library" where Local/Cloud doesn't apply. Use `class="language-python"` / `language-bash` / `language-json` on `<code>`.

### Deep-dive (optional advanced detail)
```html
<details class="deep"><summary>▸ Heading <span class="tag">deep dive</span></summary>
  <div><p>…math or advanced nuance…</p></div></details>
```

### Table
```html
<div class="tablewrap"><table><thead><tr><th>…</th></tr></thead><tbody><tr><td>…</td></tr></tbody></table></div>
```

### Figure with optional inline SVG diagram (use CSS vars for theme-awareness: fill="var(--accent)" etc.)
```html
<figure class="diagram"><svg viewBox="0 0 520 300" role="img" aria-label="…">…</svg>
  <figcaption><b>Caption lead.</b> Explanation.</figcaption></figure>
```

## Valid glossary keys (data-term="…")
token, tokenizer, bpe, vocabulary, embedding, context-window, transformer, attention, self-attention, multi-head, positional-encoding, parameter, tensor, logits, softmax, temperature, top-k, top-p, autoregressive, pretraining, loss, perplexity, gradient-descent, backprop, optimizer, learning-rate, scaling-laws, emergence, fine-tuning, sft, instruction-tuning, peft, lora, qlora, adapter, rank, alignment, rlhf, reward-model, ppo, dpo, rlaif, quantization, fp16, int4, gptq, awq, gguf, llama-cpp, inference, kv-cache, serving, vllm, flashattention, ollama, moe, gqa, rope, mixed-precision, gradient-accumulation, fsdp, checkpoint, huggingface, transformers-lib, pytorch, cuda, pydantic, structured-output, rag, embedding-model, vector-db, hallucination, prompt, chat-template, zero-shot, distillation, agents

## Valid citation keys (data-ref="…") → number is auto-assigned
shannon1948, williams1992, bengio2003, mikolov2013, pennington2014, sutskever2014, bahdanau2014, sennrich2016, vaswani2017, shazeer2017, christiano2017, schulman2017, devlin2018, radford2018, kudo2018, radford2019, houlsby2019, brown2020, kaplan2020, lewis2020, hu2021, su2021, fedus2021, hendrycks2021, chen2021, hoffmann2022, weicot2022, wei2022, ouyang2022, dettmers2022, frantar2022, dao2022, bai2022, leviathan2022, touvron2023, rafailov2023, dettmers2023, lin2023, ainslie2023, kwon2023, zheng2023, gu2023

(The reference number shown to readers is assigned automatically by order in references.js — just use the key.)

## Reference chapters to imitate
`04-tokenization.html`, `05-transformer.html`, `10-peft-lora.html`, `13-quantization.html` are the gold standard for structure, depth, voice, and component usage. Match them.
