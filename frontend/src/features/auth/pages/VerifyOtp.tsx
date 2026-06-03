import { useState, useEffect } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { verifyOtp, resendOtp } from "../services/auth.service";
import { useAuth } from "../hooks/useAuth";

const VerifyOtp = () => {
  const navigate = useNavigate();
  const { email } = useSearch({ from: "/verify-otp" });
  const { setUser } = useAuth();

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (!email) navigate({ to: "/register" });
  }, [email, navigate]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    if (otp.length !== 6) {
      setError("Please enter the full 6-digit code");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await verifyOtp({ email, otp });
      setUser(data.user);
      navigate({ to: "/dashboard" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    if (cooldown > 0) return;
    setError(null);
    try {
      await resendOtp(email);
      setSuccess("New code sent! Check your email.");
      setCooldown(60);
      setTimeout(() => setSuccess(null), 4000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to resend");
    }
  }

  return (
    <main className="min-h-screen flex flex-col justify-between bg-background text-foreground">
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-black tracking-tight">
              <span className="text-foreground">Hire</span>
              <span className="text-primary">Mind</span>
            </h1>
          </div>

          <div className="card space-y-6">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto text-2xl">
                ✉️
              </div>
              <h2 className="text-xl font-bold">Check your email</h2>
              <p className="text-sm text-muted-foreground">
                We sent a 6-digit verification code to
              </p>
              <p className="text-sm font-semibold text-primary">{email}</p>
            </div>

            <form onSubmit={handleVerify} className="space-y-5">
              <div className="flex flex-col gap-1">
                <label className="label">VERIFICATION CODE</label>
                <input
                  className="input text-center text-2xl font-bold tracking-[0.5em]"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "");
                    setOtp(val);
                    setError(null);
                  }}
                  placeholder="000000"
                  autoFocus
                />
              </div>

              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}
              {success && (
                <p className="text-green-600 text-sm text-center">{success}</p>
              )}

              <button
                className="btn-primary rounded-xl py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading || otp.length !== 6}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="loader" />
                  </div>
                ) : (
                  "Verify Email →"
                )}
              </button>
            </form>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Didn't receive the code?{" "}
                <button
                  onClick={handleResend}
                  disabled={cooldown > 0}
                  className="text-primary font-semibold hover:underline disabled:opacity-50 disabled:cursor-not-allowed
  disabled:no-underline"
                >
                  {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend"}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>

      <footer className="flex justify-between items-center px-10 py-4 text-xs text-muted-foreground border-t border-border">
        <div>
          <p className="font-medium text-foreground">
            <span className="text-foreground">Hire</span>
            <span className="text-primary">Mind</span>
          </p>
          <p>
            © {new Date().getFullYear()} HireMind. Intelligence-driven career
            growth.
          </p>
        </div>
        <div className="flex gap-6">
          <span className="cursor-pointer">Privacy Policy</span>
          <span className="cursor-pointer">Support</span>
        </div>
      </footer>
    </main>
  );
};

export default VerifyOtp;
