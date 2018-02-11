import { Port } from "./ir1/ports/port";
import * as Types from "./ir1/types";

export function printPortData(input: Port) {
  process.stdout.write(JSON.stringify(input.getData(new Types.Some())));
}
