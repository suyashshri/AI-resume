import { createContext } from "react";

export type User = {
  id: string;
  name: string;
  email: string;
} | null;

type AuthContextType = {
  user: User;
  setUser: (user: User) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);
