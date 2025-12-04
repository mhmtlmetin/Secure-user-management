import { configureStore } from '@reduxjs/toolkit';
import { baseApi } from '../api/baseApi';
import authReducer from '../features/auth/slices/authSlice';
import filterReducer from '../features/user-management/slices/filterSlice'; 

// [KRİTİK GEREKSİNİM 1: State Yönetimi]
export const store = configureStore({
  reducer: {
    // RTK Query API reducer'ını ekle
    [baseApi.reducerPath]: baseApi.reducer,
    // Yerel state reducer'ları
    auth: authReducer,      // JWT ve Role bilgisi
    filters: filterReducer, // Sayfalama ve filtre parametreleri
  },
  // RTK Query middleware'ini ekleme, önbellekleme ve asenkron işlemleri yönetmek için zorunludur.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;