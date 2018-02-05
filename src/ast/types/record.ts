import { TypeValue } from "./value";
import { IdWithOptionalType } from "../function";

export interface RecordType extends TypeValue {
  fields: IdWithOptionalType[];
}

export function isRecordType(node: TypeValue): node is RecordType {
  return node.name === "Record";
}
