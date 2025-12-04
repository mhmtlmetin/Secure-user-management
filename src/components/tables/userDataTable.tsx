import React from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, TableSortLabel, TablePagination, CircularProgress, Box, Button
} from '@mui/material';

interface User {
  id: number;
  name: string;
  surname: string;
  email: string;
  profession: string;
  createdAt: string;
  role: 'ADMIN' | 'USER';
}


interface UserDataTableProps {
  data: User[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  currentSort: string; 
  isLoading: boolean;
  onPageChange: (newPage: number) => void;
  onSortChange: (newSort: string) => void;
}


const headCells = [
  { id: 'name', label: 'Ad' },
  { id: 'surname', label: 'Soyad' },
  { id: 'email', label: 'E-posta' },
  { id: 'profession', label: 'Meslek' },
  { id: 'createdAt', label: 'Kayıt Tarihi' },
];


const UserDataTable: React.FC<UserDataTableProps> = ({
  data,
  totalCount,
  currentPage,
  pageSize,
  currentSort,
  isLoading,
  onPageChange,
  onSortChange,
}) => {
  // Mevcut sıralama yönünü ('asc' veya 'desc') ve alanını ('name', 'createdAt' vb.) çıkarır
  const [sortField, sortDirection] = currentSort.split(':');

  const handleSortRequest = (property: string) => {
    const isAsc = sortField === property && sortDirection === 'asc';
    const newDirection = isAsc ? 'desc' : 'asc';
    onSortChange(`${property}:${newDirection}`); 
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    onPageChange(newPage); 
  };
  
  // [KRİTİK GEREKSİNİM: Sayfalama Desteği]
  // Bu, pageSize'ı değiştirmeyi sağlar, ancak şimdilik sadece sabit pageSize kullanıyoruz.
  // const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   // dispatch(setSize(parseInt(event.target.value, 10)));
  //   // dispatch(setPage(0));
  // };

  return (
    <Paper>
      <TableContainer>
        <Table stickyHeader aria-label="Kullanıcı Veri Tablosu">
          <TableHead>
            <TableRow>
              {headCells.map((headCell) => (
                <TableCell
                  key={headCell.id}
                  sortDirection={sortField === headCell.id ? (sortDirection as 'asc' | 'desc') : false}
                >
                  {/* [GÖREV 3: Sıralama Desteği] */}
                  <TableSortLabel
                    active={sortField === headCell.id}
                    direction={sortField === headCell.id ? (sortDirection as 'asc' | 'desc') : 'asc'}
                    onClick={() => handleSortRequest(headCell.id)}
                  >
                    {headCell.label}
                  </TableSortLabel>
                </TableCell>
              ))}
              <TableCell>Eylemler</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={headCells.length + 1} align="center">
                  <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                    <CircularProgress />
                    <span style={{ marginLeft: '10px' }}>Veriler yükleniyor...</span>
                  </Box>
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={headCells.length + 1} align="center">
                  Filtreleme kriterlerinize uygun sonuç bulunamadı.
                </TableCell>
              </TableRow>
            ) : (
              data.map((user) => (
                // RTK Query'nin önbelleklemesi
                // ve sadece gerekli verinin çekilmesi ile re-render'lar minimuma iner.
                <TableRow key={user.id} hover>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.surname}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.profession}</TableCell>
                  <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button size="small">Detay</Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      {/* [GÖREV 3: Sayfalama Yönetimi] */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={totalCount} 
        rowsPerPage={pageSize}
        page={currentPage}
        onPageChange={handleChangePage}
        // onRowsPerPageChange={handleChangeRowsPerPage} // Eğer pageSize değişimi desteklenecekse
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} / ${count !== -1 ? count : `+${to}`}`
        }
      />
    </Paper>
  );
};

export default UserDataTable;