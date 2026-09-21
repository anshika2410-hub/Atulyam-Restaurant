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
  Clock3,
  CheckCircle2,
  IndianRupee,
  ArrowUpRight,
  RefreshCw,
  PackageCheck,
  CircleAlert,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useNavigate, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";

const ease = [0.22, 1, 0.36, 1];

const API_URL = import.meta.env.VITE_API_URL;

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

const statusClasses = {
  Pending:
    "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",

  Preparing:
    "bg-orange-500/10 text-orange-400 border-orange-500/20",

  "On the way":
    "bg-blue-500/10 text-blue-400 border-blue-500/20",

  Delivered:
    "bg-green-500/10 text-green-400 border-green-500/20",

  Completed:
    "bg-green-500/10 text-green-400 border-green-500/20",

  Cancelled:
    "bg-red-500/10 text-red-400 border-red-500/20",
};

const getToken = () => {
  return localStorage.getItem("atulyam_admin_token") || "";
};

const getOrderAmount = (order) => {
  return Number(
    order?.total_amount ??
      order?.totalAmount ??
      order?.total ??
      order?.amount ??
      order?.grand_total ??
      0
  );
};

const getOrderCustomer = (order) => {
  return (
    order?.customer_name ||
    order?.customer?.name ||
    order?.customer?.username ||
    order?.user?.name ||
    order?.user?.username ||
    order?.name ||
    "Guest Customer"
  );
};

const getOrderNumber = (order) => {
  return (
    order?.order_number ||
    order?.orderNumber ||
    order?.number ||
    (order?.id ? `#ATL-${order.id}` : "#ATL")
  );
};

const getOrderItems = (order) => {
  if (Array.isArray(order?.items)) {
    return order.items
      .map(
        (item) =>
          item?.name ||
          item?.dish_name ||
          item?.product_name ||
          item?.menu_item?.name
      )
      .filter(Boolean)
      .join(", ");
  }

  return order?.items_summary || order?.item_summary || "Restaurant order";
};

const getOrderDate = (order) => {
  return (
    order?.created_at ||
    order?.createdAt ||
    order?.date ||
    order?.ordered_at ||
    null
  );
};

const formatTime = (value) => {
  if (!value) return "Recently";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Recently";
  }

  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const isToday = (value) => {
  if (!value) return false;

  const date = new Date(value);
  const today = new Date();

  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [orders, setOrders] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [error, setError] = React.useState("");

  const fetchOrders = React.useCallback(async (showRefresh = false) => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const token = getToken();

const response = await fetch(`${API_URL}/orders`, {
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
});

     

      if (!response.ok) {
        throw new Error(`Failed to fetch orders (${response.status})`);
      }

      const data = await response.json();

      const orderList = Array.isArray(data)
        ? data
        : Array.isArray(data?.orders)
        ? data.orders
        : Array.isArray(data?.items)
        ? data.items
        : [];

      setOrders(orderList);
    } catch (err) {
      console.error("Dashboard orders error:", err);
      setError("Unable to load live order data.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  React.useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const todayOrders = React.useMemo(() => {
    return orders.filter((order) => isToday(getOrderDate(order)));
  }, [orders]);

  const todayRevenue = React.useMemo(() => {
    return todayOrders.reduce(
      (total, order) => total + getOrderAmount(order),
      0
    );
  }, [todayOrders]);

 const pendingOrders = React.useMemo(() => {
  return orders.filter(
    (order) => order?.status?.toLowerCase() === "pending"
  );
}, [orders]);

  const completedOrders = React.useMemo(() => {
    return orders.filter((order) =>
      ["Delivered", "Completed"].includes(order?.status)
    );
  }, [orders]);

  const recentOrders = React.useMemo(() => {
    return [...orders]
      .sort((a, b) => {
        const first = new Date(getOrderDate(a) || 0).getTime();
        const second = new Date(getOrderDate(b) || 0).getTime();

        return second - first;
      })
      .slice(0, 5);
  }, [orders]);

  const stats = [
    {
      title: "Today's Orders",
      value: todayOrders.length,
      icon: ShoppingBag,
      description: "Orders received today",
    },
    {
      title: "Today's Revenue",
      value: `₹${todayRevenue.toLocaleString("en-IN")}`,
      icon: IndianRupee,
      description: "Revenue generated today",
    },
    {
      title: "Pending Orders",
      value: pendingOrders.length,
      icon: Clock3,
      description:
        pendingOrders.length > 0
          ? "Orders need attention"
          : "Everything is up to date",
    },
    {
      title: "Completed",
      value: completedOrders.length,
      icon: CheckCircle2,
      description: "Successfully delivered",
    },
  ];

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

                <span className="flex-1">{item.label}</span>

                {item.label === "Orders" &&
                  pendingOrders.length > 0 && (
                    <span className="min-w-5 h-5 px-1 rounded-full bg-[#f28a2e] text-black text-[9px] font-bold flex items-center justify-center">
                      {pendingOrders.length}
                    </span>
                  )}
              </button>
            );
          })}

          <div className="pt-7 mt-5 border-t border-white/10">
  <p className="px-4 mb-4 text-[9px] uppercase tracking-[0.25em] text-white/25">
    System
  </p>

  <Link
    to="/admin/settings"
    className="w-full flex items-center gap-3 px-4 py-3.5 text-sm text-white/45 hover:text-white hover:bg-white/[0.03] transition"
  >
    <Settings className="w-[17px] h-[17px]" />
    Settings
  </Link>
