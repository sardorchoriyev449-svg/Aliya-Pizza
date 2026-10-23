import { useEffect, useState } from 'react';
import { MapPin, Phone, User, Clock, X } from 'lucide-react';
import { getOrders, subscribeToOrders, subscribeToOrderCancelled } from '../../api/orders';

function formatSum(n) {
  return new Intl.NumberFormat('uz-UZ').format(n || 0);
}

function formatDate(d) {
  return new Date(d).toLocaleString('uz-UZ', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [newCount, setNewCount] = useState(0);
  const [scope, setScope] = useState('today');

  useEffect(() => {
    (async () => {
      const res = await getOrders();
      setLoading(false);
      if (Array.isArray(res)) setOrders(res);
      else setError(res?.message || 'Buyurtmalarni yuklab bo\'lmadi.');
    })();

    // Yangi buyurtma real vaqtda kelganda ro'yxat boshiga qo'shamiz
    const unsubscribeNew = subscribeToOrders((order) => {
      setOrders((prev) => [order, ...prev]);
      setNewCount((n) => n + 1);
    });
    // Mijoz buyurtmani bekor qilsa, ro'yxatda ham darhol "bekor qilingan" bo'lib ko'rinadi
    const unsubscribeCancel = subscribeToOrderCancelled((orderId) => {
      setOrders((prev) => prev.map((o) => (o._id === orderId ? { ...o, status: 'CANCELLED' } : o)));
    });
    return () => { unsubscribeNew(); unsubscribeCancel(); };
  }, []);

  if (loading) return <p className="muted">Yuklanmoqda...</p>;
  if (error) return <div className="alert alert-error">{error}</div>;

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const visibleOrders = scope === 'today'
    ? orders.filter((o) => new Date(o.createdAt) >= todayStart)
    : orders;

  return (
    <div>
      <div className="scope-tabs">
        <button className={scope === 'today' ? 'active' : ''} onClick={() => setScope('today')}>Bugungi</button>
        <button className={scope === 'all' ? 'active' : ''} onClick={() => setScope('all')}>Barchasi</button>
      </div>
      <div className="orders-layout">
      <div className="orders-list-col">
        {newCount > 0 && (
          <div className="alert alert-success" style={{ cursor: 'pointer' }} onClick={() => setNewCount(0)}>
            {newCount} ta yangi buyurtma keldi!
          </div>
        )}
        {visibleOrders.length === 0 ? (
          <p className="muted">{scope === 'today' ? 'Bugun hali buyurtma yo\'q.' : 'Hozircha buyurtmalar yo\'q.'}</p>
        ) : (
          <div className="card" style={{ padding: '8px 4px' }}>
            <table className="admin-table">
              <thead>
                <tr><th>Mijoz</th><th>Summa</th><th>Vaqt</th><th>Holat</th><th></th></tr>
              </thead>
              <tbody>
                {visibleOrders.map((o) => (
                  <tr key={o._id} onClick={() => setSelected(o)} style={{ cursor: 'pointer' }}>
                    <td>{o.user_id?.name || 'Noma\'lum'}</td>
                    <td>{formatSum(o.total)} so'm</td>
                    <td>{formatDate(o.createdAt)}</td>
                    <td>
                      <span className={`order-status ${o.status === 'CANCELLED' ? 'cancelled' : 'pending'}`}>
                        {o.status === 'CANCELLED' ? 'Bekor qilingan' : 'Faol'}
                      </span>
                    </td>
                    <td><button onClick={(e) => { e.stopPropagation(); setSelected(o); }}>Ko'rish</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selected && (
        <div className="order-detail card">
          <button className="order-detail-close" onClick={() => setSelected(null)}><X size={18} /></button>
          <h3>Buyurtma tafsilotlari</h3>

          {selected.status === 'CANCELLED' && (
            <span className="order-status cancelled" style={{ marginBottom: 12, display: 'inline-block' }}>Bekor qilingan</span>
          )}

          <div className="profile-row"><User size={16} /> <span>{selected.user_id?.name || 'Noma\'lum'}</span></div>
          <div className="profile-row"><Phone size={16} /> <span>{selected.user_id?.phone || '-'}</span></div>
          <div className="profile-row"><Clock size={16} /> <span>{formatDate(selected.createdAt)}</span></div>

          <div className="order-address-box">
            <p className="order-address-label"><MapPin size={16} strokeWidth={2.2} /> {selected.address?.label}</p>
            <p className="order-address-text">{selected.address?.address_text}</p>
            {selected.address?.lat && selected.address?.lng && (
              <a
                className="order-map-link"
                href={`https://www.google.com/maps?q=${selected.address.lat},${selected.address.lng}`}
                target="_blank" rel="noreferrer"
              >
                Xaritada ko'rish →
              </a>
            )}
          </div>

          <p className="order-items-title">Mahsulotlar</p>
          <ul className="order-items-list">
            {selected.items?.map((it, idx) => (
              <li key={idx}>
                <span>{it.title} × {it.qty}</span>
                <span>{formatSum(it.price * it.qty)} so'm</span>
              </li>
            ))}
          </ul>

          <div className="order-total-row">
            <span>Jami</span>
            <strong>{formatSum(selected.total)} so'm</strong>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}