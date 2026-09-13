import React, {
  useEffect,
  useMemo,
  useState,
} from "react";
import { motion } from "framer-motion";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  ArrowRight,
  Check,
  MapPin,
  Phone,
  Mail,
  User,
  ShoppingBag,
  CreditCard,
  FileText,
  Tag,
  Navigation,
  Home,
  LocateFixed,
  AlertCircle,
} from "lucide-react";

import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { useCart } from "../../context/CartContext.jsx";
import { useCustomerAuth } from "../../context/CustomerAuthContext.jsx";
import { useCustomerAddress } from "../../context/CustomerAddressContext.jsx";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:8000/api/v1";

const ease = [0.22, 1, 0.36, 1];

const DEFAULT_LOCATION = [
  25.4358,
  81.8463,
];

// ---------------------------------------------
// CUSTOMER MAP MARKER
// ---------------------------------------------

const customerIcon = L.divIcon({
  className: "",
  html: `
    <div style="
      width:42px;
      height:42px;
      border-radius:50%;
      background:#f28a2e;
      border:3px solid #070707;
      box-shadow:
        0 0 0 5px rgba(242,138,46,0.20),
        0 8px 25px rgba(0,0,0,0.45);
      display:flex;
      align-items:center;
      justify-content:center;
    ">
      <div style="
        width:12px;
        height:12px;
        background:#070707;
        border-radius:50%;
      "></div>
    </div>
  `,
  iconSize: [42, 42],
  iconAnchor: [21, 21],
});

// ---------------------------------------------
// MAP LOCATION SELECTOR
// ---------------------------------------------

const LocationMarker = ({
  position,
  setPosition,
  setLocationConfirmed,
}) => {
  useMapEvents({
    click(e) {
      const newPosition = [
        e.latlng.lat,
        e.latlng.lng,
      ];

      setPosition(newPosition);
      setLocationConfirmed(true);
    },
  });

  if (!position) return null;

  return (
    <Marker
      position={position}
      icon={customerIcon}
    />
  );
};

// ---------------------------------------------
// RECENTER MAP
// ---------------------------------------------

const RecenterMap = ({ position }) => {
  const map = useMap();

  useEffect(() => {
    if (!position) return;

    map.flyTo(position, 16, {
      duration: 1.2,
    });
  }, [position, map]);

  return null;
};

// ---------------------------------------------
// PRICE
// ---------------------------------------------

const formatPrice = (value) =>
  `₹${Number(value || 0).toLocaleString(
    "en-IN",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  )}`;

// ---------------------------------------------
// CHECKOUT PAGE
// ---------------------------------------------

