import { http } from './client';

export const getProducts = () => http.get('/product');
export const getProduct = (id) => http.get(`/product/${id}`);
export const createProduct = (dto) => http.post('/product', dto);
export const updateProduct = (id, dto) => http.patch(`/product/${id}`, dto);
export const deleteProduct = (id) => http.del(`/product/${id}`);
