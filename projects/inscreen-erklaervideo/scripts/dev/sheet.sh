#!/bin/bash
# sheet.sh <out.png> <cols> img1 img2 ...  -> Kontaktbogen mit Zeitstempel-Beschriftung
out=$1; cols=$2; shift 2
d=$(mktemp -d); i=0
for f in "$@"; do n=$(printf "%02d" $i); lbl=$(basename "$f" .png | sed 's/.*_//'); ffmpeg -v error -y -i "$f" -vf "drawtext=text='t=$lbl':x=12:y=12:fontsize=26:fontcolor=white:box=1:boxcolor=black@0.6" $d/s_$n.png; i=$((i+1)); done
rows=$(( (i + cols - 1) / cols ))
ffmpeg -v error -y -i $d/s_%02d.png -vf "tile=${cols}x${rows}:padding=6:color=white" -frames:v 1 "$out"; rm -rf $d
