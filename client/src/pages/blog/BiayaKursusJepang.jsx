import React from 'react';
import BlogArticle from '../../components/BlogArticle';
import { Link } from 'react-router-dom';

const BiayaKursusJepang = () => {
  const title = 'Berapa Biaya Kursus Bahasa Jepang? Rincian + Cara Pilih Kelas yang Worth It';
  const metaTitle = 'Biaya Kursus Bahasa Jepang: Rincian & Tips Memilih';
  const metaDescription = 'Panduan biaya kursus bahasa Jepang di Indonesia: komponen biaya, kisaran harga, tips memilih kelas, red flag, dan strategi hemat untuk pemula.';
  const canonicalUrl = 'https://www.skybridgenisantara.com/blog/biaya-kursus-bahasa-jepang';
  const image = 'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80&w=1200';
  const metaKeywords = [
    'biaya kursus bahasa jepang',
    'kursus bahasa jepang online',
    'les bahasa jepang untuk pemula',
    'kursus jlpt n5',
    'kursus jlpt n4',
    'kelas kaiwa bahasa jepang',
    'kursus bahasa jepang intensif',
    'kelas bahasa jepang untuk kerja ke jepang',
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
        Banyak orang pengin belajar bahasa Jepang karena targetnya jelas: <strong>magang ke Jepang</strong>, <strong>kerja ke Jepang</strong>, atau minimal
        bisa komunikasi dasar untuk upgrade diri. Tapi hampir semua akan nanya hal yang sama di awal: <strong>“Berapa biaya kursus bahasa Jepang?”</strong>
      </p>
      <p>
        Jawaban paling jujur: <strong>tergantung</strong>—tergantung level, durasi, model kelas, kualitas pengajar, dan fasilitas pendukung.
        Yang lebih penting dari “murah vs mahal” adalah: <strong>kelas itu worth it atau tidak</strong> untuk target kamu.
      </p>

      <h2 className="text-3xl font-black text-black mt-12 mb-6">Komponen Biaya Kursus Bahasa Jepang (Biar Kamu Nggak Kaget)</h2>
      <p>
        Biaya kursus tidak cuma “uang kelas”. Banyak tempat kursus memecahnya menjadi beberapa komponen. Ini yang paling umum:
      </p>
      <ul className="list-disc pl-8 space-y-4 text-gray-700">
        <li><strong>Biaya pendaftaran:</strong> biaya awal untuk administrasi (tidak semua lembaga menerapkan).</li>
        <li><strong>Biaya program/kelas:</strong> inti dari biaya, biasanya dihitung per level (N5, N4), per paket, atau per bulan.</li>
        <li><strong>Materi belajar:</strong> modul, buku, latihan soal, atau akses platform pembelajaran.</li>
        <li><strong>Kelas tambahan:</strong> speaking/kaiwa, listening, atau kelas intensif menjelang ujian.</li>
        <li><strong>Evaluasi & tryout:</strong> tes berkala untuk mengukur progres. Ini penting kalau target kamu JLPT atau seleksi program.</li>
      </ul>
      <p>
        Kalau ada biaya yang tidak dijelaskan dari awal, minta rincian tertulis. Bukan karena kamu cerewet, tapi supaya kamu tahu total investasi yang kamu keluarkan.
      </p>

      <h2 className="text-3xl font-black text-black mt-12 mb-6">Kisaran Biaya Kursus Bahasa Jepang di Indonesia</h2>
      <p>
        Karena tiap lembaga punya paket berbeda, angka yang paling aman adalah menggunakan kisaran. Umumnya, biaya dipengaruhi oleh:
      </p>
      <ul className="list-disc pl-8 space-y-4 text-gray-700">
        <li><strong>Model kelas:</strong> online biasanya lebih fleksibel; offline bisa lebih intens interaksi, tapi ada biaya operasional.</li>
        <li><strong>Durasi program:</strong> 4–8 minggu, 3 bulan, atau 6 bulan.</li>
        <li><strong>Ukuran kelas:</strong> kelas kecil/privat cenderung lebih mahal, tapi feedback lebih cepat.</li>
        <li><strong>Fokus program:</strong> “general Japanese” beda dengan program yang memang untuk <strong>kerja/magang</strong> (kaiwa, listening instruksi, budaya kerja).</li>
      </ul>
      <p>
        Jadi, saat kamu membandingkan harga, jangan cuma bandingkan nominal. Bandingkan juga <strong>output</strong> yang kamu dapat.
        Kelas yang terlihat “lebih mahal” bisa jadi justru lebih murah kalau hasilnya lebih cepat kepakai.
      </p>

      <h2 className="text-3xl font-black text-black mt-12 mb-6">Kelas yang Worth It Itu Seperti Apa?</h2>
      <p>
        Untuk pemula, kelas yang bagus itu biasanya bukan yang “materinya banyak”, tapi yang bikin kamu konsisten dan bisa dipakai.
        Ini tanda-tanda kelas yang worth it:
      </p>
      <ul className="list-disc pl-8 space-y-4 text-gray-700">
        <li><strong>Ada roadmap level (N5 → N4):</strong> kamu tahu minggu ini harus bisa apa.</li>
        <li><strong>Ada latihan speaking (kaiwa):</strong> bukan cuma reading dan grammar.</li>
        <li><strong>Ada evaluasi berkala:</strong> minimal tiap 2–4 minggu, biar kamu tahu kelemahan kamu.</li>
        <li><strong>Ada target yang jelas:</strong> JLPT, persiapan interview, atau persiapan seleksi program.</li>
        <li><strong>Ada pembiasaan budaya kerja:</strong> ini penting kalau tujuan kamu kerja/magang ke Jepang.</li>
      </ul>

      <h2 className="text-3xl font-black text-black mt-12 mb-6">Red Flag yang Wajib Kamu Waspadai</h2>
      <p>
        Di sisi lain, ada beberapa tanda yang sebaiknya bikin kamu lebih hati-hati:
      </p>
      <ul className="list-disc pl-8 space-y-4 text-gray-700">
        <li><strong>Janji “fasih 1 bulan” tanpa struktur:</strong> belajar bahasa itu butuh proses. Yang realistis adalah “bisa dipakai” dulu.</li>
        <li><strong>Biaya tidak transparan:</strong> di awal murah, tapi ternyata banyak biaya tambahan yang muncul belakangan.</li>
        <li><strong>Minim latihan speaking:</strong> padahal target kamu kerja/magang. Kamu butuh kaiwa dan listening instruksi.</li>
        <li><strong>Tidak ada evaluasi:</strong> kamu jadi sulit mengukur progres dan gampang stuck.</li>
      </ul>

      <h2 className="text-3xl font-black text-black mt-12 mb-6">Strategi Hemat Biaya (Tanpa Mengorbankan Hasil)</h2>
      <p>
        Kalau budget kamu terbatas, kamu tetap bisa ambil jalan yang rapi. Ini strategi yang sering berhasil:
      </p>
      <ul className="list-disc pl-8 space-y-4 text-gray-700">
        <li><strong>Mulai dari kelas yang terstruktur:</strong> daripada beli banyak course acak, lebih baik satu kelas yang punya roadmap.</li>
        <li><strong>Latihan harian 30 menit:</strong> supaya progres cepat dan kamu tidak perlu mengulang level karena lupa.</li>
        <li><strong>Prioritaskan kaiwa dan listening:</strong> ini yang paling kepakai saat seleksi dan adaptasi kerja.</li>
        <li><strong>Ambil program cicilan bila ada:</strong> yang penting transparan dan sesuai kemampuan.</li>
      </ul>
      <p>
        Ingat, tujuan kamu bukan cuma “ikut kursus”, tapi <strong>punya kemampuan</strong>. Kalau kemampuan kamu naik cepat, biaya total justru bisa lebih hemat.
      </p>

      <h2 className="text-3xl font-black text-black mt-12 mb-6">Internal Linking (Biar Kamu Nggak Salah Jalur)</h2>
      <ul className="list-disc pl-8 space-y-3 text-gray-700">
        <li>
          Mulai dari program bahasa yang terarah: <Link className="text-dory-red font-bold hover:underline" to="/kursus-bahasa-jepang-online">Kursus Bahasa Jepang Online</Link>
        </li>
        <li>
          Kalau target kamu magang: <Link className="text-dory-red font-bold hover:underline" to="/magang-ke-jepang">Program Magang ke Jepang</Link>
        </li>
        <li>
          Kalau target kamu kerja: <Link className="text-dory-red font-bold hover:underline" to="/pelatihan-kerja-ke-jepang">Pelatihan Kerja ke Jepang</Link>
        </li>
      </ul>

      <h2 className="text-3xl font-black text-black mt-12 mb-6">FAQ</h2>
      <h3 className="text-2xl font-black text-black mt-10 mb-4">1) Kursus bahasa Jepang online itu efektif nggak?</h3>
      <p>
        Efektif kalau ada struktur, latihan, dan feedback. Online unggul di fleksibilitas, tapi kamu harus disiplin jadwal. Pastikan ada porsi kaiwa dan evaluasi.
      </p>
      <h3 className="text-2xl font-black text-black mt-10 mb-4">2) Lebih baik mulai dari JLPT N5 atau langsung N4?</h3>
      <p>
        Untuk pemula, mulai dari pondasi N5 lebih aman. N4 bisa dikejar setelah dasar kamu rapi, terutama kalau target kamu kerja/magang.
      </p>
      <h3 className="text-2xl font-black text-black mt-10 mb-4">3) Apa yang harus ditanya sebelum bayar?</h3>
      <p>
        Tanyakan roadmap materi, durasi, jumlah pertemuan, ukuran kelas, ada atau tidaknya tryout, dan bagaimana sistem evaluasi. Minta rincian biaya tertulis.
      </p>
      <h3 className="text-2xl font-black text-black mt-10 mb-4">4) Kalau targetnya kerja/magang, fokusnya apa?</h3>
      <p>
        Fokus ke kaiwa, listening instruksi, kosakata kerja, dan pembiasaan budaya kerja. Grammar penting, tapi jangan sampai mengorbankan kemampuan komunikasi.
      </p>

      <h2 className="text-3xl font-black text-black mt-12 mb-6">CTA: Mau Kursus yang Terarah untuk Kerja/Magang?</h2>
      <p>
        Kalau kamu pengin belajar dari nol tapi tetap diarahkan untuk tujuan yang jelas (JLPT dasar, kaiwa, sampai persiapan jalur Jepang),
        kamu bisa mulai dari <Link className="text-dory-red font-bold hover:underline" to="/kursus-bahasa-jepang-online">Kursus Bahasa Jepang Online</Link>.
        Setelah pondasi kuat, lanjutkan ke <Link className="text-dory-red font-bold hover:underline" to="/magang-ke-jepang">Program Magang</Link> atau
        <Link className="text-dory-red font-bold hover:underline" to="/pelatihan-kerja-ke-jepang"> Pelatihan Kerja</Link> sesuai targetmu.
      </p>
    </>
  );

  return (
    <BlogArticle
      title={title}
      content={content}
      date="18 April 2026"
      author="Tim SEO SKYBRIDGE"
      category="INFO BIAYA"
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

export default BiayaKursusJepang;
