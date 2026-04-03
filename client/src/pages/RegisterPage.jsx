import { useState, useEffect, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { DocumentUpload, CustomDatePicker, JapaneseDateGroup } from '../components/FormComponents';
import { useAlert } from '../context/AlertContext';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Calendar, Info, Download } from 'lucide-react';
import { toPng } from 'html-to-image';
import Logo from '../assets/img/SKYBRIDGE_LOGO.webp';
import heroBg from '../assets/img/hero-lpk-doryouku.png';

/* ─── Zod Schema (unchanged) ─── */
const rowSchema = (lvl, required) =>
  z.object({
    level: z.literal(lvl),
    school_name: z.string().optional(),
    entry_month: z.string().optional(),
    entry_year: z.union([z.string(), z.number()]).optional(),
    graduation_month: z.string().optional(),
    graduation_year: z.union([z.string(), z.number()]).optional(),
  }).superRefine((row, ctx) => {
    const hasAny =
      (row.school_name && row.school_name.trim() !== '') ||
      (row.entry_month && row.entry_month.trim() !== '') ||
      (row.entry_year !== undefined && row.entry_year !== '') ||
      (row.graduation_month && row.graduation_month.trim() !== '') ||
      (row.graduation_year !== undefined && row.graduation_year !== '');
    if (required) {
      if (!row.school_name || row.school_name.trim() === '') ctx.addIssue({ path: ['school_name'], code: z.ZodIssueCode.custom, message: 'Wajib diisi' });
      if (!row.entry_month || row.entry_month.trim() === '') ctx.addIssue({ path: ['entry_month'], code: z.ZodIssueCode.custom, message: 'Wajib diisi' });
      if (row.entry_year === undefined || row.entry_year === '') ctx.addIssue({ path: ['entry_year'], code: z.ZodIssueCode.custom, message: 'Wajib diisi' });
      if (!row.graduation_month || row.graduation_month.trim() === '') ctx.addIssue({ path: ['graduation_month'], code: z.ZodIssueCode.custom, message: 'Wajib diisi' });
      if (row.graduation_year === undefined || row.graduation_year === '') ctx.addIssue({ path: ['graduation_year'], code: z.ZodIssueCode.custom, message: 'Wajib diisi' });
    } else if (hasAny) {
      if (!row.school_name || row.school_name.trim() === '') ctx.addIssue({ path: ['school_name'], code: z.ZodIssueCode.custom, message: 'Lengkapi jika mengisi' });
      if (!row.entry_month || row.entry_month.trim() === '') ctx.addIssue({ path: ['entry_month'], code: z.ZodIssueCode.custom, message: 'Lengkapi jika mengisi' });
      if (row.entry_year === undefined || row.entry_year === '') ctx.addIssue({ path: ['entry_year'], code: z.ZodIssueCode.custom, message: 'Lengkapi jika mengisi' });
      if (!row.graduation_month || row.graduation_month.trim() === '') ctx.addIssue({ path: ['graduation_month'], code: z.ZodIssueCode.custom, message: 'Lengkapi jika mengisi' });
      if (row.graduation_year === undefined || row.graduation_year === '') ctx.addIssue({ path: ['graduation_year'], code: z.ZodIssueCode.custom, message: 'Lengkapi jika mengisi' });
    }
    const checkYear = (val, path) => {
      if (val !== undefined && val !== '') {
        const num = Number(val);
        if (!Number.isInteger(num) || num < 1900 || num > 2100) ctx.addIssue({ path: [path], code: z.ZodIssueCode.custom, message: 'Tahun tidak valid' });
      }
    };
    checkYear(row.entry_year, 'entry_year');
    checkYear(row.graduation_year, 'graduation_year');
  });

const formSchema = z.object({
  education: z.tuple([
    rowSchema('SD/MI', true),
    rowSchema('SMP/MTS', false),
    rowSchema('SMA/SMK', false),
    rowSchema('D3/S1', false),
  ]),
  // Melonggarkan validasi email dan nomor HP agar tetap bisa terkirim
  email: z.string().optional().or(z.literal('')),
  phone_number: z.string().optional().or(z.literal('')),
}).passthrough();

/* ─── Step Config ─── */
const STEPS = [
  { num: 1, label: 'Data Pribadi',   kanji: '個人情報', letter: 'A' },
  { num: 2, label: 'Pendidikan',     kanji: '教育歴',   letter: 'B' },
  { num: 3, label: 'Orang Tua',      kanji: '保護者',   letter: 'C' },
  { num: 4, label: 'Dokumen',        kanji: '書類',     letter: 'D' },
  { num: 5, label: 'Tes Fisik',      kanji: '体力測定', letter: 'E' },
];

/* ─── Shared field styles ─── */
const Label = ({ children }) => (
  <label className="block text-sm font-bold text-gray-700 mb-0.5">{children}</label>
);
const Hint = ({ children }) => (
  <p className="text-[11px] text-gray-400 italic mb-1.5">{children}</p>
);
const ErrMsg = ({ msg }) =>
  msg ? <span className="text-red-500 text-xs mt-0.5 block">{msg}</span> : null;

