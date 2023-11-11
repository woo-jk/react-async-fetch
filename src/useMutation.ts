import { useEffect, useState } from "react";

type Status = "default" | "pending" | "fulfilled" | "error";

type Options<T> = {
  errorBoundary?: boolean;

  onSuccess?: (result: T) => void | Promise<void>;
  onError?: (error: Error) => void;
};

const useMutation = <T>(request: () => Promise<T>, { errorBoundary = true, onSuccess, onError }: Options<T> = {}) => {
  const [result, setResult] = useState<T | null>(null);
  const [status, setStatus] = useState<Status>("default");
  const [error, setError] = useState<unknown | null>(null);

  const mutate = async () => {
    setStatus("pending");

    try {
      const result = await request();
      setResult(result);
      await onSuccess?.(result);
      setStatus("fulfilled");
      return result;
    } catch (reason) {
      if (reason instanceof Error) {
        setError(reason);
        onError?.(reason);
      }
      setStatus("error");
      throw reason;
    }
  };

  useEffect(() => {
    if (errorBoundary && error) {
      throw error;
    }
  }, [error, errorBoundary]);

  return {
    mutate,
    result,
    status,
    isLoading: status === "pending",
    isError: status === "error",
    error,
  };
};

export default useMutation;
