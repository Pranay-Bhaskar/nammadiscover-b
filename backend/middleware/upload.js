const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const path = require('path');

// 1. Cloudinary Setup (Optional)
if (process.env.CLOUDINARY_API_KEY) {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });
}

// 2. Storage Strategy
let storage;

if (process.env.CLOUDINARY_API_KEY) {
    storage = new CloudinaryStorage({
        cloudinary: cloudinary,
        params: {
            folder: 'nammadiscover_videos',
            resource_type: 'video',
            allowed_formats: ['mp4', 'mov', 'webm'],
        },
    });
} else {
    // Local disk storage fallback
    storage = multer.diskStorage({
        destination: (req, file, cb) => {
            const uploadDir = path.join(__dirname, '../public/uploads');
            if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
            cb(null, uploadDir);
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
        },
    });
}

const upload = multer({
    storage: storage,
    limits: { fileSize: 100 * 1024 * 1024 } // 100MB limit
});

module.exports = upload;
