import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search,
  Check,
  ChefHat,
  Bike,
  PackageCheck,
  XCircle,
  MapPin,
  Clock3,
  ArrowLeft,
  Navigation,
  Route,
} from "lucide-react";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:8000/api/v1";

/* --------------------------------------------------
   ATULYAM RESTAURANT LOCATION
-------------------------------------------------- */

const RESTAURANT_LOCATION = [25.4262616, 81.9133776];

/* --------------------------------------------------
   LEAFLET ICONS
-------------------------------------------------- */

const restaurantIcon = new L.DivIcon({
  className: "custom-leaflet-icon",
  html: `
    <div style="
      width:42px;
      height:42px;
      border-radius:50%;
      background:#070707;
      border:2px solid #f28a2e;
      display:flex;
      align-items:center;
      justify-content:center;
      box-shadow:0 4px 18px rgba(0,0,0,.45);
    ">
      <span style="
        color:#f28a2e;
        font-size:20px;
        line-height:1;
      ">●</span>
    </div>
  `,
  iconSize: [42, 42],
  iconAnchor: [21, 21],
  popupAnchor: [0, -22],
});

const customerIcon = new L.DivIcon({
  className: "custom-leaflet-icon",
  html: `
    <div style="
      width:42px;
      height:42px;
      border-radius:50%;
      background:#f28a2e;
      border:3px solid #070707;
      display:flex;
      align-items:center;
      justify-content:center;
      box-shadow:0 4px 20px rgba(242,138,46,.4);
    ">
      <span style="
        color:#070707;
        font-size:21px;
        line-height:1;
      ">●</span>
    </div>
  `,
  iconSize: [42, 42],
  iconAnchor: [21, 21],
  popupAnchor: [0, -22],
});

const riderIcon = new L.DivIcon({
  className: "custom-leaflet-icon",
  html: `
    <div style="
      width:44px;
      height:44px;
      border-radius:50%;
      background:#070707;
      border:2px solid #f28a2e;
      display:flex;
      align-items:center;
      justify-content:center;
      box-shadow:0 0 24px rgba(242,138,46,.5);
      font-size:21px;
    ">
      🛵
    </div>
  `,
  iconSize: [44, 44],
  iconAnchor: [22, 22],
  popupAnchor: [0, -23],
});

/* --------------------------------------------------
   STATUS
-------------------------------------------------- */

const statuses = [
  {
    key: "Confirmed",
    label: "Order Confirmed",
    description: "Your order has been confirmed",
    icon: Check,
  },
  {
    key: "Preparing",
    label: "Preparing",
    description: "Your food is being prepared",
    icon: ChefHat,
  },
  {
    key: "On the way",
    label: "On the way",
    description: "Your order is on its way",
    icon: Bike,
  },
  {
    key: "Delivered",
    label: "Delivered",
    description: "Your order has been delivered",
    icon: PackageCheck,
  },
];

/* --------------------------------------------------
   MAP CENTER / FIT
-------------------------------------------------- */

const FitMapToRoute = ({ restaurant, customer, route }) => {
  const map = useMap();

  useEffect(() => {
    if (!customer) return;

    const points =
      route && route.length > 1
        ? route
        : [restaurant, customer];

    const bounds = L.latLngBounds(points);

    setTimeout(() => {
      map.fitBounds(bounds, {
        padding: [35, 35],
        maxZoom: 15,
      });
    }, 100);
  }, [map, restaurant, customer, route]);

  return null;
};

/* --------------------------------------------------
   PAGE
-------------------------------------------------- */

