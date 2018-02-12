import { Program } from "../src/program";
import { expect } from "chai";
import 'mocha';
import * as fs from "fs";

describe("Smoke test", () => {
  it("Should not crash", () => {
    const program = new Program(fs.readFileSync("test/programs/smoke.sis", "utf8"));
    expect(program.outputs.length).to.equal(1);
  });
});
