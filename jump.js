var BAR = "\u2502",
	BLJ = "\u2514",
	BRJ = "\u2518",
	HOR = "\u2500",
	BOK = "X",
	xxx = "`",
	SEP = {disp:" "},
	game = {};
game.x = 0;
game.y = 0;
game.orig = Array(10).fill().map(()=>Array(10).fill(SEP))
/*game.orig = [
	[xxx,xxx,xxx,xxx,xxx,xxx,xxx,xxx,xxx,xxx,xxx,xxx,xxx,xxx,xxx,xxx,xxx,xxx,xxx,xxx,xxx,xxx,xxx,xxx],
	[xxx,SEP,SEP,SEP,SEP,SEP,SEP,SEP,SEP,SEP,SEP,SEP,SEP,SEP,SEP,SEP,SEP,SEP,SEP,SEP,SEP,SEP,SEP,xxx],
	[xxx,SEP,SEP,SEP,SEP,SEP,SEP,SEP,SEP,SEP,SEP,SEP,SEP,SEP,SEP,SEP,SEP,SEP,SEP,SEP,SEP,SEP,SEP,xxx],
	[xxx,SEP,SEP,SEP,SEP,SEP,SEP,SEP,SEP,SEP,SEP,SEP,SEP,SEP,SEP,SEP,SEP,SEP,SEP,SEP,SEP,SEP,SEP,xxx],
	[xxx,SEP,SEP,SEP,SEP,SEP,SEP,SEP,SEP,SEP,SEP,SEP,SEP,SEP,SEP,SEP,SEP,SEP,SEP,SEP,SEP,SEP,SEP,xxx],
	[xxx,xxx,xxx,xxx,xxx,xxx,xxx,xxx,xxx,xxx,xxx,xxx,xxx,xxx,xxx,xxx,xxx,xxx,xxx,xxx,xxx,xxx,xxx,xxx]
];*/
game.board = boxify(game.orig,0,xxx);
game.player = "&theta;";
game.unwalkables = [BOK];
game.walkable = function walkable(chr,x,y){
	x = typeof x === "undefined" ? game.x : x;
	y = typeof y === "undefined" ? game.y : y;
	if(!game.board[y] || !game.board[y][x]) return false;
	chr = typeof chr === "undefined" ? game.orig[y][x] : chr;
	return (chr !== "`" && game.unwalkables.indexOf(chr) < 0/*chr == SEP*/) && x >= 0 && y >= 0;
}
game.direction = 1 // right;
game.keys = {
	// move right
	"ArrowRight": 1,
	"d": 1,
	// move up
	"ArrowUp": 2,
	"w": 2,
	// move left
	"ArrowLeft": 3,
	"a": 3,
	// move down
	"ArrowDown": 4,
	"s": 4,
	// place
	"k": 5,
	"j": 5,
	"h": 5,
	"u": 5,
	// random character
	"`": 6,
	// place head 
	"f": 7,
	// destroy
	"K": 8,
	"J": 8,
	"H": 8,
	"U": 8,
	// read character
	"r": 9,
	// write to read string
	"R": 10,
	// get input
	"i": 11,
	// change direction
	"0": 12,
	"1": 12,
	"2": 12,
	"3": 12,
	"4": 12,
	// log
	"~": 13,
}
game.inputStr = "";
game.update = function update(){
	document.getElementById("board").innerHTML = game.board.map(function(e){
		return e.map(function(e){
			// this is classifying the cells
			return "<span class='cell'>"+(e.disp || e)+"</span>";
		}).join("");
	}).join("\n");
}
game.superUpdate = function superUpdate(){
	game.board = boxify(game.orig,0,xxx);
	game.update();
}
game.place = function place(){
	//console.log(game.player);
	game.board[game.y][game.x] = "<span class='player' title='this is you...'>"+game.player+"</span>";
}
game.readStr = "";
game.move = function move(e){
	if(!e) return false;
	var ox = game.x, oy = game.y;
	game.board[game.y][game.x] = game.orig[game.y][game.x];
	e = e.key || e;
	if(game.keys[e] <= 4 && game.keys[e] >= 1) game.direction = game.keys[e];
	switch(game.keys[e]){
		case 1:
			game.x++;
			break;
		case 2:
			game.y--;
			break;
		case 3:
			game.x--;
			break;
		case 4:
			game.y++;
			break;
		case 5:
			var v = e === "j" ? 1 : e === "u" ? -1 : 0,
				u = e === "k" ? 1 : e === "h" ? -1 : 0;
			game.orig[game.y+v][game.x+u] = xxx;
			game.superUpdate();
			break;
		case 6:
			var players = ["&theta;","&omega;","&tau;"];
			game.player = players[players.indexOf(game.player)+1] || players[0];
			break;
		case 7:
			game.orig[game.y][game.x] = game.player;
			break;
		case 8:
			var v = e === "J" ? 1 : e === "U" ? -1 : 0,
				u = e === "K" ? 1 : e === "H" ? -1 : 0;
			game.orig[game.y+v][game.x+u] = SEP;
			game.superUpdate();
			break;
		case 9:
			game.player = game.orig[game.y][game.x].disp || game.orig[game.y][game.x];
			game.place();
			game.update();
			break;
		case 10:
			console.log(game.orig[game.y][game.x]);
			game.readStr += game.orig[game.y][game.x];
			break;
		case 11:
			game.orig[game.y][game.x] = (prompt()||"")[0]||SEP;
			break;
		case 12:
			game.direciton = +e;
			break;
		case 13:
			console.log(game.direction,game.direction===1?1:game.direction===3?-1:0,game.direction===4?1:game.direction===2?-1:0);
			break;
		default:
			console.log(e,game.keys[e]);
			return false;
			break;
	}
	console.log(game.x,game.y);
	if(game.y >= game.orig.length){
		game.orig[game.y] = Array(game.orig[game.y-1].length).fill(SEP);
		game.superUpdate();
	} else if(game.y < 0){
		game.orig.unshift(Array(game.orig[game.y+1].length).fill(SEP));
		game.y = 0;
		game.superUpdate();
	} else if(game.x >= game.orig[game.y].length){
		for(var i=0;i<game.orig.length;i++){
			game.orig[i].push(SEP);
		}
		game.superUpdate();
	} else if(game.x < 0){
		for(var i=0;i<game.orig.length;i++){
			game.orig[i].unshift(SEP);
		}
		game.x = 0;
		game.superUpdate();
	}
	if(game.walkable()){
		game.place();
		game.update();
	} else {
		game.x = ox;
		game.y = oy;
	}
	return true;
}

