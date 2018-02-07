import { ReadyType } from "./ready";

export class Stream extends ReadyType {
  public element: ReadyType;

  constructor(element: ReadyType) {
    super("Stream");
    this.element = element;
  }
  public toString() {
    return "Stream[" + this.element.toString() + "]";
  }
}
