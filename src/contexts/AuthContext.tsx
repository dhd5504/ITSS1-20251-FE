import { createContext, useContext, ReactNode, useState } from "react";
import { useAppStore } from "@/store/useAppStore";

interface AuthContextType {
  isAuthenticated: boolean;
  user: any | null;
  login: (user: any, refreshToken: string) => void;
  logout: () => void;
  favorites: string[];
  toggleFavorite: (spotId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, user, login, logout } = useAppStore();
  const [favorites, setFavorites] = useState<string[]>([]);

  const toggleFavorite = (spotId: string) => {
    setFavorites((prev) =>
      prev.includes(spotId)
        ? prev.filter((id) => id !== spotId)
        : [...prev, spotId]
    );
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        logout,
        favorites,
        toggleFavorite,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
