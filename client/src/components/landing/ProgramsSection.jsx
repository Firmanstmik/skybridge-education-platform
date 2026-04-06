import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, BookOpen, Briefcase, Plane } from 'lucide-react';

const programs = [
  {
    icon: BookOpen,
    title: 'Kursus Bahasa Jepang Online',
    subtitle: 'N5 → N4 · Online & Offline',
    desc: 'Belajar bahasa Jepang dari nol dengan sensei berpengalaman. Kelas interaktif, fleksibel, dan terstruktur untuk semua level.',
    link: '/kursus-bahasa-jepang-online',
    badge: 'Populer',
    accentFrom: '#6366f1',
    accentTo: '#3b82f6',
    glow: 'rgba(99,102,241,0.55)',
    highlights: ['Modul JLPT N5–N4', 'Kelas Online & Offline', 'Sensei Berpengalaman'],
  },
  {
    icon: Briefcase,
    title: 'Pelatihan Kerja Jepang',
    subtitle: 'Program Intensif 3 Bulan',
    desc: 'Pelatihan fisik, mental, dan budaya kerja Jepang yang intensif dengan instruktur bersertifikat internasional.',
    link: '/pelatihan-kerja-ke-jepang',
    badge: 'Terlaris',
    accentFrom: '#f59e0b',
    accentTo: '#f97316',
    glow: 'rgba(245,158,11,0.55)',
    highlights: ['Pelatihan 3 Bulan', 'Sertifikat Resmi', 'Persiapan Mental & Fisik'],
  },
  {
    icon: Plane,
    title: 'Program Magang ke Jepang',
    subtitle: 'Penempatan Resmi Pemerintah',
    desc: 'Penempatan kerja di perusahaan Jepang melalui mitra Kumiai resmi dengan gaji kompetitif dan dukungan penuh.',
    link: '/magang-ke-jepang',
    badge: 'Unggulan',
    accentFrom: '#10b981',
    accentTo: '#14b8a6',
    glow: 'rgba(52,211,153,0.55)',
    highlights: ['Visa Resmi Pemerintah', 'Gaji ¥150.000+', 'Pendampingan Penuh'],
  },
];

