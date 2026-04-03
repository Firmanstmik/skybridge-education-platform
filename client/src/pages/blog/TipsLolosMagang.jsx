import React from 'react';
import BlogArticle from '../../components/BlogArticle';

const TipsLolosMagang = () => {
  const content = (
    <>
      <p>
        Bagi Anda yang berminat mengikuti <strong>program magang ke Jepang</strong>, persiapan yang matang adalah kunci utama. 
        Persaingan untuk mendapatkan penempatan kerja resmi di Jepang cukup ketat, sehingga Anda perlu tahu 
        <strong> "Tips lolos magang ke Jepang"</strong> agar impian Anda bisa terwujud.
      </p>

      <h2 className="text-3xl font-black text-black mt-12 mb-6">Persiapan Fisik & Mental Sebelum Magang</h2>
      <p>
        Sebelum berangkat ke Jepang, pastikan Anda mempersiapkan diri dalam beberapa aspek:
      </p>
      <ul className="list-disc pl-8 space-y-4 text-gray-700">
        <li><strong>Kedisiplinan Waktu:</strong> Orang Jepang sangat menghargai waktu. Latihlah disiplin diri sejak dini.</li>
        <li><strong>Kesehatan Fisik:</strong> Pastikan Anda bebas dari penyakit kronis yang bisa mengganggu pekerjaan.</li>
        <li><strong>Kemampuan Komunikasi:</strong> Kuasai dasar bahasa Jepang agar bisa berinteraksi dengan rekan kerja di Jepang.</li>
      </ul>

      <h2 className="text-3xl font-black text-black mt-12 mb-6">Mengapa Memilih SKYBRIDGE untuk Program Magang?</h2>
      <p>
        <strong>SKYBRIDGE Nusantara International School</strong> adalah lembaga resmi yang berpengalaman dalam menyalurkan 
        tenaga kerja ke Jepang. Kami memberikan pelatihan intensif, simulasi wawancara dengan user Jepang, dan pendampingan 
        penuh hingga Anda berangkat ke Jepang.
      </p>

      <p className="mt-8">
        Jangan tunda lagi impian Anda. Ikuti tips lolos magang ke Jepang bersama SKYBRIDGE dan raih kesuksesan di Negeri Sakura. 
        Daftar program magang sekarang juga!
      </p>
    </>
  );

  return (
    <BlogArticle
      title="Tips Lolos Magang ke Jepang: Rahasia Sukses Seleksi"
      content={content}
      date="3 April 2026"
      author="Sensei SKYBRIDGE"
      category="TIPS SUKSES"
      image="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1200"
    />
  );
};

export default TipsLolosMagang;
