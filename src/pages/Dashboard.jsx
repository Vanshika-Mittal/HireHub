import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [jobs, setJobs] = useState([]);
  const [recentlyApplied, setRecentlyApplied] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      // Get current user
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      if (!currentUser) {
        throw new Error('Please login to view jobs');
      }

      // Get jobs from localStorage
      const jobsData = JSON.parse(localStorage.getItem('jobs') || '[]');
      setJobs(jobsData);

      // Get applications from localStorage
      const applications = JSON.parse(localStorage.getItem('applications') || '[]');
      
      // Filter recently applied jobs (last 5 applications)
      const userApplications = applications
        .filter(app => app.freelancer_id === currentUser.id)
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 5);

      // Get job details for recently applied jobs
      const recentlyAppliedJobs = userApplications.map(app => {
        const job = jobsData.find(j => j.id === app.project_id);
        return {
          ...job,
          application_date: app.created_at,
          application_status: app.status
        };
      });

      setRecentlyApplied(recentlyAppliedJobs);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Welcome to Your Dashboard</h1>
        <p className="dashboard-subtitle">Manage your profile and explore opportunities</p>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-card">
          <h2 className="card-title">Your Profile</h2>
          <p className="card-description">
            Complete your profile to increase your visibility to potential clients or freelancers.
            Add your skills, experience, and portfolio to stand out.
          </p>
          <a href="/profile" className="card-button">View Profile</a>
        </div>

        <div className="dashboard-card">
          <h2 className="card-title">Browse Jobs</h2>
          <p className="card-description">
            Explore available projects and find opportunities that match your skills and interests.
            Filter by skills, budget, and more.
          </p>
          <a href="/jobs" className="card-button">Find Jobs</a>
        </div>

        <div className="dashboard-card">
          <h2 className="card-title">Your Applications</h2>
          <p className="card-description">
            Track the status of your job applications and manage your ongoing projects.
            Stay updated with client communications.
          </p>
          <a href="/applications" className="card-button">View Applications</a>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 