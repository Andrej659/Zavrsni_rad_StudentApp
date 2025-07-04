import './css/App.css';
import { useNavigate } from 'react-router-dom';

function App() {
  const navigate = useNavigate();

  const handleSignUpRedirect = () => {
    navigate('/signup');
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/home'); // nakon logina
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