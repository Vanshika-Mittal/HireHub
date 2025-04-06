import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import '../styles/JobApplicationForm.css';

function JobApplicationForm() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
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
        setLoading(true);
        setError('');

        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;
        if (!user) throw new Error('Please login to apply for jobs');

        // Fetch project details
        const { data: projectData, error: projectError } = await supabase
          .from('jobs')
          .select('*')
          .eq('id', projectId)
          .single();

        if (projectError) throw projectError;
        if (!projectData) throw new Error('Project not found');

        setProject(projectData);
      } catch (err) {
        console.error('Error fetching project:', err);
        setError(err.message);
      } finally {
        setLoading(false);
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
      // Get current user from Supabase
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error('Please login to apply');

      // Check if user has already applied
      const { data: existingApplication, error: checkError } = await supabase
        .from('applications')
        .select('id')
        .eq('project_id', projectId)
        .eq('freelancer_id', user.id)
        .single();

      if (checkError && checkError.code !== 'PGRST116') throw checkError;
      if (existingApplication) throw new Error('You have already applied for this project');

      // Create new application
      const { error: insertError } = await supabase
        .from('applications')
        .insert([
          {
            project_id: projectId,
            freelancer_id: user.id,
            cover_letter: formData.cover_letter,
            proposed_budget: parseFloat(formData.proposed_budget),
            estimated_duration: formData.estimated_duration,
            status: 'pending',
          },
        ]);

      if (insertError) throw insertError;

      // Update job to mark as applied
      const { error: updateError } = await supabase
        .from('jobs')
        .update({ has_applied: true })
        .eq('id', projectId);

      if (updateError) throw updateError;

      // Redirect to dashboard
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
      console.error('Error submitting application:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading project details...</div>;
  }

  if (error) {
    return (
      <div className="application-container">
        <div className="error">{error}</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="application-container">
        <div className="error">Project not found</div>
      </div>
    );
  }

  return (
    <div className="application-container">
      <div className="application-card">
        <h1>Apply for Project: {project.title}</h1>
        {error && <div className="error">{error}</div>}
        
        <div className="project-details">
          <h2>Project Details</h2>
          <p><strong>Budget:</strong> ${project.budget}</p>
          <p><strong>Required Skills:</strong></p>
          <div className="skills-list">
            {project.required_skills?.map((skill) => (
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