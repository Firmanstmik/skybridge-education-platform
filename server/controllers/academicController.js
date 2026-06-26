const db = require('../config/db');

const PACKAGE_LABELS = {
  basic: 'Kelas Basic (Rp 150.000 · 1x/minggu · 1 jam)',
  intensive: 'Kelas Intensif (Rp 1.500.000 · 3x/minggu · 1,5 jam)',
  premium: 'Kelas Premium (Rp 2.500.000 · 5x/minggu · 1,5 jam)',
};

const findStudentByCredentials = async (registration_number, nik) => {
  const [rows] = await db.query(
    'SELECT id, registration_number, full_name, status, course_package FROM students WHERE registration_number = ? AND nik = ? LIMIT 1',
    [registration_number, nik]
  );
  return rows[0] || null;
};

const attachSchedules = async (classes) => {
  if (!classes.length) return [];
  const ids = classes.map((c) => c.id);
  const [schedules] = await db.query(
    `SELECT * FROM academic_schedules WHERE class_id IN (${ids.map(() => '?').join(',')}) ORDER BY FIELD(day_of_week,'Senin','Selasa','Rabu','Kamis','Jumat','Sabtu','Minggu'), start_time`,
    ids
  );
  const [counts] = await db.query(
    `SELECT class_id, COUNT(*) AS enrolled_count FROM student_class_enrollments WHERE status = 'active' AND class_id IN (${ids.map(() => '?').join(',')}) GROUP BY class_id`,
    ids
  );
  const scheduleMap = {};
  schedules.forEach((s) => {
    if (!scheduleMap[s.class_id]) scheduleMap[s.class_id] = [];
    scheduleMap[s.class_id].push(s);
  });
  const countMap = {};
  counts.forEach((c) => { countMap[c.class_id] = c.enrolled_count; });
  return classes.map((cls) => ({
    ...cls,
    package_label: PACKAGE_LABELS[cls.package_type] || cls.package_type,
    schedules: scheduleMap[cls.id] || [],
    enrolled_count: countMap[cls.id] || 0,
  }));
};

