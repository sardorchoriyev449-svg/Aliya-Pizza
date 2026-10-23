import { useEffect, useState } from 'react';
import { Pizza } from 'lucide-react';
import { getProducts } from '../api/products';
import { getCategories } from '../api/categories';
import { useSearch } from '../context/SearchContext';
import ProductCard from '../components/ProductCard';
import CategoryTabs from '../components/CategoryTabs';
import { API_URL } from '../api/client';
import './Home.css';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { query } = useSearch();

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError('');
      try {
        const [prodRes, catRes] = await Promise.all([getProducts(), getCategories()]);
        if (cancelled) return;

        if (Array.isArray(prodRes)) setProducts(prodRes);
        else setProducts([]);

        if (Array.isArray(catRes)) setCategories(catRes);
        else setCategories([]);

        if (!Array.isArray(prodRes) || !Array.isArray(catRes)) {
          setError(
            `Backend ma'lumot qaytarmadi (${API_URL}). Backend ishga tushirilganini va CORS sozlangan bo'lishini tekshiring.`
          );
        }
      } catch (err) {
        if (cancelled) return;
        setProducts([]);
        setCategories([]);
        setError(
          `Backendga ulanib bo'lmadi (${API_URL}). Backend ishlab turganini, portni va CORS sozlamasini tekshiring. (${err.message})`
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  function scrollToCategory(id) {
    document.getElementById(`cat-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  const q = query.trim().toLowerCase();
  const filteredProducts = q
    ? products.filter((p) => p.title.toLowerCase().includes(q))
    : products;

  return (
    <div className="home-page">
      {categories.length > 0 && <CategoryTabs categories={categories} onPick={scrollToCategory} />}

      <div className="container menu-section">
        {loading ? (
          <p className="muted">Yuklanmoqda...</p>
        ) : error ? (
          <div className="alert alert-error">{error}</div>
        ) : categories.length === 0 ? (
          <div className="empty-menu">
            <Pizza size={40} strokeWidth={1.6} color="var(--tomato-500)" />
            <p>Hozircha menyuda hech narsa yo'q. Tez orada yangi taomlar qo'shiladi!</p>
          </div>
        ) : (
          categories.map((cat) => {
            const items = filteredProducts.filter(
              (p) => (p.category_id?._id || p.category_id) === cat._id
            );
            if (q && items.length === 0) return null;
            return (
              <section key={cat._id} id={`cat-${cat._id}`} className="category-section">
                <h2 className="category-heading">{cat.name}</h2>
                {items.length === 0 ? (
                  <p className="muted">Bu bo'limda hozircha mahsulot yo'q.</p>
                ) : (
                  <div className="product-grid">
                    {items.map((p) => <ProductCard key={p._id} product={p} />)}
                  </div>
                )}
              </section>
            );
          })
        )}
      </div>
    </div>
  );
}
