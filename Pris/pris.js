function note(s) {
  console.log(s);
}

function numOf(str){
  for(var i=s=0;i<str.length;i++){
    s = str[i]==="]"?s*2+1:str[i]==="["?s*2-1:s+1;
  }
  return s;
}

function Pris(code){
  code = code.match(/([)}{(])(\1|[[\]])*/g);
  var arr = [0,0], focus = 0, out = "";
  // [left, right];
  for(var i=0;i<code.length;i++){
    var cur = code[i], type = cur.replace(/[[\]]/g,"")[0], mode = numOf(cur);
    if(cur.search(/[}){(]/g)<0) throw new Error("Unknown group type at group "+i);
    switch(type){
      case "(":
        arr[focus] += mode;
        break;
      case ")":
        arr[1-focus] += mode;
        break;
      case "{":
        focus = mode % 2;
        break;
      case "}":
        switch(mode){
          case 1:
            arr[focus] = prompt().charCodeAt();
            break;
          case 2:
            arr[focus] = +prompt();
            break;
          case 3:
            note(out += String.fromCharCode(arr[focus]));
            break;
          case 4:
            note(out += arr[focus]);
            break;
          case 5:
            if(arr[focus]) i++;
            break;
          case 6:
            i = arr[1-focus] - 1;
            break;
          case 7:
            if(arr[focus]) i = arr[1-focus] - 1;
            break;
          case 8:
            arr[focus] += arr[1-focus];
            break;
          case 9:
            arr[focus] *= arr[1-focus];
            break;
          case 10:
            arr[focus] /= arr[1-focus];
            break;
          case 11:
            arr[focus] -= arr[1-focus];
            break;
          case 12:
            arr[focus]++;
            break;
          case 13:
            arr[focus]--;
            break;
          case 14:
            alert(out);
            out = "";
          default:
            process.stderr.write(mode + "\n");
            break;
        }
        break;
    }
  }
  return { out, arr };
}

if(typeof require !== "undefined") {
  if(require.main === module) {
    const fs = require("fs");
    prompt = require("prompt-sync")();
    alert = console.log;
    note = () => {};
    code = process.argv[2];
    if(process.argv[3] === "n") {
      note = s => process.stderr.write(`NOTE: ${s}\n`);
    }
    try {
      code = fs.readFileSync(code).toString();
    }
    catch {}
    let res = Pris(code);
    note(JSON.stringify(res.arr));
    if(res.out) {
      alert(res.out);
    }
  }
  else {
    module.exports = Pris;
  }
}
