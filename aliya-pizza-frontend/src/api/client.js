export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * Backenddagi ba'zi endpointlar (masalan /sign-in) muvaffaqiyatli bo'lganda
 * JSON emas, balki HTTP redirect (302) qaytaradi. Buni avtomatik aniqlash uchun
 * `redirect: 'manual'` ishlatamiz — shunda fetch qayta yo'naltirmasdan,
 * "opaqueredirect" javobini qaytaradi va biz buni "muvaffaqiyatli" deb bilamiz.
 */
async function request(path, { method = 'GET', body, isForm = false } = {}) {
  let res;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      credentials: 'include', // httpOnly cookie (accessToken/refreshToken) yuborilishi uchun shart
      redirect: 'manual',
      headers: body && !isForm ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? (isForm ? body : JSON.stringify(body)) : undefined,
    });
  } catch (err) {
    return { success: false, message: `Backendga ulanib bo'lmadi (${API_URL}). Server ishga tushirilganini va CORS sozlamasini tekshiring.` };
  }

  if (res.type === 'opaqueredirect' || res.status === 0) {
    return { success: true };
  }

  let data = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok && (!data || data.success === undefined)) {
    return { success: false, message: data?.message || `So'rovda xatolik (${res.status})` };
  }

  return data ?? { success: true };
}

export const http = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: 'POST', body }),
  patch: (path, body) => request(path, { method: 'PATCH', body }),
  del: (path) => request(path, { method: 'DELETE' }),
};
