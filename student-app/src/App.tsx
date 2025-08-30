import "./css/App.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function App() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const validateEmail = (email: string): string | null => {
    if (!email) return "Email je obavezan";
    if (email.length > 50) return "Email ne smije imati više od 50 znakova";
    if (!/^[A-Za-z0-9._%+-]+@skolezd\.hr$/.test(email))
      return "Email mora završavati na @skolezd.hr";
    return null;
  };

  const validatePassword = (pwd: string): string | null => {
    if (!pwd.trim()) return "Lozinka je obavezna";
    return null;
  };

  const handleSignUpRedirect = () => {
    navigate("/signup");
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const localUsernameError = validateEmail(username);
    const localPasswordError = validatePassword(password);

    setUsernameError(localUsernameError);
    setPasswordError(localPasswordError);

    if (localUsernameError || localPasswordError) {
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.BACKEND_URL}/api/login`,
        {
          username,
          password,
        }
      );

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

  const isFormValid = (): boolean => {
    return (
      username.trim() !== "" &&
      password.trim() !== "" &&
      !validateEmail(username) &&
      !validatePassword(password)
    );
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <h2>Login</h2>
        <form onSubmit={handleLoginSubmit}>
          <label htmlFor="username">Email</label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={(e) => {
              const val = e.target.value;
              setUsername(val);
              setUsernameError(validateEmail(val));
            }}
            autoComplete="username"
          />
          {usernameError && <span className="error">{usernameError}</span>}

          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => {
              const val = e.target.value;
              setPassword(val);
              setPasswordError(validatePassword(val));
            }}
            autoComplete="current-password"
          />
          {passwordError && <span className="error">{passwordError}</span>}

          <button className="button" type="submit" disabled={!isFormValid()}>
            Log in
          </button>
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
