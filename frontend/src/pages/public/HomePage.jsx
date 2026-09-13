import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  MapPin,
} from 'lucide-react';

const SLIDE_DURATION = 4000;

const slides = [
  {
    image:
      'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=2200&q=90',
    eyebrow: 'ATULYAM RESTAURANT',
    title: 'Where every meal',
    accent: 'becomes a memory.',
    description:
      'A celebration of authentic Indian flavours, warm hospitality and moments worth sharing.',
  },
  {
    image:
      'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=2200&q=90',
    eyebrow: 'THE ART OF INDIAN FLAVOUR',
    title: 'Tradition,',
    accent: 'served beautifully.',
    description:
      'Rich spices, time-honoured recipes and a contemporary dining experience come together at Atulyam.',
  },
  {
    image:
      'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=2200&q=90',
    eyebrow: 'MADE FOR GATHERING',
    title: 'Good food.',
    accent: 'Better company.',
    description:
      'From intimate dinners to grand celebrations, every table has a story waiting to unfold.',
  },
  {
    image:
      'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=2200&q=90',
    eyebrow: 'A TASTE OF ATULYAM',
    title: 'Flavours that',
    accent: 'bring people closer.',
    description:
      'Discover an experience shaped by food, family and the joy of coming together.',
  },
];

const signatureDishes = [
  {
    name: 'Signature Indian Flavours',
    category: 'FROM THE KITCHEN',
    image:
      'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=1400&q=85',
  },
  {
    name: 'A Table Worth Sharing',
    category: 'THE ATULYAM EXPERIENCE',
    image:
      'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1400&q=85',
  },
  {
    name: 'Crafted With Care',
    category: 'FRESH • AUTHENTIC • TIMELESS',
    image:
      'https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?auto=format&fit=crop&w=1400&q=85',
  },
];

const galleryImages = [
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1579684947550-22e945225d9a?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1200&q=85',
];

const ease = [0.22, 1, 0.36, 1];

export default function HomePage() {
  const [active, setActive] = useState(0);
  

  /*
   * HERO SLIDER ONLY
   * This is the only repeating animation on the page.
   * Other sections use one-time reveal animations.
   */
  useEffect(() => {
    const timer = setInterval(() => {
      setActive((current) => (current + 1) % slides.length);
    }, SLIDE_DURATION);

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setActive((current) => (current + 1) % slides.length);
  };

  const previousSlide = () => {
    setActive((current) => (current - 1 + slides.length) % slides.length);
  };

  return (
    <div className="bg-[#080706] text-white overflow-hidden">
{/* =========================================================
    HERO
========================================================= */}

<section className="relative h-[92vh] min-h-[680px] w-full overflow-hidden">

  <AnimatePresence initial={false} mode="sync">
    <motion.div
      key={active}
      className="absolute inset-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        duration: 1.15,
        ease: 'easeInOut',
      }}
    >

      {/* CINEMATIC IMAGE ZOOM */}
      <motion.img
        key={`hero-image-${active}`}
        src={slides[active].image}
        alt="Atulyam restaurant"
        className="absolute inset-0 h-full w-full object-cover"
        initial={{ scale: 1 }}
        animate={{ scale: 1.09 }}
        transition={{
          duration: SLIDE_DURATION / 1000,
          ease: 'linear',
        }}
      />

      {/* DARK OVERLAYS */}
      <div className="absolute inset-0 bg-black/35" />

      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/35 to-black/20" />

      <div className="absolute inset-0 bg-gradient-to-t from-[#080706] via-transparent to-black/20" />

      {/* SOFT ORANGE ATMOSPHERE */}
      <div className="absolute left-[-10%] top-[20%] h-[450px] w-[450px] rounded-full bg-orange-500/10 blur-[130px]" />

      {/* HERO CONTENT */}
      <div className="relative z-10 flex h-full items-center">
        <div className="mx-auto w-full max-w-[1400px] px-6 sm:px-10 lg:px-16">

          <motion.div
            key={`hero-content-${active}`}
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.9,
              delay: 0.25,
              ease,
            }}
            className="max-w-3xl"
          >

            <p className="mb-5 text-[11px] font-medium uppercase tracking-[0.4em] text-orange-400">
              {slides[active].eyebrow}
            </p>

            <h1 className="font-serif text-5xl leading-[0.95] tracking-[-0.03em] sm:text-7xl lg:text-[92px]">
              {slides[active].title}
              <br />

              <span className="italic text-orange-400">
                {slides[active].accent}
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-sm leading-7 text-white/70 sm:text-base">
              {slides[active].description}
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-4">

              <a
                href="/reservation"
                className="group inline-flex items-center gap-4 border border-orange-400 bg-orange-500 px-7 py-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-black transition-all duration-300 hover:bg-orange-400"
              >
                Reserve Your Table

                <ArrowUpRight
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                />
              </a>

              <a
                href="/menu"
                className="inline-flex items-center gap-3 border border-white/30 px-7 py-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-white transition-all duration-300 hover:border-orange-400 hover:text-orange-400"
              >
                Explore Menu
              </a>

            </div>
          </motion.div>

        </div>
      </div>

    </motion.div>
  </AnimatePresence>


  {/* SLIDER ARROWS ONLY */}
  <div className="absolute bottom-12 right-6 z-20 flex gap-2 sm:right-10 lg:right-16">

    <button
      onClick={previousSlide}
      aria-label="Previous slide"
      className="flex h-11 w-11 items-center justify-center border border-white/25 text-white transition-all duration-300 hover:border-orange-400 hover:text-orange-400"
    >
      <ArrowLeft size={17} />
    </button>

    <button
      onClick={nextSlide}
      aria-label="Next slide"
      className="flex h-11 w-11 items-center justify-center border border-white/25 text-white transition-all duration-300 hover:border-orange-400 hover:text-orange-400"
    >
      <ArrowRight size={17} />
    </button>

  </div>

