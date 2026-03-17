// src/routes/+layout.server.js
/** @type {import('./$types').LayoutServerLoad} */
export const load = async ({ locals }) => {
    return {
        isAuthenticated: locals.isAuthenticated,
        user: locals.user  // ← bu qo'shildi
    };
};