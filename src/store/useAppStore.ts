import { create } from "zustand";
import { persist } from "zustand/middleware";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

export interface User {
  email: string;
  name: string;
  avatar: string;
  id?: string;
}

interface AppState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
  checkAuth: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (token) => {
        try {
          // Save token to cookie
          Cookies.set("playfinder_token", token, { expires: 7 }); // Expires in 7 days

          const decoded: any = jwtDecode(token);
          const user: User = {
            email: decoded.sub || decoded.email || "",
            name: decoded.name || decoded.preferred_username || "User",
            avatar: decoded.picture || decoded.avatar || "",
            id: decoded.id || decoded.user_id,
          };
          set({ user, token, isAuthenticated: true });
        } catch (error) {
          console.error("Invalid token during login:", error);
        }
      },
      logout: () => {
        Cookies.remove("playfinder_token");
        set({ user: null, token: null, isAuthenticated: false });
      },
      checkAuth: () => {
        const token = Cookies.get("playfinder_token");
        if (token) {
          try {
            const decoded: any = jwtDecode(token);
            const currentTime = Date.now() / 1000;
            if (decoded.exp && decoded.exp < currentTime) {
              get().logout();
            } else {
              // Token valid, ensure user is set/updated
              const user: User = {
                email: decoded.sub || decoded.email || "",
                name: decoded.name || decoded.preferred_username || "User",
                avatar: decoded.picture || decoded.avatar || "",
                id: decoded.id || decoded.user_id,
              };
              set({ user, token, isAuthenticated: true });
            }
          } catch (error) {
            console.error("Invalid token during checkAuth:", error);
            get().logout();
          }
        } else {
          // No token, ensure logged out
          set({ user: null, token: null, isAuthenticated: false });
        }
      },
    }),
    {
      name: "app-storage",
      partialize: (state) => ({ user: state.user }), // Only persist user details if needed, or nothing if we trust checkAuth completely.
      // Let's persist user to avoid flicker before checkAuth runs, but checkAuth will validate/override.
    }
  )
);
