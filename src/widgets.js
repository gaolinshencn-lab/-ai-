// 交互小组件。每个函数接收一个容器元素，在里面渲染。
const $ = (s, r = document) => r.querySelector(s);
const h = (html) => { const t = document.createElement("template"); t.innerHTML = html.trim(); return t.content.firstElementChild; };
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const cssVar = (n) => getComputedStyle(document.documentElement).getPropertyValue(n).trim();

const WIDGETS = {};

// ---------- 路径树 ----------
WIDGETS.pathTree = (el) => {
  const tree = { name: "C:", kids: [{ name: "Users", kids: [{ name: "xiaoming", kids: [
    { name: "Desktop", kids: [{ name: "作业.docx" }] },
    { name: "Documents", kids: [{ name: "my-project", kids: [{ name: "main.py" }, { name: "data.csv" }] }] },
    { name: "Downloads", kids: [{ name: "VSCodeSetup.exe" }, { name: "titanic.zip" }] },
  ] }] }, { name: "Program Files", kids: [{ name: "Microsoft VS Code", kids: [{ name: "Code.exe" }] }] }] };
  el.innerHTML = `<div class="tree"></div><div class="pathbar" id="pt-win">Windows: C:\\</div><div class="pathbar" id="pt-mac">Mac 上类似的位置: /</div>`;
  const render = (node, trail) => {
    const ul = document.createElement("ul");
    (node.kids || []).forEach((k) => {
      const li = document.createElement("li");
      const b = document.createElement("button");
      const isDir = !!k.kids;
      b.textContent = (isDir ? "▸ " : "· ") + k.name;
      const t = [...trail, k.name];
      b.onclick = () => {
        $("#pt-win", el).textContent = "Windows: " + t.join("\\") + (isDir ? "\\" : "");
        const mac = t.slice(1).join("/").replace("xiaoming", "xiaoming").replace("Program Files", "Applications");
        $("#pt-mac", el).textContent = "Mac 上类似的位置: /" + mac;
        if (isDir) { const open = li.querySelector("ul"); if (open) { open.remove(); b.textContent = "▸ " + k.name; } else { li.appendChild(render(k, t)); b.textContent = "▾ " + k.name; } }
      };
      li.appendChild(b); ul.appendChild(li);
    });
    return ul;
  };
  const root = render(tree, ["C:"]);
  root.style.borderLeft = "0"; root.style.paddingLeft = "0";
  $(".tree", el).appendChild(root);
  // 默认展开到 Downloads
  const clickByText = (txt) => [...el.querySelectorAll(".tree button")].find((b) => b.textContent.includes(txt))?.click();
  ["Users", "xiaoming", "Downloads"].forEach(clickByText);
};

// ---------- 假搜索结果 ----------
WIDGETS.fakeSearch = (el) => {
  const items = [
    { t: "VSCode中文版下载_官方正版免费高速下载", u: "www.xx-soft-download.cn › vscode", ad: true, ok: false, e: "广告 + 下载站。常见套路：给你一个“高速下载器”，顺带装一堆垃圾软件。" },
    { t: "Visual Studio Code - Code Editing. Redefined", u: "code.visualstudio.com", ok: true, e: "正确！这是微软官方域名。" },
    { t: "VS Code 绿色破解版 免安装 v2026", u: "pan.xx-share.com › s › 8f3a", ok: false, e: "网盘 + “破解版”。VS Code 本来就免费，破解版毫无必要，还可能有病毒。" },
    { t: "vscode 下载 - 某某软件园", u: "www.mm-ruanjianyuan.com › soft › 1234", ok: false, e: "第三方软件园。不一定有毒，但版本旧、常带捆绑。" },
  ];
  el.innerHTML = `<p class="small muted">你在搜索引擎里搜“VS Code 下载”，出现了下面四个结果。点你会点的那个：</p><div class="results"></div><div class="explain-box"></div>`;
  const box = $(".results", el);
  items.forEach((it) => {
    const b = h(`<button class="result">${it.ad ? '<span class="ad no">广告</span>' : ""}<b>${esc(it.t)}</b><div class="u">${esc(it.u)}</div></button>`);
    b.onclick = () => { b.classList.add(it.ok ? "right" : "wrong"); $(".explain-box", el).innerHTML = `<span class="${it.ok ? "ok" : "no"}">${it.ok ? "✓" : "✗"}</span> ${esc(it.e)}`; };
    box.appendChild(b);
  });
};

// ---------- 快捷键练习 ----------
WIDGETS.keys = (el) => {
  const isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
  const mod = isMac ? "Cmd" : "Ctrl";
  const tasks = [
    { k: "a", n: "全选" }, { k: "c", n: "复制" }, { k: "v", n: "粘贴" }, { k: "z", n: "撤销" }, { k: "s", n: "保存" }, { k: "f", n: "查找" },
  ];
  let i = 0;
  el.innerHTML = `<div class="keyzone" tabindex="0" id="kz"><div class="small muted">点这里，然后按：</div><div style="font-size:22px;margin-top:6px" id="kz-t"></div></div><div class="explain-box" id="kz-r"></div>`;
  const show = () => { $("#kz-t", el).innerHTML = i < tasks.length ? `${tasks[i].n}：<kbd>${mod}</kbd> + <kbd>${tasks[i].k.toUpperCase()}</kbd>` : "全部完成！"; };
  show();
  $("#kz", el).addEventListener("keydown", (e) => {
    if (i >= tasks.length) return;
    const modOn = isMac ? e.metaKey : e.ctrlKey;
    if (modOn && e.key.toLowerCase() === tasks[i].k) {
      e.preventDefault();
      $("#kz-r", el).innerHTML = `<span class="ok">✓ ${tasks[i].n} 正确</span>`;
      i++; show();
    } else if (!["Control", "Meta", "Shift", "Alt"].includes(e.key)) {
      $("#kz-r", el).innerHTML = `<span class="no">你按的是 ${e.ctrlKey ? "Ctrl+" : ""}${e.metaKey ? "Cmd+" : ""}${esc(e.key)}，再试一次</span>`;
    }
  });
};

