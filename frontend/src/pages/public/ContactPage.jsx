import { motion } from "framer-motion";
import {
  ArrowUpRight,
  MapPin,
  Phone,
  Mail,
  Clock3,
  Instagram,
} from "lucide-react";

const ease = [0.22, 1, 0.36, 1];

export default function ContactPage() {
  return (
    <div className="bg-black text-white overflow-hidden">

      {/* =====================================================
          HERO
      ===================================================== */}
      <section
        id="contact-hero"
        className="relative min-h-[82vh] mt-[80px] overflow-hidden"
      >
        <motion.div
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease }}
          className="absolute inset-0"
        >
          <img
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=2200&q=90"
            alt="Atulyam Restaurant"
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-black/70" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/20" />
        </motion.div>

        <div className="relative z-10 min-h-[82vh] max-w-[1400px] mx-auto px-6 md:px-10 flex flex-col justify-center -translate-y-4 md:-translate-y-6">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease }}
            className="flex items-center gap-4 mb-7"
          >
            <span className="text-[#f28a2e] font-serif italic text-lg">
              01
            </span>

            <span className="w-14 h-px bg-[#f28a2e]" />

            <span className="text-white/45 text-[10px] uppercase tracking-[0.3em]">
              Get In Touch
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1, ease }}
            className="font-serif text-[16vw] md:text-[9vw] leading-[0.82] tracking-[-0.06em]"
          >
            Let's
            <br />
            <span className="italic text-[#f28a2e]">
              connect.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-8 text-white/60 text-sm md:text-base leading-7 max-w-md"
          >
            Whether you are planning a dinner, celebrating a special
            occasion or simply want to know more about Atulyam —
            we would love to hear from you.
          </motion.p>

        </div>
      </section>


      {/* =====================================================
          CONTACT INTRO
      ===================================================== */}
      <section
        id="contact-intro"
        className="max-w-[1400px] mx-auto px-6 md:px-10 py-16 md:py-24"
      >
        <div className="border-t border-white/10 pt-8 md:pt-10">

          <div className="grid md:grid-cols-12 gap-10 md:gap-16 items-end">

            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease }}
              className="md:col-span-7"
            >
              <span className="text-white/30 text-[9px] uppercase tracking-[0.3em]">
                Atulyam Restaurant
              </span>

              <h2 className="font-serif text-5xl md:text-6xl lg:text-[6vw] leading-[0.86] tracking-[-0.055em] mt-4">
                Come by.
                <br />
                <span className="italic text-[#f28a2e]">
                  Stay awhile.
                </span>
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 25 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1, ease }}
              className="md:col-span-5"
            >
              <div className="border-l border-[#f28a2e]/50 pl-6 md:pl-8">
                <p className="font-serif text-xl md:text-2xl text-white/80 leading-8">
                  Good food tastes better when shared
                  around a table.
                </p>

                <div className="w-10 h-px bg-[#f28a2e]/60 my-6" />

                <p className="text-white/40 text-sm leading-7">
                  Visit us, give us a call or send us a message.
                  Our team will be happy to help.
                </p>
              </div>
            </motion.div>

          </div>
        </div>
      </section>


{/* =====================================================
    CONTACT DETAILS + FORM
===================================================== */}
<section
  id="contact-details"
  className="bg-[#0b0b0b] border-y border-white/10"
