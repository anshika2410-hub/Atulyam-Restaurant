import { motion } from 'framer-motion';
import CountUp from "react-countup";
import {
  ArrowDown,
  ArrowUpRight,
  ShieldCheck,
  Armchair,
  ChefHat,
  UsersRound,
} from 'lucide-react';

const ease = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 35 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.9,
      ease,
    },
  },
};

const fadeLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 1,
      ease,
    },
  },
};

const values = [
  {
    number: '01',
    title: 'Craft',
    text: 'Thoughtful ingredients, traditional recipes and carefully prepared dishes made with quality at heart.',
  },
  {
    number: '02',
    title: 'Hospitality',
    text: 'Warm service and a welcoming atmosphere where every guest is treated with genuine care.',
  },
  {
    number: '03',
    title: 'Togetherness',
    text: 'Because the best meals are the ones shared with family, friends and the people who matter.',
  },
];

const services = [
  {
    number: '01',
    title: 'Home Delivery',
    text: 'Enjoy Atulyam’s signature flavours delivered fresh, hot, and packed with care — comfort food made effortless.',
  },
  {
    number: '02',
    title: 'Elegant Dine-In',
    text: 'Relax in a warm, family-friendly ambience while we serve thoughtfully crafted dishes and heartfelt hospitality.',
  },
  {
    number: '03',
    title: 'Outdoor Catering',
    text: 'From family gatherings to festive celebrations, we bring Atulyam’s taste and quality straight to your special moments.',
  },
  {
    number: '04',
    title: 'Private Events',
    text: 'Host memorable occasions with customised menus, seamless service, and flavours that impress every guest.',
  },
];

const highlights = [
  {
    number: '01',
    title: 'Home-Style Hygiene',
    text: 'Careful preparation, quality ingredients and attention to cleanliness in every part of the dining experience.',
  },
  {
    number: '02',
    title: 'Warm Ambience',
    text: 'A comfortable and welcoming setting designed for relaxed meals, family gatherings and celebrations.',
  },
  {
    number: '03',
    title: 'Passionate Chefs',
    text: 'Our kitchen brings together experience, traditional flavours and a genuine passion for good food.',
  },
  {
    number: '04',
    title: 'Perfect for Gatherings',
    text: 'A place where birthdays, family dinners, celebrations and everyday meals become memorable moments.',
  },
];
const GOOGLE_REVIEWS_URL =
  "https://www.google.com/search?sca_esv=cebce586dd40d497&sxsrf=APpeQnu0SM_DVRantXrAnRb023gswA6Tbg:1789407645116&si=APenkKm7iecQ4G6P-TsbSMFKIQtv3EFIqRAFw-i8uEbk55Z-_5acoeeRzoTebjCSsaFQiCBZX_FNLbG6OyYY8H39rH3bpyc2dSmOSDld3qy-UtbctX3w47-XmtGNH2qiKcvxI7fiPFIWV3wCK-1_I9V4SGTsG1Pyrg%3D%3D&q=Atulyam+Restaurant+Reviews&sa=X&ved=2ahUKEwjImK74zu6WAxU7umMGHSFJDwsQ0bkNegQIQhAH&biw=1528&bih=732&dpr=1.25";
