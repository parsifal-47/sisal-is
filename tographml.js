require("./lib/graphml.gen");
require("./lib/lexer.js");
require("./lib/indenter.js");
require("./lib/ir.nodes.js");
require("./lib/ir.other.js");
require("./lib/ir.gen.js");

var fs = require('fs');

if (!process.argv[2] || !process.argv[3]) {
  console.log("Please specify input and output file");
  return;
}

fs.readFile(process.argv[2], 'utf8', function(err, data) {
  if (err)
    return console.log(err);

  var ast = lexer.parse(indenter("" + data));
  var ir = new node.sisalir(ast);
  var graph = ir.toGraphML();
    fs.writeFile(process.argv[3], graph, function(err) {
    if (err)
      return console.log(err);
    console.log('output written to ' + process.argv[3]);
  });
});
