var fs = require('fs');

var child_process = require('child_process');

var modules = JSON.parse(fs.readFileSync('modules.json'));

var num_of_native_modules = 0;
var num_of_native_modules_dependent = 0;
var total_number = 0;

function checkDependOnNative (modules, module_name){
	if(modules[module_name] != null) { 
		if (modules[module_name].depend_on_native != null) {
			return modules[module_name].depend_on_native;
		}
		else {
			modules[module_name].depend_on_native = false;
		
			var depend = modules[module_name].depend;	
			for (var i=0; i<depend.length; i++){
				if (modules[depend[i]] != null && modules[depend[i]].native == true){
					modules[module_name].depend_on_native = true;
					return true;
				}
				else if (checkDependOnNative (modules, depend[i]) == true){
					modules[module_name].depend_on_native = true;
					return true;
				}
			}
			modules[module_name].depend_on_native = false;
			return false;
		}
	}
	else {
/*		// analyze the unfound module
		var analyzer = require('./analyzer');
		analyzer.analyzeModuleDependencies (modules, module_name);
*/
		// return false for now
		return false;
	}
}

for (var module in modules){
	if (modules[module].native == true){
		console.log(module);
		num_of_native_modules ++;
	}

	if (checkDependOnNative (modules, module)){
		num_of_native_modules_dependent ++;
	}

	total_number ++;
}

var percent_of_native_modules = ((num_of_native_modules / total_number) * 100.0).toFixed(2);

var percent_of_native_modules_dependent = ((num_of_native_modules_dependent / total_number) * 100.0) .toFixed(2);

console.log ("number of native modules = " + num_of_native_modules + " (" + percent_of_native_modules + "%)");

console.log ("number of modules depending on native modules = " + num_of_native_modules_dependent + " (" + percent_of_native_modules_dependent + "%)");

console.log ("number of modules in this benchmark = " + total_number);

// fs.writeFileSync ('modules.json', JSON.stringify((modules, null, '\t'));





