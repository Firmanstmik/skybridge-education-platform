import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { ArrowRight, CheckCircle, HeartPulse, Star, Users, Plane, ShieldAlert } from 'lucide-react';
import HeroBg from '../assets/img/heroskybridge.webp';

const MagangKeJepang = () => {
  return (
    <>
      <style>{`
        .lp-body { font-family: 'Plus Jakarta Sans', sans-serif; color: #1C1C1C; background: #FFFFFF; }
        .hero-lp { 
          background: linear-gradient(135deg, #001A1A 0%, #002D2D 100%); 
          padding: 80px 20px 60px; 
          text-align: center; 
          color: white; 
          position: relative; 
          overflow: hidden; 
        }
        @media (min-width: 768px) {
          .hero-lp { padding: 140px 20px 100px; }
        }
        .hero-lp-bg {
          position: absolute;
          inset: 0;
          background-image: url(${HeroBg});
          background-size: cover;
          background-position: center;
          opacity: 0.2;
          mix-blend-mode: luminosity;
          pointer-events: none;
        }
        .hero-lp::after { 
          content: ''; 
          position: absolute; 
          inset: 0; 
          background: radial-gradient(circle at 20% 30%, rgba(20,184,166,0.1) 0%, transparent 50%),
                      radial-gradient(circle at 80% 70%, rgba(0,45,45,0.2) 0%, transparent 50%);
          pointer-events: none; 
        }
        .tagline { 
          display: inline-block; 
          background: rgba(255, 255, 255, 0.1); 
          backdrop-filter: blur(8px);
          color: #14B8A6; 
          padding: 8px 20px; 
          border-radius: 100px; 
          font-size: 11px; 
          font-weight: 800; 
          text-transform: uppercase; 
          margin-bottom: 24px; 
          letter-spacing: 0.15em; 
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .h1-seo { 
          font-family: 'Plus Jakarta Sans', sans-serif; 
          font-weight: 800;
          font-size: clamp(34px, 10vw, 64px); 
          line-height: 1.1; 
          margin-bottom: 24px; 
          letter-spacing: -0.02em;
          text-shadow: 0 2px 10px rgba(0,0,0,0.2);
        }
        .p-seo { 
          font-size: 16px; 
          color: rgba(255,255,255,0.8); 
          max-width: 700px; 
          margin: 0 auto 36px; 
          line-height: 1.7; 
          padding: 0 10px;
        }
        @media (min-width: 768px) {
          .p-seo { font-size: 18px; margin-bottom: 48px; }
        }
        .section-lp { padding: 70px 20px; max-width: 1200px; margin: 0 auto; }
        @media (min-width: 768px) {
          .section-lp { padding: 100px 20px; }
        }
        .h2-seo { 
          font-family: 'Plus Jakarta Sans', sans-serif; 
          font-weight: 800;
          font-size: clamp(28px, 6vw, 42px); 
          margin-bottom: 48px; 
          color: #111827; 
          text-align: center; 
          line-height: 1.2; 
          letter-spacing: -0.01em;
        }
        .content-grid { display: grid; grid-template-columns: 1fr; gap: 40px; margin-top: 40px; }
        @media (min-width: 768px) { .content-grid { grid-template-columns: 1fr 1fr; gap: 80px; margin-top: 60px; } }
        .feature-item { 
          display: flex; 
          gap: 20px; 
          margin-bottom: 16px; 
          background: #ffffff; 
          padding: 24px; 
          border-radius: 24px; 
          border: 1px solid #f1f5f9; 
          box-shadow: 0 10px 30px -10px rgba(0,0,0,0.05);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); 
        }
        .feature-item:active { transform: scale(0.98); background: #f8fafc; }
        @media (min-width: 768px) {
          .feature-item { background: transparent; padding: 0; border: none; box-shadow: none; margin-bottom: 32px; }
          .feature-item:hover { transform: translateX(10px); }
        }
        .feature-icon { 
          flex-shrink: 0; 
          color: #14B8A6; 
          background: #F0FDFA; 
          padding: 14px; 
          border-radius: 18px; 
          height: fit-content;
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.02);
        }
        .feature-text h3 { font-weight: 800; font-size: 18px; margin-bottom: 8px; color: #111827; }
        .feature-text p { color: #64748b; line-height: 1.7; font-size: 14px; }
        
        .cta-box { 
          background: linear-gradient(135deg, #14B8A6 0%, #0F766E 100%); 
          border-radius: 40px; 
          padding: 48px 24px; 
          text-align: center; 
          margin-top: 60px; 
          position: relative; 
          overflow: hidden; 
          color: white;
          box-shadow: 0 25px 50px -12px rgba(20,184,166,0.25);
        }
        .cta-box::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
          animation: rotate 20s linear infinite;
        }
        
        @media (min-width: 768px) {
          .cta-box { padding: 80px 40px; margin-top: 100px; }
        }
        .btn-cta { 
          display: inline-flex; 
          align-items: center; 
          justify-content: center; 
          gap: 12px; 
          background: #ffffff; 
          color: #14B8A6; 
          padding: 18px 36px; 
          border-radius: 100px; 
          font-weight: 800; 
          text-decoration: none; 
          transition: all 0.3s; 
          font-size: 15px; 
          width: 100%; 
          box-shadow: 0 10px 20px rgba(0,0,0,0.1);
        }
        @media (min-width: 640px) {
          .btn-cta { width: auto; font-size: 16px; padding: 20px 48px; }
        }
        .btn-cta:hover { transform: translateY(-3px); box-shadow: 0 15px 30px rgba(255,255,255,0.2); }
        
        .faq-item { 
          background: #f8fafc;
          border-radius: 20px;
          margin-bottom: 12px;
          padding: 24px; 
          border: 1px solid #f1f5f9;
          transition: 0.3s;
        }
        .faq-q { font-weight: 800; font-size: 16px; margin-bottom: 12px; display: flex; align-items: flex-start; gap: 14px; color: #1e293b; line-height: 1.5; }
        @media (min-width: 768px) {
          .faq-q { font-size: 18px; align-items: center; }
        }
        .faq-a { color: #64748b; line-height: 1.8; padding-left: 32px; font-size: 14px; }
        @media (min-width: 768px) {
          .faq-a { font-size: 16px; }
        }
      `}</style>

      <div className="lp-body">
        <Navbar />

        {/* HERO SECTION */}
        <section className="hero-lp">
          <div className="hero-lp-bg"></div>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div className="tagline">#1 Program Magang Jepang Terpercaya</div>
            <h1 className="h1-seo">Program Magang ke Jepang Bersama SKYBRIDGE</h1>
            <p className="p-seo">
              Ubah hidup Anda dengan pengalaman magang internasional di Jepang. 
              SKYBRIDGE Nusantara International School membantu Anda dari pelatihan bahasa hingga penempatan kerja resmi di perusahaan Jepang.
            </p>
            <Link to="/register" className="btn-cta">
              Daftar Magang Sekarang <ArrowRight size={20} />
            </Link>
          </div>
        </section>

        {/* MAIN CONTENT SECTION */}
        <section className="section-lp">
          <h2 className="h2-seo">Kenapa Memilih Program Magang ke Jepang di SKYBRIDGE?</h2>
          <div className="content-grid">
            <div className="feature-text-main">
              <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#4B5563', marginBottom: '24px' }}>
                Program <strong>magang ke Jepang</strong> adalah kesempatan emas bagi pemuda Indonesia untuk belajar teknologi terbaru, 
                budaya disiplin, dan etos kerja Jepang sambil mendapatkan penghasilan yang sangat layak. 
                <strong> SKYBRIDGE Nusantara International School</strong> hadir sebagai jembatan resmi dan terpercaya untuk mewujudkan impian tersebut.
              </p>
              <div className="feature-item">
                <div className="feature-icon"><Plane size={24} /></div>
                <div className="feature-text">
                  <h3>Pemberangkatan Terjadwal</h3>
                  <p>Proses administrasi yang rapi dan transparan memastikan jadwal pemberangkatan Anda sesuai rencana.</p>
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
                  <p>Keamanan dan kesehatan peserta adalah prioritas utama kami selama masa magang di Jepang.</p>
                </div>
              </div>
            </div>
            <div className="feature-image">
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800" 
                alt="Pengalaman Magang ke Jepang SKYBRIDGE" 
                style={{ width: '100%', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
              />
            </div>
          </div>
        </section>

        {/* TRUST SECTION */}
        <section className="section-lp" style={{ background: '#F0FDFA', borderRadius: '40px' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <h2 className="h2-seo" style={{ textAlign: 'left' }}>Program Magang Jepang Resmi (Ginou Jisshu)</h2>
            <div style={{ fontSize: '16px', lineHeight: '1.8', color: '#4B5563' }}>
              <p className="mb-6">
                SKYBRIDGE Nusantara International School hanya menyelenggarakan <strong>program magang ke Jepang resmi</strong> 
                melalui skema Ginou Jisshu (Technical Intern Training Program). Kami memastikan setiap peserta mendapatkan hak-haknya 
                sesuai dengan hukum ketenagakerjaan di Jepang.
              </p>
              <h3 className="font-bold text-xl mb-4 text-black">Persyaratan Umum Pendaftaran:</h3>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li>Usia 18 - 28 tahun</li>
                <li>Pendidikan minimal SMA/SMK sederajat</li>
                <li>Sehat jasmani dan rohani (Lolos MCU)</li>
                <li>Tidak memiliki tato atau tindik (untuk laki-laki)</li>
                <li>Memiliki motivasi tinggi untuk belajar dan bekerja</li>
              </ul>
              <p className="mb-6">
                Dengan kurikulum pelatihan intensif selama 3-4 bulan di Indonesia, kami membekali Anda dengan kemampuan bahasa 
                Jepang dasar dan pemahaman budaya agar siap menghadapi tantangan di Jepang.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section className="section-lp">
          <h2 className="h2-seo">Pertanyaan Seputar Magang Jepang</h2>
          <div className="faq-container" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div className="faq-item">
              <div className="faq-q"><ShieldAlert size={18} /> Apakah ada biaya pendaftaran?</div>
              <div className="faq-a">Biaya pendaftaran sangat terjangkau. Detail biaya pelatihan dan pemberangkatan akan dijelaskan secara transparan saat sosialisasi.</div>
            </div>
            <div className="faq-item">
              <div className="faq-q"><Star size={18} /> Berapa gaji magang di Jepang?</div>
              <div className="faq-a">Gaji rata-rata peserta magang berkisar antara 120.000 - 180.000 Yen per bulan (belum termasuk lembur).</div>
            </div>
            <div className="faq-item">
              <div className="faq-q"><CheckCircle size={18} /> Berapa lama kontrak magang di Jepang?</div>
              <div className="faq-a">Umumnya kontrak magang berlangsung selama 3 tahun, dan dapat diperpanjang hingga 5 tahun (Tokutei Ginou).</div>
            </div>
          </div>
        </section>

        {/* CTA BOX */}
        <section className="section-lp">
          <div className="cta-box">
            <h2 style={{ fontSize: '32px', fontWeight: '900', marginBottom: '16px' }}>Mulai Petualangan Anda di Jepang!</h2>
            <p style={{ color: '#6B7280', marginBottom: '32px', fontSize: '18px' }}>
              Ribuan alumni telah sukses. Sekarang giliran Anda. Daftar di SKYBRIDGE Nusantara International School.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
              <Link to="/register" className="btn-cta">Daftar Sekarang</Link>
              <a href="https://wa.me/817084182215?text=Halo%20Admin%20SKYBRIDGE%20Nusantara,%20saya%20ingin%20konsultasi%20mengenai%20Program%20Magang%20ke%20Jepang." target="_blank" rel="noopener noreferrer" className="btn-cta" style={{ background: '#25D366' }}>
                Konsultasi Gratis via WhatsApp
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default MagangKeJepang;
