import { Port } from "./ir1/ports/port";
import * as Types from "./ir1/types";
import * as Values from "./ir1/values";

export function printPortData(input: Port) {
  const value = input.getData(new Types.Some());
  if (value instanceof Values.Integer) {
    process.stdout.write(value.type.toString() + " = " + value.value + "\n");
    return;
  }
  if (value instanceof Values.Float) {
    process.stdout.write(value.type.toString() + " = " + value.value + "\n");
    return;
  }
  if (value instanceof Values.Boolean) {
    process.stdout.write(value.type.toString() + " = " + value.value + "\n");
    return;
  }
  if (value instanceof Values.ErrorValue) {
    process.stdout.write(value.type.toString() + " = " + value.value + "\n");
    return;
  }
  process.stdout.write(JSON.stringify(input.getData(new Types.Some())));
}
