import React from 'react';
import BlogArticle from '../../components/BlogArticle';

const BiayaKursusJepang = () => {
  const content = (
    <>
      <p>
        Berapa biaya <strong>kursus bahasa Jepang online</strong> yang berkualitas? Pertanyaan ini sering ditanyakan oleh 
        peminat program magang atau kerja ke Jepang. Di <strong>SKYBRIDGE Nusantara International School</strong>, 
        kami menawarkan paket kursus yang terjangkau namun memiliki kualitas internasional.
      </p>

      <h2 className="text-3xl font-black text-black mt-12 mb-6">Komponen Biaya Belajar Bahasa Jepang</h2>
      <p>
        Biaya kursus biasanya mencakup beberapa hal berikut:
      </p>
      <ul className="list-disc pl-8 space-y-4 text-gray-700">
        <li><strong>Biaya Pendaftaran:</strong> Biaya awal untuk registrasi sebagai siswa.</li>
        <li><strong>Materi Pembelajaran:</strong> Buku teks standar Jepang, modul digital, dan latihan soal JLPT.</li>
        <li><strong>Sesi Pengajaran:</strong> Kelas tatap muka online (via Zoom atau Google Meet) bersama sensei berpengalaman.</li>
        <li><strong>Evaluasi & Tryout:</strong> Ujian berkala untuk mengukur kemampuan bahasa Anda.</li>
      </ul>

      <h2 className="text-3xl font-black text-black mt-12 mb-6">Investasi Masa Depan di SKYBRIDGE</h2>
      <p>
        Belajar di <strong>sekolah bahasa Jepang terbaik</strong> seperti SKYBRIDGE adalah investasi terbaik untuk masa depan Anda. 
        Biaya yang Anda keluarkan akan terbayar lunas ketika Anda berhasil mendapatkan <strong>program magang ke Jepang</strong> 
        dengan penghasilan puluhan juta rupiah per bulan.
      </p>

      <p className="mt-8">
        Hubungi admin kami untuk detail promo biaya kursus terbaru. Kami memiliki program cicilan yang fleksibel untuk membantu Anda 
        meraih mimpi ke Jepang tanpa terbebani biaya yang besar.
      </p>
    </>
  );

  return (
    <BlogArticle
      title="Berapa Biaya Kursus Bahasa Jepang? Simak Penjelasannya!"
      content={content}
      date="3 April 2026"
      author="Admin SKYBRIDGE"
      category="INFO BIAYA"
      image="https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80&w=1200"
    />
  );
};

export default BiayaKursusJepang;
