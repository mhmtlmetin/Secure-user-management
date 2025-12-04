import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { type RootState } from '../../../store';
import { useGetUsersQuery } from '../../../api/userApi';
import { setPage, setSort, setFilterValue } from '../slices/filterSlice';
import UserDataTable from '../../../components/tables/userDataTable';
import FilterPanel from '../components/FilterPanel'; 

const UsersPage: React.FC = () => {
  const dispatch = useDispatch();
  const filterParams = useSelector((state: RootState) => state.filters);

  
  const { data, isLoading, isFetching, error } = useGetUsersQuery(filterParams);

  // 3. Kullanıcı Arayüzü (UI) aksiyonları
  const handleSortChange = (newSort: string) => {
    dispatch(setSort(newSort));
  };

  // Metin filtreleri (Ad/Soyad, TCKN Önek) için Debounce kullanın
  // useDebounce hook'u ile 500ms bekleme eklenmelidir.
  const handleNameFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // const debouncedValue = useDebounce(e.target.value, 500); 
    // dispatch(setFilterValue({ key: 'name', value: debouncedValue }));
  };

  if (isLoading) return <p>Yükleniyor...</p>;
  if (error) return <p>Hata: API'den veri alınamadı.</p>; 
  
  return (
    <div>
      <h2>Kullanıcı Yönetimi Arayüzü</h2>
      <FilterPanel 
        filters={filterParams} 
        onFilterChange={(key, value) => dispatch(setFilterValue({ key, value }))} 
      />
      <UserDataTable 
        data={data?.data || []}
        totalCount={data?.totalCount || 0}
        currentPage={filterParams.page}
        pageSize={filterParams.size}
        currentSort={filterParams.sort}
        isLoading={isFetching} // isFetching, yeni veri çekilirken loading durumunu gösterir
        onPageChange={(newPage) => dispatch(setPage(newPage))}
        onSortChange={handleSortChange}
      />
    </div>
  );
};

export default UsersPage;