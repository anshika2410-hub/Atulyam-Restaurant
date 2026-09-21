import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import {
  Search,
  Users,
  UserCheck,
  UserX,
  MapPin,
  Mail,
  Phone,
  CalendarDays,
  ChevronRight,
  X,
  RefreshCw,
} from "lucide-react";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000";

const CustomersPage = () => {
  const { token, authChecked, isAuthenticated } = useAuth();

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const fetchCustomers = async (showRefresh = false) => {
    if (!token) {
      setCustomers([]);
      setLoading(false);
      return;
    }

    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response = await fetch(
        `${API_BASE_URL}/admin/customers`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const data = await response.json().catch(() => null);

        if (response.status === 401) {
          throw new Error("Admin authentication expired. Please login again.");
        }

        if (response.status === 403) {
          throw new Error("You are not authorized to access customers.");
        }

        throw new Error(
          data?.detail || "Failed to load customers."
        );
      }

      const data = await response.json();

      setCustomers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Customer fetch error:", err);
      setError(err.message || "Failed to load customers.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (!authChecked) {
      return;
    }

    if (!isAuthenticated || !token) {
      setLoading(false);
      setCustomers([]);
      return;
    }

    fetchCustomers();
  }, [authChecked, isAuthenticated, token]);

  const stats = useMemo(() => {
    const total = customers.length;

    const active = customers.filter(
      (customer) => customer.is_active
    ).length;

    const inactive = total - active;

    const withAddresses = customers.filter(
      (customer) => Number(customer.address_count || 0) > 0
    ).length;

    return {
      total,
      active,
      inactive,
      withAddresses,
    };
  }, [customers]);

  const filteredCustomers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return customers.filter((customer) => {
      const matchesSearch =
        !query ||
        customer.name?.toLowerCase().includes(query) ||
        customer.email?.toLowerCase().includes(query) ||
        customer.phone?.toLowerCase().includes(query) ||
        String(customer.id).includes(query);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && customer.is_active) ||
        (statusFilter === "inactive" && !customer.is_active);

      return matchesSearch && matchesStatus;
    });
  }, [customers, search, statusFilter]);

  const formatDate = (date) => {
    if (!date) return "—";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "—";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatDateTime = (date) => {
    if (!date) return "—";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "—";
    }

    return parsedDate.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-[#070707] px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1500px]">

        {/* Header */}
        <div className="mb-8 flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#f28a2e]">
              Admin / Customers
            </p>

            <h1 className="font-serif text-4xl font-semibold tracking-tight sm:text-5xl">
              Customers
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-white/45">
              Manage registered restaurant customers, account status and
              saved delivery addresses.
            </p>
          </div>

          <button
            type="button"
            onClick={() => fetchCustomers(true)}
            disabled={refreshing || !isAuthenticated}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 text-sm font-medium text-white/75 transition hover:border-[#f28a2e]/40 hover:bg-[#f28a2e]/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              size={16}
              className={refreshing ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>

        {/* Stats */}
        <div className="mb-7 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard
            icon={Users}
            label="Total Customers"
            value={stats.total}
          />

          <StatCard
            icon={UserCheck}
            label="Active"
            value={stats.active}
          />

          <StatCard
            icon={UserX}
            label="Inactive"
            value={stats.inactive}
          />

          <StatCard
            icon={MapPin}
            label="With Addresses"
            value={stats.withAddresses}
          />
        </div>

        {/* Main Card */}
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">

          {/* Toolbar */}
          <div className="border-b border-white/10 p-4 sm:p-5">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">

              <div className="relative w-full lg:max-w-md">
                <Search
                  size={17}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name, email, phone or ID..."
                  className="h-11 w-full rounded-xl border border-white/10 bg-black/30 pl-11 pr-4 text-sm text-white outline-none placeholder:text-white/25 transition focus:border-[#f28a2e]/50"
                />
              </div>

              <div className="flex rounded-xl border border-white/10 bg-black/20 p-1">
                {[
                  ["all", "All"],
                  ["active", "Active"],
                  ["inactive", "Inactive"],
                ].map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setStatusFilter(value)}
                    className={`rounded-lg px-4 py-2 text-xs font-semibold transition ${
                      statusFilter === value
                        ? "bg-[#f28a2e] text-black"
                        : "text-white/45 hover:text-white"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="m-5 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-4 text-sm text-red-300">
              <div className="font-medium">
                Unable to load customers
              </div>

              <div className="mt-1 text-xs text-red-300/60">
                {error}
              </div>
            </div>
          )}

          {/* Loading */}
          {loading ? (
            <div className="space-y-3 p-5">
              {[1, 2, 3, 4, 5].map((item) => (
                <div
                  key={item}
                  className="h-20 animate-pulse rounded-xl bg-white/[0.03]"
                />
              ))}
            </div>
          ) : !isAuthenticated ? (
            <div className="flex min-h-[320px] flex-col items-center justify-center px-6 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-red-400/10 bg-red-400/5">
                <UserX size={22} className="text-red-300/50" />
              </div>

              <h3 className="font-serif text-xl text-white/80">
                Authentication required
              </h3>

              <p className="mt-2 max-w-sm text-sm leading-6 text-white/35">
                Please login to the admin panel again.
              </p>
            </div>
          ) : filteredCustomers.length === 0 ? (
            <div className="flex min-h-[320px] flex-col items-center justify-center px-6 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/[0.03]">
                <Users size={22} className="text-white/30" />
              </div>

              <h3 className="font-serif text-xl text-white/80">
                No customers found
              </h3>

              <p className="mt-2 max-w-sm text-sm leading-6 text-white/35">
                {search
                  ? "Try changing your search or status filter."
                  : "Registered customers will appear here."}
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden overflow-x-auto lg:block">
                <table className="w-full min-w-[900px]">
                  <thead>
                    <tr className="border-b border-white/10 text-left">
                      <th className="px-5 py-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/30">
                        Customer
                      </th>

                      <th className="px-5 py-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/30">
                        Contact
                      </th>

                      <th className="px-5 py-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/30">
                        Addresses
                      </th>

                      <th className="px-5 py-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/30">
                        Joined
                      </th>

                      <th className="px-5 py-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/30">
                        Status
                      </th>

                      <th className="px-5 py-4" />
                    </tr>
                  </thead>

                  <tbody>
                    {filteredCustomers.map((customer) => (
                      <CustomerRow
                        key={customer.id}
                        customer={customer}
                        formatDate={formatDate}
                        onClick={() =>
                          setSelectedCustomer(customer)
                        }
                      />
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile / Tablet */}
              <div className="divide-y divide-white/10 lg:hidden">
                {filteredCustomers.map((customer) => (
                  <MobileCustomerCard
                    key={customer.id}
                    customer={customer}
                    formatDate={formatDate}
                    onClick={() =>
                      setSelectedCustomer(customer)
                    }
                  />
                ))}
              </div>

              {/* Footer */}
              <div className="border-t border-white/10 px-5 py-4">
                <p className="text-xs text-white/30">
                  Showing{" "}
                  <span className="text-white/60">
                    {filteredCustomers.length}
                  </span>{" "}
                  of{" "}
                  <span className="text-white/60">
                    {customers.length}
                  </span>{" "}
                  customers
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Customer Detail Drawer */}
      {selectedCustomer && (
        <CustomerDetails
  customer={selectedCustomer}
  formatDateTime={formatDateTime}
  onClose={() => setSelectedCustomer(null)}
  onStatusChange={(updatedCustomer) => {
    setCustomers((prevCustomers) =>
      prevCustomers.map((customer) =>
        customer.id === updatedCustomer.id
          ? {
              ...customer,
              ...updatedCustomer,
            }
          : customer
      )
    );

    setSelectedCustomer((prevCustomer) =>
      prevCustomer
        ? {
            ...prevCustomer,
            ...updatedCustomer,
          }
        : null
    );
  }}
/>
      )}
    </div>
  );
};

/* =========================================================
   STAT CARD
========================================================= */

const StatCard = ({ icon: Icon, label, value }) => {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 sm:p-5">
      <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-xl border border-[#f28a2e]/20 bg-[#f28a2e]/10 text-[#f28a2e]">
        <Icon size={17} />
      </div>

      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/30">
        {label}
      </p>

      <p className="mt-1 font-serif text-2xl text-white">
        {value}
      </p>
    </div>
  );
};

/* =========================================================
   DESKTOP CUSTOMER ROW
========================================================= */

const CustomerRow = ({
  customer,
  formatDate,
  onClick,
}) => {
  return (
    <tr
      onClick={onClick}
      className="cursor-pointer border-b border-white/[0.06] transition hover:bg-white/[0.025]"
    >
      <td className="px-5 py-5">
        <div className="flex items-center gap-3">
          <CustomerAvatar name={customer.name} />

          <div className="min-w-0">
            <div className="truncate font-medium text-white/90">
              {customer.name}
            </div>

            <div className="mt-0.5 text-xs text-white/30">
              Customer #{customer.id}
            </div>
          </div>
        </div>
      </td>

      <td className="px-5 py-5">
        <div className="text-sm text-white/65">
          {customer.email || "—"}
        </div>

        <div className="mt-1 text-xs text-white/30">
          {customer.phone || "No phone number"}
        </div>
      </td>

      <td className="px-5 py-5">
        <div className="inline-flex items-center gap-2 text-sm text-white/65">
          <MapPin
            size={14}
            className="text-white/30"
          />

          {customer.address_count || 0}
        </div>
      </td>

      <td className="px-5 py-5 text-sm text-white/50">
        {formatDate(customer.created_at)}
      </td>

      <td className="px-5 py-5">
        <StatusBadge active={customer.is_active} />
      </td>

      <td className="px-5 py-5 text-right">
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onClick();
          }}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-white/35 transition hover:border-[#f28a2e]/30 hover:text-[#f28a2e]"
        >
          <ChevronRight size={16} />
        </button>
      </td>
    </tr>
  );
};

/* =========================================================
   MOBILE CUSTOMER CARD
========================================================= */

const MobileCustomerCard = ({
  customer,
  formatDate,
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-4 p-5 text-left transition hover:bg-white/[0.025]"
    >
      <CustomerAvatar name={customer.name} />

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-3">
          <div className="truncate font-medium text-white/90">
            {customer.name}
          </div>

          <StatusBadge active={customer.is_active} />
        </div>

        <div className="mt-1 truncate text-xs text-white/40">
          {customer.email}
        </div>

        <div className="mt-2 flex flex-wrap gap-3 text-[11px] text-white/30">
          <span>#{customer.id}</span>

          <span>
            {customer.address_count || 0}{" "}
            {Number(customer.address_count || 0) === 1
              ? "address"
              : "addresses"}
          </span>

          <span>{formatDate(customer.created_at)}</span>
        </div>
      </div>

      <ChevronRight
        size={17}
        className="shrink-0 text-white/25"
      />
    </button>
  );
};

/* =========================================================
   AVATAR
========================================================= */

const CustomerAvatar = ({ name }) => {
  const initial =
    name?.trim()?.charAt(0)?.toUpperCase() || "?";

  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#f28a2e]/20 bg-[#f28a2e]/10 font-serif text-sm text-[#f28a2e]">
      {initial}
    </div>
  );
};

/* =========================================================
   STATUS BADGE
========================================================= */

const StatusBadge = ({ active }) => {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${
        active
          ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
          : "border-red-400/20 bg-red-400/10 text-red-300"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          active ? "bg-emerald-400" : "bg-red-400"
        }`}
      />

      {active ? "Active" : "Inactive"}
    </span>
  );
};

/* =========================================================
   CUSTOMER DETAILS DRAWER
========================================================= */
const CustomerDetails = ({
  customer,
  formatDateTime,
  onClose,
  onStatusChange,
}) => {
    const { token } = useAuth();
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [statusError, setStatusError] = useState("");

  const handleStatusChange = async () => {
    if (!customer?.id) return;

    const nextStatus = !customer.is_active;

    const confirmed = window.confirm(
      nextStatus
        ? `Activate ${customer.name}'s account?`
        : `Deactivate ${customer.name}'s account?`
    );

    if (!confirmed) return;

    try {
      setUpdatingStatus(true);
      setStatusError("");

      const response = await fetch(
        `${API_BASE_URL}/admin/customers/${customer.id}/status?is_active=${nextStatus}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.detail || "Failed to update customer status."
        );
      }

      onStatusChange(data.customer);
    } catch (error) {
      console.error("Customer status update error:", error);

      setStatusError(
        error.message || "Failed to update customer status."
      );
    } finally {
      setUpdatingStatus(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100]">
      <button
        type="button"
        aria-label="Close customer details"
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />

      <div className="absolute right-0 top-0 h-full w-full max-w-xl overflow-y-auto border-l border-white/10 bg-[#0b0b0b] shadow-2xl">

        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-[#0b0b0b]/95 px-5 py-5 backdrop-blur-xl sm:px-7">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#f28a2e]">
              Customer Details
            </p>

            <h2 className="mt-1 font-serif text-2xl text-white">
              {customer.name}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-white/45 transition hover:border-white/20 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-6 p-5 sm:p-7">

          {/* Profile */}
          <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
            <div className="mb-5 flex items-center gap-4">
              <CustomerAvatar name={customer.name} />

              <div className="min-w-0">
                <h3 className="truncate font-medium text-white/90">
                  {customer.name}
                </h3>

                <p className="mt-1 text-xs text-white/30">
                  Customer #{customer.id}
                </p>
              </div>

              <div className="ml-auto">
                <StatusBadge active={customer.is_active} />
              </div>
            </div>

            <div className="space-y-4">
              <DetailItem
                icon={Mail}
                label="Email"
                value={customer.email}
              />

              <DetailItem
                icon={Phone}
                label="Phone"
                value={customer.phone || "Not provided"}
              />

              <DetailItem
                icon={CalendarDays}
                label="Joined"
                value={formatDateTime(customer.created_at)}
              />

              <DetailItem
                icon={RefreshCw}
                label="Last Updated"
                value={formatDateTime(customer.updated_at)}
              />
            </div>

            {/* Status Action */}
            <div className="mt-6 border-t border-white/[0.06] pt-5">
              {statusError && (
                <div className="mb-3 rounded-xl border border-red-400/20 bg-red-400/5 px-3 py-3 text-xs text-red-300">
                  {statusError}
                </div>
              )}

              <button
                type="button"
                onClick={handleStatusChange}
                disabled={updatingStatus}
                className={`flex h-11 w-full items-center justify-center gap-2 rounded-xl border text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                  customer.is_active
                    ? "border-red-400/20 bg-red-400/5 text-red-300 hover:border-red-400/40 hover:bg-red-400/10"
                    : "border-emerald-400/20 bg-emerald-400/5 text-emerald-300 hover:border-emerald-400/40 hover:bg-emerald-400/10"
                }`}
              >
                {updatingStatus ? (
                  <>
                    <RefreshCw
                      size={16}
                      className="animate-spin"
                    />
                    Updating...
                  </>
                ) : customer.is_active ? (
                  <>
                    <UserX size={16} />
                    Deactivate Customer
                  </>
                ) : (
                  <>
                    <UserCheck size={16} />
                    Activate Customer
                  </>
                )}
              </button>

              <p className="mt-2 text-center text-[10px] leading-5 text-white/25">
                {customer.is_active
                  ? "Deactivating will prevent this customer from logging in."
                  : "Activating will allow this customer to login again."}
              </p>
            </div>
          </section>

          {/* Addresses */}
          <section>
            <div className="mb-4 flex items-end justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#f28a2e]">
                  Saved Addresses
                </p>

                <h3 className="mt-1 font-serif text-xl text-white">
                  Delivery Addresses
                </h3>
              </div>

              <span className="text-xs text-white/30">
                {customer.address_count || 0} total
              </span>
            </div>

            {!customer.addresses?.length ? (
              <div className="rounded-2xl border border-dashed border-white/10 px-5 py-8 text-center">
                <MapPin
                  size={20}
                  className="mx-auto mb-3 text-white/20"
                />

                <p className="text-sm text-white/40">
                  No saved addresses
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {customer.addresses.map((address) => (
                  <div
                    key={address.id}
                    className="rounded-2xl border border-white/10 bg-white/[0.02] p-5"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <MapPin
                          size={15}
                          className="text-[#f28a2e]"
                        />

                        <span className="text-sm font-medium text-white/80">
                          {address.label || "Address"}
                        </span>
                      </div>

                      {address.is_default && (
                        <span className="rounded-full border border-[#f28a2e]/20 bg-[#f28a2e]/10 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wider text-[#f28a2e]">
                          Default
                        </span>
                      )}
                    </div>

                    <div className="mt-4 space-y-1 text-sm leading-6 text-white/50">
                      {address.house_number && (
                        <p>{address.house_number}</p>
                      )}

                      <p>{address.full_address}</p>

                      <p>
                        {address.city} — {address.pincode}
                      </p>

                      {address.landmark && (
                        <p className="text-white/35">
                          Landmark: {address.landmark}
                        </p>
                      )}
                    </div>

                    {address.phone && (
                      <div className="mt-4 flex items-center gap-2 border-t border-white/[0.06] pt-4 text-xs text-white/35">
                        <Phone size={13} />
                        {address.phone}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   DETAIL ITEM
========================================================= */

const DetailItem = ({
  icon: Icon,
  label,
  value,
}) => {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 text-white/25">
        <Icon size={15} />
      </div>

      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/25">
          {label}
        </p>

        <p className="mt-1 break-words text-sm text-white/65">
          {value || "—"}
        </p>
      </div>
    </div>
  );
};

export default CustomersPage;