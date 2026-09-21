import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  CalendarDays,
  Tag,
  ToggleLeft,
  ToggleRight,
  Percent,
  IndianRupee,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";

const API_URL =
  import.meta.env.VITE_API_URL ;

const ease = [0.22, 1, 0.36, 1];

const emptyForm = {
  title: "",
  code: "",
  description: "",
  discount_percentage: "",
  min_order_amount: "",
  valid_until: "",
  is_active: true,
};

const OffersPage = () => {
  const { token } = useAuth();

  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);

  const [form, setForm] = useState(emptyForm);
  const [deleteOfferData, setDeleteOfferData] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });

    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  // =========================================================
  // FETCH OFFERS
  // =========================================================

  const fetchOffers = async () => {
    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/offers?active_only=false`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Unable to load offers");
      }

      setOffers(data);
    } catch (error) {
      console.error(error);
      showToast(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  // =========================================================
  // STATS
  // =========================================================

  const stats = useMemo(() => {
    return {
      total: offers.length,
      active: offers.filter((offer) => offer.is_active).length,
      inactive: offers.filter((offer) => !offer.is_active).length,
    };
  }, [offers]);

  // =========================================================
  // ADD
  // =========================================================

  const openAddModal = () => {
    setEditingOffer(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  // =========================================================
  // EDIT
  // =========================================================

  const openEditModal = (offer) => {
    setEditingOffer(offer);

    setForm({
      title: offer.title || "",
      code: offer.code || "",
      description: offer.description || "",
      discount_percentage: offer.discount_percentage ?? "",
      min_order_amount: offer.min_order_amount ?? "",
      valid_until: offer.valid_until
        ? formatDateForInput(offer.valid_until)
        : "",
      is_active: Boolean(offer.is_active),
    });

    setShowModal(true);
  };

  // =========================================================
  // CLOSE MODAL
  // =========================================================

  const closeModal = () => {
    if (saving) return;

    setShowModal(false);
    setEditingOffer(null);
    setForm(emptyForm);
  };

  // =========================================================
  // FORM CHANGE
  // =========================================================

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // =========================================================
  // CREATE / UPDATE
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim()) {
      showToast("Offer title is required", "error");
      return;
    }

    if (!form.code.trim()) {
      showToast("Offer code is required", "error");
      return;
    }

    if (
      !form.discount_percentage ||
      Number(form.discount_percentage) < 1 ||
      Number(form.discount_percentage) > 100
    ) {
      showToast("Discount must be between 1% and 100%", "error");
      return;
    }

    if (
      form.min_order_amount === "" ||
      Number(form.min_order_amount) < 0
    ) {
      showToast("Enter a valid minimum order amount", "error");
      return;
    }

    setSaving(true);

    const payload = {
      title: form.title.trim(),
      code: form.code.trim().toUpperCase(),
      description: form.description.trim() || null,
      discount_percentage: Number(form.discount_percentage),
      min_order_amount: Number(form.min_order_amount || 0),
      valid_until: form.valid_until
        ? `${form.valid_until}T23:59:59`
        : null,
      is_active: Boolean(form.is_active),
    };

    try {
      const url = editingOffer
        ? `${API_URL}/offers/${editingOffer.id}`
        : `${API_URL}/offers`;

      const response = await fetch(url, {
        method: editingOffer ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Unable to save offer");
      }

      showToast(
        editingOffer
          ? "Offer updated successfully"
          : "Offer created successfully"
      );

      closeModal();
      fetchOffers();
    } catch (error) {
      console.error(error);
      showToast(error.message, "error");
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // TOGGLE ACTIVE / INACTIVE
  // =========================================================

  const toggleOffer = async (offer) => {
    try {
      const response = await fetch(
        `${API_URL}/offers/${offer.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            is_active: !offer.is_active,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Unable to update offer status"
        );
      }

      setOffers((prev) =>
        prev.map((item) =>
          item.id === offer.id
            ? {
                ...item,
                is_active: !offer.is_active,
              }
            : item
        )
      );

      showToast(
        offer.is_active
          ? "Offer deactivated"
          : "Offer activated"
      );
    } catch (error) {
      console.error(error);
      showToast(error.message, "error");
    }
  };

  // =========================================================
  // DELETE
  // =========================================================

  const confirmDelete = async () => {
    if (!deleteOfferData) return;

    try {
      const response = await fetch(
        `${API_URL}/offers/${deleteOfferData.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Unable to delete offer"
        );
      }

      setOffers((prev) =>
        prev.filter(
          (offer) => offer.id !== deleteOfferData.id
        )
      );

      setDeleteOfferData(null);

      showToast("Offer deleted successfully");
    } catch (error) {
      console.error(error);
      showToast(error.message, "error");
    }
  };

  // =========================================================
  // DATE HELPERS
  // =========================================================

  const formatDate = (date) => {
    if (!date) return "No expiry";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "No expiry";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatDateForInput = (date) => {
    if (!date) return "";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "";
    }

    const year = parsedDate.getFullYear();
    const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
    const day = String(parsedDate.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  return (
    <main className="min-h-screen bg-[#090909] text-white p-6 md:p-8 lg:p-10">
      <div className="max-w-[1500px] mx-auto">

        {/* HEADER */}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10"
        >
          <div>
            <span className="text-[#f28a2e] text-[9px] uppercase tracking-[0.3em]">
              Marketing
            </span>

            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl tracking-[-0.04em] mt-3">
              Offers
            </h1>

            <p className="text-white/35 text-sm mt-3 max-w-lg">
              Create and manage special offers for the Atulyam website.
            </p>
          </div>

          <button
            onClick={openAddModal}
            className="h-12 px-6 bg-[#f28a2e] text-black flex items-center justify-center gap-3 text-[10px] uppercase tracking-[0.2em] hover:bg-white transition-colors duration-300"
          >
            <Plus size={16} />
            Add New Offer
          </button>
        </motion.div>

        {/* STATS */}

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
          <StatCard
            label="Total Offers"
            value={stats.total}
          />

          <StatCard
            label="Active"
            value={stats.active}
            accent
          />

          <StatCard
            label="Inactive"
            value={stats.inactive}
            hiddenMobile
          />
        </div>

        {/* OFFERS */}

        {loading ? (
          <LoadingState />
        ) : offers.length === 0 ? (
          <div className="border border-dashed border-white/10 min-h-[400px] flex flex-col items-center justify-center text-center">
            <Tag
              size={30}
              className="text-white/15 mb-5"
            />

            <h2 className="font-serif text-2xl text-white/50">
              No offers yet
            </h2>

            <p className="text-white/25 text-sm mt-2">
              Create your first restaurant offer.
            </p>

            <button
              onClick={openAddModal}
              className="mt-6 border border-white/15 px-5 py-3 text-[9px] uppercase tracking-[0.2em] hover:bg-[#f28a2e] hover:text-black transition-all"
            >
              Create Offer
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
            <AnimatePresence mode="popLayout">
              {offers.map((offer, index) => (
                <motion.article
                  key={offer.id}
                  layout
                  initial={{
                    opacity: 0,
                    y: 25,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.96,
                  }}
                  transition={{
                    duration: 0.45,
                    delay: Math.min(index * 0.06, 0.3),
                    ease,
                  }}
                  className="group bg-[#0d0d0d] border border-white/10 hover:border-[#f28a2e]/40 transition-colors duration-500 overflow-hidden"
                >
                  {/* OFFER HEADER */}

                  <div className="relative min-h-[170px] bg-gradient-to-br from-[#181818] via-[#101010] to-[#0a0a0a] p-6 flex flex-col justify-between overflow-hidden">
                    <div className="absolute -right-16 -top-16 w-40 h-40 rounded-full border border-[#f28a2e]/10" />
                    <div className="absolute -right-10 -top-10 w-28 h-28 rounded-full border border-[#f28a2e]/10" />

                    <div className="relative flex items-start justify-between gap-4">
                      <span className="inline-flex bg-[#f28a2e] text-black px-3 py-2 text-[10px] uppercase tracking-[0.15em]">
                        {offer.discount_percentage}% OFF
                      </span>

                      <span
                        className={`px-3 py-1.5 text-[8px] uppercase tracking-[0.18em] border ${
                          offer.is_active
                            ? "bg-green-500/10 text-green-400 border-green-400/20"
                            : "bg-white/5 text-white/35 border-white/10"
                        }`}
                      >
                        {offer.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>

                    <div className="relative mt-8">
                      <p className="text-[#f28a2e]/60 text-[8px] uppercase tracking-[0.3em] mb-2">
                        Special Offer
                      </p>

                      <div className="font-serif text-5xl md:text-6xl text-white/90 leading-none">
                        {offer.discount_percentage}%
                      </div>
                    </div>
                  </div>

                  {/* CONTENT */}

                  <div className="p-5 md:p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <h2 className="font-serif text-2xl leading-tight">
                          {offer.title}
                        </h2>

                        <div className="flex items-center gap-2 mt-2">
                          <Tag
                            size={12}
                            className="text-[#f28a2e]"
                          />

                          <span className="text-[#f28a2e] text-[9px] uppercase tracking-[0.18em]">
                            {offer.code}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => toggleOffer(offer)}
                        className="shrink-0 text-white/35 hover:text-[#f28a2e] transition-colors"
                        title={
                          offer.is_active
                            ? "Deactivate offer"
                            : "Activate offer"
                        }
                      >
                        {offer.is_active ? (
                          <ToggleRight size={27} />
                        ) : (
                          <ToggleLeft size={27} />
                        )}
                      </button>
                    </div>

                    <p className="text-white/35 text-xs leading-6 mt-3 line-clamp-2 min-h-[48px]">
                      {offer.description ||
                        "No description provided."}
                    </p>

                    <div className="flex flex-col gap-2 mt-5 text-white/30">
                      <div className="flex items-center gap-2">
                        <CalendarDays size={14} />

                        <span className="text-[9px] uppercase tracking-[0.15em]">
                          Valid till{" "}
                          {formatDate(offer.valid_until)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <IndianRupee size={14} />

                        <span className="text-[9px] uppercase tracking-[0.15em]">
                          Min. order ₹
                          {Number(
                            offer.min_order_amount || 0
                          ).toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>

                    {/* ACTIONS */}

                    <div className="grid grid-cols-2 gap-2 mt-6">
                      <button
                        onClick={() => openEditModal(offer)}
                        className="h-11 border border-white/10 text-white/50 flex items-center justify-center gap-2 text-[9px] uppercase tracking-[0.18em] hover:border-[#f28a2e] hover:text-[#f28a2e] transition-all"
                      >
                        <Pencil size={14} />
                        Edit
                      </button>

                      <button
                        onClick={() => setDeleteOfferData(offer)}
                        className="h-11 border border-white/10 text-white/50 flex items-center justify-center gap-2 text-[9px] uppercase tracking-[0.18em] hover:border-red-400/50 hover:text-red-400 transition-all"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* ADD / EDIT MODAL */}

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
            onClick={closeModal}
          >
            <motion.div
              initial={{
                opacity: 0,
                y: 25,
                scale: 0.98,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                y: 25,
                scale: 0.98,
              }}
              transition={{
                duration: 0.35,
                ease,
              }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#101010] border border-white/10"
            >
              {/* HEADER */}

              <div className="sticky top-0 z-10 flex items-center justify-between px-6 md:px-8 py-5 border-b border-white/10 bg-[#101010]">
                <div>
                  <span className="text-[#f28a2e] text-[8px] uppercase tracking-[0.25em]">
                    {editingOffer ? "Edit Offer" : "New Offer"}
                  </span>

                  <h2 className="font-serif text-2xl mt-1">
                    {editingOffer
                      ? "Update offer"
                      : "Create an offer"}
                  </h2>
                </div>

                <button
                  onClick={closeModal}
                  className="w-9 h-9 border border-white/10 flex items-center justify-center text-white/50 hover:bg-[#f28a2e] hover:text-black hover:border-[#f28a2e] transition-all"
                >
                  <X size={16} />
                </button>
              </div>

              {/* FORM */}

              <form
                onSubmit={handleSubmit}
                className="p-6 md:p-8 space-y-6"
              >
                {/* TITLE + CODE */}

                <div className="grid sm:grid-cols-2 gap-4">
                  <FormField label="Offer Title">
                    <input
                      type="text"
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                      placeholder="e.g. Weekend Special"
                      className="admin-input"
                    />
                  </FormField>

                  <FormField label="Offer Code">
                    <input
                      type="text"
                      name="code"
                      value={form.code}
                      onChange={handleChange}
                      placeholder="e.g. WEEKEND20"
                      className="admin-input uppercase"
                    />
                  </FormField>
                </div>

                {/* DISCOUNT + MINIMUM ORDER */}

                <div className="grid sm:grid-cols-2 gap-4">
                  <FormField label="Discount Percentage">
                    <div className="relative">
                      <input
                        type="number"
                        name="discount_percentage"
                        min="1"
                        max="100"
                        value={form.discount_percentage}
                        onChange={handleChange}
                        placeholder="20"
                        className="admin-input pr-10"
                      />

                      <Percent
                        size={15}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/25"
                      />
                    </div>
                  </FormField>

                  <FormField label="Minimum Order Amount">
                    <div className="relative">
                      <input
                        type="number"
                        name="min_order_amount"
                        min="0"
                        step="0.01"
                        value={form.min_order_amount}
                        onChange={handleChange}
                        placeholder="1000"
                        className="admin-input pl-9"
                      />

                      <IndianRupee
                        size={14}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25"
                      />
                    </div>
                  </FormField>
                </div>

                {/* VALID UNTIL */}

                <FormField label="Valid Till">
                  <input
                    type="date"
                    name="valid_until"
                    value={form.valid_until}
                    onChange={handleChange}
                    className="admin-input"
                  />
                </FormField>

                {/* DESCRIPTION */}

                <FormField label="Description">
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Write a short description..."
                    className="admin-input resize-none"
                  />
                </FormField>

                {/* ACTIVE */}

                <label className="flex items-center justify-between border border-white/10 bg-black p-4 cursor-pointer">
                  <div>
                    <p className="text-sm">
                      Offer Status
                    </p>

                    <p className="text-white/25 text-xs mt-1">
                      Active offers can be shown on the public website.
                    </p>
                  </div>

                  <input
                    type="checkbox"
                    name="is_active"
                    checked={form.is_active}
                    onChange={handleChange}
                    className="w-5 h-5 accent-[#f28a2e]"
                  />
                </label>

                {/* BUTTONS */}

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    disabled={saving}
                    className="h-12 flex-1 border border-white/10 text-white/45 text-[10px] uppercase tracking-[0.2em] hover:border-white/25 hover:text-white transition-all disabled:opacity-40"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="h-12 flex-1 bg-[#f28a2e] text-black text-[10px] uppercase tracking-[0.2em] hover:bg-white transition-colors disabled:opacity-50"
                  >
                    {saving
                      ? "Saving..."
                      : editingOffer
                      ? "Save Changes"
                      : "Create Offer"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DELETE MODAL */}

      <AnimatePresence>
        {deleteOfferData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[210] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setDeleteOfferData(null)}
          >
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.96,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                scale: 0.96,
              }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md bg-[#111112] border border-white/[0.08] p-6"
            >
              <div className="w-11 h-11 bg-red-400/10 border border-red-400/20 flex items-center justify-center mb-5">
                <Trash2 className="w-5 h-5 text-red-400" />
              </div>

              <h3 className="font-serif text-2xl">
                Delete this offer?
              </h3>

              <p className="text-white/40 text-sm leading-6 mt-3">
                <span className="text-white/70">
                  {deleteOfferData.title}
                </span>{" "}
                will be permanently removed.
              </p>

              <div className="flex gap-3 mt-7">
                <button
                  onClick={() => setDeleteOfferData(null)}
                  className="flex-1 py-3 border border-white/[0.08] text-sm text-white/50 hover:text-white transition-colors"
                >
                  Cancel
                </button>

                <button
                  onClick={confirmDelete}
                  className="flex-1 py-3 bg-red-500/90 text-white text-sm hover:bg-red-500 transition-colors"
                >
                  Delete Offer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TOAST */}

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: 20,
            }}
            className={`fixed bottom-6 right-6 z-[300] px-5 py-3.5 border text-sm shadow-2xl ${
              toast.type === "error"
                ? "bg-red-950/90 border-red-500/20 text-red-300"
                : "bg-[#101c14]/95 border-emerald-500/20 text-emerald-300"
            }`}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .admin-input {
          width: 100%;
          height: 48px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          padding: 12px 14px;
          color: white;
          font-size: 13px;
          outline: none;
          transition: border-color 0.2s ease;
        }

        textarea.admin-input {
          height: auto;
        }

        .admin-input:focus {
          border-color: rgba(242,138,46,0.5);
        }

        .admin-input::placeholder {
          color: rgba(255,255,255,0.22);
        }

       .admin-input::-webkit-calendar-picker-indicator {
  filter: invert(1);
  opacity: 1;
  cursor: pointer;
}
      `}</style>
    </main>
  );
};

const StatCard = ({
  label,
  value,
  accent = false,
  hiddenMobile = false,
}) => (
  <div
    className={`border border-white/10 bg-[#0d0d0d] p-5 ${
      hiddenMobile ? "hidden lg:block" : ""
    }`}
  >
    <p className="text-white/30 text-[9px] uppercase tracking-[0.2em]">
      {label}
    </p>

    <p
      className={`font-serif text-3xl mt-3 ${
        accent ? "text-[#f28a2e]" : ""
      }`}
    >
      {value}
    </p>
  </div>
);

const FormField = ({ label, children }) => (
  <div>
    <label className="block text-white/35 text-[9px] uppercase tracking-[0.2em] mb-2">
      {label}
    </label>

    {children}
  </div>
);

const LoadingState = () => (
  <div className="border border-white/10 min-h-[400px] flex flex-col items-center justify-center">
    <div className="w-8 h-8 border-2 border-white/10 border-t-[#f28a2e] rounded-full animate-spin" />

    <p className="text-white/30 text-xs mt-4">
      Loading offers...
    </p>
  </div>
);

export default OffersPage;