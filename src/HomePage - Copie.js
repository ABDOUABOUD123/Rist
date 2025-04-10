import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faCog } from "@fortawesome/free-solid-svg-icons";

const HomePage = () => {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    type: '',
    dateRange: '',
    category: ''
  });
  const articlesPerPage = 4;
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/articles/")
      .then((response) => response.json())
      .then((data) => {
        setArticles(data);
        setFilteredArticles(data);
      })
      .catch((error) => console.error("Error fetching articles:", error));
  }, []);

  const handleSearch = () => {
    if (searchQuery.trim() !== "") {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    let filtered = [...articles];
    let queryParams = [];
  
    // Apply search query first
    if (searchQuery.trim() !== "") {
      filtered = filtered.filter(article => 
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.author.toLowerCase().includes(searchQuery.toLowerCase())
      );
      queryParams.push(`query=${encodeURIComponent(searchQuery)}`);
    }
    
    // Apply type filter
    if (filters.type) {
      filtered = filtered.filter(article => article.type === filters.type);
      queryParams.push(`type=${encodeURIComponent(filters.type)}`);
    }
    
    // Apply date range filter
    if (filters.dateRange) {
      const now = new Date();
      filtered = filtered.filter(article => {
        const articleDate = new Date(article.publication_date);
        switch(filters.dateRange) {
          case 'week': return now - articleDate <= 7 * 24 * 60 * 60 * 1000;
          case 'month': return now - articleDate <= 30 * 24 * 60 * 60 * 1000;
          case 'year': return now - articleDate <= 365 * 24 * 60 * 60 * 1000;
          default: return true;
        }
      });
      queryParams.push(`dateRange=${encodeURIComponent(filters.dateRange)}`);
    }
    
    // Apply category filter
    if (filters.category) {
      filtered = filtered.filter(article => article.categories?.includes(filters.category));
      queryParams.push(`category=${encodeURIComponent(filters.category)}`);
    }
  
    // Navigate to search results with all parameters
    if (queryParams.length > 0) {
      navigate(`/search?${queryParams.join('&')}`);
    } else {
      // If no filters applied, just show all articles
      setFilteredArticles(filtered);
    }
  
    setShowFilters(false);
    setCurrentPage(0);
  };

  const resetFilters = () => {
    setFilters({
      type: '',
      dateRange: '',
      category: ''
    });
    setFilteredArticles(articles);
    setShowFilters(false);
  };

  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);

  const scrollArticles = (direction) => {
    const container = document.getElementById("articles-scroll");
    if (!container) return;

    const article = container.querySelector(".article-card");
    if (!article) return;

    const articleWidth = article.offsetWidth + 15;
    const scrollAmount = articleWidth * articlesPerPage;

    if (direction === "left") {
      container.scrollLeft -= scrollAmount;
      setCurrentPage((prev) => Math.max(prev - 1, 0));
    } else {
      container.scrollLeft += scrollAmount;
      setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
    }
  };

  const scrollToPage = (page) => {
    const container = document.getElementById("articles-scroll");
    if (!container) return;

    const article = container.querySelector(".article-card");
    if (!article) return;

    const articleWidth = article.offsetWidth + 15;
    const scrollAmount = page * (articleWidth * articlesPerPage);

    container.scrollLeft = scrollAmount;
    setCurrentPage(page);
  };

  
  return (
    <div className="homepage-container">
      <div className="hero-section">
        <h1>
          Bibliothèque numérique en{" "}
          <span className="highlight">sciences humaines et sociales</span>
        </h1>
        <div className="search-box">
          <input
            type="text"
            placeholder="Vos mots-clés"
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <FontAwesomeIcon 
            icon={faSearch} 
            className="search-icon" 
            onClick={handleSearch} 
          />
          <FontAwesomeIcon
            icon={faCog}
            className={`filter-icon ${Object.values(filters).some(f => f) ? 'active' : ''}`}
            onClick={() => setShowFilters(!showFilters)}
          />
          {showFilters && (
            <div className="filter-dropdown">
              <h4>Filtrer les résultats</h4>
              
              <div className="filter-group">
                <label>Type:</label>
                <select name="type" value={filters.type} onChange={handleFilterChange}>
                  <option value="">Tous les types</option>
                  <option value="journal">Revues</option>
                  <option value="book">Ouvrages</option>
                  <option value="magazine">Magazines</option>
                </select>
              </div>
              
              <div className="filter-group">
                <label>Période:</label>
                <select name="dateRange" value={filters.dateRange} onChange={handleFilterChange}>
                  <option value="">Toutes périodes</option>
                  <option value="week">Cette semaine</option>
                  <option value="month">Ce mois</option>
                  <option value="year">Cette année</option>
                </select>
              </div>
              
              <div className="filter-group">
                <label>Catégorie:</label>
                <select name="category" value={filters.category} onChange={handleFilterChange}>
                  <option value="">Toutes catégories</option>
                  <option value="science">Science</option>
                  <option value="humanities">Humanités</option>
                  <option value="social">Sciences sociales</option>
                </select>
              </div>
              
              <div className="filter-actions">
                <button className="apply-filters" onClick={applyFilters}>
                  Appliquer
                </button>
                <button className="reset-filters" onClick={resetFilters}>
                  Réinitialiser
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="filter-buttons">
          <button className="filter-btn">Revues</button>
          <button className="filter-btn">Ouvrages</button>
          <button className="filter-btn">Que sais-je ? / Repères</button>
          <button className="filter-btn">Magazines</button>
          <button className="filter-btn">Rencontres</button>
          <button className="filter-btn">Dossiers</button>
          <button className="filter-btn">Listes</button>
        </div>
      </div>

      <div className="articles-section">
        <h2>Ouvrages et numéros récemment ajoutés</h2>

        {filteredArticles.length > 0 ? (
          <div className="articles-container">
            <button className="scroll-btn left" onClick={() => scrollArticles("left")}>
              &lt;
            </button>
            <div className="articles-grid" id="articles-scroll">
              {filteredArticles.map((article) => (
                
         // In the articles.map() section, update the article card div to:
                  <div 
                    key={article.id} 
                    className="article-card"
                    onClick={() => navigate(`/article/${article.id}`)}
                    style={{ cursor: 'pointer' }}
                  >
                    <h3>{article.title}</h3>
                    <p>
                      <strong>Auteur:</strong> {article.author}
                    </p>
                    <p>
                      <strong>Publié:</strong> {article.publication_date}
                    </p>
                    {article.type && <p className="article-type">{article.type}</p>}
                  </div>
              ))}
            </div>
            <button className="scroll-btn right" onClick={() => scrollArticles("right")}>
              &gt;
            </button>
          </div>
        ) : (
          <p className="no-results">Aucun article trouvé.</p>
        )}

        <div className="pagination-dots">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              className={`dot ${currentPage === index ? "active" : ""}`}
              onClick={() => scrollToPage(index)}
            />
          ))}
        </div>
      </div>
      <div className="articles-section">
        <h2>Articles les plus regarder</h2>

        {filteredArticles.length > 0 ? (
          <div className="articles-container">
            <button className="scroll-btn left" onClick={() => scrollArticles("left")}>
              &lt;
            </button>
            <div className="articles-grid" id="articles-scroll">
              {filteredArticles.map((article) => (
                <div key={article.id} className="article-card">
                  <h3>{article.title}</h3>
                  <p>
                    <strong>Auteur:</strong> {article.author}
                  </p>
                  <p>
                    <strong>Publié:</strong> {article.publication_date}
                  </p>
                  {article.type && <p className="article-type">{article.type}</p>}
                </div>
              ))}
            </div>
            <button className="scroll-btn right" onClick={() => scrollArticles("right")}>
              &gt;
            </button>
          </div>
        ) : (
          <p className="no-results">Aucun article trouvé.</p>
        )}

        <div className="pagination-dots">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              className={`dot ${currentPage === index ? "active" : ""}`}
              onClick={() => scrollToPage(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;