var keyPresses = "";

window.addEventListener("load",function(){
	game.place();
	game.update();
	document.getElementById("board").addEventListener("click",function(){
		document.getElementById("capture").focus();
	});
	document.getElementById("capture").addEventListener("keydown",function(e){
		game.move(e);
		keyPresses += e.key;
	});
	document.getElementById("run").addEventListener("click",function(){
		var c = " "+document.getElementById("code").value,placing=false;
		setTimeout(function(i){
			if(c[i] === "'"){
				game.player = c[++i];
				//console.log(c,i,c[i]);
				//i++;
				game.place();
				game.update();
			} else if(c[i] === "]"){
				if(game.orig[game.y][game.x] === SEP){
					var d = 1;
					while(d && i > 0){
						--i;
						if(c[i] === "[") d--;
						else if(c[i] === "]") d++;
					}
					arguments.callee(i);
					//setTimeout(arguments.callee,200,i);
					return;
				} else i++;
			} else if(c[i] === "{"){
				if(game.orig[game.y+(game.direction&&game.direction%2)][game.x+(game.direction&&!(game.direction%2))]!==game.player){
					var d = 1;
					while(d && i < c.length){
						i++;
						if(c[i] === "{") d++;
						else if(c[i] === "}") d--;
					}
					setTimeout(arguments.callee,0,i);
					return;
				} else i++;
			} else if(c[i] === ")"){
				if(game.x !== 1){
					var d = 1;
					while(d && i > 0){
						--i;
						if(c[i] === "(") d--;
						else if(c[i] === ")") d++;
					}
					setTimeout(arguments.callee,200,i);
					return;
				} else i++;
			} else if(c[i] === ">"){
				if(game.orig[game.y][game.x] !== c[i+1]){
					var d = 1;
					while(d && i > 0){
						--i;
						if(c[i] === "<") d--;
						else if(c[i] === ">") d++;
					}
					setTimeout(arguments.callee,200,i);
					return;
				} else i++;
			} else if(c[i] === "p"){
				if(game.orig[game.y][game.x] !== game.player){
					var d = 1;
					while(d && i > 0){
						--i;
						if(c[i] === "q") d--;
						else if(c[i] === "p") d++;
					}
					setTimeout(arguments.callee,200,i);
					return;
				} else i++;
			} else if(c[i] === "\\"){
				if(game.orig[game.y][game.x] !== game.orig[game.y+1][game.x]){
					var d = 1;
					while(d && i > 0){
						--i;
						if(c[i] === "/") d--;
						else if(c[i] === "\\") d++;
					}
					setTimeout(arguments.callee,200,i);
					return;
				} else i++;
			} else if(c[i] === "\""){
				var s = "";
				while(c[i] !== "\""){
					if(c[i] === "\\"){
						s += "\\";
					}
					s += c[++i];
				}
			} else if(c[i] === "l"){
				Array.from(document.querySelectorAll(".cell")).forEach(function(e){
					e.style.backgroundColor = ["Black","Red","Green","Yellow","Blue","Magenta","Cyan","Light gray","Dark gray","Light red","Light green","Light yellow","Light blue","Light magenta","Light cyan","White"][parseInt(c[i+1],16)];
				});
			} else if(c[i] === "z"){
				if(!placing){
					setTimeout(arguments.callee,200,i);
					placing = true;
					return;
				}
				else {
					if(game.readStr.length){
						game.move("d");
						game.player = game.readStr[0];
						game.readStr = game.readStr.slice(1);
						game.move("f");
						setTimeout(arguments.callee,200,i);
						return;
					} else {
						setTimeout(arguments.callee,200,i+1);
						placing = false;
						return;
					}
				}
			} else {
				var a = game.move(c[++i]);
				if(!a) return setTimeout(arguments.callee,0,i);
			}
			if(i<c.length) setTimeout(arguments.callee,200,i);
		},200,0);
	});
	document.getElementById("capture").focus();
});
