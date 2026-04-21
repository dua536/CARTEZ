
import { useState, useEffect } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { addToCartAsync } from '../../store/CartPage/cartSlice';
import { fetchCart } from '../../store/CartPage/cartSlice';
import { productsService } from '../../api/services';
import { selectCartItems } from '../../store/selectors';
import { UNIT_SCALE, FREE_SHIPPING_THRESHOLD, STANDARD_SHIPPING, TAX_RATE } from '../../constants/cart';
import {
  convertEditValueForUnitChange,
  formatQuantity,
  getBaseUnit,
  getInitialEditState,
  getStepAndMax,
  parseEditedQuantity,
} from '../../utils/quantity';

function CartItemLine({ item, product }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isVariable = product?.saleType === 'variable';
  const unit = product?.unit || 'items';
  const { step, maxQuantity } = getStepAndMax(isVariable);

  const quantity = item.quantity;

  const setQuantity = async (newValOrFunc) => {
  const value =
    typeof newValOrFunc === 'function'
      ? newValOrFunc(quantity)
      : newValOrFunc;

  await dispatch(addToCartAsync({ id: product.id, quantity: value }));
  dispatch(fetchCart());
};


  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('');
  const [editUnit, setEditUnit] = useState(getBaseUnit(unit));

  const handleAdd = (e) => {
    e.stopPropagation();
    if (isEditing || quantity >= maxQuantity) return;
    setQuantity((q) => Math.min(maxQuantity, q + step));
  };

  const handleMinus = (e) => {
    e.stopPropagation();
    if (isEditing) return;
    setQuantity((q) => Math.max(0, q - step));
  };

  const handleQuantityClick = (e) => {
    e.stopPropagation();
    if (isEditing) return;

    setIsEditing(true);
    const nextEdit = getInitialEditState({ quantity, isVariable, unit });
    setEditUnit(nextEdit.editUnit);
    setEditValue(nextEdit.editValue);
  };

  const handleUnitChange = (e) => {
    const newUnit = e.target.value;
    if (newUnit === editUnit) return;

    setEditUnit(newUnit);
    setEditValue(convertEditValueForUnitChange(editValue, newUnit));
  };

  const commitEdit = () => {
    if (!isEditing) return;

    const finalQuantity = parseEditedQuantity({
      editValue,
      editUnit,
      isVariable,
      step,
      maxQuantity,
    });

    setQuantity(finalQuantity);
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') commitEdit();
  };

  const handleRemove = async (e) => {
    e.stopPropagation();
    await dispatch(addToCartAsync({ id: product.id, quantity: 0 })).unwrap();
    await dispatch(fetchCart());
  };

  const itemTotal = isVariable ? (quantity / UNIT_SCALE) * product.price : quantity * product.price;

  return (
    <div
      onClick={() => navigate(`/product/${product.id}`)}
      className="bg-surface-container-low rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 shadow-[0_24px_48px_rgba(105,246,184,0.04)] hover:bg-surface-bright transition-colors duration-300 group cursor-pointer border border-outline-variant/10"
    >
      <div className="flex items-center gap-4 sm:gap-6 flex-1 min-w-0">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden relative bg-surface flex-shrink-0">
          <img alt={product.name} className="w-full h-full object-cover" src={product.image} />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-headline text-base sm:text-lg font-semibold text-on-surface truncate mb-1">{product.name}</h3>
          <p className="font-body text-on-surface-variant text-xs sm:text-sm truncate">
            ${product.price.toFixed(2)} {isVariable ? `/ ${unit}` : product.unit_weight ? `${product.unit_weight} ${unit}` : ''}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
        <div
          className={`flex items-center bg-surface-container rounded-md p-1 border border-outline-variant/20 transition-all ${isEditing ? 'flex-grow max-w-[12rem]' : ''}`}
          onClick={(e) => e.stopPropagation()}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget)) commitEdit();
          }}
          tabIndex={-1}
        >
          <button
            onClick={handleMinus}
            disabled={isEditing}
            className={`flex items-center justify-center w-8 h-8 transition-colors ${isEditing ? 'text-neutral-700 pointer-events-none' : 'text-on-surface-variant hover:text-primary'}`}
          >
            <span className="material-symbols-outlined text-sm">remove</span>
          </button>

          <div className={`flex items-center justify-center h-8 ${isEditing ? 'flex-grow px-0' : 'w-16'}`}>
            {isEditing ? (
              <div className="flex items-center justify-center space-x-1 outline-none">
                <input
                  type="number"
                  autoFocus
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="bg-transparent text-xs text-center outline-none font-bold text-primary p-0 m-0 [-moz-appearance:_textfield] [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none w-14"
                />
                {isVariable ? (
                  <div className="relative flex items-center h-full">
                    <select
                      value={editUnit}
                      onChange={handleUnitChange}
                      className="appearance-none bg-none bg-surface-container-highest text-xs font-bold text-primary outline-none cursor-pointer py-1 pl-2 pr-5 rounded shadow-sm border border-outline-variant/20 hover:border-primary/50 transition-colors m-0"
                    >
                      <option className="bg-surface-container text-on-surface" value={getBaseUnit(unit)}>{getBaseUnit(unit)}</option>
                      {(unit === 'kg' || unit === 'L') && <option className="bg-surface-container text-on-surface" value={unit}>{unit}</option>}
                    </select>
                    <span className="material-symbols-outlined absolute right-0.5 text-lg text-primary pointer-events-none">arrow_drop_down</span>
                  </div>
                ) : null}
              </div>
            ) : (
              <span
                onClick={handleQuantityClick}
                className={`font-label text-on-surface font-semibold text-center w-full block ${isVariable ? 'cursor-text hover:text-primary transition-colors hover:scale-105 whitespace-nowrap' : 'text-sm'}`}
              >
                {formatQuantity(quantity, isVariable, unit)}
              </span>
            )}
          </div>

          <button
            onClick={handleAdd}
            disabled={isEditing || quantity >= maxQuantity}
            className={`flex items-center justify-center w-8 h-8 transition-colors ${isEditing || quantity >= maxQuantity ? 'text-neutral-700 pointer-events-none' : 'text-on-surface-variant hover:text-primary'}`}
          >
            <span className="material-symbols-outlined text-sm">add</span>
          </button>
        </div>

        <div className="w-20 sm:w-24 text-right flex-shrink-0">
          <span className="font-headline text-lg sm:text-xl font-bold text-on-surface">${itemTotal.toFixed(2)}</span>
        </div>

        <button
          onClick={handleRemove}
          className="text-on-surface-variant hover:text-error transition-colors sm:ml-2 sm:opacity-0 group-hover:opacity-100 flex-shrink-0 p-2"
        >
          <span className="material-symbols-outlined text-xl">delete</span>
        </button>
      </div>
    </div>
  );
}

