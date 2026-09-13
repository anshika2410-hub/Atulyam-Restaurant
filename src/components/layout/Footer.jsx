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
                className="inline-flex items-center gap-3 group"
              >

                <div className="w-10 h-10 border border-white/15 flex items-center justify-center group-hover:border-[#f28a2e] transition-colors duration-300">
                  <span className="font-serif italic text-[#f28a2e] text-lg">
                    A
                  </span>
                </div>

                <span className="font-serif text-xl tracking-[0.18em] uppercase">
                  Atulyam
                </span>

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
                    11:00 AM – 11:00 PM
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
                  href="tel:+919451234567"
                  className="flex items-center gap-3 text-white/55 hover:text-[#f28a2e] text-xs transition-colors"
                >
                  <Phone size={15} className="shrink-0" />
                  <span>+91 94512 34567</span>
                </a>


                {/* EMAIL */}
                <a
                  href="mailto:hello@atulyamhospitality.in"
                  className="flex items-start gap-3 text-white/55 hover:text-[#f28a2e] text-xs transition-colors"
                >
                  <Mail
                    size={15}
                    className="shrink-0 mt-0.5"
                  />

                  <span className="break-all">
                    hello@atulyamhospitality.in
                  </span>
                </a>


                {/* SOCIALS */}
                <div className="flex items-center gap-2 pt-2">

                  <a
                    href="#"
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
<div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">

  {/* COPYRIGHT */}
  <p className="text-white/20 text-[9px] uppercase tracking-[0.18em] text-center sm:text-left">
    © {new Date().getFullYear()} Atulyam. All rights reserved.
  </p>

  {/* RIGHT LINKS */}
  <div className="flex items-center gap-5">

    <Link
  to="/reservation"
  className="text-white/20 hover:text-white/50 text-[9px] uppercase tracking-[0.18em] transition-colors"
>
  Reservations
</Link>

    <span className="w-1 h-1 rounded-full bg-white/15" />

    <Link
      to="/admin/login"
      className="text-white/20 hover:text-[#f28a2e] text-[9px] uppercase tracking-[0.18em] transition-colors"
    >
      Admin
    </Link>

    <span className="w-1 h-1 rounded-full bg-white/15" />

  <span className="text-white/20 text-[9px] uppercase tracking-[0.18em]">
  Designed by{' '}
  <a
    href="https://www.instagram.com/anshikaagr.webdev/"
    target="_blank"
    rel="noopener noreferrer"
    className="text-white/40 hover:text-[#f28a2e] transition-colors"
  >
    anshikaagr.webdev
  </a>
</span>
{/* BACK TO TOP */} <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth', }) } aria-label="Back to top" title="Back to Top" className="group ml-1 w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-[#f28a2e] hover:border-[#f28a2e] hover:bg-[#f28a2e]/5 transition-all duration-300" > <ArrowUp size={15} strokeWidth={1.5} className="transition-transform duration-300 group-hover:-translate-y-1" /> </button>
  </div>

</div>
      </div>

    </footer>
  );
};

export default Footer;