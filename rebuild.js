/* nodejs only file which re-builds lex */

var fs = require('fs');
var PEG = require("pegjs");

fs.readFile('lib/sisal.pegjs', 'utf8', function (err,data) {
  if (err) return console.log(err);
  var parser = PEG.buildParser(data, {output:"source"});
  fs.writeFile('lib/lex.js', 'lex = ' + 
				parser + ';', function (err) {
	  if (err) return console.log(err);
	  console.log('lex has been rebuilt');
  });
});