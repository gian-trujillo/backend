const express = require('express');

const router = express.Router();

const auth = require('../middleware/auth');

const {
  validateUpdateFilm,
} = require('../validators/filmValidators');

const {
  getFilms,
  updateFilm,
} = require('../controllers/filmController');

router.get('/', getFilms);

router.patch('/:id', auth, validateUpdateFilm, updateFilm);

module.exports = router;
