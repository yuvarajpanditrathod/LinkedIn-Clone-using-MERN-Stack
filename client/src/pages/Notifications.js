import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaBell, FaUserPlus, FaThumbsUp, FaComment, FaCheck, FaTimes } from 'react-icons/fa';
import './Notifications.css';

const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [connectionRequests, setConnectionRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
    fetchConnectionRequests();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get('/api/notifications', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setNotifications(response.data.data || []);
      setUnreadCount(response.data.unreadCount || 0);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const fetchConnectionRequests = async () => {
    try {
      const response = await axios.get('/api/connections/requests', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setConnectionRequests(response.data.data || []);
    } catch (error) {
      console.error('Error fetching connection requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = async (requestId) => {
    try {
      await axios.put(`/api/connections/accept/${requestId}`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchConnectionRequests();
      fetchNotifications();
    } catch (error) {
      console.error('Error accepting request:', error);
      alert(error.response?.data?.message || 'Failed to accept connection request');
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      await axios.put(`/api/connections/reject/${requestId}`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchConnectionRequests();
    } catch (error) {
      console.error('Error rejecting request:', error);
      alert(error.response?.data?.message || 'Failed to reject connection request');
    }
  };

  const handleNotificationClick = async (notification) => {
    try {
      if (!notification.read) {
        await axios.put(`/api/notifications/${notification._id}/read`, {}, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        fetchNotifications();
      }

      if (notification.type === 'connection_request' || notification.type === 'connection_accepted') {
        navigate(`/profile/${notification.sender._id}`);
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'connection_request':
      case 'connection_accepted':
        return <FaUserPlus />;
      case 'post_like':
        return <FaThumbsUp />;
      case 'post_comment':
        return <FaComment />;
      default:
        return <FaBell />;
    }
  };

  const formatTime = (date) => {
    const now = new Date();
    const notifDate = new Date(date);
    const diffMs = now - notifDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return notifDate.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="notifications-container">
        <div className="notifications-wrapper">
          <div className="notifications-loading">Loading notifications...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="notifications-container">
      <div className="notifications-wrapper">
        <div className="notifications-header">
          <h1>Notifications</h1>
          {unreadCount > 0 && (
            <span className="notifications-badge">{unreadCount}</span>
          )}
        </div>

        {connectionRequests.length > 0 && (
          <div className="connection-requests-section">
            <h2>Connection Requests</h2>
            <div className="requests-list">
              {connectionRequests.map((request) => (
                <div key={request._id} className="request-item">
                  <img
                    src={request.sender.profilePicture || 'https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png'}
                    alt={request.sender.name}
                    className="request-avatar"
                    onClick={() => navigate(`/profile/${request.sender._id}`)}
                  />
                  <div className="request-info">
                    <h3 onClick={() => navigate(`/profile/${request.sender._id}`)}>
                      {request.sender.name}
                    </h3>
                    <p>{request.sender.headline || 'Professional'}</p>
                    {request.message && <p className="request-message">"{request.message}"</p>}
                  </div>
                  <div className="request-actions">
                    <button
                      className="btn-accept"
                      onClick={() => handleAcceptRequest(request._id)}
                    >
                      <FaCheck /> Accept
                    </button>
                    <button
                      className="btn-reject"
                      onClick={() => handleRejectRequest(request._id)}
                    >
                      <FaTimes /> Ignore
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {notifications.length > 0 ? (
          <div className="notifications-list">
            <h2>All Notifications</h2>
            {notifications.map((notification) => (
              <div
                key={notification._id}
                className={`notification-item ${!notification.read ? 'unread' : ''}`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="notification-icon-wrapper">
                  {getNotificationIcon(notification.type)}
                </div>
                <img
                  src={notification.sender.profilePicture || 'https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png'}
                  alt={notification.sender.name}
                  className="notification-avatar"
                />
                <div className="notification-content">
                  <p>{notification.message}</p>
                  <span className="notification-time">{formatTime(notification.createdAt)}</span>
                </div>
                {!notification.read && <div className="unread-dot"></div>}
              </div>
            ))}
          </div>
        ) : connectionRequests.length === 0 ? (
          <div className="no-notifications">
            <FaBell className="no-notifications-icon" />
            <h2>No notifications yet</h2>
            <p>When you get notifications, they'll show up here</p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Notifications;
