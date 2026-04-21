import { apiClient } from '../client';

export const cartService = {
  getCart: async () => {
    const response = await apiClient.get('/cart');
    return response.data;
  },

  addItem: async (payload) => {
    const response = await apiClient.post('/cart', payload);
    return response.data;
  },

  updateItem: async (id, payload) => {
    const response = await apiClient.put(`/cart/${id}`, payload);
    return response.data;
  },

  removeItem: async (id) => {
    const response = await apiClient.delete(`/cart/${id}`);
    return response.data;
  },



  clearCart: async () => {
    const response = await apiClient.post('/cart/clear');
    return response.data;
  },
};


