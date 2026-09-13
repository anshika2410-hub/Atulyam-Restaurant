import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowUpRight,
  Image as ImageIcon,
  Play,
  Phone,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;
const BACKEND_URL = API_URL.replace("/api/v1", "");

const OCCASION_DATA = {
  weddings: {
    name: "Weddings",
    eyebrow: "Catering · Celebrations",
    short: "Celebrations, beautifully served.",
    description:
      "Elegant catering crafted for celebrations that deserve to be remembered.",
  },
  "corporate-events": {
    name: "Corporate Events",
    eyebrow: "Catering · Corporate",
    short: "Exceptional hospitality for every occasion.",
    description:
      "Professional menus and seamless service for meetings, launches and gatherings.",
  },
  "private-parties": {
    name: "Private Parties",
    eyebrow: "Catering · Private",
    short: "Intimate gatherings. Remarkable experiences.",
    description:
      "Bring the Atulyam experience home for birthdays, anniversaries and special evenings.",
  },
};

export default function CateringOccasionPage() {
  const { occasion } = useParams();

  const occasionData = OCCASION_DATA[occasion];

  const [mediaItems, setMediaItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/catering-media/`);

        if (!response.ok) {
          throw new Error("Unable to load catering media.");
        }

        const data = await response.json();
        setMediaItems(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setError("Unable to load catering media.");
      } finally {
        setLoading(false);
      }
    };

    fetchMedia();
  }, []);

  const occasionMedia = useMemo(() => {
    if (!occasionData) return [];

    return mediaItems
      .filter((item) => item.occasion === occasionData.name)
      .sort(
        (a, b) =>
          Number(a.display_order || 0) -
          Number(b.display_order || 0)
      );
  }, [mediaItems, occasionData]);

  const getMediaUrl = (url) => {
    if (!url) return "";

    if (url.startsWith("http")) {
      return url;
    }

    return `${BACKEND_URL}${url}`;
  };

  if (!occasionData) {
    return (
      <main className="min-h-screen bg-[#070707] text-white flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-[#f28a2e] text-[10px] uppercase tracking-[0.3em] mb-4">
            Atulyam Catering
          </p>

          <h1 className="font-serif text-4xl md:text-6xl mb-7">
            Occasion Not Found
          </h1>

          <Link
            to="/catering"
            className="inline-flex items-center gap-3 border border-white/15 px-6 py-3 text-[10px] uppercase tracking-[0.2em] hover:border-[#f28a2e] hover:text-[#f28a2e] transition-all"
          >
            <ArrowLeft size={14} />
            Back to Catering
          </Link>
        </div>
      </main>
    );
  }

  const featuredMedia = occasionMedia[0];
  const remainingMedia = occasionMedia.slice(1);

  return (
    <main className="min-h-screen bg-[#070707] text-white overflow-hidden">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="pt-28 md:pt-32 px-5 md:px-10 lg:px-16">

        <div className="max-w-[1380px] mx-auto">

          {/* Breadcrumb */}
          <div className="flex items-center justify-between mb-10 md:mb-14">

            <Link
              to="/catering"
              className="group inline-flex items-center gap-3 text-white/40 hover:text-white text-[10px] uppercase tracking-[0.22em] transition-colors"
            >
              <span className="w-7 h-px bg-white/20 group-hover:bg-[#f28a2e] group-hover:w-10 transition-all" />
              Back to Catering
            </Link>

            <span className="text-white/20 text-[9px] uppercase tracking-[0.3em]">
              Atulyam
            </span>

          </div>

          {/* Hero Grid */}
          <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-10 lg:gap-16 items-end">

            {/* Left */}
            <motion.div
              initial={{ opacity: 0, x: -25 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="pb-2"
            >

              <div className="flex items-center gap-3 mb-6">
                <span className="w-9 h-px bg-[#f28a2e]" />

                <span className="text-[#f28a2e] text-[9px] uppercase tracking-[0.28em]">
                  {occasionData.eyebrow}
                </span>
              </div>

              <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-[82px] leading-[0.9] tracking-[-0.04em]">
                {occasionData.name}
              </h1>

              <p className="font-serif italic text-white/45 text-xl md:text-2xl mt-7 max-w-lg leading-snug">
                {occasionData.short}
              </p>

              <p className="text-white/35 text-sm leading-7 mt-5 max-w-md">
                {occasionData.description}
              </p>

              <div className="flex items-center gap-8 mt-8">

                <div>
                  <p className="text-[#f28a2e] font-serif text-2xl">
                    {String(occasionMedia.length).padStart(2, "0")}
                  </p>

                  <p className="text-white/25 text-[8px] uppercase tracking-[0.2em] mt-1">
                    Moments
                  </p>
                </div>

                <div className="w-px h-8 bg-white/10" />

                <div>
                  <p className="text-white/80 font-serif text-2xl">
                    Atulyam
                  </p>

                  <p className="text-white/25 text-[8px] uppercase tracking-[0.2em] mt-1">
                    Luxury Dining
                  </p>
                </div>

              </div>

            </motion.div>


            {/* Featured Media */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="relative"
            >

              <div className="relative aspect-[16/10] overflow-hidden bg-[#0d0d0d]">

                {featuredMedia ? (
                  featuredMedia.media_type === "video" ? (
                    <video
                      src={getMediaUrl(featuredMedia.media_url)}
                      className="w-full h-full object-cover"
                      controls
                      playsInline
                      preload="metadata"
                    />
                  ) : (
                    <img
                      src={getMediaUrl(featuredMedia.media_url)}
                      alt={featuredMedia.title || occasionData.name}
                      className="w-full h-full object-cover"
                    />
                  )
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon
                      size={35}
                      className="text-white/10"
                    />
                  </div>
                )}

                {/* Orange corner */}
                <div className="absolute top-0 right-0 w-16 h-16 border-t border-r border-[#f28a2e]/60 pointer-events-none" />

                {/* Label */}
                {featuredMedia && (
                  <div className="absolute left-5 bottom-5 pointer-events-none">
                    <span className="inline-flex items-center gap-2 bg-black/70 backdrop-blur-md px-3 py-2 text-[8px] uppercase tracking-[0.2em] text-white/75">
                      {featuredMedia.media_type === "video" ? (
                        <>
                          <Play size={9} />
                          Featured Video
                        </>
                      ) : (
                        <>
                          <ImageIcon size={9} />
                          Featured Moment
                        </>
                      )}
                    </span>
                  </div>
                )}

              </div>

              {/* Small caption */}
              {featuredMedia?.title && (
                <div className="flex items-center justify-between mt-4">
                  <p className="font-serif text-lg text-white/75">
                    {featuredMedia.title}
                  </p>

                  <span className="text-[#f28a2e] text-[9px] tracking-[0.2em]">
                    01
                  </span>
                </div>
              )}

            </motion.div>

          </div>

        </div>

      </section>


      {/* =====================================================
          DIVIDER
      ===================================================== */}

      <div className="max-w-[1380px] mx-auto px-5 md:px-10 lg:px-16 mt-20 md:mt-24">
        <div className="h-px bg-white/10" />
      </div>


      {/* =====================================================
          GALLERY
      ===================================================== */}

      <section className="px-5 md:px-10 lg:px-16 py-16 md:py-20">

        <div className="max-w-[1380px] mx-auto">

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-10 md:mb-12">

            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-[#f28a2e] text-[9px] uppercase tracking-[0.3em]">
                  The Collection
                </span>

                <span className="w-16 h-px bg-white/10" />
              </div>

              <h2 className="font-serif text-3xl md:text-5xl leading-none">
                Moments from{" "}
                <span className="italic text-white/45">
                  {occasionData.name.toLowerCase()}
                </span>
              </h2>
            </div>

            {!loading && occasionMedia.length > 0 && (
              <p className="text-white/25 text-[9px] uppercase tracking-[0.22em]">
                {occasionMedia.length}{" "}
                {occasionMedia.length === 1 ? "Moment" : "Moments"}
              </p>
            )}

          </div>


          {/* Loading */}
          {loading && (
            <div className="min-h-[280px] flex flex-col items-center justify-center border border-white/10 bg-[#0a0a0a]">
              <div className="w-8 h-8 border border-white/10 border-t-[#f28a2e] rounded-full animate-spin mb-5" />

              <p className="text-white/30 text-xs uppercase tracking-[0.18em]">
                Loading collection
              </p>
            </div>
          )}


          {/* Error */}
          {!loading && error && (
            <div className="min-h-[280px] flex items-center justify-center border border-white/10">
              <p className="text-red-300/60 text-sm">
                {error}
              </p>
            </div>
          )}


          {/* Empty */}
          {!loading && !error && occasionMedia.length === 0 && (
            <div className="min-h-[320px] flex flex-col items-center justify-center border border-dashed border-white/10 bg-[#0a0a0a]">

              <ImageIcon
                size={32}
                strokeWidth={1}
                className="text-white/15 mb-5"
              />

              <h3 className="font-serif text-3xl text-white/65">
                Coming Soon
              </h3>

              <p className="text-white/25 text-xs mt-3">
                Our {occasionData.name.toLowerCase()} collection
                will appear here soon.
              </p>

            </div>
          )}


          {/* Gallery */}
          {!loading && !error && remainingMedia.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">

              {remainingMedia.map((item, index) => {

                const mediaUrl = getMediaUrl(item.media_url);

                return (
                  <motion.article
                    key={item.id}
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{
                      once: true,
                      amount: 0.15,
                    }}
                    transition={{
                      duration: 0.55,
                      delay: index * 0.06,
                    }}
                    className="group"
                  >

                    {/* Media */}
                    <div className="relative aspect-[4/3] overflow-hidden bg-[#0c0c0c]">

                      {item.media_type === "video" ? (
                        <video
                          src={mediaUrl}
                          className="w-full h-full object-cover"
                          controls
                          playsInline
                          preload="metadata"
                        />
                      ) : (
                        <img
                          src={mediaUrl}
                          alt={item.title || occasionData.name}
                          loading="lazy"
                          className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-[1.035] transition-all duration-700"
                        />
                      )}

                      {/* Bottom gradient */}
                      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />

                      {/* Number */}
                      <span className="absolute left-4 bottom-4 text-white/70 font-serif italic text-sm pointer-events-none">
                        {String(index + 2).padStart(2, "0")}
                      </span>

                      {/* Type */}
                      <span className="absolute right-4 top-4 inline-flex items-center gap-2 bg-black/65 backdrop-blur-md px-3 py-2 text-[8px] uppercase tracking-[0.18em] text-white/65 pointer-events-none">
                        {item.media_type === "video" ? (
                          <>
                            <Play size={9} />
                            Video
                          </>
                        ) : (
                          <>
                            <ImageIcon size={9} />
                            Image
                          </>
                        )}
                      </span>

                    </div>


                    {/* Info */}
                    <div className="pt-4 pb-2">

                      <div className="flex items-start justify-between gap-4">

                        <div>
                          <h3 className="font-serif text-xl text-white/85">
                            {item.title || "Atulyam Moment"}
                          </h3>

                          {item.description && (
                            <p className="text-white/30 text-xs leading-5 mt-2 max-w-sm">
                              {item.description}
                            </p>
                          )}
                        </div>

                        <ArrowUpRight
                          size={17}
                          strokeWidth={1}
                          className="text-white/20 group-hover:text-[#f28a2e] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 mt-1"
                        />

                      </div>

                      <div className="h-px bg-white/10 group-hover:bg-[#f28a2e]/40 mt-4 transition-colors" />

                    </div>

                  </motion.article>
                );
              })}

            </div>
          )}

        </div>

      </section>


      {/* =====================================================
          EXPERIENCE STRIP
      ===================================================== */}

      <section className="px-5 md:px-10 lg:px-16 pb-20">

        <div className="max-w-[1380px] mx-auto">

          <div className="bg-[#0b0b0b] border border-white/10 px-6 md:px-10 py-8 md:py-10">

            <div className="grid md:grid-cols-3 gap-8 md:gap-5 items-center">

              <div>
                <p className="text-[#f28a2e] text-[8px] uppercase tracking-[0.25em] mb-2">
                  Atulyam Catering
                </p>

                <h3 className="font-serif text-2xl md:text-3xl">
                  Crafted around your occasion.
                </h3>
              </div>

              <div className="md:border-l md:border-white/10 md:pl-8">
                <p className="text-white/35 text-xs leading-6 max-w-sm">
                  From intimate gatherings to grand celebrations,
                  our culinary team brings the Atulyam experience
                  wherever your occasion takes place.
                </p>
              </div>

              <div className="md:text-right">
                <Link
                  to="/catering"
                  className="inline-flex items-center gap-3 text-[#f28a2e] text-[9px] uppercase tracking-[0.22em] hover:text-white transition-colors"
                >
                  Explore Catering
                  <ArrowUpRight size={14} />
                </Link>
              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          FINAL CTA
      ===================================================== */}

      <section className="px-5 md:px-10 lg:px-16 pb-20 md:pb-28">

        <div className="max-w-[1380px] mx-auto">

          <div className="relative overflow-hidden border-t border-white/10 pt-14 md:pt-20">

            <div className="absolute right-0 top-12 w-72 h-72 bg-[#f28a2e]/[0.035] blur-[100px] pointer-events-none" />

            <div className="relative flex flex-col md:flex-row md:items-end justify-between gap-10">

              <div className="max-w-2xl">

                <p className="text-[#f28a2e] text-[9px] uppercase tracking-[0.3em] mb-5">
                  Plan Your Celebration
                </p>

                <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl leading-[0.95] tracking-[-0.025em]">
                  Your occasion.
                  <br />
                  <span className="italic text-white/45">
                    Our hospitality.
                  </span>
                </h2>

                <p className="text-white/30 text-sm leading-6 mt-6 max-w-md">
                  Tell us about your event and let the Atulyam team
                  create a dining experience made around you.
                </p>

              </div>


              <div className="flex flex-wrap gap-3">

                <a
                  href="tel:+919451234567"
                  className="inline-flex items-center gap-3 bg-[#f28a2e] text-black px-6 py-4 text-[9px] uppercase tracking-[0.2em] hover:bg-[#ff9a42] transition-colors"
                >
                  <Phone size={13} />
                  Discuss Your Event
                </a>

                <Link
                  to="/catering"
                  className="inline-flex items-center gap-3 border border-white/15 px-6 py-4 text-[9px] uppercase tracking-[0.2em] text-white/80 hover:border-[#f28a2e] hover:text-[#f28a2e] transition-all"
                >
                  Back to Catering
                  <ArrowUpRight size={13} />
                </Link>

              </div>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}