#!/bin/bash
# Build script for push-puzzle
r.js -o app.build.js
rm -f ../push-puzzle.optimized/app.build.js 
rm -f ../push-puzzle.optimized/build.txt
rm -f ../push-puzzle.optimized/build.sh
rm -rf ../push-puzzle.optimized/js/view
rm -rf ../push-puzzle.optimized/js/vendor/require-2.1.6.js
rm -rf ../push-puzzle.optimized/js/vendor/libsvg-ide.js
rm -rf ../push-puzzle.optimized/.idea
rm -rf ../push-puzzle.optimized/.git
sed -e "s@<html>@<html manifest='index.appcache'>@g" index.html | sed -e "s@<script data-main='js/main' src='js/vendor/require-2.1.6.js'></script>@<script type='text/javascript' src='js/main.js'></script>@g" > ../push-puzzle.optimized/index.html
rm -rf ../push-puzzle.zip
DATE=`date`
VERSION=`grep version manifest.webapp | sed -e 's/[^0-9.]*//g'`
EXPR="s/#.*/#v${VERSION} ${DATE}/g"
sed -e "${EXPR}" index.appcache > ../push-puzzle.optimized/index.appcache
( cd ../push-puzzle.optimized ; zip -9 -v -r ../push-puzzle.zip .)
