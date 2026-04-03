import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
    ClipboardList, 
    CheckCircle2, 
    XCircle, 
    Clock, 
    Search,
    User,
    ChevronRight,
    Filter
} from 'lucide-react';
import KpiCard from './KpiCard';

const StaffDashboard = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [stats, setStats] = useState({ new: 0, pending: 0, verified: 0, rejected: 0, draft: 0 });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    const token = localStorage.getItem('token');
    try {
      setLoading(true);
      const { data } = await axios.get('/api/students', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStudents(data);
      
      // Filter for "Recent Pending" tasks
      const pendingList = data.filter(s => s.status === 'Menunggu Verifikasi').slice(0, 6);
      setFilteredStudents(pendingList);
      
      const today = new Date();
      const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      
      const newToday = data.filter(s => new Date(s.created_at) >= startOfToday).length;
      const pending = data.filter(s => s.status === 'Menunggu Verifikasi').length;
      const verified = data.filter(s => s.status === 'Diterima' || s.status === 'Ditolak').length; // Assuming these are verified
      const rejected = data.filter(s => s.status === 'Ditolak').length;
      const draft = data.filter(s => s.status === 'Draft').length;
      
      setStats({ new: newToday, pending, verified, rejected, draft });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <p className="text-[11px] md:text-xs font-semibold tracking-[0.22em] text-slate-500 uppercase">
            Dashboard Staff / スタッフパネル
          </p>
          <h1 className="mt-1 text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-50">
            Dashboard Staff
          </h1>
          <p className="mt-1 text-xs md:text-sm text-slate-500 dark:text-slate-400">
            Kelola dan verifikasi data pendaftar dengan efisien.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
        <KpiCard
          label="PENDAFTAR BARU"
          description="Masuk Hari Ini"
          value={stats.new}
          trendLabel="Perlu dicek"
          trendValue={stats.new}
          icon={User}
          gradient="from-blue-500/90 via-indigo-500/80 to-violet-500/90"
          accent="text-blue-100"
        />
        <KpiCard
          label="MENUNGGU VERIFIKASI"
          description="Total Pending"
          value={stats.pending}
          trendLabel="Antrian"
          trendValue={stats.pending}
          icon={Clock}
          gradient="from-amber-400/90 via-amber-500/80 to-orange-500/90"
          accent="text-amber-100"
        />
        <KpiCard
          label="SUDAH DIVERIFIKASI"
          description="Selesai Proses"
          value={stats.verified}
          trendLabel="Total Selesai"
          trendValue={stats.verified}
          icon={CheckCircle2}
          gradient="from-emerald-400/90 via-emerald-500/80 to-teal-500/90"
          accent="text-emerald-100"
        />
        <KpiCard
          label="DITOLAK"
          description="Tidak Memenuhi Syarat"
          value={stats.rejected}
          trendLabel="Ditolak"
          trendValue={stats.rejected}
          icon={XCircle}
          gradient="from-rose-500/95 via-red-500/90 to-red-600/95"
          accent="text-rose-100"
        />
        <KpiCard
          label="DRAFT"
          description="Perlu Dilanjutkan"
          value={stats.draft}
          trendLabel="Draft"
          trendValue={stats.draft}
          icon={ClipboardList}
          gradient="from-slate-500/90 via-slate-600/80 to-slate-700/90"
          accent="text-slate-100"
        />
      </div>

      {/* Draft Section */}
      {stats.draft > 0 && (
        <div className="bg-white/90 dark:bg-slate-950/70 border border-slate-200/70 dark:border-slate-800 rounded-2xl shadow-[0_18px_45px_rgba(15,23,42,0.12)] overflow-hidden mb-6">
            <div className="px-4 md:px-6 py-4 border-b border-slate-200/70 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-slate-500/10 flex items-center justify-center text-slate-500">
                <ClipboardList size={18} />
                </div>
                <div>
                <h3 className="text-sm md:text-base font-semibold text-slate-900 dark:text-slate-50">
                    Draft Pendaftaran
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                    Lanjutkan input data yang belum selesai.
                </p>
                </div>
            </div>
            </div>

            <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-slate-50/80 dark:bg-slate-900/80 border-b border-slate-200/70 dark:border-slate-800">
                <tr>
                    <th className="px-4 py-3 md:px-6 md:py-4 text-[11px] font-semibold text-slate-500 uppercase tracking-[0.16em]">Nama Lengkap</th>
                    <th className="px-4 py-3 md:px-6 md:py-4 text-[11px] font-semibold text-slate-500 uppercase tracking-[0.16em]">Terakhir Diupdate</th>
                    <th className="px-4 py-3 md:px-6 md:py-4 text-[11px] font-semibold text-slate-500 uppercase tracking-[0.16em] text-right">Aksi</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {students.filter(s => s.status === 'Draft').map((student) => (
                    <tr key={student.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-900/70 transition-colors">
                        <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                                {student.photo_path ? (
                                    <img src={`/${student.photo_path.replace(/\\/g, '/')}`} alt="" className="w-8 h-8 rounded-full object-cover" />
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400"><User size={14} /></div>
                                )}
                                <span className="text-sm font-semibold text-slate-900 dark:text-slate-50">{student.full_name || 'Tanpa Nama'}</span>
                            </div>
                        </td>
                        <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap text-xs text-slate-500">
                            {new Date(student.updated_at || student.created_at).toLocaleDateString('id-ID')}
                        </td>
                        <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap text-right">
                        <button
                            onClick={() => navigate(`/staff/input-student/${student.id}`)}
                            className="inline-flex items-center justify-center px-3 py-1.5 rounded-full border border-slate-200 bg-slate-50 text-slate-700 text-xs font-semibold hover:bg-slate-100 transition-colors"
                        >
                            Lanjutkan
                        </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        </div>
      )}

      <div className="bg-white/90 dark:bg-slate-950/70 border border-slate-200/70 dark:border-slate-800 rounded-2xl shadow-[0_18px_45px_rgba(15,23,42,0.12)] overflow-hidden">
        <div className="px-4 md:px-6 py-4 border-b border-slate-200/70 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
              <ClipboardList size={18} />
            </div>
            <div>
              <h3 className="text-sm md:text-base font-semibold text-slate-900 dark:text-slate-50">
                Antrian Verifikasi
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Daftar pendaftar yang perlu segera diverifikasi.
              </p>
            </div>
          </div>
          <button 
            onClick={() => navigate('/admin/students?status=Menunggu Verifikasi')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 flex items-center gap-1"
          >
            Lihat Semua Antrian <ChevronRight size={14} />
          </button>
        </div>

        {loading ? (
            <div className="p-6 text-center text-slate-500">Memuat data...</div>
        ) : (
            <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-slate-50/80 dark:bg-slate-900/80 border-b border-slate-200/70 dark:border-slate-800">
                <tr>
                    <th className="px-4 py-3 md:px-6 md:py-4 text-[11px] font-semibold text-slate-500 uppercase tracking-[0.16em]">Nama Lengkap</th>
                    <th className="px-4 py-3 md:px-6 md:py-4 text-[11px] font-semibold text-slate-500 uppercase tracking-[0.16em]">No. Registrasi</th>
                    <th className="px-4 py-3 md:px-6 md:py-4 text-[11px] font-semibold text-slate-500 uppercase tracking-[0.16em]">Tanggal Daftar</th>
                    <th className="px-4 py-3 md:px-6 md:py-4 text-[11px] font-semibold text-slate-500 uppercase tracking-[0.16em] text-right">Aksi</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredStudents.length > 0 ? (
                    filteredStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-900/70 transition-colors">
                        <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                                {student.photo_path ? (
                                    <img src={`/${student.photo_path.replace(/\\/g, '/')}`} alt="" className="w-8 h-8 rounded-full object-cover" />
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400"><User size={14} /></div>
                                )}
                                <span className="text-sm font-semibold text-slate-900 dark:text-slate-50">{student.full_name}</span>
                            </div>
                        </td>
                        <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap text-xs font-mono text-slate-600 dark:text-slate-400">
                            {student.registration_number}
                        </td>
                        <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap text-xs text-slate-500">
                            {new Date(student.created_at).toLocaleDateString('id-ID')}
                        </td>
                        <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap text-right">
                        <button
                            onClick={() => navigate(`/admin/student/${student.id}`)}
                            className="inline-flex items-center justify-center px-3 py-1.5 rounded-full border border-indigo-200 bg-indigo-50 text-indigo-700 text-xs font-semibold hover:bg-indigo-100 transition-colors"
                        >
                            Verifikasi
                        </button>
                        </td>
                    </tr>
                    ))
                ) : (
                    <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-slate-500 text-sm">
                        Tidak ada antrian verifikasi saat ini. Kerja bagus!
                    </td>
                    </tr>
                )}
                </tbody>
            </table>
            </div>
        )}
      </div>
    </div>
  );
};

export default StaffDashboard;
