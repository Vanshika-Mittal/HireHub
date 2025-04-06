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
    base_pay_per_hour: "",
    description: "",
    skills: [],
  });

  useEffect(() => {
    // Simulate loading profile data
    setTimeout(() => {
      setFormData({
        name: "John Doe",
        email: "john@example.com",
        location: "New York, USA",
        age: "28",
        base_pay_per_hour: "50",
        description: "Experienced web developer with 5 years of experience in React and Node.js",
        skills: ["React", "Node.js", "JavaScript", "HTML", "CSS"],
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
              disabled
            />
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
              min="18"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="base_pay_per_hour">Base Pay per Hour ($)</label>
            <input
              type="number"
              id="base_pay_per_hour"
              name="base_pay_per_hour"
              value={formData.base_pay_per_hour}
              onChange={handleInputChange}
              min="0"
              step="0.01"
              required
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
            <label>Skills</label>
            <div className="skills">
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
            </div>

            <div className="info-group">
              <h3>Professional Information</h3>
              <p><strong>Base Pay per Hour:</strong> ${formData.base_pay_per_hour}</p>
              <p><strong>Description:</strong></p>
              <p>{formData.description}</p>
            </div>

            <div className="info-group">
              <h3>Skills</h3>
              <div className="skills">
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