// src/useFetch.ts
import { useCallback, useEffect, useRef, useState } from "react";
var useFetch = (request, { enabled = true, suspense = true, errorBoundary = true, refetchInterval, onSuccess, onError } = {}) => {
  const [status, setStatus] = useState("pending");
  const [promise, setPromise] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const interval = useRef(null);
  const resolvePromise = useCallback(
    (newResult) => {
      setStatus("fulfilled");
      setResult(newResult);
      onSuccess?.(newResult);
    },
    [onSuccess]
  );
  const rejectPromise = useCallback(
    (error2) => {
      setStatus("error");
      setError(error2);
      onError?.(error2);
    },
    [onError]
  );
  const fetch = useCallback(() => {
    setStatus("pending");
    const requestPromise = request().then(resolvePromise, rejectPromise);
    setPromise(requestPromise);
    return requestPromise;
  }, []);
  const clearResult = () => setResult(null);
  const clearIntervalRef = () => {
    if (interval.current === null)
      return;
    clearInterval(interval.current);
    interval.current = null;
  };
  useEffect(() => {
    if (!enabled)
      return;
    fetch();
    if (refetchInterval) {
      interval.current = setInterval(fetch, refetchInterval);
      return clearIntervalRef;
    }
  }, [enabled, fetch]);
  if (suspense && status === "pending" && promise) {
    throw promise;
  }
  if (errorBoundary && status === "error") {
    throw error;
  }
  return {
    result,
    status,
    isLoading: status === "pending",
    isError: status === "error",
    error,
    clearResult,
    refetch: fetch
  };
};
var useFetch_default = useFetch;

// src/useMutation.ts
import { useEffect as useEffect2, useState as useState2 } from "react";
var useMutation = (request, { errorBoundary = true, onSuccess, onError } = {}) => {
  const [result, setResult] = useState2(null);
  const [status, setStatus] = useState2("default");
  const [error, setError] = useState2(null);
  const mutate = async () => {
    setStatus("pending");
    try {
      const result2 = await request();
      setResult(result2);
      await onSuccess?.(result2);
      setStatus("fulfilled");
      return result2;
    } catch (reason) {
      if (reason instanceof Error) {
        setError(reason);
        onError?.(reason);
      }
      setStatus("error");
      throw reason;
    }
  };
  useEffect2(() => {
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
    error
  };
};
var useMutation_default = useMutation;
export {
  useFetch_default as useFetch,
  useMutation_default as useMutation
};
//# sourceMappingURL=index.js.map
