import { Link, useLocation } from "react-router-dom";
import "../styles/Navbar.css";
import { useState, useEffect } from "react";

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const isDashboard = location.pathname === '/dashboard';

  useEffect(() => {
    // Check if user is logged in by looking for the token
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    setIsLoggedIn(!!token);
    setUserRole(role);

    // Add event listener for storage changes
    const handleStorageChange = () => {
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('role');
      setIsLoggedIn(!!token);
      setUserRole(role);
    };

    window.addEventListener('storage', handleStorageChange);

    // Cleanup listener
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="logo">HireHub</Link>
      </div>
      
      {!isHomePage && !isDashboard && (
        <div className="navbar-center">
          <Link to="/jobPosting" className="nav-link">Post a Job</Link>
          <Link to="/jobListing" className="nav-link">Job Listings</Link>
        </div>
      )}

      {isDashboard && (
        <div className="navbar-center">
          {userRole === 'freelancer' ? (
            <Link to="/jobListing" className="nav-link">Job Listings</Link>
          ) : (
            <Link to="/jobPosting" className="nav-link">Post a Job</Link>
          )}
        </div>
      )}

      <div className="navbar-right">
        {isLoggedIn ? (
          <div className="auth-links">
            <Link to="/profile" className="nav-link">Profile</Link>
            <button 
              onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('role');
                setIsLoggedIn(false);
                window.location.href = '/';
              }} 
              className="logout-btn"
            >
              Logout
            </button>
          </div>
        ) : (
          <Link to="/login" className="login-btn">Login</Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
