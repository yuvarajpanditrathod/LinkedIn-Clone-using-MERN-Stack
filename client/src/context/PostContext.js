import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

export const PostContext = createContext();

export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);

  // Get all posts
  const getPosts = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/posts');
      setPosts(res.data.posts);
    } catch (error) {
      console.error('Get posts error:', error);
      // Notification suppressed: Failed to fetch posts
    } finally {
      setLoading(false);
    }
  };

  // Create post
  const createPost = async (formData) => {
    try {
      const res = await axios.post('/api/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
  setPosts([res.data.post, ...posts]);
  // Post created successfully (notification suppressed)
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create post';
      console.error(message);
      return { success: false, message };
    }
  };

  // Update post
  const updatePost = async (postId, formData) => {
    try {
      const res = await axios.put(`/api/posts/${postId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
  setPosts(posts.map(post => post._id === postId ? res.data.post : post));
  // Post updated successfully (notification suppressed)
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update post';
      console.error(message);
      return { success: false, message };
    }
  };

  // Delete post
  const deletePost = async (postId) => {
    try {
      await axios.delete(`/api/posts/${postId}`);
  setPosts(posts.filter(post => post._id !== postId));
  // Post deleted successfully (notification suppressed)
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete post';
      console.error(message);
      return { success: false, message };
    }
  };

  // Like post
  const likePost = async (postId) => {
    try {
      const res = await axios.post(`/api/posts/${postId}/like`);
      setPosts(posts.map(post => post._id === postId ? res.data.post : post));
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to like post';
      console.error(message);
    }
  };

  // Add comment
  const addComment = async (postId, text) => {
    try {
      const res = await axios.post(`/api/posts/${postId}/comment`, { text });
  setPosts(posts.map(post => post._id === postId ? res.data.post : post));
  // Comment added (notification suppressed)
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add comment';
      console.error(message);
      return { success: false, message };
    }
  };

  // Delete comment
  const deleteComment = async (postId, commentId) => {
    try {
      const res = await axios.delete(`/api/posts/${postId}/comment/${commentId}`);
  setPosts(posts.map(post => post._id === postId ? res.data.post : post));
  // Comment deleted (notification suppressed)
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete comment';
      console.error(message);
      return { success: false, message };
    }
  };

  const value = {
    posts,
    loading,
    getPosts,
    createPost,
    updatePost,
    deletePost,
    likePost,
    addComment,
    deleteComment
  };

  return <PostContext.Provider value={value}>{children}</PostContext.Provider>;
};
