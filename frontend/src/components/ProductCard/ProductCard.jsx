import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addToCartAsync } from '../../store/CartPage/cartSlice';
import { selectCartQuantityById } from '../../store/selectors';
import {
  convertEditValueForUnitChange,
  formatQuantity,
  getBaseUnit,
  getInitialEditState,
  getStepAndMax,
  parseEditedQuantity,
} from '../../utils/quantity';

export default function ProductCard({
  product,
  className = '',
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const displayPrice = typeof product.price === 'number' ? product.price.toFixed(2) : product.price;

  const isVariable = product.saleType === 'variable';
  const unit = product.unit || 'items';
  const { step, maxQuantity } = getStepAndMax(isVariable);

  const displayUnitText = isVariable ? `per ${unit}` : `${product.unit_weight || ''} ${unit}`.trim();

  const quantity = useSelector((state) => selectCartQuantityById(state, product.id));

  const setQuantity = (newValOrFunc) => {
    const value = typeof newValOrFunc === 'function' ? newValOrFunc(quantity) : newValOrFunc;
    dispatch(addToCartAsync({ id: product.id, quantity: value }));
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
    if (e.key === 'Enter') {
      commitEdit();
    }
  };

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <div className={`group flex flex-col h-full ${className}`}>
      <div onClick={handleCardClick} className="cursor-pointer flex flex-col flex-grow">
        <div className="aspect-square bg-surface-container rounded-xl mb-3 overflow-hidden relative">
          <img
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            alt={product.name}
            src={product.image || 'https://lh3.googleusercontent.com/aida-public/AB6AXuAZ5o6qHbTB7Hx-EbGgTICkPrfNozyqUB31PaCmZU9ZMGVk24MMoFazdYeWmrKi_ewpNiRS2w1owHtnMithUNas4cigt-7mGXcI_Rycfq91uL4lZ_Xjj6Qfpr2sBzPaL-2uydmJvaj4v_7lLSyE9ee8t6Qjz_GsD6CXjCctfqOKf5SVh41fENAh_nX77_1oSuenvJok0IYHb_YXLfo-YUpQvZmVG-OZ0GFtESKAGJI9GTpLdx-m8Y1iLZ2Dzgu86hOyxJgrt9eFelTe'}
          />
        </div>
        <h4 className="font-bold text-sm mb-1 truncate">{product.name}</h4>
        <p className="text-[10px] text-neutral-500 mb-2 truncate">{product.description}</p>

        {product.tags && product.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {product.tags.map((tag, idx) => (
              <span key={idx} className="bg-surface-container-highest text-on-surface-variant text-[9px] px-1.5 py-0.5 rounded-sm font-medium">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-end mt-auto pt-2 min-h-[2.75rem]">
        {!isEditing && (
          <div className="flex flex-col flex-grow">
            <span className="font-bold text-sm text-primary">${displayPrice}</span>
            <span className="text-[10px] text-neutral-500 font-medium">
              {displayUnitText}
            </span>
          </div>
        )}

        {quantity === 0 ? (
          <button
            onClick={handleAdd}
            className="h-8 w-8 rounded-full border border-neutral-700 flex items-center justify-center hover:bg-primary hover:text-neutral-900 border-primary transition-all shrink-0 ml-auto"
          >
            <span className="material-symbols-outlined text-sm">add</span>
          </button>
        ) : (
          <div
            className={`flex items-center bg-surface-container border border-neutral-700 rounded-full h-8 overflow-hidden transition-all select-none ${isEditing ? 'w-full' : 'shrink-0 ml-auto'}`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleMinus}
              disabled={isEditing}
              className={`flex items-center justify-center w-8 h-full transition-colors ${isEditing ? 'text-neutral-700 pointer-events-none' : 'hover:bg-primary/20 hover:text-primary active:bg-primary/30'}`}
            >
              <span className="material-symbols-outlined text-sm">remove</span>
            </button>

            <div
              className={`flex items-center justify-center min-w-[3.5rem] px-2 h-full bg-surface-container-highest/40 ${isEditing ? 'flex-grow px-0' : ''}`}
              onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget)) commitEdit();
              }}
              tabIndex={-1}
            >
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
                        className="appearance-none bg-none bg-surface-container-high text-xs font-bold text-primary outline-none cursor-pointer py-1 pl-2 pr-5 rounded shadow-sm border border-neutral-600 hover:border-primary/50 transition-colors m-0"
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
                  className={`text-xs font-bold text-center ${isVariable ? 'cursor-text hover:text-primary transition-colors hover:scale-105' : ''}`}
                >
                  {formatQuantity(quantity, isVariable, unit)}
                </span>
              )}
            </div>

            <button
              onClick={handleAdd}
              disabled={isEditing || quantity >= maxQuantity}
              className={`flex items-center justify-center w-8 h-full transition-colors ${isEditing || quantity >= maxQuantity ? 'text-neutral-700 pointer-events-none' : 'hover:bg-primary/20 hover:text-primary active:bg-primary/30'}`}
            >
              <span className="material-symbols-outlined text-sm">add</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
