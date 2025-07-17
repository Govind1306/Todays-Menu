// src/pages/WelcomePage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./WelcomePage.css";

const WelcomePage = () => {
  const navigate = useNavigate();

  const handleRegisterClick = () => {
    navigate("/register-eatery");
  };

  return (
    <div className="welcome-container">
      <div className="welcome-card">
        <h1>Welcome, Govind 👋</h1>
        <p>Let’s get your eatery listed so it can go live for users!</p>
        <button onClick={handleRegisterClick} className="primary-btn">
          Register My Eatery
        </button>
      </div>
    </div>
  );
};

export default WelcomePage;
