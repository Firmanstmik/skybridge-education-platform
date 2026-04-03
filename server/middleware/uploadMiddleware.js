const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename(req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const checkFileType = (file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const allowedExts = new Set([
        '.jpg', '.jpeg', '.png', '.webp', '.gif', '.jfif', '.heic', '.heif',
        '.pdf', '.doc', '.docx', '.xls', '.xlsx'
    ]);
    const extOk = allowedExts.has(ext);

    const mt = String(file.mimetype || '').toLowerCase();
    const mimeOk =
        mt.startsWith('image/') ||
        mt === 'application/pdf' ||
        /wordprocessingml/.test(mt) ||
        /spreadsheetml/.test(mt) ||
        /msword/.test(mt) ||
        /excel/.test(mt);

    if (extOk || mimeOk || (mt === 'application/octet-stream' && extOk)) return cb(null, true);
    cb(new Error('Images and Documents only!'));
};

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
});

module.exports = upload;
