import { API_URL } from './client';

/**
 * Rasm faylini backendga yuklaydi va saqlangan fayl manzilini (URL) qaytaradi.
 * Bu FormData/multipart so'rov bo'lgani uchun umumiy `http` mijozidan alohida yozildi.
 */
export async function uploadImage(file) {
  const formData = new FormData();
  formData.append('file', file);

  let res;
  try {
    res = await fetch(`${API_URL}/upload`, {
      method: 'POST',
      credentials: 'include',
      redirect: 'manual',
      body: formData,
    });
  } catch (err) {
    return { success: false, message: `Backendga ulanib bo'lmadi (${API_URL}).` };
  }

  if (res.type === 'opaqueredirect' || res.status === 0) {
    return { success: false, message: 'Fayl yuklash uchun avval tizimga kiring.' };
  }

  let data = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok || !data?.url) {
    return { success: false, message: data?.message || `Fayl yuklashda xatolik (${res.status})` };
  }

  return { success: true, url: data.url };
}
