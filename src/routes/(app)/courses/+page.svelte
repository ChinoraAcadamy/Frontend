<script lang="ts">
	import CourseGridCard from "@/lib/components/ui/courses/CourseGridCard.svelte";


    // Dinamik kurslar ro'yxati (Svelte 5 State)
    let courses = $state([
        { 
            id: 1, 
            title: "Course dars qo'shish", 
            subtitle: "Course dars qo'shish", 
            image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=200&h=200&fit=crop", 
            progress: 75, 
            modules: 16, 
            lessons: 25, 
            status: 'active' 
        },
        { 
            id: 2, 
            title: "Yangi dars qo'shish", 
            subtitle: "Yangi dars qo'shish", 
            image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=200&h=200&fit=crop", 
            progress: 0, 
            modules: 13, 
            lessons: 2, 
            status: 'locked' 
        },
        { 
            id: 3, 
            title: "Yangi dars qo'shish", 
            subtitle: "Yangi dars qo'shish", 
            image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200&h=200&fit=crop", 
            progress: 50, 
            modules: 15, 
            lessons: 25, 
            status: 'completed' // Yashil progress bar uchun
        },
        { 
            id: 4, 
            title: "Yangi dars qo'shish", 
            subtitle: "Course dars qo'shish", 
            image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=200&h=200&fit=crop", 
            progress: 50, 
            modules: 15, 
            lessons: 2, 
            status: 'active' 
        },
        { 
            id: 5, 
            title: "Yangi dars qo'shish", 
            subtitle: "Course dars qo'shish", 
            image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200&h=200&fit=crop", 
            progress: 50, 
            modules: 15, 
            lessons: 2, 
            status: 'locked' 
        },
        { 
            id: 6, 
            title: "Yangi dars qo'shish", 
            subtitle: "Yangi dars qo'shish", 
            image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=200&h=200&fit=crop", 
            progress: 50, 
            modules: 15, 
            lessons: 2, 
            status: 'active' 
        }
    ]);

    // Tugma bosilganda ishlaydigan haqiqiy funksiya
    function handleContinueCourse(courseId) {
        const course = courses.find(c => c.id === courseId);
        if (course && course.status !== 'locked') {
            console.log(`Navigating to course: ${courseId}`);
            alert(`${course.title} darsiga o'tmoqdasiz!`);
            // SvelteKit'da bu yerda sahifaga yo'naltirasiz:
            // goto(`/course/${courseId}`);
        }
    }
</script>

<div class="max-w-7xl mx-auto p-4 md:p-8 min-h-screen bg-[#f8fafc] font-sans">
    
    <div class="mb-8">
        <h1 class="text-2xl font-black text-slate-800 uppercase tracking-wide">My Courses</h1>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each courses as course (course.id)}
            <CourseGridCard 
                id={course.id}
                title={course.title}
                subtitle={course.subtitle}
                image={course.image}
                progress={course.progress}
                modules={course.modules}
                lessons={course.lessons}
                status={course.status}
                onContinue={handleContinueCourse}
            />
        {/each}
    </div>

</div>