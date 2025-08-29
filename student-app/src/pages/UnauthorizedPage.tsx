import React from "react";

const UnauthorizedPage: React.FC = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>401 - Unauthorized</h1>
      <p>Nemate dozvolu za pristup ovoj stranici.</p>
      <a href="/">Vrati se na početnu</a>
    </div>
  );
};

export default UnauthorizedPage;
