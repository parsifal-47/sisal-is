import { ReadyType } from "../types/ready";

export class ReadyValue {
  public type: ReadyType;
  constructor(type: ReadyType) {
    this.type = type;
  }
}