</div>
        </nav>

        {/* USER */}

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

      {/* MAIN */}

      <main className="lg:ml-[260px] min-h-screen">
        {/* TOPBAR */}

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

            <p className="text-[11px] text-white/40 mt-1">
              Live operational overview
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => fetchOrders(true)}
              disabled={refreshing}
              className="w-9 h-9 border border-white/10 flex items-center justify-center text-white/35 hover:text-white hover:border-white/20 transition"
              title="Refresh dashboard"
            >
              <RefreshCw
                className={`w-4 h-4 ${
                  refreshing ? "animate-spin" : ""
                }`}
              />
            </button>

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

        {/* CONTENT */}

        <div className="px-6 md:px-10 py-10 md:py-12 max-w-[1500px]">
          {/* HEADING */}

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

          {/* STATS */}

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
                        {loading ? "—" : stat.value}
                      </p>
                    </div>

                    <div className="w-9 h-9 border border-[#f28a2e]/20 bg-[#f28a2e]/5 flex items-center justify-center">
                      <Icon className="w-4 h-4 text-[#f28a2e]" />
                    </div>
                  </div>

                  <p className="text-[10px] text-white/30 mt-5">
                    {loading ? "Loading live data..." : stat.description}
                  </p>
                </motion.div>
              );
            })}
          </div>

          {/* LOWER GRID */}

          <div className="grid grid-cols-1 xl:grid-cols-[1.7fr_1fr] gap-6">
            {/* RECENT ORDERS */}

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.25,
                ease,
              }}
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
                  className="flex items-center gap-1 text-[9px] uppercase tracking-[0.2em] text-[#f28a2e] hover:text-white transition"
                >
                  View all
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>

              {error && (
                <div className="px-6 py-4 border-b border-red-500/10 bg-red-500/[0.03] flex items-center gap-2 text-xs text-red-400">
                  <CircleAlert className="w-4 h-4" />
                  {error}
                </div>
              )}

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
                    {loading ? (
                      <tr>
                        <td
                          colSpan="4"
                          className="px-6 py-12 text-center text-xs text-white/30"
                        >
                          Loading recent orders...
                        </td>
                      </tr>
                    ) : recentOrders.length === 0 ? (
                      <tr>
                        <td
                          colSpan="4"
                          className="px-6 py-12 text-center"
                        >
                          <PackageCheck className="w-8 h-8 mx-auto text-white/15 mb-3" />

                          <p className="text-sm text-white/40">
                            No orders yet
                          </p>

                          <p className="text-[10px] text-white/20 mt-1">
                            New customer orders will appear here.
                          </p>
                        </td>
                      </tr>
                    ) : (
                      recentOrders.map((order) => (
                        <tr
                          key={order.id || getOrderNumber(order)}
                          className="border-b border-white/[0.06] last:border-0 hover:bg-white/[0.02] transition"
                        >
                          <td className="px-6 py-5">
                            <p className="text-sm text-white">
                              {getOrderNumber(order)}
                            </p>

                            <p className="text-[10px] text-white/25 mt-1 max-w-[260px] truncate">
                              {getOrderItems(order)}
                            </p>

                            <p className="text-[9px] text-white/20 mt-1">
                              {formatTime(getOrderDate(order))}
                            </p>
                          </td>

                          <td className="px-6 py-5 text-sm text-white/60">
                            {getOrderCustomer(order)}
                          </td>

                          <td className="px-6 py-5 text-sm text-white">
                            ₹
                            {getOrderAmount(order).toLocaleString(
                              "en-IN"
                            )}
                          </td>

                          <td className="px-6 py-5">
                            <span
                              className={`
                                inline-flex items-center px-3 py-1.5
                                border text-[9px] uppercase tracking-[0.12em]
                                ${
                                  statusClasses[order.status] ||
                                  "bg-white/5 text-white/40 border-white/10"
                                }
                              `}
                            >
                              {order.status || "Pending"}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </motion.section>

            {/* QUICK ACTIONS */}

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.35,
                ease,
              }}
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
                  className="w-full flex items-center gap-4 p-4 border border-white/[0.07] hover:border-[#f28a2e]/30 hover:bg-[#f28a2e]/[0.03] transition text-left"
                >
                  <div className="w-10 h-10 bg-[#f28a2e]/10 flex items-center justify-center">
                    <UtensilsCrossed className="w-4 h-4 text-[#f28a2e]" />
                  </div>

                  <div>
                    <p className="text-sm">Manage Menu</p>

                    <p className="text-[10px] text-white/25 mt-1">
                      Add or update dishes & prices
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => navigate("/admin/offers")}
                  className="w-full flex items-center gap-4 p-4 border border-white/[0.07] hover:border-[#f28a2e]/30 hover:bg-[#f28a2e]/[0.03] transition text-left"
                >
                  <div className="w-10 h-10 bg-[#f28a2e]/10 flex items-center justify-center">
                    <Tag className="w-4 h-4 text-[#f28a2e]" />
                  </div>

                  <div>
                    <p className="text-sm">Create Offer</p>

                    <p className="text-[10px] text-white/25 mt-1">
                      Publish a new restaurant offer
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => navigate("/admin/gallery")}
                  className="w-full flex items-center gap-4 p-4 border border-white/[0.07] hover:border-[#f28a2e]/30 hover:bg-[#f28a2e]/[0.03] transition text-left"
                >
                  <div className="w-10 h-10 bg-[#f28a2e]/10 flex items-center justify-center">
                    <Images className="w-4 h-4 text-[#f28a2e]" />
                  </div>

                  <div>
                    <p className="text-sm">Update Gallery</p>

                    <p className="text-[10px] text-white/25 mt-1">
                      Manage restaurant photos
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => navigate("/admin/catering")}
                  className="w-full flex items-center gap-4 p-4 border border-white/[0.07] hover:border-[#f28a2e]/30 hover:bg-[#f28a2e]/[0.03] transition text-left"
                >
                  <div className="w-10 h-10 bg-[#f28a2e]/10 flex items-center justify-center">
                    <CalendarDays className="w-4 h-4 text-[#f28a2e]" />
                  </div>

                  <div>
                    <p className="text-sm">Catering Requests</p>

                    <p className="text-[10px] text-white/25 mt-1">
                      View upcoming inquiries
                    </p>
                  </div>
                </button>
              </div>
            </motion.section>
          </div>

          {/* TODAY'S ACTIVITY */}

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: 0.45,
              ease,
            }}
            className="mt-6 border border-white/10 bg-white/[0.02] px-6 py-5"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-[#f28a2e]/10 flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4 text-[#f28a2e]" />
                </div>

                <div>
                  <p className="text-sm text-white/70">
                    Today's activity
                  </p>

                  <p className="text-[10px] text-white/30 mt-1">
                    {todayOrders.length} orders · ₹
                    {todayRevenue.toLocaleString("en-IN")} revenue
                  </p>
                </div>
              </div>

              <button
                onClick={() => navigate("/admin/orders")}
                className="text-[9px] uppercase tracking-[0.2em] text-[#f28a2e] hover:text-white transition"
              >
                Open orders
              </button>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;