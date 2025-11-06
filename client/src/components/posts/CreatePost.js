import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { PostContext } from '../../context/PostContext';
import { FaImage, FaTimes } from 'react-icons/fa';
import './CreatePost.css';

const CreatePost = () => {
  const { user } = useContext(AuthContext);
  const { createPost } = useContext(PostContext);
  
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim()) {
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('content', content);
    if (image) {
      formData.append('image', image);
    }

    const result = await createPost(formData);
    
    if (result.success) {
      setContent('');
      setImage(null);
      setImagePreview(null);
    }

    setIsSubmitting(false);
  };

  return (
    <div className="create-post-card">
      <div className="create-post-header">
        <img
          src={user?.profilePicture || 'https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png'}
          alt={user?.name}
          className="create-post-avatar"
        />
        <form onSubmit={handleSubmit} className="create-post-form">
          <textarea
            placeholder="What do you want to talk about?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="create-post-textarea"
            rows="3"
          />

          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview} alt="Preview" />
              <button
                type="button"
                onClick={removeImage}
                className="remove-image-btn"
              >
                <FaTimes />
              </button>
            </div>
          )}

          <div className="create-post-actions">
            <label className="upload-image-btn">
              <FaImage />
              <span>Photo</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                hidden
              />
            </label>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={!content.trim() || isSubmitting}
            >
              {isSubmitting ? 'Posting...' : 'Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
