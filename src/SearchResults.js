import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faSearch, 
  faArrowLeft, 
  faBookOpen, 
  faUser, 
  faCalendarAlt,
  faTimes,
  faFilter,
  faChevronDown
} from "@fortawesome/free-solid-svg-icons";
import "./searchresults.css";

const SearchResults = () => {
  const [articles, setArticles] = useState([]);
  const [allArticles, setAllArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState({
    author: '',
    dateRange: '',
    volume: ''
  });
  const [pendingFilters, setPendingFilters] = useState({
    author: '',
    dateRange: '',
    volume: ''
  });
  const [authorSearchQuery, setAuthorSearchQuery] = useState('');
  const [suggestedAuthors, setSuggestedAuthors] = useState([]);
  const [showAuthorSuggestions, setShowAuthorSuggestions] = useState(false);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  
  // Get initial filters from URL
  const searchQuery = searchParams.get("query") || "";
  const initialAuthor = searchParams.get("author") || "";
  const initialDateRange = searchParams.get("dateRange") || "";
  const initialVolume = searchParams.get("volume") || "";

  useEffect(() => {
    const fetchArticles = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch("http://127.0.0.1:8000/api/articles/");
        if (!response.ok) {
          throw new Error("Failed to fetch articles");
        }
        const data = await response.json();
        setAllArticles(data);
        applyFilters(data, {
          query: searchQuery,
          author: initialAuthor,
          dateRange: initialDateRange,
          volume: initialVolume
        });
      } catch (err) {
        console.error("Error fetching articles:", err);
        setError("Failed to load articles. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, []);

  useEffect(() => {
    setLocalFilters({
      author: initialAuthor,
      dateRange: initialDateRange,
      volume: initialVolume
    });
    setPendingFilters({
      author: initialAuthor,
      dateRange: initialDateRange,
      volume: initialVolume
    });
    setAuthorSearchQuery(initialAuthor);
  }, [initialAuthor, initialDateRange, initialVolume]);

  // Generate author suggestions based on input
  useEffect(() => {
    if (authorSearchQuery.trim() && allArticles.length > 0) {
      const uniqueAuthors = [...new Set(allArticles.map(article => article.author))];
      const filtered = uniqueAuthors.filter(author => 
        author.toLowerCase().includes(authorSearchQuery.toLowerCase())
      );
      setSuggestedAuthors(filtered.slice(0, 5));
    } else {
      setSuggestedAuthors([]);
    }
  }, [authorSearchQuery, allArticles]);

  const checkDateRange = (publicationDate, range) => {
    const now = new Date();
    const articleDate = new Date(publicationDate);
    const diff = now - articleDate;
    
    switch(range) {
      case 'week': return diff <= 7 * 24 * 60 * 60 * 1000;
      case 'month': return diff <= 30 * 24 * 60 * 60 * 1000;
      case 'year': return diff <= 365 * 24 * 60 * 60 * 1000;
      default: return true;
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  const getFilterLabel = (type, value) => {
    const labels = {
      dateRange: {
        week: "Cette semaine",
        month: "Ce mois",
        year: "Cette année"
      },
      volume: Object.fromEntries(
        Array.from({ length: 20 }, (_, i) => [i + 1, `VOLUME ${i + 1}`])
      )
    };
    return labels[type]?.[value] || value;
  };

  const applyFilters = (data, filters) => {
    const filtered = data.filter(article => {
      // Search query filter
      const matchesSearch = filters.query 
        ? (
            article.title.toLowerCase().includes(filters.query.toLowerCase()) ||
            article.author.toLowerCase().includes(filters.query.toLowerCase()) ||
            (article.keywords && article.keywords.toLowerCase().includes(filters.query.toLowerCase())) ||
            (article.abstract && article.abstract.toLowerCase().includes(filters.query.toLowerCase()))
        ) 
        : true;
      
      // Author filter
      const matchesAuthor = filters.author 
        ? article.author.toLowerCase().includes(filters.author.toLowerCase())
        : true;
      
      // Date range filter
      const matchesDateRange = filters.dateRange 
        ? checkDateRange(article.publication_date, filters.dateRange)
        : true;
      
      // Volume filter - ensure proper comparison
      const matchesVolume = filters.volume 
        ? article.volume != null && article.volume.toString() === filters.volume.toString()
        : true;
      
      return matchesSearch && matchesAuthor && matchesDateRange && matchesVolume;
    });
    
    setArticles(filtered);
  };

  const handleAuthorSearchChange = (e) => {
    const value = e.target.value;
    setAuthorSearchQuery(value);
    setPendingFilters(prev => ({ ...prev, author: value }));
    setShowAuthorSuggestions(true);
  };

  const selectAuthor = (author) => {
    setAuthorSearchQuery(author);
    setPendingFilters(prev => ({ ...prev, author }));
    setShowAuthorSuggestions(false);
  };

  const submitFilters = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("query", searchQuery);
    if (pendingFilters.author) params.set("author", pendingFilters.author);
    if (pendingFilters.dateRange) params.set("dateRange", pendingFilters.dateRange);
    if (pendingFilters.volume) params.set("volume", pendingFilters.volume.toString());
    
    navigate(`/search?${params.toString()}`);
    
    applyFilters(allArticles, {
      query: searchQuery,
      author: pendingFilters.author,
      dateRange: pendingFilters.dateRange,
      volume: pendingFilters.volume
    });
    
    setLocalFilters(pendingFilters);
    setShowFilters(false);
    setShowAuthorSuggestions(false);
  };

  const resetFilters = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("query", searchQuery);
    navigate(`/search?${params.toString()}`);
    
    const resetFilterState = {
      author: '',
      dateRange: '',
      volume: ''
    };
    setLocalFilters(resetFilterState);
    setPendingFilters(resetFilterState);
    setAuthorSearchQuery('');
    setShowFilters(false);
  };

  const removeFilter = (type) => {
    const newFilters = { ...localFilters, [type]: '' };
    setLocalFilters(newFilters);
    setPendingFilters(newFilters);
    
    if (type === 'author') {
      setAuthorSearchQuery('');
    }
    
    const params = new URLSearchParams();
    if (searchQuery) params.set("query", searchQuery);
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value && key !== type) params.set(key, value);
    });
    
    navigate(`/search?${params.toString()}`);
    applyFilters(allArticles, {
      query: searchQuery,
      ...newFilters
    });
  };

  return (
    <div className="search-results-page">
      <div className="search-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <FontAwesomeIcon icon={faArrowLeft} /> Retour
        </button>
        <div className="search-query-display">
          <h2>
            {searchQuery 
              ? `Résultats pour : "${searchQuery}"`
              : "Tous les articles"}
          </h2>
          <div className="results-meta">
            <span className="results-count">
              {articles.length} {articles.length === 1 ? 'résultat' : 'résultats'}
            </span>
            <button 
              className="filter-toggle"
              onClick={() => setShowFilters(!showFilters)}
            >
              <FontAwesomeIcon icon={faFilter} />
              Filtres
              {Object.values(localFilters).some(f => f) && (
                <span className="filter-badge"></span>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="search-content">
        {/* Filters Sidebar */}
        <div className={`filters-sidebar ${showFilters ? 'visible' : ''}`}>
          <div className="filters-header">
            <h3>Filtrer les résultats</h3>
            <button className="close-filters" onClick={() => setShowFilters(false)}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
          
          <div className="filter-group">
            <h4>Auteur</h4>
            <div className="author-search-container">
              <div className="author-search-input">
                
                <input
                  type="text"
                  placeholder="Rechercher par auteur"
                  value={authorSearchQuery}
                  onChange={handleAuthorSearchChange}
                  onFocus={() => setShowAuthorSuggestions(true)}
                />
              </div>
              {showAuthorSuggestions && suggestedAuthors.length > 0 && (
                <div className="author-suggestions">
                  {suggestedAuthors.map((author, index) => (
                    <div 
                      key={index} 
                      className="suggestion-item"
                      onClick={() => selectAuthor(author)}
                    >
                      {author}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div className="filter-group">
            <h4>Date de publication</h4>
            <select 
              name="dateRange" 
              value={pendingFilters.dateRange}
              onChange={(e) => setPendingFilters(prev => ({ ...prev, dateRange: e.target.value }))}
            >
              <option value="">Toutes périodes</option>
              <option value="week">Cette semaine</option>
              <option value="month">Ce mois</option>
              <option value="year">Cette année</option>
            </select>
          </div>
          
          <div className="filter-group">
            <h4>Volume</h4>
            <select 
              name="volume" 
              value={pendingFilters.volume}
              onChange={(e) => setPendingFilters(prev => ({ ...prev, volume: e.target.value }))}
            >
              <option value="">Tous les volumes</option>
              {Array.from({ length: 20 }, (_, i) => (
                <option key={i + 1} value={i + 1}>VOLUME {i + 1}</option>
              ))}
            </select>
          </div>
          
          <div className="filter-actions">
            <button className="apply-filters" onClick={submitFilters}>
              Appliquer les filtres
            </button>
            <button className="reset-filters" onClick={resetFilters}>
              Réinitialiser
            </button>
          </div>
        </div>

        {/* Results Section */}
        <div className="results-section">
          {/* Active filters display */}
          {Object.values(localFilters).some(f => f) && (
            <div className="active-filters">
              {localFilters.author && (
                <span className="active-filter">
                  Auteur: {localFilters.author}
                  <button 
                    className="remove-filter"
                    onClick={() => removeFilter('author')}
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </span>
              )}
              {localFilters.dateRange && (
                <span className="active-filter">
                  {getFilterLabel('dateRange', localFilters.dateRange)}
                  <button 
                    className="remove-filter"
                    onClick={() => removeFilter('dateRange')}
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </span>
              )}
              {localFilters.volume && (
                <span className="active-filter">
                  {getFilterLabel('volume', localFilters.volume)}
                  <button 
                    className="remove-filter"
                    onClick={() => removeFilter('volume')}
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </span>
              )}
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="error-message">
              <p>{error}</p>
              <button onClick={() => window.location.reload()}>Réessayer</button>
            </div>
          )}

          {/* Results list */}
          {isLoading ? (
            <div className="loading-indicator">
              <div className="spinner"></div>
              <p>Chargement des résultats...</p>
            </div>
          ) : articles.length > 0 ? (
            <div className="results-list">
              {articles.map((article) => (
                <ArticleResultCard 
                  key={article.id} 
                  article={article} 
                  navigate={navigate}
                  formatDate={formatDate}
                />
              ))}
            </div>
          ) : (
            <div className="no-results">
              <h3>Aucun article trouvé</h3>
              <p>Essayez d'ajuster vos critères de recherche ou vos filtres.</p>
              <button className="new-search-button" onClick={() => navigate('/')}>
                Nouvelle recherche
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ArticleResultCard = ({ article, navigate, formatDate }) => (
  <div className="result-card" onClick={() => navigate(`/article/${article.id}`)}>
    <h3 className="result-title">{article.title}</h3>
    <div className="result-meta">
      <span className="meta-item">
        <FontAwesomeIcon icon={faUser} />
        {article.author}
      </span>
      <span className="meta-item">
        <FontAwesomeIcon icon={faCalendarAlt} />
        {formatDate(article.publication_date)}
      </span>
      {article.volume && (
        <span className="meta-item">
          VOLUME {article.volume}
        </span>
      )}
    </div>
    {article.abstract && (
      <p className="result-abstract">
        {article.abstract.substring(0, 200)}...
      </p>
    )}
    {article.keywords && (
      <div className="result-keywords">
        {article.keywords.split(',').map((keyword, index) => (
          <span key={index} className="keyword-tag">{keyword.trim()}</span>
        ))}
      </div>
    )}
    <div className="result-actions">
      <button className="view-button">
        Voir les détails <FontAwesomeIcon icon={faChevronDown} />
      </button>
    </div>
  </div>
);

export default SearchResults;