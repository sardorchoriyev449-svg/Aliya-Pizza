import { http } from './client';

export const getCategories = () => http.get('/category/all');
export const getCategory = (id) => http.get(`/category/${id}`);
export const createCategory = (dto) => http.post('/category/create', dto);
export const updateCategory = (id, dto) => http.patch(`/category/update/${id}`, dto);
export const deleteCategory = (id) => http.del(`/category/delete/${id}`);
