const express = require('express');
const router = express.Router();
const {
  sendConnectionRequest,
  acceptConnectionRequest,
  rejectConnectionRequest,
  withdrawConnectionRequest,
  getConnectionRequests,
  getConnectionStatus,
  removeConnection
} = require('../controllers/connectionController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.post('/request/:userId', protect, sendConnectionRequest);
router.delete('/request/:userId', protect, withdrawConnectionRequest);
router.put('/accept/:requestId', protect, acceptConnectionRequest);
router.put('/reject/:requestId', protect, rejectConnectionRequest);
router.get('/requests', protect, getConnectionRequests);
router.get('/status/:userId', protect, getConnectionStatus);
router.delete('/:userId', protect, removeConnection);

module.exports = router;
