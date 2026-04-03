import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { ArrowRight, CheckCircle, Briefcase, Star, MapPin, Building, ShieldCheck } from 'lucide-react';
import HeroBg from '../assets/img/heroskybridge.webp';

const PelatihanKerjaJepang = () => {
  return (
    <>
      <style>{`
        .lp-body { font-family: 'Plus Jakarta Sans', sans-serif; color: #1C1C1C; background: #FFFFFF; }
        .hero-lp { 
          background: linear-gradient(135deg, #1A0A00 0%, #2D1400 100%); 
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
        .hero-lp::before { content: ''; position: absolute; inset: 0; background-image: radial-gradient(circle at 50% 50%, rgba(245,166,35,0.15), transparent 70%); pointer-events: none; }
        .tagline { display: inline-block; background: rgba(208,2,27,0.2); color: #FF1A35; padding: 6px 16px; border-radius: 100px; font-size: 12px; font-weight: 800; text-transform: uppercase; margin-bottom: 24px; letter-spacing: 0.1em; }
        .h1-seo { font-family: 'Bebas Neue', sans-serif; font-size: clamp(40px, 8vw, 72px); line-height: 1; margin-bottom: 20px; }
        .p-seo { font-size: 18px; color: rgba(255,255,255,0.7); max-width: 800px; margin: 0 auto 40px; line-height: 1.6; }
        .section-lp { padding: 80px 20px; max-width: 1200px; margin: 0 auto; }
        .h2-seo { font-family: 'Bebas Neue', sans-serif; font-size: 48px; margin-bottom: 32px; color: #1C1C1C; text-align: center; }
        .content-grid { display: grid; grid-template-columns: 1fr; gap: 40px; margin-top: 40px; }
        @media (min-width: 768px) { .content-grid { grid-template-columns: 1fr 1fr; } }
        .feature-item { display: flex; gap: 16px; margin-bottom: 24px; }
        .feature-icon { flex-shrink: 0; color: #F5A623; }
        .feature-text h3 { font-weight: 800; font-size: 18px; margin-bottom: 8px; }
        .feature-text p { color: #6B7280; line-height: 1.6; }
        .cta-box { background: #F9FAFB; border-radius: 24px; padding: 60px 40px; text-align: center; margin-top: 60px; border: 1px solid #E5E7EB; }
        .btn-cta { display: inline-flex; align-items: center; gap: 12px; background: #D0021B; color: white; padding: 18px 40px; border-radius: 100px; font-weight: 800; text-decoration: none; transition: 0.3s; }
        .btn-cta:hover { transform: translateY(-3px); box-shadow: 0 10px 30px rgba(208,2,27,0.3); }
        .faq-item { border-bottom: 1px solid #E5E7EB; padding: 24px 0; }
        .faq-q { font-weight: 800; font-size: 18px; margin-bottom: 12px; display: flex; align-items: center; gap: 12px; color: #F5A623; }
        .faq-a { color: #4B5563; line-height: 1.8; padding-left: 32px; }
        .benefit-card { background: white; border: 1px solid #F3F4F6; padding: 32px; border-radius: 24px; box-shadow: 0 4px 12px rgba(0,0,0,0.03); transition: 0.3s; }
        .benefit-card:hover { transform: translateY(-5px); box-shadow: 0 12px 32px rgba(0,0,0,0.08); }
      `}</style>

      <div className="lp-body">
        <Navbar />

        {/* HERO SECTION */}
        <section className="hero-lp">
          <div className="hero-lp-bg"></div>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div className="tagline">Program Kerja ke Jepang Resmi & Terpercaya</div>
            <h1 className="h1-seo">Pelatihan Kerja ke Jepang Terbaik di Indonesia</h1>
            <p className="p-seo">
              Persiapkan diri Anda untuk karir profesional di Jepang bersama SKYBRIDGE Nusantara International School. 
              Program pelatihan kerja terintegrasi, sertifikasi kompetensi, dan jaminan penempatan kerja.
            </p>
            <Link to="/register" className="btn-cta">
              Daftar Pelatihan Sekarang <ArrowRight size={20} />
            </Link>
          </div>
        </section>

        {/* MAIN CONTENT SECTION */}
        <section className="section-lp">
          <h2 className="h2-seo">Program Pelatihan Kerja SKYBRIDGE: Langkah Pasti ke Jepang</h2>
          <div className="content-grid">
            <div className="feature-image">
              <img 
                src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=80&w=800" 
                alt="Pelatihan Kerja Jepang SKYBRIDGE" 
                style={{ width: '100%', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
              />
            </div>
            <div className="feature-text-main">
              <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#4B5563', marginBottom: '24px' }}>
                Mencari <strong>program kerja ke Jepang resmi</strong> yang aman dan terjamin? 
                <strong> SKYBRIDGE Nusantara International School</strong> menawarkan solusi lengkap bagi para pencari kerja Indonesia 
                yang ingin membangun masa depan di Negeri Sakura melalui jalur <strong>pelatihan kerja ke Jepang</strong> yang sah.
              </p>
              <div className="feature-item">
                <div className="feature-icon"><ShieldCheck size={24} /></div>
                <div className="feature-text">
                  <h3>Legalitas Resmi 100%</h3>
                  <p>Seluruh program kami diawasi oleh kementerian terkait dan bermitra dengan Kumiai resmi di Jepang.</p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon"><Building size={24} /></div>
                <div className="feature-text">
                  <h3>Fasilitas Pelatihan Modern</h3>
                  <p>Gunakan peralatan standar Jepang untuk menguasai keterampilan teknis di berbagai bidang industri.</p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon"><Briefcase size={24} /></div>
                <div className="feature-text">
                  <h3>Bimbingan Karir & Wawancara</h3>
                  <p>Simulasi wawancara dengan user Jepang (Kumiai) hingga Anda berhasil mendapatkan kontrak kerja.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BENEFITS SECTION */}
        <section className="section-lp" style={{ background: '#FDF6EC' }}>
          <h2 className="h2-seo">Keuntungan Program Kerja di SKYBRIDGE</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="benefit-card">
              <h3 className="font-bold text-xl mb-4 text-dory-red">Gaji Tinggi & Fasilitas</h3>
              <p className="text-gray-600">Dapatkan penghasilan bulanan kompetitif, asuransi kesehatan, dan subsidi tempat tinggal di Jepang.</p>
            </div>
            <div className="benefit-card">
              <h3 className="font-bold text-xl mb-4 text-dory-red">Pengembangan Karir</h3>
              <p className="text-gray-600">Pengalaman kerja internasional yang akan meningkatkan nilai tawar Anda di pasar tenaga kerja global.</p>
            </div>
            <div className="benefit-card">
              <h3 className="font-bold text-xl mb-4 text-dory-red">Dukungan Alumni</h3>
              <p className="text-gray-600">Jaringan alumni SKYBRIDGE yang luas di Jepang siap membantu Anda beradaptasi dengan lingkungan baru.</p>
            </div>
          </div>
        </section>

        {/* DETAILED INFO SECTION */}
        <section className="section-lp">
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <h2 className="h2-seo" style={{ textAlign: 'left' }}>Alur Pendaftaran Pelatihan Kerja Jepang</h2>
            <div style={{ fontSize: '16px', lineHeight: '1.8', color: '#4B5563' }}>
              <p className="mb-6">
                Proses <strong>kerja ke Jepang resmi</strong> memerlukan persiapan yang matang. 
                Di SKYBRIDGE Nusantara International School, kami menyederhanakan proses tersebut melalui alur yang transparan:
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex gap-4 p-4 border-l-4 border-dory-red bg-red-50">
                  <span className="font-black text-dory-red text-2xl">01</span>
                  <div>
                    <h4 className="font-bold text-black">Pendaftaran & Seleksi Berkas</h4>
                    <p>Isi formulir online dan unggah dokumen persyaratan seperti KTP, Ijazah, dan KK.</p>
                  </div>
                </div>
                <div className="flex gap-4 p-4 border-l-4 border-dory-red bg-red-50">
                  <span className="font-black text-dory-red text-2xl">02</span>
                  <div>
                    <h4 className="font-bold text-black">Pelatihan Bahasa & Keterampilan</h4>
                    <p>Ikuti kursus bahasa Jepang intensif dan pelatihan teknis sesuai bidang pekerjaan yang dipilih.</p>
                  </div>
                </div>
                <div className="flex gap-4 p-4 border-l-4 border-dory-red bg-red-50">
                  <span className="font-black text-dory-red text-2xl">03</span>
                  <div>
                    <h4 className="font-bold text-black">Wawancara dengan Kumiai</h4>
                    <p>Bertemu langsung dengan perwakilan perusahaan Jepang untuk proses seleksi akhir.</p>
                  </div>
                </div>
                <div className="flex gap-4 p-4 border-l-4 border-dory-red bg-red-50">
                  <span className="font-black text-dory-red text-2xl">04</span>
                  <div>
                    <h4 className="font-bold text-black">Pemberangkatan</h4>
                    <p>Proses administrasi visa dan keberangkatan menuju Jepang untuk memulai karir Anda.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section className="section-lp" style={{ borderTop: '1px solid #E5E7EB' }}>
          <h2 className="h2-seo">Pertanyaan Seputar Pelatihan Kerja Jepang</h2>
          <div className="faq-container" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div className="faq-item">
              <div className="faq-q"><MapPin size={18} /> Dimana lokasi SKYBRIDGE Nusantara International School?</div>
              <div className="faq-a">Kami berlokasi di pusat pendidikan strategis di Indonesia. Silakan hubungi admin untuk alamat lengkap cabang terdekat.</div>
            </div>
            <div className="faq-item">
              <div className="faq-q"><CheckCircle size={18} /> Apa saja bidang kerja yang tersedia?</div>
              <div className="faq-a">Tersedia bidang pengolahan makanan, konstruksi, pertanian, perawat (Kaigo), dan manufaktur.</div>
            </div>
            <div className="faq-item">
              <div className="faq-q"><ShieldCheck size={18} /> Apakah program ini resmi pemerintah?</div>
              <div className="faq-a">Ya, seluruh program kami mengikuti prosedur resmi penempatan tenaga kerja ke luar negeri yang sah.</div>
            </div>
          </div>
        </section>

        {/* CTA BOX */}
        <section className="section-lp">
          <div className="cta-box">
            <h2 style={{ fontSize: '32px', fontWeight: '900', marginBottom: '16px' }}>Wujudkan Masa Depan di Jepang Sekarang!</h2>
            <p style={{ color: '#6B7280', marginBottom: '32px', fontSize: '18px' }}>
              Daftar hari ini dan mulailah perjalanan karir internasional Anda bersama SKYBRIDGE.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
              <Link to="/register" className="btn-cta">Daftar Sekarang</Link>
              <a href="https://wa.me/817084182215?text=Halo%20Admin%20SKYBRIDGE%20Nusantara,%20saya%20ingin%20konsultasi%20mengenai%20Pelatihan%20Kerja%20ke%20Jepang." target="_blank" rel="noopener noreferrer" className="btn-cta" style={{ background: '#25D366' }}>
                Konsultasi Gratis via WhatsApp
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default PelatihanKerjaJepang;
