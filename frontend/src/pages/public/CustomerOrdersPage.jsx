import React, { useEffect, useState } from "react";
import {
  ClipboardList,
  Package,
  Clock3,
  CheckCircle2,
  XCircle,
  Truck,
  ArrowRight,
  ShoppingBag,
  ChevronRight,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { useCustomerAuth } from "../../context/CustomerAuthContext.jsx";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:8000/api/v1";

const CustomerOrdersPage = () => {
  const navigate = useNavigate();

  const {
    customer,
    token,
    isAuthenticated,
    authChecked,
  } = useCustomerAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authChecked) return;

    if (!isAuthenticated || !token) {
      navigate("/customer/login", {
        state: {
          from: "/customer/orders",
        },
        replace: true,
      });

      return;
    }

    const fetchOrders = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          `${API_URL}/orders/customer/my-orders`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data =
          await response.json().catch(() => null);

        if (!response.ok) {
          throw new Error(
            data?.detail ||
              "Unable to load your orders."
          );
        }

        setOrders(
          Array.isArray(data) ? data : []
        );
      } catch (err) {
        console.error(
          "Customer orders error:",
          err
        );

        setError(
          err.message ||
            "Unable to load your orders."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [
    authChecked,
    isAuthenticated,
    token,
    navigate,
  ]);

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };
const formatTime = (date) => {
  if (!date) return "";

  const utcDate = new Date(
    date.endsWith("Z") ? date : `${date}Z`
  );

  return utcDate.toLocaleTimeString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

  const isActiveOrder = (status) => {
    const normalized =
      status?.toLowerCase();

    return [
      "pending",
      "confirmed",
      "preparing",
      "on the way",
      "on_the_way",
    ].includes(normalized);
  };

  const getStatus = (status) => {
    const normalized =
      status?.toLowerCase();

    if (normalized === "pending") {
      return {
        label: "Confirmed",
        icon: Clock3,
        className:
          "text-amber-300 bg-amber-500/10 border-amber-500/20",
      };
    }

    if (normalized === "confirmed") {
      return {
        label: "Confirmed",
        icon: CheckCircle2,
        className:
          "text-blue-300 bg-blue-500/10 border-blue-500/20",
      };
    }

    if (normalized === "preparing") {
      return {
        label: "Preparing",
        icon: Package,
        className:
          "text-orange-300 bg-orange-500/10 border-orange-500/20",
      };
    }

    if (
      normalized === "on the way" ||
      normalized === "on_the_way"
    ) {
      return {
        label: "On the way",
        icon: Truck,
        className:
          "text-purple-300 bg-purple-500/10 border-purple-500/20",
      };
    }

    if (normalized === "delivered") {
      return {
        label: "Delivered",
        icon: CheckCircle2,
        className:
          "text-green-300 bg-green-500/10 border-green-500/20",
      };
    }

    if (normalized === "cancelled") {
      return {
        label: "Cancelled",
        icon: XCircle,
        className:
          "text-red-300 bg-red-500/10 border-red-500/20",
      };
    }

    return {
      label: status || "Confirmed",
      icon: Clock3,
      className:
        "text-ivory-300 bg-white/5 border-white/10",
    };
  };

  const getItemSummary = (order) => {
    if (!order.items?.length) {
      return "Order items";
    }

    const firstItems = order.items
      .slice(0, 2)
      .map(
        (item) =>
          `${item.item_name} × ${item.quantity}`
      );

    if (order.items.length > 2) {
      return `${firstItems.join(
        ", "
      )} + ${order.items.length - 2} more`;
    }

    return firstItems.join(", ");
  };

  const getItemCount = (order) => {
    return (
      order.items?.reduce(
        (total, item) =>
          total + item.quantity,
        0
      ) || 0
    );
  };

  const activeOrders = orders.filter((order) =>
    isActiveOrder(order.status)
  );

  const pastOrders = orders.filter(
    (order) => !isActiveOrder(order.status)
  );

  if (!authChecked || loading) {
    return (
      <main className="min-h-screen bg-dark-950 text-ivory-100 pt-[110px] pb-20 px-5">
        <div className="max-w-5xl mx-auto">

          <div className="mb-10">
            <div className="h-3 w-28 bg-white/5 animate-pulse mb-4" />
            <div className="h-10 w-56 bg-white/5 animate-pulse" />
          </div>

          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-40 bg-dark-900 border border-white/10 animate-pulse"
              />
            ))}
          </div>

        </div>
      </main>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <main className="min-h-screen bg-dark-950 text-ivory-100 pt-[105px] pb-20 px-5 sm:px-7">

      <div className="max-w-5xl mx-auto">

        {/* HEADER */}

        <div className="mb-10">

          <p className="text-brand-400 text-[10px] uppercase tracking-[0.3em] font-semibold mb-3">
            {customer?.name
              ? `${customer.name}'s Account`
              : "Your Account"}
          </p>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5">

            <div>
              <h1 className="font-serif text-4xl sm:text-5xl text-ivory-100">
                My Orders
              </h1>

              <p className="text-sm text-ivory-500 mt-3 max-w-xl leading-relaxed">
                View your active orders and
                previous order history.
              </p>
            </div>

            <Link
              to="/order-online"
              className="inline-flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-400 text-dark-950 font-semibold text-xs px-5 py-3 transition"
            >
              <ShoppingBag size={15} />
              Order Again
            </Link>

          </div>
        </div>

        {/* ERROR */}

        {error && (
          <div className="border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-300 mb-6">
            {error}
          </div>
        )}

        {/* EMPTY */}

        {!error && orders.length === 0 && (
          <div className="bg-dark-900 border border-white/10 px-6 sm:px-10 py-16 text-center">

            <div className="w-16 h-16 mx-auto rounded-full bg-brand-500/10 border border-brand-500/20 flex items-center justify-center mb-6">
              <ClipboardList
                size={25}
                className="text-brand-400"
              />
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl text-white">
              No orders yet
            </h2>

            <p className="text-sm text-ivory-600 mt-3 max-w-md mx-auto leading-relaxed">
              Your orders will appear here once
              you place your first order.
            </p>

            <Link
              to="/order-online"
              className="inline-flex items-center gap-2 mt-7 bg-brand-500 hover:bg-brand-400 text-dark-950 font-semibold text-sm px-6 py-3.5 transition"
            >
              Explore Menu
              <ArrowRight size={16} />
            </Link>

          </div>
        )}

        {/* ACTIVE ORDERS */}

        {activeOrders.length > 0 && (
          <section className="mb-10">

            <div className="flex items-center gap-3 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-400" />

              <h2 className="text-[11px] uppercase tracking-[0.22em] text-ivory-400 font-semibold">
                Active Order
              </h2>
            </div>

            <div className="space-y-4">

              {activeOrders.map((order) => {
                const status =
                  getStatus(order.status);

                const StatusIcon =
                  status.icon;

                return (
                  <article
                    key={order.id}
                    className="relative overflow-hidden bg-dark-900 border border-brand-500/25"
                  >

                    {/* ACTIVE ACCENT */}

                    <div className="absolute top-0 left-0 right-0 h-px bg-brand-500/60" />

                    <div className="px-5 sm:px-7 py-5">

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

                        <div className="flex items-start gap-4">

                          <div className="w-11 h-11 rounded-full bg-brand-500/10 border border-brand-500/20 flex items-center justify-center shrink-0">
                            <Package
                              size={18}
                              className="text-brand-400"
                            />
                          </div>

                          <div>
                            <p className="text-[10px] uppercase tracking-[0.18em] text-brand-400 mb-1">
                              Active Order
                            </p>

                            <h3 className="text-sm sm:text-base text-white font-medium">
                              {order.order_number}
                            </h3>

                            <p className="text-[11px] text-ivory-600 mt-1">
                              {formatDate(
                                order.created_at
                              )}{" "}
                              ·{" "}
                              {formatTime(
                                order.created_at
                              )}
                            </p>
                          </div>

                        </div>

                        <div
                          className={`inline-flex items-center gap-2 self-start sm:self-auto border px-3 py-2 text-[10px] uppercase tracking-[0.12em] ${status.className}`}
                        >
                          <StatusIcon size={13} />
                          {status.label}
                        </div>

                      </div>

                      <div className="mt-5 pt-5 border-t border-white/[0.08]">

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

                          <div>
                            <p className="text-sm text-ivory-300">
                              {getItemSummary(order)}
                            </p>

                            <p className="text-xs text-ivory-600 mt-2">
                              {getItemCount(order)}{" "}
                              items · ₹
                              {Number(
                                order.total_amount || 0
                              ).toFixed(2)}
                            </p>
                          </div>

                          <Link
                            to={`/order-tracking/${order.order_number}`}
                            className="inline-flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-400 text-dark-950 font-semibold text-xs px-5 py-3 transition"
                          >
                            Track Your Order
                            <ArrowRight size={15} />
                          </Link>

                        </div>

                      </div>

                    </div>

                  </article>
                );
              })}

            </div>

          </section>
        )}

        {/* ORDER HISTORY */}

        {pastOrders.length > 0 && (
          <section>

            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-[11px] uppercase tracking-[0.22em] text-ivory-500 font-semibold">
                Order History
              </h2>

              <div className="h-px flex-1 bg-white/[0.07]" />
            </div>

            <div className="space-y-3">

              {pastOrders.map((order) => {
                const status =
                  getStatus(order.status);

                const StatusIcon =
                  status.icon;

                return (
                  <Link
                    key={order.id}
                    to={`/customer/orders/${order.id}`}
                    className="group block bg-dark-900 border border-white/10 hover:border-brand-500/25 transition"
                  >

                    <div className="px-5 sm:px-7 py-5">

                      <div className="flex items-center gap-4">

                        <div className="w-11 h-11 rounded-full bg-white/[0.03] border border-white/[0.08] flex items-center justify-center shrink-0">
                          <ClipboardList
                            size={17}
                            className="text-ivory-500 group-hover:text-brand-400 transition"
                          />
                        </div>

                        <div className="flex-1 min-w-0">

                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">

                            <div>
                              <h3 className="text-sm text-white font-medium">
                                {order.order_number}
                              </h3>

                              <p className="text-[11px] text-ivory-600 mt-1">
                                {formatDate(
                                  order.created_at
                                )}{" "}
                                ·{" "}
                                {formatTime(
                                  order.created_at
                                )}
                              </p>
                            </div>

                            <div className="flex items-center gap-3">

                              <span
                                className={`inline-flex items-center gap-1.5 border px-2.5 py-1.5 text-[9px] uppercase tracking-[0.1em] ${status.className}`}
                              >
                                <StatusIcon size={11} />
                                {status.label}
                              </span>

                              <span className="text-sm text-white font-medium">
                                ₹
                                {Number(
                                  order.total_amount || 0
                                ).toFixed(2)}
                              </span>

                              <ChevronRight
                                size={16}
                                className="text-ivory-700 group-hover:text-brand-400 group-hover:translate-x-0.5 transition"
                              />

                            </div>

                          </div>

                          <div className="mt-3 flex items-center gap-2">

                            <p className="text-xs text-ivory-500 truncate">
                              {getItemSummary(order)}
                            </p>

                            <span className="text-[10px] text-ivory-700 shrink-0">
                              {getItemCount(order)} items
                            </span>

                          </div>

                        </div>

                      </div>

                    </div>

                  </Link>
                );
              })}

            </div>

          </section>
        )}

      </div>
    </main>
  );
};

export default CustomerOrdersPage;