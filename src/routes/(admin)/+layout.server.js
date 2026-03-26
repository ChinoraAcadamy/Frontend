// src/routes/(admin)/+layout.server.js
import { redirect } from '@sveltejs/kit';

export const load = async ({ locals, parent }) => {
    await parent(); // global layout'ning load'ini chaqiramiz, shunda locals to'ldiriladi
    if (!locals.isAuthenticated) redirect(302, '/login');
    // if (locals.user?.role == 'admin') {
    //     redirect(302, '/dashboard/admin');
    // } else redirect(302, '/courses');
    return { user: locals.user };
};