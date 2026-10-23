import { http } from './client';

export const getUsers = (search) => http.get(`/user${search ? `?search=${encodeURIComponent(search)}` : ''}`);
export const getUser = (id) => http.get(`/user/${id}`);
export const updateUser = (id, dto) => http.patch(`/user/${id}`, dto);
export const deleteUser = (id) => http.del(`/user/${id}`);