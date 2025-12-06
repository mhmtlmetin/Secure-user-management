import React from 'react';
import { useGetUserQuery, useUpdateUserMutation } from '../api/userApi';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Container, TextField, Button, Box, Typography, Alert, Paper, CircularProgress, Stack } from '@mui/material';

// --- Yup Validasyon Şeması ---
const editUserSchema = yup.object({
  name: yup.string().required('Ad zorunludur.'),
  surname: yup.string().required('Soyad zorunludur.'),
  email: yup.string().email('Geçerli bir e-posta girin.').required('E-posta zorunludur.'),
  profession: yup.string().required('Meslek zorunludur.'),
  role: yup.string().oneOf(['ADMIN', 'USER'], 'Geçersiz Rol Seçimi').required('Rol zorunludur.'),
  password: yup.string().min(6, 'Şifre en az 6 karakter olmalıdır.').notRequired().nullable(), 
});

const EditUserPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); 
  const userId = Number(id);
  const navigate = useNavigate();

const { data: userData, isLoading: isQueryLoading, isError: isQueryError } = useGetUserQuery(userId, {
        skip: !userId,
    });

  const [updateUser, { isLoading: isMutationLoading, isError:isMutationError }] = useUpdateUserMutation();

  const formik = useFormik({
    initialValues: {
      name: userData?.name || '',
      surname: userData?.surname || '',
      email: userData?.email || '',
      profession: userData?.profession || '',
      role: userData?.role || 'USER',
      password: '', 
    },
    validationSchema: editUserSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        const updatePayload = {
          id: userId,
          ...values,
          // Şifre boşsa (değiştirilmediyse) gönderme
          ...(values.password ? { password: values.password } : {}) 
        };
        
        await updateUser(updatePayload).unwrap();
        navigate('/users'); 
        
      } catch (err) {
        console.error('Kullanıcı güncelleme başarısız:', err);
      }
    },
  });

  if (isQueryLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;
  if (isQueryError || !userData) return <Container sx={{ mt: 4 }}><Alert severity="error">Kullanıcı verisi yüklenemedi veya bulunamadı.</Alert></Container>;

  return (
    <Container component="main" maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography component="h1" variant="h5" sx={{ mb: 4 }}>
          Kullanıcı Düzenle: {userData.name} {userData.surname}
        </Typography>
        
        {isMutationError && <Alert severity="error" sx={{ mb: 2 }}>Güncelleme sırasında bir hata oluştu.</Alert>}

        <Box component="form" onSubmit={formik.handleSubmit}>
          
          <Stack spacing={2} sx={{ mb: 3 }}>
            
            {/* Ad ve Soyad (name prop'u kaldırıldı) */}
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
            
            {/* E-posta ve Meslek (name prop'u kaldırıldı) */}
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

            {/* Şifre (Özel Yönetim) ve Rol (name prop'u kaldırıldı) */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              {/* Şifre alanında, özel mantık için name prop'u bırakıldı */}
              <TextField fullWidth name="password" label="Şifre (Değiştirmek için doldurun)" size="small" type="password" 
                value={formik.values.password} 
                onChange={formik.handleChange}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
              />
              <TextField fullWidth label="Rol (ADMIN/USER)" size="small" select SelectProps={{ native: true }} 
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
            <Button variant="outlined" onClick={() => navigate('/users')} disabled={isMutationLoading}>İptal</Button>
            <Button 
              type="submit" 
              variant="contained" 
              disabled={isMutationLoading || isQueryLoading}
              startIcon={isMutationLoading ? <CircularProgress size={20} color="inherit" /> : null}
            >
              Güncelle
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default EditUserPage;