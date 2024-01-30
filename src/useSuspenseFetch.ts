import { useEffect, useRef, useState } from "react";
import promiseCache from "./promise/promiseCache";
import PromiseHandler from "./promise/PromiseHandler";

const useSuspenseFetch = <T>(requestKey: string, request: () => Promise<T>) => {
  const cache = useRef(promiseCache.get(requestKey)).current;
  const [result, setResult] = useState(cache?.getData() || null);
  const [error, setError] = useState(cache?.getError() || null);

  if (!cache) {
    const promise = request();
    const newCache = new PromiseHandler(promise);

    promiseCache.set(requestKey, newCache);

    throw promise;
  }

  if (cache.getPromiseStatus() === "error") {
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
      promiseCache.delete(requestKey);
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
