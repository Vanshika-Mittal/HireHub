import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/FreelancerProfile.css';

function FreelancerProfile() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    location: "",
    age: "",
    basePayPerHour: "",
    description: "",
    skills: []
  });

  useEffect(() => {
    // Check if profile exists in localStorage
    const storedProfile = localStorage.getItem('freelancerProfile');
    if (storedProfile) {
      setProfile(JSON.parse(storedProfile));
    } else {
      // If no profile exists, redirect to questionnaire
      navigate('/dashboard');
    }
  }, [navigate]);

  const [editForm, setEditForm] = useState({ ...profile });

  const handleEdit = () => {
    setEditForm({ ...profile });
    setIsEditing(true);
  };

  const handleSave = () => {
    setProfile(editForm);
    localStorage.setItem('freelancerProfile', JSON.stringify(editForm));
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditForm({
      ...editForm,
      [name]: value
    });
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <h1>{profile.name || "Not set"}</h1>
          <button onClick={handleEdit} className="edit-btn">Edit Profile</button>
        </div>

        {isEditing ? (
          <form className="edit-form" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
            <div className="profile-section">
              <h2>Basic Information</h2>
              <div className="profile-info">
                <div className="info-item">
                  <h3>Name</h3>
                  <input
                    type="text"
                    name="name"
                    value={editForm.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="info-item">
                  <h3>Email</h3>
                  <input
                    type="email"
                    name="email"
                    value={editForm.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="info-item">
                  <h3>Location</h3>
                  <input
                    type="text"
                    name="location"
                    value={editForm.location}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="info-item">
                  <h3>Age</h3>
                  <input
                    type="number"
                    name="age"
                    value={editForm.age}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="info-item">
                  <h3>Base Pay Per Hour ($)</h3>
                  <input
                    type="number"
                    name="basePayPerHour"
                    value={editForm.basePayPerHour}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="profile-section">
              <h2>Professional Details</h2>
              <div className="profile-info">
                <div className="info-item">
                  <h3>Skills (comma separated)</h3>
                  <input
                    type="text"
                    name="skills"
                    value={editForm.skills.join(', ')}
                    onChange={(e) => {
                      const skills = e.target.value.split(',').map(skill => skill.trim());
                      setEditForm({ ...editForm, skills });
                    }}
                    required
                  />
                </div>
                <div className="info-item">
                  <h3>Description</h3>
                  <textarea
                    name="description"
                    value={editForm.description}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <button type="submit" className="save-btn">Save Changes</button>
          </form>
        ) : (
          <>
            <div className="profile-section">
              <h2>Basic Information</h2>
              <div className="profile-info">
                <div className="info-item">
                  <h3>Name</h3>
                  <p>{profile.name || "Not set"}</p>
                </div>
                <div className="info-item">
                  <h3>Email</h3>
                  <p>{profile.email || "Not set"}</p>
                </div>
                <div className="info-item">
                  <h3>Location</h3>
                  <p>{profile.location || "Not set"}</p>
                </div>
                <div className="info-item">
                  <h3>Age</h3>
                  <p>{profile.age || "Not set"}</p>
                </div>
                <div className="info-item">
                  <h3>Base Pay Per Hour</h3>
                  <p>${profile.basePayPerHour || "Not set"}</p>
                </div>
              </div>
            </div>

            <div className="profile-section">
              <h2>Professional Details</h2>
              <div className="profile-info">
                <div className="info-item">
                  <h3>Skills</h3>
                  <div className="skills-list">
                    {profile.skills && profile.skills.length > 0 ? (
                      profile.skills.map((skill, index) => (
                        <span key={index} className="skill-tag">{skill}</span>
                      ))
                    ) : (
                      <p>No skills added yet</p>
                    )}
                  </div>
                </div>
                <div className="info-item">
                  <h3>Description</h3>
                  <p className="description">{profile.description || "Not set"}</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default FreelancerProfile;