import { useEffect, useState } from 'react';
import { categoriesService, productsService } from '../../api/services';
import ProductCard from '../ProductCard/ProductCard';

export default function CategoriesSection() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      } catch (err) {
        setError(err.message);
        console.error('Failed to fetch categories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="text-center py-8">Loading categories...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;

  return (
    <div className="space-y-12 pb-12">
      {categories.map((category) => {
        if (category.products.length === 0) return null;

        return (
          <section key={category.name}>
            <div className="flex items-center gap-4 mb-6">
              <h2 className="text-xl font-headline font-bold">{category.name}</h2>
              <div className="h-[1px] flex-grow bg-neutral-800"></div>
              <button className="text-primary text-sm font-semibold hover:underline whitespace-nowrap flex-shrink-0">
                Explore all picks
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {category.products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
