"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const useFetch = (request, { enabled = true, suspense = true, errorBoundary = true, refetchInterval, onSuccess, onError } = {}) => {
    const [status, setStatus] = (0, react_1.useState)("pending");
    const [promise, setPromise] = (0, react_1.useState)(null);
    const [result, setResult] = (0, react_1.useState)(null);
    const [error, setError] = (0, react_1.useState)(null);
    const interval = (0, react_1.useRef)(null);
    const resolvePromise = (0, react_1.useCallback)((newResult) => {
        setStatus("fulfilled");
        setResult(newResult);
        onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess(newResult);
    }, [onSuccess]);
    const rejectPromise = (0, react_1.useCallback)((error) => {
        setStatus("error");
        setError(error);
        onError === null || onError === void 0 ? void 0 : onError(error);
    }, [onError]);
    const fetch = (0, react_1.useCallback)(() => {
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
    (0, react_1.useEffect)(() => {
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
    return { result, isLoading: status === "pending", error: error, clearResult, refetch: fetch };
};
exports.default = useFetch;
