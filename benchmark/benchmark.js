// - -------------------------------------------------------------------- - //
// mock mocha functions

global.describe = function(name,code) {
  console.log(name);
  code();
}

global.it = function(name,code) {
  var count = 10000;
  var times = [];
  for (var i = 0; i < count; i++) {
    var start = Date.now();
    code();
    times.push(Date.now() - start);
  }
  var total = 0;
  for (var i = 0; i < count; i++) {
    total += times[i];
  }
  var avg = (total / count).toFixed(4);
  var min = Math.min.apply(Math,times).toFixed(4);
  var max = Math.max.apply(Math,times).toFixed(4);
  total = total.toFixed(4);
  while (name.length < 20) {
    name += " ";
  }
  console.log(" .",name,"(avg: " + avg + ", total: " + total + ", min: " + min + ", max: " + max + ")");
}

// - -------------------------------------------------------------------- - //
// execute all tests

require("fs").readdir(__dirname + "/../test",function(error,files) {
  if (files) {
    files.forEach(function(file) {
      if (/^test[\w\-]*\.js$/.test(file)) {
        require("../test/" + file);
      }
    });
  }
});

// - -------------------------------------------------------------------- - //
