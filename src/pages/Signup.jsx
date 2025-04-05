import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "../styles/Auth.css";

function Signup({ setIsAuthenticated, setUserRole }) {
  const [formData, setFormData] = useState({ username: "", email: "", password: "", role: "client" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/users", formData);
      if (response.status === 201) {
        // Set token and role
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("role", formData.role);
        setIsAuthenticated(true);
        setUserRole(formData.role);
        
        // Create blank profile for new users
        const blankProfile = formData.role === 'freelancer' ? {
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
        localStorage.setItem(`${formData.role}Profile`, JSON.stringify(blankProfile));
        
        // New user, redirect to questionnaire
        navigate("/dashboard");
      }
    } catch (err) {
      setError("Signup failed. Try again.");
    }
  };
  
  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Sign Up</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input type="text" name="username" placeholder="Username" onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
          <select name="role" onChange={handleChange}>
            <option value="client">Client</option>
            <option value="freelancer">Freelancer</option>
          </select>
          <button type="submit">Sign Up</button>
        </form>
        <p>Already have an account? <a href="/login">Login</a></p>
      </div>
    </div>
  );
}

export default Signup;
