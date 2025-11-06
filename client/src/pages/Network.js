import React from 'react';
import './Network.css';
import { FaUserPlus, FaUsers, FaHandshake } from 'react-icons/fa';

const Network = () => {
  return (
    <div className="network-container">
      <div className="network-wrapper">
        <div className="network-header">
          <h1>My Network</h1>
          <p>Manage your connections and invitations</p>
        </div>

        <div className="network-sections">
          <div className="network-card">
            <div className="network-card-icon">
              <FaUsers />
            </div>
            <div className="network-card-content">
              <h3>Connections</h3>
              <p>Connect with people you know</p>
              <span className="network-count">127 connections</span>
            </div>
          </div>

          <div className="network-card">
            <div className="network-card-icon">
              <FaUserPlus />
            </div>
            <div className="network-card-content">
              <h3>Invitations</h3>
              <p>Manage received invitations</p>
              <span className="network-count">5 pending</span>
            </div>
          </div>

          <div className="network-card">
            <div className="network-card-icon">
              <FaHandshake />
            </div>
            <div className="network-card-content">
              <h3>Following</h3>
              <p>People and companies you follow</p>
              <span className="network-count">43 following</span>
            </div>
          </div>
        </div>

        <div className="coming-soon">
          <h2>🚀 Coming Soon</h2>
          <p>Full networking features are under development</p>
        </div>
      </div>
    </div>
  );
};

export default Network;
