// Server.js - Job Search API Backend
// Dieser Server stellt eine REST API für Job-Suche bereit
// Enthaltene Features:
//  - Health Check Endpoint für Deploy/Monitoring
//  - Abruf aller Jobs
//  - Abruf eines einzelnen Jobs per ID
//  - Bewerbung absenden (Mock / Logging)
//  - Filter nach Standort (city)
//  - Catch-All 404 Handler
// Hinweis: In echter Anwendung würden Jobs und Bewerbungen aus/in einer Datenbank kommen.

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8080; // Cloud Run nutzt PORT Umgebungsvariable

// Middleware Setup
app.use(cors()); // Erlaubt Frontend Zugriff von anderen Domains
app.use(express.json()); // Parse JSON Request Bodies

// Mock Job Data (In echter App: aus Datenbank)
const jobs = [
    {
        id: 1,
        title: 'Frontend Developer',
        company: 'Tech GmbH',
        location: 'Berlin',
        salary: '55.000-70.000€',
        description: 'React, TypeScript, CI/CD'
    },
    {
        id: 2,
        title: 'Backend Developer',
        company: 'StartupXYZ',
        location: 'München',
        salary: '60.000-75.000€',
        description: 'Node.js, Express, PostgreSQL'
    },
    {
        id: 3,
        title: 'DevOps Engineer',
        company: 'CloudCorp',
        location: 'Hamburg',
        salary: '65.000-85.000€',
        description: 'AWS, Docker, Kubernetes, CI/CD'
    },
    {
        id: 4,
        title: 'Full-Stack Developer',
        company: 'Digital AG',
        location: 'Frankfurt',
        salary: '58.000-72.000€',
        description: 'React, Node.js, MongoDB'
    }
];

// ENDPOINT 1: Health Check - prüft ob Server läuft
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString()
    });
});

// ENDPOINT 2: Alle Jobs holen - GET /api/jobs
app.get('/api/jobs', (req, res) => {
    res.json({
        success: true,
        data: jobs,
        count: jobs.length,
    });
});

// ENDPOINT 3: Einzelnen Job holen - GET /api/jobs/:id
app.get('/api/jobs/:id', (req, res) => {
    const job = jobs.find(foundID => foundID.id === parseInt(req.params.id));

    if (!job) {
        return res.status(404).json({
            success: false,
            message: 'No job found.'
        });
    }

    res.json({
        success: true,
        data: job
    });
});

// ENDPOINT 4: Jobs nach Standort filtern - GET /api/jobs/location/:city
app.get('/api/jobs/location/:city', (req, res) => {
    const city = req.params.city;
    const filteredJobs = jobs.filter(job =>
        job.location.toLowerCase() === city.toLowerCase()
    );

    if (filteredJobs.length === 0) {
        return res.status(404).json({
            success: false,
            message: 'No jobs found in this location'
        });
    }

    res.json({
        success: true,
        data: filteredJobs,
        count: filteredJobs.length
    });
});

// ENDPOINT 5: Bewerbung absenden - POST /api/apply
app.post('/api/apply', (req, res) => {
    const {jobId, name, email} = req.body;

    if (!jobId || !name || !email) {
        return res.status(400).json({
            success: false,
            message: 'Missing required fields: jobId, name, email'
        });
    }

    // In echter App: Speicherung in Datenbank
    console.log('Application received', {jobId, name, email});

    res.json({
        success: true,
        message: 'Application submitted successfully',
        data: {jobId, name, email}
    });
});

// 404 Handler - Für alle anderen nicht definierten Routen
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route Not Found',
    });
});

// Server starten - aber NICHT während Tests! (NODE_ENV === 'test')
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`App listening on port ${PORT}`);
    });
}


module.exports = app;