export default function AboutPage() {
  return (
    <main className="bg-[#070707] text-white overflow-hidden">

      {/* =========================================================
          HERO
      ========================================================= */}
      <section className="relative min-h-[calc(100vh-80px)] flex items-end overflow-hidden">

        <motion.img
          src="https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=2200&q=90"
          alt="Atulyam cuisine"
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ scale: 1.07 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.6, ease }}
        />

        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/45 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070707] via-transparent to-black/10" />

        <div className="relative z-10 w-full max-w-[1500px] mx-auto px-6 md:px-12 lg:px-20 pb-20 lg:pb-24">

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-[#f28a2e] uppercase tracking-[0.35em] text-xs md:text-sm mb-6"
            >
              Atulyam Restaurant · Since 2020
            </motion.p>

            <h1 className="font-serif font-light text-[62px] sm:text-[76px] md:text-[98px] lg:text-[116px] leading-[0.88] tracking-[-0.03em]">
              Food with a
              <br />
              <span className="italic text-[#f28a2e]">
                story to tell.
              </span>
            </h1>

            <p className="mt-8 max-w-[620px] text-white/70 text-[15px] md:text-[17px] leading-8">
              A family-owned restaurant built on love for food and
              togetherness, serving home-inspired flavours with heartfelt
              hospitality since 2020.
            </p>

          </motion.div>

          <motion.div
            className="hidden md:flex absolute right-10 lg:right-20 bottom-10 items-center gap-3 text-white/45"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            <span className="text-[9px] tracking-[0.4em] uppercase">
              Scroll to explore
            </span>

            <ArrowDown size={14} strokeWidth={1.2} />
          </motion.div>

        </div>
      </section>


      {/* =========================================================
          STORY INTRO
      ========================================================= */}
      <section className="relative pt-16 md:pt-20 lg:pt-24 pb-10 md:pb-12 lg:pb-14 px-6 md:px-12 lg:px-20">

        <div className="max-w-[1500px] mx-auto">

          <div className="grid lg:grid-cols-[220px_1fr] gap-12 lg:gap-20">

            {/* SECTION NUMBER */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeLeft}
              className="flex lg:flex-col justify-between lg:justify-start"
            >

              <div>
                <span className="text-[#f28a2e] text-[11px] tracking-[0.45em] uppercase">
                  Who We Are
                </span>

                <div className="mt-8 w-10 h-px bg-[#f28a2e]" />
              </div>

              <span className="hidden lg:block mt-32 text-white/20 text-7xl font-serif">
                01
              </span>

            </motion.div>


            {/* INTRO */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeUp}
            >

              <h2 className="font-serif font-light text-[48px] md:text-[68px] lg:text-[88px] leading-[0.95] tracking-[-0.025em] max-w-6xl">
                A family restaurant
                <br />
                built on <span className="italic text-[#f28a2e]">love.</span>
              </h2>

              <p className="font-serif italic text-[#f28a2e] text-[34px] md:text-[48px] lg:text-[58px] leading-none mt-3">
                Food, family & togetherness.
              </p>


              <div className="grid md:grid-cols-2 gap-8 md:gap-16 mt-14 max-w-5xl">

                <p className="text-white/55 text-[15px] md:text-[17px] leading-8">
                  Atulyam was created with a simple belief — food has the
                  power to bring people closer. We create comforting,
                  wholesome meals inspired by the flavours of home and
                  prepared with quality ingredients.
                </p>

                <p className="text-white/55 text-[15px] md:text-[17px] leading-8">
                  Since 2020, our aim has been to create a place where
                  families gather, friends reconnect and celebrations unfold
                  around delicious food and genuine hospitality.
                </p>

              </div>

            </motion.div>

          </div>


          {/* =====================================================
              IMAGE COMPOSITION
          ===================================================== */}
         <div className="relative mt-8 md:mt-10 lg:mt-12">

            <div className="max-w-[1320px] mx-auto">

              {/* DESKTOP */}
              <div className="hidden md:grid grid-cols-12 grid-rows-[280px_280px] gap-3">

                {/* IMAGE 01 */}
                <motion.div
                  className="col-span-5 row-span-2 overflow-hidden"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.9, ease }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1200&q=90"
                    alt="Atulyam dining experience"
                    className="w-full h-full object-cover transition-transform duration-[1800ms] hover:scale-[1.04]"
                  />
                </motion.div>


                {/* IMAGE 02 */}
                <motion.div
                  className="col-span-7 row-span-1 overflow-hidden"
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.9, delay: 0.1, ease }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1800&q=90"
                    alt="Indian cuisine at Atulyam"
                    className="w-full h-full object-cover transition-transform duration-[1800ms] hover:scale-[1.04]"
                  />
                </motion.div>


                {/* IMAGE 03 */}
                <motion.div
                  className="col-span-3 row-span-1 overflow-hidden"
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.8, delay: 0.18, ease }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=90"
                    alt="Indian dish"
                    className="w-full h-full object-cover transition-transform duration-[1600ms] hover:scale-[1.05]"
                  />
                </motion.div>


                {/* IMAGE 04 */}
                <motion.div
                  className="col-span-4 row-span-1 overflow-hidden"
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.8, delay: 0.25, ease }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=90"
                    alt="Atulyam restaurant interior"
                    className="w-full h-full object-cover transition-transform duration-[1600ms] hover:scale-[1.05]"
                  />
                </motion.div>

              </div>


              {/* MOBILE */}
              <div className="md:hidden space-y-2">

                <motion.div
                  className="h-[330px] overflow-hidden"
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1200&q=90"
                    alt="Atulyam dining experience"
                    className="w-full h-full object-cover"
                  />
                </motion.div>


                <div className="grid grid-cols-2 gap-3">

                  <motion.div
                    className="h-[210px] overflow-hidden"
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                  >
                    <img
                      src="https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1200&q=90"
                      alt="Indian cuisine"
                      className="w-full h-full object-cover"
                    />
                  </motion.div>

                  <motion.div
                    className="h-[210px] overflow-hidden"
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                  >
                    <img
                      src="https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=90"
                      alt="Indian dish"
                      className="w-full h-full object-cover"
                    />
                  </motion.div>

                </div>


                <motion.div
                  className="h-[230px] overflow-hidden"
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1400&q=90"
                    alt="Atulyam restaurant interior"
                    className="w-full h-full object-cover"
                  />
                </motion.div>

              </div>


              {/* CAPTION */}
              <div className="flex items-center justify-between mt-5">

                <div className="flex items-center gap-4">

                  <span className="w-10 h-px bg-[#f28a2e]" />

                  <span className="text-[#f28a2e] text-[9px] tracking-[0.45em] uppercase">
                    A Taste of Atulyam
                  </span>

                </div>

                <span className="hidden md:block text-white/25 text-[9px] tracking-[0.4em] uppercase">
                  Food · People · Moments
                </span>

              </div>

            </div>

          </div>

        </div>
      </section>


      {/* =========================================================
          MISSION & VISION
      ========================================================= */}
      <section className="relative bg-[#070707] py-16 md:py-20 lg:py-24 px-6 md:px-12 lg:px-20 overflow-hidden">

        <div className="max-w-[1500px] mx-auto">

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            variants={fadeUp}
          >

            <p className="text-[#f28a2e] text-[11px] tracking-[0.45em] uppercase mb-7">
              Our Purpose
            </p>

            <h2 className="font-serif font-light text-[50px] md:text-[72px] lg:text-[86px] leading-[0.92]">
              What we believe
              <br />
              <span className="italic text-[#f28a2e]">
                in.
              </span>
            </h2>

          </motion.div>

<div className="grid lg:grid-cols-2 gap-6 lg:gap-8 mt-10 md:mt-12">

            {/* MISSION */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease }}
              className="border border-white/10 p-8 md:p-12 min-h-[380px] flex flex-col justify-between"
            >

              <div className="flex items-center justify-between">

                <span className="text-[#f28a2e] text-[10px] tracking-[0.4em] uppercase">
                  Our Mission
                </span>

                <span className="text-white/15 font-serif text-6xl">
                  01
                </span>

              </div>

              <div>

                <h3 className="font-serif font-light text-[42px] md:text-[56px] leading-none mb-7">
                  Food made
                  <br />
                  with <span className="italic text-[#f28a2e]">care.</span>
                </h3>

                <p className="text-white/50 text-[15px] md:text-[16px] leading-8 max-w-xl">
                  To create comforting, wholesome meals using quality
                  ingredients and traditional recipes, while offering warm
                  service that makes every guest feel like family.
                </p>

              </div>

            </motion.div>


            {/* VISION */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1, ease }}
              className="border border-[#f28a2e]/25 bg-[#0e0c0a] p-8 md:p-12 min-h-[380px] flex flex-col justify-between"
            >

              <div className="flex items-center justify-between">

                <span className="text-[#f28a2e] text-[10px] tracking-[0.4em] uppercase">
                  Our Vision
                </span>

                <span className="text-white/15 font-serif text-6xl">
                  02
                </span>

              </div>

              <div>

                <h3 className="font-serif font-light text-[42px] md:text-[56px] leading-none mb-7">
                  A place to
                  <br />
                  <span className="italic text-[#f28a2e]">
                    belong.
                  </span>
                </h3>

                <p className="text-white/50 text-[15px] md:text-[16px] leading-8 max-w-xl">
                  To become a beloved neighborhood destination where families
                  gather, celebrations unfold, and every visit feels special
                  through incomparable taste and genuine care.
                </p>

              </div>

            </motion.div>

          </div>

        </div>
      </section>

