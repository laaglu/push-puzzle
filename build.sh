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
mv ../push-puzzle.optimized/index.html.opt ../push-puzzle.optimized/index.html
rm -rf ../push-puzzle.zip
sleep 1
touch ../push-puzzle.optimized/index.appcache
( cd ../push-puzzle.optimized ; zip -9 -v -r ../push-puzzle.zip .)
