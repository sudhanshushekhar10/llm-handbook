/* =============================================================================
   attention.js — Attention Heatmap (Plate 05)
   Illustrative (NOT from a real model): renders a causal self-attention matrix
   for a short sentence, with several "heads" that each follow a recognizable,
   hand-crafted pattern (previous-token, attention sink, local decay, content).
   Goal: build intuition for what an attention head computes. Clearly synthetic.
   Mount:  FGAttention.mount("#el")
   ============================================================================= */
window.FGAttention = (function () {
  var SENTENCES = [
    "The cat sat on the mat .",
    "She poured the tea and drank it .",
    "Models that scale tend to improve .",
  ];

  var HEADS = [
    { name: "Previous-token", desc: "Attends to the token immediately before — copies local order.",
      fn: function (i, j) { return j === i - 1 ? 1 : (j === i ? 0.15 : 0.02); } },
    { name: "Attention sink", desc: "Dumps spare attention on the first token — a real, observed behaviour.",
      fn: function (i, j) { return j === 0 ? 1 : (j === i ? 0.3 : 0.05); } },
    { name: "Local decay", desc: "Looks at recent tokens, fading with distance.",
      fn: function (i, j) { return Math.exp(-(i - j) * 0.6); } },
    { name: "Content match", desc: "Attends to earlier tokens that share letters (a crude 'meaning' proxy).",
      fn: function (i, j, toks) {
        var a = toks[i].toLowerCase(), b = toks[j].toLowerCase();
        var shared = 0; for (var k = 0; k < b.length; k++) if (a.indexOf(b[k]) !== -1) shared++;
        return 0.1 + shared / (b.length + 1) + (j === i ? 0.4 : 0);
      } },
  ];

  function softmaxRow(row) {
    var max = Math.max.apply(null, row);
    var exps = row.map(function (v) { return Math.exp((v - max) * 2.2); });
    var sum = exps.reduce(function (a, b) { return a + b; }, 0);
    return exps.map(function (v) { return v / sum; });
  }

  function buildMatrix(toks, head) {
    var n = toks.length, M = [];
    for (var i = 0; i < n; i++) {
      var row = [];
      for (var j = 0; j < n; j++) row.push(j <= i ? Math.max(0, head.fn(i, j, toks)) : -1e9); // causal mask
      M.push(softmaxRow(row));
    }
    return M;
  }

  function color(w) {
    // map 0..1 weight to cobalt accent with alpha
    return "rgba(47,91,208," + (0.06 + w * 0.94).toFixed(3) + ")";
  }

  function mount(sel) {
    var el = typeof sel === "string" ? document.querySelector(sel) : sel;
    if (!el) return;
    el.innerHTML =
      '<div class="widget">' +
        '<div class="widget__head"><span class="badge">Try it</span><h4>Attention Heatmap</h4>' +
          '<span style="margin-left:auto;font-family:var(--font-mono);font-size:.66rem;color:var(--text-3)">illustrative</span></div>' +
        '<div class="widget__body">' +
          '<div style="display:flex;gap:.6rem;flex-wrap:wrap;margin-bottom:.5rem">' +
            '<select id="at-sent">' + SENTENCES.map(function (s, i) { return '<option value="' + i + '">' + s + "</option>"; }).join("") + "</select>" +
          "</div>" +
          '<div style="display:flex;gap:.4rem;flex-wrap:wrap;margin-bottom:.9rem" id="at-heads"></div>' +
          '<div id="at-grid" style="overflow-x:auto"></div>' +
          '<div id="at-note" style="font-family:var(--font-ui);font-size:.82rem;color:var(--text-2);margin-top:.8rem;padding-left:.8rem;border-left:2px solid var(--accent)"></div>' +
          '<div style="font-family:var(--font-mono);font-size:.66rem;color:var(--text-3);margin-top:.7rem">Rows = query token (doing the looking) · Columns = key token (being looked at). Upper triangle is masked: a token can\'t see the future.</div>' +
        "</div>" +
      "</div>";

    var headWrap = el.querySelector("#at-heads");
    var active = 0;
    HEADS.forEach(function (h, i) {
      var b = document.createElement("button");
      b.className = "tab"; b.textContent = "Head " + (i + 1) + " · " + h.name;
      b.setAttribute("aria-selected", i === 0 ? "true" : "false");
      b.addEventListener("click", function () { active = i; render(); });
      headWrap.appendChild(b);
    });

    function render() {
      var toks = SENTENCES[parseInt(el.querySelector("#at-sent").value, 10)].split(" ");
      var head = HEADS[active];
      var M = buildMatrix(toks, head);
      Array.prototype.forEach.call(headWrap.children, function (b, i) {
        b.setAttribute("aria-selected", i === active ? "true" : "false");
      });
      el.querySelector("#at-note").innerHTML = "<b>" + head.name + ".</b> " + head.desc;

      var n = toks.length, cell = 34;
      var html = '<table style="border-collapse:collapse;font-family:var(--font-mono);font-size:.62rem">';
      // header row
      html += "<tr><td></td>" + toks.map(function (t) {
        return '<td style="padding:2px 3px;color:var(--text-3);text-align:center;max-width:42px;writing-mode:vertical-rl;transform:rotate(180deg);height:48px">' + t + "</td>";
      }).join("") + "</tr>";
      for (var i = 0; i < n; i++) {
        html += '<tr><td style="padding:2px 6px;color:var(--text-2);white-space:nowrap;text-align:right">' + toks[i] + "</td>";
        for (var j = 0; j < n; j++) {
          var w = M[i][j];
          if (j > i) html += '<td style="width:' + cell + 'px;height:' + cell + 'px;background:repeating-linear-gradient(45deg,transparent,transparent 4px,var(--line) 4px,var(--line) 5px)"></td>';
          else html += '<td title="q=' + toks[i] + '  k=' + toks[j] + '  w=' + w.toFixed(2) +
                       '" style="width:' + cell + 'px;height:' + cell + 'px;background:' + color(w) +
                       ';border:1px solid var(--paper-2);text-align:center;color:' + (w > 0.5 ? "#fff" : "var(--text-3)") + '">' +
                       (w >= 0.18 ? Math.round(w * 100) : "") + "</td>";
        }
        html += "</tr>";
      }
      html += "</table>";
      el.querySelector("#at-grid").innerHTML = html;
    }

    el.querySelector("#at-sent").addEventListener("change", render);
    render();
  }

  return { mount: mount };
})();
