import * as Types from "../types";
import { ReadyValue } from "./ready";
import { Port } from "../ports/port";
import { StreamElement, CompleteStream, StreamEnd } from "./stream";

export function fetchComplete(port: Port, type: Types.ReadyType): ReadyValue {
  const value = port.getData(type);
  if (value instanceof StreamElement) {
    let values: ReadyValue[] = [];
    let lastValue = value;
    while (lastValue instanceof StreamElement) {
      values.push(lastValue.value);
    }
    return new CompleteStream(values);
  }
  return value;
}
