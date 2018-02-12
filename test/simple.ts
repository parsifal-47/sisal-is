import { Interpreter } from "../src/interpreter";
import { expect } from "chai";
import 'mocha';

describe("Smoke test", () => {
  it("Should not crash", () => {
    const program = "main = f()\n  1";
    const interpreter = new Interpreter();
    const result = interpreter.run(program);
    expect(result).to.equal(0);
  });
});
