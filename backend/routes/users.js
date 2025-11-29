const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getAgents
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validate');

// Public routes
router.get('/agents', getAgents);

// Protected routes
router.use(protect);

router.get('/', authorize('admin'), getUsers);
router.get('/:id', getUser);
router.put('/:id', validate(schemas.updateProfile), updateUser);
router.delete('/:id', authorize('admin'), deleteUser);

module.exports = router;
