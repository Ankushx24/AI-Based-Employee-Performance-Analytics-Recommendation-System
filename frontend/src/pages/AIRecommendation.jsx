import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Sparkles, Brain, Loader, TrendingUp, AlertTriangle, BookOpen, Award } from 'lucide-react';

const AIRecommendation = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [aiData, setAiData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await api.get('/employees');
      setEmployees(res.data);
    } catch (err) {
      console.error('Failed to fetch employees', err);
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === employees.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(employees.map(e => e._id));
    }
  };

  const generateInsights = async () => {
    if (selectedIds.length === 0) {
      setError('Please select at least one employee');
      return;
    }
    
    setLoading(true);
    setError('');
    setAiData(null);
    
    try {
      const res = await api.post('/ai/recommend', { employeeIds: selectedIds });
      setAiData(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate AI insights');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-8" style={{ paddingBottom: '4rem' }}>
      <div className="flex justify-between items-center mb-6">
        <h1><Sparkles className="text-primary inline mr-2" /> AI Employee Insights</h1>
        <button 
          onClick={generateInsights} 
          disabled={loading || selectedIds.length === 0} 
          className="btn btn-primary"
        >
          {loading ? <><Loader className="spin mr-2" size={18} /> Analyzing...</> : <><Brain className="mr-2" size={18} /> Generate Insights</>}
        </button>
      </div>

      {error && <div className="badge mb-4" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', borderColor: 'rgba(239, 68, 68, 0.2)', display: 'block', padding: '0.75rem' }}>{error}</div>}

      <div className="grid-cols-2" style={{ gridTemplateColumns: '1fr 2fr', alignItems: 'start' }}>
        {/* Left Column: Selection */}
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h3 style={{ margin: 0 }}>Select Employees</h3>
            <button onClick={handleSelectAll} className="text-primary text-sm" style={{ fontSize: '0.875rem' }}>
              {selectedIds.length === employees.length ? 'Deselect All' : 'Select All'}
            </button>
          </div>
          
          <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
            {employees.map(emp => (
              <div 
                key={emp._id} 
                onClick={() => toggleSelect(emp._id)}
                style={{ 
                  padding: '1rem', 
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                  cursor: 'pointer',
                  backgroundColor: selectedIds.includes(emp._id) ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                  borderLeft: selectedIds.includes(emp._id) ? '3px solid var(--primary-color)' : '3px solid transparent',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ fontWeight: '500' }}>{emp.name}</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{emp.department} • Score: {emp.performanceScore}</div>
              </div>
            ))}
            {employees.length === 0 && <div className="text-secondary p-4 text-center">No employees available.</div>}
          </div>
        </div>

        {/* Right Column: Results */}
        <div>
          {!aiData && !loading && (
            <div className="card text-center" style={{ padding: '4rem 2rem', border: '1px dashed var(--border-color)', background: 'transparent' }}>
              <Brain size={48} className="text-secondary mb-4 mx-auto" style={{ margin: '0 auto', opacity: 0.5 }} />
              <h3 className="text-secondary">AI Recommendations Panel</h3>
              <p className="text-secondary text-sm mt-2">Select employees from the list and generate AI insights to view promotion recommendations, feedback, and skill development plans.</p>
            </div>
          )}
          
          {loading && (
            <div className="card text-center" style={{ padding: '4rem 2rem' }}>
              <Loader size={48} className="text-primary mx-auto spin mb-4" style={{ margin: '0 auto', animation: 'spin 1s linear infinite' }} />
              <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
              <h3>Analyzing Performance Data</h3>
              <p className="text-secondary mt-2">Our AI is reviewing scores, experience, and skillsets...</p>
            </div>
          )}

          {aiData && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {aiData.ranking && aiData.ranking.length > 0 && (
                <div className="card" style={{ background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.9))', border: '1px solid rgba(255,215,0,0.2)' }}>
                  <h3 className="flex items-center gap-2 mb-4"><Award className="text-primary" /> Top Performers Ranking</h3>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {aiData.ranking.map((id, idx) => {
                      const emp = employees.find(e => e._id === id);
                      return emp ? (
                        <div key={id} className="badge" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', backgroundColor: idx === 0 ? 'rgba(255,215,0,0.1)' : 'rgba(255,255,255,0.05)', color: idx === 0 ? '#ffd700' : 'var(--text-primary)', border: idx === 0 ? '1px solid rgba(255,215,0,0.3)' : '1px solid var(--border-color)' }}>
                          #{idx + 1} {emp.name}
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>
              )}

              {aiData.recommendations && aiData.recommendations.map((rec, idx) => {
                const emp = employees.find(e => e._id === rec.employeeId) || { name: rec.name, performanceScore: 0 };
                
                let icon = <BookOpen size={24} className="text-primary" />;
                let gradient = 'rgba(59, 130, 246, 0.05)';
                
                if (emp.performanceScore >= 80) {
                  icon = <TrendingUp size={24} style={{ color: 'var(--success)' }} />;
                  gradient = 'rgba(16, 185, 129, 0.05)';
                } else if (emp.performanceScore < 60) {
                  icon = <AlertTriangle size={24} style={{ color: 'var(--danger)' }} />;
                  gradient = 'rgba(239, 68, 68, 0.05)';
                }

                return (
                  <div key={idx} className="card" style={{ borderLeft: `4px solid ${emp.performanceScore >= 80 ? 'var(--success)' : emp.performanceScore < 60 ? 'var(--danger)' : 'var(--primary-color)'}`, background: gradient }}>
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-3">
                        {icon}
                        <h3 style={{ margin: 0 }}>{rec.name}</h3>
                      </div>
                      <span className="badge">Score: {emp.performanceScore}</span>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="text-secondary text-sm mb-1 uppercase tracking-wider" style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>AI Feedback</h4>
                      <p style={{ lineHeight: '1.6' }}>{rec.feedback}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-secondary text-sm mb-1 uppercase tracking-wider" style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>Action Plan</h4>
                      <div style={{ padding: '1rem', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        {rec.actionPlan}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIRecommendation;
