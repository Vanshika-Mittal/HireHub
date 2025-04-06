import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import '../styles/ProjectApplication.css';

function ProjectApplication() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [application, setApplication] = useState({
    skills: [],
    bidAmount: '',
    message: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch project details
    const fetchProject = async () => {
      try {
        const response = await api.get(`/projects/${projectId}`);
        setProject(response.data);
      } catch (err) {
        setError('Failed to load project details');
      }
    };
    fetchProject();
  }, [projectId]);

  const handleSkillToggle = (skill) => {
    setApplication(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const freelancerId = localStorage.getItem('userId');
      const newApplication = {
        ...application,
        freelancerId,
        status: 'pending'
      };

      // Add application to project
      await api.patch(`/projects/${projectId}`, {
        applications: [...project.applications, newApplication]
      });

      navigate('/dashboard');
    } catch (err) {
      setError('Failed to submit application');
    }
  };

  if (!project) return <div>Loading...</div>;

  return (
    <div className="application-container">
      <div className="application-card">
        <h2>Apply for {project.title}</h2>
        {error && <p className="error-message">{error}</p>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <h3>Select Your Skills</h3>
            <div className="skills-container">
              {project.skills.map(skill => (
                <button
                  key={skill}
                  type="button"
                  className={`skill-tag ${application.skills.includes(skill) ? 'selected' : ''}`}
                  onClick={() => handleSkillToggle(skill)}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>

          <div className="form-section">
            <label>
              Your Bid Amount ($)
              <input
                type="number"
                value={application.bidAmount}
                onChange={(e) => setApplication(prev => ({ ...prev, bidAmount: e.target.value }))}
                min="0"
                required
              />
            </label>
          </div>

          <div className="form-section">
            <label>
              Additional Message
              <textarea
                value={application.message}
                onChange={(e) => setApplication(prev => ({ ...prev, message: e.target.value }))}
                placeholder="Tell the client why you're the best fit for this project"
              />
            </label>
          </div>

          <button type="submit" className="submit-btn">Submit Application</button>
        </form>
      </div>
    </div>
  );
}

export default ProjectApplication; 