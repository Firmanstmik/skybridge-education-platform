import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Users, Briefcase, ArrowUpRight } from 'lucide-react';

const features = [
  {
    icon: BookOpen,
    num: '01',
    title: 'Kursus Bahasa Jepang Online',
    desc: 'Kurikulum terpadu dari nol hingga mahir (N5–N4) dengan metode interaktif yang fleksibel, bisa diakses kapan saja dan di mana saja.',
    link: '/kursus-bahasa-jepang-online',
    grad: 'from-indigo-500 to-blue-500',
    iconGlow: 'rgba(99,102,241,0.5)',
    tag: 'Belajar Online',
    accentFrom: '#6366f1',
    accentTo: '#3b82f6',
  },
  {
    icon: Users,
    num: '02',
    title: 'Pelatihan Kerja Resmi',
    desc: 'Persiapan mental dan fisik sesuai budaya kerja Jepang dengan instruktur berpengalaman dan kurikulum berstandar internasional.',
    link: '/pelatihan-kerja-ke-jepang',
    grad: 'from-amber-500 to-orange-500',
    iconGlow: 'rgba(245,158,11,0.5)',
    tag: 'Intensif',
    accentFrom: '#f59e0b',
    accentTo: '#f97316',
  },
  {
    icon: Briefcase,
    num: '03',
    title: 'Jaminan Penempatan Kerja',
    desc: 'Akses langsung ke jaringan mitra perusahaan dan Kumiai resmi di seluruh wilayah Jepang dengan dukungan penuh hingga keberangkatan.',
    link: '/magang-ke-jepang',
    grad: 'from-emerald-500 to-teal-500',
    iconGlow: 'rgba(52,211,153,0.5)',
    tag: 'Terjamin',
    accentFrom: '#10b981',
    accentTo: '#14b8a6',
  },
];

