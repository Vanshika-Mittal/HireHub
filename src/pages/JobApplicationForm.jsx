import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import '../styles/jobApplicationForm.css';

const JobApplicationForm = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [availableSkills, setAvailableSkills] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [formData, setFormData] = useState({
    cover_letter: '',
    proposed_budget: '',
    skills: []
  });

  useEffect(() => {
    const fetchProject = async () => {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('project_id', projectId)
        .single();

      if (error) {
        console.error('Error fetching project:', error);
      } else {
        setProject(data);
        // Extract unique skills from the project's required skills
        const skills = [...new Set(data.skills_required || [])];
        setAvailableSkills(skills);
      }
    };

    fetchProject();
  }, [projectId]);

  const handleSkillToggle = (skill) => {
    setSelectedSkills(prev => 
      prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const applicationData = {
      project_id: projectId,
      freelancer_id: 1, // Temporary hardcoded freelancer ID
      cover_letter: formData.cover_letter,
      proposed_budget: formData.proposed_budget,
      skills: selectedSkills,
      status: 'pending'
    };

    const { error } = await supabase
      .from('applications')
      .insert([applicationData]);

    if (error) {
      console.error('Error submitting application:', error);
      alert('Error submitting application. Please try again.');
    } else {
      alert('Application submitted successfully!');
      navigate('/job-listing');
    }
  };

  if (!project) {
    return <div className="loading">Loading project details...</div>;
  }

  return (
    <div className="application-form-container">
      <div className="project-details">
        <h2>{project.project_name}</h2>
        <p>{project.description}</p>
        <div className="project-info">
          <p><strong>Budget:</strong> ${project.budget}</p>
          <p><strong>Skills Required:</strong> {project.skills_required?.join(', ')}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="application-form">
        <div className="form-group">
          <label htmlFor="cover_letter">Cover Letter</label>
          <textarea
            id="cover_letter"
            value={formData.cover_letter}
            onChange={(e) => setFormData({ ...formData, cover_letter: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="proposed_budget">Proposed Budget ($)</label>
          <input
            type="number"
            id="proposed_budget"
            value={formData.proposed_budget}
            onChange={(e) => setFormData({ ...formData, proposed_budget: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Select Your Skills</label>
          <div className="skills-selection">
            {availableSkills.map((skill) => (
              <div
                key={skill}
                className={`skill-tag ${selectedSkills.includes(skill) ? 'selected' : ''}`}
                onClick={() => handleSkillToggle(skill)}
              >
                {skill}
              </div>
            ))}
          </div>
        </div>

        <button type="submit" className="submit-button">Submit Application</button>
      </form>
    </div>
  );
};

export default JobApplicationForm; 