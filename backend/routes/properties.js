const express = require('express');
const router = express.Router();
const {
  getProperties,
  getProperty,
  getPropertyBySlug,
  createProperty,
  updateProperty,
  deleteProperty,
  getFeaturedProperties,
  getAgentProperties,
  getMyProperties,
  getSimilarProperties
} = require('../controllers/propertyController');
const { protect, authorize, optionalAuth } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validate');

// Public routes
router.get('/', optionalAuth, getProperties);
router.get('/featured', getFeaturedProperties);
router.get('/slug/:slug', getProperty);
router.get('/agent/:agentId', getAgentProperties);
router.get('/:id', getProperty);
router.get('/:id/similar', getSimilarProperties);

// Protected routes
router.use(protect);

router.get('/dashboard/my-properties', authorize('agent', 'admin'), getMyProperties);
router.post('/', authorize('agent', 'admin'), validate(schemas.createProperty), createProperty);
router.put('/:id', authorize('agent', 'admin'), validate(schemas.updateProperty), updateProperty);
router.delete('/:id', authorize('agent', 'admin'), deleteProperty);

module.exports = router;
