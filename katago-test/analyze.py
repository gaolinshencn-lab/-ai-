# 实测：用 Python 调用 KataGo 分析引擎（与课程第 7 课的代码相同结构）
import json, subprocess, sys, time

KATAGO = "/root/katago/katago"      # 改成你的 katago 路径，Windows 例如 r"D:\katago\katago.exe"
MODEL  = "/root/katago/models/" + sys.argv[1]   # 用法：python analyze.py 模型文件名
CFG    = "/root/katago/analysis_example.cfg"

t0 = time.time()
p = subprocess.Popen([KATAGO, "analysis", "-model", MODEL, "-config", CFG,
                      "-override-config", "numSearchThreadsPerAnalysisThread=4,numAnalysisThreads=1"],
                     stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.DEVNULL, text=True)

query = {"id": "q1", "moves": [["B", "Q16"], ["W", "D4"], ["B", "Q3"]],
         "rules": "chinese", "komi": 7.5, "boardXSize": 19, "boardYSize": 19,
         "analyzeTurns": [3], "maxVisits": 50}
p.stdin.write(json.dumps(query) + "\n"); p.stdin.flush()

for line in p.stdout:                      # 跳过不是 JSON 的行（如 Linux AppImage 的警告）
    if line.startswith("{"):
        result = json.loads(line); break
print(f"用时 {time.time()-t0:.1f} 秒（含加载模型）")
print("当前局面（黑方视角）：黑胜率 %.1f%%，黑领先 %+.1f 目" % (result["rootInfo"]["winrate"]*100, result["rootInfo"]["scoreLead"]))
for m in result["moveInfos"][:5]:
    print(m["move"], f"胜率 {m['winrate']:.1%}", f"领先 {m['scoreLead']:+.1f} 目", m["visits"], "次", "后续:", " ".join(m["pv"][:5]))
p.terminate()
