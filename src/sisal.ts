import * as fs from "fs";
import { printPortData } from "./print";
import { Program } from "./program";

if (process.argv.length < 3) {
  process.stdout.write("Please specify Sisal program to run.\n");
  process.exit(1);
}

const program = new Program(fs.readFileSync(process.argv[2], "utf8"));

let outNumber = 0;
for (const port of program.outputs) {
  process.stdout.write("Output #" + (outNumber++) + "\n");
  printPortData(port);
}
