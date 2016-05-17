#!/bin/bash

echo "Start Benchmarking -----------------------------"


rm module_names.txt

# 
starting_page_number=10
ending_page_number=10

# iterate through each page to get module name on the web (https://www.npmjs.com/browse/star?offset=$i)
# for i in {$starting_page_number..$ending_page_number}
for ((i=starting_page_number; i<=$ending_page_number; i++));
do
	./module_names_resolver.sh $i
done


# get the module names by running module_names_resolver.sh which output to module_names.txt
while read module_name
do
	# install module
	echo "****************************************"
	echo "installing $module_name"
	npm install $module_name	

	# analyze the modulee by looking at files, to see whther it is a native api or not
	echo "****************************************"
	echo "analyzing $module_name"

	# finding native modules among the module itself and its supporting modules
	echo "native code paths"
	echo $(find node_modules/ | grep '\.c$\|\.cc$\|\.cpp$\|\.h$')
	echo "native module paths"
	native_module_paths=$(find node_modules/ | grep '\.c$\|\.cc$\|\.cpp$\|\.h$' | grep -o '^node_modules/[a-zA-Z0-9\-\_\.]*' | sort | uniq)
	echo $native_module_paths

	# take out all "node_modules/" in the names by replacing them with a space
	native_module_names=${native_module_paths//'node_modules/'/" "}

	# transform the string into an array of names
	name_array=$(echo ${native_module_names})
	
	# output into a file
	for name in $name_array
	do
        	echo "-----" $name
		echo $name >> native_module_names.txt
	done
	
	# uninstall module after analysis
	echo "****************************************"
	echo "uninstalling $module_name"
	npm uninstall $module_name
	
	# just to make sure all modules are removed
	rm -rf node_modules
done < module_names.txt


echo "Benchmark finished.-------------------------------------------"
echo "Native modules found is store in the native_module_names.txt"

# count how many occurance in the file each modules has and sort them in descending order of occureance
./counter.sh
echo "Check result.txt for ranking"


