import { Link, useLocation } from "react-router-dom";
import "../styles/Navbar.css";
import { useState, useEffect } from "react";

function Navbar() {
  const [userRole, setUserRole] = useState(null);
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const isDashboard = location.pathname === '/dashboard';
  const isProfile = location.pathname === '/profile';

  useEffect(() => {
    // Get user role from localStorage
    const role = localStorage.getItem('role');
    setUserRole(role);

    // Add event listener for storage changes
    const handleStorageChange = () => {
      const role = localStorage.getItem('role');
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
        {isDashboard || isProfile ? (
          <div className="auth-links">
            <Link to="/profile" className="nav-link">Profile</Link>
            <button 
              onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('role');
                localStorage.removeItem('currentUser');
                window.location.href = '/';
              }} 
              className="logout-btn"
            >
              Logout
            </button>
          </div>
        ) : isHomePage ? (
          <Link to="/login" className="login-btn">Login</Link>
        ) : null}
      </div>
    </nav>
  );
}

export default Navbar;
