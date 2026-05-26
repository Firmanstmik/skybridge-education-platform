import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Home, UserPlus, ClipboardCheck, BookOpen, ChevronRight } from 'lucide-react';
import Logo from '../assets/img/SKYBRIDGE_LOGO.webp';

const navLinks = [
  { path: '/', label: 'Beranda', icon: Home },
  { path: '/kursus-bahasa-jepang-online', label: 'Kursus', icon: BookOpen },
  { path: '/pelatihan-kerja-ke-jepang', label: 'Pelatihan', icon: ClipboardCheck },
  { path: '/magang-ke-jepang', label: 'Magang', icon: UserPlus },
  { path: '/blog', label: 'Blog', icon: BookOpen },
  { path: '/student/check-status', label: 'Cek Status', icon: ClipboardCheck },
];

/* ─── detect if we're on a dark-hero page (landing) ─── */
const DARK_HERO_PATHS = ['/'];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;
  const isDarkHeroPage = DARK_HERO_PATHS.includes(location.pathname);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    // Always initialise correctly (e.g. page loaded at scroll position)
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  /* ─── derived states ─── */
  // On dark-hero pages: start transparent, blur on scroll
  // On all other pages: always show the glass bar
  const showSolid = !isDarkHeroPage || scrolled;

  return (
    <>
      <style>{`
        /* Animated underline on hover */
        .nav-link-hover {
          position: relative;
        }
        .nav-link-hover::after {
          content: '';
          position: absolute;
          left: 50%;
          bottom: -2px;
          width: 0;
          height: 2px;
          border-radius: 9999px;
          background: linear-gradient(90deg, #6366f1, #3b82f6);
          transition: width 0.28s cubic-bezier(0.4,0,0.2,1), left 0.28s cubic-bezier(0.4,0,0.2,1);
        }
        .nav-link-hover:hover::after,
        .nav-link-hover.active::after {
          width: 70%;
          left: 15%;
        }
        /* CTA glow pulse */
        @keyframes glow-pulse {
          0%, 100% { box-shadow: 0 0 12px 2px rgba(99,102,241,0.35); }
          50% { box-shadow: 0 0 24px 6px rgba(99,102,241,0.55); }
        }
        .cta-glow:hover {
          animation: glow-pulse 2s ease-in-out infinite;
        }
        /* Float animation for hero image */
        @keyframes float-y {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-14px); }
        }
        .float-anim {
          animation: float-y 5s ease-in-out infinite;
        }
        /* Radial glow background */
        .radial-glow {
          background: radial-gradient(ellipse 80% 50% at 50% 0%, rgba(99,102,241,0.22) 0%, transparent 70%);
        }
        /* Gradient border card trick */
        .gradient-border {
          position: relative;
          background: white;
          z-index: 0;
        }
        .gradient-border::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          padding: 1.5px;
          background: linear-gradient(135deg, rgba(99,102,241,0.35), rgba(59,130,246,0.2), rgba(139,92,246,0.25));
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .gradient-border:hover::before {
          opacity: 1;
        }
        /* Noise texture */
        .noise-overlay {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          opacity: 0.03;
        }
      `}</style>

      <nav className="sticky top-0 z-50 w-full">
        {/* ── Main bar ── */}
        <div
          className={`w-full transition-all duration-300 ${
            showSolid
              ? 'bg-slate-950/80 backdrop-blur-2xl border-b border-white/[0.06] shadow-2xl shadow-black/30'
              : 'bg-transparent'
          }`}
        >
          {/* Top rainbow line – only when solid */}
          {showSolid && (
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent pointer-events-none" />
          )}

          <div className="max-w-7xl mx-auto px-6 h-[66px] flex items-center justify-between gap-8">

            {/* ── Logo ── */}
            <Link to="/" className="flex items-center gap-3 group flex-shrink-0" style={{ textDecoration: 'none' }}>
              <div className="relative w-10 h-10 flex-shrink-0">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-500/20 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
                <img src={Logo} alt="SKYBRIDGE Logo" className="relative w-10 h-10 object-contain" />
              </div>
              <div className="hidden sm:block">
                <div className="text-white font-black text-[18px] leading-none tracking-tight" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.04em' }}>SKYBRIDGE</div>
                <div className="text-indigo-400/80 text-[9.5px] font-semibold tracking-[0.18em] uppercase leading-none mt-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Nusantara International School
                </div>
              </div>
            </Link>

            {/* ── Desktop Links ── */}
            <div className="hidden md:flex items-center gap-0.5 flex-1 justify-center">
              {navLinks.map(({ path, label }) => (
                <Link
                  key={path}
                  to={path}
                  style={{ textDecoration: 'none', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  className={`nav-link-hover ${isActive(path) ? 'active' : ''} px-4 py-2 rounded-xl text-[13.5px] font-semibold tracking-wide transition-colors duration-200 ${
                    isActive(path) ? 'text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {label}
                </Link>
              ))}
            </div>

            {/* ── CTA + Mobile toggle ── */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <Link
                to="/register"
                id="navbar-cta"
                className="cta-glow hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-blue-500 text-white text-[13px] font-bold tracking-wide transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110"
                style={{ textDecoration: 'none', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                Pendaftaran <ChevronRight size={14} />
              </Link>

              <button
                className="md:hidden w-10 h-10 rounded-xl border border-white/12 bg-white/8 flex items-center justify-center text-white hover:bg-white/15 transition-colors duration-200"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle menu"
              >
                {isOpen ? <X size={19} /> : <Menu size={19} />}
              </button>
            </div>
          </div>
        </div>

        {/* ── Mobile Backdrop ── */}
        <div
          className={`md:hidden fixed inset-0 bg-black/70 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
          onClick={() => setIsOpen(false)}
        />

        {/* ── Mobile Drawer ── */}
        <div
          className={`md:hidden fixed top-0 right-0 h-full w-[300px] max-w-[90vw] bg-slate-950 border-l border-white/8 z-50 flex flex-col transition-transform duration-300 ease-out ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Top gradient accent */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-500/60 to-transparent" />

          {/* Drawer header */}
          <div className="flex items-center justify-between px-6 h-[66px] border-b border-white/8 flex-shrink-0">
            <div className="flex items-center gap-3">
              <img src={Logo} alt="SKYBRIDGE" className="h-8 w-auto" />
              <span className="text-white font-black text-lg tracking-tight" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.04em' }}>SKYBRIDGE</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-9 h-9 rounded-xl border border-white/10 bg-white/6 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/12 transition-all"
              aria-label="Close menu"
            >
              <X size={18} />
            </button>
          </div>

          {/* Nav links */}
          <div className="flex-1 overflow-y-auto px-4 py-5 space-y-1.5">
            {[...navLinks, { path: '/register', label: 'Pendaftaran', icon: ChevronRight, isCta: true }].map(
              ({ path, label, icon: Icon, isCta }) => (
                <Link
                  key={path}
                  to={path}
                  style={{ textDecoration: 'none', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl text-[13px] font-semibold transition-all duration-200 ${
                    isCta
                      ? 'mt-3 bg-gradient-to-r from-indigo-600 to-blue-500 text-white shadow-lg shadow-indigo-500/25'
                      : isActive(path)
                      ? 'bg-white/10 text-white border border-white/12'
                      : 'text-slate-400 hover:bg-white/8 hover:text-white'
                  }`}
                >
                  <span className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${isCta ? 'bg-white/20' : 'bg-white/8'}`}>
                    <Icon size={15} />
                  </span>
                  {label}
                  {!isCta && <ChevronRight size={14} className="ml-auto text-slate-600" />}
                </Link>
              )
            )}
          </div>

          {/* Contact strip */}
          <div className="px-6 py-5 border-t border-white/8 flex-shrink-0">
            <p className="text-slate-600 text-[10px] font-bold uppercase tracking-[0.2em] mb-2">Kontak Kami</p>
            <a href="tel:+821708418215" className="text-slate-300 text-sm font-medium hover:text-white transition-colors">
              +81 70-8418-2215
            </a>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
