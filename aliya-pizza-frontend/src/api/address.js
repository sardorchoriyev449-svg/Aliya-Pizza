import { http } from './client';

export const getMyAddresses = () => http.get('/address');
export const createAddress = (dto) => http.post('/address', dto);
export const deleteAddress = (id) => http.del(`/address/${id}`);