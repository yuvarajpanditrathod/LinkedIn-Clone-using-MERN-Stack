import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { PostContext } from "../../context/PostContext";
import EditPost from "./EditPost";
import CommentSection from "./CommentSection";
import {
  FaThumbsUp,
  FaComment,
  FaEdit,
  FaTrash,
  FaEllipsisH,
} from "react-icons/fa";
import "./PostCard.css";

const PostCard = ({ post }) => {
  const { user } = useContext(AuthContext);
  const { likePost, deletePost } = useContext(PostContext);

  const [showMenu, setShowMenu] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const isOwner = user && post.user && user._id === post.user._id;
  const isLiked = user && post.likes && post.likes.includes(user._id);

  const handleLike = () => {
    likePost(post._id);
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      await deletePost(post._id);
    }
  };

  const formatDate = (date) => {
    const now = new Date();
    const postDate = new Date(date);
    const diffTime = Math.abs(now - postDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffTime / (1000 * 60));

    if (diffDays > 7) {
      return postDate.toLocaleDateString();
    } else if (diffDays > 0) {
      return `${diffDays}d ago`;
    } else if (diffHours > 0) {
      return `${diffHours}h ago`;
    } else if (diffMinutes > 0) {
      return `${diffMinutes}m ago`;
    } else {
      return "Just now";
    }
  };

  return (
    <div className="post-card">
      <div className="post-header">
        <Link to={`/profile/${post.user?._id}`} className="post-user">
          <img
            src={
              post.user?.profilePicture ||
              "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"
            }
            alt={post.user?.name}
            className="post-avatar"
          />
          <div className="post-user-info">
            <h4>{post.user?.name}</h4>
            <p>{post.user?.headline}</p>
            <span className="post-time">{formatDate(post.createdAt)}</span>
          </div>
        </Link>

        {isOwner && (
          <div className="post-menu">
            <button
              className="post-menu-btn"
              onClick={() => setShowMenu(!showMenu)}
            >
              <FaEllipsisH />
            </button>

            {showMenu && (
              <div className="post-menu-dropdown">
                <button
                  onClick={() => {
                    setShowEditModal(true);
                    setShowMenu(false);
                  }}
                >
                  <FaEdit /> Edit
                </button>
                <button onClick={handleDelete} className="delete-btn">
                  <FaTrash /> Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="post-content">
        <p>{post.content}</p>
        {post.image &&
          (/\.(mp4|webm|mov|ogg)$/i.test(post.image) ? (
            <video controls className="post-video">
              <source
                src={`${process.env.REACT_APP_API_URL}${post.image}`}
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>
          ) : (
            <img
              src={`${process.env.REACT_APP_API_URL}${post.image}`}
              alt="Post"
              className="post-image"
            />
          ))}
      </div>

      <div className="post-stats">
        <span>{post.likes?.length || 0} likes</span>
        <span>{post.comments?.length || 0} comments</span>
      </div>

      <div className="post-actions">
        <button
          className={`post-action-btn ${isLiked ? "active" : ""}`}
          onClick={handleLike}
        >
          <FaThumbsUp />
          <span>Like</span>
        </button>

        <button
          className="post-action-btn"
          onClick={() => setShowComments(!showComments)}
        >
          <FaComment />
          <span>Comment</span>
        </button>
      </div>

      {showComments && <CommentSection post={post} />}

      {showEditModal && (
        <EditPost post={post} onClose={() => setShowEditModal(false)} />
      )}
    </div>
  );
};

export default PostCard;
