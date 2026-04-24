-- Create Database
CREATE DATABASE IF NOT EXISTS doryouku_db;
USE doryouku_db;

-- Users Table (Admins)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'superadmin') DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Students Table (Main Registration Data)
CREATE TABLE IF NOT EXISTS students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    registration_number VARCHAR(20) UNIQUE, -- Generated: SNIS-YYYY-NIK4-XXXX
    
    -- A. KETERANGAN PRIBADI
    nik VARCHAR(16) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    gender ENUM('Laki-laki', 'Perempuan') NOT NULL,
    place_of_birth VARCHAR(50),
    date_of_birth DATE,
    blood_type VARCHAR(5),
    religion VARCHAR(20),
    address TEXT,
    marital_status VARCHAR(20),
    phone_number VARCHAR(20),
    email VARCHAR(100),
    photo_path VARCHAR(255),
    
    -- E. TEST FISIK
    has_tattoo BOOLEAN DEFAULT FALSE,
    has_piercing BOOLEAN DEFAULT FALSE,
    height DECIMAL(5,2),
    weight DECIMAL(5,2),
    
    -- Status & System
    status ENUM('Menunggu Verifikasi', 'Diterima', 'Ditolak') DEFAULT 'Menunggu Verifikasi',
    admin_notes TEXT,
    qr_code_path VARCHAR(255),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Education History Table (B. RIWAYAT PENDIDIKAN)
CREATE TABLE IF NOT EXISTS education_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT,
    level VARCHAR(20), -- SD/MI, SMP/MTS, SMA/SMK, D3/S1
    school_name VARCHAR(100),
    entry_month VARCHAR(20),
    entry_year INT,
    graduation_month VARCHAR(20),
    graduation_year INT,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- Family Data Table (C. DATA ORANG TUA / WALI)
CREATE TABLE IF NOT EXISTS student_families (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT UNIQUE,
    father_name VARCHAR(100),
    mother_name VARCHAR(100),
    father_job VARCHAR(50),
    mother_job VARCHAR(50),
    father_status VARCHAR(20), -- Hidup/Meninggal
    mother_status VARCHAR(20),
    parent_address TEXT,
    guardian_name VARCHAR(100),
    guardian_address TEXT,
    guardian_phone VARCHAR(20),
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- Documents Table (D. UPLOAD SYARAT)
CREATE TABLE IF NOT EXISTS student_documents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT UNIQUE,
    diploma_path VARCHAR(255), -- Ijazah
    ktp_path VARCHAR(255),
    family_card_path VARCHAR(255), -- KK
    birth_certificate_path VARCHAR(255), -- Akta
    health_certificate_path VARCHAR(255), -- Surat sehat
    consent_letter_path VARCHAR(255), -- Surat kesediaan
    payment_proof_path VARCHAR(255), -- Bukti pembayaran
    payment_status ENUM('Belum Lunas', 'Lunas') NOT NULL DEFAULT 'Belum Lunas',
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- Insert Default Admin (password: admin123) - You should hash this in real app, but for initial setup:
-- In a real scenario, we'd use a script to insert this with a hashed password.
-- For now, we will handle admin creation via a seed script or manual insert with hash.
