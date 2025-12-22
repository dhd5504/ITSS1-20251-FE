import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { useAppStore } from "@/store/useAppStore";
import apiClient from "@/lib/axios";
import { toast } from "sonner";

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

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!isAuthenticated) {
        setFavorites([]);
        return;
      }
      try {
        const response = await apiClient.get("/api/spots/favorites");
        if (response.status === 200) {
          // Assuming the API returns an array of objects with an 'id' property
          // or just an array of IDs. Let's adjust based on common patterns.
          const favoriteIds = response.data.data.map((spot: any) => spot.id);
          setFavorites(favoriteIds);
        }
      } catch (error) {
        console.error("Failed to fetch favorites:", error);
      }
    };

    fetchFavorites();
  }, [isAuthenticated]);

  const toggleFavorite = async (spotId: string) => {
    const isFavorite = favorites.includes(spotId);

    // Optimistic UI update
    setFavorites((prev) =>
      isFavorite ? prev.filter((id) => id !== spotId) : [...prev, spotId]
    );

    try {
      if (isFavorite) {
        await apiClient.delete(`/api/spots/${spotId}/favorite`);
        toast.success("お気に入りから削除しました");
      } else {
        await apiClient.post(`/api/spots/${spotId}/favorite`);
        toast.success("お気に入りに追加しました");
      }
    } catch (error) {
      // Revert optimistic update on failure
      setFavorites((prev) =>
        isFavorite ? [...prev, spotId] : prev.filter((id) => id !== spotId)
      );
      toast.error("お気に入りの更新に失敗しました");
      console.error("Failed to toggle favorite:", error);
    }
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
