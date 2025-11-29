const express = require('express');
const router = express.Router();
const {
  getFavorites,
  addFavorite,
  removeFavorite,
  checkFavorite
} = require('../controllers/favoriteController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

router.get('/', getFavorites);
router.post('/:propertyId', addFavorite);
router.delete('/:propertyId', removeFavorite);
router.get('/check/:propertyId', checkFavorite);

module.exports = router;
