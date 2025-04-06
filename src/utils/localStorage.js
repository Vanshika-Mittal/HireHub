// User operations
export const setUser = (userData) => {
  localStorage.setItem('user', JSON.stringify(userData));
};

export const getUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const removeUser = () => {
  localStorage.removeItem('user');
};

// Project operations
export const createProject = (projectData) => {
  const projects = JSON.parse(localStorage.getItem('projects') || '[]');
  const newProject = {
    id: Date.now().toString(),
    ...projectData,
    created_at: new Date().toISOString(),
    status: 'open'
  };
  projects.push(newProject);
  localStorage.setItem('projects', JSON.stringify(projects));
  return newProject;
};

export const getProjects = () => {
  return JSON.parse(localStorage.getItem('projects') || '[]');
};

export const getProjectById = (id) => {
  const projects = getProjects();
  return projects.find(project => project.id === id);
};

export const updateProject = (id, updates) => {
  const projects = getProjects();
  const index = projects.findIndex(project => project.id === id);
  if (index !== -1) {
    projects[index] = { ...projects[index], ...updates };
    localStorage.setItem('projects', JSON.stringify(projects));
    return projects[index];
  }
  return null;
};

// Application operations
export const createApplication = (applicationData) => {
  const applications = JSON.parse(localStorage.getItem('applications') || '[]');
  const newApplication = {
    id: Date.now().toString(),
    ...applicationData,
    created_at: new Date().toISOString(),
    status: 'pending'
  };
  applications.push(newApplication);
  localStorage.setItem('applications', JSON.stringify(applications));
  return newApplication;
};

export const getApplications = () => {
  return JSON.parse(localStorage.getItem('applications') || '[]');
};

export const getApplicationById = (id) => {
  const applications = getApplications();
  return applications.find(application => application.id === id);
};

export const updateApplication = (id, updates) => {
  const applications = getApplications();
  const index = applications.findIndex(application => application.id === id);
  if (index !== -1) {
    applications[index] = { ...applications[index], ...updates };
    localStorage.setItem('applications', JSON.stringify(applications));
    return applications[index];
  }
  return null;
};

// Initialize localStorage with sample data if empty
export const initializeLocalStorage = () => {
  if (!localStorage.getItem('projects')) {
    localStorage.setItem('projects', JSON.stringify([]));
  }
  if (!localStorage.getItem('applications')) {
    localStorage.setItem('applications', JSON.stringify([]));
  }
}; 