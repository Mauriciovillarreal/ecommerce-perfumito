import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/sessions/current', {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        }
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    };

    fetchCurrentUser();
  }, []);

  const handleGitHubLogin = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/sessions/current', { 
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setUser(data.user);
    } catch (error) {
      console.error('Error fetching current user:', error);
    }
  };

  const register = async (formData) => {
    try {
      const response = await fetch('http://localhost:8080/api/sessions/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        window.location.href = '/';
      } else {
        console.error('Error registering user:', data.error);
      }
    } catch (error) {
      console.error('Error registering user:', error);
    }
  };

  const login = (userData) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/sessions/logout', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (response.ok) {
        setUser(null);
        window.location.href = '/login';
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al cerrar sesión');
      }
    } catch (error) {
      console.error('Error al cerrar sesión:', error.message);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, handleGitHubLogin }}>
      {children}
    </AuthContext.Provider>
  );
};
