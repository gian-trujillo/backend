const express = require('express');

const upload = require('../middleware/upload');

const router = express.Router();

const auth = require('../middleware/auth');
const validateMediaFile = require('../middleware/validateMediaFile');

const {
  getGallery,
  protectedTest,
  uploadMedia,
  deleteMedia,
  replaceMedia,
  updateGalleryMetadata,
} = require('../controllers/galleryController');

const {
  validateObjectIdParam,
  validateReplaceMedia,
  validateUploadMedia,
  validateGalleryMetadata,
} = require('../validators/galleryValidators');

router.post('/upload', auth, upload.single('media'), validateMediaFile, validateUploadMedia, uploadMedia);

router.get('/', getGallery);

router.get('/protected', auth, protectedTest);

router.patch('/:id/metadata', auth, validateGalleryMetadata, updateGalleryMetadata);

router.delete('/:id', auth, validateObjectIdParam, deleteMedia);

router.patch('/replace', auth, upload.single('media'), validateMediaFile, validateReplaceMedia, replaceMedia);

module.exports = router;
