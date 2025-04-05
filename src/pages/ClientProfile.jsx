import { useState } from 'react';
import '../styles/ClientProfile.css';

function ClientProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "Tech Corp",
    email: "contact@techcorp.com",
    companyName: "Tech Corp",
    companySize: "50-200",
    industry: "Technology",
    website: "www.techcorp.com",
    description: "A leading technology company specializing in software development and digital solutions."
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
    setEditForm({
      ...editForm,
      [name]: value
    });
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <h1>{profile.companyName}</h1>
          <button onClick={handleEdit} className="edit-btn">Edit Profile</button>
        </div>

        {isEditing ? (
          <form className="edit-form" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
            <div className="profile-section">
              <h2>Company Information</h2>
              <div className="profile-info">
                <div className="info-item">
                  <h3>Company Name</h3>
                  <input
                    type="text"
                    name="companyName"
                    value={editForm.companyName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="info-item">
                  <h3>Company Size</h3>
                  <input
                    type="text"
                    name="companySize"
                    value={editForm.companySize}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="info-item">
                  <h3>Industry</h3>
                  <input
                    type="text"
                    name="industry"
                    value={editForm.industry}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="info-item">
                  <h3>Website</h3>
                  <input
                    type="url"
                    name="website"
                    value={editForm.website}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="profile-section">
              <h2>Contact Information</h2>
              <div className="profile-info">
                <div className="info-item">
                  <h3>Contact Person</h3>
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
              </div>
            </div>

            <div className="profile-section">
              <h2>Company Description</h2>
              <textarea
                name="description"
                value={editForm.description}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="save-btn">Save Changes</button>
          </form>
        ) : (
          <>
            <div className="profile-section">
              <h2>Company Information</h2>
              <div className="profile-info">
                <div className="info-item">
                  <h3>Company Name</h3>
                  <p>{profile.companyName}</p>
                </div>
                <div className="info-item">
                  <h3>Company Size</h3>
                  <p>{profile.companySize} employees</p>
                </div>
                <div className="info-item">
                  <h3>Industry</h3>
                  <p>{profile.industry}</p>
                </div>
                <div className="info-item">
                  <h3>Website</h3>
                  <p>{profile.website}</p>
                </div>
              </div>
            </div>

            <div className="profile-section">
              <h2>Contact Information</h2>
              <div className="profile-info">
                <div className="info-item">
                  <h3>Contact Person</h3>
                  <p>{profile.name}</p>
                </div>
                <div className="info-item">
                  <h3>Email</h3>
                  <p>{profile.email}</p>
                </div>
              </div>
            </div>

            <div className="profile-section">
              <h2>Company Description</h2>
              <p className="description">{profile.description}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ClientProfile; 