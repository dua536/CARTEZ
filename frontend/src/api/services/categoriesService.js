import { apiClient } from '../client';

export const categoriesService = {
  getCategories: async () => {
    const response = await apiClient.get('/categories');
    return response.data;
  },
};
