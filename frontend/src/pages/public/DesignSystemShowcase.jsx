import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  Flame,
  UtensilsCrossed,
  ShieldCheck,
  CheckCircle2,
  Eye,
  Sliders,
  Play,
  RotateCcw,
} from 'lucide-react';
import Container from '../../components/ui/Container.jsx';
import Button from '../../components/ui/Button.jsx';
import SectionHeading from '../../components/ui/SectionHeading.jsx';
import ScrollReveal from '../../components/animation/ScrollReveal.jsx';
import ImageReveal from '../../components/animation/ImageReveal.jsx';
import LoadingScreen from '../../components/ui/LoadingScreen.jsx';

export const DesignSystemShowcase = () => {
  const [showLoaderModal, setShowLoaderModal] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);

  const toggleButtonLoading = () => {
    setButtonLoading(true);
    setTimeout(() => setButtonLoading(false), 2000);
  };

  return (
    <div className="pt-32 pb-24 space-y-28 overflow-hidden">
      {/* Temporary Loading Screen Preview Modal */}
      {showLoaderModal && (
        <div className="fixed inset-0 z-50">
          <LoadingScreen fullScreen={true} message="Demonstrating Luxury Loading Screen..." />
          <div className="fixed top-6 right-6 z-50">
            <button
              onClick={() => setShowLoaderModal(false)}
              className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-xs text-white uppercase tracking-widest backdrop-blur-md"
            >
              Close Preview [ESC]
            </button>
          </div>
        </div>
      )}

      {/* HERO SECTION: Architecture & Typographic Presence */}
      <section className="relative">
        <Container>
          <div className="text-center max-w-4xl mx-auto">
            {/* Kicker */}
            <ScrollReveal direction="down" delay={0.1}>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-400 text-[11px] font-semibold tracking-widest-xl uppercase mb-8 shadow-glow">
                <Sparkles className="w-3.5 h-3.5 text-brand-400" />
                <span>Phase 3: Luxury Design System & Component Library</span>
              </div>
            </ScrollReveal>

            {/* Monumental Headline */}
            <ScrollReveal direction="up" delay={0.2}>
              <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-ivory-100 font-normal tracking-tight leading-[1.04] mb-6">
                The Aesthetics of <br />
                <span className="italic font-light text-amber-gradient">
                  Haute Gastronomy
                </span>
              </h1>
            </ScrollReveal>

            {/* Editorial Lead Paragraph */}
            <ScrollReveal direction="up" delay={0.3}>
              <p className="text-base sm:text-lg md:text-xl text-ivory-300 font-light leading-relaxed max-w-2xl mx-auto mb-10">
                A bespoke, production-ready design language built for <span className="text-brand-400 font-medium">Atulyam</span>.
                Deep obsidian tones, radiant amber-orange accents, editorial serif typography, and
                whisper-smooth Framer Motion choreography.
              </p>
            </ScrollReveal>

            {/* Quick Action Trigger Buttons */}
            <ScrollReveal direction="up" delay={0.4}>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Button
                  variant="primary"
                  size="lg"
                  icon={ArrowRight}
                  onClick={() => {
                    const el = document.getElementById('buttons-showcase');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Explore Component Tokens
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  icon={Eye}
                  onClick={() => setShowLoaderModal(true)}
                >
                  Preview Loading Screen
                </Button>
              </div>
            </ScrollReveal>
          </div>
        </Container>
      </section>

      {/* 1. TYPOGRAPHY & SECTION HEADINGS SHOWCASE */}
      <section id="typography-showcase" className="relative">
        <Container>
          <SectionHeading
            eyebrow="Editorial Typography"
            title="Typographic Hierarchy &"
            highlight="Harmonic Spacing"
            description="Our typography celebrates classic Indian regal hospitality with Cormorant Garamond and Playfair Display serif headings paired with clean, geometric Plus Jakarta Sans."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            {/* Left Aligned Heading Example */}
            <div className="glass-card-luxury p-8 rounded-2xl">
              <span className="text-[10px] uppercase tracking-widest-xl text-brand-400 font-mono block mb-4">
                Token: Left-Aligned Editorial Heading
              </span>
              <SectionHeading
                align="left"
                eyebrow="Ancestral Recipes"
                title="Smoke & Embers of the"
                highlight="Royal Clay Tandoor"
                description="Marinated over 36 hours in cold-pressed mustard oil, hung curd, and stone-ground Kashmiri chillies."
                animate={false}
              />
            </div>

            {/* Typographic Scale Card */}
            <div className="glass-card-luxury p-8 rounded-2xl flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-widest-xl text-brand-400 font-mono block mb-4">
                  Token: Typographic Hierarchy & Scale
                </span>
                <div className="space-y-4">
                  <div>
                    <span className="text-[11px] text-ivory-500 font-mono block">Display Large / 48px Cormorant</span>
                    <h3 className="font-serif text-3xl sm:text-4xl text-ivory-100">Dum Pukht Gosht Biryani</h3>
                  </div>
                  <div>
                    <span className="text-[11px] text-ivory-500 font-mono block">Body Medium / 16px Plus Jakarta Sans</span>
                    <p className="text-sm text-ivory-300 leading-relaxed">
                      Fragrant basmati rice sealed in a traditional clay handi with dough rim, slow-steamed to unlock ethereal cardamom vapors.
                    </p>
                  </div>
                  <div>
                    <span className="text-[11px] text-ivory-500 font-mono block">Badge / 11px Monospace Widest</span>
                    <span className="text-xs uppercase tracking-widest-2xl text-brand-400 font-semibold">
                      ✦ Michelin Guide Selected 2026 ✦
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. BUTTONS & CTA TOKENS SHOWCASE */}
      <section id="buttons-showcase" className="relative">
        <Container>
          <SectionHeading
            eyebrow="Interactive Elements"
            title="Bespoke CTA & Button"
            highlight="Design Tokens"
            description="Engineered with subtle micro-interactions, silky hover transitions, and accessible focus states."
          />

          <div className="glass-card-luxury p-8 sm:p-12 rounded-3xl mt-12 space-y-10">
            {/* Primary & Secondary Rows */}
            <div>
              <h4 className="text-xs uppercase tracking-widest text-ivory-400 font-mono mb-4">
                1. Core Action Buttons (Primary, Secondary, Luxury Pill)
              </h4>
              <div className="flex flex-wrap items-center gap-4">
                <Button variant="primary" size="md" icon={ArrowRight}>
                  Primary CTA
                </Button>
                <Button variant="secondary" size="md">
                  Secondary Action
                </Button>
                <Button variant="luxury" size="md">
                  Luxury Outline
                </Button>
                <Button variant="outline" size="md">
                  Border Amber
                </Button>
                <Button variant="ghost" size="md">
                  Ghost Button
                </Button>
              </div>
            </div>

            {/* Sizes & Loading States */}
            <div className="pt-6 border-t border-white/[0.08]">
              <h4 className="text-xs uppercase tracking-widest text-ivory-400 font-mono mb-4">
                2. Sizing Scale & Asynchronous Loading States
              </h4>
              <div className="flex flex-wrap items-center gap-4">
                <Button variant="primary" size="sm">
                  Small (32px)
                </Button>
                <Button variant="primary" size="md">
                  Medium (44px)
                </Button>
                <Button variant="primary" size="lg">
                  Large (54px)
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  loading={buttonLoading}
                  onClick={toggleButtonLoading}
                >
                  {buttonLoading ? 'Processing...' : 'Click to Test Loading'}
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 3. IMAGE REVEAL & CULINARY PRESENTATION SHOWCASE */}
      <section id="imagery-showcase" className="relative">
        <Container>
          <SectionHeading
            eyebrow="Visual Storytelling"
            title="High-Definition Food &"
            highlight="Atmospheric Imagery"
            description="Cinematic presentation wrappers equipped with smooth hover zooms, aspect ratio locking, and dark vignette gradients."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mt-12">
            <ScrollReveal direction="up" delay={0.1}>
              <ImageReveal
                src="https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?q=80&w=800&auto=format&fit=crop"
                alt="Truffle Galouti Kebab"
                aspectRatio="aspect-[4/3]"
                badge="Chef's Signature"
                caption="Truffle Infused Galouti Kebab with Saffron Paratha"
              />
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.2}>
              <ImageReveal
                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800&auto=format&fit=crop"
                alt="The Amber Dining Hall"
                aspectRatio="aspect-[4/3]"
                badge="Ambience"
                caption="The Obsidian & Warm Brass Main Dining Salon"
              />
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.3}>
              <ImageReveal
                src="https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=800&auto=format&fit=crop"
                alt="Awadhi Gosht Dum Biryani"
                aspectRatio="aspect-[4/3]"
                badge="Heritage Dum"
                caption="Awadhi Mutton Dum Biryani Slow Cooked in Clay"
              />
            </ScrollReveal>
          </div>
        </Container>
      </section>

      {/* 4. SCROLL REVEAL & STAGGER MOTION SHOWCASE */}
      <section id="motion-showcase" className="relative">
        <Container>
          <SectionHeading
            eyebrow="Motion Choreography"
            title="Subtle Scroll Reveals &"
            highlight="Stagger Transitions"
            description="Zero jarring bounces. Only calm, editorial transitions that heighten the luxury dining experience."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <ScrollReveal direction="left" delay={0.1}>
              <div className="glass-card-luxury p-8 rounded-2xl h-full border-l-2 border-brand-500">
                <div className="w-10 h-10 rounded-full bg-brand-500/10 flex items-center justify-center text-brand-400 mb-4">
                  <Flame className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-xl text-ivory-100 mb-2">Direction: Slide In Left</h3>
                <p className="text-xs text-ivory-400 leading-relaxed">
                  Smooth entrance using cubic-bezier [0.16, 1, 0.3, 1] with subtle distance and gentle opacity ramp.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.2}>
              <div className="glass-card-luxury p-8 rounded-2xl h-full border-t-2 border-brand-500">
                <div className="w-10 h-10 rounded-full bg-brand-500/10 flex items-center justify-center text-brand-400 mb-4">
                  <UtensilsCrossed className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-xl text-ivory-100 mb-2">Direction: Slide In Up</h3>
                <p className="text-xs text-ivory-400 leading-relaxed">
                  Classic vertical reveal with subtle 24px displacement, perfect for editorial paragraphs and cards.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right" delay={0.3}>
              <div className="glass-card-luxury p-8 rounded-2xl h-full border-r-2 border-brand-500">
                <div className="w-10 h-10 rounded-full bg-brand-500/10 flex items-center justify-center text-brand-400 mb-4">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-xl text-ivory-100 mb-2">Direction: Slide In Right</h3>
                <p className="text-xs text-ivory-400 leading-relaxed">
                  Refined horizontal entry that guides the eye effortlessly across asymmetric editorial layouts.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </Container>
      </section>

      {/* 5. SYSTEM READINESS SUMMARY */}
      <section className="relative">
        <Container>
          <div className="glass-surface p-8 sm:p-10 rounded-3xl border border-brand-500/30 text-center max-w-3xl mx-auto shadow-glow-subtle">
            <span className="text-[11px] uppercase tracking-widest-xl text-brand-400 font-semibold block mb-2">
              ✦ Design System Checklist ✦
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-ivory-100 mb-4">
              All Foundation Components Operational
            </h3>
            <p className="text-sm text-ivory-400 font-light leading-relaxed mb-6">
              Navbar, Footer, SectionHeadings, Buttons, Container, ScrollReveal, ImageReveal,
              PageTransition, and LoadingScreen are active, responsive, and ready for full page assembly.
            </p>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4" />
              <span>Verified Across Desktop, Tablet & Mobile Breakpoints</span>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default DesignSystemShowcase;
