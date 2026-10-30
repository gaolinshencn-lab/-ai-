# 棋盘学堂

给零基础大学生的交互学习网站。六条路线、31 课，每课有讲解、动手练习、小测验和 YouTube 视频：

- **电脑基础**：文件与路径、下载安装应用商店之外的软件、快捷键、扩展名、命令行（模拟终端）
- **网络与名词**：IP / 域名 / DNS、端口与“服务已启动”“加速”（术语翻译器）、VPN 与代理原理、云服务器与部署
- **短视频创作**：定位、拍摄、剪映 / CapCut、前 3 秒钩子、数据复盘与 1 万粉计算器
- **用 AI 学习**：提问方法、费曼学习法、用 AI 搭物理模型（抛体模拟）
- **AI 编程**：GitHub 与仓库、本地 vs 云端、读懂 Claude Code、检查代码、本地跑 Kaggle、9 路围棋 AI
- **实战：本地部署 KataGo**：选版本和后端、下载最新模型、genconfig / benchmark 调优、接入 Sabaki / KaTrain / LizzieYzy、报错排查、Python 调用分析引擎、TensorRT 和人类风格模型

难度分三级：基础 → 行家 → 精通。学完一课在棋盘上落一子，进度保存在浏览器里。

## 怎么打开

- 下载或 `git clone` 这个仓库，双击 `index.html`。不需要安装任何东西。
- 或者在 GitHub 仓库 **Settings → Pages** 里选择 `main` 分支根目录，就会得到一个网址。

## 修改内容

源文件在 `src/`：

| 文件 | 内容 |
|---|---|
| `src/lessons.js` | 所有课程、测验、视频搜索词、名词表 |
| `src/kata.js` | 实战路线：本地部署 KataGo |
| `src/widgets.js` | 交互练习（终端、围棋、物理模拟等） |
| `src/app.js` | 页面切换、进度、视频保存 |
| `src/style.css` | 样式 |

改完运行 `python3 src/build.py` 重新生成 `index.html`。
