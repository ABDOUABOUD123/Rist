import { createContext, useContext, useState, useEffect } from 'react';

const BookmarkContext = createContext();

// BookmarkContext.js
export const BookmarkProvider = ({ children }) => {
  const [bookmarks, setBookmarks] = useState([]);
  const [needsRefresh, setNeedsRefresh] = useState(false);

  const refreshBookmarks = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      const response = await fetch('http://127.0.0.1:8000/api/user/bookmarks/', {
        headers: {
          'Authorization': `Token ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setBookmarks(data);
      }
    } catch (error) {
      console.error("Error refreshing bookmarks:", error);
    }
  };
  
  useEffect(() => {
    if (needsRefresh) {
      refreshBookmarks();
      setNeedsRefresh(false);
    }
  }, [needsRefresh]);

  return (
    <BookmarkContext.Provider value={{ 
      bookmarks, 
      refreshBookmarks, 
      setNeedsRefresh 
    }}>
      {children}
    </BookmarkContext.Provider>
  );
};

export const useBookmarks = () => useContext(BookmarkContext);