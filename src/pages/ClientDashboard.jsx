import { Link } from 'react-router-dom';
import '../styles/ClientDashboard.css';

function ClientDashboard() {
  // Mock data - in real app, this would come from your backend
  const stats = {
    totalProjects: 8,
    activeProjects: 3,
    completedProjects: 5,
    totalSpent: 12000
  };

  const recentProjects = [
    {
      id: 1,
      title: 'Website Redesign',
      freelancer: 'Sarah Johnson',
      status: 'In Progress',
      budget: 2500
    },
    {
      id: 2,
      title: 'Mobile App Development',
      freelancer: 'Mike Chen',
      status: 'Completed',
      budget: 5000
    },
    {
      id: 3,
      title: 'Content Marketing',
      freelancer: 'Emily Davis',
      status: 'In Progress',
      budget: 1500
    }
  ];

  return (
    <div className="dashboard-container">
      <div className="welcome-section">
        <h1>Welcome back, Client!</h1>
        <p>Manage your projects and find new talent</p>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h2>Overview</h2>
          <div className="stats-grid">
            <div className="stat-item">
              <h3>Total Projects</h3>
              <p>{stats.totalProjects}</p>
            </div>
            <div className="stat-item">
              <h3>Active Projects</h3>
              <p>{stats.activeProjects}</p>
            </div>
            <div className="stat-item">
              <h3>Completed</h3>
              <p>{stats.completedProjects}</p>
            </div>
            <div className="stat-item">
              <h3>Total Spent</h3>
              <p>${stats.totalSpent}</p>
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <h2>Recent Projects</h2>
          <div className="recent-projects">
            {recentProjects.map(project => (
              <div key={project.id} className="project-item">
                <h3>{project.title}</h3>
                <p>Freelancer: {project.freelancer}</p>
                <p>Status: {project.status}</p>
                <p>Budget: ${project.budget}</p>
              </div>
            ))}
          </div>
          <Link to="/jobPosting" className="view-all-btn">Post New Project</Link>
        </div>

        <div className="dashboard-card">
          <h2>Quick Actions</h2>
          <div className="quick-actions">
            <Link to="/jobPosting" className="action-btn">Post New Job</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClientDashboard;