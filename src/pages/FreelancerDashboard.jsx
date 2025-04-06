import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/FreelancerDashboard.css';
import { getApplications, getProjects } from '../utils/localStorage';

function FreelancerDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applications, setApplications] = useState([]);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get all applications for the current user
        const userApplications = getApplications();
        setApplications(userApplications);

        // Get all projects to match with applications
        const allProjects = getProjects();
        setProjects(allProjects);

        setLoading(false);
      } catch (err) {
        setError('Failed to load applications');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getProjectById = (projectId) => {
    return projects.find(project => project.id === projectId);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600';
      case 'accepted':
        return 'text-green-600';
      case 'rejected':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  if (loading) {
    return <div className="loading">Loading applications...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>My Applications</h1>
        <div className="header-actions">
          <Link to="/profile" className="profile-btn">View Profile</Link>
          <Link to="/jobListing" className="job-btn">Browse Jobs</Link>
        </div>
      </div>

      <div className="stats-container">
        <div className="stat-card">
          <h3>Total Applications</h3>
          <p>{applications.length}</p>
        </div>
        <div className="stat-card">
          <h3>Active Applications</h3>
          <p>{applications.filter(app => app.status === 'pending').length}</p>
        </div>
        <div className="stat-card">
          <h3>Accepted Jobs</h3>
          <p>{applications.filter(app => app.status === 'accepted').length}</p>
        </div>
      </div>

      <div className="applications-container">
        <h2>Recent Applications</h2>
        {applications.length === 0 ? (
          <div className="no-applications">
            <p>You haven't applied to any jobs yet.</p>
            <Link to="/jobListing" className="browse-btn">Browse Jobs</Link>
          </div>
        ) : (
          <div className="applications-grid">
            {applications.map((application) => {
              const project = getProjectById(application.projectId);
              if (!project) return null;

              return (
                <div key={application.id} className="application-card">
                  <div className="application-header">
                    <h3>{project.title}</h3>
                    <span className={`status-badge ${getStatusColor(application.status)}`}>
                      {application.status}
                    </span>
                  </div>
                  <div className="application-details">
                    <p><strong>Client:</strong> {project.clientName}</p>
                    <p><strong>Budget:</strong> ${project.budget}</p>
                    <p><strong>Applied On:</strong> {new Date(application.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="application-actions">
                    <Link to={`/project/${project.id}`} className="view-btn">View Details</Link>
                    {application.status === 'pending' && (
                      <button className="withdraw-btn">Withdraw Application</button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default FreelancerDashboard;