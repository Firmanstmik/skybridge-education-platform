const express = require('express');
const router = express.Router();
const {
    getPublicPages,
    getPublicPageByKey,
    getPublicBlogs,
    getPublicBlogBySlug,
    getPublicSettings,
    getPublicPaymentSettings,
    getAdminContent,
    updateSettings,
    updatePaymentSettings,
    updatePageContent,
    createBlog,
    updateBlog,
    deleteBlog,
    uploadContentImage
} = require('../controllers/contentController');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/pages', getPublicPages);
router.get('/pages/:pageKey', getPublicPageByKey);
router.get('/blogs', getPublicBlogs);
router.get('/blogs/:slug', getPublicBlogBySlug);
router.get('/settings', getPublicSettings);
router.get('/settings/payment', getPublicPaymentSettings);

router.get('/admin/all', protect, admin, getAdminContent);
router.put('/settings', protect, admin, updateSettings);
router.put('/settings/payment', protect, admin, updatePaymentSettings);
router.put('/pages/:pageKey', protect, admin, updatePageContent);
router.post('/blogs', protect, admin, createBlog);
router.put('/blogs/:id', protect, admin, updateBlog);
router.delete('/blogs/:id', protect, admin, deleteBlog);
router.post('/upload-image', protect, admin, upload.single('image'), uploadContentImage);

module.exports = router;
