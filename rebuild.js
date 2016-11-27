/* nodejs only file which re-builds lex */

var fs = require('fs');
var PEG = require("pegjs");

fs.readFile('lib/sisal.pegjs', 'utf8', function (err,data) {
  if (err) return console.log(err);
  var parser = PEG.buildParser(data, {output:"source"});
  fs.writeFile('lib/lexer.js', 'lexer = ' + 
                parser + ';', function (err) {
      if (err) return console.log(err);
      console.log('lexer has been rebuilt');
  });
});

fs.readFile('node_modules/indent-adder/index.js', 'utf8', function (err,data) {
  if (err) return console.log(err);
  if (data.indexOf("exports.add_indents =") === -1) throw "Something is wrong with indent-adder";
  fs.writeFile('lib/indenter.js', '(function () {\n' +
                data.replace("exports.", "var ") + "\n" +
                "indenter = function(text) {\n" +
                "return add_indents(text, '__INDENT__', '__DEDENT__',\n" +
                "'#', '\"\\'', '([', ')]')};})();", function (err) {
      if (err) return console.log(err);
      console.log('indenter has been rebuilt');
  });
});
 