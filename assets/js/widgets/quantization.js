/* =============================================================================
   quantization.js — Quantization Tradeoff Explorer (Plate 13)
   Shows, for a chosen model size, how disk size / quality / speed trade off
   across common precisions and llama.cpp k-quant levels.
   Quality & speed numbers are ILLUSTRATIVE trends (Q4_K_M ≈ near-lossless;
   Q2_K clearly degraded) — directionally right, not benchmark-exact.
   Mount:  FGQuant.mount("#el")
   ============================================================================= */
window.FGQuant = (function () {
  var GB = 1024 * 1024 * 1024;
  // bpw = bits per weight (incl. k-quant overhead); q = % quality retained; sp = relative tok/s
  var LEVELS = [
    { name: "fp16 / bf16", bpw: 16.0, q: 100.0, sp: 1.0, note: "Full precision baseline" },
    { name: "Q8_0 (int8)", bpw: 8.5,  q: 99.7,  sp: 1.4, note: "Effectively lossless" },
    { name: "Q6_K",        bpw: 6.56, q: 99.1,  sp: 1.7, note: "Excellent; rarely worth more" },
    { name: "Q5_K_M",      bpw: 5.67, q: 98.4,  sp: 1.9, note: "Great quality, modest size" },
    { name: "Q4_K_M",      bpw: 4.83, q: 97.2,  sp: 2.3, note: "★ The popular sweet spot" },
    { name: "Q4_0",        bpw: 4.55, q: 95.8,  sp: 2.4, note: "Older 4-bit; superseded by K-quants" },
    { name: "Q3_K_M",      bpw: 3.91, q: 92.0,  sp: 2.7, note: "Noticeable drift; for tight memory" },
    { name: "Q2_K",        bpw: 3.35, q: 82.0,  sp: 3.0, note: "Last resort; clearly degraded" },
  ];
  var PRESETS = [{ n: "7B", p: 7 }, { n: "8B", p: 8 }, { n: "13B", p: 13 }, { n: "34B", p: 34 }, { n: "70B", p: 70 }];

  function sizeGB(p, bpw) { return (p * 1e9 * bpw / 8) / GB; }

  function mount(sel) {
    var el = typeof sel === "string" ? document.querySelector(sel) : sel;
    if (!el) return;
    el.innerHTML =
      '<div class="widget">' +
        '<div class="widget__head"><span class="badge">Try it</span><h4>Quantization Tradeoff Explorer</h4>' +
          '<span style="margin-left:auto;font-family:var(--font-mono);font-size:.66rem;color:var(--text-3)">illustrative</span></div>' +
        '<div class="widget__body">' +
          '<div style="display:flex;gap:.6rem;align-items:center;flex-wrap:wrap;margin-bottom:.4rem">' +
            '<div style="display:flex;gap:.35rem" id="qz-presets"></div>' +
            '<label style="font-family:var(--font-ui);font-size:.8rem;color:var(--text-2);margin-left:auto">Params</label>' +
            '<input type="range" id="qz-p" min="1" max="70" step="1" style="width:160px"><output id="qz-p-o" style="font-family:var(--font-mono);font-size:.8rem;color:var(--accent-deep)"></output>' +
          '</div>' +
          '<div class="tablewrap" style="margin-top:.8rem"><table><thead><tr>' +
            '<th>Precision</th><th>Bits/wt</th><th>Disk size</th><th>Quality (illustrative)</th><th>Speed</th><th>Notes</th>' +
          '</tr></thead><tbody id="qz-rows"></tbody></table></div>' +
          '<div style="font-family:var(--font-mono);font-size:.66rem;color:var(--text-3);margin-top:.7rem">Quality = rough % of fp16 capability retained. Speed = relative tokens/sec (smaller weights ⇒ less memory traffic). Past ~Q4, size barely shrinks but quality falls off a cliff.</div>' +
        '</div></div>';

    var presetWrap = el.querySelector("#qz-presets");
    PRESETS.forEach(function (p) {
      var b = document.createElement("button"); b.className = "tab"; b.textContent = p.n;
      b.addEventListener("click", function () { el.querySelector("#qz-p").value = p.p; render(); });
      presetWrap.appendChild(b);
    });

    function render() {
      var p = parseInt(el.querySelector("#qz-p").value, 10);
      el.querySelector("#qz-p-o").textContent = p + "B";
      el.querySelector("#qz-rows").innerHTML = LEVELS.map(function (L) {
        var gb = sizeGB(p, L.bpw);
        var star = L.name.indexOf("Q4_K_M") !== -1;
        var qbar = '<div class="bar" style="width:90px;display:inline-block;vertical-align:middle"><span style="width:' + L.q + '%;background:' +
                   (L.q > 96 ? "var(--accent)" : L.q > 90 ? "var(--amber)" : "var(--rust)") + '"></span></div> ' +
                   '<span style="font-family:var(--font-mono);font-size:.72rem;color:var(--text-3)">' + L.q.toFixed(0) + "%</span>";
        return '<tr' + (star ? ' style="background:color-mix(in srgb,var(--accent-soft) 50%,transparent)"' : "") + ">" +
               "<td><b>" + L.name + "</b></td>" +
               "<td><code>" + L.bpw.toFixed(2) + "</code></td>" +
               '<td><code>' + gb.toFixed(1) + " GB</code></td>" +
               "<td>" + qbar + "</td>" +
               '<td><code>' + L.sp.toFixed(1) + "×</code></td>" +
               '<td style="color:var(--text-2);font-size:.8rem">' + L.note + "</td></tr>";
      }).join("");
    }

    el.querySelector("#qz-p").addEventListener("input", render);
    el.querySelector("#qz-p").value = 8;
    render();
  }

  return { mount: mount };
})();
