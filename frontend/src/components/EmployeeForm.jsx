import React, { useState } from 'react';
import api from '../api/axios';
import { UserPlus } from 'lucide-react';

const EmployeeForm = ({ onEmployeeAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    skills: '',
    performanceScore: '',
    experience: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const payload = {
        ...formData,
        skills: formData.skills.split(',').map(s => s.trim()).filter(s => s),
        performanceScore: Number(formData.performanceScore),
        experience: Number(formData.experience)
      };
      
      const res = await api.post('/employees', payload);
      setSuccess(res.data.message);
      setFormData({ name: '', email: '', department: '', skills: '', performanceScore: '', experience: '' });
      if (onEmployeeAdded) onEmployeeAdded();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add employee');
    }
  };

  return (
    <div className="card">
      <div className="flex items-center gap-4 mb-6">
        <UserPlus className="text-primary" />
        <h3 style={{ margin: 0 }}>Add Employee</h3>
      </div>
      
      {error && <div className="badge mb-4" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', borderColor: 'rgba(239, 68, 68, 0.2)', display: 'block', padding: '0.5rem' }}>{error}</div>}
      {success && <div className="badge mb-4" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', borderColor: 'rgba(16, 185, 129, 0.2)', display: 'block', padding: '0.5rem' }}>{success}</div>}
      
      <form onSubmit={handleSubmit} className="grid-cols-2">
        <div className="form-group">
          <label className="form-label">Full Name</label>
          <input type="text" name="name" className="form-input" value={formData.name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input type="email" name="email" className="form-input" value={formData.email} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label className="form-label">Department</label>
          <input type="text" name="department" className="form-input" value={formData.department} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label className="form-label">Skills (comma separated)</label>
          <input type="text" name="skills" className="form-input" value={formData.skills} onChange={handleChange} placeholder="e.g. React, Node.js" />
        </div>
        <div className="form-group">
          <label className="form-label">Performance Score (0-100)</label>
          <input type="number" name="performanceScore" className="form-input" value={formData.performanceScore} onChange={handleChange} min="0" max="100" required />
        </div>
        <div className="form-group">
          <label className="form-label">Years of Experience</label>
          <input type="number" name="experience" className="form-input" value={formData.experience} onChange={handleChange} min="0" required />
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Save Employee</button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeForm;
