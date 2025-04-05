import { useState } from 'react';
import '../styles/FreelancerProfile.css';

function FreelancerProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "John Smith",
    email: "john.smith@example.com",
    location: "San Francisco, CA",
    age: 28,
    basePayPerHour: 75,
    description: "Experienced full-stack developer with 5 years of experience in web development. Specialized in React, Node.js, and cloud technologies.",
    skills: ["React", "Node.js", "TypeScript", "AWS", "MongoDB", "Python", "Docker"]
  });

  const [editForm, setEditForm] = useState({ ...profile });

  const handleEdit = () => {
    setEditForm({ ...profile });
    setIsEditing(true);
  };

  const handleSave = () => {
    setProfile(editForm);
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'skills') {
      setEditForm({
        ...editForm,
        skills: value.split(',').map(skill => skill.trim())
      });
    } else {
      setEditForm({
        ...editForm,
        [name]: value
      });
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <h1>{profile.name}</h1>
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
              <h2>Profile Description</h2>
              <textarea
                name="description"
                value={editForm.description}
                onChange={handleChange}
                required
              />
            </div>

            <div className="profile-section">
              <h2>Skills</h2>
              <input
                type="text"
                name="skills"
                value={editForm.skills.join(', ')}
                onChange={handleChange}
                placeholder="Enter skills separated by commas"
                required
              />
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
                  <p>{profile.name}</p>
                </div>
                <div className="info-item">
                  <h3>Email</h3>
                  <p>{profile.email}</p>
                </div>
                <div className="info-item">
                  <h3>Location</h3>
                  <p>{profile.location}</p>
                </div>
                <div className="info-item">
                  <h3>Age</h3>
                  <p>{profile.age} years</p>
                </div>
                <div className="info-item">
                  <h3>Base Pay Per Hour</h3>
                  <p>${profile.basePayPerHour}/hour</p>
                </div>
              </div>
            </div>

            <div className="profile-section">
              <h2>Profile Description</h2>
              <p className="description">{profile.description}</p>
            </div>

            <div className="profile-section">
              <h2>Skills</h2>
              <div className="skills-container">
                {profile.skills.map((skill, index) => (
                  <span key={index} className="skill-tag">{skill}</span>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default FreelancerProfile; 