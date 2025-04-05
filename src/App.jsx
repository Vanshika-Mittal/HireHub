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

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    setIsAuthenticated(!!token);
    setUserRole(role);
  }, []);

  return (
    <Router>
      <Navbar isAuthenticated={isAuthenticated} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/jobPosting" element={<JobPosting />} />
        <Route path="/jobListing" element={<JobListing />} />
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} setUserRole={setUserRole} />} />
        <Route path="/signup" element={<Signup />} />
        {isAuthenticated && (
          <>
            <Route path="/dashboard" element={userRole === 'freelancer' ? <FreelancerDashboard /> : <ClientDashboard />} />
            <Route path="/profile" element={userRole === 'freelancer' ? <FreelancerProfile /> : <ClientProfile />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;
