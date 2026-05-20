import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
  });

  const [message, setMessage] = useState({ type: "", text: "" });

  const navigate = useNavigate();

  const handleInputChange = ({ target: { name, value } }) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // validate form data
  const isFormValid = Object.values(formData).every(
    (value) => value.trim() !== "",
  );

  // handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) {
      setMessage({ type: "error", text: "Please fill in all fields." });
      setTimeout(() => {
        setMessage({});
      }, 5000);
      return;
    }
    try {
      const resp = await ApiService.registerUser(formData);
      if (resp.status === 200) {
        setMessage({
          type: "success",
          text: "Registration successful! Redirecting to login...",
        });
      }
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        "Registration failed. Please try again.";
      setMessage({ type: "error", text: errorMsg });
      setTimeout(() => {
        setMessage({});
      }, 3000);
    }
  };

  return (
    <div className="auth-container">
      {message.text && (
        <p className={`${message.type}-message`}>{message.text}</p>
      )}

      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="First Name">First Name</label>
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="Last Name">Last Name</label>
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="Email">Email</label>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="Phone Number">Phone Number</label>
          <input
            type="number"
            name="phoneNumber"
            placeholder="Phone Number"
            value={formData.phoneNumber}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="Password">Password</label>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
          />
        </div>
        <button type="submit" className="btn">
          Register
        </button>
      </form>

      <p className="register-link">
        Already have an account? <a href="/login">Login here</a>
      </p>
    </div>
  );
};

export default RegisterPage;
