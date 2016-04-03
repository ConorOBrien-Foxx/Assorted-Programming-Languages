var code;
var submit;
var output;
function alert(val){
	output.appendChild(document.createTextNode(val));
	return val;
}

window.addEventListener("load", function(e){
	code = document.getElementById("code");
	submit = document.getElementById("submit");
	output = document.getElementById("output");
	submit.addEventListener("click", function(){
		output.innerHTML = "";
		var options = {lastVal: 0};
		var nCode = code.value.replace(/\s/g,"").split(/;/g);
		for(var i = 0; i < nCode.length; i++){
			var line = nCode[i];
			if(line.length == 0) continue;
			options.lastVal = Constant.parse(line, options);
			console.log(options.lastVal);
		}
	});
});
