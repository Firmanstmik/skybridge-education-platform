import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Instagram, Facebook, Youtube, ArrowUpRight } from 'lucide-react';
import usePublicBlogs from '../../hooks/usePublicBlogs';

const FooterSection = () => {
  const year = new Date().getFullYear();
  const blogLinks = usePublicBlogs(5);

  return (
    <footer className="relative bg-[#060914] text-white overflow-hidden">

      {/* ── Top gradient border ── */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />

      {/* ── Background orbs ── */}
      <div className="absolute -bottom-40 right-0 w-[500px] h-[500px] rounded-full bg-indigo-700/6 blur-[100px] pointer-events-none" />
      <div className="absolute top-0 left-0 w-[400px] h-[400px] rounded-full bg-violet-700/5 blur-[80px] pointer-events-none" />

      {/* ── CTA Banner ── */}
      <div className="relative z-10 border-b border-white/[0.05]">
        <div className="max-w-7xl mx-auto px-6 py-16 lg:py-20 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="text-center lg:text-left">
            <h3 className="text-3xl lg:text-[44px] font-black text-white leading-tight mb-2" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.04em' }}>
              Siap Memulai Perjalanan ke Jepang?
            </h3>
            <p className="text-slate-500 text-[15px]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Konsultasi gratis dengan tim kami. Tidak ada biaya pendaftaran awal.</p>
          </div>
          <Link
            to="/register"
            id="footer-cta"
            className="cta-glow flex-shrink-0 inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl text-white text-[14.5px] font-bold tracking-wide hover:-translate-y-0.5 hover:brightness-110 transition-all duration-300"
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              textDecoration: 'none',
              background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 50%, #3b82f6 100%)',
              boxShadow: '0 0 0 1px rgba(99,102,241,0.3), 0 8px 28px rgba(99,102,241,0.3)',
            }}
          >
            Daftar Sekarang <ArrowUpRight size={17} />
          </Link>
        </div>
      </div>

      {/* ── Main Grid ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 lg:py-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-16">

          {/* Column 1: Brand */}
          <div className="col-span-2 lg:col-span-1">
            <div className="mb-1">
              <span className="text-white font-black text-[16px] tracking-tight">SKYBRIDGE</span>
              <span
                className="text-transparent text-[16px] font-black tracking-tight ml-1"
                style={{ backgroundImage: 'linear-gradient(135deg, #818cf8, #60a5fa)', backgroundClip: 'text', WebkitBackgroundClip: 'text' }}
              >
                Nusantara
              </span>
            </div>
            <p className="text-[10px] text-slate-600 font-semibold tracking-[0.2em] uppercase mb-5">International School</p>
            <p className="text-slate-500 text-[13.5px] leading-relaxed mb-7 max-w-[280px]">
              Lembaga pendidikan dan pelatihan kerja internasional terpercaya yang menjadi pintu gerbang masyarakat Indonesia menuju Jepang.
            </p>
            {/* Socials */}
            <div className="flex gap-2.5">
              {[
                { Icon: Instagram, href: '#', label: 'Instagram' },
                { Icon: Facebook, href: '#', label: 'Facebook' },
                { Icon: Youtube, href: '#', label: 'Youtube' },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-500 hover:text-white hover:-translate-y-1 transition-all duration-300"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, #6366f1, #3b82f6)';
                    e.currentTarget.style.border = '1px solid transparent';
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(99,102,241,0.4)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                    e.currentTarget.style.border = '1px solid rgba(255,255,255,0.07)';
                    e.currentTarget.style.boxShadow = '';
                  }}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Programs */}
          <div>
            <h4 className="text-[11px] font-bold text-white uppercase tracking-[0.18em] mb-6 relative inline-block">
              Program Kami
              <span className="absolute -bottom-2 left-0 w-full h-px bg-gradient-to-r from-indigo-500/60 to-transparent" />
            </h4>
            <ul className="space-y-3.5">
              {[
                { label: 'Kursus Bahasa Jepang', to: '/kursus-bahasa-jepang-online' },
                { label: 'Pelatihan Kerja', to: '/pelatihan-kerja-ke-jepang' },
                { label: 'Program Magang', to: '/magang-ke-jepang' },
                { label: 'Belajar dari Nol', to: '/belajar-bahasa-jepang-dari-nol' },
                { label: 'Daftar Sekarang', to: '/register' },
              ].map(({ label, to }) => (
                <li key={to}>
                  <Link
                    to={to}
                    style={{ textDecoration: 'none' }}
                    className="group/link flex items-center gap-2 text-slate-500 text-[13.5px] hover:text-white transition-all duration-200 hover:translate-x-1"
                  >
                    <span className="w-1 h-1 rounded-full bg-slate-700 group-hover/link:bg-indigo-400 transition-colors" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Blog */}
          <div>
            <h4 className="text-[11px] font-bold text-white uppercase tracking-[0.18em] mb-6 relative inline-block">
              Blog & Artikel
              <span className="absolute -bottom-2 left-0 w-full h-px bg-gradient-to-r from-indigo-500/60 to-transparent" />
            </h4>
            <ul className="space-y-3.5">
              {blogLinks.map((blog) => (
                <li key={blog.slug}>
                  <Link
                    to={`/blog/${blog.slug}`}
                    style={{ textDecoration: 'none' }}
                    className="group/link flex items-center gap-2 text-slate-500 text-[13.5px] hover:text-white transition-all duration-200 hover:translate-x-1"
                  >
                    <span className="w-1 h-1 rounded-full bg-slate-700 group-hover/link:bg-indigo-400 transition-colors" />
                    {blog.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h4 className="text-[11px] font-bold text-white uppercase tracking-[0.18em] mb-6 relative inline-block">
              Hubungi Kami
              <span className="absolute -bottom-2 left-0 w-full h-px bg-gradient-to-r from-indigo-500/60 to-transparent" />
            </h4>
            <ul className="space-y-5">
              {[
                { Icon: MapPin, text: 'Komplek Pertokoan Grand Lingkar No.7, Mataram, Indonesia' },
                { Icon: Phone, text: '+81 70-8418-2215' },
                { Icon: Mail, text: 'info@snischool.com' },
              ].map(({ Icon, text }) => (
                <li key={text} className="flex items-start gap-3">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.2)' }}
                  >
                    <Icon size={13} className="text-indigo-400" />
                  </div>
                  <span className="text-slate-500 text-[13.5px] leading-relaxed">{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="relative z-10 border-t border-white/[0.05]">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-600 text-[12.5px]">
            © {year} SKYBRIDGE Nusantara International School. Hak Cipta Dilindungi.
          </p>
          <div className="flex items-center gap-6">
            {[
              { label: 'Kebijakan Privasi', to: '/privacy' },
              { label: 'Syarat & Ketentuan', to: '/terms' },
            ].map(({ label, to }) => (
              <Link
                key={to}
                to={to}
                style={{ textDecoration: 'none' }}
                className="text-slate-600 text-[12.5px] hover:text-slate-300 transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
