import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import '../styles/ProjectApplications.css';

function ProjectApplications() {
  const { projectId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [project, setProject] = useState(null);
  const [applications, setApplications] = useState([]);
  const [selectedFreelancer, setSelectedFreelancer] = useState(null);

  useEffect(() => {
    fetchProjectAndApplications();
  }, [projectId]);

  const fetchProjectAndApplications = async () => {
    try {
      setLoading(true);
      
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error('Please login to view applications');

      // Fetch project details
      const { data: projectData, error: projectError } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', projectId)
        .single();

      if (projectError) throw projectError;
      if (!projectData) throw new Error('Project not found');

      // Verify if current user is the project owner
      if (projectData.client_id !== user.id) {
        throw new Error('You are not authorized to view these applications');
      }

      setProject(projectData);

      // Fetch applications for this project
      const { data: applicationsData, error: applicationsError } = await supabase
        .from('applications')
        .select(`
          *,
          freelancer:freelancer_id (
            id,
            email,
            full_name,
            skills,
            experience
          )
        `)
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (applicationsError) throw applicationsError;
      setApplications(applicationsData || []);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectFreelancer = async (applicationId, freelancerId) => {
    try {
      setLoading(true);
      
      // Update application status to 'selected'
      const { error: updateError } = await supabase
        .from('applications')
        .update({ status: 'selected' })
        .eq('id', applicationId);

      if (updateError) throw updateError;

      // Update project status to 'in_progress' and set selected freelancer
      const { error: projectError } = await supabase
        .from('jobs')
        .update({ 
          status: 'in_progress',
          selected_freelancer_id: freelancerId
        })
        .eq('id', projectId);

      if (projectError) throw projectError;

      // Update other applications to 'rejected'
      const { error: rejectError } = await supabase
        .from('applications')
        .update({ status: 'rejected' })
        .eq('project_id', projectId)
        .neq('id', applicationId);

      if (rejectError) throw rejectError;

      setSelectedFreelancer(freelancerId);
      await fetchProjectAndApplications(); // Refresh the data
    } catch (err) {
      setError(err.message);
      console.error('Error selecting freelancer:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading applications...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="applications-container">
      <div className="applications-header">
        <h1>Applications for: {project?.title}</h1>
        <p className="project-status">Status: {project?.status}</p>
      </div>

      <div className="applications-grid">
        {applications.map((application) => (
          <div key={application.id} className="application-card">
            <div className="freelancer-info">
              <h3>{application.freelancer.full_name}</h3>
              <p className="email">{application.freelancer.email}</p>
              <div className="skills-list">
                {application.freelancer.skills?.map((skill, index) => (
                  <span key={index} className="skill-tag">{skill}</span>
                ))}
              </div>
              <p className="experience">Experience: {application.freelancer.experience}</p>
            </div>

            <div className="application-details">
              <p className="proposal">
                <strong>Cover Letter:</strong> {application.cover_letter}
              </p>
              <div className="proposal-details">
                <p><strong>Proposed Budget:</strong> ${application.proposed_budget}</p>
                <p><strong>Estimated Duration:</strong> {application.estimated_duration}</p>
              </div>
              <p className="status">Status: {application.status}</p>
            </div>

            {project.status === 'open' && application.status === 'pending' && (
              <button
                className="select-btn"
                onClick={() => handleSelectFreelancer(application.id, application.freelancer_id)}
                disabled={loading}
              >
                Select Freelancer
              </button>
            )}
          </div>
        ))}
      </div>

      {applications.length === 0 && (
        <p className="no-applications">No applications received yet.</p>
      )}
    </div>
  );
}

export default ProjectApplications; 