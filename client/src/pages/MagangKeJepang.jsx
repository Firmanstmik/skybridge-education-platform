import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { ArrowRight, CheckCircle, HeartPulse, Star, Users, Plane, ShieldAlert, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import HeroBg from '../assets/img/bg-internasional.webp';

const MotionDiv = motion.div;

const MagangKeJepang = () => {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Noto+Sans+JP:wght@400;700;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        :root {
            --indigo: #6366f1;
            --indigo-dark: #4f46e5;
            --indigo-light: #818cf8;
            --cream: #FDF8F0;
            --ink: #1C1C1C;
            --muted: #6B7280;
            --white: #FFFFFF;
            --border: #E5E7EB;
        }

        .reg-root {
            font-family: 'Plus Jakarta Sans', sans-serif;
            min-height: 100vh;
            background: var(--cream);
            background-image:
                repeating-linear-gradient(45deg, rgba(99,102,241,0.025) 0, rgba(99,102,241,0.025) 1px, transparent 1px, transparent 36px),
                repeating-linear-gradient(-45deg, rgba(99,102,241,0.025) 0, rgba(99,102,241,0.025) 1px, transparent 1px, transparent 36px);
        }

        .reg-banner {
            background: linear-gradient(135deg, rgba(2,6,23,0.85) 0%, rgba(15,23,42,0.9) 60%, rgba(2,6,23,0.85) 100%), url(${HeroBg}) center/cover no-repeat;
            position: relative;
            overflow: hidden;
            padding: 28px 24px 100px;
            text-align: center;
        }
        .reg-banner::before {
            content: '';
            position: absolute;
            left: 0; top: 0; width: 6px; height: 100%;
            background: linear-gradient(to bottom, var(--indigo), var(--indigo-dark));
        }
        .banner-pattern {
            position: absolute; inset: 0;
            background-image:
                repeating-linear-gradient(45deg, rgba(99,102,241,0.04) 0, rgba(99,102,241,0.04) 1px, transparent 1px, transparent 28px),
                repeating-linear-gradient(-45deg, rgba(99,102,241,0.04) 0, rgba(99,102,241,0.04) 1px, transparent 1px, transparent 28px);
            pointer-events: none;
        }
        .banner-kana {
            font-family: 'Noto Sans JP', sans-serif;
            font-weight: 900;
            font-size: 11px;
            letter-spacing: 0.3em;
            color: rgba(129,140,248,0.8);
            text-transform: uppercase;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 7px 16px;
            border-radius: 999px;
            background: rgba(255,255,255,0.06);
            border: 1px solid rgba(255,255,255,0.10);
            backdrop-filter: blur(10px);
            position: relative; z-index: 1;
        }
        .banner-title {
            font-family: 'Bebas Neue', sans-serif;
            font-size: clamp(30px, 6vw, 56px);
            color: #fff;
            letter-spacing: 0.04em;
            line-height: 1;
            margin-top: 14px;
            position: relative; z-index: 1;
        }
        .banner-title .acc { color: var(--indigo-light); }
        .banner-sub {
            font-size: clamp(13px, 2vw, 16px);
            color: rgba(255,255,255,0.65);
            margin-top: 12px;
            max-width: 700px;
            margin-left: auto;
            margin-right: auto;
            position: relative; z-index: 1;
            line-height: 1.6;
        }

        .reg-card {
            position: relative;
            max-width: 1200px;
            width: calc(100% - 32px);
            margin: -54px auto 48px;
            background: var(--white);
            border-radius: 24px;
            box-shadow: 0 24px 80px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.06);
            overflow: hidden;
            padding: 0 0 48px;
        }
        @media (min-width: 1024px) {
            .reg-card {
                max-width: 1100px;
                margin: -64px auto 64px;
                border-radius: 32px;
            }
        }

        .reg-card::before {
            content: '';
            display: block;
            height: 6px;
            background: linear-gradient(90deg, var(--indigo-dark), var(--indigo), #3b82f6, var(--indigo));
            background-size: 200% 100%;
            animation: shimmer 4s linear infinite;
        }
        @keyframes shimmer {
            0% { background-position: 0% 0%; }
            100% { background-position: 200% 0%; }
        }

        .form-body { padding: 32px 24px; }
        @media (min-width: 768px) {
          .form-body { padding: 60px 60px; }
        }

        .h2-seo { 
          font-weight: 800;
          font-size: clamp(24px, 5vw, 36px); 
          margin-bottom: 40px; 
          color: #111827; 
          text-align: center; 
          line-height: 1.2; 
          letter-spacing: -0.01em;
        }
        .content-grid { display: grid; grid-template-columns: 1fr; gap: 40px; margin-top: 40px; }
        @media (min-width: 768px) { .content-grid { grid-template-columns: 1fr 1fr; gap: 60px; margin-top: 60px; } }
        
        .feature-item { 
          display: flex; 
          gap: 20px; 
          margin-bottom: 24px; 
          background: #f8fafc; 
          padding: 24px; 
          border-radius: 24px; 
          border: 1px solid #f1f5f9; 
          transition: all 0.3s; 
        }
        .feature-item:hover { transform: translateY(-5px); box-shadow: 0 10px 25px rgba(0,0,0,0.05); border-color: var(--indigo-light); }
        
        .feature-icon { 
          flex-shrink: 0; 
          color: var(--indigo); 
          background: #eef2ff; 
          padding: 14px; 
          border-radius: 18px; 
          height: fit-content;
        }
        .feature-text h3 { font-weight: 800; font-size: 18px; margin-bottom: 8px; color: #111827; }
        .feature-text p { color: #64748b; line-height: 1.6; font-size: 14px; }
        
        .cta-box { 
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); 
          border-radius: 32px; 
          padding: 40px 24px; 
          text-align: center; 
          margin-top: 60px; 
          position: relative; 
          overflow: hidden; 
          color: white;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }
        
        .btn-cta { 
          display: inline-flex; 
          align-items: center; 
          justify-content: center; 
          gap: 12px; 
          background: var(--indigo); 
          color: white; 
          padding: 16px 32px; 
          border-radius: 100px; 
          font-weight: 800; 
          text-decoration: none; 
          transition: all 0.3s; 
          font-size: 15px;
          box-shadow: 0 10px 20px rgba(99,102,241,0.2);
        }
        .btn-cta:hover { transform: translateY(-3px); box-shadow: 0 15px 30px rgba(99,102,241,0.35); filter: brightness(1.1); }
        
        .faq-item { 
          background: #f8fafc;
          border-radius: 20px;
          margin-bottom: 12px;
          padding: 24px; 
          border: 1px solid #f1f5f9;
        }
        .faq-q { font-weight: 800; font-size: 16px; margin-bottom: 8px; display: flex; align-items: flex-start; gap: 12px; color: #1e293b; }
        .faq-a { color: #64748b; line-height: 1.6; padding-left: 30px; font-size: 14px; }
      `}</style>

      <div className="reg-root">
        <Navbar />

        {/* HERO SECTION - BANNER STYLE */}
        <MotionDiv 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="reg-banner"
        >
            <div className="banner-pattern" />
            <span className="banner-kana">MAGANG KE JEPANG / 技能実習</span>
            <h1 className="banner-title">
                PROGRAM MAGANG <span className="acc">KE JEPANG</span> RESMI
            </h1>
            <p className="banner-sub">
                Ubah hidup Anda dengan pengalaman magang internasional di Jepang. 
                SKYBRIDGE Nusantara International School membantu Anda dari pelatihan bahasa hingga penempatan kerja resmi.
            </p>
        </MotionDiv>

        {/* MAIN CARD SECTION */}
        <MotionDiv 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="reg-card"
        >
          <div className="form-body">
            <h2 className="h2-seo">Kenapa Memilih Program Magang di SKYBRIDGE?</h2>
            
            <div className="content-grid">
              <div className="feature-text-main">
                <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#4B5563', marginBottom: '32px' }}>
                  Program <strong>magang ke Jepang</strong> adalah kesempatan emas bagi pemuda Indonesia untuk belajar teknologi terbaru, 
                  budaya disiplin, dan etos kerja Jepang sambil mendapatkan penghasilan yang sangat layak. 
                  <strong> SKYBRIDGE Nusantara International School</strong> hadir sebagai jembatan resmi dan terpercaya.
                </p>
                
                <div className="feature-item">
                  <div className="feature-icon"><Plane size={24} /></div>
                  <div className="feature-text">
                    <h3>Pemberangkatan Terjadwal</h3>
                    <p>Proses administrasi yang rapi and transparan memastikan jadwal pemberangkatan Anda sesuai rencana.</p>
                  </div>
                </div>
                
                <div className="feature-item">
                  <div className="feature-icon"><Users size={24} /></div>
                  <div className="feature-text">
                    <h3>Pendampingan di Jepang</h3>
                    <p>Kami tidak melepas Anda begitu saja. Tersedia tim pendamping di Jepang untuk membantu adaptasi Anda.</p>
                  </div>
                </div>
                
                <div className="feature-item">
                  <div className="feature-icon"><HeartPulse size={24} /></div>
                  <div className="feature-text">
                    <h3>Fasilitas Kesehatan & Asuransi</h3>
                    <p>Keamanan and kesehatan peserta adalah prioritas utama kami selama masa magang di Jepang.</p>
                  </div>
                </div>
              </div>

              <div className="feature-image">
                <img 
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800" 
                  alt="Magang ke Jepang SKYBRIDGE" 
                  style={{ width: '100%', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
                />
              </div>
            </div>

            <div className="mt-20 pt-20 border-t border-slate-100">
              <h2 className="h2-seo" style={{ textAlign: 'left', marginBottom: '24px' }}>Program Magang Resmi (Ginou Jisshu)</h2>
              <div style={{ fontSize: '16px', lineHeight: '1.8', color: '#4B5563' }}>
                <p className="mb-8">
                  SKYBRIDGE Nusantara International School hanya menyelenggarakan program magang resmi melalui skema Ginou Jisshu (Technical Intern Training Program). 
                  Kami memastikan setiap peserta mendapatkan hak-haknya sesuai dengan hukum ketenagakerjaan di Jepang.
                </p>
                
                <div className="grid md:grid-cols-2 gap-8 bg-slate-50 p-8 rounded-3xl border border-slate-100">
                  <div>
                    <h3 className="font-bold text-xl mb-4 text-black flex items-center gap-2">
                      <BookOpen className="text-indigo-500" size={20} /> Persyaratan Umum:
                    </h3>
                    <ul className="space-y-3">
                      {['Usia 18 - 28 tahun', 'Pendidikan minimal SMA/SMK sederajat', 'Sehat jasmani dan rohani (Lolos MCU)', 'Tidak memiliki tato atau tindik (untuk laki-laki)', 'Memiliki motivasi tinggi untuk belajar'].map((item) => (
                        <li key={item} className="flex items-center gap-3 text-sm font-medium">
                          <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" /> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex flex-col justify-center">
                    <p className="text-sm italic leading-relaxed">
                      "Dengan kurikulum pelatihan intensif selama 3-4 bulan di Indonesia, kami membekali Anda dengan kemampuan bahasa 
                      Jepang dasar and pemahaman budaya agar siap menghadapi tantangan di Jepang."
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-20">
              <h2 className="h2-seo">Pertanyaan Umum (FAQ)</h2>
              <div className="faq-container max-w-3xl mx-auto">
                <div className="faq-item">
                  <div className="faq-q"><ShieldAlert className="text-amber-400" size={18} /> Apakah ada biaya pendaftaran?</div>
                  <div className="faq-a">Biaya pendaftaran sangat terjangkau. Detail biaya pelatihan and pemberangkatan akan dijelaskan secara transparan saat sosialisasi.</div>
                </div>
                <div className="faq-item">
                  <div className="faq-q"><Star className="text-amber-400 fill-amber-400" size={18} /> Berapa gaji magang di Jepang?</div>
                  <div className="faq-a">Gaji rata-rata peserta magang berkisar antara 120.000 - 180.000 Yen per bulan (belum termasuk lembur).</div>
                </div>
                <div className="faq-item">
                  <div className="faq-q"><CheckCircle className="text-indigo-500" size={18} /> Berapa lama kontrak magang di Jepang?</div>
                  <div className="faq-a">Umumnya kontrak magang berlangsung selama 3 tahun, and dapat diperpanjang hingga 5 tahun (Tokutei Ginou).</div>
                </div>
              </div>
            </div>

            <div className="cta-box">
              <h2 className="text-2xl md:text-3xl font-black mb-4">Mulai Petualangan Anda di Jepang!</h2>
              <p className="text-indigo-100/70 mb-8 max-w-xl mx-auto">
                Ribuan alumni telah sukses. Sekarang giliran Anda. Daftar di SKYBRIDGE Nusantara International School.
              </p>
              <div className="flex justify-center gap-4 flex-wrap">
                <Link to="/register" className="btn-cta">Daftar Sekarang</Link>
                <a href="https://wa.me/817084182215?text=Halo%20Admin%20SKYBRIDGE%20Nusantara,%20saya%20ingin%20konsultasi%20mengenai%20Program%20Magang%20ke%20Jepang." target="_blank" rel="noopener noreferrer" className="btn-cta" style={{ background: '#25D366', boxShadow: '0 10px 20px rgba(37,211,102,0.2)' }}>
                  Konsultasi WhatsApp
                </a>
              </div>
            </div>
          </div>
        </MotionDiv>
      </div>
    </>
  );
};

export default MagangKeJepang;
