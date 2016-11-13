var indentadder = require("indent-adder");

console.log(indentadder.add_indents(
"for (var i=0;i<5;i++)\n" +
"    console.log(i);",
"{", "}","#", "'\"", "([", ")]"));
