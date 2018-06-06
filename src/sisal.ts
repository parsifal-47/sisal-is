import * as fs from "fs";
import { pd } from "pretty-data";
import { Parser } from "./parser";
import { printPortData } from "./print";
import { Program } from "./program";
import { buildStdLib } from "./stdlib";

const args = process.argv;
let graph = false;

if (args.indexOf("--graph") !== -1) {
  args.splice(args.indexOf("--graph"), 1);
  graph = true;
}

if (args.length < 3) {
  process.stdout.write("Please specify Sisal program to run.\n");
  process.exit(1);
}

const parser = new Parser();
const stdLib = buildStdLib(parser);
const program = new Program(fs.readFileSync(args[2], "utf8"), parser, stdLib);

if (graph) {
  process.stdout.write(pd.xml(program.graphML()));
} else {
  let outNumber = 0;
  for (const port of program.outputs) {
    process.stdout.write("Output #" + (outNumber++) + ": ");
    printPortData(port, (s: string) => process.stdout.write(s));
    process.stdout.write("\n");
  }
}
