import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "../styles/Auth.css";

function Login({ setIsAuthenticated, setUserRole }) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      console.log("Attempting login with:", formData);

      // Query the users table with exact email and password match
      const { data: users, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('email', formData.email)
        .eq('password', formData.password)
        .single();

      console.log("User query result:", { users, userError });

      if (userError) {
        console.error("User query error:", userError);
        throw userError;
      }

      if (!users) {
        setError("Invalid email or password");
        return;
      }

      console.log("Login successful for user:", users);

      // Store user data in localStorage
      localStorage.setItem("user", JSON.stringify(users));
      localStorage.setItem("role", users.role);
      localStorage.setItem("token", users.token || "mock-token");
      setIsAuthenticated(true);
      setUserRole(users.role);

      // Check if user has a profile
      const profile = localStorage.getItem(`${users.role}Profile`);
      if (!profile) {
        // Set isNewUser flag to true
        localStorage.setItem("isNewUser", "true");
      }

      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Login</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input 
            type="email" 
            name="email" 
            placeholder="Email" 
            value={formData.email}
            onChange={handleChange} 
            required 
          />
          <input 
            type="password" 
            name="password" 
            placeholder="Password" 
            value={formData.password}
            onChange={handleChange} 
            required 
          />
          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p>Don't have an account? <a href="/signup">Sign Up</a></p>
      </div>
    </div>
  );
}

export default Login;
