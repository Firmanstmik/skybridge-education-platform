import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, MessageCircle, Star } from 'lucide-react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import HeroBg from '../assets/img/bg-internasional.webp';
import { resolveContentImage } from '../utils/content';

const MotionDiv = motion.div;

const ProgramCmsPage = ({ pageKey }) => {
  const [page, setPage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    const fetchPage = async () => {
      setIsLoading(true);
      setError('');
      try {
        const { data } = await axios.get(`/api/content/pages/${pageKey}`);
        if (mounted) setPage(data);
      } catch (err) {
        if (mounted) setError(err.response?.data?.message || 'Gagal memuat konten halaman');
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    fetchPage();
    return () => {
      mounted = false;
    };
  }, [pageKey]);

  const whatsappHref = useMemo(() => {
    const text = page?.whatsappText || 'Halo Admin SKYBRIDGE, saya ingin konsultasi.';
    return `https://wa.me/817084182215?text=${encodeURIComponent(text)}`;
  }, [page?.whatsappText]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fdf8f0]">
        <Navbar />
        <div className="pt-32 px-6 text-center text-slate-500">Memuat konten...</div>
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="min-h-screen bg-[#fdf8f0]">
        <Navbar />
        <div className="pt-32 px-6 text-center">
          <h1 className="text-2xl font-black text-slate-900 mb-3">Konten belum tersedia</h1>
          <p className="text-slate-500">{error || 'Halaman tidak ditemukan.'}</p>
        </div>
      </div>
    );
  }

  const sectionImage = resolveContentImage(page.sectionImage);

  return (
    <>
      <style>{`
        .cms-program-root {
          font-family: 'Plus Jakarta Sans', sans-serif;
          min-height: 100vh;
          background: #fdf8f0;
          background-image:
            repeating-linear-gradient(45deg, rgba(99,102,241,0.025) 0, rgba(99,102,241,0.025) 1px, transparent 1px, transparent 36px),
            repeating-linear-gradient(-45deg, rgba(99,102,241,0.025) 0, rgba(99,102,241,0.025) 1px, transparent 1px, transparent 36px);
        }
      `}</style>

      <div className="cms-program-root">
        <Navbar />

        <MotionDiv
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden px-6 pt-28 pb-24 text-center"
          style={{
            background: `linear-gradient(135deg, rgba(2,6,23,0.88) 0%, rgba(15,23,42,0.92) 60%, rgba(2,6,23,0.88) 100%), url(${HeroBg}) center/cover no-repeat`
          }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.22),transparent_45%)]" />
          <div className="relative max-w-4xl mx-auto">
            <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.25em] text-indigo-300">
              {page.heroBadge}
            </span>
            <h1 className="mt-5 text-4xl md:text-6xl font-black tracking-tight text-white">
              {page.heroTitle}
            </h1>
            <p className="mt-5 max-w-3xl mx-auto text-sm md:text-base leading-7 text-slate-300">
              {page.heroDescription}
            </p>
          </div>
        </MotionDiv>

        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="relative max-w-6xl mx-auto w-[calc(100%-32px)] -mt-14 mb-14 rounded-[32px] bg-white shadow-[0_24px_80px_rgba(0,0,0,0.12)] overflow-hidden"
        >
          <div className="h-1.5 bg-gradient-to-r from-indigo-600 via-blue-500 to-indigo-600" />

          <div className="px-6 md:px-14 py-10 md:py-14">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 text-center leading-tight">
              {page.sectionTitle}
            </h2>

            <div className="grid md:grid-cols-2 gap-10 md:gap-14 mt-10 items-start">
              <div>
                <p className="text-slate-600 leading-8 text-[15px] md:text-base">
                  {page.sectionDescription}
                </p>

                <div className="mt-8 space-y-4">
                  {(page.sectionCards || []).map((item) => (
                    <div key={`${item.title}-${item.description}`} className="rounded-3xl border border-slate-100 bg-slate-50 p-5 md:p-6">
                      <div className="flex items-start gap-4">
                        <div className="mt-0.5 rounded-2xl bg-indigo-100 p-3 text-indigo-600">
                          <CheckCircle size={20} />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                          <p className="mt-2 text-sm leading-7 text-slate-500">{item.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                {sectionImage ? (
                  <img
                    src={sectionImage}
                    alt={page.heroTitle}
                    className="w-full rounded-[28px] object-cover shadow-[0_20px_40px_rgba(0,0,0,0.12)]"
                  />
                ) : (
                  <div className="h-full min-h-[280px] rounded-[28px] bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
                    Gambar belum diatur
                  </div>
                )}
              </div>
            </div>

            <div className="mt-16 rounded-[32px] border border-slate-100 bg-slate-50 p-6 md:p-10">
              <div className="grid md:grid-cols-[1.4fr_1fr] gap-10">
                <div>
                  <h2 className="text-2xl md:text-3xl font-black text-slate-900">{page.detailTitle}</h2>
                  <p className="mt-4 text-slate-600 leading-8">{page.detailDescription}</p>

                  <div className="mt-6 grid gap-3">
                    {(page.detailBullets || []).map((item) => (
                      <div key={item} className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 border border-slate-100">
                        <div className="h-2 w-2 rounded-full bg-indigo-500" />
                        <span className="text-sm font-medium text-slate-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[28px] bg-slate-900 px-6 py-8 text-white flex items-center">
                  <p className="text-sm md:text-base leading-8 text-slate-200">
                    "{page.detailQuote}"
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-16">
              <h2 className="text-3xl md:text-4xl font-black text-center text-slate-900">Pertanyaan Umum</h2>
              <div className="max-w-4xl mx-auto mt-8 space-y-4">
                {(page.faq || []).map((item) => (
                  <div key={`${item.question}-${item.answer}`} className="rounded-3xl border border-slate-100 bg-slate-50 p-6">
                    <div className="flex items-start gap-3 text-slate-900 font-bold">
                      <Star size={18} className="mt-1 text-amber-400 fill-amber-400 flex-shrink-0" />
                      <span>{item.question}</span>
                    </div>
                    <p className="mt-3 pl-8 text-sm md:text-base leading-7 text-slate-500">{item.answer}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-16 rounded-[32px] bg-gradient-to-br from-slate-900 to-slate-800 px-6 py-10 md:px-10 text-center text-white">
              <h2 className="text-2xl md:text-3xl font-black">{page.ctaTitle}</h2>
              <p className="mt-4 max-w-2xl mx-auto text-slate-300 leading-7">{page.ctaDescription}</p>

              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Link to="/register" className="inline-flex items-center justify-center rounded-full bg-indigo-500 px-6 py-3 font-bold text-white shadow-lg shadow-indigo-500/30 hover:bg-indigo-600 transition-colors">
                  Daftar Sekarang
                </Link>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3 font-bold text-white shadow-lg shadow-emerald-500/20 hover:brightness-110 transition-all"
                >
                  <MessageCircle size={18} />
                  Konsultasi WhatsApp
                </a>
              </div>
            </div>
          </div>
        </MotionDiv>
      </div>
    </>
  );
};

export default ProgramCmsPage;
