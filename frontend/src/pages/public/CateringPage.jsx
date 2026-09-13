import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ArrowUpRight,
  Check,
  ChefHat,
  UtensilsCrossed,
  Sparkles,
  X,
  CalendarDays,
  Users,
} from "lucide-react";

const ease = [0.22, 1, 0.36, 1];

const occasions = [
  {
    number: "01",
    title: "Weddings",
    text: "Elegant catering crafted for celebrations that deserve to be remembered.",
    image:
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1400&q=90",
    details:
      "From intimate ceremonies to grand wedding celebrations, our team creates a beautifully curated dining experience for your guests.",
    highlights: [
      "Custom wedding menus",
      "Live food counters",
      "Premium presentation",
      "Dedicated service team",
    ],
  },
  {
    number: "02",
    title: "Corporate Events",
    text: "Professional menus and seamless service for meetings, launches and gatherings.",
    image:
      "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1400&q=90",
    details:
      "Make your corporate gathering memorable with refined menus, professional service and a dining setup designed around your event.",
    highlights: [
      "Business lunch & dinner",
      "Conference catering",
      "Product launches",
      "Professional service",
    ],
  },
  {
    number: "03",
    title: "Private Parties",
    text: "Bring the Atulyam experience home for birthdays, anniversaries and special evenings.",
    image:
      "https://images.unsplash.com/photo-1519671282429-b44660ead0a7?auto=format&fit=crop&w=1400&q=90",
    details:
      "Celebrate your special moments with food that feels personal, beautifully presented and prepared around your guests.",
    highlights: [
      "Birthday celebrations",
      "Anniversaries",
      "Family gatherings",
      "Custom menus",
    ],
  },
];

const packages = [
  {
    name: "Essential",
    description: "A refined menu for intimate gatherings.",
    items: [
      "Curated vegetarian menu",
      "Starters & main course",
      "Professional service",
      "Elegant presentation",
    ],
  },
  {
    name: "Signature",
    description: "Our most balanced catering experience.",
    featured: true,
    items: [
      "Premium curated menu",
      "Starters, mains & desserts",
      "Live food counters",
      "Professional service team",
      "Custom menu consultation",
    ],
  },
  {
    name: "Grand",
    description: "A complete dining experience for larger celebrations.",
    items: [
      "Fully customised menu",
      "Premium starters & mains",
      "Dessert selection",
      "Live counters",
      "Dedicated service team",
      "Event-specific presentation",
    ],
  },
];

const process = [
  {
    number: "01",
    title: "Tell us your occasion",
    text: "Share your event, guest count, venue and the kind of experience you have in mind.",
  },
  {
    number: "02",
    title: "Build your menu",
    text: "Our team helps you create a menu that fits your event, preferences and budget.",
  },
  {
    number: "03",
    title: "We take care of the rest",
    text: "From preparation to presentation and service, we make sure everything feels effortless.",
  },
];

