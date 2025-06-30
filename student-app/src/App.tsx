import './App.css';

function App() {
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
      </div>
    </div>
  );
}

export default App;

