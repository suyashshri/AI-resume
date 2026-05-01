import { createContext } from "react";

export type User = {
  id: string;
  name: string;
  email: string;
} | null;

type AuthContextType = {
  isAuthenticated: boolean;
  user: User;
  setUser: (user: User) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);
