import { useNavigate } from 'react-router-dom';
import { User as UserIcon, Phone, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './AuthPages.css';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  async function handleLogout() {
    await logout();
    navigate('/');
  }

  return (
    <div className="auth-page">
      <div className="auth-card card">
        <h1 className="auth-title">Profil</h1>
        <p className="auth-sub">Hisobingiz ma'lumotlari.</p>

        <div className="profile-row">
          <UserIcon size={18} strokeWidth={2} />
          <span>{user.name}</span>
        </div>
        <div className="profile-row">
          <Phone size={18} strokeWidth={2} />
          <span>{user.phone}</span>
        </div>

        <button className="btn btn-ghost" style={{ width: '100%', marginTop: 20 }} onClick={handleLogout}>
          <LogOut size={16} strokeWidth={2.2} />
          Chiqish
        </button>
      </div>
    </div>
  );
}