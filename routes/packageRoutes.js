const express = require('express');

const router = express.Router();

const auth = require('../middleware/auth');

const {
  validateUpdatePackage,
} = require('../validators/packageValidators');

const {
  getPackages,
  updatePackage,
} = require('../controllers/packageController');

router.get('/', getPackages);

router.patch('/:id', auth, validateUpdatePackage, updatePackage);

module.exports = router;
