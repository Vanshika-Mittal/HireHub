import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import '../styles/jobListing.css';

const JobListing = () => {
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [availableSkills, setAvailableSkills] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      const { data, error } = await supabase
        .from('jobs')
        .select('*');

      if (error) {
        console.error('Error fetching jobs:', error.message);
      } else {
        setJobs(data);
        setFilteredJobs(data);

        // Extract unique skills from jobs
        const skills = [...new Set(data.flatMap(job => job.skills_required))];
        setAvailableSkills(skills);
      }
    };

    fetchJobs();
  }, []);

  useEffect(() => {
    let filtered = jobs;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(job => 
        job.project_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by selected skills
    if (selectedSkills.length > 0) {
      filtered = filtered.filter(job => 
        selectedSkills.every(skill => job.skills_required?.includes(skill) || false)
      );
    }

    setFilteredJobs(filtered);
  }, [searchTerm, selectedSkills, jobs]);

  const toggleSkill = (skill) => {
    setSelectedSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const handleApply = (projectId) => {
    navigate(`/job-application/${projectId}`);
  };

  return (
    <div className="job-listing-container">
      <div className="search-section">
        <input
          type="text"
          placeholder="Search jobs by title, description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="main-content">
        <div className="jobs-list">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <div key={job.project_id} className="job-card">
                <h2 className="job-title">{job.project_name}</h2>
                <p className="job-description">{job.description}</p>
                <div className="job-skills">
                  {job.skills_required?.map((skill) => (
                    <span key={skill} className="skill-tag">{skill}</span>
                  ))}
                </div>
                <p className="job-company">Client ID: {job.client_id}</p>
                <p className="job-location">Budget: ${job.budget}</p>
                <p className="job-status">Status: {job.status}</p>
                <p className="job-date">Posted on: {new Date(job.posted_date).toLocaleDateString()}</p>
                <button 
                  className="apply-button"
                  onClick={() => handleApply(job.project_id)}
                >
                  Apply Now
                </button>
              </div>
            ))
          ) : (
            <div className="no-jobs">
              <p>No jobs found matching your criteria.</p>
            </div>
          )}
        </div>

        <div className="filter-section">
          <h3>Filter by Skills</h3>
          <div className="skills-filter">
            {availableSkills.map((skill) => (
              <div
                key={skill}
                className={`skill-tag ${selectedSkills.includes(skill) ? 'selected' : ''}`}
                onClick={() => toggleSkill(skill)}
              >
                {skill}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobListing;
