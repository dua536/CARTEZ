import { createSelector } from '@reduxjs/toolkit';

export const selectCartItems = (state) => state.cart.items;
export const selectAuthToken = (state) => state.auth.token;
export const selectAuthUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthStatus = (state) => state.auth.status;
export const selectAuthError = (state) => state.auth.error;

export const selectCartQuantityById = (state, id) =>
  state.cart.items.find((item) => item.id === id)?.quantity || 0;

export const selectCartCount = createSelector(
  [selectCartItems],
  (items) => items.length
);
