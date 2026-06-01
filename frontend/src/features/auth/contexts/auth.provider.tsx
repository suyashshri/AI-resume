import { useEffect, useState, type ReactNode } from "react";
import { AuthContext, type User } from "./auth.context";
import { getMe } from "../services/auth.service";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    getMe().then((data) => {
      if (data?.user) setUser(data.user);
      setInitializing(false);
    });
  }, []);

  const isAuthenticated = !!user;

  if (initializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="loader" />
      </div>
    );
  }

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
