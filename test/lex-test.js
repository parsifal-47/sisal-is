var buster = require("buster");
var assert = buster.referee.assert;
var fs = require("fs");

function checkDir(path) {
    var exclude = ["unsorted_and_weird", "complex", "controversial"];
    var data = fs.readdirSync(path);
    for (var i = 0; i<data.length; i++) {
        if (fs.lstatSync(path+data[i]).isDirectory()) {
            if (exclude.indexOf(data[i]) === -1) {
                checkDir(path+data[i]+ "/");
            }
            continue;
        }
        console.log(path+data[i]);

        var prog = fs.readFileSync(path+data[i]);
        AST = lex.parse("" + prog);
        assert.greater(AST.length, 0, "lex for ...");
    }
}

buster.testCase("Lex", {
    "trivial lex test": function () {
        AST = lex.parse("1");
        assert.greater(AST.length, 0, "lex should reproduce non-empty program");
    },
    "simple function text": function () {
        AST = lex.parse("function Main2( M,N : integer returns integer )\n" +
                        "   M+N*M\n" +
                        "end function");
        assert.greater(AST.length, 0, "lex should reproduce non-empty program");
    },
    "check all programs in examples folder": function () {
        checkDir("examples/");
    }
});
