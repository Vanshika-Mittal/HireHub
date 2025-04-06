import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import JobListing from './pages/JobListing';
import JobPosting from './pages/JobPosting';
import Login from './pages/Login';
import Signup from './pages/Signup';
import FreelancerDashboard from './pages/FreelancerDashboard';
import ClientDashboard from './pages/ClientDashboard';
import Profile from './pages/Profile';
import FreelancerProfile from './pages/FreelancerProfile';
import ClientProfile from './pages/ClientProfile';
import ProfileQuestionnaire from './pages/ProfileQuestionnaire';
import ClientQuestionnaire from './pages/ClientQuestionnaire';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [isNewUser, setIsNewUser] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    if (token && role) {
      setIsAuthenticated(true);
      setUserRole(role);
      
      // Check if user has a profile
      const profile = localStorage.getItem(`${role}Profile`);
      if (profile) {
        const profileData = JSON.parse(profile);
        // Check if the profile is empty (all fields are empty)
        const isEmpty = Object.values(profileData).every(value => 
          value === "" || (Array.isArray(value) && value.length === 0)
        );
        setIsNewUser(isEmpty);
      } else {
        // Create blank profile for new users
        const blankProfile = role === 'freelancer' ? {
          name: "",
          email: "",
          location: "",
          age: "",
          basePayPerHour: "",
          description: "",
          skills: []
        } : {
          name: "",
          email: "",
          companyName: "",
          companySize: "",
          industry: "",
          website: "",
          description: ""
        };
        localStorage.setItem(`${role}Profile`, JSON.stringify(blankProfile));
        setIsNewUser(true);
      }
    } else {
      setIsAuthenticated(false);
      setUserRole(null);
      setIsNewUser(false);
    }
  }, []);

  return (
    <Router>
      <Navbar isAuthenticated={isAuthenticated} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/jobPosting" element={<JobPosting />} />
        <Route path="/jobListing" element={<JobListing />} />
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} setUserRole={setUserRole} />} />
        <Route path="/signup" element={<Signup setIsAuthenticated={setIsAuthenticated} setUserRole={setUserRole} />} />
        {isAuthenticated && (
          <>
            {isNewUser ? (
              <Route path="/dashboard" element={
                userRole === 'freelancer' ? 
                  <ProfileQuestionnaire setIsNewUser={setIsNewUser} /> : 
                  <ClientQuestionnaire setIsNewUser={setIsNewUser} />
              } />
            ) : (
              <Route path="/dashboard" element={userRole === 'freelancer' ? <FreelancerDashboard /> : <ClientDashboard />} />
            )}
            <Route path="/profile" element={userRole === 'freelancer' ? <FreelancerProfile /> : <ClientProfile />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;
