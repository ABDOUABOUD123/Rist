import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isLoggedIn: false,
    token: null,
    isLoading: true // Add loading state
  });

  useEffect(() => {
    // Initialize auth state
    const token = localStorage.getItem('token');
    setAuthState({
      isLoggedIn: !!token,
      token,
      isLoading: false
    });
  }, []);

  const login = useCallback((token) => {
    localStorage.setItem('token', token);
    setAuthState({
      isLoggedIn: true,
      token,
      isLoading: false
    });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setAuthState({
      isLoggedIn: false,
      token: null,
      isLoading: false
    });
  }, []);

  return (
    <AuthContext.Provider value={{
      isLoggedIn: authState.isLoggedIn,
      token: authState.token,
      isLoading: authState.isLoading,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};