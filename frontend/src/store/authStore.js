import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../api/axios';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isAuthenticated: false,

      // setAuth(user, token)  — pages pass user first, token second
      setAuth: (user, token) => {
        set({ user, token, isAuthenticated: true });
      },

      setUser: (user) => set({ user }),

      updateUser: (data) =>
        set((state) => ({ user: { ...state.user, ...data } })),

      logout: () =>
        set({ token: null, user: null, isAuthenticated: false }),

      isAdmin: () => {
        const { user } = get();
        return user?.role === 'admin' || user?.role === 'superAdmin';
      },

      isSuperAdmin: () => {
        const { user } = get();
        return user?.role === 'superAdmin';
      },

      validateAuth: async () => {
        const { logout } = get();
        try {
          const res = await api.get('/auth/is-authenticated');
          const { user } = res.data;
          if (!user) return logout();
          set({ user, isAuthenticated: true });
        } catch (error) {
          logout();
          console.log({message: "Error in validateAuth", error});
        }
      }
    }),
    {
      name: 'railway-auth',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
