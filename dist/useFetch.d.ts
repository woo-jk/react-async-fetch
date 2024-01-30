type Status = "success" | "pending" | "error";
type Options<T> = {
    enabled?: boolean;
    suspense?: boolean;
    errorBoundary?: boolean;
    refetchInterval?: number;
    onSuccess?: (result: T) => void | Promise<void>;
    onError?: (error: Error) => void;
};
declare const useFetch: <T>(request: () => Promise<T>, { enabled, suspense, errorBoundary, refetchInterval, onSuccess, onError, }?: Options<T>) => {
    result: T | null;
    status: Status;
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
    clearResult: () => void;
    refetch: () => Promise<void>;
};
export default useFetch;
