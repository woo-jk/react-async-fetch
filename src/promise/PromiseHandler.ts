class PromiseHandler<T> {
  private status: "fulfilled" | "pending" | "rejected";
  private data: T | null;
  private error: Error | null;

  constructor(promise: Promise<T>) {
    this.status = "pending";
    this.data = null;
    this.error = null;

    promise.then(
      (data) => this.resolvePromise(data),
      (error) => this.rejectedPromise(error)
    );
  }

  private resolvePromise(data: T) {
    this.data = data;
    this.status = "fulfilled";
  }

  private rejectedPromise(error: Error) {
    this.error = error;
    this.status = "rejected";
  }

  retryPromise(promise: Promise<T>) {
    return promise.then(
      (data) => this.resolvePromise(data),
      (error) => this.rejectedPromise(error)
    );
  }

  getData() {
    return this.data;
  }

  getPromiseStatus() {
    return this.status;
  }

  getError() {
    return this.error;
  }
}

export default PromiseHandler;
