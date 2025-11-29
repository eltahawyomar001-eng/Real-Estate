const express = require('express');
const router = express.Router();
const {
  createInquiry,
  getInquiries,
  getMyInquiries,
  getInquiry,
  updateInquiry,
  deleteInquiry
} = require('../controllers/inquiryController');
const { protect, authorize, optionalAuth } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validate');

// Public route (with optional auth)
router.post('/', optionalAuth, validate(schemas.createInquiry), createInquiry);

// Protected routes
router.use(protect);

router.get('/', authorize('admin'), getInquiries);
router.get('/my-inquiries', authorize('agent', 'admin'), getMyInquiries);
router.get('/:id', authorize('agent', 'admin'), getInquiry);
router.put('/:id', authorize('agent', 'admin'), updateInquiry);
router.delete('/:id', authorize('admin'), deleteInquiry);

module.exports = router;
