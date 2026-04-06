import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { ArrowRight, CheckCircle, BookOpen, Users, Briefcase, Star, Zap, MapPin, Phone, Mail, Globe, Trophy, Instagram, Facebook, Youtube } from 'lucide-react';
import HeroImage from '../assets/img/hero-lpk-doryouku.png';
import HeroBg from '../assets/img/heroskybridge.webp';
import HeroImg from '../assets/img/Hero LPK DORYOUKU.webp';

const LandingPage = () => {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Noto+Sans+JP:wght@400;700;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        :root {
          --red: #D0021B;
          --red-dark: #A50015;
          --red-light: #FF1A35;
          --gold: #C8860A;
          --gold-light: #F5A623;
          --cream: #FDF6EC;
          --dark: #1A1A2E;
          --dark-2: #16213E;
          --ink: #2D2D2D;
          --gray: #6B7280;
          --white: #FFFFFF;
        }

        .lpk-body {
          font-family: 'Plus Jakarta Sans', sans-serif;
          color: var(--ink);
          background: var(--white);
        }

        /* ── HERO SECTION ── */
        .hero-wrap {
          position: relative;
          background: linear-gradient(135deg, #001A35 0%, #003B73 50%, #005696 100%);
          overflow: hidden;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          padding-top: 20px;
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
          z-index: 1;
        }

        /* Modern sun/glow effect */
        .hero-sun {
          position: absolute;
          top: -10%;
          right: -10%;
          width: 600px;
          height: 600px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(0, 163, 224, 0.2) 0%, rgba(0, 59, 115, 0.05) 50%, transparent 70%);
          pointer-events: none;
          z-index: 1;
        }

        /* Japanese pattern overlay */
        .hero-pattern {
          position: absolute;
          inset: 0;
          background-image: url("https://www.transparenttextures.com/patterns/japanese-sayagata.png");
          opacity: 0.05;
          pointer-events: none;
          z-index: 1;
        }

        .hero-img-col {
          position: relative;
          z-index: 5;
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .hero-main-img {
          width: 100%;
          height: auto;
          object-fit: cover;
          display: block;
          filter: drop-shadow(0 30px 60px rgba(0,0,0,0.4));
          border-radius: 40px;
        }

        /* Floating kanji stamp - Modern Style */
        .kanji-stamp {
          position: absolute;
          top: 40px;
          right: 40px;
          z-index: 20;
          width: 70px;
          height: 70px;
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Noto Sans JP', sans-serif;
          font-weight: 900;
          font-size: 24px;
          color: white;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(8px);
          line-height: 1.1;
          text-align: center;
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }

        /* Hero text card - Glassmorphism */
        .hero-text-card {
          position: relative;
          z-index: 10;
          padding: 48px 32px;
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 40px;
          margin: -80px 20px 40px;
          max-width: 1100px;
          align-self: center;
          box-shadow: 0 40px 100px -20px rgba(0,0,0,0.5);
          text-align: center;
        }

        @media (min-width: 1024px) {
          .hero-text-card {
            margin-top: -120px;
            padding: 60px 80px;
          }
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: linear-gradient(135deg, #F5A623 0%, #D97706 100%);
          color: white;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 800;
          font-size: 12px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 10px 24px;
          border-radius: 100px;
          margin-bottom: 32px;
          box-shadow: 0 10px 25px rgba(217, 119, 6, 0.3);
        }

        .hero-title {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: clamp(32px, 5vw, 56px);
          font-weight: 800;
          color: var(--white);
          line-height: 1.15;
          letter-spacing: -0.02em;
          margin-bottom: 24px;
        }

        .hero-title .accent {
          color: #00A3E0;
          background: linear-gradient(to right, #00A3E0, #60E5FF);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero-subtitle {
          font-size: 18px;
          color: rgba(255, 255, 255, 0.75);
          margin-bottom: 40px;
          line-height: 1.7;
          max-width: 800px;
          margin-left: auto;
          margin-right: auto;
        }

        .hero-cta {
          display: inline-flex;
          align-items: center;
          gap: 14px;
          background: #00A3E0;
          color: white;
          padding: 20px 48px;
          border-radius: 100px;
          font-weight: 800;
          font-size: 17px;
          text-decoration: none;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 15px 35px rgba(0, 163, 224, 0.4);
        }

        .hero-cta:hover {
          background: white;
          color: #003B73;
          transform: translateY(-5px);
          box-shadow: 0 20px 45px rgba(0, 163, 224, 0.5);
        }

        /* Stats row - Modern & Integrated */
        .stats-row {
          position: relative;
          z-index: 10;
          display: flex;
          justify-content: center;
          gap: 24px;
          margin: 0 auto 32px;
          max-width: 900px;
          padding: 0 20px;
        }

        @media (min-width: 768px) {
          .stats-row { gap: 60px; }
        }

        .stat-item {
          text-align: center;
          position: relative;
        }

        .stat-num {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: clamp(32px, 4vw, 48px);
          font-weight: 800;
          color: #F5A623;
          line-height: 1;
          display: block;
          margin-bottom: 8px;
          text-shadow: 0 4px 15px rgba(245, 166, 35, 0.2);
        }

        .stat-label {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.5);
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        /* ── WHY SECTION ── */
        .why-section {
          position: relative;
          padding: 100px 0;
          background: #F8FAFC;
          overflow: hidden;
        }

        /* Subtle Japanese Pattern for Section Bg */
        .why-section::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("https://www.transparenttextures.com/patterns/natural-paper.png");
          opacity: 0.4;
          pointer-events: none;
        }

        .why-label {
          display: inline-block;
          background: rgba(0, 59, 115, 0.05);
          color: #003B73;
          padding: 8px 20px;
          border-radius: 100px;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-bottom: 24px;
        }

        .why-title {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: clamp(32px, 5vw, 48px);
          font-weight: 800;
          color: #0F172A;
          letter-spacing: -0.02em;
          line-height: 1.2;
          margin-bottom: 20px;
        }

        .why-title .blue { color: #00A3E0; }

        .why-desc {
          font-size: 17px;
          color: #64748B;
          max-width: 700px;
          margin: 0 auto;
          line-height: 1.8;
        }

        /* Cards grid */
        .cards-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 32px;
          padding: 0 24px;
          margin-top: 64px;
          max-width: 1280px;
          margin-left: auto;
          margin-right: auto;
        }

        @media (min-width: 1024px) {
          .cards-grid { grid-template-columns: repeat(3, 1fr); }
        }

        .feature-card {
          position: relative;
          background: white;
          border-radius: 32px;
          padding: 48px 32px;
          border: 1px solid #F1F5F9;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          flex-direction: column;
          box-shadow: 0 10px 30px -10px rgba(0,0,0,0.05);
        }

        .feature-card:hover {
          transform: translateY(-12px);
          box-shadow: 0 40px 80px -20px rgba(0,0,0,0.1);
          border-color: #E2E8F0;
        }

        .card-num {
          position: absolute;
          top: 32px;
          right: 32px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 64px;
          font-weight: 900;
          color: rgba(0,0,0,0.03);
          line-height: 1;
          pointer-events: none;
        }

        .card-icon-wrap {
          width: 64px;
          height: 64px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 32px;
          background: #F0F7FF;
          color: #003B73;
          transition: all 0.3s;
        }

        .feature-card:hover .card-icon-wrap {
          background: #003B73;
          color: white;
          transform: scale(1.1) rotate(5deg);
        }

        .card-title {
          font-weight: 800;
          font-size: 22px;
          color: #0F172A;
          margin-bottom: 16px;
          line-height: 1.4;
        }

        .card-desc {
          font-size: 15px;
          color: #64748B;
          line-height: 1.7;
          margin-bottom: 32px;
        }

        /* Card themes */
        .card-blue {
          --card-accent: linear-gradient(90deg, #003B73, #00A3E0);
          --card-icon-bg: linear-gradient(135deg, #003B73, #002D58);
          --card-icon-shadow: 0 8px 24px rgba(0,59,115,0.3);
          --card-tag-color: rgba(255,255,255,0.85);
        }
        .card-blue .card-icon-wrap svg { color: white; }

        .card-gold {
          --card-accent: linear-gradient(90deg, var(--gold), var(--gold-light));
          --card-icon-bg: linear-gradient(135deg, var(--gold), var(--gold-light));
          --card-icon-shadow: 0 8px 24px rgba(200,134,10,0.3);
          --card-tag-color: rgba(255,255,255,0.85);
        }
        .card-gold .card-icon-wrap svg { color: white; }

        .card-teal {
          --card-accent: linear-gradient(90deg, #0D9488, #14B8A6);
          --card-icon-bg: linear-gradient(135deg, #0D9488, #14B8A6);
          --card-icon-shadow: 0 8px 24px rgba(13,148,136,0.3);
          --card-tag-color: rgba(255,255,255,0.85);
        }
        .card-teal .card-icon-wrap svg { color: white; }

        /* ── SCROLLING TICKER - Enhanced ── */
        .ticker-wrap {
          overflow: hidden;
          background: rgba(15, 23, 42, 0.8);
          backdrop-filter: blur(10px);
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          padding: 20px 0;
          position: relative;
          z-index: 10;
        }

        .ticker-inner {
          display: flex;
          white-space: nowrap;
          animation: ticker 22s linear infinite;
          gap: 0;
        }

        .ticker-item {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          padding: 0 32px;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 18px;
          letter-spacing: 0.08em;
          color: white;
        }

        .ticker-dot {
          width: 6px;
          height: 6px;
          background: rgba(255,255,255,0.5);
          border-radius: 50%;
          flex-shrink: 0;
        }

        @keyframes ticker {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }

        /* ── FOOTER ── */
        .footer-premium {
          background: #0B1120;
          color: white;
          padding: 100px 0 40px;
          position: relative;
          overflow: hidden;
        }

        .footer-premium::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(to right, transparent, rgba(255,255,255,0.1), transparent);
        }

        .footer-grid {
          max-width: 1280px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 60px;
          padding: 0 24px;
          position: relative;
          z-index: 2;
        }

        .footer-brand h3 {
          font-size: 24px;
          font-weight: 900;
          margin-bottom: 24px;
          color: #00A3E0;
          letter-spacing: -0.02em;
        }

        .footer-brand p {
          color: #94A3B8;
          line-height: 1.8;
          margin-bottom: 32px;
          font-size: 15px;
          max-width: 320px;
        }

        .social-wrap {
          display: flex;
          gap: 12px;
        }

        .social-btn {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          text-decoration: none;
        }

        .social-btn:hover {
          background: #00A3E0;
          border-color: #00A3E0;
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0, 163, 224, 0.3);
          color: white;
        }

        .footer-col h4 {
          font-size: 17px;
          font-weight: 800;
          margin-bottom: 32px;
          color: white;
          position: relative;
          display: inline-block;
        }

        .footer-col h4::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: -8px;
          width: 30px;
          height: 2px;
          background: #00A3E0;
          border-radius: 2px;
        }

        .footer-links {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .footer-links a {
          color: #94A3B8;
          text-decoration: none;
          font-size: 15px;
          transition: 0.3s;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .footer-links a:hover {
          color: white;
          transform: translateX(5px);
        }

        .contact-info {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .contact-item {
          display: flex;
          gap: 16px;
          color: #94A3B8;
          font-size: 15px;
          line-height: 1.5;
        }

        .contact-icon {
          flex-shrink: 0;
          color: #00A3E0;
        }

        .map-placeholder {
          border-radius: 24px;
          overflow: hidden;
          height: 180px;
          background: #1E293B;
          border: 1px solid rgba(255, 255, 255, 0.05);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          margin-top: 16px;
        }

        .map-placeholder::before {
          content: 'Google Maps Integration';
          font-size: 12px;
          color: #475569;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .footer-bottom {
          max-width: 1280px;
          margin: 80px auto 0;
          padding: 40px 24px 0;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
          text-align: center;
        }

        @media (min-width: 768px) {
          .footer-bottom {
            flex-direction: row;
            justify-content: space-between;
            text-align: left;
          }
        }

        .copyright {
          font-size: 14px;
          color: #64748B;
        }
      `}</style>

      <div className="lpk-body">
        <Navbar />

        {/* ═══════════ HERO ═══════════ */}
        <div className="hero-wrap">
          <div className="hero-lp-bg" />
          <div className="hero-pattern" />
          <div className="hero-sun" />

          {/* Hero Image Section */}
          <div className="hero-img-col">
            <div style={{ position: 'relative' }}>
              <img 
                src={HeroImg} 
                alt="Program Pelatihan Kerja dan Magang ke Jepang di SKYBRIDGE" 
                className="hero-main-img" 
                loading="eager"
                fetchPriority="high"
              />
              {/* Kanji stamp */}
              <div className="kanji-stamp">
                努<br/>力
              </div>
            </div>
          </div>

          {/* Hero Content Card */}
          <div className="hero-text-card">
            {/* Stats Row Integrated into Card or Above */}
            <div className="stats-row">
              {[
                { num: '500+', label: 'Alumni Berangkat' },
                { num: '98%', label: 'Tingkat Kelulusan' },
                { num: '50+', label: 'Mitra Kumiai' },
              ].map((s, i) => (
                <div className="stat-item" key={i}>
                  <span className="stat-num">{s.num}</span>
                  <span className="stat-label">{s.label}</span>
                </div>
              ))}
            </div>

            <div className="hero-badge">
              <Star size={14} fill="currentColor" />
              Program Magang Jepang Terpercaya
            </div>
            
            <h1 className="hero-title">
              Kursus Bahasa Jepang & Program Kerja ke Jepang – <span className="accent">SKYBRIDGE</span>
            </h1>
            
            <p className="hero-subtitle">
              Belajar bahasa Jepang dari nol, ikuti pelatihan kerja resmi, dan program magang ke Jepang bersama SKYBRIDGE Nusantara International School. Institusi profesional dan terpercaya di Indonesia.
            </p>
            
            <Link to="/register" className="hero-cta">
              Daftar Sekarang <ArrowRight size={20} />
            </Link>
          </div>
        </div>

        {/* ═══════════ TICKER ═══════════ */}
        <div className="ticker-wrap">
          <div className="ticker-inner">
            {[
              { icon: Globe, text: 'Berangkat ke Jepang' },
              { icon: Zap, text: 'Gaji Kompetitif' },
              { icon: Trophy, text: 'Lulus JLPT N4' },
              { icon: Users, text: 'Mitra Kumiai Terpercaya' },
              { icon: BookOpen, text: 'Pelatihan Intensif' },
              { icon: Star, text: 'Mimpi Jadi Nyata' },
              { icon: Globe, text: 'Berangkat ke Jepang' },
              { icon: Zap, text: 'Gaji Kompetitif' },
              { icon: Trophy, text: 'Lulus JLPT N4' },
              { icon: Users, text: 'Mitra Kumiai Terpercaya' },
              { icon: BookOpen, text: 'Pelatihan Intensif' },
              { icon: Star, text: 'Mimpi Jadi Nyata' },
            ].map((item, i) => (
              <span className="ticker-item" key={i}>
                <item.icon size={18} className="text-sky-blue-light" />
                {item.text}
                <span className="ticker-dot" />
              </span>
            ))}
          </div>
        </div>

        {/* ═══════════ WHY SECTION ═══════════ */}
        <section className="why-section">
          <div style={{ textAlign: 'center', position: 'relative', zIndex: 10, padding: '0 20px' }}>
            <span className="why-label">Keunggulan Kami</span>
            <h2 className="why-title">
              Mengapa Memilih<br />
              <span className="blue">SKYBRIDGE Nusantara International School?</span>
            </h2>
            <p className="why-desc">
              Lembaga pendidikan dan pelatihan kerja internasional yang menjadi pintu gerbang utama masyarakat Indonesia menuju karir sukses di Jepang dengan standar kualitas global.
            </p>
          </div>

          <div className="cards-grid">
            {[
              {
                icon: BookOpen,
                num: '01',
                title: 'Kursus Bahasa Jepang Online',
                desc: 'Kurikulum terpadu dari nol hingga mahir (N5-N4) dengan metode interaktif yang fleksibel.',
                link: '/kursus-bahasa-jepang-online',
                color: '#00A3E0'
              },
              {
                icon: Users,
                num: '02',
                title: 'Pelatihan Kerja Resmi',
                desc: 'Persiapan mental dan fisik sesuai budaya kerja Jepang dengan instruktur berpengalaman.',
                link: '/pelatihan-kerja-ke-jepang',
                color: '#F5A623'
              },
              {
                icon: Briefcase,
                num: '03',
                title: 'Jaminan Penempatan',
                desc: 'Akses langsung ke jaringan mitra perusahaan dan Kumiai resmi di seluruh wilayah Jepang.',
                link: '/magang-ke-jepang',
                color: '#14B8A6'
              },
            ].map((card, idx) => {
              const Icon = card.icon;
              return (
                <Link to={card.link} key={idx} className="feature-card" style={{ textDecoration: 'none' }}>
                  <span className="card-num">{card.num}</span>
                  <div className="card-icon-wrap">
                    <Icon size={32} />
                  </div>
                  <h3 className="card-title">{card.title}</h3>
                  <p className="card-desc">{card.desc}</p>
                  <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '8px', color: card.color, fontWeight: '800', fontSize: '15px' }}>
                    Pelajari Program <ArrowRight size={18} />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
        {/* ═══════════ TRUST SIGNALS ═══════════ */}
        <section className="section-lp" style={{ padding: '80px 20px', background: '#F9FAFB' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 className="h2-seo">Testimoni Alumni Sukses</h2>
            <p className="why-desc">Ribuan alumni SKYBRIDGE telah berhasil membangun karir impian mereka di Jepang.</p>
          </div>
          <div className="cards-grid" style={{ marginTop: '0' }}>
            {[
              { name: 'Budi Santoso', job: 'Engineering - Tokyo', text: 'Berkat SKYBRIDGE, saya bisa bekerja di perusahaan konstruksi ternama di Tokyo. Pelatihannya sangat intensif dan membantu adaptasi saya.' },
              { name: 'Siti Aminah', job: 'Kaigo - Osaka', text: 'Sensei di SKYBRIDGE sangat sabar membimbing dari nol sampai saya lulus JLPT N4. Sekarang saya sudah 2 tahun di Osaka.' },
              { name: 'Rian Hidayat', job: 'Agriculture - Hokkaido', text: 'Program magang resmi yang aman. Proses pemberangkatan transparan dan pendampingan di Jepang sangat membantu.' },
            ].map((t, i) => (
              <div key={i} style={{ background: 'white', padding: '32px', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', border: '1px solid #F3F4F6' }}>
                <div style={{ color: '#F5A623', display: 'flex', gap: '4px', marginBottom: '16px' }}>
                  {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                </div>
                <p style={{ fontStyle: 'italic', color: '#4B5563', marginBottom: '24px', lineHeight: '1.7' }}>"{t.text}"</p>
                <div>
                  <div style={{ fontWeight: '800', color: '#1C1C1C' }}>{t.name}</div>
                  <div style={{ fontSize: '13px', color: '#9CA3AF' }}>{t.job}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════ FOOTER ═══════════ */}
        <footer className="footer-premium">
          <div className="footer-grid">
            {/* Column 1: Brand */}
            <div className="footer-brand">
              <h3>SKYBRIDGE NUSANTARA</h3>
              <p>
                Lembaga pendidikan dan pelatihan kerja internasional terpercaya di Indonesia. 
                Pintu gerbang utama menuju karir sukses di Jepang.
              </p>
              <div className="social-wrap">
                <a href="#" className="social-btn" aria-label="Instagram">
                  <Instagram size={20} />
                </a>
                <a href="#" className="social-btn" aria-label="Facebook">
                  <Facebook size={20} />
                </a>
                <a href="#" className="social-btn" aria-label="Youtube">
                  <Youtube size={20} />
                </a>
              </div>
            </div>
            
            {/* Column 2: Programs */}
            <div className="footer-col">
              <h4>Program Kami</h4>
              <ul className="footer-links">
                <li><Link to="/kursus-bahasa-jepang-online">Kursus Bahasa Jepang</Link></li>
                <li><Link to="/pelatihan-kerja-ke-jepang">Pelatihan Kerja</Link></li>
                <li><Link to="/magang-ke-jepang">Program Magang</Link></li>
                <li><Link to="/register">Belajar Dari Nol</Link></li>
              </ul>
            </div>

            {/* Column 3: Blog */}
            <div className="footer-col">
              <h4>Blog & Artikel</h4>
              <ul className="footer-links">
                <li><Link to="/blog/kerja-jepang-tanpa-pengalaman">Kerja Jepang Tanpa Pengalaman</Link></li>
                <li><Link to="/blog/biaya-kursus-bahasa-jepang">Berapa Biaya Kursus Jepang?</Link></li>
                <li><Link to="/blog/tips-lolos-magang-ke-jepang">Tips Lolos Magang Jepang</Link></li>
              </ul>
            </div>

            {/* Column 4: Contact & Location */}
            <div className="footer-col">
              <h4>Hubungi Kami</h4>
              <div className="contact-info">
                <div className="contact-item">
                  <MapPin size={20} className="contact-icon" />
                  <span>Komplek Pertokoan Grand Lingkar No.7, Mataram, Indonesia</span>
                </div>
                <div className="contact-item">
                  <Phone size={20} className="contact-icon" />
                  <span>+81 70-8418-2215</span>
                </div>
                <div className="contact-item">
                  <Mail size={20} className="contact-icon" />
                  <span>info@snischool.com</span>
                </div>
              </div>
              <div className="map-placeholder"></div>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p className="copyright">
              &copy; {new Date().getFullYear()} SKYBRIDGE Nusantara International School. All Rights Reserved.
            </p>
            <div style={{ display: 'flex', gap: '24px' }}>
              <Link to="/privacy" style={{ color: '#64748B', fontSize: '14px', textDecoration: 'none' }}>Kebijakan Privasi</Link>
              <Link to="/terms" style={{ color: '#64748B', fontSize: '14px', textDecoration: 'none' }}>Syarat & Ketentuan</Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default LandingPage;
