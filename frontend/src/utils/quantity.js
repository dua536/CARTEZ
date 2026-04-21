import {
  FIXED_MAX_QUANTITY,
  FIXED_STEP,
  UNIT_SCALE,
  VARIABLE_MAX_QUANTITY,
  VARIABLE_STEP,
} from '../constants/cart';

export const isLargeUnit = (unit) => unit === 'kg' || unit === 'L';

export const getBaseUnit = (unit = 'items') => {
  if (unit === 'kg') return 'g';
  if (unit === 'L') return 'ml';
  return unit;
};

export const getStepAndMax = (isVariable) => ({
  step: isVariable ? VARIABLE_STEP : FIXED_STEP,
  maxQuantity: isVariable ? VARIABLE_MAX_QUANTITY : FIXED_MAX_QUANTITY,
});

export const formatQuantity = (quantity, isVariable, unit) => {
  if (!isVariable) return `${quantity}`;
  if (quantity < UNIT_SCALE) return `${quantity} ${getBaseUnit(unit)}`;
  return `${quantity / UNIT_SCALE} ${unit}`;
};

export const getInitialEditState = ({ quantity, isVariable, unit }) => {
  if (!isVariable) {
    return { editValue: quantity.toString(), editUnit: unit };
  }

  if (quantity < UNIT_SCALE) {
    return { editValue: quantity.toString(), editUnit: getBaseUnit(unit) };
  }

  return { editValue: (quantity / UNIT_SCALE).toString(), editUnit: unit };
};

export const convertEditValueForUnitChange = (editValue, newUnit) => {
  let currentVal = parseFloat(editValue) || 0;
  if (isLargeUnit(newUnit)) {
    currentVal = currentVal / UNIT_SCALE;
  } else {
    currentVal = currentVal * UNIT_SCALE;
  }
  return currentVal.toString();
};

export const parseEditedQuantity = ({ editValue, editUnit, isVariable, step, maxQuantity }) => {
  let parsed = parseFloat(editValue);
  if (isNaN(parsed) || parsed < 0) parsed = 0;

  let baseValue = parsed;
  if (isVariable && isLargeUnit(editUnit)) {
    baseValue = parsed * UNIT_SCALE;
  }

  let finalQuantity = isVariable
    ? Math.round(baseValue / step) * step
    : Math.round(baseValue);

  if (finalQuantity > maxQuantity) finalQuantity = maxQuantity;
  return finalQuantity;
};

export const formatFixedTotalWeight = ({ unitWeight, quantity, unit }) => {
  const total = unitWeight * quantity;
  if (unit === 'g' && total >= UNIT_SCALE) return `${total / UNIT_SCALE} kg`;
  if (unit === 'ml' && total >= UNIT_SCALE) return `${total / UNIT_SCALE} L`;
  return `${total} ${unit}`;
};
