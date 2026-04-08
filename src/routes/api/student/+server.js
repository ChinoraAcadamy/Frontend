import { API_URL } from "$env/static/private";
import { json } from "@sveltejs/kit";

export async function DELETE({ cookies, request }) {
    const accessToken = cookies.get('access_token');
    const id = await request.json();
    const studentId = id.id;

    if (!studentId) return json({ deleteError: "Student ID topilmadi." }, { status: 400 });

    const res = await fetch(`${API_URL}/auth/students/${studentId}/`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });

    if (!res.ok && res.status !== 204) {
        return json({ deleteError: "O'chirishda xatolik yuz berdi." }, { status: res.status });
    }

    return json({ deleteSuccess: true });
}

export async function POST({ cookies, request }) {
    const accessToken = cookies.get('access_token');
    const data = await request.formData();

    const studentId = data.get('studentId');
    if (!studentId) return json({ updateError: "Student ID topilmadi." }, { status: 400 });

    // Faqat API qabul qiladigan maydonlar: first_name, last_name, phone_number, is_active
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
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        const errorMsg = Object.values(err).flat().join(' ') || "O'zgartirishda xatolik.";
        return json({ updateError: errorMsg }, { status: res.status });
    }

    return json({ updateSuccess: true });
}