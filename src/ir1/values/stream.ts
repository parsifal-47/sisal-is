import * as Types from "../types";
import { ReadyValue } from "./ready";

export class StreamElement extends ReadyValue {
  public value: ReadyValue;
  public constructor(value: ReadyValue) {
    super(new Types.Stream(value.type));
    this.value = value;
  }
}

export class StreamEnd extends ReadyValue {
  public constructor() {
    super(new Types.Stream(new Types.Some()));
  }
}

export class CompleteStream extends ReadyValue {
  public values: ReadyValue[];
  public constructor(values: ReadyValue[]) {
    super(new Types.Stream(values[0].type));
    this.values = values;
  }
}
