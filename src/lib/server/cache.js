// src/lib/server/cache.js

const cache = new Map();

/**
 * Oddiy kesh kalitini yaratish
 */
export function generateCacheKey(url, options = {}) {
    const method = options.method || 'GET';
    const body = options.body ? JSON.stringify(options.body) : '';
    return `${method}:${url}:${body}`;
}

/**
 * Keshdan olish yoki yangisini saqlash
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
        if (entry) return entry.data;
        throw err;
    }
}

/**
 * Fetch so'rovini kesh bilan bajarish
 */
export async function fetchWithCache(url, options = {}, fetchFn = globalThis.fetch, ttl = 300) {
    const key = generateCacheKey(url, options);
    
    return getOrSet(key, async () => {
        const response = await fetchFn(url, options);
        if (!response.ok) {
            throw new Error(`Fetch failed with status ${response.status}`);
        }
        return await response.json();
    }, ttl);
}

/**
 * Keshni tozalash
 */
export function invalidateCache(key = null) {
    if (key) cache.delete(key);
    else cache.clear();
}
