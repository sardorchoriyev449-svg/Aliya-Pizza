import { useEffect, useState } from 'react';
import { Users, Pizza, LayoutGrid, ReceiptText, Wallet, TrendingUp } from 'lucide-react';
import { getStats } from '../../api/orders';

function formatSum(n) {
  return new Intl.NumberFormat('uz-UZ').format(n || 0);
}

export default function AdminStats() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await getStats();
      setLoading(false);
      if (res?.success === false) {
        setError(res.message || 'Statistikani yuklab bo\'lmadi.');
      } else if (res?.data) {
        setStats(res.data);
      } else {
        setError('Statistikani yuklab bo\'lmadi.');
      }
    })();
  }, []);

  if (loading) return <p className="muted">Yuklanmoqda...</p>;
  if (error) return <div className="alert alert-error">{error}</div>;
  if (!stats) return null;

  const cards = [
    { icon: Users, label: 'Foydalanuvchilar', value: stats.userCount },
    { icon: Pizza, label: 'Mahsulotlar', value: stats.productCount },
    { icon: LayoutGrid, label: 'Kategoriyalar', value: stats.categoryCount },
    { icon: ReceiptText, label: 'Buyurtmalar (jami)', value: stats.orderCount },
    { icon: TrendingUp, label: 'Bu oydagi buyurtmalar', value: stats.ordersThisMonth },
    { icon: Wallet, label: 'Bu oy tushum', value: `${formatSum(stats.revenueThisMonth)} so'm` },
  ];

  return (
    <div className="stats-grid">
      {cards.map((c) => (
        <div className="stat-card card" key={c.label}>
          <div className="stat-icon"><c.icon size={20} strokeWidth={2} /></div>
          <div>
            <p className="stat-value">{c.value}</p>
            <p className="stat-label">{c.label}</p>
          </div>
        </div>
      ))}
      <div className="stat-card card stat-card-wide">
        <div className="stat-icon"><Wallet size={20} strokeWidth={2} /></div>
        <div>
          <p className="stat-value">{formatSum(stats.revenueTotal)} so'm</p>
          <p className="stat-label">Umumiy tushum (barcha vaqt)</p>
        </div>
      </div>
    </div>
  );
}
