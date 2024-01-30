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
  useMutation: () => useMutation_default
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
      setStatus("fulfilled");
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
//# sourceMappingURL=index.cjs.map
