const ConnectionRequest = require('../models/ConnectionRequest');
const Notification = require('../models/Notification');
const User = require('../models/User');

// @desc    Send connection request
// @route   POST /api/connections/request/:userId
// @access  Private
exports.sendConnectionRequest = async (req, res) => {
  try {
    const senderId = req.user._id;
    const receiverId = req.params.userId;

    // Check if trying to connect with self
    if (senderId.toString() === receiverId) {
      return res.status(400).json({
        success: false,
        message: 'Cannot send connection request to yourself'
      });
    }

    // Check if receiver exists
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if already connected
    const sender = await User.findById(senderId);
    if (sender.connections.includes(receiverId)) {
      return res.status(400).json({
        success: false,
        message: 'Already connected with this user'
      });
    }

    // Check if request already exists
    const existingRequest = await ConnectionRequest.findOne({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId }
      ]
    });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: 'Connection request already exists'
      });
    }

    // Create connection request
    const connectionRequest = await ConnectionRequest.create({
      sender: senderId,
      receiver: receiverId,
      message: req.body.message || ''
    });

    // Create notification
    await Notification.create({
      recipient: receiverId,
      sender: senderId,
      type: 'connection_request',
      connectionRequest: connectionRequest._id,
      message: `${sender.name} sent you a connection request`
    });

    res.status(201).json({
      success: true,
      message: 'Connection request sent successfully',
      data: connectionRequest
    });
  } catch (error) {
    console.error('Send connection request error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error sending connection request'
    });
  }
};

// @desc    Accept connection request
// @route   PUT /api/connections/accept/:requestId
// @access  Private
exports.acceptConnectionRequest = async (req, res) => {
  try {
    const requestId = req.params.requestId;
    const userId = req.user._id;

    const connectionRequest = await ConnectionRequest.findById(requestId);

    if (!connectionRequest) {
      return res.status(404).json({
        success: false,
        message: 'Connection request not found'
      });
    }

    // Check if user is the receiver
    if (connectionRequest.receiver.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to accept this request'
      });
    }

    if (connectionRequest.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Request already processed'
      });
    }

    // Update request status
    connectionRequest.status = 'accepted';
    await connectionRequest.save();

    // Add to connections for both users
    await User.findByIdAndUpdate(connectionRequest.sender, {
      $addToSet: { connections: connectionRequest.receiver }
    });

    await User.findByIdAndUpdate(connectionRequest.receiver, {
      $addToSet: { connections: connectionRequest.sender }
    });

    // Create notification for sender
    const receiver = await User.findById(userId);
    await Notification.create({
      recipient: connectionRequest.sender,
      sender: userId,
      type: 'connection_accepted',
      message: `${receiver.name} accepted your connection request`
    });

    res.status(200).json({
      success: true,
      message: 'Connection request accepted',
      data: connectionRequest
    });
  } catch (error) {
    console.error('Accept connection request error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error accepting connection request'
    });
  }
};

// @desc    Reject connection request
// @route   PUT /api/connections/reject/:requestId
// @access  Private
exports.rejectConnectionRequest = async (req, res) => {
  try {
    const requestId = req.params.requestId;
    const userId = req.user._id;

    const connectionRequest = await ConnectionRequest.findById(requestId);

    if (!connectionRequest) {
      return res.status(404).json({
        success: false,
        message: 'Connection request not found'
      });
    }

    // Check if user is the receiver
    if (connectionRequest.receiver.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to reject this request'
      });
    }

    if (connectionRequest.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Request already processed'
      });
    }

    // Update request status
    connectionRequest.status = 'rejected';
    await connectionRequest.save();

    res.status(200).json({
      success: true,
      message: 'Connection request rejected',
      data: connectionRequest
    });
  } catch (error) {
    console.error('Reject connection request error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error rejecting connection request'
    });
  }
};

// @desc    Get pending connection requests for logged in user
// @route   GET /api/connections/requests
// @access  Private
exports.getConnectionRequests = async (req, res) => {
  try {
    const userId = req.user._id;

    const requests = await ConnectionRequest.find({
      receiver: userId,
      status: 'pending'
    })
      .populate('sender', 'name profilePicture headline')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests
    });
  } catch (error) {
    console.error('Get connection requests error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching connection requests'
    });
  }
};

// @desc    Withdraw a sent connection request (sender cancels)
// @route   DELETE /api/connections/request/:userId
// @access  Private
exports.withdrawConnectionRequest = async (req, res) => {
  try {
    const senderId = req.user._id;
    const receiverId = req.params.userId;

    const connectionRequest = await ConnectionRequest.findOne({
      sender: senderId,
      receiver: receiverId,
      status: 'pending'
    });

    if (!connectionRequest) {
      return res.status(404).json({
        success: false,
        message: 'No pending connection request found to withdraw'
      });
    }

    // Remove associated notification(s)
    await Notification.deleteMany({
      connectionRequest: connectionRequest._id,
      type: 'connection_request'
    });

    await connectionRequest.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Connection request withdrawn'
    });
  } catch (error) {
    console.error('Withdraw connection request error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error withdrawing connection request'
    });
  }
};

// @desc    Get connection status between two users
// @route   GET /api/connections/status/:userId
// @access  Private
exports.getConnectionStatus = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const targetUserId = req.params.userId;

    // Check if already connected
    const currentUser = await User.findById(currentUserId);
    const isConnected = currentUser.connections.includes(targetUserId);

    if (isConnected) {
      return res.status(200).json({
        success: true,
        status: 'connected'
      });
    }

    // Check for pending request
    const pendingRequest = await ConnectionRequest.findOne({
      $or: [
        { sender: currentUserId, receiver: targetUserId, status: 'pending' },
        { sender: targetUserId, receiver: currentUserId, status: 'pending' }
      ]
    });

    if (pendingRequest) {
      const isPending = pendingRequest.sender.toString() === currentUserId.toString();
      return res.status(200).json({
        success: true,
        status: isPending ? 'pending' : 'received',
        requestId: pendingRequest._id
      });
    }

    res.status(200).json({
      success: true,
      status: 'none'
    });
  } catch (error) {
    console.error('Get connection status error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error checking connection status'
    });
  }
};

// @desc    Remove connection
// @route   DELETE /api/connections/:userId
// @access  Private
exports.removeConnection = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const targetUserId = req.params.userId;

    // Remove from both users' connections
    await User.findByIdAndUpdate(currentUserId, {
      $pull: { connections: targetUserId }
    });

    await User.findByIdAndUpdate(targetUserId, {
      $pull: { connections: currentUserId }
    });

    res.status(200).json({
      success: true,
      message: 'Connection removed successfully'
    });
  } catch (error) {
    console.error('Remove connection error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error removing connection'
    });
  }
};
