"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  email: string;
  name: string;
  loginTime: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  checkAuth: () => boolean;
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        if (!email.trim() || !password.trim()) {
          return {
            success: false,
            message: "Please enter both email and password",
          };
        }

        if (password.length < 3) {
          return {
            success: false,
            message: "Password must be at least 3 characters",
          };
        }

        const user: User = {
          id: Math.random().toString(36).substr(2, 9),
          email: email.trim(),
          name: email.split("@")[0] || "User",
          loginTime: new Date().toISOString(),
        };

        set({
          user,
          isAuthenticated: true,
        });

        return {
          success: true,
          message: "Login successful!",
        };
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
        });
      },

      checkAuth: () => {
        const state = get();
        return state.isAuthenticated && state.user !== null;
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
