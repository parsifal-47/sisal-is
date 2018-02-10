import { checkType } from "../types/check";
import { ReadyType } from "../types/ready";
import { ReadyValue } from "../values/ready";
import { Port } from "./port";

type dataFetchFunction = (dataType: ReadyType, offset: number) => ReadyValue;

export class StreamPort implements Port {
  private data: ReadyValue[];
  private fetchData: dataFetchFunction;

  public constructor(fetchData: dataFetchFunction) {
    this.fetchData = fetchData;
    this.data = [];
  }

  public getData(dataType: ReadyType, offset?: number): ReadyValue {
    if (!offset) {
      offset = 0;
    }
    if (!this.data[offset]) {
      this.data[offset] = this.fetchData(dataType, offset);
    }
    checkType(this.data[offset].type, dataType);
    return this.data[offset];
  }
}
