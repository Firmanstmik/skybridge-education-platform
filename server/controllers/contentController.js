const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const dataDir = path.join(__dirname, '..', 'data');
const contentFilePath = path.join(dataDir, 'siteContent.json');

const ensureContentFile = () => {
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }
    if (!fs.existsSync(contentFilePath)) {
        fs.writeFileSync(contentFilePath, JSON.stringify({ pages: {}, blogs: [] }, null, 2), 'utf8');
    }
};

const readContentStore = () => {
    ensureContentFile();
    const raw = fs.readFileSync(contentFilePath, 'utf8');
    const parsed = JSON.parse(raw || '{}');
    return {
        pages: parsed.pages || {},
        blogs: Array.isArray(parsed.blogs) ? parsed.blogs : []
    };
};

const writeContentStore = (data) => {
    ensureContentFile();
    fs.writeFileSync(contentFilePath, JSON.stringify(data, null, 2), 'utf8');
};

const asText = (value, fallback = '') => {
    if (value === undefined || value === null) return fallback;
    return String(value).trim();
};

const asBoolean = (value, fallback = false) => {
    if (value === undefined || value === null) return fallback;
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') return value.toLowerCase() === 'true';
    return Boolean(value);
};

const asStringArray = (value) => {
    if (!Array.isArray(value)) return [];
    return value
        .map((item) => asText(item))
        .filter(Boolean);
};

const asObjectArray = (value, keys) => {
    if (!Array.isArray(value)) return [];
    return value
        .map((item) => {
            if (!item || typeof item !== 'object') return null;
            const next = {};
            keys.forEach((key) => {
                next[key] = asText(item[key]);
            });
            return next;
        })
        .filter((item) => item && keys.some((key) => item[key]));
};

const slugify = (value) => asText(value)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

const normalizePagePayload = (payload = {}, existing = {}) => ({
    ...existing,
    key: existing.key,
    route: existing.route,
    navLabel: asText(payload.navLabel, existing.navLabel || ''),
    heroBadge: asText(payload.heroBadge, existing.heroBadge || ''),
    heroTitle: asText(payload.heroTitle, existing.heroTitle || ''),
    heroDescription: asText(payload.heroDescription, existing.heroDescription || ''),
    sectionTitle: asText(payload.sectionTitle, existing.sectionTitle || ''),
    sectionDescription: asText(payload.sectionDescription, existing.sectionDescription || ''),
    sectionImage: asText(payload.sectionImage, existing.sectionImage || ''),
    sectionCards: asObjectArray(payload.sectionCards, ['title', 'description']),
    detailTitle: asText(payload.detailTitle, existing.detailTitle || ''),
    detailDescription: asText(payload.detailDescription, existing.detailDescription || ''),
    detailBullets: asStringArray(payload.detailBullets),
    detailQuote: asText(payload.detailQuote, existing.detailQuote || ''),
    faq: asObjectArray(payload.faq, ['question', 'answer']),
    ctaTitle: asText(payload.ctaTitle, existing.ctaTitle || ''),
    ctaDescription: asText(payload.ctaDescription, existing.ctaDescription || ''),
    whatsappText: asText(payload.whatsappText, existing.whatsappText || '')
});

const normalizeBlogPayload = (payload = {}, existing = {}) => {
    const requestedSlug = slugify(payload.slug || payload.title || existing.slug || existing.title || '');
    return {
        ...existing,
        title: asText(payload.title, existing.title || ''),
        slug: requestedSlug,
        excerpt: asText(payload.excerpt, existing.excerpt || ''),
        category: asText(payload.category, existing.category || ''),
        author: asText(payload.author, existing.author || 'Tim SKYBRIDGE'),
        date: asText(payload.date, existing.date || new Date().toISOString().slice(0, 10)),
        coverImage: asText(payload.coverImage, existing.coverImage || ''),
        metaTitle: asText(payload.metaTitle, existing.metaTitle || ''),
        metaDescription: asText(payload.metaDescription, existing.metaDescription || ''),
        metaKeywords: asText(payload.metaKeywords, existing.metaKeywords || ''),
        contentMarkdown: asText(payload.contentMarkdown, existing.contentMarkdown || ''),
        published: asBoolean(payload.published, existing.published ?? true)
    };
};

