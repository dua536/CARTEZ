import { apiClient } from '../client';

export const ordersService = {
  listOrders: async () => {
    const response = await apiClient.get('/orders');
    return response.data; // ✅ FIXED
  },

  placeOrder: async (payload) => {
    const response = await apiClient.post('/orders', payload);
    return response.data;
  },
};
