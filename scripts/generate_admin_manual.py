#!/usr/bin/env python3
"""Generate SKYBRIDGE Admin User Manual PDF with logo and screenshots."""

import os
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import cm, mm
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    Image,
    KeepTogether,
    NextPageTemplate,
    PageBreak,
    PageTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "docs" / "manual-assets"
SCREENSHOTS = ASSETS / "screenshots"
LOGO = ASSETS / "logo.png"
OUTPUT = ROOT / "docs" / "SKYBRIDGE-Admin-User-Manual.pdf"

SKY_RED = colors.HexColor("#DC2626")
SKY_DARK = colors.HexColor("#0F172A")
SKY_MUTED = colors.HexColor("#64748B")
SKY_LIGHT = colors.HexColor("#F8FAFC")
WARN_BG = colors.HexColor("#FEF3C7")
TIP_BG = colors.HexColor("#ECFDF5")
ACCENT = colors.HexColor("#E11D48")


def footer(canvas, doc):
    canvas.saveState()
    canvas.setFont("Helvetica", 8)
    canvas.setFillColor(SKY_MUTED)
    canvas.drawString(2 * cm, 1.2 * cm, "SKYBRIDGE Nusantara International School — Panduan Admin")
    canvas.drawRightString(A4[0] - 2 * cm, 1.2 * cm, f"Halaman {doc.page}")
    canvas.restoreState()


def cover(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(SKY_DARK)
    canvas.rect(0, 0, A4[0], A4[1], fill=1, stroke=0)

    canvas.setFillColor(SKY_RED)
    canvas.rect(0, A4[1] - 9.5 * cm, A4[0], 9.5 * cm, fill=1, stroke=0)

    if LOGO.exists():
        logo_w, logo_h = 3.2 * cm, 3.2 * cm
        x = (A4[0] - logo_w) / 2
        y = A4[1] - 7.2 * cm
        canvas.drawImage(str(LOGO), x, y, width=logo_w, height=logo_h, mask="auto", preserveAspectRatio=True)

    canvas.setFillColor(colors.white)
    canvas.setFont("Helvetica-Bold", 30)
    canvas.drawCentredString(A4[0] / 2, A4[1] - 8.3 * cm, "SKYBRIDGE")
    canvas.setFont("Helvetica", 13)
    canvas.drawCentredString(A4[0] / 2, A4[1] - 9.1 * cm, "Nusantara International School")

    canvas.setFont("Helvetica-Bold", 22)
    canvas.drawCentredString(A4[0] / 2, 10.5 * cm, "PANDUAN PENGGUNAAN ADMIN")
    canvas.setFont("Helvetica", 13)
    canvas.drawCentredString(A4[0] / 2, 9.5 * cm, "User Manual — Website & CMS")
    canvas.setFont("Helvetica", 10)
    canvas.drawCentredString(A4[0] / 2, 3.2 * cm, "Versi: September 2026")
    canvas.drawCentredString(A4[0] / 2, 2.5 * cm, "https://www.snischool.com")
    canvas.restoreState()


def build_styles():
    styles = getSampleStyleSheet()
    styles.add(
        ParagraphStyle(
            name="Chapter",
            parent=styles["Heading1"],
            fontSize=18,
            textColor=SKY_RED,
            spaceBefore=14,
            spaceAfter=8,
        )
    )
    styles.add(
        ParagraphStyle(
            name="Section",
            parent=styles["Heading2"],
            fontSize=13,
            textColor=SKY_DARK,
            spaceBefore=10,
            spaceAfter=5,
        )
    )
    styles.add(
        ParagraphStyle(
            name="Body",
            parent=styles["Normal"],
            fontSize=10.5,
            leading=15,
            alignment=TA_JUSTIFY,
            textColor=SKY_DARK,
        )
    )
    styles.add(
        ParagraphStyle(
            name="Step",
            parent=styles["Body"],
            leftIndent=10,
            spaceBefore=3,
            spaceAfter=2,
        )
    )
    styles.add(
        ParagraphStyle(
            name="Caption",
            parent=styles["Body"],
            fontSize=9,
            textColor=SKY_MUTED,
            alignment=TA_CENTER,
            spaceBefore=4,
            spaceAfter=10,
        )
    )
    return styles


def box(title, text, styles, bg):
    data = [[Paragraph(f"<b>{title}</b><br/>{text}", styles["Body"])]]
    t = Table(data, colWidths=[16 * cm])
    t.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), bg),
                ("BOX", (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
                ("LEFTPADDING", (0, 0), (-1, -1), 10),
                ("RIGHTPADDING", (0, 0), (-1, -1), 10),
                ("TOPPADDING", (0, 0), (-1, -1), 8),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
            ]
        )
    )
    return t


