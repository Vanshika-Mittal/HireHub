import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import '../styles/JobApplicationForm.css';

function JobApplicationForm() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [project, setProject] = useState(null);
  const [formData, setFormData] = useState({
    cover_letter: '',
    proposed_budget: '',
    estimated_duration: '',
  });

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('id', projectId)
          .single();

        if (error) throw error;
        setProject(data);
      } catch (err) {
        setError('Failed to load project details');
      }
    };

    fetchProject();
  }, [projectId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Check if user has already applied
      const { data: existingApplication } = await supabase
        .from('applications')
        .select('id')
        .eq('project_id', projectId)
        .eq('freelancer_id', user.id)
        .single();

      if (existingApplication) {
        throw new Error('You have already applied for this project');
      }

      // Create application in database
      const { error } = await supabase.from('applications').insert([
        {
          project_id: projectId,
          freelancer_id: user.id,
          cover_letter: formData.cover_letter,
          proposed_budget: parseFloat(formData.proposed_budget),
          estimated_duration: formData.estimated_duration,
          status: 'pending',
        },
      ]);

      if (error) throw error;

      // Redirect to freelancer dashboard
      navigate('/freelancerDashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!project) {
    return <div className="loading">Loading project details...</div>;
  }

  return (
    <div className="application-container">
      <div className="application-card">
        <h1>Apply for Project: {project.title}</h1>
        {error && <div className="error">{error}</div>}
        
        <div className="project-details">
          <h2>Project Details</h2>
          <p><strong>Budget:</strong> ${project.budget}</p>
          <p><strong>Deadline:</strong> {new Date(project.deadline).toLocaleDateString()}</p>
          <p><strong>Required Skills:</strong></p>
          <div className="skills-list">
            {project.required_skills.map((skill) => (
              <span key={skill} className="skill-tag">
                {skill}
              </span>
            ))}
          </div>
          <p><strong>Description:</strong></p>
          <p>{project.description}</p>
        </div>

        <form onSubmit={handleSubmit} className="application-form">
          <div className="form-group">
            <label htmlFor="cover_letter">Cover Letter</label>
            <textarea
              id="cover_letter"
              name="cover_letter"
              value={formData.cover_letter}
              onChange={handleInputChange}
              required
              placeholder="Explain why you're the best fit for this project..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="proposed_budget">Proposed Budget ($)</label>
            <input
              type="number"
              id="proposed_budget"
              name="proposed_budget"
              value={formData.proposed_budget}
              onChange={handleInputChange}
              min="0"
              step="0.01"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="estimated_duration">Estimated Duration</label>
            <input
              type="text"
              id="estimated_duration"
              name="estimated_duration"
              value={formData.estimated_duration}
              onChange={handleInputChange}
              required
              placeholder="e.g., 2 weeks, 1 month"
            />
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Submitting Application...' : 'Submit Application'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default JobApplicationForm; 