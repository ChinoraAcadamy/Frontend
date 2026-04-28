import { API_URL } from '$env/static/private';

/**
 * @param {typeof fetch} fetch
 * @param {string} accessToken
 */
export async function getMasterclasses(fetch, accessToken) {
    const headers = {};
    if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;
    
    const res = await fetch(`${API_URL}/masterclasses/`, { headers });
    if (!res.ok) return { results: [], count: 0 };
    return await res.json();
}

/**
 * @param {string} slug
 * @param {typeof fetch} fetch
 * @param {string} [accessToken]
 */
export async function getMasterclass(slug, fetch, accessToken) {
    const headers = {};
    if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;

    const res = await fetch(`${API_URL}/masterclasses/${slug}/`, { headers });
    if (!res.ok) return null;
    return await res.json();
}

/**
 * @param {any} data
 * @param {typeof fetch} fetch
 * @param {string} accessToken
 */
export async function createMasterclass(data, fetch, accessToken) {
    const headers = {};
    if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;
    
    const isFormData = data instanceof FormData;
    if (!isFormData) {
        headers['Content-Type'] = 'application/json';
    }

    const res = await fetch(`${API_URL}/masterclasses/`, {
        method: 'POST',
        headers,
        body: isFormData ? data : JSON.stringify(data)
    });
    return res;
}

/**
 * @param {string} slug
 * @param {any} data
 * @param {typeof fetch} fetch
 * @param {string} accessToken
 */
export async function updateMasterclass(slug, data, fetch, accessToken) {
    const headers = {};
    if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;

    const isFormData = data instanceof FormData;
    if (!isFormData) {
        headers['Content-Type'] = 'application/json';
    }

    const res = await fetch(`${API_URL}/masterclasses/${slug}/`, {
        method: 'PATCH',
        headers,
        body: isFormData ? data : JSON.stringify(data)
    });
    return res;
}

/**
 * @param {string} slug
 * @param {typeof fetch} fetch
 * @param {string} accessToken
 */
export async function deleteMasterclass(slug, fetch, accessToken) {
    const res = await fetch(`${API_URL}/masterclasses/${slug}/`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });
    return res;
}
