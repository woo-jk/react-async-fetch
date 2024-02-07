// src/useFetch.ts
import { useCallback, useEffect, useRef, useState } from "react";
var useFetch = (request, {
  enabled = true,
  suspense = false,
  errorBoundary = false,
  refetchInterval,
  onSuccess,
  onError
} = {}) => {
  const [status, setStatus] = useState("pending");
  const [promise, setPromise] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const interval = useRef(null);
  const resolvePromise = useCallback(
    (newResult) => {
      setStatus("success");
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

// src/useSuspenseFetch.ts
import { useEffect as useEffect3, useRef as useRef2, useSyncExternalStore } from "react";

// src/promise/PromiseCache.ts
var PromiseCache = class {
  constructor(promise) {
    this.promise = promise;
    this.status = "pending";
    this.data = null;
    this.error = null;
    promise.then(
      (data) => this.resolvePromise(data),
      (error) => this.rejectedPromise(error)
    );
  }
  resolvePromise(data) {
    this.data = data;
    this.status = "fulfilled";
  }
  rejectedPromise(error) {
    this.error = error;
    this.status = "rejected";
  }
  retryPromise(promise) {
    return promise.then(
      (data) => this.resolvePromise(data),
      (error) => this.rejectedPromise(error)
    );
  }
  getPromise() {
    return this.promise;
  }
  getData() {
    return this.data;
  }
  getPromiseStatus() {
    return this.status;
  }
  getError() {
    return this.error;
  }
};
var PromiseCache_default = PromiseCache;

// src/promise/PromiseHandler.ts
var promiseHashMap = /* @__PURE__ */ new Map();
var listeners = [];
function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}
var PromiseHandler = {
  get(key, request) {
    const cachedPromiseHandler = promiseHashMap.get(key);
    if (!cachedPromiseHandler) {
      const newPromise = request();
      const promiseCache = new PromiseCache_default(newPromise);
      promiseHashMap.set(key, promiseCache);
      return promiseCache;
    }
    return cachedPromiseHandler;
  },
  delete(key) {
    let keys = typeof key === "string" ? [key] : key;
    keys.forEach((key2) => promiseHashMap.delete(key2));
    emitChange();
  },
  subscribe(listener) {
    listeners = [...listeners, listener];
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  }
};
var PromiseHandler_default = PromiseHandler;

// src/useSuspenseFetch.ts
var useSuspenseFetch = (requestKey, request) => {
  const keyHistory = useRef2(/* @__PURE__ */ new Set([requestKey])).current;
  const promiseCache = useSyncExternalStore(
    PromiseHandler_default.subscribe,
    () => PromiseHandler_default.get(requestKey, request)
  );
  useEffect3(() => {
    keyHistory.add(requestKey);
    return () => {
      PromiseHandler_default.delete(keyHistory);
    };
  }, [requestKey]);
  const invalidateCache = () => {
    PromiseHandler_default.delete(requestKey);
  };
  if (promiseCache.getPromiseStatus() === "pending") {
    throw promiseCache.getPromise();
  }
  if (promiseCache.getPromiseStatus() === "rejected") {
    throw promiseCache.getError();
  }
  return {
    result: promiseCache.getData(),
    status: promiseCache.getPromiseStatus(),
    error: promiseCache.getError(),
    invalidateCache
  };
};
var useSuspenseFetch_default = useSuspenseFetch;
export {
  useFetch_default as useFetch,
  useMutation_default as useMutation,
  useSuspenseFetch_default as useSuspenseFetch
};
//# sourceMappingURL=index.js.map
