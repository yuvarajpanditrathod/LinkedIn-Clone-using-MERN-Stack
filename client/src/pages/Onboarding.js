import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import './Onboarding.css';
import { FaCheckCircle, FaCircle } from 'react-icons/fa';

const Onboarding = () => {
  const navigate = useNavigate();
  const { user, updateUser, token } = useContext(AuthContext);
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form data
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState([]);
  const [jobInterests, setJobInterests] = useState({
    'Full-time': false,
    'Part-time': false,
    'Contract': false,
    'Internship': false,
    'Remote': false,
    'On-site': false,
  });
  const [education, setEducation] = useState({
    school: '',
    degree: '',
    fieldOfStudy: '',
    startYear: '',
    endYear: '',
    description: ''
  });
  const [resume, setResume] = useState(null);

  const steps = [
    { number: 1, title: 'Skills', icon: '🎯' },
    { number: 2, title: 'Job Interests', icon: '💼' },
    { number: 3, title: 'Education', icon: '🎓' },
    { number: 4, title: 'Upload Resume', icon: '📄' }
  ];

  const handleAddSkill = (e) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      if (!skills.includes(skillInput.trim())) {
        setSkills([...skills, skillInput.trim()]);
      }
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const handleJobInterestChange = (interest) => {
    setJobInterests({
      ...jobInterests,
      [interest]: !jobInterests[interest]
    });
  };

  const handleEducationChange = (e) => {
    setEducation({
      ...education,
      [e.target.name]: e.target.value
    });
  };

  const handleResumeChange = (e) => {
    const file = e.target.files[0];
      if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // Resume too large — handle inline or inform user in UI
        console.error('Resume file size should be less than 5MB');
        return;
      }
      setResume(file);
    }
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit(true);
    }
  };

  const handleSubmit = async (skipResume = false) => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('skills', JSON.stringify(skills));
      
      const selectedJobInterests = Object.keys(jobInterests).filter(key => jobInterests[key]);
      formData.append('jobInterests', JSON.stringify(selectedJobInterests));
      
      if (education.school && education.degree) {
        formData.append('education', JSON.stringify([education]));
      }
      
      if (resume && !skipResume) {
        formData.append('resume', resume);
      }
      
      formData.append('onboardingComplete', 'true');

      const response = await axios.put('/api/users/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          // Include Authorization explicitly to avoid cases where defaults are not present/merged
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });

      updateUser(response.data.data);
      // Profile setup completed (notification suppressed)
      navigate('/feed');
    } catch (error) {
      console.error('Onboarding error:', error);
      // Error — suppressed toast
    } finally {
      setLoading(false);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return skills.length > 0;
      case 2:
        return Object.values(jobInterests).some(val => val);
      case 3:
        return education.school && education.degree;
      case 4:
        return true; // Resume is optional
      default:
        return false;
    }
  };

  return (
    <div className="onboarding-container">
      <div className="onboarding-card">
        <div className="onboarding-header">
          <h1>Welcome to LinkedIn, {user?.name?.split(' ')[0]}! 👋</h1>
          <p>Let's set up your profile to help you connect with opportunities</p>
        </div>

        {/* Progress Steps */}
        <div className="progress-steps">
          {steps.map((step) => (
            <div
              key={step.number}
              className={`step ${currentStep === step.number ? 'active' : ''} ${
                currentStep > step.number ? 'completed' : ''
              }`}
            >
              <div className="step-icon">
                {currentStep > step.number ? (
                  <FaCheckCircle />
                ) : (
                  <span className="step-number">{step.icon}</span>
                )}
              </div>
              <div className="step-title">{step.title}</div>
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="step-content">
          {currentStep === 1 && (
            <div className="step-section">
              <h2>What are your skills?</h2>
              <p className="step-description">
                Add skills that showcase your expertise (Press Enter to add)
              </p>
              <div className="skills-input-container">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyPress={handleAddSkill}
                  placeholder="e.g., JavaScript, Project Management, Marketing..."
                  className="skill-input"
                />
              </div>
              <div className="skills-list">
                {skills.map((skill, index) => (
                  <div key={index} className="skill-chip">
                    {skill}
                    <button
                      onClick={() => handleRemoveSkill(skill)}
                      className="remove-skill"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              {skills.length === 0 && (
                <p className="hint-text">Add at least one skill to continue</p>
              )}
            </div>
          )}

          {currentStep === 2 && (
            <div className="step-section">
              <h2>What type of work are you interested in?</h2>
              <p className="step-description">
                Select all that apply
              </p>
              <div className="job-interests-grid">
                {Object.keys(jobInterests).map((interest) => (
                  <label key={interest} className="job-interest-option">
                    <input
                      type="checkbox"
                      checked={jobInterests[interest]}
                      onChange={() => handleJobInterestChange(interest)}
                    />
                    <span className="checkbox-label">{interest}</span>
                  </label>
                ))}
              </div>
              {!Object.values(jobInterests).some(val => val) && (
                <p className="hint-text">Select at least one option to continue</p>
              )}
            </div>
          )}

          {currentStep === 3 && (
            <div className="step-section">
              <h2>Education</h2>
              <p className="step-description">
                Tell us about your most recent education
              </p>
              <div className="education-form">
                <div className="form-group">
                  <label>School/University *</label>
                  <input
                    type="text"
                    name="school"
                    value={education.school}
                    onChange={handleEducationChange}
                    placeholder="e.g., Harvard University"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Degree *</label>
                  <input
                    type="text"
                    name="degree"
                    value={education.degree}
                    onChange={handleEducationChange}
                    placeholder="e.g., Bachelor's Degree"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Field of Study</label>
                  <input
                    type="text"
                    name="fieldOfStudy"
                    value={education.fieldOfStudy}
                    onChange={handleEducationChange}
                    placeholder="e.g., Computer Science"
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Start Year</label>
                    <input
                      type="text"
                      name="startYear"
                      value={education.startYear}
                      onChange={handleEducationChange}
                      placeholder="e.g., 2018"
                    />
                  </div>
                  <div className="form-group">
                    <label>End Year</label>
                    <input
                      type="text"
                      name="endYear"
                      value={education.endYear}
                      onChange={handleEducationChange}
                      placeholder="e.g., 2022"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    name="description"
                    value={education.description}
                    onChange={handleEducationChange}
                    placeholder="Tell us about your studies..."
                    rows="3"
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="step-section">
              <h2>Upload Your Resume</h2>
              <p className="step-description">
                Help employers learn more about you (Optional - You can skip this)
              </p>
              <div className="resume-upload">
                <input
                  type="file"
                  id="resume"
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeChange}
                  style={{ display: 'none' }}
                />
                <label htmlFor="resume" className="resume-upload-label">
                  <div className="upload-icon">📄</div>
                  <div className="upload-text">
                    {resume ? (
                      <>
                        <strong>{resume.name}</strong>
                        <span>Click to change</span>
                      </>
                    ) : (
                      <>
                        <strong>Click to upload resume</strong>
                        <span>PDF, DOC, DOCX (Max 5MB)</span>
                      </>
                    )}
                  </div>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="onboarding-actions">
          <div className="left-actions">
            {currentStep > 1 && (
              <button onClick={handleBack} className="btn-back">
                Back
              </button>
            )}
          </div>
          <div className="right-actions">
            <button onClick={handleSkip} className="btn-skip">
              Skip
            </button>
            {currentStep < 4 ? (
              <button
                onClick={handleNext}
                className="btn-next"
                disabled={!isStepValid()}
              >
                Next
              </button>
            ) : (
              <button
                onClick={() => handleSubmit(false)}
                className="btn-finish"
                disabled={loading}
              >
                {loading ? 'Completing...' : 'Complete Setup'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
