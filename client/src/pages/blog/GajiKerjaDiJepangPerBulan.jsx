import React from 'react';
import { Link } from 'react-router-dom';
import BlogArticle from '../../components/BlogArticle';

const GajiKerjaDiJepangPerBulan = () => {
  const title = 'Gaji Kerja di Jepang per Bulan: Rata-rata, Lembur, dan Faktor Penentu (Versi Realistis)';
  const metaTitle = 'Gaji Kerja di Jepang per Bulan: Faktor & Simulasi';
  const metaDescription = 'Panduan gaji kerja di Jepang per bulan untuk orang Indonesia: faktor penentu, lembur, gaji bersih vs kotor, dan tips memaksimalkan tabungan.';
  const canonicalUrl = 'https://www.skybridgenisantara.com/blog/gaji-kerja-di-jepang-per-bulan';
  const image = 'https://images.unsplash.com/photo-1533106418989-88406c7cc8ca?auto=format&fit=crop&q=80&w=1200';
  const metaKeywords = [
    'gaji kerja di jepang per bulan',
    'gaji kerja di jepang',
    'lembur di jepang',
    'biaya hidup di jepang',
    'kerja ke jepang',
    'kerja ke jepang SSW',
    'pelatihan kerja jepang',
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
        Banyak orang pengin <strong>kerja ke Jepang</strong> karena satu alasan kuat: penghasilan. Tapi pertanyaan “gaji kerja di Jepang per bulan berapa?”
        sering dijawab dengan angka yang bikin bingung, karena ada versi kotor, versi bersih, ada lembur, ada potongan, dan biaya hidupnya juga beda-beda.
      </p>
      <p>
        Di artikel ini, kita bahas versi realistisnya: faktor yang membuat gaji berbeda, cara membaca info gaji yang benar, dan bagaimana mengoptimalkan tabungan tanpa menyiksa diri.
      </p>

      <h2 className="text-3xl font-black text-black mt-12 mb-6">Pahami Dulu: Gaji Kotor vs Gaji Bersih</h2>
      <p>
        Sama seperti kasus magang, gaji kerja di Jepang juga punya konsep kotor vs bersih.
        Yang kamu terima di rekening adalah angka bersih setelah potongan.
      </p>
      <ul className="list-disc pl-8 space-y-4 text-gray-700">
        <li><strong>Kotor:</strong> total sebelum potongan pajak/asuransi/dll.</li>
        <li><strong>Bersih:</strong> setelah potongan dan biaya rutin tertentu.</li>
      </ul>

      <h2 className="text-3xl font-black text-black mt-12 mb-6">Faktor yang Paling Menentukan Gaji Kerja di Jepang</h2>
      <p>
        Dua orang bisa kerja di Jepang dengan bidang berbeda dan hasil akhir berbeda. Faktor yang paling sering memengaruhi:
      </p>
      <ul className="list-disc pl-8 space-y-4 text-gray-700">
        <li><strong>Bidang kerja:</strong> karakter kerja dan jam kerja beda.</li>
        <li><strong>Wilayah:</strong> standar biaya hidup dan kebijakan perusahaan bisa berbeda.</li>
        <li><strong>Jam kerja & shift:</strong> shift malam dan kerja tertentu bisa punya perhitungan tambahan.</li>
        <li><strong>Lembur:</strong> bisa menaikkan total penghasilan, tapi tidak selalu stabil.</li>
        <li><strong>Fasilitas:</strong> asrama/transport yang disediakan bisa “menghemat” pengeluaran.</li>
      </ul>

      <h2 className="text-3xl font-black text-black mt-12 mb-6">Lembur di Jepang: Bonus atau Perangkap?</h2>
      <p>
        Banyak calon pekerja berharap besar pada lembur. Lembur memang bisa menambah penghasilan, tapi jangan dijadikan satu-satunya andalan.
        Alasan utamanya: lembur bisa berubah tergantung musim, target produksi, dan kebijakan perusahaan.
      </p>
      <p>
        Strategi aman: rencanakan keuangan berdasarkan gaji pokok yang realistis. Kalau ada lembur, anggap sebagai bonus untuk tabungan/dana darurat.
      </p>

      <h2 className="text-3xl font-black text-black mt-12 mb-6">Cara Membaca Info Lowongan (Biar Nggak Salah Paham)</h2>
      <p>
        Saat kamu lihat info gaji, pastikan kamu tanyakan atau cek:
      </p>
      <ul className="list-disc pl-8 space-y-4 text-gray-700">
        <li>Angka itu <strong>kotor atau bersih</strong>?</li>
        <li>Ada potongan apa saja (pajak, asuransi, asrama, utilitas)?</li>
        <li>Sistem lembur dan perhitungannya seperti apa?</li>
        <li>Apakah ada fasilitas yang mengurangi pengeluaran (asrama/transport)?</li>
      </ul>

      <h2 className="text-3xl font-black text-black mt-12 mb-6">Biar Tabungan Maksimal: Fokus di 2 Hal Ini</h2>
      <h3 className="text-2xl font-black text-black mt-10 mb-4">1) Kurangi kebocoran pengeluaran harian</h3>
      <p>
        Banyak orang “gaji bagus” tapi tabungannya kecil karena pengeluaran kecil yang menumpuk. Mulai dari budgeting makan, transport, dan belanja impulsif.
      </p>
      <h3 className="text-2xl font-black text-black mt-10 mb-4">2) Naikkan nilai kamu lewat bahasa</h3>
      <p>
        Bahasa Jepang yang lebih baik membuat kamu lebih aman di kerja, lebih cepat adaptasi, dan dalam jangka panjang membuka peluang posisi yang lebih baik.
        Minimal, kamu lebih percaya diri saat komunikasi dan tidak sering salah paham.
      </p>

      <h2 className="text-3xl font-black text-black mt-12 mb-6">Internal Linking (Biar Jalur Kamu Nyambung)</h2>
      <ul className="list-disc pl-8 space-y-3 text-gray-700">
        <li>
          Mulai dari bahasa: <Link className="text-dory-red font-bold hover:underline" to="/kursus-bahasa-jepang-online">Kursus Bahasa Jepang Online</Link>
        </li>
        <li>
          Jalur kerja: <Link className="text-dory-red font-bold hover:underline" to="/pelatihan-kerja-ke-jepang">Pelatihan Kerja ke Jepang</Link>
        </li>
        <li>
          Jalur magang (batu loncatan): <Link className="text-dory-red font-bold hover:underline" to="/magang-ke-jepang">Program Magang ke Jepang</Link>
        </li>
      </ul>

      <h2 className="text-3xl font-black text-black mt-12 mb-6">FAQ</h2>
      <h3 className="text-2xl font-black text-black mt-10 mb-4">1) Kenapa angka gaji di internet berbeda-beda?</h3>
      <p>
        Karena beda konteks: kotor vs bersih, wilayah, bidang, fasilitas, dan lembur. Pastikan kamu membandingkan angka yang sama-sama “bersih”.
      </p>
      <h3 className="text-2xl font-black text-black mt-10 mb-4">2) Apakah kerja di Jepang selalu banyak lembur?</h3>
      <p>
        Tidak selalu. Ada pekerjaan yang lemburnya sering, ada yang jarang. Jangan membuat rencana keuangan yang hanya bergantung pada lembur.
      </p>
      <h3 className="text-2xl font-black text-black mt-10 mb-4">3) Apa langkah terbaik sebelum mengejar gaji?</h3>
      <p>
        Kuatkan bahasa Jepang yang kepakai kerja dan siapkan jalur resmi. Dengan bahasa lebih baik, kamu lebih aman dan peluang kamu berkembang lebih besar.
      </p>

      <h2 className="text-3xl font-black text-black mt-12 mb-6">CTA: Mau Jalur Kerja Jepang yang Lebih Jelas?</h2>
      <p>
        Kalau kamu ingin memaksimalkan peluang kerja dan penghasilan, mulai dari pondasi yang paling ngaruh: bahasa Jepang dan kesiapan kerja.
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
      category="GAJI & KARIER"
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

export default GajiKerjaDiJepangPerBulan;