export default function CartPage() {
  const dispatch = useDispatch(); 
  const cartItems = useSelector(selectCartItems);
  console.log("cartItems:", cartItems);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dispatch(fetchCart());
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const productsData = await productsService.getProducts();
        setProducts(productsData);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Create a map of products by ID
  const productsById = {};
  products.forEach((product) => {
    productsById[product.id] = product;
  });

  // Create cart details with product information
  const cartDetails = cartItems
  .map((item) => ({ item, product: productsById[item.id] }))
  .filter((entry) => entry.product);


  // Calculate totals
  const subtotal = cartDetails.reduce((sum, { item, product }) => {
    const multiplier = product.saleType === 'variable' ? item.quantity / UNIT_SCALE : item.quantity;
    return sum + multiplier * product.price;
  }, 0);

  const shipping = subtotal > FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : STANDARD_SHIPPING;
  const taxes = subtotal * TAX_RATE;
  const total = subtotal + shipping + taxes;

  if (loading) {
    return <div className="text-center py-8">Loading cart...</div>;
  }

  if (cartDetails.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto py-16 px-6 text-center flex flex-col items-center">
         <span className="material-symbols-outlined text-[6rem] text-outline-variant/30 mb-6">shopping_cart</span>
         <h2 className="text-3xl font-headline font-bold text-on-surface mb-2">Your cart is empty.</h2>
         <p className="text-on-surface-variant font-body mb-8 text-lg">Let's find something perfect for you.</p>
         <Link to="/" className="bg-gradient-to-br from-primary to-primary-container text-on-primary-container font-label font-bold py-3 px-8 rounded-md hover:brightness-110 transition-all active:scale-[0.98] shadow-lg">
           Continue Shopping
         </Link>
      </div>
    );
  }

  return (
    <div className="w-full relative min-h-[calc(100dvh-6rem)] mt-8">
      {/* Immersive background from the Figma design */}
      <div className="absolute inset-0 z-[-1] pointer-events-none rounded-xl overflow-hidden mx-4 opacity-40 mix-blend-overlay"
           style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBENjhaA8xTVa7fYjIs9fY2tIduf091-Ve90qbuAAt7fHmIMG3wiQQ0mAeIgWnVLHu77FArzKm57sQPKSYAZXVWL8Q_BhvX5LZnpMYS7oStnP9Gjq8hC10YZmjbsOsCugl7bRQJcrxWUNT5NuGEjpAscVbQaAdt-JKIMDU7XKiR9vvAlMcGv8aN6HQfOwY77TngEVjIg8iTIZaXkcVDwDrV7fI4KGYf5y4zylHsRmip21PRzvjlVwNzO7f2IuPnCYeu7nxCcA5IBufB')", backgroundSize: 'cover', backgroundPosition: 'center', boxShadow: 'inset 0 0 0 2000px rgba(14, 14, 14, 0.85)' }}>
      </div>

      <main className="w-full max-w-5xl mx-auto px-4 sm:px-8 flex flex-col gap-6 lg:gap-8 relative z-10 pb-24">

        {/* Order Summary Moved Above List */}
        <div className="w-full flex-shrink-0 flex flex-col mb-2">
          <div className="bg-[#262626]/80 backdrop-blur-[20px] rounded-xl p-6 sm:p-8 flex flex-col gap-4 sm:gap-6 shadow-[0_24px_48px_rgba(105,246,184,0.04)] border border-outline-variant/10">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-outline-variant/20 pb-4">
               <h2 className="font-headline text-2xl font-bold text-on-surface">Order Summary</h2>
               {subtotal > 0 && <span className="text-on-surface-variant font-medium text-sm mt-2 sm:mt-0">{cartDetails.length} item{cartDetails.length !== 1 ? 's' : ''} awaiting checkout</span>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 font-body text-sm sm:text-base">
              <div className="flex justify-between sm:flex-col sm:justify-start sm:gap-1 text-on-surface-variant border-b sm:border-b-0 sm:border-r border-outline-variant/10 pb-2 sm:pb-0 sm:pr-4">
                <span>Subtotal</span>
                <span className="text-on-surface font-semibold text-lg">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between sm:flex-col sm:justify-start sm:gap-1 text-on-surface-variant border-b sm:border-b-0 sm:border-r border-outline-variant/10 pb-2 sm:pb-0 sm:pr-4">
                <span>Shipping</span>
                <span className="text-primary font-semibold text-lg">{shipping === 0 ? 'Free (Premium)' : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between sm:flex-col sm:justify-start sm:gap-1 text-on-surface-variant pb-2 sm:pb-0">
                <span>Taxes <span className="text-xs opacity-50">(5%)</span></span>
                <span className="text-on-surface font-semibold text-lg">${taxes.toFixed(2)}</span>
              </div>
            </div>

            <div className="pt-2 border-outline-variant/20 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mt-2">
              <div className="flex flex-col">
                <span className="font-headline text-on-surface-variant text-xs uppercase tracking-widest mb-1">Total Limit</span>
                <span className="font-headline text-4xl sm:text-[2.5rem] font-bold text-primary leading-none">${total.toFixed(2)}</span>
              </div>
              <Link to="/checkout" className="bg-gradient-to-br from-primary to-primary-container text-on-primary-container rounded-md font-label font-bold text-lg py-4 px-8 w-full sm:w-auto hover:brightness-110 transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg">
                Checkout Now
                <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Item List Header is removed as per "remove the double header" */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex justify-between items-end mb-2 px-2 border-b border-outline-variant/20 pb-3">
             <h2 className="font-headline text-lg sm:text-xl text-on-surface font-semibold">Your Pre-Order Items</h2>
             <Link to="/" className="font-label text-sm font-medium text-primary hover:text-primary-container flex items-center gap-1 transition-colors">
               <span className="material-symbols-outlined text-sm">add_circle</span> <span className="hidden sm:inline">Add more</span>
             </Link>
          </div>

          <div className="flex flex-col gap-4">
            {cartDetails.map((data) => (
               <CartItemLine key={data.product.id} item={data.item} product={data.product} />
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}