const express = require('express');
const router = express.Router();
const {
    getPublicPages,
    getPublicPageByKey,
    getPublicBlogs,
    getPublicBlogBySlug,
    getAdminContent,
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

router.get('/admin/all', protect, admin, getAdminContent);
router.put('/pages/:pageKey', protect, admin, updatePageContent);
router.post('/blogs', protect, admin, createBlog);
router.put('/blogs/:id', protect, admin, updateBlog);
router.delete('/blogs/:id', protect, admin, deleteBlog);
router.post('/upload-image', protect, admin, upload.single('image'), uploadContentImage);

module.exports = router;