const CheckoutPage = () => {
  const navigate = useNavigate();

const {
  items,
  cartSubtotal,
  appliedCoupon,
  clearCart,
} = useCart();

  const {
    customer,
    token,
    isAuthenticated,
    authChecked,
  } = useCustomerAuth();

  const {
    addresses,
    selectedAddress,
    setSelectedAddress,
  } = useCustomerAddress();

  // ---------------------------------------------
  // FORM
  // Only payment + notes remain editable.
  // Customer information comes from account/address.
  // ---------------------------------------------

  const [form, setForm] = useState({
    paymentMethod: "Cash on Delivery",
    notes: "",
  });

  const [placingOrder, setPlacingOrder] =
    useState(false);

  const [error, setError] = useState("");

  // ---------------------------------------------
  // MAP LOCATION
  // ---------------------------------------------

  const [location, setLocation] =
    useState(null);

  const [
    locationConfirmed,
    setLocationConfirmed,
  ] = useState(false);

  const [
    gettingLocation,
    setGettingLocation,
  ] = useState(false);

  const [
    locationMessage,
    setLocationMessage,
  ] = useState("");

  // ---------------------------------------------
  // AUTH REDIRECT
  // ---------------------------------------------

  useEffect(() => {
    if (!authChecked) return;

    if (!isAuthenticated || !token) {
      navigate("/customer/login", {
        state: {
          from: "/checkout",
        },
        replace: true,
      });
    }
  }, [
    authChecked,
    isAuthenticated,
    token,
    navigate,
  ]);

  // ---------------------------------------------
  // AUTO SELECT DEFAULT ADDRESS
  // ---------------------------------------------

  useEffect(() => {
    if (!addresses?.length) return;

    if (selectedAddress) return;

    const defaultAddress =
      addresses.find(
        (address) => address.is_default
      ) || addresses[0];

    if (defaultAddress) {
      setSelectedAddress(defaultAddress);
    }
  }, [
    addresses,
    selectedAddress,
    setSelectedAddress,
  ]);

  // ---------------------------------------------
  // LOAD SELECTED ADDRESS LOCATION
  // ---------------------------------------------

  useEffect(() => {
    if (!selectedAddress) {
      setLocation(null);
      setLocationConfirmed(false);
      return;
    }

    const hasCoordinates =
      selectedAddress.latitude != null &&
      selectedAddress.longitude != null;

    if (hasCoordinates) {
      setLocation([
        Number(selectedAddress.latitude),
        Number(selectedAddress.longitude),
      ]);

      setLocationConfirmed(true);
      setLocationMessage(
        "Delivery location confirmed from your saved address."
      );
    } else {
      setLocation(null);
      setLocationConfirmed(false);
      setLocationMessage("");
    }

    setError("");
  }, [selectedAddress]);

  // ---------------------------------------------
  // COUPON
  // ---------------------------------------------

  const couponCode =
    appliedCoupon?.code || "";

  const discountPercentage = Number(
    appliedCoupon?.discount_percentage || 0
  );

  const discountAmount = useMemo(() => {
    if (
      !appliedCoupon ||
      discountPercentage <= 0
    ) {
      return 0;
    }

    return Number(
      Math.min(
        Number(cartSubtotal),
        (Number(cartSubtotal) *
          discountPercentage) /
          100
      ).toFixed(2)
    );
  }, [
    appliedCoupon,
    cartSubtotal,
    discountPercentage,
  ]);

  // ---------------------------------------------
  // GST
  // ---------------------------------------------

  const gstAmount = useMemo(() => {
    const taxableAmount = Math.max(
      0,
      Number(cartSubtotal) -
        Number(discountAmount)
    );

    return Number(
      (taxableAmount * 0.05).toFixed(2)
    );
  }, [
    cartSubtotal,
    discountAmount,
  ]);

  // ---------------------------------------------
  // FINAL TOTAL
  // ---------------------------------------------

  const finalTotal = useMemo(() => {
    return Number(
      (
        Number(cartSubtotal) -
        Number(discountAmount) +
        Number(gstAmount)
      ).toFixed(2)
    );
  }, [
    cartSubtotal,
    discountAmount,
    gstAmount,
  ]);

  // ---------------------------------------------
  // TOTAL ITEMS
  // ---------------------------------------------

  const totalItems = items.reduce(
    (sum, item) =>
      sum + Number(item.quantity || 0),
    0
  );

  // ---------------------------------------------
  // FORM CHANGE
  // ---------------------------------------------

  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  // ---------------------------------------------
  // SELECT ADDRESS
  // ---------------------------------------------

  const handleSelectAddress = (
    address
  ) => {
    setSelectedAddress(address);

    setError("");
    setLocationMessage("");

    const hasCoordinates =
      address.latitude != null &&
      address.longitude != null;

    if (hasCoordinates) {
      setLocation([
        Number(address.latitude),
        Number(address.longitude),
      ]);

      setLocationConfirmed(true);

      setLocationMessage(
        "Delivery location confirmed from this address."
      );
    } else {
      setLocation(null);
      setLocationConfirmed(false);

      setLocationMessage(
        "Please select your delivery location on the map."
      );
    }
  };

  // ---------------------------------------------
  // CURRENT GPS LOCATION
  // ---------------------------------------------

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setLocationMessage(
        "Location services are not supported by your browser."
      );
      return;
    }

    setGettingLocation(true);
    setLocationMessage("");
    setError("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude =
          position.coords.latitude;

        const longitude =
          position.coords.longitude;

        setLocation([
          latitude,
          longitude,
        ]);

        setLocationConfirmed(true);

        setLocationMessage(
          "Current location selected. You can adjust the pin on the map."
        );

        setGettingLocation(false);
      },
      (geoError) => {
        console.error(
          "GPS error:",
          geoError
        );

        let message =
          "Unable to access your location.";

        if (geoError.code === 1) {
          message =
            "Location permission was denied. Please allow location access in your browser.";
        } else if (geoError.code === 2) {
          message =
            "Your location could not be determined. Please try again.";
        } else if (geoError.code === 3) {
          message =
            "Location request timed out. Please try again.";
        }

        setLocationMessage(message);
        setGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  };

  // ---------------------------------------------
  // PLACE ORDER
  // ---------------------------------------------

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    setError("");

    // CART
    if (!items.length) {
      setError(
        "Your cart is empty."
      );
      return;
    }

    // CUSTOMER LOGIN
    if (!customer || !token) {
      setError(
        "Please sign in before placing your order."
      );
      return;
    }

    // ADDRESS
    if (!selectedAddress) {
      setError(
        "Please select a delivery address."
      );
      return;
    }

    // PHONE
    if (
      !selectedAddress.phone ||
      !/^\d{10}$/.test(
        String(selectedAddress.phone).trim()
      )
    ) {
      setError(
        "Please add a valid 10-digit phone number to your delivery address."
      );
      return;
    }

    // ADDRESS DETAILS
    if (
      !selectedAddress.full_address?.trim()
    ) {
      setError(
        "Your selected delivery address is incomplete."
      );
      return;
    }

    if (
      !selectedAddress.city?.trim()
    ) {
      setError(
        "Your selected delivery address is missing the city."
      );
      return;
    }

    if (
      !selectedAddress.pincode ||
      !/^\d{6}$/.test(
        String(
          selectedAddress.pincode
        ).trim()
      )
    ) {
      setError(
        "Your selected delivery address has an invalid pincode."
      );
      return;
    }

    // MAP LOCATION
    if (
      !location ||
      !locationConfirmed
    ) {
      setError(
        "Please confirm your delivery location on the map."
      );
      return;
    }

    try {
      setPlacingOrder(true);

      const deliveryAddress = [
        selectedAddress.house_number,
        selectedAddress.full_address,
        selectedAddress.city,
        selectedAddress.pincode,
        selectedAddress.landmark
          ? `Landmark: ${selectedAddress.landmark}`
          : null,
      ]
        .filter(Boolean)
        .join(", ");

      const payload = {
        customer_name:
          customer.name.trim(),

        customer_email:
          customer.email.trim(),

        customer_phone:
          selectedAddress.phone.trim(),

        delivery_address:
          deliveryAddress,

        delivery_latitude:
          location[0],

        delivery_longitude:
          location[1],

        coupon_code:
          couponCode.trim() || null,

        payment_method:
          form.paymentMethod,

        notes:
          form.notes.trim() || null,

        items: items.map((item) => ({
          menu_item_id:
            item.id || null,

          item_name:
            item.name,

          unit_price:
            Number(item.price),

          quantity:
            Number(item.quantity),
        })),
      };

      const response = await fetch(
        `${API_URL}/orders`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(
            payload
          ),
        }
      );

      let data = null;

      try {
        data = await response.json();
      } catch {
        data = null;
      }

      if (!response.ok) {
        throw new Error(
          data?.detail ||
            "Unable to place your order."
        );
      }

    if (!data?.order_number) {
  throw new Error(
    "Order was created, but the order number could not be received."
  );
}

