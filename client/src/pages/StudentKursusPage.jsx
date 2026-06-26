import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { BookOpen, CalendarDays, CheckCircle2, Clock, LogOut, User, Video } from 'lucide-react';
import { useAlert } from '../context/AlertContext';
import { getPackageById, getPackageLabel } from '../constants/coursePackages';
import { isStudentFullyApproved } from '../utils/studentAccess';

const formatTime = (time) => String(time || '').slice(0, 5);

const StudentKursusPage = () => {
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const [student, setStudent] = useState(() => {
    try {
      const raw = localStorage.getItem('studentData');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);
  const [portal, setPortal] = useState(null);
  const [enrollingId, setEnrollingId] = useState(null);

  const loadPortal = async (studentData) => {
    if (!studentData?.registration_number || !studentData?.nik) {
      navigate('/student/check-status');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/academic/student/portal`, {
        registration_number: studentData.registration_number,
        nik: studentData.nik,
      });
      setPortal(response.data);
      const updatedStudent = { ...studentData, ...response.data.student };
      setStudent(updatedStudent);
      localStorage.setItem('studentData', JSON.stringify(updatedStudent));
    } catch (error) {
      showAlert(error.response?.data?.message || 'Gagal memuat data kursus', 'error', 'Error');
      navigate('/student/check-status');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!student) {
      navigate('/student/check-status');
      return;
    }
    if (student.status !== 'Diterima' || !isStudentFullyApproved(student)) {
      navigate('/student/check-status');
      return;
    }
    loadPortal(student);
  }, []);

  const handleEnroll = async (classId) => {
    if (!student) return;
    setEnrollingId(classId);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/academic/student/enroll`, {
        registration_number: student.registration_number,
        nik: student.nik,
        class_id: classId,
      });
      showAlert('Berhasil mendaftar ke kelas. Lihat jadwal belajar Anda di bawah.', 'success', 'Pendaftaran Kelas Berhasil');
      await loadPortal(student);
    } catch (error) {
      showAlert(error.response?.data?.message || 'Gagal mendaftar ke kelas', 'error', 'Gagal');
    } finally {
      setEnrollingId(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('studentData');
    navigate('/student/check-status');
  };

  const selectedPackage = getPackageById(student?.course_package);
  const enrolledIds = new Set((portal?.enrollments || []).map((e) => e.class_id));

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-[70vh] flex items-center justify-center text-slate-500">Memuat portal kursus...</div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="bg-gradient-to-r from-[#003B73] to-[#005696] text-white">
          <div className="container mx-auto px-4 py-10">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-blue-100">Portal Belajar Siswa</p>
                <h1 className="text-3xl font-black mt-2">Kursus Bahasa Jepang SKYBRIDGE</h1>
                <p className="text-blue-100 mt-2 text-sm max-w-2xl">
                  Selamat {student?.full_name}, pendaftaran Anda telah disetujui. Pilih kelas yang tersedia dan ikuti jadwal belajar sesuai paket Anda.
                </p>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm font-bold"
              >
                <LogOut size={16} /> Keluar
              </button>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8 space-y-8">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wide">
                <User size={14} /> Paket Anda
              </div>
              <p className="mt-2 font-black text-slate-900">{selectedPackage?.name || 'Belum dipilih'}</p>
              <p className="text-sm text-[#D0021B] font-bold mt-1">{selectedPackage?.priceLabel || '-'}</p>
              <p className="text-xs text-slate-500 mt-1">{selectedPackage?.schedule || getPackageLabel(student?.course_package)}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wide">
                <CheckCircle2 size={14} /> Status
              </div>
              <p className="mt-2 font-black text-emerald-600">Diterima</p>
              <p className="text-xs text-slate-500 mt-1">No. Registrasi: {student?.registration_number}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wide">
                <BookOpen size={14} /> Kelas Terdaftar
              </div>
              <p className="mt-2 font-black text-slate-900">{portal?.enrolled_classes?.length || 0} kelas aktif</p>
              <p className="text-xs text-slate-500 mt-1">Pilih kelas sesuai paket untuk mulai belajar</p>
            </div>
          </div>

          {portal?.enrolled_classes?.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-xl font-black text-slate-900">Jadwal Kelas Anda</h2>
              <div className="grid lg:grid-cols-2 gap-4">
                {portal.enrolled_classes.map((cls) => (
                  <div key={cls.id} className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">Kelas Aktif</p>
                        <h3 className="text-lg font-black text-slate-900 mt-1">{cls.name}</h3>
                        <p className="text-sm text-slate-600 mt-1">Pengajar: {cls.instructor_name || '-'}</p>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-emerald-600 text-white">Terdaftar</span>
                    </div>
                    <div className="mt-4 space-y-2">
                      {(cls.schedules || []).map((sch) => (
                        <div key={sch.id} className="flex flex-wrap items-center gap-3 rounded-xl bg-white border border-emerald-100 px-3 py-2 text-sm">
                          <span className="inline-flex items-center gap-1 font-bold text-slate-800">
                            <CalendarDays size={14} /> {sch.day_of_week}
                          </span>
                          <span className="inline-flex items-center gap-1 text-slate-600">
                            <Clock size={14} /> {formatTime(sch.start_time)} - {formatTime(sch.end_time)}
                          </span>
                          {sch.room_name ? <span className="text-slate-500">{sch.room_name}</span> : null}
                          {sch.meeting_link ? (
                            <a href={sch.meeting_link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-blue-600 font-bold">
                              <Video size={14} /> Link Kelas
                            </a>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className="space-y-4">
            <h2 className="text-xl font-black text-slate-900">Daftar Kelas Tersedia</h2>
            <p className="text-sm text-slate-500">Kelas yang ditampilkan sesuai paket pendaftaran Anda ({selectedPackage?.name || 'semua paket'}).</p>
            <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {(portal?.available_classes || [])
                .filter((cls) => !student?.course_package || cls.package_type === student.course_package)
                .map((cls) => {
                  const isEnrolled = enrolledIds.has(cls.id);
                  const isFull = cls.enrolled_count >= cls.max_capacity;
                  return (
                    <div key={cls.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col">
                      <p className="text-[10px] font-bold uppercase tracking-wide text-[#003B73]">{cls.package_label}</p>
                      <h3 className="text-lg font-black text-slate-900 mt-1">{cls.name}</h3>
                      <p className="text-sm text-slate-600 mt-2 flex-1">{cls.description || 'Program kursus bahasa Jepang SKYBRIDGE.'}</p>
                      <p className="text-xs text-slate-500 mt-3">Pengajar: {cls.instructor_name || '-'}</p>
                      <p className="text-xs text-slate-500">Kapasitas: {cls.enrolled_count}/{cls.max_capacity} siswa</p>
                      <div className="mt-3 space-y-1.5">
                        {(cls.schedules || []).map((sch) => (
                          <div key={sch.id} className="text-xs text-slate-600 rounded-lg bg-slate-50 px-3 py-2">
                            <strong>{sch.day_of_week}</strong> · {formatTime(sch.start_time)} - {formatTime(sch.end_time)}
                            {sch.room_name ? ` · ${sch.room_name}` : ''}
                          </div>
                        ))}
                      </div>
                      <button
                        type="button"
                        disabled={isEnrolled || isFull || enrollingId === cls.id}
                        onClick={() => handleEnroll(cls.id)}
                        className={`mt-4 w-full py-3 rounded-xl font-bold text-sm transition ${
                          isEnrolled
                            ? 'bg-emerald-100 text-emerald-700 cursor-default'
                            : isFull
                              ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                              : 'bg-[#003B73] text-white hover:bg-[#002D58]'
                        }`}
                      >
                        {isEnrolled ? 'Sudah Terdaftar' : isFull ? 'Kelas Penuh' : enrollingId === cls.id ? 'Memproses...' : 'Pilih Kelas Ini'}
                      </button>
                    </div>
                  );
                })}
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default StudentKursusPage;