const ensureUniqueBlogSlug = (blogs, slug, currentId = null) => {
    const baseSlug = slug || `artikel-${Date.now()}`;
    let candidate = baseSlug;
    let counter = 2;
    while (blogs.some((blog) => blog.slug === candidate && blog.id !== currentId)) {
        candidate = `${baseSlug}-${counter}`;
        counter += 1;
    }
    return candidate;
};

const sortBlogs = (blogs) => [...blogs].sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')));

exports.getPublicPages = async (_req, res) => {
    const store = readContentStore();
    res.json(store.pages);
};

exports.getPublicPageByKey = async (req, res) => {
    const store = readContentStore();
    const page = store.pages[req.params.pageKey];
    if (!page) {
        return res.status(404).json({ message: 'Halaman tidak ditemukan' });
    }
    res.json(page);
};

exports.getPublicBlogs = async (_req, res) => {
    const store = readContentStore();
    const blogs = sortBlogs(store.blogs)
        .filter((blog) => blog.published)
        .map((blog) => ({
            id: blog.id,
            slug: blog.slug,
            title: blog.title,
            excerpt: blog.excerpt,
            category: blog.category,
            author: blog.author,
            date: blog.date,
            coverImage: blog.coverImage,
            metaDescription: blog.metaDescription
        }));
    res.json(blogs);
};

exports.getPublicBlogBySlug = async (req, res) => {
    const store = readContentStore();
    const blog = store.blogs.find((item) => item.slug === req.params.slug && item.published);
    if (!blog) {
        return res.status(404).json({ message: 'Artikel tidak ditemukan' });
    }
    res.json(blog);
};

exports.getAdminContent = async (_req, res) => {
    const store = readContentStore();
    res.json({
        pages: store.pages,
        blogs: sortBlogs(store.blogs)
    });
};

exports.updatePageContent = async (req, res) => {
    const store = readContentStore();
    const existing = store.pages[req.params.pageKey];

    if (!existing) {
        return res.status(404).json({ message: 'Halaman tidak ditemukan' });
    }

    const nextPage = normalizePagePayload(req.body, existing);
    store.pages[req.params.pageKey] = nextPage;
    writeContentStore(store);
    res.json(nextPage);
};

exports.createBlog = async (req, res) => {
    const store = readContentStore();
    const now = new Date().toISOString();
    const nextBlog = normalizeBlogPayload(req.body);

    if (!nextBlog.title || !nextBlog.contentMarkdown) {
        return res.status(400).json({ message: 'Judul dan isi artikel wajib diisi' });
    }

    nextBlog.id = `blog-${crypto.randomUUID()}`;
    nextBlog.slug = ensureUniqueBlogSlug(store.blogs, nextBlog.slug);
    nextBlog.createdAt = now;
    nextBlog.updatedAt = now;

    store.blogs.push(nextBlog);
    writeContentStore(store);
    res.status(201).json(nextBlog);
};

exports.updateBlog = async (req, res) => {
    const store = readContentStore();
    const index = store.blogs.findIndex((blog) => blog.id === req.params.id);

    if (index === -1) {
        return res.status(404).json({ message: 'Artikel tidak ditemukan' });
    }

    const existing = store.blogs[index];
    const nextBlog = normalizeBlogPayload(req.body, existing);

    if (!nextBlog.title || !nextBlog.contentMarkdown) {
        return res.status(400).json({ message: 'Judul dan isi artikel wajib diisi' });
    }

    nextBlog.id = existing.id;
    nextBlog.slug = ensureUniqueBlogSlug(store.blogs, nextBlog.slug, existing.id);
    nextBlog.createdAt = existing.createdAt || new Date().toISOString();
    nextBlog.updatedAt = new Date().toISOString();

    store.blogs[index] = nextBlog;
    writeContentStore(store);
    res.json(nextBlog);
};

exports.deleteBlog = async (req, res) => {
    const store = readContentStore();
    const nextBlogs = store.blogs.filter((blog) => blog.id !== req.params.id);

    if (nextBlogs.length === store.blogs.length) {
        return res.status(404).json({ message: 'Artikel tidak ditemukan' });
    }

    store.blogs = nextBlogs;
    writeContentStore(store);
    res.json({ message: 'Artikel berhasil dihapus' });
};

exports.uploadContentImage = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'File gambar tidak ditemukan' });
    }

    res.status(201).json({
        message: 'Gambar berhasil diupload',
        imageUrl: `/uploads/${req.file.filename}`
    });
};
