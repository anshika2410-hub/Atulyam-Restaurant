import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowDown,
  ArrowUpRight,
  Search,
  X,
  Leaf,
  Flame,
} from "lucide-react";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:8000/api/v1";

/* -------------------------------------------------------------------------- */
/*                               CATEGORY IMAGES                              */
/* -------------------------------------------------------------------------- */

const categoryImages = {
  Mocktail:
    "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=1200&q=85",

  Shakes:
    "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=1200&q=85",

  Beverages:
    "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=1200&q=85",

  "Hot Tea/Coffee":
    "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=85",

  Salad:
    "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=85",

  Soup:
    "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=1200&q=85",

  Sider:
    "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=1200&q=85",

  Raita:
    "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1200&q=85",

  "Indian Appetizer":
    "https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?auto=format&fit=crop&w=1200&q=85",

  "Chinese Appetizers":
    "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1200&q=85",

  Sizzler:
    "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=85",

  "South Indian":
    "https://images.unsplash.com/photo-1630383249896-424e482df921?auto=format&fit=crop&w=1200&q=85",

  Pizza:
    "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=1200&q=85",

  Pasta:
    "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=1200&q=85",

  Sandwich:
    "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=1200&q=85",

  Burger:
    "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1200&q=85",

  "Chaap (Dry)":
    "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1200&q=85",

  "Chaap (Gravy)":
    "https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?auto=format&fit=crop&w=1200&q=85",

  Combo:
    "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=85",

  "Veg Main Course":
    "https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?auto=format&fit=crop&w=1200&q=85",

  Breads:
    "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1200&q=85",

  Rice:
    "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=1200&q=85",

  Dessert:
    "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=1200&q=85",

  "Indian Thali":
    "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1200&q=85",

  "Chinese Thali":
    "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1200&q=85",

  All:
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=85",
};

/* -------------------------------------------------------------------------- */
/*                                  ANIMATION                                 */
/* -------------------------------------------------------------------------- */

const ease = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 35,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease,
    },
  },
};

const imageReveal = {
  hidden: {
    opacity: 0,
    scale: 1.05,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 1.1,
      ease,
    },
  },
};

/* -------------------------------------------------------------------------- */
/*                                MENU ITEM                                   */
/* -------------------------------------------------------------------------- */

function MenuItem({ item, index, onClick }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{
        once: true,
        amount: 0.2,
      }}
      transition={{
        duration: 0.65,
        delay: index * 0.04,
        ease,
      }}
      className="group w-full text-left border-b border-white/10 py-5 md:py-6"
    >
      <div className="flex items-start justify-between gap-5 md:gap-6">
        {/* LEFT */}
        <div className="min-w-0 max-w-[80%]">
          <div className="flex items-center gap-3 flex-wrap">
            <h3 className="font-serif text-xl md:text-2xl text-white group-hover:text-[#f28a2e] transition-colors duration-300">
              {item.name}
            </h3>

            {item.tag && (
              <span className="text-[9px] uppercase tracking-[0.2em] text-[#f28a2e] border border-[#f28a2e]/30 px-2 py-1">
                {item.tag}
              </span>
            )}
          </div>

          {item.description && (
            <p className="text-white/40 text-xs leading-5 mt-2 max-w-lg">
              {item.description}
            </p>
          )}

          <div className="flex items-center gap-3 mt-3">
            {item.isVeg && (
              <span className="inline-flex items-center gap-1 text-[9px] uppercase tracking-[0.16em] text-green-400/80">
                <Leaf size={11} strokeWidth={1.7} />
                Veg
              </span>
            )}

            {item.isSpicy > 0 && (
              <span className="inline-flex items-center gap-1 text-[9px] uppercase tracking-[0.16em] text-red-400/80">
                <Flame size={11} strokeWidth={1.7} />
                Spicy
              </span>
            )}
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex flex-col items-end gap-2 shrink-0">
          <span className="font-serif text-lg md:text-xl text-[#f28a2e] whitespace-nowrap">
            {item.price}
          </span>

          <ArrowUpRight
            size={18}
            strokeWidth={1.3}
            className="text-white/30 group-hover:text-[#f28a2e] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300"
          />
        </div>
      </div>
    </motion.button>
  );
}