def steps(items, styles):
    return [Paragraph(f"<b>LANGKAH {i + 1}</b> — {text}", styles["Step"]) for i, text in enumerate(items)]


def screenshot_block(filename, caption, styles, max_width=15.5 * cm, max_height=9.5 * cm):
    path = SCREENSHOTS / filename
    if not path.exists():
        return [
            Paragraph(f"[Screenshot belum tersedia: {caption}]", styles["Body"]),
            Spacer(1, 6),
        ]

    img = Image(str(path))
    iw, ih = img.imageWidth, img.imageHeight
    ratio = min(max_width / iw, max_height / ih)
    img.drawWidth = iw * ratio
    img.drawHeight = ih * ratio

    frame = Table([[img]], colWidths=[16 * cm])
    frame.setStyle(
        TableStyle(
            [
                ("ALIGN", (0, 0), (-1, -1), "CENTER"),
                ("BOX", (0, 0), (-1, -1), 0.75, colors.HexColor("#CBD5E1")),
                ("BACKGROUND", (0, 0), (-1, -1), colors.white),
                ("TOPPADDING", (0, 0), (-1, -1), 6),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
            ]
        )
    )
    return [
        frame,
        Paragraph(f"<i>Gambar:</i> {caption}", styles["Caption"]),
    ]


def step_with_shot(step_items, shot_file, shot_caption, styles, insert_after_step=None):
    block = []
    for i, text in enumerate(step_items):
        block.append(Paragraph(f"<b>LANGKAH {i + 1}</b> — {text}", styles["Step"]))
        if insert_after_step and i + 1 == insert_after_step:
            block.extend(screenshot_block(shot_file, shot_caption, styles))
    if not insert_after_step:
        block.extend(screenshot_block(shot_file, shot_caption, styles))
    return block


