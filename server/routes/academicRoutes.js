const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getStudentPortal,
  enrollStudent,
  getAdminClasses,
  createClass,
  updateClass,
  deleteClass,
  getClassSchedules,
  createSchedule,
  updateSchedule,
  deleteSchedule,
  getAdminEnrollments,
} = require('../controllers/academicController');

router.post('/student/portal', getStudentPortal);
router.post('/student/enroll', enrollStudent);

router.get('/admin/classes', protect, getAdminClasses);
router.post('/admin/classes', protect, createClass);
router.put('/admin/classes/:id', protect, updateClass);
router.delete('/admin/classes/:id', protect, deleteClass);
router.get('/admin/classes/:classId/schedules', protect, getClassSchedules);
router.post('/admin/schedules', protect, createSchedule);
router.put('/admin/schedules/:id', protect, updateSchedule);
router.delete('/admin/schedules/:id', protect, deleteSchedule);
router.get('/admin/enrollments', protect, getAdminEnrollments);

module.exports = router;
