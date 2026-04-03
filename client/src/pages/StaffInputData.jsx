import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  User, FileText, Upload, Save, X, Check, AlertCircle, 
  Loader2, Scan, ChevronRight, ArrowLeft, GraduationCap, 
  MapPin, Phone, Mail, Calendar, FileType, CheckCircle2,
  AlertTriangle, Users, HeartPulse, Scale, Ruler, Printer, Archive
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import AdminLayout from '../components/AdminLayout';
import { DocumentUpload, CustomDatePicker, JapaneseDateGroup } from '../components/FormComponents';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// --- Zod Schemas (Relaxed for Staff/Admin) ---

const rowSchema = (lvl, required) =>
  z.object({
    level: z.literal(lvl),
    school_name: z.string().optional(),
    entry_month: z.string().optional(),
    entry_year: z.union([z.string(), z.number()]).optional(),
    graduation_month: z.string().optional(),
    graduation_year: z.union([z.string(), z.number()]).optional(),
  }).superRefine((row, ctx) => {
    if (required) {
      if (!row.school_name || row.school_name.trim() === '') ctx.addIssue({ path: ['school_name'], code: z.ZodIssueCode.custom, message: 'Wajib diisi' });
      if (!row.entry_month || row.entry_month.trim() === '') ctx.addIssue({ path: ['entry_month'], code: z.ZodIssueCode.custom, message: 'Wajib diisi' });
      if (!row.entry_year) ctx.addIssue({ path: ['entry_year'], code: z.ZodIssueCode.custom, message: 'Wajib diisi' });
      if (!row.graduation_month || row.graduation_month.trim() === '') ctx.addIssue({ path: ['graduation_month'], code: z.ZodIssueCode.custom, message: 'Wajib diisi' });
      if (!row.graduation_year) ctx.addIssue({ path: ['graduation_year'], code: z.ZodIssueCode.custom, message: 'Wajib diisi' });
    }

    const checkYear = (val, path) => {
      if (val !== undefined && val !== '') {
        const num = Number(val);
        if (!Number.isInteger(num) || num < 1900 || num > 2100) {
          ctx.addIssue({ path: [path], code: z.ZodIssueCode.custom, message: 'Tahun tidak valid' });
        }
      }
    };
    checkYear(row.entry_year, 'entry_year');
    checkYear(row.graduation_year, 'graduation_year');
  });

const formSchema = z.object({
  // Step 1: Personal (hanya nama wajib)
  full_name: z.string().min(1, 'Nama lengkap harus diisi'),
  nik: z.string().optional(),
  gender: z.string().optional(),
  place_of_birth: z.string().optional(),
  date_of_birth: z.any().optional(),
  religion: z.string().optional(),
  marital_status: z.string().optional(),
  phone_number: z.string().optional(),
  email: z.string().optional(),
  address: z.string().optional(),
  
  // Step 2: Education (semua opsional)
  education: z.tuple([
    rowSchema('SD/MI', false),
    rowSchema('SMP/MTS', false),
    rowSchema('SMA/SMK', false),
    rowSchema('D3/S1', false),
  ]),

  // Step 3: Family (opsional)
  father_name: z.string().optional(),
  mother_name: z.string().optional(),
  father_job: z.string().optional(),
  mother_job: z.string().optional(),
  father_status: z.string().optional(),
  mother_status: z.string().optional(),
  parent_address: z.string().optional(),
  guardian_name: z.string().optional(),
  guardian_address: z.string().optional(),
  guardian_phone: z.string().optional(),

  // Step 4: Documents (opsional)
  photo: z.any().optional(),
  diploma: z.any().optional(),
  ktp: z.any().optional(),
  family_card: z.any().optional(),
  birth_certificate: z.any().optional(),
  health_certificate: z.any().optional(),
  consent_letter: z.any().optional(),

  // Step 5: Physical (opsional)
  height: z.union([z.string(), z.number()]).optional(),
  weight: z.union([z.string(), z.number()]).optional(),
  
  // Extras
  blood_type: z.string().optional(),
  has_tattoo: z.string().optional(),
  has_piercing: z.string().optional(),
});

