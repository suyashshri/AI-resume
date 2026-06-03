import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { loading, error, handleLogin } = useAuth();

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await handleLogin({ email, password });
      navigate({ to: "/dashboard" });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error?.requiresVerification) {
        navigate({ to: "/verify-otp", search: { email: error.email } });
      }
    }
  };

  return (
    <main className="min-h-screen flex flex-col justify-between bg-background text-foreground">
      <div className="flex flex-1">
        {/* LEFT — brand panel */}
        <div className="hidden lg:flex w-1/2 flex-col justify-center px-16">
          <div className="badge w-fit">
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
              <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
              <path d="M18 3L18.8 5.2L21 6L18.8 6.8L18 9L17.2 6.8L15 6L17.2 5.2L18 3Z" />
              <path d="M6 16L6.6 17.8L8.4 18.4L6.6 19L6 20.8L5.4 19L3.6 18.4L5.4 17.8L6 16Z" />
            </svg>
            INTELLIGENCE-DRIVEN
          </div>
          <h1 className="hero-title mt-4">
            Welcome <span className="hero-highlight">back.</span>
          </h1>
          <p className="hero-desc w-[70%]">
            Your career trajectory is waiting. Pick up exactly where you left
            off.
          </p>
          <div className="mt-8 bg-surface w-[60%] p-4 flex flex-col rounded-2xl">
            <h5 className="text-accent text-sm font-semibold italic">
              AI INSIGHT
            </h5>
            <p className="text-sm font-semibold italic text-muted-foreground tracking-tight leading-tight mt-1.5">
              "Candidates who iterate on their resume weekly are 2.4x more
              likely to land interviews within 30 days."
            </p>
          </div>
        </div>

        {/* RIGHT — form */}
        <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
          {/* Mobile logo */}
          <div className="text-center mb-8 lg:hidden">
            <h1 className="text-2xl font-black tracking-tight">
              <span className="text-foreground">Hire</span>
              <span className="text-primary">Mind</span>
            </h1>
            <p className="text-xs text-muted-foreground tracking-wider">
              INTELLIGENCE-DRIVEN CAREER GROWTH
            </p>
          </div>

          <div className="card w-full max-w-md relative space-y-6">
            <div className="absolute right-4 top-4 badge text-xs">
              ⚡ AI SECURE
            </div>

            <div className="space-y-1">
              <h2 className="text-xl font-semibold">Welcome Back</h2>
              <p className="text-sm text-muted-foreground">
                Continue your journey to the architectural elite.
              </p>
            </div>

            {/* <div className="flex gap-4">
              <button className="social-btn flex-1" disabled>
                Google
              </button>
              <button className="social-btn flex-1" disabled>
                LinkedIn
              </button>
            </div> */}

            {/* <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <div className="flex-1 h-px bg-border" />
              OR LOGIN WITH EMAIL
              <div className="flex-1 h-px bg-border" />
            </div> */}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="flex flex-col gap-1">
                <label htmlFor="email" className="label">
                  WORK EMAIL
                </label>
                <input
                  id="email"
                  className="input"
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                />
              </div>

              <div className="flex flex-col gap-1">
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
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input pr-10"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground cursor-pointer"
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <button className="btn-primary mt-2" disabled={loading}>
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="loader" />
                  </div>
                ) : (
                  "Log In →"
                )}
              </button>
            </form>
          </div>

          <p className="mt-6 text-sm text-muted-foreground">
            New to the platform?{" "}
            <Link to="/register">
              <span className="text-primary font-medium hover:underline">
                Create an Account
              </span>
            </Link>
          </p>
        </div>
      </div>

      <footer
        className="flex justify-between items-center px-10 py-4 text-xs text-muted-foreground border-t
  border-border"
      >
        <div>
          <p className="font-medium">
            <span className="text-foreground">Hire</span>
            <span className="text-primary">Mind</span>
          </p>
          <p>© 2025 HireMind. Intelligence-driven career growth.</p>
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
