// src/routes/(admin)/+layout.server.js
// import { redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
    // Admin emaslarni chiqarib yuborish
    // if (!locals.isAuthenticated) {
    //     redirect(302, '/login');
    // }

    // if (locals.user?.role !== 'admin') {
    //     redirect(302, '/courses'); // oddiy user uchun
    // }

    return {
        user: locals.user  // ← shu yerdan layout'ga keladi
    };
};