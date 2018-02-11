import * as Types from "../types";
import * as Values from "../values";

export interface Scope {
  resolve: (name: string, type: Types.ReadyType, offset: number) => Values.ReadyValue;
}
