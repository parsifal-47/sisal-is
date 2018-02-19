import { Array } from "./array";
import { ReadyType } from "./ready";
import { Some } from "./some";
import { Stream } from "./stream";

export function checkType(checked: ReadyType, requested: ReadyType): boolean {
  if (requested instanceof Some) {
    return true;
  }
  if ((requested instanceof Stream) && (checked instanceof Stream)) {
    return checkType(checked.element, requested.element);
  }
  if ((requested instanceof Array) && (checked instanceof Array)) {
    return checkType(checked.element, requested.element);
  }
  return requested.name === checked.name;
}
