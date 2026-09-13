import { motion } from 'framer-motion';
import { ArrowDown, ArrowUpRight } from 'lucide-react';

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

const imageReveal = {
  hidden: {
    opacity: 0,
    scale: 1.05,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 1.3,
      ease,
    },
  },
};

const values = [
  {
    number: '01',
    title: 'Craft',
    text: 'Thoughtful ingredients. Balanced flavours. Every plate prepared with intention.',
  },
  {
    number: '02',
    title: 'Hospitality',
    text: 'Warm service and an atmosphere that makes every guest feel at home.',
  },
  {
    number: '03',
    title: 'Togetherness',
    text: 'Because the finest meals become meaningful when shared with the people we love.',
  },
];

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

            <p className="mt-8 max-w-[560px] text-white/70 text-[15px] md:text-[17px] leading-8">
              Atulyam is a celebration of Indian food, togetherness and the
              moments that happen around a beautifully set table.
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
      <section className="relative py-28 md:py-40 lg:py-48 px-6 md:px-12 lg:px-20">

        <div className="max-w-[1500px] mx-auto">

          <div className="grid lg:grid-cols-[220px_1fr] gap-12 lg:gap-20">

            {/* Section number */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeLeft}
              className="flex lg:flex-col justify-between lg:justify-start"
            >
              <div>
                <span className="text-[#f28a2e] text-[11px] tracking-[0.45em] uppercase">
                  The Beginning
                </span>

                <div className="mt-8 w-10 h-px bg-[#f28a2e]" />
              </div>

              <span className="hidden lg:block mt-32 text-white/20 text-7xl font-serif">
                01
              </span>
            </motion.div>


            {/* Intro */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeUp}
            >

              <h2 className="font-serif font-light text-[48px] md:text-[68px] lg:text-[88px] leading-[0.95] tracking-[-0.025em] max-w-6xl">
                A table is more than
                <br />
                a place to eat.
              </h2>

              <p className="font-serif italic text-[#f28a2e] text-[34px] md:text-[48px] lg:text-[58px] leading-none mt-3">
                It is where moments begin.
              </p>

              <div className="grid md:grid-cols-2 gap-8 md:gap-16 mt-14 max-w-5xl">

                <p className="text-white/55 text-[15px] md:text-[17px] leading-8">
                  Atulyam was created with a simple belief — food has the
                  power to bring people closer. Every recipe, every plate and
                  every detail of the experience is designed around that idea.
                </p>

                <p className="text-white/55 text-[15px] md:text-[17px] leading-8">
                  We bring together the richness of Indian flavours with a
                  warm, contemporary setting where families gather, friends
                  reconnect and celebrations become memories.
                </p>

              </div>

            </motion.div>

          </div>


          {/* Editorial image composition */}
         
<div className="relative mt-20 md:mt-24 lg:mt-18">

  <div className="max-w-[1320px] mx-auto">

