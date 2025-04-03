import { Link } from "react-router-dom";
import "../styles/Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <h1 className="logo">HireHub</h1>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/jobPosting">Post a Job</Link>
        <Link to="/jobListing">Job Listings</Link>
        <Link to="/login" className="login-btn">Login</Link>
      </div>
    </nav>
  );
}

export default Navbar;
