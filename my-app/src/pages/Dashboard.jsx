import React from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import '../styles/Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  const user = supabase.auth.user();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

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
}

export default Dashboard; 