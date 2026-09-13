import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, Lock, Mail } from "lucide-react";
import { useCustomerAuth } from "../../context/CustomerAuthContext";

const CustomerLoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { login } = useCustomerAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const redirectTo = location.state?.from || "/order-online";

  const getErrorMessage = (err) => {
    if (!err) {
      return "Unable to sign in. Please try again.";
    }

    if (typeof err === "string") {
      return err;
    }

    if (typeof err.message === "string") {
      return err.message;
    }

    if (typeof err.detail === "string") {
      return err.detail;
    }

    if (Array.isArray(err.detail)) {
      return (
        err.detail[0]?.msg ||
        "Please check your email and password."
      );
    }

    if (err.detail && typeof err.detail === "object") {
      return (
        err.detail.message ||
        err.detail.msg ||
        "Unable to sign in. Please try again."
      );
    }

    return "Unable to sign in. Please try again.";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setLoading(true);

    try {
      await login(email.trim(), password);

      navigate(redirectTo, {
        replace: true,
      });
    } catch (err) {
      console.error("Customer login error:", err);

      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-dark-950 text-ivory-100 flex items-center justify-center px-5 py-24">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-brand-400 text-[10px] uppercase tracking-[0.3em] font-semibold mb-4">
            Atulyam Restaurant
          </p>

          <h1 className="font-serif text-4xl sm:text-5xl mb-4">
            Welcome Back
          </h1>

          <p className="text-ivory-500 text-sm leading-relaxed">
            Sign in to continue your dining journey with Atulyam.
          </p>
        </div>

        {/* Card */}
        <div className="bg-dark-900 border border-white/10 p-7 sm:p-9">

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* Error */}
            {error && (
              <div className="border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-xs uppercase tracking-widest text-ivory-400 mb-2">
                Email Address
              </label>

              <div className="relative">
                <Mail
                  size={17}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-ivory-600"
                />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder="Enter your email"
                  required
                  autoComplete="email"
                  className="w-full bg-dark-950 border border-white/10 px-11 py-3.5 text-sm text-ivory-100 outline-none transition focus:border-brand-500/60 placeholder:text-ivory-700"
                />
              </div>
            </div>
{/* Password */}
<div>
  <label className="block text-xs uppercase tracking-widest text-ivory-400 mb-2">
    Password
  </label>

  <div className="relative">
    <Lock
      size={17}
      className="absolute left-4 top-1/2 -translate-y-1/2 text-ivory-600"
    />

    <input
      type="password"
      value={password}
      onChange={(e) => {
        setPassword(e.target.value);
        if (error) setError("");
      }}
      placeholder="Enter your password"
      required
      minLength={8}
      autoComplete="current-password"
      className="w-full bg-dark-950 border border-white/10 px-11 py-3.5 text-sm text-ivory-100 outline-none transition focus:border-brand-500/60 placeholder:text-ivory-700"
    />
  </div>

  <p className="text-[10px] text-ivory-700 mt-2">
    Password must be at least 8 characters.
  </p>
</div>

{/* Submit */}
<button
  type="submit"
  disabled={loading}
  className="w-full bg-brand-500 hover:bg-brand-400 disabled:opacity-60 disabled:cursor-not-allowed text-dark-950 font-semibold text-sm py-3.5 flex items-center justify-center gap-2 transition"
>
  {loading ? "Signing In..." : "Sign In"}

  {!loading && (
    <ArrowRight size={17} />
  )}
</button>
</form>

          {/* Signup */}
          <div className="border-t border-white/10 mt-7 pt-6 text-center">
            <p className="text-sm text-ivory-500">
              Don't have an account?{" "}
              <Link
                to="/customer/signup"
                className="text-brand-400 hover:text-brand-300 transition font-medium"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>

        {/* Back */}
        <div className="text-center mt-6">
          <Link
            to="/"
            className="text-xs uppercase tracking-widest text-ivory-600 hover:text-brand-400 transition"
          >
            ← Back to Atulyam
          </Link>
        </div>

      </div>
    </main>
  );
};

export default CustomerLoginPage;