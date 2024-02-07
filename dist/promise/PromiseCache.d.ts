declare class PromiseCache<T> {
    private promise;
    private status;
    private data;
    private error;
    constructor(promise: Promise<T>);
    private resolvePromise;
    private rejectedPromise;
    retryPromise(promise: Promise<T>): Promise<void>;
    getPromise(): Promise<T>;
    getData(): T | null;
    getPromiseStatus(): "pending" | "fulfilled" | "rejected";
    getError(): Error | null;
}
export default PromiseCache;
