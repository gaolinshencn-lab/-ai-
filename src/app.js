// 路由、进度、页面渲染
const store = {
  get(k, d) { try { const v = localStorage.getItem("qp-" + k); return v ? JSON.parse(v) : d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem("qp-" + k, JSON.stringify(v)); } catch {} },
};
let doneSet = new Set(store.get("done", []));
const inFrame = (() => { try { return window.self !== window.top; } catch { return true; } })();
const trackOf = (id) => TRACKS.find((t) => t.id === id);
const lvlTag = (n) => `<span class="lvl l${n}">${LEVELS[n]}</span>`;
const stoneEl = (id) => `<span class="stone ${doneSet.has(id) ? "done" : ""}"></span>`;

function ytId(url) {
  const m = String(url).match(/(?:youtu\.be\/|v=|shorts\/|embed\/|live\/)([A-Za-z0-9_-]{11})/);
  return m ? m[1] : null;
}

function renderSide(cur) {
  const side = $("#side");
  side.innerHTML = `<button class="btn small side-toggle" id="side-t">展开全部课程</button>` + TRACKS.map((t) => {
    const ls = LESSONS.filter((l) => l.track === t.id);
    const n = ls.filter((l) => doneSet.has(l.id)).length;
    return `<div class="track"><div class="track-h"><span>${t.name}</span><span>${n}/${ls.length}</span></div><ul>${ls.map((l) => `<li><a href="#l-${l.id}" class="${cur === l.id ? "on" : ""}">${stoneEl(l.id)}<span style="flex:1">${l.title}</span>${lvlTag(l.level)}</a></li>`).join("")}</ul></div>`;
  }).join("");
  $("#side-t").onclick = () => { side.classList.toggle("open"); $("#side-t").textContent = side.classList.contains("open") ? "收起课程列表" : "展开全部课程"; };
}

function renderTop(view) {
  $("#stones").innerHTML = LESSONS.map((l) => stoneEl(l.id)).join("");
  $("#pcount").textContent = `${doneSet.size} / ${LESSONS.length}`;
  document.querySelectorAll(".top-nav a").forEach((a) => a.classList.toggle("on", a.dataset.v === view));
}

function renderHome() {
  const next = LESSONS.find((l) => !doneSet.has(l.id)) || LESSONS[0];
  return `
<section class="hero">
  <div class="tag">从零到精通 · ${LESSONS.length} 课 · 每课都能动手</div>
  <h1 style="margin:6px 0 10px">会开机就能开始</h1>
  <p>为一个刚满 24 岁、只会开关机和打开软件的大学生设计。六条路线：电脑基础、网络名词、短视频、用 AI 学习、AI 编程，以及实战：在自己电脑上部署 KataGo。每课有讲解、动手练习、小测验和 YouTube 视频。学完一课，棋盘上落一颗子。</p>
  <div class="row" style="margin-top:14px"><a class="btn primary" href="#l-${next.id}" style="text-decoration:none">${doneSet.size ? "继续学习" : "从第一课开始"}：${next.title}</a><a class="btn" href="#glossary" style="text-decoration:none">名词速查</a></div>
</section>
<div class="ladder">
  <div class="rung"><span class="rank">级位 · 18k → 1k</span><b>基础</b><span class="muted small">知道是什么，能照着做。下载安装、IP 和端口、拍第一条视频、建 GitHub 仓库。</span></div>
  <div class="rung"><span class="rank">初段 · 1d → 3d</span><b>行家</b><span class="muted small">知道为什么，出问题能自己查。读懂 Claude Code、检查代码、剪辑和写钩子。</span></div>
  <div class="rung"><span class="rank">高段 · 4d+</span><b>精通</b><span class="muted small">能独立做出东西。部署服务器、本地跑 Kaggle、本地部署 KataGo、物理模型、自己的围棋 AI、1 万粉路线。</span></div>
</div>
<h2 style="font-size:22px;margin:28px 0 12px">${TRACKS.length} 条路线</h2>
<div class="track-cards">${TRACKS.map((t) => {
    const ls = LESSONS.filter((l) => l.track === t.id);
    return `<a class="tcard" href="#l-${ls[0].id}"><h3>${t.name}</h3><p>${t.desc}</p><div class="stones">${ls.map((l) => stoneEl(l.id)).join("")}</div></a>`;
  }).join("")}</div>
<div class="block"><div class="block-h"><span class="tag">建议节奏</span><h2>每天 1 小时，8 周</h2></div>
<ol class="plan">
  <li><b>第 1 周</b><span>电脑基础 1–4 课。目标：自己从官网装好 VS Code、Python、剪映。</span></li>
  <li><b>第 2 周</b><span>网络与名词 1–2 课 + 命令行。目标：看到“服务已启动 127.0.0.1:7860”不再慌。</span></li>
  <li><b>第 3 周</b><span>用 AI 学习 1–2 课 + 短视频定位。开始拍“小白学 AI 第 1 天”。</span></li>
  <li><b>第 4 周</b><span>GitHub、本地与云端、读懂 Claude Code。建你的第一个仓库。</span></li>
  <li><b>第 5 周</b><span>检查代码 + 物理模型。用 AI 写出抛体模拟并验证。</span></li>
  <li><b>第 6 周</b><span>本地跑 Kaggle Titanic，提交一次成绩。</span></li>
  <li><b>第 7 周</b><span>实战路线：在自己电脑上部署最新 KataGo 模型，接上 KaTrain 复盘；再用 Python 调用它分析自己的棋谱。</span></li>
  <li><b>第 8 周</b><span>VPN 原理、云服务器部署，把你的作品挂到网上。整理成一个系列视频。</span></li>
</ol></div>`;
}

