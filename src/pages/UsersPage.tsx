import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { type RootState } from "../store";
import { useGetUsersQuery } from "../api/userApi";
import {
  setPage,
  setSort,
  setFilterValue,
} from "../features/user-management/slices/filterSlice";
import UserDataTable from "../components/tables/userDataTable";
import FilterPanel from "../features/user-management/components/FilterPanel";

const UsersPage: React.FC = () => {
  const dispatch = useDispatch();
  const filterParams = useSelector((state: RootState) => state.filters);

  // RTK Query ile veriyi çek. Argümanlar değiştiğinde otomatik yenilenir.
  const { data, isLoading, isFetching, error } = useGetUsersQuery(filterParams);

  // Sıralama değişimi
  const handleSortChange = (newSort: string) => {
    dispatch(setSort(newSort));
  };

  // Sayfa değişimi
  const handlePageChange = (newPage: number) => {
    dispatch(setPage(newPage));
  };

  const handleFilterChange = (key: keyof typeof filterParams, value: any) => {
    if (key !== "page" && key !== "size" && key !== "sort") {
      dispatch(setFilterValue({ key, value }));
    }
  };

  if (isLoading) return <p>Kullanıcı verileri yükleniyor...</p>;

  // Hata yakalama
  if (error) {
    console.error("API Hatası:", error);
    // Gerçek uygulamada burada bir 'Toast' veya 'Banner' gösterilir.
    return <p>Veri çekme hatası! Lütfen daha sonra tekrar deneyin.</p>;
  }

  return (
    <div>
      <h2>Kullanıcı Yönetimi Listesi</h2>
      <FilterPanel filters={filterParams} onFilterChange={handleFilterChange} />

      <UserDataTable
        data={data?.data || []}
        totalCount={data?.totalCount || 0}
        currentPage={filterParams.page}
        pageSize={filterParams.size}
        currentSort={filterParams.sort}
        isLoading={isFetching}
        onPageChange={handlePageChange}
        onSortChange={handleSortChange}
      />
    </div>
  );
};

export default UsersPage;
