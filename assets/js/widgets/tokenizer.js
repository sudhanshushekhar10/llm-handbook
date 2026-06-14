/* =============================================================================
   tokenizer.js — Tokenizer Playground (Plate 04)
   An *approximate* GPT-style (byte-level BPE-flavoured) tokenizer, implemented
   self-contained so it runs offline. Real tokenizers use a learned merge table;
   this mirrors the behaviour (subword splitting, leading-space tokens, ~4 chars/
   token for English) closely enough to build intuition. Counts are approximate.
   Mount:  FGTokenizer.mount("#el")
   ============================================================================= */
window.FGTokenizer = (function () {
  var SAMPLE = "Fine-tuning a 7B model with LoRA costs surprisingly little VRAM.\nTokenization turns text into integers the Transformer can read.";
  var PALETTE = ["#2F5BD0", "#B5812A", "#2C5D86", "#9C3B2C", "#6A5A8C", "#496CA8"];

  // GPT-2-style pre-tokenization regex (contractions, words, numbers, punct, ws)
  var RE = /'s|'t|'re|'ve|'m|'ll|'d| ?[A-Za-z]+| ?[0-9]+| ?[^\sA-Za-z0-9]+|\s+/g;

  function hash(s) { var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = (h * 16777619) >>> 0; } return h; }

  function splitWord(piece) {
    // strip a leading space, remember it
    var lead = piece[0] === " ";
    var body = lead ? piece.slice(1) : piece;
    if (body.length <= 5) return [(lead ? "·" : "") + body];
    // approximate BPE: chunk into ~4-char subwords, biggest first chunk gets the space
    var out = [], i = 0, first = true;
    while (i < body.length) {
      var size = first ? 5 : 4;
      var chunk = body.slice(i, i + size);
      out.push((first && lead ? "·" : "") + chunk);
      i += size; first = false;
    }
    return out;
  }

  function tokenize(text) {
    var tokens = [];
    var m;
    RE.lastIndex = 0;
    while ((m = RE.exec(text)) !== null) {
      var piece = m[0];
      if (/^\s+$/.test(piece)) {
        // whitespace: newline => its own token; runs of spaces => grouped
        piece.replace(/\n/g, "⏎").split("").forEach(function () {});
        if (piece.indexOf("\n") !== -1) { tokens.push("⏎"); }
        else { tokens.push("␣"); }
      } else {
        splitWord(piece).forEach(function (t) { tokens.push(t); });
      }
    }
    return tokens;
  }

  function mount(sel) {
    var el = typeof sel === "string" ? document.querySelector(sel) : sel;
    if (!el) return;
    el.innerHTML =
      '<div class="widget">' +
        '<div class="widget__head"><span class="badge">Try it</span><h4>Tokenizer Playground</h4>' +
          '<span style="margin-left:auto;font-family:var(--font-mono);font-size:.66rem;color:var(--text-3)">≈ GPT-style BPE</span></div>' +
        '<div class="widget__body">' +
          '<textarea id="tk-in" rows="4" spellcheck="false"></textarea>' +
          '<div style="display:flex;gap:.8rem;align-items:center;margin:.7rem 0 .3rem;flex-wrap:wrap">' +
            '<label style="font-family:var(--font-ui);font-size:.8rem;color:var(--text-2)">Context window</label>' +
            '<select id="tk-ctx" style="width:auto">' +
              '<option value="2048">2K</option><option value="4096">4K</option>' +
              '<option value="8192" selected>8K</option><option value="32768">32K</option>' +
              '<option value="131072">128K</option></select>' +
            '<div class="bar" style="flex:1;min-width:120px"><span id="tk-fill" style="width:0"></span></div>' +
          '</div>' +
          '<div class="statgrid">' +
            '<div class="stat"><div class="k">Characters</div><div class="v" id="tk-chars">0</div></div>' +
            '<div class="stat"><div class="k">Tokens ≈</div><div class="v" id="tk-tokens">0</div></div>' +
            '<div class="stat"><div class="k">Chars / token</div><div class="v" id="tk-ratio">0</div></div>' +
            '<div class="stat"><div class="k">% of context</div><div class="v" id="tk-pct">0<small>%</small></div></div>' +
          '</div>' +
          '<div style="font-family:var(--font-mono);font-size:.62rem;letter-spacing:.1em;text-transform:uppercase;color:var(--text-3);margin:1.1rem 0 .5rem">Token stream &nbsp;·&nbsp; hover for ID</div>' +
          '<div id="tk-stream" style="display:flex;flex-wrap:wrap;gap:3px;line-height:1.9"></div>' +
        '</div>' +
      '</div>';

    var input = el.querySelector("#tk-in");
    input.value = SAMPLE;

    function render() {
      var text = input.value;
      var toks = tokenize(text);
      var ctx = parseInt(el.querySelector("#tk-ctx").value, 10);
      el.querySelector("#tk-chars").textContent = text.length;
      el.querySelector("#tk-tokens").textContent = toks.length;
      el.querySelector("#tk-ratio").textContent = toks.length ? (text.length / toks.length).toFixed(1) : "0";
      var pct = Math.min(100, (toks.length / ctx) * 100);
      el.querySelector("#tk-pct").innerHTML = pct.toFixed(pct < 1 ? 2 : 1) + "<small>%</small>";
      el.querySelector("#tk-fill").style.width = pct + "%";

      var stream = toks.map(function (t, i) {
        var id = (hash(t) % 50257);
        var c = PALETTE[i % PALETTE.length];
        var label = t.replace(/</g, "&lt;");
        return '<span title="id ' + id + '" style="background:' + c + '22;border:1px solid ' + c + '55;color:var(--text);' +
               'padding:.05em .4em;border-radius:3px;font-family:var(--font-mono);font-size:.78rem;cursor:default">' + label + "</span>";
      }).join("");
      el.querySelector("#tk-stream").innerHTML = stream;
    }

    input.addEventListener("input", render);
    el.querySelector("#tk-ctx").addEventListener("change", render);
    render();
  }

  return { mount: mount, tokenize: tokenize };
})();
