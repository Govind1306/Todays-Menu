import React, { useState } from "react";
import "./LoginPage.css";
import { GoogleLogin } from "@react-oauth/google";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const LoginPage = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(`${isSignup ? "Sign Up" : "Log In"} with`, formData);
  };

  const toggleMode = () => {
    setIsSignup((prev) => !prev);
    setFormData({ email: "", password: "", remember: false });
  };

  const handleGoogleSuccess = (res) => {
    console.log("Google token:", res);
  };

  const handleGoogleError = () => {
    console.error("Google sign-in failed");
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="form-section">
          <h2>{isSignup ? "Create Account" : "Welcome Back"}</h2>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Email or Phone</label>
              <input
                type="text"
                name="email"
                placeholder="Enter email or phone"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group password-group">
              <label>Password</label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <span onClick={() => setShowPassword((prev) => !prev)}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            <div className="options-row">
              <label>
                <input
                  type="checkbox"
                  name="remember"
                  checked={formData.remember}
                  onChange={handleChange}
                />
                Remember me
              </label>
              {!isSignup && <a href="#">Forgot password?</a>}
            </div>

            <button className="submit-btn" type="submit">
              {isSignup ? "Sign Up" : "Log In"}
            </button>
          </form>

          <div className="divider">or</div>

          <div className="google-login">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
            />
          </div>

          <div className="footer-switch">
            {isSignup ? "Already have an account?" : "Don't have an account?"}
            <button onClick={toggleMode}>
              {isSignup ? "Log in" : "Sign up now"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
// Note: Replace "YOUR_GOOGLE_CLIENT_ID" with your actual Google OAuth client ID.