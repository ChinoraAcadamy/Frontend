
async function checkCourseDetail() {
    try {
        const response = await fetch('http://127.0.0.1:8000/courses/4/');
        const data = await response.json();
        console.log(JSON.stringify(data, null, 2));
    } catch (err) {
        console.error('Fetch error:', err.message);
    }
}
checkCourseDetail();
