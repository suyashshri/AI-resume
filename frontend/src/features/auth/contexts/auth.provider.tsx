import { useState, type ReactNode } from "react";
import { AuthContext, type User } from "./auth.context";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>(null);
  const isAuthenticated = !!user;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        setUser,
        loading,
        setLoading,
        error,
        setError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
