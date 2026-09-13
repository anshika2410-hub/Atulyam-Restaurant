import React, { useEffect, useState } from "react";
import {
  User,
  Mail,
  Phone,
  CalendarDays,
  Pencil,
  Check,
  X,
  ClipboardList,
  MapPin,
  LogOut,
  ArrowRight,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { useCustomerAuth } from "../../context/CustomerAuthContext.jsx";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:8000/api/v1";

const CustomerProfilePage = () => {
  const navigate = useNavigate();

  const {
    customer,
    token,
    logout,
  } = useCustomerAuth();

  const [editing, setEditing] = useState(false);

  const [name, setName] = useState(
    customer?.name || ""
  );

  const [phone, setPhone] = useState(
    customer?.phone || ""
  );

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (customer) {
      setName(customer.name || "");
      setPhone(customer.phone || "");
    }
  }, [customer]);

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }
    );
  };

  const getInitial = () => {
    return (
      customer?.name
        ?.trim()
        ?.charAt(0)
        ?.toUpperCase() || "A"
    );
  };

  const handleEdit = () => {
    setSuccess("");
    setError("");
    setEditing(true);
  };

  const handleCancel = () => {
    setName(customer?.name || "");
    setPhone(customer?.phone || "");
    setError("");
    setSuccess("");
    setEditing(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();

    if (trimmedName.length < 2) {
      setError(
        "Please enter your full name."
      );
      return;
    }

    if (
      trimmedPhone &&
      !/^\d{10}$/.test(trimmedPhone)
    ) {
      setError(
        "Please enter a valid 10-digit phone number."
      );
      return;
    }

    if (!token) {
      setError(
        "Your session has expired. Please sign in again."
      );
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(
        `${API_URL}/customer-auth/me`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: trimmedName,
            phone: trimmedPhone || null,
          }),
        }
      );

      const data =
        await response.json().catch(
          () => null
        );

      if (!response.ok) {
        throw new Error(
          data?.detail ||
            "Unable to update your profile."
        );
      }

      localStorage.setItem(
        "atulyam_customer",
        JSON.stringify(data)
      );

      window.dispatchEvent(
        new Event("customer-auth-changed")
      );

      setSuccess(
        "Your profile has been updated successfully."
      );

      setEditing(false);
    } catch (err) {
      console.error(
        "Profile update error:",
        err
      );

      setError(
        err.message ||
          "Unable to update your profile. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (!customer) {
    return (
      <main className="min-h-screen bg-dark-950 text-ivory-100 flex items-center justify-center px-5">
        <div className="text-center">
          <p className="text-brand-400 text-xs uppercase tracking-[0.25em] mb-4">
            Atulyam Restaurant
          </p>

          <h1 className="font-serif text-3xl mb-5">
            Please Sign In
          </h1>

          <Link
            to="/customer/login"
            className="inline-flex items-center gap-2 bg-brand-500 text-dark-950 px-6 py-3 text-sm font-semibold"
          >
            Sign In
            <ArrowRight size={16} />
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-dark-950 text-ivory-100 pt-[100px] pb-20 px-5 sm:px-7">

      <div className="max-w-5xl mx-auto">

        {/* =====================================================
            PAGE INTRO
        ====================================================== */}

        <div className="mb-10">
          <p className="text-brand-400 text-[10px] uppercase tracking-[0.3em] font-semibold mb-3">
            Your Account
          </p>

          <h1 className="font-serif text-4xl sm:text-5xl text-ivory-100">
            My Profile
          </h1>

          <p className="text-sm text-ivory-500 mt-3 max-w-xl leading-relaxed">
            Manage your personal information and
            keep your Atulyam account up to date.
          </p>
        </div>

        {/* =====================================================
            SUCCESS / ERROR
        ====================================================== */}

        {success && (
          <div className="mb-5 border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-300 flex items-center gap-2">
            <Check size={16} />
            {success}
          </div>
        )}

        {error && (
          <div className="mb-5 border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* =====================================================
            PROFILE CARD
        ====================================================== */}

        <div className="grid lg:grid-cols-[1fr_300px] gap-6">

          {/* MAIN PROFILE */}

          <section className="bg-dark-900 border border-white/10">

            {/* Profile Header */}

            <div className="px-6 sm:px-8 py-7 border-b border-white/10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">

                <div className="flex items-center gap-4">

                  <div className="w-16 h-16 rounded-full bg-brand-500/10 border border-brand-500/30 flex items-center justify-center shrink-0">
                    <span className="font-serif text-2xl text-brand-400">
                      {getInitial()}
                    </span>
                  </div>

                  <div className="min-w-0">
                    <h2 className="text-xl font-medium text-white truncate">
                      {customer.name}
                    </h2>

                    <p className="text-xs text-ivory-600 mt-1 truncate">
                      {customer.email}
                    </p>
                  </div>

                </div>

                {!editing && (
                  <button
                    type="button"
                    onClick={handleEdit}
                    className="inline-flex items-center justify-center gap-2 border border-white/10 hover:border-brand-500/40 hover:text-brand-400 text-ivory-300 px-4 py-2.5 text-xs transition"
                  >
                    <Pencil size={14} />
                    Edit Profile
                  </button>
                )}

              </div>
            </div>

            {/* Profile Details */}

            {!editing ? (
              <div className="px-6 sm:px-8 py-7">

                <div className="grid sm:grid-cols-2 gap-5">

                  {/* Name */}

                  <div className="border border-white/[0.07] bg-dark-950/60 p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <User
                        size={16}
                        className="text-brand-400"
                      />

                      <span className="text-[10px] uppercase tracking-[0.18em] text-ivory-600">
                        Full Name
                      </span>
                    </div>

                    <p className="text-sm text-white">
                      {customer.name || "Not provided"}
                    </p>
                  </div>

                  {/* Email */}

                  <div className="border border-white/[0.07] bg-dark-950/60 p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <Mail
                        size={16}
                        className="text-brand-400"
                      />

                      <span className="text-[10px] uppercase tracking-[0.18em] text-ivory-600">
                        Email Address
                      </span>
                    </div>

                    <p className="text-sm text-white break-all">
                      {customer.email}
                    </p>
                  </div>

                  {/* Phone */}

                  <div className="border border-white/[0.07] bg-dark-950/60 p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <Phone
                        size={16}
                        className="text-brand-400"
                      />

                      <span className="text-[10px] uppercase tracking-[0.18em] text-ivory-600">
                        Phone Number
                      </span>
                    </div>

                    <p className="text-sm text-white">
                      {customer.phone ||
                        "Not provided"}
                    </p>
                  </div>

                  {/* Joined */}

                  <div className="border border-white/[0.07] bg-dark-950/60 p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <CalendarDays
                        size={16}
                        className="text-brand-400"
                      />

                      <span className="text-[10px] uppercase tracking-[0.18em] text-ivory-600">
                        Member Since
                      </span>
                    </div>

                    <p className="text-sm text-white">
                      {formatDate(
                        customer.created_at
                      )}
                    </p>
                  </div>

                </div>

              </div>
            ) : (

              /* =================================================
                 EDIT FORM
              ================================================= */

              <form
                onSubmit={handleSave}
                className="px-6 sm:px-8 py-7"
              >

                <div className="grid sm:grid-cols-2 gap-5">

                  {/* Name */}

                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.18em] text-ivory-500 mb-2">
                      Full Name
                    </label>

                    <div className="relative">
                      <User
                        size={16}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-ivory-600"
                      />

                      <input
                        type="text"
                        value={name}
                        onChange={(e) => {
                          setName(
                            e.target.value
                          );
                          setError("");
                        }}
                        className="w-full bg-dark-950 border border-white/10 focus:border-brand-500/50 outline-none text-sm text-white px-11 py-3.5 transition"
                        placeholder="Enter your name"
                        autoComplete="name"
                      />
                    </div>
                  </div>

                  {/* Email */}

                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.18em] text-ivory-500 mb-2">
                      Email Address
                    </label>

                    <div className="relative">
                      <Mail
                        size={16}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-ivory-600"
                      />

                      <input
                        type="email"
                        value={customer.email}
                        disabled
                        className="w-full bg-dark-950/60 border border-white/[0.07] text-ivory-600 px-11 py-3.5 text-sm cursor-not-allowed"
                      />
                    </div>

                    <p className="text-[10px] text-ivory-700 mt-2">
                      Email address cannot be changed here.
                    </p>
                  </div>

                  {/* Phone */}

                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.18em] text-ivory-500 mb-2">
                      Phone Number
                    </label>

                    <div className="relative">
                      <Phone
                        size={16}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-ivory-600"
                      />

                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => {
                          const value =
                            e.target.value
                              .replace(
                                /\D/g,
                                ""
                              )
                              .slice(0, 10);

                          setPhone(value);
                          setError("");
                        }}
                        className="w-full bg-dark-950 border border-white/10 focus:border-brand-500/50 outline-none text-sm text-white px-11 py-3.5 transition"
                        placeholder="10-digit phone number"
                        inputMode="numeric"
                        autoComplete="tel"
                      />
                    </div>
                  </div>

                </div>

                {/* Buttons */}

                <div className="flex flex-col sm:flex-row gap-3 mt-7 pt-6 border-t border-white/10">

                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-400 disabled:opacity-60 text-dark-950 font-semibold text-sm px-6 py-3.5 transition"
                  >
                    <Check size={16} />

                    {saving
                      ? "Saving..."
                      : "Save Changes"}
                  </button>

                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={saving}
                    className="inline-flex items-center justify-center gap-2 border border-white/10 hover:border-white/20 text-ivory-300 text-sm px-6 py-3.5 transition"
                  >
                    <X size={16} />
                    Cancel
                  </button>

                </div>

              </form>
            )}
          </section>

          {/* ===================================================
              QUICK ACTIONS
          ==================================================== */}

          <aside className="space-y-4">

            {/* Orders */}

            <Link
              to="/customer/orders"
              className="group block bg-dark-900 border border-white/10 p-5 hover:border-brand-500/30 transition"
            >
              <div className="flex items-center justify-between mb-5">
                <div className="w-10 h-10 rounded-full bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
                  <ClipboardList
                    size={17}
                    className="text-brand-400"
                  />
                </div>

                <ArrowRight
                  size={16}
                  className="text-ivory-600 group-hover:text-brand-400 group-hover:translate-x-1 transition"
                />
              </div>

              <h3 className="text-sm text-white font-medium">
                My Orders
              </h3>

              <p className="text-xs text-ivory-600 mt-1 leading-relaxed">
                View your orders and track their
                status.
              </p>
            </Link>

            {/* Addresses */}

            <Link
              to="/customer/addresses"
              className="group block bg-dark-900 border border-white/10 p-5 hover:border-brand-500/30 transition"
            >
              <div className="flex items-center justify-between mb-5">
                <div className="w-10 h-10 rounded-full bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
                  <MapPin
                    size={17}
                    className="text-brand-400"
                  />
                </div>

                <ArrowRight
                  size={16}
                  className="text-ivory-600 group-hover:text-brand-400 group-hover:translate-x-1 transition"
                />
              </div>

              <h3 className="text-sm text-white font-medium">
                Delivery Address
              </h3>

              <p className="text-xs text-ivory-600 mt-1 leading-relaxed">
                Manage your saved delivery
                addresses.
              </p>
            </Link>

            {/* Logout */}

            <button
              type="button"
              onClick={handleLogout}
              className="w-full group flex items-center gap-3 bg-dark-900 border border-white/10 p-5 text-left hover:border-red-500/30 transition"
            >
              <div className="w-10 h-10 rounded-full bg-red-500/5 border border-red-500/15 flex items-center justify-center">
                <LogOut
                  size={16}
                  className="text-red-400"
                />
              </div>

              <div>
                <h3 className="text-sm text-red-400 font-medium">
                  Logout
                </h3>

                <p className="text-xs text-ivory-700 mt-1">
                  Sign out of your account
                </p>
              </div>
            </button>

          </aside>
        </div>

      </div>
    </main>
  );
};

export default CustomerProfilePage;