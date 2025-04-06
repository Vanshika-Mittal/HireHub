import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ProfileQuestionnaire.css';

function ProfileQuestionnaire({ setIsNewUser }) {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    location: "",
    age: "",
    basePayPerHour: "",
    profilePicture: null,
    description: "",
    skills: [],
    education: [],
    experience: [],
    certifications: [],
    languages: [],
    availability: "Full-time",
    portfolio: ""
  });

  const steps = [
    {
      title: "Profile Picture",
      fields: [
        {
          name: "profilePicture",
          type: "file",
          label: "Upload your profile picture",
          required: true
        }
      ]
    },
    {
      title: "Basic Information",
      fields: [
        {
          name: "name",
          type: "text",
          label: "What's your full name?",
          required: true
        },
        {
          name: "email",
          type: "email",
          label: "What's your email address?",
          required: true
        },
        {
          name: "location",
          type: "text",
          label: "Where are you located?",
          required: true
        },
        {
          name: "age",
          type: "number",
          label: "How old are you?",
          required: true
        }
      ]
    },
    {
      title: "Professional Details",
      fields: [
        {
          name: "basePayPerHour",
          type: "number",
          label: "What's your base pay per hour ($)?",
          required: true
        },
        {
          name: "availability",
          type: "select",
          label: "What's your availability?",
          options: ["Full-time", "Part-time", "Contract"],
          required: true
        },
        {
          name: "description",
          type: "textarea",
          label: "Tell us about yourself and your professional background",
          required: true
        }
      ]
    },
    {
      title: "Skills & Expertise",
      fields: [
        {
          name: "skills",
          type: "text",
          label: "What are your skills? (comma separated)",
          required: true
        },
        {
          name: "certifications",
          type: "text",
          label: "What certifications do you have? (comma separated)"
        },
        {
          name: "languages",
          type: "text",
          label: "What languages do you speak? (comma separated)"
        }
      ]
    },
    {
      title: "Education",
      fields: [
        {
          name: "education",
          type: "education",
          label: "Add your education details",
          fields: [
            { name: "degree", label: "Degree", required: true },
            { name: "university", label: "University", required: true },
            { name: "year", label: "Year", required: true }
          ]
        }
      ]
    },
    {
      title: "Experience",
      fields: [
        {
          name: "experience",
          type: "experience",
          label: "Add your work experience",
          fields: [
            { name: "position", label: "Position", required: true },
            { name: "company", label: "Company", required: true },
            { name: "duration", label: "Duration", required: true },
            { name: "description", label: "Description", required: true }
          ]
        }
      ]
    },
    {
      title: "Portfolio",
      fields: [
        {
          name: "portfolio",
          type: "url",
          label: "Share your portfolio URL (if any)"
        }
      ]
    }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'skills' || name === 'certifications' || name === 'languages') {
      setProfile({
        ...profile,
        [name]: value.split(',').map(item => item.trim())
      });
    } else if (name === 'profilePicture') {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setProfile({
            ...profile,
            profilePicture: reader.result
          });
        };
        reader.readAsDataURL(file);
      }
    } else {
      setProfile({
        ...profile,
        [name]: value
      });
    }
  };

  const handleEducationChange = (index, field, value) => {
    const updatedEducation = [...profile.education];
    if (!updatedEducation[index]) {
      updatedEducation[index] = { degree: "", university: "", year: "" };
    }
    updatedEducation[index][field] = value;
    setProfile({
      ...profile,
      education: updatedEducation
    });
  };

  const handleExperienceChange = (index, field, value) => {
    const updatedExperience = [...profile.experience];
    if (!updatedExperience[index]) {
      updatedExperience[index] = { position: "", company: "", duration: "", description: "" };
    }
    updatedExperience[index][field] = value;
    setProfile({
      ...profile,
      experience: updatedExperience
    });
  };

  const addEducation = () => {
    setProfile({
      ...profile,
      education: [...profile.education, { degree: "", university: "", year: "" }]
    });
  };

  const addExperience = () => {
    setProfile({
      ...profile,
      experience: [...profile.experience, { position: "", company: "", duration: "", description: "" }]
    });
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Save profile and redirect
      const userRole = localStorage.getItem('role');
      localStorage.setItem(`${userRole}Profile`, JSON.stringify(profile));
      setIsNewUser(false); // Update the new user status
      navigate('/dashboard');
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderField = (field) => {
    switch (field.type) {
      case 'file':
        return (
          <div className="field-group">
            <label>{field.label}</label>
            <div className="profile-picture-upload">
              {profile.profilePicture && (
                <img 
                  src={profile.profilePicture} 
                  alt="Profile Preview" 
                  className="profile-picture-preview"
                />
              )}
              <input
                type="file"
                name={field.name}
                accept="image/*"
                onChange={handleChange}
                required={field.required}
              />
            </div>
          </div>
        );
      case 'select':
        return (
          <div className="field-group">
            <label>{field.label}</label>
            <select
              name={field.name}
              value={profile[field.name]}
              onChange={handleChange}
              required={field.required}
            >
              {field.options.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        );
      case 'textarea':
        return (
          <div className="field-group">
            <label>{field.label}</label>
            <textarea
              name={field.name}
              value={profile[field.name]}
              onChange={handleChange}
              required={field.required}
            />
          </div>
        );
      case 'education':
        return (
          <div className="field-group">
            <label>{field.label}</label>
            {profile.education.map((edu, index) => (
              <div key={index} className="education-item">
                {field.fields.map(subField => (
                  <input
                    key={subField.name}
                    type="text"
                    value={edu[subField.name] || ""}
                    onChange={(e) => handleEducationChange(index, subField.name, e.target.value)}
                    placeholder={subField.label}
                    required={subField.required}
                  />
                ))}
              </div>
            ))}
            <button type="button" onClick={addEducation} className="add-btn">
              Add Education
            </button>
          </div>
        );
      case 'experience':
        return (
          <div className="field-group">
            <label>{field.label}</label>
            {profile.experience.map((exp, index) => (
              <div key={index} className="experience-item">
                {field.fields.map(subField => (
                  subField.name === 'description' ? (
                    <textarea
                      key={subField.name}
                      value={exp[subField.name] || ""}
                      onChange={(e) => handleExperienceChange(index, subField.name, e.target.value)}
                      placeholder={subField.label}
                      required={subField.required}
                    />
                  ) : (
                    <input
                      key={subField.name}
                      type="text"
                      value={exp[subField.name] || ""}
                      onChange={(e) => handleExperienceChange(index, subField.name, e.target.value)}
                      placeholder={subField.label}
                      required={subField.required}
                    />
                  )
                ))}
              </div>
            ))}
            <button type="button" onClick={addExperience} className="add-btn">
              Add Experience
            </button>
          </div>
        );
      default:
        return (
          <div className="field-group">
            <label>{field.label}</label>
            <input
              type={field.type}
              name={field.name}
              value={profile[field.name]}
              onChange={handleChange}
              required={field.required}
            />
          </div>
        );
    }
  };

  return (
    <div className="questionnaire-container">
      <div className="questionnaire-card">
        <div className="progress-bar">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`progress-step ${index <= currentStep ? 'active' : ''}`}
            />
          ))}
        </div>
        
        <div className="questionnaire-content">
          <h2>{steps[currentStep].title}</h2>
          <form onSubmit={(e) => { e.preventDefault(); handleNext(); }}>
            {steps[currentStep].fields.map((field, index) => (
              <div key={index}>
                {renderField(field)}
              </div>
            ))}
            
            <div className="navigation-buttons">
              {currentStep > 0 && (
                <button type="button" onClick={handleBack} className="back-btn">
                  Back
                </button>
              )}
              <button type="submit" className="next-btn">
                {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProfileQuestionnaire; 