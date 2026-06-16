'use client';
import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "@/lib/api";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, password_confirmation: string, company?: string, phone?: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,

      login: async (email, password) => {
        set({ isLoading: true });
        const { data } = await api.post("/auth/login", { email, password });
        localStorage.setItem("auth_token", data.token);
        set({ token: data.token, user: data.user, isLoading: false });
      },

      register: async (name, email, password, password_confirmation, company?: string, phone?: string) => {
        set({ isLoading: true });
        try {
          const { data } = await api.post("/auth/register", { name, email, password, password_confirmation, company, phone });
          localStorage.setItem("auth_token", data.token);
          set({ token: data.token, user: data.user, isLoading: false });
        } catch (err) {
          set({ isLoading: false });
          throw err;
        }
      },

      logout: async () => {
        await api.post("/auth/logout").catch(() => {});
        localStorage.removeItem("auth_token");
        set({ user: null, token: null });
      },

      fetchUser: async () => {
        if (!get().token) return;
        const { data } = await api.get("/auth/me");
        set({ user: data });
      },
    }),
    { name: "auth", partialize: (s) => ({ token: s.token, user: s.user }) }
  )
);
