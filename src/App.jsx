import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Joblisting from './pages/jobListing';
import JobPosting from './pages/jobPosting';
import Login from './pages/Login';
import Signup from './pages/Signup'; // Add this

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/jobPosting" element={<JobPosting />} />
        <Route path="/jobListing" element={<Joblisting />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} /> {/* Added Signup route */}
      </Routes>
    </Router>
  );
}

export default App;
