import React from 'react';
import { Link } from 'react-router-dom';
import BlogArticle from '../../components/BlogArticle';

const KurikulumBelajarJepangUntukKerja3Bulan = () => {
  const title = 'Rencana Belajar Bahasa Jepang untuk Kerja: Kurikulum 3 Bulan (Pemula dari Nol)';
  const metaTitle = 'Belajar Bahasa Jepang untuk Kerja: Kurikulum 3 Bulan';
  const metaDescription = 'Kurikulum 3 bulan belajar bahasa Jepang untuk kerja/magang: target mingguan, materi N5 dasar, kaiwa kerja, listening instruksi, dan latihan harian.';
  const canonicalUrl = 'https://www.skybridgenisantara.com/blog/kurikulum-belajar-bahasa-jepang-untuk-kerja-3-bulan';
  const image = 'https://images.unsplash.com/photo-1556804335-2fa563e93aae?auto=format&fit=crop&q=80&w=1200';
  const metaKeywords = [
    'belajar bahasa jepang untuk kerja',
    'kurikulum belajar bahasa jepang',
    'cara cepat belajar bahasa jepang untuk pemula',
    'les bahasa jepang untuk pemula',
    'kursus bahasa jepang',
    'kursus kaiwa bahasa jepang',
    'jlpt n5',
    'kerja ke jepang',
    'magang jepang',
  ].join(', ');

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: metaTitle,
    description: metaDescription,
    image: [image],
    author: { '@type': 'Organization', name: 'Tim Akademik SKYBRIDGE' },
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
        Masalah terbesar pemula belajar bahasa Jepang itu bukan “susah”, tapi <strong>bingung mulai dari mana</strong>. Hari ini belajar hiragana,
        besok loncat ke kanji, lusa nonton video percakapan tanpa ngerti polanya. Akhirnya capek sendiri.
      </p>
      <p>
        Di artikel ini aku susun <strong>kurikulum 3 bulan</strong> yang realistis untuk target <strong>belajar bahasa Jepang untuk kerja</strong> (termasuk magang).
        Fokusnya bukan jadi “fasih”, tapi jadi <strong>siap komunikasi dasar</strong> dan punya pondasi kuat untuk naik level.
      </p>

      <h2 className="text-3xl font-black text-black mt-12 mb-6">Target Akhir 3 Bulan (Realistis untuk Pemula)</h2>
      <ul className="list-disc pl-8 space-y-4 text-gray-700">
        <li>Lancar hiragana + katakana</li>
        <li>Paham pola kalimat dasar setara JLPT N5</li>
        <li>Punya kosakata inti untuk situasi kerja dan kehidupan harian</li>
        <li>Berani kaiwa (percakapan) dasar: minta bantuan, konfirmasi, izin, laporan sederhana</li>
      </ul>
      <p>
        Kalau kamu konsisten 30–60 menit per hari, progresnya terasa. Kalau bisa 90 menit per hari, lebih cepat, tapi yang paling penting adalah konsistensi.
      </p>

      <h2 className="text-3xl font-black text-black mt-12 mb-6">Aturan Main Harian (Supaya Kurikulumnya Jalan)</h2>
      <p>
        Ini format latihan harian yang simpel tapi efektif:
      </p>
      <ul className="list-disc pl-8 space-y-4 text-gray-700">
        <li><strong>15 menit:</strong> flashcard kosakata (spaced repetition)</li>
        <li><strong>15 menit:</strong> grammar/pola kalimat + contoh</li>
        <li><strong>15 menit:</strong> listening pendek (angka/waktu/instruksi)</li>
        <li><strong>10–15 menit:</strong> speaking (rekam suara + ulang)</li>
      </ul>

      <h2 className="text-3xl font-black text-black mt-12 mb-6">Bulan 1 (Minggu 1–4): Pondasi yang Wajib Beres</h2>
      <h3 className="text-2xl font-black text-black mt-10 mb-4">Minggu 1: Hiragana tuntas</h3>
      <p>
        Target: bisa baca pelan tapi benar. Jangan skip latihan menulis, karena itu membantu otak “mengenali bentuk”.
      </p>
      <h3 className="text-2xl font-black text-black mt-10 mb-4">Minggu 2: Katakana + kata serapan</h3>
      <p>
        Katakana bikin pede karena banyak kata serapan yang familiar. Latih baca label, menu, dan kata sederhana.
      </p>
      <h3 className="text-2xl font-black text-black mt-10 mb-4">Minggu 3: Pola kalimat dasar (N5)</h3>
      <p>
        Fokus: kalimat perkenalan, tanya-jawab sederhana, dan pola です／じゃないです／ですか.
      </p>
      <h3 className="text-2xl font-black text-black mt-10 mb-4">Minggu 4: Kata kerja masu + partikel inti</h3>
      <p>
        Mulai biasakan: 行きます、食べます、見ます dan partikel を／に／で. Target: bisa bikin 3–5 kalimat “rutinitas” setiap hari.
      </p>

      <h2 className="text-3xl font-black text-black mt-12 mb-6">Bulan 2 (Minggu 5–8): Bahasa yang Kepakai Buat Kerja</h2>
      <h3 className="text-2xl font-black text-black mt-10 mb-4">Minggu 5: Angka, waktu, uang</h3>
      <p>
        Ini kunci untuk kerja. Latih dengar angka dan jam karena instruksi kerja sering berisi jumlah dan waktu.
      </p>
      <h3 className="text-2xl font-black text-black mt-10 mb-4">Minggu 6: Kaiwa kerja (minta izin, konfirmasi, minta ulang)</h3>
      <p>
        Kumpulkan 30–50 kalimat “penyelamat” untuk situasi kerja. Ini yang bikin kamu cepat adaptasi.
      </p>
      <h3 className="text-2xl font-black text-black mt-10 mb-4">Minggu 7: Listening instruksi + shadowing</h3>
      <p>
        Latih shadowing: dengar kalimat pendek, ulangi persis intonasinya. Ini ampuh buat melatih lidah dan telinga sekaligus.
      </p>
      <h3 className="text-2xl font-black text-black mt-10 mb-4">Minggu 8: Review + tryout mini</h3>
      <p>
        Evaluasi kelemahan kamu: partikel, listening, atau kosakata. Jangan lanjut materi baru kalau pondasi belum rapi.
      </p>

      <h2 className="text-3xl font-black text-black mt-12 mb-6">Bulan 3 (Minggu 9–12): Simulasi Situasi Nyata + Persiapan Seleksi</h2>
      <h3 className="text-2xl font-black text-black mt-10 mb-4">Minggu 9–10: Skenario kerja harian</h3>
      <p>
        Latih dialog: menerima instruksi, melapor, dan mengonfirmasi. Fokus ke “bisa dipakai”, bukan grammar sempurna.
      </p>
      <h3 className="text-2xl font-black text-black mt-10 mb-4">Minggu 11: Persiapan interview sederhana</h3>
      <p>
        Latih perkenalan, alasan ingin ke Jepang, kekuatan kamu, dan komitmen kamu. Buat jawaban singkat tapi meyakinkan.
      </p>
      <h3 className="text-2xl font-black text-black mt-10 mb-4">Minggu 12: Review total + rencana lanjutan</h3>
      <p>
        Setelah 3 bulan, kamu punya pondasi kuat. Selanjutnya kamu bisa pilih fokus: naikkan level (N4), fokus kaiwa kerja, atau persiapan seleksi program.
      </p>

      <h2 className="text-3xl font-black text-black mt-12 mb-6">Internal Linking (Jalur yang Nyambung)</h2>
      <ul className="list-disc pl-8 space-y-3 text-gray-700">
        <li>
          Mulai belajar terstruktur: <Link className="text-dory-red font-bold hover:underline" to="/kursus-bahasa-jepang-online">Kursus Bahasa Jepang Online</Link>
        </li>
        <li>
          Target magang: <Link className="text-dory-red font-bold hover:underline" to="/magang-ke-jepang">Program Magang ke Jepang</Link>
        </li>
        <li>
          Target kerja: <Link className="text-dory-red font-bold hover:underline" to="/pelatihan-kerja-ke-jepang">Pelatihan Kerja ke Jepang</Link>
        </li>
      </ul>

      <h2 className="text-3xl font-black text-black mt-12 mb-6">FAQ</h2>
      <h3 className="text-2xl font-black text-black mt-10 mb-4">1) Berapa lama bisa bahasa Jepang dari nol sampai siap kerja?</h3>
      <p>
        Tergantung intensitas. Dalam 3 bulan, target realistisnya adalah “bisa dipakai” untuk komunikasi dasar. Untuk lebih siap, lanjutkan ke level berikutnya secara bertahap.
      </p>
      <h3 className="text-2xl font-black text-black mt-10 mb-4">2) Apakah harus hafal kanji banyak?</h3>
      <p>
        Untuk awal, tidak perlu banyak. Prioritaskan hiragana/katakana, kosakata, pola kalimat, listening, dan speaking. Kanji bisa bertahap.
      </p>
      <h3 className="text-2xl font-black text-black mt-10 mb-4">3) Kalau saya sibuk sekolah/kerja, masih bisa ikut kurikulum ini?</h3>
      <p>
        Bisa. Kunci utamanya latihan harian 30 menit yang konsisten. Lebih baik sedikit tapi rutin daripada maraton sekali seminggu lalu berhenti.
      </p>

      <h2 className="text-3xl font-black text-black mt-12 mb-6">CTA: Mau Kurikulum Ini Dibimbing Sampai Jadi?</h2>
      <p>
        Kalau kamu ingin kurikulum ini dipandu (latihan, evaluasi, dan porsi kaiwa yang konsisten), mulai dari{' '}
        <Link className="text-dory-red font-bold hover:underline" to="/kursus-bahasa-jepang-online">Kursus Bahasa Jepang Online</Link>.
        Setelah pondasi terbentuk, lanjutkan ke jalur{' '}
        <Link className="text-dory-red font-bold hover:underline" to="/magang-ke-jepang">Magang</Link> atau{' '}
        <Link className="text-dory-red font-bold hover:underline" to="/pelatihan-kerja-ke-jepang">Kerja</Link>.
        Untuk daftar, isi <Link className="text-dory-red font-bold hover:underline" to="/register">form pendaftaran</Link>.
      </p>
    </>
  );

  return (
    <BlogArticle
      title={title}
      content={content}
      date="18 April 2026"
      author="Tim Akademik SKYBRIDGE"
      category="BELAJAR BAHASA"
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

export default KurikulumBelajarJepangUntukKerja3Bulan;

