import { baseApi } from './baseApi';

// Kullanıcı listeleme ve yönetim endpoint'leri
export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: (params) => {
        const queryString = new URLSearchParams(params).toString();
        return `users?${queryString}`;
      },
      // Cache'in hangi etiketler tarafından yönetileceğini belirtir.
      providesTags: (result, error, params) => 
        result 
          ? [
              ...result.data.map(({ id }) => ({ type: 'Users', id })),
              { type: 'Users', id: 'LIST' },
            ]
          : [{ type: 'Users', id: 'LIST' }],
    }),

    // Yeni kullanıcı ekleme/düzenleme endpoint'i
    createUser: builder.mutation({
      query: (newUser) => ({
        url: 'users',
        method: 'POST',
        body: newUser,
      }),
      // Bu işlem başarılı olursa, 'LIST' etiketli tüm 'Users' sorgularını (getUsers) yeniden çeker.
      // Bu, listeyi otomatik olarak günceller ve manuel state güncelleme ihtiyacını ortadan kaldırır.
      invalidatesTags: [{ type: 'Users', id: 'LIST' }], 
    }),
  }),
});
export const { useGetUsersQuery, useCreateUserMutation } = userApi;