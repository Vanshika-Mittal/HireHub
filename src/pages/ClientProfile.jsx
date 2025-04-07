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
    company_name: "",
    company_size: "",
    industry: "",
    website: "",
    description: "",
  });

  useEffect(() => {
    // Simulate loading profile data
    setTimeout(() => {
      setFormData({
        name: "Jane Smith",
        email: "jane@example.com",
        company_name: "Tech Solutions Inc.",
        company_size: "50-100",
        industry: "Technology",
        website: "www.techsolutions.com",
        description: "A leading technology company specializing in software development and IT solutions",
      });
      setLoading(false);
    }, 1000);
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
    // In a real app, this would update the profile in the database
    setIsEditing(false);
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
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="company_name">Company Name</label>
            <input
              type="text"
              id="company_name"
              name="company_name"
              value={formData.company_name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="company_size">Company Size</label>
            <select
              id="company_size"
              name="company_size"
              value={formData.company_size}
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
              <p><strong>Company Name:</strong> {formData.company_name}</p>
              <p><strong>Company Size:</strong> {formData.company_size}</p>
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