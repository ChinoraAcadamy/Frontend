export const load = async ({ parent }) => {
    const { modules } = await parent();

    return { modules };
};