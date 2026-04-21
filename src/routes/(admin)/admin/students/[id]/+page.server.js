import { error, fail } from '@sveltejs/kit';
import { API_URL } from '$env/static/private';
import { getRanking, getMyRank } from '@/lib/server/api.js';

const HEADERS = (token) => ({
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
});

export const load = async ({ fetch, params, cookies }) => {
    const accessToken = cookies.get('access_token');

    const headers = HEADERS(accessToken);

    const [studentRes, coursesRes] = await Promise.all([
        fetch(`${API_URL}/auth/students/${params.id}/`, { headers }),
        fetch(`${API_URL}/courses/`, { headers })
    ]);

    if (!studentRes.ok) {
        const body = await studentRes.text();
        console.error(`[student/${params.id}] ${studentRes.status}:`, body.slice(0, 200));
        if (studentRes.status === 404) throw error(404, "Student topilmadi");
        if (studentRes.status === 401) throw error(401, "Unauthorized");
        throw error(studentRes.status, "Serverda xatolik");
    }

    const studentData = await studentRes.json();
    let coursesData = [];

    if (coursesRes.ok) {
        const cData = await coursesRes.json();
        coursesData = cData.results ?? cData ?? [];
    }

    // Rank hisoblash
    const rankingData = await getRanking({ cookies, fetch });
    const rank = await getMyRank({ ranking: rankingData.results, myId: studentData.id });
    const totalStudents = rankingData.count;

    return { 
        student: studentData,
        availableCourses: coursesData,
        rank,
        totalStudents,
        rankPercent: rank ? Math.max(1, Math.round((rank / totalStudents) * 100)) : null
    };
};

export const actions = {
    updateStudent: async ({ request, cookies, fetch }) => {
        const accessToken = cookies.get('access_token');
        const data = await request.formData();

        const studentId = data.get('studentId');
        if (!studentId) return fail(400, { updateError: "Student ID topilmadi." });

        const payload = {};
        const firstName = data.get('firstName');
        const lastName = data.get('lastName');
        const phoneNumber = data.get('phoneNumber');
        const isActive = data.get('isActive');

        if (firstName !== null) payload.first_name = firstName;
        if (lastName !== null) payload.last_name = lastName;
        if (phoneNumber !== null) payload.phone_number = phoneNumber;
        if (isActive !== null) payload.is_active = isActive === 'true';

        const res = await fetch(`${API_URL}/auth/students/${studentId}/`, {
            method: 'PATCH',
            headers: {
                ...HEADERS(accessToken)
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

    // Kurs biriktirish
    createEnrollment: async ({ request, params, cookies, fetch }) => {
        const accessToken = cookies.get('access_token');
        const data = await request.formData();
        
        const courseIds = data.getAll('courseIds[]').map(Number);
        const studentId = Number(params.id);

        if (!courseIds || courseIds.length === 0) {
            return fail(400, { createError: "Kamida bitta kurs tanlang." });
        }

        for (const courseId of courseIds) {
            const res = await fetch(`${API_URL}/enrollments/create/`, {
                method: 'POST',
                headers: HEADERS(accessToken),
                body: JSON.stringify({ user: studentId, course: courseId })
            });

            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                const errorMsg = Object.values(err).flat().join(' ') || "Kursga biriktirishda xatolik.";
                return fail(res.status, { createError: errorMsg });
            }
        }

        return { createSuccess: true };
    },

    // Parol o'zgartirish
    changePassword: async ({ request, params, cookies, fetch }) => {
        const formData = await request.formData();
        const new_password = formData.get('new_password');
        const confirm_password = formData.get('confirm_password');
        const accessToken = cookies.get('access_token');

        if (new_password !== confirm_password)
            return fail(400, { passwordError: "Parollar mos tushmadi" });
        if (new_password.toString().length < 8)
            return fail(400, { passwordError: "Parol kamida 8 ta belgidan iborat bo'lishi kerak" });

        const res = await fetch(`${API_URL}/auth/students/${params.id}/change-password/`, {
            method: 'PATCH',
            headers: HEADERS(accessToken),
            body: JSON.stringify({ new_password, confirm_password })
        });

        if (!res.ok) {
            const body = await res.text();
            let message = "Parolni o'zgartirishda xatolik";
            try {
                const err = JSON.parse(body);
                message = err.detail || err.message || Object.values(err).flat().join(' ') || message;
            } catch {
                console.log(body)
            }
            return fail(res.status, { passwordError: message });
        }

        return { passwordSuccess: true };
    },

    // Kursdan o'chirish: DELETE /enrollments/{enrollment_id}/
    removeEnrollment: async ({ request, cookies, fetch }) => {
        const formData = await request.formData();
        const enrollmentId = formData.get('enrollmentId');
        const accessToken = cookies.get('access_token');

        if (!enrollmentId) return fail(400, { enrollError: "Enrollment ID topilmadi" });

        const res = await fetch(`${API_URL}/enrollments/${enrollmentId}/`, {
            method: 'DELETE',
            headers: HEADERS(accessToken)
        });

        // 204 No Content — muvaffaqiyatli
        if (!res.ok && res.status !== 204) {
            return fail(res.status, { enrollError: "Kursdan o'chirishda xatolik" });
        }

        return { removeSuccess: true };
    },

    // Kursni bloklash: PATCH /enrollments/{enrollment_id}/block/
    blockEnrollment: async ({ request, cookies, fetch }) => {
        const formData = await request.formData();
        const enrollmentId = formData.get('enrollmentId');
        const accessToken = cookies.get('access_token');

        if (!enrollmentId) return fail(400, { enrollError: "Enrollment ID topilmadi" });

        const res = await fetch(`${API_URL}/enrollments/${enrollmentId}/block/`, {
            method: 'PATCH',
            headers: HEADERS(accessToken)
        });



        if (!res.ok) {
            return fail(res.status, { enrollError: "Bloklashda xatolik" });
        }

        return { blockSuccess: true };
    },

    // Kursni blokdan chiqarish: PATCH /enrollments/{enrollment_id}/unblock/
    unblockEnrollment: async ({ request, cookies, fetch }) => {
        const formData = await request.formData();
        const enrollmentId = formData.get('enrollmentId');
        const accessToken = cookies.get('access_token');

        if (!enrollmentId) return fail(400, { enrollError: "Enrollment ID topilmadi" });

        const res = await fetch(`${API_URL}/enrollments/${enrollmentId}/unblock/`, {
            method: 'PATCH',
            headers: HEADERS(accessToken)
        });

        console.log(await res.json())

        if (!res.ok) {
            return fail(res.status, { enrollError: "Blokdan chiqarishda xatolik" });
        }


        return { unblockSuccess: true };
    }
};
