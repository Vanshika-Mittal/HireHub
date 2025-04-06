import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/ClientProfile.css';
import { getUser } from '../utils/localStorage';

function ClientProfile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    companyName: "",
    companySize: "",
    industry: "",
    website: "",
    description: "",
  });

  useEffect(() => {
    // Get user data from localStorage
    const user = getUser();
    const profile = localStorage.getItem('clientProfile');
    
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

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      // Save profile to localStorage
      localStorage.setItem('clientProfile', JSON.stringify(formData));
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
            <label htmlFor="companyName">Company Name</label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="companySize">Company Size</label>
            <select
              id="companySize"
              name="companySize"
              value={formData.companySize}
              onChange={handleInputChange}
              required
            >
              <option value="">Select company size</option>
              <option value="1-10">1-10 employees</option>
              <option value="11-50">11-50 employees</option>
              <option value="51-200">51-200 employees</option>
              <option value="201-500">201-500 employees</option>
              <option value="501+">501+ employees</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="industry">Industry</label>
            <input
              type="text"
              id="industry"
              name="industry"
              value={formData.industry}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="website">Website</label>
            <input
              type="url"
              id="website"
              name="website"
              value={formData.website}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Company Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
            />
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
            </div>

            <div className="info-group">
              <h3>Company Information</h3>
              <p><strong>Company Name:</strong> {formData.companyName}</p>
              <p><strong>Company Size:</strong> {formData.companySize}</p>
              <p><strong>Industry:</strong> {formData.industry}</p>
              <p><strong>Website:</strong> {formData.website}</p>
            </div>

            <div className="info-group">
              <h3>Description</h3>
              <p>{formData.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ClientProfile; 