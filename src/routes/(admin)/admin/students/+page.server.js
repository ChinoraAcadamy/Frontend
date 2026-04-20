import { API_URL } from '$env/static/private';
import { fail } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ fetch, cookies, url, setHeaders }) => {
    const accessToken = cookies.get('access_token');
    
    const search   = url.searchParams.get('search')    ?? '';
    const isActive = url.searchParams.get('is_active') ?? '';
    const ordering = url.searchParams.get('ordering')  ?? '';
    const page     = url.searchParams.get('page')      ?? '1';

    // Admin list sahifasi tezkor ishlashi uchun 10 daqiqalik kesh
    setHeaders({
        'cache-control': 'private, max-age=600, s-maxage=600'
    });


    const getStudentsData = async () => {
        const params = new URLSearchParams();
        if (search)   params.set('search',    search);
        if (isActive) params.set('is_active', isActive);
        if (ordering) params.set('ordering',  ordering);
        if (page)     params.set('page',      page);

        try {
            const res = await fetch(`${API_URL}/auth/students/?${params}`, {
                headers: { 'Authorization': `Bearer ${accessToken}` }
            });

            if (res.ok) {
                const data = await res.json();
                return {
                    students: data.results  ?? data ?? [],
                    totalCount: data.count    ?? (data.results?.length ?? 0),
                    nextPage: data.next     ?? null,
                    prevPage: data.previous ?? null
                };
            }
            return { students: [], totalCount: 0, nextPage: null, prevPage: null };
        } catch (err) {
            console.error('[Admin Students] Fetch error:', err);
            return { students: [], totalCount: 0, nextPage: null, prevPage: null };
        }
    };

    const getCourses = async () => {
        try {
            const res = await fetch(`${API_URL}/courses/`, {
                headers: { 'Authorization': `Bearer ${accessToken}` }
            });
            if (res.ok) {
                const data = await res.json();
                return data.results ?? data ?? [];
            }
            return [];
        } catch (err) {
            console.error('[Admin Students] Courses fetch error:', err);
            return [];
        }
    };

    return { 
        lazy: {
            studentsData: getStudentsData(),
            courses: getCourses()
        },
        currentPage: parseInt(page), 
        filters: { search, isActive, ordering } 
    };
};

export const actions = {
    createStudent: async ({ request, cookies, fetch }) => {
        const accessToken = cookies.get('access_token');
        const data = await request.formData();

        const payload = {
            first_name: data.get('firstName') || '',
            last_name:  data.get('lastName')  || '',
            username:   data.get('username')  || '',
            password:   data.get('password')  || '',
            phone_number:      data.get('phone_number')     || '',
            course_ids:     data.getAll('courseIds[]').map(Number)
        };

        // console.log(data.getAll('courseIds[]').map(Number))

        if (!payload.first_name) return fail(400, { createError: "Ism majburiy maydon." });
        if (!payload.username)   return fail(400, { createError: "Username majburiy maydon." });

        const res = await fetch(`${API_URL}/auth/students/create/`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            const errorMsg = Object.values(err).flat().join(' ') || "Student yaratishda xatolik.";
            return fail(res.status, { createError: errorMsg });
        }

        return { createSuccess: true };
    },

    updateStudent: async ({ request, cookies, fetch }) => {
        const accessToken = cookies.get('access_token');
        const data = await request.formData();

        const studentId = data.get('studentId');
        if (!studentId) return fail(400, { updateError: "Student ID topilmadi." });

        // Faqat API qabul qiladigan maydonlar: first_name, last_name, phone_number, is_active
        const payload = {};
        const firstName   = data.get('firstName');
        const lastName    = data.get('lastName');
        const phoneNumber = data.get('phoneNumber');
        const isActive    = data.get('isActive');

        if (firstName   !== null) payload.first_name    = firstName;
        if (lastName    !== null) payload.last_name     = lastName;
        if (phoneNumber !== null) payload.phone_number  = phoneNumber;
        if (isActive    !== null) payload.is_active     = isActive === 'true';

        const res = await fetch(`${API_URL}/auth/students/${studentId}/`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            const errorMsg = Object.values(err).flat().join(' ') || "O'zgartirishda xatolik.";
            return fail(res.status, { updateError: errorMsg });
        }

        return { updateSuccess: true };
    },

    deleteStudent: async ({ request, cookies, fetch }) => {
        const accessToken = cookies.get('access_token');
        const data = await request.formData();
        const studentId = data.get('studentId');

        if (!studentId) return fail(400, { deleteError: "Student ID topilmadi." });

        const res = await fetch(`${API_URL}/auth/students/${studentId}/`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        if (!res.ok && res.status !== 204) {
            return fail(res.status, { deleteError: "O'chirishda xatolik yuz berdi." });
        }

        return { deleteSuccess: true };
    }
};
