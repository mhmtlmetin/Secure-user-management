import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { useFormik } from "formik"; // Form Yönetimi
import * as Yup from "yup"; // Validasyon Şeması
import { setAuth } from "../features/auth/slices/authSlice";

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Geçerli bir e-posta girin.")
    .required("E-posta zorunludur."),
  password: Yup.string()
    .min(6, "Şifre en az 6 karakter olmalıdır.")
    .required("Şifre zorunludur."),
});

const LoginPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const [login, { isLoading, error }] = useLoginMutation(); // Normalde bu kullanılmalı

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: LoginSchema,
    onSubmit: async (values) => {
      // Normalde: API'ye POST isteği yapılır.
      try {
        // const result = await login(values).unwrap();
        // Geçici olarak başarılı giriş simülasyonu
        const result = {
          token: "fake-jwt-token-12345",
          role: values.email.includes("admin") ? "ADMIN" : "USER", // Rolü email'e göre ayır
        };

        dispatch(
          setAuth({
            token: result.token,
            role: result.role as "ADMIN" | "USER",
          })
        );
        navigate("/users", { replace: true });
      } catch (err) {
        // [GÖREV 4: Hata Yakalama ve Gösterme]
        console.error("Giriş Başarısız:", err);
        alert("Giriş başarısız. Lütfen bilgilerinizi kontrol edin."); // Basit Toast/Banner örneği
      }
    },
  });

  return (
    <div>
      <h2>Kullanıcı Girişi</h2>
      <form onSubmit={formik.handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="E-posta (admin@test.com veya user@test.com)"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.email}
        />
        {formik.touched.email && formik.errors.email ? (
          <div>{formik.errors.email}</div>
        ) : null}

        <input
          type="password"
          name="password"
          placeholder="Şifre"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.password}
        />
        {formik.touched.password && formik.errors.password ? (
          <div>{formik.errors.password}</div>
        ) : null}

        <button type="submit" disabled={formik.isSubmitting}>
          Giriş Yap
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