>
  <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-14 md:py-20">

    <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">

      {/* =================================================
          LEFT — CONTACT DETAILS
      ================================================= */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease }}
        className="lg:col-span-5"
      >

        <span className="text-white/30 text-[9px] uppercase tracking-[0.3em]">
          02 / Find Us
        </span>

        <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl leading-[0.9] tracking-[-0.045em] mt-4">
          We'd love to
          <br />
          <span className="italic text-[#f28a2e]">
            see you.
          </span>
        </h2>


        {/* CONTACT INFO */}
        <div className="mt-10 md:mt-12 space-y-7">

          {/* ADDRESS */}
          <div className="flex gap-4 md:gap-5">
            <div className="w-10 h-10 md:w-11 md:h-11 border border-white/10 flex items-center justify-center shrink-0">
              <MapPin
                size={16}
                className="text-[#f28a2e]"
              />
            </div>

            <div>
              <span className="text-white/25 text-[9px] uppercase tracking-[0.25em]">
                Visit Us
              </span>

              <p className="text-white/65 text-sm leading-6 mt-1.5">
                Atulyam Restaurant
                <br />
                Prayagraj, Uttar Pradesh
              </p>
            </div>
          </div>


          {/* PHONE */}
          <div className="flex gap-4 md:gap-5">
            <div className="w-10 h-10 md:w-11 md:h-11 border border-white/10 flex items-center justify-center shrink-0">
              <Phone
                size={16}
                className="text-[#f28a2e]"
              />
            </div>

            <div>
              <span className="text-white/25 text-[9px] uppercase tracking-[0.25em]">
                Call Us
              </span>

              <a
                href="tel:+919451234567"
                className="block text-white/65 text-sm mt-1.5 hover:text-[#f28a2e] transition-colors"
              >
                +91 94512 34567
              </a>
            </div>
          </div>


          {/* EMAIL */}
          <div className="flex gap-4 md:gap-5">
            <div className="w-10 h-10 md:w-11 md:h-11 border border-white/10 flex items-center justify-center shrink-0">
              <Mail
                size={16}
                className="text-[#f28a2e]"
              />
            </div>

            <div>
              <span className="text-white/25 text-[9px] uppercase tracking-[0.25em]">
                Email
              </span>

              <a
                href="mailto:hello@atulyamhospitality.in"
                className="block text-white/65 text-sm mt-1.5 hover:text-[#f28a2e] transition-colors"
              >
                hello@atulyamhospitality.in
              </a>
            </div>
          </div>


          {/* HOURS */}
          <div className="flex gap-4 md:gap-5">
            <div className="w-10 h-10 md:w-11 md:h-11 border border-white/10 flex items-center justify-center shrink-0">
              <Clock3
                size={16}
                className="text-[#f28a2e]"
              />
            </div>

            <div>
              <span className="text-white/25 text-[9px] uppercase tracking-[0.25em]">
                Opening Hours
              </span>

              <p className="text-white/65 text-sm leading-6 mt-1.5">
                Monday – Sunday
                <br />
                11:00 AM – 11:00 PM
              </p>
            </div>
          </div>

        </div>


        {/* =================================================
            LOCATION + SOCIAL
        ================================================= */}
        <div className="mt-10 pt-6 border-t border-white/10">

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">

            {/* INSTAGRAM */}
            <a
              href="#"
              className="inline-flex items-center gap-3 text-white/35 hover:text-[#f28a2e] transition-colors"
            >
              <Instagram size={16} />

              <span className="text-[9px] uppercase tracking-[0.25em]">
                Follow Atulyam
              </span>
            </a>


            {/* MAP BUTTON */}
            <a
              href="https://www.google.com/maps/search/?api=1&query=Atulyam+Restaurant+Prayagraj"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center gap-4 border border-white/15 px-5 py-3 text-white/60 hover:border-[#f28a2e] hover:text-[#f28a2e] transition-all duration-300"
            >
              <MapPin size={14} />

              <span className="text-[9px] uppercase tracking-[0.22em]">
                Get Directions
              </span>

              <ArrowUpRight
                size={14}
                className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300"
              />
            </a>

          </div>

        </div>

      </motion.div>


      {/* =================================================
          RIGHT — CONTACT FORM
      ================================================= */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.1, ease }}
        className="lg:col-span-7"
      >

        <div className="border border-white/10 bg-black p-6 md:p-9 lg:p-10">

          {/* FORM HEADER */}
          <div className="flex items-start justify-between mb-8 md:mb-10">

            <div>
              <span className="text-[#f28a2e] text-[9px] uppercase tracking-[0.3em]">
                Send A Message
              </span>

              <h3 className="font-serif text-3xl md:text-4xl tracking-[-0.035em] mt-2.5">
                How can we help?
              </h3>
            </div>

            <span className="hidden sm:block text-white/10 font-serif italic text-3xl">
              03
            </span>

          </div>


          {/* FORM */}
          <form className="space-y-6 md:space-y-7">

            {/* NAME + PHONE */}
            <div className="grid md:grid-cols-2 gap-6 md:gap-7">

              <div>
                <label className="block text-white/30 text-[9px] uppercase tracking-[0.25em] mb-2.5">
                  Your Name
                </label>

                <input
                  type="text"
                  placeholder="Enter your name"
                  className="w-full bg-transparent border-b border-white/15 focus:border-[#f28a2e] outline-none py-3 text-sm text-white placeholder:text-white/20 transition-colors"
                />
              </div>

              <div>
                <label className="block text-white/30 text-[9px] uppercase tracking-[0.25em] mb-2.5">
                  Phone Number
                </label>

                <input
                  type="tel"
                  placeholder="Enter phone number"
                  className="w-full bg-transparent border-b border-white/15 focus:border-[#f28a2e] outline-none py-3 text-sm text-white placeholder:text-white/20 transition-colors"
                />
              </div>

            </div>


            {/* EMAIL */}
            <div>
              <label className="block text-white/30 text-[9px] uppercase tracking-[0.25em] mb-2.5">
                Email Address
              </label>

              <input
                type="email"
                placeholder="Enter your email"
                className="w-full bg-transparent border-b border-white/15 focus:border-[#f28a2e] outline-none py-3 text-sm text-white placeholder:text-white/20 transition-colors"
              />
            </div>


            {/* MESSAGE */}
            <div>
              <label className="block text-white/30 text-[9px] uppercase tracking-[0.25em] mb-2.5">
                Message
              </label>

              <textarea
                rows="4"
                placeholder="Tell us what you have in mind..."
                className="w-full bg-transparent border-b border-white/15 focus:border-[#f28a2e] outline-none py-3 text-sm text-white placeholder:text-white/20 resize-none transition-colors"
              />
            </div>


            {/* SUBMIT */}
            <div className="pt-1">
              <button
                type="submit"
                className="group w-full sm:w-auto flex items-center justify-between gap-10 bg-[#f28a2e] text-black px-6 py-3.5 hover:bg-white transition-colors duration-300"
              >
                <span className="text-[9px] uppercase tracking-[0.25em] font-medium">
                  Send Message
                </span>

                <span className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center group-hover:rotate-45 transition-transform duration-300">
                  <ArrowUpRight size={15} />
                </span>
              </button>
            </div>

          </form>

        </div>

      </motion.div>

    </div>

  </div>
</section>


    </div>
  );
}