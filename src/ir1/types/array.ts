import { ReadyType } from "./ready";

export class Array extends ReadyType {
  public element: ReadyType;

  constructor(element: ReadyType) {
    super("Array");
    this.element = element;
  }
  public toString() {
    return "Array[" + this.element.toString() + "]";
  }
}
