import * as fs from "fs";
import { Interpreter } from "./interpreter";

if (process.argv.length < 3) {
  process.stdout.write("Please specify Sisal program to run.\n");
  process.exit(1);
}

const interpreter = new Interpreter();
const program = fs.readFileSync(process.argv[2], "utf8");
interpreter.run(program);
