import React from 'react';
import AppRouter from './router/AppRouter';
import { Box } from '@mui/material'; // Layout için MUI Box

const App: React.FC = () => {
  return (
    // Uygulamanın temel yerleşimi (Layout)
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      
 

      {/* 2. Ana İçerik ve Router Bölümü */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <AppRouter />
      </Box>
      
      {/* 3. Global Hata Mesajları için Placeholder (Örn: Toast konteyneri) */}
      {/* <ToastContainer /> */} 

    </Box>
  );
};

export default App;