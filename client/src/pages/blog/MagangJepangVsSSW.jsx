import React from 'react';
import { Link } from 'react-router-dom';
import BlogArticle from '../../components/BlogArticle';

const MagangJepangVsSSW = () => {
  const title = 'Magang Jepang Itu Apa? Bedanya dengan Kerja SSW (Jangan Salah Jalur)';
  const metaTitle = 'Magang Jepang vs SSW: Bedanya Apa? (Pemula Wajib Tahu)';
  const metaDescription = 'Bingung pilih magang Jepang atau kerja SSW? Ini perbedaan tujuan, syarat, durasi, fokus bahasa, gaji bersih, dan cara memilih jalur yang tepat.';
  const canonicalUrl = 'https://www.skybridgenisantara.com/blog/magang-jepang-itu-apa-bedanya-ssw';
  const image = 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&q=80&w=1200';
  const metaKeywords = [
    'magang jepang',
    'magang jepang itu apa',
    'program magang jepang resmi',
    'syarat magang jepang',
    'kerja ke jepang',
    'kerja ke jepang SSW',
    'tokutei ginou',
    'SSW jepang adalah',
    'cara kerja ke jepang dari indonesia',
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
        Kalau kamu lagi cari jalan ke Jepang, biasanya kamu akan ketemu dua istilah yang muncul terus: <strong>magang Jepang</strong> dan <strong>kerja SSW</strong>.
        Keduanya sama-sama “berangkat ke Jepang untuk kerja”, tapi niat programnya beda, cara seleksinya beda, dan strategi persiapannya juga beda.
      </p>
      <p>
        Artikel ini membahas bedanya dengan bahasa yang gampang dipahami, khusus buat kamu yang masih pemula (usia 17–35) dan pengin langkah yang aman.
        Setelah baca, kamu harusnya bisa menjawab: “Aku lebih cocok magang atau SSW?”
      </p>

      <h2 className="text-3xl font-black text-black mt-12 mb-6">Magang Jepang Itu Apa?</h2>
      <p>
        Secara sederhana, <strong>magang Jepang</strong> adalah program kerja yang biasanya disertai pembinaan keterampilan dan pembiasaan budaya kerja.
        Banyak peserta magang berangkat dari kondisi pemula, lalu berkembang karena rutinitas kerja dan lingkungan yang disiplin.
      </p>
      <p>
        Kalau kamu tipe yang butuh jalur “dituntun” dari awal, magang biasanya terasa lebih terstruktur.
      </p>

      <h2 className="text-3xl font-black text-black mt-12 mb-6">Kerja SSW (Tokutei Ginou) Itu Apa?</h2>
      <p>
        <strong>SSW Jepang</strong> (Tokutei Ginou) adalah jalur kerja yang fokusnya <strong>employment</strong>: kamu direkrut untuk bekerja di bidang tertentu.
        Biasanya ada tes bahasa/skill sesuai bidang.
      </p>
      <p>
        Karena sifatnya kerja, jalur SSW menuntut kamu lebih siap dari sisi target bidang, kesiapan tes, dan komunikasi kerja.
      </p>

      <h2 className="text-3xl font-black text-black mt-12 mb-6">Perbedaan Magang Jepang vs SSW (Biar Nggak Salah Jalur)</h2>
      <h3 className="text-2xl font-black text-black mt-10 mb-4">1) Tujuan utama program</h3>
      <ul className="list-disc pl-8 space-y-4 text-gray-700">
        <li><strong>Magang:</strong> kerja sambil pembinaan keterampilan dan adaptasi budaya kerja.</li>
        <li><strong>SSW:</strong> kerja di bidang spesifik dengan target performa kerja.</li>
      </ul>

      <h3 className="text-2xl font-black text-black mt-10 mb-4">2) Syarat dan seleksi</h3>
      <p>
        <strong>Syarat magang Jepang</strong> biasanya menekankan kesiapan fisik, mental, dan dasar bahasa. Sementara SSW lebih menekankan kelulusan tes sesuai bidang.
        Keduanya sama-sama butuh disiplin dan dokumen rapi.
      </p>

      <h3 className="text-2xl font-black text-black mt-10 mb-4">3) Fokus bahasa Jepang</h3>
      <p>
        Untuk magang, yang paling kepakai adalah <strong>kaiwa</strong> dan listening instruksi. Untuk SSW, kamu perlu bahasa + istilah bidang kerja dan kesiapan tes.
      </p>

      <h3 className="text-2xl font-black text-black mt-10 mb-4">4) Gaji dan potongan</h3>
      <p>
        Pertanyaan “gaji berapa?” itu wajar. Tapi yang paling penting adalah kamu paham perbedaan <strong>gaji kotor vs gaji bersih</strong>.
        Di Jepang, potongan seperti asuransi/pajak/dorm bisa memengaruhi angka bersih yang kamu terima.
      </p>
      <p>
        Tipsnya: minta detail potongan sejak awal. Jangan cuma pegang angka “kotor” dari brosur.
      </p>

      <h2 className="text-3xl font-black text-black mt-12 mb-6">Pilih Magang Jepang Kalau…</h2>
      <ul className="list-disc pl-8 space-y-4 text-gray-700">
        <li>Kamu masih pemula dan butuh jalur persiapan yang lebih terstruktur.</li>
        <li>Kamu ingin adaptasi budaya kerja Jepang pelan-pelan tapi pasti.</li>
        <li>Kamu ingin membangun pengalaman kerja Jepang sebagai bekal langkah berikutnya.</li>
      </ul>

      <h2 className="text-3xl font-black text-black mt-12 mb-6">Pilih SSW Kalau…</h2>
      <ul className="list-disc pl-8 space-y-4 text-gray-700">
        <li>Kamu sudah punya target bidang kerja dan siap belajar untuk tes.</li>
        <li>Kamu ingin fokus kerja dan pengembangan karier.</li>
        <li>Kamu siap latihan bahasa Jepang yang lebih spesifik untuk situasi kerja.</li>
      </ul>

      <h2 className="text-3xl font-black text-black mt-12 mb-6">Kesimpulan Simpel: Jalur yang Tepat Itu yang Sesuai Kesiapan</h2>
      <p>
        Jangan memilih hanya karena “teman pada ambil jalur ini”. Pilih berdasarkan kondisi kamu hari ini: bahasa, mental kerja, kesiapan tes, dan target bidang.
        Kalau kamu butuh pembinaan dan struktur, magang bisa jadi langkah aman. Kalau kamu siap target kerja dan tes, SSW bisa lebih pas.
      </p>

      <h2 className="text-3xl font-black text-black mt-12 mb-6">Internal Linking (Mulai dari Mana?)</h2>
      <ul className="list-disc pl-8 space-y-3 text-gray-700">
        <li>
          Perkuat pondasi bahasa: <Link className="text-dory-red font-bold hover:underline" to="/kursus-bahasa-jepang-online">Kursus Bahasa Jepang Online</Link>
        </li>
        <li>
          Lihat jalur terstruktur: <Link className="text-dory-red font-bold hover:underline" to="/magang-ke-jepang">Program Magang ke Jepang</Link>
        </li>
        <li>
          Lihat jalur kerja: <Link className="text-dory-red font-bold hover:underline" to="/pelatihan-kerja-ke-jepang">Pelatihan Kerja ke Jepang</Link>
        </li>
      </ul>

      <h2 className="text-3xl font-black text-black mt-12 mb-6">FAQ</h2>
      <h3 className="text-2xl font-black text-black mt-10 mb-4">1) Kalau benar-benar dari nol, lebih baik mulai magang atau SSW?</h3>
      <p>
        Banyak pemula memilih magang karena lebih terstruktur. Tapi kalau kamu bisa disiplin belajar dan siap tes, SSW juga bisa. Mulai dari bahasa Jepang yang kepakai kerja.
      </p>
      <h3 className="text-2xl font-black text-black mt-10 mb-4">2) Apakah magang selalu lebih mudah?</h3>
      <p>
        Tidak selalu. Magang tetap butuh seleksi, disiplin, dan adaptasi kerja. Bedanya, jalur persiapannya biasanya lebih “dituntun”.
      </p>
      <h3 className="text-2xl font-black text-black mt-10 mb-4">3) Bahasa Jepang minimal harus sampai mana?</h3>
      <p>
        Minimal dasar (setara N5) dengan kaiwa dan listening. Idealnya naik N4 untuk lebih aman saat komunikasi kerja dan seleksi.
      </p>

      <h2 className="text-3xl font-black text-black mt-12 mb-6">CTA: Mau Dipetakan Jalurnya Sesuai Profil Kamu?</h2>
      <p>
        Mulai dari yang paling menentukan: <strong>bahasa Jepang</strong>. Kamu bisa mulai di{' '}
        <Link className="text-dory-red font-bold hover:underline" to="/kursus-bahasa-jepang-online">Kursus Bahasa Jepang Online</Link>,
        lalu pilih jalur <Link className="text-dory-red font-bold hover:underline" to="/magang-ke-jepang">Magang</Link> atau{' '}
        <Link className="text-dory-red font-bold hover:underline" to="/pelatihan-kerja-ke-jepang">Kerja</Link> sesuai kesiapan. Kalau mau langsung konsultasi, isi{' '}
        <Link className="text-dory-red font-bold hover:underline" to="/register">form pendaftaran</Link>.
      </p>
    </>
  );

  return (
    <BlogArticle
      title={title}
      content={content}
      date="18 April 2026"
      author="Tim SEO SKYBRIDGE"
      category="PANDUAN"
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

export default MagangJepangVsSSW;

