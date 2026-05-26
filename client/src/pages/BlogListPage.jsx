import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { CalendarDays, ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import FooterSection from '../components/landing/FooterSection';
import { resolveContentImage } from '../utils/content';

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

      <section className="pt-28 pb-12 px-6 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white">
        <div className="max-w-6xl mx-auto">
          <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.25em] text-indigo-300">
            Blog SKYBRIDGE
          </span>
          <h1 className="mt-5 text-4xl md:text-5xl font-black tracking-tight">Artikel, Tips, dan Insight Seputar Jepang</h1>
          <p className="mt-4 max-w-3xl text-slate-300 leading-7">
            Kumpulan artikel yang bisa membantu calon peserta memahami jalur belajar, pelatihan, magang, dan persiapan menuju Jepang.
          </p>
        </div>
      </section>

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
                  <img
                    src={resolveContentImage(blog.coverImage)}
                    alt={blog.title}
                    className="h-56 w-full object-cover"
                  />
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
