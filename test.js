var a = { "one" : 1, "two" : 2 };
var b = { "three" : 3 };
var c = { "four" : 4, "five" : 5 };

function collect() {
  var ret = {};
  var len = arguments.length;
  var p;
  for (var i=0; i<len; i++) {
    for (p in arguments[i]) {
      if (arguments[i].hasOwnProperty(p)) {
        ret[p] = arguments[i][p];
      }
    }
  }
  return ret;
}

var d = collect(a, b, c);

console.log(d);