import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AuthPages.css';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ phone: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await login(form);
    setLoading(false);
    if (res.success) {
      navigate('/');
    } else {
      setError(res.message || 'Kirishda xatolik yuz berdi.');
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card card">
        <h1 className="auth-title">Kirish</h1>
        <p className="auth-sub">Hisobingizga kiring va buyurtma bering.</p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Telefon raqam</label>
            <div className="phone-input-wrap">
              <span className="phone-prefix">+998</span>
              <input
                type="tel"
                required
                maxLength={9}
                placeholder="901234567"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, '') })}
              />
            </div>
          </div>
          <div className="field">
            <label>Parol</label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>
          <button className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Tekshirilmoqda...' : 'Kirish'}
          </button>
        </form>

        <p className="auth-foot">Hisobingiz yo'qmi? <Link to="/register">Ro'yxatdan o'tish</Link></p>
      </div>
    </div>
  );
}
