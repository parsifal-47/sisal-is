import { Port } from "../ports/port";
import * as Types from "../types";
import { ReadyValue } from "./ready";
import { CompleteStream } from "./streamComplete";
import { StreamElement } from "./streamElement";
import { StreamEnd } from "./streamEnd";

export function fetchComplete(port: Port, type: Types.ReadyType): ReadyValue {
  const value = port.getData(type);
  if (value instanceof StreamElement) {
    const values: ReadyValue[] = [];
    let lastValue: ReadyValue = value;
    let index = 0;
    while (lastValue instanceof StreamElement) {
      index += 1;
      values.push(lastValue.value);
      lastValue = port.getData(type, index);
    }
    return new CompleteStream(values);
  }
  return value;
}
