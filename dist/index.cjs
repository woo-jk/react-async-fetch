"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  useFetch: () => useFetch_default,
  useMutation: () => useMutation_default,
  useSuspenseFetch: () => useSuspenseFetch_default
});
module.exports = __toCommonJS(src_exports);

// src/useFetch.ts
var import_react = require("react");
var useFetch = (request, {
  enabled = true,
  suspense = false,
  errorBoundary = false,
  refetchInterval,
  onSuccess,
  onError
} = {}) => {
  const [status, setStatus] = (0, import_react.useState)("pending");
  const [promise, setPromise] = (0, import_react.useState)(null);
  const [result, setResult] = (0, import_react.useState)(null);
  const [error, setError] = (0, import_react.useState)(null);
  const interval = (0, import_react.useRef)(null);
  const resolvePromise = (0, import_react.useCallback)(
    (newResult) => {
      setStatus("success");
      setResult(newResult);
      onSuccess?.(newResult);
    },
    [onSuccess]
  );
  const rejectPromise = (0, import_react.useCallback)(
    (error2) => {
      setStatus("error");
      setError(error2);
      onError?.(error2);
    },
    [onError]
  );
  const fetch = (0, import_react.useCallback)(() => {
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
  (0, import_react.useEffect)(() => {
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
var import_react2 = require("react");
var useMutation = (request, { errorBoundary = true, onSuccess, onError } = {}) => {
  const [result, setResult] = (0, import_react2.useState)(null);
  const [status, setStatus] = (0, import_react2.useState)("default");
  const [error, setError] = (0, import_react2.useState)(null);
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
  (0, import_react2.useEffect)(() => {
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
var import_react3 = require("react");

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
  const keyHistory = (0, import_react3.useRef)(/* @__PURE__ */ new Set([requestKey])).current;
  const promiseCache = (0, import_react3.useSyncExternalStore)(
    PromiseHandler_default.subscribe,
    () => PromiseHandler_default.get(requestKey, request)
  );
  (0, import_react3.useEffect)(() => {
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
//# sourceMappingURL=index.cjs.map
