import { ReadyType } from "./ready";

export class Function extends ReadyType {
  public params: ReadyType[];
  public returns: ReadyType[];

  constructor(params: ReadyType[], returns: ReadyType[]) {
    super("Function");
    this.params = params;
    this.returns = returns;
  }
  public toString() {
    const getNames = (subtypes) => subtypes.map((e) => e.toString()).join(", ");
    return "Function[" + getNames(this.params) + " returns " + getNames(this.returns) "]";
  }
}
