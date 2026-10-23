import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { CheckCircle2, ShoppingCart, Minus, Plus, X, MapPin, LocateFixed, Phone } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createOrder } from '../api/orders';
import { getMyAddresses, createAddress } from '../api/address';
import { getContactPhone } from '../api/auth';
import './Cart.css';

function formatSum(n) {
  return new Intl.NumberFormat('uz-UZ').format(n);
}

export default function Cart() {
  const { items, addItem, decrementItem, removeItem, clearCart, total } = useCart();
  const { isAuthed } = useAuth();
  const navigate = useNavigate();
  const [placed, setPlaced] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [contactPhone, setContactPhone] = useState('');

  const [showAddressForm, setShowAddressForm] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [addressForm, setAddressForm] = useState({ label: 'Uy', address_text: '', lat: null, lng: null });
  const [locating, setLocating] = useState(false);
  const [locateMsg, setLocateMsg] = useState('');

  useEffect(() => {
    if (!isAuthed) return;
    (async () => {
      const res = await getMyAddresses();
      if (Array.isArray(res) && res.length > 0) {
        setSavedAddresses(res);
      }
    })();
  }, [isAuthed]);

  useEffect(() => {
    (async () => {
      const res = await getContactPhone();
      if (res?.phone) setContactPhone(res.phone);
    })();
  }, []);

  function handleLocate() {
    if (!navigator.geolocation) {
      setLocateMsg('Brauzeringiz joylashuvni aniqlashni qo\'llamaydi.');
      return;
    }
    setLocating(true);
    setLocateMsg('');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setAddressForm((f) => ({ ...f, lat: pos.coords.latitude, lng: pos.coords.longitude }));
        setLocating(false);
        setLocateMsg('Joylashuvingiz aniqlandi ✓');
      },
      () => {
        setLocating(false);
        setLocateMsg('Joylashuvni aniqlab bo\'lmadi. Iltimos, brauzerda ruxsat bering va qayta urining.');
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }

  function handleStartCheckout() {
    if (!isAuthed) {
      navigate('/login');
      return;
    }
    setShowAddressForm(true);
  }

  function pickSavedAddress(a) {
    setAddressForm({ label: a.label, address_text: a.address_text, lat: a.lat ?? null, lng: a.lng ?? null });
    setLocateMsg(a.lat && a.lng ? '' : 'Bu manzil uchun joylashuvni qayta aniqlashingiz kerak.');
  }

  const hasLocation = addressForm.lat != null && addressForm.lng != null;

  async function handleConfirmOrder(e) {
    e.preventDefault();
    setError('');

    // Joylashuv MAJBURIY — soxta/qo'lda kiritilgan manzil bilan aldashning oldini olish uchun.
    if (!hasLocation) {
      setError('Iltimos, avval "Joylashuvimni aniqlash" tugmasini bosing. Bu majburiy.');
      return;
    }

    setLoading(true);

    const alreadySaved = savedAddresses.some((a) => a.address_text === addressForm.address_text);
    if (!alreadySaved) {
      await createAddress(addressForm);
    }

    const orderItems = items.map((i) => ({
      product_id: i._id,
      title: i.title,
      price: i.price,
      qty: i.qty,
    }));
    const res = await createOrder(orderItems, addressForm);
    setLoading(false);
    if (res?.success === false) {
      setError(res.message || 'Buyurtma berishda xatolik yuz berdi.');
      return;
    }
    setPlaced(true);
    clearCart();
  }

  if (placed) {
    return (
      <div className="container cart-page">
        <div className="card empty-state">
          <CheckCircle2 size={44} strokeWidth={1.6} color="var(--tomato-500)" />
          <h2>Buyurtma qabul qilindi!</h2>
          <p>Buyurtmangiz manzilingizga muvaffaqiyatli qabul qilindi. Holatini "Buyurtmalarim" bo'limidan kuzatishingiz mumkin.</p>
          {contactPhone && (
            <p className="contact-line"><Phone size={15} strokeWidth={2.2} /> Savol tug'ilsa: <strong>{contactPhone}</strong></p>
          )}
          <div style={{ display: 'flex', gap: 10 }}>
            <Link to="/my-orders" className="btn btn-primary">Buyurtmalarim</Link>
            <Link to="/" className="btn btn-ghost">Menyuga qaytish</Link>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container cart-page">
        <div className="card empty-state">
          <ShoppingCart size={40} strokeWidth={1.6} color="var(--tomato-500)" />
          <h2>Savat bo'sh</h2>
          <p>Menyudan yoqtirgan pitsangizni tanlang.</p>
          <Link to="/" className="btn btn-primary">Menyuga o'tish</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container cart-page">
      <h1 className="cart-title">Savat</h1>
      <div className="cart-list">
        {items.map((item) => (
          <div className="cart-row card" key={item._id}>
            <img src={item.image_url} alt={item.title} className="cart-thumb" />
            <div className="cart-info">
              <h3>{item.title}</h3>
              <span className="cart-unit-price">{formatSum(item.price)} so'm / dona</span>
            </div>
            <div className="qty-control">
              <button onClick={() => decrementItem(item._id)} aria-label="Kamaytirish"><Minus size={14} strokeWidth={2.4} /></button>
              <span>{item.qty}</span>
              <button onClick={() => addItem(item)} aria-label="Ko'paytirish"><Plus size={14} strokeWidth={2.4} /></button>
            </div>
            <div className="cart-line-total">{formatSum(item.price * item.qty)} so'm</div>
            <button className="remove-btn" onClick={() => removeItem(item._id)} aria-label="O'chirish"><X size={16} strokeWidth={2.2} /></button>
          </div>
        ))}
      </div>

      {showAddressForm ? (
        <form className="cart-summary card address-form" onSubmit={handleConfirmOrder}>
          <h3 className="address-form-title"><MapPin size={18} strokeWidth={2.2} /> Yetkazib berish manzili</h3>

          {savedAddresses.length > 0 && (
            <div className="saved-address-list">
              {savedAddresses.map((a) => (
                <button
                  type="button"
                  key={a._id}
                  className={`saved-address-pill ${addressForm.address_text === a.address_text ? 'active' : ''}`}
                  onClick={() => pickSavedAddress(a)}
                >
                  {a.label}
                </button>
              ))}
            </div>
          )}

          {error && <div className="alert alert-error">{error}</div>}

          <div className="field">
            <label>Manzil nomi (Uy, Ish...)</label>
            <input
              required
              value={addressForm.label}
              onChange={(e) => setAddressForm({ ...addressForm, label: e.target.value })}
            />
          </div>
          <div className="field">
            <label>To'liq manzil</label>
            <textarea
              required rows={2}
              placeholder="Ko'cha, uy, xonadon raqami..."
              value={addressForm.address_text}
              onChange={(e) => setAddressForm({ ...addressForm, address_text: e.target.value })}
            />
          </div>

          <button type="button" className={`btn locate-btn ${hasLocation ? 'btn-ghost locate-done' : 'btn-primary'}`} onClick={handleLocate} disabled={locating}>
            <LocateFixed size={16} strokeWidth={2.2} />
            {locating ? 'Aniqlanmoqda...' : hasLocation ? 'Joylashuv aniqlandi ✓ (qayta aniqlash)' : 'Joylashuvimni aniqlash (majburiy)'}
          </button>
          {locateMsg && <p className="locate-msg">{locateMsg}</p>}
          {!hasLocation && (
            <p className="locate-required-note">
              Aldov va noto'g'ri manzillarning oldini olish uchun buyurtma faqat GPS orqali tasdiqlangan joylashuv bilan qabul qilinadi.
            </p>
          )}

          <div className="summary-row" style={{ marginTop: 14 }}>
            <span>Jami</span>
            <strong>{formatSum(total)} so'm</strong>
          </div>
          <button className="btn btn-primary checkout-btn" disabled={loading || !hasLocation}>
            {loading ? 'Yuborilmoqda...' : 'Buyurtmani tasdiqlash'}
          </button>
        </form>
      ) : (
        <div className="cart-summary card">
          <div className="summary-row">
            <span>Jami</span>
            <strong>{formatSum(total)} so'm</strong>
          </div>
          <button className="btn btn-primary checkout-btn" onClick={handleStartCheckout}>
            {isAuthed ? 'Buyurtmani rasmiylashtirish' : 'Kirish va buyurtma berish'}
          </button>
        </div>
      )}
    </div>
  );
}