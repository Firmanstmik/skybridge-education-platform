const db = require('../config/db');
const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const ExcelJS = require('exceljs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
let Tesseract;
try {
    Tesseract = require('tesseract.js');
} catch (_) {
    Tesseract = null;
}

const generateRegistrationNumber = async (year, connection = null) => {
    const conn = connection || db;
    const prefix = `DORY-${year}-`;
    const [rows] = await conn.query(
        'SELECT registration_number FROM students WHERE registration_number LIKE ? ORDER BY registration_number DESC LIMIT 1',
        [`${prefix}%`]
    );
    let next = 1;
    if (rows.length > 0) {
        const last = rows[0].registration_number || '';
        const parts = String(last).split('-');
        const suffix = Number(parts[parts.length - 1]);
        next = Number.isFinite(suffix) ? (suffix + 1) : 1;
    }
    while (true) {
        const candidate = `${prefix}${String(next).padStart(4, '0')}`;
        const [exists] = await conn.query('SELECT id FROM students WHERE registration_number = ? LIMIT 1', [candidate]);
        if (exists.length === 0) return candidate;
        next++;
    }
};

const getDecodedRoleFromAuthHeader = (req) => {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) return null;
    try {
        const token = auth.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded?.role || null;
    } catch (e) {
        return null;
    }
};

const isPrivilegedRole = (role) => role === 'STAFF' || role === 'SUPER_ADMIN' || role === 'superadmin';

const generateUniqueTemporaryNik = async (connection, legacyYear) => {
    const yy = String(Number(legacyYear) || new Date().getFullYear()).slice(-2);
    const mm = String(new Date().getMonth() + 1).padStart(2, '0');

    for (let attempt = 0; attempt < 12; attempt++) {
        const rand = crypto.randomInt(0, 10 ** 10).toString().padStart(10, '0');
        const candidate = `98${yy}${mm}${rand}`;

        const [rows] = await connection.query('SELECT id FROM students WHERE nik = ?', [candidate]);
        if (!rows || rows.length === 0) return candidate;
    }

    throw new Error('Gagal membuat NIK sementara yang unik');
};

const mapGender = (val) => {
    if (!val) return 'Laki-laki';
    const v = String(val).toLowerCase();
    if (v === 'l' || v.includes('laki')) return 'Laki-laki';
    if (v === 'p' || v.includes('perempuan')) return 'Perempuan';
    return 'Laki-laki';
};

