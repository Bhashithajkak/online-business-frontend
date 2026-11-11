import { Link } from 'react-router-dom';
import { money, type Product } from '../api';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  return (
    <div className="card">
      <Link to={`/products/${product.id}`}>
        <img src={product.imageUrl} alt={product.name} />
        <h3>{product.name}</h3>
      </Link>
      <div className="card-footer">
        <span className="price">{money(product.priceCents)}</span>
        <button disabled={product.stock === 0} onClick={() => add(product)}>
          {product.stock === 0 ? 'Sold out' : 'Add to cart'}
        </button>
      </div>
    </div>
  );
}
