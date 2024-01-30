import { useEffect, useRef, useState } from "react";
import promiseCache from "./promise/promiseCache";
import PromiseHandler from "./promise/PromiseHandler";

const useSuspenseFetch = <T>(suspenseKey: string, request: () => Promise<T>) => {
  const cache = useRef(promiseCache.get(suspenseKey)).current;
  const [result, setResult] = useState(cache?.getData() || null);
  const [error, setError] = useState(cache?.getError() || null);

  if (!cache) {
    const promise = request();
    const newCache = new PromiseHandler(promise);

    promiseCache.set(suspenseKey, newCache);

    throw promise;
  }

  if (cache.getPromiseStatus() === "rejected") {
    throw error;
  }

  const refetch = () => {
    const promise = request();

    cache
      .retryPromise(promise)
      .then(() => setResult(cache.getData()))
      .catch(() => setError(cache.getError()));
  };

  useEffect(() => {
    return () => {
      promiseCache.delete(suspenseKey);
    };
  }, []);

  return {
    result: result as T,
    status: cache.getPromiseStatus(),
    error: error,
    refetch,
  };
};

export default useSuspenseFetch;
