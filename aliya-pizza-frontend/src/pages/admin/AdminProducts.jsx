import { useEffect, useState } from 'react';
import { Upload } from 'lucide-react';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../../api/products';
import { getCategories } from '../../api/categories';
import { uploadImage } from '../../api/upload';

const emptyForm = { title: '', price: '', discriptions: '', image_url: '', category_id: '' };

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  async function load() {
    const [prodRes, catRes] = await Promise.all([getProducts(), getCategories()]);
    if (Array.isArray(prodRes)) setProducts(prodRes);
    if (Array.isArray(catRes)) setCategories(catRes);
  }

  useEffect(() => { load(); }, []);

  function startEdit(p) {
    setEditingId(p._id);
    setForm({
      title: p.title,
      price: p.price,
      discriptions: p.discriptions,
      image_url: p.image_url,
      category_id: p.category_id?._id || p.category_id || '',
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError('');
    setUploading(true);
    const res = await uploadImage(file);
    setUploading(false);
    if (res.success) {
      setForm((f) => ({ ...f, image_url: res.url }));
    } else {
      setError(res.message || 'Rasm yuklashda xatolik.');
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!form.image_url) {
      setError('Iltimos, avval rasm faylini yuklang.');
      return;
    }
    setLoading(true);
    const dto = { ...form, price: Number(form.price) };
    const res = editingId ? await updateProduct(editingId, dto) : await createProduct(dto);
    setLoading(false);
    if (res?.success === false) {
      setError(res.message || 'Faqat admin ushbu amalni bajara oladi.');
    } else {
      cancelEdit();
      load();
    }
  }

  async function handleDelete(id) {
    if (!confirm('Mahsulotni o\'chirmoqchimisiz?')) return;
    await deleteProduct(id);
    load();
  }

  return (
    <div className="admin-grid">
      <form className="admin-form-card card" onSubmit={handleSubmit}>
        <h3>{editingId ? 'Mahsulotni tahrirlash' : 'Yangi mahsulot'}</h3>
        {error && <div className="alert alert-error">{error}</div>}
        <div className="field">
          <label>Nomi</label>
          <input required minLength={3} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        </div>
        <div className="field">
          <label>Narxi (so'm)</label>
          <input type="number" required value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
        </div>
        <div className="field">
          <label>Kategoriya</label>
          <select required value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })}>
            <option value="">Tanlang</option>
            {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
        </div>
        <div className="field">
          <label>Tavsif</label>
          <textarea required rows={3} value={form.discriptions} onChange={(e) => setForm({ ...form, discriptions: e.target.value })} />
        </div>
        <div className="field">
          <label>Rasm</label>
          <label className="file-drop">
            <input type="file" accept="image/*" onChange={handleFileChange} hidden />
            <Upload size={16} strokeWidth={2.2} />
            <span>{uploading ? 'Yuklanmoqda...' : form.image_url ? 'Rasmni almashtirish' : 'Rasm tanlash'}</span>
          </label>
          {form.image_url && (
            <img src={form.image_url} alt="Ko'rinish" className="file-preview" />
          )}
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-primary" style={{ flex: 1 }} disabled={loading || uploading}>
            {loading ? 'Saqlanmoqda...' : editingId ? 'Saqlash' : 'Qo\'shish'}
          </button>
          {editingId && <button type="button" className="btn btn-ghost" onClick={cancelEdit}>Bekor qilish</button>}
        </div>
      </form>

      <div className="card" style={{ padding: '8px 4px' }}>
        <table className="admin-table">
          <thead>
            <tr><th></th><th>Nomi</th><th>Narxi</th><th></th></tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id}>
                <td><img src={p.image_url} alt="" /></td>
                <td>{p.title}</td>
                <td>{new Intl.NumberFormat('uz-UZ').format(p.price)} so'm</td>
                <td>
                  <div className="row-actions">
                    <button onClick={() => startEdit(p)}>Tahrirlash</button>
                    <button onClick={() => handleDelete(p._id)}>O'chirish</button>
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr><td colSpan={4} style={{ opacity: .6 }}>Mahsulotlar yo'q.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
