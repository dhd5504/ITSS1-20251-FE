import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  email: string;
  name: string;
  avatar: string;
  id?: string;
  role?: string;
}

interface AppState {
  user: User | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  login: (user: User, refreshToken: string) => void;
  logout: () => void;
  updateUser: (user: User) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      refreshToken: null,
      isAuthenticated: false,
      login: (user, refreshToken) => {
        const resolvedId =
          (user as any).id ??
          (user as any).userId ??
          (user as any).username ??
          (user.email ? user.email.split("@")[0] : "");
        const resolvedName =
          user.name ??
          (user as any).username ??
          (user.email ? user.email.split("@")[0] : "");

        set({
          user: {
            ...user,
            id: resolvedId?.toString(),
            name: resolvedName,
          },
          refreshToken,
          isAuthenticated: true,
        });
      },
      logout: () => {
        set({ user: null, refreshToken: null, isAuthenticated: false });
      },
      updateUser: (user) => {
        set({ user });
      },
    }),
    {
      name: "app-storage",
      partialize: (state) => ({
        user: state.user,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
