import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LockKeyhole,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  Mail,
  X,
  Check,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:8000/api/v1";
const ease = [0.22, 1, 0.36, 1];

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [forgotError, setForgotError] = useState("");

  const [showForgot, setShowForgot] = useState(false);
  const [email, setEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);
const handleLogin = async (e) => {
  e.preventDefault();

  if (!username.trim() || !password.trim()) {
    setError("Please enter your username and password.");
    return;
  }

  try {
    setLoading(true);
    setError("");

    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username.trim(),
        password,
      }),
    });

    const data = await response.json();

if (!response.ok) {
  if (Array.isArray(data?.detail)) {
    const passwordError = data.detail.find(
      (item) =>
        item?.loc?.includes("password") ||
        item?.loc?.includes("new_password")
    );

    if (passwordError) {
      throw new Error("Password must be at least 8 characters.");
    }
  }

  const message =
    typeof data?.detail === "string"
      ? data.detail
      : "Invalid username or password.";

  throw new Error(message);
}
    // Backend must return access_token
    if (!data?.access_token) {
      throw new Error("Login failed. Authentication token not received.");
    }

    // Save the REAL token and admin data
    login(
      data.access_token,
      data.admin || data.user || {
        username: username.trim(),
      }
    );

    navigate("/admin");
  } catch (err) {
    setError(
      err?.message ||
        "Invalid username or password. Please try again."
    );
  } finally {
    setLoading(false);
  }
};
const handleForgotPassword = async (e) => {
  e.preventDefault();

  if (!email.trim()) {
    setForgotError("Please enter your registered email address.");
    return;
  }

  try {
    setLoading(true);
    setForgotError("");
    setResetSent(false);

    const response = await fetch(
      `${API_URL}/auth/forgot-password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        typeof data?.detail === "string"
          ? data.detail
          : "Unable to process your request."
      );
    }

    setResetSent(true);
  } catch (err) {
    setForgotError(
      err?.message ||
        "Unable to send password reset instructions."
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <main className="min-h-screen bg-[#050505] text-white relative overflow-hidden flex items-center justify-center px-5 py-10">

      {/* BACKGROUND */}

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[#f28a2e]/[0.035] blur-[120px]" />

        <div className="absolute bottom-[-25%] right-[-10%] w-[450px] h-[450px] rounded-full bg-[#f28a2e]/[0.025] blur-[120px]" />
      </div>

      {/* MAIN */}

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease }}
        className="relative z-10 w-full max-w-[480px]"
      >

        {/* BRAND */}

        <div className="text-center mb-9">

          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.6,
              delay: 0.1,
              ease,
            }}
            className="mx-auto mb-7 w-[70px] h-[70px] rounded-full border border-[#f28a2e]/40 bg-[#0c0c0c] flex items-center justify-center shadow-[0_0_50px_rgba(242,138,46,0.08)]"
          >
            <LockKeyhole
              size={27}
              strokeWidth={1.4}
              className="text-[#f28a2e]"
            />
          </motion.div>

          <p className="text-[#f28a2e] text-[9px] uppercase tracking-[0.45em] mb-4">
            Atulyam Restaurant
          </p>

          <h1 className="font-serif text-5xl md:text-6xl leading-none tracking-[-0.045em]">
            Admin{" "}
            <span className="italic text-[#f28a2e]">
              Portal
            </span>
          </h1>

          <p className="text-white/35 text-sm mt-5">
            Manage your restaurant from one place.
          </p>

        </div>

        {/* LOGIN CARD */}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.7,
            delay: 0.2,
            ease,
          }}
          className="relative bg-[#0d0d0d] border border-white/[0.09] p-7 md:p-9 shadow-2xl"
        >

          {/* TOP LINE */}

          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#f28a2e]/60 to-transparent" />

          <div className="flex items-center justify-between mb-8">

            <div>
              <p className="text-white text-sm font-medium">
                Welcome back
              </p>

              <p className="text-white/25 text-[10px] uppercase tracking-[0.18em] mt-1">
                Secure administrator access
              </p>
            </div>

            <div className="w-2 h-2 rounded-full bg-[#f28a2e] shadow-[0_0_12px_rgba(242,138,46,0.7)]" />

          </div>

          <form onSubmit={handleLogin} className="space-y-5">

            {/* USERNAME */}

            <div>
              <label className="block text-white/35 text-[9px] uppercase tracking-[0.25em] mb-2.5">
                Username
              </label>

              <div className="relative group">

                <User
                  size={16}
                  strokeWidth={1.5}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25 group-focus-within:text-[#f28a2e] transition-colors"
                />

                <input
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setError("");
                  }}
                  placeholder="Enter username"
                  autoComplete="username"
                  className="w-full h-12 bg-black border border-white/10 pl-11 pr-4 text-sm text-white placeholder:text-white/20 outline-none focus:border-[#f28a2e]/60 focus:bg-[#0a0a0a] transition-all"
                />

              </div>
            </div>

            {/* PASSWORD */}

            <div>
              <div className="flex items-center justify-between mb-2.5">

                <label className="text-white/35 text-[9px] uppercase tracking-[0.25em]">
                  Password
                </label>

                <button
                  type="button"
                  onClick={() => {
  setShowForgot(true);
  setForgotError("");
  setError("");
  setResetSent(false);
}}
                  className="text-[#f28a2e]/80 hover:text-[#f28a2e] text-[9px] uppercase tracking-[0.14em] transition-colors"
                >
                  Forgot Password?
                </button>

              </div>

              <div className="relative group">

                <LockKeyhole
                  size={16}
                  strokeWidth={1.5}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25 group-focus-within:text-[#f28a2e] transition-colors"
                />

                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  placeholder="Enter password"
                  autoComplete="current-password"
                  className="w-full h-12 bg-black border border-white/10 pl-11 pr-12 text-sm text-white placeholder:text-white/20 outline-none focus:border-[#f28a2e]/60 focus:bg-[#0a0a0a] transition-all"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((prev) => !prev)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-white/25 hover:text-white transition-colors"
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff size={17} />
                  ) : (
                    <Eye size={17} />
                  )}
                </button>

              </div>
            </div>

            {/* ERROR */}

            <AnimatePresence>
              {error && !showForgot &&  (
                <motion.div
                  initial={{
                    opacity: 0,
                    height: 0,
                  }}
                  animate={{
                    opacity: 1,
                    height: "auto",
                  }}
                  exit={{
                    opacity: 0,
                    height: 0,
                  }}
                  className="overflow-hidden"
                >
                  <div className="border border-red-500/20 bg-red-500/[0.04] px-4 py-3">
                    <p className="text-red-400/80 text-xs">
                      {error}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* SIGN IN */}

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full h-12 bg-[#f28a2e] text-black flex items-center justify-center gap-3 text-[10px] uppercase tracking-[0.28em] font-semibold overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white transition-colors duration-300"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Signing In
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight
                    size={16}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </>
              )}
            </button>

          </form>

          {/* SECURITY */}

          <div className="mt-7 pt-6 border-t border-white/[0.06] flex items-center justify-between">

            <span className="text-white/20 text-[8px] uppercase tracking-[0.2em]">
              Secure Access
            </span>

            <span className="flex items-center gap-2 text-white/20 text-[8px] uppercase tracking-[0.15em]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/70" />
              Protected
            </span>

          </div>

        </motion.div>

        {/* FOOTER */}

        <p className="text-center text-white/15 text-[8px] uppercase tracking-[0.3em] mt-7">
          Authorized access only
        </p>

      </motion.div>

      {/* =====================================================
          FORGOT PASSWORD MODAL
      ===================================================== */}

      <AnimatePresence>
        {showForgot && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
  setShowForgot(false);
  setResetSent(false);
  setForgotError("");
}}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-5"
          >

            <motion.div
              initial={{
                opacity: 0,
                y: 25,
                scale: 0.97,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                y: 20,
                scale: 0.97,
              }}
              transition={{ duration: 0.35, ease }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md bg-[#0d0d0d] border border-white/10 p-7 md:p-9"
            >

              <button
                type="button"
               onClick={() => {
  setShowForgot(false);
  setResetSent(false);
  setForgotError("");
}}
                className="absolute top-4 right-4 w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-white/35 hover:text-white hover:bg-white/5 transition-all"
              >
                <X size={16} />
              </button>

              {!resetSent ? (
                <>
                  <div className="w-12 h-12 rounded-full border border-[#f28a2e]/30 flex items-center justify-center mb-6">
                    <Mail
                      size={19}
                      className="text-[#f28a2e]"
                    />
                  </div>

                  <p className="text-[#f28a2e] text-[9px] uppercase tracking-[0.3em]">
                    Account Recovery
                  </p>

                  <h2 className="font-serif text-3xl md:text-4xl mt-3">
                    Forgot your{" "}
                    <span className="italic text-[#f28a2e]">
                      password?
                    </span>
                  </h2>

                  <p className="text-white/35 text-sm leading-6 mt-4">
                    Enter your registered email address and
                    we'll send you instructions to reset your
                    password.
                  </p>

                  <form
                    onSubmit={handleForgotPassword}
                    className="mt-7"
                  >
                    <label className="block text-white/35 text-[9px] uppercase tracking-[0.25em] mb-2.5">
                      Email Address
                    </label>

                    <div className="relative">
                      <Mail
                        size={16}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25"
                      />

                      <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setForgotError("");
                        }}
                        placeholder="admin@example.com"
                        required
                        className="w-full h-12 bg-black border border-white/10 pl-11 pr-4 text-sm text-white placeholder:text-white/20 outline-none focus:border-[#f28a2e]/60 transition-all"
                      />
                    </div>

                   {forgotError && (
                    <div className="mt-3 border border-red-500/20 bg-red-500/[0.04] px-4 py-3">
                      <p className="text-red-400/80 text-xs leading-5">
                        {forgotError}
                      </p>
                    </div>
                  )}
                    <button
                      type="submit"
                      className="w-full h-12 mt-4 bg-[#f28a2e] text-black text-[10px] uppercase tracking-[0.25em] font-semibold hover:bg-white transition-colors flex items-center justify-center gap-2"
                    >
                      Send Reset Instructions
                      <ArrowRight size={15} />
                    </button>
                  </form>
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-5"
                >
                  <div className="w-14 h-14 rounded-full border border-[#f28a2e]/40 flex items-center justify-center mx-auto mb-6">
                    <Check
                      size={24}
                      className="text-[#f28a2e]"
                    />
                  </div>

                  <p className="text-[#f28a2e] text-[9px] uppercase tracking-[0.3em]">
                    Request Sent
                  </p>

                  <h2 className="font-serif text-3xl mt-3">
                    Check your{" "}
                    <span className="italic text-[#f28a2e]">
                      inbox.
                    </span>
                  </h2>

                  <p className="text-white/35 text-sm leading-6 mt-4">
                    If an account exists for this email,
                    password reset instructions will be sent
                    shortly.
                  </p>

                  <button
                    type="button"
                    onClick={() => {
  setShowForgot(false);
  setResetSent(false);
  setForgotError("");
  setEmail("");
}}
                    className="mt-7 h-11 px-7 border border-white/15 text-[9px] uppercase tracking-[0.2em] hover:bg-[#f28a2e] hover:text-black hover:border-[#f28a2e] transition-all"
                  >
                    Back To Login
                  </button>
                </motion.div>
              )}

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </main>
  );
};

export default AdminLoginPage;