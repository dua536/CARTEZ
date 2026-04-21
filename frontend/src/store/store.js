import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './CartPage/cartSlice';
import authReducer from './AuthPage/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
  },
});

export default store;

