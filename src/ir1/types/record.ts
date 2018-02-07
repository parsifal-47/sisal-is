import { ReadyType } from "./ready";

export class Record extends ReadyType {
  public elements: ReadyType[];

  constructor(elements: ReadyType[]) {
    super("Record");
    this.elements = elements;
  }
  public toString() {
    return "Record[" + this.elements.map((e) => e.toString()).join(", ") + "]";
  }
}
