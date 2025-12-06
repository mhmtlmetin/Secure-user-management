import { Routes, Route } from 'react-router'; // 'react-router'dan import varsayımı
import LoginPage from '../pages/LoginPage';
import UsersPage from '../pages/UsersPage';
import EditUserPage from '../pages/EditUserPage';
import AddUserPage from '../pages/AddUserPage';
import ProtectedRoute from './ProtectedRoute';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'USER']} />}>
        <Route path="/users" element={<UsersPage />} />
        <Route path="/users/edit/:id" element={<EditUserPage />} />
        <Route path="/users/add" element={<AddUserPage />} />
      </Route>
      <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
        <Route path="/admin/settings" element={<div>Admin Ayarları</div>} />
      </Route>

      <Route path="*" element={<div>404 Sayfa Bulunamadı</div>} />
      <Route path="/unauthorized" element={<div>Yetkisiz Erişim</div>} />
    </Routes>
  );
};

export default AppRouter;