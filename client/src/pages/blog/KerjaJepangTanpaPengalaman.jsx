import React from 'react';
import BlogArticle from '../../components/BlogArticle';

const KerjaJepangTanpaPengalaman = () => {
  const content = (
    <>
      <p>
        Bekerja di Jepang adalah impian banyak pemuda Indonesia. Namun, seringkali muncul pertanyaan: 
        <strong> "Apakah bisa kerja ke Jepang tanpa pengalaman?"</strong> Jawabannya adalah <strong>BISA!</strong> 
        Melalui program <strong>SKYBRIDGE Nusantara International School</strong>, Anda tetap memiliki peluang besar untuk berkarir di Jepang meskipun belum pernah memiliki pengalaman kerja sebelumnya.
      </p>

      <h2 className="text-3xl font-black text-black mt-12 mb-6">Syarat Kerja ke Jepang Tanpa Pengalaman</h2>
      <p>
        Untuk bekerja di Jepang melalui jalur resmi, terutama bagi pemula, ada beberapa hal yang harus dipersiapkan dengan matang:
      </p>
      <ul className="list-disc pl-8 space-y-4 text-gray-700">
        <li><strong>Kemampuan Bahasa Jepang:</strong> Minimal tingkat N4 atau N5. Bahasa adalah kunci utama komunikasi dan keselamatan kerja di Jepang.</li>
        <li><strong>Sertifikasi Kompetensi:</strong> Untuk jalur Tokutei Ginou, Anda perlu lulus ujian keterampilan (skill test) sesuai bidang yang diminati.</li>
        <li><strong>Kesehatan Fisik & Mental:</strong> Lingkungan kerja di Jepang sangat disiplin, sehingga kesehatan prima sangat diperlukan.</li>
      </ul>

      <h2 className="text-3xl font-black text-black mt-12 mb-6">Kenapa Harus Melalui SKYBRIDGE?</h2>
      <p>
        Di <strong>SKYBRIDGE Nusantara International School</strong>, kami membekali Anda dengan pelatihan intensif yang mencakup 
        bahasa dan pengenalan budaya kerja Jepang. Meskipun tanpa pengalaman, Anda akan dididik agar memiliki kompetensi 
        standar internasional sebelum diberangkatkan. Ini adalah jalur <strong>kerja ke Jepang resmi</strong> yang paling aman untuk pemula.
      </p>

      <p className="mt-8">
        Jangan biarkan kurangnya pengalaman menghalangi langkah Anda. Bergabunglah dengan SKYBRIDGE, 
        pintu gerbang utama menuju masa depan gemilang di Jepang.
      </p>
    </>
  );

  return (
    <BlogArticle
      title="Cara Kerja ke Jepang Tanpa Pengalaman: Panduan Lengkap"
      content={content}
      date="3 April 2026"
      author="Tim SEO SKYBRIDGE"
      category="TIPS KARIR"
      image="https://images.unsplash.com/photo-1526481280693-3bfa756150f1?auto=format&fit=crop&q=80&w=1200"
    />
  );
};

export default KerjaJepangTanpaPengalaman;
