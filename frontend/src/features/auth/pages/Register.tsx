import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { loading, handleRegister } = useAuth();

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await handleRegister({ username, email, password });
      navigate({ to: "/login" });
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
    <main className="max-h-screen w-full m-2 bg-background text-slate-900 overflow-hidden">
      <nav className=" flex justify-between items-center mt-2 px-10 mx-10">
        <h2 className="font-extrabold text-2xl text-foreground tracking-tighter">
          HireMind
        </h2>
        <div className="text-sm font-semibold text-secondary ">
          Already have an account?{" "}
          <Link to="/login" className="nav-link">
            Log In
          </Link>
        </div>
      </nav>
      <div className="mt-8 flex">
        <div className="w-1/2 mt-6">
          <div className="ml-32">
            <h4 className="badge ">
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
                <path d="M18 3L18.8 5.2L21 6L18.8 6.8L18 9L17.2 6.8L15 6L17.2 5.2L18 3Z" />
                <path d="M6 16L6.6 17.8L8.4 18.4L6.6 19L6 20.8L5.4 19L3.6 18.4L5.4 17.8L6 16Z" />
              </svg>
              INTELLIGENCE-DRIVEN
            </h4>
            <h1 className=" hero-title ">
              Design your <p className="hero-highlight">trajectory.</p>
            </h1>
            <h3 className="hero-desc w-[60%]">
              Start your AI-powered career journey with the HireMind. We don't
              just build resumes, we engineer professional evolution.
            </h3>
            <div className=" mt-8 ml-8 bg-slate-100 w-[60%] p-4 flex flex-col rounded-2xl">
              <h5 className="text-[#059669] text-sm text-left font-semibold italic">
                AI INSIGHT
              </h5>
              <p className="text-sm text-left font-semibold italic text-slate-400 tracking-tight leading-tight mt-1.5">
                "Top 3% of candidates in Architecture & Engineering now
                leaverage genrative modeling for career pathing. Your journey
                begins here."
              </p>
            </div>
          </div>
        </div>
        <div className="flex-1 mt-12">
          <div className="card w-[70%] mx-auto space-y-6">
            <div className="text-center space-y-2">
              <div className="text-3xl font-extrabold">Create your account</div>
              <div className="text-sm text-muted-foreground">
                Enter your professional details to get started.
              </div>
            </div>

            <div className="flex gap-4">
              <div className="social-btn flex-1">Google</div>
              <div className="social-btn flex-1">LinkedIn</div>
            </div>

            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <div className="flex-1 h-0.5 bg-border"></div>
              OR CONTINUE WITH
              <div className="flex-1 h-0.5 bg-border"></div>
            </div>

            <form className="space-y-5" onSubmit={(e) => handleSubmit(e)}>
              <div className="flex flex-col items-start">
                <label htmlFor="username" className="label">
                  USERNAME
                </label>
                <input
                  className="input"
                  name="username"
                  type="text"
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Alexandria Mercer"
                />
              </div>

              <div className="flex flex-col items-start">
                <label htmlFor="email" className="label">
                  EMAIL ADDRESS
                </label>
                <input
                  className="input"
                  name="email"
                  type="email"
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@kinetic.ai"
                />
              </div>

              <div className="flex flex-col items-start">
                <label htmlFor="password" className="label">
                  PASSWORD
                </label>
                <div className="relative w-full">
                  <input
                    type="password"
                    name="password"
                    onChange={(e) => setPassword(e.target.value)}
                    className="input pr-10"
                    placeholder="••••••••"
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground cursor-pointer">
                    👁️
                  </span>
                </div>
              </div>

              <button className="btn-primary mt-2">Get Started</button>
            </form>

            <div className="footer-text text-center">
              By signing up, you agree to our{" "}
              <span className="footer-link font-medium cursor-pointer">
                Terms of Service
              </span>{" "}
              and{" "}
              <span className="footer-link font-medium cursor-pointer">
                AI Ethics Policy
              </span>
              .
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
export default Register;
