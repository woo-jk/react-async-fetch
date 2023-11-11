type Status = "default" | "pending" | "fulfilled" | "error";
type Options<T> = {
    errorBoundary?: boolean;
    onSuccess?: (result: T) => void | Promise<void>;
    onError?: (error: Error) => void;
};
declare const useMutation: <T>(request: () => Promise<T>, { errorBoundary, onSuccess, onError }?: Options<T>) => {
    mutate: () => Promise<T>;
    result: T | null;
    status: Status;
    isLoading: boolean;
    isError: boolean;
    error: unknown;
};
export default useMutation;
