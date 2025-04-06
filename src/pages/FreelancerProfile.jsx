import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/FreelancerProfile.css';
import { getUser } from '../utils/localStorage';

function FreelancerProfile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    location: "",
    age: "",
    basePayPerHour: "",
    description: "",
    skills: [],
  });
  const [skillsInput, setSkillsInput] = useState("");

  useEffect(() => {
    // Get user data from localStorage
    const user = getUser();
    const profile = localStorage.getItem('freelancerProfile');
    
    if (user) {
      setFormData(prev => ({
        ...prev,
        email: user.email
      }));
    }
    
    if (profile) {
      const profileData = JSON.parse(profile);
      setFormData(prev => ({
        ...prev,
        ...profileData
      }));
      // Set the skills input value
      setSkillsInput(profileData.skills.join(', '));
    }
    
    setLoading(false);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSkillsInputChange = (e) => {
    const value = e.target.value;
    setSkillsInput(value);
    
    // Update skills array whenever input changes
    const skills = value.split(',').map(skill => skill.trim()).filter(skill => skill);
    setFormData(prev => ({
      ...prev,
      skills
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      // Save profile to localStorage
      localStorage.setItem('freelancerProfile', JSON.stringify(formData));
      setIsEditing(false);
    } catch (error) {
      setError("Failed to save profile. Please try again.");
      console.error('Error saving profile:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading profile...</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>My Profile</h1>
        <div className="header-actions">
          <Link to="/dashboard" className="dashboard-btn">
            Return to Dashboard
          </Link>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="edit-btn"
          >
            {isEditing ? "Cancel" : "Edit Profile"}
          </button>
        </div>
      </div>

      {error && <div className="error">{error}</div>}

      {isEditing ? (
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <div className="email-field">
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                readOnly
                className="read-only"
              />
              <span className="email-note">Email cannot be changed as it's linked to your account</span>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="age">Age</label>
            <input
              type="number"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleInputChange}
              required
              min="18"
            />
          </div>

          <div className="form-group">
            <label htmlFor="basePayPerHour">Base Pay Per Hour ($)</label>
            <input
              type="number"
              id="basePayPerHour"
              name="basePayPerHour"
              value={formData.basePayPerHour}
              onChange={handleInputChange}
              required
              min="0"
              step="0.01"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="skills">Skills (comma-separated)</label>
            <input
              type="text"
              id="skills"
              name="skills"
              value={skillsInput}
              onChange={handleSkillsInputChange}
              placeholder="e.g., JavaScript, React, Node.js"
            />
            <div className="skills-preview">
              {formData.skills.map((skill, index) => (
                <span key={index} className="skill-tag">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="save-btn">
              Save Changes
            </button>
          </div>
        </form>
      ) : (
        <div className="profile-content">
          <div className="profile-info">
            <div className="info-group">
              <h3>Personal Information</h3>
              <p><strong>Name:</strong> {formData.name}</p>
              <p><strong>Email:</strong> {formData.email}</p>
              <p><strong>Location:</strong> {formData.location}</p>
              <p><strong>Age:</strong> {formData.age}</p>
              <p><strong>Base Pay Per Hour:</strong> ${formData.basePayPerHour}</p>
            </div>

            <div className="info-group">
              <h3>Description</h3>
              <p>{formData.description}</p>
            </div>

            <div className="info-group">
              <h3>Skills</h3>
              <div className="skills-list">
                {formData.skills.map((skill, index) => (
                  <span key={index} className="skill-tag">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FreelancerProfile;