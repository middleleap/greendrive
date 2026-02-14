const store = new Map();

const DEFAULT_TTL = parseInt(process.env.CACHE_TTL || '300', 10) * 1000;

export function get(key) {
  const entry = store.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > DEFAULT_TTL) {
    store.delete(key);
    return null;
  }
  return entry.data;
}

export function set(key, data) {
  store.set(key, { data, timestamp: Date.now() });
}

export function clear() {
  store.clear();
}
