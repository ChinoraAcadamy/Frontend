/**
 * Backend xabarlarini frontend tarjima kalitlariga moslashtirish lug'ati.
 * Backenddan keladigan matnlar (Uzbek va Ingliz tillarida) shu yerda to'plangan.
 */
export const SERVER_MESSAGE_MAP = {
    // --- Auth & Hisob ---
    "Hisobingiz bloklangan": "err_account_blocked",
    "Chiqildi": "info_logged_out",
    "Boshqa qurilmadan kirilgan, qayta login qiling": "err_another_device_logged_in",
    "Parol muvaffaqiyatli o'zgartirildi": "info_password_changed",
    "Parollar bir-biriga mos kelmadi. Iltimos, qaytadan tekshiring.": "err_passwords_mismatch",
    
    // --- Kurslar va Enrollment ---
    "Bu student bu kursga allaqachon biriktirilgan": "err_student_already_enrolled",
    "Faqat studentlarni biriktirish mumkin": "err_only_students_allowed",
    "Faqat nashr qilingan kurslarga biriktirish mumkin": "err_only_published_courses_allowed",
    "Student allaqachon bloklangan": "err_student_already_blocked",
    "Student bloklangan emas": "err_student_not_blocked",
    "Student faolsizlantirildi": "info_student_deactivated",
    "Bu kursga kirishga ruxsat yo'q": "err_no_access_to_course",
    "Siz bu kursga yozilmagansiz yoki bloklangansiz.": "err_not_enrolled_or_blocked",
    
    // --- Darslar va Progress ---
    "Fayl yoki matn javob yuborish shart": "err_submission_empty",
    "Dars tugallandi": "info_lesson_completed",
    "Dars saqlandi": "info_lesson_saved",
    "Bu topshiriq uchun matn javob yuborish shart": "err_text_answer_required",
    "Bu topshiriq turi uchun fayl yuborib bo‘lmaydi": "err_file_not_allowed",
    "Bu topshiriq uchun fayl yuborish shart": "err_file_required",
    "Bu topshiriq turi uchun matn yuborib bo‘lmaydi": "err_text_not_allowed",
    "Kamida bitta til bo‘lishi kerak: uz yoki ru": "err_at_least_one_language_required",

    // --- Standart DRF / JWT xabarlari (Inglizcha) ---
    "No active account found with the given credentials": "err_invalid_credentials",
    "Authentication credentials were not provided.": "err_auth_required",
    "Token is invalid or expired": "err_token_invalid",
    "User not found": "err_user_not_found",
    "This field is required.": "err_field_required",
    "Invalid token.": "err_token_invalid",
    "Invalid username or password": "err_invalid_credentials"
};

/**
 * Backenddan kelgan xabarni paraglide orqali tarjima qiladi.
 * @param {any} errorData - Backend javobidagi detail, message yoki butun error obyekti
 * @param {any} m - Paraglide messages moduli ($lib/paraglide/messages.js)
 * @returns {string} - Tarjima qilingan matn
 */
export function translateServerMessage(errorData, m) {
    let message = '';
    
    if (typeof errorData === 'string') {
        message = errorData;
    } else if (errorData && typeof errorData === 'object') {
        // DRF ko'pincha 'detail' yoki 'message' qaytaradi
        message = errorData.detail || errorData.message || "";
        
        // Agar ob'ektda maydonlar bo'lsa (Validation error), birinchisini olamiz (faqat matn bo'lsa)
        if (!message && Object.keys(errorData).length > 0) {
            const firstKey = Object.keys(errorData)[0];
            const firstVal = errorData[firstKey];
            if (Array.isArray(firstVal)) {
                message = firstVal[0];
            } else if (typeof firstVal === 'string') {
                message = firstVal;
            }
        }
    }

    if (!message) return m.error_occurred ? m.error_occurred() : "Xatolik yuz berdi";

    // 1. To'liq mos kelishini tekshiramiz
    const key = SERVER_MESSAGE_MAP[message];
    if (key && m[key]) {
        try {
            return m[key]();
        } catch (e) {
            return message;
        }
    }

    // 2. Qisman mos kelishini tekshiramiz (dinamik matnlar uchun)
    if (message.includes("Urinishlar soni tugadi")) {
        return m.err_attempts_exhausted ? m.err_attempts_exhausted() : message;
    }
    if (message.includes("Maksimal ball")) {
        return m.err_max_score_exceeded ? m.err_max_score_exceeded() : message;
    }

    // 3. Agar tarjima topilmasa, asl matnni qaytaramiz
    return message;
}
