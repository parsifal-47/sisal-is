import { Program } from "../src/program";
import { Parser } from "../src/parser";
import { buildStdLib } from "../src/stdlib";
import { printPortData } from "../src/print";
import { expect } from "chai";
import "mocha";
import * as fs from "fs";

const testPath = "test/programs/";

describe("All tests", () => {
  const parser = new Parser();
  const stdLib = buildStdLib(parser);

  it("Should not crash", () => {
    const program = new Program(fs.readFileSync(testPath + "smoke.sis", "utf8"), parser, stdLib);
    expect(program.outputs.length).to.equal(1);
  });
  it("Should not crash 2", () => {
    const program = new Program(fs.readFileSync(testPath + "arith.sis", "utf8"), parser, stdLib);
    expect(program.outputs.length).to.equal(6);
  });

  const folder = fs.readdirSync(testPath);
  for (const fileName of folder) {
    if (fs.lstatSync(testPath + fileName).isDirectory() || fileName.endsWith(".result")) {
      continue;
    }
    it("Check " + fileName, () => {
      const program = new Program(fs.readFileSync(testPath + fileName, "utf8"), parser, stdLib);
      let result = "";
      for (const port of program.outputs) {
        printPortData(port, (s: string) => result += s);
        result += "\n";
      }
      expect(result).to.equal(fs.readFileSync(testPath + fileName + ".result", "utf8"));
    });
  }
});
