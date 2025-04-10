import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EditArticle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState({ title: "", author: "", publication_date: "" });

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/articles/${id}/`)
      .then((response) => response.json())
      .then((data) => setArticle(data))
      .catch((error) => console.error("Error fetching article:", error));
  }, [id]);

  const handleChange = (e) => {
    setArticle({ ...article, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`http://127.0.0.1:8000/api/articles/${id}/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(article),
    });

    if (response.ok) {
      alert("Article updated successfully!");
      navigate("/");
    } else {
      alert("Error updating article.");
    }
  };

  return (
    <div className="container">
      <h2>Edit Article</h2>
      <form onSubmit={handleSubmit}>
        <label>Title:</label>
        <input type="text" name="title" value={article.title} onChange={handleChange} required />
        
        <label>Author:</label>
        <input type="text" name="author" value={article.author} onChange={handleChange} required />

        <label>Publication Date:</label>
        <input type="date" name="publication_date" value={article.publication_date} onChange={handleChange} required />

        <button type="submit">Update Article</button>
      </form>
    </div>
  );
};

export default EditArticle;
