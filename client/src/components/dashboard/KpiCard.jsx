import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const KpiCard = ({ label, description, value, trendLabel, trendValue, icon: Icon, gradient, accent }) => {
  const positive = trendValue >= 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 280, damping: 26 }}
      className="relative overflow-hidden rounded-2xl bg-white/90 dark:bg-slate-950/80 border border-slate-200/70 dark:border-slate-800 shadow-[0_18px_45px_rgba(15,23,42,0.12)] hover:shadow-[0_24px_60px_rgba(15,23,42,0.18)] transition-all duration-300 group"
    >
      <div className={`absolute -right-8 -bottom-8 h-28 w-28 rounded-full bg-gradient-to-br ${gradient} opacity-70 blur-2xl group-hover:opacity-90 transition-opacity duration-500`} />
      
      <div className="relative p-4 md:p-5 flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.2em] text-slate-500 uppercase group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">
              {label}
            </p>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400 font-medium">{description}</p>
          </div>
          <div className={`h-10 w-10 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
            <Icon size={20} className={accent} />
          </div>
        </div>
        
        <div className="flex items-end justify-between gap-3 pt-2">
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">
              {value}
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium pb-1">pendaftar</span>
          </div>
          
          <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-wide uppercase ${
            positive 
              ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20' 
              : 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400 border border-rose-100 dark:border-rose-500/20'
          }`}>
            {positive ? <ArrowUpRight size={12} strokeWidth={3} /> : <ArrowDownRight size={12} strokeWidth={3} />}
            <span>{Math.abs(trendValue || 0)}</span>
            <span className="opacity-70 normal-case tracking-normal font-medium ml-0.5">{trendLabel}</span>
          </div>
        </div>
        
        <div className="mt-2 flex items-center gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800/50">
          {Array.from({ length: 12 }).map((_, idx) => {
            const base = 30 + (idx % 4) * 15; // Random-ish heights
            return (
              <div
                key={idx}
                className="flex-1 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden"
              >
                <div
                  className={`w-full rounded-full bg-gradient-to-t ${gradient} opacity-80`}
                  style={{ height: `${base}%` }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default KpiCard;
