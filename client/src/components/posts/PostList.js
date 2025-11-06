import React, { useContext } from 'react';
import { PostContext } from '../../context/PostContext';
import PostCard from './PostCard';

const PostList = () => {
  const { posts } = useContext(PostContext);

  if (posts.length === 0) {
    return (
      <div className="no-posts-message">
        <h3>No posts yet</h3>
        <p>Be the first to share something!</p>
      </div>
    );
  }

  return (
    <div className="posts-list">
      {posts.map(post => (
        <PostCard key={post._id} post={post} />
      ))}
    </div>
  );
};

export default PostList;