function renderGlossary() {
  return `<div class="tag">名词速查</div><h1 class="lesson-h1" style="margin-top:6px">看不懂的词，来这里查</h1><p class="lead">${GLOSSARY.length} 个最常遇到的名词。也可以去“端口、服务已启动、加速”那一课，用术语翻译器整句翻译。</p>
<input class="input" id="gq" placeholder="搜索，比如：端口、仓库、加速" aria-label="搜索名词" style="max-width:420px"><div class="gl" id="gl"></div>`;
}
function bindGlossary() {
  const draw = () => {
    const q = $("#gq").value.trim().toLowerCase();
    const list = GLOSSARY.filter((g) => !q || (g.t + g.en + g.d + g.k.join(" ")).toLowerCase().includes(q));
    $("#gl").innerHTML = list.map((g) => `<div class="gl-item"><b>${esc(g.t)}</b><span class="en">${esc(g.en)}</span><p>${esc(g.d)}</p></div>`).join("") || `<p class="muted">没找到。试试问 AI：“用小白能懂的话解释 ${esc(q)}”。</p>`;
  };
  $("#gq").oninput = draw; draw();
}

function renderLesson(l) {
  const t = trackOf(l.track);
  const i = LESSONS.indexOf(l), prev = LESSONS[i - 1], next = LESSONS[i + 1];
  return `
<div class="crumb"><span>${t.name}</span><span>·</span>${lvlTag(l.level)}<span>·</span><span>第 ${i + 1} / ${LESSONS.length} 课</span></div>
<h1 class="lesson-h1">${l.title}</h1>
<p class="lead">${l.lead}</p>
<article class="prose">${l.body}</article>
${l.widget ? `<section class="block"><div class="block-h"><span class="tag">动手练</span><h2>${widgetName(l.widget)}</h2></div><div id="widget"></div></section>` : ""}
${l.extra ? `<article class="prose">${l.extra}</article>` : ""}
<section class="block"><div class="block-h"><span class="tag">视频讲解</span><h2>在 YouTube 上看</h2></div>
  <div class="vids">${l.videos.map((v) => `<a class="vid" href="https://www.youtube.com/results?search_query=${encodeURIComponent(v.q)}" target="_blank" rel="noopener"><span class="play"></span><span>${esc(v.t)}<small>搜索：${esc(v.q)}</small></span></a>`).join("")}</div>
  <p class="small muted" style="margin:12px 0 6px">找到一个讲得好的视频？把 YouTube 链接贴在这里，以后在这一课直接看。</p>
  <div class="row"><input class="input" id="yt-in" placeholder="https://www.youtube.com/watch?v=..." aria-label="YouTube 链接" style="flex:1;min-width:0"><button class="btn" id="yt-add">保存</button></div>
  <div class="saved-vids" id="yt-list"></div>
</section>
<section class="block"><div class="block-h"><span class="tag">小测验</span><h2>检查一下</h2></div><div id="quiz"></div></section>
<div class="done-bar">
  <div class="row">${prev ? `<a class="btn" style="text-decoration:none" href="#l-${prev.id}">← ${prev.title}</a>` : ""}</div>
  <button class="btn ${doneSet.has(l.id) ? "" : "primary"}" id="mark">${doneSet.has(l.id) ? "● 已学完（点击取消）" : "学完了，落一子"}</button>
  <div class="row">${next ? `<a class="btn" style="text-decoration:none" href="#l-${next.id}">${next.title} →</a>` : ""}</div>
</div>`;
}

