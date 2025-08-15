import "./css/App.css";
import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();

  const handleSignUpRedirect = () => {
    navigate("/signup");
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const username = (e.currentTarget as any).username.value;
    const password = (e.currentTarget as any).password.value;

    try {
      const response = await axios.post("http://localhost:8080/api/login", {
        username,
        password,
      });

      localStorage.setItem("token", response.data.token);
      if (response.data.role === 2) {
        navigate("/admin");
      } else {
        navigate("/home");
      }
    } catch (error: any) {
      alert(
        error?.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <h2>Login</h2>
        <form onSubmit={handleLoginSubmit}>
          <label htmlFor="username">Username</label>
          <input type="text" id="username" name="username" required />

          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" required />

          <button type="submit">Log in</button>
        </form>

        <div className="signup-redirect">
          <p>Nemate račun?</p>
          <button onClick={handleSignUpRedirect} className="signup-button">
            Registrirajte se
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
