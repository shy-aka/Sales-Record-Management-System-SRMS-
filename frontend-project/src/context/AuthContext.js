import React, { createContext, useState, useContext, useEffect } from "react";
import { loginUser } from "../services/api";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      setUser({ username: localStorage.getItem("username") });
    }
    setLoading(false);
  }, [token]);

  const login = async (username, password) => {
    const res = await loginUser({ username, password });
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("username", res.data.username);
    setToken(res.data.token);
    setUser({ username: res.data.username });
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
