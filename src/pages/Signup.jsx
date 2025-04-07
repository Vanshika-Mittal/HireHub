import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "../styles/Auth.css";

function Signup({ setIsAuthenticated, setUserRole }) {
  const [formData, setFormData] = useState({ username: "", email: "", password: "", role: "client" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Check if user already exists
      const { data: existingUser, error: checkError } = await supabase
        .from("users")
        .select("email")
        .eq("email", formData.email)
        .single();

      if (checkError && checkError.code !== "PGRST116") {
        throw checkError;
      }

      if (existingUser) {
        setError("Email already exists. Please use a different email.");
        return;
      }

      // Insert new user into the users table
      const { data: newUser, error: insertError } = await supabase
        .from("users")
        .insert([
          {
            username: formData.username,
            email: formData.email,
            password: formData.password,
            role: formData.role,
            created_at: new Date().toISOString()
          }
        ])
        .select()
        .single();

      if (insertError) {
        console.error("Error inserting user:", insertError);
        throw insertError;
      }

      if (newUser) {
        // Store user data in localStorage
        localStorage.setItem("currentUser", JSON.stringify(newUser));
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
        
        // Navigate to dashboard
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Signup error:", err);
      setError(err.message || "Signup failed. Try again.");
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
