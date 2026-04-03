import { useCallback, useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { useLocation, useNavigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import { useAlert } from '../context/AlertContext';
import { QrCode, ShieldCheck, Info, CheckCircle2, CircleAlert, Image as ImageIcon, X, Pointer } from 'lucide-react';

const AdminScanQr = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showAlert } = useAlert();
  const scannerRef = useRef(null);
  const fileInputRef = useRef(null);
  const scanModeRef = useRef('camera');
  const fileErrorShownRef = useRef(false);
  const [lastResult, setLastResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [showCloseHint, setShowCloseHint] = useState(false);

  const stopScanner = useCallback(async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
      } catch (error) {
        console.error('Failed to stop html5-qrcode scanner.', error);
      }

      try {
        await scannerRef.current.clear();
      } catch (error) {
        console.error('Failed to clear html5-qrcode scanner.', error);
      }

      scannerRef.current = null;
    }

    const root = document.getElementById('reader');
    if (root) {
      root.innerHTML = '';
    }

    const videos = Array.from(document.querySelectorAll('video'));
    videos.forEach((video) => {
      const stream = video.srcObject;
      if (stream && typeof stream.getTracks === 'function') {
        stream.getTracks().forEach((track) => {
          try {
            track.stop();
          } catch {
          }
        });
        video.srcObject = null;
      }
    });
  }, []);

  const getStudentDetailPath = useCallback(
    (studentId) => {
      const id = String(studentId ?? '').trim();
      if (!id) return null;
      if (location.pathname.startsWith('/staff')) return `/staff/student/${id}`;
      if (location.pathname.startsWith('/kepalalpk')) return `/kepalalpk/student/${id}`;
      return `/admin/student/${id}`;
    },
    [location.pathname]
  );

  const extractLegacyStudentId = useCallback((decodedText) => {
    const serialMatch = String(decodedText || '').match(/(?:^|\n)\s*ID\s*:\s*(LPK-\d+)\s*(?:\n|$)/i);
    if (!serialMatch) return null;
    const numeric = serialMatch[1].replace(/\D/g, '');
    const parsed = Number.parseInt(numeric, 10);
    if (!Number.isFinite(parsed) || parsed <= 0) return null;
    return parsed;
  }, []);

  const handleScanSuccess = useCallback(
    async (decodedText) => {
      scanModeRef.current = 'camera';
      fileErrorShownRef.current = false;
      setLastResult(decodedText);
      setErrorMessage('');

      try {
        const data = JSON.parse(decodedText);
        const studentId = data?.id ?? data?.studentId ?? data?.student_id;
        const targetPath = getStudentDetailPath(studentId);
        if (targetPath) {
          await stopScanner();
          navigate(targetPath);
        } else {
          showAlert('QR Code tidak berisi ID peserta yang valid.', 'error', 'Scan Gagal');
        }
      } catch (e) {
        const legacyId = extractLegacyStudentId(decodedText);
        const targetPath = getStudentDetailPath(legacyId);
        if (targetPath) {
          await stopScanner();
          navigate(targetPath);
          return;
        }

        console.error('Invalid QR Code Data', e);
        setErrorMessage('QR Code tidak valid atau format tidak dikenali.');
        showAlert('QR Code tidak valid atau format salah.', 'error', 'Scan Gagal');
      }
    },
    [extractLegacyStudentId, getStudentDetailPath, navigate, showAlert, stopScanner]
  );

  const handleScanFailure = useCallback(
    (error) => {
      const message = String(error || '');

      if (message.includes('NotFoundException')) {
        if (scanModeRef.current === 'file' && !fileErrorShownRef.current) {
          fileErrorShownRef.current = true;
          setErrorMessage('Gambar yang dipilih tidak berisi QR Code yang valid.');
          showAlert(
            'Gambar yang kamu pilih tidak berisi QR Code yang bisa dibaca. Gunakan foto kartu peserta atau QR Code yang jelas dan tidak blur.',
            'error',
            'Scan Gambar Gagal'
          );
        }
        return;
      }

      setErrorMessage(
        'Kesalahan saat membaca kamera. Coba stabilkan perangkat atau ulangi scan.'
      );
    },
    [showAlert]
  );

  const handleStartCamera = useCallback(async () => {
    scanModeRef.current = 'camera';
    fileErrorShownRef.current = false;
    setShowCloseHint(false);

    if (isScanning) {
      return;
    }

    if (!scannerRef.current) {
      scannerRef.current = new Html5Qrcode('reader');
    }

    try {
      setErrorMessage('');
      setIsScanning(true);
      const isMobile = window.innerWidth < 768;

      const config = {
        fps: isMobile ? 10 : 12,
        disableFlip: true,
      };

      if (!isMobile) {
        const qrboxFunction = (viewWidth, viewHeight) => {
          const minEdge = Math.min(viewWidth, viewHeight);
          const size = Math.floor(minEdge * 0.7);
          return { width: size, height: size };
        };
        config.qrbox = qrboxFunction;
      }

      await scannerRef.current.start(
        { facingMode: 'environment' },
        config,
        handleScanSuccess,
        handleScanFailure
      );
    } catch (error) {
      console.error('Failed to start camera', error);
      setIsScanning(false);
      showAlert(
        'Kamera tidak bisa diakses. Periksa izin browser atau coba ulangi.',
        'error',
        'Gagal Mengakses Kamera'
      );
    }
  }, [handleScanFailure, handleScanSuccess, isScanning, showAlert]);

  const handleFileChange = useCallback(
    async (event) => {
      const file = event.target.files && event.target.files[0];
      if (!file) {
        return;
      }

      scanModeRef.current = 'file';
      fileErrorShownRef.current = false;
      setErrorMessage('');

      try {
        if (!scannerRef.current) {
          scannerRef.current = new Html5Qrcode('reader');
        }

        const decodedText = await scannerRef.current.scanFile(file, false);
        await handleScanSuccess(decodedText);
      } catch (error) {
        console.error('Failed to scan image file', error);

        if (!fileErrorShownRef.current) {
          fileErrorShownRef.current = true;
          setErrorMessage('Gambar yang dipilih tidak berisi QR Code yang valid.');
          showAlert(
            'Gambar yang kamu pilih tidak berisi QR Code yang bisa dibaca. Gunakan foto kartu peserta atau QR Code yang jelas dan tidak blur.',
            'error',
            'Scan Gambar Gagal'
          );
        }
      } finally {
        event.target.value = '';
      }
    },
    [handleScanSuccess, showAlert]
  );

  const handleOpenFilePicker = useCallback(() => {
    if (isScanning) {
      setShowCloseHint(true);
      return;
    }

    if (fileInputRef.current) {
      scanModeRef.current = 'file';
      fileErrorShownRef.current = false;
      fileInputRef.current.click();
    }
  }, [isScanning]);

  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, [stopScanner]);

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.22em] text-slate-400 uppercase">
              Scan QR / スキャン
            </p>
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-50">
              Scan QR Code Peserta
            </h1>
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-300 mt-1">
              Gunakan kamera perangkat untuk memvalidasi kehadiran dan membuka detail data peserta.
            </p>
          </div>
          <div className="flex items-center gap-3 bg-slate-900/90 dark:bg-black/40 text-slate-50 rounded-2xl px-4 py-3 shadow-lg shadow-slate-900/30 border border-slate-700/80">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-emerald-400 to-sky-500 flex items-center justify-center">
              <ShieldCheck size={20} />
            </div>
            <div className="text-xs">
              <p className="font-semibold">Verifikasi Langsung</p>
              <p className="text-slate-300">Scan QR hanya dapat dilakukan oleh admin resmi.</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-[minmax(0,1.4fr),minmax(0,1fr)] gap-6 items-start">
          <div className="relative bg-white/95 dark:bg-slate-950/80 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-[0_20px_60px_rgba(15,23,42,0.35)] overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute -top-20 -left-20 w-60 h-60 rounded-full bg-emerald-500/10 blur-3xl" />
              <div className="absolute -bottom-24 -right-10 w-72 h-72 rounded-full bg-sky-500/10 blur-3xl" />
            </div>

            <div className="relative p-4 md:p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="h-9 w-9 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-700 dark:from-black dark:to-slate-900 flex items-center justify-center">
                    <QrCode size={18} className="text-emerald-400" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-[0.16em]">
                      Live Camera
                    </span>
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-50">
                      Scanner QR Peserta
                    </span>
                  </div>
                </div>
                {lastResult && (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800">
                    <CheckCircle2 size={16} />
                    <span className="text-[10px] sm:text-[11px] font-medium truncate max-w-[180px] sm:max-w-[220px]">
                      Terbaca: {lastResult.slice(0, 40)}{lastResult.length > 40 ? '…' : ''}
                    </span>
                  </div>
                )}
              </div>

              <div className="relative mx-auto w-full max-w-md md:max-w-2xl aspect-[4/5] md:aspect-video bg-slate-950/95 rounded-3xl overflow-hidden border border-slate-800 shadow-inner">
                <div id="reader" className="h-full w-full pt-8" />
                {isScanning && (
                  <button
                    type="button"
                    onClick={async () => {
                      await stopScanner();
                      setIsScanning(false);
                      setShowCloseHint(false);
                    }}
                    className="absolute right-3 top-3 z-10 inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-slate-100 hover:bg-black/80 border border-slate-700/70 shadow-md transition-colors"
                  >
                    <X size={16} />
                  </button>
                )}
                {isScanning && showCloseHint && (
                  <div className="absolute top-10 right-5 z-10 flex items-center gap-1 md:gap-2">
                    <div className="px-3 py-1 rounded-full bg-slate-900/95 text-[10px] md:text-[11px] text-slate-100 border border-emerald-400/40 shadow-md">
                      <span className="hidden sm:inline">Klik tombol X untuk menutup kamera</span>
                      <span className="sm:hidden">Tap X untuk tutup kamera</span>
                    </div>
                    <div className="hand-nudge rounded-full bg-emerald-500 text-slate-950 p-1.5 shadow-lg shadow-emerald-500/60">
                      <Pointer size={14} />
                    </div>
                  </div>
                )}
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <div className="relative w-[88%] md:w-[80%] aspect-square md:aspect-video border-2 border-emerald-400/80 rounded-3xl shadow-[0_0_35px_rgba(16,185,129,0.65)]">
                    <div className="absolute inset-x-4 top-1/2 h-[1px] -translate-y-1/2 bg-gradient-to-r from-transparent via-emerald-400/80 to-transparent" />
                  </div>
                </div>
              </div>

              <p className="mt-4 text-center text-[11px] md:text-xs text-slate-500 dark:text-slate-400">
                Pastikan izin kamera sudah diaktifkan di browser. Jaga QR Code tetap fokus dan berada di dalam kotak hijau.
              </p>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />

              <div className="mt-4 flex flex-col sm:flex-row justify-center gap-3">
                <button
                  type="button"
                  onClick={handleStartCamera}
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-sky-500 px-5 py-2 text-xs md:text-sm font-semibold text-white shadow-lg shadow-emerald-500/40 hover:from-emerald-400 hover:to-sky-400 transition-colors"
                >
                  <QrCode size={16} />
                  <span>Scan menggunakan kamera</span>
                </button>

                <button
                  type="button"
                  onClick={handleOpenFilePicker}
                  className="inline-flex items-center gap-2 rounded-full bg-slate-900 text-slate-50 px-5 py-2 text-xs md:text-sm font-semibold shadow-lg shadow-slate-900/40 border border-slate-700 hover:bg-slate-800 transition-colors"
                >
                  <ImageIcon size={16} />
                  <span>Scan dari gambar</span>
                </button>
              </div>

              {errorMessage && (
                <div className="mt-3 flex items-start gap-2 rounded-xl bg-amber-50 text-amber-800 px-3 py-2 text-[11px] md:text-xs border border-amber-100 dark:bg-amber-900/20 dark:text-amber-200 dark:border-amber-700/60">
                  <CircleAlert size={14} className="mt-0.5" />
                  <p>{errorMessage}</p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white/90 dark:bg-slate-950/80 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-4 md:p-5 shadow-[0_18px_45px_rgba(15,23,42,0.25)]">
              <div className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-2xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-600 dark:text-slate-200">
                  <Info size={18} />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-50">
                    Tips hasil scan optimal
                  </p>
                  <ul className="text-[11px] md:text-xs text-slate-500 dark:text-slate-300 list-disc pl-4 space-y-1">
                    <li>Gunakan pencahayaan yang cukup dan minim pantulan.</li>
                    <li>Jaga jarak kamera 15–25 cm dari QR Code.</li>
                    <li>Pastikan QR Code tidak terlipat atau terhalang.</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/95 dark:bg-black/70 text-slate-50 rounded-3xl p-4 md:p-5 border border-slate-700/80 shadow-[0_18px_45px_rgba(15,23,42,0.5)]">
              <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-slate-400 mb-2">
                Alur Verifikasi
              </p>
              <ol className="space-y-2 text-xs md:text-sm">
                <li>
                  <span className="font-semibold text-emerald-300">1.</span> Arahkan kamera ke QR Code kartu peserta.
                </li>
                <li>
                  <span className="font-semibold text-emerald-300">2.</span> Sistem akan membuka halaman detail peserta secara otomatis.
                </li>
                <li>
                  <span className="font-semibold text-emerald-300">3.</span> Lakukan update status, catatan, atau verifikasi berkas di halaman detail.
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminScanQr;
