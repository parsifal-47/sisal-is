import { ReadyType } from "../types/ready"
import { ReadyValue } from "../values/ready"

export interface Port {
  getData: (dataType: ReadyType, offset?: number) => ReadyValue;
}
