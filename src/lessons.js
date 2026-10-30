// 课程内容。每课：id / track / level(1基础 2行家 3精通) / title / lead / body(HTML) / widget / quiz / videos
const TRACKS = [
  { id: "pc", name: "电脑基础", desc: "文件、下载安装、快捷键、命令行。把电脑从“会开机”用到“随手解决问题”。" },
  { id: "net", name: "网络与名词", desc: "IP、域名、端口、服务器、“启动服务”“加速”、VPN 和云服务器，一次讲明白。" },
  { id: "video", name: "短视频创作", desc: "定位、拍摄、剪辑、钩子、数据复盘，一条通往 1 万粉的路线。" },
  { id: "ailearn", name: "用 AI 学习", desc: "会提问，会追问，会让 AI 帮你搭物理模型、做实验。" },
  { id: "aicode", name: "AI 编程", desc: "GitHub、本地与云端、读懂 Claude Code、检查代码、本地跑 Kaggle、做围棋 AI。" },
];

const LEVELS = { 1: "基础", 2: "行家", 3: "精通" };

const yt = (t, q) => ({ t, q });

const LESSONS = [
  // ===================== 电脑基础 =====================
  {
    id: "a1", track: "pc", level: 1, title: "文件、文件夹和“路径”",
    lead: "电脑里所有东西都是文件，文件放在文件夹里。路径就是文件的“门牌号”。",
    body: `
<h2>先建立一个画面</h2>
<p>把硬盘想成一栋楼：<b>盘</b>（C 盘、D 盘）是楼，<b>文件夹</b>是房间，<b>文件</b>是房间里的东西。路径就是从大门走到这个东西的路线。</p>
<div class="tbl"><table>
<tr><th>系统</th><th>路径长这样</th><th>分隔符</th></tr>
<tr><td>Windows</td><td><code>C:\\Users\\小明\\Downloads\\setup.exe</code></td><td>反斜杠 <code>\\</code></td></tr>
<tr><td>Mac / Linux</td><td><code>/Users/xiaoming/Downloads/setup.dmg</code></td><td>斜杠 <code>/</code></td></tr>
</table></div>
<h2>三个最常用的文件夹</h2>
<ul>
<li><b>下载 Downloads</b>：浏览器下载的东西默认都在这。找不到下载的文件，先看这里。</li>
<li><b>桌面 Desktop</b>：其实也只是一个文件夹，只是显示在屏幕上。</li>
<li><b>文档 Documents</b>：适合放你自己的作业、项目。</li>
</ul>
<h2>小技巧</h2>
<ul>
<li>Windows：在资源管理器顶部地址栏点一下，就能看到并复制完整路径。</li>
<li>Mac：在访达里选中文件，按 <kbd>Option</kbd>+<kbd>Cmd</kbd>+<kbd>C</kbd> 复制路径。</li>
<li>给文件夹起名尽量用<b>英文、不带空格</b>（比如 <code>my-project</code>），以后编程时会少很多麻烦。</li>
</ul>
<p>下面这个小练习：点文件夹往里走，看看路径怎么变。</p>`,
    widget: "pathTree",
    quiz: [
      { q: "你在浏览器里下载了一个安装包，最可能在哪里找到它？", o: ["回收站", "下载 (Downloads) 文件夹", "C:\\Windows", "桌面上一定有"], a: 1, e: "浏览器默认把文件存进“下载”文件夹，除非你改过设置。" },
      { q: "下面哪个是 Mac 的路径写法？", o: ["C:\\Users\\me", "/Users/me/Documents", "D:/我的文档", "\\\\server\\share"], a: 1, e: "Mac 和 Linux 从根目录 / 开始，用斜杠分隔。" },
    ],
    videos: [yt("文件和文件夹管理入门", "电脑小白 文件 文件夹 管理 教程"), yt("Windows 资源管理器使用", "Windows 11 File Explorer beginner tutorial"), yt("Mac 访达 Finder 入门", "Mac Finder 新手 教程")],
  },
  {
    id: "a2", track: "pc", level: 1, title: "下载安装应用商店之外的软件",
    lead: "最重要的一条：只去官网或官方 GitHub 下载。其他的都是在给自己找麻烦。",
    body: `
<h2>四步法（以 VS Code 为例）</h2>
<ol>
<li><b>搜官网</b>：搜索“VS Code 官网”，认准域名 <code>code.visualstudio.com</code>。搜索结果里标着“广告”的、“XX 下载站”“高速下载”“绿色版”的，一律跳过。</li>
<li><b>选对版本</b>：看你的系统。Windows 选 <code>.exe</code> 或 <code>.msi</code>；Mac 选 <code>.dmg</code>，并分清 Apple 芯片（M1/M2/M3/M4）还是 Intel 芯片。</li>
<li><b>运行安装包</b>：去“下载”文件夹双击它。</li>
<li><b>处理安全提示</b>（见下表）。</li>
</ol>
<div class="tbl"><table>
<tr><th>你看到的提示</th><th>什么意思</th><th>怎么做</th></tr>
<tr><td>Windows：“Windows 已保护你的电脑”</td><td>SmartScreen 不认识这个程序</td><td>确认是官网下的 → 点“更多信息”→“仍要运行”</td></tr>
<tr><td>Windows：“是否允许此应用对你的设备进行更改？”</td><td>安装要管理员权限</td><td>来源可靠就点“是”</td></tr>
<tr><td>Mac：“无法打开，因为无法验证开发者”</td><td>不是 App Store 的软件</td><td>系统设置 → 隐私与安全性 → 往下找到“仍要打开”</td></tr>
<tr><td>Mac：dmg 打开后是个窗口</td><td>这就是安装界面</td><td>把图标拖进 Applications 文件夹</td></tr>
</table></div>
<h2>安装时的坑</h2>
<ul>
<li>一路“下一步”之前，看清有没有<b>默认勾选</b>的“顺便安装 XX 浏览器/管家”，取消勾选。</li>
<li>安装位置一般默认就好。C 盘很小的话可以改到 D 盘，但路径里别带中文。</li>
<li>卸载：Windows 在“设置 → 应用”；Mac 把应用从“应用程序”拖进废纸篓。</li>
</ul>
<div class="note">程序员常用软件（Python、Git、Node.js、VS Code）全部有官网，都是免费的。要你付费的“破解版”“绿色版”，大概率带病毒。</div>`,
    widget: "fakeSearch",
    quiz: [
      { q: "你要下载 Python，哪个网址是官方的？", o: ["python-download.cn", "www.python.org", "pc.qq.com/python", "python 高速下载器"], a: 1, e: "Python 官方网站是 python.org。" },
      { q: "Mac 上下载了 .dmg，双击后弹出一个窗口，下一步是？", o: ["直接在窗口里双击图标运行", "把应用图标拖进 Applications 文件夹", "删掉 dmg 重新下载", "重启电脑"], a: 1, e: "拖进 Applications 才算装好；之后 dmg 可以推出并删除。" },
      { q: "安装向导里出现一个默认打勾的“同时安装XX安全管家”，怎么办？", o: ["必须装，不然装不了", "取消勾选再继续", "关掉安装程序"], a: 1, e: "这类捆绑软件可以取消，不影响主程序。" },
    ],
    videos: [yt("如何安全下载安装软件", "如何 安全 下载 安装 软件 官网 小白"), yt("Mac 安装非 App Store 软件", "Mac install apps outside App Store dmg"), yt("Windows SmartScreen 是什么", "Windows SmartScreen run anyway explained")],
  },
  {
    id: "a3", track: "pc", level: 1, title: "十个快捷键，省一半时间",
    lead: "会用快捷键的人，看起来就像“会电脑”的人。先练这十个。",
    body: `
<div class="tbl"><table>
<tr><th>功能</th><th>Windows</th><th>Mac</th></tr>
<tr><td>复制 / 粘贴 / 剪切</td><td><kbd>Ctrl</kbd>+<kbd>C</kbd> / <kbd>V</kbd> / <kbd>X</kbd></td><td><kbd>Cmd</kbd>+<kbd>C</kbd> / <kbd>V</kbd> / <kbd>X</kbd></td></tr>
<tr><td>撤销 / 重做</td><td><kbd>Ctrl</kbd>+<kbd>Z</kbd> / <kbd>Ctrl</kbd>+<kbd>Y</kbd></td><td><kbd>Cmd</kbd>+<kbd>Z</kbd> / <kbd>Cmd</kbd>+<kbd>Shift</kbd>+<kbd>Z</kbd></td></tr>
<tr><td>全选</td><td><kbd>Ctrl</kbd>+<kbd>A</kbd></td><td><kbd>Cmd</kbd>+<kbd>A</kbd></td></tr>
<tr><td>保存</td><td><kbd>Ctrl</kbd>+<kbd>S</kbd></td><td><kbd>Cmd</kbd>+<kbd>S</kbd></td></tr>
<tr><td>页面内查找</td><td><kbd>Ctrl</kbd>+<kbd>F</kbd></td><td><kbd>Cmd</kbd>+<kbd>F</kbd></td></tr>
<tr><td>切换窗口</td><td><kbd>Alt</kbd>+<kbd>Tab</kbd></td><td><kbd>Cmd</kbd>+<kbd>Tab</kbd></td></tr>
<tr><td>截图</td><td><kbd>Win</kbd>+<kbd>Shift</kbd>+<kbd>S</kbd></td><td><kbd>Cmd</kbd>+<kbd>Shift</kbd>+<kbd>4</kbd></td></tr>
<tr><td>搜索并打开程序</td><td><kbd>Win</kbd> 然后打字</td><td><kbd>Cmd</kbd>+<kbd>空格</kbd> 然后打字</td></tr>
<tr><td>强制退出卡死程序</td><td><kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>Esc</kbd>（任务管理器）</td><td><kbd>Cmd</kbd>+<kbd>Option</kbd>+<kbd>Esc</kbd></td></tr>
</table></div>
<p>下面的练习区会检测你按下的组合键。先点一下练习框，再按提示按键。</p>`,
    widget: "keys",
    quiz: [
      { q: "程序卡死了点什么都没反应，Windows 上应该按？", o: ["Ctrl+Z", "Ctrl+Shift+Esc 打开任务管理器结束它", "一直点关闭按钮", "拔电源"], a: 1, e: "任务管理器里选中程序 → 结束任务。拔电源是最后手段。" },
      { q: "Mac 上最快打开任何程序的方法？", o: ["去 Launchpad 一页页翻", "Cmd+空格 打开聚焦搜索，输入名字回车", "重启"], a: 1, e: "Spotlight 聚焦搜索，输入前几个字母就行。" },
    ],
    videos: [yt("常用快捷键大全", "电脑 常用 快捷键 新手 必学"), yt("Mac keyboard shortcuts for beginners", "Mac keyboard shortcuts beginners")],
  },
  {
    id: "a4", track: "pc", level: 2, title: "扩展名、压缩包与文件格式",
    lead: "文件名最后一个点后面的部分（扩展名）决定了用什么程序打开它。",
    body: `
<h2>先让扩展名显示出来</h2>
<ul>
<li>Windows 11：资源管理器 → 查看 → 显示 → 勾选“文件扩展名”。</li>
<li>Mac：访达 → 设置 → 高级 → 勾选“显示所有文件扩展名”。</li>
</ul>
<div class="tbl"><table>
<tr><th>扩展名</th><th>是什么</th><th>用什么打开</th></tr>
<tr><td><code>.exe .msi</code></td><td>Windows 程序 / 安装包</td><td>双击运行</td></tr>
<tr><td><code>.dmg .pkg</code></td><td>Mac 安装包</td><td>双击</td></tr>
<tr><td><code>.zip .rar .7z</code></td><td>压缩包，里面装着很多文件</td><td>右键 → 全部解压；Windows 用 7-Zip，Mac 用 The Unarchiver</td></tr>
<tr><td><code>.mp4 .mov</code></td><td>视频</td><td>播放器、剪映</td></tr>
<tr><td><code>.py .js .html</code></td><td>代码，本质是纯文本</td><td>VS Code</td></tr>
<tr><td><code>.csv</code></td><td>表格数据（Kaggle 最常见）</td><td>Excel、Python pandas</td></tr>
<tr><td><code>.ipynb</code></td><td>Jupyter 笔记本</td><td>Jupyter、VS Code、Kaggle</td></tr>
<tr><td><code>.md</code></td><td>Markdown 文档（GitHub 的 README）</td><td>VS Code、任何文本编辑器</td></tr>
</table></div>
<div class="note warn">一个叫 <code>作业答案.pdf.exe</code> 的文件是程序，不是 PDF。这是病毒最常见的伪装。</div>
<h2>压缩包一定要先解压</h2>
<p>直接双击 zip 里的程序，常常运行失败，因为它找不到同一个包里的其他文件。正确做法：右键 → 全部解压 → 进解压出来的文件夹再运行。</p>`,
    quiz: [
      { q: "朋友发来“照片.jpg.exe”，它其实是？", o: ["一张照片", "一个程序，可能是病毒", "一个压缩包"], a: 1, e: "真正的扩展名是最后一个点后面的 .exe。" },
      { q: "Kaggle 比赛的数据大多是什么格式？", o: [".exe", ".csv", ".dmg", ".mp3"], a: 1, e: "CSV 是逗号分隔的表格文本。" },
    ],
    videos: [yt("文件扩展名是什么", "file extensions explained for beginners"), yt("压缩与解压缩教程", "zip 压缩 解压 教程 7-Zip")],
  },
  {
    id: "a5", track: "pc", level: 3, title: "命令行（终端）入门",
    lead: "黑窗口不可怕。它就是“打字版的文件管理器”。AI 编程时你会天天看到它。",
    body: `
<h2>怎么打开</h2>
<ul>
<li>Windows：开始菜单搜索 <b>Terminal</b>（终端）或 <b>PowerShell</b>。</li>
<li>Mac：<kbd>Cmd</kbd>+<kbd>空格</kbd> 搜索 <b>Terminal</b>（终端）。</li>
</ul>
<h2>最常用的命令</h2>
<div class="tbl"><table>
<tr><th>命令</th><th>意思</th><th>相当于鼠标的</th></tr>
<tr><td><code>pwd</code></td><td>我现在在哪个文件夹</td><td>看地址栏</td></tr>
<tr><td><code>ls</code>（Windows 也可用 <code>dir</code>）</td><td>列出这里有什么</td><td>打开文件夹看一眼</td></tr>
<tr><td><code>cd 名字</code></td><td>进入某个文件夹</td><td>双击文件夹</td></tr>
<tr><td><code>cd ..</code></td><td>回到上一级</td><td>点“返回”</td></tr>
<tr><td><code>mkdir 名字</code></td><td>新建文件夹</td><td>右键 → 新建文件夹</td></tr>
<tr><td><code>python 文件.py</code></td><td>用 Python 运行一个程序</td><td>没有对应，这就是命令行存在的意义</td></tr>
</table></div>
<div class="note">AI 让你“在终端运行 <code>pip install numpy</code>”时：复制这一行，粘贴到终端，回车。看最后几行有没有 <code>Error</code>。</div>
<p>下面是一个模拟终端，随便敲，不会弄坏任何东西。完成右侧的小任务。</p>`,
    widget: "terminal",
    quiz: [
      { q: "想回到上一级文件夹，输入？", o: ["cd ..", "back", "ls ..", "pwd"], a: 0, e: "两个点 .. 代表上一级目录。" },
      { q: "命令运行后最后一行出现 ModuleNotFoundError，说明？", o: ["电脑坏了", "缺少某个 Python 库，需要 pip install 它", "网络断了"], a: 1, e: "把报错整段复制给 AI，它会告诉你装哪个库。" },
    ],
    videos: [yt("命令行入门（中文）", "命令行 终端 入门 小白 教程"), yt("Command line crash course", "command line crash course beginners")],
  },

  // ===================== 网络与名词 =====================
  {
    id: "b1", track: "net", level: 1, title: "IP 地址、域名、DNS、服务器",
    lead: "上网的本质：你的电脑找到另一台电脑（服务器），向它要东西。",
    body: `
<h2>一句话版本</h2>
<ul>
<li><b>服务器</b>：一台一直开着、专门回应别人请求的电脑。没什么神秘的，你的笔记本也能当服务器。</li>
<li><b>IP 地址</b>：网络上每台电脑的“电话号码”，比如 <code>142.250.72.14</code>。</li>
<li><b>域名</b>：好记的名字，比如 <code>google.com</code>。</li>
<li><b>DNS</b>：网络上的“通讯录”，把域名翻译成 IP。</li>
</ul>
<h2>你在浏览器输入网址后发生了什么</h2>
<ol>
<li>浏览器问 DNS：“github.com 的 IP 是多少？”</li>
<li>DNS 回答：“140.82.112.3”。</li>
<li>浏览器连上这个 IP 的 443 端口（HTTPS 加密）。</li>
<li>服务器把网页发回来，浏览器画出来。</li>
</ol>
<p>在下面输入任意域名，看一遍这个过程。</p>
<h2>两种特殊的 IP</h2>
<div class="tbl"><table>
<tr><th>IP</th><th>意思</th></tr>
<tr><td><code>127.0.0.1</code> 或 <code>localhost</code></td><td>“我自己这台电脑”。别人访问不到。</td></tr>
<tr><td><code>192.168.x.x</code> / <code>10.x.x.x</code></td><td>局域网（家里 / 学校 Wi-Fi 内部）地址。同一个 Wi-Fi 下的手机能访问。</td></tr>
<tr><td><code>0.0.0.0</code></td><td>出现在“服务监听在 0.0.0.0”时，意思是“本机所有网卡都接受连接”。</td></tr>
</table></div>`,
    widget: "dns",
    quiz: [
      { q: "DNS 的作用是？", o: ["加速下载", "把域名翻译成 IP 地址", "防病毒", "存网页"], a: 1, e: "DNS 就是通讯录。" },
      { q: "程序提示“打开 http://127.0.0.1:8080”，这个网址发给同学他能打开吗？", o: ["能", "不能，127.0.0.1 指的是各自的电脑本身"], a: 1, e: "127.0.0.1 永远是“我自己”。同学打开会访问他自己的电脑。" },
    ],
    videos: [yt("DNS 是怎么工作的", "DNS 原理 动画 讲解"), yt("What is an IP address", "what is an IP address explained simply"), yt("How the internet works", "how does the internet work explained")],
  },
  {
    id: "b2", track: "net", level: 1, title: "端口、“服务已启动”、“加速”到底是什么",
    lead: "你看不懂的那些话，把名词拆开就懂了。下面有一个“术语翻译器”，粘贴任何看不懂的话进去试试。",
    body: `
<h2>端口：一台电脑上的“房间号”</h2>
<p>IP 找到一栋楼（电脑），端口找到楼里的某个房间（某个程序）。<code>127.0.0.1:7860</code> 意思是“我这台电脑上，7860 号房间里的那个程序”。</p>
<div class="tbl"><table>
<tr><th>常见端口</th><th>通常是谁</th></tr>
<tr><td>80 / 443</td><td>网站（HTTP / HTTPS）</td></tr>
<tr><td>22</td><td>SSH，远程登录服务器</td></tr>
<tr><td>3000 / 5173 / 8000 / 8080</td><td>你自己写的网页程序在本地运行</td></tr>
<tr><td>7860</td><td>很多 AI 演示（Gradio、Stable Diffusion WebUI）</td></tr>
<tr><td>8888</td><td>Jupyter Notebook</td></tr>
</table></div>
<h2>“服务启动了”是什么意思</h2>
<p>程序开始在某个端口<b>等待</b>别人连它。这时终端会“卡住”不动，这是正常的，它在工作。不要关掉终端窗口，复制它给你的地址到浏览器打开。想停止就在终端按 <kbd>Ctrl</kbd>+<kbd>C</kbd>。</p>
<h2>“加速”通常指这几种</h2>
<ul>
<li><b>镜像加速 / 换源</b>：软件包的官方服务器在国外，下载慢。国内有人复制了一份（镜像），比如清华源：<code>pip install numpy -i https://pypi.tuna.tsinghua.edu.cn/simple</code>。</li>
<li><b>CDN 加速</b>：把网站内容复制到全国各地的服务器上，你访问离你最近的那台。</li>
<li><b>GPU 加速</b>：用显卡算 AI，比 CPU 快几十倍。和网络无关。</li>
<li><b>网络加速器</b>：游戏和外网访问用的线路优化，本质常常是代理，见下一课。</li>
</ul>
<div class="note">“端口被占用 (Address already in use)”：说明那个房间已经有程序在用了。通常是你之前启动的同一个程序没关。关掉旧的，或换一个端口。</div>`,
    widget: "decoder",
    quiz: [
      { q: "终端显示 Running on http://127.0.0.1:7860 然后就不动了，你应该？", o: ["以为卡死，关掉终端", "保持终端开着，在浏览器打开这个地址", "重启电脑"], a: 1, e: "服务在等你访问。关掉终端服务就停了。" },
      { q: "pip 下载很慢，“换清华源”属于哪种加速？", o: ["GPU 加速", "镜像加速", "CDN 加速"], a: 1, e: "从国内的镜像服务器下载同样的包。" },
      { q: "报错 Address already in use 最可能的原因？", o: ["网线断了", "这个端口已被另一个程序（常常是旧的自己）占用", "需要 VPN"], a: 1, e: "关掉旧进程，或换个端口。" },
    ],
    videos: [yt("什么是端口", "端口 port 是什么 通俗 讲解"), yt("localhost explained", "what is localhost and ports explained"), yt("pip 换源教程", "pip 换源 清华镜像 教程")],
  },
  {
    id: "b3", track: "net", level: 2, title: "VPN 与代理是怎么工作的",
    lead: "理解原理，知道风险，合法合规地使用。",
    body: `
<h2>原理：找个“中间人”替你去</h2>
<p>平时：你的电脑 → 直接连 → 网站。用代理或 VPN：你的电脑 → <b>加密</b>连到中间服务器 → 中间服务器替你连网站 → 把结果加密传回来。</p>
<p>所以对网站来说，访问它的是中间服务器的 IP；对你所在网络（学校、运营商）来说，只看到你和中间服务器之间有一条加密连接。</p>
<div class="tbl"><table>
<tr><th>名词</th><th>区别</th></tr>
<tr><td>VPN</td><td>把整台电脑的网络流量都走隧道。学校、公司常用 VPN 让你在家访问内网（图书馆数据库、内部系统）。</td></tr>
<tr><td>代理 (Proxy)</td><td>一般只代理某些程序（比如浏览器）的流量。</td></tr>
<tr><td>“全局模式”/“规则模式”</td><td>全部流量都走中间服务器 / 只有指定网站走。</td></tr>
<tr><td>终端里的代理</td><td>命令行程序（git、pip）默认不走系统代理，要单独设置 <code>HTTPS_PROXY</code> 环境变量。</td></tr>
</table></div>
<div class="note warn"><b>法律提醒</b>：不同国家和地区对 VPN 的规定差别很大。在中国大陆，使用未经批准的跨境 VPN 或“翻墙”服务存在法律风险。请使用学校、公司提供的合规 VPN，或在法律允许的地区使用。本站只讲原理，不提供任何具体服务或节点。</div>
<h2>安全注意</h2>
<ul>
<li>中间服务器理论上能看到你的流量（HTTPS 内容除外）。免费、来路不明的服务风险很大。</li>
<li>VPN 不让你“匿名”，只是换了一个“谁能看到你”的对象。</li>
</ul>`,
    widget: "proxy",
    quiz: [
      { q: "用了代理后，网站看到的访问者 IP 是？", o: ["你电脑的 IP", "代理服务器的 IP", "没有 IP"], a: 1, e: "网站只和代理服务器打交道。" },
      { q: "浏览器能打开 GitHub，但终端里 git clone 很慢或失败，常见原因？", o: ["Git 坏了", "终端程序没有走代理设置", "GitHub 关闭了"], a: 1, e: "命令行要单独设置代理环境变量，或用镜像。" },
    ],
    videos: [yt("VPN 是如何工作的", "how does a VPN work explained animation"), yt("代理和 VPN 的区别", "proxy vs VPN difference explained")],
  },
  {
    id: "b4", track: "net", level: 3, title: "云服务器、SSH 和“部署”",
    lead: "“部署”就是：把程序放到一台一直开机、别人能访问的电脑上运行起来。",
    body: `
<h2>本地 vs 云</h2>
<div class="tbl"><table>
<tr><th></th><th>本地（你的电脑）</th><th>云服务器（租来的电脑）</th></tr>
<tr><td>谁能访问</td><td>只有你（127.0.0.1）</td><td>全世界（公网 IP）</td></tr>
<tr><td>关机后</td><td>服务停了</td><td>一直在线</td></tr>
<tr><td>花钱</td><td>不花钱</td><td>按月付，便宜的几十元一个月</td></tr>
<tr><td>例子</td><td>在笔记本上跑 Jupyter</td><td>阿里云 / 腾讯云 / AWS / Google Cloud 上的服务器</td></tr>
</table></div>
<h2>SSH：远程控制服务器的终端</h2>
<pre><code>ssh root@47.100.12.34
# 意思：用 root 这个用户，登录 IP 为 47.100.12.34 的服务器
# 之后你敲的命令都在那台服务器上运行</code></pre>
<h2>部署的三条路，从易到难</h2>
<ol>
<li><b>静态网页</b>：GitHub Pages、Vercel、Netlify，免费。这个学习网站本身就可以这样部署。</li>
<li><b>AI 小应用</b>：Hugging Face Spaces（Gradio），免费，适合做演示。</li>
<li><b>自己的云服务器</b>：SSH 登录 → 装环境 → 运行程序 → 在安全组里放开端口 → 用公网 IP 访问。</li>
</ol>
<div class="note">云服务器“访问不了”最常见的原因：控制台的<b>安全组/防火墙</b>没放开那个端口；或者程序只监听了 127.0.0.1，应该改成 0.0.0.0。</div>`,
    quiz: [
      { q: "云服务器上程序跑起来了，但用公网 IP 打不开，先检查？", o: ["换浏览器", "安全组是否开放了端口、程序是否监听 0.0.0.0", "重装系统"], a: 1, e: "这两个原因占了绝大多数。" },
      { q: "免费部署一个纯 HTML 网页，最简单的是？", o: ["买云服务器", "GitHub Pages", "自己电脑一直开着"], a: 1, e: "仓库设置里打开 Pages 就行。" },
    ],
    videos: [yt("GitHub Pages 部署网站", "GitHub Pages 部署 静态网站 教程"), yt("SSH 入门", "SSH beginners tutorial connect to server"), yt("云服务器新手教程", "云服务器 新手 入门 部署 教程")],
  },

  // ===================== 短视频 =====================
  {
    id: "c1", track: "video", level: 1, title: "定位：你给谁看？凭什么看你？",
    lead: "1 万粉的账号，几乎都能用一句话说清楚：我是谁，帮谁，解决什么。",
    body: `
<h2>定位公式</h2>
<p><b>我是 ___（身份），专门帮 ___（人群）解决 ___（问题/提供 ___ 价值）。</b></p>
<p>例子：“24 岁零基础大学生，记录自己用 AI 从电脑小白学到做出围棋 AI 的全过程。”这句话里有身份（真实、有反差）、人群（同样的小白）、价值（可以跟着学）。</p>
<h2>为什么“记录成长”适合你</h2>
<ul>
<li>不需要你已经是专家，过程本身就是内容。</li>
<li>反差感强：零基础 → 做出 AI。</li>
<li>这个网站学的每一课，都可以是一期视频。</li>
</ul>
<h2>找选题的三个地方</h2>
<ol>
<li>同领域爆款视频的<b>评论区</b>：大家在问什么，就拍什么。</li>
<li>抖音 / B 站 / 小红书 / YouTube 的搜索框联想词。</li>
<li>你自己刚踩过的坑，因为一个月前的你就是观众。</li>
</ol>
<p>用下面的生成器试试你的定位。</p>`,
    widget: "niche",
    quiz: [
      { q: "哪个定位更容易涨粉？", o: ["分享我的日常生活", "零基础大学生 30 天用 AI 做出围棋 AI 的全过程", "什么火拍什么"], a: 1, e: "具体、有反差、可追更。" },
    ],
    videos: [yt("短视频账号定位方法", "短视频 账号定位 方法 新手"), yt("YouTube niche for beginners", "how to find your YouTube niche beginners")],
  },
  {
    id: "c2", track: "video", level: 1, title: "拍摄：一部手机就够",
    lead: "观众能忍受画面一般，忍受不了声音差。先管声音，再管光，最后才是画面。",
    body: `
<h2>优先级清单</h2>
<ol>
<li><b>声音</b>：手机放近一点，在小房间、有窗帘被子的地方录，回声少。预算有 100 元就先买领夹麦克风。</li>
<li><b>光</b>：面对窗户坐，让自然光打在脸上。不要背对窗户。</li>
<li><b>稳定</b>：手机支架或叠几本书。</li>
<li><b>竖屏 9:16</b>：抖音、快手、小红书、YouTube Shorts 都是竖屏。B 站和 YouTube 长视频用横屏 16:9。</li>
<li><b>擦镜头</b>：很多“画质糊”只是镜头上有指纹。</li>
</ol>
<h2>录屏类视频（教电脑 / AI 编程）</h2>
<ul>
<li>Windows：<kbd>Win</kbd>+<kbd>G</kbd> 游戏栏录屏，或 OBS（免费，官网 obsproject.com）。</li>
<li>Mac：<kbd>Cmd</kbd>+<kbd>Shift</kbd>+<kbd>5</kbd>。</li>
<li>把屏幕缩放调大、字号调大，因为观众是在手机上看。</li>
</ul>`,
    quiz: [
      { q: "预算只有 100 元，最该买？", o: ["补光灯", "领夹麦克风", "新手机", "稳定器"], a: 1, e: "声音对完播率影响最大。" },
      { q: "录屏教程给手机观众看，应该？", o: ["保持默认小字号", "放大字号和缩放", "用 4K 录制就行"], a: 1, e: "手机屏幕小，字要大。" },
    ],
    videos: [yt("手机拍视频技巧", "手机 拍摄 技巧 新手 短视频"), yt("OBS 录屏教程", "OBS 录屏 教程 新手"), yt("Smartphone filmmaking basics", "smartphone video tips beginners lighting audio")],
  },
  {
    id: "c3", track: "video", level: 2, title: "剪辑：剪映 / CapCut 工作流",
    lead: "剪辑的核心不是特效，是删。把所有“嗯、啊、停顿、废话”都删掉。",
    body: `
<h2>标准流程</h2>
<ol>
<li><b>导入素材</b>，按顺序放进时间线。</li>
<li><b>粗剪</b>：删掉说错的、停顿的、重复的。剪映的“智能剪口播”能一键删除停顿和语气词。</li>
<li><b>识别字幕</b>：文本 → 智能字幕 → 识别，然后逐句检查错字。</li>
<li><b>加 B-roll</b>：讲到什么就插入相关画面（录屏、截图），每 3~5 秒画面要有变化。</li>
<li><b>音乐</b>：音量压到人声的 10%~20%，不要盖过说话。</li>
<li><b>导出</b>：1080p，30fps，竖屏 1080×1920。</li>
</ol>
<h2>几个常用名词</h2>
<div class="tbl"><table>
<tr><th>名词</th><th>意思</th></tr>
<tr><td>时间线 / 轨道</td><td>下方一条条横道，越上面的轨道显示在越上层。</td></tr>
<tr><td>B-roll</td><td>补充画面，讲解时插入的辅助镜头。</td></tr>
<tr><td>跳剪 (Jump cut)</td><td>直接剪掉中间部分，节奏变快。口播常用。</td></tr>
<tr><td>关键帧</td><td>设置某一时刻的位置或大小，软件自动补出中间的动画。</td></tr>
<tr><td>码率</td><td>每秒的数据量，越高越清晰、文件越大。</td></tr>
</table></div>
<div class="note">剪映（国内）和 CapCut（海外版）是同一家公司的产品，操作几乎一样。电脑版比手机版好用得多。</div>`,
    quiz: [
      { q: "背景音乐音量应该？", o: ["和人声一样大", "明显小于人声", "越大越有气氛"], a: 1, e: "音乐是陪衬，让人听清你说话最重要。" },
      { q: "口播视频节奏慢，最有效的办法？", o: ["加很多转场特效", "删掉停顿和废话（跳剪）", "加速 2 倍播放"], a: 1, e: "删减是最好的节奏。" },
    ],
    videos: [yt("剪映电脑版入门", "剪映 电脑版 新手 入门 教程"), yt("CapCut desktop tutorial", "CapCut desktop tutorial for beginners"), yt("剪映智能剪口播", "剪映 智能剪口播 字幕 教程")],
  },
  {
    id: "c4", track: "video", level: 2, title: "前 3 秒钩子、标题和封面",
    lead: "平台先给你的视频几百次曝光。前 3 秒留不住人，后面拍得再好也没人看到。",
    body: `
<h2>钩子的几种写法</h2>
<ul>
<li><b>结果前置</b>：“这个围棋 AI 是我一个电脑小白，用 3 天做出来的。”</li>
<li><b>提问</b>：“你知道为什么你下载的软件总带一堆垃圾吗？”</li>
<li><b>反常识</b>：“学编程，千万别从语法开始学。”</li>
<li><b>痛点</b>：“看不懂 AI 写的代码？三步教你检查。”</li>
</ul>
<h2>开头不要做的</h2>
<ul>
<li>“大家好，我是 XX，今天给大家分享一下……”（观众已经划走了）</li>
<li>长片头、慢慢 Logo 动画。</li>
</ul>
<h2>封面和标题</h2>
<ul>
<li>封面：一张表情明显的脸 + 不超过 8 个大字。</li>
<li>标题：带数字、带具体结果，“30 天”“1 个 AI”“0 基础”。</li>
<li>统一的封面样式，让主页看起来像一个系列。</li>
</ul>
<p>把你的开头第一句写进下面的检查器。</p>`,
    widget: "hook",
    quiz: [
      { q: "哪个开头更好？", o: ["大家好，今天我来给大家分享一下如何下载软件", "90% 的人下载软件都中过招，你是哪种？"], a: 1, e: "直接给冲突和悬念。" },
    ],
    videos: [yt("短视频黄金 3 秒开头", "短视频 黄金3秒 开头 技巧"), yt("How to write video hooks", "how to write hooks for short form video"), yt("YouTube 缩略图技巧", "YouTube thumbnail tips that get clicks")],
  },
  {
    id: "c5", track: "video", level: 3, title: "数据复盘与 1 万粉路线图",
    lead: "涨粉不是玄学。看懂三个数字，每周改进一点。",
    body: `
<h2>三个最重要的指标</h2>
<div class="tbl"><table>
<tr><th>指标</th><th>说明</th><th>低了怎么办</th></tr>
<tr><td>完播率 / 平均观看时长</td><td>多少人看完</td><td>改开头，删废话，缩短视频</td></tr>
<tr><td>点击率（YouTube / B站）</td><td>看到封面的人里，多少人点进来</td><td>改封面和标题</td></tr>
<tr><td>转粉率</td><td>看完的人里多少关注了</td><td>做系列内容，结尾给出“为什么要关注”</td></tr>
</table></div>
<h2>路线图（参考）</h2>
<ol>
<li><b>0 → 100 粉</b>：先发 20 条。目标不是火，是练手和找方向。</li>
<li><b>100 → 1000</b>：找出数据最好的 3 条，同主题做 10 个变体。</li>
<li><b>1000 → 10000</b>：固定栏目化（如“小白学 AI 第 N 天”），稳定更新频率，和同领域博主互动、合拍。</li>
</ol>
<p>下面的计算器帮你估算达到 1 万粉需要多久。数字只是模型，真实情况波动很大，但它能告诉你哪一个数字最值得改进。</p>`,
    widget: "growth",
    quiz: [
      { q: "视频播放量不错但几乎不涨粉，最可能缺的是？", o: ["更好的画质", "持续的系列价值，让人有理由关注", "更多特效"], a: 1, e: "观众关注是为了“下一期”。" },
    ],
    videos: [yt("短视频数据分析复盘", "短视频 数据 复盘 完播率 转粉率"), yt("YouTube analytics explained", "YouTube analytics explained small channels"), yt("从0到1万粉经验", "从0到1万粉丝 经验 分享 新人")],
  },

  // ===================== 用 AI 学习 =====================
  {
    id: "d1", track: "ailearn", level: 1, title: "怎么向 AI 提问",
    lead: "AI 的回答质量，大部分取决于你给了多少背景。",
    body: `
<h2>好问题的五个部分</h2>
<ol>
<li><b>我是谁</b>：“我是电脑零基础的大学生。”</li>
<li><b>背景</b>：“我用的是 Windows 11 笔记本。”</li>
<li><b>任务</b>：“教我在本地运行一个 Kaggle 项目。”</li>
<li><b>要求</b>：“每一步告诉我点哪里、输入什么，不要跳步。”</li>
<li><b>格式</b>：“先给步骤清单，等我完成一步再讲下一步。”</li>
</ol>
<h2>四个追问句式，比换问题更有用</h2>
<ul>
<li>“用打比方的方式再讲一遍。”</li>
<li>“你刚才说的 X 是什么意思？”</li>
<li>“给我出 3 道题，检查我是否真的懂了。”</li>
<li>“我做到第 3 步，出现了下面这段报错：（粘贴完整报错）。”</li>
</ul>
<div class="note">AI 会出错，尤其是具体的版本号、网址、按钮名字。重要信息去官方文档核对一下。</div>`,
    widget: "prompt",
    quiz: [
      { q: "程序报错了，问 AI 最好的方式？", o: ["“报错了怎么办”", "粘贴完整报错 + 说明你在做什么 + 你的系统", "截一张模糊的图"], a: 1, e: "信息越完整，答案越准。" },
    ],
    videos: [yt("提示词入门", "提示词 prompt 入门 教程 ChatGPT Claude"), yt("Prompt engineering for beginners", "prompt engineering for beginners"), yt("用 AI 高效学习", "用AI 高效学习 方法")],
  },
  {
    id: "d2", track: "ailearn", level: 2, title: "费曼学习法：让 AI 当你的考官",
    lead: "能讲给别人听，才算真懂。AI 是一个不会嫌你烦的听众和考官。",
    body: `
<h2>四步循环</h2>
<ol>
<li><b>学</b>：让 AI 用最简单的话讲一个概念（比如“什么是梯度下降”）。</li>
<li><b>讲</b>：你自己用一段话复述，发给 AI。</li>
<li><b>挑错</b>：让 AI 指出你讲错和讲漏的地方。</li>
<li><b>考</b>：让 AI 出题，你答，它判。答错的地方回到第 1 步。</li>
</ol>
<h2>可以直接复制的模板</h2>
<pre><code>我在学【概念】。我先用自己的话解释一遍：
【你的解释】
请你：
1. 指出我理解错误或不完整的地方
2. 用一个生活中的比喻纠正我
3. 出 3 道由易到难的题考我，等我回答后再给答案</code></pre>
<h2>适合这么学的主题</h2>
<ul><li>物理、数学概念（牛顿定律、导数、概率）</li><li>编程概念（变量、循环、函数、Git）</li><li>这个网站里的每一课</li></ul>`,
    quiz: [
      { q: "费曼学习法的核心是？", o: ["多看视频", "用自己的话讲出来，再找漏洞", "背诵定义"], a: 1, e: "输出暴露问题。" },
    ],
    videos: [yt("费曼学习法", "费曼学习法 讲解"), yt("Feynman technique", "Feynman technique explained")],
  },
  {
    id: "d3", track: "ailearn", level: 3, title: "用 AI 搭物理模型：抛体运动",
    lead: "物理模型 = 写下规律 + 让电脑一小步一小步地算。AI 帮你写代码，你负责理解和检查。",
    body: `
<h2>模型是怎么算出来的</h2>
<p>电脑不会解方程，它只是每次往前走一小步（比如 0.01 秒）：</p>
<ol>
<li>根据当前速度，算出下一刻的位置：<code>x = x + vx·dt</code></li>
<li>根据受力，算出下一刻的速度：<code>vy = vy − g·dt</code>，有空气阻力时速度还要按比例减小</li>
<li>重复，直到落地。</li>
</ol>
<p>这叫<b>数值模拟（欧拉法）</b>。天气预报、游戏物理、火箭轨道，本质都是这个思路。</p>
<h2>调下面的参数，观察规律</h2>
<ul>
<li>没有空气阻力时，多少度射得最远？</li>
<li>加大空气阻力后，最远的角度变大还是变小？</li>
<li>换到月球，射程变成几倍？</li>
</ul>
<h2>让 AI 写同样的 Python 代码</h2>
<p>给 AI 的提示词：“用 Python 和 matplotlib 模拟带空气阻力的抛体运动，用欧拉法，dt=0.01，画出 30°、45°、60° 三条轨迹，每一行代码加中文注释。”</p>
<pre><code>import math
import matplotlib.pyplot as plt

g, k, dt = 9.8, 0.05, 0.01        # 重力加速度、阻力系数、时间步长
for angle in [30, 45, 60]:
    vx = 30 * math.cos(math.radians(angle))
    vy = 30 * math.sin(math.radians(angle))
    x, y, xs, ys = 0, 0, [], []
    while y >= 0:
        xs.append(x); ys.append(y)
        x += vx * dt; y += vy * dt   # 位置更新
        vx -= k * vx * dt            # 阻力让水平速度变小
        vy -= (g + k * vy) * dt      # 重力 + 阻力
    plt.plot(xs, ys, label=f"{angle}°")
plt.legend(); plt.xlabel("距离 m"); plt.ylabel("高度 m"); plt.show()</code></pre>
<div class="note">检查 AI 的物理代码：把阻力设为 0，结果应和课本公式 R = v²·sin(2θ)/g 一致。这叫“用已知答案验证模型”。</div>`,
    widget: "projectile",
    quiz: [
      { q: "无空气阻力时，最远射程的角度是？", o: ["30°", "45°", "60°", "90°"], a: 1, e: "sin(2θ) 在 θ=45° 时最大。" },
      { q: "怎么验证 AI 写的模拟代码是对的？", o: ["看起来像就行", "取一个有已知答案的特殊情况对比", "多运行几次"], a: 1, e: "比如阻力为 0 时和课本公式对比。" },
    ],
    videos: [yt("Python 物理模拟抛体", "Python projectile motion simulation air resistance"), yt("欧拉法数值模拟", "欧拉法 数值模拟 讲解"), yt("PhET 物理仿真", "PhET projectile motion simulation")],
  },

  // ===================== AI 编程 =====================
  {
    id: "e1", track: "aicode", level: 1, title: "GitHub 和“创建仓库”是什么意思",
    lead: "仓库 (repository) = 一个项目文件夹 + 它的全部修改历史。GitHub = 放仓库的网站。",
    body: `
<h2>打个比方</h2>
<ul>
<li><b>Git</b>：一个“存档”软件，像游戏存档，可以随时回到之前任何一个存档点。</li>
<li><b>仓库 (repo)</b>：被 Git 管理的那个项目文件夹。</li>
<li><b>提交 (commit)</b>：存一次档，附一句说明“这次改了什么”。</li>
<li><b>GitHub</b>：一个网站，把你的仓库备份到云上，还能给别人看、一起改。</li>
<li><b>推送 (push)</b>：把本地的存档上传到 GitHub。<b>拉取 (pull)</b>：把 GitHub 上的新存档下载下来。</li>
<li><b>分支 (branch)</b>：从某个存档点分出去的平行世界，改坏了不影响主线 (main)。</li>
<li><b>PR (Pull Request)</b>：请求“把我分支上的修改合并到主线”，别人可以审阅。</li>
</ul>
<h2>在 GitHub 上创建仓库</h2>
<ol>
<li>登录 github.com → 右上角 <b>+</b> → <b>New repository</b>。</li>
<li>起名（英文，如 <code>go-ai</code>），选 Public（公开）或 Private（私有）。</li>
<li>勾选 <b>Add a README</b>，点 Create。完成，你有了一个云端的空项目。</li>
</ol>
<h2>四个区域</h2>
<p>你的文件会经过：<b>工作区</b>（你正在改的文件）→ <b>暂存区</b>（选好要存档的）→ <b>本地仓库</b>（存档完成）→ <b>GitHub</b>（上传备份）。下面亲手点一遍。</p>`,
    widget: "git",
    quiz: [
      { q: "commit 和 push 的区别？", o: ["一样", "commit 是在本地存档，push 是上传到 GitHub", "push 是存档，commit 是上传"], a: 1, e: "commit 之后还要 push，GitHub 上才看得到。" },
      { q: "“创建一个仓库”最接近？", o: ["买一个硬盘", "新建一个带存档功能的项目文件夹", "安装 GitHub 软件"], a: 1, e: "仓库就是项目 + 历史记录。" },
    ],
    videos: [yt("Git 和 GitHub 入门", "Git GitHub 入门 教程 小白"), yt("Git and GitHub for beginners", "git and github for beginners crash course"), yt("GitHub 创建仓库", "how to create a GitHub repository")],
  },
  {
    id: "e2", track: "aicode", level: 1, title: "本地还是云端？",
    lead: "同样是 Claude Code，可以在你的电脑上跑，也可以在云端的临时电脑里跑。",
    body: `
<div class="tbl"><table>
<tr><th></th><th>本地（你的电脑）</th><th>云端（claude.ai/code 网页版等）</th></tr>
<tr><td>代码在哪</td><td>你电脑上的文件夹</td><td>一台临时的云端电脑，从 GitHub 克隆你的仓库</td></tr>
<tr><td>要装什么</td><td>Node.js、Git、Claude Code 命令行</td><td>什么都不用装，浏览器或手机就能用</td></tr>
<tr><td>改完的代码</td><td>直接在你电脑上</td><td>必须 commit 并 push 回 GitHub，否则云端电脑回收后就没了</td></tr>
<tr><td>能不能用你的显卡 / 本地文件</td><td>能</td><td>不能</td></tr>
<tr><td>适合</td><td>跑大模型、处理本地数据、玩围棋 AI</td><td>写网页、改代码、随时随地用手机让 AI 干活</td></tr>
</table></div>
<h2>两边怎么同步</h2>
<p>GitHub 是中转站。云端改完 → push 到 GitHub → 你在电脑上 <code>git pull</code> 就拿到了最新代码。反过来也一样。</p>
<h2>这个网站就是例子</h2>
<p>它是在云端由 Claude Code 写的，提交到你的 GitHub 仓库。你在电脑上 <code>git clone</code> 下来，双击 <code>index.html</code> 就能离线打开；也可以在仓库设置里开 GitHub Pages 生成一个网址。</p>`,
    quiz: [
      { q: "在云端让 AI 改了代码，但没有 push，会怎样？", o: ["自动保存到你电脑", "云端环境被回收后改动可能丢失", "GitHub 自动同步"], a: 1, e: "云端电脑是临时的，push 才安全。" },
      { q: "想在笔记本显卡上跑围棋 AI，应该？", o: ["云端 Claude Code", "本地运行"], a: 1, e: "云端用不了你的显卡。" },
    ],
    videos: [yt("Claude Code 入门", "Claude Code tutorial beginners"), yt("git clone 和 pull", "git clone pull 教程 新手")],
  },
  {
    id: "e3", track: "aicode", level: 2, title: "读懂 Claude Code 在说什么",
    lead: "Claude Code 的输出看起来很多，其实只有几种东西：它在读、在改、在运行命令、在向你汇报。",
    body: `
<h2>你会看到的几类信息</h2>
<div class="tbl"><table>
<tr><th>看到的</th><th>意思</th><th>你要做什么</th></tr>
<tr><td><code>Read</code> / <code>Glob</code> / <code>Grep</code></td><td>在看文件、找文件、搜内容</td><td>不用管</td></tr>
<tr><td><code>Edit</code> / <code>Write</code> + 红绿色的行</td><td>改文件。<span class="no">红色 − 是删掉的</span>，<span class="ok">绿色 + 是新加的</span></td><td>扫一眼改动是不是你想要的</td></tr>
<tr><td><code>Bash(...)</code></td><td>在终端运行一个命令</td><td>看命令是什么。删除类命令（rm）要警惕</td></tr>
<tr><td>“Do you want to proceed?”</td><td>请你批准某个操作</td><td>看懂再点 Yes。不懂就选 No 并问它“这一步要做什么？”</td></tr>
<tr><td>测试结果 passed / failed</td><td>自动检查有没有通过</td><td>failed 要让它修</td></tr>
<tr><td>最后一段总结</td><td>它做了什么、没做什么</td><td><b>最重要</b>，一定读完</td></tr>
</table></div>
<p>点击下面这段模拟输出的每一行，看解释。</p>
<h2>万能问法</h2>
<ul>
<li>“用小白能懂的话，解释你刚才改了什么、为什么这样改。”</li>
<li>“这个命令会对我的电脑做什么？有风险吗？”</li>
<li>“我怎么自己验证这个功能能用？”</li>
</ul>`,
    widget: "transcript",
    quiz: [
      { q: "diff 里以绿色 + 开头的行代表？", o: ["删除的代码", "新加的代码", "报错"], a: 1, e: "+ 新增，− 删除。" },
      { q: "Claude Code 请求运行 rm -rf 某文件夹，你看不懂，该？", o: ["直接 Yes", "选 No，问它为什么要删、删的是什么", "关掉电脑"], a: 1, e: "rm -rf 是不可恢复的删除。" },
    ],
    videos: [yt("Claude Code 使用教程", "Claude Code 教程 中文"), yt("How to read a git diff", "how to read git diff beginners")],
  },
  {
    id: "e4", track: "aicode", level: 2, title: "怎么检查 AI 写的代码",
    lead: "你不需要看懂每一行。你需要会验证：它跑不跑得起来、结果对不对、边界情况崩不崩。",
    body: `
<h2>小白也能做的五步检查</h2>
<ol>
<li><b>跑起来</b>：先运行。报错就把完整报错发回给 AI。</li>
<li><b>用已知答案测</b>：输入一个你知道答案的例子。算平均数就输入 2 和 4，应该得 3。</li>
<li><b>试边界</b>：空的、0、负数、特别大、中文。很多 bug 藏在这里。</li>
<li><b>让 AI 自己审</b>：“请像严格的代码审查员一样，找出这段代码的 bug 和边界问题。”最好开一个新对话问。</li>
<li><b>让它写测试</b>：“为这个函数写 5 个测试用例并运行。”</li>
</ol>
<h2>找 bug 练习</h2>
<p>下面这个函数用来算考试平均分。点击你认为有问题的那一行。</p>`,
    widget: "bug",
    quiz: [
      { q: "检查代码最有效的第一步？", o: ["逐行读懂", "直接运行，并用已知答案的例子测试", "相信 AI"], a: 1, e: "能不能跑、结果对不对，比读懂每行更快。" },
      { q: "以下哪个是“边界情况”？", o: ["输入 [80, 90]", "输入空列表 []", "输入 [70, 75, 80]"], a: 1, e: "空、零、极大值都是边界。" },
    ],
    videos: [yt("如何审查 AI 生成的代码", "how to review AI generated code"), yt("Python 单元测试入门", "Python pytest 入门 教程")],
  },
  {
    id: "e5", track: "aicode", level: 3, title: "在自己电脑上跑 Kaggle 项目",
    lead: "Kaggle 网页上的 Notebook 可以直接跑；想在本地跑，需要四样东西：Python、库、数据、编辑器。",
    body: `
<h2>第 1 步：装环境（只需一次）</h2>
<ol>
<li>装 <b>Miniconda</b>（官网 docs.conda.io / anaconda.com 的 Miniconda 页面），它自带 Python，并能管理不同项目的环境。</li>
<li>装 <b>VS Code</b>，在扩展里搜索安装 <b>Python</b> 和 <b>Jupyter</b>。</li>
</ol>
<h2>第 2 步：建项目环境</h2>
<pre><code>conda create -n kaggle python=3.11 -y
conda activate kaggle
pip install pandas numpy scikit-learn matplotlib jupyter kaggle</code></pre>
<p>慢的话，pip 加上 <code>-i https://pypi.tuna.tsinghua.edu.cn/simple</code>（上一课讲的镜像加速）。</p>
<h2>第 3 步：拿到 Kaggle 的钥匙并下载数据</h2>
<ol>
<li>Kaggle 网站 → 头像 → Settings → API → <b>Create New Token</b>，下载 <code>kaggle.json</code>。</li>
<li>放到：Windows <code>C:\\Users\\你的用户名\\.kaggle\\kaggle.json</code>；Mac <code>~/.kaggle/kaggle.json</code>。</li>
<li>先在网页上点进比赛并接受规则 (Join Competition)，然后：</li>
</ol>
<pre><code>mkdir titanic && cd titanic
kaggle competitions download -c titanic
# 下载的是 zip，解压它（Mac/Linux 用 unzip，Windows 右键“全部解压”）
unzip titanic.zip</code></pre>
<h2>第 4 步：打开 Notebook 开始</h2>
<pre><code>jupyter notebook
# 浏览器会打开 http://localhost:8888 （又见 localhost 和端口！）</code></pre>
<p>或者在 Kaggle 上找一个别人的 Notebook → 右上角 ⋮ → Download，用 VS Code 打开 <code>.ipynb</code>，把数据路径从 <code>/kaggle/input/titanic/train.csv</code> 改成 <code>train.csv</code>。</p>
<div class="note"><code>kaggle.json</code> 是你的密码，不要发给别人，也不要提交到 GitHub。</div>`,
    quiz: [
      { q: "从 Kaggle 下载的 Notebook 在本地报 FileNotFoundError: /kaggle/input/...，原因？", o: ["Python 坏了", "数据路径是 Kaggle 网站上的，要改成本地路径", "需要 VPN"], a: 1, e: "本地没有 /kaggle/input 这个文件夹。" },
      { q: "kaggle.json 可以上传到 GitHub 公开仓库吗？", o: ["可以", "不可以，它相当于密码"], a: 1, e: "密钥泄露别人就能用你的账号。" },
    ],
    videos: [yt("Kaggle 入门 Titanic", "Kaggle Titanic 入门 教程"), yt("Kaggle API download dataset", "kaggle api download competition data tutorial"), yt("Miniconda 安装", "Miniconda 安装 教程 Windows")],
  },
  {
    id: "e6", track: "aicode", level: 3, title: "做一个围棋 AI",
    lead: "先和一个规则型的小 AI 下一盘，再看看真正的围棋 AI（AlphaGo、KataGo）是怎么想的。",
    body: `
<h2>围棋 AI 的三代</h2>
<div class="tbl"><table>
<tr><th>方法</th><th>怎么想</th><th>水平</th></tr>
<tr><td>规则型（下面这个）</td><td>“能吃就吃，被打吃就逃，别自己填眼”</td><td>入门</td></tr>
<tr><td>蒙特卡洛树搜索 (MCTS)</td><td>对每个候选点，随机下完很多盘，看哪个点胜率高</td><td>业余段位</td></tr>
<tr><td>神经网络 + MCTS（AlphaGo Zero、KataGo）</td><td>神经网络看一眼棋盘就给出“好点”和“胜率”，再用搜索验证</td><td>远超人类</td></tr>
</table></div>
<h2>马上在电脑上用最强的开源围棋 AI</h2>
<ol>
<li>下载 <b>KataGo</b>（GitHub：lightvector/KataGo，Releases 页面，按你的显卡选版本）和一个网络权重文件（katagotraining.org）。</li>
<li>下载图形界面 <b>Sabaki</b> 或 <b>KaTrain</b>（都是免费开源）。</li>
<li>在界面里添加引擎，指向 KataGo 程序，就能对弈和复盘分析。</li>
</ol>
<p>每一步的详细做法、配置和排错，见实战路线 <a href="#l-k1">本地部署 KataGo</a>（8 课）。</p>
<h2>用 Claude Code 自己做一个</h2>
<p>按难度递进的三个提示词：</p>
<pre><code>1. 用 Python 写一个 9x9 围棋，支持提子、禁止自杀、打劫规则，命令行下棋。
2. 加一个 AI：用蒙特卡洛树搜索 (MCTS)，每步模拟 500 盘。
3. 用 PyTorch 写一个小型策略网络，用 KataGo 公开棋谱训练，替换 MCTS 里的随机走子。</code></pre>
<p>每一步都用上一课的方法检查：先下一盘看规则对不对（试着吃子、试着下自杀点）。</p>`,
    widget: "go",
    quiz: [
      { q: "AlphaGo Zero 的核心组合是？", o: ["只有规则", "神经网络 + 蒙特卡洛树搜索", "背棋谱"], a: 1, e: "网络给直觉，搜索做验算。" },
      { q: "想在自己电脑上用开源的强力围棋 AI 复盘，选？", o: ["KataGo + Sabaki/KaTrain", "Excel", "剪映"], a: 0, e: "都是免费开源。" },
    ],
    videos: [yt("AlphaGo 纪录片", "AlphaGo The Movie full documentary"), yt("KataGo 安装使用", "KataGo Sabaki 安装 教程"), yt("MCTS explained", "Monte Carlo tree search explained"), yt("Python 写围棋 AI", "build a Go AI python MCTS tutorial")],
  },
];

