import { createSlice,type PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  token: string | null;
  role: 'ADMIN' | 'USER' | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  // İlk yüklemede LocalStorage'dan kontrol edilir
  token: localStorage.getItem('jwtToken') || null, 
  role: localStorage.getItem('userRole') as 'ADMIN' | 'USER' || null,
  isAuthenticated: !!localStorage.getItem('jwtToken'),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<{ token: string; role: 'ADMIN' | 'USER' }>) => {
      state.token = action.payload.token;
      state.role = action.payload.role;
      state.isAuthenticated = true;
      localStorage.setItem('jwtToken', action.payload.token); 
      localStorage.setItem('userRole', action.payload.role);
    },
    logout: (state) => {
      state.token = null;
      state.role = null;
      state.isAuthenticated = false;
      localStorage.removeItem('jwtToken');
      localStorage.removeItem('userRole');
      // Ek olarak, RTK Query önbelleğini temizlemek gerekebilir (store.dispatch(baseApi.util.resetApiState()))
    },
  },
});

export const { setAuth, logout } = authSlice.actions;
export default authSlice.reducer;