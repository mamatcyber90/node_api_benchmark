
/*var exec = require('child_process').exec;
function execute(command, callback){
	exec(command, function(error, stdout, stderr){
		callback(stdout); 
	});
};

// call package_name_resolver.sh
execute("./packages.sh", function(output){
	console.log(output);
});
*/

var package_name = process.argv[2];

var fs = require('fs')
fs.readFile('node_modules/' + package_name + '/package.json', 'utf8', function (err, data) {
	if (err) {
		return console.log(err);
	}
	// console.log(data);
	var package = JSON.parse(data);
	
	if (package.files != null)
	{
		// console.log(package.files);
		for (var i = 0; i < package.files.length; i++)
		{
			var file = package.files[i];
			// console.log(package.files[i]);
			var file_type = file.split('.').pop();
			if (file_type == "c" || file_type == "cpp" || file_type == "cc")
			{
				console.log(file + " ---> " + "yes");
			}
		}
	}
	return "haha";
});

















