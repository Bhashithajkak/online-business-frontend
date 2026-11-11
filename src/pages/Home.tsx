import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api, type Product } from '../api';
import ProductCard from '../components/ProductCard';

interface ProductPage {
  items: Product[];
  total: number;
  page: number;
  pageSize: number;
}

export default function Home() {
  const [params, setParams] = useSearchParams();
  const search = params.get('search') ?? '';
  const page = Number(params.get('page')) || 1;
  const [data, setData] = useState<ProductPage | null>(null);
  const [error, setError] = useState('');
  const [query, setQuery] = useState(search);

  useEffect(() => {
    const qs = new URLSearchParams({ search, page: String(page) });
    api<ProductPage>(`/products?${qs}`).then(setData).catch((e) => setError(e.message));
  }, [search, page]);

  const pages = data ? Math.ceil(data.total / data.pageSize) : 1;

  return (
    <>
      <form
        className="search"
        onSubmit={(e) => {
          e.preventDefault();
          setParams(query ? { search: query } : {});
        }}
      >
        <input placeholder="Search products…" value={query} onChange={(e) => setQuery(e.target.value)} />
        <button type="submit">Search</button>
      </form>
      {error && <p className="error">{error}</p>}
      {data && data.items.length === 0 && <p>No products found.</p>}
      <div className="grid">
        {data?.items.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
      {pages > 1 && (
        <div className="pager">
          {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              className={n === page ? 'active' : ''}
              onClick={() => setParams({ ...(search && { search }), page: String(n) })}
            >
              {n}
            </button>
          ))}
        </div>
      )}
    </>
  );
}
