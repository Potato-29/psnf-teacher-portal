import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import supabase from "@/config/supabase-client";

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = Cookies.get("token");
        if (!token) {
          setLoading(false);
          return;
        }
        // Decode token to get email
        const decoded = jwtDecode(token);
        const email = decoded.email;

        setUser(decoded.user);
      } catch (err) {
        console.log(err);
        setError(err.message);
        // Clear invalid token
        Cookies.remove("token");
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const logout = () => {
    Cookies.remove("token");
    setUser(null);
  };

  return {
    user,
    loading,
    error,
    logout,
    isAuthenticated: !!user,
  };
};
