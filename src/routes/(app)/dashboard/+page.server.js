import { getRanking, getMyRank } from '@/lib/server/api.js';
import { getMyCourses } from '@/lib/server/myCourses.js';
import { getRecentSubmissions } from '@/lib/server/submissions.js';
import { fetchWithCache, generateCacheKey } from '@/lib/server/cache.js';

/** @type {import('./$types').PageServerLoad} */
export async function load(event) {
    // 10 daqiqa kesh
    event.setHeaders({
        'cache-control': 'private, max-age=600'
    });

    /** @type {any} */
    const user = event.locals.user;
    
    // Create a promise for rank info to be streamed
    const rankInfoPromise = async () => {
        const rankingData = await getRanking(event);
        const myRank = await getMyRank({ ranking: rankingData.results, myId: user?.id });
        return {
            ranking: rankingData.results,
            myRank
        };
    };

    return {
        user,
        userScore: user?.total_score || 0,
        // Hammasini lazy (streaming) qilamiz va keshlaymiz
        lazy: {
            courses: fetchWithCache(generateCacheKey('student_dashboard_courses', user?.id), () => getMyCourses(event).then(data => data.courses)),
            rankInfo: fetchWithCache(generateCacheKey('student_dashboard_rank', user?.id), rankInfoPromise),
            recentSubmissions: fetchWithCache(generateCacheKey('student_dashboard_subs', user?.id), () => getRecentSubmissions(event, 3))
        }
    };
}