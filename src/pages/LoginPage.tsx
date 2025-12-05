import React from 'react';
import { useLoginMutation, type User } from '../api/userApi';
import { useDispatch } from 'react-redux';
import { setAuth } from '../features/auth/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';

// MUI Bileşenleri
import {
  Container,
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';


// --- 1. Yup Validasyon Şeması ---
const loginSchema = yup.object({
  email: yup
    .string()
    .email('Geçerli bir e-posta adresi girin.')
    .required('E-posta alanı zorunludur.'),
  password: yup
    .string()
    .min(6, 'Şifre en az 6 karakter olmalıdır.')
    .required('Şifre alanı zorunludur.'),
});

// --- 2. Bileşen ---
const LoginPage: React.FC = () => {
  const [login, { isLoading, isError, error }] = useLoginMutation();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Formik Hook'unun Tanımlanması
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: loginSchema, // Yup şemasını buraya bağlıyoruz
    onSubmit: async (values) => {
      // Formik validasyonu geçerse bu blok çalışır
      try {
        // json-server sadece POST işlemini kaydedecek, gerçek token vermeyecek.
        // Hata fırlatmadığı sürece işlemi başarılı kabul ediyoruz.
        await login(values).unwrap(); 
        
        // --- KRİTİK MOCK TOKEN UYGULAMASI ---
        // Uygulamanın oturum açmış gibi çalışması için sahte token ve rol kullanıyoruz.
        const MOCK_TOKEN = "mock-jwt-token-sizin-uygulamaniz";
        
        // Rolü varsayılan olarak ADMIN belirliyoruz
        const MOCK_USER_ROLE = "ADMIN"; 
        
        // setAuth reducer'ını Mock verilerle dispatch ediyoruz
        dispatch(setAuth({ 
          token: MOCK_TOKEN, 
          role: MOCK_USER_ROLE as 'ADMIN' | 'USER' // TypeScript için tip dönüşümü
        }));

        // Başarılı girişten sonra kullanıcıları sayfasına yönlendir
        navigate('/users'); 
        
      } catch (err) {
        console.error('Giriş Başarısız:', err);
        // Hata, MUI Alert bileşeni tarafından gösterilir
      }
    },
  });

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: 3,
          boxShadow: 3,
          borderRadius: 2,
          backgroundColor: 'white',
        }}
      >
        <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
          Kullanıcı Yönetim Paneli Girişi
        </Typography>
        
        {/* Formik'in handleSubmit'ını kullanıyoruz */}
        <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 1, width: '100%' }}>
          
          {/* E-posta Alanı */}
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="E-posta Adresi"
            name="email"
            autoComplete="email"
            autoFocus
            variant="outlined"
            size="small"
            
            // Formik Bağlantıları (Value, Change, Error)
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />
          
          {/* Şifre Alanı */}
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Şifre"
            type="password"
            id="password"
            autoComplete="current-password"
            variant="outlined"
            size="small"
            
            // Formik Bağlantıları (Value, Change, Error)
            value={formik.values.password}
            onChange={formik.handleChange}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
          />

          {/* API Hata Mesajı */}
          {isError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              Giriş başarısız oldu. Lütfen bilgilerinizi kontrol edin.
            </Alert>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            // Formik ve RTK Query durumuna göre butonu devre dışı bırak
            disabled={isLoading || !formik.isValid} 
            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
          >
            Giriş Yap
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default LoginPage;