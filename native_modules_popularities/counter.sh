#!/bin/bash

declare -A native_modules

#native_modules=( ["node"]=0 )
#${native_modules["node"]}

# read previous result
while read line
do
	# echo $line;

	module_name=$(grep '^[a-zA-Z0-9]\+' -o <<< $line);
	occurrence=$(grep '[0-9]\+$' -o <<< $line);
	
	native_modules["$module_name"]=$(( $occurrence ));
	# echo "$module_name" "-" "${native_modules["$module_name"]}";
done < result.txt

# read file and count ocurrence
while read line
do
 	if [ ${native_modules["$line"]+_} ];  # checking if the key exists
	then
		native_modules["$line"]=$(( ${native_modules["$line"]} + 1 ));
	else
		native_modules["$line"]=1;
	fi
	# echo $line

done < native_module_names.txt

# clear last result
rm result.txt
# sort the result in descending order
while [ ${#native_modules[@]} -gt 0 ]
do
	max_occurrence=0;
	most_popular_module='';	

	# find the maximum
	for name_ in "${!native_modules[@]}";
	do
		if [ ${native_modules["$name_"]} -gt $max_occurrence ];
		then
			max_occurrence=${native_modules["$name_"]};
			most_popular_module=$name_;
		fi
	done

	echo "$most_popular_module - ${native_modules["$most_popular_module"]}" >> result.txt;
	
	unset native_modules["$most_popular_module"];
done























