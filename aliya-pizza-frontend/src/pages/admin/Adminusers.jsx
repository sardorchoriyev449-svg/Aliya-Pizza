import { useEffect, useState, Fragment } from 'react';
import { Search, MapPin, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { getUsers, updateUser, deleteUser } from '../../api/users';
import { useAuth } from '../../context/AuthContext';

export default function AdminUsers() {
  const { user: me } = useAuth();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  async function load(searchTerm = '') {
    setLoading(true);
    const res = await getUsers(searchTerm);
    setLoading(false);
    if (Array.isArray(res)) {
      setUsers(res);
      setError('');
    } else {
      setError(res?.message || 'Foydalanuvchilarni yuklab bo\'lmadi.');
    }
  }

  useEffect(() => { load(); }, []);

  function handleSearchSubmit(e) {
    e.preventDefault();
    load(search);
  }

  async function handleRoleChange(u, newRole) {
    if (!confirm(`${u.name}ning rolini ${newRole === 'ADMIN' ? 'Admin' : 'User'}ga o'zgartirmoqchimisiz?`)) return;
    const res = await updateUser(u._id, { role: newRole });
    if (res?.success === false) {
      alert(res.message);
      return;
    }
    load(search);
  }

  async function handleDelete(u) {
    if (!confirm(`${u.name} (${u.phone})ni o'chirmoqchimisiz? Bu amalni orqaga qaytarib bo'lmaydi.`)) return;
    const res = await deleteUser(u._id);
    if (res?.success === false) {
      alert(res.message);
      return;
    }
    load(search);
  }

  if (loading) return <p className="muted">Yuklanmoqda...</p>;
  if (error) return <div className="alert alert-error">{error}</div>;

  return (
    <div>
      <form className="user-search-box" onSubmit={handleSearchSubmit}>
        <Search size={16} strokeWidth={2.2} />
        <input
          placeholder="Ism yoki telefon bo'yicha qidirish..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit" className="btn btn-ghost" style={{ padding: '8px 16px' }}>Qidirish</button>
      </form>

      <div className="card" style={{ padding: '8px 4px' }}>
        <table className="admin-table">
          <thead>
            <tr><th></th><th>Ism</th><th>Telefon</th><th>Rol</th><th>Manzillar</th><th></th></tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <Fragment key={u._id}>
                <tr>
                  <td>
                    <button onClick={() => setExpandedId(expandedId === u._id ? null : u._id)}>
                      {expandedId === u._id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                  </td>
                  <td>{u.name}</td>
                  <td>{u.phone}</td>
                  <td>
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u, e.target.value)}
                      disabled={me?.id === u._id}
                      className="role-select"
                    >
                      <option value="USER">User</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  </td>
                  <td>{u.addresses?.length || 0} ta</td>
                  <td>
                    <div className="row-actions">
                      <button onClick={() => handleDelete(u)} disabled={me?.id === u._id} title="O'chirish">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
                {expandedId === u._id && (
                  <tr>
                    <td colSpan={6} style={{ background: 'var(--char-800)' }}>
                      {u.addresses?.length ? (
                        <div className="user-address-list">
                          {u.addresses.map((a) => (
                            <div className="user-address-item" key={a._id}>
                              <MapPin size={14} strokeWidth={2.2} />
                              <span><strong>{a.label}:</strong> {a.address_text}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span style={{ opacity: .6, fontSize: 13 }}>Manzillar yo'q.</span>
                      )}
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
            {users.length === 0 && (
              <tr><td colSpan={6} style={{ opacity: .6 }}>Foydalanuvchilar topilmadi.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}