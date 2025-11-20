import { createContext, useContext, useState, ReactNode } from "react";
import { mockUser } from "@/data/mockData";

interface AuthContextType {
  isAuthenticated: boolean;
  user: typeof mockUser | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  favorites: string[];
  toggleFavorite: (spotId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<typeof mockUser | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);

  const login = (email: string, password: string): boolean => {
    if (email === mockUser.email && password === mockUser.password) {
      setIsAuthenticated(true);
      setUser(mockUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  const toggleFavorite = (spotId: string) => {
    setFavorites(prev => 
      prev.includes(spotId) 
        ? prev.filter(id => id !== spotId)
        : [...prev, spotId]
    );
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, favorites, toggleFavorite }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
