import { Publisher } from "./publisher"
import { Subscriber } from "./subscriber"
import { ReadyValue } from "../ir1/values/ready"
import { ReadyType } from "../ir1/types/ready"

export class SequencePublisher implements Publisher {
  private subscribers: Subscriber[];
  private data: ReadyValue;

  public constructor(data: ReadyValue) {
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
