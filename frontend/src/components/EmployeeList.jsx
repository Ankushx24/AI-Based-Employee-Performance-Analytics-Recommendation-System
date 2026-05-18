import React from 'react';
import api from '../api/axios';
import { Trash2 } from 'lucide-react';

const EmployeeList = ({ employees, fetchEmployees }) => {
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await api.delete(`/employees/${id}`);
        fetchEmployees();
      } catch (err) {
        console.error('Failed to delete employee:', err);
      }
    }
  };

  return (
    <div className="card mt-8">
      <h3 className="mb-6">Employee Directory</h3>
      {employees.length === 0 ? (
        <p className="text-secondary text-center">No employees found.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '1rem' }}>Name</th>
                <th style={{ padding: '1rem' }}>Department</th>
                <th style={{ padding: '1rem' }}>Score</th>
                <th style={{ padding: '1rem' }}>Experience</th>
                <th style={{ padding: '1rem' }}>Skills</th>
                <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map(emp => (
                <tr key={emp._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontWeight: '500' }}>{emp.name}</div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{emp.email}</div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span className="badge">{emp.department}</span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ 
                      color: emp.performanceScore >= 80 ? 'var(--success)' : 
                             emp.performanceScore < 60 ? 'var(--danger)' : 'var(--text-primary)',
                      fontWeight: '600'
                    }}>
                      {emp.performanceScore}/100
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>{emp.experience} yrs</td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                      {emp.skills.slice(0, 3).map((skill, i) => (
                        <span key={i} className="badge" style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem', backgroundColor: 'rgba(255,255,255,0.1)', color: 'var(--text-secondary)', border: 'none' }}>
                          {skill}
                        </span>
                      ))}
                      {emp.skills.length > 3 && <span className="text-secondary" style={{ fontSize: '0.75rem' }}>+{emp.skills.length - 3}</span>}
                    </div>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <button onClick={() => handleDelete(emp._id)} className="btn btn-danger" style={{ padding: '0.4rem', borderRadius: '6px' }}>
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EmployeeList;