// ---------- 模拟终端 ----------
WIDGETS.terminal = (el) => {
  const fs = { "/": ["home"], "/home": ["me"], "/home/me": ["Desktop", "Downloads"], "/home/me/Desktop": [], "/home/me/Downloads": [] };
  const files = { "/home/me/Downloads/readme.txt": "欢迎！这是一个文本文件。" };
  fs["/home/me/Downloads"].push("readme.txt");
  let cwd = "/home/me", gitRepo = new Set(), staged = new Set(), commits = [];
  const missions = [
    { t: "输入 pwd 看看你在哪", ok: (c) => c === "pwd" },
    { t: "用 ls 看这里有什么", ok: (c) => c.startsWith("ls") },
    { t: "进入 Downloads 并用 cat 读 readme.txt", ok: (c) => c.startsWith("cat") && cwd.endsWith("Downloads") },
    { t: "回到上一级，新建文件夹 myproject 并进入", ok: () => cwd === "/home/me/myproject" },
    { t: "在里面 git init，建一个文件（touch main.py），git add 再 git commit -m \"第一次提交\"", ok: () => commits.length > 0 },
  ];
  const done = new Array(missions.length).fill(false);
  el.innerHTML = `<div class="grid2"><div><div class="term" id="tm"></div></div><div><b>任务</b><div class="missions" id="ms"></div><p class="small muted" style="margin-top:10px">输入 help 查看所有命令。</p></div></div>`;
  const tm = $("#tm", el);
  const out = (s, cls = "") => { tm.insertAdjacentHTML("beforeend", `<div class="${cls}">${s}</div>`); };
  const prompt = () => {
    const line = h(`<div class="term-in"><span class="p">${esc(cwd.replace("/home/me", "~"))} $</span><input aria-label="终端输入" autocomplete="off" spellcheck="false"></div>`);
    tm.appendChild(line);
    const inp = line.querySelector("input");
    inp.addEventListener("keydown", (e) => {
      if (e.key !== "Enter") return;
      const cmd = inp.value.trim();
      line.replaceWith(h(`<div><span class="p">${esc(cwd.replace("/home/me", "~"))} $</span> ${esc(cmd)}</div>`));
      run(cmd); prompt(); tm.scrollTop = tm.scrollHeight;
      tm.querySelector(".term-in input").focus();
    });
    return inp;
  };
  const resolve = (p) => {
    if (!p || p === "~") return "/home/me";
    let parts = p.startsWith("/") ? [] : cwd.split("/").filter(Boolean);
    p.replace(/^~\/?/, "home/me/").split("/").filter(Boolean).forEach((s) => { if (s === "..") parts.pop(); else if (s !== ".") parts.push(s); });
    return "/" + parts.join("/");
  };
  const inRepo = () => [...gitRepo].some((r) => cwd === r || cwd.startsWith(r + "/"));
  const run = (cmd) => {
    const [c, ...args] = cmd.split(/\s+/);
    const a = args.join(" ");
    switch (c) {
      case "": break;
      case "help": out("可用命令：pwd ls cd mkdir touch cat echo clear git(init/status/add/commit/log) python whoami", "d"); break;
      case "pwd": out(cwd); break;
      case "whoami": out("me"); break;
      case "ls": case "dir": out((fs[cwd] || []).map((n) => fs[cwd + "/" + n] || fs[(cwd === "/" ? "" : cwd) + "/" + n] ? `<span class="d">${esc(n)}/</span>` : esc(n)).join("  ") || '<span class="muted">（空的）</span>'); break;
      case "cd": { const t = resolve(args[0]); if (fs[t]) cwd = t; else out(`cd: 没有这个文件夹: ${esc(args[0] || "")}`, "e"); break; }
      case "mkdir": if (!args[0]) { out("mkdir: 要写文件夹名字", "e"); break; } { const t = resolve(args[0]); fs[t] = []; fs[cwd].push(args[0]); } break;
      case "touch": if (!args[0]) { out("touch: 要写文件名", "e"); break; } { const t = resolve(args[0]); if (!(t in files)) { files[t] = ""; fs[cwd].push(args[0]); } } break;
      case "cat": { const t = resolve(args[0]); if (t in files) out(esc(files[t]) || '<span class="muted">（空文件）</span>'); else out(`cat: 找不到文件: ${esc(args[0] || "")}`, "e"); break; }
      case "echo": out(esc(a.replace(/^"|"$/g, ""))); break;
      case "clear": tm.innerHTML = ""; break;
      case "python": case "python3": out(args[0] === "--version" ? "Python 3.12.4" : "（模拟终端不能真的运行 Python。真实终端里 python 文件名.py 就能运行。）", "d"); break;
      case "git": {
        const sub = args[0];
        if (sub === "init") { gitRepo.add(cwd); out(`Initialized empty Git repository in ${esc(cwd)}/.git/`); }
        else if (!inRepo()) out("fatal: not a git repository（这里还不是仓库，先 git init）", "e");
        else if (sub === "status") { const un = (fs[cwd] || []).filter((n) => files[cwd + "/" + n] !== undefined && !staged.has(n)); out(`On branch main<br>${staged.size ? "要提交的更改：<br>" + [...staged].map((n) => `<span class="p">  new file: ${esc(n)}</span>`).join("<br>") + "<br>" : ""}${un.length ? "未跟踪的文件：<br>" + un.map((n) => `<span class="e">  ${esc(n)}</span>`).join("<br>") : ""}${!staged.size && !un.length ? "nothing to commit, working tree clean" : ""}`); }
        else if (sub === "add") { const list = args[1] === "." ? (fs[cwd] || []).filter((n) => files[cwd + "/" + n] !== undefined) : args.slice(1); if (!list.length) out("Nothing specified, nothing added.（写 git add 文件名 或 git add .）", "e"); list.forEach((n) => staged.add(n)); }
        else if (sub === "commit") { if (!staged.size) out("nothing to commit（先 git add）", "e"); else { const m = (a.match(/-m\s+"?([^"]*)"?/) || [])[1] || "提交"; const id = Math.random().toString(16).slice(2, 9); commits.unshift({ id, m }); out(`[main ${id}] ${esc(m)}<br> ${staged.size} file changed`); staged.clear(); } }
        else if (sub === "log") out(commits.map((x) => `<span class="d">commit ${x.id}</span><br>    ${esc(x.m)}`).join("<br>") || "还没有提交");
        else out(`git: '${esc(sub || "")}' 在这个模拟终端里不支持`, "e");
        break;
      }
      default: out(`${esc(c)}: command not found（找不到命令。输入 help 查看）`, "e");
    }
    missions.forEach((m, i) => { if (!done[i] && missions.slice(0, i).every((_, j) => done[j]) && m.ok(cmd)) done[i] = true; });
    drawMissions();
  };
  const drawMissions = () => { $("#ms", el).innerHTML = missions.map((m, i) => `<div class="m ${done[i] ? "done" : ""}">${done[i] ? "●" : "○"} ${esc(m.t)}</div>`).join(""); };
  out("模拟终端 · 输入 help 开始", "d");
  drawMissions(); prompt();
  tm.addEventListener("click", () => tm.querySelector(".term-in input")?.focus());
};

// ---------- DNS 动画 ----------
WIDGETS.dns = (el) => {
  el.innerHTML = `<div class="row"><input class="input" id="dn" value="github.com" style="max-width:280px" aria-label="域名"><button class="btn primary" id="dg">访问</button></div><div class="steps" id="ds"></div>`;
  const fakeIP = (d) => { let x = 0; for (const c of d) x = (x * 31 + c.charCodeAt(0)) >>> 0; return `${(x % 200) + 20}.${(x >> 8) % 256}.${(x >> 16) % 256}.${(x >> 24) % 250 + 3}`; };
  let timers = [];
  $("#dg", el).onclick = () => {
    timers.forEach(clearTimeout); timers = [];
    const d = $("#dn", el).value.trim().replace(/^https?:\/\//, "").split("/")[0] || "github.com";
    const ip = d === "localhost" ? "127.0.0.1" : fakeIP(d);
    const steps = [
      ["浏览器", `你输入了 ${d}，浏览器先看自己记不记得它的 IP（缓存）。不记得。`],
      ["DNS 查询", `问 DNS 服务器：“${d} 的 IP 是多少？”`],
      ["DNS 回答", `“${d} → ${ip}”（这里的 IP 是演示用的假数字）`],
      ["连接", `浏览器连接 ${ip} 的 443 端口，建立 HTTPS 加密通道。`],
      ["请求", `发送请求：GET / （“请把首页给我”）`],
      ["服务器响应", `服务器返回 HTML、图片、脚本。`],
      ["显示", `浏览器把它们画成你看到的网页。整个过程通常不到 1 秒。`],
    ];
    $("#ds", el).innerHTML = steps.map((s, i) => `<div class="step"><b>${i + 1}. ${s[0]}</b>${esc(s[1])}</div>`).join("");
    const nodes = el.querySelectorAll(".step");
    nodes.forEach((n, i) => timers.push(setTimeout(() => n.classList.add("lit"), 350 + i * 650)));
  };
  $("#dg", el).click();
};

// ---------- 术语翻译器 ----------
WIDGETS.decoder = (el) => {
  const sample = "服务已启动，Running on http://127.0.0.1:7860 ，如需局域网访问请监听 0.0.0.0。下载慢可以开启镜像加速或配置代理，部署到云服务器需开放端口。";
  el.innerHTML = `<label class="small muted" for="dc-in">粘贴一句你看不懂的话（报错、教程、AI 回答都可以）：</label><textarea class="input" id="dc-in">${esc(sample)}</textarea><div class="row" style="margin-top:8px"><button class="btn primary" id="dc-go">翻译</button></div><div class="decoded" id="dc-out"></div><div class="explain-box" id="dc-ex"><span class="muted">点击高亮的词看解释。</span></div>`;
  const keys = GLOSSARY.flatMap((g) => g.k.map((k) => ({ k, g }))).sort((a, b) => b.k.length - a.k.length);
  const go = () => {
    const text = $("#dc-in", el).value;
    let html = "", i = 0;
    while (i < text.length) {
      const m = keys.find(({ k }) => text.startsWith(k, i) && (!/^[A-Za-z]/.test(k) || !/[A-Za-z]/.test(text[i - 1] || "") && !/[A-Za-z]/.test(text[i + k.length] || "")));
      if (m) { html += `<span class="hl" data-t="${esc(m.g.t)}">${esc(m.k)}</span>`; i += m.k.length; }
      else { html += esc(text[i]); i++; }
    }
    $("#dc-out", el).innerHTML = html;
  };
  $("#dc-out", el).addEventListener("click", (e) => {
    const s = e.target.closest(".hl"); if (!s) return;
    const g = GLOSSARY.find((x) => x.t === s.dataset.t);
    $("#dc-ex", el).innerHTML = `<b>${esc(g.t)}</b> <span class="muted">${esc(g.en)}</span>：${esc(g.d)}`;
  });
  $("#dc-go", el).onclick = go; go();
};

// ---------- 代理示意图 ----------
WIDGETS.proxy = (el) => {
  el.innerHTML = `<div class="row"><button class="btn primary" id="px-d">直连</button><button class="btn" id="px-p">经过代理 / VPN</button></div><svg class="proxy-svg" viewBox="0 0 640 170" id="px-svg" role="img" aria-label="网络连接示意图"></svg><div class="explain-box" id="px-ex"></div>`;
  const draw = (proxy) => {
    const ink = cssVar("--ink"), line = cssVar("--muted"), acc = cssVar("--accent"), wood = cssVar("--wood"), card = cssVar("--card");
    const box = (x, label, sub, c) => `<rect x="${x}" y="45" width="140" height="64" rx="8" fill="${card}" stroke="${c}" stroke-width="2"/><text x="${x + 70}" y="74" text-anchor="middle" fill="${ink}" font-size="15" font-weight="700">${label}</text><text x="${x + 70}" y="95" text-anchor="middle" fill="${line}" font-size="12">${sub}</text>`;
    const arrow = (x1, x2, c, dash, lbl) => `<line x1="${x1}" y1="77" x2="${x2}" y2="77" stroke="${c}" stroke-width="3" ${dash ? 'stroke-dasharray="6 5"' : ""}/><polygon points="${x2},77 ${x2 - 9},71 ${x2 - 9},83" fill="${c}"/><text x="${(x1 + x2) / 2}" y="138" text-anchor="middle" fill="${line}" font-size="12">${lbl}</text>`;
    $("#px-svg", el).innerHTML = proxy
      ? box(10, "你的电脑", "IP 1.2.3.4", acc) + arrow(152, 248, wood, true, "加密隧道") + box(250, "代理服务器", "IP 9.9.9.9", wood) + arrow(392, 488, acc, false, "普通连接") + box(490, "网站", "看到 9.9.9.9", ink)
      : box(10, "你的电脑", "IP 1.2.3.4", acc) + arrow(152, 488, acc, false, "直接连接") + box(490, "网站", "看到 1.2.3.4", ink);
    $("#px-ex", el).innerHTML = proxy
      ? "网站看到的是代理服务器的 IP。学校/运营商只看到你连着代理服务器，看不到具体内容。但<b>代理服务器本身</b>能看到你访问了哪里。"
      : "网站看到你的真实 IP。你所在的网络（学校、运营商）能看到你在访问哪个网站（HTTPS 下看不到具体内容）。";
    $("#px-d", el).className = "btn" + (proxy ? "" : " primary");
    $("#px-p", el).className = "btn" + (proxy ? " primary" : "");
  };
  $("#px-d", el).onclick = () => draw(false);
  $("#px-p", el).onclick = () => draw(true);
  draw(false);
};

// ---------- 定位生成器 ----------
WIDGETS.niche = (el) => {
  const ids = ["零基础大学生", "24 岁转行学 AI 的人", "围棋爱好者", "物理专业学生"];
  const crowds = ["同样不懂电脑的人", "想用 AI 提效的学生", "想入门编程的文科生", "爱下棋的上班族"];
  const vals = ["记录从零学 AI 编程的每一天", "3 分钟讲懂一个电脑名词", "用 AI 做出一个小工具/小游戏", "AI 围棋复盘和有趣棋局"];
  const sel = (id, arr) => `<select class="input" id="${id}">${arr.map((x) => `<option>${esc(x)}</option>`).join("")}</select>`;
  el.innerHTML = `<div class="grid2"><label>我是<br>${sel("n1", ids)}</label><label>帮<br>${sel("n2", crowds)}</label></div><label style="display:block;margin-top:10px">提供<br>${sel("n3", vals)}</label><div class="decoded" id="nout" style="font-size:16px"></div><div class="small muted" id="ntitle"></div>`;
  const upd = () => {
    const a = $("#n1", el).value, b = $("#n2", el).value, c = $("#n3", el).value;
    $("#nout", el).innerHTML = `我是<b>${esc(a)}</b>，专门帮<b>${esc(b)}</b>，${esc(c)}。`;
    $("#ntitle", el).textContent = `第一期标题示例：「${a}的第 1 天：${c.replace(/^记录|^用 /, "")}」`;
  };
  el.querySelectorAll("select").forEach((s) => (s.onchange = upd));
  upd();
};

// ---------- 钩子检查器 ----------
WIDGETS.hook = (el) => {
  el.innerHTML = `<label class="small muted" for="hk">你的视频第一句话：</label><input class="input" id="hk" value="大家好，今天给大家分享一下怎么下载软件"><div id="hk-r" style="margin-top:10px"></div>`;
  const rules = [
    { n: "不以“大家好/今天”开头", f: (s) => !/^(大家好|hello|哈喽|今天)/i.test(s) },
    { n: "25 个字以内", f: (s) => s.length > 0 && s.length <= 25 },
    { n: "有数字（具体）", f: (s) => /[0-9一二三四五六七八九十百千万]/.test(s) },
    { n: "有“你”（对观众说话）", f: (s) => /你/.test(s) },
    { n: "有冲突/悬念词（别、千万、居然、为什么、竟然、？）", f: (s) => /别|千万|居然|竟然|为什么|\?|？|没想到|错/.test(s) },
  ];
  const upd = () => {
    const s = $("#hk", el).value.trim();
    const res = rules.map((r) => ({ ...r, ok: r.f(s) }));
    const score = res.filter((r) => r.ok).length;
    $("#hk-r", el).innerHTML = res.map((r) => `<div class="${r.ok ? "ok" : "no"}">${r.ok ? "✓" : "✗"} ${r.n}</div>`).join("") + `<div style="margin-top:6px"><b>${score} / 5</b> ${score >= 4 ? "不错，可以拍了。" : score >= 2 ? "再改改。" : "观众大概率划走。试试：“90% 的人下载软件都中过招，你呢？”"}</div>`;
  };
  $("#hk", el).oninput = upd; upd();
};

// ---------- 涨粉计算器 ----------
WIDGETS.growth = (el) => {
  const sl = (id, label, min, max, step, val, unit) => `<div class="slider"><label for="${id}">${label}</label><input type="range" id="${id}" min="${min}" max="${max}" step="${step}" value="${val}"><output id="${id}-o"></output></div>`;
  el.innerHTML = sl("g1", "每周发几条", 1, 14, 1, 3) + sl("g2", "起始平均播放", 100, 5000, 100, 500) + sl("g3", "转粉率 %", 0.2, 5, 0.1, 1) + sl("g4", "每周进步 %", 0, 10, 1, 4) +
    `<div class="tbl"><table><thead><tr><th>里程碑</th><th>大约第几周</th><th>那时平均播放</th></tr></thead><tbody id="g-t"></tbody></table></div><p class="small muted">“每周进步”代表你通过复盘让平均播放量每周增长的比例。粉丝多了以后推荐也会变多，这里没算，所以结果偏保守。</p>`;
  const upd = () => {
    const per = +$("#g1", el).value, v0 = +$("#g2", el).value, r = +$("#g3", el).value / 100, g = +$("#g4", el).value / 100;
    $("#g1-o", el).textContent = per; $("#g2-o", el).textContent = v0; $("#g3-o", el).textContent = (r * 100).toFixed(1); $("#g4-o", el).textContent = Math.round(g * 100);
    let fans = 0, v = v0, w = 0; const goals = [100, 1000, 5000, 10000]; const hit = {};
    while (w < 520 && fans < 10000) { w++; fans += per * v * r; goals.forEach((x) => { if (!hit[x] && fans >= x) hit[x] = { w, v: Math.round(v) }; }); v *= 1 + g; }
    $("#g-t", el).innerHTML = goals.map((x) => `<tr><td>${x.toLocaleString()} 粉</td><td>${hit[x] ? `第 ${hit[x].w} 周（约 ${(hit[x].w / 4.3).toFixed(1)} 个月）` : "10 年内达不到，调高某个数字试试"}</td><td>${hit[x] ? hit[x].v.toLocaleString() : "—"}</td></tr>`).join("");
  };
  el.querySelectorAll("input").forEach((i) => (i.oninput = upd)); upd();
};

// ---------- 提示词生成器 ----------
WIDGETS.prompt = (el) => {
  const f = [["p1", "我是谁", "电脑零基础的 24 岁大学生"], ["p2", "背景", "我用 Windows 11 笔记本，已经装好了 VS Code"], ["p3", "任务", "教我在本地运行 Kaggle 的 Titanic 项目"], ["p4", "要求", "每一步告诉我点哪里、输入什么，遇到专业名词先解释"], ["p5", "格式", "先列出总步骤，然后一次只讲一步，等我说“好了”再继续"]];
  el.innerHTML = `<div style="display:grid;gap:8px">${f.map(([id, l, v]) => `<label class="small">${l}<input class="input" id="${id}" value="${esc(v)}"></label>`).join("")}</div><div class="copy-wrap" style="margin-top:12px"><pre id="pp"></pre><button class="copy-btn" id="pc">复制</button></div>`;
  const upd = () => { const v = f.map(([id]) => $("#" + id, el).value.trim()); $("#pp", el).textContent = `我是${v[0]}。${v[1]}。\n\n请${v[2]}。\n\n要求：${v[3]}。\n格式：${v[4]}。`; };
  el.querySelectorAll("input").forEach((i) => (i.oninput = upd)); upd();
  $("#pc", el).onclick = (e) => copyText($("#pp", el), e.target);
};

function copyText(pre, btn) {
  const txt = pre.textContent;
  const done = () => { btn.textContent = "已复制"; setTimeout(() => (btn.textContent = "复制"), 1500); };
  const fallback = () => { const r = document.createRange(); r.selectNodeContents(pre); const s = getSelection(); s.removeAllRanges(); s.addRange(r); btn.textContent = "已选中，按 Ctrl/Cmd+C"; };
  try { navigator.clipboard.writeText(txt).then(done, fallback); } catch { fallback(); }
}

// ---------- 抛体模拟 ----------
WIDGETS.projectile = (el) => {
  const sl = (id, label, min, max, step, val) => `<div class="slider"><label for="${id}">${label}</label><input type="range" id="${id}" min="${min}" max="${max}" step="${step}" value="${val}"><output id="${id}-o"></output></div>`;
  el.innerHTML = `<canvas class="sim-canvas" id="pj" width="760" height="320"></canvas><div style="display:grid;gap:4px;margin-top:10px">${sl("pa", "角度 °", 5, 85, 1, 45)}${sl("pv", "初速度 m/s", 5, 50, 1, 30)}${sl("pk", "空气阻力 k", 0, 0.3, 0.01, 0.05)}</div><div class="row" style="margin-top:6px"><label class="small"><input type="radio" name="pg" value="9.8" checked> 地球 g=9.8</label><label class="small"><input type="radio" name="pg" value="1.62"> 月球 g=1.62</label><button class="btn small" id="pbest">找最远角度</button></div><div class="stat" id="pst"></div>`;
  const cv = $("#pj", el), ctx = cv.getContext("2d");
  const sim = (deg, v, k, g) => {
    const dt = 0.005; let x = 0, y = 0, vx = v * Math.cos(deg * Math.PI / 180), vy = v * Math.sin(deg * Math.PI / 180), t = 0, ymax = 0; const pts = [[0, 0]];
    while (y >= 0 && t < 200) { x += vx * dt; y += vy * dt; vx -= k * vx * dt; vy -= (g + k * vy) * dt; t += dt; ymax = Math.max(ymax, y); if (pts.length < 4000) pts.push([x, Math.max(y, 0)]); }
    return { pts, range: x, t, ymax };
  };
  const draw = () => {
    const a = +$("#pa", el).value, v = +$("#pv", el).value, k = +$("#pk", el).value, g = +el.querySelector("input[name=pg]:checked").value;
    $("#pa-o", el).textContent = a; $("#pv-o", el).textContent = v; $("#pk-o", el).textContent = k.toFixed(2);
    const withDrag = sim(a, v, k, g), noDrag = sim(a, v, 0, g);
    const W = cv.width, H = cv.height, pad = 34;
    const maxX = Math.max(noDrag.range, 10) * 1.05, maxY = Math.max(noDrag.ymax, 5) * 1.15;
    const s = Math.min((W - pad * 2) / maxX, (H - pad * 2) / maxY);
    const X = (x) => pad + x * s, Y = (y) => H - pad - y * s;
    ctx.clearRect(0, 0, W, H);
    ctx.strokeStyle = cssVar("--line"); ctx.lineWidth = 1; ctx.fillStyle = cssVar("--muted"); ctx.font = "12px sans-serif";
    const stepM = Math.pow(10, Math.floor(Math.log10(maxX / 5))) * (maxX / 5 / Math.pow(10, Math.floor(Math.log10(maxX / 5))) > 5 ? 5 : maxX / 5 / Math.pow(10, Math.floor(Math.log10(maxX / 5))) > 2 ? 2 : 1);
    for (let m = 0; m <= maxX; m += stepM) { ctx.beginPath(); ctx.moveTo(X(m), Y(0)); ctx.lineTo(X(m), pad / 2); ctx.stroke(); ctx.fillText(Math.round(m) + "m", X(m) - 8, H - 12); }
    ctx.strokeStyle = cssVar("--ink"); ctx.beginPath(); ctx.moveTo(pad, Y(0)); ctx.lineTo(W - 8, Y(0)); ctx.stroke();
    const line = (pts, color, dash) => { ctx.strokeStyle = color; ctx.lineWidth = 2.5; ctx.setLineDash(dash); ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(X(x), Y(y)) : ctx.moveTo(X(x), Y(y)))); ctx.stroke(); ctx.setLineDash([]); };
    line(noDrag.pts, cssVar("--muted"), [5, 5]);
    line(withDrag.pts, cssVar("--accent"), []);
    const last = withDrag.pts[withDrag.pts.length - 1]; ctx.fillStyle = cssVar("--wood"); ctx.beginPath(); ctx.arc(X(last[0]), Y(0), 5, 0, 7); ctx.fill();
    const theory = v * v * Math.sin(2 * a * Math.PI / 180) / g;
    $("#pst", el).innerHTML = `<span>有阻力射程 <b>${withDrag.range.toFixed(1)} m</b></span><span>无阻力射程（虚线）<b>${noDrag.range.toFixed(1)} m</b></span><span>课本公式 v²sin2θ/g = <b>${theory.toFixed(1)} m</b></span><span>飞行时间 <b>${withDrag.t.toFixed(2)} s</b></span>`;
  };
  el.querySelectorAll("input").forEach((i) => (i.oninput = draw));
  $("#pbest", el).onclick = () => {
    const v = +$("#pv", el).value, k = +$("#pk", el).value, g = +el.querySelector("input[name=pg]:checked").value;
    let best = 5, br = 0; for (let a = 5; a <= 85; a++) { const r = sim(a, v, k, g).range; if (r > br) { br = r; best = a; } }
    $("#pa", el).value = best; draw();
  };
  draw();
};

// ---------- Git 四区域 ----------
WIDGETS.git = (el) => {
  const st = { work: [], stage: [], local: [], remote: [] }; let n = 0;
  el.innerHTML = `<div class="row"><button class="btn" id="g-edit">✎ 修改一个文件</button><button class="btn" id="g-add">git add .</button><button class="btn" id="g-commit">git commit</button><button class="btn" id="g-push">git push</button><button class="btn small" id="g-reset">重来</button></div>
  <div class="cols4"><div class="col"><h4>工作区</h4><div id="c-work"></div></div><div class="col"><h4>暂存区</h4><div id="c-stage"></div></div><div class="col"><h4>本地仓库</h4><div id="c-local"></div></div><div class="col"><h4>GitHub</h4><div id="c-remote"></div></div></div><div class="log" id="g-log">先点“修改一个文件”。</div>`;
  const names = ["index.html", "go.py", "README.md", "style.css", "data.csv"];
  const draw = (msg) => {
    $("#c-work", el).innerHTML = st.work.map((f) => `<span class="chip">✎ ${f}</span>`).join("");
    $("#c-stage", el).innerHTML = st.stage.map((f) => `<span class="chip">+ ${f}</span>`).join("");
    $("#c-local", el).innerHTML = st.local.map((c) => `<span class="chip">● ${c}</span>`).join("");
    $("#c-remote", el).innerHTML = st.remote.map((c) => `<span class="chip">● ${c}</span>`).join("");
    if (msg) $("#g-log", el).innerHTML = msg;
  };
  $("#g-edit", el).onclick = () => { const f = names[n++ % names.length]; if (!st.work.includes(f)) st.work.push(f); draw(`你改了 ${f}。它现在在“工作区”，还没有被存档。`); };
  $("#g-add", el).onclick = () => { if (!st.work.length) return draw("<span class='no'>工作区没有改动，没什么可 add 的。</span>"); st.stage.push(...st.work.filter((f) => !st.stage.includes(f))); st.work = []; draw("$ git add .  → 把改动放进“暂存区”，相当于选好了这次要存档的东西。"); };
  $("#g-commit", el).onclick = () => { if (!st.stage.length) return draw("<span class='no'>暂存区是空的。先 git add。</span>"); const id = Math.random().toString(16).slice(2, 9); st.local.unshift(`${id} 更新 ${st.stage.join(", ")}`); st.stage = []; draw(`$ git commit -m "..."  → 本地存档完成（${id}）。但 GitHub 上还没有！`); };
  $("#g-push", el).onclick = () => { const ahead = st.local.filter((c) => !st.remote.includes(c)); if (!ahead.length) return draw("Everything up-to-date（没有新存档需要上传）"); st.remote.unshift(...ahead); draw(`$ git push  → 上传了 ${ahead.length} 个存档到 GitHub。现在云端有备份了。`); };
  $("#g-reset", el).onclick = () => { st.work = []; st.stage = []; st.local = []; st.remote = []; draw("已清空，重新开始。"); };
  draw();
};

// ---------- Claude Code 输出解读 ----------
WIDGETS.transcript = (el) => {
  const lines = [
    ["", "> 帮我给围棋程序加一个“悔棋”功能", "这是你发给 Claude Code 的请求。"],
    ["", "● Read(go.py)", "它在读 go.py 文件，了解现有代码。只读，不改东西。"],
    ["", "  ⎿ Read 182 lines", "读完了，共 182 行。"],
    ["", "● Grep(\"def play\")", "在代码里搜索 def play，找到“落子”函数在哪里。"],
    ["", "● Edit(go.py)", "它要修改 go.py。下面红绿行就是具体改动。"],
    ["", "  @@ -40,6 +40,13 @@ class Board:", "@@ 这一行是位置信息：原文件第 40 行附近，改动后变成 13 行。看不懂可以跳过。"],
    ["add", "+     self.history = []", "绿色 + ：新增一行，用一个列表记住每一步之前的棋盘。"],
    ["add", "+     def undo(self):", "新增“悔棋”函数。"],
    ["add", "+         if self.history:", "如果有历史记录才悔棋，避免空列表出错（这就是边界检查）。"],
    ["add", "+             self.grid = self.history.pop()", "把棋盘恢复到上一步。pop() 是取出列表最后一个。"],
    ["del", "-     # TODO: undo", "红色 − ：删掉了旧的待办注释。"],
    ["", "● Bash(python -m pytest tests/ -q)", "它在终端运行测试，检查有没有改坏东西。Bash(...) 括号里就是命令。"],
    ["", "  ⎿ 12 passed in 0.41s", "12 个测试全部通过。看到 failed 就要让它修。"],
    ["", "● Bash(git add go.py && git commit -m \"Add undo\")", "存档：把 go.py 加入暂存区并提交。&& 表示前一个成功了再执行后一个。"],
    ["", "Do you want to proceed?  1. Yes  2. No", "权限请求。看懂了再选 Yes。看不懂就选 No，然后问“这一步要做什么？”"],
    ["", "● 已添加悔棋功能：Board.undo() 恢复上一步棋盘，测试全部通过。", "最后的总结，最重要。确认它做的就是你要的，有没有提到“没做完”或“未测试”的部分。"],
  ];
  el.innerHTML = `<div class="transcript" id="tr"></div><div class="explain-box" id="tr-ex"><span class="muted">点击上面任意一行。</span></div>`;
  lines.forEach(([cls, t, ex]) => {
    const d = h(`<div class="tl ${cls}" tabindex="0">${esc(t)}</div>`);
    const act = () => { el.querySelectorAll(".tl").forEach((x) => x.classList.remove("on")); d.classList.add("on"); $("#tr-ex", el).textContent = ex; };
    d.onclick = act; d.onkeydown = (e) => { if (e.key === "Enter") act(); };
    $("#tr", el).appendChild(d);
  });
};

// ---------- 找 bug ----------
WIDGETS.bug = (el) => {
  const code = [
    ["def average(scores):", "函数定义，没问题。"],
    ["    total = 0", "从 0 开始累加，没问题。"],
    ["    for i in range(1, len(scores)):", "BUG！range(1, ...) 从第 2 个开始，漏掉了第 1 个成绩。应该是 range(len(scores))，或者直接 for s in scores。"],
    ["        total += scores[i]", "累加本身没问题，问题在上一行的范围。"],
    ["    return total / len(scores)", "这一行还有一个边界问题：scores 为空时会除以 0。但主要 bug 在上面。"],
    ["", ""],
    ["print(average([80, 90, 100]))  # 期望 90", "用已知答案测试：实际输出是 63.33，不是 90，说明有 bug。"],
  ];
  el.innerHTML = `<div class="transcript codepick" id="bg"></div><div class="explain-box" id="bg-ex"><span class="muted">点击你觉得有问题的行。</span></div>`;
  code.forEach(([t, ex], i) => {
    const d = h(`<div class="tl" tabindex="0">${esc(t) || " "}</div>`);
    const act = () => { if (!ex) return; el.querySelectorAll(".tl").forEach((x) => x.classList.remove("on")); d.classList.add("on"); $("#bg-ex", el).innerHTML = `<span class="${i === 2 ? "ok" : "muted"}">${i === 2 ? "✓ 找到了！" : ""}</span> ${esc(ex)}`; };
    d.onclick = act; d.onkeydown = (e) => { if (e.key === "Enter") act(); };
    $("#bg", el).appendChild(d);
  });
};

// ---------- 9 路围棋 + 规则型 AI ----------
WIDGETS.go = (el) => {
  const N = 9, E = 0, B = 1, W = 2;
  let board, turn, prevKey, caps, passes, over, lastMove;
  el.innerHTML = `<div class="go-wrap"><canvas class="go-board" id="gb" width="540" height="540" aria-label="9 路围棋棋盘"></canvas><div><div class="row"><button class="btn" id="gpass">停一手</button><button class="btn" id="gnew">新对局</button></div><div class="stat" id="gst"></div><p class="small muted" id="gmsg">你执黑先下。点交叉点落子。</p><p class="small muted">AI 思路：能吃子先吃；自己被打吃就长气；不往没气的地方下；不填自己的眼；其余靠近中央、随机一点。双方连续停一手就数子（黑贴 7 目）。</p></div></div>`;
  const cv = $("#gb", el), ctx = cv.getContext("2d");
  const nb = (i) => { const r = Math.floor(i / N), c = i % N, o = []; if (r > 0) o.push(i - N); if (r < N - 1) o.push(i + N); if (c > 0) o.push(i - 1); if (c < N - 1) o.push(i + 1); return o; };
  const group = (b, i) => { const col = b[i], seen = new Set([i]), st = [i], libs = new Set(); while (st.length) { const p = st.pop(); for (const q of nb(p)) { if (b[q] === E) libs.add(q); else if (b[q] === col && !seen.has(q)) { seen.add(q); st.push(q); } } } return { stones: [...seen], libs }; };
  const tryMove = (b, i, col) => {
    if (b[i] !== E) return null;
    const nbk = b.slice(); nbk[i] = col; const opp = 3 - col; let captured = 0;
    for (const q of nb(i)) if (nbk[q] === opp) { const g = group(nbk, q); if (!g.libs.size) { g.stones.forEach((s) => (nbk[s] = E)); captured += g.stones.length; } }
    const me = group(nbk, i); if (!me.libs.size) return null; // 自杀
    const key = nbk.join(""); if (key === prevKey) return null; // 打劫
    return { b: nbk, captured, libs: me.libs.size, size: me.stones.length };
  };
  const reset = () => { board = new Array(N * N).fill(E); turn = B; prevKey = ""; caps = { 1: 0, 2: 0 }; passes = 0; over = false; lastMove = -1; $("#gmsg", el).textContent = "你执黑先下。点交叉点落子。"; draw(); };
  const play = (i, col) => { const r = tryMove(board, i, col); if (!r) return false; prevKey = board.join(""); board = r.b; caps[col] += r.captured; passes = 0; lastMove = i; turn = 3 - col; return true; };
  const isEye = (b, i, col) => nb(i).every((q) => b[q] === col);
  const ai = () => {
    let best = -1, bs = -1e9;
    for (let i = 0; i < N * N; i++) {
      if (board[i] !== E || isEye(board, i, W)) continue;
      const r = tryMove(board, i, W); if (!r) continue;
      let s = r.captured * 12;
      for (const q of nb(i)) if (board[q] === W) { const g = group(board, q); if (g.libs.size === 1) s += 10 * g.stones.length; }
      for (const q of nb(i)) if (r.b[q] === B) { const g = group(r.b, q); if (g.libs.size === 1) s += 4; if (g.libs.size === 2) s += 1; }
      if (r.libs === 1) s -= 15; else s += Math.min(r.libs, 4);
      const rr = Math.floor(i / N), cc = i % N; s -= (Math.abs(rr - 4) + Math.abs(cc - 4)) * 0.35;
      if (rr === 0 || rr === 8 || cc === 0 || cc === 8) s -= 1.5;
      s += Math.random() * 2;
      if (s > bs) { bs = s; best = i; }
    }
    if (best < 0 || (bs < -8 && countEmpty() < 20)) { passes++; turn = B; $("#gmsg", el).textContent = "AI 停一手。" + (passes >= 2 ? "" : "轮到你。"); if (passes >= 2) finish(); }
    else { play(best, W); $("#gmsg", el).textContent = "轮到你。"; }
    draw();
  };
  const countEmpty = () => board.filter((x) => x === E).length;
  const score = () => {
    let s = { 1: 0, 2: 0 }; const seen = new Set();
    for (let i = 0; i < N * N; i++) {
      if (board[i] !== E) { s[board[i]]++; continue; }
      if (seen.has(i)) continue;
      const reg = [i], st = [i], bord = new Set(); seen.add(i);
      while (st.length) { const p = st.pop(); for (const q of nb(p)) { if (board[q] === E && !seen.has(q)) { seen.add(q); st.push(q); reg.push(q); } else if (board[q] !== E) bord.add(board[q]); } }
      if (bord.size === 1) s[[...bord][0]] += reg.length;
    }
    return s;
  };
  const finish = () => { over = true; const s = score(); const w = s[2] + 7; $("#gmsg", el).innerHTML = `终局（简易数子）：黑 ${s[1]}，白 ${s[2]} + 贴 7 = ${w}。<b>${s[1] > w ? "你赢了！" : "白棋（AI）赢了。"}</b>`; draw(); };
  const draw = () => {
    const S = cv.width, m = S / (N + 1);
    ctx.fillStyle = cssVar("--wood"); ctx.fillRect(0, 0, S, S);
    ctx.strokeStyle = "#2a1d0c"; ctx.lineWidth = 1.2;
    for (let k = 0; k < N; k++) { ctx.beginPath(); ctx.moveTo(m, m + k * m); ctx.lineTo(m * N, m + k * m); ctx.stroke(); ctx.beginPath(); ctx.moveTo(m + k * m, m); ctx.lineTo(m + k * m, m * N); ctx.stroke(); }
    ctx.fillStyle = "#2a1d0c"; [[2, 2], [2, 6], [6, 2], [6, 6], [4, 4]].forEach(([r, c]) => { ctx.beginPath(); ctx.arc(m + c * m, m + r * m, 4, 0, 7); ctx.fill(); });
    for (let i = 0; i < N * N; i++) {
      if (!board[i]) continue;
      const x = m + (i % N) * m, y = m + Math.floor(i / N) * m;
      ctx.beginPath(); ctx.arc(x, y, m * 0.46, 0, 7);
      ctx.fillStyle = board[i] === B ? "#16181c" : "#f6f5ef"; ctx.fill();
      ctx.strokeStyle = board[i] === B ? "#000" : "#9a9585"; ctx.lineWidth = 1; ctx.stroke();
      if (i === lastMove) { ctx.beginPath(); ctx.arc(x, y, m * 0.14, 0, 7); ctx.fillStyle = board[i] === B ? "#f6f5ef" : "#16181c"; ctx.fill(); }
    }
    $("#gst", el).innerHTML = `<span>黑提子 <b>${caps[1]}</b></span><span>白提子 <b>${caps[2]}</b></span><span>${over ? "已结束" : turn === B ? "● 黑走" : "○ 白思考中"}</span>`;
  };
  cv.addEventListener("click", (e) => {
    if (over || turn !== B) return;
    const rect = cv.getBoundingClientRect(), m = rect.width / (N + 1);
    const c = Math.round((e.clientX - rect.left) / m) - 1, r = Math.round((e.clientY - rect.top) / m) - 1;
    if (r < 0 || c < 0 || r >= N || c >= N) return;
    if (!play(r * N + c, B)) { $("#gmsg", el).textContent = "这里不能下（有子、自杀或打劫）。"; return; }
    draw(); setTimeout(ai, 250);
  });
  $("#gpass", el).onclick = () => { if (over || turn !== B) return; passes++; turn = W; if (passes >= 2) finish(); else setTimeout(ai, 200); };
  $("#gnew", el).onclick = reset;
  reset();
};

// ---------- KataGo 方案向导 ----------
WIDGETS.kataWizard = (el) => {
  const os = ["Windows", "Mac", "Linux"];
  const gpus = { nv_new: "NVIDIA RTX 20/30/40/50 系列", nv_old: "NVIDIA GTX 10 系列或更老", amd: "AMD 显卡", intel: "Intel 核显（没有独显）", apple: "Apple M 系列芯片", none: "不知道 / 只有 CPU" };
  el.innerHTML = `<div class="grid2"><label>系统<select class="input" id="kw-os">${os.map((o) => `<option>${o}</option>`).join("")}</select></label><label>显卡<select class="input" id="kw-gpu">${Object.entries(gpus).map(([k, v]) => `<option value="${k}">${v}</option>`).join("")}</select></label></div><div class="decoded" id="kw-out" style="line-height:1.8"></div>`;
  const upd = () => {
    const o = $("#kw-os", el).value; let g = $("#kw-gpu", el).value;
    if (o === "Mac" && g !== "apple") g = g === "none" ? "none" : "macintel";
    if (o !== "Mac" && g === "apple") { $("#kw-out", el).innerHTML = `<span class="no">Apple M 系列芯片只出现在 Mac 上，请把系统改成 Mac。</span>`; return; }
    const plan = {
      nv_new: ["OpenCL（先跑通），熟练后换 TensorRT", "文件名含 opencl", "最新 b28 大模型", "每秒几百到几千次计算，复盘非常流畅"],
      nv_old: ["OpenCL", "文件名含 opencl", "最新 b18 模型", "每秒一两百次，复盘够用"],
      amd: ["OpenCL", "文件名含 opencl", "独显用 b28 或 b18，入门卡用 b18", "取决于显卡档次"],
      intel: ["OpenCL（不行再换 Eigen CPU 版）", "文件名含 opencl", "最新 b18 模型", "每秒几十次，复盘可以，限制每步时间"],
      apple: ["KaTrain 自带 KataGo，或 brew install katago", "无需自己挑 zip", "M1/M2 基础款用 b18，Pro/Max 可用 b28", "M 系列芯片表现不错"],
      macintel: ["KaTrain 自带 KataGo，或 Homebrew", "无需自己挑 zip", "最新 b18 模型", "较慢，复盘时限制每步时间"],
      none: ["先按第 1 课查一下显卡；确实没有就用 Eigen（CPU）版", "文件名含 eigen（若有 avx2 版，较新的 CPU 选它）", "b18 模型", "较慢，适合偶尔复盘"],
    }[g];
    const sys = o === "Windows" ? "windows-x64" : o === "Linux" ? "linux-x64" : "";
    $("#kw-out", el).innerHTML = `<div><b>后端：</b>${plan[0]}</div><div><b>下载哪个：</b>${plan[1]}${sys ? `，且含 <code>${sys}</code>` : ""}</div><div><b>模型：</b>${plan[2]}</div><div><b>大概速度：</b>${plan[3]}</div><div><b>界面：</b>${o === "Mac" ? "KaTrain 最省事" : "KaTrain（自带引擎，最省事）或 Sabaki / LizzieYzy"}</div>`;
  };
  el.querySelectorAll("select").forEach((s) => (s.onchange = upd)); upd();
};

// ---------- 逐行解释（通用）----------
WIDGETS.annot = (el, l) => {
  el.innerHTML = `<div class="transcript codepick" id="an"></div><div class="explain-box" id="an-ex"><span class="muted">点击上面任意一行。</span></div>`;
  l.annot.forEach(([cls, t, ex]) => {
    const d = h(`<div class="tl ${cls}" tabindex="0">${esc(t)}</div>`);
    const act = () => { el.querySelectorAll(".tl").forEach((x) => x.classList.remove("on")); d.classList.add("on"); $("#an-ex", el).textContent = ex; };
    d.onclick = act; d.onkeydown = (e) => { if (e.key === "Enter") act(); };
    $("#an", el).appendChild(d);
  });
};

// ---------- 报错 → 解决 ----------
WIDGETS.faq = (el, l) => {
  el.innerHTML = `<div class="results" id="fq"></div><div class="explain-box" id="fq-ex"><span class="muted">点击你遇到的报错。</span></div>`;
  l.faq.forEach(([q, a]) => {
    const b = h(`<button class="result"><span class="u" style="color:var(--bad)">${esc(q)}</span></button>`);
    b.onclick = () => { el.querySelectorAll(".result").forEach((x) => x.classList.remove("right")); b.classList.add("right"); $("#fq-ex", el).textContent = a; };
    $("#fq", el).appendChild(b);
  });
};
