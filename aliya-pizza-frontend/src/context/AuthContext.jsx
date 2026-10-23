import { createContext, useContext, useEffect, useState } from 'react';
import { loginUser, registerUser, logoutUser, getMe } from '../api/auth';

const AuthContext = createContext(null);

/**
 * "isAuthed" — localStorage'dagi yengil ko'rsatkich (UI uchun, xavfsizlik uchun emas).
 * "user" — /me endpointidan kelgan haqiqiy ma'lumot (ism, rol) — Admin/Profil
 * tugmasini to'g'ri ko'rsatish uchun shundan foydalanamiz.
 */
const STORAGE_KEY = 'aliya_pizza_auth_hint';

export function AuthProvider({ children }) {
  const [isAuthed, setIsAuthed] = useState(() => localStorage.getItem(STORAGE_KEY) === '1');
  const [user, setUser] = useState(null);

  async function refreshMe() {
    const res = await getMe();
    if (res?.success !== false && res?.data) {
      setUser(res.data);
    } else {
      // Cookie muddati tugagan yoki noto'g'ri bo'lsa — lokal holatni ham tozalaymiz
      setUser(null);
      localStorage.removeItem(STORAGE_KEY);
      setIsAuthed(false);
    }
  }

  useEffect(() => {
    if (isAuthed) refreshMe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function login(dto) {
    const res = await loginUser(dto);
    if (res.success) {
      localStorage.setItem(STORAGE_KEY, '1');
      setIsAuthed(true);
      await refreshMe();
    }
    return res;
  }

  async function register(dto) {
    return await registerUser(dto);
  }

  async function logout() {
    try {
      await logoutUser();
    } catch {
      // backend /logout hozircha nosoz — baribir lokal holatni tozalaymiz
    }
    localStorage.removeItem(STORAGE_KEY);
    setIsAuthed(false);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ isAuthed, user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}