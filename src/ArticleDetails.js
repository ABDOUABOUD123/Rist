import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { useBookmarks } from './BookmarkContext';
import { FaBookmark, FaRegBookmark } from 'react-icons/fa';
import { toast } from 'react-toastify';


import './articles.css';
import './comments.css';
import './bookmark.css';

const ArticleDetails = ({ refreshBookmarks }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuth();
  const { setNeedsRefresh } = useBookmarks();
  const [article, setArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);

  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editError, setEditError] = useState(null);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedComment, setEditedComment] = useState('');

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000/api';
  useEffect(() => {
    let isMounted = true;
  
    const fetchArticleData = async () => {
      try {
        setIsLoading(true);
        setError('');
  
        const [articleRes, commentsRes] = await Promise.all([
          fetch(`http://127.0.0.1:8000/api/articles/${id}/`),
          fetch(`http://127.0.0.1:8000/api/articles/${id}/comments/`, {
            headers: {
              'Authorization': `Token ${localStorage.getItem('token')}`
            }
          })
        ]);
  
        if (!articleRes.ok) {
          throw new Error('Article not found');
        }
  
        const articleData = await articleRes.json();
        if (isMounted) setArticle(articleData);
  
        if (commentsRes.ok) {
          const commentsData = await commentsRes.json();
          if (isMounted) setComments(commentsData);
        }
  
        if (isLoggedIn && isMounted) {
          await checkBookmarkStatus();
        }
      } catch (err) {
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
  
    const checkBookmarkStatus = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/articles/${id}/bookmark/`, {
          headers: {
            'Authorization': `Token ${localStorage.getItem('token')}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setIsBookmarked(data.exists);
        } else if (response.status === 500) {
          const errorData = await response.json();
          console.error('Server error:', errorData.error);
          setIsBookmarked(false); // Fail-safe
        } else {
          setIsBookmarked(false); // Default for other errors
        }
      } catch (err) {
        console.error('Network error:', err);
        setIsBookmarked(false);
      }
    };
  
    fetchArticleData();
  
    return () => {
      isMounted = false;
    };
  }, [id, isLoggedIn]);

  const toggleBookmark = async () => {
    if (!isLoggedIn) {
      toast.info('Please login to bookmark articles');
      navigate('/login');
      return;
    }
    
    setBookmarkLoading(true);
    try {
      const method = isBookmarked ? 'DELETE' : 'POST';
      const response = await fetch(`${API_BASE_URL}/articles/${id}/bookmark/`, {
        method,
        headers: {
          'Authorization': `Token ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: method === 'POST' ? JSON.stringify({ article_id: id }) : undefined
      });
      
      if (response.ok) {
        setIsBookmarked(!isBookmarked);
        setNeedsRefresh(true);
        toast.success(
          isBookmarked ? 'Article removed from bookmarks' : 'Article bookmarked!'
        );
      } else {
        throw new Error('Failed to update bookmark');
      }
    } catch (err) {
      console.error('Error toggling bookmark:', err);
      toast.error('Failed to update bookmark');
    } finally {
      setBookmarkLoading(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
  
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/articles/${id}/comments/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ content: newComment })
      });
  
      if (response.ok) {
        const data = await response.json();
        setComments([...comments, data]);
        setNewComment('');
        setShowCommentForm(false);
        // Simplified toast call:
        toast.success('Comment posted successfully!');
      } else {
        const errorData = await response.json();
        console.error('Error posting comment:', errorData);
        // Simplified toast call:
        toast.error(errorData.detail || 'Failed to post comment');
      }
    } catch (err) {
      console.error('Failed to post comment:', err);
      // Simplified toast call:
      toast.error('Failed to post comment');
    }
  };

  const handleEditComment = (comment) => {
    setEditingCommentId(comment.id);
    setEditedComment(comment.content);
  };

  const handleUpdateComment = async (commentId) => {
    setIsUpdating(true);
    setEditError(null);
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/comments/${commentId}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ content: editedComment })
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to update comment');
      }
  
      const updatedComment = await response.json();
      setComments(comments.map(c => c.id === commentId ? updatedComment : c));
      setEditingCommentId(null);
      toast.success('Comment updated successfully!');
    } catch (err) {
      setEditError(err.message);
      toast.error(err.message || 'Failed to update comment');
    } finally {
      setIsUpdating(false);
    }
  };
  
  const handleDeleteComment = async (commentId) => {
    setIsDeleting(true);
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/comments/${commentId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Token ${localStorage.getItem('token')}`
        }
      });
  
      if (!response.ok) {
        throw new Error('Failed to delete comment');
      }
  
      setComments(comments.filter(c => c.id !== commentId));
      toast.success('Comment deleted successfully!');
    } catch (err) {
      toast.error('Failed to delete comment');
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return <div className="loading-container">Loading...</div>;
  }

  if (error) {
    return <div className="error-container">{error}</div>;
  }

  if (!article) {
    return <div className="not-found">Article not found</div>;
  }

  return (
    <div className="article-details-container">

      <div className="article-header">
        <div className="article-title-row">
          <h1>{article.title}</h1>
          <button 
            className={`bookmark-button ${isBookmarked ? 'bookmarked' : ''}`}
            onClick={toggleBookmark}
            disabled={bookmarkLoading}
            aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark this article'}
          >
            {bookmarkLoading ? (
              <span className="bookmark-loader">...</span>
            ) : isBookmarked ? (
              <FaBookmark className="bookmark-icon" />
            ) : (
              <FaRegBookmark className="bookmark-icon" />
            )}
            <span className="bookmark-text">
              {isBookmarked ? 'Bookmarked' : 'Bookmark'}
            </span>
          </button>
        </div>
        <div className="article-meta">
          <span className="author">By <strong>{article.author}</strong></span>
          <span className="date">Published: {new Date(article.publication_date).toLocaleDateString()}</span>
          <span className="pages">{article.pages || 'N/A'} pages</span>
          {article.doi && (
            <span className="doi">
              DOI: <a href={`https://doi.org/${article.doi}`} target="_blank" rel="noopener noreferrer">{article.doi}</a>
            </span>
          )}
        </div>
      </div>

      <div className="article-content">
        <div className="article-body">
          <div className="article-section">
            <h3>Abstract</h3>
            <div className="divider"></div>
            <div className="article-text">
              <p>{article.abstract || 'No abstract available.'}</p>
            </div>
          </div>

          <div className="article-section">
            <h3>Keywords</h3>
            <div className="divider"></div>
            <div className="keywords-container">
              {article.keywords && article.keywords.split(',').map((keyword, index) => (
                <span key={index} className="keyword-tag">{keyword.trim()}</span>
              ))}
            </div>
          </div>

          <div className="article-section">
            <h3>Main Content</h3>
            <div className="divider"></div>
            <div className="article-text">
              <p>{article.content || 'No content available.'}</p>
            </div>
          </div>

          <div className="article-footer">
            <div className="publication-info">
              <div className="citation-info">
                <h4>How to cite this article</h4>
                <p>{article.author}. "{article.title}". <em>Journal Name</em>, {article.publication_date && new Date(article.publication_date).getFullYear()}; {article.pages}.</p>
              </div>
              <div className="download-section">
                <button className="download-button">
                  Download PDF
                </button>
                <button className="download-button">
                  Download Citation
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="sidebar">
          <div className="sidebar-section">
            <h4>Article Metrics</h4>
            <div className="metrics">
              <div className="metric-item">
                <span className="metric-value">{article.views || 0}</span>
                <span className="metric-label">Views</span>
              </div>
              <div className="metric-item">
                <span className="metric-value">{article.downloads || 0}</span>
                <span className="metric-label">Downloads</span>
              </div>
              <div className="metric-item">
                <span className="metric-value">{article.citations || 0}</span>
                <span className="metric-label">Citations</span>
              </div>
            </div>
          </div>

          <div className="sidebar-section">
            <h4>Related Articles</h4>
            <ul className="related-articles">
              {article.related_articles && article.related_articles.length > 0 ? (
                article.related_articles.map((related, index) => (
                  <li key={index}>
                    <a href={`/articles/${related.id}`}>{related.title}</a>
                  </li>
                ))
              ) : (
                <li>No related articles found</li>
              )}
            </ul>
          </div>
        </div>
      </div>

      <div className="comments-section">
        <div className="comments-header">
          <h3>Discussion ({comments.length})</h3>
          {isLoggedIn && (
            <button 
              className="add-comment-button"
              onClick={() => setShowCommentForm(!showCommentForm)}
            >
              {showCommentForm ? 'Cancel' : 'Add Comment'}
            </button>
          )}
        </div>

        {showCommentForm && (
          <form onSubmit={handleCommentSubmit} className="comment-form">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts about this article..."
              rows="4"
              required
            />
            <div className="comment-form-actions">
              <button type="submit" className="submit-comment-button">
                Post Comment
              </button>
            </div>
          </form>
        )}

        <div className="comments-list">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment.id} className="comment">
                <div className="comment-header">
                  <span className="comment-author">{comment.author}</span>
                  <span className="comment-date">
                    {new Date(comment.created_at).toLocaleDateString()}
                  </span>
                  {comment.is_owner && (
                    <div className="comment-actions">
                      {editingCommentId === comment.id ? (
                        <>
                          <button 
                            className="comment-action-btn save-btn"
                            onClick={() => handleUpdateComment(comment.id)}
                            disabled={isUpdating}
                          >
                            {isUpdating ? 'Saving...' : 'Save'}
                          </button>
                          <button 
                            className="comment-action-btn cancel-btn"
                            onClick={() => {
                              setEditingCommentId(null);
                              setEditError(null);
                            }}
                            disabled={isUpdating}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button 
                            className="comment-action-btn edit-btn"
                            onClick={() => handleEditComment(comment)}
                          >
                            Edit
                          </button>
                                  <button 
                                    className="comment-action-btn delete-btn"
                                    onClick={() => {
                                      toast.warning(
                                        'Are you sure you want to delete this comment?',
                                        {
                                          position: "top-center",
                                          autoClose: 5000,
                                          closeButton: true,
                                          draggable: true,
                                          onClick: () => handleDeleteComment(comment.id)
                                        }
                                      );
                                    }}
                                    disabled={isDeleting}
                                  >
                                    {isDeleting ? 'Deleting...' : 'Delete'}
                                  </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
                <div className="comment-content">
                  {editingCommentId === comment.id ? (
                    <>
                      <textarea
                        className="comment-edit-textarea"
                        value={editedComment}
                        onChange={(e) => setEditedComment(e.target.value)}
                        rows="3"
                        autoFocus
                      />
                      {editError && <div className="comment-error">{editError}</div>}
                    </>
                  ) : (
                    <p>{comment.content}</p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="no-comments">No comments yet. Be the first to comment!</p>
          )}
        </div>
      </div>

      <div className="contribution-section">
        <h3>Contribute to Our Research</h3>
        <p>Have feedback or want to contribute to this research area? Contact our editorial team.</p>
        <button 
          className="contact-button"
          onClick={() => navigate('/contact')}
        >
          Contact Editors
        </button>
      </div>

      <button 
        className="back-button"
        onClick={() => navigate(-1)}
      >
        &larr; Back to Articles
      </button>
    </div>
  );
};

export default ArticleDetails;