import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api, type Product } from '../../api';

const empty = { name: '', description: '', price: '', imageUrl: '', stock: '0', active: true };

export default function ProductForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState(empty);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isEdit) return;
    // Admin list includes hidden products, so edit works for those too.
    api<Product[]>('/admin/products')
      .then((all) => {
        const p = all.find((x) => x.id === Number(id));
        if (!p) throw new Error('Product not found');
        setForm({
          name: p.name,
          description: p.description,
          price: (p.priceCents / 100).toFixed(2),
          imageUrl: p.imageUrl,
          stock: String(p.stock),
          active: p.active,
        });
      })
      .catch((e) => setError(e.message));
  }, [id, isEdit]);

  const set = (key: keyof typeof empty) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [key]: e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const body = {
      name: form.name,
      description: form.description,
      priceCents: Math.round(Number(form.price) * 100),
      imageUrl: form.imageUrl,
      stock: Number(form.stock),
      active: form.active,
    };
    try {
      await api(isEdit ? `/admin/products/${id}` : '/admin/products', {
        method: isEdit ? 'PUT' : 'POST',
        body,
      });
      navigate('/admin/products');
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return (
    <form className="form" onSubmit={submit}>
      <h1>{isEdit ? 'Edit product' : 'New product'}</h1>
      <label>
        Name
        <input required value={form.name} onChange={set('name')} />
      </label>
      <label>
        Description
        <textarea value={form.description} onChange={set('description')} />
      </label>
      <label>
        Price (USD)
        <input type="number" required min="0" step="0.01" value={form.price} onChange={set('price')} />
      </label>
      <label>
        Stock
        <input type="number" required min="0" step="1" value={form.stock} onChange={set('stock')} />
      </label>
      <label>
        Image URL
        <input type="url" value={form.imageUrl} onChange={set('imageUrl')} />
      </label>
      <label className="checkbox">
        <input type="checkbox" checked={form.active} onChange={set('active')} /> Visible in store
      </label>
      {error && <p className="error">{error}</p>}
      <button type="submit">Save</button>
    </form>
  );
}
