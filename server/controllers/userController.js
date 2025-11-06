const User = require('../models/User');
const Post = require('../models/Post');
const path = require('path');
const fs = require('fs');

// @desc    Get user profile
// @route   GET /api/users/:id
// @access  Public
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get user's posts
    const posts = await Post.find({ user: req.params.id })
      .populate('user', 'name email profilePicture headline')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      user,
      posts
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching user profile'
    });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    // Resolve the target user ID. Support both routes:
    // - PUT /api/users/profile  (no :id param)
    // - PUT /api/users/:id      (specific user id)
    const requestedId = req.params.id;
    const userId = (requestedId && requestedId !== 'profile') ? requestedId : req.user._id.toString();

    // If a specific id was provided and it's not the authenticated user's id, forbid the update
    if (requestedId && requestedId !== 'profile' && requestedId !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this profile'
      });
    }

    const { name, headline, location, bio, skills, jobInterests, education, onboardingComplete } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (headline) updateData.headline = headline;
    if (location) updateData.location = location;
    if (bio) updateData.bio = bio;
    if (skills) updateData.skills = JSON.parse(skills);
    if (jobInterests) updateData.jobInterests = JSON.parse(jobInterests);
    if (education) updateData.education = JSON.parse(education);
    if (onboardingComplete !== undefined) updateData.onboardingComplete = onboardingComplete === 'true';

    // Update profile picture if uploaded
    if (req.files && req.files.profilePicture) {
      const user = await User.findById(userId);
      
      // Delete old profile picture if exists and not default
      if (user.profilePicture && !user.profilePicture.includes('placeholder')) {
        const oldImagePath = path.join(__dirname, '../../', user.profilePicture);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      
      updateData.profilePicture = `/uploads/${req.files.profilePicture[0].filename}`;
    }

    // Update banner image if uploaded
    if (req.files && req.files.bannerImage) {
      const user = await User.findById(userId);
      
      // Delete old banner image if exists and not default
      if (user.bannerImage && !user.bannerImage.includes('placeholder')) {
        const oldBannerPath = path.join(__dirname, '../../', user.bannerImage);
        if (fs.existsSync(oldBannerPath)) {
          fs.unlinkSync(oldBannerPath);
        }
      }
      
      updateData.bannerImage = `/uploads/${req.files.bannerImage[0].filename}`;
    }

    // Update resume if uploaded
    if (req.files && req.files.resume) {
      updateData.resumeUrl = `/uploads/${req.files.resume[0].filename}`;
    }

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: user
    });
  } catch (error) {
    console.error('Update user profile error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating profile'
    });
  }
};

// @desc    Get all users
// @route   GET /api/users
// @access  Public
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching users'
    });
  }
};

// @desc    Search users
// @route   GET /api/users/search?q=query
// @access  Public
exports.searchUsers = async (req, res) => {
  try {
    const query = req.query.q;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a search query'
      });
    }

    const users = await User.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
        { headline: { $regex: query, $options: 'i' } }
      ]
    }).select('-password').limit(10);

    res.status(200).json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error searching users'
    });
  }
};
