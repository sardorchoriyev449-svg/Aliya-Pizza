import { useEffect, useState } from 'react';
import { getCategories, createCategory, deleteCategory } from '../../api/categories';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function load() {
    const res = await getCategories();
    if (Array.isArray(res)) setCategories(res);
  }

  useEffect(() => { load(); }, []);

  async function handleCreate(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await createCategory({ name });
    setLoading(false);
    if (res?.success === false) {
      setError(res.message);
    } else {
      setName('');
      load();
    }
  }

  async function handleDelete(id) {
    if (!confirm('Kategoriyani o\'chirmoqchimisiz?')) return;
    await deleteCategory(id);
    load();
  }

  return (
    <div className="admin-grid">
      <form className="admin-form-card card" onSubmit={handleCreate}>
        <h3>Yangi kategoriya</h3>
        {error && <div className="alert alert-error">{error}</div>}
        <div className="field">
          <label>Nomi</label>
          <input required minLength={3} value={name} onChange={(e) => setName(e.target.value)} placeholder="Masalan: Pitsalar" />
        </div>
        <button className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
          {loading ? 'Qo\'shilmoqda...' : 'Qo\'shish'}
        </button>
      </form>

      <div className="card" style={{ padding: '8px 4px' }}>
        <table className="admin-table">
          <thead>
            <tr><th>Nomi</th><th></th></tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c._id}>
                <td>{c.name}</td>
                <td>
                  <div className="row-actions">
                    <button onClick={() => handleDelete(c._id)}>O'chirish</button>
                  </div>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr><td colSpan={2} style={{ opacity: .6 }}>Kategoriyalar yo'q.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
