import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { Plus, Trash, Calendar, Save, LogOut, Bell, CheckCircle2, XCircle, Clock, ChevronRight, User, BookOpen, Users, FileText, Activity, Download, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DocumentUpload, CustomDatePicker, JapaneseDateGroup } from '../components/FormComponents';
import { useAlert } from '../context/AlertContext';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { toPng } from 'html-to-image';
import QRCode from 'qrcode';
import heroBg from '../assets/img/hero-lpk-doryouku.png';
import Logo from '../assets/img/SKYBRIDGE_LOGO.webp';

/* ─── Status helpers ─── */
const statusMeta = (status = '') => {
    const s = String(status || '').trim().toLowerCase();
    if (s === 'diterima')       return { label: 'Diterima',           icon: CheckCircle2, cls: 'bg-emerald-500/15 text-emerald-600 ring-emerald-400/30' };
    if (s === 'ditolak')        return { label: 'Ditolak',            icon: XCircle,      cls: 'bg-rose-500/15 text-rose-600 ring-rose-400/30'           };
    if (s === 'terverifikasi')  return { label: 'Terverifikasi',      icon: CheckCircle2, cls: 'bg-sky-500/15 text-sky-600 ring-sky-400/30'              };
    return { label: status || 'Menunggu Verifikasi', icon: Clock, cls: 'bg-amber-500/15 text-amber-700 ring-amber-400/30' };
};

