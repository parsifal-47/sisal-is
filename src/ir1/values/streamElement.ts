import * as Types from "../types";
import { ReadyValue } from "./ready";

export class StreamElement extends ReadyValue {
  public value: ReadyValue;
  public constructor(value: ReadyValue) {
    super(new Types.Stream(value.type));
    this.value = value;
  }
}