exports.getStudentPortal = async (req, res) => {
  try {
    const { registration_number, nik } = req.body;
    const student = await findStudentByCredentials(registration_number, nik);
    if (!student) return res.status(401).json({ message: 'Data siswa tidak ditemukan' });

    const [classes] = await db.query(
      "SELECT * FROM academic_classes WHERE status = 'active' ORDER BY FIELD(package_type,'basic','intensive','premium'), name"
    );
    const classesWithSchedules = await attachSchedules(classes);

    const [enrollments] = await db.query(
      `SELECT e.*, c.name AS class_name, c.package_type, c.instructor_name
       FROM student_class_enrollments e
       JOIN academic_classes c ON c.id = e.class_id
       WHERE e.student_id = ? AND e.status = 'active'
       ORDER BY e.enrolled_at DESC`,
      [student.id]
    );

    const enrolledIds = enrollments.map((e) => e.class_id);
    const enrolledClasses = classesWithSchedules.filter((c) => enrolledIds.includes(c.id));

    res.json({
      student: {
        ...student,
        course_package_label: PACKAGE_LABELS[student.course_package] || null,
      },
      available_classes: classesWithSchedules,
      enrollments,
      enrolled_classes: enrolledClasses,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.enrollStudent = async (req, res) => {
  try {
    const { registration_number, nik, class_id } = req.body;
    const student = await findStudentByCredentials(registration_number, nik);
    if (!student) return res.status(401).json({ message: 'Data siswa tidak ditemukan' });
    if (student.status !== 'Diterima') {
      return res.status(403).json({ message: 'Pendaftaran Anda belum disetujui admin.' });
    }

    const [classes] = await db.query('SELECT * FROM academic_classes WHERE id = ? AND status = ?', [class_id, 'active']);
    if (!classes.length) return res.status(404).json({ message: 'Kelas tidak ditemukan atau tidak aktif' });

    const cls = classes[0];
    if (student.course_package && cls.package_type !== student.course_package) {
      return res.status(400).json({ message: 'Kelas ini tidak sesuai dengan paket yang Anda pilih saat pendaftaran.' });
    }

    const [countRows] = await db.query(
      "SELECT COUNT(*) AS total FROM student_class_enrollments WHERE class_id = ? AND status = 'active'",
      [class_id]
    );
    if (countRows[0].total >= cls.max_capacity) {
      return res.status(400).json({ message: 'Kelas sudah penuh. Silakan pilih kelas lain.' });
    }

    const [existing] = await db.query(
      "SELECT id FROM student_class_enrollments WHERE student_id = ? AND class_id = ? AND status = 'active'",
      [student.id, class_id]
    );
    if (existing.length) {
      return res.status(400).json({ message: 'Anda sudah terdaftar di kelas ini.' });
    }

    await db.query(
      'INSERT INTO student_class_enrollments (student_id, class_id, status) VALUES (?, ?, ?)',
      [student.id, class_id, 'active']
    );

    res.status(201).json({ message: 'Berhasil mendaftar ke kelas' });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'Anda sudah terdaftar di kelas ini.' });
    }
    res.status(500).json({ message: error.message });
  }
};

exports.getAdminClasses = async (req, res) => {
  try {
    const [classes] = await db.query('SELECT * FROM academic_classes ORDER BY created_at DESC');
    const enriched = await attachSchedules(classes);
    res.json(enriched);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createClass = async (req, res) => {
  try {
    const { name, description, package_type, instructor_name, max_capacity, status } = req.body;
    if (!name || !package_type) {
      return res.status(400).json({ message: 'Nama kelas dan paket wajib diisi' });
    }
    const [result] = await db.query(
      'INSERT INTO academic_classes (name, description, package_type, instructor_name, max_capacity, status) VALUES (?, ?, ?, ?, ?, ?)',
      [name, description || null, package_type, instructor_name || null, max_capacity || 30, status || 'active']
    );
    res.status(201).json({ message: 'Kelas berhasil ditambahkan', id: result.insertId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateClass = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, package_type, instructor_name, max_capacity, status } = req.body;
    await db.query(
      'UPDATE academic_classes SET name = ?, description = ?, package_type = ?, instructor_name = ?, max_capacity = ?, status = ? WHERE id = ?',
      [name, description || null, package_type, instructor_name || null, max_capacity || 30, status || 'active', id]
    );
    res.json({ message: 'Kelas berhasil diperbarui' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteClass = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM academic_classes WHERE id = ?', [id]);
    res.json({ message: 'Kelas berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getClassSchedules = async (req, res) => {
  try {
    const { classId } = req.params;
    const [rows] = await db.query(
      'SELECT * FROM academic_schedules WHERE class_id = ? ORDER BY FIELD(day_of_week,\'Senin\',\'Selasa\',\'Rabu\',\'Kamis\',\'Jumat\',\'Sabtu\',\'Minggu\'), start_time',
      [classId]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createSchedule = async (req, res) => {
  try {
    const { class_id, day_of_week, start_time, end_time, meeting_link, room_name, notes } = req.body;
    if (!class_id || !day_of_week || !start_time || !end_time) {
      return res.status(400).json({ message: 'Kelas, hari, jam mulai, dan jam selesai wajib diisi' });
    }
    const [result] = await db.query(
      'INSERT INTO academic_schedules (class_id, day_of_week, start_time, end_time, meeting_link, room_name, notes) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [class_id, day_of_week, start_time, end_time, meeting_link || null, room_name || null, notes || null]
    );
    res.status(201).json({ message: 'Jadwal berhasil ditambahkan', id: result.insertId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const { day_of_week, start_time, end_time, meeting_link, room_name, notes } = req.body;
    await db.query(
      'UPDATE academic_schedules SET day_of_week = ?, start_time = ?, end_time = ?, meeting_link = ?, room_name = ?, notes = ? WHERE id = ?',
      [day_of_week, start_time, end_time, meeting_link || null, room_name || null, notes || null, id]
    );
    res.json({ message: 'Jadwal berhasil diperbarui' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM academic_schedules WHERE id = ?', [id]);
    res.json({ message: 'Jadwal berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAdminEnrollments = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT e.id, e.enrolled_at, e.status AS enrollment_status,
              s.registration_number, s.full_name, s.course_package, s.status AS student_status,
              c.name AS class_name, c.package_type
       FROM student_class_enrollments e
       JOIN students s ON s.id = e.student_id
       JOIN academic_classes c ON c.id = e.class_id
       ORDER BY e.enrolled_at DESC`
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
