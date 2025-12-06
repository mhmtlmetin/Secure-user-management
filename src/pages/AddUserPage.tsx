import React from 'react';
import { useAddUserMutation } from '../api/userApi';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Container, TextField, Button, Box, Typography, Alert, Paper, CircularProgress, Stack } from '@mui/material';

// --- Yup Validasyon Şeması ---
const userSchema = yup.object({
  name: yup.string().required('Ad zorunludur.'),
  surname: yup.string().required('Soyad zorunludur.'),
  email: yup.string().email('Geçerli bir e-posta girin.').required('E-posta zorunludur.'),
  profession: yup.string().required('Meslek zorunludur.'),
  password: yup.string().min(6, 'Şifre en az 6 karakter olmalıdır.').required('Şifre zorunludur.'),
  role: yup.string().oneOf(['ADMIN', 'USER'], 'Geçersiz Rol Seçimi').required('Rol zorunludur.'),
});

const AddUserPage: React.FC = () => {
  const [addUser, { isLoading, isError, isSuccess }] = useAddUserMutation();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      name: '',
      surname: '',
      email: '',
      profession: '',
      password: '',
      role: 'USER', // Varsayılan rol
    },
    validationSchema: userSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const newUser = {
          ...values,
          // json-server'ın oluşturmadığı, gerekli diğer alanlar varsa eklenir
          tcknPrefix: Math.floor(Math.random() * 999).toString(), // Rastgele prefix
          // createdAt alanı json-server tarafından otomatik eklenmeli
        };
        
        await addUser(newUser).unwrap();
        
        // Başarılı olursa formu sıfırla ve kullanıcı listesine yönlendir
        resetForm();
        navigate('/users'); 
        
      } catch (err) {
        // Hata yakalama
        console.error('Kullanıcı ekleme başarısız:', err);
      }
    },
  });

  return (
    <Container component="main" maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography component="h1" variant="h5" sx={{ mb: 4 }}>
          Yeni Kullanıcı Ekle
        </Typography>
        
        {isSuccess && <Alert severity="success" sx={{ mb: 2 }}>Kullanıcı başarıyla eklendi!</Alert>}
        {isError && <Alert severity="error" sx={{ mb: 2 }}>Kullanıcı eklenirken bir hata oluştu.</Alert>}

        <Box component="form" onSubmit={formik.handleSubmit}>
          
          {/* Stack ile Form Alanları: 2 birim boşluk, mb: 3 Form ile Butonlar arasında boşluk */}
          <Stack spacing={2} sx={{ mb: 3 }}> 
            
            {/* Ad ve Soyad (Yatay Stack: sm ekran ve üzeri için yatay, küçük ekranlar için dikey) */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField fullWidth label="Ad" size="small"
                {...formik.getFieldProps('name')}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
              />
              <TextField fullWidth label="Soyad" size="small"
                {...formik.getFieldProps('surname')}
                error={formik.touched.surname && Boolean(formik.errors.surname)}
                helperText={formik.touched.surname && formik.errors.surname}
              />
            </Stack>
            
            {/* E-posta ve Meslek (Yatay Stack) */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField fullWidth label="E-posta" size="small" type="email"
                {...formik.getFieldProps('email')}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
              <TextField fullWidth label="Meslek" size="small"
                {...formik.getFieldProps('profession')}
                error={formik.touched.profession && Boolean(formik.errors.profession)}
                helperText={formik.touched.profession && formik.errors.profession}
              />
            </Stack>

            {/* Şifre ve Rol (Yatay Stack) */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField fullWidth label="Şifre" size="small" type="password"
                {...formik.getFieldProps('password')}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
              />
              <TextField fullWidth label="Rol (ADMIN/USER)" size="small"
                select SelectProps={{ native: true }}
                {...formik.getFieldProps('role')}
                error={formik.touched.role && Boolean(formik.errors.role)}
                helperText={formik.touched.role && formik.errors.role}
              >
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
              </TextField>
            </Stack>

          </Stack>

          {/* Butonlar */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button 
              variant="outlined" 
              onClick={() => navigate('/users')}
              disabled={isLoading}
            >
              İptal
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              disabled={isLoading}
              startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
            >
              Kullanıcı Ekle
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default AddUserPage;