{/* =========================================================
    ATULYAM — STATS
========================================================= */}
<section className="relative bg-[#070707] px-5 md:px-10 lg:px-16 py-20 md:py-24 lg:py-28 overflow-hidden">

  <div className="max-w-[1450px] mx-auto">

    {/* top divider */}
    <div className="w-full h-px bg-white/[0.10] mb-16 md:mb-20" />

    <div className="grid grid-cols-2 lg:grid-cols-4">

      {[
        {
          value: 800,
          suffix: "+",
          label: "Happy Families Served",
        },
        {
          value: 150,
          suffix: "+",
          label: "Signature Dishes",
        },
        {
          value: 20,
          suffix: "+",
          label: "Dedicated Chefs",
        },
        {
          value: 5,
          suffix: "+",
          label: "Years Of Trust",
        },
      ].map((stat, index) => (

        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            duration: 0.7,
            delay: index * 0.1,
            ease,
          }}
          className={`
            relative flex flex-col items-center justify-center text-center
            px-5 py-8 md:py-10
            ${index < 3 ? "lg:border-r lg:border-white/[0.08]" : ""}
            ${index % 2 === 0 ? "border-r border-white/[0.08] lg:border-r" : ""}
            ${index < 2 ? "border-b border-white/[0.08] lg:border-b-0" : ""}
          `}
        >

          {/* NUMBER */}
          <div className="font-serif font-light text-white text-[52px] sm:text-[62px] md:text-[72px] lg:text-[76px] xl:text-[82px] leading-none tracking-[-0.03em]">

            <CountUp
              end={stat.value}
              duration={2.2}
              enableScrollSpy
              scrollSpyOnce
            />

            <span className="text-[#f28a2e]">
              {stat.suffix}
            </span>

          </div>

          {/* ORANGE LINE */}
          <div className="w-8 h-px bg-[#f28a2e]/70 mt-6 mb-4" />

          {/* LABEL */}
          <p className="max-w-[170px] text-[#f28a2e] text-[9px] md:text-[10px] uppercase tracking-[0.35em] leading-5">
            {stat.label}
          </p>

        </motion.div>

      ))}

    </div>

  </div>

