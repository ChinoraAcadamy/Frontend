// src/lib/server/cache.js

const cache = new Map();

/**
 * Oddiy kesh kalitini yaratish
 */
export function generateCacheKey(prefix, ...ids) {
	return [prefix, ...ids].filter(Boolean).join(':');
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
			expiresAt: now + ttl * 1000
		});
		return data;
	} catch (err) {
		console.error(`Cache fetcher error for key ${key}:`, err);
		if (entry) return entry.data;
		throw err;
	}
}

/**
 * Loyihada kutilayotgan fetchWithCache funksiyasi.
 * Bu aslida getOrSet bilan bir xil ishlaydi.
 */
export async function fetchWithCache(key, fetcher, ttl = 300) {
	return getOrSet(key, fetcher, ttl);
}

/**
 * Keshni tozalash
 */
export function invalidateCache(prefix = null) {
	if (!prefix) {
		cache.clear();
		return;
	}

	// Agar prefix berilgan bo'lsa, shu prefix bilan boshlanadigan barcha keshni o'chiramiz
	for (const key of cache.keys()) {
		if (key.startsWith(prefix)) {
			cache.delete(key);
		}
	}
}
