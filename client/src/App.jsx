import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AlertProvider } from './context/AlertContext';
import { LoadingProvider } from './context/LoadingContext';
import LandingPage from './pages/LandingPage';
import RegisterPage from './pages/RegisterPage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminStudentsPage from './pages/AdminStudentsPage';
import AdminStudentDetail from './pages/AdminStudentDetail';
import AdminScanQr from './pages/AdminScanQr';
import AdminUserManagement from './pages/AdminUserManagement';
import StaffInputData from './pages/StaffInputData';
import CheckStatusPage from './pages/CheckStatusPage';
import StudentDashboard from './pages/StudentDashboard';
import PrivateRoute from './components/PrivateRoute';
import KursusBahasaJepang from './pages/KursusBahasaJepang';
import PelatihanKerjaJepang from './pages/PelatihanKerjaJepang';
import MagangKeJepang from './pages/MagangKeJepang';
import BelajarBahasaJepangDariNol from './pages/BelajarBahasaJepangDariNol';
import KerjaJepangTanpaPengalaman from './pages/blog/KerjaJepangTanpaPengalaman';
import BiayaKursusJepang from './pages/blog/BiayaKursusJepang';
import TipsLolosMagang from './pages/blog/TipsLolosMagang';
import MagangJepangVsSSW from './pages/blog/MagangJepangVsSSW';
import SyaratMagangJepangTerbaru from './pages/blog/SyaratMagangJepangTerbaru';
import TahapanSeleksiMagangJepang from './pages/blog/TahapanSeleksiMagangJepang';
import GajiMagangJepangBersih from './pages/blog/GajiMagangJepangBersih';
import TokuteiGinouSSWItuApa from './pages/blog/TokuteiGinouSSWItuApa';
import GajiKerjaDiJepangPerBulan from './pages/blog/GajiKerjaDiJepangPerBulan';
import KurikulumBelajarJepangUntukKerja3Bulan from './pages/blog/KurikulumBelajarJepangUntukKerja3Bulan';
import DataKelas from './pages/akademik/DataKelas';
import DataSiswa from './pages/akademik/DataSiswa';
import JadwalMengajar from './pages/akademik/JadwalMengajar';
import AbsensiSiswa from './pages/akademik/AbsensiSiswa';
import NilaiSiswa from './pages/akademik/NilaiSiswa';
import JurnalMengajar from './pages/akademik/JurnalMengajar';
import RekapAkademik from './pages/akademik/RekapAkademik';
import CetakLaporan from './pages/akademik/CetakLaporan';
import TahunAjaran from './pages/akademik/TahunAjaran';
import Kurikulum from './pages/akademik/Kurikulum';
import ScrollToTop from './components/ScrollToTop';
import WhatsAppButton from './components/WhatsAppButton';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <AlertProvider>
        <LoadingProvider>
          <Toaster position="top-right" />
          <div className="min-h-screen bg-dory-gray text-dory-dark font-sans relative">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/student/check-status" element={<CheckStatusPage />} />
              <Route path="/student/dashboard" element={<StudentDashboard />} />
              
              {/* SEO Pages */}
              <Route path="/kursus-bahasa-jepang-online" element={<KursusBahasaJepang />} />
              <Route path="/pelatihan-kerja-ke-jepang" element={<PelatihanKerjaJepang />} />
              <Route path="/magang-ke-jepang" element={<MagangKeJepang />} />
              <Route path="/belajar-bahasa-jepang-dari-nol" element={<BelajarBahasaJepangDariNol />} />

              {/* Blog Articles */}
              <Route path="/blog/kerja-jepang-tanpa-pengalaman" element={<KerjaJepangTanpaPengalaman />} />
              <Route path="/blog/biaya-kursus-bahasa-jepang" element={<BiayaKursusJepang />} />
              <Route path="/blog/tips-lolos-magang-ke-jepang" element={<TipsLolosMagang />} />
              <Route path="/blog/magang-jepang-itu-apa-bedanya-ssw" element={<MagangJepangVsSSW />} />
              <Route path="/blog/syarat-magang-jepang-terbaru" element={<SyaratMagangJepangTerbaru />} />
              <Route path="/blog/tahapan-seleksi-magang-jepang" element={<TahapanSeleksiMagangJepang />} />
              <Route path="/blog/magang-jepang-gaji-berapa-hitungan-bersih" element={<GajiMagangJepangBersih />} />
              <Route path="/blog/tokutei-ginou-ssw-itu-apa" element={<TokuteiGinouSSWItuApa />} />
              <Route path="/blog/gaji-kerja-di-jepang-per-bulan" element={<GajiKerjaDiJepangPerBulan />} />
              <Route path="/blog/kurikulum-belajar-bahasa-jepang-untuk-kerja-3-bulan" element={<KurikulumBelajarJepangUntukKerja3Bulan />} />

              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/staff/login" element={<AdminLogin />} />
              <Route path="/kepalalpk/login" element={<AdminLogin />} />
              <Route path="/admin" element={<PrivateRoute allowedRoles={['SUPER_ADMIN', 'superadmin']}><AdminDashboard /></PrivateRoute>} />
              <Route path="/admin/dashboard" element={<PrivateRoute allowedRoles={['SUPER_ADMIN', 'superadmin']}><AdminDashboard /></PrivateRoute>} />
              <Route path="/admin/students" element={<PrivateRoute allowedRoles={['SUPER_ADMIN', 'superadmin']}><AdminStudentsPage /></PrivateRoute>} />
              <Route path="/admin/student/:id" element={<PrivateRoute allowedRoles={['SUPER_ADMIN', 'superadmin']}><AdminStudentDetail /></PrivateRoute>} />
              <Route path="/admin/users" element={<PrivateRoute allowedRoles={['SUPER_ADMIN', 'superadmin']}><AdminUserManagement /></PrivateRoute>} />
              <Route path="/admin/scan" element={<PrivateRoute allowedRoles={['SUPER_ADMIN', 'superadmin']}><AdminScanQr /></PrivateRoute>} />
              <Route path="/admin/input-student" element={<PrivateRoute allowedRoles={['SUPER_ADMIN', 'superadmin']}><StaffInputData /></PrivateRoute>} />
              <Route path="/admin/input-student/:id" element={<PrivateRoute allowedRoles={['SUPER_ADMIN', 'superadmin']}><StaffInputData /></PrivateRoute>} />
              <Route path="/admin/akademik/data-kelas" element={<PrivateRoute allowedRoles={['SUPER_ADMIN', 'superadmin']}><DataKelas /></PrivateRoute>} />
              <Route path="/admin/akademik/data-siswa" element={<PrivateRoute allowedRoles={['SUPER_ADMIN', 'superadmin']}><DataSiswa /></PrivateRoute>} />
              <Route path="/admin/akademik/jadwal-mengajar" element={<PrivateRoute allowedRoles={['SUPER_ADMIN', 'superadmin']}><JadwalMengajar /></PrivateRoute>} />
              <Route path="/admin/akademik/absensi-siswa" element={<PrivateRoute allowedRoles={['SUPER_ADMIN', 'superadmin']}><AbsensiSiswa /></PrivateRoute>} />
              <Route path="/admin/akademik/nilai-siswa" element={<PrivateRoute allowedRoles={['SUPER_ADMIN', 'superadmin']}><NilaiSiswa /></PrivateRoute>} />
              <Route path="/admin/akademik/jurnal-mengajar" element={<PrivateRoute allowedRoles={['SUPER_ADMIN', 'superadmin']}><JurnalMengajar /></PrivateRoute>} />
              <Route path="/admin/akademik/rekap-akademik" element={<PrivateRoute allowedRoles={['SUPER_ADMIN', 'superadmin']}><RekapAkademik /></PrivateRoute>} />
              <Route path="/admin/akademik/cetak-laporan" element={<PrivateRoute allowedRoles={['SUPER_ADMIN', 'superadmin']}><CetakLaporan /></PrivateRoute>} />
              <Route path="/admin/akademik/tahun-ajaran" element={<PrivateRoute allowedRoles={['SUPER_ADMIN', 'superadmin']}><TahunAjaran /></PrivateRoute>} />
              <Route path="/admin/akademik/kurikulum" element={<PrivateRoute allowedRoles={['SUPER_ADMIN', 'superadmin']}><Kurikulum /></PrivateRoute>} />
              
              {/* Staff Routes */}
              <Route path="/staff" element={<PrivateRoute allowedRoles={['STAFF']}><AdminDashboard /></PrivateRoute>} />
              <Route path="/staff/dashboard" element={<PrivateRoute allowedRoles={['STAFF']}><AdminDashboard /></PrivateRoute>} />
              <Route path="/staff/students" element={<PrivateRoute allowedRoles={['STAFF']}><AdminStudentsPage /></PrivateRoute>} />
              <Route path="/staff/student/:id" element={<PrivateRoute allowedRoles={['STAFF']}><AdminStudentDetail /></PrivateRoute>} />
              <Route path="/staff/scan" element={<PrivateRoute allowedRoles={['STAFF']}><AdminScanQr /></PrivateRoute>} />
              <Route path="/staff/input-student" element={<PrivateRoute allowedRoles={['STAFF']}><StaffInputData /></PrivateRoute>} />
              <Route path="/staff/input-student/:id" element={<PrivateRoute allowedRoles={['STAFF']}><StaffInputData /></PrivateRoute>} />
              <Route path="/staff/akademik/data-kelas" element={<PrivateRoute allowedRoles={['STAFF']}><DataKelas /></PrivateRoute>} />
              <Route path="/staff/akademik/data-siswa" element={<PrivateRoute allowedRoles={['STAFF']}><DataSiswa /></PrivateRoute>} />
              <Route path="/staff/akademik/jadwal-mengajar" element={<PrivateRoute allowedRoles={['STAFF']}><JadwalMengajar /></PrivateRoute>} />
              <Route path="/staff/akademik/absensi-siswa" element={<PrivateRoute allowedRoles={['STAFF']}><AbsensiSiswa /></PrivateRoute>} />
              <Route path="/staff/akademik/nilai-siswa" element={<PrivateRoute allowedRoles={['STAFF']}><NilaiSiswa /></PrivateRoute>} />
              <Route path="/staff/akademik/jurnal-mengajar" element={<PrivateRoute allowedRoles={['STAFF']}><JurnalMengajar /></PrivateRoute>} />
              <Route path="/staff/akademik/rekap-akademik" element={<PrivateRoute allowedRoles={['STAFF']}><RekapAkademik /></PrivateRoute>} />
              <Route path="/staff/akademik/cetak-laporan" element={<PrivateRoute allowedRoles={['STAFF']}><CetakLaporan /></PrivateRoute>} />
              <Route path="/staff/akademik/tahun-ajaran" element={<PrivateRoute allowedRoles={['STAFF']}><TahunAjaran /></PrivateRoute>} />
              <Route path="/staff/akademik/kurikulum" element={<PrivateRoute allowedRoles={['STAFF']}><Kurikulum /></PrivateRoute>} />

              {/* Kepala LPK Routes */}
              <Route path="/kepalalpk" element={<PrivateRoute allowedRoles={['KEPALA_LPK']}><AdminDashboard /></PrivateRoute>} />
              <Route path="/kepalalpk/dashboard" element={<PrivateRoute allowedRoles={['KEPALA_LPK']}><AdminDashboard /></PrivateRoute>} />
              <Route path="/kepalalpk/students" element={<PrivateRoute allowedRoles={['KEPALA_LPK']}><AdminStudentsPage /></PrivateRoute>} />
              <Route path="/kepalalpk/student/:id" element={<PrivateRoute allowedRoles={['KEPALA_LPK']}><AdminStudentDetail /></PrivateRoute>} />
              <Route path="/kepalalpk/akademik/data-kelas" element={<PrivateRoute allowedRoles={['KEPALA_LPK']}><DataKelas /></PrivateRoute>} />
              <Route path="/kepalalpk/akademik/data-siswa" element={<PrivateRoute allowedRoles={['KEPALA_LPK']}><DataSiswa /></PrivateRoute>} />
              <Route path="/kepalalpk/akademik/jadwal-mengajar" element={<PrivateRoute allowedRoles={['KEPALA_LPK']}><JadwalMengajar /></PrivateRoute>} />
              <Route path="/kepalalpk/akademik/absensi-siswa" element={<PrivateRoute allowedRoles={['KEPALA_LPK']}><AbsensiSiswa /></PrivateRoute>} />
              <Route path="/kepalalpk/akademik/nilai-siswa" element={<PrivateRoute allowedRoles={['KEPALA_LPK']}><NilaiSiswa /></PrivateRoute>} />
              <Route path="/kepalalpk/akademik/jurnal-mengajar" element={<PrivateRoute allowedRoles={['KEPALA_LPK']}><JurnalMengajar /></PrivateRoute>} />
              <Route path="/kepalalpk/akademik/rekap-akademik" element={<PrivateRoute allowedRoles={['KEPALA_LPK']}><RekapAkademik /></PrivateRoute>} />
              <Route path="/kepalalpk/akademik/cetak-laporan" element={<PrivateRoute allowedRoles={['KEPALA_LPK']}><CetakLaporan /></PrivateRoute>} />
              <Route path="/kepalalpk/akademik/tahun-ajaran" element={<PrivateRoute allowedRoles={['KEPALA_LPK']}><TahunAjaran /></PrivateRoute>} />
              <Route path="/kepalalpk/akademik/kurikulum" element={<PrivateRoute allowedRoles={['KEPALA_LPK']}><Kurikulum /></PrivateRoute>} />
            </Routes>
            <WhatsAppButton />
          </div>
        </LoadingProvider>
      </AlertProvider>
    </Router>
  );
}

export default App;
