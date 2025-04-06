import { Link } from 'react-router-dom';
import '../styles/FreelancerDashboard.css';

function FreelancerDashboard() {
  // Mock data - in real app, this would come from your backend
  const stats = {
    totalJobs: 12,
    activeJobs: 3,
    completedJobs: 9,
    earnings: 4500
  };

  const recentJobs = [
    {
      id: 1,
      title: 'Web Development Project',
      client: 'Tech Corp',
      status: 'In Progress',
      deadline: '2024-04-15'
    },
    {
      id: 2,
      title: 'Mobile App Design',
      client: 'Design Studio',
      status: 'Completed',
      deadline: '2024-03-20'
    },
    {
      id: 3,
      title: 'Content Writing',
      client: 'Marketing Agency',
      status: 'In Progress',
      deadline: '2024-04-10'
    }
  ];

  return (
    <div className="dashboard-container">
      <div className="welcome-section">
        <h1>Welcome back, Freelancer!</h1>
        <p>Here's what's happening with your freelance work</p>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h2>Overview</h2>
          <div className="stats-grid">
            <div className="stat-item">
              <h3>Total Jobs</h3>
              <p>{stats.totalJobs}</p>
            </div>
            <div className="stat-item">
              <h3>Active Jobs</h3>
              <p>{stats.activeJobs}</p>
            </div>
            <div className="stat-item">
              <h3>Completed</h3>
              <p>{stats.completedJobs}</p>
            </div>
            <div className="stat-item">
              <h3>Total Earnings</h3>
              <p>${stats.earnings}</p>
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <h2>Recent Jobs</h2>
          <div className="recent-jobs">
            {recentJobs.map(job => (
              <div key={job.id} className="job-item">
                <h3>{job.title}</h3>
                <p>Client: {job.client}</p>
                <p>Status: {job.status}</p>
                <p>Deadline: {job.deadline}</p>
              </div>
            ))}
          </div>
          <Link to="/jobListing" className="view-all-btn">View All Jobs</Link>
        </div>

        <div className="dashboard-card">
          <h2>Quick Actions</h2>
          <div className="quick-actions">
            <Link to="/jobListing" className="action-btn">Find Jobs</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FreelancerDashboard;