# 把 src/ 里的文件拼成一个单文件网页：index.html（可直接双击打开 / GitHub Pages）
import pathlib
src = pathlib.Path(__file__).parent
root = src.parent
shell = (src / "shell.html").read_text()
style = (src / "style.css").read_text()
script = "\n".join((src / f).read_text() for f in ["lessons.js", "kata.js", "widgets.js", "app.js"])
body = shell.replace("/*STYLE*/", style).replace("/*SCRIPT*/", script)
(root / "index.html").write_text(
    '<!doctype html>\n<html lang="zh-CN">\n<head>\n<meta charset="utf-8">\n'
    '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
    + body + "\n</html>\n"
)
print("index.html written")
