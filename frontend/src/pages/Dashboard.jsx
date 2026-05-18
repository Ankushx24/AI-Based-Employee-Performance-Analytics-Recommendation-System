import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import EmployeeForm from '../components/EmployeeForm';
import EmployeeList from '../components/EmployeeList';
import { Search } from 'lucide-react';

const Dashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [searchDept, setSearchDept] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchEmployees = async (dept = '') => {
    try {
      setLoading(true);
      const url = dept ? `/employees/search?department=${dept}` : '/employees';
      const res = await api.get(url);
      setEmployees(res.data);
    } catch (err) {
      console.error('Failed to fetch employees', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchEmployees(searchDept);
  };

  const handleClearSearch = () => {
    setSearchDept('');
    fetchEmployees('');
  };

  return (
    <div className="container mt-8" style={{ paddingBottom: '4rem' }}>
      <div className="flex justify-between items-center mb-6">
        <h1>HR Dashboard</h1>
      </div>

      <EmployeeForm onEmployeeAdded={() => fetchEmployees(searchDept)} />

      <div className="card mt-8" style={{ padding: '1.5rem 2rem' }}>
        <form onSubmit={handleSearch} className="flex gap-4 items-center">
          <div style={{ flex: 1, position: 'relative' }}>
            <Search size={20} className="text-secondary" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text" 
              className="form-input" 
              style={{ paddingLeft: '3rem' }} 
              placeholder="Search employees by department (e.g. Development)" 
              value={searchDept}
              onChange={(e) => setSearchDept(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary">Search</button>
          {searchDept && <button type="button" onClick={handleClearSearch} className="btn" style={{ border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>Clear</button>}
        </form>
      </div>

      {loading ? (
        <div className="text-center mt-8 text-secondary">Loading employees...</div>
      ) : (
        <EmployeeList employees={employees} fetchEmployees={() => fetchEmployees(searchDept)} />
      )}
    </div>
  );
};

export default Dashboard;
