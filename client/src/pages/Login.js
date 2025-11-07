import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaEnvelope } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const { email, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await login(formData);
      if (result && result.success) {
        navigate('/feed');
      }
    } catch (err) {
      // errors handled by context; keep UX responsive
    } finally {
      setIsLoading(false);
    }
  };

  // prevent page scroll while auth page is mounted
  useEffect(() => {
    document.body.classList.add('auth-no-scroll');
    return () => document.body.classList.remove('auth-no-scroll');
  }, []);

  return (
  <div className="auth-container d-flex align-items-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-5">
            <div className="card auth-card shadow-sm rounded-4">
              <div className="card-body p-4">
                <h2 className="h4 mb-1">Sign in</h2>
                <p className="text-muted small mb-3">Stay updated on your professional world</p>

                <div className="d-grid gap-2 mb-3">
                    <div className="d-grid gap-3 mb-3">
                      {/* Google - filled primary with white circular badge containing multicolor G */}
                      <button type="button" className="btn btn-google d-flex align-items-center justify-content-center">
                        <span className="google-badge" aria-hidden>
                          {/* Inline Google G SVG */}
                          <svg width="18" height="18" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                            <path fill="#EA4335" d="M24 9.5c3.9 0 6.5 1.6 8 2.9l5.8-5.6C34.8 4 29.9 2 24 2 14.9 2 7.2 7.7 4 16.1l6.9 5.3C12.7 14.1 17.8 9.5 24 9.5z"/>
                            <path fill="#34A853" d="M46.5 24.5c0-1.6-.1-2.8-.4-4.1H24v8.1h12.8c-.6 3.4-3 6.2-6.6 7.9l6.9 5.3c4-3.7 6.4-9.2 6.4-16.9z"/>
                            <path fill="#FBBC05" d="M10.9 29.4c-.8-2.4-1.3-4.9-1.3-7.4s.5-5 1.3-7.4L4 9.3C2.5 12.6 1.6 16.3 1.6 20s.9 7.4 2.4 10.7l6.9-1.3z"/>
                            <path fill="#4285F4" d="M24 44c6.1 0 11.3-2.1 15.1-5.6l-7.3-5.7c-2.1 1.4-4.8 2.3-7.8 2.3-6.2 0-11.4-4.6-13.1-10.8L4 31.2C7.2 38.3 14.9 44 24 44z"/>
                            <path fill="none" d="M0 0h48v48H0z"/>
                          </svg>
                        </span>
                        <span className="ms-3">Continue with Google</span>
                      </button>

                      {/* Microsoft - outlined with 4-color square icon */}
                      <button type="button" className="btn btn-outline-ms d-flex align-items-center justify-content-center">
                        <span className="ms-icon" aria-hidden>
                          <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <rect x="0" y="0" width="10.5" height="10.5" fill="#F35325" />
                            <rect x="11.5" y="0" width="10.5" height="10.5" fill="#81BC06" />
                            <rect x="0" y="11.5" width="10.5" height="10.5" fill="#05A6F0" />
                            <rect x="11.5" y="11.5" width="10.5" height="10.5" fill="#FFD500" />
                          </svg>
                        </span>
                        <span className="ms-3">Continue with Microsoft</span>
                      </button>

                      {/* Email - outlined */}
                      <button type="button" className="btn btn-outline-email d-flex align-items-center justify-content-center">
                        <FaEnvelope className="me-2" /> Sign in with email
                      </button>
                    </div>
                </div>

                <form onSubmit={onSubmit} className="auth-form">
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label small fw-semibold">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={email}
                      onChange={onChange}
                      required
                      placeholder="Enter your email"
                      className="form-control"
                    />
                  </div>

                  <div className="mb-2">
                    <label htmlFor="password" className="form-label small fw-semibold">Password</label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={password}
                      onChange={onChange}
                      required
                      minLength="6"
                      placeholder="Enter your password"
                      className="form-control"
                    />
                  </div>

                  <div className="d-flex justify-content-end mb-3">
                    <Link to="/forgot" className="text-muted small">Forgot password?</Link>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-100 rounded-pill"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Signing in...' : 'Sign in'}
                  </button>
                </form>

                <div className="auth-footer text-center mt-4">
                  <p className="mb-0 small text-muted">New here? <Link to="/register">Join now</Link></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
