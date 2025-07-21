import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { supabase } from "../supabaseClient";

const LoginPage = () => {
  const [isSignup, setIsSignup] = useState(true);
  const [signupStep, setSignupStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword, role } = formData;

    if (isSignup) {
      if (signupStep === 1) {
        if (!name || !email) return alert("Please fill all fields.");
        setSignupStep(2);
        return;
      }

      if (password !== confirmPassword) return alert("Passwords do not match");
      if (!role) return alert("Please select a role");

      const { data: signUpData, error: signUpError } =
        await supabase.auth.signUp({ email, password });

      if (signUpError) return alert("Signup failed: " + signUpError.message);

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
        if (insertError)
          console.error("Error inserting user:", insertError.message);
      }

      alert("Signup successful! Please log in.");
      setIsSignup(false);
      setSignupStep(1);
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

      if (loginError) return alert("Login failed: " + loginError.message);

      const user = loginData.user;
      if (user) {
        const { data: userInfo, error: fetchError } = await supabase
          .from("users")
          .select("is_owner")
          .eq("id", user.id)
          .single();

        if (fetchError)
          return console.error(
            "Failed to fetch user role:",
            fetchError.message
          );
        navigate(userInfo.is_owner ? "/welcome" : "/eateries");
      }
    }
  };

  const toggleMode = () => {
    setIsSignup((prev) => !prev);
    setSignupStep(1);
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white px-4">
      <div className="bg-gray-800 p-8 rounded-xl shadow-xl w-full max-w-md min-h-[550px] flex flex-col justify-between border border-gray-700">
        <div>
          <h2 className="text-3xl font-bold text-center mb-6">
            {isSignup
              ? signupStep === 1
                ? "Create Account"
                : "Complete Your Signup"
              : "Welcome Back"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {isSignup && signupStep === 1 && (
              <>
                <div>
                  <label className="block text-sm mb-1">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2"
                    placeholder="Enter full name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2"
                    placeholder="Enter email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gray-600 hover:bg-gray-700 transition rounded-lg py-2 font-semibold"
                >
                  Next
                </button>
              </>
            )}

            {(!isSignup || signupStep === 2) && (
              <>
                {isSignup && (
                  <>
                    <div>
                      <label className="block text-sm mb-1">Password</label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 pr-10"
                          placeholder="Enter password"
                          value={formData.password}
                          onChange={handleChange}
                          required
                        />
                        <span
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-400"
                          onClick={() => setShowPassword((prev) => !prev)}
                        >
                          {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm mb-1">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2"
                        placeholder="Confirm password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm mb-1">Select Role</label>
                      <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2"
                        required
                      >
                        <option value="">-- Choose --</option>
                        <option value="user">User</option>
                        <option value="owner">Mess Owner</option>
                      </select>
                    </div>
                  </>
                )}

                {!isSignup && (
                  <>
                    <div>
                      <label className="block text-sm mb-1">Email</label>
                      <input
                        type="email"
                        name="email"
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2"
                        placeholder="Enter email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm mb-1">Password</label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 pr-10"
                          placeholder="Enter password"
                          value={formData.password}
                          onChange={handleChange}
                          required
                        />
                        <span
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-400"
                          onClick={() => setShowPassword((prev) => !prev)}
                        >
                          {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                      </div>
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  className="w-full bg-gray-600 hover:bg-gray-700 transition rounded-lg py-2 font-semibold"
                >
                  {isSignup ? "Sign Up" : "Log In"}
                </button>
              </>
            )}
          </form>
        </div>

        <div>
          <div className="my-6 text-center text-gray-400">or</div>

          <div className="flex justify-center mb-6">
            <GoogleLogin onSuccess={() => {}} onError={() => {}} />
          </div>

          <div className="text-center text-sm text-gray-400">
            {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              onClick={toggleMode}
              className="text-gray-300 hover:underline"
            >
              {isSignup ? "Log in" : "Sign up now"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
