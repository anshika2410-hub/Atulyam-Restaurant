import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Save,
  User,
  Store,
  Bell,
  Globe,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  ShieldCheck,
  Clock3,
  Eye,
  EyeOff,
} from "lucide-react";

const USER_KEY = "atulyam_admin_user";
const RESTAURANT_SETTINGS_KEY = "atulyam_restaurant_settings";
const NOTIFICATION_SETTINGS_KEY = "atulyam_admin_notifications";
const WEBSITE_SETTINGS_KEY = "atulyam_admin_website_settings";

const DEFAULT_RESTAURANT = {
  name: "Atulyam Restaurant",
  phone: "+91 9335 9494 48",
  email: "",
  address:
    "Milan Chauraha, Jhusi, Prayagraj, Uttar Pradesh 211019",
};

const DEFAULT_NOTIFICATIONS = {
  newOrders: true,
  orderUpdates: true,
  newReservations: true,
  offers: false,
};

const DEFAULT_WEBSITE = {
  restaurantOpen: true,
  maintenanceMode: false,
};

const Toggle = ({ checked, onChange }) => (
  <button
    type="button"
    onClick={() => onChange(!checked)}
    className={`relative h-6 w-11 shrink-0 rounded-full transition-all duration-300 ${
      checked ? "bg-[#f28a2e]" : "bg-white/10"
    }`}
  >
    <span
      className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-all duration-300 ${
        checked ? "left-6" : "left-1"
      }`}
    />
  </button>
);

const InputField = ({
  label,
  value,
  onChange,
  placeholder,
  icon: Icon,
  type = "text",
}) => (
  <div>
    <label className="mb-2 block text-[9px] uppercase tracking-[0.2em] text-white/35">
      {label}
    </label>

    <div className="relative">
      {Icon && (
        <Icon className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/25" />
      )}

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`h-12 w-full rounded-xl border border-white/10 bg-[#0d0d0d] text-sm text-white outline-none transition-all placeholder:text-white/20 focus:border-[#f28a2e]/50 ${
          Icon ? "pl-11 pr-4" : "px-4"
        }`}
      />
    </div>
  </div>
);

const SectionHeader = ({ eyebrow, title, description }) => (
  <div className="mb-6">
    <p className="mb-2 text-[9px] uppercase tracking-[0.3em] text-[#f28a2e]">
      {eyebrow}
    </p>

    <h2 className="font-serif text-2xl text-white md:text-3xl">
      {title}
    </h2>

    <p className="mt-2 max-w-2xl text-sm text-white/35">
      {description}
    </p>
  </div>
);

const SettingsPage = () => {
  const [restaurant, setRestaurant] = useState(
    DEFAULT_RESTAURANT
  );

  const [admin, setAdmin] = useState({
    name: "",
    email: "",
  });

  const [notifications, setNotifications] = useState(
    DEFAULT_NOTIFICATIONS
  );

  const [website, setWebsite] = useState(DEFAULT_WEBSITE);

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const savedRestaurant = localStorage.getItem(
        RESTAURANT_SETTINGS_KEY
      );

      const savedUser = localStorage.getItem(USER_KEY);

      const savedNotifications = localStorage.getItem(
        NOTIFICATION_SETTINGS_KEY
      );

      const savedWebsite = localStorage.getItem(
        WEBSITE_SETTINGS_KEY
      );

      if (savedRestaurant) {
        setRestaurant({
          ...DEFAULT_RESTAURANT,
          ...JSON.parse(savedRestaurant),
        });
      }

      if (savedUser) {
        const storedUser = JSON.parse(savedUser);

        setAdmin({
          name:
            storedUser?.name ||
            storedUser?.full_name ||
            storedUser?.username ||
            "",
          email: storedUser?.email || "",
        });
      }

      if (savedNotifications) {
        setNotifications({
          ...DEFAULT_NOTIFICATIONS,
          ...JSON.parse(savedNotifications),
        });
      }

      if (savedWebsite) {
        setWebsite({
          ...DEFAULT_WEBSITE,
          ...JSON.parse(savedWebsite),
        });
      }
    } catch (error) {
      console.error("Unable to load settings:", error);
    }
  }, []);

  const handleSave = () => {
    setSaving(true);
    setSaved(false);

    localStorage.setItem(
      RESTAURANT_SETTINGS_KEY,
      JSON.stringify(restaurant)
    );

    localStorage.setItem(
      NOTIFICATION_SETTINGS_KEY,
      JSON.stringify(notifications)
    );

    localStorage.setItem(
      WEBSITE_SETTINGS_KEY,
      JSON.stringify(website)
    );

    try {
      const existingUser = JSON.parse(
        localStorage.getItem(USER_KEY) || "{}"
      );

      localStorage.setItem(
        USER_KEY,
        JSON.stringify({
          ...existingUser,
          name: admin.name,
          email: admin.email,
        })
      );
    } catch {}

    setTimeout(() => {
      setSaving(false);
      setSaved(true);

      setTimeout(() => {
        setSaved(false);
      }, 2200);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#090909] text-white p-4 sm:p-6 lg:p-8">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 mb-8">

        <div>
          <p className="text-[#f28a2e] uppercase tracking-[0.25em] text-xs mb-2">
            Admin Panel
          </p>

          <h1 className="text-3xl sm:text-4xl font-serif">
            Settings
          </h1>

          <p className="text-white/50 mt-2 text-sm">
            Manage your restaurant and dashboard preferences.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center justify-center gap-2 bg-[#f28a2e] hover:bg-[#ff9b45] text-black font-semibold px-5 py-3 rounded-xl transition disabled:opacity-60"
        >
          {saved ? (
            <>
              <CheckCircle2 size={18} />
              Saved
            </>
          ) : (
            <>
              <Save size={18} />
              {saving ? "Saving..." : "Save Changes"}
            </>
          )}
        </button>

      </div>

      {/* RESTAURANT INFORMATION */}
      <motion.section
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <SectionHeader
          eyebrow="Restaurant"
          title="Restaurant information"
          description="Update the information used across your restaurant dashboard."
        />

        <div className="rounded-2xl border border-white/10 bg-white/[0.03]">

          <div className="border-b border-white/10 px-5 py-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#f28a2e]/10 flex items-center justify-center">
              <Store className="w-4 h-4 text-[#f28a2e]" />
            </div>

            <div>
              <p className="text-sm text-white/80">
                Business details
              </p>

              <p className="text-[11px] text-white/30 mt-1">
                Keep your restaurant profile accurate.
              </p>
            </div>
          </div>

          <div className="p-5 md:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <InputField
                label="Restaurant name"
                value={restaurant.name}
                onChange={(value) =>
                  setRestaurant((prev) => ({
                    ...prev,
                    name: value,
                  }))
                }
                icon={Store}
              />

              <InputField
                label="Phone number"
                value={restaurant.phone}
                onChange={(value) =>
                  setRestaurant((prev) => ({
                    ...prev,
                    phone: value,
                  }))
                }
                icon={Phone}
              />

              <InputField
                label="Email address"
                value={restaurant.email}
                onChange={(value) =>
                  setRestaurant((prev) => ({
                    ...prev,
                    email: value,
                  }))
                }
                icon={Mail}
                placeholder="restaurant@example.com"
                type="email"
              />

              <InputField
                label="Restaurant address"
                value={restaurant.address}
                onChange={(value) =>
                  setRestaurant((prev) => ({
                    ...prev,
                    address: value,
                  }))
                }
                icon={MapPin}
              />

            </div>
          </div>
        </div>
      </motion.section>

      {/* ADMIN ACCOUNT */}
      <motion.section
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="mb-8"
      >
        <SectionHeader
          eyebrow="Account"
          title="Admin account"
          description="Manage the administrator information used by this dashboard."
        />

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 md:p-6">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <InputField
              label="Full name"
              value={admin.name}
              onChange={(value) =>
                setAdmin((prev) => ({
                  ...prev,
                  name: value,
                }))
              }
              icon={User}
              placeholder="Admin name"
            />

            <InputField
              label="Email address"
              value={admin.email}
              onChange={(value) =>
                setAdmin((prev) => ({
                  ...prev,
                  email: value,
                }))
              }
              icon={Mail}
              placeholder="admin@example.com"
              type="email"
            />

          </div>
        </div>
      </motion.section>

      {/* NOTIFICATIONS */}
      <motion.section
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <SectionHeader
          eyebrow="Preferences"
          title="Notifications"
          description="Choose which dashboard alerts should remain active."
        />

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden">

          {[
            {
              key: "newOrders",
              title: "New orders",
              description:
                "Receive alerts when a new order arrives.",
            },
            {
              key: "orderUpdates",
              title: "Order updates",
              description:
                "Get notified when order status changes.",
            },
            {
              key: "newReservations",
              title: "New reservations",
              description:
                "Receive alerts for new table reservations.",
            },
            {
              key: "offers",
              title: "Offers & promotions",
              description:
                "Receive reminders about offers and campaigns.",
            },
          ].map((item, index, array) => (
            <div
              key={item.key}
              className={`flex items-center justify-between gap-5 px-5 py-5 md:px-6 ${
                index !== array.length - 1
                  ? "border-b border-white/10"
                  : ""
              }`}
            >
              <div className="flex items-center gap-4">

                <div className="w-9 h-9 shrink-0 rounded-lg bg-white/[0.04] flex items-center justify-center">
                  <Bell className="w-4 h-4 text-white/35" />
                </div>

                <div>
                  <p className="text-sm text-white/80">
                    {item.title}
                  </p>

                  <p className="text-[11px] text-white/30 mt-1">
                    {item.description}
                  </p>
                </div>

              </div>

              <Toggle
                checked={notifications[item.key]}
                onChange={(value) =>
                  setNotifications((prev) => ({
                    ...prev,
                    [item.key]: value,
                  }))
                }
              />
            </div>
          ))}

        </div>
      </motion.section>

      {/* WEBSITE */}
      <motion.section
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mb-8"
      >
        <SectionHeader
          eyebrow="Website"
          title="Website controls"
          description="Manage the basic availability state of your restaurant website."
        />

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden">

          <div className="flex items-center justify-between gap-5 px-5 py-5 md:px-6 border-b border-white/10">

            <div className="flex items-center gap-4">

              <div className="w-10 h-10 shrink-0 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <Globe className="w-4 h-4 text-emerald-400" />
              </div>

              <div>
                <p className="text-sm text-white/80">
                  Restaurant is open
                </p>

                <p className="text-[11px] text-white/30 mt-1">
                  Show the restaurant as open on the website.
                </p>
              </div>

            </div>

            <Toggle
              checked={website.restaurantOpen}
              onChange={(value) =>
                setWebsite((prev) => ({
                  ...prev,
                  restaurantOpen: value,
                }))
              }
            />

          </div>

          <div className="flex items-center justify-between gap-5 px-5 py-5 md:px-6">

            <div className="flex items-center gap-4">

              <div className="w-10 h-10 shrink-0 rounded-xl bg-amber-500/10 flex items-center justify-center">
                {website.maintenanceMode ? (
                  <EyeOff className="w-4 h-4 text-amber-400" />
                ) : (
                  <Eye className="w-4 h-4 text-amber-400" />
                )}
              </div>

              <div>
                <p className="text-sm text-white/80">
                  Maintenance mode
                </p>

                <p className="text-[11px] text-white/30 mt-1">
                  Indicate that the website is temporarily unavailable.
                </p>
              </div>

            </div>

            <Toggle
              checked={website.maintenanceMode}
              onChange={(value) =>
                setWebsite((prev) => ({
                  ...prev,
                  maintenanceMode: value,
                }))
              }
            />

          </div>

        </div>
      </motion.section>

      <div className="border-t border-white/10 pt-5 pb-8 flex items-center gap-3">
        <ShieldCheck className="w-4 h-4 text-white/20" />

        <p className="text-[10px] text-white/25">
          Settings are currently stored locally in this browser.
        </p>

        <Clock3 className="ml-auto w-4 h-4 text-white/15 hidden sm:block" />
      </div>

    </div>
  );
};

export default SettingsPage;