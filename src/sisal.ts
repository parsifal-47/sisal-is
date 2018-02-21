import * as fs from "fs";
import { printPortData } from "./print";
import { Program } from "./program";
import { Parser } from "./parser";
import { buildStdLib } from "./stdlib";

if (process.argv.length < 3) {
  process.stdout.write("Please specify Sisal program to run.\n");
  process.exit(1);
}

const parser = new Parser();
const stdLib = buildStdLib(parser);
const program = new Program(fs.readFileSync(process.argv[2], "utf8"), parser, stdLib);

let outNumber = 0;
for (const port of program.outputs) {
  process.stdout.write("Output #" + (outNumber++) + ": ");
  printPortData(port, (s: string) => process.stdout.write(s));
  process.stdout.write("\n");
}
