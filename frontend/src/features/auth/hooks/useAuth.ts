import { useContext } from "react";
import { AuthContext } from "../contexts/auth.context";
import { register } from "../services/auth.service";

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  const { user, setUser, loading, setLoading } = context;

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
      setUser(data.user);
    } catch (error) {
      console.log("Error while Registering the user:", error);
    } finally {
      setLoading(false);
    }
  };

  return { user, loading, handleRegister };
};
