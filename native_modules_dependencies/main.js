var child_process = require('child_process');
var fs = require('fs');

var state = fs.readFileSync('state.json', 'utf8');
state = JSON.parse(state);

var modules = fs.readFileSync('modules.json', 'utf8');
modules = JSON.parse(modules);

var contents = fs.readFileSync('module_names.txt', 'utf8');
var module_names = contents.split('\n');


function missAndInsert (array, element){
	if (array.indexOf(element) === -1){
      		array.push(element);
    	}
}



// iterates through the list of module names and performs benchmark
for (var i=state.nextStartIndex; i<=state.nextEndIndex && i<module_names.length; i++){
	console.log("**************************************************");
	console.log("start processing  # " + i + " - " + module_names[i]);
	
	if (modules[module_names[i]] == null){
		modules[module_names[i]] = {
			depend: [],
			support: [],
			native: false
		};
	}
	
	console.log("scanning dependencies ...");
	// get dependency info
	// try{ child_process.execSync('rm dependencies.txt');} catch(err){}
	child_process.execSync('npm view ' + module_names[i] + ' dependencies > dependencies.txt');
	var dependencies_info = fs.readFileSync('dependencies.txt', 'utf8');

	var dependencies = dependencies_info.split('\n');
	for (var j=0; j<dependencies.length; j++){
		// get module name
		// console.log(lines[j]);
		// supporting_module = lines[j].trim().split(':')[0].replace(/'/g, "");
		var regex = new RegExp("[a-zA-Z0-9\-]+");
		var dependency = regex.exec(dependencies[j]);
		if (dependency != null && dependency != "undefined"){
			missAndInsert (modules[module_names[i]].depend, dependency[0]);			
		}
	}
	
	// try{ child_process.execSync('rm distribution.txt'); } catch(err){}
	child_process.execSync('npm view ' + module_names[i] + ' dist.tarball > distribution.txt');
	
	var url = fs.readFileSync('distribution.txt', 'utf8');
	if (url != null && url.length != 0){
		console.log("downloading files ...");
		child_process.execSync('./download.sh ' + url);

		var package_name = url.split('/').pop();
		console.log("extracting " + package_name + " and scanning files");
		child_process.execSync('./scan_files.sh ' + package_name);
		
		var native_source_paths = fs.readFileSync ('./native_source_paths.txt').toString();
		if (native_source_paths != null){
			if (native_source_paths.search("node_modules") != -1){ // using some other modules's code
				native_source_paths = native_source_paths.split(" ");
				for (var k=0; k<native_source_paths.length; k++){
					if (native_source_paths[k].search() == -1){
						modules[module_names[i]].native = true;
						console.log("Identified as native module.");
					}
					else {
						var dir_path = native_source_paths[k].split("/");
						var hidden_dependency = dir_path[dir_path.indexOf("node_modules") + 1];
						missAndInsert (modules[module_names[i]].depend, hidden_dependency);
					}
				}
			}
			else if (native_source_paths.search(/\.c|\.cpp|\.cc|\.h/g) != -1){
				modules[module_names[i]].native = true;
				console.log("Identified as native module.");
			}
		}
	}

	
	// output to the modules.json
	fs.writeFileSync("modules.json", JSON.stringify(modules, null, '\t'));
	
	state.nextStartIndex = state.nextStartIndex + 1;
	state.nextEndIndex = state.nextEndIndex + 1;
	
	fs.writeFileSync("state.json", JSON.stringify(state, null, '\t'));

	console.log("finish processing # " + i + " - " + module_names[i]);
	console.log("**************************************************");
}

// output to the modules.json
fs.writeFile("modules.json", JSON.stringify(modules, null, '\t'), function(err) {
    if(err) {
        return console.log(err);
    }

    console.log("data saved!");
}); 



state.nextStartIndex = nextStartIndex + 1;
state.nextEndIndex = state.nextEndIndex + 1;








