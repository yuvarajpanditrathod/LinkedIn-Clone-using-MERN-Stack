import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import { 
  FaHome, 
  FaUserFriends, 
  FaBriefcase, 
  FaCommentDots, 
  FaBell, 
  FaSignOutAlt, 
  FaLinkedin,
  FaSearch,
  FaUserPlus,
  FaClock
} from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;
  const showLandingHeader = path === '/' || path === '/login' || path === '/register';
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [connectionStatuses, setConnectionStatuses] = useState({});
  const searchRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  // Search functionality
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const searchUsers = async () => {
      if (searchQuery.trim().length < 2) {
        setSearchResults([]);
        setShowDropdown(false);
        return;
      }

      setIsSearching(true);
      try {
        const response = await axios.get(`/api/users/search?q=${searchQuery}`);
        const users = response.data.users || [];
        setSearchResults(users);
        setShowDropdown(true);

        // Fetch connection status for each user
        const statuses = {};
        await Promise.all(
          users.map(async (resultUser) => {
            if (resultUser._id !== user?._id) {
              try {
                const statusRes = await axios.get(`/api/connections/status/${resultUser._id}`, {
                  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                statuses[resultUser._id] = statusRes.data.status;
              } catch (error) {
                console.error('Error fetching connection status:', error);
                statuses[resultUser._id] = 'none';
              }
            }
          })
        );
        setConnectionStatuses(statuses);
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimer = setTimeout(searchUsers, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery, user]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleUserClick = (userId) => {
    setSearchQuery('');
    setShowDropdown(false);
    setSearchResults([]);
    navigate(`/profile/${userId}`);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchResults.length > 0) {
      handleUserClick(searchResults[0]._id);
    }
  };

  const handleConnect = async (e, userId) => {
    e.stopPropagation();
    try {
      await axios.post(`/api/connections/request/${userId}`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setConnectionStatuses(prev => ({ ...prev, [userId]: 'pending' }));
    } catch (error) {
      console.error('Error sending connection request:', error);
      alert(error.response?.data?.message || 'Failed to send connection request');
    }
  };

  // Show a simplified landing header on the landing, login and register routes
  if (showLandingHeader) {
    return (
      <nav className="landing-navbar">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center py-3">
            <div className="landing-logo d-flex align-items-center">
              <FaLinkedin className="logo-icon" />
              <span className="logo-text">LinkedIn</span>
            </div>
            <div className="landing-nav-actions d-flex align-items-center gap-3">
              <Link to="/login" className="btn btn-outline-primary rounded-pill px-4">
                Sign in
              </Link>
              <Link to="/register" className="btn btn-primary rounded-pill px-4">
                Join now
              </Link>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div to="/" className="navbar-logo">
          <FaLinkedin className="logo-icon" />
          <span>LinkdeIn</span>
        </div>

        {isAuthenticated && (
          <>
            {/* Search Bar */}
            <div className="navbar-search" ref={searchRef}>
              <form onSubmit={handleSearchSubmit}>
                <FaSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="search-input"
                />
              </form>
              
              {showDropdown && (
                <div className="search-dropdown">
                  {isSearching ? (
                    <div className="search-loading">Searching...</div>
                  ) : searchResults.length > 0 ? (
                    searchResults.map((result) => (
                      <div
                        key={result._id}
                        className="search-result-item"
                        onClick={() => handleUserClick(result._id)}
                      >
                        <img
                          src={result.profilePicture || 'https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png'}
                          alt={result.name}
                          className="search-result-avatar"
                        />
                        <div className="search-result-info">
                          <div className="search-result-name">{result.name}</div>
                          <div className="search-result-headline">{result.headline || 'Professional'}</div>
                        </div>
                        {result._id !== user?._id && (
                          <div className="search-result-action">
                            {connectionStatuses[result._id] === 'connected' ? (
                              <button className="search-btn search-btn-connected" disabled>
                                Connected
                              </button>
                            ) : connectionStatuses[result._id] === 'pending' ? (
                              <button className="search-btn search-btn-pending" disabled>
                                <FaClock /> Pending
                              </button>
                            ) : connectionStatuses[result._id] === 'received' ? (
                              <button className="search-btn search-btn-respond">
                                Respond
                              </button>
                            ) : (
                              <button 
                                className="search-btn search-btn-connect"
                                onClick={(e) => handleConnect(e, result._id)}
                              >
                                <FaUserPlus /> Connect
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="search-no-results">No users found</div>
                  )}
                </div>
              )}
            </div>

            <div className="navbar-center">
              <Link to="/feed" className={`nav-link ${isActive('/feed') ? 'active' : ''}`}>
                <FaHome className="nav-link-icon" />
                <span>Home</span>
              </Link>

              <Link to="/network" className={`nav-link ${isActive('/network') ? 'active' : ''}`}>
                <FaUserFriends className="nav-link-icon" />
                <span>My Network</span>
              </Link>

              <Link to="/jobs" className={`nav-link ${isActive('/jobs') ? 'active' : ''}`}>
                <FaBriefcase className="nav-link-icon" />
                <span>Jobs</span>
              </Link>

              <Link to="/messaging" className={`nav-link ${isActive('/messaging') ? 'active' : ''}`}>
                <FaCommentDots className="nav-link-icon" />
                <span>Messaging</span>
              </Link>

              <Link to="/notifications" className={`nav-link ${isActive('/notifications') ? 'active' : ''}`}>
                <FaBell className="nav-link-icon" />
                <span>Notifications</span>
              </Link>

              <Link 
                to={`/profile/${user?._id}`} 
                className={`nav-link ${isActive(`/profile/${user?._id}`) ? 'active' : ''}`}
              >
                <img
                  src={user?.profilePicture || 'https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png'}
                  alt={user?.name}
                  className="nav-link-avatar"
                />
                <span>Me</span>
              </Link>

              <button onClick={handleLogout} className="nav-link navbar-logout">
                <FaSignOutAlt className="nav-link-icon" />
                <span>Logout</span>
              </button>
            </div>
          </>
        )}

        {!isAuthenticated && (
          <div className="navbar-menu">
            <Link to="/login" className="btn btn-outline">
              Sign in
            </Link>
            <Link to="/register" className="btn btn-primary">
              Join now
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
