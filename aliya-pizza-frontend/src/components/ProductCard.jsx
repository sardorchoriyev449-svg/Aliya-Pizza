import { Pizza } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './ProductCard.css';

function formatSum(n) {
  return new Intl.NumberFormat('uz-UZ').format(n);
}

export default function ProductCard({ product }) {
  const { addItem } = useCart();

  return (
    <article className="product-card">
      <div className="product-image-full">
        {product.image_url ? (
          <img src={product.image_url} alt={product.title} loading="lazy" />
        ) : (
          <Pizza size={32} strokeWidth={1.6} color="var(--tomato-500)" />
        )}
      </div>
      <div className="product-body">
        <p className="product-title">{product.title}</p>
        <p className="product-price">narxi: {formatSum(product.price)}</p>
        <button className="btn btn-primary add-btn" onClick={() => addItem(product)}>
          savatga
        </button>
      </div>
    </article>
  );
}
