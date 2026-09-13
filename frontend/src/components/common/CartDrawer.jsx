import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ShoppingBag,
  ArrowRight,
  Trash2,
  Plus,
  Minus,
  Tag,
  Check,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext.jsx";

const API_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api/v1";

const formatPrice = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export const CartDrawer = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    items,
    updateQuantity,
    removeFromCart,
    cartSubtotal,
    cartCount,
    appliedCoupon,
    setAppliedCoupon,
  } = useCart();

  const [promoCode, setPromoCode] = useState("");
  const [promoError, setPromoError] = useState("");
  const [promoLoading, setPromoLoading] = useState(false);

  const [showOffers, setShowOffers] = useState(false);
  const [availableOffers, setAvailableOffers] = useState([]);
  const [offersLoading, setOffersLoading] = useState(false);

  // =========================================
  // DISCOUNT CALCULATION
  // =========================================

  const discountAmount = appliedCoupon
    ? Math.min(
        cartSubtotal,
        (cartSubtotal *
          Number(appliedCoupon.discount_percentage || 0)) /
          100
      )
    : 0;

  const finalTotal = Math.max(
    0,
    cartSubtotal - discountAmount
  );

  // =========================================
  // FETCH AVAILABLE OFFERS
  // =========================================

  const fetchAvailableOffers = async () => {
    try {
      setOffersLoading(true);

      const response = await fetch(
        `${API_URL}/offers?active_only=true`
      );

      if (!response.ok) {
        throw new Error("Failed to load offers");
      }

      const data = await response.json();

      const now = new Date();

      const validOffers = data.filter((offer) => {
        if (!offer.is_active) return false;

        const start = offer.valid_from
          ? new Date(offer.valid_from)
          : null;

        const end = offer.valid_until
          ? new Date(offer.valid_until)
          : null;

        if (start && now < start) return false;
        if (end && now > end) return false;

        return true;
      });

      setAvailableOffers(validOffers);
    } catch (error) {
      console.error("Offers error:", error);
      setAvailableOffers([]);
    } finally {
      setOffersLoading(false);
    }
  };

  // =========================================
  // APPLY COUPON
  // =========================================

  const handleApplyPromo = async (codeOverride = null) => {
    const code = (
      codeOverride !== null ? codeOverride : promoCode
    )
      .trim()
      .toUpperCase();

    if (!code) {
      setPromoError("Please enter a coupon code.");
      return;
    }

    if (cartSubtotal <= 0) {
      setPromoError("Add items to your cart first.");
      return;
    }

    try {
      setPromoLoading(true);
      setPromoError("");

      const response = await fetch(
        `${API_URL}/offers/validate/${encodeURIComponent(
          code
        )}?order_amount=${cartSubtotal}`
      );

      const data = await response.json();

      if (!response.ok || !data.valid) {
        setAppliedCoupon(null);

        setPromoError(
          data.message || "This coupon is not valid."
        );

        return;
      }

      // Save coupon in CartContext
      // so CheckoutPage can access it.
      setAppliedCoupon({
        code: data.code || code,
        discount_percentage: Number(
          data.discount_percentage || 0
        ),
        message:
          data.message || "Offer applied successfully.",
        min_order_amount: Number(
          data.min_order_amount || 0
        ),
      });

      setPromoCode(data.code || code);
      setPromoError("");
    } catch (error) {
      console.error("Coupon validation error:", error);

      setAppliedCoupon(null);

      setPromoError(
        "Unable to validate coupon. Please try again."
      );
    } finally {
      setPromoLoading(false);
    }
  };

  // =========================================
  // REMOVE COUPON
  // =========================================

  const handleRemovePromo = () => {
    setAppliedCoupon(null);
    setPromoCode("");
    setPromoError("");
  };

  // =========================================
  // APPLY OFFER FROM LIST
  // =========================================

  const handleSelectOffer = (offer) => {
    const minimum = Number(
      offer.min_order_amount || 0
    );

    if (cartSubtotal < minimum) {
      setPromoError(
        `Minimum order of ${formatPrice(
          minimum
        )} required for this offer.`
      );

      setShowOffers(false);
      return;
    }

    setPromoCode(offer.code);
    setShowOffers(false);

    handleApplyPromo(offer.code);
  };

  // =========================================
  // CART CHANGE VALIDATION
  // =========================================

  useEffect(() => {
    if (!appliedCoupon) return;

    const minimum = Number(
      appliedCoupon.min_order_amount || 0
    );

    if (minimum > 0 && cartSubtotal < minimum) {
      setAppliedCoupon(null);

      setPromoError(
        `Coupon removed. Minimum order is ${formatPrice(
          minimum
        )}.`
      );
    }
  }, [
    cartSubtotal,
    appliedCoupon,
    setAppliedCoupon,
  ]);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-[100] overflow-hidden">

          {/* =========================================
              BACKDROP
          ========================================= */}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setIsCartOpen(false)}
            className="absolute inset-0 bg-black/75 backdrop-blur-sm"
          />

          {/* =========================================
              DRAWER
          ========================================= */}

          <div className="fixed inset-y-0 right-0 flex w-full max-w-full">

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{
                type: "spring",
                damping: 28,
                stiffness: 260,
              }}
              className="
                ml-auto
                h-full
                w-full
                sm:w-[420px]
                max-w-full
                bg-[#090909]
                border-l border-white/10
                shadow-2xl
                flex flex-col
                overflow-hidden
              "
            >

              {/* =========================================
                  HEADER
              ========================================= */}

              <div
                className="
                  shrink-0
                  px-4 sm:px-6
                  py-4 sm:py-5
                  border-b border-white/10
                  flex items-center justify-between
                "
              >
                <div className="flex items-center gap-2.5 min-w-0">

                  <ShoppingBag
                    className="w-5 h-5 text-[#f28a2e] shrink-0"
                  />

                  <h3
                    className="
                      font-serif
                      text-base sm:text-lg
                      font-semibold
                      tracking-wider
                      uppercase
                      text-white
                      truncate
                    "
                  >
                    Your Order ({cartCount})
                  </h3>

                </div>

                <button
                  onClick={() => setIsCartOpen(false)}
                  className="
                    ml-3
                    shrink-0
                    w-9
                    h-9
                    rounded-full
                    border border-white/10
                    flex items-center justify-center
                    text-white/60
                    hover:text-white
                    hover:bg-white/5
                    transition-colors
                  "
                  aria-label="Close cart"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* =========================================
                  CART CONTENT
              ========================================= */}

              <div
                className="
                  flex-1
                  min-h-0
                  overflow-y-auto
                  overscroll-contain
                  px-4 sm:px-6
                  py-4 sm:py-6
                "
              >
                {items.length === 0 ? (

                  /* EMPTY CART */

                  <div
                    className="
                      h-full
                      min-h-[400px]
                      flex
                      flex-col
                      items-center
                      justify-center
                      text-center
                      px-4
                      text-white/50
                    "
                  >
                    <div
                      className="
                        w-16 h-16
                        rounded-full
                        bg-white/[0.03]
                        border border-white/10
                        flex items-center justify-center
                        mb-4
                      "
                    >
                      <ShoppingBag
                        className="w-8 h-8 text-white/30"
                      />
                    </div>

                    <h4
                      className="
                        text-white
                        font-serif
                        text-lg
                        mb-2
                      "
                    >
                      Your cart is empty
                    </h4>

                    <p
                      className="
                        text-xs
                        text-white/40
                        max-w-[280px]
                        leading-6
                        mb-6
                      "
                    >
                      Explore our handcrafted delicacies
                      and add your favorite dishes to your
                      order.
                    </p>

                    <Link
                      to="/menu"
                      onClick={() => setIsCartOpen(false)}
                      className="
                        text-[10px]
                        tracking-[0.2em]
                        uppercase
                        px-5
                        py-3
                        rounded-full
                        bg-[#f28a2e]
                        hover:bg-[#ff9a45]
                        text-black
                        font-semibold
                        transition-all
                      "
                    >
                      Browse Menu
                    </Link>
                  </div>

                ) : (

                  <>
                    {/* =====================================
                        CART ITEMS
                    ===================================== */}

                    <div className="space-y-3 sm:space-y-4">

                      {items.map((item) => (
                        <div
                          key={item.id}
                          className="
                            w-full
                            p-3 sm:p-3.5
                            rounded-xl
                            bg-[#101010]
                            border border-white/[0.07]
                          "
                        >

                          {/* ITEM TOP */}

                          <div
                            className="
                              flex
                              items-start
                              justify-between
                              gap-3
                            "
                          >
                            <div className="flex-1 min-w-0">

                              <div className="flex items-center gap-2">

                                <span
                                  className={`
                                    w-2 h-2
                                    rounded-full
                                    shrink-0
                                    ${
                                      item.is_veg || item.veg
                                        ? "bg-emerald-400"
                                        : "bg-rose-400"
                                    }
                                  `}
                                />

                                <h4
                                  className="
                                    text-sm
                                    font-medium
                                    text-white
                                    truncate
                                  "
                                >
                                  {item.name}
                                </h4>

                              </div>

                              <p
                                className="
                                  text-xs
                                  text-[#f28a2e]
                                  mt-1
                                  font-mono
                                "
                              >
                                {formatPrice(item.price)}
                              </p>

                            </div>

                            <button
                              onClick={() =>
                                removeFromCart(item.id)
                              }
                              className="
                                shrink-0
                                w-8 h-8
                                rounded-full
                                flex items-center justify-center
                                text-white/30
                                hover:text-red-400
                                hover:bg-red-400/10
                                transition-colors
                              "
                              aria-label={`Remove ${item.name}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>

                          </div>

                          {/* QUANTITY */}

                          <div
                            className="
                              mt-3
                              flex
                              items-center
                              justify-between
                              gap-3
                            "
                          >

                            <div
                              className="
                                flex
                                items-center
                                bg-[#171717]
                                rounded-lg
                                border border-white/[0.07]
                                overflow-hidden
                              "
                            >
                              <button
                                onClick={() =>
                                  updateQuantity(
                                    item.id,
                                    item.quantity - 1
                                  )
                                }
                                className="
                                  w-9 h-9
                                  flex items-center justify-center
                                  text-white/50
                                  hover:text-white
                                  hover:bg-white/10
                                  transition-colors
                                "
                                aria-label="Decrease quantity"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>

                              <span
                                className="
                                  w-8
                                  text-center
                                  text-xs
                                  font-semibold
                                  text-white
                                "
                              >
                                {item.quantity}
                              </span>

                              <button
                                onClick={() =>
                                  updateQuantity(
                                    item.id,
                                    item.quantity + 1
                                  )
                                }
                                className="
                                  w-9 h-9
                                  flex items-center justify-center
                                  text-white/50
                                  hover:text-white
                                  hover:bg-white/10
                                  transition-colors
                                "
                                aria-label="Increase quantity"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <span
                              className="
                                text-sm
                                font-serif
                                font-semibold
                                text-white
                              "
                            >
                              {formatPrice(
                                Number(item.price) *
                                  Number(item.quantity)
                              )}
                            </span>

                          </div>
                        </div>
                      ))}

                    </div>

                    {/* =====================================
                        COUPON SECTION
                    ===================================== */}

                    <div
                      className="
                        mt-5
                        pt-5
                        border-t border-white/10
                      "
                    >

                      <div
                        className="
                          flex
                          items-center
                          justify-between
                          gap-3
                          mb-3
                        "
                      >

                        <div className="flex items-center gap-2.5">

                          <div
                            className="
                              w-8 h-8
                              flex items-center justify-center
                              rounded-lg
                              bg-[#f28a2e]/10
                              text-[#f28a2e]
                            "
                          >
                            <Tag className="w-4 h-4" />
                          </div>

                          <div>
                            <p className="text-sm text-white/85">
                              Have a coupon?
                            </p>

                            <p
                              className="
                                text-[10px]
                                text-white/30
                                mt-0.5
                              "
                            >
                              Save more on your order
                            </p>
                          </div>

                        </div>

                        <button
                          onClick={() => {
                            setShowOffers(true);
                            fetchAvailableOffers();
                          }}
                          className="
                            text-[9px]
                            sm:text-[10px]
                            uppercase
                            tracking-wider
                            text-[#f28a2e]
                            hover:text-white
                            transition-colors
                            whitespace-nowrap
                          "
                        >
                          View offers
                        </button>

                      </div>

                      {/* NO COUPON */}

                      {!appliedCoupon ? (

                        <div className="flex gap-2">

                          <input
                            value={promoCode}
                            onChange={(e) => {
                              setPromoCode(
                                e.target.value.toUpperCase()
                              );
                              setPromoError("");
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                handleApplyPromo();
                              }
                            }}
                            placeholder="Enter coupon code"
                            className="
                              flex-1
                              min-w-0
                              bg-white/[0.04]
                              border border-white/10
                              rounded-lg
                              px-3.5
                              py-3
                              text-xs
                              tracking-wider
                              text-white
                              placeholder:text-white/25
                              outline-none
                              focus:border-[#f28a2e]/60
                              transition-colors
                            "
                          />

                          <button
                            onClick={() =>
                              handleApplyPromo()
                            }
                            disabled={promoLoading}
                            className="
                              shrink-0
                              px-4
                              rounded-lg
                              bg-[#f28a2e]
                              hover:bg-[#ff9a45]
                              text-black
                              text-[10px]
                              uppercase
                              tracking-wider
                              font-semibold
                              disabled:opacity-50
                              transition-colors
                            "
                          >
                            {promoLoading
                              ? "..."
                              : "Apply"}
                          </button>

                        </div>

                      ) : (

                        /* APPLIED COUPON */

                        <div
                          className="
                            border
                            border-[#f28a2e]/30
                            bg-[#f28a2e]/[0.06]
                            rounded-lg
                            px-3.5
                            py-3
                            flex
                            items-center
                            justify-between
                            gap-3
                          "
                        >

                          <div
                            className="
                              flex
                              items-center
                              gap-2.5
                              min-w-0
                            "
                          >

                            <div
                              className="
                                w-7 h-7
                                rounded-full
                                bg-[#f28a2e]/10
                                flex items-center justify-center
                                shrink-0
                              "
                            >
                              <Check
                                className="
                                  w-3.5 h-3.5
                                  text-[#f28a2e]
                                "
                              />
                            </div>

                            <div className="min-w-0">

                              <p
                                className="
                                  text-xs
                                  text-white
                                  font-medium
                                  truncate
                                "
                              >
                                {appliedCoupon.code}
                              </p>

                              <p
                                className="
                                  text-[10px]
                                  text-[#f28a2e]
                                  mt-0.5
                                "
                              >
                                {
                                  appliedCoupon.discount_percentage
                                }
                                % discount applied
                              </p>

                            </div>

                          </div>

                          <button
                            onClick={handleRemovePromo}
                            className="
                              text-white/30
                              hover:text-white
                              transition-colors
                            "
                            aria-label="Remove coupon"
                          >
                            <X className="w-4 h-4" />
                          </button>

                        </div>
                      )}

                      {promoError && (
                        <p
                          className="
                            text-[10px]
                            text-red-400
                            mt-2
                            leading-4
                          "
                        >
                          {promoError}
                        </p>
                      )}

                    </div>
                  </>
                )}
              </div>

              {/* =========================================
                  FOOTER
              ========================================= */}

              {items.length > 0 && (
                <div
                  className="
                    shrink-0
                    px-4 sm:px-6
                    pt-4 sm:pt-5
                    pb-[max(1rem,env(safe-area-inset-bottom))]
                    border-t border-white/10
                    bg-[#080808]
                  "
                >

                  {/* SUBTOTAL */}

                  <div
                    className="
                      flex
                      justify-between
                      items-center
                      gap-4
                      mb-2
                    "
                  >
                    <span
                      className="
                        text-xs
                        sm:text-sm
                        text-white/50
                      "
                    >
                      Subtotal
                    </span>

                    <span
                      className={`
                        text-sm
                        sm:text-base
                        font-serif
                        whitespace-nowrap
                        ${
                          discountAmount > 0
                            ? "text-white/40 line-through"
                            : "text-white font-semibold"
                        }
                      `}
                    >
                      {formatPrice(cartSubtotal)}
                    </span>
                  </div>

                  {/* DISCOUNT */}

                  {discountAmount > 0 && (
                    <div
                      className="
                        flex
                        justify-between
                        items-center
                        gap-4
                        mb-2
                      "
                    >
                      <span
                        className="
                          text-xs
                          sm:text-sm
                          text-[#f28a2e]
                        "
                      >
                        Discount
                      </span>

                      <span
                        className="
                          text-sm
                          sm:text-base
                          font-serif
                          font-semibold
                          text-[#f28a2e]
                          whitespace-nowrap
                        "
                      >
                        -{formatPrice(discountAmount)}
                      </span>
                    </div>
                  )}

                  {/* TOTAL */}

                  <div
                    className="
                      flex
                      justify-between
                      items-center
                      gap-4
                      pt-2
                      border-t border-white/[0.08]
                    "
                  >
                    <span
                      className="
                        text-sm
                        sm:text-base
                        text-white
                      "
                    >
                      Total
                    </span>

                    <span
                      className="
                        text-lg
                        sm:text-xl
                        font-serif
                        font-bold
                        text-[#f28a2e]
                        whitespace-nowrap
                      "
                    >
                      {formatPrice(finalTotal)}
                    </span>
                  </div>

                  {/* SAVINGS */}

                  {discountAmount > 0 && (
                    <p
                      className="
                        text-[10px]
                        text-white/25
                        mt-1.5
                        mb-2
                        text-right
                      "
                    >
                      You saved{" "}
                      {formatPrice(discountAmount)}
                    </p>
                  )}

                  <p
                    className="
                      text-[10px]
                      sm:text-[11px]
                      leading-5
                      text-white/30
                      mb-4
                    "
                  >
                    Taxes and delivery charges are
                    calculated during checkout.
                  </p>

                  {/* CHECKOUT */}

                  <Link
                    to="/checkout"
                    onClick={() => setIsCartOpen(false)}
                    className="
                      w-full
                      min-h-[48px]
                      flex
                      items-center
                      justify-center
                      gap-2
                      px-4
                      py-3
                      rounded-full
                      bg-[#f28a2e]
                      hover:bg-[#ff9a45]
                      text-black
                      font-semibold
                      text-[10px]
                      sm:text-xs
                      uppercase
                      tracking-[0.16em]
                      transition-all
                    "
                  >
                    Proceed to Checkout

                    <ArrowRight
                      className="w-4 h-4 shrink-0"
                    />
                  </Link>

                </div>
              )}
            </motion.div>
          </div>

          {/* =============================================
              AVAILABLE OFFERS MODAL
          ============================================= */}

          <AnimatePresence>
            {showOffers && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowOffers(false)}
                className="
                  fixed
                  inset-0
                  z-[150]
                  bg-black/80
                  backdrop-blur-md
                  flex
                  items-center
                  justify-center
                  p-4
                "
              >
                <motion.div
                  initial={{
                    opacity: 0,
                    y: 20,
                    scale: 0.98,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                  }}
                  exit={{
                    opacity: 0,
                    y: 20,
                    scale: 0.98,
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className="
                    w-full
                    max-w-md
                    max-h-[75vh]
                    overflow-hidden
                    bg-[#111]
                    border border-white/10
                    shadow-2xl
                  "
                >

                  {/* MODAL HEADER */}

                  <div
                    className="
                      px-5
                      py-4
                      border-b border-white/10
                      flex
                      items-center
                      justify-between
                    "
                  >

                    <div className="flex items-center gap-2.5">

                      <Sparkles
                        size={16}
                        className="text-[#f28a2e]"
                      />

                      <div>

                        <p
                          className="
                            text-[9px]
                            uppercase
                            tracking-[0.2em]
                            text-[#f28a2e]
                          "
                        >
                          Save on your order
                        </p>

                        <h3
                          className="
                            font-serif
                            text-xl
                            text-white
                          "
                        >
                          Available Offers
                        </h3>

                      </div>
                    </div>

                    <button
                      onClick={() => setShowOffers(false)}
                      className="
                        w-8 h-8
                        border border-white/10
                        flex items-center justify-center
                        text-white/50
                        hover:text-white
                        hover:bg-white/5
                      "
                      aria-label="Close offers"
                    >
                      <X size={15} />
                    </button>

                  </div>

                  {/* OFFERS */}

                  <div
                    className="
                      overflow-y-auto
                      max-h-[60vh]
                      p-4
                      space-y-3
                    "
                  >

                    {offersLoading ? (

                      <div className="py-10 text-center">

                        <div
                          className="
                            w-7 h-7
                            border-2
                            border-white/10
                            border-t-[#f28a2e]
                            rounded-full
                            animate-spin
                            mx-auto
                          "
                        />

                        <p
                          className="
                            text-white/35
                            text-xs
                            mt-4
                          "
                        >
                          Loading offers...
                        </p>

                      </div>

                    ) : availableOffers.length === 0 ? (

                      <div className="py-10 text-center">

                        <Tag
                          size={26}
                          className="mx-auto text-white/20"
                        />

                        <p
                          className="
                            text-white/45
                            text-sm
                            mt-4
                          "
                        >
                          No active offers right now.
                        </p>

                      </div>

                    ) : (

                      availableOffers.map((offer) => {

                        const minimum = Number(
                          offer.min_order_amount || 0
                        );

                        const meetsMinimum =
                          cartSubtotal >= minimum;

                        return (
                          <div
                            key={offer.id}
                            className="
                              p-4
                              border border-white/10
                              bg-white/[0.02]
                              rounded-lg
                            "
                          >

                            <div
                              className="
                                flex
                                items-start
                                justify-between
                                gap-4
                              "
                            >

                              <div className="min-w-0">

                                <p
                                  className="
                                    text-[#f28a2e]
                                    text-2xl
                                    font-serif
                                  "
                                >
                                  {offer.discount_percentage}%

                                  <span
                                    className="
                                      text-xs
                                      text-white/35
                                      ml-1
                                    "
                                  >
                                    OFF
                                  </span>
                                </p>

                                <h4
                                  className="
                                    text-sm
                                    text-white
                                    mt-1
                                  "
                                >
                                  {offer.title}
                                </h4>

                                {offer.description && (
                                  <p
                                    className="
                                      text-[10px]
                                      text-white/35
                                      mt-1.5
                                      leading-4
                                    "
                                  >
                                    {offer.description}
                                  </p>
                                )}

                              </div>

                              <div
                                className="
                                  shrink-0
                                  text-right
                                "
                              >

                                <p
                                  className="
                                    text-[9px]
                                    uppercase
                                    tracking-wider
                                    text-white/25
                                  "
                                >
                                  Code
                                </p>

                                <p
                                  className="
                                    text-xs
                                    text-white
                                    tracking-wider
                                    mt-1
                                  "
                                >
                                  {offer.code}
                                </p>

                              </div>

                            </div>

                            <div
                              className="
                                mt-4
                                pt-3
                                border-t border-white/10
                                flex
                                items-center
                                justify-between
                                gap-3
                              "
                            >

                              <div>

                                {minimum > 0 ? (

                                  <p
                                    className="
                                      text-[10px]
                                      text-white/30
                                    "
                                  >
                                    Min. order{" "}
                                    {formatPrice(minimum)}
                                  </p>

                                ) : (

                                  <p
                                    className="
                                      text-[10px]
                                      text-white/30
                                    "
                                  >
                                    No minimum order
                                  </p>

                                )}

                              </div>

                              <button
                                onClick={() =>
                                  handleSelectOffer(offer)
                                }
                                disabled={!meetsMinimum}
                                className={`
                                  px-4
                                  py-2
                                  rounded-full
                                  text-[9px]
                                  uppercase
                                  tracking-wider
                                  font-semibold
                                  transition-all
                                  ${
                                    meetsMinimum
                                      ? "bg-[#f28a2e] text-black hover:bg-white"
                                      : "bg-white/5 text-white/25 cursor-not-allowed"
                                  }
                                `}
                              >
                                {meetsMinimum
                                  ? "Apply"
                                  : "Minimum not met"}
                              </button>

                            </div>
                          </div>
                        );
                      })
                    )}

                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;