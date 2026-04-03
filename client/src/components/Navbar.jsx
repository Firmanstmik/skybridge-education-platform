import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Home, UserPlus, Lock, ClipboardCheck, BookOpen } from 'lucide-react';
import Logo from '../assets/img/SKYBRIDGE_LOGO.webp';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    if (isOpen) {
      try { window.scrollTo({ top: 0, behavior: 'auto' }); } catch {}
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [isOpen]);

  return (
    <nav className="sticky top-0 z-50">
      <style>{`
        .nav-pill {
          height: 40px;
          border-radius: 9999px;
          display: flex;
          align-items: center;
        }
        .nav-link {
          height: 36px;
          display: flex;
          align-items: center;
          line-height: 1;
          padding-left: 16px;
          padding-right: 16px;
          border-radius: 9999px;
          font-weight: 600;
        }
        .nav-cta {
          min-height: 40px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          line-height: 1;
          padding-left: 20px;
          padding-right: 20px;
          border-radius: 9999px;
          font-weight: 700;
        }
        .brand-school-name {
          font-family: "Brush Script MT", "Lucida Handwriting", "Segoe Script", cursive;
          font-style: italic;
          color: #D97706;
          text-shadow: 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 10px rgba(217, 119, 6, 0.2);
          letter-spacing: 0.03em;
        }
      `}</style>
      <div
        className="relative border-b border-slate-200/70 bg-white/90 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,59,115,0.08)]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 0%, rgba(0,59,115,0.05), transparent 45%), radial-gradient(circle at 80% 10%, rgba(0,163,224,0.06), transparent 40%)',
        }}
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-0 top-0 h-full w-2 bg-gradient-to-b from-[#003B73] to-[#002D58]" />
          <div className="absolute left-2 top-0 h-full w-1 bg-gradient-to-b from-[#00A3E0] to-[#0077B6]" />
          <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-[#002D58] via-[#003B73] to-[#00A3E0] opacity-80" />
        </div>

        <div className="container mx-auto px-4 py-3 flex justify-between items-center relative z-20">
          <Link to="/" className="flex items-center group relative">
            <div className="absolute -inset-2 rounded-2xl bg-gradient-to-r from-blue-600/10 to-cyan-500/10 opacity-0 blur transition-opacity duration-300 group-hover:opacity-100" />
            <img src={Logo} alt="SKYBRIDGE Nusantara International School Logo" className="h-10 md:h-12 w-auto mr-3 transition-transform duration-300 group-hover:scale-105 relative" />
            <span className="text-xl font-bold font-sans text-sky-blue hidden lg:block tracking-tight relative">
              SKYBRIDGE
            </span>
            <span className="hidden xl:block text-base leading-none ml-2 brand-school-name relative pt-1.5">
              Nusantara International School
            </span>
          </Link>
        
        {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-3">
            <div className="relative nav-pill border border-slate-200/80 bg-white/70 backdrop-blur-md shadow-sm px-1">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/5 to-cyan-500/10" />
              <div className="relative flex items-center gap-1">
                <Link
                  to="/"
                  className={`relative nav-link text-sm font-bold transition-all duration-200 ${
                    isActive('/')
                      ? 'text-sky-blue'
                      : 'text-slate-700 hover:text-sky-blue'
                  }`}
                  style={{ height: 36, lineHeight: 1, paddingLeft: 16, paddingRight: 16 }}
                >
                  <span className="relative z-10">Beranda</span>
                  {isActive('/') && (
                    <span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-gradient-to-r from-[#003B73] to-[#00A3E0]" />
                  )}
                </Link>
                <Link
                  to="/kursus-bahasa-jepang-online"
                  className={`relative nav-link text-sm font-bold transition-all duration-200 ${
                    isActive('/kursus-bahasa-jepang-online')
                      ? 'text-sky-blue'
                      : 'text-slate-700 hover:text-sky-blue'
                  }`}
                >
                  Kursus
                </Link>
                <Link
                  to="/pelatihan-kerja-ke-jepang"
                  className={`relative nav-link text-sm font-bold transition-all duration-200 ${
                    isActive('/pelatihan-kerja-ke-jepang')
                      ? 'text-sky-blue'
                      : 'text-slate-700 hover:text-sky-blue'
                  }`}
                >
                  Pelatihan
                </Link>
                <Link
                  to="/magang-ke-jepang"
                  className={`relative nav-link text-sm font-bold transition-all duration-200 ${
                    isActive('/magang-ke-jepang')
                      ? 'text-sky-blue'
                      : 'text-slate-700 hover:text-sky-blue'
                  }`}
                >
                  Magang
                </Link>
                <Link
                  to="/student/check-status"
                  className={`relative nav-link text-sm font-bold transition-all duration-200 ${
                    isActive('/student/check-status')
                      ? 'text-sky-blue'
                      : 'text-slate-700 hover:text-sky-blue'
                  }`}
                  style={{ height: 36, lineHeight: 1, paddingLeft: 16, paddingRight: 16 }}
                >
                  <span className="relative z-10">Cek Status</span>
                  {isActive('/student/check-status') && (
                    <span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-gradient-to-r from-[#003B73] to-[#00A3E0]" />
                  )}
                </Link>
              </div>
            </div>

            <Link
              to="/register"
              className={`group relative nav-cta transition-all duration-300 transform hover:-translate-y-0.5 shadow-md flex items-center ${
                isActive('/register')
                  ? 'bg-dory-red text-white shadow-lg ring-2 ring-red-200'
                  : 'bg-dory-red text-white hover:bg-[#C9161C] hover:shadow-lg'
              }`}
              style={{ minHeight: 40, lineHeight: 1, paddingLeft: 20, paddingRight: 20 }}
            >
              <span className="absolute inset-0 rounded-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#E31E24]/35 to-[#FF8C42]/25 blur opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative z-10">Pendaftaran</span>
            </Link>
          </div>

        {/* Mobile Menu Button */}
          <button
            className="md:hidden relative text-slate-700 focus:outline-none p-2.5 rounded-2xl border border-slate-200/80 bg-white/70 backdrop-blur hover:bg-white transition-colors duration-200 shadow-sm"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            <span className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/5 to-cyan-500/10 opacity-0 hover:opacity-100 transition-opacity" />
            {isOpen ? (
              <X className="w-6 h-6 text-sky-blue transition-transform duration-300 rotate-90 relative" />
            ) : (
              <Menu className="w-6 h-6 transition-transform duration-300 hover:scale-110 relative" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/45 z-40 md:hidden backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Menu Content */}
      <div
        className={`
          md:hidden fixed inset-0 z-50 flex items-start
          transition-all duration-300 ease-out
          ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `}
      >
        <div
          className={`
            w-full bg-white/95 backdrop-blur-xl shadow-[0_20px_80px_rgba(2,6,23,0.25)] border-b border-slate-200/80
            rounded-b-[28px] overflow-hidden
            transition-transform duration-300 ease-out
            ${isOpen ? 'translate-y-0' : '-translate-y-4'}
          `}
          style={{ marginTop: 0, maxHeight: '100vh' }}
        >
          <div className="h-1.5 bg-gradient-to-r from-[#002D58] via-[#003B73] to-[#00A3E0]" />
          <div className="px-4 pt-3 pb-4 border-b border-slate-200/80 bg-white/60 sticky top-0 z-10">
            <div className="mx-auto h-1 w-14 rounded-full bg-slate-200" />
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative h-11 w-11 rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10" />
                  <img src={Logo} alt="SKYBRIDGE Logo" className="relative h-full w-full object-contain p-2" />
                </div>
                <div>
                  <div className="text-[10px] font-extrabold tracking-[0.22em] text-slate-500 uppercase">Menu</div>
                  <div className="text-sm font-extrabold text-slate-900 leading-tight">SKYBRIDGE</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Tutup menu"
                className="group relative h-11 w-11 rounded-2xl border border-slate-200 bg-white shadow-sm active:scale-95 transition-transform"
              >
                <span className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 opacity-70 group-hover:opacity-100 transition-opacity" />
                <span className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#003B73]/20 to-[#00A3E0]/20 blur opacity-0 group-hover:opacity-100 transition-opacity" />
                <X className="relative mx-auto h-5 w-5 text-sky-blue transition-transform duration-300 group-hover:rotate-90" />
              </button>
            </div>
          </div>

          <div
            className="p-4 space-y-2 overflow-auto"
            style={{
              maxHeight: 'calc(100vh - 64px - 60px)',
              backgroundImage:
                'repeating-linear-gradient(45deg, rgba(0,59,115,0.04) 0px, rgba(0,59,115,0.04) 1px, transparent 1px, transparent 36px), repeating-linear-gradient(-45deg, rgba(0,163,224,0.04) 0px, rgba(0,163,224,0.04) 1px, transparent 1px, transparent 36px)',
            }}
          >
            {[
              { path: '/', label: 'Beranda', icon: Home },
              { path: '/kursus-bahasa-jepang-online', label: 'Kursus Bahasa Jepang', icon: BookOpen },
              { path: '/pelatihan-kerja-ke-jepang', label: 'Pelatihan Kerja', icon: ClipboardCheck },
              { path: '/magang-ke-jepang', label: 'Program Magang', icon: UserPlus },
              { path: '/student/check-status', label: 'Cek Status', icon: ClipboardCheck },
              { path: '/register', label: 'Pendaftaran', icon: UserPlus },
            ].map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  group flex items-center px-4 py-4 rounded-2xl transition-all duration-200 border
                  ${item.path === '/register'
                    ? 'bg-red-50 text-dory-red font-extrabold border-red-200 hover:bg-red-100'
                    : isActive(item.path) 
                    ? 'bg-white text-sky-blue font-extrabold border-blue-200 shadow-sm translate-x-1' 
                    : 'bg-white/70 text-slate-700 border-slate-200/80 hover:bg-white hover:text-sky-blue hover:translate-x-0.5'
                  }
                `}
                onClick={() => setIsOpen(false)}
              >
                <span className={`mr-3 p-2 rounded-xl border ${item.path === '/register' || isActive(item.path) ? 'bg-red-50 border-red-200' : 'bg-white border-slate-200 group-hover:bg-red-50 group-hover:border-red-200'}`}>
                  <item.icon className={`w-5 h-5 ${item.path === '/register' || isActive(item.path) ? 'text-dory-red' : 'text-slate-400 group-hover:text-dory-red'}`} />
                </span>
                <span className="flex-1">{item.label}</span>
                <span className={`h-2 w-2 rounded-full ${item.path === '/register' || isActive(item.path) ? 'bg-gradient-to-r from-[#D0021B] to-[#F5A623]' : 'bg-slate-300 group-hover:bg-[#D0021B]'}`} />
              </Link>
            ))}
            
            <div className="pt-4 mt-2 border-t border-slate-200/80">
              <div className="px-4 text-[10px] text-slate-500 font-extrabold uppercase tracking-[0.22em] mb-2">Kontak Kami</div>
              <a href="#" className="block px-4 py-3 rounded-xl text-sm text-slate-700 hover:text-dory-red bg-white/70 border border-slate-200/80 hover:bg-white transition-colors">
                <span>+62 821 456 000 28</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
