import * as Types from "../types";
import { ReadyValue } from "./ready";

export class Record extends ReadyValue {
  public values: Map<string, ReadyValue>;
  public constructor(type: Types.ReadyType, values: Map<string, ReadyValue>) {
    super(type);
    this.values = values;
  }
}
