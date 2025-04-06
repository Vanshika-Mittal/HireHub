import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ProfileQuestionnaire.css';

function ClientQuestionnaire({ setIsNewUser }) {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    companyName: "",
    companySize: "",
    industry: "",
    website: "",
    description: ""
  });

  const steps = [
    {
      title: "Contact Information",
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
        }
      ]
    },
    {
      title: "Company Information",
      fields: [
        {
          name: "companyName",
          type: "text",
          label: "What's your company name?",
          required: true
        },
        {
          name: "companySize",
          type: "text",
          label: "What's your company size?",
          required: true
        },
        {
          name: "industry",
          type: "text",
          label: "What industry is your company in?",
          required: true
        },
        {
          name: "website",
          type: "url",
          label: "What's your company website?",
          required: true
        }
      ]
    },
    {
      title: "Company Description",
      fields: [
        {
          name: "description",
          type: "textarea",
          label: "Tell us about your company",
          required: true
        }
      ]
    }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({
      ...profile,
      [name]: value
    });
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Save profile and redirect
      localStorage.setItem('clientProfile', JSON.stringify(profile));
      setIsNewUser(false);
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

export default ClientQuestionnaire; 