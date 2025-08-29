import React from "react";

const NotFoundPage: React.FC = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>404 - Stranica nije pronađena</h1>
      <p>Ups! Stranica koju tražite ne postoji.</p>
      <a href="/">Vrati se na početnu</a>
    </div>
  );
};

export default NotFoundPage;
