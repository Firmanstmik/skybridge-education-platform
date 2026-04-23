import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { 
    LayoutDashboard, 
    QrCode, 
    LogOut, 
    Menu,
    X,
    User,
    UserPlus,
    Bell,
    Search,
    SunMedium,
    Moon,
    Users,
    Clock,
    FileText,
    GraduationCap,
    School,
    CalendarDays,
    ClipboardCheck,
    Award,
    NotebookPen,
    BarChart3,
    Printer,
    CalendarRange,
    BookOpen,
    ChevronDown
} from 'lucide-react';
import { BsFileEarmarkPdfFill, BsFileEarmarkExcelFill } from 'react-icons/bs';
import Logo from '../assets/img/SKYBRIDGE_LOGO.webp';
import axios from 'axios';

const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isAcademicMenuOpen, setIsAcademicMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('admin-theme') === 'dark';
  });
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [currentTime, setCurrentTime] = useState(() => new Date());
  const [userRole, setUserRole] = useState(() => {
    if (typeof window === 'undefined') return null;
    const token = localStorage.getItem('token');
    if (token) {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.role;
        } catch (e) {
            console.error('Failed to parse token', e);
        }
    }
    return null;
  });
  const [userInfo, setUserInfo] = useState(() => {
    if (typeof window === 'undefined') return null;
    const token = localStorage.getItem('token');
    if (token) {
        try {
            return JSON.parse(atob(token.split('.')[1]));
        } catch (e) {
            console.error('Failed to parse token info', e);
        }
    }
    return null;
  });
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const updateBottomOffset = () => {
      const vv = window.visualViewport;
      if (!vv) {
        document.documentElement.style.setProperty('--vv-bottom', '0px');
        return;
      }

      const layoutHeight = document.documentElement.clientHeight || window.innerHeight || 0;
      const rawOffset = Math.max(0, layoutHeight - (vv.height + vv.offsetTop));
      const bottomOffset = Math.min(120, rawOffset);
      document.documentElement.style.setProperty('--vv-bottom', `${Math.round(bottomOffset)}px`);
    };

    updateBottomOffset();

    const vv = window.visualViewport;
    vv?.addEventListener('resize', updateBottomOffset);
    vv?.addEventListener('scroll', updateBottomOffset);
    window.addEventListener('resize', updateBottomOffset);
    window.addEventListener('orientationchange', updateBottomOffset);

    let rafId = 0;
    let frame = 0;
    const rafLoop = () => {
      updateBottomOffset();
      frame += 1;
      if (frame < 10) rafId = window.requestAnimationFrame(rafLoop);
    };
    rafId = window.requestAnimationFrame(rafLoop);
    const t1 = window.setTimeout(updateBottomOffset, 250);
    const t2 = window.setTimeout(updateBottomOffset, 800);

    const onVisibility = () => {
      if (!document.hidden) updateBottomOffset();
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      vv?.removeEventListener('resize', updateBottomOffset);
      vv?.removeEventListener('scroll', updateBottomOffset);
      window.removeEventListener('resize', updateBottomOffset);
      window.removeEventListener('orientationchange', updateBottomOffset);
      document.removeEventListener('visibilitychange', onVisibility);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.cancelAnimationFrame(rafId);
      document.documentElement.style.setProperty('--vv-bottom', '0px');
    };
  }, []);

  const [profileData, setProfileData] = useState({
    full_name: userInfo?.full_name || '',
    username: userInfo?.username || '',
    newPassword: '',
    confirmPassword: ''
  });

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Update profileData when userInfo changes or modal opens
  useEffect(() => {
    if (userInfo) {
      setProfileData(prev => ({
        ...prev,
        full_name: userInfo.full_name || '',
        username: userInfo.username || ''
      }));
    }
  }, [userInfo, isProfileModalOpen]);

  // Fetch profile from API to ensure correct data per role
  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const { data } = await axios.get('/api/users/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserInfo(data);
    } catch (err) {
      console.error('Failed to fetch profile', err);
    }
  };

  useEffect(() => {
    fetchProfile();
    // also refresh when opening modal to get latest
  }, [isProfileModalOpen]);

  const handleProfileUpdate = async (e) => {
      e.preventDefault();
      if (profileData.newPassword && profileData.newPassword !== profileData.confirmPassword) {
          alert('Password baru tidak cocok!');
          return;
      }

      try {
          const token = localStorage.getItem('token');
          await axios.put('/api/users/me', {
              full_name: profileData.full_name,
              username: profileData.username,
              password: profileData.newPassword
          }, {
              headers: { Authorization: `Bearer ${token}` }
          });
          
          alert('Profil berhasil diperbarui! Silakan login ulang untuk melihat perubahan.');
          setIsProfileModalOpen(false);
          // refresh local profile info
          fetchProfile();
          // Optional: logout user to force re-login and token refresh
          // handleLogout();
      } catch (error) {
          console.error('Update profile failed', error);
          alert('Gagal memperbarui profil: ' + (error.response?.data?.message || error.message));
      }
  };

  const getRoleBasePath = () => {
      if (userRole === 'STAFF') return '/staff';
      if (userRole === 'KEPALA_LPK') return '/kepalalpk';
      return '/admin';
  };

  const getRoleLabel = () => {
      if (userRole === 'STAFF') return 'Staff';
      if (userRole === 'KEPALA_LPK') return 'Kepala LPK';
      return 'Admin';
  };

  const getRoleSubtitle = () => {
      if (userRole === 'STAFF') return 'スタッフ';
      if (userRole === 'KEPALA_LPK') return '校長';
      return '管理';
  };

  const basePath = getRoleBasePath();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearchQuery(params.get('q') || '');
  }, [location.search]);

  const triggerSearch = () => {
    if (searchQuery.trim()) {
      navigate(`${basePath}/students?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      triggerSearch();
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', isDark);
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem('admin-theme', isDark ? 'dark' : 'light');
    }
  }, [isDark]);

  const handleLogout = () => {
      localStorage.removeItem('token');
      if (userRole === 'STAFF') {
        navigate('/staff/login');
      } else if (userRole === 'KEPALA_LPK') {
        navigate('/kepalalpk/login');
      } else {
        navigate('/admin/login');
      }
  };

  const exportExcel = async () => {
      const token = localStorage.getItem('token');
      try {
          const response = await axios.get('/api/students/export/excel', {
              headers: { Authorization: `Bearer ${token}` },
              responseType: 'blob',
          });
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', 'students.xlsx');
          document.body.appendChild(link);
          link.click();
      } catch (error) {
          console.error('Export failed', error);
          alert('Export failed');
      }
  };

  const exportPdf = async () => {
      const token = localStorage.getItem('token');
      try {
          const response = await axios.get('/api/students/export/json', {
              headers: { Authorization: `Bearer ${token}` }
          });
          
          if (!response.data || response.data.length === 0) {
              alert('Tidak ada data untuk diexport');
              return;
          }

          const [{ pdf }, { default: StudentPDF }] = await Promise.all([
            import('@react-pdf/renderer'),
            import('./StudentPDF'),
          ]);

          const blob = await pdf(<StudentPDF students={response.data} />).toBlob();
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', 'formulir-pendaftaran-all.pdf');
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
      } catch (error) {
          console.error('Export PDF failed', error);
          alert('Export PDF failed: ' + error.message);
      }
  };

  const SidebarItem = ({ icon: Icon, label, to, onClick, iconColor, customIconClass, variant = 'default' }) => {
      const active = location.pathname === to;
      const isSub = variant === 'sub';
      const content = (
          <div className={`flex items-center ${isSub ? 'gap-2.5 px-3 py-2' : 'gap-3 px-4 py-2.5'} cursor-pointer rounded-xl transition-all ${
              active 
                ? 'bg-gradient-to-r from-red-500/10 via-red-500/5 to-transparent text-dory-red border border-red-100 dark:border-red-500/40' 
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100/70 dark:hover:bg-slate-800/60 border border-transparent'
          }`}>
              {isSub && (
                <span className={`h-1.5 w-1.5 rounded-full ${active ? 'bg-red-500' : 'bg-slate-300 dark:bg-slate-700'}`} />
              )}
              <Icon 
                size={isSub ? 18 : 20} 
                className={customIconClass || (active ? 'text-dory-red' : 'text-slate-400')} 
                style={iconColor ? { color: iconColor } : {}}
              />
              {!isSidebarCollapsed && (
                <span className={`${isSub ? 'text-[13px]' : 'text-sm'} font-medium truncate`}>{label}</span>
              )}
          </div>
      );

      if (to) return <Link to={to} className="block" onClick={() => setIsSidebarOpen(false)}>{content}</Link>;
      return <div onClick={(e) => { onClick && onClick(e); setIsSidebarOpen(false); }}>{content}</div>;
  };

  return (
    <div className="min-h-[100dvh] flex font-sans bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-slate-900 dark:text-slate-100">
      <div 
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-md md:hidden transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsSidebarOpen(false)}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 md:duration-500 md:static md:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div
          className={`h-full hidden md:flex flex-col backdrop-blur-xl bg-white/90 dark:bg-slate-950/80 border-r border-slate-200/80 dark:border-slate-800 shadow-[0_20px_60px_rgba(15,23,42,0.18)] transition-all duration-500 ${
            isSidebarCollapsed ? 'w-20' : 'w-72'
          }`}
        >
          <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200/70 dark:border-slate-800">
            <Link to="/" className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 rounded-2xl bg-red-500/20 blur-md" />
                <img src={Logo} alt="Logo" className="relative h-9 w-9 rounded-2xl bg-white p-1.5 shadow-md" />
              </div>
              {!isSidebarCollapsed && (
                <div className="flex flex-col">
                  <span className="text-[10px] font-semibold tracking-[0.22em] text-red-500 uppercase">
                    {getRoleLabel()} / {getRoleSubtitle()}
                  </span>
                  <span className="text-base font-bold text-slate-900 dark:text-slate-50">
                    SKYBRIDGE
                  </span>
                </div>
              )}
            </Link>
            <button
              type="button"
              onClick={() => setIsSidebarCollapsed((prev) => !prev)}
              className="hidden md:inline-flex items-center justify-center rounded-full p-2 text-slate-500 hover:text-red-500 hover:bg-slate-100/80 dark:hover:bg-slate-800 transition-colors"
            >
              <LayoutDashboard size={18} />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-3 py-5 space-y-6">
            <div>
              {!isSidebarCollapsed && (
                <p className="px-2 mb-2 text-[11px] font-semibold tracking-[0.22em] text-slate-400 uppercase">
                  Menu Utama
                </p>
              )}
              <div className="space-y-1.5">
                <SidebarItem icon={LayoutDashboard} label="Dashboard" to={`${basePath}/dashboard`} />
                {(userRole === 'STAFF' || userRole === 'SUPER_ADMIN' || userRole === 'superadmin') && (
                    <SidebarItem icon={UserPlus} label="Input Data Siswa" to={`${basePath}/input-student`} />
                )}
                {(userRole === 'STAFF' || userRole === 'SUPER_ADMIN' || userRole === 'superadmin') && (
                    <SidebarItem icon={QrCode} label="Scan QR Code" to={`${basePath}/scan`} />
                )}
              </div>
            </div>

            <div>
              {!isSidebarCollapsed && (
                <p className="px-2 mb-2 text-[11px] font-semibold tracking-[0.22em] text-slate-400 uppercase">
                  Data Pendaftar
                </p>
              )}
              <div className="space-y-1.5">
                <SidebarItem icon={FileText} label="Data Pendaftar" to={`${basePath}/students`} />
              </div>
            </div>

            <div>
              {!isSidebarCollapsed && (
                <p className="px-2 mb-2 text-[11px] font-semibold tracking-[0.22em] text-slate-400 uppercase">
                  Akademik
                </p>
              )}
              <div className="space-y-1.5">
                <button
                  type="button"
                  onClick={() => setIsAcademicMenuOpen((prev) => !prev)}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-2xl transition-all ${
                    isAcademicMenuOpen
                      ? 'bg-white/80 dark:bg-slate-950/40 border border-slate-200/70 dark:border-slate-800/60 shadow-sm'
                      : 'hover:bg-white/70 dark:hover:bg-slate-950/30 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 flex items-center justify-center">
                      <GraduationCap size={18} className="text-slate-500 dark:text-slate-300" />
                    </div>
                    {!isSidebarCollapsed && (
                      <span className="font-medium text-sm truncate text-slate-700 dark:text-slate-200">
                        Akademik
                      </span>
                    )}
                  </div>
                  {!isSidebarCollapsed && (
                    <ChevronDown
                      size={16}
                      className={`text-slate-400 transition-transform ${isAcademicMenuOpen ? 'rotate-180' : ''}`}
                    />
                  )}
                </button>

                {isAcademicMenuOpen && (
                  <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800/60 bg-white/70 dark:bg-slate-950/30 p-2 space-y-2">
                    <div className="rounded-xl bg-slate-50/80 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 px-2 py-2 space-y-1.5">
                      {!isSidebarCollapsed && (
                        <p className="px-2 pt-1 text-[10px] font-semibold tracking-[0.18em] text-slate-400 uppercase">
                          Akademik
                        </p>
                      )}
                      <SidebarItem icon={School} label="Data Kelas" to={`${basePath}/akademik/data-kelas`} variant="sub" />
                      <SidebarItem icon={Users} label="Data Siswa" to={`${basePath}/akademik/data-siswa`} variant="sub" />
                      <SidebarItem icon={CalendarDays} label="Jadwal Mengajar" to={`${basePath}/akademik/jadwal-mengajar`} variant="sub" />
                      <SidebarItem icon={ClipboardCheck} label="Absensi Siswa" to={`${basePath}/akademik/absensi-siswa`} variant="sub" />
                      <SidebarItem icon={Award} label="Nilai Siswa" to={`${basePath}/akademik/nilai-siswa`} variant="sub" />
                      <SidebarItem icon={NotebookPen} label="Jurnal Mengajar" to={`${basePath}/akademik/jurnal-mengajar`} variant="sub" />
                    </div>

                    <div className="rounded-xl bg-slate-50/80 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 px-2 py-2 space-y-1.5">
                      {!isSidebarCollapsed && (
                        <p className="px-2 pt-1 text-[10px] font-semibold tracking-[0.18em] text-slate-400 uppercase">
                          Laporan Akademik
                        </p>
                      )}
                      <SidebarItem icon={BarChart3} label="Rekap Akademik" to={`${basePath}/akademik/rekap-akademik`} variant="sub" />
                      <SidebarItem icon={Printer} label="Cetak Laporan" to={`${basePath}/akademik/cetak-laporan`} variant="sub" />
                    </div>

                    <div className="rounded-xl bg-slate-50/80 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 px-2 py-2 space-y-1.5">
                      {!isSidebarCollapsed && (
                        <p className="px-2 pt-1 text-[10px] font-semibold tracking-[0.18em] text-slate-400 uppercase">
                          Pengaturan Akademik
                        </p>
                      )}
                      <SidebarItem icon={CalendarRange} label="Tahun Ajaran" to={`${basePath}/akademik/tahun-ajaran`} variant="sub" />
                      <SidebarItem icon={BookOpen} label="Kurikulum" to={`${basePath}/akademik/kurikulum`} variant="sub" />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {(userRole === 'SUPER_ADMIN' || userRole === 'superadmin') && (
            <div>
              {!isSidebarCollapsed && (
                <p className="px-2 mb-2 text-[11px] font-semibold tracking-[0.22em] text-slate-400 uppercase">
                  Manajemen User
                </p>
              )}
              <div className="space-y-1.5">
                <SidebarItem icon={Users} label="Manajemen User" to="/admin/users" />
              </div>
            </div>
            )}

            {(userRole === 'KEPALA_LPK' || userRole === 'SUPER_ADMIN' || userRole === 'superadmin') && (
            <div>
              {!isSidebarCollapsed && (
                <p className="px-2 mb-2 text-[11px] font-semibold tracking-[0.22em] text-slate-400 uppercase">
                  Laporan
                </p>
              )}
              <div className="space-y-1.5">
                <SidebarItem 
                    icon={BsFileEarmarkPdfFill} 
                    label="Export PDF" 
                    onClick={exportPdf} 
                    iconColor="#E72F2D"
                    customIconClass="transition-transform hover:scale-110"
                />
                <SidebarItem 
                    icon={BsFileEarmarkExcelFill} 
                    label="Export Excel" 
                    onClick={exportExcel} 
                    iconColor="#1D6F42"
                    customIconClass="transition-transform hover:scale-110"
                />
              </div>
            </div>
            )}

            <div className="mt-auto pt-4 border-t border-slate-200/70 dark:border-slate-800">
              <SidebarItem icon={LogOut} label="Keluar" onClick={handleLogout} />
            </div>
          </nav>
        </div>

        <div className="md:hidden h-full w-72 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border-r border-slate-200/80 dark:border-slate-800 shadow-2xl">
          <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200/70 dark:border-slate-800">
            <Link to="/" className="flex items-center gap-3">
              <img src={Logo} alt="Logo" className="h-9 w-9 rounded-2xl bg-white p-1.5 shadow-md" />
              <div className="flex flex-col">
                <span className="text-[10px] font-semibold tracking-[0.22em] text-red-500 uppercase">
                  {getRoleLabel()}
                </span>
                <span className="text-base font-bold text-slate-900 dark:text-slate-50">
                  Dashboard
                </span>
              </div>
            </Link>
            <button
              type="button"
              onClick={() => setIsSidebarOpen(false)}
              className="inline-flex items-center justify-center rounded-full p-2 text-slate-500 hover:text-red-500 hover:bg-slate-100/80 dark:hover:bg-slate-800 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="px-3 py-4 space-y-4 text-sm">
            <SidebarItem icon={LayoutDashboard} label="Dashboard" to={`${basePath}/dashboard`} />
            {(userRole === 'STAFF' || userRole === 'SUPER_ADMIN' || userRole === 'superadmin') && (
                <SidebarItem icon={UserPlus} label="Input Data Siswa" to={`${basePath}/input-student`} />
            )}
            {(userRole === 'STAFF' || userRole === 'SUPER_ADMIN' || userRole === 'superadmin') && (
                <SidebarItem icon={QrCode} label="Scan QR Code" to={`${basePath}/scan`} />
            )}
            <SidebarItem icon={FileText} label="Data Pendaftar" to={`${basePath}/students`} />

            <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsAcademicMenuOpen((prev) => !prev)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all ${
                  isAcademicMenuOpen
                    ? 'bg-white/80 dark:bg-slate-950/40 border border-slate-200/70 dark:border-slate-800/60 shadow-sm'
                    : 'hover:bg-white/70 dark:hover:bg-slate-950/30'
                }`}
              >
                <span className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 flex items-center justify-center">
                    <GraduationCap size={18} className="text-slate-500 dark:text-slate-300" />
                  </div>
                  <span className="font-semibold text-slate-700 dark:text-slate-200">Akademik</span>
                </span>
                <ChevronDown size={16} className={`text-slate-400 transition-transform ${isAcademicMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {isAcademicMenuOpen && (
                <div className="mt-3 rounded-2xl border border-slate-200/70 dark:border-slate-800/60 bg-white/70 dark:bg-slate-950/30 p-2 space-y-2">
                  <div className="rounded-xl bg-slate-50/80 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 px-2 py-2 space-y-1.5">
                    <p className="px-2 pt-1 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">Akademik</p>
                    <SidebarItem icon={School} label="Data Kelas" to={`${basePath}/akademik/data-kelas`} variant="sub" />
                    <SidebarItem icon={Users} label="Data Siswa" to={`${basePath}/akademik/data-siswa`} variant="sub" />
                    <SidebarItem icon={CalendarDays} label="Jadwal Mengajar" to={`${basePath}/akademik/jadwal-mengajar`} variant="sub" />
                    <SidebarItem icon={ClipboardCheck} label="Absensi Siswa" to={`${basePath}/akademik/absensi-siswa`} variant="sub" />
                    <SidebarItem icon={Award} label="Nilai Siswa" to={`${basePath}/akademik/nilai-siswa`} variant="sub" />
                    <SidebarItem icon={NotebookPen} label="Jurnal Mengajar" to={`${basePath}/akademik/jurnal-mengajar`} variant="sub" />
                  </div>

                  <div className="rounded-xl bg-slate-50/80 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 px-2 py-2 space-y-1.5">
                    <p className="px-2 pt-1 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">Laporan Akademik</p>
                    <SidebarItem icon={BarChart3} label="Rekap Akademik" to={`${basePath}/akademik/rekap-akademik`} variant="sub" />
                    <SidebarItem icon={Printer} label="Cetak Laporan" to={`${basePath}/akademik/cetak-laporan`} variant="sub" />
                  </div>

                  <div className="rounded-xl bg-slate-50/80 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 px-2 py-2 space-y-1.5">
                    <p className="px-2 pt-1 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">Pengaturan Akademik</p>
                    <SidebarItem icon={CalendarRange} label="Tahun Ajaran" to={`${basePath}/akademik/tahun-ajaran`} variant="sub" />
                    <SidebarItem icon={BookOpen} label="Kurikulum" to={`${basePath}/akademik/kurikulum`} variant="sub" />
                  </div>
                </div>
              )}
            </div>
            
            {(userRole === 'SUPER_ADMIN' || userRole === 'superadmin') && (
                <SidebarItem icon={Users} label="Manajemen User" to="/admin/users" />
            )}

            {(userRole === 'KEPALA_LPK' || userRole === 'SUPER_ADMIN' || userRole === 'superadmin') && (
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                <p className="px-2 mb-2 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">Laporan</p>
                <div className="space-y-2">
                    <SidebarItem 
                        icon={BsFileEarmarkPdfFill} 
                        label="Export PDF" 
                        onClick={exportPdf} 
                        iconColor="#E72F2D"
                        customIconClass="transition-transform hover:scale-110"
                    />
                    <SidebarItem 
                        icon={BsFileEarmarkExcelFill} 
                        label="Export Excel" 
                        onClick={exportExcel} 
                        iconColor="#1D6F42"
                        customIconClass="transition-transform hover:scale-110"
                    />
                </div>
            </div>
            )}
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                <SidebarItem icon={LogOut} label="Keluar" onClick={handleLogout} />
            </div>
          </nav>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 h-[100dvh]">
        {isProfileModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                        <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">Edit Profil</h3>
                        <button onClick={() => setIsProfileModalOpen(false)} className="text-slate-500 hover:text-red-500 transition-colors">
                            <X size={20} />
                        </button>
                    </div>
                    <form onSubmit={handleProfileUpdate} className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nama Lengkap</label>
                            <input 
                                type="text" 
                                value={profileData.full_name}
                                onChange={(e) => setProfileData({...profileData, full_name: e.target.value})}
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Username</label>
                            <input 
                                type="text" 
                                value={profileData.username}
                                onChange={(e) => setProfileData({...profileData, username: e.target.value})}
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                                required
                            />
                        </div>
                         
                        <div className="pt-2 border-t border-slate-200 dark:border-slate-800 mt-2">
                            <p className="text-xs text-slate-500 mb-3">Kosongkan jika tidak ingin mengubah password</p>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Password Baru</label>
                                    <input 
                                        type="password" 
                                        value={profileData.newPassword}
                                        onChange={(e) => setProfileData({...profileData, newPassword: e.target.value})}
                                        className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                                        placeholder="Min. 6 karakter"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Konfirmasi Password</label>
                                    <input 
                                        type="password" 
                                        value={profileData.confirmPassword}
                                        onChange={(e) => setProfileData({...profileData, confirmPassword: e.target.value})}
                                        className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                                        placeholder="Ulangi password baru"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 pt-4">
                            <button 
                                type="button"
                                onClick={() => setIsProfileModalOpen(false)}
                                className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            >
                                Batal
                            </button>
                            <button 
                                type="submit"
                                className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 shadow-lg shadow-red-500/30 transition-all transform active:scale-95"
                            >
                                Simpan Perubahan
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )}
        <header className="sticky top-0 z-30 border-b border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl">
          <div className="h-16 px-4 md:px-6 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                onClick={() => setIsSidebarOpen(true)}
                className="md:hidden inline-flex items-center justify-center rounded-full p-2 text-slate-500 hover:text-red-500 hover:bg-slate-100/80 dark:hover:bg-slate-800 transition-colors"
              >
                <Menu size={20} />
              </button>
              <div className="hidden md:flex flex-col">
                <span className="text-[11px] font-semibold tracking-[0.22em] text-slate-400 uppercase">
                  {getRoleLabel()} Dashboard
                </span>
                <h2 className="text-base md:text-lg font-semibold text-slate-900 dark:text-slate-50 truncate">
                  {location.pathname.endsWith('/dashboard') && 'Dashboard Overview'}
                  {location.pathname.endsWith('/scan') && 'Scan QR Code'}
                  {location.pathname.endsWith('/students') && 'Data Pendaftar'}
                  {location.pathname.endsWith('/users') && 'Manajemen User'}
                  {location.pathname.includes('/student/') && 'Detail Pendaftar'}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2 md:gap-4 flex-1 justify-end md:flex-none">
              <div className="flex items-center bg-slate-100/80 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-700 rounded-full pl-3 pr-1 py-1 gap-2 w-full max-w-[200px] md:min-w-[220px] md:max-w-sm transition-all duration-300 focus-within:ring-2 focus-within:ring-red-500/20 focus-within:border-red-500/50 group">
                <Search size={16} className="text-slate-400 hidden sm:block group-focus-within:text-red-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Cari data..."
                  className="bg-transparent border-none outline-none text-xs text-slate-700 dark:text-slate-100 placeholder:text-slate-400 flex-1 min-w-0"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearch}
                />
                <button
                  onClick={triggerSearch}
                  className="p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all shadow-sm hover:shadow-red-500/30 active:scale-95"
                >
                  <Search size={14} />
                </button>
              </div>

              <div className="hidden md:flex items-center text-[11px] font-medium text-slate-500 dark:text-slate-300 gap-1">
                <Clock size={16} className="text-red-400" />
                <span>
                  {currentTime.toLocaleTimeString('id-ID', { 
                    timeZone: 'Asia/Makassar',
                    hour: '2-digit', 
                    minute: '2-digit', 
                    second: '2-digit',
                    hour12: false
                  })} WITA
                </span>
              </div>

              <button
                type="button"
                onClick={() => setIsDark((prev) => !prev)}
                className="inline-flex items-center justify-center rounded-full p-2 bg-slate-100/80 dark:bg-slate-800 text-slate-600 dark:text-slate-200 hover:bg-slate-200/80 dark:hover:bg-slate-700 transition-colors"
              >
                {isDark ? <SunMedium size={18} /> : <Moon size={18} />}
              </button>

              <button
                type="button"
                className="hidden sm:inline-flex items-center justify-center rounded-full p-2 bg-slate-100/80 dark:bg-slate-800 text-slate-600 dark:text-slate-200 hover:bg-slate-200/80 dark:hover:bg-slate-700 transition-colors relative"
              >
                <Bell size={18} />
                <span className="absolute -top-0.5 -right-0.5 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 text-[10px] font-semibold text-white px-1">
                  3
                </span>
              </button>

              <div 
                  className="flex items-center gap-2 pl-2 border-l border-slate-200/70 dark:border-slate-800 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg p-1 transition-colors"
                  onClick={() => setIsProfileModalOpen(true)}
              >
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center text-white font-semibold text-sm shadow-lg shadow-red-500/30">
                  {userInfo?.full_name ? userInfo.full_name.charAt(0).toUpperCase() : 'A'}
                </div>
                <div className="hidden sm:flex flex-col">
                  <span className="text-xs font-semibold text-slate-900 dark:text-slate-50 uppercase">
                    {userInfo?.full_name || userRole || 'Administrator'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-4 md:px-6 py-4 md:py-6 pb-[calc(96px+var(--vv-bottom,0px)+max(env(safe-area-inset-bottom,0px),16px))] md:pb-8">
          {children}
        </main>

          <nav
            className="md:hidden fixed inset-x-0 z-40"
            style={{
              bottom: 'calc(var(--vv-bottom,0px) + max(env(safe-area-inset-bottom,0px),16px))',
              paddingBottom: 'max(env(safe-area-inset-bottom,0px),16px)',
            }}
          >
          <div className="mx-auto w-full max-w-md px-3 pt-2 pb-3">
            <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl shadow-[0_-12px_30px_rgba(0,0,0,0.18)] dark:shadow-[0_-12px_30px_rgba(0,0,0,0.45)]">
              <div className="grid grid-cols-4 gap-1 px-2 py-2">
                <button
                  type="button"
                  onClick={() => navigate(`${basePath}/dashboard`)}
                  className={`flex flex-col items-center justify-center rounded-xl py-2 transition-colors ${
                    location.pathname.endsWith('/dashboard')
                      ? 'text-red-500 bg-red-500/10'
                      : 'text-slate-500 hover:text-red-500 hover:bg-slate-100/70 dark:hover:bg-slate-900/40'
                  }`}
                >
                  <LayoutDashboard size={20} />
                  <span className="text-[11px] mt-0.5">Dashboard</span>
                </button>

                <button
                  type="button"
                  onClick={() => navigate(`${basePath}/students`)}
                  className={`flex flex-col items-center justify-center rounded-xl py-2 transition-colors ${
                    location.pathname.endsWith('/students')
                      ? 'text-red-500 bg-red-500/10'
                      : 'text-slate-500 hover:text-red-500 hover:bg-slate-100/70 dark:hover:bg-slate-900/40'
                  }`}
                >
                  <FileText size={20} />
                  <span className="text-[11px] mt-0.5">Pendaftar</span>
                </button>

                <button
                  type="button"
                  onClick={() => navigate(`${basePath}/scan`)}
                  className={`flex flex-col items-center justify-center rounded-xl py-2 transition-colors ${
                    location.pathname.endsWith('/scan')
                      ? 'text-red-500 bg-red-500/10'
                      : 'text-slate-500 hover:text-red-500 hover:bg-slate-100/70 dark:hover:bg-slate-900/40'
                  }`}
                >
                  <QrCode size={20} />
                  <span className="text-[11px] mt-0.5">Scan QR</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsProfileModalOpen(true)}
                  className={`flex flex-col items-center justify-center rounded-xl py-2 transition-colors ${
                    isProfileModalOpen
                      ? 'text-red-500 bg-red-500/10'
                      : 'text-slate-500 hover:text-red-500 hover:bg-slate-100/70 dark:hover:bg-slate-900/40'
                  }`}
                >
                  <User size={20} />
                  <span className="text-[11px] mt-0.5">Profil</span>
                </button>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default AdminLayout;
