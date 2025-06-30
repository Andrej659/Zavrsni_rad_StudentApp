import React from 'react';
import SignUpForm from '../components/SignUpForm';
import './SignUpPage.css';

const SignUpPage: React.FC = () => {
  return (
    <div className="signup-page">
      <div className="signup-box">
        <h2>Sign Up</h2>
        <SignUpForm />
        <div className="login-redirect">
          <p>Already have an account?</p>
          <a href="/">Log in</a>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
