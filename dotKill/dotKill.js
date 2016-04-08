function modify(str){
  var c=function(e){return e.charCodeAt()}
  var str = str.split("\n").map(function(e){return e.split("").map(c);});
  var str2 = str.map(function(e){return e.slice().reverse()}).reverse();
  return str.map(function(e,i){
    return e.map(function(f,j){
      return H(String.fromCharCode(Math.floor(i+j+(str2[i][j]+f)/2)));
    }).join("")
  }).join("\n");
}
function H(x){if(x.charCodeAt()<32)return H(String.fromCharCode(x.charCodeAt()+95));if(x.charCodeAt()>126)return H(String.fromCharCode(x.charCodeAt()-95));return x;}
function dotKill(e){
  code = modify(e);
  var res = "";
  for(var i=code.length;i>=0;--i){
    try { res = atob(code.slice(0,i)); break; }
    catch(e){ (code.slice(0,i)); continue; }
  }
  if(res) return res;
  var k = "";
  e.split(e[0]).forEach(function(l,i){
    try { while(l.length%4)l+="=";k += atob(l); }
    catch(e){ k += H(String.fromCharCode(i)); }
  });
  return eval(k);
}
