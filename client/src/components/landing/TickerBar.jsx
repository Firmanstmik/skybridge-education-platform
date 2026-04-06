import { Globe, Zap, Trophy, Users, BookOpen, Star, Plane, Heart } from 'lucide-react';

const items = [
  { icon: Globe,    text: 'Berangkat ke Jepang' },
  { icon: Zap,      text: 'Gaji Kompetitif' },
  { icon: Trophy,   text: 'Lulus JLPT N4' },
  { icon: Users,    text: 'Mitra Kumiai Terpercaya' },
  { icon: BookOpen, text: 'Pelatihan Intensif' },
  { icon: Plane,    text: 'Berangkat Legal & Aman' },
  { icon: Star,     text: 'Alumni Sukses 500+' },
  { icon: Heart,    text: 'Pendampingan Penuh' },
  // duplicate for seamless scroll
  { icon: Globe,    text: 'Berangkat ke Jepang' },
  { icon: Zap,      text: 'Gaji Kompetitif' },
  { icon: Trophy,   text: 'Lulus JLPT N4' },
  { icon: Users,    text: 'Mitra Kumiai Terpercaya' },
  { icon: BookOpen, text: 'Pelatihan Intensif' },
  { icon: Plane,    text: 'Berangkat Legal & Aman' },
  { icon: Star,     text: 'Alumni Sukses 500+' },
  { icon: Heart,    text: 'Pendampingan Penuh' },
];

const TickerBar = () => (
  <div className="relative overflow-hidden bg-[#080b1e] border-y border-white/[0.05]" style={{ padding: '14px 0' }}>
    {/* Side fade masks */}
    <div className="absolute inset-y-0 left-0 w-20 pointer-events-none z-10"
      style={{ background: 'linear-gradient(to right, #080b1e, transparent)' }} />
    <div className="absolute inset-y-0 right-0 w-20 pointer-events-none z-10"
      style={{ background: 'linear-gradient(to left, #080b1e, transparent)' }} />

    <div className="flex whitespace-nowrap" style={{ animation: 'tickerScroll 28s linear infinite' }}>
      {items.map((item, i) => {
        const Icon = item.icon;
        return (
          <span key={i} className="inline-flex items-center gap-2.5 text-slate-400 font-semibold"
            style={{ padding: '0 28px', fontSize: '13px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            <Icon size={13} className="text-indigo-400 flex-shrink-0" />
            {item.text}
            <span className="w-1 h-1 rounded-full bg-slate-700 flex-shrink-0" />
          </span>
        );
      })}
    </div>

    <style>{`
      @keyframes tickerScroll {
        from { transform: translateX(0); }
        to   { transform: translateX(-50%); }
      }
    `}</style>
  </div>
);

export default TickerBar;
