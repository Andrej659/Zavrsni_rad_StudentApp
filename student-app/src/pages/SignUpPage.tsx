import React from "react";
import SignUpForm from "../components/signUpComponents/SignUpForm";
import { useNavigate } from "react-router-dom";
import "../css/SignUpPage.css";

const SignUpPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="signup-page">
      <div className="signup-box">
        <h2>Sign Up</h2>
        <SignUpForm onSuccess={() => navigate("/")} />
        <div className="login-redirect">
          <p>Already have an account?</p>
          <button onClick={() => navigate("/")}>Log in</button>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
