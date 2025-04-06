import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/ClientDashboard.css';
import { getProjects, getApplications } from '../utils/localStorage';

function ClientDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [projects, setProjects] = useState([]);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get all projects created by the current user
        const userProjects = getProjects();
        setProjects(userProjects);

        // Get all applications to show application counts
        const allApplications = getApplications();
        setApplications(allApplications);

        setLoading(false);
      } catch (err) {
        setError('Failed to load projects');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getApplicationCount = (projectId) => {
    return applications.filter(app => app.projectId === projectId).length;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open':
        return 'text-green-600';
      case 'closed':
        return 'text-red-600';
      case 'in-progress':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  if (loading) {
    return <div className="loading">Loading projects...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>My Projects</h1>
        <div className="header-actions">
          <Link to="/profile" className="profile-btn">View Profile</Link>
          <Link to="/jobPosting" className="post-btn">Post New Job</Link>
        </div>
      </div>

      <div className="stats-container">
        <div className="stat-card">
          <h3>Total Projects</h3>
          <p>{projects.length}</p>
        </div>
        <div className="stat-card">
          <h3>Open Projects</h3>
          <p>{projects.filter(project => project.status === 'open').length}</p>
        </div>
        <div className="stat-card">
          <h3>In Progress</h3>
          <p>{projects.filter(project => project.status === 'in-progress').length}</p>
        </div>
        <div className="stat-card">
          <h3>Total Applications</h3>
          <p>{applications.length}</p>
        </div>
      </div>

      <div className="projects-container">
        <h2>Recent Projects</h2>
        {projects.length === 0 ? (
          <div className="no-projects">
            <p>You haven't posted any jobs yet.</p>
            <Link to="/jobPosting" className="post-btn">Post a Job</Link>
          </div>
        ) : (
          <div className="projects-grid">
            {projects.map((project) => (
              <div key={project.id} className="project-card">
                <div className="project-header">
                  <h3>{project.title}</h3>
                  <span className={`status-badge ${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                </div>
                <div className="project-details">
                  <p><strong>Budget:</strong> ${project.budget}</p>
                  <p><strong>Applications:</strong> {getApplicationCount(project.id)}</p>
                  <p><strong>Posted On:</strong> {new Date(project.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="project-actions">
                  <Link to={`/project/${project.id}`} className="view-btn">View Details</Link>
                  <Link to={`/project/${project.id}/applications`} className="applications-btn">
                    View Applications
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ClientDashboard;