import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  Pencil,
  Trash2,
  X,
  Image as ImageIcon,
  Video,
  Plus,
} from "lucide-react";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:8000/api/v1";

const BACKEND_URL = API_URL.replace("/api/v1", "");

const OCCASIONS = [
  "Weddings",
  "Corporate Events",
  "Private Parties",
];

const emptyForm = {
  occasion: "Weddings",
  title: "",
  description: "",
  display_order: 0,
  media: null,
};

export default function AdminCatering() {
  const [mediaItems, setMediaItems] = useState([]);
  const [form, setForm] = useState(emptyForm);

  const [editingItem, setEditingItem] = useState(null);
  const [preview, setPreview] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const token = localStorage.getItem("atulyam_admin_token");

  // =====================================================
  // FETCH MEDIA
  // =====================================================

  const fetchMedia = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/catering-media/`
      );

      if (!response.ok) {
        throw new Error("Failed to load catering media.");
      }

      const data = await response.json();

      setMediaItems(
        Array.isArray(data) ? data : []
      );
    } catch (err) {
      console.error(err);
      setError("Unable to load catering media.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  // =====================================================
  // IMAGE / VIDEO URL
  // =====================================================

  const getMediaUrl = (url) => {
    if (!url) return "";

    if (url.startsWith("http")) {
      return url;
    }

    return `${BACKEND_URL}${url}`;
  };

  // =====================================================
  // FORM CHANGE
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================================
  // FILE CHANGE
  // =====================================================

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "video/mp4",
      "video/webm",
      "video/quicktime",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError(
        "Please select JPG, PNG, WEBP, MP4, WEBM or MOV."
      );

      e.target.value = "";
      return;
    }

    setError("");

    setForm((prev) => ({
      ...prev,
      media: file,
    }));
  };

  // =====================================================
  // RESET FORM
  // =====================================================

  const resetForm = () => {
    setForm(emptyForm);
    setEditingItem(null);

    const fileInput =
      document.getElementById("catering-media-input");

    if (fileInput) {
      fileInput.value = "";
    }
  };

  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim()) {
      setError("Please enter a title.");
      return;
    }

    if (!editingItem && !form.media) {
      setError("Please select an image or video.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const formData = new FormData();

      formData.append(
        "occasion",
        form.occasion
      );

      formData.append(
        "title",
        form.title
      );

      formData.append(
        "description",
        form.description
      );

      formData.append(
        "display_order",
        form.display_order
      );

      if (form.media) {
        formData.append(
          "media",
          form.media
        );
      }

      const url = editingItem
        ? `${API_URL}/catering-media/${editingItem.id}`
        : `${API_URL}/catering-media/upload`;

      const method = editingItem
        ? "PUT"
        : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ||
            "Unable to save catering media."
        );
      }

      setSuccess(
        editingItem
          ? "Catering media updated successfully."
          : "Catering media uploaded successfully."
      );

      resetForm();
      await fetchMedia();

    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // EDIT
  // =====================================================

  const handleEdit = (item) => {
    setEditingItem(item);

    setForm({
      occasion: item.occasion || "Weddings",
      title: item.title || "",
      description: item.description || "",
      display_order: item.display_order || 0,
      media: null,
    });

    setError("");
    setSuccess("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =====================================================
  // DELETE
  // =====================================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this catering media?"
    );

    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");

      const response = await fetch(
        `${API_URL}/catering-media/${id}`,
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
          data.detail ||
            "Unable to delete catering media."
        );
      }

      setSuccess(
        "Catering media deleted successfully."
      );

      await fetchMedia();

    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  // =====================================================
  // GROUP MEDIA
  // =====================================================

  const getOccasionMedia = (occasion) => {
    return mediaItems.filter(
      (item) => item.occasion === occasion
    );
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="min-h-screen bg-[#070707] text-white p-5 md:p-8 lg:p-10">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="max-w-[1500px] mx-auto">

        <div className="border-b border-white/10 pb-7 mb-8">

          <div className="flex items-center gap-3 mb-4">
            <span className="w-10 h-px bg-[#f28a2e]" />

            <span className="text-[#f28a2e] text-[10px] uppercase tracking-[0.3em]">
              Catering Management
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">

            <div>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl tracking-[-0.04em]">
                Catering Media
              </h1>

              <p className="text-white/40 text-sm mt-3 max-w-xl">
                Manage images and videos for weddings,
                corporate events and private parties.
              </p>
            </div>

            <div className="flex items-center gap-2 text-white/30 text-[9px] uppercase tracking-[0.25em]">
              <Upload size={14} />
              Images · Videos
            </div>

          </div>
        </div>


        {/* =================================================
            ALERTS
        ================================================= */}

        <AnimatePresence>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-5 border border-red-500/20 bg-red-500/5 px-5 py-4 flex items-center justify-between"
            >
              <span className="text-red-300 text-sm">
                {error}
              </span>

              <button
                onClick={() => setError("")}
                className="text-white/40 hover:text-white"
              >
                <X size={16} />
              </button>
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-5 border border-[#f28a2e]/20 bg-[#f28a2e]/5 px-5 py-4 flex items-center justify-between"
            >
              <span className="text-[#f28a2e] text-sm">
                {success}
              </span>

              <button
                onClick={() => setSuccess("")}
                className="text-white/40 hover:text-white"
              >
                <X size={16} />
              </button>
            </motion.div>
          )}

        </AnimatePresence>


        {/* =================================================
            FORM
        ================================================= */}

        <section className="border border-white/10 bg-[#0b0b0b] mb-12">

          <div className="border-b border-white/10 px-6 md:px-8 py-5 flex items-center justify-between">

            <div>
              <span className="text-[#f28a2e] text-[9px] uppercase tracking-[0.3em]">
                {editingItem
                  ? "Edit Media"
                  : "Add New Media"}
              </span>

              <h2 className="font-serif text-2xl mt-1">
                {editingItem
                  ? "Update catering media"
                  : "Upload catering media"}
              </h2>
            </div>

            {editingItem && (
              <button
                type="button"
                onClick={resetForm}
                className="text-white/40 hover:text-white text-[9px] uppercase tracking-[0.2em] flex items-center gap-2"
              >
                <X size={14} />
                Cancel
              </button>
            )}

          </div>


          <form
            onSubmit={handleSubmit}
            className="p-6 md:p-8"
          >

            <div className="grid lg:grid-cols-2 gap-6">

              {/* Occasion */}

              <div>
                <label className="block text-white/40 text-[9px] uppercase tracking-[0.25em] mb-3">
                  Occasion
                </label>

                <select
                  name="occasion"
                  value={form.occasion}
                  onChange={handleChange}
                  className="w-full bg-black border border-white/10 px-4 py-3.5 text-sm text-white outline-none focus:border-[#f28a2e]/50"
                >
                  {OCCASIONS.map((occasion) => (
                    <option
                      key={occasion}
                      value={occasion}
                      className="bg-black"
                    >
                      {occasion}
                    </option>
                  ))}
                </select>
              </div>


              {/* Title */}

              <div>
                <label className="block text-white/40 text-[9px] uppercase tracking-[0.25em] mb-3">
                  Title
                </label>

                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g. Elegant Wedding Setup"
                  className="w-full bg-black border border-white/10 px-4 py-3.5 text-sm text-white placeholder:text-white/20 outline-none focus:border-[#f28a2e]/50"
                />
              </div>


              {/* Description */}

              <div className="lg:col-span-2">

                <label className="block text-white/40 text-[9px] uppercase tracking-[0.25em] mb-3">
                  Description
                </label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Short description..."
                  className="w-full resize-none bg-black border border-white/10 px-4 py-3.5 text-sm text-white placeholder:text-white/20 outline-none focus:border-[#f28a2e]/50"
                />

              </div>


              {/* Display Order */}

              <div>

                <label className="block text-white/40 text-[9px] uppercase tracking-[0.25em] mb-3">
                  Display Order
                </label>

                <input
                  type="number"
                  name="display_order"
                  value={form.display_order}
                  onChange={handleChange}
                  min="0"
                  className="w-full bg-black border border-white/10 px-4 py-3.5 text-sm text-white outline-none focus:border-[#f28a2e]/50"
                />

              </div>


              {/* File */}

              <div>

                <label className="block text-white/40 text-[9px] uppercase tracking-[0.25em] mb-3">
                  {editingItem
                    ? "Replace Media (Optional)"
                    : "Choose Image / Video"}
                </label>

                <label
                  htmlFor="catering-media-input"
                  className="flex items-center justify-center gap-3 w-full border border-dashed border-white/15 hover:border-[#f28a2e]/50 bg-black px-4 py-3.5 cursor-pointer transition-colors"
                >

                  <Upload
                    size={16}
                    className="text-[#f28a2e]"
                  />

                  <span className="text-sm text-white/50">
                    {form.media
                      ? form.media.name
                      : "Choose File"}
                  </span>

                </label>

                <input
                  id="catering-media-input"
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp,.mp4,.webm,.mov"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <p className="text-white/20 text-[9px] mt-2">
                  JPG, JPEG, PNG, WEBP, MP4, WEBM, MOV
                </p>

              </div>

            </div>


            {/* Submit */}

            <div className="mt-7 flex justify-end">

              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-3 bg-[#f28a2e] text-black px-6 py-3.5 text-[10px] uppercase tracking-[0.22em] font-medium hover:bg-[#ff9a42] disabled:opacity-50 transition-colors"
              >
                {saving ? (
                  "Saving..."
                ) : editingItem ? (
                  <>
                    <Pencil size={15} />
                    Update Media
                  </>
                ) : (
                  <>
                    <Plus size={15} />
                    Upload Media
                  </>
                )}
              </button>

            </div>

          </form>

        </section>


        {/* =================================================
            MEDIA SECTIONS
        ================================================= */}

        {loading ? (

          <div className="py-20 text-center text-white/30 text-sm">
            Loading catering media...
          </div>

        ) : (

          <div className="space-y-14">

            {OCCASIONS.map((occasion) => {

              const occasionMedia =
                getOccasionMedia(occasion);

              return (
                <section
                  key={occasion}
                >

                  {/* Section Header */}

                  <div className="flex items-end justify-between border-b border-white/10 pb-5 mb-6">

                    <div>
                      <span className="text-[#f28a2e] text-[9px] uppercase tracking-[0.3em]">
                        Catering
                      </span>

                      <h2 className="font-serif text-3xl md:text-4xl mt-2">
                        {occasion}
                      </h2>
                    </div>

                    <span className="text-white/20 text-[9px] uppercase tracking-[0.2em]">
                      {occasionMedia.length}{" "}
                      {occasionMedia.length === 1
                        ? "item"
                        : "items"}
                    </span>

                  </div>


                  {occasionMedia.length === 0 ? (

                    <div className="border border-dashed border-white/10 py-14 text-center">

                      <ImageIcon
                        size={24}
                        className="mx-auto text-white/20 mb-3"
                      />

                      <p className="text-white/25 text-sm">
                        No media added yet.
                      </p>

                    </div>

                  ) : (

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">

                      {occasionMedia.map(
                        (item, index) => (

                          <motion.div
                            key={item.id}
                            initial={{
                              opacity: 0,
                              y: 20,
                            }}
                            animate={{
                              opacity: 1,
                              y: 0,
                            }}
                            transition={{
                              duration: 0.5,
                              delay:
                                index * 0.05,
                            }}
                            className="group border border-white/10 bg-[#0b0b0b] overflow-hidden"
                          >

                            {/* Media */}

                            <div className="relative aspect-[4/3] bg-black overflow-hidden">

                              {item.media_type ===
                              "video" ? (

                                <video
                                  src={getMediaUrl(
                                    item.media_url
                                  )}
                                  className="w-full h-full object-cover"
                                  muted
                                  playsInline
                                  controls
                                  preload="metadata"
                                />

                              ) : (

                                <img
                                  src={getMediaUrl(
                                    item.media_url
                                  )}
                                  alt={item.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                />

                              )}

                              <div className="absolute top-3 left-3">

                                <span className="inline-flex items-center gap-2 bg-black/70 backdrop-blur-sm px-2.5 py-1.5 text-[8px] uppercase tracking-[0.2em] text-white/70">

                                  {item.media_type ===
                                  "video" ? (
                                    <Video size={11} />
                                  ) : (
                                    <ImageIcon size={11} />
                                  )}

                                  {item.media_type}

                                </span>

                              </div>

                            </div>


                            {/* Content */}

                            <div className="p-5">

                              <div className="flex items-start justify-between gap-3">

                                <div>
                                  <h3 className="font-serif text-xl">
                                    {item.title}
                                  </h3>

                                  {item.description && (
                                    <p className="text-white/35 text-xs leading-5 mt-2 line-clamp-2">
                                      {item.description}
                                    </p>
                                  )}
                                </div>

                                <span className="text-[#f28a2e] font-serif italic text-sm">
                                  {String(
                                    item.display_order
                                  ).padStart(2, "0")}
                                </span>

                              </div>


                              {/* Actions */}

                              <div className="flex items-center gap-2 mt-5 pt-4 border-t border-white/10">

                                <button
                                  type="button"
                                  onClick={() =>
                                    handleEdit(item)
                                  }
                                  className="flex-1 flex items-center justify-center gap-2 border border-white/10 hover:border-[#f28a2e]/50 hover:text-[#f28a2e] py-2.5 text-[9px] uppercase tracking-[0.2em] transition-colors"
                                >
                                  <Pencil size={13} />
                                  Edit
                                </button>

                                <button
                                  type="button"
                                  onClick={() =>
                                    handleDelete(
                                      item.id
                                    )
                                  }
                                  className="w-11 flex items-center justify-center border border-white/10 hover:border-red-500/40 hover:text-red-400 py-2.5 transition-colors"
                                >
                                  <Trash2 size={14} />
                                </button>

                              </div>

                            </div>

                          </motion.div>

                        )
                      )}

                    </div>

                  )}

                </section>
              );
            })}

          </div>

        )}

      </div>


      {/* =================================================
          PREVIEW MODAL
      ================================================= */}

      <AnimatePresence>

        {preview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-5"
            onClick={() => setPreview(null)}
          >

            <button
              type="button"
              onClick={() => setPreview(null)}
              className="absolute top-5 right-5 w-11 h-11 rounded-full border border-white/15 flex items-center justify-center hover:bg-[#f28a2e] hover:text-black transition-colors"
            >
              <X size={18} />
            </button>

            <div
              onClick={(e) => e.stopPropagation()}
              className="max-w-5xl max-h-[90vh] w-full"
            >

              {preview.media_type ===
              "video" ? (

                <video
                  src={getMediaUrl(
                    preview.media_url
                  )}
                  className="w-full max-h-[80vh] object-contain"
                  controls
                  autoPlay
                />

              ) : (

                <img
                  src={getMediaUrl(
                    preview.media_url
                  )}
                  alt={preview.title}
                  className="w-full max-h-[80vh] object-contain"
                />

              )}

              <div className="mt-4">

                <h3 className="font-serif text-2xl">
                  {preview.title}
                </h3>

                <p className="text-white/40 text-sm mt-1">
                  {preview.occasion}
                </p>

              </div>

            </div>

          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
}