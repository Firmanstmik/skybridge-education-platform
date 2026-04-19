import React from 'react';
import { Link } from 'react-router-dom';
import BlogArticle from '../../components/BlogArticle';

const TahapanSeleksiMagangJepang = () => {
  const title = 'Tahapan Seleksi Magang Jepang: Dari Tes sampai Berangkat (Lengkap + Checklist)';
  const metaTitle = 'Tahapan Seleksi Magang Jepang: Urutan & Checklist';
  const metaDescription = 'Panduan tahapan seleksi magang Jepang: administrasi, tes, interview, medical check, training, sampai keberangkatan. Plus tips lolos tiap tahap.';
  const canonicalUrl = 'https://www.skybridgenisantara.com/blog/tahapan-seleksi-magang-jepang';
  const image = 'https://images.unsplash.com/photo-1496307653780-42ee777d4833?auto=format&fit=crop&q=80&w=1200';
  const metaKeywords = [
    'tahapan seleksi magang jepang',
    'seleksi magang jepang',
    'cara daftar magang jepang',
    'program magang jepang resmi',
    'syarat magang jepang',
    'interview magang jepang',
    'kursus bahasa jepang',
    'kaiwa untuk kerja',
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
        Banyak orang gagal bukan karena tidak mampu, tapi karena <strong>nggak tahu alurnya</strong>. Akhirnya latihan salah fokus, dokumen mepet, dan pas hari seleksi panik.
        Padahal kalau kamu paham <strong>tahapan seleksi magang Jepang</strong>, kamu bisa bikin persiapan yang rapi dan lebih tenang.
      </p>
      <p>
        Artikel ini memetakan urutan seleksi dari awal sampai berangkat, lengkap dengan checklist dan tips di tiap tahap. Anggap ini “peta jalan” supaya kamu tidak jalan di tempat.
      </p>

      <h2 className="text-3xl font-black text-black mt-12 mb-6">Gambaran Umum: Seleksi Itu Bukan Satu Hari Saja</h2>
      <p>
        Seleksi magang biasanya berupa rangkaian tahap. Ada yang cepat, ada yang panjang, tergantung kuota, jadwal user, dan kesiapan peserta. Tapi struktur umumnya mirip:
        administrasi → tes dasar → interview → pemeriksaan kesehatan → pelatihan → keberangkatan.
      </p>

      <h2 className="text-3xl font-black text-black mt-12 mb-6">Tahap 1: Administrasi & Verifikasi Dokumen</h2>
      <p>
        Ini tahap yang terlihat “mudah”, tapi sering bikin peserta tertunda karena dokumen kurang atau tidak rapi. Pastikan dokumen kamu siap dan konsisten datanya.
      </p>
      <h3 className="text-2xl font-black text-black mt-10 mb-4">Checklist cepat</h3>
      <ul className="list-disc pl-8 space-y-4 text-gray-700">
        <li>Data identitas sesuai (nama, tanggal lahir, alamat)</li>
        <li>Scan dokumen jelas dan tidak blur</li>
        <li>Pas foto sesuai ketentuan</li>
      </ul>
      <p>
        Tips: bikin satu folder khusus di HP/laptop untuk semua scan. Beri nama file rapi (KTP_Nama, KK_Nama, Ijazah_Nama) supaya gampang dicari.
      </p>

      <h2 className="text-3xl font-black text-black mt-12 mb-6">Tahap 2: Tes Dasar (Bahasa, Sikap, atau Tes Lain)</h2>
      <p>
        Di tahap ini, yang paling sering diuji adalah dasar bahasa Jepang dan kesiapan mengikuti aturan. Kamu tidak harus sempurna, tapi harus menunjukkan progres dan keseriusan.
      </p>
      <p>
        Untuk pemula, prioritas latihan:
      </p>
      <ul className="list-disc pl-8 space-y-4 text-gray-700">
        <li><strong>Listening angka dan waktu</strong>: sering muncul dalam instruksi kerja.</li>
        <li><strong>Kaiwa dasar</strong>: minta bantuan, konfirmasi, dan menyapa sopan.</li>
        <li><strong>Pola kalimat N5</strong>: supaya kamu bisa merangkai jawaban sederhana.</li>
      </ul>

      <h2 className="text-3xl font-black text-black mt-12 mb-6">Tahap 3: Interview (Ini yang Paling Menentukan)</h2>
      <p>
        Interview bukan cuma “ditanya apa”, tapi “dinilai bagaimana kamu bersikap”. HR Jepang biasanya suka jawaban yang jujur, jelas, dan menunjukkan kamu disiplin.
      </p>
      <h3 className="text-2xl font-black text-black mt-10 mb-4">Pertanyaan yang sering muncul</h3>
      <ul className="list-disc pl-8 space-y-4 text-gray-700">
        <li>Kenapa ingin ke Jepang?</li>
        <li>Siap kerja di bawah aturan dan SOP?</li>
        <li>Apa kekuatan dan kelemahan kamu?</li>
        <li>Bagaimana kalau ditegur atasan?</li>
      </ul>
      <p>
        Tips: latih jawaban 3–5 versi yang tetap jujur. Jangan menghafal kata-per-kata, tapi hafalkan poinnya supaya tetap natural.
      </p>

      <h2 className="text-3xl font-black text-black mt-12 mb-6">Tahap 4: Pemeriksaan Kesehatan (Medical Check)</h2>
      <p>
        Tahap ini memastikan kamu siap secara fisik. Banyak yang gugur karena kebiasaan hidup tidak sehat atau karena menunda check-up. Mulai rapikan pola tidur dan olahraga ringan.
      </p>

      <h2 className="text-3xl font-black text-black mt-12 mb-6">Tahap 5: Pelatihan Pra-keberangkatan</h2>
      <p>
        Ini fase “dibentuk”: disiplin, budaya kerja, bahasa Jepang untuk kerja, dan simulasi situasi nyata. Kalau kamu ikut program yang serius, tahap ini biasanya sangat membantu
        agar kamu tidak kaget saat sampai di Jepang.
      </p>

      <h2 className="text-3xl font-black text-black mt-12 mb-6">Tahap 6: Persiapan Berangkat</h2>
      <p>
        Di tahap ini, fokus kamu adalah memastikan semuanya beres: administrasi akhir, perlengkapan, mental, dan rencana keuangan awal. Banyak orang lupa menyiapkan dana darurat kecil
        untuk adaptasi awal (transport, kebutuhan harian, dan lain-lain).
      </p>

      <h2 className="text-3xl font-black text-black mt-12 mb-6">Kesalahan Umum yang Bikin Gagal atau Tertunda</h2>
      <ul className="list-disc pl-8 space-y-4 text-gray-700">
        <li><strong>Belajar bahasa cuma teori:</strong> tapi minim latihan listening/speaking.</li>
        <li><strong>Dokumen berantakan:</strong> sehingga proses jadi lama dan bikin stres.</li>
        <li><strong>Kurang latihan interview:</strong> padahal ini fase paling menentukan.</li>
        <li><strong>Fisik tidak dijaga:</strong> kebiasaan begadang dan pola makan tidak teratur.</li>
      </ul>

      <h2 className="text-3xl font-black text-black mt-12 mb-6">Internal Linking (Biar Persiapan Kamu Makin Rapi)</h2>
      <ul className="list-disc pl-8 space-y-3 text-gray-700">
        <li>
          Pondasi bahasa dan kaiwa: <Link className="text-dory-red font-bold hover:underline" to="/kursus-bahasa-jepang-online">Kursus Bahasa Jepang Online</Link>
        </li>
        <li>
          Detail program: <Link className="text-dory-red font-bold hover:underline" to="/magang-ke-jepang">Program Magang ke Jepang</Link>
        </li>
        <li>
          Jalur kerja: <Link className="text-dory-red font-bold hover:underline" to="/pelatihan-kerja-ke-jepang">Pelatihan Kerja ke Jepang</Link>
        </li>
      </ul>

      <h2 className="text-3xl font-black text-black mt-12 mb-6">FAQ</h2>
      <h3 className="text-2xl font-black text-black mt-10 mb-4">1) Seleksi magang Jepang biasanya butuh waktu berapa lama?</h3>
      <p>
        Tergantung jadwal program dan kuota, tapi umumnya tidak instan. Karena itu penting punya timeline belajar dan dokumen yang rapi agar tidak keteteran saat tahap berjalan cepat.
      </p>
      <h3 className="text-2xl font-black text-black mt-10 mb-4">2) Apa yang paling penting dilatih sebelum interview?</h3>
      <p>
        Sikap, disiplin, dan cara menjawab yang jelas. Tambahkan kemampuan kaiwa sederhana supaya kamu bisa merespons sopan dan tidak panik.
      </p>
      <h3 className="text-2xl font-black text-black mt-10 mb-4">3) Kalau bahasa masih dasar, apa masih punya peluang?</h3>
      <p>
        Masih, asal kamu konsisten dan menunjukkan progres. Mulai dari pola N5 dan latihan listening/speaking yang kepakai kerja.
      </p>

      <h2 className="text-3xl font-black text-black mt-12 mb-6">CTA: Mau Latihan yang Terarah untuk Lolos Seleksi?</h2>
      <p>
        Kalau kamu ingin persiapan yang lebih terstruktur (bahasa, kaiwa, budaya kerja, sampai simulasi interview), mulai dari{' '}
        <Link className="text-dory-red font-bold hover:underline" to="/kursus-bahasa-jepang-online">Kursus Bahasa Jepang Online</Link>
        lalu lanjut ke{' '}
        <Link className="text-dory-red font-bold hover:underline" to="/magang-ke-jepang">Program Magang ke Jepang</Link>.
        Kamu bisa daftar lewat <Link className="text-dory-red font-bold hover:underline" to="/register">form pendaftaran</Link>.
      </p>
    </>
  );

  return (
    <BlogArticle
      title={title}
      content={content}
      date="18 April 2026"
      author="Tim Program SKYBRIDGE"
      category="SELEKSI"
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

export default TahapanSeleksiMagangJepang;

