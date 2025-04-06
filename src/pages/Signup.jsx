import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "../styles/Auth.css";

function Signup({ setIsAuthenticated, setUserRole }) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "freelancer"
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // First check if user already exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('*')
        .eq('email', formData.email)
        .maybeSingle();

      if (existingUser) {
        throw new Error('Email already registered');
      }

      // Insert new user into users table
      const { data, error } = await supabase
        .from('users')
        .insert([{
          username: formData.username,
          email: formData.email,
          password: formData.password,
          role: formData.role
        }])
        .select()
        .single();

      if (error) {
        console.error('Signup error:', error);
        throw new Error('Signup failed. Please try again.');
      }

      // Set authentication state
      setIsAuthenticated(true);
      setUserRole(formData.role);

      // Store user data in localStorage
      localStorage.setItem('user', JSON.stringify({
        id: data.id,
        username: data.username,
        email: data.email,
        role: data.role
      }));

      // Navigate to dashboard
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Sign Up</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input 
            type="text" 
            name="username" 
            placeholder="Username" 
            onChange={handleChange} 
            value={formData.username}
            required 
          />
          <input 
            type="email" 
            name="email" 
            placeholder="Email" 
            onChange={handleChange} 
            value={formData.email}
            required 
          />
          <input 
            type="password" 
            name="password" 
            placeholder="Password" 
            onChange={handleChange} 
            value={formData.password}
            required 
          />
          <select 
            name="role" 
            onChange={handleChange} 
            value={formData.role}
            required
          >
            <option value="freelancer">Freelancer</option>
            <option value="client">Client</option>
          </select>
          <button type="submit" disabled={loading}>
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>
        <p>Already have an account? <a href="/login">Login</a></p>
      </div>
    </div>
  );
}

export default Signup;
