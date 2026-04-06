import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Budi Santoso',
    role: 'Engineering',
    location: 'Tokyo, Jepang',
    initials: 'BS',
    gradRing: 'from-indigo-500 via-blue-500 to-cyan-400',
    gradAvatar: 'from-indigo-600 to-blue-500',
    rating: 5,
    text: 'Berkat SKYBRIDGE, saya bisa bekerja di perusahaan konstruksi ternama di Tokyo. Pelatihannya sangat intensif dan membantu adaptasi saya terhadap budaya kerja Jepang yang disiplin.',
  },
  {
    name: 'Siti Aminah',
    role: 'Kaigo (Perawat Lansia)',
    location: 'Osaka, Jepang',
    initials: 'SA',
    gradRing: 'from-rose-500 via-pink-500 to-fuchsia-400',
    gradAvatar: 'from-rose-500 to-pink-500',
    rating: 5,
    text: 'Sensei di SKYBRIDGE sangat sabar membimbing dari nol sampai saya lulus JLPT N4. Sekarang saya sudah 2 tahun di Osaka dan karir saya terus berkembang.',
  },
  {
    name: 'Rian Hidayat',
    role: 'Agriculture',
    location: 'Hokkaido, Jepang',
    initials: 'RH',
    gradRing: 'from-emerald-500 via-teal-400 to-cyan-400',
    gradAvatar: 'from-emerald-600 to-teal-500',
    rating: 5,
    text: 'Program magang resmi yang aman dan terpercaya. Proses pemberangkatan transparan dan pendampingan di Jepang sangat membantu kami yang baru pertama kali keluar negeri.',
  },
];

const TestimonialsSection = () => {
  return (
    <section id="testimoni" className="relative bg-white py-24 md:py-32 px-4 md:px-6 overflow-hidden">
      {/* ── Background Accent ── */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute bottom-0 right-0 w-[600px] h-[600px] opacity-10"
          style={{ background: 'radial-gradient(circle at 100% 100%, #10b981 0%, transparent 70%)' }}
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
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-emerald-50 border border-emerald-100/60 mb-6 group cursor-default shadow-sm">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-emerald-700 text-[11px] font-black uppercase tracking-[0.2em]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Kisah Sukses Alumni
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-slate-950 leading-[1.1] mb-6" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.02em' }}>
            Ribuan Alumni{' '}
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Sukses
            </span>{' '}
            bersama Kami
          </h2>
          <p className="text-slate-500 text-base md:text-lg leading-relaxed font-medium" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Bergabunglah bersama ratusan alumni yang telah berhasil membangun karir impian mereka di berbagai wilayah Jepang.
          </p>
        </motion.div>

        {/* Cards Container ── Mobile: Swipeable | Desktop: Grid */}
        <div className="relative">
          {/* Mobile Scroll Indicator */}
          <div className="flex md:hidden items-center justify-center gap-2 mb-6 opacity-60">
            <div className="w-8 h-1 rounded-full bg-slate-200 overflow-hidden">
              <motion.div 
                className="h-full bg-emerald-500"
                animate={{ x: [-32, 32] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Geser cerita sukses</span>
          </div>

          <div className="flex md:grid md:grid-cols-3 gap-6 md:gap-10 overflow-x-auto md:overflow-visible pb-8 md:pb-0 px-2 md:px-0 snap-x snap-mandatory hide-scrollbar">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="min-w-[85vw] md:min-w-0 snap-center"
              >
                <div
                  className="group relative flex flex-col rounded-[40px] p-8 md:p-10 h-full transition-all duration-700 hover:-translate-y-4 shadow-xl shadow-black/[0.02]"
                  style={{
                    background: 'white',
                    border: '1px solid rgba(226, 232, 240, 0.8)',
                  }}
                >
                  {/* Hover Background Glow */}
                  <div
                    className="absolute inset-0 rounded-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none"
                    style={{
                      background: `radial-gradient(circle at top right, ${t.gradAvatar.split(' ')[0].replace('from-', '#')}08, transparent 60%)`,
                    }}
                  />

                  {/* Modern Quote Icon Watermark */}
                  <div className="absolute top-8 right-8 text-slate-50 group-hover:text-emerald-500/10 transition-colors duration-1000">
                    <Quote size={80} className="fill-current rotate-12" />
                  </div>

                  {/* Rating Stars */}
                  <div className="flex gap-1.5 mb-8 relative z-10">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} size={18} className="fill-amber-400 text-amber-400 drop-shadow-sm" />
                    ))}
                  </div>

                  {/* Testimonial Text */}
                  <p className="text-slate-600 text-[16px] md:text-[17px] leading-[1.8] mb-12 flex-1 relative z-10 font-medium italic group-hover:text-slate-800 transition-colors duration-500">
                    "{t.text}"
                  </p>

                  {/* Author Info Section */}
                  <div className="relative z-10 flex items-center gap-5 border-t border-slate-50 pt-8">
                    {/* Enhanced Avatar with Gradient Ring */}
                    <div className="relative flex-shrink-0 w-16 h-16">
                      <div
                        className={`absolute -inset-1.5 rounded-[24px] bg-gradient-to-br ${t.gradRing} opacity-20 group-hover:opacity-100 transition-all duration-700 scale-90 group-hover:scale-100 blur-sm group-hover:blur-0`}
                      />
                      <div
                        className={`relative w-full h-full rounded-[20px] flex items-center justify-center text-white font-black text-xl bg-gradient-to-br ${t.gradAvatar} shadow-2xl shadow-black/10`}
                      >
                        {t.initials}
                      </div>
                    </div>

                    <div>
                      <div className="text-slate-950 font-black text-lg leading-tight group-hover:text-emerald-600 transition-colors duration-500">
                        {t.name}
                      </div>
                      <div className="flex flex-col mt-1">
                        <span className="text-slate-400 text-xs font-black uppercase tracking-wider">
                          {t.role}
                        </span>
                        <span className="text-emerald-500/80 text-[11px] font-bold">
                          {t.location}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Social Proof Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-20 flex flex-col sm:flex-row items-center justify-center gap-6 md:gap-8 px-6 py-8 rounded-[32px] bg-slate-50/50 border border-slate-100"
        >
          {/* Avatar Stack */}
          <div className="flex -space-x-4">
            {[
              { i: 'BS', g: 'from-indigo-500 to-blue-400' },
              { i: 'SA', g: 'from-rose-500 to-pink-400' },
              { i: 'RH', g: 'from-emerald-500 to-teal-400' },
              { i: 'DK', g: 'from-violet-500 to-purple-400' },
              { i: 'MF', g: 'from-amber-500 to-orange-400' },
            ].map(({ i, g }, idx) => (
              <div
                key={i}
                className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${g} border-4 border-white flex items-center justify-center text-white text-[10px] font-black shadow-xl`}
                style={{ zIndex: 5 - idx, borderRadius: '14px' }}
              >
                {i}
              </div>
            ))}
          </div>

          <div className="text-center sm:text-left">
            <div className="text-slate-950 font-black text-lg leading-tight">500+ Alumni Berhasil</div>
            <div className="text-slate-500 text-sm font-medium mt-1">Telah membangun karir masa depan di Jepang</div>
          </div>

          <div className="flex flex-col items-center sm:items-end gap-1 border-t sm:border-t-0 sm:border-l border-slate-200 pt-4 sm:pt-0 sm:pl-8">
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, j) => (
                <Star key={j} size={16} className="fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-slate-950 font-black text-sm">Rating 4.9 / 5.0</span>
          </div>
        </motion.div>
      </div>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
};

export default TestimonialsSection;
