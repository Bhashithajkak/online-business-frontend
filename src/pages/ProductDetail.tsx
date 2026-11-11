import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api, money, type Product } from '../api';
import { useCart } from '../context/CartContext';

export default function ProductDetail() {
  const { id } = useParams();
  const { add } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [qty, setQty] = useState(1);
  const [error, setError] = useState('');
  const [added, setAdded] = useState(false);

  useEffect(() => {
    api<Product>(`/products/${id}`).then(setProduct).catch((e) => setError(e.message));
  }, [id]);

  if (error) return <p className="error">{error}</p>;
  if (!product) return <p>Loading…</p>;

  return (
    <div className="detail">
      <img src={product.imageUrl} alt={product.name} />
      <div>
        <h1>{product.name}</h1>
        <p className="price">{money(product.priceCents)}</p>
        <p>{product.description}</p>
        <p className="muted">{product.stock > 0 ? `${product.stock} in stock` : 'Sold out'}</p>
        {product.stock > 0 && (
          <div className="row">
            <input
              type="number"
              min={1}
              max={product.stock}
              value={qty}
              onChange={(e) => setQty(Math.max(1, Math.min(product.stock, Number(e.target.value))))}
            />
            <button
              onClick={() => {
                add(product, qty);
                setAdded(true);
              }}
            >
              Add to cart
            </button>
          </div>
        )}
        {added && (
          <p className="success">
            Added! <Link to="/cart">View cart</Link>
          </p>
        )}
      </div>
    </div>
  );
}
