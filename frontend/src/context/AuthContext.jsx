import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const AuthContext = createContext(null);

const TOKEN_KEY = "atulyam_admin_token";
const USER_KEY = "atulyam_admin_user";

const API_URL = import.meta.env.VITE_API_URL;

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    let mounted = true;

    const verifyToken = async () => {
      const savedToken = localStorage.getItem(TOKEN_KEY);

      // No token = definitely logged out
      if (!savedToken) {
        if (mounted) {
          setToken(null);
          setUser(null);
          setAuthChecked(true);
        }
        return;
      }

      try {
        const response = await fetch(`${API_URL}/auth/me`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${savedToken}`,
          },
        });

        if (!response.ok) {
          throw new Error("Invalid authentication token");
        }

        const adminData = await response.json();

        if (!mounted) return;

        // Only mark authenticated AFTER successful verification
        setToken(savedToken);
        setUser(adminData);

        localStorage.setItem(
          USER_KEY,
          JSON.stringify(adminData)
        );
      } catch (error) {
        console.error("Auth verification failed:", error);

        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);

        if (mounted) {
          setToken(null);
          setUser(null);
        }
      } finally {
        if (mounted) {
          setAuthChecked(true);
        }
      }
    };

    verifyToken();

    return () => {
      mounted = false;
    };
  }, []);

  const login = (authToken, adminData) => {
    localStorage.setItem(TOKEN_KEY, authToken);
    localStorage.setItem(
      USER_KEY,
      JSON.stringify(adminData)
    );

    setToken(authToken);
    setUser(adminData);
    setAuthChecked(true);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);

    setToken(null);
    setUser(null);
    setAuthChecked(true);
  };

  const isAuthenticated = Boolean(token && user);

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated,
        authChecked,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used within an AuthProvider"
    );
  }

  return context;
};

export default AuthContext;