import { useRef, useState, useEffect } from 'react';
import { productsService } from '../../api/services';
import ProductCard from '../ProductCard/ProductCard';
import styles from './HomeSections.module.css';

export default function RecommendedSection() {
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);
  const [hoverSide, setHoverSide] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const productsData = await productsService.getProducts();
        const recommended = productsData.filter((product) => product.recommended === true);
        setRecommendedProducts(recommended);
      } catch (error) {
        console.error('Failed to fetch recommended products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleMouseMove = (e) => {
    const { left, width } = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - left;
    if (x < width * 0.25) {
      setHoverSide('left');
    } else if (x > width * 0.75) {
      setHoverSide('right');
    } else {
      setHoverSide(null);
    }
  };

  const handleMouseLeave = () => {
    setHoverSide(null);
  };

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -400, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 400, behavior: 'smooth' });
    }
  };

  if (loading) return <div className="text-center py-8">Loading recommended products...</div>;

  return (
    <section className="mb-16 relative">
      <div className="flex justify-between items-end mb-6">
        <div>
          <span className="text-primary font-bold tracking-widest text-xs uppercase mb-1 block">Curated Selection</span>
          <h2 className="text-3xl font-headline font-extrabold tracking-tight">Recommended For You</h2>
        </div>
        <button className="text-primary text-sm font-semibold hover:underline">Explore all picks</button>
      </div>

      <div 
        className="relative"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <button 
          onClick={scrollLeft} 
          className={`absolute left-0 top-[30%] -translate-y-1/2 -ml-4 z-20 flex items-center justify-center w-14 h-24 bg-neutral-950/20 hover:bg-neutral-950/40 backdrop-blur-md border border-neutral-800/50 hover:border-primary/50 rounded-l-2xl transition-all duration-300 shadow-[0_0_20px_rgba(0,0,0,0.3)] text-neutral-300 hover:text-primary ${
            hoverSide === 'left' ? 'opacity-100 pointer-events-auto translate-x-2' : 'opacity-0 pointer-events-none translate-x-0'
          }`}
          aria-label="Scroll Left"
        >
          <span className="material-symbols-outlined text-4xl">chevron_left</span>
        </button>

        <button 
          onClick={scrollRight} 
          className={`absolute right-0 top-[30%] -translate-y-1/2 -mr-4 z-20 flex items-center justify-center w-14 h-24 bg-neutral-950/20 hover:bg-neutral-950/40 backdrop-blur-md border border-neutral-800/50 hover:border-primary/50 rounded-r-2xl transition-all duration-300 shadow-[0_0_20px_rgba(0,0,0,0.3)] text-neutral-300 hover:text-primary ${
            hoverSide === 'right' ? 'opacity-100 pointer-events-auto -translate-x-2' : 'opacity-0 pointer-events-none translate-x-0'
          }`}
          aria-label="Scroll Right"
        >
          <span className="material-symbols-outlined text-4xl">chevron_right</span>
        </button>

        <div 
          ref={scrollRef}
          className={`flex gap-4 overflow-x-auto pb-6 -mx-4 px-4 ${styles.noScrollbar} scroll-smooth`}
        >
          {recommendedProducts.slice(0, 20).map((product) => (
            <ProductCard 
              key={product.id || product.name} 
              className="w-[11.25rem] min-w-[11.25rem] flex-shrink-0" 
              product={product} 
            />
          ))}
        </div>
      </div>
    </section>
  );
}
