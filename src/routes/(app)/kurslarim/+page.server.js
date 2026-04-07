import { getMyCourses } from "@/lib/server/myCourses.js"

export async function load(event) {
    return await getMyCourses(event);
}