import React, { useEffect, useState } from 'react';
import MisconductForm from './MisconductForm';

const MisconductList = () => {
  const [misconducts, setMisconducts] = useState([]);
  const [selectedMisconductId, setSelectedMisconductId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchMisconducts();
  }, []);

  const fetchMisconducts = () => {
    fetch('/api/misconduct/all')
      .then(response => response.json())
      .then(data => {
        setMisconducts(data.misconducts);
      })
      .catch(error => console.error("Error fetching misconducts:", error));
  };

  const handleDelete = (id) => {
    fetch(`/api/misconduct/${id}`, { method: 'DELETE' })
      .then(() => {
        fetchMisconducts();
      })
      .catch(error => console.error("Error deleting misconduct:", error));
  };

  const handleMisconductUpdated = () => {
    fetchMisconducts();
  };

  return (
    <div>
      <h1>Misconduct Reports</h1>
      <button onClick={() => { setShowForm(true); setSelectedMisconductId(null); }}>Report New Misconduct</button>
      {showForm && (
        <MisconductForm 
          misconductId={selectedMisconductId} 
          onClose={() => setShowForm(false)} 
          onMisconductUpdated={handleMisconductUpdated} 
        />
      )}
      <ul>
        {misconducts.map(misconduct => (
          <li key={misconduct._id}>
            <h3>{misconduct.studentName} - {misconduct.examType}</h3>
            <p>Exam Date: {new Date(misconduct.examDate).toLocaleDateString()}</p>
            <p>Reason: {misconduct.reason}</p>
            <p>Reported By: {misconduct.reportedBy.name}</p>
            <button onClick={() => { setShowForm(true); setSelectedMisconductId(misconduct._id); }}>Edit</button>
            <button onClick={() => handleDelete(misconduct._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MisconductList; 