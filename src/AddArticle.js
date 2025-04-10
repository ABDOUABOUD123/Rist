import React, { useState } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import "./addarticle.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const AddArticle = () => {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    abstract: "",
    publication_date: "",
    volume: "",
    keywords: ""
  });

  // Add this component near your root app component or just once
<ToastContainer position="top-center" autoClose={3000} />

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const { token, isLoggedIn, logout } = useAuth();

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isLoggedIn) {
      setSubmitError("You must be logged in to add articles");
      navigate("/login");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const submissionData = {
        title: formData.title,
        author: formData.author,
        abstract: formData.abstract,
        publication_date: formData.publication_date,
        volume: formData.volume ? parseInt(formData.volume) : null,
        keywords: formData.keywords
      };

      const response = await fetch("http://127.0.0.1:8000/api/articles/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${token}` // Use context token
        },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.detail || 
          errorData.message || 
          JSON.stringify(errorData) || 
          "Failed to add article"
        );
      }

      // Reset form on success
      setFormData({
        title: "",
        author: "",
        abstract: "",
        publication_date: "",
        volume: "",
        keywords: ""
      });
           // Show success toast
           toast.success('Article added successfully!', {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
  // Redirect after toast closes
          setTimeout(() => navigate("/articles"), 3000);
    } catch (error) {
      console.error("Error adding article:", error);
      setSubmitError(error.message);

      // Handle specific error cases
      if (error.message.includes("Invalid token") || 
          error.message.includes("Authentication")) {
        logout();
        navigate("/login");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="aa-container">
            {/* ToastContainer must be placed in the return statement */}
            <ToastContainer />
      <div className="aa-card">
        <div className="aa-header">
          <h1>Add New Article</h1>
          <p>Fill in the details below to add a new article to the library</p>
        </div>

        {submitError && (
          <div className="aa-error-message">
            {submitError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="aa-form">
          <div className="aa-form-group">
            <label htmlFor="title">Article Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              placeholder="Enter article title"
              value={formData.title}
              onChange={handleChange}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="aa-form-group">
            <label htmlFor="author">Author *</label>
            <input
              type="text"
              id="author"
              name="author"
              placeholder="Enter author name"
              value={formData.author}
              onChange={handleChange}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="aa-form-group">
            <label htmlFor="abstract">Abstract *</label>
            <textarea
              id="abstract"
              name="abstract"
              placeholder="Enter article abstract"
              value={formData.abstract}
              onChange={handleChange}
              rows="5"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="aa-form-row">
            <div className="aa-form-group">
              <label htmlFor="publication_date">Publication Date *</label>
              <input
                type="date"
                id="publication_date"
                name="publication_date"
                value={formData.publication_date}
                onChange={handleChange}
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="aa-form-group">
              <label htmlFor="volume">Volume</label>
              <select
                id="volume"
                name="volume"
                value={formData.volume}
                onChange={handleChange}
                disabled={isSubmitting}
              >
                <option value="">Select volume</option>
                {Array.from({ length: 20 }, (_, i) => (
                  <option key={i + 1} value={(i + 1).toString()}>
                    Volume {i + 1}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="aa-form-group">
            <label htmlFor="keywords">Keywords</label>
            <input
              type="text"
              id="keywords"
              name="keywords"
              placeholder="e.g., science, research, data (comma separated)"
              value={formData.keywords}
              onChange={handleChange}
              disabled={isSubmitting}
            />
            <small className="aa-hint">Separate multiple keywords with commas</small>
          </div>

          <div className="aa-form-actions">
            <button 
              type="submit" 
              className="aa-submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="aa-spinner"></span>
                  Adding...
                </>
              ) : (
                "Add Article"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddArticle;