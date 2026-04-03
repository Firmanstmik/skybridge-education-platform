import React, { useEffect, useState, useMemo } from 'react';
import { Link, useSearchParams, useLocation } from 'react-router-dom';
import { 
  Search, 
  FileText, 
  Download, 
  Trash2, 
  MoreVertical, 
  CheckCircle2, 
  XCircle, 
  Clock,
  User,
  Users,
  TrendingUp,
  Bot,
  Sparkles
} from 'lucide-react';
import { BsFileEarmarkPdfFill } from 'react-icons/bs';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import AdminLayout from '../components/AdminLayout';

const SmartAnswerCard = ({ answer }) => {
  if (!answer) return null;
  
  const Icon = answer.icon || Sparkles;
  
  const styles = {
    'ai': 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-100 dark:border-indigo-800 text-indigo-800 dark:text-indigo-300',
    'success': 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300',
    'error': 'bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800 text-red-800 dark:text-red-300',
    'warning': 'bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800 text-amber-800 dark:text-amber-300',
    'info': 'bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800 text-blue-800 dark:text-blue-300',
  };

  const style = styles[answer.type] || styles['ai'];

  return (
    <div className={`mb-6 p-4 rounded-2xl border flex items-start gap-4 ${style} animate-in fade-in slide-in-from-top-4 duration-500`}>
      <div className="p-2 bg-white/50 dark:bg-black/20 rounded-xl shadow-sm">
        <Icon size={20} />
      </div>
      <div>
        <h4 className="font-bold text-sm mb-1 flex items-center gap-2">
          {answer.title}
          {answer.type === 'ai' && <Bot size={14} className="opacity-50" />}
        </h4>
        <p className="text-sm opacity-90 leading-relaxed">
          {answer.text}
        </p>
      </div>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const styles = {
    Diterima: {
      bg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
      text: 'text-emerald-700 dark:text-emerald-400',
      border: 'border-emerald-200 dark:border-emerald-500/30',
      icon: CheckCircle2,
    },
    Ditolak: {
      bg: 'bg-red-500/10 dark:bg-red-500/20',
      text: 'text-red-700 dark:text-red-400',
      border: 'border-red-200 dark:border-red-500/30',
      icon: XCircle,
    },
    Terverifikasi: {
      bg: 'bg-blue-500/10 dark:bg-blue-500/20',
      text: 'text-blue-700 dark:text-blue-400',
      border: 'border-blue-200 dark:border-blue-500/30',
      icon: CheckCircle2,
    },
    'Menunggu Verifikasi': {
      bg: 'bg-amber-500/10 dark:bg-amber-500/20',
      text: 'text-amber-700 dark:text-amber-400',
      border: 'border-amber-200 dark:border-amber-500/30',
      icon: Clock,
    },
  };

  const style = styles[status] || styles['Menunggu Verifikasi'];
  const IconBadge = style.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${style.bg} ${style.text} ${style.border}`}>
      <IconBadge size={12} strokeWidth={2.5} />
      {status}
    </span>
  );
};

const MobileStudentCard = ({ student, canDelete, onDeleteStudent, onDownloadStudentPdf, detailLinkPrefix }) => (
  <div className="bg-white dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm mb-3">
    <div className="flex justify-between items-start mb-3">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">
          {student.photo_path ? (
            <img src={`/${student.photo_path.replace(/\\/g, '/')}`} alt="Foto" className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-slate-400">
              <User size={20} />
            </div>
          )}
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{student.full_name}</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">{student.registration_number}</p>
        </div>
      </div>
      <StatusBadge status={student.status} />
    </div>

    <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-400 mb-4">
      <div className="bg-slate-50 dark:bg-slate-900/50 p-2 rounded-lg border border-slate-100 dark:border-slate-800">
        <span className="block text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-0.5">NIK</span>
        {student.nik}
      </div>
      <div className="bg-slate-50 dark:bg-slate-900/50 p-2 rounded-lg border border-slate-100 dark:border-slate-800">
        <span className="block text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-0.5">Tanggal Daftar</span>
        {student.created_at ? new Date(student.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
      </div>
    </div>

    <div className="flex gap-2">
      <Link
        to={`${detailLinkPrefix}/${student.id}`}
        className="flex-1 flex items-center justify-center py-2 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
      >
        Detail
      </Link>
      <button
        onClick={() => onDownloadStudentPdf(student.id, student.registration_number)}
        className="flex-1 flex items-center justify-center py-2 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs font-semibold hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors border border-red-100 dark:border-red-800/30"
      >
        <BsFileEarmarkPdfFill size={14} className="mr-1.5" />
        PDF
      </button>
      {canDelete && (
        <button
          onClick={() => onDeleteStudent(student.id)}
          className="flex items-center justify-center py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 text-xs font-semibold hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-colors"
        >
          <Trash2 size={16} />
        </button>
      )}
    </div>
  </div>
);

const AdminStudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [smartAnswer, setSmartAnswer] = useState(null);
  const [userRole, setUserRole] = useState(null);

  // Determine detail link prefix based on current path
  const detailLinkPrefix = useMemo(() => {
    if (location.pathname.startsWith('/staff')) return '/staff/student';
    if (location.pathname.startsWith('/kepalalpk')) return '/kepalalpk/student';
    return '/admin/student';
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

  // Stats calculation
  const stats = useMemo(() => {
    return {
      total: students.length,
      pending: students.filter(s => s.status === 'Menunggu Verifikasi').length,
      accepted: students.filter(s => s.status === 'Diterima').length,
      rejected: students.filter(s => s.status === 'Ditolak').length
    };
  }, [students]);

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/students', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStudents(response.data);
      setFiltered(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching students:', error);
      toast.error('Gagal memuat data pendaftar');
      setIsLoading(false);
    }
  };

  const filterStudents = () => {
    let result = [...students];
    let answer = null;
    const query = searchTerm.toLowerCase().trim();

    // AI / Smart Query Logic Engine
    if (query) {
        // Helper to check keywords
        const has = (keywords) => keywords.some(k => query.includes(k));
        
        // 1. Pertanyaan Statistik (Questions)
        if (has(['berapa', 'jumlah', 'total', 'hitung', 'statistik'])) {
            if (has(['laki', 'pria', 'cowok'])) {
                const count = students.filter(s => s.gender === 'Laki-laki' || s.gender === 'L').length;
                answer = { 
                    title: 'Analisis Gender', 
                    text: `Saya menemukan ${count} siswa Laki-laki dalam database.`, 
                    type: 'ai',
                    icon: User 
                };
                result = result.filter(s => s.gender === 'Laki-laki' || s.gender === 'L');
            } else if (has(['perempuan', 'wanita', 'cewek'])) {
                const count = students.filter(s => s.gender === 'Perempuan' || s.gender === 'P').length;
                answer = { 
                    title: 'Analisis Gender', 
                    text: `Terdapat ${count} siswa Perempuan yang terdaftar.`, 
                    type: 'ai',
                    icon: User 
                };
                result = result.filter(s => s.gender === 'Perempuan' || s.gender === 'P');
            } else if (has(['diterima', 'lulus', 'lolos'])) {
                const count = students.filter(s => s.status === 'Diterima').length;
                answer = { 
                    title: 'Statistik Kelulusan', 
                    text: `Hore! Ada ${count} calon siswa yang sudah Diterima.`, 
                    type: 'success',
                    icon: CheckCircle2
                };
                result = result.filter(s => s.status === 'Diterima');
            } else if (has(['ditolak', 'gagal'])) {
                const count = students.filter(s => s.status === 'Ditolak').length;
                answer = { 
                    title: 'Laporan Penolakan', 
                    text: `Tercatat ada ${count} pendaftar yang Ditolak.`, 
                    type: 'error',
                    icon: XCircle
                };
                result = result.filter(s => s.status === 'Ditolak');
            } else if (has(['menunggu', 'verifikasi', 'pending'])) {
                const count = students.filter(s => s.status === 'Menunggu Verifikasi').length;
                answer = { 
                    title: 'Status Verifikasi', 
                    text: `Saat ini ada ${count} pendaftar yang Menunggu Verifikasi.`, 
                    type: 'warning',
                    icon: Clock
                };
                result = result.filter(s => s.status === 'Menunggu Verifikasi');
            } else if (has(['siswa', 'pendaftar', 'data', 'semua'])) {
                answer = { 
                    title: 'Total Keseluruhan', 
                    text: `Total ada ${students.length} pendaftar di sistem saat ini.`, 
                    type: 'info',
                    icon: Users
                };
            }
        } 
        // 2. Perintah Filter / Tampilkan (Commands)
        else if (has(['tampilkan', 'filter', 'lihat', 'mana', 'cari'])) {
             if (has(['diterima', 'lulus'])) {
                 answer = { title: 'Filter Otomatis', text: 'Menampilkan semua siswa yang Diterima.', type: 'success', icon: CheckCircle2 };
                 result = result.filter(s => s.status === 'Diterima');
             } else if (has(['ditolak', 'gagal'])) {
                 answer = { title: 'Filter Otomatis', text: 'Menampilkan daftar siswa yang Ditolak.', type: 'error', icon: XCircle };
                 result = result.filter(s => s.status === 'Ditolak');
             } else if (has(['menunggu', 'verifikasi'])) {
                 answer = { title: 'Filter Otomatis', text: 'Ini daftar siswa yang belum diverifikasi.', type: 'warning', icon: Clock };
                 result = result.filter(s => s.status === 'Menunggu Verifikasi');
             } else if (has(['laki', 'pria'])) {
                 answer = { title: 'Filter Gender', text: 'Menampilkan khusus siswa Laki-laki.', type: 'ai', icon: User };
                 result = result.filter(s => s.gender === 'Laki-laki' || s.gender === 'L');
             } else if (has(['perempuan', 'wanita'])) {
                 answer = { title: 'Filter Gender', text: 'Menampilkan khusus siswa Perempuan.', type: 'ai', icon: User };
                 result = result.filter(s => s.gender === 'Perempuan' || s.gender === 'P');
             }
        }
    }
    
    setSmartAnswer(answer);

    // Filter by status (tab filter) - tetap berjalan jika user juga klik tab
    if (filterStatus !== 'All') {
      result = result.filter(student => student.status === filterStatus);
    }

    // Default Search (Text Match) - Jika tidak ada smart answer atau sebagai filter tambahan
    if (searchTerm && !answer) {
      result = result.filter(student => 
        student && (
          (student.full_name && String(student.full_name).toLowerCase().includes(query)) ||
          (student.registration_number && String(student.registration_number).toLowerCase().includes(query)) ||
          (student.nik && String(student.nik).includes(searchTerm)) ||
          (student.email && String(student.email).toLowerCase().includes(query)) ||
          (student.status && String(student.status).toLowerCase().includes(query)) ||
          (student.gender && String(student.gender).toLowerCase().includes(query))
        )
      );
    }

    setFiltered(result);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    const query = searchParams.get('q');
    const status = searchParams.get('status');
    setSearchTerm(query || '');
    if (status) {
        setFilterStatus(status);
    }
  }, [searchParams]);

  useEffect(() => {
    filterStudents();
  }, [searchTerm, filterStatus, students]);

  const downloadStudentPdf = async (studentId, regNumber) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5500/api/students/${studentId}/pdf-form`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Formulir-${regNumber}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast.error('Gagal mengunduh Formulir');
    }
  };

  const exportSummaryPdf = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/students/export/pdf-summary', {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Laporan-Pendaftar-${new Date().toISOString().split('T')[0]}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast.error('Gagal export PDF');
    }
  };

  const deleteStudent = async (studentId) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus data siswa ini? Data yang dihapus tidak dapat dikembalikan.')) {
        return;
    }

    try {
        const token = localStorage.getItem('token');
        await axios.delete(`/api/students/${studentId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Data siswa berhasil dihapus');
        fetchStudents(); // Refresh data
    } catch (error) {
        console.error('Error deleting student:', error);
        toast.error('Gagal menghapus data siswa');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.22em] text-slate-400 uppercase">
              Management / 管理
            </p>
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-50">
              Data Pendaftar
            </h1>
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Kelola seluruh data calon peserta pelatihan dengan mudah dan efisien.
            </p>
          </div>
          <div className="flex items-center gap-3">
             <button
              type="button"
              onClick={exportSummaryPdf}
              className="group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-red-600 to-rose-600 text-white text-xs md:text-sm font-semibold shadow-lg shadow-red-500/30 hover:shadow-red-500/50 hover:from-red-500 hover:to-rose-500 transition-all active:scale-95"
            >
              <BsFileEarmarkPdfFill size={18} className="text-white/90" />
              <span>Export PDF Laporan</span>
              <div className="absolute inset-0 rounded-full bg-white/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity text-blue-500">
              <Users size={64} />
            </div>
            <div className="flex items-center gap-3 relative z-10">
              <div className="p-2.5 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400">
                <Users size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Pendaftar</p>
                <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100">{stats.total}</h3>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity text-amber-500">
              <Clock size={64} />
            </div>
            <div className="flex items-center gap-3 relative z-10">
              <div className="p-2.5 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400">
                <Clock size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Menunggu</p>
                <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100">{stats.pending}</h3>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity text-emerald-500">
              <CheckCircle2 size={64} />
            </div>
            <div className="flex items-center gap-3 relative z-10">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Diterima</p>
                <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100">{stats.accepted}</h3>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity text-red-500">
              <XCircle size={64} />
            </div>
            <div className="flex items-center gap-3 relative z-10">
              <div className="p-2.5 rounded-xl bg-red-500/10 dark:bg-red-500/20 text-red-600 dark:text-red-400">
                <XCircle size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ditolak</p>
                <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100">{stats.rejected}</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Smart Answer Card */}
        <SmartAnswerCard answer={smartAnswer} />

        {/* Filters & Search Bar */}
        <div className="bg-white/95 dark:bg-slate-950/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-4">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
             {/* Status Filter Tabs */}
             <div className="flex p-1 bg-slate-100 dark:bg-slate-900 rounded-xl w-full md:w-auto overflow-x-auto scrollbar-hide">
                {['All', 'Menunggu Verifikasi', 'Terverifikasi', 'Diterima', 'Ditolak'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-4 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                      filterStatus === status
                        ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                    }`}
                  >
                    {status === 'All' ? 'Semua Status' : status}
                  </button>
                ))}
             </div>

             {/* Search Input */}
             <div className="relative w-full md:w-72 group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={16} className="text-slate-400 group-focus-within:text-red-500 transition-colors" />
                </div>
                <input
                  type="text"
                  placeholder="Cari nama, no. registrasi, NIK..."
                  className="block w-full pl-10 pr-3 py-2 border-none rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:ring-2 focus:ring-red-500/20 text-sm transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
             </div>
          </div>
        </div>

        {/* Mobile Card List (Visible only on small screens) */}
        <div className="md:hidden space-y-3">
          {isLoading ? (
             [...Array(3)].map((_, i) => (
               <div key={i} className="bg-white dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 animate-pulse h-40"></div>
             ))
          ) : filtered.length > 0 ? (
             filtered.map((student) => (
               <MobileStudentCard
                 key={student.id}
                 student={student}
                 canDelete={userRole === 'SUPER_ADMIN' || userRole === 'superadmin'}
                 onDeleteStudent={deleteStudent}
                 onDownloadStudentPdf={downloadStudentPdf}
                 detailLinkPrefix={detailLinkPrefix}
               />
             ))
          ) : (
             <div className="text-center py-10 text-slate-500 dark:text-slate-400 text-sm">
               Tidak ada data ditemukan.
             </div>
          )}
        </div>

        {/* Desktop Data Table (Hidden on small screens) */}
        <div className="hidden md:block relative bg-white dark:bg-slate-950 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] dark:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)] overflow-hidden">
          {/* Table Header Decoration */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-rose-500 to-orange-500 opacity-80" />
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/30">
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                    Profil Peserta
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                    No. Registrasi
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest hidden md:table-cell">
                    NIK
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                    Status
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest hidden lg:table-cell">
                    Tanggal Daftar
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-right">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {isLoading ? (
                  // Loading Skeleton
                  [...Array(5)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-6 py-4"><div className="h-10 w-40 bg-slate-200 dark:bg-slate-800 rounded-lg"></div></td>
                      <td className="px-6 py-4"><div className="h-6 w-24 bg-slate-200 dark:bg-slate-800 rounded"></div></td>
                      <td className="px-6 py-4 hidden md:table-cell"><div className="h-6 w-32 bg-slate-200 dark:bg-slate-800 rounded"></div></td>
                      <td className="px-6 py-4"><div className="h-6 w-20 bg-slate-200 dark:bg-slate-800 rounded-full"></div></td>
                      <td className="px-6 py-4 hidden lg:table-cell"><div className="h-6 w-24 bg-slate-200 dark:bg-slate-800 rounded"></div></td>
                      <td className="px-6 py-4 text-right"><div className="h-8 w-20 bg-slate-200 dark:bg-slate-800 rounded ml-auto"></div></td>
                    </tr>
                  ))
                ) : filtered.length > 0 ? (
                  filtered.map((student) => (
                    <tr 
                      key={student.id} 
                      className="group hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors duration-200"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <div className="h-10 w-10 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 shadow-sm group-hover:shadow-md transition-shadow">
                              {student.photo_path ? (
                                <img
                                  src={`/${student.photo_path.replace(/\\/g, '/')}`}
                                  alt="Foto"
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center text-slate-400">
                                  <User size={20} />
                                </div>
                              )}
                            </div>
                            {/* Gender Indicator Dot */}
                            <div className={`absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white dark:border-slate-950 flex items-center justify-center ${
                              student.gender === 'L' ? 'bg-blue-500' : student.gender === 'P' ? 'bg-pink-500' : 'bg-slate-400'
                            }`}>
                               <span className="text-[8px] font-bold text-white leading-none">
                                 {student.gender === 'L' ? 'L' : student.gender === 'P' ? 'P' : '-'}
                               </span>
                            </div>
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                              {student.full_name}
                            </div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400">
                              {student.email || '-'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-mono text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded border border-slate-200 dark:border-slate-700 select-all">
                          {student.registration_number}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-600 dark:text-slate-400 font-mono hidden md:table-cell">
                        {student.nik}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={student.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500 dark:text-slate-400 hidden lg:table-cell">
                        {new Date(student.created_at).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link
                            to={`${detailLinkPrefix}/${student.id}`}
                            className="inline-flex items-center justify-center h-8 px-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-medium hover:border-red-500 hover:text-red-600 dark:hover:border-red-500 dark:hover:text-red-400 transition-colors shadow-sm"
                          >
                            Detail
                          </Link>
                          <button
                            type="button"
                            onClick={() => downloadStudentPdf(student.id, student.registration_number)}
                            className="inline-flex items-center justify-center h-8 px-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-800/30 text-xs font-medium hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors shadow-sm"
                          >
                            <BsFileEarmarkPdfFill size={14} className="mr-1.5" />
                            PDF
                          </button>
                          {(userRole === 'SUPER_ADMIN' || userRole === 'superadmin') && (
                            <button
                                type="button"
                                onClick={() => deleteStudent(student.id)}
                                className="inline-flex items-center justify-center h-8 w-8 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400 border border-slate-200 dark:border-slate-800 transition-colors shadow-sm"
                                title="Hapus Siswa"
                            >
                                <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="h-20 w-20 rounded-full bg-slate-50 dark:bg-slate-900/50 flex items-center justify-center mb-4 border border-slate-100 dark:border-slate-800">
                          <Search size={32} className="text-slate-300 dark:text-slate-600" />
                        </div>
                        <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                          Data tidak ditemukan
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto">
                          Coba ubah kata kunci pencarian atau filter status untuk menemukan data pendaftar.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Footer / Pagination (Placeholder) */}
          <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/30">
             <div className="text-xs text-slate-500 dark:text-slate-400">
                Menampilkan <span className="font-semibold text-slate-900 dark:text-slate-200">{filtered.length}</span> data pendaftar
             </div>
             {/* Pagination controls can be added here */}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminStudentsPage;
