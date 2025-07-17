import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";
import { GoogleLogin } from "@react-oauth/google";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { supabase } from "../supabaseClient";

const LoginPage = () => {
  const [isSignup, setIsSignup] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, password, confirmPassword, role } = formData;

    if (isSignup) {
      if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
      }

      if (!role) {
        alert("Please select a role");
        return;
      }

      const { data: signUpData, error: signUpError } =
        await supabase.auth.signUp({ email, password });

      if (signUpError) {
        alert("Signup failed: " + signUpError.message);
        return;
      }

      const user = signUpData.user;

      if (user) {
        const { error: insertError } = await supabase.from("users").insert([
          {
            id: user.id,
            email,
            full_name: name,
            is_owner: role === "owner",
          },
        ]);

        if (insertError) {
          console.error("Error inserting user:", insertError.message);
        }
      }

      alert("Signup successful! Please log in.");
      setIsSignup(false);
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "",
      });
    } else {
      const { data: loginData, error: loginError } =
        await supabase.auth.signInWithPassword({ email, password });

      if (loginError) {
        alert("Login failed: " + loginError.message);
        return;
      }

      const user = loginData.user;

      if (user) {
        const { data: userInfo, error: fetchError } = await supabase
          .from("users")
          .select("is_owner")
          .eq("id", user.id)
          .single();

        if (fetchError) {
          console.error("Failed to fetch user role:", fetchError.message);
          return;
        }

        // Navigate based on role
        navigate(userInfo.is_owner ? "/welcome" : "/eateries");
      }
    }
  };

  const toggleMode = () => {
    setIsSignup((prev) => !prev);
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "",
    });
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
            {isSignup && (
              <div className="input-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            )}

            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter email"
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

            {isSignup && (
              <>
                <div className="input-group">
                  <label>Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="input-group">
                  <label>Select Role</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    required
                  >
                    <option value="">-- Choose --</option>
                    <option value="user">User</option>
                    <option value="owner">Mess Owner</option>
                  </select>
                </div>
              </>
            )}

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
