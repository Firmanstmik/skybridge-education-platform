import React from 'react';
import { Link } from 'react-router-dom';
import BlogArticle from '../../components/BlogArticle';

const TokuteiGinouSSWItuApa = () => {
  const title = 'Tokutei Ginou (SSW) Itu Apa? Penjelasan Simpel untuk Pemula dari Indonesia';
  const metaTitle = 'Tokutei Ginou (SSW) Itu Apa? Panduan Pemula';
  const metaDescription = 'SSW Jepang (Tokutei Ginou) itu apa? Ini penjelasan simpel: konsep, syarat umum, fokus bahasa, strategi mulai dari Indonesia, dan kesalahan yang sering terjadi.';
  const canonicalUrl = 'https://www.skybridgenisantara.com/blog/tokutei-ginou-ssw-itu-apa';
  const image = 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&q=80&w=1200';
  const metaKeywords = [
    'tokutei ginou',
    'SSW jepang adalah',
    'kerja ke jepang SSW',
    'kerja ke jepang',
    'cara kerja ke jepang dari indonesia',
    'syarat kerja ke jepang',
    'kursus bahasa jepang untuk kerja',
  ].join(', ');

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: metaTitle,
    description: metaDescription,
    image: [image],
    author: { '@type': 'Organization', name: 'Tim SEO SKYBRIDGE' },
    publisher: {
      '@type': 'Organization',
      name: 'SKYBRIDGE Nusantara International School',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.skybridgenisantara.com/SKYBRIDGE_LOGO.webp',
      },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl },
    datePublished: '2026-04-18',
    dateModified: '2026-04-18',
  };

  const content = (
    <>
      <p>
        Kamu mungkin sudah sering dengar orang bilang: “Sekarang banyak yang <strong>kerja ke Jepang lewat SSW</strong>.” Tapi begitu kamu cari info,
        yang muncul malah istilah teknis: <strong>Tokutei Ginou</strong>, tes skill, tes bahasa, dokumen ini-itu. Akhirnya makin bingung.
      </p>
      <p>
        Tenang. Di artikel ini aku jelasin <strong>SSW Jepang</strong> dengan bahasa simpel: SSW itu apa, cocok untuk siapa, dan apa yang harus kamu siapkan dari Indonesia
        supaya langkah kamu rapi.
      </p>

      <h2 className="text-3xl font-black text-black mt-12 mb-6">SSW Jepang (Tokutei Ginou) Itu Apa?</h2>
      <p>
        <strong>SSW</strong> adalah jalur kerja di Jepang untuk bidang-bidang tertentu. Intinya, kamu direkrut untuk bekerja dan biasanya perlu membuktikan kesiapan lewat tes
        (bahasa dan/atau keterampilan, tergantung bidang).
      </p>
      <p>
        Dibanding program yang sifatnya training, SSW lebih “langsung kerja”. Karena itu, jalur ini cocok untuk yang siap fokus pada target bidang dan siap latihan tes.
      </p>

      <h2 className="text-3xl font-black text-black mt-12 mb-6">Cocok untuk Siapa?</h2>
      <p>
        SSW cocok untuk kamu yang:
      </p>
      <ul className="list-disc pl-8 space-y-4 text-gray-700">
        <li>punya target bidang kerja yang jelas</li>
        <li>siap disiplin latihan bahasa dan istilah kerja</li>
        <li>ingin jalur <strong>cara kerja ke Jepang dari Indonesia</strong> yang fokus ke employment</li>
      </ul>
      <p>
        Kalau kamu benar-benar dari nol dan butuh pembiasaan dulu, kamu juga bisa mempertimbangkan jalur magang sebagai batu loncatan. Intinya: pilih jalur sesuai kesiapan.
      </p>

      <h2 className="text-3xl font-black text-black mt-12 mb-6">Syarat Umum (Gambaran Besar)</h2>
      <p>
        Detail syarat bisa berbeda, tapi gambaran besar <strong>syarat kerja ke Jepang</strong> lewat SSW biasanya mencakup:
      </p>
      <ul className="list-disc pl-8 space-y-4 text-gray-700">
        <li><strong>Bahasa Jepang yang fungsional:</strong> paham instruksi, bisa konfirmasi, dan komunikasi sopan.</li>
        <li><strong>Kesiapan tes:</strong> format tes bahasa/skill sesuai bidang.</li>
        <li><strong>Dokumen rapi:</strong> identitas, pendidikan, dan dokumen pendukung yang diminta program.</li>
        <li><strong>Kesehatan:</strong> siap bekerja dengan ritme disiplin.</li>
      </ul>

      <h2 className="text-3xl font-black text-black mt-12 mb-6">Bahasa Jepang untuk Target SSW: Fokusnya Bukan Sekadar JLPT</h2>
      <p>
        JLPT penting sebagai pondasi, tapi untuk kerja kamu butuh “bahasa yang kepakai”.
        Banyak orang belajar grammar, tapi panik saat dengar instruksi cepat. Jadi fokus latihan kamu sebaiknya:
      </p>
      <ul className="list-disc pl-8 space-y-4 text-gray-700">
        <li><strong>Listening angka & waktu:</strong> menit, jam, jumlah, ukuran.</li>
        <li><strong>Kaiwa kerja:</strong> minta izin, minta ulang, konfirmasi.</li>
        <li><strong>Kosakata bidang:</strong> istilah yang sering muncul di pekerjaan.</li>
      </ul>

      <h2 className="text-3xl font-black text-black mt-12 mb-6">Langkah Mulai dari Indonesia (Versi Praktis)</h2>
      <h3 className="text-2xl font-black text-black mt-10 mb-4">1) Tentukan bidang dan target tes</h3>
      <p>
        Jangan mulai dari “pengen ke Jepang”, mulai dari “pengen kerja di bidang apa”. Ini menentukan kosakata, latihan, dan arah persiapan.
      </p>
      <h3 className="text-2xl font-black text-black mt-10 mb-4">2) Bangun pondasi bahasa yang rapi</h3>
      <p>
        Kalau kamu pemula, mulai dari N5 dasar + kaiwa. Cara paling aman adalah ikut kursus yang memang diarahkan untuk kebutuhan kerja, bukan sekadar teori.
      </p>
      <h3 className="text-2xl font-black text-black mt-10 mb-4">3) Latihan format tes sejak awal</h3>
      <p>
        Banyak orang belajar lama tapi tidak pernah latihan format tes, akhirnya gugup saat ujian. Mulai latihan formatnya lebih awal akan menghemat waktu.
      </p>

      <h2 className="text-3xl font-black text-black mt-12 mb-6">Kesalahan yang Sering Terjadi</h2>
      <ul className="list-disc pl-8 space-y-4 text-gray-700">
        <li><strong>Belajar bahasa tanpa speaking/listening:</strong> padahal di kerja kamu butuh paham instruksi.</li>
        <li><strong>Tidak jelas target bidang:</strong> akhirnya latihan tidak fokus dan cepat capek.</li>
        <li><strong>Dokumen mepet:</strong> bikin proses jadi lambat dan stres.</li>
      </ul>

      <h2 className="text-3xl font-black text-black mt-12 mb-6">Internal Linking (Panduan yang Nyambung)</h2>
      <ul className="list-disc pl-8 space-y-3 text-gray-700">
        <li>
          Mulai dari bahasa: <Link className="text-dory-red font-bold hover:underline" to="/kursus-bahasa-jepang-online">Kursus Bahasa Jepang Online</Link>
        </li>
        <li>
          Jalur kerja: <Link className="text-dory-red font-bold hover:underline" to="/pelatihan-kerja-ke-jepang">Pelatihan Kerja ke Jepang</Link>
        </li>
        <li>
          Kalau kamu ingin jalur yang lebih terstruktur untuk pemula: <Link className="text-dory-red font-bold hover:underline" to="/magang-ke-jepang">Program Magang ke Jepang</Link>
        </li>
      </ul>

      <h2 className="text-3xl font-black text-black mt-12 mb-6">FAQ</h2>
      <h3 className="text-2xl font-black text-black mt-10 mb-4">1) Apakah SSW bisa untuk yang belum punya pengalaman?</h3>
      <p>
        Bisa, tergantung bidang dan kesiapan kamu. Yang penting kamu disiplin latihan dan siap mengikuti proses tes yang dibutuhkan.
      </p>
      <h3 className="text-2xl font-black text-black mt-10 mb-4">2) Bahasa Jepang minimal harus sampai mana?</h3>
      <p>
        Minimal dasar yang fungsional untuk kerja: paham instruksi, bisa konfirmasi, dan komunikasi sopan. Pondasi N5 yang rapi plus latihan kaiwa sangat membantu.
      </p>
      <h3 className="text-2xl font-black text-black mt-10 mb-4">3) Langkah pertama yang paling penting apa?</h3>
      <p>
        Tentukan target bidang, lalu bangun bahasa yang kepakai kerja. Setelah itu baru latihan format tes dan rapikan dokumen.
      </p>

      <h2 className="text-3xl font-black text-black mt-12 mb-6">CTA: Mau Disiapkan untuk Jalur Kerja Jepang?</h2>
      <p>
        Kalau target kamu <strong>kerja ke Jepang lewat SSW</strong>, mulai dari pondasi bahasa dan kebiasaan belajar yang benar.
        Kamu bisa mulai dari{' '}
        <Link className="text-dory-red font-bold hover:underline" to="/kursus-bahasa-jepang-online">Kursus Bahasa Jepang Online</Link>
        lalu lanjut ke{' '}
        <Link className="text-dory-red font-bold hover:underline" to="/pelatihan-kerja-ke-jepang">Pelatihan Kerja ke Jepang</Link>.
        Untuk konsultasi dan pendaftaran, isi <Link className="text-dory-red font-bold hover:underline" to="/register">form pendaftaran</Link>.
      </p>
    </>
  );

  return (
    <BlogArticle
      title={title}
      content={content}
      date="18 April 2026"
      author="Tim SEO SKYBRIDGE"
      category="KERJA SSW"
      image={image}
      metaTitle={metaTitle}
      metaDescription={metaDescription}
      metaKeywords={metaKeywords}
      canonicalUrl={canonicalUrl}
      ogImage={image}
      jsonLd={jsonLd}
    />
  );
};

export default TokuteiGinouSSWItuApa;