</section>
{/* =========================================================
    OUR SERVICES — CLEAN PREMIUM LAYOUT
========================================================= */}
<section className="relative bg-[#070707] py-20 md:py-24 lg:py-28 px-5 md:px-10 lg:px-16 overflow-hidden">

  <div className="relative max-w-[1450px] mx-auto">

    {/* ================= HEADER ================= */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease }}
      className="text-center mb-14 md:mb-16"
    >

      <span className="text-[#f28a2e] text-[10px] md:text-[11px] tracking-[0.5em] uppercase">
        Our Services
      </span>

      {/* decorative divider */}
      <div className="relative mx-auto mt-4 w-[120px] h-[16px]">

        <span className="absolute left-0 top-1/2 w-8 h-px bg-[#f28a2e]" />
        <span className="absolute right-0 top-1/2 w-8 h-px bg-[#f28a2e]" />

        <span className="absolute left-[34px] top-1/2 -translate-y-1/2 w-[8px] h-[8px] border border-[#f28a2e] rotate-45" />
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[9px] h-[9px] border border-[#f28a2e] rotate-45" />
        <span className="absolute right-[34px] top-1/2 -translate-y-1/2 w-[8px] h-[8px] border border-[#f28a2e] rotate-45" />

        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[5px] h-[5px] rounded-full bg-[#f28a2e]" />
        <span className="absolute right-0 top-1/2 -translate-y-1/2 w-[5px] h-[5px] rounded-full bg-[#f28a2e]" />

      </div>

      <h2 className="mt-7 font-serif font-light text-white text-[42px] sm:text-[52px] md:text-[65px] lg:text-[76px] leading-[0.95] tracking-[-0.025em]">
        Crafted Experiences
        <br className="hidden sm:block" />
        <span className="italic text-[#f28a2e]">
          Beyond Dining
        </span>
      </h2>

    </motion.div>


    {/* =====================================================
        MAIN SERVICES GRID
    ===================================================== */}
    <div className="hidden lg:grid grid-cols-[1fr_430px_1fr] grid-rows-[230px_230px] gap-x-16 xl:gap-x-24 max-w-[1280px] mx-auto items-center">

      {/* ================= LEFT TOP ================= */}
      <motion.div
        initial={{ opacity: 0, x: -25 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease }}
        className="flex items-center justify-end gap-7"
      >

        <div className="text-right max-w-[310px]">

          <span className="text-[#f28a2e] text-[9px] tracking-[0.35em]">
            01
          </span>

          <h3 className="mt-2 font-serif text-white text-[28px] xl:text-[31px] font-light">
            Home Delivery
          </h3>

          <p className="mt-3 text-white/40 text-[13px] leading-6">
            Enjoy Atulyam’s signature flavours delivered fresh,
            hot, and packed with care — comfort food made effortless.
          </p>

        </div>

        <div className="w-[66px] h-[66px] shrink-0 rounded-full border border-[#f28a2e]/30 flex items-center justify-center bg-[#0b0b0b]">
          <span className="text-[#f28a2e] text-xl">
            ⌁
          </span>
        </div>

      </motion.div>


      {/* ================= CENTER IMAGE ================= */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease }}
        className="row-span-2 row-start-1 col-start-2 relative flex items-center justify-center h-[460px]"
      >

        {/* decorative pattern */}
        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[150px] opacity-25 pointer-events-none">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "repeating-linear-gradient(135deg, transparent 0px, transparent 8px, rgba(242,138,46,0.55) 9px, transparent 10px, transparent 18px)",
            }}
          />
        </div>

        {/* image circle */}
        <div className="relative w-[360px] h-[360px] xl:w-[390px] xl:h-[390px]">

          <div className="absolute inset-[-10px] rounded-full border border-[#f28a2e]/20" />

          <div className="absolute inset-[-4px] rounded-full border border-white/[0.06]" />

          <div className="relative w-full h-full rounded-full overflow-hidden border border-white/10">

            <img
              src="https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1000&q=90"
              alt="Atulyam cuisine"
              className="w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-black/10" />

          </div>

          {/* small bottom badge */}
          <div className="absolute left-1/2 -translate-x-1/2 -bottom-5 w-14 h-14 rounded-full bg-[#070707] border border-[#f28a2e]/40 flex items-center justify-center">
            <span className="font-serif italic text-[#f28a2e] text-lg">
              A
            </span>
          </div>

        </div>

      </motion.div>


      {/* ================= RIGHT TOP ================= */}
      <motion.div
        initial={{ opacity: 0, x: 25 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease }}
        className="flex items-center justify-start gap-7"
      >

        <div className="w-[66px] h-[66px] shrink-0 rounded-full border border-[#f28a2e]/30 flex items-center justify-center bg-[#0b0b0b]">
          <span className="text-[#f28a2e] text-xl">
            ✦
          </span>
        </div>

        <div className="max-w-[310px]">

          <span className="text-[#f28a2e] text-[9px] tracking-[0.35em]">
            03
          </span>

          <h3 className="mt-2 font-serif text-white text-[28px] xl:text-[31px] font-light">
            Outdoor Catering
          </h3>

          <p className="mt-3 text-white/40 text-[13px] leading-6">
            From family gatherings to festive celebrations,
            we bring Atulyam’s taste and quality to your special moments.
          </p>

        </div>

      </motion.div>


      {/* ================= LEFT BOTTOM ================= */}
      <motion.div
        initial={{ opacity: 0, x: -25 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.1, ease }}
        className="flex items-center justify-end gap-7"
      >

        <div className="text-right max-w-[310px]">

          <span className="text-[#f28a2e] text-[9px] tracking-[0.35em]">
            02
          </span>

          <h3 className="mt-2 font-serif text-white text-[28px] xl:text-[31px] font-light">
            Elegant Dine-In
          </h3>

          <p className="mt-3 text-white/40 text-[13px] leading-6">
            Relax in a warm, family-friendly ambience while
            we serve thoughtfully crafted dishes and heartfelt hospitality.
          </p>

        </div>

        <div className="w-[66px] h-[66px] shrink-0 rounded-full border border-[#f28a2e]/30 flex items-center justify-center bg-[#0b0b0b]">
          <span className="text-[#f28a2e] text-xl">
            ◌
          </span>
        </div>

      </motion.div>


      {/* ================= RIGHT BOTTOM ================= */}
      <motion.div
        initial={{ opacity: 0, x: 25 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.1, ease }}
        className="flex items-center justify-start gap-7"
      >

        <div className="w-[66px] h-[66px] shrink-0 rounded-full border border-[#f28a2e]/30 flex items-center justify-center bg-[#0b0b0b]">
          <span className="text-[#f28a2e] text-xl">
            ✧
          </span>
        </div>

        <div className="max-w-[310px]">

          <span className="text-[#f28a2e] text-[9px] tracking-[0.35em]">
            04
          </span>

          <h3 className="mt-2 font-serif text-white text-[28px] xl:text-[31px] font-light">
            Private Events
          </h3>

          <p className="mt-3 text-white/40 text-[13px] leading-6">
            Host memorable occasions with customised menus,
            seamless service, and flavours that impress every guest.
          </p>

        </div>

      </motion.div>

    </div>


    {/* =====================================================
        MOBILE / TABLET
    ===================================================== */}
    <div className="lg:hidden">

      {/* center image */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease }}
        className="relative w-[270px] h-[270px] sm:w-[330px] sm:h-[330px] mx-auto mt-12"
      >

        <div className="absolute inset-[-8px] rounded-full border border-[#f28a2e]/20" />

        <div className="relative w-full h-full rounded-full overflow-hidden border border-white/10">

          <img
            src="https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=900&q=90"
            alt="Atulyam cuisine"
            className="w-full h-full object-cover"
          />

        </div>

      </motion.div>


      {/* services */}
      <div className="grid sm:grid-cols-2 gap-4 mt-14">

        {[
          {
            number: "01",
            title: "Home Delivery",
            text: "Enjoy Atulyam’s signature flavours delivered fresh, hot, and packed with care.",
            icon: "⌁",
          },
          {
            number: "02",
            title: "Elegant Dine-In",
            text: "Relax in a warm, family-friendly ambience while we serve thoughtfully crafted dishes.",
            icon: "◌",
          },
          {
            number: "03",
            title: "Outdoor Catering",
            text: "From family gatherings to festive celebrations, we bring Atulyam’s taste to your special moments.",
            icon: "✦",
          },
          {
            number: "04",
            title: "Private Events",
            text: "Host memorable occasions with customised menus, seamless service and flavours that impress.",
            icon: "✧",
          },
        ].map((item, index) => (

          <motion.div
            key={item.number}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.6,
              delay: index * 0.08,
              ease,
            }}
            className="border border-white/[0.08] bg-[#0b0b0b] p-6"
          >

            <div className="flex items-center justify-between">

              <span className="text-[#f28a2e] text-[9px] tracking-[0.3em]">
                {item.number}
              </span>

              <span className="text-[#f28a2e] text-xl">
                {item.icon}
              </span>

            </div>

            <h3 className="font-serif text-white text-[28px] font-light mt-8">
              {item.title}
            </h3>

            <p className="mt-3 text-white/40 text-sm leading-6">
              {item.text}
            </p>

          </motion.div>

        ))}

      </div>

    </div>


    {/* bottom detail */}
    <div className="flex items-center justify-center gap-4 mt-12 md:mt-16">

      <span className="w-10 h-px bg-white/10" />

      <span className="text-white/20 text-[8px] tracking-[0.45em] uppercase">
        Crafted with care since 2020
      </span>

      <span className="w-10 h-px bg-white/10" />

    </div>

  </div>
