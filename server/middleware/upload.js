const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  // Allow different types depending on the field being uploaded:
  // - Posts use fieldname 'image' and may accept images or mp4 videos
  // - Profile/banner use fieldnames 'profilePicture' and 'bannerImage' and should be images only
  const mimetype = file.mimetype || '';
  const isImage = mimetype.startsWith('image/');
  const isVideoMp4 = mimetype === 'video/mp4';

  // Allow mixed image/video for post uploads (field "image").
  // We treat anything with image/* mimetype as valid, which covers jpg, png, gif, webp, heic, etc.
  if (file.fieldname === 'image') {
    if (isImage || isVideoMp4) {
      return cb(null, true);
    }

    return cb(new Error('Only image files or mp4 video are allowed for post uploads'));
  }

  // Profile & banner should accept any image MIME type (covers HEIC/HEIF, etc.)
  if (file.fieldname === 'profilePicture' || file.fieldname === 'bannerImage') {
    if (isImage) {
      return cb(null, true);
    }

    return cb(new Error('Only image files are allowed for profile or banner uploads'));
  }

  // For any other fields, fall back to image-only by default
  if (isImage) {
    return cb(null, true);
  }

  cb(new Error('Invalid file type'));
};

// Configure multer
const upload = multer({
  storage: storage,
  limits: {
    // Increase to allow reasonably-sized mp4 uploads for posts (e.g. 50MB)
    fileSize: 50 * 1024 * 1024 // 50MB limit
  },
  fileFilter: fileFilter
});

module.exports = upload;