function widgetName(w) {
  return { pathTree: "点文件夹，看路径怎么变", fakeSearch: "哪个才是官网？", keys: "快捷键练习区", terminal: "模拟终端", dns: "看一次网页访问的全过程", decoder: "术语翻译器", proxy: "直连 vs 代理", niche: "定位生成器", hook: "开头检查器", growth: "1 万粉计算器", prompt: "提示词生成器", projectile: "抛体运动模拟", git: "Git 四个区域", transcript: "点击每一行看解释", bug: "找出 bug", kataWizard: "你的电脑该装哪个版本", annot: "点击每一行看解释", faq: "报错 → 解决方法", go: "和规则型 AI 下一盘 9 路棋" }[w] || "练习";
}

function bindLesson(l) {
  if (l.widget) WIDGETS[l.widget]($("#widget"), l);
  // 测验
  const qz = $("#quiz");
  l.quiz.forEach((q, qi) => {
    const box = h(`<div class="q"><div class="q-t">${qi + 1}. ${esc(q.q)}</div><div class="opts"></div><div class="explain"></div></div>`);
    q.o.forEach((o, oi) => {
      const b = h(`<button class="opt">${esc(o)}</button>`);
      b.onclick = () => {
        box.querySelectorAll(".opt").forEach((x) => x.classList.remove("right", "wrong"));
        b.classList.add(oi === q.a ? "right" : "wrong");
        if (oi !== q.a) box.querySelectorAll(".opt")[q.a].classList.add("right");
        box.querySelector(".explain").innerHTML = `<span class="${oi === q.a ? "ok" : "no"}">${oi === q.a ? "✓ 对了。" : "✗ 不对。"}</span> ${esc(q.e)}`;
      };
      box.querySelector(".opts").appendChild(b);
    });
    qz.appendChild(box);
  });
  // 保存的视频
  const key = "yt-" + l.id;
  const drawVids = () => {
    const list = store.get(key, []);
    $("#yt-list").innerHTML = list.map((u, i) => {
      const id = ytId(u);
      const embed = id && !inFrame ? `<iframe class="embed" src="https://www.youtube-nocookie.com/embed/${id}" title="YouTube 视频" allowfullscreen loading="lazy"></iframe>` : "";
      return `<div>${embed}<div class="row small" style="margin-top:4px"><a href="${esc(u)}" target="_blank" rel="noopener">在 YouTube 打开</a><button class="btn small" data-del="${i}">删除</button></div></div>`;
    }).join("");
    $("#yt-list").querySelectorAll("[data-del]").forEach((b) => (b.onclick = () => { const a = store.get(key, []); a.splice(+b.dataset.del, 1); store.set(key, a); drawVids(); }));
  };
  $("#yt-add").onclick = () => {
    const u = $("#yt-in").value.trim();
    if (!ytId(u)) { $("#yt-in").value = ""; $("#yt-in").placeholder = "这不像 YouTube 视频链接，请粘贴 youtube.com/watch?v=... 或 youtu.be/..."; return; }
    const a = store.get(key, []); a.push(u); store.set(key, a); $("#yt-in").value = ""; drawVids();
  };
  drawVids();
  $("#mark").onclick = () => {
    doneSet.has(l.id) ? doneSet.delete(l.id) : doneSet.add(l.id);
    store.set("done", [...doneSet]);
    const on = doneSet.has(l.id);
    $("#mark").className = "btn" + (on ? "" : " primary");
    $("#mark").textContent = on ? "● 已学完（点击取消）" : "学完了，落一子";
    renderSide(l.id); renderTop("lesson");
  };
}

function route() {
  const hsh = location.hash.slice(1);
  const main = $("#main");
  const m = hsh.match(/^l-(\w+)$/);
  const l = m && LESSONS.find((x) => x.id === m[1]);
  if (l) { main.innerHTML = renderLesson(l); renderSide(l.id); renderTop("lesson"); bindLesson(l); document.title = "棋盘学堂"; }
  else if (hsh === "glossary") { main.innerHTML = renderGlossary(); renderSide(); renderTop("glossary"); bindGlossary(); }
  else { main.innerHTML = renderHome(); renderSide(); renderTop("home"); }
  window.scrollTo(0, 0);
}

window.addEventListener("hashchange", route);
route();
