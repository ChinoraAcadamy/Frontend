// src/lib/server/cache.js

const cache = new Map();

/**
 * Gets a value from cache or fetches it and stores it.
 * @param {string} key - Unique key for the cache entry
 * @param {Function} fetcher - Async function to fetch the data if not in cache
 * @param {number} ttl - Time to live in seconds (default 300s / 5 min)
 */
export async function getOrSet(key, fetcher, ttl = 300) {
    const now = Date.now();
    const entry = cache.get(key);

    if (entry && entry.expiresAt > now) {
        return entry.data;
    }

    try {
        const data = await fetcher();
        cache.set(key, {
            data,
            expiresAt: now + (ttl * 1000)
        });
        return data;
    } catch (err) {
        console.error(`Cache fetcher error for key ${key}:`, err);
        // If fetcher fails and we have expired data, return it as fallback
        if (entry) return entry.data;
        throw err;
    }
}

/**
 * Clears a specific cache key or the entire cache
 * @param {string|null} key 
 */
export function invalidateCache(key = null) {
    if (key) cache.delete(key);
    else cache.clear();
}
