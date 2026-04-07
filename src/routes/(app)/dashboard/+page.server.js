// src/routes/student/+page.server.js   (yoki qayerda bo'lsa)
import { getRanking } from '@/lib/server/api.js';
import { getMyCourses } from '@/lib/server/myCourses.js';

export async function load(event) {
    const [rankingData, coursesData] = await Promise.all([
        getRanking(event),
        getMyCourses(event)
    ]);

    return {
        ranking: rankingData.ranking,
        courses: coursesData.courses
    };
}