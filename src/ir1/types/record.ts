import { ReadyType } from "./ready";

export class Record extends ReadyType {
  public elements: Map<string, ReadyType>;

  constructor(elements: Map<string, ReadyType>) {
    super("Record");
    this.elements = elements;
  }
  public toString() {
    let names: string[] = [];
    this.elements.forEach((value: ReadyType, key: string) => {
      names.push(key + ": " + value.toString());
    });
    return "Record[" + names.join(", ") + "]";
  }
}
