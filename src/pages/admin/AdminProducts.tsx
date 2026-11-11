import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, money, type Product } from '../../api';

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [error, setError] = useState('');

  const load = () => api<Product[]>('/admin/products').then(setProducts).catch((e) => setError(e.message));
  useEffect(() => {
    load();
  }, []);

  async function deactivate(p: Product) {
    if (!confirm(`Hide "${p.name}" from the store?`)) return;
    try {
      await api(`/admin/products/${p.id}`, { method: 'DELETE' });
      load();
    } catch (e) {
      setError((e as Error).message);
    }
  }

  return (
    <>
      <div className="summary">
        <h1>Products</h1>
        <Link className="button" to="/admin/products/new">+ New product</Link>
      </div>
      {error && <p className="error">{error}</p>}
      {!products ? (
        <p>Loading…</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className={p.active ? '' : 'inactive'}>
                <td>{p.id}</td>
                <td>{p.name}</td>
                <td>{money(p.priceCents)}</td>
                <td>{p.stock}</td>
                <td>{p.active ? 'Active' : 'Hidden'}</td>
                <td className="actions">
                  <Link to={`/admin/products/${p.id}`}>Edit</Link>
                  {p.active && (
                    <button className="link-btn" onClick={() => deactivate(p)}>Hide</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
