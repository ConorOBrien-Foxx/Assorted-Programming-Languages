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
            arr[focus] = prompt.charCodeAt();
            break;
          case 2:
            arr[focus] = +prompt.charCodeAt();
            break;
          case 3:
            console.log(out += String.fromCharCode(arr[focus]));
            break;
          case 4:
            console.log(out += arr[focus]);
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
          default:
            console.log(mode);
            break;
        }
        break;
    }
  }
  return arr;
}
