import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { PostContext } from '../../context/PostContext';
import { FaTrash } from 'react-icons/fa';
import './CommentSection.css';

const CommentSection = ({ post }) => {
  const { user } = useContext(AuthContext);
  const { addComment, deleteComment } = useContext(PostContext);
  
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!commentText.trim()) {
      return;
    }

    setIsSubmitting(true);
    const result = await addComment(post._id, commentText);
    
    if (result.success) {
      setCommentText('');
    }

    setIsSubmitting(false);
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      await deleteComment(post._id, commentId);
    }
  };

  const formatDate = (date) => {
    const now = new Date();
    const commentDate = new Date(date);
    const diffTime = Math.abs(now - commentDate);
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 0) return `${diffDays}d`;
    if (diffHours > 0) return `${diffHours}h`;
    if (diffMinutes > 0) return `${diffMinutes}m`;
    return 'now';
  };

  return (
    <div className="comment-section">
      <form onSubmit={handleSubmit} className="comment-form">
        <img
          src={user?.profilePicture || 'https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png'}
          alt={user?.name}
          className="comment-avatar"
        />
        <div className="comment-input-wrapper">
          <input
            type="text"
            placeholder="Add a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="comment-input"
          />
          <button
            type="submit"
            className="comment-submit-btn"
            disabled={!commentText.trim() || isSubmitting}
          >
            {isSubmitting ? 'Posting...' : 'Post'}
          </button>
        </div>
      </form>

      <div className="comments-list">
        {post.comments && post.comments.length > 0 ? (
          post.comments.map((comment) => (
            <div key={comment._id} className="comment-item">
              <Link to={`/profile/${comment.user?._id}`}>
                <img
                  src={comment.user?.profilePicture || 'https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png'}
                  alt={comment.user?.name}
                  className="comment-avatar"
                />
              </Link>
              <div className="comment-content">
                <div className="comment-bubble">
                  <Link to={`/profile/${comment.user?._id}`} className="comment-author">
                    {comment.user?.name}
                  </Link>
                  <p>{comment.text}</p>
                </div>
                <div className="comment-meta">
                  <span className="comment-time">{formatDate(comment.createdAt)}</span>
                  {user && comment.user && user._id === comment.user._id && (
                    <>
                      <span className="comment-dot">•</span>
                      <button
                        onClick={() => handleDeleteComment(comment._id)}
                        className="comment-delete-btn"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="no-comments">No comments yet. Be the first to comment!</p>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
