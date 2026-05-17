import { getMyCourses } from "@/lib/server/myCourses.js"
import { fetchWithCache, generateCacheKey } from '@/lib/server/cache.js';

/** @type {import('./$types').PageServerLoad} */
export async function load(event) {
    const user = event.locals.user;

    return {
        // Asinxron (streaming) qaytaramiz
        lazy: {
            coursesData: fetchWithCache(generateCacheKey('student_my_courses', user.id), () => getMyCourses(event).then(data => data)) // Promise.then orqali butun myCourses obyekti olinadi
        }
    };
}