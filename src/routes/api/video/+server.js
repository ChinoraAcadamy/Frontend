import { error } from '@sveltejs/kit';

export async function GET({ request, url, fetch: eventFetch, locals }) {
    // 1. Session Security: Only authenticated users can proxy video
    if (!locals.isAuthenticated) {
        throw error(401, 'Unauthorized access to video player.');
    }

    // 2. Referer Security: Ensure request comes from our domain
    const referer = request.headers.get('referer');
    if (!referer || !referer.includes(url.host)) {
        throw error(403, 'Direct access to video stream is prohibited.');
    }

    let videoUrl = url.searchParams.get('url');

    if (!videoUrl || videoUrl === 'null' || videoUrl === 'undefined') {
        videoUrl = 'https://placeholdervideo.dev/1920x1080';
    }

    try {
        new URL(videoUrl);
    } catch {
        videoUrl = 'https://placeholdervideo.dev/1920x1080';
    }

    // Forward the Range header to support video seeking (scrubbing)
    const range = request.headers.get('range');
    const headers = new Headers();
    if (range) {
        headers.set('range', range);
    }

    try {
        const response = await eventFetch(videoUrl, {
            headers,
            method: 'GET'
        });

        if (!response.ok && response.status !== 206) {
            throw error(response.status, 'Error fetching video from source');
        }

        // Return a streamed response
        // We pipe the headers correctly
        const newHeaders = new Headers(response.headers);
        
        // Anti-download headers tricks
        // Removing content-disposition and adding no-store might confuse some download managers
        newHeaders.delete('content-disposition');
        newHeaders.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        newHeaders.set('Pragma', 'no-cache');
        newHeaders.set('Expires', '0');
        newHeaders.set('Content-Type', 'video/mp4');

        return new Response(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers: newHeaders
        });
    } catch (err) {
        console.error("Video proxy error:", err);
        throw error(500, 'Internal Server Error');
    }
}
