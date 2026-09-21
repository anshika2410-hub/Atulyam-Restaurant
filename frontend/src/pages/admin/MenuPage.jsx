import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  Check,
  UtensilsCrossed,
  Star,
  Eye,
  EyeOff,
  Flame,
  Leaf,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";

const API_URL = import.meta.env.VITE_API_URL;
const BACKEND_URL = API_URL.replace("/api/v1", "");

const getImageUrl = (url) => {
  if (!url) return "";

  if (
    url.startsWith("http://") ||
    url.startsWith("https://")
  ) {
    return url;
  }

  return `${BACKEND_URL}${url}`;
};

const emptyForm = {
  category_id: "",
  name: "",
  description: "",
  price: "",
  image_url: "",
  image_file: null,
  is_veg: true,
  is_spicy: 0,
  is_available: true,
  is_featured: false,
};

const MenuPage = () => {
  const { token } = useAuth();

  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [imagePreview, setImagePreview] = useState("");
  const [deleteItem, setDeleteItem] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });

    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_URL}/categories?active_only=false`);

      if (!response.ok) {
        throw new Error("Failed to load categories");
      }

      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error(error);
      showToast("Unable to load categories", "error");
    }
  };

  const fetchMenu = async () => {
    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/menu?available_only=false`
      );

      if (!response.ok) {
        throw new Error("Failed to load menu");
      }

      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error(error);
      showToast("Unable to load menu items", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchMenu();
  }, []);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        !search.trim() ||
        item.name?.toLowerCase().includes(search.toLowerCase()) ||
        item.description?.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        categoryFilter === "all" ||
        String(item.category_id) === String(categoryFilter);

      const matchesAvailability =
        availabilityFilter === "all" ||
        (availabilityFilter === "available" && item.is_available) ||
        (availabilityFilter === "unavailable" && !item.is_available);

      return (
        matchesSearch &&
        matchesCategory &&
        matchesAvailability
      );
    });
  }, [items, search, categoryFilter, availabilityFilter]);

  const stats = useMemo(() => {
    return {
      total: items.length,
      available: items.filter((item) => item.is_available).length,
      featured: items.filter((item) => item.is_featured).length,
      vegetarian: items.filter((item) => item.is_veg).length,
    };
  }, [items]);

 const openAddModal = () => {
  setEditingItem(null);

  setForm({
    ...emptyForm,
    category_id: categories[0]?.id || "",
  });

  setImagePreview("");
  setModalOpen(true);
};
  
