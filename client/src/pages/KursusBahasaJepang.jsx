import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { ArrowRight, CheckCircle, BookOpen, Star, Clock, Globe, Award } from 'lucide-react';
import HeroBg from '../assets/img/heroskybridge.webp';

const KursusBahasaJepang = () => {
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
            <div className="tagline">#1 Kursus Bahasa Jepang Terpercaya</div>
            <h1 className="h1-seo">Kursus Bahasa Jepang Online Terbaik di Indonesia</h1>
            <p className="p-seo">
              Belajar bahasa Jepang dari nol hingga mahir (JLPT N5 - N4) bersama SKYBRIDGE Nusantara International School. 
              Metode belajar interaktif, instruktur berpengalaman, dan jaminan kualitas internasional.
            </p>
            <Link to="/register" className="btn-cta">
              Daftar Kursus Sekarang <ArrowRight size={20} />
            </Link>
          </div>
        </section>

        {/* MAIN CONTENT SECTION */}
        <section className="section-lp">
          <h2 className="h2-seo">Kenapa Memilih Kursus Bahasa Jepang Online SKYBRIDGE?</h2>
          <div className="content-grid">
            <div className="feature-text-main">
              <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#4B5563', marginBottom: '24px' }}>
                Apakah Anda ingin bekerja di Jepang, melanjutkan studi, atau sekadar ingin menguasai bahasa Jepang? 
                <strong> SKYBRIDGE Nusantara International School</strong> menyediakan kurikulum yang dirancang khusus untuk orang Indonesia 
                agar bisa menguasai bahasa Jepang dengan cepat dan efektif.
              </p>
              <div className="feature-item">
                <div className="feature-icon"><CheckCircle size={24} /></div>
                <div className="feature-text">
                  <h3>Belajar Dari Nol (Zero to Hero)</h3>
                  <p>Program kami dirancang untuk pemula yang tidak memiliki dasar bahasa Jepang sama sekali.</p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon"><Globe size={24} /></div>
                <div className="feature-text">
                  <h3>Fleksibilitas Belajar Online</h3>
                  <p>Akses kelas dari mana saja dan kapan saja melalui platform digital kami yang canggih.</p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon"><Award size={24} /></div>
                <div className="feature-text">
                  <h3>Sertifikasi JLPT N4/N5</h3>
                  <p>Persiapan intensif untuk ujian kemampuan bahasa Jepang (JLPT) dengan tingkat kelulusan 98%.</p>
                </div>
              </div>
            </div>
            <div className="feature-image">
              <img 
                src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800" 
                alt="Belajar Bahasa Jepang Online SKYBRIDGE" 
                style={{ width: '100%', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
              />
            </div>
          </div>
        </section>

        {/* DETAILED INFO SECTION (SEO Content 1000+ words target) */}
        <section className="section-lp" style={{ background: '#F9FAFB', borderRadius: '40px' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <h2 className="h2-seo" style={{ textAlign: 'left' }}>Program Pelatihan Bahasa Jepang Komprehensif</h2>
            <div style={{ fontSize: '16px', lineHeight: '1.8', color: '#4B5563' }}>
              <p className="mb-6">
                Belajar bahasa Jepang bukan hanya soal menghafal kosakata, tetapi juga memahami budaya dan etos kerja Jepang. 
                Di <strong>SKYBRIDGE Nusantara International School</strong>, kami mengintegrasikan elemen budaya dalam setiap modul pembelajaran. 
                Hal ini sangat krusial bagi Anda yang berencana mengikuti <strong>program magang ke Jepang</strong> atau 
                <strong> pelatihan kerja ke Jepang</strong> resmi.
              </p>
              <h3 className="font-bold text-xl mb-4 text-black">Materi Yang Akan Anda Pelajari:</h3>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li>Huruf Hiragana, Katakana, dan Dasar Kanji</li>
                <li>Tata Bahasa (Bunpou) Standar JLPT N5 & N4</li>
                <li>Percakapan Sehari-hari (Kaiwa) di Lingkungan Kerja</li>
                <li>Pemahaman Mendengarkan (Choukai)</li>
                <li>Budaya dan Etika Kerja Jepang (Orijentasi)</li>
              </ul>
              <p className="mb-6">
                Kami memahami bahwa setiap siswa memiliki kecepatan belajar yang berbeda. Oleh karena itu, instruktur kami 
                siap memberikan bimbingan personal untuk memastikan tidak ada siswa yang tertinggal. 
                Dengan bergabung di SKYBRIDGE, Anda tidak hanya belajar bahasa, tetapi juga membangun pondasi karir internasional Anda.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section className="section-lp">
          <h2 className="h2-seo">Pertanyaan Umum (FAQ)</h2>
          <div className="faq-container" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div className="faq-item">
              <div className="faq-q"><Star size={18} /> Apakah kursus ini cocok untuk pemula?</div>
              <div className="faq-a">Sangat cocok! Program kami dimulai dari pengenalan huruf dasar hingga tata bahasa tingkat lanjut.</div>
            </div>
            <div className="faq-item">
              <div className="faq-q"><Star size={18} /> Berapa lama durasi kursus bahasa Jepang ini?</div>
              <div className="faq-a">Untuk tingkat N5 - N4, biasanya memakan waktu 3-6 bulan tergantung intensitas kelas yang dipilih.</div>
            </div>
            <div className="faq-item">
              <div className="faq-q"><Star size={18} /> Apakah ada jaminan kerja setelah lulus?</div>
              <div className="faq-a">Lulusan SKYBRIDGE mendapatkan akses prioritas ke program magang dan kerja ke Jepang melalui mitra Kumiai kami.</div>
            </div>
          </div>
        </section>

        {/* CTA BOX */}
        <section className="section-lp">
          <div className="cta-box">
            <h2 style={{ fontSize: '32px', fontWeight: '900', marginBottom: '16px' }}>Siap Berangkat ke Jepang?</h2>
            <p style={{ color: '#6B7280', marginBottom: '32px', fontSize: '18px' }}>
              Jangan tunda lagi impian Anda. Daftar sekarang di SKYBRIDGE Nusantara International School.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
              <Link to="/register" className="btn-cta">Daftar Sekarang</Link>
              <a href="https://wa.me/817084182215?text=Halo%20Admin%20SKYBRIDGE%20Nusantara,%20saya%20ingin%20konsultasi%20mengenai%20Kursus%20Bahasa%20Jepang%20Online." target="_blank" rel="noopener noreferrer" className="btn-cta" style={{ background: '#25D366' }}>
                Konsultasi Gratis via WhatsApp
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default KursusBahasaJepang;
