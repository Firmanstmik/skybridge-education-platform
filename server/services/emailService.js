const nodemailer = require('nodemailer');

const ADMIN_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL || 'ramakatsuyuki7@gmail.com';

const COURSE_PACKAGE_LABELS = {
  basic: 'Kelas Basic (Rp 150.000 · 1x/minggu · 1 jam)',
  intensive: 'Kelas Intensif (Rp 1.500.000 · 3x/minggu · 1,5 jam)',
  premium: 'Kelas Premium (Rp 2.500.000 · 5x/minggu · 1,5 jam)',
};

let transporter = null;

const getTransporter = () => {
  if (transporter) return transporter;

  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  return transporter;
};

const escapeHtml = (value) =>
  String(value ?? '-')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const formatBool = (value) => {
  if (value === true || value === 'true') return 'Ya';
  if (value === false || value === 'false') return 'Tidak';
  return '-';
};

const formatFile = (files, key) => {
  const file = files?.[key]?.[0];
  if (!file) return '-';
  return file.originalname || file.filename || file.path || 'Terupload';
};

const buildSection = (title, rows) => {
  const items = rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:8px 12px;border:1px solid #e5e7eb;background:#f8fafc;font-weight:600;width:220px;">${escapeHtml(label)}</td><td style="padding:8px 12px;border:1px solid #e5e7eb;">${escapeHtml(value)}</td></tr>`
    )
    .join('');

  return `
    <h3 style="margin:24px 0 8px;color:#003B73;font-size:16px;">${escapeHtml(title)}</h3>
    <table style="width:100%;border-collapse:collapse;font-size:14px;color:#1f2937;">${items}</table>
  `;
};

const buildEducationSection = (educationRaw) => {
  let education = [];
  try {
    education = educationRaw ? JSON.parse(educationRaw) : [];
  } catch {
    education = [];
  }

  if (!Array.isArray(education) || education.length === 0) {
    return buildSection('B. Riwayat Pendidikan', [['Data', 'Tidak ada data']]);
  }

  const rows = education.flatMap((edu) => {
    const hasData =
      edu.school_name ||
      edu.entry_month ||
      edu.entry_year ||
      edu.graduation_month ||
      edu.graduation_year;
    if (!hasData) return [];

    return [
      [`${edu.level} - Sekolah`, edu.school_name || '-'],
      [`${edu.level} - Masuk`, `${edu.entry_month || '-'} ${edu.entry_year || '-'}`],
      [`${edu.level} - Lulus`, `${edu.graduation_month || '-'} ${edu.graduation_year || '-'}`],
    ];
  });

  if (rows.length === 0) {
    return buildSection('B. Riwayat Pendidikan', [['Data', 'Tidak ada data']]);
  }

  return buildSection('B. Riwayat Pendidikan', rows);
};

const buildRegistrationEmail = ({ body, files, regNumber, status }) => {
  const personal = buildSection('A. Keterangan Pribadi', [
    ['Nomor Registrasi', regNumber],
    ['Nama Lengkap', body.full_name],
    ['Paket Kelas', COURSE_PACKAGE_LABELS[body.course_package] || body.course_package || '-'],
    ['NIK', body.nik],
    ['Jenis Kelamin', body.gender],
    ['Tempat Lahir', body.place_of_birth],
    ['Tanggal Lahir', body.date_of_birth],
    ['Golongan Darah', body.blood_type],
    ['Agama', body.religion],
    ['Status Pernikahan', body.marital_status],
    ['No. Telepon', body.phone_number],
    ['Email', body.email],
    ['Alamat', body.address],
    ['Status Pendaftaran', status],
  ]);

  const education = buildEducationSection(body.education);

  const family = buildSection('C. Data Orang Tua / Wali', [
    ['Nama Ayah', body.father_name],
    ['Pekerjaan Ayah', body.father_job],
    ['Status Ayah', body.father_status],
    ['Nama Ibu', body.mother_name],
    ['Pekerjaan Ibu', body.mother_job],
    ['Status Ibu', body.mother_status],
    ['Alamat Orang Tua', body.parent_address],
    ['Nama Wali', body.guardian_name],
    ['Alamat Wali', body.guardian_address],
    ['Telepon Wali', body.guardian_phone],
  ]);

  const physical = buildSection('E. Test Fisik', [
    ['Tato', formatBool(body.has_tattoo)],
    ['Tindik', formatBool(body.has_piercing)],
    ['Tinggi Badan (cm)', body.height],
    ['Berat Badan (kg)', body.weight],
  ]);

  const documents = buildSection('D. Dokumen Terupload', [
    ['Foto', formatFile(files, 'photo')],
    ['Ijazah', formatFile(files, 'diploma')],
    ['KTP', formatFile(files, 'ktp')],
    ['Kartu Keluarga', formatFile(files, 'family_card')],
    ['Akta Kelahiran', formatFile(files, 'birth_certificate')],
    ['Surat Sehat', formatFile(files, 'health_certificate')],
    ['Surat Kesediaan', formatFile(files, 'consent_letter')],
  ]);

  const timestamp = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });

  return `
    <div style="font-family:Arial,sans-serif;max-width:760px;margin:0 auto;color:#111827;">
      <div style="background:#003B73;color:#fff;padding:20px 24px;border-radius:12px 12px 0 0;">
        <h2 style="margin:0;font-size:20px;">Pendaftaran Baru Masuk</h2>
        <p style="margin:8px 0 0;opacity:0.9;">SKYBRIDGE Nusantara International School</p>
      </div>
      <div style="padding:24px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px;background:#fff;">
        <p style="margin:0 0 16px;">Ada pendaftar baru pada <strong>${escapeHtml(timestamp)} WIB</strong>.</p>
        ${personal}
        ${education}
        ${family}
        ${physical}
        ${documents}
      </div>
    </div>
  `;
};

exports.sendRegistrationNotification = async ({ body, files, regNumber, status }) => {
  const mailer = getTransporter();
  if (!mailer) {
    console.warn(
      '[email] SMTP belum dikonfigurasi. Set SMTP_HOST, SMTP_USER, SMTP_PASS di file .env server.'
    );
    return { sent: false, reason: 'smtp_not_configured' };
  }

  const html = buildRegistrationEmail({ body, files, regNumber, status });
  const studentName = String(body.full_name || 'Pendaftar').trim();

  try {
    await mailer.sendMail({
      from: `"SKYBRIDGE Pendaftaran" <${process.env.SMTP_USER}>`,
      to: ADMIN_EMAIL,
      subject: `[Pendaftaran Baru] ${studentName} - ${regNumber}`,
      html,
      text: `Pendaftaran baru: ${studentName} (${regNumber}). Buka email HTML untuk detail lengkap.`,
    });

    return { sent: true };
  } catch (error) {
    console.error('[email] Gagal mengirim notifikasi pendaftaran:', error.message);
    return { sent: false, reason: error.message };
  }
};
