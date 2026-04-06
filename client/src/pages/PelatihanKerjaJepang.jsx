import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { ArrowRight, CheckCircle, Briefcase, Star, MapPin, Building, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import HeroBg from '../assets/img/bg-internasional.webp';

const PelatihanKerjaJepang = () => {
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 }
    }
  };

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
        
        .step-item {
          display: flex;
          gap: 24px;
          background: #f8fafc;
          padding: 32px;
          border-radius: 24px;
          border: 1px solid #f1f5f9;
          margin-bottom: 24px;
          transition: all 0.3s;
        }
        .step-item:hover { transform: translateY(-5px); box-shadow: 0 10px 25px rgba(0,0,0,0.05); border-color: var(--indigo-light); }
        .step-num {
          flex-shrink: 0;
          width: 48px;
          height: 48px;
          background: var(--indigo);
          color: white;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 20px;
        }
        .step-content h3 { font-weight: 800; font-size: 18px; margin-bottom: 8px; color: #111827; }
        .step-content p { color: #64748b; line-height: 1.6; font-size: 14px; }

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
      `}</style>

      <div className="reg-root">
        <Navbar />

        {/* HERO SECTION - BANNER STYLE */}
        <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="reg-banner"
        >
            <div className="banner-pattern" />
            <span className="banner-kana">PELATIHAN KERJA / 就職トレーニング</span>
            <h1 className="banner-title">
                PELATIHAN KERJA <span className="acc">JEPANG</span> TERPADU
            </h1>
            <p className="banner-sub">
                Persiapkan diri Anda untuk karir profesional di Jepang bersama SKYBRIDGE Nusantara International School. 
                Program pelatihan kerja terintegrasi, sertifikasi kompetensi, dan jaminan penempatan kerja.
            </p>
        </motion.div>

        {/* MAIN CARD SECTION */}
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="reg-card"
        >
          <div className="form-body">
            <h2 className="h2-seo">Alur Pelatihan & Penempatan Kerja</h2>
            
            <div className="max-w-4xl mx-auto">
              <div className="step-item">
                <div className="step-num">01</div>
                <div className="step-content">
                  <h3>Pendaftaran & Seleksi</h3>
                  <p>Calon peserta melakukan pendaftaran online and mengikuti seleksi administrasi serta wawancara awal.</p>
                </div>
              </div>
              
              <div className="step-item">
                <div className="step-num">02</div>
                <div className="step-content">
                  <h3>Pelatihan Bahasa & Budaya</h3>
                  <p>Pelatihan intensif bahasa Jepang tingkat N5-N4 serta pengenalan budaya dan etos kerja profesional Jepang.</p>
                </div>
              </div>
              
              <div className="step-item">
                <div className="step-num">03</div>
                <div className="step-content">
                  <h3>Wawancara dengan Perusahaan Jepang</h3>
                  <p>Peserta dipertemukan langsung dengan mitra perusahaan Jepang melalui Kumiai resmi untuk proses seleksi kerja.</p>
                </div>
              </div>
              
              <div className="step-item">
                <div className="step-num">04</div>
                <div className="step-content">
                  <h3>Proses Dokumen & COE</h3>
                  <p>Pengurusan dokumen Certificate of Eligibility (COE) and Visa kerja dengan bantuan penuh dari tim SKYBRIDGE.</p>
                </div>
              </div>
              
              <div className="step-item">
                <div className="step-num">05</div>
                <div className="step-content">
                  <h3>Keberangkatan & Penempatan</h3>
                  <p>Pemberangkatan ke Jepang and penempatan kerja di perusahaan mitra dengan pendampingan berkelanjutan.</p>
                </div>
              </div>
            </div>

            <div className="mt-20 pt-20 border-t border-slate-100">
              <h2 className="h2-seo">Keunggulan Program Kami</h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center p-8 bg-slate-50 rounded-3xl border border-slate-100">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-sm mb-6 text-indigo-500">
                    <Building size={32} />
                  </div>
                  <h3 className="font-bold text-lg mb-3">Mitra Kumiai Resmi</h3>
                  <p className="text-sm text-slate-500">Bekerja sama dengan organisasi pengirim resmi di seluruh wilayah Jepang.</p>
                </div>
                
                <div className="text-center p-8 bg-slate-50 rounded-3xl border border-slate-100">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-sm mb-6 text-indigo-500">
                    <ShieldCheck size={32} />
                  </div>
                  <h3 className="font-bold text-lg mb-3">Keamanan Terjamin</h3>
                  <p className="text-sm text-slate-500">Proses transparan and legal sesuai aturan ketenagakerjaan Indonesia & Jepang.</p>
                </div>
                
                <div className="text-center p-8 bg-slate-50 rounded-3xl border border-slate-100">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-sm mb-6 text-indigo-500">
                    <Star size={32} />
                  </div>
                  <h3 className="font-bold text-lg mb-3">Alumni Sukses</h3>
                  <p className="text-sm text-slate-500">Lebih dari 500+ alumni yang telah berhasil bekerja and membangun karir di Jepang.</p>
                </div>
              </div>
            </div>

            <div className="cta-box">
              <h2 className="text-2xl md:text-3xl font-black mb-4">Mulai Karir Global Anda Hari Ini</h2>
              <p className="text-indigo-100/70 mb-8 max-w-xl mx-auto">
                Daftarkan diri Anda di SKYBRIDGE Nusantara International School and jadilah bagian dari tenaga kerja profesional di Jepang.
              </p>
              <div className="flex justify-center gap-4 flex-wrap">
                <Link to="/register" className="btn-cta">Daftar Sekarang</Link>
                <a href="https://wa.me/817084182215?text=Halo%20Admin%20SKYBRIDGE%20Nusantara,%20saya%20ingin%20konsultasi%20mengenai%20Pelatihan%20Kerja%20Jepang." target="_blank" rel="noopener noreferrer" className="btn-cta" style={{ background: '#25D366', boxShadow: '0 10px 20px rgba(37,211,102,0.2)' }}>
                  Konsultasi WhatsApp
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default PelatihanKerjaJepang;
