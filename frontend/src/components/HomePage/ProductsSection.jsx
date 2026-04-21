import { useEffect, useState } from 'react';
import { categoriesService, productsService } from '../../api/services';
import ProductCard from '../ProductCard/ProductCard';
import styles from './HomeSections.module.css';

export default function ProductsSection() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [categoriesData, productsData] = await Promise.all([
          categoriesService.getCategories(),
          productsService.getProducts(),
        ]);

        // Create a map of products by ID
        const productsById = {};
        productsData.forEach((product) => {
          productsById[product.id] = product;
        });

        // Enrich categories with products
        const enrichedCategories = categoriesData.map((category) => ({
          ...category,
          products: category.productIds
            .map((id) => productsById[id])
            .filter(Boolean),
        }));

        setCategories(enrichedCategories);
        setProducts(productsData);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const sugarFreeProducts = categories.find((category) => category.name === 'Sugar Free')?.products || [];
  const proteinRichProducts = categories.find((category) => category.name === 'Protein Rich')?.products || [];
  const recommendedProducts = products.filter((product) => product.recommended === true);

  if (loading) return <div className="text-center py-8">Loading products...</div>;

  return (
    <div className="space-y-12 pb-12">
      {/* Sugar Free */}
      <section>
        <div className="flex items-center gap-4 mb-6">
          <h2 className="text-xl font-headline font-bold">Refined Sugar-free</h2>
          <div className="h-[1px] flex-grow bg-neutral-800"></div>
          <button className="text-primary text-sm font-semibold hover:underline whitespace-nowrap flex-shrink-0">Explore all picks</button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {sugarFreeProducts.map((product) => (
            <ProductCard
              key={product.id || product.name}
              product={product}
            />
          ))}
        </div>
      </section>

      {/* Popular */}
      <section>
        <div className="flex items-center gap-4 mb-6">
          <h2 className="text-xl font-headline font-bold">Popular</h2>
          <div className="h-[1px] flex-grow bg-neutral-800"></div>
          <button className="text-primary text-sm font-semibold hover:underline whitespace-nowrap flex-shrink-0">Explore all picks</button>
        </div>
        <div className={`flex gap-4 overflow-x-auto ${styles.noScrollbar} pb-4`}>
          {recommendedProducts.map((product) => (
            <ProductCard
              key={product.id || product.name}
              className="w-[11.25rem] min-w-[11.25rem] flex-shrink-0"
              product={product}
            />
          ))}
        </div>
      </section>

      {/* Protein Rich */}
      <section>
        <div className="flex items-center gap-4 mb-6">
          <h2 className="text-xl font-headline font-bold">Protein Rich</h2>
          <div className="h-[1px] flex-grow bg-neutral-800"></div>
          <button className="text-primary text-sm font-semibold hover:underline whitespace-nowrap flex-shrink-0">Explore all picks</button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {proteinRichProducts.map((product) => (
            <ProductCard
              key={product.id || product.name}
              product={product}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
