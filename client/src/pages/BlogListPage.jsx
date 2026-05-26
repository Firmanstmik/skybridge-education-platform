import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { CalendarDays, ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import FooterSection from '../components/landing/FooterSection';
import HeroBg from '../assets/img/bg-internasional.webp';
import { resolveContentImage } from '../utils/content';

const MotionDiv = motion.div;

const BlogListPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    const fetchBlogs = async () => {
      setIsLoading(true);
      setError('');
      try {
        const { data } = await axios.get('/api/content/blogs');
        if (mounted) setBlogs(Array.isArray(data) ? data : []);
      } catch (err) {
        if (mounted) setError(err.response?.data?.message || 'Gagal memuat daftar artikel');
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    fetchBlogs();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
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
        <div className="relative max-w-6xl mx-auto text-left">
          <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.25em] text-indigo-300">
            Blog SKYBRIDGE
          </span>
          <h1 className="mt-5 text-4xl md:text-5xl font-black tracking-tight text-white drop-shadow-[0_8px_24px_rgba(0,0,0,0.45)]">
            Artikel, Tips, dan Insight Seputar Jepang
          </h1>
          <p className="mt-4 max-w-3xl text-slate-100/95 leading-7 drop-shadow-[0_6px_18px_rgba(0,0,0,0.35)]">
            Kumpulan artikel yang bisa membantu calon peserta memahami jalur belajar, pelatihan, magang, dan persiapan menuju Jepang.
          </p>
        </div>
      </MotionDiv>

      <section className="max-w-6xl mx-auto px-6 py-12">
        {isLoading && <div className="text-center text-slate-500">Memuat artikel...</div>}

        {!isLoading && error && (
          <div className="rounded-3xl border border-red-100 bg-red-50 px-6 py-5 text-red-600">{error}</div>
        )}

        {!isLoading && !error && blogs.length === 0 && (
          <div className="rounded-3xl border border-slate-200 bg-white px-6 py-8 text-center text-slate-500">
            Belum ada artikel yang dipublikasikan.
          </div>
        )}

        {!isLoading && !error && blogs.length > 0 && (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <article key={blog.id} className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm hover:shadow-xl transition-shadow">
                <Link to={`/blog/${blog.slug}`} className="block">
                  {blog.coverImage ? (
                    <img
                      src={resolveContentImage(blog.coverImage)}
                      alt={blog.title}
                      className="h-56 w-full object-cover"
                    />
                  ) : (
                    <div className="relative flex h-56 w-full items-end overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-900 p-6">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.35),transparent_40%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.28),transparent_35%)]" />
                      <div className="relative">
                        <span className="inline-flex rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-indigo-200">
                          {blog.category || 'Artikel'}
                        </span>
                        <p className="mt-4 max-w-[220px] text-lg font-black leading-tight text-white">
                          {blog.title}
                        </p>
                      </div>
                    </div>
                  )}
                </Link>

                <div className="p-6">
                  <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    <span className="rounded-full bg-indigo-50 px-3 py-1 text-indigo-600">{blog.category || 'Artikel'}</span>
                    <span className="inline-flex items-center gap-1">
                      <CalendarDays size={14} />
                      {blog.date}
                    </span>
                  </div>

                  <h2 className="mt-4 text-xl font-black leading-snug text-slate-900">
                    <Link to={`/blog/${blog.slug}`} className="hover:text-indigo-600 transition-colors">
                      {blog.title}
                    </Link>
                  </h2>

                  <p className="mt-3 text-sm leading-7 text-slate-500">
                    {blog.excerpt || blog.metaDescription || 'Baca artikel lengkapnya untuk informasi lebih detail.'}
                  </p>

                  <div className="mt-5 flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-500">{blog.author || 'Tim SKYBRIDGE'}</span>
                    <Link to={`/blog/${blog.slug}`} className="inline-flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-700">
                      Baca Artikel
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
      <FooterSection />
    </div>
  );
};

export default BlogListPage;
