import { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAlert } from '../context/AlertContext';
import { Shield, LockKeyhole } from 'lucide-react';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { showAlert } = useAlert();

  const getLoginTitle = () => {
    if (location.pathname.includes('/staff/login')) return 'Masuk Staff SKYBRIDGE';
    if (location.pathname.includes('/kepalalpk/login')) return 'Masuk Kepala SKYBRIDGE';
    return 'Masuk Admin SKYBRIDGE';
  };

  const getLoginSubtitle = () => {
    if (location.pathname.includes('/staff/login')) return 'Gunakan akun staff untuk mengakses dashboard.';
    if (location.pathname.includes('/kepalalpk/login')) return 'Gunakan akun Kepala LPK untuk mengakses dashboard.';
    return 'Gunakan akun resmi admin untuk mengakses dashboard pendaftar.';
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('/api/auth/login', { username, password });
      
      // Parse token to get role
      const payload = JSON.parse(atob(data.token.split('.')[1]));
      const role = payload.role;

      // Validate Role vs URL
      if (location.pathname.includes('/staff/login') && role !== 'STAFF') {
        showAlert('Akun ini bukan akun Staff. Silakan login di halaman yang sesuai.', 'error', 'Akses Ditolak');
        return;
      }
      if (location.pathname.includes('/kepalalpk/login') && role !== 'KEPALA_LPK') {
        showAlert('Akun ini bukan akun Kepala LPK. Silakan login di halaman yang sesuai.', 'error', 'Akses Ditolak');
        return;
      }
      if (location.pathname === '/admin/login' && role !== 'SUPER_ADMIN' && role !== 'superadmin') {
        showAlert('Akun Staff atau Kepala LPK tidak boleh login di sini. Silakan gunakan halaman login khusus.', 'error', 'Akses Ditolak');
        return;
      }

      localStorage.setItem('token', data.token);
      
      // Redirect based on role
      if (role === 'STAFF') {
        navigate('/staff/dashboard');
      } else if (role === 'KEPALA_LPK') {
        navigate('/kepalalpk/dashboard');
      } else {
        navigate('/admin');
      }
    } catch (error) {
      showAlert('Login gagal. Periksa username dan password Anda.', 'error', 'Akses Ditolak');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 px-4 py-8">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-red-500/20 blur-3xl" />
        <div className="absolute top-1/2 -right-16 w-72 h-72 rounded-full bg-rose-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-40 h-40 rounded-full bg-emerald-500/10 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-4xl grid grid-cols-1 md:grid-cols-[1.1fr,0.9fr] gap-8 items-center">
        <div className="hidden md:block">
          <div className="relative rounded-3xl border border-red-500/40 bg-gradient-to-br from-red-600/90 via-rose-600/90 to-red-700/90 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
            <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-black/20 blur-2xl" />

            <div className="relative flex flex-col gap-4 text-white">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[11px] tracking-[0.28em] font-semibold uppercase text-red-100">
                    Admin Panel / 管理者
                  </p>
                  <h1 className="mt-2 text-2xl font-extrabold leading-snug">
                    Pusat Kontrol Pendaftaran
                  </h1>
                  <p className="mt-2 text-xs text-red-50/80 max-w-xs">
                    Kelola data pendaftar, verifikasi berkas, dan pantau progres seleksi program kerja ke Jepang.
                  </p>
                </div>
                <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 border border-white/20">
                  <Shield size={32} className="text-white" />
                </div>
              </div>

              <div className="mt-2 grid grid-cols-3 gap-3 text-[11px]">
                <div className="bg-black/15 rounded-xl px-3 py-2 border border-white/10">
                  <p className="font-semibold text-red-50/90">Verifikasi</p>
                  <p className="text-red-100/80 mt-1">Status pendaftar real-time.</p>
                </div>
                <div className="bg-black/15 rounded-xl px-3 py-2 border border-white/10">
                  <p className="font-semibold text-red-50/90">Keamanan</p>
                  <p className="text-red-100/80 mt-1">Akses terbatas untuk admin.</p>
                </div>
                <div className="bg-black/15 rounded-xl px-3 py-2 border border-white/10">
                  <p className="font-semibold text-red-50/90">日本の準備</p>
                  <p className="text-red-100/80 mt-1">Monitoring calon peserta ke Jepang.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -top-4 -right-4 w-20 h-20 rounded-3xl border border-red-500/20 bg-slate-900/60 backdrop-blur-xl flex items-center justify-center">
            <LockKeyhole className="text-red-400" size={28} />
          </div>
          <div className="bg-slate-950/80 backdrop-blur-xl border border-slate-700/80 rounded-3xl shadow-[0_18px_50px_rgba(0,0,0,0.7)] px-6 py-7 md:px-8 md:py-8 text-slate-50">
            <div className="mb-6">
              <p className="text-[11px] tracking-[0.24em] font-semibold uppercase text-red-400">
                Secure Login / ログイン
              </p>
              <h2 className="mt-2 text-xl md:text-2xl font-bold">{getLoginTitle()}</h2>
              <p className="mt-2 text-xs md:text-sm text-slate-300">
                {getLoginSubtitle()}
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block mb-1 text-xs md:text-sm font-medium text-slate-200">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="input-field w-full bg-slate-900/80 border-slate-700 text-slate-50 placeholder:text-slate-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/40"
                  placeholder="Masukkan username admin"
                />
              </div>
              <div>
                <label className="block mb-1 text-xs md:text-sm font-medium text-slate-200">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field w-full bg-slate-900/80 border-slate-700 text-slate-50 placeholder:text-slate-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/40"
                  placeholder="Masukkan password"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-full bg-gradient-to-r from-red-600 to-rose-500 text-white font-semibold text-sm md:text-base shadow-lg shadow-red-900/40 hover:from-red-500 hover:to-rose-400 active:scale-[0.98] transition flex items-center justify-center gap-2"
              >
                <span>Masuk Dashboard</span>
                <span className="text-[11px] tracking-[0.2em] text-red-100 uppercase">管理</span>
              </button>
              <p className="mt-2 text-[11px] text-slate-500 text-center">
                Untuk keamanan, jangan bagikan akun admin kepada pihak lain.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
