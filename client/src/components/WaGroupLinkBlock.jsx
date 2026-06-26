import { useState } from 'react';
import { MessageCircle, Copy, Check } from 'lucide-react';

const WaGroupLinkBlock = ({ link, compact = false }) => {
  const [copied, setCopied] = useState(false);
  const waGroupLink = String(link || '').trim();
  if (!waGroupLink) return null;

  const handleCopy = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(waGroupLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      return;
    }
  };

  if (compact) {
    return (
      <a
        href={waGroupLink}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          padding: '11px 16px',
          borderRadius: 999,
          background: '#25D366',
          color: 'white',
          fontWeight: 800,
          fontSize: 12,
          textDecoration: 'none',
        }}
      >
        <MessageCircle size={14} /> Gabung Grup WA
      </a>
    );
  }

  return (
    <div
      style={{
        marginTop: 12,
        padding: 16,
        borderRadius: 16,
        border: '1px solid #86EFAC',
        background: 'linear-gradient(180deg, #ECFDF5 0%, #FFFFFF 100%)',
      }}
    >
      <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.14em', color: '#047857', textTransform: 'uppercase', margin: 0 }}>
        Link Grup WhatsApp Peserta
      </p>
      <p style={{ fontSize: 12, color: '#065F46', marginTop: 8, marginBottom: 0, lineHeight: 1.6 }}>
        Klik link di bawah atau salin untuk bergabung ke grup WA kelas Anda.
      </p>

      <div
        style={{
          marginTop: 12,
          display: 'flex',
          flexWrap: 'wrap',
          gap: 10,
          alignItems: 'center',
        }}
      >
        <a
          href={waGroupLink}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            flex: '1 1 240px',
            wordBreak: 'break-all',
            fontSize: 13,
            fontWeight: 700,
            color: '#047857',
            textDecoration: 'underline',
          }}
        >
          {waGroupLink}
        </a>
        <button
          type="button"
          onClick={handleCopy}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '10px 14px',
            borderRadius: 999,
            border: '1px solid #A7F3D0',
            background: 'white',
            color: '#065F46',
            fontWeight: 700,
            fontSize: 12,
            cursor: 'pointer',
          }}
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? 'Tersalin' : 'Salin Link'}
        </button>
      </div>

      <a
        href={waGroupLink}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          marginTop: 14,
          padding: '12px 18px',
          borderRadius: 999,
          background: '#25D366',
          color: 'white',
          fontWeight: 800,
          fontSize: 13,
          textDecoration: 'none',
          boxShadow: '0 6px 18px rgba(37,211,102,0.35)',
        }}
      >
        <MessageCircle size={16} /> Gabung Grup WA
      </a>
    </div>
  );
};

export default WaGroupLinkBlock;
