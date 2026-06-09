const express = require('express');

const router = express.Router();

const auth = require('../middleware/auth');
const uploadPromotionImage = require('../middleware/uploadPromotionImage');

const {
  validateCreatePromotion,
  validateUpdatePromotion,
  validatePromotionId,
} = require('../validators/promotionValidators');

const {
  getActivePromotions,
  getPromotions,
  createPromotion,
  updatePromotion,
  deletePromotion,
  replacePromotionImage,
  deletePromotionImage,
} = require('../controllers/promotionController');

router.get('/active', getActivePromotions);

router.get('/', auth, getPromotions);

router.post('/', auth, validateCreatePromotion, createPromotion);

router.patch('/:id', auth, validateUpdatePromotion, updatePromotion);

router.delete('/:id', auth, validatePromotionId, deletePromotion);

router.patch(
  '/:id/image',
  auth,
  validatePromotionId,
  uploadPromotionImage.single('image'),
  replacePromotionImage,
);

router.delete('/:id/image', auth, validatePromotionId, deletePromotionImage);

module.exports = router;