/* -------------------------------------------------------------------------- */
/*                                MAIN PAGE                                   */
/* -------------------------------------------------------------------------- */

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const [selectedItem, setSelectedItem] = useState(null);

  /* ------------------------------------------------------------------------ */
  /*                                  FETCH                                   */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true);
        setError("");

        const menuRes = await fetch(
          `${API_URL}/menu?available_only=true`
        );

        if (!menuRes.ok) {
          throw new Error("Failed to load menu.");
        }

        const menuData = await menuRes.json();

        setMenuItems(
          Array.isArray(menuData)
            ? menuData
            : menuData.items || []
        );
      } catch (err) {
        console.error("Menu fetch error:", err);

        setError(
          err?.message ||
            "Unable to load menu right now. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  /* ------------------------------------------------------------------------ */
  /*                         CATEGORY DATA FROM MENU                          */
  /* ------------------------------------------------------------------------ */

  const categoryData = useMemo(() => {
    const categories = Object.keys(categoryImages).filter(
      (category) => category !== "All"
    );

    return categories.map((name, index) => ({
      id: name,
      name,
      slug: name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-"),
      description: "",
      image: categoryImages[name],
      index,
    }));
  }, []);

  /* ------------------------------------------------------------------------ */
  /*                            GROUP MENU ITEMS                              */
  /* ------------------------------------------------------------------------ */

  const groupedMenu = useMemo(() => {
    const query = search.trim().toLowerCase();

    return categoryData
      .map((category) => {
        let items = menuItems.filter((item) => {
          const itemCategoryName =
            item.category?.name ||
            item.category_name ||
            item.categoryName ||
            item.category;

          if (itemCategoryName) {
            return (
              String(itemCategoryName)
                .trim()
                .toLowerCase() ===
              category.name.trim().toLowerCase()
            );
          }

          return false;
        });

        /* SEARCH */
        if (query) {
          items = items.filter((item) => {
            const name = String(
              item.name || ""
            ).toLowerCase();

            const description = String(
              item.description || ""
            ).toLowerCase();

            return (
              name.includes(query) ||
              description.includes(query)
            );
          });
        }

        return {
          id: category.id,
          category: category.name,
          slug: category.slug,
          description: category.description,
          image: category.image,

          items: items.map((item) => ({
            id: item.id,

            name: item.name,

            description:
              item.description ||
              "A delicious Atulyam creation.",

            price: `₹${Number(item.price).toLocaleString(
              "en-IN"
            )}`,

            image:
              item.image_url ||
              category.image,

            tag: item.is_featured
              ? "Chef's Pick"
              : null,

            isVeg: item.is_veg,
            isSpicy: item.is_spicy,
            isAvailable: item.is_available,
          })),
        };
      })
      .filter((section) => {
        if (!query) {
          return true;
        }

        return section.items.length > 0;
      });
  }, [categoryData, menuItems, search]);

  /* ------------------------------------------------------------------------ */
  /*                             FILTER CATEGORY                              */
  /* ------------------------------------------------------------------------ */

  const visibleSections = useMemo(() => {
    if (activeCategory === "All") {
      return groupedMenu;
    }

    return groupedMenu.filter(
      (section) =>
        section.category === activeCategory ||
        section.slug === activeCategory
    );
  }, [groupedMenu, activeCategory]);

  /* ------------------------------------------------------------------------ */
  /*                              CATEGORY LIST                               */
  /* ------------------------------------------------------------------------ */

  const categories = useMemo(() => {
    return [
      {
        id: "all",
        name: "All",
      },
      ...categoryData
        .filter(
          (category) =>
            category.name?.toLowerCase() !== "chinese"
        )
        .map((category) => ({
          id: category.id,
          name: category.name,
        })),
    ];
  }, [categoryData]);

  /* ------------------------------------------------------------------------ */
  /*                               SCROLL TO                                  */
  /* ------------------------------------------------------------------------ */

  const scrollToCategory = (categoryName) => {
    setSearch("");
    setActiveCategory(categoryName);

    if (categoryName === "All") {
      window.scrollTo({
        top: 650,
        behavior: "smooth",
      });

      return;
    }

    const element = document.getElementById(
      `category-${categoryName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")}`
    );

    if (element) {
      const offset = 130;

      const top =
        element.getBoundingClientRect().top +
        window.scrollY -
        offset;

      window.scrollTo({
        top,
        behavior: "smooth",
      });
    }
  };

  /* ------------------------------------------------------------------------ */
  /*                              CLEAR SEARCH                               */
  /* ------------------------------------------------------------------------ */

  const clearSearch = () => {
    setSearch("");
    setActiveCategory("All");
  };

  /* ------------------------------------------------------------------------ */
  /*                                  LOADING                                 */
  /* ------------------------------------------------------------------------ */

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0c0b09] text-white">
        <section className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-10 h-10 border border-white/20 border-t-[#f28a2e] rounded-full animate-spin mx-auto mb-6" />

            <p className="text-white/40 text-xs uppercase tracking-[0.3em]">
              Loading Menu
            </p>
          </div>
        </section>
      </main>
    );
  }

  /* ------------------------------------------------------------------------ */
  /*                                   ERROR                                  */
  /* ------------------------------------------------------------------------ */

  if (error) {
    return (
      <main className="min-h-screen bg-[#0c0b09] text-white">
        <section className="min-h-screen flex items-center justify-center px-6">
          <div className="text-center max-w-md">
            <p className="text-[#f28a2e] uppercase tracking-[0.25em] text-xs mb-4">
              Menu
            </p>

            <h1 className="font-serif text-3xl mb-5">
              Something went wrong
            </h1>

            <p className="text-white/40 text-sm leading-6">
              {error}
            </p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-8 border border-white/20 px-6 py-3 text-xs uppercase tracking-[0.2em] hover:border-[#f28a2e] hover:text-[#f28a2e] transition-colors"
            >
              Try Again
            </button>
          </div>
        </section>
      </main>
    );
  }

  /* ------------------------------------------------------------------------ */
  /*                                   PAGE                                   */
  /* ------------------------------------------------------------------------ */

  return (
    <main className="min-h-screen bg-[#0c0b09] text-white overflow-x-hidden">

      {/* ==================================================================== */}
      {/*                                  HERO                                */}
      {/* ==================================================================== */}

      <section className="relative min-h-[78vh] flex items-end overflow-hidden">
        <motion.div
          variants={imageReveal}
          initial="hidden"
          animate="visible"
          className="absolute inset-0"
        >
          <img
            src={categoryImages.All}
            alt="Atulyam Restaurant"
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-black/55" />

          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0b09] via-black/20 to-black/20" />
        </motion.div>

        <div className="relative z-10 w-full px-6 md:px-12 lg:px-20 pb-20 md:pb-24">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="max-w-5xl"
          >
            <p className="text-[#f28a2e] text-xs uppercase tracking-[0.35em] mb-6">
              Atulyam Restaurant
            </p>

            <h1 className="font-serif text-6xl md:text-8xl lg:text-[9rem] leading-[0.85] tracking-[-0.04em]">
              Our Menu
            </h1>

            <p className="mt-8 max-w-xl text-white/65 text-sm md:text-base leading-7">
              A carefully curated selection of vegetarian
              favourites, timeless Indian classics and
              contemporary creations.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            delay: 1,
            duration: 1,
          }}
          className="absolute bottom-7 right-6 md:right-12 z-10 hidden md:flex items-center gap-3 text-white/40"
        >
          <span className="text-[9px] uppercase tracking-[0.25em]">
            Explore
          </span>

          <ArrowDown
            size={15}
            strokeWidth={1.2}
          />
        </motion.div>
      </section>

      {/* ==================================================================== */}
      {/*                           SEARCH + CATEGORIES                        */}
      {/* ==================================================================== */}

      <section className="sticky top-0 z-40 border-y border-white/10 bg-[#0c0b09]/95 backdrop-blur-xl">
        <div className="px-6 md:px-12 lg:px-20">

          {/* SEARCH */}
          <div className="relative py-5">
            <div className="relative border border-white/10 bg-white/[0.02] focus-within:border-[#f28a2e]/35 transition-colors duration-300">

              <Search
                size={17}
                strokeWidth={1.4}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setActiveCategory("All");
                }}
                placeholder="Search dishes..."
                className="w-full h-12 bg-transparent border-none outline-none pl-11 pr-12 text-sm text-white placeholder:text-white/25"
              />

              {search && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors"
                >
                  <X
                    size={17}
                    strokeWidth={1.4}
                  />
                </button>
              )}
            </div>
          </div>

          {/* CATEGORY NAV */}
          <div className="flex items-center gap-7 md:gap-9 overflow-x-auto pb-4 scrollbar-hide">
            {categories.map((category) => {
              const isActive =
                activeCategory === category.name;

              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() =>
                    scrollToCategory(category.name)
                  }
                  className={`relative shrink-0 text-[10px] uppercase tracking-[0.18em] transition-colors duration-300 ${
                    isActive
                      ? "text-[#f28a2e]"
                      : "text-white/35 hover:text-white/75"
                  }`}
                >
                  {category.name}

                  <span
                    className={`absolute left-0 -bottom-2 h-px bg-[#f28a2e] transition-all duration-300 ${
                      isActive
                        ? "w-full"
                        : "w-0"
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/*                                MENU                                  */}
      {/* ==================================================================== */}

      <section className="px-6 md:px-12 lg:px-20 py-24 md:py-32">
        <div className="space-y-20 md:space-y-28">

          {visibleSections.map(
            (section, sectionIndex) => {
              const sectionId =
                `category-${section.category
                  .toLowerCase()
                  .replace(/[^a-z0-9]+/g, "-")}`;

              return (
                <motion.section
                  key={
                    section.id ||
                    section.category
                  }
                  id={sectionId}
                  initial={{
                    opacity: 0,
                    y: 30,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                    amount: 0.08,
                  }}
                  transition={{
                    duration: 0.8,
                    ease,
                  }}
                  className="scroll-mt-32"
                >

                  {/* CATEGORY HEADER */}
                  <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-10 md:mb-12">

                    <div>
                      <div className="flex items-center gap-4 mb-4">
                        <span className="text-[#f28a2e] text-[10px] tracking-[0.3em] uppercase">
                          {String(
                            sectionIndex + 1
                          ).padStart(2, "0")}
                        </span>

                        <span className="h-px w-10 bg-[#f28a2e]/40" />
                      </div>

                      <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl leading-none">
                        {section.category}
                      </h2>
                    </div>

                    {section.description && (
                      <p className="max-w-md text-white/35 text-xs md:text-sm leading-6 md:text-right">
                        {section.description}
                      </p>
                    )}
                  </div>

                  {/* EMPTY CATEGORY */}
                  {section.items.length === 0 ? (
                    <div className="py-20 md:py-28 text-center border border-white/10 bg-white/[0.02]">
                      <p className="text-white/30 text-sm tracking-[0.2em] uppercase">
                        Coming Soon
                      </p>
                    </div>
                  ) : (

                    /* TWO COLUMN MENU */
                    <div className="grid md:grid-cols-2 gap-x-10 lg:gap-x-16">
                      {section.items.map(
                        (item, index) => (
                          <MenuItem
                            key={
                              item.id ||
                              `${item.name}-${index}`
                            }
                            item={item}
                            index={index}
                            onClick={() =>
                              setSelectedItem(item)
                            }
                          />
                        )
                      )}
                    </div>
                  )}
                </motion.section>
              );
            }
          )}
        </div>

        {/* ================================================================== */}
        {/*                           NO SEARCH RESULTS                         */}
        {/* ================================================================== */}

        {search.trim() &&
          visibleSections.length === 0 && (
            <div className="py-24 text-center">
              <div className="w-12 h-12 border border-white/10 flex items-center justify-center mx-auto mb-6">
                <Search
                  size={18}
                  strokeWidth={1.2}
                  className="text-white/30"
                />
              </div>

              <p className="text-white/30 text-xs uppercase tracking-[0.25em]">
                No dishes found
              </p>

              <p className="mt-3 text-white/20 text-xs">
                Try searching for another dish
              </p>

              <button
                type="button"
                onClick={clearSearch}
                className="mt-7 text-[#f28a2e] text-xs uppercase tracking-[0.2em] border-b border-[#f28a2e]/40 pb-1 hover:border-[#f28a2e] transition-colors"
              >
                Clear Search
              </button>
            </div>
          )}
      </section>

      {/* ==================================================================== */}
      {/*                              CLOSING                                 */}
      {/* ==================================================================== */}

      <section className="relative overflow-hidden border-t border-white/10 bg-[#0c0b09]">

        {/* BACKGROUND TYPOGRAPHY */}
        <div
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
        >
          <span className="font-serif text-[22vw] md:text-[20vw] lg:text-[18vw] tracking-[-0.06em] leading-none text-white/[0.025] whitespace-nowrap">
            ATULYAM
          </span>
        </div>

        {/* SOFT GLOW */}
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full bg-[#f28a2e]/[0.045] blur-[130px] pointer-events-none"
        />

        {/* TOP DECORATIVE LINE */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-16 bg-gradient-to-b from-[#f28a2e]/50 to-transparent" />

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.25,
          }}
          className="relative z-10 px-6 md:px-12 lg:px-20 py-24 md:py-32 lg:py-16"
        >
          <div className="max-w-6xl mx-auto">

            {/* TOP LABEL */}
            <div className="flex items-center justify-center gap-4 mb-10">
              <span className="w-12 md:w-20 h-px bg-white/10" />

              <span className="text-[#f28a2e] text-[9px] md:text-[10px] uppercase tracking-[0.4em]">
                Come Hungry
              </span>

              <span className="w-12 md:w-20 h-px bg-white/10" />
            </div>

            {/* MAIN STATEMENT */}
            <div className="text-center">
              <h2 className="font-serif text-[16vw] md:text-[11vw] lg:text-[9vw] leading-[0.78] tracking-[-0.05em]">
                Stay for
              </h2>

              <h2 className="font-serif text-[16vw] md:text-[11vw] lg:text-[9vw] leading-[0.78] tracking-[-0.05em] text-white/25 italic">
                the experience.
              </h2>
            </div>

            {/* BOTTOM CONTENT */}
            <div className="mt-14 md:mt-16 flex flex-col items-center">

              <p className="max-w-md text-center text-white/35 text-xs md:text-sm leading-6 md:leading-7">
                Good food is only the beginning.
                <br className="hidden md:block" />
                Join us at Atulyam for an experience made to be shared.
              </p>

              {/* CTA */}
              <div className="mt-9">
                <a
                  href="/reservation"
                  className="group relative inline-flex items-center gap-5 px-8 py-4 border border-white/15 hover:border-[#f28a2e]/60 transition-all duration-500"
                >
                  {/* CORNER ACCENTS */}
                  <span className="absolute -top-px -left-px w-2 h-2 border-t border-l border-[#f28a2e] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <span className="absolute -top-px -right-px w-2 h-2 border-t border-r border-[#f28a2e] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <span className="absolute -bottom-px -left-px w-2 h-2 border-b border-l border-[#f28a2e] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <span className="absolute -bottom-px -right-px w-2 h-2 border-b border-r border-[#f28a2e] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <span className="text-[9px] uppercase tracking-[0.3em] text-white/75 group-hover:text-white transition-colors duration-300">
                    Reserve a Table
                  </span>

                  <ArrowUpRight
                    size={16}
                    strokeWidth={1.2}
                    className="text-[#f28a2e] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-500"
                  />
                </a>
              </div>
            </div>

          </div>
        </motion.div>
      </section>

      {/* ==================================================================== */}
      {/*                             QUICK VIEW                               */}
      {/* ==================================================================== */}

      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-5 md:p-8"
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
                scale: 0.98,
              }}
              transition={{
                duration: 0.5,
                ease,
              }}
              onClick={(e) =>
                e.stopPropagation()
              }
              className="relative w-full max-w-4xl bg-[#15130f] border border-white/10 overflow-hidden"
            >

              {/* CLOSE */}
              <button
                type="button"
                onClick={() =>
                  setSelectedItem(null)
                }
                className="absolute right-5 top-5 z-20 w-10 h-10 flex items-center justify-center bg-black/40 border border-white/10 text-white/60 hover:text-white hover:border-white/30 transition-colors"
              >
                <X
                  size={18}
                  strokeWidth={1.3}
                />
              </button>

              <div className="grid md:grid-cols-2">

                {/* IMAGE */}
                <div className="relative h-[280px] md:h-[520px]">
                  <img
                    src={selectedItem.image}
                    alt={selectedItem.name}
                    className="w-full h-full object-cover"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>

                {/* CONTENT */}
                <div className="p-7 md:p-10 lg:p-12 flex flex-col justify-center">

                  <div className="flex items-center gap-3 mb-5">
                    {selectedItem.isVeg && (
                      <span className="inline-flex items-center gap-1.5 text-[9px] uppercase tracking-[0.2em] text-green-400/80">
                        <Leaf size={11} />
                        Vegetarian
                      </span>
                    )}

                    {selectedItem.isSpicy > 0 && (
                      <span className="inline-flex items-center gap-1.5 text-[9px] uppercase tracking-[0.2em] text-red-400/80">
                        <Flame size={11} />
                        Spicy
                      </span>
                    )}
                  </div>

                  <h2 className="font-serif text-4xl md:text-5xl leading-tight">
                    {selectedItem.name}
                  </h2>

                  {selectedItem.tag && (
                    <span className="inline-block w-fit mt-5 text-[9px] uppercase tracking-[0.2em] text-[#f28a2e] border border-[#f28a2e]/30 px-3 py-2">
                      {selectedItem.tag}
                    </span>
                  )}

                  <p className="mt-7 text-white/45 text-sm leading-7">
                    {selectedItem.description}
                  </p>

                  <div className="mt-9 pt-7 border-t border-white/10 flex items-center justify-between">
                    <span className="text-white/30 text-[9px] uppercase tracking-[0.25em]">
                      Price
                    </span>

                    <span className="font-serif text-3xl text-[#f28a2e]">
                      {selectedItem.price}
                    </span>
                  </div>
                </div>

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </main>
  );
}