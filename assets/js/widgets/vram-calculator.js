/* =============================================================================
   vram-calculator.js — VRAM / Parameter Calculator (Plates 10 & 13)
   Rough, transparent memory estimate for running OR fine-tuning an LLM.
   Numbers are approximations (real usage depends on arch, GQA, kernels,
   activation checkpointing). The point is to *feel* how each knob moves memory.
   Mount:  FGVram.mount("#el")
   ============================================================================= */
window.FGVram = (function () {
  var GB = 1024 * 1024 * 1024;
  var PRESETS = [
    { name: "Qwen2.5 0.5B", p: 0.5 }, { name: "Phi-3 mini 3.8B", p: 3.8 },
    { name: "Mistral 7B", p: 7.2 }, { name: "Llama-3 8B", p: 8.0 },
    { name: "Llama-2 13B", p: 13 }, { name: "Yi 34B", p: 34 }, { name: "Llama-3 70B", p: 70 },
  ];
  var HW = [
    { n: "RTX 3060 / 12 GB", g: 12 }, { n: "RTX 4090 / 24 GB", g: 24 },
    { n: "A6000 / 48 GB", g: 48 }, { n: "A100 / 80 GB", g: 80 },
    { n: "H100 / 80 GB", g: 80 }, { n: "2× A100 / 160 GB", g: 160 }, { n: "8× H100 / 640 GB", g: 640 },
  ];
  var BYTES = { fp16: 2, int8: 1, int4: 0.5 };

  // estimate (layers, d_model) from parameter count
  function estArch(pB) {
    var pts = [[0.5,24,896],[1.5,28,2048],[3.8,32,3072],[7,32,4096],[8,32,4096],
               [13,40,5120],[34,60,7168],[70,80,8192]];
    for (var i = 0; i < pts.length - 1; i++) {
      if (pB <= pts[i+1][0]) {
        var a = pts[i], b = pts[i+1], t = (pB - a[0]) / (b[0] - a[0]);
        return { L: Math.round(a[1] + t*(b[1]-a[1])), d: Math.round(a[2] + t*(b[2]-a[2])) };
      }
    }
    return { L: 80, d: 8192 };
  }

  function compute(s) {
    var P = s.params * 1e9, arch = estArch(s.params), wb = BYTES[s.prec];
    var kv = 2 * arch.L * arch.d * s.seq * s.batch * 2;            // fp16 K+V
    var act = s.batch * s.seq * arch.d * arch.L * 2 * (s.ckpt ? 0.18 : 1.0);
    var parts;
    if (s.mode === "infer") {
      parts = [["Weights", P * wb], ["KV cache", kv], ["Overhead", (P*wb + kv) * 0.06]];
    } else if (s.mode === "full") {
      parts = [["Weights (fp16)", P*2], ["Gradients", P*2], ["Optimizer (AdamW)", P*12],
               ["Activations", act]];
    } else { // lora / qlora
      var loraP = 4 * s.rank * arch.d * arch.L;       // ~q,v adapters
      parts = [["Base weights", P * wb], ["LoRA params + grad + opt", loraP * 18], ["Activations", act]];
    }
    var total = parts.reduce(function (a, b) { return a + b[1]; }, 0);
    return { parts: parts, total: total, arch: arch };
  }

  function fmt(bytes) {
    var g = bytes / GB;
    return g >= 10 ? g.toFixed(0) : g.toFixed(g < 1 ? 2 : 1);
  }

  function mount(sel) {
    var el = typeof sel === "string" ? document.querySelector(sel) : sel;
    if (!el) return;
    el.innerHTML =
      '<div class="widget">' +
        '<div class="widget__head"><span class="badge">Try it</span><h4>VRAM / Parameter Calculator</h4>' +
          '<span style="margin-left:auto;font-family:var(--font-mono);font-size:.66rem;color:var(--text-3)">rough estimate</span></div>' +
        '<div class="widget__body">' +
          '<div style="display:flex;gap:.35rem;flex-wrap:wrap;margin-bottom:1rem" id="vr-presets"></div>' +
          '<div class="widget__row"><label>Parameters</label><input type="range" id="vr-params" min="0.5" max="70" step="0.1"><output id="vr-params-o"></output></div>' +
          '<div class="widget__row"><label>Mode</label><select id="vr-mode">' +
            '<option value="infer">Inference</option><option value="full">Training · full fine-tune</option>' +
            '<option value="lora">Training · LoRA / QLoRA</option></select><span></span></div>' +
          '<div class="widget__row"><label>Weight precision</label><select id="vr-prec">' +
            '<option value="fp16">fp16 / bf16 (16-bit)</option><option value="int8">int8 (8-bit)</option>' +
            '<option value="int4">int4 / QLoRA (4-bit)</option></select><span></span></div>' +
          '<div class="widget__row"><label>Batch size</label><input type="range" id="vr-batch" min="1" max="32" step="1"><output id="vr-batch-o"></output></div>' +
          '<div class="widget__row"><label>Sequence length</label><input type="range" id="vr-seq" min="512" max="32768" step="512"><output id="vr-seq-o"></output></div>' +
          '<div class="widget__row" id="vr-rank-row"><label>LoRA rank</label><input type="range" id="vr-rank" min="4" max="128" step="4"><output id="vr-rank-o"></output></div>' +
          '<div class="widget__row"><label>Activation checkpointing</label><input type="checkbox" id="vr-ckpt" style="justify-self:start;width:auto"><span></span></div>' +
          '<div style="margin-top:1rem;border-top:1px solid var(--line);padding-top:1rem">' +
            '<div style="display:flex;align-items:baseline;gap:.6rem"><div style="font-family:var(--font-display);font-size:2.6rem;color:var(--accent-deep);line-height:1" id="vr-total">–</div>' +
              '<div style="font-family:var(--font-mono);font-size:.8rem;color:var(--text-3)">GB est. · <span id="vr-fits"></span></div></div>' +
            '<div id="vr-bars" style="margin-top:1rem;display:flex;flex-direction:column;gap:.45rem"></div>' +
          '</div>' +
        '</div></div>';

    var ids = ["params","mode","prec","batch","seq","rank","ckpt"];
    function read() {
      return {
        params: parseFloat(el.querySelector("#vr-params").value),
        mode: el.querySelector("#vr-mode").value,
        prec: el.querySelector("#vr-prec").value,
        batch: parseInt(el.querySelector("#vr-batch").value, 10),
        seq: parseInt(el.querySelector("#vr-seq").value, 10),
        rank: parseInt(el.querySelector("#vr-rank").value, 10),
        ckpt: el.querySelector("#vr-ckpt").checked,
      };
    }

    var presetWrap = el.querySelector("#vr-presets");
    PRESETS.forEach(function (p) {
      var b = document.createElement("button");
      b.className = "tab"; b.textContent = p.name;
      b.addEventListener("click", function () { el.querySelector("#vr-params").value = p.p; render(); });
      presetWrap.appendChild(b);
    });

    function render() {
      var s = read();
      el.querySelector("#vr-params-o").textContent = s.params.toFixed(1) + "B";
      el.querySelector("#vr-batch-o").textContent = s.batch;
      el.querySelector("#vr-seq-o").textContent = (s.seq >= 1024 ? (s.seq/1024) + "K" : s.seq);
      el.querySelector("#vr-rank-o").textContent = s.rank;
      el.querySelector("#vr-rank-row").style.display = s.mode === "lora" ? "" : "none";
      // KV cache irrelevant for training-full display but fine

      var r = compute(s);
      el.querySelector("#vr-total").textContent = fmt(r.total);
      var fit = HW.filter(function (h) { return h.g >= r.total / GB; })[0];
      el.querySelector("#vr-fits").textContent = fit ? "fits on " + fit.n : "needs a large multi-GPU cluster";

      var max = r.parts.reduce(function (a, b) { return Math.max(a, b[1]); }, 1);
      el.querySelector("#vr-bars").innerHTML = r.parts.map(function (pt) {
        return '<div><div style="display:flex;justify-content:space-between;font-family:var(--font-mono);font-size:.72rem;color:var(--text-2)">' +
               "<span>" + pt[0] + "</span><span>" + fmt(pt[1]) + " GB</span></div>" +
               '<div class="bar" style="margin-top:.2rem"><span style="width:' + (pt[1]/max*100) + '%"></span></div></div>';
      }).join("");
    }

    ids.forEach(function (id) {
      var e = el.querySelector("#vr-" + id);
      e.addEventListener("input", render); e.addEventListener("change", render);
    });
    // defaults
    el.querySelector("#vr-params").value = 8; el.querySelector("#vr-batch").value = 1;
    el.querySelector("#vr-seq").value = 4096; el.querySelector("#vr-rank").value = 16;
    el.querySelector("#vr-mode").value = "infer";
    render();
  }

  return { mount: mount };
})();
