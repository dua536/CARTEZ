import { apiClient } from '../client';

function toUiAddress(apiAddress) {
  const street = apiAddress.STREET_ADDRESS || '';
  const city = apiAddress.CITY || 'Karachi';
  const state = apiAddress.PROVINCE || 'Sindh';
  const zipCode = apiAddress.POSTAL_CODE || '';

  return {
    id: apiAddress.ID, // ✅ FIX
    name: apiAddress.LABEL || 'Address', // ✅ FIX
    type: 'home',
    street,
    city,
    state,
    zipCode,
    phoneNumber: apiAddress.PHONE_NUMBER || '', // ✅ FIX
    instructions: apiAddress.DELIVERY_INSTRUCTIONS || '', // ✅ FIX
    latitude: Number(apiAddress.LATITUDE) || 24.8607, // ✅ FIX
    longitude: Number(apiAddress.LONGITUDE) || 67.0011, // ✅ FIX
    isDefault: Boolean(apiAddress.IS_DEFAULT), // ✅ FIX
    fullAddress: `${street}\n${city}, ${state} ${zipCode}`.trim(),
  };
}

function toApiAddress(payload) {
  return {
    label: payload.name || null,
    street_address: payload.street,
    city: payload.city,
    province: payload.state,
    postal_code: payload.zipCode,
    phone_number: payload.phoneNumber || null,
    delivery_instructions: payload.instructions || null,
    country: 'Pakistan',
    latitude: payload.latitude,
    longitude: payload.longitude,
    is_default: payload.isDefault ? 1 : 0,
  };
}

export const addressesService = {
  list: async () => {
    const response = await apiClient.get('/addresses');
    return (response.data || []).map(toUiAddress);
  },

  create: async (payload) => {
    const response = await apiClient.post('/addresses', toApiAddress(payload));
    return toUiAddress(response.data);
  },

  update: async (id, payload) => {
    const response = await apiClient.put(`/addresses/${id}`, toApiAddress(payload));
    return toUiAddress(response.data);
  },

  remove: async (id) => {
    const response = await apiClient.delete(`/addresses/${id}`);
    return response.data;
  },
};
