
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { cartService } from '../../api/services';

const initialState = {
  items: [],
  loading: false,
  error: null,
  synced: false,
};

// =========================
// FETCH CART
// =========================
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await cartService.getCart();
      return response.items || [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// =========================
// ADD ITEM
// =========================
export const addToCartAsync = createAsyncThunk(
  'cart/addItem',
  async ({ id, quantity }, { rejectWithValue }) => {
    try {
      if (quantity <= 0) {
        await cartService.removeItem(id);
        return { id, quantity: 0 };
     }
      const response = await cartService.addItem({ id, quantity });
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// =========================
// CLEAR CART
// =========================
export const clearCartAsync = createAsyncThunk(
  'cart/clearAsync',
  async (_, { rejectWithValue }) => {
    try {
      await cartService.clearCart();
      return [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      // =========================
      // FETCH CART
      // =========================
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;

        // ✅ FIX: normalize backend data (ID → id)
        state.items = action.payload.map((raw) => ({
          id: raw.id || raw.ID,
          quantity: raw.quantity || raw.QUANTITY || 1,
        }));

        state.synced = true;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // =========================
      // ADD ITEM
      // =========================
      .addCase(addToCartAsync.pending, (state) => {
        state.error = null;
      })
      .addCase(addToCartAsync.fulfilled, (state, action) => {

        // ✅ FIX: normalize response
        const raw = action.payload.data || action.payload;

        const item = {
          id: raw.id || raw.ID,
          quantity: raw.quantity || raw.QUANTITY || 1,
        };

        // REMOVE case
        if (item.quantity <= 0) {
          state.items = state.items.filter((i) => i.id !== item.id);
          return;
        }

        // UPDATE / ADD
        const existingItem = state.items.find((i) => i.id === item.id);

        if (existingItem) {
          existingItem.quantity = item.quantity;
        } else {
          state.items.push(item);
        }
      })
      .addCase(addToCartAsync.rejected, (state, action) => {
        state.error = action.payload;
      })

      // =========================
      // CLEAR CART
      // =========================
      .addCase(clearCartAsync.pending, (state) => {
        state.error = null;
      })
      .addCase(clearCartAsync.fulfilled, (state) => {
        state.items = [];
        state.synced = true;
      })
      .addCase(clearCartAsync.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default cartSlice.reducer;