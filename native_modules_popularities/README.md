This program aims to find out a list of node modules that contain C/C++ source code, and thus rely on V8 api.

To run the scripts, remove all txt file in the directory, vim main.sh to modify the http://npmjs.com/browse/star?Offset=? page number (starting_page_number and ending_page_number) range if necessary, and type "./main.sh" in the terminal.

All modules' names in the native_modules_names.txt and the result.txt are native modules. The number beside each module name in the result.txt is the number of other modules that are depending on this module.
