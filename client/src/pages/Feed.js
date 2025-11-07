import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { PostContext } from '../context/PostContext';
import { AuthContext } from '../context/AuthContext';
import CreatePost from '../components/posts/CreatePost';
import PostList from '../components/posts/PostList';
import './Feed.css';
import { 
  FaUser,
  FaHashtag,
  FaInfoCircle,
  FaPlus
} from 'react-icons/fa';

const Feed = () => {
  const { getPosts, loading } = useContext(PostContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    getPosts();
  }, [getPosts]);

  const handleNavigateToProfile = () => {
    if (user) {
      navigate(`/profile/${user._id}`);
    }
  };

  return (
    <div className="feed-container">
        {/* Left Sidebar */}
        <div className="feed-sidebar-left">
        <div className="sidebar-card">
          {/* show user's banner image or a default banner */}
          <div
            className="sidebar-profile-banner"
            style={{
              backgroundImage: `url(${
                user?.bannerImage
                  ? user.bannerImage.startsWith('http')
                    ? user.bannerImage
                    : `${process.env.REACT_APP_API_URL}${user.bannerImage}`
                  : 'https://thingscareerrelated.com/wp-content/uploads/2021/10/default-background-image.png'
              })`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
          <div className="sidebar-profile-info">
            <img
              src={
                user?.profilePicture
                  ? user.profilePicture.startsWith('http')
                    ? user.profilePicture
                    : `${process.env.REACT_APP_API_URL}${user.profilePicture}`
                  : 'https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png'
              }
              alt={user?.name}
              className="sidebar-avatar"
              onClick={handleNavigateToProfile}
            />
            <h3 onClick={handleNavigateToProfile}>{user?.name}</h3>
            <p className="sidebar-headline">{user?.headline || 'Professional'}</p>
          </div>
          <div className="sidebar-stats">
            <div className="stat-item">
              <span>Profile viewers</span>
              <span className="stat-number">127</span>
            </div>
            <div className="stat-item">
              <span>Post impressions</span>
              <span className="stat-number">1,432</span>
            </div>
          </div>
        </div>

        <div className="sidebar-card sidebar-premium">
          <FaHashtag className="premium-icon" />
          <div>
            <p className="premium-text">Access exclusive tools & insights</p>
            <a href="/premium" className="premium-link">Try Premium for free</a>
          </div>
        </div>

        <div className="sidebar-card sidebar-items">
          <div className="sidebar-item">
            <FaUser />
            <span>My items</span>
          </div>
        </div>
      </div>

      {/* Main Feed */}
      <div className="feed-main">
        <CreatePost />
        
        {loading ? (
          <div className="spinner"></div>
        ) : (
          <PostList />
        )}
      </div>

      {/* Right Sidebar */}
      <div className="feed-sidebar-right">
        <div className="sidebar-card">
          <div className="sidebar-header">
            <h3>LinkedIn News</h3>
            <FaInfoCircle />
          </div>
          <div className="news-list">
            <div className="news-item">
              <h4>Tech industry updates</h4>
              <p className="news-meta">2h ago • 1,234 readers</p>
            </div>
            <div className="news-item">
              <h4>Remote work trends</h4>
              <p className="news-meta">4h ago • 892 readers</p>
            </div>
            <div className="news-item">
              <h4>AI in the workplace</h4>
              <p className="news-meta">6h ago • 2,156 readers</p>
            </div>
            <div className="news-item">
              <h4>Career growth tips</h4>
              <p className="news-meta">8h ago • 743 readers</p>
            </div>
            <div className="news-item">
              <h4>Industry networking</h4>
              <p className="news-meta">10h ago • 1,567 readers</p>
            </div>
          </div>
        </div>

        <div className="sidebar-card">
          <div className="sidebar-header">
            <h3>Add to your feed</h3>
            <FaPlus />
          </div>
          <div className="suggestions-list">
            {[
              { title: 'Tech Leaders', subtitle: 'Company • Technology', img: 'https://i.pravatar.cc/48?img=12' },
              { title: 'Design Thinking', subtitle: 'Company • Design', img: 'https://i.pravatar.cc/48?img=32' },
              { title: 'Marketing Pros', subtitle: 'Company • Marketing', img: 'https://i.pravatar.cc/48?img=52' }
            ].map((s, idx) => (
              <div key={idx} className="suggestion-item">
                <div className="suggestion-avatar">
                  <img src={s.img} alt={s.title} className="suggestion-logo" />
                </div>
                <div className="suggestion-info">
                  <h4>{s.title}</h4>
                  <p>{s.subtitle}</p>
                  <button className="follow-btn">+ Follow</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feed;
