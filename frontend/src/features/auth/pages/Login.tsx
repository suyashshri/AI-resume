import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { loading, handleLogin } = useAuth();

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await handleLogin({ email, password });
      navigate({ to: "/dashboard" });
    } catch (error) {
      console.log("Error while registering: ", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-50">
        <div className="loader" />
      </div>
    );
  }

  return (
    <main className="min-h-screen flex flex-col justify-between bg-background text-foreground">
      {/* TOP SECTION */}
      <div className="flex flex-col items-center justify-center flex-1">
        {/* Logo */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold tracking-tight">HireMind</h1>
          <p className="text-xs text-muted-foreground tracking-wider">
            INTELLIGENCE-DRIVEN CAREER GROWTH
          </p>
        </div>

        {/* CARD */}
        <div className="card w-full max-w-md relative space-y-6">
          {/* Badge */}
          <div className="absolute right-4 top-4 badge text-xs">
            ⚡ AI SECURE
          </div>

          {/* Header */}
          <div className="space-y-1">
            <h2 className="text-xl font-semibold">Welcome Back</h2>
            <p className="text-sm text-muted-foreground">
              Continue your journey to the architectural elite.
            </p>
          </div>

          {/* Social Buttons */}
          <div className="flex gap-4">
            <button className="social-btn flex-1">Google</button>
            <button className="social-btn flex-1">LinkedIn</button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex-1 h-px bg-border"></div>
            OR LOGIN WITH EMAIL
            <div className="flex-1 h-px bg-border"></div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="space-y-5">
              <div className="flex flex-col justify-between items-start">
                <label htmlFor="email" className="label">
                  WORK EMAIL
                </label>
                <input
                  className="input"
                  type="email"
                  name="email"
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                />
              </div>

              <div>
                <div className="flex justify-between items-center">
                  <label className="label" htmlFor="password">
                    SECURITY KEY
                  </label>
                  <span className="text-xs text-primary cursor-pointer">
                    FORGOT?
                  </span>
                </div>

                <div className="relative">
                  <input
                    type="password"
                    name="password"
                    onChange={(e) => setPassword(e.target.value)}
                    className="input pr-10"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {/* Button */}
              <button className="btn-primary mt-2">Log In →</button>
            </div>
          </form>
        </div>

        {/* Bottom link */}
        <p className="mt-6 text-sm text-muted-foreground">
          New to the platform?{" "}
          <Link to="/register">
            <span className="text-primary font-medium cursor-pointer hover:text-[#2563EB]">
              Create an Account
            </span>
          </Link>
        </p>
      </div>

      {/* FOOTER */}
      <footer className="flex justify-between items-center px-10 py-4 text-xs text-muted-foreground border-t border-border">
        <div>
          <p className="font-medium text-foreground">HireMind</p>
          <p>© 2024 HireMind. Intelligence-driven career growth.</p>
        </div>

        <div className="flex gap-6">
          <span className="cursor-pointer">Privacy Policy</span>
          <span className="cursor-pointer">AI Ethics</span>
          <span className="cursor-pointer">Contact Support</span>
        </div>
      </footer>
    </main>
  );
};

export default Login;
