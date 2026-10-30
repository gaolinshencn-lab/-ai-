#!/bin/bash
# 实测：GTP 对弈。用法：gtp_test.sh 模型文件名
cd /root/katago
printf 'boardsize 19\nkomi 7.5\nkata-set-rules chinese\nplay B Q16\ngenmove W\nplay B D4\ngenmove W\nshowboard\nquit\n' | \
  ./katago gtp -model models/$1 -config default_gtp.cfg -override-config "numSearchThreads=4,maxVisits=30" 2>/dev/null
