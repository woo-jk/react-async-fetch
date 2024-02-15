import PromiseCache from "./PromiseCache";

const promiseHashMap = new Map<string, PromiseCache<any>>();

let listeners: Array<() => void> = [];

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

const PromiseHandler = {
  get<T>(key: string, request: () => Promise<T>) {
    const promiseCache = promiseHashMap.get(key);

    if (!promiseCache) {
      const newPromise = request();
      const promiseCache = new PromiseCache(newPromise);

      promiseHashMap.set(key, promiseCache);

      return promiseCache;
    }

    return promiseCache as PromiseCache<T>;
  },

  delete(key: string | string[] | Set<string>) {
    let keys = typeof key === "string" ? [key] : key;

    keys.forEach((key) => promiseHashMap.delete(key));
    emitChange();
  },

  subscribe(listener: () => void) {
    listeners = [...listeners, listener];
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  },
};

export default PromiseHandler;
