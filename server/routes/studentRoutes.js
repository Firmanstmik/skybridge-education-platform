const express = require('express');
const router = express.Router();
const { registerStudent, getAllStudents, getStudentById, updateStudentStatus, downloadStudentPdf, downloadStudentFormPdf, exportStudentsExcel, getExportData, loginStudent, updateStudentData, checkNikExists, checkEmailExists, exportStudentsSummaryPdf, deleteStudent, getStudentStats, parseDocument, uploadPaymentProof, updatePaymentStatus } = require('../controllers/studentController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const cpUpload = upload.fields([
    { name: 'photo', maxCount: 1 },
    { name: 'diploma', maxCount: 1 },
    { name: 'ktp', maxCount: 1 },
    { name: 'family_card', maxCount: 1 },
    { name: 'birth_certificate', maxCount: 1 },
    { name: 'health_certificate', maxCount: 1 },
    { name: 'consent_letter', maxCount: 1 }
]);

router.post('/login', loginStudent);
router.post('/payment-proof', upload.single('payment_proof'), uploadPaymentProof);
router.put('/update/:id', cpUpload, updateStudentData);
router.post('/', cpUpload, registerStudent);
router.get('/check-nik', checkNikExists);
router.get('/check-email', checkEmailExists);
router.get('/', protect, getAllStudents);
router.get('/stats', protect, getStudentStats);
router.get('/export/json', protect, getExportData);
router.get('/export/excel', protect, exportStudentsExcel);
router.get('/export/pdf-summary', protect, exportStudentsSummaryPdf);
router.put('/:id/payment-status', protect, updatePaymentStatus);
router.get('/:id', protect, getStudentById);
router.delete('/:id', protect, deleteStudent);
router.put('/:id/status', protect, updateStudentStatus);
router.get('/:id/pdf', protect, downloadStudentPdf);
router.get('/:id/pdf-form', protect, downloadStudentFormPdf);
router.post('/parse-document', protect, upload.single('document'), parseDocument);

module.exports = router;
