import { http } from './client';

export const registerUser = (dto) => http.post('/sign-up', dto);
export const loginUser = (dto) => http.post('/sign-in', dto);
export const getMe = () => http.get('/me');
export const getContactPhone = () => http.get('/contact-phone');
// Eslatma: backendning /logout endpointi hozircha o'zini o'zi chaqirayotgani uchun
// (auth.controller.ts) ishlamaydi. Xatolar bo'limidagi tuzatishga qarang.
export const logoutUser = () => http.post('/logout');