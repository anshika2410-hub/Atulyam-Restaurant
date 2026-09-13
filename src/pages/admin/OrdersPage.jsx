import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  RefreshCw,
  Eye,
  Clock3,
  CheckCircle2,
  Truck,
  XCircle,
  ShoppingBag,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";

const API_URL = import.meta.env.VITE_API_URL;

const ease = [0.22, 1, 0.36, 1];

const statuses = [
  "All",
  "Pending",
  "Confirmed",
  "Preparing",
  "On the way",
  "Delivered",
  "Cancelled",
];

const statusConfig = {
  Pending: {
    icon: Clock3,
    className: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  },
  Confirmed: {
    icon: CheckCircle2,
    className: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  },
  Preparing: {
    icon: Clock3,
    className: "text-orange-400 bg-orange-400/10 border-orange-400/20",
  },
  "On the way": {
    icon: Truck,
    className: "text-purple-400 bg-purple-400/10 border-purple-400/20",
  },
  Delivered: {
    icon: CheckCircle2,
    className: "text-green-400 bg-green-400/10 border-green-400/20",
  },
  Cancelled: {
    icon: XCircle,
    className: "text-red-400 bg-red-400/10 border-red-400/20",
  },
};

const getValue = (obj, keys, fallback = "") => {
  for (const key of keys) {
    if (
      obj?.[key] !== undefined &&
      obj?.[key] !== null &&
      obj?.[key] !== ""
    ) {
      return obj[key];
    }
  }

  return fallback;
};
const formatDate = (value) => {
  if (!value) return "—";

  try {
    const utcDate = new Date(
      value.endsWith("Z") ? value : `${value}Z`
    );

    return utcDate.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return value;
  }
};

