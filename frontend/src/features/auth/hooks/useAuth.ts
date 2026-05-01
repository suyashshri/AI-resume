import { useContext } from "react";
import { AuthContext } from "../contexts/auth.context";
import { login, register } from "../services/auth.service";

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  const {
    isAuthenticated,
    user,
    setUser,
    loading,
    setLoading,
    error,
    setError,
  } = context;

  const handleRegister = async ({
    username,
    email,
    password,
  }: {
    username: string;
    email: string;
    password: string;
  }) => {
    setLoading(true);
    try {
      const data = await register({ username, email, password });
      setError(null);
      setUser(data.user);
    } catch (error) {
      console.log("Error while Registering the user:", error);
      setError(error instanceof Error ? error.message : String(error));
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    setLoading(true);
    try {
      const data = await login({ email, password });
      setError(null);
      setUser(data.user);
    } catch (error) {
      console.log("Error while Registering the user:", error);
      setError(error instanceof Error ? error.message : String(error));
    } finally {
      setLoading(false);
    }
  };

  return { isAuthenticated, user, loading, handleRegister, handleLogin, error };
};
