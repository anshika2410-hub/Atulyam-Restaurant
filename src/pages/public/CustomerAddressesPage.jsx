import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Check,
  Crosshair,
  Home,
  MapPin,
  Pencil,
  Plus,
  Trash2,
  Briefcase,
  Navigation,
  X,
} from "lucide-react";

import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { useCustomerAddress } from "../../context/CustomerAddressContext";
import { useCustomerAuth } from "../../context/CustomerAuthContext";

// ================= MAP ICON =================

const markerIcon = new L.Icon({
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// ================= DEFAULT LOCATION =================

const DEFAULT_LOCATION = [25.4358, 81.8463];

// ================= MAP CLICK =================

const LocationMarker = ({ position, setPosition }) => {
  useMapEvents({
    click(event) {
      setPosition([
        event.latlng.lat,
        event.latlng.lng,
      ]);
    },
  });

  if (!position) return null;

  return (
    <Marker
      position={position}
      icon={markerIcon}
    />
  );
};

// ================= MAP CENTER =================

const MapCenter = ({ position }) => {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.flyTo(position, 16, {
        duration: 0.8,
      });
    }
  }, [position, map]);

  return null;
};

// ================= COMPONENT =================

const CustomerAddressesPage = () => {
  const navigate = useNavigate();

  const { customer } = useCustomerAuth();

  const {
    addresses,
    selectedAddress,
    loading,
    fetchAddresses,
    selectAddress,
    addAddress,
    updateAddress,
    deleteAddress,
  } = useCustomerAddress();

  // ================= STATE =================

  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  const [saving, setSaving] = useState(false);
  const [locating, setLocating] = useState(false);

  const [position, setPosition] = useState(DEFAULT_LOCATION);
  const [locationConfirmed, setLocationConfirmed] = useState(false);

  const [error, setError] = useState("");

  const [form, setForm] = useState({
    label: "Home",
    house_number: "",
    full_address: "",
    city: "",
    pincode: "",
    phone: "",
    landmark: "",
    latitude: DEFAULT_LOCATION[0],
    longitude: DEFAULT_LOCATION[1],
    is_default: false,
  });

  // ================= LOAD ADDRESSES =================

  useEffect(() => {
    fetchAddresses();
  }, []);

  // ================= FORM CHANGE =================

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ================= OPEN ADD FORM =================

  const openAddForm = () => {
    setEditingAddress(null);

    setPosition(DEFAULT_LOCATION);
    setLocationConfirmed(false);

    setForm({
      label: "Home",
      house_number: "",
      full_address: "",
      city: "",
      pincode: "",
      phone: "",
      landmark: "",
      latitude: DEFAULT_LOCATION[0],
      longitude: DEFAULT_LOCATION[1],
      is_default: addresses.length === 0,
    });

    setError("");
    setShowForm(true);
  };

  // ================= OPEN EDIT =================

  const openEditForm = (address) => {
    setEditingAddress(address);

    const hasLocation =
      address.latitude != null &&
      address.longitude != null;

    const newPosition = hasLocation
      ? [address.latitude, address.longitude]
      : DEFAULT_LOCATION;

    setPosition(newPosition);
    setLocationConfirmed(hasLocation);

    setForm({
      label: address.label || "Home",
      house_number: address.house_number || "",
      full_address: address.full_address || "",
      city: address.city || "",
      pincode: address.pincode || "",
      phone: address.phone || "",
      landmark: address.landmark || "",
      latitude:
        address.latitude ?? DEFAULT_LOCATION[0],
      longitude:
        address.longitude ?? DEFAULT_LOCATION[1],
      is_default: address.is_default || false,
    });

    setError("");
    setShowForm(true);
  };

  // ================= CURRENT LOCATION =================

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError(
        "Location services are not supported by your browser."
      );
      return;
    }

    setLocating(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      (location) => {
        const newPosition = [
          location.coords.latitude,
          location.coords.longitude,
        ];

        setPosition(newPosition);
        setLocationConfirmed(true);

        setForm((prev) => ({
          ...prev,
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        }));

        setLocating(false);
      },
      () => {
        setError(
          "Unable to access your location. Please allow location permission."
        );

        setLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  // ================= MAP POSITION =================

  const handleMapPosition = (newPosition) => {
    setPosition(newPosition);
    setLocationConfirmed(true);

    setForm((prev) => ({
      ...prev,
      latitude: newPosition[0],
      longitude: newPosition[1],
    }));
  };

  // ================= SAVE =================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.full_address.trim()) {
      setError("Please enter your complete address.");
      return;
    }

    if (!form.city.trim()) {
      setError("Please enter your city.");
      return;
    }

    if (!/^\d{6}$/.test(form.pincode)) {
      setError("Please enter a valid 6-digit pincode.");
      return;
    }

    if (!/^\d{10}$/.test(form.phone)) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }

    if (!locationConfirmed) {
      setError(
        "Please select your delivery location on the map."
      );
      return;
    }

    if (
      form.latitude == null ||
      form.longitude == null
    ) {
      setError(
        "Please select a valid delivery location on the map."
      );
      return;
    }

    try {
      setSaving(true);
      setError("");

      const payload = {
        label: form.label,
        house_number:
          form.house_number.trim() || null,
        full_address:
          form.full_address.trim(),
        city: form.city.trim(),
        pincode: form.pincode.trim(),
        phone: form.phone.trim(),
        landmark:
          form.landmark.trim() || null,
        latitude: form.latitude,
        longitude: form.longitude,
        is_default: form.is_default,
      };

      if (editingAddress) {
        await updateAddress(
          editingAddress.id,
          payload
        );
      } else {
        await addAddress(payload);
      }

      await fetchAddresses();

      setShowForm(false);
      setEditingAddress(null);
      setLocationConfirmed(false);
      setError("");
    } catch (err) {
      setError(
        err.message || "Unable to save address."
      );
    } finally {
      setSaving(false);
    }
  };

  // ================= SELECT =================

  const handleSelect = (address) => {
    selectAddress(address);
    navigate("/checkout");
  };

  // ================= DELETE =================

  const handleDelete = async (address) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this address?"
    );

    if (!confirmed) return;

    try {
      setError("");
      await deleteAddress(address.id);
    } catch (err) {
      setError(
        err.message || "Unable to delete address."
      );
    }
  };

  // ================= ADDRESS ICON =================

  const getAddressIcon = (label) => {
    if (label === "Work") {
      return <Briefcase size={18} />;
    }

    return <Home size={18} />;
  };

  return (
    <main className="min-h-screen bg-[#0B0B0C] text-ivory-100 pt-[76px]">

      {/* ================= CONTENT ================= */}

      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10 sm:py-14">

        {/* ================= TITLE ================= */}

        <div className="max-w-2xl mb-10">

          <p className="text-brand-400 text-[10px] uppercase tracking-[0.3em] font-semibold mb-4">
            Delivery Location
          </p>

          <h1 className="font-serif text-4xl sm:text-5xl mb-4">
            Where should we deliver?
          </h1>

          <p className="text-ivory-500 text-sm leading-relaxed">
            Choose a saved address or add a new
            delivery location for your next Atulyam
            order.
          </p>

        </div>

        {/* ================= ERROR ================= */}

        {error && (
          <div className="mb-6 border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300 flex items-center justify-between gap-4">

            <span>{error}</span>

            <button
              onClick={() => setError("")}
              className="text-red-300 hover:text-white"
            >
              <X size={16} />
            </button>

          </div>
        )}

        {/* ================= SAVED ADDRESSES ================= */}

        <section>

          <div className="flex items-center justify-between mb-5">

            <div>
              <h2 className="font-serif text-2xl">
                Saved Addresses
              </h2>

              {customer?.name && (
                <p className="text-xs text-ivory-600 mt-1">
                  {customer.name}
                </p>
              )}
            </div>

            <button
              onClick={openAddForm}
              className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-400 text-dark-950 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider transition"
            >
              <Plus size={15} />
              Add Address
            </button>

          </div>

          {/* ================= LOADING ================= */}

          {loading && (
            <div className="border border-white/10 bg-[#111112] p-8 text-center text-sm text-ivory-500">
              Loading your saved addresses...
            </div>
          )}

          {/* ================= EMPTY ================= */}

          {!loading && addresses.length === 0 && (

            <div className="border border-white/10 bg-[#111112] p-8 sm:p-10 text-center">

              <div className="w-14 h-14 mx-auto mb-5 rounded-full border border-brand-500/30 bg-brand-500/10 flex items-center justify-center text-brand-400">
                <MapPin size={22} />
              </div>

              <h3 className="font-serif text-2xl mb-2">
                No saved address yet
              </h3>

              <p className="text-sm text-ivory-500 max-w-md mx-auto mb-6">
                Add your delivery address once and
                we’ll keep it saved for your future
                orders.
              </p>

              <button
                onClick={openAddForm}
                className="inline-flex items-center gap-2 border border-brand-500/50 text-brand-400 hover:bg-brand-500 hover:text-dark-950 px-5 py-3 text-xs uppercase tracking-widest font-semibold transition"
              >
                <Plus size={15} />
                Add Your First Address
              </button>

            </div>

          )}

          {/* ================= ADDRESS LIST ================= */}

          {!loading && addresses.length > 0 && (

            <div className="grid gap-4">

              {addresses.map((address) => {

                const isSelected =
                  selectedAddress?.id === address.id;

                return (
                  <div
                    key={address.id}
                    className={`border bg-[#111112] p-5 sm:p-6 transition ${
                      isSelected
                        ? "border-brand-500/60"
                        : "border-white/10 hover:border-white/20"
                    }`}
                  >

                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5">

                      {/* ADDRESS INFO */}

                      <div className="flex gap-4">

                        <div
                          className={`w-11 h-11 shrink-0 flex items-center justify-center ${
                            isSelected
                              ? "bg-brand-500 text-dark-950"
                              : "bg-white/5 text-brand-400"
                          }`}
                        >
                          {getAddressIcon(address.label)}
                        </div>

                        <div>

                          <div className="flex flex-wrap items-center gap-2 mb-2">

                            <h3 className="font-medium text-white">
                              {address.label}
                            </h3>

                            {address.is_default && (
                              <span className="text-[9px] uppercase tracking-widest px-2 py-1 border border-brand-500/30 text-brand-400">
                                Default
                              </span>
                            )}

                            {isSelected && (
                              <span className="text-[9px] uppercase tracking-widest px-2 py-1 bg-brand-500/10 text-brand-400">
                                Selected
                              </span>
                            )}

                          </div>

                          {address.house_number && (
                            <p className="text-sm text-ivory-300 mb-1">
                              {address.house_number}
                            </p>
                          )}

                          <p className="text-sm text-ivory-500 leading-relaxed max-w-2xl">
                            {address.full_address}
                          </p>

                          {/* CITY + PINCODE */}

                          <p className="text-sm text-ivory-300 mt-2">
                            {address.city}

                            <span className="text-ivory-700 mx-2">
                              ·
                            </span>

                            {address.pincode}
                          </p>

                          {/* PHONE */}

                          {address.phone && (
                            <p className="text-sm text-ivory-400 mt-2">
                              <span className="text-ivory-600">
                                Phone:
                              </span>{" "}
                              {address.phone}
                            </p>
                          )}

                          {address.landmark && (
                            <p className="text-xs text-ivory-600 mt-2">
                              Landmark:{" "}
                              {address.landmark}
                            </p>
                          )}

                        </div>

                      </div>

                      {/* ================= ACTIONS ================= */}

                      <div className="flex items-center gap-2 sm:shrink-0">

                        <button
                          onClick={() =>
                            handleSelect(address)
                          }
                          className={`px-4 py-2.5 text-xs uppercase tracking-wider font-semibold transition ${
                            isSelected
                              ? "bg-brand-500 text-dark-950"
                              : "border border-brand-500/40 text-brand-400 hover:bg-brand-500 hover:text-dark-950"
                          }`}
                        >
                          {isSelected
                            ? "Selected"
                            : "Select"}
                        </button>

                        <button
                          onClick={() =>
                            openEditForm(address)
                          }
                          className="w-10 h-10 border border-white/10 text-ivory-500 hover:border-brand-500/40 hover:text-brand-400 flex items-center justify-center transition"
                          title="Edit"
                        >
                          <Pencil size={15} />
                        </button>

                        <button
                          onClick={() =>
                            handleDelete(address)
                          }
                          className="w-10 h-10 border border-white/10 text-ivory-500 hover:border-red-500/40 hover:text-red-400 flex items-center justify-center transition"
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>

                      </div>

                    </div>

                  </div>
                );
              })}

            </div>

          )}

        </section>

        {/* ================= ADD / EDIT FORM ================= */}

        {showForm && (

          <section className="mt-10 border border-white/10 bg-[#111112]">

            {/* FORM HEADER */}

            <div className="flex items-center justify-between border-b border-white/10 px-5 sm:px-7 py-5">

              <div>

                <p className="text-brand-400 text-[9px] uppercase tracking-[0.25em] mb-1">
                  {editingAddress
                    ? "Update Address"
                    : "New Delivery Address"}
                </p>

                <h2 className="font-serif text-2xl">
                  {editingAddress
                    ? "Edit your address"
                    : "Add a delivery address"}
                </h2>

              </div>

              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setError("");
                }}
                className="w-9 h-9 border border-white/10 flex items-center justify-center text-ivory-500 hover:text-white hover:border-white/20 transition"
              >
                <X size={17} />
              </button>

            </div>

            {/* FORM */}

            <form
              onSubmit={handleSubmit}
              className="p-5 sm:p-7"
            >

              {/* ================= ADDRESS LABEL ================= */}

              <div className="mb-6">

                <label className="block text-xs uppercase tracking-widest text-ivory-400 mb-3">
                  Save As
                </label>

                <div className="flex flex-wrap gap-2">

                  {["Home", "Work", "Other"].map(
                    (label) => (
                      <button
                        key={label}
                        type="button"
                        onClick={() =>
                          setForm((prev) => ({
                            ...prev,
                            label,
                          }))
                        }
                        className={`px-5 py-2.5 text-xs uppercase tracking-wider border transition ${
                          form.label === label
                            ? "bg-brand-500 text-dark-950 border-brand-500"
                            : "border-white/10 text-ivory-500 hover:border-brand-500/40 hover:text-brand-400"
                        }`}
                      >
                        {label}
                      </button>
                    )
                  )}

                </div>

              </div>

              {/* ================= HOUSE NUMBER ================= */}

              <div className="mb-5">

                <label className="block text-xs uppercase tracking-widest text-ivory-400 mb-2">
                  House / Flat / Building
                </label>

                <input
                  type="text"
                  name="house_number"
                  value={form.house_number}
                  onChange={handleChange}
                  placeholder="e.g. Flat 204, ABC Apartments"
                  className="w-full bg-[#0B0B0C] border border-white/10 px-4 py-3.5 text-sm text-white outline-none focus:border-brand-500/60 placeholder:text-ivory-700 transition"
                />

              </div>

              {/* ================= FULL ADDRESS ================= */}

              <div className="mb-5">

                <label className="block text-xs uppercase tracking-widest text-ivory-400 mb-2">
                  Street / Area
                </label>

                <textarea
                  name="full_address"
                  value={form.full_address}
                  onChange={handleChange}
                  placeholder="Enter your street, area..."
                  required
                  rows={3}
                  className="w-full bg-[#0B0B0C] border border-white/10 px-4 py-3.5 text-sm text-white outline-none focus:border-brand-500/60 placeholder:text-ivory-700 transition resize-none"
                />

              </div>

              {/* ================= CITY + PINCODE ================= */}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">

                <div>

                  <label className="block text-xs uppercase tracking-widest text-ivory-400 mb-2">
                    City
                  </label>

                  <input
                    type="text"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    placeholder="Enter city"
                    required
                    className="w-full bg-[#0B0B0C] border border-white/10 px-4 py-3.5 text-sm text-white outline-none focus:border-brand-500/60 placeholder:text-ivory-700 transition"
                  />

                </div>

                <div>

                  <label className="block text-xs uppercase tracking-widest text-ivory-400 mb-2">
                    Pincode
                  </label>

                  <input
                    type="text"
                    name="pincode"
                    inputMode="numeric"
                    maxLength={6}
                    value={form.pincode}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        pincode: e.target.value
                          .replace(/\D/g, "")
                          .slice(0, 6),
                      }))
                    }
                    placeholder="6-digit pincode"
                    required
                    className="w-full bg-[#0B0B0C] border border-white/10 px-4 py-3.5 text-sm text-white outline-none focus:border-brand-500/60 placeholder:text-ivory-700 transition"
                  />

                </div>

              </div>

              {/* ================= PHONE ================= */}

              <div className="mb-5">

                <label className="block text-xs uppercase tracking-widest text-ivory-400 mb-2">
                  Phone Number
                </label>

                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      phone: e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 10),
                    }))
                  }
                  placeholder="Enter 10-digit phone number"
                  maxLength={10}
                  inputMode="numeric"
                  required
                  className="w-full bg-[#0B0B0C] border border-white/10 px-4 py-3.5 text-sm text-white outline-none focus:border-brand-500/60 placeholder:text-ivory-700 transition"
                />

              </div>

              {/* ================= LANDMARK ================= */}

              <div className="mb-7">

                <label className="block text-xs uppercase tracking-widest text-ivory-400 mb-2">
                  Landmark

                  <span className="text-ivory-700 ml-1">
                    (Optional)
                  </span>
                </label>

                <input
                  type="text"
                  name="landmark"
                  value={form.landmark}
                  onChange={handleChange}
                  placeholder="e.g. Near City Mall"
                  className="w-full bg-[#0B0B0C] border border-white/10 px-4 py-3.5 text-sm text-white outline-none focus:border-brand-500/60 placeholder:text-ivory-700 transition"
                />

              </div>

              {/* ================= MAP ================= */}

              <div className="border border-white/10 overflow-hidden">

                <div className="px-4 py-4 bg-[#151516] border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">

                  <div>

                    <div className="flex items-center gap-2 text-sm font-medium">
                      <MapPin
                        size={16}
                        className="text-brand-400"
                      />

                      Set Delivery Location

                      {locationConfirmed && (
                        <span className="inline-flex items-center gap-1 text-[9px] uppercase tracking-wider text-green-400 ml-1">
                          <Check size={11} />
                          Confirmed
                        </span>
                      )}

                    </div>

                    <p className="text-xs text-ivory-600 mt-1">
                      Tap anywhere on the map to
                      select your exact delivery
                      location.
                    </p>

                  </div>

                  <button
                    type="button"
                    onClick={useCurrentLocation}
                    disabled={locating}
                    className="inline-flex items-center justify-center gap-2 border border-brand-500/40 text-brand-400 hover:bg-brand-500 hover:text-dark-950 disabled:opacity-50 px-4 py-2.5 text-xs uppercase tracking-wider font-semibold transition"
                  >
                    {locating ? (
                      <>
                        <Navigation
                          size={14}
                          className="animate-pulse"
                        />
                        Locating...
                      </>
                    ) : (
                      <>
                        <Crosshair size={14} />
                        Use Current Location
                      </>
                    )}
                  </button>

                </div>

                <div className="h-[360px] sm:h-[430px]">

                  <MapContainer
                    center={position}
                    zoom={15}
                    scrollWheelZoom={true}
                    className="h-full w-full"
                  >

                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    <MapCenter
                      position={position}
                    />

                    <LocationMarker
                      position={position}
                      setPosition={handleMapPosition}
                    />

                  </MapContainer>

                </div>

              </div>

              {/* ================= LOCATION STATUS ================= */}

              <div className="mt-4">

                {locationConfirmed ? (
                  <div className="flex items-center gap-2 text-xs text-green-400">
                    <Check size={14} />
                    Delivery location selected successfully.
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-xs text-brand-400">
                    <MapPin size={14} />
                    Please select your delivery location on the map.
                  </div>
                )}

              </div>

              {/* ================= COORDINATES ================= */}

              <div className="mt-3 flex flex-wrap gap-3 text-[10px] uppercase tracking-widest text-ivory-700">

                <span>
                  Latitude:{" "}
                  {form.latitude?.toFixed(6)}
                </span>

                <span>
                  Longitude:{" "}
                  {form.longitude?.toFixed(6)}
                </span>

              </div>

              {/* ================= DEFAULT ================= */}

              <label className="flex items-center gap-3 mt-6 cursor-pointer">

                <input
                  type="checkbox"
                  name="is_default"
                  checked={form.is_default}
                  onChange={handleChange}
                  className="w-4 h-4 accent-brand-500"
                />

                <span className="text-sm text-ivory-400">
                  Make this my default delivery
                  address
                </span>

              </label>

              {/* ================= ACTIONS ================= */}

              <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 mt-8">

                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setError("");
                  }}
                  className="border border-white/10 text-ivory-500 hover:text-white hover:border-white/20 px-6 py-3 text-xs uppercase tracking-widest transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="bg-brand-500 hover:bg-brand-400 disabled:opacity-60 text-dark-950 px-7 py-3 text-xs uppercase tracking-widest font-semibold transition inline-flex items-center justify-center gap-2"
                >
                  {saving
                    ? "Saving..."
                    : editingAddress
                    ? "Update Address"
                    : "Save Address"}

                  {!saving && <Check size={15} />}
                </button>

              </div>

            </form>

          </section>

        )}

      </div>

    </main>
  );
};

export default CustomerAddressesPage;