// Clear cart only after successful order placement
clearCart();

sessionStorage.setItem(
  "atulyam_last_order",
  JSON.stringify(data)
);

navigate(
  `/order-confirmation/${data.order_number}`
);
    } catch (err) {
      console.error(
        "Order placement error:",
        err
      );

      setError(
        err.message ||
          "Something went wrong while placing your order."
      );
    } finally {
      setPlacingOrder(false);
    }
  };

  // ---------------------------------------------
  // EMPTY CART
  // ---------------------------------------------

  if (!items.length) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
        <div className="text-center max-w-md">

          <ShoppingBag
            size={42}
            className="mx-auto text-[#f28a2e] mb-6"
          />

          <span className="text-[#f28a2e] text-[9px] uppercase tracking-[0.3em]">
            Checkout
          </span>

          <h1 className="font-serif text-4xl mt-4">
            Your cart is empty.
          </h1>

          <p className="text-white/35 text-sm leading-7 mt-4">
            Add something delicious from
            our menu before continuing to
            checkout.
          </p>

          <Link
            to="/order-online"
            className="
              inline-flex
              items-center
              gap-3
              mt-8
              px-7
              h-12
              bg-[#f28a2e]
              hover:bg-white
              text-black
              text-[10px]
              uppercase
              tracking-[0.2em]
              transition-colors
            "
          >
            Browse Menu

            <ArrowRight size={15} />
          </Link>

        </div>
      </main>
    );
  }

  // ---------------------------------------------
  // LOADING AUTH
  // ---------------------------------------------

  if (!authChecked) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">

          <div className="w-8 h-8 border-2 border-white/10 border-t-[#f28a2e] rounded-full animate-spin mx-auto" />

          <p className="text-white/35 text-xs mt-4">
            Preparing your checkout...
          </p>

        </div>
      </main>
    );
  }

  // ---------------------------------------------
  // MAIN
  // ---------------------------------------------

  return (
    <main className="min-h-screen bg-black text-white">

      {/* =========================================
          HEADER
      ========================================= */}

      <section className="relative overflow-hidden border-b border-white/10 bg-[#0b0b0b]">

        <div className="absolute top-0 right-0 w-[420px] h-[420px] rounded-full bg-[#f28a2e]/[0.025] blur-[120px] pointer-events-none" />

        <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-10 md:py-16">

          <div className="mt-12 md:mt-16 grid lg:grid-cols-12 gap-10 items-center">

            {/* LEFT */}

            <motion.div
              initial={{
                opacity: 0,
                y: 25,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.8,
                ease,
              }}
              className="lg:col-span-7"
            >

              <div className="flex items-center gap-4 mb-6">

                <span className="w-10 h-px bg-[#f28a2e]" />

                <span className="text-white/35 text-[9px] uppercase tracking-[0.35em]">
                  Your Atulyam Experience
                </span>

              </div>

              <h1
                className="
                  font-serif
                  text-5xl
                  sm:text-6xl
                  md:text-7xl
                  lg:text-[6vw]
                  leading-[0.88]
                  tracking-[-0.055em]
                "
              >
                Good food
                <br />

                <span className="italic text-[#f28a2e]">
                  starts here.
                </span>
              </h1>

              <p className="mt-7 text-white/40 text-sm leading-7 max-w-lg">
                Your account and saved delivery
                details are ready. Just confirm
                your location and place your order.
              </p>

            </motion.div>

            {/* RIGHT */}

            <motion.div
              initial={{
                opacity: 0,
                x: 25,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                duration: 0.8,
                delay: 0.15,
                ease,
              }}
              className="lg:col-span-5"
            >

              <div className="border border-white/10 bg-white/[0.025] p-6 md:p-8">

                <div className="flex items-center justify-between mb-7">

                  <span className="text-white/35 text-[9px] uppercase tracking-[0.3em]">
                    Order Journey
                  </span>

                  <span className="text-[#f28a2e] text-[9px] uppercase tracking-[0.2em]">
                    02 / 03
                  </span>

                </div>

                <div className="space-y-5">

                  {/* STEP 1 */}

                  <div className="flex items-center gap-4">

                    <div className="w-8 h-8 rounded-full border border-[#f28a2e]/40 flex items-center justify-center">

                      <span className="text-[#f28a2e] text-[10px]">
                        ✓
                      </span>

                    </div>

                    <div>

                      <p className="text-white/75 text-xs uppercase tracking-[0.18em]">
                        Your Order
                      </p>

                      <p className="text-white/25 text-[10px] mt-1">
                        Items selected
                      </p>

                    </div>

                  </div>

                  <div className="ml-4 h-5 w-px bg-white/10" />

                  {/* STEP 2 */}

                  <div className="flex items-center gap-4">

                    <div className="relative w-8 h-8 rounded-full bg-[#f28a2e] flex items-center justify-center">

                      <span className="text-black text-[10px] font-medium">
                        02
                      </span>

                    </div>

                    <div>

                      <p className="text-white text-xs uppercase tracking-[0.18em]">
                        Delivery Details
                      </p>

                      <p className="text-[#f28a2e]/70 text-[10px] mt-1">
                        You're here
                      </p>

                    </div>

                  </div>

                  <div className="ml-4 h-5 w-px bg-white/10" />

                  {/* STEP 3 */}

                  <div className="flex items-center gap-4">

                    <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center">

                      <span className="text-white/25 text-[10px]">
                        03
                      </span>

                    </div>

                    <div>

                      <p className="text-white/35 text-xs uppercase tracking-[0.18em]">
                        Confirmation
                      </p>

                      <p className="text-white/20 text-[10px] mt-1">
                        Almost there
                      </p>

                    </div>

                  </div>

                </div>

                <div className="mt-7 pt-5 border-t border-white/8 flex items-center justify-between">

                  <span className="text-white/20 text-[8px] uppercase tracking-[0.25em]">
                    Atulyam Restaurant
                  </span>

                  <span className="text-white/20 text-[8px] uppercase tracking-[0.2em]">
                    Est. 2020
                  </span>

                </div>

              </div>

            </motion.div>

          </div>

        </div>

      </section>

      {/* =========================================
          CHECKOUT
      ========================================= */}

      <section className="bg-[#080808]">

        <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-12 md:py-20">

          <form
            onSubmit={
              handlePlaceOrder
            }
            className="grid lg:grid-cols-12 gap-8 lg:gap-12"
          >

            {/* =====================================
                LEFT
            ===================================== */}

            <div className="lg:col-span-7 space-y-6">

              {/* =================================
                  CUSTOMER ACCOUNT
              ================================= */}

              <div className="border border-white/10 bg-[#0b0b0b]">

                <div className="px-6 py-5 border-b border-white/10">

                  <div className="flex items-center gap-3">

                    <User
                      size={17}
                      className="text-[#f28a2e]"
                    />

                    <div>

                      <p className="text-[#f28a2e] text-[9px] uppercase tracking-[0.25em]">
                        Step 01
                      </p>

                      <h2 className="font-serif text-2xl mt-1">
                        Your details
                      </h2>

                    </div>

                  </div>

                </div>

                <div className="p-6">

                  <div className="grid sm:grid-cols-2 gap-4">

                    {/* NAME */}

                    <div className="border border-white/[0.08] bg-black p-4">

                      <div className="flex items-center gap-2 mb-3">

                        <User
                          size={14}
                          className="text-[#f28a2e]"
                        />

                        <span className="text-[9px] uppercase tracking-[0.18em] text-white/35">
                          Full Name
                        </span>

                      </div>

                      <p className="text-sm text-white">
                        {customer?.name ||
                          "—"}
                      </p>

                    </div>

                    {/* EMAIL */}

                    <div className="border border-white/[0.08] bg-black p-4">

                      <div className="flex items-center gap-2 mb-3">

                        <Mail
                          size={14}
                          className="text-[#f28a2e]"
                        />

                        <span className="text-[9px] uppercase tracking-[0.18em] text-white/35">
                          Email Address
                        </span>

                      </div>

                      <p className="text-sm text-white break-all">
                        {customer?.email ||
                          "—"}
                      </p>

                    </div>

                  </div>

                  <div className="mt-4 flex items-center gap-2">

                    <Check
                      size={13}
                      className="text-green-400"
                    />

                    <p className="text-[10px] text-white/30">
                      Details fetched automatically
                      from your Atulyam account.
                    </p>

                  </div>

                </div>

              </div>

              {/* =================================
                  DELIVERY ADDRESS
              ================================= */}

              <div className="border border-white/10 bg-[#0b0b0b]">

                <div className="px-6 py-5 border-b border-white/10">

                  <div className="flex items-center justify-between gap-4">

                    <div className="flex items-center gap-3">

                      <MapPin
                        size={17}
                        className="text-[#f28a2e]"
                      />

                      <div>

                        <p className="text-[#f28a2e] text-[9px] uppercase tracking-[0.25em]">
                          Step 02
                        </p>

                        <h2 className="font-serif text-2xl mt-1">
                          Delivery address
                        </h2>

                      </div>

                    </div>

                    <Link
                      to="/customer/addresses"
                      className="text-[9px] uppercase tracking-[0.15em] text-[#f28a2e] hover:text-white transition"
                    >
                      Manage
                    </Link>

                  </div>

                </div>

                <div className="p-6">

                  {/* NO ADDRESS */}

                  {!addresses?.length ? (

                    <div className="border border-[#f28a2e]/20 bg-[#f28a2e]/[0.04] p-6 text-center">

                      <MapPin
                        size={25}
                        className="mx-auto text-[#f28a2e] mb-4"
                      />

                      <p className="text-sm text-white">
                        No delivery address saved
                      </p>

                      <p className="text-[10px] text-white/30 mt-2 leading-5">
                        Add your delivery address
                        with a map location before
                        placing an order.
                      </p>

                      <Link
                        to="/customer/addresses"
                        className="inline-flex items-center gap-2 mt-5 bg-[#f28a2e] hover:bg-white text-black px-5 py-3 text-[9px] uppercase tracking-[0.15em] font-semibold transition"
                      >
                        Add Delivery Address

                        <ArrowRight
                          size={14}
                        />
                      </Link>

                    </div>

                  ) : (

                    <div className="space-y-3">

                      {/* ADDRESS OPTIONS */}

                      {addresses.map(
                        (address) => {

                          const isSelected =
                            selectedAddress?.id ===
                            address.id;

                          const hasLocation =
                            address.latitude !=
                              null &&
                            address.longitude !=
                              null;

                          return (
                            <button
                              key={
                                address.id
                              }
                              type="button"
                              onClick={() =>
                                handleSelectAddress(
                                  address
                                )
                              }
                              className={`
                                w-full
                                text-left
                                p-5
                                border
                                transition-all
                                ${
                                  isSelected
                                    ? "border-[#f28a2e]/60 bg-[#f28a2e]/[0.06]"
                                    : "border-white/[0.08] bg-black hover:border-white/20"
                                }
                              `}
                            >

                              <div className="flex items-start justify-between gap-4">

                                <div className="flex items-start gap-4 min-w-0">

                                  <div className="w-10 h-10 border border-white/10 bg-white/[0.03] flex items-center justify-center shrink-0">

                                    <Home
                                      size={16}
                                      className={
                                        isSelected
                                          ? "text-[#f28a2e]"
                                          : "text-white/40"
                                      }
                                    />

                                  </div>

                                  <div className="min-w-0">

                                    <div className="flex items-center gap-2 flex-wrap">

                                      <p className="text-sm text-white">
                                        {
                                          address.label
                                        }
                                      </p>

                                      {address.is_default && (
                                        <span className="text-[8px] uppercase tracking-[0.12em] text-[#f28a2e] border border-[#f28a2e]/20 px-2 py-1">
                                          Default
                                        </span>
                                      )}

                                    </div>

                                    <p className="text-xs text-white/45 mt-2 leading-5">

                                      {address.house_number
                                        ? `${address.house_number}, `
                                        : ""}

                                      {
                                        address.full_address
                                      }

                                      <br />

                                      {
                                        address.city
                                      }{" "}
                                      -{" "}
                                      {
                                        address.pincode
                                      }

                                    </p>

                                    <div className="flex items-center gap-2 mt-2">

                                      <Phone
                                        size={11}
                                        className="text-white/25"
                                      />

                                      <span className="text-[10px] text-white/35">
                                        {
                                          address.phone
                                        }
                                      </span>

                                    </div>

                                    {!hasLocation && (
                                      <div className="flex items-center gap-2 mt-3">

                                        <AlertCircle
                                          size={12}
                                          className="text-red-400"
                                        />

                                        <span className="text-[9px] text-red-400">
                                          Map location required
                                        </span>

                                      </div>
                                    )}

                                  </div>

                                </div>

                                <div
                                  className={`
                                    w-4
                                    h-4
                                    rounded-full
                                    border
                                    shrink-0
                                    mt-1
                                    flex
                                    items-center
                                    justify-center
                                    ${
                                      isSelected
                                        ? "border-[#f28a2e] bg-[#f28a2e]"
                                        : "border-white/20"
                                    }
                                  `}
                                >

                                  {isSelected && (
                                    <div className="w-1.5 h-1.5 rounded-full bg-black" />
                                  )}

                                </div>

                              </div>

                            </button>
                          );
                        }
                      )}

                    </div>
                  )}

                  {/* SELECTED ADDRESS SUMMARY */}

                  {selectedAddress && (
                    <div className="mt-5 border border-white/[0.08] bg-black p-4">

                      <div className="flex items-center gap-2 mb-3">

                        <Check
                          size={14}
                          className="text-green-400"
                        />

                        <span className="text-[9px] uppercase tracking-[0.15em] text-green-400">
                          Selected for delivery
                        </span>

                      </div>

                      <p className="text-xs text-white/50 leading-5">

                        {selectedAddress.house_number
                          ? `${selectedAddress.house_number}, `
                          : ""}

                        {
                          selectedAddress.full_address
                        }

                        {", "}

                        {
                          selectedAddress.city
                        }

                        {" - "}

                        {
                          selectedAddress.pincode
                        }

                      </p>

                    </div>
                  )}

                </div>

              </div>

              {/* =================================
                  MAP
              ================================= */}

              <div className="border border-white/10 bg-[#0b0b0b]">

                <div className="px-6 py-5 border-b border-white/10">

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                    <div className="flex items-center gap-3">

                      <Navigation
                        size={17}
                        className="text-[#f28a2e]"
                      />

                      <div>

                        <p className="text-[#f28a2e] text-[9px] uppercase tracking-[0.25em]">
                          Required
                        </p>

                        <h2 className="font-serif text-2xl mt-1">
                          Confirm delivery location
                        </h2>

                      </div>

                    </div>

                    <div
                      className={`
                        inline-flex
                        items-center
                        gap-2
                        text-[9px]
                        uppercase
                        tracking-[0.12em]
                        px-3
                        py-2
                        border
                        self-start
                        ${
                          locationConfirmed
                            ? "text-green-400 border-green-500/20 bg-green-500/[0.05]"
                            : "text-red-400 border-red-500/20 bg-red-500/[0.05]"
                        }
                      `}
                    >

                      {locationConfirmed ? (
                        <>
                          <Check
                            size={12}
                          />
                          Location Confirmed
                        </>
                      ) : (
                        <>
                          <AlertCircle
                            size={12}
                          />
                          Location Required
                        </>
                      )}

                    </div>

                  </div>

                </div>

                <div className="p-6">

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">

                    <div>

                      <p className="text-sm text-white/70">
                        Pin your exact delivery
                        location
                      </p>

                      <p className="text-[10px] text-white/25 mt-1">
                        You can use your current GPS
                        location or adjust the pin
                        manually on the map.
                      </p>

                    </div>

                    <button
                      type="button"
                      onClick={
                        handleGetLocation
                      }
                      disabled={
                        gettingLocation
                      }
                      className="
                        inline-flex
                        items-center
                        justify-center
                        gap-2
                        px-4
                        h-10
                        border
                        border-[#f28a2e]/40
                        text-[#f28a2e]
                        text-[9px]
                        uppercase
                        tracking-[0.15em]
                        hover:bg-[#f28a2e]
                        hover:text-black
                        disabled:opacity-50
                        transition-colors
                      "
                    >

                      <LocateFixed
                        size={14}
                      />

                      {gettingLocation
                        ? "Locating..."
                        : "Use My Location"}

                    </button>

                  </div>

                  <div className="relative overflow-hidden border border-white/10 h-[280px] sm:h-[360px]">

                    <MapContainer
                      center={
                        location ||
                        DEFAULT_LOCATION
                      }
                      zoom={
                        location ? 16 : 13
                      }
                      scrollWheelZoom={true}
                      className="w-full h-full"
                    >

                      <TileLayer
                        attribution="&copy; OpenStreetMap contributors"
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />

                      <RecenterMap
                        position={location}
                      />

                      <LocationMarker
                        position={location}
                        setPosition={
                          setLocation
                        }
                        setLocationConfirmed={
                          setLocationConfirmed
                        }
                      />

                    </MapContainer>

                    {!location && (
                      <div className="
                        absolute
                        inset-x-4
                        bottom-4
                        z-[1000]
                        bg-[#070707]/90
                        border
                        border-red-500/20
                        backdrop-blur-md
                        px-4
                        py-3
                      ">

                        <div className="flex items-start gap-2">

                          <AlertCircle
                            size={14}
                            className="text-red-400 mt-0.5 shrink-0"
                          />

                          <p className="text-white/60 text-xs leading-5">
                            Delivery location is
                            required. Use{" "}
                            <span className="text-[#f28a2e]">
                              Use My Location
                            </span>{" "}
                            or click anywhere on
                            the map to select your
                            location.
                          </p>

                        </div>

                      </div>
                    )}

                  </div>

                  {location && (
                    <div className="mt-4 flex items-start gap-2">

                      <MapPin
                        size={14}
                        className="text-[#f28a2e] mt-0.5 shrink-0"
                      />

                      <div>

                        <p className="text-[10px] text-green-400 leading-5">
                          Delivery location confirmed.
                        </p>

                        <p className="text-[10px] text-white/25 leading-5">
                          Click anywhere on the map
                          to adjust the delivery pin.
                        </p>

                      </div>

                    </div>
                  )}

                  {locationMessage && (
                    <p className="mt-3 text-[10px] text-[#f28a2e] leading-5">
                      {locationMessage}
                    </p>
                  )}

                </div>

              </div>

              {/* =================================
                  PAYMENT
              ================================= */}

              <div className="border border-white/10 bg-[#0b0b0b]">

                <div className="px-6 py-5 border-b border-white/10">

                  <div className="flex items-center gap-3">

                    <CreditCard
                      size={17}
                      className="text-[#f28a2e]"
                    />

                    <div>

                      <p className="text-[#f28a2e] text-[9px] uppercase tracking-[0.25em]">
                        Step 03
                      </p>

                      <h2 className="font-serif text-2xl mt-1">
                        Payment method
                      </h2>

                    </div>

                  </div>

                </div>

                <div className="p-6">

                  <label className="flex items-center gap-4 p-4 border border-[#f28a2e]/50 bg-[#f28a2e]/[0.05] cursor-pointer">

                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Cash on Delivery"
                      checked={
                        form.paymentMethod ===
                        "Cash on Delivery"
                      }
                      onChange={
                        handleChange
                      }
                      className="accent-[#f28a2e]"
                    />

                    <div>

                      <p className="text-sm text-white">
                        Cash on Delivery
                      </p>

                      <p className="text-[10px] text-white/30 mt-1">
                        Pay when your order arrives.
                      </p>

                    </div>

                  </label>

                </div>

              </div>

              {/* =================================
                  NOTES
              ================================= */}

              <div className="border border-white/10 bg-[#0b0b0b]">

                <div className="px-6 py-5 border-b border-white/10">

                  <div className="flex items-center gap-3">

                    <FileText
                      size={17}
                      className="text-[#f28a2e]"
                    />

                    <div>

                      <p className="text-[#f28a2e] text-[9px] uppercase tracking-[0.25em]">
                        Optional
                      </p>

                      <h2 className="font-serif text-2xl mt-1">
                        Order notes
                      </h2>

                    </div>

                  </div>

                </div>

                <div className="p-6">

                  <textarea
                    name="notes"
                    value={form.notes}
                    onChange={
                      handleChange
                    }
                    rows={3}
                    placeholder="Any special instructions for your order?"
                    className="
                      w-full
                      bg-black
                      border
                      border-white/10
                      p-4
                      text-sm
                      leading-6
                      outline-none
                      resize-none
                      placeholder:text-white/20
                      focus:border-[#f28a2e]/60
                      transition-colors
                    "
                  />

                </div>

              </div>

            </div>

            {/* =====================================
                RIGHT — ORDER SUMMARY
            ===================================== */}

            <aside className="lg:col-span-5">

              <div className="lg:sticky lg:top-24 border border-white/10 bg-[#0b0b0b]">

                <div className="px-6 py-5 border-b border-white/10">

                  <div className="flex items-center justify-between">

                    <div className="flex items-center gap-3">

                      <ShoppingBag
                        size={17}
                        className="text-[#f28a2e]"
                      />

                      <h2 className="font-serif text-2xl">
                        Your order
                      </h2>

                    </div>

                    <span className="text-[9px] uppercase tracking-[0.2em] text-white/30">
                      {totalItems}{" "}
                      {totalItems === 1
                        ? "Item"
                        : "Items"}
                    </span>

                  </div>

                </div>

                <div className="p-6 space-y-4 max-h-[380px] overflow-y-auto">

                  {items.map((item) => (

                    <div
                      key={item.id}
                      className="
                        flex
                        items-start
                        justify-between
                        gap-4
                        pb-4
                        border-b
                        border-white/[0.07]
                      "
                    >

                      <div className="min-w-0">

                        <div className="flex items-center gap-2">

                          <span
                            className={`
                              w-2
                              h-2
                              rounded-full
                              shrink-0
                              ${
                                item.is_veg ||
                                item.veg
                                  ? "bg-emerald-400"
                                  : "bg-rose-400"
                              }
                            `}
                          />

                          <p className="text-sm text-white truncate">
                            {item.name}
                          </p>

                        </div>

                        <p className="text-[10px] text-white/30 mt-1">

                          ₹
                          {Number(
                            item.price
                          ).toLocaleString(
                            "en-IN"
                          )}

                          {" × "}

                          {item.quantity}

                        </p>

                      </div>

                      <span className="font-serif text-sm text-[#f28a2e] shrink-0">

                        {formatPrice(
                          Number(
                            item.price
                          ) *
                            Number(
                              item.quantity
                            )
                        )}

                      </span>

                    </div>

                  ))}

                </div>

                {/* COUPON */}

                <div className="px-6 pb-5">

                  {appliedCoupon ? (

                    <div className="rounded-xl border border-[#f28a2e]/30 bg-[#f28a2e]/[0.05] p-4">

                      <div className="flex items-center justify-between gap-3">

                        <div className="flex items-center gap-3 min-w-0">

                          <div className="w-9 h-9 rounded-full bg-[#f28a2e]/10 flex items-center justify-center shrink-0">

                            <Tag
                              size={15}
                              className="text-[#f28a2e]"
                            />

                          </div>

                          <div className="min-w-0">

                            <p className="text-sm text-white font-medium">
                              Coupon Applied
                            </p>

                            <p className="mt-1 text-[10px] uppercase tracking-[0.15em] text-[#f28a2e] truncate">
                              {couponCode}
                            </p>

                          </div>

                        </div>

                        <div className="text-right shrink-0">

                          <p className="text-sm font-semibold text-[#f28a2e]">
                            {discountPercentage}% OFF
                          </p>

                          <p className="mt-1 text-[9px] text-white/30">
                            Discount applied
                          </p>

                        </div>

                      </div>

                    </div>

                  ) : (

                    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">

                      <div className="flex items-center gap-3">

                        <Tag
                          size={15}
                          className="text-white/25"
                        />

                        <div>

                          <p className="text-sm text-white/50">
                            No coupon applied
                          </p>

                          <p className="mt-1 text-[10px] text-white/25 leading-4">
                            You can apply an offer
                            from your cart before
                            checkout.
                          </p>

                        </div>

                      </div>

                    </div>

                  )}

                </div>

                {/* TOTALS */}

                <div className="px-6 py-5 border-t border-white/10 space-y-3">

                  <div className="flex justify-between text-sm">

                    <span className="text-white/40">
                      Subtotal
                    </span>

                    <span>
                      {formatPrice(
                        cartSubtotal
                      )}
                    </span>

                  </div>

                  {discountAmount > 0 && (

                    <div className="flex justify-between text-sm">

                      <span className="text-[#f28a2e]">
                        Discount
                      </span>

                      <span className="text-[#f28a2e]">
                        −
                        {formatPrice(
                          discountAmount
                        )}
                      </span>

                    </div>

                  )}

                  <div className="flex justify-between text-sm">

                    <span className="text-white/40">
                      GST (5%)
                    </span>

                    <span>
                      {formatPrice(
                        gstAmount
                      )}
                    </span>

                  </div>

                  <div className="pt-4 mt-2 border-t border-white/10 flex items-end justify-between">

                    <div>

                      <p className="text-[9px] uppercase tracking-[0.2em] text-white/30">
                        Total
                      </p>

                      <p className="font-serif text-3xl text-[#f28a2e] mt-1">
                        {formatPrice(
                          finalTotal
                        )}
                      </p>

                    </div>

                    <Check
                      size={19}
                      className="text-[#f28a2e] mb-1"
                    />

                  </div>

                </div>

                {/* DELIVERY STATUS */}

                <div className="px-6 pb-5">

                  {!selectedAddress ? (

                    <div className="border border-red-500/20 bg-red-500/[0.04] p-4">

                      <div className="flex items-start gap-3">

                        <AlertCircle
                          size={15}
                          className="text-red-400 mt-0.5 shrink-0"
                        />

                        <div>

                          <p className="text-xs text-red-400">
                            Delivery address required
                          </p>

                          <p className="text-[10px] text-white/25 mt-1 leading-4">
                            Select a saved address
                            before placing your order.
                          </p>

                        </div>

                      </div>

                    </div>

                  ) : !locationConfirmed ? (

                    <div className="border border-red-500/20 bg-red-500/[0.04] p-4">

                      <div className="flex items-start gap-3">

                        <AlertCircle
                          size={15}
                          className="text-red-400 mt-0.5 shrink-0"
                        />

                        <div>

                          <p className="text-xs text-red-400">
                            Delivery location required
                          </p>

                          <p className="text-[10px] text-white/25 mt-1 leading-4">
                            Confirm your exact
                            location on the map.
                          </p>

                        </div>

                      </div>

                    </div>

                  ) : (

                    <div className="border border-green-500/20 bg-green-500/[0.04] p-4">

                      <div className="flex items-center gap-3">

                        <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">

                          <Check
                            size={15}
                            className="text-green-400"
                          />

                        </div>

                        <div>

                          <p className="text-xs text-green-400">
                            Delivery location confirmed
                          </p>

                          <p className="text-[10px] text-white/25 mt-1">
                            You're ready to place your
                            order.
                          </p>

                        </div>

                      </div>

                    </div>

                  )}

                </div>

                {/* ERROR */}

                {error && (

                  <div className="mx-6 mb-5 p-4 border border-red-500/20 bg-red-500/[0.04]">

                    <div className="flex items-start gap-2">

                      <AlertCircle
                        size={14}
                        className="text-red-400 mt-0.5 shrink-0"
                      />

                      <p className="text-xs text-red-400 leading-5">
                        {error}
                      </p>

                    </div>

                  </div>

                )}

                {/* PLACE ORDER */}

                <div className="px-6 pb-6">

                  <button
                    type="submit"
                    disabled={
                      placingOrder ||
                      !selectedAddress ||
                      !locationConfirmed
                    }
                    className="
                      w-full
                      h-14
                      bg-[#f28a2e]
                      text-black
                      flex
                      items-center
                      justify-between
                      px-5
                      text-[10px]
                      uppercase
                      tracking-[0.2em]
                      font-semibold
                      hover:bg-white
                      disabled:opacity-40
                      disabled:cursor-not-allowed
                      transition-colors
                    "
                  >

                    <span>
                      {placingOrder
                        ? "Placing Order..."
                        : "Place Order"}
                    </span>

                    {!placingOrder && (
                      <ArrowRight
                        size={16}
                      />
                    )}

                  </button>

                  <p className="text-[9px] text-white/20 text-center leading-5 mt-4">
                    By placing your order, you
                    confirm that the information
                    provided is correct.
                  </p>

                </div>

              </div>

            </aside>

          </form>

        </div>

      </section>

    </main>
  );
};

export default CheckoutPage;