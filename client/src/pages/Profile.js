import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import PostCard from '../components/posts/PostCard';
import EditProfile from '../components/profile/EditProfile';
import { FaMapMarkerAlt, FaEdit, FaGraduationCap, FaBriefcase, FaFileAlt } from 'react-icons/fa';
import './Profile.css';

const Profile = () => {
  const { userId } = useParams();
  const { user: currentUser } = useContext(AuthContext);
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('none'); // none, pending, received, connected
  const [requestId, setRequestId] = useState(null);

  const isOwnProfile = currentUser && currentUser._id === userId;

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(`/api/users/${userId}`);
        setProfile(res.data.user);
        setPosts(res.data.posts);
      } catch (error) {
        console.error('Fetch profile error:', error);
      } finally {
        setLoading(false);
      }

      if (currentUser && userId !== currentUser._id) {
        try {
          const res2 = await axios.get(`/api/connections/status/${userId}`);
          if (res2.data.success) {
            setConnectionStatus(res2.data.status);
            if (res2.data.requestId) setRequestId(res2.data.requestId);
          }
        } catch (err) {
          console.error('Fetch connection status error:', err);
        }
      }
    };

    load();
  }, [userId, currentUser]);

  const handleSendRequest = async () => {
    try {
      const res = await axios.post(`/api/connections/request/${userId}`, {}, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
  // Connection request sent (notification suppressed)
      setConnectionStatus('pending');
      setRequestId(res.data.data._id);
    } catch (err) {
      console.error('Send request error', err);
  console.error(err.response?.data?.message || 'Failed to send request');
    }
  };

  const handleWithdrawRequest = async () => {
    try {
      await axios.delete(`/api/connections/request/${userId}`);
      setConnectionStatus('none');
      setRequestId(null);
    } catch (err) {
      console.error('Withdraw error', err);
  console.error(err.response?.data?.message || 'Failed to withdraw request');
    }
  };

  const handleAccept = async () => {
    try {
      await axios.put(`/api/connections/accept/${requestId}`);
  // Connection accepted (notification suppressed)
      setConnectionStatus('connected');
    } catch (err) {
      console.error('Accept error', err);
  console.error(err.response?.data?.message || 'Failed to accept');
    }
  };

  const handleReject = async () => {
    try {
      await axios.put(`/api/connections/reject/${requestId}`);
  // Connection rejected (notification suppressed)
      setConnectionStatus('none');
      setRequestId(null);
    } catch (err) {
      console.error('Reject error', err);
  console.error(err.response?.data?.message || 'Failed to reject');
    }
  };

  const handleRemoveConnection = async () => {
    try {
      await axios.delete(`/api/connections/${userId}`);
  // Connection removed (notification suppressed)
      setConnectionStatus('none');
    } catch (err) {
      console.error('Remove connection error', err);
  console.error(err.response?.data?.message || 'Failed to remove connection');
    }
  };

  const handleMessage = () => {
    // simple navigation to messaging page with query param
    navigate(`/messaging?user=${profile._id}`);
  };

  const handleProfileUpdate = (updatedProfile) => {
    setProfile(updatedProfile);
    setShowEditModal(false);
  };

  if (loading) {
    return <div className="spinner"></div>;
  }

  if (!profile) {
    return (
      <div className="profile-container">
        <div className="error-message">User not found</div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-wrapper">
        {/* Profile Header */}
        <div className="profile-card">
          <div
            className="profile-banner"
            style={{
              backgroundImage: `url(${
                profile.bannerImage
                  ? profile.bannerImage.startsWith('http')
                    ? profile.bannerImage
                    : `${process.env.REACT_APP_API_URL}${profile.bannerImage}`
                  : 'https://thingscareerrelated.com/wp-content/uploads/2021/10/default-background-image.png'
              })`,
            }}
          ></div>
          
          <div className="profile-content">
            <div className="profile-main-info">
              <div className="profile-avatar-wrapper">
                <img
                  src={
                    profile.profilePicture
                      ? profile.profilePicture.startsWith('http')
                        ? profile.profilePicture
                        : `${process.env.REACT_APP_API_URL}${profile.profilePicture}`
                      : 'https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png'
                  }
                  alt={profile.name}
                  className="profile-avatar"
                />
              </div>

              {/* show action buttons for other users */}
              {isOwnProfile ? (
                <button
                  className="btn-edit-profile"
                  onClick={() => setShowEditModal(true)}
                >
                  <FaEdit /> Edit Profile
                </button>
              ) : (
                <div className="profile-actions">
                  {connectionStatus === 'none' && (
                    <button className="search-btn search-btn-connect" onClick={handleSendRequest}>Connect</button>
                  )}

                  {connectionStatus === 'pending' && (
                    <>
                      <button className="search-btn search-btn-pending" disabled>Pending</button>
                      <button className="btn-withdraw" onClick={handleWithdrawRequest}>Withdraw</button>
                    </>
                  )}

                  {connectionStatus === 'received' && (
                    <>
                      <button className="btn-accept" onClick={handleAccept}>Accept</button>
                      <button className="btn-reject" onClick={handleReject}>Reject</button>
                    </>
                  )}

                  {connectionStatus === 'connected' && (
                    <>
                      <button className="btn-message" onClick={handleMessage}>Message</button>
                      <button className="btn-remove" onClick={handleRemoveConnection}>Remove</button>
                    </>
                  )}
                </div>
              )}

              <div className="profile-info">
                <h1>{profile.name}</h1>
                <p className="profile-headline">{profile.headline}</p>
                
                {profile.location && (
                  <p className="profile-location">
                    <FaMapMarkerAlt /> {profile.location}
                  </p>
                )}
              </div>
            </div>

            {profile.bio && (
              <div className="profile-section">
                <h3>About</h3>
                <p>{profile.bio}</p>
              </div>
            )}

            {/* Skills Section */}
            {profile.skills && profile.skills.length > 0 && (
              <div className="profile-section">
                <h3>Skills</h3>
                <div className="skills-container">
                  {profile.skills.map((skill, index) => (
                    <div key={index} className="skill-badge">
                      {skill}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education Section */}
            {profile.education && profile.education.length > 0 && (
              <div className="profile-section">
                <div className="section-header">
                  <FaGraduationCap />
                  <h3>Education</h3>
                </div>
                <div className="education-list">
                  {profile.education.map((edu, index) => (
                    <div key={index} className="education-item">
                      <div className="education-icon">
                        <FaGraduationCap />
                      </div>
                      <div className="education-details">
                        <h4>{edu.school}</h4>
                        <p className="education-degree">{edu.degree}</p>
                        {edu.fieldOfStudy && (
                          <p className="education-field">{edu.fieldOfStudy}</p>
                        )}
                        {(edu.startYear || edu.endYear) && (
                          <p className="education-years">
                            {edu.startYear} - {edu.endYear || 'Present'}
                          </p>
                        )}
                        {edu.description && (
                          <p className="education-description">{edu.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Job Interests Section */}
            {profile.jobInterests && profile.jobInterests.length > 0 && (
              <div className="profile-section">
                <div className="section-header">
                  <FaBriefcase />
                  <h3>Job Interests</h3>
                </div>
                <div className="job-interests-container">
                  {profile.jobInterests.map((interest, index) => (
                    <div key={index} className="job-interest-badge">
                      {interest}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Resume Section */}
            {profile.resumeUrl && (
              <div className="profile-section">
                <div className="section-header">
                  <FaFileAlt />
                  <h3>Resume</h3>
                </div>
                <a 
                  href={profile.resumeUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="resume-link"
                >
                  <FaFileAlt />
                  Download Resume
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Posts Section */}
        <div className="profile-posts">
          <h2>Posts ({posts.length})</h2>
          
          {posts.length === 0 ? (
            <div className="no-posts">
              <p>{isOwnProfile ? 'You haven\'t posted anything yet' : 'No posts yet'}</p>
            </div>
          ) : (
            <div className="posts-list">
              {posts.map(post => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <EditProfile
          profile={profile}
          onClose={() => setShowEditModal(false)}
          onUpdate={handleProfileUpdate}
        />
      )}
    </div>
  );
};

export default Profile;
