import React from "react";
import { Link } from "react-router";

const NotFoundPage: React.FC = () => {
  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>404</h1>
      <h2>Üzgünüz, Aradığınız Sayfa Bulunamadı.</h2>
      <p>
        Geri dönmek için <Link to="/users">Ana Sayfaya</Link> tıklayınız.
      </p>
      [Image of a person looking lost]
    </div>
  );
};

export default NotFoundPage;
