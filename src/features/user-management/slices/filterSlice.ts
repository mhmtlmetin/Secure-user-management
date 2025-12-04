import { createSlice, type PayloadAction } from '@reduxjs/toolkit';


export interface FilterState {
  page: number;
  size: number;
  sort: string;
  profession: string | string[]; 
  name: string;                  
  tcknPrefix: string;             
}

const initialState: FilterState = {
  page: 0,
  size: 10,
  sort: 'id:asc',
  profession: '',
  name: '',
  tcknPrefix: '',
};


type FilterKeys = Exclude<keyof FilterState, 'page' | 'size' | 'sort'>; 
type SetFilterPayload = {
    [K in FilterKeys]: {
        key: K;
        value: FilterState[K];
    }
}[FilterKeys]; 

// --- Reducer Tanımı ---

const filterSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    // Sayfa değiştirme
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    
    // Sıralama değiştirme
    setSort: (state, action: PayloadAction<string>) => {
      state.sort = action.payload;
      state.page = 0; // Sıralama değişince ilk sayfaya dön
    },
    
    // Karmaşık Filtre Güncelleme
    setFilterValue: (state, action: PayloadAction<SetFilterPayload>) => {
     
      const { key, value } = action.payload;
      
 
      (state as any)[key] = value;
      
      state.page = 0; 
    },
    
    // Tüm filtreleri sıfırla
    resetFilters: () => initialState,
  },
});

export const { setPage, setSort, setFilterValue, resetFilters } = filterSlice.actions;
export default filterSlice.reducer;