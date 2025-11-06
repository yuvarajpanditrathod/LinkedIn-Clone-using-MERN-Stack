import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaLinkedin, FaSearch, FaBriefcase, FaUserFriends, FaGraduationCap, FaLightbulb } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Landing.css';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">

      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="hero-content">
                <h1 className="hero-title">
                  Welcome to your professional community
                </h1>
                <div className="hero-search mt-4">
                  <div className="input-group input-group-lg">
                    <span className="input-group-text bg-white border-end-0">
                      <FaSearch className="text-muted" />
                    </span>
                    <input
                      type="text"
                      className="form-control border-start-0 ps-0"
                      placeholder="Search for a job title or company"
                      onFocus={() => navigate('/register')}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6 d-none d-lg-block">
              <div className="hero-image">
                <img
                  src="https://static.licdn.com/aero-v1/sc/h/dxf91zhqd2z6b0bwg85ktm5s4"
                  alt="Professional network"
                  className="img-fluid"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="section-title">Explore collaborative articles</h2>
            <p className="section-subtitle">
              We're unlocking community knowledge in a new way. Experts add insights directly into each article, started with the help of AI.
            </p>
          </div>
          <div className="row g-4">
            <div className="col-md-6 col-lg-3">
              <div className="feature-card">
                <div className="feature-icon">
                  <FaBriefcase />
                </div>
                <h3 className="feature-title">Find the right job</h3>
                <p className="feature-description">
                  Connect with people who can help. Find the right job or internship.
                </p>
              </div>
            </div>
            <div className="col-md-6 col-lg-3">
              <div className="feature-card">
                <div className="feature-icon">
                  <FaUserFriends />
                </div>
                <h3 className="feature-title">Build your network</h3>
                <p className="feature-description">
                  Stay in touch with your connections and strengthen relationships.
                </p>
              </div>
            </div>
            <div className="col-md-6 col-lg-3">
              <div className="feature-card">
                <div className="feature-icon">
                  <FaGraduationCap />
                </div>
                <h3 className="feature-title">Learn new skills</h3>
                <p className="feature-description">
                  Take courses and get certified in the skills you need to advance.
                </p>
              </div>
            </div>
            <div className="col-md-6 col-lg-3">
              <div className="feature-card">
                <div className="feature-icon">
                  <FaLightbulb />
                </div>
                <h3 className="feature-title">Get insights</h3>
                <p className="feature-description">
                  Discover insights and expert perspectives on professional topics.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Topics Section */}
      <section className="topics-section py-5 bg-light">
        <div className="container">
          <h2 className="section-title text-center mb-5">Find the right job or internship for you</h2>
          <div className="row g-3">
            <div className="col-6 col-md-4 col-lg-3">
              <div className="topic-card">
                <span className="topic-name">Engineering</span>
              </div>
            </div>
            <div className="col-6 col-md-4 col-lg-3">
              <div className="topic-card">
                <span className="topic-name">Business Development</span>
              </div>
            </div>
            <div className="col-6 col-md-4 col-lg-3">
              <div className="topic-card">
                <span className="topic-name">Finance</span>
              </div>
            </div>
            <div className="col-6 col-md-4 col-lg-3">
              <div className="topic-card">
                <span className="topic-name">Administrative</span>
              </div>
            </div>
            <div className="col-6 col-md-4 col-lg-3">
              <div className="topic-card">
                <span className="topic-name">Retail</span>
              </div>
            </div>
            <div className="col-6 col-md-4 col-lg-3">
              <div className="topic-card">
                <span className="topic-name">Marketing</span>
              </div>
            </div>
            <div className="col-6 col-md-4 col-lg-3">
              <div className="topic-card">
                <span className="topic-name">Design</span>
              </div>
            </div>
            <div className="col-6 col-md-4 col-lg-3">
              <div className="topic-card">
                <span className="topic-name">Show more</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <img
                src="https://static.licdn.com/aero-v1/sc/h/43h6n82li4xu0q23s8jqizk6j"
                alt="Connect with people"
                className="img-fluid rounded"
              />
            </div>
            <div className="col-lg-6">
              <div className="cta-content ps-lg-5">
                <h2 className="cta-title">Connect with people who can help</h2>
                <p className="cta-description">
                  Find people you know, reconnect with old colleagues, and expand your professional network.
                </p>
                <Link to="/register" className="btn btn-primary btn-lg rounded-pill px-5 mt-3">
                  Get started
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Learning Section */}
      <section className="learning-section py-5 bg-light">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 order-lg-2 mb-4 mb-lg-0">
              <img
                src="https://static.licdn.com/aero-v1/sc/h/1dhh8rr3wohexkaya6jhn2y8j"
                alt="Learn new skills"
                className="img-fluid rounded"
              />
            </div>
            <div className="col-lg-6 order-lg-1">
              <div className="learning-content pe-lg-5">
                <h2 className="learning-title">Learn the skills you need to succeed</h2>
                <p className="learning-description">
                  Choose from thousands of courses taught by industry experts. Build in-demand skills with personalized recommendations.
                </p>
                <Link to="/register" className="btn btn-outline-primary btn-lg rounded-pill px-5 mt-3">
                  Explore courses
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      {/* Bottom CTA (Join) - added from original LinkedIn footer CTA */}
      <section className="bottom-cta-section py-4">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-12">
              <h2 id="bottom-cta-section__header" className="mb-3">
                Join your colleagues, classmates, and friends on LinkedIn
              </h2>
              <Link to="/register" className="btn btn-primary btn-md">
                Get started
              </Link>
            </div>
          </div>
        </div>
      </section>
      <footer className="landing-footer py-5">
        <div className="container">
          <div className="row">
            <div className="col-lg-3 mb-4 mb-lg-0">
            <div className="footer-logo d-flex align-items-center mb-3">
              <FaLinkedin className="logo-icon" />
              <span className="logo-text">LinkedIn</span>
            </div>
              <p className="text-muted small">© 2025 LinkedIn Corporation</p>
            </div>
            <div className="col-6 col-lg-2 mb-4 mb-lg-0">
              <h6 className="footer-title">Navigation</h6>
              <ul className="list-unstyled">
                <li><a href="#" className="footer-link">About</a></li>
                <li><a href="#" className="footer-link">Careers</a></li>
                <li><a href="#" className="footer-link">Advertising</a></li>
                <li><a href="#" className="footer-link">Talent</a></li>
              </ul>
            </div>
            <div className="col-6 col-lg-2 mb-4 mb-lg-0">
              <h6 className="footer-title">Solutions</h6>
              <ul className="list-unstyled">
                <li><a href="#" className="footer-link">Marketing</a></li>
                <li><a href="#" className="footer-link">Sales</a></li>
                <li><a href="#" className="footer-link">Learning</a></li>
                <li><a href="#" className="footer-link">Hiring</a></li>
              </ul>
            </div>
            <div className="col-6 col-lg-2 mb-4 mb-lg-0">
              <h6 className="footer-title">Quick Links</h6>
              <ul className="list-unstyled">
                <li><a href="#" className="footer-link">Jobs</a></li>
                <li><a href="#" className="footer-link">People</a></li>
                <li><a href="#" className="footer-link">Learning</a></li>
                <li><a href="#" className="footer-link">Posts</a></li>
              </ul>
            </div>
            <div className="col-6 col-lg-3">
              <h6 className="footer-title">Resources</h6>
              <ul className="list-unstyled">
                <li><a href="#" className="footer-link">Help Center</a></li>
                <li><a href="#" className="footer-link">Privacy Policy</a></li>
                <li><a href="#" className="footer-link">Terms of Service</a></li>
                <li><a href="#" className="footer-link">Community</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
