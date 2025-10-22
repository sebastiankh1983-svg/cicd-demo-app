// App.jsx - Job Search Frontend
// Zeigt Jobs an und ermöglicht Bewerbungen
import {useState, useEffect} from "react";
import axios from "axios";
import "./App.css";

// API URL von Environment Variable oder localhost für Development
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

function App() {
    // State: Jobs, Ladezustand, Fehler, ausgewählter Job, Modal Sichtbarkeit, Formular-Daten
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedJob, setSelectedJob] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
    });

    // Initiales Laden der Jobs beim Mount
    useEffect(() => {
        fetchJobs();
    }, []);

    // Jobs von API laden
    const fetchJobs = async () => {
        try {
            setLoading(true);
            console.log('fetching from:', `${API_URL}/api/jobs`);
            const response = await axios.get(`${API_URL}/api/jobs`);
            console.log(response);
            setJobs(response.data.data);
            setError(null);
        } catch (err) {
            setError("Failed to load Jobs. Make sure the backend is running");
            console.error("error fetching jobs.", err);
            setJobs([]); // Fallback damit jobs.map nicht erneut kracht
        } finally {
            setLoading(false);
        }
    };

    // Bewerbung für einen Job starten (Modal öffnen)
    const handleApply = (job) => {
        setSelectedJob(job);
        setShowModal(true);
    };

    // Bewerbung absenden
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${API_URL}/api/apply`, {
                jobId: selectedJob.id,
                name: formData.name,
                email: formData.email,
            });
            if (response.data.success) {
                alert('Application submitted successfully!');
                setShowModal(false);
                setFormData({name: '', email: '',});
            }
        } catch (err) {
            alert("Failed to submit application. Please try again.");
            console.error("Error submitting application:", err);
        }
    };

    // Loading-Ansicht
    if (loading) {
        return <div className="animated fadeIn">Loading Job...</div>;
    }

    // Fehler-Ansicht
    if (error) {
        return <div className="animated fadeIn">Something went wrong. {error}</div>;
    }

    // Haupt-UI
    return (
        <div className="container">
            {/* Header */}
            <div className="header">
                <h1>🚀 Job Search Platform</h1>
                <p>Find your next tech job with CI/CD skills!</p>
            </div>

            {/* Statistiken */}
            <div className="stats">
                <h3>Available Positions: {jobs.length}</h3>
                <p>All jobs require modern DevOps skills</p>
            </div>

            {/* Jobs Grid */}
            <div className="jobs-grid">
                {jobs.map(job => (
                    <div key={job.id || job._id} className="job-card">
                        <h2 className="job-title">{job.title}</h2>
                        <div className="job-company">{job.company}</div>
                        <div className="job-info">
                            <span>📍 {job.location}</span>
                        </div>
                        <div className="job-salary">💰 {job.salary}</div>
                        <div className="job-description">{job.description}</div>
                        <button
                            className="apply-btn"
                            onClick={() => handleApply(job)}
                        >
                            Apply Now
                        </button>
                    </div>
                ))}
            </div>

            {/* Modal für Bewerbung */}
            {showModal && (
                <div className="modal" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2>Apply for {selectedJob.title}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Name:</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                />
                            </div>
                            <div className="form-group">
                                <label>Email:</label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                />
                            </div>
                            <div className="form-actions">
                                <button type="submit" className="btn btn-primary">
                                    Submit Application
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setShowModal(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;
