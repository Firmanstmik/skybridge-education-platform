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
          padding: 120px 20px 80px; 
          text-align: center; 
          color: white; 
          position: relative; 
          overflow: hidden; 
        }
        .hero-lp-bg {
          position: absolute;
          inset: 0;
          background-image: url(${HeroBg});
          background-size: cover;
          background-position: center;
          opacity: 0.15;
          mix-blend-mode: overlay;
          pointer-events: none;
        }
        .hero-lp::before { content: ''; position: absolute; inset: 0; background-image: radial-gradient(circle at 50% 50%, rgba(20,184,166,0.15), transparent 70%); pointer-events: none; }
        .tagline { display: inline-block; background: rgba(20,184,166,0.2); color: #14B8A6; padding: 6px 16px; border-radius: 100px; font-size: 12px; font-weight: 800; text-transform: uppercase; margin-bottom: 24px; letter-spacing: 0.1em; }
        .h1-seo { font-family: 'Bebas Neue', sans-serif; font-size: clamp(40px, 8vw, 72px); line-height: 1; margin-bottom: 20px; }
        .p-seo { font-size: 18px; color: rgba(255,255,255,0.7); max-width: 800px; margin: 0 auto 40px; line-height: 1.6; }
        .section-lp { padding: 80px 20px; max-width: 1200px; margin: 0 auto; }
        .h2-seo { font-family: 'Bebas Neue', sans-serif; font-size: 48px; margin-bottom: 32px; color: #1C1C1C; text-align: center; }
        .content-grid { display: grid; grid-template-columns: 1fr; gap: 40px; margin-top: 40px; }
        @media (min-width: 768px) { .content-grid { grid-template-columns: 1fr 1fr; } }
        .feature-item { display: flex; gap: 16px; margin-bottom: 24px; }
        .feature-icon { flex-shrink: 0; color: #14B8A6; }
        .feature-text h3 { font-weight: 800; font-size: 18px; margin-bottom: 8px; }
        .feature-text p { color: #6B7280; line-height: 1.6; }
        .cta-box { background: #ECFDF5; border-radius: 24px; padding: 60px 40px; text-align: center; margin-top: 60px; border: 1px solid #14B8A6; }
        .btn-cta { display: inline-flex; align-items: center; gap: 12px; background: #D0021B; color: white; padding: 18px 40px; border-radius: 100px; font-weight: 800; text-decoration: none; transition: 0.3s; }
        .btn-cta:hover { transform: translateY(-3px); box-shadow: 0 10px 30px rgba(208,2,27,0.3); }
        .faq-item { border-bottom: 1px solid #E5E7EB; padding: 24px 0; }
        .faq-q { font-weight: 800; font-size: 18px; margin-bottom: 12px; display: flex; align-items: center; gap: 12px; color: #14B8A6; }
        .faq-a { color: #4B5563; line-height: 1.8; padding-left: 32px; }
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
