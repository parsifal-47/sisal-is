import { Publisher } from "./publisher"

export class SingleValuePublisher implements Publisher {
  private subscribers: Subscriber[];
  private data: Value.Value;

  public constructor(data: Value.Value) {
    this.data = data;
    this.subscribers = [];
  }

  public requestData() {
    for (let sub of this.subscribers) {
      sub.next(data);
      sub.complete();
    }
  }

  public subscribe(subscriber: Subscriber) {
    this.subscribers.push(subscriber);
  }
}
