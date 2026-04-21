import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { productsService } from '../../api/services';
import ProductCard from '../../components/ProductCard/ProductCard';
import { getSearchValidationError, normalizeSearchQuery } from '../../utils/search';

export default function SearchResultsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [allProducts, setAllProducts] = useState([]);
  const searchQuery = useMemo(() => {
    const queryFromUrl = new URLSearchParams(location.search).get('q') || '';
    return normalizeSearchQuery(queryFromUrl);
  }, [location.search]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsData = await productsService.getProducts();
        setAllProducts(productsData);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };

    fetchProducts();
  }, []);

  const searchResults = () => {
    const needle = searchQuery.trim().toLowerCase();
    if (!needle) return [];

    return allProducts.filter((product) => {
      const tags = Array.isArray(product.tags) ? product.tags.join(' ') : '';
      const haystack = `${product.name || ''} ${product.description || ''} ${tags}`.toLowerCase();
      return haystack.includes(needle);
    });
  };

  const products = searchResults();
  const validationError = getSearchValidationError(searchQuery);
  const hasValidQuery = !validationError;
  const hasProducts = products.length > 0;

  return (
    <section className="relative px-6 lg:px-12 2xl:px-24 pb-12">
      <div className="flex items-center gap-3 mb-6 mt-2">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white transition-all z-10 shadow-lg"
          aria-label="Go back"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <button
          onClick={() => navigate('/')}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white transition-all z-10 shadow-lg"
          aria-label="Go home"
        >
          <span className="material-symbols-outlined">home</span>
        </button>
      </div>

      <div className="mb-8">
        <span className="text-primary font-bold tracking-widest text-xs uppercase mb-2 block">Discover</span>
        <h1 className="text-3xl font-headline font-extrabold tracking-tight">
          Search Results{hasValidQuery ? ` for "${searchQuery}"` : ''}
        </h1>
        <p className="text-sm text-on-surface-variant mt-2">
          {hasValidQuery
            ? `Showing ${products.length} curated selection${products.length === 1 ? '' : 's'}`
            : 'Enter a valid search term in the header to find products.'}
        </p>
      </div>

      {!hasValidQuery ? (
        <div className="bg-surface-container rounded-xl border border-neutral-800/60 p-8 text-center max-w-xl">
          <span className="material-symbols-outlined text-5xl text-primary/80 mb-3">manage_search</span>
          <h2 className="text-xl font-semibold mb-2">Search needs a valid term</h2>
          <p className="text-on-surface-variant">Use at least 2 characters and avoid unsupported symbols.</p>
        </div>
      ) : hasProducts ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="bg-surface-container rounded-xl border border-neutral-800/60 p-10 text-center max-w-2xl">
          <span className="material-symbols-outlined text-5xl text-primary/80 mb-4">search_off</span>
          <h2 className="text-2xl font-headline font-bold mb-2">No products found</h2>
          <p className="text-on-surface-variant mb-1">
            We could not find any curated picks matching "{searchQuery}".
          </p>
          <p className="text-on-surface-variant text-sm">Try a broader term, fewer words, or a related ingredient.</p>
        </div>
      )}
    </section>
  );
}
