// src/lib/server/cache.js

const memoryCache = new Map();

/**
 * Caches the result of a fetcher function in memory.
 * 
 * @param {string} key - Unique key for the cache (should include user ID or access token if user-specific).
 * @param {Function} fetcher - Async function that returns the data to be cached.
 * @param {number} ttlSeconds - Time-To-Live in seconds (default: 300 = 5 minutes).
 * @returns {Promise<any>} The data (either from cache or newly fetched).
 */
export async function fetchWithCache(key, fetcher, ttlSeconds = 300) {
    if (memoryCache.has(key)) {
        const cached = memoryCache.get(key);
        if (Date.now() < cached.expiry) {
            return cached.data;
        } else {
            memoryCache.delete(key);
        }
    }
    
    try {
        const data = await fetcher();
        memoryCache.set(key, { data, expiry: Date.now() + ttlSeconds * 1000 });
        return data;
    } catch (err) {
        throw err;
    }
}

/**
 * Invalidates cache entries matching a specific prefix.
 * 
 * @param {string} keyPrefix - The prefix of keys to remove.
 */
export function invalidateCache(keyPrefix) {
    for (const key of memoryCache.keys()) {
        if (key.startsWith(keyPrefix)) {
            memoryCache.delete(key);
        }
    }
}

/**
 * Generates a consistent cache key based on path, user ID, and URL search parameters.
 */
export function generateCacheKey(path, userId, searchParams = '') {
    return `${path}_user_${userId}_${searchParams}`;
}
