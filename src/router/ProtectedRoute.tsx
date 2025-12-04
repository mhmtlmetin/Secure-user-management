import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router'; 


import {type RootState } from '../store';

//Yetkilendirme Kontrolü
interface ProtectedRouteProps {
  allowedRoles?: Array<'ADMIN' | 'USER'>; 
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  // Redux store'dan kimlik doğrulama durumunu ve rolü al
  const { isAuthenticated, role } = useSelector((state: RootState) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />; 
  }

  if (allowedRoles && role && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />; 
  }

  return <Outlet />; 
};

export default ProtectedRoute;