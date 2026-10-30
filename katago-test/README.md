# KataGo 实测记录（2026-10-30）

环境：KataGo v1.18.1 官方预编译 Linux 版（`katago-v1.18.1-eigenavx2-linux-x64.zip`，Eigen CPU + AVX2），4 核 CPU，15 GB 内存，无显卡。

## benchmark（`-t 4 -v 40 -n 4`，4 线程）

| 模型 | 结构 | 参数量 | visits/s |
|---|---|---|---|
| kata1-b18c384nbt-s9996604416-d4316597426 | 卷积 | 2633 万 | 9.40 |
| kata1-b28c512nbt-s13255194368-d5935380940 | 卷积 | 7283 万 | 3.93 |
| kata1-tf3-b11c768-s11003M-d5973M-7gres | transformer | 7044 万 | 2.39 |
| kata1-tf2-b10c384-s2941M-d5872M | transformer | 1055 万 | 1.30 |
| kata1-tf3-b10c512-s3203M-d5937M | transformer | 2854 万 | 0.23 |

完整输出在 `benchmark-logs/`。CPU 上 b18 最快；transformer 模型要在 GPU（CUDA / TensorRT）上才有优势。

## 其他实测

- `gtp_test.sh`：GTP 对弈（genmove、showboard）
- `analyze.py`：Python 调用 analysis 引擎。Linux AppImage 会把 fusermount 警告打印到 stdout，所以脚本只解析以 `{` 开头的行。
- KataGo v1.16.2 加载 tf3 模型会报 `This neural net requires a newer KataGo version ... Model version: 17`。
- Human SL 模型 `b18c384nbt-humanv0` + `gtp_human5k_example.cfg` 能正常运行。
