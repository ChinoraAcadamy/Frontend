import { getMyCourses } from "@/lib/server/myCourses.js"

/** @type {import('./$types').PageServerLoad} */
export async function load(event) {
    // Kesh va Performance optimizatsiyasi (10 daqiqa)
    event.setHeaders({
        'cache-control': 'private, max-age=600'
    });


    return {
        // Asinxron (streaming) qaytaramiz
        lazy: {
            coursesData: getMyCourses(event).then(data => data) // Promise.then orqali butun myCourses obyekti olinadi
        }
    };
}