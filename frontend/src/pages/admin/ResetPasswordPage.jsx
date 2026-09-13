import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff, ArrowLeft, CheckCircle2 } from "lucide-react";

const API_URL =
  import.meta.env.VITE_API_URL ;

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!token) {
      setError("This password reset link is invalid.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/auth/reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token,
            new_password: password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.detail || "Unable to reset password."
        );
      }

      setSuccess(true);

      setTimeout(() => {
        navigate("/admin/login");
      }, 2500);
    } catch (err) {
      setError(
        err.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-5 py-10">
      <div className="w-full max-w-[480px]">

        <div className="text-center mb-10">
          <Link
            to="/admin/login"
            className="inline-block text-white/50 hover:text-[#f28a2e] transition-colors text-[10px] uppercase tracking-[0.25em] mb-10"
          >
            <span className="inline-flex items-center gap-2">
              <ArrowLeft size={14} />
              Back to Login
            </span>
          </Link>

          <p className="text-[#f28a2e] text-[10px] uppercase tracking-[0.35em] mb-4">
            Atulyam Luxury Fine Dining
          </p>

          <h1 className="font-serif text-4xl md:text-5xl">
            Create a new <span className="italic text-[#f28a2e]">password.</span>
          </h1>

          <p className="text-white/40 text-sm mt-4 leading-6">
            Choose a strong password for your administrator account.
          </p>
        </div>

        <div className="border border-white/10 bg-[#080808] p-7 md:p-10">

          {success ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto rounded-full border border-[#f28a2e]/40 flex items-center justify-center mb-6">
                <CheckCircle2
                  size={28}
                  className="text-[#f28a2e]"
                />
              </div>

              <p className="text-[#f28a2e] text-[10px] uppercase tracking-[0.3em] mb-3">
                Password Updated
              </p>

              <h2 className="font-serif text-2xl">
                You're all set.
              </h2>

              <p className="text-white/40 text-sm mt-3">
                Redirecting you to admin login...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">

              {error && (
                <div className="border border-red-500/20 bg-red-500/5 px-4 py-3 text-red-400 text-xs leading-5">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-white/50 text-[9px] uppercase tracking-[0.2em] mb-3">
                  New Password
                </label>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full h-12 bg-transparent border border-white/15 px-4 pr-12 text-sm text-white outline-none focus:border-[#f28a2e] transition-colors"
                    required
                    minLength={8}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white"
                  >
                    {showPassword ? (
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-white/50 text-[9px] uppercase tracking-[0.2em] mb-3">
                  Confirm Password
                </label>

                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) =>
                      setConfirmPassword(e.target.value)
                    }
                    placeholder="Confirm new password"
                    className="w-full h-12 bg-transparent border border-white/15 px-4 pr-12 text-sm text-white outline-none focus:border-[#f28a2e] transition-colors"
                    required
                    minLength={8}
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white"
                  >
                    {showConfirm ? (
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}
                  </button>
                </div>
              </div>

              <p className="text-white/25 text-[10px] leading-5">
                Password must contain at least 8 characters.
              </p>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-[#f28a2e] text-black text-[10px] uppercase tracking-[0.25em] font-medium hover:bg-white transition-colors disabled:opacity-50"
              >
                {loading ? "Updating..." : "Reset Password"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}