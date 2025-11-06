import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaGoogle, FaMicrosoft, FaApple } from 'react-icons/fa';
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
    
    const result = await login(formData);
    
    if (result.success) {
      navigate('/feed');
    }
    
    setIsLoading(false);
  };

  return (
  <div className="auth-container with-header">
      <div className="auth-content">
        <div className="auth-card">
          <h2>Sign in</h2>
          <p className="auth-subtitle">Stay updated on your professional world</p>

          <div className="social-signin">
            <button type="button" className="social-btn social-google">
              <FaGoogle className="social-icon" />
              Continue with Google
            </button>
            <button type="button" className="social-btn social-microsoft">
              <FaMicrosoft className="social-icon" />
              Sign in with Microsoft
            </button>
            <button type="button" className="social-btn social-apple">
              <FaApple className="social-icon" />
              Sign in with Apple
            </button>

            <div className="social-legal">
              By clicking Continue, you agree to LinkedIn's <a href="/terms" className="footer-link">User Agreement</a>, <a href="/privacy" className="footer-link">Privacy Policy</a>, and <a href="/cookies" className="footer-link">Cookie Policy</a>.
            </div>

            <div className="social-divider"><span>or</span></div>
          </div>

          <form onSubmit={onSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={onChange}
                  required
                  placeholder="Enter your email"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  onChange={onChange}
                  required
                  minLength="6"
                  placeholder="Enter your password"
                />
              </div>

              <div className="text-right">
                <Link to="/forgot" className="text-muted small">Forgot password?</Link>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-block"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>

            <div className="auth-footer">
              <p>
                New here? <Link to="/register">Join now</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
  );
};

export default Login;
