import React, { useState, useEffect, useRef } from "react";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  motion,
  AnimatePresence,
} from "framer-motion";

import {
  ShoppingBag,
  Menu as MenuIcon,
  X,
  UtensilsCrossed,
  Phone,
  User,
  MapPin,
  ClipboardList,
  LogOut,
  ChevronDown,
  Navigation,
} from "lucide-react";

import { useCart } from "../../context/CartContext.jsx";
import { useCustomerAuth } from "../../context/CustomerAuthContext.jsx";
import { useCustomerAddress } from "../../context/CustomerAddressContext.jsx";
import Button from "../ui/Button.jsx";

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  const accountRef = useRef(null);

  const {
    cartCount,
    setIsCartOpen,
  } = useCart();

  const {
    customer,
    isAuthenticated,
    logout,
  } = useCustomerAuth();

  const {
    selectedAddress,
  } = useCustomerAddress();

  const location = useLocation();
  const navigate = useNavigate();

  /* =========================================================
     SCROLL
  ========================================================= */

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 25);
    };

    handleScroll();

    window.addEventListener(
      "scroll",
      handleScroll
    );

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, []);

  /* =========================================================
     CLOSE MENUS ON ROUTE CHANGE
  ========================================================= */

  useEffect(() => {
    setMobileOpen(false);
    setAccountOpen(false);
  }, [location.pathname]);

  /* =========================================================
     CLOSE DESKTOP ACCOUNT ON OUTSIDE CLICK
  ========================================================= */

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        accountRef.current &&
        !accountRef.current.contains(event.target)
      ) {
        setAccountOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  /* =========================================================
     NAV LINKS
  ========================================================= */

  const navLinks = [
    {
      name: "Home",
      path: "/",
    },
    {
      name: "About",
      path: "/about",
    },
    {
      name: "Menu",
      path: "/menu",
    },
    {
      name: "Catering",
      path: "/catering",
    },
    {
      name: "Gallery",
      path: "/gallery",
    },
    {
      name: "Contact",
      path: "/contact",
    },
  ];

  /* =========================================================
     HELPERS
  ========================================================= */

  const handleLogout = () => {
    logout();

    setAccountOpen(false);
    setMobileOpen(false);

    navigate("/");
  };

  const getFirstName = () => {
    if (!customer?.name) {
      return "Account";
    }

    return customer.name
      .trim()
      .split(" ")[0];
  };

  const getLocationText = () => {
    if (!selectedAddress) {
      return "Select Address";
    }

    if (selectedAddress.full_address) {
      const address =
        selectedAddress.full_address.trim();

      if (address.length > 22) {
        return `${address.slice(0, 22)}...`;
      }

      return address;
    }

    return (
      selectedAddress.city ||
      "Select Address"
    );
  };

  const loginRedirect =
    location.pathname +
    location.search;

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        isScrolled
          ? "bg-dark-950/90 backdrop-blur-xl border-b border-white/[0.08] shadow-2xl py-3.5"
          : "bg-gradient-to-b from-dark-950/80 via-dark-950/30 to-transparent py-5"
      }`}
    >
      <div className="w-full mx-auto px-5 sm:px-7 lg:px-10 xl:px-14">
        <div className="flex items-center justify-between gap-5 xl:gap-8">

          {/* =================================================
              LOGO
          ================================================= */}

          <Link
            to="/"
            className="flex items-center gap-2 sm:gap-3.5 group select-none min-w-0 shrink"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-brand-500/40 bg-dark-850 flex items-center justify-center shrink-0 group-hover:border-brand-400 group-hover:scale-105 transition-all duration-300 shadow-[0_0_15px_rgba(224,122,36,0.2)]">
              <UtensilsCrossed className="w-4 h-4 text-brand-500" />
            </div>

            <div className="flex flex-col min-w-0">
              <span className="font-serif text-[20px] sm:text-2xl xl:text-[26px] tracking-[0.16em] sm:tracking-[0.2em] uppercase text-ivory-100 font-normal leading-none">
                Atulyam
              </span>

              <span className="text-[7px] sm:text-[9px] uppercase tracking-[0.18em] sm:tracking-widest-xl text-brand-400 font-medium mt-1 whitespace-nowrap">
                Haute Indian Cuisine
              </span>
            </div>
          </Link>

          {/* =================================================
              DESKTOP NAV
          ================================================= */}

          <nav className="hidden lg:flex items-center gap-5 xl:gap-7 shrink-0">
            {navLinks.map((link) => {
              const isActive =
                location.pathname ===
                link.path;

              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-xs uppercase tracking-widest-xl font-medium transition-all duration-300 relative py-1.5 whitespace-nowrap ${
                    isActive
                      ? "text-brand-400 font-semibold"
                      : "text-ivory-300 hover:text-ivory-100"
                  }`}
                >
                  {link.name}

                  {isActive && (
                    <motion.span
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-brand-500 via-gold-500 to-brand-500 rounded-full shadow-glow"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* =================================================
              ACTIONS
          ================================================= */}

          <div className="flex items-center gap-1.5 sm:gap-2 xl:gap-3 shrink-0">

            {/* ===============================================
                DESKTOP PHONE
            =============================================== */}

            <a
              href="tel:+919876543210"
              className="hidden xl:inline-flex items-center gap-2 px-2 py-2 text-[10px] uppercase tracking-[0.14em] text-ivory-400 hover:text-brand-400 transition-colors whitespace-nowrap"
            >
              <Phone className="w-3.5 h-3.5 text-brand-500" />

              <span>
                +91 98765 43210
              </span>
            </a>

            {/* ===============================================
                DESKTOP LOCATION
            =============================================== */}

            <Link
              to="/customer/addresses"
              className="hidden lg:flex items-center gap-2 px-3 py-2 rounded-full border border-white/10 bg-dark-850/70 hover:border-brand-500/40 transition-all group max-w-[150px] xl:max-w-[175px]"
            >
              <MapPin className="w-3.5 h-3.5 text-brand-500 shrink-0" />

              <p className="text-[10px] text-ivory-300 group-hover:text-brand-400 transition-colors truncate whitespace-nowrap">
                {getLocationText()}
              </p>
            </Link>

            {/* ===============================================
                DESKTOP ACCOUNT
            =============================================== */}

            <div
              ref={accountRef}
              className="hidden lg:block relative"
            >
              {isAuthenticated ? (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setAccountOpen(
                        (prev) => !prev
                      );
                      setMobileOpen(false);
                    }}
                    className={`flex items-center gap-2 px-2.5 py-2 rounded-full border transition-all ${
                      accountOpen
                        ? "border-brand-500/50 bg-brand-500/10 text-brand-400"
                        : "border-white/10 bg-dark-850/80 text-ivory-200 hover:border-brand-500/40 hover:text-brand-400"
                    }`}
                    aria-label="Open customer account"
                    aria-expanded={
                      accountOpen
                    }
                  >
                    <span className="w-7 h-7 rounded-full bg-brand-500/10 border border-brand-500/30 flex items-center justify-center shrink-0">
                      <User className="w-3.5 h-3.5 text-brand-400" />
                    </span>

                    <span className="text-[11px] font-medium max-w-[60px] truncate">
                      {getFirstName()}
                    </span>

                    <ChevronDown
                      className={`w-3 h-3 transition-transform ${
                        accountOpen
                          ? "rotate-180"
                          : ""
                      }`}
                    />
                  </button>

                  {/* Desktop Dropdown */}

                  <AnimatePresence>
                    {accountOpen && (
                      <motion.div
                        initial={{
                          opacity: 0,
                          y: 8,
                          scale: 0.98,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                          scale: 1,
                        }}
                        exit={{
                          opacity: 0,
                          y: 8,
                          scale: 0.98,
                        }}
                        transition={{
                          duration: 0.18,
                        }}
                        className="absolute right-0 top-[calc(100%+12px)] w-[250px] bg-[#111112] border border-white/10 shadow-2xl overflow-hidden z-50"
                      >
                        {/* Header */}

                        <div className="px-5 py-4 border-b border-white/10">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-brand-500/10 border border-brand-500/30 flex items-center justify-center shrink-0">
                              <User className="w-4 h-4 text-brand-400" />
                            </div>

                            <div className="min-w-0">
                              <p className="text-sm text-white font-medium truncate">
                                {customer?.name}
                              </p>

                              <p className="text-[10px] text-ivory-600 truncate mt-1">
                                {customer?.email}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* My Orders */}

                        <Link
                          to="/customer/orders"
                          onClick={() =>
                            setAccountOpen(false)
                          }
                          className="flex items-center gap-3 px-5 py-3.5 text-xs text-ivory-400 hover:text-brand-400 hover:bg-white/[0.03] transition"
                        >
                          <ClipboardList className="w-4 h-4" />

                          <span>
                            My Orders
                          </span>
                        </Link>
{/* My Profile */}
<Link
  to="/customer/profile"
  onClick={() => setAccountOpen(false)}
  className="flex items-center gap-3 px-5 py-3.5 text-xs text-ivory-400 hover:text-brand-400 hover:bg-white/[0.03] transition"
>
  <User className="w-4 h-4" />
  <span>My Profile</span>
</Link>
                       
                        {/* Logout */}

                        <div className="border-t border-white/10">
                          <button
                            type="button"
                            onClick={
                              handleLogout
                            }
                            className="w-full flex items-center gap-3 px-5 py-3.5 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/[0.04] transition text-left"
                          >
                            <LogOut className="w-4 h-4" />

                            <span>
                              Logout
                            </span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                /* Logged Out */

                <Link
                  to="/customer/login"
                  state={{
                    from: loginRedirect,
                  }}
                  className="hidden lg:flex w-10 h-10 items-center justify-center rounded-full border border-white/10 bg-dark-850/80 text-ivory-300 hover:border-brand-500/40 hover:text-brand-400 transition-all"
                  aria-label="Sign in"
                >
                  <User className="w-4 h-4" />
                </Link>
              )}
            </div>

            {/* ===============================================
                CART
            =============================================== */}

            <button
              type="button"
              onClick={() => {
                setIsCartOpen(true);
                setAccountOpen(false);
              }}
              className="relative w-10 h-10 rounded-full bg-dark-850/80 border border-white/10 hover:border-brand-500/50 text-ivory-200 hover:text-brand-400 transition-all duration-300 flex items-center justify-center group shrink-0"
              aria-label="View shopping cart"
            >
              <ShoppingBag className="w-4 h-4 sm:w-[18px] sm:h-[18px] transition-transform group-hover:scale-110" />

              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-gradient-to-r from-brand-500 to-gold-500 text-white text-[9px] font-bold flex items-center justify-center shadow-glow">
                  {cartCount}
                </span>
              )}
            </button>

            {/* ===============================================
                ORDER ONLINE
            =============================================== */}

            <Link
              to="/order-online"
              className="hidden sm:inline-block shrink-0"
              onClick={() => {
                setAccountOpen(false);
              }}
            >
              <Button
                variant="primary"
                size="sm"
                className="tracking-[0.12em] whitespace-nowrap px-5"
              >
                Order Online
              </Button>
            </Link>

            {/* ===============================================
                MOBILE ACCOUNT
            =============================================== */}

            {isAuthenticated ? (
              <button
                type="button"
                onClick={() => {
                  setAccountOpen(
                    (prev) => !prev
                  );
                  setMobileOpen(false);
                }}
                className={`lg:hidden w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full border transition-all shrink-0 ${
                  accountOpen
                    ? "border-brand-500/50 bg-brand-500/10 text-brand-400"
                    : "border-white/10 bg-dark-850/80 text-ivory-200 hover:border-brand-500/40 hover:text-brand-400"
                }`}
                aria-label="Open customer account"
                aria-expanded={
                  accountOpen
                }
              >
                <User className="w-4 h-4" />
              </button>
            ) : (
              <Link
                to="/customer/login"
                state={{
                  from: loginRedirect,
                }}
                onClick={() => {
                  setMobileOpen(false);
                  setAccountOpen(false);
                }}
                className="lg:hidden w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-white/10 bg-dark-850/80 text-ivory-200 hover:border-brand-500/40 hover:text-brand-400 flex items-center justify-center transition-all shrink-0"
                aria-label="Sign in"
              >
                <User className="w-4 h-4" />
              </Link>
            )}

            {/* ===============================================
                MOBILE HAMBURGER
            =============================================== */}

            <button
              type="button"
              onClick={() => {
                setMobileOpen(
                  (prev) => !prev
                );
                setAccountOpen(false);
              }}
              className="lg:hidden flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-lg text-ivory-300 hover:text-white focus:outline-none"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? (
                <X className="w-5 h-5 sm:w-6 sm:h-6 text-brand-400" />
              ) : (
                <MenuIcon className="w-5 h-5 sm:w-6 sm:h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* =====================================================
          MOBILE NAVIGATION
      ====================================================== */}

      <AnimatePresence>
        {mobileOpen && (
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
            transition={{
              duration: 0.28,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="lg:hidden bg-[#080808]/98 backdrop-blur-2xl border-b border-white/10 overflow-hidden"
          >
            <div className="px-5 pt-4 pb-5">

              {/* LOCATION */}

              <Link
                to="/customer/addresses"
                className="flex items-center justify-between gap-3 px-4 py-3.5 mb-4 border border-white/10 bg-white/[0.025] hover:border-brand-500/30 transition"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-brand-500/10 border border-brand-500/25 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-brand-400" />
                  </div>

                  <div className="min-w-0">
                    
                    <p className="text-xs text-white truncate">
                      {selectedAddress
                        ? getLocationText()
                        : "Select Address"}
                    </p>
                  </div>
                </div>

                <Navigation className="w-4 h-4 text-brand-400 shrink-0" />
              </Link>

              {/* WEBSITE NAV */}

              <div className="border-t border-white/[0.06]">
                {navLinks.map(
                  (link, idx) => {
                    const isActive =
                      location.pathname ===
                      link.path;

                    return (
                      <motion.div
                        key={link.name}
                        initial={{
                          opacity: 0,
                          x: -10,
                        }}
                        animate={{
                          opacity: 1,
                          x: 0,
                        }}
                        transition={{
                          delay:
                            idx * 0.025,
                          duration: 0.22,
                        }}
                      >
                        <Link
                          to={link.path}
                          className={`flex items-center text-[13px] uppercase tracking-[0.22em] py-3 ${
                            isActive
                              ? "text-brand-400 font-semibold pl-3 border-l-2 border-brand-500"
                              : "text-ivory-300 hover:text-white"
                          }`}
                        >
                          {link.name}
                        </Link>
                      </motion.div>
                    );
                  }
                )}
              </div>

              {/* PHONE */}

              <div className="pt-3 mt-2 border-t border-white/[0.06]">
                <a
                  href="tel:+919876543210"
                  className="flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.18em] text-ivory-600 hover:text-brand-400 py-2.5 transition"
                >
                  <Phone className="w-3.5 h-3.5 text-brand-500" />

                  <span>
                    +91 98765 43210
                  </span>
                </a>
              </div>

              {/* ORDER ONLINE */}

              <div className="pt-4 mt-2 border-t border-white/[0.06]">
                <Link
                  to="/order-online"
                  className="block w-full"
                  onClick={() => {
                    setMobileOpen(
                      false
                    );
                  }}
                >
                  <Button
                    variant="primary"
                    size="md"
                    className="w-full tracking-[0.18em]"
                  >
                    Order Online
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =====================================================
          MOBILE ACCOUNT PANEL
      ====================================================== */}

      <AnimatePresence>
        {accountOpen &&
          isAuthenticated && (
            <>
              {/* Backdrop */}

              <motion.div
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
                exit={{
                  opacity: 0,
                }}
                className="lg:hidden fixed inset-0 top-[76px] bg-black/50 backdrop-blur-[2px] z-[-1]"
                onClick={() =>
                  setAccountOpen(false)
                }
              />

              {/* Panel */}

              <motion.div
                initial={{
                  opacity: 0,
                  y: -8,
                  scale: 0.97,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  y: -8,
                  scale: 0.97,
                }}
                transition={{
                  duration: 0.2,
                  ease: [
                    0.16,
                    1,
                    0.3,
                    1,
                  ],
                }}
                className="lg:hidden absolute top-full right-4 w-[280px] max-w-[calc(100vw-32px)] bg-[#111112] border border-white/10 shadow-2xl overflow-hidden z-50"
              >
                {/* Customer Info */}

                <div className="px-5 py-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-500/10 border border-brand-500/30 flex items-center justify-center shrink-0">
                      <User className="w-4 h-4 text-brand-400" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm text-white font-medium truncate">
                        {customer?.name}
                      </p>

                      <p className="text-[10px] text-ivory-600 truncate mt-1">
                        {customer?.email}
                      </p>
                    </div>
                  </div>
                </div>

                {/* My Orders */}

                <Link
                  to="/customer/orders"
                  onClick={() =>
                    setAccountOpen(false)
                  }
                  className="flex items-center gap-3 px-5 py-4 text-sm text-ivory-300 hover:text-brand-400 hover:bg-white/[0.03] transition"
                >
                  <ClipboardList className="w-4 h-4" />

                  <span>
                    My Orders
                  </span>
                </Link>
{/* My Profile */}
<Link
  to="/customer/profile"
  onClick={() => setAccountOpen(false)}
  className="flex items-center gap-3 px-5 py-4 text-sm text-ivory-300 hover:text-brand-400 hover:bg-white/[0.03] transition"
>
  <User className="w-4 h-4" />
  <span>My Profile</span>
</Link>
                {/* Logout */}

                <div className="border-t border-white/10">
                  <button
                    type="button"
                    onClick={
                      handleLogout
                    }
                    className="w-full flex items-center gap-3 px-5 py-4 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/[0.04] transition text-left"
                  >
                    <LogOut className="w-4 h-4" />

                    <span>
                      Logout
                    </span>
                  </button>
                </div>
              </motion.div>
            </>
          )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;