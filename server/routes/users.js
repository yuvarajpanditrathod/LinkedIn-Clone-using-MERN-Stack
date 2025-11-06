const express = require('express');
const router = express.Router();
const {
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  searchUsers
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public routes
router.get('/', getAllUsers);
router.get('/search', searchUsers);
router.get('/:id', getUserProfile);

// Private routes
// Specific '/profile' route must be defined before the '/:id' route so
// Express doesn't treat 'profile' as an :id param and block authorized updates.
router.put('/profile', protect, upload.fields([
  { name: 'profilePicture', maxCount: 1 },
  { name: 'bannerImage', maxCount: 1 },
  { name: 'resume', maxCount: 1 }
]), updateUserProfile);

router.put('/:id', protect, upload.fields([
  { name: 'profilePicture', maxCount: 1 },
  { name: 'bannerImage', maxCount: 1 },
  { name: 'resume', maxCount: 1 }
]), updateUserProfile);

module.exports = router;