const OrderTrackingPage = () => {
  const { orderNumber: routeOrderNumber } = useParams();

  const [searchNumber, setSearchNumber] = useState(
    routeOrderNumber || ""
  );

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const [routeLoading, setRouteLoading] = useState(false);

  /* --------------------------------------------------
     FETCH ORDER
  -------------------------------------------------- */

  const fetchOrder = async (number) => {
    const trackingNumber = number.trim().toUpperCase();

    if (!trackingNumber) {
      setError("Please enter your order number.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/orders/track/${encodeURIComponent(
          trackingNumber
        )}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Order not found.");
      }

      setOrder(data);

      sessionStorage.setItem(
        "atulyam_last_order",
        JSON.stringify(data)
      );
    } catch (err) {
      setOrder(null);
      setRouteCoordinates([]);
      setError(
        err.message || "Unable to find this order."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (routeOrderNumber) {
      fetchOrder(routeOrderNumber);
    }
  }, [routeOrderNumber]);

  /* --------------------------------------------------
     CUSTOMER STATUS
  -------------------------------------------------- */

  const customerStatus =
    order?.status === "Pending"
      ? "Confirmed"
      : order?.status;

  const currentStep = statuses.findIndex(
    (item) => item.key === customerStatus
  );

  const isCancelled =
    order?.status === "Cancelled";

  /* --------------------------------------------------
     CUSTOMER GPS
  -------------------------------------------------- */

  const customerLocation = useMemo(() => {
    if (
      order?.delivery_latitude === null ||
      order?.delivery_latitude === undefined ||
      order?.delivery_longitude === null ||
      order?.delivery_longitude === undefined
    ) {
      return null;
    }

    const lat = Number(order.delivery_latitude);
    const lng = Number(order.delivery_longitude);

    if (
      Number.isNaN(lat) ||
      Number.isNaN(lng)
    ) {
      return null;
    }

    return [lat, lng];
  }, [order]);

  /* --------------------------------------------------
     GET REAL ROAD ROUTE
  -------------------------------------------------- */

  useEffect(() => {
    if (!customerLocation || isCancelled) {
      setRouteCoordinates([]);
      setDistance(null);
      setDuration(null);
      return;
    }

    const getRoute = async () => {
      setRouteLoading(true);

      try {
        const [restaurantLat, restaurantLng] =
          RESTAURANT_LOCATION;

        const [customerLat, customerLng] =
          customerLocation;

        const url =
          `https://router.project-osrm.org/route/v1/driving/` +
          `${restaurantLng},${restaurantLat};` +
          `${customerLng},${customerLat}` +
          `?overview=full&geometries=geojson`;

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error("Unable to load route.");
        }

        const data = await response.json();

        if (
          !data.routes ||
          !data.routes.length
        ) {
          throw new Error("No route found.");
        }

        const route = data.routes[0];

        const coordinates =
          route.geometry.coordinates.map(
            ([lng, lat]) => [lat, lng]
          );

        setRouteCoordinates(coordinates);

        setDistance(
          (route.distance / 1000).toFixed(1)
        );

        setDuration(
          Math.round(route.duration / 60)
        );
      } catch (err) {
        console.error("Route error:", err);

        setRouteCoordinates([
          RESTAURANT_LOCATION,
          customerLocation,
        ]);

        setDistance(null);
        setDuration(null);
      } finally {
        setRouteLoading(false);
      }
    };

    getRoute();
  }, [customerLocation, isCancelled]);

  /* --------------------------------------------------
     RIDER POSITION
     
     IMPORTANT:
     Backend does not have live rider GPS yet.
     So this uses the middle of the route visually.
  -------------------------------------------------- */

  const riderLocation = useMemo(() => {
    if (
      customerStatus !== "On the way" ||
      routeCoordinates.length < 3
    ) {
      return null;
    }

    const middleIndex = Math.floor(
      routeCoordinates.length * 0.55
    );

    return routeCoordinates[middleIndex];
  }, [
    customerStatus,
    routeCoordinates,
  ]);

  /* --------------------------------------------------
     ESTIMATED DELIVERY
  -------------------------------------------------- */

  const estimatedDelivery = useMemo(() => {
    if (customerStatus === "Delivered") {
      return "Delivered";
    }

    if (customerStatus === "On the way") {
      if (duration) {
        return `${Math.max(
          10,
          Math.round(duration)
        )}–${Math.max(
          15,
          Math.round(duration + 10)
        )} min`;
      }

      return "15–25 min";
    }

    if (customerStatus === "Preparing") {
      return "25–35 min";
    }

    return "30–40 min";
  }, [customerStatus, duration]);

  /* --------------------------------------------------
     RENDER
  -------------------------------------------------- */

  return (
    <div className="min-h-screen bg-[#070707] text-white px-4 sm:px-6 py-20 sm:py-24">
      <div className="max-w-2xl mx-auto">

        {/* HEADER */}

        <div className="mb-8">
          <Link
            to="/order-online"
            className="inline-flex items-center gap-2 text-white/40 hover:text-[#f28a2e] text-sm transition mb-7"
          >
            <ArrowLeft size={16} />
            Order Online
          </Link>

          <p className="text-[#f28a2e] text-[11px] tracking-[0.28em] uppercase mb-3">
            Live Order Tracking
          </p>

          <h1 className="font-serif text-4xl sm:text-5xl">
            Track Your Order
          </h1>
        </div>

        {/* SEARCH */}

        {!order && (
          <motion.form
            onSubmit={(e) => {
              e.preventDefault();
              fetchOrder(searchNumber);
            }}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search
                  size={17}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25"
                />

                <input
                  type="text"
                  value={searchNumber}
                  onChange={(e) =>
                    setSearchNumber(e.target.value)
                  }
                  placeholder="Enter order number"
                  className="w-full h-12 bg-white/[0.04] border border-white/10 pl-11 pr-4 text-sm text-white outline-none focus:border-[#f28a2e]/50 transition"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="px-5 h-12 bg-[#f28a2e] text-black text-sm font-medium disabled:opacity-50"
              >
                {loading ? "..." : "Track"}
              </button>
            </div>
          </motion.form>
        )}

        {/* ERROR */}

        {error && (
          <div className="border border-red-500/20 bg-red-500/5 text-red-400 px-4 py-3 text-sm mb-6">
            {error}
          </div>
        )}

        {order && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >

            {/* TOP ORDER INFO */}

            <div className="flex items-end justify-between gap-4 mb-5">
              <div>
                <p className="text-white/35 text-[10px] uppercase tracking-[0.2em] mb-2">
                  Order
                </p>

                <p className="text-[#f28a2e] text-lg font-medium tracking-wide">
                  #{order.order_number}
                </p>
              </div>

              <div className="text-right">
                <p className="text-white/35 text-[10px] uppercase tracking-[0.2em] mb-2">
                  Total
                </p>

                <p className="text-white text-lg">
                  ₹{Number(order.total_amount).toFixed(2)}
                </p>
              </div>
            </div>

            {/* ESTIMATED TIME */}

            {!isCancelled && (
              <div className="border border-white/10 bg-white/[0.035] px-5 py-4 mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">

                  <div className="w-9 h-9 rounded-full bg-[#f28a2e]/10 flex items-center justify-center">
                    <Clock3
                      size={18}
                      className="text-[#f28a2e]"
                    />
                  </div>

                  <div>
                    <p className="text-white/40 text-[10px] uppercase tracking-wider">
                      Estimated delivery
                    </p>

                    <p className="text-white text-sm mt-1">
                      {estimatedDelivery}
                    </p>
                  </div>
                </div>

                <div className="text-[#f28a2e] text-xs">
                  {customerStatus === "Delivered"
                    ? "Completed"
                    : "On time"}
                </div>
              </div>
            )}

            {/* REAL MAP */}

            {!isCancelled && (
              <div className="relative border border-white/10 overflow-hidden bg-[#111] mb-5">

                <div className="h-[280px] sm:h-[350px]">

                  {customerLocation ? (
                    <MapContainer
                      center={customerLocation}
                      zoom={13}
                      scrollWheelZoom={false}
                      className="w-full h-full"
                    >

                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />

                      {/* RESTAURANT */}

                      <Marker
                        position={RESTAURANT_LOCATION}
                        icon={restaurantIcon}
                      >
                        <Popup>
                          <strong>
                            Atulyam Restaurant
                          </strong>
                          <br />
                          Restaurant
                        </Popup>
                      </Marker>

                      {/* CUSTOMER */}

                      <Marker
                        position={customerLocation}
                        icon={customerIcon}
                      >
                        <Popup>
                          <strong>
                            Delivery Location
                          </strong>
                          <br />
                          Your location
                        </Popup>
                      </Marker>

                      {/* ROUTE */}

                      {routeCoordinates.length > 1 && (
                        <>
                          <Polyline
                            positions={routeCoordinates}
                            pathOptions={{
                              color: "#f28a2e",
                              weight: 5,
                              opacity: 0.9,
                            }}
                          />

                          <Polyline
                            positions={routeCoordinates}
                            pathOptions={{
                              color: "#ffffff",
                              weight: 2,
                              opacity: 0.45,
                              dashArray: "7 10",
                            }}
                          />
                        </>
                      )}

                      {/* RIDER */}

                      {riderLocation && (
                        <Marker
                          position={riderLocation}
                          icon={riderIcon}
                        >
                          <Popup>
                            <strong>
                              Delivery Partner
                            </strong>
                            <br />
                            On the way
                          </Popup>
                        </Marker>
                      )}

                      <FitMapToRoute
                        restaurant={RESTAURANT_LOCATION}
                        customer={customerLocation}
                        route={routeCoordinates}
                      />

                    </MapContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center bg-[#111] px-6 text-center">
                      <div>
                        <MapPin
                          size={30}
                          className="text-[#f28a2e] mx-auto mb-3"
                        />

                        <p className="text-white/70 text-sm">
                          Delivery location unavailable
                        </p>

                        <p className="text-white/30 text-xs mt-1">
                          GPS location was not saved with this order.
                        </p>
                      </div>
                    </div>
                  )}

                </div>

                {/* MAP OVERLAY */}

                <div className="absolute top-4 left-4 z-[500] bg-[#070707]/90 border border-white/10 px-3 py-2 backdrop-blur-md">

                  <div className="flex items-center gap-2">
                    <Navigation
                      size={13}
                      className="text-[#f28a2e]"
                    />

                    <div>
                      <p className="text-white/35 text-[9px] uppercase tracking-wider">
                        Delivery route
                      </p>

                      <p className="text-white/80 text-xs mt-0.5">
                        {routeLoading
                          ? "Calculating route..."
                          : customerStatus === "On the way"
                          ? "Delivery partner is on the way"
                          : customerStatus === "Preparing"
                          ? "Restaurant is preparing your order"
                          : "Order confirmed"}
                      </p>
                    </div>
                  </div>

                </div>

                {/* DISTANCE */}

                {distance && (
                  <div className="absolute bottom-4 left-4 z-[500] bg-[#070707]/90 border border-white/10 px-3 py-2 backdrop-blur-md">

                    <div className="flex items-center gap-2">
                      <Route
                        size={13}
                        className="text-[#f28a2e]"
                      />

                      <p className="text-white/75 text-xs">
                        {distance} km
                        {duration
                          ? ` • ${duration} min`
                          : ""}
                      </p>
                    </div>

                  </div>
                )}

              </div>
            )}

            {/* CANCELLED */}

            {isCancelled && (
              <div className="border border-red-500/20 bg-red-500/5 p-8 text-center mb-5">

                <XCircle
                  size={40}
                  className="text-red-400 mx-auto mb-4"
                  strokeWidth={1.3}
                />

                <h2 className="font-serif text-2xl mb-2">
                  Order Cancelled
                </h2>

                <p className="text-white/40 text-sm">
                  Unfortunately, this order has been cancelled.
                </p>

              </div>
            )}

            {/* STATUS TIMELINE */}

            {!isCancelled && (
              <div className="border border-white/10 bg-white/[0.025] px-5 sm:px-7 py-6">

                <div className="space-y-0">

                  {statuses.map((step, index) => {
                    const Icon = step.icon;

                    const completed =
                      index <= currentStep;

                    const active =
                      index === currentStep;

                    return (
                      <div
                        key={step.key}
                        className="relative flex gap-4"
                      >

                        {/* LINE */}

                        {index <
                          statuses.length - 1 && (
                          <div
                            className={`absolute left-[17px] top-[36px] w-px h-[42px] ${
                              index < currentStep
                                ? "bg-[#f28a2e]"
                                : "bg-white/10"
                            }`}
                          />
                        )}

                        {/* ICON */}

                        <div
                          className={`relative z-10 w-[36px] h-[36px] rounded-full flex items-center justify-center shrink-0 border ${
                            completed
                              ? "bg-[#f28a2e] border-[#f28a2e] text-black"
                              : "bg-[#111] border-white/10 text-white/25"
                          }`}
                        >
                          <Icon size={16} />
                        </div>

                        {/* TEXT */}

                        <div className="pb-7 pt-0.5">

                          <p
                            className={`text-sm ${
                              active
                                ? "text-[#f28a2e] font-medium"
                                : completed
                                ? "text-white/85"
                                : "text-white/30"
                            }`}
                          >
                            {step.label}
                          </p>

                          <p className="text-white/30 text-xs mt-1">
                            {step.description}
                          </p>

                        </div>

                      </div>
                    );
                  })}

                </div>

              </div>
            )}

            {/* DELIVERY ADDRESS */}

            <div className="mt-4 border border-white/10 bg-white/[0.025] px-5 py-4">

              <div className="flex items-start gap-3">

                <MapPin
                  size={17}
                  className="text-[#f28a2e] mt-0.5 shrink-0"
                />

                <div>

                  <p className="text-white/35 text-[10px] uppercase tracking-wider mb-1">
                    Delivery address
                  </p>

                  <p className="text-white/65 text-xs leading-relaxed">
                    {order.delivery_address}
                  </p>

                </div>

              </div>

            </div>

            {/* GPS DETAILS */}

            {customerLocation && (
              <div className="mt-3 border border-white/10 bg-white/[0.02] px-5 py-3">

                <div className="flex items-center justify-between gap-3">

                  <div className="flex items-center gap-2">

                    <Navigation
                      size={14}
                      className="text-[#f28a2e]"
                    />

                    <p className="text-white/35 text-[10px] uppercase tracking-wider">
                      GPS location saved
                    </p>

                  </div>

                  <p className="text-white/25 text-[10px]">
                    {customerLocation[0].toFixed(5)},
                    {" "}
                    {customerLocation[1].toFixed(5)}
                  </p>

                </div>

              </div>
            )}

            {/* REFRESH */}

            <button
              onClick={() =>
                fetchOrder(order.order_number)
              }
              disabled={loading}
              className="w-full mt-4 py-3 border border-white/10 text-white/40 hover:text-[#f28a2e] hover:border-[#f28a2e]/30 text-xs transition"
            >
              {loading
                ? "Updating..."
                : "Refresh Order Status"}
            </button>

          </motion.div>
        )}
      </div>
    </div>
  );
};

export default OrderTrackingPage;