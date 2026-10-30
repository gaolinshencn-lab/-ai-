// 实战路线：在自己电脑上部署 KataGo（2026-10-30 实测，KataGo v1.18.1）
TRACKS.push({ id: "kata", name: "实战：本地部署 KataGo", desc: "2026 年最新的 KataGo 和 transformer 模型：选版本、下模型、测速、对弈、接界面、排错、Python 调用、人类风格陪练。每一步都实测过。" });

const KATA_TESTED = `<div class="note"><b>本路线的实测环境</b>：2026-10-30，KataGo <b>v1.18.1</b>（官方预编译 Linux 版，Eigen CPU + AVX2），4 核 CPU、15 GB 内存、无显卡。文中出现的命令输出都是真实运行结果。有显卡的电脑会快几十到几百倍，步骤完全一样。</div>`;

LESSONS.push(
  {
    id: "k1", track: "kata", level: 1, title: "2026 年的 KataGo：三件套和最新模型",
    lead: "KataGo 在 2026 年换代了：主力模型从卷积网络换成了 transformer，需要 v1.17 以上的 KataGo 才能运行。先把全局弄清楚，再动手。",
    body: KATA_TESTED + `
<h2>三件套</h2>
<div class="tbl"><table>
<tr><th>东西</th><th>是什么</th><th>官方来源</th></tr>
<tr><td><b>引擎</b>（katago.exe / katago）</td><td>负责计算的程序，没有界面，在终端里运行</td><td><code>github.com/lightvector/KataGo/releases</code></td></tr>
<tr><td><b>模型</b>（<code>.bin.gz</code>）</td><td>训练好的神经网络，就是 KataGo 的“棋力”。全世界志愿者一直在训练，每隔一两周就有新模型</td><td><code>katagotraining.org/networks/</code></td></tr>
<tr><td><b>界面</b></td><td>画棋盘、显示胜率和推荐点，在后台调用引擎</td><td>KaTrain、LizzieYzy Next、Sabaki、Ogatak、q5Go</td></tr>
</table></div>
<p>引擎和模型是分开的：以后出了新模型，只要换掉 <code>.bin.gz</code> 文件。</p>

<h2>2026 年 KataGo 发生了什么</h2>
<div class="tbl"><table>
<tr><th>时间</th><th>事件</th></tr>
<tr><td>2024-05</td><td>b28 大卷积模型上线；b18 系列停止更新（最后一个是 <code>kata1-b18c384nbt-s9996604416-d4316597426</code>）</td></tr>
<tr><td>2026-03 / 04</td><td>智子围棋（ZhiziGo）和研究者 hzy 贡献了更强的 <code>zhizi-b28</code>、<code>zhizi-b40</code> 模型</td></tr>
<tr><td>2026-07-29</td><td><b>v1.17.0</b>：第一个支持 transformer 模型的版本。官方说 transformer“同样计算量下强得多”</td></tr>
<tr><td>2026-08-22 / 24</td><td><b>v1.18.0 / v1.18.1</b>：新增 ROCm（AMD）和 ONNX（Intel）后端，CUDA 大幅优化，benchmark 和 genconfig 能自动推荐更快的设置</td></tr>
<tr><td>2026-08-25</td><td>主训练改用 transformer，开始发布 <code>kata1-tf3-b11c768-…</code> 系列</td></tr>
<tr><td>2026-08-30</td><td><b>v1.18.2</b>：只更新了 CUDA 版，让 RTX 20 系列和 T4 跑 transformer 快 50% 以上。其他后端仍以 v1.18.1 为最新</td></tr>
</table></div>
<div class="note warn"><b>最重要的一条</b>：transformer 模型（名字里带 <code>tf</code>）必须用 <b>v1.17.0 或更新</b>的 KataGo。老版本会报错“This neural net requires a newer KataGo version… Model version: 17”（第 7 课有实测截图）。界面软件里打包的 KataGo 可能是老版本，用之前先确认。</div>

<h2>后端：按你的硬件选</h2>
<p>同一个 KataGo 有多个版本，区别在于用什么方式调用硬件，这叫<b>后端</b>。以下是官方 README 在 2026 年的建议：</p>
<div class="tbl"><table>
<tr><th>你的硬件</th><th>推荐后端</th><th>说明</th></tr>
<tr><td>NVIDIA 显卡</td><td><b>CUDA（cuDNN 9.8）</b> 或 <b>TensorRT</b></td><td>官方说跑 transformer 时“好显卡上 CUDA 通常更快一点”。<b>不要选 cudnn8.9.7 的包</b>，它跑 transformer“慢很多”。TensorRT 必须是 10 以上</td></tr>
<tr><td>AMD 显卡</td><td>ROCm（新），或 OpenCL</td><td>ROCm 通常比 OpenCL 快。Windows 版按显卡架构分包（gfx103X/gfx110X/gfx1151/gfx120X）；不确定就用 OpenCL</td></tr>
<tr><td>Intel 核显 / 独显</td><td>ONNX（OpenVINO），或 OpenCL</td><td>ONNX 版需在配置中设 <code>onnxProvider = openvino</code></td></tr>
<tr><td>Mac（M 系列）</td><td>Metal</td><td>官方建议用 Homebrew 安装：<code>brew install katago</code></td></tr>
<tr><td>没有显卡</td><td>Eigen AVX2（老 CPU 用 Eigen）</td><td>能用，但很慢，见第 4 课的实测数据</td></tr>
<tr><td>什么都不确定</td><td>OpenCL</td><td>兼容性最好，但官方明确说它跑 transformer“明显更慢”</td></tr>
</table></div>
<h2>查看你的硬件</h2>
<ul>
<li><b>Windows</b>：<kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>Esc</kbd> 打开任务管理器 → 性能 → 往下找“GPU”看名字。NVIDIA 显卡还可以在终端输入 <code>nvidia-smi</code>。</li>
<li><b>Mac</b>：苹果菜单 → 关于本机 → 看“芯片”。</li>
</ul>
<p>在下面选你的电脑，生成推荐方案：</p>`,
    widget: "kataWizard",
    quiz: [
      { q: "你下载了 kata1-tf3-b11c768-… 模型，KataGo 至少要什么版本？", o: ["任何版本都行", "v1.17.0 或更新", "v1.14"], a: 1, e: "tf 开头的 transformer 模型从 v1.17.0 起才支持。" },
      { q: "NVIDIA 显卡选 CUDA 版时，应该选哪种包？", o: ["cudnn8.9.7", "cudnn9.8.0", "随便"], a: 1, e: "官方：cuDNN 8.9.7 跑 transformer 会慢很多。" },
      { q: "Mac 上官方推荐的安装方式？", o: ["下载 Windows 版", "brew install katago（Metal 后端）", "不能用"], a: 1, e: "Homebrew 版带 Metal 后端。" },
    ],
    videos: [yt("KataGo 是什么", "KataGo 介绍 围棋AI"), yt("KataGo transformer", "KataGo transformer network 2026"), yt("查看电脑显卡型号", "怎么看 电脑 显卡 型号")],
  },
  {
    id: "k2", track: "kata", level: 1, title: "下载 KataGo v1.18 并验证",
    lead: "去 GitHub Releases 下载和你的系统、后端对应的 zip，解压，运行 katago version。",
    body: `
<h2>打开下载页</h2>
<ol>
<li>浏览器打开 <code>https://github.com/lightvector/KataGo/releases</code>。</li>
<li>NVIDIA 用 CUDA 的：进 <b>v1.18.2</b>。其他所有人：进 <b>v1.18.1</b>（这是除 CUDA 以外后端的最新版）。</li>
<li>拉到底部 <b>Assets</b>，点开全部文件列表，按下表找文件名。</li>
</ol>
<div class="tbl"><table>
<tr><th>你的情况</th><th>文件名（实际文件名）</th></tr>
<tr><td>Windows + NVIDIA（推荐）</td><td><code>katago-v1.18.2-cuda12.1-cudnn9.8.0-windows-x64.zip</code></td></tr>
<tr><td>Linux + NVIDIA</td><td><code>katago-v1.18.2-cuda12.1-cudnn9.8.0-linux-x64.zip</code></td></tr>
<tr><td>Windows + 其他显卡（通用）</td><td>v1.18.1 中名字含 <code>opencl</code> 和 <code>windows-x64</code> 的 zip</td></tr>
<tr><td>Windows / Linux 无显卡</td><td>v1.18.1 中含 <code>eigenavx2</code> 的 zip，例如 <code>katago-v1.18.1-eigenavx2-linux-x64.zip</code>（本课实测用的就是它）</td></tr>
<tr><td>很老的 CPU（不支持 AVX2）</td><td>含 <code>eigen-</code> 但不含 avx2 的 zip</td></tr>
</table></div>
<p>文件名里带 <code>+bs50</code> 的是支持 50×50 大棋盘的特殊版，普通 19 路不需要。</p>

<h2>Windows：解压和运行</h2>
<ol>
<li>新建 <code>D:\\katago</code>（路径里<b>不要有中文和空格</b>，也不要放在 <code>C:\\Program Files</code>，那里没有写权限，调优时会报 Could not create file）。</li>
<li>把 zip 解压到这里。</li>
<li>打开该文件夹，在地址栏输入 <code>cmd</code> 回车。</li>
<li>输入 <code>katago.exe version</code> 回车。</li>
</ol>
<p>CUDA 版还需要安装 NVIDIA 的 CUDA 12.x 和 cuDNN 9.x，并把它们的 <code>bin</code> 目录加入系统 PATH。这一步嫌麻烦，可以先用 OpenCL 版把一切跑通，再回来换。</p>

<h2>Mac</h2>
<pre><code># 先在 https://brew.sh 按说明装好 Homebrew，然后：
brew install katago
katago version
brew list --verbose katago      # 列出安装的配置文件和自带模型的位置</code></pre>
<p>官方提醒：Homebrew 版“可能比官方发布稍晚”。<code>katago version</code> 显示低于 1.17 的话，先 <code>brew update && brew upgrade katago</code>，否则用不了 tf 模型。</p>

<h2>Linux：实测过程</h2>
<pre><code>mkdir -p ~/katago/models && cd ~/katago
curl -L -o kg.zip https://github.com/lightvector/KataGo/releases/download/v1.18.1/katago-v1.18.1-eigenavx2-linux-x64.zip
unzip kg.zip
./katago version</code></pre>
<p>点击下面的真实输出看解释：</p>`,
    widget: "annot",
    annot: [
      ["", "$ ls", "解压后的文件夹里有什么。"],
      ["", "README.txt  analysis_example.cfg  cacert.pem  contribute_example.cfg  default_gtp.cfg", "README.txt 是说明；.cfg 都是配置文件：default_gtp.cfg 用于对弈和界面，analysis_example.cfg 用于 Python 分析，contribute_example.cfg 用于给训练贡献算力。"],
      ["", "gtp_human5k_example.cfg  gtp_human9d_search_example.cfg  katago  match_example.cfg", "katago 就是主程序（Windows 上是 katago.exe）。两个 human 配置用于人类风格模型（第 9 课）。注意：压缩包里不带模型，模型要另外下载。"],
      ["", "$ ./katago version", "让它报版本号，验证程序能运行。"],
      ["del", "Error: No suitable fusermount binary found on the $PATH", "Linux 版是 AppImage 格式，需要 FUSE。没有 FUSE 时会打印这行警告，但实测程序会自动改用其他方式继续运行，可以忽略。想消除它：Ubuntu 上 sudo apt install fuse 或 libfuse2。"],
      ["add", "KataGo v1.18.1", "版本号。≥ 1.17.0 才能用 tf 模型。"],
      ["add", "Git revision: 92ee95c0a4b25fec214da00951ab69e97e207729", "源码版本编号，排错时附上它。"],
      ["add", "Using Eigen(CPU) backend", "后端。你下载的是 OpenCL / CUDA 版的话，这里会相应显示。"],
      ["add", "Compiled with AVX2 and FMA instructions", "启用了 CPU 加速指令。CPU 太老不支持 AVX2 时，这个版本会直接崩溃，要换不带 avx2 的版本。"],
      ["add", "Compiled to support contributing to online distributed selfplay", "这个版本可以用来给 KataGo 训练贡献算力（可选）。"],
    ],
    quiz: [
      { q: "NVIDIA 显卡想用 CUDA，下载哪个？", o: ["v1.18.1 cudnn8.9.7", "v1.18.2 cuda12.1-cudnn9.8.0", "eigenavx2"], a: 1, e: "v1.18.2 是 CUDA 的最新版，选 cuDNN 9.8。" },
      { q: "为什么不要把 KataGo 放在 C:\\Program Files？", o: ["会变慢", "那里普通权限写不了文件，调优时会报 Could not create file", "会被删除"], a: 1, e: "官方 FAQ 里写的常见问题。" },
      { q: "Linux 运行时提示 No suitable fusermount binary found，但后面正常显示版本号，说明？", o: ["安装失败", "只是 AppImage 的警告，程序能用", "要重装系统"], a: 1, e: "实测程序能正常运行；装 FUSE 可以消除警告。" },
    ],
    videos: [yt("KataGo Windows 安装", "KataGo Windows 安装 教程"), yt("How to install KataGo", "how to install KataGo windows"), yt("Homebrew 安装教程", "Homebrew Mac 安装 教程")],
  },
  {
    id: "k3", track: "kata", level: 1, title: "选择并下载最新模型",
    lead: "katagotraining.org 列出了全部官方模型。最新不等于最适合你，按硬件选。",
    body: `
<h2>网页上的两个关键词</h2>
<p>打开 <code>https://katagotraining.org/networks/</code>，页面顶部写着（2026-10-30 实际内容）：</p>
<ul>
<li><b>Latest network</b>（最新）：<code>kata1-tf3-b11c768-s12752M-d6531M</code>，2026-10-22 上传，评测对局 0 局，Elo 还不确定。</li>
<li><b>Strongest confidently-rated network</b>（评分可靠的最强）：<code>kata1-tf3-b11c768-s11003M-d5973M-7gres</code>，Elo 14605.5 ± 15.5。</li>
</ul>
<p><b>建议下载第二个</b>：它已经下过几千盘评测棋，强度有保证。刚上传的最新模型还没评测，强度可能略高也可能略低。</p>

<h2>模型清单（实测下载，文件大小为实际值）</h2>
<div class="tbl"><table>
<tr><th>模型</th><th>结构</th><th>Elo</th><th>大小</th><th>适合</th></tr>
<tr><td><code>kata1-tf3-b11c768-s11003M-d5973M-7gres</code></td><td>transformer，7044 万参数</td><td>14605</td><td>250 MB</td><td><b>有中高端显卡：首选</b></td></tr>
<tr><td><code>kata1-tf3-b10c512-s3203M-d5937M</code></td><td>transformer，中号</td><td>14169</td><td>90 MB</td><td>中端显卡</td></tr>
<tr><td><code>kata1-tf2-b10c384-s2941M-d5872M</code></td><td>transformer，1055 万参数</td><td>13709</td><td>36 MB</td><td>弱显卡、核显</td></tr>
<tr><td><code>kata1-zhizi-b40c768nbt-s11472M-d5982M</code></td><td>卷积，40 块</td><td>14515</td><td>823 MB</td><td>老版本 KataGo（&lt;1.17）能用的最强模型，文件很大</td></tr>
<tr><td><code>kata1-b28c512nbt-s13255194368-d5935380940</code></td><td>卷积，7283 万参数</td><td>14105</td><td>259 MB</td><td>老版本 KataGo</td></tr>
<tr><td><code>kata1-b18c384nbt-s9996604416-d4316597426</code></td><td>卷积，b18</td><td>13623</td><td>93 MB</td><td><b>只有 CPU 时实测最快</b>（第 4 课）</td></tr>
</table></div>
<p>Elo 每差 100，强的一方胜率约 64%。这些模型全部远超人类职业棋手，对复盘来说差别很小，<b>速度往往比那一两百 Elo 更重要</b>。</p>

<h2>看懂名字</h2>
<div class="tbl"><table>
<tr><th>片段</th><th>意思</th></tr>
<tr><td><code>tf3</code> / <code>tf2</code></td><td>transformer 第 3 / 2 代结构（需要 KataGo ≥ 1.17）</td></tr>
<tr><td><code>b11c768</code></td><td>11 个块、768 个通道。transformer 的块很“重”，不能和卷积的 b 数直接比</td></tr>
<tr><td><code>nbt</code></td><td>卷积网络的“嵌套瓶颈”结构</td></tr>
<tr><td><code>zhizi</code></td><td>由智子围棋团队训练并贡献</td></tr>
<tr><td><code>s11003M</code> / <code>d5973M</code></td><td>训练样本数 110 亿 / 数据量编号，越大越新</td></tr>
</table></div>

<h2>下载</h2>
<p>点网页上 “Network File” 一列的 [Download]，得到 <code>.bin.gz</code>。<b>不要解压</b>，KataGo 直接读它。也可以用命令下载（地址格式是固定的）：</p>
<pre><code># Windows（PowerShell）：
cd D:\\katago\\models
curl.exe -L -O https://media.katagotraining.org/uploaded/networks/models/kata1/kata1-tf3-b11c768-s11003M-d5973M-7gres.bin.gz

# Mac / Linux：
cd ~/katago/models
curl -L -O https://media.katagotraining.org/uploaded/networks/models/kata1/kata1-tf3-b11c768-s11003M-d5973M-7gres.bin.gz</code></pre>
<p>换模型时，把链接最后的文件名换成网页上的模型名加 <code>.bin.gz</code>。下载完对比文件大小（如 tf3-b11c768 约 250 MB），太小说明没下完。</p>
<div class="note">模型的许可证见 <code>katagotraining.org/network_license/</code>。个人使用、复盘、学习都没问题。</div>`,
    quiz: [
      { q: "“Latest network”和“Strongest confidently-rated network”，新手先下哪个？", o: ["Latest，越新越好", "Strongest confidently-rated，强度经过几千盘评测", "都不下"], a: 1, e: "刚上传的模型还没有评测数据。" },
      { q: "你用的界面软件自带 KataGo v1.16，想用最强的模型，选？", o: ["tf3-b11c768", "zhizi-b40c768nbt（卷积）或者升级 KataGo", "tf2-b10c384"], a: 1, e: "老版本只能读卷积模型。最好的办法是升级 KataGo。" },
    ],
    videos: [yt("KataGo networks", "katagotraining networks which to use"), yt("KataGo 权重 下载", "KataGo 权重 模型 下载 选择")],
  },
  {
    id: "k4", track: "kata", level: 2, title: "测速：benchmark 实测与 genconfig",
    lead: "benchmark 告诉你这台电脑每秒能算多少次、该开几个线程。不同模型速度差别很大，测了再选。",
    body: KATA_TESTED + `
<h2>运行 benchmark</h2>
<pre><code># Windows：
katago.exe benchmark -model models\\kata1-tf3-b11c768-s11003M-d5973M-7gres.bin.gz -config default_gtp.cfg
# Mac / Linux：
./katago benchmark -model models/kata1-tf3-b11c768-s11003M-d5973M-7gres.bin.gz -config default_gtp.cfg</code></pre>
<p>常用参数：<code>-t 4,8,16</code> 指定测试哪些线程数；<code>-v 200</code> 每个局面算多少次（默认 80）；<code>-n 10</code> 测几个局面。CPU 很慢的话可以用 <code>-v 40 -n 4</code> 先快速看个大概。OpenCL 版第一次运行会先<b>自动调优</b>，一般 5–30 秒，老机器可能好几分钟，都是正常的。</p>

<h2>实测输出（点击每行看解释）</h2>`,
    widget: "annot",
    annot: [
      ["", "Eigen (CPU) backend thread 0: Model name: kata1-tf3-b11c768-s11003M-d5973M-7gres (nbt transformer, 70442025 params)", "成功加载模型：transformer，约 7044 万个参数。能看到这行，说明版本和模型匹配。"],
      ["", "You are currently using the Eigen (CPU) version of KataGo. Due to having no GPU, it may be slow.", "提醒：你用的是 CPU 版，会慢。"],
      ["", "Your GTP config is currently set to use numSearchThreads = 6", "default_gtp.cfg 里的默认线程数是 6。"],
      ["add", "numSearchThreads =  4: 4 / 4 positions, visits/s = 2.39 nnEvals/s = 2.44 ... (EloDiff baseline)", "4 线程：每秒 2.39 次访问（visits/s）。这是最关键的数字，越大越好。有好显卡时通常是几百到几千。"],
      ["add", "numSearchThreads =  8: 4 / 4 positions, visits/s = 2.45 nnEvals/s = 2.49 ... (EloDiff -41)", "8 线程：速度几乎没变，但线程多会让搜索质量下降，估计弱 41 Elo。"],
      ["", "numSearchThreads =  4: (baseline) (recommended)", "结论：推荐 4 线程。把配置文件里的 numSearchThreads 改成这个数。"],
      ["", "If you intend to do short or fixed-visit searches, use lower numSearchThreads for better strength", "官方提示：每步只算很少次数时，线程少一点反而更强。"],
    ],
    extra: `
<h2>实测数据：同一台 4 核 CPU，不同模型</h2>
<div class="tbl"><table>
<tr><th>模型</th><th>参数量</th><th>CPU 实测 visits/s</th><th>算 100 次要多久</th></tr>
<tr><td>b18c384nbt（卷积，2024）</td><td>2633 万</td><td><b>9.40</b></td><td>约 11 秒</td></tr>
<tr><td>b28c512nbt（卷积）</td><td>7283 万</td><td>3.93</td><td>约 25 秒</td></tr>
<tr><td>tf3-b11c768（transformer，最强）</td><td>7044 万</td><td>2.39</td><td>约 42 秒</td></tr>
<tr><td>tf3-b10c512（transformer，中）</td><td>2854 万</td><td>0.23</td><td>约 7 分钟</td></tr>
<tr><td>tf2-b10c384（transformer，小）</td><td>1055 万</td><td>1.30</td><td>约 77 秒</td></tr>
</table></div>
<p><b>结论</b>：在 CPU（Eigen）上，transformer 模型没有优势，小号 transformer 甚至最慢；中号 tf3-b10c512 在 CPU 上只有 0.23，几乎没法用；<b>最快的是 2024 年的 b18 卷积模型（9.40），是最强 tf3 模型的 4 倍</b>。官方也说 OpenCL 和 CPU 后端跑 transformer 明显更慢。<b>有 NVIDIA 显卡并用 CUDA / TensorRT 时，transformer 才能发挥“同样计算量更强”的优势。</b>所以：有好显卡选 tf3，只有 CPU 选 b18。</p>
<p>每秒几次够不够用？复盘时让它每手想 10–30 秒，几十到上百次访问对业余棋手来说已经非常有参考价值；实时对弈就会很慢。</p>

<h2>生成你自己的配置：genconfig</h2>
<pre><code>katago.exe genconfig -model models\\你的模型.bin.gz -output my_gtp.cfg</code></pre>
<p>它会依次问你几个问题。下面是问题的意思和新手的推荐回答：</p>
<div class="tbl"><table>
<tr><th>它问</th><th>意思</th><th>推荐</th></tr>
<tr><td>rules</td><td>规则</td><td><code>chinese</code>（默认配置里是 tromp-taylor，建议改）</td></tr>
<tr><td>resign / allow resignation</td><td>输得多时是否认输</td><td>陪练选 no，对弈选 yes</td></tr>
<tr><td>ponder</td><td>对手思考时自己也继续算</td><td>笔记本选 no（不然一直满负荷发热）</td></tr>
<tr><td>visits / time limit</td><td>每步算多少次或几秒</td><td>直接回车用默认</td></tr>
<tr><td>GPU / device</td><td>用哪块显卡</td><td>有独显就选独显的编号</td></tr>
<tr><td>memory / cache</td><td>用多少内存</td><td>回车默认</td></tr>
</table></div>
<p>回答完它会自动跑一次测速（v1.18.1 起还会测试 batch size 等更多设置），把最优值写进 <code>my_gtp.cfg</code>。以后的命令都用 <code>-config my_gtp.cfg</code>。</p>`,
    quiz: [
      { q: "benchmark 里最关键的数字是？", o: ["params", "visits/s（每秒访问次数）", "secs"], a: 1, e: "越大越快、越强。" },
      { q: "只有 CPU 的笔记本，按本课实测应选哪个模型？", o: ["tf2-b10c384（最小所以最快）", "b18c384nbt 卷积模型", "tf3-b11c768"], a: 1, e: "实测在 CPU 上小 transformer 反而最慢。" },
      { q: "benchmark 显示 8 线程比 4 线程速度一样但 EloDiff -41，你该？", o: ["用 8 线程", "用推荐的 4 线程", "用 1 线程"], a: 1, e: "线程多不加速时，只会让搜索变差。" },
    ],
    videos: [yt("KataGo benchmark", "KataGo benchmark genconfig tutorial"), yt("KataGo GPU speed comparison", "KataGo visits per second GPU comparison")],
  },
  {
    id: "k5", track: "kata", level: 2, title: "第一次对弈：用 GTP 和 KataGo 说话",
    lead: "图形界面和 KataGo 之间用 GTP 命令交流。先在终端里亲手发几条，以后界面出问题你就知道怎么排查。",
    body: `
<h2>启动</h2>
<pre><code>katago.exe gtp -model models\\你的模型.bin.gz -config my_gtp.cfg</code></pre>
<p>等它打印 <code>GTP ready, beginning main protocol loop</code>，然后一行一行输入命令，每行回车。</p>
<div class="tbl"><table>
<tr><th>命令</th><th>意思</th></tr>
<tr><td><code>boardsize 19</code></td><td>19 路棋盘</td></tr>
<tr><td><code>komi 7.5</code></td><td>贴 7.5 目</td></tr>
<tr><td><code>kata-set-rules chinese</code></td><td>中国规则（KataGo 专用扩展命令）</td></tr>
<tr><td><code>play B Q16</code></td><td>黑棋下在 Q16。列是 A–T（<b>没有 I</b>），行从下往上 1–19</td></tr>
<tr><td><code>genmove W</code></td><td>让 KataGo 替白棋想一步并下出来</td></tr>
<tr><td><code>showboard</code></td><td>用文字画出棋盘</td></tr>
<tr><td><code>undo</code></td><td>悔一步</td></tr>
<tr><td><code>quit</code></td><td>退出</td></tr>
</table></div>
<p>每条命令成功时，KataGo 回一行以 <code>=</code> 开头的结果；出错时以 <code>?</code> 开头。</p>
<h2>实测记录（点击看解释）</h2>`,
    widget: "annot",
    annot: [
      ["", "$ katago gtp -model models/kata1-b18c384nbt-s9996604416-d4316597426.bin.gz -config default_gtp.cfg", "启动 GTP 模式。CPU 上加载 b18 模型约几秒。"],
      ["", "Using TrompTaylor rules initially, unless GTP/GUI overrides this", "default_gtp.cfg 默认用 Tromp-Taylor 规则（一种机器友好的数子规则），接下来用命令改成中国规则。"],
      ["", "Loaded model models/kata1-b18c384nbt-s9996604416-d4316597426.bin.gz", "模型加载成功。"],
      ["add", "GTP ready, beginning main protocol loop", "准备好了，可以输入命令。"],
      ["", "boardsize 19   →   =", "设置 19 路。= 表示成功。"],
      ["", "kata-set-rules chinese   →   Changed rules to Chinese   =", "改成中国规则。"],
      ["", "play B Q16   →   =", "我们让黑棋下在 Q16（右上角星位）。"],
      ["add", "genmove W   →   = D4", "KataGo 替白棋下了 D4（左下角星位）。CPU 上限制 30 次访问，约 3 秒。"],
      ["del", "play B D4   →   ? illegal move", "实测踩坑：D4 已经被白棋占了，所以返回 ? illegal move（非法着法）。这也是界面里“点了没反应”的原因之一。"],
      ["", "play B R4   →   =", "换个空点，成功。"],
      ["add", "genmove W   →   = D16", "白棋下在 D16（左上角星位）。"],
      ["", "showboard", "画出棋盘：X 是黑，O 是白，旁边的数字是落子顺序（从 0 开始，第 0 手不显示数字）。"],
      ["", "16 . . . O3. . . . . . . . . . . X . . .", "第 16 行：D16 是白棋第 3 手，Q16 是黑棋第 0 手。"],
      ["", " 4 . . . O1. . . . . . . . . . . . X2. .", "第 4 行：D4 白棋第 1 手，R4 黑棋第 2 手。"],
      ["", "Rules: {\"ko\":\"SIMPLE\",\"komi\":7.5,\"scoring\":\"AREA\",\"suicide\":false,\"tax\":\"NONE\",\"whiteHandicapBonus\":\"N\"}", "当前规则：数子法 AREA（中国规则）、贴 7.5、不能自杀。"],
      ["", "quit   →   =", "退出。"],
    ],
    extra: `
<h2>一键测试脚本</h2>
<p>不想一行行打？把命令写进文件，一次喂给它：</p>
<pre><code># Mac / Linux：
printf 'boardsize 19\\nkomi 7.5\\nplay B Q16\\ngenmove W\\nshowboard\\nquit\\n' | ./katago gtp -model models/你的模型.bin.gz -config my_gtp.cfg

# Windows：新建 test.txt，每行一条命令，然后
katago.exe gtp -model models\\你的模型.bin.gz -config my_gtp.cfg &lt; test.txt</code></pre>
<p><code>-override-config "maxVisits=30"</code> 可以临时改配置而不动文件，CPU 上测试时让它快一点。</p>`,
    quiz: [
      { q: "GTP 回复以 ? 开头表示？", o: ["成功", "命令出错", "KataGo 在思考"], a: 1, e: "= 成功，? 出错。" },
      { q: "坐标 J4 在哪一列？", o: ["第 10 列", "第 9 列（因为跳过了 I）", "第 4 列"], a: 1, e: "A–H 是 1–8，J 是第 9 列。" },
    ],
    videos: [yt("GTP protocol", "Go Text Protocol GTP explained"), yt("围棋坐标", "围棋 坐标 记谱 方法")],
  },
  {
    id: "k6", track: "kata", level: 2, title: "接上图形界面",
    lead: "命令行能跑通以后，选一个界面接上 KataGo。2026 年最需要注意：界面自带的 KataGo 版本够不够新。",
    body: `
<div class="tbl"><table>
<tr><th>界面</th><th>特点</th><th>注意</th></tr>
<tr><td><b>KaTrain</b>（github.com/sanderland/katrain）</td><td>官方 README 说它“对非技术用户可能最容易”：自带 KataGo，可调 AI 强度，会给每一步打分</td><td>自带的 KataGo 可能早于 1.17，要用 tf 模型就把引擎换成你下载的 v1.18</td></tr>
<tr><td><b>LizzieYzy Next</b>（github.com/wimi321/lizzieyzy-next）</td><td>LizzieYzy 的新分支，中文社区常用，分析信息很全</td><td>同上，确认引擎版本</td></tr>
<tr><td><b>Sabaki</b>（sabaki.yichuanshen.de）</td><td>简洁的棋谱编辑器，可接任何 GTP 引擎</td><td>不自带引擎，正好用你自己的 v1.18</td></tr>
<tr><td><b>Ogatak</b>（github.com/rooklift/ogatak）</td><td>专为 KataGo 设计，反应快</td><td>不自带引擎</td></tr>
</table></div>
<div class="note">官方 README 提醒：原版 Lizzie 已经很老，自带的 KataGo 版本“非常过时”，建议用它的新分支。</div>

<h2>KaTrain：换成 v1.18 引擎和最新模型</h2>
<ol>
<li>从 KaTrain 的 GitHub Releases 下载安装（或 <code>pip install katrain</code>）。</li>
<li>打开设置（General & Engine Settings）。</li>
<li><b>KataGo executable path</b>：填 <code>D:\\katago\\katago.exe</code>（你下载的 v1.18）。</li>
<li><b>Model file path</b>：填 <code>D:\\katago\\models\\kata1-tf3-b11c768-s11003M-d5973M-7gres.bin.gz</code>。</li>
<li>保存，它会重启引擎。左下角出现推荐点和胜率，就成功了。</li>
</ol>

<h2>Sabaki：添加引擎</h2>
<ol>
<li>菜单 <b>Engines → Manage Engines → Add</b>。</li>
<li><b>Path</b>：<code>D:\\katago\\katago.exe</code></li>
<li><b>Arguments</b>：</li>
</ol>
<pre><code>gtp -model D:\\katago\\models\\kata1-tf3-b11c768-s11003M-d5973M-7gres.bin.gz -config D:\\katago\\my_gtp.cfg</code></pre>
<ol start="4">
<li><b>Engines → Attach</b> 把它设为白棋对弈；打开 <b>Analysis</b> 看推荐点和胜率。</li>
</ol>

<h2>最省事的办法：不写路径</h2>
<p>官方技巧：把配置文件改名为 <code>default_gtp.cfg</code>，把模型改名为 <code>default_model.bin.gz</code>，都放在 katago.exe 旁边。之后命令只需要 <code>katago.exe gtp</code>，界面里 Arguments 只填 <code>gtp</code>。</p>
<div class="note warn">界面“一直加载中”或“引擎启动失败”时，界面往往不显示真正的错误。回到终端，用<b>完全相同</b>的路径和参数运行一次，看终端里的报错，再查下一课。</div>`,
    quiz: [
      { q: "KaTrain 里加载 tf3 模型报错，最可能的原因？", o: ["模型坏了", "KaTrain 自带的 KataGo 版本低于 1.17，要换成你下载的 v1.18", "电脑太慢"], a: 1, e: "2026 年最常见的坑。" },
      { q: "想让界面里只填 gtp 就能启动，怎么做？", o: ["做不到", "把配置和模型改名为 default_gtp.cfg、default_model.bin.gz，放在 katago 旁边", "重装界面"], a: 1, e: "KataGo 会自动找这两个默认文件名。" },
    ],
    videos: [yt("KaTrain 教程", "KaTrain tutorial KataGo"), yt("Sabaki KataGo 设置", "Sabaki KataGo setup engine"), yt("LizzieYzy 教程", "LizzieYzy KataGo 教程")],
  },
  {
    id: "k7", track: "kata", level: 2, title: "报错排查（含实测报错）",
    lead: "点击你遇到的报错。第一条是本课实测复现的真实报错，也是 2026 年最常见的一个。",
    body: `
<h2>通用排查顺序</h2>
<ol>
<li>在终端里手动运行，看<b>最后几行</b>。</li>
<li>运行 <code>katago version</code>，确认版本（用 tf 模型要 ≥ 1.17）。</li>
<li>检查路径：不要有中文、空格；可以把文件直接拖进终端窗口，自动填入完整路径。</li>
<li>换成最稳的组合试一次：OpenCL（或 Eigen）版 + b18 模型 + 自带的 <code>default_gtp.cfg</code>。能跑通就逐项换回去，找出问题出在哪一项。</li>
<li>把完整报错、系统、显卡型号、KataGo 版本、模型名一起发给 AI，或去官方 Discord 的 #help 频道提问。</li>
</ol>
<h2>实测复现：老版本加载新模型</h2>
<p>用 KataGo v1.16.2 加载 tf3 模型，实际输出：</p>
<pre><code>KataGo v1.16.2
terminate called after throwing an instance of 'StringError'
  what():  Error loading or parsing model file .../kata1-tf3-b11c768-s11003M-d5973M-7gres.bin.gz:
  This neural net requires a newer KataGo version. Obtain a newer KataGo at
  https://github.com/lightvector/KataGo. Model version: 17</code></pre>
<p>解决：换成 v1.18 的 KataGo。或者，如果界面只能用老引擎，就换成卷积模型（zhizi-b40 / b28 / b18）。</p>`,
    widget: "faq",
    faq: [
      ["This neural net requires a newer KataGo version ... Model version: 17", "（实测复现）KataGo 版本低于 1.17，读不了 transformer 模型。下载 v1.18.1（CUDA 用 v1.18.2）。在界面里使用时，记得把界面的引擎路径也指向新版本。"],
      ["找不到 cudnn64_9.dll / cublas64_12.dll / 缺少某个 DLL", "你下的是 CUDA 版，但没装对应的 CUDA 12.x / cuDNN 9.x，或者没有加入 PATH。先换 OpenCL 版跑通；要用 CUDA 就从 NVIDIA 官网装这两样，把它们的 bin 目录加进系统环境变量 PATH，然后重开终端。不要从陌生网站单独下载 dll。"],
      ["CUDA 版能跑，但 transformer 模型很慢", "检查你下的是不是 cudnn8.9.7 的包。官方说 cuDNN 8.9.7 跑 transformer 会慢很多，换成 cudnn9.8.0 的包。RTX 20 系列用 v1.18.2 还能再快 50% 以上。GTX 16 系列没有张量核心，可以在配置里试 useFP16 = false。"],
      ["No OpenCL devices found / CL_PLATFORM_NOT_FOUND", "系统没找到能用的 OpenCL 设备。去显卡厂商官网更新驱动后重启。Linux 上如果看到 Mesa 字样，官方说 Mesa 的 OpenCL 驱动有问题，要换驱动。实在不行改用 Eigen（CPU）版。"],
      ["Could not create file（调优时）", "KataGo 没有在当前文件夹写文件的权限，比如放在了 C:\\Program Files。把整个文件夹搬到 D:\\katago 之类的位置。"],
      ["Could not open file / 找不到模型", "-model 后面的路径不对。模型名很长容易打错，建议直接把文件拖进终端。路径有空格时要用英文双引号括起来。"],
      ["Illegal instruction / 程序一启动就崩溃（CPU 版）", "CPU 太老，不支持 AVX2。换成不带 avx2 的 eigen 版本。"],
      ["No suitable fusermount binary found（Linux）", "（实测出现）Linux 版是 AppImage，缺少 FUSE 时会打印这行，实测程序仍能运行。想去掉它就安装 fuse / libfuse2。真的运行不了时，可以按官方 Compiling.md 从源码编译：cmake . -DUSE_BACKEND=EIGEN -DUSE_AVX2=1 && make -j 4。"],
      ["界面一直显示“加载中”", "官方 FAQ：要么配置或路径有错（界面没显示错误信息），要么是第一次运行在调优。到终端里用相同命令运行 benchmark 就能看清楚。"],
      ["速度极慢，每秒只有个位数", "先跑 benchmark 确认。笔记本有核显和独显时，可能用了核显（OpenCL 配置里改 openclDeviceToUseThread0）。只有 CPU 时换 b18 模型（第 4 课实测最快）。笔记本要插电，用高性能模式。"],
    ],
    quiz: [
      { q: "报错 Model version: 17 + requires a newer KataGo version，应该？", o: ["重新下载模型", "升级 KataGo 到 v1.18", "改配置文件"], a: 1, e: "模型没问题，是引擎太老。" },
      { q: "CPU 版一启动就报 Illegal instruction？", o: ["换不带 avx2 的版本", "装显卡驱动", "换模型"], a: 0, e: "老 CPU 不支持 AVX2 指令。" },
    ],
    videos: [yt("KataGo OpenCL error", "KataGo OpenCL error fix"), yt("KataGo CUDA cudnn 安装", "KataGo CUDA cuDNN 安装 教程")],
  },
  {
    id: "k8", track: "kata", level: 3, title: "用 Python 调用分析引擎（实测）",
    lead: "analysis 模式：你发一行 JSON 问题，它回一行 JSON 答案。适合批量分析自己的棋谱。下面的代码在本环境实际运行过。",
    body: `
<h2>启动方式</h2>
<pre><code>katago analysis -model models/你的模型.bin.gz -config analysis_example.cfg</code></pre>
<p>结果从标准输出（stdout）一行一行出来，日志走另一个通道（stderr），不会混在一起。</p>
<h2>analysis_example.cfg 里要知道的三项</h2>
<div class="tbl"><table>
<tr><th>配置</th><th>默认值（实测文件）</th><th>意思</th></tr>
<tr><td><code>reportAnalysisWinratesAs</code></td><td><code>BLACK</code></td><td>胜率和目数都从<b>黑方</b>角度报告。0.7 = 黑胜率 70%</td></tr>
<tr><td><code>numAnalysisThreads</code></td><td>2</td><td>同时分析几个局面</td></tr>
<tr><td><code>numSearchThreadsPerAnalysisThread</code></td><td>16</td><td>每个局面用几个线程。CPU 版改成核数，例如 4</td></tr>
</table></div>
<h2>完整代码</h2>
<pre><code>import json, subprocess, time

KATAGO = r"D:\\katago\\katago.exe"          # Mac/Linux: "/Users/你/katago/katago"
MODEL  = r"D:\\katago\\models\\kata1-b18c384nbt-s9996604416-d4316597426.bin.gz"
CFG    = r"D:\\katago\\analysis_example.cfg"

t0 = time.time()
p = subprocess.Popen([KATAGO, "analysis", "-model", MODEL, "-config", CFG,
                      "-override-config", "numSearchThreadsPerAnalysisThread=4,numAnalysisThreads=1"],
                     stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.DEVNULL, text=True)

query = {"id": "q1", "moves": [["B", "Q16"], ["W", "D4"], ["B", "Q3"]],
         "rules": "chinese", "komi": 7.5, "boardXSize": 19, "boardYSize": 19,
         "analyzeTurns": [3], "maxVisits": 50}
p.stdin.write(json.dumps(query) + "\\n"); p.stdin.flush()

for line in p.stdout:                         # 每一行 = 一个局面的结果
    if line.startswith("{"):                   # 跳过不是 JSON 的行（实测 Linux 版会多打印一行警告）
        result = json.loads(line); break
print(f"用时 {time.time()-t0:.1f} 秒（含加载模型）")
print("当前局面（黑方视角）：黑胜率 %.1f%%，黑领先 %+.1f 目"
      % (result["rootInfo"]["winrate"]*100, result["rootInfo"]["scoreLead"]))
for m in result["moveInfos"][:5]:
    print(m["move"], f"胜率 {m['winrate']:.1%}", f"领先 {m['scoreLead']:+.1f} 目",
          m["visits"], "次", "后续:", " ".join(m["pv"][:5]))
p.terminate()</code></pre>
<h2>实测输出</h2>
<pre><code>用时 7.7 秒（含加载模型）
当前局面（黑方视角）：黑胜率 36.7%，黑领先 -1.0 目
D16 胜率 36.5% 领先 -1.0 目 25 次 后续: D16 C3 D3 C4 D5
D17 胜率 38.4% 领先 -0.8 目 11 次 后续: D17 C15 E16 F3 R17
C16 胜率 38.7% 领先 -0.9 目 12 次 后续: C16 E17 R5 P4 R17
C17 胜率 40.6% 领先 -0.7 目 3 次 后续: C17 C3 C4
E16 胜率 41.2% 领先 -0.5 目 1 次 后续: E16</code></pre>
<div class="note"><b>实测踩坑</b>：第一次运行时报错 <code>JSONDecodeError: Expecting value</code>。原因是 Linux 版（AppImage）把 “No suitable fusermount binary found” 这行警告打印到了标准输出，Python 读到的第一行不是 JSON。上面的代码已经改成“只读以 { 开头的行”，在所有系统上都适用。</div>
<p>怎么读：白棋的首选是 D16，只算了 50 次，所以后几个候选点的次数很少，参考价值低。让它算 500 次以上，结果会稳定得多。第 3 手之后轮到白棋下，列表是白棋的候选点，但胜率和目数是黑方视角（因为 <code>reportAnalysisWinratesAs = BLACK</code>）。所以对白棋来说，<b>黑胜率越低的点越好</b>。</p>`,
    widget: "annot",
    annot: [
      ["", "{\"id\": \"q1\",", "请求编号，回答里会带回同一个 id。"],
      ["", " \"moves\": [[\"B\",\"Q16\"],[\"W\",\"D4\"],[\"B\",\"Q3\"]],", "到目前为止的着法。坐标 A–T 跳过 I，行从下往上。"],
      ["", " \"rules\": \"chinese\", \"komi\": 7.5,", "规则和贴目。"],
      ["", " \"analyzeTurns\": [3], \"maxVisits\": 50}", "分析第 3 手之后的局面，每个局面算 50 次。[0,1,2,3] 会返回 4 行结果，每手一行。"],
      ["add", "→ \"rootInfo\": {\"winrate\": ..., \"scoreLead\": ...}", "整个局面的评估（黑方视角）。"],
      ["add", "→ \"moveInfos\": [{\"move\", \"winrate\", \"scoreLead\", \"visits\", \"pv\"}, ...]", "候选点列表，按推荐顺序排列。pv 是预计的后续变化。visits 越多，评估越可靠。"],
    ],
    extra: `
<h2>让 Claude Code 帮你扩展成复盘工具</h2>
<pre><code>基于上面的 KataGo analysis 代码写一个 Python 脚本：
1. 用 sgfmill 读取 games 文件夹里所有 .sgf 棋谱
2. 一次请求里用 analyzeTurns 分析全部手数
3. 找出我（黑棋）scoreLead 下降超过 3 目的“恶手”
4. 输出表格：第几手、我下的位置、KataGo 首选、损失几目
5. 每一步加中文注释，并先用一盘 20 手的短棋谱测试</code></pre>`,
    quiz: [
      { q: "analysis_example.cfg 默认 reportAnalysisWinratesAs = BLACK，轮到白下时 winrate=0.3 表示？", o: ["白胜率 30%", "黑胜率 30%，也就是白约 70%", "无意义"], a: 1, e: "一律是黑方视角。" },
      { q: "CPU 上运行 analysis，numSearchThreadsPerAnalysisThread 应改成？", o: ["保持 16", "大约等于 CPU 核数", "1000"], a: 1, e: "线程数远超核数只会变慢。" },
    ],
    videos: [yt("KataGo analysis engine", "KataGo analysis engine python json"), yt("Python subprocess", "Python subprocess tutorial")],
  },
  {
    id: "k9", track: "kata", level: 3, title: "人类风格陪练（Human SL，实测）与进阶",
    lead: "普通 KataGo 太强。Human SL 模型从大量人类棋谱中学会了“某个段位的人会怎么下”，可以当陪练。",
    body: `
<h2>下载人类模型</h2>
<pre><code>curl -L -O https://media.katagotraining.org/uploaded/networks/models_extra/b18c384nbt-humanv0.bin.gz</code></pre>
<p>实测大小约 94 MB。它<b>不能单独使用</b>，要和一个普通模型一起加载。</p>
<h2>启动（KataGo 自带示例配置 gtp_human5k_example.cfg）</h2>
<pre><code>katago gtp -model models/普通模型.bin.gz -human-model models/b18c384nbt-humanv0.bin.gz -config gtp_human5k_example.cfg</code></pre>
<h2>调整模仿的水平：humanSLProfile</h2>
<p>打开 <code>gtp_human5k_example.cfg</code>，第 72 行是 <code>humanSLProfile = preaz_5k</code>。可选值（来自文件里的说明）：</p>
<div class="tbl"><table>
<tr><th>写法</th><th>意思</th></tr>
<tr><td><code>preaz_5k</code>（20k–9d）</td><td>模仿 AlphaZero 之前（AI 改变布局之前）的这个段位的人</td></tr>
<tr><td><code>rank_3d</code>（20k–9d）</td><td>模仿 AI 时代之后这个段位的人</td></tr>
<tr><td><code>rank_5k_1d</code></td><td>黑棋按 5 级、白棋按 1 段来模仿</td></tr>
<tr><td><code>proyear_1990</code>（1800–2023）</td><td>模仿某一年的职业棋手或院生</td></tr>
</table></div>
<p>同一个文件里默认 <code>maxVisits = 40</code>、<code>numSearchThreads = 1</code>，因为模仿人类不需要深算，CPU 也能流畅运行。另一个示例 <code>gtp_human9d_search_example.cfg</code> 是“人类风格 + 强力搜索”。</p>
<h2>实测记录</h2>
<pre><code>$ katago gtp -model models/kata1-b18c384nbt-s9996604416-d4316597426.bin.gz \
      -human-model models/b18c384nbt-humanv0.bin.gz -config gtp_human5k_example.cfg
KataGo v1.18.1
Using Japanese rules initially, unless GTP/GUI overrides this
Loaded model models/kata1-b18c384nbt-s9996604416-d4316597426.bin.gz
Loaded human SL model models/b18c384nbt-humanv0.bin.gz
Human SL model name: b18c384nbt-humanv0
GTP ready, beginning main protocol loop
play B Q16     →  =
genmove W      →  = D4
genmove B      →  = Q3
genmove W      →  = D17
genmove B      →  = R9     ← 业余棋手常见的边上拆边，正常模式的 KataGo 在这个阶段很少这样下
（4 手共用时 74 秒：这份配置故意让它像人一样“思考”几秒再落子，见 delayMoveScale / delayMoveMax）</code></pre>

<h2>进阶</h2>
<ul>
<li><b>NVIDIA 提速</b>：OpenCL 跑通后换 CUDA（cudnn9.8）或 TensorRT 10.16 + CUDA 13，各跑一次 benchmark 对比。新旧版本放在不同文件夹，出问题随时切回去。TensorRT 每次启动要多花些时间构建。</li>
<li><b>跟上新模型</b>：每隔几周看一次 networks 页面，下载新的 “Strongest confidently-rated”，旧模型留着对比。</li>
<li><b>9 路专用</b>：extra networks 页面有 9 路微调模型 <code>kata9x9-b18c384nbt-20231025.bin.gz</code>，下 9 路棋时更强。</li>
<li><b>贡献算力</b>：有好显卡的话，可以用 <code>contribute_example.cfg</code> 帮 KataGo 继续训练（在 katagotraining.org 注册账号）。</li>
<li><b>做成作品</b>：把部署过程录成视频“零基础在笔记本上部署 2026 年最强开源围棋 AI”；把第 8 课的复盘脚本放进 GitHub 仓库。模型文件太大，不要提交进仓库。</li>
</ul>`,
    quiz: [
      { q: "想让 KataGo 模仿 AI 时代的 3 段棋手，humanSLProfile 写？", o: ["preaz_3d", "rank_3d", "proyear_3d"], a: 1, e: "rank_ 是 AI 时代之后，preaz_ 是之前。" },
      { q: "b18c384nbt-humanv0 能单独使用吗？", o: ["能", "不能，要用 -human-model 和普通模型一起加载"], a: 1, e: "普通模型负责判断，人类模型负责“像人”。" },
    ],
    videos: [yt("KataGo human SL", "KataGo human SL network humanlike play"), yt("KaTrain human style", "KaTrain human-like AI play"), yt("AlphaGo 纪录片", "AlphaGo The Movie full documentary")],
  },
);