<div className="absolute bottom-10 left-6 sm:left-10 lg:left-16 z-20">
  <p className="font-serif italic text-white/70 text-lg">
    Taste the Atulyam experience.
  </p>
</div>
  {/* SCROLL INDICATOR */}
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 1.2, duration: 1 }}
    className="absolute bottom-10 left-1/2 z-20 hidden -translate-x-1/2 flex-col items-center gap-3 md:flex"
  >

    <span className="text-[9px] uppercase tracking-[0.35em] text-white/50">
      Scroll
    </span>

    <motion.div
      animate={{ y: [0, 5, 0] }}
      transition={{
        duration: 1.8,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      <ArrowDown
        size={15}
        className="text-orange-400"
      />
    </motion.div>

  </motion.div>

</section>


      {/* =========================================================
          WHO WE ARE
      ========================================================== */}

      <section className="relative bg-[#090807] py-28 sm:py-36">
        <div className="mx-auto max-w-[1400px] px-6 sm:px-10 lg:px-16">

          <div className="grid items-center gap-16 lg:grid-cols-[1fr_0.9fr] lg:gap-24">

            {/* TEXT */}
            <motion.div
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.9, ease }}
              className="relative pl-8 sm:pl-12"
            >
              <div className="absolute left-0 top-0 h-full w-px bg-orange-500/70" />

              <p className="mb-6 text-[11px] uppercase tracking-[0.38em] text-orange-400">
                WHO WE ARE
              </p>

              <h2 className="font-serif text-5xl leading-[1.02] tracking-[-0.025em] sm:text-6xl lg:text-7xl">
                A love for{' '}
                <span className="italic text-orange-400">Indian food,</span>
                <br />
                served with heart.
              </h2>

              <p className="mt-8 max-w-xl text-base leading-8 text-white/55">
                Atulyam is built around a simple idea: great food should bring
                people closer. Our kitchen celebrates the depth of Indian
                flavours while our space is designed for unhurried
                conversations, celebrations and memorable evenings.
              </p>

              <a
                href="/about"
                className="group mt-9 inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-white transition-colors duration-300 hover:text-orange-400"
              >
                Discover Our Story
                <ArrowRight
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-x-2"
                />
              </a>
            </motion.div>


            {/* IMAGE COMPOSITION */}
            <motion.div
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 1,
                delay: 0.15,
                ease,
              }}
              className="relative min-h-[560px]"
            >
              {/* BIG IMAGE */}
              <div className="absolute right-0 top-0 h-[500px] w-[78%] overflow-hidden sm:h-[575px]">
                <motion.img
                  src="https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1400&q=90"
                  alt="Indian food at Atulyam"
                  className="h-full w-full object-cover"
                  whileHover={{ scale: 1.035 }}
                  transition={{ duration: 0.8, ease }}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />
              </div>

              {/* SMALL IMAGE */}
              <div className="absolute bottom-0 left-0 z-10 h-[250px] w-[55%] overflow-hidden border-[10px] border-[#090807] sm:h-[285px]">
                <motion.img
                  src="https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?auto=format&fit=crop&w=1000&q=90"
                  alt="Atulyam signature food"
                  className="h-full w-full object-cover"
                  whileHover={{ scale: 1.04 }}
                  transition={{ duration: 0.8, ease }}
                />
              </div>

              {/* LABEL */}
              <div className="absolute bottom-10 right-[-1px] z-20 bg-[#0b0a09] px-7 py-5 sm:px-8">
                <p className="font-serif text-xl sm:text-2xl">
                  Taste. Gather. Celebrate.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>


      {/* =========================================================
          SIGNATURE FLAVOURS
      ========================================================== */}

      <section className="bg-[#0d0b09] py-28 sm:py-36">
        <div className="mx-auto max-w-[1400px] px-6 sm:px-10 lg:px-16">

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease }}
            className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end"
          >
            <div>
              <p className="mb-4 text-[11px] uppercase tracking-[0.4em] text-orange-400">
                SIGNATURE FLAVOURS
              </p>

              <h2 className="font-serif text-5xl sm:text-6xl">
                Made to be{' '}
                <span className="italic text-orange-400">remembered.</span>
              </h2>
            </div>

            <a
              href="/menu"
              className="group flex items-center gap-3 text-[11px] uppercase tracking-[0.25em] text-white/70 transition-colors hover:text-orange-400"
            >
              View Full Menu
              <ArrowRight
                size={15}
                className="transition-transform duration-300 group-hover:translate-x-2"
              />
            </a>
          </motion.div>


          <div className="grid gap-5 md:grid-cols-3">
            {signatureDishes.map((dish, index) => (
              <motion.a
                href="/menu"
                key={dish.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{
                  duration: 0.8,
                  delay: index * 0.08,
                  ease,
                }}
                className="group relative block overflow-hidden"
              >
                <div className="aspect-[0.82] overflow-hidden">
                  <motion.img
                    src={dish.image}
                    alt={dish.name}
                    className="h-full w-full object-cover"
                    whileHover={{ scale: 1.06 }}
                    transition={{ duration: 0.9, ease }}
                  />
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-90" />

                <div className="absolute bottom-0 left-0 right-0 p-7">
                  <p className="mb-2 text-[9px] uppercase tracking-[0.3em] text-orange-400">
                    {dish.category}
                  </p>

                  <h3 className="font-serif text-2xl sm:text-3xl">
                    {dish.name}
                  </h3>

                  <div className="mt-4 flex items-center gap-2 text-xs text-white/60 transition-colors group-hover:text-orange-400">
                    Discover
                    <ArrowUpRight size={14} />
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>


      {/* =========================================================
          EXPERIENCE / OFFERS
      ========================================================== */}

      <section className="relative min-h-[650px] overflow-hidden">
        <motion.img
          src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=2200&q=90"
          alt="Atulyam dining experience"
          className="absolute inset-0 h-full w-full object-cover"
          initial={{ scale: 1.02 }}
          whileInView={{ scale: 1.05 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 2, ease }}
        />

        <div className="absolute inset-0 bg-black/65" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-black/30" />

        <div className="relative z-10 flex min-h-[650px] items-center">
          <div className="mx-auto w-full max-w-[1400px] px-6 sm:px-10 lg:px-16">

            <motion.div
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 1, ease }}
              className="max-w-2xl"
            >
              <p className="mb-6 text-[11px] uppercase tracking-[0.4em] text-orange-400">
                THE ATULYAM EXPERIENCE
              </p>

              <h2 className="font-serif text-5xl leading-[1] sm:text-7xl">
                More than a meal.
                <br />
                <span className="italic text-orange-400">
                  A moment to remember.
                </span>
              </h2>

              <p className="mt-7 max-w-xl text-base leading-8 text-white/65">
                Whether you're celebrating something special or simply
                enjoying an evening together, Atulyam brings food, atmosphere
                and hospitality together around one table.
              </p>

              <div className="mt-9 flex flex-wrap gap-4">
                <a
                  href="/offers"
                  className="inline-flex items-center gap-3 bg-orange-500 px-7 py-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-black transition-colors hover:bg-orange-400"
                >
                  View Offers
                  <ArrowUpRight size={16} />
                </a>

                <a
                  href="/catering"
                  className="inline-flex items-center gap-3 border border-white/30 px-7 py-4 text-[11px] font-semibold uppercase tracking-[0.22em] transition-colors hover:border-orange-400 hover:text-orange-400"
                >
                  Catering
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>


      {/* =========================================================
          GALLERY
      ========================================================== */}

      <section className="bg-[#090807] py-28 sm:py-36">
        <div className="mx-auto max-w-[1400px] px-6 sm:px-10 lg:px-16">

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease }}
            className="mb-14 text-center"
          >
            <p className="mb-4 text-[11px] uppercase tracking-[0.4em] text-orange-400">
              MOMENTS AT ATULYAM
            </p>

            <h2 className="font-serif text-5xl sm:text-6xl">
              Food. People.{' '}
              <span className="italic text-orange-400">Memories.</span>
            </h2>
          </motion.div>


          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {galleryImages.map((image, index) => (
              <motion.div
                key={image}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.12 }}
                transition={{
                  duration: 0.75,
                  delay: index * 0.05,
                  ease,
                }}
                className={`group relative overflow-hidden ${
                  index === 0
                    ? 'aspect-[1.15]'
                    : index === 1
                    ? 'aspect-[0.8]'
                    : index === 2
                    ? 'aspect-[1.15]'
                    : 'aspect-[0.8]'
                }`}
              >
                <motion.img
                  src={image}
                  alt={`Atulyam gallery ${index + 1}`}
                  className="h-full w-full object-cover"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.8, ease }}
                />

                <div className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/20" />
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <a
              href="/gallery"
              className="inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-white transition-colors hover:text-orange-400"
            >
              Explore Gallery
              <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </section>


      {/* =========================================================
          VISIT
      ========================================================== */}

      <section className="relative overflow-hidden border-t border-white/10 bg-[#0d0b09] py-28 sm:py-36">
        <div className="mx-auto max-w-[1200px] px-6 text-center sm:px-10">

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.9, ease }}
          >
            <MapPin
              size={22}
              className="mx-auto mb-6 text-orange-400"
              strokeWidth={1.5}
            />

            <p className="mb-5 text-[10px] uppercase tracking-[0.4em] text-orange-400">
              COME FIND US
            </p>

            <h2 className="font-serif text-5xl sm:text-6xl lg:text-7xl">
              Your table is{' '}
              <span className="italic text-orange-400">waiting.</span>
            </h2>

            <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-white/55">
              Visit Atulyam and experience Indian flavours, warm hospitality
              and memorable moments around the table.
            </p>

            <div className="mt-9 flex flex-wrap justify-center gap-4">
              <a
                href="/contact"
                className="inline-flex items-center gap-3 bg-orange-500 px-7 py-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-black transition-colors hover:bg-orange-400"
              >
                Visit Us
                <ArrowUpRight size={16} />
              </a>

              <a
                href="/order-online"
                className="inline-flex items-center gap-3 border border-white/25 px-7 py-4 text-[11px] font-semibold uppercase tracking-[0.22em] transition-colors hover:border-orange-400 hover:text-orange-400"
              >
                Order Online
              </a>
            </div>
          </motion.div>

        </div>
      </section>

    </div>
  );
}