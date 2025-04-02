import React, { useState } from 'react';
import axios from 'axios';

const jobs = [
  { id: 'TECH001', title: 'Senior Python Developer', company: 'TechCorp', location: 'Remote', skills: ['Python', 'Django', 'AWS'] },
  { id: 'TECH002', title: 'Frontend Engineer', company: 'WebWorks', location: 'New York', skills: ['React', 'TypeScript', 'Tailwind'] },
  { id: 'TECH003', title: 'DevOps Engineer', company: 'CloudSys', location: 'SF', skills: ['Docker', 'Kubernetes', 'CI/CD'] },
  { id: 'TECH004', title: 'Data Scientist', company: 'DataCore', location: 'Boston', skills: ['Python', 'ML', 'SQL'] },
  { id: 'TECH005', title: 'Full Stack Developer', company: 'AppBuilder', location: 'Remote', skills: ['Node.js', 'React', 'MongoDB'] },
  { id: 'TECH006', title: 'Mobile Developer', company: 'MobileTech', location: 'Chicago', skills: ['React Native', 'iOS', 'Android'] },
  { id: 'TECH007', title: 'QA Engineer', company: 'QualitySoft', location: 'Austin', skills: ['Selenium', 'Testing', 'Automation'] },
  { id: 'TECH008', title: 'UI/UX Designer', company: 'DesignPro', location: 'LA', skills: ['Figma', 'Adobe XD', 'UI Design'] },
  { id: 'TECH009', title: 'Backend Engineer', company: 'ServerSys', location: 'Seattle', skills: ['Java', 'Spring', 'MySQL'] },
  { id: 'TECH010', title: 'Security Analyst', company: 'SecureNet', location: 'Remote', skills: ['Cybersecurity', 'Penetration Testing'] },
];

function App() {
  const [selectedJob, setSelectedJob] = useState(null);
  const [showAdmin, setShowAdmin] = useState(false);
  const [applicants, setApplicants] = useState([]);
  const [formData, setFormData] = useState({ name: '', email: '', job_id: '', resume: null });

  const handleApply = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name);
    data.append('email', formData.email);
    data.append('job_id', formData.job_id);
    data.append('resume', formData.resume);

    try {
      await axios.post("http://localhost:8000/apply", data);
      alert('Application submitted successfully!');
      setSelectedJob(null);
      setFormData({ name: '', email: '', job_id: '', resume: null });
    } catch (error) {
      console.log('Error submitting application:', error);
    }
  };

  const fetchApplicants = async () => {
    const response = await axios.get("http://localhost:8000/applicants");
    setApplicants(response.data);
    setShowAdmin(true);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-4">
        <h1 className="text-2xl font-bold">Job Portal</h1>
        <button onClick={fetchApplicants} className="mt-2 bg-blue-800 px-4 py-2 rounded">Admin Panel</button>
      </header>

      {!showAdmin ? (
        <main className="container mx-auto p-4">
          {!selectedJob ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {jobs.map(job => (
                <div key={job.id} className="bg-white p-4 rounded shadow">
                  <h2 className="text-xl font-semibold">{job.title}</h2>
                  <p>{job.company} - {job.location}</p>
                  <p className="text-sm text-gray-600">Skills: {job.skills.join(', ')}</p>
                  <button
                    onClick={() => setSelectedJob(job)}
                    className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Apply Now
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <form onSubmit={handleApply} className="max-w-md mx-auto bg-white p-6 rounded shadow">
              <h2 className="text-xl font-semibold mb-4">Apply for {selectedJob.title}</h2>
              <input
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value, job_id: selectedJob.id })}
                className="w-full p-2 mb-4 border rounded"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-2 mb-4 border rounded"
                required
              />
              <input
                type="file"
                onChange={e => setFormData({ ...formData, resume: e.target.files[0] })}
                className="w-full p-2 mb-4"
                required
              />
              <div className="flex justify-between">
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                  Submit Application
                </button>
                <button
                  onClick={() => setSelectedJob(null)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </main>
      ) : (
        <div className="container mx-auto p-4">
          <h2 className="text-2xl font-bold mb-4">Applicants</h2>
          <table className="w-full bg-white shadow rounded">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-left">Email</th>
                <th className="p-2 text-left">Job ID</th>
                <th className="p-2 text-left">Resume</th>
              </tr>
            </thead>
            <tbody>
              {applicants.map(applicant => (
                <tr key={applicant.id} className="border-t">
                  <td className="p-2">{applicant.name}</td>
                  <td className="p-2">{applicant.email}</td>
                  <td className="p-2">{applicant.job_id}</td>
                  <td className="p-2">{applicant.resume_path}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            onClick={() => setShowAdmin(false)}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Back to Jobs
          </button>
        </div>
      )}
    </div>
  );
}

export default App;