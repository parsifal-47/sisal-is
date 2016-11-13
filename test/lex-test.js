var buster = require("buster");
var assert = buster.referee.assert;
var fs = require("fs");

function checkDir(path) {
    var exclude = ["if_something_has_to_be_excluded"];
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
    "check all programs in examples folder": function () {
        checkDir("examples/");
    }
});
