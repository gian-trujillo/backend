const path = require('path');
const fs = require('fs');
const multer = require('multer');

const uploadsDirectory = path.join(__dirname, '..', 'uploads', 'promotions');

fs.mkdirSync(uploadsDirectory, { recursive: true });

const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadsDirectory);
  },

  filename(req, file, cb) {
    const extension = path.extname(file.originalname).toLowerCase();
    const uniqueName = `promotion-${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`;

    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(new Error('Only JPG, PNG and WEBP images are allowed'));
  }

  return cb(null, true);
};

const uploadPromotionImage = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 3 * 1024 * 1024,
  },
});

module.exports = uploadPromotionImage;
