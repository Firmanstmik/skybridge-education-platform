import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useLocation } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';

const WhatsAppButton = () => {
  const [showTooltip, setShowTooltip] = useState(false);
  const location = useLocation();
  const waNumber = "817084182215";
  const defaultMessage = "Halo Admin SKYBRIDGE Nusantara, saya ingin konsultasi mengenai program ke Jepang.";
  const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(defaultMessage)}`;

  useEffect(() => {
    // Show tooltip after 3 seconds, then hide it after 15 seconds
    const timer = setTimeout(() => setShowTooltip(true), 3000);
    const hideTimer = setTimeout(() => setShowTooltip(false), 15000);
    return () => {
      clearTimeout(timer);
      clearTimeout(hideTimer);
    };
  }, []);

  // Hide button on admin, staff, and kepala LPK pages
  const hidePaths = ['/admin', '/staff', '/kepalalpk'];
  const shouldHide = hidePaths.some(path => location.pathname.startsWith(path));

  if (shouldHide) return null;

  return ReactDOM.createPortal(
    <div 
      style={{ 
        position: 'fixed',
        bottom: '32px',
        right: '32px',
        zIndex: 2147483647,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'end',
        pointerEvents: 'none',
        fontFamily: "'Plus Jakarta Sans', sans-serif"
      }}
    >
      <style>{`
        @keyframes wa-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .wa-animate-bounce {
          animation: wa-bounce 2s infinite ease-in-out;
        }
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700;900&display=swap');
        .wa-japanese {
          font-family: 'Noto Sans JP', sans-serif;
        }
      `}</style>

      {/* Tooltip */}
      <div 
        style={{
          marginBottom: '16px',
          backgroundColor: 'white',
          color: '#0F172A',
          padding: '12px 20px',
          borderRadius: '16px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
          border: '1px solid #F1F5F9',
          transition: 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: showTooltip ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.9)',
          opacity: showTooltip ? 1 : 0,
          pointerEvents: showTooltip ? 'auto' : 'none',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '10px', fontWeight: 900, color: '#D0021B', letterSpacing: '0.1em', marginBottom: '4px' }}>
          <span style={{ position: 'relative', display: 'flex', height: '8px', width: '8px' }}>
            <span style={{ animation: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite', position: 'absolute', display: 'inline-flex', height: '100%', width: '100%', borderRadius: '9999px', backgroundColor: '#4ADE80', opacity: 0.75 }}></span>
            <span style={{ position: 'relative', display: 'inline-flex', borderRadius: '9999px', height: '8px', width: '8px', backgroundColor: '#22C55E' }}></span>
          </span>
          ONLINE NOW
        </div>
        <div style={{ fontSize: '14px', fontWeight: 800, lineHeight: 1.2 }}>
          Konsultasi Gratis <br/>
          <span style={{ color: '#D0021B' }} className="wa-japanese">無料相談</span>
        </div>
        {/* Arrow */}
        <div style={{ position: 'absolute', bottom: '-6px', right: '24px', width: '12px', height: '12px', backgroundColor: 'white', borderRight: '1px solid #F1F5F9', borderBottom: '1px solid #F1F5F9', transform: 'rotate(45deg)' }}></div>
      </div>

      {/* Button */}
      <div className="wa-animate-bounce" style={{ pointerEvents: 'auto' }}>
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => setShowTooltip(true)}
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '64px',
            height: '64px',
            backgroundColor: '#25D366',
            color: 'white',
            borderRadius: '9999px',
            boxShadow: '0 10px 30px rgba(37,211,102,0.4)',
            transition: 'all 0.3s ease',
            textDecoration: 'none'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.boxShadow = '0 15px 40px rgba(37,211,102,0.6)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 10px 30px rgba(37,211,102,0.4)';
          }}
        >
          {/* Pulse Effect */}
          <span style={{ position: 'absolute', inset: 0, borderRadius: '9999px', backgroundColor: '#25D366', opacity: 0.4, animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite' }}></span>
          
          <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor" style={{ position: 'relative', zIndex: 10 }}>
            <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766 0-3.187-2.59-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.941-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217s.231.001.332.005c.109.004.253-.041.397.301.144.344.491 1.199.534 1.285.043.087.072.188.014.303-.058.116-.087.188-.173.289l-.26.303c-.087.101-.177.211-.077.382.1.171.445.733.954 1.212.655.615 1.207.807 1.38.896.173.09.275.076.376-.041.101-.116.434-.506.549-.679.116-.173.231-.144.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824z"/>
          </svg>
        </a>
      </div>
    </div>,
    document.body
  );
};

export default WhatsAppButton;
