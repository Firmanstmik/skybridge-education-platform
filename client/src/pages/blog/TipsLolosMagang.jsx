import React from 'react';
import BlogArticle from '../../components/BlogArticle';
import { Link } from 'react-router-dom';

const TipsLolosMagang = () => {
  const title = 'Tips Lolos Magang ke Jepang: Checklist Seleksi + Persiapan yang Sering Dilupakan';
  const metaTitle = 'Tips Lolos Magang Jepang: Checklist Seleksi Pemula';
  const metaDescription = 'Panduan tips lolos magang Jepang: syarat umum, tahapan seleksi, latihan interview, persiapan fisik-mental, bahasa Jepang, dan dokumen.';
  const canonicalUrl = 'https://www.skybridgenisantara.com/blog/tips-lolos-magang-ke-jepang';
  const image = 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1200';
  const metaKeywords = [
    'tips lolos magang jepang',
    'magang ke jepang',
    'program magang jepang resmi',
    'syarat magang jepang',
    'cara daftar magang jepang',
    'magang jepang berapa tahun',
    'magang jepang gaji berapa',
    'kursus bahasa jepang',
    'kaiwa bahasa jepang',
  ].join(', ');

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: metaTitle,
    description: metaDescription,
    image: [image],
    author: { '@type': 'Organization', name: 'SKYBRIDGE Nusantara International School' },
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
        Kamu sudah mantap mau ikut <strong>program magang ke Jepang</strong>, tapi mulai muncul rasa cemas: “Seleksinya ketat nggak ya?”
        Tenang, seleksi itu memang serius, tapi bukan berarti mustahil. Banyak peserta lolos bukan karena “paling pintar”, tapi karena
        persiapannya rapi dan konsisten.
      </p>
      <p>
        Di artikel ini, aku rangkum <strong>tips lolos magang Jepang</strong> yang paling praktis: apa yang dinilai saat seleksi, apa saja yang harus kamu siapkan
        dari sekarang, dan kesalahan umum yang sering bikin orang gugur padahal sebenarnya tinggal sedikit lagi.
      </p>

      <h2 className="text-3xl font-black text-black mt-12 mb-6">Apa yang Biasanya Dinilai Saat Seleksi Magang Jepang?</h2>
      <p>
        Setiap program bisa punya detail berbeda, tapi umumnya penilaiannya tidak jauh dari 4 hal ini:
      </p>
      <ul className="list-disc pl-8 space-y-4 text-gray-700">
        <li><strong>Sikap dan mental kerja:</strong> disiplin, tahan tekanan, mau belajar, dan bisa kerja tim.</li>
        <li><strong>Kesehatan fisik:</strong> karena ritme kerja di Jepang cenderung padat dan terstruktur.</li>
        <li><strong>Bahasa Jepang dasar:</strong> terutama listening instruksi dan kaiwa sederhana.</li>
        <li><strong>Kerapian dokumen dan komitmen:</strong> kelihatan sepele, tapi ini sering jadi penentu “siap atau belum”.</li>
      </ul>
      <p>
        Jadi kalau kamu cari “rahasia lolos”, sebenarnya rahasianya adalah: tunjukkan kamu <strong>siap kerja</strong> dan <strong>siap belajar</strong>.
      </p>

      <h2 className="text-3xl font-black text-black mt-12 mb-6">Tips Lolos Magang Jepang: 10 Hal yang Wajib Kamu Bereskan</h2>
      <h3 className="text-2xl font-black text-black mt-10 mb-4">1) Bangun kebiasaan tepat waktu dari sekarang</h3>
      <p>
        Di Jepang, telat bukan cuma soal menit, tapi soal kepercayaan. Biasakan datang 10–15 menit lebih awal, termasuk saat latihan, kelas, dan seleksi.
      </p>

      <h3 className="text-2xl font-black text-black mt-10 mb-4">2) Latihan fisik ringan tapi konsisten</h3>
      <p>
        Kamu tidak harus jadi atlet. Tapi kamu harus siap stamina. Minimal jalan cepat 20–30 menit, latihan core sederhana, dan atur jam tidur.
        Banyak peserta “bagus di kertas”, tapi drop di tahap adaptasi karena kebiasaan hidupnya berantakan.
      </p>

      <h3 className="text-2xl font-black text-black mt-10 mb-4">3) Fokus bahasa Jepang yang kepakai kerja (bukan cuma teori)</h3>
      <p>
        Untuk pemula, target paling aman adalah menguasai dasar setara JLPT N5 lalu naik bertahap. Tapi yang paling sering diuji secara nyata adalah:
        <strong> mendengar instruksi</strong> dan <strong>merespons dengan kalimat sopan</strong>.
      </p>
      <ul className="list-disc pl-8 space-y-3 text-gray-700">
        <li>もういちど おねがいします (Tolong ulangi)</li>
        <li>ゆっくり おねがいします (Tolong pelan-pelan)</li>
        <li>だいじょうぶです (Tidak apa-apa)</li>
        <li>こちらで いいですか (Di sini boleh?)</li>
      </ul>

      <h3 className="text-2xl font-black text-black mt-10 mb-4">4) Siapkan jawaban interview yang “Jepang banget”</h3>
      <p>
        Banyak orang gagal bukan karena jawabannya salah, tapi karena jawabannya tidak meyakinkan. HR Jepang suka jawaban yang:
        jujur, jelas, dan menunjukkan kamu bisa disiplin.
      </p>
      <p>
        Contoh pola jawaban yang aman:
        “Saya siap belajar, siap mengikuti aturan, dan ingin bekerja dengan serius untuk membantu keluarga.”
      </p>

      <h3 className="text-2xl font-black text-black mt-10 mb-4">5) Rapikan dokumen sejak awal</h3>
      <p>
        Jangan tunggu mepet. Simpan scan dokumen di satu folder yang rapi. Ini bikin proses kamu cepat dan mengurangi kesalahan input data.
      </p>

      <h3 className="text-2xl font-black text-black mt-10 mb-4">6) Pahami tahapan seleksi (supaya kamu bisa latihan sesuai format)</h3>
      <p>
        Umumnya tahapan seleksi mencakup pemeriksaan administrasi, tes dasar, interview, dan penilaian kesiapan. Kalau kamu tahu formatnya,
        kamu bisa latihan dari sekarang dan tidak kaget saat hari H.
      </p>

      <h3 className="text-2xl font-black text-black mt-10 mb-4">7) Jangan meremehkan attitude</h3>
      <p>
        Sikap itu kelihatan: cara kamu menjawab, cara kamu menyapa, cara kamu duduk, cara kamu menerima arahan. Biasakan sopan, fokus, dan tidak defensif.
      </p>

      <h3 className="text-2xl font-black text-black mt-10 mb-4">8) Latih “komunikasi kerja” (lapor, konfirmasi, minta izin)</h3>
      <p>
        Di tempat kerja Jepang, komunikasi itu terstruktur. Kamu sering perlu melapor dan mengonfirmasi agar tidak terjadi kesalahan.
        Kalau kamu punya latihan kaiwa yang rutin, ini akan terasa jauh lebih mudah.
      </p>

      <h3 className="text-2xl font-black text-black mt-10 mb-4">9) Siapkan ekspektasi soal gaji dan potongan</h3>
      <p>
        Magang Jepang itu kerja sungguhan. Ada gaji, tapi biasanya ada potongan (asuransi, pajak, asrama). Pastikan kamu paham konsep gaji bersih,
        biar tidak kaget dan bisa mengatur target tabungan.
      </p>

      <h3 className="text-2xl font-black text-black mt-10 mb-4">10) Pilih lembaga yang jelas pendampingannya</h3>
      <p>
        Program yang rapi biasanya membimbing kamu dari bahasa, budaya kerja, simulasi interview, sampai persiapan keberangkatan.
        Ini penting supaya kamu tidak “jalan sendiri” dan rentan salah langkah.
      </p>

      <h2 className="text-3xl font-black text-black mt-12 mb-6">Internal Linking (Saran Halaman Penting)</h2>
      <ul className="list-disc pl-8 space-y-3 text-gray-700">
        <li>
          Kalau kamu masih pemula bahasa: mulai dari <Link className="text-dory-red font-bold hover:underline" to="/kursus-bahasa-jepang-online">Kursus Bahasa Jepang Online</Link>
        </li>
        <li>
          Baca detail program: <Link className="text-dory-red font-bold hover:underline" to="/magang-ke-jepang">Program Magang ke Jepang</Link>
        </li>
        <li>
          Kalau kamu ingin jalur kerja setelah pondasi kuat: <Link className="text-dory-red font-bold hover:underline" to="/pelatihan-kerja-ke-jepang">Pelatihan Kerja ke Jepang</Link>
        </li>
      </ul>

      <h2 className="text-3xl font-black text-black mt-12 mb-6">FAQ</h2>
      <h3 className="text-2xl font-black text-black mt-10 mb-4">1) Magang Jepang berapa tahun?</h3>
      <p>
        Durasi umumnya 1–3 tahun tergantung program dan ketentuan yang berlaku. Yang penting kamu pahami sejak awal adalah kontrak, aturan, dan target yang ingin kamu capai.
      </p>
      <h3 className="text-2xl font-black text-black mt-10 mb-4">2) Apakah magang Jepang wajib JLPT?</h3>
      <p>
        Tidak selalu wajib sertifikat JLPT, tapi kemampuan setara dasar (N5) plus kaiwa sangat membantu untuk seleksi dan adaptasi kerja.
      </p>
      <h3 className="text-2xl font-black text-black mt-10 mb-4">3) Apa yang paling sering bikin gagal interview?</h3>
      <p>
        Jawaban berputar-putar, tidak percaya diri, dan sikap yang terlihat kurang siap. Latihan interview dan kebiasaan disiplin biasanya jadi pembeda besar.
      </p>
      <h3 className="text-2xl font-black text-black mt-10 mb-4">4) Kalau belum bisa bahasa sama sekali, mulai dari mana?</h3>
      <p>
        Mulai dari struktur dasar (hiragana, katakana, pola kalimat N5) dan biasakan listening + speaking. Cara paling aman adalah ikut kursus yang terarah untuk target kerja/magang.
      </p>

      <h2 className="text-3xl font-black text-black mt-12 mb-6">CTA: Siap Serius Persiapan Magang?</h2>
      <p>
        Kalau kamu pengin persiapan yang lebih terarah, mulai dari pondasi bahasa dulu di{' '}
        <Link className="text-dory-red font-bold hover:underline" to="/kursus-bahasa-jepang-online">Kursus Bahasa Jepang Online</Link>,
        lalu lanjut ke{' '}
        <Link className="text-dory-red font-bold hover:underline" to="/magang-ke-jepang">Program Magang ke Jepang</Link>.
        Kamu juga bisa konsultasi dan daftar lewat{' '}
        <Link className="text-dory-red font-bold hover:underline" to="/register">halaman pendaftaran</Link>.
      </p>
    </>
  );

  return (
    <BlogArticle
      title={title}
      content={content}
      date="18 April 2026"
      author="Tim Program SKYBRIDGE"
      category="TIPS SUKSES"
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

export default TipsLolosMagang;
