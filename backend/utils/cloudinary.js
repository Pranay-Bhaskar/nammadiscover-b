const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// ── Cloudinary config ─────────────────────────────────────────────────────────
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const isCloudinary = () =>
    !!(process.env.CLOUDINARY_CLOUD_NAME &&
        process.env.CLOUDINARY_API_KEY &&
        process.env.CLOUDINARY_API_SECRET);

// ── Storage engines ────────────────────────────────────────────────────────────
const cloudStorage = new CloudinaryStorage({
    cloudinary,
    params: async (_req, _file) => ({
        folder: 'namma-discover/videos',
        resource_type: 'video',
        allowed_formats: ['mp4', 'mov', 'avi', 'webm', 'mkv'],
        transformation: [{ quality: 'auto' }],
        eager: [
            { width: 1280, height: 720, crop: 'limit', quality: 'auto' },
            { width: 640, height: 360, crop: 'limit', quality: 'auto' },
        ],
        eager_async: true,
    }),
});

const localUploadDir = path.join(__dirname, '..', 'public', 'uploads');
if (!fs.existsSync(localUploadDir)) fs.mkdirSync(localUploadDir, { recursive: true });

const localStorage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, localUploadDir),
    filename: (_req, file, cb) => {
        const ext = path.extname(file.originalname);
        const name = `${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`;
        cb(null, name);
    },
});

const fileFilter = (_req, file, cb) => {
    const allowed = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm', 'video/x-matroska'];
    cb(allowed.includes(file.mimetype) ? null : new Error('Invalid file type. Only video files are allowed.'),
        allowed.includes(file.mimetype));
};

const upload = multer({
    storage: isCloudinary() ? cloudStorage : localStorage,
    fileFilter,
    limits: { fileSize: 500 * 1024 * 1024 }, // 500 MB
});

// ── Helpers ────────────────────────────────────────────────────────────────────
const getThumbnailUrl = (publicId) =>
    cloudinary.url(publicId, {
        resource_type: 'video',
        format: 'jpg',
        transformation: [{ width: 640, height: 360, crop: 'fill', gravity: 'auto' }],
    });

const deleteFromCloudinary = async (publicId) =>
    cloudinary.uploader.destroy(publicId, { resource_type: 'video' });

const toLocalUrl = (req, filename) =>
    `${req.protocol}://${req.get('host')}/uploads/${filename}`;

module.exports = { upload, getThumbnailUrl, deleteFromCloudinary, isCloudinary, toLocalUrl };
