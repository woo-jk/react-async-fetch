import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import PromiseHandler from "./promise/PromiseHandler";

const useSuspenseFetch = <T>(requestKey: string, request: () => Promise<T>) => {
  const keyHistory = useRef(new Set([requestKey])).current;
  const promiseCache = useSyncExternalStore(PromiseHandler.subscribe, () =>
    PromiseHandler.get(requestKey, request)
  );

  useEffect(() => {
    keyHistory.add(requestKey);

    return () => {
      PromiseHandler.delete(keyHistory);
    };
  }, [requestKey]);

  const invalidateCache = () => {
    PromiseHandler.delete(requestKey);
  };

  if (promiseCache.getPromiseStatus() === "pending") {
    throw promiseCache.getPromise();
  }

  if (promiseCache.getPromiseStatus() === "rejected") {
    throw promiseCache.getError();
  }

  return {
    result: promiseCache.getData() as T,
    status: promiseCache.getPromiseStatus(),
    error: promiseCache.getError(),
    invalidateCache,
  };
};

export default useSuspenseFetch;
