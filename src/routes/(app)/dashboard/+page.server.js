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
    
    // We fetch all ranking here to find the rank AND pass to leaderboard
    const ranking = await getRanking(event);
    const myRank = await getMyRank({ ranking, myId: user.id });

    return {
        user,
        userScore: user.total_score || 0,
        myRank: myRank,
        // Hammasini lazy (streaming) qilamiz
        lazy: {
            courses: getMyCourses(event).then(data => data.courses),
            ranking: ranking, // Already fetched
            recentSubmissions: getRecentSubmissions(event, 3)
        }
    };
}