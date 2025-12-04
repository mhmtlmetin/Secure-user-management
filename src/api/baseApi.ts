import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// JWT'yi local storage'dan alacak bir yardımcı fonksiyon
const getToken = () => localStorage.getItem('jwtToken');
// JWT'yi her isteğe eklemek için temel API tanımı
export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3001/',
    prepareHeaders: (headers, { getState }) => {
      const token = getToken();
      
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  // Etiketler, önbellekleme ve veri senkronizasyonu için kritik
  tagTypes: ['Users', 'Auth'], 
  endpoints: () => ({}),
});