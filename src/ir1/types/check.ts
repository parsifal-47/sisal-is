import { ReadyType } from "./ready";
import { Some } from "./some";
import { Stream } from "./stream";
import { Array } from "./array";

export function checkType(checked: ReadyType, requested: ReadyType): boolean {
  if (requested instanceof Some) {
    return true;
  }
  if ((requested instanceof Stream) && (checked instanceof Stream)) {
    return checkType(requested.element, checked.element);
  }
  if ((requested instanceof Array) && (checked instanceof Array)) {
    return checkType(requested.element, checked.element);
  }
  return requested.name === checked.name;
}
