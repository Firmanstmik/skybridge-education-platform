import { useEffect, useMemo, useState, useRef } from 'react';
import axios from 'axios';
import { toPng } from 'html-to-image';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { 
    Users, 
    CheckCircle, 
    XCircle, 
    Clock, 
    Search,
    User,
    GraduationCap,
    ClipboardList,
    Award,
    FileX,
    ArrowUpRight,
    ArrowDownRight,
    ChevronRight,
    QrCode,
    Download
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LabelList 
} from 'recharts';
import { motion } from 'framer-motion';
import KpiCard from './KpiCard';

const SuperAdminDashboard = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, accepted: 0, rejected: 0 });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const chartRef = useRef(null);

  const handleDownloadChart = async () => {
    if (chartRef.current) {
      const loadingToast = toast.loading('Menyiapkan Laporan Grafik Premium...');
      try {
        // Wait for animation to complete (longer delay for labels)
        await new Promise(resolve => setTimeout(resolve, 1500));

        const dataUrl = await toPng(chartRef.current, {
          cacheBust: true,
          pixelRatio: 3, // HD Quality
          backgroundColor: '#ffffff',
          filter: (node) => !node.classList?.contains('no-print'),
          onClone: (clonedNode) => {
             // 1. Force text colors for white background
             const textWhite = clonedNode.querySelectorAll('.dark\\:text-slate-50');
             textWhite.forEach(el => {
                el.style.color = '#0f172a'; // slate-900
                el.style.textShadow = 'none';
             });
             
             const textWhite2 = clonedNode.querySelectorAll('.dark\\:text-white');
             textWhite2.forEach(el => {
                el.style.color = '#0f172a'; // slate-900
                el.style.textShadow = 'none';
             });
 
             const textSlate400 = clonedNode.querySelectorAll('.dark\\:text-slate-400');
             textSlate400.forEach(el => {
                el.style.color = '#64748b'; // slate-500
             });

             // 2. Show the hidden report footer
             const reportFooter = clonedNode.querySelector('.report-footer');
             if (reportFooter) {
                reportFooter.style.display = 'flex';
                reportFooter.style.marginTop = '20px';
                reportFooter.style.paddingTop = '20px';
                reportFooter.style.borderTop = '1px solid #e2e8f0';
             }

             // 3. Add Premium Border to container
             clonedNode.style.padding = '40px';
             clonedNode.style.borderRadius = '0';
          }
        });
        
        const link = document.createElement('a');
        link.download = `Laporan-Eksklusif-Admin-${new Date().getFullYear()}.png`;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast.success('Laporan berhasil didownload!', { id: loadingToast });
      } catch (err) {
        console.error("Download failed:", err);
        toast.error('Gagal mendownload grafik', { id: loadingToast });
      }
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    let result = students;

    if (filterStatus !== 'All') {
        result = result.filter(s => s.status === filterStatus);
    }

    if (searchTerm) {
        const lower = searchTerm.toLowerCase();
        result = result.filter(s => 
            s.full_name.toLowerCase().includes(lower) || 
            s.registration_number.toLowerCase().includes(lower)
        );
    }

    const limited = result.slice(0, 6);
    setFilteredStudents(limited);
  }, [students, filterStatus, searchTerm]);

  const fetchStudents = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        navigate('/admin/login');
        return;
    }
    try {
      setLoading(true);
      const { data } = await axios.get('/api/students', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStudents(data);
      setFilteredStudents(data.slice(0, 6));
      
      const total = data.length;
      const pending = data.filter(s => s.status === 'Menunggu Verifikasi').length;
      const accepted = data.filter(s => s.status === 'Diterima').length;
      const rejected = data.filter(s => s.status === 'Ditolak').length;
      
      setStats({ total, pending, accepted, rejected });
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 401) {
          localStorage.removeItem('token');
          navigate('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const todayStats = useMemo(() => {
    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const startOfWeek = new Date(startOfToday);
    startOfWeek.setDate(startOfWeek.getDate() - 6);

    let todayCount = 0;
    let weekCount = 0;

    students.forEach((s) => {
      const created = new Date(s.created_at);
      if (created >= startOfToday) todayCount += 1;
      if (created >= startOfWeek) weekCount += 1;
    });

    return { today: todayCount, week: weekCount };
  }, [students]);

  const monthlyData = useMemo(() => {
    const currentYear = new Date().getFullYear();
    // 1. Group students by month
    const map = new Map();
    students.forEach((s) => {
      const date = new Date(s.created_at);
      if (date.getFullYear() === currentYear) {
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        if (!map.has(key)) map.set(key, 0);
        map.set(key, map.get(key) + 1);
      }
    });

    // 2. Generate Jan - Dec
    const result = [];
    for (let i = 0; i < 12; i++) {
      const d = new Date(currentYear, i, 1);
      const key = `${currentYear}-${String(i + 1).padStart(2, '0')}`;
      const label = d.toLocaleDateString('id-ID', { month: 'short' });
      
      result.push({
        label,
        count: map.get(key) || 0
      });
    }
    return result;
  }, [students]);

  const totalForChart = monthlyData.reduce((sum, m) => sum + m.count, 0) || 1;

  const statusTotal = stats.total || 1;
  const acceptedPct = Math.round((stats.accepted / statusTotal) * 100);
  const pendingPct = Math.round((stats.pending / statusTotal) * 100);
  const rejectedPct = Math.round((stats.rejected / statusTotal) * 100);
  const otherPct = Math.max(0, 100 - acceptedPct - pendingPct - rejectedPct);

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <p className="text-[11px] md:text-xs font-semibold tracking-[0.22em] text-slate-500 uppercase">
            Dashboard Overview / 管理パネル
          </p>
          <h1 className="mt-1 text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-50">
            Ringkasan Pendaftar Program Jepang
          </h1>
          <p className="mt-1 text-xs md:text-sm text-slate-500 dark:text-slate-400">
            Monitoring realtime jumlah pendaftar, status seleksi, dan aktivitas terbaru.
          </p>
        </div>
        <div className="flex items-center gap-3 md:gap-4">
          <div className="px-3 py-2 rounded-2xl bg-white/80 dark:bg-slate-900/70 border border-slate-200/70 dark:border-slate-800 shadow-sm flex items-center gap-3">
            <div>
              <p className="text-[11px] text-slate-500">Hari ini</p>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                {todayStats.today} pendaftar baru
              </p>
            </div>
            <div className="h-9 w-px bg-slate-200/80 dark:bg-slate-800" />
            <div>
              <p className="text-[11px] text-slate-500">7 hari terakhir</p>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                {todayStats.week} pendaftar
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
        <KpiCard
          label="TOTAL"
          description="Pendaftar Masuk"
          value={stats.total}
          trendLabel="+ Hari ini"
          trendValue={todayStats.today}
          icon={GraduationCap}
          gradient="from-sky-500/90 via-blue-500/80 to-indigo-500/90"
          accent="text-sky-100"
        />
        <KpiCard
          label="PENDING"
          description="Menunggu Verifikasi"
          value={stats.pending}
          trendLabel="Dalam antrian"
          trendValue={stats.pending}
          icon={ClipboardList}
          gradient="from-amber-400/90 via-amber-500/80 to-orange-500/90"
          accent="text-amber-100"
        />
        <KpiCard
          label="DITERIMA"
          description="Siswa Aktif"
          value={stats.accepted}
          trendLabel="+ Lolos seleksi"
          trendValue={stats.accepted}
          icon={Award}
          gradient="from-emerald-400/90 via-emerald-500/80 to-teal-500/90"
          accent="text-emerald-100"
        />
        <KpiCard
          label="DITOLAK"
          description="Berkas Tidak Lolos"
          value={stats.rejected}
          trendLabel="Butuh evaluasi"
          trendValue={stats.rejected}
          icon={FileX}
          gradient="from-rose-500/95 via-red-500/90 to-red-600/95"
          accent="text-rose-100"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6">
        <div className="xl:col-span-2 bg-white/90 dark:bg-slate-950/70 border border-slate-200/70 dark:border-slate-800 rounded-2xl shadow-[0_18px_45px_rgba(15,23,42,0.12)] overflow-hidden">
          <div className="px-4 md:px-6 py-4 border-b border-slate-200/70 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500">
                <Users size={18} />
              </div>
              <div>
                <h3 className="text-sm md:text-base font-semibold text-slate-900 dark:text-slate-50">
                  Data Pendaftar Terbaru
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  6 pendaftar terakhir dengan status terbaru.
                </p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-2 md:items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="text"
                  placeholder="Cari pendaftar..."
                  className="pl-9 pr-3 py-2 text-xs md:text-sm border border-slate-200/80 dark:border-slate-700 rounded-full bg-white/80 dark:bg-slate-900/60 focus:outline-none focus:ring-2 focus:ring-red-500/40 focus:border-red-500 w-full md:w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select
                className="px-4 py-2 text-xs md:text-sm border border-slate-200/80 dark:border-slate-700 rounded-full bg-white/80 dark:bg-slate-900/60 focus:outline-none focus:ring-2 focus:ring-red-500/40 focus:border-red-500"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="All">Semua Status</option>
                <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
                <option value="Diterima">Diterima</option>
                <option value="Ditolak">Ditolak</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="p-4 md:p-6 space-y-3">
              {Array.from({ length: 4 }).map((_, idx) => (
                <div
                  key={idx}
                  className="h-14 md:h-16 rounded-xl bg-slate-100/80 dark:bg-slate-900/60 animate-pulse"
                />
              ))}
            </div>
          ) : (
            <>
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50/80 dark:bg-slate-900/80 border-b border-slate-200/70 dark:border-slate-800 sticky top-0 z-10">
                    <tr>
                      <th className="px-4 py-3 md:px-6 md:py-4 text-[11px] font-semibold text-slate-500 uppercase tracking-[0.16em]">
                        Foto
                      </th>
                      <th className="px-4 py-3 md:px-6 md:py-4 text-[11px] font-semibold text-slate-500 uppercase tracking-[0.16em]">
                        Nama Lengkap
                      </th>
                      <th className="px-4 py-3 md:px-6 md:py-4 text-[11px] font-semibold text-slate-500 uppercase tracking-[0.16em]">
                        No. Registrasi
                      </th>
                      <th className="px-4 py-3 md:px-6 md:py-4 text-[11px] font-semibold text-slate-500 uppercase tracking-[0.16em]">
                        Status
                      </th>
                      <th className="px-4 py-3 md:px-6 md:py-4 text-[11px] font-semibold text-slate-500 uppercase tracking-[0.16em] text-right">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredStudents.length > 0 ? (
                      filteredStudents.map((student) => (
                        <tr
                          key={student.id}
                          className="hover:bg-slate-50/80 dark:hover:bg-slate-900/70 transition-colors group"
                        >
                          <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap">
                            {student.photo_path ? (
                              <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-white shadow-sm ring-2 ring-slate-100 dark:ring-slate-700">
                                <img
                                  src={`/${student.photo_path.replace(/\\/g, '/')}`}
                                  alt="Foto"
                                  className="h-full w-full object-cover"
                                />
                              </div>
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                                <User size={20} />
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap">
                            <div className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                              {student.full_name}
                            </div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400">
                              {new Date(student.created_at).toLocaleDateString('id-ID')}
                            </div>
                          </td>
                          <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap">
                            <span className="font-mono text-xs bg-slate-100 dark:bg-slate-900 px-2.5 py-1 rounded-full text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700">
                              {student.registration_number}
                            </span>
                          </td>
                          <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap">
                            <StatusBadge status={student.status} />
                          </td>
                          <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap text-right">
                            <button
                              type="button"
                              onClick={() => navigate(`/admin/student/${student.id}`)}
                              className="inline-flex items-center justify-center px-3 py-1.5 rounded-full border border-slate-200/80 dark:border-slate-700 bg-white/90 dark:bg-slate-900/80 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-red-500 hover:text-red-500 transition-all gap-1"
                            >
                              <span>Detail</span>
                              <ChevronRight size={14} />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="px-6 py-10 text-center">
                          <div className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 gap-2">
                            <Search size={40} className="opacity-30" />
                            <p className="text-sm font-medium">Tidak ada data ditemukan</p>
                            <p className="text-xs">
                              Coba ubah filter atau kata kunci pencarian.
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="md:hidden px-4 pb-4 pt-1 space-y-3">
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => (
                    <MobileStudentCard
                      key={student.id}
                      student={student}
                      onDetail={() => navigate(`/admin/student/${student.id}`)}
                    />
                  ))
                ) : (
                  <div className="py-6 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 gap-2">
                    <Search size={40} className="opacity-30" />
                    <p className="text-sm font-medium">Belum ada data pendaftar</p>
                    <p className="text-xs text-center">
                      Data pendaftar terbaru akan muncul di sini setelah ada registrasi.
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        <div className="space-y-4 md:space-y-5">
          <div ref={chartRef} className="bg-white/90 dark:bg-slate-950/70 border border-slate-200/70 dark:border-slate-800 rounded-2xl shadow-[0_16px_40px_rgba(15,23,42,0.12)] p-4 md:p-5 relative overflow-hidden group">
            {/* Decorative background glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all duration-1000"></div>
            
            <div className="flex items-center justify-between mb-4 relative z-10">
              <div>
                <p className="text-[11px] font-semibold tracking-[0.18em] text-indigo-500 uppercase">
                  GRAFIK BULANAN
                </p>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-50 mt-1">
                  Pendaftar per Bulan
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-100 dark:border-indigo-800 text-[10px] font-semibold text-indigo-700 dark:text-indigo-300">
                  Tahun {new Date().getFullYear()}
                </span>
                <button
                  onClick={handleDownloadChart}
                  className="no-print p-1.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg shadow-sm transition-all flex items-center justify-center"
                  title="Download Grafik"
                >
                  <Download size={14} />
                </button>
              </div>
            </div>

            <div className="h-[200px] w-full relative z-10">
            {/* Hidden Report Footer for Export */}
            <div className="report-footer hidden flex-col w-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-slate-900">Laporan Statistik Pendaftaran</h2>
                <p className="text-sm text-slate-500">Dibuat pada: {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
              <div className="grid grid-cols-4 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Total Pendaftar</p>
                  <p className="text-2xl font-bold text-indigo-600 mt-1">{stats.total}</p>
                </div>
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                  <p className="text-xs text-emerald-600 uppercase tracking-wider font-semibold">Diterima</p>
                  <p className="text-2xl font-bold text-emerald-700 mt-1">{stats.accepted}</p>
                </div>
                <div className="p-4 bg-rose-50 rounded-xl border border-rose-100">
                  <p className="text-xs text-rose-600 uppercase tracking-wider font-semibold">Ditolak</p>
                  <p className="text-2xl font-bold text-rose-700 mt-1">{stats.rejected}</p>
                </div>
                <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                  <p className="text-xs text-amber-600 uppercase tracking-wider font-semibold">Pending</p>
                  <p className="text-2xl font-bold text-amber-700 mt-1">{stats.pending}</p>
                </div>
              </div>
              <div className="mt-6 text-center text-xs text-slate-400">
                &copy; {new Date().getFullYear()} SKYBRIDGE. Dokumen ini dibuat secara otomatis oleh sistem.
              </div>
            </div>
            
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData} margin={{ top: 5, right: 25, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPendaftarSuper" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  <filter id="shadowSuper" height="200%">
                    <feDropShadow dx="0" dy="5" stdDeviation="5" floodColor="#6366f1" floodOpacity="0.3"/>
                  </filter>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" strokeOpacity={0.5} />
                  <XAxis 
                  dataKey="label" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={({ x, y, payload }) => {
                    const dataPoint = monthlyData.find(d => d.label === payload.value);
                    const count = dataPoint ? dataPoint.count : 0;
                    return (
                      <g transform={`translate(${x},${y})`}>
                        <text x={0} y={0} dy={16} textAnchor="middle" fill="#94a3b8" fontSize={12} fontWeight={500}>
                          {payload.value}
                        </text>
                        <text x={0} y={0} dy={35} textAnchor="middle" fill="#6366f1" fontSize={12} fontWeight="bold">
                          {count}
                        </text>
                      </g>
                    );
                  }}
                  dy={10}
                  interval={0}
                  height={60}
                />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 500 }} 
                    dx={-5}
                  />
                  <Tooltip 
                    cursor={{ stroke: '#6366f1', strokeWidth: 1, strokeDasharray: '5 5' }}
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white dark:bg-slate-900 p-3 rounded-xl shadow-xl border border-slate-100 dark:border-slate-800">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
                            <div className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                              <p className="text-sm font-bold text-slate-900 dark:text-white">
                                {payload[0].value} <span className="text-[10px] font-normal text-slate-500">Siswa</span>
                              </p>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#6366f1" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorPendaftarSuper)" 
                  filter="url(#shadowSuper)"
                  activeDot={{ r: 8, strokeWidth: 0, fill: '#4f46e5' }}
                  animationDuration={1000}
                >
                </Area>
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white/90 dark:bg-slate-950/70 border border-slate-200/70 dark:border-slate-800 rounded-2xl shadow-[0_16px_40px_rgba(15,23,42,0.12)] p-4 md:p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-[11px] font-semibold tracking-[0.18em] text-slate-500 uppercase">
                  Distribusi Status
                </p>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                  Komposisi Pendaftar
                </h3>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative h-24 w-24 md:h-28 md:w-28">
                <div
                  className="h-full w-full rounded-full"
                  style={{
                    background: `conic-gradient(#22c55e 0 ${acceptedPct}%, #f97316 ${acceptedPct}% ${
                      acceptedPct + pendingPct
                    }%, #ef4444 ${acceptedPct + pendingPct}% ${
                      acceptedPct + pendingPct + rejectedPct
                    }%, #0ea5e9 ${acceptedPct + pendingPct + rejectedPct}% 100%)`,
                  }}
                />
                <div className="absolute inset-2.5 md:inset-3 rounded-full bg-white dark:bg-slate-950 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">Total</p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                      {stats.total}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex-1 space-y-2">
                <DonutLegend
                  color="bg-emerald-500"
                  label="Diterima"
                  value={stats.accepted}
                  percentage={acceptedPct}
                />
                <DonutLegend
                  color="bg-amber-500"
                  label="Pending"
                  value={stats.pending}
                  percentage={pendingPct}
                />
                <DonutLegend
                  color="bg-rose-500"
                  label="Ditolak"
                  value={stats.rejected}
                  percentage={rejectedPct}
                />
                {otherPct > 0 && (
                  <DonutLegend
                    color="bg-sky-500"
                    label="Lainnya"
                    value={Math.max(0, stats.total - stats.accepted - stats.pending - stats.rejected)}
                    percentage={otherPct}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => navigate('/admin/scan')}
        className="md:hidden fixed bottom-16 right-4 z-30 inline-flex items-center justify-center px-4 py-3 rounded-full shadow-lg shadow-red-500/40 bg-gradient-to-r from-red-500 via-rose-500 to-red-600 text-white text-sm font-semibold gap-2 active:scale-[0.97] transition-transform"
      >
        <QrCode size={18} />
        <span>Scan QR Pendaftar</span>
      </button>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  if (status === 'Diterima') {
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/40">
        <CheckCircle size={14} />
        <span>Diterima</span>
      </span>
    );
  }
  if (status === 'Ditolak') {
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:border-rose-500/40">
        <XCircle size={14} />
        <span>Ditolak</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/40">
      <Clock size={14} />
      <span>Menunggu Verifikasi</span>
    </span>
  );
};

const MobileStudentCard = ({ student, onDetail }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-950/80 shadow-sm px-3 py-3 flex gap-3"
    >
      <div className="flex-shrink-0">
        {student.photo_path ? (
          <div className="h-11 w-11 rounded-full overflow-hidden border-2 border-white shadow-sm ring-2 ring-slate-100 dark:ring-slate-700">
            <img
              src={`/${student.photo_path.replace(/\\/g, '/')}`}
              alt={student.full_name}
              className="h-full w-full object-cover"
            />
          </div>
        ) : (
          <div className="h-11 w-11 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
            <User size={20} />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-50 truncate">
            {student.full_name}
          </p>
          <StatusBadge status={student.status} />
        </div>
        <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
          {new Date(student.created_at).toLocaleDateString('id-ID')}
        </p>
        <p className="mt-1 text-[11px] font-mono px-2 py-0.5 inline-flex rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-200">
          {student.registration_number}
        </p>
        <div className="mt-2 flex justify-end">
          <button
            type="button"
            onClick={onDetail}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-semibold bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
          >
            <span>Detail</span>
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const DonutLegend = ({ color, label, value, percentage }) => {
  return (
    <div className="flex items-center justify-between gap-2 text-[11px]">
      <div className="flex items-center gap-2">
        <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
        <span className="text-slate-600 dark:text-slate-300">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="font-semibold text-slate-900 dark:text-slate-50">{value}</span>
        <span className="text-slate-400 dark:text-slate-500">{percentage}%</span>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
