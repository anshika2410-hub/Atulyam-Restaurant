import React from "react";
import { useLocation } from "react-router-dom";

import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";
import CartDrawer from "../common/CartDrawer.jsx";

export const PageLayout = ({
  children,
  cart,
  setCart,
  addToCart,
  decreaseFromCart,
  cartCount,
}) => {
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith("/admin");
const isCustomerAuthRoute =
  location.pathname === "/customer/login" ||
  location.pathname === "/customer/signup";

  // ================= ADMIN LAYOUT =================
  if (isAdminRoute || isCustomerAuthRoute) {
    return (
      <div className="min-h-screen bg-[#070707] text-white">
        <main className="min-h-screen">
          {children}
        </main>
      </div>
    );
  }

  // ================= PUBLIC LAYOUT =================
  return (
    <div className="min-h-screen flex flex-col bg-[#0B0B0C] text-ivory-100 selection:bg-brand-500/30 selection:text-white relative">

      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-radial-luxury pointer-events-none z-0 opacity-60" />

      <Navbar
        cart={cart}
        setCart={setCart}
        addToCart={addToCart}
        decreaseFromCart={decreaseFromCart}
        cartCount={cartCount}
      />

      <CartDrawer
        cart={cart}
        setCart={setCart}
        addToCart={addToCart}
        decreaseFromCart={decreaseFromCart}
        cartCount={cartCount}
      />

      <main className="flex-1 relative z-10">
        {children}
      </main>

      <Footer />

    </div>
  );
};

export default PageLayout;