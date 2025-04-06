import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import '../styles/ProjectApplications.css';

function ProjectApplications() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        // Fetch job details
        const { data: jobData, error: jobError } = await supabase
          .from('jobs')
          .select('*')
          .eq('project_id', projectId)
          .single();

        if (jobError) throw jobError;
        if (!jobData) throw new Error('Job not found');
        if (jobData.client_id !== user.id) throw new Error('Unauthorized access');

        setJob(jobData);

        // Fetch applications
        const { data: applicationsData, error: applicationsError } = await supabase
          .from('applications')
          .select(`
            *,
            freelancer:freelancer_id (
              name,
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
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [projectId]);

  const handleApplicationSelect = (application) => {
    setSelectedApplication(application);
  };

  const handleStatusUpdate = async (applicationId, newStatus) => {
    try {
      const { error } = await supabase
        .from('applications')
        .update({ status: newStatus })
        .eq('id', applicationId);

      if (error) throw error;

      // Update local state
      setApplications(prev => prev.map(app => 
        app.id === applicationId ? { ...app, status: newStatus } : app
      ));

      // If accepting an application, update job status
      if (newStatus === 'accepted') {
        const { error: jobError } = await supabase
          .from('jobs')
          .update({ status: 'in_progress' })
          .eq('project_id', projectId);

        if (jobError) throw jobError;
        setJob(prev => ({ ...prev, status: 'in_progress' }));
      }
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="loading">Loading applications...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!job) return <div className="error">Job not found</div>;

  return (
    <div className="applications-container">
      <div className="job-header">
        <h1>{job.project_name}</h1>
        <p className="job-status">Status: <span className={`status ${job.status}`}>{job.status}</span></p>
      </div>

      <div className="applications-grid">
        {applications.length > 0 ? (
          applications.map(application => (
            <div 
              key={application.id} 
              className={`application-card ${selectedApplication?.id === application.id ? 'selected' : ''}`}
              onClick={() => handleApplicationSelect(application)}
            >
              <div className="freelancer-info">
                <h3>{application.freelancer.name}</h3>
                <p className="experience">{application.freelancer.experience} years of experience</p>
                <div className="skills">
                  {application.freelancer.skills?.map(skill => (
                    <span key={skill} className="skill-tag">{skill}</span>
                  ))}
                </div>
              </div>

              <div className="application-details">
                <p><strong>Bid Amount:</strong> ${application.bid_amount}</p>
                <p><strong>Estimated Time:</strong> {application.estimated_time} days</p>
                <p><strong>Status:</strong> <span className={`status ${application.status}`}>{application.status}</span></p>
                <p><strong>Applied:</strong> {new Date(application.created_at).toLocaleDateString()}</p>
              </div>

              <div className="cover-letter">
                <h4>Cover Letter</h4>
                <p>{application.cover_letter}</p>
              </div>

              {job.status === 'open' && (
                <div className="application-actions">
                  <button
                    className="accept-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStatusUpdate(application.id, 'accepted');
                    }}
                    disabled={application.status !== 'pending'}
                  >
                    Accept
                  </button>
                  <button
                    className="reject-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStatusUpdate(application.id, 'rejected');
                    }}
                    disabled={application.status !== 'pending'}
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="no-applications">No applications received yet.</p>
        )}
      </div>

      {selectedApplication && (
        <div className="application-detail-modal">
          <div className="modal-content">
            <h2>{selectedApplication.freelancer.name}'s Application</h2>
            <div className="detail-section">
              <h3>Freelancer Information</h3>
              <p><strong>Experience:</strong> {selectedApplication.freelancer.experience} years</p>
              <div className="skills">
                <strong>Skills:</strong>
                {selectedApplication.freelancer.skills?.map(skill => (
                  <span key={skill} className="skill-tag">{skill}</span>
                ))}
              </div>
            </div>
            <div className="detail-section">
              <h3>Application Details</h3>
              <p><strong>Bid Amount:</strong> ${selectedApplication.bid_amount}</p>
              <p><strong>Estimated Time:</strong> {selectedApplication.estimated_time} days</p>
              <p><strong>Status:</strong> <span className={`status ${selectedApplication.status}`}>{selectedApplication.status}</span></p>
              <p><strong>Applied:</strong> {new Date(selectedApplication.created_at).toLocaleDateString()}</p>
            </div>
            <div className="detail-section">
              <h3>Cover Letter</h3>
              <p>{selectedApplication.cover_letter}</p>
            </div>
            <button className="close-btn" onClick={() => setSelectedApplication(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectApplications; 