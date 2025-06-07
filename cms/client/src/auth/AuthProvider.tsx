import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  exp: number;
  scopes: string[];
}

interface AuthContextProps {
  isAuthenticated: boolean;
  scopes: string[];
  logout: () => void;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  setScopes: React.Dispatch<React.SetStateAction<string[]>>;
}
const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [scopes, setScopes] = useState<string[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      setIsAuthenticated(false);
      setScopes([]);
      return;
    }

    try {
      const decoded = jwtDecode<JwtPayload>(token);

      if (Date.now() >= decoded.exp * 1000) {
        localStorage.removeItem("authToken");
        setIsAuthenticated(false);
        setScopes([]);
        return;
      }

      setIsAuthenticated(true);
      setScopes(decoded.scopes || []);
    } catch (error) {
      console.error("Invalid JWT token:", error);
      localStorage.removeItem("authToken");
      setIsAuthenticated(false);
      setScopes([]);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("authToken");
    setIsAuthenticated(false);
    setScopes([]);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        scopes,
        logout,
        setIsAuthenticated,
        setScopes
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
