import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AlertProvider } from './context/AlertContext';
import { LoadingProvider } from './context/LoadingContext';
import PrivateRoute from './components/PrivateRoute';
import ScrollToTop from './components/ScrollToTop';
import WhatsAppButton from './components/WhatsAppButton';

const LandingPage = lazy(() => import('./pages/LandingPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AdminStudentsPage = lazy(() => import('./pages/AdminStudentsPage'));
const AdminStudentDetail = lazy(() => import('./pages/AdminStudentDetail'));
const AdminScanQr = lazy(() => import('./pages/AdminScanQr'));
const AdminUserManagement = lazy(() => import('./pages/AdminUserManagement'));
const AdminContentManagement = lazy(() => import('./pages/AdminContentManagement'));
const StaffInputData = lazy(() => import('./pages/StaffInputData'));
const CheckStatusPage = lazy(() => import('./pages/CheckStatusPage'));
const StudentDashboard = lazy(() => import('./pages/StudentDashboard'));
const ProgramCmsPage = lazy(() => import('./pages/ProgramCmsPage'));
const BlogListPage = lazy(() => import('./pages/BlogListPage'));
const DynamicBlogPage = lazy(() => import('./pages/DynamicBlogPage'));
const BelajarBahasaJepangDariNol = lazy(() => import('./pages/BelajarBahasaJepangDariNol'));
const KerjaJepangTanpaPengalaman = lazy(() => import('./pages/blog/KerjaJepangTanpaPengalaman'));
const BiayaKursusJepang = lazy(() => import('./pages/blog/BiayaKursusJepang'));
const TipsLolosMagang = lazy(() => import('./pages/blog/TipsLolosMagang'));
const MagangJepangVsSSW = lazy(() => import('./pages/blog/MagangJepangVsSSW'));
const SyaratMagangJepangTerbaru = lazy(() => import('./pages/blog/SyaratMagangJepangTerbaru'));
const TahapanSeleksiMagangJepang = lazy(() => import('./pages/blog/TahapanSeleksiMagangJepang'));
const GajiMagangJepangBersih = lazy(() => import('./pages/blog/GajiMagangJepangBersih'));
const TokuteiGinouSSWItuApa = lazy(() => import('./pages/blog/TokuteiGinouSSWItuApa'));
const GajiKerjaDiJepangPerBulan = lazy(() => import('./pages/blog/GajiKerjaDiJepangPerBulan'));
const KurikulumBelajarJepangUntukKerja3Bulan = lazy(() => import('./pages/blog/KurikulumBelajarJepangUntukKerja3Bulan'));
const DataKelas = lazy(() => import('./pages/akademik/DataKelas'));
const DataSiswa = lazy(() => import('./pages/akademik/DataSiswa'));
const JadwalMengajar = lazy(() => import('./pages/akademik/JadwalMengajar'));
const AbsensiSiswa = lazy(() => import('./pages/akademik/AbsensiSiswa'));
const NilaiSiswa = lazy(() => import('./pages/akademik/NilaiSiswa'));
const JurnalMengajar = lazy(() => import('./pages/akademik/JurnalMengajar'));
const RekapAkademik = lazy(() => import('./pages/akademik/RekapAkademik'));
const CetakLaporan = lazy(() => import('./pages/akademik/CetakLaporan'));
const TahunAjaran = lazy(() => import('./pages/akademik/TahunAjaran'));
const Kurikulum = lazy(() => import('./pages/akademik/Kurikulum'));

function App() {
  const fallback = (
    <div className="min-h-[60vh] flex items-center justify-center text-slate-500 text-sm">
      Memuat...
    </div>
  );

  return (
    <Router>
      <ScrollToTop />
      <AlertProvider>
        <LoadingProvider>
          <Toaster position="top-right" />
          <div className="min-h-screen bg-dory-gray text-dory-dark font-sans relative">
            <Suspense fallback={fallback}>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/student/check-status" element={<CheckStatusPage />} />
                <Route path="/student/dashboard" element={<StudentDashboard />} />
                
                <Route path="/kursus-bahasa-jepang-online" element={<ProgramCmsPage pageKey="kursus" />} />
                <Route path="/pelatihan-kerja-ke-jepang" element={<ProgramCmsPage pageKey="pelatihan" />} />
                <Route path="/magang-ke-jepang" element={<ProgramCmsPage pageKey="magang" />} />
                <Route path="/belajar-bahasa-jepang-dari-nol" element={<BelajarBahasaJepangDariNol />} />
                <Route path="/blog" element={<BlogListPage />} />
                <Route path="/blog/:slug" element={<DynamicBlogPage />} />

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
                <Route path="/admin/content" element={<PrivateRoute allowedRoles={['SUPER_ADMIN', 'superadmin']}><AdminContentManagement /></PrivateRoute>} />
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
            </Suspense>
            <WhatsAppButton />
          </div>
        </LoadingProvider>
      </AlertProvider>
    </Router>
  );
}

export default App;
