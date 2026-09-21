import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MapPin,
  Phone,
  Mail,
  Clock3,
  ArrowUpRight,
  ArrowUp,
  Instagram,
  Facebook,
} from 'lucide-react';

const ease = [0.22, 1, 0.36, 1];

export const Footer = () => {
  return (
    <footer className="relative bg-[#060606] border-t border-white/10 overflow-hidden text-white">

      {/* =====================================================
          BACKGROUND WATERMARK
      ===================================================== */}
      <div className="absolute bottom-[-12px] left-0 right-0 pointer-events-none select-none overflow-hidden">
        <div className="font-serif text-[27vw] md:text-[19vw] lg:text-[16vw] leading-[0.65] tracking-[-0.07em] text-white/[0.025] text-center whitespace-nowrap">
          Atulyam
        </div>
      </div>


      {/* =====================================================
          FOOTER CONTENT
      ===================================================== */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10 pt-14 md:pt-20 pb-7">

        {/* =================================================
            MAIN FOOTER GRID
        ================================================= */}
        <div className="border-y border-white/10 py-10 md:py-12">

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">


            {/* =================================================
                BRAND
            ================================================= */}
            <motion.div
  className="col-span-2 lg:col-span-1"
  initial={{ opacity: 0, y: 15 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.6, ease }}
>

             <Link
               to="/"
               className="flex items-center group select-none shrink-0"
             >
               <img
                 src="/images/logo.png"
                 alt="Atulyam Restaurant"
                 className="w-[170px] sm:w-[195px] lg:w-[220px] h-auto object-contain mix-blend-screen transition-transform duration-300 group-hover:scale-[1.02]"
               />
             </Link>
              <p className="text-white/35 text-xs leading-6 mt-5 max-w-[220px]">
                Incomparable taste in every bite.
              </p>

            </motion.div>


            {/* =================================================
                EXPLORE
            ================================================= */}
            <motion.div
  className="col-span-1 lg:col-span-1"
  initial={{ opacity: 0, y: 15 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.6, delay: 0.05, ease }}
>

              <span className="text-white/25 text-[9px] uppercase tracking-[0.3em]">
                Explore
              </span>

              <div className="mt-5 space-y-3">

                {[
                  ['About', '/about'],
                  ['Menu', '/menu'],
                  ['Catering', '/catering'],
                  ['Gallery', '/gallery'],
                  ['Contact', '/contact'],
                ].map(([label, path]) => (

                  <Link
                    key={path}
                    to={path}
                    className="group flex items-center gap-2 w-fit text-white/55 hover:text-white text-xs transition-colors duration-300"
                  >

                    <span>{label}</span>

                    <ArrowUpRight
                      size={12}
                      className="opacity-0 -translate-x-1 translate-y-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-300 text-[#f28a2e]"
                    />

                  </Link>

                ))}

              </div>

            </motion.div>


            {/* =================================================
                VISIT
            ================================================= */}
            <motion.div
  className="col-span-1 lg:col-span-1"
  initial={{ opacity: 0, y: 15 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.6, delay: 0.1, ease }}
>

              <span className="text-white/25 text-[9px] uppercase tracking-[0.3em]">
                Visit
              </span>

              <div className="mt-5 space-y-5">

                {/* ADDRESS */}
                <div className="flex gap-3">

                  <MapPin
                    size={15}
                    className="text-[#f28a2e] mt-0.5 shrink-0"
                  />

                  <p className="text-white/55 text-xs leading-6">
                    Atulyam Restaurant
                    <br />
                    1/235 Awas Vikas Colony, Jhunsi
                     <br />
                    Prayagraj, Uttar Pradesh
                  </p>

                </div>


                {/* HOURS */}
                <div className="flex gap-3">

                  <Clock3
                    size={15}
                    className="text-[#f28a2e] mt-0.5 shrink-0"
                  />

                  <p className="text-white/55 text-xs leading-6">
                    Monday – Sunday
                    <br />
                    07:00 AM – 01:00 AM
                  </p>

                </div>

              </div>

            </motion.div>


            {/* =================================================
                CONNECT
            ================================================= */}
            <motion.div
  className="col-span-2 lg:col-span-1"
  initial={{ opacity: 0, y: 15 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.6, delay: 0.15, ease }}
>
              <span className="text-white/25 text-[9px] uppercase tracking-[0.3em]">
                Connect
              </span>

              <div className="mt-5 space-y-4">

                {/* PHONE */}
                <a
                  href="tel:+919335949448"
                  className="flex items-center gap-3 text-white/55 hover:text-[#f28a2e] text-xs transition-colors"
                >
                  <Phone size={15} className="shrink-0" />
                  <span>+91 9335949448 </span>
                </a>


                {/* EMAIL */}
                <a
                  href="mailto:info@atulyamhospitality.in"
                  className="flex items-start gap-3 text-white/55 hover:text-[#f28a2e] text-xs transition-colors"
                >
                  <Mail
                    size={15}
                    className="shrink-0 mt-0.5"
                  />

                  <span className="break-all">
                    info@atulyamhospitality.in
                  </span>
                </a>


                {/* SOCIALS */}
                <div className="flex items-center gap-2 pt-2">

                <a
  href="https://www.instagram.com/atulyam_restaurant/"
  target="_blank"
  rel="noopener noreferrer"
  aria-label="Instagram"
  className="w-9 h-9 border border-white/10 flex items-center justify-center text-white/40 hover:text-[#f28a2e] hover:border-[#f28a2e] transition-all duration-300"
>
  <Instagram size={15} />
</a>
                  <a
                    href="#"
                    aria-label="Facebook"
                    className="w-9 h-9 border border-white/10 flex items-center justify-center text-white/40 hover:text-[#f28a2e] hover:border-[#f28a2e] transition-all duration-300"
                  >
                    <Facebook size={15} />
                  </a>

                </div>

              </div>

            </motion.div>

          </div>

        </div>

{/* =================================================
    BOTTOM BAR
================================================= */}
<div className="pt-6 mt-0 border-t border-white/[0.06]">

  {/* MOBILE */}
  <div className="flex flex-col sm:hidden gap-5">

    {/* COPYRIGHT */}
    <p className="text-white/20 text-[8px] uppercase tracking-[0.14em] text-center">
      © {new Date().getFullYear()} Atulyam. All rights reserved.
    </p>

    {/* LINKS + TOP */}
    <div className="flex items-center justify-center gap-4">

      <Link
        to="/reservation"
        className="text-white/30 hover:text-white text-[8px] uppercase tracking-[0.14em] transition-colors"
      >
        Reservations
      </Link>

      <span className="w-1 h-1 rounded-full bg-white/15" />

      <Link
        to="/admin/login"
        className="text-white/30 hover:text-[#f28a2e] text-[8px] uppercase tracking-[0.14em] transition-colors"
      >
        Admin
      </Link>

      <span className="w-1 h-1 rounded-full bg-white/15" />

      <button
        type="button"
        onClick={() =>
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          })
        }
        aria-label="Back to top"
        className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-[#f28a2e]"
      >
        <ArrowUp size={13} strokeWidth={1.5} />
      </button>

    </div>

    {/* DESIGNED BY */}
    <p className="text-center text-white/15 text-[8px] uppercase tracking-[0.13em]">
      Designed by{" "}
      <a
        href="https://www.instagram.com/anshikaagr.webdev/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-white/30 hover:text-[#f28a2e] transition-colors"
      >
        anshikaagr.webdev
      </a>
    </p>

  </div>


 {/* DESKTOP */}
<div className="hidden sm:flex items-center justify-between">

  {/* COPYRIGHT — LEFT */}
  <p className="text-white/20 text-[9px] uppercase tracking-[0.18em]">
    © {new Date().getFullYear()} Atulyam. All rights reserved.
  </p>

  {/* RIGHT SIDE */}
  <div className="flex items-center gap-5">

    <Link
      to="/reservation"
      className="text-white/20 hover:text-white/60 text-[9px] uppercase tracking-[0.18em] transition-colors whitespace-nowrap"
    >
      Reservations
    </Link>

    <span className="w-1 h-1 rounded-full bg-white/15 shrink-0" />

    <Link
      to="/admin/login"
      className="text-white/20 hover:text-[#f28a2e] text-[9px] uppercase tracking-[0.18em] transition-colors whitespace-nowrap"
    >
      Admin
    </Link>

    <span className="w-1 h-1 rounded-full bg-white/15 shrink-0" />

    <span className="text-white/20 text-[9px] uppercase tracking-[0.18em] whitespace-nowrap">
      Designed by{" "}
      <a
        href="https://www.instagram.com/anshikaagr.webdev/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-white/35 hover:text-[#f28a2e] transition-colors"
      >
        anshikaagr.webdev
      </a>
    </span>

    {/* BACK TO TOP */}
    <button
      type="button"
      onClick={() =>
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        })
      }
      aria-label="Back to top"
      title="Back to Top"
      className="group ml-1 w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-[#f28a2e] hover:border-[#f28a2e] hover:bg-[#f28a2e]/5 transition-all duration-300 shrink-0"
    >
      <ArrowUp
        size={14}
        strokeWidth={1.5}
        className="transition-transform duration-300 group-hover:-translate-y-1"
      />
    </button>

  </div>

</div>

  </div>


</div>

    </footer>
  );
};

export default Footer;