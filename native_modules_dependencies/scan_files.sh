#!/bin/bash

cd node_modules/

tar -xvzf $1

echo $(find ./ | grep '\.c$\|\.cc$\|\.cpp$\|\.h$') > ../native_source_paths.txt

cd ..
chmod 755 -R node_modules/
rm -rf node_modules/


