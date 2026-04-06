import { useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import { useParams, Link, useLocation } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import { 
    Download, 
    User, 
    MapPin, 
    Calendar, 
    Mail, 
    Phone, 
    FileText, 
    CheckCircle2, 
    XCircle, 
    Clock, 
    Save, 
    ArrowLeft,
    Shield,
    Edit3,
    X,
    Eye
} from 'lucide-react';
import { useAlert } from '../context/AlertContext';
import { PDFViewer } from '@react-pdf/renderer';
import StudentPDF from '../components/StudentPDF';
import { toPng } from 'html-to-image';
import QRCode from 'qrcode';
import Logo from '../assets/img/SKYBRIDGE_LOGO.webp';

const AdminStudentDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const [student, setStudent] = useState(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [showPdf, setShowPdf] = useState(false);
  const [showFullData, setShowFullData] = useState(false);
  const [fullDataTab, setFullDataTab] = useState('personal');
  const { showAlert } = useAlert();
  const [isUpdating, setIsUpdating] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [isDownloadingCard, setIsDownloadingCard] = useState(false);
  const cardRef = useRef(null);

  // Determine back link based on current path
  const backLink = useMemo(() => {
    if (location.pathname.startsWith('/staff')) return '/staff/students';
    if (location.pathname.startsWith('/kepalalpk')) return '/kepalalpk/students';
    return '/admin/students';
  }, [location.pathname]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            setUserRole(payload.role);
        } catch (e) {
            console.error('Failed to parse token', e);
        }
    }
  }, []);

  const fetchStudent = async () => {
    const token = localStorage.getItem('token');
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/students/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStudent(data);
      setAdminNotes(data.admin_notes || '');
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchStudent();
  }, [id]);

  const updateStatus = async (status) => {
    setIsUpdating(true);
    const token = localStorage.getItem('token');
    try {
      await axios.put(`/api/students/${id}/status`, 
        { status, admin_notes: adminNotes },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchStudent();
      showAlert(`Status berhasil diperbarui menjadi ${status}`, 'success', 'Update Status');
    } catch (error) {
      console.error(error);
      showAlert('Gagal memperbarui status', 'error', 'Update Gagal');
    } finally {
      setIsUpdating(false);
    }
  };

  const saveNotes = async () => {
    setIsUpdating(true);
    const token = localStorage.getItem('token');
    try {
      await axios.put(`/api/students/${id}/status`, 
        { status: student.status, admin_notes: adminNotes },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showAlert('Catatan admin berhasil disimpan', 'success', 'Simpan Catatan');
    } catch (error) {
      console.error(error);
      showAlert('Gagal menyimpan catatan', 'error', 'Simpan Gagal');
    } finally {
        setIsUpdating(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    const reg = student?.registration_number;
    const name = student?.full_name;
    if (!reg) {
      setQrDataUrl('');
      return () => { cancelled = true; };
    }

    const payload = JSON.stringify({
      v: 1,
      type: 'student',
      id: student?.id ?? null,
      registration_number: reg,
      name: name || '',
    });

    QRCode.toDataURL(payload, {
      errorCorrectionLevel: 'H',
      margin: 2,
      width: 512,
      color: { dark: '#111827', light: '#ffffff' },
    }).then((url) => {
      if (!cancelled) setQrDataUrl(url);
    }).catch(() => {
      if (!cancelled) setQrDataUrl('');
    });

    return () => { cancelled = true; };
  }, [student?.registration_number, student?.full_name, student?.id]);

  const downloadCardPng = async () => {
    const isAccepted = String(student?.status || '').toLowerCase() === 'diterima';
    if (!isAccepted) return;
    if (!student?.registration_number) return;
    const target = cardRef.current || document.getElementById('reg-card-download-admin');
    if (!target) return;

    setIsDownloadingCard(true);
    try {
      const dataUrl = await toPng(target, { cacheBust: true, pixelRatio: 3, backgroundColor: '#ffffff' });
      const link = document.createElement('a');
      link.download = `KARTU-SKYBRIDGE-${student.registration_number}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showAlert('Kartu peserta berhasil diunduh!', 'success', 'Download Berhasil');
    } catch (error) {
      console.error('Download error:', error);
      showAlert('Gagal menyiapkan kartu.', 'error', 'Download Gagal');
    } finally {
      setIsDownloadingCard(false);
    }
  };

  if (!student) return (
    <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 dark:border-white"></div>
        </div>
    </AdminLayout>
  );

  const statusColors = {
    'Diterima': 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30',
    'Ditolak': 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/30',
    'Menunggu Verifikasi': 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/30',
    'Terverifikasi': 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/30'
  };

  const isAccepted = String(student?.status || '').toLowerCase() === 'diterima';
  const roleUpper = String(userRole || '').toUpperCase();
  const canEditFullData = roleUpper === 'SUPER_ADMIN' || roleUpper === 'SUPERADMIN' || roleUpper === 'KEPALA_LPK';
  const cardSerial = student?.registration_number || '-';
  const registrationDateText = student?.created_at
    ? new Date(student.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
    : '-';

  const docs = student?.documents && typeof student.documents === 'object' ? student.documents : student;
  const family = student?.family && typeof student.family === 'object' ? student.family : student;
  const educationRows = Array.isArray(student?.education) ? student.education : [];

  const toFileUrl = (p) => {
    const raw = String(p || '').trim();
    if (!raw) return '';
    const normalized = raw.replaceAll('\\', '/');
    if (normalized.startsWith('http://') || normalized.startsWith('https://')) return normalized;
    return `/${normalized.replace(/^\/+/, '')}`;
  };

  const formatDate = (value) => {
    if (!value) return '-';
    const d = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(d.getTime())) return String(value);
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const FullDataField = ({ label, value }) => {
    let displayValue = value;
    if (value === true || value === 1 || value === '1' || value === 'true') displayValue = 'Ya';
    if (value === false || value === 0 || value === '0' || value === 'false') displayValue = 'Tidak';
    
    return (
      <div className="space-y-1 md:space-y-1.5">
        <div className="text-[10px] md:text-[11px] font-bold md:font-semibold uppercase tracking-[0.16em] text-slate-400/80">{label}</div>
        <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-950/40 px-3 md:px-4 py-2.5 md:py-3 text-sm font-medium text-slate-800 dark:text-slate-100 shadow-sm">
          {displayValue === undefined || displayValue === null || String(displayValue).trim() === '' ? '-' : String(displayValue)}
        </div>
      </div>
    );
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-6">
          <style>{`
            .reg-card-preview {
              border-radius: 24px;
              overflow: hidden;
              background: #ffffff;
              border: 1px solid rgba(226,232,240,0.9);
              box-shadow: 0 24px 70px rgba(2,6,23,0.18);
              position: relative;
            }
            .reg-card-preview-top {
              position: relative;
              padding: 18px 18px 16px;
              background: linear-gradient(135deg, #8B0012 0%, #D0021B 40%, #1A0005 100%);
              color: white;
              overflow: hidden;
            }
            .reg-card-preview-top::before {
              content: '';
              position: absolute;
              inset: 0;
              background-image:
                repeating-linear-gradient(45deg, rgba(245,166,35,0.10) 0px, rgba(245,166,35,0.10) 1px, transparent 1px, transparent 28px),
                repeating-linear-gradient(-45deg, rgba(255,255,255,0.06) 0px, rgba(255,255,255,0.06) 1px, transparent 1px, transparent 28px);
              opacity: 0.65;
              pointer-events: none;
            }
            .reg-card-preview-top::after {
              content: '';
              position: absolute;
              inset: 0;
              background: radial-gradient(circle at 20% 0%, rgba(255,255,255,0.18), transparent 45%), radial-gradient(circle at 80% 10%, rgba(245,166,35,0.18), transparent 40%);
              pointer-events: none;
            }
            .gold-strip { position: absolute; left: 0; top: 0; height: 100%; width: 10px; background: linear-gradient(to bottom, rgba(245,166,35,0.95), rgba(200,134,10,0.65)); }
            .reg-card-preview-head { position: relative; display: grid; grid-template-columns: 1fr auto; align-items: center; gap: 12px; }
            .reg-card-preview-brand { display: flex; align-items: center; gap: 12px; min-width: 0; }
            .reg-card-preview-logo {
              width: 46px;
              height: 46px;
              border-radius: 16px;
              background: rgba(255,255,255,0.14);
              border: 1px solid rgba(255,255,255,0.22);
              backdrop-filter: blur(10px);
              display: flex;
              align-items: center;
              justify-content: center;
              overflow: hidden;
              flex-shrink: 0;
              box-shadow: 0 10px 30px rgba(0,0,0,0.18);
            }
            .reg-card-preview-logo img { width: 30px; height: 30px; object-fit: contain; filter: drop-shadow(0 6px 10px rgba(0,0,0,0.25)); }
            .reg-card-preview-title { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 20px; font-weight: 900; letter-spacing: 0.02em; line-height: 1.1; }
            .reg-card-preview-sub { font-size: 10px; opacity: 0.85; margin-top: 2px; letter-spacing: 0.18em; text-transform: uppercase; }
            .reg-card-preview-stamp {
              width: 46px;
              height: 46px;
              border-radius: 16px;
              border: 1.5px solid rgba(245,166,35,0.85);
              color: rgba(245,166,35,0.98);
              display: flex;
              align-items: center;
              justify-content: center;
              font-family: 'Noto Sans JP', sans-serif;
              font-weight: 900;
              font-size: 16px;
              background: rgba(255,255,255,0.10);
              backdrop-filter: blur(10px);
              box-shadow: 0 10px 28px rgba(0,0,0,0.18);
              flex-shrink: 0;
            }
            .reg-card-preview-body {
              padding: 18px 18px 16px;
              background:
                radial-gradient(circle at 80% 0%, rgba(208,2,27,0.06), transparent 35%),
                radial-gradient(circle at 0% 80%, rgba(245,166,35,0.06), transparent 38%),
                repeating-linear-gradient(45deg, rgba(2,6,23,0.025) 0px, rgba(2,6,23,0.025) 1px, transparent 1px, transparent 26px);
            }
            .reg-card-main { display: grid; grid-template-columns: 96px 1fr; gap: 16px; align-items: center; }
            .reg-card-photo {
              width: 96px;
              height: 120px;
              border-radius: 18px;
              overflow: hidden;
              background: linear-gradient(135deg, rgba(208,2,27,0.14), rgba(245,166,35,0.10));
              border: 1px solid rgba(226,232,240,0.95);
              box-shadow: 0 18px 40px rgba(2,6,23,0.14);
            }
            .reg-card-photo img { width: 100%; height: 100%; object-fit: cover; display: block; }
            .reg-card-info { min-width: 0; }
            .reg-card-label { font-size: 10px; font-weight: 900; letter-spacing: 0.18em; text-transform: uppercase; color: #64748B; }
            .reg-card-name { font-size: 18px; font-weight: 900; color: #0F172A; letter-spacing: 0.01em; line-height: 1.2; margin-top: 4px; }
            .reg-card-reg { font-size: 13px; font-weight: 800; color: #D0021B; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; margin-top: 6px; }
            .reg-card-divider { height: 1px; width: 100%; background: linear-gradient(to right, transparent, rgba(148,163,184,0.55), transparent); margin: 14px 0; }
            .reg-card-meta { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
            .reg-card-meta-item { padding: 12px 12px; border-radius: 16px; background: rgba(255,255,255,0.8); border: 1px solid rgba(226,232,240,0.9); box-shadow: 0 10px 30px rgba(2,6,23,0.06); }
            .reg-card-meta-k { font-size: 10px; font-weight: 900; letter-spacing: 0.16em; text-transform: uppercase; color: #64748B; }
            .reg-card-meta-v { margin-top: 6px; font-size: 13px; font-weight: 900; color: #0F172A; line-height: 1.2; }
            .reg-card-status { display: inline-flex; align-items: center; justify-content: center; padding: 6px 10px; border-radius: 999px; background: rgba(5,150,105,0.14); border: 1px solid rgba(5,150,105,0.25); color: #047857; font-weight: 900; font-size: 12px; letter-spacing: 0.01em; }
            .reg-card-bottom { display: flex; align-items: flex-end; justify-content: space-between; gap: 12px; margin-top: 14px; }
            .reg-card-micro { min-width: 0; }
            .reg-card-serial { font-size: 10px; font-weight: 900; letter-spacing: 0.16em; text-transform: uppercase; color: #94A3B8; }
            .reg-card-tagline { margin-top: 6px; font-size: 11px; color: #64748B; line-height: 1.4; }
            .reg-card-qr { width: 82px; height: 82px; padding: 8px; border-radius: 18px; background: rgba(255,255,255,0.92); border: 1px solid rgba(226,232,240,0.95); box-shadow: 0 18px 50px rgba(2,6,23,0.10); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
            .reg-card-qr img { width: 100%; height: 100%; object-fit: contain; image-rendering: pixelated; }
            .reg-card-qr-ph { width: 100%; height: 100%; border-radius: 12px; background: repeating-linear-gradient(90deg, rgba(2,6,23,0.08) 0px, rgba(2,6,23,0.08) 6px, transparent 6px, transparent 12px); }
            .reg-card-preview-foot { margin-top: 14px; font-size: 11px; color: #64748B; line-height: 1.5; text-align: center; }
            
            /* Hide scrollbar */
            .hide-scrollbar::-webkit-scrollbar { display: none; }
            .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
          `}</style>
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <Link to={backLink} className="inline-flex items-center text-sm text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 mb-2 transition-colors">
                    <ArrowLeft size={16} className="mr-1" /> Kembali ke Data Pendaftar
                </Link>
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
                    Detail Pendaftar
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">
                    Informasi lengkap calon siswa dan manajemen status seleksi.
                </p>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
                 <button
                  type="button"
                  onClick={() => { setFullDataTab('personal'); setShowFullData(true); }}
                  className="flex-1 md:flex-none px-4 py-2.5 bg-slate-900/90 dark:bg-black/40 text-white rounded-xl hover:bg-slate-900 transition shadow-lg shadow-slate-900/20 font-medium flex items-center justify-center gap-2"
                >
                    <FileText size={18} />
                    Periksa Data Lengkap
                </button>
                 <button
                  onClick={() => setShowPdf(true)}
                  className="flex-1 md:flex-none px-4 py-2.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition shadow-sm font-medium flex items-center justify-center gap-2"
                >
                    <Eye size={18} className="text-slate-600 dark:text-slate-400" />
                    Lihat Dokumen
                </button>
                {isAccepted && (
                  <button
                    type="button"
                    onClick={downloadCardPng}
                    disabled={isDownloadingCard}
                    className="flex-1 md:flex-none px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition shadow-lg shadow-red-600/20 font-medium flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                      <Download size={18} />
                      {isDownloadingCard ? 'Memproses...' : 'Download Card'}
                  </button>
                )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
             {/* Left Column: Profile Card */}
             <div className="lg:col-span-1 space-y-6">
                 <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-[0_4px_20px_-2px_rgba(0,0,0,0.1)] dark:shadow-black/40 border border-transparent dark:border-slate-800 relative overflow-hidden group hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300">
                    <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 z-0"></div>
                    
                    <div className="relative z-10 flex flex-col items-center p-6 pb-0">
                        <div className="w-40 h-40 rounded-full p-1.5 bg-white dark:bg-slate-800 shadow-xl mb-4 ring-4 ring-white/50 dark:ring-slate-700/50">
                             {student.photo_path ? (
                               <img 
                                 src={`${import.meta.env.VITE_API_URL.replace('/api', '')}/${student.photo_path.replace(/\\/g, '/')}`} 
                                 alt="Foto" 
                                 className="w-full h-full object-cover rounded-full" 
                                 onError={(e) => {
                                   e.target.onerror = null;
                                   e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(student.full_name) + '&background=random';
                                 }}
                               />
                             ) : (
                               <div className="w-full h-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center rounded-full text-slate-400">
                                   <User size={48} />
                               </div>
                             )}
                        </div>
                        
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white text-center tracking-tight mb-1">{student.full_name}</h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-6 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">{student.registration_number}</p>
                    </div>

                    <div className={`mt-2 p-4 flex items-center justify-center gap-2 font-bold text-sm tracking-wide uppercase ${
                        student.status === 'Diterima' ? 'bg-emerald-500 text-white' :
                        student.status === 'Ditolak' ? 'bg-red-500 text-white' :
                        student.status === 'Terverifikasi' ? 'bg-blue-500 text-white' :
                        'bg-amber-400 text-amber-950'
                    }`}>
                        {student.status === 'Diterima' && <CheckCircle2 size={18} />}
                        {student.status === 'Ditolak' && <XCircle size={18} />}
                        {student.status === 'Menunggu Verifikasi' && <Clock size={18} />}
                        {student.status === 'Terverifikasi' && <CheckCircle2 size={18} />}
                        {student.status}
                    </div>
                 </div>

                 {student.qr_code_path && (
                    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-[0_4px_20px_-2px_rgba(0,0,0,0.1)] dark:shadow-black/40 border border-transparent dark:border-slate-800 overflow-hidden group hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300">
                        <div className="p-6 flex flex-col items-center">
                            <div className="bg-white p-4 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 mb-4">
                                 <img src={`/${student.qr_code_path.replace(/\\/g, '/')}`} alt="QR" className="w-32 h-32" />
                            </div>
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Scan QR Code</h3>
                            <p className="text-xs text-slate-400 mt-1">Gunakan untuk verifikasi cepat</p>
                        </div>
                        <div className="h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 w-full"></div>
                    </div>
                 )}
             </div>
             
             {/* Right Column: Details & Actions */}
             <div className="lg:col-span-2 space-y-6">
                
                {/* Admin Actions Panel */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-[0_4px_20px_-2px_rgba(0,0,0,0.1)] dark:shadow-black/40 border border-transparent dark:border-slate-800 overflow-hidden">
                    <div className="p-6 md:p-8 bg-gradient-to-r from-indigo-600 to-blue-600 text-white">
                         <div className="flex items-center gap-4">
                             <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl text-white">
                                 <Shield size={28} />
                             </div>
                             <div>
                                 <h3 className="text-xl font-bold text-white">
                                     {userRole === 'STAFF' ? 'Panel Staff' : 
                                      userRole === 'KEPALA_LPK' ? 'Panel Kepala LPK' : 
                                      'Panel Admin'}
                                 </h3>
                                 <p className="text-indigo-100 text-sm">Validasi dan catatan pendaftar</p>
                             </div>
                         </div>
                    </div>

                    <div className="p-6 md:p-8">
                        <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                             <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                Catatan Internal
                             </label>
                             <div className="relative">
                                <textarea 
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 dark:focus:ring-indigo-400/50 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all text-sm text-slate-800 dark:text-slate-200" 
                                    rows="4"
                                    value={adminNotes}
                                    onChange={(e) => setAdminNotes(e.target.value)}
                                    placeholder="Tulis catatan admin di sini..."
                                ></textarea>
                                <button 
                                    onClick={saveNotes}
                                    className="absolute bottom-3 right-3 p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-sm"
                                    title="Simpan Catatan"
                                >
                                    <Save size={16} />
                                </button>
                             </div>
                        </div>

                        <div className="space-y-4">
                             <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                Ubah Status Pendaftaran
                             </label>
                             
                             <div className="flex flex-col gap-3">
                                {(userRole === 'STAFF' || userRole === 'SUPER_ADMIN' || userRole === 'superadmin') && (
                                    <>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Verifikasi Awal</span>
                                            <div className="h-px bg-slate-200 dark:bg-slate-700 flex-1"></div>
                                        </div>
                                        <button 
                                            onClick={() => updateStatus('Terverifikasi')} 
                                            disabled={isUpdating}
                                            className={`w-full p-4 rounded-2xl border-0 flex items-center justify-between transition-all shadow-sm hover:shadow-md ${
                                                student.status === 'Terverifikasi' 
                                                ? 'bg-blue-500 text-white ring-4 ring-blue-100 dark:ring-blue-900/30' 
                                                : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-full ${student.status === 'Terverifikasi' ? 'bg-white/20 text-white' : 'bg-white dark:bg-slate-700 text-slate-400'}`}>
                                                    <CheckCircle2 size={20} />
                                                </div>
                                                <span className="font-bold text-base">Verifikasi Berkas</span>
                                            </div>
                                            {student.status === 'Terverifikasi' && <span className="text-xs font-bold px-2 py-1 bg-white/20 rounded text-white">AKTIF</span>}
                                        </button>
                                    </>
                                )}

                                {(userRole === 'SUPER_ADMIN' || userRole === 'KEPALA_LPK' || userRole === 'STAFF' || userRole === 'superadmin') && (
                                    <>
                                        <div className="flex items-center gap-2 mb-2 mt-2">
                                            <span className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Keputusan Final</span>
                                            <div className="h-px bg-slate-200 dark:bg-slate-700 flex-1"></div>
                                        </div>
                                        <button 
                                            onClick={() => updateStatus('Diterima')} 
                                            disabled={isUpdating}
                                            className={`w-full p-4 rounded-2xl border-0 flex items-center justify-between transition-all shadow-sm hover:shadow-md ${
                                                student.status === 'Diterima' 
                                                ? 'bg-emerald-500 text-white ring-4 ring-emerald-100 dark:ring-emerald-900/30' 
                                                : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-full ${student.status === 'Diterima' ? 'bg-white/20 text-white' : 'bg-white dark:bg-slate-700 text-slate-400'}`}>
                                                    <CheckCircle2 size={20} />
                                                </div>
                                                <span className="font-bold text-base">Terima Siswa</span>
                                            </div>
                                            {student.status === 'Diterima' && <span className="text-xs font-bold px-2 py-1 bg-white/20 rounded text-white">AKTIF</span>}
                                        </button>

                                        <button 
                                            onClick={() => updateStatus('Ditolak')} 
                                            disabled={isUpdating}
                                            className={`w-full p-4 rounded-2xl border-0 flex items-center justify-between transition-all shadow-sm hover:shadow-md ${
                                                student.status === 'Ditolak' 
                                                ? 'bg-red-500 text-white ring-4 ring-red-100 dark:ring-red-900/30' 
                                                : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-full ${student.status === 'Ditolak' ? 'bg-white/20 text-white' : 'bg-white dark:bg-slate-700 text-slate-400'}`}>
                                                    <XCircle size={20} />
                                                </div>
                                                <span className="font-bold text-base">Tolak Siswa</span>
                                            </div>
                                            {student.status === 'Ditolak' && <span className="text-xs font-bold px-2 py-1 bg-white/20 rounded text-white">AKTIF</span>}
                                        </button>
                                    </>
                                )}

                                {(userRole === 'SUPER_ADMIN' || userRole === 'STAFF' || userRole === 'superadmin') && student.status !== 'Menunggu Verifikasi' && (
                                    <button 
                                        onClick={() => updateStatus('Menunggu Verifikasi')}
                                        disabled={isUpdating}
                                        className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 underline text-center mt-1"
                                    >
                                        Reset ke Menunggu Verifikasi
                                    </button>
                                )}
                             </div>
                        </div>
                        </div>
                    </div>
                </div>

                {/* Personal Info Grid */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-[0_4px_20px_-2px_rgba(0,0,0,0.1)] dark:shadow-black/40 border border-transparent dark:border-slate-800 overflow-hidden">
                    <div className="p-6 md:p-8">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                            <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-300">
                                <User size={20} />
                            </div>
                            Informasi Pribadi
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                        <InfoItem label="NIK" value={student.nik} icon={FileText} />
                        <InfoItem label="Tempat, Tanggal Lahir" value={`${student.place_of_birth}, ${new Date(student.date_of_birth).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`} icon={Calendar} />
                        <InfoItem label="Jenis Kelamin" value={student.gender} icon={User} />
                        <InfoItem label="Agama" value={student.religion} icon={User} />
                        <InfoItem label="Email" value={student.email} icon={Mail} />
                        <InfoItem label="Nomor Handphone" value={student.phone_number} icon={Phone} />
                        <div className="md:col-span-2">
                            <InfoItem label="Alamat Lengkap" value={student.address} icon={MapPin} />
                        </div>
                    </div>
                    </div>
                </div>
             </div>
          </div>

          {/* PDF Preview Modal */}
          {showPdf && (
            <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex flex-col justify-center items-center p-4">
              <div className="bg-white dark:bg-slate-900 w-full max-w-5xl h-[85vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800">
                <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Preview Data Lengkap</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{student.full_name} • {student.registration_number}</p>
                  </div>
                  <button
                    onClick={() => setShowPdf(false)}
                    className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition"
                  >
                    <XCircle size={24} />
                  </button>
                </div>
                <div className="flex-1 bg-slate-100 dark:bg-slate-950 p-4">
                  <PDFViewer width="100%" height="100%" className="rounded-xl shadow-inner">
                    <StudentPDF students={[{ ...student, ...(student.documents || {}), family: student.family }]} />
                  </PDFViewer>
                </div>
              </div>
            </div>
          )}

          {showFullData && (
            <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-6">
              <button 
                type="button" 
                onClick={() => setShowFullData(false)} 
                className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" 
                aria-label="Tutup" 
              />
              <div className="relative z-10 w-full md:max-w-5xl bg-white dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 rounded-t-3xl md:rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
                <div className="px-4 md:px-7 py-3.5 md:py-4 border-b border-slate-200/70 dark:border-slate-800 flex items-center justify-between gap-3 bg-white dark:bg-slate-950 sticky top-0 z-20">
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400 mb-0.5">Data Lengkap</div>
                    <div className="text-base md:text-xl font-black text-slate-900 dark:text-white truncate flex items-center gap-2">
                      <span className="truncate">{student.full_name}</span>
                      <span className="hidden sm:inline text-slate-300 dark:text-slate-700">•</span>
                      <span className="hidden sm:inline text-sm font-medium text-slate-500">{student.registration_number}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {canEditFullData && (
                      <Link
                        to={`/admin/input-student/${student.id}`}
                        className="hidden sm:inline-flex items-center gap-2 rounded-xl bg-indigo-600 text-white px-4 py-2 text-sm font-semibold hover:bg-indigo-700 transition"
                      >
                        <Edit3 size={16} />
                        Edit Data
                      </Link>
                    )}
                    <button
                      type="button"
                      onClick={() => setShowFullData(false)}
                      className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>

                <div className="px-4 md:px-7 py-2.5 md:py-3 border-b border-slate-200/70 dark:border-slate-800 overflow-x-auto hide-scrollbar bg-white/80 dark:bg-slate-950/80 backdrop-blur-md sticky top-[68px] md:top-[76px] z-20">
                  <div className="flex items-center gap-2 md:gap-3 min-w-max">
                    {[
                      { id: 'personal', label: 'Data Pribadi' },
                      { id: 'education', label: 'Pendidikan' },
                      { id: 'family', label: 'Keluarga' },
                      { id: 'documents', label: 'Dokumen' },
                      { id: 'physical', label: 'Fisik' },
                    ].map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setFullDataTab(t.id)}
                        className={`px-3.5 md:px-4 py-1.5 md:py-2 rounded-full text-[11px] md:text-xs font-bold md:font-semibold border transition-all duration-200 ${
                          fullDataTab === t.id
                            ? 'bg-red-600 text-white border-red-600 shadow-md scale-105'
                            : 'bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-200 border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900'
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="px-5 md:px-7 py-5 overflow-y-auto">
                  {fullDataTab === 'personal' && (
                    <div className="grid md:grid-cols-2 gap-4">
                      <FullDataField label="Nama Lengkap" value={student.full_name} />
                      <FullDataField label="NIK" value={student.nik} />
                      <FullDataField label="Jenis Kelamin" value={student.gender} />
                      <FullDataField label="Tempat Lahir" value={student.place_of_birth} />
                      <FullDataField label="Tanggal Lahir" value={formatDate(student.date_of_birth)} />
                      <FullDataField label="Golongan Darah" value={student.blood_type} />
                      <FullDataField label="Agama" value={student.religion} />
                      <FullDataField label="Status Pernikahan" value={student.marital_status} />
                      <FullDataField label="No. HP" value={student.phone_number} />
                      <FullDataField label="Email" value={student.email} />
                      <div className="md:col-span-2">
                        <FullDataField label="Alamat" value={student.address} />
                      </div>
                    </div>
                  )}

                  {fullDataTab === 'education' && (
                    <div className="space-y-3 md:space-y-4">
                      {educationRows.length === 0 ? (
                        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/30 px-5 py-4 text-sm text-slate-600 dark:text-slate-300 text-center">
                          Belum ada data pendidikan.
                        </div>
                      ) : (
                        educationRows.map((row, idx) => (
                          <div key={row.id ?? idx} className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-950/40 p-4 md:p-5 shadow-sm">
                            <div className="flex items-center gap-2 mb-4">
                              <div className="h-6 w-6 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-[10px] font-bold">#{idx + 1}</div>
                              <div className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Pendidikan</div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                              <FullDataField label="Jenjang" value={row.level || row.education_level} />
                              <FullDataField label="Nama Sekolah" value={row.school_name || row.school} />
                              <FullDataField label="Masuk" value={`${row.entry_month || ''} ${row.entry_year || ''}`} />
                              <FullDataField label="Lulus" value={`${row.graduation_month || ''} ${row.graduation_year || ''}`} />
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {fullDataTab === 'family' && (
                    <div className="grid md:grid-cols-2 gap-4">
                      <FullDataField label="Nama Ayah" value={family.father_name} />
                      <FullDataField label="Pekerjaan Ayah" value={family.father_job} />
                      <FullDataField label="Keadaan Ayah" value={family.father_status} />
                      <FullDataField label="Nama Ibu" value={family.mother_name} />
                      <FullDataField label="Pekerjaan Ibu" value={family.mother_job} />
                      <FullDataField label="Keadaan Ibu" value={family.mother_status} />
                      <div className="md:col-span-2">
                        <FullDataField label="Alamat Orang Tua" value={family.parent_address} />
                      </div>
                      <FullDataField label="Nama Wali" value={family.guardian_name} />
                      <FullDataField label="No. HP Wali" value={family.guardian_phone} />
                      <div className="md:col-span-2">
                        <FullDataField label="Alamat Wali" value={family.guardian_address} />
                      </div>
                    </div>
                  )}

                  {fullDataTab === 'documents' && (
                    <div className="space-y-3 md:space-y-4">
                      {[
                        { key: 'diploma_path', label: 'Ijazah Terakhir' },
                        { key: 'ktp_path', label: 'KTP / KIA' },
                        { key: 'family_card_path', label: 'Kartu Keluarga' },
                        { key: 'birth_certificate_path', label: 'Akta Kelahiran' },
                        { key: 'health_certificate_path', label: 'Surat Sehat' },
                        { key: 'consent_letter_path', label: 'Surat Izin Ortu' },
                      ].map((doc) => {
                        const url = toFileUrl(docs?.[doc.key]);
                        return (
                          <div key={doc.key} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 md:gap-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-950/40 px-4 md:px-5 py-3.5 md:py-4 shadow-sm group hover:border-indigo-500/30 dark:hover:border-indigo-500/30 transition-all">
                            <div className="min-w-0 flex-1">
                              <div className="text-[10px] md:text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">{doc.label}</div>
                              <div className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{docs?.[doc.key] ? String(docs[doc.key]).split(/[\/\\]/).pop() : 'Belum ada file'}</div>
                            </div>
                            <div className="flex w-full sm:w-auto">
                              {url ? (
                                <a
                                  href={url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-slate-900 dark:bg-slate-800 text-white dark:text-slate-100 px-5 py-2.5 text-xs font-bold hover:bg-indigo-600 dark:hover:bg-indigo-600 transition-all shadow-sm"
                                >
                                  Lihat Dokumen
                                </a>
                              ) : (
                                <span className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 px-5 py-2.5 text-xs font-bold">
                                  Belum Tersedia
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {fullDataTab === 'physical' && (
                    <div className="grid md:grid-cols-2 gap-4">
                      <FullDataField label="Memiliki Tato" value={student.has_tattoo} />
                      <FullDataField label="Memiliki Tindik" value={student.has_piercing} />
                      <FullDataField label="Tinggi (cm)" value={student.height} />
                      <FullDataField label="Berat (kg)" value={student.weight} />
                    </div>
                  )}
                </div>

                <div className="px-5 md:px-7 py-4 border-t border-slate-200/70 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/30 flex items-center justify-between gap-3">
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {roleUpper === 'STAFF' ? 'Mode staff: hanya melihat data.' : canEditFullData ? 'Mode admin: bisa edit via tombol Edit Data.' : 'Mode lihat saja.'}
                  </div>
                  <div className="flex items-center gap-2">
                    {canEditFullData && (
                      <Link
                        to={`/admin/input-student/${student.id}`}
                        className="sm:hidden inline-flex items-center gap-2 rounded-xl bg-indigo-600 text-white px-4 py-2 text-sm font-semibold hover:bg-indigo-700 transition"
                      >
                        <Edit3 size={16} />
                        Edit
                      </Link>
                    )}
                    <button
                      type="button"
                      onClick={() => setShowFullData(false)}
                      className="inline-flex items-center justify-center rounded-xl bg-white dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 px-4 py-2 text-sm font-semibold text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-900 transition"
                    >
                      Tutup
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {isAccepted && (
            <div style={{ position:'absolute', left:-10000, top:-10000 }}>
              <div id="reg-card-download-admin" ref={cardRef} className="reg-card-preview" style={{ width: 440 }}>
                <div className="reg-card-preview-top">
                  <div className="gold-strip"></div>
                  <div className="reg-card-preview-head">
                    <div className="reg-card-preview-brand">
                      <div className="reg-card-preview-logo"><img src={Logo} alt="Logo" /></div>
                      <div>
                        <div className="reg-card-preview-title">SKYBRIDGE</div>
                        <div className="reg-card-preview-sub">KARTU PESERTA PELATIHAN</div>
                      </div>
                    </div>
                    <div className="reg-card-preview-stamp">正規</div>
                  </div>
                </div>

                <div className="reg-card-preview-body">
                  <div className="reg-card-main">
                    <div className="reg-card-photo">
                      {student?.photo_path ? (
                        <img src={`/${student.photo_path.replace(/\\/g, '/')}`} alt="Foto peserta" />
                      ) : (
                        <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center' }}><User size={32} style={{ color:'#94A3B8' }} /></div>
                      )}
                    </div>
                    <div className="reg-card-info">
                      <div className="reg-card-label">Nama Lengkap</div>
                      <div className="reg-card-name">{student?.full_name}</div>
                      <div style={{ marginTop: 10 }}>
                        <div className="reg-card-label">No. Registrasi</div>
                        <div className="reg-card-reg">{student?.registration_number}</div>
                      </div>
                    </div>
                  </div>

                  <div className="reg-card-divider" />

                  <div className="reg-card-meta">
                    <div className="reg-card-meta-item">
                      <div className="reg-card-meta-k">Status</div>
                      <div className="reg-card-meta-v"><span className="reg-card-status">DITERIMA / 合格</span></div>
                    </div>
                    <div className="reg-card-meta-item">
                      <div className="reg-card-meta-k">Tanggal Registrasi</div>
                      <div className="reg-card-meta-v">{registrationDateText}</div>
                    </div>
                  </div>

                  <div className="reg-card-bottom">
                    <div className="reg-card-micro">
                      <div className="reg-card-serial">{cardSerial}</div>
                      <div className="reg-card-tagline">ID Peserta Pelatihan Resmi. Scan QR untuk verifikasi kehadiran.</div>
                    </div>
                    <div className="reg-card-qr">
                      {qrDataUrl ? <img src={qrDataUrl} alt="QR verifikasi" /> : <div className="reg-card-qr-ph" />}
                    </div>
                  </div>

                  <div className="reg-card-preview-foot">Kartu ini wajib dibawa/ditunjukkan saat pengisian daftar hadir.</div>
                </div>
              </div>
            </div>
          )}
      </div>
    </AdminLayout>
  );
};

const InfoItem = ({ label, value, icon: Icon }) => (
    <div className="group">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            {Icon && <Icon size={12} />}
            {label}
        </h4>
        <p className="text-base font-medium text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {value || '-'}
        </p>
    </div>
);

export default AdminStudentDetail;
