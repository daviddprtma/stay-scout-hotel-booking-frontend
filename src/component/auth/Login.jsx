import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const navigate = useNavigate();

  const { state } = useLocation();

  const redirectPath = state?.from?.pathName || "/home";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;
    if (!email || !password) {
      setError("Please enter both email and password.");
      setTimeout(() => {
        setError("");
      }, 5000);
      return;
    }
    try {
      const { status, token, role } = await ApiService.loginUser(formData);
      if (status === 200) {
        ApiService.saveToken(token);
        ApiService.saveRole(role);
        navigate(redirectPath, { replace: true });
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Login failed. Please try again.";
      setError(errorMsg);
      setTimeout(() => {
        setError("");
      }, 5000);
    }
  };

  return (
    <div className="auth-container">
      {error && <p className="error-message">{error}</p>}

      <h2>Login Page</h2>
      <form onSubmit={handleSubmit}>
        {["email", "password"].map((field) => (
          <div className="form-group" key={field}>
            <label htmlFor={field}>
              {field.charAt(0).toLocaleUpperCase() + field.slice(1)}
            </label>
            <input
              type={field}
              name={field}
              value={formData[field]}
              onChange={handleChange}
              required
            />
          </div>
        ))}
        <button type="submit" className="btn">
          Login
        </button>
      </form>

      <p className="register-link">
        Don't have an account? <a href="/register">Register here</a>
      </p>
    </div>
  );
};

export default LoginPage;
