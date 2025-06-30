import './App.css';

function App() {
  const handleSignUpRedirect = () => {
    window.location.href = '/signup'; // ili koristimo router kasnije
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <h2>Login</h2>
        <form>
          <label htmlFor="username">Username</label>
          <input type="text" id="username" name="username" />

          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" />

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

