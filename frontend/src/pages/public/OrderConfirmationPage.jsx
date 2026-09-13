import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  PackageCheck,
  ArrowRight,
  Clock3,
  MapPin,
} from "lucide-react";

const API_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api/v1";

const OrderConfirmationPage = () => {
  const { orderNumber } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(
          `${API_URL}/orders/track/${encodeURIComponent(orderNumber)}`
        );

        if (!response.ok) {
          throw new Error("Order not found");
        }

        const data = await response.json();

        setOrder(data);

        sessionStorage.setItem(
          "atulyam_last_order",
          JSON.stringify(data)
        );
      } catch (error) {
        console.error("Failed to fetch order:", error);
      } finally {
        setLoading(false);
      }
    };

    if (orderNumber) {
      fetchOrder();
    }
  }, [orderNumber]);

  /* ---------------- LOADING ---------------- */

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070707] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-[#f28a2e]/30 border-t-[#f28a2e] rounded-full animate-spin mx-auto mb-5" />

          <p className="text-white/50 text-sm">
            Loading your order...
          </p>
        </div>
      </div>
    );
  }

  /* ---------------- ORDER NOT FOUND ---------------- */

  if (!order) {
    return (
      <div className="min-h-screen bg-[#070707] text-white flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <PackageCheck
            size={52}
            strokeWidth={1}
            className="text-[#f28a2e] mx-auto mb-6"
          />

          <h1 className="font-serif text-4xl mb-4">
            Order Not Found
          </h1>

          <p className="text-white/50 mb-8">
            We couldn't find this order. Please check your order
            number and try again.
          </p>

          <Link
            to="/order-online"
            className="inline-flex items-center gap-2 bg-[#f28a2e] text-black px-6 py-3 text-sm font-medium"
          >
            Back to Order Online
            <ArrowRight size={17} />
          </Link>
        </div>
      </div>
    );
  }

  const isCancelled = order.status === "Cancelled";

  return (
    <div className="min-h-screen bg-[#070707] text-white px-5 sm:px-8 lg:px-12 py-24">
      <div className="max-w-5xl mx-auto">

        {/* =====================================================
            SUCCESS HEADER
        ====================================================== */}

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-14"
        >
          <div className="w-20 h-20 rounded-full border border-[#f28a2e]/30 flex items-center justify-center mx-auto mb-7">
            <CheckCircle2
              size={42}
              strokeWidth={1.4}
              className="text-[#f28a2e]"
            />
          </div>

          <p className="text-[#f28a2e] text-xs tracking-[0.3em] uppercase mb-4">
            Order Confirmed
          </p>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl mb-5">
            Thank You for Ordering
          </h1>

          <p className="text-white/50 max-w-xl mx-auto leading-relaxed">
            Your order has been successfully placed and confirmed.
            We are getting it ready for you.
          </p>
        </motion.div>

        {/* =====================================================
            ORDER NUMBER
        ====================================================== */}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="border border-white/10 bg-white/[0.025] p-7 sm:p-9 mb-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">

            <div>
              <p className="text-white/40 text-xs uppercase tracking-[0.2em] mb-2">
                Your Order Number
              </p>

              <p className="text-[#f28a2e] text-xl sm:text-2xl font-medium tracking-wide">
                {order.order_number}
              </p>
            </div>

            <Link
              to={`/order-tracking/${order.order_number}`}
              className="inline-flex items-center justify-center gap-2 border border-[#f28a2e]/50 text-[#f28a2e] px-5 py-3 text-sm hover:bg-[#f28a2e] hover:text-black transition"
            >
              Track Order
              <ArrowRight size={17} />
            </Link>

          </div>
        </motion.div>

        {/* =====================================================
            MAIN CONTENT
        ====================================================== */}

        <div className="grid lg:grid-cols-[1.4fr_0.8fr] gap-6">

          {/* ===================================================
              ORDER DETAILS
          ==================================================== */}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="border border-white/10 bg-white/[0.025] p-7 sm:p-9"
          >
            <div className="flex items-center gap-3 mb-8">
              <PackageCheck
                size={22}
                className="text-[#f28a2e]"
              />

              <h2 className="font-serif text-2xl">
                Order Details
              </h2>
            </div>

            {/* ITEMS */}

            <div className="space-y-5">
              {order.items?.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-5 border-b border-white/8 pb-5"
                >
                  <div>
                    <p className="text-white/90">
                      {item.item_name}
                    </p>

                    <p className="text-white/40 text-sm mt-1">
                      ₹{Number(item.unit_price).toFixed(2)} ×{" "}
                      {item.quantity}
                    </p>
                  </div>

                  <p className="text-white/80 whitespace-nowrap">
                    ₹{Number(item.subtotal).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            {/* PRICE SUMMARY */}

            <div className="mt-8 space-y-3 text-sm">

              <div className="flex justify-between text-white/50">
                <span>Subtotal</span>

                <span>
                  ₹{Number(order.subtotal).toFixed(2)}
                </span>
              </div>

              {Number(order.discount_amount) > 0 && (
                <div className="flex justify-between text-green-400">
                  <span>Discount</span>

                  <span>
                    -₹{Number(order.discount_amount).toFixed(2)}
                  </span>
                </div>
              )}

              <div className="flex justify-between text-white/50">
                <span>GST</span>

                <span>
                  ₹{Number(order.tax_amount).toFixed(2)}
                </span>
              </div>

              <div className="border-t border-white/10 pt-5 flex justify-between text-lg">
                <span>Total</span>

                <span className="text-[#f28a2e]">
                  ₹{Number(order.total_amount).toFixed(2)}
                </span>
              </div>

            </div>
          </motion.div>

          {/* ===================================================
              ORDER STATUS
          ==================================================== */}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="border border-white/10 bg-white/[0.025] p-7 sm:p-9"
          >
            <div className="flex items-center gap-3 mb-8">
              <Clock3
                size={21}
                className="text-[#f28a2e]"
              />

              <h2 className="font-serif text-2xl">
                Order Status
              </h2>
            </div>

            {/* CONFIRMED STATUS */}

            {!isCancelled ? (
              <div className="flex items-start gap-4 mb-8">

                <div className="w-3 h-3 rounded-full bg-[#f28a2e] shadow-[0_0_15px_rgba(242,138,46,0.5)] mt-1.5 shrink-0" />

                <div>
                  <p className="text-white/90 text-lg">
                    Order Confirmed
                  </p>

                  <p className="text-white/40 text-sm mt-1 leading-relaxed">
                    Your order has been confirmed and is being
                    processed.
                  </p>
                </div>

              </div>
            ) : (
              /* CANCELLED */

              <div className="flex items-start gap-4 mb-8">

                <div className="w-3 h-3 rounded-full bg-red-400 mt-1.5 shrink-0" />

                <div>
                  <p className="text-red-400 text-lg">
                    Order Cancelled
                  </p>

                  <p className="text-white/40 text-sm mt-1 leading-relaxed">
                    Unfortunately, this order has been cancelled.
                  </p>
                </div>

              </div>
            )}

            {/* DELIVERY ADDRESS */}

            <div className="border-t border-white/10 pt-7">
              <div className="flex gap-3">

                <MapPin
                  size={19}
                  className="text-[#f28a2e] mt-1 shrink-0"
                />

                <div>
                  <p className="text-white/40 text-xs uppercase tracking-wider mb-2">
                    Delivery Address
                  </p>

                  <p className="text-white/75 text-sm leading-relaxed">
                    {order.delivery_address}
                  </p>
                </div>

              </div>
            </div>

            {/* TRACK ORDER */}

            {!isCancelled && (
              <Link
                to="/order-online"
                className="mt-8 w-full inline-flex items-center justify-center gap-2 bg-[#f28a2e] text-black px-5 py-3.5 text-sm font-medium hover:bg-[#ff9d4d] transition"
              >
                Continue Ordering
                <ArrowRight size={17} />
              </Link>
            )}

          </motion.div>
        </div>

      </div>
    </div>
  );
};

export default OrderConfirmationPage;