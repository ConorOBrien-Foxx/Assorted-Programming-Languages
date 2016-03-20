/* version 1

#x	push a token char x
=	pop a value N and a token X and sets X to N (redefine)
(...)	push a code block ... to the stack
0...Z	push 0...36
+-*%.	ops ifu (% division, . modulu)
a	print all of stack
e	value equality
g	greater than
l	less than
p	print
~	switch top two
$	drop
:	dup
?	pop N, skip the next char if N is 1
<>^v	directional pointers
|/\	mirrors

*/

function Reng(code){
  this.code = code.split("\n").map(function(e){return e.split("");});
  this.input = [];
  this.input.shift = function(){
  	var a = this[0];
    if(typeof a!=="undefined"){
    	this.splice(0,1);
      return a;
    } else return -1;
  }
  this.pos = {x:0,y:0};
  this.dir = {x:1,y:0};
  this.depth = 1;
  this.mode = 1;
  this.ops = {};
  for(i in Reng.ops){
  	this.ops[i] = Reng.ops[i];
  }
  this.running = true;
  this.buildFunc = "";
  this.stack = [];      // ugh another stack ;_;
  // popping off of empty stack yields 0
  this.stack.pop = function(){
  	var val = this[this.length-1];
    if(typeof val==="undefined") val = 0;
    else this.splice(-1,1);
    return val;
  }
  this.maxLen = this.code.reduce(function(x,y){return Math.max(y.length,x);},"");
  this.code = this.code.map(function(e){while(e.length<this.maxLen)e.push(" ");return e;}.bind(this));
}
Reng.dirChange = function(nx,ny){return function(R){R.dir={x:nx,y:ny}}}
Reng.nullary = function(f){return function(R){R.stack.push(f(R));}}
Reng.nullaryC = function(f){return function(R){R.stack=R.stack.concat(f(R,R.stack.pop()));}}
Reng.dropUse = function(f){return function(R){(f||function(){})(R,R.stack.pop());}}
Reng.binary = function(f){return function(R){var top=R.stack.pop(),sec=R.stack.pop();R.stack.push(f(R,sec,top));}}
Reng.constant = function(v){return function(R){R.stack.push(v);}}
Reng.mode = function(m){return function(R){R.mode=m;}}
Reng.ops = {
  ">":Reng.dirChange(1,0),
  "<":Reng.dirChange(-1,0),
  "^":Reng.dirChange(0,-1),
  "v":Reng.dirChange(0,1),
  "\\":function(R){R.dir={x:R.dir.y,y:R.dir.x};},
  "/":function(R){R.dir={x:-R.dir.y,y:-R.dir.x};},
  "|":function(R){R.dir.x=-R.dir.x},
  "_":function(R){R.dir.y=-R.dir.y},
  "@":function(R){R.dir.x=-R.dir.x;R.dir.y=-R.dir.y;},
  "!":function(R){R.advance();},
  ".":function(R){var g=R.stack.pop();while(g-->0){R.advance()}},
  "?":function(R){var c=R.stack.pop();if(c)R.advance();R.stack.push(c)},
  "q":function(R){var c=R.stack.pop();if(c)R.advance();},
  "s":function(R){var c=R.stack.pop();if(c!==-1)R.advance();R.stack.push(c)},
  ":":Reng.nullaryC(function(R,v){return [v,v]}),
  "e":Reng.binary(function(V,a,b){return +(a==b);}),
  "i":Reng.nullary(function(R){return R.input.shift();}),
  "l":Reng.nullary(function(R){return R.stack.length;}),
  "n":Reng.dropUse(function(R,v){o.innerHTML+=v;}),
  "o":Reng.dropUse(function(R,v){o.innerHTML+=String.fromCharCode(v);}),
  "r":function(R){R.stack.reverse();},
  "t":function(R){var c=R.stack.pop();if(c)Reng.ops["^"](R);else Reng.ops["v"](R);R.stack.push(c);},
  "~":function(R){R.running=false;},
  "$":Reng.dropUse(),
  "+":Reng.binary(function(R,a,b){return a+b;}),
  "-":Reng.binary(function(R,a,b){return a-b;}),
  "*":Reng.binary(function(R,a,b){return a*b;}),
  "%":Reng.binary(function(R,a,b){return a/b;}),
  ",":Reng.binary(function(R,a,b){return a%b;}),
  "#":function(R){
  	R.advance();
    var chr = R.getChar();
    var val = R.stack.pop();
    R.ops[chr] = Reng.constant(val);
  },
  "\"":Reng.mode(2),
  "{":Reng.mode(3),
};

Reng.prototype.getChar = function(){
	return this.code[this.pos.y][this.pos.x];
}
Reng.prototype.advance = function(){
	this.pos.x += this.dir.x;
	this.pos.y += this.dir.y;
  if(this.pos.x < 0) this.pos.x = this.code[this.pos.y].length-1;
  if(this.pos.y < 0) this.pos.y = this.code.length-1;
  if(this.pos.x >= this.maxLen) this.pos.x = 0;
  if(this.pos.y > this.code.length-1) this.pos.y = 0;
}
Reng.prototype.exec = function(){
  var chr = this.getChar();
  if(this.ops[chr]) this.ops[chr](this);
  else if(/[0-9A-Z]/.test(chr)) this.stack.push(parseInt(chr,36));
}
Reng.prototype.step = function(callback){
	if(!this.running) return false;
	callback = callback || function(){};
  switch(this.mode){
  	case 1:
    	this.exec();
      if(!this.running) return false;
      break;
    case 2:
    	if(this.getChar()==="\""){
      	this.mode = 1;
 				break;
      }
      this.stack.push(this.getChar().charCodeAt())
      break;
    case 3:
    	if(this.depth === 0){
      	this.mode = 1;
        break;
      }
  }
  this.advance();
  callback(this);
}
Reng.prototype.display = function(){
  return JSON.stringify(this.code);
}
Reng.prototype.tabulate = function(){
  if(!document) throw new Error("No document present");
  var table = document.createElement("table");
  this.code.forEach(function(e, y){
    var tr = document.createElement("tr");
    e.forEach(function(g, x){
      var td = document.createElement("td");
      if(x===this.pos.x&&y===this.pos.y) td.classList.add("cur");
      td.appendChild(document.createTextNode(g));
      tr.appendChild(td);
    }.bind(this));
    table.appendChild(tr);
  }.bind(this));
  return table;
}

var inst = new Reng(document.getElementById("code").value),
    interval = 0;

function updateDisplay(instance){
	var dispTable = document.getElementById("dispTable");
  Array.from(dispTable.children).forEach(function(e){
  	e.parentNode.removeChild(e);
  });
	dispTable.appendChild(instance.tabulate());
  document.getElementById("stack").innerHTML = "[" + instance.stack.join(", ") + "]<br>{" + instance.input.join(", ") + "}";
}
s.onclick=function(){
	inst=new Reng(document.getElementById("code").value);
  document.getElementById("o").innerHTML="";
  (document.getElementById("input").value.match(/-?\d+\.?\d*|"(\\.|[^"])*"/g)||[]).forEach(function(e){typeof e!=="undefined"?+e==e?inst.input.push(+e):e.slice(1,-1).split("").forEach(function(j){
  	inst.input.push(j.charCodeAt());
  }):""});
  updateDisplay(inst);
}
s.onclick();
r.onclick=function(){
	interval=setInterval(function(){
  	inst.step(updateDisplay);
  },+document.getElementById("int").value);
}
b.onclick=function(){inst.step(updateDisplay)}
q.onclick=function(){clearInterval(interval);}
