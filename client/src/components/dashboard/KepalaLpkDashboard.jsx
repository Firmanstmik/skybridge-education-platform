import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toPng } from 'html-to-image';
import { toast } from 'react-hot-toast';
import KpiCard from './KpiCard';
import { 
  Users, CheckCircle2, XCircle, TrendingUp, BarChart3, PieChart, 
  ArrowUpRight, ArrowDownRight, Activity, Calendar, Download
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart as RechartsPieChart, Pie, Cell, Legend, LabelList 
} from 'recharts';

const KepalaLpkDashboard = () => {
  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState({ 
    totalMonth: 0, 
    accepted: 0, 
    rejected: 0, 
    passRate: 0,
    monthTrend: [],
    statusDistribution: []
  });
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
             const textWhite = clonedNode.querySelectorAll('.dark\\:text-white');
             textWhite.forEach(el => {
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
        link.download = `Laporan-Eksklusif-LPK-${new Date().getFullYear()}.png`;
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
    fetchData();
  }, []);

  const fetchData = async () => {
    const token = localStorage.getItem('token');
    try {
      setLoading(true);
      // Fetch stats from server
      const { data: statsData } = await axios.get('/api/students/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Map server response to state
      const trendData = statsData.trends.map(t => ({
          name: t.month,
          pendaftar: t.count
      }));

      setStats({ 
        totalMonth: statsData.totalMonth, 
        accepted: statsData.totalAccepted, 
        rejected: statsData.totalRejected, 
        passRate: statsData.graduationRate,
        monthTrend: trendData,
        statusDistribution: statsData.statusDistribution
      });

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 pb-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <p className="text-xs font-bold tracking-[0.2em] text-indigo-600 dark:text-indigo-400 uppercase mb-2">
            Executive Overview / エグゼクティブ
          </p>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Dashboard Kepala LPK
          </h1>
          <p className="mt-2 text-slate-500 dark:text-slate-400 text-sm max-w-2xl">
            Monitoring kinerja pendaftaran, persetujuan akhir, dan analisis tren penerimaan siswa secara real-time.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="px-3 py-1.5 text-xs font-medium text-slate-500 bg-slate-100 dark:bg-slate-800 rounded-lg">
            Terakhir diupdate: {new Date().toLocaleTimeString('id-ID', { timeZone: 'Asia/Makassar' })} WITA
          </span>
          <button 
            onClick={fetchData} 
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 transition-colors"
            title="Refresh Data"
          >
            <Activity size={16} />
          </button>
        </div>
      </div>

      {/* KPI Cards Section - Premium Larger Padding */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <KpiCard
          label="PENDAFTAR BULAN INI"
          description="Total Masuk Periode Ini"
          value={stats.totalMonth}
          trendLabel="vs Bulan Lalu"
          trendValue={stats.totalMonth} // Placeholder trend logic
          icon={Calendar}
          gradient="from-violet-600 via-indigo-600 to-blue-600"
          accent="text-white"
        />
        <KpiCard
          label="TOTAL DITERIMA"
          description="Akumulasi Kelulusan"
          value={stats.accepted}
          trendLabel="Siswa Sah"
          trendValue={stats.accepted}
          icon={CheckCircle2}
          gradient="from-emerald-500 via-teal-500 to-cyan-500"
          accent="text-white"
        />
        <KpiCard
          label="TOTAL DITOLAK"
          description="Tidak Memenuhi Kriteria"
          value={stats.rejected}
          trendLabel="Gagal Seleksi"
          trendValue={stats.rejected}
          icon={XCircle}
          gradient="from-rose-500 via-red-500 to-orange-500"
          accent="text-white"
        />
        <KpiCard
          label="PERSENTASE KELULUSAN"
          description="Rasio Diterima vs Total"
          value={`${stats.passRate}%`}
          trendLabel="Efisiensi Seleksi"
          trendValue={stats.passRate}
          icon={TrendingUp}
          gradient="from-amber-400 via-orange-500 to-red-500"
          accent="text-white"
        />
      </div>

      {/* Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Monthly Trend Chart */}
        <div ref={chartRef} className="lg:col-span-2 bg-white dark:bg-slate-950 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-[0_10px_30px_rgba(0,0,0,0.04)] relative overflow-hidden group">
          {/* Decorative background glow */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all duration-1000"></div>
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 relative z-10">
            <div>
              <h4 className="text-xs font-bold tracking-[0.2em] text-indigo-500 uppercase mb-2">
                GRAFIK BULANAN
              </h4>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Pendaftar per Bulan
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                Visualisasi tren pendaftaran siswa baru periode Januari - Desember {new Date().getFullYear()}.
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center gap-2">
              <div className="px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold">
                Tahun {new Date().getFullYear()}
              </div>
              <button 
                onClick={handleDownloadChart}
                className="no-print p-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-500/20 transition-all hover:scale-105 active:scale-95 flex items-center justify-center"
                title="Download Laporan Grafik"
              >
                <Download size={16} />
              </button>
            </div>
          </div>

          <div className="h-[350px] w-full relative z-10">
            {/* Hidden Report Footer for Export */}
            <div className="report-footer hidden flex-col w-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-slate-900">Laporan Statistik Pendaftaran</h2>
                <p className="text-sm text-slate-500">Dibuat pada: {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
              <div className="grid grid-cols-4 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Total Pendaftar</p>
                  <p className="text-2xl font-bold text-indigo-600 mt-1">{stats.totalMonth}</p>
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
                  <p className="text-xs text-amber-600 uppercase tracking-wider font-semibold">Kelulusan</p>
                  <p className="text-2xl font-bold text-amber-700 mt-1">{stats.passRate}%</p>
                </div>
              </div>
              <div className="mt-6 text-center text-xs text-slate-400">
                &copy; {new Date().getFullYear()} SKYBRIDGE. Dokumen ini dibuat secara otomatis oleh sistem.
              </div>
            </div>

            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.monthTrend} margin={{ top: 30, right: 30, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPendaftar" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                  <filter id="shadow" height="200%">
                    <feDropShadow dx="0" dy="5" stdDeviation="5" floodColor="#6366f1" floodOpacity="0.3"/>
                  </filter>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" strokeOpacity={0.5} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={({ x, y, payload }) => {
                    const dataPoint = stats.monthTrend.find(d => d.name === payload.value);
                    const count = dataPoint ? dataPoint.pendaftar : 0;
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
                  tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }} 
                  dx={-10}
                  allowDecimals={false}
                />
                <Tooltip 
                  cursor={{ stroke: '#6366f1', strokeWidth: 1, strokeDasharray: '5 5' }}
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-xl border border-slate-100 dark:border-slate-800">
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                            <p className="text-lg font-bold text-slate-900 dark:text-white">
                              {payload[0].value} <span className="text-xs font-normal text-slate-500">Siswa</span>
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
                  dataKey="pendaftar" 
                  stroke="#6366f1" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorPendaftar)" 
                  filter="url(#shadow)"
                  activeDot={{ r: 8, strokeWidth: 0, fill: '#4f46e5' }}
                  animationDuration={1000}
                >
                </Area>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution Chart */}
        <div className="bg-white dark:bg-slate-950 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <PieChart className="text-emerald-500" size={20} />
              Distribusi Status
            </h3>
            <p className="text-xs text-slate-500 mt-1">Komposisi status siswa saat ini</p>
          </div>
          <div className="h-[300px] w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={stats.statusDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {stats.statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    borderRadius: '12px', 
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)', 
                    border: 'none',
                    padding: '8px 12px'
                  }}
                  itemStyle={{ color: '#1e293b', fontWeight: 600, fontSize: '13px' }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  iconType="circle"
                  iconSize={8}
                  formatter={(value) => <span className="text-slate-500 text-xs ml-1 font-medium">{value}</span>}
                />
              </RechartsPieChart>
            </ResponsiveContainer>
            {/* Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
              <span className="text-3xl font-bold text-slate-800 dark:text-slate-100">
                {stats.statusDistribution.reduce((acc, curr) => acc + curr.value, 0)}
              </span>
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Total</span>
            </div>
          </div>
        </div>

        {/* Comparison Chart (Diterima vs Ditolak) */}
        <div className="lg:col-span-3 bg-white dark:bg-slate-950 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <BarChart3 className="text-rose-500" size={20} />
                        Perbandingan Kelulusan
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">Komparasi langsung antara siswa diterima dan ditolak</p>
                </div>
            </div>
            <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        layout="vertical"
                        data={[
                            { name: 'Diterima', value: stats.accepted, fill: '#10B981' }, // Emerald
                            { name: 'Ditolak', value: stats.rejected, fill: '#EF4444' }, // Red
                        ]}
                        margin={{ top: 0, right: 30, left: 20, bottom: 5 }}
                        barSize={40}
                    >
                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                        <XAxis type="number" hide />
                        <YAxis 
                            dataKey="name" 
                            type="category" 
                            axisLine={false} 
                            tickLine={false}
                            tick={{ fill: '#64748b', fontSize: 13, fontWeight: 600 }}
                            width={100}
                        />
                        <Tooltip
                            cursor={{ fill: 'transparent' }}
                            contentStyle={{ 
                                backgroundColor: '#fff', 
                                borderRadius: '12px', 
                                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)', 
                                border: 'none',
                                padding: '8px 12px'
                            }}
                        />
                        <Bar dataKey="value" radius={[0, 10, 10, 0]}>
                            <Cell fill="#10B981" />
                            <Cell fill="#EF4444" />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
      </div>

      {/* Recent Activity / Actions Section */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 shadow-xl text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold mb-2">Perlu Persetujuan Akhir?</h3>
            <p className="text-slate-300 text-sm max-w-md">
              Tinjau kandidat yang telah diverifikasi oleh staff dan menunggu keputusan final dari Kepala LPK.
            </p>
          </div>
          <button 
            onClick={() => navigate('/admin/students?status=Terverifikasi')}
            className="px-6 py-3 bg-white text-slate-900 font-bold rounded-xl shadow-lg hover:bg-slate-50 hover:scale-105 transition-all duration-300 flex items-center gap-2"
          >
            Buka Halaman Approval <ArrowUpRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default KepalaLpkDashboard;
