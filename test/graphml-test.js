var buster = require("buster");
var assert = buster.referee.assert;
var fs = require("fs");

function checkDir(path) {
  var exclude = [ "nothing_yet_to_exclude" ];
  var data = fs.readdirSync(path);
  for (var i = 0; i < data.length; i++) {
    if (fs.lstatSync(path + data[i]).isDirectory()) {
      if (exclude.indexOf(data[i]) === -1) {
        checkDir(path + data[i] + "/");
      }
      continue;
    }
    console.log(path + data[i]);

    var prog = fs.readFileSync(path + data[i]);

    try {
      AST = lexer.parse(indenter("" + prog));
      assert.greater(AST.length, 0, "lexer for ...");
      var ir = new node.sisalir(AST);
      var graph = ir.toGraphML();
        assert.greater(graph.length, 0, "graphml generator for ...")
    } catch (e) {
      assert(false,
             "Script: " + path + data[i] + (e.line ? " Line:" + e.line : "") +
                 (e.column ? " Column:" + e.column : "") + " Error: " + e);
    }
  }
}

buster.testCase("GraphML", {
  "check all programs in examples folder" : function() {
    console.log("Starting toGraphML test");
    checkDir("examples/");
  }
});
