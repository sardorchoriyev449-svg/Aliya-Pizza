import { Link } from 'react-router-dom';
import { Search, ShoppingCart, LayoutDashboard, User, Receipt } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useSearch } from '../context/SearchContext';
import './Header.css';

export default function Header() {
  const { isAuthed, user, logout } = useAuth();
  const { count } = useCart();
  const { query, setQuery } = useSearch();

  function handleSearchSubmit(e) {
    e.preventDefault();
  }

  return (
    <header className="site-header">
      <div className="container header-row">
        <Link to="/" className="logo-box">Aliya <em>Pizza</em></Link>

        <form className="search-box" onSubmit={handleSearchSubmit}>
          <Search size={16} strokeWidth={2.4} className="search-icon" />
          <input
            type="text"
            placeholder="tezda topish ..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" className="search-submit" aria-label="Qidirish">
            <Search size={16} strokeWidth={2.4} />
          </button>
        </form>

        <div className="header-actions">
          {isAuthed && user?.role === 'ADMIN' && (
            <Link to="/admin" className="pill-btn" title="Admin panel">
              <LayoutDashboard size={16} strokeWidth={2.4} />
              <span>Admin</span>
            </Link>
          )}
          {isAuthed && user && user.role !== 'ADMIN' && (
            <>
              <Link to="/my-orders" className="pill-btn" title="Buyurtmalarim">
                <Receipt size={16} strokeWidth={2.4} />
                <span>Buyurtmalarim</span>
              </Link>
              <Link to="/profile" className="pill-btn" title="Profil">
                <User size={16} strokeWidth={2.4} />
                <span>Profil</span>
              </Link>
            </>
          )}
          <Link to="/cart" className="pill-btn cart-pill" aria-label="Savat">
            <ShoppingCart size={17} strokeWidth={2.2} />
            {count > 0 && <span className="cart-badge">{count}</span>}
          </Link>
          {isAuthed ? (
            <button className="pill-btn" onClick={logout}>Chiqish</button>
          ) : (
            <Link to="/login" className="pill-btn">Kirish</Link>
          )}
        </div>
      </div>
    </header>
  );
}