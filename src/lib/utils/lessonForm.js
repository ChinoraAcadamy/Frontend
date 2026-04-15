/**
 * Parses backend error responses into human-readable strings.
 * @param {any} data - The error data from the backend.
 * @returns {string} - Formatted error message.
 */
export function parseBackendError(data) {
    if (!data) return "Xatolik yuz berdi";
    if (typeof data === "string") return data;
    if (data.detail) return data.detail;
    if (data.message) return data.message;

    const fieldMap = {
        title_uz: "Dars nomi (UZ)",
        title_ru: "Dars nomi (RU)",
        description_uz: "Tavsif (UZ)",
        description_ru: "Tavsif (RU)",
        video_url: "Video fayl",
        module_pk: "Modul",
        duration: "Davomiyligi",
    };

    const errors = [];
    for (const key in data) {
        const label = fieldMap[key] || key;
        const val = data[key];
        if (Array.isArray(val)) {
            errors.push(`${label}: ${val.join(", ")}`);
        } else if (typeof val === "string") {
            errors.push(`${label}: ${val}`);
        }
    }

    return errors.length > 0 ? errors.join("\n") : "Xatolik yuz berdi";
}

/**
 * Gets the duration of a video file in minutes (rounded up).
 * @param {File} file - The video file.
 * @returns {Promise<number>} - Duration in minutes.
 */
export async function getVideoDuration(file) {
    return new Promise((resolve) => {
        const video = document.createElement("video");
        video.preload = "metadata";
        video.onloadedmetadata = () => {
            window.URL.revokeObjectURL(video.src);
            // Duration is in seconds, convert to minutes and round up to nearest integer
            resolve(Math.ceil(video.duration / 60));
        };
        video.onerror = () => {
            resolve(0);
        };
        video.src = URL.createObjectURL(file);
    });
}
