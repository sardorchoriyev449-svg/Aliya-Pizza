import { io } from 'socket.io-client';
import { http, API_URL } from './client';

export const createOrder = (items, address) => http.post('/order', { items, address });
export const getStats = () => http.get('/order/stats');
export const getOrders = () => http.get('/order');
export const getMyOrders = () => http.get('/order/mine');
export const cancelOrder = (id) => http.patch(`/order/${id}/cancel`);

let socket;

/**
 * Admin panelda yangi buyurtmalarni real vaqtda kuzatish uchun.
 * onNewOrder(order) — yangi buyurtma kelganda chaqiriladi.
 * Qaytarilgan funksiyani chaqirish orqali obunani bekor qilish mumkin.
 */
export function subscribeToOrders(onNewOrder) {
  if (!socket) {
    socket = io(API_URL, { withCredentials: true });
  }
  socket.on('new-order', onNewOrder);
  return () => socket.off('new-order', onNewOrder);
}

export function subscribeToOrderCancelled(onCancelled) {
  if (!socket) {
    socket = io(API_URL, { withCredentials: true });
  }
  socket.on('order-cancelled', onCancelled);
  return () => socket.off('order-cancelled', onCancelled);
}