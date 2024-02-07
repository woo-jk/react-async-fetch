declare const useSuspenseFetch: <T>(requestKey: string, request: () => Promise<T>) => {
    result: T;
    status: "pending" | "fulfilled" | "rejected";
    error: Error | null;
    invalidateCache: () => void;
};
export default useSuspenseFetch;
