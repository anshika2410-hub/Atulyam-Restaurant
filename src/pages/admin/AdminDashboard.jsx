import React from "react";
import { motion } from "framer-motion";
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
  TrendingUp,
  Clock3,
  CheckCircle2,
  IndianRupee,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useNavigate, useLocation } from "react-router-dom";



const ease = [0.22, 1, 0.36, 1];

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
    badge: 3,
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

const stats = [
  {
    title: "Today's Orders",
    value: "24",
    change: "+12.5%",
    icon: ShoppingBag,
  },
  {
    title: "Today's Revenue",
    value: "₹18,450",
    change: "+8.2%",
    icon: IndianRupee,
  },
  {
    title: "Pending Orders",
    value: "7",
    change: "Needs attention",
    icon: Clock3,
  },
  {
    title: "Completed",
    value: "17",
    change: "+15.4%",
    icon: CheckCircle2,
  },
];

const recentOrders = [
  {
    id: "#ATL-1008",
    customer: "Rahul Sharma",
    items: "Paneer Tikka, Veg Biryani",
    amount: "₹680",
    status: "Preparing",
  },
  {
    id: "#ATL-1007",
    customer: "Priya Singh",
    items: "Masala Dosa, Cold Coffee",
    amount: "₹420",
    status: "On the way",
  },
  {
    id: "#ATL-1006",
    customer: "Aman Verma",
    items: "Chilli Paneer, Fried Rice",
    amount: "₹590",
    status: "Delivered",
  },
  {
    id: "#ATL-1005",
    customer: "Neha Gupta",
    items: "Veg Momos, Honey Chilli Potato",
    amount: "₹450",
    status: "Preparing",
  },
];

