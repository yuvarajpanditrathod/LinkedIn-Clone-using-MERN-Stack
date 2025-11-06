import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { FaTimes, FaCamera } from 'react-icons/fa';
import './EditProfile.css';

const EditProfile = ({ profile, onClose, onUpdate }) => {
  const { updateUser } = useContext(AuthContext);
  
  const [formData, setFormData] = useState({
    name: profile.name || '',
    headline: profile.headline || '',
    location: profile.location || '',
    bio: profile.bio || ''
  });
  
  const [profilePicture, setProfilePicture] = useState(null);
  const [bannerImage, setBannerImage] = useState(null);
  const [previewProfileImage, setPreviewProfileImage] = useState(profile.profilePicture);
  const [previewBannerImage, setPreviewBannerImage] = useState(profile.bannerImage);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { name, headline, location, bio } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      setPreviewProfileImage(URL.createObjectURL(file));
    }
  };

  const handleBannerImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBannerImage(file);
      setPreviewBannerImage(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', name);
      formDataToSend.append('headline', headline);
      formDataToSend.append('location', location);
      formDataToSend.append('bio', bio);
      
      if (profilePicture) {
        formDataToSend.append('profilePicture', profilePicture);
      }

      if (bannerImage) {
        formDataToSend.append('bannerImage', bannerImage);
      }

      const res = await axios.put(`/api/users/${profile._id}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      updateUser(res.data.user);
      onUpdate(res.data.user);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Update profile error:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content edit-profile-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Edit Profile</h3>
          <button className="modal-close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={onSubmit}>
          <div className="edit-profile-body">
            {/* Banner Image Section */}
            <div className="banner-section">
              <label className="section-label">Banner Image</label>
              <div className="banner-preview" style={{ backgroundImage: `url(${previewBannerImage})` }}>
                <label className="change-banner-btn">
                  <FaCamera />
                  <span>Change Banner</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleBannerImageChange}
                    hidden
                  />
                </label>
              </div>
            </div>

            {/* Profile Picture Section */}
            <div className="profile-picture-section">
              <label className="section-label">Profile Picture</label>
              <div className="profile-picture-preview">
                <img src={previewProfileImage} alt="Profile" />
                <label className="change-picture-btn">
                  <FaCamera />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfileImageChange}
                    hidden
                  />
                </label>
              </div>
              <p className="profile-picture-hint">Click camera icon to change photo</p>
            </div>

            <div className="form-group">
              <label htmlFor="name">Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={onChange}
                required
                minLength="2"
              />
            </div>

            <div className="form-group">
              <label htmlFor="headline">Headline</label>
              <input
                type="text"
                id="headline"
                name="headline"
                value={headline}
                onChange={onChange}
                placeholder="Professional | Developer | Enthusiast"
                maxLength="120"
              />
            </div>

            <div className="form-group">
              <label htmlFor="location">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                value={location}
                onChange={onChange}
                placeholder="City, Country"
                maxLength="100"
              />
            </div>

            <div className="form-group">
              <label htmlFor="bio">About</label>
              <textarea
                id="bio"
                name="bio"
                value={bio}
                onChange={onChange}
                placeholder="Tell us about yourself..."
                rows="5"
                maxLength="500"
              />
              <span className="char-count">{bio.length}/500</span>
            </div>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
