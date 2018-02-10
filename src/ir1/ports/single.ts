import { checkType } from "../types/check";
import { ReadyType } from "../types/ready";
import { ReadyValue } from "../values/ready";
import { Port } from "./port";

type dataFetchFunction = (dataType: ReadyType) => ReadyValue;

export class SingleValuePort implements Port {
  private data?: ReadyValue;
  private fetchData: dataFetchFunction;

  public constructor(fetchData: dataFetchFunction) {
    this.fetchData = fetchData;
  }

  public getData(dataType: ReadyType, offset?: number): ReadyValue {
    if (offset && offset !== 0) {
      throw new Error("Requesting non-zero offset for a single value");
    }
    if (!this.data) {
      this.data = this.fetchData(dataType);
    }
    checkType(this.data.type, dataType);
    return this.data;
  }
}
