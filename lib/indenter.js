(function() {
var add_indents = function(text, indent_token, dedent_token, line_comment,
                           commas, lbrackets, rbrackets) {
  var lines = text.split("\n");
  var indents = [ 0 ];
  var bracket = [];
  var comma = null;
  var result = "";

  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];

    if (bracket.length == 0 && comma == null) {
      var firstPosition = line.search(/\S/);
      if ((firstPosition !== -1) &&
          (line.indexOf(line_comment) == firstPosition)) {
        firstPosition = -1;
      }
      if (firstPosition !== -1) {
        if (firstPosition > indents[indents.length - 1]) {
          indents.push(firstPosition);
          result += indent_token;
        }
        while (firstPosition < indents[indents.length - 1]) {
          result += dedent_token;
          indents.pop();
        }
        if (firstPosition !== indents[indents.length - 1]) {
          throw "Unrecognized indent at line " + i;
        }
      }
    }

    for (var k = 0; k < line.length; k++) {
      if (line[k] == "\\") {
        k++;
        continue;
      }
      if (comma === null && line.indexOf(line_comment, k) === k)
        break;
      if (commas.indexOf(line[k]) !== -1) {
        if (comma == line[k])
          comma = null;
        else if (comma == null)
          comma = line[k];
      }
      if (comma == null) {
        if (lbrackets.indexOf(line[k]) !== -1) {
          bracket.push(rbrackets[lbrackets.indexOf(line[k])]);
        }
        if (rbrackets.indexOf(line[k]) !== -1) {
          if (bracket.length == 0) {
            throw "Bracketig error at line " + i + " column " + k +
                " closing without opening";
          }
          if (line[k] !== bracket[bracket.length - 1]) {
            throw "Bracketing error at line " + i + " column " + k + ", " +
                "expecting: " + bracket[bracket.length - 1] +
                " got: " + line[k];
          }
          bracket.pop();
        }
      }
    }
    result += line + "\n";
  }

  if (bracket.length > 0 || comma != null) {
    throw "Unexpected end of input";
  }

  while (0 < indents[indents.length - 1]) {
    result += dedent_token;
    indents.pop();
  }

  return result;
} indenter = function(text) {
  return add_indents(text, '__INDENT__', '__DEDENT__ ', '#', '"\'', '([', ')]')
};
})();
