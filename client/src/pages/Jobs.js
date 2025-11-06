import React from 'react';
import './Jobs.css';
import { FaBriefcase, FaSearch, FaBookmark } from 'react-icons/fa';

const Jobs = () => {
  return (
    <div className="jobs-container">
      <div className="jobs-wrapper">
        <div className="jobs-header">
          <h1>Jobs</h1>
          <p>Find your dream job</p>
        </div>

        <div className="jobs-search">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input type="text" placeholder="Search for jobs..." />
          </div>
        </div>

        <div className="jobs-sections">
          <div className="jobs-card">
            <div className="jobs-card-icon">
              <FaBriefcase />
            </div>
            <div className="jobs-card-content">
              <h3>Job Recommendations</h3>
              <p>Based on your profile and preferences</p>
              <span className="jobs-count">150+ jobs available</span>
            </div>
          </div>

          <div className="jobs-card">
            <div className="jobs-card-icon">
              <FaBookmark />
            </div>
            <div className="jobs-card-content">
              <h3>Saved Jobs</h3>
              <p>Jobs you've bookmarked</p>
              <span className="jobs-count">0 saved jobs</span>
            </div>
          </div>

          <div className="jobs-card">
            <div className="jobs-card-icon">
              <FaBriefcase />
            </div>
            <div className="jobs-card-content">
              <h3>Applied Jobs</h3>
              <p>Track your applications</p>
              <span className="jobs-count">0 applications</span>
            </div>
          </div>
        </div>

        <div className="coming-soon">
          <h2>💼 Coming Soon</h2>
          <p>Full job search and application features are under development</p>
        </div>
      </div>
    </div>
  );
};

export default Jobs;