// 名词速查，同时给“术语翻译器”用。k = 识别关键字
const GLOSSARY = [
  { t: "IP 地址", en: "IP address", k: ["IP地址", "IP 地址", "IP"], d: "网络上一台电脑的号码，如 142.250.72.14。" },
  { t: "127.0.0.1 / localhost", en: "localhost", k: ["127.0.0.1", "localhost"], d: "“我自己这台电脑”。只有你能访问。" },
  { t: "0.0.0.0", en: "all interfaces", k: ["0.0.0.0"], d: "服务监听在 0.0.0.0 = 接受本机所有网卡的连接，局域网或公网也能访问。" },
  { t: "端口", en: "port", k: ["端口", "port"], d: "一台电脑上不同程序的“房间号”，写在冒号后面，如 :8080。" },
  { t: "域名", en: "domain", k: ["域名", "domain"], d: "好记的网址名字，如 github.com，会被 DNS 翻译成 IP。" },
  { t: "DNS", en: "Domain Name System", k: ["DNS"], d: "把域名翻译成 IP 的“通讯录”。" },
  { t: "服务器", en: "server", k: ["服务器", "server", "服务端"], d: "一直开着、回应别人请求的电脑或程序。" },
  { t: "服务 / 启动服务", en: "service", k: ["服务已启动", "启动服务", "启动", "Running on", "服务"], d: "程序开始运行并在某个端口等待连接。终端看起来“卡住”是正常的。" },
  { t: "地址", en: "URL / address", k: ["地址", "URL", "http://", "https://"], d: "网址。格式：协议://主机:端口/路径，如 http://127.0.0.1:7860/。" },
  { t: "加速 / 镜像", en: "mirror / acceleration", k: ["镜像加速", "加速", "镜像", "换源", "mirror"], d: "从离你更近的服务器下载同样的内容。比如 pip 用清华源。" },
  { t: "CDN", en: "Content Delivery Network", k: ["CDN"], d: "把网站内容复制到各地服务器，就近访问更快。" },
  { t: "GPU / CUDA", en: "graphics card", k: ["GPU", "CUDA", "显卡"], d: "显卡。AI 计算用它比 CPU 快很多。CUDA 是 NVIDIA 显卡的计算工具。" },
  { t: "VPN", en: "Virtual Private Network", k: ["VPN"], d: "把电脑的网络流量通过加密隧道交给另一台服务器转发。注意遵守当地法律。" },
  { t: "代理", en: "proxy", k: ["代理", "proxy", "HTTPS_PROXY"], d: "替你访问网络的中间服务器。命令行程序需要单独配置。" },
  { t: "SSH", en: "Secure Shell", k: ["SSH", "ssh"], d: "远程登录另一台电脑的终端。" },
  { t: "部署", en: "deploy", k: ["部署", "deploy"], d: "把程序放到能被别人访问的电脑上运行起来。" },
  { t: "终端 / 命令行", en: "terminal", k: ["终端", "命令行", "terminal", "Terminal"], d: "用打字方式操作电脑的窗口。" },
  { t: "环境 / 虚拟环境", en: "environment", k: ["虚拟环境", "环境", "conda", "venv"], d: "每个项目单独的一套 Python 和库，互不干扰。" },
  { t: "pip", en: "pip", k: ["pip"], d: "Python 的“应用商店”命令，pip install 某库 = 安装某个库。" },
  { t: "库 / 包", en: "library / package", k: ["库", "依赖", "package", "包"], d: "别人写好的代码，装上就能用，如 numpy、pandas。" },
  { t: "Git", en: "Git", k: ["Git", "git"], d: "给项目存档的软件，可以回到任何历史版本。" },
  { t: "GitHub", en: "GitHub", k: ["GitHub", "github"], d: "存放 Git 仓库的网站。" },
  { t: "仓库", en: "repository / repo", k: ["仓库", "repo", "repository"], d: "一个项目文件夹 + 全部修改历史。" },
  { t: "提交", en: "commit", k: ["提交", "commit"], d: "存一次档，并写一句说明。" },
  { t: "推送 / 拉取", en: "push / pull", k: ["推送", "拉取", "push", "pull"], d: "上传本地存档到 GitHub / 从 GitHub 下载新存档。" },
  { t: "克隆", en: "clone", k: ["克隆", "clone"], d: "把 GitHub 上的仓库完整复制到本地。" },
  { t: "分支", en: "branch", k: ["分支", "branch"], d: "项目的平行版本，改坏了不影响主线 main。" },
  { t: "PR", en: "Pull Request", k: ["PR", "Pull Request", "合并请求"], d: "请求把你分支上的修改合并进主线，别人可以审阅。" },
  { t: "API", en: "Application Programming Interface", k: ["API", "接口"], d: "程序之间沟通的约定。比如用 Kaggle API 在命令行下载数据。" },
  { t: "API Key / Token", en: "key", k: ["API Key", "Token", "密钥", "token"], d: "访问某个服务的密码，绝不能公开。" },
  { t: "报错 / 异常", en: "error / exception", k: ["报错", "Error", "error", "Exception"], d: "程序出问题时给的说明，通常最后一行最关键。" },
  { t: "云端", en: "cloud", k: ["云端", "云服务器", "云"], d: "放在别人机房、你通过网络使用的电脑。" },
  { t: "本地", en: "local", k: ["本地", "local"], d: "就在你自己电脑上。" },
  { t: "Jupyter Notebook", en: "notebook", k: ["Jupyter", "Notebook", "ipynb"], d: "一段代码一段结果的交互式笔记本，数据分析常用。" },
  { t: "完播率", en: "retention", k: ["完播率"], d: "看完视频的比例，短视频平台最看重的指标之一。" },
  { t: "转粉率", en: "follow rate", k: ["转粉率", "涨粉"], d: "看了视频后点关注的比例。" },
];
