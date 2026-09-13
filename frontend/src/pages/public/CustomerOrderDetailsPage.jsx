import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  ClipboardList,
  Package,
  MapPin,
  CreditCard,
  CheckCircle2,
  XCircle,
  Clock3,
  Truck,
  RotateCcw,
  Star,
  FileText,
  ChevronRight,
} from "lucide-react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import { useCustomerAuth } from "../../context/CustomerAuthContext.jsx";
import { useCart } from "../../context/CartContext.jsx";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:8000/api/v1";

const CustomerOrderDetailsPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const {
    token,
    isAuthenticated,
    authChecked,
  } = useCustomerAuth();

  const {
    addToCart,
    setIsCartOpen,
  } = useCart();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [reordering, setReordering] = useState(false);

  const [ratingOpen, setRatingOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [submittingRating, setSubmittingRating] = useState(false);
  const [ratingError, setRatingError] = useState("");
  const [ratingSuccess, setRatingSuccess] = useState("");

  useEffect(() => {
    if (!authChecked) return;

    if (!isAuthenticated || !token) {
      navigate("/customer/login", {
        state: {
          from: `/customer/orders/${orderId}`,
        },
        replace: true,
      });

      return;
    }

    const fetchOrder = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          `${API_URL}/orders/customer/my-orders/${orderId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json().catch(() => null);

        if (!response.ok) {
          throw new Error(
            data?.detail || "Unable to load this order."
          );
        }

        setOrder(data);
      } catch (err) {
        console.error("Order details error:", err);

        setError(
          err.message || "Unable to load this order."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [
    authChecked,
    isAuthenticated,
    token,
    orderId,
    navigate,
  ]);

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

  const formatTime = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleTimeString(
      "en-IN",
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  const getStatus = (status) => {
    const normalized = status?.toLowerCase();

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

  const isDelivered =
    order?.status?.toLowerCase() === "delivered";

  const isCancelled =
    order?.status?.toLowerCase() === "cancelled";

  const isActive =
    !isDelivered && !isCancelled;

  const totalItems =
    order?.items?.reduce(
      (total, item) =>
        total + Number(item.quantity || 0),
      0
    ) || 0;

  // --------------------------------------------------
  // REORDER
  // --------------------------------------------------

  const handleReorder = () => {
    if (!order?.items?.length) {
      return;
    }

    setReordering(true);

    try {
      order.items.forEach((item) => {
        addToCart(
          {
            id:
              item.menu_item_id ??
              `reorder-${order.id}-${item.id}`,

            name: item.item_name,

            price: Number(item.unit_price) || 0,

            menu_item_id:
              item.menu_item_id ?? null,
          },
          Number(item.quantity) || 1
        );
      });

      setIsCartOpen(true);

      setTimeout(() => {
        navigate("/order-online");
      }, 350);
    } catch (err) {
      console.error("Reorder failed:", err);
    } finally {
      setReordering(false);
    }
  };

  // --------------------------------------------------
  // RATE ORDER
  // --------------------------------------------------

  const openRatingModal = () => {
    setRating(0);
    setReview("");
    setRatingError("");
    setRatingSuccess("");
    setRatingOpen(true);
  };

  const submitRating = async () => {
    if (!rating) {
      setRatingError("Please select a rating.");
      return;
    }

    setSubmittingRating(true);
    setRatingError("");
    setRatingSuccess("");

    try {
      const response = await fetch(
        `${API_URL}/order-ratings/${order.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            rating,
            review: review.trim() || null,
          }),
        }
      );

      const data =
        await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.detail ||
            "Unable to submit your rating."
        );
      }

      setRatingSuccess(
        "Thank you for rating your order."
      );

      setTimeout(() => {
        setRatingOpen(false);
      }, 1200);
    } catch (err) {
      console.error("Rating error:", err);

      setRatingError(
        err.message ||
          "Unable to submit your rating."
      );
    } finally {
      setSubmittingRating(false);
    }
  };

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  if (!authChecked || loading) {
    return (
      <main className="min-h-screen bg-dark-950 text-ivory-100 pt-[105px] pb-20 px-5 sm:px-7">
        <div className="max-w-5xl mx-auto">

          <div className="h-4 w-32 bg-white/5 animate-pulse mb-6" />

          <div className="h-10 w-72 bg-white/5 animate-pulse mb-10" />

          <div className="grid lg:grid-cols-[1fr_320px] gap-6">

            <div className="h-[520px] bg-dark-900 border border-white/10 animate-pulse" />

            <div className="h-[360px] bg-dark-900 border border-white/10 animate-pulse" />

          </div>

        </div>
      </main>
    );
  }

  // --------------------------------------------------
  // ERROR
  // --------------------------------------------------

  if (error) {
    return (
      <main className="min-h-screen bg-dark-950 text-ivory-100 pt-[120px] pb-20 px-5">

        <div className="max-w-xl mx-auto text-center">

          <div className="w-16 h-16 mx-auto rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-6">
            <XCircle
              size={25}
              className="text-red-400"
            />
          </div>

          <p className="text-brand-400 text-[10px] uppercase tracking-[0.3em] mb-3">
            Atulyam Restaurant
          </p>

          <h1 className="font-serif text-3xl text-white">
            Order Not Found
          </h1>

          <p className="text-sm text-ivory-600 mt-3">
            {error}
          </p>

          <Link
            to="/customer/orders"
            className="inline-flex items-center gap-2 mt-7 bg-brand-500 hover:bg-brand-400 text-dark-950 font-semibold text-sm px-6 py-3.5 transition"
          >
            <ArrowLeft size={16} />
            Back to My Orders
          </Link>

        </div>

      </main>
    );
  }

  if (!order) return null;

  const status = getStatus(order.status);
  const StatusIcon = status.icon;

  return (
    <>
      <main className="min-h-screen bg-dark-950 text-ivory-100 pt-[100px] pb-20 px-5 sm:px-7">

        <div className="max-w-5xl mx-auto">

          {/* BACK */}

          <Link
            to="/customer/orders"
            className="inline-flex items-center gap-2 text-xs text-ivory-500 hover:text-brand-400 transition mb-7"
          >
            <ArrowLeft size={15} />
            My Orders
          </Link>

          {/* HEADER */}

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-8">

            <div>

              <p className="text-brand-400 text-[10px] uppercase tracking-[0.3em] font-semibold mb-3">
                Order Details
              </p>

              <h1 className="font-serif text-3xl sm:text-4xl text-white">
                {order.order_number}
              </h1>

              <p className="text-xs text-ivory-600 mt-2">
                Placed on{" "}
                {formatDate(order.created_at)}
                {" · "}
                {formatTime(order.created_at)}
              </p>

            </div>

            <div
              className={`inline-flex items-center gap-2 self-start sm:self-auto border px-4 py-2.5 text-[10px] uppercase tracking-[0.12em] ${status.className}`}
            >
              <StatusIcon size={14} />
              {status.label}
            </div>

          </div>

          <div className="grid lg:grid-cols-[1fr_320px] gap-6">

            {/* LEFT */}

            <div className="space-y-5">

              {/* ACTIVE ORDER */}

              {isActive && (
                <section className="bg-dark-900 border border-brand-500/25">

                  <div className="px-6 sm:px-7 py-5 border-b border-white/[0.08]">

                    <div className="flex items-center gap-3">

                      <div className="w-9 h-9 rounded-full bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
                        <Truck
                          size={16}
                          className="text-brand-400"
                        />
                      </div>

                      <div>
                        <p className="text-sm text-white font-medium">
                          Your order is in progress
                        </p>

                        <p className="text-[11px] text-ivory-600 mt-1">
                          Track your order for the latest delivery status.
                        </p>
                      </div>

                    </div>

                  </div>

                  <div className="px-6 sm:px-7 py-5">

                    <Link
                      to={`/order-tracking/${order.order_number}`}
                      className="w-full inline-flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-400 text-dark-950 font-semibold text-xs px-5 py-3.5 transition"
                    >
                      Track Your Order
                      <ChevronRight size={15} />
                    </Link>

                  </div>

                </section>
              )}

              {/* ITEMS */}

              <section className="bg-dark-900 border border-white/10">

                <div className="px-6 sm:px-7 py-5 border-b border-white/[0.08]">

                  <div className="flex items-center justify-between">

                    <div className="flex items-center gap-3">

                      <ClipboardList
                        size={17}
                        className="text-brand-400"
                      />

                      <h2 className="text-sm text-white font-medium">
                        Order Items
                      </h2>

                    </div>

                    <span className="text-[10px] text-ivory-600">
                      {totalItems} items
                    </span>

                  </div>

                </div>

                <div className="divide-y divide-white/[0.06]">

                  {order.items?.map((item) => (
                    <div
                      key={item.id}
                      className="px-6 sm:px-7 py-5 flex items-center justify-between gap-5"
                    >

                      <div className="flex items-start gap-4 min-w-0">

                        <div className="w-9 h-9 bg-white/[0.03] border border-white/[0.07] flex items-center justify-center shrink-0">
                          <Package
                            size={15}
                            className="text-ivory-500"
                          />
                        </div>

                        <div className="min-w-0">

                          <p className="text-sm text-white">
                            {item.item_name}
                          </p>

                          <p className="text-xs text-ivory-600 mt-1">
                            ₹
                            {Number(
                              item.unit_price || 0
                            ).toFixed(2)}
                            {" × "}
                            {item.quantity}
                          </p>

                        </div>

                      </div>

                      <p className="text-sm text-white shrink-0">
                        ₹
                        {Number(
                          item.subtotal || 0
                        ).toFixed(2)}
                      </p>

                    </div>
                  ))}

                </div>

              </section>

              {/* BILL */}

              <section className="bg-dark-900 border border-white/10">

                <div className="px-6 sm:px-7 py-5 border-b border-white/[0.08]">

                  <div className="flex items-center gap-3">

                    <FileText
                      size={17}
                      className="text-brand-400"
                    />

                    <h2 className="text-sm text-white font-medium">
                      Bill Details
                    </h2>

                  </div>

                </div>

                <div className="px-6 sm:px-7 py-6 space-y-4">

                  <div className="flex justify-between text-sm">

                    <span className="text-ivory-600">
                      Subtotal
                    </span>

                    <span className="text-ivory-300">
                      ₹
                      {Number(
                        order.subtotal || 0
                      ).toFixed(2)}
                    </span>

                  </div>

                  {Number(order.discount_amount) > 0 && (
                    <div className="flex justify-between text-sm">

                      <span className="text-green-400">
                        Discount
                      </span>

                      <span className="text-green-400">
                        − ₹
                        {Number(
                          order.discount_amount
                        ).toFixed(2)}
                      </span>

                    </div>
                  )}

                  <div className="flex justify-between text-sm">

                    <span className="text-ivory-600">
                      Tax
                    </span>

                    <span className="text-ivory-300">
                      ₹
                      {Number(
                        order.tax_amount || 0
                      ).toFixed(2)}
                    </span>

                  </div>

                  <div className="pt-4 border-t border-white/[0.08] flex justify-between items-end">

                    <span className="text-sm text-white font-medium">
                      Total
                    </span>

                    <span className="font-serif text-2xl text-brand-400">
                      ₹
                      {Number(
                        order.total_amount || 0
                      ).toFixed(2)}
                    </span>

                  </div>

                </div>

              </section>

            </div>

            {/* RIGHT */}

            <aside className="space-y-5">

              {/* DELIVERY */}

              <section className="bg-dark-900 border border-white/10">

                <div className="px-5 py-5 border-b border-white/[0.08]">

                  <div className="flex items-center gap-3">

                    <MapPin
                      size={17}
                      className="text-brand-400"
                    />

                    <h2 className="text-sm text-white font-medium">
                      Delivery Address
                    </h2>

                  </div>

                </div>

                <div className="px-5 py-5">

                  <p className="text-sm text-white leading-relaxed">
                    {order.delivery_address}
                  </p>

                  {order.customer_phone && (
                    <p className="text-xs text-ivory-600 mt-3">
                      {order.customer_phone}
                    </p>
                  )}

                </div>

              </section>

              {/* PAYMENT */}

              <section className="bg-dark-900 border border-white/10">

                <div className="px-5 py-5 border-b border-white/[0.08]">

                  <div className="flex items-center gap-3">

                    <CreditCard
                      size={17}
                      className="text-brand-400"
                    />

                    <h2 className="text-sm text-white font-medium">
                      Payment
                    </h2>

                  </div>

                </div>

                <div className="px-5 py-5">

                  <p className="text-sm text-white">
                    {order.payment_method ||
                      "Cash on Delivery"}
                  </p>

                  <p
                    className={`text-[10px] uppercase tracking-[0.14em] mt-2 ${
                      order.payment_status?.toLowerCase() ===
                      "paid"
                        ? "text-green-400"
                        : "text-ivory-600"
                    }`}
                  >
                    {order.payment_status ||
                      "Unpaid"}
                  </p>

                </div>

              </section>

              {/* ACTIONS */}

              <section className="bg-dark-900 border border-white/10 p-5 space-y-3">

                {/* DELIVERED */}

                {isDelivered && (
                  <>
                    <button
                      type="button"
                      onClick={openRatingModal}
                      className="w-full inline-flex items-center justify-center gap-2 border border-brand-500/30 text-brand-400 hover:bg-brand-500/10 px-4 py-3 text-xs font-medium transition"
                    >
                      <Star size={15} />
                      Rate Your Order
                    </button>

                    <button
                      type="button"
                      onClick={handleReorder}
                      disabled={reordering}
                      className="w-full inline-flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-400 disabled:opacity-60 text-dark-950 px-4 py-3 text-xs font-semibold transition"
                    >
                      <RotateCcw
                        size={15}
                        className={
                          reordering
                            ? "animate-spin"
                            : ""
                        }
                      />

                      {reordering
                        ? "Adding to Cart..."
                        : "Reorder"}
                    </button>
                  </>
                )}

                {/* ACTIVE */}

                {isActive && (
                  <Link
                    to={`/order-tracking/${order.order_number}`}
                    className="w-full inline-flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-400 text-dark-950 px-4 py-3 text-xs font-semibold transition"
                  >
                    Track Your Order
                    <ChevronRight size={15} />
                  </Link>
                )}

              </section>

            </aside>

          </div>

        </div>

      </main>

      {/* --------------------------------------------------
          RATING MODAL
      -------------------------------------------------- */}

      {ratingOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/75 backdrop-blur-sm flex items-center justify-center px-5"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              setRatingOpen(false);
            }
          }}
        >

          <div className="w-full max-w-md bg-dark-900 border border-white/10 shadow-2xl">

            {/* MODAL HEADER */}

            <div className="px-6 sm:px-7 py-6 border-b border-white/[0.08]">

              <div className="flex items-start justify-between gap-5">

                <div>

                  <p className="text-brand-400 text-[10px] uppercase tracking-[0.25em] mb-2">
                    Atulyam Restaurant
                  </p>

                  <h2 className="font-serif text-2xl text-white">
                    Rate Your Order
                  </h2>

                  <p className="text-xs text-ivory-600 mt-2">
                    How was your experience with this order?
                  </p>

                </div>

                <button
                  type="button"
                  onClick={() =>
                    setRatingOpen(false)
                  }
                  className="w-8 h-8 flex items-center justify-center text-ivory-600 hover:text-white border border-white/10 hover:border-white/20 transition text-xl"
                >
                  ×
                </button>

              </div>

            </div>

            {/* MODAL BODY */}

            <div className="px-6 sm:px-7 py-7">

              {/* STARS */}

              <div className="text-center">

                <p className="text-[10px] uppercase tracking-[0.2em] text-ivory-600 mb-4">
                  Your Rating
                </p>

                <div className="flex justify-center gap-2">

                  {[1, 2, 3, 4, 5].map(
                    (star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() =>
                          setRating(star)
                        }
                        className="p-1 transition hover:scale-110"
                        aria-label={`${star} star`}
                      >
                        <Star
                          size={30}
                          className={
                            star <= rating
                              ? "text-brand-400 fill-brand-400"
                              : "text-ivory-700"
                          }
                        />
                      </button>
                    )
                  )}

                </div>

                {rating > 0 && (
                  <p className="text-xs text-brand-400 mt-3">
                    {rating === 1 &&
                      "Poor"}
                    {rating === 2 &&
                      "Could be better"}
                    {rating === 3 &&
                      "Good"}
                    {rating === 4 &&
                      "Very good"}
                    {rating === 5 &&
                      "Excellent"}
                  </p>
                )}

              </div>

              {/* REVIEW */}

              <div className="mt-7">

                <label className="block text-[10px] uppercase tracking-[0.16em] text-ivory-500 mb-2">
                  Review
                  <span className="text-ivory-700 ml-1">
                    Optional
                  </span>
                </label>

                <textarea
                  value={review}
                  onChange={(e) =>
                    setReview(
                      e.target.value.slice(
                        0,
                        500
                      )
                    )
                  }
                  placeholder="Tell us about your experience..."
                  rows={4}
                  className="w-full bg-dark-950 border border-white/10 focus:border-brand-500/40 outline-none text-sm text-white placeholder:text-ivory-700 px-4 py-3 resize-none transition"
                />

                <div className="flex justify-end mt-1">
                  <span className="text-[10px] text-ivory-700">
                    {review.length}/500
                  </span>
                </div>

              </div>

              {/* ERRORS */}

              {ratingError && (
                <div className="mt-4 border border-red-500/20 bg-red-500/10 px-4 py-3">
                  <p className="text-xs text-red-300">
                    {ratingError}
                  </p>
                </div>
              )}

              {/* SUCCESS */}

              {ratingSuccess && (
                <div className="mt-4 border border-green-500/20 bg-green-500/10 px-4 py-3">
                  <p className="text-xs text-green-300">
                    {ratingSuccess}
                  </p>
                </div>
              )}

              {/* SUBMIT */}

              <button
                type="button"
                onClick={submitRating}
                disabled={
                  !rating ||
                  submittingRating ||
                  !!ratingSuccess
                }
                className="w-full mt-5 bg-brand-500 hover:bg-brand-400 disabled:opacity-50 text-dark-950 font-semibold text-sm py-3.5 transition"
              >
                {submittingRating
                  ? "Submitting..."
                  : ratingSuccess
                  ? "Rating Submitted"
                  : "Submit Rating"}
              </button>

            </div>

          </div>

        </div>
      )}

    </>
  );
};

export default CustomerOrderDetailsPage;