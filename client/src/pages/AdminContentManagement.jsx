import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, ImagePlus, PencilLine, Plus, Save, Trash2, Loader2, ExternalLink } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import AdminLayout from '../components/AdminLayout';
import { resolveContentImage } from '../utils/content';

const PAGE_OPTIONS = [
  { key: 'kursus', label: 'Halaman Kursus', route: '/kursus-bahasa-jepang-online' },
  { key: 'pelatihan', label: 'Halaman Pelatihan', route: '/pelatihan-kerja-ke-jepang' },
  { key: 'magang', label: 'Halaman Magang', route: '/magang-ke-jepang' }
];

const emptyPageForm = {
  navLabel: '',
  heroBadge: '',
  heroTitle: '',
  heroDescription: '',
  sectionTitle: '',
  sectionDescription: '',
  sectionImage: '',
  sectionCardsText: '',
  detailTitle: '',
  detailDescription: '',
  detailBulletsText: '',
  detailQuote: '',
  faqText: '',
  ctaTitle: '',
  ctaDescription: '',
  whatsappText: ''
};

const emptyBlogForm = {
  title: '',
  slug: '',
  excerpt: '',
  category: '',
  author: 'Tim SKYBRIDGE',
  date: new Date().toISOString().slice(0, 10),
  coverImage: '',
  metaTitle: '',
  metaDescription: '',
  metaKeywords: '',
  contentMarkdown: '',
  published: true
};

const listToText = (items = []) => items.join('\n');
const textToList = (value = '') => value.split('\n').map((item) => item.trim()).filter(Boolean);
const cardsToText = (items = []) => items.map((item) => `${item.title || ''} | ${item.description || ''}`).join('\n');
const textToCards = (value = '') => value
  .split('\n')
  .map((line) => line.trim())
  .filter(Boolean)
  .map((line) => {
    const [title, ...rest] = line.split('|');
    return {
      title: (title || '').trim(),
      description: rest.join('|').trim()
    };
  })
  .filter((item) => item.title || item.description);

const faqToText = (items = []) => items.map((item) => `${item.question || ''} | ${item.answer || ''}`).join('\n');
const textToFaq = (value = '') => value
  .split('\n')
  .map((line) => line.trim())
  .filter(Boolean)
  .map((line) => {
    const [question, ...rest] = line.split('|');
    return {
      question: (question || '').trim(),
      answer: rest.join('|').trim()
    };
  })
  .filter((item) => item.question || item.answer);

const mapPageToForm = (page) => ({
  navLabel: page?.navLabel || '',
  heroBadge: page?.heroBadge || '',
  heroTitle: page?.heroTitle || '',
  heroDescription: page?.heroDescription || '',
  sectionTitle: page?.sectionTitle || '',
  sectionDescription: page?.sectionDescription || '',
  sectionImage: page?.sectionImage || '',
  sectionCardsText: cardsToText(page?.sectionCards || []),
  detailTitle: page?.detailTitle || '',
  detailDescription: page?.detailDescription || '',
  detailBulletsText: listToText(page?.detailBullets || []),
  detailQuote: page?.detailQuote || '',
  faqText: faqToText(page?.faq || []),
  ctaTitle: page?.ctaTitle || '',
  ctaDescription: page?.ctaDescription || '',
  whatsappText: page?.whatsappText || ''
});

const mapBlogToForm = (blog) => ({
  title: blog?.title || '',
  slug: blog?.slug || '',
  excerpt: blog?.excerpt || '',
  category: blog?.category || '',
  author: blog?.author || 'Tim SKYBRIDGE',
  date: blog?.date || new Date().toISOString().slice(0, 10),
  coverImage: blog?.coverImage || '',
  metaTitle: blog?.metaTitle || '',
  metaDescription: blog?.metaDescription || '',
  metaKeywords: blog?.metaKeywords || '',
  contentMarkdown: blog?.contentMarkdown || '',
  published: Boolean(blog?.published)
});

