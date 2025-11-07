import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const { name, email, password, confirmPassword } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    
    const result = await register({ name, email, password });
    
    if (result.success) {
      navigate('/onboarding');
    }
    
    setIsLoading(false);
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
                <h2 className="h5 mb-2">Make the most of your professional life</h2>

                {error && <div className="alert alert-danger">{error}</div>}

                <form onSubmit={onSubmit} className="auth-form">
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label small fw-semibold">Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={name}
                      onChange={onChange}
                      required
                      minLength="2"
                      placeholder="Enter your full name"
                      className="form-control"
                    />
                  </div>

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

                  <div className="mb-3">
                    <label htmlFor="password" className="form-label small fw-semibold">Password (6 or more characters)</label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={password}
                      onChange={onChange}
                      required
                      minLength="6"
                      placeholder="Create a password"
                      className="form-control"
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="confirmPassword" className="form-label small fw-semibold">Confirm Password</label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={confirmPassword}
                      onChange={onChange}
                      required
                      minLength="6"
                      placeholder="Confirm your password"
                      className="form-control"
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-100 rounded-pill"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Creating account...' : 'Agree & Join'}
                  </button>
                </form>

                <div className="auth-footer text-center mt-4">
                  <p className="mb-0 small text-muted">Already have an account? <Link to="/login">Sign in</Link></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
