import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { ArrowRight, CheckCircle, GraduationCap, Star, BookOpen, Heart, Languages } from 'lucide-react';
import HeroBg from '../assets/img/heroskybridge.webp';

const BelajarBahasaJepangDariNol = () => {
  return (
    <>
      <style>{`
        .lp-body { font-family: 'Plus Jakarta Sans', sans-serif; color: #1C1C1C; background: #FFFFFF; }
        .hero-lp { 
          background: linear-gradient(135deg, #001A35 0%, #002D58 100%); 
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
        .hero-lp::before { content: ''; position: absolute; inset: 0; background-image: radial-gradient(circle at 50% 50%, rgba(0,163,224,0.15), transparent 70%); pointer-events: none; }
        .tagline { display: inline-block; background: rgba(0,163,224,0.15); color: #00A3E0; padding: 6px 16px; border-radius: 100px; font-size: 12px; font-weight: 800; text-transform: uppercase; margin-bottom: 24px; letter-spacing: 0.1em; }
        .h1-seo { font-family: 'Bebas Neue', sans-serif; font-size: clamp(40px, 8vw, 72px); line-height: 1; margin-bottom: 20px; }
        .p-seo { font-size: 18px; color: rgba(255,255,255,0.7); max-width: 800px; margin: 0 auto 40px; line-height: 1.6; }
        .section-lp { padding: 80px 20px; max-width: 1200px; margin: 0 auto; }
        .h2-seo { font-family: 'Bebas Neue', sans-serif; font-size: 48px; margin-bottom: 32px; color: #1C1C1C; text-align: center; }
        .content-grid { display: grid; grid-template-columns: 1fr; gap: 40px; margin-top: 40px; }
        @media (min-width: 768px) { .content-grid { grid-template-columns: 1fr 1fr; } }
        .feature-item { display: flex; gap: 16px; margin-bottom: 24px; }
        .feature-icon { flex-shrink: 0; color: #003B73; }
        .feature-text h3 { font-weight: 800; font-size: 18px; margin-bottom: 8px; }
        .feature-text p { color: #6B7280; line-height: 1.6; }
        .cta-box { background: #F0F7FF; border-radius: 24px; padding: 60px 40px; text-align: center; margin-top: 60px; border: 1px solid #00A3E0; }
        .btn-cta { display: inline-flex; align-items: center; gap: 12px; background: #003B73; color: white; padding: 18px 40px; border-radius: 100px; font-weight: 800; text-decoration: none; transition: 0.3s; }
        .btn-cta:hover { transform: translateY(-3px); box-shadow: 0 10px 30px rgba(0,59,115,0.3); }
        .faq-item { border-bottom: 1px solid #E5E7EB; padding: 24px 0; }
        .faq-q { font-weight: 800; font-size: 18px; margin-bottom: 12px; display: flex; align-items: center; gap: 12px; color: #003B73; }
        .faq-a { color: #4B5563; line-height: 1.8; padding-left: 32px; }
      `}</style>

      <div className="lp-body">
        <Navbar />

        {/* HERO SECTION */}
        <section className="hero-lp">
          <div className="hero-lp-bg"></div>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div className="tagline">Sekolah Bahasa Jepang Terbaik di Indonesia</div>
            <h1 className="h1-seo">Belajar Bahasa Jepang Dari Nol di SKYBRIDGE</h1>
            <p className="p-seo">
              Ingin bisa bicara bahasa Jepang tapi bingung mulai dari mana? 
              SKYBRIDGE Nusantara International School adalah tempat terbaik untuk belajar bahasa Jepang dari dasar hingga mahir.
            </p>
            <Link to="/register" className="btn-cta">
              Mulai Belajar Sekarang <ArrowRight size={20} />
            </Link>
          </div>
        </section>

        {/* MAIN CONTENT SECTION */}
        <section className="section-lp">
          <h2 className="h2-seo">Metode Belajar Bahasa Jepang Paling Efektif</h2>
          <div className="content-grid">
            <div className="feature-text-main">
              <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#4B5563', marginBottom: '24px' }}>
                Banyak orang merasa sulit <strong>belajar bahasa Jepang dari nol</strong> karena sistem tulisannya yang kompleks. 
                Di <strong>SKYBRIDGE Nusantara International School</strong>, kami memecah kerumitan tersebut menjadi modul-modul 
                sederhana yang mudah dipahami, menjadikannya <strong>sekolah bahasa Jepang terbaik</strong> pilihan siswa.
              </p>
              <div className="feature-item">
                <div className="feature-icon"><Languages size={24} /></div>
                <div className="feature-text">
                  <h3>Pendekatan Komunikatif</h3>
                  <p>Fokus pada percakapan nyata agar Anda bisa langsung mempraktikkan apa yang dipelajari.</p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon"><GraduationCap size={24} /></div>
                <div className="feature-text">
                  <h3>Sensei Berkualitas Internasional</h3>
                  <p>Belajar dari pengajar yang memiliki sertifikasi JLPT N1/N2 dan pengalaman mengajar bertahun-tahun.</p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon"><Heart size={24} /></div>
                <div className="feature-text">
                  <h3>Komunitas Belajar Seru</h3>
                  <p>Bergabung dengan ribuan siswa lain dalam lingkungan belajar yang suportif dan penuh motivasi.</p>
                </div>
              </div>
            </div>
            <div className="feature-image">
              <img 
                src="https://images.unsplash.com/photo-1513258496099-48168024adb0?auto=format&fit=crop&q=80&w=800" 
                alt="Suasana Belajar di Sekolah Bahasa Jepang SKYBRIDGE" 
                style={{ width: '100%', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
              />
            </div>
          </div>
        </section>

        {/* CURRICULUM SECTION */}
        <section className="section-lp" style={{ background: '#F8FAFC' }}>
          <h2 className="h2-seo">Kurikulum Belajar Dari Dasar</h2>
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div style={{ background: 'white', padding: '32px', borderRadius: '24px', border: '1px solid #E2E8F0' }}>
                <div className="flex items-center gap-3 mb-4 text-sky-blue font-bold">
                  <BookOpen size={24} /> Tahap Dasar (N5)
                </div>
                <ul className="space-y-3 text-gray-600">
                  <li>• Pengenalan Hiragana & Katakana</li>
                  <li>• 100 Kanji Dasar</li>
                  <li>• Tata Bahasa Dasar (Partikel, Kata Kerja)</li>
                  <li>• Perkenalan Diri (Jikoshoukai)</li>
                </ul>
              </div>
              <div style={{ background: 'white', padding: '32px', borderRadius: '24px', border: '1px solid #E2E8F0' }}>
                <div className="flex items-center gap-3 mb-4 text-sky-blue font-bold">
                  <BookOpen size={24} /> Tahap Lanjutan (N4)
                </div>
                <ul className="space-y-3 text-gray-600">
                  <li>• 300 Kanji Menengah</li>
                  <li>• Tata Bahasa Kompleks (Pasif, Kausatif)</li>
                  <li>• Percakapan Dunia Kerja</li>
                  <li>• Persiapan Ujian JLPT N4</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section className="section-lp">
          <h2 className="h2-seo">FAQ: Belajar Bahasa Jepang</h2>
          <div className="faq-container" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div className="faq-item">
              <div className="faq-q"><Star size={18} /> Apakah saya harus bisa bahasa Inggris?</div>
              <div className="faq-a">Tidak perlu. Instruksi diberikan dalam bahasa Indonesia yang mudah dimengerti.</div>
            </div>
            <div className="faq-item">
              <div className="faq-q"><Star size={18} /> Apakah ada kelas malam untuk karyawan?</div>
              <div className="faq-a">Ya, kami menyediakan jadwal kelas pagi, siang, dan malam untuk menyesuaikan kesibukan Anda.</div>
            </div>
            <div className="faq-item">
              <div className="faq-q"><Star size={18} /> Apa keunggulan SKYBRIDGE dibanding LPK lain?</div>
              <div className="faq-a">Kami menggunakan kurikulum berstandar internasional dengan fokus pada hasil (output) kemampuan bicara.</div>
            </div>
          </div>
        </section>

        {/* CTA BOX */}
        <section className="section-lp">
          <div className="cta-box">
            <h2 style={{ fontSize: '32px', fontWeight: '900', marginBottom: '16px' }}>Mulai Langkah Pertamamu Hari Ini!</h2>
            <p style={{ color: '#6B7280', marginBottom: '32px', fontSize: '18px' }}>
              Jangan biarkan bahasa menjadi penghalang mimpimu. Belajar di SKYBRIDGE Nusantara International School.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
              <Link to="/register" className="btn-cta">Daftar Sekarang</Link>
              <a href="https://wa.me/817084182215?text=Halo%20Admin%20SKYBRIDGE%20Nusantara,%20saya%20ingin%20konsultasi%20mengenai%20Belajar%20Bahasa%20Jepang%20dari%20Nol." target="_blank" rel="noopener noreferrer" className="btn-cta" style={{ background: '#25D366' }}>
                Konsultasi Gratis via WhatsApp
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default BelajarBahasaJepangDariNol;
