import React from 'react';
import Navbar from './Navbar';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Tag } from 'lucide-react';

const BlogArticle = ({ title, content, date, author, category, image }) => {
  return (
    <div className="bg-white min-h-screen font-sans">
      <Navbar />
      <article className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-dory-red font-bold mb-8 hover:underline">
          <ArrowLeft size={20} /> Kembali ke Beranda
        </Link>
        
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
          <span className="flex items-center gap-1"><Calendar size={14} /> {date}</span>
          <span className="flex items-center gap-1"><User size={14} /> {author}</span>
          <span className="flex items-center gap-1 text-dory-red font-bold uppercase tracking-wider"><Tag size={14} /> {category}</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-black text-black leading-tight mb-8">
          {title}
        </h1>

        {image && (
          <img 
            src={image} 
            alt={title} 
            className="w-full h-[400px] object-cover rounded-3xl shadow-2xl mb-12"
          />
        )}

        <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-6">
          {content}
        </div>

        <div className="mt-16 p-8 bg-red-50 rounded-3xl border border-red-100 text-center">
          <h3 className="text-2xl font-black text-black mb-4">Ingin Segera Berangkat ke Jepang?</h3>
          <p className="text-gray-600 mb-8">
            Wujudkan impianmu bersama SKYBRIDGE Nusantara International School. Daftar program pelatihan kerja atau magang sekarang juga!
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link to="/register" className="bg-dory-red text-white px-8 py-4 rounded-full font-bold hover:scale-105 transition-transform shadow-xl">
              Daftar Sekarang
            </Link>
            <a href="https://wa.me/817084182215?text=Halo%20Admin%20SKYBRIDGE%20Nusantara,%20saya%20ingin%20konsultasi%20setelah%20membaca%20artikel%20blog." className="bg-[#25D366] text-white px-8 py-4 rounded-full font-bold hover:scale-105 transition-transform shadow-xl">
              Tanya via WhatsApp
            </a>
          </div>
        </div>
      </article>
    </div>
  );
};

export default BlogArticle;
