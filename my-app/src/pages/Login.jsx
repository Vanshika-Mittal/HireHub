import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "../styles/Auth.css";

function Login({ setIsAuthenticated, setUserRole }) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      try {
        const response = await api.post("/login/", {
          username: formData.email,  // Django expects username
          password: formData.password,
        });
        
        const { access, refresh } = response.data;
        localStorage.setItem("token", access);
        localStorage.setItem("refresh", refresh);
    
        // (optional) fetch user role/profile
        setIsAuthenticated(true);
        navigate("/dashboard");
      } catch (err) {
        setError("Login failed. Try again.");
      }
      
      const { data } = await api.get(`/users?email=${formData.email}&password=${formData.password}`);
      if (data.length > 0) {
        const user = data[0];
        localStorage.setItem("token", user.token);
        localStorage.setItem("role", user.role);
        setIsAuthenticated(true);
        setUserRole(user.role);

        // Check if user has a profile
        const profile = localStorage.getItem(`${user.role}Profile`);
        if (!profile) {
          // Create blank profile for new users
          const blankProfile = user.role === 'freelancer' ? {
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
          localStorage.setItem(`${user.role}Profile`, JSON.stringify(blankProfile));
        }
        navigate("/dashboard");
      } else {
        setError("Invalid email or password.");
      }
    } catch (err) {
      setError("Login failed. Try again.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Login</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
          <button type="submit">Login</button>
        </form>
        <p>Don't have an account? <a href="/signup">Sign Up</a></p>
      </div>
    </div>
  );
}

export default Login;
