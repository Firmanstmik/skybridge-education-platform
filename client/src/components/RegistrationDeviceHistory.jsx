import { Link } from 'react-router-dom';
import { Clock, CheckCircle2, XCircle, RefreshCw, BookOpen } from 'lucide-react';
import { getPackageLabel } from '../constants/coursePackages';
import { getPaymentStatus, isStudentFullyApproved } from '../utils/studentAccess';
import { useWaGroupLink } from '../hooks/useWaGroupLink';
import WaGroupLinkBlock from './WaGroupLinkBlock';

const statusTone = (status = '') => {
  const s = String(status).toLowerCase();
  if (s === 'diterima') return { icon: CheckCircle2, color: '#059669', bg: '#ECFDF5' };
  if (s === 'ditolak') return { icon: XCircle, color: '#DC2626', bg: '#FEF2F2' };
  return { icon: Clock, color: '#D97706', bg: '#FFFBEB' };
};

const RegistrationDeviceHistory = ({
  entry,
  loading = false,
  onRefresh,
  onContinue,
  onNewRegistration,
}) => {
  if (!entry) return null;

  const StatusIcon = statusTone(entry.status).icon;
  const tone = statusTone(entry.status);
  const paymentStatus = getPaymentStatus(entry);
  const approved = isStudentFullyApproved(entry);
  const { waGroupLink } = useWaGroupLink();

  return (
    <div
      style={{
        marginBottom: 24,
        borderRadius: 22,
        border: '1px solid #BFDBFE',
        background: 'linear-gradient(180deg, #EFF6FF 0%, #FFFFFF 100%)',
        padding: '20px 18px',
        boxShadow: '0 16px 40px rgba(37,99,235,0.08)',
      }}
    >
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.18em', color: '#1D4ED8', textTransform: 'uppercase', margin: 0 }}>
            Riwayat Pendaftaran di Perangkat Ini
          </p>
          <h3 style={{ fontSize: 20, fontWeight: 900, color: '#0F172A', marginTop: 8, marginBottom: 0 }}>
            {entry.full_name || 'Pendaftar SKYBRIDGE'}
          </h3>
          <p style={{ fontSize: 12, color: '#64748B', marginTop: 6, marginBottom: 0 }}>
            Data ini tersimpan otomatis di browser/perangkat ini{entry.email ? ` untuk email ${entry.email}` : ''}.
          </p>
        </div>
        <button
          type="button"
          onClick={onRefresh}
          disabled={loading}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 14px',
            borderRadius: 999,
            border: '1px solid #CBD5E1',
            background: 'white',
            color: '#0F172A',
            fontWeight: 800,
            fontSize: 12,
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          {loading ? 'Memuat...' : 'Perbarui Status'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginTop: 16 }}>
        <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 14, padding: 12 }}>
          <p style={{ fontSize: 11, color: '#64748B', margin: 0 }}>No. Registrasi</p>
          <p style={{ fontFamily: 'monospace', fontWeight: 800, color: '#0F172A', marginTop: 6, marginBottom: 0 }}>{entry.registration_number}</p>
        </div>
        <div style={{ background: tone.bg, border: `1px solid ${tone.color}33`, borderRadius: 14, padding: 12 }}>
          <p style={{ fontSize: 11, color: '#64748B', margin: 0 }}>Status Pendaftaran</p>
          <p style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 800, color: tone.color, marginTop: 6, marginBottom: 0 }}>
            <StatusIcon size={14} /> {entry.status || 'Menunggu Verifikasi'}
          </p>
        </div>
        <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 14, padding: 12 }}>
          <p style={{ fontSize: 11, color: '#64748B', margin: 0 }}>Status Pembayaran</p>
          <p style={{ fontWeight: 800, color: paymentStatus === 'Lunas' ? '#059669' : '#D97706', marginTop: 6, marginBottom: 0 }}>{paymentStatus}</p>
        </div>
        <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 14, padding: 12 }}>
          <p style={{ fontSize: 11, color: '#64748B', margin: 0 }}>Paket Kursus</p>
          <p style={{ fontWeight: 700, color: '#0F172A', marginTop: 6, marginBottom: 0, fontSize: 12, lineHeight: 1.5 }}>
            {getPackageLabel(entry.course_package)}
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 16 }}>
        <button
          type="button"
          onClick={onContinue}
          style={{ padding: '11px 16px', borderRadius: 999, border: 'none', background: '#003B73', color: 'white', fontWeight: 800, fontSize: 12, cursor: 'pointer' }}
        >
          Lanjutkan Pendaftaran Saya
        </button>
        <Link
          to="/student/check-status"
          style={{ padding: '11px 16px', borderRadius: 999, border: '1px solid #CBD5E1', background: 'white', color: '#0F172A', fontWeight: 800, fontSize: 12, textDecoration: 'none' }}
        >
          Buka Cek Status
        </Link>
        {approved && (
          <>
            {waGroupLink ? (
              <WaGroupLinkBlock link={waGroupLink} compact />
            ) : null}
            <Link
              to="/student/kursus"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 16px', borderRadius: 999, background: '#111827', color: 'white', fontWeight: 800, fontSize: 12, textDecoration: 'none' }}
            >
              <BookOpen size={14} /> Masuk Halaman Kelas
            </Link>
          </>
        )}
        <button
          type="button"
          onClick={onNewRegistration}
          style={{ padding: '11px 16px', borderRadius: 999, border: '1px dashed #94A3B8', background: 'transparent', color: '#475569', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}
        >
          Buat Pendaftaran Baru
        </button>
      </div>
    </div>
  );
};

export default RegistrationDeviceHistory;
