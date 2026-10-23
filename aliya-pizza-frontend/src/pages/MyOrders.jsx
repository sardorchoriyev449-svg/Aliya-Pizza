import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, MapPin, Phone, X } from 'lucide-react';
import { getMyOrders, cancelOrder } from '../api/orders';
import { getContactPhone } from '../api/auth';
import './MyOrders.css';

function formatSum(n) {
  return new Intl.NumberFormat('uz-UZ').format(n || 0);
}

const CANCEL_WINDOW_MIN = 20;

function useNow() {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(id);
  }, []);
  return now;
}

function OrderStatusInfo({ order, now }) {
  if (order.status === 'CANCELLED') {
    return <span className="order-status cancelled">Bekor qilingan</span>;
  }
  const createdAt = new Date(order.createdAt).getTime();
  const readyAt = createdAt + (order.estimated_minutes || 40) * 60000;
  const remainingMin = Math.max(0, Math.round((readyAt - now) / 60000));

  if (remainingMin === 0) {
    return <span className="order-status ready">Tayyor bo'lishi kerak</span>;
  }
  return <span className="order-status pending">Taxminan {remainingMin} daqiqada tayyor</span>;
}

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [cancellingId, setCancellingId] = useState(null);
  const now = useNow();

  useEffect(() => {
    (async () => {
      const res = await getMyOrders();
      setLoading(false);
      if (Array.isArray(res)) setOrders(res);
      else setError(res?.message || 'Buyurtmalarni yuklab bo\'lmadi.');
    })();
    (async () => {
      const res = await getContactPhone();
      if (res?.phone) setContactPhone(res.phone);
    })();
  }, []);

  async function handleCancel(id) {
    if (!confirm('Buyurtmani bekor qilishni tasdiqlaysizmi?')) return;
    setCancellingId(id);
    const res = await cancelOrder(id);
    setCancellingId(null);
    if (res?.success === false) {
      alert(res.message);
      return;
    }
    setOrders((prev) => prev.map((o) => (o._id === id ? { ...o, status: 'CANCELLED' } : o)));
  }

  function canCancel(order) {
    if (order.status === 'CANCELLED') return false;
    const minutesPassed = (now - new Date(order.createdAt).getTime()) / 60000;
    return minutesPassed <= CANCEL_WINDOW_MIN;
  }

  if (loading) return <div className="container my-orders-page"><p className="muted">Yuklanmoqda...</p></div>;

  return (
    <div className="container my-orders-page">
      <h1 className="cart-title">Buyurtmalarim</h1>

      {contactPhone && (
        <p className="contact-line" style={{ marginBottom: 20 }}>
          <Phone size={15} strokeWidth={2.2} /> Savol tug'ilsa: <strong>{contactPhone}</strong>
        </p>
      )}

      {error && <div className="alert alert-error">{error}</div>}

      {orders.length === 0 ? (
        <div className="card empty-state">
          <p>Hozircha buyurtmalaringiz yo'q.</p>
          <Link to="/" className="btn btn-primary">Menyuga o'tish</Link>
        </div>
      ) : (
        <div className="my-orders-list">
          {orders.map((o) => (
            <div className="card my-order-card" key={o._id}>
              <div className="my-order-head">
                <span className="my-order-date">
                  {new Date(o.createdAt).toLocaleString('uz-UZ', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                </span>
                <OrderStatusInfo order={o} now={now} />
              </div>

              <ul className="order-items-list">
                {o.items.map((it, idx) => (
                  <li key={idx}>
                    <span>{it.title} × {it.qty}</span>
                    <span>{formatSum(it.price * it.qty)} so'm</span>
                  </li>
                ))}
              </ul>

              <p className="my-order-address"><MapPin size={14} strokeWidth={2.2} /> {o.address?.address_text}</p>

              <div className="my-order-foot">
                <strong>{formatSum(o.total)} so'm</strong>
                {canCancel(o) && (
                  <button
                    className="btn btn-danger cancel-btn"
                    onClick={() => handleCancel(o._id)}
                    disabled={cancellingId === o._id}
                  >
                    <X size={14} strokeWidth={2.2} />
                    {cancellingId === o._id ? 'Bekor qilinmoqda...' : 'Bekor qilish'}
                  </button>
                )}
                {!canCancel(o) && o.status !== 'CANCELLED' && (
                  <span className="cancel-expired"><Clock size={13} /> Bekor qilish vaqti tugagan</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}