</section>
    {/* =========================================================
    WHY CHOOSE US — IMAGE CARD SHOWCASE
========================================================= */}
<section className="relative bg-[#070707] pt-10 md:pt-14 lg:pt-16 pb-24 md:pb-32 lg:pb-36 px-5 md:px-10 lg:px-16 overflow-hidden">

  {/* subtle ambient glow */}
  <div className="absolute top-[18%] left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#f28a2e]/[0.025] blur-[130px] rounded-full pointer-events-none" />

  <div className="relative max-w-[1450px] mx-auto">

    {/* =====================================================
        SECTION HEADER
    ===================================================== */}
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, ease }}
      className="text-center mb-12 md:mb-14 lg:mb-16"
    >

      {/* eyebrow */}
      <div className="flex flex-col items-center">

        <span className="text-[#f28a2e] text-[10px] md:text-[11px] font-medium tracking-[0.55em] uppercase">
          Why Choose Us
        </span>

        {/* decorative divider */}
        <div className="relative flex items-center justify-center w-[120px] h-[22px] mt-4">

          <span className="absolute left-0 w-8 h-px bg-[#f28a2e]" />
          <span className="absolute right-0 w-8 h-px bg-[#f28a2e]" />

          <span className="absolute left-[34px] w-[8px] h-[8px] border border-[#f28a2e] rotate-45" />
          <span className="absolute left-1/2 -translate-x-1/2 w-[10px] h-[10px] border border-[#f28a2e] rotate-45" />
          <span className="absolute right-[34px] w-[8px] h-[8px] border border-[#f28a2e] rotate-45" />

          <span className="absolute left-[1px] w-[5px] h-[5px] rounded-full bg-[#f28a2e]" />
          <span className="absolute right-[1px] w-[5px] h-[5px] rounded-full bg-[#f28a2e]" />

        </div>

      </div>


      {/* heading */}
      <h2 className="mt-7 font-serif font-light text-[46px] sm:text-[56px] md:text-[72px] lg:text-[82px] leading-[0.95] tracking-[-0.025em] text-white">
        What Makes Atulyam{' '}
        <span className="italic text-[#f28a2e]">
          Special
        </span>
      </h2>

      <p className="mt-7 max-w-2xl mx-auto text-white/40 text-sm md:text-[15px] leading-7">
        More than a meal — it is the comfort of familiar flavours,
        genuine hospitality and moments worth sharing.
      </p>

    </motion.div>


    {/* =====================================================
        FOUR IMAGE CARDS
    ===================================================== */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6 lg:gap-7">

      {[
        {
          number: "01",
          title: "Home-Style Hygiene",
          image:
            "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1000&q=90",
          Icon: ShieldCheck,
        },
        {
          number: "02",
          title: "Warm Ambience",
          image:
            "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=90",
          Icon: Armchair,
        },
        {
          number: "03",
          title: "Passionate Chefs",
          image:
            "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1000&q=90",
          Icon: ChefHat,
        },
        {
          number: "04",
          title: "Perfect For Gatherings",
          image:
            "https://images.unsplash.com/photo-1519671282429-b44660ead0a7?auto=format&fit=crop&w=1000&q=90",
          Icon: UsersRound,
        },
      ].map((item, index) => {

        const Icon = item.Icon;

        return (
          <motion.div
            key={item.number}
            initial={{
              opacity: 0,
              y: 45,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.15,
            }}
            transition={{
              duration: 0.8,
              delay: index * 0.1,
              ease,
            }}
            className="group relative"
          >

            {/* card */}
            <div className="relative h-[470px] sm:h-[520px] md:h-[560px] lg:h-[570px] overflow-hidden bg-[#111]">

              {/* image */}
              <img
                src={item.image}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.07]"
              />


              {/* top dark overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-transparent" />


              {/* bottom cinematic gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/75 via-[48%] to-transparent" />


              {/* hover orange tint */}
              <div className="absolute inset-0 bg-[#f28a2e]/0 group-hover:bg-[#f28a2e]/[0.055] transition-all duration-700" />


              {/* number */}
              <div className="absolute top-6 left-6 md:top-7 md:left-7">

                <span className="font-serif text-sm md:text-base text-white/60 tracking-[0.15em] group-hover:text-[#f28a2e] transition-colors duration-500">
                  {item.number}
                </span>

              </div>


              {/* icon + title */}
              <div className="absolute inset-x-0 bottom-0 flex flex-col items-center text-center px-6 pb-10 md:pb-11">

                {/* icon */}
                <div className="relative mb-7">

                  {/* glow */}
                  <div className="absolute inset-0 bg-[#f28a2e]/20 blur-xl rounded-full scale-75 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                  <div className="relative w-[68px] h-[68px] md:w-[74px] md:h-[74px] rounded-full border border-[#f28a2e]/60 flex items-center justify-center bg-black/20 backdrop-blur-[2px] group-hover:border-[#f28a2e] group-hover:bg-[#f28a2e]/10 transition-all duration-500">

                    <Icon
                      size={32}
                      strokeWidth={1.25}
                      className="text-[#f28a2e] group-hover:scale-110 transition-transform duration-500"
                    />

                  </div>

                </div>


                {/* title */}
                <h3 className="font-serif font-light text-white text-[27px] sm:text-[29px] md:text-[31px] leading-[1.05] max-w-[260px]">
                  {item.title}
                </h3>


                {/* orange line */}
                <div className="mt-6 w-0 h-px bg-[#f28a2e] group-hover:w-16 transition-all duration-700" />

              </div>


              {/* card border */}
              <div className="absolute inset-0 border border-white/[0.08] group-hover:border-[#f28a2e]/45 transition-colors duration-700 pointer-events-none" />

            </div>

          </motion.div>
        );
      })}

    </div>


    {/* =====================================================
        BOTTOM MICRO LINE
    ===================================================== */}
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: 0.5 }}
      className="flex items-center justify-center gap-4 mt-12 md:mt-16"
    >

      <span className="w-8 md:w-12 h-px bg-white/10" />

      <span className="text-white/20 text-[8px] md:text-[9px] tracking-[0.45em] uppercase">
        Taste · Care · Togetherness
      </span>

      <span className="w-8 md:w-12 h-px bg-white/10" />

    </motion.div>

  </div>
