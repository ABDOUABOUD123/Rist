import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./user.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
  
    try {
      const response = await fetch("http://127.0.0.1:8000/api/auth/token/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
  
      if (response.ok) {
        const data = await response.json();
        login(data.auth_token);
        
        // Show toast and wait for it to complete before navigating
        toast.success('Login successful!', {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          onClose: () => navigate("/") // Navigate after toast closes
        });
      } else {
        const errorData = await response.json();
        const errorMessage = errorData.non_field_errors?.[0] || 
                           "Invalid username or password";
        toast.error(errorMessage, {
          position: "top-center",
          autoClose: 4000,
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
    <div className="login-page-wrapper">
      {/* Add ToastContainer */}
      <ToastContainer />
      
      <div className="login-page-container">
        <h1 className="login-page-header">ORIGINALIS</h1>
        <p className="login-page-subheader">Connect to your account and start using the app.</p>
        
        <div className="login-page-social">
          <h3 className="login-page-social-header">Continue With Google Account</h3>
        </div>
        
        <form onSubmit={handleLogin} className="login-page-form">
          <div className="login-page-input-group">
            <label>username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="username"
              className="login-page-input"
              disabled={isLoading}
            />
          </div>
          
          <div className="login-page-input-group">
            <label>password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="password"
              className="login-page-input"
              disabled={isLoading}
            />
          </div>
          
          <button 
            type="submit" 
            className="login-page-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="login-spinner"></span>
                Logging in...
              </>
            ) : "Log in"}
          </button>
        </form>
        
        <div className="login-page-footer-links">
          <p className="login-page-link">Forgot your password?</p>
          <p 
            className="login-page-link"
            onClick={() => !isLoading && navigate("/register")}
          >
            Create a new account! Sign Up
          </p>
        </div>
        
        <div className="login-page-skip-container">
          <p 
            className="login-page-skip-link"
            onClick={() => !isLoading && navigate("/")}
          >
            Skip for now! &gt;
          </p>
        </div>
        
        <p className="login-page-copyright">© 2025 CERIST. All rights reserved.</p>
      </div>
    </div>
  );
};

export default Login;