#!/bin/bash

cd $(dirname "$0")/node_modules/
pwd

# $1 is the tarball url in npm view package_name
url=$1


wget -q $url


tar -xvzfq 

# rm native_source_paths.txt
echo $(find ./ | grep '\.c$\|\.cc$\|\.cpp$\|\.h$') > native_source_paths.txt


rm -rf package/
rm *.tgz