const OrdersPage = () => {
  const { token } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [activeStatus, setActiveStatus] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response = await fetch(`${API_URL}/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Unable to load orders.");
      }

      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Unable to load orders.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  const updateStatus = async (order, newStatus) => {
    const orderId = getValue(order, ["id", "order_id"]);

    if (!orderId || !newStatus) return;

    try {
      setUpdatingId(orderId);

      const response = await fetch(
        `${API_URL}/orders/${orderId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Unable to update order status.");
      }

      setOrders((prev) =>
        prev.map((item) =>
          getValue(item, ["id", "order_id"]) === orderId
            ? data
            : item
        )
      );

      setSelectedOrder((prev) =>
        prev &&
        getValue(prev, ["id", "order_id"]) === orderId
          ? data
          : prev
      );
    } catch (err) {
      setError(err.message || "Unable to update order.");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const orderNumber = String(
      getValue(order, ["order_number", "orderNumber", "number"], "")
    ).toLowerCase();

    const customer = String(
      getValue(
        order,
        ["customer_name", "customerName", "name"],
        ""
      )
    ).toLowerCase();

    const phone = String(
      getValue(order, ["phone", "customer_phone"], "")
    ).toLowerCase();

    const status = String(
      getValue(order, ["status"], "")
    );

    const matchesSearch =
      !search ||
      orderNumber.includes(search.toLowerCase()) ||
      customer.includes(search.toLowerCase()) ||
      phone.includes(search.toLowerCase());

    const matchesStatus =
      activeStatus === "All" || status === activeStatus;

    return matchesSearch && matchesStatus;
  });

  const totalOrders = orders.length;

  const pendingOrders = orders.filter((order) =>
    ["Pending", "Preparing"].includes(
      getValue(order, ["status"])
    )
  ).length;

  const completedOrders = orders.filter(
    (order) => getValue(order, ["status"]) === "Delivered"
  ).length;

  const totalRevenue = orders.reduce((sum, order) => {
    return (
      sum +
      Number(
        getValue(
          order,
          ["total_amount", "totalAmount", "total", "amount"],
          0
        )
      )
    );
  }, 0);

  return (
    <div className="min-h-screen bg-[#070707] text-white">

      {/* Header */}

      <div className="border-b border-white/10">

        <div className="px-6 md:px-10 py-8 max-w-[1500px]">

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">

            <div>

              <p className="text-[10px] uppercase tracking-[0.3em] text-[#f28a2e] mb-3">
                Management
              </p>

              <h1 className="font-serif text-4xl md:text-5xl">
                Orders
              </h1>

              <p className="text-sm text-white/35 mt-3">
                Monitor and manage restaurant orders.
              </p>

            </div>

            <button
              onClick={() => fetchOrders(true)}
              disabled={refreshing}
              className="self-start md:self-auto flex items-center gap-2 border border-white/10 px-5 py-3 text-[10px] uppercase tracking-[0.18em] text-white/60 hover:border-[#f28a2e]/40 hover:text-[#f28a2e] transition disabled:opacity-50"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${
                  refreshing ? "animate-spin" : ""
                }`}
              />
              Refresh
            </button>

          </div>

        </div>

      </div>


      {/* Content */}

      <div className="px-6 md:px-10 py-8 max-w-[1500px]">


        {/* Stats */}

        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 mb-8">

          <div className="border border-white/10 bg-white/[0.02] p-5">
            <p className="text-[9px] uppercase tracking-[0.2em] text-white/30">
              Total Orders
            </p>
            <p className="font-serif text-3xl mt-3">
              {totalOrders}
            </p>
          </div>

          <div className="border border-white/10 bg-white/[0.02] p-5">
            <p className="text-[9px] uppercase tracking-[0.2em] text-white/30">
              Active Orders
            </p>
            <p className="font-serif text-3xl mt-3 text-[#f28a2e]">
              {pendingOrders}
            </p>
          </div>

          <div className="border border-white/10 bg-white/[0.02] p-5">
            <p className="text-[9px] uppercase tracking-[0.2em] text-white/30">
              Delivered
            </p>
            <p className="font-serif text-3xl mt-3">
              {completedOrders}
            </p>
          </div>

          <div className="border border-white/10 bg-white/[0.02] p-5">
            <p className="text-[9px] uppercase tracking-[0.2em] text-white/30">
              Revenue
            </p>
            <p className="font-serif text-3xl mt-3">
              ₹{totalRevenue.toLocaleString("en-IN")}
            </p>
          </div>

        </div>


        {/* Filters */}

        <div className="flex flex-col lg:flex-row gap-4 mb-6">

          <div className="relative flex-1">

            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search order number, customer or phone..."
              className="w-full h-12 bg-white/[0.02] border border-white/10 pl-11 pr-4 text-sm text-white placeholder:text-white/25 outline-none focus:border-[#f28a2e]/40 transition"
            />

          </div>

          <div className="flex gap-2 overflow-x-auto pb-1">

            {statuses.map((status) => (

              <button
                key={status}
                onClick={() => setActiveStatus(status)}
                className={`
                  whitespace-nowrap px-4 h-12 border text-[9px]
                  uppercase tracking-[0.14em] transition
                  ${
                    activeStatus === status
                      ? "bg-[#f28a2e] border-[#f28a2e] text-black"
                      : "border-white/10 text-white/40 hover:text-white hover:border-white/20"
                  }
                `}
              >
                {status}
              </button>

            ))}

          </div>

        </div>


        {/* Error */}

        {error && (
          <div className="mb-6 border border-red-500/20 bg-red-500/5 px-5 py-4 text-sm text-red-400">
            {error}
          </div>
        )}


        {/* Orders Table */}

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
          className="border border-white/10 bg-white/[0.02] overflow-hidden"
        >

          <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between">

            <div>
              <p className="text-[9px] uppercase tracking-[0.2em] text-white/25">
                Live orders
              </p>

              <h2 className="font-serif text-2xl mt-1">
                All Orders
              </h2>
            </div>

            <span className="text-[10px] text-white/30">
              {filteredOrders.length} orders
            </span>

          </div>


          {loading ? (

            <div className="py-24 flex flex-col items-center justify-center">

              <div className="w-8 h-8 border-2 border-white/10 border-t-[#f28a2e] rounded-full animate-spin" />

              <p className="text-xs text-white/30 mt-4">
                Loading orders...
              </p>

            </div>

          ) : filteredOrders.length === 0 ? (

            <div className="py-24 flex flex-col items-center justify-center">

              <ShoppingBag className="w-8 h-8 text-white/15" />

              <p className="text-sm text-white/40 mt-4">
                No orders found
              </p>

            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full min-w-[900px]">

                <thead>
                  <tr className="border-b border-white/10">

                    <th className="px-6 py-4 text-left text-[9px] uppercase tracking-[0.16em] text-white/25 font-normal">
                      Order
                    </th>

                    <th className="px-6 py-4 text-left text-[9px] uppercase tracking-[0.16em] text-white/25 font-normal">
                      Customer
                    </th>

                    <th className="px-6 py-4 text-left text-[9px] uppercase tracking-[0.16em] text-white/25 font-normal">
                      Date
                    </th>

                    <th className="px-6 py-4 text-left text-[9px] uppercase tracking-[0.16em] text-white/25 font-normal">
                      Amount
                    </th>

                    <th className="px-6 py-4 text-left text-[9px] uppercase tracking-[0.16em] text-white/25 font-normal">
                      Status
                    </th>

                    <th className="px-6 py-4 text-right text-[9px] uppercase tracking-[0.16em] text-white/25 font-normal">
                      Action
                    </th>

                  </tr>
                </thead>

                <tbody>

                  {filteredOrders.map((order) => {

                    const orderId = getValue(
                      order,
                      ["id", "order_id"]
                    );

                    const orderNumber = getValue(
                      order,
                      [
                        "order_number",
                        "orderNumber",
                        "number",
                      ],
                      `#${orderId || "—"}`
                    );

                    const customer = getValue(
                      order,
                      [
                        "customer_name",
                        "customerName",
                        "name",
                      ],
                      "Customer"
                    );

                    const phone = getValue(
                      order,
                      ["phone", "customer_phone"],
                      ""
                    );

                    const amount = getValue(
                      order,
                      [
                        "total_amount",
                        "totalAmount",
                        "total",
                        "amount",
                      ],
                      0
                    );

                    const status = getValue(
                      order,
                      ["status"],
                      "Pending"
                    );

                    const config =
                      statusConfig[status] ||
                      statusConfig.Pending;

                    const StatusIcon = config.icon;

                    return (

                      <tr
                        key={orderId || orderNumber}
                        className="border-b border-white/[0.06] last:border-0 hover:bg-white/[0.02] transition"
                      >

                        <td className="px-6 py-5">

                          <p className="text-sm text-white">
                            #{String(orderNumber).replace(/^#/, "")}
                          </p>

                          <p className="text-[10px] text-white/25 mt-1">
                            ID: {orderId || "—"}
                          </p>

                        </td>


                        <td className="px-6 py-5">

                          <p className="text-sm text-white/75">
                            {customer}
                          </p>

                          {phone && (
                            <p className="text-[10px] text-white/25 mt-1">
                              {phone}
                            </p>
                          )}

                        </td>


                        <td className="px-6 py-5 text-xs text-white/40">
                          {formatDate(
                            getValue(
                              order,
                              [
                                "created_at",
                                "createdAt",
                                "order_date",
                              ]
                            )
                          )}
                        </td>


                        <td className="px-6 py-5 text-sm">
                          ₹{Number(amount).toLocaleString("en-IN")}
                        </td>


                        <td className="px-6 py-5">

                          <div className="relative inline-block">

                            <select
                              value={status}
                              disabled={updatingId === orderId}
                              onChange={(e) =>
                                updateStatus(
                                  order,
                                  e.target.value
                                )
                              }
                              className={`
                                appearance-none pl-3 pr-8 py-2
                                border text-[9px] uppercase
                                tracking-[0.1em] outline-none
                                bg-transparent cursor-pointer
                                ${config.className}
                              `}
                            >

                              <option value="Pending">Pending</option>
                              <option value="Confirmed">Confirmed</option>
                              <option value="Preparing">Preparing</option>
                              <option value="On the way">On the way</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>

                            </select>

                            <StatusIcon className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none" />

                          </div>

                        </td>


                        <td className="px-6 py-5 text-right">

                          <button
                            onClick={() =>
                              setSelectedOrder(order)
                            }
                            className="w-9 h-9 border border-white/10 inline-flex items-center justify-center text-white/35 hover:text-[#f28a2e] hover:border-[#f28a2e]/30 transition"
                            title="View order"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                        </td>

                      </tr>

                    );
                  })}

                </tbody>

              </table>

            </div>

          )}

        </motion.div>

      </div>


      {/* ================= ORDER DETAIL ================= */}

      {selectedOrder && (

        <div
          className="fixed inset-0 z-[100] bg-black/75 backdrop-blur-sm flex items-center justify-center p-5"
          onClick={() => setSelectedOrder(null)}
        >

          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.3, ease }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[650px] max-h-[90vh] overflow-y-auto bg-[#0c0c0c] border border-white/10"
          >

            <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between">

              <div>

                <p className="text-[9px] uppercase tracking-[0.2em] text-[#f28a2e]">
                  Order details
                </p>

                <h2 className="font-serif text-2xl mt-1">
                  #
                  {String(
                    getValue(
                      selectedOrder,
                      [
                        "order_number",
                        "orderNumber",
                        "number",
                      ],
                      getValue(selectedOrder, ["id"], "—")
                    )
                  ).replace(/^#/, "")}
                </h2>

              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="text-white/30 hover:text-white text-xl"
              >
                ×
              </button>

            </div>


            <div className="p-6 space-y-6">

              <div className="grid grid-cols-2 gap-4">

                <div>
                  <p className="text-[9px] uppercase tracking-[0.15em] text-white/25">
                    Customer
                  </p>

                  <p className="text-sm mt-2">
                    {getValue(
                      selectedOrder,
                      [
                        "customer_name",
                        "customerName",
                        "name",
                      ],
                      "—"
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-[9px] uppercase tracking-[0.15em] text-white/25">
                    Phone
                  </p>

                  <p className="text-sm mt-2">
                    {getValue(
                      selectedOrder,
                      ["phone", "customer_phone"],
                      "—"
                    )}
                  </p>
                </div>

              </div>


              <div>
                <p className="text-[9px] uppercase tracking-[0.15em] text-white/25 mb-3">
                  Delivery Address
                </p>

                <div className="border border-white/10 bg-white/[0.02] p-4 text-sm text-white/60 leading-6">
                  {getValue(
                    selectedOrder,
                    [
                      "delivery_address",
                      "address",
                      "customer_address",
                    ],
                    "Address not provided"
                  )}
                </div>

              </div>


              <div>

                <p className="text-[9px] uppercase tracking-[0.15em] text-white/25 mb-3">
                  Items
                </p>

                <div className="border border-white/10">

                  {Array.isArray(selectedOrder.items) &&
                  selectedOrder.items.length > 0 ? (

                    selectedOrder.items.map((item, index) => (

                      <div
                        key={index}
                        className="px-4 py-4 border-b border-white/[0.06] last:border-0 flex items-center justify-between gap-4"
                      >

                        <div>
                          <p className="text-sm">
                            {getValue(
                              item,
                              [
                                "name",
                                "item_name",
                                "title",
                              ],
                              `Item ${index + 1}`
                            )}
                          </p>

                          <p className="text-[10px] text-white/25 mt-1">
                            Qty:{" "}
                            {getValue(
                              item,
                              ["quantity", "qty"],
                              1
                            )}
                          </p>
                        </div>

                        <p className="text-sm">
                          ₹
                          {Number(
                            getValue(
                              item,
                              [
                                "price",
                                "unit_price",
                                "amount",
                              ],
                              0
                            )
                          ).toLocaleString("en-IN")}
                        </p>

                      </div>

                    ))

                  ) : (

                    <div className="p-4 text-sm text-white/30">
                      Item details unavailable.
                    </div>

                  )}

                </div>

              </div>


              <div className="flex items-center justify-between border-t border-white/10 pt-5">

                <span className="text-xs uppercase tracking-[0.15em] text-white/30">
                  Total
                </span>

                <span className="font-serif text-2xl text-[#f28a2e]">
                  ₹
                  {Number(
                    getValue(
                      selectedOrder,
                      [
                        "total_amount",
                        "totalAmount",
                        "total",
                        "amount",
                      ],
                      0
                    )
                  ).toLocaleString("en-IN")}
                </span>

              </div>

            </div>

          </motion.div>

        </div>

      )}

    </div>
  );
};

export default OrdersPage;