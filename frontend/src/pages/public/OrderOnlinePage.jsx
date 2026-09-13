import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../../context/CartContext.jsx";
import {
  ShoppingBag,
  Plus,
  Minus,
  ArrowUpRight,
  X,
  Check,
  ChevronRight,
  Search,
} from "lucide-react";

const ease = [0.22, 1, 0.36, 1];

const API_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api/v1";

const categoryImages = {
  All: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1800&q=85",

  Soups:
    "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=1200&q=90",

  Starters:
    "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=1200&q=90",

  Chinese:
    "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1200&q=90",

  "Main Course":
    "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=1200&q=90",

  Breads:
    "https://images.pexels.com/photos/28125427/pexels-photo-28125427.jpeg",

  "Rice & Biryani":
    "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=1200&q=90",

  "South Indian":
    "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=1200&q=90",

  Desserts:
    "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=1200&q=90",

  Beverages:
    "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=1200&q=90",
};

const OrderOnlinePage = () => {
  const {
    items: cartItems,
    addToCart,
    updateQuantity,
    setIsCartOpen,
  } = useCart();

  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedItem, setSelectedItem] = useState(null);
  const [ordered, setOrdered] = useState(false);

  const [categories, setCategories] = useState(["All"]);
  const [menuItems, setMenuItems] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // =========================================================
  // FETCH MENU FROM BACKEND
  // =========================================================

  useEffect(() => {
    let mounted = true;

    const fetchMenu = async () => {
      try {
        setLoading(true);
        setError("");

        const [categoriesResponse, menuResponse] = await Promise.all([
          fetch(`${API_URL}/categories?active_only=true`),
          fetch(`${API_URL}/menu?available_only=true`),
        ]);

        if (!categoriesResponse.ok || !menuResponse.ok) {
          throw new Error("Unable to load menu.");
        }

        const categoryData = await categoriesResponse.json();
        const menuData = await menuResponse.json();

        const categoryList = [
          "All",
          ...categoryData.map((category) => category.name),
        ];

        const transformedItems = menuData
          .filter((item) => item.is_available)
          .map((item) => {
            const category = categoryData.find(
              (cat) => cat.id === item.category_id
            );

            return {
              id: item.id,
              categoryId: item.category_id,
              name: item.name,
              category: category?.name || "Other",
              price: Number(item.price),
              description:
                item.description || "A delicious Atulyam creation.",
              image:
                item.image_url ||
                categoryImages[category?.name] ||
                categoryImages.All,
              veg: item.is_veg,
              spicy: item.is_spicy,
              featured: item.is_featured,
              available: item.is_available,
            };
          });

        if (mounted) {
          setCategories(categoryList);
          setMenuItems(transformedItems);
        }
      } catch (err) {
        if (mounted) {
          setError(err.message || "Unable to load menu.");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchMenu();

    return () => {
      mounted = false;
    };
  }, []);

  // =========================================================
  // FILTER
  // =========================================================

  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return menuItems.filter((item) => {
      const categoryMatch =
        activeCategory === "All" || item.category === activeCategory;

      const searchMatch =
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query);

      return categoryMatch && searchMatch;
    });
  }, [activeCategory, searchQuery, menuItems]);

  // =========================================================
  // CART
  // =========================================================

  const totalItems = cartItems.reduce(
    (sum, item) => sum + (item.quantity || 0),
    0
  );

  const subtotal = cartItems.reduce(
    (sum, item) =>
      sum + (Number(item.price) || 0) * (item.quantity || 0),
    0
  );

  // =========================================================
  // GET QUANTITY
  // =========================================================

  const getQuantity = (id) => {
    const item = cartItems.find((cartItem) => cartItem.id === id);

    return item?.quantity || 0;
  };

  // =========================================================
  // CART ACTIONS
  // =========================================================

  const handleAdd = (item) => {
    addToCart(item, 1);
  };

  const handleDecrease = (id) => {
    const item = cartItems.find((cartItem) => cartItem.id === id);

    if (!item) return;

    updateQuantity(id, item.quantity - 1);
  };

  // =========================================================
  // PLACE ORDER
  // =========================================================

  const handlePlaceOrder = () => {
    if (!totalItems) return;

    setIsCartOpen(false);
    setOrdered(true);
  };

  return (
    <main className="bg-black text-white min-h-screen overflow-hidden">

      {/* =====================================================
          MENU
      ===================================================== */}

      <section
        id="online-menu"
        className="bg-[#0b0b0b] border-y border-white/10"
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-16 md:py-24">

          {/* HEADER */}

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease }}
            className="grid md:grid-cols-12 gap-8 md:gap-16 items-end mb-12 md:mb-16"
          >
            <div className="md:col-span-7">
              <span className="text-white/35 text-[9px] uppercase tracking-[0.3em]">
                Explore The Menu
              </span>

              <h2 className="font-serif text-5xl md:text-6xl lg:text-[5.5vw] leading-[0.86] tracking-[-0.055em] mt-4">
                Pick your
                <br />
                <span className="italic text-[#f28a2e]">
                  favourites.
                </span>
              </h2>
            </div>

            <div className="md:col-span-5">
              <div className="border-l border-white/15 pl-6 md:pl-8">
                <p className="text-white/45 text-sm md:text-[15px] leading-7 max-w-md">
                  From comforting classics to flavour-packed
                  favourites, choose something delicious for
                  every mood.
                </p>
              </div>
            </div>
          </motion.div>

          {/* SEARCH */}

          <div className="mb-6">
            <div className="relative max-w-md">
              <Search
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
              />

              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search dishes..."
                className="w-full h-12 bg-black border border-white/10 pl-11 pr-5 text-sm text-white placeholder:text-white/25 outline-none focus:border-[#f28a2e]/60 transition-colors"
              />
            </div>
          </div>

          {/* CATEGORY FILTER */}

          <div className="relative mb-12 md:mb-16">
            <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide">
              {categories.map((category) => {
                const active = activeCategory === category;

                return (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`
                      relative shrink-0 px-5 py-3
                      text-[10px] uppercase tracking-[0.18em]
                      border transition-all duration-300
                      ${
                        active
                          ? "bg-[#f28a2e] text-black border-[#f28a2e]"
                          : "border-white/10 text-white/45 hover:text-white hover:border-white/25"
                      }
                    `}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          </div>

          {/* LOADING */}

          {loading && (
            <div className="py-28 text-center">
              <div className="w-8 h-8 border border-white/15 border-t-[#f28a2e] rounded-full animate-spin mx-auto" />

              <p className="text-white/30 text-[9px] uppercase tracking-[0.25em] mt-6">
                Loading Menu
              </p>
            </div>
          )}

          {/* ERROR */}

          {!loading && error && (
            <div className="py-24 text-center border border-red-500/20">
              <p className="text-red-400 text-[9px] uppercase tracking-[0.3em] mb-4">
                Menu Unavailable
              </p>

              <h3 className="font-serif text-3xl md:text-4xl text-white/70">
                We couldn't load the menu.
              </h3>

              <p className="text-white/30 text-sm mt-4">
                Please make sure the backend server is running.
              </p>
            </div>
          )}

          {/* FOOD GRID */}

          {!loading && !error && (
            <>
              <motion.div
                layout
                className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5"
              >
                <AnimatePresence mode="popLayout">
                  {filteredItems.map((item, index) => {
                    const quantity = getQuantity(item.id);

                    return (
                      <motion.article
                        key={item.id}
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
                          delay: Math.min(index * 0.025, 0.25),
                          ease,
                        }}
                        className="group bg-black border border-white/10 hover:border-[#f28a2e]/40 transition-colors duration-500"
                      >

                        {/* IMAGE */}

                        <div
                          className="relative aspect-[4/3] overflow-hidden cursor-pointer"
                          onClick={() => setSelectedItem(item)}
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />

                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/10" />

                          {/* VEG */}

                          {item.veg && (
                            <div className="absolute top-4 left-4 w-5 h-5 border border-green-400/70 flex items-center justify-center">
                              <span className="w-2 h-2 rounded-full bg-green-400" />
                            </div>
                          )}

                          {/* FEATURED */}

                          {item.featured && (
                            <span className="absolute top-4 left-12 text-[#f28a2e] text-[8px] uppercase tracking-[0.2em]">
                              Chef's Pick
                            </span>
                          )}

                          {/* QUICK VIEW */}

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedItem(item);
                            }}
                            className="absolute top-4 right-4 w-9 h-9 rounded-full border border-white/20 bg-black/30 backdrop-blur-sm flex items-center justify-center text-white/70 hover:bg-[#f28a2e] hover:text-black hover:border-[#f28a2e] transition-all duration-300"
                            aria-label={`View ${item.name}`}
                          >
                            <ArrowUpRight size={15} />
                          </button>

                          {/* CATEGORY */}

                          <div className="absolute bottom-4 left-4">
                            <span className="text-white/60 text-[8px] uppercase tracking-[0.25em]">
                              {item.category}
                            </span>
                          </div>
                        </div>

                        {/* CONTENT */}

                        <div className="p-5 md:p-6">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h3 className="font-serif text-2xl md:text-[26px] leading-tight tracking-[-0.03em]">
                                {item.name}
                              </h3>

                              <p className="text-white/35 text-xs leading-6 mt-2 line-clamp-2">
                                {item.description}
                              </p>
                            </div>

                            <span className="font-serif text-xl text-[#f28a2e] shrink-0">
                              ₹{item.price.toLocaleString("en-IN")}
                            </span>
                          </div>

                          {/* ADD / QUANTITY */}

                          <div className="mt-6">
                            {quantity === 0 ? (
                              <button
                                onClick={() => handleAdd(item)}
                                className="w-full h-12 border border-white/15 hover:border-[#f28a2e] hover:bg-[#f28a2e] hover:text-black flex items-center justify-between px-4 text-[10px] uppercase tracking-[0.2em] transition-all duration-300"
                              >
                                <span>Add To Order</span>

                                <Plus
                                  size={16}
                                  className="text-[#f28a2e] group-hover:text-black"
                                />
                              </button>
                            ) : (
                              <div className="w-full h-12 border border-[#f28a2e]/50 bg-[#f28a2e]/5 flex items-center justify-between">
                                <button
                                  onClick={() =>
                                    handleDecrease(item.id)
                                  }
                                  className="w-12 h-full flex items-center justify-center text-white/60 hover:text-[#f28a2e] transition-colors"
                                >
                                  <Minus size={15} />
                                </button>

                                <div className="flex items-center gap-3">
                                  <span className="text-[10px] uppercase tracking-[0.2em] text-white/45">
                                    Added
                                  </span>

                                  <span className="font-serif text-xl text-[#f28a2e]">
                                    {quantity}
                                  </span>
                                </div>

                                <button
                                  onClick={() => handleAdd(item)}
                                  className="w-12 h-full flex items-center justify-center text-white/60 hover:text-[#f28a2e] transition-colors"
                                >
                                  <Plus size={15} />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.article>
                    );
                  })}
                </AnimatePresence>
              </motion.div>

              {/* EMPTY */}

              {filteredItems.length === 0 && (
                <div className="py-20 text-center">
                  <Search
                    size={28}
                    className="mx-auto text-white/15 mb-5"
                  />

                  <p className="font-serif text-2xl text-white/50">
                    Nothing here yet.
                  </p>

                  <p className="text-white/25 text-sm mt-3">
                    Try another dish or category.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* =====================================================
          ORDER SUMMARY
      ===================================================== */}

      <section className="bg-black border-b border-white/10">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-10 md:py-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-7">

            {/* ORDER INFO */}

            <div className="flex items-center gap-5">
              <div className="w-12 h-12 rounded-full border border-[#f28a2e]/40 flex items-center justify-center">
                <ShoppingBag
                  size={19}
                  className="text-[#f28a2e]"
                />
              </div>

              <div>
                <p className="text-white/35 text-[9px] uppercase tracking-[0.25em]">
                  Your Order
                </p>

                <p className="font-serif text-2xl mt-1">
                  {totalItems}{" "}
                  {totalItems === 1 ? "item" : "items"}
                </p>
              </div>
            </div>

            {/* PRICE */}

            <div className="flex items-center gap-8">
              <div>
                <p className="text-white/30 text-[9px] uppercase tracking-[0.2em]">
                  Subtotal
                </p>

                <p className="font-serif text-2xl text-[#f28a2e] mt-1">
                  ₹{subtotal.toLocaleString("en-IN")}
                </p>
              </div>

              <button
                onClick={() => setIsCartOpen(true)}
                disabled={!totalItems}
                className="h-12 px-6 md:px-8 bg-[#f28a2e] text-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-3 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white transition-colors duration-300"
              >
                View Cart
                <ChevronRight size={15} />
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* =====================================================
          QUICK VIEW
      ===================================================== */}

      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-5 md:p-10"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{
                opacity: 0,
                y: 30,
                scale: 0.97,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                y: 20,
                scale: 0.97,
              }}
              transition={{
                duration: 0.4,
                ease,
              }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl bg-[#0b0b0b] border border-white/10 overflow-hidden"
            >
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/60 border border-white/15 flex items-center justify-center text-white/70 hover:bg-[#f28a2e] hover:text-black transition-all"
              >
                <X size={17} />
              </button>

              <div className="grid md:grid-cols-2">
                <div className="h-[220px] sm:h-[260px] md:h-[430px] overflow-hidden">
                  <img
                    src={selectedItem.image}
                    alt={selectedItem.name}
                    className="w-full h-full object-cover object-center"
                  />
                </div>

                <div className="p-7 md:p-10 flex flex-col justify-center">
                  <span className="text-[#f28a2e] text-[9px] uppercase tracking-[0.3em]">
                    {selectedItem.category}
                  </span>

                  {selectedItem.featured && (
                    <span className="text-white/30 text-[8px] uppercase tracking-[0.2em] mt-3">
                      Chef's Pick
                    </span>
                  )}

                  <h3 className="font-serif text-4xl md:text-5xl leading-[0.9] tracking-[-0.05em] mt-5">
                    {selectedItem.name}
                  </h3>

                  <p className="font-serif text-xl text-[#f28a2e] mt-5">
                    ₹{selectedItem.price.toLocaleString("en-IN")}
                  </p>

                  <div className="w-10 h-px bg-[#f28a2e]/60 my-7" />

                  <p className="text-white/45 text-sm leading-7">
                    {selectedItem.description}
                  </p>

                  <div className="mt-8">
                    {getQuantity(selectedItem.id) === 0 ? (
                      <button
                        onClick={() => handleAdd(selectedItem)}
                        className="w-full h-13 bg-[#f28a2e] text-black flex items-center justify-between px-5 text-[10px] uppercase tracking-[0.2em] hover:bg-white transition-colors duration-300"
                      >
                        <span>Add To Order</span>
                        <Plus size={17} />
                      </button>
                    ) : (
                      <div className="w-full h-13 border border-[#f28a2e]/50 flex items-center justify-between">
                        <button
                          onClick={() =>
                            handleDecrease(selectedItem.id)
                          }
                          className="w-14 h-full flex items-center justify-center hover:text-[#f28a2e]"
                        >
                          <Minus size={16} />
                        </button>

                        <span className="font-serif text-xl text-[#f28a2e]">
                          {getQuantity(selectedItem.id)}
                        </span>

                        <button
                          onClick={() => handleAdd(selectedItem)}
                          className="w-14 h-full flex items-center justify-center hover:text-[#f28a2e]"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =====================================================
          ORDER SUCCESS
      ===================================================== */}

      <AnimatePresence>
        {ordered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] bg-black/85 backdrop-blur-md flex items-center justify-center p-6"
          >
            <motion.div
              initial={{
                opacity: 0,
                y: 30,
                scale: 0.97,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              className="w-full max-w-lg bg-[#0b0b0b] border border-white/10 p-8 md:p-12 text-center"
            >
              <div className="w-16 h-16 rounded-full border border-[#f28a2e]/50 flex items-center justify-center mx-auto mb-7">
                <Check
                  size={26}
                  className="text-[#f28a2e]"
                />
              </div>

              <span className="text-[#f28a2e] text-[9px] uppercase tracking-[0.3em]">
                Thank You
              </span>

              <h3 className="font-serif text-4xl md:text-5xl leading-[0.9] tracking-[-0.05em] mt-4">
                Order request
                <br />
                <span className="italic text-[#f28a2e]">
                  received.
                </span>
              </h3>

              <p className="text-white/40 text-sm leading-7 mt-6 max-w-sm mx-auto">
                Your order has been noted. Our team will
                confirm the details with you shortly.
              </p>

              <button
                onClick={() => setOrdered(false)}
                className="mt-8 h-12 px-8 border border-white/15 text-[10px] uppercase tracking-[0.2em] hover:bg-[#f28a2e] hover:text-black hover:border-[#f28a2e] transition-all"
              >
                Continue Browsing
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =====================================================
          MOBILE CART BAR
      ===================================================== */}

      <AnimatePresence>
        {totalItems > 0 && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-0 left-0 right-0 z-[90] md:hidden bg-[#0b0b0b]/95 backdrop-blur-xl border-t border-white/10 p-4"
          >
            <button
              onClick={() => setIsCartOpen(true)}
              className="w-full h-13 bg-[#f28a2e] text-black flex items-center justify-between px-5"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center">
                  <ShoppingBag size={15} />
                </div>

                <span className="text-[10px] uppercase tracking-[0.18em]">
                  {totalItems}{" "}
                  {totalItems === 1 ? "Item" : "Items"}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="font-serif text-lg">
                  ₹{subtotal.toLocaleString("en-IN")}
                </span>

                <ChevronRight size={16} />
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};

export default OrderOnlinePage;