import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { Search, IdCard } from 'lucide-react';
import { motion } from 'framer-motion';
import heroBg from '../assets/img/bg-internasional.webp';

const StatusInfoCard = () => {
    return (
        <div className="relative w-full max-w-sm mx-auto">
            <div className="absolute -top-10 -left-6 w-24 h-24 bg-red-100 rounded-full blur-2xl opacity-70" />
            <div className="absolute -bottom-12 -right-10 w-32 h-32 bg-blue-100 rounded-full blur-3xl opacity-70" />
            <div className="relative bg-white/90 border border-gray-100 rounded-3xl px-6 py-6 shadow-xl backdrop-blur-sm">
                <p className="text-[11px] font-semibold tracking-[0.22em] text-red-500 uppercase mb-2">
                    Status Pendaftaran
                </p>
                <p className="text-sm font-bold text-gray-800 mb-1">
                    登録状況の確認
                </p>
                <p className="text-xs text-gray-600 mb-4">
                    Pantau progres seleksi kamu secara real-time. Simpan nomor registrasi dengan baik agar mudah dicek kapan saja.
                </p>
                <div className="space-y-3 text-xs">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
                        <span>Menunggu Verifikasi</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        <span>Diterima / 合格</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-500"></span>
                        <span>Ditolak / 不合格</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const CheckStatusPage = () => {
    const [regNumber, setRegNumber] = useState('');
    const [nik, setNik] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Cek jika user (siswa) sudah login/ada data di localStorage, langsung arahkan ke dashboard
    useEffect(() => {
        const storedData = localStorage.getItem('studentData');
        if (storedData) {
            navigate('/student/dashboard');
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/students/login`, {
                registration_number: regNumber,
                nik: nik
            });
            
            // Store student data in localStorage or state
            localStorage.setItem('studentData', JSON.stringify(response.data.student));
            navigate('/student/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Login gagal. Cek kembali data anda.');
        }
    };

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Noto+Sans+JP:wght@400;700;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

                :root {
                    --red: #D0021B;
                    --red-dark: #A50015;
                    --red-light: #FF1A35;
                    --gold: #C8860A;
                    --gold-light: #F5A623;
                    --cream: #FDF8F0;
                    --ink: #1C1C1C;
                    --muted: #6B7280;
                    --white: #FFFFFF;
                    --border: #E5E7EB;
                }

                .reg-root {
                    font-family: 'Plus Jakarta Sans', sans-serif;
                    min-height: 100vh;
                    background: var(--cream);
                    background-image:
                        repeating-linear-gradient(45deg, rgba(208,2,27,0.025) 0, rgba(208,2,27,0.025) 1px, transparent 1px, transparent 36px),
                        repeating-linear-gradient(-45deg, rgba(200,134,10,0.025) 0, rgba(200,134,10,0.025) 1px, transparent 1px, transparent 36px);
                }

                .reg-banner {
                    background: linear-gradient(135deg, rgba(2,6,23,0.85) 0%, rgba(15,23,42,0.9) 60%, rgba(2,6,23,0.85) 100%), url(${heroBg}) center/cover no-repeat;
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
                    background: linear-gradient(to bottom, var(--gold-light), var(--gold));
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
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    padding: 7px 16px;
                    border-radius: 999px;
                    background: rgba(255,255,255,0.06);
                    border: 1px solid rgba(255,255,255,0.10);
                    backdrop-filter: blur(10px);
                    position: relative; z-index: 1;
                }
                .banner-title {
                    font-family: 'Bebas Neue', sans-serif;
                    font-size: clamp(30px, 6vw, 48px);
                    color: #fff;
                    letter-spacing: 0.04em;
                    line-height: 1;
                    margin-top: 14px;
                    position: relative; z-index: 1;
                }
                .banner-title .acc { color: var(--red-light); }
                .banner-sub {
                    font-size: 13px;
                    color: rgba(255,255,255,0.55);
                    margin-top: 8px;
                    max-width: 520px;
                    margin-left: auto;
                    margin-right: auto;
                    position: relative; z-index: 1;
                }

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
                }

                .reg-card::before {
                    content: '';
                    display: block;
                    height: 5px;
                    background: linear-gradient(90deg, var(--red-dark), var(--red), var(--gold-light), var(--red));
                    background-size: 200% 100%;
                    animation: shimmer 4s linear infinite;
                }
                @keyframes shimmer {
                    0% { background-position: 0% 0%; }
                    100% { background-position: 200% 0%; }
                }

                .form-body { padding: 28px 28px 0; }
                .section-label {
                    font-size: 11px;
                    font-weight: 800;
                    letter-spacing: 0.22em;
                    text-transform: uppercase;
                    color: var(--red);
                    text-align: center;
                }
                .section-title {
                    margin-top: 8px;
                    font-size: 22px;
                    font-weight: 900;
                    color: #111827;
                    text-align: center;
                }
                .section-desc {
                    margin-top: 8px;
                    font-size: 13px;
                    color: #6B7280;
                    text-align: center;
                    line-height: 1.7;
                }

                .input-field {
                    width: 100%;
                    height: 44px;
                    border-radius: 14px;
                    border: 1.5px solid var(--border);
                    background: #fff;
                    padding: 12px 14px;
                    font-size: 14px;
                    font-weight: 600;
                    color: #111827;
                    outline: none;
                    transition: all 0.15s;
                }
                .input-field:focus {
                    border-color: var(--red);
                    box-shadow: 0 0 0 3px rgba(208,2,27,0.08);
                }

                .btn-primary {
                    width: 100%;
                    padding: 14px 16px;
                    border-radius: 999px;
                    background: linear-gradient(135deg, var(--red), var(--red-dark));
                    color: #fff;
                    font-weight: 900;
                    font-size: 14px;
                    border: none;
                    cursor: pointer;
                    box-shadow: 0 14px 46px rgba(208,2,27,0.30);
                    transition: all 0.2s;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                }
                .btn-primary:active { transform: scale(0.99); }

                .err-box {
                    border-radius: 16px;
                    border: 1px solid rgba(254,202,202,0.9);
                    background: linear-gradient(135deg, rgba(254,242,242,0.95), rgba(255,255,255,0.85));
                    color: #991B1B;
                    padding: 12px 14px;
                    font-size: 12px;
                    display: flex;
                    gap: 10px;
                    align-items: flex-start;
                }
            `}</style>
            <Navbar />
            <div className="reg-root">
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="reg-banner"
                >
                    <div className="banner-pattern" />
                    <div className="banner-sun" />
                    <span className="banner-kana">CEK STATUS / 確認</span>
                    <h1 className="banner-title">
                        CEK <span className="acc">STATUS</span> PENDAFTARAN
                    </h1>
                    <p className="banner-sub">
                        Masukkan Nomor Registrasi dan NIK kamu untuk melihat status pendaftaran yang sudah diproses oleh tim SKYBRIDGE.
                    </p>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="reg-card"
                >
                    <div className="form-body">
                        <p className="section-label">INPUT DATA / 入力</p>
                        <h2 className="section-title">Masukkan Data Pendaftaran</h2>
                        <p className="section-desc">
                            Pastikan Nomor Registrasi dan NIK sesuai bukti pendaftaran agar status bisa ditemukan dengan tepat.
                        </p>

                        {error && (
                            <div className="err-box" style={{ marginTop: 18 }}>
                                <span className="mt-0.5">⚠️</span>
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="mt-6 grid grid-cols-1 lg:grid-cols-[1.1fr,0.9fr] gap-8 items-start">
                            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
                                <div>
                                    <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1.5">
                                        Nomor Registrasi
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={regNumber}
                                            onChange={(e) => setRegNumber(e.target.value)}
                                            placeholder="Contoh: SNIS-2026-XXXX-0001"
                                            className="input-field"
                                            style={{ paddingLeft: 70 }}
                                            required
                                        />
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-[11px] font-mono pr-2 mr-1 border-r border-gray-200">
                                            SNIS
                                        </span>
                                    </div>
                                    <p className="mt-1 text-[11px] text-gray-500">
                                        Nomor ini tertera pada bukti pendaftaran kamu.
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1.5">
                                        NIK (Nomor KTP)
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={nik}
                                            onChange={(e) => setNik(e.target.value)}
                                            placeholder="Masukkan 16 digit NIK"
                                            className="input-field"
                                            style={{ paddingLeft: 54 }}
                                            required
                                        />
                                        <IdCard className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    </div>
                                    <p className="mt-1 text-[11px] text-gray-500">
                                        Pastikan sesuai dengan data yang kamu isi saat pendaftaran.
                                    </p>
                                </div>

                                <button type="submit" className="btn-primary">
                                    <span>Cek Status Sekarang</span>
                                    <span className="text-[11px] text-red-100 tracking-[0.2em] uppercase">確認</span>
                                </button>
                            </form>

                            <div className="hidden lg:block">
                                <StatusInfoCard />
                            </div>
                        </div>

                        <div className="mt-8 lg:hidden">
                            <StatusInfoCard />
                        </div>
                    </div>
                </motion.div>
            </div>
        </>
    );
};

export default CheckStatusPage;