const statusClasses = {
  Preparing:
    "bg-orange-500/10 text-orange-400 border-orange-500/20",
  "On the way":
    "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Delivered:
    "bg-green-500/10 text-green-400 border-green-500/20",
};

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-[#070707] text-white">

      {/* ================= MOBILE OVERLAY ================= */}

      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/70 z-40 lg:hidden"
        />
      )}

      {/* ================= SIDEBAR ================= */}

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

        {/* Logo */}

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


        {/* Navigation */}

        <nav className="flex-1 px-4 py-7 space-y-1 overflow-y-auto">

          <p className="px-4 mb-4 text-[9px] uppercase tracking-[0.25em] text-white/25">
            Management
          </p>
{menuItems.map((item) => {
  const Icon = item.icon;

  const isActive =
    item.path === "/admin"
      ? location.pathname === "/admin"
      : location.pathname.startsWith(item.path);

  return (
    <button
      key={item.label}
      onClick={() => {
        navigate(item.path);
        setSidebarOpen(false);
      }}
      className={`
        w-full flex items-center gap-3 px-4 py-3.5
        text-left text-sm transition-all
        ${
          isActive
            ? "bg-[#f28a2e]/10 text-[#f28a2e]"
            : "text-white/45 hover:bg-white/[0.03] hover:text-white"
        }
      `}
    >
      <Icon className="w-[17px] h-[17px]" />

      <span className="flex-1">
        {item.label}
      </span>

      {item.badge && (
        <span className="w-5 h-5 rounded-full bg-[#f28a2e] text-black text-[9px] font-bold flex items-center justify-center">
          {item.badge}
        </span>
      )}
    </button>
  );
})}

          <div className="pt-7 mt-5 border-t border-white/10">

            <p className="px-4 mb-4 text-[9px] uppercase tracking-[0.25em] text-white/25">
              System
            </p>

            <button className="w-full flex items-center gap-3 px-4 py-3.5 text-sm text-white/45 hover:text-white hover:bg-white/[0.03] transition">
              <Settings className="w-[17px] h-[17px]" />
              Settings
            </button>

          </div>

        </nav>


        {/* User */}

        <div className="border-t border-white/10 p-5">

          <div className="flex items-center gap-3">

            <div className="w-9 h-9 rounded-full bg-[#f28a2e]/10 border border-[#f28a2e]/20 flex items-center justify-center text-[#f28a2e] font-serif">
              {(user?.username || "A").charAt(0).toUpperCase()}
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


      {/* ================= MAIN ================= */}

      <main className="lg:ml-[260px] min-h-screen">

        {/* Topbar */}

        <header className="h-[88px] border-b border-white/10 px-6 md:px-10 flex items-center justify-between">

          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-white/60"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="hidden lg:block">
            <p className="text-[9px] uppercase tracking-[0.28em] text-white/25">
              Restaurant Management
            </p>
          </div>

          <div className="flex items-center gap-5">

            <div className="hidden sm:block text-right">
              <p className="text-xs text-white/70">
                {user?.username || "Admin"}
              </p>

              <p className="text-[9px] text-white/30 mt-1">
                Super Administrator
              </p>
            </div>

            <div className="w-9 h-9 rounded-full bg-[#f28a2e] text-black flex items-center justify-center font-serif">
              {(user?.username || "A").charAt(0).toUpperCase()}
            </div>

          </div>

        </header>


        {/* Content */}

        <div className="px-6 md:px-10 py-10 md:py-12 max-w-[1500px]">

          {/* Heading */}

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="mb-10"
          >

            <p className="text-[10px] uppercase tracking-[0.3em] text-[#f28a2e] mb-3">
              Overview
            </p>

            <h1 className="font-serif text-4xl md:text-5xl">
              Good afternoon,{" "}
              <span className="italic text-[#f28a2e]">
                {user?.username || "Admin"}.
              </span>
            </h1>

            <p className="text-sm text-white/35 mt-3">
              Here's what's happening at Atulyam today.
            </p>

          </motion.div>


          {/* ================= STATS ================= */}

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-10">

            {stats.map((stat, index) => {
              const Icon = stat.icon;

              return (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.08,
                    ease,
                  }}
                  className="border border-white/10 bg-white/[0.02] p-6 hover:border-white/15 transition"
                >

                  <div className="flex items-start justify-between">

                    <div>

                      <p className="text-[10px] uppercase tracking-[0.18em] text-white/30">
                        {stat.title}
                      </p>

                      <p className="font-serif text-3xl mt-3">
                        {stat.value}
                      </p>

                    </div>

                    <div className="w-9 h-9 border border-[#f28a2e]/20 bg-[#f28a2e]/5 flex items-center justify-center">
                      <Icon className="w-4 h-4 text-[#f28a2e]" />
                    </div>

                  </div>

                  <p className="text-[10px] text-white/30 mt-5">
                    {stat.change}
                  </p>

                </motion.div>
              );
            })}

          </div>


          {/* ================= LOWER GRID ================= */}

          <div className="grid grid-cols-1 xl:grid-cols-[1.7fr_1fr] gap-6">


            {/* Recent Orders */}

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25, ease }}
              className="border border-white/10 bg-white/[0.02]"
            >

              <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between">

                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-white/30">
                    Orders
                  </p>

                  <h2 className="font-serif text-2xl mt-1">
                    Recent Orders
                  </h2>
                </div>

                <button 
                onClick={() => navigate("/admin/orders")}
                className="text-[9px] uppercase tracking-[0.2em] text-[#f28a2e] hover:text-white transition">
                  View all
                </button>

              </div>


              <div className="overflow-x-auto">

                <table className="w-full min-w-[700px]">

                  <thead>
                    <tr className="border-b border-white/10">

                      <th className="px-6 py-4 text-left text-[9px] uppercase tracking-[0.18em] text-white/25 font-normal">
                        Order
                      </th>

                      <th className="px-6 py-4 text-left text-[9px] uppercase tracking-[0.18em] text-white/25 font-normal">
                        Customer
                      </th>

                      <th className="px-6 py-4 text-left text-[9px] uppercase tracking-[0.18em] text-white/25 font-normal">
                        Amount
                      </th>

                      <th className="px-6 py-4 text-left text-[9px] uppercase tracking-[0.18em] text-white/25 font-normal">
                        Status
                      </th>

                    </tr>
                  </thead>

                  <tbody>

                    {recentOrders.map((order) => (

                      <tr
                        key={order.id}
                        className="border-b border-white/[0.06] last:border-0 hover:bg-white/[0.02] transition"
                      >

                        <td className="px-6 py-5">

                          <p className="text-sm text-white">
                            {order.id}
                          </p>

                          <p className="text-[10px] text-white/25 mt-1">
                            {order.items}
                          </p>

                        </td>

                        <td className="px-6 py-5 text-sm text-white/60">
                          {order.customer}
                        </td>

                        <td className="px-6 py-5 text-sm text-white">
                          {order.amount}
                        </td>

                        <td className="px-6 py-5">

                          <span
                            className={`
                              inline-flex items-center px-3 py-1.5
                              border text-[9px] uppercase tracking-[0.12em]
                              ${statusClasses[order.status]}
                            `}
                          >
                            {order.status}
                          </span>

                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>

            </motion.section>


            {/* Quick Actions */}

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35, ease }}
              className="border border-white/10 bg-white/[0.02]"
            >

              <div className="px-6 py-5 border-b border-white/10">

                <p className="text-[10px] uppercase tracking-[0.2em] text-white/30">
                  Shortcuts
                </p>

                <h2 className="font-serif text-2xl mt-1">
                  Quick Actions
                </h2>

              </div>


              <div className="p-5 space-y-2">

                <button
                onClick={() => navigate("/admin/menu")}
                 className="w-full flex items-center gap-4 p-4 border border-white/[0.07] hover:border-[#f28a2e]/30 hover:bg-[#f28a2e]/[0.03] transition text-left">

                  <div className="w-10 h-10 bg-[#f28a2e]/10 flex items-center justify-center">
                    <UtensilsCrossed className="w-4 h-4 text-[#f28a2e]" />
                  </div>

                  <div>
                    <p className="text-sm">
                      Manage Menu
                    </p>

                    <p className="text-[10px] text-white/25 mt-1">
                      Add or update dishes & prices
                    </p>
                  </div>

                </button>


                <button
                 onClick={() => navigate("/admin/offers")}
                 className="w-full flex items-center gap-4 p-4 border border-white/[0.07] hover:border-[#f28a2e]/30 hover:bg-[#f28a2e]/[0.03] transition text-left">

                  <div className="w-10 h-10 bg-[#f28a2e]/10 flex items-center justify-center">
                    <Tag className="w-4 h-4 text-[#f28a2e]" />
                  </div>

                  <div>
                    <p className="text-sm">
                      Create Offer
                    </p>

                    <p className="text-[10px] text-white/25 mt-1">
                      Publish a new restaurant offer
                    </p>
                  </div>

                </button>


                <button 
                onClick={() => navigate("/admin/gallery")}
                className="w-full flex items-center gap-4 p-4 border border-white/[0.07] hover:border-[#f28a2e]/30 hover:bg-[#f28a2e]/[0.03] transition text-left">

                  <div className="w-10 h-10 bg-[#f28a2e]/10 flex items-center justify-center">
                    <Images className="w-4 h-4 text-[#f28a2e]" />
                  </div>

                  <div>
                    <p className="text-sm">
                      Update Gallery
                    </p>

                    <p className="text-[10px] text-white/25 mt-1">
                      Manage restaurant photos
                    </p>
                  </div>

                </button>


                <button
                 onClick={() => navigate("/admin/catering")}
                 className="w-full flex items-center gap-4 p-4 border border-white/[0.07] hover:border-[#f28a2e]/30 hover:bg-[#f28a2e]/[0.03] transition text-left">

                  <div className="w-10 h-10 bg-[#f28a2e]/10 flex items-center justify-center">
                    <CalendarDays className="w-4 h-4 text-[#f28a2e]" />
                  </div>

                  <div>
                    <p className="text-sm">
                      Catering Requests
                    </p>

                    <p className="text-[10px] text-white/25 mt-1">
                      View upcoming inquiries
                    </p>
                  </div>

                </button>

              </div>

            </motion.section>

          </div>


          {/* Bottom Insight */}

          <div className="mt-6 border border-white/10 bg-white/[0.02] px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">

            <div className="flex items-center gap-3">

              <TrendingUp className="w-4 h-4 text-[#f28a2e]" />

              <p className="text-sm text-white/50">
                Today's orders are{" "}
                <span className="text-white">
                  12.5% higher
                </span>{" "}
                than yesterday.
              </p>

            </div>

            <span className="text-[9px] uppercase tracking-[0.2em] text-white/20">
              Live overview
            </span>

          </div>

        </div>

      </main>

    </div>
  );
};

export default AdminDashboard;