/* ═══════════════════════════════════════ */
const RegisterPage = () => {
  const [step, setStep] = useState(1);
  const { showAlert } = useAlert();
  const { register, control, watch, trigger, getValues, setError, clearErrors, formState: { errors } } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      education: [
        { level: 'SD/MI',   school_name: '', entry_month: '', entry_year: '', graduation_month: '', graduation_year: '' },
        { level: 'SMP/MTS', school_name: '', entry_month: '', entry_year: '', graduation_month: '', graduation_year: '' },
        { level: 'SMA/SMK', school_name: '', entry_month: '', entry_year: '', graduation_month: '', graduation_year: '' },
        { level: 'D3/S1',   school_name: '', entry_month: '', entry_year: '', graduation_month: '', graduation_year: '' },
      ],
      email: '',
      phone_number: '',
    },
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [registrationName, setRegistrationName] = useState('');
  const [showCard, setShowCard] = useState(false);
  const [isDownloadingCard, setIsDownloadingCard] = useState(false);
  const cardRef = useRef(null);

  const photoWatch = watch('photo');

  useEffect(() => {
    if (photoWatch && photoWatch.length > 0) {
      const url = URL.createObjectURL(photoWatch[0]);
      setPhotoPreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPhotoPreview(null);
    }
  }, [photoWatch]);

  const getMissingDocs = () => {
    const missingDocs = [];
    const photoFiles   = watch('photo');
    const diplomaFiles = watch('diploma');
    const ktpFiles     = watch('ktp');
    const healthFiles  = watch('health_certificate');
    const consentFiles = watch('consent_letter');
    const familyFiles  = watch('family_card');
    const birthFiles   = watch('birth_certificate');
    if (!photoFiles   || photoFiles.length   === 0) missingDocs.push('Pas foto ukuran 3x4 cm hitam putih (2 lembar) - di langkah A');
    if (!diplomaFiles || diplomaFiles.length === 0) missingDocs.push('Fotocopy ijazah terakhir yang dilegalisir - di langkah D');
    if (!ktpFiles     || ktpFiles.length     === 0) missingDocs.push('Fotocopy KTP/SIM - di langkah D');
    if (!healthFiles  || healthFiles.length  === 0) missingDocs.push('Kartu keterangan sehat - di langkah D');
    if (!consentFiles || consentFiles.length === 0) missingDocs.push('Surat pernyataan kesediaan - di langkah D');
    if (!familyFiles  || familyFiles.length  === 0) missingDocs.push('Fotocopy kartu keluarga - di langkah D');
    if (!birthFiles   || birthFiles.length   === 0) missingDocs.push('Fotocopy akta kelahiran - di langkah D');
    return missingDocs;
  };

  const onSubmit = async (data) => {
    if (step !== 5) return;
    clearErrors(['height', 'weight']);
    const physicalLabels = { height: 'Tinggi Badan', weight: 'Berat Badan' };
    const physicalMissing = [];
    Object.entries(physicalLabels).forEach(([name, label]) => {
      const value = data[name];
      const isEmpty = value === undefined || value === null || (typeof value === 'string' && value.trim() === '');
      if (isEmpty) { physicalMissing.push(label); setError(name, { type: 'manual', message: `${label} harus diisi` }); }
    });

    // Menampilkan pesan informasi namun tidak memblokir pendaftaran (sesuai permintaan user) agar admin bisa memverifikasi manual.
    const missingDocs = getMissingDocs();
    if (missingDocs.length > 0 || physicalMissing.length > 0) {
      // Kita beri info singkat saja bahwa data kurang, tapi tetap izinkan proses simpan.
      console.log('Data belum lengkap, tapi pendaftaran tetap dikirim untuk verifikasi admin.');
    }
    
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      const fileFields = ['photo', 'diploma', 'ktp', 'family_card', 'birth_certificate', 'health_certificate', 'consent_letter'];
      const toDateString = (value) => {
        if (value instanceof Date && !Number.isNaN(value.getTime())) {
          const year = value.getFullYear();
          const month = String(value.getMonth() + 1).padStart(2, '0');
          const day = String(value.getDate()).padStart(2, '0');
          return `${year}-${month}-${day}`;
        }
        return value;
      };

      Object.keys(data).forEach((key) => {
        if (key === 'education' || fileFields.includes(key)) return;
        const raw = data[key];
        if (raw === undefined || raw === null) return;
        if (typeof raw === 'string' && raw.trim() === '') return;
        formData.append(key, key === 'date_of_birth' ? toDateString(raw) : raw);
      });

      formData.append('education', JSON.stringify(data.education || []));

      fileFields.forEach((field) => {
        if (data[field]?.[0] instanceof File) formData.append(field, data[field][0]);
      });
      const registerUrl = import.meta.env.DEV ? 'http://localhost:5500/api/students' : '/api/students';
      const response = await axios.post(registerUrl, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 45000
      });
      const regNumber = response.data.registration_number;
      setRegistrationNumber(regNumber);
      setRegistrationName(String(data.full_name || '').trim());
      setShowCard(true);
      showAlert(['Pendaftaran Berhasil!', `Nomor Registrasi Anda: ${regNumber}`, '', 'Mohon simpan dan catat nomor pendaftaran ini.', 'Nomor ini digunakan untuk memantau status pendaftaran Anda yang akan diproses oleh admin.', '', 'Tekan tombol di bawah untuk menyalin nomor pendaftaran ke clipboard Anda.'].join('\n'), 'success', 'Pendaftaran Sukses', async () => { try { if (navigator?.clipboard?.writeText) await navigator.clipboard.writeText(regNumber); } catch { return; } });
      requestAnimationFrame(() => {
        try {
          const el = document.getElementById('registration-card-preview');
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } catch { return; }
      });
    } catch (error) {
      let message = 'Terjadi kesalahan saat mendaftar.';
      if (error.code === 'ECONNABORTED') message = 'Waktu tunggu server habis. Silakan coba lagi.';
      if (error.response) {
        if (error.response.data?.message) message = error.response.data.message;
        else if (typeof error.response.data === 'string' && error.response.data.trim() !== '') message = error.response.data;
        else if (error.response.status >= 500) message = 'Terjadi kesalahan pada server (500). Silakan hubungi admin atau coba beberapa saat lagi.';
        else message = `Permintaan ditolak oleh server (status ${error.response.status}). Pastikan data sudah lengkap.`;
      } else if (error.request) {
        message = 'Tidak dapat terhubung ke server. Pastikan server backend berjalan.';
      } else {
        message = 'Terjadi kesalahan tak terduga di aplikasi.';
      }
      showAlert(message, 'error', 'Pendaftaran Gagal');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinalSubmit = async () => {
    if (isSubmitting) return;
    
    // Tetap trigger validasi agar user bisa melihat error di UI (bertanda merah),
    // tapi tidak memblokir proses pengiriman (agar admin/staff bisa memverifikasi manual nanti).
    await trigger();
    
    // Lanjutkan ke pengiriman meskipun validasi frontend belum 100% sempurna
    await onSubmit(getValues());
  };

  const handleDownloadRegistrationCard = async () => {
    if (!cardRef.current || !registrationNumber) return;
    setIsDownloadingCard(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 3,
        backgroundColor: '#ffffff',
      });
      const link = document.createElement('a');
      link.download = `Kartu-Pendaftaran-${registrationNumber}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {
      showAlert('Gagal menyiapkan kartu untuk didownload. Silakan coba lagi.', 'error', 'Download Gagal');
    } finally {
      setIsDownloadingCard(false);
    }
  };

  const handleCopyRegistration = async () => {
    if (!registrationNumber) return;
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(registrationNumber);
        showAlert('Nomor pendaftaran berhasil disalin. Simpan di catatan Anda.', 'success', 'Nomor Disalin');
      } else {
        showAlert(`Silakan salin nomor pendaftaran ini: ${registrationNumber}`, 'info', 'Salin Nomor');
      }
    } catch {
      showAlert(`Gagal menyalin otomatis. Silakan salin manual: ${registrationNumber}`, 'warning', 'Gagal Menyalin');
    }
  };

  const validateStep = async () => {
    if (step === 1) {
      const requiredLabels = { full_name: 'Nama Lengkap', nik: 'Nomor KTP (NIK)', gender: 'Jenis Kelamin', date_of_birth: 'Tanggal Lahir', phone_number: 'Nomor Handphone (WA)', email: 'Alamat Email', place_of_birth: 'Tempat Lahir', religion: 'Agama', marital_status: 'Status Pernikahan', address: 'Alamat Lengkap', photo: 'Foto 3x4 (Latar Merah/Biru)' };
      clearErrors(Object.keys(requiredLabels));
      const values = watch();
      const missing = [];
      Object.entries(requiredLabels).forEach(([name, label]) => {
        if (name === 'photo') { if (!values.photo || values.photo.length === 0) { missing.push(label); setError('photo', { type: 'manual', message: 'Foto 3x4 harus diupload' }); } return; }
        const value = values[name];
        const isEmpty = value === undefined || value === null || (typeof value === 'string' && value.trim() === '');
        if (isEmpty) { missing.push(label); setError(name, { type: 'manual', message: `${label} harus diisi` }); }
      });
      const nikValid   = await trigger('nik');
      const emailValid = await trigger('email');
      const phoneValid = await trigger('phone_number');
      if (missing.length > 0 || !nikValid || !emailValid || !phoneValid) {
        showAlert(['Ada data yang belum diisi atau tidak valid pada langkah A (Keterangan Pribadi):', ...missing.map((l, i) => `${i + 1}. ${l}`), '', 'Periksa kembali kolom yang bertanda merah dan ikuti pesan di bawah setiap field.'].join('\n'), 'warning', 'Data Pribadi Belum Lengkap');
        return false;
      }
      try {
        const nikValue = values.nik;
        if (nikValue && String(nikValue).trim().length === 16) {
          const response = await axios.get('/api/students/check-nik', { params: { nik: nikValue } });
          if (response.data?.exists) { setError('nik', { type: 'manual', message: 'NIK sudah terdaftar. NIK tidak boleh sama.' }); showAlert('NIK sudah terdaftar. NIK tidak boleh sama.', 'error', 'NIK Duplikat'); return false; }
        }
      } catch (error) { console.error('Error checking NIK:', error); }
      return true;
    }
    if (step === 2) {
      const eduFields = ['education.0.school_name', 'education.0.entry_month', 'education.0.entry_year', 'education.0.graduation_month', 'education.0.graduation_year'];
      const isValid = await trigger(eduFields);
      if (!isValid) { showAlert(['Riwayat Pendidikan jenjang SD/MI belum lengkap.', 'Pastikan Nama Sekolah, Tanggal Masuk, dan Tanggal Wisuda sudah diisi dengan benar.'].join('\n'), 'warning', 'Riwayat Pendidikan Belum Lengkap'); return false; }
      return true;
    }
    if (step === 3) {
      const requiredLabels = { father_name: 'Nama Ayah', mother_name: 'Nama Ibu', father_job: 'Pekerjaan Ayah', mother_job: 'Pekerjaan Ibu', father_status: 'Keadaan Ayah', mother_status: 'Keadaan Ibu', parent_address: 'Alamat Orang Tua' };
      clearErrors(Object.keys(requiredLabels));
      const values = watch();
      const missing = [];
      Object.entries(requiredLabels).forEach(([name, label]) => {
        const value = values[name];
        const isEmpty = value === undefined || value === null || (typeof value === 'string' && value.trim() === '');
        if (isEmpty) { missing.push(label); setError(name, { type: 'manual', message: `${label} harus diisi` }); }
      });
      const isValid = await trigger(Object.keys(requiredLabels));
      if (missing.length > 0 || !isValid) { showAlert(['Ada data yang belum diisi atau tidak valid pada langkah C (Data Orang Tua / Wali):', ...missing.map((l, i) => `${i + 1}. ${l}`), '', 'Periksa kembali kolom yang bertanda merah dan ikuti pesan di bawah setiap field.'].join('\n'), 'warning', 'Data Orang Tua Belum Lengkap'); return false; }
      return true;
    }
    if (step === 4) {
      const missingDocs = getMissingDocs();
      if (missingDocs.length > 0) { showAlert(['Dokumen berikut belum diupload:', ...missingDocs.map((d, i) => `${i + 1}. ${d}`), '', 'Silakan lengkapi semua dokumen pada langkah A (Foto 3x4) dan langkah D (dokumen persyaratan), lalu klik kembali "Lanjut".'].join('\n'), 'warning', 'Dokumen Belum Lengkap'); return false; }
      return true;
    }
    return true;
  };

  const nextStep = async () => {
    const valid = await validateStep();
    if (!valid) return;
    setStep(prev => prev + 1);
    if (typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches) window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const prevStep = () => setStep(prev => prev - 1);

  const progress = ((step - 1) / 4) * 100;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Noto+Sans+JP:wght@500;700;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        :root {
          --red:      #D0021B;
          --red-dark: #A50015;
          --red-light:#FF1A35;
          --gold:     #C8860A;
          --gold-lt:  #F5A623;
          --cream:    #FDF8F0;
          --ink:      #1C1C1C;
          --muted:    #6B7280;
          --border:   #E5E7EB;
          --white:    #FFFFFF;
        }

        .reg-root {
          font-family: 'Plus Jakarta Sans', sans-serif;
          min-height: 100vh;
          background: var(--cream);
          background-image:
            repeating-linear-gradient(45deg, rgba(208,2,27,0.025) 0, rgba(208,2,27,0.025) 1px, transparent 1px, transparent 36px),
            repeating-linear-gradient(-45deg, rgba(200,134,10,0.025) 0, rgba(200,134,10,0.025) 1px, transparent 1px, transparent 36px);
        }

        /* Page header banner */
        .reg-banner {
          background: linear-gradient(135deg, rgba(26,0,5,0.9) 0%, rgba(45,0,8,0.9) 60%, rgba(26,9,0,0.9) 100%), url(${heroBg}) center/cover no-repeat;
          position: relative;
          overflow: hidden;
          padding: 28px 24px 80px;
          text-align: center;
        }
        .reg-banner::before {
          content: '';
          position: absolute;
          left: 0; top: 0; width: 6px; height: 100%;
          background: linear-gradient(to bottom, var(--red), var(--red-dark));
        }
        .reg-banner::after {
          content: '';
          position: absolute;
          left: 6px; top: 0; width: 3px; height: 100%;
          background: linear-gradient(to bottom, var(--gold-lt), var(--gold));
        }
        .banner-sun {
          position: absolute;
          bottom: -100px; left: 50%;
          transform: translateX(-50%);
          width: 280px; height: 280px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(245,166,35,0.15) 0%, rgba(208,2,27,0.08) 45%, transparent 70%);
          pointer-events: none;
        }
        .banner-pattern {
          position: absolute; inset: 0;
          background-image:
            repeating-linear-gradient(45deg, rgba(200,134,10,0.04) 0, rgba(200,134,10,0.04) 1px, transparent 1px, transparent 28px),
            repeating-linear-gradient(-45deg, rgba(208,2,27,0.04) 0, rgba(208,2,27,0.04) 1px, transparent 1px, transparent 28px);
          pointer-events: none;
        }
        .banner-kana {
          font-family: 'Noto Sans JP', sans-serif;
          font-weight: 900;
          font-size: 11px;
          letter-spacing: 0.3em;
          color: rgba(245,166,35,0.7);
          text-transform: uppercase;
          display: block;
          margin-bottom: 8px;
        }
        .banner-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(30px, 6vw, 48px);
          color: #fff;
          letter-spacing: 0.04em;
          line-height: 1;
          position: relative; z-index: 1;
        }
        .banner-title .acc { color: var(--red-light); }
        .banner-sub {
          font-size: 13px;
          color: rgba(255,255,255,0.55);
          margin-top: 6px;
          position: relative; z-index: 1;
        }

        /* Main card */
        .reg-card {
          position: relative;
          max-width: 1200px;
          width: calc(100% - 32px);
          margin: -44px auto 48px;
          background: var(--white);
          border-radius: 24px;
          box-shadow: 0 24px 80px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.06);
          overflow: hidden;
          padding: 0 0 32px;
        }
        @media (min-width: 1024px) {
          .reg-card {
            max-width: 1320px;
            margin: -56px auto 64px;
            border-radius: 28px;
          }
          .form-body { padding: 34px 40px 0; }
          .step-nav { padding: 32px 40px 0; }
          .progress-bar-wrap { margin: 16px 40px 0; }
          .nav-footer { padding: 26px 40px 0; }
        }

        /* Red top accent on card */
        .reg-card::before {
          content: '';
          display: block;
          height: 5px;
          background: linear-gradient(90deg, var(--red-dark), var(--red), var(--gold-lt), var(--red));
          background-size: 200% 100%;
          animation: shimmer 4s linear infinite;
        }
        @keyframes shimmer {
          0%   { background-position: 0% 0%; }
          100% { background-position: 200% 0%; }
        }

        /* ── Step Progress ── */
        .step-nav {
          padding: 28px 28px 0;
          display: flex;
          align-items: flex-start;
          gap: 0;
          position: relative;
        }

        .step-connector {
          flex: 1;
          height: 3px;
          margin-top: 20px;
          background: var(--border);
          position: relative;
          overflow: hidden;
        }
        .step-connector.done { background: var(--red); }
        .step-connector.active::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, var(--red) 0%, var(--gold-lt) 100%);
          animation: fillBar 0.5s ease forwards;
        }
        @keyframes fillBar { from { transform: scaleX(0); transform-origin: left; } to { transform: scaleX(1); } }

        .step-dot-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          flex-shrink: 0;
        }

        .step-dot {
          width: 40px; height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 18px;
          font-weight: 900;
          border: 3px solid var(--border);
          background: var(--white);
          color: var(--muted);
          transition: all 0.3s ease;
          position: relative;
          z-index: 1;
        }
        .step-dot.done {
          background: var(--red);
          border-color: var(--red);
          color: white;
          box-shadow: 0 4px 14px rgba(208,2,27,0.35);
        }
        .step-dot.active {
          background: linear-gradient(135deg, var(--red), var(--red-dark));
          border-color: var(--red);
          color: white;
          box-shadow: 0 4px 20px rgba(208,2,27,0.45);
          transform: scale(1.12);
        }

        .step-label {
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.04em;
          color: var(--muted);
          text-align: center;
          white-space: nowrap;
          max-width: 56px;
          line-height: 1.2;
        }
        .step-label.active { color: var(--red); }
        .step-kanji {
          font-family: 'Noto Sans JP', sans-serif;
          font-size: 8px;
          color: rgba(0,0,0,0.25);
          text-align: center;
        }
        .step-kanji.active { color: rgba(208,2,27,0.5); }

        /* Progress bar below steps */
        .progress-bar-wrap {
          margin: 16px 28px 0;
          height: 6px;
          background: var(--border);
          border-radius: 3px;
          overflow: hidden;
        }
        .progress-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--red-dark), var(--red), var(--gold-lt));
          border-radius: 3px;
          transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Section title */
        .section-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 24px;
        }
        .section-letter {
          width: 44px; height: 44px;
          border-radius: 12px;
          background: linear-gradient(135deg, var(--red), var(--red-dark));
          color: white;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 22px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 6px 16px rgba(208,2,27,0.3);
          flex-shrink: 0;
        }
        .section-title-wrap {}
        .section-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 22px;
          color: var(--ink);
          letter-spacing: 0.03em;
          line-height: 1;
        }
        .section-kanji {
          font-family: 'Noto Sans JP', sans-serif;
          font-size: 10px;
          color: var(--muted);
          letter-spacing: 0.1em;
        }

        /* Form body */
        .form-body { padding: 28px 28px 0; }

        /* Info boxes */
        .info-box {
          border-radius: 14px;
          padding: 14px 16px;
          margin-bottom: 20px;
          display: flex;
          gap: 12px;
          font-size: 13px;
          line-height: 1.6;
        }
        .info-box.blue {
          background: #EFF6FF;
          border-left: 4px solid #3B82F6;
          color: #1E40AF;
        }
        .info-box.red {
          background: #FEF2F2;
          border-left: 4px solid var(--red);
          color: #991B1B;
        }
        .info-box svg { flex-shrink: 0; margin-top: 2px; }

        /* Education table */
        .edu-header-row {
          display: none;
        }
        @media (min-width: 768px) {
          .edu-header-row {
            display: grid;
            grid-template-columns: 120px 1fr 1fr 1fr;
            gap: 12px;
            background: linear-gradient(135deg, #1A0005, #2D0008);
            color: rgba(255,255,255,0.75);
            font-size: 11px;
            font-weight: 700;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            border-radius: 12px;
            padding: 10px 16px;
            margin-bottom: 10px;
          }
        }

        .edu-row {
          border: 1.5px solid var(--border);
          border-radius: 14px;
          background: white;
          overflow: visible;
          transition: border-color 0.2s, box-shadow 0.2s;
          margin-bottom: 10px;
        }
        .edu-row:hover {
          border-color: rgba(208,2,27,0.25);
          box-shadow: 0 4px 16px rgba(208,2,27,0.06);
        }
        .edu-row-inner {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
          padding: 14px 16px;
        }
        @media (min-width: 768px) {
          .edu-row-inner { grid-template-columns: 120px 1fr 1fr 1fr; align-items: start; }
        }
        .edu-level-cell {}
        .edu-level-name {
          font-weight: 800;
          font-size: 15px;
          color: var(--ink);
        }
        .edu-level-badge {
          display: inline-block;
          margin-top: 4px;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.08em;
          padding: 2px 8px;
          border-radius: 100px;
        }
        .badge-required { background: #FEE2E2; color: #B91C1C; }
        .badge-optional { background: #F3F4F6; color: #6B7280; }

        /* Navigation footer */
        .nav-footer {
          padding: 24px 28px 0;
          border-top: 1.5px solid var(--border);
          margin-top: 28px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }
        .nav-spacer { flex: 1; }
        @media (max-width: 640px) {
          .nav-footer { flex-wrap: nowrap; justify-content: center; padding: 16px 14px calc(16px + env(safe-area-inset-bottom)) 14px; }
          .nav-spacer { display: none; }
          .nav-footer .btn-back,
          .nav-footer .btn-next,
          .nav-footer .btn-submit {
            flex: 0 0 auto;
            width: calc(50% - 6px);
            max-width: 190px;
            padding: 11px 14px;
            min-height: 52px;
            justify-content: center;
          }
          .nav-footer .btn-back { padding-left: 16px; }
          .nav-footer .btn-next { padding-right: 16px; }
          .nav-footer .btn-next,
          .nav-footer .btn-submit {
            box-shadow: 0 10px 26px rgba(0,0,0,0.14);
          }
          .nav-footer .btn-label { align-items: center !important; text-align: center; }
          .nav-footer .btn-label > span:first-child { line-height: 1.05; }
          .nav-footer .btn-sub { font-size: 8px; margin-top: 2px; }
        }

        .btn-back {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          border-radius: 100px;
          border: 2px solid var(--border);
          background: white;
          color: var(--ink);
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
          line-height: 1;
        }
        .btn-back:hover { border-color: var(--red); color: var(--red); background: #FEF2F2; }

        .btn-next {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 13px 32px;
          border-radius: 100px;
          background: linear-gradient(135deg, var(--red), var(--red-dark));
          color: white;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 800;
          font-size: 14px;
          cursor: pointer;
          border: none;
          box-shadow: 0 8px 24px rgba(208,2,27,0.35);
          transition: all 0.2s;
          line-height: 1;
        }
        .btn-next:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(208,2,27,0.45); }
        .btn-next:active { transform: scale(0.98); }

        .btn-submit {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 13px 32px;
          border-radius: 100px;
          background: linear-gradient(135deg, #059669, #047857);
          color: white;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 800;
          font-size: 14px;
          cursor: pointer;
          border: none;
          box-shadow: 0 8px 24px rgba(5,150,105,0.35);
          transition: all 0.2s;
          line-height: 1;
        }
        .btn-submit:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(5,150,105,0.45); }
        .btn-submit:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

        .btn-label { display: flex; flex-direction: column; align-items: flex-start; }
        .btn-sub { font-family: 'Noto Sans JP', sans-serif; font-size: 9px; opacity: 0.65; margin-top: 1px; }

        /* Photo upload area */
        .photo-zone {
          border: 2px dashed var(--border);
          border-radius: 16px;
          padding: 28px;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s;
          background: #FAFAFA;
        }
        .photo-zone:hover { border-color: var(--red); background: #FEF2F2; }
        .photo-zone.has-err { border-color: #FCA5A5; background: #FEF2F2; }

        /* Success registration box */
        .success-reg-box {
          border-radius: 16px;
          background: linear-gradient(135deg, #ECFDF5, #D1FAE5);
          border: 2px solid #6EE7B7;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        @media (min-width: 640px) {
          .success-reg-box { flex-direction: row; align-items: center; justify-content: space-between; }
        }

        .reg-card-preview-wrap {
          margin-top: 16px;
          border-radius: 18px;
          border: 1.5px solid rgba(5,150,105,0.25);
          background: linear-gradient(135deg, rgba(236,253,245,0.9), rgba(209,250,229,0.7));
          padding: 14px;
        }
        .reg-card-preview {
          border-radius: 18px;
          overflow: hidden;
          background: #ffffff;
          border: 1px solid rgba(226,232,240,0.9);
          box-shadow: 0 18px 50px rgba(2,6,23,0.12);
        }
        .reg-card-preview-top {
          position: relative;
          padding: 16px 16px 14px;
          background: linear-gradient(135deg, #1A0005 0%, #2D0008 55%, #1A0A00 100%);
          color: white;
          overflow: hidden;
        }
        .reg-card-preview-top::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            repeating-linear-gradient(45deg, rgba(200,134,10,0.06) 0px, rgba(200,134,10,0.06) 1px, transparent 1px, transparent 28px),
            repeating-linear-gradient(-45deg, rgba(208,2,27,0.06) 0px, rgba(208,2,27,0.06) 1px, transparent 1px, transparent 28px);
          opacity: 0.8;
          pointer-events: none;
        }
        .reg-card-preview-top::after {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          height: 100%;
          width: 10px;
          background: linear-gradient(to bottom, var(--red), var(--red-dark));
        }
        .reg-card-preview-top .gold-strip {
          position: absolute;
          left: 10px;
          top: 0;
          height: 100%;
          width: 4px;
          background: linear-gradient(to bottom, var(--gold-lt), var(--gold));
        }
        .reg-card-preview-head {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }
        .reg-card-preview-brand {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .reg-card-preview-logo {
          width: 40px;
          height: 40px;
          border-radius: 14px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.16);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          flex-shrink: 0;
        }
        .reg-card-preview-logo img {
          width: 30px;
          height: 30px;
          object-fit: contain;
        }
        .reg-card-preview-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 22px;
          letter-spacing: 0.06em;
          line-height: 1;
        }
        .reg-card-preview-sub {
          font-size: 10px;
          opacity: 0.7;
          margin-top: 2px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }
        .reg-card-preview-stamp {
          width: 44px;
          height: 44px;
          border-radius: 14px;
          border: 2px solid rgba(245,166,35,0.75);
          color: rgba(245,166,35,0.95);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Noto Sans JP', sans-serif;
          font-weight: 900;
          font-size: 14px;
          background: rgba(255,255,255,0.06);
        }
        .reg-card-preview-body {
          padding: 14px 16px 16px;
        }
        .reg-card-preview-row {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
          padding: 10px 12px;
          border-radius: 14px;
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          margin-top: 10px;
        }
        .reg-card-preview-k {
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #64748B;
        }
        .reg-card-preview-v {
          font-size: 13px;
          font-weight: 900;
          color: #0F172A;
          text-align: right;
          line-height: 1.25;
        }
        .reg-card-preview-foot {
          margin-top: 12px;
          font-size: 10px;
          color: #64748B;
          line-height: 1.5;
        }
        .reg-card-actions {
          margin-top: 12px;
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          justify-content: center;
        }
        .reg-card-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 11px 16px;
          border-radius: 999px;
          border: 1.5px solid rgba(5,150,105,0.25);
          background: white;
          color: #065F46;
          font-weight: 800;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 10px 26px rgba(2,6,23,0.08);
        }
        .reg-card-btn:hover { transform: translateY(-1px); box-shadow: 0 14px 34px rgba(2,6,23,0.12); }
        .reg-card-btn.primary {
          border: none;
          background: linear-gradient(135deg, #059669, #047857);
          color: white;
          box-shadow: 0 14px 40px rgba(5,150,105,0.30);
        }
        .reg-card-btn.primary:hover { box-shadow: 0 18px 50px rgba(5,150,105,0.38); }

        /* Input styles */
        .input-field {
          width: 100%;
          padding: 10px 14px;
          border-radius: 12px;
          border: 1.5px solid #E5E7EB;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 13.5px;
          font-weight: 500;
          color: #1C1C1C;
          background: white;
          transition: all 0.15s;
          outline: none;
          appearance: none;
        }
        .input-field::placeholder { color: #9CA3AF; font-weight: 400; }
        .input-field:hover { border-color: #D1D5DB; }
        .input-field:focus { border-color: var(--red); box-shadow: 0 0 0 3px rgba(208,2,27,0.08); }
        .input-field.err { border-color: #F87171; background: #FEF2F2; }
        .input-field.err:focus { box-shadow: 0 0 0 3px rgba(248,113,113,0.15); }
      `}</style>

      <div className="reg-root">
        <Navbar />

        {/* ── Banner ── */}
        <div className="reg-banner">
          <div className="banner-pattern" />
          <div className="banner-sun" />
          <span className="banner-kana" style={{ position: 'relative', zIndex: 1 }}>
            申請フォーム · Formulir Pendaftaran
          </span>
          <div className="banner-title" style={{ position: 'relative', zIndex: 1 }}>
            FORMULIR <span className="acc">PENDAFTARAN</span> SISWA
          </div>
          <p className="banner-sub">
            SKYBRIDGE Nusantara International School — Wujudkan mimpimu bekerja di Jepang
          </p>
        </div>

        {/* ── Card ── */}
        <div className="reg-card">
          <div style={{ maxWidth: '100%', margin: '0 auto' }}>

            {/* Step Nav */}
            <div className="step-nav">
              {STEPS.map((s, idx) => {
                const isDone   = step > s.num;
                const isActive = step === s.num;
                return (
                  <div key={s.num} style={{ display: 'flex', alignItems: 'flex-start', flex: idx < STEPS.length - 1 ? '1' : '0' }}>
                    <div className="step-dot-wrap">
                      <div className={`step-dot ${isDone ? 'done' : isActive ? 'active' : ''}`}>
                        {isDone ? '✓' : s.letter}
                      </div>
                      <span className={`step-label ${isActive ? 'active' : ''}`}>{s.label}</span>
                      <span className={`step-kanji ${isActive ? 'active' : ''}`}>{s.kanji}</span>
                    </div>
                    {idx < STEPS.length - 1 && (
                      <div className={`step-connector ${isDone ? 'done' : isActive ? 'active' : ''}`} style={{ marginTop: 20, flex: 1 }} />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Progress Bar */}
            <div className="progress-bar-wrap">
              <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
            </div>

            {/* Form Body */}
            <div className="form-body">
              <form
                onSubmit={(e) => e.preventDefault()}
                onKeyDown={async (e) => { if (e.key === 'Enter' && step < 5) { e.preventDefault(); await nextStep(); } }}
              >

                {/* ══ STEP 1 ══ */}
                {step === 1 && (
                  <div>
                    <div className="section-header">
                      <div className="section-letter">A</div>
                      <div className="section-title-wrap">
                        <div className="section-title">Keterangan Pribadi</div>
                        <div className="section-kanji">個人情報 · Data Diri Calon Peserta</div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">
                      <div>
                        <Label>Nama Lengkap</Label>
                        <Hint>Contoh: Ahmad Fauzi (Sesuai KTP)</Hint>
                        <input {...register('full_name')} placeholder="Masukkan nama lengkap" className={`input-field ${errors.full_name ? 'err' : ''}`} />
                        <ErrMsg msg={errors.full_name?.message} />
                      </div>

                      <div>
                        <Label>Nomor KTP (NIK)</Label>
                        <Hint>Contoh: 3201123456780001 (16 Digit)</Hint>
                        <input {...register('nik')} maxLength={16} placeholder="Masukkan 16 digit NIK" className={`input-field ${errors.nik ? 'err' : ''}`} />
                        <ErrMsg msg={errors.nik?.message} />
                      </div>

                      <div>
                        <Label>Jenis Kelamin</Label>
                        <Hint>Pilih jenis kelamin anda</Hint>
                        <select {...register('gender')} className={`input-field ${errors.gender ? 'err' : ''}`}>
                          <option value="">Pilih Jenis Kelamin</option>
                          <option value="Laki-laki">Laki-laki</option>
                          <option value="Perempuan">Perempuan</option>
                        </select>
                        <ErrMsg msg={errors.gender?.message} />
                      </div>

                      <div>
                        <Label>Tempat Lahir</Label>
                        <Hint>Contoh: Jakarta, Surabaya, Bandung (Sesuai KTP)</Hint>
                        <input {...register('place_of_birth')} placeholder="Masukkan kota kelahiran" className={`input-field ${errors.place_of_birth ? 'err' : ''}`} />
                        <ErrMsg msg={errors.place_of_birth?.message} />
                      </div>

                      <Controller
                        control={control}
                        name="date_of_birth"
                        rules={{ required: 'Tanggal lahir harus diisi' }}
                        render={({ field }) => (
                          <div>
                            <Label>Tanggal Lahir</Label>
                            <Hint>Format: Tanggal / Bulan / Tahun</Hint>
                            <CustomDatePicker field={field} />
                            <ErrMsg msg={errors.date_of_birth?.message} />
                          </div>
                        )}
                      />

                      <div>
                        <Label>Golongan Darah</Label>
                        <Hint>Pilih golongan darah (Opsional)</Hint>
                        <select {...register('blood_type')} className="input-field">
                          <option value="">Pilih Golongan Darah</option>
                          <option value="A">A</option>
                          <option value="B">B</option>
                          <option value="AB">AB</option>
                          <option value="O">O</option>
                        </select>
                      </div>

                      <div>
                        <Label>Agama</Label>
                        <Hint>Pilih agama sesuai KTP</Hint>
                        <select {...register('religion')} className={`input-field ${errors.religion ? 'err' : ''}`}>
                          <option value="">Pilih Agama</option>
                          <option value="Islam">Islam</option>
                          <option value="Kristen">Kristen</option>
                          <option value="Katolik">Katolik</option>
                          <option value="Hindu">Hindu</option>
                          <option value="Buddha">Buddha</option>
                          <option value="Konghucu">Konghucu</option>
                        </select>
                        <ErrMsg msg={errors.religion?.message} />
                      </div>

                      <div>
                        <Label>Nomor Handphone (WA)</Label>
                        <Hint>Contoh: 08123456789 (Pastikan aktif WhatsApp)</Hint>
                        <input {...register('phone_number')} placeholder="Masukkan nomor WhatsApp aktif" className={`input-field ${errors.phone_number ? 'err' : ''}`} />
                        <ErrMsg msg={errors.phone_number?.message} />
                      </div>

                      <div>
                        <Label>Alamat Email</Label>
                        <Hint>Contoh: nama.kamu@gmail.com</Hint>
                        <input {...register('email')} type="email" placeholder="Masukkan alamat email aktif" className={`input-field ${errors.email ? 'err' : ''}`} />
                        <ErrMsg msg={errors.email?.message} />
                      </div>

                      <div>
                        <Label>Status Pernikahan</Label>
                        <Hint>Pilih status saat ini</Hint>
                        <select {...register('marital_status')} className={`input-field ${errors.marital_status ? 'err' : ''}`}>
                          <option value="">Pilih Status</option>
                          <option value="Lajang">Lajang</option>
                          <option value="Menikah">Menikah</option>
                          <option value="Cerai Hidup">Cerai Hidup</option>
                          <option value="Cerai Mati">Cerai Mati</option>
                        </select>
                        <ErrMsg msg={errors.marital_status?.message} />
                      </div>
                    </div>

                    <div className="mt-4">
                      <Label>Alamat Lengkap</Label>
                      <Hint>Contoh: Jl. Sudirman No. 123, RT 01/RW 02, Kel. Menteng, Kec. Menteng, Jakarta Pusat</Hint>
                      <textarea {...register('address')} placeholder="Masukkan alamat lengkap sesuai domisili" rows={3} className={`input-field ${errors.address ? 'err' : ''}`} />
                      <ErrMsg msg={errors.address?.message} />
                    </div>

                    {/* Photo Upload */}
                    <div className="mt-5">
                      <Label>Foto 3x4 (Latar Merah/Biru)</Label>
                      <Hint>Upload foto untuk dokumen pendaftaran</Hint>
                      <div
                        className={`photo-zone ${errors.photo ? 'has-err' : ''}`}
                        onClick={() => document.getElementById('photo-upload').click()}
                      >
                        {photoPreview ? (
                          <div className="flex flex-col items-center">
                            <div style={{ width: 96, height: 120, borderRadius: 10, overflow: 'hidden', border: '2px solid #E5E7EB', marginBottom: 8 }}>
                              <img src={photoPreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            <p style={{ fontWeight: 700, color: '#374151', fontSize: 13 }}>Foto Terpilih</p>
                            <span style={{ fontSize: 12, color: 'var(--red)' }}>(Klik untuk mengganti foto)</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.6 }}>
                              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                              <circle cx="12" cy="13" r="4"/>
                            </svg>
                            <div>
                              <p style={{ fontWeight: 700, color: '#374151', fontSize: 14, marginBottom: 2 }}>Upload Foto 3x4 (Latar Merah/Biru)</p>
                              <p style={{ fontSize: 12, color: '#9CA3AF' }}>Klik area ini untuk memilih foto</p>
                            </div>
                          </div>
                        )}
                        <input id="photo-upload" type="file" {...register('photo')} accept="image/*" className="hidden" />
                      </div>
                      <ErrMsg msg={errors.photo?.message} />
                    </div>
                  </div>
                )}

                {/* ══ STEP 2 ══ */}
                {step === 2 && (
                  <div>
                    <div className="section-header">
                      <div className="section-letter">B</div>
                      <div className="section-title-wrap">
                        <div className="section-title">Riwayat Pendidikan</div>
                        <div className="section-kanji">教育歴 · SD wajib diisi, jenjang lain opsional</div>
                      </div>
                    </div>

                    <div className="edu-header-row">
                      <div>Jenjang</div>
                      <div>Nama Sekolah</div>
                      <div>Bulan Masuk</div>
                      <div>Bulan Wisuda</div>
                    </div>

                    {['SD/MI', 'SMP/MTS', 'SMA/SMK', 'D3/S1'].map((lvl, index) => (
                      <div key={lvl} className="edu-row">
                        <div className="edu-row-inner">
                          <div className="edu-level-cell">
                            <div className="edu-level-name">{lvl}</div>
                            <span className={`edu-level-badge ${index === 0 ? 'badge-required' : 'badge-optional'}`}>
                              {index === 0 ? 'Wajib' : 'Opsional'}
                            </span>
                            {index > 0 && (
                              <p style={{ fontSize: 10, color: '#9CA3AF', marginTop: 4 }}>Kosongkan jika tidak ada</p>
                            )}
                          </div>
                          <div>
                            <label className="block md:hidden" style={{ fontSize: 11, fontWeight: 700, color: '#6B7280', marginBottom: 4 }}>Nama Sekolah</label>
                            <input
                              {...register(`education.${index}.school_name`)}
                              placeholder="Nama sekolah"
                              className={`input-field ${errors.education?.[index]?.school_name ? 'err' : ''}`}
                            />
                            <ErrMsg msg={errors.education?.[index]?.school_name?.message} />
                          </div>
                          <div>
                            <JapaneseDateGroup
                              label="Bulan Masuk"
                              register={register}
                              control={control}
                              monthName={`education.${index}.entry_month`}
                              yearName={`education.${index}.entry_year`}
                              monthKey="entry_month"
                              yearKey="entry_year"
                              errorsGroup={errors.education?.[index]}
                              yearLabel="Tahun"
                              icon={Calendar}
                            />
                          </div>
                          <div>
                            <JapaneseDateGroup
                              label="Bulan Wisuda"
                              register={register}
                              control={control}
                              monthName={`education.${index}.graduation_month`}
                              yearName={`education.${index}.graduation_year`}
                              monthKey="graduation_month"
                              yearKey="graduation_year"
                              errorsGroup={errors.education?.[index]}
                              yearLabel="Tahun"
                              icon={Calendar}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* ══ STEP 3 ══ */}
                {step === 3 && (
                  <div>
                    <div className="section-header">
                      <div className="section-letter">C</div>
                      <div className="section-title-wrap">
                        <div className="section-title">Data Orang Tua / Wali</div>
                        <div className="section-kanji">保護者情報 · Informasi Keluarga</div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">
                      <div>
                        <Label>Nama Ayah</Label>
                        <Hint>Contoh: Budi Santoso</Hint>
                        <input {...register('father_name')} placeholder="Masukkan nama lengkap ayah" className={`input-field ${errors.father_name ? 'err' : ''}`} />
                        <ErrMsg msg={errors.father_name?.message} />
                      </div>
                      <div>
                        <Label>Nama Ibu</Label>
                        <Hint>Contoh: Siti Aminah</Hint>
                        <input {...register('mother_name')} placeholder="Masukkan nama lengkap ibu" className={`input-field ${errors.mother_name ? 'err' : ''}`} />
                        <ErrMsg msg={errors.mother_name?.message} />
                      </div>
                      <div>
                        <Label>Pekerjaan Ayah</Label>
                        <Hint>Contoh: Wiraswasta, PNS, Petani</Hint>
                        <input {...register('father_job')} placeholder="Masukkan pekerjaan ayah" className={`input-field ${errors.father_job ? 'err' : ''}`} />
                        <ErrMsg msg={errors.father_job?.message} />
                      </div>
                      <div>
                        <Label>Pekerjaan Ibu</Label>
                        <Hint>Contoh: Ibu Rumah Tangga</Hint>
                        <input {...register('mother_job')} placeholder="Masukkan pekerjaan ibu" className={`input-field ${errors.mother_job ? 'err' : ''}`} />
                        <ErrMsg msg={errors.mother_job?.message} />
                      </div>
                      <div>
                        <Label>Keadaan Ayah</Label>
                        <Hint>Pilih keadaan saat ini</Hint>
                        <select {...register('father_status')} className={`input-field ${errors.father_status ? 'err' : ''}`}>
                          <option value="">Pilih Keadaan</option>
                          <option value="Hidup">Hidup</option>
                          <option value="Meninggal">Meninggal</option>
                        </select>
                        <ErrMsg msg={errors.father_status?.message} />
                      </div>
                      <div>
                        <Label>Keadaan Ibu</Label>
                        <Hint>Pilih keadaan saat ini</Hint>
                        <select {...register('mother_status')} className={`input-field ${errors.mother_status ? 'err' : ''}`}>
                          <option value="">Pilih Keadaan</option>
                          <option value="Hidup">Hidup</option>
                          <option value="Meninggal">Meninggal</option>
                        </select>
                        <ErrMsg msg={errors.mother_status?.message} />
                      </div>
                    </div>

                    <div className="mt-4">
                      <Label>Alamat Orang Tua</Label>
                      <Hint>Contoh: Jl. Merdeka No. 45 (Sama dengan siswa)</Hint>
                      <textarea {...register('parent_address')} placeholder="Masukkan alamat lengkap orang tua" rows={3} className={`input-field ${errors.parent_address ? 'err' : ''}`} />
                      <ErrMsg msg={errors.parent_address?.message} />
                    </div>

                    {/* Wali section */}
                    <div style={{ marginTop: 28, paddingTop: 20, borderTop: '2px dashed #E5E7EB' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                        <div style={{ width: 6, height: 20, background: 'linear-gradient(to bottom, var(--gold), var(--gold-lt))', borderRadius: 3 }} />
                        <h4 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, color: 'var(--ink)', letterSpacing: '0.03em' }}>Data Wali</h4>
                        <span style={{ fontFamily: "'Noto Sans JP', sans-serif", fontSize: 10, color: 'var(--muted)' }}>保護者</span>
                      </div>
                      <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">
                        <div>
                          <Label>Nama Wali Siswa</Label>
                          <input {...register('guardian_name')} placeholder="Masukkan nama wali siswa" className="input-field" />
                        </div>
                        <div>
                          <Label>Nomor Telepon / HP</Label>
                          <input {...register('guardian_phone')} placeholder="Masukkan nomor telepon/HP wali" className="input-field" />
                        </div>
                      </div>
                      <div className="mt-4">
                        <Label>Alamat Wali</Label>
                        <textarea {...register('guardian_address')} placeholder="Alamat lengkap wali" rows={3} className="input-field" />
                      </div>
                    </div>
                  </div>
                )}

                {/* ══ STEP 4 ══ */}
                {step === 4 && (
                  <div>
                    <div className="section-header">
                      <div className="section-letter">D</div>
                      <div className="section-title-wrap">
                        <div className="section-title">Syarat & Dokumen Lampiran</div>
                        <div className="section-kanji">必要書類 · Upload semua dokumen persyaratan</div>
                      </div>
                    </div>

                    <div className="info-box blue">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                      <div>
                        <strong>Catatan Penting:</strong>
                        <ul style={{ listStyle: 'disc', marginLeft: 16, marginTop: 4 }}>
                          <li>Silakan upload hasil scan dari <strong>fotokopi dokumen asli</strong>.</li>
                          <li>Setelah selesai upload, klik tombol <strong>"Lanjut"</strong> untuk mengisi <strong>Data Fisik (Tes Fisik)</strong> pada langkah berikutnya.</li>
                          <li>Pendaftaran baru akan dikirim setelah Anda melengkapi Data Fisik.</li>
                        </ul>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                      <DocumentUpload label="Fotocopy ijazah terakhir yang dilegalisir" name="diploma" register={register} watch={watch} quantity="1 Lembar" />
                      <DocumentUpload label="Fotocopy KTP/SIM" name="ktp" register={register} watch={watch} quantity="1 Lembar" />
                      <DocumentUpload label="Kartu keterangan sehat" name="health_certificate" register={register} watch={watch} quantity="1 Lembar" />
                      <DocumentUpload label="Surat pernyataan kesediaan" name="consent_letter" register={register} watch={watch} quantity="1 Lembar" />
                      <DocumentUpload label="Fotocopy kartu keluarga" name="family_card" register={register} watch={watch} quantity="1 Lembar" />
                      <DocumentUpload label="Fotocopy akta kelahiran" name="birth_certificate" register={register} watch={watch} quantity="1 Lembar" />
                      {/* Photo preview card */}
                      <div style={{ border: '2px dashed #E5E7EB', borderRadius: 14, padding: 20, background: 'white' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                          <div>
                            <p style={{ fontWeight: 700, fontSize: 13, color: '#1C1C1C' }}>Pas photo ukuran 3x4 cm hitam putih</p>
                            <p style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>Banyak: 2 Lembar</p>
                          </div>
                          <span style={{ padding: '3px 10px', borderRadius: 100, fontSize: 11, fontWeight: 700, background: photoWatch && photoWatch.length > 0 ? '#D1FAE5' : '#FEE2E2', color: photoWatch && photoWatch.length > 0 ? '#065F46' : '#991B1B' }}>
                            {photoWatch && photoWatch.length > 0 ? 'Ada' : 'Tidak Ada'}
                          </span>
                        </div>
                        {photoPreview && (
                          <img src={photoPreview} alt="Preview Foto 3x4" style={{ width: '100%', height: 120, objectFit: 'contain', borderRadius: 10, border: '1px solid #E5E7EB', background: '#F9FAFB' }} />
                        )}
                        <p style={{ fontSize: 11, color: '#9CA3AF', marginTop: 8 }}>Upload foto dilakukan di langkah A.</p>
                      </div>
                    </div>

                    <div className="info-box red" style={{ marginTop: 20 }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                      <div>
                        <strong>Catatan:</strong> Pada saat verifikasi di kantor, harap membawa dokumen asli untuk ditunjukkan kepada petugas.
                      </div>
                    </div>
                  </div>
                )}

                {/* ══ STEP 5 ══ */}
                {step === 5 && (
                  <div>
                    <div className="section-header">
                      <div className="section-letter">E</div>
                      <div className="section-title-wrap">
                        <div className="section-title">Test Fisik</div>
                        <div className="section-kanji">体力測定 · Data kondisi fisik peserta</div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">
                      <div>
                        <Label>Apakah Memiliki Tato?</Label>
                        <Hint>Pilih sesuai kondisi fisik saat ini</Hint>
                        <select {...register('has_tattoo')} className="input-field">
                          <option value="false">Tidak</option>
                          <option value="true">Ya</option>
                        </select>
                      </div>
                      <div>
                        <Label>Apakah Memiliki Tindik?</Label>
                        <Hint>Pilih sesuai kondisi fisik saat ini</Hint>
                        <select {...register('has_piercing')} className="input-field">
                          <option value="false">Tidak</option>
                          <option value="true">Ya</option>
                        </select>
                      </div>
                      <div>
                        <Label>Tinggi Badan (cm)</Label>
                        <Hint>Contoh: 170.5</Hint>
                        <input {...register('height')} type="number" step="0.01" placeholder="Masukkan tinggi badan" className={`input-field ${errors.height ? 'err' : ''}`} />
                        <ErrMsg msg={errors.height?.message} />
                      </div>
                      <div>
                        <Label>Berat Badan (kg)</Label>
                        <Hint>Contoh: 60.5</Hint>
                        <input {...register('weight')} type="number" step="0.01" placeholder="Masukkan berat badan" className={`input-field ${errors.weight ? 'err' : ''}`} />
                        <ErrMsg msg={errors.weight?.message} />
                      </div>
                    </div>

                    {registrationNumber && (
                      <div className="success-reg-box" style={{ marginTop: 20 }}>
                        <div>
                          <p style={{ fontWeight: 700, color: '#065F46', fontSize: 14 }}>Pendaftaran Anda sudah berhasil dikirim.</p>
                          <p style={{ fontSize: 12, color: '#047857', marginTop: 4 }}>Simpan nomor pendaftaran ini untuk memantau status pendaftaran Anda yang akan diproses oleh admin.</p>
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '6px 14px', background: 'white', borderRadius: 10, border: '1.5px solid #6EE7B7' }}>
                            <span style={{ fontSize: 12, color: '#6B7280' }}>No. Pendaftaran:</span>
                            <span style={{ fontFamily: 'monospace', fontWeight: 800, color: '#065F46', fontSize: 14 }}>{registrationNumber}</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={handleCopyRegistration}
                          style={{ padding: '10px 20px', borderRadius: 100, background: 'linear-gradient(135deg, #059669, #047857)', color: 'white', fontWeight: 700, fontSize: 13, border: 'none', cursor: 'pointer', whiteSpace: 'nowrap', boxShadow: '0 4px 14px rgba(5,150,105,0.3)' }}
                        >
                          Salin Nomor Pendaftaran
                        </button>
                      </div>
                    )}

                    {showCard && registrationNumber && (
                      <div id="registration-card-preview" className="reg-card-preview-wrap">
                        <div ref={cardRef} className="reg-card-preview">
                          <div className="reg-card-preview-top">
                            <div className="gold-strip" />
                            <div className="reg-card-preview-head">
                              <div className="reg-card-preview-brand">
                                <div className="reg-card-preview-logo">
                                  <img src={Logo} alt="SKYBRIDGE" />
                                </div>
                                <div>
                                  <div className="reg-card-preview-title">KARTU PENDAFTARAN</div>
                                  <div className="reg-card-preview-sub">SKYBRIDGE</div>
                                </div>
                              </div>
                              <div className="reg-card-preview-stamp">登録</div>
                            </div>
                          </div>
                          <div className="reg-card-preview-body">
                            <div className="reg-card-preview-row">
                              <div>
                                <div className="reg-card-preview-k">Nama</div>
                                <div className="reg-card-preview-foot">Simpan kartu ini sebagai bukti pendaftaran.</div>
                              </div>
                              <div className="reg-card-preview-v">{registrationName || '-'}</div>
                            </div>
                            <div className="reg-card-preview-row">
                              <div className="reg-card-preview-k">No. Registrasi</div>
                              <div className="reg-card-preview-v" style={{ fontFamily: 'monospace' }}>{registrationNumber}</div>
                            </div>
                            <div className="reg-card-preview-foot">
                              Gunakan nomor registrasi untuk cek status. Bawa bukti ini saat verifikasi.
                            </div>
                          </div>
                        </div>

                        <div className="reg-card-actions">
                          <button
                            type="button"
                            className="reg-card-btn primary"
                            onClick={handleDownloadRegistrationCard}
                            disabled={isDownloadingCard}
                          >
                            <Download size={16} />
                            {isDownloadingCard ? 'Menyiapkan...' : 'Download Kartu (PNG)'}
                          </button>
                          <button type="button" className="reg-card-btn" onClick={handleCopyRegistration}>
                            Salin Nomor
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* ══ NAV FOOTER ══ */}
                <div className="nav-footer">
                  {step > 1 ? (
                    <button type="button" onClick={prevStep} className="btn-back">
                      <ChevronLeft size={18} />
                      <span className="btn-label">
                        <span>Kembali</span>
                        <span className="btn-sub">戻る</span>
                      </span>
                    </button>
                  ) : <div className="nav-spacer" />}

                  {step < 5 ? (
                    <button type="button" onClick={nextStep} className="btn-next">
                      <span className="btn-label" style={{ alignItems: 'flex-end' }}>
                        <span>Lanjut</span>
                        <span className="btn-sub">次へ</span>
                      </span>
                      <ChevronRight size={18} />
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={handleFinalSubmit}
                      className="btn-submit"
                    >
                      <span className="btn-label" style={{ alignItems: 'flex-end' }}>
                        <span>{isSubmitting ? 'Mengirim...' : 'Kirim Pendaftaran'}</span>
                        <span className="btn-sub" style={{ color: 'rgba(255,255,255,0.65)' }}>申請を送信</span>
                      </span>
                    </button>
                  )}
                </div>

              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
