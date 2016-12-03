var buster = require("buster");
var assert = buster.referee.assert;
var fs = require("fs");

function checkDir(path) {
    var exclude = ["if_something_need_to_be_excluded"];
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

        try {
            AST = lexer.parse(indenter("" + prog));
            assert.greater(AST.length, 0, "lexer for ...");
        } catch (e) {
            assert(false, "Script: " + path + data[i] +
                (e.line ? " Line:" + e.line : "") +
                (e.column ? " Column:" + e.column : "") +
                " Error: " + e);
        }
    }
}

buster.testCase("Lex", {
    "trivial lex test": function () {
        AST = lexer.parse(indenter("1"));
        assert.greater(AST.length, 0, "lexer should reproduce non-empty program");
    },
    "check all programs in examples folder": function () {
        checkDir("examples/");
    }
});