const FeaturesSection = () => {
  return (
    <section id="keunggulan" className="relative bg-white py-24 md:py-32 px-4 md:px-6 overflow-hidden">
      {/* ── Background Decorative Elements ── */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-20 blur-[120px]"
          style={{ background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)' }}
        />
        <div 
          className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full opacity-10 blur-[100px]"
          style={{ background: 'radial-gradient(circle, #10b981 0%, transparent 70%)' }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* ── Section Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-3xl mx-auto mb-16 md:mb-24 px-4"
        >
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-slate-50 border border-slate-200/60 mb-6 group cursor-default shadow-sm">
            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            <span className="text-slate-600 text-[11px] font-black uppercase tracking-[0.2em]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Keunggulan Utama
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-slate-950 leading-[1.1] mb-6" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.02em' }}>
            Mengapa Memilih{' '}
            <span className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
                SKYBRIDGE
              </span>
              <svg className="absolute -bottom-2 left-0 w-full h-3 text-indigo-100/60 -z-0" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 25 0, 50 5 T 100 5" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
              </svg>
            </span>
            ?
          </h2>
          <p className="text-slate-500 text-base md:text-lg leading-relaxed font-medium" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Lebih dari sekadar lembaga pelatihan, kami adalah jembatan profesional yang dirancang khusus untuk memastikan kesuksesan karir Anda di Jepang.
          </p>
        </motion.div>

        {/* ── Cards Container ── Mobile: Swipeable | Desktop: Grid */}
        <div className="relative group/container">
          {/* Mobile Scroll Indicator - only visible on small screens */}
          <div className="flex md:hidden items-center justify-center gap-2 mb-6 opacity-60">
            <div className="w-8 h-1 rounded-full bg-slate-200 overflow-hidden">
              <motion.div 
                className="h-full bg-indigo-500"
                animate={{ x: [-32, 32] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Geser untuk melihat</span>
          </div>

          <div className="flex md:grid md:grid-cols-3 gap-6 md:gap-10 overflow-x-auto md:overflow-visible pb-8 md:pb-0 px-2 md:px-0 snap-x snap-mandatory hide-scrollbar">
            {features.map((feat, i) => {
              const Icon = feat.icon;
              return (
                <motion.div
                  key={feat.num}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className="min-w-[85vw] md:min-w-0 snap-center"
                >
                  <Link
                    to={feat.link}
                    className="group relative flex flex-col rounded-[40px] p-8 md:p-10 h-full transition-all duration-700 hover:-translate-y-4"
                    style={{
                      background: 'rgba(255, 255, 255, 1)',
                      border: '1px solid rgba(226, 232, 240, 0.8)',
                      boxShadow: '0 20px 60px -15px rgba(0, 0, 0, 0.05)',
                      textDecoration: 'none',
                    }}
                  >
                    {/* Hover Glow Background */}
                    <div
                      className="absolute inset-0 rounded-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none"
                      style={{
                        background: `radial-gradient(circle at top right, ${feat.accentFrom}0A, transparent 70%)`,
                      }}
                    />

                    {/* Animated Border Gradient */}
                    <div
                      className="absolute inset-0 rounded-[40px] opacity-0 group-hover:opacity-100 transition-all duration-700 pointer-events-none"
                      style={{
                        padding: '2px',
                        background: `linear-gradient(135deg, ${feat.accentFrom}40, transparent 40%, ${feat.accentTo}40)`,
                        WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                        WebkitMaskComposite: 'xor',
                        maskComposite: 'exclude',
                      }}
                    />

                    {/* Top Tag & Number Row */}
                    <div className="flex items-center justify-between mb-10 relative z-10">
                      <span
                        className="px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] text-white shadow-xl shadow-indigo-500/10"
                        style={{
                          fontFamily: "'Plus Jakarta Sans', sans-serif",
                          background: `linear-gradient(135deg, ${feat.accentFrom}, ${feat.accentTo})`,
                        }}
                      >
                        {feat.tag}
                      </span>
                      <span className="text-5xl font-black text-slate-100 group-hover:text-slate-200 transition-colors duration-500 italic" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                        {feat.num}
                      </span>
                    </div>

                    {/* Icon Section - Unique Blob Shape */}
                    <div className="relative mb-10 w-fit">
                      <div
                        className="absolute inset-0 rounded-[24px] blur-3xl opacity-0 group-hover:opacity-40 transition-all duration-1000 scale-150"
                        style={{ background: feat.iconGlow }}
                      />
                      <div
                        className={`relative w-20 h-20 flex items-center justify-center transition-all duration-700 group-hover:scale-110 group-hover:rotate-[15deg]`}
                      >
                        {/* Unique SVG Shape Background */}
                        <svg className="absolute inset-0 w-full h-full text-slate-50 group-hover:text-indigo-50 transition-colors duration-500" viewBox="0 0 100 100" fill="currentColor">
                          <path d="M20,10 Q50,0 80,10 T90,50 T80,90 T50,100 T20,90 T10,50 T20,10" />
                        </svg>
                        
                        <div 
                          className={`relative w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br ${feat.grad} shadow-2xl z-10`}
                          style={{ boxShadow: `0 12px 30px ${feat.iconGlow.replace('0.5', '0.25')}` }}
                        >
                          <Icon size={28} className="text-white" strokeWidth={2.5} />
                        </div>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="relative z-10 flex flex-col flex-1">
                      <h3 className="text-slate-950 font-black text-2xl mb-4 leading-tight group-hover:text-indigo-600 transition-colors duration-500">
                        {feat.title}
                      </h3>
                      <p className="text-slate-500 text-base leading-relaxed mb-10 flex-1 group-hover:text-slate-700 transition-colors duration-500 font-medium">
                        {feat.desc}
                      </p>

                      {/* Professional CTA */}
                      <div
                        className="inline-flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] transition-all duration-500"
                        style={{ color: feat.accentFrom }}
                      >
                        <span className="relative">
                          Pelajari Detail
                          <div className="absolute -bottom-1 left-0 w-0 h-[2px] bg-current transition-all duration-500 group-hover:w-full" />
                        </span>
                        <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-slate-50 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 shadow-sm group-hover:shadow-indigo-200">
                          <ArrowUpRight size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-500" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
      
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
};

export default FeaturesSection;
