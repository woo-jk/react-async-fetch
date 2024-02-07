import PromiseCache from "./PromiseCache";
declare const PromiseHandler: {
    get<T>(key: string, request: () => Promise<T>): PromiseCache<T>;
    delete(key: string | string[] | Set<string>): void;
    subscribe(listener: () => void): () => void;
};
export default PromiseHandler;
