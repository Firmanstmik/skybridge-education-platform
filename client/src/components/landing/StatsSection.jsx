import { motion } from 'framer-motion';
import { Users, TrendingUp, Building2, Globe } from 'lucide-react';

const stats = [
  { icon: Users,      num: '500+', label: 'Alumni Berangkat',  grad: 'from-indigo-400 to-blue-400',    glow: 'rgba(99,102,241,0.5)' },
  { icon: TrendingUp, num: '98%',  label: 'Tingkat Kelulusan', grad: 'from-emerald-400 to-teal-400',   glow: 'rgba(52,211,153,0.5)' },
  { icon: Building2,  num: '50+',  label: 'Mitra Kumiai',      grad: 'from-violet-400 to-purple-400',  glow: 'rgba(167,139,250,0.5)' },
  { icon: Globe,      num: '10+',  label: 'Tahun Pengalaman',  grad: 'from-amber-400 to-orange-400',   glow: 'rgba(251,191,36,0.5)' },
];

const StatsSection = () => {
  return (
    <section className="relative bg-slate-50 pt-0 pb-12">
      {/* Glow behind the card */}
      <div
        className="absolute top-0 inset-x-0 h-48 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 80% at 50% 0%, rgba(99,102,241,0.07) 0%, transparent 80%)',
        }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-16 md:-mt-20 relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-[32px] md:rounded-[40px] overflow-hidden"
          style={{
            background: 'rgba(10, 12, 26, 0.92)',
            backdropFilter: 'blur(32px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 40px 100px -20px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(99, 102, 241, 0.12)',
          }}
        >
          {/* Decorative glow elements */}
          <div className="absolute top-0 left-1/4 w-1/2 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
          <div
            className="absolute inset-0 pointer-events-none opacity-40"
            style={{
              background: 'radial-gradient(circle at 20% 30%, rgba(99, 102, 241, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)',
            }}
          />

          <div className="relative z-10 grid grid-cols-4 divide-x divide-white/[0.08]">
            {stats.map(({ icon: Icon, num, label, grad, glow }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col items-center py-6 md:py-12 px-2 md:px-8 text-center gap-3 md:gap-6 group hover:bg-white/[0.03] transition-all duration-500 cursor-default"
              >
                {/* Icon with glow - responsive sizes */}
                <div className="relative w-8 h-8 md:w-14 md:h-14">
                  <div
                    className="absolute inset-0 rounded-xl md:rounded-2xl blur-xl md:blur-2xl opacity-0 group-hover:opacity-70 transition-all duration-700 scale-125 md:scale-150"
                    style={{ background: glow }}
                  />
                  <div
                    className={`relative w-full h-full rounded-xl md:rounded-2xl flex items-center justify-center bg-gradient-to-br ${grad} shadow-xl group-hover:rotate-[12deg] group-hover:scale-110 transition-all duration-500`}
                    style={{ boxShadow: `0 8px 20px ${glow.replace('0.5', '0.2')}` }}
                  >
                    <Icon size={14} className="text-white md:hidden" strokeWidth={3} />
                    <Icon size={26} className="text-white hidden md:block" strokeWidth={2.5} />
                  </div>
                </div>

                {/* Text Content */}
                <div className="flex flex-col items-center">
                  <div
                    className={`text-xl sm:text-2xl md:text-5xl font-black bg-gradient-to-r ${grad} bg-clip-text text-transparent leading-none mb-1 md:mb-3 tracking-tighter group-hover:scale-105 transition-transform duration-500`}
                    style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.04em' }}
                  >
                    {num}
                  </div>
                  <div className="text-slate-400 text-[8px] sm:text-[10px] md:text-[13px] font-black uppercase tracking-[0.1em] md:tracking-[0.2em] group-hover:text-slate-200 transition-colors duration-300 leading-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {label.split(' ').map((word, idx) => (
                      <span key={idx} className="block md:inline">{word} </span>
                    ))}
                  </div>
                </div>

                {/* Hover line indicator */}
                <div className="absolute bottom-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default StatsSection;
