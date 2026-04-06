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
          background: linear-gradient(135deg, #F8FAFC 0%, #EFF6FF 100%);
          overflow: hidden;
          min-height: 100vh;
          display: flex;
          align-items: center;
          padding: 120px 0 80px;
        }

        .hero-container {
          width: 100%;
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 40px;
          display: grid;
          grid-template-columns: 1fr;
          gap: 60px;
          align-items: center;
          position: relative;
          z-index: 10;
        }

        @media (min-width: 1024px) {
          .hero-container {
            grid-template-columns: 1.1fr 0.9fr;
          }
        }

        /* Abstract Background Elements */
        .hero-shape-1 {
          position: absolute;
          top: -100px;
          right: -100px;
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(0, 163, 224, 0.1) 0%, transparent 70%);
          border-radius: 50%;
          z-index: 1;
        }

        .hero-shape-2 {
          position: absolute;
          bottom: -50px;
          left: -50px;
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(245, 166, 35, 0.05) 0%, transparent 70%);
          border-radius: 50%;
          z-index: 1;
        }

        .hero-content {
          text-align: left;
          z-index: 10;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: rgba(0, 163, 224, 0.1);
          color: #003B73;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 700;
          font-size: 13px;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          padding: 8px 20px;
          border-radius: 100px;
          margin-bottom: 24px;
          border: 1px solid rgba(0, 163, 224, 0.2);
        }

        .hero-title {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: clamp(36px, 5vw, 64px);
          font-weight: 800;
          color: #0F172A;
          line-height: 1.1;
          letter-spacing: -0.03em;
          margin-bottom: 24px;
        }

        .hero-title .accent {
          color: #00A3E0;
          position: relative;
          display: inline-block;
        }

        .hero-title .accent::after {
          content: '';
          position: absolute;
          bottom: 8px;
          left: 0;
          width: 100%;
          height: 12px;
          background: rgba(0, 163, 224, 0.1);
          z-index: -1;
        }

        .hero-subtitle {
          font-size: 18px;
          color: #64748B;
          margin-bottom: 40px;
          line-height: 1.7;
          max-width: 600px;
        }

        .hero-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          margin-bottom: 48px;
        }

        .hero-cta {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          background: #003B73;
          color: white;
          padding: 18px 36px;
          border-radius: 16px;
          font-weight: 700;
          font-size: 16px;
          text-decoration: none;
          transition: all 0.3s;
          box-shadow: 0 10px 25px rgba(0, 59, 115, 0.2);
        }

        .hero-cta:hover {
          background: #00A3E0;
          transform: translateY(-3px);
          box-shadow: 0 15px 30px rgba(0, 163, 224, 0.3);
        }

        .hero-secondary-cta {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          background: white;
          color: #003B73;
          padding: 18px 36px;
          border-radius: 16px;
          font-weight: 700;
          font-size: 16px;
          text-decoration: none;
          transition: all 0.3s;
          border: 1px solid #E2E8F0;
        }

        .hero-secondary-cta:hover {
          background: #F8FAFC;
          border-color: #CBD5E1;
          transform: translateY(-3px);
        }

        /* Stats in Hero */
        .hero-stats {
          display: flex;
          gap: 40px;
          border-top: 1px solid #E2E8F0;
          padding-top: 32px;
        }

        .hero-stat-item {
          display: flex;
          flex-direction: column;
        }

        .hero-stat-num {
          font-size: 28px;
          font-weight: 800;
          color: #0F172A;
          line-height: 1;
          margin-bottom: 4px;
        }

        .hero-stat-label {
          font-size: 13px;
          color: #64748B;
          font-weight: 600;
        }

        /* Hero Image Column */
        .hero-image-wrap {
          position: relative;
          z-index: 10;
        }

        .hero-main-image {
          width: 100%;
          height: auto;
          border-radius: 40px;
          box-shadow: 0 40px 100px -20px rgba(0,0,0,0.15);
          transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .hero-main-image:hover {
          transform: scale(1.02) rotate(-1deg);
        }

        /* Floating elements */
        .floating-card {
          position: absolute;
          background: white;
          padding: 20px;
          border-radius: 20px;
          box-shadow: 0 20px 50px rgba(0,0,0,0.1);
          z-index: 20;
          animation: float 6s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }

        .float-1 { bottom: 40px; left: -20px; }
        .float-2 { top: 40px; right: -20px; animation-delay: 2s; }

        .kanji-stamp {
          position: absolute;
          top: -20px;
          left: -20px;
          z-index: 30;
          width: 64px;
          height: 64px;
          background: #D0021B;
          color: white;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Noto Sans JP', sans-serif;
          font-weight: 900;
          font-size: 20px;
          line-height: 1;
          box-shadow: 0 10px 25px rgba(208, 2, 27, 0.3);
        }

        /* ── WHY SECTION ── */
        .why-section {
          position: relative;
          padding: 120px 0;
          background: white;
          overflow: hidden;
        }

        /* Modern background blob */
        .why-section::after {
          content: '';
          position: absolute;
          bottom: -200px;
          right: -200px;
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(0, 163, 224, 0.03) 0%, transparent 70%);
          border-radius: 50%;
          z-index: 1;
        }

        .why-label {
          display: inline-block;
          background: rgba(0, 163, 224, 0.1);
          color: #003B73;
          padding: 10px 24px;
          border-radius: 100px;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-bottom: 24px;
          border: 1px solid rgba(0, 163, 224, 0.1);
        }

        .why-title {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: clamp(32px, 5vw, 48px);
          font-weight: 800;
          color: #0F172A;
          letter-spacing: -0.02em;
          line-height: 1.2;
          margin-bottom: 24px;
        }

        .why-title .blue { 
          color: #00A3E0;
          background: linear-gradient(to right, #003B73, #00A3E0);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .why-desc {
          font-size: 18px;
          color: #64748B;
          max-width: 800px;
          margin: 0 auto;
          line-height: 1.8;
        }

        /* Cards grid */
        .cards-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 32px;
          padding: 0 40px;
          margin-top: 80px;
          max-width: 1400px;
          margin-left: auto;
          margin-right: auto;
          position: relative;
          z-index: 10;
        }

        @media (min-width: 1024px) {
          .cards-grid { grid-template-columns: repeat(3, 1fr); }
        }

        .feature-card {
          position: relative;
          background: white;
          border-radius: 40px;
          padding: 60px 40px;
          border: 1px solid #F1F5F9;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          flex-direction: column;
          box-shadow: 0 10px 30px rgba(0,0,0,0.02);
        }

        .feature-card:hover {
          transform: translateY(-15px);
          box-shadow: 0 50px 80px -20px rgba(0,0,0,0.08);
          border-color: rgba(0, 163, 224, 0.1);
        }

        .card-num {
          position: absolute;
          top: 40px;
          right: 40px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 80px;
          font-weight: 900;
          color: rgba(0, 163, 224, 0.05);
          line-height: 1;
          pointer-events: none;
        }

        .card-icon-wrap {
          width: 80px;
          height: 80px;
          border-radius: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 40px;
          background: #F0F9FF;
          color: #00A3E0;
          transition: all 0.4s;
          box-shadow: inset 0 0 0 1px rgba(0, 163, 224, 0.1);
        }

        .feature-card:hover .card-icon-wrap {
          background: #003B73;
          color: white;
          transform: scale(1.1) rotate(5deg);
          box-shadow: 0 20px 40px rgba(0, 59, 115, 0.2);
        }

        .card-title {
          font-weight: 800;
          font-size: 24px;
          color: #0F172A;
          margin-bottom: 20px;
          line-height: 1.4;
        }

        .card-desc {
          font-size: 16px;
          color: #64748B;
          line-height: 1.7;
          margin-bottom: 40px;
          flex-grow: 1;
        }

        .card-link {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-weight: 700;
          font-size: 15px;
          color: #003B73;
          text-decoration: none;
          transition: gap 0.3s;
        }

        .feature-card:hover .card-link {
          color: #00A3E0;
          gap: 15px;
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
          background: #003B73;
          padding: 24px 0;
          position: relative;
          z-index: 20;
          box-shadow: 0 10px 30px rgba(0, 59, 115, 0.2);
        }

        .ticker-inner {
          display: flex;
          white-space: nowrap;
          animation: ticker 30s linear infinite;
        }

        .ticker-item {
          display: inline-flex;
          align-items: center;
          gap: 16px;
          padding: 0 40px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 15px;
          font-weight: 700;
          letter-spacing: 0.02em;
          color: white;
          text-transform: uppercase;
        }

        .ticker-dot {
          width: 6px;
          height: 6px;
          background: #00A3E0;
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
          <div className="hero-shape-1" />
          <div className="hero-shape-2" />

          <div className="hero-container">
            {/* Left Column: Content */}
            <div className="hero-content">
              <div className="hero-badge">
                <Star size={14} fill="currentColor" />
                Program Magang Jepang Terpercaya
              </div>
              
              <h1 className="hero-title">
                Pintu Gerbang Karir <br />
                Profesional di <span className="accent">Jepang</span>
              </h1>
              
              <p className="hero-subtitle">
                Belajar bahasa Jepang dari nol hingga mahir dan ikuti program pelatihan kerja resmi bersama SKYBRIDGE. Kami membantu Anda meraih masa depan cerah di Negeri Sakura.
              </p>
              
              <div className="hero-actions">
                <Link to="/register" className="hero-cta">
                  Mulai Pendaftaran <ArrowRight size={20} />
                </Link>
                <Link to="/pelatihan-kerja-ke-jepang" className="hero-secondary-cta">
                  Lihat Program
                </Link>
              </div>

              {/* Stats Integrated into Hero */}
              <div className="hero-stats">
                {[
                  { num: '500+', label: 'Alumni' },
                  { num: '98%', label: 'Lulus' },
                  { num: '50+', label: 'Mitra' },
                ].map((s, i) => (
                  <div className="hero-stat-item" key={i}>
                    <span className="hero-stat-num">{s.num}</span>
                    <span className="hero-stat-label">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Image */}
            <div className="hero-image-wrap">
              <div className="kanji-stamp">
                努<br/>力
              </div>
              
              <img 
                src={HeroImg} 
                alt="Program Pelatihan Kerja dan Magang ke Jepang di SKYBRIDGE" 
                className="hero-main-image" 
                loading="eager"
              />

              {/* Floating elements for extra flair */}
              <div className="floating-card float-1">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ background: '#E0F2FE', padding: '10px', borderRadius: '12px' }}>
                    <CheckCircle size={24} color="#00A3E0" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '14px' }}>Resmi & Terpercaya</div>
                    <div style={{ fontSize: '12px', color: '#64748B' }}>Izin LPK Resmi</div>
                  </div>
                </div>
              </div>

              <div className="floating-card float-2">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ background: '#FEF3C7', padding: '10px', borderRadius: '12px' }}>
                    <Users size={24} color="#D97706" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '14px' }}>Pembimbing Ahli</div>
                    <div style={{ fontSize: '12px', color: '#64748B' }}>Native Speaker</div>
                  </div>
                </div>
              </div>
            </div>
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
                title: 'Kursus Bahasa Jepang',
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
                  <div className="card-link">
                    Pelajari Selengkapnya <ArrowRight size={18} />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* ═══════════ TRUST SIGNALS ═══════════ */}
        <section style={{ padding: '120px 0', background: '#F8FAFC', position: 'relative' }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 40px' }}>
            <div style={{ textAlign: 'center', marginBottom: '80px' }}>
              <span className="why-label">Testimoni Alumni</span>
              <h2 className="why-title">Kisah Sukses Bersama <span className="blue">SKYBRIDGE</span></h2>
              <p className="why-desc">Ribuan alumni telah berhasil membangun karir impian mereka di Negeri Sakura.</p>
            </div>
            
            <div className="cards-grid" style={{ marginTop: '0' }}>
              {[
                { name: 'Budi Santoso', job: 'Engineering - Tokyo', text: 'Berkat SKYBRIDGE, saya bisa bekerja di perusahaan konstruksi ternama di Tokyo. Pelatihannya sangat intensif.' },
                { name: 'Siti Aminah', job: 'Kaigo - Osaka', text: 'Sensei di SKYBRIDGE sangat sabar membimbing dari nol sampai saya lulus JLPT N4. Sekarang saya di Osaka.' },
                { name: 'Rian Hidayat', job: 'Agriculture - Hokkaido', text: 'Program magang resmi yang aman. Proses pemberangkatan transparan dan pendampingan di Jepang sangat membantu.' },
              ].map((t, i) => (
                <div key={i} className="feature-card" style={{ padding: '48px 40px' }}>
                  <div style={{ color: '#F5A623', display: 'flex', gap: '4px', marginBottom: '24px' }}>
                    {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                  </div>
                  <p style={{ fontStyle: 'italic', color: '#64748B', marginBottom: '32px', lineHeight: '1.8', fontSize: '16px' }}>"{t.text}"</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#E2E8F0', display: 'flex', alignItems: 'center', justifyCenter: 'center', fontWeight: 800, color: '#003B73' }}>
                      {t.name[0]}
                    </div>
                    <div>
                      <div style={{ fontWeight: '800', color: '#0F172A', fontSize: '16px' }}>{t.name}</div>
                      <div style={{ fontSize: '14px', color: '#94A3B8' }}>{t.job}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
