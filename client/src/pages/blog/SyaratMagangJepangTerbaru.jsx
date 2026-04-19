import React from 'react';
import { Link } from 'react-router-dom';
import BlogArticle from '../../components/BlogArticle';

const SyaratMagangJepangTerbaru = () => {
  const title = 'Syarat Magang Jepang Terbaru: Umur, Pendidikan, Kesehatan, dan Bahasa (Lengkap)';
  const metaTitle = 'Syarat Magang Jepang Terbaru: Checklist Lengkap';
  const metaDescription = 'Syarat magang Jepang untuk orang Indonesia: umur, pendidikan, kesehatan, dokumen, kemampuan bahasa, dan tips lolos seleksi program resmi.';
  const canonicalUrl = 'https://www.skybridgenisantara.com/blog/syarat-magang-jepang-terbaru';
  const image = 'https://images.unsplash.com/photo-1549692520-acc6669e2f0c?auto=format&fit=crop&q=80&w=1200';
  const metaKeywords = [
    'syarat magang jepang',
    'program magang jepang resmi',
    'cara daftar magang jepang',
    'magang jepang',
    'magang jepang butuh jlpt berapa',
    'magang jepang berapa tahun',
    'kursus bahasa jepang',
    'belajar bahasa jepang untuk kerja',
  ].join(', ');

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: metaTitle,
    description: metaDescription,
    image: [image],
    author: { '@type': 'Organization', name: 'Tim Program SKYBRIDGE' },
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
        Banyak orang pengin ikut <strong>magang Jepang</strong> karena jalurnya jelas dan bisa jadi batu loncatan menuju karier yang lebih baik.
        Tapi sebelum semangat “daftar sekarang”, ada satu hal yang wajib kamu bereskan: <strong>paham syaratnya</strong>.
      </p>
      <p>
        Di artikel ini aku rangkum <strong>syarat magang Jepang</strong> yang paling sering diminta program resmi untuk peserta dari Indonesia, plus tips praktis
        supaya kamu tidak gagal gara-gara hal yang sebenarnya bisa disiapkan dari awal.
      </p>

      <h2 className="text-3xl font-black text-black mt-12 mb-6">1) Syarat Umur dan Kesiapan Pribadi</h2>
      <p>
        Target market program biasanya ada di rentang usia produktif. Yang paling penting bukan sekadar umur, tapi kesiapan kamu untuk hidup mandiri,
        kerja disiplin, dan beradaptasi dengan budaya baru.
      </p>
      <ul className="list-disc pl-8 space-y-4 text-gray-700">
        <li><strong>Usia produktif (umumnya 17–35):</strong> pastikan sesuai ketentuan program yang kamu ikuti.</li>
        <li><strong>Komitmen:</strong> sanggup mengikuti pelatihan dan proses seleksi sampai tuntas.</li>
        <li><strong>Disiplin:</strong> tepat waktu, konsisten, dan mau diarahkan.</li>
      </ul>

      <h2 className="text-3xl font-black text-black mt-12 mb-6">2) Syarat Pendidikan</h2>
      <p>
        Pendidikan yang diminta bisa berbeda-beda, tapi umumnya program resmi ingin memastikan kamu punya dasar literasi yang cukup untuk mengikuti pelatihan,
        memahami SOP kerja, dan mengurus administrasi.
      </p>
      <p>
        Tips: siapkan dokumen pendidikan kamu (ijazah/transkrip jika diperlukan) dalam bentuk hardcopy dan scan yang rapi.
      </p>

      <h2 className="text-3xl font-black text-black mt-12 mb-6">3) Syarat Kesehatan (Fisik dan Mental)</h2>
      <p>
        Ini bagian yang sering diremehkan. Magang Jepang itu kerja nyata, bukan liburan. Kamu butuh stamina dan kebiasaan hidup yang rapi.
      </p>
      <ul className="list-disc pl-8 space-y-4 text-gray-700">
        <li><strong>Stamina:</strong> biasakan tidur cukup, makan teratur, dan olahraga ringan.</li>
        <li><strong>Kesiapan mental:</strong> siap menghadapi aturan, ritme kerja, dan culture shock.</li>
        <li><strong>Gaya hidup:</strong> kurangi begadang dan kebiasaan yang bikin fisik drop.</li>
      </ul>

      <h2 className="text-3xl font-black text-black mt-12 mb-6">4) Syarat Bahasa Jepang (Butuh JLPT Berapa?)</h2>
      <p>
        Pertanyaan favorit: <strong>magang Jepang butuh JLPT berapa?</strong> Tidak semua program mewajibkan sertifikat JLPT, tapi kemampuan setara N5 (pondasi)
        dan kemampuan kaiwa dasar biasanya sangat membantu.
      </p>
      <p>
        Untuk tujuan kerja, kamu sebaiknya fokus ke hal yang paling cepat kepakai:
      </p>
      <ul className="list-disc pl-8 space-y-4 text-gray-700">
        <li><strong>Listening instruksi:</strong> angka, waktu, arah, lokasi.</li>
        <li><strong>Kaiwa sopan:</strong> minta izin, konfirmasi, minta bantuan.</li>
        <li><strong>Kosakata kerja dasar:</strong> peralatan sederhana, aktivitas kerja yang sering diulang.</li>
      </ul>

      <h2 className="text-3xl font-black text-black mt-12 mb-6">5) Dokumen yang Biasanya Diminta</h2>
      <p>
        Dokumen bisa berbeda antar program, tapi checklist aman yang sebaiknya kamu siapkan dari awal:
      </p>
      <ul className="list-disc pl-8 space-y-4 text-gray-700">
        <li>KTP, KK, akta lahir (scan dan hardcopy)</li>
        <li>Ijazah dan dokumen pendukung pendidikan</li>
        <li>Pas foto terbaru sesuai ketentuan</li>
        <li>Riwayat kesehatan (sesuai permintaan program)</li>
      </ul>
      <p>
        Kalau kamu rapi dari awal, kamu akan lebih tenang saat jadwal seleksi padat. Banyak orang gugur bukan karena “tidak mampu”, tapi karena administratif berantakan.
      </p>

      <h2 className="text-3xl font-black text-black mt-12 mb-6">6) Hal yang Sering Jadi Penentu Lolos</h2>
      <p>
        Selain syarat “di atas kertas”, ada penentu yang sering bikin perbedaan:
      </p>
      <ul className="list-disc pl-8 space-y-4 text-gray-700">
        <li><strong>Attitude:</strong> sopan, fokus, tidak banyak alasan.</li>
        <li><strong>Komitmen belajar:</strong> konsisten belajar bahasa Jepang 30–60 menit per hari.</li>
        <li><strong>Kesiapan adaptasi:</strong> mau mengikuti aturan asrama/kerja dan terbuka terhadap budaya baru.</li>
      </ul>

      <h2 className="text-3xl font-black text-black mt-12 mb-6">Internal Linking (Langkah Berikutnya)</h2>
      <ul className="list-disc pl-8 space-y-3 text-gray-700">
        <li>
          Mulai dari bahasa Jepang yang terarah: <Link className="text-dory-red font-bold hover:underline" to="/kursus-bahasa-jepang-online">Kursus Bahasa Jepang Online</Link>
        </li>
        <li>
          Lihat detail program magang: <Link className="text-dory-red font-bold hover:underline" to="/magang-ke-jepang">Program Magang ke Jepang</Link>
        </li>
        <li>
          Kalau target kamu kerja setelah pondasi kuat: <Link className="text-dory-red font-bold hover:underline" to="/pelatihan-kerja-ke-jepang">Pelatihan Kerja ke Jepang</Link>
        </li>
      </ul>

      <h2 className="text-3xl font-black text-black mt-12 mb-6">FAQ</h2>
      <h3 className="text-2xl font-black text-black mt-10 mb-4">1) Magang Jepang berapa tahun?</h3>
      <p>
        Umumnya 1–3 tahun, tergantung program dan kontrak. Pastikan kamu paham durasi, aturan, dan target tabungan yang ingin kamu capai.
      </p>
      <h3 className="text-2xl font-black text-black mt-10 mb-4">2) Kalau belum bisa bahasa Jepang sama sekali, bisa daftar?</h3>
      <p>
        Bisa mulai proses persiapan, tapi kamu tetap harus mengejar kemampuan dasar. Cara paling aman adalah ikut kursus bahasa Jepang yang diarahkan untuk kerja/magang.
      </p>
      <h3 className="text-2xl font-black text-black mt-10 mb-4">3) Apa yang paling sering bikin gagal?</h3>
      <p>
        Tidak disiplin, persiapan bahasa kurang, dan dokumen tidak rapi. Tiga hal ini sering jadi pembeda antara yang lolos dan yang tertahan.
      </p>

      <h2 className="text-3xl font-black text-black mt-12 mb-6">CTA: Mau Persiapan yang Dibimbing dari Nol?</h2>
      <p>
        Mulai dari pondasi bahasa dulu di{' '}
        <Link className="text-dory-red font-bold hover:underline" to="/kursus-bahasa-jepang-online">Kursus Bahasa Jepang Online</Link>,
        lalu lanjutkan ke{' '}
        <Link className="text-dory-red font-bold hover:underline" to="/magang-ke-jepang">Program Magang ke Jepang</Link>.
        Kalau kamu pengin konsultasi jalur yang paling cocok, langsung isi{' '}
        <Link className="text-dory-red font-bold hover:underline" to="/register">form pendaftaran</Link>.
      </p>
    </>
  );

  return (
    <BlogArticle
      title={title}
      content={content}
      date="18 April 2026"
      author="Tim Program SKYBRIDGE"
      category="MAGANG JEPANG"
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

export default SyaratMagangJepangTerbaru;