const StaffInputData = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [mode, setMode] = useState('manual'); // 'manual' | 'scan' | 'split-view'
  const [dragActive, setDragActive] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [filePreviewUrl, setFilePreviewUrl] = useState(null);
  const [autofilledFields, setAutofilledFields] = useState([]);
  const [existingFiles, setExistingFiles] = useState({});

  const getInputClass = (fieldName) => {
    const base = "input-field transition-all duration-300 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 dark:placeholder-slate-500";
    if (autofilledFields.includes(fieldName)) {
        return `${base} border-green-500 bg-green-50 ring-2 ring-green-200 dark:bg-green-900/20 dark:ring-green-900/30 dark:border-green-500/50`;
    }
    return base;
  };

  const { register, control, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      // Step 1
      full_name: '',
      nik: '',
      gender: 'L',
      place_of_birth: '',
      date_of_birth: null,
      religion: 'Islam',
      marital_status: 'Belum Menikah',
      phone_number: '',
      email: '',
      address: '',
      
      // Step 2
      education: [
        { level: 'SD/MI', school_name: '', entry_month: '', entry_year: '', graduation_month: '', graduation_year: '' },
        { level: 'SMP/MTS', school_name: '', entry_month: '', entry_year: '', graduation_month: '', graduation_year: '' },
        { level: 'SMA/SMK', school_name: '', entry_month: '', entry_year: '', graduation_month: '', graduation_year: '' },
        { level: 'D3/S1', school_name: '', entry_month: '', entry_year: '', graduation_month: '', graduation_year: '' },
      ],

      // Step 3
      father_name: '',
      mother_name: '',
      father_job: '',
      mother_job: '',
      father_status: 'Hidup',
      mother_status: 'Hidup',
      parent_address: '',
      guardian_name: '',
      guardian_address: '',
      guardian_phone: '',

      // Step 5
      height: '',
      weight: '',
      blood_type: 'O',
      has_tattoo: 'false',
      has_piercing: 'false',
    }
  });
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [showVerify, setShowVerify] = useState(false);
  const [pendingFormValues, setPendingFormValues] = useState(null);
  const [verifyYear, setVerifyYear] = useState(new Date().getFullYear());
  const [verifyEntering, setVerifyEntering] = useState(false);
  const [verifyMode, setVerifyMode] = useState(null); // 'lama' | 'baru' | null

  useEffect(() => {
    if (!id) {
      reset({
          full_name: '',
          nik: '',
          gender: 'L',
          place_of_birth: '',
          date_of_birth: null,
          religion: 'Islam',
          marital_status: 'Belum Menikah',
          phone_number: '',
          email: '',
          address: '',
          education: [
            { level: 'SD/MI', school_name: '', entry_month: '', entry_year: '', graduation_month: '', graduation_year: '' },
            { level: 'SMP/MTS', school_name: '', entry_month: '', entry_year: '', graduation_month: '', graduation_year: '' },
            { level: 'SMA/SMK', school_name: '', entry_month: '', entry_year: '', graduation_month: '', graduation_year: '' },
            { level: 'D3/S1', school_name: '', entry_month: '', entry_year: '', graduation_month: '', graduation_year: '' },
          ],
          father_name: '',
          mother_name: '',
          father_job: '',
          mother_job: '',
          father_status: 'Hidup',
          mother_status: 'Hidup',
          parent_address: '',
          guardian_name: '',
          guardian_address: '',
          guardian_phone: '',
          height: '',
          weight: '',
          blood_type: 'O',
          has_tattoo: 'false',
          has_piercing: 'false',
      });
      setExistingFiles({});
      setAutofilledFields([]);
      setFilePreviewUrl(null);
      setActiveTab('personal');
      return;
    }

    const fetchStudent = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get(`/api/students/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const student =
          data && typeof data === 'object' && 'data' in data && 'success' in data
            ? data.data || {}
            : data || {};
        const family = student.family || {};
        const documents = student.documents || {};

        const mappedGender =
          student.gender === 'Laki-laki' ? 'L'
          : student.gender === 'Perempuan' ? 'P'
          : student.gender === 'L' || student.gender === 'P' ? student.gender
          : undefined;

        setValue('full_name', student.full_name || '');
        setValue('nik', student.nik || '');
        if (mappedGender) setValue('gender', mappedGender);
        setValue('place_of_birth', student.place_of_birth || '');
        if (student.date_of_birth) setValue('date_of_birth', new Date(student.date_of_birth));
        setValue('religion', student.religion || '');
        setValue('marital_status', student.marital_status || '');
        setValue('phone_number', student.phone_number || '');
        setValue('email', student.email || '');
        setValue('address', student.address || '');
        setValue('blood_type', student.blood_type || '');

        const educationRows =
          Array.isArray(student.education) ? student.education
          : typeof student.education === 'string'
          ? (() => {
              try {
                const parsed = JSON.parse(student.education);
                return Array.isArray(parsed) ? parsed : [];
              } catch (e) {
                console.error("Error parsing education JSON", e);
                return [];
              }
            })()
          : [];

        const eduByLevel = new Map();
        for (const row of educationRows) {
          if (row?.level) eduByLevel.set(row.level, row);
        }

        setValue('education', [
          { level: 'SD/MI', ...(eduByLevel.get('SD/MI') || {}) },
          { level: 'SMP/MTS', ...(eduByLevel.get('SMP/MTS') || {}) },
          { level: 'SMA/SMK', ...(eduByLevel.get('SMA/SMK') || {}) },
          { level: 'D3/S1', ...(eduByLevel.get('D3/S1') || {}) }
        ]);

        setValue('father_name', family.father_name || '');
        setValue('mother_name', family.mother_name || '');
        setValue('father_job', family.father_job || '');
        setValue('mother_job', family.mother_job || '');
        setValue('father_status', family.father_status || '');
        setValue('mother_status', family.mother_status || '');
        setValue('parent_address', family.parent_address || '');
        setValue('guardian_name', family.guardian_name || '');
        setValue('guardian_address', family.guardian_address || '');
        setValue('guardian_phone', family.guardian_phone || '');

        setValue('height', student.height ?? '');
        setValue('weight', student.weight ?? '');
        setValue('has_tattoo', student.has_tattoo ? 'true' : 'false');
        setValue('has_piercing', student.has_piercing ? 'true' : 'false');

        setExistingFiles({
          photo: student.photo_path,
          diploma: documents.diploma_path,
          ktp: documents.ktp_path,
          family_card: documents.family_card_path,
          birth_certificate: documents.birth_certificate_path,
          health_certificate: documents.health_certificate_path,
          consent_letter: documents.consent_letter_path
        });
      } catch (error) {
        console.error("Error fetching student:", error);
        toast.error("Gagal mengambil data siswa");
        navigate('/staff/dashboard');
      }
    };

    fetchStudent();
  }, [id, navigate, setValue, reset]);

  // Handle Drag & Drop
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file) => {
    const validTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/msword',
      'application/vnd.ms-excel',
      'image/jpeg',
      'image/png'
    ];
    if (!validTypes.includes(file.type)) {
      toast.error("Format file tidak didukung. Gunakan PDF, DOCX, XLSX, JPG, atau PNG.");
      return;
    }

    if (file.type === 'application/pdf' || file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        setFilePreviewUrl(url);
    } else {
        setFilePreviewUrl(null);
    }

    setIsParsing(true);
    const formData = new FormData();
    formData.append('document', file);

    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.post('/api/students/parse-document', formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });

      if (data.success) {
        autoFillForm(data.data);
        toast.success("Data berhasil diekstrak! Silakan periksa kembali.");
        setMode('split-view');
      }
    } catch (error) {
      console.error(error);
      toast.error("Gagal memproses dokumen. Silakan input manual.");
    } finally {
      setIsParsing(false);
    }
  };

  const autoFillForm = (data) => {
    if (!data) return;
    const fields = [];

    const setField = (key, val) => {
        setValue(key, val);
        fields.push(key);
    };

    const MONTHS = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];
    const normalizeMonth = (raw) => {
        if (!raw) return '';
        const s = String(raw).trim();
        if (!s) return '';
        const exact = MONTHS.find(m => m.toLowerCase() === s.toLowerCase());
        if (exact) return exact;
        const numMatch = s.match(/\b(1[0-2]|0?[1-9])\b/);
        if (numMatch) {
            const n = Number(numMatch[1]);
            if (Number.isFinite(n) && n >= 1 && n <= 12) return MONTHS[n - 1];
        }
        return '';
    };
    const normalizeEduLevel = (raw) => {
        const s = String(raw || '').toLowerCase();
        if (s.includes('sd')) return 'SD/MI';
        if (s.includes('mi')) return 'SD/MI';
        if (s.includes('smp')) return 'SMP/MTS';
        if (s.includes('mts')) return 'SMP/MTS';
        if (s.includes('sma')) return 'SMA/SMK';
        if (s.includes('smk')) return 'SMA/SMK';
        if (s.includes('d3')) return 'D3/S1';
        if (s.includes('s1')) return 'D3/S1';
        return raw || '';
    };
    const eduIndexByLevel = (level) => {
        const l = normalizeEduLevel(level);
        if (l === 'SD/MI') return 0;
        if (l === 'SMP/MTS') return 1;
        if (l === 'SMA/SMK') return 2;
        if (l === 'D3/S1') return 3;
        return null;
    };
    const isMeaningfulSchoolName = (raw) => {
        const s = String(raw || '').trim();
        if (!s || s.length < 3) return false;
        if (/[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff]/.test(s)) return false;
        if (/(latar|belakang|pendidikan|education|history|riwayat)/i.test(s)) return false;
        if (/perguruan\s*tinggi\s*junior/i.test(s)) return false;
        if (/(sertifikat|certificate|magang)/i.test(s)) return false;
        return true;
    };

    if (data.full_name) setField('full_name', data.full_name);
    if (data.nik) setField('nik', data.nik);
    if (data.place_of_birth) setField('place_of_birth', data.place_of_birth);
    if (data.nisn) setField('nisn', data.nisn);
    
    if (data.date_of_birth) {
        const raw = String(data.date_of_birth || '').trim().replace(/T.*$/, '');
        const parts = raw.split(/[^0-9]/).filter(Boolean);
        if (parts.length >= 3) {
            let day = null;
            let month = null;
            let year = null;

            const a = parts[0];
            const b = parts[1];
            const c = parts[2];

            if (a.length === 4) {
                year = a;
                month = b;
                day = c;
            } else if (c.length === 4) {
                day = a;
                month = b;
                year = c;
            } else {
                const nums = [Number(a), Number(b), Number(c)];
                const yearCandidate = nums.find(n => Number.isFinite(n) && n >= 1900 && n <= 2100);
                if (yearCandidate) {
                    year = String(yearCandidate);
                    const rest = nums.filter(n => n !== yearCandidate);
                    if (rest.length === 2) {
                        const mCandidate = rest.find(n => n >= 1 && n <= 12);
                        const dCandidate = rest.find(n => n >= 1 && n <= 31 && n !== mCandidate);
                        month = mCandidate ? String(mCandidate) : null;
                        day = dCandidate ? String(dCandidate) : null;
                    }
                }
            }

            if (day && month && year) {
                const dateObj = new Date(Number(year), Number(month) - 1, Number(day));
                if (!isNaN(dateObj.getTime())) {
                    setField('date_of_birth', dateObj);
                }
            }
        }
    }

    if (data.gender) {
        const mappedGender =
            data.gender === 'Laki-laki' ? 'L'
            : data.gender === 'Perempuan' ? 'P'
            : data.gender === 'L' || data.gender === 'P' ? data.gender
            : null;
        if (mappedGender) setField('gender', mappedGender);
    }
    if (data.religion) setField('religion', data.religion);
    if (data.phone_number) setField('phone_number', data.phone_number);
    if (data.email) setField('email', data.email);
    if (data.address) setField('address', data.address);
    if (data.father_name) setField('father_name', data.father_name);
    if (data.mother_name) setField('mother_name', data.mother_name);
    if (data.father_job) setField('father_job', data.father_job);
    if (data.mother_job) setField('mother_job', data.mother_job);

    if (Array.isArray(data.education) && data.education.length) {
        data.education.forEach((edu) => {
            const idx = eduIndexByLevel(edu.level);
            if (idx === null) return;
            const entryYear = edu.entry_year ? String(edu.entry_year) : '';
            const graduationYear = edu.graduation_year ? String(edu.graduation_year) : '';
            const entryMonth = normalizeMonth(edu.entry_month);
            const gradMonth = normalizeMonth(edu.graduation_month);
            const hasDates = Boolean(entryYear || graduationYear || entryMonth || gradMonth);

            if (idx === 3) {
                const schoolNameOk = isMeaningfulSchoolName(edu.school_name);
                if (!schoolNameOk && !hasDates) {
                    if (edu.school_name) setValue(`education.${idx}.school_name`, '');
                    return;
                }
                if (edu.school_name && !schoolNameOk) {
                    setValue(`education.${idx}.school_name`, '');
                }
            }

            if (idx === 2 && edu.school_name && !isMeaningfulSchoolName(edu.school_name)) {
                setValue(`education.${idx}.school_name`, '');
            } else if (isMeaningfulSchoolName(edu.school_name)) {
                setField(`education.${idx}.school_name`, edu.school_name);
            }

            if (entryYear) setField(`education.${idx}.entry_year`, entryYear);
            if (graduationYear) setField(`education.${idx}.graduation_year`, graduationYear);
            if (entryMonth) setField(`education.${idx}.entry_month`, entryMonth);
            if (gradMonth) setField(`education.${idx}.graduation_month`, gradMonth);
        });
    } else if (data.previous_school) {
        setValue('education.2.school_name', data.previous_school);
        fields.push('education.2.school_name');
    }

    setAutofilledFields(fields);
  };

  const checkDuplicate = async (field, value) => {
    if (!value) return;
    try {
        const endpoint = field === 'nik' ? '/api/students/check-nik' : '/api/students/check-email';
        const param = field === 'nik' ? { nik: value } : { email: value };
        
        if (id) {
            param.excludeId = id;
        }

        const { data } = await axios.get(endpoint, { params: param });
        if (data.exists) {
            toast.error(`${field === 'nik' ? 'NIK' : 'Email'} sudah terdaftar!`, { duration: 4000 });
        }
    } catch (error) {
        console.error(error);
    }
  };

  const onSubmit = async (data, status = 'Terverifikasi') => {
    const dataYear = data.__data_year;
    try {
      setIsSubmitting(true);
      // Manual File Validation
      const fileFields = ['photo', 'ktp', 'diploma', 'family_card', 'birth_certificate', 'health_certificate', 'consent_letter'];
      // dokumen opsional untuk staff/admin
      
      // Staff/Admin: longgar — cukup nama wajib. Dokumen boleh kosong.

      const toastId = toast.loading(status === 'Draft' ? "Menyimpan Draft..." : "Menyimpan & Verifikasi...");
      const token = localStorage.getItem('token');
      
      const formData = new FormData();
      const toDateString = (value) => {
        if (value instanceof Date && !Number.isNaN(value.getTime())) {
          return value.toISOString().slice(0, 10);
        }
        return value;
      };
      
      // Append simple fields
      Object.keys(data).forEach(key => {
        if (!['education', ...fileFields].includes(key)) {
             formData.append(key, key === 'date_of_birth' ? toDateString(data[key]) : data[key]);
        }
      });

      // Append Education
      formData.append('education', JSON.stringify(data.education));
      // Append Data Year if provided by verify toast
      if (dataYear) {
        formData.append('data_year', String(dataYear));
      }

      // Append Files
      fileFields.forEach(field => {
          if (data[field] && data[field][0]) {
              formData.append(field, data[field][0]);
          }
      });
      
      // Add Status
      formData.append('status', status);

      let regNumber = null;
      if (id) {
          await axios.put(`/api/students/update/${id}`, formData, {
            headers: { 
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}` 
            }
          });
          toast.success("Data berhasil diperbarui!");
      } else {
          const resp = await axios.post('/api/students', formData, {
            headers: { 
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}` 
            }
          });
          toast.success(status === 'Draft' ? "Draft berhasil disimpan!" : "Data siswa berhasil diverifikasi!");
          regNumber = resp.data?.registration_number || null;
      }
      toast.dismiss(toastId);
      setPreviewData({
        registration_number: regNumber,
        full_name: data.full_name,
        data_year: dataYear || new Date().getFullYear(),
        status,
      });
      setShowPreview(true);
    } catch (error) {
      console.error(error);
      toast.dismiss();
      toast.error(error.response?.data?.message || "Gagal menyimpan data");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openVerifyModal = (formValues) => {
    setPendingFormValues(formValues);
    setVerifyYear(new Date().getFullYear());
    setVerifyMode(null);
    setShowVerify(true);
    setVerifyEntering(false);
    requestAnimationFrame(() => setVerifyEntering(true));
  };

  const tabs = [
    { id: 'personal', label: '1. Data Pribadi', icon: User },
    { id: 'education', label: '2. Pendidikan', icon: GraduationCap },
    { id: 'family', label: '3. Data Keluarga', icon: Users },
    { id: 'documents', label: '4. Dokumen', icon: FileText },
    { id: 'physical', label: '5. Data Fisik', icon: HeartPulse },
  ];

  return (
    <>
    <AdminLayout>
      <div className="space-y-6 max-w-7xl mx-auto pb-20">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{id ? 'Edit Data Siswa' : 'Input Data Siswa'}</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">{id ? 'Perbarui data siswa yang sudah ada' : 'Tambahkan data siswa lengkap untuk pendaftaran baru'}</p>
          </div>
          
          <div className="bg-white dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm inline-flex">
            <button
              onClick={() => setMode('manual')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                mode === 'manual' 
                  ? 'bg-red-500 text-white shadow-md shadow-red-500/20' 
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <User size={16} />
                <span>Input Manual</span>
              </div>
            </button>
            <button
              onClick={() => setMode('scan')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                mode === 'scan' 
                  ? 'bg-red-500 text-white shadow-md shadow-red-500/20' 
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <Scan size={16} />
                <span>Smart Scan</span>
              </div>
            </button>
          </div>
        </div>

        {/* Mode: Smart Scan */}
        {mode === 'scan' && (
           <div className="max-w-2xl mx-auto mt-10">
              <div 
                className={`relative rounded-3xl border-2 border-dashed transition-all duration-300 p-10 flex flex-col items-center justify-center text-center cursor-pointer overflow-hidden group
                  ${dragActive 
                    ? 'border-red-500 bg-red-50/50 dark:bg-red-900/10' 
                    : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-red-400 dark:hover:border-red-500/50'
                  }
                `}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-upload').click()}
              >
                <input 
                  id="file-upload" 
                  type="file" 
                  className="hidden" 
                  accept=".pdf,.docx,.doc,.xlsx,.xls,.jpg,.jpeg,.png" 
                  onChange={handleChange} 
                />
                
                {isParsing ? (
                  <div className="flex flex-col items-center py-10">
                    <Loader2 size={48} className="text-red-500 animate-spin mb-4" />
                    <p className="text-lg font-medium text-slate-800 dark:text-slate-200">Menganalisis Dokumen...</p>
                    <p className="text-sm text-slate-500 mt-2">AI sedang mengekstrak data dari dokumen Anda</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center py-6">
                    <div className="h-20 w-20 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300">
                      <Upload size={32} className="text-slate-400 dark:text-slate-500 group-hover:text-red-500 transition-colors" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">Upload Dokumen Pendaftaran</h3>
                    <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto mb-6">
                      Drag & drop file PDF, Word, Excel, atau Gambar (JPG/PNG) untuk mengisi form otomatis
                    </p>
                  </div>
                )}
              </div>
           </div>
        )}

        {/* Mode: Manual Input & Split View */}
        {(mode === 'manual' || mode === 'split-view') && (
          <div className="flex flex-col lg:flex-row gap-6 animate-fadeIn">
            
            {/* Split View: Document Preview */}
            {mode === 'split-view' && filePreviewUrl && (
                <div className="w-full lg:w-[45%] lg:sticky lg:top-24 lg:h-[calc(100vh-8rem)] mb-6 lg:mb-0">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm h-[500px] lg:h-full overflow-hidden flex flex-col">
                        <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
                            <h3 className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                                <FileText size={18} />
                                Preview Dokumen
                            </h3>
                            <div className="flex gap-2">
                                <button onClick={() => setMode('manual')} className="text-xs bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 px-3 py-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors">
                                    Tutup Preview
                                </button>
                            </div>
                        </div>
                        <iframe src={filePreviewUrl} className="w-full h-full bg-slate-100 dark:bg-slate-900" title="Document Preview" />
                    </div>
                </div>
            )}

            <div className={`flex-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-[20px] shadow-sm overflow-hidden flex flex-col md:flex-row min-h-[600px]`}>
            
            {/* Sidebar Tabs */}
            <div className="w-full md:w-64 bg-slate-50/50 dark:bg-slate-900/50 border-r border-slate-200 dark:border-slate-800 p-4">
               <nav className="space-y-1">
                 {tabs.map((tab) => {
                   const Icon = tab.icon;
                   const isActive = activeTab === tab.id;
                   const hasError = 
                      (tab.id === 'personal' && (errors.full_name || errors.nik || errors.phone_number || errors.email)) ||
                      (tab.id === 'education' && errors.education) ||
                      (tab.id === 'family' && (errors.father_name || errors.mother_name)) ||
                      (tab.id === 'physical' && (errors.height || errors.weight));

                   return (
                     <button
                       key={tab.id}
                       onClick={() => setActiveTab(tab.id)}
                       type="button"
                       className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                         isActive 
                           ? 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 shadow-sm' 
                           : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                       }`}
                     >
                       <Icon size={18} />
                       {tab.label}
                       {hasError && <AlertCircle size={14} className="ml-auto text-red-500" />}
                       {isActive && !hasError && <ChevronRight size={16} className="ml-auto" />}
                     </button>
                   );
                 })}
               </nav>
            </div>

            {/* Form Content */}
            <div className="flex-1 p-6 md:p-8 overflow-y-auto max-h-[800px]">
              <form className="space-y-6">
                
                {/* 1. Data Pribadi */}
                {activeTab === 'personal' && (
                    <div className="space-y-6 animate-fadeIn">
                      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 border-b border-slate-100 pb-2 mb-4">A. Data Pribadi</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      {/* 1. Nama Lengkap */}
                      <div className="form-control">
                        <label className="label font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Nama Lengkap</label>
                        <p className="text-xs text-slate-500 dark:text-slate-400 italic mb-2">Sesuai KTP</p>
                        <input {...register("full_name", { required: "Nama lengkap harus diisi" })} className={getInputClass("full_name")} placeholder="Masukkan nama lengkap" />
                        {errors.full_name && <span className="text-xs text-red-500 mt-1">{errors.full_name.message}</span>}
                      </div>

                      {/* 2. NIK */}
                      <div className="form-control">
                         <label className="label font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Nomor KTP (NIK)</label>
                         <p className="text-xs text-slate-500 dark:text-slate-400 italic mb-2">Contoh: 3201123456780001 (16 Digit)</p>
                        <input 
                           {...register("nik", { 
                               onBlur: (e) => checkDuplicate("nik", e.target.value || '')
                           })} 
                            className={getInputClass("nik")}
                            placeholder="Masukkan 16 digit NIK" 
                            maxLength={16}
                         />
                         {errors.nik && <span className="text-xs text-red-500 mt-1">{errors.nik.message}</span>}
                      </div>

                      {/* 3. Jenis Kelamin */}
                      <div className="form-control">
                        <label className="label font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Jenis Kelamin</label>
                        <p className="text-xs text-slate-500 dark:text-slate-400 italic mb-2">Pilih jenis kelamin anda</p>
                        <select {...register("gender")} className={getInputClass("gender")}>
                          <option value="">Pilih Jenis Kelamin</option>
                          <option value="L">Laki-laki</option>
                          <option value="P">Perempuan</option>
                        </select>
                        {errors.gender && <span className="text-xs text-red-500 mt-1">{errors.gender.message}</span>}
                      </div>

                      {/* 4. Tempat Lahir */}
                      <div className="form-control">
                        <label className="label font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Tempat Lahir</label>
                        <p className="text-xs text-slate-500 dark:text-slate-400 italic mb-2">Contoh: Jakarta, Surabaya, Bandung (Sesuai KTP)</p>
                        <input {...register("place_of_birth")} className={getInputClass("place_of_birth")} placeholder="Masukkan kota kelahiran" />
                        {errors.place_of_birth && <span className="text-xs text-red-500 mt-1">{errors.place_of_birth.message}</span>}
                      </div>

                      {/* 5. Tanggal Lahir */}
                      <div className="form-control">
                        <label className="label font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Tanggal Lahir</label>
                        <p className="text-xs text-slate-500 dark:text-slate-400 italic mb-2">Format: Tanggal / Bulan / Tahun</p>
                        <Controller
                          control={control}
                          name="date_of_birth"
                          render={({ field }) => (
                            <CustomDatePicker field={field} />
                          )}
                        />
                        {errors.date_of_birth && <span className="text-xs text-red-500 mt-1">{errors.date_of_birth.message}</span>}
                      </div>

                      {/* 6. Golongan Darah */}
                      <div className="form-control">
                        <label className="label font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Golongan Darah</label>
                        <p className="text-xs text-slate-500 dark:text-slate-400 italic mb-2">Pilih golongan darah (Opsional)</p>
                        <select {...register("blood_type")} className={getInputClass("blood_type")}>
                          <option value="">Pilih Golongan Darah</option>
                          <option value="A">A</option>
                          <option value="B">B</option>
                          <option value="AB">AB</option>
                          <option value="O">O</option>
                        </select>
                      </div>

                      {/* 7. Agama */}
                      <div className="form-control">
                        <label className="label font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Agama</label>
                        <p className="text-xs text-slate-500 dark:text-slate-400 italic mb-2">Pilih agama sesuai KTP</p>
                        <select {...register("religion")} className={getInputClass("religion")}>
                          <option value="">Pilih Agama</option>
                          <option value="Islam">Islam</option>
                          <option value="Kristen">Kristen</option>
                          <option value="Katolik">Katolik</option>
                          <option value="Hindu">Hindu</option>
                          <option value="Buddha">Buddha</option>
                          <option value="Konghucu">Konghucu</option>
                        </select>
                        {errors.religion && <span className="text-xs text-red-500 mt-1">{errors.religion.message}</span>}
                      </div>

                      {/* 8. No HP */}
                      <div className="form-control">
                         <label className="label font-semibold text-slate-700 dark:text-slate-300 mb-1 block">No HP / WhatsApp</label>
                         <p className="text-xs text-slate-500 dark:text-slate-400 italic mb-2">Contoh: 08123456789 (Pastikan aktif WhatsApp)</p>
                         <input 
                           {...register("phone_number")} 
                            className={getInputClass("phone_number")}
                            placeholder="Masukkan nomor WhatsApp aktif" 
                         />
                         {errors.phone_number && <span className="text-xs text-red-500 mt-1">{errors.phone_number.message}</span>}
                      </div>

                      {/* 9. Email */}
                      <div className="form-control">
                         <label className="label font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Alamat Email</label>
                         <p className="text-xs text-slate-500 dark:text-slate-400 italic mb-2">Contoh: nama.kamu@gmail.com</p>
                         <div className="relative">
                             <input 
                                type="email" 
                                {...register("email", { 
                                    onBlur: (e) => checkDuplicate("email", e.target.value || '')
                                })} 
                                className={getInputClass("email")}
                                placeholder="Masukkan alamat email aktif" 
                             />
                             <button 
                                type="button"
                                onClick={async () => {
                                    const email = watch('email');
                                    if (!email) return;
                                    try {
                                        const params = { email };
                                        if (id) params.excludeId = id;
                                        const { data } = await axios.get('/api/students/check-email', { params });
                                        if (data.exists) toast.error("Email sudah terdaftar!");
                                        else toast.success("Email tersedia");
                                    } catch (e) {
                                        console.error(e);
                                    }
                                }}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded text-slate-600"
                            >
                                Cek
                            </button>
                         </div>
                         {errors.email && <span className="text-xs text-red-500 mt-1">{errors.email.message}</span>}
                      </div>

                      {/* 10. Status Pernikahan */}
                      <div className="form-control">
                        <label className="label font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Status Pernikahan</label>
                        <p className="text-xs text-slate-500 dark:text-slate-400 italic mb-2">Pilih status saat ini</p>
                        <select {...register("marital_status")} className={getInputClass("marital_status")}>
                          <option value="">Pilih Status</option>
                          <option value="Lajang">Lajang</option>
                          <option value="Menikah">Menikah</option>
                          <option value="Cerai Hidup">Cerai Hidup</option>
                          <option value="Cerai Mati">Cerai Mati</option>
                        </select>
                        {errors.marital_status && <span className="text-xs text-red-500 mt-1">{errors.marital_status.message}</span>}
                      </div>

                      {/* 11. Alamat - Full Width */}
                      <div className="md:col-span-2 form-control">
                        <label className="label font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Alamat Lengkap</label>
                        <p className="text-xs text-slate-500 dark:text-slate-400 italic mb-2">Contoh: Jl. Sudirman No. 123, RT 01/RW 02, Kel. Menteng, Kec. Menteng, Jakarta Pusat</p>
                        <textarea {...register("address")} className={`${getInputClass("address")} min-h-[80px]`} placeholder="Masukkan alamat lengkap sesuai domisili" />
                        {errors.address && <span className="text-xs text-red-500 mt-1">{errors.address.message}</span>}
                      </div>
                      
                      {/* 12. Photo Upload */}
                      <div className="md:col-span-2">
                         <label className="label font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Foto 3x4 (Latar Merah/Biru)</label>
                         <DocumentUpload
                            label="Upload Foto"
                            name="photo"
                            register={register}
                            watch={watch}
                            currentFile={existingFiles.photo}
                         />
                         {errors.photo && <span className="text-xs text-red-500 mt-1">{errors.photo.message}</span>}
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. Pendidikan */}
                {activeTab === 'education' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 border-b border-slate-100 pb-2 mb-4">B. Riwayat Pendidikan</h3>
                    <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300">
                      Isi sesuai riwayat sekolah. SD/MI wajib diisi, jenjang di atasnya boleh dikosongkan jika tidak ada.
                    </p>
                    <div className="hidden md:grid grid-cols-4 gap-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 font-semibold text-slate-700 dark:text-slate-300 text-sm">
                      <div>Jenjang</div>
                      <div>Nama Sekolah</div>
                      <div>Bulan Masuk</div>
                      <div>Bulan Wisuda</div>
                    </div>
                    {['SD/MI', 'SMP/MTS', 'SMA/SMK', 'D3/S1'].map((lvl, index) => {
                      return (
                        <div
                          key={lvl}
                          className="border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 transition-colors duration-150 md:hover:bg-slate-50 dark:md:hover:bg-slate-700"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start px-3 py-3">
                            <div className="flex flex-col justify-center text-sm font-semibold text-slate-800 dark:text-slate-200">
                              <span className="text-base md:text-sm">{lvl}</span>
                              <span className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                                {index === 0 ? 'Wajib diisi' : 'Opsional'}
                              </span>
                              {index > 0 && (
                                <span className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                                  Jika tidak ada jenjang ini, silakan dikosongkan (skip).
                                </span>
                              )}
                            </div>

                            <div>
                              <label className="block md:hidden text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                Nama Sekolah
                              </label>
                              <input
                                {...register(`education.${index}.school_name`)}
                                placeholder="Nama sekolah"
                                className={getInputClass(`education.${index}.school_name`)}
                              />
                              {errors.education?.[index]?.school_name && (
                                <span className="text-xs text-red-500">{errors.education[index].school_name.message}</span>
                              )}
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
                      );
                    })}
                  </div>
                )}

                {/* 3. Data Keluarga */}
                {activeTab === 'family' && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold mb-4">C. Data Orang Tua / Wali</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Nama Ayah</label>
                        <p className="text-xs text-slate-500 dark:text-slate-400 italic mb-2">Contoh: Budi Santoso</p>
                        <input
                          {...register('father_name')}
                          placeholder="Masukkan nama lengkap ayah"
                          className={`${getInputClass('father_name')} w-full ${errors.father_name ? 'border-red-500' : ''}`}
                        />
                        {errors.father_name && <span className="text-red-500 text-xs">{errors.father_name.message}</span>}
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Nama Ibu</label>
                        <p className="text-xs text-slate-500 dark:text-slate-400 italic mb-2">Contoh: Siti Aminah</p>
                        <input
                          {...register('mother_name')}
                          placeholder="Masukkan nama lengkap ibu"
                          className={`${getInputClass('mother_name')} w-full ${errors.mother_name ? 'border-red-500' : ''}`}
                        />
                        {errors.mother_name && <span className="text-red-500 text-xs">{errors.mother_name.message}</span>}
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Pekerjaan Ayah</label>
                        <p className="text-xs text-slate-500 dark:text-slate-400 italic mb-2">Contoh: Wiraswasta, PNS, Petani</p>
                        <input
                          {...register('father_job')}
                          placeholder="Masukkan pekerjaan ayah"
                          className={`${getInputClass('father_job')} w-full ${errors.father_job ? 'border-red-500' : ''}`}
                        />
                        {errors.father_job && <span className="text-red-500 text-xs">{errors.father_job.message}</span>}
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Pekerjaan Ibu</label>
                        <p className="text-xs text-slate-500 dark:text-slate-400 italic mb-2">Contoh: Ibu Rumah Tangga</p>
                        <input
                          {...register('mother_job')}
                          placeholder="Masukkan pekerjaan ibu"
                          className={`${getInputClass('mother_job')} w-full ${errors.mother_job ? 'border-red-500' : ''}`}
                        />
                        {errors.mother_job && <span className="text-red-500 text-xs">{errors.mother_job.message}</span>}
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Keadaan Ayah</label>
                        <p className="text-xs text-slate-500 dark:text-slate-400 italic mb-2">Pilih keadaan saat ini</p>
                        <select
                          {...register('father_status')}
                          className={`${getInputClass('father_status')} w-full ${errors.father_status ? 'border-red-500' : ''}`}
                        >
                          <option value="">Pilih Keadaan</option>
                          <option value="Hidup">Hidup</option>
                          <option value="Meninggal">Meninggal</option>
                        </select>
                        {errors.father_status && <span className="text-red-500 text-xs">{errors.father_status.message}</span>}
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Keadaan Ibu</label>
                        <p className="text-xs text-slate-500 dark:text-slate-400 italic mb-2">Pilih keadaan saat ini</p>
                        <select
                          {...register('mother_status')}
                          className={`${getInputClass('mother_status')} w-full ${errors.mother_status ? 'border-red-500' : ''}`}
                        >
                          <option value="">Pilih Keadaan</option>
                          <option value="Hidup">Hidup</option>
                          <option value="Meninggal">Meninggal</option>
                        </select>
                        {errors.mother_status && <span className="text-red-500 text-xs">{errors.mother_status.message}</span>}
                      </div>
                    </div>

                    <div className="mt-4">
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Alamat Orang Tua</label>
                      <p className="text-xs text-slate-500 dark:text-slate-400 italic mb-2">Contoh: Jl. Merdeka No. 45 (Sama dengan siswa)</p>
                      <textarea
                        {...register('parent_address')}
                        placeholder="Masukkan alamat lengkap orang tua"
                        className={`${getInputClass('parent_address')} w-full ${errors.parent_address ? 'border-red-500' : ''}`}
                        rows="3"
                      ></textarea>
                      {errors.parent_address && <span className="text-red-500 text-xs">{errors.parent_address.message}</span>}
                    </div>

                    <h4 className="font-bold mt-8 mb-4 border-b pb-2 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700">Data Wali</h4>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Nama Wali Siswa</label>
                        <input {...register('guardian_name')} placeholder="Masukkan nama wali siswa" className={`${getInputClass('guardian_name')} w-full`} />
                      </div>
                    </div>
                    <div className="mt-4">
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Alamat Wali</label>
                      <textarea {...register('guardian_address')} placeholder="Alamat lengkap wali" className={`${getInputClass('guardian_address')} w-full`} rows="3"></textarea>
                    </div>
                    <div className="mt-4">
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Nomor Telepon / HP</label>
                      <input {...register('guardian_phone')} placeholder="Masukkan nomor telepon/HP wali" className={`${getInputClass('guardian_phone')} w-full`} />
                    </div>
                  </div>
                )}

                {/* 4. Dokumen */}
                {activeTab === 'documents' && (
                    <div className="space-y-6 animate-fadeIn">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 border-b border-slate-100 pb-2 mb-4">D. Upload Dokumen</h3>
                        
                        <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 dark:border-blue-800 p-4 mb-6 rounded-r-lg">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-blue-500 dark:text-blue-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3 text-sm text-blue-700 dark:text-blue-400">
                                    <p className="font-bold">Catatan Penting:</p>
                                    <ul className="list-disc ml-4 mt-1">
                                        <li>Silakan upload hasil scan dari <strong>fotokopi dokumen asli</strong>.</li>
                                        <li>Format yang didukung: JPG, PNG, PDF (Maks. 2MB).</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[
                                { name: 'diploma', label: 'Ijazah Terakhir' },
                                { name: 'ktp', label: 'KTP / SIM' },
                                { name: 'health_certificate', label: 'Surat Keterangan Sehat' },
                                { name: 'consent_letter', label: 'Surat Pernyataan' },
                                { name: 'family_card', label: 'Kartu Keluarga' },
                                { name: 'birth_certificate', label: 'Akta Kelahiran' },
                            ].map((doc) => (
                                <div key={doc.name}>
                                    <label className="label font-semibold text-slate-700 dark:text-slate-300 mb-1 block">{doc.label}</label>
                                    <DocumentUpload
                                        label={`Upload ${doc.label}`}
                                        name={doc.name}
                                        register={register}
                                        watch={watch}
                                        currentFile={existingFiles[doc.name]}
                                        quantity="1 Lembar"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 5. Data Fisik */}
                {activeTab === 'physical' && (
                    <div className="space-y-6 animate-fadeIn">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 border-b border-slate-100 pb-2 mb-4">E. Tes Fisik</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="form-control">
                                <label className="label font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Apakah Memiliki Tato?</label>
                                <p className="text-xs text-slate-500 dark:text-slate-400 italic mb-2">Pilih sesuai kondisi fisik saat ini</p>
                                <select {...register("has_tattoo")} className={`${getInputClass('has_tattoo')} ${errors.has_tattoo ? 'border-red-500' : ''}`}>
                                    <option value="false">Tidak</option>
                                    <option value="true">Ya</option>
                                </select>
                                {errors.has_tattoo && <span className="text-xs text-red-500">{errors.has_tattoo.message}</span>}
                            </div>
                            <div className="form-control">
                                <label className="label font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Apakah Memiliki Tindik?</label>
                                <p className="text-xs text-slate-500 dark:text-slate-400 italic mb-2">Pilih sesuai kondisi fisik saat ini</p>
                                <select {...register("has_piercing")} className={`${getInputClass('has_piercing')} ${errors.has_piercing ? 'border-red-500' : ''}`}>
                                    <option value="false">Tidak</option>
                                    <option value="true">Ya</option>
                                </select>
                                {errors.has_piercing && <span className="text-xs text-red-500">{errors.has_piercing.message}</span>}
                            </div>
                            <div className="form-control">
                                <label className="label font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Tinggi Badan (cm)</label>
                                <p className="text-xs text-slate-500 dark:text-slate-400 italic mb-2">Contoh: 170.5</p>
                                <input 
                                    type="number" 
                                    {...register("height")} 
                                    className={`${getInputClass('height')} ${errors.height ? 'border-red-500' : ''}`} 
                                    placeholder="Masukkan tinggi badan" 
                                    step="0.01" 
                                />
                                {errors.height && <span className="text-xs text-red-500">{errors.height.message}</span>}
                            </div>
                            <div className="form-control">
                                <label className="label font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Berat Badan (kg)</label>
                                <p className="text-xs text-slate-500 dark:text-slate-400 italic mb-2">Contoh: 60.5</p>
                                <input 
                                    type="number" 
                                    {...register("weight")} 
                                    className={`${getInputClass('weight')} ${errors.weight ? 'border-red-500' : ''}`} 
                                    placeholder="Masukkan berat badan" 
                                    step="0.01" 
                                />
                                {errors.weight && <span className="text-xs text-red-500">{errors.weight.message}</span>}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-8 flex justify-end gap-4">
                             <button
                                type="button"
                                onClick={handleSubmit((data) => onSubmit(data, 'Draft'))}
                                disabled={isSubmitting}
                                className="bg-slate-500 hover:bg-slate-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-slate-500/20 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                             >
                                {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : <Archive size={20} />}
                                Simpan Draft
                             </button>

            <button
               type="button"
               onClick={handleSubmit((data) => openVerifyModal(data))}
                                disabled={isSubmitting}
                                className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-red-600/20 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                             >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 size={20} className="animate-spin" />
                                        Menyimpan...
                                    </>
                                ) : (
                                    <>
                                        <Save size={20} />
                                        Simpan & Verifikasi
                                    </>
                                )}
                             </button>
                        </div>
                    </div>
                )}

              </form>
            </div>
          </div>
          </div>
        )}
      </div>
    </AdminLayout>
    {showPreview && previewData && (
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-red-200 dark:border-slate-700 w-[520px] md:w-[600px] p-6 transition-all duration-200">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">🎌</span>
            <div>
              <div className="text-[10px] tracking-widest text-red-600 font-bold">確認</div>
              <div className="text-base font-bold text-slate-800 dark:text-slate-200">Pratinjau Tersimpan</div>
            </div>
          </div>
          <div className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">Nama</span>
              <span className="font-semibold dark:text-slate-200">{previewData.full_name || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">No. Reg</span>
              <span className="font-mono bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded">{previewData.registration_number || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">Tahun Data</span>
              <span className="font-semibold dark:text-slate-200">{previewData.data_year}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">Status</span>
              <span className="font-semibold dark:text-slate-200">{previewData.status}</span>
            </div>
          </div>
          <div className="mt-5 flex justify-end gap-2">
            <button
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 font-semibold text-slate-700 dark:text-slate-200"
              onClick={() => setShowPreview(false)}
            >
              Tutup
            </button>
            <button
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold"
              onClick={() => setShowPreview(false)}
            >
              Lanjut
            </button>
          </div>
        </div>
      </div>
    )}
    {showVerify && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 dark:bg-black/50">
        <div className={`rounded-2xl shadow-2xl border border-red-200 dark:border-slate-700 bg-white dark:bg-slate-800 w-[420px] md:w-[560px] p-6 transition-all duration-200 ${verifyEntering ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-2'}`}>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">🎌</span>
            <div>
              <div className="text-[10px] tracking-widest text-red-600 font-bold">確認</div>
              <div className="text-base font-bold text-slate-800 dark:text-slate-200">Data Baru atau Data Lama?</div>
            </div>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 mb-4">
            Pilih kategori data. Untuk Data Lama, pilih tahun rujukannya.
          </p>
          {verifyMode === 'lama' ? (
            <>
              <label className="text-xs text-slate-600 dark:text-slate-300 mb-1">Tahun Data Lama</label>
              <select
                value={verifyYear}
                onChange={(e) => setVerifyYear(e.target.value)}
                className={`${getInputClass('__verify_year')} w-full mb-4`}
              >
                {Array.from({ length: 30 }).map((_, i) => {
                  const y = new Date().getFullYear() - i;
                  return <option key={y} value={y}>{y}</option>;
                })}
              </select>
              <div className="flex justify-end gap-2">
                <button
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 font-semibold text-slate-700 dark:text-slate-200"
                  onClick={() => { setShowVerify(false); }}
                >
                  Batal
                </button>
                <button
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold"
                  onClick={() => {
                    setShowVerify(false);
                    const payload = { ...(pendingFormValues || {}), __data_year: String(verifyYear) };
                    onSubmit(payload, 'Terverifikasi');
                  }}
                >
                  Lanjut
                </button>
              </div>
            </>
          ) : (
            <div className="flex gap-2">
              <button
                className="px-4 py-2 rounded-xl font-semibold border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 w-1/2 text-slate-700 dark:text-slate-200"
                onClick={() => setVerifyMode('lama')}
              >
                Data Lama
              </button>
              <button
                className="px-4 py-2 rounded-xl font-semibold bg-red-600 hover:bg-red-700 text-white w-1/2"
                onClick={() => {
                  setShowVerify(false);
                  const payload = { ...(pendingFormValues || {}), __data_year: String(new Date().getFullYear()) };
                  onSubmit(payload, 'Terverifikasi');
                }}
              >
                Data Baru
              </button>
            </div>
          )}
        </div>
      </div>
    )}
    </>
  );
};

export default StaffInputData;