exports.getStudentStats = async (req, res) => {
    try {
        const connection = await db.getConnection();
        
        // 1. Total Pendaftar Bulan Ini
        const currentMonth = new Date().getMonth() + 1;
        const currentYear = new Date().getFullYear();
        const [monthRows] = await connection.query(
            'SELECT COUNT(*) as count FROM students WHERE MONTH(created_at) = ? AND YEAR(created_at) = ?',
            [currentMonth, currentYear]
        );
        const totalMonth = monthRows[0].count;

        // 2. Total Diterima & Ditolak
        const [statusRows] = await connection.query(
            'SELECT status, COUNT(*) as count FROM students GROUP BY status'
        );
        
        const stats = {
            total: 0,
            accepted: 0,
            rejected: 0,
            verified: 0,
            pending: 0
        };

        statusRows.forEach(row => {
            stats.total += row.count;
            if (row.status === 'Diterima') stats.accepted = row.count;
            if (row.status === 'Ditolak') stats.rejected = row.count;
            if (row.status === 'Terverifikasi') stats.verified = row.count;
            if (row.status === 'Menunggu Verifikasi') stats.pending = row.count;
        });

        // 3. Persentase Kelulusan (Accepted / (Accepted + Rejected))
        const processed = stats.accepted + stats.rejected;
        const graduationRate = processed > 0 ? Math.round((stats.accepted / processed) * 100) : 0;

        // 4. Grafik Tren Pendaftar per Bulan (Tahun Ini / Current Year)
        const currentYearGraph = new Date().getFullYear();
        const [trendRows] = await connection.query(`
            SELECT DATE_FORMAT(created_at, '%Y-%m') as month, COUNT(*) as count 
            FROM students 
            WHERE YEAR(created_at) = ? 
            GROUP BY month 
            ORDER BY month ASC
        `, [currentYearGraph]);

        // Fill in missing months (Januari - Desember)
        const filledTrends = [];
        for (let i = 0; i < 12; i++) {
            const d = new Date(currentYearGraph, i, 1);
            const monthKey = `${currentYearGraph}-${String(i + 1).padStart(2, '0')}`;
            
            const existing = trendRows.find(row => row.month === monthKey);
            filledTrends.push({
                month: d.toLocaleDateString('id-ID', { month: 'long' }),
                count: existing ? existing.count : 0
            });
        }

        // 5. Grafik Perbandingan Diterima vs Ditolak (Pie Chart data)
        const comparison = [
            { name: 'Diterima', value: stats.accepted },
            { name: 'Ditolak', value: stats.rejected }
        ];

        connection.release();

        res.json({
            totalMonth,
            totalAccepted: stats.accepted,
            totalRejected: stats.rejected,
            graduationRate,
            trends: filledTrends,
            comparison,
            statusDistribution: [
                { name: 'Diterima', value: stats.accepted, color: '#10B981' },
                { name: 'Ditolak', value: stats.rejected, color: '#EF4444' },
                { name: 'Pending', value: stats.pending, color: '#F59E0B' }
            ]
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

exports.deleteStudent = async (req, res) => {
    // Check role
    if (req.user.role !== 'SUPER_ADMIN' && req.user.role !== 'superadmin') {
        return res.status(403).json({ message: 'Not authorized to delete students' });
    }

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        const { id } = req.params;

        // Delete related data first (though cascading might handle this, explicit is safer)
        await connection.query('DELETE FROM education_history WHERE student_id = ?', [id]);
        await connection.query('DELETE FROM student_families WHERE student_id = ?', [id]);
        await connection.query('DELETE FROM student_documents WHERE student_id = ?', [id]);
        
        // Delete student
        const [result] = await connection.query('DELETE FROM students WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            await connection.rollback();
            return res.status(404).json({ message: 'Student not found' });
        }

        await connection.commit();
        res.json({ message: 'Student deleted successfully' });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({ message: error.message });
    } finally {
        connection.release();
    }
};

exports.loginStudent = async (req, res) => {
    try {
        const { registration_number, nik } = req.body;
        const [rows] = await db.query('SELECT * FROM students WHERE registration_number = ? AND nik = ?', [registration_number, nik]);
        if (rows.length === 0) {
            return res.status(401).json({ message: 'Nomor Registrasi atau NIK salah' });
        }
        
        const student = rows[0];
        const [education] = await db.query('SELECT * FROM education_history WHERE student_id = ?', [student.id]);
        const [family] = await db.query('SELECT * FROM student_families WHERE student_id = ?', [student.id]);
        const [documents] = await db.query('SELECT * FROM student_documents WHERE student_id = ?', [student.id]);

        res.json({
            message: 'Login successful',
            student: {
                ...student,
                education,
                family: family[0] || {},
                documents: documents[0] || {}
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateStudentData = async (req, res) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        const { id } = req.params;
        const body = req.body;
        const files = req.files || {};

        const nikTrimmed = body.nik !== undefined && body.nik !== null ? String(body.nik).trim() : '';
        const shouldUpdateNik = nikTrimmed !== '';
        if (shouldUpdateNik) {
            if (nikTrimmed.length !== 16) {
                await connection.rollback();
                return res.status(400).json({ message: 'NIK harus 16 digit sesuai KTP' });
            }

            const [existingNik] = await connection.query('SELECT id FROM students WHERE nik = ? AND id != ?', [nikTrimmed, id]);
            if (existingNik.length > 0) {
                await connection.rollback();
                return res.status(400).json({ message: 'NIK sudah terdaftar. NIK tidak boleh sama.' });
            }
        }

        // 1. Update students table
        await connection.query(
            `UPDATE students SET 
                full_name = ?, gender = ?, place_of_birth = ?, date_of_birth = ?, 
                blood_type = ?, religion = ?, address = ?, marital_status = ?, phone_number = ?, email = ?, 
                ${shouldUpdateNik ? 'nik = ?,' : ''}
                has_tattoo = ?, has_piercing = ?, height = ?, weight = ?
                ${files['photo'] ? ', photo_path = ?' : ''}
            WHERE id = ?`,
            [
                body.full_name, mapGender(body.gender), body.place_of_birth || null, (body.date_of_birth === '' ? null : body.date_of_birth),
                body.blood_type, body.religion, body.address, body.marital_status, body.phone_number, body.email,
                ...(shouldUpdateNik ? [nikTrimmed] : []),
                body.has_tattoo === 'true', body.has_piercing === 'true', 
                body.height === '' ? null : body.height, 
                body.weight === '' ? null : body.weight,
                ...(files['photo'] ? [files['photo'][0].path] : []),
                id
            ]
        );

        // 2. Update Education (Delete all and re-insert)
        if (body.education) {
            await connection.query('DELETE FROM education_history WHERE student_id = ?', [id]);
            const educationData = JSON.parse(body.education);
            for (const edu of educationData) {
                await connection.query(
                    'INSERT INTO education_history (student_id, level, school_name, entry_month, entry_year, graduation_month, graduation_year) VALUES (?, ?, ?, ?, ?, ?, ?)',
                    [id, edu.level, edu.school_name, edu.entry_month, edu.entry_year, edu.graduation_month, edu.graduation_year]
                );
            }
        }

        // 3. Update Family (Ensure row exists)
        const [familyExists] = await connection.query('SELECT student_id FROM student_families WHERE student_id = ?', [id]);
        if (familyExists.length === 0) {
            await connection.query('INSERT INTO student_families (student_id) VALUES (?)', [id]);
        }
        await connection.query(
            `UPDATE student_families SET 
                father_name = ?, mother_name = ?, father_job = ?, mother_job = ?, 
                father_status = ?, mother_status = ?, parent_address = ?, guardian_name = ?, 
                guardian_address = ?, guardian_phone = ?
            WHERE student_id = ?`,
            [
                body.father_name, body.mother_name, body.father_job, body.mother_job,
                body.father_status, body.mother_status, body.parent_address, body.guardian_name,
                body.guardian_address, body.guardian_phone,
                id
            ]
        );

        // 4. Update Documents (Ensure row exists)
        const [docRowExists] = await connection.query('SELECT student_id FROM student_documents WHERE student_id = ?', [id]);
        if (docRowExists.length === 0) {
            await connection.query('INSERT INTO student_documents (student_id) VALUES (?)', [id]);
        }

        const docUpdates = [];
        const docValues = [];
        
        if (files['diploma']) { docUpdates.push('diploma_path = ?'); docValues.push(files['diploma'][0].path); }
        if (files['ktp']) { docUpdates.push('ktp_path = ?'); docValues.push(files['ktp'][0].path); }
        if (files['family_card']) { docUpdates.push('family_card_path = ?'); docValues.push(files['family_card'][0].path); }
        if (files['birth_certificate']) { docUpdates.push('birth_certificate_path = ?'); docValues.push(files['birth_certificate'][0].path); }
        if (files['health_certificate']) { docUpdates.push('health_certificate_path = ?'); docValues.push(files['health_certificate'][0].path); }
        if (files['consent_letter']) { docUpdates.push('consent_letter_path = ?'); docValues.push(files['consent_letter'][0].path); }
        
        if (docUpdates.length > 0) {
            docValues.push(id);
            await connection.query(
                `UPDATE student_documents SET ${docUpdates.join(', ')} WHERE student_id = ?`,
                docValues
            );
        }

        await connection.commit();
        res.json({ message: 'Update successful' });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({ message: error.message });
    } finally {
        connection.release();
    }
};

exports.registerStudent = async (req, res) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // 1. Extract Data first
        const body = req.body;
        const files = req.files || {};

        // 2. Generate Registration Number (use requested year if legacy)
        const tentativeYear = body && body.data_year && String(body.data_year).trim() !== '' ? Number(String(body.data_year).trim()) : new Date().getFullYear();
        const regNumber = await generateRegistrationNumber(tentativeYear, connection);

        let status = 'Menunggu Verifikasi';
        const role = getDecodedRoleFromAuthHeader(req);
        if (isPrivilegedRole(role) && body.status) status = body.status;

        const fullName = body.full_name !== undefined && body.full_name !== null ? String(body.full_name).trim() : '';
        if (!fullName) {
            await connection.rollback();
            return res.status(400).json({ message: 'Nama lengkap harus diisi' });
        }

        const currentYear = new Date().getFullYear();
        const requestedYear = body.data_year !== undefined && body.data_year !== null && String(body.data_year).trim() !== ''
            ? Number(String(body.data_year).trim())
            : null;
        const allowIncompleteNik = isPrivilegedRole(role) && (status === 'Draft' || (Number.isFinite(requestedYear) && requestedYear < currentYear));
        const createdAtOverride = (Number.isFinite(requestedYear) && requestedYear < currentYear)
            ? `${requestedYear}-07-01 12:00:00`
            : null;

        const nikTrimmed = body.nik !== undefined && body.nik !== null ? String(body.nik).trim() : '';
        if (nikTrimmed.length !== 16) {
            if (allowIncompleteNik) {
                body.nik = await generateUniqueTemporaryNik(connection, requestedYear);
            } else {
                await connection.rollback();
                return res.status(400).json({ message: 'NIK harus 16 digit sesuai KTP' });
            }
        } else {
            body.nik = nikTrimmed;
        }

        const [existingNik] = await connection.query(
            'SELECT id FROM students WHERE nik = ?',
            [body.nik]
        );
        if (existingNik.length > 0) {
            await connection.rollback();
            return res.status(400).json({ message: 'NIK sudah terdaftar. NIK tidak boleh sama.' });
        }

        const [studentResult] = await connection.query(
            `INSERT INTO students (
                registration_number, nik, full_name, gender, place_of_birth, date_of_birth, 
                blood_type, religion, address, marital_status, phone_number, email, 
                photo_path, has_tattoo, has_piercing, height, weight, status, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                regNumber, body.nik, body.full_name, mapGender(body.gender), body.place_of_birth || null, (body.date_of_birth === '' ? null : body.date_of_birth),
                body.blood_type, body.religion, body.address, body.marital_status, body.phone_number, body.email,
                files['photo'] ? files['photo'][0].path : null, 
                body.has_tattoo === 'true', body.has_piercing === 'true', 
                body.height === '' ? null : body.height, 
                body.weight === '' ? null : body.weight,
                status,
                createdAtOverride ? createdAtOverride : new Date()
            ]
        );
        
        const studentId = studentResult.insertId;

        // 4. Insert Education History
        if (body.education) {
            const educationData = JSON.parse(body.education);
            for (const edu of educationData) {
                const isEmpty =
                    (!edu.school_name || edu.school_name.trim() === '') &&
                    (!edu.entry_month || edu.entry_month.trim() === '') &&
                    (edu.entry_year === undefined || edu.entry_year === null || String(edu.entry_year).trim() === '') &&
                    (!edu.graduation_month || edu.graduation_month.trim() === '') &&
                    (edu.graduation_year === undefined || edu.graduation_year === null || String(edu.graduation_year).trim() === '');

                if (isEmpty) continue;

                const entryYear =
                    edu.entry_year === undefined || edu.entry_year === null || String(edu.entry_year).trim() === ''
                        ? null
                        : Number(edu.entry_year);
                const graduationYear =
                    edu.graduation_year === undefined || edu.graduation_year === null || String(edu.graduation_year).trim() === ''
                        ? null
                        : Number(edu.graduation_year);

                await connection.query(
                    'INSERT INTO education_history (student_id, level, school_name, entry_month, entry_year, graduation_month, graduation_year) VALUES (?, ?, ?, ?, ?, ?, ?)',
                    [
                        studentId,
                        edu.level,
                        edu.school_name && edu.school_name.trim() !== '' ? edu.school_name : null,
                        edu.entry_month && edu.entry_month.trim() !== '' ? edu.entry_month : null,
                        entryYear,
                        edu.graduation_month && edu.graduation_month.trim() !== '' ? edu.graduation_month : null,
                        graduationYear
                    ]
                );
            }
        }

        // 5. Insert Family Data
        await connection.query(
            `INSERT INTO student_families (
                student_id, father_name, mother_name, father_job, mother_job, 
                father_status, mother_status, parent_address, guardian_name, 
                guardian_address, guardian_phone
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                studentId, body.father_name, body.mother_name, body.father_job, body.mother_job,
                body.father_status, body.mother_status, body.parent_address, body.guardian_name,
                body.guardian_address, body.guardian_phone
            ]
        );

        // 6. Insert Documents
        await connection.query(
            `INSERT INTO student_documents (
                student_id, diploma_path, ktp_path, family_card_path, 
                birth_certificate_path, health_certificate_path, consent_letter_path
            ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                studentId,
                files['diploma'] ? files['diploma'][0].path : null,
                files['ktp'] ? files['ktp'][0].path : null,
                files['family_card'] ? files['family_card'][0].path : null,
                files['birth_certificate'] ? files['birth_certificate'][0].path : null,
                files['health_certificate'] ? files['health_certificate'][0].path : null,
                files['consent_letter'] ? files['consent_letter'][0].path : null
            ]
        );

        // 7. Generate QR Code
        const qrData = JSON.stringify({
            id: studentId,
            reg: regNumber,
            name: body.full_name
        });
        const qrPath = `uploads/qr-${studentId}.png`;
        await QRCode.toFile(qrPath, qrData);
        
        await connection.query('UPDATE students SET qr_code_path = ? WHERE id = ?', [qrPath, studentId]);

        await connection.commit();
        res.status(201).json({ message: 'Registration successful', registration_number: regNumber, qr_code: qrPath });

    } catch (error) {
        await connection.rollback();
        console.error('Registration error:', error);
        res.status(500).json({ message: error.message || 'Registration failed' });
    } finally {
        connection.release();
    }
};

exports.getExportData = async (req, res) => {
    try {
        const [students] = await db.query('SELECT * FROM students ORDER BY created_at DESC');
        const [education] = await db.query('SELECT * FROM education_history');
        const [families] = await db.query('SELECT * FROM student_families');
        const [documents] = await db.query('SELECT * FROM student_documents');
        
        // Map education and families to students
        const fullData = students.map(student => {
            const studentEdu = education.filter(e => e.student_id === student.id);
            const studentFamily = families.find(f => f.student_id === student.id) || {};
            const studentDocs = documents.find(d => d.student_id === student.id) || {};
            
            return {
                ...studentDocs, // Spread documents first so student ID takes precedence
                ...student,
                education: studentEdu,
                family: studentFamily
            };
        });

        res.json(fullData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.checkNikExists = async (req, res) => {
    try {
        const { nik, excludeId } = req.query;
        if (!nik || String(nik).length !== 16) {
            return res.status(400).json({ exists: false, message: 'NIK harus 16 digit sesuai KTP' });
        }
        
        let query = 'SELECT id FROM students WHERE nik = ?';
        const params = [nik];

        if (excludeId) {
            query += ' AND id != ?';
            params.push(excludeId);
        }

        const [rows] = await db.query(query, params);
        if (rows.length > 0) {
            return res.json({ exists: true, message: 'NIK sudah terdaftar. NIK tidak boleh sama.' });
        }
        return res.json({ exists: false });
    } catch (error) {
        res.status(500).json({ exists: false, message: error.message });
    }
};

exports.checkEmailExists = async (req, res) => {
    try {
        const { email, excludeId } = req.query;
        if (!email) {
            return res.status(400).json({ exists: false, message: 'Email harus diisi' });
        }

        let query = 'SELECT id FROM students WHERE email = ?';
        const params = [email];

        if (excludeId) {
            query += ' AND id != ?';
            params.push(excludeId);
        }

        const [rows] = await db.query(query, params);
        if (rows.length > 0) {
            return res.json({ exists: true, message: 'Email sudah terdaftar.' });
        }
        return res.json({ exists: false });
    } catch (error) {
        res.status(500).json({ exists: false, message: error.message });
    }
};

exports.getAllStudents = async (req, res) => {
    try {
        const [students] = await db.query('SELECT * FROM students ORDER BY created_at DESC');
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getStudentById = async (req, res) => {
    try {
        const [student] = await db.query('SELECT * FROM students WHERE id = ?', [req.params.id]);
        if (student.length === 0) return res.status(404).json({ message: 'Student not found' });
        
        const [education] = await db.query('SELECT * FROM education_history WHERE student_id = ?', [req.params.id]);
        const [family] = await db.query('SELECT * FROM student_families WHERE student_id = ?', [req.params.id]);
        const [documents] = await db.query('SELECT * FROM student_documents WHERE student_id = ?', [req.params.id]);

        res.json({ ...student[0], education, family: family[0], documents: documents[0] });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateStudentStatus = async (req, res) => {
    const { status, admin_notes } = req.body;
    const userRole = req.user.role;

    // Role-based validation
    if (userRole === 'STAFF') {
        // Staff can now also accept or reject students
        const allowedStatuses = ['Terverifikasi', 'Menunggu Verifikasi', 'Diterima', 'Ditolak'];
        if (!allowedStatuses.includes(status)) {
             return res.status(403).json({ message: 'Staff can only verify, accept or reject students' });
        }
    } else if (userRole === 'KEPALA_LPK') {
        if (status !== 'Diterima' && status !== 'Ditolak') {
             return res.status(403).json({ message: 'Kepala LPK can only accept or reject students' });
        }
    }

    try {
        await db.query('UPDATE students SET status = ?, admin_notes = ? WHERE id = ?', [status, admin_notes, req.params.id]);
        res.json({ message: 'Status updated' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.exportStudentsExcel = async (req, res) => {
    try {
        const [students] = await db.query(`
            SELECT s.*, 
            e.level as edu_level, e.school_name, e.graduation_year,
            sf.father_name, sf.mother_name, sf.guardian_name
            FROM students s
            LEFT JOIN education_history e ON s.id = e.student_id
            LEFT JOIN student_families sf ON s.id = sf.student_id
            ORDER BY s.created_at DESC
        `);

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Students');

        worksheet.columns = [
            { header: 'No. Reg', key: 'registration_number', width: 20 },
            { header: 'Nama Lengkap', key: 'full_name', width: 30 },
            { header: 'NIK', key: 'nik', width: 20 },
            { header: 'Status', key: 'status', width: 15 },
            { header: 'No HP', key: 'phone_number', width: 15 },
            { header: 'Email', key: 'email', width: 25 },
            { header: 'Pendidikan Terakhir', key: 'edu_level', width: 15 },
            { header: 'Nama Sekolah', key: 'school_name', width: 25 },
            { header: 'Nama Ayah', key: 'father_name', width: 20 },
            { header: 'Tanggal Daftar', key: 'created_at', width: 20 },
        ];

        // Group by student ID to handle multiple education rows if necessary
        // For simplicity, we just dump the rows. If a student has multiple education rows, they will appear multiple times.
        // A better approach would be to fetch students and then fetch education, but this is fine for now.
        
        // However, the join might duplicate rows. Let's act smart.
        // Better: Fetch students, then for each student fetch details?
        // Or just export basic data + latest education.
        
        // Let's stick to a simple query for now to avoid duplicates from Left Join if 1:M
        // We will just export student main data for this version to be safe and clean.
        
        const [studentRows] = await db.query('SELECT * FROM students ORDER BY created_at DESC');

        worksheet.columns = [
            { header: 'No. Reg', key: 'registration_number', width: 20 },
            { header: 'Nama Lengkap', key: 'full_name', width: 30 },
            { header: 'NIK', key: 'nik', width: 20 },
            { header: 'Jenis Kelamin', key: 'gender', width: 15 },
            { header: 'Status', key: 'status', width: 15 },
            { header: 'No HP', key: 'phone_number', width: 15 },
            { header: 'Email', key: 'email', width: 25 },
            { header: 'Alamat', key: 'address', width: 30 },
            { header: 'Tanggal Daftar', key: 'created_at', width: 20 },
        ];

        studentRows.forEach(student => {
            worksheet.addRow(student);
        });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=students.xlsx');

        await workbook.xlsx.write(res);
        res.end();

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

exports.downloadStudentFormPdf = async (req, res) => {
    try {
        const [studentRows] = await db.query('SELECT * FROM students WHERE id = ?', [req.params.id]);
        if (studentRows.length === 0) return res.status(404).json({ message: 'Student not found' });
        
        const s = studentRows[0];
        
        // Fetch related data
        const [education] = await db.query('SELECT * FROM education_history WHERE student_id = ? ORDER BY entry_year ASC', [s.id]);
        const [familyRows] = await db.query('SELECT * FROM student_families WHERE student_id = ?', [s.id]);
        const f = familyRows[0] || {};

        // Create PDF
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([595.28, 841.89]); // A4
        const { width, height } = page.getSize();
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

        const margin = 50;
        let y = height - margin;
        const lineHeight = 15;

        // Header
        page.drawText('LPK DORYOUKU', { x: margin, y, size: 18, font: fontBold, color: rgb(0.89, 0.11, 0.14) });
        y -= 25;
        page.drawText('FORMULIR PENDAFTARAN PESERTA PELATIHAN', { x: margin, y, size: 14, font: fontBold });
        y -= 30;

        // Helper to draw field
        const drawField = (label, value, indent = 0) => {
            page.drawText(label, { x: margin + indent, y, size: 10, font: fontBold });
            page.drawText(': ' + (value || '-'), { x: margin + 150, y, size: 10, font });
            y -= lineHeight;
        };

        // Section A: Data Pribadi
        page.drawText('A. DATA PRIBADI', { x: margin, y, size: 11, font: fontBold, color: rgb(0.2, 0.2, 0.2) });
        y -= 20;
        
        drawField('No. Registrasi', s.registration_number);
        drawField('Nama Lengkap', s.full_name);
        drawField('NIK', s.nik);
        drawField('Jenis Kelamin', s.gender === 'L' ? 'Laki-laki' : 'Perempuan');
        drawField('Tempat, Tgl Lahir', `${s.place_of_birth}, ${new Date(s.date_of_birth).toLocaleDateString('id-ID')}`);
        drawField('Agama', s.religion);
        drawField('Gol. Darah', s.blood_type);
        drawField('Status Pernikahan', s.marital_status);
        drawField('Alamat', s.address);
        drawField('No. HP', s.phone_number);
        drawField('Email', s.email);
        y -= 10;

        // Section B: Data Fisik
        page.drawText('B. DATA FISIK', { x: margin, y, size: 11, font: fontBold, color: rgb(0.2, 0.2, 0.2) });
        y -= 20;
        drawField('Tinggi Badan', s.height ? `${s.height} cm` : '-');
        drawField('Berat Badan', s.weight ? `${s.weight} kg` : '-');
        drawField('Tato / Tindik', `${s.has_tattoo ? 'Ya' : 'Tidak'} / ${s.has_piercing ? 'Ya' : 'Tidak'}`);
        y -= 10;

        // Section C: Data Keluarga
        page.drawText('C. DATA KELUARGA', { x: margin, y, size: 11, font: fontBold, color: rgb(0.2, 0.2, 0.2) });
        y -= 20;
        drawField('Nama Ayah', f.father_name);
        drawField('Pekerjaan Ayah', f.father_job);
        drawField('Nama Ibu', f.mother_name);
        drawField('Pekerjaan Ibu', f.mother_job);
        drawField('Alamat Orang Tua', f.parent_address);
        if (f.guardian_name) {
            y -= 5;
            drawField('Nama Wali', f.guardian_name);
            drawField('Alamat Wali', f.guardian_address);
            drawField('No. HP Wali', f.guardian_phone);
        }
        y -= 10;

        // Section D: Riwayat Pendidikan
        page.drawText('D. RIWAYAT PENDIDIKAN', { x: margin, y, size: 11, font: fontBold, color: rgb(0.2, 0.2, 0.2) });
        y -= 20;
        
        // Table Header
        const colX = [margin, margin + 80, margin + 250, margin + 350, margin + 450];
        page.drawText('Jenjang', { x: colX[0], y, size: 9, font: fontBold });
        page.drawText('Nama Sekolah', { x: colX[1], y, size: 9, font: fontBold });
        page.drawText('Masuk', { x: colX[2], y, size: 9, font: fontBold });
        page.drawText('Lulus', { x: colX[3], y, size: 9, font: fontBold });
        y -= 15;

        education.forEach(edu => {
            page.drawText(edu.level || '-', { x: colX[0], y, size: 9, font });
            page.drawText(edu.school_name || '-', { x: colX[1], y, size: 9, font });
            page.drawText(`${edu.entry_year}`, { x: colX[2], y, size: 9, font });
            page.drawText(`${edu.graduation_year}`, { x: colX[3], y, size: 9, font });
            y -= 15;
        });
        y -= 20;

        // Photo
        if (s.photo_path && fs.existsSync(s.photo_path)) {
             try {
                 const ext = path.extname(s.photo_path).toLowerCase();
                 const photoBytes = fs.readFileSync(s.photo_path);
                 let photoImage;
                 if (ext === '.png') photoImage = await pdfDoc.embedPng(photoBytes);
                 else if (ext === '.jpg' || ext === '.jpeg') photoImage = await pdfDoc.embedJpg(photoBytes);
                 
                 if (photoImage) {
                     page.drawImage(photoImage, {
                         x: width - margin - 100,
                         y: height - margin - 133 - 50, // Top right area
                         width: 100,
                         height: 133,
                     });
                 }
             } catch (e) {
                 console.log("Error embedding photo", e);
             }
        }

        // Signature
        y = 50; // Bottom
        page.drawText(`Dicetak pada: ${new Date().toLocaleDateString('id-ID')}`, { x: margin, y, size: 8, font, color: rgb(0.5, 0.5, 0.5) });
        
        page.drawText('Calon Peserta,', { x: width - margin - 100, y: y + 40, size: 10, font });
        page.drawText('( ........................... )', { x: width - margin - 110, y: y, size: 10, font });

        const pdfBytes = await pdfDoc.save();

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=formulir-${s.registration_number}.pdf`);
        res.send(Buffer.from(pdfBytes));

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

exports.downloadStudentPdf = async (req, res) => {
    try {
        const [studentRows] = await db.query('SELECT * FROM students WHERE id = ?', [req.params.id]);
        if (studentRows.length === 0) return res.status(404).json({ message: 'Student not found' });
        
        const s = studentRows[0];

        // Create PDF (Card Size)
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([600, 400]); // Card size
        const { width, height } = page.getSize();
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

        // Card Design
        page.drawText('KARTU PENDAFTARAN - LPK DORYOUKU', {
            x: 50,
            y: height - 50,
            size: 16,
            font: fontBold,
            color: rgb(0.89, 0.11, 0.14),
        });

        page.drawText(`Nama: ${s.full_name}`, { x: 50, y: height - 100, size: 12, font });
        page.drawText(`No. Reg: ${s.registration_number}`, { x: 50, y: height - 125, size: 12, font });
        page.drawText(`Status: ${s.status}`, { x: 50, y: height - 150, size: 12, font });
        page.drawText(`Tanggal: ${new Date(s.created_at).toLocaleDateString('id-ID')}`, { x: 50, y: height - 175, size: 12, font });

        // Embed QR Code
        if (s.qr_code_path && fs.existsSync(s.qr_code_path)) {
            const qrImageBytes = fs.readFileSync(s.qr_code_path);
            const qrImage = await pdfDoc.embedPng(qrImageBytes);
            page.drawImage(qrImage, {
                x: 400,
                y: height - 200,
                width: 150,
                height: 150,
            });
        }
        
        // Embed Photo
        if (s.photo_path && fs.existsSync(s.photo_path)) {
             try {
                const ext = path.extname(s.photo_path).toLowerCase();
                const photoBytes = fs.readFileSync(s.photo_path);
                let photoImage;
                if (ext === '.png') photoImage = await pdfDoc.embedPng(photoBytes);
                else if (ext === '.jpg' || ext === '.jpeg') photoImage = await pdfDoc.embedJpg(photoBytes);
                
                if (photoImage) {
                    page.drawImage(photoImage, {
                        x: 50,
                        y: height - 320,
                        width: 80,
                        height: 106, 
                    });
                }
             } catch (e) {
                 console.log("Error embedding photo", e);
             }
        }

        const pdfBytes = await pdfDoc.save();

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=card-${s.registration_number}.pdf`);
        res.send(Buffer.from(pdfBytes));

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

exports.exportStudentsSummaryPdf = async (req, res) => {
    try {
        const [students] = await db.query(
            'SELECT registration_number, full_name, nik, gender, status, phone_number, email, address, created_at FROM students ORDER BY created_at DESC'
        );

        const pdfDoc = await PDFDocument.create();
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

        const pageMargin = 40;
        const rowHeight = 18;
        const headerHeight = 24;

        let page = pdfDoc.addPage();
        let { width, height } = page.getSize();
        let y = height - pageMargin;

        const drawHeader = () => {
            page.drawText('Laporan Pendaftar - LPK DORYOUKU', {
                x: pageMargin,
                y,
                size: 16,
                font: fontBold,
                color: rgb(0.89, 0.11, 0.14),
            });
            y -= headerHeight;
            page.drawText(`Total Pendaftar: ${students.length}`, {
                x: pageMargin,
                y,
                size: 10,
                font,
                color: rgb(0.3, 0.3, 0.3),
            });
            y -= headerHeight;

            const headers = ['No', 'No. Reg', 'Nama', 'NIK', 'Status', 'No HP', 'Tanggal'];
            const cols = [30, 100, 230, 330, 410, 470, 530];

            headers.forEach((text, idx) => {
                page.drawText(text, {
                    x: cols[idx],
                    y,
                    size: 9,
                    font: fontBold,
                    color: rgb(0.2, 0.2, 0.2),
                });
            });
            y -= rowHeight;
        };

        drawHeader();

        const cols = [30, 100, 230, 330, 410, 470, 530];

        students.forEach((s, index) => {
            if (y < pageMargin + 40) {
                page = pdfDoc.addPage();
                ({ width, height } = page.getSize());
                y = height - pageMargin;
                drawHeader();
            }

            const genderLabel = s.gender === 'L' ? 'L' : s.gender === 'P' ? 'P' : '-';

            const row = [
                String(index + 1),
                s.registration_number || '',
                s.full_name || '',
                s.nik || '',
                s.status || '',
                s.phone_number || '',
                s.created_at ? new Date(s.created_at).toLocaleDateString('id-ID') : '',
            ];

            row.forEach((text, idx) => {
                page.drawText(text, {
                    x: cols[idx],
                    y,
                    size: 8,
                    font,
                    color: rgb(0.1, 0.1, 0.1),
                });
            });

            y -= rowHeight;
        });

        const pdfBytes = await pdfDoc.save();

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=laporan-pendaftar.pdf');
        res.send(Buffer.from(pdfBytes));
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

// Helper for extracting using multiple patterns
const extractField = (text, patterns) => {
    if (!text) return null;
    for (const pattern of patterns) {
        const match = text.match(pattern);
        if (match && match[1]) {
            return match[1].trim();
        }
    }
    return null;
};

exports.parseDocument = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }

        const filePath = req.file.path;
        const fileExt = path.extname(req.file.originalname).toLowerCase();
        let text = '';

        try {
            if (fileExt === '.xls') {
                try { fs.unlinkSync(filePath); } catch (e) {}
                return res.status(400).json({ success: false, message: 'Format .xls belum didukung. Silakan konversi ke .xlsx' });
            }
            if (fileExt === '.pdf') {
                const dataBuffer = fs.readFileSync(filePath);
                const data = await pdfParse(dataBuffer);
                text = data.text;
            } else if (fileExt === '.docx' || fileExt === '.doc') {
                const result = await mammoth.extractRawText({ path: filePath });
                text = result.value;
            } else if (fileExt === '.xlsx') {
                const workbook = new ExcelJS.Workbook();
                await workbook.xlsx.readFile(filePath);

                const grids = [];
                workbook.eachSheet(sheet => {
                    const grid = [];
                    sheet.eachRow({ includeEmpty: true }, (row) => {
                        const cells = row.values.map((v) => {
                            if (v === null || v === undefined) return '';
                            if (typeof v === 'string') return v.trim();
                            if (typeof v === 'number') return String(v);
                            if (typeof v === 'object') {
                                if (v.text) return String(v.text).trim();
                                if (v.richText) return v.richText.map(rt => rt.text).join('').trim();
                            }
                            return String(v || '').trim();
                        });
                        grid.push(cells);
                        const rowText = cells.filter(Boolean).join(' ');
                        if (rowText) text += rowText + '\n';
                    });
                    grids.push(grid);
                });

                // Structured extraction for the LPK Doryouku template
                const xExtract = {};
                const inGrid = (r, c) => (Array.isArray(grids[r.sheet]) && grids[r.sheet][r.row] && grids[r.sheet][r.row][r.col]) ? grids[r.sheet][r.row][r.col] : '';
                const eachCell = (cb) => {
                    grids.forEach((grid, si) => {
                        grid.forEach((row, ri) => {
                            row.forEach((cell, ci) => cb({ sheet: si, row: ri, col: ci, val: cell }));
                        });
                    });
                };
                const findRightValue = (regex) => {
                    let found = '';
                    grids.forEach(grid => {
                        grid.forEach(row => {
                            row.forEach((cell, idx) => {
                                if (cell && regex.test(cell)) {
                                    for (let k = 1; k <= 4; k++) {
                                        const v = row[idx + k];
                                        if (v && v.trim() && !regex.test(v)) {
                                            if (!found || v.length > found.length) found = v.trim();
                                            break;
                                        }
                                    }
                                }
                            });
                        });
                    });
                    return found || null;
                };
                const findMatch = (regex) => {
                    let m = null;
                    eachCell(({ val }) => {
                        if (m) return;
                        const mm = String(val || '').match(regex);
                        if (mm) m = mm[0];
                    });
                    return m;
                };
                const findAllMatches = (regex) => {
                    const out = [];
                    eachCell(({ val }) => {
                        const mm = String(val || '').match(regex);
                        if (mm) out.push(mm[0]);
                    });
                    return out;
                };

                // full_name: labeled or best ALLCAPS multi-token
                let fullName = findRightValue(/(英文本名|英文氏名|Nama lengkap.*paspor|English Name|英文姓名)/i);
                if (!fullName) {
                    let best = '';
                    eachCell(({ val }) => {
                        const s = String(val || '').trim();
                        if (/[A-Z]{2,}\s+[A-Z]{2,}/.test(s) && s.length > best.length && s.length <= 60) {
                            // avoid KATAKANA line by excluding non-latin characters
                            if (/[\u3040-\u30ff\u3400-\u9fbf]/.test(s)) return;
                            best = s;
                        }
                    });
                    if (best) fullName = best;
                }
                if (fullName) xExtract.full_name = fullName;

                // email
                const emailCell = findMatch(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,7}/);
                if (emailCell) xExtract.email = emailCell;

                // phone (prefer starting with 08 or +62)
                const phones = findAllMatches(/(?:\+62|62|08)[0-9\s-]{7,}/g);
                if (phones.length) {
                    const normalized = phones.map(p => p.replace(/\D/g, ''));
                    const preferred = normalized.find(p => p.startsWith('08')) || normalized.find(p => p.startsWith('62'));
                    xExtract.phone_number = preferred || normalized[0];
                }

                // place of birth
                const pob = findRightValue(/(Tempat Lahir|出生地)/i);
                if (pob) xExtract.place_of_birth = pob;

                let dob = null;
                const yearRe = /\b(19[5-9]\d|20[0-2]\d)\b/;
                const monthRe = /\b(1[0-2]|0?[1-9])\b/;
                const dayRe = /\b(3[01]|[12][0-9]|0?[1-9])\b/;

                const tryBuildDob = (y, m, d) => {
                    const yy = String(y || '').match(yearRe)?.[0];
                    const mmRaw = String(m || '').match(monthRe)?.[0];
                    const ddRaw = String(d || '').match(dayRe)?.[0];
                    if (!yy || !mmRaw || !ddRaw) return null;
                    const mm = String(Number(mmRaw));
                    const dd = String(Number(ddRaw));
                    return `${dd}-${mm}-${yy}`;
                };

                const extractDobFromRow = (row) => {
                    if (!row || !row.length) return null;
                    const cells = row.map(v => String(v || '').trim());

                    const rowText = cells.join(' ');
                    const mFull = rowText.match(/\b(19[5-9]\d|20[0-2]\d)\b\s*(?:年)?\s*\b(1[0-2]|0?[1-9])\b\s*(?:月)?\s*\b(3[01]|[12][0-9]|0?[1-9])\b\s*(?:日)?/);
                    if (mFull) {
                        const built = tryBuildDob(mFull[1], mFull[2], mFull[3]);
                        if (built) return built;
                    }

                    let labelIdx = -1;
                    for (let i = 0; i < cells.length; i++) {
                        if (/(Tanggal lahir|生年月日)/i.test(cells[i])) {
                            labelIdx = i;
                            break;
                        }
                    }
                    const start = Math.max(0, (labelIdx === -1 ? 0 : labelIdx) - 2);
                    const end = Math.min(cells.length - 1, (labelIdx === -1 ? cells.length - 1 : labelIdx + 20));

                    let yearIdx = -1;
                    for (let i = start; i <= end; i++) {
                        if (yearRe.test(cells[i])) {
                            yearIdx = i;
                            break;
                        }
                    }
                    if (yearIdx === -1) return null;

                    let monthIdx = -1;
                    for (let i = yearIdx + 1; i <= Math.min(yearIdx + 6, end); i++) {
                        if (monthRe.test(cells[i])) {
                            monthIdx = i;
                            break;
                        }
                    }
                    if (monthIdx === -1) {
                        for (let i = yearIdx - 1; i >= Math.max(start, yearIdx - 6); i--) {
                            if (monthRe.test(cells[i])) {
                                monthIdx = i;
                                break;
                            }
                        }
                    }
                    if (monthIdx === -1) return null;

                    let dayIdx = -1;
                    for (let i = monthIdx + 1; i <= Math.min(monthIdx + 6, end); i++) {
                        if (dayRe.test(cells[i])) {
                            dayIdx = i;
                            break;
                        }
                    }
                    if (dayIdx === -1) {
                        for (let i = monthIdx - 1; i >= Math.max(start, monthIdx - 6); i--) {
                            if (dayRe.test(cells[i])) {
                                dayIdx = i;
                                break;
                            }
                        }
                    }
                    if (dayIdx === -1) return null;

                    return tryBuildDob(cells[yearIdx], cells[monthIdx], cells[dayIdx]);
                };

                grids.forEach(grid => {
                    if (dob) return;
                    grid.forEach(row => {
                        if (dob) return;
                        const rowText = row.join(' ');
                        if (!/(Tanggal lahir|生年月日)/i.test(rowText)) return;
                        const built = extractDobFromRow(row);
                        if (built) dob = built;
                    });
                });

                if (!dob) {
                    const dobLabelVal = findRightValue(/(Tanggal lahir|生年月日)/i);
                    if (dobLabelVal) {
                        const m = String(dobLabelVal).match(/\b(19[5-9]\d|20[0-2]\d)\b[^\d]+(1[0-2]|0?[1-9])[^\d]+(3[01]|[12][0-9]|0?[1-9])\b/);
                        if (m) dob = tryBuildDob(m[1], m[2], m[3]);
                    }
                }

                if (dob) xExtract.date_of_birth = dob;

                // gender detection
                let gender = null;
                let foundRow = '';
                grids.forEach(grid => {
                    grid.forEach(row => {
                        const rowText = row.join(' ');
                        if (/Seks|Jenis\s*Kelamin/i.test(rowText)) foundRow = rowText;
                    });
                });
                const markRe = /[✔✓☑√■]/;
                if (!gender && foundRow) {
                    if (/Pria/i.test(foundRow) && (!/Wanita/i.test(foundRow) || /Pria.*[✔✓☑√■]/i.test(foundRow))) gender = 'L';
                    else if (/Wanita/i.test(foundRow)) gender = 'P';
                }
                if (!gender) {
                    // fallback: if 'Pria' appears anywhere with a mark nearby
                    grids.forEach(grid => {
                        grid.forEach(row => {
                            row.forEach((cell, i) => {
                                if (/Pria/i.test(cell)) {
                                    if (markRe.test(row[i - 1] || '') || markRe.test(row[i + 1] || '')) gender = 'L';
                                }
                                if (/Wanita/i.test(cell)) {
                                    if (markRe.test(row[i - 1] || '') || markRe.test(row[i + 1] || '')) gender = 'P';
                                }
                            });
                        });
                    });
                }
                if (gender) xExtract.gender = gender;

                // address: choose the longest string near labels
                const addr = findRightValue(/(Alamat sekarang|Domisili hukum|住所|Alamat)/i);
                if (addr && addr.length >= 10) xExtract.address = addr;

                // Helper to safely get string from potentially complex Excel cell values (RichText, Hyperlink, etc.)
                const getStringFromCell = (cell) => {
                    if (cell === null || cell === undefined) return '';
                    if (typeof cell === 'object') {
                        // Handle Rich Text
                        if (cell.richText && Array.isArray(cell.richText)) {
                            return cell.richText.map(rt => rt.text).join('');
                        }
                        // Handle Hyperlink
                        if (cell.text && cell.hyperlink) {
                            return cell.text;
                        }
                        // Handle other objects (like formula result sometimes)
                        if (cell.result !== undefined) {
                            return String(cell.result);
                        }
                        // Fallback for other objects
                        return String(cell); // likely [object Object] but worth a shot if .toString() is overridden
                    }
                    return String(cell);
                };

                // education: detect SD/SMP/SMA/SMK rows
                const parseYear = (raw) => {
                    const s = getStringFromCell(raw);
                    // Allow years from 1950 to 2059
                    const m = s.match(/\b(19[5-9]\d|20[0-5]\d)\b/);
                    return m ? m[1] : null;
                };
                const parseMonth = (raw) => {
                    let s = getStringFromCell(raw).trim();
                    if (!s) return null;
                    
                    // Optimization: if text is very long (likely an address or description), ignore it to avoid false positives
                    if (s.length > 50) return null;

                    // 1. Numeric check (strict 1-12)
                    // Match number 1-12 that is standalone
                    const mNum = s.match(/\b(1[0-2]|0?[1-9])\b/);
                    if (mNum) {
                        const n = Number(mNum[1]);
                        if (Number.isFinite(n) && n >= 1 && n <= 12) return String(n);
                    }
                    
                    // 2. Text check with WORD BOUNDARIES (strict)
                    // Avoid matching "MATARAM" as "Mar", "AGUNG" as "Agu", etc.
                    const months = [
                        ['jan', 'januari', 'january', '1'],
                        ['feb', 'februari', 'february', '2'],
                        ['mar', 'maret', 'march', '3'],
                        ['apr', 'april', '4'],
                        ['mei', 'may', '5'],
                        ['jun', 'juni', 'june', '6'],
                        ['jul', 'juli', 'july', '7'],
                        ['aug', 'agu', 'agustus', 'august', '8'],
                        ['sep', 'september', '9'],
                        ['okt', 'oct', 'oktober', 'october', '10'],
                        ['nov', 'november', '11'],
                        ['des', 'dec', 'desember', 'december', '12']
                    ];
                    
                    const lower = s.toLowerCase();
                    for (const group of months) {
                        // Check if any keyword matches as a WHOLE WORD
                        if (group.some(k => new RegExp(`\\b${k}\\b`).test(lower))) {
                            // Return the last item which is the number
                            return group[group.length - 1]; 
                        }
                    }
                    
                    return null;
                };
                const parseYearMonthPairsFromRow = (row) => {
                    const years = [];
                    const months = [];

                    // 1. Collect all Year and Month candidates with their indices
                    row.forEach((cell, idx) => {
                        const cellStr = getStringFromCell(cell);
                        const y = parseYear(cellStr);
                        
                        // If year found, remove it from string to avoid parsing parts of year as month
                        // e.g. "2009" -> "09" (Month 9) which is wrong.
                        // But keep other parts like "2009 6" -> " 6"
                        let remainder = cellStr;
                        if (y) {
                            years.push({ val: y, idx });
                            remainder = cellStr.replace(y, ' '); 
                        }
                        
                        const m = parseMonth(remainder);
                        if (m) months.push({ val: m, idx });
                    });

                    // 2. Explicitly pick Entry and Graduation years by position
                    const sortedYears = years.sort((a, b) => a.idx - b.idx);
                    if (sortedYears.length === 0) return [];
                    const yEntry = sortedYears[0];
                    // Graduation = first year to the RIGHT of entry with different value (prefer different year)
                    let yGrad = sortedYears.find(y => y.idx > yEntry.idx && y.val !== yEntry.val)
                              || sortedYears.find(y => y.idx > yEntry.idx)
                              || sortedYears[1];
                    
                    const pickNearestMonth = (yObj) => {
                        if (!yObj) return null;
                        let best = null;
                        let min = 100;
                        // Prefer months to the right
                        months.forEach(mObj => {
                            const d = mObj.idx - yObj.idx;
                            if (d >= 0 && d <= 10) {
                                if (d < min) { min = d; best = mObj; }
                            }
                        });
                        // If none to the right, allow small look-behind with penalty
                        if (!best) {
                            months.forEach(mObj => {
                                const d = yObj.idx - mObj.idx;
                                if (d > 0 && d <= 5) {
                                    const score = d + 0.5;
                                    if (score < min) { min = score; best = mObj; }
                                }
                            });
                        }
                        return best ? best.val : null;
                    };
                    
                    const entry = { year: yEntry.val, month: pickNearestMonth(yEntry), idx: yEntry.idx };
                    const grad  = yGrad ? { year: yGrad.val, month: pickNearestMonth(yGrad), idx: yGrad.idx } : { year: null, month: null, idx: Number.MAX_SAFE_INTEGER };
                    
                    return [entry, grad].sort((a, b) => a.idx - b.idx);
                };
                const pickSchoolNameFromRow = (row) => {
                    const candidates = row
                        .map(v => getStringFromCell(v).trim())
                        .filter(v => v && v.length >= 3)
                        .filter(v => !/[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff]/.test(v))
                        .filter(v => !/(Sekolah|school|Alamat|address|Masuk|Lulus|Tahun|Bulan|年|月|Latar|belakang|pendidikan|Education|History|Riwayat|Name|Nama|perguruan\s*tinggi\s*junior|sertifikat|certificate|magang)/i.test(v));
                    
                    // Priority 1: Contains School Keywords
                    const preferred = candidates.find(v => /(SDN|SMPN|SMKN|SMAN|SD\b|SMP\b|SMA\b|SMK\b|MI\b|MTS|MTs|Universitas|University|Politeknik|Institut)/i.test(v));
                    if (preferred) return preferred;
                    
                    // Priority 2: Longest string remaining (likely the school name if no keyword)
                    let best = '';
                    candidates.forEach(v => {
                        if (v.length > best.length && v.length <= 80) best = v;
                    });
                    return best || '';
                };
                const detectLevelFromRowText = (rowText) => {
                    const t = rowText || '';
                    if (/SDN|SD\/MI|Sekolah dasar|\bSD\b/i.test(t)) return 'SD/MI';
                    if (/SMP|MTS|MTs|menengah pertama/i.test(t)) return 'SMP/MTS';
                    if (/SMA|SMK|menengah atas|Sekolah tinggi/i.test(t)) {
                        if (/sertifikat|certificate|magang/i.test(t)) return null;
                        return 'SMA/SMK';
                    }
                    if (/\bD3\b|\bS1\b|Universitas|University/i.test(t)) {
                        if (!/\b(19[5-9]\d|20[0-2]\d)\b/.test(t)) return null;
                        if (/perguruan\s*tinggi\s*junior/i.test(t)) return null;
                        return 'D3/S1';
                    }
                    return null;
                };

                const eduRows = [];
                grids.forEach(grid => {
                    grid.forEach(row => {
                        const rowText = row.join(' ');
                        const level = detectLevelFromRowText(rowText);
                        if (!level) return;

                        const pairs = parseYearMonthPairsFromRow(row);
                        const entry = pairs[0] || {};
                        const grad = pairs[1] || {};
                        const schoolName = pickSchoolNameFromRow(row);

                        if (level === 'D3/S1' && !entry.year && !grad.year) return;
                        if (!schoolName && !entry.year && !grad.year) return;
                        eduRows.push({
                            level,
                            school_name: schoolName || '',
                            entry_month: entry.month || '',
                            entry_year: entry.year || '',
                            graduation_month: grad.month || '',
                            graduation_year: grad.year || ''
                        });
                    });
                });

                if (eduRows.length) {
                    const byLevel = {};
                    eduRows.forEach(e => {
                        if (!byLevel[e.level] || (e.school_name && e.school_name.length > (byLevel[e.level].school_name || '').length)) {
                            byLevel[e.level] = e;
                        }
                    });
                    xExtract.education = Object.values(byLevel);
                }

                // Family Extraction
                let fatherName = '', motherName = '', fatherJob = '', motherJob = '';
                let familyHeaderRowIndex = -1;
                let familyGridIndex = -1;

                // Find "Keluarga" section - Use Scoring System to pick the BEST candidate
                // This avoids picking up "Family" in essay titles/text.
                let bestCandidate = { score: -1, rIdx: -1, gIdx: -1 };

                grids.forEach((grid, gIdx) => {
                    grid.forEach((row, rIdx) => {
                        const rowText = row.join(' ');
                        // Only consider if it contains "Keluarga" or similar
                        if (/Keluarga|Family|家族/i.test(rowText) && rowText.length < 100) {
                            let score = 0;
                            // Check next 5 rows for confirming signals
                            for (let k = 1; k <= 5; k++) {
                                const nextRow = grid[rIdx + k];
                                if (nextRow) {
                                    const nextRowText = nextRow.join(' ').toLowerCase();
                                    // Header keywords (High score)
                                    if (/nama|name|氏名/.test(nextRowText)) score += 10;
                                    if (/hubungan|relation|続柄/.test(nextRowText)) score += 10;
                                    if (/pekerjaan|job|occupation|職業/.test(nextRowText)) score += 10;
                                    // Data keywords (Medium score)
                                    if (/ayah|father|dad|bapak|父/.test(nextRowText)) score += 5;
                                    if (/ibu|mother|mom|mamak|母/.test(nextRowText)) score += 5;
                                }
                            }
                            
                            if (score > bestCandidate.score) {
                                bestCandidate = { score, rIdx, gIdx };
                            }
                        }
                    });
                });

                if (bestCandidate.score > 0) {
                    familyHeaderRowIndex = bestCandidate.rIdx;
                    familyGridIndex = bestCandidate.gIdx;
                } else {
                    // Fallback to simple search if no strong candidate found
                    // But be careful not to pick essay titles if possible
                    grids.forEach((grid, gIdx) => {
                        grid.forEach((row, rIdx) => {
                            const rowText = row.join(' ');
                            if (/Keluarga|Family|家族/i.test(rowText) && familyHeaderRowIndex === -1) {
                                familyHeaderRowIndex = rIdx;
                                familyGridIndex = gIdx;
                            }
                        });
                    });
                }

                if (familyHeaderRowIndex !== -1 && familyGridIndex !== -1) {
                    const grid = grids[familyGridIndex];
                    let nameColIdx = -1, relationColIdx = -1, jobColIdx = -1;
                    
                    // Search for headers up to 5 rows down from section title
                    let headerFound = false;
                    for (let i = familyHeaderRowIndex; i < Math.min(familyHeaderRowIndex + 5, grid.length); i++) {
                        const row = grid[i];
                        row.forEach((cell, cIdx) => {
                            const val = String(cell || '').toLowerCase();
                            if (/nama|name|氏名/i.test(val)) nameColIdx = cIdx;
                            if (/hubungan|relation|続柄/i.test(val)) relationColIdx = cIdx;
                            if (/pekerjaan|job|occupation|職業/i.test(val)) jobColIdx = cIdx;
                        });
                        
                        if (nameColIdx !== -1) {
                            headerFound = true;
                            // Found headers, now process data rows below this header row
                            let dataRowStart = i + 1;
                            let fatherFound = false;
                            let motherFound = false;
                            const candidates = [];

                            // Helper to get value with fuzzy column matching (check neighbors)
                            const getValue = (rowArr, idx) => {
                                if (idx === -1 || !rowArr) return '';
                                const val = String(rowArr[idx] || '').trim();
                                if (val && val.length > 1) return val;
                                // Try neighbors if main is empty/short
                                const left = String(rowArr[idx - 1] || '').trim();
                                if (left && left.length > 1) return left;
                                const right = String(rowArr[idx + 1] || '').trim();
                                if (right && right.length > 1) return right;
                                return '';
                            };

                            // Collect valid rows first
                            for (let j = dataRowStart; j < Math.min(dataRowStart + 10, grid.length); j++) {
                                const dataRow = grid[j];
                                const name = getValue(dataRow, nameColIdx);
                                let relation = getValue(dataRow, relationColIdx);
                                let job = getValue(dataRow, jobColIdx);

                                // If job is empty, try Smart Row Scan (inline logic)
                                if (!job || job.length < 3) {
                                    const hasJapanese = (str) => /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff]/.test(str);
                                    const isRelationLabel = (s) => /^(ayah|father|dad|bapak|父|ibu|mother|mom|mamak|母)$/i.test(s);
                                    const vals = dataRow.map(v => String(v || '').trim())
                                                .filter(v => v.length > 2 && !/\b\d{4}\b/.test(v) && !isRelationLabel(v) && !hasJapanese(v));
                                    
                                    if (vals.length > 0) {
                                        const jobIdx = vals.findIndex(v => /karyawan|swasta|pns|petani|guru|dokter|buruh|wiraswasta|ibu|rumah|tangga|IRT|pekerjaan|job|pedagang|sopir|nelayan/i.test(v));
                                        if (jobIdx !== -1) {
                                            const candidateJob = vals[jobIdx];
                                            if (candidateJob !== name) job = candidateJob;
                                        } else if (vals.length > 1) {
                                            if (vals[1] !== name) job = vals[1];
                                        }
                                    }
                                }

                                // If relation column is empty, scan the whole row for keywords
                                if (!relation) {
                                    const rowText = dataRow.join(' ').toLowerCase();
                                    if (/ayah|father|dad|bapak|父/i.test(rowText)) relation = 'Ayah';
                                    else if (/ibu|mother|mom|mamak|母/i.test(rowText)) relation = 'Ibu';
                                }

                                if (name && name.length > 2) {
                                    candidates.push({ name, relation, job });
                                }
                            }

                            // Try to identify by relation text first
                            candidates.forEach(cand => {
                                const rel = cand.relation.toLowerCase();
                                if (/ayah|father|dad|bapak|父/i.test(rel)) {
                                    fatherName = cand.name;
                                    fatherJob = cand.job;
                                    fatherFound = true;
                                } else if (/ibu|mother|mom|mamak|母/i.test(rel)) {
                                    motherName = cand.name;
                                    motherJob = cand.job;
                                    motherFound = true;
                                }
                            });

                            // Fallback: Use position (Row 1 = Father, Row 2 = Mother)
                            // Only use position 0 for Father if it wasn't identified as Mother
                            if (!fatherFound && candidates.length > 0) {
                                if (candidates[0].name !== motherName) {
                                    fatherName = candidates[0].name;
                                    fatherJob = candidates[0].job;
                                }
                            }
                            // Only use position 1 for Mother if it wasn't identified as Father
                            if (!motherFound && candidates.length > 1) {
                                if (candidates[1].name !== fatherName) {
                                    motherName = candidates[1].name;
                                    motherJob = candidates[1].job;
                                }
                            }
                            
                            break; // Headers found and processed
                        }
                    }

                            // SUPER FALLBACK: If headers were NOT found, try to extract based on row position relative to "Keluarga"
                    if (!headerFound) {
                        // Assuming Row + 1 is header, Row + 2 is Father, Row + 3 is Mother
                        // Or maybe Row + 1 is Father directly? Let's check Row + 1 for "Nama"
                        let dataStart = familyHeaderRowIndex + 1;
                        const potentialHeaderRow = grid[dataStart];
                        if (potentialHeaderRow && /nama|name|氏名/i.test(potentialHeaderRow.join(' '))) {
                            dataStart++; // Skip header row
                        }

                        // Helper to extract clean name and job from a row
                        const extractFromRow = (r) => {
                            if (!r) return { name: '', job: '' };
                            // Remove empty, short strings, and dates. Also exclude common labels.
                            // CRITICAL: Exclude strings containing Japanese characters (Hiragana/Katakana/Kanji) to avoid capturing essays.
                            // Assuming Names and Jobs are in Latin script (Indonesian/English).
                            const hasJapanese = (str) => /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff]/.test(str);
                            // Strict check for relation labels to avoid filtering "Ibu Rumah Tangga"
                            const isRelationLabel = (s) => /^(ayah|father|dad|bapak|父|ibu|mother|mom|mamak|母)$/i.test(s);
                            
                            const vals = r.map(v => String(v || '').trim())
                                          .filter(v => v.length > 2 && !/\b\d{4}\b/.test(v) && 
                                                       !isRelationLabel(v) &&
                                                       !hasJapanese(v));
                            
                            if (vals.length > 0) {
                                // Try to find job keywords
                                const jobIdx = vals.findIndex(v => /karyawan|swasta|pns|petani|guru|dokter|buruh|wiraswasta|ibu|rumah|tangga|IRT|pekerjaan|job|pedagang|sopir|nelayan/i.test(v));
                                let j = '';
                                let n = vals[0];
                                
                                if (jobIdx !== -1) {
                                    j = vals[jobIdx];
                                    // If job is the first item, maybe name is second?
                                    if (jobIdx === 0 && vals.length > 1) n = vals[1];
                                    else if (jobIdx !== 0) n = vals[0];
                                } else {
                                    // No job keyword, assume 2nd item is job if exists
                                    // HEURISTIC: Name usually comes first.
                                    if (vals.length > 1) j = vals[1];
                                }
                                return { name: n, job: j };
                            }
                            return { name: '', job: '' };
                        };

                        const fData = extractFromRow(grid[dataStart]);
                        if (fData.name) fatherName = fData.name;
                        if (fData.job) fatherJob = fData.job;

                        const mData = extractFromRow(grid[dataStart + 1]);
                        if (mData.name) motherName = mData.name;
                        if (mData.job) motherJob = mData.job;
                    }
                }

                // Post-Processing: Job Recovery Strategy
                // If we found the Name but missed the Job (due to column offset, merged cells, etc.),
                // scan the entire grid for the row containing the Name and pick the best Job candidate.
                const recoverJob = (targetName) => {
                    if (!targetName || targetName.length < 3) return '';
                    let foundJob = '';
                    
                    grids.forEach(grid => {
                        if (foundJob) return;
                        grid.forEach(row => {
                            if (foundJob) return;
                            
                            // Check if this row contains the target name
                            const rowStr = row.join(' ').toLowerCase();
                            if (rowStr.includes(targetName.toLowerCase())) {
                                // Found the row! Now analyze it.
                                const vals = row.map(v => String(v || '').trim())
                                    .filter(v => v.length > 2 && !/\b\d{4}\b/.test(v) && 
                                                 !/^(ayah|father|dad|bapak|父|ibu|mother|mom|mamak|母)$/i.test(v) &&
                                                 !/[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff]/.test(v)); // No Japanese

                                // Filter out the name itself from candidates
                                const candidates = vals.filter(v => !v.toLowerCase().includes(targetName.toLowerCase()));

                                if (candidates.length > 0) {
                                    // 1. Priority: Contains Job Keywords
                                    const jobIdx = candidates.findIndex(v => /karyawan|swasta|pns|petani|guru|dokter|buruh|wiraswasta|ibu|rumah|tangga|IRT|pekerjaan|job|pedagang|sopir|nelayan/i.test(v));
                                    if (jobIdx !== -1) {
                                        foundJob = candidates[jobIdx];
                                    } else {
                                        // 2. Fallback: Longest string (likely the job description)
                                        // Sort by length descending
                                        candidates.sort((a, b) => b.length - a.length);
                                        foundJob = candidates[0];
                                    }
                                }
                            }
                        });
                    });
                    return foundJob;
                };

                if (fatherName && (!fatherJob || fatherJob.length < 3)) {
                    const recovered = recoverJob(fatherName);
                    if (recovered) fatherJob = recovered;
                }
                if (motherName && (!motherJob || motherJob.length < 3)) {
                    const recovered = recoverJob(motherName);
                    if (recovered) motherJob = recovered;
                }

                if (fatherName) xExtract.father_name = fatherName;
                if (motherName) xExtract.mother_name = motherName;
                if (fatherJob) xExtract.father_job = fatherJob;
                if (motherJob) xExtract.mother_job = motherJob;

                // Attach structured extraction into text-based pipeline via a marker
                req._xlsxExtract = xExtract;
            }
        } catch (readError) {
            console.error('File Read Error:', readError);
            // Attempt to clean up even if read failed
            try { fs.unlinkSync(filePath); } catch (e) {}
            return res.status(400).json({ success: false, message: 'Gagal membaca isi file' });
        }

        // Image OCR (.jpg/.jpeg/.png)
        if (!text && (fileExt === '.jpg' || fileExt === '.jpeg' || fileExt === '.png')) {
            if (!Tesseract) {
                try { fs.unlinkSync(filePath); } catch (e) {}
                return res.status(400).json({ success: false, message: 'OCR belum diaktifkan di server' });
            }
            try {
                const result = await Tesseract.recognize(filePath, 'eng');
                text = result.data && result.data.text ? result.data.text : '';
            } catch (ocrErr) {
                console.error('OCR Error:', ocrErr);
            }
        }

        // Cleanup uploaded file
        try {
             fs.unlinkSync(filePath);
        } catch (e) { console.error("Error deleting file", e); }

        // Extract Data using Regex
        const extracted = {};
        
        // 1. NIK (16 digits)
        extracted.nik = extractField(text, [
            /(?:NIK|Nomor Induk Kependudukan|No\.?\s*KTP)\s*[:]\s*(\d{16})/i,
            /\b(\d{16})\b/
        ]);

        // 2. Full Name
        extracted.full_name = extractField(text, [
            /(?:Nama Lengkap|Nama|Name)\s*[:]\s*([a-zA-Z .,']{3,})/i,
            /Name\s*[:]\s*(.*)/i
        ]);

        // 3. NISN (10 digits)
        extracted.nisn = extractField(text, [
            /(?:NISN|Nomor Induk Siswa Nasional)\s*[:]\s*(\d{10})/i,
            /\b(\d{10})\b/
        ]);

        // 4. Email
        extracted.email = extractField(text, [
            /(?:Email|E-mail|Surel)\s*[:]\s*([a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6})/i,
            /([a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6})/
        ]);

        // 5. Phone
        let phone = extractField(text, [
            /(?:No\.?\s*HP|Phone|Telepon|Mobile|WhatsApp|WA)\s*[:]\s*(\d+[\d\s-]*)/i,
            /(?:\+62|62|08)\d{2,}-?\d{3,}-?\d{3,}/
        ]);
        if (phone) extracted.phone_number = phone.replace(/\D/g, '');

        // 6. Birth Place & Date
        const ttlMatch = text.match(/(?:TTL|Tempat[,\/]\s*Tanggal Lahir|Place[,\/]\s*Date of Birth)\s*[:]\s*(.*)/i);
        if (ttlMatch) {
            const ttlPart = ttlMatch[1];
            const parts = ttlPart.split(/,|\//);
            if (parts.length >= 2) {
                extracted.place_of_birth = parts[0].trim();
                const dateMatch = parts[1].match(/(\d{1,2}[-\/\s]\d{1,2}[-\/\s]\d{4})/);
                if (dateMatch) extracted.date_of_birth = dateMatch[1];
            } else {
                extracted.place_of_birth = ttlPart.trim();
            }
        }
        
        if (!extracted.place_of_birth) {
             extracted.place_of_birth = extractField(text, [/(?:Tempat Lahir|Place of Birth)\s*[:]\s*(.*)/i]);
        }
        if (!extracted.date_of_birth) {
             extracted.date_of_birth = extractField(text, [/(?:Tanggal Lahir|Date of Birth)\s*[:]\s*(\d{1,2}[-\/\s]\d{1,2}[-\/\s]\d{4})/i]);
        }

        // 7. Gender
        const genderRaw = extractField(text, [/(?:Jenis Kelamin|Gender|Sex)\s*[:]\s*(.*)/i]);
        if (genderRaw) {
            if (/Laki|Male|Pria|L/i.test(genderRaw)) extracted.gender = 'Laki-laki';
            else if (/Perempuan|Female|Wanita|P/i.test(genderRaw)) extracted.gender = 'Perempuan';
        }

        // 8. Religion
        const religionRaw = extractField(text, [/(?:Agama|Religion)\s*[:]\s*(.*)/i]);
        if (religionRaw) {
            const religions = ['Islam', 'Kristen', 'Katolik', 'Hindu', 'Buddha', 'Konghucu'];
            const match = religions.find(r => new RegExp(r, 'i').test(religionRaw));
            if (match) extracted.religion = match;
        }

        // 9. Address
        extracted.address = extractField(text, [/(?:Alamat|Address|Domisili)\s*[:]\s*(.*)/i]);

        // 10. Previous School
        extracted.previous_school = extractField(text, [/(?:Asal Sekolah|School Origin|Sekolah Asal|Nama Sekolah)\s*[:]\s*(.*)/i]);

        // 11. Parents
        extracted.father_name = extractField(text, [/(?:Nama Ayah|Father's Name)\s*[:]\s*(.*)/i]);
        extracted.mother_name = extractField(text, [/(?:Nama Ibu|Mother's Name)\s*[:]\s*(.*)/i]);
        extracted.father_job = extractField(text, [/(?:Pekerjaan Ayah|Father's Job)\s*[:]\s*(.*)/i]);
        extracted.mother_job = extractField(text, [/(?:Pekerjaan Ibu|Mother's Job)\s*[:]\s*(.*)/i]);

        // Merge Excel structured extraction if present (prefer structured values)
        const merged = Object.assign({}, extracted, req._xlsxExtract || {});
        res.json({ success: true, data: merged });

    } catch (error) {
        console.error('Parse Error:', error);
        res.status(500).json({ success: false, message: 'Failed to parse document' });
    }
};
