import React, { useState } from "react";
import {
  LayoutDashboard,
  ShoppingBag,
  UtensilsCrossed,
  Tag,
  Images,
  CalendarDays,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useNavigate, useLocation } from "react-router-dom";

const menuItems = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/admin",
  },
  {
    label: "Orders",
    icon: ShoppingBag,
    path: "/admin/orders",
  },
  {
    label: "Menu",
    icon: UtensilsCrossed,
    path: "/admin/menu",
  },
  {
    label: "Offers",
    icon: Tag,
    path: "/admin/offers",
  },
  {
    label: "Gallery",
    icon: Images,
    path: "/admin/gallery",
  },
  {
    label: "Catering",
    icon: CalendarDays,
    path: "/admin/catering",
  },
  {
    label: "Customers",
    icon: Users,
    path: "/admin/customers",
  },
];

const AdminLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (path) => {
    if (path === "/admin") {
      return location.pathname === "/admin";
    }

    return location.pathname.startsWith(path);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#070707] text-white">

      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/70 z-40 lg:hidden"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-screen w-[260px]
          bg-[#0b0b0b] border-r border-white/10
          flex flex-col
          transition-transform duration-300
          lg:translate-x-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >

        {/* LOGO */}
        <div className="h-[88px] px-7 border-b border-white/10 flex items-center justify-between">

          <div>
            <div className="font-serif text-2xl tracking-tight">
              Atulyam
            </div>

            <p className="text-[8px] uppercase tracking-[0.3em] text-[#f28a2e] mt-1">
              Admin Panel
            </p>
          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white/40 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>

        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 px-4 py-7 space-y-1 overflow-y-auto">

          <p className="px-4 mb-4 text-[9px] uppercase tracking-[0.25em] text-white/25">
            Management
          </p>

          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <button
                key={item.label}
                onClick={() => handleNavigation(item.path)}
                className={`
                  w-full flex items-center gap-3 px-4 py-3.5
                  text-left text-sm transition-all
                  ${
                    active
                      ? "bg-[#f28a2e]/10 text-[#f28a2e]"
                      : "text-white/45 hover:bg-white/[0.03] hover:text-white"
                  }
                `}
              >
                <Icon className="w-[17px] h-[17px]" />

                <span className="flex-1">
                  {item.label}
                </span>

                {/* Orders badge */}
                {item.label === "Orders" && (
                  <span
                    id="pending-orders-badge"
                    className="hidden min-w-5 h-5 px-1 rounded-full bg-[#f28a2e] text-black text-[9px] font-bold items-center justify-center"
                  >
                    0
                  </span>
                )}
              </button>
            );
          })}

          {/* SYSTEM */}
          <div className="pt-7 mt-5 border-t border-white/10">

            <p className="px-4 mb-4 text-[9px] uppercase tracking-[0.25em] text-white/25">
              System
            </p>

            <button
              onClick={() => handleNavigation("/admin/settings")}
              className={`
                w-full flex items-center gap-3 px-4 py-3.5
                text-left text-sm transition-all
                ${
                  isActive("/admin/settings")
                    ? "bg-[#f28a2e]/10 text-[#f28a2e]"
                    : "text-white/45 hover:bg-white/[0.03] hover:text-white"
                }
              `}
            >
              <Settings className="w-[17px] h-[17px]" />

              <span>Settings</span>
            </button>

          </div>

        </nav>

        {/* USER */}
        <div className="border-t border-white/10 p-5">

          <div className="flex items-center gap-3">

            <div className="w-9 h-9 rounded-full bg-[#f28a2e]/10 border border-[#f28a2e]/20 flex items-center justify-center text-[#f28a2e] font-serif">
              {(user?.username || "A")
                .charAt(0)
                .toUpperCase()}
            </div>

            <div className="flex-1 min-w-0">

              <p className="text-sm text-white truncate">
                {user?.username || "Admin"}
              </p>

              <p className="text-[10px] text-white/30">
                Administrator
              </p>

            </div>

            <button
              onClick={logout}
              title="Logout"
              className="text-white/30 hover:text-red-400 transition"
            >
              <LogOut className="w-4 h-4" />
            </button>

          </div>

        </div>

      </aside>

      {/* MAIN */}
      <main className="lg:ml-[260px] min-h-screen">

        {/* TOPBAR */}
        <header className="h-[88px] border-b border-white/10 px-6 md:px-10 flex items-center justify-between">

          {/* MOBILE HAMBURGER */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-white/60"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* DESKTOP TITLE */}
          <div className="hidden lg:block">

            <p className="text-[9px] uppercase tracking-[0.28em] text-white/25">
              Restaurant Management
            </p>

            <p className="text-[11px] text-white/40 mt-1">
              Live operational overview
            </p>

          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-4">

            <div className="hidden sm:block text-right">

              <p className="text-xs text-white/70">
                {user?.username || "Admin"}
              </p>

              <p className="text-[9px] text-white/30 mt-1">
                Super Administrator
              </p>

            </div>

            <div className="w-9 h-9 rounded-full bg-[#f28a2e] text-black flex items-center justify-center font-serif">
              {(user?.username || "A")
                .charAt(0)
                .toUpperCase()}
            </div>

          </div>

        </header>

        {/* PAGE CONTENT */}
        {children}

      </main>

    </div>
  );
};

export default AdminLayout;