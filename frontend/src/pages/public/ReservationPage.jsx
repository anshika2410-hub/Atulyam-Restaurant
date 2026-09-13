import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  CalendarDays,
  Clock3,
  Users,
  Phone,
  ArrowUpRight,
  Check,
} from "lucide-react";

const ease = [0.22, 1, 0.36, 1];

const ReservationPage = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="bg-black text-white min-h-screen">

      {/* =====================================================
          RESERVATION
      ===================================================== */}
      <section className="relative min-h-screen mt-[80px] overflow-hidden">

        {/* =================================================
            BACKGROUND IMAGE
        ================================================= */}
        <div className="absolute inset-0">

  <img
    src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=2200&q=90"
    alt=""
    className="w-full h-full object-cover scale-105 blur-[3px]"
  />

  {/* DARK OVERLAY — reduced */}
  <div className="absolute inset-0 bg-black/45" />

  {/* SOFT GRADIENT */}
  <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-black/65" />

</div>

        {/* =================================================
            CONTENT
        ================================================= */}
        <div className="relative z-10 max-w-[1300px] mx-auto px-6 md:px-10 py-16 md:py-24">

          <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-start">


            {/* =================================================
                LEFT CONTENT
            ================================================= */}
            <motion.div
              initial={{ opacity: 0, x: -25 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease }}
              className="lg:col-span-4 lg:pt-8"
            >

              {/* LABEL */}
              <div className="flex items-center gap-4 mb-7">

                <span className="text-[#f28a2e] font-serif italic text-lg">
                  01
                </span>

                <span className="w-12 h-px bg-[#f28a2e]" />

                <span className="text-white/40 text-[9px] uppercase tracking-[0.3em]">
                  Reservations
                </span>

              </div>


              {/* HEADING */}
              <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl leading-[0.84] tracking-[-0.055em]">

                Reserve
                <br />

                your
                <br />

                <span className="italic text-[#f28a2e]">
                  table.
                </span>

              </h1>


              {/* DESCRIPTION */}
              <div className="border-l border-[#f28a2e]/50 pl-6 mt-9">

                <p className="font-serif text-xl md:text-2xl text-white/85 leading-8">
                  Good food tastes better
                  <br />
                  around a good table.
                </p>

                <div className="w-10 h-px bg-[#f28a2e]/60 my-6" />

                <p className="text-white/45 text-sm leading-7 max-w-sm">
                  Choose your preferred date, time and
                  number of guests. We'll take care of
                  the rest.
                </p>

              </div>


              {/* OPENING HOURS */}
              <div className="mt-10 pt-6 border-t border-white/10">

                <div className="flex items-start gap-4">

                  <Clock3
                    size={16}
                    className="text-[#f28a2e] mt-0.5 shrink-0"
                  />

                  <div>

                    <p className="text-white/65 text-xs">
                      Opening Hours
                    </p>

                    <p className="text-white/35 text-xs mt-2 leading-6">
                      Monday – Sunday
                      <br />
                      11:00 AM – 11:00 PM
                    </p>

                  </div>

                </div>


                {/* PHONE */}
                <div className="flex items-start gap-4 mt-6">

                  <Phone
                    size={16}
                    className="text-[#f28a2e] mt-0.5 shrink-0"
                  />

                  <div>

                    <p className="text-white/65 text-xs">
                      Need help?
                    </p>

                    <a
                      href="tel:+919451234567"
                      className="text-white/35 text-xs mt-2 block hover:text-[#f28a2e] transition-colors"
                    >
                      +91 94512 34567
                    </a>

                  </div>

                </div>

              </div>

            </motion.div>


            {/* =================================================
                FORM
            ================================================= */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease }}
              className="lg:col-span-8"
            >

              <div className="border border-white/15 bg-black/65 backdrop-blur-md p-6 md:p-9 lg:p-11 shadow-2xl">

                {!submitted ? (

                  <form
                    onSubmit={handleSubmit}
                    className="space-y-7"
                  >

                    {/* =================================================
                        FORM HEADER
                    ================================================= */}
                    <div className="flex items-start justify-between pb-6 border-b border-white/10">

                      <div>

                        <span className="text-[#f28a2e] text-[9px] uppercase tracking-[0.3em]">
                          Table Reservation
                        </span>

                        <h2 className="font-serif text-3xl md:text-4xl mt-3 tracking-[-0.035em]">
                          Tell us about your visit.
                        </h2>

                      </div>

                      <span className="font-serif italic text-[#f28a2e] text-2xl">
                        02
                      </span>

                    </div>


                    {/* =================================================
                        NAME + PHONE
                    ================================================= */}
                    <div className="grid md:grid-cols-2 gap-6">

                      <div>

                        <label className="block text-white/35 text-[9px] uppercase tracking-[0.25em] mb-3">
                          Your Name
                        </label>

                        <input
                          type="text"
                          required
                          placeholder="Enter your name"
                          className="w-full bg-transparent border-b border-white/15 py-3 text-sm text-white placeholder:text-white/20 outline-none focus:border-[#f28a2e] transition-colors"
                        />

                      </div>


                      <div>

                        <label className="block text-white/35 text-[9px] uppercase tracking-[0.25em] mb-3">
                          Phone Number
                        </label>

                        <input
                          type="tel"
                          required
                          placeholder="+91 XXXXX XXXXX"
                          className="w-full bg-transparent border-b border-white/15 py-3 text-sm text-white placeholder:text-white/20 outline-none focus:border-[#f28a2e] transition-colors"
                        />

                      </div>

                    </div>


                    {/* =================================================
                        EMAIL
                    ================================================= */}
                    <div>

                      <label className="block text-white/35 text-[9px] uppercase tracking-[0.25em] mb-3">
                        Email Address
                      </label>

                      <input
                        type="email"
                        placeholder="you@example.com"
                        className="w-full bg-transparent border-b border-white/15 py-3 text-sm text-white placeholder:text-white/20 outline-none focus:border-[#f28a2e] transition-colors"
                      />

                    </div>


                    {/* =================================================
                        DATE + TIME
                    ================================================= */}
                    <div className="grid md:grid-cols-2 gap-6">

                      {/* DATE */}
                      <div>

                        <label className="flex items-center gap-2 text-white/35 text-[9px] uppercase tracking-[0.25em] mb-3">
                          <CalendarDays size={13} />
                          Date
                        </label>

                        <input
                          type="date"
                          required
                          className="w-full bg-transparent border-b border-white/15 py-3 text-sm text-white outline-none focus:border-[#f28a2e] transition-colors [color-scheme:dark]"
                        />

                      </div>


                      {/* TIME */}
                      <div>

                        <label className="flex items-center gap-2 text-white/35 text-[9px] uppercase tracking-[0.25em] mb-3">
                          <Clock3 size={13} />
                          Preferred Time
                        </label>

                        <select
                          required
                          defaultValue=""
                          className="w-full bg-transparent border-b border-white/15 py-3 text-sm text-white outline-none focus:border-[#f28a2e] transition-colors"
                        >

                          <option
                            value=""
                            disabled
                            className="bg-black"
                          >
                            Select time
                          </option>

                          <option className="bg-black">
                            11:00 AM
                          </option>

                          <option className="bg-black">
                            12:00 PM
                          </option>

                          <option className="bg-black">
                            1:00 PM
                          </option>

                          <option className="bg-black">
                            2:00 PM
                          </option>

                          <option className="bg-black">
                            6:00 PM
                          </option>

                          <option className="bg-black">
                            7:00 PM
                          </option>

                          <option className="bg-black">
                            8:00 PM
                          </option>

                          <option className="bg-black">
                            9:00 PM
                          </option>

                          <option className="bg-black">
                            10:00 PM
                          </option>

                        </select>

                      </div>

                    </div>


                    {/* =================================================
                        GUESTS
                    ================================================= */}
                    <div>

                      <label className="flex items-center gap-2 text-white/35 text-[9px] uppercase tracking-[0.25em] mb-3">
                        <Users size={13} />
                        Number of Guests
                      </label>

                      <select
                        required
                        defaultValue=""
                        className="w-full bg-transparent border-b border-white/15 py-3 text-sm text-white outline-none focus:border-[#f28a2e] transition-colors"
                      >

                        <option
                          value=""
                          disabled
                          className="bg-black"
                        >
                          Select guests
                        </option>

                        {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (

                          <option
                            key={num}
                            className="bg-black"
                          >
                            {num} {num === 1 ? "Guest" : "Guests"}
                          </option>

                        ))}

                        <option className="bg-black">
                          9+ Guests
                        </option>

                      </select>

                    </div>


                    {/* =================================================
                        SPECIAL REQUEST
                    ================================================= */}
                    <div>

                      <label className="block text-white/35 text-[9px] uppercase tracking-[0.25em] mb-3">

                        Special Request

                        <span className="text-white/15 ml-2">
                          Optional
                        </span>

                      </label>

                      <textarea
                        rows="3"
                        placeholder="Birthday, anniversary, seating preference..."
                        className="w-full bg-transparent border border-white/10 p-4 text-sm text-white placeholder:text-white/20 outline-none resize-none focus:border-[#f28a2e] transition-colors"
                      />

                    </div>


                    {/* =================================================
                        SUBMIT
                    ================================================= */}
                    <div className="pt-1">

                      <button
                        type="submit"
                        className="group w-full md:w-auto inline-flex items-center justify-center gap-5 bg-[#f28a2e] text-black px-8 py-4 text-[10px] uppercase tracking-[0.22em] font-medium hover:bg-white transition-colors duration-300"
                      >

                        Request Reservation

                        <ArrowUpRight
                          size={16}
                          className="group-hover:rotate-45 transition-transform duration-300"
                        />

                      </button>

                    </div>

                  </form>

                ) : (

                  /* =================================================
                      SUCCESS MESSAGE
                  ================================================= */
                  <motion.div
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, ease }}
                    className="min-h-[500px] flex flex-col items-center justify-center text-center"
                  >

                    <div className="w-16 h-16 rounded-full border border-[#f28a2e] flex items-center justify-center mb-7">

                      <Check
                        size={25}
                        className="text-[#f28a2e]"
                      />

                    </div>


                    <span className="text-[#f28a2e] text-[9px] uppercase tracking-[0.3em]">
                      Reservation Request Received
                    </span>


                    <h3 className="font-serif text-4xl md:text-5xl mt-5">
                      Thank you.
                    </h3>


                    <p className="text-white/40 text-sm leading-7 max-w-md mt-5">
                      Your reservation request has been received.
                      Our team will contact you shortly to confirm
                      your table.
                    </p>

                  </motion.div>

                )}

              </div>

            </motion.div>

          </div>

        </div>

      </section>

    </main>
  );
};

export default ReservationPage;