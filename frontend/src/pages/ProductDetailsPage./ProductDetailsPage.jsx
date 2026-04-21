
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { addToCartAsync } from '../../store/CartPage/cartSlice';
import { selectCartQuantityById } from '../../store/selectors';
import { productsService } from '../../api/services';
import {
  convertEditValueForUnitChange,
  formatFixedTotalWeight,
  formatQuantity,
  getBaseUnit,
  getInitialEditState,
  getStepAndMax,
  parseEditedQuantity,
} from '../../utils/quantity';
import { UNIT_SCALE } from '../../constants/cart';
import NotFoundPage from '../404Page/NotFoundPage';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const reduxQuantity = useSelector((state) => selectCartQuantityById(state, id));
  const [localQuantity, setLocalQuantity] = useState(0);

  useEffect(() => {
    setLocalQuantity(reduxQuantity || 0);
    }, [reduxQuantity]);

  const quantity = localQuantity;
  
  const isVariable = product?.saleType === 'variable';
  const unit = product?.unit || 'items';
  const { step, maxQuantity } = getStepAndMax(isVariable);
  const setQuantity = (newValOrFunc) => {
  const value =
    typeof newValOrFunc === 'function'
      ? newValOrFunc(localQuantity)
      : newValOrFunc;

  setLocalQuantity(value); // ✅ UI updates instantly

  dispatch(addToCartAsync({
    id: product.id,
    quantity: value,
  }));
};

  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('');
  const [editUnit, setEditUnit] = useState(getBaseUnit(unit));

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const productData = await productsService.getProductById(id);
        setProduct(productData);
      } catch (error) {
        console.error('Failed to fetch product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return <div className="text-center py-8">Loading product...</div>;
  }

  if (!product) {
    return <NotFoundPage />;
  }

  const handleMinus = () => {
    if (isEditing || quantity === 0) return;
    setQuantity((q) => Math.max(0, q - step));
  };

  const handlePlus = () => {
    if (isEditing || quantity >= maxQuantity) return;
    if (quantity === 0) {
      setQuantity(step);
      return;
    }
    setQuantity((q) => Math.min(maxQuantity, q + step));
  };

  const handleQuantityClick = () => {
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
    if (e.key === 'Enter') {
      commitEdit();
    }
  };

  const calculateTotal = () => {
    if (typeof product.price === 'number') {
      const multiplier = isVariable ? quantity / UNIT_SCALE : quantity;
      return (product.price * multiplier).toFixed(2);
    }
    return '0.00';
  };

  return (
    <div className="relative w-full bg-background flex flex-col font-body rounded-2xl overflow-hidden mx-auto max-w-[1920px] shadow-none">
      
      <div className="absolute inset-0 z-[0] rounded-2xl overflow-hidden">
        <img 
          alt="Dark cinematic gourmet kitchen setting" 
          className="w-full h-full object-cover opacity-20 mix-blend-overlay" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAFqfC_b36rFiBvOCxQcePn7Ua86OjztQvtckjTN-x5Pt9wseGFXFKTxweSwUzSDu_pMFk1YI1KB7o85EsCj4RcRNro3UOXZ_tw6EVleOPNLmSa9-NiZRSQCyL20xtXkA-69UV_ObuIDrVmAcbRjmj_NMQ_Ls1WShWw7k_ameSwKIWKhy1HxGdGnqNzRzhTV2vW_Rnm3WnKwAHjnH_lL5eXN-pAQ46372G2AOC2w4Bn7mBo11eCKDTNKTFX9okIZRgJPacXcWz2Vy-7"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/90 to-background/50"></div>
      </div>

      <button 
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 lg:top-0 lg:left-8 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white transition-all z-50 shadow-lg"
        aria-label="Go back"
      >
        <span className="material-symbols-outlined">arrow_back</span>
      </button>

      <main className="relative z-10 w-full px-6 lg:px-12 flex flex-col justify-center min-h-[calc(100dvh-6rem)] py-8 pb-16 lg:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-8 lg:gap-16 items-center max-w-6xl mx-auto w-full">
          
          <div className="w-full relative group flex justify-center">
            <div className="bg-[#262626]/60 backdrop-blur-[20px] absolute -inset-4 rounded-xl -z-10 opacity-50 hidden md:block"></div>
            
            <div className="aspect-square w-full max-w-[280px] lg:max-w-[360px] rounded-xl overflow-hidden relative shadow-[0_24px_48px_rgba(0,0,0,0.5),0_10px_20px_rgba(105,246,184,0.04)] bg-surface-container-low">
                <img 
                  alt={product.name} 
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700 ease-out" 
                  src={product.image}
                />
            </div>
            </div>

            <div className="flex flex-col justify-center space-y-4 lg:space-y-6">
              
              <div className="space-y-1.5">
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight font-headline text-on-background leading-none">
                    {product.name}
                  </h1>
                </div>
                <p className="text-xl font-body text-primary font-medium flex items-center gap-2">
                  ${product.price.toFixed(2)}
                  {product.unit && isVariable && <span className="text-sm font-normal text-on-surface-variant uppercase">/ {product.unit}</span>}
                </p>
                
                {product.tags && product.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {product.tags.map((tag, idx) => (
                      <span key={idx} className="bg-surface-container-highest text-on-surface-variant text-[10px] px-2 py-0.5 rounded-sm font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="bg-surface-container-low px-4 py-3 rounded flex-1 border border-outline-variant/20 flex flex-col justify-center">
                  <span className="block text-[10px] text-on-surface-variant mb-1 font-label uppercase tracking-wider">Calories</span>
                  <span className="block text-base font-semibold text-on-surface">
                    {product.calories || 'N/A'} <span className="text-xs text-on-surface-variant font-normal">{product.unit && isVariable ? `/ ${product.unit}` : ''}</span>
                  </span>
                  <span className="block text-xs text-primary font-medium mt-1">Total: {product.calories ? (product.calories * (isVariable ? quantity / 1000 : quantity)).toFixed(0) : 0} kcal</span>
                </div>
                
                <div className="bg-surface-container-low px-4 py-3 rounded flex-1 border border-outline-variant/20 flex flex-col justify-center items-start">
                  <span className="block text-[10px] text-on-surface-variant mb-1 font-label uppercase tracking-wider">Quantity / Weight</span>
                  {isVariable ? (
                    <span className="block text-xl font-bold text-on-surface mt-1">{formatQuantity(quantity, isVariable, unit)}</span>
                  ) : (
                    <div className="mt-1">
                      <span className="block text-base font-bold text-on-surface">Quantity: {quantity}</span>
                      <span className="block text-xs text-on-surface-variant font-medium mt-1">
                        Total Weight: {formatFixedTotalWeight({ unitWeight: product.unit_weight, quantity, unit: product.unit })}
                      </span>
                      {product.unit_weight && (
                        <span className="block text-[10px] text-on-surface-variant/70 font-medium mt-0.5">
                          Per unit: {product.unit_weight} {product.unit}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <h3 className="text-base font-semibold font-headline text-on-surface">The Source</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed font-body">
                  {product.description || "Enjoy the finest selection of quality ingredients sourced for your pantry. Handpicked and packed with care."}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                <div 
                  className={`bg-surface-container-high flex items-center rounded border border-outline-variant/20 p-1 w-full sm:w-auto justify-between transition-all ${isEditing ? 'flex-1' : ''}`}
                  onBlur={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget)) commitEdit();
                  }}
                  tabIndex={-1}
                >
                  <button 
                    onClick={handleMinus}
                    disabled={isEditing}
                    className={`w-10 h-10 flex items-center justify-center transition-colors ${isEditing ? 'text-on-surface-variant/50 pointer-events-none' : 'text-on-surface-variant hover:text-primary'}`}
                  >
                    <span className="material-symbols-outlined text-lg">remove</span>
                  </button>
                  
                  <div className="flex-1 flex justify-center items-center px-4">
                    {isEditing ? (
                      <div className="flex items-center justify-center space-x-1 outline-none">
                        <input 
                          type="number" 
                          autoFocus
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onKeyDown={handleKeyDown}
                          className="bg-transparent text-lg text-center outline-none font-bold text-primary p-0 m-0 [-moz-appearance:_textfield] [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none w-20"
                        />
                        {isVariable ? (
                          <div className="relative flex items-center h-full ml-1">
                            <select 
                              value={editUnit} 
                              onChange={handleUnitChange}
                              className="appearance-none bg-none bg-surface-container-highest text-xs font-bold text-primary outline-none cursor-pointer py-1.5 pl-3 pr-7 rounded shadow-sm border border-outline-variant/20 hover:border-primary/50 transition-colors m-0"
                            >
                              <option className="bg-surface-container text-on-surface" value={getBaseUnit(unit)}>{getBaseUnit(unit)}</option>
                              {(unit === 'kg' || unit === 'L') && <option className="bg-surface-container text-on-surface" value={unit}>{unit}</option>}
                            </select>
                            <span className="material-symbols-outlined absolute right-1 mx-0.5 text-lg text-primary pointer-events-none">arrow_drop_down</span>
                          </div>
                        ) : null}
                      </div>
                    ) : (
                      <span 
                        onClick={handleQuantityClick}
                        className={`w-auto min-w-[5rem] text-center font-semibold text-on-surface ${isVariable ? 'cursor-text hover:text-primary transition-colors hover:scale-105' : ''}`}
                      >
                        {formatQuantity(quantity, isVariable, unit)}
                      </span>
                    )}
                  </div>

                  <button 
                    onClick={handlePlus}
                    disabled={isEditing || quantity >= maxQuantity}
                    className={`w-10 h-10 flex items-center justify-center transition-colors ${isEditing || quantity >= maxQuantity ? 'text-on-surface-variant/50 pointer-events-none' : 'text-on-surface-variant hover:text-primary'}`}
                  >
                    <span className="material-symbols-outlined text-lg">add</span>
                  </button>
                </div>
                
                <div
                  className="w-full sm:flex-1 bg-surface-container border border-outline-variant/30 text-on-surface font-semibold py-4 px-8 rounded-md flex items-center justify-center gap-3 shadow-lg"
                >
                  <span className="text-on-surface-variant">Total:</span>
                  <span className="text-xl font-bold text-primary">${calculateTotal()}</span>
                </div>
              </div>
              
            </div>
        </div>
      </main>
    </div>
  );
}