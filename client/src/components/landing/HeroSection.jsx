import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Shield, Award, Sparkles, Play } from 'lucide-react';
import OrangSky from '../../assets/img/Orang Sky.webp';

/* ─── animation variants ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.72, ease: [0.22, 1, 0.36, 1], delay: i * 0.11 },
  }),
};

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden min-h-screen flex flex-col">

      {/* ════════════════════════════════
          BACKGROUND LAYERS
      ════════════════════════════════ */}

      {/* 1 — Hero background photo */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url('/hero-skybridge.webp')",
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          backgroundRepeat: 'no-repeat',
        }}
      />

      {/* 2 — Deep dark overlay (keeps text readable) */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(135deg, rgba(4,7,20,0.94) 0%, rgba(6,10,28,0.88) 45%, rgba(8,12,32,0.72) 70%, rgba(6,9,24,0.60) 100%)',
        }}
      />

      {/* 3 — Strong left-side darkening for text column */}
      <div
        className="absolute inset-y-0 left-0 w-full lg:w-[58%] pointer-events-none"
        style={{ background: 'linear-gradient(90deg, rgba(4,7,20,0.55) 0%, transparent 100%)' }}
      />

      {/* 4 — Atmospheric glow orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-48 -left-48 w-[750px] h-[750px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(79,70,229,0.30) 0%, transparent 70%)',
            filter: 'blur(70px)',
          }}
        />
        <div
          className="absolute top-0 right-0 w-[520px] h-[520px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(59,130,246,0.18) 0%, transparent 70%)',
            filter: 'blur(90px)',
          }}
        />
        <div
          className="absolute -bottom-10 left-1/3 w-[600px] h-[300px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(139,92,246,0.14) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
      </div>

      {/* 5 — Dot-grid texture (left-biased) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.055) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(ellipse 75% 65% at 25% 40%, black 15%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse 75% 65% at 25% 40%, black 15%, transparent 80%)',
        }}
      />

      {/* ════════════════════════════════
          MAIN CONTENT
      ════════════════════════════════ */}
      <div className="relative z-10 flex-1 flex items-center">
        <div className="w-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 pt-28 pb-12 lg:pt-32 lg:pb-16">
          <div className="flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-12">

            {/* ════ LEFT: Copy (60% wide on large screens) ════ */}
            <motion.div
              initial="hidden"
              animate="show"
              className="flex flex-col items-start lg:w-[52%] xl:w-[50%]"
            >
              {/* Badge pill — redesigned for a unique shape */}
              <motion.div variants={fadeUp} custom={0} className="mb-5">
                <span
                  className="inline-flex items-center gap-2.5 px-5 py-[10px] text-indigo-100 font-bold tracking-wide shadow-lg"
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: 'clamp(11px, 1.3vw, 13px)',
                    background: 'linear-gradient(135deg, rgba(99,102,241,0.25) 0%, rgba(59,130,246,0.15) 100%)',
                    border: '1px solid rgba(99,102,241,0.45)',
                    backdropFilter: 'blur(12px)',
                    borderRadius: '24px 4px 24px 4px', // Wavy asymmetrical shape
                    boxShadow: '0 8px 32px -8px rgba(99,102,241,0.5)',
                  }}
                >
                  {/* Custom Japanese "Hinomaru" style icon */}
                  <div className="relative w-4 h-4 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
                  </div>
                  Program Magang Jepang Terpercaya #1 di Indonesia
                </span>
              </motion.div>

              {/* ── Main Headline ── smaller & tighter */}
              <motion.h1
                variants={fadeUp}
                custom={1}
                className="text-white font-black leading-[1.09] tracking-[-0.03em] mb-5"
                style={{ 
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: 'clamp(32px, 5.5vw, 68px)',
                  letterSpacing: '0.02em'
                }}
              >
                Wujudkan Karir{' '}
                <span
                  style={{
                    backgroundImage: 'linear-gradient(135deg, #a5b4fc 0%, #60a5fa 50%, #34d399 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent',
                  }}
                >
                  Impianmu
                </span>
                <br className="hidden sm:block" />
                {' '}di Jepang
              </motion.h1>

              {/* Sub-headline */}
              <motion.p
                variants={fadeUp}
                custom={2}
                className="text-slate-300 mb-8"
                style={{ fontSize: 'clamp(14px, 1.7vw, 16.5px)', lineHeight: '1.78', maxWidth: '500px' }}
              >
                Belajar bahasa Jepang dari nol, ikuti pelatihan kerja resmi, dan raih
                program magang ke Jepang bersama{' '}
                <span className="text-white font-semibold">
                  SKYBRIDGE Nusantara International School
                </span>
                .
              </motion.p>

              {/* CTA buttons */}
              <motion.div variants={fadeUp} custom={3} className="flex flex-wrap gap-3 mb-9">
                <Link
                  to="/register"
                  id="hero-cta-primary"
                  className="inline-flex items-center gap-2 rounded-2xl text-white font-bold transition-all duration-300 hover:-translate-y-1 hover:brightness-115 active:scale-95"
                  style={{
                    padding: 'clamp(11px, 1.8vw, 15px) clamp(22px, 2.8vw, 30px)',
                    fontSize: 'clamp(13.5px, 1.5vw, 15px)',
                    background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 45%, #3b82f6 100%)',
                    boxShadow: '0 0 0 1px rgba(99,102,241,0.4), 0 8px 28px rgba(99,102,241,0.45), 0 2px 8px rgba(0,0,0,0.35)',
                    textDecoration: 'none',
                  }}
                >
                  Daftar Sekarang <ArrowRight size={15} />
                </Link>

                <Link
                  to="/kursus-bahasa-jepang-online"
                  id="hero-cta-secondary"
                  className="inline-flex items-center gap-2 rounded-2xl text-white font-semibold transition-all duration-300 hover:-translate-y-1 hover:bg-white/15 active:scale-95"
                  style={{
                    padding: 'clamp(11px, 1.8vw, 15px) clamp(22px, 2.8vw, 30px)',
                    fontSize: 'clamp(13.5px, 1.5vw, 15px)',
                    background: 'rgba(255,255,255,0.07)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    backdropFilter: 'blur(12px)',
                    textDecoration: 'none',
                  }}
                >
                  <Play size={13} className="fill-white/60" />
                  Lihat Program
                </Link>
              </motion.div>

              {/* Trust marks */}
              <motion.div variants={fadeUp} custom={4} className="flex flex-wrap items-center gap-x-5 gap-y-2">
                {[
                  { icon: Shield, text: 'Lembaga Resmi' },
                  { icon: Award,  text: 'Bersertifikat' },
                  { icon: Star,   text: '500+ Alumni' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-1.5 text-slate-400"
                    style={{ fontSize: 'clamp(11.5px, 1.3vw, 13px)' }}>
                    <Icon size={12} className="text-indigo-400/80" />
                    <span className="font-medium">{text}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* ════ RIGHT: Character Image (48% wide) ════ */}
            <motion.div
              initial={{ opacity: 0, x: 40, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: 0.24 }}
              className="lg:w-[48%] xl:w-[50%] flex items-end justify-center lg:justify-end relative"
            >
              {/* Photo glow halo */}
              <div
                className="absolute pointer-events-none"
                style={{
                  inset: '-30px',
                  background: 'radial-gradient(ellipse at 50% 70%, rgba(99,102,241,0.40) 0%, transparent 68%)',
                  filter: 'blur(55px)',
                }}
              />

              {/* Floating wrapper — animation removed */}
              <div
                className="relative w-full"
                style={{
                  maxWidth: 'clamp(350px, 55vw, 720px)',
                }}
              >
                {/* ── Orang Sky image — no card frame, transparent bg ── */}
                <img
                  src={OrangSky}
                  alt="SKYBRIDGE – Siap Berangkat ke Jepang"
                  className="relative w-full h-auto object-contain"
                  style={{
                    display: 'block',
                    filter: 'drop-shadow(0 30px 60px rgba(99,102,241,0.35)) drop-shadow(0 8px 20px rgba(0,0,0,0.6))',
                  }}
                  loading="eager"
                  fetchPriority="high"
                />

                {/* Bottom blend shadow — to make the image blend with the dark hero background */}
                <div 
                  className="absolute bottom-[-2px] inset-x-0 h-40 pointer-events-none z-[5]"
                  style={{
                    background: 'linear-gradient(to top, rgba(4,7,20,1) 0%, rgba(4,7,20,0.8) 25%, transparent 100%)',
                  }}
                />

                {/* Stat chip — bottom left, raised to avoid shadow, unique shape */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.95, duration: 0.55 }}
                  className="absolute bottom-12 left-2 sm:left-4 z-20"
                  style={{
                    background: 'rgba(4,7,20,0.72)',
                    backdropFilter: 'blur(24px)',
                    border: '1px solid rgba(99,102,241,0.45)',
                    borderRadius: '20px 4px 20px 4px',
                    padding: '12px 20px',
                    boxShadow: '0 12px 40px rgba(0,0,0,0.65)',
                  }}
                >
                  <div
                    className="font-black leading-none"
                    style={{
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: 'clamp(32px, 4.2vw, 40px)',
                      letterSpacing: '0.04em',
                      backgroundImage: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      color: 'transparent',
                    }}
                  >
                    98%
                  </div>
                  <div className="text-white font-bold mt-1" style={{ fontSize: 'clamp(10px, 1.2vw, 12px)', color: 'rgba(255,255,255,0.7)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    Tingkat Kelulusan
                  </div>
                </motion.div>

                {/* Alumni chip — top right, unique shape */}
                <motion.div
                  initial={{ opacity: 0, y: -14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1, duration: 0.5 }}
                  className="absolute top-6 right-2 sm:right-4 z-20"
                  style={{
                    background: 'rgba(4,7,20,0.72)',
                    backdropFilter: 'blur(24px)',
                    border: '1px solid rgba(99,102,241,0.40)',
                    borderRadius: '4px 20px 4px 20px',
                    padding: '10px 18px',
                    boxShadow: '0 12px 40px rgba(0,0,0,0.6)',
                  }}
                >
                  <div className="flex items-center gap-1.5">
                    <Star size={14} className="text-amber-400 fill-amber-400" />
                    <span
                      className="text-white font-black"
                      style={{ fontSize: 'clamp(14px, 1.8vw, 16px)', fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.04em' }}
                    >
                      500+ Alumni
                    </span>
                  </div>
                  <div className="text-slate-400 mt-0.5 font-bold" style={{ fontSize: '10px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    Berhasil ke Jepang
                  </div>
                </motion.div>
              </div>
            </motion.div>

          </div>
        </div>
      </div>

      {/* ════════════════════════════════
          WAVE DIVIDER → slate-50
      ════════════════════════════════ */}
      <div className="relative z-10 w-full leading-none pointer-events-none">
        <svg
          viewBox="0 0 1440 90"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="w-full block"
          style={{ height: 'clamp(40px, 6vw, 90px)' }}
        >
          <path
            d="M0,45 C180,90 360,0 540,45 C720,90 900,0 1080,45 C1260,90 1380,20 1440,45 L1440,90 L0,90 Z"
            fill="#f8fafc"
          />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
