import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import BlogArticle from '../components/BlogArticle';
import { renderSimpleMarkdownBlocks, resolveContentImage } from '../utils/content';

const DynamicBlogPage = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    const fetchBlog = async () => {
      setIsLoading(true);
      setError('');
      try {
        const { data } = await axios.get(`/api/content/blogs/${slug}`);
        if (mounted) setBlog(data);
      } catch (err) {
        if (mounted) setError(err.response?.data?.message || 'Gagal memuat artikel');
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    fetchBlog();
    return () => {
      mounted = false;
    };
  }, [slug]);

  const renderedContent = useMemo(() => {
    const blocks = renderSimpleMarkdownBlocks(blog?.contentMarkdown || '');
    return (
      <>
        {blocks.map((block, index) => {
          if (block.type === 'h2') {
            return <h2 key={`${block.type}-${index}`} className="text-3xl font-black text-black mt-12 mb-6">{block.content}</h2>;
          }
          if (block.type === 'h3') {
            return <h3 key={`${block.type}-${index}`} className="text-2xl font-black text-black mt-10 mb-4">{block.content}</h3>;
          }
          if (block.type === 'list') {
            return (
              <ul key={`${block.type}-${index}`} className="list-disc pl-8 space-y-3 text-gray-700">
                {block.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            );
          }
          return <p key={`${block.type}-${index}`}>{block.content}</p>;
        })}
      </>
    );
  }, [blog?.contentMarkdown]);

  if (isLoading) {
    return <div className="min-h-screen bg-white pt-32 text-center text-slate-500">Memuat artikel...</div>;
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-white pt-32 text-center px-6">
        <h1 className="text-3xl font-black text-slate-900">Artikel tidak ditemukan</h1>
        <p className="mt-3 text-slate-500">{error || 'Silakan cek slug artikel yang diakses.'}</p>
      </div>
    );
  }

  return (
    <BlogArticle
      title={blog.title}
      content={renderedContent}
      date={blog.date}
      author={blog.author}
      category={blog.category}
      image={resolveContentImage(blog.coverImage)}
      metaTitle={blog.metaTitle || blog.title}
      metaDescription={blog.metaDescription || blog.excerpt}
      metaKeywords={blog.metaKeywords || ''}
      canonicalUrl={`https://www.skybridgenisantara.com/blog/${blog.slug}`}
      ogImage={resolveContentImage(blog.coverImage)}
      jsonLd={{
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: blog.metaTitle || blog.title,
        description: blog.metaDescription || blog.excerpt || '',
        image: [resolveContentImage(blog.coverImage)].filter(Boolean),
        author: { '@type': 'Organization', name: blog.author || 'Tim SKYBRIDGE' },
        publisher: {
          '@type': 'Organization',
          name: 'SKYBRIDGE Nusantara International School'
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': `https://www.skybridgenisantara.com/blog/${blog.slug}`
        },
        datePublished: blog.date,
        dateModified: blog.updatedAt || blog.date
      }}
    />
  );
};

export default DynamicBlogPage;
