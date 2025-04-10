import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
  faUserCircle, 
  faSignOutAlt, 
  faBookOpen, 
  faSearch,
  faEnvelope,
  faHome,
  faInfoCircle,
  faNewspaper,
  faPlusSquare,
  faBook,
  faBookmark,
  faCog,
  faTimes,
  faUser,
  faEnvelopeOpen,
  faHistory
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "./AuthContext";
import { useBookmarks } from "./BookmarkContext";
import "./layout.css";
import Footer from "./Footer";

const Layout = ({ children, onSearch }) => {
  const [query, setQuery] = useState("");
  const [showProfilePanel, setShowProfilePanel] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const { isLoggedIn, logout, user } = useAuth();
  const { bookmarks, refreshBookmarks } = useBookmarks();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setShowProfilePanel(false);
    navigate("/");
    toast.success("Logged out successfully");
  };

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
  
      const [profileResponse, bookmarksResponse] = await Promise.all([
        fetch('http://127.0.0.1:8000/api/user/profile/', {
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json',
          }
        }),
        fetch('http://127.0.0.1:8000/api/user/bookmarks/', {
          headers: {
            'Authorization': `Token ${token}`
          }
        })
      ]);
      
      if (profileResponse.ok && bookmarksResponse.ok) {
        const profileData = await profileResponse.json();
        const bookmarksData = await bookmarksResponse.json();
        
        setUserData({
          ...profileData,
          bookmarks: bookmarksData
        });
      } else {
        throw new Error('Failed to fetch profile data');
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
      toast.error(error.message || "Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (showProfilePanel && isLoggedIn) {
      fetchUserProfile();
    }
  }, [showProfilePanel, isLoggedIn, bookmarks]); // Add bookmarks as dependency

  const toggleProfilePanel = () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    setShowProfilePanel(!showProfilePanel);
  };

  const handleNavigateTo = (path) => {
    navigate(path);
    setShowProfilePanel(false);
  };

  return (
    <div className="layout-container">
  
      <header className="header sticky-nav">
        <div className="nav-container">
          <div className="logo-container" onClick={() => navigate("/")}>
            <FontAwesomeIcon icon={faBookOpen} className="logo-icon" />
            <span className="logo-text">ScholarLib</span>
          </div>

          <nav className="nav-links">
            <div className="nav-item">
              <Link to="/" className="nav-link">
                <FontAwesomeIcon icon={faHome} className="nav-icon" />
                Home
              </Link>
              <div className="nav-underline"></div>
            </div>
            <div className="nav-item">
              <Link to="/about" className="nav-link">
                <FontAwesomeIcon icon={faInfoCircle} className="nav-icon" />
                About
              </Link>
              <div className="nav-underline"></div>
            </div>
            <div className="nav-item">
              <Link to="/collections" className="nav-link">
                <FontAwesomeIcon icon={faBook} className="nav-icon" />
                Collections
              </Link>
              <div className="nav-underline"></div>
            </div>
            <div className="nav-item">
              <Link to="/journals" className="nav-link">
                <FontAwesomeIcon icon={faNewspaper} className="nav-icon" />
                Journals
              </Link>
              <div className="nav-underline"></div>
            </div>
            <div className="nav-item">
              <Link to="/add-article" className="nav-link">
                <FontAwesomeIcon icon={faPlusSquare} className="nav-icon" />
                Contribute
              </Link>
              <div className="nav-underline"></div>
            </div>
            <div className="nav-item">
              <Link to="/contact" className="nav-link">
                <FontAwesomeIcon icon={faEnvelope} className="nav-icon" />
                Contact
              </Link>
              <div className="nav-underline"></div>
            </div>
          </nav>

          <div className="user-actions">
            <div className="profile-container">
              <FontAwesomeIcon
                icon={faUserCircle}
                className={`profile-icon ${showProfilePanel ? 'active' : ''}`}
                onClick={toggleProfilePanel}
              />
              {isLoggedIn && (
                <button 
                  className="logout-button"
                  onClick={handleLogout}
                  title="Logout"
                >
                  <FontAwesomeIcon icon={faSignOutAlt} />
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Profile Panel */}
      {showProfilePanel && (
        <div className="profile-panel-overlay" onClick={toggleProfilePanel}>
          <div className="profile-panel" onClick={(e) => e.stopPropagation()}>
            <div className="profile-panel-header">
              <h3>My Account</h3>
              <button className="close-panel" onClick={toggleProfilePanel}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            
            <div className="profile-info">
              <div className="profile-avatar">
                <FontAwesomeIcon icon={faUserCircle} size="3x" />
              </div>
              <div className="profile-details">
                <h4>{userData?.username || user?.username || 'User'}</h4>
                <p className="profile-email">
                  <FontAwesomeIcon icon={faEnvelopeOpen} className="detail-icon" />
                  {userData?.email || user?.email || 'user@example.com'}
                </p>
                <p className="profile-joined">
                  <FontAwesomeIcon icon={faHistory} className="detail-icon" />
                  Member since {userData?.join_date || '2023'}
                </p>
              </div>
            </div>

            <div className="profile-sections">
              <div className="profile-section">
                <h4>
                  <FontAwesomeIcon icon={faBookmark} className="section-icon" />
                  Saved Articles ({userData?.bookmarks?.length || 0})
                </h4>
                {loading ? (
                  <div className="loading-text">Loading...</div>
                ) : userData?.bookmarks?.length > 0 ? (
                  <ul className="saved-articles-list">
                    {userData.bookmarks.map(bookmark => (
                     <li 
                     key={bookmark.id} 
                     className="saved-article-item"
                     onClick={() => handleNavigateTo(`/article/${bookmark.article_id}`)}
                   >
                     <div className="article-title">{bookmark.article_title}</div>
                     <div className="article-date">
                       {new Date(bookmark.created_at).toLocaleDateString()}
                     </div>
                   </li>
                    ))}
                  </ul>
                ) : (
                  <div className="empty-state">
                    No saved articles yet
                  </div>
                )}
              </div>

              <div className="profile-actions">
                <button 
                  className="profile-action-btn"
                  onClick={() => handleNavigateTo("/profile")}
                >
                  <FontAwesomeIcon icon={faUser} className="action-icon" />
                  View Full Profile
                </button>
                <button 
                  className="profile-action-btn"
                  onClick={() => handleNavigateTo("/settings")}
                >
                  <FontAwesomeIcon icon={faCog} className="action-icon" />
                  Account Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <main className="content">
        {React.Children.map(children, child => {
          return React.cloneElement(child, { refreshBookmarks });
        })}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;