const openEditModal = (item) => {
  setEditingItem(item);

  setForm({
    category_id: item.category_id || "",
    name: item.name || "",
    description: item.description || "",
    price: item.price || "",
    image_url: item.image_url || "",
    image_file: null,
    is_veg: Boolean(item.is_veg),
    is_spicy: item.is_spicy || 0,
    is_available: Boolean(item.is_available),
    is_featured: Boolean(item.is_featured),
  });

  setImagePreview(
    item.image_url
      ? getImageUrl(item.image_url)
      : ""
  );

  setModalOpen(true);
};
   
  const closeModal = () => {
  if (saving) return;

  setModalOpen(false);
  setEditingItem(null);
  setForm(emptyForm);
  setImagePreview("");
};

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
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
    showToast(
      "Only JPG, JPEG, PNG and WEBP images are allowed.",
      "error"
    );

    e.target.value = "";
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    showToast(
      "Image size must be less than 5 MB.",
      "error"
    );

    e.target.value = "";
    return;
  }

  setForm((prev) => ({
    ...prev,
    image_file: file,
  }));

  setImagePreview(URL.createObjectURL(file));
};
  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!form.category_id) {
    showToast("Please select a category", "error");
    return;
  }

  if (!form.name.trim()) {
    showToast("Dish name is required", "error");
    return;
  }

  if (!form.price || Number(form.price) <= 0) {
    showToast("Enter a valid price", "error");
    return;
  }

  setSaving(true);

  try {
    let imageUrl = form.image_url || null;

    // -----------------------------------------
    // UPLOAD NEW IMAGE IF SELECTED
    // -----------------------------------------
    if (form.image_file) {
      const imageFormData = new FormData();

      imageFormData.append(
        "file",
        form.image_file
      );

      const uploadResponse = await fetch(
        `${API_URL}/menu/upload-image`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: imageFormData,
        }
      );

      const uploadData =
        await uploadResponse.json();

      if (!uploadResponse.ok) {
        throw new Error(
          uploadData.detail ||
            "Unable to upload image"
        );
      }

      imageUrl = uploadData.url;
    }

    // -----------------------------------------
    // CREATE / UPDATE MENU ITEM
    // -----------------------------------------
    const payload = {
      category_id: Number(form.category_id),
      name: form.name.trim(),
      description:
        form.description.trim() || null,
      price: Number(form.price),
      image_url: imageUrl,
      is_veg: Boolean(form.is_veg),
      is_spicy: Number(form.is_spicy),
      is_available: Boolean(
        form.is_available
      ),
      is_featured: Boolean(
        form.is_featured
      ),
    };

    const url = editingItem
      ? `${API_URL}/menu/${editingItem.id}`
      : `${API_URL}/menu`;

    const response = await fetch(url, {
      method: editingItem ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.detail ||
          "Unable to save menu item"
      );
    }

    showToast(
      editingItem
        ? "Menu item updated successfully"
        : "Menu item added successfully"
    );

    closeModal();
    fetchMenu();
  } catch (error) {
    console.error(error);

    showToast(
      error.message ||
        "Something went wrong",
      "error"
    );
  } finally {
    setSaving(false);
  }
};
  const toggleAvailability = async (item) => {
    try {
      const response = await fetch(`${API_URL}/menu/${item.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          is_available: !item.is_available,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || "Unable to update availability");
      }

      setItems((prev) =>
        prev.map((menuItem) =>
          menuItem.id === item.id
            ? {
                ...menuItem,
                is_available: !item.is_available,
              }
            : menuItem
        )
      );

      showToast(
        item.is_available
          ? `${item.name} marked unavailable`
          : `${item.name} is now available`
      );
    } catch (error) {
      console.error(error);
      showToast(error.message, "error");
    }
  };

  const toggleFeatured = async (item) => {
    try {
      const response = await fetch(`${API_URL}/menu/${item.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          is_featured: !item.is_featured,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || "Unable to update featured status");
      }

      setItems((prev) =>
        prev.map((menuItem) =>
          menuItem.id === item.id
            ? {
                ...menuItem,
                is_featured: !item.is_featured,
              }
            : menuItem
        )
      );

      showToast(
        item.is_featured
          ? "Removed from chef specials"
          : "Added to chef specials"
      );
    } catch (error) {
      console.error(error);
      showToast(error.message, "error");
    }
  };

  const confirmDelete = async () => {
    if (!deleteItem) return;

    try {
      const response = await fetch(
        `${API_URL}/menu/${deleteItem.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Unable to delete item");
      }

      setItems((prev) =>
        prev.filter((item) => item.id !== deleteItem.id)
      );

      showToast("Menu item deleted successfully");
      setDeleteItem(null);
    } catch (error) {
      console.error(error);
      showToast(error.message, "error");
    }
  };

  const getCategoryName = (item) => {
    if (item.category?.name) {
      return item.category.name;
    }

    const category = categories.find(
      (cat) => cat.id === item.category_id
    );

    return category?.name || "Uncategorized";
  };

  const getSpiceLabel = (level) => {
    if (level === 3) return "Very Spicy";
    if (level === 2) return "Spicy";
    if (level === 1) return "Mild";
    return "Not Spicy";
  };

  return (
    <div className="min-h-screen bg-[#070707] text-white">
      {/* HEADER */}
      <div className="border-b border-white/[0.07]">
        <div className="px-6 md:px-10 py-7 md:py-9">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-[#f28a2e] mb-3">
                <UtensilsCrossed className="w-4 h-4" />
                <span className="text-[10px] uppercase tracking-[0.3em]">
                  Restaurant Management
                </span>
              </div>

              <h1 className="font-serif text-4xl md:text-5xl tracking-[-0.04em]">
                Menu Management
              </h1>

              <p className="text-white/40 text-sm mt-2">
                Manage dishes, pricing, availability and chef specials.
              </p>
            </div>

            <button
              onClick={openAddModal}
              className="flex items-center justify-center gap-2 px-5 py-3.5 bg-[#f28a2e] text-black text-sm font-medium hover:bg-[#ff9b42] transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add New Dish
            </button>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="px-6 md:px-10 py-6">
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
          <StatCard
            label="Total Dishes"
            value={stats.total}
            icon={UtensilsCrossed}
          />

          <StatCard
            label="Available"
            value={stats.available}
            icon={Check}
          />

          <StatCard
            label="Chef Specials"
            value={stats.featured}
            icon={Star}
          />

          <StatCard
            label="Vegetarian"
            value={stats.vegetarian}
            icon={Leaf}
          />
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="px-6 md:px-10 pb-6">
        <div className="bg-[#0d0d0e] border border-white/[0.07] p-3 flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search dishes..."
              className="w-full bg-white/[0.03] border border-white/[0.07] px-11 py-3 text-sm text-white placeholder:text-white/25 outline-none focus:border-[#f28a2e]/50 transition-colors"
            />
          </div>

          <SelectFilter
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            options={[
              { value: "all", label: "All Categories" },
              ...categories.map((cat) => ({
                value: cat.id,
                label: cat.name,
              })),
            ]}
          />

          <SelectFilter
            value={availabilityFilter}
            onChange={(e) => setAvailabilityFilter(e.target.value)}
            options={[
              { value: "all", label: "All Items" },
              { value: "available", label: "Available" },
              { value: "unavailable", label: "Unavailable" },
            ]}
          />
        </div>
      </div>

      {/* MENU TABLE */}
      <div className="px-6 md:px-10 pb-10">
        <div className="bg-[#0d0d0e] border border-white/[0.07] overflow-hidden">
          <div className="px-5 md:px-6 py-4 border-b border-white/[0.07] flex items-center justify-between">
            <div>
              <h2 className="font-serif text-xl">
                All Dishes
              </h2>
              <p className="text-white/30 text-xs mt-1">
                Showing {filteredItems.length} of {items.length} dishes
              </p>
            </div>
          </div>

          {loading ? (
            <LoadingState />
          ) : filteredItems.length === 0 ? (
            <EmptyState onAdd={openAddModal} />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[950px]">
                <thead>
                  <tr className="border-b border-white/[0.06] text-left">
                    <th className="px-6 py-4 text-[9px] uppercase tracking-[0.2em] text-white/30 font-normal">
                      Dish
                    </th>
                    <th className="px-4 py-4 text-[9px] uppercase tracking-[0.2em] text-white/30 font-normal">
                      Category
                    </th>
                    <th className="px-4 py-4 text-[9px] uppercase tracking-[0.2em] text-white/30 font-normal">
                      Price
                    </th>
                    <th className="px-4 py-4 text-[9px] uppercase tracking-[0.2em] text-white/30 font-normal">
                      Type
                    </th>
                    <th className="px-4 py-4 text-[9px] uppercase tracking-[0.2em] text-white/30 font-normal">
                      Status
                    </th>
                    <th className="px-6 py-4 text-right text-[9px] uppercase tracking-[0.2em] text-white/30 font-normal">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredItems.map((item, index) => (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.025 }}
                      className="border-b border-white/[0.05] hover:bg-white/[0.018] transition-colors"
                    >
                      {/* DISH */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 shrink-0 bg-white/[0.04] overflow-hidden">
                            {item.image_url ? (
                              <img
  src={getImageUrl(item.image_url)}
  alt={item.name}
  className="w-full h-full object-cover"
/>
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <UtensilsCrossed className="w-5 h-5 text-white/20" />
                              </div>
                            )}
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="text-sm font-medium text-white truncate max-w-[260px]">
                                {item.name}
                              </h3>

                              {item.is_featured && (
                                <Star className="w-3.5 h-3.5 text-[#f28a2e] fill-[#f28a2e]" />
                              )}
                            </div>

                            <p className="text-white/30 text-xs mt-1 truncate max-w-[300px]">
                              {item.description || "No description"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* CATEGORY */}
                      <td className="px-4 py-4">
                        <span className="text-xs text-white/55">
                          {getCategoryName(item)}
                        </span>
                      </td>

                      {/* PRICE */}
                      <td className="px-4 py-4">
                        <span className="text-sm font-medium">
                          ₹{Number(item.price).toLocaleString("en-IN")}
                        </span>
                      </td>

                      {/* TYPE */}
                      <td className="px-4 py-4">
                        <div className="flex flex-col gap-1.5">
                          <span
                            className={`inline-flex items-center gap-1.5 text-[10px] w-fit ${
                              item.is_veg
                                ? "text-emerald-400"
                                : "text-red-400"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                item.is_veg
                                  ? "bg-emerald-400"
                                  : "bg-red-400"
                              }`}
                            />
                            {item.is_veg ? "Vegetarian" : "Non-Veg"}
                          </span>

                          {item.is_spicy > 0 && (
                            <span className="flex items-center gap-1 text-[10px] text-[#f28a2e]">
                              <Flame className="w-3 h-3" />
                              {getSpiceLabel(item.is_spicy)}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* STATUS */}
                      <td className="px-4 py-4">
                        <button
                          onClick={() => toggleAvailability(item)}
                          className={`inline-flex items-center gap-2 px-2.5 py-1.5 text-[10px] transition-colors ${
                            item.is_available
                              ? "bg-emerald-400/10 text-emerald-400 hover:bg-emerald-400/15"
                              : "bg-red-400/10 text-red-400 hover:bg-red-400/15"
                          }`}
                        >
                          {item.is_available ? (
                            <>
                              <Eye className="w-3 h-3" />
                              Available
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3 h-3" />
                              Unavailable
                            </>
                          )}
                        </button>
                      </td>

                      {/* ACTIONS */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => toggleFeatured(item)}
                            title="Toggle Chef Special"
                            className={`w-9 h-9 flex items-center justify-center border transition-colors ${
                              item.is_featured
                                ? "border-[#f28a2e]/30 text-[#f28a2e] bg-[#f28a2e]/10"
                                : "border-white/[0.08] text-white/35 hover:text-[#f28a2e] hover:border-[#f28a2e]/30"
                            }`}
                          >
                            <Star
                              className="w-3.5 h-3.5"
                              fill={
                                item.is_featured
                                  ? "currentColor"
                                  : "none"
                              }
                            />
                          </button>

                          <button
                            onClick={() => openEditModal(item)}
                            title="Edit"
                            className="w-9 h-9 flex items-center justify-center border border-white/[0.08] text-white/40 hover:text-white hover:border-white/20 transition-colors"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => setDeleteItem(item)}
                            title="Delete"
                            className="w-9 h-9 flex items-center justify-center border border-white/[0.08] text-white/40 hover:text-red-400 hover:border-red-400/30 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ADD / EDIT MODAL */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="absolute inset-0 bg-black/75 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[#101011] border border-white/[0.09] shadow-2xl"
            >
              <div className="sticky top-0 z-10 px-6 py-5 border-b border-white/[0.07] bg-[#101011] flex items-center justify-between">
                <div>
                  <p className="text-[9px] uppercase tracking-[0.25em] text-[#f28a2e] mb-1">
                    {editingItem ? "Edit Menu Item" : "New Menu Item"}
                  </p>

                  <h2 className="font-serif text-2xl">
                    {editingItem
                      ? "Update Dish"
                      : "Add a New Dish"}
                  </h2>
                </div>

                <button
                  onClick={closeModal}
                  className="w-9 h-9 flex items-center justify-center border border-white/[0.08] text-white/40 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form
                onSubmit={handleSubmit}
                className="p-6 space-y-5"
              >
                {/* NAME + CATEGORY */}
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField label="Dish Name *">
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="e.g. Paneer Tikka"
                      className="admin-input"
                    />
                  </FormField>

                  <FormField label="Category *">
                    <div className="relative">
                      <select
                        name="category_id"
                        value={form.category_id}
                        onChange={handleChange}
                        className="admin-input appearance-none pr-10"
                      >
                        <option value="">
                          Select category
                        </option>

                        {categories.map((category) => (
                          <option
                            key={category.id}
                            value={category.id}
                          >
                            {category.name}
                          </option>
                        ))}
                      </select>

                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                    </div>
                  </FormField>
                </div>

                {/* PRICE + IMAGE */}
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField label="Price (₹) *">
                    <input
                      name="price"
                      type="number"
                      min="1"
                      step="0.01"
                      value={form.price}
                      onChange={handleChange}
                      placeholder="450"
                      className="admin-input"
                    />
                  </FormField>

              <FormField label="Dish Image">
  <div className="space-y-3">
    <label
      htmlFor="dish-image"
      className="block cursor-pointer"
    >
      <div className="border border-dashed border-white/[0.12] hover:border-[#f28a2e]/40 bg-white/[0.02] transition-colors px-4 py-3">
        <div className="flex items-center gap-4">

          {/* PREVIEW */}
          <div className="w-16 h-16 shrink-0 overflow-hidden bg-white/[0.04] border border-white/[0.07] flex items-center justify-center">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Dish preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <UtensilsCrossed className="w-5 h-5 text-white/20" />
            )}
          </div>

          {/* TEXT */}
          <div className="min-w-0 flex-1">
            <p className="text-sm text-white/70 truncate">
              {form.image_file
                ? form.image_file.name
                : editingItem && form.image_url
                ? "Current dish image"
                : "Choose dish image"}
            </p>

            <p className="text-[10px] text-white/30 mt-1">
              JPG, JPEG, PNG or WEBP · Max 5 MB
            </p>
          </div>

          {/* BUTTON */}
          <span className="shrink-0 px-4 py-2 bg-[#f28a2e]/10 text-[#f28a2e] text-[10px] uppercase tracking-[0.15em]">
            {form.image_file
              ? "Change"
              : "Upload"}
          </span>
        </div>
      </div>

      <input
        id="dish-image"
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleImageChange}
        className="hidden"
      />
    </label>

    {form.image_file && (
      <button
        type="button"
        onClick={() => {
          setForm((prev) => ({
            ...prev,
            image_file: null,
          }));

          setImagePreview(
            form.image_url
              ? getImageUrl(form.image_url)
              : ""
          );
        }}
        className="text-[10px] text-white/35 hover:text-red-400 transition-colors"
      >
        Remove selected image
      </button>
    )}
  </div>
</FormField>
                </div>

                {/* DESCRIPTION */}
                <FormField label="Description">
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Describe the dish..."
                    className="admin-input resize-none"
                  />
                </FormField>

                {/* FOOD TYPE */}
                <div>
                  <label className="block text-[9px] uppercase tracking-[0.2em] text-white/35 mb-2">
                    Food Type
                  </label>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setForm((prev) => ({
                          ...prev,
                          is_veg: true,
                        }))
                      }
                      className={`py-3 border text-xs transition-colors ${
                        form.is_veg
                          ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-400"
                          : "border-white/[0.07] text-white/40"
                      }`}
                    >
                      <Leaf className="inline w-3.5 h-3.5 mr-2" />
                      Vegetarian
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setForm((prev) => ({
                          ...prev,
                          is_veg: false,
                        }))
                      }
                      className={`py-3 border text-xs transition-colors ${
                        !form.is_veg
                          ? "border-red-400/40 bg-red-400/10 text-red-400"
                          : "border-white/[0.07] text-white/40"
                      }`}
                    >
                      Non-Vegetarian
                    </button>
                  </div>
                </div>

                {/* SPICE */}
                <FormField label="Spice Level">
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { value: 0, label: "None" },
                      { value: 1, label: "Mild" },
                      { value: 2, label: "Spicy" },
                      { value: 3, label: "Very Spicy" },
                    ].map((option) => (
                      <button
                        type="button"
                        key={option.value}
                        onClick={() =>
                          setForm((prev) => ({
                            ...prev,
                            is_spicy: option.value,
                          }))
                        }
                        className={`py-2.5 border text-[10px] transition-colors ${
                          Number(form.is_spicy) === option.value
                            ? "border-[#f28a2e]/40 bg-[#f28a2e]/10 text-[#f28a2e]"
                            : "border-white/[0.07] text-white/35 hover:text-white"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </FormField>

                {/* TOGGLES */}
                <div className="grid md:grid-cols-2 gap-3">
                  <Toggle
                    checked={form.is_available}
                    onChange={(checked) =>
                      setForm((prev) => ({
                        ...prev,
                        is_available: checked,
                      }))
                    }
                    label="Available for ordering"
                    description="Customers can order this dish."
                  />

                  <Toggle
                    checked={form.is_featured}
                    onChange={(checked) =>
                      setForm((prev) => ({
                        ...prev,
                        is_featured: checked,
                      }))
                    }
                    label="Chef special"
                    description="Show this dish as featured."
                  />
                </div>

                {/* BUTTONS */}
                <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={closeModal}
                    disabled={saving}
                    className="px-5 py-3 border border-white/[0.08] text-sm text-white/50 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-3 bg-[#f28a2e] text-black text-sm font-medium hover:bg-[#ff9b42] transition-colors disabled:opacity-50"
                  >
                    {saving
                      ? "Saving..."
                      : editingItem
                      ? "Update Dish"
                      : "Add Dish"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DELETE MODAL */}
      <AnimatePresence>
        {deleteItem && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteItem(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="relative w-full max-w-md bg-[#111112] border border-white/[0.08] p-6"
            >
              <div className="w-11 h-11 bg-red-400/10 border border-red-400/20 flex items-center justify-center mb-5">
                <Trash2 className="w-5 h-5 text-red-400" />
              </div>

              <h3 className="font-serif text-2xl">
                Delete this dish?
              </h3>

              <p className="text-white/40 text-sm leading-6 mt-3">
                <span className="text-white/70">
                  {deleteItem.name}
                </span>{" "}
                will be permanently removed from the menu.
              </p>

              <div className="flex gap-3 mt-7">
                <button
                  onClick={() => setDeleteItem(null)}
                  className="flex-1 py-3 border border-white/[0.08] text-sm text-white/50 hover:text-white"
                >
                  Cancel
                </button>

                <button
                  onClick={confirmDelete}
                  className="flex-1 py-3 bg-red-500/90 text-white text-sm hover:bg-red-500"
                >
                  Delete Dish
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* TOAST */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={`fixed bottom-6 right-6 z-[200] px-5 py-3.5 border text-sm shadow-2xl ${
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
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          padding: 12px 14px;
          color: white;
          font-size: 13px;
          outline: none;
          transition: border-color 0.2s ease;
        }

        .admin-input:focus {
          border-color: rgba(242,138,46,0.5);
        }

        .admin-input::placeholder {
          color: rgba(255,255,255,0.22);
        }

        .admin-input option {
          background: #151516;
          color: white;
        }
      `}</style>
    </div>
  );
};

const StatCard = ({ label, value, icon: Icon }) => (
  <div className="bg-[#0d0d0e] border border-white/[0.07] p-5 flex items-center justify-between">
    <div>
      <p className="text-[9px] uppercase tracking-[0.2em] text-white/30">
        {label}
      </p>
      <p className="text-2xl font-serif mt-2">
        {value}
      </p>
    </div>

    <div className="w-10 h-10 bg-[#f28a2e]/10 flex items-center justify-center">
      <Icon className="w-4 h-4 text-[#f28a2e]" />
    </div>
  </div>
);

const FormField = ({ label, children }) => (
  <div>
    <label className="block text-[9px] uppercase tracking-[0.2em] text-white/35 mb-2">
      {label}
    </label>
    {children}
  </div>
);

const SelectFilter = ({ value, onChange, options }) => (
  <div className="relative min-w-[190px]">
    <select
      value={value}
      onChange={onChange}
      className="w-full h-full min-h-[46px] bg-white/[0.03] border border-white/[0.07] px-4 pr-10 text-sm text-white/60 outline-none appearance-none focus:border-[#f28a2e]/50"
    >
      {options.map((option) => (
        <option
          key={option.value}
          value={option.value}
          className="bg-[#151516]"
        >
          {option.label}
        </option>
      ))}
    </select>

    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25 pointer-events-none" />
  </div>
);

const Toggle = ({
  checked,
  onChange,
  label,
  description,
}) => (
  <button
    type="button"
    onClick={() => onChange(!checked)}
    className={`w-full text-left p-4 border transition-colors ${
      checked
        ? "border-[#f28a2e]/25 bg-[#f28a2e]/[0.04]"
        : "border-white/[0.07] bg-white/[0.015]"
    }`}
  >
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-xs text-white/75">
          {label}
        </p>

        <p className="text-[10px] text-white/30 mt-1">
          {description}
        </p>
      </div>

      <div
        className={`w-9 h-5 rounded-full p-0.5 transition-colors ${
          checked
            ? "bg-[#f28a2e]"
            : "bg-white/10"
        }`}
      >
        <div
          className={`w-4 h-4 rounded-full bg-white transition-transform ${
            checked ? "translate-x-4" : "translate-x-0"
          }`}
        />
      </div>
    </div>
  </button>
);

const LoadingState = () => (
  <div className="py-24 flex flex-col items-center justify-center">
    <div className="w-8 h-8 border-2 border-white/10 border-t-[#f28a2e] rounded-full animate-spin" />
    <p className="text-white/30 text-xs mt-4">
      Loading menu...
    </p>
  </div>
);

const EmptyState = ({ onAdd }) => (
  <div className="py-24 flex flex-col items-center justify-center text-center px-6">
    <div className="w-14 h-14 border border-white/[0.08] flex items-center justify-center mb-5">
      <UtensilsCrossed className="w-5 h-5 text-white/20" />
    </div>

    <h3 className="font-serif text-xl">
      No dishes found
    </h3>

    <p className="text-white/30 text-xs mt-2 max-w-xs">
      Try changing your filters or add a new dish to your menu.
    </p>

    <button
      onClick={onAdd}
      className="mt-6 px-5 py-3 bg-[#f28a2e] text-black text-xs font-medium"
    >
      Add New Dish
    </button>
  </div>
);

export default MenuPage;