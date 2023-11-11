"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const useMutation = (request, { errorBoundary = true, onSuccess, onError } = {}) => {
    const [result, setResult] = (0, react_1.useState)(null);
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)(null);
    const mutate = () => __awaiter(void 0, void 0, void 0, function* () {
        setIsLoading(true);
        try {
            const result = yield request();
            setResult(result);
            yield (onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess(result));
            return result;
        }
        catch (reason) {
            if (reason instanceof Error) {
                setError(reason);
                onError === null || onError === void 0 ? void 0 : onError(reason);
            }
            throw reason;
        }
        finally {
            setIsLoading(false);
        }
    });
    (0, react_1.useEffect)(() => {
        if (errorBoundary && error) {
            throw error;
        }
    }, [error, errorBoundary]);
    return { mutate, result, isLoading, error };
};
exports.default = useMutation;
