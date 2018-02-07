import { ReadyType } from "../types/ready";

export class ReadyValue {
  type: ReadyType;
  constructor(type: ReadyType) {
    this.type = type;
  }
}
