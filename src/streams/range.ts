import { Publisher } from "./publisher"
import { Subscriber } from "./subscriber"
import { Value } from "../ir1/value"

export class RangePublisher implements Publisher {
  private subscribers: Subscriber[];
  private data: Value;

  public constructor(data: Value) {
    this.data = data;
    this.subscribers = [];
  }

  public requestData(type: ReadyType) {
    for (let sub of this.subscribers) {
      sub.next(this.data);
      sub.complete();
    }
  }

  public subscribe(subscriber: Subscriber) {
    this.subscribers.push(subscriber);
  }
}
