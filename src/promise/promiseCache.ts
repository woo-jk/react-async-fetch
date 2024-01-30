import PromiseHandler from "./PromiseHandler";

const promiseCache = new Map<string, PromiseHandler<any>>();

export default promiseCache;