const StatusBadge = ({ status }) => {
    const meta = statusMeta(status);
    const Icon = meta.icon;
    return (
        <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[11px] font-bold ring-1 ${meta.cls}`}>
            <Icon size={12} />{meta.label}
        </span>
    );
};

/* ─── Tab config ─── */
const TABS = [
    { id: 'personal',  label: 'Data Pribadi',       kanji: '個人情報', icon: User      },
    { id: 'education', label: 'Riwayat Pendidikan',  kanji: '教育歴',   icon: BookOpen  },
    { id: 'family',    label: 'Data Keluarga',        kanji: '保護者',   icon: Users     },
    { id: 'documents', label: 'Dokumen',              kanji: '書類',     icon: FileText  },
    { id: 'physical',  label: 'Test Fisik',           kanji: '体力測定', icon: Activity  },
];

const Label = ({ children }) => (
    <label style={{ display:'block', fontSize:13, fontWeight:700, color:'#374151', marginBottom:3 }}>{children}</label>
);

/* ─── Portal: render ke document.body, bypass semua z-index parent ─── */
const Portal = ({ children }) => createPortal(children, document.body);

/* ─── Notif key helper — PERBAIKAN UTAMA ─── */
// Selalu konsisten pakai id jika ada, fallback ke registration_number
const getNotifKey = (data) => {
    if (!data) return 'studentNotifications:unknown';
    const uid = data.id || data.registration_number || 'unknown';
    return `studentNotifications:${uid}`;
};

const loadNotifs = (data) => {
    try {
        const raw = localStorage.getItem(getNotifKey(data));
        const parsed = JSON.parse(raw || '[]');
        return Array.isArray(parsed) ? parsed : [];
    } catch { return []; }
};

const saveNotifs = (data, notifs) => {
    try {
        localStorage.setItem(getNotifKey(data), JSON.stringify(notifs));
    } catch (e) { void e; }
};

const StudentDashboard = () => {
    const navigate  = useNavigate();
    const { showAlert } = useAlert();

    const [student,       setStudent]       = useState(() => {
        try {
            const stored = localStorage.getItem('studentData');
            return stored ? JSON.parse(stored) : null;
        } catch { return null; }
    });
    const [loading,         setLoading]         = useState(true);
    const [activeTab,       setActiveTab]       = useState('personal');
    const [isSubmitting,    setIsSubmitting]    = useState(false);
    const [photoPreview,    setPhotoPreview]    = useState(null);
    const [notifications,   setNotifications]   = useState([]);
    const [isNotifOpen,     setIsNotifOpen]     = useState(false);
    const [selectedNotif,   setSelectedNotif]   = useState(null);
    const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
    const [isDownloadingCard,   setIsDownloadingCard]   = useState(false);
    const [qrDataUrl, setQrDataUrl] = useState('');
    const cardRef = useRef(null);

    const { register, control, handleSubmit, watch, reset } = useForm({ defaultValues: { education: [] } });
    const { fields, append, remove } = useFieldArray({ control, name: 'education' });

    const studentRef      = useRef(student);
    const notificationsRef = useRef(notifications);

    useEffect(() => { studentRef.current = student; }, [student]);
    useEffect(() => { notificationsRef.current = notifications; }, [notifications]);

    useEffect(() => {
        let cancelled = false;
        const reg = student?.registration_number;
        const name = student?.full_name;
        if (!reg) {
            setQrDataUrl('');
            return;
        }
        const payload = JSON.stringify({
            v: 1,
            type: 'student',
            id: student?.id ?? null,
            registration_number: reg,
            name: name || '',
        });
        QRCode.toDataURL(payload, {
            errorCorrectionLevel: 'H',
            margin: 2,
            width: 512,
            color: { dark: '#111827', light: '#ffffff' },
        }).then((url) => {
            if (!cancelled) setQrDataUrl(url);
        }).catch(() => {
            if (!cancelled) setQrDataUrl('');
        });
        return () => { cancelled = true; };
    }, [student?.registration_number, student?.full_name, student?.id]);

    /* ─── Fetch ─── */
    const fetchStudentData = async (isInitialLoad = false) => {
        try {
            const storedData = localStorage.getItem('studentData');
            if (!storedData) {
                if (isInitialLoad) navigate('/student/check-status');
                return;
            }
            const parsedData = JSON.parse(storedData);

            // Load notifs from localStorage on first load
            const existingNotifs = isInitialLoad ? loadNotifs(parsedData) : notificationsRef.current;
            if (isInitialLoad) setNotifications(existingNotifs);

            const response  = await axios.post('/api/students/login', {
                registration_number: parsedData.registration_number,
                nik: parsedData.nik,
            });
            const freshData = response.data.student;

            const currentStudent = isInitialLoad ? parsedData : (studentRef.current || parsedData);
            const prevStatus = String(currentStudent.status || '');
            const nextStatus = String(freshData.status || '');
            const prevNotes  = String(currentStudent.admin_notes || '');
            const nextNotes  = String(freshData.admin_notes || '');

            let updatedNotifs = [...existingNotifs];
            let hasNewNotif   = false;

            if (prevStatus && nextStatus && prevStatus !== nextStatus) {
                const newNotif = {
                    id: `${Date.now()}-status-${Math.random().toString(16).slice(2)}`,
                    type: 'status',
                    title: 'Status pendaftaran diperbarui',
                    from: prevStatus,
                    to: nextStatus,
                    createdAt: new Date().toISOString(),
                    read: false,
                };
                updatedNotifs  = [newNotif, ...updatedNotifs];
                hasNewNotif    = true;
                showAlert(`Status kamu berubah: ${prevStatus} → ${nextStatus}`, 'success', 'Update Status');
            }

            if (nextNotes && prevNotes !== nextNotes) {
                const newNotif = {
                    id: `${Date.now()}-notes-${Math.random().toString(16).slice(2)}`,
                    type: 'notes',
                    title: 'Catatan Baru dari Admin',
                    notes: nextNotes,
                    createdAt: new Date().toISOString(),
                    read: false,
                };
                updatedNotifs = [newNotif, ...updatedNotifs];
                hasNewNotif   = true;
                showAlert('Ada catatan baru dari admin', 'info', 'Catatan Admin');
            }

            if (hasNewNotif) {
                updatedNotifs = updatedNotifs.slice(0, 20);
                setNotifications(updatedNotifs);
                // Simpan pakai key dari freshData (paling akurat)
                saveNotifs(freshData, updatedNotifs);
            }

            const hasDataChanged   = JSON.stringify(currentStudent) !== JSON.stringify(freshData);
            if (isInitialLoad || hasNewNotif || hasDataChanged) {
                setStudent(freshData);
                localStorage.setItem('studentData', JSON.stringify(freshData));
            }

            if (isInitialLoad) {
                reset({
                    ...freshData,
                    ...freshData.family,
                    diploma:            freshData.documents?.diploma_path,
                    ktp:                freshData.documents?.ktp_path,
                    family_card:        freshData.documents?.family_card_path,
                    birth_certificate:  freshData.documents?.birth_certificate_path,
                    health_certificate: freshData.documents?.health_certificate_path,
                    consent_letter:     freshData.documents?.consent_letter_path,
                    has_tattoo:   (freshData.has_tattoo  === 1 || freshData.has_tattoo  === '1' || freshData.has_tattoo  === true || freshData.has_tattoo  === 'true') ? 'true' : 'false',
                    has_piercing: (freshData.has_piercing === 1 || freshData.has_piercing === '1' || freshData.has_piercing === true || freshData.has_piercing === 'true') ? 'true' : 'false',
                    education: freshData.education,
                });
                if (freshData.photo_path) {
                    const baseUrl = (import.meta.env.VITE_API_URL || '').replace('/api', '');
                    setPhotoPreview(`${baseUrl}/${freshData.photo_path.replace(/\\/g, '/')}`);
                }
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            if (isInitialLoad) navigate('/student/check-status');
        } finally {
            if (isInitialLoad) setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudentData(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (loading) return;
        const intervalId  = setInterval(() => fetchStudentData(false), 10000);
        const handleFocus = () => fetchStudentData(false);
        window.addEventListener('focus', handleFocus);
        return () => { clearInterval(intervalId); window.removeEventListener('focus', handleFocus); };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loading]);

    /* ─── Lock scroll saat notif terbuka ─── */
    useEffect(() => {
        document.body.style.overflow = (isNotifOpen || selectedNotif || isLogoutConfirmOpen) ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isNotifOpen, selectedNotif, isLogoutConfirmOpen]);

    /* ─── Photo preview ─── */
    const photoWatch = watch('photo');
    useEffect(() => {
        if (photoWatch && photoWatch.length > 0 && typeof photoWatch !== 'string') {
            const url = URL.createObjectURL(photoWatch[0]);
            setPhotoPreview(url);
            return () => URL.revokeObjectURL(url);
        }
    }, [photoWatch]);

    /* ─── Submit ─── */
    const onSubmit = async (data) => {
        const currentStudent = student || JSON.parse(localStorage.getItem('studentData') || '{}');
        if (!currentStudent.id) {
            showAlert('Sesi berakhir, silakan login kembali', 'error', 'Sesi Habis');
            navigate('/student/check-status');
            return;
        }
        setIsSubmitting(true);
        try {
            const formData = new FormData();
            Object.keys(data).forEach(key => {
                if (!['education','photo','diploma','ktp','family_card','birth_certificate','health_certificate','consent_letter'].includes(key)) {
                    if (data[key] !== null && data[key] !== undefined) {
                        if (key === 'date_of_birth') {
                            const d = new Date(data[key]);
                            formData.append(key, `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`);
                        } else { formData.append(key, data[key]); }
                    }
                }
            });
            formData.append('education', JSON.stringify(data.education));
            if (data.photo?.[0] instanceof File)              formData.append('photo',              data.photo[0]);
            if (data.diploma?.[0] instanceof File)            formData.append('diploma',            data.diploma[0]);
            if (data.ktp?.[0] instanceof File)                formData.append('ktp',                data.ktp[0]);
            if (data.family_card?.[0] instanceof File)        formData.append('family_card',        data.family_card[0]);
            if (data.birth_certificate?.[0] instanceof File)  formData.append('birth_certificate',  data.birth_certificate[0]);
            if (data.health_certificate?.[0] instanceof File) formData.append('health_certificate', data.health_certificate[0]);
            if (data.consent_letter?.[0] instanceof File)     formData.append('consent_letter',     data.consent_letter[0]);

            await axios.put(`/api/students/update/${currentStudent.id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            showAlert('Data pendaftaran kamu berhasil disimpan!', 'success', 'Simpan Berhasil');

            const response  = await axios.post('/api/students/login', { registration_number: currentStudent.registration_number, nik: currentStudent.nik });
            const freshData = response.data.student;
            setStudent(freshData);
            localStorage.setItem('studentData', JSON.stringify(freshData));
        } catch (error) {
            console.error('Submit error:', error);
            showAlert('Gagal memperbarui data: ' + (error.response?.data?.message || error.message), 'error', 'Update Gagal');
        } finally { setIsSubmitting(false); }
    };

    /* ─── Notif helpers ─── */
    const markAllRead = () => {
        const next = notifications.map(n => ({ ...n, read: true }));
        setNotifications(next);
        saveNotifs(student, next);
    };

    const markOneRead = (id) => {
        const next = notifications.map(n => n.id === id ? { ...n, read: true } : n);
        setNotifications(next);
        saveNotifs(student, next);
    };

    /* ─── Download card ─── */
    const handleDownloadCard = async () => {
        if (!student?.registration_number) return;
        let target = cardRef.current || document.getElementById('reg-card-download');
        if (!target) return;
        setIsDownloadingCard(true);
        try {
            const dataUrl = await toPng(target, { cacheBust: true, pixelRatio: 3, backgroundColor: '#ffffff' });
            const link = document.createElement('a');
            link.download = `KARTU-SKYBRIDGE-${student.registration_number}.png`;
            link.href = dataUrl;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            showAlert('Kartu peserta berhasil diunduh!', 'success', 'Download Berhasil');
        } catch (error) {
            console.error('Download error:', error);
            showAlert('Gagal menyiapkan kartu.', 'error', 'Download Gagal');
        } finally { setIsDownloadingCard(false); }
    };

    const handleLogout = () => { localStorage.removeItem('studentData'); navigate('/'); };

    /* ─── Loading screen ─── */
    if (loading) return (
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100vh', background:'#FDF8F0', fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
            <div style={{ width:48, height:48, border:'4px solid #F3F4F6', borderTop:'4px solid #D0021B', borderRadius:'50%', animation:'spin 0.8s linear infinite', marginBottom:16 }} />
            <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:20, color:'#D0021B', letterSpacing:'0.08em' }}>MEMUAT DATA...</div>
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
    );

    const unreadCount = notifications.filter(n => !n.read).length;
    const statusInfo  = statusMeta(student?.status);
    const StatusIcon  = statusInfo.icon;
    const cardSerial = student?.registration_number || '-';
    const registrationDateText = student?.created_at
        ? new Date(student.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
        : '-';

    return (
        <div className="db-root">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Noto+Sans+JP:wght@500;700;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

                :root {
                    --red:      #D0021B;
                    --red-dark: #A50015;
                    --gold-lt:  #F5A623;
                    --cream:    #FDF8F0;
                    --ink:      #1C1C1C;
                    --muted:    #6B7280;
                    --border:   #E5E7EB;
                    --white:    #FFFFFF;
                }

                * { box-sizing: border-box; }

                .db-root {
                    font-family: 'Plus Jakarta Sans', sans-serif;
                    min-height: 100vh;
                    background: var(--cream);
                }

                .db-hero {
                    background: linear-gradient(135deg, rgba(26,0,5,0.9) 0%, rgba(45,0,8,0.9) 55%, rgba(26,9,0,0.9) 100%), url(${heroBg}) center/cover no-repeat;
                    position: relative;
                    overflow: hidden;
                    padding: 24px 20px 80px;
                }
                .hero-inner {
                    position: relative;
                    z-index: 2;
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                    max-width: 1000px;
                    margin: 0 auto;
                }
                @media (min-width: 768px) {
                    .hero-inner { flex-direction: row; justify-content: space-between; align-items: flex-start; }
                }

                .status-chip {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    padding: 6px 14px;
                    border-radius: 100px;
                    font-size: 12px;
                    font-weight: 800;
                    backdrop-filter: blur(4px);
                    border: 1px solid rgba(255,255,255,0.12);
                    background: rgba(255,255,255,0.08);
                    color: white;
                }
                .hero-name { font-family: 'Bebas Neue', sans-serif; font-size: clamp(32px, 5vw, 48px); color: white; letter-spacing: 0.04em; line-height: 1; margin-bottom: 6px; }
                .hero-actions { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 8px; }
                @media (max-width: 767px) {
                    .hero-actions {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 12px;
                        width: 100%;
                        margin-top: 12px;
                    }
                }

                .btn-notif {
                    position: relative;
                    display: inline-flex;
                    align-items: center;
                    gap: 7px;
                    padding: 10px 18px;
                    border-radius: 14px;
                    background: rgba(255,255,255,0.1);
                    border: 1px solid rgba(255,255,255,0.15);
                    color: white;
                    font-weight: 700;
                    font-size: 13px;
                    cursor: pointer;
                    font-family: 'Plus Jakarta Sans', sans-serif;
                }
                @media (max-width: 767px) {
                    .btn-notif {
                        width: 100%;
                        justify-content: center;
                        background: linear-gradient(180deg, rgba(255,255,255,0.9), rgba(255,255,255,0.82));
                        color: #1C1C1C;
                        border: 1px solid rgba(226,232,240,0.9);
                        box-shadow: 0 10px 30px rgba(2,6,23,0.12);
                    }
                    .btn-notif svg { color: var(--red); }
                }
                .notif-badge {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    min-width: 18px;
                    height: 18px;
                    padding: 0 4px;
                    border-radius: 100px;
                    background: var(--gold-lt);
                    color: #1A0005;
                    font-size: 10px;
                    font-weight: 900;
                }
                .btn-logout {
                    display: inline-flex;
                    align-items: center;
                    gap: 7px;
                    padding: 10px 18px;
                    border-radius: 14px;
                    background: rgba(255,255,255,0.08);
                    border: 1px solid rgba(255,255,255,0.12);
                    color: rgba(255,255,255,0.85);
                    font-weight: 700;
                    font-size: 13px;
                    cursor: pointer;
                    font-family: 'Plus Jakarta Sans', sans-serif;
                }
                @media (max-width: 767px) {
                    .btn-logout {
                        width: 100%;
                        justify-content: center;
                        grid-column: 1 / -1;
                        background: linear-gradient(180deg, rgba(255,255,255,0.9), rgba(255,255,255,0.82));
                        color: #1C1C1C;
                        border: 1px solid rgba(226,232,240,0.9);
                        box-shadow: 0 10px 30px rgba(2,6,23,0.12);
                    }
                    .btn-logout svg { color: #6B7280; }
                }

                .db-card {
                    max-width: 1000px;
                    margin: -44px auto 48px;
                    background: var(--white);
                    border-radius: 24px;
                    box-shadow: 0 24px 80px rgba(0,0,0,0.08);
                    overflow: hidden;
                    position: relative;
                    z-index: 5;
                }
                @media (max-width: 1040px) { .db-card { margin-left: 16px; margin-right: 16px; } }

                .tab-bar {
                    display: flex;
                    overflow-x: auto;
                    -webkit-overflow-scrolling: touch;
                    border-bottom: 1px solid var(--border);
                    padding: 0 8px;
                    background: var(--white);
                    scrollbar-width: none;
                }
                .tab-bar::-webkit-scrollbar { display: none; }
                .tab-btn {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 4px;
                    padding: 16px 20px 14px;
                    font-weight: 700;
                    color: var(--muted);
                    border: none;
                    background: none;
                    cursor: pointer;
                    position: relative;
                    transition: all 0.2s;
                    white-space: nowrap;
                    flex-shrink: 0;
                    font-family: 'Plus Jakarta Sans', sans-serif;
                }
                .tab-btn.active { color: var(--red); background: #FEF2F2; border-radius: 12px 12px 0 0; }
                .tab-btn.active::after { content: ''; position: absolute; bottom: -1px; left: 0; right: 0; height: 3px; background: var(--red); }

                .form-area { padding: 32px; }
                .sec-hdr { display: flex; align-items: center; gap: 16px; margin-bottom: 28px; padding-bottom: 20px; border-bottom: 1px solid var(--border); }
                .sec-icon { width: 52px; height: 52px; border-radius: 14px; background: linear-gradient(135deg, var(--red), var(--red-dark)); color: white; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
                .sec-title { font-family: 'Bebas Neue', sans-serif; font-size: 26px; color: var(--ink); }
                
                @media (max-width: 767px) {
                    .form-area { padding: 20px 16px; }
                }

                /* ─── Card Preview ─── */
                .reg-card-preview-wrap {
                    margin-top: 24px;
                    border-radius: 28px;
                    padding: 18px;
                    width: 100%;
                    max-width: 440px;
                    background: rgba(255,255,255,0.22);
                    border: 1px solid rgba(255,255,255,0.5);
                    box-shadow: 0 18px 60px rgba(2,6,23,0.16);
                    backdrop-filter: blur(14px);
                }
                .reg-card-preview {
                    border-radius: 24px;
                    overflow: hidden;
                    background: #ffffff;
                    border: 1px solid rgba(226,232,240,0.9);
                    box-shadow: 0 24px 70px rgba(2,6,23,0.18);
                    position: relative;
                }
                .reg-card-preview-top {
                    position: relative;
                    padding: 18px 18px 16px;
                    background: linear-gradient(135deg, #8B0012 0%, #D0021B 40%, #1A0005 100%);
                    color: white;
                    overflow: hidden;
                }
                .reg-card-preview-top::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background-image:
                        repeating-linear-gradient(45deg, rgba(245,166,35,0.10) 0px, rgba(245,166,35,0.10) 1px, transparent 1px, transparent 28px),
                        repeating-linear-gradient(-45deg, rgba(255,255,255,0.06) 0px, rgba(255,255,255,0.06) 1px, transparent 1px, transparent 28px);
                    opacity: 0.65;
                    pointer-events: none;
                }
                .reg-card-preview-top::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: radial-gradient(circle at 20% 0%, rgba(255,255,255,0.18), transparent 45%), radial-gradient(circle at 80% 10%, rgba(245,166,35,0.18), transparent 40%);
                    pointer-events: none;
                }
                .gold-strip { position: absolute; left: 0; top: 0; height: 100%; width: 10px; background: linear-gradient(to bottom, rgba(245,166,35,0.95), rgba(200,134,10,0.65)); }
                .reg-card-preview-head { position: relative; display: grid; grid-template-columns: 1fr auto; align-items: center; gap: 12px; }
                .reg-card-preview-brand { display: flex; align-items: center; gap: 12px; min-width: 0; }
                .reg-card-preview-logo {
                    width: 46px;
                    height: 46px;
                    border-radius: 16px;
                    background: rgba(255,255,255,0.14);
                    border: 1px solid rgba(255,255,255,0.22);
                    backdrop-filter: blur(10px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    overflow: hidden;
                    flex-shrink: 0;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.18);
                }
                .reg-card-preview-logo img { width: 30px; height: 30px; object-fit: contain; filter: drop-shadow(0 6px 10px rgba(0,0,0,0.25)); }
                .reg-card-preview-title { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 20px; font-weight: 900; letter-spacing: 0.02em; line-height: 1.1; }
                .reg-card-preview-sub { font-size: 10px; opacity: 0.85; margin-top: 2px; letter-spacing: 0.18em; text-transform: uppercase; }
                .reg-card-preview-stamp {
                    width: 46px;
                    height: 46px;
                    border-radius: 16px;
                    border: 1.5px solid rgba(245,166,35,0.85);
                    color: rgba(245,166,35,0.98);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-family: 'Noto Sans JP', sans-serif;
                    font-weight: 900;
                    font-size: 16px;
                    background: rgba(255,255,255,0.10);
                    backdrop-filter: blur(10px);
                    box-shadow: 0 10px 28px rgba(0,0,0,0.18);
                    flex-shrink: 0;
                }
                .reg-card-preview-body {
                    padding: 18px 18px 16px;
                    background:
                        radial-gradient(circle at 80% 0%, rgba(208,2,27,0.06), transparent 35%),
                        radial-gradient(circle at 0% 80%, rgba(245,166,35,0.06), transparent 38%),
                        repeating-linear-gradient(45deg, rgba(2,6,23,0.025) 0px, rgba(2,6,23,0.025) 1px, transparent 1px, transparent 26px);
                }
                .reg-card-main { display: grid; grid-template-columns: 96px 1fr; gap: 16px; align-items: center; }
                .reg-card-photo {
                    width: 96px;
                    height: 120px;
                    border-radius: 18px;
                    overflow: hidden;
                    background: linear-gradient(135deg, rgba(208,2,27,0.14), rgba(245,166,35,0.10));
                    border: 1px solid rgba(226,232,240,0.95);
                    box-shadow: 0 18px 40px rgba(2,6,23,0.14);
                }
                .reg-card-photo img { width: 100%; height: 100%; object-fit: cover; display: block; }
                .reg-card-info { min-width: 0; }
                .reg-card-label { font-size: 10px; font-weight: 900; letter-spacing: 0.18em; text-transform: uppercase; color: #64748B; }
                .reg-card-name { font-size: 18px; font-weight: 900; color: #0F172A; letter-spacing: 0.01em; line-height: 1.2; margin-top: 4px; }
                .reg-card-reg { font-size: 13px; font-weight: 800; color: #D0021B; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; margin-top: 6px; }
                .reg-card-divider { height: 1px; width: 100%; background: linear-gradient(to right, transparent, rgba(148,163,184,0.55), transparent); margin: 14px 0; }
                .reg-card-meta { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
                .reg-card-meta-item { padding: 12px 12px; border-radius: 16px; background: rgba(255,255,255,0.8); border: 1px solid rgba(226,232,240,0.9); box-shadow: 0 10px 30px rgba(2,6,23,0.06); }
                .reg-card-meta-k { font-size: 10px; font-weight: 900; letter-spacing: 0.16em; text-transform: uppercase; color: #64748B; }
                .reg-card-meta-v { margin-top: 6px; font-size: 13px; font-weight: 900; color: #0F172A; line-height: 1.2; }
                .reg-card-status { display: inline-flex; align-items: center; justify-content: center; padding: 6px 10px; border-radius: 999px; background: rgba(5,150,105,0.14); border: 1px solid rgba(5,150,105,0.25); color: #047857; font-weight: 900; font-size: 12px; letter-spacing: 0.01em; }
                .reg-card-bottom { display: flex; align-items: flex-end; justify-content: space-between; gap: 12px; margin-top: 14px; }
                .reg-card-micro { min-width: 0; }
                .reg-card-serial { font-size: 10px; font-weight: 900; letter-spacing: 0.16em; text-transform: uppercase; color: #94A3B8; }
                .reg-card-tagline { margin-top: 6px; font-size: 11px; color: #64748B; line-height: 1.4; }
                .reg-card-qr { width: 82px; height: 82px; padding: 8px; border-radius: 18px; background: rgba(255,255,255,0.92); border: 1px solid rgba(226,232,240,0.95); box-shadow: 0 18px 50px rgba(2,6,23,0.10); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
                .reg-card-qr img { width: 100%; height: 100%; object-fit: contain; image-rendering: pixelated; }
                .reg-card-qr-ph { width: 100%; height: 100%; border-radius: 12px; background: repeating-linear-gradient(90deg, rgba(2,6,23,0.08) 0px, rgba(2,6,23,0.08) 6px, transparent 6px, transparent 12px); }
                .reg-card-preview-foot { margin-top: 14px; font-size: 11px; color: #64748B; line-height: 1.5; text-align: center; }
                .reg-card-actions { margin-top: 16px; display: flex; gap: 12px; justify-content: center; }
                .reg-card-btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 12px 24px; border-radius: 100px; background: linear-gradient(135deg, #059669, #047857); color: white; font-weight: 800; font-size: 14px; cursor: pointer; border: none; box-shadow: 0 10px 25px rgba(5,150,105,0.3); font-family: 'Plus Jakarta Sans', sans-serif; }
                .reg-card-btn:disabled { background: #D1D5DB; box-shadow: none; cursor: not-allowed; }

                .db-input { width: 100%; padding: 10px 14px; border-radius: 12px; border: 1.5px solid var(--border); font-size: 13.5px; font-weight: 500; outline: none; font-family: 'Plus Jakarta Sans', sans-serif; }
                .db-input:focus { border-color: var(--red); }
                .db-input.readonly { background: #F9FAFB; color: #6B7280; cursor: not-allowed; }

                .edu-card { border: 1.5px solid var(--border); border-radius: 20px; padding: 24px; background: var(--white); position: relative; margin-bottom: 20px; }
                .btn-del { position: absolute; top: 16px; right: 16px; width: 36px; height: 36px; border-radius: 50%; background: #FEE2E2; color: var(--red); border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; }
                .btn-add { display: inline-flex; align-items: center; gap: 8px; padding: 12px 24px; border-radius: 100px; border: 2px dashed rgba(208,2,27,0.3); background: #FEF2F2; color: var(--red); font-weight: 700; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; }

                /* ─── Save button ─── */
                .btn-save {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    padding: 16px 56px;
                    border-radius: 100px;
                    background: linear-gradient(135deg, #FF1F3A 0%, #D0021B 50%, #8B0012 100%);
                    color: white;
                    font-weight: 800;
                    border: none;
                    cursor: pointer;
                    box-shadow: 0 10px 30px rgba(208,2,27,0.3), inset 0 0 0 1px rgba(255,255,255,0.2);
                    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    font-family: 'Plus Jakarta Sans', sans-serif;
                }
                .btn-save:hover:not(:disabled) { transform: translateY(-4px) scale(1.02); box-shadow: 0 20px 40px rgba(208,2,27,0.45); }
                .btn-save:disabled { background: #9CA3AF; box-shadow: none; cursor: not-allowed; }
                .save-content { display: flex; align-items: center; gap: 14px; }
                .save-icon-wrapper { display: flex; align-items: center; justify-content: center; width: 34px; height: 34px; border-radius: 50%; background: rgba(255,255,255,0.2); flex-shrink: 0; }
                .save-text-container { display: flex; flex-direction: column; align-items: flex-start; }
                .save-text-main { font-size: 16px; font-weight: 900; line-height: 1; }
                .save-text-jp { font-size: 10px; opacity: 0.8; font-weight: 700; letter-spacing: 0.1em; margin-top: 2px; font-family: 'Noto Sans JP', sans-serif; }

                /* ─── NOTIFIKASI BOTTOM SHEET ─── */
                .notif-overlay {
                    position: fixed;
                    inset: 0;
                    background: rgba(0,0,0,0.55);
                    backdrop-filter: blur(6px);
                    -webkit-backdrop-filter: blur(6px);
                    z-index: 9000;
                    touch-action: none;
                }
                .notif-sheet {
                    position: fixed;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    z-index: 9001;
                    background: #ffffff;
                    border-radius: 28px 28px 0 0;
                    max-height: 88vh;
                    display: flex;
                    flex-direction: column;
                    box-shadow: 0 -8px 40px rgba(0,0,0,0.18);
                    overflow: hidden;
                    /* Center on large screens */
                    max-width: 560px;
                    margin: 0 auto;
                }
                .notif-sheet-handle {
                    width: 44px;
                    height: 5px;
                    background: #D1D5DB;
                    border-radius: 10px;
                    margin: 14px auto 0;
                    flex-shrink: 0;
                }
                .notif-sheet-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 16px 20px 14px;
                    border-bottom: 1px solid #F3F4F6;
                    flex-shrink: 0;
                    background: #fff;
                }
                .notif-sheet-title {
                    font-family: 'Bebas Neue', sans-serif;
                    font-size: 22px;
                    color: var(--ink);
                    letter-spacing: 0.08em;
                }
                .notif-sheet-actions { display: flex; align-items: center; gap: 10px; }
                .notif-mark-all-btn {
                    font-size: 12px;
                    font-weight: 700;
                    color: var(--red);
                    background: #FEF2F2;
                    border: none;
                    padding: 6px 14px;
                    border-radius: 100px;
                    cursor: pointer;
                    font-family: 'Plus Jakarta Sans', sans-serif;
                }
                .notif-close-btn {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    background: #F3F4F6;
                    border: none;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    color: #374151;
                }
                .notif-list {
                    overflow-y: auto;
                    -webkit-overflow-scrolling: touch;
                    flex: 1;
                    overscroll-behavior: contain;
                    padding-bottom: env(safe-area-inset-bottom, 16px);
                }
                .notif-list::-webkit-scrollbar { width: 0; }
                .notif-empty {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 56px 24px;
                    color: #9CA3AF;
                    gap: 12px;
                }
                .notif-empty-icon {
                    width: 64px;
                    height: 64px;
                    border-radius: 20px;
                    background: #F9FAFB;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .notif-item {
                    display: flex;
                    align-items: flex-start;
                    gap: 14px;
                    padding: 16px 20px;
                    border: none;
                    width: 100%;
                    text-align: left;
                    background: transparent;
                    cursor: pointer;
                    transition: background 0.15s;
                    position: relative;
                    border-bottom: 1px solid #F9FAFB;
                    font-family: 'Plus Jakarta Sans', sans-serif;
                }
                .notif-item:last-child { border-bottom: none; }
                .notif-item:active { background: #FFF5F5; }
                .notif-item.unread { background: #FFFAF9; }
                .notif-item.unread::before {
                    content: '';
                    position: absolute;
                    left: 0;
                    top: 0;
                    bottom: 0;
                    width: 3px;
                    background: var(--red);
                    border-radius: 0 3px 3px 0;
                }
                .notif-unread-dot {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background: var(--red);
                    flex-shrink: 0;
                    margin-top: 6px;
                }

                /* ─── Modal overlay ─── */
                .modal-overlay {
                    position: fixed;
                    inset: 0;
                    background: rgba(0,0,0,0.5);
                    backdrop-filter: blur(4px);
                    -webkit-backdrop-filter: blur(4px);
                    z-index: 9500;
                    display: flex;
                    align-items: flex-end;
                    justify-content: center;
                    padding: 0;
                }
                @media (min-width: 480px) {
                    .modal-overlay { align-items: center; padding: 20px; }
                }
                .modal-box {
                    background: white;
                    border-radius: 28px 28px 0 0;
                    width: 100%;
                    max-width: 440px;
                    overflow: hidden;
                }
                @media (min-width: 480px) {
                    .modal-box { border-radius: 24px; }
                }
                .modal-header { padding: 24px 24px 16px; border-bottom: 1px solid var(--border); display: flex; align-items: center; gap: 16px; }
                .modal-body { padding: 20px 24px 24px; }
                .modal-footer { padding: 16px 24px; padding-bottom: calc(16px + env(safe-area-inset-bottom, 0px)); background: #FAFAFA; display: flex; justify-content: flex-end; gap: 10px; }

                @media (max-width: 768px) {
                    .btn-save { padding: 14px 32px; min-width: 200px; }
                    .save-text-main { font-size: 14px; }
                    .form-area { padding: 20px; }
                    .sec-hdr { margin-bottom: 20px; padding-bottom: 14px; }
                    .save-icon-wrapper { width: 28px; height: 28px; }
                }

                @keyframes spin { to { transform: rotate(360deg); } }
            `}</style>

            <Navbar />

            {/* ─── Hero ─── */}
            <div className="db-hero">
                <div className="hero-inner">
                    <div style={{ flex: 1 }}>
                        <span style={{ fontSize:10, color:'rgba(255,255,255,0.6)', letterSpacing:'0.2em' }}>DASHBOARD SISWA</span>
                        <div className="hero-name">{student?.full_name}</div>
                        <div style={{ fontSize:13, color:'rgba(255,255,255,0.5)', fontFamily:'monospace' }}>{student?.registration_number}</div>
                        <div style={{ marginTop:14 }}>
                            <span className="status-chip"><StatusIcon size={13} />{statusInfo.label}</span>
                        </div>
                    </div>
                    <div className="hero-actions">
                        {String(student?.status || '').toLowerCase() === 'diterima' && (
                            <button type="button" className="btn-notif" onClick={handleDownloadCard}>
                                <Download size={15} /> Kartu Peserta
                            </button>
                        )}
                        {/* ─── Tombol Notifikasi ─── */}
                        <button type="button" className="btn-notif" onClick={() => setIsNotifOpen(true)}>
                            <Bell size={15} />
                            Notifikasi
                            {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
                        </button>
                        <button type="button" className="btn-logout" onClick={() => setIsLogoutConfirmOpen(true)}>
                            <LogOut size={14} /> Keluar
                        </button>
                    </div>
                </div>
            </div>

            {/* ─── Main card ─── */}
            <div className="db-card">
                <div className="tab-bar">
                    {TABS.map(tab => {
                        const Icon = tab.icon;
                        return (
                            <button key={tab.id} className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`} onClick={() => setActiveTab(tab.id)}>
                                <Icon size={16} />
                                <span style={{ fontSize:12 }}>{tab.label}</span>
                                <span style={{ fontSize:9, opacity:0.5 }}>{tab.kanji}</span>
                            </button>
                        );
                    })}
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-area">
                        {(() => {
                            const tab  = TABS.find(t => t.id === activeTab);
                            const Icon = tab?.icon;
                            return (
                                <div className="sec-hdr">
                                    <div className="sec-icon"><Icon size={22} /></div>
                                    <div>
                                        <div className="sec-title">{tab?.label}</div>
                                        <div style={{ fontSize:11, color:'var(--muted)', fontWeight:700 }}>{tab?.kanji} · SKYBRIDGE</div>
                                    </div>
                                </div>
                            );
                        })()}

                        {/* ─── Personal ─── */}
                        {activeTab === 'personal' && (
                            <div className="flex flex-col md:flex-row gap-8">
                                <div className="w-full md:w-64 flex-shrink-0">
                                    <div style={{ border:'2px dashed #E5E7EB', borderRadius:16, overflow:'hidden', cursor:'pointer', textAlign:'center' }} onClick={() => document.getElementById('photo-upload').click()}>
                                        {photoPreview
                                            ? <img src={photoPreview} alt="Preview" style={{ width:'100%', objectFit:'cover', aspectRatio:'3/4', display:'block' }} />
                                            : <div style={{ padding:'60px 0', display:'flex', flexDirection:'column', alignItems:'center', gap:12 }}>
                                                <User size={40} style={{ color:'var(--red)', opacity:0.6 }} />
                                                <span style={{ fontSize:14, color:'#9CA3AF', fontWeight:600 }}>Upload Foto 3x4</span>
                                              </div>
                                        }
                                        <input id="photo-upload" type="file" {...register('photo')} accept="image/*" style={{ display:'none' }} />
                                    </div>
                                    <p style={{ fontSize:12, color:'var(--muted)', fontWeight:600, marginTop:8, textAlign:'center' }}>Klik untuk ubah foto</p>
                                </div>
                                <div className="flex-1 grid md:grid-cols-2 gap-5">
                                    <div><Label>Nama Lengkap</Label><input {...register('full_name')} className="db-input" /></div>
                                    <div><Label>NIK</Label><input {...register('nik')} className="db-input readonly" readOnly /></div>
                                    <div><Label>Jenis Kelamin</Label><select {...register('gender')} className="db-input"><option value="Laki-laki">Laki-laki</option><option value="Perempuan">Perempuan</option></select></div>
                                    <div><Label>Tempat Lahir</Label><input {...register('place_of_birth')} className="db-input" /></div>
                                    <Controller control={control} name="date_of_birth" render={({ field }) => (<div><Label>Tanggal Lahir</Label><CustomDatePicker field={field} /></div>)} />
                                    <div><Label>Golongan Darah</Label><select {...register('blood_type')} className="db-input"><option value="">Pilih...</option><option value="A">A</option><option value="B">B</option><option value="AB">AB</option><option value="O">O</option></select></div>
                                    <div><Label>Agama</Label><select {...register('religion')} className="db-input"><option value="Islam">Islam</option><option value="Kristen">Kristen</option><option value="Katolik">Katolik</option><option value="Hindu">Hindu</option><option value="Buddha">Buddha</option><option value="Konghucu">Konghucu</option></select></div>
                                    <div><Label>Status Pernikahan</Label><select {...register('marital_status')} className="db-input"><option value="Lajang">Lajang</option><option value="Menikah">Menikah</option><option value="Cerai Hidup">Cerai Hidup</option><option value="Cerai Mati">Cerai Mati</option></select></div>
                                    <div><Label>No. HP (WA)</Label><input {...register('phone_number')} className="db-input" /></div>
                                    <div><Label>Email</Label><input {...register('email')} className="db-input" /></div>
                                    <div className="md:col-span-2"><Label>Alamat Lengkap</Label><textarea {...register('address')} className="db-input" rows={3} style={{ resize:'vertical' }} /></div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'personal' && student?.status === 'Diterima' && (
                            <div className="mt-12 flex flex-col items-center">
                                <div style={{ width:'100%', height:1, background:'linear-gradient(to right, transparent, #E5E7EB, transparent)', marginBottom:40 }} />
                                <div style={{ textAlign:'center', marginBottom:24 }}>
                                    <h3 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:28, color:'#059669', letterSpacing:'0.05em' }}>KARTU PESERTA PELATIHAN</h3>
                                    <p style={{ fontSize:14, color:'var(--muted)', maxWidth:400, margin:'0 auto' }}>Selamat! Kamu telah diterima. Unduh kartu ini sebagai tanda pengenal resmi.</p>
                                </div>
                                <div className="reg-card-preview-wrap">
                                    <div ref={cardRef} className="reg-card-preview">
                                        <div className="reg-card-preview-top">
                                            <div className="gold-strip"></div>
                                            <div className="reg-card-preview-head">
                                                <div className="reg-card-preview-brand">
                                                    <div className="reg-card-preview-logo"><img src={Logo} alt="Logo" /></div>
                                                    <div>
                                                        <div className="reg-card-preview-title">SKYBRIDGE</div>
                                                        <div className="reg-card-preview-sub">KARTU PESERTA PELATIHAN</div>
                                                    </div>
                                                </div>
                                                <div className="reg-card-preview-stamp">正規</div>
                                            </div>
                                        </div>
                                        <div className="reg-card-preview-body">
                                            <div className="reg-card-main">
                                                <div className="reg-card-photo">
                                                    {photoPreview
                                                        ? <img src={photoPreview} alt="Foto peserta" />
                                                        : <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center' }}><User size={32} style={{ color:'#94A3B8' }} /></div>
                                                    }
                                                </div>
                                                <div className="reg-card-info">
                                                    <div className="reg-card-label">Nama Lengkap</div>
                                                    <div className="reg-card-name">{student?.full_name}</div>
                                                    <div style={{ marginTop: 10 }}>
                                                        <div className="reg-card-label">No. Registrasi</div>
                                                        <div className="reg-card-reg">{student?.registration_number}</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="reg-card-divider" />
                                            <div className="reg-card-meta">
                                                <div className="reg-card-meta-item">
                                                    <div className="reg-card-meta-k">Status</div>
                                                    <div className="reg-card-meta-v"><span className="reg-card-status">DITERIMA / 合格</span></div>
                                                </div>
                                                <div className="reg-card-meta-item">
                                                    <div className="reg-card-meta-k">Tanggal Registrasi</div>
                                                    <div className="reg-card-meta-v">{registrationDateText}</div>
                                                </div>
                                            </div>

                                            <div className="reg-card-bottom">
                                                <div className="reg-card-micro">
                                                    <div className="reg-card-serial">{cardSerial}</div>
                                                    <div className="reg-card-tagline">ID Peserta Pelatihan Resmi. Scan QR untuk verifikasi kehadiran.</div>
                                                </div>
                                                <div className="reg-card-qr">
                                                    {qrDataUrl ? <img src={qrDataUrl} alt="QR verifikasi" /> : <div className="reg-card-qr-ph" />}
                                                </div>
                                            </div>
                                            <div className="reg-card-preview-foot">Kartu ini wajib dibawa/ditunjukkan saat pengisian daftar hadir.</div>
                                        </div>
                                    </div>
                                    <div className="reg-card-actions">
                                        <button type="button" onClick={handleDownloadCard} disabled={isDownloadingCard} className="reg-card-btn">
                                            {isDownloadingCard
                                                ? <div style={{ width:18, height:18, border:'2px solid rgba(255,255,255,0.3)', borderTopColor:'white', borderRadius:'50%', animation:'spin 0.8s linear infinite' }} />
                                                : <Download size={18} />
                                            }
                                            {isDownloadingCard ? 'MENYIAPKAN...' : 'UNDUH KARTU PESERTA'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ─── Education ─── */}
                        {activeTab === 'education' && (
                            <div>
                                {fields.map((field, index) => (
                                    <div key={field.id} className="edu-card">
                                        <button type="button" className="btn-del" onClick={() => remove(index)}><Trash size={14} /></button>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div><Label>Jenjang</Label><select {...register(`education.${index}.level`)} className="db-input"><option value="SD/MI">SD/MI</option><option value="SMP/MTS">SMP/MTS</option><option value="SMA/SMK">SMA/SMK</option><option value="D3/S1">D3/S1</option></select></div>
                                            <div><Label>Nama Sekolah</Label><input {...register(`education.${index}.school_name`)} className="db-input" /></div>
                                            <JapaneseDateGroup label="Waktu Masuk" register={register} control={control} monthName={`education.${index}.entry_month`} yearName={`education.${index}.entry_year`} icon={Calendar} />
                                            <JapaneseDateGroup label="Waktu Wisuda" register={register} control={control} monthName={`education.${index}.graduation_month`} yearName={`education.${index}.graduation_year`} icon={Calendar} />
                                        </div>
                                    </div>
                                ))}
                                <button type="button" className="btn-add" onClick={() => append({ level:'', school_name:'', entry_month:'', entry_year:'', graduation_month:'', graduation_year:'' })}><Plus size={16} /> Tambah Riwayat Pendidikan</button>
                            </div>
                        )}

                        {/* ─── Family ─── */}
                        {activeTab === 'family' && (
                            <div className="grid md:grid-cols-2 gap-4">
                                <div><Label>Nama Ayah</Label><input {...register('father_name')} className="db-input" /></div>
                                <div><Label>Nama Ibu</Label><input {...register('mother_name')} className="db-input" /></div>
                                <div><Label>Pekerjaan Ayah</Label><input {...register('father_job')} className="db-input" /></div>
                                <div><Label>Pekerjaan Ibu</Label><input {...register('mother_job')} className="db-input" /></div>
                                <div><Label>Keadaan Ayah</Label><select {...register('father_status')} className="db-input"><option value="Hidup">Hidup</option><option value="Meninggal">Meninggal</option></select></div>
                                <div><Label>Keadaan Ibu</Label><select {...register('mother_status')} className="db-input"><option value="Hidup">Hidup</option><option value="Meninggal">Meninggal</option></select></div>
                                <div className="md:col-span-2"><Label>Alamat Orang Tua</Label><textarea {...register('parent_address')} className="db-input" rows={2} /></div>
                                <div><Label>Nama Wali (Opsional)</Label><input {...register('guardian_name')} className="db-input" /></div>
                                <div><Label>No. HP Wali (Opsional)</Label><input {...register('guardian_phone')} className="db-input" /></div>
                                <div className="md:col-span-2"><Label>Alamat Wali (Opsional)</Label><textarea {...register('guardian_address')} className="db-input" rows={2} /></div>
                            </div>
                        )}

                        {/* ─── Documents ─── */}
                        {activeTab === 'documents' && (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                                <DocumentUpload label="Pas Photo"        name="photo"              register={register} watch={watch} currentFile={student?.documents?.photo_path              || student?.photo_path}              />
                                <DocumentUpload label="Ijazah Terakhir"  name="diploma"            register={register} watch={watch} currentFile={student?.documents?.diploma_path            || student?.diploma_path}            />
                                <DocumentUpload label="KTP / KIA"        name="ktp"                register={register} watch={watch} currentFile={student?.documents?.ktp_path                || student?.ktp_path}                />
                                <DocumentUpload label="Kartu Keluarga"   name="family_card"        register={register} watch={watch} currentFile={student?.documents?.family_card_path        || student?.family_card_path}        />
                                <DocumentUpload label="Akta Kelahiran"   name="birth_certificate"  register={register} watch={watch} currentFile={student?.documents?.birth_certificate_path  || student?.birth_certificate_path}  />
                                <DocumentUpload label="Surat Sehat"      name="health_certificate" register={register} watch={watch} currentFile={student?.documents?.health_certificate_path || student?.health_certificate_path} />
                                <DocumentUpload label="Surat Izin Ortu"  name="consent_letter"     register={register} watch={watch} currentFile={student?.documents?.consent_letter_path     || student?.consent_letter_path}     />
                            </div>
                        )}

                        {/* ─── Physical ─── */}
                        {activeTab === 'physical' && (
                            <div className="grid md:grid-cols-2 gap-4">
                                <div><Label>Apakah Memiliki Tato?</Label><select {...register('has_tattoo')} className="db-input"><option value="false">Tidak</option><option value="true">Ya</option></select></div>
                                <div><Label>Apakah Memiliki Tindik?</Label><select {...register('has_piercing')} className="db-input"><option value="false">Tidak</option><option value="true">Ya</option></select></div>
                                <div><Label>Tinggi Badan (cm)</Label><input {...register('height', { required:'Wajib diisi' })} type="number" step="0.01" className="db-input" /></div>
                                <div><Label>Berat Badan (kg)</Label><input {...register('weight', { required:'Wajib diisi' })} type="number" step="0.01" className="db-input" /></div>
                            </div>
                        )}
                    </div>

                    {/* ─── Save bar ─── */}
                    <div style={{ display:'flex', justifyContent:'center', padding:'24px', borderTop:'1px solid #F1F5F9', background:'#FAFAFA' }}>
                        <button type="submit" disabled={isSubmitting} className="btn-save">
                            <div className="save-content">
                                {isSubmitting
                                    ? <div style={{ width:20, height:20, border:'3px solid rgba(255,255,255,0.3)', borderTopColor:'white', borderRadius:'50%', animation:'spin 0.8s linear infinite' }} />
                                    : <div className="save-icon-wrapper"><Save size={18} /></div>
                                }
                                <div className="save-text-container">
                                    <span className="save-text-main">{isSubmitting ? 'MEMPROSES...' : 'SIMPAN PERUBAHAN'}</span>
                                    {!isSubmitting && <span className="save-text-jp">変更を保存する</span>}
                                </div>
                            </div>
                        </button>
                    </div>
                </form>
            </div>

            {/* ══════════════════════════════════════════
                SEMUA MODAL PAKAI PORTAL → render ke body
                Ini bypass semua z-index/stacking context
                dari Navbar, db-root, overflow:hidden, dll.
            ══════════════════════════════════════════ */}

            {/* ─── NOTIFIKASI BOTTOM SHEET ─── */}
            <Portal>
                <AnimatePresence>
                    {isNotifOpen && (
                        <>
                            {/* Overlay */}
                            <Motion.div
                                key="notif-overlay"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.22 }}
                                onClick={() => setIsNotifOpen(false)}
                                style={{
                                    position: 'fixed',
                                    inset: 0,
                                    background: 'rgba(0,0,0,0.6)',
                                    zIndex: 2147483646,
                                }}
                            />

                            {/* Sheet */}
                            <Motion.div
                                key="notif-sheet"
                                initial={{ y: '100%' }}
                                animate={{ y: 0 }}
                                exit={{ y: '100%' }}
                                transition={{ type: 'spring', damping: 30, stiffness: 300, mass: 0.8 }}
                                style={{
                                    position: 'fixed',
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    zIndex: 2147483647,
                                    background: '#fff',
                                    borderRadius: '28px 28px 0 0',
                                    maxHeight: '88vh',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    boxShadow: '0 -8px 40px rgba(0,0,0,0.2)',
                                    overflow: 'hidden',
                                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                                }}
                            >
                                {/* Handle */}
                                <div style={{ width:44, height:5, background:'#D1D5DB', borderRadius:10, margin:'14px auto 0', flexShrink:0 }} />

                                {/* Header */}
                                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 20px 12px', borderBottom:'1px solid #F3F4F6', flexShrink:0 }}>
                                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                                        <Bell size={20} style={{ color:'#D0021B' }} />
                                        <span style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:22, color:'#1C1C1C', letterSpacing:'0.08em' }}>NOTIFIKASI</span>
                                        {unreadCount > 0 && (
                                            <span style={{ background:'#D0021B', color:'white', fontSize:11, fontWeight:900, padding:'2px 9px', borderRadius:100 }}>
                                                {unreadCount} baru
                                            </span>
                                        )}
                                    </div>
                                    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                                        {notifications.length > 0 && (
                                            <button
                                                type="button"
                                                onClick={markAllRead}
                                                style={{ fontSize:12, fontWeight:700, color:'#D0021B', background:'#FEF2F2', border:'none', padding:'6px 14px', borderRadius:100, cursor:'pointer', fontFamily:"'Plus Jakarta Sans',sans-serif" }}
                                            >
                                                Tandai terbaca
                                            </button>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => setIsNotifOpen(false)}
                                            style={{ width:32, height:32, borderRadius:'50%', background:'#F3F4F6', border:'none', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'#374151' }}
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                </div>

                                {/* List */}
                                <div style={{ overflowY:'auto', WebkitOverflowScrolling:'touch', flex:1, overscrollBehavior:'contain', paddingBottom:'env(safe-area-inset-bottom, 16px)', maxHeight: 384 }}>
                                    {notifications.length === 0 ? (
                                        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'56px 24px', color:'#9CA3AF', gap:12 }}>
                                            <div style={{ width:64, height:64, borderRadius:20, background:'#F9FAFB', display:'flex', alignItems:'center', justifyContent:'center' }}>
                                                <Bell size={28} style={{ color:'#D1D5DB' }} />
                                            </div>
                                            <div style={{ fontWeight:700, fontSize:15, color:'#374151' }}>Belum ada notifikasi</div>
                                            <div style={{ fontSize:13, textAlign:'center', maxWidth:240, lineHeight:1.5 }}>Kamu akan dapat notif saat status pendaftaran berubah atau ada pesan dari admin.</div>
                                        </div>
                                    ) : (
                                        notifications.map(n => {
                                            const isNotes = n.type === 'notes';
                                            const m  = isNotes
                                                ? { icon: FileText, bg:'#EEF2FF', color:'#4F46E5' }
                                                : (() => {
                                                    const sm = statusMeta(n.to);
                                                    return { icon: sm.icon, bg:'#FEF2F2', color:'#D0021B' };
                                                })();
                                            const Ic = m.icon;
                                            return (
                                                <button
                                                    key={n.id}
                                                    type="button"
                                                    onClick={() => { markOneRead(n.id); setIsNotifOpen(false); setSelectedNotif(n); }}
                                                    style={{
                                                        display:'flex',
                                                        alignItems:'flex-start',
                                                        gap:14,
                                                        padding:'16px 20px',
                                                        border:'none',
                                                        borderBottom:'1px solid #F9FAFB',
                                                        width:'100%',
                                                        textAlign:'left',
                                                        background: n.read ? 'transparent' : '#FFFAF9',
                                                        cursor:'pointer',
                                                        position:'relative',
                                                        fontFamily:"'Plus Jakarta Sans',sans-serif",
                                                    }}
                                                >
                                                    {/* Unread left bar */}
                                                    {!n.read && (
                                                        <span style={{ position:'absolute', left:0, top:0, bottom:0, width:3, background:'#D0021B', borderRadius:'0 3px 3px 0' }} />
                                                    )}

                                                    {/* Icon */}
                                                    <span style={{ width:44, height:44, borderRadius:12, background:m.bg, color:m.color, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, minWidth:44 }}>
                                                        <Ic size={20} />
                                                    </span>

                                                    {/* Content */}
                                                    <span style={{ flex:1, minWidth:0 }}>
                                                        <span style={{ display:'block', fontSize:14, fontWeight:800, color:'#111827', marginBottom:4, lineHeight:1.3 }}>{n.title}</span>
                                                        {isNotes ? (
                                                            <span style={{ display:'block', fontSize:12, color:'#6B7280', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                                                                {n.notes}
                                                            </span>
                                                        ) : (
                                                            <span style={{ display:'flex', alignItems:'center', gap:6, flexWrap:'wrap' }}>
                                                                <StatusBadge status={n.from} />
                                                                <ChevronRight size={12} style={{ color:'#9CA3AF' }} />
                                                                <StatusBadge status={n.to} />
                                                            </span>
                                                        )}
                                                        <span style={{ display:'block', fontSize:11, color:'#9CA3AF', marginTop:5 }}>
                                                            {new Date(n.createdAt).toLocaleString('id-ID', { day:'numeric', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' })}
                                                        </span>
                                                    </span>

                                                    {/* Unread dot */}
                                                    {!n.read && (
                                                        <span style={{ width:8, height:8, borderRadius:'50%', background:'#D0021B', flexShrink:0, marginTop:6 }} />
                                                    )}
                                                </button>
                                            );
                                        })
                                    )}
                                </div>
                            </Motion.div>
                        </>
                    )}
                </AnimatePresence>
            </Portal>

            {/* ─── NOTIF DETAIL MODAL ─── */}
            <Portal>
                <AnimatePresence>
                    {selectedNotif && (
                        <Motion.div
                            key="notif-detail"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            style={{
                                position:'fixed', inset:0,
                                background:'rgba(0,0,0,0.5)',
                                zIndex:2147483647,
                                display:'flex', alignItems:'flex-end', justifyContent:'center',
                                padding:0,
                                fontFamily:"'Plus Jakarta Sans',sans-serif",
                            }}
                            onClick={() => setSelectedNotif(null)}
                        >
                            <Motion.div
                                initial={{ y: 60, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: 60, opacity: 0 }}
                                transition={{ type:'spring', damping:28, stiffness:280 }}
                                style={{ background:'white', borderRadius:'24px 24px 0 0', width:'100%', maxWidth:480, overflow:'hidden' }}
                                onClick={e => e.stopPropagation()}
                            >
                                {/* Handle */}
                                <div style={{ width:44, height:5, background:'#D1D5DB', borderRadius:10, margin:'14px auto 0' }} />
                                <div style={{ padding:'20px 24px 16px', borderBottom:'1px solid #F3F4F6', display:'flex', alignItems:'center', gap:14 }}>
                                    {(() => {
                                        const isNotes = selectedNotif.type === 'notes';
                                        const bg    = isNotes ? '#EEF2FF' : '#FEF2F2';
                                        const color = isNotes ? '#4F46E5' : '#D0021B';
                                        const Ic    = isNotes ? FileText : statusMeta(selectedNotif.to).icon;
                                        return <div style={{ width:48, height:48, borderRadius:14, background:bg, color, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}><Ic size={22} /></div>;
                                    })()}
                                    <div style={{ flex:1, minWidth:0 }}>
                                        <div style={{ fontSize:16, fontWeight:800, color:'#111827', marginBottom:3 }}>{selectedNotif.title}</div>
                                        <div style={{ fontSize:12, color:'#9CA3AF' }}>
                                            {new Date(selectedNotif.createdAt).toLocaleString('id-ID', { day:'numeric', month:'long', year:'numeric', hour:'2-digit', minute:'2-digit' })}
                                        </div>
                                    </div>
                                </div>
                                <div style={{ padding:'20px 24px 24px' }}>
                                    {selectedNotif.type === 'notes' ? (
                                        <div style={{ background:'#FEF2F2', padding:'16px 20px', borderRadius:14, borderLeft:'4px solid #D0021B', fontSize:14, color:'#374151', lineHeight:1.6 }}>
                                            {selectedNotif.notes}
                                        </div>
                                    ) : (
                                        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                                            <p style={{ fontSize:14, color:'#6B7280' }}>Status pendaftaran kamu telah diperbarui.</p>
                                            <div style={{ display:'flex', alignItems:'center', gap:12, background:'#F9FAFB', padding:'14px 18px', borderRadius:14, border:'1px solid #E5E7EB' }}>
                                                <div style={{ flex:1, textAlign:'center' }}>
                                                    <span style={{ display:'block', fontSize:11, color:'#9CA3AF', marginBottom:6, fontWeight:700 }}>SEBELUMNYA</span>
                                                    <StatusBadge status={selectedNotif.from} />
                                                </div>
                                                <ChevronRight size={20} style={{ color:'#9CA3AF', flexShrink:0 }} />
                                                <div style={{ flex:1, textAlign:'center' }}>
                                                    <span style={{ display:'block', fontSize:11, color:'#9CA3AF', marginBottom:6, fontWeight:700 }}>TERBARU</span>
                                                    <StatusBadge status={selectedNotif.to} />
                                                </div>
                                            </div>
                                            {String(selectedNotif.to || '').toLowerCase() === 'diterima' && (
                                                <div style={{ marginTop:6, padding:'14px 16px', border:'1px dashed #E5E7EB', borderRadius:12, background:'#FAFAFA' }}>
                                                    <div style={{ fontSize:13, color:'#374151', marginBottom:10 }}>
                                                        Selamat! Kamu sudah diterima. Silakan unduh Kartu Peserta untuk kemudahan absen saat registrasi/kegiatan.
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={handleDownloadCard}
                                                        style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'10px 14px', background:'linear-gradient(135deg, #D0021B, #A50015)', color:'#fff', border:'none', borderRadius:12, fontWeight:800, fontSize:13, cursor:'pointer' }}
                                                    >
                                                        <Download size={16} /> Unduh Kartu Peserta
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <div style={{ padding:'12px 24px', paddingBottom:'calc(20px + env(safe-area-inset-bottom, 0px))', background:'#FAFAFA', display:'flex', justifyContent:'flex-end' }}>
                                    <button
                                        onClick={() => setSelectedNotif(null)}
                                        style={{ padding:'10px 28px', background:'white', border:'1.5px solid #E5E7EB', borderRadius:100, fontWeight:700, fontSize:14, color:'#374151', cursor:'pointer', fontFamily:"'Plus Jakarta Sans',sans-serif" }}
                                    >
                                        Tutup
                                    </button>
                                </div>
                            </Motion.div>
                        </Motion.div>
                    )}
                </AnimatePresence>
            </Portal>

            {/* ─── LOGOUT CONFIRM MODAL ─── */}
            <Portal>
                <AnimatePresence>
                    {isLogoutConfirmOpen && (
                        <Motion.div
                            key="logout-modal"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            style={{
                                position:'fixed', inset:0,
                                background:'rgba(0,0,0,0.5)',
                                zIndex:2147483647,
                                display:'flex', alignItems:'flex-end', justifyContent:'center',
                                fontFamily:"'Plus Jakarta Sans',sans-serif",
                            }}
                            onClick={() => setIsLogoutConfirmOpen(false)}
                        >
                            <Motion.div
                                initial={{ y: 60, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: 60, opacity: 0 }}
                                transition={{ type:'spring', damping:28, stiffness:280 }}
                                style={{ background:'white', borderRadius:'24px 24px 0 0', width:'100%', maxWidth:400, overflow:'hidden' }}
                                onClick={e => e.stopPropagation()}
                            >
                                <div style={{ width:44, height:5, background:'#D1D5DB', borderRadius:10, margin:'14px auto 0' }} />
                                <div style={{ padding:'28px 24px 8px', textAlign:'center' }}>
                                    <div style={{ width:64, height:64, borderRadius:'50%', background:'#FEF2F2', display:'flex', alignItems:'center', justifyContent:'center', color:'#D0021B', margin:'0 auto 16px' }}>
                                        <LogOut size={28} strokeWidth={2.5} style={{ marginLeft:3 }} />
                                    </div>
                                    <h3 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:26, color:'#1C1C1C', letterSpacing:'0.04em', marginBottom:8 }}>YAKIN INGIN KELUAR?</h3>
                                    <p style={{ fontSize:14, color:'#6B7280', lineHeight:1.5 }}>Pastikan kamu sudah menyimpan semua perubahan sebelum keluar.</p>
                                </div>
                                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, padding:'24px', paddingBottom:'calc(24px + env(safe-area-inset-bottom, 0px))' }}>
                                    <button onClick={() => setIsLogoutConfirmOpen(false)} style={{ padding:'13px 0', background:'white', border:'2px solid #E5E7EB', borderRadius:100, fontWeight:700, fontSize:14, color:'#1C1C1C', cursor:'pointer', fontFamily:"'Plus Jakarta Sans',sans-serif" }}>Batal</button>
                                    <button onClick={handleLogout} style={{ padding:'13px 0', background:'linear-gradient(135deg,#D0021B,#A50015)', border:'none', borderRadius:100, fontWeight:700, fontSize:14, color:'white', cursor:'pointer', boxShadow:'0 8px 20px rgba(208,2,27,0.25)', fontFamily:"'Plus Jakarta Sans',sans-serif" }}>Ya, Keluar</button>
                                </div>
                            </Motion.div>
                        </Motion.div>
                    )}
                </AnimatePresence>
            </Portal>
            
            {String(student?.status || '').toLowerCase() === 'diterima' && (
                <div style={{ position:'absolute', left:-10000, top:-10000 }}>
                    <div id="reg-card-download" className="reg-card-preview" style={{ width:440 }}>
                        <div className="reg-card-preview-top">
                            <div className="gold-strip"></div>
                            <div className="reg-card-preview-head">
                                <div className="reg-card-preview-brand">
                                    <div className="reg-card-preview-logo"><img src={Logo} alt="Logo" /></div>
                                    <div>
                                        <div className="reg-card-preview-title">SKYBRIDGE</div>
                                        <div className="reg-card-preview-sub">KARTU PESERTA PELATIHAN</div>
                                    </div>
                                </div>
                                <div className="reg-card-preview-stamp">正規</div>
                            </div>
                        </div>
                        <div className="reg-card-preview-body">
                            <div className="reg-card-main">
                                <div className="reg-card-photo">
                                    {photoPreview
                                        ? <img src={photoPreview} alt="Foto peserta" />
                                        : <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center' }}><User size={32} style={{ color:'#94A3B8' }} /></div>
                                    }
                                </div>
                                <div className="reg-card-info">
                                    <div className="reg-card-label">Nama Lengkap</div>
                                    <div className="reg-card-name">{student?.full_name}</div>
                                    <div style={{ marginTop: 10 }}>
                                        <div className="reg-card-label">No. Registrasi</div>
                                        <div className="reg-card-reg">{student?.registration_number}</div>
                                    </div>
                                </div>
                            </div>
                            <div className="reg-card-divider" />
                            <div className="reg-card-meta">
                                <div className="reg-card-meta-item">
                                    <div className="reg-card-meta-k">Status</div>
                                    <div className="reg-card-meta-v"><span className="reg-card-status">DITERIMA / 合格</span></div>
                                </div>
                                <div className="reg-card-meta-item">
                                    <div className="reg-card-meta-k">Tanggal Registrasi</div>
                                    <div className="reg-card-meta-v">{registrationDateText}</div>
                                </div>
                            </div>
                            <div className="reg-card-bottom">
                                <div className="reg-card-micro">
                                    <div className="reg-card-serial">{cardSerial}</div>
                                    <div className="reg-card-tagline">ID Peserta Pelatihan Resmi. Scan QR untuk verifikasi kehadiran.</div>
                                </div>
                                <div className="reg-card-qr">
                                    {qrDataUrl ? <img src={qrDataUrl} alt="QR verifikasi" /> : <div className="reg-card-qr-ph" />}
                                </div>
                            </div>
                            <div className="reg-card-preview-foot">Kartu ini wajib dibawa/ditunjukkan saat pengisian daftar hadir.</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentDashboard;
