const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const db = require('./config/db');

async function migrate() {
  try {
    console.log('Starting academic migration...');

    const [studentCols] = await db.query('SHOW COLUMNS FROM students');
    const studentColNames = studentCols.map((c) => c.Field);
    if (!studentColNames.includes('course_package')) {
      console.log('Adding students.course_package...');
      await db.query(
        "ALTER TABLE students ADD COLUMN course_package ENUM('basic','intensive','premium') NULL AFTER status"
      );
    }

    await db.query(`
      CREATE TABLE IF NOT EXISTS academic_classes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        description TEXT,
        package_type ENUM('basic','intensive','premium') NOT NULL,
        instructor_name VARCHAR(100),
        max_capacity INT DEFAULT 30,
        status ENUM('active','inactive') DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS academic_schedules (
        id INT AUTO_INCREMENT PRIMARY KEY,
        class_id INT NOT NULL,
        day_of_week ENUM('Senin','Selasa','Rabu','Kamis','Jumat','Sabtu','Minggu') NOT NULL,
        start_time TIME NOT NULL,
        end_time TIME NOT NULL,
        meeting_link VARCHAR(255),
        room_name VARCHAR(100),
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (class_id) REFERENCES academic_classes(id) ON DELETE CASCADE
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS student_class_enrollments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        student_id INT NOT NULL,
        class_id INT NOT NULL,
        status ENUM('active','completed','cancelled') DEFAULT 'active',
        enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY uniq_student_class (student_id, class_id),
        FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
        FOREIGN KEY (class_id) REFERENCES academic_classes(id) ON DELETE CASCADE
      )
    `);

    const [classCount] = await db.query('SELECT COUNT(*) AS total FROM academic_classes');
    if (classCount[0].total === 0) {
      console.log('Seeding default classes...');
      const seeds = [
        ['Kelas N5 Basic - Pagi', 'Program dasar bahasa Jepang untuk pemula', 'basic', 'Sensei SKYBRIDGE', 25],
        ['Kelas N5 Intensif - Sore', 'Program intensif persiapan JLPT N5', 'intensive', 'Sensei SKYBRIDGE', 20],
        ['Kelas N4 Premium - Full Week', 'Program premium persiapan kerja ke Jepang', 'premium', 'Sensei SKYBRIDGE', 15],
      ];
      for (const seed of seeds) {
        const [result] = await db.query(
          'INSERT INTO academic_classes (name, description, package_type, instructor_name, max_capacity) VALUES (?, ?, ?, ?, ?)',
          seed
        );
        const classId = result.insertId;
        const scheduleMap = {
          basic: [['Senin', '09:00:00', '10:00:00']],
          intensive: [
            ['Senin', '16:00:00', '17:30:00'],
            ['Rabu', '16:00:00', '17:30:00'],
            ['Jumat', '16:00:00', '17:30:00'],
          ],
          premium: [
            ['Senin', '18:00:00', '19:30:00'],
            ['Selasa', '18:00:00', '19:30:00'],
            ['Rabu', '18:00:00', '19:30:00'],
            ['Kamis', '18:00:00', '19:30:00'],
            ['Jumat', '18:00:00', '19:30:00'],
          ],
        };
        const pkg = seed[2];
        for (const [day, start, end] of scheduleMap[pkg]) {
          await db.query(
            'INSERT INTO academic_schedules (class_id, day_of_week, start_time, end_time, room_name) VALUES (?, ?, ?, ?, ?)',
            [classId, day, start, end, 'Ruang Online SKYBRIDGE']
          );
        }
      }
    }

    console.log('Academic migration completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Academic migration failed:', error);
    process.exit(1);
  }
}

migrate();