</section>




{/* =====================================================
    GUEST REVIEWS
===================================================== */}
<section className="relative bg-[#080808] py-16 md:py-20 lg:py-24 px-6 md:px-12 lg:px-20 overflow-hidden">

  {/* Background Image */}
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    <img
      src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=2000&q=85"
      alt=""
      className="absolute inset-0 w-full h-full object-cover scale-110 blur-[6px] opacity-[0.12]"
    />

    <div className="absolute inset-0 bg-[#080808]/90" />

    <div className="absolute inset-0 bg-gradient-to-b from-[#080808]/80 via-[#080808]/60 to-[#080808]" />
  </div>

  {/* Ambient Glow */}
  <div className="absolute top-[-120px] left-1/2 -translate-x-1/2 w-[650px] h-[350px] bg-[#f28a2e]/[0.06] blur-[130px] pointer-events-none" />

  <div className="relative max-w-[1400px] mx-auto">

    {/* HEADER */}
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease }}
      className="max-w-3xl mx-auto text-center"
    >
      <p className="text-[#f28a2e] text-[9px] md:text-[10px] uppercase tracking-[0.45em] mb-4">
        Guest Reviews
      </p>

      <h2 className="font-serif text-4xl md:text-5xl lg:text-[62px] tracking-[-0.045em] leading-[1.05] text-white">
        Loved by our{" "}
        <span className="italic text-[#f28a2e]">
          guests.
        </span>
      </h2>

      <p className="text-white/45 text-sm md:text-[15px] leading-7 mt-5 max-w-xl mx-auto">
        From memorable family dinners to special celebrations,
        discover why guests continue to choose Atulyam.
      </p>
    </motion.div>


    {/* RATING + REVIEW COUNT */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: 0.15, ease }}
      className="flex justify-center mt-8"
    >
      <div className="flex items-center border border-white/[0.12] bg-black/45 backdrop-blur-md">

        {/* Rating */}
        <div className="flex items-center gap-4 px-6 py-4 md:px-8">

          <span className="font-serif text-3xl md:text-4xl text-white">
            4.4
          </span>

          <div>
            <div className="flex gap-[3px] text-[#f28a2e] text-[12px]">
              ★★★★★
            </div>

            <p className="text-white/35 text-[8px] uppercase tracking-[0.25em] mt-1.5">
              Google Rating
            </p>
          </div>

        </div>

        <div className="w-px h-11 bg-white/10" />

        {/* Reviews */}
        <div className="px-6 py-4 md:px-8">

          <p className="text-white text-sm">
            <span className="font-medium">560</span>{" "}
            <span className="text-white/50">
              Google Reviews
            </span>
          </p>

          <p className="text-white/30 text-[8px] uppercase tracking-[0.22em] mt-1.5">
            Real guest experiences
          </p>

        </div>

      </div>
    </motion.div>


    {/* REVIEW AREA */}
    <div className="mt-12 md:mt-14">

      {/* Section Label */}
      <div className="flex items-center gap-4 mb-6">

        <span className="text-[#f28a2e] text-[9px] uppercase tracking-[0.35em] whitespace-nowrap">
          What our guests say
        </span>

        <div className="h-px flex-1 bg-white/[0.10]" />

      </div>


      {/* CARDS */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">

        {[
          {
            name: "Aman Pathak",
            review:
              "Tasty food..good vibes..nice staff.. overall best place for family dines",
          },
          {
            name: "Shivam Pandey",
            review:
              "I've visited the place for many times, every time they deliver the taste above my expectations.",
          },
          {
            name: "Shivam Saini",
            review:
              "Breakfast was very good, service is also fast, the ambiance here is the best.",
          },
        ].map((item, index) => (

          <motion.div
            key={item.name}
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.65,
              delay: index * 0.1,
              ease,
            }}
            className="group"
          >

            <div className="relative min-h-[245px] bg-[#0b0b0b]/90 backdrop-blur-sm border border-white/[0.10] p-6 md:p-7 overflow-hidden transition-all duration-500 hover:border-[#f28a2e]/35">

              {/* Orange top line */}
              <div className="absolute top-0 left-0 w-0 h-px bg-[#f28a2e] group-hover:w-full transition-all duration-700" />

              {/* Soft glow */}
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#f28a2e]/[0.04] blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Quote */}
              <div className="absolute right-6 top-4 font-serif text-[75px] leading-none text-white/[0.035]">
                “
              </div>

              {/* Stars */}
              <div className="relative flex items-center justify-between">

                <div className="flex gap-1 text-[#f28a2e] text-[11px]">
                  ★★★★★
                </div>

                <span className="text-white/25 text-[8px] uppercase tracking-[0.25em]">
                  Google
                </span>

              </div>


              {/* Review Text */}
              <p className="relative font-serif text-[18px] md:text-[19px] leading-[1.55] text-white/80 mt-8 max-w-[420px]">
                “{item.review}”
              </p>


              {/* Reviewer */}
              <div className="absolute bottom-6 left-6 right-6 md:left-7 md:right-7 flex items-end justify-between">

                <div>
                  <div className="w-6 h-px bg-[#f28a2e] mb-2.5" />

                  <p className="font-serif text-[15px] text-white">
                    {item.name}
                  </p>

                  <p className="text-white/25 text-[8px] uppercase tracking-[0.2em] mt-1">
                    Google Reviewer
                  </p>
                </div>

                <span className="font-serif text-2xl text-white/[0.06]">
                  0{index + 1}
                </span>

              </div>

            </div>

          </motion.div>

        ))}

      </div>
    </div>
{/* CTA */}
<motion.div
  initial={{ opacity: 0, y: 15 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.6, delay: 0.2, ease }}
  className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8"
