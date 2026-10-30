// 实战路线：在自己电脑上部署 KataGo
TRACKS.push({ id: "kata", name: "实战：本地部署 KataGo", desc: "在自己电脑上装好最新的 KataGo 模型：选版本、下模型、测速、接界面、排错，再用 Python 调用它。" });

LESSONS.push(
  {
    id: "k1", track: "kata", level: 1, title: "KataGo 三件套，先看你的电脑配置",
    lead: "本地部署 KataGo 要准备三样东西：引擎程序、神经网络模型、图形界面。显卡决定下载哪个版本。",
    body: `
<h2>三件套</h2>
<div class="tbl"><table>
<tr><th>东西</th><th>是什么</th><th>从哪里来</th></tr>
<tr><td><b>引擎</b>（katago.exe / katago）</td><td>负责计算的程序，没有界面，在终端里运行</td><td>GitHub：<code>lightvector/KataGo</code> → Releases</td></tr>
<tr><td><b>模型</b>（<code>.bin.gz</code> 文件）</td><td>训练好的神经网络，就是 KataGo 的“棋力”。项目一直在训练，会不断发布新模型</td><td><code>katagotraining.org</code> → Networks</td></tr>
<tr><td><b>界面</b>（Sabaki / KaTrain / LizzieYzy）</td><td>画棋盘、显示胜率和推荐点，在后台调用引擎</td><td>各自的官网或 GitHub</td></tr>
</table></div>
<p>引擎和模型是分开的。以后出了新模型，只需要换掉那个 <code>.bin.gz</code> 文件，引擎不用重新装。</p>
<h2>查看你的显卡</h2>
<ul>
<li><b>Windows</b>：<kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>Esc</kbd> 打开任务管理器 → 性能 → 往下找“GPU”，看名字（如 NVIDIA GeForce RTX 4060、AMD Radeon、Intel UHD）。</li>
<li><b>Mac</b>：左上角苹果菜单 → 关于本机，看“芯片”是 Apple M 系列还是 Intel。</li>
<li>有 NVIDIA 显卡的话，在终端输入 <code>nvidia-smi</code>，能看到显卡型号和驱动版本。</li>
</ul>
<h2>后端是什么</h2>
<p>同一个 KataGo 有好几个版本，区别是用什么方式调用显卡，这叫<b>后端</b>（backend）：</p>
<div class="tbl"><table>
<tr><th>后端</th><th>适合</th><th>特点</th></tr>
<tr><td>OpenCL</td><td>几乎所有显卡：NVIDIA、AMD、Intel 核显</td><td><b>新手首选</b>。不用额外装东西，第一次运行会自动调优几分钟</td></tr>
<tr><td>CUDA</td><td>NVIDIA</td><td>比 OpenCL 快一些，但要另外装对应版本的 CUDA 和 cuDNN</td></tr>
<tr><td>TensorRT</td><td>NVIDIA（较新的显卡）</td><td>最快，安装最麻烦，熟练以后再试</td></tr>
<tr><td>Eigen（CPU）</td><td>没有独立显卡</td><td>只用 CPU，慢很多，配小模型也能用来复盘</td></tr>
<tr><td>Metal / Homebrew</td><td>Mac</td><td>Mac 用户最简单的是 KaTrain 自带的 KataGo，或用 Homebrew 安装</td></tr>
</table></div>
<p>在下面选你的电脑，看推荐方案。</p>`,
    widget: "kataWizard",
    quiz: [
      { q: "KataGo 出了更强的新模型，你要做什么？", o: ["卸载重装整个 KataGo", "下载新的 .bin.gz 模型文件，在命令里换成新文件名", "重装界面软件"], a: 1, e: "引擎和模型是分开的，换模型文件就行。" },
      { q: "笔记本只有 Intel 核显，新手应该选哪个后端？", o: ["CUDA", "TensorRT", "OpenCL", "必须买显卡"], a: 2, e: "OpenCL 支持 Intel 核显；如果运行有问题再退回 Eigen（CPU）。" },
    ],
    videos: [yt("KataGo 是什么", "KataGo 介绍 围棋AI"), yt("KataGo setup overview", "KataGo setup tutorial"), yt("查看电脑显卡型号", "怎么看 电脑 显卡 型号")],
  },
  {
    id: "k2", track: "kata", level: 1, title: "下载 KataGo 引擎并第一次运行",
    lead: "去 GitHub Releases 下载对应你系统和后端的压缩包，解压，然后在终端里让它报一下版本号。",
    body: `
<h2>Windows</h2>
<ol>
<li>打开 <code>github.com/lightvector/KataGo/releases</code>。最上面带 <b>Latest</b> 标签的就是最新版本。</li>
<li>在 <b>Assets</b> 里找名字同时包含 <code>windows</code> 和你选的后端的 zip，例如带 <code>opencl</code> 和 <code>windows-x64</code> 的那个。CUDA 版的文件名里会写明需要的 CUDA / cuDNN 版本。</li>
<li>新建文件夹 <code>D:\\katago</code>（路径里不要有中文和空格），把 zip 解压到这里。</li>
<li>打开这个文件夹，在地址栏输入 <code>cmd</code> 回车，就会在这个文件夹里打开终端。</li>
<li>输入下面这行并回车：</li>
</ol>
<pre><code>katago.exe version</code></pre>
<p>能显示版本号，说明程序能运行了。解压出来的文件夹里还有几个 <code>.cfg</code> 文件（如 <code>default_gtp.cfg</code>、<code>analysis_example.cfg</code>），这些是配置文件，后面会用到。</p>
<h2>Mac</h2>
<p>最省事的两种做法，二选一：</p>
<ul>
<li><b>KaTrain</b>：下载 KaTrain 的 Mac 版，里面已经带了 KataGo 和一个模型，装好就能用。之后想换最新模型，在 KaTrain 设置里指定新模型路径就行。</li>
<li><b>Homebrew</b>（先在 <code>brew.sh</code> 装好 Homebrew）：</li>
</ul>
<pre><code>brew install katago
katago version
brew info katago      # 查看安装位置和附带的文件</code></pre>
<h2>Linux</h2>
<pre><code>cd ~/katago
unzip katago-*-linux-x64.zip    # 文件名以实际下载的为准
chmod +x katago                  # 给程序加上可执行权限
./katago version</code></pre>
<div class="note">杀毒软件偶尔会误报 katago.exe。只从 <code>github.com/lightvector/KataGo</code> 下载，可以放心添加信任。别处“打包好的中文版”不要用。</div>`,
    quiz: [
      { q: "在 Windows 文件夹地址栏输入 cmd 回车，会怎样？", o: ["打开浏览器", "在当前文件夹打开命令行", "删除文件夹"], a: 1, e: "这是在某个文件夹打开终端最快的方法。" },
      { q: "Linux 下运行 ./katago 提示 Permission denied，怎么办？", o: ["重新下载", "chmod +x katago 加上执行权限", "用 sudo 删掉它"], a: 1, e: "解压后的文件有时没有执行权限。" },
    ],
    videos: [yt("KataGo Windows 安装", "KataGo Windows 安装 教程"), yt("How to install KataGo", "how to install KataGo windows OpenCL"), yt("GitHub Releases 怎么下载", "GitHub releases download tutorial")],
  },
  {
    id: "k3", track: "kata", level: 1, title: "下载最新的神经网络模型",
    lead: "模型决定棋力。最新最强的是大模型，但显卡一般的话，中等模型更快、更实用。",
    body: `
<h2>去哪下载</h2>
<ol>
<li>打开 <code>katagotraining.org</code> → <b>Networks</b>。</li>
<li>页面列出所有模型，带有发布时间和 Elo 评分。上方会标出当前最强、评分已经稳定的那个。</li>
<li>点模型名下载，得到一个 <code>kata1-b28c512nbt-s….bin.gz</code> 这样的文件。<b>不要解压 .gz</b>，KataGo 直接读它。</li>
<li>放进 <code>D:\\katago\\models\\</code>（Mac / Linux：<code>~/katago/models/</code>）。</li>
</ol>
<h2>看懂模型名字</h2>
<div class="tbl"><table>
<tr><th>名字片段</th><th>意思</th></tr>
<tr><td><code>kata1</code></td><td>KataGo 公开分布式训练的第一个大项目</td></tr>
<tr><td><code>b28c512</code></td><td>28 个残差块、512 个通道，也就是网络的大小。越大越强也越慢</td></tr>
<tr><td><code>b18c384</code></td><td>中等大小，速度快很多，棋力仍然远超职业棋手</td></tr>
<tr><td><code>nbt</code></td><td>网络结构的一种（嵌套瓶颈），新模型基本都是这种</td></tr>
<tr><td><code>s1234567890</code></td><td>训练到的样本数，越大越新</td></tr>
<tr><td><code>d…</code></td><td>训练数据的编号</td></tr>
</table></div>
<h2>选哪个</h2>
<ul>
<li><b>RTX 3060 及以上</b>：直接用最新的 b28 大模型。</li>
<li><b>入门独显、核显、Mac M1/M2 基础款</b>：用最新的 b18 模型，复盘时每秒计算量更高，体验更流畅。</li>
<li><b>只有 CPU</b>：b18 或更小的模型。</li>
<li><b>想要“像人一样下”</b>：KataGo 还发布了用人类棋谱训练的 <b>Human SL 模型</b>（名字里带 <code>human</code>），可以模拟不同段位的人类棋风，适合陪练。它和普通模型配合使用，在后面配置那一课说明。</li>
</ul>
<div class="note">大模型文件有几百 MB。下载中断可以重新点链接，浏览器一般支持续传。下完后对比一下文件大小和网页上写的是否一致。</div>`,
    quiz: [
      { q: "下载的模型是 xxx.bin.gz，接下来？", o: ["先解压成 .bin", "不解压，直接在命令里指定这个 .gz 文件", "改名成 .exe"], a: 1, e: "KataGo 直接读取 .bin.gz。" },
      { q: "b18c384 和 b28c512 相比？", o: ["b18 更大更强", "b18 更小更快，棋力稍弱但依然很强", "两者完全一样"], a: 1, e: "b 是块数，c 是通道数，越大越强越慢。" },
    ],
    videos: [yt("KataGo networks explained", "KataGo network b18 b28 which to use"), yt("KataGo 权重 下载", "KataGo 权重 模型 下载 选择")],
  },
  {
    id: "k4", track: "kata", level: 2, title: "生成配置、测速、调优",
    lead: "两条命令：genconfig 问你几个问题后生成一份适合你电脑的配置，benchmark 测出最合适的线程数。",
    body: `
<h2>第一步：测速</h2>
<p>在 KataGo 文件夹打开终端，运行（模型文件名换成你的）：</p>
<pre><code>katago.exe benchmark -model models\\你的模型.bin.gz -config default_gtp.cfg</code></pre>
<ul>
<li>OpenCL 版第一次运行会先<b>自动调优</b>（tuning），可能要好几分钟，屏幕上一直在刷数字是正常的。调优结果会保存，之后不会再调。</li>
<li>结束时会给出一张表，列出不同 <code>numSearchThreads</code>（搜索线程数）下每秒的访问数 visits/s，并推荐一个数值。</li>
</ul>
<h2>第二步：生成你的配置</h2>
<pre><code>katago.exe genconfig -model models\\你的模型.bin.gz -output my_gtp.cfg</code></pre>
<p>它会一步步问你：用什么规则（中国规则选 chinese）、是否允许认输、每步想多久、显卡用几块、内存多少等。看不懂的问题直接回车，用默认值。最后它会自己跑一次测速，把结果写进 <code>my_gtp.cfg</code>。</p>
<h2>第三步：试一下能不能下棋</h2>
<pre><code>katago.exe gtp -model models\\你的模型.bin.gz -config my_gtp.cfg</code></pre>
<p>等它显示 <code>GTP ready</code> 后，输入下面几行（每行回车）：</p>
<pre><code>boardsize 19
play B Q16
genmove W
showboard
quit</code></pre>
<p><code>genmove W</code> 让 KataGo 替白棋走一步，返回一个坐标，就说明部署成功。GTP 是围棋程序之间通用的“对话协议”，界面软件就是用这种命令和 KataGo 交流的。</p>
<h2>配置文件里值得改的几项</h2>
<p>用 VS Code 打开 <code>.cfg</code> 文件。<code>#</code> 开头的是注释。点击下面每一行看解释：</p>`,
    widget: "annot",
    annot: [
      ["", "# 这是一份 GTP 配置的节选", "# 开头是注释，程序会忽略。KataGo 的配置文件里注释写得很详细，看不懂可以整段复制给 AI 解释。"],
      ["", "numSearchThreads = 16", "搜索线程数。填 benchmark 推荐的数字。太大或太小都会变慢。"],
      ["", "maxVisits = 1000", "每步最多计算多少次。越大越强越慢。对弈时可以调小，复盘分析时界面通常会持续计算，不受影响。"],
      ["", "maxTime = 10", "每步最多想几秒。和 maxVisits 谁先到就停。"],
      ["", "ponderingEnabled = false", "对手思考时自己是否也继续算（后台思考）。开了更强，但显卡一直满负荷，笔记本会发热。"],
      ["", "rules = chinese", "规则。中国规则 chinese，日韩规则 japanese / korean。影响数目和贴目。"],
      ["", "allowResignation = true", "是否允许认输。陪练时可以改成 false，让它下到最后。"],
      ["", "# humanSLProfile = rank_5k", "使用 Human SL 人类风格模型时，用这一项设定模拟哪个水平（如 rank_5k 表示 5 级、rank_3d 表示 3 段）。需要同时用 -human-model 参数加载人类模型。具体可选值见 KataGo 自带配置文件里的说明。"],
      ["", "nnCacheSizePowerOfTwo = 20", "神经网络结果缓存大小（2 的 20 次方条）。内存小的电脑可以调小到 18。"],
      ["", "openclDeviceToUseThread0 = 0", "有多块显卡（比如核显 + 独显）时，指定用第几块。运行时日志会列出所有设备编号，选独显那个。"],
    ],
    quiz: [
      { q: "OpenCL 版第一次运行，屏幕刷了好几分钟，应该？", o: ["卡死了，强制关掉", "这是自动调优，等它完成", "重装显卡驱动"], a: 1, e: "调优只在第一次运行时做。" },
      { q: "numSearchThreads 应该怎么定？", o: ["越大越好", "用 benchmark 推荐的值", "固定写 1"], a: 1, e: "benchmark 实测出你这台电脑最快的线程数。" },
      { q: "笔记本有核显和独显，KataGo 用了核显很慢，改哪项？", o: ["maxVisits", "openclDeviceToUseThread0", "rules"], a: 1, e: "改成独显的设备编号。" },
    ],
    videos: [yt("KataGo benchmark genconfig", "KataGo benchmark genconfig tutorial"), yt("GTP 协议是什么", "GTP Go Text Protocol explained")],
  },
  {
    id: "k5", track: "kata", level: 2, title: "接上图形界面：Sabaki、KaTrain、LizzieYzy",
    lead: "引擎跑通以后，选一个界面把它接上，就能对弈、看胜率曲线和推荐点了。",
    body: `
<div class="tbl"><table>
<tr><th>界面</th><th>特点</th><th>适合</th></tr>
<tr><td><b>KaTrain</b></td><td>自带 KataGo，开箱即用；会给每一步打分、指出失误；能调 AI 强度</td><td>想练棋、复盘找错的人</td></tr>
<tr><td><b>Sabaki</b></td><td>界面简洁，标准的棋谱编辑器，可以接任何 GTP 引擎</td><td>想自己配置、理解原理</td></tr>
<tr><td><b>LizzieYzy</b></td><td>中文社区常用，分析信息很全，支持多引擎</td><td>深度复盘、研究</td></tr>
</table></div>
<h2>Sabaki 接入 KataGo</h2>
<ol>
<li>从 Sabaki 的 GitHub Releases 下载安装。</li>
<li>菜单 <b>Engines → Manage Engines → Add</b>。</li>
<li><b>Path</b>：选择 <code>D:\\katago\\katago.exe</code>。</li>
<li><b>Arguments</b>（参数）：填下面这一行，路径用你自己的：</li>
</ol>
<pre><code>gtp -model D:\\katago\\models\\你的模型.bin.gz -config D:\\katago\\my_gtp.cfg</code></pre>
<ol start="5">
<li>关闭设置窗口，菜单 <b>Engines → Attach</b>，把 KataGo 设为白棋就是和它下棋；打开 <b>Analysis</b> 能看到推荐点和胜率。</li>
</ol>
<h2>KaTrain 换成最新模型</h2>
<ol>
<li>安装 KaTrain（官网或 GitHub Releases；会 Python 的也可以 <code>pip install katrain</code>）。</li>
<li>打开设置（General & Engine Settings）。</li>
<li><b>Model file path</b> 指向你下载的最新 <code>.bin.gz</code>。想用自己下载的 KataGo 程序（比如 CUDA 版），在 <b>KataGo executable path</b> 里指定。</li>
<li>保存后它会重启引擎。左下角状态正常、开始出现推荐点，就成功了。</li>
</ol>
<div class="note">界面里报“引擎启动失败”时，先回到终端，用一模一样的路径和参数手动运行一次 <code>katago gtp ...</code>。终端里会显示真正的报错原因，界面通常不显示。</div>`,
    quiz: [
      { q: "Sabaki 添加引擎时，Arguments 一栏应该填？", o: ["模型文件路径", "gtp -model 模型路径 -config 配置路径", "katago.exe"], a: 1, e: "Path 填程序，Arguments 填运行参数。" },
      { q: "界面提示引擎启动失败，最快的排查方法？", o: ["换一个界面", "在终端手动运行同样的命令，看真正的报错", "重装系统"], a: 1, e: "终端会打印详细错误。" },
    ],
    videos: [yt("Sabaki KataGo 设置", "Sabaki KataGo setup engine"), yt("KaTrain 教程", "KaTrain tutorial KataGo"), yt("LizzieYzy 安装 KataGo", "LizzieYzy KataGo 安装 教程")],
  },
  {
    id: "k6", track: "kata", level: 2, title: "常见报错排查",
    lead: "部署时遇到的问题，九成是下面这几种。点报错看原因和解决方法。",
    body: `
<h2>排查的通用顺序</h2>
<ol>
<li>在终端里手动运行，看<b>最后几行</b>报错。</li>
<li>检查路径：有没有中文、空格，文件名有没有打错（可以把文件直接拖进终端窗口，自动填入完整路径）。</li>
<li>换成最简单的组合：OpenCL 版 + b18 模型 + 自带的 <code>default_gtp.cfg</code>。这样能跑，就一项一项换回去，找出是哪一项的问题。</li>
<li>把完整报错和你的系统、显卡型号、KataGo 版本一起发给 AI。</li>
</ol>`,
    widget: "faq",
    faq: [
      ["找不到 cudnn64_8.dll / cublas64_12.dll / 缺少 DLL", "你下的是 CUDA 版，但电脑上没装对应版本的 CUDA 和 cuDNN。最简单的办法是换成 OpenCL 版；一定要用 CUDA 版的话，按 zip 文件名里写的版本号去 NVIDIA 官网装 CUDA Toolkit 和 cuDNN，并把它们的 bin 目录加到系统 PATH。"],
      ["No OpenCL devices found / CL_PLATFORM_NOT_FOUND", "系统没找到能用的 OpenCL 显卡。去显卡厂商官网（NVIDIA / AMD / Intel）下载安装最新显卡驱动，然后重启。远程桌面连接时有时也会出现这个问题。实在不行换 Eigen（CPU）版。"],
      ["Could not open file / 找不到模型文件", "-model 后面的路径不对。检查文件名（很长，容易打错）、路径里的中文和空格。路径有空格时要用英文双引号括起来：-model \"D:\\my files\\model.bin.gz\"。"],
      ["第一次运行一直刷屏不停", "这是 OpenCL 自动调优，正常现象。大模型在慢显卡上可能要十几分钟，等它结束就好。"],
      ["速度很慢，每秒只有几十次访问", "可能用了核显而不是独显（改 openclDeviceToUseThread0），或者模型太大。先跑 benchmark 看数据；换 b18 模型通常会快很多。笔记本记得插电并用高性能模式。"],
      ["Windows 提示“Windows 已保护你的电脑”", "SmartScreen 不认识这个程序。确认是从 github.com/lightvector/KataGo 下载的，点“更多信息”→“仍要运行”。"],
      ["Mac 提示“无法验证开发者”", "系统设置 → 隐私与安全性 → 往下找到“仍要打开”。用 Homebrew 安装的一般不会遇到这个问题。"],
      ["界面里 KataGo 一会儿就断开 / 崩溃", "很可能是显存或内存不够。换小一点的模型，调小 nnCacheSizePowerOfTwo，并关掉其他占用显卡的程序（游戏、浏览器里的视频）。"],
    ],
    quiz: [
      { q: "报错缺少 cudnn64_8.dll，最省事的解决方法？", o: ["去网上随便下载一个 dll", "换成 OpenCL 版 KataGo", "重装 Windows"], a: 1, e: "从陌生网站下载 dll 不安全；OpenCL 版不需要 CUDA。" },
      { q: "路径里有空格时，命令应该怎么写？", o: ["空格删掉就行", "用英文双引号把路径括起来", "空格改成下划线后不用改文件"], a: 1, e: "否则终端会把路径从空格处拆成两段。" },
    ],
    videos: [yt("KataGo OpenCL error fix", "KataGo OpenCL error fix"), yt("KataGo CUDA cudnn 安装", "KataGo CUDA cuDNN 安装 教程")],
  },
  {
    id: "k7", track: "kata", level: 3, title: "用 Python 调用 KataGo 分析引擎",
    lead: "除了 GTP，KataGo 还有一个专门给程序用的 analysis 模式：你发一个 JSON 问题，它回一个 JSON 答案。可以批量分析自己的棋谱。",
    body: `
<h2>启动分析引擎</h2>
<pre><code>katago analysis -model models/你的模型.bin.gz -config analysis_example.cfg</code></pre>
<p>启动后它等待输入。每一行输入一个 JSON 请求，它每分析完一手就输出一行 JSON 结果。日志打印在另一个通道（stderr），不会和结果混在一起。</p>
<h2>请求和回答长什么样</h2>
<p>点击每一行看解释：</p>`,
    widget: "annot",
    annot: [
      ["", "{\"id\": \"game1\",", "请求编号，自己随便起。回答里会带回同一个 id，方便对应。"],
      ["", " \"moves\": [[\"B\",\"Q16\"],[\"W\",\"D4\"],[\"B\",\"Q3\"]],", "到目前为止的着法：颜色 + 坐标。坐标列是 A~T（跳过 I），行从下往上数 1~19。"],
      ["", " \"rules\": \"chinese\", \"komi\": 7.5,", "规则和贴目。"],
      ["", " \"boardXSize\": 19, \"boardYSize\": 19,", "棋盘大小，9 路就写 9。"],
      ["", " \"analyzeTurns\": [3]}", "分析哪几手之后的局面。[0,1,2,3] 会一次分析每一手，返回 4 行结果。"],
      ["add", "→ {\"id\":\"game1\",\"turnNumber\":3,", "回答：对应 game1 第 3 手之后的局面。"],
      ["add", "   \"moveInfos\":[{\"move\":\"D16\",\"winrate\":0.47,\"scoreLead\":-0.6,\"visits\":812,\"pv\":[\"D16\",\"C3\"]}, ...],", "候选点列表：推荐的点、胜率、领先目数、计算次数、预计后续变化（pv）。第一个通常是最佳点。"],
      ["add", "   \"rootInfo\":{\"winrate\":0.47,\"scoreLead\":-0.6, ...}}", "当前局面的整体评估。胜率是从哪一方的角度计算的，看配置里 reportAnalysisWinratesAs 这一项。"],
    ],
    quiz: [
      { q: "analysis 模式和 gtp 模式的主要区别？", o: ["analysis 用 JSON，适合程序批量调用", "analysis 更强", "gtp 只能下 9 路"], a: 0, e: "GTP 给界面用，analysis 给你写的程序用。" },
      { q: "领先目数为什么比胜率更适合找“恶手”？", o: ["没区别", "局面一边倒时胜率接近 100% 变化很小，目数变化更明显", "胜率不准"], a: 1, e: "大优势时胜率饱和，看目数损失更清楚。" },
    ],
    videos: [yt("KataGo analysis engine python", "KataGo analysis engine python json"), yt("Python subprocess 教程", "Python subprocess tutorial")],
    extra: `
<h2>Python 最小例子</h2>
<pre><code>import json, subprocess

KATAGO = r"D:\\katago\\katago.exe"          # Mac/Linux 写成 /Users/你/katago/katago
MODEL  = r"D:\\katago\\models\\你的模型.bin.gz"
CFG    = r"D:\\katago\\analysis_example.cfg"

p = subprocess.Popen([KATAGO, "analysis", "-model", MODEL, "-config", CFG],
                     stdin=subprocess.PIPE, stdout=subprocess.PIPE, text=True)

query = {"id": "q1", "moves": [["B", "Q16"], ["W", "D4"], ["B", "Q3"]],
         "rules": "chinese", "komi": 7.5, "boardXSize": 19, "boardYSize": 19,
         "analyzeTurns": [3], "maxVisits": 500}
p.stdin.write(json.dumps(query) + "\\n"); p.stdin.flush()

result = json.loads(p.stdout.readline())       # 读一行结果
for m in result["moveInfos"][:5]:
    print(m["move"], f"胜率 {m['winrate']:.1%}", f"领先 {m['scoreLead']:+.1f} 目", m["visits"], "次")
p.terminate()</code></pre>
<h2>让 Claude Code 帮你扩展</h2>
<pre><code>用上面的 KataGo analysis 引擎写一个 Python 脚本：
1. 用 sgfmill 读取 games 文件夹里所有 .sgf 棋谱
2. 分析每一手，找出我（黑棋）领先目数下降超过 3 目的“恶手”
3. 输出一个表格：第几手、我下的位置、KataGo 推荐的位置、损失几目
4. 每一步加中文注释</code></pre>
<p>写好后用上一条路线的方法检查：先拿一盘你记得清楚的棋谱跑一遍，看结果和你的感觉是否一致。</p>`,
  },
  {
    id: "k8", track: "kata", level: 3, title: "进阶：TensorRT 提速、更新模型、人类风格陪练",
    lead: "能跑起来以后，可以继续做的三件事。",
    body: `
<h2>1. 换更快的后端（NVIDIA 显卡）</h2>
<ul>
<li>OpenCL 跑通后，想更快可以试 CUDA 或 TensorRT 版。按 Release 文件名里写的版本，从 NVIDIA 官网装对应的 CUDA、cuDNN（TensorRT 版还要装 TensorRT），然后对同一个模型跑 benchmark，对比 visits/s。</li>
<li>把新旧版本放在不同文件夹（如 <code>katago-opencl</code>、<code>katago-trt</code>），出问题随时切回去。</li>
<li>TensorRT 版第一次加载某个模型时也要花时间构建，属于正常现象。</li>
</ul>
<h2>2. 跟上最新模型</h2>
<ul>
<li>每隔一段时间看一次 <code>katagotraining.org</code> 的 Networks 页面。</li>
<li>下载新模型 → 放进 models 文件夹 → 把界面或命令里的模型路径改成新文件名。旧模型可以留着对比。</li>
<li>引擎程序偶尔也要更新：新模型如果用了新的网络结构，老版本 KataGo 可能读不了，这时去 Releases 下载新版本。</li>
</ul>
<h2>3. 人类风格陪练（Human SL）</h2>
<p>普通 KataGo 太强，下指导棋会让人很挫败。Human SL 模型从人类棋谱学会了“某个水平的人会怎么下”：</p>
<pre><code>katago gtp -model models/最新主模型.bin.gz -human-model models/human模型.bin.gz -config gtp_human5k_example.cfg</code></pre>
<p>KataGo 发布包里带了人类风格的示例配置，文件名以你下载的版本为准。在配置里改 <code>humanSLProfile</code> 就能调整模拟的段位。KaTrain 也支持用这类模型做陪练。</p>
<h2>4. 做成你的作品</h2>
<ul>
<li>录一期视频：“零基础在笔记本上部署世界最强围棋 AI”。整个过程就是很好的教程内容，正好接上短视频路线。</li>
<li>把 k7 的复盘脚本放到 GitHub 仓库，写清楚 README。注意：不要把模型文件（太大）和任何密钥提交上去。</li>
</ul>`,
    quiz: [
      { q: "新模型下载了，但老版本 KataGo 加载时报错，可能原因？", o: ["模型坏了", "新模型用了新的网络结构，需要更新 KataGo 程序", "要用 VPN"], a: 1, e: "引擎版本太旧时，可能读不了新结构的模型。" },
      { q: "想让 KataGo 模拟 5 级棋手陪你下，用什么？", o: ["调小 maxVisits 到 1", "Human SL 模型 + humanSLProfile", "换成 9 路"], a: 1, e: "Human SL 模型模拟的是人类的下法，比只减少计算量更自然。" },
    ],
    videos: [yt("KataGo TensorRT", "KataGo TensorRT setup speed"), yt("KataGo human SL model", "KataGo human SL network humanlike"), yt("AlphaGo 纪录片", "AlphaGo The Movie full documentary")],
  },
);