def main():
    os.makedirs(OUTPUT.parent, exist_ok=True)
    styles = build_styles()
    story = []

    doc = BaseDocTemplate(
        str(OUTPUT),
        pagesize=A4,
        leftMargin=2 * cm,
        rightMargin=2 * cm,
        topMargin=2 * cm,
        bottomMargin=2 * cm,
    )
    frame = Frame(doc.leftMargin, doc.bottomMargin, doc.width, doc.height, id="normal")
    doc.addPageTemplates(
        [
            PageTemplate(id="cover", frames=frame, onPage=cover),
            PageTemplate(id="content", frames=frame, onPage=footer),
        ]
    )

    story.append(NextPageTemplate("content"))
    story.append(PageBreak())

    # BAB 1
    story.append(Paragraph("BAB 1 — Pengenalan Admin", styles["Chapter"]))
    story.append(
        Paragraph(
            "Halaman Admin SKYBRIDGE digunakan untuk mengelola website resmi dan data pendaftaran calon siswa. "
            "Melalui panel ini, admin dapat memantau pendaftar, mengubah konten website, mengatur informasi pembayaran, "
            "dan mengelola akun pengguna internal.",
            styles["Body"],
        )
    )
    story.append(Spacer(1, 8))
    story.append(Paragraph("<b>Yang dapat dilakukan admin:</b>", styles["Section"]))
    for item in [
        "Melihat ringkasan pendaftaran di Dashboard",
        "Mengelola data pendaftar (lihat, verifikasi, ubah status)",
        "Mengubah konten website melalui CMS Website",
        "Mengatur rekening dan instruksi pembayaran",
        "Mengelola akun admin/staff (khusus Super Admin)",
        "Mengelola modul akademik (kelas, jadwal, absensi, nilai, dll.)",
    ]:
        story.append(Paragraph(f"• {item}", styles["Body"]))
    story.append(Spacer(1, 8))
    story.append(
        box(
            "Penting",
            "Data website (teks, gambar, rekening) berbeda dengan data pendaftar (formulir, dokumen, status). "
            "Pastikan Anda berada di menu yang tepat sebelum menyimpan perubahan.",
            styles,
            WARN_BG,
        )
    )

    # BAB 2
    story.append(PageBreak())
    story.append(Paragraph("BAB 2 — Login Admin", styles["Chapter"]))
    story.append(
        Paragraph(
            "Setiap peran memiliki halaman login sendiri. Gunakan halaman yang sesuai dengan akun Anda:",
            styles["Body"],
        )
    )
    story.append(Spacer(1, 6))
    login_table = Table(
        [
            ["Peran", "Alamat Login"],
            ["Super Admin", "https://www.snischool.com/admin/login"],
            ["Staff", "https://www.snischool.com/staff/login"],
            ["Kepala LPK", "https://www.snischool.com/kepalalpk/login"],
        ],
        colWidths=[4 * cm, 12 * cm],
    )
    login_table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), SKY_RED),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                ("GRID", (0, 0), (-1, -1), 0.25, colors.grey),
                ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, SKY_LIGHT]),
                ("FONTSIZE", (0, 0), (-1, -1), 9),
                ("PADDING", (0, 0), (-1, -1), 6),
            ]
        )
    )
    story.append(login_table)
    story.append(Spacer(1, 10))
    story.extend(
        step_with_shot(
            [
                "Buka halaman login sesuai peran Anda (contoh: Super Admin).",
            ],
            "01-login.png",
            "Halaman Login Admin SKYBRIDGE",
            styles,
        )
    )
    story.extend(
        step_with_shot(
            [
                "Masukkan <b>Username</b> dan <b>Password</b> akun resmi Anda.",
                "Klik tombol <b>Masuk Dashboard</b>.",
                "Jika berhasil, Anda akan diarahkan ke Dashboard admin.",
            ],
            "02-login-filled.png",
            "Form login — isi username dan password, lalu klik Masuk Dashboard",
            styles,
            insert_after_step=1,
        )
    )
    story.append(
        box(
            "Keamanan Login",
            "Jangan membagikan password. Gunakan akun masing-masing. Logout setelah selesai bekerja.",
            styles,
            TIP_BG,
        )
    )

    # BAB 3
    story.append(PageBreak())
    story.append(Paragraph("BAB 3 — Memahami Dashboard", styles["Chapter"]))
    story.append(
        Paragraph(
            "Dashboard menampilkan ringkasan kondisi pendaftaran. Angka yang tampil berasal dari data aktual "
            "di sistem dan dapat berubah setiap saat.",
            styles["Body"],
        )
    )
    story.append(Spacer(1, 8))
    story.append(Paragraph("<b>Menu sidebar (Super Admin):</b>", styles["Section"]))
    menu_items = [
        "Dashboard — ringkasan statistik pendaftaran",
        "Input Data Siswa — entri data pendaftar oleh admin/staff",
        "Scan QR Code — verifikasi kartu pendaftaran",
        "Data Pendaftar — daftar seluruh pendaftar",
        "Akademik — Data Kelas, Data Siswa, Jadwal Mengajar, Absensi, Nilai, Jurnal, Rekap, Cetak Laporan, Tahun Ajaran, Kurikulum",
        "Manajemen User — kelola akun admin/staff (Super Admin saja)",
        "CMS Website — kelola konten halaman & blog",
        "Export PDF / Export Excel — unduh laporan pendaftar",
        "Keluar — logout dari sistem",
    ]
    for m in menu_items:
        story.append(Paragraph(f"• {m}", styles["Body"]))
    story.append(Spacer(1, 8))
    story.extend(
        step_with_shot(
            [
                "Setelah login, Dashboard menampilkan ringkasan pendaftaran.",
                "Perhatikan menu sidebar di sebelah kiri untuk navigasi ke fitur admin.",
            ],
            "03-dashboard.png",
            "Dashboard Admin — ringkasan statistik pendaftaran",
            styles,
            insert_after_step=1,
        )
    )
    story.extend(screenshot_block("04-dashboard-sidebar.png", "Menu sidebar admin lengkap", styles))

    # BAB 4
    story.append(PageBreak())
    story.append(Paragraph("BAB 4 — Mengelola Website / CMS", styles["Chapter"]))
    story.append(
        Paragraph(
            "Menu <b>CMS Website</b> (Super Admin) membuka halaman kelola konten. Terdapat empat tab utama:",
            styles["Body"],
        )
    )
    for tab in [
        "<b>Halaman Program</b> — edit konten halaman Kursus, Pelatihan, dan Magang",
        "<b>Blog</b> — buat, edit, dan hapus artikel blog",
        "<b>Pengaturan</b> — atur Link Grup WhatsApp peserta",
        "<b>Pembayaran</b> — atur informasi rekening (dibahas di Bab 5)",
    ]:
        story.append(Paragraph(f"• {tab}", styles["Body"]))
    story.append(Spacer(1, 10))
    story.append(Paragraph("<b>Langkah mengubah Halaman Program</b>", styles["Section"]))
    story.extend(
        step_with_shot(
            [
                "Buka menu <b>CMS Website</b> di sidebar.",
                "Pastikan tab <b>Halaman Program</b> aktif.",
                "Pilih halaman (Kursus / Pelatihan / Magang) di panel kiri.",
                "Ubah teks, gambar, atau FAQ sesuai kebutuhan.",
                "Klik <b>Simpan Halaman</b>.",
                "Buka halaman publik website untuk memastikan perubahan tampil.",
            ],
            "05-cms-program.png",
            "CMS Website — Tab Halaman Program",
            styles,
            insert_after_step=2,
        )
    )

    # BAB 5
    story.append(PageBreak())
    story.append(Paragraph("BAB 5 — Mengelola Payment / Rekening", styles["Chapter"]))
    story.append(
        Paragraph(
            "Bagian ini sangat penting. Informasi rekening yang Anda simpan akan ditampilkan kepada calon siswa "
            "pada halaman Pendaftaran dan Cek Status.",
            styles["Body"],
        )
    )
    story.append(Spacer(1, 8))
    story.extend(
        step_with_shot(
            [
                "Login sebagai Super Admin.",
                "Buka <b>CMS Website</b> → tab <b>Pembayaran</b>.",
                "Aktifkan toggle <b>Aktifkan informasi pembayaran</b> jika ingin ditampilkan di website.",
                "Isi <b>Judul Pembayaran</b>, <b>Deskripsi</b>, dan <b>Biaya Pendaftaran</b> (jika ada).",
                "Isi <b>Nama Bank</b>, <b>Nomor Rekening</b>, dan <b>Nama Pemilik Rekening</b>.",
                "Isi <b>Instruksi Pembayaran</b> dan <b>WhatsApp Konfirmasi</b> (opsional).",
                "Upload gambar <b>QRIS</b> jika diperlukan, lalu aktifkan <b>Tampilkan QRIS</b>.",
                "Klik <b>Simpan Perubahan</b> dan tunggu notifikasi berhasil.",
                "Buka halaman Pendaftaran atau Cek Status sebagai pengguna biasa untuk memverifikasi.",
            ],
            "06-cms-payment.png",
            "CMS Website — Tab Pembayaran / Rekening",
            styles,
            insert_after_step=2,
        )
    )
    story.append(
        box(
            "PERINGATAN",
            "Periksa ulang nomor rekening dan nama pemilik sebelum menekan Simpan. "
            "Kesalahan rekening dapat membingungkan calon siswa dan mitra.",
            styles,
            WARN_BG,
        )
    )

    # BAB 6
    story.append(PageBreak())
    story.append(Paragraph("BAB 6 — Data Pendaftar", styles["Chapter"]))
    story.append(
        Paragraph(
            "Menu <b>Data Pendaftar</b> menampilkan seluruh calon siswa yang mendaftar. "
            "Anda dapat mencari berdasarkan nama atau nomor registrasi.",
            styles["Body"],
        )
    )
    story.append(Spacer(1, 8))
    for item in [
        "Klik baris pendaftar untuk membuka <b>Detail Pendaftar</b>.",
        "Di detail, Anda dapat melihat data pribadi, keluarga, dokumen, dan status pembayaran.",
        "Ubah <b>Status</b> pendaftar (Menunggu Verifikasi / Diterima / Ditolak) sesuai kebijakan.",
        "Perbarui <b>Status Pembayaran</b> (Belum Lunas / Lunas) setelah verifikasi bukti transfer.",
        "Unduh dokumen atau formulir PDF jika tersedia di halaman detail.",
    ]:
        story.append(Paragraph(f"• {item}", styles["Body"]))
    story.append(Spacer(1, 8))
    story.extend(
        step_with_shot(
            [
                "Buka menu <b>Data Pendaftar</b> dari sidebar.",
                "Gunakan kolom pencarian untuk menemukan pendaftar tertentu.",
                "Klik tombol <b>Detail</b> pada baris pendaftar untuk membuka profil lengkap.",
            ],
            "07-students-list.png",
            "Daftar Data Pendaftar",
            styles,
            insert_after_step=1,
        )
    )
    story.extend(screenshot_block("08-student-detail.png", "Detail Pendaftar — status, dokumen, dan pembayaran", styles))

    # BAB 7
    story.append(PageBreak())
    story.append(Paragraph("BAB 7 — Manajemen User", styles["Chapter"]))
    story.append(
        Paragraph(
            "Menu <b>Manajemen User</b> hanya tersedia untuk Super Admin. Di sini Anda dapat:",
            styles["Body"],
        )
    )
    for item in [
        "Melihat daftar user admin/staff",
        "Menambah user baru dengan role (Super Admin, Staff, Kepala LPK)",
        "Mengubah nama, username, atau password user",
        "Menonaktifkan atau menghapus user jika diperlukan",
    ]:
        story.append(Paragraph(f"• {item}", styles["Body"]))
    story.append(
        box(
            "Tips",
            "Gunakan akun individual untuk setiap orang. Jangan berbagi satu akun admin ke banyak orang.",
            styles,
            TIP_BG,
        )
    )
    story.extend(
        step_with_shot(
            [
                "Buka menu <b>Manajemen User</b> (Super Admin).",
                "Klik <b>Tambah User</b> untuk membuat akun baru, atau edit user yang sudah ada.",
                "Pastikan role dipilih sesuai tugas: Super Admin, Staff, atau Kepala LPK.",
            ],
            "09-user-management.png",
            "Halaman Manajemen User",
            styles,
            insert_after_step=1,
        )
    )

    # BAB 8
    story.append(Paragraph("BAB 8 — Multi-User Admin", styles["Chapter"]))
    story.append(
        Paragraph(
            "Beberapa admin dan staff dapat login bersamaan dari komputer atau perangkat yang berbeda. "
            "Setiap akun memiliki sesi sendiri — login atau logout akun A tidak memengaruhi akun B.",
            styles["Body"],
        )
    )
    story.append(
        Paragraph(
            "Contoh: Pak Rama (Super Admin), Staff Adam, dan Staff Jamil dapat bekerja di admin panel "
            "secara bersamaan tanpa saling logout.",
            styles["Body"],
        )
    )

    # BAB 9
    story.append(PageBreak())
    story.append(Paragraph("BAB 9 — Memastikan Perubahan Tampil", styles["Chapter"]))
    story.extend(
        steps(
            [
                "Simpan perubahan di CMS (tunggu notifikasi sukses).",
                "Buka website https://www.snischool.com di tab/browser baru.",
                "Navigasi ke halaman terkait (pendaftaran, halaman program, dll.).",
                "Periksa apakah perubahan sudah sesuai.",
                "Jika belum tampil, refresh halaman sekali. Jangan mengubah data berulang sebelum memastikan simpan berhasil.",
            ],
            styles,
        )
    )
    story.append(
        Paragraph(
            "Website production menggunakan cache untuk file gambar/JS agar cepat, tetapi halaman utama "
            "diatur agar selalu mengambil versi terbaru.",
            styles["Body"],
        )
    )

    # BAB 10
    story.append(Paragraph("BAB 10 — Kesalahan Umum", styles["Chapter"]))
    errors = [
        ("Lupa klik Simpan", "Pastikan muncul notifikasi sukses sebelum menutup halaman."),
        ("Nomor rekening salah", "Cek ulang di tab Pembayaran, simpan, lalu verifikasi di frontend."),
        ("Upload gagal", "Periksa ukuran file gambar (gunakan file yang tidak terlalu besar)."),
        ("Field wajib kosong", "Isi nama pemilik rekening jika informasi transfer diisi."),
        ("Tidak punya akses menu", "Pastikan login di halaman yang sesuai peran (admin vs staff)."),
        ("Perubahan belum tampil", "Refresh halaman website; pastikan simpan CMS berhasil."),
    ]
    err_data = [[Paragraph(f"<b>{e[0]}</b>", styles["Body"]), Paragraph(e[1], styles["Body"])] for e in errors]
    err_table = Table(err_data, colWidths=[4.5 * cm, 11.5 * cm])
    err_table.setStyle(
        TableStyle(
            [
                ("GRID", (0, 0), (-1, -1), 0.25, colors.grey),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("BACKGROUND", (0, 0), (-1, -1), SKY_LIGHT),
                ("PADDING", (0, 0), (-1, -1), 6),
            ]
        )
    )
    story.append(err_table)

    # BAB 11
    story.append(PageBreak())
    story.append(Paragraph("BAB 11 — Keamanan Admin", styles["Chapter"]))
    for item in [
        "Jangan bagikan password kepada siapapun.",
        "Jangan login menggunakan akun orang lain.",
        "Logout setelah selesai, terutama di komputer bersama.",
        "Cek ulang data rekening sebelum publish ke website.",
        "Jangan berikan akses admin kepada pihak yang tidak dipercaya.",
    ]:
        story.append(Paragraph(f"• {item}", styles["Body"]))
    story.extend(screenshot_block("10-logout-login.png", "Logout — kembali ke halaman login", styles))

    # BAB 12
    story.append(Paragraph("BAB 12 — Kapan Menghubungi Developer", styles["Chapter"]))
    story.append(Paragraph("<b>Dapat dilakukan sendiri via Admin:</b>", styles["Section"]))
    for item in ["Ubah teks/gambar website", "Ubah rekening & payment settings", "Kelola pendaftar & status", "Kelola user admin/staff"]:
        story.append(Paragraph(f"• {item}", styles["Body"]))
    story.append(Spacer(1, 6))
    story.append(Paragraph("<b>Hubungi developer untuk:</b>", styles["Section"]))
    for item in [
        "Fitur baru atau perubahan sistem",
        "Error/aplikasi tidak bisa dibuka",
        "Masalah server, domain, SSL",
        "Integrasi pihak ketiga baru",
        "Backup/recovery darurat",
    ]:
        story.append(Paragraph(f"• {item}", styles["Body"]))

    # BAB 13
    story.append(Spacer(1, 12))
    story.append(Paragraph("BAB 13 — Checklist Admin Harian", styles["Chapter"]))
    checklist = [
        "[ ] Login ke admin panel",
        "[ ] Cek Dashboard — ada pendaftar baru?",
        "[ ] Cek Data Pendaftar — verifikasi status",
        "[ ] Cek CMS jika ada permintaan update konten",
        "[ ] Cek Payment Settings jika ada perubahan rekening",
        "[ ] Pastikan perubahan tampil di website",
        "[ ] Logout setelah selesai",
    ]
    for c in checklist:
        story.append(Paragraph(c, styles["Body"]))

    story.append(Spacer(1, 20))
    story.append(
        Paragraph(
            "<para align='center'><b>— Selesai —</b><br/>Dokumen ini dibuat untuk SKYBRIDGE Nusantara International School<br/>September 2026</para>",
            styles["Body"],
        )
    )

    doc.build(story)
    print(f"Generated: {OUTPUT}")
    print(f"Size: {OUTPUT.stat().st_size} bytes")


if __name__ == "__main__":
    main()