const Field = ({ label, children, hint }) => (
  <label className="block space-y-2">
    <span className="block text-sm font-semibold text-slate-700 dark:text-slate-200">{label}</span>
    {children}
    {hint && <span className="block text-xs text-slate-400">{hint}</span>}
  </label>
);

const inputClassName = 'w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-sm text-slate-900 dark:text-slate-100 outline-none focus:border-red-400 focus:ring-4 focus:ring-red-500/10 transition-all';
const textareaClassName = `${inputClassName} min-h-[120px] resize-y`;

const AdminContentManagement = () => {
  const [activeTab, setActiveTab] = useState('pages');
  const [settings, setSettings] = useState({ waGroupLink: '' });
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [selectedPageKey, setSelectedPageKey] = useState('kursus');
  const [pages, setPages] = useState({});
  const [blogs, setBlogs] = useState([]);
  const [pageForm, setPageForm] = useState(emptyPageForm);
  const [blogForm, setBlogForm] = useState(emptyBlogForm);
  const [editingBlogId, setEditingBlogId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingPage, setIsSavingPage] = useState(false);
  const [isSavingBlog, setIsSavingBlog] = useState(false);
  const [uploadingField, setUploadingField] = useState('');

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const authHeaders = useMemo(() => ({
    headers: { Authorization: `Bearer ${token}` }
  }), [token]);

  const fetchAdminContent = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get('/api/content/admin/all', authHeaders);
      setPages(data.pages || {});
      setBlogs(Array.isArray(data.blogs) ? data.blogs : []);
      setSettings(data.settings || { waGroupLink: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal memuat konten');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminContent();
  }, []);

  useEffect(() => {
    setPageForm(mapPageToForm(pages[selectedPageKey]));
  }, [pages, selectedPageKey]);

  const handlePageInput = (e) => {
    const { name, value } = e.target;
    setPageForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlogInput = (e) => {
    const { name, value, type, checked } = e.target;
    setBlogForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const saveSettings = async (e) => {
    e.preventDefault();
    setIsSavingSettings(true);
    try {
      const { data } = await axios.put('/api/content/settings', settings, authHeaders);
      setSettings(data || { waGroupLink: '' });
      toast.success('Pengaturan berhasil disimpan');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal menyimpan pengaturan');
    } finally {
      setIsSavingSettings(false);
    }
  };

  const savePage = async (e) => {
    e.preventDefault();
    setIsSavingPage(true);
    try {
      const payload = {
        navLabel: pageForm.navLabel,
        heroBadge: pageForm.heroBadge,
        heroTitle: pageForm.heroTitle,
        heroDescription: pageForm.heroDescription,
        sectionTitle: pageForm.sectionTitle,
        sectionDescription: pageForm.sectionDescription,
        sectionImage: pageForm.sectionImage,
        sectionCards: textToCards(pageForm.sectionCardsText),
        detailTitle: pageForm.detailTitle,
        detailDescription: pageForm.detailDescription,
        detailBullets: textToList(pageForm.detailBulletsText),
        detailQuote: pageForm.detailQuote,
        faq: textToFaq(pageForm.faqText),
        ctaTitle: pageForm.ctaTitle,
        ctaDescription: pageForm.ctaDescription,
        whatsappText: pageForm.whatsappText
      };

      const { data } = await axios.put(`/api/content/pages/${selectedPageKey}`, payload, authHeaders);
      setPages((prev) => ({ ...prev, [selectedPageKey]: data }));
      toast.success('Konten halaman berhasil disimpan');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal menyimpan halaman');
    } finally {
      setIsSavingPage(false);
    }
  };

  const resetBlogForm = () => {
    setEditingBlogId(null);
    setBlogForm(emptyBlogForm);
  };

  const saveBlog = async (e) => {
    e.preventDefault();
    setIsSavingBlog(true);
    try {
      if (editingBlogId) {
        const { data } = await axios.put(`/api/content/blogs/${editingBlogId}`, blogForm, authHeaders);
        setBlogs((prev) => prev.map((item) => (item.id === editingBlogId ? data : item)));
        toast.success('Artikel berhasil diperbarui');
      } else {
        const { data } = await axios.post('/api/content/blogs', blogForm, authHeaders);
        setBlogs((prev) => [data, ...prev]);
        setEditingBlogId(data.id);
        toast.success('Artikel baru berhasil dibuat');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal menyimpan artikel');
    } finally {
      setIsSavingBlog(false);
    }
  };

  const editBlog = (blog) => {
    setActiveTab('blogs');
    setEditingBlogId(blog.id);
    setBlogForm(mapBlogToForm(blog));
  };

  const deleteBlog = async (id) => {
    if (!window.confirm('Hapus artikel ini?')) return;
    try {
      await axios.delete(`/api/content/blogs/${id}`, authHeaders);
      setBlogs((prev) => prev.filter((item) => item.id !== id));
      if (editingBlogId === id) resetBlogForm();
      toast.success('Artikel berhasil dihapus');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal menghapus artikel');
    }
  };

  const uploadImage = async (file, target) => {
    if (!file) return;
    setUploadingField(target);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const { data } = await axios.post('/api/content/upload-image', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (target.startsWith('page:')) {
        const field = target.split(':')[1];
        setPageForm((prev) => ({ ...prev, [field]: data.imageUrl }));
      } else {
        const field = target.split(':')[1];
        setBlogForm((prev) => ({ ...prev, [field]: data.imageUrl }));
      }
      toast.success('Gambar berhasil diupload');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal upload gambar');
    } finally {
      setUploadingField('');
    }
  };

  const currentPage = pages[selectedPageKey];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <section className="rounded-[32px] border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/70 p-6 md:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-red-500">CMS Website</p>
              <h1 className="mt-2 text-2xl md:text-3xl font-black text-slate-900 dark:text-slate-50">
                Kelola Konten Halaman dan Blog
              </h1>
              <p className="mt-3 max-w-3xl text-sm md:text-base leading-7 text-slate-500 dark:text-slate-400">
                Ubah teks, upload gambar, dan kelola artikel blog langsung dari dashboard admin.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setActiveTab('pages')}
                className={`rounded-2xl px-4 py-2.5 text-sm font-bold transition-all ${activeTab === 'pages' ? 'bg-red-500 text-white shadow-lg shadow-red-500/25' : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300'}`}
              >
                Halaman Program
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('blogs')}
                className={`rounded-2xl px-4 py-2.5 text-sm font-bold transition-all ${activeTab === 'blogs' ? 'bg-red-500 text-white shadow-lg shadow-red-500/25' : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300'}`}
              >
                Blog
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('settings')}
                className={`rounded-2xl px-4 py-2.5 text-sm font-bold transition-all ${activeTab === 'settings' ? 'bg-red-500 text-white shadow-lg shadow-red-500/25' : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300'}`}
              >
                Pengaturan
              </button>
            </div>
          </div>
        </section>

        {isLoading ? (
          <div className="rounded-[32px] border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/70 p-10 text-center text-slate-500">
            Memuat data CMS...
          </div>
        ) : activeTab === 'settings' ? (
          <form onSubmit={saveSettings} className="rounded-[32px] border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/70 p-6 md:p-8 space-y-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Pengaturan Siswa</p>
              <h2 className="mt-2 text-xl font-black text-slate-900 dark:text-slate-50">Link Grup WhatsApp Peserta</h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Link ini akan langsung ditampilkan ke siswa setelah pembayaran dikonfirmasi lunas di halaman Cek Status.
              </p>
            </div>
            <Field label="Link Invite Grup WA">
              <input
                name="waGroupLink"
                value={settings.waGroupLink || ''}
                onChange={(e) => setSettings((prev) => ({ ...prev, waGroupLink: e.target.value }))}
                placeholder="https://chat.whatsapp.com/..."
                className={inputClassName}
              />
            </Field>
            <button
              type="submit"
              disabled={isSavingSettings}
              className="inline-flex items-center gap-2 rounded-2xl bg-red-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-red-500/25 disabled:opacity-60"
            >
              {isSavingSettings ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              Simpan Pengaturan
            </button>
          </form>
        ) : activeTab === 'pages' ? (
          <div className="grid xl:grid-cols-[280px_1fr] gap-6">
            <aside className="rounded-[32px] border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/70 p-4">
              <p className="px-3 pt-2 text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Pilih Halaman</p>
              <div className="mt-4 space-y-2">
                {PAGE_OPTIONS.map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setSelectedPageKey(item.key)}
                    className={`w-full rounded-2xl border px-4 py-4 text-left transition-all ${
                      selectedPageKey === item.key
                        ? 'border-red-200 bg-red-50 text-red-600 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300'
                        : 'border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-300'
                    }`}
                  >
                    <div className="font-bold">{item.label}</div>
                    <div className="mt-1 text-xs opacity-80">{item.route}</div>
                  </button>
                ))}
              </div>
            </aside>

            <form onSubmit={savePage} className="rounded-[32px] border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/70 p-6 md:p-8 space-y-8">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-slate-50">{currentPage?.heroTitle || 'Konten Halaman'}</h2>
                  <p className="mt-1 text-sm text-slate-500">Edit isi halaman lalu klik simpan.</p>
                </div>
                {currentPage?.route && (
                  <Link to={currentPage.route} target="_blank" className="inline-flex items-center gap-2 rounded-2xl bg-slate-100 dark:bg-slate-900 px-4 py-2 text-sm font-bold text-slate-700 dark:text-slate-200">
                    Lihat Halaman
                    <ExternalLink size={16} />
                  </Link>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <Field label="Label Navigasi">
                  <input name="navLabel" value={pageForm.navLabel} onChange={handlePageInput} className={inputClassName} />
                </Field>
                <Field label="Badge Hero">
                  <input name="heroBadge" value={pageForm.heroBadge} onChange={handlePageInput} className={inputClassName} />
                </Field>
              </div>

              <Field label="Judul Hero">
                <input name="heroTitle" value={pageForm.heroTitle} onChange={handlePageInput} className={inputClassName} />
              </Field>

              <Field label="Deskripsi Hero">
                <textarea name="heroDescription" value={pageForm.heroDescription} onChange={handlePageInput} className={textareaClassName} />
              </Field>

              <div className="grid md:grid-cols-[1fr_200px] gap-5 items-start">
                <Field label="Gambar Konten" hint="Bisa isi URL gambar langsung atau upload file baru.">
                  <input name="sectionImage" value={pageForm.sectionImage} onChange={handlePageInput} className={inputClassName} />
                </Field>
                <div className="space-y-3">
                  <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-slate-100 dark:bg-slate-900 px-4 py-3 text-sm font-bold text-slate-700 dark:text-slate-200">
                    {uploadingField === 'page:sectionImage' ? <Loader2 size={16} className="animate-spin" /> : <ImagePlus size={16} />}
                    Upload Gambar
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => uploadImage(e.target.files?.[0], 'page:sectionImage')} />
                  </label>
                  {pageForm.sectionImage && (
                    <img src={resolveContentImage(pageForm.sectionImage)} alt="Preview" className="h-28 w-full rounded-2xl object-cover border border-slate-200 dark:border-slate-800" />
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <Field label="Judul Section">
                  <input name="sectionTitle" value={pageForm.sectionTitle} onChange={handlePageInput} className={inputClassName} />
                </Field>
                <Field label="Judul Detail">
                  <input name="detailTitle" value={pageForm.detailTitle} onChange={handlePageInput} className={inputClassName} />
                </Field>
              </div>

              <Field label="Deskripsi Section">
                <textarea name="sectionDescription" value={pageForm.sectionDescription} onChange={handlePageInput} className={textareaClassName} />
              </Field>

              <Field label="Kartu Section" hint="Satu baris satu item. Format: Judul | Deskripsi">
                <textarea name="sectionCardsText" value={pageForm.sectionCardsText} onChange={handlePageInput} className={textareaClassName} />
              </Field>

              <Field label="Deskripsi Detail">
                <textarea name="detailDescription" value={pageForm.detailDescription} onChange={handlePageInput} className={textareaClassName} />
              </Field>

              <Field label="Poin Detail" hint="Satu baris satu poin bullet.">
                <textarea name="detailBulletsText" value={pageForm.detailBulletsText} onChange={handlePageInput} className={textareaClassName} />
              </Field>

              <Field label="Quote Detail">
                <textarea name="detailQuote" value={pageForm.detailQuote} onChange={handlePageInput} className={textareaClassName} />
              </Field>

              <Field label="FAQ" hint="Satu baris satu item. Format: Pertanyaan | Jawaban">
                <textarea name="faqText" value={pageForm.faqText} onChange={handlePageInput} className={textareaClassName} />
              </Field>

              <div className="grid md:grid-cols-2 gap-5">
                <Field label="Judul CTA">
                  <input name="ctaTitle" value={pageForm.ctaTitle} onChange={handlePageInput} className={inputClassName} />
                </Field>
                <Field label="Teks WhatsApp CTA">
                  <input name="whatsappText" value={pageForm.whatsappText} onChange={handlePageInput} className={inputClassName} />
                </Field>
              </div>

              <Field label="Deskripsi CTA">
                <textarea name="ctaDescription" value={pageForm.ctaDescription} onChange={handlePageInput} className={textareaClassName} />
              </Field>

              <div className="flex justify-end">
                <button type="submit" disabled={isSavingPage} className="inline-flex items-center gap-2 rounded-2xl bg-red-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-red-500/20 disabled:opacity-60">
                  {isSavingPage ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  Simpan Halaman
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="grid xl:grid-cols-[340px_1fr] gap-6">
            <aside className="rounded-[32px] border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/70 p-4">
              <div className="flex items-center justify-between gap-3 px-2 pt-2">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Artikel Blog</p>
                  <h2 className="mt-2 text-lg font-black text-slate-900 dark:text-slate-50">{blogs.length} Artikel</h2>
                </div>
                <button type="button" onClick={resetBlogForm} className="inline-flex items-center gap-2 rounded-2xl bg-red-500 px-3 py-2 text-xs font-bold text-white">
                  <Plus size={14} />
                  Baru
                </button>
              </div>

              <div className="mt-4 space-y-3">
                {blogs.map((blog) => (
                  <div key={blog.id} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/70 p-3">
                    <div className="flex items-start gap-3">
                      <img src={resolveContentImage(blog.coverImage)} alt={blog.title} className="h-14 w-14 rounded-xl object-cover bg-slate-200" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-slate-900 dark:text-slate-100 line-clamp-2">{blog.title}</p>
                        <p className="mt-1 text-xs text-slate-500">{blog.slug}</p>
                        <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-400">
                          <span>{blog.date}</span>
                          <span>{blog.published ? 'Published' : 'Draft'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 flex gap-2">
                      <button type="button" onClick={() => editBlog(blog)} className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 dark:bg-slate-800 px-3 py-2 text-xs font-bold text-white">
                        <PencilLine size={14} />
                        Edit
                      </button>
                      <button type="button" onClick={() => deleteBlog(blog.id)} className="inline-flex items-center justify-center rounded-xl bg-red-50 px-3 py-2 text-red-600 border border-red-100">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </aside>

            <form onSubmit={saveBlog} className="rounded-[32px] border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/70 p-6 md:p-8 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Editor Blog</p>
                  <h2 className="mt-2 text-xl font-black text-slate-900 dark:text-slate-50">
                    {editingBlogId ? 'Edit Artikel Blog' : 'Buat Artikel Baru'}
                  </h2>
                </div>

                {blogForm.slug && (
                  <Link to={`/blog/${blogForm.slug}`} target="_blank" className="inline-flex items-center gap-2 rounded-2xl bg-slate-100 dark:bg-slate-900 px-4 py-2 text-sm font-bold text-slate-700 dark:text-slate-200">
                    Preview
                    <ExternalLink size={16} />
                  </Link>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <Field label="Judul Artikel">
                  <input name="title" value={blogForm.title} onChange={handleBlogInput} className={inputClassName} required />
                </Field>
                <Field label="Slug URL">
                  <input name="slug" value={blogForm.slug} onChange={handleBlogInput} className={inputClassName} placeholder="akan-diubah-jadi-slug" />
                </Field>
              </div>

              <div className="grid md:grid-cols-3 gap-5">
                <Field label="Kategori">
                  <input name="category" value={blogForm.category} onChange={handleBlogInput} className={inputClassName} />
                </Field>
                <Field label="Penulis">
                  <input name="author" value={blogForm.author} onChange={handleBlogInput} className={inputClassName} />
                </Field>
                <Field label="Tanggal">
                  <input type="date" name="date" value={blogForm.date} onChange={handleBlogInput} className={inputClassName} />
                </Field>
              </div>

              <Field label="Ringkasan Artikel">
                <textarea name="excerpt" value={blogForm.excerpt} onChange={handleBlogInput} className={textareaClassName} />
              </Field>

              <div className="grid md:grid-cols-[1fr_200px] gap-5 items-start">
                <Field label="Gambar Cover">
                  <input name="coverImage" value={blogForm.coverImage} onChange={handleBlogInput} className={inputClassName} />
                </Field>
                <div className="space-y-3">
                  <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-slate-100 dark:bg-slate-900 px-4 py-3 text-sm font-bold text-slate-700 dark:text-slate-200">
                    {uploadingField === 'blog:coverImage' ? <Loader2 size={16} className="animate-spin" /> : <ImagePlus size={16} />}
                    Upload Cover
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => uploadImage(e.target.files?.[0], 'blog:coverImage')} />
                  </label>
                  {blogForm.coverImage && (
                    <img src={resolveContentImage(blogForm.coverImage)} alt="Cover preview" className="h-28 w-full rounded-2xl object-cover border border-slate-200 dark:border-slate-800" />
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <Field label="Meta Title">
                  <input name="metaTitle" value={blogForm.metaTitle} onChange={handleBlogInput} className={inputClassName} />
                </Field>
                <Field label="Meta Keywords">
                  <input name="metaKeywords" value={blogForm.metaKeywords} onChange={handleBlogInput} className={inputClassName} />
                </Field>
              </div>

              <Field label="Meta Description">
                <textarea name="metaDescription" value={blogForm.metaDescription} onChange={handleBlogInput} className={textareaClassName} />
              </Field>

              <Field label="Isi Artikel" hint="Gunakan format sederhana: '##' untuk judul besar, '###' untuk subjudul, dan '- ' untuk bullet list.">
                <textarea name="contentMarkdown" value={blogForm.contentMarkdown} onChange={handleBlogInput} className={`${textareaClassName} min-h-[280px]`} required />
              </Field>

              <label className="inline-flex items-center gap-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/70 px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-200">
                <input type="checkbox" name="published" checked={blogForm.published} onChange={handleBlogInput} className="h-4 w-4 rounded border-slate-300 text-red-500 focus:ring-red-500" />
                Publish artikel ini
              </label>

              <div className="flex flex-wrap justify-end gap-3">
                <button type="button" onClick={resetBlogForm} className="rounded-2xl bg-slate-100 dark:bg-slate-900 px-5 py-3 text-sm font-bold text-slate-700 dark:text-slate-200">
                  Reset Form
                </button>
                <button type="submit" disabled={isSavingBlog} className="inline-flex items-center gap-2 rounded-2xl bg-red-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-red-500/20 disabled:opacity-60">
                  {isSavingBlog ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  {editingBlogId ? 'Simpan Perubahan' : 'Buat Artikel'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminContentManagement;
