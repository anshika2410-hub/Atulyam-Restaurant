// src/pages/admin/AdminGallery.jsx

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Upload,
  Image as ImageIcon,
} from "lucide-react";

const API_URL =
  import.meta.env.VITE_API_URL ;

const BACKEND_URL = API_URL.replace("/api/v1", "");

const categories = [
  "Food",
  "Dining",
  "Ambience",
  "Events",
];

export default function AdminGallery() {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Ambience");
  const [caption, setCaption] = useState("");
  const [displayOrder, setDisplayOrder] = useState(0);

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  const [error, setError] = useState("");

  const token = localStorage.getItem("atulyam_admin_token");

  const getImageUrl = (url) => {
    if (!url) return "";

    if (url.startsWith("http")) {
      return url;
    }

    return `${BACKEND_URL}${url}`;
  };

  const fetchGallery = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/gallery/`);

      if (!response.ok) {
        throw new Error("Failed to load gallery.");
      }

      const data = await response.json();
      setGallery(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const resetForm = () => {
    setTitle("");
    setCategory("Ambience");
    setCaption("");
    setDisplayOrder(0);
    setImage(null);
    setPreview("");
    setEditingItem(null);
    setError("");
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setTitle(item.title || "");
    setCategory(item.category || "Ambience");
    setCaption(item.caption || "");
    setDisplayOrder(item.display_order || 0);
    setImage(null);
    setPreview(getImageUrl(item.image_url));
    setError("");
    setShowModal(true);
  };

  const closeModal = () => {
    if (saving) return;

    setShowModal(false);
    resetForm();
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError("Only JPG, JPEG, PNG and WEBP images are allowed.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB.");
      return;
    }

    setError("");
    setImage(file);

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setError("Please enter a gallery title.");
      return;
    }

    if (!editingItem && !image) {
      setError("Please choose an image.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      if (editingItem) {
        const formData = new FormData();

        formData.append("title", title.trim());
        formData.append("category", category);
        formData.append("caption", caption.trim());
        formData.append(
          "display_order",
          String(displayOrder)
        );

        if (image) {
          formData.append("image", image);
        }

        const response = await fetch(
          `${API_URL}/gallery/${editingItem.id}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          }
        );

        if (!response.ok) {
          const data = await response.json();
          throw new Error(
            data?.detail || "Failed to update gallery item."
          );
        }
      } else {
        const formData = new FormData();

        formData.append("title", title.trim());
        formData.append("category", category);
        formData.append("caption", caption.trim());
        formData.append(
          "display_order",
          String(displayOrder)
        );
        formData.append("image", image);

        const response = await fetch(
          `${API_URL}/gallery/upload`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          }
        );

        if (!response.ok) {
          const data = await response.json();
          throw new Error(
            data?.detail || "Failed to upload gallery image."
          );
        }
      }

      setShowModal(false);
      resetForm();
      await fetchGallery();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this gallery image?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `${API_URL}/gallery/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(
          data?.detail || "Failed to delete gallery item."
        );
      }

      setGallery((prev) =>
        prev.filter((item) => item.id !== id)
      );
    } catch (err) {
      alert(err.message);
    }
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
            Gallery Management
          </h1>

          <p className="text-white/50 mt-2 text-sm">
            Upload and manage your restaurant gallery.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 bg-[#f28a2e] hover:bg-[#ff9b45] text-black font-semibold px-5 py-3 rounded-xl transition"
        >
          <Plus size={19} />
          Add Image
        </button>
      </div>

      {/* ERROR */}
      {error && !showModal && (
        <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 text-red-300 px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {/* GALLERY */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-9 h-9 border-2 border-white/20 border-t-[#f28a2e] rounded-full animate-spin" />
        </div>
      ) : gallery.length === 0 ? (
        <div className="border border-white/10 bg-white/[0.03] rounded-2xl py-20 text-center">
          <ImageIcon
            size={45}
            className="mx-auto text-white/20 mb-4"
          />

          <h3 className="text-xl font-serif">
            No gallery images yet
          </h3>

          <p className="text-white/40 text-sm mt-2">
            Add your first restaurant image.
          </p>

          <button
            onClick={openAddModal}
            className="mt-6 bg-[#f28a2e] text-black px-5 py-3 rounded-xl font-semibold"
          >
            Add Image
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {gallery.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]"
            >
              {/* FIXED IMAGE FRAME */}
              <div className="relative aspect-[4/3] overflow-hidden bg-black">
                <img
                  src={getImageUrl(item.image_url)}
                  alt={item.title}
                  className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                <span className="absolute top-3 left-3 bg-black/70 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-xs text-[#f28a2e]">
                  {item.category}
                </span>
              </div>

              {/* INFO */}
              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-serif text-xl">
                      {item.title}
                    </h3>

                    {item.caption && (
                      <p className="text-white/45 text-sm mt-1 line-clamp-2">
                        {item.caption}
                      </p>
                    )}
                  </div>

                  <span className="text-xs text-white/30">
                    #{item.display_order}
                  </span>
                </div>

                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => openEditModal(item)}
                    className="flex-1 flex items-center justify-center gap-2 border border-white/10 hover:border-[#f28a2e]/50 hover:text-[#f28a2e] rounded-lg py-2.5 text-sm transition"
                  >
                    <Pencil size={15} />
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="px-4 border border-red-500/20 text-red-400 hover:bg-red-500/10 rounded-lg transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* MODAL */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              closeModal();
            }
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-2xl max-h-[92vh] overflow-y-auto bg-[#111] border border-white/10 rounded-2xl"
          >
            {/* MODAL HEADER */}
            <div className="flex items-center justify-between p-5 border-b border-white/10">
              <div>
                <h2 className="text-2xl font-serif">
                  {editingItem
                    ? "Edit Gallery Image"
                    : "Add Gallery Image"}
                </h2>

                <p className="text-white/40 text-xs mt-1">
                  JPG, JPEG, PNG or WEBP · Max 5MB
                </p>
              </div>

              <button
                onClick={closeModal}
                className="p-2 rounded-lg hover:bg-white/10 transition"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-5 space-y-5"
            >
              {/* IMAGE */}
              <div>
                <label className="block text-sm text-white/70 mb-2">
                  Gallery Image
                </label>

                <label className="relative block cursor-pointer">
                  <div className="aspect-[4/3] rounded-xl border border-dashed border-white/15 hover:border-[#f28a2e]/60 overflow-hidden bg-white/[0.02]">
                    {preview ? (
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-white/30">
                        <Upload size={30} />
                        <span className="mt-3 text-sm">
                          Choose Image
                        </span>
                      </div>
                    )}

                    {preview && (
                      <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition flex items-center justify-center">
                        <span className="bg-black/70 px-4 py-2 rounded-lg text-sm">
                          Change Image
                        </span>
                      </div>
                    )}
                  </div>

                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>

                {image && (
                  <p className="text-xs text-white/40 mt-2">
                    Selected: {image.name}
                  </p>
                )}
              </div>

              {/* TITLE */}
              <div>
                <label className="block text-sm text-white/70 mb-2">
                  Title *
                </label>

                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. The Atulyam Table"
                  className="w-full bg-white/[0.04] border border-white/10 focus:border-[#f28a2e]/60 outline-none rounded-xl px-4 py-3 text-white placeholder:text-white/25"
                />
              </div>

              {/* CATEGORY */}
              <div>
                <label className="block text-sm text-white/70 mb-2">
                  Category
                </label>

                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[#171717] border border-white/10 focus:border-[#f28a2e]/60 outline-none rounded-xl px-4 py-3 text-white"
                >
                  {categories.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              {/* CAPTION */}
              <div>
                <label className="block text-sm text-white/70 mb-2">
                  Caption
                </label>

                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  rows={3}
                  placeholder="Short description..."
                  className="w-full resize-none bg-white/[0.04] border border-white/10 focus:border-[#f28a2e]/60 outline-none rounded-xl px-4 py-3 text-white placeholder:text-white/25"
                />
              </div>

              {/* DISPLAY ORDER */}
              <div>
                <label className="block text-sm text-white/70 mb-2">
                  Display Order
                </label>

                <input
                  type="number"
                  min="0"
                  value={displayOrder}
                  onChange={(e) =>
                    setDisplayOrder(Number(e.target.value))
                  }
                  className="w-full bg-white/[0.04] border border-white/10 focus:border-[#f28a2e]/60 outline-none rounded-xl px-4 py-3 text-white"
                />
              </div>

              {/* MODAL ERROR */}
              {error && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 text-red-300 px-4 py-3 text-sm">
                  {error}
                </div>
              )}

              {/* ACTIONS */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="flex-1 border border-white/10 hover:bg-white/5 rounded-xl py-3 transition disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#f28a2e] hover:bg-[#ff9b45] text-black font-semibold rounded-xl py-3 transition disabled:opacity-60"
                >
                  {saving ? (
                    <>
                      <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Upload size={17} />
                      {editingItem ? "Update Image" : "Upload Image"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}