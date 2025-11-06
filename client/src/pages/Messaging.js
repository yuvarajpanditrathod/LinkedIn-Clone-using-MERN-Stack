import React from 'react';
import './Messaging.css';
import { FaCommentDots, FaInbox, FaUsers } from 'react-icons/fa';

const Messaging = () => {
  return (
    <div className="messaging-container">
      <div className="messaging-wrapper">
        <div className="messaging-header">
          <h1>Messaging</h1>
          <p>Stay connected with your network</p>
        </div>

        <div className="messaging-sections">
          <div className="messaging-card">
            <div className="messaging-card-icon">
              <FaInbox />
            </div>
            <div className="messaging-card-content">
              <h3>Inbox</h3>
              <p>All your conversations</p>
              <span className="messaging-count">0 messages</span>
            </div>
          </div>

          <div className="messaging-card">
            <div className="messaging-card-icon">
              <FaCommentDots />
            </div>
            <div className="messaging-card-content">
              <h3>Focused</h3>
              <p>Important conversations</p>
              <span className="messaging-count">0 unread</span>
            </div>
          </div>

          <div className="messaging-card">
            <div className="messaging-card-icon">
              <FaUsers />
            </div>
            <div className="messaging-card-content">
              <h3>Groups</h3>
              <p>Group conversations</p>
              <span className="messaging-count">0 groups</span>
            </div>
          </div>
        </div>

        <div className="coming-soon">
          <h2>💬 Coming Soon</h2>
          <p>Real-time messaging features are under development</p>
        </div>
      </div>
    </div>
  );
};

export default Messaging;
