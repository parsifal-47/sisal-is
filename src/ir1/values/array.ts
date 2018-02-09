import * as Types from "../types";
import { ReadyValue } from "./ready";

export class Array extends ReadyValue {
  public values: ReadyValue[];
  public constructor(values: ReadyValue[]) {
    super(new Types.Array(values[0].type));
    this.values = values;
  }
}
