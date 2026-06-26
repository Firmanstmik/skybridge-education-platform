const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const db = require('./config/db');

async function migrate() {
  try {
    console.log('Starting payment migration...');

    const [columns] = await db.query('SHOW COLUMNS FROM student_documents');
    const columnNames = columns.map((c) => c.Field);

    if (!columnNames.includes('payment_proof_path')) {
      console.log('Adding payment_proof_path column...');
      await db.query('ALTER TABLE student_documents ADD COLUMN payment_proof_path VARCHAR(255) NULL');
    }

    if (!columnNames.includes('payment_status')) {
      console.log('Adding payment_status column...');
      await db.query(
        "ALTER TABLE student_documents ADD COLUMN payment_status ENUM('Belum Lunas', 'Lunas') NOT NULL DEFAULT 'Belum Lunas'"
      );
    }

    console.log('Payment migration completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Payment migration failed:', error);
    process.exit(1);
  }
}

migrate();
