import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./user.css";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!", {
        position: "top-center",
        autoClose: 3000,
      });
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/auth/users/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      if (response.ok) {
        toast.success("Registration successful! Please log in.", {
          position: "top-center",
          autoClose: 3000,
        });
        setTimeout(() => navigate("/login"), 3000);
      } else {
        const errorData = await response.json();
        const errorMessage = Object.values(errorData).flat().join(' ') || 
                           "Error creating account. Try a different username or email.";
        toast.error(errorMessage, {
          position: "top-center",
          autoClose: 5000,
        });
      }
    } catch (err) {
      toast.error("Network error. Please try again.", {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-page-wrapper">
      {/* Add ToastContainer */}
      <ToastContainer />
      
      <div className="register-page-container">
        <h1 className="register-page-header">ORIGINALIS</h1>
        <p className="register-page-subheader">Let's get you started with a new account.</p>
        
        <form onSubmit={handleRegister} className="register-page-form">
          <div className="register-page-input-group">
            <label>email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="utilisateur"
              className="register-page-input"
              disabled={isLoading}
            />
          </div>
          
          <div className="register-page-input-group">
            <label>username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="username"
              className="register-page-input"
              disabled={isLoading}
            />
          </div>
          
          <div className="register-page-input-group">
            <label>password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="mot de passe"
              className="register-page-input"
              disabled={isLoading}
            />
          </div>
          
          <div className="register-page-input-group">
            <label>confirm password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="mot de passe"
              className="register-page-input"
              disabled={isLoading}
            />
          </div>
          
          <button 
            type="submit" 
            className="register-page-button"
            disabled={isLoading}
          >
            {isLoading ? "Registering..." : "Sign Up"}
          </button>
        </form>
        
        <div className="register-page-footer-links">
          <p 
            className="register-page-link"
            onClick={() => !isLoading && navigate("/login")}
          >
            already have an account? Log in
          </p>
        </div>
        
        <p className="register-page-copyright">© 2025 CERIST. All rights reserved.</p>
      </div>
    </div>
  );
};

export default Register;