import { getRanking } from '@/lib/server/api.js';
import { getMyCourses } from '@/lib/server/myCourses.js';
import { getRecentSubmissions } from '@/lib/server/submissions.js';

/** @type {import('./$types').PageServerLoad} */
export async function load(event) {
    // 10 daqiqa kesh
    event.setHeaders({
        'cache-control': 'private, max-age=600'
    });

    return {
        // Hammasini lazy (streaming) qilamiz
        lazy: {
            courses: getMyCourses(event).then(data => data.courses),
            ranking: getRanking(event).then(data => data.ranking),
            recentSubmissions: getRecentSubmissions(event, 3)
        }
    };
}