const ProgramsSection = () => {
  return (
    <section id="program" className="relative bg-slate-50 py-24 md:py-32 px-4 md:px-6 overflow-hidden">
      {/* ── Background Accent ── */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] opacity-10"
          style={{ background: 'radial-gradient(circle at 50% 0%, #6366f1 0%, transparent 70%)' }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-3xl mx-auto mb-16 md:mb-24 px-4"
        >
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-white border border-slate-200/60 mb-6 group cursor-default shadow-sm">
            <div className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
            <span className="text-slate-600 text-[11px] font-black uppercase tracking-[0.2em]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Program Terpadu
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-slate-950 leading-[1.1] mb-6" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.02em' }}>
            Pilih Jalur{' '}
            <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              Suksesmu
            </span>
          </h2>
          <p className="text-slate-500 text-base md:text-lg leading-relaxed font-medium" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Tiga program terintegrasi yang membawamu dari nol sampai bekerja di Jepang secara resmi dengan pendampingan penuh.
          </p>
        </motion.div>

        {/* Cards Container ── Mobile: Swipeable | Desktop: Grid */}
        <div className="relative">
          {/* Mobile Scroll Indicator */}
          <div className="flex md:hidden items-center justify-center gap-2 mb-6 opacity-60">
            <div className="w-8 h-1 rounded-full bg-slate-200 overflow-hidden">
              <motion.div 
                className="h-full bg-violet-500"
                animate={{ x: [-32, 32] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Geser untuk memilih</span>
          </div>

          <div className="flex md:grid md:grid-cols-3 gap-6 md:gap-10 overflow-x-auto md:overflow-visible pb-8 md:pb-0 px-2 md:px-0 snap-x snap-mandatory hide-scrollbar">
            {programs.map((prog, i) => {
              const Icon = prog.icon;
              return (                <motion.div
                  key={prog.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className="min-w-[85vw] md:min-w-0 snap-center"
                >
                  <Link
                    to={prog.link}
                    className="group flex flex-col rounded-[40px] overflow-hidden h-full transition-all duration-700 hover:-translate-y-4"
                    style={{
                      textDecoration: 'none',
                      border: '1px solid rgba(226, 232, 240, 0.8)',
                      background: 'white',
                      boxShadow: '0 20px 60px -15px rgba(0, 0, 0, 0.05)',
                    }}
                  >
                    {/* Card top accent bar - refined */}
                    <div
                      className="h-1.5 w-full flex-shrink-0 transition-all duration-500 group-hover:h-2"
                      style={{ background: `linear-gradient(90deg, ${prog.accentFrom}, ${prog.accentTo})` }}
                    />

                    <div className="flex flex-col flex-1 p-8 md:p-10 relative">
                      {/* Hover Decorative Glow */}
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none"
                        style={{
                          background: `radial-gradient(circle at top right, ${prog.accentFrom}08, transparent 60%)`,
                        }}
                      />

                      {/* Header Row */}
                      <div className="flex items-start justify-between mb-8 relative z-10">
                        <div className="relative">
                          <div
                            className="absolute inset-0 rounded-2xl blur-3xl opacity-0 group-hover:opacity-50 transition-all duration-1000 scale-150"
                            style={{ background: prog.glow }}
                          />
                          <div
                            className="relative w-16 h-16 rounded-[22px] flex items-center justify-center shadow-2xl group-hover:rotate-[-8deg] transition-all duration-700"
                            style={{
                              background: `linear-gradient(135deg, ${prog.accentFrom}, ${prog.accentTo})`,
                              boxShadow: `0 15px 35px ${prog.glow.replace('0.55', '0.25')}`,
                            }}
                          >
                            <Icon size={30} className="text-white" strokeWidth={2.2} />
                          </div>
                        </div>
                        <span
                          className="px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] text-white shadow-xl shadow-indigo-500/10"
                          style={{
                            background: `linear-gradient(135deg, ${prog.accentFrom}, ${prog.accentTo})`,
                          }}
                        >
                          {prog.badge}
                        </span>
                      </div>

                      {/* Content Section */}
                      <div className="relative z-10 mb-8">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{prog.subtitle}</p>
                        <h3 className="text-slate-950 text-2xl font-black mb-4 leading-tight group-hover:text-indigo-600 transition-colors duration-500" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                          {prog.title}
                        </h3>
                        <p className="text-slate-500 text-[15px] md:text-[16px] leading-relaxed group-hover:text-slate-700 transition-colors duration-500 font-medium" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                          {prog.desc}
                        </p>
                      </div>

                      {/* Highlights List */}
                      <div className="relative z-10 flex-1 border-t border-slate-100 pt-8 mt-auto">
                        <ul className="space-y-4">
                          {prog.highlights.map((h) => (                <li key={h} className="flex items-center gap-3.5 text-sm font-bold text-slate-600 group-hover:text-slate-800 transition-colors duration-500" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                              <div
                                className="w-2 h-2 rounded-full flex-shrink-0 shadow-sm"
                                style={{ background: `linear-gradient(135deg, ${prog.accentFrom}, ${prog.accentTo})` }}
                              />
                              {h}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Card Footer CTA */}
                    <div
                      className="flex items-center justify-between px-8 md:px-10 py-6 border-t border-slate-50 transition-all duration-500 group-hover:bg-slate-50/80"
                      style={{ background: 'rgba(250, 251, 252, 0.5)' }}
                    >
                      <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 group-hover:text-indigo-600 transition-colors" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        Pelajari Program
                      </span>
                      <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-white border border-slate-200/60 shadow-sm group-hover:scale-110 group-hover:translate-x-1 transition-all duration-700">
                        <ArrowUpRight size={18} style={{ color: prog.accentFrom }} />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-center mt-16 md:mt-24"
        >
          <Link
            to="/register"
            id="programs-cta"
            className="cta-glow inline-flex items-center gap-3 px-10 py-5 rounded-[22px] text-white text-base font-black tracking-wide hover:-translate-y-2 hover:brightness-110 transition-all duration-500 shadow-2xl shadow-indigo-500/20"
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 50%, #3b82f6 100%)',
              textDecoration: 'none',
            }}
          >
            Daftar Sekarang & Konsultasi <ArrowUpRight size={20} strokeWidth={2.5} />
          </Link>
        </motion.div>
      </div>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
};

export default ProgramsSection;
