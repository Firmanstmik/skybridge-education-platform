import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { IdCard, BookOpen, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import heroBg from '../assets/img/bg-internasional.webp';
import {
  getPaymentStatus,
  isStudentFullyApproved,
} from '../utils/studentAccess';
import { getPackageLabel } from '../constants/coursePackages';
import { syncHistoryFromStudent, saveLastRegistrationCredentials } from '../utils/registrationHistory';
import { useWaGroupLink } from '../hooks/useWaGroupLink';
import WaGroupLinkBlock from '../components/WaGroupLinkBlock';

const MotionDiv = motion.div;

const statusVisual = (status = '') => {
  const s = String(status || '').trim().toLowerCase();
  if (s === 'diterima') return { label: 'Diterima', icon: CheckCircle2, color: '#059669', bg: '#ECFDF5' };
  if (s === 'ditolak') return { label: 'Ditolak', icon: XCircle, color: '#DC2626', bg: '#FEF2F2' };
  return { label: status || 'Menunggu Verifikasi', icon: Clock, color: '#D97706', bg: '#FFFBEB' };
};

const CheckStatusPage = () => {
  const [regNumber, setRegNumber] = useState('');
  const [nik, setNik] = useState('');
  const [error, setError] = useState('');
  const [checkedStudent, setCheckedStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { waGroupLink } = useWaGroupLink();

  const refreshStudent = async (registration_number, nikValue) => {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/students/login`, {
      registration_number,
      nik: nikValue,
    });
    const student = response.data.student;
    localStorage.setItem('studentData', JSON.stringify(student));
    saveLastRegistrationCredentials({
      registration_number: student.registration_number,
      nik: student.nik,
    });
    syncHistoryFromStudent(student);
    setCheckedStudent(student);
    return student;
  };

  useEffect(() => {
    const storedData = localStorage.getItem('studentData');
    if (!storedData) return;
    try {
      const parsed = JSON.parse(storedData);
      if (parsed?.registration_number && parsed?.nik) {
        setRegNumber(parsed.registration_number);
        setNik(parsed.nik);
        refreshStudent(parsed.registration_number, parsed.nik).catch(() => {});
      }
    } catch {
      // ignore invalid local storage
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await refreshStudent(regNumber, nik);
    } catch (err) {
      setCheckedStudent(null);
      setError(err.response?.data?.message || 'Login gagal. Cek kembali data anda.');
    } finally {
      setLoading(false);
    }
  };

  const approved = isStudentFullyApproved(checkedStudent);
  const paymentStatus = getPaymentStatus(checkedStudent);
  const statusInfo = statusVisual(checkedStudent?.status);
  const StatusIcon = statusInfo.icon;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Noto+Sans+JP:wght@400;700;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        :root {
          --red: #D0021B; --red-dark: #A50015; --red-light: #FF1A35;
          --gold: #C8860A; --gold-light: #F5A623; --cream: #FDF8F0;
          --border: #E5E7EB; --white: #FFFFFF;
        }
        .reg-root {
          font-family: 'Plus Jakarta Sans', sans-serif;
          min-height: 100vh;
          background: var(--cream);
        }
        .reg-banner {
          background: linear-gradient(135deg, rgba(2,6,23,0.85) 0%, rgba(15,23,42,0.9) 60%, rgba(2,6,23,0.85) 100%), url(${heroBg}) center/cover no-repeat;
          padding: 28px 24px 80px; text-align: center; position: relative; overflow: hidden;
        }
        .banner-title { font-family: 'Bebas Neue', sans-serif; font-size: clamp(30px, 6vw, 48px); color: #fff; margin-top: 14px; }
        .banner-title .acc { color: var(--red-light); }
        .banner-sub { font-size: 13px; color: rgba(255,255,255,0.55); margin-top: 8px; }
        .reg-card {
          max-width: 900px; width: calc(100% - 32px); margin: -44px auto 48px;
          background: var(--white); border-radius: 24px;
          box-shadow: 0 24px 80px rgba(0,0,0,0.12); overflow: hidden;
        }
        .form-body { padding: 28px; }
        .input-field {
          width: 100%; height: 44px; border-radius: 14px; border: 1.5px solid var(--border);
          padding: 12px 14px; font-size: 14px; font-weight: 600; outline: none;
        }
        .btn-primary {
          width: 100%; padding: 14px 16px; border-radius: 999px;
          background: linear-gradient(135deg, var(--red), var(--red-dark));
          color: #fff; font-weight: 900; font-size: 14px; border: none; cursor: pointer;
        }
        .btn-secondary {
          display: inline-flex; align-items: center; justify-content: center; gap: 8px;
          padding: 12px 18px; border-radius: 999px; font-weight: 800; font-size: 13px;
          border: none; cursor: pointer; text-decoration: none;
        }
        .result-box {
          margin-top: 24px; border-radius: 20px; border: 1px solid #E5E7EB;
          background: linear-gradient(180deg, #fff, #F9FAFB); padding: 20px;
        }
        .err-box {
          border-radius: 16px; border: 1px solid rgba(254,202,202,0.9);
          background: #FEF2F2; color: #991B1B; padding: 12px 14px; font-size: 12px;
        }
      `}</style>
      <Navbar />
      <div className="reg-root">
        <MotionDiv initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="reg-banner">
          <span style={{ fontSize: 11, letterSpacing: '0.3em', color: 'rgba(245,166,35,0.8)' }}>CEK STATUS / 確認</span>
          <h1 className="banner-title">CEK <span className="acc">STATUS</span> PENDAFTARAN</h1>
          <p className="banner-sub">Masukkan Nomor Registrasi dan NIK untuk melihat status dan akses kelas setelah pembayaran dikonfirmasi admin.</p>
        </MotionDiv>

        <MotionDiv initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="reg-card">
          <div className="form-body">
            <h2 className="text-xl font-black text-center text-slate-900">Masukkan Data Pendaftaran</h2>
            <p className="text-sm text-slate-500 text-center mt-2">Setelah admin mengonfirmasi pembayaran lunas, tombol Grup WA dan Halaman Kelas akan aktif di sini.</p>

            {error && <div className="err-box mt-4">⚠️ {error}</div>}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nomor Registrasi</label>
                <input type="text" value={regNumber} onChange={(e) => setRegNumber(e.target.value)} className="input-field" required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">NIK (Nomor KTP)</label>
                <div className="relative">
                  <input type="text" value={nik} onChange={(e) => setNik(e.target.value)} className="input-field" style={{ paddingLeft: 54 }} required />
                  <IdCard className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                </div>
              </div>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Memeriksa...' : 'Cek Status Sekarang'}
              </button>
            </form>

            {checkedStudent && (
              <div className="result-box">
                <div className="flex items-start gap-3">
                  <div style={{ background: statusInfo.bg, color: statusInfo.color, borderRadius: 12, padding: 10 }}>
                    <StatusIcon size={22} />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Hasil Pengecekan</p>
                    <h3 className="text-lg font-black text-slate-900 mt-1">{checkedStudent.full_name}</h3>
                    <p className="text-xs font-mono text-slate-500 mt-1">{checkedStudent.registration_number}</p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-3 mt-4 text-sm">
                  <div className="rounded-xl bg-white border border-slate-200 p-3">
                    <p className="text-xs text-slate-500">Status Pendaftaran</p>
                    <p className="font-bold text-slate-900 mt-1">{checkedStudent.status}</p>
                  </div>
                  <div className="rounded-xl bg-white border border-slate-200 p-3">
                    <p className="text-xs text-slate-500">Status Pembayaran</p>
                    <p className="font-bold text-slate-900 mt-1">{paymentStatus}</p>
                  </div>
                  <div className="rounded-xl bg-white border border-slate-200 p-3 sm:col-span-2">
                    <p className="text-xs text-slate-500">Paket Kursus</p>
                    <p className="font-bold text-slate-900 mt-1">{getPackageLabel(checkedStudent.course_package)}</p>
                  </div>
                </div>

                {approved ? (
                  <div className="mt-5 space-y-3">
                    <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-sm text-emerald-800">
                      Pembayaran sudah dikonfirmasi lunas oleh admin. Anda sudah bisa gabung Grup WA dan masuk ke halaman kelas.
                    </div>

                    {waGroupLink ? (
                      <WaGroupLinkBlock link={waGroupLink} />
                    ) : (
                      <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 text-sm text-amber-900">
                        Link grup WA belum diset oleh admin. Silakan hubungi admin SKYBRIDGE untuk mendapatkan link grup.
                      </div>
                    )}

                    <div className="flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() => navigate('/student/kursus')}
                        className="btn-secondary"
                        style={{ background: '#003B73', color: 'white' }}
                      >
                        <BookOpen size={16} /> Masuk Halaman Kelas
                      </button>
                      <button
                        type="button"
                        onClick={() => navigate('/student/dashboard')}
                        className="btn-secondary"
                        style={{ background: 'white', color: '#003B73', border: '1.5px solid #CBD5E1' }}
                      >
                        Lihat Dashboard
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-5 space-y-3">
                    <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 text-sm text-amber-900">
                      {checkedStudent.documents?.payment_proof_path
                        ? 'Bukti pembayaran sudah diupload. Menunggu konfirmasi admin. Setelah status pembayaran menjadi Lunas, tombol Grup WA dan Halaman Kelas akan muncul di halaman ini.'
                        : 'Silakan upload bukti pembayaran saat pendaftaran atau hubungi admin. Setelah pembayaran dikonfirmasi lunas, Anda bisa gabung Grup WA dan masuk halaman kelas dari halaman ini.'}
                    </div>
                    <button
                      type="button"
                      onClick={() => navigate('/student/dashboard')}
                      className="btn-secondary"
                      style={{ background: '#111827', color: 'white' }}
                    >
                      Buka Dashboard Siswa
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </MotionDiv>
      </div>
    </>
  );
};

export default CheckStatusPage;
