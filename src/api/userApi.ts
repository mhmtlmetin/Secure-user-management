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

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string; // Sunucudan gelen JWT
  user: User; // Oturum açan kullanıcının bilgileri
}


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
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: 'users', // Varsayımsal bir login endpoint'i
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Auth'], // Opsiyonel: Oturum açıldığında yetkiyle ilgili önbellekleri geçersiz kıl
    }),
    deleteUser: builder.mutation<void, number>({
    query: (id) => ({
        url: `users/${id}`, // DELETE /users/:id
        method: 'DELETE',
    }),
    // Başarılı silme sonrası tüm listeyi yenile
    invalidatesTags: [{ type: 'Users', id: 'LIST' }], 
}),

addUser: builder.mutation<User, Omit<User, 'id' | 'createdAt'>>({
    query: (newUser) => ({
        // json-server yeni kullanıcıyı buraya ekleyecek
        url: 'users',
        method: 'POST',
        body: newUser,
    }),
    // Önbelleği (cache) geçersiz kılma (Invalidation):
    // Yeni kullanıcı eklenince, 'LIST' tag'i geçersiz kılınır ve getUsers query'si otomatik yenilenir.
    invalidatesTags: [{ type: 'Users', id: 'LIST' }], 
}),

updateUser: builder.mutation<User, Partial<User> & Pick<User, 'id'>>({
    query: (updatedUser) => ({
        // PATCH /users/:id adresine isteği gönderir
        url: `users/${updatedUser.id}`, 
        method: 'PATCH',
        body: updatedUser,
    }),
    // Önbelleği (cache) geçersiz kılma (Invalidation):
    // Güncelleme başarılı olunca, hem LIST tag'ini hem de o ID'ye ait tekil kaydı yeniler.
    invalidatesTags: (result, error, { id }) => [
        { type: 'Users', id: 'LIST' },
        { type: 'Users', id }, // Tekil kaydı da yeniler
    ], 
}),
getUser: builder.query<User, number>({ // <Dönüş Tipi: User, Parametre Tipi: number>
        query: (id) => `users/${id}`, // GET /users/:id isteği gönderir
        // Tekil kaydı önbelleğe alır
        providesTags: (result, error, id) => [{ type: 'Users', id }], 
    }),
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

export const { useGetUsersQuery, useLoginMutation, useDeleteUserMutation, useUpdateUserMutation, useGetUserQuery, useAddUserMutation } = userApi;