{/* ================= DESKTOP ================= */}
<div className="hidden md:grid grid-cols-12 grid-rows-[280px_280px] gap-3">

  {/* IMAGE 01 — Tall */}
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


  {/* IMAGE 02 — Wide */}
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


  {/* IMAGE 03 — Small */}
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


  {/* IMAGE 04 — Small Interior */}
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

    {/* ================= MOBILE ================= */}
    <div className="md:hidden space-y-2">

      {/* Main */}
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


      {/* Two Images */}
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


      {/* Interior */}
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


    {/* Editorial Caption */}
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
          PHILOSOPHY — CINEMATIC
      ========================================================= */}
      <section className="relative mt-10 md:mt-1 min-h-[760px] flex items-center overflow-hidden">

        <motion.img
          src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=2200&q=90"
          alt="Atulyam restaurant interior"
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ scale: 1.05 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease }}
        />

        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070707] via-transparent to-[#070707]/20" />

        <div className="relative z-10 max-w-[1500px] mx-auto w-full px-6 md:px-12 lg:px-20">

          <motion.div
            className="max-w-3xl"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            variants={fadeUp}
          >

            <p className="text-[#f28a2e] text-[11px] tracking-[0.45em] uppercase mb-7">
              Our Philosophy
            </p>

            <h2 className="font-serif font-light text-[54px] md:text-[76px] lg:text-[96px] leading-[0.91] tracking-[-0.025em]">
              Rooted in
              <br />
              <span className="italic text-[#f28a2e]">
                tradition.
              </span>
              <br />
              Made for today.
            </h2>

            <p className="mt-10 max-w-xl text-white/65 text-[15px] md:text-[17px] leading-8">
              Indian cuisine carries generations of stories within it.
              Atulyam respects those traditions while giving them a
              contemporary expression.
            </p>

          </motion.div>


          <div className="absolute right-8 lg:right-20 bottom-10 hidden md:block">
            <span className="text-white/35 text-[9px] tracking-[0.4em] uppercase">
              Indian at heart
            </span>
          </div>

        </div>
      </section>


      {/* =========================================================
          PHILOSOPHY DETAIL
      ========================================================= */}
      <section className="py-28 md:py-40 px-6 md:px-12 lg:px-20">

        <div className="max-w-[1500px] mx-auto">

          <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-16 lg:gap-28 items-start">

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.25 }}
              variants={fadeLeft}
            >

              <span className="text-[#f28a2e] text-[11px] tracking-[0.45em] uppercase">
                The Details Matter
              </span>

              <p className="font-serif text-[34px] md:text-[45px] leading-[1.08] font-light mt-8">
                Familiar flavours,
                <br />
                <span className="italic text-[#f28a2e]">
                  thoughtfully reimagined.
                </span>
              </p>

            </motion.div>


            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.25 }}
              variants={fadeUp}
              className="border-t border-white/10"
            >

              <div className="py-8 border-b border-white/10">
                <p className="text-white/55 text-[15px] md:text-[17px] leading-8 max-w-3xl">
                  From familiar spices to carefully prepared classics, our
                  kitchen is guided by balance — preserving what matters while
                  creating something that feels entirely our own.
                </p>
              </div>

              <div className="py-8 border-b border-white/10">
                <p className="text-white/55 text-[15px] md:text-[17px] leading-8 max-w-3xl">
                  We pay attention to the little things: the aroma that
                  reaches the table, the warmth of the room, the presentation
                  of every dish and the feeling that stays after the last bite.
                </p>
              </div>

            </motion.div>

          </div>

        </div>
      </section>


      {/* =========================================================
          VALUES
      ========================================================= */}
      <section className="bg-[#0b0b0b] py-28 md:py-40 px-6 md:px-12 lg:px-20">

        <div className="max-w-[1500px] mx-auto">

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
          >

            <p className="text-[#f28a2e] text-[11px] tracking-[0.45em] uppercase mb-7">
              What Defines Us
            </p>

            <h2 className="font-serif font-light text-[50px] md:text-[72px] lg:text-[86px] leading-[0.92]">
              Three things we
              <br />
              <span className="italic text-[#f28a2e]">
                never compromise.
              </span>
            </h2>

          </motion.div>


          <div className="mt-20 border-t border-white/10">

            {values.map((item, index) => (
              <motion.div
                key={item.number}
                className="grid md:grid-cols-[100px_0.7fr_1fr] gap-8 md:gap-12 py-10 md:py-14 border-b border-white/10 items-start"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={fadeUp}
                transition={{ delay: index * 0.1 }}
              >

                <span className="text-[#f28a2e] text-xs tracking-[0.2em]">
                  {item.number}
                </span>

                <h3 className="font-serif text-[40px] md:text-[52px] font-light">
                  {item.title}
                </h3>

                <p className="text-white/45 text-[15px] md:text-base leading-7 max-w-lg">
                  {item.text}
                </p>

              </motion.div>
            ))}

          </div>

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
  {/* Decorative Elements */}
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

    {/* Heading */}
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
        Make It A{" "}
        <span className="italic text-[#f28a2e]">
          Moment.
        </span>
      </h2>

      <p className="mt-10 max-w-2xl mx-auto text-gray-500 text-sm md:text-[16px] leading-7">
        Great food tastes even better when shared. Come experience
        the warmth, flavours and moments that make Atulyam special.
      </p>
    </motion.div>


    {/* Information Cards */}
    <div className="grid md:grid-cols-3 gap-5">

      {/* Card 01 */}
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

          <p className="text-gray-500 text-sm leading-7 max-w-[270px]">
            Your Restaurant Address,
            <br />
            Kanpur, Uttar Pradesh
          </p>

          <a
            href="https://www.google.com/maps/search/?api=1&query=Atulyam+Restaurant+Prayagraj"
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


      {/* Card 02 */}
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


      {/* Card 03 */}
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
            Lunch — 11:00 AM to 4:00 PM
            <br />
            Dinner — 6:00 PM to 11:00 PM
          </p>

          <div className="flex items-center gap-3 mt-9 text-[#f28a2e] text-[10px] tracking-[0.35em] uppercase">
            <span className="w-2 h-2 rounded-full bg-[#f28a2e] shadow-[0_0_12px_#f28a2e]" />
            We're Open
          </div>
        </div>
      </motion.div>

    </div>
  </div>
</section>

    </main>
  );
}