#!/bin/bash


#echo -n "Enter page number"
#read page_number
#offset=$(((page_number-1)*36))
offset=$((($1 - 1) * 36))


# html=$(curl -L www.npmjs.com/browse/star?)
wget -O page.html "https://www.npmjs.com/browse/star?offset="$offset


# get links by matching regex using grep in the html file
# finding the right <a> tag and then finding module
# '-o' option returns only match instead of outputting whole line
a_tags=$(grep '<a class="name" href="/package.*">' page.html -o)


# take out all "//package" in the names by replacing them with a space
names=${a_tags//'<a class="name" href="/package/'/" "}

names=${names//'">'/" "}
echo $names
echo "****************************************************************"

# transform the string into an array of anmes
name_array=$(echo ${names})

# output into a file
for name in $name_array
do
	echo $name >> module_names.txt
done

# done for getting module names
echo "check module names in 'module_names.txt'"























