import React from 'react';
import { Link } from 'react-router-dom';
import BlogArticle from '../../components/BlogArticle';

const GajiMagangJepangBersih = () => {
  const title = 'Magang Jepang Gaji Berapa? Cara Hitung Bersih Setelah Potongan (Biar Nggak Kaget)';
  const metaTitle = 'Gaji Magang Jepang: Hitung Bersih Setelah Potongan';
  const metaDescription = 'Berapa gaji magang Jepang? Ini cara menghitung gaji bersih setelah potongan (pajak, asuransi, asrama), plus tips mengatur tabungan.';
  const canonicalUrl = 'https://www.skybridgenisantara.com/blog/magang-jepang-gaji-berapa-hitungan-bersih';
  const image = 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=1200';
  const metaKeywords = [
    'magang jepang gaji berapa',
    'gaji magang jepang bersih',
    'potongan gaji magang jepang',
    'biaya hidup di jepang',
    'program magang jepang resmi',
    'magang jepang',
    'tips hemat di jepang',
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
        Pertanyaan yang paling sering ditanya sebelum ikut <strong>magang Jepang</strong> adalah: <strong>“Gaji magang Jepang berapa?”</strong> Wajar.
        Karena kamu pasti ingin tahu: setelah potongan, kira-kira sisa berapa, dan realistis nggak kalau targetnya nabung.
      </p>
      <p>
        Artikel ini bantu kamu memahami konsepnya tanpa bikin pusing: gaji kotor, jenis potongan yang umum, cara menghitung perkiraan gaji bersih, dan tips supaya uang kamu nggak bocor.
      </p>

      <h2 className="text-3xl font-black text-black mt-12 mb-6">Pahami Dulu: Gaji Kotor vs Gaji Bersih</h2>
      <p>
        Banyak orang kecewa karena fokusnya hanya di angka “gaji kotor”. Padahal yang kamu bawa pulang adalah <strong>gaji bersih</strong> setelah potongan.
      </p>
      <ul className="list-disc pl-8 space-y-4 text-gray-700">
        <li><strong>Gaji kotor:</strong> total gaji sebelum dipotong apa pun.</li>
        <li><strong>Gaji bersih:</strong> gaji yang kamu terima setelah potongan (pajak, asuransi, asrama, dll).</li>
      </ul>

      <h2 className="text-3xl font-black text-black mt-12 mb-6">Potongan yang Umum di Magang Jepang</h2>
      <p>
        Detail potongan bisa berbeda berdasarkan wilayah, perusahaan, dan sistem asrama. Tapi umumnya, potongan yang sering muncul adalah:
      </p>
      <ul className="list-disc pl-8 space-y-4 text-gray-700">
        <li><strong>Asuransi & kesehatan:</strong> bagian dari sistem perlindungan di Jepang.</li>
        <li><strong>Pajak:</strong> sesuai ketentuan yang berlaku.</li>
        <li><strong>Asrama/dormitory:</strong> jika disediakan, biasanya ada biaya.</li>
        <li><strong>Utilitas:</strong> listrik, air, gas, internet (kadang digabung dengan asrama).</li>
        <li><strong>Transport lokal:</strong> tergantung lokasi dan sistem perusahaan.</li>
      </ul>
      <p>
        Tips paling aman: minta rincian potongan sebelum berangkat. Jangan malu bertanya, karena itu hak kamu untuk tahu.
      </p>

      <h2 className="text-3xl font-black text-black mt-12 mb-6">Cara Hitung Simpel Gaji Bersih (Kerangka Praktis)</h2>
      <p>
        Kamu bisa pakai rumus sederhana ini untuk memperkirakan:
      </p>
      <ul className="list-disc pl-8 space-y-3 text-gray-700">
        <li><strong>Gaji bersih ≈ gaji kotor</strong> − (pajak + asuransi + asrama + utilitas + biaya rutin lain)</li>
      </ul>
      <p>
        Yang perlu kamu catat: potongan tidak selalu “jelek”. Justru banyak potongan seperti asuransi adalah hal yang membuat kamu lebih aman selama di Jepang.
      </p>

      <h2 className="text-3xl font-black text-black mt-12 mb-6">Apa yang Membuat Gaji Bisa Beda-beda?</h2>
      <p>
        Dua orang sama-sama magang Jepang bisa dapat angka bersih berbeda. Faktor yang paling sering membedakan:
      </p>
      <ul className="list-disc pl-8 space-y-4 text-gray-700">
        <li><strong>Wilayah/ken:</strong> biaya hidup dan standar upah bisa berbeda.</li>
        <li><strong>Bidang kerja:</strong> ritme kerja dan kesempatan lembur berbeda.</li>
        <li><strong>Lembur:</strong> bisa signifikan, tapi jangan dijadikan satu-satunya harapan.</li>
        <li><strong>Asrama:</strong> murah/mahalnya dorm berpengaruh besar ke uang sisa.</li>
      </ul>

      <h2 className="text-3xl font-black text-black mt-12 mb-6">Cara Biar Tabungan Kamu Maksimal</h2>
      <p>
        Tujuan banyak peserta adalah nabung. Ini kebiasaan kecil yang biasanya paling terasa hasilnya:
      </p>
      <ul className="list-disc pl-8 space-y-4 text-gray-700">
        <li><strong>Budgeting harian:</strong> tetapkan batas belanja makan dan kebutuhan kecil.</li>
        <li><strong>Pisahkan tabungan di awal:</strong> begitu gajian, langsung sisihkan.</li>
        <li><strong>Masak sederhana:</strong> hemat besar kalau kamu bisa masak basic.</li>
        <li><strong>Hindari “belanja pelarian”:</strong> culture shock sering bikin orang belanja impulsif.</li>
      </ul>

      <h2 className="text-3xl font-black text-black mt-12 mb-6">Internal Linking (Biar Persiapan Kamu Nyambung)</h2>
      <ul className="list-disc pl-8 space-y-3 text-gray-700">
        <li>
          Perkuat bahasa sebelum berangkat: <Link className="text-dory-red font-bold hover:underline" to="/kursus-bahasa-jepang-online">Kursus Bahasa Jepang Online</Link>
        </li>
        <li>
          Lihat detail program: <Link className="text-dory-red font-bold hover:underline" to="/magang-ke-jepang">Program Magang ke Jepang</Link>
        </li>
        <li>
          Kalau target kamu kerja setelah pondasi kuat: <Link className="text-dory-red font-bold hover:underline" to="/pelatihan-kerja-ke-jepang">Pelatihan Kerja ke Jepang</Link>
        </li>
      </ul>

      <h2 className="text-3xl font-black text-black mt-12 mb-6">FAQ</h2>
      <h3 className="text-2xl font-black text-black mt-10 mb-4">1) Kenapa potongan gaji magang Jepang bisa besar?</h3>
      <p>
        Karena ada komponen seperti asuransi, pajak, dan asrama. Ini hal yang normal dalam sistem kerja di Jepang. Yang penting kamu paham rinciannya dari awal.
      </p>
      <h3 className="text-2xl font-black text-black mt-10 mb-4">2) Apakah lembur pasti ada?</h3>
      <p>
        Tidak selalu. Ada periode ramai dan ada periode sepi. Lebih aman kalau kamu membuat rencana keuangan tanpa mengandalkan lembur.
      </p>
      <h3 className="text-2xl font-black text-black mt-10 mb-4">3) Bagaimana supaya tidak kaget saat di Jepang?</h3>
      <p>
        Pahami konsep gaji bersih, tanya detail potongan, dan latih kebiasaan budgeting dari sekarang. Selain itu, kuatkan bahasa Jepang agar adaptasi lebih lancar.
      </p>

      <h2 className="text-3xl font-black text-black mt-12 mb-6">CTA: Mau Berangkat dengan Persiapan yang Jelas?</h2>
      <p>
        Sebelum mikirin angka gaji, pastikan kamu siap seleksi dan siap adaptasi. Mulai dari{' '}
        <Link className="text-dory-red font-bold hover:underline" to="/kursus-bahasa-jepang-online">Kursus Bahasa Jepang Online</Link>,
        lalu lanjut ke{' '}
        <Link className="text-dory-red font-bold hover:underline" to="/magang-ke-jepang">Program Magang ke Jepang</Link>.
        Kalau kamu ingin konsultasi rencana dan jalur yang cocok, isi{' '}
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
      category="GAJI & TABUNGAN"
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

export default GajiMagangJepangBersih;

