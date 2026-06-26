import { useEffect, useState } from 'react';
import { History, LogIn } from 'lucide-react';
import { getLastRegistrationCredentials } from '../utils/registrationHistory';

const RegistrationRestorePanel = ({ loading = false, onRestore }) => {
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [nik, setNik] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const stored = getLastRegistrationCredentials();
    if (!stored) return;
    if (stored.registration_number) setRegistrationNumber(stored.registration_number);
    if (stored.nik) setNik(stored.nik);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const reg = registrationNumber.trim();
    const nikValue = nik.trim();
    if (!reg || !nikValue) {
      setError('Nomor registrasi dan NIK wajib diisi.');
      return;
    }
    if (nikValue.length !== 16) {
      setError('NIK harus 16 digit sesuai KTP.');
      return;
    }
    try {
      await onRestore(reg, nikValue);
    } catch (err) {
      setError(err?.response?.data?.message || 'Data tidak ditemukan. Periksa nomor registrasi dan NIK.');
    }
  };

  return (
    <div
      style={{
        marginBottom: 24,
        borderRadius: 22,
        border: '1px solid #FDE68A',
        background: 'linear-gradient(180deg, #FFFBEB 0%, #FFFFFF 100%)',
        padding: '20px 18px',
        boxShadow: '0 16px 40px rgba(217,119,6,0.08)',
      }}
    >
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: 14,
            background: '#FEF3C7',
            color: '#B45309',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <History size={20} />
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.16em', color: '#B45309', textTransform: 'uppercase', margin: 0 }}>
            Sudah Pernah Daftar?
          </p>
          <h3 style={{ fontSize: 18, fontWeight: 900, color: '#0F172A', marginTop: 8, marginBottom: 0 }}>
            Pulihkan riwayat pendaftaran Anda
          </h3>
          <p style={{ fontSize: 12, color: '#64748B', marginTop: 8, marginBottom: 0, lineHeight: 1.6 }}>
            Jika Anda sudah mendaftar sebelumnya di perangkat ini, masukkan nomor registrasi dan NIK untuk melanjutkan proses pembayaran atau memantau status.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ marginTop: 16, display: 'grid', gap: 12 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 6 }}>
              Nomor Registrasi
            </label>
            <input
              value={registrationNumber}
              onChange={(e) => setRegistrationNumber(e.target.value)}
              placeholder="Contoh: SNIS-2026-8888-0003"
              className="input-field"
              style={{ width: '100%' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 6 }}>
              NIK (16 digit)
            </label>
            <input
              value={nik}
              onChange={(e) => setNik(e.target.value.replace(/\D/g, '').slice(0, 16))}
              placeholder="Masukkan NIK sesuai KTP"
              maxLength={16}
              className="input-field"
              style={{ width: '100%' }}
            />
          </div>
        </div>

        {error && (
          <p style={{ fontSize: 12, color: '#DC2626', fontWeight: 600, margin: 0 }}>{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            width: 'fit-content',
            padding: '12px 18px',
            borderRadius: 999,
            border: 'none',
            background: '#003B73',
            color: 'white',
            fontWeight: 800,
            fontSize: 12,
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
          }}
        >
          <LogIn size={14} />
          {loading ? 'Memuat riwayat...' : 'Muat Riwayat Pendaftaran'}
        </button>
      </form>
    </div>
  );
};

export default RegistrationRestorePanel;
