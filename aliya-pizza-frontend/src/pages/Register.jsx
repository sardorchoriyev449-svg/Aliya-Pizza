import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AuthPages.css';

export default function Register() {
  const { register, login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', age: '', phone: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await register({ ...form, age: Number(form.age) });
    if (!res.success) {
      setLoading(false);
      setError(res.message || 'Ro\'yxatdan o\'tishda xatolik.');
      return;
    }
    // Ro'yxatdan o'tgach avtomatik tizimga kirish — foydalanuvchi qayta
    // parol kiritmasdan to'g'ridan-to'g'ri menyuga o'tadi.
    const loginRes = await login({ phone: form.phone, password: form.password });
    setLoading(false);
    if (loginRes.success) {
      navigate('/');
    } else {
      // Ro'yxatdan o'tish muvaffaqiyatli, lekin avtomatik kirish nimadir sababdan
      // amalga oshmadi — foydalanuvchi qo'lda kirishi uchun login sahifasiga o'tkazamiz.
      navigate('/login');
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card card">
        <h1 className="auth-title">Ro'yxatdan o'tish</h1>
        <p className="auth-sub">Bir necha soniyada hisob yarating.</p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Ism</label>
            <input
              required minLength={3}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="field">
            <label>Yosh</label>
            <input
              type="number" required min={16}
              value={form.age}
              onChange={(e) => setForm({ ...form, age: e.target.value })}
            />
          </div>
          <div className="field">
            <label>Telefon raqam</label>
            <div className="phone-input-wrap">
              <span className="phone-prefix">+998</span>
              <input
                type="tel" required maxLength={9}
                placeholder="901234567"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, '') })}
              />
            </div>
          </div>
          <div className="field">
            <label>Parol</label>
            <input
              type="password" required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>
          <button className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Yuborilmoqda...' : 'Ro\'yxatdan o\'tish'}
          </button>
        </form>

        <p className="auth-foot">Hisobingiz bormi? <Link to="/login">Kirish</Link></p>
      </div>
    </div>
  );
}