>
  {/* Leave a Review */}
  <a
    href="https://www.google.com/search?q=Atulyam+Restaurant+Reviews#lrd=0x39854b1fe99a735d:0x8f4486ba30b94331,3&sv=CAESzQEKuQEStgEKd0FKaVQ0dEtIdEczbGlhSkh0ZktvN3hJTzVwVkhkRUREek42Nmh3cWQ0bkhMajdHVDFXSG92YVhHOGRDa1ZrTnNPNGFfM3l4MjJlbmhzNHNqd3VQekVTMUItU1hNTGI3QlFpOHdIZ0N6YlZKS3pDV05FRUMxc3owEhdERGVvYXVhb0pwZWFodmNQcE5fY3dBcxoiQURzcjlmVHVxUHlqNlJhYTZLYTZFaTBHVFBRNEhWWU9qQRIEODA1MRoBMyoAMAA4AUAAGAAg8LzqxgFKAhAC"
    target="_blank"
    rel="noopener noreferrer"
    className="group inline-flex items-center gap-3 px-7 py-3.5 bg-[#f28a2e] text-black text-[9px] uppercase tracking-[0.28em] font-medium hover:bg-[#ff9b43] transition-all duration-300"
  >
    Leave a Review

    <span className="text-sm group-hover:translate-x-1 transition-transform">
      →
    </span>
  </a>

  {/* View All Reviews */}
  <a
    href="https://www.google.com/search?q=Atulyam+Restaurant#lrd=0x39854b1fe99a735d:0x8f4486ba30b94331,1,,,,"
    target="_blank"
    rel="noopener noreferrer"
    className="group inline-flex items-center gap-3 px-7 py-3.5 border border-white/[0.12] bg-white/[0.02] text-white/65 text-[9px] uppercase tracking-[0.28em] hover:border-[#f28a2e]/40 hover:text-white transition-all duration-300"
  >
    View All Reviews on Google

    <span className="text-[#f28a2e] group-hover:translate-x-1 transition-transform">
      →
    </span>
  </a>
</motion.div>

  </div>
