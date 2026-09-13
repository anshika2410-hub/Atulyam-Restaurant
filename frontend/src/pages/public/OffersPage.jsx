import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Tag,
  Copy,
  Check,
  Sparkles,
  ArrowUpRight,
  Clock3,
  ShoppingBag,
  X,
} from "lucide-react";

const API_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api/v1";

const ease = [0.22, 1, 0.36, 1];

const formatPrice = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN")}`;

const formatDate = (value) => {
  if (!value) return "No expiry";
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "No expiry";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export default function OffersPage() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copiedCode, setCopiedCode] = useState("");
  const [selectedOffer, setSelectedOffer] = useState(null);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/offers?active_only=true`
        );

        if (!response.ok) {
          throw new Error("Failed to load offers.");
        }

        const data = await response.json();
        const now = new Date();

        const activeOffers = data.filter((offer) => {
          if (!offer.is_active) return false;

          const start = offer.valid_from
            ? new Date(offer.valid_from)
            : null;

          const end = offer.valid_until
            ? new Date(offer.valid_until)
            : null;

          if (start && now < start) return false;
          if (end && now > end) return false;

          return true;
        });

        setOffers(activeOffers);
      } catch (err) {
        console.error(err);
        setError("Unable to load offers right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, []);

  const copyCode = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);

      setTimeout(() => {
        setCopiedCode("");
      }, 1800);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main className="min-h-screen bg-[#080808] text-white overflow-hidden">
     

      {/* OFFERS */}
      <section className="max-w-7xl mx-auto px-5 mt-24 md:px-5 lg:px-12 pb-28">
        {loading ? (
          <div className="py-24 text-center">
            <div className="w-9 h-9 border-2 border-white/10 border-t-[#f28a2e] rounded-full animate-spin mx-auto" />

            <p className="mt-5 text-white/35 text-xs uppercase tracking-wider">
              Finding your offers...
            </p>
          </div>
        ) : error ? (
          <div className="py-24 text-center border border-white/10">
            <Tag className="mx-auto text-white/20" size={30} />

            <p className="text-red-400 text-sm mt-5">
              {error}
            </p>
          </div>
        ) : offers.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-28 text-center border border-white/10 bg-[#0d0d0d]"
          >
            <Sparkles
              size={34}
              className="mx-auto text-[#f28a2e]/50"
            />

            <h3 className="font-serif text-3xl mt-6">
              Something special is coming.
            </h3>

            <p className="text-white/35 text-sm mt-3">
              There are no active offers at the moment.
            </p>
          </motion.div>
        ) : (
          <>
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-[#f28a2e] text-[10px] uppercase tracking-[0.25em] mb-3">
                  Current Offers!
                </p>

                <h2 className="font-serif text-4xl md:text-5xl font-light">
                  Exclusive savings
                </h2>
              </div>

              <span className="hidden sm:block text-white/25 text-xs">
                {offers.length}{" "}
                {offers.length === 1 ? "offer" : "offers"}
              </span>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {offers.map((offer, index) => {
                const minimum =
                  Number(offer.min_order_amount) || 0;

                return (
                  <motion.article
                    key={offer.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.6,
                      delay: index * 0.08,
                      ease,
                    }}
                    whileHover={{ y: -5 }}
                    className="group relative overflow-hidden border border-white/10 bg-[#101010]"
                  >
                    {/* ORANGE SIDE */}
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#f28a2e]" />

                    {/* DECORATION */}
                    <div className="absolute -right-20 -top-20 w-56 h-56 rounded-full border border-[#f28a2e]/10" />
                    <div className="absolute -right-10 -top-10 w-36 h-36 rounded-full border border-[#f28a2e]/10" />

                    <div className="relative p-7 md:p-9">
                      <div className="flex items-start justify-between gap-6">
                        <div>
                          <div className="w-11 h-11 border border-[#f28a2e]/25 bg-[#f28a2e]/10 flex items-center justify-center text-[#f28a2e]">
                            <Tag size={18} />
                          </div>

                          <p className="mt-7 text-[#f28a2e] text-[10px] uppercase tracking-[0.22em]">
                            Exclusive offer
                          </p>

                          <h3 className="font-serif text-3xl md:text-4xl mt-2 leading-tight">
                            {offer.title}
                          </h3>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="font-serif text-5xl md:text-6xl text-[#f28a2e] leading-none">
                            {offer.discount_percentage}
                          </span>

                          <span className="block text-[#f28a2e] text-xs uppercase tracking-[0.18em] mt-1">
                            % off
                          </span>
                        </div>
                      </div>

                      {offer.description && (
                        <p className="mt-7 text-white/40 text-sm leading-relaxed max-w-lg">
                          {offer.description}
                        </p>
                      )}

                      {/* CODE */}
                      <div className="mt-8 p-4 border border-dashed border-white/15 bg-white/[0.025]">
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <p className="text-[9px] uppercase tracking-[0.2em] text-white/25">
                              Coupon code
                            </p>

                            <p className="font-mono text-base md:text-lg tracking-[0.2em] text-white mt-1">
                              {offer.code}
                            </p>
                          </div>

                          <button
                            onClick={() => copyCode(offer.code)}
                            className="shrink-0 flex items-center gap-2 px-4 py-2.5 border border-white/15 text-white/60 hover:border-[#f28a2e] hover:text-[#f28a2e] transition-all text-[10px] uppercase tracking-wider"
                          >
                            {copiedCode === offer.code ? (
                              <>
                                <Check size={13} />
                                Copied
                              </>
                            ) : (
                              <>
                                <Copy size={13} />
                                Copy
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* DETAILS */}
                      <div className="mt-5 grid grid-cols-2 gap-4">
                        <div className="border-t border-white/10 pt-4">
                          <p className="text-[9px] uppercase tracking-[0.18em] text-white/25">
                            Minimum order
                          </p>

                          <p className="text-sm text-white/70 mt-1">
                            {minimum > 0
                              ? formatPrice(minimum)
                              : "No minimum"}
                          </p>
                        </div>

                        <div className="border-t border-white/10 pt-4">
                          <p className="text-[9px] uppercase tracking-[0.18em] text-white/25">
                            Valid until
                          </p>

                          <p className="text-sm text-white/70 mt-1">
                            {formatDate(offer.valid_until)}
                          </p>
                        </div>
                      </div>

                    </div>
                  </motion.article>
                );
              })}
            </div>
          </>
        )}
      </section>

      {/* BOTTOM CTA */}
      <section className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-5 md:px-8 lg:px-12 py-20 md:py-28">
          <div className="relative overflow-hidden border border-white/10 bg-[#0d0d0d] p-8 md:p-14">
            <div className="absolute right-0 top-0 w-72 h-72 bg-[#f28a2e]/10 blur-[100px]" />

            <div className="relative z-10 max-w-2xl">
              <p className="text-[#f28a2e] text-[10px] uppercase tracking-[0.25em]">
                Ready when you are
              </p>

              <h2 className="font-serif text-4xl md:text-6xl font-light mt-4 leading-tight">
                Good food.
                <br />
                <span className="italic text-[#f28a2e]">
                  Better value.
                </span>
              </h2>

              <p className="text-white/35 text-sm leading-relaxed mt-5 max-w-lg">
                Pick your favourite offer, copy the code and
                continue to your online order.
              </p>

              <a
                href="/order-online"
                className="inline-flex items-center gap-2 mt-8 bg-[#f28a2e] text-black px-6 py-3.5 text-[10px] uppercase tracking-[0.18em] font-semibold hover:bg-white transition-colors"
              >
                Order online
                <ArrowUpRight size={15} />
              </a>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}