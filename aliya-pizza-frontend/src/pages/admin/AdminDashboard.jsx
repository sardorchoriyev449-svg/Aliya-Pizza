import { useState } from 'react';
import AdminStats from './AdminStats';
import AdminOrders from './AdminOrders';
import AdminUsers from './AdminUsers';
import AdminCategories from './AdminCategories';
import AdminProducts from './AdminProducts';
import './Admin.css';

export default function AdminDashboard() {
  const [tab, setTab] = useState('stats');

  return (
    <div className="container admin-page">
      <h1 className="admin-title">Admin panel</h1>
      <p className="admin-sub">
        Mahsulot va kategoriyalarni boshqaring. Amallar faqat admin hisobi bilan tizimga kirilganda ishlaydi —
        boshqa foydalanuvchilar urinsa, server "Faqat Admin!" xabarini qaytaradi.
      </p>

      <div className="admin-tabs">
        <button className={tab === 'stats' ? 'active' : ''} onClick={() => setTab('stats')}>Statistika</button>
        <button className={tab === 'orders' ? 'active' : ''} onClick={() => setTab('orders')}>Buyurtmalar</button>
        <button className={tab === 'users' ? 'active' : ''} onClick={() => setTab('users')}>Foydalanuvchilar</button>
        <button className={tab === 'products' ? 'active' : ''} onClick={() => setTab('products')}>Mahsulotlar</button>
        <button className={tab === 'categories' ? 'active' : ''} onClick={() => setTab('categories')}>Kategoriyalar</button>
      </div>

      {tab === 'stats' && <AdminStats />}
      {tab === 'orders' && <AdminOrders />}
      {tab === 'users' && <AdminUsers />}
      {tab === 'products' && <AdminProducts />}
      {tab === 'categories' && <AdminCategories />}
    </div>
  );
}