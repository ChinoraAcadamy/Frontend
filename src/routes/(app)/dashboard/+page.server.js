import { getRanking, getMyRank } from '@/lib/server/api.js';
import { getMyCourses } from '@/lib/server/myCourses.js';
import { getRecentSubmissions } from '@/lib/server/submissions.js';

/** @type {import('./$types').PageServerLoad} */
export async function load(event) {
    // 10 daqiqa kesh
    event.setHeaders({
        'cache-control': 'private, max-age=600'
    });

    const user = event.locals.user || {};
    
    // Create a promise for rank info to be streamed
    const rankInfoPromise = getRanking(event).then(async (rankingData) => {
        const myRank = await getMyRank({ ranking: rankingData.results, myId: user.id });
        return {
            ranking: rankingData.results,
            myRank
        };
    });

    return {
        user,
        userScore: user.total_score || 0,
        // Hammasini lazy (streaming) qilamiz
        lazy: {
            courses: getMyCourses(event).then(data => data.courses),
            rankInfo: rankInfoPromise,
            recentSubmissions: getRecentSubmissions(event, 3)
        }
    };
}