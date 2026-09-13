import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Lock,
  Mail,
  Phone,
  User,
} from "lucide-react";
import { useCustomerAuth } from "../../context/CustomerAuthContext";

const CustomerSignupPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { signup } = useCustomerAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const redirectTo =
    location.state?.from || "/order-online";

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      await signup(
        form.name,
        form.email,
        form.phone,
        form.password
      );

      navigate(redirectTo, {
        replace: true,
      });
    } catch (err) {
      setError(
        err.message ||
          "Unable to create your account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0B0B0C] text-ivory-100 flex items-center justify-center px-5 py-16 sm:py-20">

      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">

          <p className="text-brand-400 text-[10px] uppercase tracking-[0.3em] font-semibold mb-4">
            Atulyam Restaurant
          </p>

          <h1 className="font-serif text-4xl sm:text-5xl mb-3">
            Create Your Account
          </h1>

          <p className="text-ivory-500 text-sm leading-relaxed">
            Join Atulyam and make your next order effortless.
          </p>

        </div>

        {/* Card */}
        <div className="bg-[#111112] border border-white/10 p-6 sm:p-8">

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >

            {/* Error */}
            {error && (
              <div className="border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            {/* Name */}
            <div>
              <label className="block text-xs uppercase tracking-widest text-ivory-400 mb-2">
                Full Name
              </label>

              <div className="relative">
                <User
                  size={17}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-ivory-600"
                />

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  required
                  minLength={2}
                  autoComplete="name"
                  className="w-full bg-dark-950 border border-white/10 px-11 py-3.5 text-sm text-ivory-100 outline-none transition focus:border-brand-500/60 placeholder:text-ivory-700"
                />
              </div>
            </div>

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
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                  autoComplete="email"
                  className="w-full bg-dark-950 border border-white/10 px-11 py-3.5 text-sm text-ivory-100 outline-none transition focus:border-brand-500/60 placeholder:text-ivory-700"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs uppercase tracking-widest text-ivory-400 mb-2">
                Phone Number
              </label>

              <div className="relative">
                <Phone
                  size={17}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-ivory-600"
                />

                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  minLength={8}
                  autoComplete="tel"
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
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  className="w-full bg-dark-950 border border-white/10 px-11 py-3.5 text-sm text-ivory-100 outline-none transition focus:border-brand-500/60 placeholder:text-ivory-700"
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs uppercase tracking-widest text-ivory-400 mb-2">
                Confirm Password
              </label>

              <div className="relative">
                <Lock
                  size={17}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-ivory-600"
                />

                <input
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  className="w-full bg-dark-950 border border-white/10 px-11 py-3.5 text-sm text-ivory-100 outline-none transition focus:border-brand-500/60 placeholder:text-ivory-700"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-500 hover:bg-brand-400 disabled:opacity-60 disabled:cursor-not-allowed text-dark-950 font-semibold text-sm py-3.5 flex items-center justify-center gap-2 transition mt-2"
            >
              {loading ? "Creating Account..." : "Create Account"}

              {!loading && <ArrowRight size={17} />}
            </button>

          </form>

          {/* Login */}
          <div className="border-t border-white/10 mt-6 pt-5 text-center">

            <p className="text-sm text-ivory-500">
              Already have an account?{" "}
              <Link
                to="/customer/login"
                className="text-brand-400 hover:text-brand-300 transition font-medium"
              >
                Sign In
              </Link>
            </p>

          </div>

        </div>

        {/* Back */}
        <div className="text-center mt-5">
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

export default CustomerSignupPage;