</section>

      {/* =========================================================
          BIG STATEMENT
      ========================================================= */}
      <section className="relative min-h-[650px] md:min-h-[800px] flex items-center justify-center overflow-hidden">

        <motion.img
          src="https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=2200&q=90"
          alt="Restaurant dining"
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ scale: 1.04 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease }}
        />

        <div className="absolute inset-0 bg-black/65" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070707] via-black/30 to-[#070707]" />

        <motion.div
          className="relative z-10 text-center px-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
        >

          <p className="text-[#f28a2e] text-[10px] tracking-[0.5em] uppercase mb-10">
            The Atulyam Experience
          </p>

          <h2 className="font-serif font-light text-[58px] sm:text-[72px] md:text-[100px] lg:text-[125px] leading-[0.84] tracking-[-0.035em]">
            Good food
            <br />
            brings people
            <br />
            <span className="italic text-[#f28a2e]">
              together.
            </span>
          </h2>

        </motion.div>
      </section>


      {/* =========================================================
          FINAL CTA
      ========================================================= */}
      <section className="relative bg-[#050505] text-white py-28 md:py-36 overflow-hidden">

        {/* DECORATIVE ELEMENTS */}
        <div className="absolute top-0 left-[7%] w-24 h-24 rounded-full border border-[#f28a2e]/10 flex items-center justify-center">
          <span className="text-[#f28a2e] text-xl">✦</span>
        </div>

        <div className="absolute top-0 right-[7%] w-24 h-24 rounded-full border border-[#f28a2e]/10 flex items-center justify-center">
          <span className="text-[#f28a2e] text-[18px]">◌</span>
        </div>

        <div className="absolute right-[3%] top-[28%] w-24 h-24 rounded-full border border-[#f28a2e]/10 flex items-center justify-center">
          <span className="text-gray-500 text-xl">🍴</span>
        </div>

        <div className="absolute left-[2%] bottom-[5%] w-24 h-24 rounded-full border border-[#f28a2e]/10 flex items-center justify-center">
          <span className="text-[#f28a2e] text-xl">◌</span>
        </div>

        <div className="absolute right-[2%] bottom-[20%] w-24 h-24 rounded-full border border-[#f28a2e]/10 flex items-center justify-center">
          <span className="text-[#f28a2e] text-xl">✦</span>
        </div>


        <div className="relative max-w-7xl mx-auto px-6 md:px-10">

          {/* HEADING */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-24"
          >

            <div className="flex items-center justify-center gap-5 mb-7">

              <span className="w-11 h-px bg-[#f28a2e]" />

              <p className="text-[#f28a2e] text-[10px] md:text-[11px] tracking-[0.5em] uppercase">
                Come Dine With Us
              </p>

              <span className="w-11 h-px bg-[#f28a2e]" />

            </div>

            <h2 className="font-serif font-light text-[64px] md:text-[90px] lg:text-[112px] leading-[0.9] tracking-[-0.04em]">
              Make It A{' '}
              <span className="italic text-[#f28a2e]">
                Moment.
              </span>
            </h2>

            <p className="mt-10 max-w-2xl mx-auto text-gray-500 text-sm md:text-[16px] leading-7">
              Great food tastes even better when shared. Come experience
              the warmth, flavours and moments that make Atulyam special.
            </p>

          </motion.div>


          {/* INFORMATION CARDS */}
          <div className="grid md:grid-cols-3 gap-5">

            {/* CARD 01 — ADDRESS */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="group min-h-[410px] border border-white/[0.09] bg-[#0b0b0b] p-9 md:p-10 flex flex-col justify-between hover:border-[#f28a2e]/40 transition-all duration-500"
            >

              <div className="flex items-start justify-between">

                <span className="text-[#f28a2e] text-[11px] tracking-[0.35em]">
                  01
                </span>

                <div className="w-14 h-14 rounded-full border border-[#f28a2e]/30 flex items-center justify-center">
                  <span className="text-[#f28a2e] text-sm">✦</span>
                </div>

              </div>

              <div>

                <p className="text-gray-600 text-[10px] tracking-[0.45em] uppercase mb-5">
                  Find Us
                </p>

                <h3 className="font-serif text-[34px] md:text-[38px] leading-none mb-5">
                  Visit Atulyam
                </h3>

                <p className="text-gray-500 text-sm leading-7 max-w-[290px]">
                  1/235 Awas Vikas Colony,
                  <br />
                  Jhunsi, Prayagraj,
                  <br />
                  Uttar Pradesh – 211019
                </p>

                <a
                  href="https://www.google.com/maps/dir//Atulyam+Restaurant,+Milan+chauraha,+Jhusi,+Prayagraj,+Uttar+Pradesh+211019/@25.4286636,81.9207415,15z/data=!3m1!4b1!4m8!4m7!1m0!1m5!1m1!1s0x39854b1fe99a735d:0x8f4486ba30b94331!2m2!1d81.9133338!2d25.4262001?hl=en-US&authuser=1&entry=ttu&g_ep=EgoyMDI2MDkwOS4wIKXMDSoASAFQAw%3D%3D"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/link inline-flex items-center gap-4 mt-9 text-[#f28a2e] text-[10px] tracking-[0.35em] uppercase"
                >
                  Get Directions

                  <ArrowUpRight
                    size={17}
                    strokeWidth={1.4}
                    className="transition-transform duration-300 group-hover/link:translate-x-1 group-hover/link:-translate-y-1"
                  />

                </a>

              </div>

            </motion.div>


            {/* CARD 02 — CONTACT */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="group min-h-[410px] border border-[#f28a2e]/40 bg-gradient-to-b from-[#281307] to-[#120b07] p-9 md:p-10 flex flex-col justify-between hover:border-[#f28a2e] transition-all duration-500"
            >

              <div className="flex items-start justify-between">

                <span className="text-[#f28a2e] text-[11px] tracking-[0.35em]">
                  02
                </span>

                <div className="w-14 h-14 rounded-full border border-[#f28a2e]/30 flex items-center justify-center">
                  <span className="text-[#f28a2e] text-lg">⌁</span>
                </div>

              </div>

              <div>

                <p className="text-gray-600 text-[10px] tracking-[0.45em] uppercase mb-5">
                  Reservations
                </p>

                <h3 className="font-serif text-[34px] md:text-[38px] leading-none mb-5">
                  Let's Talk
                </h3>

                <p className="text-gray-500 text-sm leading-7">
                  +91 9335 9494 48
                  <br />
                  Call us for reservations & enquiries.
                </p>

                <a
                  href="tel:+919335949448"
                  className="group/link inline-flex items-center gap-4 mt-9 text-[#f28a2e] text-[10px] tracking-[0.35em] uppercase"
                >
                  Call Now

                  <ArrowUpRight
                    size={17}
                    strokeWidth={1.4}
                    className="transition-transform duration-300 group-hover/link:translate-x-1 group-hover/link:-translate-y-1"
                  />

                </a>

              </div>

            </motion.div>


            {/* CARD 03 — HOURS */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="group min-h-[410px] border border-white/[0.09] bg-[#0b0b0b] p-9 md:p-10 flex flex-col justify-between hover:border-[#f28a2e]/40 transition-all duration-500"
            >

              <div className="flex items-start justify-between">

                <span className="text-[#f28a2e] text-[11px] tracking-[0.35em]">
                  03
                </span>

                <div className="w-14 h-14 rounded-full border border-[#f28a2e]/30 flex items-center justify-center">
                  <span className="text-[#f28a2e] text-lg">◷</span>
                </div>

              </div>

              <div>

                <p className="text-gray-600 text-[10px] tracking-[0.45em] uppercase mb-5">
                  Open Every Day
                </p>

                <h3 className="font-serif text-[34px] md:text-[38px] leading-none mb-5">
                  Opening Hours
                </h3>

                <p className="text-gray-500 text-sm leading-7">
                  Monday – Sunday
                  <br />
                  07:00 AM – 01:00 AM
                </p>

                <div className="flex items-center gap-3 mt-9 text-[#f28a2e] text-[10px] tracking-[0.35em] uppercase">
                  <span className="w-2 h-2 rounded-full bg-[#f28a2e] shadow-[0_0_12px_#f28a2e]" />
                  We're Open
                </div>

              </div>

            </motion.div>

          </div>


          {/* EMAIL */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="mt-8 text-center"
          >

            <p className="text-gray-600 text-[9px] uppercase tracking-[0.4em] mb-3">
              Email Us
            </p>

            <a
              href="mailto:info@atulyamhospitality.in"
              className="text-white/45 hover:text-[#f28a2e] text-sm transition-colors"
            >
              info@atulyamhospitality.in
            </a>

          </motion.div>

        </div>
      </section>

    </main>
  );
}