export default function CateringPage() {
  const [selectedOccasion, setSelectedOccasion] = useState(null);
const navigate = useNavigate();
  const openOccasion = (occasion) => {
    setSelectedOccasion(occasion);
  };

  const closeOccasion = () => {
    setSelectedOccasion(null);
  };

  const planEvent = () => {
    setSelectedOccasion(null);

    setTimeout(() => {
      document
        .getElementById("catering-contact")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  return (
    <div className="bg-black text-white overflow-hidden">
      {/* =====================================================
          HERO
      ===================================================== */}
      <section
        id="catering-hero"
        className="relative min-h-[88vh] mt-[80px] overflow-hidden"
      >
        <motion.div
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease }}
          className="absolute inset-0"
        >
          <img
            src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=2200&q=90"
            alt="Atulyam catering"
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-black/65" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-black/20" />
        </motion.div>

        <div className="relative z-10 min-h-[88vh] max-w-[1400px] mx-auto px-6 md:px-10 flex flex-col justify-center pt-18 md:pt-18">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease }}
            className="flex items-center gap-4 mb-7"
          >
            <span className="w-14 h-px bg-[#f28a2e]" />

            <span className="text-white/50 text-[10px] uppercase tracking-[0.3em]">
              Atulyam Catering
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1, ease }}
            className="font-serif text-[16vw] md:text-[9vw] leading-[0.8] tracking-[-0.06em] max-w-6xl"
          >
            Gatherings
            <br />
            <span className="italic text-[#f28a2e]">worth sharing.</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="mt-8 flex flex-col md:flex-row md:items-end justify-between gap-6"
          >
            <p className="text-white/65 text-sm md:text-base leading-7 max-w-md">
              From intimate celebrations to grand occasions, bring the
              Atulyam dining experience to your event.
            </p>

            <a
              href="#catering-contact"
              className="group inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.25em] text-white"
            >
              Plan Your Event
              <span className="w-10 h-10 rounded-full border border-white/25 flex items-center justify-center group-hover:bg-[#f28a2e] group-hover:border-[#f28a2e] transition-all duration-300">
                <ArrowUpRight size={15} />
              </span>
            </a>
          </motion.div>
        </div>
      </section>

      {/* =====================================================
          INTRO
      ===================================================== */}
      <section
        id="catering-intro"
        className="relative max-w-[1400px] mx-auto px-6 md:px-10 py-24 md:py-32"
      >
        <div className="border-t border-white/10 pt-8 md:pt-10">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease }}
            className="flex items-center justify-between mb-14 md:mb-20"
          >
            <div className="flex items-center gap-4">
              <span className="w-12 h-px bg-[#f28a2e]" />

              <span className="text-white/35 text-[9px] uppercase tracking-[0.3em]">
                Made For Moments
              </span>
            </div>

            <span className="hidden md:block text-white/20 text-[9px] uppercase tracking-[0.25em]">
              Catering · Hospitality · Experience
            </span>
          </motion.div>

          <div className="grid md:grid-cols-12 gap-12 md:gap-16 items-end">
            <motion.div
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease }}
              className="md:col-span-8"
            >
              <p className="text-[#f28a2e] text-[10px] uppercase tracking-[0.3em] mb-6">
                The Atulyam Experience
              </p>

              <h2 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-[7vw] leading-[0.84] tracking-[-0.06em]">
                Great events
                <br />
                deserve
                <br />
                <span className="italic text-[#f28a2e]">
                  great food.
                </span>
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 25 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.15, ease }}
              className="md:col-span-4 md:pb-2"
            >
              <div className="border-l border-[#f28a2e]/50 pl-6 md:pl-8">
                <p className="font-serif text-xl md:text-2xl leading-8 text-white/85">
                  Thoughtfully prepared food, warm hospitality and a table made
                  for your people.
                </p>

                <div className="w-10 h-px bg-[#f28a2e]/60 my-7" />

                <p className="text-white/40 text-sm leading-7 max-w-md">
                  From intimate celebrations to larger gatherings, Atulyam
                  brings the restaurant experience to your special occasion —
                  beautifully prepared and effortlessly served.
                </p>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2, ease }}
            className="mt-16 md:mt-24 pt-6 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {[
              ["01", "Freshly Prepared"],
              ["02", "Custom Menus"],
              ["03", "Warm Service"],
              ["04", "Memorable Events"],
            ].map(([number, label]) => (
              <div key={number}>
                <span className="block text-[#f28a2e] font-serif text-2xl">
                  {number}
                </span>
                <span className="block mt-2 text-white/30 text-[9px] uppercase tracking-[0.25em]">
                  {label}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* =====================================================
          OCCASIONS
      ===================================================== */}
      <section id="catering-occasions" className="border-t border-white/10">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-20 md:py-28">
          <div className="flex items-end justify-between mb-12 md:mb-16">
            <div>
              <span className="text-[#f28a2e] text-[10px] uppercase tracking-[0.3em]">
                Catering For
              </span>

              <h2 className="font-serif text-4xl md:text-6xl tracking-[-0.04em] mt-4">
                Every occasion.
              </h2>
            </div>

            <span className="hidden md:block text-white/25 text-[9px] uppercase tracking-[0.25em]">
              03 / Occasions
            </span>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
           {occasions.map((item, index) => {
  const occasionSlug = item.title
    .toLowerCase()
    .replace(/\s+/g, "-");

  return (
    <motion.div
      key={item.number}
      onClick={() => navigate(`/catering/${occasionSlug}`)}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: 0.7,
        delay: index * 0.1,
      }}
      className="group relative h-[520px] md:h-[600px] overflow-hidden cursor-pointer"
    >
      <img
        src={item.image}
        alt={item.title}
        className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/10" />

      <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-between">

        <div className="flex items-start justify-between">
          <span className="text-[#f28a2e] font-serif italic text-xl">
            {item.number}
          </span>

          <span className="w-11 h-11 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-[#f28a2e] group-hover:border-[#f28a2e] group-hover:text-black transition-all duration-500">
            <ArrowUpRight size={18} />
          </span>
        </div>

        <div>
          <h3 className="font-serif text-3xl md:text-4xl lg:text-5xl">
            {item.title}
          </h3>

          <p className="text-white/60 text-sm leading-6 max-w-sm mt-4">
            {item.text}
          </p>

          <div className="mt-6 flex items-center gap-3 text-[#f28a2e] text-[9px] uppercase tracking-[0.25em]">
            <span className="w-8 h-px bg-[#f28a2e]" />
            Explore
          </div>
        </div>

      </div>
    </motion.div>
  );
})}
          </div>
        </div>
      </section>

      {/* =====================================================
          PACKAGES
      ===================================================== */}
      <section
        id="catering-packages"
        className="bg-[#0b0b0b] border-y border-white/10"
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-16 md:py-20">
          <div className="grid md:grid-cols-12 gap-8 md:gap-16 items-end mb-12 md:mb-14">
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease }}
              className="md:col-span-7"
            >
              <span className="text-white/35 text-[9px] uppercase tracking-[0.3em]">
                Catering Packages
              </span>

              <h2 className="font-serif text-5xl md:text-6xl lg:text-[5.5vw] leading-[0.86] tracking-[-0.055em] mt-4">
                Choose your
                <br />
                <span className="italic text-[#f28a2e]">experience.</span>
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1, ease }}
              className="md:col-span-5 md:pb-1"
            >
              <div className="border-l border-white/15 pl-6 md:pl-8">
                <p className="text-white/50 text-sm md:text-[15px] leading-7 max-w-md">
                  Thoughtfully designed catering options for intimate
                  gatherings, celebrations and events of every size.
                </p>
              </div>
            </motion.div>
          </div>

          <div className="grid lg:grid-cols-3 gap-4">
            {packages.map((pkg, index) => (
              <motion.div
                key={pkg.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.7,
                  delay: index * 0.1,
                  ease,
                }}
                className={`relative p-7 md:p-9 border ${
                  pkg.featured
                    ? "border-[#f28a2e]/60 bg-[#111111]"
                    : "border-white/10 bg-black"
                }`}
              >
                {pkg.featured && (
                  <div className="absolute top-0 right-0 px-4 py-2 bg-[#f28a2e] text-black text-[8px] uppercase tracking-[0.25em]">
                    Recommended
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-white/25 font-serif italic">
                    0{index + 1}
                  </span>

                  <UtensilsCrossed
                    size={18}
                    className="text-[#f28a2e]"
                  />
                </div>

                <h3 className="font-serif text-4xl mt-12 tracking-[-0.04em]">
                  {pkg.name}
                </h3>

                <p className="text-white/40 text-sm leading-6 mt-3 min-h-[48px]">
                  {pkg.description}
                </p>

                <div className="w-full h-px bg-white/10 my-8" />

                <div className="space-y-4">
                  {pkg.items.map((item) => (
                    <div
                      key={item}
                      className="flex items-start gap-3 text-sm text-white/65"
                    >
                      <Check
                        size={14}
                        className="text-[#f28a2e] mt-0.5 shrink-0"
                      />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() =>
                    document
                      .getElementById("catering-contact")
                      ?.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      })
                  }
                  className="mt-10 w-full flex items-center justify-between border-t border-white/10 pt-5 text-[9px] uppercase tracking-[0.25em] text-white/50 hover:text-white transition-colors"
                >
                  Enquire About This
                  <ArrowUpRight size={15} />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          PROCESS
      ===================================================== */}
      <section
        id="catering-process"
        className="bg-black border-t border-white/10"
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease }}
            className="grid md:grid-cols-12 gap-8 md:gap-16 items-end mb-14 md:mb-20"
          >
            <div className="md:col-span-8">
              <span className="text-white/35 text-[9px] uppercase tracking-[0.3em]">
                How It Works
              </span>

              <h2 className="font-serif text-5xl md:text-6xl lg:text-[6vw] leading-[0.85] tracking-[-0.055em] mt-4">
                Simple from
                <br />
                <span className="italic text-[#f28a2e]">
                  start to finish.
                </span>
              </h2>
            </div>

            <div className="md:col-span-4">
              <p className="text-white/45 text-sm md:text-[15px] leading-7 max-w-md md:ml-auto">
                Planning your event should feel effortless. We take care of
                the food, service and details while you enjoy the occasion.
              </p>
            </div>
          </motion.div>

          <div className="border-t border-white/10">
            {process.map((item, index) => (
              <motion.div
                key={item.number}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.7,
                  delay: index * 0.12,
                  ease,
                }}
                className="group border-b border-white/10 py-8 md:py-10"
              >
                <div className="grid grid-cols-12 gap-5 md:gap-10 items-center">
                  <div className="col-span-2 md:col-span-2">
                    <span className="font-serif italic text-[#f28a2e] text-2xl md:text-3xl">
                      {item.number}
                    </span>
                  </div>

                  <div className="col-span-8 md:col-span-4">
                    <h3 className="font-serif text-2xl md:text-3xl lg:text-4xl tracking-[-0.035em] group-hover:text-[#f28a2e] transition-colors duration-300">
                      {item.title}
                    </h3>
                  </div>

                  <div className="col-span-12 md:col-span-5 md:col-start-8 mt-2 md:mt-0">
                    <p className="text-white/40 text-sm md:text-[15px] leading-7 max-w-lg">
                      {item.text}
                    </p>
                  </div>

                  <div className="hidden md:flex col-span-1 justify-end">
                    <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:border-[#f28a2e] group-hover:bg-[#f28a2e] group-hover:text-black transition-all duration-300">
                      <ArrowUpRight
                        size={16}
                        className="group-hover:rotate-45 transition-transform duration-300"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-6"
          >
            <span className="text-white/20 text-[9px] uppercase tracking-[0.28em]">
              From planning to plating
            </span>

            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-[#f28a2e]" />
              <span className="text-white/25 text-[9px] uppercase tracking-[0.25em]">
                Atulyam Catering
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* =====================================================
          CINEMATIC STATEMENT
      ===================================================== */}
      <section
        id="catering-statement"
        className="relative overflow-hidden border-y border-white/10"
      >
        <motion.div
          initial={{ scale: 1.08 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease }}
          className="absolute inset-0"
        >
          <img
            src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=2200&q=90"
            alt="Beautiful dining table"
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-black/75" />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-black/25" />
        </motion.div>

        <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10 py-28 md:py-40">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease }}
            className="max-w-5xl"
          >
            <span className="text-[#f28a2e] font-serif italic text-lg">
              Made to be remembered
            </span>

            <h2 className="font-serif text-5xl md:text-7xl lg:text-[7vw] leading-[0.95] tracking-[-0.055em] mt-6">
              You bring the
              <br />
              <span className="italic text-[#f28a2e]">people.</span>
              <br />
              We bring the food.
            </h2>
          </motion.div>
        </div>
      </section>

      {/* =====================================================
          FINAL CTA
      ===================================================== */}
      <section
        id="catering-contact"
        className="max-w-[1400px] mx-auto px-6 md:px-10 py-14 md:py-16"
      >
        <div className="border-t border-white/10 pt-10 md:pt-14">
          <div className="grid md:grid-cols-12 gap-10 md:gap-16">
            <div className="md:col-span-7">
              <span className="text-[#f28a2e] text-[10px] uppercase tracking-[0.3em]">
                Let's Plan It
              </span>

              <h2 className="font-serif text-5xl md:text-7xl lg:text-[7vw] leading-[0.84] tracking-[-0.055em] mt-7">
                Your occasion.
                <br />
                <span className="italic text-[#f28a2e]">
                  Our kitchen.
                </span>
              </h2>
            </div>

            <div className="md:col-span-5 md:flex md:flex-col md:justify-end">
              <p className="text-white/45 text-sm md:text-base leading-7 max-w-md">
                Tell us about your event and our team will help you create
                the right menu and experience for your guests.
              </p>

              <a
                href="tel:+919451234567"
                className="group mt-8 inline-flex items-center justify-between border border-white/15 hover:border-[#f28a2e]/60 px-5 py-4 max-w-md transition-all duration-300"
              >
                <span className="text-[10px] uppercase tracking-[0.25em]">
                  Enquire Now
                </span>

                <span className="w-9 h-9 rounded-full bg-[#f28a2e] text-black flex items-center justify-center group-hover:rotate-45 transition-transform duration-300">
                  <ArrowUpRight size={15} />
                </span>
              </a>

              <div className="mt-8 flex items-center gap-3">
                <ChefHat size={16} className="text-[#f28a2e]" />

                <span className="text-white/30 text-[9px] uppercase tracking-[0.25em]">
                  Atulyam Restaurant · Prayagraj
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          OCCASION MODAL
      ===================================================== */}
      <AnimatePresence>
        {selectedOccasion && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
            onClick={closeOccasion}
          >
            <motion.div
              initial={{ opacity: 0, y: 35, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 25, scale: 0.97 }}
              transition={{ duration: 0.4, ease }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-[#0b0b0b] border border-white/10"
            >
              {/* Close */}
              <button
                type="button"
                onClick={closeOccasion}
                aria-label="Close"
                className="absolute z-20 top-4 right-4 w-10 h-10 rounded-full border border-white/20 bg-black/60 backdrop-blur-sm flex items-center justify-center hover:bg-[#f28a2e] hover:text-black hover:border-[#f28a2e] transition-all"
              >
                <X size={17} />
              </button>

              <div className="grid md:grid-cols-2">
                {/* Image */}
                <div className="relative h-[300px] md:h-[620px]">
                  <img
                    src={selectedOccasion.image}
                    alt={selectedOccasion.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />

                  <div className="absolute bottom-6 left-6 md:left-8">
                    <span className="text-[#f28a2e] font-serif italic text-lg">
                      {selectedOccasion.number}
                    </span>

                    <h3 className="font-serif text-4xl md:text-5xl mt-2">
                      {selectedOccasion.title}
                    </h3>
                  </div>
                </div>

                {/* Content */}
                <div className="p-7 md:p-10 lg:p-12 flex flex-col justify-center">
                  <span className="text-[#f28a2e] text-[9px] uppercase tracking-[0.3em]">
                    Atulyam Catering
                  </span>

                  <h4 className="font-serif text-3xl md:text-4xl mt-5 tracking-[-0.04em]">
                    Made for your{" "}
                    <span className="italic text-[#f28a2e]">
                      moment.
                    </span>
                  </h4>

                  <p className="text-white/50 text-sm leading-7 mt-6">
                    {selectedOccasion.details}
                  </p>

                  <div className="border-t border-white/10 mt-8 pt-7">
                    <span className="text-white/30 text-[9px] uppercase tracking-[0.25em]">
                      What's included
                    </span>

                    <div className="mt-5 space-y-4">
                      {selectedOccasion.highlights.map((highlight) => (
                        <div
                          key={highlight}
                          className="flex items-center gap-3"
                        >
                          <span className="w-7 h-7 rounded-full border border-[#f28a2e]/40 flex items-center justify-center shrink-0">
                            <Check
                              size={13}
                              className="text-[#f28a2e]"
                            />
                          </span>

                          <span className="text-sm text-white/65">
                            {highlight}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-9">
                    <div className="border border-white/10 p-4">
                      <Users
                        size={17}
                        className="text-[#f28a2e] mb-3"
                      />
                      <span className="block text-white/30 text-[8px] uppercase tracking-[0.2em]">
                        Guest Count
                      </span>
                      <span className="block text-white/70 text-sm mt-1">
                        Flexible
                      </span>
                    </div>

                    <div className="border border-white/10 p-4">
                      <CalendarDays
                        size={17}
                        className="text-[#f28a2e] mb-3"
                      />
                      <span className="block text-white/30 text-[8px] uppercase tracking-[0.2em]">
                        Event Type
                      </span>
                      <span className="block text-white/70 text-sm mt-1">
                        {selectedOccasion.title}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={planEvent}
                    className="group mt-8 w-full flex items-center justify-between bg-[#f28a2e] text-black px-5 py-4 hover:bg-white transition-colors duration-300"
                  >
                    <span className="text-[9px] uppercase tracking-[0.25em]">
                      Plan This Event
                    </span>

                    <ArrowUpRight
                      size={17}
                      className="group-hover:rotate-45 transition-transform"
                    />
                  </button>

                  <a
                    href="tel:+919451234567"
                    className="mt-3 w-full flex items-center justify-between border border-white/10 px-5 py-4 text-white/50 hover:text-white hover:border-white/25 transition-colors"
                  >
                    <span className="text-[9px] uppercase tracking-[0.25em]">
                      Call for enquiry
                    </span>

                    <ArrowUpRight size={16} />
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}