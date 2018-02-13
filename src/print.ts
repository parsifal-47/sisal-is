import { Port } from "./ir1/ports/port";
import * as Types from "./ir1/types";
import * as Values from "./ir1/values";

export function printPortData(input: Port, print: (s: string) => void) {
  const value = input.getData(new Types.Some());
  if (value instanceof Values.Integer) {
    print(value.type.toString() + " = " + value.value);
    return;
  }
  if (value instanceof Values.Float) {
    print(value.type.toString() + " = " + value.value);
    return;
  }
  if (value instanceof Values.Boolean) {
    print(value.type.toString() + " = " + value.value);
    return;
  }
  if (value instanceof Values.ErrorValue) {
    print(value.type.toString() + " = " + value.value);
    return;
  }
  print(JSON.stringify(input.getData(new Types.Some())));
}
