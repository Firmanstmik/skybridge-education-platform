import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { ArrowRight, CheckCircle, BookOpen, Users, Briefcase, Star, Zap, MapPin, Phone, Mail } from 'lucide-react';
import HeroImage from '../assets/img/hero-lpk-doryouku.png';
import HeroBg from '../assets/img/heroskybridge.webp';

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
          background: linear-gradient(135deg, #1A0005 0%, #2D0008 40%, #1A0A00 100%);
          overflow: hidden;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        .hero-lp-bg {
          position: absolute;
          inset: 0;
          background-image: url(${HeroBg});
          background-size: cover;
          background-position: center;
          opacity: 0.12;
          mix-blend-mode: overlay;
          pointer-events: none;
          z-index: 1;
        }

        /* Rising sun background */
        .hero-sun {
          position: absolute;
          bottom: -120px;
          left: 50%;
          transform: translateX(-50%);
          width: 700px;
          height: 700px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(248,160,0,0.18) 0%, rgba(208,2,27,0.10) 40%, transparent 70%);
          pointer-events: none;
          animation: sunPulse 4s ease-in-out infinite;
        }

        @keyframes sunPulse {
          0%, 100% { transform: translateX(-50%) scale(1); opacity: 1; }
          50% { transform: translateX(-50%) scale(1.06); opacity: 0.85; }
        }

        /* Batik diagonal pattern overlay */
        .hero-pattern {
          position: absolute;
          inset: 0;
          background-image:
            repeating-linear-gradient(
              45deg,
              rgba(200, 134, 10, 0.04) 0px,
              rgba(200, 134, 10, 0.04) 1px,
              transparent 1px,
              transparent 40px
            ),
            repeating-linear-gradient(
              -45deg,
              rgba(208, 2, 27, 0.04) 0px,
              rgba(208, 2, 27, 0.04) 1px,
              transparent 1px,
              transparent 40px
            );
          pointer-events: none;
        }

        /* Vertical blue stripe – Skybridge motif */
        .hero-stripe-blue {
          position: absolute;
          left: 0;
          top: 0;
          width: 8px;
          height: 100%;
          background: linear-gradient(to bottom, #003B73, #002D58);
          z-index: 2;
        }
        .hero-stripe-cyan {
          position: absolute;
          left: 8px;
          top: 0;
          width: 4px;
          height: 100%;
          background: linear-gradient(to bottom, #00A3E0, #0077B6);
          z-index: 2;
        }

        .hero-img-col {
          position: relative;
          z-index: 5;
          width: 100%;
        }

        .hero-img-col img {
          width: 100%;
          height: auto;
          object-fit: contain;
          display: block;
          filter: drop-shadow(0 20px 60px rgba(0,0,0,0.5));
        }

        /* Floating kanji stamp */
        .kanji-stamp {
          position: absolute;
          top: 24px;
          right: 24px;
          z-index: 20;
          width: 80px;
          height: 80px;
          border: 3px solid #003B73;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Noto Sans JP', sans-serif;
          font-weight: 900;
          font-size: 28px;
          color: #003B73;
          background: rgba(255,255,255,0.06);
          backdrop-filter: blur(4px);
          line-height: 1;
          text-align: center;
          animation: stampFloat 3s ease-in-out infinite;
          box-shadow: inset 0 0 0 1px rgba(0,59,115,0.3), 0 8px 32px rgba(0,59,115,0.2);
        }

        @keyframes stampFloat {
          0%, 100% { transform: translateY(0) rotate(-4deg); }
          50% { transform: translateY(-8px) rotate(-4deg); }
        }

        @media (max-width: 640px) {
          .kanji-stamp { display: none; }
        }

        /* Hero text card */
        .hero-text-card {
          position: relative;
          z-index: 10;
          padding: 32px 24px;
          background: rgba(255,255,255,0.06);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 24px;
          margin: 16px;
          box-shadow: 0 20px 50px rgba(0,0,0,0.3);
          border-left: 4px solid var(--red);
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: linear-gradient(90deg, var(--gold), var(--gold-light));
          color: var(--dark);
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 800;
          font-size: 11px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          padding: 6px 16px;
          border-radius: 100px;
          margin-bottom: 20px;
        }

        .hero-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(48px, 10vw, 80px);
          color: var(--white);
          line-height: 0.95;
          letter-spacing: 0.02em;
          margin-bottom: 8px;
        }

        .hero-title .accent {
          color: #00A3E0;
          text-shadow: 0 0 20px rgba(0,163,224,0.3);
        }

        .hero-subtitle {
          font-size: 16px;
          color: rgba(255,255,255,0.7);
          margin-bottom: 32px;
          line-height: 1.6;
        }

        .hero-cta {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          background: #003B73;
          color: white;
          padding: 16px 36px;
          border-radius: 100px;
          font-weight: 800;
          text-decoration: none;
          transition: 0.3s;
          box-shadow: 0 10px 30px rgba(0,59,115,0.4);
        }

        .hero-cta:hover {
          background: #00A3E0;
          transform: translateY(-3px);
          box-shadow: 0 15px 40px rgba(0,163,224,0.5);
        }

        .hero-cta svg {
          animation: arrowBounce 1.4s ease-in-out infinite;
        }

        @keyframes arrowBounce {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(5px); }
        }

        /* Stats row */
        .stats-row {
          position: relative;
          z-index: 10;
          display: flex;
          justify-content: center;
          gap: 0;
          margin: 0 16px 0;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          overflow: hidden;
          margin-bottom: 32px;
        }

        .stat-item {
          flex: 1;
          padding: 18px 8px;
          text-align: center;
          border-right: 1px solid rgba(255,255,255,0.08);
        }
        .stat-item:last-child { border-right: none; }

        .stat-num {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 28px;
          color: var(--gold-light);
          line-height: 1;
          display: block;
        }

        .stat-label {
          font-size: 10px;
          color: rgba(255,255,255,0.45);
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          margin-top: 4px;
        }

        /* ── WHY SECTION ── */
        .why-section {
          position: relative;
          padding: 80px 0;
          background: var(--cream);
          overflow: hidden;
        }

        /* Batik corner ornament */
        .batik-corner {
          position: absolute;
          width: 200px;
          height: 200px;
          opacity: 0.07;
          pointer-events: none;
        }
        .batik-corner.tl { top: 0; left: 0; }
        .batik-corner.br { bottom: 0; right: 0; transform: rotate(180deg); }

        .why-label {
          display: inline-block;
          font-family: 'Noto Sans JP', sans-serif;
          font-size: 12px;
          color: #003B73;
          font-weight: 700;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          margin-bottom: 12px;
        }

        .why-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(36px, 7vw, 56px);
          color: var(--dark);
          letter-spacing: 0.02em;
          line-height: 1;
          margin-bottom: 12px;
        }

        .why-title .blue { color: #003B73; }

        .why-divider {
          width: 64px;
          height: 4px;
          background: linear-gradient(90deg, #003B73, #00A3E0);
          border-radius: 2px;
          margin: 16px auto 16px;
        }

        .why-desc {
          font-size: 15px;
          color: var(--gray);
          max-width: 520px;
          margin: 0 auto;
          line-height: 1.75;
        }

        /* Cards grid */
        .cards-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
          padding: 0 20px;
          margin-top: 48px;
        }

        @media (min-width: 768px) {
          .cards-grid { grid-template-columns: repeat(3, 1fr); padding: 0 40px; }
        }

        .feature-card {
          position: relative;
          background: var(--white);
          border-radius: 20px;
          padding: 32px 24px;
          border: 1px solid rgba(0,0,0,0.06);
          overflow: hidden;
          transition: transform 0.3s, box-shadow 0.3s;
          cursor: default;
        }

        .feature-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: var(--card-accent);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.4s ease;
        }

        .feature-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 24px 64px rgba(0,0,0,0.12);
        }

        .feature-card:hover::before { transform: scaleX(1); }

        /* Card number watermark */
        .card-num {
          position: absolute;
          top: 16px;
          right: 20px;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 80px;
          color: rgba(0,0,0,0.04);
          line-height: 1;
          pointer-events: none;
        }

        .card-icon-wrap {
          width: 72px;
          height: 72px;
          border-radius: 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
          background: var(--card-icon-bg);
          box-shadow: var(--card-icon-shadow);
          position: relative;
          overflow: hidden;
        }

        .card-icon-wrap::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.25), transparent);
        }

        .card-tag {
          font-family: 'Noto Sans JP', sans-serif;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.05em;
          margin-top: 3px;
          color: var(--card-tag-color);
          position: relative;
          z-index: 1;
        }

        .card-icon-wrap svg {
          position: relative;
          z-index: 1;
        }

        .card-title {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 800;
          font-size: 18px;
          color: var(--dark);
          margin-bottom: 10px;
          line-height: 1.3;
        }

        .card-desc {
          font-size: 14px;
          color: var(--gray);
          line-height: 1.7;
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

        /* ── SCROLLING TICKER ── */
        .ticker-wrap {
          overflow: hidden;
          background: #003B73;
          padding: 14px 0;
          position: relative;
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
      `}</style>

      <div className="lpk-body">
        <Navbar />

        {/* ═══════════ HERO ═══════════ */}
        <div className="hero-wrap">
          <div className="hero-lp-bg" />
          <div className="hero-pattern" />
          <div className="hero-sun" />
          <div className="hero-stripe-blue" />
          <div className="hero-stripe-cyan" />

          {/* Kanji stamp */}
          <div className="kanji-stamp">
            努<br/>力
          </div>

          {/* Hero Image */}
          <div className="hero-img-col">
            <img src={HeroImage} alt="Program Pelatihan Kerja dan Magang ke Jepang di SKYBRIDGE" />
          </div>

          {/* Stats Row */}
          <div className="stats-row" style={{ margin: '0 16px 16px' }}>
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

          {/* Hero Text Card */}
          <div className="hero-text-card">
            <div className="hero-badge">
              <Star size={10} fill="currentColor" />
              Program Magang Jepang Terpercaya
            </div>
            <h1 className="hero-title">
              Kursus Bahasa Jepang & Program Kerja ke Jepang – <span className="accent">SKYBRIDGE</span>
            </h1>
            <p className="hero-subtitle">
              Belajar bahasa Jepang dari nol, ikuti pelatihan kerja resmi, dan program magang ke Jepang bersama SKYBRIDGE Nusantara International School. Institusi profesional dan terpercaya di Indonesia.
            </p>
            <Link to="/register" className="hero-cta">
              Daftar Sekarang <ArrowRight size={18} />
            </Link>
          </div>
        </div>

        {/* ═══════════ TICKER ═══════════ */}
        <div className="ticker-wrap">
          <div className="ticker-inner">
            {[
              '🎌 Berangkat ke Jepang', '💴 Gaji Kompetitif', '🏆 Lulus JLPT N4',
              '🤝 Mitra Kumiai Terpercaya', '📚 Pelatihan Intensif', '✈️ Mimpi Jadi Nyata',
              '🎌 Berangkat ke Jepang', '💴 Gaji Kompetitif', '🏆 Lulus JLPT N4',
              '🤝 Mitra Kumiai Terpercaya', '📚 Pelatihan Intensif', '✈️ Mimpi Jadi Nyata',
            ].map((text, i) => (
              <span className="ticker-item" key={i}>
                {text}
                <span className="ticker-dot" />
              </span>
            ))}
          </div>
        </div>

        {/* ═══════════ WHY SECTION ═══════════ */}
        <section className="why-section">
          {/* Batik SVG corners */}
          <svg className="batik-corner tl" viewBox="0 0 200 200" fill="none">
            <circle cx="0" cy="0" r="100" fill="none" stroke="#D0021B" strokeWidth="2"/>
            <circle cx="0" cy="0" r="70" fill="none" stroke="#C8860A" strokeWidth="2"/>
            <circle cx="0" cy="0" r="40" fill="none" stroke="#D0021B" strokeWidth="2"/>
            <line x1="0" y1="0" x2="200" y2="0" stroke="#D0021B" strokeWidth="1"/>
            <line x1="0" y1="0" x2="0" y2="200" stroke="#D0021B" strokeWidth="1"/>
          </svg>
          <svg className="batik-corner br" viewBox="0 0 200 200" fill="none">
            <circle cx="0" cy="0" r="100" fill="none" stroke="#D0021B" strokeWidth="2"/>
            <circle cx="0" cy="0" r="70" fill="none" stroke="#C8860A" strokeWidth="2"/>
            <circle cx="0" cy="0" r="40" fill="none" stroke="#D0021B" strokeWidth="2"/>
          </svg>

          <div style={{ textAlign: 'center', position: 'relative', zIndex: 10 }}>
            <span className="why-label">なぜ選ぶの？ · Keunggulan Kami</span>
            <h2 className="why-title">
              MENGAPA MEMILIH<br />
              <span className="blue">SKYBRIDGE NUSANTARA INTERNATIONAL SCHOOL?</span>
            </h2>
            <div className="why-divider" />
            <p className="why-desc">
              SKYBRIDGE Nusantara International School adalah lembaga pendidikan dan pelatihan kerja internasional yang menjadi pintu gerbang utama masyarakat Indonesia menuju Jepang. Kami menyediakan program kursus bahasa Jepang online, pelatihan kerja resmi, dan magang ke Jepang yang terpercaya.
            </p>
          </div>

          <div className="cards-grid">
            {[
              {
                theme: 'card-blue',
                icon: BookOpen,
                tag: '日本の学習',
                num: '01',
                title: 'Kursus Bahasa Jepang Online',
                desc: 'Belajar bahasa Jepang dari nol hingga mahir dengan kurikulum standar internasional.',
                link: '/kursus-bahasa-jepang-online',
                linkColor: '#003B73'
              },
              {
                theme: 'card-gold',
                icon: Users,
                tag: '日本の先生',
                num: '02',
                title: 'Pelatihan Kerja ke Jepang',
                desc: 'Program persiapan kerja resmi dengan jaminan penempatan di berbagai industri di Jepang.',
                link: '/pelatihan-kerja-ke-jepang',
                linkColor: 'var(--gold)'
              },
              {
                theme: 'card-teal',
                icon: Briefcase,
                tag: '就職サポート',
                num: '03',
                title: 'Program Magang ke Jepang',
                desc: 'Kesempatan magang resmi (Ginou Jisshu) di perusahaan-perusahaan ternama di Jepang.',
                link: '/magang-ke-jepang',
                linkColor: '#14B8A6'
              },
            ].map((card, idx) => {
              const Icon = card.icon;
              return (
                <Link to={card.link} key={idx} className={`feature-card ${card.theme}`} style={{ textDecoration: 'none' }}>
                  <span className="card-num">{card.num}</span>
                  <div className="card-icon-wrap">
                    <Icon size={28} />
                    <span className="card-tag">{card.tag}</span>
                  </div>
                  <h3 className="card-title">{card.title}</h3>
                  <p className="card-desc">{card.desc}</p>
                  <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '8px', color: card.linkColor, fontWeight: 'bold', fontSize: '14px' }}>
                    Selengkapnya <ArrowRight size={16} />
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

        {/* ═══════════ FOOTER & LOCAL SEO ═══════════ */}
        <footer style={{ background: '#1A1A2E', color: 'white', padding: '80px 20px 40px' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '60px' }}>
            <div>
              <h3 style={{ fontSize: '20px', fontWeight: '900', marginBottom: '24px', color: '#00A3E0' }}>SKYBRIDGE NUSANTARA</h3>
              <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: '1.8', marginBottom: '24px' }}>
                Lembaga pendidikan dan pelatihan kerja internasional terpercaya di Indonesia. Pintu gerbang utama menuju karir sukses di Jepang.
              </p>
              <div style={{ display: 'flex', gap: '16px' }}>
                <a href="#" style={{ color: 'white', background: 'rgba(255,255,255,0.1)', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>IG</a>
                <a href="#" style={{ color: 'white', background: 'rgba(255,255,255,0.1)', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>FB</a>
                <a href="#" style={{ color: 'white', background: 'rgba(255,255,255,0.1)', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>YT</a>
              </div>
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '24px' }}>Program Kami</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <li><Link to="/kursus-bahasa-jepang-online" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>Kursus Bahasa Jepang</Link></li>
                <li><Link to="/pelatihan-kerja-ke-jepang" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>Pelatihan Kerja</Link></li>
                <li><Link to="/magang-ke-jepang" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>Program Magang</Link></li>
                <li><Link to="/belajar-bahasa-jepang-dari-nol" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>Belajar Dari Nol</Link></li>
              </ul>
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '24px' }}>Blog & Artikel</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <li><Link to="/blog/kerja-jepang-tanpa-pengalaman" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>Kerja Jepang Tanpa Pengalaman</Link></li>
                <li><Link to="/blog/biaya-kursus-bahasa-jepang" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>Berapa Biaya Kursus Jepang?</Link></li>
                <li><Link to="/blog/tips-lolos-magang-ke-jepang" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>Tips Lolos Magang Jepang</Link></li>
              </ul>
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '24px' }}>Hubungi Kami</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', color: 'rgba(255,255,255,0.6)', fontSize: '14px' }}>
                <div style={{ display: 'flex', gap: '12px' }}><MapPin size={18} /> Komplek Pertokoan Grand Lingkar No.7, Mataram, Indonesia</div>
                <div style={{ display: 'flex', gap: '12px' }}><Phone size={18} /> +81 70-8418-2215</div>
                <a href="mailto:info@skybridgenisantara.com" style={{ display: 'flex', gap: '12px', color: 'inherit', textDecoration: 'none' }}><Mail size={18} /> info@skybridgenisantara.com</a>
              </div>
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '24px' }}>Lokasi</h3>
              <div style={{ borderRadius: '16px', overflow: 'hidden', height: '150px', background: '#2D2D44' }}>
                {/* Placeholder for Google Maps integration */}
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>
                  Google Maps Integration
                </div>
              </div>
            </div>
          </div>
          <div style={{ marginTop: '60px', paddingTop: '30px', borderTop: '1px solid rgba(255,255,255,0.1)', textAlign: 'center', fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>
            &copy; {new Date().getFullYear()} SKYBRIDGE Nusantara International School. All Rights Reserved.
          </div>
        </footer>
      </div>
    </>
  );
};

export default LandingPage;
