// HomePage.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";
import SearchBar from "./SearchBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faChevronLeft, 
  faChevronRight, 
  faBookOpen, 
  faClock, 
  faFireAlt, 
  faArrowRight,
  faSearch,
  faLayerGroup,
  faCalendarAlt,
  faChartLine
} from "@fortawesome/free-solid-svg-icons";

const HomePage = () => {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [popularPage, setPopularPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const articlesPerPage = 4;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("http://127.0.0.1:8000/api/articles/");
        const data = await response.json();
        setArticles(data);
        setFilteredArticles(data);
      } catch (error) {
        console.error("Error fetching articles:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);

  const scrollArticles = (direction, section) => {
    const container = document.getElementById(`articles-scroll-${section}`);
    if (!container) return;

    const article = container.querySelector(".article-card");
    if (!article) return;

    const scrollAmount = article.offsetWidth * articlesPerPage + 32; // 32px for gap

    if (direction === "left") {
      container.scrollLeft -= scrollAmount;
      if (section === 'recent') {
        setCurrentPage(prev => Math.max(prev - 1, 0));
      } else {
        setPopularPage(prev => Math.max(prev - 1, 0));
      }
    } else {
      container.scrollLeft += scrollAmount;
      if (section === 'recent') {
        setCurrentPage(prev => Math.min(prev + 1, totalPages - 1));
      } else {
        setPopularPage(prev => Math.min(prev + 1, totalPages - 1));
      }
    }
  };

  const scrollToPage = (page, section) => {
    const container = document.getElementById(`articles-scroll-${section}`);
    if (!container) return;

    const article = container.querySelector(".article-card");
    if (!article) return;

    const scrollAmount = page * (article.offsetWidth * articlesPerPage + 32);
    container.scrollLeft = scrollAmount;
    
    if (section === 'recent') {
      setCurrentPage(page);
    } else {
      setPopularPage(page);
    }
  };

  const categories = [
    "Revues",
    "Ouvrages",
    "Que sais-je ?",
    "Magazines",
    "Rencontres",
    "Dossiers",
    "Listes"
  ];

  // Simulate most viewed articles (would be replaced with actual API call)
  const mostViewedArticles = [...filteredArticles]
    .sort(() => 0.5 - Math.random())
    .map(article => ({
      ...article,
      views: Math.floor(Math.random() * 1000) + 100
    }))
    .sort((a, b) => b.views - a.views);

  // Simulate recent articles (would be replaced with actual API call)
  const recentArticles = [...filteredArticles]
    .sort((a, b) => new Date(b.publication_date) - new Date(a.publication_date));

  return (
    <div className="homepage-container">
      <div className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1>
              Explore the Digital Library of <span className="highlight">Humanities and Social Sciences</span>
            </h1>
            <p className="hero-subtitle">
              Access premium academic resources from leading publishers and institutions worldwide
            </p>
          </div>
          
          <div className="search-container">
            <SearchBar />
          </div>

          <div className="category-section">
            <h3>Browse by Category</h3>
            <div className="filter-buttons">
              {categories.map((category, index) => (
                <button 
                  key={index} 
                  className="filter-btn"
                  onClick={() => console.log(`Filter by ${category}`)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="content-section">
        <div className="section-header">
          <div className="section-title">
            <FontAwesomeIcon icon={faCalendarAlt} className="section-icon" />
            <h2>Recently Added</h2>
          </div>
          <button 
            className="view-all"
            onClick={() => navigate('/articles?sort=recent')}
          >
            View All <FontAwesomeIcon icon={faArrowRight} />
          </button>
        </div>

        {isLoading ? (
          <div className="articles-container">
            <div className="articles-grid">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="article-card">
                  <div className="article-content">
                    <div className="skeleton" style={{height: '24px', width: '80%', marginBottom: '1rem'}}></div>
                    <div className="skeleton" style={{height: '16px', width: '60%', marginBottom: '0.5rem'}}></div>
                    <div className="skeleton" style={{height: '16px', width: '70%'}}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : recentArticles.length > 0 ? (
          <div className="articles-container">
            <button 
              className={`scroll-btn left ${currentPage === 0 ? 'disabled' : ''}`} 
              onClick={() => scrollArticles("left", "recent")}
              disabled={currentPage === 0}
              aria-label="Scroll left"
            >
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>
            <div className="articles-grid" id="articles-scroll-recent">
              {recentArticles.map((article) => (
                <div 
                  key={article.id} 
                  className="article-card"
                  onClick={() => navigate(`/article/${article.id}`)}
                  aria-label={`View ${article.title}`}
                >
                  <div className="article-badge">New</div>
                  <div className="article-icon">
                    <FontAwesomeIcon icon={faBookOpen} />
                  </div>
                  <div className="article-content">
                    <h3>{article.title}</h3>
                    <p className="article-meta">
                      <span className="meta-label">Author:</span> {article.author}
                    </p>
                    <p className="article-meta">
                      <span className="meta-label">Published:</span> {new Date(article.publication_date).toLocaleDateString()}
                    </p>
                    {article.type && <p className="article-type">{article.type}</p>}
                  </div>
                </div>
              ))}
            </div>
            <button 
              className={`scroll-btn right ${currentPage === totalPages - 1 ? 'disabled' : ''}`} 
              onClick={() => scrollArticles("right", "recent")}
              disabled={currentPage === totalPages - 1}
              aria-label="Scroll right"
            >
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          </div>
        ) : (
          <p className="no-results">No articles found.</p>
        )}

        <div className="pagination-dots">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              className={`dot ${currentPage === index ? "active" : ""}`}
              onClick={() => scrollToPage(index, "recent")}
              aria-label={`Go to page ${index + 1}`}
            />
          ))}
        </div>
      </div>
      
      <div className="content-section">
        <div className="section-header">
          <div className="section-title">
            <FontAwesomeIcon icon={faChartLine} className="section-icon" />
            <h2>Most Popular</h2>
          </div>
          <button 
            className="view-all"
            onClick={() => navigate('/articles?sort=popular')}
          >
            View All <FontAwesomeIcon icon={faArrowRight} />
          </button>
        </div>

        {isLoading ? (
          <div className="articles-container">
            <div className="articles-grid">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="article-card">
                  <div className="article-content">
                    <div className="skeleton" style={{height: '24px', width: '80%', marginBottom: '1rem'}}></div>
                    <div className="skeleton" style={{height: '16px', width: '60%', marginBottom: '0.5rem'}}></div>
                    <div className="skeleton" style={{height: '16px', width: '70%'}}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : mostViewedArticles.length > 0 ? (
          <div className="articles-container">
            <button 
              className={`scroll-btn left ${popularPage === 0 ? 'disabled' : ''}`} 
              onClick={() => scrollArticles("left", "popular")}
              disabled={popularPage === 0}
              aria-label="Scroll left"
            >
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>
            <div className="articles-grid" id="articles-scroll-popular">
              {mostViewedArticles.map((article) => (
                <div 
                  key={article.id} 
                  className="article-card"
                  onClick={() => navigate(`/article/${article.id}`)}
                  aria-label={`View ${article.title}`}
                >
                  <div className="article-badge">Trending</div>
                  <div className="article-icon">
                    <FontAwesomeIcon icon={faBookOpen} />
                  </div>
                  <div className="article-content">
                    <h3>{article.title}</h3>
                    <p className="article-meta">
                      <span className="meta-label">Author:</span> {article.author}
                    </p>
                    <p className="article-meta">
                      <span className="meta-label">Views:</span> {article.views.toLocaleString()}
                    </p>
                    {article.type && <p className="article-type">{article.type}</p>}
                  </div>
                </div>
              ))}
            </div>
            <button 
              className={`scroll-btn right ${popularPage === totalPages - 1 ? 'disabled' : ''}`} 
              onClick={() => scrollArticles("right", "popular")}
              disabled={popularPage === totalPages - 1}
              aria-label="Scroll right"
            >
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          </div>
        ) : (
          <p className="no-results">No articles found.</p>
        )}

        <div className="pagination-dots">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              className={`dot ${popularPage === index ? "active" : ""}`}
              onClick={() => scrollToPage(index, "popular")}
              aria-label={`Go to page ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="features-section">
        <div className="feature-card">
          <div className="feature-icon">
            <FontAwesomeIcon icon={faLayerGroup} />
          </div>
          <h3>Extensive Collection</h3>
          <p>Access thousands of academic resources across all disciplines of humanities and social sciences</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">
            <FontAwesomeIcon icon={faSearch} />
          </div>
          <h3>Advanced Search</h3>
          <p>Find exactly what you need with our powerful search and filtering tools</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">
            <FontAwesomeIcon icon={faChartLine} />
          </div>
          <h3>Trending Research</h3>
          <p>Discover the most cited and discussed works in your field of study</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;