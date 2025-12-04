import { baseApi } from './baseApi';
import {type FilterState } from '../features/user-management/slices/filterSlice'; 

// --- Tipler (Type Definitions) ---
export interface User {
  id: number;
  name: string;
  surname: string;
  email: string;
  profession: string;
  createdAt: string;
  role: 'ADMIN' | 'USER';
  tcknPrefix: string;
}
// Kullanıcı listesi sorgusunun bileşenlerin beklediği sarmalanmış yanıt tipi
export interface UsersResult {
    data: User[];
    totalCount: number;
}


// --- Yardımcı Fonksiyon: Sorgu Parametrelerini Dönüştürme ---

/**
 * FilterState nesnesini JSON-Server'ın beklediği sorgu parametrelerine dönüştürür.
 */
const transformFilterParams = (params: FilterState): string => {
  const query: string[] = [];
  
  // 1. Sayfalama (Pagination: _page ve _limit)
  query.push(`_page=${params.page + 1}`); 
  query.push(`_limit=${params.size}`);
  
  // 2. Sıralama (Sorting: _sort ve _order)
  const [sortField, sortOrder] = params.sort.split(':');
  if (sortField && sortOrder) {
    query.push(`_sort=${sortField}`);
    query.push(`_order=${sortOrder}`);
  }

  // 3. Metin Filtreleri (Arama: _like)
  if (params.name) {
    query.push(`name=${params.name}`); 
  }
  
  if (params.tcknPrefix) {
    query.push(`tcknPrefix=${params.tcknPrefix}`);
  }

  // 4. Seçim Filtreleri (Tam Eşleşme)
  if (params.profession && typeof params.profession === 'string' && params.profession !== '') {
    query.push(`profession=${params.profession}`);
  }

  return query.join('&');
};


// --- RTK Query Endpoint Tanımı ---

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Query tipi artık UsersResult'tır.
    getUsers: builder.query<UsersResult, FilterState>({
      query: (params) => {
        const queryString = transformFilterParams(params);
        return {
          url: `/users?${queryString}`,
        };
      },
      
      // KRİTİK ÇÖZÜM: JSON-Server'dan gelen düz diziyi sarmalayıp totalCount'u header'dan okur.
      transformResponse: (response: User[], meta): UsersResult => {
        // 'X-Total-Count' başlığını HTTP yanıtından alıyoruz.
        const totalCountHeader = meta?.response?.headers.get('X-Total-Count');
        const totalCount = totalCountHeader ? parseInt(totalCountHeader, 10) : 0;
        
        // UsersPage.tsx'in beklediği formatı döndürüyoruz (data ve totalCount alanları).
        return {
          data: response,
          totalCount: totalCount,
        };
      },
      
      // providesTags hatasının çözümü: result.data üzerinde map yapılır.
      providesTags: (result, error, arg) => {
        // Hata durumunda, veya sonuç/veri boş ise sadece LIST tag'ini döndür.
        if (error || !result || result.data.length === 0) {
            return [{ type: 'Users' as const, id: 'LIST' }];
        }
        
        // Başarılı durumda, LIST tag'i ve her bir kullanıcı için ID bazlı tag'ler oluştur.
        return [
          { type: 'Users' as const, id: 'LIST' },
          ...result.data.map(({ id }) => ({ type: 'Users' as const, id })),
        ];
      },
    }),
  }),
});

export const { useGetUsersQuery } = userApi;